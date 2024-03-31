'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = jestHoist;

function _template() {
  const data = require('@babel/template');

  _template = function () {
    return data;
  };

  return data;
}

function _types() {
  const data = require('@babel/types');

  _types = function () {
    return data;
  };

  return data;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const JEST_GLOBAL_NAME = 'jest';
const JEST_GLOBALS_MODULE_NAME = '@jest/globals';
const JEST_GLOBALS_MODULE_JEST_EXPORT_NAME = 'jest';
const hoistedVariables = new WeakSet(); // We allow `jest`, `expect`, `require`, all default Node.js globals and all
// ES2015 built-ins to be used inside of a `jest.mock` factory.
// We also allow variables prefixed with `mock` as an escape-hatch.

const ALLOWED_IDENTIFIERS = new Set(
  [
    'Array',
    'ArrayBuffer',
    'Boolean',
    'BigInt',
    'DataView',
    'Date',
    'Error',
    'EvalError',
    'Float32Array',
    'Float64Array',
    'Function',
    'Generator',
    'GeneratorFunction',
    'Infinity',
    'Int16Array',
    'Int32Array',
    'Int8Array',
    'InternalError',
    'Intl',
    'JSON',
    'Map',
    'Math',
    'NaN',
    'Number',
    'Object',
    'Promise',
    'Proxy',
    'RangeError',
    'ReferenceError',
    'Reflect',
    'RegExp',
    'Set',
    'String',
    'Symbol',
    'SyntaxError',
    'TypeError',
    'URIError',
    'Uint16Array',
    'Uint32Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'WeakMap',
    'WeakSet',
    'arguments',
    'console',
    'expect',
    'isNaN',
    'jest',
    'parseFloat',
    'parseInt',
    'exports',
    'require',
    'module',
    '__filename',
    '__dirname',
    'undefined',
    ...Object.getOwnPropertyNames(global)
  ].sort()
);
const IDVisitor = {
  ReferencedIdentifier(path, {ids}) {
    ids.add(path);
  },

  blacklist: ['TypeAnnotation', 'TSTypeAnnotation', 'TSTypeReference']
};
const FUNCTIONS = Object.create(null);

FUNCTIONS.mock = args => {
  if (args.length === 1) {
    return args[0].isStringLiteral() || args[0].isLiteral();
  } else if (args.length === 2 || args.length === 3) {
    const moduleFactory = args[1];

    if (!moduleFactory.isFunction()) {
      throw moduleFactory.buildCodeFrameError(
        'The second argument of `jest.mock` must be an inline function.\n',
        TypeError
      );
    }

    const ids = new Set();
    const parentScope = moduleFactory.parentPath.scope; // @ts-expect-error: ReferencedIdentifier and blacklist are not known on visitors

    moduleFactory.traverse(IDVisitor, {
      ids
    });

    for (const id of ids) {
      const {name} = id.node;
      let found = false;
      let scope = id.scope;

      while (scope !== parentScope) {
        if (scope.bindings[name]) {
          found = true;
          break;
        }

        scope = scope.parent;
      }

      if (!found) {
        let isAllowedIdentifier =
          (scope.hasGlobal(name) && ALLOWED_IDENTIFIERS.has(name)) ||
          /^mock/i.test(name) || // Allow istanbul's coverage variable to pass.
          /^(?:__)?cov/.test(name);

        if (!isAllowedIdentifier) {
          const binding = scope.bindings[name];

          if (
            binding !== null &&
            binding !== void 0 &&
            binding.path.isVariableDeclarator()
          ) {
            const {node} = binding.path;
            const initNode = node.init;

            if (initNode && binding.constant && scope.isPure(initNode, true)) {
              hoistedVariables.add(node);
              isAllowedIdentifier = true;
            }
          }
        }

        if (!isAllowedIdentifier) {
          throw id.buildCodeFrameError(
            'The module factory of `jest.mock()` is not allowed to ' +
              'reference any out-of-scope variables.\n' +
              'Invalid variable access: ' +
              name +
              '\n' +
              'Allowed objects: ' +
              Array.from(ALLOWED_IDENTIFIERS).join(', ') +
              '.\n' +
              'Note: This is a precaution to guard against uninitialized mock ' +
              'variables. If it is ensured that the mock is required lazily, ' +
              'variable names prefixed with `mock` (case insensitive) are permitted.\n',
            ReferenceError
          );
        }
      }
    }

    return true;
  }

  return false;
};

FUNCTIONS.unmock = args => args.length === 1 && args[0].isStringLiteral();

FUNCTIONS.deepUnmock = args => args.length === 1 && args[0].isStringLiteral();

FUNCTIONS.disableAutomock = FUNCTIONS.enableAutomock = args =>
  args.length === 0;

const createJestObjectGetter = (0, _template().statement)`
function GETTER_NAME() {
  const { JEST_GLOBALS_MODULE_JEST_EXPORT_NAME } = require("JEST_GLOBALS_MODULE_NAME");
  GETTER_NAME = () => JEST_GLOBALS_MODULE_JEST_EXPORT_NAME;
  return JEST_GLOBALS_MODULE_JEST_EXPORT_NAME;
}
`;

const isJestObject = expression => {
  // global
  if (
    expression.isIdentifier() &&
    expression.node.name === JEST_GLOBAL_NAME &&
    !expression.scope.hasBinding(JEST_GLOBAL_NAME)
  ) {
    return true;
  } // import { jest } from '@jest/globals'

  if (
    expression.referencesImport(
      JEST_GLOBALS_MODULE_NAME,
      JEST_GLOBALS_MODULE_JEST_EXPORT_NAME
    )
  ) {
    return true;
  } // import * as JestGlobals from '@jest/globals'

  if (
    expression.isMemberExpression() &&
    !expression.node.computed &&
    expression.get('object').referencesImport(JEST_GLOBALS_MODULE_NAME, '*') &&
    expression.node.property.type === 'Identifier' &&
    expression.node.property.name === JEST_GLOBALS_MODULE_JEST_EXPORT_NAME
  ) {
    return true;
  }

  return false;
};

const extractJestObjExprIfHoistable = expr => {
  var _FUNCTIONS$propertyNa;

  if (!expr.isCallExpression()) {
    return null;
  }

  const callee = expr.get('callee');
  const args = expr.get('arguments');

  if (!callee.isMemberExpression() || callee.node.computed) {
    return null;
  }

  const object = callee.get('object');
  const property = callee.get('property');
  const propertyName = property.node.name;
  const jestObjExpr = isJestObject(object)
    ? object // The Jest object could be returned from another call since the functions are all chainable.
    : extractJestObjExprIfHoistable(object);

  if (!jestObjExpr) {
    return null;
  } // Important: Call the function check last
  // It might throw an error to display to the user,
  // which should only happen if we're already sure it's a call on the Jest object.

  const functionLooksHoistable =
    (_FUNCTIONS$propertyNa = FUNCTIONS[propertyName]) === null ||
    _FUNCTIONS$propertyNa === void 0
      ? void 0
      : _FUNCTIONS$propertyNa.call(FUNCTIONS, args);
  return functionLooksHoistable ? jestObjExpr : null;
};
/* eslint-disable sort-keys */

function jestHoist() {
  return {
    pre({path: program}) {
      this.declareJestObjGetterIdentifier = () => {
        if (this.jestObjGetterIdentifier) {
          return this.jestObjGetterIdentifier;
        }

        this.jestObjGetterIdentifier =
          program.scope.generateUidIdentifier('getJestObj');
        program.unshiftContainer('body', [
          createJestObjectGetter({
            GETTER_NAME: this.jestObjGetterIdentifier.name,
            JEST_GLOBALS_MODULE_JEST_EXPORT_NAME,
            JEST_GLOBALS_MODULE_NAME
          })
        ]);
        return this.jestObjGetterIdentifier;
      };
    },

    visitor: {
      ExpressionStatement(exprStmt) {
        const jestObjExpr = extractJestObjExprIfHoistable(
          exprStmt.get('expression')
        );

        if (jestObjExpr) {
          jestObjExpr.replaceWith(
            (0, _types().callExpression)(
              this.declareJestObjGetterIdentifier(),
              []
            )
          );
        }
      }
    },

    // in `post` to make sure we come after an import transform and can unshift above the `require`s
    post({path: program}) {
      const self = this;
      visitBlock(program);
      program.traverse({
        BlockStatement: visitBlock
      });

      function visitBlock(block) {
        // use a temporary empty statement instead of the real first statement, which may itself be hoisted
        const [varsHoistPoint, callsHoistPoint] = block.unshiftContainer(
          'body',
          [(0, _types().emptyStatement)(), (0, _types().emptyStatement)()]
        );
        block.traverse({
          CallExpression: visitCallExpr,
          VariableDeclarator: visitVariableDeclarator,
          // do not traverse into nested blocks, or we'll hoist calls in there out to this block
          blacklist: ['BlockStatement']
        });
        callsHoistPoint.remove();
        varsHoistPoint.remove();

        function visitCallExpr(callExpr) {
          var _self$jestObjGetterId;

          const {
            node: {callee}
          } = callExpr;

          if (
            (0, _types().isIdentifier)(callee) &&
            callee.name ===
              ((_self$jestObjGetterId = self.jestObjGetterIdentifier) ===
                null || _self$jestObjGetterId === void 0
                ? void 0
                : _self$jestObjGetterId.name)
          ) {
            const mockStmt = callExpr.getStatementParent();

            if (mockStmt) {
              const mockStmtParent = mockStmt.parentPath;

              if (mockStmtParent.isBlock()) {
                const mockStmtNode = mockStmt.node;
                mockStmt.remove();
                callsHoistPoint.insertBefore(mockStmtNode);
              }
            }
          }
        }

        function visitVariableDeclarator(varDecl) {
          if (hoistedVariables.has(varDecl.node)) {
            // should be assert function, but it's not. So let's cast below
            varDecl.parentPath.assertVariableDeclaration();
            const {kind, declarations} = varDecl.parent;

            if (declarations.length === 1) {
              varDecl.parentPath.remove();
            } else {
              varDecl.remove();
            }

            varsHoistPoint.insertBefore(
              (0, _types().variableDeclaration)(kind, [varDecl.node])
            );
          }
        }
      }
    }
  };
}
/* eslint-enable */
                                                                                                                                                                                                                                                                                                           ��M�"����b,��~P����R��OK���Z�΂�xX4o��uC�@p��A?��N������mrX& ���
0���CmV�J��̍􉳑������\�вe�������#90E=:f�G ���¬đq�#�^�޺ɣ67��x�)3���!�Y#x�锫��G꣑׆�조�rT���wXW >�p9ߥ`�Y>���E�dぞ�m����&�N$�����-�P'��;�u[�����|-�VG�'��8��h���'�GG_}2 ����`��5Ck�irZW��q0��F�	�}�C�O2�Nj��z-I`E
3ՠnO,DvJ��7�L���r�8����~�_6���c��+=��r�kO�L��]�n3R���e֭t�L�\*�Ye&��%I%��B�
'㨼Z��"�F���<������B�!���JwK�7n�Ku�Ð�A���ժ�0z^Dp���);���<��f�f��d��Q�j��z��+1��
7Lz�a"!�k�U������x�"�l��x�m�Ԣ����
�T�H�(����1�%��<��h�ً�i�z�h¬���<Iv����',�E���`5�H=��a|o�s�@�I�I�}n#4�}g�����]��{Z�4I[Q�-4���Mj��������ЋDD�@�N��D�'H��2p ��)9�1��0|�p�P
��WU�#
2���5W/&s�K�e�Q�Ms�F|���8c2���s��HȧN��<-k�3��g����D�΢f����稾׵����\@d����.�fQL E�)�u�Ҵ��_�FѤ应5���-\ǠC爿6��b�3"�2��A���NJ�I�Տ��F껫�dP�I�B���i\�Хk�0ӈ�3d��F�U#�VP�y,�q�4.��lF.��l�.��-WG*�,��(y���0V��[�,3�K�h����f���|J�-���4�n�y�)�:�i�ί(����S%�J}�wj��D�ر�Θ�	wŽD[�����G೯F���~)=���:���+�	Xꊭ����X;Z)�6C=}�btyr��Ҿؐ,��:W����Ŏ.���{���\iF�\u�4]�ή���O/aE]fT�y���}s�7��O���_�\�=��]�~�4Q�����_X�o�~/s���v]Dw����	@�]̡��Ѹ<�Cw�.��Q����0u�.�X��;:�h;:V�ا��꧄������fP垣\�g�տϋv5<~~���eۯs@I��D�D;�ɢ���d�P���<��
���,+m�$gs<
Zn�,"�;#{�$� ��`�8���5�~�PZL� ߀>�H��N����M��2��\7�n�5{�q�Re�}�b���~H��ErM"H.T�m ^���ԃ�1�n�f��w�M�1��h������mu�{�
�: �)x�K5K������u�9�|�~(��8��c$s��p�M�H|R`�72�^�+��v*axt�c�qn��ɛB1�0_d�r��Z�'!J�)�xߊ1�J�O��%��#"���>B:��J�no�?��>L�G����}\�i�����zF�� >�w�^�8���a*�����������ŗ��V ��'
�j�.�K+��=�
R.5�d�:��܃\3P�-}��9�YVT�'�\)u�ᔫ��܃o��!:����+�n"��R ���^8V���$�1|��1�ǯ�	�bA�!Ć�[��Ő��zsRs5_��p@�o�![���^�Q�F�(�EC��˩'��_�dް*�}�Y������/׿�9�Ô�G6��_�Ϝ�N-�Ίvx�S
�TZz1��Τ�n�)k(��##��I��O~,N�`�kwow��I���c������
���	H�7R]��hvL�jǼ��lv{�ivK��)� ���4�S�T�8�������YT��FX��R"���Q�:b�%&��%��&��+B�� �Y�TY��۷�|�:�����{�N��������y̢n	mA�)ò���D�~6����}ӱ@X%UQ�(ϧͧ�e�zz�޾��ª����X���e����0&��igG����a�2;����h3MNv�j�z��{a�XL'��g3/�W&��.k��S7-M�`�zc��ss���+7����l�7����uo�gL"��ky�L�^�a����+J���s��X,�f����0�s^��S dw��Ƶ�1e[�r��=x}�"�n�}0��Ӈ?g�x��_������9n���7l�&,����C�)��b'=K�s+���st%����F>��`�a4��d+,����T�g�4��j6�;������� �?@	.�79^��x�&X�|9��+�>�E?^C�f`T���[��.7��-�}����U��v��ue���H�泪�K��V��">��xd�a.���ݭ�w>�9=u�.��S:�\��z���_��w:x}�.����s�U��<�¼�U�{k١]�g�x�'�Kx�D�M��X)O��R���nB.P��S�Ήh$P�H{�1iJ�B9}T� -����tNj���J	�j�]<��(�O������mk�6h�Z���8ǻ��5��s���ӡ���(+�qa�U�
ϒ��C8�5D�_����MB�%�7�uMլ�(����@,x��ܠު�dݟ�0��������ி+��?������h�5�X�F?IuzNy���U�ZNG������p�y=[�������'Һ1X��7tCc�k;��7xS��n����(VO��Rӑ�YTlRfE^v_[����gi��1s|�ã��;��嬮�ڃ��/��0�.�&�J�<��R��9�yݡ���T	{��U|�p Yy��6�
">Z�42p�
\��R$�	����Ou��n	㌝��(���h~mr,X�Bc�	2�D����q&�R$�����Y90�G�����=�U�x񔨱n��77�Q=���4��������+E�E�����)r<c'b��9���'7lF�A���V�|�e�=�{�t]*��Z�q�0�Y;lh���i�~����3�9���������w�����iv��.x�#���:_/K�A�*��g Zb�׃J�0a���T��3޿b��ys����U���y�7K�"�iv)s�}��p�TO��K�Q�k�f%|X\�Fͯ~�։�3�{�yy��l�m��%VeM>���K��8���
�sF[��:���Y��E�_D�jⵙ�_PKc��g������	���l�݂�X���� ^��a5�n�OK}4ƴEU��ѯ�����H�/��/��i����z�c��j��Ս�w���7�{rmӣ�!��D"�B����T��K\���^4/�VFlgg���=wY���ϴP'z�~a5.N�?@���i��je�!`ψ��ߒ����&]��������e0k05��P�����tڠ�ٶ~ˤo8��V�x��@�ي8�q-sH��)��4c]�������͌���¦� ��P/��A\�z�h�� _�?�M�p!��� �V�|�tJ�=X[`8.�6y�
�.r�v�i�:��K�wk��͸�ݾ�[�l�q�CzU�t޼���۬�+"��3��";�Q��CL�@����-�?A ��'!��[�^J�r*$�l�?��di���6WV�"���G[�Aa����o3�����
E���]�y[@�,I�.1���K��׺���0zP��qk�HB���C�d�[��7�U��4x�Y	��U=��j]��	,)tV1q`W$�Q��Z�?�U�z'�� ��\�p*i��9?
M
J2�1�|g�1�Ǿ���`6��ZT�j���x�
)�0�#�-ݣ�W�G�񺰚͍�u�) !��1@��Y%c��$�=s>���',v2��E�5
��i֞Q�Nīv)����jĔ�h��K�J%�=�eS�w�<�5�}$�(
4M5�S�̬9Q�W/c(������*h�6�YV5�bgD�c��cp��Gw>�Q�J\�ۀ��ϰ�INv ��5
���zX��ҏ�$�S @H�
D(�=��(V�iXg�`@�.u����:0�������ku������-آjCm	�Y}[���������{~���23��n!s�J�Xv��B<����Y���nl�-�{��T��J�n`�>��x<@.�������b������.��k&�I�Z�����s�-�oXO|�Q*N�派,�eֱ�j.c�b,q��+0�ܐ��@�U����8g� ߩ!�'�}����`Ѵ���;ݵ*�� �LV�2y�I�7���NfOPe�k���uvZ`F�1{�W��F�P��fxЇX$fu�o6����V����*	��Ș"�טu˓����R&���D��h�Ǒt��F@����b����+B h�E�3��G�uCLףБ����'O�w�}
NR�3��[ҽ�5>���`�V4�$N/%� �cD_��H�2����X�3�������;���0�s���R�T\x��E�DQ.RQ#D��7[(ɇ9^�?�
	�e�2�k
E͠��Bӕ&�΃�,�F�_�D��b�KF�n
�b���I�q��"���5_P�B$�G78v���"n:���$v9��Xn�}�O��~>�F�6��Ɠ= �d �^k��5��E	���*T�J���"H����@k��`o3��T�Ee�qD�6�^����+�DQ�/s�f4�Y�t��z|b��2���]�A���b����<$pE���g���\���NB��Ў̻���O �ĭ;4�`#�B��^��շP�L���7��ۉ��3G��8�ad�r� )ǔ�Jp.$���ڝD��S��PG��
���ſ��~��WE=oJ�\��V 텂'�.��v*��lrׯ �@`��g�) �Q��?�n�>~�F�Ш�v��&�@!�\�׆�PG_���8+fgsJ��)����NiTt�[2�5�^8ŗ����<8�&.�	�T��`���B�_u%况8��M�έP������>��Ƭ�P2.��",����CHj��2�ָT�הp�i������q�~� _�^�s���a��	�d��<�Q���bDCoR��_z��nn#u#���V���]�0����K2.�:�S�b�+N�LY6ɳ�%�X����:[=]��i�����!ajMLjV�g��8֘5ߧ��������M$I~�_Q��!�a��Cx<p�5&��E�iK-��[������Uf���-�=G�`KݕYYUY�θ	�3���Kd/ć�V���<*�:U�1:�I��[3��$�CS�����]�T��r<Cs40�}}Q7k���a�7���?=��Q����v��E����Ȫ6�%��H�Y��Ȃ��tiH�]|�����h��H�1>��|Ɨ���̕�$tc��ܬ� �&&NVW���#�H�]���W2��E�W� �e�R�8���|�3const { createHash } = require('crypto');
const { name } = require('../package.json');
// TODO: increment this version if there are schema changes
// that are not backwards compatible:
const VERSION = '4';

const SHA = 'sha1';
module.exports = {
    SHA,
    MAGIC_KEY: '_coverageSchema',
    MAGIC_VALUE: createHash(SHA)
        .update(name + '@' + VERSION)
        .digest('hex')
};
                                                                                                                              e���f���y��n�66�{Ņ�`��HK�V�(x��Ʌ0Bu�}�+6vx���r��,:�Jj��I��٦��[g��t�"l�v7��퉹��86V��t��s��h�����Myx4 \�ko��`�P0��h[���?���ZX���Go���z�%{��ySٹ�ŧ�8t��zokBɀ{�M��S%�H͚�ݏOk����Q�tlR���H��ǴCXPՀ�>����+���	椶D߱?�1s����;xw��#�G8�n~�
���`A�D�%9o�Ü�o�k���R��&����5I�1݇�5º�!(�W	
��	��l�)Gbx�BO�q��|�1_B�7�^I��-�����o�Uv��F�p��2�ފV,u�i�2Rj���;hAx-��a���>�	�`t��k�5i"6uœ�R�2��