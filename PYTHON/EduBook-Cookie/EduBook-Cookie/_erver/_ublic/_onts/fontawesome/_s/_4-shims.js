var superPropBase = require("./superPropBase.js");
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get.bind(), module.exports.__esModule = true, module.exports["default"] = module.exports;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
  return _get.apply(this, arguments);
}
module.exports = _get, module.exports.__esModule = true, module.exports["default"] = module.exports;                                                                                                                                                                                                  eWeb/node_modules/axios/lib/utils.js
          `3Ce� ���e����Lf�PK     #WVX�n�vw  <  > $           V�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/axios/LICENSE
          `3Ce� ���e�` �Lf�PK     #WVXP�'   %   I $           )�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/axios/MIGRATION_GUIDE.md
          `3Ce� ���e� ��Lf�PK     #WVX�O��	  �  C $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/axios/package.json
          `3Ce� ���e��:�Lf�PK     #WVXMI�ǹD  ��  @ $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/axios/README.md
          `3Ce� ���e����Lf�PK     #WVX��(��   "  B $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/axios/SECURITY.md
          `3Ce� ���e�`U�Lf�PK 
     �BVX            @ $          ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/balanced-match/
          {�o-e� ���e��b�Lf�PK 
     �BVX            H $          P�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/balanced-match/.github/
          {�o-e� ���e�@��Lf�PK     �BVXkT+27   5   S $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/balanced-match/.github/FUNDING.yml
          {�o-e� ���e� }�Lf�PK     �BVX3����  �  H $           ^�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/balanced-match/index.js
          NWn-e� ���e�`�Mf�PK     �BVX����  H  J $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/balanced-match/LICENSE.md
          {�o-e� ���e� Mf�PK     �BVX+���  -  L $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/balanced-match/package.json
          NWn-e� ���e�@Mf�PK     �BVXk�0�  �  I $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/balanced-match/README.md
          {�o-e� ���e��+
Mf�PK 
     GVX            C $          I2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/binary-extensions/
          )�a2e� ���e�`�Mf�PK     GVX\�X�  n  Y $           �2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/binary-extensions/binary-extensions.json
          )�a2e� ���e� FMf�PK     GVX��rAE   W   ^ $           �	2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/binary-extensions/binary-extensions.json.d.ts
          )�a2e� ���e���Mf�PK     GVX�'q�   �   M $           �
2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/binary-extensions/index.d.ts
          )�a2e� ���e��`Mf�PK     GVX��D8   6   K $           �2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/binary-extensions/index.js
          )�a2e� ���e�`�Mf�PK     GVX}���  �  J $           S2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/binary-extensions/license
          )�a2e� ���e��Mf�PK     GVX�h+X/  �  O $           V2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/binary-extensions/package.json
          )�a2e� ���e�@�Mf�PK     GVXb|�m  �  L $           �2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/binary-extensions/readme.md
          )�a2e� ���e� $Mf�PK 
     �BVX            A $          k2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/brace-expansion/
          {�o-e� ���e�`)'Mf�PK     �BVX�<�  �  I $           �2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/brace-expansion/index.js
          NWn-e� ���e� �(Mf�PK     �BVX�ϗ��  H  H $           (2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/brace-expansion/LICENSE
          {�o-e� ���e�@�+Mf�PK     �BVX���V�  Y  M $           2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/brace-expansion/package.json
          NWn-e� ���e���.Mf�PK     �BVXӮ  �  J $           W 2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/brace-expansion/README.md
          {�o-e� ���e�`^3Mf�PK 
     GVX            8 $          �'2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/
          )�a2e� ���e� �4Mf�PK     GVXy�G_     D $           -(2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/CHANGELOG.md
          )�a2e� ���e�@�7Mf�PK     GVXc}8�    @ $           �/2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/index.js
          )�a2e� ���e���:Mf�PK 
     GVX            < $          �42CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/lib/
          )�a2e� ���e� �<Mf�PK     GVX�H��  �  F $           52CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/lib/compile.js
          )�a2e� ���e� AMf�PK     GVX���  9  H $           u72CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/lib/constants.js
          )�a2e� ���e�@'DMf�PK     GVXa�;�  �
  E $           Z:2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/lib/expand.js
          )�a2e� ���e��EMf�PK     GVX�}�    D $           b>2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/lib/parse.js
          )�a2e� ���e� �HMf�PK     GVX3'�`(  �  H $           �E2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/lib/stringify.js
          )�a2e� ���e� OMMf�PK     GVX�;�/,  �	  D $           gG2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/lib/utils.js
          )�a2e� ���e���QMf�PK     GVX���d�  @  ? $           �J2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/LICENSE
          )�a2e� ���e��iSMf�PK     GVX$�Q�  o  D $           �M2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/package.json
          )�a2e� ���e��vVMf�PK     GVX�Dt|�  �R  A $           �P2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/braces/README.md
          )�a2e� ���e�`�WMf�PK 
     �BVX            > $          �m2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/browserslist/
          {�o-e� ���e��
[Mf�PK     �BVX}rJņ  D  H $           ,n2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/browserslist/browser.js
          {�o-e� ���e��^Mf�PK     �BVX�h ��  �  D $           p2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/browserslist/cli.js
          {�o-e� ���e� %aMf�PK     �BVXU�jh   �   H $           v2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/browserslist/error.d.ts
          {�o-e� ���e� �eMf�PK     �BVX��6�   +  F $           �v2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/browserslist/error.js
          {�o-e� ���e�@�hMf�PK     �BVX�cT��  �  H $           �w2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/browserslist/index.d.ts
          {�o-e� ���e��LjMf�PK     �BVX3E蘈  *�  F $           ~2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/browserslist/index.js
          {�o-e� ���e���nMf�PK     �BVX�n'
�  ^  E $           	�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/browserslist/LICENSE
          NWn-e� ���e� �qMf�PK     �BVX�J�G�  �-  E $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/browserslist/node.js
          {�o-e� ���e�@�tMf�PK     �BVX2����  -  J $           6�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/browserslist/package.json
          {�o-e� ���e���vMf�PK     �BVX$��-�  �  F $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/browserslist/parse.js
          {�o-e� ���e��{Mf�PK     �BVX�l'r  [  G $           |�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/browserslist/README.md
          {�o-e� ���e� #~Mf�PK 
     �BVX            ; $          S�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/
          {�o-e� ���e�ංMf�PK     �BVX��   
   H $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/.eslintignore
          NWn-e� ���e� ąMf�PK     �BVX�3�0�   �   D $           �2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/.eslintrc
          NWn-e� ���e�`шMf�PK 
     �BVX            C $          �2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/.github/
          {�o-e� ���e��ދMf�PK     �BVX��a  D  N $           {�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/.github/FUNDING.yml
          {�o-e� ���e���Mf�PK     �BVX)&Q�l   �   A $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/.nycrc
          {�o-e� ���e� ��Mf�PK     �BVX����   �  G $           Ƿ2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/callBound.js
          {�o-e� ���e���Mf�PK     �BVX���{
  �  G $           �2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/CHANGELOG.md
          {�o-e� ���e���Mf�PK     �BVXul`�    C $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/index.js
          {�o-e� ���e�@��Mf�PK     �BVXu��v  /  B $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/LICENSE
          {�o-e� ���e� .�Mf�PK     �BVXفʑ�   	  G $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/package.json
          {�o-e� ���e����Mf�PK     �BVX����  �  D $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/README.md
          {�o-e� ���e��H�Mf�PK 
     �BVX            @ $          ^�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/test/
          {�o-e� ���e��U�Mf�PK     �BVX��:Ac  -	  L $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/test/callBound.js
          {�o-e� ���e� c�Mf�PK     �BVX�C-�  �  H $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/call-bind/test/index.js
          {�o-e� ���e���Mf�PK 
     �BVX            ; $          ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/callsites/
          {�o-e� ���e� ��Mf�PK     �BVX�3�S  /	  E $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/callsites/index.d.ts
          NWn-e� ���e�@�Mf�PK     �BVX�`C��   k  C $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/callsites/index.js
          {�o-e� ���e�@�Mf�PK     �BVX�E�}z  U  B $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/callsites/license
          {�o-e� ���e���Mf�PK     �BVXC ,�?  n  G $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/callsites/package.json
          NWn-e� ���e�`��Mf�PK     �BVX��g�+  _  D $           G�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/callsites/readme.md
          {�o-e� ���e�@9�Mf�PK 
     GVX            ? $          ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/camelcase-css/
          )�a2e� ���e��F�Mf�PK     GVX�=�FX  �  K $           1�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/camelcase-css/index-es5.js
          )�a2e� ���e��S�Mf�PK     GVX�]c06    G $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/camelcase-css/index.js
          )�a2e� ���e�`��Mf�PK     GVX3�ш  W  F $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/camelcase-css/license
          )�a2e� ���e����Mf�PK     GVX��U�  \  K $           y�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/camelcase-css/package.json
          )�a2e� ���e��{�Mf�PK     GVX��:�  f  H $           ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/camelcase-css/README.md
          )�a2e� ���e� �Mf�PK 
     �BVX            > $          l�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/
          {�o-e� ���e���Mf�PK 
     �BVX            C $          ��2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/
          {�o-e� ���e�@��Mf�PK     �BVX�����  �O  L $           )�2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/agents.js
          {�o-e� ���e����Mf�PK     �BVXQ��   �   N $           m2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/browsers.js
          {�o-e� ���e� 7�Mf�PK     �BVX�h�N{  �  U $           y2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/browserVersions.js
          {�o-e� ���e� ��Mf�PK 
     �BVX            L $          g2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/
          {�o-e� ���e�@��Mf�PK     �BVXi��aZ  �  R $           �2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/aac.js
          {�o-e� ���e����Mf�PK     �BVXJ�g�W  �  ^ $           �2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/abortcontroller.js
          {�o-e� ���e����Mf�PK     �BVXoTP  ~  V $           n2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/ac3-ec3.js
          {�o-e� ���e�  �Mf�PK     �BVXf�|H  Y  \ $           22CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/accelerometer.js
          {�o-e� ���e����Mf�PK     �BVX�[�E  T  _ $           �2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/addeventlistener.js
          {�o-e� ���e� ��Mf�PK     �BVX�X��G  W  c $           �2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/alternate-stylesheet.js
          {�o-e� ���e� 5�Mf�PK     �BVX�S  l  \ $           ~2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/ambient-light.js
          {�o-e� ���e����Mf�PK     �BVX�t�C  i  S $           K2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/apng.js
          {�o-e� ���e����Mf�PK     �BVX,��R  v  _ $           �!2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/array-find-index.js
          {�o-e� ���e� ��Mf�PK     �BVX�g�XR  x  Y $           �$2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/array-find.js
          {�o-e� ���e�`�Nf�PK     �BVX�v�Q  ~  Y $           �'2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/array-flat.js
          {�o-e� ���e���Nf�PK     �BVX8��NR  t  ] $           _*2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/array-includes.js
          {�o-e� ���e���Nf�PK     �BVX��8uC  e  ^ $           ,-2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/arrow-functions.js
          {�o-e� ���e� Nf�PK     �BVX��xG  r  T $           �/2CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/asmjs.js
          {�o-e� ���e� �Nf�PK     �BVX�8�d  �  ^ $           �22CNWEB/BTLCongNgheWeb/BTLCongNgheWeb/node_modules/caniuse-lite/data/features/async-clipboard.js
          {�o-e� ���e�@�Nf�PK     �BVX�/�X  �  ^ $           �52"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const HTMLConstructor_helpers_html_constructor = require("../helpers/html-constructor.js").HTMLConstructor;
const ceReactionsPreSteps_helpers_custom_elements = require("../helpers/custom-elements.js").ceReactionsPreSteps;
const ceReactionsPostSteps_helpers_custom_elements = require("../helpers/custom-elements.js").ceReactionsPostSteps;
const implSymbol = utils.implSymbol;
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const HTMLElement = require("./HTMLElement.js");

const interfaceName = "HTMLDirectoryElement";

exports.is = value => {
  return utils.isObject(value) && utils.hasOwn(value, implSymbol) && value[implSymbol] instanceof Impl.implementation;
};
exports.isImpl = value => {
  return utils.isObject(value) && value instanceof Impl.implementation;
};
exports.convert = (value, { context = "The provided value" } = {}) => {
  if (exports.is(value)) {
    return utils.implForWrapper(value);
  }
  throw new TypeError(`${context} is not of type 'HTML