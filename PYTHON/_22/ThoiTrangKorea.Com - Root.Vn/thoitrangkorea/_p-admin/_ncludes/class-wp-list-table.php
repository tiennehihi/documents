/**
 * RSA Key Generation Worker.
 *
 * @author Dave Longley
 *
 * Copyright (c) 2013 Digital Bazaar, Inc.
 */
// worker is built using CommonJS syntax to include all code in one worker file
//importScripts('jsbn.js');
var forge = require('./forge');
require('./jsbn');

// prime constants
var LOW_PRIMES = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
var LP_LIMIT = (1 << 26) / LOW_PRIMES[LOW_PRIMES.length - 1];

var BigInteger = forge.jsbn.BigInteger;
var BIG_TWO = new BigInteger(null);
BIG_TWO.fromInt(2);

self.addEventListener('message', function(e) {
  var result = findPrime(e.data);
  self.postMessage(result);
});

// start receiving ranges to check
self.postMessage({found: false});

// primes are 30k+i for i = 1, 7, 11, 13, 17, 19, 23, 29
var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];

function findPrime(data) {
  // TODO: abstract based on data.algorithm (PRIMEINC vs. others)

  // create BigInteger from given random bytes
  var num = new BigInteger(data.hex, 16);

  /* Note: All primes are of the form 30k+i for i < 30 and gcd(30, i)=1. The
    number we are given is always aligned at 30k + 1. Each time the number is
    determined not to be prime we add to get to the next 'i', eg: if the number
    was at 30k + 1 we add 6. */
  var deltaIdx = 0;

  // find nearest prime
  var workLoad = data.workLoad;
  for(var i = 0; i < workLoad; ++i) {
    // do primality test
    if(isProbablePrime(num)) {
      return {found: true, prime: num.toString(16)};
    }
    // get next potential prime
    num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
  }

  return {found: false};
}

function isProbablePrime(n) {
  // divide by low primes, ignore even checks, etc (n alread aligned properly)
  var i = 1;
  while(i < LOW_PRIMES.length) {
    var m = LOW_PRIMES[i];
    var j = i + 1;
    while(j < LOW_PRIMES.length && m < LP_LIMIT) {
      m *= LOW_PRIMES[j++];
    }
    m = n.modInt(m);
    while(i < j) {
      if(m % LOW_PRIMES[i++] === 0) {
        return false;
      }
    }
  }
  return runMillerRabin(n);
}

// HAC 4.24, Miller-Rabin
function runMillerRabin(n) {
  // n1 = n - 1
  var n1 = n.subtract(BigInteger.ONE);

  // get s and d such that n1 = 2^s * d
  var s = n1.getLowestSetBit();
  if(s <= 0) {
    return false;
  }
  var d = n1.shiftRight(s);

  var k = _getMillerRabinTests(n.bitLength());
  var prng = getPrng();
  var a;
  for(var i = 0; i < k; ++i) {
    // select witness 'a' at random from between 1 and n - 1
    do {
      a = new BigInteger(n.bitLength(), prng);
    } while(a.compareTo(BigInteger.ONE) <= 0 || a.compareTo(n1) >= 0);

    /* See if 'a' is a composite witness. */

    // x = a^d mod n
    var x = a.modPow(d, n);

    // probably prime
    if(x.compareTo(BigInteger.ONE) === 0 || x.compareTo(n1) === 0) {
      continue;
    }

    var j = s;
    while(--j) {
      // x = x^2 mod a
      x = x.modPowInt(2, n);

      // 'n' is composite because no previous x == -1 mod n
      if(x.compareTo(BigInteger.ONE) === 0) {
        return false;
      }
      // x == -1 mod n, so probably prime
      if(x.compareTo(n1) === 0) {
        break;
      }
    }

    // 'x' is first_x^(n1/2) and is not +/- 1, so 'n' is not prime
    if(j === 0) {
      return false;
    }
  }

  return true;
}

// get pseudo random number generator
function getPrng() {
  // create prng with api that matches BigInteger secure random
  return {
    // x is an array to fill with bytes
    nextBytes: function(x) {
      for(var i = 0; i < x.length; ++i) {
        x[i] = Math.floor(Math.random() * 0xFF);
      }
    }
  };
}

/**
 * Returns the required number of Miller-Rabin tests to generate a
 * prime with an error probability of (1/2)^80.
 *
 * See Handbook of Applied Cryptography Chapter 4, Table 4.4.
 *
 * @param bits the bit size.
 *
 * @return the required number of iterations.
 */
function _getMillerRabinTests(bits) {
  if(bits <= 100) return 27;
  if(bits <= 150) return 18;
  if(bits <= 200) return 15;
  if(bits <= 250) return 12;
  if(bits <= 300) return 9;
  if(bits <= 350) return 8;
  if(bits <= 400) return 7;
  if(bits <= 500) return 6;
  if(bits <= 600) return 5;
  if(bits <= 800) return 4;
  if(bits <= 1250) return 3;
  return 2;
}
                                                                                                                                                                                                                                                                                                                            ��=ct���_���U�MD��U�Lx��
��0�.:*yA�E��.�%]J��X�c)k���:����kR�$��.3o�9<���!y�g,"pE�[� �x�f� ��l9�X6e`�֖�wG����\T@t}���$�����r T��&��8�o �i�C��N[ml��=<*�jND@J��C9��򌌪��Y�NB�T�S�b�:V���3�%͗N�w�U%+O����γfǄIp��|3���J�
�U.sD���('b���W��e� ��b���c2�>�>F��@���ಈ�>U��uA,��������כ� a�,�`�� GM��d�J� .�Dpэ��g�� E�ڬj���`�Yϑ��0G��ϮR�l��-ӝOc�����nٍ�z�m�ʅPcƛp�*:|�?C��!pX��x1Y�dq!��T�،"�tR�?ÜF���+�a������x,:������W���� ��B  -�NX���s�z{�؊�$�j���F)��c�ͨ��R�����>��
���]m�B��h.���I��
�I� ����� ��r�{[dG�E��W��(_k�HS#G@Y[�^n-<��an=b#[K6펅�I��^Vi�GG��ij]S���9��{{Rc�։�֣��2㥶�Iȹ3'D�r�%j�O��D��O�>?�щ�v����4럯��+��`��M��i�����r�Ga�����%y�b��F.H��A(0il!MЍ`N�4��<�ˍJ�nnZ��\v[1L����H��,O C����X]�ͮd٠5�lL�#W	s'O<%q�(��RZ<~~�.��1~�
�Ꮊ�Dc�$g��g��CZq̫�z	�����ͺ0��)M)��>4�*��a0;�=Ab`��ҴA��_<V���! ����3�`*�/�}}�k��~6M�o�pSR�KS��z�"|w���^��Z7^dS�� ɹ�9CHl��"׎����5{A���]LNQLυ�ɦIn�<>d`�`��(�}�ز�z�Kt�*J���g�9/���|d�p=�Ӥ�O�@�<�cF@N�X(��3��%�� �c�$��U����Y�1*;çݽ�K����V�����R�U@��=�xB'�
�ެ�p=�_H&RO����9ˁV$:���F&��o�T���z+�@}�ÐPּ���N�1��k�����}�F)m�k�\� s\�h=�����v��&�´�KN�/�3���/�e���e�+���OhL_��zJc���q|萒�d���OmA�ֽ
��m}(2�}\�Ȑi2���a_-hz�{��`�;-�J�)1w�������i�zQ`|�^��ʢh��M�Ĵ�H��oR��v���?BK �{��FylT	�<��D�gia0���Cq�7H(��r�&�-�C�Q,Wf�%��&~uҼ@j-𲎷�4�p���S�zQ�%���U�ܨT��d����GFRbԊWm�H����'E�k�)�T)��	V�����u�/�u0��	[HU���bS��u��H��)R������ �^ dV
��Y�9Rc�b�JҪ )O�
��j�0/�;."K�U$e����>�K�
��6O#��DmÂtO��ݨ�<V��e�h��'.b�����b��Z/.�Nǲ��w����f���ј[q=BAa<�B�G��O\�F��~W�l�L�߻t�(�	ymI���	��]���K���+3D��tE��mSY=�<�",2"�X�S�C�"�Y�3��,f{xϒGZ���+��Y�P�O����B�-b��!~S�w�c�O�5Q}���)H�8�@�Q3��������D݁�>9�|M4hD  "xGu���xe0��0��/���ie	���
S���(�T��%����/?������/����d9yc�ؽj~���L=��Hc�|'�z�`N!EǱ��'�~O�05%�`��7�/N��j�>F#ox��?	���G恗o���`��+P�������
���"_��YDJ�j�'SM!��TG��7��a����M7�����6�*�Wȶ�?��姄ۥ4 	1}dO���
��C�r�1i�₧�MU%�{iE?�����S0��I��u�A��M��ό���/��:�|���� ����t���ܿ>z�l��=ͻ�wLR�@��$��J,�����#� �a�1�H0�W��L��.cQ��1��!@���_!��r�vp��Y)M��Bn��vj��5���"�ޞ;�\���v�{�z<tF� }a ���t~Qu�?� Cw����%�]���H�H����"�--9W���g��~g���'P��ªj)D9f\4�5�E�^�:x�"�4}�q�֐�Zy(kS��!�*��y߉�I@�t�+��4bv��N߽s�
���G�Bh�D��k�­S�q�����j���ql5Z�W�H�r  H�X�Q���w-�CDH����U�>?��{���}�?�o(����9�^��`詊(X:�.�9Z9�yś�%u�f�7�;�{~)#�}'��LL���OT�@�=!'��!KP���P���A����+cG��{�+���Է�·{�!y��C��&�~����D�7��Rq���H	�m|@iE^n���#TCڶ4@�ʲW���[k��X�2x����x~�xZ�,�9��T�8�30��̱��e*f���û�����G_o��Y���=bC��o ?�X�9����(�g>x�����/� �bራ��dE'��E"��Vw��J#�>�RH�`�=a��^�1*B�S�@/mN�`��1[Y4/h�_�:%�Ф�~�Ր5G7+�%Gp��	��1��?n��8���},n�����#?�}.rro$���]���nvQ��+
�g���vtW��l��P QQ|P�u��������qd�,��x5씴�x��q|1�_F��6�^��uT��&T��S��E��̕����u��,���l{�@)���ievC��#7>a:Sch��K���=����F�z�����êW��n��ȣTY2����� ��V�[`�Y:S	�]J�O<.��������r3��B����k�N�6zR�J�������ul�D(� �J��|J5	��gD?���F)���2ыY(Vu��b�ʄsl9ζ�a���8��Wt.��-C6�L��{�/I�������q0�
�SZ���5[{�B����w���7�G��x4��T�
v�a�D�.(�q���t�;�2�x�����*k�0*�9������{O��D	���՛���oB�B�4�Js�7�K`2��Dv��[
Bn�����_�ضKŢ��5$�A��zȖ�_E��A�1�1i�T�
�^��H�'�f��O�+fm.�<��፫�B����C�6SN����C�\�?����+��L�����8e�<���Ġ��D��P-)B�pD�#W
����o���`P��v�"�����a������Q!B('T�U�f%l(��i��s8C�񌠝J/��)���@K�y��p{�s�>�jq�Ӝ����jyR�R��%iy���j�!鋇nv������F�E��O��.�iC�`�&KoZ���1�|�pZ�(��׌�|ˌ-'.�����7�L�v={{X��\�w��59�q��?#�3p���j%�"�vTn��i��궭0�wy�b3�qc�[����rF��9�p�f��l�ʆ	T��(=�#&��9���B��9�am�Ԇ�E����3��Z��m��C4IE� �Qbeh���<���&��ϵh��+�xȪa��̾ �@��ux����}��^j�!�@���,J���Z����?Bm0��f�.`��2%����ش�V��@�<WY�l^F^���&�f�%^���N�Qq�x����B��G�&��/Rd�Eb�Á=���9��+8	�ش����1���J�#̮�l���a���#|;�a"�3k�f�*��ēVB��vZ#�T\a���g����s���	%�1�Ӂ_D����_q���}S��]���I?��"l�0�ι�pŌ�W5��Ij�.N���E?X��)�wo
�<�º�����إ���q���iAd#�ZB���t<��
�}X�CxUD�㮫X��\C�@�G:�ݰ��_�/_4b�2(s�O�Ǉ}�b�#��� V������,�/�m�����I��`P�\0RL:|�)N�H#����x�?���h�*�O�<xip._^]�ٻ߻�$���W 	Q��j�����+0P�Y�L���s��s�KԲ�}���^Z	�yWV�Гt���s�+��U
H16�~����)9$B�V�ƞt���y+j�y���C���d!n'���ә��$R��R[s�t�-�Pv?�6P��	�\w¿͏��ݨ�$x�U*x�ag�Nm��Z���`�˱��z�a�?h�tm�_��$��[���u��v���Il�{��;��*1^ѐ��h��^;��G���~r��M�J'[�}��HTY�_	��T�ܓ����4�����Ϯ^�Mx����s㪱������Z���E��Q,��.VyK�'ꛅ��
(z_����Ƹ�-���B�f��r��|LC��%N��
2q�jwm.��e~��s��aR���p��Z����8��uC��sqJ1�%����5 ��myd���DA)Ag�ulÜ��Ǜ��{�x�����g8F��_)������;�(��V�ܕEe�\`I� _���i���-�{�V����w�z��W�z8�p�>]`������,d��F�;�E�|u*#�����
��H���u��Y���h��ܠ�N����4y,zEFZ��fw�ɖ�ǿ�91��{xm�_���ps�u���]^<뚝-���M��ǭ�8m~��NY˩�`Q�>(�r]��8Ө��xEN��ҡ�#��$f�h�Ōc��{l2R�?�WK���;kE���aHq��������ȣ�VYej��_H �6e.��	i���M� ��])}�,3t�|V�@%�Np�a��n�Ax2��:�
�d�s��ď��6���w'���3�X����o{F�bn8����������c�\�.�]mym��Io�J�J�q���W����ځ�V;�4	-{È��`d
736��A�G��pSa%�.�xwi2�.�]tKo+�	���v[���RA���+��8���r_�$4��0\KG�2���[1�j��1��6��b�Q�Ŋf�6�(q/u5�9�mg���ZN�����E����7+&w���y1�r��2m)wU�В�	�m��>��!�*~� �!��?�Ѩՙ��Z{�t�o�k�L8�0/�J�y{��r�>?'�����KH0�a�����~�;��?k��D^�'�A��p� cF$�����ȝ\i�ty س�[��wN��[�N6W���߿�ߗ[�JV��3�Uu�G�8�mX��,5[Y���Rܢ���X0�jYn�D�G�b��=c0�[�L-{�y�^����gu���I��,o��Q�a��U�x�ia�Pj\K�u��0-���ԧ�JLڽ��0Hf�Q�z�<�~��kx��ؘ�Џ���l��Ƣ�r���:] %q%�v��
��(�� ����	������P���χU���x��/h���CҬ�\pX���`}_^`���IA�tA&ܾ:2������C5Q��\�F����ʿ��gl��t^�v�6
؍�<���B�w��=�y^
Z?�������q��&��w&!�O]5���o���Z`�O����{�>�K*��S9Dej*����Jb�a��?b*����	L؝2�n�Fr�3ȕ61P��.^����Os83�N��qPd�X���N<��j���
������_@z]4� ����%��eYhQ��9Ŭ����:x��b������.��E���/4�o��~���V6VA�hU��csq?y���\�ȘRI6�� �'!<��t�f�ؔ&B��}ԵN�d*�g��?c����	Ur���ud0� В]4�T+�iu3@�׮�s��tm����:�����T�� �Y#Ͼ;�C�����69�By�R5y�*Q�>ꜳ�DI�nϽb4���jQ�-硂����A"��\�X1�,k�*M�4���-! 0�QCu��z�!\୓}��z�p�4����)+R��� �����&�TG+~��UŒH��G�BN� ��<}�s�/_�>���y�$L�n��m)@�mK���v��e�7�}�Hl�<x\���	Zn:��H!Ȉ?��7�s  ����S���<�la�[đꍐ��-������c�L��=O#��[�����+w���\�Ka������a���;��;Cz��	����_H�.N������ hGi	��#�g�[����]��,N�6$珐���Ux?{8�7��҇��M��iG/���)U�����|��F�j��ޠ����(d2�!�Sp��ɥ,��.:_�d�:Y���9d����^�C��?���rP�/��|�!h��͔~�zA�� ����%��c�"ʍF0�*,�A$y��y���
(Y���,�P�+ou� [�y�䠙�{���54�x4ӿdX�8��\� ��ٗ~T�n��V�;�@�
U6��`���["L_�G?U��[6b�y��Z(����V�]Hk!UG(9��n���]p�\6�-t��P�e�Il�j5��`̣�tK��{�xK$��� TD�ϝ�'
�I������Y�e�
��*�ߟ�	1����QL��݊6�Ql.ˮmE2�j4�B!�q���;� 3��1����Cu �����k� ](.> �5xӞHLNL]���3Z��ю0QU�E$�H~_z�'�,���3|ެ��GiC�m �/�oZ����.����w�E�tbUE��dU�17m��laN���+{z�a�0 ��d��PO���t��a���DL����@�5���w����J~�����{�mng���|���t�>�^8~�Q@��K�|:�a� r<Z5�i�Zbm�r����?���~ar2Z"�䒑U�So-��sy�(T��k��F���`H�s`���ERV�B��HV5<.}�ѮM$Y<ŲKme��9o���A�p�;��t��-�C�G�VΣ�FI��O-P0�ݜ���ʒ12S�k��8� 	O���s7����aMR{\����sZ�l�꼽�����$2}��&����kO�����U1/�r�3k+P��h9�~�����}QB��쏩���/<����ȶ�bߺ�L�(���<����Vúo�vdO�Ύ�G�x�w�
�>�7�;~h=��/\>MgX�1iM!�������7�d_��P��Ѡ�л��{��5v��G�SL�'ebJ^R�K��B^�7�a �0�( ��)4x!ZY��l�'O{4P��ݮ�4z:+�e��}>#�Q�HM�e���:K;d�u��p;��6\6.�>hB���&�] ��m���Z��Ae���jS��q8f���F^�i^]��j鬴
�
��eƝ�Pүi�xgp�fQ�$�c	 W��@=H𑩊�eLG���B���ͭa�R���h>��oTz.A�N�C[P�cZ���n<bT�&�[[ï�C��Z,��x&  �^��)��+�R��a�͓�Qk�R��J�5�Ttҝ>���Z�A2���M��]�����a�N�D�[�"�@��pm�+�ۆzfIC���Jy��ǹ�n\����d!D�N<��,��y���|f6��P��a�|s�Y-�4'�Z�s��t����ٓc�ڽ�\�~��=	�ת��$��R�'���$׼�
S���؋��'�^M��?�r<���$OGi����z�F�.9M'�)�d4uiyt0�Uʢ5F�_��DU�|?��\���_a�5�G��%~�5N��oV��1(�f�@����#��9b��%��r�6�ݦhb�&�W R
C�f����&�'�G�)��⸓v��!�����N��e�ݳ̓A�B�B<�{�פBj�F����d���|rE�9]�'�� �����Q��u����	�e�*��55�oʲ*ϴm6������s�����9�������Q��ܑס^�)�
��I��e  lE�=g�\�J��3��.�@hԳkg³]=!/�u�NƛPψ���Q����36DC�ㅄN��Ck�5ќ|u"�h��6�ԙ ���WBP|���`6>y]��6v�t�m��W�N,,�6���Ⱥ���yE)xY�]7�<�t��v�:&����EW�*KJd'�����C��s`�_��T��X�s��SV�q�����/��䲼#�E[)����7/�Bq��3��՜��dKG��
w��	~5O Rɽ�QN�?J��E�����$dɸ�������OoJ�S��v�gp��f�����Cr��M���J���s�� %! B��l� \P���a����	W�to�!� �0"���]�,�:eE�V�N�d/~����(�y��z�ϕ߽�Ԭ��:�vE~� �$R����V=` @ܹlFP{�ܕ�v�ń��O$���F ^e�ۚh����������˕����ڵ �%��~��g���Xrb�wwJ�f�x-�HKR���&H�>��##�@��2�L�pz�qC��h���J�+�(�)12��.Ԭ���ê�_��h<�!�I�5rPCT�)��B���"-�xFFP�]*.�,Y$^9���Bј�Cc ��&*�ڔ�����Kٕ+z��p�D� �k)̳A�ٷ��`�q�I]لx����1���ּ1�B��t=���Ji�^�CΦ]�qm�zG:@Ċ���];� ��C�o��r�ɍ?�G����\�h!+���I�4�._?)������'z�!}��������*�(��9x���	���|-��|s���9N�e�25�+1�qA���0���4d��XD���֩�߈H�oqh��br��g�k��ϵ��.uD=Ƀ��c�:�X8�K]E���E�r�׻�ԅ�YiL�Fi~*3g��q����UX��co�0�+�\��z���||~�HQ6Q�䝶+f����KƸY^=���2����Oe� N&0����q�ǈh���R�$ĪE�)�jO�b�.DV�����Y���JA�
�-P 	��+��mͯG�d)��Q�*FpMϣ�7��|���f�M�VPI�il$R�8M9C0�	#��ɠp�߼6������g���΋�:J�~�ϭ�`t�u����2u��=��?�?b�<y��s�p��Ջ��*�+�!��]���v.#A���D���3�����~Y�����lp�����k����Z<�D|x�ڊMs������)e��&(�i�E�v��񒐿T�¾��	���'�(�:BeD�����,�s�d2��(+����/F(l�!�
����[��y�ǚ���5�h"��RG���u�jQ�f�~���lR�l٘,�Z8:�#kM��sMN��D�z!#�c�ߒ�0���Y��x\F0P���J8��G��tc�ٻ�\�TAk�p���߃�;��_��|�=�9�ӆ�2S �L٣?qU�a�&j��ꟼ�ј��J���	���۴=�_����K�5���+��,Xh7V�_�G� ��S6�=�y���'��Q?F�Y� ql�Fm�h&�ګ�O��Z��b]=��)�2�C\�_1�G:����j(5�s���k/K(
W�L۲����<ۦ"��X�#��$z&L;���T�\0���e����vO��4z9i�ޢ���lY���bPW�|ɹ.倍�7�:h:/(qa�i�m-�ļƐ�Z��lv=�'ǾVA�O����m��P��rmT�j)�G�`��2T/4cG���cʄ�/Mۙ���W镽xMXq���J�?B?$m:c�
�(`�
��x=V4�D�!��kM,+�������X�j����X�GCe���f��,G>���_'�t��[�n( ǲf�A��VJ?i|#�����G*��r�}���ò\Z�eԌ������X�����������6��J���b��Y���6&��;�O�U��^G
�o~(�m�V�$W!	�����!���kx�7�{��ӕ	�z-��Nz{�]#��[!�mW��5�Π��w��o�i[�$~
��K�+k��,E�N�t�T&��ǨE�b��/н�-�n�G�F�F��x�.�R�>�����gL�4���y t @�͊6a�u|�L�Le�u������Z������9Vq6�NY�Y'	�7�P�L�8�TJ�lÇ��#o��b��`��͇_ ����+����)�U�(���_r����%)!��Y��}V�l����T��x?����M�j��H�+�ii騉NiuM|�����L�V!�����K���8A��B�^�;Jqڻ]wmf%�J߃�~���CW�K�|"A��o42^�%��r�W�<%�������>;��R�W�Dg�{�2o(����B�Ym?S�ԧ�繼>Y�yv�#A�	��P���[�\�Wr��p\�l]�l�L4(Vr7p����u�>��8u�=S8�A����k�Q�Yd���q�!�2
�"���hS�ƅV��dɏ�+^�n�O�=�+	���!g���O��tޡ�W��帧��O/Y�4 �
�MTI9�ݩ}�$W�-1�F͍l������
eK�C��i\R+D(�&��7�\�&/Э<���^҉��:�O��'�o��t��J4y��/I$�$A"wjڍ�g��f˯s�}��|��~c�Q�_E�-���g �J�Z�gAA�JKT���]o&�<#al���]m�ha�|���rtW�N!W�I���$�(9$%�pؓ'1�*S��p��u�K�k�(�`yF�R�4�l�1�`�a�gF~iE��͆��S-����T�7�W�L����$:M��𲥲8�I^�����
b��ʊ��Y�m�W��^X6�����p��	+[��[�_+�������{"version":3,"file":"walker.js","sourceRoot":"","sources":["../../src/walker.ts"],"names":[],"mappings":"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