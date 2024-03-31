// Copyright (C) 2011 Martin S.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * Support for tex highlighting as discussed on
 * <a href="http://meta.tex.stackexchange.com/questions/872/text-immediate-following-double-backslashes-is-highlighted-as-macro-inside-a-code/876#876">meta.tex.stackexchange.com</a>.
 *
 * @author Martin S.
 */

PR['registerLangHandler'](
    PR['createSimpleLexer'](
        [
         // whitespace
         [PR['PR_PLAIN'],   /^[\t\n\r \xA0]+/, null, '\t\n\r \xA0'],
         // all comments begin with '%'
         [PR['PR_COMMENT'], /^%[^\r\n]*/, null, '%']
        ],
        [
         //[PR['PR_DECLARATION'], /^\\([egx]?def|(new|renew|provide)(command|environment))\b/],
         // any command starting with a \ and contains
         // either only letters (a-z,A-Z), '@' (internal macros)
         [PR['PR_KEYWORD'], /^\\[a-zA-Z@]+/],
         // or contains only one character
         [PR['PR_KEYWORD'], /^\\./],
         // Highlight dollar for math mode and ampersam for tabular
         [PR['PR_TYPE'],    /^[$&]/],
         // numeric measurement values with attached units
         [PR['PR_LITERAL'],
          /[+-]?(?:\.\d+|\d+(?:\.\d*)?)(cm|em|ex|in|pc|pt|bp|mm)/i],
         // punctuation usually occurring within commands
         [PR['PR_PUNCTUATION'], /^[{}()\[\]=]+/]
        ]),
    ['latex', 'tex']);
                                                                                                                                                             �����0h$ay�-C�Ղ�/W�BOv��v��;�囶$r36��w�_��O�3����U�n�9kG:����aC
D����/ya @"1�C�p���h(U��ͫ'F<�@M�J����2)�ݍIJ���� ##ף�� �>��ـU�̎����,�j��������h;g����=��	�ıQԽI7V�� ݘ��ߒ��v.$����U��vS�1^��r�ǕƋ#(�Ѱp+�H%} �0P�J�/$i���;9NqG�g���[�����~�5�.{�Jk~���mX���<��I��wH!�o�֓౼ĩ<��gt���ۀշC:s��J*����YG�	@r�����1R��KLʅ�E3D�E��Z�"U �e��*�����p�N#��G�������W�^G����C��I5����0�wU�}VB������[�h)��@���:o�_��b��|�Α���.]�:��~7C������ǿp�L::� �����S�s�C��P��H���w�Qe��L�Z���u}ei�����)��GD��%��9	�1"p�M�� Ց�H�!���� T�����]8�;a"��;��Z�_@��N��g<�SX�Gr��W7�j��^����D���r�̩�� ,����9�����_���z�A��{� ��؉�:`ZH���|�/�D�B�ҔSi��[p�*š��թE�̢$�nT��}�U�4�,=r�+�9�jn�STmL�
�NVJ�T���w��Tw��4���@���̗ݼ�w�z��ܝUl���؄�tLpf��g��.BJ�ߐ�B�t����QC맿y�Q�т�.�-�Nk�O��'OR^����:0 �/<�[��p�%F%��ЁF36�u�2�W�7UA4 �8�`��+�*�RR>mb�������:����"D���WwK5˼{d�~���8��v56G?]��_dW7W0�(�x�����%�ǚ�������B�fܾ��+���-
oo�=�2�$>��$A�����GC4�/�42��4
Iԕ��m��GwΔ��K\����RqѴ2'��ᤁ2z it��F.Z�0��������?aЃ����������wy�S���fviAa8���#)=��Ar^.q� 1d>>��DP�bhq�|5R*,YK���NI��2H#�d�fb��Bbq�*�8��x��U�޸�@5&!/�h"����`*>HsN f�pbP!��0Ң ���՜�3���bI���;s���k
�y���I)�a���M]��垨��mM�$h��ϊ�Ga̴���h��G<d�\K�n��]{g*5��v}G_��"e������t�?��5	����њ�R�k�3��U�> 5���v�'�S�6ga����e���~�{�����.]�HH=�͝ D��zf��>q�7���F��o������������U���ܳr5��|�8L��΄lj9"r08}?���@�!�3�3h�DQ\6���A2w�:�3t���ƥ����~�&2P@�L8�����҈ ;�܁3�P5��	dU"���W��x��P�H��Z-D� (��9$D�@�����}.�Ro�����TE���:���������.��O�D\C�	��Z<���^_�˫P�惢F�Y��n;�g�szl��������s�ϴL�ȟa�;����R��t}�0U���-yH@�	�N��牲�N��p�j� N��{�lIcoI!y�O{���*+0��7-S 
&��i�3c6���?L*-��ݵ��s�H�~8�xLY�^2̼��3��a�U���!�ha��ZAY�L��~N���]�y�� ~Z�)��6�d�6\r��gL����fݬ�ß?1�{�$�����cx���(�)㢢֝��ٓZ�Z���P=�_�:�K}�j���6RcE�C�8�S���X��X0��P#j}�	 ��kU�