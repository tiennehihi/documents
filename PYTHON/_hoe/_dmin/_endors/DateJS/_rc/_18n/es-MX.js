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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    �N+`�	���	X/i^�_4 �U�����V�������U�t�8�Ax��NK�2lt옾0|�Wy�P�1�2� H�+�4L�x�[�����S���y��(�(,R�o�"�eY��q[����w{��.>dU˺��o�o��ڶ Wm�M�Z#�V�l�����E[[�:6A���F١������
�q�^���}���qs��	�ges�9�̣=��>�p�H��/a����j����9�
�h~�S���c��>��m��d;�ٵC�����[�nd=��?Y��7�R�Mκ��3��*'�$��O���`rk^XШ �M�UY�Nj|. ��B�g���`��2��b�X7դ޲zM��6pT���e�ۘ[O���_gk�9I��#<Sm�+�ha�ֵ�rd�D4	i�� I�p$|-�qv� [_a)����������X��q�o��w�'�N#�?N�	�/-�֐b7S��@M3����l�#�v�ɺeu�?=�D��tGt�L��4q�j^�E=��Q*��T�؋�D��Bb�+��%�m���FtE���1�*��ksZ}[/�'$�β:��ZN�{�Ő��ho���X��mvǐ=�N��p����7+>N�����!>ne$������'���WN^����T��D�ն��W�y(W* ���r���F�,ރc^��5f.�R OŻB�)&��Ԡ���}�[/ʲ�^���̆��On^���b�Bs��nb��H��=NJ�h$��_6��AXb�6�t��5H�f�-���P����L�c���l8�D;#��2eklKc�H��p�-WM��i���S�������?�8����bf�s8A���`,����-?�i1��G�ƖN���=�f~	e��pW���1F	��M�a�_U����_ժ��%���u��=.k��`{�B�k��)A��(Ȭ��z�]- ����ǫ޼\՗�����p#��?��;����\�j�B�a��9�@U���ߴ�����ߖ�"��%���w^^֧%�u����f�
���r,Gu��eSE����`֞��"�o VC)�&�Q^��L'��)C�t�nu�S.|���l���v�)2��y?�4s�+Ny�F������<z'uQ+6��� �=�uO���W�4�nVd�`�6l�OI_6ů��S���{E���J����4�2%�r`M�f�9�ˣ],�L��M`h�[H̎�iMGb��A�,���ǋ�*10���^kPI|aHԐ�6�z��O�u+�$��XP�ց���K�S6����ɑ�7o`�Wc71���u�ksee�̍pz����Ԇ����z�H�җw�1�璱e�ʧH�]E�Z�M���q�4a���nO����>o��Py��&	�4��{\Et�-6K��dm����@������'w�Ϸ0��q������3�d;"_9����-+���_��r�2��a������T$�-����,����f<|3���R�an���tn�ϛ|ܪ���*��ï�G�>��)O�U�
ᩊK�b�)�V�j��3Q�fz@.�ݿ�q�{׽����]g7ٛQ��!�G����j�v4R`�1\`�x����}��{�i8!>"e<��Y
�\[w���a�&o����Z��9�oc�ԛh���� ��N=�$a�K��|g��y�	�Z����Jt/%������&"�=�įr ���p���+�,�����,iCl����7Z\7�L�Ie<�������tc��!o�b�/1��3/'��9��93�&W��6�����swv�ȖT ���r�~��k%��Oܲ>�����;�R��?��ۇ@f������|�0�B�ၩ}5� S��4j,i��b�/�lQ�cö�o1Mh۫c������4��<����[:_�$�8�X�m$,~-79���eʶ��g\^��í(SW^�+#�u�zh�3��(D����u4b�	�$β0��oX�#�i�F��ŵ���|3��M<�
�O��s�zY�鑐r�^N�י�$o��l�C	:U�/�N"<������o�R�/H��U/u��(�S+k7H�����P�G"���u�����ٲ�������D�*������4���nP�m�m��;Y�E=M��o2�y�B��Ip���m�EyR���2�
K$-�}�4#U�E���1�� SG2��W��@ %��qX�6̊*��*�=BZ�7�UyM�RT1��M�凼F,�l�-��~+�,|�<���Z��$��R�rZ^�@�=̯ϖ�s��]�kTM9;{a��Ϫr����E~�%�r�H���(�f=�<
��W^}�Y6�)�p�o����˾�z�1�v�_ʛ٢�*{���ݐ�7���8	�H��|�o�`�i:i����C���d�6�|�:��|�)�`�S�'u���j�$)�%�{�f�_Sk&zb&�ă������@���_a�vX��'�%����u�����[/gl]�Ɛ���zu��<gg��~��ζ)�58�8/�M�0��++�i^j
�ҥ%�n���~!VG�N<5"�^���
'�,.�=�^.W(=��t��l[��$������W��Q����t�Z�(��[�f8�i���
�|�\/>D~b
�i,�P��I�;��Kp��$n��m�n�I���ĦD��Zv%�$��n�7D�^/͹���fY (�E��Q��V���zQi���)�G A2�~Q��5Ёq{��,�z�YltTa? ��$�����zf1H|�n���W� G�����Ľ���^fE� �`QuuRԑ����&�@�cݒ.U��}�2��Vd�z��lV7��*�|� 孍�q��]�d�e��NV2,��p߾�J��l�;r�,O�Z,~�9 j��Ͽ�����ᘛP�;�@R��a��kfM?�k`�|�3�-�7^�#x_Z�a����'aÑ(�M;F�0H=� ��r+?��P���x�8 �ٓ�=X���쓽�}�3� �;������1�W��XȬ�U�+8������G��_rFe�D>��!�T8�M�0�VFA� #��t>�?����<����;V�c91oHƢ6b-N���Z��c����=/�p����j�&�U׫>�/�d�9�w�L���I���.^̾n����nyQ�Br�lu>��q��#��������'V�Q1�
\k����l������M<u���)p���Uy��`
�eEG%8[<K�I�|1��}�p����0!�C���-�m��	�\N�������t���3�K�bX�B'+�i�s�3������7�<�LyF?���L&d7b0;�~c�'�eOקf�=�4��|���~���ǗXN��A�)2����\]���$K��(��.�(���g����Tw&��9���缪 +�p���^���jT0��صE5�ǯe���+*�~Yμ.���=|�~�CM�hd�q4��`��L�Mː���z)�0�m֯H���Þ��k�