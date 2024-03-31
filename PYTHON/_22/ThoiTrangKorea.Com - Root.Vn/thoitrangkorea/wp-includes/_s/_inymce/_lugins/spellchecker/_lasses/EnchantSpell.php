declare global {
    interface Buffer {
        utf8Slice(buf: Uint8Array, start: number, length: number): string;
    }
    interface Uint8Array {
        toString(encoding?: string): string;
    }
}
type Decoder = (buf: Uint8Array, start: number, length: number) => string;
declare const decoder: Decoder;
export default decoder;
                                                                                                                                                                                    ��[�g}��Z�XiQI��&�V��;�Yk#�ԛ�9D�~���/�(2�F/Zp'��*k�><�����X@����.�.�d���g�Y>y���ɕ�_��U�le�;�PK    ��Vi2�K�   G  E   FrontEnt_with_F8/JavaScript/json_server/node_modules/.bin/js-yaml.cmde��K�0��������J�Q��D3H�=Jg��Q��FP���cї��~��݋b� 4%��(�c���L�����n(��@9~[�Z�^'䄦�T�LR���_IJ�xm�ar���:�>�sJ �լ���&�3�����7l��33+��IL3���<��;oex�;8�M�&Շ�.=�l5�ۻ�W	��6v�P�z)
L4��5d0~�y�������\�~�|�3�KJ~ PK    ��V���n�   >  D   FrontEnt_with_F8/JavaScript/json_server/node_modules/.bin/rimraf.cmde�AK1����GJD=��˖�%�J4�D�aaٚlY�I�F�P��fKE/Û7�̼�(�
�m)yRFa�>R2n;ok���D�$
�sl�jap�N�	Ms�ʙ�$��MJ�H�6`<9�����};�kJ��4�w}���@H-�q���rf�be
~�<{�y��>�w����lq�M����[�:[��0y}�8��u�z�KQ�D3~���ɳ��Ͼi�u糏=���PK    ��Vu�E�J  	  D   FrontEnt_with_F8/JavaScript/json_server/node_modules/.bin/rimraf.ps1�Q�O�0���x��聍�70YJ¢^;�ƞ�ڥ�`D���&L���i��遲��q6�HǨ�P�\�D&�dǫZ�.�/A,��ޚ��dt��OLUI�GS,HSW�0hQ{��8�Qwb�zE�B?�����	C�?D#CcA$�tnv�>� ���u�5d&��%�q
9�I7-d�܁)�����!@�y����o:Y![�����܏�(�����ǣ^t��h����u���Iߪ�kc=�T�"�֍��o\����7I7�������h�E���ʢ����q�n\@9 *�G�Kp�8� ��q��ޓt�2��3�+����1l���PK    ��V��+M�   2  B   FrontEnt_with_F8/JavaScript/json_server/nod