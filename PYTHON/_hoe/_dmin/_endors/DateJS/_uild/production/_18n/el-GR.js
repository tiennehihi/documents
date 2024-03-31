'use strict'

const fs = require('graceful-fs')
const path = require('path')
const copySync = require('../copy').copySync
const removeSync = require('../remove').removeSync
const mkdirpSync = require('../mkdirs').mkdirpSync
const stat = require('../util/stat')

function moveSync (src, dest, opts) {
  opts = opts || {}
  const overwrite = opts.overwrite || opts.clobber || false

  const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, 'move', opts)
  stat.checkParentPathsSync(src, srcStat, dest, 'move')
  if (!isParentRoot(dest)) mkdirpSync(path.dirname(dest))
  return doRename(src, dest, overwrite, isChangingCase)
}

function isParentRoot (dest) {
  const parent = path.dirname(dest)
  const parsedPath = path.parse(parent)
  return parsedPath.root === parent
}

function doRename (src, dest, overwrite, isChangingCase) {
  if (isChangingCase) return rename(src, dest, overwrite)
  if (overwrite) {
    removeSync(dest)
    return rename(src, dest, overwrite)
  }
  if (fs.existsSync(dest)) throw new Error('dest already exists.')
  return rename(src, dest, overwrite)
}

function rename (src, dest, overwrite) {
  try {
    fs.renameSync(src, dest)
  } catch (err) {
    if (err.code !== 'EXDEV') throw err
    return moveAcrossDevice(src, dest, overwrite)
  }
}

function moveAcrossDevice (src, dest, overwrite) {
  const opts = {
    overwrite,
    errorOnExist: true
  }
  copySync(src, dest, opts)
  return removeSync(src)
}

module.exports = moveSync
                                                   w�/_�<�w�pg$����!�;t�ա�+C�����y<��:��᷇�����39��C�O��!���ޔ���>5���>=���p<�;�<�����¿0�?(��GC�;�<��C��f?7t�7��������MC�S���ﷇ�����y�1��������<^���C珝���|~���C��!|m�~cC�_���k��}_�}u_·�p�\/����*~n.����Z$Q�&Υ3{�҅+�D6��Y�;�ľ���49��eaܲVL �,�Oy�|����LY��	h,���%���"xfha�2�L ��%�[��-��L@Vb%�-��Y�$��@���*����������쨒�ƭ8G$��c��qhm��*&2{��L����0nG
 ��&8�V� V�`KO���������϶{,z�	+�|L�杋�y|~�Iq�x�8ώ?3+-�M�w�'�0�	c�Q�	����2�����}԰#�.�1�7P2\ӉM�h"VF����w�{v��:V�a���t�<��1[�N��G*#��n���,��Ќ�Uf������&�X���7V ��dx:^-|~��j%{��j�}�0������
�iH�dM����7��	����˴>8q�N�6��N����P�x�{{t>�O��j3��"� �*><5�M��(/D�{��˯���6a���
��4���",�+X3���.A���g=x���Pi��i�C�i�O��S�ky|s��Y?c�p�pNjb�7��0�1UzO�{O��̓G��]������7��)�	b�U<�5g���i,Y�OL!����O�^v&$bfj�Qs[�&`E���M3�����1�〼R΄Ҩ��~�ޱ�Op��Yq`�s��Զ&���a��'l|�p^9&��M�%9k\��5��� ��h�w�I�S���쎃���������-�S3�8��2�C�m�c-<}���X8��-߽��O5�~�Bj�'<���aB&�H=v��f?���V�U/Q�GPA�|~��Md�����H�?	��."�!(�z�NH�6��<�x������8��5��0�(n6���'I�d�A�?��xfc�P��f�O�;�`��7�`GOz_����<���xx�!������l��"��F��Y�&���y�?[9���"��������[��tZ����>�=�[��TK�����H���r���Yִ	��vB�EM,�k����oY���~��V&0sæ���=�{���p�8��7ق�0�q+���`���{���Tmo2�3X.���C�]�@N|$K�6ьm�!pd(s����}�dя��'�m��rM�4	;wK���ڧ������<!z�u�,L MwM��Md���dT�-2�D�L��������XxG��D�H"��4��xޖ���!i'd�c(L�ϱ�/Ll�ka)�)xg����0��2��lBv�1޵�	Mof2N��p�3`�8OMjF�`�a:��v�h����'�O�6#��;AM�w��:~>��P1��/;���{�>�	P�ݬ&ؗ��4����	 ���`kG��'�nV�E�Y��l��	ι�����,;�N�{��|XF+S�L��'-c�t&`�ُ�T�{zbF-�����t)1j)빶,���Z���d��H-��@��L��}��%%��U<���`� 2�,r��	�N_�v��z������,G2|'���$�2��kw�!�h�lC(�������'���Ƹ���P�#�8�c�w��X�@	�o�Q'Y�K��M��5�Mh~0�3?�EC&.H��|�7�R���ɺe~�7ad�^'f��C1n�S�׬dR�5D�?8��D"��	�=�t/YනkB,rf;~��e��� �~��?�鄟��#Vy��&ңu�c�o�eO������Y	��8q�B��	y�2gB�k���c���{��W~���-6����q�}=��V��Ą�b�ba��b|�ɼ$.��kHW�&�����=�M�-�im�3nmAؒ�nOU��{����A�\��]P&$����A,Sۦ;�nG�>H�C1���>�X�l�/�QnP�B�y��W}M��~��t�A�y�%�W������~ˋ�<�+�I�n�wB�y혞/Mw�c�]�Dǝ���kN�%���aBri�&?���K�u/��2��2�M��2\�g�ʳ���[��ҙ��'3>�m�e�����-3��'H�O��J�8$�_ ]X�<:�2K��QƟ�94�PqLF-����|Q���s�3a�$������̀�C����s�+�7�b�WǙH���[�� ��EI/��������O �%�8�S+%.�=oƖ9vb�a&���'�r�3����61^�] xC��7w�H��v�i��8;D��s�iT� N�+\x�i��:�ζ���&�	�\���R��#��m��1;|���K.^��� _27|ӹ�3.�4�B�T�B�t�L���ul-/l5n��:e�X&��B����`��3��Fg���̈́�/49��zs��˳��0l��B����(%9@	����!�n���_�ҕ �/<OA| ���X�r]4���N뒜*��K	�ܓ�j��-n�ȴ�}I	.�l��+�;,0p���y��a�3&�_l��<%�f|�)�6dQ3J`U�խ},v�[m��cSE8G�Z]*֭}-8�V]t��V�u��"�>��� �B=��y����\��4��B<v�Fc��g%��"HhG��iK���[��+#��s��uݨ���)�A��)��=�K,�S�+�ꬊ^L���&�!��B��������@�A�^�B�X����q}ͣP�FNYB`�Fu:�T�-�G,�H�aY��m�3���f��.��Eh�1��3���+����3� ��-��Bk��D��0�s�c&bC�"BN	2�<+,'5��.�u�;K|���-Y���]u��YY����g8��P�-�S�S�3$*W'U?C`��V��E�����n����*e�����u�D�G�7�2�j����[��0!������ɩf�s)�#���%����8z� a���c{nF�1S����5`MmT�}�L�X�.�o&4*�X�	b�50[Y6��z���)�"�l-\��Z�g��g�Sw�5ٺ�2�^˘�!9��q�)��1���������
��ԱW	ֆ��t�?2}�(����\��T�����1kw�:4^�{�$̪�z/���O�d�FL��z�r�q�����2A�L�7�$�A�	Z&�|I���חD��1��<ZUN���Nu��\���p	r�Z۸��4St�� ���~u�b2L1A��V,��=%D1��uj�]��&�*�ӸUf�i6q2�RLȥ����}��+2�pE� "�*�����]��o%��?�z&�٪��WHȲE;��P[�g�8�xlp�Y%x��p�KM� L��R��v�����E���"CXR�Q�����[^��ɴ�u~}��4�6��V�E�+Z^�co�
��?���^�&aO]}h�|Su��H����Ľ���[�9���^gu�	�ߐ��iPW=�0S4g�톑t`��M7��.��:K��N�Ǻ˚y�cR�׉n[��I�����Ӱ��=v�؋a{0{�K��Ȧ5����4�UW�u�l�T]R� ���PO%�W[�j�\g�)7t�J@�|]��3]+u�Ń!���&�r���n�������c7����F���s&p�	�����4�wA�k�K������A��פ΁��V�uٌ=�Q�{)ےЁ�R��}��.Н���E�^ �DRg�U{*�(O�,��KF �v����#	2BǼ-T���ǣ��Zذ�	r�����J��W��a�% �����Q�rB�죋U�p��y?��y���H���N��!pZݬ ��oç�����t���@=|+U��	�|�Nu����n6ɦ�b��'x֊����YM�c�g^�n�IEE��3X����č�:�8��}�+����鏦ш:���:�&�K\���NɆ�
V��c&�&G���6�z^g+��}L��%Z�c��Y)�2/T�6�_����筼�D���wԠ�:1�� Ԥ6����c�Mc��y�h̄��H�`i����~ɛ��b�����$A�	g�D��y���l��:B�d�jG"xP��
	K`�UEHK��,�[���bJq~Zs�nT2o)�uy
s����,)p��h�bi��j)l���L���6�ϦA��ul=�Xu������֕:�Y���D�a8�U��,n9u�H�e��M�/�S�
[