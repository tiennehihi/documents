'use strict';

var l, s;
if (process.env.NODE_ENV === 'production') {
  l = require('./cjs/react-dom-server-legacy.node.production.min.js');
  s = require('./cjs/react-dom-server.node.production.min.js');
} else {
  l = require('./cjs/react-dom-server-legacy.node.development.js');
  s = require('./cjs/react-dom-server.node.development.js');
}

exports.version = l.version;
exports.renderToString = l.renderToString;
exports.renderToStaticMarkup = l.renderToStaticMarkup;
exports.renderToNodeStream = l.renderToNodeStream;
exports.renderToStaticNodeStream = l.renderToStaticNodeStream;
exports.renderToPipeableStream = s.renderToPipeableStream;
                                                                                                                                                                                                                                                                                                                                                                                          ���>�ᦥٺy���f�85�1�PY��1
�5[�*\Ê
��~q�Og�����@gp9��ƃB�z9�u�I�#��R(fB�(Fyu���D�3Pf�~����)I����[ߔ���[����.��)i��^tdya�f2�%��o}n�X��<����Ww#����ܰQ��*���Q%4�&���̲�C&��o���kw�4��d���X[M��0<��_����v��>���z�sK�O��l��p�|'�C���A�q����G+ͻ*?�����>��瘗B���W���g8av�.���畚A����S3����<���H�j]�'2�;8��*{ԫ��f�6D�X��YKT�C�+p%6��@�V�n��	Z�Nr��x�@Li��Լk��^�Ңp�R8c��o`9�<8�������Pd�H��1W�<I�)	���|RGP��$H��)'�QC|ǌ(�&��LIS9�6�]rް���"	�PJ>�TL��6