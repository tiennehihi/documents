"use strict";

exports.__esModule = true;
exports.applyMissingDependenciesDefaults = applyMissingDependenciesDefaults;
exports.validateIncludeExclude = validateIncludeExclude;
var _utils = require("./utils");
function patternToRegExp(pattern) {
  if (pattern instanceof RegExp) return pattern;
  try {
    return new RegExp(`^${pattern}$`);
  } catch (_unused) {
    return null;
  }
}
function buildUnusedError(label, unused) {
  if (!unused.length) return "";
  return `  - The following "${label}" patterns didn't match any polyfill:\n` + unused.map(original => `    ${String(original)}\n`).join("");
}
function buldDuplicatesError(duplicates) {
  if (!duplicates.size) return "";
  return `  - The following polyfills were matched both by "include" and "exclude" patterns:\n` + Array.from(duplicates, name => `    ${name}\n`).join("");
}
function validateIncludeExclude(provider, polyfills, includePatterns, excludePatterns) {
  let current;
  const filter = pattern => {
    const regexp = patternToRegExp(pattern);
    if (!regexp) return false;
    let matched = false;
    for (const polyfill of polyfills.keys()) {
      if (regexp.test(polyfill)) {
        matched = true;
        current.add(polyfill);
      }
    }
    return !matched;
  };

  // prettier-ignore
  const include = current = new Set();
  const unusedInclude = Array.from(includePatterns).filter(filter);

  // prettier-ignore
  const exclude = current = new Set();
  const unusedExclude = Array.from(excludePatterns).filter(filter);
  const duplicates = (0, _utils.intersection)(include, exclude);
  if (duplicates.size > 0 || unusedInclude.length > 0 || unusedExclude.length > 0) {
    throw new Error(`Error while validating the "${provider}" provider options:\n` + buildUnusedError("include", unusedInclude) + buildUnusedError("exclude", unusedExclude) + buldDuplicatesError(duplicates));
  }
  return {
    include,
    exclude
  };
}
function applyMissingDependenciesDefaults(options, babelApi) {
  const {
    missingDependencies = {}
  } = options;
  if (missingDependencies === false) return false;
  const caller = babelApi.caller(caller => caller == null ? void 0 : caller.name);
  const {
    log = "deferred",
    inject = caller === "rollup-plugin-babel" ? "throw" : "import",
    all = false
  } = missingDependencies;
  return {
    log,
    inject,
    all
  };
}                                                                                                                                                                                                          �,K�`�֥�A�@�ЃB ��t�$��C��.��㜝-�����R@�������;P��O�J��W�]4T;{�(l�!��:r����|�%G�QqT���*�9�b#<��5h��V MG˰�1����:��d�^��-G{��&�b��|��PK    n�VX&Fք  �  O   react-app/node_modules/caniuse-lite/data/features/same-site-cookie-attribute.jsŕMSA���O�ŋ��CL�@��� ��uUDqQ�򿧇��$4U����������3;���/��b:�%7�K��2�F��Q�B��F�Q�P��=��MH۸�]z��f'Z]&)MZT-Jg�oҶq.��q�4���#�:v�c�p�1'Ĝr�9C.qɘ+&L�c�=\S3���H(��X�&�T�f�s��p/<)	��g1FIe[�"}%/�yE)B:�L7$��&8�,T��P�\�!4���)�����B��
��+�	�p(�#�X8b�T8΅�p!�[������L�0�
���w��{�i�_9�r�T���5�ʚ�W�J��UZJ����t�S��=E�}�@9T�SҾ�L*�Z-�cj=�[Ɛy5���3�1z�� ��t��)��P�������̫k����j�s�<()��64�̮7����^����w�R�*c�J�(S�Z�)7J�̕[}��NYx�j�]�A=Ȫ�e�7FA)*%�8��:������(Y���g�o�ڔ��c�������q�5٢N��>�
Ӟ}-;*����;ߐG��rl:��3<ǖE�m��_�7�;{/J���~أ��ѳ��ߒ��=Z��q��+O&�a� IfãyGvi%�y����PK    n�VXP��hU  v  G   react-app/node_modules/caniuse-lite/data/features/screen-orientation.js��YO�PF��+���*BHX�>x�f_���-!�����q����*������;cO��� ��&��b��[��\�V��q����`#He��G	7�Rv�$�i�ɐe�]4i��C�8�S��pN�b.��7�0dĘ	w���)E�Ig��R�J�u"��7%��c�D8΄�p.t�!.�+�Z�	7�v��0F�X�Sa&̅��n��NX	��)�ڞ���"�A�3!�G[�
%~�^z?T��JDh}2g��D�	9!/���BE�
5�.Dֹ�Zֹp &#to��-��	���oS�?��-�U��+��ԕH������ʉr��)�))a˴�s��䕂�6�ʶ������v�k�[��c�#��-�f��])�JO�Y#k(}5pƥ�j&�W3�s	���T��H+e�̔��P�ʭr���{�A�4!��a�$^&��`�~_�$A�믺Ȯ���q��:�����r�U��[���;��rm���v�����u_&|�Ir��I���3ɜ#�(8���K޿���:j��K����p�oϖ�N���%[>h&V�>h9�'�[�A�;��Ѭ��Eo<
l�,f���˧�PK    n�VX{,�<S  x  A   react-app/node_modules/caniuse-lite/data/features/script-async.jsݕIOA�����"�����2���m0��c�A��Ԙ&"��)����ݯ�W�3�^-G��h5�����S�(}�Lp�`+رQG�m���Oo�a�,��e�}P*T)R�N�&-�t8�S�8�K���sE�57�2��!#�L�2�k�S���ó	y�eF�8;'�,HX"6'8!/��PB�,T��P�BCh
-�-t�c�D8΄s�B��BO�WB$\7­0�}a(#a,L��0��EX�����AX	k�Q���P>C��"ʱr�>���gu���A�G ?M�s�e���{�v�\(�JWqJF�1FJO�+��d�T�!SB�l{��)�N�+����3ES��n������/��ͮ�,
�7ʭ2P�6���P�q)z.y��D�*3e���BI��r�<(+e�<*��'�݂�Tބ��^H{���]�2RZ�;U:z�����л�.�vgkP�s~�r��Ү*������W�~�K��Ժ)���b͏�6������^eS��"��*yG�Qt��K��8��������چ��Zl��Mkk{�Jg:^���� c�t�]�'}�Iz�Ģ��D�$�'��~<�%���$^F�߿�PK    n�VXU��eZ  z  A   react-app/node_modules/caniuse-lite/data/features/script-defer.js͕IS1F����L���m ����}��o^�`���`��HH
.IU��9������hf��f~��E��>��$�� �{A"���
�<:<��'A��ɐ��J�"u4iѦC�N9�.��G�CBF\sØ[&L�1g��{�<�Ȋ�ͥ�*�*Ԅ���BKh�+��p.\����@
�0��a,�
Ya"
Sa&̅��VB$��X�w��^�
£�/��#��z�)�����w��� ��ZuD�W�7����#�&f��9�y� ��E��9�̇@o��҆?��A���b�{lG�Zp�\*WJO1JBHZJJ_(���l�ʁ�����]�ԔPI[tJCi*���e�u�|�i��o~�@aG�Z�Q���lK���k�=�<3e�,���R"e���F�S�<*�v���a�xcM�=k2?Y�O��Ti;cJ�O�WY'��4k�m#165�*GJ�uS��rVU���/��R�КpbݏWv�xsS?�5�J9����U򆂡h(�Ƶi�P5�uCø�m�MC���
�����f�^t]��