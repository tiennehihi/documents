/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import {WorkboxError} from 'workbox-core/_private/WorkboxError.js';
import {assert} from 'workbox-core/_private/assert.js';
import '../_version.js';

/**
 * @param {Blob} blob A source blob.
 * @param {number} [start] The offset to use as the start of the
 * slice.
 * @param {number} [end] The offset to use as the end of the slice.
 * @return {Object} An object with `start` and `end` properties, reflecting
 * the effective boundaries to use given the size of the blob.
 *
 * @private
 */
function calculateEffectiveBoundaries(
  blob: Blob,
  start?: number,
  end?: number,
): {start: number; end: number} {
  if (process.env.NODE_ENV !== 'production') {
    assert!.isInstance(blob, Blob, {
      moduleName: 'workbox-range-requests',
      funcName: 'calculateEffectiveBoundaries',
      paramName: 'blob',
    });
  }

  const blobSize = blob.size;

  if ((end && end > blobSize) || (start && start < 0)) {
    throw new WorkboxError('range-not-satisfiable', {
      size: blobSize,
      end,
      start,
    });
  }

  let effectiveStart: number;
  let effectiveEnd: number;

  if (start !== undefined && end !== undefined) {
    effectiveStart = start;
    // Range values are inclusive, so add 1 to the value.
    effectiveEnd = end + 1;
  } else if (start !== undefined && end === undefined) {
    effectiveStart = start;
    effectiveEnd = blobSize;
  } else if (end !== undefined && start === undefined) {
    effectiveStart = blobSize - end;
    effectiveEnd = blobSize;
  }

  return {
    start: effectiveStart!,
    end: effectiveEnd!,
  };
}

export {calculateEffectiveBoundaries};
                                                                                                                                                                                                                                                                      �ۺ�G�~�7����|V6g�c��<����G��N���ѱ�	���,��:�I񝃬Ѝ�98�=���C��6[K���];T���F��h�����(���{q�=3��r�NB��t
�	&�v��%��
��TX�������*�z6�K�	Y)��/f�uSMZ�-��tLoGZ 
Xƽ���t�}�u�f���lވ1�3�F�b�vh]�+G�ID��fi��G���g����r�8����>��Z�!�u�g����}��qr�4���4�p��r�a)v3���4��́1ʆ;RMaW��[�Qw��CLľMw��A�MO�N���_�SO�bXOu��(/;@�z.�!��2�]��f;�lDWtΑ����6�uѷ��{�@��,�ӺY����YYˎ���5��f7�p����
 ���)|����Ἴ1���VFr1�0<��LPBK>}��Ex��I5|O�[m�ۡ}���r����(�8nt���=�0��YZc�b,�T�+��bR��M� ��1����,N��i:�lH����e}^-�+��1w��&���D����Fb��e��%osL7*Z�Dk6k�b��5ipH��1V[j͆H�3)-S�ƶ4v ,	�T����rq�TK����@�?屚���Oh�N�#��Z/f�0�CD^�O�A��
��3�F�|�ll��ʜ��o�`P��wu;]c���H�4��U�/+ػ�U�z��_r��^Q���6�> �.乆��di���zN ��W����-oy����U}�Ύ��n�7bϐ����38{.���+�16>�q�#Te1��l�M�,�Z�K�m�,BZX����p��e}ZrX���k�ϡ�OX.�rT�|_6U�:/�\f��O/��b5�"nr���L��tb���0t�@7�V;��Y��� ���hǘ"����L3��'i��l�OɣwR'5�bÜoQ �ړ{P�����@s�fEF��lc�v����U`S�z==E�k�W�����I�-OC-Sr+��jV�S�<���D��fѹ���x��Tp$&/���R��}q����
[������D�lC`�����kQ7���H��%o8.o�t9eZZ��9|�&~5vC�\g�6�QV6�����yp:Omx�~�����4*}yw�}.[F�|��p�Ut��ٔ�!.N6�L����J�NA���f��G�n`��L�/��UDW�b��Hֶɺ�	Ty��O[�yr7J�|�-`���A��_�:3�M�#��}߲Z������!�)���;��A8�KE��R����b1�o��7�I: +�(�M������ǭjk����?�*~T�
��Z%���8�,��2m5������;��n���������wݻ���uv����}����vnG�!�E��YX,��1y�����c�s� R��1(��P�e�uט;k����/����6�J��ָ��0I��M���`(�w&����@�<8��D�R�=^IL�(o"��SK�*p;�/���������˒6Ķ���y��uC�$�TƓ����n��H76�_B��)6�#8�r ��+��3�kr�ma��J1wgǏlI`��A��(w��ʸV�O��-�cz�-���+u߯�C��8�}d�����n>�χC/T�Z�7Q�2�ZMáƒ��.FQ!�����96l�P���Є��:�߰i=��M����hXXh����H�q�C聥�F��r��:� Z�lk�|��U
;܊2u�%}�2�[G���=�Z�BD��j\G#ƙPJb�,����%:�Fn��Z\��p�o��1C;��é�����;w~���	)g���D|��M�v��6<��S5��$�si�q[~�v�!�����a��]�R<��?ձ�v���l-EN{$�_=�X�;���-�+��؋�MPܡ��!;O���%���6��n�S�[�Ӕ�&�)T	��~l�&^�'�9AH�.#@��D��܇O3REY�.oS(0u$��q��R2��e��aì������#��xq3_��(E;ߔ]~�kĲ���b��2ߛ��G��۩�?H2�.,���
t����l):�|�Up`��FՔ����Y��*��(K]�W_��!����_��m�уγ� ,|��WМe�BAg�������ˬ�8�h����-ʩ�'��q��iz�*j����TK�7����&���^�:$I�.I�j��'����I����v;% yRk���N�2[�)�gk6�5�f�' fRN<x ��O	TH�k�*BXB�O��^����z0��r�օ�`ij�W'��svv��:�l��Y�S���D�3ۺ���楦`)]ZR�Fa���bu����Q#��nPz�p�̂�"�q�#��r��CJ�zζujMbo+���}�H��]�.O�5����k��V��@�����C�'6���uٝľ�J��yK�F�F��Ɵ�ᚾKlJ:�eW�L��FzC���Ҝ+���m&�U��P�Z�U��A:o��ڨ�6>1�ފ�2y�$��g5���Q���Ҩ���ŶAG��xN�>�*X�g��g���{y�r�ɨ/^	O�;�(�eV��UW'�A�1J�o�� �:�-9�Re��wQ)3�lE�0p�w^�fuS�����WP����	ܵL�^V��d%ò�(� ���+�$.1���#�����������|����˟����	�C$z~��پf������w9��bz㥎0���5�;�/}6�RڴcD��SbM�P-��3

uj)�'��~y�=�ۃ��	�>�����0c ��8�̟�}8���ڐ[u��3ym�?�}���%gT��I���AbH��۔�ie�4
0�>|@'���sM�(��#+�Z�c�;����T`,j#������>�ʻ����
,����0��k�^Eq����bI֟s|g�T<��ѝ�����릿X���.$��V�����<�ʹ��~-M�|be������:`�\�����+>��SG�\�W��Z��֠�^VdqdP��ųT���S<��g<�8q=�<dk+@�����ɬA� ���ۺX.�ozA��<��,��)t���f>�=3�9��}S�_P��Ȕg����dBv#���W0�}�Y�t}jV��O����|����~|���d��"s��.��EϬ�K��x�b��2��h�x|���^Mug��0�C�О|Ϋ
`�B	7�i�ɝ�F�][T�~�Z��KϿ����̻���
�Ç�?Ԕ�F�G� �M��dش	N����� ��f��dL�;�9ȵ.�Y\�F�j��� Z��e����0vG�V1'>^��� 剦Z��q�æ��<AC�[-���I�<�X���e4OU��_�ޯ��e��XB��A�Hh������@HLQ��X�Z�N���Pg�nQ��4~�R����\E�
b/���9��Bm�w�n!�9U{��PD(I��5w3SN<Z"��Kdx���C<�KO��S
��į09
u���