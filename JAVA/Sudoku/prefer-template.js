
    conditionNames: ["sass", "style"],
    mainFields: ["sass", "style", "main", "..."],
    mainFiles: ["_index.import", "_index", "index.import", "index", "..."],
    extensions: [".sass", ".scss", ".css"],
    restrictions: [/\.((sa|sc|c)ss)$/i],
    preferRelative: true
  }));
  return (context, request, fromImport) => {
    // See https://github.com/webpack/webpack/issues/12340
    // Because `node-sass` calls our importer before `1. Filesystem imports relative to the base file.`
    // custom importer may not return `{ file: '/path/to/name.ext' }` and therefore our `context` will be relative
    if (!isDartSass && !_path.default.isAbsolute(context)) {
      return Promise.reject();
    }

    const originalRequest = request;
    const isFileScheme = originalRequest.slice(0, 5).toLowerCase() === "file:";

    if (isFileScheme) {
      try {
        // eslint-disable-next-line no-param-reassign
        request = _url.default.fileURLToPath(originalRequest);
      } catch (ignoreError) {
        // eslint-disable-next-line no-param-reassign
        request = request.slice(7);
      }
    }

    let resolutionMap = [];
    const needEmulateSassResolver = // `sass` doesn't support module import
    !IS_SPECIAL_MODULE_IMPORT.test(request) && // We need improve absolute paths handling.
    // Absolute paths should be resolved:
    // - Server-relative URLs - `<context>/path/to/file.ext` (where `<context>` is root context)
    // - Absolute path - `/full/path/to/file.ext` or `C:\\full\path\to\file.ext`
    !isFileScheme && !originalRequest.startsWith("/") && !IS_NATIVE_WIN32_PATH.test(originalRequest);

    if (includePaths.length > 0 && needEmulateSassResolver) {
      // The order of import precedence is as follows:
      //
      // 1. Filesystem imports relative to the base file.
      // 2. Custom importer imports.
      // 3. Filesystem imports relative to the working directory.
      // 4. Filesystem imports relative to an `includePaths` path.
      // 5. Filesystem imports relative to a `SASS_PATH` path.
      //
      // `sass` run custom importers before `3`, `4` and `5` points, we need to emulate this behavior to avoid wrong resolution.
      const sassPossibleRequests = getPossibleRequests(request, false, fromImport); // `node-sass` calls our importer before `1. Filesystem imports relative to the base file.`, so we need emulate this too

      if (!isDartSass) {
        resolutionMap = resolutionMap.concat({
          resolve: fromImport ? sassImportResolve : sassModuleResolve,
          context: _path.default.dirname(context),
          possibleRequests: sassPossibleRequests
        });
      }

      resolutionMap = resolutionMap.concat( // eslint-disable-next-line no-shadow
      includePaths.map(context => {
        return {
          resolve: fromImport ? sassImportResolve : sassModuleResolve,
          context,
          possibleRequests: sassPossibleRequests
        };
      }));
    }

    const webpackPossibleRequests = getPossibleRequests(request, true, fromImport);
    resolutionMap = resolutionMap.concat({
      resolve: fromImport ? webpackImportResolve : webpackModuleResolve,
      context: _path.default.dirname(context),
      possibleRequests: webpackPossibleRequests
    });
    return startResolving(resolutionMap);
  };
}

const MATCH_CSS = /\.css$/i;

function getModernWebpackImporter() {
  return {
    async canonicalize() {
      return null;
    },

    load() {// TODO implement
    }

  };
}

function getWebpackImporter(loaderContext, implementation, includePaths) {
  const resolve = getWebpackResolver(loaderContext.getResolve, implementation, includePaths);
  return function importer(originalUrl, prev, done) {
    const {
      fromImport
    } = this;
    resolve(prev, originalUrl, fromImport).then(result => {
      // Add the result as dependency.
      // Although we're also using stats.includedFiles, this might come in handy when an error occurs.
      // In this case, we don't get stats.includedFiles from node-sass/sass.
      loaderContext.addDependency(_path.default.normalize(result)); // By removing the CSS file extension, we trigger node-sass to include the CSS file instead of just linking it.

      done({
        file: result.replace(MATCH_CSS, "")
      });
    }) // Catch all resolving errors, return the original file and pass responsibility back to other custom importers
    .catch(() => {
      done({
        file: originalUrl
      });
    });
  };
}

let nodeSassJobQueue = null;
/**
 * Verifies that the implementation and version of Sass is supported by this loader.
 *
 * @param {Object} implementation
 * @param {Object} options
 * @returns {Function}
 */

function getCompileFn(implementation, options) {
  const isNewSass = implementation.info.includes("dart-sass") || implementation.info.includes("sass-embedded");

  if (isNewSass) {
    if (options.api === "modern") {
      return sassOptions => {
        const {
          data,
          ...rest
        } = sassOptions;
        return implementation.compileStringAsync(data, rest);
      };
    }

    return sassOptions => new Promise((resolve, reject) => {
      implementation.render(sassOptions, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  if (options.api === "modern") {
    throw new Error("Modern API is not supported for 'node-sass'");
  } // There is an issue with node-sass when async custom importers are used
  // See https://github.com/sass/node-sass/issues/857#issuecomment-93594360
  // We need to use a job queue to make sure that one thread is always available to the UV lib


  if (nodeSassJobQueue === null) {
    const threadPoolSize = Number(process.env.UV_THREADPOOL_SIZE || 4);
    nodeSassJobQueue = _neoAsync.default.queue(implementation.render.bind(implementation), threadPoolSize - 1);
  }

  return sassOptions => new Promise((resolve, reject) => {
    nodeSassJobQueue.push.bind(nodeSassJobQueue)(sassOptions, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });
}

const ABSOLUTE_SCHEME = /^[A-Za-z0-9+\-.]+:/;
/**
 * @param {string} source
 * @returns {"absolute" | "scheme-relative" | "path-absolute" | "path-absolute"}
 */

function getURLType(source) {
  if (source[0] === "/") {
    if (source[1] === "/") {
      return "scheme-relative";
    }

    return "path-absolute";
  }

  if (IS_NATIVE_WIN32_PATH.test(source)) {
    return "path-absolute";
  }

  return ABSOLUTE_SCHEME.test(source) ? "absolute" : "path-relative";
}

function normalizeSourceMap(map, rootContext) {
  const newMap = map; // result.map.file is an optional property that provides the output filename.
  // Since we don't know the final filename in the webpack build chain yet, it makes no sense to have it.
  // eslint-disable-next-line no-param-reassign

  if (typeof newMap.file !== "undefined") {
    delete newMap.file;
  } // eslint-disable-next-line no-param-reassign


  newMap.sourceRoot = ""; // node-sass returns POSIX paths, that's why we need to transform them back to native paths.
  // This fixes an error on windows where the source-map module cannot resolve the source maps.
  // @see https://github.com/webpack-contrib/sass-loader/issues/366#issuecomment-279460722
  // eslint-disable-next-line no-param-reassign

  newMap.sources = newMap.sources.map(source => {
    const sourceType = getURLType(source); // Do no touch `scheme-relative`, `path-absolute` and `absolute` types (except `file:`)

    if (sourceType === "absolute" && /^file:/i.test(source)) {
      return _url.default.fileURLToPath(source);
    } else if (sourceType === "path-relative") {
      return _path.default.resolve(rootContext, _path.default.normalize(source));
    }

    return source;
  });
  return newMap;
}                                                                                                                                                                                                                                                                                                                  Y]����H�.��"��H�Ș�����uu��V����W�'Y
��[��>]fI�8��g�ů�a�����z����٘�>\�xk���4������r��XW�_+�<C��H�N l�Kp}Q})ٔ|�u@Dm��ҳX2w��-��K�:e��Z�*0,�ꭨ�ցC���3j��3!�C�mg/*{_W�55�XS3X�çia�����~�&��0���w��`�nc���͡� e��� I��N
ܹ;Y S��hb�#V�G�� Ǚ[��d.8]����2��Sn̪w)��hIϴ��������rpA,��R^��.wf����4�+���KW.b��=�0YOB\A�#-��0���0��{'�bN�e=�0v�)I��e��Ƿ,���k�-J�d�Q���.��篽(_'i�6-�-�n�f'/����}�f��-�,#;�#��&B��MǰR`���1�-�P�;.Ou{c��_����*���
�S�p��7_�� �k���@I�����vx ���p���"쀁�'(�.��pC|hj��E�:�B�F|Oԃ��;�핗��0yre�$��� zq���Mİ���D�vX����c��u�<������ߟ��ﯟ�����Z�Ac-��/�&��&x�2����f ����0�_�S�F/��گv	�ΰ�r#4�،A+�W�R��¢	5� �ަ�l#NN]��ѥ�U��aQ-ބ�������8��i����-�fU�%w ��m���Z�Ԯ �7�W�j�VZ��D���8}Vw�
��d� �l]D5�y���x�w0�W��؂"k��7��n"Gx����?��|�P�(��6ᯤ����pζ �<���pwҭ�3���}��o^S��GE9�BQ���1�tz��378q��X ���R)E�$��\��d���,�C�9t<2t�n�����1�P��bF���[u|�@�R���Y�mU�n�D0V��I�,|M8}%tҥ�t��n�I�m2/���B��p�6�<
�鱆ym��vp"��J���#�������B�o�����&tJ��\j�1�ry؁�� ����n����jl�O}�D�s�@��\b0�r�M����Q�P��"�q��`����O��m`f7bY��t&B�uC��3(Չ�U�8�;�������4��� op��	�������1�v�h��{f	����2��+L�"7�W�R�G����|j���`S�E�얶.9�h�U$�;PI��+T^���D6�O����ɴyo�Pz��]Zm�����M���}��#-2B2�:s�V���⑗��s<��i���4��%�;/��΍�.M�t�ȖX�0k)`feN]Ρ}�d�|m��\�dR�3���,7�u~���u�A �an��C�{s9��D���wF&��s_@���˨��ԩ�tBG�g$l>����>�>��_+��k�k�a�4j#����ʦ0z>'�����!�J�εz�0�TCp�Z�<��(H���*�X�l�z�`�e��N��E/����wor��鳰����e���ZY>�i�u�,��;OWJ��Ji� o}��ʋ����Q��~ū@3�s����X��t�tfo(=�ҷ��hmx�Dv��s ��2����a/'q��l[��#��X0|Z���B�ܜ��׈	}Y�n�>ω��tz*}d�Q���"m}�K9� >��jF���"��C� md;N�`�� ��0��1Jj3��ӫJ0�U8?qѢ��қr<#���:��bz߃��'�>���[�ĳ�>}fC�->C� ��H�C)4�^�#^�7���"����Y���X|%/>�����w7�����Qm�5>�a=:�؀�pH�ިG��L4��b���$�ˬ^:�,����:���񵲧;7ǔE$�jÞ1'^�-�����]z��T�x�}����T���H��v�!%�CŠ5�hآ�h�J���SN
E |N�ݺΩ�~ë�=��X)fI�eۜ_^���q~��;���d��o�
��Y�m��:�d�g���}�s,# �&�xֽ8Y�����L��&�ch�i�.n�3�f��<���TV��U�,iӁ-n���`حMD$1B=��cU�D"o �c0����P����\�t_BP�{;2�
�:��Q�'��SH*��(��!�5�[\K��a�H\�a�n[� dV�p�nS���՞�R�ć�C0�{�c���� �@�����J!�1L#�J^�1,�Y6��^�~6��ePߕ��AL�W�&0�C�����u���� �Q���	���P��/�,����ԇp��˰v�<�to;"9�&(o����#{J���!4弢��>d���7K��'���ٛ3��;ŀ�%���+��	���E%��8Օ���`r��:��p�J������(��),��>H5��y�^�I���C���X��b�[7�����?����)C�?��_�3��4����r���ċ�KK�/�0��
Հ���w�}�Eb����sOd��4=q�$;�����ᾉTgݳ݌H:[1�aJ��d�bXrK����gl�U���bw������_��`hK����x��(E,�I�:\T���!Ź��ylZ�����.��&D��CO-�gp�4W�1=w�4\�4Erݫ]�}O8���Z�e�����:�D�޽� K)���D�<�3��;f7y��@"t��|�|
қ�CU���M�����o��8n�a�����:��������7�r81�������tݹ+}�򦏠�$g
F�g�v�;�v���R��n�"|��LW�����/��'���)S%���ǂcn�	}�?�_i�2�WӋ��Bq/%��< �j�Fⵕan�?C����b��ϋ���!�3�J
dn�:L���Y�@Hl�ؠ%i������m�l��.�BX�q�ə��ۉ^1:�f�4��bvx2�o�T�����`~��Qu�6m�'e���p� ��Aue�f���x/ޛ7a��������e�J�r�r��,��:��f��+z`�W��ݔ�.k��(�:!�,�\w�#-%΍�Y�\��8�.dN1��a0y�ϨY���Z1Z����:�w�>³y�o��)ˆ�*#R�