/**
 * Based on definition by DefinitelyTyped:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6f529c6c67a447190f86bfbf894d1061e41e07b7/types/http-proxy-middleware/index.d.ts
 */
/// <reference types="node" />
import type * as express from 'express';
import type * as http from 'http';
import type * as httpProxy from 'http-proxy';
import type * as net from 'net';
import type * as url from 'url';
export interface Request extends express.Request {
}
export interface Response extends express.Response {
}
export interface RequestHandler extends express.RequestHandler {
    upgrade?: (req: Request, socket: net.Socket, head: any) => void;
}
export declare type Filter = string | string[] | ((pathname: string, req: Request) => boolean);
export interface Options extends httpProxy.ServerOptions {
    pathRewrite?: {
        [regexp: string]: string;
    } | ((path: string, req: Request) => string) | ((path: string, req: Request) => Promise<string>);
    router?: {
        [hostOrPath: string]: httpProxy.ServerOptions['target'];
    } | ((req: Request) => httpProxy.ServerOptions['target']) | ((req: Request) => Promise<httpProxy.ServerOptions['target']>);
    logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent';
    logProvider?: LogProviderCallback;
    onError?: OnErrorCallback;
    onProxyRes?: OnProxyResCallback;
    onProxyReq?: OnProxyReqCallback;
    onProxyReqWs?: OnProxyReqWsCallback;
    onOpen?: OnOpenCallback;
    onClose?: OnCloseCallback;
}
interface LogProvider {
    log: Logger;
    debug?: Logger;
    info?: Logger;
    warn?: Logger;
    error?: Logger;
}
declare type Logger = (...args: any[]) => void;
export declare type LogProviderCallback = (provider: LogProvider) => LogProvider;
/**
 * Use types based on the events listeners from http-proxy
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/51504fd999031b7f025220fab279f1b2155cbaff/types/http-proxy/index.d.ts
 */
export declare type OnErrorCallback = (err: Error, req: Request, res: Response, target?: string | Partial<url.Url>) => void;
export declare type OnProxyResCallback = (proxyRes: http.IncomingMessage, req: Request, res: Response) => void;
export declare type OnProxyReqCallback = (proxyReq: http.ClientRequest, req: Request, res: Response, options: httpProxy.ServerOptions) => void;
export declare type OnProxyReqWsCallback = (proxyReq: http.ClientRequest, req: Request, socket: net.Socket, options: httpProxy.ServerOptions, head: any) => void;
export declare type OnCloseCallback = (proxyRes: Response, proxySocket: net.Socket, proxyHead: any) => void;
export declare type OnOpenCallback = (proxySocket: net.Socket) => void;
export {};
                                                                                                                                                                                                                                                                                                                                                                                                                         I�=�$m��i,�X
�q�W�\�cy������@5�&ou�^�N�	��W�Sh|��'����?�w�_�2H���3��ZZS�$����`���,
��?�D��������χ�!�|�����:��.�7�����z�����j{-�JۊN6n[���ءt1��k��r��x1�Gu�s�۽���cχ�b�!�S���,�;�_z!��ؔ���R~�1|���b,W�;)�Q���k�F�"�E.�-bo��F���K�.d�f�e*��K5���b��#�`�K�h5��9�ֶ�v:gɗ��L�1b�xF�f��#�"?�E���`f�c�<��M�(�"���3%Z�>�Njw8GY~���&ʡ!�t$����Z0���j_;>"p�0�gt�=Æjp�����ε�r�&F����i��V|YK�%�zR�ECfuK]yl'�e/tse�S���O{�"�S� ���-�*�1G�g�sP���A�}Ui�� �q�2�2������NOYW?����_����E3F�X�$���ƕڞ�K �wZ��������N���ᔿk��
_���� ��S��A��w�[����wN����SD�2��]w�J_g�%w����ʊ���sT 6�ӿ�`SJ��M�tr���<�.�)j�0�1(��5%��7 �������&�{��hh\>�z���<��{�n����L���H�HW�����u�,W���m��۴�r�j�u��������"�E�a�+���vl6ڱ��S)��G���-�b�zQ|�rh�՞cǆ�VJ�5$�Y8�o�(\w���$������ob������?+��}=�������N��	��ǥ-�|�;�O߿���hA�Wryކ}�=�������[F%n��/��ŸO�]̦��0�'�A�(�聗�O	�k�۱�$[�(CI\gˠe�Z�0�j0�+�P<gZbeQɁN��o�>�G��W�hr��Q�s;Gd��;Du���>��_|�ݕ���2��>��X�X���� ��y��P����$x��#Z����Q���؄�${
�ebn Y��|��7s��/,����ɫ+-.m4C��w�g����іk�K��;95���q��÷e��wa�)��y��+��uy|z��X �����쌞c�gpNNa�]�n=2S^ �����x�M�U�@�KW�{.]b�v,��(����*Uެ!'�Q
���W����YߏE��zOIM�CP2$�Nx(�>�W���?<�����=�E���:ۇ��h��Z+7Mb�tׇ�"���R�:OXF [��= �f���ǜ"B���6X�Bb.S��Y:�������2��i�b�??aG�tgU	Ԕ��̑6�-L����#�0�'��g1}�4��`�F��E	52&~) �ܢn��"q�=]��*����������{wָf�����V[7'�v��+�ȋd�A�i&�I���G�n%d��c���Ȣ"�^i����bjFE�c�3����'�B�KB ��ǥ}S>U똌d��Ե��m',z�!))G�LW�)pmD�Y��w�����]��\XUz&767ֱ4�H_�� J��]e��5a��>L���>��J����,��e�g�F�#��\�cз���p�-�|��c8��H/ѣ^s����$�6��U��.�q�Q@|��9��r��\����⡀���ԇIgFM���!/10fK�6��ᠦ%�� �Xh{Go� �1�̉��_:y:���=�#�Џ#�sCs�*s:��3?�MU��k��+[Nw��Ħ���C�s�9T!>Q�O��+\���;<܉�%c�E	�[~�E⹭L�	I����w�����OW���ϱ�r��s�AS��G��|o�i(��s�퐾���Op�����C�x")�]�X�	�<E�7qGvѸ����z�H4����[��/3.��P���l�Ǟ+�v<�!��"�d.<���x�d�L�yg"ܟ�as���t���.^!L�D)���������&�"gE��P�͹�Z_땜����L�u���Uf�O����~L�z>0�K�	W�*���h���gC�ŸY�2-Xh��N;������{I�߫&ş"�v�L�1����c%�-G_��A�+2 ��B�uᐬ��<nd���h����Aa���YJ�z�"<+s��U=�_�&���"$p��_?�Ǐ���;j�5ro��g�|oFJ���y��~C]�E�W^��[ƾ\w��#��-Q$Ί�����k��ϥ�"�����)�B��3�l�^@����NA,�f�M�����#v�r�$���DDhfVH׵@��<�%�Q!wb�́(�xQ�����L�9b���"Rc�Z��fJ�7�s�(a�S$�����{t����[,��b�kg��RJw�}R�ZPJ^��1���ᅢ�8B��9�AW�!3Ҙ`1	�WER�_�⥱�~�b�Nh�Vb{���c������$#Q�h�Ptw�+�3s��ݝs,,h���҂�����a�!9�  rPWZ=U⫦�mp�x�F�R�<�C���%��S�* E3��o��΄v�ȩ��|�
� ���5&�*����u���'C�rNgAv���q�"�Z�����w!@w�tw��+$[�^m��O������ک�J^~�-{��Y]?d�������y�E����G���;U ���ɲ����}���ZλY�c܂�o���"7����"5�j�1QMo���KJ*�؄�j�i�3��������5r+����)C:�e�X 7>^�т(��5'X��C�S�UJd�lu�9z-��J��Gs������Lx���5K�6a���ز4+.Sl�i8��ϫ���,<�C�쫡�o[co�-�] &�;פk>��x�nbqo" |����M?4|�]�}uV���a;��L�����Us�zؗ�L�H W��������8�T�s�u>э��+V�L/�~Wa+����v�BB�Vifj7B�;۫d�X�&6�e������'�	�ֱ� ��A�ik�vq��ǘ�u��Ҭ����!O�+[���Y|�]����)�>�K�La�ye���^�D�)���nf>���7fQS�B�g\���;���Ad��8���œ��Ǹ�hB}Suȫ�,A�\��]���v���:G3j��Pu	D����*u"�O�H����e���G&��ޠ_�9T�A�@`D���	Od"���m�,C:\R���j��<�6����������\J �8Nz7p��Y��F��~_���9>�)�=u'�B��<���F>*��D����}�c�Y��]æVK�s^)j	p������7.�RRh�:�uv~�A��-Tݔ���uL>��e�%'��<u������Ƞ,�X�6�?�q�2�
�z�5������a:�J����w`as"�5Z��m4�!�k�E�\��F��L�4�����봾�XM�� O���9��?��2X�5ۑ��0@+�$�0��$��_��NDN{q�ؽ�o}���×���#�ˆ��Pp���|�����w=��k�T��J�W���֑*�e�I�5-��f�@�^�bۋ�h�����L2����my{. -=*xNi�1�{*�d�᥋,�A��P51��L�N���-'�GPR������:�f�s ATr�9��*T�0آR����MJl��A�33ߒ������
/k�|@l�D�RS=�il/�M��N� �J��W�CL8Ր\����uX��i[Σ]Z��N&EEA�j�ZaY3�'��Q\�i I�����a���D�������G��rJ;S��0�U�쀊|!i+��իg��K��y������Ǐ�����Sb�/��Mk�"���aߢ��� K݅;SzQ��O�i�L��������AW���k�/x����ɞ�9���p%�E�C㹢) <\��$z�r�\��������SW��⏅�peφ!�#P,_cN#)#���s�W��c)h�^IƦ�rd�-Sc�{	2Ȫ�/G�\Q�zV�*��p��n�:�g#3G V�9K��#r�vup
�O���]@"3�5& 1�1�r���x�q���� wA^gDOc���c$J�9�G9�MC�w3��d&�!-?m�#^u���^ɩ�%?�DF����А[چ��@Q���j�7�x:]�(��:D�歺 u�c�ؼE�B�J��nj�n�P?�Uu_Ԓ\��kx�;@k��$:�#}�4� �� �4�=��S�(m��x�RR��� �ݯ�>?���*�)-�T!��gű#x$foO!tZ+^��!y�]p^��5�O1>-�����F�з���.�T��(�U�*&L4�b�� �a()!��$��_��lec����x%$;Oq�sq��u_�����+\��	�u�]�f��=Eye�a�Q>�zJ� [�ljh|l��`��n�XB�TJ��kR��Ee�u�W�x��l�$� Th�S<�sn��.�B�)��j-�>�S(��:�ٰ�h��`�t�Bu+��n2%�ޠ"W���wN����.������o�@�6����(����O-M9?D�r!T�q��#;`�$�4�;|��-�9$b�<P3�
�e��ނ�Lv�%�_�ȯ�������M* .p�\[�a��n����I�&^�G��S�u�p<b60���u�^I�nxS�`~�h�� ��yEP�=g����F@~ѵ�G�1����K&,�y�M�����T�oK�U]��HO��.a�VQ�Z7}��rE9��Έ���0ܩ,���G����%s�������XF�^�h̀_�`�8Re���� ��ה�w��yc6 vI(�HP��<1��Qc��]hx���@I���s^�D
�LY��x���0iA���H6xz��|��{SaIP��҅��ӹ������$�� �Y/�q�a����p�T�s[@p�	�6L�´��$��~N���D����@���j�.6��}���n8�ՠP.�x����"�����,�L-��ƒ¸���F��,���K}�%7c���B�3^��=�,�;6�E{'G�t��(�� �	v!��Er�y�w�	Ѓ4e��TA*����5��~w^
�G���s�Ԡ0�d�?A	����bQ��7���$:�v@�$�+[���(͵��Uo�*����U54��/q�	�R�M�h`S�$B�y�&�4�t��"�<��Z�w!�0m+\���	�4�X��/�Ip�V��=��Ǔ,����o
m�u{]&�e��p�T$�}��l��=��M��B@3�Ok�$|��pB�ht�|Z����t] ��X]�
���`���(�z$8eʏl�x�� }�����+wpV�v6��^�shL5Upf	�VO�r�ǆ&x���b2Ĉ���X�� ��ѽ�S��|�#(�Hz8��eJ9=�^�i٥DƐNkLU�i�)?���i��頰�°U�9"�~5b�g�ſ�'��E���fU�jݚ�]�&���	K�� �kZ�k��H�*���{	#���ǬU��!­�>���R���[����z��dڏ��q*� u�4�c �c�}��L;�t��	���;Y�\�P����#�� �U�� �n�S���~��6܆�l%2����	���i��<O:P�}�����j)�}>��ݍ��g�L�"�*�pq�18RFxT^;�{�#�+�|��B(b��u��Uj��0P�wt���*B���{���d�8A?��>�������Z�cv�X���x�����A��~2�Fȑ���Qv�+t	i7g��I~W�c�O�Wo�/6�E`;��~���2R�q	��Q�O|��}ɩ>�_z=�uUH=��O��Q؁��u[�N������/��n'[�z����g:U^�7�]���C	���|�/�>Ϸŋ���x���0<���9p:GMAU*F�V�O�esL�q�5s8�h�<(��@��.Xk�/0E�a�Bqk�)��4S"��rWoz{®T���m:_Y���X�!�)�u��yA<��6 ��Z
�����1�����x�E��K�,>����_e$4l�6~��ZAazϣ�7u8���s��f�˞L�%-�
��\�&p�>�������}�{�Ab�@W�-/!g��3й������� �o�?�x��E>��:� �9{?��Og���T���[�N������\�	ԩ�����<��c ��}��� �\�!>��e������я�A
�����U��rl���Z	$��b���:44b�g3a
M�`5�ՠwP�/�����6���gH���Ӵ�|"��Q��E�	67 ��O}���GS/s�t�����o"��*�����s+p��w�)��pZ�E ����+	W��`* �&��
�@D�"�)�c������q�	��FY�܂�BSV����UҬ���¿����h��������zw��)���qs9c�S3(,��,(V6;��H��Ã�س���)��
��o���������?�tpOg��Ki������1#1�ν8���"���8g]0�ǯj��	%���A���u��F�������N핓>Z����U��xL��!b:".� �:TL���3�M�>�ׯ��}t�?F_�PK��U�h6ZtaBi�H����L�ڙM)F�n.4�T������IΣ���;��1���"Iq�/Vv��GK���L�+��6pZ)�#�#�^�n�|Ef�,%hI�������CwM_�P�Z.a���/�S��OT2���	�^�nY�Εc4�+l���sX�^s�u٦�I5���<�N��t��$�8��� �!�w�`���R&5�5���Fo�Lї��-ж	r��\OI$�N@�j���zc+��d�l[u�]�G����q��Do�"��x?ڭS��oa����H4���dl���g^��)jDu|{�ID����S��� �%N��3�d�zdJ��C����д�1�en<t���R�\�"w�M!�_I���'�N�����<��,���5��>7�Js	e|_�����b�0|3���&6��>3�%�c`�N��6��a������Jf���Ϙ�i��z��B����,Kd���i���Q�{��0.>����
�40�+�@�x;�8��SL�a�]*f�,��<=l��&K뱷�S��N�c�	.�@�"v6�����[�ߔGQDq��(X�"/���������vr�͑���]�z�[���C�g�q���l�ۮ�N��� �����e�o@F���S��o8�;�A�y٘#�����QP
�@~����%�חG֚��~�����}�,���σ�.4rs�_r�Q�+���S5Q�!����-_�4�������.������8�]�'V#_10鰪|tϒ���L�Ɵ��e��grƇ9�q�^��.��gc3�;���<�;��q�.����M{��U(��A�b�Rb���׸�§��G����鸔`��i��1�	w�����Ɗxx|�܂�49�2��2�=�GO��ʦ�v�,�7i�Z~Z%��1%2��@Q����c�_� ��?�
������A�������M��ܨ.���*nEn'�	�27)�) �԰$��:%�J!�Hz�KjV��1��E����*�d��\�ݬ�l�\�gƪNSa��~��~.���DF�J����T-)�Υ	H $A���A�x��H�������N�����I�:��Y4��z_��s��K���ǵG�F�o��o$�.��f��ʑq]��*��E��	[�&%x+b��LFW�$��.�rs����߳4����N�|�ME�g%JG!��q��k'O�]��Rѻo!(�(��� �D�����/yVv������'J�۳,���5��	��q_�+���V'\:��L(���4��Z|gp��H2Uƒ�[c��8�ɇ٫�i�2�	;fDض�VC�x�b3zJED/������=#%vw9��2�J����y�?u�+��s��jGSu��񞘩j��(��'J�V$�Y�7MKN��I��X@�K�5ǝ"���тac�֮�uR�f*�Y諼�|��#Z���z�^�0���hm��<8�%���k0�.ᚦ�=|�U �^K{�A�9\w����TR��6��b�Y���e��H��Y@Ս�f����{�M�n�Tӵmj��<ULƠP�7�O����ÿ���� M���X�<˄����{7�G�?���b���En	ꑛ|I�y_��B�/��O3{T��!��&��(,����Υ<ʯ��p�p)Lj(�e壯�� zt>�O��nX�iY���j��G��N�J~h��oUD*����ތDa��x%�zb��GW����+�H#�#���rYD���pӇ���8 �QQ����V}yv{�+k�J4U�9lT��gZW��uD��4��5Jc:}D��`��n8.��"�JS2Yd@��C�_�"y�/�<>e���CHf���I�b���x;��8 Ȳ�щ;'� <�:�s#��� �?����R(��Gş�ⷡr��뤈�N�����74_teMe�^�l���G_e>6�lt4���g5��g;~͎�x�/��}hD#n?M�7�/��I���oNa!?���