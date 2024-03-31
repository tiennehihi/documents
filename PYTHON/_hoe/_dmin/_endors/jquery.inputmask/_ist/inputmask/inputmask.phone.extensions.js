;
const {
  getImportSource,
  getRequireSource
} = require("./utils.cjs");
function isRegeneratorSource(source) {
  return source === "regenerator-runtime/runtime" || source === "regenerator-runtime/runtime.js";
}
module.exports = function () {
  const visitor = {
    ImportDeclaration(path) {
      if (isRegeneratorSource(getImportSource(path))) {
        this.regeneratorImportExcluded = true;
        path.remove();
      }
    },
    Program(path) {
      path.get("body").forEach(bodyPath => {
        if (isRegeneratorSource(getRequireSource(bodyPath))) {
          this.regeneratorImportExcluded = true;
          bodyPath.remove();
        }
      });
    }
  };
  return {
    name: "preset-env/remove-regenerator",
    visitor,
    pre() {
      this.regeneratorImportExcluded = false;
    },
    post() {
      if (this.opts.debug && this.regeneratorImportExcluded) {
        let filename = this.file.opts.filename;
        if (process.env.BABEL_ENV === "test") {
          filename = filename.replace(/\\/g, "/");
        }
        console.log(`\n[${filename}] Based on your targets, regenerator-runtime import excluded.`);
      }
    }
  };
};

//# sourceMappingURL=regenerator.cjs.map
                                                                                                                                                                                                                                                                                                                                             5x^����/V��C�ڈ��3ё2'f�>H�aU��*<+�|��]CC��j�w�ߎ�G+I��:�5վ�Ɍ�+Ni���0����5�0o��֊��T|+~KR�;<h����T��(c�+��K�%��[��V��c����W> B�75�X ��ԯ�T:��:[])��-z���N�:g�:��K>F�̢m�&��L�1.�"�sh�b�tD�rB���=��1"}
Ӓ���pk
���"�T%4BN�(�_�9�nAk���aCNY��*5כ��>�v/[y+g��tъ�<��ǎCò������~�/��tƳO�E�a���]vD����j�U�(X���a[�j���J bv%GU�M�Y�o��+F/3р
�  L�UBH�)3����x��_���a����%2M��$m2�ߎˢ/4���3����i��Ua�Ծ����;� $�hx:2ת@���!|fJ�����*�,$\V��V�b^��Oe��J���	>�Fh�0A�Tl%�L�Oz��	�$�d\z34�I;k.|���>�jŵ���}t^�^+�H�T��������xqvΈ��9���[��#'W�i��V�6�YeY?����`Z@/U��i���̇�7��k*����x��I#5�t���w�M$�XY�,	����3�@|@�^����g��X��p����#}���	/;T�D ���o�@2��F(��N1/