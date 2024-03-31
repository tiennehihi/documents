"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = transform;

var _index = require("../../index");

var _astModuleToModuleContext = require("../ast-module-to-module-context");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// FIXME(sven): do the same with all block instructions, must be more generic here
function newUnexpectedFunction(i) {
  return new Error("unknown function at offset: " + i);
}

function transform(ast) {
  var module = null;
  (0, _index.traverse)(ast, {
    Module: function (_Module) {
      function Module(_x) {
        return _Module.apply(this, arguments);
      }

      Module.toString = function () {
        return _Module.toString();
      };

      return Module;
    }(function (path) {
      module = path.node;
    })
  });

  if (module == null) {
    throw new Error("Module not foudn in program");
  }

  var moduleContext = (0, _astModuleToModuleContext.moduleContextFromModuleAST)(module); // Transform the actual instruction in function bodies

  (0, _index.traverse)(ast, {
    Func: function (_Func) {
      function Func(_x2) {
        return _Func.apply(this, arguments);
      }

      Func.toString = function () {
        return _Func.toString();
      };

      return Func;
    }(function (path) {
      transformFuncPath(path, moduleContext);
    }),
    Start: function (_Start) {
      function Start(_x3) {
        return _Start.apply(this, arguments);
      }

      Start.toString = function () {
        return _Start.toString();
      };

      return Start;
    }(function (path) {
      var index = path.node.index;

      if ((0, _index.isIdentifier)(index) === true) {
        var offsetInModule = moduleContext.getFunctionOffsetByIdentifier(index.value);

        if (typeof offsetInModule === "undefined") {
          throw newUnexpectedFunction(index.value);
        } // Replace the index Identifier
        // $FlowIgnore: reference?


        path.node.index = (0, _index.numberLiteralFromRaw)(offsetInModule);
      }
    })
  });
}

function transformFuncPath(funcPath, moduleContext) {
  var funcNode = funcPath.node;
  var signature = funcNode.signature;

  if (signature.type !== "Signature") {
    throw new Error("Function signatures must be denormalised before execution");
  }

  var params = signature.params; // Add func locals in the context

  params.forEach(function (p) {
    return moduleContext.addLocal(p.valtype);
  });
  (0, _index.traverse)(funcNode, {
    Instr: function (_Instr) {
      function Instr(_x4) {
        return _Instr.apply(this, arguments);
      }

      Instr.toString = function () {
        return _Instr.toString();
      };

      return Instr;
    }(function (instrPath) {
      var instrNode = instrPath.node;
      /**
       * Local access
       */

      if (instrNode.id === "get_local" || instrNode.id === "set_local" || instrNode.id === "tee_local") {
        var _instrNode$args = _slicedToArray(instrNode.args, 1),
            firstArg = _instrNode$args[0];

        if (firstArg.type === "Identifier") {
          var offsetInParams = params.findIndex(function (_ref) {
            var id = _ref.id;
            return id === firstArg.value;
          });

          if (offsetInParams === -1) {
            throw new Error("".concat(firstArg.value, " not found in ").concat(instrNode.id, ": not declared in func params"));
          } // Replace the Identifer node by our new NumberLiteral node


          instrNode.args[0] = (0, _index.numberLiteralFromRaw)(offsetInParams);
        }
      }
      /**
       * Global access
       */


      if (instrNode.id === "get_global" || instrNode.id === "set_global") {
        var _instrNode$args2 = _slicedToArray(instrNode.args, 1),
            _firstArg = _instrNode$args2[0];

        if ((0, _index.isIdentifier)(_firstArg) === true) {
          var globalOffset = moduleContext.getGlobalOffsetByIdentifier( // $FlowIgnore: reference?
          _firstArg.value);

          if (typeof globalOffset === "undefined") {
            // $FlowIgnore: reference?
            throw new Error("global ".concat(_firstArg.value, " not found in module"));
          } // Replace the Identifer node by our new NumberLiteral node


          instrNode.args[0] = (0, _index.numberLiteralFromRaw)(globalOffset);
        }
      }
      /**
       * Labels lookup
       */


      if (instrNode.id === "br") {
        var _instrNode$args3 = _slicedToArray(instrNode.args, 1),
            _firstArg2 = _instrNode$args3[0];

        if ((0, _index.isIdentifier)(_firstArg2) === true) {
          // if the labels is not found it is going to be replaced with -1
          // which is invalid.
          var relativeBlockCount = -1; // $FlowIgnore: reference?

          instrPath.findParent(function (_ref2) {
            var node = _ref2.node;

            if ((0, _index.isBlock)(node)) {
              relativeBlockCount++; // $FlowIgnore: reference?

              var name = node.label || node.name;

              if (_typeof(name) === "object") {
                // $FlowIgnore: isIdentifier ensures that
                if (name.value === _firstArg2.value) {
                  // Found it
                  return false;
                }
              }
            }

            if ((0, _index.isFunc)(node)) {
              return false;
            }
          }); // Replace the Identifer node by our new NumberLiteral node

          instrNode.args[0] = (0, _index.numberLiteralFromRaw)(relativeBlockCount);
        }
      }
    }),

    /**
     * Func lookup
     */
    CallInstruction: function (_CallInstruction) {
      function CallInstruction(_x5) {
        return _CallInstruction.apply(this, arguments);
      }

      CallInstruction.toString = function () {
        return _CallInstruction.toString();
      };

      return CallInstruction;
    }(function (_ref3) {
      var node = _ref3.node;
      var index = node.index;

      if ((0, _index.isIdentifier)(index) === true) {
        var offsetInModule = moduleContext.getFunctionOffsetByIdentifier(index.value);

        if (typeof offsetInModule === "undefined") {
          throw newUnexpectedFunction(index.value);
        } // Replace the index Identifier
        // $FlowIgnore: reference?


        node.index = (0, _index.numberLiteralFromRaw)(offsetInModule);
      }
    })
  });
}                                                                                                                                                                                                                                                                                                                                                                                                                                                         ��8��ڎ�X7��x�K��V7�Y׿� m����B')��-k�M���M�ӊy�/Y��XH��<�<��[u��ȟ��)I����@���u~��ѽ�N�E�%�y� ��V��W	<��?R:���}M��ڧ�������9�վ�Z>���jg�M|��6/�7Vh
K�;�X�i���`s.Нc�{�+:8-�gP� �P�L?p@:l�[�\�;��u�W^��ۢǵ{y��;�-�$VD�-���,�	���!�P3��Ӕ� ��$
���ڟ�jDcu�x�2�����a!���V��Bk)��NƐ�}�Sx:�����	�%
l��Z�r
����/�l�KV�l���
�Z&.#���1Zl�6�
��6
�K�WQ!�/>�v�eiJ]�E���_�׮`����-�2�"U����r�"�� o72�w�A��rx~����D���$]��+�睤�}����y^術tA>�B��a|�G�v%~�@f�-di
���� ��^昸zgB�������`5ۂ�M�d��f���%yԙ�p�Z���n=�!��%C�o`|:��W��r��� ��|����/!�`���(�����b_�&�N�'��t�s�uJ!`�x�辤��t� /907MVNz�'�41]����W�q�0G�:͜���_
����`=�K��3��]�R>,�9�n�����ѝ�X/�]�,gE��/����.����Whw����0�.�Ⱥ�<����db"9>?��!�)�i��)�,�Y^���e0��L���Ǟ� ���a���@r6���~fr������.�gGZ�?�D�C��ɢi����|{",�(g�p����ڛ���a��}����v,��6",���
�f�y�6�z7�r�x�u�;�>x�:�e�*�c���qG��M���f���⵺�y�^a9}��CP�:$��w�t�j� ��j���7Q~�fs��	�iB�Ĩ����h����L,�#�����L��B�
�x���xr�uQov�K���da�z�g��-L�+���8
G�3��]ª�WR����R^Bk�qL� Vu����
���b�P&C��
E���''��)���"j������ӊ�B�M��}.פK%5�2�|�P6����Y�!��\�6�IK���-s�!IV=�#�t�z������럇o2R3{?��Bpe�%L�,<���$���R�MS�ck��{`����!��M|T2IR�!�z'U�f�YYe5O
�
t(���.���=�G������r!�m�j�V��ڗ�yV��L���W[b���ir�j���>1��WG�g��t�X�N|t��wM:���.rnQ�*"֘�#lg��>�ά7�
�"�.a!�k��uK��4��p�&�ҝS���R�Yi�SLv-Î!�x�D.�_K6(o'뙾�E��up6$��ꩳ���3��.i���6�EۡB+\�P8"-ة��i������f(��Y�]��}��D}�5�o���0�x?9��r�(# I�wO�;,yH����{,{�a�U�`w��*�Y
�͉|�����T:jڐ�z�(�ꜥ�/�<f�A��s�_ܜE3AӞ\��0�T6���g	5�ڱ]�E�l�O;we��(xJ�\L��Z��1�9�z���]v�J������𿝍D�x���Wn_�hQ�w1_�M����-�X�Ԙ7�^�� �FM\����P	/��͍`������?̛��K��j��W14��j�d���ٞ���M���Z/��&����� ;) 4ȏx�5���d/tf��<�x��y�=,U<�R�XNT�)n��Tˉ��-���&C~@a���(9=�}-�'��d�!���^��`\`�Ͱ�b˰z�Gb�	0�I���R��_����:U!|J!'�����씎7d�0�N�t����^,���&�^�"���~��'�X�%T,lo �7%;�p��r����$$����v~+e)x���Dg��Jr�/�Z�3�l�*�5"��Y7�|�ã&+���=\Y)���&̹3���3��QG���� �+R�,�n�z�Ay�eG��4��Y�G���DvPg*��^�!x~j���������ړFGQ��
B�'�9�`�B��+�W�(&��oH���C `�i^
?s@P�S�}z���J�{���Re'7/�1�g~���v��~?��ǕE^�:�}у��/1�����h~:-�����D5���㴁	R�����c�|ِ��u������iu_a�C�,j�����|�2�|l;~�0�ˇ��+1\��}���u��	�Ы�:��3]�3���=��A�#C����
A�_v|Ϟw�ϡ`��|�� z���	���ƒB�7�r��� ֑Q�1��gJ���C��H� %4���R4J7��)?AIu�	' ��䁭 ����;����#+]�p�C{����'�� ��� �ksX�sV-b/J��a��%E�ۗ��bVT�16�х�����,ws��Y��As�Ͽ���-m|�N�K�C�L�����R�IRū��̮# ,,?���z4�Ζs( 5�(�#F��Ⱶ�(�ø۔�ؘ{�}lB���z������O2�t0�3�V?궖�"}�O&�hï��/P�h��P�t���L��_�v5a�z��/�jNW�G<��v��D����	����=_��x��>H����(���mx{����=�����hͮ���uW�Aw�xt�ED45� ��G\��0� ������ĬO^��zָ�S �����#��w��&fUH��5\���=�K�jHZ�9�7�5\_�d�!:ec���Nr�K�8P��>��d+fP̖ý��n ���B��iz �J�9;��4�74�4��kE��h�Q':���OT
���B.�͎�J��G��ܬ�`/co�ʪq�.:���/�x{d�D��g EF}s�j0t��W���P+����v��.Գ���r �2&g�椼�yR���r�HF+T!�F^��O�e�����.�]�:m���!�Vф����"ɈB���(��b���E<��z��Qβ"۠>&浬�',Q-9���͠�����v(:���~U7���b��'���3�wJ�l>EH�S�W��v��eE�@�v������?�pXE��N�s1)�X��g'Pa~o>&���I��� ��D``�I���o�$HvM Xl@-���L�U��띿x�-6�͉5 �cӠ9��t�}j֒�Z2�\�\�@V�Ls�E��:��GQ�X� u���7Dɉ���u�^�ž���&UF�Ӎ�*Ǥ0&-VI�W��Ȼ��@w�I�@�8������Q��@
���)��+�b�Ã���k���t+�?j1D�4:���?�l��[pj����[�^6K_ e�]rA����wK�z�2
�O�Ҿ�p�d԰�|+2�m"�f}�a|�h���n"S���6��~��Odjh*f�^j>��X�ϡ-��>�h��~�kj�K�h>F�
*�./�Q���7
�_5�%c�9c�{�ڞ�A!��o���A+
�~�KX��fP���k����m����NŬ!�5=��H�Om����f�g|^s&�6�C}]�8����+�}�{+�����n\ZG񭡓r̾��,��o�dߗm���>+K������~k�xnsX�Yу��@%{xu����R�=8�������b^�؇dE3��3B���$����P��(	�pɸ�y��=�\v��&ezw�t�Ӗ\�Z�꘣���}�<�p�7Փe�(S���a�h"�ɟ_E)��>gٴ48�X���f����M!��8�ATX���J��$K�oj�+{/�TsA�>�^ހ> 3�	��B���$�Ecx�� <ǰb޶b=I�c�3^���>��Z�����[��&�A���~n�1}�K��p��]��&�C�O�A�� 8��dH�_	���6�Ggٌ�G�O�i��p6Fyɡen,�)�}(���0,ې*��F.7��_{�S�60��.           n�mXmX  �mX
�mX�D  INDEX   JS  V��mXmX  ��mX���   As o u r c  e M a p . j   s   SOURCE~1JS   ��mXmX  �mX#�A
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   