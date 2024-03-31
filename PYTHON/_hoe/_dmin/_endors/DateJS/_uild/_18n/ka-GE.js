"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.suppress = void 0;
const child_process_1 = require("child_process");
const get_eslint_cli_1 = require("./utils/get-eslint-cli");
const print_help_1 = require("./utils/print-help");
function suppress() {
    const args = process.argv.slice(3);
    if (args.includes('--help') || args.includes('-h')) {
        (0, print_help_1.printSuppressHelp)();
        process.exit(0);
    }
    // Use reduce to create an object with all the parsed arguments
    const parsedArgs = args.reduce((acc, arg, index, arr) => {
        if (arg === '--rule') {
            // continue because next arg should be the rule
        }
        else if (index > 0 && arr[index - 1] === '--rule' && arr[index + 1]) {
            acc.rules.push(arg);
        }
        else if (arg === '--all') {
            acc.all = true;
        }
        else if (arg.startsWith('--')) {
            throw new Error(`@rushstack/eslint-bulk: Unknown option: ${arg}`);
        }
        else {
            acc.files.push(arg);
        }
        return acc;
    }, { rules: [], all: false, files: [] });
    if (parsedArgs.files.length === 0) {
        throw new Error('@rushstack/eslint-bulk: Files argument is required. Use glob patterns to specify files or use `.` to suppress all files for the specified rules.');
    }
    if (parsedArgs.rules.length === 0 && !parsedArgs.all) {
        throw new Error('@rushstack/eslint-bulk: Please specify at least one rule to suppress. Use --all to suppress all rules.');
    }
    const eslintCLI = (0, get_eslint_cli_1.getEslintCli)(process.cwd());
    // Find the index of the last argument that starts with '--'
    const lastOptionIndex = args
        .map((arg, i) => (arg.startsWith('--') ? i : -1))
        .reduce((lastIndex, currentIndex) => Math.max(lastIndex, currentIndex), -1);
    // Check if options come before files
    if (parsedArgs.files.some((file) => args.indexOf(file) < lastOptionIndex)) {
        throw new Error('@rushstack/eslint-bulk: Unable to parse command line arguments. All options should come before files argument.');
    }
    const env = Object.assign({}, process.env);
    if (parsedArgs.all) {
        env.ESLINT_BULK_SUPPRESS = '*';
    }
    else if (parsedArgs.rules.length > 0) {
        env.ESLINT_BULK_SUPPRESS = parsedArgs.rules.join(',');
    }
    (0, child_process_1.exec)(`${eslintCLI} ${parsedArgs.files.join(' ')} --format=json`, { env }, (error, stdout, stderr) => {
        // if errorCount != 0, ESLint will process.exit(1) giving the false impression
        // that the exec failed, even though linting errors are to be expected
        const eslintOutputWithErrorRegex = /"errorCount":(?!0)\d+/;
        const isEslintError = error !== null && error.code === 1 && eslintOutputWithErrorRegex.test(stdout);
        if (error && !isEslintError) {
            throw new Error(`@rushstack/eslint-bulk execution error: ${error.message}`);
        }
        if (stderr) {
            throw new Error(`@rushstack/eslint-bulk ESLint errors: ${stderr}`);
        }
        if (parsedArgs.all) {
            console.log(`@rushstack/eslint-bulk: Successfully suppressed all rules for file(s) ${parsedArgs.files}`);
        }
        else if (parsedArgs.rules.length > 0) {
            console.log(`@rushstack/eslint-bulk: Successfully suppressed rules ${parsedArgs.rules} for file(s) ${parsedArgs.files}`);
        }
    });
}
exports.suppress = suppress;
//# sourceMappingURL=suppress.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                  �����V;N(���~���|�����Y/���.�AZMoZ(���nJ���#@5��z=�$�������� 0sl�ҟ�5����umK0�|�N��%ߑ���&U9<ZW��c?0:Q1�W?ͽ�Ig���LQ��ڂo�TU(�o��
�2sZ����|�Vd-��w��Za͖(���
B� fP]rG[GR��l½�|l��I0R~���;$0�z��j�Ã�%��v�uK�I���2/&���NU<��	~�Y�d�pho-���*�\�&)����7��N�'���V�3l�˵#u^8�����351����u�����]��v��IK�)��B�^����S�׀�s�mK���aw	�B���u�)��
��P��B�,�U0� �^,�^.���%��:�ɪ�Jq��g��n&s�b�P�}��6N�eG���`�N�21���mf��l"[�W�֑�M^6z��w���]���-�A7+�WC��O�"��;�ȏ��RN�I�/�/��kr��T4�W�YUY�/Lp��̔w	�wf���=�m���hg��4�L��i����J�`QXv��Teڌ_(\P�ʞ��K نq���&6�A���s� ��C���'1�c�1�eѵ��T��t���¢�Qr���7�X�*�К)~���l㧵v��)B�{8�l�y�ϗ�m.D<WN$z�Y���7^�&�x���\:g�Us�$��U�x��f�J��?�T��7�'>a P�o�cd����Mx�=�Bk
I���������ߩB�=�ީ�FL��:��V�P'��kHmj�O{����LP���O�j���N c[J�29��>Х�@f�#�R�)ڪ��CS���F���)��.Y��+ٚ�g��ӭ���h�Oe���i'U#���r��*O��$*�-�B���}��qMX67C=P�7fA��Ũݞa�9�E�0NZG)*���Fy��k �I`���#X�: �Z�qވ40��I�L6+|�}WjL+̔�Q�i|����QBƚfu������E��w��P [��׍4���{Z��sS)�%7�(��գDo6&���G�������=�ܒ�ZPaD�a�!̃�*&��$�%�&�S��+q���E��ճ��O3)�����J��yc��#BQR��2��������7� ����S���Nb�eY��S"+E�=��u��3{���O���zM-������HV<%nG�<��%���(��i�tzH�]�_U�H�hIf��!/��H���T�W�;"���fw����|��2���o�e�hv�l�w��i��i�M�m��!�kM�bX�m"�|�:�pRR���M5��/cNB"h��vKm��t����m\�C�4�e����Q]��*7C2�Y�z����t��)D��Z������IՔ���%��*��HbqN,����ZS[�[�&L�'	5�����U_+�J�ڒl���k�hB*Ћᯇ��q�d����F�h ��X�U�`^�-#�Fj]�.��'���8�/��\����8f��7�q8�~��}R�%֔��{��� ^�,X��݁�]�bdP�����'�p�)�U��b8�GYe�{H<�QóM�e�神C4Jk��9��Ҏ����n��F��v�s״�pPyX�Wͣ)��r�e
+�0%�s}�)��٘1���@��m���[|�7#��i�?�������|ɰ+�}�"s�<Kq�n���t&��K����,� ��G��˛��T�{+�m��%uc����58�7��~0X�]���o���J��IO@Q�	 �=�H�Fj��h:��+%A�9Y`�~�ٱ;��X���F#�wcB>&���G/B~���/g[�L�M.�ؗȜU�q��S��d"�n/�|�px�f��}2U��<q��,y�ڄ�5�Ԡ����v%��F����|S�t���kL��&mWGi�P��t3T�~����m�(������%V\9�Y�p�D�; W?��������Uz��{[V0�y� 7������\*z�z�W[	���%o�c��a(���<��s1�e��IU��	��ĿJ��%d�ٿ���9�:#r�	;#�g0�9��B� �*��㯑9��v��&o�K�l�Ӝ�t(���'IZ�3w