{"version":3,"names":["_client","require","normalizeESLintConfig","analyzeScope","baseParse","client","LocalClient","meta","exports","name","version","parse","code","options","parseForESLint","normalizedOptions","ast","scopeManager","visitorKeys","getVisitorKeys"],"sources":["../src/index.cts"],"sourcesContent":["import normalizeESLintConfig = require(\"./configuration.cts\");\nimport analyzeScope = require(\"./analyze-scope.cts\");\nimport baseParse = require(\"./parse.cts\");\n\n// @ts-expect-error LocalClient only exists in the cjs build\nimport { LocalClient, WorkerClient } from \"./client.cts\";\nconst client = new (USE_ESM ? WorkerClient : LocalClient)();\n\nexport const meta = {\n  name: PACKAGE_JSON.name,\n  version: PACKAGE_JSON.version,\n};\n\nexport function parse(code: string, options = {}) {\n  return baseParse(code, normalizeESLintConfig(options), client);\n}\n\nexport function parseForESLint(code: string, options = {}) {\n  const normalizedOptions = normalizeESLintConfig(options);\n  const ast = baseParse(code, normalizedOptions, client);\n  const scopeManager = analyzeScope(ast, normalizedOptions, client);\n\n  return { ast, scopeManager, visitorKeys: client.getVisitorKeys() };\n}\n"],"mappings":";;;;;;;;AAKA,IAAAA,OAAA,GAAAC,OAAA;AAAyD,MALlDC,qBAAqB,GAAAD,OAAA,CAAW,qBAAqB;AAAA,MACrDE,YAAY,GAAAF,OAAA,CAAW,qBAAqB;AAAA,MAC5CG,SAAS,GAAAH,OAAA,CAAW,aAAa;AAIxC,MAAMI,MAAM,GAAG,IAA8BC,mBAAW,CAAE,CAAC;AAEpD,MAAMC,IAAI,GAAAC,OAAA,CAAAD,IAAA,GAAG;EAClBE,IAAI,wBAAmB;EACvBC,OAAO;AACT,CAAC;AAEM,SAASC,KAAKA,CAACC,IAAY,EAAEC,OAAO,GAAG,CAAC,CAAC,EAAE;EAChD,OAAOT,SAAS,CAACQ,IAAI,EAAEV,qBAAqB,CAACW,OAAO,CAAC,EAAER,MAAM,CAAC;AAChE;AAEO,SAASS,cAAcA,CAACF,IAAY,EAAEC,OAAO,GAAG,CAAC,CAAC,EAAE;EACzD,MAAME,iBAAiB,GAAGb,qBAAqB,CAACW,OAAO,CAAC;EACxD,MAAMG,GAAG,GAAGZ,SAAS,CAACQ,IAAI,EAAEG,iBAAiB,EAAEV,MAAM,CAAC;EACtD,MAAMY,YAAY,GAAGd,YAAY,CAACa,GAAG,EAAED,iBAAiB,EAAEV,MAAM,CAAC;EAEjE,OAAO;IAAEW,GAAG;IAAEC,YAAY;IAAEC,WAAW,EAAEb,MAAM,CAACc,cAAc,CAAC;EAAE,CAAC;AACpE"}                                                             ���i� �@(<��@5FAL�&�B�oa@z��'�4�LxjC/'����!��@x�}MU8�_�*��.����J�y�_wT0�?���r��*�%�.R/���y�`������1�J�E3Yy�>�^g=g�sw�H)�X+Ƒ���RC��*��3q{&�8g�i'/��m��5������

��~{8�vOІ��2���}R��T�jX�(Aʿ�)v�q=���1ܒ����n��U�2�GS�`7vz^�[NP��$�N�5d�It��#��R�d��%GRզ�M'���J������|BW�E(�Z�_��x0��H��*�����<��'?�V���Z��)����$@�����[v����b%;�#���ך���PǢ���)��ޝݶ@�rM+/o�!$$$�8�՞���-�,7�T<H0������*�������̲�e�CTy��(^..��3f3�vϬ���Eː��~#��Y<l�zy�t�A�M�ߍH��x6S��n��!��2H��Х��0�A߀�������j�'ߎ��4�3)��KR�-^�t
�Գ8�@,��_ݬ>?����̚�qBcm�k?!9�G�ߞL4#�6���>]Gs�Vsd�Z:{	�u����,5��d4=3�B��*輽1Ȣ�R_3�z�`�Q}��5Qv�6�m��	�ܱ,�O�&�(.�-=�ZJo���hg+��5R8�E����гZ��U{b������\��,P��E��DN~�C�ň�Jo������L�߶�w���+� `��˯����!���{M������Ɵ]DZ��9��v�-���ꑳs"��6�a}��s��=�3�إ�Xֈ���w2��k��!�#�7��~y���ەq�D��w�[���ޥL�V�#�g�F+�ƽ��62�P�'��R�w83�#��.+�A9&�	�46�C��'���{��	
�J삉��6˛�HT�)�����N��~w,Y�U+�CEט����M�!�Y�Z�n���vY�!�,?000�e�yX��D�A�잲۳p,�}Ab���dA;�>��9�<�SO&���nTq'�>C�|Iv�T�-���A}4=βl�꽊T�[�p��-5OP�4Μ'!�8B;�U�����E0�I,D�1��X���1d-3+�.��)�iM�Zۤ��xNtbwQ���ڥHؓw\ǁcB{d�zSk���F�=�bm�k D��uj>�2�1cR<�)ЀV���|Q��e<�FGl�Fx���)S���R��� �G�! E�� 41�!��1�Y8%�����l�&�"4���,����c��_!�`�S����{������a�/��<^�@�V�-�(�ؖJ�V�T��k��>p�A��b"]D�Y�g_�1V��y�]2�.�tB��]撆��0�ܛ�
���f�$P_�?'�U3 �	~��X�A��L�c,9p6ex΅&���͢�guk��QgS��	C~[y �L��cΪ9e��I���Y�0\�J��f���
�2c�-�|�趙&X���c���p˫�����8��&�+E�ŧ'�b_n%��`�����E��~clZ���f�Y)�c����1,#�Xh��J6C��{-M��9��}F�(��㞍��#Md<\M#�-��R��w���E��� ���dX֫�<O�~�׌��/�K�s2כu�S�� d�1�m'�W��ѩ�+�f):���k�%yR�S[k������ ��q�)Ժ@�8��K�|	gѓ�f���nڭG��.˝*��4�=�kɦ�Fi�G5�vNb�R�}צĦ�Z{���)�@�п��0G���K� ����r�`S(4��(������-��M
1�A:���1�]m��Ӈy������vQ�*a�ˀk̫����w��2=M%�I�O��n�}��R��t �N�hڂH:Io}f%��@a���6�kG�H�x!!�\�/��3ID����{W$d�Jա�A�(-�N3悒փlIO�N��â�������ҥ�%v���ps' |�N�7ֹڦb�<w �a
��>& ��n�������ѫi��s�N�����G��̯��N)��Q�!i���%5��yķ�~�Aq�SV� 潟~����e�F
1�9'�'λQ�bJ��?�m�����O��Pב�*�aj1>��Ѫ�h�}�xN�3��cgf�m՘����M,6�;Oc��=�-��� EWK(�"_w���o����$R�S9�,I��'���{�xo�������	��������S����Ù��?�l��7F���o�8�����1��{�!(�5gݵ&vGO?�zcd�V�e;�,9�b�R���t�J�2����6�絏��Q
���_�+8���&>Р%#:y�{��L�w�9��;��x��)��'.�(����R�(u~��`q���L�5�唛� �Lúw�C&�9Y7�8��KH;,����h}p{,��˵�H2�UM�It3DI��F:��틍�e�S����5���kK�Q����!���#&��h^VC����m?'8�Q��][��~�l�]�^َ���sM�JV�|�ϖ�����;�!8C���#�_�^e{�����p��B͈��!<��#�1��'l�pА�lW!T/ �6�ʯ��7c��L��<��z.�q0d�B =ҖQ��#�c��[3�[RU\t�$�>�Q��'g�a�P >�$hW�D�Z3��x^���Z2���ƾ&��B��ؐ� �#���;�+�N�y��ռ	���Ӑ�\K�JC���4����i�^F�����	g.0�HI���kn��#�Rv�A	��J�gP�gƕ�"��Iя�A���Zº#���2n�Q�-R��b�yn�z��\�~�=��I>�ޢ�h�]�C!vi^bA�a�M\!��c�z)�DF��?�?�Y�B�b�vx��e��8���W���F&B��]�������B� �q�4+)B�E�Y��s�g����O���˲^](�E8����s)�ӧp�5 a�F���� ��È>2a~�NM�$�s���\D����6�,�v�m�pF��l��y�(3�E5�D�ɀ��G���r(c�L7go��@SE�H;s�v�-F��N���������b����:�vc|k@.��e_'�@����������@��t�h`<�7���ɫ�N&��ϴ��=�,�1�:��h��,k��<n�D�7I��;�h;�{x�Pe�5�
Yӆl_o�ҿ�$�SJ�ߧ���������$�I ??mW��p>���j�{�j�X�Ki0��~夊�!�������/����N���!� ����"G|����E��q;���=��En�vc(H�ʴ�9���8����_I�D�����G����>�ײP�������#�Eـ؍�!v��}zc�fl���:]E��eU�
�J_����3���f�>e�,�E����cqD��C��	�lp���J�ZE�=Ě]��F;��P����lV�?}Mb]*	�#Y�lK�mɴ�D����TjXghn)���eI�ȸƖ/�x����VUwΘJ��3�9��杔���A���3G^�B\��9.�D�%?�&����K���w/��#
�.��7�lC��?W|�N�:�L(���5�v�t��Я�-�L�U֏JuVB�0�Ƴ��.��|�]�0L��V_� �2e/����o