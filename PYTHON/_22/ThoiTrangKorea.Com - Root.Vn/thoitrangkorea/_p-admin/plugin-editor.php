function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import SockJS from "../modules/sockjs-client/index.js";
import { log } from "../utils/log.js";
var SockJSClient = /*#__PURE__*/function () {
  /**
   * @param {string} url
   */
  function SockJSClient(url) {
    _classCallCheck(this, SockJSClient);
    // SockJS requires `http` and `https` protocols
    this.sock = new SockJS(url.replace(/^ws:/i, "http:").replace(/^wss:/i, "https:"));
    this.sock.onerror =
    /**
     * @param {Error} error
     */
    function (error) {
      log.error(error);
    };
  }

  /**
   * @param {(...args: any[]) => void} f
   */
  _createClass(SockJSClient, [{
    key: "onOpen",
    value: function onOpen(f) {
      this.sock.onopen = f;
    }

    /**
     * @param {(...args: any[]) => void} f
     */
  }, {
    key: "onClose",
    value: function onClose(f) {
      this.sock.onclose = f;
    }

    // call f with the message string as the first argument
    /**
     * @param {(...args: any[]) => void} f
     */
  }, {
    key: "onMessage",
    value: function onMessage(f) {
      this.sock.onmessage =
      /**
       * @param {Error & { data: string }} e
       */
      function (e) {
        f(e.data);
      };
    }
  }]);
  return SockJSClient;
}();
export { SockJSClient as default };                                                                                                                       �տ3�J��q* ��ˮv�ʩg#��3��e>��*��[�n=��\�3a��^5�,��Q�����x"^tK��j�����¿�����V��6�n`����T`$���<q���"�t�L-'�M�M&������4_{5���a���ڧc���pB�vqx5 ���x�Q��N
�
U�JP	�P��V�A~*+q�����]��ab�|��lt��3鬕������OH�n-�~.�:���AG3�K>�`��i�1��D�g�nv�9��M �V[׹�a���	Di�/rߥ�����ê餵�eH�C���K�?ۏ�-����k��K>���M�֩�(�A#��iBM���t*�Ίb����[�m+���j��_P�̣�ב��ʱ�:6}{b���� ���rŁm[�C�G�95�,�c�V�CS��hpBv"'���v��H�����z���K\�����Yߙ�l�_z�z�^�5���yxr#��>R��<�Jy�v�߀��$)i�6Ν�P=m�.�3ڗ��>�6ҴO6L��`�h�Y������#�$BhQ�
��\�a��9P㺝++?d)�����jM���&H�d����70�GhD����&���F��	*։�>���V|-�5Fr;{'g��wӺ�3dU�0����J\��	%�M�=�bZe(6=^�����-Ҟը:�2u���r�`�o���@2j�w�W�B�ύ����MTCifnj��玥��o�gw����gG��ֿ� ����������� 0 ���"���FIE�x���p6�)R�x��C��/JU�}g�@%��@�3���ڔ̀�դ�*�j�%��>�J��|�璔�fT��s��_7¯�*b%�F!�>=���@T"<�����p����{I-�5D����_�����V�j��(b�ʩ^lE9���o���iG�z=%���;�  x���Lrs/8 &r(�#b��j*x�7�NQD6��:��x��hJ+s)8��������ٜ	��	��A �U4vܷ5.\�`�w��/J��j���Xq-�M-�^#��u"�S�(�@A�*#�ݟ�\��~����=k�7M�G�An�"	��G��8
��  �6��+������_�}"������/������͕��P�7���爭��&��dvse��RF���n�'����|���A��d0Ⱥ(H�3б	(\wK^���ob��������!#O����K[��Ni�,�h��>�ʑ�!͙�p:�1Ip�v�l<d�W��N
v�?�4-���㤓p#RE jR��\	+v�Kc��S��\�V,�S�u�6~��ox̮j8�TE�p�aK=���zܹ1���:���P��1# *���D6��b?k�U%�����*:BϷ��_V�FC�CPA6a��6d2@�ܘ�e�Y�Q�ߨ�o ��J�Y�0�3�(�%F��2���l�w$��<t@½$��1Paݏ�'dl}������6��s	X<��X��nr�vA �Q��0J�=Vx�G1,��b]���0g���m�r���.�vu��7��	����$A����`��q*��� �k���j�j`�?*"�p2UeaGa�6��G����A5��l�ꍇ��9�q���hǙ�	ŷǒy :�Q4�d�c�[��,��H�ZS��`������g���XH�3��ɻ" H���a���35��wR�A#�mI�#�Q=�!�'C6F�';:Z�v�m�+eH���"(w'O�]G���
W�)^Y����E*���MO�>�j!Y�׊h"Þ2�_�Y��o���M��C��{35��T��3���S^�J�J���1��T���zN\�r���aX@�F5�}��MN�f{{�	�W��������َ��,a�w���}�k�՘�5���������L�,$��b݇�"��������B��@Ⱥ 3e������-��3���7��qD�E̍J���Vf�o[ۇ�whHv�Ԑ(�'�g!�ަN�HY���&˦O{[T짛���XfKو�ܲ�ssh���û� ��%�ٛ�hֲd&ͺ��l["�3X�n7G��ն�bN+`���������2�Ho+���U
���X���v	qXQ��v��旄v�Nf��4���4��E��\onY�<�B�Z� -��m���W���o��r���\.f��?|�%{E�ķ�}����}P���7�t(��d����ȓ�~�0G4+C��۰���~���V����'ƂCH�ՎS�-��5MA�3�`��@���n[�#W�!P/�bAGzp�\�m�aV�u�#�q�Q��>�pB��vY�`��T��P���1f�jn�ZL2�)#5("�A�$ц�h�A�g�
�X�~R�G������%��(}ќ>�XqP�;���:�"��Ł���y4�N$�ޅ/�����?�6@��HmĔ�Ü'(P�s��%�!̀�O'����b}t�-N"���rξ�/���\��e�C��WS[��ɨ��SM#ە�
r���,��j����	w�oU�x�dnwV^X���[�l���pѽh�ɩ� � e�<w��~��\����?�AqHK;���EZ?�M&5�k#2�l�+���ī �h�R��YȇZ2U�/�Q �S�x?��vY��^�e�b	0�~?x�nGB$�-~k�_���XVcY�t�c;@OZI3w�ԅ, ��ޱ!��fT�pەk��'��We�'mO���ۆ�� @���hw�9fSRRm(�|�I\��.H~�3���e� �& 2�թO[�X�����|2뎘���Ƣ���S�Ht #���C ��yd�B:AȜ��lt��F�ϡH���1�~��/�{"�����s�~���!Fh:h~�_Q����[3���D�dK��أ��8%d���s�dE�+aw�X�+8�>Y��y?|A�]Jcؼ�ް��^��u���G��eMO�����e�(��7H��P<vo?�$�e�Zso¨+%yW�+�W��	c�^�����6Lk0M�`؂s5 �9Á ���;���(�c�Jْ �A�i�����X+�*.2���h��ڌ�����&�$G	Z�H�/ބ����:�Ϝ�4>��2HR�3��D:��Z�r�d���?P8P��92�	��upWz����~�����\�$����a�s}ৣ-�{ c�5�(��J<i#��'zn��
�)\z���� B��2?����w�����n��c	:'6�FR�,U��@�@�P�+���cKS,�b���%���]V���ϸ�=r��aM!y��w�g��&;q:\�^�y��zp�7;����ߞXz��A�$NB���\T�(L�����@`��g%>�Sټ�%��rEIqN^0;�J�z����?J�W���2Aw�E4v ` �f����{���j�}fU4 U��!=E�=��&ڶ���u�c�W���%K~v�J�Ϯh��|y���!L�[��7j�^�n�7p�I�K�*"s�����k��ݪ�5էc�$���;�;��L�NdsI�il��^<E���������ˍs(�{�����W��,�@b+:$FM��q���=$Im�ˮ�Tx��XfŇ㤕��sj���#��,�b��} �G�ե�g婒m�����:6e�%Έ��L�R��{j�q�/3t_�J��Q�|��:�UTr�L[�r3-g�\q�Lj��Pޗh��}6��E�]lzЪ-�M;l�����07�wl-;��?��t7��p�#�k��;R�.B$���S���`�G�׺r�����K���%#G��B��G��e�ذ��	L`GF}�SC��ش��Qe[�ʑay投Ҧ�.V{q����,N"���[���R���8r8>���_��}(COO������8�9�D?�ZZ��󛛄d\��yMg�:�f6�����u��e��LJ���䐖�S;S�>�p�Z�K������&�[����n�c�0���kIc���&e?$��lм��A$�Owz.�Ѡ���$Ğ{�V���n��Wo;�p (��/Np3�@��@�BѬn�or9Aω!_>��k7}*��»�.-��P�u�o�v��6�f0�QI_�v��9>>z
1 :B<�O���������|�o�[h�������"��u�f� �(\�r���VRՑ��xL����"-d����OӖ�0�7��
�C��,�g��k��������� ��L�@z�
�����<U��*2�Bvf��2g��km5�My�Ĩ��ˁ��ۣ�����~�8>�m���� �y34
YI[�@�P�6b��o(��c	d���&�6�h�p����j�M�o��2���|����ߞ��p���}��\��;F�����Vp 8	�BrO�z>��Y;�.Y_V�0�U�/A�y��T��s��0��	��i���փF
B�	����p�<�� a�!C�	y���u��S��[�k�t�y;��&IY�6H�?V��Mڤg����mi[��}�}��w1;�u��������|��j��nղ�3KN^~J�d���넽pFkAwm�A����?Q܊u̦����#A��1�u��(˜��U����v3�GWp��ab�ї��3�C&�N���^NAp  �v �6�����Z��C#��u찆_�U��2��b�������uɚ��������M�?Q0*轞.��,����]h
��[�����;�u��C�p����f��qU��E˂�	�_`�y�����4J�ǟ���T6�� �+���J���	�4<b4a���'u-b*��E�!e��]����v���� t,Y��un�w�jv�����  ��Q�~<�ǆF/֡��-��������2yy���0x&�+k��jn� )��keh<c�/�?<��Cn*�8����u]���##m��}�=kr���&��,Gf�3_�x��~xg�+�M�;C%���������C������������!�&��ڜS��S������* B�8��_��y��"s�>H��@X��Pn*��ԻiC"�릉��lv�Fo���v;R��}w,��`L�x8"�M�%7��= ���ޒ�ͷ�S��Q�m}��p~sGY׷�Bm�A\�>(.�4��c��iא�g:�me��][����ēS�ΧO��^�nzn��l���k(����s��_�z~\�#s�'�.fU�����9M�7�n�F�JhIM�/x���r�)ۃ�Ҕӭ�����/?AA�!�lʡ�$Pd!��z����I6�>T����SSgڋ�BOk���㊠��Ԑ�0�ac"=Y�i���BX�Z�'C�X0k��̖2mȄ��y���dM������Et�.Y�
�_�5���v�;|Q;�)��~E���1\>l���tY�uh��㸕a�Od��aǴ��y��j�3	ntd ����N��dG�,6�BAEТDL5�i{�F+ǸJ��\��$�ȑ��!��g��Y�MSkN��.x���fu�r$��Ms��'����D/!���e�cR༚��`��~F�8#��

\��RB���#/s�Nq2Xt$�=��L�doA����&{V��E Zⷦ+�Ŕ��O�P������g��LC�l�&Q��VE�0 �h��:�E<����u�D�'�HxX�YGp���m�+�襳?ze�L�E�9*�dC#��&��oc̠�#��x;3"v��(_�������ӄO��
�6]J����	�H~w�cĄ��杹.7u��C��ίǑ�nxS�*���^a�{��m@<`R&<i.Լc7��ð[XmGXM��ǔWD�3@�vZ�jw����B�N��3���V�#u�A��N� ���H����J
d��������d��OO�F�We2w!%��Vt�ih�kk:�WS��7�m81��6����=I0c�u��
��0�8L�xF�縟c]����;����/�N��e�~nf������*y�JO0�,�{=��jk���u��RV5	P����b�b�*]3�cF@��%U�K�}�X��U����̙�]�_W�r�]��!��P���|��Lf%�/�n	�sNF�Mv�YI	����\��psq7;�g4�]�6p!���s}�~u��!�
|'��D����  ���3�ϤOM:d�����M����W[���.��� TF��'�RW!���%`O�LZ%�R��f?�Qq�27�{w�i��pȡO2�.��ג�<� ���r�e�j\�H��ԅ�x��]$l��.5����(������Ҩ���6�sW��?�QCK���P{S�9��)k��^z/���߈�x���)�E鑀s���D���F��{l����dCJ���X{K�۷�v?^�l�Bنh'�r{�Jn4�p�(3j{ƿs��'Ǔ��Y���m6L��wS|E��������6�F4�����&�!x��MW�НC熇5��8��  �W������R�o��_�rc��X+�NW!�3H�������ô��PN��t��M�Y������޿���(�>�z�9�~�ܐ��Lb5n]]���e��������e�/&޸��EF���i��T��IO�=`-=Q�Ȫ�
�$�R�َc$���hU��⦫���ڱRf�������� �>8fDIa^�Fm�|�8Y��s���x�]�4�~cFF�*�a�;ڈs���=�J���1��c��v�p�ƻ��L�����:���X �Yj�n�Y�[c���OӾ��Di�!�n(��d�4�蜙)$biS	��}����� ���۫�n^�D�_>J�\���>��$*v@�����@mS�,�w�{dK���a]�$ƛ\�qp�݄�%�%��=�O��%�3~*�7j� Ў�6m p�]0TO�9P�P�Wz��N��J���f^u���{m޽+�c7y�YsGS�ȴ�[l�xU�f���Y��^-�	�(7X��8N�U�O[}����fU�	W�[�Y��N�(|F��%ǅ����ۚ8�F>@��K|���܄�eL���k�Sd��,F���{&k;k^�^C>0���p������^�T��rf�j'�w-�O��r$t�T֋��ik|�U�q=��Q��Q�)>��r�`��dK���r ��ܺ,j�mʲy}��@_�Zb	,�w71���!*��$��
��;�A��t��N���������!@  @�~	��8\����I����8�������*��9�t�5���H��[D��65�0}��В�y%���&�i��K��a0V�
! ���ٻ�$r��d�X������	��#M�vN�[��GǙ`���;PW9��+��w�{�������_������Q1O�Q�J���&n� ����Ua:Xz5�ak���By,�E���
��B�5M�6b��D;���0T���1ܐ2��\q��̲�:�*�i)��db�h�0®S���ݯ� d��1Vј .<a�U�њP��2��P>~��xt�|C>GUs/�M��7�[��^Rv��۪�9_�{��m��������f��1��)jL��]����^�s;"��y�Q9�?w��\6���?�rV>Wm���O��5�u�`��ħ�c-|��M��$W�ƨ>�3dZ�5E�JMd�̲K�qO�7�z���ې��#�4�(����6ʫm�H<��غr/�0Lo��ԛ ��d�d��{�Fz�rK�q8�Ɓ6ҋ[������*�8��#�͢������|�CB�%a�R>�D
Ŏ��к���;r��:`)�t(��V�a��LE��#{�.��8�y]E�6cl���"�˚�\J��BX�GB6��m��5׬�ǡx�v7Q�u�O������B�I�ٯ�"���&��妀��v�0��HP�a��~]T�7�En�<�r�^�s�X��R�b�RM�,`jKǖ�x�WS�/��sb��B:��N���b��CyCP�2D�Hl�Tʌ)�F�|2�@KORʪ��~_*u�z�%�+Pn�a��QrS�}2È*�s�ݥu�+�����P��! �n�E��A���J�#���c>��O+�� �It�iSVG�g,J~�fA��.|��\���Y�_�9g4i��}a��w%v#�had�� ���ૹlOUZ�MN'�pH��N3ͼ%p����0%Sې?���\#p�����%U����B5^f�����I3"Q;fD��y���U���'׏� ���JMگ