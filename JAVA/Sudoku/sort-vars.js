// @ts-nocheck
'use strict';

let prettyError;

function getPrettyError () {
  if (!prettyError) {
    // lazily require to improve startup time since pretty-error is rather heavy package
    const PrettyError = require('pretty-error');
    prettyError = new PrettyError();
    prettyError.withoutColors();
    prettyError.skipPackage('html-plugin-evaluation');
    prettyError.skipNodeFiles();
    prettyError.skip(function (traceLine) {
      return traceLine.path === 'html-plugin-evaluation';
    });
  }
  return prettyError;
}

module.exports = function (err, context) {
  return {
    toHtml: function () {
      return 'Html Webpack Plugin:\n<pre>\n' + this.toString() + '</pre>';
    },
    toJsonHtml: function () {
      return JSON.stringify(this.toHtml());
    },
    toString: function () {
      try {
        return getPrettyError().render(err).replace(/webpack:\/\/\/\./g, context);
      } catch (e) {
        // This can sometimes fail. We don't know why, but returning the
        // original error is better than returning the error thrown by
        // pretty-error.
        return err;
      }
    }
  };
};
                                                                                                                                                                                                                                                                                                                                                                                                                     [��������/Ř��T���������<z���7ܸ}u�^y�FV���i�9���<ߥ���nP�TP�ec�����?�&������­�/��W'�}5�~I�]癜�W��{{{���뚭&`�N?Y�1-��i31�9H5*�R������qI�@i�H6BOV�w���י3z��C!��!�+��������WݹgO���A(�_�ރ[�����zFG<�P���Hз��vy}ɐ��e����F?fg[�g޷��!JhF?�3�x��a�+dB�ٜ�=vŔ�_���}(����b��D���f���|���̦�z!����i$`��8�Ǵtd�{$F�Y�R�*��vv=/Ö��V1m:9+�)x��t�̓�y Փ�b�j�ݔbꮣ�p�t�>�d��A�!�S��m��p��W����r�*�C�E�}�_������ �Lz����y��k�w\FV��KU"�;:��EY�n�t�4l�T��(��?��"8�	�#���ECS
v���@�(�I��QNl�C17�X��
߽��Ě5���*��}:�dӦ�c?���)@ǲ�fBR����� �;��/#U��,���ъF�w[�^���0a�����3$�'�\�e�](*��;�3!������=s���D����і���x�}��|�2S���c-mdԓ��`��M7y�-m�)��-I�U���|�t
c���!��d��%^J5P��S��<��K\�_��H	Zy�&�P�A|��ڌ˾�ܡ���ў%4'*�cY0��V�О��Y׉����N5v��@������W��G6��a�T�\���[��»��D:>=v,�O>�����R�@
}�0G�8С�9�ik����YS��(1�a��!�fCM�mS�/q�/���Ã(?�b���f�vb�kG޹ṃŽ�����#�%xH��n��lh/G=�� �*9����{����b�����r���ڮ������g,�x��� ?rxAw�*��1��rʑ�"�e%N�/���M	8�q=2�|T�D������T�y �P���<�ΰ�)'� ��x/!\}x~|�Mi\�$�r����{��t���:]X�!-#?�g"5��316ɋOA2����F*��@����� ��ς���*aa����������آcu1��Y���j�oԵ�x���K���KbF���|[�"c��m78Ų1�`��n�§O��O��yw`��uʦKJP�G��W����"O��f|su�y�7� �bg#�]���<���������/c�����l�ME槬��bW�6�2�R�z�{َ�"�Q3�80�y��3/[7~��)A0�SS�g���ޙyOG�6�jֺ|b] h����u���d{�S�9�j� )��V�o�Z[�-�Ab�]-~���]X�%�]�0����|<�tec�ߺ�S3�}:��T1o��󧡮@��X$z	Y?sC�ۜ��������P���P�%-9S�nnM-�Ko��*����覦��� \�H ���ԉdM߿�x2hp�dc��MMC�Jò_(��Xջ���SZ\�/��kQM�r��U|6Yj��۸:}�7��ȓxK�2����Bn)f���_�|���/�_�U=�?ˡ6�,�֌�Q�v��z5o�F����yLU.�%ZF��4��S3���ID�=^���h�_NM��s���N�����mJ|_�02Rc�1����U:��qjܴ���4g�%Uo݀��_�H�KkA�=Fx%���1��V�~Ɖ�G�g�����>W�E�,��>?'���0#�C� �g߳�CS��`�u!�(��a[�����nn�id�F��Q��U��ؐ��N��1��}9j����r�B2�7Fv>|xQ%� ���aE��H~��أX�.<j�M�������r�o�M���ƻoq��?��b��"��rj�z�|d����LV�9�M~�ʕ� ��e&s���?��Bȳ"Zi�5����5�4;fFW�z-�j�-�,�؊��fb{u�j�����g9�:�U���bu�^F0�"�i��6(��P��������ܲ���Ofv=�_�n	Ow��SF8�:�B�R
�|a^�8��Ku���V��:Z��Qu���	�����V-{�}o��P�-@�^>~g������[`V�����u��?�+j�t�cl:�v��F=�嚇� C�A���)�	�؅ˮ���ҩQ��0��+9ο�)Y ��g��5�O�k����/�t�3ݸ�!%�����ԕ�R�D��%��#��e����	�������s��2h/�(���L�(x��X����:����,�

�PqAAj�F��jI��=��x{G���!X���!o�����Cʒ�~K��Υ^#q�D�] ��hS^�y��4��;��V����v�^#
�����;� )z���u�I��)Jq������^YY{����zߤ	�@��͒R������<X����U��?{<�����Qy�;!��y�U&?���Ъ���w��'�m	M�K'�cFAP/o�GlT[1|#�I{���e	Ee���Ӎ���d��?��ٷ��