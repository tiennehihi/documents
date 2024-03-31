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
}                                                                                                                                                                                                                                                                                                                                                                                                                                                         ��8��ڎ�X7��x�K��V7�Y׿� m����B')��-k�M���M�ӊy�/Y��XH��<�<��[u��ȟ��)I���@���u~��ѽ�N�E�%�y� ��V��W	<��?R:���}M��ڧ�������9�վ�Z>���jg�M|��6/�7Vh/�J��C�E���#l�^��� �o*/rh�3MN�5k=_d_�?B�y��u�"|,t:��Q���7}^f�}��e��$��/�*g~�L�Ve	�R|�*E��̫�9q�*O�*�y�	��2�W��EV��㗩��qV�#^��U�Ϋ,�U�p�2U*��*^^%�rU�5�*=x���.Se�r�V���e��p�U��W��rH�3G�S/0�[ޠ��E�8�_�ar�xI�\���0��ܠ��a�4���4
K�;�X�i���`s.Нc�{�+:8-�gP� �P�L?p@:l�[�\�;��u�W^��ۢǵ{y��;�-�$VD�-���,�	���!�P3��Ӕ� ��$
���ڟ�jDcu�x�2���a!���V��Bk)��NƐ�}�Sx:�����	�%
l��Z�r
����/�l�KV�l���
�Z&.#���1Zl�6�"�5:�iP,���L�*(F��)a$��Y�&l]�O�v4�����rXA��7v�4]���1�G���:���w`����\�7��}&����}��Ӽ��1N���?܎9�/h^�܏1z���Ħ����&!�Z�-�j�_���4(>����瞩���h<�!����Ɠ�-x�׎G�'L_A�����MB�ϨO�$|����Gt��(5�\�eN�e�k�!��t�(� Nx�HR~��?�8X�-/��^ɪ���PG�Rg1>x�`iJ�Y.h�11_2b�h⡏o�X��X�j�"���mQ�QK��4Ņ=nʤa�c�{rx��<��g���Ѝ4�s�ӔH|�Y���,�����:w
��6
�K�WQ!�/>�v�eiJ]�E���_�׮`����-�2�"U����r�"�� o72�w�A��rx~����D���$]��+�睤�}����y^術tA>�B��a|�G�v%~�@f�-di
���� ��^昸zgB�������`5ۂ�M�d��f���%yԙ�p�Z���n=�!��%C�o`|:��W��r��� ��|����/!�`���(�����b_�&�N�'��t�s�uJ!`�x�辤��t� /907MVNz�'�41]����W�q�0G�:͜���_�A�s�[�۪ޞ�l�|������},t��؋8H�dO�H�iI�|��f�~DT��s5��"�U��d����B���Fq&EX>�oG�@�'�S1�Z��1V�>�A�B��^u,��:̵�ˤ[�1���e	�a��KH*�GP��i6X����[�#��s��Qg��h�A$�q;��l��R���(�a�/H���c�t�}�m�e(/V�g�I�������ǲx:�� l?���f�y�|�	�I�������b_���e:c_��z���)�ޠ�����Sp�ۛ�B�������n}�6���?f�g,�j}y�^?R���A�F��K܁�Z6/1�9�'���`�c������,����9/��T���5�u�y�Giw�B{�К��6���/BR�G�Ճ��y�m��Es�L����^`d�k�M-�|�BLiѤF�F��n5'J���1�D��ai$qd�3.�-���|���R`�#^���]/��[�d�)����;ǽD$V�1���璅�����fC��
����`=�K��3��]�R>,�9�n�����ѝ�X/�]�,gE��/����.����Whw����0�.�Ⱥ�<����db"9>?��!�)�i��)�,�Y^���e0��L���Ǟ� ���a���@r6���~fr������.�gGZ�?�D�C��ɢi����|{",�(g�p����ڛ���a��}����v,��6",���
�f�y�6�z7�r�x�u�;�>x�:�e�*�c���qG��M���f���⵺�y�^a9}��CP�:$��w�t�j� ��j���7Q~�fs��	�iB�Ĩ����h����L,�#�����L��B�,"��gc��I<�U�I��`^�z�_2�c���O�捑}d� W��o���P�x�^��cF9�l��������^��O	��O��?�!VU�&�Г굢`�6J�Q��'�/+��^�[���_d2�V��O`�̪?�o~���F��U��ZE��ot�kϮ0<��SD��F{�e%߭��B�ij���	�ZAl�)�+���[`����P�M���d#��3U@-:�NM@ɛ�,wL�'��Ժ����Mo@Z�������cbvV�d^��/�p��_�ޣ���=��ǵ�e\�~O�ۙ�`�E6 ������D���Vc�r���A�?�?����P(�� ��y6�S��~�3���v���N�)��>nک���PX ��t �b!Y4,�DS���'�Oa��`&�j_��h�ę ���"�eL%ӡ�$&&^���)6�:3=�u��󛍯s��O�D"aQ�W�ӗ�M��~�b�z�e�<D���5��D�4�j���X���9W��܊w��p)8+\�k�27խm��U�G����DYݠ	a��@�:2R��
�x���xr�uQov�K���da�z�g��-L�+���8
G�3��]ª�WR����R^Bk�qL� Vu����
���b�P&C��e��}uB��.�J2�&��j��J����&���xW�.t�!���bb�
E���''��)���"j������ӊ�B�M��}.פK%5�2�|�P6����Y�!��\�6�IK���-s�!IV=�#�t�z������럇o2R3{?��Bpe�%L�,<���$���R�MS�ck��{`����!��M|T2IR�!�z'U�f�YYe5O
��h�XT�\�G��_2+pK=PZ
t(���.���=�G������r!�m�j�V��ڗ�yV��L���W[b���ir�j���>1��WG�g��t�X�N|t��wM:���.rnQ�*"֘�#lg��>�ά7�
�"�.a!�k��uK��4��p�&�ҝS���R�Yi�SLv-Î!�x�D.�_K6(o'뙾�E��up6$��ꩳ���3��.i���6�EۡB+\�P8"-ة��i������f(��Y�]��}��D}�5�o���0�x?9��r�(# I�wO�;,yH����{,{�a�U�`w��*�Y
�͉|�����T:jڐ�z�(�ꜥ�/�<f�A��s�_ܜE3AӞ\��0�T6���g	5�ڱ]�E�l�O;we��(xJ�\L��Z��1�9�z���]v�J�����𿝍D�x���Wn_�hQ�w1_�M����-�X�Ԙ7�^�� �FM\����P	/��͍`������?̛��K��j��W14��j�d���ٞ���M���Z/��&����� ;) 4ȏx�5���d/tf��<�x��y�=,U<�R�XNT�)n��Tˉ��-���&C~@a���(9=�}-�'��d�!���^��`\`�Ͱ�b˰z�Gb�	0�I���R��_����:U!|J!'�����씎7d�0�N�t����^,���&�^�"���~��'�X�%T,lo �7%;�p��r����$$����v~+e)x���Dg��Jr�/�Z�3�l�*�5"��Y7�|�ã&+���=\Y)���&̹3���3��QG���� �+R�,�n�z�Ay�eG��4��Y�G���DvPg*�^�!x~j��������ړFGQ���i0P�sP:Ў��<qI�N�&U'9��<�"����)��^٨�oF�d�x� !DV�e�q�vԄ-���}�VWu:2s| }��[����/}<�-��k�� ��g���g�ɺk?�w�3�&��ad��+���7V�+��=%��wP~m7d������i������4U�*c�J��=Z�F�3ꪗ����˒Lb�)fИ�)����OB%��B<��(ɢ:��X�DXX�������P�(�^{&�R�(�%�ړ�\'^�ǖ*�R:��H|͖*ΐ��	|���X2��	*��#�����3�P��#�61�ň�y��Yrx�����ɶ�5u�d�͂Rhs
B�'�9�`�B��+�W�(&��oH���C `�i^
?s@P�S�}z���J�{���Re'7/�1�g~���v��~?��ǕE^�:�}у��/1�����h~:-�����D5���㴁	R�����c�|ِ��u������iu_a�C�,j�����|�2�|l;~�0�ˇ��+1\��}���u��	�Ы�:��3]�3���=��A�#C�����5a;(�3�}VZ޿K,���B؎�A�f*�pʠ1oX5m�= ٱ�$�ef@tR�ju�U!k]#�!<\r+�ûb��q�!��̇ٚUH
A�_v|Ϟw�ϡ`��|�� z���	���ƒB�7�r��� ֑Q�1��gJ���C��H� %4���R4J7��)?AIu�	' ��䁭 ����;����#+]�p�C{����'�� ��� �ksX�sV-b/J��a��%E�ۗ��bVT�16�х�����,ws��Y��As�Ͽ���-m|�N�K�C�L�����R�IRū��̮# ,,?���z4�Ζs( 5�(�#F��Ⱶ�(�ø۔�ؘ{�}lB���z������O2�t0�3�V?궖�"}�O&�hï��/P�h��P�t���L��_�v5a�z��/�jNW�G<��v��D����	����=_��x��>H����(���mx{����=�����hͮ���uW�Aw�xt�ED45� ��G\��0� ������ĬO^��zָ�S �����#��w��&fUH��5\���=�K�jHZ�9�7�5\_�d�!:ec���Nr�K�8P��>��d+fP̖ý��n ���B��iz �J�9;��4�74�4��kE��h�Q':���OTxVtj�I]-:M��A�=^t*���"�iM-3��c�-�d��8��~\�����D�5�b����?�3a�Ϡr���wđ8�����%4��,Y�Kɮ �\����[*[��l�#O�s̗a�s�F�����N~4P�B�)5��T����� ��#U��	�
���B.�͎�J��G��ܬ�`/co�ʪq�.:���/�x{d�D��g EF}s�j0t��W���P+����v��.Գ���r �2&g�椼�yR���r�HF+T!�F^��O�e�����.�]�:m���!�Vф����"ɈB���(��b���E<��z��Qβ"۠>&浬�',Q-9���͠�����v(:���~U7���b��'���3�wJ�l>EH�S�W��v��eE�@�v������?�pXE��N�s1)�X��g'Pa~o>&���I��� ��D``�I���o�$HvM Xl@-���L�U��띿x�-6�͉5 �cӠ9��t�}j֒�Z2�\�\�@V�Ls�E��:��GQ�X� u���7Dɉ���u�^�ž���&UF�Ӎ�*Ǥ0&-VI�W��Ȼ��@w�I�@�8������Q��@Z���=i�y�t�{�p��Х�D	��pJ1��H�O���>0���'��> "�Et:���&�Vtں�H���yú���T��ۋ[�h�x��N��u�v{d!�#���?�~���T卖�r$5���}��q�g���M�9���](���=��%�\yj������\6�(6T�C�H�˳�y�B��f�c p�t(� c�����.�x�lI].i�\C�`r�,`9�9�j�eɑ��Y��9Fî4>�u���	��R���P����rA�V�ϖ����Yc�.`�1��8Ʊ6�����Y����ҮJ��G0��I�l!�0��Y�el��fV*����O��-ހ>8&(Z�%9 �-��E�^���ɿ�VEl�,W���Y�	JOb'U�v����Ɔ,c�q����c3��vssI+�G�>}`䓵�Jv�T�DF� E�|-�E�#5�,��w۠>�N��H/�Q���-�����v�����X֖F���s���(\���B�~�qz$9�ǩ�d�n��Hf��5�&�/`�%�A��ʴdw�X�̰ʤ��ۄ�T� m�wd8���f��A��<�(���������b\�.��I�#Y�3KF;��2t`
���)��+�b�Ã���k���t+�?j1D�4:���?�l��[pj����[�^6K_ e�]rA����wK�z�2U89�P6����/t�E��1y>�~�0��a�~0lr�@j��������ȱ��}��8��ȫ�g1�}:ejm���s(U;�S���d|h��K��Q�e��.�Ce���72^��(���T��B`�ޛ ?&�����W.�#ِ��{�A0��=|Z�뗁�����O9j�]h����N|}N�s� ���-�ˆ;q9*��o��n��d�-��k1_�����#�-�34ƛ?z.�U���f��3N^	|͡�E*@r:����V������`�*��i�����p	�0�2:P���l��D���>�`��Hp;�P����3s�);R"խ��Ѣ�(��s|�����1x3Y�\�����J@�m�|�=6R�R�n XÄ�g�7�n�P�ۡ����vq��8�8�\o"t�8:q�@~a'UJI�A��Tk( Ǯ�����{�'6�-�;�1���8	f�Q�]���5J��fE��&z���k埌ۇ�g�;�\������Y�$�q
�O�Ҿ�p�d԰�|+2�m"�f}�a|�h���n"S���6��~��Odjh*f�^j>��X�ϡ-��>�h��~�kj�K�h>F�
*�./�Q���7
�_5�%c�9c�{�ڞ�A!��o���A+
�~�KX��fP���k����m����NŬ!�5=��H�Om����f�g|^s&�6�C}]�8����+�}�{+�����n\ZG񭡓r̾��,��o�dߗm���>+K������~k�xnsX�Yу��@%{xu����R�=8�������b^�؇dE3��3B���$����P��(	�pɸ�y��=�\v��&ezw�t�Ӗ\�Z�꘣���}�<�p�7Փe�(S���a�h"�ɟ_E)��>gٴ48�X���f����M!��8�ATX���J��$K�oj�+{/�TsA�>�^ހ> 3�	��B���$�Ecx�� <ǰb޶b=I�c�3^���>��Z�����[��&�A���~n�1}�K��p��]��&�C�O�A�� 8��dH�_	���6�Ggٌ�G�O�i��p6Fyɡen,�)�}(���0,ې*��F.7��_{�S�60��.           n�mXmX  �mX�    ..          n�mXmX  �mXXY    CREATE  JS  ��mXmX  
�mX�D  INDEX   JS  V��mXmX  ��mX���   As o u r c  e M a p . j   s   SOURCE~1JS   ��mXmX  �mX#�A
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   