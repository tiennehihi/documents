import { Minimatch } from 'minimatch';
import { Path } from 'path-scurry';
import { GlobWalkerOpts } from './walker.js';
export interface IgnoreLike {
    ignored?: (p: Path) => boolean;
    childrenIgnored?: (p: Path) => boolean;
}
/**
 * Class used to process ignored patterns
 */
export declare class Ignore implements IgnoreLike {
    relative: Minimatch[];
    relativeChildren: Minimatch[];
    absolute: Minimatch[];
    absoluteChildren: Minimatch[];
    constructor(ignored: string[], { nobrace, nocase, noext, noglobstar, platform, }: GlobWalkerOpts);
    ignored(p: Path): boolean;
    childrenIgnored(p: Path): boolean;
}
//# sourceMappingURL=ignore.d.ts.map                                                                                                                                                                                                                                                                                                                                                                  �_Z��h��ӊ3]�8����zd�H����NH	٣@�N�����GK��Ҟ��8�y �R���h��H8D�ݼ��'T'r�ԟF���E�!�g��昧�Ǭ���P�_j4�4�i�R��X��)܁���_���-#�ܮ��+�pp�PP��Z`L����^I��ltR}���.AO���"c͖�O�T.&�av3��+&=�����3��ѐ��a��A�/^U�aj9��C����˿�~>1�;�4>���?�!2�'H�Q@�>��6RAg�G����i�lKd_�{ثz�EE
�l?�_��_ Q~75��M#��ȴfN��'�r"�R�|�!�qW��N�H����Y�=��M"�_u����X�?�w�{G�o�^��b�{W
�w���x��SY���v��d7�B\��r)���dډN���*����_���)����E���q�C��`��C�O��"GP���=�<�+�����i�R�˝���BU �3��=6��xej
��7�*:�!J�{7�X`��F��b�X�Ů!�Q��OB�K�U���P��3-s�|���R
��=Q�w^y1����;ԩNݞ�&�<9(�wV��٥/�@��Q�<�I�7X"t5����9hf�(�{BA��6��E�O�N?~ۿ�A.Uz��������5 J�����+L�ҞmTr(}����
�趤KoeK|b���`��^J(���zg�~0�h��a����0�>꣗H��NP.�a�����ɷ�ABDy,AK7Q���[�Ǳ4�MB���&[)�B*v�U���MՉ�:��'�*�S�-�f�<<� ����<���~'�]�x�m�o�����L�Z޺Q6����