import type Ajv from "ajv"
import type {Plugin} from "ajv"
import plugins from "./keywords"

export {AjvKeywordsError} from "./definitions"

const ajvKeywords: Plugin<string | string[]> = (ajv: Ajv, keyword?: string | string[]): Ajv => {
  if (Array.isArray(keyword)) {
    for (const k of keyword) get(k)(ajv)
    return ajv
  }
  if (keyword) {
    get(keyword)(ajv)
    return ajv
  }
  for (keyword in plugins) get(keyword)(ajv)
  return ajv
}

ajvKeywords.get = get

function get(keyword: string): Plugin<any> {
  const defFunc = plugins[keyword]
  if (!defFunc) throw new Error("Unknown keyword " + keyword)
  return defFunc
}

export default ajvKeywords
module.exports = ajvKeywords

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
module.exports.default = ajvKeywords
                                                                                                                                                                                                                                 �)��C72e�4k���P�y�6�9���jx��.9���W�ߋS`zKv�@�L�鿠V,����8��x�j��N���h���}�,c�\��R͒I%2a;�Z��߽���$%�P=���Ӊi9[z����Z�?�#.g�a%�6
�(;.�)W)�WX5  &g��n�(�<D����C�Ǝ���������4��:�Q�}5:dvPM`V�����M除��`ڂ���q��X���<�3����ª&h!�*4���#lZ-���=��c(�T�Di��%O��	�d%�b���޵;y@6Y/���W��PΈ������'e�)Ï����0P��a	�2M��E�q\�g�˺�� ���@f��v��&X��&��}Ww����$�A�rЈ��RR�cOC����5v�گ�U����4{-��s��}��#:�[`}� 8�����4�����(�	(�r�������9P�kj����~R�V����勧u|jw�����ع �ʳ�-���'�8�Y�c�d�@��X���G9����B��|w]t�����@�m�	5hKMw�q��@�B��ғ�i 
@Q'��Ș�V�b��XR5_��ƪL�zZq�;��:#{��
3ZU�IӖ���`���?³8���vR$a~_�g�_y(�(�⯊�* -0f�E&Q9ҶJme:ڱ�&#&���`����v1q�VX)|�ZM6t�D�U�B���R��
3�Ȑ�=���!�S fB�J�1%�Z�ò<��e#y>w��Ҷ�5�N�]B���#ݛ,D�h������vƂNG�@(�-��䑞7�#��kϴt4D��l��}����9~��b ��{%�~�7|Y�X��~�;��~�<G�����ʦ������<����<QWM�᪁�dٵ�$0K��0YS��K;�%���r�!��N�W@���!J������ڿ��*'��>���BT����� �WN����D47��i�}~�{�\B�.OԨ ���.�E�����lO,�ddP��E�.nـw��*Q�����ʷ'ɼ��=ooh��9��Z:���b���5x�<�!�x�w�;"R`z�k+u���b��¢�0�KfGlE&=�-
�"�~��V\+�o��rl���˄k���)k���g�>�=T@y��7%��baDȣ3�	rÚ�*�F��b3!�l��yf�4:�A�E� O^�bA� �d	2��';x�4��9����~�ǒ��{������{G|s�忦��o� jC -�8R�s�S/l��	��H�=����bJ�(��(��!�{�̏��䳆o98��i�}/�_E%�1 P���jK� 8�eS���ш��9c׉T6��oȑ�.����F�.��<v�I�|����l��:�0�����jZ��@� �8�*��XU�VJ<]�\\�ח��Mc�	��6��~WQ.�E�}���G�Ӣ�(��.⇌j�ޟW��P$�_fpܶ�_|�I0XQ?�m�C��@74-Mo%dI8�	C��R~����w�)qu��~��J�՞�6�`�t����t�o���aY���<o=O�6w�)��Uh[|M�j�=.�-Q�ib\a1�`qoEg�q8��n
u\?��da)�Y�e��ٻ��M<FT���ø_"M�e0bX�1�h�=�����66I�}�i�Q><,�;���Iu�"��J �� �K���i�>����scLR�]�
�^R���>t��[
�F}pI�$�ܰGm%>)�gJ�	��WҰd9��Չa�L��pK�G�$i�#m��B�p�.�R�z�͇S
�9-2��Z��W��=�m�3�ӝu�{�������d�gÀ�j�!��=������ڋ�B�:�*�A�pZ D�υ��m#%����8�����j���m�]��r�]��ߖ`U�WrA�P��E%�Lb�!�pA�VO��˚��a��vQ&s�a�~���������fh�q`Fw��j�2��f�����ș�u�C��+f��'?�喾�?8��1�/�\y�>�:�9�N@�ӧ�~/oN?l��X��<Jy�M�\8~��� �T�� D:b���������KQ'�Be	��4i��-*�����X}Bԯ�c�E�+	��.��)8\�2��nG�n���5,(��٣;�&�ۙ׃\h�>��D� �|M�����w��=*4л��t�^�"��UE��ʲW�CD7ڕST�..s';�+F��x^ݬ��m�n?ĭ��ޗ�g���X2�p�:'�wB o��vg�WҞ�h�!���m�7���ǵл���s�e���pm�_c�;��5��!�ff��} �w���=IL��'�0;��tC���TE�ZTI�^���ǋ����#�o��d.��?�¢�\��	�}�X}�@��=<�-5,��9������� �9�d3�I_�`�>Ө!��]wT��7c|�����8�(�����K�&�t;�����8ɉ��??/�r��������ϭ-s����1�vD�^;�ib�}�2 �&l�d��q\�z��R����#$���������Q�!�����R�z��Z�/����k#�Zp���S���(�[�:��r�dJ��(�Xơ�?�4��L�l�1���H:�(�.?����Hww���!�"��tw�t������ҡ (!����?�g�sΜ3��3Y�6�}��͵ ��}� �f��j���ѣn�b�O[WEh�i�%�='� k�D���u��N��?m���-���fl�;.�pJ��S�QǑ,T����wY��ٔ|/L�Z�b�!�V�ϑ�R(i�dY	L�H"↑�C�6{��u��T������}���W�S�{����#;���bR�>cu
��e�
�`  tٮ]�@)�.�V©���\�|��X�)