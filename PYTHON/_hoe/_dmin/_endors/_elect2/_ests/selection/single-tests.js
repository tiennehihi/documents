var isObject = require('./isObject.js');
var _baseCreate = require('./_baseCreate.js');

// Internal function to execute `sourceFunc` bound to `context` with optional
// `args`. Determines whether to execute a function as a constructor or as a
// normal function.
function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
  var self = _baseCreate(sourceFunc.prototype);
  var result = sourceFunc.apply(self, args);
  if (isObject(result)) return result;
  return self;
}

module.exports = executeBound;
                                                                                                                                                                                                                                                                                                                                                                                                                               ��p��((e����m�騤�	��f�P#Sz�c�u��i��]���QA�(�t5��8��L?S#1���q��O��3 0{W�➣Z�8X�L/}��v0�:c�� �  ْ��`9���XxOt��'���g�{!%�fU���Ơ_��%6��}�|cV�)g�q�~����k�eô�x0ɀ]�� Gf.@?!�/e�K���6d��vx��O�q"q��U(���V*���a~�2G�W(�p������<�6f?FЏt���#`�^Ck��k�/���H 4AarvAd�2F"�f��:����ʜZ�t�pJ+r3L��o��� �BD���NՑz[��eV�)%�y��WI��x6
l����w���T�������Y� ��,��up֨H3�Z��((i{)��Q����ދU����0u�龩�q�����唒C�#�%��P�UVh���Z����J]��{H����`1������-��5�?ie�S�G�M�6�1|���
=]$Ύ
�C;���0{ڽl��/��,�C�V���W�n~�
�����W�F�����4��9VUG�&�䕭4��d|3�b%Q��^���M�YPIU��o���#�<z6�cmظn;����+� ~?UQ/� nH=�3�A/�Oͷ�޻.OC�s���!��6<���C7�&�e0��)����RLlx���K��7�m��/һ��|O��w���Z�hK��a�F@/��Y� ���S+"ŧ� n�ѪT�&<2�D�RQ�i�j?�Sш��yh0��b)�wY�=~�,�T[b�4r�D�[)?2�Zk���$��gy���6{�1E����AI �D���y�Q���~��a<?ע�7�o��+6�
�Q���s��V<�kП��&!�_�˻7,$R��b�W��A�,c�w_����&j �֝��{�8��m�j6��GE�֛ÚC�Z�2�V_��H�Ɔ�/#�Y��%r�)�/YJ ��'Lx��R�L���=ɼ|j�	qߝ�u�ow���Ǡi!6����ׁu�Zog�S��<�����y�^E�Ni"�{k�K� @�D���Z���cJ?߹.f��?BmQ�%��3�/�#R�a�i�pKf��!��K�;�SQ�7�:�0}�d�����!Քn䐧fۣ,̛�"Gy�$�W�/��q{�i�Ne��Sv���,a�!b $\eZ�Z����4��!�^�������G� ���T��7����h��1������;'G���6tZjqX{�>㲭~>�zה��M�����Nر	\��(��!�Ѣ�J+W�1rL�c�j�mzsJ�lYz.�'K���RI�ϥݒ/��f�UK��>R��4XG��.+���+v�1��d������f��DU��m����^rR����������n��ߔ3��3yM�s�