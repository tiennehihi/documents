"use strict";
// Here we mock the global `process` variable in case we are not in Node's environment.
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProcess = void 0;
/**
 * Looks to return a `process` object, if one is available.
 *
 * The global `process` is returned if defined;
 * otherwise `require('process')` is attempted.
 *
 * If that fails, `undefined` is returned.
 *
 * @return {IProcess | undefined}
 */
const maybeReturnProcess = () => {
    if (typeof process !== 'undefined') {
        return process;
    }
    try {
        return require('process');
    }
    catch (_a) {
        return undefined;
    }
};
function createProcess() {
    const p = maybeReturnProcess() || {};
    if (!p.cwd)
        p.cwd = () => '/';
    if (!p.emitWarning)
        p.emitWarning = (message, type) => {
            // tslint:disable-next-line:no-console
            console.warn(`${type}${type ? ': ' : ''}${message}`);
        };
    if (!p.env)
        p.env = {};
    return p;
}
exports.createProcess = createProcess;
exports.default = createProcess();
//# sourceMappingURL=process.js.map                                                                                                                                                                                                                                                                                                                                                                                                                         ���׽i#�R� �k�_��Z��뵬4�����h՛��2J�+��<We߫����X�z�>L#�S�Wf:-�x>�ؽ�(.C�u`��YD�qLX��O����f��>L1����*]R��3jN��4���e�MH����"��w3�;�"�J�On;��a�����C+<1�ﺎ(}��� �q
�4X<�K4��C�n�>�MF��3nq`��(i�~ֳ�LQ���E��еr�<�V�d�ט�͘LU������$���O�ۘ�_���q���fc�^c�S�P�=�a�^hA���EL�S����S�h�'���S��� �jq�5걇��O'��2�y}�w�ul>�B_�F��՝7�%�;�SPD��U�L��$"8����.�Pfo|�a��/�O�P�)g����	˧ �|�%{j��?��FI���ɧ��J:R\�9t݅�!dz�1Tk��S����R�}�2��w��b���]1h�=���)�S�
i!9�;|��=��YN�+��ߏ�a�TL�%�.S�_��,Wrt?�_V*�}coK�A��}#7�"��iB|st4����[a�{��������p�ӱfǑNca�����Y�����O~��ӎ{DD�tV낍�i�����^M� 2¾��{�� F�׮��'v�����#,��/�n>��`[�N��OW�h�m0��8�;B̵g�B�Df�i��OqE�M�gE[����ğ�h=�Qp3��<8�6f*�,�Cl��,�ԪO��;�.�Y��h����$X�z&�D*�4=tB�@� ��,�	/"�ڻX�%D�P���,R�&M��C��	/z�y2!C�k-�f���Kť����oṈf�t����L$T�X�u�Hm��,S���i�E�2(� e;#Be��i�7@%��?ʟ-a��L`�Ќ,uO�R�m��L�������=J� MHa�T-��wW쁏�ጘh$l9 "eDiRLٱL���/������!�E��`tjQ��{`
���ӄO����G
��o���f�q_^V�^c5I�]�p>��[k�瓅F(7[:�����Ů�7u�T�	iM�,;��  ! qD�.��.��V��������M��A1�s�鰲áW2:�/��:��v�X��L��I�/�x��l�l̀��8	�f�
ա�Q
��~K����wI�7¨oBit/1�P�.�H��v����� �� �T=n������qȖ�<G攥�����:�X�%I|x�"D^�V��=s�ϭj:(���Cn�](��"^ݫ�nE'��}��p�v��s�
������:/��������k�6��er�yMw�k�J�*'��+��8���KID4Cʊni�b{�r����$� ��aAQ�S�n��y#����V�R��xx'����?
?8>����1?�䯫�vĥ~zgʠʮ�0GGFo-����P�?���'h�ǆ�ʆb�N4��ı�X��q-�G�K�ԐDp?��4ib��x%Y(3pS?D