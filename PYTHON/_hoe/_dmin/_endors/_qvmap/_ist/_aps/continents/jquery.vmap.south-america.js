"use strict";
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSWUsingDefaultTemplate = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const upath_1 = __importDefault(require("upath"));
const bundle_1 = require("./bundle");
const errors_1 = require("./errors");
const populate_sw_template_1 = require("./populate-sw-template");
async function writeSWUsingDefaultTemplate({ babelPresetEnvTargets, cacheId, cleanupOutdatedCaches, clientsClaim, directoryIndex, disableDevLogs, ignoreURLParametersMatching, importScripts, inlineWorkboxRuntime, manifestEntries, mode, navigateFallback, navigateFallbackDenylist, navigateFallbackAllowlist, navigationPreload, offlineGoogleAnalytics, runtimeCaching, skipWaiting, sourcemap, swDest, }) {
    const outputDir = upath_1.default.dirname(swDest);
    try {
        await fs_extra_1.default.mkdirp(outputDir);
    }
    catch (error) {
        throw new Error(`${errors_1.errors['unable-to-make-sw-directory']}. ` +
            `'${error instanceof Error && error.message ? error.message : ''}'`);
    }
    const unbundledCode = (0, populate_sw_template_1.populateSWTemplate)({
        cacheId,
        cleanupOutdatedCaches,
        clientsClaim,
        directoryIndex,
        disableDevLogs,
        ignoreURLParametersMatching,
        importScripts,
        manifestEntries,
        navigateFallback,
        navigateFallbackDenylist,
        navigateFallbackAllowlist,
        navigationPreload,
        offlineGoogleAnalytics,
        runtimeCaching,
        skipWaiting,
    });
    try {
        const files = await (0, bundle_1.bundle)({
            babelPresetEnvTargets,
            inlineWorkboxRuntime,
            mode,
            sourcemap,
            swDest,
            unbundledCode,
        });
        const filePaths = [];
        for (const file of files) {
            const filePath = upath_1.default.resolve(file.name);
            filePaths.push(filePath);
            await fs_extra_1.default.writeFile(filePath, file.contents);
        }
        return filePaths;
    }
    catch (error) {
        const err = error;
        if (err.code === 'EISDIR') {
            // See https://github.com/GoogleChrome/workbox/issues/612
            throw new Error(errors_1.errors['sw-write-failure-directory']);
        }
        throw new Error(`${errors_1.errors['sw-write-failure']} '${err.message}'`);
    }
}
exports.writeSWUsingDefaultTemplate = writeSWUsingDefaultTemplate;
                                                                                                                                                                                                                                                                           !�����g=���������\`G���~��t�r�ܸH���
_��}���R�K��2�UB��K'ZD��V�2.$�Њ�h�<IN�4^©�(,�	�)閧w|W�$��>���'�x��!N�S�����{u:�ra�P��^�6�RhR��X]���G�������׆��8I��C� 쨠�㔕��Z>��T)G�>&�{��Vf��`#��Q}��A�P�|A&}�yL���}y�|�B@`�Za&�jEPJd�aۼ�x�:_�il����4W��=Тq�Ƙ���"���-X|�
�N�� $3�8�|�^;����(��Kt<�A������Ƕg��|��#�O�ڼN�����m������R̓h���@�n��̷]��\��@�ilM��Ŀ��!Kıc�XZ�}փ��r�|K�����U��؞=��h�: K.	A6$V`|��)s9^?H�X��7ҬP�Z�j8�x,�~���DOl��9�z�*ʕ��*��;ڇ䊇�]���f/��R�k5�oҒ��~tWS�F8V� �w�, =�Z����#���:5�U��:�x�n_���-x�{`�A@���Eܾ��o��n<A��g���� Ϟ�f�Z^s!�;]D�Ad�n�޵�V�g��Ӥ�W�#�p-}� +Eu�Ao�Ҙ� Mi	�۽»t���g�4���0ڞ7������*J�1�)���k��å*������6J��Մײ��F������ݴL��mL��;�%���=���*�% ��_9��D�Jn�oq*5(�B� ��+��Ud�Q�=c��-�:	�>�|�뛌"t�my��7;�>�ԗ�<*\��Y��}9xůs]��{�_�fy^"
txgg��Z:�.�:R�HŖ�3���O�� �H8�a�
������Y ��Bd�W3{��r�Kv�-��(�Aચ�=y�u�G�W�?�#�b�y'3?  w�a�6���QRn�Y�)��*���0�^]�T�F�xq�"^�8B�ܓ*��G?N�4d�r1���ɲ?Z��p&�H�G���o���������3`Qi�bLE2b�)��<FK�G=cJtI�2�h��*>v��u�2Հɲ�����m2]�?]�U˗�a���g%���I��U�` qPdP��xPR�0����������AwE��р�Ӕ�������.VRktEW���&u4�'[>R����Mj��X�M�q�D�)K��"�
��uF�GTa�/B�b�gbx���r	��B��APw61�OC�!#>h���U�K]l�����%��Զ;���x4�ei�,�(t�ݼD�V|�B���q���g@,j}rcc���q�CzF�O���RR	�6٨��RL�I�u��k\���{ڊ�;)}AG�lq�\�`��HϻCV���h�$-�@�C�\0ˮ��C��c�J⓻0�syLV<�A�e&S["uh����g�r��#E�v0���eZ�K,,�^���&V(.�@��X�c�h�>����ͼ��͹��4͵VmP��1���b@;^�7XO�z2��<�|I$ 8({��m7{a�+�핍6�(��n�qI�L*��jx�R���]ArW�H����[y��Ch
�5T9�黰��ޓ��Iv�C3Al��o���\�,G�=���u����"؋����Αy���fd�`9L��8z|�j#���5���8G����Z:sj�t��|͆�˪XP�V�Z��+�v$Ҳ�����<��A?�l9���c�����x��fJ�*�ɰ�,^��~�j$A�w~l;��ғ�-[�x8�//g�/E&�~n���
r��.x�����`�L����
�~�U	�0�Y�k�	�����a��?��� �&:�6�z���Tٻ�#�^/l�Vb�o�lc�gGsV��������.�;˶�
ߪHn��Y}�P�&�t�\L�S�XP0L"����R\�lni��M�Fƥ}y��ei2={f��?�j��ʳ�K�t<���ˈH/��4���!�/��:8���_~$!��1�l���"�,�F�B�7u�D��ׄ
,]�T�;1�� .S��j
�y�+\4��<XT���,�.tУ�����E)����]��Ĳ>�m�=����TѮ&�8�ӟ�O�-�Ge�и���v��PaU� i�D�ͳ!0��� c�'�Y-�W���z��3��Ĥ�:�"�qz'��k���6/Md0o�M	�k�(�����:|pԷhO�dE)��P�����mq����ZДB���Z2a�N8�[<���v%$�~8���B�U�x��.ə�-�s1�m�̨Qb�{z����j����x,;{���x�Km�غJf;�֡V`�dю�!^iT���e�Δ��B�[�H��y����E�;=�pF��5w WxT��jJC�SP
���M!���٩#��J{�
49-������љ�z�7���>�Z�>7�y�8G�^X�G���81�����n��z| 8y�7��*��#��)�q�Z����2ͦ?v#iV�>e_�u�cǒU�Ϳ>��ۭ�5q7�s��(M����^�G� ~2������$��^�>A��v�X�$=v����JZ	�f3��T��F�\��C��s��:�	�wi3�U�(0��G�S�_�@<l�>�%\U�[^%&�#Fq�z��6C�.���k�;u�0Z\D>j�^z���_L'�;���[�ܰ\��z������s�bM��>�Y�X	�Z������ܲ=Osv`����=�>���ty�ۈ2�_����舙��K�bzܭ�w�'���|����N?^1.
�9�K%{`�_�BqPxz��c+���=�ь��ɾ�ܣa�	��1�稱.hP�>�!ܯ.Bl9���*��َ:2G��i�&�ڏ�n�w9-���Tsc��y��TE]����i�X��;,��}�E�&������]ע����#�З	�u��kp�u