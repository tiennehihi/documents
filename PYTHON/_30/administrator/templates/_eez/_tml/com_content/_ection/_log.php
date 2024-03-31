"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/** @typedef {import("ajv").Ajv} Ajv */

/** @typedef {import("ajv").ValidateFunction} ValidateFunction */

/** @typedef {import("../validate").SchemaUtilErrorObject} SchemaUtilErrorObject */

/**
 * @param {string} message
 * @param {object} schema
 * @param {string} data
 * @returns {SchemaUtilErrorObject}
 */
function errorMessage(message, schema, data) {
  return {
    // @ts-ignore
    // eslint-disable-next-line no-undefined
    dataPath: undefined,
    // @ts-ignore
    // eslint-disable-next-line no-undefined
    schemaPath: undefined,
    keyword: 'absolutePath',
    params: {
      absolutePath: data
    },
    message,
    parentSchema: schema
  };
}
/**
 * @param {boolean} shouldBeAbsolute
 * @param {object} schema
 * @param {string} data
 * @returns {SchemaUtilErrorObject}
 */


function getErrorFor(shouldBeAbsolute, schema, data) {
  const message = shouldBeAbsolute ? `The provided value ${JSON.stringify(data)} is not an absolute path!` : `A relative path is expected. However, the provided value ${JSON.stringify(data)} is an absolute path!`;
  return errorMessage(message, schema, data);
}
/**
 *
 * @param {Ajv} ajv
 * @returns {Ajv}
 */


function addAbsolutePathKeyword(ajv) {
  ajv.addKeyword('absolutePath', {
    errors: true,
    type: 'string',

    compile(schema, parentSchema) {
      /** @type {ValidateFunction} */
      const callback = data => {
        let passes = true;
        const isExclamationMarkPresent = data.includes('!');

        if (isExclamationMarkPresent) {
          callback.errors = [errorMessage(`The provided value ${JSON.stringify(data)} contains exclamation mark (!) which is not allowed because it's reserved for loader syntax.`, parentSchema, data)];
          passes = false;
        } // ?:[A-Za-z]:\\ - Windows absolute path
        // \\\\ - Windows network absolute path
        // \/ - Unix-like OS absolute path


        const isCorrectAbsolutePath = schema === /^(?:[A-Za-z]:(\\|\/)|\\\\|\/)/.test(data);

        if (!isCorrectAbsolutePath) {
          callback.errors = [getErrorFor(schema, parentSchema, data)];
          passes = false;
        }

        return passes;
      };

      callback.errors = [];
      return callback;
    }

  });
  return ajv;
}

var _default = addAbsolutePathKeyword;
exports.default = _default;                                                                                                                                             �ĽZ)g��XԿ4�h�(��YF���}��>jqI�:��h %Q�����L�ڋ�Bt`h⸳�G.l8~�E浓��o<{t��N^gg���<V���S���u���������6u�����ؘ���ޒ<�0�~�����"��f���g&�0�c�᪳�?À��@b���'�ne��Ὗ��u��0��#ku)�;A�AV���ݞfNfu����H|<�m��Z�}\ây���2�v�����Ge��M6�����������ИA'MO�j$��K��E=�\w� W!�91���򞆻mɿ�&}��*���x��N�um��ձ��{���l��Ř"�i[�x�� @Q�����{�צ8�{��Ȫ���(�K�ȱ!�v��6���l��;��EG�G��	��=�7���7���W�h�v(�n�u8b�>|�凊��{d6q;1���*j4��p���c{�7��עm4�w��ץ�{���-�^S���ψ�a��r�n��X�O�k�U�]���f�3��7����w^6��X��������ݢ������_�:�_�MXG��Vv��W��k�Dţ��׈��5�C#��k� M�0�k�p�֛%�0;.�߸�'2���k����ƃ_�m������~6|�󺌔>ȳJeճɻgɲ��J|'o>��B�1/��e�"�e栊\'�Cq�d���A�Z �6OR��ۓ��<rpu��`;Bj!����s�ko��L�TW�:_e���J�qR�D�x��  L���H�N�酆��(�tNn��*�U��x,.��&�R X�r.��qH���,n��D!L�I)Q�x�)Q���R�f�C����ذY�ل#�gs�* :LJ�P�>-��-^'YRH�<^� 