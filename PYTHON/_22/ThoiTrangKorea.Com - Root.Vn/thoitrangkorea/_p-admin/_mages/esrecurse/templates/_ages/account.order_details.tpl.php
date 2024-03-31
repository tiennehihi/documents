"use strict";
function noop() { }
function once(emitter, name) {
    const o = once.spread(emitter, name);
    const r = o.then((args) => args[0]);
    r.cancel = o.cancel;
    return r;
}
(function (once) {
    function spread(emitter, name) {
        let c = null;
        const p = new Promise((resolve, reject) => {
            function cancel() {
                emitter.removeListener(name, onEvent);
                emitter.removeListener('error', onError);
                p.cancel = noop;
            }
            function onEvent(...args) {
                cancel();
                resolve(args);
            }
            function onError(err) {
                cancel();
                reject(err);
            }
            c = cancel;
            emitter.on(name, onEvent);
            emitter.on('error', onError);
        });
        if (!c) {
            throw new TypeError('Could not get `cancel()` function');
        }
        p.cancel = c;
        return p;
    }
    once.spread = spread;
})(once || (once = {}));
module.exports = once;
//# sourceMappingURL=index.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                        F��y`��p"�o��h�uGd���ƔLv���PK    �JVXdW0M�  �  /   pj-python/client/node_modules/async/anyLimit.js�UMO�0��W�z�]BU��+Zh�JH��7��7�Cb����Z��;c'ـ��%�d�{���o-�uFfnE�;�\�c!�1�A�63|l�q6�77h뼭�C��U�p�Ũ��Z��
��h8�[ip��IE&%���Krg�_�~"�����"���B���=��(���%k��Нx<����S���P� �������3������à�U��Z��Wwsؒ�k�:��?�]�૷/�-��7tK���� ��,�B�AX�J��1�ޞTR�C�Y�uU���&���U���ʂ�Z<ʺ�A�V\���6*�K@8rt��$�y�X��|]��:���k��
�y�J �wW�<�������ǈJR�Bmv�]�[m6�Cx{#��a{j��<�QĪ§S�Oa�:�
�p
��N�d?���h�)�j9�|���7b�f��E}�����ge�A9�s�ĺ��%�����o���NR�%N2�lb2T�p_Fz[��ɿn*�$$IXi]�P��t�Ұ4<�L��=��sƺ1dľ���YJ�l���P����ح�'u�j� t���@ØXHyo�1h��]EH���9̝�R��(��%�>���N�RhzN�LQYzͱA�Ku:��o��|��`>n�M^���!�/���6t--��&�� PzW��e�<G�2�ڌ[�;�IOZ�o�~��>�/�s�o���[h�����c>��ʜ�{�y!�W��Q�=�v�g�nL)����x½`Z�PK    �JVX��E*�  �  0   pj-python/client/node_modules/async/anySeries.js�U]O�0}ϯ�⁶(K���l�$&&���In���3�)�J����$M0^_�s��4�� �yf'�(�L0�I���[��m���Vښ�V+4�T�<�a�m�hpV7�fıaV�Ff��E���O�5N'ɜK2I&�c���L^�~"��CT}H~`�a�~YV^ר9�C��́���=��� fO�[^�o$�_����z*�Y��[�*}����m�%�	���O�o|��������vQ4?9��nJ�V!0�k�*\�m���Py��w%�XL��w�6t#()Z``�������a>rf���
��֙tB�#�ی%��VX��/�W��{[�<��������0�)I&ۑzF�t�t{���L�
��Z�����R���Np8���AFP� �`p�g�ur@�X~v���~�(dWD�,[��1wL��E�>�4:���qR)q$j�ɄY�[;��R5"'�HQ=q`�*%�IXk44 ��~!7���9u�1dL��e��������w� �	�J�"7�B���܈�~8�!�0���uYǠ4�½(��	���(ن�\rSb�C���P�J�r@�q:�u����k�9�/�PN�?Mv�O��ϵ�$/j�Z�
��~K�h��
�:|���j_�ox�n���u�o��u6��{��ݟ~�_��I����^%�~q?��Gmp��M�e�����7����i�3��3a�N&_P-�PK    KVX1�>P�   �   ,   pj-python/client/node_modules/async/apply.js]�A
�0E�9ŐU!0T� �7(1�H%&e2Ezwc�B��?��,!3͎��t��c=��#�)-H���$�@�#�c�J@��-��Æ�;`*(־v���Ė�0�/��"t>*�Z[���r�������cג
~�k�ܷ'tsUǟ�| PK    &KVX ��_  �  0   pj-python/client/node_modules/async/applyEach.js�U�n�8��+=Բ���=:H�`w����-bZEL(RKRI������[`s�9�y|o�Q\�y++��Ȳ��|Yc#5�cM���s���]/����m�A��ߓPn����0���;��j���Z����b�(�R{�Z���_>�ŏU�S�]H6��X�'6bP>?%Me��Ϗ��.��Hۜ�������3��%�?X���/�_y�
���ձj�8f�z��`W$@��"��<�k�~�P{
@n�DG�*��*�������;Q=nA4�h9�9h�Be�^�Ǻ���� F��xn n�u��Fl���j���R�nq"��J�I�. �¹Dv��@P�	8hI8����2��X��� 4����nx�<nK�.l8�|M����?�H�����16v�4��a4����*4a�3��"<I����hJZs����r^xY��v;�X,;f���u��s������Jx�7v)��^X�������F/v
�^��i��h��
��	Ja�����E�J���ch�7�G���۠܉n6�9��,WG�����9B�A,�Oq�Y���MM-�HǗs؉܌�f��FDp�T�h�1�`0^����`�U�ؗ�D����y��Ǵ3���x�+��r`���L�'3���2?ѝܱ�������Pɲ��H�V�XQ܏���p�]N��oP�E>��U[���4�OU���-`��G�e���-ƫ���7�����z�߼�=��������췟��Ʌ2~d"1*&�x)T�X�0�ԍ�D�ܽ|<2�sŸ��>�� ���+��	q��d�YzB��*�L�����w��9:-/���(U~�u�PK
     1KVX            -   pj-python/client/node_modules/async/internal/PK    AKVX�(�c    9   pj-python/client/node_modules/async/internal/applyEach.js}R]O�0}ﯸ��(	�f�#�,�G���ҕ�[쇓��-P�f�!�=��s{�8��X-�Mr���#g��x%$Ѫ�ڶ�5J[���(�yR;W�E������k��qԥ�cD�j��dV(	�Sv�d:�jn��s�6M�>z��W#�0Z�[�7�",����W��fP�VT�**�x%eo��k�@�;{&�H�����΀�)l��}�4m����܈LI�b�~�o�Q�=cz��e0y�3����n��P�#����l��������Lar4I����BH���_����<���xܗ1z���	DL(���X�G?�x ��˰��Z�}_{�8�u�r�z�1d�����]� PK    �KVXN�y�o  �  @   pj-python/client/node_modules/async/internal/asyncEachOfLimit.js�U�r�0��+09D�D���:=$���N�CS�M�!]�J����%��$��E# v���Bf��6L��e�Cn��B�O��h���^�Ep�\b�C��ě����d�s�&Ǡ�IP�,���ş߾��ś���;3�\d��Z�]��߹0H�x֚�]�Q�W�ʢC����X�"]�����B�K�z��pt�mn�7�����#	�K�܅�t楡H�����T�`�
��d]�!q�E �!a�1Τ\1�J�J��j������ʙ�(1{�&�P����JU�ϝQ���PZZ���ȶ����lƵʴ�X�	۠��!b�)t��(����:�JJ�nz�����^�I/�.I��X���-*B��D��������kAaq�#8�c�mu9��'=��|�a\����`�yXt���w�v����4���Z����a��� �ʥ�����2��<�zww�l�'�٭�C��;�a��'��QИ3˷d�T*��mjw1��"A�6�`���*�������$��n�z�^W�q@wiO�a(,���(�*�)?�"*�+V)��>���^�5��ˋЦ��[<j�N��.�����9��{=I���u�b��������<��j�PK    �KVX��sYx  0  8   pj-python/client/node_modules/async/internal/awaitify.js�R�N�0��+��R)캪 pC�>!��.��rRF���$m:��/����g'Io�#Y��`�z����R�L���ߝ!g3�|}E�d�^�e?�}	����ƴ`8D�� �B:�������{F���|J�s ��uy�����'"�d��WV�� i���Æ-��^\�A׏:A�i�	�E�LG�7#s����3�ۑك�=<���{=/�Iҹ�X���<���E�B�M!����`�eYB��$��-���Eש�����DE;)
�7�9'�F}a��S(oOZ�	�D�q��>4;��8��K۹�*��Q���-�����e{�rB0��YJ���D���*��>����?�>���/PK    �KVXꉖb�   �   9   pj-python/client/node_modules/async/internal/breakLoop.js]��J�@���E�(����$�
;�l:��a�ww��}�C}��U9I�ﵲƼv�q�ȷ(�Η��$j�Qm�L/�r`U�hP���ИiNW֬Vx��P*m�c�/*����a��;"�LH;���#�({��r������}]�����2&-������x�欶�9(6�5���̔�m�PK    9LVXߦ�t  �  ;   pj-python/client/node_modules/async/internal/consoleFunc.js�S�N�0��+V=4v��c��*7�P����*���U��y�I_�ggf�^�jmO�z��b��aK̸�g%TfOpWHet �8F�(�6�Q ��&��e�+i���#���R)������Il�J��ދ�+��\!���fk���C�\t�^���F��@UZ���'�\�)���J���x\}ة>���3k+�Ձ2��'Ы��d������d" �X�V�Bt�*���u@JZ` ���jw:��jM'��I����WB*�]+'�#�g@̾@�u.!�"�e�c���~�ر:w��`�XZS̱�o��5 ����D�F���Z5�ퟎO�`�T�I�NvUKdG����𯚐���O����^��Є_PK    ELVX2()��  �  <   pj-python/client/node_modules/async/internal/createTester.js}TKo�0��+�9dm�"U��hT��F���W�;4�R�~$��{��<���`��o0g�Օ��,I�*�|�m�ھ2�۵�W���v�j�� �gY;܂���gI{�j9�Fi�'��L���]A�㏶���4�Mz3�Ӄ��3�/W5��v���=��4�^�쾙�F�zL����?�	�i�k����#t[8���u�z��kI��v�o	���>�~i�L��'TG��>�!
���F�z*RkA���(@�F����4���R�����f���1Fa��b�8{�&w>�C{l�_��;YׅT�U�~�"#���ꡫ��R(x��9>�4�y��%�!h6���>�i��~���E�!,A>O�y�G�_&��o\]��	��?��g�If��Ͻ�c�ω1��"v���v���b�aBK�x�gI��NL�/��O��PK    ]LVX�	��  �  @   pj-python/client/node_modules/async/internal/DoublyLinkedList.js�V�n�0��+>V���5B)��H�����qĄ"U.N���^.�L�N�T���yof8$5�A�VfRf���=�LAq��P�Ae�S|j�2z���WI-���3pφp�g`��l���|׬n8�vɷ��x@����ieL���s�#{`RF
����m~<�c�=r\5
C��ӻ�)����-�~VL����֨�Tĸ!)B��Q����R�"���l͐z	#��{�[W|2@�ˁ8K�¼�/��<��L��pX[��������A����i����˫���+)�rؕ�j��6��cQ!�pǆ0���r^gqw�r؇�𧰖�r���Z��l�V4
79��"d~~\"w�T�X��!�7����s�ㄭ˦������j�f��>���*\���q����b�m�}zyd�[�i~���#����ڠ
���y�6�ukJ3*�.��(nd8R��k�Bc0-�i_�A��е3�)Ѹ��e[�{OF�#y4Q���D��kl���dP���<F��|�0�ÄK�����R�b���[�bv�T�ڱ�''�%9=zp�l^����H��!��J�����)��{���\o��s� ���n�;��N{9��O]��eȩw,(1�`��c���KÊ�Nj�Y	����ㅴ����Kz%�E�1 �B�8�ٍ�Ua�f
��CW����L���u�\�u�bڟ�w��F�ݦ�����[���tru�*)ZQ���?PK    {LVX�G�n�  N
  ;   pj-python/client/node_modules/async/internal/eachOfLimit.js�V�o�0~�_q�C��6
B0!����P��5�k�YWm�߱ۍӬ`U�z?���|w*)�B��(���a!�9.J��_����\�*����o|^S<M�)u����1j��@L9+& �w]
���-��q`�V�LK&QQݴ��qAj*c��ƥ2!���I\'<��l:����@̭4�w�?�w6�i#��c�eEH��ђKR,�W媔�O_{��P�}[2H�8_��^0z�!*o��5+d�ٰ����.�'�,k�@���He��F~���ׅ494Qd�5�*m�������L)����BA(���>�Y���
'>Km�:�$�^��(���&p�t���K�7�p7���\��B��B +�6܂0�%�(V�r#���& <i��e�D]�1�)}�$��Ȳ2�_��Y1����7T�H��&����]H_5����F���v5�4#T��+Nz��T��GyIq��m��1��9gz�,�0Ԩ�/��|X+j�Jv��g��r�n��k�й�>��@!�v��+�o��غ恅����=_�@�c��/F��,:a%��T99d�Ll�����4h�a1E1<�-���s�2�2M��h��h/�}Ŋk�F��"+�e���4�~Gt�z��k0�ͲT{8���3��q���C��vFܸ�#�:�LU�Tc ���!���9Tw�A��`[�X^퍋>n2M�i���+��mڮ��c�V���x�\�����GM�O�2oof�W�{h�?PK    �LVX�)  T  6   pj-python/client/node_modules/async/internal/filter.js�T�n�0��+69�$��A�V� h�^Z�街�0hy�a(�����|���8-
��>fvw���AUdf�N&ߖ�[a^H���
���V�2:�����rU<O`?{.j��Q5NZ�N�`��ka�y!*�p�B�*�w_��N���B!�����)=����Ң�Տ��)�aX���xu�w23��Oo�K���Zf�(�K��rCao�M�$�7��p;�n�}fú�ͼ�M���	�l���R	��bbɳ���*f��)�mO� @�T&Pޛ5M}p�$�l-�\�6�\R��Ё�)]A��E�3���hs[��Y����C�G�=�	X�y�9ij���5�P�q����O^* �]X�Uj��p�}�����9jgN#8�j�vcs�A�S_���HbZl���U����뜕B�M��v����#���O��X������%u+d�O�*��i���k��@g�Zx��D�#�H�|�-�d��?	R���*���Y�ז��p9�l�����O�����6@���A���G��X��m�G?�PK    �LVX}݆�   �   ;   pj-python/client/node_modules/async/internal/getIterator.jsm��
�0�{�"� 
����;�!Z#t�F�tL��:<�嘏�/:E�(��F�s�@+f���0�Ȳ����%֠�㉆�Q��V�����N��*g��[H�����8
PZ��%q��u�.SO�8A��E�Pfa���}��V6~��PK    �LVX�6�  �	  4   pj-python/client/node_modules/async/internal/Heap.js�VMs�0��Wl8dL'���L�&MI;M{b��K�-E�<�{%`ˈL�S]@־ݷo�k�2� � ��=��r��
b\���Q���-gB�!���,�(�����^B��'P"Co�{gg𙤡�!!�h�!�p�	�*T���Cưb� L��s�zg�	R�K�C �3�E4'K%�QT��9i퓠�"J	��AI� 4�H1���gf�5�A�t���~nB^�,U��!K�(����������������%b�?O��b���V�*i*(m,(&\��b��fy���~q��1n�~�&���~��&���)���)�$����9+��Æ�������b���0u(�U�Mɳ^�S���°��Ye�`�h��{Mݲ�CY|��Q\��5�@}�8�]7s���G��[����
Z5���-��; �*	��~3��-=jLߪ-=V[ݝ~�bl'd�Uߖ};ح�8k��x�V=uP�|�[͗�rMV�t�V�wCU�ݽ�3Ÿ%aK�F�s[eٹ3k�}W�E�����A�[��"�]�n�q8� f�y�d4 
E�G��I�N�|��L��`н�9A���<�C�7���B�nҮ�"�?Q:�Ǔ2D����l�Z�J����Fm�9�,9%��vA�������bZf>u��7���."�ו>�>+��F�Qӧ���^eiT���#�Z��u.4�r �Q�� ��<�Ш�G�vy4���������q�[�-�*[@*�	�'R��w�HI�TRi�:���PK    �LVX�\�?�   !  =   pj-python/client/node_modules/async/internal/initialParams.js]���0��{��2����1��s#]g4�ww ���_��M�G�L���P_P�l��,��H�L��;b�CRU���	�^bݕ	���bȢc�G�
�am��;g!mm6�r �3�R*:y(69heL��uS,����hiٻ>��Y�V�`�����u��P���6=#������|PK    �LVX,rA��     ;   pj-python/client/node_modules/async/internal/isArrayLike.jse���@���� 	!xu�&�5���*�n�H�."z����4��1�#)��x���+mpO�E�n�������֖�� ���any�q	LEK1�_���
�[��F_Q�ʛ��5��|d���=�7��k�V�=�ќ�J)��o�H�+�e�d��U&E/��t�:T�)-�PK    �LVX��2;�  �  8   pj-python/client/node_modules/async/internal/iterator.js�T�o�0��W<�P@�X[i�(��&mڴ�Q��:%83�j��a�1�4[.1���}�~U"�J�L���?�0S����RP�c��!U9��$���T9^����^Ҽ���ЫC��F#�r�$�
�(���\^R		/?J���g$������{� ڕ~8A�#F�R������.�RQu�C/�`�������*2�Eq/v!��_U� �����/��
K��-`�7j�c`J��2��m�N���e�;Ǣi�"Z>�'s�Fc�|UA�� f3�Zd	���ڊ����ǘk�����H���;�Ͽ�nn?بy�8���4A�8�Vd@�b��}���f���fl���S���O���5�9����)���}]B{�=�a�f��%����XyE�\+�O�� �I��˸���p�B�����ʿ��`7q7��kн5��N�����{}��wB�8W|�3(��-/�y<=$�d���C��(�1zQ�PK    �LVX��_j  �  3   pj-python/client/node_modules/async/internal/map.jsuR�n�0��V%��U;�iڮզ]�
�������V-�>��vZ$<��=;�u��(��Ǟ���P�h�ۼ�7Y�(Ձᾮ�jB��)6�j���p�V��PR���g�ׅ�R�J��5	�\B�#y�d0
J�ֹD�Gwg8�5~�'��P�B��>T�lL2e[]
�W��U��H�J���S�Ecw���J�},z����p�1��c[���!'U�C�(2.>;,
C�O'X�c;AIfi �BE�M��G0u��yx9!7�3Sh�l��%�o����Y Ƀ���r�{H���,>��6C��ް�e�[�lk�k�� o�1��sJyM��:HZz�O{�}����H�7�2�PK    �LVXo���   j  4   pj-python/client/node_modules/async/internal/once.js]��n� ��<���"`(�ݦ�*FM�� 2�[U��K��������m%#d&oy�B���euD�#�QZ��"�gI�y��p����%�0�U@��	����XG-:��0%0̐�E-\��}��+]����&�T?��2t����AU�<�K#r����X�s���)l���M휪f�"��׽��N���w09�S�}��v���Y�U|����}5�w}PK    �LVXX�9�   h  8   pj-python/client/node_modules/async/internal/onlyOnce.js]�AN�0E�>��+G�| ���P{��u�4`�h<n�P�Tb���y���d���;�F����}�Di@�I���������-u%�<���:7
>SA17Fl�aK`h!�0�C#|���wI��lB.a�(������/�{�ж-�B|�4B�^�)�lC�X�	��`��&pU�N��줛�U~�4��a,����9m�!L��}-b=잘����ډ�~��-�_PK    �LVXs���  �  8   pj-python/client/node_modules/async/internal/parallel.js}Q�n�0}�+n� ��nqo2���q˖�c*^f��k���}�ȴ/m�=��7WJKi7t���#���?d�G����*����[���	�� �Or���9:�O3\�R����x;�)H�ɅD�e���*�?K�j$�O�|�������z�|?SE���rO��^SiA-���".�M����	4C��4�"K/���և��\�@7����a�SU�lmY��P�P:N�[d˻:>���yȣM����Q�O��v>L۸%YQW͠N&�Y�����X:�*x�@����j>�:RfUm��ư�0Ƭ��,�g�,��Ko��� d�ܢU��� e�V����_"�����Q��2 j��ۗ�s}�䞶�*`VgHZ�4�?PK    �LVX�(�    ?   pj-python/client/node_modules/async/internal/promiseCallback.jseQ�j�0��+D/I ��Z�6v,$,�QJHR�K���v�����9���Ȗ������ڨ�6#$�X�æ�)١2�;���aQ���9.b��v*y�K0�Gr������4y�_��3yN�a��XI���V�K�yU�߁E���i��Y2�<G
��'���idCbB�#���RZ�����\.�p�+�!6y�Ё)G�7_��Gx���6[����ܛۡ�vj�?������>��.sR[=Xa���i܎��K���m�lu?�����6��PK    �LVX��  J!  5   pj-python/client/node_modules/async/internal/queue.js�]o۶�ݿ�dfi��t�� �ސ�0`E�noA���HG��z����!)��(�[��	(�����P��� M��y:��] �H
�))yװi�!"w�|�����mE>[�3��cV�d	�i���3�4�������D��e�:��9��yhˆD��y��|����Z�ޖT)�{��Z�z���s]��̄���q���x�p=�k֮��/%�'�/%.O���o�����D�M�������e�c�z�U�h���dt
��?����,چ�|�/���d��^�/%����Z8�p��(����'�rF�i��e��eEl"��@d��j���ng^�j���$���KYl�J��>�w�ǦaM4e�ԭt4e�~�V�ǆ�L�h[+M$��ra[�K����=m��-�%��h�ú�&��o��A��GB��%?A��n�/MVRw�g�e2�w��� �NpIk�jU{�1)Q��hQI�l������&ٵ|uP��,j99AO��7�h����=J�$k�x��,p|�f����c�����cz^!��H���^�j;�R�T�{r���Ɇ5?f�V����,7*8��%׳1�ƄZ���ܔ�,=W���sڍ�\��#M�qg����3T���q����e���o	V�B���d��
Ȯa\hQ��l��J��0�!h�T��,@YU����wO���`��a��V0��c��[^Le��Um�u%�����_	Y#��x������tP;rh������z�>ϟÞ@!�R�F��f��:]fP�zW�uV���k>��H�})�P
g-K�!Hg�������X�#l>����_ʒo��j����C�v�:F,���In�Ȓ�����r�D�/�gXX^��O7��
8��AJ�Q�Y���FD(�-�>�&�T}�1\��,����g���n��3/
�f|�&��<$��㴂���;.B ]�`���.�$6g�#�\>���R]��M�`e(�����"�R[f#oz2���+�9���B����_�g2+�/��?Ϟ� *�wh��ǡ�*iA>��nm��v�4���I�����~l�:W�L�$��D���̉�Y��屾�O��m�:�v�˔T��:Ww� EW�����}�P+6^bѳ������l�~e$��=���Ç�,*�'I��uL�l=8��D��Ú�F�����;��h�q�����HC���ʮ�U$%E</�?�t:��*��R��{��Gea(�Ǚ?7�!b˰�Ҭ&V��7������j���T,� �A-�A#F4�'����QHk�Q#����\VՍ���3���gZ�g�R�p4��1��$nF�gc�*��jGƵ�e����_��U�l-dʳ�&�JR_��H !H٪<â�t=Z:��s�� `�v�M��el�N��i�CRr����AGŦ��Ak�M��������Z�zad�~z9O�GC�&���Q��n�����OXǣ4�}YU��Ǻ��v\ݤLD~��������(�9e��Fj���A2A�4��)�������B	��Ը׹zde!�9�&����uF��� �~�'�۶�Rx
,�eڧ��ګƻC��[9	���n*�����|'#'�mȻ!7J�[�wT�������l�}l`?hw�^����[{h:5(qu7>��������^�	g<F�C�ߟ#ΛLl�ZFz��ak��΂�&?记YAl�&'0���@�8=;��E�@ӓ�h����\�){������~�irxs2p��,�����i���L�}N�f��!@�|���:�	�J�i��N��зk������AlT���$HBO��� <��A��E>;8��9!x[�Q1������+����ݩ����7a鬿=Ư�8Ws9Wsؔ%���J]�}7g�#l'�� %ٴ�F�냦���V$C�%��aa)o}s-�oJ��+2#`�(n�Nf*N|x{"���a�Jғ�(*a�����	ЫO� ��tș �25�g������݀������PK    �LVX�rX��     5   pj-python/client/node_modules/async/internal/range.js]�A�@E�=E�
� N\x �{cB�18C:wta7M�����w�NXW)���J��55�ОmG,}L�β��� ���o)J�8νl=�P����<e��\#��L
o*�ք;v�E�/������샬f�q�-��ɲ/2M@�p�ib� �g��p���KÑ��>PK    �LVX΃��>  �  6   pj-python/client/node_modules/async/internal/reject.js}��N�0��}�qK�4���ī���t�Ȋ��lxw�R6ѹP����δ��ڨZ�$'�<�0��Z�j;T�D�k��)l��S{�nR8p������H��{"use strict";

function makeException(ErrorType, message, opts = {}) {
    if (opts.globals) {
        ErrorType = opts.globals[ErrorType.name];
    }
    return new ErrorType(`${opts.context ? opts.context : "Value"} ${message}.`);
}

function toNumber(value, opts = {}) {
    if (!opts.globals) {
        return +value;
    }
    if (typeof value === "bigint") {
        throw opts.globals.TypeError("Cannot convert a BigInt value to a number");
    }
    return opts.globals.Number(value);
}

function type(V) {
    if (V === null) {
        return "Null";
    }
    switch (typeof V) {
        case "undefined":
            return "Undefined";
        case "boolean":
            return "Boolean";
        case "number":
            return "Number";
        case "string":
            return "String";
        case "symbol":
            return "Symbol";
        case "bigint":
            return "BigInt";
        case "object":
            // Falls through
        case "function":
            // Falls through
        default:
            // Per ES spec, typeof returns an implemention-defined value that is not any of the existing ones for
            // uncallable non-standard exotic objects. Yet Type() which the Web IDL spec depends on returns Object for
            // such cases. So treat the default case as an object.
            return "Object";
    }
}

// Round x to the nearest integer, choosing the even integer if it lies halfway between two.
function evenRound(x) {
    // There are four cases for numbers with fractional part being .5:
    //
    // case |     x     | floor(x) | round(x) | expected | x <> 0 | x % 1 | x & 1 |   example
    //   1  |  2n + 0.5 |  2n      |  2n + 1  |  2n      |   >    |  0.5  |   0   |  0.5 ->  0
    //   2  |  2n + 1.5 |  2n + 1  |  2n + 2  |  2n + 2  |   >    |  0.5  |   1   |  1.5 ->  2
    //   3  | -2n - 0.5 | -2n - 1  | -2n      | -2n      |   <    | -0.5  |   0   | -0.5 ->  0
    //   4  | -2n - 1.5 | -2n - 2  | -2n - 1  | -2n - 2  |   <    | -0.5  |   1   | -1.5 -> -2
    // (where n is a non-negative integer)
    //
    // Branch here for cases 1 and 4
    if ((x > 0 && (x % 1) === +0.5 && (x & 1) === 0) ||
        (x < 0 && (x % 1) === -0.5 && (x & 1) === 1)) {
        return censorNegativeZero(Math.floor(x));
    }

    return censorNegativeZero(Math.round(x));
}

function integerPart(n) {
    return censorNegativeZero(Math.trunc(n));
}

function sign(x) {
    return x < 0 ? -1 : 1;
}

function modulo(x, y) {
    // https://tc39.github.io/ecma262/#eqn-modulo
    // Note that http://stackoverflow.com/a/4467559/3191 does NOT work for large modulos
    const signMightNotMatch = x % y;
    if (sign(y) !== sign(signMightNotMatch)) {
        return signMightNotMatch + y;
    }
    return signMightNotMatch;
}

function censorNegativeZero(x) {
    return x === 0 ? 0 : x;
}

function createIntegerConversion(bitLength, typeOpts) {
    const isSigned = !typeOpts.unsigned;

    let lowerBound;
    let upperBound;
    if (bitLength === 64) {
        upperBound = Number.MAX_SAFE_INTEGER;
        lowerBound = !isSigned ? 0 : Number.MIN_SAFE_INTEGER;
    } else if (!isSigned) {
        lowerBound = 0;
        upperBound = Math.pow(2, bitLength) - 1;
    } else {
        lowerBound = -Math.pow(2, bitLength - 1);
        upperBound = Math.pow(2, bitLength - 1) - 1;
    }

    const twoToTheBitLength = Math.pow(2, bitLength);
    const twoToOneLessThanTheBitLength = Math.pow(2, bitLength - 1);

    return (V, opts = {}) => {
        let x = toNumber(V, opts);
        x = censorNegativeZero(x);

        if (opts.enforceRange) {
            if (!Number.isFinite(x)) {
                throw makeException(TypeError, "is not a finite number", opts);
            }

            x = integerPart(x);

            if (x < lowerBound || x > upperBound) {
                throw makeException(TypeError,
                    `is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`, opts);
            }

            return x;
        }

        if (!Number.isNaN(x) && opts.clamp) {
            x = Math.min(Math.max(x, lowerBound), upperBound);
            x = evenRound(x);
            return x;
        }

        if (!Number.isFinite(x) || x === 0) {
            return 0;
        }
        x = integerPart(x);

        // Math.pow(2, 64) is not accurately representable in JavaScript, so try to avoid these per-spec operations if
        // possible. Hopefully it's an optimization for the non-64-bitLength cases too.
        if (x >= lowerBound && x <= upperBound) {
            return x;
        }

        // These will not work great for bitLength of 64, but oh well. See the README for more details.
        x = modulo(x, twoToTheBitLength);
        if (isSigned && x >= twoToOneLessThanTheBitLength) {
            return x - twoToTheBitLength;
        }
        return x;
    };
}

function createLongLongConversion(bitLength, { unsigned }) {
    const upperBound = Number.MAX_SAFE_INTEGER;
    const lowerBound = unsigned ? 0 : Number.MIN_SAFE_INTEGER;
    const asBigIntN = unsigned ? BigInt.asUintN : BigInt.asIntN;

    return (V, opts = {}) => {
        if (opts === undefined) {
            opts = {};
        }

        let x = toNumber(V, opts);
        x = censorNegativeZero(x);

        if (opts.enforceRange) {
            if (!Number.isFinite(x)) {
                throw makeException(TypeError, "is not a finite number", opts);
            }

            x = integerPart(x);

            if (x < lowerBound || x > upperBound) {
                throw makeException(TypeError,
                    `is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`, opts);
            }

            return x;
        }

        if (!Number.isNaN(x) && opts.clamp) {
            x = Math.min(Math.max(x, lowerBound), upperBound);
            x = evenRound(x);
            return x;
        }

        if (!Number.isFinite(x) || x === 0) {
            return 0;
        }

        let xBigInt = BigInt(integerPart(x));
        xBigInt = asBigIntN(bitLength, xBigInt);
        return Number(xBigInt);
    };
}

exports.any = V => {
    return V;
};

exports.void = function () {
    return undefined;
};

exports.boolean = function (val) {
    return !!val;
};

exports.byte = createIntegerConversion(8, { unsigned: false });
exports.octet = createIntegerConversion(8, { unsigned: true });

exports.short = createIntegerConversion(16, { unsigned: false });
exports["unsigned short"