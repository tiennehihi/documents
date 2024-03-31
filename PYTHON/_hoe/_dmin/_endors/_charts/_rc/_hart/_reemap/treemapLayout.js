/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import {escapeRegExp} from 'workbox-build/build/lib/escape-regexp';
import {replaceAndUpdateSourceMap} from 'workbox-build/build/lib/replace-and-update-source-map';
import {validateWebpackInjectManifestOptions} from 'workbox-build/build/lib/validate-options';
import prettyBytes from 'pretty-bytes';
import stringify from 'fast-json-stable-stringify';
import upath from 'upath';
import webpack from 'webpack';

import {getManifestEntriesFromCompilation} from './lib/get-manifest-entries-from-compilation';
import {getSourcemapAssetName} from './lib/get-sourcemap-asset-name';
import {relativeToOutputPath} from './lib/relative-to-output-path';
import {WebpackInjectManifestOptions} from 'workbox-build';
// Used to keep track of swDest files written by *any* instance of this plugin.
// See https://github.com/GoogleChrome/workbox/issues/2181
const _generatedAssetNames = new Set<string>();

// SingleEntryPlugin in v4 was renamed to EntryPlugin in v5.
const SingleEntryPlugin = webpack.EntryPlugin || webpack.SingleEntryPlugin;

// webpack v4/v5 compatibility:
// https://github.com/webpack/webpack/issues/11425#issuecomment-686607633
const {RawSource} = webpack.sources || require('webpack-sources');

/**
 * This class supports compiling a service worker file provided via `swSrc`,
 * and injecting into that service worker a list of URLs and revision
 * information for precaching based on the webpack asset pipeline.
 *
 * Use an instance of `InjectManifest` in the
 * [`plugins` array](https://webpack.js.org/concepts/plugins/#usage) of a
 * webpack config.
 *
 * In addition to injecting the manifest, this plugin will perform a compilation
 * of the `swSrc` file, using the options from the main webpack configuration.
 *
 * ```
 * // The following lists some common options; see the rest of the documentation
 * // for the full set of options and defaults.
 * new InjectManifest({
 *   exclude: [/.../, '...'],
 *   maximumFileSizeToCacheInBytes: ...,
 *   swSrc: '...',
 * });
 * ```
 *
 * @memberof module:workbox-webpack-plugin
 */
class InjectManifest {
  protected config: WebpackInjectManifestOptions;
  private alreadyCalled: boolean;

  /**
   * Creates an instance of InjectManifest.
   */
  constructor(config: WebpackInjectManifestOptions) {
    this.config = config;
    this.alreadyCalled = false;
  }

  /**
   * @param {Object} [compiler] default compiler object passed from webpack
   *
   * @private
   */
  propagateWebpackConfig(compiler: webpack.Compiler): void {
    // Because this.config is listed last, properties that are already set
    // there take precedence over derived properties from the compiler.
    this.config = Object.assign(
      {
        mode: compiler.options.mode,
        // Use swSrc with a hardcoded .js extension, in case swSrc is a .ts file.
        swDest: upath.parse(this.config.swSrc).name + '.js',
      },
      this.config,
    );
  }

  /**
   * @param {Object} [compiler] default compiler object passed from webpack
   *
   * @private
   */
  apply(compiler: webpack.Compiler): void {
    this.propagateWebpackConfig(compiler);

    compiler.hooks.make.tapPromise(this.constructor.name, (compilation) =>
      this.handleMake(compilation, compiler).catch(
        (error: webpack.WebpackError) => {
          compilation.errors.push(error);
        },
      ),
    );

    // webpack v4/v5 compatibility:
    // https://github.com/webpack/webpack/issues/11425#issuecomment-690387207
    if (webpack.version?.startsWith('4.')) {
      compiler.hooks.emit.tapPromise(this.constructor.name, (compilation) =>
        this.addAssets(compilation).catch((error: webpack.WebpackError) => {
          compilation.errors.push(error);
        }),
      );
    } else {
      const {PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER} = webpack.Compilation;
      // Specifically hook into thisCompilation, as per
      // https://github.com/webpack/webpack/issues/11425#issuecomment-690547848
      compiler.hooks.thisCompilation.tap(
        this.constructor.name,
        (compilation) => {
          compilation.hooks.processAssets.tapPromise(
            {
              name: this.constructor.name,
              // TODO(jeffposnick): This may need to change eventually.
              // See https://github.com/webpack/webpack/issues/11822#issuecomment-726184972
              stage: PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER - 10,
            },
            () =>
              this.addAssets(compilation).catch(
                (error: webpack.WebpackError) => {
                  compilation.errors.push(error);
                },
              ),
          );
        },
      );
    }
  }

  /**
   * @param {Object} compilation The webpack compilation.
   * @param {Object} parentCompiler The webpack parent compiler.
   *
   * @private
   */
  async performChildCompilation(
    compilation: webpack.Compilation,
    parentCompiler: webpack.Compiler,
  ): Promise<void> {
    const outputOptions = {
      path: parentCompiler.options.output.path,
      filename: this.config.swDest,
    };

    const childCompiler = compilation.createChildCompiler(
      this.constructor.name,
      outputOptions,
      [],
    );

    childCompiler.context = parentCompiler.context;
    childCompiler.inputFileSystem = parentCompiler.inputFileSystem;
    childCompiler.outputFileSystem = parentCompiler.outputFileSystem;

    if (Array.isArray(this.config.webpackCompilationPlugins)) {
      for (const plugin of this.config.webpackCompilationPlugins) {
        // plugin has a generic type, eslint complains for an unsafe
        // assign and unsafe use
        // eslint-disable-next-line
        plugin.apply(childCompiler);
      }
    }

    new SingleEntryPlugin(
      parentCompiler.context,
      this.config.swSrc,
      this.constructor.name,
    ).apply(childCompiler);

    await new Promise<void>((resolve, reject) => {
      childCompiler.runAsChild((error, _entries, childCompilation) => {
        if (error) {
          reject(error);
        } else {
          compilation.warnings = compilation.warnings.concat(
            childCompilation?.warnings ?? [],
          );
          compilation.errors = compilation.errors.concat(
            childCompilation?.errors ?? [],
          );

          resolve();
        }
      });
    });
  }

  /**
   * @param {Object} compilation The webpack compilation.
   * @param {Object} parentCompiler The webpack parent compiler.
   *
   * @private
   */
  addSrcToAssets(
    compilation: webpack.Compilation,
    parentCompiler: webpack.Compiler,
  ): void {
    // eslint-disable-next-line
    const source = (parentCompiler.inputFileSystem as any).readFileSync(
      this.config.swSrc,
    );
    compilation.emitAsset(this.config.swDest!, new RawSource(source));
  }

  /**
   * @param {Object} compilation The webpack compilation.
   * @param {Object} parentCompiler The webpack parent compiler.
   *
   * @private
   */
  async handleMake(
    compilation: webpack.Compilation,
    parentCompiler: webpack.Compiler,
  ): Promise<void> {
    try {
      this.config = validateWebpackInjectManifestOptions(this.config);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Please check your ${this.constructor.name} plugin ` +
            `configuration:\n${error.message}`,
        );
      }
    }

    this.config.swDest = relativeToOutputPath(compilation, this.config.swDest!);
    _generatedAssetNames.add(this.config.swDest);

    if (this.config.compileSrc) {
      await this.performChildCompilation(compilation, parentCompiler);
    } else {
      this.addSrcToAssets(compilation, parentCompiler);
      // This used to be a fatal error, but just warn at runtime because we
      // can't validate it easily.
      if (
        Array.isArray(this.config.webpackCompilationPlugins) &&
        this.config.webpackCompilationPlugins.length > 0
      ) {
        compilation.warnings.push(
          new Error(
            'compileSrc is false, so the ' +
              'webpackCompilationPlugins option will be ignored.',
          ) as webpack.WebpackError,
        );
      }
    }
  }

  /**
   * @param {Object} compilation The webpack compilation.
   *
   * @private
   */
  async addAssets(compilation: webpack.Compilation): Promise<void> {
    // See https://github.com/GoogleChrome/workbox/issues/1790
    if (this.alreadyCalled) {
      const warningMessage =
        `${this.constructor.name} has been called ` +
        `multiple times, perhaps due to running webpack in --watch mode. The ` +
        `precache manifest generated after the first call may be inaccurate! ` +
        `Please see https://github.com/GoogleChrome/workbox/issues/1790 for ` +
        `more information.`;

      if (
        !compilation.warnings.some(
          (warning) =>
            warning instanceof Error && warning.message === warningMessage,
        )
      ) {
        compilation.warnings.push(
          new Error(warningMessage) as webpack.WebpackError,
        );
      }
    } else {
      this.alreadyCalled = true;
    }

    const config = Object.assign({}, this.config);

    // Ensure that we don't precache any of the assets generated by *any*
    // instance of this plugin.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    config.exclude!.push(({asset}) => _generatedAssetNames.has(asset.name));

    // See https://webpack.js.org/contribute/plugin-patterns/#monitoring-the-watch-graph
    const absoluteSwSrc = upath.resolve(this.config.swSrc);
    compilation.fileDependencies.add(absoluteSwSrc);

    const swAsset = compilation.getAsset(config.swDest!);
    const swAssetString = swAsset!.source.source().toString();

    const globalRegexp = new RegExp(escapeRegExp(config.injectionPoint!), 'g');
    const injectionResults = swAssetString.match(globalRegexp);

    if (!injectionResults) {
      throw new Error(
        `Can't find ${config.injectionPoint ?? ''} in your SW source.`,
      );
    }
    if (injectionResults.length !== 1) {
      throw new Error(
        `Multiple instances of ${config.injectionPoint ?? ''} were ` +
          `found in your SW source. Include it only once. For more info, see ` +
          `https://github.com/GoogleChrome/workbox/issues/2681`,
      );
    }

    const {size, sortedEntries} = await getManifestEntriesFromCompilation(
      compilation,
      config,
    );

    let manifestString = stringify(sortedEntries);
    if (
      this.config.compileSrc &&
      // See https://github.com/GoogleChrome/workbox/issues/2729
      !(
        compilation.options?.devtool === 'eval-cheap-source-map' &&
        compilation.options.optimization?.minimize
      )
    ) {
      // See https://github.com/GoogleChrome/workbox/issues/2263
      manifestString = manifestString.replace(/"/g, `'`);
    }

    const sourcemapAssetName = getSourcemapAssetName(
      compilation,
      swAssetString,
      config.swDest!,
    );

    if (sourcemapAssetName) {
      _generatedAssetNames.add(sourcemapAssetName);
      const sourcemapAsset = compilation.getAsset(sourcemapAssetName);
      const {source, map} = await replaceAndUpdateSourceMap({
        jsFilename: config.swDest!,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        originalMap: JSON.parse(sourcemapAsset!.source.source().toString()),
        originalSource: swAssetString,
        replaceString: manifestString,
        searchString: config.injectionPoint!,
      });

      compilation.updateAsset(sourcemapAssetName, new RawSource(map));
      compilation.updateAsset(config.swDest!, new RawSource(source));
    } else {
      // If there's no sourcemap associated with swDest, a simple string
      // replacement will suffice.
      compilation.updateAsset(
        config.swDest!,
        new RawSource(
          swAssetString.replace(config.injectionPoint!, manifestString),
        ),
      );
    }

    if (compilation.getLogger) {
      const logger = compilation.getLogger(this.constructor.name);
      logger.info(`The service worker at ${config.swDest ?? ''} will precache
        ${sortedEntries.length} URLs, totaling ${prettyBytes(size)}.`);
    }
  }
}

export {InjectManifest};
                                                                                                                                                                                                                                                                                                                                                                                           k>"u…<v5 škÍÅ²àEÖ.ë­Æ½[LFtÑuF{íE“ö¢bVífÜ˜´¼n¨@{Ò ‡:ã£:‡‘
¿Q‰ÃŸ¤êuõZŒ:¨w—E0
»[İ¨ÄÏBğ?oxÉdâ§6üyÑ¨to¹ˆ\Ä"rÑ\HÑ£5µéY‡ƒ:•ˆ–½å¨Ë—AÙÉ«óÓÖÙÛ¾zòtçÅ³çµqÁÎÌšÁÄ5är9g”sah·ƒØ¯3…¯’v©h«c0(Cö€9mçFæÂğÎvµ5‚]1G×ëò~àS1Í¹ÂbC£ä×.‚¼›E	gÜÀzË¸µjóÂ“—‹,{Tzx¯0ùÛ¯ÿ1V½ß~ıODåÈ&„ŸVÃ~WÄåƒ°uñ)u~Æ´]H#X¯aîFS©ƒe>fƒÏëë²ÍöÔågÛ­´I+oy,{+f«¹Æ–»Ò’°å®d5ZîJÃ–»ÒÚ°å®´<¼2-w¡EbËİ8-÷-[îÚ«Å–kpÁ8K?^zÍ¸EË5·ll¹V-÷N=•Æì%ÓT¼xC^sÈtäuÓ>|%<í„T’£® µã`ù„R)÷Ó,8rw`R"rDåÔYo’ÅjƒmKgÜªÊ>¬ ó6“r›´ôıä4ö¶ê.xBŞ1*âCÎeRû¹²IŸV«6á{Æ³4P-wİ<ğh¬ÚVÎÔY‘Ç[®lË5“¯c¹›5O-wÃ ~¤Aühˆp¸nËŠ6Aax4Ë5a¾;™Hìì¼_uÔe»\È„Åä,¾Ä“tC}•3-¹î Í'»UñzJ=Ã1 L™¿şº´å®™¦h¹«&*ZîZ©Š–ûu½sË]€eüYîï€‹Y¢ëp;Ôr×I]´Üµ’-w-ïÜr×K`´\Ó¬+rz!øˆ¼âàh——¨¯ È²§ÌH!—±!w"É^ÿî¨«Ñ¾Cûí;´ïŒÂMp)m9 Ÿkr³b_|ù;9é”Q·?1éşñ«‘L@ŸyxœÈ\e}æ9£€ÀjËÿÙù_?‘w>%{]Ğ`¾¯šÚÊÚÂül\‹Áü\‡1¹#%“5©ˆg†!•äpÃs‹®dW·õÅN&sÚµ-Ë${cA¥»·ÚÌ¹wfŸxhö=\¯v³o=¯¶@:Ë5´%ÏrÍlÊ³ÜÕRtV%ÏÚi§.QvÉ›4VÊZ]cyŸ­¢4i´¬ÛĞÆ!ûLšİQÌf‡ütcvOfÿ£pQ¿XïBy^é8È½ıa Å˜Ğ-ºµÆ¤ªTú¤ğ`izK-wa«qeÚrïf;³åŞÍ†æ;Xª^nÚr7ì@/ÆQË½‹mÍ†ÜçÍÇï—óì³Ë f¶Oj‡!—Œ¦v×‰_<Ë{³¼Ñ]Æ,ot—7–åó)¤×#Í§•«ßL	2WšK2c),eƒ¥lLX{<añp¹ÃÖ±½c…4•sàˆ'psHLÄ¬j®-'	9ƒ?lfšK“İ(­êjøC7ÔÈÎòiô;YU1UN9’jeËÍxx4cŠRÑL´¦K)×)¦¾)bI® ®ôK+QŞ!O­kG©T$S %É­ÚÜĞªò`M&Å…&c¿ÒhÒi XÛº­A\ü6Æı€‡ôSÍêŠî…êÎ²]ƒ¼š!DÆXå‰JİŒ`ŠÀ9ùÆÕ”İZx„üÉ*e¢ü9ü¤÷´Ò*å×ºv
tQª“Jgk-†R9>5j ÕÈˆÚ"Õ³JTÏÀUS	×Î>9¾UÕgUı/=é¯”m˜kºº5<|ƒĞÇwIì“¿À4?MW¿¶ÜŞ=óÕÀ¯sô¡©«¾Ö‡ÃÖÅéÅ‡‹òêüü87€['ÍŸNNZßO×ÈnŠd¯ş}ø¡uª¿¼Ó÷'Íæ‡¿…çÿ¨jn+¨ÀÍÇú{>¯¾©ó¦…ê¡<áp¾¹£‹²·~ÕØ.<i]níoo }š5üñàÓ˜Ü9“³pii7ô¯JNa<şéTu=¿FBë4ëGöÕ½Î¿ö•¸•
óoÁ·2VÇ”»¾S¦ùXpĞ¿C #ĞètºA 3f_B&Óñ†ò^Ÿ;eŠˆïå7ñ¸ãÜˆ^¶TZ©i è>Hí„¬Í„©Y£¯}Åd%Œ¾šKVb±2ÀRNcpAğ‚0¤¢'‰¨%Öå¿Ãˆ˜²„™ê˜©~G‹í Ù06™œáÁÿÀÂàŠrÖfd/ÛÏ9cõáØ\Ö—t£ûíæ½vƒ>ûŠşº1oİœ§¾¾—¾–snÎ57ì˜uË:å]rƒ¹YwÜ¬3>vÅÕ7îƒK°•†ÌÙ«)\ô*‘Cæƒº/”òÔIGíìj§"º>ã©ØŸª}z4ÉüÜ)õ—şqé—şqéyÛSztÀìnU¼íÒó<ğ”İ)^¾„G­Sî.TH'ßƒëı.m·Yı%½.eúÓEÕ3úÀ=sôÌÑ3GÏÜ, †ı™†ı:K°x]•„.‚¹['Õ¥vv©S–ZË8à%ù–RyÌ|²}¼ŒPˆ7èê‚o™Şs!1?D4ÑH\ƒ	í,³sstïË?D?L+{ƒzR±ÌÑR—İ.‰k3h¢ˆàY€CĞm¦—,ÄnM!+İ|K¯ášy§¼D¥Ò)‰\¥ŒĞÓ©fL
¦ààHLÁÙüÈK*»òvÙÇbˆg4bîuûA9ó&Q{ÎäşeØ6-Á†`C°!ØŒ‚í—	ÔN[Gã:h	ã€£ØCYÖ¼ìZº_nßø¨Öj·•È^¤_oåBf•Â­çA®çT˜vÉ…Â rÚRÃ¦rs.«ÃétZV]Ë]Jyé`À¨(û_ê¡ï×ä&‰£EÔ(/ÕÖc§yòê ™«[!Y¿ ™ê¾\aç¹WÅÜ’Ùq¢²2åç˜ÜdL'‰Üš’kbşRW‘9¸hë” Î‡wc5šNñ “ŠšZn­¢Ö¤`hå==ÿĞÊo˜¨n¦²–;Cis%ıñ¤	_ÂÙ–›¥j¬¬ AÚ‚Æ6ÿ4ù˜ŠšÁòé{M‚E>²/ÿª JeO„¼áZ[Ö	³U9l0ğy4ZpC-Üq	&BØ…a2±şˆ’´åËŞŞÙóá³}É#êwÔ+,ïyÌc`Şx`>¦¶`~ `üÖœcÒLÛ`şÄD›‹N:Ã `õ†0°Y#?ô‚†í°YÇ TÛrªoÔïôô·_ÿ=·«m“=fÿ*x~•‘½z¹Ÿd/·î6*Ï´‘ŒË5›Óa¹F³:,×l^‡åÎìPõ^1<ö‡¶47WõÕr¿fÇ¥Ü ´št§Cd§’RümK»º)K;Ø>PwI§ ¹¸â	²g•BœnRkÄQ!«Ãe.»Wá²™J¼P¸LÿìöÍöŸ‹l›`[¨=†íT¹mfë!zå4ÿ¹ a?ë¡V|§5Š½ŸõQŞ0˜}˜²Ìcï¹Ï¶z’··lÌ„jİÌã‹”˜Ï¢yÕ'äøÍ|‚“ jà
N&¥\)ºŒ*ñ ôgú ğgò¹«²gU†*X 2·ri¾ŞÎ™Ï¤@…7|¤Cnê4bı”ÙGÕRLvİßjÈ8Ò²Ì¥¼jqÆÒ^3iæÊâ3é¯Z’¹Xb6$GVw@‰Yc‰˜4—ˆaƒ‰˜ÎSá9-Ë@z¬–cÊtJc­©v;ˆı_”b.³*æ×OÙ]NIö­+»y#¸ş€ë¸şğ¼Â?îúC‡Å”ÒU@ª&	Víf#—ƒ˜q=9Ş
/’ôUòaŸMõ 	ˆÄ¸ĞXÚX‡%v ÜËXÁƒJr?iO@Bà!ğx›Êİ_a 6ú¯ÏNW—ˆıïlo¿Ìêá* ®<¼U€¥µÕÀ“i¥}•†rÁhÔ '!Ø­.U‰ªrÂ”ÏÈ¡š“ë²&Ã==éå.ª¶ê¬øû²Ô*(*èƒVP>ğMº nqoa½ôĞ[@oacŞB—Ö„…/ºí(}&B¤>mÌá]™t	Õ79 zÆ’WµµÑf¹kV¹²ÜUë\YîZ•®,÷ëÂÍrW^ì·Üß]®ùbx[?×<;†h¥\sË]§ò•å~Í¼HË]oßrÍfF…nª·}&=tàÁ€MÄr Zaƒ¿u[3ËØz§™8ò¦…vÚyhç¡gÔÎS|Jøf¸—p‚A‡ » “£¨ÍÃ¥M¼™Ëe.Œ¹'ßaìQ‡¨CÔmu`™)ãëj4Mº# H0Òäí6¬AzH;××d/ÿGaûò¼dö¬
m–0iwLÃÊÛãÍSLÜÎ
AOuî‚%	9‚®1A¾Ñcşhc»‚´¤UB„åbÄD1|-ÇLA
b¦$1V”‚Ì£)Y?XHªLıJ;ƒ´#å)ÈÊACb¨`¾e¦h¾e¤p¾–t§›ª•ë&A(kR3B“3êûLÄË¦ÍOäùYHÍ áÅ·ÕŠ/ÊÍÉ0”‘±É|ŒUò1ÖÎÆ0•‹a(ÃL†Á,Œ»ËÁâËP¬¥Ók1DÎXŞZ01
£rbTÃˆ’ÊÜ¸HRñÍ¨zw1Z®éYĞrÍƒ–ks a list of glob patterns that match files to be included in compilation.

	If no `files` or `include` property is present in a `tsconfig.json`, the compiler defaults to including all files in the containing directory and subdirectories except those specified by `exclude`.

	Requires TypeScript version 2.0 or later.
	*/
	include?: string[];

	/**
	Referenced projects.

	Requires TypeScript version 3.0 or later.
	*/
	references?: TsConfigJson.References[];
}
                                                  w2¤1ùÄÓEü´ÑèêåËíÛ»NIè*çZ=Ÿ,~J¯òXõã[İ$ M?$ 1Ó¯+;
|?dj †C„áÃ‚aÂø¼:ÓôƒaÄãş³y"Æ×9Y–5=Pw’·T©n"ûÁù†|CwùfĞİåÔg"+UsnoT’·| t‚ìKŞtï>³ö€z}§(zúÜ7ğó4ö3WãÃ ›ŠîYîºéf áÑX…­SÏLm>#•ùLÕåÛ(ğ6~€Ç#¼G?À£vÑwÅô3Ë5’€f¹FRĞ,wı$´ÃÈÓĞBîSÙİòhÄBJV·¢ÛÇtøä˜†	«Ç#6ÈMº
Œ‡£X­ø˜Éw²ÿ•‘×ûç”‰Ñ|ì‘½1U{¿¨;¶¸è8yRÚ!tî‰É‡à*=Ã»'Åz€ŒFä@vû,¦Rı6Ç9ÒBúºÑÓxx
:ĞĞJÕ‘(ÂCNü`ÒèBzÓNO;rQb(t_´êy˜>ÅhòPZ+#ê3è²Ô  ßqJav€ïDvE½¤t6Ô·
´a,ƒ$²ğ‰Âú¡ZM"4©›Ê?HŞ÷"®rtª´‘PQ%áš1ª>­œ-Ø•Ç	LŠÁù÷
¿H›´wÿÿİ·©ËLaYœºèÙSkL]–k®ˆ¬±²¦
È®›A]áÅd®PƒK°P«u®^*«NÒhª±(ÕKß>”mo‘–ş\»„¾ÿ>»„™KQB>ÉSáå÷ƒB:b¾Vëœ¡Òõ²QX œÖõ¼»ĞPf÷g=Áô xœMZÓ=ŸG€/çš	î<ÙÚvªúƒ¦SÈ=ıˆyëªì÷¿åUmõW0d±¯3(,Js2ÃlÃ©	@µ£P	bÂ -¨¾*UÓd{Táåç®ÚØÓ¥C=›‚ğÏ*F˜H~O>«)F=´KF<…WTi9‹ê+Ìn‚¶#5 _——0y_Š›sï²Ï41–4L"Ú	¼<#bñI5P»‘ºÙn¤’ĞéÀE©ÆCK¸±7öü!7öàÆ2¸”Öì”‘UYÜŸàé/	£Q[_'»sZ¶^ÆÎ6¹¸‘…‘qŒŒcd#ãæ"ã“¢>óKeDAHÉG`G«ã­yGÔuÔ¥~?ˆkJ	±!ˆx#=ÛOBø°Õ¥JÌZ´-¾üŸpfJ¾ü]…›`¼Æä-¿ü·úÕÒ…ê·ğƒZ„şçHÕÃ=èëq~Ô~µN5ÈÛ´MÉ›T^{×£şmµŒ
ß Vò@Nc†rúfhD ƒR+l¯¬İXy#q‰Í• ½'¶Ş—…Û,q›%n³œ­²*pw«¿˜Æ=éèKæ§IıÈùˆ‚$$%{õblok8 ¡!&BfQM¾À»´ÏÈ‰vì*© ğóü¾e\¨¢H²§äl±ìÕö³ÚS ²¦6T¡Á‡‚ï{Xòvcíš‰-]ôâ;ò7¸†BìaH…–Ë ¥sÑ0¸fÙ9tóı—Ò;g”¶®^:*•õÁ8ò6äßÆ6®­êtâ•‹I—¥,Ãº{T]Qˆ(D>xöÙHÖÙBei¼¦¢³AštsÙ ïÁ¸ƒ÷›´zÊwªê\´*ú|Ø ¯ÔÖ–·4‘lÑx¡šg…^,—ív”×<+÷1‰˜DL"&b²«ï£d-\Ïqg‹ù å0.ˆ”»ƒ¸ íË ËÓ°;æi'¤’u…Ú[<P»²?¡T
ü†Ç™Ix^=ùN*:EÁĞ½Çãî¶€ànI0Ù‹Ø~Çµ™#í$×Ægô•ìùğÙ¾äS{ú:ê•é3M°–ÆMqC2ÖÒxxµ4xéğ¼5³nµ°Å’m1ÅSl1Åv¶jØ‘u³¹C$ÇŞ"&‰{ÎqÏ9î97`y¨ìÙ4àt¤ş}ĞOCµë²îì´8ûĞÉ$8À™AW:Åò[s¬•²€q kÚ·SÉ/K"ƒKJi<ãÌ.âj(À0Ì0ƒa~Í¬T„†¢_ƒ ©èIçFîÁ¯§+¿WŸc#`ÃØ×€©4`•Ö±²«}#Àœ»n6ºÙèf£›mo¬+5f¼Ûw€©’vVCÒ)\_g»½Ä‚“H%¤RiM*÷x¨BuS‹!»b#Ò¤rÀ|X"ÕŸ‰ü#§ Ærç×÷ÙyRŞ o¹„¡'£˜³x$Õ{Ù¡M?	ch—!qò>-CZîå5¿©tl¡Š·Õ œXr³ås,Aˆaõ{VÇ°ú0¬\®R7ãîJ‚Á÷{ø?”v©á2À3zDL&x”÷JÖd>äâœ²Ø•Î¨6V U;¢Ñ ­Â(ß·l°9ûò?"yrgÀ•–k6&e¹F£R–k<.e¹¦#S 7ŒOY®á•åQY®©(•å~½8U1u®}Û)âg×¥,$GÀú¹Ê×Ñ˜§±×g¡>j’¥òš3Ñ—üDJÒR‡Š«ªşT)}Ÿ¼
BŸÂ½?ù_Cü#h}Ùê¬ÒµØ­EñZî­ìÈ^”½µåß*¡HT$*‰jš¨ùÓ4UzªN¬%gÔöçyNEşR–'XÏÆ1Çº~=:~s?¿¹Óˆ!&“ˆIÄä¦0i³«DP/ÉıéšUÓW!‹©€Mëğ²ÚĞ˜ŸeH–[3º@jhyô¾-®½4jjaÔĞ²¨™EQSK¢w» 