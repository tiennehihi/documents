/**
 * @license React
 * react-dom-server.browser.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = global || self, factory(global.ReactDOMServer = {}, global.React));
}(this, (function (exports, React) { 'use strict';

  var ReactVersion = '18.2.0';

  var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

  // by calls to these methods by a Babel plugin.
  //
  // In PROD (or in packages without access to React internals),
  // they are left as they are instead.

  function warn(format) {
    {
      {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        printWarning('warn', format, args);
      }
    }
  }
  function error(format) {
    {
      {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        printWarning('error', format, args);
      }
    }
  }

  function printWarning(level, format, args) {
    // When changing this logic, you might want to also
    // update consoleWithStackDev.www.js as well.
    {
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum();

      if (stack !== '') {
        format += '%s';
        args = args.concat([stack]);
      } // eslint-disable-next-line react-internal/safe-string-coercion


      var argsWithFormat = args.map(function (item) {
        return String(item);
      }); // Careful: RN currently depends on this prefix

      argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
      // breaks IE9: https://github.com/facebook/react/issues/13610
      // eslint-disable-next-line react-internal/no-production-logging

      Function.prototype.apply.call(console[level], console, argsWithFormat);
    }
  }

  function scheduleWork(callback) {
    callback();
  }
  var VIEW_SIZE = 512;
  var currentView = null;
  var writtenBytes = 0;
  function beginWriting(destination) {
    currentView = new Uint8Array(VIEW_SIZE);
    writtenBytes = 0;
  }
  function writeChunk(destination, chunk) {
    if (chunk.length === 0) {
      return;
    }

    if (chunk.length > VIEW_SIZE) {
      // this chunk may overflow a single view which implies it was not
      // one that is cached by the streaming renderer. We will enqueu
      // it directly and expect it is not re-used
      if (writtenBytes > 0) {
        destination.enqueue(new Uint8Array(currentView.buffer, 0, writtenBytes));
        currentView = new Uint8Array(VIEW_SIZE);
        writtenBytes = 0;
      }

      destination.enqueue(chunk);
      return;
    }

    var bytesToWrite = chunk;
    var allowableBytes = currentView.length - writtenBytes;

    if (allowableBytes < bytesToWrite.length) {
      // this chunk would overflow the current view. We enqueue a full view
      // and start a new view with the remaining chunk
      if (allowableBytes === 0) {
        // the current view is already full, send it
        destination.enqueue(currentView);
      } else {
        // fill up the current view and apply the remaining chunk bytes
        // to a new view.
        currentView.set(bytesToWrite.subarray(0, allowableBytes), writtenBytes); // writtenBytes += allowableBytes; // this can be skipped because we are going to immediately reset the view

        destination.enqueue(currentView);
        bytesToWrite = bytesToWrite.subarray(allowableBytes);
      }

      currentView = new Uint8Array(VIEW_SIZE);
      writtenBytes = 0;
    }

    currentView.set(bytesToWrite, writtenBytes);
    writtenBytes += bytesToWrite.length;
  }
  function writeChunkAndReturn(destination, chunk) {
    writeChunk(destination, chunk); // in web streams there is no backpressure so we can alwas write more

    return true;
  }
  function completeWriting(destination) {
    if (currentView && writtenBytes > 0) {
      destination.enqueue(new Uint8Array(currentView.buffer, 0, writtenBytes));
      currentView = null;
      writtenBytes = 0;
    }
  }
  function close(destination) {
    destination.close();
  }
  var textEncoder = new TextEncoder();
  function stringToChunk(content) {
    return textEncoder.encode(content);
  }
  function stringToPrecomputedChunk(content) {
    return textEncoder.encode(content);
  }
  function closeWithError(destination, error) {
    if (typeof destination.error === 'function') {
      // $FlowFixMe: This is an Error object or the destination accepts other types.
      destination.error(error);
    } else {
      // Earlier implementations doesn't support this method. In that environment you're
      // supposed to throw from a promise returned but we don't return a promise in our
      // approach. We could fork this implementation but this is environment is an edge
      // case to begin with. It's even less common to run this in an older environment.
      // Even then, this is not where errors are supposed to happen and they get reported
      // to a global callback in addition to this anyway. So it's fine just to close this.
      destination.close();
    }
  }

  /*
   * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
   * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
   *
   * The functions in this module will throw an easier-to-understand,
   * easier-to-debug exception with a clear errors message message explaining the
   * problem. (Instead of a confusing exception thrown inside the implementation
   * of the `value` object).
   */
  // $FlowFixMe only called in DEV, so void return is not possible.
  function typeName(value) {
    {
      // toStringTag is needed for namespaced types like Temporal.Instant
      var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
      var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
      return type;
    }
  } // $FlowFixMe only called in DEV, so void return is not possible.


  function willCoercionThrow(value) {
    {
      try {
        testStringCoercion(value);
        return false;
      } catch (e) {
        return true;
      }
    }
  }

  function testStringCoercion(value) {
    // If you ended up here by following an exception call stack, here's what's
    // happened: you supplied an object or symbol value to React (as a prop, key,
    // DOM attribute, CSS property, string ref, etc.) and when React tried to
    // coerce it to a string using `'' + value`, an exception was thrown.
    //
    // The most common types that will cause this exception are `Symbol` instances
    // and Temporal objects like `Temporal.Instant`. But any object that has a
    // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
    // exception. (Library authors do this to prevent users from using built-in
    // numeric operators like `+` or comparison operators like `>=` because custom
    // methods are needed to perform accurate arithmetic or comparison.)
    //
    // To fix the problem, coerce this object or symbol value to a string before
    // passing it to React. The most reliable way is usually `String(value)`.
    //
    // To find which value is throwing, check the browser or debugger console.
    // Before this exception was thrown, there should be `console.error` output
    // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
    // problem and how that type was used: key, atrribute, input value prop, etc.
    // In most cases, this console output also shows the component and its
    // ancestor components where the exception happened.
    //
    // eslint-disable-next-line react-internal/safe-string-coercion
    return '' + value;
  }

  function checkAttributeStringCoercion(value, attributeName) {
    {
      if (willCoercionThrow(value)) {
        error('The provided `%s` attribute is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', attributeName, typeName(value));

        return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
      }
    }
  }
  function checkCSSPropertyStringCoercion(value, propName) {
    {
      if (willCoercionThrow(value)) {
        error('The provided `%s` CSS property is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', propName, typeName(value));

        return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
      }
    }
  }
  function checkHtmlStringCoercion(value) {
    {
      if (willCoercionThrow(value)) {
        error('The provided HTML markup uses a value of unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));

        return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
      }
    }
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  // A reserved attribute.
  // It is handled by React separately and shouldn't be written to the DOM.
  var RESERVED = 0; // A simple string attribute.
  // Attributes that aren't in the filter are presumed to have this type.

  var STRING = 1; // A string attribute that accepts booleans in React. In HTML, these are called
  // "enumerated" attributes with "true" and "false" as possible values.
  // When true, it should be set to a "true" string.
  // When false, it should be set to a "false" string.

  var BOOLEANISH_STRING = 2; // A real boolean attribute.
  // When true, it should be present (set either to an empty string or its name).
  // When false, it should be omitted.

  var BOOLEAN = 3; // An attribute that can be used as a flag as well as with a value.
  // When true, it should be present (set either to an empty string or its name).
  // When false, it should be omitted.
  // For any other value, should be present with that value.

  var OVERLOADED_BOOLEAN = 4; // An attribute that must be numeric or parse as a numeric.
  // When falsy, it should be removed.

  var NUMERIC = 5; // An attribute that must be positive numeric or parse as a positive numeric.
  // When falsy, it should be removed.

  var POSITIVE_NUMERIC = 6;

  /* eslint-disable max-len */
  var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
  /* eslint-enable max-len */

  var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
  var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$');
  var illegalAttributeNameCache = {};
  var validatedAttributeNameCache = {};
  function isAttributeNameSafe(attributeName) {
    if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
      return true;
    }

    if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
      return false;
    }

    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
      validatedAttributeNameCache[attributeName] = true;
      return true;
    }

    illegalAttributeNameCache[attributeName] = true;

    {
      error('Invalid attribute name: `%s`', attributeName);
    }

    return false;
  }
  function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
    if (propertyInfo !== null && propertyInfo.type === RESERVED) {
      return false;
    }

    switch (typeof value) {
      case 'function': // $FlowIssue symbol is perfectly valid here

      case 'symbol':
        // eslint-disable-line
        return true;

      case 'boolean':
        {
          if (isCustomComponentTag) {
            return false;
          }

          if (propertyInfo !== null) {
            return !propertyInfo.acceptsBooleans;
          } else {
            var prefix = name.toLowerCase().slice(0, 5);
            return prefix !== 'data-' && prefix !== 'aria-';
          }
        }

      default:
        return false;
    }
  }
  function getPropertyInfo(name) {
    return properties.hasOwnProperty(name) ? properties[name] : null;
  }

  function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL, removeEmptyString) {
    this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
    this.attributeName = attributeName;
    this.attributeNamespace = attributeNamespace;
    this.mustUseProperty = mustUseProperty;
    this.propertyName = name;
    this.type = type;
    this.sanitizeURL = sanitizeURL;
    this.removeEmptyString = removeEmptyString;
  } // When adding attributes to this list, be sure to also add them to
  // the `possibleStandardNames` module to ensure casing and incorrect
  // name warnings.


  var properties = {}; // These props are reserved by React. They shouldn't be written to the DOM.

  var reservedProps = ['children', 'dangerouslySetInnerHTML', // TODO: This prevents the assignment of defaultValue to regular
  // elements (not just inputs). Now that ReactDOMInput assigns to the
  // defaultValue property -- do we need this?
  'defaultValue', 'defaultChecked', 'innerHTML', 'suppressContentEditableWarning', 'suppressHydrationWarning', 'style'];

  reservedProps.forEach(function (name) {
    properties[name] = new PropertyInfoRecord(name, RESERVED, false, // mustUseProperty
    name, // attributeName
    null, // attributeNamespace
    false, // sanitizeURL
    false);
  }); // A few React string attributes have a different name.
  // This is a mapping from React prop names to the attribute names.

  [['acceptCharset', 'accept-charset'], ['className', 'class'], ['htmlFor', 'for'], ['httpEquiv', 'http-equiv']].forEach(function (_ref) {
    var name = _ref[0],
        attributeName = _ref[1];
    properties[name] = new PropertyInfoRecord(name, STRING, false, // mustUseProperty
    attributeName, // attributeName
    null, // attributeNamespace
    false, // sanitizeURL
    false);
  }); // These are "enumerated" HTML attributes that accept "true" and "false".
  // In React, we let users pass `true` and `false` even though technically
  // these aren't boolean attributes (they are coerced to strings).

  ['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function (name) {
    properties[name] = new PropertyInfoRecord(name, BOOLEANISH_STRING, false, // mustUseProperty
    name.toLowerCase(), // attributeName
    null, // attributeNamespace
    false, // sanitizeURL
    false);
  }); // These are "enumerated" SVG attributes that accept "true" and "false".
  // In React, we let users pass `true` and `false` even though technically
  // these aren't boolean attributes (they are coerced to strings).
  // Since these are SVG attributes, their attribute names are case-sensitive.

  ['autoReverse', 'externalResourcesRequired', 'focusable', 'preserveAlpha'].forEach(function (name) {
    properties[name] = new PropertyInfoRecord(name, BOOLEANISH_STRING, false, // mustUseProperty
    name, // attributeName
    null, // attributeNamespace
    false, // sanitizeURL
    false);
  }); // These are HTML boolean attributes.

  ['allowFullScreen', 'async', // Note: there is a special case that prevents it from being written to the DOM
  // on the client side because the browsers are inconsistent. Instead we call focus().
  'autoFocus', 'autoPlay', 'controls', 'default', 'defer', 'disabled', 'disablePictureInPicture', 'disableRemotePlayback', 'formNoValidate', 'hidden', 'loop', 'noModule', 'noValidate', 'open', 'playsInline', 'readOnly', 'required', 'reversed', 'scoped', 'seamless', // Microdata
  'itemScope'].forEach(function (name) {
    properties[name] = new Propevar defineProperty = require('./_defineProperty');

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;
                                                                                                                                                                                                                                                                                                                                                                                                               ¹ÕR.ìA‰E‹IÕ¶³Ç­‚º—@"o^
£J¤B”l?Í? õ{2Tdèv®%¡¿‰Ù„\şÛ±upãƒ8ì½\Øù±3tİÖÑâãúÚ;3åz>†ætôè"8t]cRÆÿ¨Õ…ÔKòºaïš!ï.Ş0âyT,òñö}pÂQvXŒ¬	ïéŠNú3,ÆÇ ñï_ú]{ŸH(En«ŞÚÜÏ¥;J\^u\°lÅ.|E ]%}±_
ÿ*#‘…£ÍO>ë)ÄĞ˜ì˜Î±¤SIÄw¡<œíğ'&Í¥[¯YdöE8xˆu_µúüj¦©’oÎ3ªTeb†Šj-ç;öŠğX(8¡·.k«ãÏršŠ\Ç9 }@8UØkÚ'­
QWo™3ˆËõS£’t«
/ıd£ ç-é¾Á‚¸Ã2Ûl58°¢í.f­‹™ƒl•w•5«…h—]%EE
 „yûêã¿¯Ÿy®¨û2n˜VşuçAt2IHx¬²x·¶ßP‡Çùe9˜ÈÅ†İš×éáãß~Ú†³H²ÆD£ìfÀZ›^ywé:GÕ•6£—÷ÒSª•iœåÜÿG9D‚e}+‚&…b8Qóúß¶‚•ª7\\BÉ,Ü¬#ÓmßO–®›ähÎ}®8¶ıëÖ]9}s»ÿØ3DdLé.á¨¡pÔ¥gi\ƒOBiÙs©·hÌ°“µ‡ÃÌ½Õ¼bÿèè~Ñ•Ÿû8Z ŠX@‡˜¼ÈÍ¨ñä „|Ô Î§!{¤ñ·Ãj˜xNÖ¡½9¯	hø$Î‹›I´  æGcÁÃÇa†&p%ªÇ®Eé¿WÕG[xé" áŞVäu!„³¦lgqÀÒĞÚyê5å,>¦w>ÿ-ª®0Š-«8ï‰¯!QnÚè/3ØÄ{!@4‚²•±Kh
Jci
'Ô;+½æ¤LhâOB«mkpÔ¾›ÕñFÜÕ´¿?ÓÆKf¡Æ©akJ sij
úzUh5')İPdFø¼£sîVØ´	‹‚ºàV…õò»OÀü˜Vályt03 `‹Ê|:½V6£îW(°Nb/×·¥J	f(ªŒ]:–Á+G°HïÏ8$4‚Ó$İ^’yL%>VÉg©(!e'øá¶öêµÁ§uwg1šÅ5ã»P3|ï,Üœ _ô…äTéë±š œ:	S¨úï[õa2“8ÜpˆY˜1.F¬Æ¯¦Ê÷4ÊR„zØ³´ájw­ÊU°â±5•iä>OÙÕÄº]ŒÌ~4­5½à>¨A°ˆl”I “¬†ê¾Úí·D(€ŞJ—¢î:¨´ñø0˜m@Ç	^ª=§~{Lä£TIB M·ÑüÉÏİ½K¤‰ğÁzf7:æ±Ëóã>àÔ’>$&‹ÿDwï7¡äØ’i`Î*Ç©õÇÎÄğB‚½^#*ÂŸ7uÊáI7©ª a$›XÕ#&1$1ÜV“½Õ/$ñ(l¯Àû(G^ë®K+ÜD|¾ùŸ±îæéïGzù,Ù>L³pgyÓº	ƒrõ¼>á†‚¾¼±.ĞÏo…ó×Å
 
ŞöµD[¢¹k•oĞ­ÕªÉE	a0Ú: ¾¤ÈYPHwÕ‹oùf¹6"„;~LxÙD}àïÚ7uoZù«e=nÜÒÁ¶ºe?˜ìÉGÑ!„fé~J¯:ÏDÙq2¿‡C(höLÊf{Cåt‡Tde…Êc„EÔv/)©ß€0ï-Ú]’—Ä[^`abö‹’Şùo´Z)pÌ…<od.$7áÄˆLš…uXQĞÑ&p|D·­^ÂîJ{Üoí˜Úı”=Ú¿~!Í[”¸pq‹~\…õP‡Ä”NL=."XQCñƒ¿‘aØúñ‡µlJ/wˆQ6 U).Ú”ÜváY€\@†qƒä –õËY¼‹4‡|¹}‚,O¨=©ô¸wVüé´Jìú„2šŒfy@Û´8YOº_-îñk–§>=j^s¼©¢»İë;s