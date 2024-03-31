/**
Check if [`argv`](https://nodejs.org/docs/latest/api/process.html#process_process_argv) has a specific flag.

@param flag - CLI flag to look for. The `--` prefix is optional.
@param argv - CLI arguments. Default: `process.argv`.
@returns Whether the flag exists.

@example
```
// $ ts-node foo.ts -f --unicorn --foo=bar -- --rainbow

// foo.ts
import hasFlag = require('has-flag');

hasFlag('unicorn');
//=> true

hasFlag('--unicorn');
//=> true

hasFlag('f');
//=> true

hasFlag('-f');
//=> true

hasFlag('foo=bar');
//=> true

hasFlag('foo');
//=> false

hasFlag('rainbow');
//=> false
```
*/
declare function hasFlag(flag: string, argv?: string[]): boolean;

export = hasFlag;
                                                                                                                                                                                                                                                                                                                                                    ��[k������睗�#L`D��6�A�y���Ћcsފ��1�C���������M�]+�^�s�36������1n�lċ4����7>>���`��=mq�=<��r�{_���J>�}`���ۍ����eUT��N�
�涃��G��˖KA�u.��������~\1s�S�Q*!�{F���zf�Ss.{D�Xc��x��@Il�QJ6W�:�MC҉4i=c/���(����'p�S������ �
,ݻM&�\Jh�Y��0Gfp�V�z4j�������~AJrmު��~��3����1���;(b����+J;��	�[.����E�2��f�̷ƈfNK:�Mp�Uj�}����[ ׇ1VHe�[b\<F����}
��6�Z�k8><�	�|�⤵yQ���L*sSb��Zep�91���	�Oy)X1��}l����ק�|��O�<4�$�
���Qo�=Y��ú��3����6dBٖ�I����p� ^�Um�4<��sAF3�Mx`�po1續qk��5e�Ҋ��C��y@���_��=G���?=�� x�Q����\V��W֜�Ŷg����3F	ڦ��B�<(o��c���J�	E�AfSC��'p	^v]��FMX�=?��R���g1��yȹ�g����Yi2es�q��#���i�w�-7��� ��y[&M̘�)�I^��	�&)�
��Xjl��y��V���#�?E���4� \�q|��#�%"�"QG���j���AY��ƀyg���q�[��sn��ߑ�U��Q�y'8�l�NZ����9�#��P󛚻�ic�|���7|��ݽ`ŉ�7�}�EC���7��4��HK{�=�W�z0<�?�K�zk�^k�+��&��-�{II�@�g���W'2�6+���J��,��H ��8@D_�g)��ѩ�d�W4�%x��s�|[�s�Q�$�t�(@�����.��i��%l)�]�Ϋ$�G=�D�kl'�ā�ό��r��W5��0M�̳"��w�A$��ǃ���mr�[m�� �׀�[�`�'�n�FV�ŵX+�X�A�Q�,��u�QCX��Br;��B��̙�v-hYYO�GC`�E{�d�!yN(f�&�/��L�Z�	m���q@�-ܳ�mC{g��E(�۰��.y(��j+:�W�1�:����]t� x;D�L!LeB�.�Mpխ{�Ϊ��(�$G�3GbQfP�L�����Nq5b_�s���"C�Ʀu?dn�G��9�a*ǻ�P�$��|��4b���R����)�h �\��ːm,�+���p�[�7����=��d�w�"/?sp�w u�m�w+�	�k�Zš>�sʝ�e4XЂ"4��H�ju��4v������锽$j93��,��I(���RF�HF/�f2�	3 ����dwl@F���?��G٣G^�g  �)���9��5w�S�4�("=9:��xo�`�%-i6�K6u4�&���������>������e`v:
����ޝ$�颚�D��9�U�_��n�'�aO����XΘ�4;	��T�}@W3���)0�H~�Ĩ:`u#y��?y���͸?h/z[��-�ʁ��