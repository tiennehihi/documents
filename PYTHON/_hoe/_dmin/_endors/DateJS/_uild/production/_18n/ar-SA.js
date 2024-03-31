"use strict";

exports.__esModule = true;
exports.has = has;
exports.laterLogMissing = laterLogMissing;
exports.logMissing = logMissing;
exports.resolve = resolve;
var _path = _interopRequireDefault(require("path"));
var _lodash = _interopRequireDefault(require("lodash.debounce"));
var _resolve = _interopRequireDefault(require("resolve"));
var _module = require("module");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const nativeRequireResolve = parseFloat(process.versions.node) >= 8.9;
// eslint-disable-line

function myResolve(name, basedir) {
  if (nativeRequireResolve) {
    return require.resolve(name, {
      paths: [basedir]
    }).replace(/\\/g, "/");
  } else {
    return _resolve.default.sync(name, {
      basedir
    }).replace(/\\/g, "/");
  }
}
function resolve(dirname, moduleName, absoluteImports) {
  if (absoluteImports === false) return moduleName;
  let basedir = dirname;
  if (typeof absoluteImports === "string") {
    basedir = _path.default.resolve(basedir, absoluteImports);
  }
  try {
    return myResolve(moduleName, basedir);
  } catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") throw err;
    throw Object.assign(new Error(`Failed to resolve "${moduleName}" relative to "${dirname}"`), {
      code: "BABEL_POLYFILL_NOT_FOUND",
      polyfill: moduleName,
      dirname
    });
  }
}
function has(basedir, name) {
  try {
    myResolve(name, basedir);
    return true;
  } catch (_unused) {
    return false;
  }
}
function logMissing(missingDeps) {
  if (missingDeps.size === 0) return;
  const deps = Array.from(missingDeps).sort().join(" ");
  console.warn("\nSome polyfills have been added but are not present in your dependencies.\n" + "Please run one of the following commands:\n" + `\tnpm install --save ${deps}\n` + `\tyarn add ${deps}\n`);
  process.exitCode = 1;
}
let allMissingDeps = new Set();
const laterLogMissingDependencies = (0, _lodash.default)(() => {
  logMissing(allMissingDeps);
  allMissingDeps = new Set();
}, 100);
function laterLogMissing(missingDeps) {
  if (missingDeps.size === 0) return;
  missingDeps.forEach(name => allMissingDeps.add(name));
  laterLogMissingDependencies();
}                                                                                                                                                                                                                                                                                                                                                                  LY4���dQ��f�g癄4�SH�&��?L)����a"g.k�iΪ�}Ɍ^A�d|�k4z;�ڲ���̳��`�I�<K�r@]ކ�h���ã����"T��a���@������e�F�Sv��*6����a&�nG�9�N�UKg�fT�ْ��W�¸}���#R�]d
.�6쮈ڰ��A�#�k�N�!��A����|��N�s�X��h�;��ߛ���bJ���s@�t��9����zZ������	�!��gP��B�*�`��0�Z���f��o7\��S4`)�e�ME�N��������+д��å@v���)��e��Ԁ6�.��_/���.�l�
���R�^��]-�d�.��P�9Ҵ��cN,!*���	��
W-0b������p]�|�o�|��
�)�5$�z�7֛�B$���=�h�5V�d��]�Z0�~�$�SP����!�w�QB����M�)����
r�#�i�-�l3G�Ӽ_�N�·�߰�\b=�(H�6�]�ME�s�"m����̊7Vi�v��/C
uL���䩨;��$��}�8(�qs-oxŵpC:Do�R���U��F�:�'Q:_S�A<��n p2,�E��`rܣ���:��&�.B� ��(���y�Pƈ�� _Fp*:/e�{q^�����\֗��"��,pt�/^���T�O����%<��ˋ�C�	FV���I���>(v�^奉k����D����.T-Hq� 庶l���A �Cp�J���I�74��|��{��q;^��}��V6X�!��D���
;��>��>��y�ʟ#�Q�Po�[4�Eb�h�I�{�Sg`��N��)�e�ޠ\����jE*���������+�;����������AŁi-��F��'�Q$�� rH��kVo	Q�g[yǁ��tɩ�@�F ������  1������j�I�sQ�yc<�?�+]��H����O8FF�《8s7\[d����嗏g��:\A�t���	�KB����NoO����j���τCCL�	Z����'y�l�1��^�Sb�:���7���覬v�]{�d]S�"D�u��F��n��M�ɿ��|As`�!�S?�����V��0]�Ѕ�P"\
�F�Y|�fQ�\��w�w�ӆO�߱��Ö˩���fk��8�G�~��K��7c�p[s�?��G�VS��%�~��.�}NAJ-��nG�D;$&��6\�6����k�GA`�kx���brdC�����d�/3�!��$=�m�P��Z^<%7�o�����p��j-"o�%y݄>�_��P�����$+K�&��SȠ^���P?Z�E���Yd�RbiM�%�ْYk$�f�vs��kaG�S������R���ptL�/@�����n0����1Fݵ��H�N��2E��Sݑߗ�	ZZ�F����1�iȉ �����~c�9*Y�"���3�:~T]M���
����K	���K�E휇$����)Yxԃ�4�w%��%�b�I��=��\�,��s�;�����B��y�V7� D��l�sY�Bמ�wED��T�R��]<�����/��������u���Ѡ���C.~D?���Q��2���[���%x���E�'�*
��U��S��zy�%�^~��d�����fY/��/�^>�-5����m�q�<+猳X�W�= �n"�\̿�γ4޸�����^���anqF9ہ���A�r&𔿓�DCW\fK��-)?�K���+�D���μ�٨H�~��kc.�ج������d�
�s�l�O-_�"�-	��^4yq�[>��q��ư?֩�W_^�%��.�S��7L�`@���":�M��[��&j����@P��iZ��"��_F����'��@?V�~��{��y[�/$����@���;�h�0�:*��t��sn(�Af�Q��p��!����������9�F���H��WW���t��m�%T�a�A��co}��U���{ie�Zź+�w�$�g�ۡ�Ԫ�ظ�\�s�K��)�{�ab�=���D{1�>>���\��4#�0b�ߜM��{�~�~��o��> |���U3����j��z�#%��G��B�2����'nbaNAJtn�u7A����3{���)�qU����r͎�
�*�T�5S�C�cy:O|�mX_aPl�h$���Vej~'g�Pܾx����Wl��s&��G�������E����/*B_�i�XI	�q��|a���y�v�X����cY%��A�V*_7����A\޻���H\s�3��R� e[G�8Nbl[í����qKqj�Z�V/H��d���<ڝo����6�^�m�[�H��7[���|�&A�2�=h��3��aseaeOm���_N�9v%��u��+�FkgT����I��.ap��A3�E���RR�Vel{[��/�I���(�Ɂ����1���sNf�l�����Zr�q"K��+|F��;Y8u5%a�q>��II��e�v�:����c�|�|稀���ڷ��*?�QT�r���d���vg�F(�9�/a�zo(z��$΂�TIq��"�3��F17�%�C��>'����r��4"x���fB���3�,q�%�xLs��˃�P1*���d$YUVU�u;�5Ww)����NY���<�9�ߢj���~�V�ϼ��F���x�c |h�zV���Y��� E7e������?���8���g�4��>�(���'M�E��oQ������Ҹ]%+��c�2�������p���?X>Ђ	�r�U���
>��Y�P�|�M#�uu���=�{J{��� ��I}��m��.*+�<�&%��II-�'V�`�h,],P��Y�X!�W�KEu>,�sFRAxFҙ�a��,����
��!�g��IiZf��^ME���A'M��_����x��KJʧќ����&�>��i�uZ��Gi� �}���^lf�X��o�A-i��X� Є�"^j�o�.������V'�/6�	'����Y�1=�)+U��܊��o�a�����N����9Ve	n��C��l��a����g���V�J �6)ɟ.���� qErX;�<�²�f|b�ia/��ҧ�JQ;�pv�ʎ,�M����P��[E͡������Äj5>9S�Mp��Gi�ѐ\���%��?-Y|T"��"H�"��������"���?�~98��'K�$TZID�Ф���v�3n�T���<@N՛i~p���5-��'ud��?B�2���?�ccp`|��F��~�>�Ï���rk��h��3t>�^M��D ��eY��_A`�W�� �2=#ӿ4i�	І�