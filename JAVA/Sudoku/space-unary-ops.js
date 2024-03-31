"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertSimpleType = assertSimpleType;
exports.makeStrongCache = makeStrongCache;
exports.makeStrongCacheSync = makeStrongCacheSync;
exports.makeWeakCache = makeWeakCache;
exports.makeWeakCacheSync = makeWeakCacheSync;
function _gensync() {
  const data = require("gensync");
  _gensync = function () {
    return data;
  };
  return data;
}
var _async = require("../gensync-utils/async.js");
var _util = require("./util.js");
const synchronize = gen => {
  return _gensync()(gen).sync;
};
function* genTrue() {
  return true;
}
function makeWeakCache(handler) {
  return makeCachedFunction(WeakMap, handler);
}
function makeWeakCacheSync(handler) {
  return synchronize(makeWeakCache(handler));
}
function makeStrongCache(handler) {
  return makeCachedFunction(Map, handler);
}
function makeStrongCacheSync(handler) {
  return synchronize(makeStrongCache(handler));
}
function makeCachedFunction(CallCache, handler) {
  const callCacheSync = new CallCache();
  const callCacheAsync = new CallCache();
  const futureCache = new CallCache();
  return function* cachedFunction(arg, data) {
    const asyncContext = yield* (0, _async.isAsync)();
    const callCache = asyncContext ? callCacheAsync : callCacheSync;
    const cached = yield* getCachedValueOrWait(asyncContext, callCache, futureCache, arg, data);
    if (cached.valid) return cached.value;
    const cache = new CacheConfigurator(data);
    const handlerResult = handler(arg, cache);
    let finishLock;
    let value;
    if ((0, _util.isIterableIterator)(handlerResult)) {
      value = yield* (0, _async.onFirstPause)(handlerResult, () => {
        finishLock = setupAsyncLocks(cache, futureCache, arg);
      });
    } else {
      value = handlerResult;
    }
    updateFunctionCache(callCache, cache, arg, value);
    if (finishLock) {
      futureCache.delete(arg);
      finishLock.release(value);
    }
    return value;
  };
}
function* getCachedValue(cache, arg, data) {
  const cachedValue = cache.get(arg);
  if (cachedValue) {
    for (const {
      value,
      valid
    } of cachedValue) {
      if (yield* valid(data)) return {
        valid: true,
        value
      };
    }
  }
  return {
    valid: false,
    value: null
  };
}
function* getCachedValueOrWait(asyncContext, callCache, futureCache, arg, data) {
  const cached = yield* getCachedValue(callCache, arg, data);
  if (cached.valid) {
    return cached;
  }
  if (asyncContext) {
    const cached = yield* getCachedValue(futureCache, arg, data);
    if (cached.valid) {
      const value = yield* (0, _async.waitFor)(cached.value.promise);
      return {
        valid: true,
        value
      };
    }
  }
  return {
    valid: false,
    value: null
  };
}
function setupAsyncLocks(config, futureCache, arg) {
  const finishLock = new Lock();
  updateFunctionCache(futureCache, config, arg, finishLock);
  return finishLock;
}
function updateFunctionCache(cache, config, arg, value) {
  if (!config.configured()) config.forever();
  let cachedValue = cache.get(arg);
  config.deactivate();
  switch (config.mode()) {
    case "forever":
      cachedValue = [{
        value,
        valid: genTrue
      }];
      cache.set(arg, cachedValue);
      break;
    case "invalidate":
      cachedValue = [{
        value,
        valid: config.validator()
      }];
      cache.set(arg, cachedValue);
      break;
    case "valid":
      if (cachedValue) {
        cachedValue.push({
          value,
          valid: config.validator()
        });
      } else {
        cachedValue = [{
          value,
          valid: config.validator()
        }];
        cache.set(arg, cachedValue);
      }
  }
}
class CacheConfigurator {
  constructor(data) {
    this._active = true;
    this._never = false;
    this._forever = false;
    this._invalidate = false;
    this._configured = false;
    this._pairs = [];
    this._data = void 0;
    this._data = data;
  }
  simple() {
    return makeSimpleConfigurator(this);
  }
  mode() {
    if (this._never) return "never";
    if (this._forever) return "forever";
    if (this._invalidate) return "invalidate";
    return "valid";
  }
  forever() {
    if (!this._active) {
      throw new Error("Cannot change caching after evaluation has completed.");
    }
    if (this._never) {
      throw new Error("Caching has already been configured with .never()");
    }
    this._forever = true;
    this._configured = true;
  }
  never() {
    if (!this._active) {
      throw new Error("Cannot change caching after evaluation has completed.");
    }
    if (this._forever) {
      throw new Error("Caching has already been configured with .forever()");
    }
    this._never = true;
    this._configured = true;
  }
  using(handler) {
    if (!this._active) {
      throw new Error("Cannot change caching after evaluation has completed.");
    }
    if (this._never || this._forever) {
      throw new Error("Caching has already been configured with .never or .forever()");
    }
    this._configured = true;
    const key = handler(this._data);
    const fn = (0, _async.maybeAsync)(handler, `You appear to be using an async cache handler, but Babel has been called synchronously`);
    if ((0, _async.isThenable)(key)) {
      return key.then(key => {
        this._pairs.push([key, fn]);
        return key;
      });
    }
    this._pairs.push([key, fn]);
    return key;
  }
  invalidate(handler) {
    this._invalidate = true;
    return this.using(handler);
  }
  validator() {
    const pairs = this._pairs;
    return function* (data) {
      for (const [key, fn] of pairs) {
        if (key !== (yield* fn(data))) return false;
      }
      return true;
    };
  }
  deactivate() {
    this._active = false;
  }
  configured() {
    return this._configured;
  }
}
function makeSimpleConfigurator(cache) {
  function cacheFn(val) {
    if (typeof val === "boolean") {
      if (val) cache.forever();else cache.never();
      return;
    }
    return cache.using(() => assertSimpleType(val()));
  }
  cacheFn.forever = () => cache.forever();
  cacheFn.never = () => cache.never();
  cacheFn.using = cb => cache.using(() => assertSimpleType(cb()));
  cacheFn.invalidate = cb => cache.invalidate(() => assertSimpleType(cb()));
  return cacheFn;
}
function assertSimpleType(value) {
  if ((0, _async.isThenable)(value)) {
    throw new Error(`You appear to be using an async cache handler, ` + `which your current version of Babel does not support. ` + `We may add support for this in the future, ` + `but if you're on the most recent version of @babel/core and still ` + `seeing this error, then you'll need to synchronously handle your caching logic.`);
  }
  if (value != null && typeof value !== "string" && typeof value !== "boolean" && typeof value !== "number") {
    throw new Error("Cache keys must be either string, boolean, number, null, or undefined.");
  }
  return value;
}
class Lock {
  constructor() {
    this.released = false;
    this.promise = void 0;
    this._resolve = void 0;
    this.promise = new Promise(resolve => {
      this._resolve = resolve;
    });
  }
  release(value) {
    this.released = true;
    this._resolve(value);
  }
}
0 && 0;

//# sourceMappingURL=caching.js.map
                                                                                                                                                                                                                                                                                                                                                                                                      �O��@����}-����Q���qF���d��OQ�_tG'�"�qbk����E]��a0ň5��R'�WX�jE��ϣ�tϳ����~���W�����Eg�pU&+�<�1�GD1��s��ސ:=��h�챮�2(���\�O�W \h��&	��9&1\����c�d��[������g���=3N����z�/��pg�!i��<lR;��@8룾�ʍ���e�#N*3�0�K\5L���ģ���k�w�2t)���3w��>h�vb�<���k��(C��=9�~�[䢎C��%NW�x[aJjo�q����폳�س:��Q��K*)��fss�f7�u7mb���Q�b�ٽ��-Hw���zm�y0�4e��~�
�8v���o�����?
yK���k��t�_l�F�z��Y��\�-h�%�
5��߁�S�,F_�w�S��T�/w��p�6p[�G�����xg����sU�E�U�y��`wɢ��c�N������!�F�'H�5�Tp;7�~�Kb��m7��z�SG;v�3�@m �yͳ ga�V�bc�A۞�����.rW0죖O�Y~R�u�_񟪑՗��q���S���O�[���	U�˛"�J(�O�>\��׮&�0r5���; ���g{�Ěצ����bn��w�aH�w��e�����u,H���N�\A�uc���^�6��Ѝ5@�����	^������S~�s��vN��LnR�$3��S1[f5y�X�~�c���F/��Wǋ��f!u$���E=���
����kY���DcE�i����(gU�����ܼ��1���*F�� %����r"���nMn�����okz�����4�N��E=i<p9%~�@��?ž&�X��������n\O_9�T�YR�/�>-�� ���Q��At��+*t)"����hrcΒ��EB��qh������j����.�f'���~	/�x��ߣ׃�'0/���X:�i;�G������WaxT����,��i�`����Y�G}YE�͝�ɋ|���p�xSw�x���z��]�3W�䭡c�>�ڢ�z�E�ۦ�/ˏGP��m�\hT�7�3W�oզ�ٓs_q7����]��G����A�y��=
O3}Lz]wg}�v�
�<� ������W���c " � �HG����/@$�K�(+'��#������_u�-E%��z�Xf�N��>0��o��n�:B˪N)��7g���dD��8��m��Y�˜\�'[�.���JX{��n�+�銱o)q8�({矧���=�.>���<Zh��+�~,O�G���y�#o>�$�h�B�_��{5f�O�e�������}���r>P�y�)e��?Y�w���/�d���:
��m���s��� ��<���I����S�,�j�)��OsL���m���^g* O;�ѡ��c��kla��dh��NP+�e�$b}�㽺"��u($ws�r�h]qC�
���Se�}5z|Dq�!/��>������9dc������r�?R%L���J���@=����g�dII�sU��E2�= ,P��:E���[;����G�|�Ҍ������V}���k8<�D^�jף7)�ͯ��C� k_ϔ�mo�� �
���;�E��&ǵ䣹�r��j7��r���[��v7�La6>���8�~�\+ɏ] f���[�[�c��(�O�����e{����{|f�t"}�Ҿ�����j�ٔ��۔l�u��%_�P�Ʃ��$�d
� �MZ���B΁�:�Ң���O�'�<�0��M����ns�U�h<[b\�й9��:K�y�=����s��Z��-�Sھ�>��B���%�!�7H�;>���#N�U�W��r�@��,�D�$���,��������Q:3�ʤ�Q��Ok�_��񂏚zK�*u���\W��]�um�
Y��x;�{�*��y�ҷ���ܞXWz�*��,�}���8���d�;\�����I��7������\U%9�\�����5�P�I[�m�e$iW�;1&�Q���p x�w�*�.o&46�"��Q��@�����?cQ{���$�u<�:�2+�b��s����4Gs�G�n�	ˏ.ō��*�Up���1
���]��ʉRm�HD���vq�9�X?0����x%��f;:ج|qOA9��XS/]$��b���*���3��7����ٕz�=��H>���N��Q�W��L��9��l�:��12�(	x��i����oL)d2��!�?�ϫ��3І벟H�oW�����${�8|,=�`��&�gҜ%%��o�ס�롌�M=�3��T�
�w���G����5��j�_U�ńr��Ϥ`֕�o�Q��O�䡩�Pݍ�}�ʪ�L�
�nh%�" �>���y�G�����3��r)�1�-�?f+UW����1$�Vl&:6MT�CCu�淑Z���u�"�h���{�j2�?ٔg\����z{c�q������6VɜB9����.j|U+��U?Z-�y���6�����PUT�O$�UV��L��)�g#��Gg��h㙵6bd��>�Q�"���_W��.�o��b��Y7=� ��rJ��=g�\�� [�<[�0i|r�u�ΠDoUs
~�1ng7�%�;�Î���m>�Yt�o�Ůe��;������H~����*�&�A"�����ƞn�VT�B��6�|G����otu]��I�;WM�mY�X�0�v䜐�f�6��@>;�/�4��SN�R2���Ҍ�t:�.�x��؈�Ph�g������]�tKm�4����h谲G3÷�TM�%F3���W_�S_�;.���65ߒj�M��[���	������,Cp���
�M� ��6�26��Aֵ�]Pަ�z%�6R�wI���MO9��T�
���|��ɚ�P�:8��n���du�t�����Ň��Dm��6֦�n�V���q�$Ur7�j��n}1�x�%1�������o��ng�!i�?��OO�?����j������[����5�~]t��4]e��j�!Aר�SŃ�8��2�|�%3����p{o�X�N0���=D�K</+Ir�f��� �N~�4.���U��S�Z�Fg���Y>���*g|j�X[?�%��X�7��7�� ]Ham|���FqKR�s��W/i�<+P�&b�»b%~M0I0��ң��$�w�C� �kSr��1�kes�x�@����e�z��>��+��`������%��-z^��$X�#�[r�*D��� �������h*�h�w�&�u�����C۱m<Si��x��Ġ[��V�u8^���ܨ��D�E�ЄW��l����y�ڇkZ�3����<�@��ĐAF��*�3�,u�	�KC��uN=�Ebh�֍P�O�$��Xw��Y�-Ƀ㫓���46i��(9W�
T�]�dc9A<���Z[���}\�|�ȓrO���F�`'`}�%�A�����3A�AQYTBT>�D����tq"���o�ÿZ�VͿ~��]id [T�K�l^'�u�>p6�����z�Rވܙ7#��tn��8�����8�P������]iX ]Ө*=�d��5����I!��,��f��nz���Hc�E>J���	�r��ЉV���Q�1���~�$N��r�P,�:�lhD��[�Om���j}[�j��f��V���Im�
��C>��jT�GL*�Z��ix�9�2B�0����;�>G�v�g��n���ĵ%�-�ɚ�_����̫���\�2�	v�2�QL0�)��V���@T8�	�咢6ӡ�8S*0J�B7��զ���jY+`,�x~�(������W����vgD<&�B-����l�\`��)��fbu;���C&dj��mȋdD9��	кy��p�\˃-7�5z0�/X�s�q����]�?���^+�(,���.$�� ��21��Ć�6F�L]�\��7����p�pͦC1�������@�u�c:��	nΕd�����x������p��O(��x���-1��P����8+V�Ҽ��r,��m����0��H���y�x$ZxW�N&ťL�\��}c9t�'2�+��4�s��Fӣ -�̦��'�����s����������"Y�gӍ�'��@rϽ�n�q0Z��#[�tT�@|�gtj��ݷ����*��4>�;�j܌�jҐnm%��s��f��y�TQ�!"�Fd�QW�$��uE�N��}y�la�g������r�&L�w��1��Vx>��G���|�/���s�5#��<z���O�A��z&a!au	徘^SC�����5�Z�g�	|���xZ�)p<N���j�Y�k�ӡmV����V���ܹb�C|�?S蔵���ҵ��l�u�M�
���?�<������y:=Wv�,���e������݇zW�n��86GA�GUg�	1j(Kh)sޑ��D�t�Y�e��"r(Q����3O��e-T5g]%ZQ-/ ��u۸D��,�s�S�#���*��]�K���>L���XM�ީ��$ L.�%'R�Xappg�]1��IȦ���MI�^�����B�.��T���/���}R=
�A��K<�6T�}`i��*pC!���/���!A��V�惕���G5N���P�O컿ʖ3&��_��j<ƴ�Y�Cԫ!����_@j<�V��n޺�V�7OzAB6w���<�J�i����;;��K�l!/��{�kL����J���e$��zg���Y6קWC2�TM�G&�К$q�5/�n����5�6RJ�8�]AG)e�WfI�i+bt)�h����#H6J��^t�k_��]Mq�0N��s�/ў�b����\��̖�Rl5�����a1g�Wi-�Y�3\!Pa����L5	�亘���V���еÍ