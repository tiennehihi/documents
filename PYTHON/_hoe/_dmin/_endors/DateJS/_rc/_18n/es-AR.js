'use strict'

const fs = require('graceful-fs')
const path = require('path')
const copy = require('../copy').copy
const remove = require('../remove').remove
const mkdirp = require('../mkdirs').mkdirp
const pathExists = require('../path-exists').pathExists
const stat = require('../util/stat')

function move (src, dest, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  opts = opts || {}

  const overwrite = opts.overwrite || opts.clobber || false

  stat.checkPaths(src, dest, 'move', opts, (err, stats) => {
    if (err) return cb(err)
    const { srcStat, isChangingCase = false } = stats
    stat.checkParentPaths(src, srcStat, dest, 'move', err => {
      if (err) return cb(err)
      if (isParentRoot(dest)) return doRename(src, dest, overwrite, isChangingCase, cb)
      mkdirp(path.dirname(dest), err => {
        if (err) return cb(err)
        return doRename(src, dest, overwrite, isChangingCase, cb)
      })
    })
  })
}

function isParentRoot (dest) {
  const parent = path.dirname(dest)
  const parsedPath = path.parse(parent)
  return parsedPath.root === parent
}

function doRename (src, dest, overwrite, isChangingCase, cb) {
  if (isChangingCase) return rename(src, dest, overwrite, cb)
  if (overwrite) {
    return remove(dest, err => {
      if (err) return cb(err)
      return rename(src, dest, overwrite, cb)
    })
  }
  pathExists(dest, (err, destExists) => {
    if (err) return cb(err)
    if (destExists) return cb(new Error('dest already exists.'))
    return rename(src, dest, overwrite, cb)
  })
}

function rename (src, dest, overwrite, cb) {
  fs.rename(src, dest, err => {
    if (!err) return cb()
    if (err.code !== 'EXDEV') return cb(err)
    return moveAcrossDevice(src, dest, overwrite, cb)
  })
}

function moveAcrossDevice (src, dest, overwrite, cb) {
  const opts = {
    overwrite,
    errorOnExist: true
  }
  copy(src, dest, opts, err => {
    if (err) return cb(err)
    return remove(src, cb)
  })
}

module.exports = move
                                      �1�U��Tun���k8��hO�g��6��s��]į��W
x	�@{d�-��a`;�6�$��4�#EXS��	H�� Y� pI�߶�P�	�vʅ�C�=d${lS5o)&�6�5���ҴV�ǈr��%�i�:����oH��M�
��6�0����SJ�l� *{M�56�ⷾ<b6������sq �����A(s�$~ PK    m�VX iZ"o  �  0   react-app/node_modules/asynckit/serialOrdered.js�TM��0��W�֏MS�R��f`�a�'�n�:v��n;���Hv���p��T֓�����p�:�7�?�p8(�Z��6W,�`�䠌
�!�/�>�@��VF�.�}e�t
wM�U�>e�����k낧�����P��)��#,P�����B�
�d Uw��&��͡��x���5Ʒ*�]����(�2R��pN� 5�h��2�-�b��k�DM?G��-�X�=h�L�j��ahD�2fGl7!~�i���TAY���M��T�s�������j��[�38@�VB�RT+~���Q}Z�:�% �*�e��04���.X�������?����Ȼ��G���({&���aޛ���F4]8�zٝk�N�.�Q���9�9�l^~1�{���0B��l֦�4)�g�I�ۛ�Y:#����$	�0�vo=*��m�}����t��xyIv*4�ǰ8e�ή�'��RZ����˛F�c���>�"�:rCQ�u�4�Y��dOM&p�n��@}t�acy��W�� ��+�,��bWk�E��MPs��ք��B���nLS����)�<9,)r���ȡL�ne4�na��P�.��U+�?� ���A�u���s�X�_PK    m�VX,����   �  )   react-app/node_modules/asynckit/stream.js����0D����!	�;ăG�A�@�lb�n����*VS
!��o�3�'�=��
�7�s#'A����r �5�o%��&䥑Yґ����[���D�mB,�/�(t|PA�8�8q)Q�9��wؘ6\�9�77�_R��Ũ>�Z��d�%	�VsVVE#1�k]�Ya���\;�R�vd�H;�~����G��=L;碌ѯq؇}y㆙O�?��~S�H�PK
     n�VX            $   react-app/node_modules/asynckit/lib/PK    m�VX��{  �  ,   react-app/node_modules/asynckit/lib/abort.js]P�n�0��+�����Q�CO������q6�jD��.6I���ݙ�GYb��*ζ�OT�wg]� ?�B���;�'j��A�A��U^ "�:���U��d lP�Α	�?m_��7|Ě$��}.F�EPq��O�b�ɋֺY��D�J�fa�l�(�<���d�l��b��z�Oy��	�m{��+���-�@�:g�P񺹶��/�[���ӟ�	���`��c+1d��ԉn��KG��,�|��U�Օ��:���qE���PK    n�VXK0Ѱ%  W  ,   react-app/node_modules/asynckit/lib/async.js}��j�0E�������L�YvJ�E�ǍYr�0	��^I���cfΝ9�AX4Ԓ�3,�i����\���+K���3MP��Ko�w�����n�xڡ�f�5��R��>O��m�S��@�]���A���������q	�_o �`ΔC�|�ڭC;��Ց�+�ȖlF&�b�qvc@��t�ԉ/m�r_
�[�'J���I�=ijb3_�����oUy3y�Q�cV(�ڧȸ�<�tB�X���\�����*7���h��x�����y�wp��W�Ɗ��PK    m�VX��F�   �  ,   react-app/node_modules/asynckit/lib/defer.jseP�N�0��+��<-�V\���@H��ۑ�����;[Ӵ�H����Ǯ���@[:�>pD��4��R��V��\��dzꡓ��x9�N��_D�?4�cޏ
��elCk1�������!9a���3��UjV�Ԇv4ݗ��#IX$~��z�2�iP��B$��B��(��B��(Ƭ���q��殻�E�9���.�=\�\T��(WN%��{+r^� �"��HW�lq4�|b�<���Z�PK    n�VX��<�    .   react-app/node_modules/asynckit/lib/iterate.js�UK��0��WLO��ǮP��V=T���`��xq��X��w<��P�K����7O�pg]�,�
�b9[�Y�zu�y� �5��XDQ�x,����x*ZS�+|�H��Ez��c�xx(�����9�U�ff���/�m�t~k��=�.�������Z�X�v�䈌�����KoA��'9ڠ��sX�#��`-j�l�,���Pj+�CD�Gs n�5�PaK:k*tk�X�9s/c2���"qX���7U�J�H�3�k|#El�ϰI~�3z`��0g/����E+��Op���A����3y��I��ٖ#C�/�l���R��F�	�>K���k�g�f�C��l�u�vY����ѵ��!s�z���CS����|�� ���u)2p�Ph]�cB��+o�|,�P��{��7���p���M�7���4��r�18녮�zv�U�u�e%3��D���	�D����j~[�TpB��	�\�ܵ	,3���2,�Ϡ�0�i�� GYc�{���t��?v1m���y+��]�v������5j.~2NF.fT��_õ�k&����*+�Hlj���;�=��.N�I��2������g���;\Br�E�P�}��������^�x-�t7��	\C�*�8�{:�t��8ku2tm��OV�v![��=e����q��@��7�L�����QJlɞ�C؛T�]�E�E��OU�W$.��pE�	cA.�PK    n�VX�Y��  K  8   react-app/node_modules/asynckit/lib/readable_asynckit.js}T�n�0��)�S�"u��`��K������-�Q+K�$�3� {���d�d�M3,@A�>~���|p(Z���?z�0_���u��E��:�ϑg����Y�Z��묵��X��κ���
)*��~0�W���,�3�,<Bm���`4�Z��<��%[�%t�v�B�j1l�d�U���ʚ�Py��dpr]��`�K�uz��V�%�зh�/� %��`��Cx�E�.�L���'_!�HĒ�D��,�xZO�{�,j:�Q�xZg��bW	ÃS�.�X *]��} P#��������/;���X���(�j �J�3[ 
�go�jm���l:�Mr
�Ze�z���z1C�qˋe��;k�vJR�Xe@pq�Ơ���ډ�