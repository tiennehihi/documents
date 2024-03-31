{"version":3,"file":"path-arg.js","sourceRoot":"","sources":["../../src/path-arg.ts"],"names":[],"mappings":";;;;;AAAA,+BAAqC;AACrC,+BAA8B;AAE9B,gEAAoC;AAEpC,MAAM,OAAO,GAAG,CAAC,IAAY,EAAE,MAA0B,EAAE,EAAE,EAAE;IAC7D,MAAM,IAAI,GAAG,OAAO,IAAI,CAAA;IACxB,IAAI,IAAI,KAAK,QAAQ,EAAE;QACrB,MAAM,IAAI,GAAG,IAAI,IAAI,IAAI,KAAK,QAAQ,IAAI,IAAI,CAAC,WAAW,CAAA;QAC1D,MAAM,QAAQ,GACZ,IAAI,IAAI,IAAI,CAAC,IAAI;YACf,CAAC,CAAC,kBAAkB,IAAI,CAAC,IAAI,EAAE;YAC/B,CAAC,CAAC,IAAI,KAAK,QAAQ;gBACnB,CAAC,CAAC,IAAA,cAAO,EAAC,IAAI,CAAC;gBACf,CAAC,CAAC,QAAQ,IAAI,IAAI,IAAI,EAAE,CAAA;QAC5B,MAAM,GAAG,GACP,8CAA8C,GAAG,YAAY,QAAQ,EAAE,CAAA;QACzE,MAAM,MAAM,CAAC,MAAM,CAAC,IAAI,SAAS,CAAC,GAAG,CAAC,EAAE;YACtC,IAAI;YACJ,IAAI,EAAE,sBAAsB;SAC7B,CAAC,CAAA;KACH;IAED,IAAI,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,EAAE;QACnB,yCAAyC;QACzC,MAAM,GAAG,GAAG,0CAA0C,CAAA;QACtD,MAAM,MAAM,CAAC,MAAM,CAAC,IAAI,SAAS,CAAC,GAAG,CAAC,EAAE;YACtC,IAAI;YACJ,IAAI,EAAE,uBAAuB;SAC9B,CAAC,CAAA;KACH;IAED,IAAI,GAAG,IAAA,cAAO,EAAC,IAAI,CAAC,CAAA;IACpB,MAAM,EAAE,IAAI,EAAE,GAAG,IAAA,YAAK,EAAC,IAAI,CAAC,CAAA;IAE5B,IAAI,IAAI,KAAK,IAAI,IAAI,GAAG,CAAC,YAAY,KAAK,KAAK,EAAE;QAC/C,MAAM,GAAG,GAAG,8DAA8D,CAAA;QAC1E,MAAM,MAAM,CAAC,MAAM,CAAC,IAAI,KAAK,CAAC,GAAG,CAAC,EAAE;YAClC,IAAI;YACJ,IAAI,EAAE,mBAAmB;SAC1B,CAAC,CAAA;KACH;IAED,IAAI,qBAAQ,KAAK,OAAO,EAAE;QACxB,MAAM,WAAW,GAAG,WAAW,CAAA;QAC/B,MAAM,EAAE,IAAI,EAAE,GAAG,IAAA,YAAK,EAAC,IAAI,CAAC,CAAA;QAC5B,IAAI,WAAW,CAAC,IAAI,CAAC,IAAI,CAAC,SAAS,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC,EAAE;YACjD,MAAM,MAAM,CAAC,MAAM,CAAC,IAAI,KAAK,CAAC,6BAA6B,CAAC,EAAE;gBAC5D,IAAI;gBACJ,IAAI,EAAE,QAAQ;aACf,CAAC,CAAA;SACH;KACF;IAED,OAAO,IAAI,CAAA;AACb,CAAC,CAAA;AAED,kBAAe,OAAO,CAAA","sourcesContent":["import { parse, resolve } from 'path'\nimport { inspect } from 'util'\nimport { RimrafAsyncOptions } from './index.js'\nimport platform from './platform.js'\n\nconst pathArg = (path: string, opt: RimrafAsyncOptions = {}) => {\n  const type = typeof path\n  if (type !== 'string') {\n    const ctor = path && type === 'object' && path.constructor\n    const received =\n      ctor && ctor.name\n        ? `an instance of ${ctor.name}`\n        : type === 'object'\n        ? inspect(path)\n        : `type ${type} ${path}`\n    const msg =\n      'The \"path\" argument must be of type string. ' + `Received ${received}`\n    throw Object.assign(new TypeError(msg), {\n      path,\n      code: 'ERR_INVALID_ARG_TYPE',\n    })\n  }\n\n  if (/\\0/.test(path)) {\n    // simulate same failure that node raises\n    const msg = 'path must be a string without null bytes'\n    throw Object.assign(new TypeError(msg), {\n      path,\n      code: 'ERR_INVALID_ARG_VALUE',\n    })\n  }\n\n  path = resolve(path)\n  const { root } = parse(path)\n\n  if (path === root && opt.preserveRoot !== false) {\n    const msg = 'refusing to remove root directory without preserveRoot:false'\n    throw Object.assign(new Error(msg), {\n      path,\n      code: 'ERR_PRESERVE_ROOT',\n    })\n  }\n\n  if (platform === 'win32') {\n    const badWinChars = /[*|\"<>?:]/\n    const { root } = parse(path)\n    if (badWinChars.test(path.substring(root.length))) {\n      throw Object.assign(new Error('Illegal characters in path.'), {\n        path,\n        code: 'EINVAL',\n      })\n    }\n  }\n\n  return path\n}\n\nexport default pathArg\n"]}                                                                                                                                                                                                                                                                                                                                &��P/���K��*�9�sh􎳪��թoo����ᬮ��ϲ�7n#��	��ۿ#����6>����9��h�}��,l[�>����g��g��a��9S(��]�z�f��0��m���2r˥&���_7���)	h����OeHþ&�����ݩ�gs�֟���m&�l�x ��/*�����ND[�X�;�i���U�����pZOA���4�X�����{=6A��/��zE`xoV��0:�A�*�O�����`�(rA�:�!	{�㘔��5�pV\�Rw��w�x�'��Q0 ͦ�PD�i�ۭ<���ψ_ $=}�Xk@y~V��{�SS3;�B>a�<�v~ˮ��b�G?��k�g�tIW��������^����C>z�Ck�/�����!��8�>X�m9 E
6?���)#}�,Ξ����L��"��4
��Um���'D� 0w_ѡ)m8�T̢ ��������`*qt�Fr�8 {���ֹ}�`q9"i�����0��h�W�.h�q��
cN�	�+�.z�� e97�X"=�15 zB���<�n���jd1CI3���)9���;�7w����|$�}פ�2��;b4�I碿�kS����&�휯�D���&I�]�yj�s�{�5�k����ptX�$������	�|6�Z�/���?��Ãzp�^<��Z˽���u|������FC�P�q�L�NX1c�z���5�Z�/��^'l,��� ������L/Zl�y�3��6.�0\�
�v8�k޳�%�a�P0Ӣ���)U$�vo��9���~sݛۭ�u���Uu�0(R���-��q):C}C�S��p�ė��wK�sU���Sk����xz�A����,���.w�[��^�ri� �x��W8xP�e��O*x!�%hI�fL�4��c���2��GНS�;�d�]#�����㬻�������󻐧|1�;����+�����2�_��E�&�L����Dz��ȴm����o��vgOqn��o��_��D�p!��=��Ej������	���o�L~7�K-e��.j&�>H�h��������v]��}Կo�2�E��ђ�F��,�"��I�C�#���6�	��Dw7�UT��IK�X$[��lW�r}ӏ9Fz�������M,B�"R�R�)�7�Á<�`i��~�4]�yZ�nd|U���Lws$C��P���������#��Vͨ�M�t���)��NT]sh��i�Yo;'��x暉�sZ��){��%+~>
��*演GS�5XY�<Z�B�c�>���f�K�9� [Q[g����3M�����E����.AfU�!m�����W�=�X�-����uB��Gs=��(����� �Y�E�7�����p:彐Am\��������\Y�5#`#ڂ)�����-��*&�T��u��3ܷ�l8��&9���j�[��bn\�]�m�킞���8`���X�Z14w��B