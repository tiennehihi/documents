import { Config, CosmiconfigResult, Loaders, LoadersSync } from './types';
declare type LoaderResult = Config | null;
export declare type Loader = ((filepath: string, content: string) => Promise<LoaderResult>) | LoaderSync;
export declare type LoaderSync = (filepath: string, content: string) => LoaderResult;
export declare type Transform = ((CosmiconfigResult: CosmiconfigResult) => Promise<CosmiconfigResult>) | TransformSync;
export declare type TransformSync = (CosmiconfigResult: CosmiconfigResult) => CosmiconfigResult;
interface OptionsBase {
    packageProp?: string | Array<string>;
    searchPlaces?: Array<string>;
    ignoreEmptySearchPlaces?: boolean;
    stopDir?: string;
    cache?: boolean;
}
export interface Options extends OptionsBase {
    loaders?: Loaders;
    transform?: Transform;
}
export interface OptionsSync extends OptionsBase {
    loaders?: LoadersSync;
    transform?: TransformSync;
}
declare function cosmiconfig(moduleName: string, options?: Options): {
    readonly search: (searchFrom?: string) => Promise<CosmiconfigResult>;
    readonly load: (filepath: string) => Promise<CosmiconfigResult>;
    readonly clearLoadCache: () => void;
    readonly clearSearchCache: () => void;
    readonly clearCaches: () => void;
};
declare function cosmiconfigSync(moduleName: string, options?: OptionsSync): {
    readonly search: (searchFrom?: string) => CosmiconfigResult;
    readonly load: (filepath: string) => CosmiconfigResult;
    readonly clearLoadCache: () => void;
    readonly clearSearchCache: () => void;
    readonly clearCaches: () => void;
};
declare const defaultLoaders: Readonly<{
    readonly '.cjs': LoaderSync;
    readonly '.js': LoaderSync;
    readonly '.json': LoaderSync;
    readonly '.yaml': LoaderSync;
    readonly '.yml': LoaderSync;
    readonly noExt: LoaderSync;
}>;
export { cosmiconfig, cosmiconfigSync, defaultLoaders };
//# sourceMappingURL=index.d.ts.map                                                                                                                            �ЦYJ1� �e�+���� �O8+I�a1L0TD,�Ҳw����ֽlyI�Ԥ5y��j�����e+b�2_|�����]4;n�4����@}���Ӵ20�Ը�n�*l�$���o���>��r|r�c9$=��ӭ��5N��d~��"=Xg�Ů��8�W�}�)�Z];o���lb%F%���\q��ᾎ֞;D��i�̈́�lɷ����T�*��%$	VBh���Ց"�<`�3m2u���(�r�V�\].[_�%�����g���^o���X�|(���F[_��&QID��Iy�k���2�&}!��M��㯠f,��o-rݯ�6����7�ߗ�3V�p|S�yʳ\%���-c����A�^p,�@@��D�^���$����K)��/Ķ��d��'�Q�P/ᥧ�1�&I�6!u�gѮ�WH��s�Z���������kcႄh����(5���oրZ�~h �HT��K��<Cl�|�)��{=�<���}t���@ϔG�;a�1��C7I ��+�@vC�\�s[ eO5����fJa����7��'��o}\��rz��*ACUO���!5�-e�s�*���Y��<������)7�V�t ���/Yc(�w]�hS�.�ðo\�S�z�u��s��J��s#�?,����iׇ��������
Ts�	,�urC&��Vtw,�NEc�۹0�����c�{��L���U���3�V\8U'	U�p��R��$�d�B�9�J��.̻�_���՝�0��$�l�_��`qM*��=e}��b�ޮ(ťt��������a������RP*�̡��E�QD|k1ߠz�̘81�XWr�����	�Fs�D�����+�:?L@��O9�&�����0�+�5���I�eM"j�x��Q�z����=\X7�6�{C�W�������-=���Z�꽬ӫ3 D�Q�Hp^Cy���y��8Z���V�-�La�����w�n���R�Zh����rw}�´�}�7���S����gCڈ}���q������\��tQH��Jv1�*>�U��Z�� �ѽ���C�`3�S��̏ӝ�Q��%�B�����<�M�p��W��D{�G�I��*�/�XVtESNc$Q(�N��q���{,8C&SQyD�Be���iS���ơu�L
�	��-Vؔ��](P�u��j��������;�C�O�{q?�e	�n�'.R�t�Lj)�6(5~��jv����������Mu��V*k�z��E��}l����� .�ٜ�78t�d��YW�z%)Z>H��Z��F\��D�>�2"}I��8	O@͙!�K�@Zs��.5֚�-h��C��Z�BmW��W�gPa���G��!�C���ȥ[�"���_��C�p���FZE��LU��E�W�
�T8�!���PR�t<�Z��Š.��e�b\�������.��l�F:�@�9~����fG4���:%f#�y5�|U���;�W��ʶQ�|x��OoS4-�i�|��_��Ep�*N�1k��G6� -���ddl&%e�����-j,�	X�w4E)a0�=��qT�>}2�d���p�4t�b3��At��';�����ǡ��G�ļë|�Qq*X録�))��nr�n��R{�/��E")�4h+f�i�(oM^�t�U��)IZi��tc����a�<NJ��s���� s�演�	�8���<K��P�[IG�C�j������ˬ���k�0�V�[ b�&c��ү_����q:j�Z�5?���z A�m�$I/toY�T�t�i���O�X�6:�Y�M��3r%��Sr���7�
L������@IX_�5uej�O���۫��{�7����hAqJ����ye��;��#�s�
���L�jc�!]�x�v�1(?��+���;�G�
a��T
�p��oҿj�=�D-�U�'�hpq�9߉�$̾Чo��U��\A��������w��cxEbR�y_� �[(+%��*���P	��"!EW-�_N�R��)�L�L��7.�_�Y����r6J�".��8S��m�~�a�7�>���ԅ[˵�����I�<�hQZIH��CO���B�D����@Pg��,���0)��g���ok���`��ӫF��<��{l[9}k�k�v+{�!5�_�L��*���v�Un������a�A����Ty�����5���j��R	�A�T�L]^�/E�##��1��|�
w��r�"@y�_�9�U�U�,i\�(G�i�ZD�g#����#)�7���'
_����G��f��`����Ϝ���\d��K��⩿~g��"7TuB�n	O�����1�5kl�Xs��ɔ��,�!:N�y:����H�p˘V�b��"X���֐kw,���rrv#�vS	����-`��d��4��}�aw�ru2_y��wG��}`��v鈲��U �,gkZ������Mn�wS��r�?/�Dٞ���ꃅ��]�bS)�<s�ͷ^�ݞ�ȋ��ѫ�����p��B��۩��Ē[�T���)n�Y>��i�~�/�}s���ut]�2H
.�`V�S.�*!�D��؉~�oGI\m�^��Ea,yb���*�<0�KN'�K���1��&�#��P�]���p��kZa������	m �h�� 1�ղ�'&@�4�,�-)\�"��3�t	=-������\Ы�a��'d{Z	0#�{�]$N}�� �V�d${s?�#�b�P!DaO�z�+�TDpr47F���EJLU���N����������u�hbK�����mL���Ө�:pϊ����,�~*���aad�?Z%,#1
�zTrU|���ڕ,�
/�Ws+�1�m��X��!��P���/P��ȷv�ڔGpHu"cVK�.�^��Ռ��Lbd�zq�҅���0����M�����s�$|y�w~�*3���Q��hB�"F�L6�k~[��B������C{1�����صĊ��ْ�u���>�E,n��:�n<qz����^���������X�[�~�'�p�c0�I�R����E3@��l5