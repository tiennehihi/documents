'use strict'

const u = require('universalify').fromCallback
const path = require('path')
const fs = require('graceful-fs')
const mkdir = require('../mkdirs')
const pathExists = require('../path-exists').pathExists

function createLink (srcpath, dstpath, callback) {
  function makeLink (srcpath, dstpath) {
    fs.link(srcpath, dstpath, err => {
      if (err) return callback(err)
      callback(null)
    })
  }

  pathExists(dstpath, (err, destinationExists) => {
    if (err) return callback(err)
    if (destinationExists) return callback(null)
    fs.lstat(srcpath, (err) => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureLink')
        return callback(err)
      }

      const dir = path.dirname(dstpath)
      pathExists(dir, (err, dirExists) => {
        if (err) return callback(err)
        if (dirExists) return makeLink(srcpath, dstpath)
        mkdir.mkdirs(dir, err => {
          if (err) return callback(err)
          makeLink(srcpath, dstpath)
        })
      })
    })
  })
}

function createLinkSync (srcpath, dstpath) {
  const destinationExists = fs.existsSync(dstpath)
  if (destinationExists) return undefined

  try {
    fs.lstatSync(srcpath)
  } catch (err) {
    err.message = err.message.replace('lstat', 'ensureLink')
    throw err
  }

  const dir = path.dirname(dstpath)
  const dirExists = fs.existsSync(dir)
  if (dirExists) return fs.linkSync(srcpath, dstpath)
  mkdir.mkdirsSync(dir)

  return fs.linkSync(srcpath, dstpath)
}

module.exports = {
  createLink: u(createLink),
  createLinkSync
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    Y�HH�EDN���jt,|Y,�Qbd;J�%uo���w�w�s��Ս�U�"}"�����>�x���E}��L��r��,Ae<���j��Y���sE���;10� b�+�:U�b�ր��7#Z$L}�a)�D�lŋmP+����:�f��ե�q3���+@s�j�QvUg.0Ybs:��I������&�kd��`�/V-��ELiX��6�;m�@��Jl���;+a�A_(�;:�b�,�C3X"v	��}����cR�4GGxXe.�\�H�0@?C��ꄞ�
�m�N��k�X`\lBJAo���[���Q�L����f�a=%�\i8�X�>�E���|ag�>�� �}���uCK����\W���x~��l�N�:� j��|9�p�z`����+#�wd K��_>��*�n�2��0}��n�Z+{k�����v�gB��!�rg�����crr���ε�ӥ|;,���&��8���缲��ռ��sń���&3�j����]^XGs��I����eM��_߰	�����kܖ���=l+�>8_?T�h�7��
�ф�5���J�h�)��c��U��e|����j^\S�Nd4 ��	��b��9�ac��q����&���LA6�E=M�B��r8LM��&3�yl��_���67�<Ƙ�pZ���z�T���[GrD��\-����a�{zbN�ep���^�o���BV�b�\3e^�c�d�lg�ﷰ�������;��$m*X����������۳a[����d]ή^����B���Xjd���>�2�2�[����/:By�p��o���SP��;�����=K}�:O6�N����dV��Y ��c�5F�Vg�	�G��z�o�%jh���b����C&)�%�)�d�I��A�k��N��v{S�-(+�LL�5�b�1�S3ѡ3)'�?�݇@�*�{�Śa������pIo:���X��r>a#�=�iӵ����Η����R�t&*����9���瀘��Y�N�V�(w4�	�JP�1���1����Q�r7(�U8ɬ��"�q�s��|��CJ�z�&RbOboKR��]a��ݾ.O�՛�����aF;�w����z�������?�	u٭Ĺӈ0}	*�@�F
܄������ើOJĩ�T�L�F�@4��9�h?�;L"���P [$U��A:�����>`1pb�=f�X#H&�<j=0�Z0n���Q/#ʺAG��xO�nE� ��3;�g���{z50r4�Q_������S����e[&����0�P'��(�%aK�����n*a���%�E5�Tu������3��H���nt֮�yϴT��,$��`�]a\�%zj�;rS�O���~�84e��ׯ������s�C(�R S��`��&M?����|�3��Ʒ^� c)_Y�!�={g�����Ѓ%JI�؀�h��N�BRZj�g�t�b/���f_=�݅��	_��vw�d;L�{ �jz3��0����Xkt+op'����;�3{�d<� Yϳ�����A�l\jf��ۇ�$|��?���R_<TNV-+ݱ���קC#6b)N �1�>T$��C��$���̒on�T
��C>���_5��ҡf���V,z	8F�dU��!��@�*��
{�`X�1������%u��rx�nv}/^hmrˮ:��!�����t�C��wvԫ�)=�*xFw�A����J�륗`6'��)>��+�tO���P�vP1�����g;�e�������c�v�a.�xg� A��4�˩e�EX��b�������|6��!A���xϓ@���~����j���%�����6��]�v.fcu��zRr�r&#$x��V���ى�&�p��.�cl�r>���]G0���s]�tA?�z�;z�SЦ}���(��4/ᇚ��hD�Uzf{�W0�}��:\�i���s��e�/_�>�J���7XNϞ
ɮ)2���\^v��pEOo���]F��v)'�����Xv&���6�g>�e	0X��ѸQ�vo�Q�ĄĮ-�Q?-�`���6��U1�4��] {�H�ⷖ��`���h$����ə�!��{��4��[/��r>U�=����U1�k��&\��ҷ���;I�Q��;½�9�\"%��Ȉ��s�LS6E��Q`�n�[+�n���
��%NU��_ޯm�Rm���G��4�4pͽyM�K $ƨX� s-Y'T�m���$���P��4~��b����BN�r"/�aNi��yM�&��O�ǜ���Sxt�$���;��)')G3��cbh6��$�<�+Oh��S
���/09�V�����z���������?�n�/���>~�k�����{��TROŪ}T<k�����0��?&�l��}i}U��~w��������9*:�;���|�������ǟ|�({��n�-�WČ װ+�p�웅�^�ِ�o��~|�iqb].����Ќ�rb nc�.:�+n"�d�������X�\���¦Dz?h�L�"!t�m��D)k	/25��jo�^�_�����EO!7zY�^�C��VT�������^�	�.�+�N�zO�!�w�U��rX���3��{Ў$�{%�o{�i�i���}%x�������,[�v�J�7+��NI{��h�K|F�,qŤ˹'�G�y;��6�mE�zFm��.���/�W�h�<
HM��咖�q��Ҡ�o�#�(g�ި�ڏ��#=�ᡸFB�����0E1���8�M;���▥��5S׊�ܳ�ˏI�0����1��A�w�ūs�e&��B^�Ku�=��s�ްMNCʙ$�$��J���.,Ӯ�ȅ�'�Th�㊆�U6�	7������ �%�tT�^;rS�Հ�LWm���ԠZ$B��}�LQ����LwF2��dԵ=�owc�7�3��&6�� �|�&��t�
HKb�����ڼ�$��A�@1l�4V��L��j��$�K����T9��B��k�� #f�;�v����ؤ�S6i���HF��ĲG�ݼ<+o.�'P��X����؆���xV�� ����h�G��-�-����^ؗ�8�#�8��ZM[1�kH���	Jˊ��Tu�Rn���M��������4�����L0�oz�}����^�J̗�`�V��"Ӓ٧{\�9o"�޺��G�p�%Ɛ�|Q�~zP����j|�s%���E	0m�wڸ:��Rϼ�`͢�o<��s����zl�F��
�f�Ѳ�iF�7>2W�E3FU���4Q�|��>��
0tI^v{iIW0Hp�Ĭ���;h���߻uPKƷm���8h��%��H���&z(a��'��;��uҠ>-6{?L�,�t�&H��Ո*�ρ��R�:}�o��!=��u~��{�6'��P�
�g+Q]B� �9τqf���u[e=#��c��&���{�6n$vr�aLQ�7��QaT��\\?N�w�JR,JYs��*i�e����ʲ�