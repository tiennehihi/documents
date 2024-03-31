'use strict';

var global = (function () {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  } else if (typeof global !== 'undefined') {
    return global;
  } else if (typeof self !== 'undefined') {
    return self;
  } else if (typeof window !== 'undefined') {
    return window;
  } else {
    return Function('return this')();
  }
})();

var Symbol = global['jest-symbol-do-not-touch'] || global.Symbol;
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

var global = (function () {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  } else if (typeof global !== 'undefined') {
    return global;
  } else if (typeof self !== 'undefined') {
    return self;
  } else if (typeof window !== 'undefined') {
    return window;
  } else {
    return Function('return this')();
  }
})();

var Symbol = global['jest-symbol-do-not-touch'] || global.Symbol;

var global = (function () {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  } else if (typeof global !== 'undefined') {
    return global;
  } else if (typeof self !== 'undefined') {
    return self;
  } else if (typeof window !== 'undefined') {
    return window;
  } else {
    return Function('return this')();
  }
})();

var Promise = global[Symbol.for('jest-native-promise')] || global.Promise;

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

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class CancelError extends Error {
  constructor() {
    super('Promise was canceled');
    this.name = 'CancelError';
  }
}

class PCancelable {
  constructor(executor) {
    _defineProperty(this, '_pending', true);

    _defineProperty(this, '_canceled', false);

    _defineProperty(this, '_promise', void 0);

    _defineProperty(this, '_cancel', void 0);

    _defineProperty(this, '_reject', () => {});

    this._promise = new Promise((resolve, reject) => {
      this._reject = reject;
      return executor(
        fn => {
          this._cancel = fn;
        },
        val => {
          this._pending = false;
          resolve(val);
        },
        err => {
          this._pending = false;
          reject(err);
        }
      );
    });
  }

  then(onFulfilled, onRejected) {
    return this._promise.then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this._promise.catch(onRejected);
  }

  cancel() {
    if (!this._pending || this._canceled) {
      return;
    }

    if (typeof this._cancel === 'function') {
      try {
        this._cancel();
      } catch (err) {
        this._reject(err);
      }
    }

    this._canceled = true;

    this._reject(new CancelError());
  }
}

exports.default = PCancelable;
 U�׳w���R3��d�u�p����TV^?T�$ʌ��]wt�)ni�e���x̐=�@3�����)�Z�N\i5_��J
�[͟N�*�G�N�n��k�41�V��2/�!�u�3M�e��iG�(\�+�M�B0L��X�z|���(0�8���f��Jku	p�K�����<�+t-'����|��}d?�|��O|��S�4 >u���ey��U"o-��*ܲsM����Z��'��]��:L�d�Px�o�:��~�6/�^q�eǜ��Y�V5^���cS,�W��{�¦N��[����=߽�U+,w�i:v��OrA�-�s�ǥ�T������c�D�?n�L6���j;��-|�G���s0�9�0�К�/)s�U}�ڛ|��f�
��˕n���aoӰo�� �p�	����-�	ji�`�C�0����Ϯ�]G�]��ՏG�φgX�e� ϡ����z����4�|�*r��ɞ-���������R̈́�<�!@���4;E�Zdc��%9,�u͟��O�Icu���ʜ�e�8-\P�%��S��v�p�xP7��۰���>�Q����T]_Cl���1�m6�*�M�	SF���1�G��ÛKy����mo=�k|�򌕿.����[�q<v�*3��9ȱݍ0�s���(���
*��e�?6�0px��6�E��d8�f 8$�w]�{���>�ɣ6����;Y�얟u�J)���:��K��%���:���ģ��j��%k%����u�2#f�3�܉����*��v�D�H��eBf�m%����6G��9����'Y׼j��K��c�����O���T�e/�ˋ�8�\�� $�[�r����-��B4�c�~���!#��q;YY����o(G�q�*�P?�F��j���,7[^^���;i���ݷ�z~�
�AB
1TX��$�+5�7�
��2�0g���)5�F<厉�67��Ã���:�۪��;H�x\}kh$��G�p�P��ѕ_����_�i���y�~2���qUZ�<z�BĜFyp�m~�wǙ�p/��s�K���H���˅�#�̯�ӣ�_1B�^X�S_��񝜪�.��EW�^u�?�/Xb�gТ#KE^c�bz�]�:<�[F�*}�U��>A<�`���}����Lv���q|]V W�`�q������1���@��6x�L�U/Kot�麺����m��Gێ�e=#wă"�o��TqP��R�7�N�l�ج�	7/�ī��M���ga�Kc�̗���������je�J���,H�-L`�&��D����e�a���������'��uߡ"u|G_�����V*��=ï���b�b,��R�:?ѯ�����^�M<��0.{�g�����)Lo��Cw�漹쪌�Wi8��V^���R�˭��e���+H�\����"��w?�8L�^˂Ğ;:c
�,4���s_ļ����OS���7:�ղ�p-NH��i?�p�Ӵ%�d��ɓ�U���)�V^8�;P �)C)@�?�����H�X�
G|��l詳�v�����rg��oD,V�N���ϻ�?��_x���jF�������p-]����A�N ր��H�u�
�O�Hoٖ��~Kj@�8�w�fKu{��e�}ÑEp��k��ۯ߅t6�"Up�>��٨�W�q0��S)���^#5�����f����O��J���{.+�&����	��iG�>d���~,�&����3gb��[���