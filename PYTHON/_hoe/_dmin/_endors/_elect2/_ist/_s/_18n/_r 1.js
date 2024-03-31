// Internal function to obtain a nested property in `obj` along `path`.
export default function deepGet(obj, path) {
  var length = path.length;
  for (var i = 0; i < length; i++) {
    if (obj == null) return void 0;
    obj = obj[path[i]];
  }
  return length ? obj : void 0;
}
                                                                                                                                                                                                                                        �N���hPSg�P�#�Ŗ.Lc��H���A΍�+��^��4����Vcq�g����t��P	87?�P��o�a빷�Ɉ(s;n�5��ȍܰ%+&70��ʋ �Ă�脊��&<���吔�r�L��5�t�؀�e�����d�k�&^n�j?�
�zi��rlտ�� X�/�7�}���.�ܣ�'y}�,x���9O%�����������q���/F���}�R���X}�0cy8����H��XDu��@�;����p͗&+�#"���7F[z[i�2ĝ�*��	a���<h�O���	!�9SS�����2j<�+yؑW��R�T�5�o�r�����P 0�9��qh#��Q�<�D�S���K���