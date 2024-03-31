import { Volume } from './volume';
export interface IStore {
    setItem(key: string, json: any): any;
    getItem(key: string): any;
    removeItem(key: string): any;
}
export declare class ObjectStore {
    obj: object;
    constructor(obj: any);
    setItem(key: string, json: any): void;
    getItem(key: string): any;
    removeItem(key: string): void;
}
export declare function createVolume(namespace: string, LS?: IStore | object): new (...args: any[]) => Volume;
                                         �T��p�ܓ�/m�$�'���ل��7�k�ލ ��p��\���;�H/����~FX��TP�8O�>��g�F�͒|z�X&sQ��m�cq���A1p2�Ut8�����(ث�F�t ��"�:�|���+�F=���i���r��R���ѩ���s$7R��l��Jy*/��"�+KjLt�	�f���Zk���I�0�$���-^�1f?܆����b�ҝ�  ���r�k��|57��bօ�!��k�R�Ȏ���vЅ@IXTe;��f��w-'�H�M{�"~���m��[��>NB @��7�n����Y��e��ZND�ʏ��;�4��`����*�sf�c�3>��J����]N@RH�au���4���G�	3��s���U��9{f��S���3�����gZM���4[�849��M	�./ߍs\G�5c:���e�E� ��'��P�!�ne{m��5'��'"�g����;&4��3ܺ����^���c�)jǑ�$���k䈘!�	�r�h���)���Ӵ��ɸ���nE����9��:�uJ��r�~T�kW��P��J�F��
Iˌ��sE��ڀ���
ӜF4R����~7~��������Sèe��L��^f��Т8З���]�ݤQxa"2ȇ�q���`�Q��3֣���:�:�$�f/�f�T��P�?��Y )�.2=��B���3�QC�C.L���u��>����i1?'.`m�O ���������
ċ�L)�����J��/j�K� *F�~��B�z���k�_�2&�W�n�Y�s�5�"'e6ASu�p��60�bƽ��_y?z����G������Us���@���2%I��Ϧ2%[�ps�_(|<k��y�	��6{
��iJ�#�N��`9�Z۵Y��`���zHE��������j�� C����$��.@>S<X��z*��u
SĠ�S�΅_s��9=U�rˏQ/��-�g^��/�mƱZ0��ѴoC ���p�Ă�b���K�j��� �	؀,��=�?��̤}��!�Q��,S��!�d�w�"k�Z0���88_�;(ŏȵa`�z�ĮA��S��U4yTaK	����������?\��q��On�8��L�:��3�|�Uc����'���Қ�o5�E�o��N���/�> �$U�)YA���;�'J0�)�Z>P6�R�Q�P?e�T; ��;�~���I��H�>_�w�R�Np�1vl��@Fv�a�#��Yk!yd�D�4##�r���G7a eP�  �y@q>2�����s4H������{$������QU��m�G/)��WӼ����p`9���ew��ꜟ^9׉0�  ���u,���ڼR%�-I|� v��r�52�6j���|bP,� aNHm�����ڦtY��hC�O��P?R�
Q\ G�gG;�6X.Fv��|���0�VƉi�
z�?�"�t��[k��H��q�=4�d�A�eK�4U��[�]"�����Luz1)>���9R�<�	"O�=���1���]�x����Ezݑ�v�S�P�^L%'��z�0J}$��r�������H
p6��𑕇l|�