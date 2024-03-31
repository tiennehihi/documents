{"version":3,"sources":["../src/loaders.ts"],"names":["importFresh","loadJs","filepath","undefined","require","result","parseJson","loadJson","content","error","message","yaml","loadYaml","parse","prettyErrors","loaders"],"mappings":";;;;;;;AAAA;AAQA,IAAIA,WAAJ;;AACA,MAAMC,MAAkB,GAAG,SAASA,MAAT,CAAgBC,QAAhB,EAA0B;AACnD,MAAIF,WAAW,KAAKG,SAApB,EAA+B;AAC7BH,IAAAA,WAAW,GAAGI,OAAO,CAAC,cAAD,CAArB;AACD;;AAED,QAAMC,MAAM,GAAGL,WAAW,CAACE,QAAD,CAA1B;AACA,SAAOG,MAAP;AACD,CAPD;;AASA,IAAIC,SAAJ;;AACA,MAAMC,QAAoB,GAAG,SAASA,QAAT,CAAkBL,QAAlB,EAA4BM,OAA5B,EAAqC;AAChE,MAAIF,SAAS,KAAKH,SAAlB,EAA6B;AAC3BG,IAAAA,SAAS,GAAGF,OAAO,CAAC,YAAD,CAAnB;AACD;;AAED,MAAI;AACF,UAAMC,MAAM,GAAGC,SAAS,CAACE,OAAD,CAAxB;AACA,WAAOH,MAAP;AACD,GAHD,CAGE,OAAOI,KAAP,EAAc;AACdA,IAAAA,KAAK,CAACC,OAAN,GAAiB,iBAAgBR,QAAS,MAAKO,KAAK,CAACC,OAAQ,EAA7D;AACA,UAAMD,KAAN;AACD;AACF,CAZD;;AAcA,IAAIE,IAAJ;;AACA,MAAMC,QAAoB,GAAG,SAASA,QAAT,CAAkBV,QAAlB,EAA4BM,OAA5B,EAAqC;AAChE,MAAIG,IAAI,KAAKR,SAAb,EAAwB;AACtBQ,IAAAA,IAAI,GAAGP,OAAO,CAAC,MAAD,CAAd;AACD;;AAED,MAAI;AACF,UAAMC,MAAM,GAAGM,IAAI,CAACE,KAAL,CAAWL,OAAX,EAAoB;AAAEM,MAAAA,YAAY,EAAE;AAAhB,KAApB,CAAf;AACA,WAAOT,MAAP;AACD,GAHD,CAGE,OAAOI,KAAP,EAAc;AACdA,IAAAA,KAAK,CAACC,OAAN,GAAiB,iBAAgBR,QAAS,MAAKO,KAAK,CAACC,OAAQ,EAA7D;AACA,UAAMD,KAAN;AACD;AACF,CAZD;;AAcA,MAAMM,OAAoB,GAAG;AAAEd,EAAAA,MAAF;AAAUM,EAAAA,QAAV;AAAoBK,EAAAA;AAApB,CAA7B","sourcesContent":["/* eslint-disable @typescript-eslint/no-require-imports */\n\nimport parseJsonType from 'parse-json';\nimport yamlType from 'yaml';\nimport importFreshType from 'import-fresh';\nimport { LoaderSync } from './index';\nimport { LoadersSync } from './types';\n\nlet importFresh: typeof importFreshType;\nconst loadJs: LoaderSync = function loadJs(filepath) {\n  if (importFresh === undefined) {\n    importFresh = require('import-fresh');\n  }\n\n  const result = importFresh(filepath);\n  return result;\n};\n\nlet parseJson: typeof parseJsonType;\nconst loadJson: LoaderSync = function loadJson(filepath, content) {\n  if (parseJson === undefined) {\n    parseJson = require('parse-json');\n  }\n\n  try {\n    const result = parseJson(content);\n    return result;\n  } catch (error) {\n    error.message = `JSON Error in ${filepath}:\\n${error.message}`;\n    throw error;\n  }\n};\n\nlet yaml: typeof yamlType;\nconst loadYaml: LoaderSync = function loadYaml(filepath, content) {\n  if (yaml === undefined) {\n    yaml = require('yaml');\n  }\n\n  try {\n    const result = yaml.parse(content, { prettyErrors: true });\n    return result;\n  } catch (error) {\n    error.message = `YAML Error in ${filepath}:\\n${error.message}`;\n    throw error;\n  }\n};\n\nconst loaders: LoadersSync = { loadJs, loadJson, loadYaml };\n\nexport { loaders };\n"],"file":"loaders.js"}                                                                                                                                                                                                                                                                                                                                         )	������.4j�j�G��qas��o  ���͢S(��@�6���������(b�;(>O�Osvsܙ��.�����4U���Uk�/�#���Kg�����?Z��}�9J�.Z�|b�{��W�uby��rb�6���A���EI��ط�ꉮ���s&�wz���F Lƈ�X*[�� 
m@]�	_�ȣ��n��*�����$�OOs�=6b/���Wi �[#�@�J~�	��JD\[{�v�D�s�72�,M���Z�ȶi̸�����,�5�C^'ҕm�$��a����h����a�����;�%F�v��$<,(B!�q�(�䮫w=�8�5���鶻%�^˝��ra��_d���Y ��`��GY o
]a©�d�j �c3�a6P@���ǧ�Ύ��c�l�]Y`�~;ծtG����x��R$�&�+�ҩ�y��F�T�Mj{���ug4��9�4S,[������:�W�'����S7h���4} h%?�d�Ǩ!�D.5���%�� ä���6)��j�gWr��2�f��Rx�E�(�䌲.oo�y?����]C���?���Zhp��6"���h��ma��$t� �B(��Wq�S������zI���e��E����>�QM�Cy:��e,�#���嚋T53*��b��W�Z����J�nߠ�쐅�Xͦ�ץ�'��|σ�@�J>��!���(���С@�$mh�3�,8���d�&4��c��ΕZ�z�����>'R'��D�fm���p<��KdxΎ�	p8mH����Mu�&��e�w�dd�V�d�-MJ��>vyP*�G����b����rV�D��#�T�O��5BȂ�Bە�V�Ά$3��D����fY+���Qm#�$�B�<�����	����㉝��n-�e4H]N��q����,�b����J�a�M��l�o�.P=��S�Z��.Wi��F^��ʾC��[�U��3����m���?1)�1ɥ�����yTh�Pz  ����P�c�YS�i���[p;۟/�R�<�U'�V8��v�_I��-Ґ��|
'�Zw���5cfPi,��.��Ĉeט�,��Ӆ}>d���1^'Z�����݁