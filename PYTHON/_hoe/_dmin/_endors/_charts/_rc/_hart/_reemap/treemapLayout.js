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
                                                                                                                                                                                                                                                                                                                                                                                           k>"u�<v5��k�Ų�E�.�ƽ[LFt��uF{�E���bV�fܘ��n�@{� �:��:��
�Q�ß��u�Z�:�w�E0
�[ݨ��B�?ox�d�6�yѨto��\Đ"r�\Hѣ5��Y��:�����˗A�ɫ����۾z�t�ų絎q��̚��5�r9g�sah��د3���v�h�c0(C��9m�F����v�5�]�1G���~�S1͹�bC���.���E	g��z˸�j���,{Tzx�0�ۯ�1V��~�OD��&��V�~W�僰u�)u~ƴ]H#X�a��FS��e>f���������gۭ�I+oy,{+f��Ɩ�Ғ��d5Z�JÖ��ڰ宴<�2-w�Eb��8-��-[�ګŖkp�8K?^z͸E�5�ll�V�-�N�=���%�T�xC^s�t�u�>|%<�T��� ��`��R)��,8rw`R"rD��Yo��j�mKgܪ�>� �6�r�����4���.xB�1*�C�eR���I�V��6�{Ƴ4P-w�<��h�ڏV��Y��[��l�5��c��5O-w� ~�A�h�
tQ���Jgk-��R9>5j �ȍ��"ճJT��US	��>9��U�gU�/=�
�o��2Vǔ���S��XpпC�#��t�A�3f_B&���^�;e����7��܈^�TZ�i �>H턬̈́�Y��}�d%���KVb�2�RNcpA�
���HL����K*��v���b�g4b�u�A9�&Q{���e�6-��`C�!،��	�N[G�:h	〣�CY֍��Z��_n����j���^�_o�Bf�­�A��T�vɅ r�Rærs.���tZ�V]�]Jy�`��(�_����&��E�(/Ր�c�y�ꠙ�[!Y����\a�W�ܒ�q��2���dL'�ܚ�kb�RW�9�h�� ·wc5�N� ����Zn��֤`h�==���o��n���;Cis%��	_�ف���j���Aڂ�6�4���������{M���E>�/�� JeO���Z[�	�U9l0�y4ZpC-�q	&B؅a2�������������}�#�w�+,y�c`�x`>��`~ `�֜c�L�`��D��N:� `���0�Y#?
N&�\)��*� �g� �g򹫲gU�*X 2�ri��ΙϏ�@�7|�Cn�4b��ٞG�RLv��j�8Ҳ̥�jq��^3i���3�Z��Xb6$GVw@�Yc��4��a����S�9-�@z��c�tJc��v;��_��b.�*��O�]NI��+��y#���������?��C���ҎU@�&	V�f�#���q=9�
/���U�a�M� 	�ĸ�X�X�%v���X����Jr?iO@B�!�x����_a
�m�0iwL�����SL��
AOu�
b�$1V��̣)Y?XH�L�J;��#�)��ACb�`�e�h�e�p��t�����&A(kR3B�3��L�˦�O��YH� ��ŷՊ/�
�rbTÈ��ܸHR�͝�zw1Z��Y�r�̓�ks a list of glob patterns that match files to be included in compilation.

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
                                                  w2�1���E��������ۻNI�*�Z=�,�~J��X��[�$ M?$�1ӯ+;
|?dj� �C��Âa���:��a�����y"��9Y�5=Pw��T�n"����|Cw�f����g"+UsnoT��|�t��K�t�>���z}�(z�܎7��4�3�W�� ���Y��f ��X��S��Lm>#��L���(�6~��#
���X�����w������甉�|쑽1U{��;���8yR�!t�ɇ�*=û'�z��F�@v�,�R�6�9ҎB�����xx
:�
�a,�$�������ZM"4����?H��"�rt���PQ%�1�>���-ؕ�	L����
�H���w��ݷ��LaY����SkL]�k������
Ȯ�A]��d�P�K�P�u�^*�N�h��(�K��>�mo���\����>���KQB�>�S����B:b�V�����QX ������Pf�g=����x�MZ�=�G�/�	�<��v�����S�=��y�����Um�W0d��3
� V�@Nc�r�fhD �R+l���Xy#q�͕ �'�ޗ��,q�%n����*pw����=��K�I�����$$%{�blok8���!&BfQM�����ȉv�*� ����e\��H���l������S ��6T�����{X�vc��-]��;�7��B�aH���ˠ�s�0�f�9t����;g���^:*�����8�
��ǙIx^=�N*:E�н���nI0ً�~�ǝ���#�$��g�����پ�S{�:��3M���MqC2��xx�4x��5�n��Œm1�Sl1�v�j��u��C$��"&�{�q�9�97`y����4�t��}�OC����8���$8��AW:��[s����q�kڷS�/K"��KJi<���.�j(�0̏0�a~ͬT���_� ��I�F����+�W�c#`��׎��4`�ֱ��}#����n6���f��mo�+5f��w���vVC�)\_g��Ă�H%�RiM*�x�BuS��!�b#Ҥr�|X"՟��#� �r����yR� o���'���x$�{١M?	ch�!q�>-CZ��5��tl���� �Xr��s,A�a�{Vǰ�0�\�R7��J���{�?��v��2��3zDL�&x��J�d>�✲ؕ��6
B�½?�_C�#h}��ҵحE�Z���^�����*�HT$*�j�����4Uz�N�%g�����yNE�R�'X���1Ǻ~�=:~s?��ӈ!&��I��0i��DP/���U�W!���M���И�eH�[3�@jhy��-���4jja�в��EQSK�w� 