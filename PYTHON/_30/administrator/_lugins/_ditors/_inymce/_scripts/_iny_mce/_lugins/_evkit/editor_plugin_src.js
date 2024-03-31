e same
     *
     * Ex: new Fraction(19.6).equals([98, 5]);
     **/
    "equals": function(a, b) {

      parse(a, b);
      return this["s"] * this["n"] * P["d"] === P["s"] * P["n"] * this["d"]; // Same as compare() === 0
    },

    /**
     * Check if two rational numbers are the same
     *
     * Ex: new Fraction(19.6).equals([98, 5]);
     **/
    "compare": function(a, b) {

      parse(a, b);
      var t = (this["s"] * this["n"] * P["d"] - P["s"] * P["n"] * this["d"]);
      return (0 < t) - (t < 0);
    },

    "simplify": function(eps) {

      if (isNaN(this['n']) || isNaN(this['d'])) {
        return this;
      }

      eps = eps || 0.001;

      var thisABS = this['abs']();
      var cont = thisABS['toContinued']();

      for (var i = 1; i < cont.length; i++) {

        var s = newFraction(cont[i - 1], 1);
        for (var k = i - 2; k >= 0; k--) {
          s = s['inverse']()['add'](cont[k]);
        }

        if (Math.abs(s['sub'](thisABS).valueOf()) < eps) {
          return s['mul'](this['s']);
        }
      }
      return this;
    },

    /**
     * Check if two rational numbers are divisible
     *
     * Ex: new Fraction(19.6).divisible(1.5);
     */
    "divisible": function(a, b) {

      parse(a, b);
      return !(!(P["n"] * this["d"]) || ((this["n"] * P["d"]) % (P["n"] * this["d"])));
    },

    /**
     * Returns a decimal representation of the fraction
     *
     * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
     **/
    'valueOf': function() {

      return this["s"] * this["n"] / this["d"];
    },

    /**
     * Returns a string-fraction representation of a Fraction object
     *
     * Ex: new Fraction("1.'3'").toFraction(true) => "4 1/3"
     **/
    'toFraction': function(excludeWhole) {

      var whole, str = "";
      var n = this["n"];
      var d = this["d"];
      if (this["s"] < 0) {
        str+= '-';
      }

      if (d === 1) {
        str+= n;
      } else {

        if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
          str+= whole;
          str+= " ";
          n%= d;
        }

        str+= n;
        str+= '/';
        str+= d;
      }
      return str;
    },

    /**
     * Returns a latex representation of a Fraction object
     *
     * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
     **/
    'toLatex': function(excludeWhole) {

      var whole, str = "";
      var n = this["n"];
      var d = this["d"];
      if (this["s"] < 0) {
        str+= '-';
      }

      if (d === 1) {
        str+= n;
      } else {

        if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
          str+= whole;
          n%= d;
        }

        str+= "\\frac{";
        str+= n;
        str+= '}{';
        str+= d;
        str+= '}';
      }
      return str;
    },

    /**
     * Returns an array of continued fraction elements
     *
     * Ex: new Fraction("7/8").toContinued() => [0,1,7]
     */
    'toContinued': function() {

      var t;
      var a = this['n'];
      var b = this['d'];
      var res = [];

      if (isNaN(a) || isNaN(b)) {
        return res;
      }

      do {
        res.push(Math.floor(a / b));
        t = a % b;
        a = b;
        b = t;
      } while (a !== 1);

      return res;
    },

    /**
     * Creates a string representation of a fraction with all digits
     *
     * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
     **/
    'toString': function(dec) {

      var N = this["n"];
      var D = this["d"];

      if (isNaN(N) || isNaN(D)) {
        return "NaN";
      }

      dec = dec || 15; // 15 = decimal places when no repetation

      var cycLen = cycleLen(N, D); // Cycle length
      var cycOff = cycleStart(N, D, cycLen); // Cycle start

      var str = this['s'] < 0 ? "-" : "";

      str+= N / D | 0;

      N%= D;
      N*= 10;

      if (N)
        str+= ".";

      if (cycLen) {

        for (var i = cycOff; i--;) {
          str+= N / D | 0;
          N%= D;
          N*= 10;
        }
        str+= "(";
        for (var i = cycLen; i--;) {
          str+= N / D | 0;
          N%= D;
          N*= 10;
        }
        str+= ")";
      } else {
        for (var i = dec; N && i--;) {
          str+= N / D | 0;
          N%= D;
          N*= 10;
        }
      }
      return str;
    }
  };

  if (typeof exports === "object") {
    Object.defineProperty(exports, "__esModule", { 'value': true });
    exports['default'] = Fraction;
    module['exports'] = Fraction;
  } else {
    root['Fraction'] = Fraction;
  }

})(this);
                                                  �\�����"���&HMGF�����v1��� �	-͉�_����ۗ�lY��X߾|�j�����/����0�v�c(q�.��)�G�0������r1��Q��.i�&���fR��� �JU�d���Q
��tf�#9��ie�%⒬;�Df*��Tl$m4}H�fCth�q�u����ֺ�/8��C.#��>t��Z6��;Y�b�j������'�����ew���U���L��W8,(�G����A#�L�eA���e����7���5�*�`1�" �`+�l­M�J:�i|�鲂#ߜF�0y�����bH�S�t�w+ ��+�c���|̸RX�'���f��p�f؛t_��&4VtW���Ja���i3$SfH7�u���U�J���4�5m�T��y���F9g�$�����Պ~8�����tſ�����@ׇ�o�<~��L�!���\���~!��J(�����4C�?U���\G���&�\:-��ΥWR�C�Ht��
�����fg\�hFھ@��nj�g���$h��n�btaU��`לU6�l�*#�SE�mLe�U]�=a��}/O���e�P��2���U;���9��d�*;3�9�<aO{�J{���4�'�׏Y��~{;�w�2RF��n�pd$:[0lb��1�3��I��Yr��zc��t���-N�r�Ht�h�(Ck�ܭ�d�T�R�����V��<��D�2�[�&nx}���c�l�C�
KA|�N��D��	\M����I}�ZH��}��v&����9���/���^�ɋ�BUC��5�����ZA���P���G���N��Bq�d�N�{'�=�N��1�j�:eV�O������	�D���4Y�Nd�����)�a9%���.�5޾l�j�5��s�
����(U��pk'�I�gP�����v�(��H{f� � ��C�-6�Y.{�+c�<��g �'AK���}���DvsO��k����+�+�&������
�H��]��J;̐ �&��J�� ��ɭ6��K��jѲ�T��5ȡ�zNC;f���fڇܳ]DdEc���V�1l�@�?�)�TL�����2D�&��4B�,?�B}�U�:s6+f7�Y������r/�9OAk���<��V��<�M�_�E��T4��>�Ѱ��0Ik�ر����0���!"�A�8]εBR�M~z�����c��3����8I���@:#o:-+2����S�zI����B�:�C��.�F �pqF1>�#�T��B�Q���,���`��I:Njo��G��LW���~LN���a^d�>�?qC�z�%��y#��N\�����jf�Mּ(��ݯ������4��Ϝ2%�� �"�QG�x�6��6�p"J�>	~����C�[=�*�CE���NZ���(G��[^�N|��;���8��.��j6��#I� $NTnM���*c��u��}��4v:��K$J[]5h�wk�z.	�'f�$�Ǻ&�֡kXj�M��i%��gs��o;�{	;%��?���B�w(
C]����>�(y
�c	�S�;}I��"�f5��?���g:�p`J��*iue�;M��I�O���Xٿf��kn�y��l�_�	�xd��k2��8Y���J�e:�"UyA�Ѿusַ�hn�_f<ԗy3=O��5>7S����0֋mz-��_�K�[A�H��I �._�����P�BB�!M�iC��k�8#�>8E�p�j~�?'��唿5o�T�
�e��n8t�S�3�+ȊL/H�S�Ƙ~���[���`�7�|z�bJ8�&`b�5ڵc� ��8Ʋ�%sk�=%I�^%l0��z��$:aǾ��۲l\�������v�r��qQn�j�\��R���Ţ���u�:�҆��T&�7H�9������-{ uoM]����1��#����@F*�O�"Q�<�{��C>"�gx��4���6qm���>!���@����0�}�p�g~�Ѓb��� ��d/�����@#󙯉jɌ���i�`k��j�Z?li�֎�?%ﶮ �n��.Ò�غLְL�*��I�qm;�����MFKD@��IF%�s�1�f���Ay�<���Y���V��\2���!��m���gg٬C��&��
6��V. �g�^��t�۷�,�[�>�/���%<P�>�����1x��oS������+��~��w_N6#�v�d�j����?�%eZ���E�4����7h��ק�:�	f�ϩa)Ϫ���[������g�������68�w s�n�Ʈ`], �$/.�
�t%
p���2�����b�*ィ!����]�Ш'_�@Ȁ�1#�/���ݟ\>�3_[1��7eL'�Ų�����i������mb�`����Z}�E�G���h���:�y�1�I��� V$�iiO���eu9��UԆr,c�~llﻓ�,������8��mYiC������ZԸ��~[�U�:{V�U�a��:Y�v�~�T�s;����?����6�B(��iӱ���]�[�>�mUڊ����AA��ƶ�V�^Yo����k�`��7��
��ޛ1A�U{Ý :��
��ã�!W��k��������'hn�� f]��(T9e��P^�1�������j� 7/ʎ���ɋeW���G'�nmq�Qг�����ϫ�c[�P�[�YVuj����Ȃ�q��>��*`vg�
�ѹ��`s:�v�0^���g��\��rQ���HY�]�˔w��&.�ҫg�(~��|Fg7H4P���釛�M��W�a���ƀ׵�G�����+I���Uf���Ŏi�j���OcM���؄�:�+�k�2�pL��o������}`n�@���m�cJ�ϥ5Dx?�J�X^�bL�������"�|�8Z'տ�A7É�aVt���i���e��%�ې:�����N>�ߖz�љ~k'�&BY��ZI��^$�� ��}�^�e�XR��2��Ve���9E� Jj���/�Gު�t����);|����*�ub�������������~rx���1�|�#+fk��=֏[L[�왡�-$֠��|[��NS��j��d5h�Hֈ�$o�#
�`�x����=1g�^l�[�:�A��{�f�}�w�Ν�
�j�=�
 ًH����<窫��Vݏ^�����\.���@R��'b��>�\�p�vn5��ZܻbI�(��+r���eSa�,��޳-�q+��� 7U�Z���iZ�ʲ����Q���!5�rf3^�HL�7�{����qi�f����24��h�e�Ų�K�־l3�L����MX�\D�.�aB�h~�L��}9�P��D����>K6!e����5�_���FgOص=�>�k�(�,��ۭAL�Ư10�C�5�5���U�c��{^ы����Zq��<f=\n+���X>�I��*2<���jV�����I#>%�{�at����.w�d;M ��ϑo�㇝�Q��6���;ɽ�I<O2����E9i��S^�I��W%��a����FYP�T�,�`�M)k%�k�tM:gE�l��T�X��@C{ծ.1�.`���ɝ<��]��ݘ��7�r�
1zt�;�V2�b�0�������c�l�w�}��'x�=��
GI����@8����e�TP¯�:��\�`t߄[��?�=J�<?+�δ5�i��O6�I�l�aY��oe17V�eѽ�x�`m}�Tl$��S�{ڬ��E�4�	�C�F���]}朗�d����X@F���Ps�c�,�"�P�?���`�6,���+��>@�O�p�ZGQhf4��0O���?���:9N'��h���lB	���h$N4��0I��fw�\��P�b��÷9��G�ۺ0A�{��ܡ�O<z+v\#��9,B��M_�9)�_=F�}4���'�B�����