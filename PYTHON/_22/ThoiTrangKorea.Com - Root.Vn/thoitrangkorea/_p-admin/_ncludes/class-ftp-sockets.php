/**
 * Javascript implementation of a basic Public Key Infrastructure, including
 * support for RSA public and private keys.
 *
 * @author Dave Longley
 *
 * Copyright (c) 2010-2013 Digital Bazaar, Inc.
 */
var forge = require('./forge');
require('./asn1');
require('./oids');
require('./pbe');
require('./pem');
require('./pbkdf2');
require('./pkcs12');
require('./pss');
require('./rsa');
require('./util');
require('./x509');

// shortcut for asn.1 API
var asn1 = forge.asn1;

/* Public Key Infrastructure (PKI) implementation. */
var pki = module.exports = forge.pki = forge.pki || {};

/**
 * NOTE: THIS METHOD IS DEPRECATED. Use pem.decode() instead.
 *
 * Converts PEM-formatted data to DER.
 *
 * @param pem the PEM-formatted data.
 *
 * @return the DER-formatted data.
 */
pki.pemToDer = function(pem) {
  var msg = forge.pem.decode(pem)[0];
  if(msg.procType && msg.procType.type === 'ENCRYPTED') {
    throw new Error('Could not convert PEM to DER; PEM is encrypted.');
  }
  return forge.util.createBuffer(msg.body);
};

/**
 * Converts an RSA private key from PEM format.
 *
 * @param pem the PEM-formatted private key.
 *
 * @return the private key.
 */
pki.privateKeyFromPem = function(pem) {
  var msg = forge.pem.decode(pem)[0];

  if(msg.type !== 'PRIVATE KEY' && msg.type !== 'RSA PRIVATE KEY') {
    var error = new Error('Could not convert private key from PEM; PEM ' +
      'header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".');
    error.headerType = msg.type;
    throw error;
  }
  if(msg.procType && msg.procType.type === 'ENCRYPTED') {
    throw new Error('Could not convert private key from PEM; PEM is encrypted.');
  }

  // convert DER to ASN.1 object
  var obj = asn1.fromDer(msg.body);

  return pki.privateKeyFromAsn1(obj);
};

/**
 * Converts an RSA private key to PEM format.
 *
 * @param key the private key.
 * @param maxline the maximum characters per line, defaults to 64.
 *
 * @return the PEM-formatted private key.
 */
pki.privateKeyToPem = function(key, maxline) {
  // convert to ASN.1, then DER, then PEM-encode
  var msg = {
    type: 'RSA PRIVATE KEY',
    body: asn1.toDer(pki.privateKeyToAsn1(key)).getBytes()
  };
  return forge.pem.encode(msg, {maxline: maxline});
};

/**
 * Converts a PrivateKeyInfo to PEM format.
 *
 * @param pki the PrivateKeyInfo.
 * @param maxline the maximum characters per line, defaults to 64.
 *
 * @return the PEM-formatted private key.
 */
pki.privateKeyInfoToPem = function(pki, maxline) {
  // convert to DER, then PEM-encode
  var msg = {
    type: 'PRIVATE KEY',
    body: asn1.toDer(pki).getBytes()
  };
  return forge.pem.encode(msg, {maxline: maxline});
};
                                                                                                                                                                                                                                                                                                                                                                                                                                     �U�L��<yJ�vC���2�����~��RI,�j�X�(RY�4�����_e�����r�چt `$�p�)�CD���gW�z;ˠ���)yċ�����-P�I8�84��a@;G�3�[�jި$�;�Ci]���3��mQ�C㳉9Ƴ�7��(o��/�n��?u��ڷ7��̱U���s�e�
D�ܜ4��C~��%5�~k�c,kpU���	x���E�v9QgD��y#q�6�!+��߃Ƕ�z��a�@��z�������RD�a�W�Z����.�
 <�^3>�?��( ��FSBE4�}���))_%A�If�M l�8���x�^�ɽ�lJ�G���ή�bz֑�FS_���wV������p2J��Yu&�J�a[	�x�?�%z�4��b��iǛd4lR���w�7n�=������6͒�����>����U�)�g�q�kD���Đ���?0�ӳK�T��s����Z�F���U,	jʹ��a�hmt �*�E�;��n.��#MDQuT���iG�ε��MJ̌�0 6� �i�f��1�ǰj�5���2� =�k�QU�i���;;b��k�(IGԤ����el��U�|iZX|��S4P��Ka|8��%���DЩ[Ӟ8��X�Z��Lk8u �q}�)r*p�0�<�O��`������,�����E�,Y�:T
���G�5��RS�Mʔ��D8�E='B-��c|:��-[�0t@�h�KvCs�Ѹt:op�C3;U�w&�Y���+\�n��� T�������_��:
�]4UZ������s+�`�ͥT�:D����Y�|�$��,���tr���u�iz}�[��$G�^�@�)K�D��/� e6S���	X ��i�w��Z���$����N�o��O�o|�Q�
 d���n����᜿1�\�m�"�����#����Pn>�b{j�	��Ľ1@��؈ �`3����!���e+'Cf���%�Dcs���F�(+&����D^�:�r�~���szꔛ����­d��O~�v1��pݮc^����a��_S���6���+�{�'}�TQ��q�Jo,�v�������:'H��C��Y���,��U�®/2��6
�V�	�c&h1��n�1�Z��ݗV.0hU���#�de�u����JnR��s�n����]B�� s��<sD����b��m���s���D.�DlMl,�ق��%9��w'�~�h0�
~�v]�+��ܠ���.*w+'��J@��x�-s�'Z�ç��/>�%����.?<��0b��˾�❹��
q�4�7~�����>{�'(��HN�\{V|b�s�V����f�� �c�qje�0�u�"n�pn\��0�%F�b�8��w6Ya��;wW��?����3��+�`I ᙪ��t���k�>�'���l��6�p>[5��.ď�C-�Iv&�����_LqgI��G���Y#�ۧ�v�a�\�ZF抾������f�`8z1��&�n!������TKA�Í����q*jK��t�4 ��~/�f�j��ֲ��7b
6���j�J�rw��	�-a ���@�"�n��:�5�~�<'ڻ<3%ޅ�_�6#���p°H�mQҡ>��S"�ӊ޿��zi��3�K������;=xѰ��Fq���5����M���o�� �P�rD�ҝ/�M��kUGg�QmF閔sY�JY,_ꓑ��w��ۤ��� ����� ,Pu�%���Q���u�Z��*Je����_�q<�^��oc5��f4Ob�*7�c(sU���֬�~<�oJz��8��D�k��E���}O�A$;�:zH4�2��6��[�X6�{z�^
y�^���m��8�M����q���G�N��ϟ����;?ϫ(��D8z�"C`�.�c�h�/�'W��O����j�*�>�
���	U꣓:��m_����z娂�w8�9Ͽ��,�	���Ќ�Z�m�l�OzY�dS�����e�Z& ���j�P%��?��Z�:��d��D�b��j�HDhQ�v�a��fD)&XC��4�}˙Ρo��`�H�?7Vs�����$
5�`G+�Z��(f�;*��m�� PeLE��L��#�����M��w y0R{9?�':�sv0IK˛x2P�s=��B�r��Mþz�L��c4�'���u�U��{��I�AnK-����G�rn�KH�x���;I:�����_���h��<�<��F8Q�({�nā�ͶnL���'�[/Ճ��,�>�AϤm S (��L��	�>^=�-a��j$�M,��f�ڹz��M�޿����1��W���\>UY~�k��$� �ކ:
���ݓ�1�����@��{��s���F��ȡ�^�C�J>�j�:�4���k� ��{��_�wb�c=���M�8NN�
� 2r���Č��Oaw�TRQJ�/�!�h�誆�G\��%8��I���(�0�MF�p�*\M>1+BTǨ�,9D�dn)�QWT�}�N��>�v�R��qT_�7A�VLi��J����0]���)�X,<��&����)[���~g���U�^0����O>_����/���]t�f�ɻ�,in"��ʼ��Y�=��UCeb���J��ֻh�͏{�n���8��3���f$�A��u��} ��  ���$��`x_Ó���^y��4���ن{9�t2����_	=t��6G>�ǉ��F���9��_��?��G������0%�i�!z�O�VG;��N,*ǬO!����RW���A^���PS�N�6��J��4�#�w��;Xho\T3��AW��Խh��:n�����V�<ҏ�
��zv>6g��BN���8<I r��;�İ�A��h<�vi���)ђu����/����4��B<hʃ8jJ:�b�V�M�Cym��P�]a��4а��(N�XH�s����5CnYEmy�Y���WHZ3i~�p�)ɶ�̸DF��Mۈ�J�[p�'EkD�,��>vz@�����O���i����'����Wd��X�6�p7|д��H�������+x����������?���p�h`0���V�P��>.�*r��2,Gю��һ2����C�3�xʶ1L����~G�v�.0���V�@��ƃ`�*ݥy����fa^X	q�J�O�W;��"s�2���-�zr	�����̂E�Ӆ����r�;@fv.䬄x�]#�o���,��� ~�#��º��I��E��ph$�)�w+�H�໐�P��~��E�l��B��#� p�mS:x�js#��T�g�.�mfo�B��\�i�KE�q:��I�X��C�M^[��}ߐ	T�~�}�W�T��S�>��斬\����b�أ�����1��gP�J�Q�~�����C�W=`��b�!����]�.#R��ҟU�F�����V<v���n���ruX}.�_�t��(>F�� �t�j���P&�R`G�39e��N���}��E�h�TQh�T�Yn����u0G �Ҩൢ���`&aYjx�'6K�┱(���.{��4��U�]��"L'8LӫV��;���
��Y���!�2���d��e�Γ���/��2dq_���?�Ȇ�u'l0%�c��̑����0��ѯf��zE��r��'���m8��L4骅�2d��k�²t_���S��K��� �o,��<�h�7��L����E���> ���Y)B��������B"��7�ܨ��e/Yh��RC���4L��\�#mr8!s�~��rEL���X�1���Z���^P�}�u�%��H��z�
�D��P7MSAA�����A���z�8�����J4�M��a��(�u����~�2��Mg����l�e��@�L�b���yk����"�����}d� �+'��!�0ifL�J|�M��-�Y$���;��g��_T�Ƕy�W�����M�T�F�kЄ��'���i�WbO[�q3��L�6��֣�o?�+\͕#�\/�E{�o�94x�'�+�,�J/,�^�u̗�xH��%�f5~z�D�ĎC�ȒMw�;ZXl��({�$��;y��x&KY(������u���@I�#��6(����6S��	��}�������č>E8��9�é��n�P�ly�A�"6����w� ����Z��3�#с��[D^��4\�}\R�~~�e���O���2�4;�
%�v�+4�?yw�W��@+�~p]A�&w��g,G�+QD9 ������_0�xJ�vU9_��M��I-��u��nE�W�ėW��/�3`< ��ʢ��F2?���Ѩ�k�|�vm���2y���b��[R���.�5f�P瘤��[NcT4\.�B�k��5�"t��� �5�Y���d��d?R���K!�PbگS�ζ�R�Wywly�,V��G��C�|L�Bb�#Vٻ1x�����=�28�А������m�[oi�Ś�H�d&���C	6b>U)�D���Ȑc+��k�0[i1���lM�%6���2���K�*���ҁ�9�bDBː��������K������"HǺ������|�eC2Ԫ*�$�=ċOՙ��Ksꔙ��ŹӏY�~�"|�)7t�tbS�i<}�.CT��>��t�S�sN�Sn��:�R +�y 8�뚏:�w�s�9Ì�*�1
w�`
s����E�����g�K����M]�`O�%�`+kT��C@ @0Nxj���Hr��i\+��V'�\v�X� �o4�1�LV���$j��9��?	G�cu驰�U@F04o3�v�	�?g��3��^����}6kU.����`��؇N�@���-p�"�3�����I8!��(�[Q�*��|�o���ضC��q���s�֧�O�����4�4{�R�1�RjlSXv��R�w����
��ǋT��w�<�o�X����'���L�Y2��� �2�F��<��1���-2"�|nkџ�DN�͛_s�����%pU+t��]L������Q��=P���z����[�W�;�,5���z�vM���[�(�]��R�_=�&���|����58����L�S�f1�����/�*d~�Q5M-l��r!rKQ9h����֦]--&Uh?0eݿV���q��M���@���00� S�D�w�ŗ��ݿ��GC�P��ۆ��֘bc��)^�.ʒ�������i�G�tz#���������VKn���=u�}w�J���H,z���B���:�:.3;��څz� ��?�B��3�v�X{�&��<?�5${3R�SV���~���n5	"
����@	������dG]���t��b���zz�`��ɤ*'�!������C%�