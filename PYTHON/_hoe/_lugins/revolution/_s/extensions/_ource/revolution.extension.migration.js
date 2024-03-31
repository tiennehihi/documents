'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _map2 = require('./internal/map.js');

var _map3 = _interopRequireDefault(_map2);

var _eachOfLimit = require('./internal/eachOfLimit.js');

var _eachOfLimit2 = _interopRequireDefault(_eachOfLimit);

var _awaitify = require('./internal/awaitify.js');

var _awaitify2 = _interopRequireDefault(_awaitify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
 *
 * @name mapLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with the transformed item.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an array of the
 * transformed items from the `coll`. Invoked with (err, results).
 * @returns {Promise} a promise, if no callback is passed
 */
function mapLimit(coll, limit, iteratee, callback) {
    return (0, _map3.default)((0, _eachOfLimit2.default)(limit), coll, iteratee, callback);
}
exports.default = (0, _awaitify2.default)(mapLimit, 4);
module.exports = exports.default;                                                                                                                                                                                                                                                                                                                                                                                                                                            ��oe�5�)P�c�lF���V��rd��m��֟��Y(�9��
�V���	�P2v��y�q�~�ipy�@�I�%�#�1GQ���ʦ}P�b���ۅ�5�klQkÄ��u�%�Kv�{%�����``\u����Ĳ�-�l���T���*�?�C:۴�8���f��є�]Lrel�� D>��0.Ipf%�t��b��֋�̮n���D�G#8�B��8�����m)7��M�xy�;R;�;^��3��Nw�A_�QSDvj�������5 lA�T<���[��0C��W���XC�P�����v��0#���D�0�\2Z��B��A�/^;\u	sAt�����$H�)��N�.��b�bZv/Ѝv��*M� Y�W{`2�����q���oY�����K��79D�a��<ר1��c�j~���C�L�k(�^�ʘvŷ�p��3��ܤ6*X����������?��"Q\�kdϳj���|pi._2��ִ?S�2.�8��yQ
�����q_��{�A�#���NiZU�Uˣ?�m�__��[����,?�ڶ��0��fN�cm<��!��H��BHvub�)f�'��{('�����FeD���H�����ɒ��o'�,�?�Yj/=(��;Ci"T(l�#qzȿ���k�6��I���xm��v��"�w�p�t�#��^��5X�V�;�a`?�N�����p�1�y�1������9xt�m�RUg.l|\� I�r1�ݥg,�O�ɜ�\^刨@���,��r-马f�
J�
T�u�PQ��_�^�hz�\�K���?����]�Ѽd��T}m!�} �3����-�X:톲���	P�Ɨ{�aJA��} �g�<�jӾ��+���m	�ZN`�+���i�[_�c���p��<1����D�Hԅ�lm$mo���H�ÌǎS�>�}�����$x�]�j9z	�mK����1��[/�����K�onk২���A�Z�U�&%t�x��A
�bZSXsbT)bbCH,g�e�d���n�+L�R �Ĉʔ��1O٢O$�+���3\�L>y<n�B��^���5D�M�k*�囗��z��+��m����2���v
@<T�/��}���Qj�i�.���=�1���DY�`c�~_lc��]��؟k� l�(�����I&+s=pk��+(���ЊM��{B#��~f8��e�~��<$�YuK���n�QN�H7R��b��U��?���r{�֔�J�Aܑ����Џ�^�:y�3�M�QxB����Y5#�Ɯ�*�6���%�-��p$Ā��f~Q���1�)�v�lY�����������eh�
����fm�7�=e,j��c
c���P�Z��/1���T
�/��P�7��ҙ�0�"�2��GY�kx��/�ׂ���V��"��#Y��t��˖�P���+�|��\�~L�ȏj�/|B�ۍ1�����\�Sg�F?���y�4G�[9 �:Qd�M��V���Mk�����#{�F�6$�rw���n����1J��
yԕg�mC�p�G��K�yˮRΨ�GS�
w�!�-�,w���^�ӌ�K�lf'�Í�b�w��y��m^$"C��������su�aGߠL�6j�ri�s<lɲ��_OI$�@��a O�'�̉x��|Lj��nF:��5}k+��9���P�M9���7zU@��.7�O���@�7~��n�u�H@�?��x��p���[$�cfJ��z���� � ��Q�1�*����j�ܐ�D;mq׿B�]ЪQ�@�V��I[D�����Z��r����i14�a�2�����6��:W7������d�w.nޖ��2��������4́X�\H�Ǥ�+��4�K��΀WR
j�dU	uO��� 	���B��ߖ����>�d���:#�� �B�ah$?�8-u����,��_8��v�
�\K6/���j�.�������I��L�/��Y|�^Dyj��W�W����'MVG��q	���wY���A?�%���]�.�=@�����jfj�F�M������}����;4�P���y[�r�����fqx2<<py+;I^P3d�z0�a�ޯ���x������ȿ�e����-wm���'K�FmX�sMx�Z�X�������(��Im�M<�P2�ga��\�Yv?&�Ƽ�T�;��K�?]�bY��	)���P�����^�UP��A����l��]f��8��y�he�߹�ی�X�ɤX�l���Gɯ�O�9Ogɵ
lɸ�
p��d�iL�A���J�H�����`:t�� 兩?	1���Sjn�w��n����bS�!�Ւ�e�
}���Z�&2r$vk��h���㩟n�0ɫf����i�V�f;g-$*�guy������ǢƝ1���/�ܚ:�X!��˯~��1�]D�G�Ii����Y�p�ܪ�HS�N���. E��8����](,�p9��u���*��LTj�I�^P0B�R��S�\m��Ɏ���ݙ���� dGL� �U���Ig���jR��N^<W@��yt���	!��B5!7��U�q����<��#g�����͇�!k@B�o`{��Td	F��0'�6�a����i7��ҷ��'�d��g�c��y��xj2Dw�ȅ�vƫe[���ȝ��)����)c��*ls���X/!9�	��������-Un����2Zh8���n��ք����m��(�1�L;!�C,����D�a��\�S5�{�ڈ=�XQ#�(*a�^��6O���n��c.(�H�@.?�f{��.A?�0�a��}{]	'�����q�4�B�d�03��%`8�ަ/a�EfS���f����֢�8�P���Oz�S���܇��o���˯
e)�4��ȑ�ez�p�H�����P386�]�c���i�uҐZ��eb�Ǖ+ޭ�����Zp��e���LF� S�
}���̿380�lz|�Q�G��*H�tܼ���^עb��=r���c�qj�N	_p^���;�H�aaZ�5���g�+J��w��K�ٴ� ��A݇HJh�臅G7s�����쫌۽�w�|�O}p����<Lhp�8]��c��<n�ዃZ��E¿�C��
�_?O}���ܹoS��	C���&PD�{�j�"�|�r5����7��#gX.�X���7(Mv}�R�vR ;wk����BX�';�5	ɼ��>�dZ��^�,% ���Ç�p�j~��ͼ_��%6*J�P�z$K$�Ѝ��4#�@�nvC(4��#d�)��V����3�P��_���3��T�������>V����[����0��[�����Xu/�����{�Kq6�4����'����`
��:v[W�n_����t�[�t	�2D�T;�ӷ�t���8T�$����#2_H��x�!JXȲcp,��uV�ޥ�h�ڰ���7|�X!���1�	�ߣ9�4��95�>�+�c`���uS�w}U���r���4*)9XT��(؆��(�V�⫀:i�
)Ei��&Z�s����zhEO_�\�X=3�s_�&���^�T��}�W/��=��,��Z����H�>�*y!��!ڕq����Y�4"�:O�`�D�FC��9�P)=��-�JŤ5<.6;��c~T�J��+e�D$��u��s�j+Ƣ�f������U�P���ڜ��;8/�O!j�~�"�A�n@X�ی:��K�%.�Y4�4������b:���4�,O)bu�/\�E:���ܘ�U�46���
�|(�;��'Ïd,b\�M��OZu�7<�6�Xx�4�i�q�Ϳ���no�?3"��(�lV�ꖚ�K��ǒq�1��7������h��R��ހ���[�U������k�DgJ8Y|Z�1KY���_�����~�h�ԡJ[(�������=�)Y��Qq��U����fmd��U�V��檷��m҆�B��vP	%�r�={eӂ-g�Ƥ�:�r�$a�1��|������9[�����94>���8f&P����n�X�����y�;�y�����Ӣ��9._d��˧;�S���x\�)E��f��#�����n]�`��y�8��8�35�W� �'�'�����?i�+�JQ'��`.""�ѻ:E���׿��r�JQ�*GҦ�蕁��b�>�;�ڹ���r?_$`���3|00����¼����\ye��w���:�Uf��*Pw�0������(�%�1���ŏ���jE�y���1���rD��C]�m {m�M���R����.hxи�]����jY����L�]�z%φ�8���Y� ķY�&�>i"��9�)�q���Ʌ冗 !����9H��ց�TW$��,t�x���Q"+�fzӆ`�e�=��+�}���d�,(��<2�P4[��+�+2�����}���d���Ci�������������Ԭ�ˋ������Au�]},��K��H<Dk�O�׊`rN�MK�1��N��u~��e�u� �*fj���.K�p�-,�� Sa0	9TI�=N=��v�|�#�Eq���؞��;����j5�6��Uo�����kS���HN���%wMAD�[V�Hp��P��΋N�"���i����D�8��q��
0m%ZP_���݌#�X��>�S4�G�h;�T�)��ɜ]�-V�[ �?���~�@��e�ݤΛ�ɂ�|zT#���
�E|��z�m\����`�!�nvI�`Z���Xv�8�C$��7�?�%0hu��#�H�rW��ܘ�Ġ��J����K�?;xP6I�f�����9����>�U����4��F21P�`�Z �j>֘p0ڌ]�4�(,R�b���������ga빦�Ň
���?�B�������Z%z%��R�f~�In����&���WL^��cŠ�ޘ�O��5E�|��q����)R��_;a�s�~>�>\x���J*��k�4žƞ��9si��nͲ�Ɔг� �G�03�M�f��[Z��翰��9�'NͰp���(�~���
Ҭ��6�d8&�Ga��9X� ��.,��P���ۼgzN�}N��%���^�df�����l���=T`������m�f�̀ې��X���xtq,8�ηI����=�F�j������"=���XP] ��'��8Z��Z%)�i2&�QU+�b��We�Eخ^����U]z��vZ%�K�_s�v����Q|�Z����%F6k��+�ZQ���X�~�ED�.��+�?�+�,�*y�c��T2}1�܃]����_���I�T�N<t$�gR���e�(w��3��ݾOHa!�-]+tb���#u�2����B��Qt�%{����EC"�U��?�9�H��H/���m$i����M;U��Z����G�l�Y�W\� V�D��윓, ��p`�/b�&k ����XӢ��\�8?gp>'��,ޓ<�JS"��_�� /:7�9g�e�ޝ��=D�}�� m13o<�o��Q@y��$�4:%L�=c~�4֌�K�#^4���Q@5�^#�R��my~ BV��L
W+w�����$bMg⯕�8[�f�.�f����Q���ƀ)ܜ��Y64F�w��@�zu^�N��6�0^k���\M�f_[j�졯�qO�<���BW���*�ܰ�ڴ-*�T�؏ؔe{�=�am]���.K厸�%�������??��a,.l�z�݈���\x�l���hדb!�#��1�$��R�� -gm�1��K0���wUaf�E����~�P�A�Rm܊�.��h����U��lջ�/�eE�phhB)MF�ߴ"5�6�L�>a�jQ���%:&���e	S��(i�*�u���x�+�0����{���^��&��0'�ϭ/����s/Z��q;�)�.qZ�::��&+�G.�fmbH"�B&T��ܟy레��\m>=`"���a�y�h?1�<�E���p��da"Vlr��鐲�vZ@$%`�P�<�a�c�"�}E�Ӓ+�s���/��jI�J=.D9?�-���U�Ǔ�	םXӾ/�4�cbw���~d��Z��d;*M$����dۺ����뭶��G��ӭn�u�OV���������|��;a֊�b0��sh�/;`sp�ثP��#0��O+i��p�b�
�-����}����َ�qON�*F#��	^ ����o��c�����W��z0����n�Y5V-Z���w.c��ᰊ�����`
) u0�������jBM�C��+/�7G8 ��Iކs3�f������j��`�xpBQt�rc�WR9��d�*����������q�T����