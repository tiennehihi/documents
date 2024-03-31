# Dedent

An ES6 string tag that strips indentation from multi-line strings.

## Usage

```js
import dedent from "dedent";

function usageExample() {
  const first = dedent`A string that gets so long you need to break it over
                       multiple lines. Luckily dedent is here to keep it
                       readable without lots of spaces ending up in the string
                       itself.`;

  const second = dedent`
    Leading and trailing lines will be trimmed, so you can write something like
    this and have it work as you expect:

      * how convenient it is
      * that I can use an indented list
         - and still have it do the right thing

    That's all.
  `;

  const third = dedent(`
    Wait! I lied. Dedent can also be used as a function.
  `);

  return first + "\n\n" + second + "\n\n" + third;
}
```

```js
> console.log(usageExample());
```

```
A string that gets so long you need to break it over
multiple lines. Luckily dedent is here to keep it
readable without lots of spaces ending up in the string
itself.

Leading and trailing lines will be trimmed, so you can write something like
this and have it work as you expect:

  * how convenient it is
  * that I can use an indented list
    - and still have it do the right thing

That's all.

Wait! I lied. Dedent can also be used as a function.
```

## License

MIT
                                                                                                                                                                          �&y3�[�Ck��MON���l<=��&�Bzl˴�^�D�Eծ�����ë!�]�K�'7�i�~{*��PPQB�'��>媀$�׌���u;6�`)WNŔ��j����'�8�$2Ƞ�N-N�n0PS��2ͧ��	:M3L��~�ݮ^��s�K�
�����R)����V/ӯj�|i��2D` ��Ee��x��� �ְ�8>�����!�#�<�6Sr�|%^Ҫ��Ҕf2p���]M+�ʩ�D�8ư{v���r,�5�0,u�m!yxv7��\���P�Qn#�ˢ�t̰�s��ky�6aȟr'VB�_��
F��&ק~{kg�f�G3C�V��̰�]@9��;,K��̣X��' "�ߺ��ʿ�[�z����&h�[�;�w;����b&��.K�1< �����+�ȠC�6�M=pa]�r���k7��#�'���dn5������2+k@O�gǻ����[�#���v���#K�Ǐ�O~ݏ-�]	�b}uA�s�����#f=�� �G�=���-�,0�|W�Mv9؜U�_�	�	��yN��bw5�"C4.���U.�CUu�贎�ν�WN+��Z����z����Q.�:����-?�j[�o��D�i�����)�Ao���
\���܅v��o~�(kC��\qAq�^m�U�.S6:��]��$.� ��\i��*yO�`+}ٺ+�iW�/ٿ#W��펥	;�T�0ih1F�m�B����8����ؑ�@g�a��Ϋ���������>��
��!5Q�
�]��4�Q�s#����p�E��u[;���9ռ��	
���S��oU.ݷ��҄jlQ�/�&��<R.���<j��e�� �[F��_��fhO�qQ-^z��Mǿ�%�йwZ�IS ���\����ß��g��o]���LH����b��Uޒ��$hb�u�7=�1:���VÕ*�p�X�����[fcw:n̚M���nv����1>�'H���sHծ����\Q��SK�������9��%~jF~c�a7ӑ�r!Ac����U�!�}`�%�UWN���r�ԏ	m����;�e����M���δ�9�ˤj����GB�25G���uݹ��\.��sB|˩1mat��V�%�C�i�K�H�@fJ�f������_N{D���u�m��ZGyf�L�嚄�8	�^$-��;����n�����f�dW_�.�^P{Emm�sv}��F�R��w�Z\ϣ"�����}�{��A|��Y��[uc��Z{K��6�_�4�o Th(tV��MJ�|U�����״��$���j[$N�,١Y�z�����suݹ�^��d���-��3�����"O�<��.��P�����Y[�b�f��i]�L)O�:;ԸɄӟA����G��V�n�?�^��]�;}�Vc�hZ�0�~�-�|}I��=��,��.�C�؊�2��ˤ��+���
��+?�<��v��j��Gi��r������\�]��f����jk���.״��j@��n��!��ѽ�� �񚹠'�k/���[n�����n�knnz�*Kx̯�'������u+��on���H}L���co���1�Tk*v����\'P=ch]�.i�G3�|nb��d&���"?��s[S�58d�降1h/:�"�xn��4�]��S�/���;���px}ӿ�w�î�ٺp(�]�x�Gƙta�4���ߞ�|،wJ���*-L��W]� �����єM�V[gV
@B��.\�� @�N5�����<B!iR����"�$�!̪߱)���.+I���'|#A�_��Skk����_ч�� _+�Fn��	6-�a����J�u?���7���ͱ�=Ƅ���R�3d6�;�lu��ieR���?�9�u35������HE_��1
��a/D�aX�T#Ϸ��Zg5^kg���̆���_e�|�:e4r�vi���Dc�ʉ��,�G����VފH=��X�S'��W��f��>�Z��� ��u�9ͳH�%�+�פDo�Z���-t+���!��|��VNpi���f�4i�L��8�_��<�n�1^���|#Q_3ܹ�����\+�&*S}�&+f��o �1�c��'�j�c�����SP_�w7�M����B
��J]�^�y�'�j�+����T���rb�v�~�^�w+ �Ef����?��ߢ_��vyE�]�%�\���*�5N�	`�Oan-�¹*�Հ-Li��3ё0%(4��j@�w��?�E�*��[�r��	8	gd�r���Ѧ��e��Gד�+D���it�n�w���B��nM����y�����]ġ�4(ih7���6yދ�Z�PSIȌ;��y>*T���G@�-H��g�k$)����5�����EYd�y;�4�֜���t����<L�QԝU�D��C"�����xt�t�K�RVf���ҁ�1�0��[�e�K`~p k���ګ�b-����6�V�Ѳj&<��Fˤ���i�)�(
MD�ib�VK�6��C�+�k��gM-��Ϛ�����u6�q�<A/��B��hB�7�����\������g������}��g��_&�`Ҽ�@?����;OH^}��aV��2��Rj�Bw)4^���hI��l�یm�w�W��W_��h�ăn=��Hݢ���_���c�'z��6���>��\��`�{��[����"����E��Ӗ肎���V��t}����c�('.Z��e�rK`�%�ߘ�{����F�fT��f�c�J�0�P�����ϲ,�7s�3�����/a������W_c��HTՃLҡ6�=6�5�\�����ʆ�V���
\7f�2� !��A+AI�y��5�v;�[�\�m�W$�3�F,��:�H�ޡО��P v����\���R����M�	V�[����L�y`��f?��K�XZX��?���.����(]@8=�T+Ԧ�?ꮼ����Ii��BR%��b�gl9��8Q��	R�3�)�Ѱ*o��޾������}�V�T�?[�"�䡻��9�%9�պ�"~3�F�� 	��íu�;�v�u@�e�9�q�V;.<��ґ�N�p8d�j�z�(�T;1�x�G���@�u:��ҒY��_{��:\P���-�d	�nbE�~� -կ�C�b�jQ7��z�:A�ZY*�V��]v�0v�[U�j�Ө�U�.N�̅K���T��G=�����}�{<�p���`�{���^v�{��kO�=�;n���}�E��������e^����w���=v���+o�����=3���\��z�����Y�U����N x��ܗ���<�\���e�J�}ͻ�����5�K����)�����*�0�{�fF�ke����}���w�{87�0���|HJ_�{�p��Vk��3h��%�{J���[�E�m�#4����7��hv�w��3v�=qԿh%����8�������!d��$�1(n&Fc���%��R����,�L��v��:�J�Yy��[N(�+�e�Z�\�[G��29ИqƬ��tn�#����߂��P�hp��ޚ�1��'�P�{��$ݕ0��rn�i�'֚�5w�w`ܶBt~�	����7��*J�ή�yX��t��|� d�.�{o�..8�ǩ��ę��55zH��2,4����u�T�!l���%�x�������e4��i�zͽ�Ta��r
`@�w!�O�&�F�i�q�coD��<zj ~�:ם0�n�3{<��/]0��iG�{��e�	�1-�v���e|�#�y�np"�|�L�8��w�g�hi�M! ��1����OFP�d�FX�$b�CP�ȋio�)k��c�15��e�[$R�n="���kf����0f%1�����B@�x����
s�1�To�l�\6q>��� I���ح0�p"��vǹ�9m�d�wn�n�Moc�7��b�0��$�n�A�����V�0�w-?��kx�E�S(��̥[H�q���<����x�I	�J}N�hF'K$]�'�w�|� ���6������-嬤�sB�V��A>��jD�:�U�7��e����J���9��;�;�UZWuZ.�FU���	�Щ�d�<z;��rK�/s����y�����v��~��P�q�y�e9O���k�6c��t�S�#�3mhM��$��	zB#��0#�}s@Sn�;� ��c9�vJFѱ]@yÑ����i��ζ)��	�q�*��"K�z��]9��
�p9��M���ѡ#n��'~�`*֓�������Hw��NO�G�m��1�z�/�]� h/�6�:�_���$[П�Z�U$�����%�r�6i�*0�?�Î�mذ�+ ������	�C�!'�|R����#n�z9si$N���:H��F``g�r�ȁ�`vݷ�Dtas׉h����j�D��v:J�&�.�+��x���7���<#��43k����B��uF���O^RbT���~M{$���ESItόN�V
g�z��Q�˅��D�1%�P;"��W3q�yg�(� ��-/.$7R�V�ű2��j��?w�є�mF}�X���FA=}���[^��e�2@f�r�֯w�0�����J���uHi�|����cfn"�1���5����ޟ�u'��P�üz�5e>��H�b��ֳ2�����C��8�@����ђw�Q�vKKk� ߨ	Ӝ�,���A4o1ͣc�<�6���,&�5ݶOLt8'"�&x3����C'"w\�֭�F)�� 5��F�t㧶�Uz��,�� �D���-q