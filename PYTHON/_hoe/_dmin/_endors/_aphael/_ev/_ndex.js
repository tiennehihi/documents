/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
class ArraySet {
  constructor() {
    this._array = [];
    this._set = new Map();
  }

  /**
   * Static method for creating ArraySet instances from an existing array.
   */
  static fromArray(aArray, aAllowDuplicates) {
    const set = new ArraySet();
    for (let i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  }

  /**
   * Return how many unique items are in this ArraySet. If duplicates have been
   * added, than those do not count towards the size.
   *
   * @returns Number
   */
  size() {
    return this._set.size;
  }

  /**
   * Add the given string to this set.
   *
   * @param String aStr
   */
  add(aStr, aAllowDuplicates) {
    const isDuplicate = this.has(aStr);
    const idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      this._set.set(aStr, idx);
    }
  }

  /**
   * Is the given string a member of this set?
   *
   * @param String aStr
   */
  has(aStr) {
      return this._set.has(aStr);
  }

  /**
   * What is the index of the given string in the array?
   *
   * @param String aStr
   */
  indexOf(aStr) {
    const idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
    throw new Error('"' + aStr + '" is not in the set.');
  }

  /**
   * What is the element at the given index?
   *
   * @param Number aIdx
   */
  at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error("No element indexed by " + aIdx);
  }

  /**
   * Returns the array representation of this set (which has the proper indices
   * indicated by indexOf). Note that this is a copy of the internal array used
   * for storing the members so that no one can mess with internal state.
   */
  toArray() {
    return this._array.slice();
  }
}
exports.ArraySet = ArraySet;
                                                                                                                                                                  Mu���q|�ͯ���kiɚ��x9?���"!�Xm�bǓF���s�!֨tt������t�h��򜤈-F�z��^�{���N�!a����~]O���Q�|
b/·�8�Z�F��|��`����+��W�կS�,�d8�Q�&��_�'��p0og��I?�������j�Wu��;G��T>�@R�6n�@%R?0�7Z��͒
7:���x��2Nt�d�\L�sx]r����k
@s1��H�xCs���/F��H	[���{��v=1��Y/��E}]=À�Y���e��h��F��|>�1���x/#vu�>�0l�b$���+x�f�&͋-ؒ�yt0�{�.�������h��������H�$U�ðV^כ���S;��V�7�b6� ~��!`R�s1�4����d��B&���a�=q#���"L0ڣ�����f{�� _ �s"ED���&5���$u�D�H HjT�D���ȳ�P,җ��䍗�LK���Y��*���U�f^�C?[//P�XR�_zt���*���|�6a����5�}��I�j	�lL8rz+��Xj��c�od�����1�� ��}�\T���c�q�Z���̈����qܮ�{�wd����\W�&��hr��s�z�@|2k\�� l�^I�Eu����y/�_���r�Z�ݩ~����P��P(����l^W×����Kq0����/_ȸ#i��N"�icIL>y���Wɐ�)�G�v?e ���\�'M	�`�2f�S�sF����dQM���֛��[�~��p��w ��h�~}opx<��J����A�;(T���n����_PX7�������R����cS�����Yvn��k_!��0��q��	�O&kG�[���T)[Y�����9��E����J��H�5�ĀA�w�|��:�o��	eU?"���~��]:�a�8g�I���j�������~z��rm�����j3nø�2뤳B(���s
������d=��_]5�[���;Y���eEKeʐ`a���[�������V��A�g��r4~���˓zmL���_�8I{*���"�g���O5�*��A4����џ�y����? �@aH���#�J�{:�,��^�ORsz�^�TcC���K7�OM�D�b`p�Z��[���8D��LP�E�X�3��)�R8���ד���7yI��zr��9J�ɳ#��r=���ծU���l��l���A��e��\�T)�c"��YX�
P�n��6��ȶ�^qڝPìg�}G��v[��*������@#Q��
����Ǐ�2�ڸ��'��^�L#������&������m�n�ImV�I!t��+��'K�M�)�)�x�:���{�,sOՋ�J�s��o�eP�R�q-8�.�,.�da,�}y�������ֻH9�	�����<2�"u�ȋ_�k��ftt��M���)3=o0J�0l����OVw�;�����bZ�$j  ׳��"zx=�P%@��9�L��dq:��"���g���UKy:�Z]h�ķ��MS�Ǽ���^�g5���2�3>����dK��d����Uj)e�vͲ�
%�6г19��j����<��5z�Y6���ǋ+��:�S�c�bet�{���~J�*Tm�S+�9�����z�iNk���T�*�H�Z3����e�a��b�LJ2"�UЙN�*�ё�z3���*M���o�=�+f�a`�v"j��N��1$2����.�Ȩ!�O�$�e�m5��U=h�L���K%$p� E#3�`�`V�&��a1J�ϖ�����j�$l�'R"Rv|'yZrHy_���ݝ�[n˅��R	��BW�d1V�ĉ���p����0 ��~���hY9H�T������{Ea�O��{DIW+d���ٛq����h�ȕ����Ԝ���Cj*���- ND��3
rBL~����Ķ�c��'�� &�$q���3�lK��K�,�lBr�^`�)3�x�_� R@ȁ ��eP1%�r�d��R�i=E���ɲ�ȍT�|������IFlet"��yZ�$)�[.�r�d%!����+.�`t�x ӧ|�?�tU�҉��,H����������USo��uS/��m���޴,�XjBh:i�&��fP	��\D&���db�)8�?�+h_|�V�`U�sJ���U���R�����<>�LQ�s�	��$6:�%a�=k�����5�6c8��|���4��O�Ň��<Ӻ��	�Gy�9{�T*�������em� ����;����CT������Y�l�7�HR���ЮdZ?�.�E�ȇ-��7t-�&�qD��S�s�e�l�Ӝ
��	j�A
[<��DI�G⠲-�9%Ց���U�T~
'�ڑV��+h�SF�c��4y �y&(������>J�w~-���.�Jۓ�����[$�1��N3���0��ZXԒ@H�?1�ߔ�844�~_�Y���Q����H1�7+�`9�Pd7Vp;��+ӋCN;�����D�˶i���d��z�@�����K�������\.�|\Z�'�S�A���SI��T4��/������s.�%g�W�1
�0R���x�����ܱ�U�`�#:j>�8ȑ4��R�_����g���J�NL.O����_��xVR��F�d�ѷ�AK�u�p�O�ƍ\�J��2��$`6Ðu��l_��Ya%yP!�`���`�)�hxC	$�H�6]���ʴ��I�'ئɨ�(�[��pV��	D�f,���j��r���t�ʬ	Z�'p�=N��B#��2K��Z�>"�1��T<�Dj�}k)���=z�L�Ew�UK��v`6�`�8��=�'��K�=��E��c�)u�&�8��O;OrȒ�ӆ��I<���4=X	œ$F�J$��(�'c�o�l���r���Dh6�8B�h��x2(��/�nBe1)���=o� o��n6�]Ʉv��e�@��5����W���aR�~Vv�{36��oO�K#Xf��g̫�u,j�Ԃ�;W<����՗�b����5�g��t}{�!uV&X*�du���G��]�X���=ַ3U����yO˃v��rj�b���DE�l+~��)�
�^�
n���h[J��%�an�����W~����돵/4E���6e���b*��B4�C���X�����s��ʿ�n���4�+M֣���$�y�P�SagV��f�zmv8U��l��bO�!�O� D�)��[ᆚ/B�;:�!D5�Z�gNV�VP��x�.�7�@����c�~R� D`�qp�>��1ZNd�Q����1�5Wk�˰9v8�#n�h����5:L^o�lF��!�t?[ �J	�B�B?O�Cf������K,�n��]xp���ǳ�/��ЬG"|4�B@�Th��]�蔪��P挣0w�К����B�|A4������.��'Jf�M�f^�^�6���.q+� �c�e��J_�|��\2{��"9J��3�M�'�p,�ۙ�� ���N��r��ҩ�mum ��X]L;��u�d�)fy�#z�\�^v�l;P�ҷ0o�M�bE�	��E:K� �/���T����:���u�L�eD�=L��H
�����}���N%F�k��@3ي6�+κ�\���yDF2nj�� "+��q;�7���)bB�6���"%�5�����~�fP0x���nuL��ψ:"̯��[#~�+�^T�j�o��=[�aW� ܮ��뗘�!"��jj�\�
�T��H�ŦA�c��SZ�Smk�\=ξY~B+d+�Y��70�^��� ��� Sdl�����A���)Y�p��4�H)�Y�4O/�ͲhG���bS]C.d�,2���¼��zb)�\,��&�ӽ�.����,L	e'�f:�V�*{1��I�TV���_��z����4e��z�@���RJʔ{�mu�*�"��n�]�V���g���`Y�kv�M���7��N0���R)y�A� ۽
�#�@谣['�թD[Rv�/�C�5>2�[�w���JY��:��%R坩��J��g��CR��h��U6��L�z���B��Xvwwf8�Rb�ܽ4dg�!��h��v�ӹ&�#�6Z��&�$��P�����I�q��2�d
�����b��:�����`#٪���&��R��A�'5::��""��]1�E��h;{��6�4Zm����!�z�ǣ�bb�<;���2��T�Y�3)
�Y^M/Ow�f��!:����l�SDGi|��:�`s���)s��%��-���OH�-���#�IH��K��?Op��������Rc̳d��0p�V�q=�D���ڑ������d�Q���B�~;�5��C���K�ݤ.X>�I�y�)��U��Gn�<�ƹ�d��#j)q���r�x��w}���m}D�
;e����ظ�?����ߪ������)�@,�n��"��+1��8�2wt��u'��6��{�F�$�Nr�-�2�W/@j�Y'����*;���5=�]�K�ǔ\-�h�ۙb���q����
�u��Ԓ/6k_���,�X�}(Ѱ�f?g��Ïݭ_"�a�]l�K��׈�P�G�kSBݝ{�"��"�:�`��������
%7EmS&���f#O����S�%�|	a�\o�Fɚ�U6�W��|�r�k���cvgWo��{��G��k?q�� �Lt̂��G�����{�EV��"Qݹ�.����~�<�M�ڷ�m��=�����Ⱥ��֬����^�ێZv*��y�]i�x��5�L�B<Uޒ���M���#�3�Y����_�5�~�tv��>�[�$�a6[}�6H*�Y�:N>Y�l�W�5H�I�Nd�����d�<d�g���f[q�1��z>�Pąri�[?��r�����I�_�MI�Oږ[\ۑh�]�ϐ��#��<s��>g�c����y���!/ݜ���5� Io�ؑ�lQ��{H���T�}�ѺZ���!�+���αw�0\�}wf�6׫.���8/�VW�@ gԝ�Dʨ
{�Y]ʱ3Wԏ��<�G�)����Q)G�	�7�ލ�]�B���v�:+�w�� �z�W��r�	 5C�S��_����ph��6�=E6ʩ�$�<��m���2���ُ7��=aN6��43t5]{;R]�E]���Z�ڤ��!-/�Y髦�ur01��ؑ�=�YL��%�9I��2O�w�]��[a�w�U���L:�����b��l].(OC�Ðb#00��g��R%��m�*V!�ZË0/U�?6��^����8��ѿ3l�I��;^v����Md��Lb������I�A���֚+��rL4$��`������oܐ��m�L��Ɔ
,���+s��*|Yc����H4=N�������l��5n`�dB���x��S&zʨM?힚;*���5w������C�4��P�NJ&:{Q��[�,������h�+��X�z9���TQNlTTU���P�P���/\�kN%���6B�S����O�0�,���&�x�l��3�ɼY���Y��x[ԙ/���	�n����z$?sPd��>����<0\��_�\J�̗�쎔~����W��R��o<kU`7��+`"�ܚ��7�^�w�$��V5�[��`����_�J��/�LK��]������������5����?��xGz^�z���	�ɛ�%rC�o!~�����q���

.ؗ��+�� '|�ڙfv�ŵ��>����y{F�W�z���X���J嚁���k���_4�d��R�j߸����mr�8��)�:�J<�S�,ʎ�<�V?��k_��
bҲJ�C*"�(\�i%��
��)��wq�9�������	������~���g1"Y�D���)wu
�H+p$}g*��� �ĵ�=v�?�͏; �]��d$re���6a���������� M!X���G>�:�)Z�ض������uzQ��hl��Ǉ�왬p0��[�#�BI;£DO.�S����ցcrp�{�����YϘ��'s��M :܅lKv