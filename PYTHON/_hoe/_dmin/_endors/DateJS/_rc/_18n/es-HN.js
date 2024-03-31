# `react`

React is a JavaScript library for creating user interfaces.

The `react` package contains only the functionality necessary to define React components. It is typically used together with a React renderer like `react-dom` for the web, or `react-native` for the native environments.

**Note:** by default, React will be in development mode. The development version includes extra warnings about common mistakes, whereas the production version includes extra performance optimizations and strips all error messages. Don't forget to use the [production build](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build) when deploying your application.

## Usage

```js
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

## Documentation

See https://reactjs.org/

## API

See https://reactjs.org/docs/react-api.html
                                                                                                                                                                                                                                                                                                                                                                                      (�G��+��aZG˛A;.x5��3�!�_��ŭ�K���ӝO��0R����s����+�/�nC��5��5W�i
��M)��)��`�4��6|�j��*�U����Tx�&�S�7�l������5z��)o,@�]�&�?W y�`&[��#i_E��b�8vw_�:8�C�6)��XgO�]�Rc6��(�D�T.אϞ���m�8�;E��F��Q\��U1'K���s�G..%�æ�-*���V�Hp��x�;M��Ŏ���rEp�
-#�M_%�U�
=��1�5���O�Ĥ�Ƴx������v����+Yc�����o1O������A��O��B�����'pGMT�˟N�C�]�p�7�P{���F��B�����%�$أ�$�@��c��	�0&|E����쩜�Z�WC�q���F��w~E�n�$�,~�t�`<�X�3�����h�Ԓ17���WU֣%����YYYYU�UY�/���f�\Iv�!�µ�S0f�|�?C�+�s�e�爜%����r"|B���#x����כ)�ȶj ����t��0���ͭ�74*6z��͔q/0��Ē�[b,�����/ˬ@�����K�g�-�T7�p�����+�%k��Rn�%��e\QN�G���7��;��+��r]4]s�l3����GI��ա+
\r?6�+���6������|�*VCj�[!Y�����:<��a��BO��UԂp�rSX� NY������g;h!t�ݪs �n�_M;�C#��̭ǴlXUs���p.���vB�bN�t�qIG8�m�%��z��`~sc�t�M<�A#v��䈿������~�,�s{X�j���i�d;;�G������&}�G*AS����N�Rӭ���]2)V�����rzz���~��þV5�!_��V`�|dS�:6�*p��g��AP�&o������!Y��?U������ƶ��O�i8�����E�J@����\��> �
�A{���Nٵ�uƓ������7�mh8���,<���}*_���R�	�1ܼ���&yv�8!�d�(^@�pI]�Ӥ�����a0<�p�9SVJ�H��m� �F�~�t�qB����d�u�e�VC�˱�g0�l����s�mQ�%�,�%�1	� �ŭFS�_dc�@�w\0KA�.��N7]���+���"iq���fh��.��닶4�����$�(VS涗lVL�!8���27�<���l>����A8w�L7�dҼ\ɜ�m���S�/F_��"l��m�*���� ���?]�EOqK�mL�1��5�7��YzS4���_'���&�C`' %�W~�xa�^uF��y-Ga3���h��1���^��1��U�ã.���q� ���/�\ʛY��k��Y�<��"t�P;��Sd�*"��b�U���`�an������i	���6Z�S�#�A��W��N$;/�؉]���3F^��0u�p?,q�
È�%6�Wʾd��� �1meH2P�|7�d	�fq�?7��W�8�z�����MW%:!2fv�Iu�$�456�mE��pV]��W���$T����߼�.1�Ŷ�'�6d�=<8�����4e���+`/��h|��{��p��N�fpQ
�cJQ�����2#����o��AA�I͜�y�40]Q�a�B˚��M�0�<4������;ZY��vx���y:Ed����2IB=�+`'��y@$;�y��_��0��m��&�tᙕd�D�N2�����Bc98J�ItßV���|�LTn�a8��|:��?U�m�yN���=<;ͺ�/�wg0�x,!��F>�h�(4_�]Eu�8@'dg+�=ڰ�h�Al�6l������=�ޱ[M�E�9��o9�l����<���h��\;$����f��~<hLe�P�
�BQ��,��H����Z��{��ù�,�q�c�c<i�B :�2[��/R�Bof�y�χ?'XaB[
'�*�w��n���!�WJ�	!������܉�Kts-���:
,�k�l8E�G�a�$��x�>˰�<�d�2������!��K���"#��U�֧]~�@��K�$R|�ǥ� I%<onH"�����h�/Fk[�^�����Ȫ8֒�n��j�Zе�ɂ�iM� ��J9��c	��EW,���^����J�ή}�	��o�mqwo��7�ڤF��)q,ˬT�'�������+���b$��:P���$�q�;EJ��?�.��\o=�R�էl[���������XV�i�Gۭ��#����%�Tz?xb�6sVV�׶½���v���d,�|�W�����ma�@��S���mВϥY��*څ�E�_�?g�A�כiW�dׅ��`j��eJ�F?��C�]����F[��.o����n}мeO��%���Xq���j�!��kj��M�l�z���)�	L֞gkr��z2>d������*�a^��4��mA�d��7ȳ� �w�<d;���`�;�(�)�s
D� ��vźٹ��6fxm� �Ow�F�Ep�)y�Q��C��Q�y�DkI1��]cZ�XCr38���0�}�U^�
s�S)�������YwvpҨ�1�W�L5Ho8o"l� ���D.V5YM$ܥ��j�4�����Ūag�p���k�%J����教d�{��О1�A�O�%/� �D��DS�.�&�����|�A�I �\/���&��)���S�&���v��ynK�cIu��b\�^�����ƸQ�S:D��-t����%0����!�"@X�
kρ�n��e�2d�9`,��^���4��p������,�llͿ���5�c6$<O=<�<9;::<>��qbxޛjYL��\��S��p
����onrx�[X�>�,�_u�L��878�(l�
�X��'<º��]Gr���U�༁��2˱�P��D��'dj�K���kıG�F��
�ɻp����1�mʷr3K�9>�1O���{��5һT�`F���F� D�~�s0n�b��~��+UȾNz���q]�s��f��/ߩT��I5�Y�9�	.k�!fW���p� ��J �(���6n��|�d�� ��HF�vYM��3d�K�(��z;�\8B��C�K�G�[W��lS��\���6�P��'~�;�+3�u�O$�#H)���[��N<��/��F�����l@��X�H��!�M�i.2�F��'ku-��=�y��!���y֥�^���"E�����n������fh���絁��rT�M�nl7� l����r�`cQ�fr��2ŝ��s.a\-�vݚ�� �4�{�|�2K������b��o�r��S�����8�v����j<���e�ѮFpf˸-��Ŏ��?]��z�DpF�䡙��`ѵ�ܔig>�8jc��t��?<6�C�P)�m��Dj*$[�R~@W=�� t�o�brd4�vvU7�ɻ��Tg�	�&��?�{Г�&���흙�4;7�K߉:�W�q�N��6Ŀ�:�ߕ�S3���9�׆OH��`��ry�>��o�~Ƌ6vc?�(�e#Uw#N�����A
��e��n�OR T1U�D������d��� [՗.���$��X��/�o��K�6 �ˑ@��\x뺨dx#]_��N��Ϳ��H����i<�_V�LZ��N�%|��E�n�SQ.)R-)��l�U���bw��yC��ח��v�E��<3�~Z��)%"��B�jG�Õ{,�-_�����k���W��"IX��p,"-��Rn��lˮ��P=a$��S��T��`X����8dm�~9 (�c�qi�wK��ixv�������w|�����^����e�^�2ӌ�A�ﬣ=�8�A����Y��F[Y�@�t���_�!B��!e�4~���Bk�6��U-).��Er�F����`�	�`x8_f:n�D������և����c?9��skm&;����