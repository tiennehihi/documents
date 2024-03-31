use:
   *          'RSAES-PKCS1-V1_5' (default),
   *          'RSA-OAEP',
   *          'RAW', 'NONE', or null to perform raw RSA encryption,
   *          an object with an 'encode' property set to a function
   *          with the signature 'function(data, key)' that returns
   *          a binary-encoded string representing the encoded data.
   * @param schemeOptions any scheme-specific options.
   *
   * @return the encrypted byte string.
   */
  key.encrypt = function(data, scheme, schemeOptions) {
    if(typeof scheme === 'string') {
      scheme = scheme.toUpperCase();
    } else if(scheme === undefined) {
      scheme = 'RSAES-PKCS1-V1_5';
    }

    if(scheme === 'RSAES-PKCS1-V1_5') {
      scheme = {
        encode: function(m, key, pub) {
          return _encodePkcs1_v1_5(m, key, 0x02).getBytes();
        }
      };
    } else if(scheme === 'RSA-OAEP' || scheme === 'RSAES-OAEP') {
      scheme = {
        encode: function(m, key) {
          return forge.pkcs1.encode_rsa_oaep(key, m, schemeOptions);
        }
      };
    } else if(['RAW', 'NONE', 'NULL', null].indexOf(scheme) !== -1) {
      scheme = {encode: function(e) {return e;}};
    } else if(typeof scheme === 'string') {
      throw new Error('Unsupported encryption scheme: "' + scheme + '".');
    }

    // do scheme-based encoding then rsa encryption
    var e = scheme.encode(data, key, true);
    return pki.rsa.encrypt(e, key, true);
  };

  /**
   * Verifies the given signature against the given digest.
   *
   * PKCS#1 supports multiple (currently two) signature schemes:
   * RSASSA-PKCS1-V1_5 and RSASSA-PSS.
   *
   * By default this implementation uses the "old scheme", i.e.
   * RSASSA-PKCS1-V1_5, in which case once RSA-decrypted, the
   * signature is an OCTET STRING that holds a DigestInfo.
   *
   * DigestInfo ::= SEQUENCE {
   *   digestAlgorithm DigestAlgorithmIdentifier,
   *   digest Digest
   * }
   * DigestAlgorithmIdentifier ::= AlgorithmIdentifier
   * Digest ::= OCTET STRING
   *
   * To perform PSS signature verification, provide an instance
   * of Forge PSS object as the scheme parameter.
   *
   * @param digest the message digest hash to compare against the signature,
   *          as a binary-encoded string.
   * @param signature the signature to verify, as a binary-encoded string.
   * @param scheme signature verification scheme to use:
   *          'RSASSA-PKCS1-V1_5' or undefined for RSASSA PKCS#1 v1.5,
   *          a Forge PSS object for RSASSA-PSS,
   *          'NONE' or null for none, DigestInfo will not be expected, but
   *            PKCS#1 v1.5 padding will still be used.
   * @param options optional verify options
   *          _parseAllDigestBytes testing flag to control parsing of all
   *            digest bytes. Unsupported and not for general usage.
   *            (default: true)
   *
   * @return true if the signature was verified, false if not.
   */
  key.verify = function(digest, signature, scheme, options) {
    if(typeof scheme === 'string') {
      scheme = scheme.toUpperCase();
    } else if(scheme === undefined) {
      scheme = 'RSASSA-PKCS1-V1_5';
    }
    if(options === undefined) {
      options = {
        _parseAllDigestBytes: true
      };
    }
    if(!('_parseAllDigestBytes' in options)) {
      options._parseAllDigestBytes = true;
    }

    if(scheme === 'RSASSA-PKCS1-V1_5') {
      scheme = {
        verify: function(digest, d) {
          // remove padding
          d = _decodePkcs1_v1_5(d, key, true);
          // d is ASN.1 BER-encoded DigestInfo
          var obj = asn1.fromDer(d, {
            parseAllBytes: options._parseAllDigestBytes
          });

          // validate DigestInfo
          var capture = {};
          var errors = [];
          if(!asn1.validate(obj, digestInfoValidator, capture, errors)) {
            var error = new Error(
              'ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 ' +
              'DigestInfo value.');
            error.errors = errors;
            throw error;
          }
          // check hash algorithm identifier
          // see PKCS1-v1-5DigestAlgorithms in RFC 8017
          // FIXME: add support to vaidator for strict value choices
          var oid = asn1.derToOid(capture.algorithmIdentifier);
          if(!(oid === forge.oids.md2 ||
            oid === forge.oids.md5 ||
            oid === forge.oids.sha1 ||
            oid === forge.oids.sha224 ||
            oid === forge.oids.sha256 ||
            oid === forge.oids.sha384 ||
            oid === forge.oids.sha512 ||
            oid === forge.oids['sha512-224'] ||
            oid === forge.oids['sha512-256'])) {
            var error = new Error(
              'Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier.');
            error.oid = oid;
            throw error;
          }

          // special check for md2 and md5 that NULL parameters exist
          if(oid === forge.oids.md2 || oid === forge.oids.md5) {
            if(!('parameters' in capture)) {
              throw new Error(
                'ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 ' +
                'DigestInfo value. ' +
                'Missing algorithm identifer NULL parameters.');
            }
          }

          // compare the given digest to the decrypted one
          return digest === capture.digest;
        }
      };
    } else if(scheme === 'NONE' || scheme === 'NULL' || scheme === null) {
      scheme = {
        verify: function(digest, d) {
          // remove padding
          d = _decodePkcs1_v1_5(d, key, true);
          return digest === d;
        }
      };
    }

    // do rsa decryption w/o any decoding, then verify -- which does decoding
    var d = pki.rsa.decrypt(signature, key, true, false);
    return scheme.verify(digest, d, key.n.bitLength());
  };

  return key;
};

/**
 * Sets an RSA private key from BigIntegers modulus, exponent, primes,
 * prime exponents, and modular multiplicative inverse.
 *
 * @param n the modulus.
 * @param e the public exponent.
 * @param d the private exponent ((inverse of e) mod n).
 * @param p the first prime.
 * @param q the second prime.
 * @param dP exponent1 (d mod (p-1)).
 * @param dQ exponent2 (d mod (q-1)).
 * @param qInv ((inverse of q) mod p)
 *
 * @return the private key.
 */
pki.setRsaPrivateKey = pki.rsa.setPrivateKey = function(
  n, e, d, p, q, dP, dQ, qInv) {
  var key = {
    n: n,
    e: e,
    d: d,
    p: p,
    q: q,
    dP: dP,
    dQ: dQ,
    qInv: qInv
  };

  /**
   * Decrypts the given data with this private key. The decryption scheme
   * must match the one used to encrypt the data.
   *
   * @param data the byte string to decrypt.
   * @param scheme the decryption scheme to use:
   *          'RSAES-PKCS1-V1_5' (default),
   *          'RSA-OAEP',
   *          'RAW', 'NONE', or null to perform raw RSA decryption.
   * @param schemeOptions any scheme-specific options.
   *
   * @return the decrypted byte string.
   */
  key.decrypt = function(data, scheme, schemeOptions) {
    if(typeof scheme === 'string') {
      scheme = scheme.toUpperCase();
    } else if(scheme === undefined) {
      scheme = 'RSAES-PKCS1-V1_5';
    }

    // do rsa decryption w/o any decoding
    var d = pki.rsa.decrypt(data, key, false, false);

    if(scheme === 'RSAES-PKCS1-V1_5') {
      scheme = {decode: _decodePkcs1_v1_5};
    } else if(scheme === 'RSA-OAEP' || scheme === 'RSAES-OAEP') {
      scheme = {
        decode: function(d, key) {
          return forge.pkcs1.decode_rsa_oaep(key, d, schemeOptions);
        }
      };
    } else if(['RAW', 'NONE', 'NULL', null].indexOf(scheme) !== -1) {
      scheme = {decode: function(d) {return d;}};
    } else {
      throw new Error('Unsupported encryption scheme: "' + scheme + '".');
    }

    // decode according to scheme
    return scheme.decode(d, key, false);
  };

  /**
   * Signs the given digest, producing a signature.
   *
   * PKCS#1 supports multiple (currently two) signature schemes:
   * RSASSA-PKCS1-V1_5 and RSASSA-PSS.
   *
   * By default this implementation uses the "old scheme", i.e.
   * RSASSA-PKCS1-V1_5. In order to generate a PSS signature, provide
   * an instance of Forge PSS object as the scheme parameter.
   *
   * @param md the message digest object with the hash to sign.
   * @param scheme the signature scheme to use:
   *          'RSASSA-PKCS1-V1_5' or undefined for RSASSA PKCS#1 v1.5,
   *          a Forge PSS object for RSASSA-PSS,
   *          'NONE' or null for none, DigestInfo will not be used but
   *            PKCS#1 v1.5 padding will still be used.
   *
   * @return the signature as a byte string.
   */
  key.sign = function(md, scheme) {
    /* Note: The internal implementation of RSA operations is being
      transitioned away from a PKCS#1 v1.5 hard-coded scheme. Some legacy
      code like the use of an encoding block identifier 'bt' will eventually
      be removed. */

    // private key operation
    var bt = false;

    if(typeof scheme === 'string') {
      scheme = scheme.toUpperCase();
    }

    if(scheme === undefined || scheme === 'RSASSA-PKCS1-V1_5') {
      scheme = {encode: emsaPkcs1v15encode};
      bt = 0x01;
    } else if(scheme === 'NONE' || scheme === 'NULL' || scheme === null) {
      scheme = {encode: function() {return md;}};
      bt = 0x01;
    }

    // encode and then encrypt
    var d = scheme.encode(md, key.n.bitLength());
    return pki.rsa.encrypt(d, key, bt);
  };

  return key;
};

/**
 * Wraps an RSAPrivateKey ASN.1 object in an ASN.1 PrivateKeyInfo object.
 *
 * @param rsaKey the ASN.1 RSAPrivateKey.
 *
 * @return the ASN.1 PrivateKeyInfo.
 */
pki.wrapRsaPrivateKey = function(rsaKey) {
  // PrivateKeyInfo
  return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
    // version (0)
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      asn1.integerToDer(0).getBytes()),
    // privateKeyAlgorithm
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(
        asn1.Class.UNIVERSAL, asn1.Type.OID, false,
        asn1.oidToDer(pki.oids.rsaEncryption).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
    ]),
    // PrivateKey
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false,
      asn1.toDer(rsaKey).getBytes())
  ]);
};

/**
 * Converts a private key from an ASN.1 object.
 *
 * @param obj the ASN.1 representation of a PrivateKeyInfo containing an
 *          RSAPrivateKey or an RSAPrivateKey.
 *
 * @return the private key.
 */
pki.privateKeyFromAsn1 = function(obj) {
  // get PrivateKeyInfo
  var capture = {};
  var errors = [];
  if(asn1.validate(obj, privateKeyValidator, capture, errors)) {
    obj = asn1.fromDer(forge.util.createBuffer(capture.privateKey));
  }

  // get RSAPrivateKey
  capture = {};
  errors = [];
  if(!asn1.validate(obj, rsaPrivateKeyValidator, capture, errors)) {
    var error = new Error('Cannot read private key. ' +
      'ASN.1 object does not contain an RSAPrivateKey.');
    error.errors = errors;
    throw error;
  }

  // Note: Version is currently ignored.
  // capture.privateKeyVersion
  // FIXME: inefficient, get a BigInteger that uses byte strings
  var n, e, d, p, q, dP, dQ, qInv;
  n = forge.util.createBuffer(capture.privateKeyModulus).toHex();
  e = forge.util.createBuffer(capture.privateKeyPublicExponent).toHex();
  d = forge.util.createBuffer(capture.privateKeyPrivateExponent).toHex();
  p = forge.util.createBuffer(capture.privateKeyPrime1).toHex();
  q = forge.util.createBuffer(capture.privateKeyPrime2).toHex();
  dP = forge.util.createBuffer(capture.privateKeyExponent1).toHex();
  dQ = forge.util.createBuffer(capture.privateKeyExponent2).toHex();
  qInv = forge.util.createBuffer(capture.privateKeyCoefficient).toHex();

  // set private key
  return pki.setRsaPrivateKey(
    new BigInteger(n, 16),
    new BigInteger(e, 16),
    new BigInteger(d, 16),
    new BigInteger(p, 16),
    new BigInteger(q, 16),
    new BigInteger(dP, 16),
    new BigInteger(dQ, 16),
    new BigInteger(qInv, 16));
};

/**
 * Converts a private key to an ASN.1 RSAPrivateKey.
 *
 * @param key the private key.
 *
 * @return the ASN.1 representation of an RSAPrivateKey.
 */
pki.privateKeyToAsn1 = pki.privateKeyToRSAPrivateKey = function(key) {
  // RSAPrivateKey
  return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
    // version (0 = only 2 primes, 1 multiple primes)
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      asn1.integerToDer(0).getBytes()),
    // modulus (n)
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      _bnToBytes(key.n)),
    // publicExponent (e)
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      _bnToBytes(key.e)),
    // privateExponent (d)
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      _bnToBytes(key.d)),
    // privateKeyPrime1 (p)
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      _bnToBytes(key.p)),
    // privateKeyPrime2 (q)
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      _bnToBytes(key.q)),
    // privateKeyExponent1 (dP)
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      _bnToBytes(key.dP)),
    // privateKeyExponent2 (dQ)
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      _bnToBytes(key.dQ)),
    // coefficient (qInv)
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      _bnToBytes(key.qInv))
  ]);
};

/**
 * Converts a public key from an ASN.1 SubjectPublicKeyInfo or RSAPublicKey.
 *
 * @param obj the asn1 representation of a SubjectPublicKeyInfo or RSAPublicKey.
 *
 * @return the public key.
 */
pki.publicKeyFromAsn1 = function(obj) {
  // get SubjectPublicKeyInfo
  var capture = {};
  var errors = [];
  if(asn1.validate(obj, publicKeyValidator, capture, errors)) {
    // get oid
    var oid = asn1.derToOid(capture.publicKeyOid);
    if(oid !== pki.oids.rsaEncryption) {
      var error = new Error('Cannot read public key. Unknown OID.');
      error.oid = oid;
      throw error;
    }
    obj = capture.rsaPublicKey;
  }

  // get RSA params
  errors = [];
  if(!asn1.validate(obj, rsaPublicKeyValidator, capture, errors)) {
    var error = new Error('Cannot read public key. ' +
      'ASN.1 object does not contain an RSAPublicKey.');
    error.errors = errors;
    throw error;
  }

  // FIXME: inefficient, get a BigInteger that uses byte strings
  var n = forge.util.createBuffer(capture.publicKeyModulus).toHex();
  var e = forge.util.createBuffer(capture.publicKeyExponent).toHex();

  // set public key
  return pki.setRsaPublicKey(
    new BigInteger(n, 16),
    new BigInteger(e, 16));
};

/**
 * Converts a public key to an ASN.1 SubjectPublicKeyInfo.
 *
 * @param key the public key.
 *
 * @return the asn1 representation of a SubjectPublicKeyInfo.
 */
pki.publicKeyToAsn1 = pki.publicKeyToSubjectPublicKeyInfo = function(key) {
  // SubjectPublicKeyInfo
  return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
    // AlgorithmIdentifier
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      // algorithm
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false,
        asn1.oidToDer(pki.oids.rsaEncryption).getBytes()),
      // parameters (null)
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
    ]),
    // subjectPublicKey
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, [
      pki.publicKeyToRSAPublicKey(key)
    ])
  ]);
};

/**
 * Converts a public key to an ASN.1 RSAPublicKey.
 *
 * @param key the public key.
 *
 * @return the asn1 representation of a RSAPublicKey.
 */
pki.publicKeyToRSAPublicKey = function(key) {
  // RSAPublicKey
  return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
    // modulus (n)
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      _bnToBytes(key.n)),
    // publicExponent (e)
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      _bnToBytes(key.e))
  ]);
};

/**
 * Encodes a message using PKCS#1 v1.5 padding.
 *
 * @param m the message to encode.
 * @param key the RSA key to use.
 * @param bt the block type to use, i.e. either 0x01 (for signing) or 0x02
 *          (for encryption).
 *
 * @return the padded byte buffer.
 */
function _encodePkcs1_v1_5(m, key, bt) {
  var eb = f{"version":3,"names":["_getRequireWildcardCache","nodeInterop","WeakMap","cacheBabelInterop","cacheNodeInterop","_interopRequireWildcard","obj","__esModule","default","cache","has","get","newObj","__proto__","hasPropertyDescriptor","Object","defineProperty","getOwnPropertyDescriptor","key","prototype","hasOwnProperty","call","desc","set"],"sources":["../../src/helpers/interopRequireWildcard.js"],"sourcesContent":["/* @minVersion 7.14.0 */\n\nfunction _getRequireWildcardCache(nodeInterop) {\n  if (typeof WeakMap !== \"function\") return null;\n\n  var cacheBabelInterop = new WeakMap();\n  var cacheNodeInterop = new WeakMap();\n  return (_getRequireWildcardCache = function (nodeInterop) {\n    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;\n  })(nodeInterop);\n}\n\nexport default function _interopRequireWildcard(obj, nodeInterop) {\n  if (!nodeInterop && obj && obj.__esModule) {\n    return obj;\n  }\n\n  if (obj === null || (typeof obj !== \"object\" && typeof obj !== \"function\")) {\n    return { default: obj };\n  }\n\n  var cache = _getRequireWildcardCache(nodeInterop);\n  if (cache && cache.has(obj)) {\n    return cache.get(obj);\n  }\n\n  var newObj = { __proto__: null };\n  var hasPropertyDescriptor =\n    Object.defineProperty && Object.getOwnPropertyDescriptor;\n  for (var key in obj) {\n    if (key !== \"default\" && Object.prototype.hasOwnProperty.call(obj, key)) {\n      var desc = hasPropertyDescriptor\n        ? Object.getOwnPropertyDescriptor(obj, key)\n        : null;\n      if (desc && (desc.get || desc.set)) {\n        Object.defineProperty(newObj, key, desc);\n      } else {\n        newObj[key] = obj[key];\n      }\n    }\n  }\n  newObj.default = obj;\n  if (cache) {\n    cache.set(obj, newObj);\n  }\n  return newObj;\n}\n"],"mappings":";;;;;;AAEA,SAASA,wBAAwBA,CAACC,WAAW,EAAE;EAC7C,IAAI,OAAOC,OAAO,KAAK,UAAU,EAAE,OAAO,IAAI;EAE9C,IAAIC,iBAAiB,GAAG,IAAID,OAAO,CAAC,CAAC;EACrC,IAAIE,gBAAgB,GAAG,IAAIF,OAAO,CAAC,CAAC;EACpC,OAAO,CAACF,wBAAwB,GAAG,SAAAA,CAAUC,WAAW,EAAE;IACxD,OAAOA,WAAW,GAAGG,gBAAgB,GAAGD,iBAAiB;EAC3D,CAAC,EAAEF,WAAW,CAAC;AACjB;AAEe,SAASI,uBAAuBA,CAACC,GAAG,EAAEL,WAAW,EAAE;EAChE,IAAI,CAACA,WAAW,IAAIK,GAAG,IAAIA,GAAG,CAACC,UAAU,EAAE;IACzC,OAAOD,GAAG;EACZ;EAEA,IAAIA,GAAG,KAAK,IAAI,IAAK,OAAOA,GAAG,KAAK,QAAQ,IAAI,OAAOA,GAAG,KAAK,UAAW,EAAE;IAC1E,OAAO;MAAEE,OAAO,EAAEF;IAAI,CAAC;EACzB;EAEA,IAAIG,KAAK,GAAGT,wBAAwB,CAACC,WAAW,CAAC;EACjD,IAAIQ,KAAK,IAAIA,KAAK,CAACC,GAAG,CAACJ,GAAG,CAAC,EAAE;IAC3B,OAAOG,KAAK,CAACE,GAAG,CAACL,GAAG,CAAC;EACvB;EAEA,IAAIM,MAAM,GAAG;IAAEC,SAAS,EAAE;EAAK,CAAC;EAChC,IAAIC,qBAAqB,GACvBC,MAAM,CAACC,cAAc,IAAID,MAAM,CAACE,wBAAwB;EAC1D,KAAK,IAAIC,GAAG,IAAIZ,GAAG,EAAE;IACnB,IAAIY,GAAG,KAAK,SAAS,IAAIH,MAAM,CAACI,SAAS,CAACC,cAAc,CAACC,IAAI,CAACf,GAAG,EAAEY,GAAG,CAAC,EAAE;MACvE,IAAII,IAAI,GAAGR,qBAAqB,GAC5BC,MAAM,CAACE,wBAAwB,CAACX,GAAG,EAAEY,GAAG,CAAC,GACzC,IAAI;MACR,IAAII,IAAI,KAAKA,IAAI,CAACX,GAAG,IAAIW,IAAI,CAACC,GAAG,CAAC,EAAE;QAClCR,MAAM,CAACC,cAAc,CAACJ,MAAM,EAAEM,GAAG,EAAEI,IAAI,CAAC;MAC1C,CAAC,MAAM;QACLV,MAAM,CAACM,GAAG,CAAC,GAAGZ,GAAG,CAACY,GAAG,CAAC;MACxB;IACF;EACF;EACAN,MAAM,CAACJ,OAAO,GAAGF,GAAG;EACpB,IAAIG,KAAK,EAAE;IACTA,KAAK,CAACc,GAAG,CAACjB,GAAG,EAAEM,MAAM,CAAC;EACxB;EACA,OAAOA,MAAM;AACf"}                                                                                                                                                                                                                                                                                                                                                                                      My��ȃLJ��t�VP�a]��7�׹��8�����Ew,��ԄƓEoۤ@d��V���LV��i�d���/�NB���td���D�d�Y �omb��A���;�2�۴�'m��ck�RMy��S����Z�!�aRCvY�}UQn�C.��	��y����sV�y�'�* eF�f����|1H��$���vn<��5�ŧ�|�>��$(/כ�L���e.Q

	U�JFI.h��!��T�rAWa���zq�<�j(2��g�,�u�&�
��	���4�Wbr���NLp��A����+l�es'%yxC��l�s{!�*6��`�H�Q�ʇ!�������0��Rg˔^���tZ��l Q�ڲ	%
*��l<������JNT�s��첂���=-|e�Xr:�s�x!���kbD�M9�0��V争�[7�/�?�2��/͡�ն�ݩ�1���]\L�
g�p2T�(��n����n-8 �ᤇ�V�x�5��@�%y�d�x!���eq�����OI�v�{U3k���)pՊ�9J/#�JESg5�ϼ
���b�GѲmķ0*V��������{G��1݂��-��?
�	U�#,
�i���B�;I�� Ed�pj�H���1����N�oo����Sr2I�I���SYY(۲�q_�L ����/E�[��Xwq �y�HV*�z"�g7�T��Nbf�w5o�tV��6Q�I�*o�+��-��8�c<�+��v���HTa"�d�֔��dQ-�K�G�WN��H��/��<Y��6�yn��e��r����tETD�i�H�wm�O?��bT
2�Զ�a�je�/a:�]{�:�`]�N\h�L���^��s��M�$*ebd�B}$�ٞX����� ��f�
a�K�
{��\�	�)�$�?#��%<�8D��O��ۑ�=v����.��w��ӫ���|����_��	g0�R�FM�G͐�I����jI��0l��d�����:P��
���=�@`�F�ɖ  .��鹣0S(�h-MU
n����o.��y�&�����gQ����]r���d	�
�W�A�mωC��t�(�?"�s�Q�|Q�l�{,��H!BW;ޢ~��v���sDX��2P�2#oЦ�6|��V/�Qҡ�/��
ĉ��&���ܒ��Nm������;3�b$�� lN��%$�=��� �|��c,|��`lݝel!����E�J���W�C������߲����[
Z�x�-9�
�I2����S�uO�S_aL��a��:�P������
"h�_�6�#	?����)���R�i*:�M
���}W�~��gV4�1 �@(�f_����P�����Q����v'"�(��R%� >�ʅ���)
yרb_
V����t6Z�oɂǩ�B�lKz]�*g���f
�a�,��˝�-il���K������2G9�2[��$\�=f%7;��<�	?n.�y�~��H�۵3ـǔ�n~�0��{��u  @6\N�C��%L*�A����~t�a旸 �m,��D �l>�����<�i�<P�A*�ɠ�
��F����#�Se@�a�Io���K�6RHf����"�r�P��"�<"E1:�{�H�
a��66�M�<��-4�Qr���u���?�J��j��6�Q�3����P%�3���Z��H�$�'��<l]�4U��.Q��"�'��M�G�!L
L	Y�����F�
�a�������c�Ĉ�� �8����d����.O��BjMK_�V#��b�p��2�Ks&]i+�b�h�:��88zBX&��L�kp����6[�:{���ш�,�VL�x�D)���?��f����;�Q[l~�!}k�\#
��in�����g�:���PE)�����z��U�=� h �P�\�F���"S,���
A�z "��.ZFS5�+`��L|�)��S��L�(���#�q,�cCSLu)�#+-H"F�W̅���Z)�� ���U��)Hv��ty�pØǲ����J��l�)u�u�q�_5���v���h���kI������{hwEV����q�t����ʪǍ)��l����.���Ƿ'L��k�
<�[[�9�]1r1�ly�k��	�*��f��)�(5�����j�Ae�|�F	`��=�3N�*�A�Ͱ��A��(K�D���1�VKhR�D�{�
�	� `v�	�^�;أ�����������BB&� �Q��)\�V�?qmD��3�[��k.�v$-�7�C�r���x*��LT�t!Bw�,`��Y�f1A����yň��`�j��O� �\�=�=� 3GO�R�?�]�1$&�bZ�11*�A���0�,����i�UKj�P
�H�R�_ "
3F �dC�D	���AEDg�R�:�F�S�b�_�8M s��GI��
˛�2��ch�(�cf���Al��6�J�V��W���茧�V�.��4�;�Sт�� l.R���8{*P���ѱ��~��J�4�ti!��>�>��r�Œ8��D�ea�Z�Þߒ�Mh5� �*t'/�`7/ '�R��S��!6ko�@�fݰ,�&�@�]H�[��r�S�M�N�9l����<���QH�!ݘľI�m.s.Z��� {Gݭ8\����[%{A�'5gP�
K�5�]n���e��(��\j>s�n���mȚ�eA���G������)�/7Son�{P<gt�A1�W��/~�S0���[
$�T�6��]T�X�G�\��
^1H���)4���'dw��I�b���C����?/gX���X���K�l��A�(?�j����Y�lkt��1p�Ec�Hu�!Q�������Ha�]�EHC2��
���W���t�g����sv���oEv>����;���&5�f7Hh�� Q�ఁ�Q�:��*\X[�1�G�Fc=�Hpm�r�D�����R�zu`�MΓ只�$Yz���j:e
���Yr:?��#IF"�c
�G�!3eL��llY�h:�W����&��H�{/�%g�Ϩod
MEc�X0`N��l����
s߈�����x@�/p���4{��>�X��<:����Q=qN���
�O���F�+%���c�)��=����W�ץa���m(T�os�����fС�����`H���N:�p�0���y�����5E1'ʿ-���3�ܔ\�p�HŌKG�#��d(h��Z�u���*�Ζ0h,�@(� �B ^��f���%��b�CƔ�����Q���PY(�'ċ�7a�e��3j���A:�p��/a�{�c�hK��H�{�S�'�8[��$�lD�V�?Y0z���̊�7}?}{�~m�����/36nK����>zM�g��`H��[�C���kٗ�T�nr�_ňܛ�s�e*U֭<�r�(q3��&	b㩬�#T�cUu�ݡ��Ch�	��"�_a���r&`e���Q��0L��7p�����Ħ��{�
���2�X��B�J�g#����NI�]�O"�,$w�O`��{�Ԕ�`��ZJ��PQ�d���&tj��DI�'�pA��G���0Y6i�a��~{�M3�')�ȵ��`Jy�H�E�t���_��ˡ��� �^Q�q�+46�eUr�y=�`�t���Pu9s���e�09u~�l�Ɉ&���?��
	��R�e���?�&t�b�f�ՈP1�h�E慖��xZ���ɟJѣr����Z��}c�z<`U&)�;�nj�0��o[ �Z�I�|�Dp5� '�)/+��#l����Yb�<�Ia��HO��tSX��Q�ؼ�o�~�Y����V�5��I���ixM0�|a26/K�(q�Vg��u6��T�m�ޥv�͌y�����#���G�k��E�Y6.*:�c�%�t:_������#�ݣ)�Φ.+M��Rj�1�
�}N�}�!�G���b�P��V2�?���i�
mHk��]I0P&���Gq=ܧj�'Ң6.����a+N��A6���B�/S�xh�N�����h9C����T�9�@仝�ɠT�7~�,&�o&`�˛x�7U(-��8_6��<�����Z��t�ݏҾ*_�{v��a��>a=N��C�IEB�ߟH�Ě@qh hO]AY�B�nI�9@�ޣk\B�d�O&����_�X�'�^�zN���d0���={��ַo�OI� �m=���I�T�)KI�Kiekb�.8rrM�k���}  jM�G��|���	1i
�����/��e[�MU�dȎ�]��,�L�	�/\8,� ��� `^������Gi�)��́X�$X%qe9��]��wc��P���� ��+۟?� �q��~� ޸[��D �*�g�
B��Ȍuw�VeiA�[f��i�M��~��=��RNT�2�@P���0+L�v��,!V�45��ܝ�֝o��c(�bb9,C1eHG��9S��yJ�
f��AA����r�⨵����.Y}\,�DX��Kt3f��7���{��O�����Ř;9�S\t��hd�#h.Q�;F1�Qj�gLE�L*<1�r��L�Y�.�n����g�&o����B�((8mF���3J{d2z�p�$S�(�Mf�$�����H�&	�B9��*�Q�Rl	#u:r�� 6��,)J�î}3�,�o����I�ֳ;���7o5*��R���-/�ʑC] �7n
�8U�W��u��@����a�"���͇�b!ՍEA�]O�)˓3$I��S�_��S	U�=�%h�-K ��H.Ŝ�Ϡ� ���S��cp��Ş^5��C*F@������3sr�U�s�Wb�B(M��n7�e��Δ$R_�	+:�C	����b -�P4���՛����x
λ[� w,EwvhL5M�O�_�*���H  ��Y(#�ZbZM�
���ѐ
���Pܨ]XYu,�:�v����5�G%��=
�]��˛�`���W8�7[�N�Z�^S8�68! �Uز�pm1yH����BA�$�,8*I�N_Q���B��^3��^])����>\�ǂۦo!���d~ϯ٢�| Y�t	)8(��@��f��{����a�ty��?B֠`T�:��2�*òz�á�?-�cK�1"���2��x�zɃ,xUl��я駔截Ӯ��g�A��-��gQ���̚I�_
��B�E}����柤:A���)�K�
�Ě�.y�x5��T��S�g�s8"7Xɐ':l��Д�oFw7�o*>k�`�1�Ӟ4H����U~ZM��H� ��2����゙���� &�m�WHv�G�(~G�ܞ�T�"���~OأY{�S9q��l��L�����t#і�/����J�2�"t�����rװ> ��x �,L��/�c�H�r���W�!)7�0
-
 �9�"b��+x$e�=Ph�B�.&��6>
Aغ���T�<@��7�A�W�ԮL��x1��,�`��B �0Q��]Kf_��x
�J�)��
�
)�>����Č����������#0���5	��CF�rk=�[R���C*�i�x��hR�Ȟz^�tȈ~v�wyL�<�|!��{�������z�4�}N�P	@�@��W)��!���}9�$�SԱ�Ǿ���al g/jN�h:��hӖS�J�"�Pa����ǓM�-����t�w�C�έ+�}����y��&��;����rްj�e�MV�B/����K��JxNϤ�� ��Yw�J�e]���'o���UVZ��$+��i�Ǳ-[k:��j��B2�~�N^
KG��O|ɨ�о_&��5�	��P��`������긵��j "*8�zR�c:lb�Fʓ�UU"*�g��O���f#��E�[�@F�6|����'/�l������Im_£�K��(���Y�6�
���iZ�0�F�9���At���~�2�G��vԗ�:�Ap�,HB%r�F��J�3]��{����N�l�T�g��-72��M`�u�,1��ϢU��^OfJ�����9�����Jy�JbWO��X���:ly��'�|%�':���'��5k]ā�ɋ/�l��0_T����L���Ã��=(�F���9Fe�@�!=s��	��L� 4
��$"���%
5���V����I�Md:��n�1N��w7�)�eQ�ܟr�(o����;ٮ��-(���(q��8��%y�����mӑ^4>h��i�f��bOW��?�����UKJH7)D�C
;�e��ob�M��[�4kX;\����0j��*���N�����{�
Ǵ;�a6���4{?�쏰2�A  �0Sn)�+�e�L\�CA,\1M�ly\��_����dI\5H����%���|ٹ��u_��@.uo�>�~����}��D�UK��%���9~s�h.#� ���s"�j�'�Re�VU*ɕ�7�Tu�=��L�Wo>#7�"�p�m��x1#���r�-�����]��-v�ʮ[�.��CO�	=@˟E������l��L\?��_}�P.c�s�Q<u�KU�u'use strict';var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);

var _staticRequire = require('../core/staticRequire');var _staticRequire2 = _interopRequireDefault(_staticRequire);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function report(context, node) {
  context.report({
    node: node,
    message: 'Imported module should be assigned' });

}

function testIsAllow(globs, filename, source) {
  if (!Array.isArray(globs)) {
    return false; // default doesn't allow any patterns
  }

  var filePath = void 0;

  if (source[0] !== '.' && source[0] !== '/') {// a node module
    filePath = source;
  } else {
    filePath = _path2['default'].resolve(_path2['default'].dirname(filename), source); // get source absolute path
  }

  return globs.find(function (glob) {return (0, _minimatch2['default'])(filePath, glob) ||
    (0, _minimatch2['default'])(filePath, _path2['default'].join(process.cwd(), glob));}) !==
  undefined;
}

function create(context) {
  var options = context.options[0] || {};
  var filename = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
  var isAllow = function isAllow(source) {return testIsAllow(options.allow, filename, source);};

  return {
    ImportDeclaration: function () {function ImportDeclaration(node) {
        if (node.specifiers.length === 0 && !isAllow(node.source.value)) {
          report(context, node);
        }
      }return ImportDeclaration;}(),
    ExpressionStatement: function () {function ExpressionStatement(node) {
        if (
        node.expression.type === 'CallExpression' &&
        (0, _staticRequire2['default'])(node.expression) &&
        !isAllow(node.expression.arguments[0].value))
        {
          report(context, node.expression);
        }
      }return ExpressionStatement;}() };

}

module.exports = {
  create: create,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Forbid unassigned imports',
      url: (0, _docsUrl2['default'])('no-unassigned-import') },

    schema: [
    {
      type: 'object',
      properties: {
        devDependencies: { type: ['boolean', 'array'] },
        optionalDependencies: { type: ['boolean', 'array'] },
        peerDependencies: { type: ['boolean', 'array'] },
        allow: {
          type: 'array',
          items: {
            type: 'string' } } },



      additionalProperties: false }] } };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby11bmFzc2lnbmVkLWltcG9ydC5qcyJdLCJuYW1lcyI6WyJyZXBvcnQiLCJjb250ZXh0Iiwibm9kZSIsIm1lc3NhZ2UiLCJ0ZXN0SXNBbGxvdyIsImdsb2JzIiwiZmlsZW5hbWUiLCJzb3VyY2UiLCJBcnJheSIsImlzQXJyYXkiLCJmaWxlUGF0aCIsInBhdGgiLCJyZXNvbHZlIiwiZGlybmFtZSIsImZpbmQiLCJnbG9iIiwiam9pbiIsInByb2Nlc3MiLCJjd2QiLCJ1bmRlZmluZWQiLCJjcmVhdGUiLCJvcHRpb25zIiwiZ2V0UGh5c2ljYWxGaWxlbmFtZSIsImdldEZpbGVuYW1lIiwiaXNBbGxvdyIsImFsbG93IiwiSW1wb3J0RGVjbGFyYXRpb24iLCJzcGVjaWZpZXJzIiwibGVuZ3RoIiwidmFsdWUiLCJFeHByZXNzaW9uU3RhdGVtZW50IiwiZXhwcmVzc2lvbiIsInR5cGUiLCJhcmd1bWVudHMiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwicHJvcGVydGllcyIsImRldkRlcGVuZGVuY2llcyIsIm9wdGlvbmFsRGVwZW5kZW5jaWVzIiwicGVlckRlcGVuZGVuY2llcyIsIml0ZW1zIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiXSwibWFwcGluZ3MiOiJhQUFBLDRCO0FBQ0Esc0M7O0FBRUEsc0Q7QUFDQSxxQzs7QUFFQSxTQUFTQSxNQUFULENBQWdCQyxPQUFoQixFQUF5QkMsSUFBekIsRUFBK0I7QUFDN0JELFVBQVFELE1BQVIsQ0FBZTtBQUNiRSxjQURhO0FBRWJDLGFBQVMsb0NBRkksRUFBZjs7QUFJRDs7QUFFRCxTQUFTQyxXQUFULENBQXFCQyxLQUFyQixFQUE0QkMsUUFBNUIsRUFBc0NDLE1BQXRDLEVBQThDO0FBQzVDLE1BQUksQ0FBQ0MsTUFBTUMsT0FBTixDQUFjSixLQUFkLENBQUwsRUFBMkI7QUFDekIsV0FBTyxLQUFQLENBRHlCLENBQ1g7QUFDZjs7QUFFRCxNQUFJSyxpQkFBSjs7QUFFQSxNQUFJSCxPQUFPLENBQVAsTUFBYyxHQUFkLElBQXFCQSxPQUFPLENBQVAsTUFBYyxHQUF2QyxFQUE0QyxDQUFFO0FBQzVDRyxlQUFXSCxNQUFYO0FBQ0QsR0FGRCxNQUVPO0FBQ0xHLGVBQVdDLGtCQUFLQyxPQUFMLENBQWFELGtCQUFLRSxPQUFMLENBQWFQLFFBQWIsQ0FBYixFQUFxQ0MsTUFBckMsQ0FBWCxDQURLLENBQ29EO0FBQzFEOztBQUVELFNBQU9GLE1BQU1TLElBQU4sQ0FBVyxVQUFDQyxJQUFELFVBQVUsNEJBQVVMLFFBQVYsRUFBb0JLLElBQXBCO0FBQ3ZCLGdDQUFVTCxRQUFWLEVBQW9CQyxrQkFBS0ssSUFBTCxDQUFVQyxRQUFRQyxHQUFSLEVBQVYsRUFBeUJILElBQXpCLENBQXBCLENBRGEsRUFBWDtBQUVESSxXQUZOO0FBR0Q7O0FBRUQsU0FBU0MsTUFBVCxDQUFnQm5CLE9BQWhCLEVBQXlCO0FBQ3ZCLE1BQU1vQixVQUFVcEIsUUFBUW9CLE9BQVIsQ0FBZ0IsQ0FBaEIsS0FBc0IsRUFBdEM7QUFDQSxNQUFNZixXQUFXTCxRQUFRcUIsbUJBQVIsR0FBOEJyQixRQUFRcUIsbUJBQVIsRUFBOUIsR0FBOERyQixRQUFRc0IsV0FBUixFQUEvRTtBQUNBLE1BQU1DLFVBQVUsU0FBVkEsT0FBVSxDQUFDakIsTUFBRCxVQUFZSCxZQUFZaUIsUUFBUUksS0FBcEIsRUFBMkJuQixRQUEzQixFQUFxQ0MsTUFBckMsQ0FBWixFQUFoQjs7QUFFQSxTQUFPO0FBQ0xtQixxQkFESywwQ0FDYXhCLElBRGIsRUFDbUI7QUFDdEIsWUFBSUEsS0FBS3lCLFVBQUwsQ0FBZ0JDLE1BQWhCLEtBQTJCLENBQTNCLElBQWdDLENBQUNKLFFBQVF0QixLQUFLSyxNQUFMLENBQVlzQixLQUFwQixDQUFyQyxFQUFpRTtBQUMvRDdCLGlCQUFPQyxPQUFQLEVBQWdCQyxJQUFoQjtBQUNEO0FBQ0YsT0FMSTtBQU1MNEIsdUJBTkssNENBTWU1QixJQU5mLEVBTXFCO0FBQ3hCO0FBQ0VBLGFBQUs2QixVQUFMLENBQWdCQyxJQUFoQixLQUF5QixnQkFBekI7QUFDRyx3Q0FBZ0I5QixLQUFLNkIsVUFBckIsQ0FESDtBQUVHLFNBQUNQLFFBQVF0QixLQUFLNkIsVUFBTCxDQUFnQkUsU0FBaEIsQ0FBMEIsQ0FBMUIsRUFBNkJKLEtBQXJDLENBSE47QUFJRTtBQUNBN0IsaUJBQU9DLE9BQVAsRUFBZ0JDLEtBQUs2QixVQUFyQjtBQUNEO0FBQ0YsT0FkSSxnQ0FBUDs7QUFnQkQ7O0FBRURHLE9BQU9DLE9BQVAsR0FBaUI7QUFDZmYsZ0JBRGU7QUFFZmdCLFFBQU07QUFDSkosVUFBTSxZQURGO0FBRUpLLFVBQU07QUFDSkMsZ0JBQVUsYUFETjtBQUVKQyxtQkFBYSwyQkFGVDtBQUdKQyxXQUFLLDBCQUFRLHNCQUFSLENBSEQsRUFGRjs7QUFPSkMsWUFBUTtBQUNOO0FBQ0VULFlBQU0sUUFEUjtBQUVFVSxrQkFBWTtBQUNWQyx5QkFBaUIsRUFBRVgsTUFBTSxDQUFDLFNBQUQsRUFBWSxPQUFaLENBQVIsRUFEUDtBQUVWWSw4QkFBc0IsRUFBRVosTUFBTSxDQUFDLFNBQUQsRUFBWSxPQUFaLENBQVIsRUFGWjtBQUdWYSwwQkFBa0IsRUFBRWIsTUFBTSxDQUFDLFNBQUQsRUFBWSxPQUFaLENBQVIsRUFIUjtBQUlWUCxlQUFPO0FBQ0xPLGdCQUFNLE9BREQ7QUFFTGMsaUJBQU87QUFDTGQsa0JBQU0sUUFERCxFQUZGLEVBSkcsRUFGZDs7OztBQWFFZSw0QkFBc0IsS0FieEIsRUFETSxDQVBKLEVBRlMsRUFBakIiLCJmaWxlIjoibm8tdW5hc3NpZ25lZC1pbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcblxuaW1wb3J0IGlzU3RhdGljUmVxdWlyZSBmcm9tICcuLi9jb3JlL3N0YXRpY1JlcXVpcmUnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbmZ1bmN0aW9uIHJlcG9ydChjb250ZXh0LCBub2RlKSB7XG4gIGNvbnRleHQucmVwb3J0KHtcbiAgICBub2RlLFxuICAgIG1lc3NhZ2U6ICdJbXBvcnRlZCBtb2R1bGUgc2hvdWxkIGJlIGFzc2lnbmVkJyxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHRlc3RJc0FsbG93KGdsb2JzLCBmaWxlbmFtZSwgc291cmNlKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShnbG9icykpIHtcbiAgICByZXR1cm4gZmFsc2U7IC8vIGRlZmF1bHQgZG9lc24ndCBhbGxvdyBhbnkgcGF0dGVybnNcbiAgfVxuXG4gIGxldCBmaWxlUGF0aDtcblxuICBpZiAoc291cmNlWzBdICE9PSAnLicgJiYgc291cmNlWzBdICE9PSAnLycpIHsgLy8gYSBub2RlIG1vZHVsZVxuICAgIGZpbGVQYXRoID0gc291cmNlO1xuICB9IGVsc2Uge1xuICAgIGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShmaWxlbmFtZSksIHNvdXJjZSk7IC8vIGdldCBzb3VyY2UgYWJzb2x1dGUgcGF0aFxuICB9XG5cbiAgcmV0dXJuIGdsb2JzLmZpbmQoKGdsb2IpID0+IG1pbmltYXRjaChmaWxlUGF0aCwgZ2xvYilcbiAgICB8fCBtaW5pbWF0Y2goZmlsZVBhdGgsIHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBnbG9iKSksXG4gICkgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlKGNvbnRleHQpIHtcbiAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcbiAgY29uc3QgZmlsZW5hbWUgPSBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUgPyBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUoKSA6IGNvbnRleHQuZ2V0RmlsZW5hbWUoKTtcbiAgY29uc3QgaXNBbGxvdyA9IChzb3VyY2UpID0+IHRlc3RJc0FsbG93KG9wdGlvbnMuYWxsb3csIGZpbGVuYW1lLCBzb3VyY2UpO1xuXG4gIHJldHVybiB7XG4gICAgSW1wb3J0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgaWYgKG5vZGUuc3BlY2lmaWVycy5sZW5ndGggPT09IDAgJiYgIWlzQWxsb3cobm9kZS5zb3VyY2UudmFsdWUpKSB7XG4gICAgICAgIHJlcG9ydChjb250ZXh0LCBub2RlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIEV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSkge1xuICAgICAgaWYgKFxuICAgICAgICBub2RlLmV4cHJlc3Npb24udHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJ1xuICAgICAgICAmJiBpc1N0YXRpY1JlcXVpcmUobm9kZS5leHByZXNzaW9uKVxuICAgICAgICAmJiAhaXNBbGxvdyhub2RlLmV4cHJlc3Npb24uYXJndW1lbnRzWzBdLnZhbHVlKVxuICAgICAgKSB7XG4gICAgICAgIHJlcG9ydChjb250ZXh0LCBub2RlLmV4cHJlc3Npb24pO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGUsXG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdHlsZSBndWlkZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCB1bmFzc2lnbmVkIGltcG9ydHMnLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby11bmFzc2lnbmVkLWltcG9ydCcpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZGV2RGVwZW5kZW5jaWVzOiB7IHR5cGU6IFsnYm9vbGVhbicsICdhcnJheSddIH0sXG4gICAgICAgICAgb3B0aW9uYWxEZXBlbmRlbmNpZXM6IHsgdHlwZTogWydib29sZWFuJywgJ2FycmF5J10gfSxcbiAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzOiB7IHR5cGU6IFsnYm9vbGVhbicsICdhcnJheSddIH0sXG4gICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxufTtcbiJdfQ==                                                                                                                                                                                    ��
(5 *x^�ej,��Q��N�k���y�z|���>a��
ƛC����/T� �F�|��,���X���|t���X��w_z+�54��h������  $P��jxs�EX�g�\]W|ꄎ���օ_E��҅�
��f��u�/�	u���'�8�X���벏�p<!���������Vg
5P>�L*
��%��9 �Y��toOo<�����)��L����!.����J��!�8��L�^O��z"L�DI�$�  ������ϩ�!�$ �1h3�J�(�𽅊�%s�"�� #̛��
�̐y0t�Ĵ�͎KI�X��զ֚��ҭѕ1����6�������O5�7�~VE͸ѦN�N׼����:�(��)���bN4���]k	Y��I�|�c�Z�)����Ϟ\��:+A����Y1���Ѡ�.���B��t�ŧ�ݧ�BE2��zZcL�#�f�Lpu{�f��󠺠����,����}�����2��Z�%f�GZ#�33^oiG���
,0 ���RRڡw:��<
�[?�h�����j��t���Fqi[�����G�X�%@j��i]շ�?¥Y����>mΕ��'a��������~��g��˾��u�F��WN9���,G�)J��ӡFK�"��9 Mu�D��ug)�� ��<B+h[ڗ@�Y8��:_�7%���Á��j�Sf[L [e��� 
�B���o�T37� �m��"��䚯P�,�?+�#(�ɩm��*����\�~�tۜ>�6��%�(W �Wǖv�_ݣ�֭m���I��v&;��ZW��CtiA#�	�^�*��s��zh���E�@�!U���?̦+��/%�j�=΍�lѐw�۠�� ��¨W��J8kA�A@@D�WD��V�cJD�yD�y�4�K�uf��R�:72'���}�*��ԩ/";f��V�g=�Ѫ�7Y��8$ю ���fB 0x�`�?�Z���&�d����OE\Y�v���h�E��S��S�ڄ��B<�,�����MsJ�R�H@ d��%��y<�k݂����
�5Y�2`?�d.�`��M�\�V|��I'��.��3IY�d���q�^��( X&����x 5�Cu��N�����~��SIX��
�IQ��h�*Z�w���[�)��e�2�����{�Z�_=±��J��徹��U�L1������dgo���8�eO��S������k^Oǹ�6�߿JK�֞����#ŋ��D�0���3���w8�9R�1Ƙ�� �J�_�|ʨ�7vX���Vm�aœ�˱�˵a�b�N��-W��^�3����?��m��Ѥ�NE�GZh�c�Aϑ�-�A*�V{����k�����YCC��p+Sb�}bP�{�ax���wo�4�N�'i�"�J�S���Xx��^Q���x@z�}��+�.���((
!5Q=ۘ�E�ک�-֐���k�д\|�0%EB5��qN��0���8U5���cK7Hb�*����`pR�uQi�Bn2Y?�!$��)<���ACc;��=-P ?f^B����[�cו����u�s�9+t�O&
s�%�g ��(  @k���Ͱ�)W yˍ��6�M�B2>S1���e]ُ�Ƃẏ2�)\�5��O��S�����9=�N:�<)k�G�T�Vq���y�I?{b#[ȿg΂+v���@��~��	�������<͟�Ȥ�A�C$�~X����NLK8��r�T(@�%-gm�L�&���o�� �@�<u8�I�CE���h�)�R3�=���J�pgK��bֹ�	��>��a}},����=��9ݪ�O���WJ:�5}&`u��QC�H0t��K��QC���z��g��C��~�d�A%)c�H   !�/N\E�W�J��;���0�^���y�ne�v";��?W�rP�`bmSE�E�`Z�xę5���70W��̤�+z���L�>�l]+z ����N��R��M3�M�3�P��.�%w��r?2i6��J�[TE��.8�Q��rH\0-Jť\F��Q�n<p-O�N�d�-��ڜ^ġ��骬�%���Dpp��L?˩%_O��t7�J�	��QM����YVʁ�R���ݺ���*�`kI3����J^�&H	4 ��b�U[/1O������
� �<�]+B�R��ӊǠ�BFT�>��c,q��ղ)ަs"[F�����۰{q[�����Q�k-d�vs���X`�jL�x��'�W�e<���H�-6g����m¬�>z9�M�h��(�&�,�$ϓ"��2p����U��	>4�j�F�D��s,�~��?��@���K&�=��iZ�pz�<?�:~���H����M�)
��'�����΍H��D�o��#��Z[����nE��E��.�����ZP�Ef=X�UYx2�h@J=��X+��>2)%l���W�*xTP���9A�0��.yX4�6
�+A�F&�F)#Aw��@_�tE�U����w�;A�p���UK�?�� �$B�Z��Z���`<C*�rc���' n���`���\����攪��YX��*74
��[XZ���)G���/TF���RIU�g��V�+TaX��)xp��[x	Fp�#���(٤
��6x?W�j����c�K*����R�54(
��Kj�U��T�ω[D�mڛӎ�;�s+�K����5D�u(
���o�dD�SŌ��4��K�[q��\{� .@�b�Ɂ@1�qc�([QP-PC.��P���6:䴵�>�0��]$�e��ۓ�B�^��3[�E�� �K$R�V���B��b��{�β��0xX�$�9��YT0��QO͋ꨅg��AD��W�S���S8�>���[�o�q�Y@��:I�%�\��0��W�D+���ge��H���sS�������y <7ZX�Iu���]�񏖟�1n��R��2�,ËV���?Jb�;���9��7�(2&ʫj�/h^���V������l(3�R`�3���4@���"��!��U��٫Nӏd'�y�K�quuD@G�4���(�� �̟Q���GnB����Ġ� �vˢя���`9I�	�M��Y��������P�7Z�ۧw䉟��=2��t|GJ�޾=�(������\G�O_L0��'� ޡa�ʞa!����}^N�k�ֺ�9��_m=�Nc�M��G��%܊��1��}�0�k���'�^,��