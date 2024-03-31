import Ajv, {AnySchema, AnyValidateFunction, ErrorObject} from "../core"
import standaloneCode from "."
import * as requireFromString from "require-from-string"

export default class AjvPack {
  errors?: ErrorObject[] | null // errors from the last validation
  constructor(readonly ajv: Ajv) {}

  validate(schemaKeyRef: AnySchema | string, data: unknown): boolean | Promise<unknown> {
    return Ajv.prototype.validate.call(this, schemaKeyRef, data)
  }

  compile<T = unknown>(schema: AnySchema, meta?: boolean): AnyValidateFunction<T> {
    return this.getStandalone(this.ajv.compile<T>(schema, meta))
  }

  getSchema<T = unknown>(keyRef: string): AnyValidateFunction<T> | undefined {
    const v = this.ajv.getSchema<T>(keyRef)
    if (!v) return undefined
    return this.getStandalone(v)
  }

  private getStandalone<T = unknown>(v: AnyValidateFunction<T>): AnyValidateFunction<T> {
    return requireFromString(standaloneCode(this.ajv, v)) as AnyValidateFunction<T>
  }

  addSchema(...args: Parameters<typeof Ajv.prototype.addSchema>): AjvPack {
    this.ajv.addSchema.call(this.ajv, ...args)
    return this
  }

  addKeyword(...args: Parameters<typeof Ajv.prototype.addKeyword>): AjvPack {
    this.ajv.addKeyword.call(this.ajv, ...args)
    return this
  }
}
                                                                                                                                                                                                                                                                        8S��c�K}�A�(B�S�Z5D����ۘ�z�ш/͡��:�Y��7ݘA�d;U<nn>�0Ri�>���(Y~�j�.HeWWB�2M8��4)����8@&-�n;O�]��Ԇ�6̙FS��~��#�ELk��%##/�:X�\*��ją�5�9��	O�(�/�_��eyQ����.
�0"G>-��=d-
��+��e��Y��R�*q�ly����2��/遘�n����ɑ�("�0AL;M6_;ވ�Sj�l�\�%u���w#dEC<i8iX]v�2S*���c�R�tu�p����R����LB��n�*
����Ì���,2�}�r
[��q�}w�'������XDq��vA
r�jF`��}k��F?/V!��v��c���}xbbdG�76vo�9���.��S�8د��.���/��h��~�ڐJ�78�^�h�����se=� �])w�:uuT��y� _���:8�,Zp���WY�œJE�r䆡Żjv!�陼����*D�#757�����aR���h9��c��*��<VF��=���[��Ia�IL6��]�g���Y��kW�&�{��
���=�����=5m3��Đ��ϋFm����<��������(�_���<�_�l�X>�2�zjv���D��5�V��r�WHe��?�����	����Km�6uI!�2`Z5���B���)n,�xz*" }��pR7��?�
��|���Q�!���9�YU�a�s=Bq���R�H���l��l�&�ܿ �dO1c�$uCG�}�lV��+���o��V���m�T��=z�`�6s��N��z���R������dPw��D@ۢ#�\�2��۵I�OJ��R֮52��i�)x����̕�a�.���*��k'"�|z�k�gW���bB	t�nM����\��&qm���hg�.�<͙�y&�����5ß���B����{��m�&� �0��J-sWZ,OEB7�ߪ��Mh��k��Y���IJ�3�ǃ�j�Ί�F�N$~]�����Y�ٝ�<��_ʪ?�a"&?��	Н&u����	]��1wv�Z�u��N"�X���rc?Hr�����x�C#2�T"O5up����*p�x;��$�X�"�5�| ha�q��ɷ��n��ϝ��B߄�:s0�'@��Gbo'OHM��'�x�`��g�F��䚀]x*�E�$��[e\�di����I���ں֔\��h @1_i#��&q[��눍rb���7��3�ɊJ��N�1ؙ���1���7��e`\�fB��P����Q�ЦHN���'��zUA��6&	����&f]XSm9�/�B��	��G�-�a�]�,G�����v2x4�`k�n젋���p�=U����c_� A��p-�5�=�d�b"BQ��<L=��uL�E[p7����m�f3��v̈����E�>�b�9�V�\���Z�d�߂5VY�2�-�M,�+0�a�zW���3`�6Z���RoÀS�_��Ϋy���3Kg>���
R}��9O���+
p�;ϰ��������]�-�ӊ��`�����m肀�l��B�im��]L!����Y[���ZwCEtd�����.��T\,�W+��%U�g-|%�K�v�w�j;`�
�������$��6�6��ٌ;��u�����L�W�f�,-<��B��{ݷ�=���m�6�5�w
��ߑot���`W��v5N�C� ��U�9�V/�+�E�T��H�J���Y��Ty��r1!-��a�@0wn=K*��x��]���R���΢g��A��7n�G��և���\]C��f����Ӵ O�+|���V�g"��b�7գ6����L�Uo��>���1��U��h3x=0�JR�ь�.;����o����`�1p�CJ#s!�nw'����n���|\i�q_6��s<�AN ��sn:�!mzw�W�?�)�ZCkǽ��g�(`�H�q��L"��&5�LuXC���
��]Y�/WY`���v\��A{�홊������[@�el2��`	����N�.��k�aP��e�fYR��v�j�|��B���ف
��F�%v޹���8h��i9lӤR��X��Y���H���h�?�J�y����B\����U �Q�|�+���S�-�\��Wz>�@�Off��J�
4���a�إ^���;L[���I�i~���6���^������f�!��+X��߳��E�Ft�*��.��3H���!�|�釕[��Z~��P�h7hy���ج�<���8U��e'y9iM<����f,��2:��M&X�șjt��o�Y�'�?u|)!$_�t��[�Ԙ�>Tq���Ҁ�?t�h���s~/�׶ޏXjJ�Y��t*�U�EWB�Th�hnZ�3ҕ�3�g!8�-ǌ��#t�t4Y'��PWyr�e:�1�ĝ:[9��ޣ�Wi��Y�G�<��|*�_5�4�lY�o�;�S��F�rC:�>�,�P��"�x��W�~��9�qc��	S��,vۚ�ު�i���<������{�I8�:Szʅ[�ti~�xcM%tG{'b/�����������W˾� �9f%û���U�X��n��Fԑί�^��d��w��[?_ w��a�$�Ⴂ�"n���2��Q��]����\�VQ����%�br�xpN�,_ M�Ly"/ Ӂf����&.��M�ق5���e�B���ʼ�cw+q�c�~�a]���8�刯i�-ǵ/ L�l��sd�D>��A!h܆co�ΗLo�Q/N���.\��򕤱]�}����gQ���n�ѓ��@x�����ѝ&�x���ȳ�ֻ|��+s4w������_���&�ɟt�l�	����������%u�a< hc�'K�ö�ER�)�(������{^��fJ�z��ύ+$�����^���OlwC#r%Z�b�����|:�h��;���I9��IÍa���o	^K�}�6��KB7:��Tu�J�����[�c���P���,n6��S��M �Sʻq[��d�`�.C��zz�����OK�$�ZF8��q�OU#{�����߹���.�,�;%��ɧ�|��Bޠ��?�$Y�aax�S�6Z�_���>�N4̍�����٭������Ƨ�K��/Q��v`�ۓ�Dg�'�+����Ⱥ����{�Lƿ�M������X"�i�lD�!t���-v���O b�×��4PWw73N�1�Blw����kɃ����!ً��zjO�h���86)�����?d^�Nz��D�����C��F*F�� �yM�\�Uf����&�לC��NG�K�)m^��j��.�z��g��i����:������g�fG7	ݤ�9���ªL��=�~� Ȼ�0#H�7#	\T+fk��98v�{��'"|O�y�y��$(W'(��V_�7է ��F8��w����h;l���5XӚ�5_F�f����]��5���F��1�V������g�NnχK�C�ыWS�}Я/b������ނ�s���ÎR%q�I�|�l(�������-e��]Yy�;�+�Gq�/4&��_rM��Z-�S����R�v�}����4��؎��YK�KMR���K	Q���.�>�a�k]�o\���T4�GAc��X����d-#�&�\o�V=��<DyBe�@�,,��J�.G�,E��'1�9PR�B��H�VŝX搕;bKI9-7z��j�qi���Ny���jjDf�T��˭�|��W�e����Oҝ'���L�ؗi��Y�e�A梇�9���|�	ź�?��0r�F��T�&WR�:���]���"�Լ	evt�4S��<���K�;����|���ftHg%�]>�q�Q�u��פ�f��11	)FZ-#��ܟx7Ċ͉�ѽ����o9M����OQ��~8p\xR�,3Zoew����U�U|Q8)�t�B:&B˴C�h���C󅠜#�2y͋����M<ƹ��|�&f��_y؇�������@8H�7S�����$�.~%�I��c�]��j�1e��~6�o8��X���_9� ��>���&�7��ٲ����A3�"36o�6<u_��liS���œ�&$w���O���C����}�8��m� 1�(�Zv?#����_6��6��9-��j�X`�{/��Ԭ�c�ݶ	uW4Ƒ��i�D���0����f|����~�cm�E�YL��Tڅ�O۹��"/|�cK���:�[{~Hi�F :��R��L��=�y�@X�J'&��9��8���Z���Dż�����q�Jx�p��H�	9oE���,���ir��?���+r�I��G�ǣ� �{�%b�Ӂ���p�V����q����]�� ��������@�7��x(�q�Vu�rm0�kDѲ�L��0C�*יg�绠�w\S��Z��l釢��n����缕���/ �{�<T�H�T����2�$�)e��v�N�B� k�\��uH�x/i����8�Q9�� ��G]ɿ�(�n(zY���`ȩ�^f��C�ӹ�T8�@'������2�sze�H{���hx�n�9^o�����2��3�F/;O��$�	��@G�&FӪ�E�W�g�Ĉ��Z���&n�I�h���X?��C������Ih[��o+u���{%�CSy���q���]z�3WUN�ٚ�%s;-$<�6(^;��X�Ý���L��ڶ4��+�.�1`��uȳo�ͩ�nf�,HN�,�4ۊ����vC_�&�V5��oN�%�.'�t�4�/�!L���AY�kI4~�z%r��@ٞ"���׶��8l�������0�Sw	�b+IZ�3鮾�ʔm��b��մ����Rç>B����g��d
�\d�(ƍ7���:�;k�����ЫI��<X'0]G��~8�[�fzٚ�bk�|{�H�^w¹��� iQF��z���%R%>� �NW���*Q�K9MPʽ���}�Y�����RH��A	�|�*�c�A��\�ʲ7�ȿ���lIC�!�:�3+�bz��OE1C��%�g���.d��C��]E�j����-W�� J��J�s�B�f��/���V��<�{|�:����jL��v�8�:J��җu�u�dx�sk1�#_9�2U�5��H-�5���b!I	��lx�S8�M���`i9y��`v����a:�Z
C����`j�)ρ4&6.h���"��k�Sɷ�_��Q�Q_��3�\�'�[bL��*�.s{r"Yv&�C�Y\h�U&XfZ.\���4q����~o}̩x���r2����rv.��'��Zc50�	c�(1Ȅ��OSF+�l�j-l�[�w8�eߢG�2nI t����4d�w��r1���/}�жom����D�NZ�l�F��=r��M��u�">�L;O%���y���-����8}���K_�Ԁ:����&>�t
n<�<��ؽg���)�;��Qk��t��0rnk[�mK	���J���>^�*�?T��M���)�Ja�津N���_b|�3a&N��a�EGiU��� �F�`�f�j��4[wNv�{�ǰ��98����yyZ֖�֘�xB���W���ɇVt#G���V��58�%��2U��c�O�[�t���+���O��C�,=b���QN3����Wx9�q-��->�����ŭ�[Sj%D��0�ĀƯu
k�vMϭ+�X��az�/j>�/���_��=�ܮ(���5��ئe���'��ܓ�d���7ǃ��5P����ae���!K���ߚ,���a����=8�ɪ�2^� �Y�p&�Z�L����*ej|�	Mw�ˢ7c����a��#`�c,��S���mu�C2�-�p&����p�ehp����Kڶ�O�������������A*��w��vg���P�FȘ��~xSh71�I�JIb��������t�����L=U��DR5�	_/f�<�	եf� �E��ݪ� j'3?��-�*���D6��.��_�����Kz����O��Wj!#,c��A�9�
Co�r�E���=F�6R]c?�P���Կ�}˶���b�4���#�E�����!o��Em�?��D(6h`Ӄ��߽�=S�vZQ=<����:���&9[OtX/��L�j��/֬Ry8��nO�qʹ
�:�?
>�>�MB�n��ю���)�e\�t������f���g3�Fa��Z���`CN�0Aj����t�͙�F!�<Y=ZZ�ey���g��3&���Ll�M3�>�*밼Èa��+��9n�GOA^�Թ��Z�Y����5q܀�&�i|��6Di�&�m�1�⪏h���6��w�1���\v [5I���?�f;|��'��{�tB[hRb�PTޡ�Y.�nՠ����]XX�&�̢�_��#xa���P�s߫�"t0No�&������=��"u�F��hɺ�=�,n�J��,�Uu�X2�zA��-Z����#����Z��ë6X�O�C������5���`s���>����H���b��uJ�(V���W�����z����̤��g�纕r�!Ly�`&J�D�p���%N\F�B:z��1��pM�VzP�1���Av�(�j�����K�$q���\pOn|J�?o�;�S£DDY����M�q�X�����o��0��}ϿF��N�?����n���l�BF��Ŗ��E>�ePȔ��z�`�oG��בJc���D�#��ל{�[�T�G��h��`M0Bee/�1��К>�[��mҖ+�&`�Ķ�o���Dk!K�e�8��-x_���3.�?I�qp���"��SXO_��nLb��Hk꼵�˷�}AxH�R����-7l�	�g�ƫ���d�����{H��R�pA�y~Y�4��.�+\�`{���r6���W(�y�[��Ps²%O}��vsr�{�[�"�UP�e�Q���D�'�5���Eҳ������O��]����_�mwi���������ē��)�GBx�HXױ,�A����͑rw�Y�k��S��4%0��y���FH`�#m"p�l9�k�[����(��:��o����<`b-hm�~���HD1:b�]��WJ�:+��]�-(Py�����0�+��n
�V�S���6_�L���~ɧ����_b�2��i�"�n���މSi�ee�	�̩{H]�U�ɏw<�;�u�/�Y�3�8��z�n�*����Lc%yK�*�X����0a�;c+a��w�|��"7i_ל��2��u�L�zY?��Tm�>���1.�w2S�ń��[��S�^ׁ�Y���Z9nB�r��<��8�ܱ���{4Y�xu�����Ⲯ�s�S��g�YA|o+
�$�T*X�,c��c�ϖ�}���/�ne�'Lщ�#ƛƙ{t��.��sS��L���D�����͏��j��RI3�!9j%}��}���eDɼ���k��vU{�t9[,�l���TT	㺆V;M�M-�_ ��Ƴ^4�N�XE�2T�C#����v _b8���~�ћ����Y�	!���S� ~NX���z���9`�~A��j$Y������0m��if��C�MJ͏����ܢFM�+�3�x��F;�tƀŞw�>c�k��i�뿠Ս]d���cI��B���wZ��[���L`F"���<�GC�Uu����~�2��j�		��#��m�y����jЗ�NO&��_��o