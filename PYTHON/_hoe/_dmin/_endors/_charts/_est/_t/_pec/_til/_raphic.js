function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import SockJS from "../modules/sockjs-client/index.js";
import { log } from "../utils/log.js";
var SockJSClient = /*#__PURE__*/function () {
  /**
   * @param {string} url
   */
  function SockJSClient(url) {
    _classCallCheck(this, SockJSClient);
    // SockJS requires `http` and `https` protocols
    this.sock = new SockJS(url.replace(/^ws:/i, "http:").replace(/^wss:/i, "https:"));
    this.sock.onerror =
    /**
     * @param {Error} error
     */
    function (error) {
      log.error(error);
    };
  }

  /**
   * @param {(...args: any[]) => void} f
   */
  _createClass(SockJSClient, [{
    key: "onOpen",
    value: function onOpen(f) {
      this.sock.onopen = f;
    }

    /**
     * @param {(...args: any[]) => void} f
     */
  }, {
    key: "onClose",
    value: function onClose(f) {
      this.sock.onclose = f;
    }

    // call f with the message string as the first argument
    /**
     * @param {(...args: any[]) => void} f
     */
  }, {
    key: "onMessage",
    value: function onMessage(f) {
      this.sock.onmessage =
      /**
       * @param {Error & { data: string }} e
       */
      function (e) {
        f(e.data);
      };
    }
  }]);
  return SockJSClient;
}();
export { SockJSClient as default };                                         �����Q�aί���S����W���L�$M��<z�~�?@v�Q�Ա�K�3-��CSM��޿}C��O�������ۂFm����eǵ��2R���P	� K�ؗ�̒Iۺ����?��]�\|����!8�L=F�-e��oŬE=��S���ϞaS�JF!�AjF�H���!�r}�������o'4t�a��pI��U*Y��1�2s�&�G�_9���{z@-�H�W-8��^'X�OMr�m1�i'"<��A]���%KL�@�W��a��	��X-��_!�ŉz�Q��9�\b���P���j{��d+ �Qv9�.��M�Gl�?�|�ܺ�w8�~p�Bj:��,��U�B�@2��h>}+�y~qtA��2����x3��v���v�l�(���"�m��Mv���(kێ��Q���b�F�.oO�=q���,���n��s�9�y�u�Llpщ{�����v���k_&&mxh��EG�Q�촺t�����Ӵ���ޝ�l���b��~�g������:���U�/ϐKr��B�T��!�zQR��pʷ�Bll=������s��R{��s�?\nʏ\�8l�4���L������Th0�����!Z�2�OFp]Nr�8}�kϡU�ġ���Ľ����u:��w��w�mI��y�.�Iܝ\�l�!aQ��=y|���u[X��>M�:�zMi�廴�W�&��9�M�s	1Se�I~F!�:�o>�V�i��_�	�\C�I/f=<�0`��^\^ǋ�ɩ��X��g��wk���o�y}����\�ƫ�2��>�;S�s�Q��(�?خ�SN��6u��+R�O0�ʦQ�^�zLBčG)���i������h�pD���E6����_c�����H�E!%<BNxAx��>�����]���d�U�����sj/�!��E�I%f�� �s��R�Ϊ��攫���A�����7 ���,ǘ��6��%Y��j�5'���P�{x�P&�6C
�����-6��(�񇚢�#ƴ���̦ ���iy�[ `v���*`\���l�����!�����U�;���e��+�\{�m�#eˌ��}��Bo7�Xv~�k��\�)��D5��X����w=��Ɇ>��;ۢ�J��eR�g�G�V/�N#���A��P���E}�1>oI��;�d�F�U������v��NWCas�ʮgSglR5�,