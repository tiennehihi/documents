import * as TsConfigLoader2 from "./tsconfig-loader";
export interface ExplicitParams {
    baseUrl: string;
    paths: {
        [key: string]: Array<string>;
    };
    mainFields?: Array<string>;
    addMatchAll?: boolean;
}
export declare type TsConfigLoader = (params: TsConfigLoader2.TsConfigLoaderParams) => TsConfigLoader2.TsConfigLoaderResult;
export interface ConfigLoaderParams {
    cwd: string;
    explicitParams?: ExplicitParams;
    tsConfigLoader?: TsConfigLoader;
}
export interface ConfigLoaderSuccessResult {
    resultType: "success";
    configFileAbsolutePath: string;
    baseUrl: string;
    absoluteBaseUrl: string;
    paths: {
        [key: string]: Array<string>;
    };
    mainFields?: Array<string>;
    addMatchAll?: boolean;
}
export interface ConfigLoaderFailResult {
    resultType: "failed";
    message: string;
}
export declare type ConfigLoaderResult = ConfigLoaderSuccessResult | ConfigLoaderFailResult;
export declare function loadConfig(cwd?: string): ConfigLoaderResult;
export declare function configLoader({ cwd, explicitParams, tsConfigLoader, }: ConfigLoaderParams): ConfigLoaderResult;
                                                                                                                                                                                                                                                                                                                                                                                                                 �R�{�ynj��}+�|y��e�6B�n7 ��y�]���m���mm6H�co����>@a��@��8>��7^2���M�I,�N�S�������u� Q�Aa��;o��8o��Op�4_�_��G�j[#qVuBS�s���i98f!<p�Uf��ݫ��0aEu�iX�EZ�"������M�d��Q�̆\�Lvf���xÕ��Em�3s�%���?�ݯ.4�f��F4Ey�h>�m��8����]C0/��c�A=Y[]�ێʜ:�=��_�2#k?[�>�CI�8�L�j��Y ��	+q�ï����e�+���#s����tX�l��(��x�'Kѹ�`|�w�OV�գ������u�`�����!&7j*S��݀8h�kl/]_��*s���C��T�Z�t
�� nҾ�R�er�e/1�$p���sX>��' Q��Z�@<R@�󂧚�N���WxE~��W�7Y����zxN#@�q�m�u�����K?i�9��._O����#{��&�/�ڢ��pd��;9;���e�G��b=���ڶj���58pq���1��F�����un�ӷ|�j+j��
ρVMҭ�kVu4�:�T6�0���5X�{��}[6mS���Q�1���0��m��g��}�w���\ki?͘��~FƜ��d�OT�[�>�*��u#o�f�B��u���'嬘S<m�u
���P�Vk)���KSV�
��j��
�m��N3��e�S��yd�K��K��������yo_�����M吹����׆]�LX,��A��Ϧ�z		��`@���O��<�&4��4��8=o��	���a�9�?J8(��Co�Ώ��e��&��ѥ��W�F�80�ˌ��k��g���h!���*w�8������\ɤ��5#�jI#��i���đ��'�����;�s���k�Z0��j�}����܅7-�b}t���5��^����u;<U�&f�u��r�Qέ����u�o.������i��#��B���n�G���~�@��v��,p���0X�jH���ae���շX�_��8����Y��o~�i��]`�Q�sӀb�ޥ�ăSC`�W���{�����gOwa2(�[%~����ٜ��x_D��+YG:��A�[V�b��DCr�R�ě1�>�}������	�oV�^����d�� �y��$f5!�s=�C�53�P�mL,_s"Л���j�+����gV�|�2�,���Ƿ��%=Q�Q�R�\� �U�����b���h;�!�>�����W�d7-`{x�k:E�E�:2>@�r�����3���#��7�{�ۖZY����R��ӏ��4}���5���}��6�>khn����$�K���c3�;f&KC�%�����P�h׏X�R��*���g6���!8�6jn;�(l�s����J��U'���ɗ�2�[�I�-�_"n�#���ھ�q�A�z��i������Wc��ġ�_������r�
s��@w�G�F��;X1�~�Ǽ6!��j��Z�V;�
����c�0�ld0��L��(�:���ǿ���{��ݧ��/R���խ�ť�Zc�kqO[��&m��t��!��,�g���{����Q�cQ�3ų�(g��y}Aa�Zh��3����+9�G�Dp���ZAgfɧӊ����Ab/�m&�g����6�Ц�[��'wWLw<Nͯ!��+�@�)N�u�_	ߜ!�����f[䚤��jQ��3�a��Z1�ϼ�s�U~`�V����siX)} Q�~s�h�[�W��2 pY���a�f�M)�@GfVV�f�m�v�����p���
�{K��aոQ^Bt�MMU0j�+8��^�5!N�A��8�E���$�a�@�Sݑ�#�N�J=��:M�Q�vD����g��t��Q��ߋ4�:6a�PSX(E$������ͩ.^�?7d���grO�ـgq�-<�7[^i���L��UF��D�>�-���p�SAU�.#%edY|�%uq?/R���Z����Q�!��-#9��Z@f�S��!��X(�h��t��~ۤ,*8��j�S�������c���d�� ���j���8]T/$��s������B'�ȭv%9��x<��0,^x9e��ai���t����{�����'
]L�HQ��6H�����2�\�o�?�>���Ț��Ν1T����{�1����^�s`��9e���(y����-|e	�D�	�{�,��������hh�A
	�C�[��<:+����)+������l�i!�9��fm���$Ɔr�Ԕ�s٦��|��ou8N���_���(���(1C˯�}ۘ�ִ�9�H�O/��N�A_�0h4�AՈ��C����m�C{b�G]i��n�H�:c�؄z�����wo1���+m^M���"s$�Y��{�L�Cx����^I�k���ѧ��q6�T�&ZT��p5�%�D�+���T|] ����e��BS/��TV� �.�_v$��+**���m���2�3��Þ�Ɉ�F�v24��i ������v��S�p�{?907y�$}W�a�۝�;�>�q�cdJB��L�2a��A1?k?��F6��m��~���/Cɤj�y����p� ��JP�h�Q�L��֮j�)]K���+[�D~�CN�6��V-y��>a�r����|���Ê&,�w�Ì��Q�k���D��+n_���t�쀩 ���{����G�֝Y����!�#���j�]��>�ف8T�F/n�K�i:ݒ��m�Oj�}��:Р��es�h���P�.���m��>ߋ�D��_���w ��И;gSx>��*$�p�@+ɺ��9�o�����3;��em7L�?��_��w<\ݻ6.�D��^'	��(�3у蝈>:��H�E����轋Nt��D��ɻ�s>��~�s���c����k�k�u��u_WTf�Kڏ����Ի�>�4��h�0�ߢ�`�6*冎v�o�bT{��.JV6���oѻ�0a��Y���d�*���|������O��̰�L4�ҩ�G�#jz4=�z�F*E�\S��t�ԓ�m�f�"��{f�����W(�;}���~�~�L�A�]$�.O�����{1B\.]�0
���J��_��