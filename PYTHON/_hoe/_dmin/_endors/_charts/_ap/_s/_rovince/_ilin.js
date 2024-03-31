/**
 * @fileoverview Standardize the way function component get defined
 * @author Stefan Wullems
 */

'use strict';

const arrayIncludes = require('array-includes');
const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const reportC = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function buildFunction(template, parts) {
  return Object.keys(parts).reduce(
    (acc, key) => acc.replace(`{${key}}`, () => parts[key] || ''),
    template
  );
}

const NAMED_FUNCTION_TEMPLATES = {
  'function-declaration': 'function {name}{typeParams}({params}){returnType} {body}',
  'arrow-function': '{varType} {name}{typeAnnotation} = {typeParams}({params}){returnType} => {body}',
  'function-expression': '{varType} {name}{typeAnnotation} = function{typeParams}({params}){returnType} {body}',
};

const UNNAMED_FUNCTION_TEMPLATES = {
  'function-expression': 'function{typeParams}({params}){returnType} {body}',
  'arrow-function': '{typeParams}({params}){returnType} => {body}',
};

function hasOneUnconstrainedTypeParam(node) {
  const nodeTypeParams = node.typeParameters;

  return nodeTypeParams
    && nodeTypeParams.params
    && nodeTypeParams.params.length === 1
    && !nodeTypeParams.params[0].constraint;
}

function hasName(node) {
  return (
    node.type === 'FunctionDeclaration'
    || node.parent.type === 'VariableDeclarator'
  );
}

function getNodeText(prop, source) {
  if (!prop) return null;
  return source.slice(prop.range[0], prop.range[1]);
}

function getName(node) {
  if (node.type === 'FunctionDeclaration') {
    return node.id.name;
  }

  if (
    node.type === 'ArrowFunctionExpression'
    || node.type === 'FunctionExpression'
  ) {
    return hasName(node) && node.parent.id.name;
  }
}

function getParams(node, source) {
  if (node.params.length === 0) return null;
  return source.slice(
    node.params[0].range[0],
    node.params[node.params.length - 1].range[1]
  );
}

function getBody(node, source) {
  const range = node.body.range;

  if (node.body.type !== 'BlockStatement') {
    return ['{', `  return ${source.slice(range[0], range[1])}`, '}'].join('\n');
  }

  return source.slice(range[0], range[1]);
}

function getTypeAnnotation(node, source) {
  if (!hasName(node) || node.type === 'FunctionDeclaration') return;

  if (
    node.type === 'ArrowFunctionExpression'
    || node.type === 'FunctionExpression'
  ) {
    return getNodeText(node.parent.id.typeAnnotation, source);
  }
}

function isUnfixableBecauseOfExport(node) {
  return (
    node.type === 'FunctionDeclaration'
    && node.parent
    && node.parent.type === 'ExportDefaultDeclaration'
  );
}

function isFunctionExpressionWithName(node) {
  return node.type === 'FunctionExpression' && node.id && node.id.name;
}

const messages = {
  'function-declaration': 'Function component is not a function declaration',
  'function-expression': 'Function component is not a function expression',
  'arrow-function': 'Function component is not an arrow function',
};

module.exports = {
  meta: {
    docs: {
      description: 'Enforce a specific function type for function components',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('function-component-definition'),
    },
    fixable: 'code',

    messages,

    schema: [
      {
        type: 'object',
        properties: {
          namedComponents: {
            anyOf: [
              {
                enum: [
                  'function-declaration',
                  'arrow-function',
                  'function-expression',
                ],
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                  enum: [
                    'function-declaration',
                    'arrow-function',
                    'function-expression',
                  ],
                },
              },
            ],
          },
          unnamedComponents: {
            anyOf: [
              { enum: ['arrow-function', 'function-expression'] },
              {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['arrow-function', 'function-expression'],
                },
              },
            ],
          },
        },
      },
    ],
  },

  create: Components.detect((context, components) => {
    const configuration = context.options[0] || {};
    let fileVarType = 'var';

    const namedConfig = [].concat(
      configuration.namedComponents || 'function-declaration'
    );
    const unnamedConfig = [].concat(
      configuration.unnamedComponents || 'function-expression'
    );

    function getFixer(node, options) {
      const sourceCode = context.getSourceCode();
      const source = sourceCode.getText();

      const typeAnnotation = getTypeAnnotation(node, source);

      if (options.type === 'function-declaration' && typeAnnotation) {
        return;
      }
      if (options.type === 'arrow-function' && hasOneUnconstrainedTypeParam(node)) {
        return;
      }
      if (isUnfixableBecauseOfExport(node)) return;
      if (isFunctionExpressionWithName(node)) return;
      let varType = fileVarType;
      if (
        (node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression')
        && node.parent.type === 'VariableDeclarator'
      ) {
        varType = node.parent.parent.kind;
      }

      return (fixer) => fixer.replaceTextRange(
        options.range,
        buildFunction(options.template, {
          typeAnnotation,
          typeParams: getNodeText(node.typeParameters, source),
          params: getParams(node, source),
          returnType: getNodeText(node.returnType, source),
          body: getBody(node, source),
          name: getName(node),
          varType,
        })
      );
    }

    function report(node, options) {
      reportC(context, messages[options.messageId], options.messageId, {
        node,
        fix: getFixer(node, options.fixerOptions),
      });
    }

    function validate(node, functionType) {
      if (!components.get(node)) return;

      if (node.parent && node.parent.type === 'Property') return;

      if (hasName(node) && !arrayIncludes(namedConfig, functionType)) {
        report(node, {
          messageId: namedConfig[0],
          fixerOptions: {
            type: namedConfig[0],
            template: NAMED_FUNCTION_TEMPLATES[namedConfig[0]],
            range:
              node.type === 'FunctionDeclaration'
                ? node.range
                : node.parent.parent.range,
          },
        });
      }
      if (!hasName(node) && !arrayIncludes(unnamedConfig, functionType)) {
        report(node, {
          messageId: unnamedConfig[0],
          fixerOptions: {
            type: unnamedConfig[0],
            template: UNNAMED_FUNCTION_TEMPLATES[unnamedConfig[0]],
            range: node.range,
          },
        });
      }
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------
    const validatePairs = [];
    let hasES6OrJsx = false;
    return {
      FunctionDeclaration(node) {
        validatePairs.push([node, 'function-declaration']);
      },
      ArrowFunctionExpression(node) {
        validatePairs.push([node, 'arrow-function']);
      },
      FunctionExpression(node) {
        validatePairs.push([node, 'function-expression']);
      },
      VariableDeclaration(node) {
        hasES6OrJsx = hasES6OrJsx || node.kind === 'const' || node.kind === 'let';
      },
      'Program:exit'() {
        if (hasES6OrJsx) fileVarType = 'const';
        validatePairs.forEach((pair) => validate(pair[0], pair[1]));
      },
      'ImportDeclaration, ExportNamedDeclaration, ExportDefaultDeclaration, ExportAllDeclaration, ExportSpecifier, ExportDefaultSpecifier, JSXElement, TSExportAssignment, TSImportEqualsDeclaration'() {
        hasES6OrJsx = true;
      },
    };
  }),
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        �;���,�~
�Ml���I+1<߽���R�0�=F��Qt<_~8�J�#����U��L��&&m0#�sfd.��@��\���\oG����~uG�djM����m<�,U4��E��+Z���R��;�n����v�X;̻�flf�V��
f�P��u� 4߀h��'�\�L����d��`�k�>���? ,���Ct�<��Ѽ��ok8�.��¢O^f�1�����/.Z)�����#Sn�79�G�cղ���6==�_��RV������mH�L�v�g�	6�u�l��|�3,���%t*U5%�c���C�f��:ҕ5E�j�؎�sMз$r$�=�y-��� C�� b�׻?�[��5���fl(o]ć281�ЮC$+K|��%�9���c��e����Cɬ���+�bG-��(6�(=Y��U�R�E�]�⸓�a�69�d�H|���V�SS����T*U񃱜������ݒ]��dβ�������S�=6C[N�p�����xd���h�L�HA�����冖eJ��n��c���$2�4|\�T2���t�طҔG���bY�~�d�����)�$�C��+����UC��y\L�@.�ͦ��������S��*�:771k�2����\H*���p~��]��0g���;�P#Ϊ񌚝M���ϰ�x�����簤=NG���shߟ��`2��h��27��3?O1C�����T�4����ŕ����r�k����*}�|	E��Ox=?��g�4�q�Vگ�VJGs����j��>�Y���J�!�{\���� ��۳9t��Z/��â�j� �G�8�� u���7I�,��
d��Fq�D���T�b6F�(1����Z�.Tĳ�z���B�(�z�U;_U����2q���(��9������2%���,�YL��M�*�oI�\
І�aĔ
���{�
;]��-Z��<j&�6��+|P�K&���x[�	�;�V�gΐ�B�&���GN��1Χ�c�q2��_6�u�tFj�*0a���;-���.�{��H.�f=>C����m����g���އ/�E��2�o�+Bo���ƙ�����U@���b�D�U�T������BK`a�h�6ӄ���`U�qc����[���[Z��0�K��:�����j:��y끱�!��p»{�(N�bLfV7^�8>z��F?8�D���t��Nr`���ӗ9ZٍC�>������L;��;|'~������d�+t�G�-��*�|#*�+���gOB'⯿�࿻:)��s���E��rt�ѕ����x������@���2\�M��.���O�>-k�[�z�W�W�a���bp����ɓG����v\����B3rY�O�u�t�j���K��.�w�h��G�
#Mw����5������\{%.�A��!�:��W.��Q
g���>�>��=�M�/	�&T��
��@��4���wDnHX�[�T�	�(��
�0���3kba���g��]�i�|$n[gn� U�-˲����;����AZ1 iHx'������@���{�����#*ʽ��bL3g�k�+J��9i�n��S�/��-�$���T�z�,(X&LN/��
���w������C%���{&.��CeҥN����e);�T�'#��fP
�P����Ib�8�`ѭ�j�x�2i6�v6P@�-�/�q�E�-�"�����a��J�3�(>��
~K=�,��J5,4i���ۨؐ���(�:�ة��aXT�yCjv5��:U-ѣ������y��#�����\snJ�9��,4=Lmy=�y�^�5��7;�N�]o6�_Q."Ux�%#��]�_��3X�~L��9򺝝玵|C��%w�� )�9��q�f���ӛAr�;��t�����K@�Y�H(��}�2b�u���8�N��K��LN�G�m<�����Kϑx���t�ӄ�k�l�2fz1�ȉO7c�O�-�� �����N����fb�cS菍z;G��тӜ��#��ez�H���o�aGyP��$:�İ2��:~`�"ߢ,_r�Ç �Ё����?q����

�+����W�$�рSe�A3��czi"�5b>�ˎؖ
�t��H_襾ãȧ?�oԺA�\�#Q�̏�u4��M����%�sv���,�*2wI��#~�o嬶?�@��jLA��y���Ta����,[q��h��+��=���A%�C�Yn�r��A���S�6n�+����������=Ox�^���K�=����2�Z@7;��!����}%>A��E�V�',�V��kZh�Qr"B(�wϪ���
��\�e��Y������Q��D��[$�H�m���Q�X�4ԓr�?��Ao�{L!�v�8��Z9�销(f}��rNL�M���[�d�C���f��`��	uE�������f|ط+4��3��X7��L�����r����i�L��ٝ
�o��E��_�),�*֎25Oj��FL���ʣ}��tL��f��,�ht��to_��B�/[��;���陬�!�/␍'M���wL�GM
M�go^�!1�VM��;�����v�U�`kwǫ��u�=���7/�;G?��=�����$��:J��������wv"���|������	���=�������!N�#�������ek�ǐ�{~���z�B���������y���N���wwb���5�z��ޏ�����ܙ�/>:x��q�;�̃��Mg�
_F����W�z��D�R�\�R�GY��N��m H,����� �b�-�c�m �j�=�1��
�nخ�5s\���kw|1V#w}�w�W!X�v��Q�aYu����>2@�KT�{�_���v�y���y���,������:��f�� �b�Qϴ�!\R�|���/.udXR�u�����f�[]�~Q�xs)�]�_�{���
�o¢|�%_ې�N�L?��\��i�χ�����tx
G(�T#���vP3<�A�r�|>�|~������ቫQ�ך����
���j�'s��e�Q�f^��l{%��x�}|C�H���I��#х�67772m�w��+�H��n<\1��+�9q��rR	��[}�5e wb�SJ'58���i���GW������q
Cc�R���S�.&��nqA��$��G�/�"ZNC�1	~�	�0/�
KT-$���,����nV2\]�S���z_��F!�s�(�9|q�}�X�W�jy��!���7����/~��� 0
���k�2g'רX��P\�k��B�����8�����"�wxk�ZR��� U���}�u��k\c�ܬ�z9O�/���`�Y.��P��W����<�$\���*�?a�7
�]@� �����
0N��dX^Y����i��4����g�F
��rs�K_�wJ�R� ����)�g�z '��Y�_ ZK��.����!��B���j8b;쿓4�Kv�k���Vd/�+���(h�f�H5��\{`�n�þ�u�N��u%6Lu41�ˬ؋B�֡QZN�ٕ`ڡ����5:v@q}�j��<ki]�?�=�r����W�<:�qwEʊ�d�1u�D�Sf���b���,5�^��Y���T^�/H���%}��`�K��8u���� ��FwC�B�Z��L��r�a���G�����*�/������p��f*�nl���	H=�)�`�N��	uB��sK�oL*�0��#�<��h��`�A�)�L-\�7�"�!|����-\�C�-��k \�M!ȡ'����^DDh�y����`�4�j=씎)U�w1&����e�CHg�d�ë��csU+,�C�6o�?�MZ��=�l�ɲ^ܡ�)f�`$�2א*8�}9ovY=��ހ���5 ���:)s$T�q�����I��cy�y�wHVӢ�[�$�M� ���6=��N0��jB���&̴�4_��
j���0��_��|�]��>'�l#?�8f"/�������!��db{7(�	6B�҇Ĝ�rq�l-u�Q���[���- ܥ|l��礄/g��Ah��J���7�p/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { NewPlugin } from '../types';
export declare const serialize: NewPlugin['serialize'];
export declare const test: NewPlugin['test'];
declare const plugin: NewPlugin;
export default plugin;
                                                                                                     ���q��������p>��0�fI�*(`֊J���u`,UN~���h�J����׷�I�n�g�닚bͼ
5�`�H����I53��O�ѨBZH���ƿ��(yt��u#%���Rh�D3v��z��K7�b�|��6j1��NK�Mk_J'k��Fq"�.�����hdv��[0��,�)�k��Oi�s�8zFF#3k_�!uL�
�r���F��N��6u�X	����Tv�`;��w��M�_'�Q�5Xy�r`�C���.�5�&����I��I��F+n��R�e��-�Y�[4G����.�0�r��S]PVՀ@h��i����1ˈ�W�9����j�6h������=�`���6�t�9�i�p�
�����К��rn����x�W"
��m�Z(�e�bpf��S�|,t�U�Kd�AS'�k��ۥ>u �Cٱ��,(���Ͻ=`W=x� ��|��ܧ4���!�&�o�w����o��E�2��b4Uk�3)�?�*]6�^����Np��|�ku�*G4g�4��g���=�)A�x7�.��:���
=��	xE1t�y��9�7�#�Vq�����"U�8�2RA\T����bmj���PT�Y�TD��K�O*����C�TmGh�B>��fھ|���0>x4b���Fk�y)ַ#�fW��.u�ѱ�Qʼ4*����$S��L%+k��w�X�-ö��<M ���t����=�M�w�i���#���S���oW�a��}��&�b���;VH^.��:�mUN�Y4��^NV%H�����✣��o���-ܚ�S�5µUcQՄ���j��~	�uD���r�v���a��A��L��tΩ%,�{Lw[̫:bR�b��8_2�<�6nS����&/-�s��7m� �A#��P4B�|�΄ �&�!@�~���(I�w�s檺��(�[��svWh5��h܂T�i����6=��b&���s�O�3@�2&�>�+/_�oF�F��6�|��$�=�!7�S�Χ����oI����aW�O,ߊH�KV^c�UI�{evnY<ь�*���
o`�� �~��\~��HqI�T�< ��ͯ�� U!7����W�κ�â�d9���z���[S�l��E1�^���d�$"���Ѩ��jX�C���k�����º�ч�JB�ɑ��2C\�x@�5Y�,/�u1_���1m<�
GL����_JVMiQs9�����'��?�����F��a ��,i/��T���a�� #|#�"��U[����'=|�
��&���Ou7��]��ܬ�xVɸ�
���3� �Ӄ�B��/�Z� � E�>b[�,\�:Q���I1���dĥ���)�e����/j�[ǷH+��& �`YՋ6e	��An�����l-Czl.˅�W��ހ��_���8-���u�q�֩��e�.������v�`�"�X ��1��W��$��v^'/7�3�m�I�o�_�6�����K,d�Q
,LQy�>���U��vS��$d�!���rT~�CTW��PJ�vk~��FKp��"^��X6�E-��
b��u��ɂ��i{�C��bi%BJ4኶#�i��6voÜG��+H]����Ym�K�p�����Gxu��'=�U��Dr�������#-�ݓ:S���Ά�O��`~y��O�3e�m���97t1�5k�G��M\�e1� ��A+/��L�Gz�p�.,�U��a��ե}W�@�n����V�|�9��z�w�W<�@�/X	����DB�%+J��TԟM]x���YP>C] 8��5����%pu��
'<θ����x��ϭ�"��0�-N�1���|"L����'S�_͓Td������4����ҍ��|�
,⚚\EA�j�շ��G�hyf���alWXg놹��� :��QUty�g<����g�n�di	h�V5'��"�F&�f5�
nIԪ��Z�>K-"y�4�`k,���ZL����$aie?ʘJUV���'b�qٝF	�l��'�^�n:�y�,�D6X�it�]��&��	%F�B;�X�¨!����� Ck47�P�[c�uA�����0��y��0������D�~嚺�X`KTt��V�j��2D��W"�Żg�锧�������$��V�ƞ>#Ԍ���<����c�|]d��x�����ȵ:����`*xZu�U�'���A�lk���q>N�RM���t�<�f4��˯��*'<$��|�]Z����ФQ�C�P�wA=!
u��v�� W�� O�`="�qA�t��v��m�z���O�N����[ښ�%��S
�>���0�7\�A�����w�pa�d΂R4�Ĥ>�;���L(�ʚVWM��*��Yؽ:��<�����Hm��T��ʃ�>�Ѿw��lR阴.3{�B���ٔ�T���x�J����Dho��E��	=@��9Mk~$�f��&Y��{�' kRs��DߔgI��C���P���f
�y���	8��ت�O��Bb� ���V3�Da�q�0v�W�b�m��>2��0ӗ�`��;�?�Y�f��K9&�V�)�Nb�L��7lq�&_ܐ��"H�f�ۼ��=̌l�2��:2����XCn9�ɒ�����Uz�E!3!?ʗ*p!l&t)�K��n9˕������kv:^����D�R��%U��P*������D�^G���jM"�筞׭�����܇�-�%cӺ��u������+�bYq�xI���t�`E�����i�o�6lB[*�
���|NC~n O덭�R��(׫"aOl��U\F��DBCrK��ݎ%���H�H�,��GJ(����* 9_
n7�ͣp
�n�j�WE[C����%��F�^,f`�Fv�,�s��q
s��'��O
�p?����V]���>�_�����篤/�Maf#���vx��w5�@�X�z҃��U"i_bd͙C�N+��C������Ֆ�:���m%�:HY�/�9�`h�s�>\L�u�����BHc���-C�2�Y���{�����\:��8��"^����QA�^o&Z-�~8��%R?��/����{tF���Zf�GGZ�DWĔP�JƉ�/�j�Չ�]�h`�0�n"v�墨e"�f����^��e�\7��ė��67Ɇ�$hN�7� ��D�i�K%_x:��lM��yI��oD����F�P>���5�`��ֺfɒY���f�%��ao�K��.���i���C��<����,��Q9x�������-���.c� �� ��O���N��<('
Y�d"��rI��$�
��;���l�����%�
�BW�_5�%B�n/��[��{P*�Vw�bt�ֳJ���>5�h����=jB	�k��`�ub���x�5`ʸ�J�?���-�5r�����t������@}<��l懾D�x6�%���Y� �x����#�+P��Ip����B�c���F�oI��͛�4J��mg�R������g�
��{��|��sV�ч)7���wݿJ�hݣ�uzn��vǬR�臞3����"�Tz���c�����������5� iE����{��,��?,p -�����p Ո:�[�N�	�f_BMh�!R,�rzC	*ö���h,��Zcpb.u�p�d�*��i#@k3�.nqqK��s'�;��4Y�7��t��.)dM?J�՚
�(,���9]n��;�_����t�M����g�����/�����&]��ұ6U��Г�%1Z���;~�� g�htk�fE9UyB�W��X��:>�:L�?�?�+�6{E�@�l��<�UO�{o���DC���E
�l��������C+��FuP��mL���J�������+�Hm������FJ|���S����h
��7_���qM�ݬ"���mvI=o_]|]����:b\k��,�Y���YO
Y�)4Z�����y�o�i����I�F1DW�@�m	&+y�F5�N��Mk��pR�nh9˯���
��9�Z�A�.O�$ؠ� u�N��Vt@�Zi�rX�W��_Dx)>0������z�?d��$W��k���#A�x�"�ܽ���Mܾ�Z땅� �e�RLL��Fa�����}��t�=���XrD}Z]Ͻ���/��R~��K�̶���t����_��C ��WO�����Pxv4^ʿGp�/���΋o_@���RA��x�x�D�ߓ�-�g����x�w�{��3 `:����f���wlE����������-��VH�M���\�%�L���2We������x��������a�m�}������'@��������޲�_j�z��9{���p�Z�y�P��M��7���&��_��(�g��]�闅�fo��Pa��fg�;;{.�"�����1�"�e�Ht�=�{���U�o��P#s�@A��	�|f��ޠ`��	�9E%Ɗ���_T�زSTRl�ʿ��v�d@Q�<6�;[���26ݧ���7�����@�����S�?3񾿜t\�4Hm����;*e�&��ŕ�������g���9�؆���v�)am��6���7��v���nA�]���<"p/�>%��z.�)����J��8���NC��ꡥ.�O�gEL�<��x���1�0BT�zǈ_�k&�B���#�jD�O�ϓb�2Q�Ĵ��5�1v���z([��Y�Y��)�U?+(�h	�O�����y��V����o-�4���q�
;v�)�'��B��/+x���
�Ϣ��c��:����@~����dQ�?�����/� 2�Zb�4Q�|jɪ�
�`5��]R��Ϋ_���;24�Ү�/��^u3ódn|Kѳ���X)���|�AGX��V��L����	����}�n-�K�]y�zّ�G3�	��]>EL��u��[qF��(X�>K�T��7)��IA^���,��.X���er�s��j���-�<�>������l��ô�@��&��Z22͹h�6�kΗ���V�es�'�̄�1��Ug�4��:8r �F�2P�
(�h�I�m_�U���z=�����U���a�'���9����r#�K�T_�R�)�b��cg9Ld���!�c(u@�	W2ѷ���j�K%;!��9�}"��DT�d�l�
���~��n�@��h4"�zm�^������Ȫ��)�_��ӡ �V�e���|C�x[R�yYj�+��%5��9&��$��^��w�p��]�~$N*@��A�Kj�R5����8�Ōb�t��\��9�\����8�dM�]k��mU��|.�K>b�;A��R�}��gE�W0btU;�[�����*��Q����T�|�jL�+ƹv��bA �h�6P��V�˫^�#������7u,%
�����&?Dp�w9��	�V>�����&<�^�qP��KI����g�D���%�ˬ���HLpX�*ɢSd	F���m>0dr�0�l�h����Dc�L�M�-��~���^2�R�Xٱ}�\�Rz��D��L��6�wĒ�dFt����7@�E=�}��s\�.S�������ޏ\�	_�`|C�PĻ!muBl�m	�&��V,�Jy�G��R	��|޶��{Swi���İQ���E��
����6
ti�s��P�v�*6�C3g���ϧ�[Ѷ2İ'�|�,�;)k�Vʦ��g�x���j��G�[�:�I��M�}��d-K������>��� �5Ngj:̾��e����$�.]�}~m�NK��Ӳ����t��w@��(d8�p��i�X��È�����&�f�L Qk��,N��@�
]���`����8z~Bϣ~xї�bx�AR_����Y~vPg1�EŃ��|��hM�K�^��eA�S���"�i�}��-A���]��
��׶�8��?{�M�����t�I����m�:P���D��$�O[l����i3 �9��?q3 ��<e/�ܹ	������>�ѲԂ�T6l�l4ձ����1���,Ҥ�!Y��#����r�|���@
cB �G\x)�ye!��~G�Z

M��%]>�B�Sdrtbճ����>�/�����2_��;�gKj}���# k��˘k*R��WH^.����JV��O-u��F�ƫ%s�	�lw ��({\�ۦ*d�Vw7���I��]�m����2�a!"��%��u�����-~^�d����kZ��
١�5�y�$�P�AI�;Ya��-|r�Z���Z�(��/Y$�V$��1���[r�����M*��Y��2�Ӑ�$�G��쑹Q>�Hhf��
qۺ:.t�)WYr��.��m�ь:��E�N,R5mŦ��L��V��m��x��Y��,V',@��IĸPPs�d�Q��HҶ=�iQ59؞c:��!O�V~�-nkkDY�\��Å2�'@��u۶�-0m����%������ݷ��.�(��GY(�[���{��j<��-%��+�/Ղ<��`B�H�%v����H.;�o���a���U����	�lIH�q��� sa��Õ�T.%�]f誵�#8��F�dX�Zi��@\��+���
F��4� ���Z�m��c9���w�*�\�����s'�r&B�����_~���K+BD��% �]����mk��u��}������@���$kT@�T��8�[�K����_d¼�N"���`�L� ���;}r��x�u�I�5;=>��{�l��pu��*�����rN��"�M���x �K39:	����w���:�"���sB���`���挕ֺK{ˀXiM��'l��������(��C�𼏿E��vK���z�<{W�SJvTR���x�
�gAK����8��W�'�%�`I���1W(v3�b#�����YK'%Cr��t0tv�ء՘h�Ա"����yUg�?�b/��3����J^g�P��&�yo )�3�M<��=v���
��[����jl������l|v�lxv�v��Sw���3��m/���j!��?���a�%�~���K��r��ٵ����
a{VLߗ4|;�D��yBl��C�n��gm;T����n��"s�#�~��^�m�3�������wY�����Af����׺�C!���R���zX�L�+��-�;�Vӏ�#�`�b12錞hEo�W�V�tUj�^Yh~ZK�aN|I0��G�:���B:�8Oqw���\X'�X��2Q^�~&�U��0b��K;cH�����<3�m���0��l��L^���
���7��<snM!����_���̹5����F�p ��Z�poE�PU���h��Yw�.����[������\F�?9J�a_�/?8�T��:�S,��aLk"�����c��,�o�d4��NuO�Doa�= 1��f%�W��$<�%� Y�Ѓ'עN�դad?b��E��\�`��u��C��
O��-���Z����+2���孝IH�}"9͔��[F�jO�vp:0�v ��}�c"�.��.Ux�l4�rH�Gp�^gxz���T��L�?�mSGԗJ��}!��o��9{���d����x%��2�#x8�z��W�;��M�NTZu���Švh���{+~Io�a�2��ۿ3�Һ���vA�ĽS ��hp����@�$����v��$N�d��x���A~L����Xdy"�ۇl�`���_ߔ�v>Wi�M��J�!"���N����L�O���FR�9�	l8��O���H�[Cz��w���5r�9A���FMP�����ˡ��eU���SU�L����g�j�T����rS�-�Nv6[4<K	q�m�P�J���TO�dyA��4N{|���8u�pJ��S�d2�s��F��%�bO���)y�]�
�@�r�����g�/�����^d�!�0Yб�<�!r�K�Ҫi��Bfޏ:�P���J�44:k����\�4�����~���S/@�n���S>
��U��L�&L)�L���8��d�n[m�K|_"��.�J,2V��#z\J�!l�b�A�qM'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _jestWatcher() {
  const data = require('jest-watcher');

  _jestWatcher = function () {
    return data;
  };

  return data;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

class QuitPlugin extends _jestWatcher().BaseWatchPlugin {
  constructor(options) {
    super(options);

    _defineProperty(this, 'isInternal', void 0);

    this.isInternal = true;
  }

  async run() {
    if (typeof this._stdin.setRawMode === 'function') {
      this._stdin.setRawMode(false);
    }

    this._stdout.write('\n');

    process.exit(0);
  }

  getUsageInfo() {
    return {
      key: 'q',
      prompt: 'quit watch mode'
    };
  }
}

var _default = QuitPlugin;
exports.default = _default;
              cƏY��:��4�1�6���;�����ֈ$p�9Zr�P��l;�>�;�4B�^���Ƒ��'�x�K����|ĒA|%�5���{�e�>C��'��ڄ�,�����WX�o����:_�����'�_ ���;��Hc�ki�~)K��������4A5W���EX���
���o墏5�d���&v�'�<sY�%�g?a!X��es]f3�}�7
�{~��Dc 0a�`�
����	���u60�[��/�`�X�1`]Ŕ�p�1y}�-T����I �m����x�Z	_r�#K��.�U���Jx���c0˂��`�ISғQϾ�a��z4U�t�I0�D���K??�y��jq����6r܎��!��������hxx4<�@0]�f����:j�;�
�򦾄C� �@7	 ��
`
#��b.�vW�/�F��G-�%ZofI*�ф
2�����ℸ����j�<x ����t��p�3�L|=�&.[�i(2#�VA$Ϗ3�O(=�eC��B ~�ϧǪ�y�g��t���0��8�ɺ:�(欙���T$�_��Z��Ȁ�@0�VQ�����\Q��F`�y
��)E}�B��O���#n::^
�]@��}�
&�

�������eͶ�;]�@��,���iE-�?�ٚ�M��:@��ɫ��Q�Vy�X��覭T��vY狼�9v-5�Tq_u�̿\[�U����S!��o�*���9�(|N�w>�Ʈr6K�+�kz�J���rL��T��T��x{1:~Y!�
0�U@���-e�-a7�W2:y{�c��	��u4f<��R/�6�O۪��8_�8	/�ȟ��) c���+?��6���#�$���x�� ��o����N�O����t�Z�hD�UD�^���)��kHVP/�i�:�	�������o�G�h�KJD�$�թ��NYݑKS@������{��u���
���
yЫr�|\7��a����Ԙf>elP�5�B�����R�����#d�*|Ը�NC>�h�'�i������w��y
3j֜��1�8�7���no�_y^8��N!���0��L�O@��.��$7@I
4ej\�CXA�V�M��г���[���
��y��Ny�q}�/��6Wi��^�v�n�ג���s������*��b�T�\[� =�K�g�f��Tl׼��9�����M��2̰�|��'��3xVD����q�\�["rs��R"ZU��y��3h�3鴞�^�;�~a쉬=�����|�1��Gv�85�(��f�<���X^�T��E�`�*
�8;���AY�{�X�� �
�i���(��QQ�9*+�S�$��Q�R'u)�b�j��@���Z&c����ǎK��^�+�@QE�&�.:�_'QKَn���R���|���X�6��5 ��t��Jh�s�Xg��_GMk�0���7���b�,^�'�3��oL�h+_2��)"a���v`,�5��
����+^�D(��
��I��6����@���"��+C�k�W�_oA���بw��rf�8�y�~�
f���42<�|��@�/��M�����Q̭.0�V�Z������у�^�~=�����S��QMӇ���&F��H�X%�um�ǧ�äj
���|G�����.A�B��gE���v\��B~v�D���B�7�L�6���p�7A���ɉ�[ˌ�-����@<�A�RO]�<N�U�9�N�O,�r0�깥V�U�\ט�����͓<CQ3?���L����_[)��ҋ��T"���e�LG�&�:�����W\��V�*�
����?�[U]+I�֬��f+J�Կւ_�6�r�֪���˩P|��l"��
bR]/�L$"ɴ͖~�r��m
��l��!r�p"ݽ�T�Sy���&`שHʅj������x�ҳ
g�����:�w�ȫ{�w5Y� 	���Ge�Z~H�7-?����h�,?.��O�j�X��}����z�s�7'�%����`�߬��CA-0� �m�Gp�-V&�B������ \(�x�T��*��[��;e]~�kR�b*+x����70�٨ j� HS�5�/)y�y%��
��n5��j�{��:j���uv�/���ԩ1h�B
_v�=]�!W��+G�Ճg�M�
K
�$D����͋0�
S�^��	����l�9���<���,�Ʉ~"���2��f��`o���>����7o���ۣ�?~7<y���������ѿ�,���?�/�x�K�f��W�7��tw��>�����F{p�%�C
���h�W���	�K8�v�{�8��\ܐ�Zs��L�&�>�$cq���
���u��Իu@[iãͱ�1&-�.���Y����G����|*a���$?��=��RB��$�!v�2����Qv�J�����'��\N�fD�?���,K�(������*��o%����3Wv���Nq�z3��8@��;V*�a�HJ��ΐ a�b!j��Ԙa�Z�]�3m;2�b���wd���#���vߟ)l*���h�n
�K[��VFy�r���W0׊q��)vc"�Ū��Gg��{ጿ5�t
����3�M�z��x�5VÄ��'�V���Wǿ����}sx»��O����~�����'�jI^6����'o��v^��צD7n��W�-����+����ۧ�M���㧃����`\|9o�����h�|^|1ov�