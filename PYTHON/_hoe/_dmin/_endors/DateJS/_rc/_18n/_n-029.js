"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferSingleRun = void 0;
const path_1 = require("path");
/**
 * ESLint (and therefore typescript-eslint) is used in both "single run"/one-time contexts,
 * such as an ESLint CLI invocation, and long-running sessions (such as continuous feedback
 * on a file in an IDE).
 *
 * When typescript-eslint handles TypeScript Program management behind the scenes, this distinction
 * is important because there is significant overhead to managing the so called Watch Programs
 * needed for the long-running use-case. We therefore use the following logic to figure out which
 * of these contexts applies to the current execution.
 *
 * @returns Whether this is part of a single run, rather than a long-running process.
 */
function inferSingleRun(options) {
    if (
    // single-run implies type-aware linting - no projects means we can't be in single-run mode
    (options === null || options === void 0 ? void 0 : options.project) == null ||
        // programs passed via options means the user should be managing the programs, so we shouldn't
        // be creating our own single-run programs accidentally
        (options === null || options === void 0 ? void 0 : options.programs) != null) {
        return false;
    }
    // Allow users to explicitly inform us of their intent to perform a single run (or not) with TSESTREE_SINGLE_RUN
    if (process.env.TSESTREE_SINGLE_RUN === 'false') {
        return false;
    }
    if (process.env.TSESTREE_SINGLE_RUN === 'true') {
        return true;
    }
    // Currently behind a flag while we gather real-world feedback
    if (options === null || options === void 0 ? void 0 : options.allowAutomaticSingleRunInference) {
        if (
        // Default to single runs for CI processes. CI=true is set by most CI providers by default.
        process.env.CI === 'true' ||
            // This will be true for invocations such as `npx eslint ...` and `./node_modules/.bin/eslint ...`
            process.argv[1].endsWith((0, path_1.normalize)('node_modules/.bin/eslint'))) {
            return true;
        }
    }
    /**
     * We default to assuming that this run could be part of a long-running session (e.g. in an IDE)
     * and watch programs will therefore be required.
     *
     * Unless we can reliably infer otherwise, we default to assuming that this run could be part
     * of a long-running session (e.g. in an IDE) and watch programs will therefore be required
     */
    return false;
}
exports.inferSingleRun = inferSingleRun;
//# sourceMappingURL=inferSingleRun.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ���K�6�1zu(��:�づ�..���EB�d#�{9�	��5݋��z�(�,�M�/o�!	���͡4Nz�^)d4��$��u�Z��,������ c��E�y��8��G4O�P3Ʒ�¸#��!��7o�i�
����t:��Q�Xo���+/�|��+����!e�3c�)���tF?�=Z7o+�d�t�Z)�klQ@җN!^�l`�)��'k_� ��@u��I�7�C�Vx\W�8�GS ��$�*����W�[_M|��W��h��
	�d/WTջ+rt�:k��?q��&n�ZiK��5l�.͍�Bj�F �_��p�ʪ�7i��,��
�z�)PK    n�VXXF�{  Q  -   react-app/node_modules/ajv/lib/dot/custom.jst�W�n�8}�W������}�V0�I���	�/IQ(2�U$���5�{gxIIN[ ������!}<���m�WT�(ꪁ���m�yͽ�����vx����?_g"�ܙ �3�|W2HA<n\�y�Q��`��4z��m U&���8/릨���Y��%��>+��A��,̆���mQ24STeQ��K���B����/:[�����Vx���d?~�l� 2y�OR|?bƶI7��^�w�3{�zѫmҗ~���:x�-�������"�5�~��HA;n�軃c�pC�FB��������b�kإ����T@$��¿ ��3V��M=K1pl3^)�>��҄�-I,��M&���x�������`��k-Ub�j�e�g�H�ty�� \sN��6�H�XdZ����<($ӟ�F�����Jn&�������b9�^,��g^�B�^�b�ER����@�5챚9ә���M##�I&w�Zծ,�i?fd
�d��e�&��L�L���Sȥ�İ���LfD�a��V4�m�4�u%��C#RR�ܰr�B2'lS��i=�i
��lhmB� ���ӿ��h+�l԰�B��y�_`�;R���S�7g���E�x]�\Ɠ��u@F|X���,��Л����h۴�^b���E4��<��nY�rr���wt�iv���Jr[��1]��o�c�0']���+�x�\a��p|�,?��S	���,!��aP�A��q�s��a0�ַ�6��Ǻa�B�o�d5H��L�NkU����^���H��P�ԃr�<[��I�m���'2�ޝ)��Eh|��SV��~�jK�	˽ V�
����t��c�8A��}ɠ��+���&nL+M�Ơ����۳��X��1I�H�ld��K�U��`D�Fjek��0��J�m��l��l?hG���Z���8�jw��#{**��ם�h_>Av��L�[��ǐ���)�WJX�Up��m��BU�r�=�7d��}�@������C�S�r_�ZA����~>&��aӿ�L��0c�1�[b�4�_)8[U��h�8�2��6[�2tF$����5=p������de%�C�,�u�9 ��$�������ʣ'��7nx�e\�kݥ!iz������ٕb鵳���r�2���a��B���I��b*���`�q�:����p��Y��?nK��6A�^t�Mū��}cF��P�/e;,��ɤ���(<٣�n65� ��������~��Z�7�"$�c�ӕ]�"��M
�9VVβ� ����tp�·;h�{N�a҆����]��m�]����� <��gNA����(���'��ǐ��םk"��N���sR�)�/�u]!��N��ᑒUO�W��
yw�Hq�i��"�!k��Dy���PK    m�VXovD�    /   react-app/node_modules/ajv/lib/dot/defaults.def�T�N�0}�+�,I!>`	�}P�%�h|�e`�,%mqC��RZ�qW����2�gΜt�b�Q*-�S�Ӧ�K��V@e�fۚ	*�)�^E�� h��Z�HHN��0�,�5��gc�J� 1+�TZ�1���%8�VbNS����<�$��d	�jR �v)�'e8Sa)䆳T��3��K��ы���J�.�4��V�T��V�i���t��m-[22����ᬚ��BȜ�����g����&UW�IӗG�磁/֛�8~sֱ�@<����k}�UA��7�}{ր�z=ojjCp�Y�\Rcc{SS�,�MA6Σz��'v��rn��q-��
L$�m����o�Z����)5$��"���	8r[͢fN{�q6����$-��m�&c�fϿ��bk<h��ĭ��ݱ������O��6�t�>���PK    m�VX�^�  �  2   react-app/node_modules/ajv/lib/dot/definitions.def�W[o�6~ϯ`��`���hW3�&��u�l}	C�i[�,
$ו��wxu�`ID���/)ˋ���1üȿ�Þ������_=G��