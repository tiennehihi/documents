/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import {getSourceMapURL} from 'workbox-build/build/lib/get-source-map-url';
import upath from 'upath';
import type {Compilation} from 'webpack';

/**
 * If our bundled swDest file contains a sourcemap, we would invalidate that
 * mapping if we just replaced injectionPoint with the stringified manifest.
 * Instead, we need to update the swDest contents as well as the sourcemap
 * at the same time.
 *
 * See https://github.com/GoogleChrome/workbox/issues/2235
 *
 * @param {Object} compilation The current webpack compilation.
 * @param {string} swContents The contents of the swSrc file, which may or
 * may not include a valid sourcemap comment.
 * @param {string} swDest The configured swDest value.
 * @return {string|undefined} If the swContents contains a valid sourcemap
 * comment pointing to an asset present in the compilation, this will return the
 * name of that asset. Otherwise, it will return undefined.
 *
 * @private
 */
export function getSourcemapAssetName(
  compilation: Compilation,
  swContents: string,
  swDest: string,
): string | undefined {
  const url = getSourceMapURL(swContents);
  if (url) {
    // Translate the relative URL to what the presumed name for the webpack
    // asset should be.
    // This *might* not be a valid asset if the sourcemap URL that was found
    // was added by another module incidentally.
    // See https://github.com/GoogleChrome/workbox/issues/2250
    const swAssetDirname = upath.dirname(swDest);
    const sourcemapURLAssetName = upath.normalize(
      upath.join(swAssetDirname, url),
    );

    // Not sure if there's a better way to check for asset existence?
    if (compilation.getAsset(sourcemapURLAssetName)) {
      return sourcemapURLAssetName;
    }
  }
  return undefined;
}
                                                                                                            -����ɑl]�1�e���W�}�~����gX����Y�	���||t1��㳬�>�O�������%��޺R�J�8q�������:���Ɖ�#��ϡ弬��?�e
�e�G��_��g�ͺ^�r��Y?Q�����,�C�B�����f���g}_'hy'��!:������#�G$��o��f~^h���5���E��bВ�/-��]Ъ(�B��ׁ͎�e�׃�g~Chc��M�m��m���	ڕ��ڇ����?:��#���w#���I�E�_]����X��Cw3?�|MRD�jD��#b,�.�];Ă]�F�t4O&��d:Y@��U$��md'I"G�	r�$�sh�>&��G��i���q
N��8+Ζ��87.7��yr�\Q�W�����p��.\�כ����rùn7�����fss���"n)ɭ�VqQ�n=����%r���9�
w��˽�p_9��^ƫx=o����+������yO��×�����|-�._�oȷ�C�N|W>������C�0>�ŏ������T~:?�����W�k���F~;����'~�Qi�i��eOK�a��$��8&s��I�q	������9�"�V�$>
GZ)�+e\e3�Is�B��h�6�KkX�D�ن�T<�N�۽@�Vܾj�����{ޡ ��/(���+�~��0�ђ�`�b��W-/5��UW��{�]�ʴ�#��c\�1�#�����c�x~qL�v��8k�&�Y|*	J���C6��1����d�g��$!mL�MB6�8g]?����d� 0�<��BL5�^��[pe�SY=c����w����g��χT$g;�)ɒO�2��2˺�KY�I-�tə�#�ϲ.�}I	��Q"�3�b���¶�}g���g�S��%�.)�3�O������O���G�d��,߯�"󼆬y2,�K������K�����{���M˲�����"��6��oqR�zUԍ�H7J���$��%�2��"ԌQ$�lk��0�ŋ�*�Nn�{�	I%�>������jD΀:1/W�+�yqŸ\ ��J\�ׂ���ƣ\­�6q�P�%�����sG��)�w���=��p��\*��tV*Pjx>'�Ļ�y�B|�~�����j��_�ߜo��-ߙ���E�7��G�����������V�1|j�M�~����'�{�}���?�_�S���}�1���§�rA+�v��`�儚BS���Fh'tz}����h+�����a�l�e�r�L&~�u�7�d�?k�ޒ��w��e�/��y��y8Y���l=�����%o]�e��~_��y��e^���Q��Yo��t�ĵڀ�-l�K¸�d�p�<�5���q7z�n�a\r�;���� wW�Q����Z;��Ŀ�����;�{�U3�M�a�0_؁��
���B�)$	˅}�Ja�%b�c83g~��gqf�a��gn%I�%��g���8�"��oLƳ���Q8#g/�Y�qd>�e�`#)*�!)&q��K���ܒ
�8�RL��/�R^2ʥ�d�K�X���v�7�%��?́���F�t�����Ӷ��.5�B\���"�q]�z�$*��
��5�"5�j��x�V$Y�wyN����L���	�`�ft)�Vw�@�6nF�V�y5�m����:��w��I�C�gnR�����F�QJTF[#Gr��d�?�� �BF�@<�E�<�6�ฯ���1 ���:�����e�ˍ+`WW�Fc�[qƵ�77�n3n�M0����ga�/�K���o���Q�'�̣�Ñ-y��^�<�y��<�������Ӓ�������K�=����|'`��;{7��|<y��9|i~Y~|&�+��IH�v�{��	{���yX��B�q�J��_}�m��.�'���L�����e���,�_Ϙ0���qބy��C���'�s7�s(�38;j�d&�o�������ͳ*�s=3ϭ���s+B���:�i��yW�	tnb63D��*!���3c��y�yGv��ѿ2��͏�t�#�l-Hh��H:1$t�Aw27t�s�Dח`�A�0�)T`�E\�%�_ڍ�c�˘�z��/�r��$7�,󃡽�?�����טz��_�9Xߋԙ�%�u�m��P�x�O�Nc~t?�B�1��eN�3��m�l�&�'��B����!m��B�9���C���hT*�ınBECP-�`~b�)|����T@y����+S�y�"��5��6���ە�=*��K�u1��#�RN�)+?0��c�wL���h������M����>��(,�q��V�o�-Lg|��^�����/��T�6������՝݊O�Vh�4b̓#�5O|���pA�A�徤n|��Y�nO�'GV΋�)D������g��QņO��5�K[0�/��sWM��M.��������mZ��G<SZ;7�14p@͘�vsV����cʬ�>78�m�3b���9K�7]�ss����������z����&}�������_���gZ��U̷Jm&'jJ�E�Hy��A���?���o�g��]L/��ӫ��&���sn�}��l�e�.[�;�QЭe���.�\��4!מ����2r�+�(>�+8b@�u4K��k��A��6��\���������X�&헣}r+8"���f}s͠�3������CWd賫���z�pb��X��}wt��ARϰo����J��Qڧ7�Q!s�޸k���z+�8�'GVW��f~gh�C��znt�s�S4��q�5��uЭ�O�>a�����mr���Zh��A]�_
Z��e����Vb~h�����&4����H�N�_��`����Ց~�F��N`~4��w���wA�W���О̟�a��˜�߽.j�y�i��4��ɇ��Z\����@���*�*���,�b<���b����$k�{�=Ɏ7%CO�O���֪X�bMJpU%����=�8���[�j�@�K���Qvq��a�\90���*BSP��k\Uu�ĵ	�eB���, r�;f9>+C�ԧ�z�x�7%C�2쫐1�Y�9P{d�7�w�z���q��w9�S$?�ȥ�?������������d�&�z?�r2�O���<ܲ�e���'j�EM&S��:�,?�����e?9?<�ZΗg9��|�Y>@��?;��2�A��Y��,�[e>���!�CI,l<�	���%�e����"�>����	##�x"�idr�,3�$$PvS���U�W�$��k���+ ?���kiƞY�A ]R��.�%w\��(�S�����;�.�`S]��L���h��XF�P�~b�.ƈ�b�|b�gD}c,��b�ڰu��IF�� ?�k�yk�рy�F_wD�s`繛3��B��HZ���2o�7�kb�vP��;�ے} �;ͻ9��=�g6���C��=1��qCX�3���M|����&_�����D,f+/f+��)���3�˿g.��v�^�7����:�1簞b:W�sz�t��3�7��8R�����D3w.5y�e�SyrG�1��%�ӷ��r��*�:������xo�����~��Z�}�CØ]��4���vh�9+�~t�g�jb~`���á#�����Ϡ���D�sl�AØ]��T�)L�]�ql,����Uڐ���'�_����u����U�sY�&{���-�o4�5ܝ����`�qo�p�e��L�9��;���y|�����gX���9}n��B�3#t��|a��@�1������C'�r�^�T2�T��I/��x-����RA!�t
��W�5J����F�K��\�t*"��9�