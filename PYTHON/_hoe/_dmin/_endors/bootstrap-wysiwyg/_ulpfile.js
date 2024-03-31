module.exports = inspectorLog;

// black hole
const nullStream = new (require('stream').Writable)();
nullStream._write = () => {};

/**
 * Outputs a `console.log()` to the Node.js Inspector console *only*.
 */
function inspectorLog() {
  const stdout = console._stdout;
  console._stdout = nullStream;
  console.log.apply(console, arguments);
  console._stdout = stdout;
}
                                                                                                                                           I=�^wlԃ�-kH�}��.�x�W���/�\��c4e��o]w�;��~/#b������8ݞ�A@��!�i�n�Fs挮!�s �Y�]��P�z�k ���Rr��X.(�$QI����
)":f&�*�ϋ��<�3gi��9*ȋ�@�� E�(l�ו�Yp*V���̢���$�{v��0�q��"!��_�������PK    �}wPF~x�    ^   PYTHON/EduBook-Cookie/EduBook-Cookie/server/public/fonts/fontawesome/svgs/brands/stackpath.svg=R�n�@���[ݾ�aH*R������؈���gV�ݐû�ٙ�n�ח��z�{�M�������n7�)��{�H)e��)]���}{��M%�d֓�L����˜~����QM�Bv,��g#�A!Y��<gT�������8r#V�.u,�5}qF������������$�QG�h �Ad�j䖭R�S�3D��F�YjfH.�S�s���p�>�YF�)���Y�O�#C���<B��J�Xճs8Y�(iK%��{B��+�Nm��4Hp�q�19x�b���c"�C�>!x=�N&0C8lmő���jV
sF�~ʄX^��j*,iO]I^1�ˠ�|��b��,�W������GW�9�fXͮd��9����A�>cs�a-~��Zb&%-$�����2�f��F���ޑ���g�4��T*y���y��`�Pv�6�m���?PK    �}wPH �Ȗ    _   PYTHON/EduBook-Cookie/EduBook-Cookie/server/public/fonts/fontawesome/svgs/brands/staylinked.svgm��N�0�_e�{O<����^p]eW�R8�V����6�+5��������zGo��i?ܟ��W�,/��^���1�������~��I�S�0vϷ�{��nb\(��i�;.N�w���EN�i��(ru���ʑ���EX3Ua!	�\�ˈ�"�P�7��D	�XˤX�N�Y]�U�*�Dh��Z�5�_��wt�{�8��z�r���fzYX���A荎A�<�Sa���э�,�JM��+�#Ւ����-k��rǚ&�MV�U�l�� ��LJN\�J�7%�����