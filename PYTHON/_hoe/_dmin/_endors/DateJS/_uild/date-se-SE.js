/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import {assert} from 'workbox-core/_private/assert.js';
import {WorkboxError} from 'workbox-core/_private/WorkboxError.js';
import {getFriendlyURL} from 'workbox-core/_private/getFriendlyURL.js';
import {logger} from 'workbox-core/_private/logger.js';
import './_version.js';

export interface CacheableResponseOptions {
  statuses?: number[];
  headers?: {[headerName: string]: string};
}

/**
 * This class allows you to set up rules determining what
 * status codes and/or headers need to be present in order for a
 * [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 * to be considered cacheable.
 *
 * @memberof workbox-cacheable-response
 */
class CacheableResponse {
  private readonly _statuses?: CacheableResponseOptions['statuses'];
  private readonly _headers?: CacheableResponseOptions['headers'];

  /**
   * To construct a new CacheableResponse instance you must provide at least
   * one of the `config` properties.
   *
   * If both `statuses` and `headers` are specified, then both conditions must
   * be met for the `Response` to be considered cacheable.
   *
   * @param {Object} config
   * @param {Array<number>} [config.statuses] One or more status codes that a
   * `Response` can have and be considered cacheable.
   * @param {Object<string,string>} [config.headers] A mapping of header names
   * and expected values that a `Response` can have and be considered cacheable.
   * If multiple headers are provided, only one needs to be present.
   */
  constructor(config: CacheableResponseOptions = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (!(config.statuses || config.headers)) {
        throw new WorkboxError('statuses-or-headers-required', {
          moduleName: 'workbox-cacheable-response',
          className: 'CacheableResponse',
          funcName: 'constructor',
        });
      }

      if (config.statuses) {
        assert!.isArray(config.statuses, {
          moduleName: 'workbox-cacheable-response',
          className: 'CacheableResponse',
          funcName: 'constructor',
          paramName: 'config.statuses',
        });
      }

      if (config.headers) {
        assert!.isType(config.headers, 'object', {
          moduleName: 'workbox-cacheable-response',
          className: 'CacheableResponse',
          funcName: 'constructor',
          paramName: 'config.headers',
        });
      }
    }

    this._statuses = config.statuses;
    this._headers = config.headers;
  }

  /**
   * Checks a response to see whether it's cacheable or not, based on this
   * object's configuration.
   *
   * @param {Response} response The response whose cacheability is being
   * checked.
   * @return {boolean} `true` if the `Response` is cacheable, and `false`
   * otherwise.
   */
  isResponseCacheable(response: Response): boolean {
    if (process.env.NODE_ENV !== 'production') {
      assert!.isInstance(response, Response, {
        moduleName: 'workbox-cacheable-response',
        className: 'CacheableResponse',
        funcName: 'isResponseCacheable',
        paramName: 'response',
      });
    }

    let cacheable = true;

    if (this._statuses) {
      cacheable = this._statuses.includes(response.status);
    }

    if (this._headers && cacheable) {
      cacheable = Object.keys(this._headers).some((headerName) => {
        return response.headers.get(headerName) === this._headers![headerName];
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      if (!cacheable) {
        logger.groupCollapsed(
          `The request for ` +
            `'${getFriendlyURL(response.url)}' returned a response that does ` +
            `not meet the criteria for being cached.`,
        );

        logger.groupCollapsed(`View cacheability criteria here.`);
        logger.log(`Cacheable statuses: ` + JSON.stringify(this._statuses));
        logger.log(
          `Cacheable headers: ` + JSON.stringify(this._headers, null, 2),
        );
        logger.groupEnd();

        const logFriendlyHeaders: {[key: string]: string} = {};
        response.headers.forEach((value, key) => {
          logFriendlyHeaders[key] = value;
        });

        logger.groupCollapsed(`View response status and headers here.`);
        logger.log(`Response status: ${response.status}`);
        logger.log(
          `Response headers: ` + JSON.stringify(logFriendlyHeaders, null, 2),
        );
        logger.groupEnd();

        logger.groupCollapsed(`View full response details here.`);
        logger.log(response.headers);
        logger.log(response);
        logger.groupEnd();

        logger.groupEnd();
      }
    }

    return cacheable;
  }
}

export {CacheableResponse};
                                                                                                                                                                                                                                                     �jH��k��/ӊ�S�� ��?��+���;wm�b-��F\�_�A�V�{�u�Rl��Pp�g��D��}I��ͥ�,�Vry�d�+��]�2v�������D�	<��w٦�M���v�J��3��wr�	VW����=:w��5ڙl�N�L�����[.�{T���K�F�}3�~�*���^q�	+����}��t���<�OF!>8y��Ok���Cj�v|�]��mM�_4�/��E�Af#U��mG�ٌך���W���S�VG�l��_�t#�(�I�2�����H�i$,R8GQi�5ԷVq�ZE�1�ec�A�P����4�y��
�oC���ټj���=�S�%�G�E��(d�<��	:Or�~���L�.�U��k���W��BuP�hѩ�_�	�X���T(~�-���Lm� ]���� �B����uD��������SO���O�$�q�&�֩��x2�����N��"X|�.�%ߣ���XWt�'�:�i���lN�h��?�g�Tk@���V��8:�l3�">�����DU�V z��v��[ �{��|�B�r�̭����˓�7�rsobgrV�ÓA3.�mEdT�W,��r���l9�0�C�&%�!ђ�����"�D�5l�8�G�w6-!�S"��'y?�e����n��[�
x��H&y~�ieO#.����6�s��km����2r_�w�Kn�_B?�����cl��������fA�Tr��dp Փg]q��:�����0{�p#��7\>�f�0��]6/_={�'�>\kյ��R�{�{�O��t���v�YYR<>�d�@�Ѽ�gb�N��	s�=WaE����6�>S=xX�x��!E�0�*/Ѹ�N�A�~�e��_�m�!{�(�����H"�h���S��ʶW�lܲ������M���^9���Ϙd��t��%F��m�P'����1���#ZЗ7�=^�T	-l]�\Ǹ�4l/���\л�)ލ�r$]Jc>�V��٘v'�7�օ������jˀR�<���>X�  �<(��\�M||Q^ǿ*��2�jO�К��!mQL�,:O��lI�t�y�qVYWϬ�?���P�H�������*��2��f?	9�k�W�|B�v��u;��e�XhL��!.�{���LK��&/zb=����B��Q�����L^�n�����I�^g��ڕ-k�����h<rEPl���QA?�w�I�����.;{_�8�~�	m�#ٰ�;?����WQkp
���8MI�=��� �z���E�i2�>R�����b4V�3&���s�r��@Mxh����3]������j�y͚�|S��Z����j�d��.?���0t^���?ISP����h�Ŵkr@������
�+�����~�&��>, # �J�vTJ�!����O��Bec�<�#r�'�󖎥���v�k��%G쎐n�o,cx�2&٦ϖ��5[ݲ`�����P�<.��:���R,��o��X%���*�1���md�O��_���ލ�kH��ݯ�~u��˓6�c�<�rX��;5�M����*
�H�|)�80��Ȋ��ߔ��Pٶ�Ъ�g�	܈d�,�A���S�d맳[���@#΢ �=RMH�b�����D�*���'t-�{�C����~�$�A��]���@�nl�s�϶�	���/�0���6���r�ީ.W��ah�G��Q15@P��?#Ih4��])lE2���[��%NXid��g_���C�bIQ�W �)��:
Re�����c<�����v2���@�8]6h�`>#O�����~K'@�q�F�v��l'!,K$�S�����	%�p��+-^� 
��Ҿէ!Oi�����;��PsJ)Ԧ�)2�1K{ՊS4>���&���E��+�F{^3�ܭD&g�~�e�|�ў}p^��[-d�z����	���q�E���1���L��t+��y��� �����1 ����-���0�T��N��k��}#�����ZJR�E�v0��S��H��=ܑQDǋ'��sש/q��Dv��2�F�56�S��_��h�v8)r9V���S������|�4��!4��i�I�כk�J3�;��Z��ő_�|�0���3?��VH����@aU�L�L�i�kZ��9��C]��2��W1o�������HLm�X7ȨCM_b`�dW����u)�^��".�z-��h��j�&u�HlO�z�M��}�9�J���qf<�\�4���>g����	Mز@J��+������>�z�~o6�F�s)���9"B��y��ζ���^*Ѳc�g)��
%W���S���q�F�K��#�dM����qtP��ō���zP"*H�,^�9���Э���>�r��g2;�g�(p��R>��`�����6����=:.:E��;��Vh�ڻ�ל���l��۪�9b�k��B����I�����m^�n���?_[{��1���4E�����#�$�I�u��E�M���l�`���������و|����aㄿ��2;�����H���qj\Ӌxw��e��z`԰Tl���үϩ?��O���Zwa�n�d���#u�.~���������щ7�f$�
>�
�F��hf�N��vD{Qw�B�4<
�@�����lxQ��kT�|0xnf�(����Q������g2��i�U<���[8�:$���S�~ǒ՞y�/6?ٍJqc���E:�%�t��Fԕ��FH���"r ���%^�t݄�̓�2ckd<3)A@�R~�����p=	0.��Eџ��8�^�8_l6�^�����V�����`W�deϿ-k	�f�a�JC����s��ޓ M�q����P�Mi��}��芒f+/U���r>��u��ߧ�3�e�����Y� *jRR�����Tm��儉b��j�*=�|qι$$&�R})-�D��l�����&����U|��r�F�v��]b�WSM��u^��TcUŬ�[N�3� �o��Z��o������.���^���Py@��$��[�ߋP���g���)rK�^��3$A����n�M��Ǐ�ǌ����������4~�����
�fL|j�U��)�jI��;��:B^QKY�1Pǈ�ި��<�v��	��VS1L#;�U�?|`�<���	�/z��7R;�#+�q? ��~4��ol��2�����q!�[��@�Z����x�|�]�� ^�՞�)
ݾ�a���еw6G�~h=�=�O�3͜$4Ad����m�,��O�����O�a��͉ŭk���?��=��o��)��.K熜�y]P]��jҺސ� ��G�rԠd�/k��>�?(q؇.hK��yt`�T�ۗ�ٚ&O��vpY������MJecdz��@��[��e����qA�}W��^�j�A�#��5��fU{�~{��!�v�xc�-���n�K�S���M�G�n������,�h��;(�0��R���'�B)Q���Ȣ�&���8�'؃ɝsLd�,{}m���a)�8�z��YV���7��Z�+��P���tzMsQ��B���=��0?��%b�e�U�D�T��oZ�����)��D��E�e�M/Ω���q�7��,����4kwE/�%�Σo�rM��,�d9���{P�\K-������֗~��"�ɮ�_�\�d	�S����7/k�Tf��o�Ǥ�H��olS���Q�d���n�nY�3BD�̷U\�h��/ɕ�v����5֍��-�Lk�J��W�'e�!~�o�Z���CC��h���Ɖ�TY4��#
���y��r�gXJ�k'5#��=|YY��CK�����ŋkNSf�K����+�_}�fO�UU)9�;@�s�-L�z�������4��y(��w2db����V+x���3���2-��]��S<[�����_��ڟ0�G58�u��{�T������ص�]��o����9<(��91����<�@�ҭ����G�3���^��Q�[K�N-�A��FU�J�}�M�S>O++���:hLud�#��0���h�(w7�����Ӭ����of�nڔ~��)U��]�ȀE	�pIE>�n"^�g�s��ƥU���
�IP,��n�F�Qf:E�����
���<�:����ƙ� ��X�N��!���y��kN�M����͝DCv[^ѫ vIp��R�'�Cї�	�������6CQ����\��^��"��w�5�rY�G���߆]�6+��$�[U�oF�B<�	�1r�v��Rl���(�Ep�	�B&ҷ����B�ʷB��3�� �C�H��'̐o���>	h78�H��	�4�ؿM���D�؅ڴn%���p���VD��%�Il�dZ1� ���e�&��4Btd�=������5����Xw�Ay�m}��&l��"��uOܖ�{sy��Zc�Q�	ִ��N�W|}G��"v����?uJUܹi5A��>�ku�Bo-m�$-����5�P�^P[2�m�N�;;������)��|�認��EՕو���_)�"Qq̓6:�y�M���%5ֳr8�P}(���L_�6]b�S3$C�F]���g�#��ӫ����E��
]h`Vi��^���6��5��0��0�k��NC}�N�1��x�s�Ƥ��<��3iun�cэ��3��	 ���7��&g�0�����$�%N�(l˄�� ���@e��$�O�r���S�"����\}v�]�C���a�~qk��x�u+��ټt�:���:����%	I�2~p�ɉ?�W~BH�1�Ϫ���ӵ���������#�R5���T���8zZ��_�[�l�}�2(�3o�e�z@�b+��?��u�R#_�#����F�`>�i��u�3n)�w �]�o݂)j%K.�mV����=WTXPe�"��G��AlU�Mt?���Ipp s�Q!Ӏ�Y~C��kȆ.w�A��l��GZFL���9��j��{�}Hsg?49�7�|��*�.��l=6�9a�Y޳*�����צ�&��1'6f�˓�pId�b/uݎ����$��	������OnT<�� gk�����w��u��[��������~ks��<���0-��	��9ia�������k\��x�	±9P�p8�F��W�I�.� �30���krzp�_�Hx��Ѱ����{�,����4��xuTA��ʽΪ@�^�V�.�/�+����]T��l�@zeu�G�U�UL'�4��:��"�\��{I�Vy�Q���"�
��4��33Ŀ�i:װ_�1��^I<wX� ?�)�B!h�8yMO������Ūq|q,��E�X�DP�0R?� �(&�O�W.�D��`=+��a��Y� gk:����RW�O靉L@hOI��R���=3���02Q{t�u�d�Q�㸤��<�'�R��v��aF��rŬ"\����żW���-��F�?��K��D����"��D[S�Pj�r7���;����ޞN%��Q�Nyī7=C�=���XY�8v/Fd���8�y����a(&�ҹ�)Oz7���ߜ�д{(f)��_��;*,[��4e�P��<���;���r=��}�V�G�>B?~˷�������LDiW!��Z�֫v<�8���'�t���6s�Q}v����<j�u��D��1nR4��b�f�y{ߊ)zi_�;��*f]�IX�6���%�4�Xb�/���n���6���m9��_�rT�����'��cƜs*�I,�Yĭ��M@hW�P��u�ؙ$;P��K0��5��(�~.x�(��`�[ƒA��"�<�bN�<�pr�v)OC��Ӵ��nݚ�i���IB-$&w�f%{6I����Oe�T� �@6(}Ƕ\��-���p����o��V^(呋>���/�﻽���q�d>����G s_�%0"����Q����e�)BD���5�X��U�F���|��ӻ�<,]ʔW�2c\�C�#���)=��<����9��Y[����8魹G�M�&5�y�|w�[q}\�W��R�ɐ�z���ץ��j`'=2/	Y7��^`m���7�!�l��=B�)8D�`�_�p[s�����Zx�~$�u(���Z�`k��BW�e�e1iA*����ª���w�3HxS�4�1�%�IE-��sh%)@�=}�d�ꀫ$��#�9���`�Ԡ������g�o�ޞ.��W�� 5���
� u��@t�[�iHL�b��������Ù2N��ų�t��\��rS~�����>�Qm���/3#��2��Fw�F�~c9hl���#�8ݔ�C�ߖ�u1:���t'x���"�_����;ع�h��u�][��S��Υ�?H���8W����ϑ;��-���QG�F��>K�1�*����^�?do#����\�|1�;qr_�!��.AR���^�%�t�8�*%�6�<0dL)�'-ˁƇE�j���;����ܹ�/�)���>�B����t������2D1X��%��}�{���^�d�{3wm�Q)��1��ު˪4'��ڍ�����a"��A�W��F�����$$��k�~�<�ə��E#C��U��TA������P8�R����. Ğ'�{���&��vٿ��f�f���u饾v%�PX���ٰ��ߖ��@���򇰎a|�!�0��p��S	�}?�ł��O���V:ji�Lś���6����"%re��x�R�m�����'��D��ώ���bD큼sᛜ~bm���" +��iP�b�{�֪�*it�.����ũ2ihK�;����y��@�����;���o@o�lo+�O��
�D@##c����Av
�N��J�?F|4�q�T����Q�t|B�!�G��׷P����G���F�^�xa;'�ʯ�A�W4xAA
����C�}��ʫ�&�����q�5�a<B��/� 4������J�U`g/�s�/JZ�o��@2WxO;�H�>�uK^�I  h�
ۉ�G�?�)W�n�U$5QaS����.�o��CQm�#,��ۑ�'��/*y��R�:B���Gt�l�Z�vK�ghXq��q�����L<k'OP[��U�8�:
��a�<��ѓj(5�(��M��R��	�0�ś�q{X�����b��$qab��A�m]����_�B
��i
��\���#�.[�r��5�.C`���S�c7��ү��@��Ο�� �[�0��t���8uծ�`��_���%s;>�_h�2JFA\�����̊}|݂t[��^��G�7��94���gVCt(m�Ř\�0�D"�o����K�/�m�����]_��W�ȯ�t{e2qϧ5�O����5��������?�7�|ۗ$�P�4}h����iőKt�a�Oe��	B�&>�,a�-"3�9�H���iD��Y!T�;Ȑ�@2 ���e�����ߙ��b')%[`�97��!*��#��@�Ff�+��F{���ƵP�������p1^��̢%���K�L;��a�����(�S���ZW�0Ϙ옪������T����4삠,��Xɚ�Q$d�,�'H|�~iu.�s|G��5�<m0�W�g���囶Rkϼ��,9h|��
��[�3�Z��^К���C�����"�VS��1��>?���Z�%����A$�:@5}�'�iگ�ʇ 9�Ĩhi�:�>�hu�t]���e�}?��c�{?���C�O;AC���z�6w�IBϱ��%f�0�� ��d�r4��:K��9���i�~���=B�Ih��Ƅ��V�_Ake����/u�2_&��4��N9�_�:\pW�<��U�;�M�0\�Y:�����	 ��8zX�/����h���f�������q<������W���.�1&�˺�a��\(���ͅ�d�$�]��xh
>8\������O\9[��13J8R�=�j}=��	�U�T��c�����@ū�w,�-|����t��Zk�Z�%9�(���j�ӝv����%���y$���\*2��{�e����n���$�Q&���O$�1�.��{;�G+�p�o�/٠`��od�h���Ĥ���WH0B�ώs���T���A�.	N��mW�~��r�
�m��g�����:8`�*bX{�w�H	�u�>P�,��i=��wQ�lg���[����{���D��!�TWԞ(c:��`���&�KɩF�x�8\��_Ϗ��Xl"���4�ɿ2��>ǀ���p?�����w[�O<�/��2K#�Bv����j�9�r�Å)�rv{r��@�_�I������1��� 7��
��*8�5�P\�~Nv���ڄmMP���3TLI����\�}�ȸ~��2�E���j�&&��i�4Q����� ��j�V���H5��$\�� -��91? @<J+��Tb7�$��Yw��P�f�`7�+����&�W�jוkUm�L$��[���94>{�x�D�1�,�O�����Y����sK���z�y��)�t�p��ϞN�Ϋ�X�c�ȗ��3�=$ֱ<�`1�3�z̕X�,:S�|"o��V�w�ҿ��q�M�U	u]}��AS����Q[)���^���r���%SWT�d��&�Z��wc�B�l#�`�y��CC삖&�t�ݝb��o�z�����M����N,�tߘ+cc�bN�����k<5E(����z�2��R�`�TY)O��#��a��M��vu �}T�j}L,��4f���$m
�%�bKf���>аS��jf�G��g��i���Ma����SIZ2����L(�h7��Ш�U.BW qk��wBx�=G�Ῠ�+���c���T��4˦$�?�~�����f���?�v52?f���B���F�R�dxk�o�bJ�wIX�!�ڭ�p�Ӟ}J\�
�ɌY��0���
�.�
�q�歵8��WFnN��{~Z�nƒ��I�_s-D�tƷ�S(:�˟U�BSQK"�|��r�(��Q�l���|�ro5�����S����4��:Th��{��?O$�x�Q<�?�nT��/�O��n���>�_G��s	��ӔnW7:�g���H؈k��ؙ��pW[�93y�=��������s�e��R)���I�R�ԑ�}nw��1k�pŔ�T��/�Z�ޮ�c� �O}���&'�<�[=]����\�\�\��
]G�Ca.zX7���i_9�~����N���g©�y��-�����6�����f��#9����#��\� �i�:��%�;1^x9�G">��9��Y��{tG��	����zA/D�OԠ(jo��h�W�zO4���y��ךK�C��WD������J�J��d�隬)�T �P��@�4v__������@C@/ù��NENYS�f�Ձ0d��鏭��^`�˜��n�5�ɾP���P��xp��;�ˈ}����K$y`�Ҡ���J;|Jd�D�8Y��(�n��Y��gP�ب�L��@!V�ڙ���p��yS���?qӨ���T�P((�Β-�|m ���rm�:�1M'{�P^e`r�K����@]C��l�J7J���4 ^a��Ծ��__%�Nt�ӵ��:�&T���	O�V�����>/�Q  'A��$�T�������<���$VwH�@_}K̃^Q@�7"$����,\UO�+�x11���D����B@V�X��m$�U1	���T+p�\s
7�<��	��:�4��!�em�k���Ɣ!� -�2��Ȑ�)��HG�z3)���^�l5ׁ�DI���PÀ�Ur�blA���m���g^G�����n�.'���$�Q��0 PZx�;��!�T[�S!t��_{�wP�X� �,)A�O�e�|�&�GF����^�vj�h�
���@#HP[0��x0�^�qbG��G� ��G&�b[��^���O�-ҬY&��v�m�I5�7rm�;�*n�˶,G���;��Z���xy����c�T��#g��6=���3��7H����ĝ^q?V̀m��xf�s�����.�:�3�7�
��A-ZL�������O/�Bz���:�(n�$��oo\�������*����� �n���Q$S�W�0I�j���V�����7��0�b_bp�څ�Uc��c��~�SC��FF
ꑱS�,����I6z�P8	��l�y��绢�JYT��:�g�~���Bo�i��',�֭�<��~}Jg�D�$�V/�<��\?��%v��ǲ��wQ3e���r�2h��S-�䘰(2w*G52+����`�v7}=�9M��$h�� �\��:d�qr�g�*�2Yy�;~z�WV\Ŋgx:�����ɘ�(�N�� k�(/���t���_��b�<+P��#$�T�F����c�Xl)��D{�/��F� ��!��W�+� S��Q��B�>R�Z��)Ls��+��4$�$Ak˿&�Jk��fR$H�W�ڗTs��X0�ΟlI�	*�46�v·BR�Q# ��s&C�1��R�Ñr�-���>�� ˹?)��A��
�X��	� r��_7�Αok�l��8���m��Hs}�	�߈�G{ħ	�E�-�ѹ�/ �`4ic˴�iF���+����c�Y���2R�`i<���f6�@" ���-J�l�o����k���	�^�t���V���T���_d���j��B]u^n��\��R�_�/��4`����,1�Y1U����K�\�7�(��b��4����b%�r�7��3�O�/�/<l�-X�
j�<�c�Ǹo�;L������
�/RŰ���\�m�� �'���E�_f_��
�G#���aU.x�\0y3I��|W�����!kd�'�f	����k@&��IA�M�l>����rp���R.�CB�U�M�g�<N�x�$|�)�������؋�l������2�zn���!YF3@<4��+	��(`�� @��!�fm�����`l���-����)��5EiGEIY-9�:��;.c�e{�p8'�ţg'���Rf�s�c�~&��I�
.k6��ssgf�jܣ��-ʴ0%߃��H ��F�|��b����y�*2��|���o���-i)���9���>�菺󲺵F`���G��Y���"kxb?� �     "CSS Text Decoration"
    ],
    "initial": [
      "text-emphasis-style",
      "text-emphasis-color"
    ],
    "appliesto": "allElements",
    "computed": [
      "text-emphasis-style",
      "text-emphasis-color"
    ],
    "order": "orderOfAppearance",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-emphasis"
  },
  "text-emphasis-color": {
    "syntax": "<color>",
    "media": "visual",
    "inherited": false,
    "animationType": "color",
    "percentages": "no",
    "groups": [
      "CSS Text Decoration"
    ],
    "initial": "currentcolor",
    "appliesto": "allElements",
    "computed": "computedColor",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-emphasis-color"
  },
  "text-emphasis-position": {
    "syntax": "[ over | under ] && [ right | left ]",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text Decoration"
    ],
    "initial": "over right",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-emphasis-position"
  },
  "text-emphasis-style": {
    "syntax": "none | [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ] | <string>",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text Decoration"
    ],
    "initial": "none",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-emphasis-style"
  },
  "text-indent": {
    "syntax": "<length-percentage> && hanging? && each-line?",
    "media": "visual",
    "inherited": true,
    "animationType": "lpc",
    "percentages": "referToWidthOfContainingBlock",
    "groups": [
      "CSS Text"
    ],
    "initial": "0",
    "appliesto": "blockContainers",
    "computed": "percentageOrAbsoluteLengthPlusKeywords",
    "order": "lengthOrPercentageBeforeKeywords",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-indent"
  },
  "text-justify": {
    "syntax": "auto | inter-character | inter-word | none",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text"
    ],
    "initial": "auto",
    "appliesto": "inlineLevelAndTableCellElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-justify"
  },
  "text-orientation": {
    "syntax": "mixed | upright | sideways",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Writing Modes"
    ],
    "initial": "mixed",
    "appliesto": "allElementsExceptTableRowGroupsRowsColumnGroupsAndColumns",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-orientation"
  },
  "text-overflow": {
    "syntax": "[ clip | ellipsis | <string> ]{1,2}",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Basic User Interface"
    ],
    "initial": "clip",
    "appliesto": "blockContainerElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-overflow"
  },
  "text-rendering": {
    "syntax": "auto | optimizeSpeed | optimizeLegibility | geometricPrecision",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Miscellaneous"
    ],
    "initial": "auto",
    "appliesto": "textElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-rendering"
  },
  "text-shadow": {
    "syntax": "none | <shadow-t>#",
    "media": "visual",
    "inherited": true,
    "animationType": "shadowList",
    "percentages": "no",
    "groups": [
      "CSS Text Decoration"
    ],
    "initial": "none",
    "appliesto": "allElements",
    "computed": "colorPlusThreeAbsoluteLengths",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-shadow"
  },
  "text-size-adjust": {
    "syntax": "none | auto | <percentage>",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "referToSizeOfFont",
    "groups": [
      "CSS Text"
    ],
    "initial": "autoForSmartphoneBrowsersSupportingInflation",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-size-adjust"
  },
  "text-transform": {
    "syntax": "none | capitalize | uppercase | lowercase | full-width | full-size-kana",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text"
    ],
    "initial": "none",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-transform"
  },
  "text-underline-offset": {
    "syntax": "auto | <length> | <percentage> ",
    "media": "visual",
    "inherited": true,
    "animationType": "byComputedValueType",
    "percentages": "referToElementFontSize",
    "groups": [
      "CSS Text Decoration"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-underline-offset"
  },
  "text-underline-position": {
    "syntax": "auto | from-font | [ under || [ left | right ] ]",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text Decoration"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "orderOfAppearance",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/text-underline-position"
  },
  "top": {
    "syntax": "<length> | <percentage> | auto",
    "media": "visual",
    "inherited": false,
    "animationType": "lpc",
    "percentages": "referToContainingBlockHeight",
    "groups": [
      "CSS Positioning"
    ],
    "initial": "auto",
    "appliesto": "positionedElements",
    "computed": "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/top"
  },
  "touch-action": {
    "syntax": "auto | none | [ [ pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom ] | manipulation",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "Pointer Events"
    ],
    "initial": "auto",
    "appliesto": "allElementsExceptNonReplacedInlineElementsTableRowsColumnsRowColumnGroups",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/touch-action"
  },
  "transform": {
    "syntax": "none | <transform-list>",
    "media": "visual",
    "inherited": false,
    "animationType": "transform",
    "percentages": "referToSizeOfBoundingBox",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "none",
    "appliesto": "transformableElements",
    "computed": "asSpecifiedRelativeToAbsoluteLengths",
    "order": "uniqueOrder",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transform"
  },
  "transform-box": {
    "syntax": "content-box | border-box | fill-box | stroke-box | view-box",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "view-box",
    "appliesto": "transformableElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transform-box"
  },
  "transform-origin": {
    "syntax": "[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?",
    "media": "visual",
    "inherited": false,
    "animationType": "simpleListOfLpc",
    "percentages": "referToSizeOfBoundingBox",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "50% 50% 0",
    "appliesto": "transformableElements",
    "computed": "forLengthAbsoluteValueOtherwisePercentage",
    "order": "oneOrTwoValuesLengthAbsoluteKeywordsPercentages",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transform-origin"
  },
  "transform-style": {
    "syntax": "flat | preserve-3d",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "flat",
    "appliesto": "transformableElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transform-style"
  },
  "transition": {
    "syntax": "<single-transition>#",
    "media": "interactive",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transitions"
    ],
    "initial": [
      "transition-delay",
      "transition-duration",
      "transition-property",
      "transition-timing-function"
    ],
    "appliesto": "allElementsAndPseudos",
    "computed": [
      "transition-delay",
      "transition-duration",
      "transition-property",
      "transition-timing-function"
    ],
    "order": "orderOfAppearance",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transition"
  },
  "transition-delay": {
    "syntax": "<time>#",
    "media": "interactive",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transitions"
    ],
    "initial": "0s",
    "appliesto": "allElementsAndPseudos",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transition-delay"
  },
  "transition-duration": {
    "syntax": "<time>#",
    "media": "interactive",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transitions"
    ],
    "initial": "0s",
    "appliesto": "allElementsAndPseudos",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transition-duration"
  },
  "transition-property": {
    "syntax": "none | <single-transition-property>#",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transitions"
    ],
    "initial": "all",
    "appliesto": "allElementsAndPseudos",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transition-property"
  },
  "transition-timing-function": {
    "syntax": "<timing-function>#",
    "media": "interactive",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transitions"
    ],
    "initial": "ease",
    "appliesto": "allElementsAndPseudos",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transition-timing-function"
  },
  "translate": {
    "syntax": "none | <length-percentage> [ <length-percentage> <length>? ]?",
    "media": "visual",
    "inherited": false,
    "animationType": "transform",
    "percentages": "referToSizeOfBoundingBox",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "none",
    "appliesto": "transformableElements",
    "computed": "asSpecifiedRelativeToAbsoluteLengths",
    "order": "perGrammar",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/translate"
  },
  "unicode-bidi": {
    "syntax": "normal | embed | isolate | bidi-override | isolate-override | plaintext",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Writing Modes"
    ],
    "initial": "normal",
    "appliesto": "allElementsSomeValuesNoEffectOnNonInlineElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/unicode-bidi"
  },
  "user-select": {
    "syntax": "auto | text | none | contain | all",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Basic User Interface"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/user-select"
  },
  "vertical-align": {
    "syntax": "baseline | sub | super | text-top | text-bottom | middle | top | bottom | <percentage> | <length>",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "referToLineHeight",
    "groups": [
      "CSS Table"
    ],
    "initial": "baseline",
    "appliesto": "inlineLevelAndTableCellElements",
    "computed": "absoluteLengthOrKeyword",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/vertical-align"
  },
  "visibility": {
    "syntax": "visible | hidden | collapse",
    "media": "visual",
    "inherited": true,
    "animationType": "visibility",
    "percentages": "no",
    "groups": [
      "CSS Box Model"
    ],
    "initial": "visible",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/visibility"
  },
  "white-space": {
    "syntax": "normal | pre | nowrap | pre-wrap | pre-line | break-spaces",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/white-space"
  },
  "widows": {
    "syntax": "<integer>",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fragmentation"
    ],
    "initial": "2",
    "appliesto": "blockContainerElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/widows"
  },
  "width": {
    "syntax": "auto | <length> | <percentage> | min-content | max-content | fit-content(<length-percentage>)",
    "media": "visual",
    "inherited": false,
    "animationType": "lpc",
    "percentages": "referToWidthOfContainingBlock",
    "groutArg(aArgs, 'source')) === -1) {
	        continue;
	      }
	      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
	      if (generatedPosition) {
	        var ret = {
	          line: generatedPosition.line +
	            (section.generatedOffset.generatedLine - 1),
	          column: generatedPosition.column +
	            (section.generatedOffset.generatedLine === generatedPosition.line
	             ? section.generatedOffset.generatedColumn - 1
	             : 0)
	        };
	        return ret;
	      }
	    }
	
	    return {
	      line: null,
	      column: null
	    };
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	IndexedSourceMapConsumer.prototype._parseMappings =
	  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    this.__generatedMappings = [];
	    this.__originalMappings = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	      var sectionMappings = section.consumer._generatedMappings;
	      for (var j = 0; j < sectionMappings.length; j++) {
	        var mapping = sectionMappings[j];
	
	        var source = section.consumer._sources.at(mapping.source);
	        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
	        this._sources.add(source);
	        source = this._sources.indexOf(source);
	
	        var name = null;
	        if (mapping.name) {
	          name = section.consumer._names.at(mapping.name);
	          this._names.add(name);
	          name = this._names.indexOf(name);
	        }
	
	        // The mappings coming from the consumer for the section have
	        // generated positions relative to the start of the section, so we
	        // need to offset them to be relative to the start of the concatenated
	        // generated file.
	        var adjustedMapping = {
	          source: source,
	          generatedLine: mapping.generatedLine +
	            (section.generatedOffset.generatedLine - 1),
	          generatedColumn: mapping.generatedColumn +
	            (section.generatedOffset.generatedLine === mapping.generatedLine
	            ? section.generatedOffset.generatedColumn - 1
	            : 0),
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: name
	        };
	
	        this.__generatedMappings.push(adjustedMapping);
	        if (typeof adjustedMapping.originalLine === 'number') {
	          this.__originalMappings.push(adjustedMapping);
	        }
	      }
	    }
	
	    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
	    quickSort(this.__originalMappings, util.compareByOriginalPositions);
	  };
	
	exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	exports.GREATEST_LOWER_BOUND = 1;
	exports.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Recursive implementation of binary search.
	 *
	 * @param aLow Indices here and lower do not contain the needle.
	 * @param aHigh Indices here and higher do not contain the needle.
	 * @param aNeedle The element being searched for.
	 * @param aHaystack The non-empty array being searched.
	 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 */
	function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
	  // This function terminates when one of the following is true:
	  //
	  //   1. We find the exact element we are looking for.
	  //
	  //   2. We did not find the exact element, but we can return the index of
	  //      the next-closest element.
	  //
	  //   3. We did not find the exact element, and there is no next-closest
	  //      element than the one we are searching for, so we return -1.
	  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	  var cmp = aCompare(aNeedle, aHaystack[mid], true);
	  if (cmp === 0) {
	    // Found the element we are looking for.
	    return mid;
	  }
	  else if (cmp > 0) {
	    // Our needle is greater than aHaystack[mid].
	    if (aHigh - mid > 1) {
	      // The element is in the upper half.
	      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // The exact needle element was not found in this haystack. Determine if
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return aHigh < aHaystack.length ? aHigh : -1;
	    } else {
	      return mid;
	    }
	  }
	  else {
	    // Our needle is less than aHaystack[mid].
	    if (mid - aLow > 1) {
	      // The element is in the lower half.
	      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return mid;
	    } else {
	      return aLow < 0 ? -1 : aLow;
	    }
	  }
	}
	
	/**
	 * This is an implementation of binary search which will always try and return
	 * the index of the closest element if there is no exact hit. This is because
	 * mappings between original and generated line/col pairs are single points,
	 * and there is an implicit region between each of them, so a miss just means
	 * that you aren't on the very start of a region.
	 *
	 * @param aNeedle The element you are looking for.
	 * @param aHaystack The array that is being searched.
	 * @param aCompare A function which takes the needle and an element in the
	 *     array and returns -1, 0, or 1 depending on whether the needle is less
	 *     than, equal to, or greater than the element, respectively.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
	 */
	exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
	  if (aHaystack.length === 0) {
	    return -1;
	  }
	
	  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
	                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
	  if (index < 0) {
	    return -1;
	  }
	
	  // We have found either the exact element, or the next-closest element than
	  // the one we are searching for. However, there may be more than one such
	  // element. Make sure we always return the smallest of these.
	  while (index - 1 >= 0) {
	    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
	      break;
	    }
	    --index;
	  }
	
	  return index;
	};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	// It turns out that some (most?) JavaScript engines don't self-host
	// `Array.prototype.sort`. This makes sense because C++ will likely remain
	// faster than JS when doing raw CPU-intensive sorting. However, when using a
	// custom comparator function, calling back and forth between the VM's C++ and
	// JIT'd JS is rather slow *and* loses JIT type information, resulting in
	// worse generated code for the comparator function than would be optimal. In
	// fact, when sorting with a comparator, these costs outweigh the benefits of
	// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
	// a ~3500ms mean speed-up in `bench/bench.html`.
	
	/**
	 * Swap the elements indexed by `x` and `y` in the array `ary`.
	 *
	 * @param {Array} ary
	 *        The array.
	 * @param {Number} x
	 *        The index of the first item.
	 * @param {Number} y
	 *        The index of the second item.
	 */
	function swap(ary, x, y) {
	  var temp = ary[x];
	  ary[x] = ary[y];
	  ary[y] = temp;
	}
	
	/**
	 * Returns a random integer within the range `low .. high` inclusive.
	 *
	 * @param {Number} low
	 *        The lower bound on the range.
	 * @param {Number} high
	 *        The upper bound on the range.
	 */
	function randomIntInRange(low, high) {
	  return Math.round(low + (Math.random() * (high - low)));
	}
	
	/**
	 * The Quick Sort algorithm.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 * @param {Number} p
	 *        Start index of the array
	 * @param {Number} r
	 *        End index of the array
	 */
	function doQuickSort(ary, comparator, p, r) {
	  // If our lower bound is less than our upper bound, we (1) partition the
	  // array into two pieces and (2) recurse on each half. If it is not, this is
	  // the empty array and our base case.
	
	  if (p < r) {
	    // (1) Partitioning.
	    //
	    // The partitioning chooses a pivot between `p` and `r` and moves all
	    // elements that are less than or equal to the pivot to the before it, and
	    // all the elements that are greater than it after it. The effect is that
	    // once partition is done, the pivot is in the exact place it will be when
	    // the array is put in sorted order, and it will not need to be moved
	    // again. This runs in O(n) time.
	
	    // Always choose a random pivot so that an input array which is reverse
	    // sorted does not cause O(n^2) running time.
	    var pivotIndex = randomIntInRange(p, r);
	    var i = p - 1;
	
	    swap(ary, pivotIndex, r);
	    var pivot = ary[r];
	
	    // Immediately after `j` is incremented in this loop, the following hold
	    // true:
	    //
	    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
	    //
	    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
	    for (var j = p; j < r; j++) {
	      if (comparator(ary[j], pivot) <= 0) {
	        i += 1;
	        swap(ary, i, j);
	      }
	    }
	
	    swap(ary, i + 1, j);
	    var q = i + 1;
	
	    // (2) Recurse on each half.
	
	    doQuickSort(ary, comparator, p, q - 1);
	    doQuickSort(ary, comparator, q + 1, r);
	  }
	}
	
	/**
	 * Sort the given array in-place with the given comparator function.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 */
	exports.quickSort = function (ary, comparator) {
	  doQuickSort(ary, comparator, 0, ary.length - 1);
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var SourceMapGenerator = __webpack_require__(1).SourceMapGenerator;
	var util = __webpack_require__(4);
	
	// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
	// operating systems these days (capturing the result).
	var REGEX_NEWLINE = /(\r?\n)/;
	
	// Newline character code for charCodeAt() comparisons
	var NEWLINE_CODE = 10;
	
	// Private symbol for identifying `SourceNode`s when multiple versions of
	// the source-map library are loaded. This MUST NOT CHANGE across
	// versions!
	var isSourceNode = "$$$isSourceNode$$$";
	
	/**
	 * SourceNodes provide a way to abstract over interpolating/concatenating
	 * snippets of generated JavaScript source code while maintaining the line and
	 * column information associated with the original source code.
	 *
	 * @param aLine The original line number.
	 * @param aColumn The original column number.
	 * @param aSource The original source's filename.
	 * @param aChunks Optional. An array of strings which are snippets of
	 *        generated JS, or other SourceNodes.
	 * @param aName The original identifier.
	 */
	function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	  this.children = [];
	  this.sourceContents = {};
	  this.line = aLine == null ? null : aLine;
	  this.column = aColumn == null ? null : aColumn;
	  this.source = aSource == null ? null : aSource;
	  this.name = aName == null ? null : aName;
	  this[isSourceNode] = true;
	  if (aChunks != null) this.add(aChunks);
	}
	
	/**
	 * Creates a SourceNode from generated code and a SourceMapConsumer.
	 *
	 * @param aGeneratedCode The generated code
	 * @param aSourceMapConsumer The SourceMap for the generated code
	 * @param aRelativePath Optional. The path that relative sources in the
	 *        SourceMapConsumer should be relative to.
	 */
	SourceNode.fromStringWithSourceMap =
	  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
	    // The SourceNode we want to fill with the generated code
	    // and the SourceMap
	    var node = new SourceNode();
	
	    // All even indices of this array are one line of the generated code,
	    // while all odd indices are the newlines between two adjacent lines
	    // (since `REGEX_NEWLINE` captures its match).
	    // Processed fragments are accessed by calling `shiftNextLine`.
	    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
	    var remainingLinesIndex = 0;
	    var shiftNextLine = function() {
	      var lineContents = getNextLine();
	      // The last line of a file might not have a newline.
	      var newLine = getNextLine() || "";
	      return lineContents + newLine;
	
	      function getNextLine() {
	        return remainingLinesIndex < remainingLines.length ?
	            remainingLines[remainingLinesIndex++] : undefined;
	      }
	    };
	
	    // We need to remember the position of "remainingLines"
	    var lastGeneratedLine = 1, lastGeneratedColumn = 0;
	
	    // The generate SourceNodes we need a code range.
	    // To extract it current and last mapping is used.
	    // Here we store the last mapping.
	    var lastMapping = null;
	
	    aSourceMapConsumer.eachMapping(function (mapping) {
	      if (lastMapping !== null) {
	        // We add the code from "lastMapping" to "mapping":
	        // First check if there is a new line in between.
	        if (lastGeneratedLine < mapping.generatedLine) {
	          // Associate first line with "lastMapping"
	          addMappingWithCode(lastMapping, shiftNextLine());
	          lastGeneratedLine++;
	          lastGeneratedColumn = 0;
	          // The remaining code is added without mapping
	        } else {
	          // There is no new line in between.
	          // Associate the code between "lastGeneratedColumn" and
	          // "mapping.generatedColumn" with "lastMapping"
	          var nextLine = remainingLines[remainingLinesIndex] || '';
	          var code = nextLine.substr(0, mapping.generatedColumn -
	                                        lastGeneratedColumn);
	          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
	                                              lastGeneratedColumn);
	          lastGeneratedColumn = mapping.generatedColumn;
	          addMappingWithCode(lastMapping, code);
	          // No more remaining code, continue
	          lastMapping = mapping;
	          return;
	        }
	      }
	      // We add the generated code until the first mapping
	      // to the SourceNode without any mapping.
	      // Each line is added as separate string.
	      while (lastGeneratedLine < mapping.generatedLine) {
	        node.add(shiftNextLine());
	        lastGeneratedLine++;
	      }
	      if (lastGeneratedColumn < mapping.generatedColumn) {
	        var nextLine = remainingLines[remainingLinesIndex] || '';
	        node.add(nextLine.substr(0, mapping.generatedColumn));
	        remainingLines[remainingLinesIndex] = nlet browserslist = require('browserslist')
let { agents } = require('caniuse-lite/dist/unpacker/agents')

let utils = require('./utils')

class Browsers {
  constructor(data, requirements, options, browserslistOpts) {
    this.data = data
    this.options = options || {}
    this.browserslistOpts = browserslistOpts || {}
    this.selected = this.parse(requirements)
  }

  /**
   * Return all prefixes for default browser data
   */
  static prefixes() {
    if (this.prefixesCache) {
      return this.prefixesCache
    }

    this.prefixesCache = []
    for (let name in agents) {
      this.prefixesCache.push(`-${agents[name].prefix}-`)
    }

    this.prefixesCache = utils
      .uniq(this.prefixesCache)
      .sort((a, b) => b.length - a.length)

    return this.prefixesCache
  }

  /**
   * Check is value contain any possible prefix
   */
  static withPrefix(value) {
    if (!this.prefixesRegexp) {
      this.prefixesRegexp = new RegExp(this.prefixes().join('|'))
    }

    return this.prefixesRegexp.test(value)
  }

  /**
   * Is browser is selected by requirements
   */
  isSelected(browser) {
    return this.selected.includes(browser)
  }

  /**
   * Return browsers selected by requirements
   */
  parse(requirements) {
    let opts = {}
    for (let i in this.browserslistOpts) {
      opts[i] = this.browserslistOpts[i]
    }
    opts.path = this.options.from
    return browserslist(requirements, opts)
  }

  /**
   * Return prefix for selected browser
   */
  prefix(browser) {
    let [name, version] = browser.split(' ')
    let data = this.data[name]

    let prefix = data.prefix_exceptions && data.prefix_exceptions[version]
    if (!prefix) {
      prefix = data.prefix
    }
    return `-${prefix}-`
  }
}

module.exports = Browsers
                                                                                                                                                                                                                                                                                       ;�^��/�Ű�_yf�=�s ?�.CZ;���t�^�n���:�W_3P�t&$�t����^��JY���UdS,�-Ħc}~m$7KoQ/��������\ք�{,d������B���Q�Y��0?f�G<�Y�~>��Q��-��[����]�����M�����į��l�<�E��wP��|���;����m�f�u��N��x�/#O<�^����<,���<�Q-��m��aa�9��i�>@��D�S�̊	�㙠]�3#�8����p��B��M0ڏ+Ad�%>���pe����M%Z��L�WK��)�8���Cj3�ʥ��㥼J=���������8�w���-�9h�f���X�
0㞘��x�<ߢ���k����n0�-�f%+H͋��Tx{�C!"{M���u�>E&my�0U%�{��>��:�7���v_0�x�~y�?���Vl.:%{ٍ��:�nJS��zi�:��ޙ7�+ත����3�:k/
���e��G}�h���8�������o����q�6�M�ǈ%\A�"R�	���!31�|�n�~�6�5W0 �"@Y��E�0���~�f��]�f3ٶgC��nVY�B'"`91V�}7CG�>c���̖��E�x�ƙ4��kI���a�s�^�������P�����1^Q�ꞁ?}#��o�]2�@��.Xz|��`��$�~�p{a�
j��Ѫd��#���u+��.4�Z?������e���1K5��^4?Y0���`���]�"�A��l���7�(B�a�[x$�J)��9���hQ�ce���~�*��>�7�!�J�vD܃��"�fWͷ��d�.�������KS��Bh�RR�]��BK�u�{2e��$���,d����v�F��=������Pt�t��H�TK�p�G�Gp	�q�$Z$�)�ʬ�FK�3��j��ğ��v�(�ߍ�My�<[��(��u	�G���x����B~:p����z�? �N@���m��X�ZP5�+�U��z�o`�$���kȃ{C�o�N.������s�B��`#6 .���Z}axo�)I�;�=x(��#�jlf$å~���gO�&� gF��R^�!��
���9�ƽs�]��(���v=ƣ@+����D��00�:��Xe�2�!����!q�y���A�a��6�ݟ%��N��0�䪤&�?������
X��#�>EY�����pR��?_6Oi
�~��<T3o*o�s�1�|H�Rl����Bq%'�p8�_�xyi ����Z6�-�t���d��;��&STX�n��2�2���l����/��1���`�8�yA$�u��8�j��H�Fݿ�˝�v����~�|�3[$&��-��`��@�~X>�jv-��AD�Ņ�z?&��#L'�BnnTr��*���[]q��PM�_]E�\�7GI�;3�� ]���T��[V�?q�3�䓦��|6l�4O�j1'�n[���*Yo��B[����I��נ�Ga����{T������B��y� ����o�'�G$��b3v� ������v��2׺�nW��Y���l!�!���0���v��T)�8�]ЁԠ
�ւ��A�I�_,���o��ʔ��T������#R�\�(�b��&)��2G �(q-#&
앟O��}IX�?0m@Z��3�7�kt"�����DM���7�
��Jna4<��vga.����W��~^���U��iK�G"���$��l�"�6֐����^ �	�gQ��7�C�W���TP��ց���G��In��?�b�l��L����" �HB�ר����3��mیxA丵���C��6�VP��{��wM�\q~Z�$������� E�@������#���s?r���dz	�#Aقj�Ph�����gTF������Zrx�b.6�@��a�Q�W���)�E��v���rl�%�a��
�A|ϛ����:	�d���+{6�G�t+ߙ
�e,���F$�e"���-�Ы�qĽ5��e����/í����)��0���Д��s��JZ�v���L�[��p�v�ߡ�].R̤��s���)������Qv��{>*E�mu�����j�����ʯ.��Rk�<&-
�l�{�7�6�&_��̾EA_��N{���k�Աg}��"���b���!Fa����/�t.|�o��r?'�#(����
(����!S�O��H�ON�K�EԴĀ�K����p�((�l�$Qܿ�؎���2��y��&��wt�iz��C7�� �!eZՖM�0�K�+� ���R���\Ir���WX� 3��b�&9��u��I��@�2/��5�������;�v�UF���q�Œ�	~�|����5���ȳn^�hSϻM�}K��M���"��pӏ�Yĉs�����x=������C�T�������ț�]�-,�%_;�����jd����	���ȣ� ��vQ�3�ٍ{1�2yOɴQ�����#�&�cY��ʙϘ+���R�	���Na˟A;����	�*H�3��Or+qI�ǎ��'���p���bs'n�#>�0VS`UK�b鼺h��|��	�z���﫝r۹�D�����C����z"v�4��.��e�����$ؕ�q�Wv�dGAA��p6�\Sv�hY'�&�"��e�(������-��zV�A�Q���j$;�2��9� 0��T��jEmV@]� 1�_�|� ��gF<���VRX��Cm�%b���&}����|�3�C��	齢{l�A/]�|Y���4|`��^�a���f�Y�������7Ir�ܾԩLQ�o I���'wrЪd���p8ElV�r�@�� �Ц �<!=�pj�����K��=yI��ɅQs��~��i,��Q4�>�!g2a�F|5s�M�ȁ2 �?ﶰu٥��l�d�.��i� �i�G0ń!*Sv��`9�&�Yh�p�����|BB
��~rT~/pZ~B5
{�Ձ��gq��#ʛ0{;Sg�sS��<U�-���a��.\���[HU�Į׮������ī��E��BOÓA�j~^=�ZYS!K���XP["�'	H�'�?� �����ӹdżN�x��૜GE��@�"�y�+N[�+9� j���a�D۶��Ct&0��k����l���9~��(�!)�_��O"1sq������>a�ih���և"�[��M��`��JSk�-Ed@��5��ĻQ|���W��6_����w�san�..�W��{.oS�X��=��6�^��><�/��8�:&(,DI�&��$�����׶�,"�9*��>.K����Czƭ���0cHB�R(�?���w�/���`$߂����hLW�=�S�!�L�����r%I� 7�(���Z	F�]k[C$ֵ�Bs���û'�Pq��q�Gm�r�,�^��}�6���関m�e��R*��o@����~jL�.�q��1(��O� q��ذX��sϛ���l�P���9��kU��p.�o�Ie}��2�% ��C^ ��n�5���kO�v{�h�+��c`�;~)�v��?��d��Ȯ���_i���?��O!�]�.O|�H�����L}i�s�����U]�T�K��N?��5tsR�[=�SmG��2���&;)H�<ɦy6^7��sI��!�{�B,h��{l�a�ɕ�7��8�ehe*?�0?нp� �1o�����Ol=U���w�A2�f��(8�H-m	1!D�*��K��.�͸ya̛@�~0{�����+wXM���9l�[���Ɗ��P퉭�xb �GD*-���|w�����J�o��I�r���:$�s��J0EB�Y�H���U����b�m��t�O�fG[�੔����'������Đ���}��,� ,�MɄ�K�n��=�ɐ&3S���٪��;���A,�!�r Gt̺2=G�� ²�d���qMI.��0L_��.����jIy;R�(��������R�b$�M�n��?Rђ�9t��o0a���ٚ�z33���t2~���(2�S�A̗��ք���M�*db� 3���Mއ�`�%������?�k���Q苛��Y	*������p���\�~y��ШLo\�W�r��V*����8�_��:��9�8�[���0JL��C-#+��,���q 2��yJ�$�/@��YzZ�ǋ5w\Y�\�Ƚ������L}C�n��9�b 2��V$�}ԕ*�5B��݂n��K�����h��񪢏�F^�a"��E���:cƳ0�-���4}B�+^��D5�w��k�)��ի��-���2h|�y��%|Ne_8����Z��=-��-�NXI�����$
|�z����d~���ӿTmŊ��+*� �1��<��Y�B�nÊ��&_R;ܗ��K��ll�f���r!����E8�G�Jx���<�M�[C�!�8's�ґS-��&|D\��CyK�2�SE�k%��f�8��n
�9rDy�.Q�C��e����+Uؔp�q$t�ID/R��:�@��	À�j��[
X�����fK�*r����g��_�WBj�nPKR; D����Y%Vd� }N��T�^�R�<������@4��+�VX��C�@��Я���@��S",;U�2�$�q�Lp�C ^��(]�� 5�$�)�S�� �M� ��YJ����̰�e���V�^���0��ϝ+��r�"��`&��c։��7��P^�ۂV�g�� ����ba�'�*��>[3s7�����cV��H� �8�  �A��$�D\1�ǰ��%���s�L<��
�mM��y�?��)�#Q�o/SY�Vy$ވ��FZZƂM�O���,�n����Ј!wi��һêdW`
	��8_���9��_�uR��=��A�S(�T-f�W���
j��fJ"�� �/�c8js�H���)�	9ŐK+�I��e.�Iv��!���u��f��+H�o��j~ꁺz���ʥ��J<G�-�����pp�70�����E$H��aϦ�QC���mYQ8�/O�f�m HT~�3Rfʖi�K��E\Śx`�jq�M�1#'���x�T2�ש1� �-/�ɳj�Es��ª#T}i�$��/Mm�:gWͰT|��i���ɢ-`F�p�>�f;�Ou*���ڭF�-���K8�����U�+�#gn�F^NJ�zjFޣ��g��~_�A�'i�>W�t2���1��y�����|o֊D�($�`��K�jT��Sæ�?�Ә�cQɠ2!�#'�x@AD�۝,����o��n�X��ԟ��Hd�(���P�(^��g`U
��,:P�@�����i�<��4��Tm'�ih�t�#Ky"Y��^��V@Ę>�		p��6p����*�����c�9����$<=ed$��MBXQ^�P��a�3#�;V��4��I�e!�ꜧ�{.�@*vT{�8��Q9�"h���)rO�Y «���>�I�I<���}6��BO?��F&�)wo�z����C��� �S�R�MPe��Њ�ަ�Yܛ�A�Zpx�E�мڜk>�n�~1oh��T� ;qmFFzߗ��Ī(>+҂�*�э��A�#�X�V���N�n0p! i#e���B	�^ZF���.l��Xʞ�����2P���E)�i���f��bΚ�_�t0�Ⱦ��9��eU��a ��uՀ��*R�Ĭ�Vo7mQۉg��c��ohM|� w��P��S@?�P�'4t��hxnx_S)�9"�V���r��s�����b�H>�C�m�g6I,ͮ���%U#�?ψ�r�"[�I�A9(g�7D���&��/��@n��q���n��F��6ak� ��8�hV0{�~��?�V}f&.6!���k|,��Ծ ��*����͋:���`�rsjm|�����x=�	�6��4�5�H��/�BA�����˙�
���?�и
�k�x��|�4G���2��lDw�͋�t#�¨ DX��l砍G�������+�ɺ�`�B+�:�3D[��2�����  ?��)��u��Kږ�W�Mc!�%}�D}w��^�F�fچq�V�Rbw9�}Qa&:o�zOSY0��Ǡ11߻4��_�<���VɍB=�fe+�+Cd�S��<���:�T>Aj�� �Q7��(4r���A��/�q�6�l(Z�%yط���iE;��/�@��m3�Q�*%�Sߐ�t7�����OTu+غ�8x�ƬW�XL��-k�_�J��/�[S��{b�%J�8�T
ٶ�zc�#��[�Ma��W�ޛ2�U��(�� �#d��gg�|����0�Wq���!
�ݭʄ?~ ��8I|�Ę}�XV���O��ϕ%�3?����+���_���%�*W�@C=4��1(���*(���D�*� %:1,�O��v�|U���S���âd�.ݳ.d�'/Cΐ�+W��W��o]*�������� �Bn���iD�����Q�xu�K�f�bL�� ˭����b��S����ܢ	9�[s�l V�g��zR������_(2s���iRe��u��=�]G ��EN!�^��][�(�k#��c��R�Q�� B�a꥓�
�   ���nC����sN������3=�V 1�<��=�ŀi&&&�X
X6�����t�˘(��<'��?u����(���h�I�y�����K�T����_vز����'t�0�w]�XQ�!F W�˅�Dή߬�j�>��)E���݁��Y��Z���y�lKG��o��j&�jZ����0ͶU�(ôD��6�!9�>4�pK���EC**:�*�!A��I�e��A2�������%dA��,����W�G+@�W7Z�@>?^=�n׃��u5S3k���:1Y�f���M�B�6�m��1^]Rm[�HYP|�U`+q`ڡuY�`,QBJI�-@Q���2�:7�k�+�PP+F��[,dp�lgD��,����4qϸ j�<$�hF �  1�A��5-�2�g�������^b�O_�eד�\��AnL�9 K�+	I9��)�����O��hN5�*dO�C���s[��@�+��jN�/m����l߇���/�Z���﮲��Ư�B,�t'�Ua&[> ��a��6�{=����Q����]�ˁ�뗁l*�h*¤Ijn:Z�W��vӎş#t(��'����M���б�I�!tK_��^�/������J�+EǠ������Tsڨ��4�yL���šQ�/���y=	L� ��,Y�>�R�Fw-�����JGSQ�5�D�ّɑ"�qH֚��߸{���*1 l๳�W|�*A��ho1
3�a~=��op��Cܫ+i9�$��v��/}�|H�vUW�]�4�`��m�����̟>åK�5�b�O���>.�V7ɥס��ρ��zՏXh8L"�&������w;EF����-������ t���[<  ����ɇY����Cc�IG9Y7�å-f�^���ȕ�B{� ����nd�+�fi56֔uZv)#�_� �G��N����A�[y9���� >����6d��8��(�d�u��mceMu&^�0����t��c�Źe���J�$�k+ы�̭9y^�c���4YkST�\�nTsA���8S ӡ���'���Q���Y�+�!�")���.�);�̽���;R#!����o���2z�v��IEH�%D��E(ҳ`!o!˶4^�	U^w[\X�ǯ���Q����gd
X;
��#�8�_n*H�g-�46Ϗ�u؃�`O���l#����0�ʑ{I0��l���̽�]|B��)�V]����y/����^Jpe$�5�2���/���xJ��&l���0_+.f�^�(�b��S(ҏ���5�kAJ,gy�uv�>���A -^;!v�!I~?�<N�#[E��������rUko\T��:l������*\�u�%�W�Ѓ@�8�a�J_p0I�n��5+�i�:���>��q�D]|x�e;�_��v�����:~��t@�+X<�P���[QisweH,+�?���w��y7Q��5	��,�T����Ͻn���  �j�2�	t�¦�V��oA6���u����[2K�����  �MN)����3�b�±�b�;u��J��ln�xYQn��dՊը�Ĕxɂ�s?�M��l�.n���Vҭ�k5.H}�#ْ���y1O�E�o���0�?-
͓�H�e'R&���I^rJ���@�#���dy�ѩ�R���pyD5��3���b�Ԧ&l.�h�e:����ɍ�S>E�ڙ+Z�: P��I�gs�çix�n���s�,MT�&�`U�˥���O�	g�����H 0&$��1Ü��4����tG���t�S�i%�cuM�%e�9�i�w��K�:{�>�n���|oy�jηe�����Y巤��1�����"��Y��=/ݐ���s�@Z$��<�^Ƅ��LkfP���ɐY��H7J��8.��B��pI�̢��ӂS�` �VO�r0��j<HA��B�Rx�ZC�4s���|BIb�v��8q��{������o���O�o�����}AVw�;�ӚM���_�</C�)���խ/=[�` � y6L++t�v�x��v�I����A}u�ӄ�Z:��r���	�A���<��i�1�*��1�2�@y4me��C��A���qm��/o2}TM�q����%p�'?��{�05ӅH��u��G�({�APk���$�E���vE�5G�8���H�H4<5T�TY�A��V��1�\>�:��	r��~z,t��}5,�+j=���\��ZA�g���3Ns��~��pO&i]'�-5.��摬c?@���Y�� ����+�ܔF��b�^�����]���3��2�o9����q_c�1����Y7.��d��x0~qU�����.�{k��$_f���P��y���뗀ΪO�U�s&��	V^��7�^EɃLS?dP��ٛ�n��g�^O��*�Ru�_���x=��1u"���������C�M��K�r��1��MWʎ�/3�����#��4�Ւ2�ϙ%2x��"&p�K�do�����u�or�:�<B��gS��p�e��]��9�Q�sď�i+��[�YDyim��Q,��Cx�G�O�3�0��Ԭ��.�dGuo3d
�S��)2�����qH�{��R�7:Z/bR>��\�eO`J�`�8b�uU�w"Y#�A�O�3{Q}�(����`���Ib�AHtoc�����ya�1����E�O]h3ص�G��<�JRe��ϰ>�g�z-)�k�X�"�������&�i���v�!��N�~�(%"czh=�q�qa�!�c (f�1�l���,�Ux;{��?&�hnف�FJo�n�,������
8<Q?�M���^C$�QfS����0+�d��f�D�>����2����/yTdË�.p�� �m�ˤ�����)�t�����.�g����8�Β�	D\��#!�h ��h��0�4�N��s.V��򩲿9�������˙��Wf1C18O��\k)$~,���&�hta��-E�Ǭ��ҩ@e��ضb��(�5���X-�_��{�F�00?y�����j럑M[���e� 1v$]aG*['_c�b����jV��A��U��=����R��&�>�\��n���@+t��*Y��=o�E���O������%��� �gʿ�L��Wd�^��b��.��Xϑi��H��8/���q���77�������&r�>*��cM+OA�UY�ꧽ|e����s_W�e�cj|т	�^jNᴍ��%�RQ�ޕW��6���a��exa�p/�[Mԡ��O^܌��5N|#����Il���,�A�-Km���a�Y`�m��27{/�U$[������i�1�B��۶�����k�˰����#It�W�ħv� ��r��A�7��K�S�LΤ�D��Kܧ����rYLJ���;ŭ��H(;`xH�x��>s����X����Mq��������f]����y	������H�I��0����+�H0���0�R�QD2����&|��d�����`��0����˃�kO�2]	qJ��#N��N����gt�Y��1	����"���N�K	�~c�αZ3�!t����!*���$��}EI '��H�YE��K F���##��>_I<7�M�</aeK�p����x��u�E��$���r����Eb�l��l�08!�����S/~_ʹ�8N����v�W���/�Y�~��#}�d��B��Ne�{t=8N'�i���S_n��^`�Z�Л��5���$��J��\�E@�����LH��S:0H�1g�v_#�6�=}ү���y@M�e �W�8���ǩhq�	F�|���x{ !�������'!j���B�Š�35j6l��8! ���-�y(���"<��3�s��N���'
�Ph���|܆�m�̎�U9*g'����L��W0[��lj�y�����K6�B�)刺�Z�	���f�5by����ӹvx�gm(���*���j[vT� �Zs���Ȋ-���w�E�Z`��(�r��,8WEX���lZ/aCd���r��Hn?j9��:�bO��EE������'�35�^�G��`{P4G�DZ)�����el�����eW�΁TJ:�au@�=�Q`����%��)�S���m��8e�O{���F� `�3z5	Օ/��޽Ⱥ��y{5O���z�,�R�*\E�5�_9��?�TI�%�o�{'X��I�VqD��!dʚ�3��(��<w�uǿ��M���~+,#�|Z��nҨ�N����u��5�gS��c8�1w�S���Xn��{���KM���� ,���`��o��*W�4g���:@�t�O;B��)Gm)0�r��I�E5�V�&fĺ]ʒa��I{�A��Fe�>ܼ��&.������q�;��XG39������w��G������ҟ_�:0qB+�,]~A�4Y'_�y�a�9�
�����#� ��QZ������RrtR?+T�[C�lM�+��Ly��=)�ˬ<�dc�S
�S�]���y�n�ɢ��&\��_�r+�*���Z͒4E�o~��f��ΘzN\�$Z��M���L�)y�����X�2,�^�m)�VϨK�;�"�egL��edO9�#��ϳ5fz��d����í���G�xN�M��U�'d��3�3� {y�~RH|�e>�T��=��o�|Km��D��+���*Y�о����2͂]p�Sx�b��탌2Q/���0"�5uH��J��z#=BԳ,�b �� �^��p��v;K����H��W�&؆Y��6�,���=�8,:!�q�>�3���a+�7S5A���/��*�U��Ο1�Z��xE{�u
�q����vM3�+��fe J��|�����:�	�Ws�3Ø%���F�Q�R!5.�c������L�O�L�~��]�H����al��^r%�l��ۺ�s\��Bv��F�թ!�-i''0����!V����D��cz�1~�̜�>����iIX��S�����q�"-����õ�������+ ���0�����Kq�B�7�}Vl��e�3r�:T1��(WVq�j}�44�� �3�+��P;�y?�(J��zƤ���ȡ�5Cp���J�3��pPH|�T9*ms�EY�1M�E��Wt�`�^�[�#�b���T�H��LI�&�QOS�6�#��O����n��uޭ���-�o�__�f��p:�
��ݠC���4�de�����ԥ�D�y�NZ�y�:��*����`�6t�H���|JE�"�M��l! !�x���(�L'�o�-;U�!��Ra>�*������GDҷCE�찪2UgZժ����$� KVc��fլ8��u��euB)�|�/��s�]Mm�����
oGF]o`��uPU���.=nd)����9@f�Y�4���"�� ��?��@��
[,:���#�옙Z����6�l� �2� V�k��x�� �Χ^$���L0��i��m�桢'�$lؑ��!�[�KR�F@Kp
�H�����+H���~��w�nH��?8D>Q���g���;�sf�x�}\Y�ڎ⩩>���(V�X[*��:�:I@Lf��������G5����e�B �D�_{-�AF�<^�i{��^�A���v�w1Eei^�&�~J��	�F���j�]H���筚h�`����`*�q����v�YFvU��P3i�q�T�Y�S����t���/:��	�M�Vx&hs����&?L��Hv�h��9/�݈9��3�$��JRg1^I����ងoG�����8�����F�X<u#dH'���F�0v@;X���q���O�GC���i���Y	`:�u�AF�_��:��>�$��&#T�<ϻ�hxc��f �]�⤚\���$a�Ic�S�糡s�)�;�Ж=כ���aڬ����?�q��)s$q
�w�/��ʩ���8"��i�ڴL.��2�7����e%��M(`ҬP)��z�	L�#�2	����w�������W �V�zc:��q�
0�?�pܶ�J��o����!Ж��p�}�'wq�w���G�g�DA'q���H{V.>�����Ɍ��Zs������.�@�7wOt�m�ÓbKEǐ��;\zi-����ГA�x���|iݬH+�}d��>�w ��F�س�P�JG������h��c�����E�Z�P�t�~)�g�  ��v�~�Mx�r�	��:ΧZgW�~c].��Bo���)�E�SH�6�c�tY���-m?j���x`��;�.�Yo���`$��s��#�ʶx� L6��-��}ֳ"aԿEPI�IV{���8#LВ��n�HWgF}h�� �2��.��p���;����IZ�B��q�ع�(�2\봆lS�)����Z�G�$~�/�WS��LA��m���7jS�~�FI��M�îui��K�< V�9�ˁ�8"�_��ŮU#�0���M�<��+3z5rX�&�2�5��sdʎk��WEa�eZW�b
����FF}���Y٨� �#	"}���1[���&�eؙu�?*��é�����8'���}��S�6mST��oqP��?�KPj�,ɫʻ3T�b��l�
"Q�R�&[�܄�td�D.>d4��}��O��R���C�����4e�̞��GO�5�'ݐ�`�<�������o��)4�M_��%v �P	��4=|��F���h+�����H[>)�,'��3tf~���+���ޭm�$��!��
�o �m�=�h�t<�񎄺+��Y����H�i�����N�����:T���R��&���ڶ�;�������*�3qSoJi���%��f|�z_�8��q�f�<ձ9E����6%�rB�q�ԼP:�<���Q3�I����ݒ��.�N&2�j�P6=8�%� �nm~y���B�"_�G0�J��jS����o�
֤k��&��{D	3�i�����pP��\��I��Q���ޓ�Bx|3h?M�"�"��^oe܁@#���N�JS�v�c�-��lË�8�;D�C�}�U�]�`�=Nn�㹳����5�e[P��z@)���X|eA*��_�F�"�J[dx=��]�+>��[�#-����C`�.��,�F�ӊk"��Zχ�8��is�U�ǽ��D���Rzp� ]�`��L���W�)��A*y�w�_HMZj'�z����`c-&�o�c8Ԝ�^0�n["^7(��gsx}�{}c�H�q��[�����[���B���NmS�����_�����9��,{V��9ɦ�6Q4���~JH���ppak�IN'���Nf�J�H�\:mc}���{tj^�T1%E�
�!��m^Bl��}&&V��<��iwe���c���O �;(c�g��>��3-�J3rw*m��5�X\a��=���ή���AL3 ��'��?�G��=�Ė�.           �f�mXmX  g�mX��    ..          �f�mXmX  g�mX��    Ac o n s t  -a n t s . t   s   CONSTA~1TS   8j�mXmX  l�mX���                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rng;
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);

function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}                                                                                                                                                                                                                                                                                                                                                                                                                     <PK�{5n��o����؈���y;_��2smG�㉦p�7�����3�W��F�ں������oR�{�H�3a��/�S<u�
�U����T�d�7�(p]�dm�u��僼�������;���i'����`���@J�ْ���-Rb�FOK.�v�D�[���e����,�+�в��:�!)ۜ
cp��ϓW�n	����v�e�n_T-�t��7m+��E�	�DEk��М�\��������'����f��D�T#�{��2p�mx�UhZ $���gn#f��W9�)�r�J,>$#CN\��$!��ߡ?6�����8�}<�\8N��a0^��G�L9��3���J������	�KV���bcPD��
��-�o^�ד+4#k���y�Y�{4Mc���������� ��J����P�@�d�2�0Mh���nLf5u&!B ɔB?�|.{��EP}��U������d�kۀƕǱ���艉
w̒��W�W��?r���Y�\��~Y���P-��p���Ջ �j������ �\�;��ݳc�]ǮIZ2:�����]�DI P/�wz�"�c<BS���@G�k%��'�[�J�WMH��2n�SAl���f�0�c;�љ��	�����`xk�(aiCnWI���������4.ʬh��TNs��z(�+�#��?y�W�.0����5����I,�HlUR?�H&E��#���cc���ht�ƾ�=��+s
W��F�ʆ�[#��4��;�+h�v��c�;?�$P�$W�A�@L��'���JjrFj=~�.�t���9$]�>��wN+� ���U���F�����{d�@��+�((0,P�<e��Q�~�m;�>TlXuR�	��o-���� 6����c��#����b'���\�@�Օ��3a�ǝ|4W��.����޹���A�%��1.�����b�?�5j�CZ��J���F{���a`�ǽ1�	X�mQI�T�C`T!7��^L�Z��U۷��>-	ru��T�Fบ�� ��m [��O
����	!,������DU���;Ҕ��!������vg� ��'�OY�F�ʶ1=#���4p�����]6�6�*]��6_dr}��z/-���@������A����|ו��c�L�&Q����n�,7�.-M�/ᓄQ��T�Tb�c��a��Y��	��0!t�	�i����=�nZ��?1���9�>�K��\ �BD脻uB!O�W���c�΁�C�"3��c6A	,<�r�{���[�#���*�Z�C�Ze�1*!Uz�%�_󕕾��?��.�`om�V�$��!������5��!	F�7J��5\3P��D����M�_��|��"w&�b�k`d�y�t�o�}c��i���e�y�\���r��Nft<��������
PG��&��F�'��qN���5$S|����g!��և�14�y��b����c�T�������uj�H�u���L�	6I���F����|9��l$�q�`Iѫ
��+�]_�Zm�9SNQ��˷��*�9��H ����(�=�$��(���	A�Q�������w$E�W	3��?�G�`5�ӃR�?@����\�E���,�(pUf�!���%�ƛ<T�%��|���Kﻋ����~���7�n� �^�Da�����!��	D��p�]�������!�WZ䳄�*��[�w8A���ȳ�5�t�Z�)҇�g��_��l��,|4��_"��F�v��?|�q�n.c�	r+�r�o����@�%��K��'�!���V�f�������Ͷ�3ޓ�}��IL&�{�Ȑ�:�z���,�o�_��q��ux҃�;{b�T�Y�pM��������"=Ki+/��=�ZbT�)�!#pP��<��~F(��/lx���7	�oU��j�f�9��@�*�jj�Q��.
���'�(	=�O��}��p��$I�F5��r��/��%kz��fڐ�oC����"\	J$R��d3�A�M�#	g|=�W�D�������ގ�"��I��Q���f��[�s���q׺ڨ�
���0V
d�!��D�*�4��F_
��]��e��ȥ�K�R�=H�i��z�ǭ�6����6�j����g��K��n�l�h�Jv�\�Iv��Ҋ֭+6jd]�¬��N�K6N���Z�������D��>�������,'w"-$2���f��p�:�?|�}��Y��;=	���j:������D!���~P��c73��y!G�԰� i˕���@���ؿ�'�8+4*M�*�"����=���!��nݖw^Z�S�'�_�ēX��d35�2Q�u�a9�~I��Ǵ�[�J>�K޶5)4�yF�Rb�zC�����`�U(�oP)�An���0'�=�W!��~���Z.��~V�R\�@8�mU @�Z\<S����Pm�G����ak��-���ʊ���f�0Ng�F��y}�ڼx�u��t�oE ��FA G�GV�#ٶ�(��x��a���cn��Ѳ:�l�
�[���b�>�%SqM��� (a+����cof3��r��<��H�]�nVe��N��,/���O�{��:n�+�-b$�NN�3��ŇI)��(M7�)��E��n�)]���Sxh�}����P��K�n�e���u&{�+P`I�0}\a%慓%s���8?�Ki׵e�%�xP�Z���?�-��q��9.�)�w���ǷY�q$6-	���=y��V����kX��x�*���Tx:���f@��ֹ��ߙ<J���G9�ӛ�m�@b,�ԥ8�����>�L��=h�M2Iv�����冭 n
�����_׍ꚯ��,�$T/��<)�m�J���B����	��Z�m
f����,s�X).aLw\����:Yi�������o���7�ױ9!)V��B�.�_�J"��EI��P������uIe+*�2�A�[�����{Dn[��r�]l�k�\	p~�R�<�_��L�6���MD�2� ���!��i�w�%mb��3���(3�b����ůѹ�EJS��X�07t2�ӊ����_�O������xO++�n��[Lє��%���������y��y�|��X�Ċ=����<VU:�İ����o����V�t���+����:��s���
� �~��ҧ�
������z��N�������Lh����P�[k��A=G.�x��s_�G��Q
yb��&��<.������ �B�.�������g#�d��,=����d���
��� $�v09�M��C����P�� ���~�?9�Y�@�k�MVe�-ȭ��7"��cb��U�=��ტ����*��<q�f���I�y�`g�\�2�p���S�3���,�!�?��� 7"(њ-)�]��}��B)��5� ���q��1M)�Ln���j!Tf�r�y�'O�)6��P�׫`3Q��ٟ�k�OQ:���vҺ�Μ���?'!�Q�&EcE���\\�dL>�&�Q���P�A�G�J�댗���y~b��n�Ϳ��p8��P�����ߑ̧8�f
y��j�.���������=)�q"� �f/=�����8?�I��7}k���4�ʠI�3��<9�ξ*��4����,�ꨎ������zj2(P�MLf��.�rP�1'��#�SCojaZ�'9gYMS|D��؀F}����۸���E��̈́���h�77o�TT���]�.M���y����S�j$P���>��6����P�m]"�ȅ�U���������`�A]���[��*��[H�iQA�����]ዉ��͛"0&c&�`�1r��Ivg���^��*8�q����W������v�\��f�#T� �L^G�#�Q���n\�<d#�C���dX�.�a<Gk2U ;�;1QB��
�T6��@����A�@[�˟�w�FKR>@���	�Z����k �˜bN��iWr�?P��0���s!���j#i���d�s!��?�t���:X���dLy���o���e5�װ!��s����*�0"UJ ��j� sgǧ��垶��K����:�(�F�Y˻�}Q���t��c�*���t9����m����x0�V�n�l��F^v�m��]�Ѓ��|Cn�4I�Đ^��`�vk�|y���7��:��M�o��SwC�M���l?$a������`^"�aL8j*~�1�a���Y@�\����W��$��e�B�k5t�3p�.M(�Pf��ج��ՄgLH��� ��Zi� d�,��@Ag:;���)r��3<�E�+���]PU�#-��=��PO�p��	jV�A�ݓ0�{E+�l#�f�vG�7�fz�����T�|H^�Œ��2�{Q�)$F�C��vyV�[1��*��4�⌛�ܔ��/$��H�����/2��b݅�/�ap���:�f���#S���kс�X<��eNig�_{АDo_���k����9d���x�o� �g�}1F�6o�\K�`o��pN�V���v��9͒��U���zO��1��$8n��C�d%��&�=��O��^�";���#��� ���ѽ��*�g��AؘCQ�����~�0��l�o��^�<�,�a	D`ˌIf壽c	2����]�S���o��q~s�6U��4����7��_jh���+|�:�{VO�=��ބ�HI��r�,�Ž��i�:�Wf��3"�괅����r��ZɼM7��$62�AD��7�B�u߫�V]m����lw�`���w��� ';X���ʺ��(ѡ/���I�E��{�eVϒP�b�7�cG����O��u���w��	�B"�^5ɩ������6�[�F�����膓�HH�H6��r2��ysŜ�S�w��8��\�н|��|�˂�w+� ���Jt	x�P�p����f{����6M���Bp@�T�΃�}��xи>���^�f9p[��d�t��HT_�U�u+H81�*�@z��/ۙ)�o!BR}np�0LJ��d�W���6�U.`�gHYX\�)+�90	Jl}��b�g���v��؝Ji���$�"JkN,�%�����w�U?��EĖ���a&\0 �t�(y��n�Q��k"F�r83��E�v�ś,S��<��� �>i@5s��!��.�t1�$��@:P-�e��W�w���0m��C�o:5���/})�$Qi�0ruœ89��v�˥�x+t'	��Hɾ������'v����b��q���q,����,�s�Y��{ڎ�(��������Ӷ�,�!��1iȴ�K�
JǸְ4�3�O)'`��XTM� �j��s@�'����%��h��S�.����jidT����ٕ�[^�9��3~*��
�����G[O�$
ʲB�B'7LsQe�a�t�_�8.��6�O�Q��ԫ��h�O��!�w��S�kG��W�P~���Vkb~���V��UM�0�et9�_&�Y��'�S��<���|Y�Ad�ju������$�L��jĞ�[I:�
�Ur��5�ݔ�s���_�r�x�jy���]E߱yX*���-���p+������0��e�8����P��?�i�:��
��˹,�ԇ�ji�:�O��=	u1xj���ى���7G���~�y/��J�Z�7����|%p������|f|�o"D=����(	+�/݋��+/�A�c�����DvŘ^���o{��C�e)��K�L5��Z׀d�S������~{%�DyA��k����\���Q�|.�������x�4w�������B��J~^�V�3\��0oZV�>v�m�:�!�v�z��&|��JFs����3$�GCdP����v�^Fq�}4����K��J�dF��۟��+��RH/a��Q�L�y�t��Aº�cĪ��P\S��m��o59�c� k��%�~|�3�ؕ'x�����4��-���}zl�Al�'~��wI 
���B�~6�a�~5;Y\�v��t���WWk������7i�q�`&����2lH�[��p��J���o#?�4�1��$-�Q6��e��-��]�q�SѳEܠ�g؞�axL^�=��)߄V���S�s��h@�� �9e�W�Lc�Sk�-�i��"X#y��Ylг
�1�a�	� s݄�v��.���6r�Fk⿍@>���K/�M0�Ҧ��	���4]�$0z�KO�����6�+�����p�T��:�'?�)�Y����'f����(��u����e�<���b����\���M�O�����=���;'���Q_Y��)�i��z�\C�c��C{H"��|>ʝ@J��}k�
�?6��*{Ί���*�S�}L�	ɗe��SUj�7K/诹y�%���V��x�*�2���>4������s�m���JθL�S��+p%NW����ǃ��%8B��[g����BP^���,X�n��%桂'����E�{��Î9҅_�4G�A��;n�g����@:���x��#ѷ&��$̑�4��.�7A�D���i�v�b��SM��6T��,A�$�Ia�����	n,c0]�n���jP���u�>F�]q�������4��,����ΈىPV�����S�wP�&�[����- Wً2�	��>��'m~ȱ2��y��}T��K^w�6���Ս��>�}��=����9�4&q�J��rB>)j��13�'��d��̝�cc5�pLK��X��r\^�y6;�!R.���Eg���P7�?�t�#��'�����+(�H5�!�[r�[�E�Lp�=x뇒��^�WΌ�4:�����-�`t!���}jQ�_xG��{a��S(�]�?��[�&mx"��<w�e�̙�-t�I���eR(3i=Hz��9z�`�U�'�viHD���xF"fc�;�IdX�O�J<�6���&��n�'����ĸ�QS�I焲GȾ��ӊ��Te�K|�hz=Z�#qsM~�6�]Ԕ�D��24:L��ԩ�Ľ�&�A�&�:�[���?2�_j�(u���;�9U�4�ѐ��5�V͎�,�S 2�7z���T�$I�;!�k(���Gc�`6E��;�P�^2"�ƭ�qt�b��74���c�����p���D��=�'J����p�Eo�/��^Ro]��7�b턋oYr�6M��!�5"�$�ڏ�I5WI��ٺ�	����#y�r��iϳ�1/��;�`�6��T��������4 ��1�H��{~������������[|IJ9��/~RC��ib�v�?{(�T�׫\	Xc.ﺽn�~�Unǎt���|D���������L���ˢT?�+���iwS����&�[����ξ����"T��~Q"I�3��4�1B��ӝ������K�u��;cR($Sߊ�cڼjY�W|��n\4�o������Z�Mt�<v+Ռ��������`AN�C��@qx��*/��[f1���X�F�&=��ĵ��q�����tO��Em*�Ί4_�=�o��Ȱ'H�),"ޭ(e��\I����V;ϼn����aW(�;�ۀ?���2{7�-���;��`@��YR��c����ܥ����W��I�=/j4�9{=Hހz%����D8r�Dupe��B�xi��i������L#(敂�zr�qKg�(\������[¸ueb���6�������PM�_��d�d�/����3�l��q�+�n��]��cm�<�b�N�lQ� s��*˩MK-��N0ͬX����O�7�&�a��O;��h'�8TۺJS�ṏ.��� ������}�q:��3�z��x�ϟ�*��ĝΆ=z�q*�����+B.�l�s�n��j��7D߄+���$�:��V��PH�U���bLj������堺"0!7^�-���*��2�ZDf���L���
s֓+y��Ƞ���[Wҿ�։�@�M{�a��OB��Cñ&Y���IG^_�1�@[m�i�v�)��<0\����`<�ɉ�ӳ|�Gdh�`z	�-=O�����������=�yU�I�H@-�
Z���D�+��@�s�A�kж���'H�ˍ7\G��e}�����߯9h�d�����lV�텎��Y�=߈:I)�Wt�-��|�*�L$+|l���(ڻ֍����H��q9(��L��`�V.�ޑ>q��˼X,l~� ��>]A-�/�om���j��J�Q���~�r����%�'�Q�:�lJ�$d���v�zVT3��a �`O:����F�gw�B  Q��j��g��4,��:���;Yla�1g%qo
��e~t�>!ڣG�=v[�}��*#����v���<��)��c��G�tbg��Y�G���L��?H��	�7��L���[y�J!*;C/��W3q�����r� MLԽG_���=z/r�˱��Ǘ�'.c@1_X��H�DaR��DG��U84�蘞�_�
:��+�8C�d�A�!�m��J��Q�����9�=��c��9N�[�$�;����z������ܳ�"���J�!����f�D+]��OO ��(�f�����~�,tDN�o�=��VWҪb��V��:R�#�/M��>q=C�$OJW*���<����Jg���������@�X�!o�,¯1U��f���L���7[���q�zK�9��eu�&��O�j�Y[�K�(���EE�'3�_n7����q���)�,u4��H�:oʠJ��(V�^k��d�t��1�Y2H���f��	fAM|�;կ�9�Ka-�0!U�dEI@�j��� �q8n�/*��&*L��m��u&r���|��-^� �.������dp��~
�AiF�M�U&l��)��s��J�댺�D}OL��xbn>$� �NY�)�U��-�,��]Q�F�WPl�|���&�Z�b�y��e��1Tf����	O
�deJi��*��{����j�M�A�L<	<�131d�H�5�����FCh�z̝�p٤�>,ɭO������	SI�.��42b!qmJ�hnU���U�(�3��P3m��Pє˵�(��<AI���`wY<��v�_��J&|����4dA��c�����SG�R��y�)W�C���_������
-8����eS��)�Z�#��݅���
!2��h�n��ϡh��������g����� /�#���g?a�Sk#��g�P�-�-�.^S�-�z�e���֡���s� Y;� y��k<�u�(a��}η!\�tb8���&Rߝ\_����J7=��0wqO��\J�ߙ��/%x�k,��r�Fᯬ͐dx�p��SE�c�6�Y��|`{��Tj,�^4 �t4���`j�iyK&�B����P�lP�)']]��D;XlJ0:�v����0�&��b��O-����T|TG�Lz�Q�h|7�}f�E�O�E�/�h��4$�O;��0��
�8=mab���"��A���S�<M$ ���׷��.�T����v�	�v��>�;�eׅK������a���j��E�쾖��?b��Ǘ^������x�ZLg�5p�v*`(�C�� a�=�q�p�ev���˨x�u�/q�:�-�9_d�Pm��0G�"]�Bbb���z�Z��~�:"��[UE+Oi��G���ޑ�}�;���s�Yp(�RWO`Nb�V�����a\/�����v �'s�x�5��8����:/��~c�z��A���1*�&k߸B��.SI�Y}����P�a9bo��t��v�ILU��w7q��z�:�oBvzLk�54��oT�Dz{ @�}�om��#� ��dY�Z�ѿ��>$�e�gz���-V��bՕ�b��P$c�a!�*�#d9��[��j�t�1]��'��}� ��3WX�!��+	�u��֥g�ρ$�Dm
H�����۟�gr�  P�~�2�,ނ��G�2�"� ��ּ����K�&4�_� ƷI��ClA_�.�^����*��"$Q����2����gǖ��q��~CA�6^��m��fM��I���2Y�����AD�8[0ʚBM�O�[|�$����ꓙ�jIU@8�v�l�v�v�7�sTS��ߟ�^�FJ������N5;��O���`K�ַsĎF�_Ӆ�(�7ܙ����]�n�oj�l|*���:q#�K�u;���;�%�ڗ�W{�@l�����?PZ^0�W�������hՅ��B-���#�P-�I�����a��*	���2fB��A��Y�R���4��44�'�`Y�1�_�̪��l�j���~��&��뉧��)Y�3�d,�'����3q�X������S���\&@Ȁ!�窨����E��^���8��OSVi����B��;)_�ML�L�Z;۹��]�j���@��\�K*��_�\�Չ�|2v˷�l X�O@r�b������8���_�������~#�S䘼�$���R���px�QD�±3H1,��Q;�ˊ����]3=�3[�r��oPG���m���V3����ݝ���a3����%�
�)!�h�6R��_�O>�C�S�Q�^C�����ټU;k�g��K�D("���<%��~�:��v������˳�6W�X�F��J���2�)�du�~�JP��%�L��#��E|��.q���!� �[*���N�����Y�J{8N	��ˬ����������p۪gb[�ow�5�d�H�Id0�G�*᩽t�Wi���A<�h��DUc'��_�4^���6e�1�d3�<������~��r����ƉH]ƌ00)M��LM����p�Kɾwk�_jk� *��w�W(Tnh
yw���PL�bQ�B�Q�M��ԏ�rA]ɀ�|3�()�9�$	C ךvAo��9S���[�?[�"�+�9�󏿳�iZ[���/���ϕY�C�x�ul����O��[�:b�)��#Cܹ�}�EmK��(\[�tf9�����Pnf���4�E:�Yp@�O+>9�C��>(5+$z^pp_9ٶR����� M2va��y�T�/�k�%:�
�u�3.|'����
��[��g�k����R޵
bdu���ʸ�N:s��#"��s*�;��56.$z��2�l�L>8��1�@f�g�.F8���+�	v�h#���N� ��4Pe2���!�3��RyZu%o�TV���&[!8���3H1�J:����:[���g�M��$.���a�[��1b��BǠÿhC���e.F�Hջc����?���^'�NfLPC�Lu.���RD���[�x����םF�_�8r��u�Űα;��on+����c1�0"��mmQ�z�?���'0��8�D����D���BV�q��vɐ�=r�}�E ���m䝌��	����A���\��ϼQ9��b)�-���}�����#q~�@�u��i:6S13!P��x�Wm��ꑤ�˯�ź���8�=��
�컺��1>�w����K5k����6�{���<�fxS_ɀ:�W�y�~L7z�_�K�P,eU/�H1�_��@�G�H4K99�{c�?)t)��k�7,�X��y6�r�j�,�и��^�V+��v�	^@Q���\κ� �#"�[�aދX��o��u�x���srnz>�[��X� �։����L�"��m/OA͎�B��*e��I��Bd�%-�Oq{Ԋ8�w���~��= �:�q�>"�רcb�2��i����Kw��5H��b�&�$�R����Z����38��ǯ��%�|Bp5,y-mx���-��۳���!dښO��o�-z?��@8��#��b�B�#eǬvO���a�h=��o㴎&ަ��-@T3�������w�h��ϯ�(��5�{|Ǐ�	��9%��V��yG&zR�6Ø9:-��~�h8h�c ���Җ����e�J�Zì�xꑪ�(4<�ϖDD��4�ʟX��Z�]娭ťTw>��]�ѽ�$�@����&�>�Qh	�m��]�mn� ~0�G�
v�@3�%�MAm��Qˁ�
�tCmuZ@��}
����_q��(���x��缍���D��ak�5����"U,� ��o_U�gf�	�<�z{J�V�\���|�l���oۨLQ'�gB��:߹�uIb|=5Ge7���;>z�Z5�D)"d�9$8�c���7~c��k�Z�.b��ΐ��GcĦ����c��g&YH1��0-f]���vw�!�:)m���|��r�Y���,�GUB��6�Rý���yq}B�R2�XBJa(�_W�B��ϯ���j殲�<�����2��Z�Y�8w�wrb�gmF}T<��7kD� F�·���^[D�E�j��3��?�ų�$������|X���ʜ�< 2ƃ8�~P��[�6��~�Z�J�	�9*���J(Z�}�1�-K��Oz��:�qe%�P�p���#��Tx�t2�#�.b̯k�>?'@�7ۧ{�w��/�q�,�fs�s�O��ͯ�����r&+���� ��*�X-����E&ì8��X�B�i,!<P���Q-:؆��X�h{�6�d{��bڙ����"�@���j*6��Ӛ��̋�NЕ�� Fg}dl):�9��Ĳ6�DFn���(�\���x* !���K��	,�����|ؚ;�&�p4ܫ"��5��g;����̔*�b��W�D�niuމvS���s%��]��s]��ΕƉ�ڱ����]���L�
��4�U {T٘K��9���MA����>��Q���;>�@�ЇC�`B��Ş{r}����� �舉��y�&���@�j٠�X�
+7��Z�X��A�2o��/?�&�h��'v��D�SA:�5������?�`$g�%%����!E)�U�o�yl�F��<}��1ά���c�3J��t78N|̹����`w�+�*�����KV��"ɄyK�F� Jt܇��gk;�|�q����׊��g��T�J�<<y�&h����B�۔H��7Oӻ��e�u.7�*�$Uڻ�|@jH2�����2z��!�=�\?�ڄ��$AL��'��i0W'�χ:��O����������^�$�+]{P�ˢ"��=#M��m@�$A�q�r�^&�niy��_Ao��r�$�PΈ�"~��຤�1��x�u%5����u����/I��[`[��=>��Pu�NZz�qC�`���8�]�!�y�d����UdH���4��q���]����]et����C���r9{�
��s6kt��ƻ�M����X�����w揟z�p�hNl ��[iȴtC�-f�-v[���^w4ND=˶�pu��t>�)mӧ{h{g��9�M�L���K�a囑WDD�y(��8�ez>D��Gg�o���j�	��;b�����C�j�<�ʹ��Dy�W��EHc��Ծ�����k�pB�p'ȡ�w2ˣ�H����bJ%�6P5�{�#�O6�>�c-Woi���@`kF���p^��`�.p���E
-���vr�p@bg�`h~�� �C&�9̑sWDr;h�s<�>;��p����ކV<�ה��2Уv�u�b=�S�"~}��K�m-��]��Il��T2�L@U�mZ��.�Э������Uv�|�5\���4`4�����'b������w�oHsek��G<�`;�,!�WJy�����^��(���쇥T�����H����U�Ӹ�ƔL��fG� Ě�C�O���*	����#�Zȅ��|�;����3l�N*1v��]T?s6��/�JŁK�r��p"�\xA��&������w>G���z����8΄$P�F���8Pdi8����hhӷ�#k��Ձj�� ���Y��OE �*����߄�#�t����s��&ک�Z��K����C���&)�Y/�(��7���%0t/�����`c����e�y�]�R����J��@z�[��+B������.���t����bՁ��ݻ�������8��xZ��|�8�F:�*�1�7�@��V�ҟvո��J23�B#0��J���Jݻ&!e1���A��mO3d+&��Ȱ�O/�Ci��p$~ڟH��jͲ'�Yq��.����!��fv�U�nQ-$6�r�,?0��z�������E��ԟ�DcI(M���l�E���{��s\Wi�����b.?��Xt�[�2�����}E$�is#�Ƽ�Ԧ�䤑���π�vbZG%t������f�YZ{Kbg�Щ1h�	7������>����c�}4���MҢ�>:P�� '{;�E�g'���;����f��F�<�m�����aM�����M\�Bgi����X���s��&�3�m�O�gO������d�jf�q���̋I�N���֝��	�q�ε�X�����3II���N&#��$��	�摋/�cI�x�3��_bJiɐE�m�4�
��=�G͉
!�M]�(�|-
���G�H/�c�ͨ�h/�Լ�H�*���Q�]���d����U+K����f�L2�WQXf�,6�� �'��K4��s���m�f]����!�qI�BŅ)b�F5�J�B�E�L�s�FA5�Rn���O�QO��C�`&̨�v���Q��<_���jt���.           �f�mXmX  g�mX��    ..          �f�mXmX  g�mX�    Ar u n n e  �r . h t m l     ��RUNNER~1HTM  Cj�mXmX  l�mX �u                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  && contextType !== null) {
    context = readContext(contextType);
  } else {
    context = maskedLegacyContext;
  }

  var instance = new ctor(props, context);

  {
    if (typeof ctor.getDerivedStateFromProps === 'function' && (instance.state === null || instance.state === undefined)) {
      var componentName = getComponentNameFromType(ctor) || 'Component';

      if (!didWarnAboutUninitializedState.has(componentName)) {
        didWarnAboutUninitializedState.add(componentName);

        error('`%s` uses `getDerivedStateFromProps` but its initial state is ' + '%s. This is not recommended. Instead, define the initial state by ' + 'assigning an object to `this.state` in the constructor of `%s`. ' + 'This ensures that `getDerivedStateFromProps` arguments have a consistent shape.', componentName, instance.state === null ? 'null' : 'undefined', componentName);
      }
    } // If new component APIs are defined, "unsafe" lifecycles won't be called.
    // Warn about these lifecycles if they are present.
    // Don't warn about react-lifecycles-compat polyfilled methods though.


    if (typeof ctor.getDerivedStateFromProps === 'function' || typeof instance.getSnapshotBeforeUpdate === 'function') {
      var foundWillMountName = null;
      var foundWillReceivePropsName = null;
      var foundWillUpdateName = null;

      if (typeof instance.componentWillMount === 'function' && instance.componentWillMount.__suppressDeprecationWarning !== true) {
        foundWillMountName = 'componentWillMount';
      } else if (typeof instance.UNSAFE_componentWillMount === 'function') {
        foundWillMountName = 'UNSAFE_componentWillMount';
      }

      if (typeof instance.componentWillReceiveProps === 'function' && instance.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
        foundWillReceivePropsName = 'componentWillReceiveProps';
      } else if (typeof instance.UNSAFE_componentWillReceiveProps === 'function') {
        foundWillReceivePropsName = 'UNSAFE_componentWillReceiveProps';
      }

      if (typeof instance.componentWillUpdate === 'function' && instance.componentWillUpdate.__suppressDeprecationWarning !== true) {
        foundWillUpdateName = 'componentWillUpdate';
      } else if (typeof instance.UNSAFE_componentWillUpdate === 'function') {
        foundWillUpdateName = 'UNSAFE_componentWillUpdate';
      }

      if (foundWillMountName !== null || foundWillReceivePropsName !== null || foundWillUpdateName !== null) {
        var _componentName = getComponentNameFromType(ctor) || 'Component';

        var newApiName = typeof ctor.getDerivedStateFromProps === 'function' ? 'getDerivedStateFromProps()' : 'getSnapshotBeforeUpdate()';

        if (!didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName)) {
          didWarnAboutLegacyLifecyclesAndDerivedState.add(_componentName);

          error('Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' + '%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\n' + 'The above lifecycles should be removed. Learn more about this warning here:\n' + 'https://reactjs.org/link/unsafe-component-lifecycles', _componentName, newApiName, foundWillMountName !== null ? "\n  " + foundWillMountName : '', foundWillReceivePropsName !== null ? "\n  " + foundWillReceivePropsName : '', foundWillUpdateName !== null ? "\n  " + foundWillUpdateName : '');
        }
      }
    }
  }

  return instance;
}

function checkClassInstance(instance, ctor, newProps) {
  {
    var name = getComponentNameFromType(ctor) || 'Component';
    var renderPresent = instance.render;

    if (!renderPresent) {
      if (ctor.prototype && typeof ctor.prototype.render === 'function') {
        error('%s(...): No `render` method found on the returned component ' + 'instance: did you accidentally return an object from the constructor?', name);
      } else {
        error('%s(...): No `render` method found on the returned component ' + 'instance: you may have forgotten to define `render`.', name);
      }
    }

    if (instance.getInitialState && !instance.getInitialState.isReactClassApproved && !instance.state) {
      error('getInitialState was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Did you mean to define a state property instead?', name);
    }

    if (instance.getDefaultProps && !instance.getDefaultProps.isReactClassApproved) {
      error('getDefaultProps was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Use a static property to define defaultProps instead.', name);
    }

    if (instance.propTypes) {
      error('propTypes was defined as an instance property on %s. Use a static ' + 'property to define propTypes instead.', name);
    }

    if (instance.contextType) {
      error('contextType was defined as an instance property on %s. Use a static ' + 'property to define contextType instead.', name);
    }

    {
      if (instance.contextTypes) {
        error('contextTypes was defined as an instance property on %s. Use a static ' + 'property to define contextTypes instead.', name);
      }

      if (ctor.contextType && ctor.contextTypes && !didWarnAboutContextTypeAndContextTypes.has(ctor)) {
        didWarnAboutContextTypeAndContextTypes.add(ctor);

        error('%s declares both contextTypes and contextType static properties. ' + 'The legacy contextTypes property will be ignored.', name);
      }
    }

    if (typeof instance.componentShouldUpdate === 'function') {
      error('%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', name);
    }

    if (ctor.prototype && ctor.prototype.isPureReactComponent && typeof instance.shouldComponentUpdate !== 'undefined') {
      error('%s has a method called shouldComponentUpdate(). ' + 'shouldComponentUpdate should not be used when extending React.PureComponent. ' + 'Please extend React.Component if shouldComponentUpdate is used.', getComponentNameFromType(ctor) || 'A pure component');
    }

    if (typeof instance.componentDidUnmount === 'function') {
      error('%s has a method called ' + 'componentDidUnmount(). But there is no such lifecycle method. ' + 'Did you mean componentWillUnmount()?', name);
    }

    if (typeof instance.componentDidReceiveProps === 'function') {
      error('%s has a method called ' + 'componentDidReceiveProps(). But there is no such lifecycle method. ' + 'If you meant to update the state in response to changing props, ' + 'use componentWillReceiveProps(). If you meant to fetch data or ' + 'run side-effects or mutations after React has updated the UI, use componentDidUpdate().', name);
    }

    if (typeof instance.componentWillRecieveProps === 'function') {
      error('%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', name);
    }

    if (typeof instance.UNSAFE_componentWillRecieveProps === 'function') {
      error('%s has a method called ' + 'UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?', name);
    }

    var hasMutatedProps = instance.props !== newProps;

    if (instance.props !== undefined && hasMutatedProps) {
      error('%s(...): When calling super() in `%s`, make sure to pass ' + "up the same props that your component's constructor was passed.", name, name);
    }

    if (instance.defaultProps) {
      error('Setting defaultProps as an instance property on %s is not supported and will be ignored.' + ' Instead, define defaultProps as a static property on %s.', name, name);
    }

    if (typeof instance.getSnapshotBeforeUpdate === 'function' && typeof instance.componentDidUpdate !== 'function' && !didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor)) {
      didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor);

      error('%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). ' + 'This component defines getSnapshotBeforeUpdate() only.', getComponentNameFromType(ctor));
    }

    if (typeof instance.getDerivedStateFromProps === 'function') {
      error('%s: getDerivedStateFromProps() is defined as an instance method ' + 'and will be ignored. Instead, declare it as a static method.', name);
    }

    if (typeof instance.getDerivedStateFromError === 'function') {
      error('%s: getDerivedStateFromError() is defined as an instance method ' + 'and will be ignored. Instead, declare it as a static method.', name);
    }

    if (typeof ctor.getSnapshotBeforeUpdate === 'function') {
      error('%s: getSnapshotBeforeUpdate() is defined as a static method ' + 'and will be ignored. Instead, declare it as an instance method.', name);
    }

    var _state = instance.state;

    if (_state && (typeof _state !== 'object' || isArray(_state))) {
      error('%s.state: must be set to an object or null', name);
    }

    if (typeof instance.getChildContext === 'function' && typeof ctor.childContextTypes !== 'object') {
      error('%s.getChildContext(): childContextTypes must be defined in order to ' + 'use getChildContext().', name);
    }
  }
}

function callComponentWillMount(type, instance) {
  var oldState = instance.state;

  if (typeof instance.componentWillMount === 'function') {
    {
      if ( instance.componentWillMount.__suppressDeprecationWarning !== true) {
        var componentName = getComponentNameFromType(type) || 'Unknown';

        if (!didWarnAboutDeprecatedWillMount[componentName]) {
          warn( // keep this warning in sync with ReactStrictModeWarning.js
          'componentWillMount has been renamed, and is not recommended for use. ' + 'See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n' + '* Move code from componentWillMount to componentDidMount (preferred in most cases) ' + 'or the constructor.\n' + '\nPlease update the following components: %s', componentName);

          didWarnAboutDeprecatedWillMount[componentName] = true;
        }
      }
    }

    instance.componentWillMount();
  }

  if (typeof instance.UNSAFE_componentWillMount === 'function') {
    instance.UNSAFE_componentWillMount();
  }

  if (oldState !== instance.state) {
    {
      error('%s.componentWillMount(): Assigning directly to this.state is ' + "deprecated (except inside a component's " + 'constructor). Use setState instead.', getComponentNameFromType(type) || 'Component');
    }

    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
}

function processUpdateQueue(internalInstance, inst, props, maskedLegacyContext) {
  if (internalInstance.queue !== null && internalInstance.queue.length > 0) {
    var oldQueue = internalInstance.queue;
    var oldReplace = internalInstance.replace;
    internalInstance.queue = null;
    internalInstance.replace = false;

    if (oldReplace && oldQueue.length === 1) {
      inst.state = oldQueue[0];
    } else {
      var nextState = oldReplace ? oldQueue[0] : inst.state;
      var dontMutate = true;

      for (var i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
        var partial = oldQueue[i];
        var partialState = typeof partial === 'function' ? partial.call(inst, nextState, props, maskedLegacyContext) : partial;

        if (partialState != null) {
          if (dontMutate) {
            dontMutate = false;
            nextState = assign({}, nextState, partialState);
          } else {
            assign(nextState, partialState);
          }
        }
      }

      inst.state = nextState;
    }
  } else {
    internalInstance.queue = null;
  }
} // Invokes the mount life-cycles on a previously never rendered instance.


function mountClassInstance(instance, ctor, newProps, maskedLegacyContext) {
  {
    checkClassInstance(instance, ctor, newProps);
  }

  var initialState = instance.state !== undefined ? instance.state : null;
  instance.updater = classComponentUpdater;
  instance.props = newProps;
  instance.state = initialState; // We don't bother initializing the refs object on the server, since we're not going to resolve them anyway.
  // The internal instance will be used to manage updates that happen during this mount.

  var internalInstance = {
    queue: [],
    replace: false
  };
  set(instance, internalInstance);
  var contextType = ctor.contextType;

  if (typeof contextType === 'object' && contextType !== null) {
    instance.context = readContext(contextType);
  } else {
    instance.context = maskedLegacyContext;
  }

  {
    if (instance.state === newProps) {
      var componentName = getComponentNameFromType(ctor) || 'Component';

      if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
        didWarnAboutDirectlyAssigningPropsToState.add(componentName);

        error('%s: It is not recommended to assign props directly to state ' + "because updates to props won't be reflected in state. " + 'In most cases, it is better to use props directly.', componentName);
      }
    }
  }

  var getDerivedStateFromProps = ctor.getDerivedStateFromProps;

  if (typeof getDerivedStateFromProps === 'function') {
    instance.state = applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, initialState, newProps);
  } // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.


  if (typeof ctor.getDerivedStateFromProps !== 'function' && typeof instance.getSnapshotBeforeUpdate !== 'function' && (typeof instance.UNSAFE_componentWillMount === 'function' || typeof instance.componentWillMount === 'function')) {
    callComponentWillMount(ctor, instance); // If we had additional state updates during this life-cycle, let's
    // process them now.

    processUpdateQueue(internalInstance, instance, newProps, maskedLegacyContext);
  }
}

// Ids are base 32 strings whose binary representation corresponds to the
// position of a node in a tree.
// Every time the tree forks into multiple children, we add additional bits to
// the left of the sequence that represent the position of the child within the
// current level of children.
//
//      00101       00010001011010101
//      ╰─┬─╯       ╰───────┬───────╯
//   Fork 5 of 20       Parent id
//
// The leading 0s are important. In the above example, you only need 3 bits to
// represent slot 5. However, you need 5 bits to represent all the forks at
// the current level, so we must account for the empty bits at the end.
//
// For this same reason, slots are 1-indexed instead of 0-indexed. Otherwise,
// the zeroth id at a level would be indistinguishable from its parent.
//
// If a node has only one child, and does not materialize an id (i.e. does not
// contain a useId hook), then we don't need to allocate any space in the
// sequence. It's treated as a transparent indirection. For example, these two
// trees produce the same ids:
//
// <>                          <>
//   <Indirection>               <A />
//     <A />                     <B />
//   </Indirection>            </>
//   <B />
// </>
//
// However, we cannot skip any node that materializes an id. Otherwise, a parent
// id that does not fork would be indistinguishable from its child id. For
// example, this tree does not fork, but the parent and child must have
// different ids.
//
// <Parent>
//   <Child />
// </Parent>
//
// To handle this scenario, every time we materialize an id, we allocate a
// new level with a single slot. You can think of this as a fork with only one
// prong, or an array of children with length 1.
//
// It's possible for the size of the sequence to exceed 32 bits, the max
// size for bitwise operations. When this happens, we make more room by
// converting the right part of the id to a string and storing it in an overflow
// variable. We use a base 32 string representation, because 32 is the largest
// power of 2 that is supported by toString(). We want the base to be large so
// that the resulting ids are compact, and we want the base to be a power of 2
// because every log2(base) bits corresponds to a single character, i.e. every
// log2(32) = 5 bits. That means we can lop bits off the end 5 at a time Strings are now always interpreted as ` +\n                    `exact matches; use a RegExp for partial or wildcard matches.`);\n            }\n        }\n        const matchCallback = ({ url }) => {\n            if (process.env.NODE_ENV !== 'production') {\n                if (url.pathname === captureUrl.pathname &&\n                    url.origin !== captureUrl.origin) {\n                    logger.debug(`${capture} only partially matches the cross-origin URL ` +\n                        `${url.toString()}. This route will only handle cross-origin requests ` +\n                        `if they match the entire URL.`);\n                }\n            }\n            return url.href === captureUrl.href;\n        };\n        // If `capture` is a string then `handler` and `method` must be present.\n        route = new Route(matchCallback, handler, method);\n    }\n    else if (capture instanceof RegExp) {\n        // If `capture` is a `RegExp` then `handler` and `method` must be present.\n        route = new RegExpRoute(capture, handler, method);\n    }\n    else if (typeof capture === 'function') {\n        // If `capture` is a function then `handler` and `method` must be present.\n        route = new Route(capture, handler, method);\n    }\n    else if (capture instanceof Route) {\n        route = capture;\n    }\n    else {\n        throw new WorkboxError('unsupported-route-type', {\n            moduleName: 'workbox-routing',\n            funcName: 'registerRoute',\n            paramName: 'capture',\n        });\n    }\n    const defaultRouter = getOrCreateDefaultRouter();\n    defaultRouter.registerRoute(route);\n    return route;\n}\nexport { registerRoute };\n","/*\n  Copyright 2019 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport { getOrCreateDefaultRouter } from './utils/getOrCreateDefaultRouter.js';\nimport './_version.js';\n/**\n * If a Route throws an error while handling a request, this `handler`\n * will be called and given a chance to provide a response.\n *\n * @param {workbox-routing~handlerCallback} handler A callback\n * function that returns a Promise resulting in a Response.\n *\n * @memberof workbox-routing\n */\nfunction setCatchHandler(handler) {\n    const defaultRouter = getOrCreateDefaultRouter();\n    defaultRouter.setCatchHandler(handler);\n}\nexport { setCatchHandler };\n","/*\n  Copyright 2019 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport { getOrCreateDefaultRouter } from './utils/getOrCreateDefaultRouter.js';\nimport './_version.js';\n/**\n * Define a default `handler` that's called when no routes explicitly\n * match the incoming request.\n *\n * Without a default handler, unmatched requests will go against the\n * network as if there were no service worker present.\n *\n * @param {workbox-routing~handlerCallback} handler A callback\n * function that returns a Promise resulting in a Response.\n *\n * @memberof workbox-routing\n */\nfunction setDefaultHandler(handler) {\n    const defaultRouter = getOrCreateDefaultRouter();\n    defaultRouter.setDefaultHandler(handler);\n}\nexport { setDefaultHandler };\n"],"names":["self","_","e","defaultMethod","validMethods","normalizeHandler","handler","assert","hasMethod","moduleName","className","funcName","paramName","isType","handle","Route","constructor","match","method","isOneOf","setCatchHandler","catchHandler","NavigationRoute","allowlist","denylist","isArrayOfClass","RegExp","options","_match","_allowlist","_denylist","url","request","mode","pathnameAndSearch","pathname","search","regExp","test","logger","log","toString","some","debug","RegExpRoute","isInstance","result","exec","href","origin","location","index","slice","Router","_routes","Map","_defaultHandlerMap","routes","addFetchListener","addEventListener","event","responsePromise","handleRequest","respondWith","addCacheListener","data","type","payload","urlsToCache","requestPromises","Promise","all","map","entry","Request","waitUntil","ports","then","postMessage","URL","protocol","startsWith","sameOrigin","params","route","findMatchingRoute","debugMessages","push","has","get","getFriendlyURL","groupCollapsed","forEach","msg","Array","isArray","groupEnd","err","reject","_catchHandler","catch","error","catchErr","Error","matchResult","warn","length","undefined","Object","keys","setDefaultHandler","set","registerRoute","unregisterRoute","WorkboxError","routeIndex","indexOf","splice","defaultRouter","getOrCreateDefaultRouter","capture","captureUrl","valueToCheck","wildcards","matchCallback"],"mappings":";;;;IAEA,IAAI;IACAA,EAAAA,IAAI,CAAC,uBAAD,CAAJ,IAAiCC,CAAC,EAAlC;IACH,CAFD,CAGA,OAAOC,CAAP,EAAU;