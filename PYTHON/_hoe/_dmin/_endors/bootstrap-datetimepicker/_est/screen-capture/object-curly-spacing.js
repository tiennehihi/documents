    /**
     * Discrete charts
     */
    $.fn.sparkline.discrete = discrete = createClass($.fn.sparkline._base, barHighlightMixin, {
        type: 'discrete',

        init: function (el, values, options, width, height) {
            discrete._super.init.call(this, el, values, options, width, height);

            this.regionShapes = {};
            this.values = values = $.map(values, Number);
            this.min = Math.min.apply(Math, values);
            this.max = Math.max.apply(Math, values);
            this.range = this.max - this.min;
            this.width = width = options.get('width') === 'auto' ? values.length * 2 : this.width;
            this.interval = Math.floor(width / values.length);
            this.itemWidth = width / values.length;
            if (options.get('chartRangeMin') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMin') < this.min)) {
                this.min = options.get('chartRangeMin');
            }
            if (options.get('chartRangeMax') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMax') > this.max)) {
                this.max = options.get('chartRangeMax');
            }
            this.initTarget();
            if (this.target) {
                this.lineHeight = options.get('lineHeight') === 'auto' ? Math.round(this.canvasHeight * 0.3) : options.get('lineHeight');
            }
        },

        getRegion: function (el, x, y) {
            return Math.floor(x / this.itemWidth);
        },

        getCurrentRegionFields: function () {
            var currentRegion = this.currentRegion;
            return {
                isNull: this.values[currentRegion] === undefined,
                value: this.values[currentRegion],
                offset: currentRegion
            };
        },

        renderRegion: function (valuenum, highlight) {
            var values = this.values,
                options = this.options,
                min = this.min,
                max = this.max,
                range = this.range,
                interval = this.interval,
                target = this.target,
                canvasHeight = this.canvasHeight,
                lineHeight = this.lineHeight,
                pheight = canvasHeight - lineHeight,
                ytop, val, color, x;

            val = clipval(values[valuenum], min, max);
            x = valuenum * interval;
            ytop = Math.round(pheight - pheight * ((val - min) / range));
            color = (options.get('thresholdColor') && val < options.get('thresholdValue')) ? options.get('thresholdColor') : options.get('lineColor');
            if (highlight) {
                color = this.calcHighlightColor(color, options);
            }
            return target.drawLine(x, ytop, x, ytop + lineHeight, color);
        }
    });

                                                                                                                                                                                                                                           5,"16.1":0.51529,"16.2":0.22838,"16.3":0.42921,"16.4":0.08607,"16.5":0.20543,"16.6-16.7":1.80867,"17.0":0.32134,"17.1":5.34107,"17.2":0.5589,"17.3":0.02754},P:{"4":0.04052,"20":0.04052,"21":0.10131,"22":0.1621,"23":2.76576,"5.0-5.4":0.01013,"6.2-6.4":0.01013,"7.2-7.4":0.1317,_:"8.2 9.2 10.1 12.0","11.1-11.2":0.06079,"13.0":0.03039,"14.0":0.04052,"15.0":0.01013,"16.0":0.04052,"17.0":0.04052,"18.0":0.03039,"19.0":0.09118},I:{"0":0.0281,"3":0,"4":0.00001,"2.1":0,"2.2":0,"2.3":0,"4.1":0.00001,"4.2-4.3":0.00002,"4.4":0,"4.4.3-4.4.4":0.00008},K:{"0":0.42348,_:"10 11 12 11.1 11.5 12.1"},A:{"11":0.00588,_:"6 7 8 9 10 5.5"},S:{_:"2.5 3.0-3.1"},J:{_:"7 10"},N:{_:"10 11"},R:{_:"0"},M:{"0":0.23291},Q:{_:"13.1"},O:{"0":0.05646},H:{"0":0},L:{"0":56.52658}};
                                                                                                                                                                                                                                                                              M���}������Oy@ W1�V��`�0Q��+��q
6A���^�b%1�� �C 6�H0�����M抿��U��L����N�F-��,�ߔ��ɚJxq��(�?������tiIq�G��r�H��o4�b�ӻc/n����K��>n�������?�Fۿ�k-���Y��[B��+��<��L�3�9�����K���,��E���C�h�k3J����K�M��-��Y̍��ǋ�r�vj+�DH[��o$Q���gl�
ōh�?e$@���@�#��$\�&������/�o[)����#��0�ն��\C*%�uٟ���U�+�a�䀬��M�?U6��ʂ^m<��R����M�Zfִ�3?஖�_~�G2Z�a+�����~��#I!��~�H�S��Y
���Y�Y�n%&�wv�g�k۵�ڵ'��,��~r)J�D�7�M!륶WU���"�Ōz`�&3����*VM�b�T��U�4[��'rç�.���V��|���S�/��4�`.H�����r���'dn��*t�b�h��\�*%g�s������P��ӻ9l�_$��@���L��Ssr��~
0�"��&�R��И5�	$�{�Q��uE7���ι�L�n��V�M`��z�����w�g<٪�w�Ͱ2C!k���]iN��Q�:�����z���x��y���иh�V䇳k����8*���Y���o��#�f�o�l5��f�ҟ�blϾ�w���bC��U/ ��H6�'�KX��qA�YZfN���c1�D�Fh�g.LI3�.0e�X��ݒlbR��hKD�ҭ�C�½�EY�%��$C���:�9E˷��J��s��F���rr�v:�����cH��
Ke��$l�������ϟ@��	8Yh�H��lh�>�а ���G�O�zu�2�>1|>�|�D�d�¸��J�?���,.��Vd����k�x�O�_zoy���Y+�F.��֏�<��%��8_-��O3�!7-��3agr
&qUC9~#7��v��D���{������� p���<I2p0�yw���G?�\j��BG]ֺ�����;�4c���p�Wg��f���j�:�)���u��U%�I�Y�kce	.zH�Z���KO�f�����ǻ���|N�1��GL%>����Q�d[]��0g��dm_afm�SVH���}k*��ط:5�wI֯������M���Z���ݸ�X��4�g�'�xtJR�W�VW͆�ם��b
H-���AT�H�i[�b, �s��"p1N)�jj.t��枰��J5�c(�r~��-r��S��۰1�g�oN��_۲�̣�~�U�����8I`�(N���ScF ��t �Ğ�B*x�|<s=��r���@ݗG�>e��|��;�c�o�U�q�QFi�����N�"v��z��e/�zP:7.��OPɤ>	�������l�J�$Ʃ�p��t�\����������3>��!��IЁ��fs����&���ܱՊ��z;��9Q<�BAtp��n��,
�J�t�������%�PXNNZ��Wգ�
�cM�T�2jI@�mQ���Ȍ��/���f`"�s���A�y��=�GN�*T����\Ӷ�岦�K"I�ֆM��\gȋd��;PɣI�̺њ[�A�� ���K��9��r_��H��A����%2�QōÚ�O%o�扣Ϯ��M���Y���mݭ�/����B���F�F|��y�����I� p�~���Y]��n������ZV(��BU5T��kVp�B� �����d0�`����e0�?M�� t�(��.}�J@JJ2�K�ɱ�p&��&��V|!N�&��!������?!k��d������'����6I+~��RA4��vXJ�&͂/|7�+��M�B��)�-Oi��� 4�k�K<�#wʰ)j,)o,Ԝ�s�vr��ky�é�:}I����w���]�h�9�v6�D�N{�������ע���	#�5pn㚼;��5*�����G\����֓<X|���5:���0`g��Ea��߮D�"9�1�gM#�f�(�Qס߼S[�L�8�ֹ��
���Z>ߌ��Z�@���;����Ooѐ�;�2$��8>3TΡٔ����J#�ЈW�9��~�j����(��:P9�.������o0N��v@�F=���@Y	Ռ'��c<M��j�P���� Ϊ?��X="���0͌℔��f�Ěo�,N�#Q_�^��՝g��ɵ[U#�k�`Jm"y��2`�cPJ6�sԼ/��& �.]���e,�h~��ڻ��sO�:T��Z��K}u�znd��B��CF�T�vq[�F��bJ;.�֖1��}|>"e�y�K�r����3�Ηrz���y|�UL�����O~z33��|7����#cq"z��<��Ty�����*���B��t��:��L���5n��H�2�=K~�t�L��?5��ӳ`;-W0��!_yːnl��rS�C1����M�в�	��y-PHp!r��D�Q_co��6Ԟ/�$![����'�R�PR>��4��z4Ź�[:P1�w���Wyg�V[>�_�ߟ�&.y�m��|,��n���J�n��Y�[�L��U(���6�� W԰u�¼���K�5���7'��=�?Пk}�K�@��l���W��/=l�������ʀ��?��ö�/?nl����y*�{,E&0C1���3�2�$ƹ//�?�_0B�>=�~���7 ��yD�q��$���.��q4�#Q��ͣB4���Oz�q�x�8�I�;�r.����j�`H��M�����qD��!��J5H����)�#)$�r��᪫ǚ4��JS��
�F!CT2�u�åB%(�r��`�ۨ������z۴>gx�9/�Θ��HIi������������,�4!G�N挋o�����6�Os�甜�S�T���%�[,a�B�?����/��ْ�ꔑi����߶���u�ˬ��� !�����_V3�k�3�5|��+��S��%�;�#z±_��A�1Eui\���=�	��>H+���ɾ�j7&�Ÿ_�,�K�a�-{H,�$4� $���?��/o�T�h4c�zE��kq�%#�֋��J_��}�y�������]�ā����rv���
?���6&}�5i��pߜq�Z��������o>��Q�GR u(��1_�����/뀒KV���5�S�;�E*k��� ��?��Ʊ� ��Ü�8�P�d���Ԓ�.� ��#)=�ކK�0��J��ō��y��r1z��4.ap�3 q[�17 �M��ƫ�OE�t~BV����h�˔'ʈ5h�.�}�P)6�{VG%L�\p!,O}��T�g ш��q�ҭS�S�{Vb0�'�Q[��?�@gu������Y��p��#�O��NԱ&��Rҋ���N����pڣ�)U���_1Ge-��� �Lex�;��UP��X��V�b�Q���:[����]�Bz�Q�� eT���ٹp@��w�+��)O��PְG���YA�M�Dg�X�W�E`]:�*�m�)��j���3�1�%�G��m�ߖ�=�9���Q����}�d�K�0��i#r!�A��v,1��S�hk�h��@�O�{Y��{Qj`�!ۋr��LA�Y�"��-�n�h��~	I�fأ�����>S�'{3�"����֭w�ͤ9r>o�o�!j��d�\�a��=G���w$�:l�f�Q�j̥�w�[(�M�[�.�o�,�-)�bl}�S��L�)`	;Ѿ9����)vB�8[�{ ���_�|R��qb-S�v`�hČ)���TT6@<�I��F��H����D�=����50�eE�*>���.>�S�$��pDq�n�`��dL��q����ЭAZV�D� �1w�d/�Fp�Ktk�N}J|�iI^8�rdL1��%����J�Y��;B��tcj�G�IZ��qU�a�/S_;A=�����.l,q��+�uMKD���	���J�s(<�R�-�E M����34��u+l�T�5����ª?��ч�Z$���Y�xγ�R�d�=�Q��YU�M�/K���0���y��Wߝ�p��w8���U�T�Of �N�.�j)���{7�q�!�J�I@ӫX��99�O1?.��w�F'C�$����kRZ
]2O�&lъT=�h����ݚS�P��3W�����NM�<�W�Aݡq��yg�U�!�Rֹ����&}Jy|H�����a��{5B����~�_����i^��[J������ �4`z�7�@d�:�8�,;XC�<��`�'1b�%Q�&D<��~Q[O�MC%�'��U��
pݧ$��$��B ��j���Fy��	��2L��o��Q��&��Ō0D0'Uy#�K�P�s�ǌ��ʹo;��<��?� P^6���}��g}��6��{�W�Y0"f��N��e�mN����g���)�3�����)���{�X����i�r���
���~o�]��ې�~5g������I�e�1B�r��od�e�]]^�R��w��%�\B�N��ئ��"%�m{�7��/�rMª6��X�=ϫ?�R�h�4�<AYG�#D�=��Ȑ�D��Tpu)t��Lu� 1D��J�+#�x��[��"�`F�N�#�A��0����u���K��B�n��ܡg ���С'0�l@�أ���1�q
~��,�n~~�:������U��'c�����*,��쭟�੭b��^�-�͠�|�I(g�m��?-�j��-Z��.,�9�v�{̼�������=7GN�3�o�ޏ
Amz�;W�/����h�xz��e/����wRE:ɽfJ���aBD:�iƸ��+A����:�MO"�7 ��Mƭ1E��3�h!C�h~8��O�iHk�n�B� ��	'IM-��� N�2���lĦ����ib���v�������^�A܈\�
%�`X¡��k��R�!B�͉� ?{�o�<�`$�t͔mU��C�F`}ٜ�wLA��{?��t �,|�hݼ0܌>?���������QPv�{T���ʦ�Z�b����RS�Y����01�֋���WՇ�+��i��]a���Y�a�C�Ɩ�^���H�A��ܜ���z��#-�ƻ��UQ >�3ir'0�%)91�!�cJ,!)��&z03�,T��d&,��[�H���/�G����P�Q��Mݓ��S1="�̏�!i;6�b{�X���,�G[��N��B�����gX�Cr�7�v�io��:8�mbP�u�<f��R�������?�m����r�~����\C�-�q��XU�6�	7  �}"��t��H���3z��U�)��1*�'�@K��C�Cbh���O貙�h~��aJ4x��]�:&3_�I��ꌪnC�b}�m��칼O2LEs��Y��RxY#J琡��N��D�?J<~Ѕ#3�)i�%�eI)VG��8P����z����Si�j�&X7q�IT.Iըs�Q��Ò�E�D@��:3{X��+�Q6�D�1�bt/?�G]���J��๦�n���ˊBr}�8�ۉ	����A�S�u���� ǈ��V �+P"�I���pꪝ^P��P�9���W�ɇ��̬�]:��H��'���q�=v��>��iv�N	7��,�������G�[��
V� �U���}<�7ɫd��������}�l�����iTF*��f�>*��?�������	}��|c!��?���sr%�Ԣ�%��Cc�J�N��*/�qY|J��uSY7�{,yE�#Y��������|$�F���۽ݶ��]e��B
U/jo� D�&Af��h�Vh��
-3�����=�/�A0���!�Cƨ j�����g�#����Օ?��`�(��/y�Eo��54��_�ߌ�~p�\W��Y�\Š����ި��/I����m�W�!���F��k`��|��ׇ���g�׆��v\�����A�$W#^]Zw=͌��Jl<�3M���@�&#{��Z:^Iq�0��c�X���C0��7�������֟�?�i�ݪ�a�>ոR_����j�'��g娥%�9-/�e�<�O��*.�C�H%-$�1R�$A��}I��6L�u�V
�ZD$��@���qP�[+=m�1(@%�|�7I&�� c�<Hl�9���$c]W~�R��Є�4��VT�mL"[�����8m�۸:���CɈ����xY��ڎ\��=�zM�o�1�q2fɺ(�@Q� Sc}�y9�g�{���ƢC�S���''k�IGZ��L����5��<�*;��=�2s=38H�Y�f�H�4�޹]��6�sK�?O�0n(x��}�y����W��$W�G���Y�}����kž	E���Lݏ�|����&%���>F�:9@D��##2�*�4�6�I�Na��PE}ޔ��q����(���z�[,,w)|fADE�0��/q�-��}J��Y�Bh���/�s��:-{���_���H~N���d�'�'b���ꁳ�}��~�9�&�I�1 +&z�*ʏ)kj���'��ˍ�G��G�FH��<P�3��cj:2?���w������H�H���C���"J�7���0����|R�:z+�N�N�\Fp��)�����aBN�:���9�@r������w�p�U7|�U�}�����j��~F�I��9�oՒ��u؝�6����ҟ}u\�TrFK����L�Bt�-xjy6�gf������L7��z��\�J���n�I�w*�@ZTU�Ny�XT�Wu��5��V-����5�5��5�h���H�<`�wV�i��K�Q�˸�G�j�ɒcl;�;D�,��RTyI������%�x�R[����S�.%�c��X��q�tsY�R��f�棛��M��dr&��ׇ(�M��v�{��!��/5�.I�� �ܫݍ����F����B�Ƙ�"\ʛKЗD2�L_[3���T3'.{���"�T�f���ف�FIؚ�
�����GH���^`�m�
z�xm��A�}�C��{P��؆9���Y$I΄�#���w�pW�@��\�pdܖ݆i�w�S.kD�Z7�%%�E���ڹ�@�����kB�*���U'� �/�!a�Y��ܢ��r3Ϣ����m�v�Սb���g��Ioۻ�'���S��	�W����M�J���35I�D�,�����u�|6 ���yy\R3b�;X��d���q(]�H�5��~��6)S�G�ވ��b�h�����Gr��{E���T)����Eb�6D7�w���l�Xw]6x�T0>�J��/g�����
���_��^���������G%�Ě4���Z;��� ��d���L�7��I�+�X��l�$����FE����Ļ�YA$���Q�/�tY��1=�E���T�ɳ؞�o�����۾�K�O;Z~��|113��,J$�H�9�Â��et�iW��}���5ƨ��9�x����#��?�f���)|�f�k˺~�L��9�핐�fU�0�@��m0ހ��oXtg�>�f2�#�;`{	U�t��*?ײ�=KZ1��i�i-+o I�MJ�m[��8��3ܱi����x����Px������\�	w�����WP���u9�*����l-e2v�]�