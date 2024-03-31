ableProp as an own
            // property, we cannot guarantee that it will never report it as
            // an own property later. Once a property has been reported as
            // non-existent on a non-extensible object, it should forever be
            // reported as non-existent
            throw new TypeError("cannot report existing own property '"+
                                ownEnumerableProp+"' as non-existent on a "+
                                "non-extensible object");
        }
      }
    });

    return result;
  },
  */
  
  /**
   * New trap that reifies [[Call]].
   * If the target is a function, then a call to
   *   proxy(...args)
   * Triggers this trap
   */
  apply: function(target, thisBinding, args) {
    var trap = this.getTrap("apply");
    if (trap === undefined) {
      return Reflect.apply(target, thisBinding, args);
    }

    if (typeof this.target === "function") {
      return trap.call(this.handler, target, thisBinding, args);
    } else {
      throw new TypeError("apply: "+ target + " is not a function");
    }
  },

  /**
   * New trap that reifies [[Construct]].
   * If the target is a function, then a call to
   *   new proxy(...args)
   * Triggers this trap
   */
  construct: function(target, args, newTarget) {
    var trap = this.getTrap("construct");
    if (trap === undefined) {
      return Reflect.construct(target, args, newTarget);
    }

    if (typeof target !== "function") {
      throw new TypeError("new: "+ target + " is not a function");
    }

    if (newTarget === undefined) {
      newTarget = target;
    } else {
      if (typeof newTarget !== "function") {
        throw new TypeError("new: "+ newTarget + " is not a function");
      }      
    }
    return trap.call(this.handler, target, args, newTarget);
  }
};

// ---- end of the Validator handler wrapper handler ----

// In what follows, a 'direct proxy' is a proxy
// whose handler is a Validator. Such proxies can be made non-extensible,
// sealed or frozen without losing the ability to trap.

// maps direct proxies to their Validator handlers
var directProxies = new WeakMap();

// patch Object.{preventExtensions,seal,freeze} so that
// they recognize fixable proxies and act accordingly
Object.preventExtensions = function(subject) {
  var vhandler = directProxies.get(subject);
  if (vhandler !== undefined) {
    if (vhandler.preventExtensions()) {
      return subject;
    } else {
      throw new TypeError("preventExtensions on "+subject+" rejected");
    }
  } else {
    return prim_preventExtensions(subject);
  }
};
Object.seal = function(subject) {
  setIntegrityLevel(subject, "sealed");
  return subject;
};
Object.freeze = function(subject) {
  setIntegrityLevel(subject, "frozen");
  return subject;
};
Object.isExtensible = Object_isExtensible = function(subject) {
  var vHandler = directProxies.get(subject);
  if (vHandler !== undefined) {
    return vHandler.isExtensible();
  } else {
    return prim_isExtensible(subject);
  }
};
Object.isSealed = Object_isSealed = function(subject) {
  return testIntegrityLevel(subject, "sealed");
};
Object.isFrozen = Object_isFrozen = function(subject) {
  return testIntegrityLevel(subject, "frozen");
};
Object.getPrototypeOf = Object_getPrototypeOf = function(subject) {
  var vHandler = directProxies.get(subject);
  if (vHandler !== undefined) {
    return vHandler.getPrototypeOf();
  } else {
    return prim_getPrototypeOf(subject);
  }
};

// patch Object.getOwnPropertyDescriptor to directly call
// the Validator.prototype.getOwnPropertyDescriptor trap
// This is to circumvent an assertion in the built-in Proxy
// trapping mechanism of v8, which disallows that trap to
// return non-configurable property descriptors (as per the
// old Proxy design)
Object.getOwnPropertyDescriptor = function(subject, name) {
  var vhandler = directProxies.get(subject);
  if (vhandler !== undefined) {
    return vhandler.getOwnPropertyDescriptor(name);
  } else {
    return prim_getOwnPropertyDescriptor(subject, name);
  }
};

// patch Object.defineProperty to directly call
// the Validator.prototype.defineProperty trap
// This is to circumvent two issues with the built-in
// trap mechanism:
// 1) the current tracemonkey implementation of proxies
// auto-completes 'desc', which is not correct. 'desc' should be
// normalized, but not completed. Consider:
// Object.defineProperty(proxy, 'foo', {enumerable:false})
// This trap will receive desc =
//  {value:undefined,writable:false,enumerable:false,configurable:false}
// This will also set all other attributes to their default value,
// which is unexpected and different from [[DefineOwnProperty]].
// Bug filed: https://bugzilla.mozilla.org/show_bug.cgi?id=601329
// 2) the current spidermonkey implementation does not
// throw an exception when this trap returns 'false', but instead silently
// ignores the operation (this is regardless of strict-mode)
// 2a) v8 does throw an exception for this case, but includes the rather
//     unhelpful error message:
// 'Proxy handler #<Object> returned false from 'defineProperty' trap'
Object.defineProperty = function(subject, name, desc) {
  var vhandler = directProxies.get(subject);
  if (vhandler !== undefined) {
    var normalizedDesc = normalizePropertyDescriptor(desc);
    var success = vhandler.defineProperty(name, normalizedDesc);
    if (success === false) {
      throw new TypeError("can't redefine property '"+name+"'");
    }
    return subject;
  } else {
    return prim_defineProperty(subject, name, desc);
  }
};

Object.defineProperties = function(subject, descs) {
  var vhandler = directProxies.get(subject);
  if (vhandler !== undefined) {
    var names = Object.keys(descs);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      var normalizedDesc = normalizePropertyDescriptor(descs[name]);
      var success = vhandler.defineProperty(name, normalizedDesc);
      if (success === false) {
        throw new TypeError("can't redefine property '"+name+"'");
      }
    }
    return subject;
  } else {
    return prim_defineProperties(subject, descs);
  }
};

Object.keys = function(subject) {
  var vHandler = directProxies.get(subject);
  if (vHandler !== undefined) {
    var ownKeys = vHandler.ownKeys();
    var result = [];
    for (var i = 0; i < ownKeys.length; i++) {
      var k = String(ownKeys[i]);
      var desc = Object.getOwnPropertyDescriptor(subject, k);
      if (desc !== undefined && desc.enumerable === true) {
        result.push(k);
      }
    }
    return result;
  } else {
    return prim_keys(subject);
  }
}

Object.getOwnPropertyNames = Object_getOwnPropertyNames = function(subject) {
  var vHandler = directProxies.get(subject);
  if (vHandler !== undefined) {
    return vHandler.ownKeys();
  } else {
    return prim_getOwnPropertyNames(subject);
  }
}

// fixes issue #71 (Calling Object.getOwnPropertySymbols() on a Proxy
// throws an error)
if (prim_getOwnPropertySymbols !== undefined) {
  Object.getOwnPropertySymbols = function(subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      // as this shim does not support symbols, a Proxy never advertises
      // any symbol-valued own properties
      return [];
    } else {
      return prim_getOwnPropertySymbols(subject);
    }
  };
}

// fixes issue #72 ('Illegal access' error when using Object.assign)
// Object.assign polyfill based on a polyfill posted on MDN: 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/\
//  Global_Objects/Object/assign
// Note that this polyfill does not support Symbols, but this Proxy Shim
// does not support Symbols anyway.
if (prim_assign !== undefined) {
  Object.assign = function (target) {
    
    // check if any argument is a proxy object
    var noProxies = true;
    for (var i = 0; i < arguments.length; i++) {
      var vHandler = directProxies.get(arguments[i]);
      if (vHandler !== undefined) {
        noProxies = false;
        break;
      }
    }
    if (noProxies) {
      // not a single argument is a proxy, perform built-in algorithm
      return prim_assign.apply(Object, arguments);
    }
    
    // there is at least one proxy argument, use the polyfill
    
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source !== undefined && source !== null) {
        for (var nextKey in source) {
          if (source.hasOwnProperty(nextKey)) {
            output[nextKey] = source[nextKey];
          }
        }
      }
    }
    return output;
  };
}

// returns whether an argument is a reference to an object,
// which is legal as a WeakMap key.
function isObject(arg) {
  var type = typeof arg;
  return (type === 'object' && arg !== null) || (type === 'function');
};

// a wrapper for WeakMap.get which returns the undefined value
// for keys that are not objects (in which case the underlying
// WeakMap would have thrown a TypeError).
function safeWeakMapGet(map, key) {
  return isObject(key) ? map.get(key) : undefined;
};

// returns a new function of zero arguments that recursively
// unwraps any proxies specified as the |this|-value.
// The primitive is assumed to be a zero-argument method
// that uses its |this|-binding.
function makeUnwrapping0ArgMethod(primitive) {
  return function builtin() {
    var vHandler = safeWeakMapGet(directProxies, this);
    if (vHandler !== undefined) {
      return builtin.call(vHandler.target);
    } else {
      return primitive.call(this);
    }
  }
};

// returns a new function of 1 arguments that recursively
// unwraps any proxies specified as the |this|-value.
// The primitive is assumed to be a 1-argument method
// that uses its |this|-binding.
function makeUnwrapping1ArgMethod(primitive) {
  return function builtin(arg) {
    var vHandler = safeWeakMapGet(directProxies, this);
    if (vHandler !== undefined) {
      return builtin.call(vHandler.target, arg);
    } else {
      return primitive.call(this, arg);
    }
  }
};

Object.prototype.valueOf =
  makeUnwrapping0ArgMethod(Object.prototype.valueOf);
Object.prototype.toString =
  makeUnwrapping0ArgMethod(Object.prototype.toString);
Function.prototype.toString =
  makeUnwrapping0ArgMethod(Function.prototype.toString);
Date.prototype.toString =
  makeUnwrapping0ArgMethod(Date.prototype.toString);

Object.prototype.isPrototypeOf = function builtin(arg) {
  // bugfix thanks to Bill Mark:
  // built-in isPrototypeOf does not unwrap proxies used
  // as arguments. So, we implement the builtin ourselves,
  // based on the ECMAScript 6 spec. Our encoding will
  // make sure that if a proxy is used as an argument,
  // its getPrototypeOf trap will be called.
  while (true) {
    var vHandler2 = safeWeakMapGet(directProxies, arg);
    if (vHandler2 !== undefined) {
      arg = vHandler2.getPrototypeOf();
      if (arg === null) {
        return false;
      } else if (sameValue(arg, this)) {
        return true;
      }
    } else {
      return prim_isPrototypeOf.call(this, arg);
    }
  }
};

Array.isArray = function(subject) {
  var vHandler = safeWeakMapGet(directProxies, subject);
  if (vHandler !== undefined) {
    return Array.isArray(vHandler.target);
  } else {
    return prim_isArray(subject);
  }
};

function isProxyArray(arg) {
  var vHandler = safeWeakMapGet(directProxies, arg);
  if (vHandler !== undefined) {
    return Array.isArray(vHandler.target);
  }
  return false;
}

// Array.prototype.concat internally tests whether one of its
// arguments is an Array, by checking whether [[Class]] == "Array"
// As such, it will fail to recognize proxies-for-arrays as arrays.
// We patch Array.prototype.concat so that it "unwraps" proxies-for-arrays
// by making a copy. This will trigger the exact same sequence of
// traps on the proxy-for-array as if we would not have unwrapped it.
// See <https://github.com/tvcutsem/harmony-reflect/issues/19> for more.
Array.prototype.concat = function(/*...args*/) {
  var length;
  for (var i = 0; i < arguments.length; i++) {
    if (isProxyArray(arguments[i])) {
      length = arguments[i].length;
      arguments[i] = Array.prototype.slice.call(arguments[i], 0, length);
    }
  }
  return prim_concat.apply(this, arguments);
};

// setPrototypeOf support on platforms that support __proto__

var prim_setPrototypeOf = Object.setPrototypeOf;

// patch and extract original __proto__ setter
var __proto__setter = (function() {
  var protoDesc = prim_getOwnPropertyDescriptor(Object.prototype,'__proto__');
  if (protoDesc === undefined ||
      typeof protoDesc.set !== "function") {
    return function() {
      throw new TypeError("setPrototypeOf not supported on this platform");
    }
  }

  // see if we can actually mutate a prototype with the generic setter
  // (e.g. Chrome v28 doesn't allow setting __proto__ via the generic setter)
  try {
    protoDesc.set.call({},{});
  } catch (e) {
    return function() {
      throw new TypeError("setPrototypeOf not supported on this platform");
    }
  }

  prim_defineProperty(Object.prototype, '__proto__', {
    set: function(newProto) {
      return Object.setPrototypeOf(this, Object(newProto));
    }
  });

  return protoDesc.set;
}());

Object.setPrototypeOf = function(target, newProto) {
  var handler = directProxies.get(target);
  if (handler !== undefined) {
    if (handler.setPrototypeOf(newProto)) {
      return target;
    } else {
      throw new TypeError("proxy rejected prototype mutation");
    }
  } else {
    if (!Object_isExtensible(target)) {
      throw new TypeError("can't set prototype on non-extensible object: " +
                          target);
    }
    if (prim_setPrototypeOf)
      return prim_setPrototypeOf(target, newProto);

    if (Object(newProto) !== newProto || newProto === null) {
      throw new TypeError("Object prototype may only be an Object or null: " +
                         newProto);
      // throw new TypeError("prototype must be an object or null")
    }
    __proto__setter.call(target, newProto);
    return target;
  }
}

Object.prototype.hasOwnProperty = function(name) {
  var handler = safeWeakMapGet(directProxies, this);
  if (handler !== undefined) {
    var desc = handler.getOwnPropertyDescriptor(name);
    return desc !== undefined;
  } else {
    return prim_hasOwnProperty.call(this, name);
  }
}

// ============= Reflection module =============
// see http://wiki.ecmascript.org/doku.php?id=harmony:reflect_api

var Reflect = {
  getOwnPropertyDescriptor: function(target, name) {
    return Object.getOwnPropertyDescriptor(target, name);
  },
  defineProperty: function(target, name, desc) {

    // if target is a proxy, invoke its "defineProperty" trap
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      return handler.defineProperty(target, name, desc);
    }

    // Implementation transliterated from [[DefineOwnProperty]]
    // see ES5.1 section 8.12.9
    // this is the _exact same algorithm_ as the isCompatibleDescriptor
    // algorithm defined above, except that at every place it
    // returns true, this algorithm actually does define the property.
    var current = Object.getOwnPropertyDescriptor(target, name);
    var extensible = Object.isExtensible(target);
    if (current === undefined && extensible === false) {
      return false;
    }
    if (current === undefined && extensible === true) {
      Object.defineProperty(target, name, desc); // should never fail
      return true;
    }
    if (isEmptyDescriptor(desc)) {
      return true;
    }
    if (isEquivalentDescriptor(current, desc)) {
      return true;
    }
    if (current.configurable === false) {
      if (desc.configurable === true) {
        return false;
      }
      if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
        return false;
      }
    }
    if (isGenericDescriptor(desc)) {
      // no further validation necessary
    } else if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
      if (current.configurable === false) {
        return false;
      }
    } else if (isDataDescriptor(current) && isDataDescriptor(desc)) {
      if (current.configurable === f.           ¯Ž¦mXmX  ¦mXõZ    ..          ¯Ž¦mXmX  ¦mXÓY    Bm a p s .  ‚j s   ÿÿÿÿÿÿ  ÿÿÿÿa p p l y  ‚- s o u r c   e - APPLY-~1JS   ™¦mXmX  ¦mX7a
  Ci a . j s  Ý  ÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿt - u r l  Ý- a n d - m   e d e x t r a  Ýc t - i m p   o r EXTRAC~1JS   jy§mXmX  |§mX‘šq  Cs   ÿÿÿÿÿÿ ‡ÿÿÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿm a p - t  ‡r a c k e r   . j i n p u t  ‡- s o u r c   e - INPUT-~1JS   £Y¨mXmX  [¨mX*«g  Bs o u r c  Xe . j s   ÿÿ  ÿÿÿÿi s - a l  Xl o w e d -   r e IS-ALL~1JS   `¨mXmX  b¨mX¬  B- s o u r  c e s . j s     ÿÿl o a d -  o r i g i n   a l LOAD-O~1JS   ½t¨mXmX  v¨mXa°7  Be s o u r  «c e . j s     ÿÿÿÿl o a d -  «r e m o t e   - r LOAD-R~1JS   ­x¨mXmX  z¨mXÅ°_  Bi . j s    :ÿÿÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿm a t c h  :- d a t a -   u r MATCH-~1JS   Q¨mXmX  ‚¨mXY²¾   Bh . j s    çÿÿÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿn o r m a  çl i z e - p   a t NORMAL~1JS   ¬Ž¨mXmX  ¨mXµÆ   Bj s   ÿÿÿÿ "ÿÿÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿr e a d -  "s o u r c e   s . READ-S~1JS   F®¨mXmX  °¨mX1»ò4  Bm a p . j  Is   ÿÿÿÿÿÿÿÿ  ÿÿÿÿr e b a s  Ie - l o c a   l - REBASE~1JS   +°¨mXmX  ±¨mX»¾  B- m a p .  éj s   ÿÿÿÿÿÿ  ÿÿÿÿr e b a s  ée - r e m o   t e REBASE~2JS   Ç³¨mXmX  µ¨mXÚ»J  REBASE  JS  ?¸¨mXmX  ¹¨mXÇ¼ø	  Bt . j s    ÿÿÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿr e s t o  r e - i m p   o r RESTOR~1JS   UÆ¨mXmX  Ç¨mXq¿„   Bs   ÿÿÿÿÿÿ Àÿÿÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿr e w r i  Àt e - u r l   . j REWRIT~1JS   8Ì¨mXmX  Í¨mX—À
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    