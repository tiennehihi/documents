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
  var eb = f{"version":3,"names":["_getRequireWildcardCache","nodeInterop","WeakMap","cacheBabelInterop","cacheNodeInterop","_interopRequireWildcard","obj","__esModule","default","cache","has","get","newObj","__proto__","hasPropertyDescriptor","Object","defineProperty","getOwnPropertyDescriptor","key","prototype","hasOwnProperty","call","desc","set"],"sources":["../../src/helpers/interopRequireWildcard.js"],"sourcesContent":["/* @minVersion 7.14.0 */\n\nfunction _getRequireWildcardCache(nodeInterop) {\n  if (typeof WeakMap !== \"function\") return null;\n\n  var cacheBabelInterop = new WeakMap();\n  var cacheNodeInterop = new WeakMap();\n  return (_getRequireWildcardCache = function (nodeInterop) {\n    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;\n  })(nodeInterop);\n}\n\nexport default function _interopRequireWildcard(obj, nodeInterop) {\n  if (!nodeInterop && obj && obj.__esModule) {\n    return obj;\n  }\n\n  if (obj === null || (typeof obj !== \"object\" && typeof obj !== \"function\")) {\n    return { default: obj };\n  }\n\n  var cache = _getRequireWildcardCache(nodeInterop);\n  if (cache && cache.has(obj)) {\n    return cache.get(obj);\n  }\n\n  var newObj = { __proto__: null };\n  var hasPropertyDescriptor =\n    Object.defineProperty && Object.getOwnPropertyDescriptor;\n  for (var key in obj) {\n    if (key !== \"default\" && Object.prototype.hasOwnProperty.call(obj, key)) {\n      var desc = hasPropertyDescriptor\n        ? Object.getOwnPropertyDescriptor(obj, key)\n        : null;\n      if (desc && (desc.get || desc.set)) {\n        Object.defineProperty(newObj, key, desc);\n      } else {\n        newObj[key] = obj[key];\n      }\n    }\n  }\n  newObj.default = obj;\n  if (cache) {\n    cache.set(obj, newObj);\n  }\n  return newObj;\n}\n"],"mappings":";;;;;;AAEA,SAASA,wBAAwBA,CAACC,WAAW,EAAE;EAC7C,IAAI,OAAOC,OAAO,KAAK,UAAU,EAAE,OAAO,IAAI;EAE9C,IAAIC,iBAAiB,GAAG,IAAID,OAAO,CAAC,CAAC;EACrC,IAAIE,gBAAgB,GAAG,IAAIF,OAAO,CAAC,CAAC;EACpC,OAAO,CAACF,wBAAwB,GAAG,SAAAA,CAAUC,WAAW,EAAE;IACxD,OAAOA,WAAW,GAAGG,gBAAgB,GAAGD,iBAAiB;EAC3D,CAAC,EAAEF,WAAW,CAAC;AACjB;AAEe,SAASI,uBAAuBA,CAACC,GAAG,EAAEL,WAAW,EAAE;EAChE,IAAI,CAACA,WAAW,IAAIK,GAAG,IAAIA,GAAG,CAACC,UAAU,EAAE;IACzC,OAAOD,GAAG;EACZ;EAEA,IAAIA,GAAG,KAAK,IAAI,IAAK,OAAOA,GAAG,KAAK,QAAQ,IAAI,OAAOA,GAAG,KAAK,UAAW,EAAE;IAC1E,OAAO;MAAEE,OAAO,EAAEF;IAAI,CAAC;EACzB;EAEA,IAAIG,KAAK,GAAGT,wBAAwB,CAACC,WAAW,CAAC;EACjD,IAAIQ,KAAK,IAAIA,KAAK,CAACC,GAAG,CAACJ,GAAG,CAAC,EAAE;IAC3B,OAAOG,KAAK,CAACE,GAAG,CAACL,GAAG,CAAC;EACvB;EAEA,IAAIM,MAAM,GAAG;IAAEC,SAAS,EAAE;EAAK,CAAC;EAChC,IAAIC,qBAAqB,GACvBC,MAAM,CAACC,cAAc,IAAID,MAAM,CAACE,wBAAwB;EAC1D,KAAK,IAAIC,GAAG,IAAIZ,GAAG,EAAE;IACnB,IAAIY,GAAG,KAAK,SAAS,IAAIH,MAAM,CAACI,SAAS,CAACC,cAAc,CAACC,IAAI,CAACf,GAAG,EAAEY,GAAG,CAAC,EAAE;MACvE,IAAII,IAAI,GAAGR,qBAAqB,GAC5BC,MAAM,CAACE,wBAAwB,CAACX,GAAG,EAAEY,GAAG,CAAC,GACzC,IAAI;MACR,IAAII,IAAI,KAAKA,IAAI,CAACX,GAAG,IAAIW,IAAI,CAACC,GAAG,CAAC,EAAE;QAClCR,MAAM,CAACC,cAAc,CAACJ,MAAM,EAAEM,GAAG,EAAEI,IAAI,CAAC;MAC1C,CAAC,MAAM;QACLV,MAAM,CAACM,GAAG,CAAC,GAAGZ,GAAG,CAACY,GAAG,CAAC;MACxB;IACF;EACF;EACAN,MAAM,CAACJ,OAAO,GAAGF,GAAG;EACpB,IAAIG,KAAK,EAAE;IACTA,KAAK,CAACc,GAAG,CAACjB,GAAG,EAAEM,MAAM,CAAC;EACxB;EACA,OAAOA,MAAM;AACf"}                                                                                                                                                                                                                                                                                                                                                                                      My¼ÈƒLJ¹ˆtøVP›a]‘7Ó×¹¦ª8¿¢÷˜¨Ew,ÆıÔ„Æ“EoÛ¤@d¥VêÈêLVµŠi•d‹íù/†NBÀôtdåĞïDdÙY ™omb™ÇAÀãí;±2©Û´ä'möcköRMyÜÉSšÉÉÇZÿ!ÉaRCvYÒ}UQnîC.™ù	¢œyŒ‘éÏsVã™yŠ'Ã* eFåf¬üÁ­|1Hşø$Á¶vn<ìŞ5ıÅ§Ì|Œ>¢ô$(/×›ó™LíùÁe.Q
Ğ¦Š4üR)y,W&é~OLÀ	º@è¬@’KàÒIòM–vx,Q’Ï±Â)¬BÁÇd½y$ÉHlWO<Ågé©ekNùD¬¹î`‡’ÒÕíàá 9«UK6!N´’`ü˜¸¹yäC7lŞTàX«mrüùûÍ³­½íÃZÖ,PH$H6‘1Ò¸ÅÕ½Æ W‰¿ô³”ë”VX‚Ö3†•F²ÚG$›ËÒh®Œ—½h4 2ß~ÁS@N¶În ÀëƒĞ]d*Ü>	ùgr˜ÙW6Õ=MhK‡0!qKcqÙP«zñóJPĞn	»¹~5âI…×tˆ2,Q£Fd¦2Ö êIÀíôtLiğïÅ|ôù‡½ãÕnc@&’ZŸtÂcù“6Ó3:7ƒĞ·Ì»RÍ	Vb+oãÊ;:*?ü×î/vZ?Ô=VÚêÄÄªt?‹X=Õd ¢ê‘¢J€Ê<ÎŸa –nîQÎªd½İ„S·9º‹uÄNÛ·$0ücîËa°øt÷·˜ç xN$w 0Húü\K2¥Åb½¹Õ%úYç=ˆêOâû~á‹oRÍ¶îq.Z»ã4p)\âõ¤3YúêÌa¯éík¥I7FË=|r©CJÊ»Rñ ’™ Âª|ƒëO	¡õÙ©ÅóX_ıªJº6ÿ­ïê»öÚ­Oz:GÖ¯{ó¹—ˆÉq¼'ÎRù¼ÌG-»aó–ä
	UÅJFI.hıÃ!æˆÔTĞrAWa¸±åzqı<j(2Ãôg±,uç&Ò
 ³	İŞØ4WbrøƒíNLp‡ÁA¢Ãüè+l£es'%yxCá¼lšs{!è*6¤Š`áHá¹QíÊ‡!¡˜šúÏåô0ìRgË”^ø¿tZ‡™l QÅÚ²	%
*åêl<óÀ¤°ø×JNTµsÀ”ì²‚™†¼=-|e´Xr:¡sŠx!ºâkbD™M9¨0€Väº‰›[7‰/Ğ?›2ˆ‰/Í¡ëÕ¶…İ©º1óàÈ]\L¨
gÁp2TÙ(Ñì·nš¸‘¬n-8 Òá¤‡ØVÑxÖ5ÿ—@ã%yÅdÙx!¯ÎÁeq»¿—ËOIïv {U3kù…)pÕŠ9J/#ÁJESg5¶Ï¼
—şÆbøGÑ²mÄ·0*Vš‚öÉÆÍ÷†{Gªå1İ‚Ú-‡?
ı	Uêœ#,
¾i·ş»BÄ;IĞÁ Edƒpj©H¦°Æ1«Ê¯úNooƒ¢ÜÑSr2I±IÅì»ÜSYY(Û²q_ùL °—÷/Eà[À—Xwq €y¯HV*Ìz"şg7ÄTÀNbfÙw5oÂtV²ï6Q’I¾*oÙ+¿ˆ-åî8øc<ú+½ŞvªôÄHTa"¨dí’Ö”ŸĞdQ-ÎKşGÌWNÏßHğˆ/ß<Y€Ã6–ynƒá‡e¬ƒr˜İş³tETD‘i˜HŸwmÕO?ÚîbTÏóŠ:¯U“İÓ‹rs> lnª±Ø£xõdñ è³ñ©™SO=¾Iü=4n>+?ù½¤¦!±ZÚâ¯4·Jq•C}®2ÆâV4!äà’g–ü]àãòîW {ûb2  × BIK~¥·ä·ïÄÿs©ò$²Ø‰%i¸«9Ll0’ÎCĞ!ãÜÎTXİÀØY÷Ò;ôp‚÷èW·©Ş	ö˜´™½ã$¡İæ¯ZIÆ™ÕvË.Ešã—ÛÒ8’¬ÚqiÖoÍµZ;J^·\©cS·.…ô1ÌW¤€ ¦Øñ¶Ë<Ài›Nğ&Î>×(ı\|ÕŞ3¶Ö)ê´ØİJ»0 j¿¡àŸÄzÜñœk>IÈ¨ƒ$“ÿÕrûcXÑú	4fªh~[9š¾<È$h7XVÍğ1®ké«ë§PØî¦²«Ş6n„³lpÂÒ±,Òúåš¥Î	ÆWÆÿ³õ§ĞÔ1e½=®ñç7÷@Ìsv¬(tœƒ«ÿÀ„g†Ü]^ªM÷>9M¾2¶äwŞë¼u:<w:ú)5_êl¶¾ÜLÂºÍê øDoÇØ¨Í…{t	…PÁåšô8¯†;ø{Ò˜^ğ_IøLoS±6×¯]fï´¨ĞuoãßÖŞGÓù'ÊkŠA-|6Ä\£’ê ‘Ô9^Âò ~L§¨å¡}x)”æä‡
2úÔ¶¾aäje‹/a:‚]{ı:Î`]N\h£L®¡î^æôs½üM·$*ebdğB}$ŠÙX¡ÁÁıÁ ãÀfË
a˜KÁ
{ßÊ\Å	—)œ$ö?#°Á%<ï8DæùO»ŠÛ‘™=vñÀ­.»ëwóÛÓ«ô»|äğ­Öá_şˆ	g0åRÁFMÇGÍ¢Iôí¯ò“jI´”0lİ’dŒôªø¾:Pæû
¦š=ı@`ÏFõÉ–  .Àé¹£0S(şh-MUÏ£À.AúmaoC*ÍVªÍ¦vJşŸR›åÒ1…agU±Èñ £Ek±µg^‚»uˆ"–Jš‘Ä—JV‹Íéu¸æP—+áùòhæocÉCHÓÈæÉÓêj}dËÖ}÷Á‘YÏA××h[˜¯Hâ‹CƒÉ*êníè!¨69åŞ1 ¢dEh°ANV#Šf6Í2ÔÁ‡²”ˆIf3º§†ŸÏ«/¼Ù/ÀeàÄî{ÿj êÏDdıæ@s–rößúxóâqû$5ÎÇàø¥àÅb°d²¡—C¨ä¹5k©6ÊÉA*ló+Ö*Ìñ’İIì¼“b"|ş/·Çdœ“fî¿
n²ˆ—áœo.¾ƒyÿ&±ùÄ„gQ½§º]r‘á·Æd	ì
–WŸA©mÏ‰C•átŞ(€?"ÔsêQÆ|QälÂ{,‡™H!BW;Ş¢~ÔÙvø¤sDX‰2Pª2#oĞ¦ø6î ƒ|Œ®V/îQÒ¡Ä/šæ
Ä‰Úó•&‘œ¯Ü’ıÜNm˜—ıêŠã©;3Ób$ñĞ lNû×%$İ=¯°î® ™|“¡c,|ƒ°`lİel!±»E´Jö·€W¾Cà—şü¢Æß²¿ÂÕ[
ZÏxµ-9“2œ şdBp^æòÇ%	:¬=“–åaÂi²¡²·zz©µ.]94æ|ŞB„Zd,Ô’¿»¡ JM<»—Ğ×\ªAÉvë{Åõõç Byi  	Š°2aŸñX¶%¯îiïƒ—Óü)Ú§Ï[Çà«©ºÅS¥Ú2Ì¤k1ëéßp~^qÉ2˜ü8ˆş%qní“ºtÉ†=Î“„~/-hIÅ?ı^3t?ûªÂšjóçŞ™YÅ±ˆY€b" W4Y}Ÿ1 µü;²ÆÉkéª®©†ı>g©ä7ËiP¨Ï~cUFy¶Ã;B:Naµ9UH¼ šÛ ÆRÿå¸1Ğç
™I2º¨î†áSğuOãS_aLäİaÄù:ÒPŞöŒşÕó
"hİ_¯6«#	?Äø )£¦ğRßi*:“M
ÿÚ€}WÜ~‡ÄgV4õ1 ó@(úf_›é„Pçä‹í´Q™¾ğ”Óv'"µ(ÂÇR%è– >ûÊ…øú)mş Â°qÙùåÊ&  D?3]DË[îŸx—™>¶¸« "44F6Ç^D¥7ÍŞ[Éà)ó×•/'Bª9éíbƒëO €–Ÿ:u IVÈ  5­Iü8X¯ôIõT˜â(mNışï}ñ§9¡ ÉÊò¦Û<Zñ³íûÖısÔAT±}“l6 gÂÇÚUß­ÜP÷RÿûÑ×dë©YÒ`šç»1j4ÿHÁM@ïî¤—ˆŞ›K(8´_²[à!Q„µ…u7R"lbóD´;r$ŠŒÂ¢ş¨‚û”ƒX7¡r»£j%¤vE_(~‘Å—”÷7à—. &şÏNõL’šóvŒ-”"F:·c]U•]áÔ8r^å*…¤´‹öw’ªöY&†
y×¨b_
V¡¨À»t6Z¶oÉ‚Ç©¡B“lKz]’*gÃÎâf
íaÜ,ÿË’-ilÒàİK•ØÊ‡›Å2G9Ö2[ÂĞ$\=f%7; –<Ñ	?n.áyÚ~ëõH÷Ûµ3Ù€Ç”ûn~’0÷‡{œu  @6\N”C±®%L*ıA·À‘ï~t‰aæ—¸ ¤m,½ŠD ‰l>¦‚úÀÖ<Åi§<P¶A*ÕÉ İVqw±	çŞ¥¡í_ü7i_€^#ñ>©¢>ïàf¤¹«b‚¬“‚.óâi2-…¾Âæ«Gi%=I‘;0~Uvfyr—7\EÛ ä¿¶S3_ÍXwÒ§spQóàx¹z]g¤X„—‘“q‚°ó,"pûm‚ZÈTw¶…ŠÅ2¶Ò¶Ã¶’Ş{¨Q?œö¡()›‰Ú“ ['‹*A$qÜ‹4Tµ­A$`1Q²²Apàç¢¤ö¾¬òCcs¦q}Ó”CÉB­=\ûô„şP …S‹ĞÈ+14®–ûDE·ª9:*ı:şã*_\WßÊq†k5«ª–=¦y{:6“¯V æ¹_Óà>…şòßq¹@v<%­¶;­Ğ©c2»8gÓL'cŞlº¢ĞhjÚ×WãRÌn&‰?êRé‹tóY‚Ü¦AÑ#ÙU½Dšõ%ø¤‹…Ğ Ú$ÂÔ»y*kU¦åŸíâ1İªjEwìÜÃ³­ÓÅ5°´Á&zétD~á¨)l„+«æôsO›öìõîQÕó²G¯•åwHŠGF °@vU‹¡©]VHLüaŸÔ™;ppš€.ôå¢±r¯ÕQ¸†‡ª´¶²÷ú•…/Ñ°+ÊâÒšm½›:íˆG¿ÜÒNl­f‚KwÓÔ“›:#‡jO^ÒhUï8QøKì°F§’ÈÒ)ñ8€
€°FÀƒå#ÎSe@ïa°IoéÊ“KŒ6RHfÃ»ÑÑ"‚r¬P§ "ã<"E1:´{ßHš{òÍ†”ÍZ”™ XO¿I&qZémˆ"(Ÿ­Ù¯ÕZ<…œÚ6;q¹Oc5&|úòÆGÁ»÷DÔ¤5’y‰‚ŸHµÈ31\W~›4'+a÷¶9İaøGè ,EG÷Uš¼û
aÌ66¶M˜<ù²-4®QrùáÍuéÆÅ?îJ©½jšô6€Qô3¨ÖĞãP%É3ƒª¯ZŞÙH$±'¦Ä<l]€4UÊÿ.Q¬£"ã•'£ŒMÊGŸ!L
L	Y±”èí¤FC¹^ÇøhEº¥ì ‹gªNoxlŞ"¢„ŒÄ0ºd)®¥û$“’%4çy÷vû(õÊoåÔ. Ü:Æ}»ÿ]¢õ¶‚ONO–)–Q…Æ@ärfÚÜu`N‘v¼Ÿ4iŞss$PeKğû€¡R/åCôóWI¦©»Œè°š~b’q&,¡É<Ü2?B"X+\ñŞĞÛ	ÏsÙŸ,íÍ–¤º°á\ám
ÈaÑïµËÜÔè¦cñÄˆ»Å À8€ŠÙùd¡‡¦æ.O‰¯BjMK_ÃV#èğbøp‹”2£Ks&]i+™bÂh:µÍ88zBX&ŸêL™kp˜Í³¥6[é:{„¼”Ñˆ,„VÂˆLÜxÙD)´éé?±Èf§»å; Q[l~¥!}kÇ\#“T‹ÀŒ ‰é+zšdoˆa¤Í¹ô°]~]‡ĞÚÍ99?»™òÜih
€¡inºîğÈ©g®:±«PE)‹ïû­ùz·—Uú=â h ëP¶\F†Àœ"S,áàÕ(Wh««˜>™<Å šÜÿ~‘²›:.%æôW$ÂmgÅy1nf‡SQt¿’§kÌSÈx~Âˆª\ºø#„ßhÆ1ê½‡~Ú¶>¥€_wqú`+^£W<¤J›IÁÒèŞ?fšyU¡f<Î}Íb!õ™¹ÊE¬˜ní:“rø]K€Ï£¼à
A…z "Á”.ZFS5‘+`š‚L|Ô)¦òS…L“(óˆï#­q,ÎcCSLu)½#+-H"F„WÌ…ì€ğêZ)ÌÈ –àöU©³)Hv³¦tyÇpÃ˜Ç²½ôåÚJúƒlò)u«uåqş_5¦ÕÉvæ«¡h›£äkI„íï«Åö­{hwEV¾ÿİÈq´t¥ÙîÕÊªÇ)£ãl¯ˆ£ğ“.çÓóÇ·'L©ík¬oñ-ü¨‰ØFj«¹6,/U²Ì ÈúÒ¢šÔL+"ş6}NÒıjj\‚òÚ7ºMiœ*‡ğ¦>yÆ6\ÒûR>Nï.&ŞS+¾ö rODs7òw}íî…/cà\ÇL“GFîxĞ…ÌS ‹˜ÄÅhC
<»[[­9Æ]1r1²lyïkşæ	Í*ÁçfÍõ)¬(5¶˜³¬ŸjğAeÌ|¬F	`°š=È3Nó®*ÖAÙÍ°ˆÏA™¸(K‚D¤ÔÌ1¤VKhRßD¹{â’
Ä	œ `vÙ	Ü^¡;Ø£šù€Á„ÅÌßÄÖìBB&¡ ùQà)\ËV›?qmDàÑ3œ[ìük.×v$-è7ßCÔr‹é³ğx*‚ÏLTãt!Bwö,`¯ƒYÒf1A„™£ÇyÅˆñÚ`j²®Oğ Ñ\£=»=Ü 3GOøR’?á]Ò1$&ƒbZİ11*A ‹—0®,¬Äş÷iÛUKjãP
ßHÍRç_ "
3F ·dC»D	ê±AEDgî¦RÆ:ÁF×S¸bç_´8M s£¤GIíåü«˜q@æ9È~ôN„–®H*İ HŒ¿*­:ı.&s7Í*@b‚©V\z`èöR?‡è{1†ğHß¡fPÖ¹ İì3Jõm_ìúòœÆ½@%XÓÆ£ØŸ* ¡”¦$~¢Ë‰“7 SQ®‚Sç¯asÏ‘ÿ% :Ş+O 'a™_ÿ;o%Şµ4Ş=cá2Õİ~ì½º/6»¤KßÇñ…N9ûêª/—IÊ€g@­±PWÔÛ\òdE+‹oåGÛÔâµÅ†\Ö]®5QVÔ).+o‹,ÿT‚>¡|D&é<~cZU*¬–…'ù(f8Œ¨€`Ä[:jğDhš> J<ÀœÊËŒ·rh¨'Ği4ŸÅs®÷¹°Ç"+İ
Ë›è2úòch•(İcf†øAl®Í6JVŞÁWƒöìèŒ§ñ VÆ.˜Ñ4÷;şSÑ‚ç„ l.RëÓô8{*P¸§¤Ñ±ƒÂ~§™Jû4éti!ˆ¤>Š>çòr—Å’î£…8‡˜Dã„eaêZÔÃß’ÿMh5Ø *t'/Å`7/ 'èR×ÌS´ã!6ko£@™fİ°,ï&£@å]H½[ËÆrĞSMıNš9lÀÊ¯<­ÎÿQHÃ!İ˜Ä¾IÜm.s.Z­Â× {Gİ­8\™ƒ•›[%{A¬'5gP™
K™5ê]n²Èóe±Ï(¶Š\j>sín½š§mÈš´eAáÀG×ûù‰•»)/7Son–{P<gtA1şWÌ/~†S0•¢î[àÊÕ¥çÊËq:ïEÄèÔ–óx&ÆlJõÆæeXg¼ò(È+…å”YP+ãW¾±• lÔõÔ«AˆªÁ¥™û…ULßó¯T°¯¾_fQ×r¹}Ní`Ì1ˆ¨s`_h6¦|~¤§•[7ŠRl§üèÓÚ"H÷«|„k[‰Y¦OÕÈ;şªü¯`½
$›TÑ6•Ã]T¿XûGè\Ôù
^1H˜€î)4šÔû'dw¬ÇIb€ù“CıÃÀ?/gXˆµ…XÔòKÄl˜ºA®(?†j­¶ÌÛYúlkt•ã1p£EcHuó!Q²‰™¨´ÅéHaĞ]ÔEHC2êç œ(×dÓL‹K®ú%(÷†PğßªŠIØR)u:tlo¨.Jtc‚(:dóæ›^İ"£€Ñ¶©æ:i#:”ŠÛŒ0< oáÓ`ÿ"=Zp2ºÍéÓRìçN}´\G·t´Z°íû7]4^-Ä Ş ›¡-“Ü‹Y‚ÌDëçbêKcµ<¼éXËm1Éúëï––·?ô¸µ'¦¤
ä¸áâW‘Òüt‚gÛÅİåsvŞ›ÁoEv>ıò†Áˆ;¨Óğ&5…f7HhïÓ QÊà°ÚQÉ:í*\X[‡1¼GÜFc=…HpmĞrD›ëºçâ ÑRìzu`‚MÎ“åªÑ$Yz¦èñj:e
Ôë«ÔYr:?ş×#IF"¥c
Gª!3eLšçllYÛh:ùW€„ÃÒ&¸ôH£{/à±%g³Ï¨od
MEc‡X0`N¸©l¹‹ÅÒ)+Ñ·'ş³lƒX"'FS€9ë¥«EÎ·‡sÀ±ÓšlÊ¤ÊMJx`­è7³píUaë.Ä“»q*ş©L—ül»DfÉ—4·ÔlŒyÃ¯»O:½†…/‚§Ê c¨ÏŒÑÁÀ¸¢’û,s$_ÿø”»Û8Ÿ»ßÍÒ9Âv ùP@ +5K[¯‘™·/İNçÉ]û‹N»ê…¨¼²ˆN$‚ÓoL»êÎ'˜¢=Hñ(nw&~c¢ŞkËÉ€-]€éÑ²QÔyƒü-”•è·Y§ 6¨ùp”ö‡aDô¡–*ÏÖĞåĞh_ËC±1…ì1â'Ëòs›òRn³¼>'o¶¾¾ó­GXcÑ‚C@xaÄ3IH‡)*'¶„î|ÇöU8¡(û~,¹¦j*•‘›\e®”.Q¯k½d$çÅ>A†½)-A'~ÓQ	YÒ–“šõÑQFÑ]©Á¦ıß{Hô‡ö¡“Fl· EkÜ(‡el¦3T¢mëcVò”6Ã÷íï’¼¿Ù¦w°\4*‚Ä§”Ã"jíïj8•u-|}¢×6Ş‡âĞÊY+Ê¶Î?A âB?·-\FKÄÈa¹nÜàIÈM™¼Î\ô“2äw®ğéúXÕjg0g˜‰ôoV8¢Ğ™ÏÏÆVu=ÕÔTg»@àÒÈ÷v‹y@|yt hã(™-]ÈF
sßˆñÉ¾Â÷x@Ğ/pˆ±±4{Ôò”>şX¿–<:¼›ûQ=qNÏğ×
šO™Á‰F”+%–¤®cø)™£=†ÒÚÍWÜ×¥aŞöm(TÃos¡ø©ñşfĞ¡€”¢œñ`HßÏN:ä‰pÛ0í¬¾y¶òğÍæ5E1'Ê¿-ÁŠæ3ÕÜ”\¨pÈHÅŒKGÌ#ÕÔd(h”ÂZ£u«Ë*óÎ–0h,Ê@(× ¨B ^‹æ f%ùÇbßCÆ”ŸÈÁÛÆQ÷îúPY(Ñ'Ä‹¨7aíeëÜ3jù™‹A:ñ–p¼¦/aÿ{‘c«hK³»H‡{S¤'à8[ÖÚ$ÚlD”VŠ?Y0z¯§ÍÌŠò7}?}{š~múïí«Ì/36nKŸƒ¾å>zMgÌî`H—‘[¡Cìí¡kÙ—ëTènrš_ÅˆÜ›ès±e*UÖ­<ĞrÄ(q3õ¤&	bã©¬ò#TõcUuòİ¡„Ch¥	éø"ú_a¾âîr&`e´•ÁQ…”0L°Î7pÁ‚—ö¤Ä¦§î{äŠs‘ÇUNßµ¬|Dû·l{^][³À#2âè¹Æ
’³±2©XšBíJ„g#¼óîÄNI„]÷O"Š,$wâO`¦{ŠÔ”Ğ`¿ğZJÍúPQå›d¤ÀÉ&tj¡°DI™'¾pA“œG¬ãµ0Y6i±aæ×~{ÛM3¬')áÈµÎ`JyÉHúEÓt×íÛ_Ì˜Ë¡€„ å^QÀq¶+46ŠeUrŸy=è`Åt€†ùPu9s­œ—e‘09u~ÃläÉˆ&Œ¡£?œÉLLôzhÍŠÙõqy‹©xó‡‚Ù2õtl!ğ¤N¢—)"&ƒ¬k±…Ip.ÕC`3yÅ¯»‡JŠ^o-g~ˆ‘aã"ptºV«9R¿¤Tµ¼
	üÆRÂe“çÜ?ö&t¶bìfÕˆP1ìhÃEæ…–©¨xZ¬ëëÉŸJÑ£rªà‚’Zÿ”}cúz<`U&)Š; njÓ0õöo[ œZ¶I°|ÁDp5É '‚)/+«Å#lİòÈèYbÙ<áIa„ØHOûğtSX¸ùQ¹Ø¼Œoù~ê­Y¤£„¦V‰5Œ†I¹°èixM0À|a26/K™(qşVgüÿu6¢TÒm™Ş¥vÍŒyµºùæÉ#ëéÓGÿkÂâ²EŠY6.*:ªc¨%Št:_½†ÕíÏ#õİ£)›Î¦.+M«´Rj­1é·âÁ‚¡ı@•®1 Y«XYîX7õZØÀÉéÁ6Ê×€°™"’¡ø=zw_Bƒ•lïKìÏ‰<ËpêQI#:9¬e{İ¾ÅÏ#:’¶j¿å–ÿ|h÷ ®äB:¦0xÄ2£6+ÆdŞƒl–±üæÂŠ¹´+¡ÑÆ¨ì¯šÏ8=¡f'n§Îuîø€,é£òÃ<×å®ZmKšÒÊŞNşS²fkÊ
±}Nº}é!©G»ÍÃbãPÙôV2Ä?¸åøi
mHkÈí]I0P&íúGq=Ü§j¿'Ò¢6.ÍãÑùa+N¬”A6ã‹ÈB³/SÀxhğNš±ÀÙÀh9C°õ±ÈT‚9ÿ@ä»çÉ Tø7~çµ,&Äo&`§Ë›x7U(-©õ8_6ëï<ØüøáÀZ¦ä«tûİÒ¾*_ú{v’·aõç>a=NŸµCÊIEBÀßŸHÿÄš@qh hO]AYæB°nI™9@÷Ş£k\BËdøO&»ó÷µ_›Xé'ë^”zNÀ Îd0‰ç¹á={šçÖ·oÀOIØ àm=·¼I´T©)KI•Kiekbğ.8rrM’kÁ¼ç}  jMğGªÃ|ú	1i¥T¢/ãÜŠ­»·Şÿ²X¥”Ö!<k¡dô¸1©oü £yZ( „8ñª=?À"«:Bî¼¡kx3\«¡²5U+³=Ağêµ%‰ñå¿¸S6b(‰[Ê…ôa2N¿O—$Ú;ûÜ×ÎâA‚¨Ÿ8ìzµ…’µ¾ÊöÜp¡lpSöQ³ÕP-ms=CscĞÑu¾)uJÊIeøQ7bü*öÅ¹œ]2&jÓ+wWÚğÜÅ!œ&«éÚ3]Ğûr­´6[ëà¿ó©Û±cìâÂ•òU>•íz¡wÿå&Øv¨cV¬#_\5,Øt†Y:…uMÏÈ<PØ$hŒÀ-Zh¬Ó\Á­SM0SŒŞõ¶”á Îu–˜ÉfäÄ6	ÏP[3tµqX©ÉD¬Êá€¢Àn˜F¡Ğq*sr1årg)¥2ã}*XeeuS:Èr0¢UèÚ<>©fåÌ
’ËÉõ/çõe[×MUùdÈ²]ßÖ,äLåš	¾/\8,è €Áˆ `^ÒŞÀ€·úGiÃ)¯âÍXÚ$X%qe9…]¸’wcì›PÔæú– ÈÚ+ÛŸ?¥ ñqæÎ~¡ Ş¸[ÏÌD ¾*÷g¸
B¶µÈŒuw–VeiA…[f«¿i»M©á~‰µ=á»ÖRNTğ2ú@Pğù¢0+LÁvÅô‹,!VÊ45­úÜñÖoş€c(™bb9,C1eHG’ 9SİîyJ
fÊÓAAŒ³–rúâ¨µ‚®ÚÆ.Y}\,´DXÈÆKt3f™ò7õ¨ª{Á³OÀ»ÀíÅ˜;9€S\tŠÙhd»#h.Q–;F1™Qj…gLEœL*<1ØrÇüLÆYô.–nÓş‘àg…&o¤ı¹ıBÙ((8mF©éä3J{d2z·pı$Sê(áMfœ$ø€²‘H£&	ÚB9ŠĞ*ÄQèRl	#u:rğŒ 6î,)JøÃ®}3Æ,×o’¼“©IŞÖ³;ÀòÍ7o5*§½R¨ÂÃ-/Ê‘C] ƒ7nC…@ƒ Dbi¢ÖCê×4š»’ä6tLó€’\±–Öñ¤Ä‘—ØQŒ/]f‡ö?Bî 4zºxPºñ!´?½\g°A¾£88= ìíR^ø__®´	Ğ,_ĞŞÿ˜ŞıV*™14Ífò¸Õ×Ÿjzy¢ÚP teÚ7¯–² Ÿn,Ç!¡G`é
â8UÃWäÓuéë@—ƒ´°a‰"ü·Í‡šb!ÕEAá]Oû)Ë“3$IšºSƒ_ôS	U¡=%hÕ-K ’H.Åœ£Ï œ ªõœS¾…cp¸ÆÅ^5«áC*F@¡ÌÌİô×3srªUÓsóWb¨B(MÀ¶n7Æe¶ğÎ”$R_—	+:ÍC	£¸Èñb -ÃP4¸çÕ›éŸ­Æx–
Î»[ú w,EwvhL5M¿Oš_Û*¯µŠH  § Y(#ÊZbZM°*W™Â¡ÂSug PL¨nf]­Š2—^kŞ6=’ğfòj‡¹ÙÈEá©j‘M,–İJvì^ãô.œMá)ß'Ù$K!Ö¹­›¹†®ÙĞmÀ:6iˆjCrÕ=Y¢ùÍÿ9‚©nÂã˜–åø2‡×su%·†qHpøx@ÈÄÅvƒĞK%,kG)4~¾À×¢GÉßÌqo™Qøæx0ëgÓivh‘õjùĞíøÙÏøGawî~÷£ƒHá¥¤chÉorQUÀS>¦êô~š6Õ57Û”Y9,60–ƒ›Ê&ìÀ*Ø
üÂĞÑİ€J)jG„†|>G’Rå»q²vXX•U•Z¡'1jåÌ|» elw‘Ú¤@(LtwŒ\wu5¸\¶u! 
©¥ıPÜ¨]XYu,‡:ÂvúÌû5ŠG%£„=»>'†?T‡oÔJ ŞÉíÀ:6±ÆîÉÆï×üÔŞŸ”VÇånÅõ
ù]ê‡òË›ı` ìéW8İ7[ŸN²Zí^S8å68! ÍUØ²ºpm1yHğøøŸBAš$ ,8*IÒN_Q¬öBÑñ^3ˆÛ^])€È>\öÇ‚Û¦o!üÈód~Ï¯Ù¢ü| Yt	)8(ø‘@ˆ§f¾{éÜûõaátyàÄ?BÖ `Tè:‡ô2¬*Ã²zÌÃ¡ˆ?-ÍcKí…1"íí°2™ÎxázÉƒ,xUlœ¿Ñé§”æˆªÓ®‡²g¥A»±-€ÀgQ–çèÌšIÄ_ªvS—ïgÕ$å:)Ç[¸“3½³Á_|+­ÉTµVŸ—Á¤Ğ»ŸŸ¾hÚN§0mNMBP	ÌfAVí¦S¡y˜w#ˆ½KfÃµ#˜Á†+å]˜æ·E#Vã'g§¬Ö`Yí$õ±jßi}	xPğšˆP*ôƒ2t¬ãSµé”ÿùñtQÜÌú§÷„|y±|¬"¤nä¯d_fI‘»ûğ”;Éouìø‘óÍÇ{§IÚR‘Òfá#Š´fzL•8vğ£¹Òí¥ìFìäºF¿j
ÕB‹E}™Áà…æŸ¤:A³ˆ)Kê”
”Äš‹.yáx5û¥T‰»SÙgâs8"7XÉ':l’ÛĞ”ïoFw7Èo*>k…`©1ñ«Ó4HåôäU~ZMÄçHÖ ìû2À©Éã‚™Çşçì &ömãWHv¤G(~GØÜßT˜"’ù~OØ£Y{S9q¹ÛlçÜL¤­–üöt#Ñ–»/ÃÉÁÌJû2ó"t¬´ùµ”r×°> ¨›x –,L¥ƒ/ícòHør§êòWå!)7ç0S,âãÇ“u'ÖŠ+QFü“„ÔN\bÄàõ:ä.N€Ã§L’R'µÂ]zÁì²àa÷£…uİîø¢1hC•zJ¼äW0ªR¨>V®Î5hÅU^lµ²xGõëğ71qqI€ÊeÉÂvƒT®îNËc=ï`ã ê½ù¶¢htHÁ´ÒjBşä¸óKÛQFŞGë¶ğœÒZDšÕF½Ù¸0¿•YÕÅU
-
 õ9Ã"bÖƒ+x$e¿=PhB¶.&úá6>
AØºİÓTè<@úÓ7ïA†WåÔ®Lü»x1’›,‚`ƒóB à0Q¤ú]Kf_ÏßxöE‚&3	Š±°:†Œ[Y©wºvÑzúqSş}£Ö"Èàç,&~ß?BŞ`lR›¦`èÁÕÆ!fy8¦qØvƒ(ğt•X¥Ø·?n2Z&C ¾	Æº™$Éòî©“´Çùl‚¹K*İ92â-[hAÁˆ ˆäŞpJTcÁÒIj®åÔ¸œöJJ·ÔÈö}SW6Í­ÑÉÉ±ËÍnçÌMÏ¨ô{Ë»*Xl¼şMkÀ¹€pÜ#yvbj«‹8ÆÅ'XX¡¶(Ò”H98uÜ´¯e%“uö˜™)ò‰šã—æî‡·×)å~¤•
ÙJÑ)óé
à˜.ô+÷Tfn¡Ÿó¤—•„óKÛÓxª!«  ÁĞJ¢BrµÔÂ£ÿÜkœ)É‡‰$Ùón|7"À{§{»µ¸–im§y&]Í-uÎ(|_
)Ø>ñî¯ÄŒ¿”°ïÀ­Ÿ¯æ#0ö—5	åÆCFírk=°[RŒ‰C*Èiïx¸µhRÏÈz^êtÈˆ~v²wyL‡<œ|!¬ú{æõ¨²ŞÒóŠz¡4Æ}N§P	@¡@˜W)áñ!…Öÿ}9$½SÔ±¥Ç¾“õşal g/jNßh:ˆ–hÓ–S¹Já"–Pa‘¸¯õÇ“M†-ğÏÛñ¡tówã‚CéÎ­+“}Àà‡Çy¨—&èß;ı¥àŒrŞ°jµe†MVÒB/ÉËÛúK¥ŸJxNÏ¤… ÿÂYw‘Jşe]Œ¾ô'où•“UVZ’º$+§¿i™Ç±-[k:ƒ½jÒËB2è~£N^YÉ% dà°MÒ+i¿Új·Ê¥iUD	”C'œŠÒ”m±g‰·– —õƒ3î}Ğ7ú^Ey å…x)˜™§_ü0ŠdP¸ëBgÈ<ù„f‰Ñ6Ù5ˆ.é©ı«¬p-›¹-¸[’gs´æ‰ÿ§´NúOsÖ•	q0ÎŒzù§~ûã
KGşO|É¨üĞ¾_&¤Ë5«	úóP”£`æÁ—±‘¼ê¸µá¢Èj "*8ƒzRôc:lbªFÊ“çUU"*½gªıOØàôf#ÍÁEÃ[Ä@Fù6|—¹íİ'/úl‰ÿœ–ŸIm_Â£¬Ká¦‡(À±Y×6–R T§¥ã`“Ÿ6
„µËiZÑ0áFŒ9ääÙAt€áªß~ã2GøvÔ—¯:½Apß,HB%r·F™ûJµ3]Û{ˆ‚üNÿl¸Tægˆ³-72Š„M`½u,1¢ÅÏ¢U¨Š^OfJ‹ò‰¸9½£›ÙJyñ´JbWOÁ‚XŸ˜æŠ:ly§œ'×|%Û':Ÿ¼ñ§'‚5k]ÄêÉ‹/ä¸l·Ş0_T½–ºLÀğÃƒëÄ=(ˆF±öª9Feó@›!=s˜Ô	§éL– 4
õÍ$"„Á¶%
5–‚V¡¤ª—I×Md:ànÖ1Nƒ…w7¶)ÓeQØÜŸrë(o¤ÿ¶;Ù®–­-(›§ö(qªû8¿Ë%yßïòêâ¡mÓ‘^4>h¬èifÈäbOWÿÃ?—ìéâƒĞUKJH7)DîC
;Şe•ÇobÜMûô[ì4kX;\¢•òÒ0j˜ü*±’ĞNı…ø—í{õ^ ¤:¦ğØ
Ç´;Æa6Ò®µ4{?áì°2‘A  0Sn)ã+ùe½L\©CA,\1M®ly\ğà_ı¼™†dI\5H´é°æª¥%ü÷|Ù¹àÔu_¤¯@.uo§>Ì~ÜãíË}¨—D™UKÕÍ%›·ü9~sıh.#ä €ÔÄs"ãŒjÛ'öReÅVU*É•Ÿ7ºTuƒ=ˆØL¥Wo>#7Ë"µp©m¥¨x1#ËÔÑr„-¸ÕğÕê]ÇĞ-vÊÊ®[¥.åæCO	=@ËŸEõ±µ°©´l¼‰L\?‡_}²P.cséQ<uäKUœu'use strict';var _path = require('path');var _path2 = _interopRequireDefault(_path);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby11bmFzc2lnbmVkLWltcG9ydC5qcyJdLCJuYW1lcyI6WyJyZXBvcnQiLCJjb250ZXh0Iiwibm9kZSIsIm1lc3NhZ2UiLCJ0ZXN0SXNBbGxvdyIsImdsb2JzIiwiZmlsZW5hbWUiLCJzb3VyY2UiLCJBcnJheSIsImlzQXJyYXkiLCJmaWxlUGF0aCIsInBhdGgiLCJyZXNvbHZlIiwiZGlybmFtZSIsImZpbmQiLCJnbG9iIiwiam9pbiIsInByb2Nlc3MiLCJjd2QiLCJ1bmRlZmluZWQiLCJjcmVhdGUiLCJvcHRpb25zIiwiZ2V0UGh5c2ljYWxGaWxlbmFtZSIsImdldEZpbGVuYW1lIiwiaXNBbGxvdyIsImFsbG93IiwiSW1wb3J0RGVjbGFyYXRpb24iLCJzcGVjaWZpZXJzIiwibGVuZ3RoIiwidmFsdWUiLCJFeHByZXNzaW9uU3RhdGVtZW50IiwiZXhwcmVzc2lvbiIsInR5cGUiLCJhcmd1bWVudHMiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwicHJvcGVydGllcyIsImRldkRlcGVuZGVuY2llcyIsIm9wdGlvbmFsRGVwZW5kZW5jaWVzIiwicGVlckRlcGVuZGVuY2llcyIsIml0ZW1zIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiXSwibWFwcGluZ3MiOiJhQUFBLDRCO0FBQ0Esc0M7O0FBRUEsc0Q7QUFDQSxxQzs7QUFFQSxTQUFTQSxNQUFULENBQWdCQyxPQUFoQixFQUF5QkMsSUFBekIsRUFBK0I7QUFDN0JELFVBQVFELE1BQVIsQ0FBZTtBQUNiRSxjQURhO0FBRWJDLGFBQVMsb0NBRkksRUFBZjs7QUFJRDs7QUFFRCxTQUFTQyxXQUFULENBQXFCQyxLQUFyQixFQUE0QkMsUUFBNUIsRUFBc0NDLE1BQXRDLEVBQThDO0FBQzVDLE1BQUksQ0FBQ0MsTUFBTUMsT0FBTixDQUFjSixLQUFkLENBQUwsRUFBMkI7QUFDekIsV0FBTyxLQUFQLENBRHlCLENBQ1g7QUFDZjs7QUFFRCxNQUFJSyxpQkFBSjs7QUFFQSxNQUFJSCxPQUFPLENBQVAsTUFBYyxHQUFkLElBQXFCQSxPQUFPLENBQVAsTUFBYyxHQUF2QyxFQUE0QyxDQUFFO0FBQzVDRyxlQUFXSCxNQUFYO0FBQ0QsR0FGRCxNQUVPO0FBQ0xHLGVBQVdDLGtCQUFLQyxPQUFMLENBQWFELGtCQUFLRSxPQUFMLENBQWFQLFFBQWIsQ0FBYixFQUFxQ0MsTUFBckMsQ0FBWCxDQURLLENBQ29EO0FBQzFEOztBQUVELFNBQU9GLE1BQU1TLElBQU4sQ0FBVyxVQUFDQyxJQUFELFVBQVUsNEJBQVVMLFFBQVYsRUFBb0JLLElBQXBCO0FBQ3ZCLGdDQUFVTCxRQUFWLEVBQW9CQyxrQkFBS0ssSUFBTCxDQUFVQyxRQUFRQyxHQUFSLEVBQVYsRUFBeUJILElBQXpCLENBQXBCLENBRGEsRUFBWDtBQUVESSxXQUZOO0FBR0Q7O0FBRUQsU0FBU0MsTUFBVCxDQUFnQm5CLE9BQWhCLEVBQXlCO0FBQ3ZCLE1BQU1vQixVQUFVcEIsUUFBUW9CLE9BQVIsQ0FBZ0IsQ0FBaEIsS0FBc0IsRUFBdEM7QUFDQSxNQUFNZixXQUFXTCxRQUFRcUIsbUJBQVIsR0FBOEJyQixRQUFRcUIsbUJBQVIsRUFBOUIsR0FBOERyQixRQUFRc0IsV0FBUixFQUEvRTtBQUNBLE1BQU1DLFVBQVUsU0FBVkEsT0FBVSxDQUFDakIsTUFBRCxVQUFZSCxZQUFZaUIsUUFBUUksS0FBcEIsRUFBMkJuQixRQUEzQixFQUFxQ0MsTUFBckMsQ0FBWixFQUFoQjs7QUFFQSxTQUFPO0FBQ0xtQixxQkFESywwQ0FDYXhCLElBRGIsRUFDbUI7QUFDdEIsWUFBSUEsS0FBS3lCLFVBQUwsQ0FBZ0JDLE1BQWhCLEtBQTJCLENBQTNCLElBQWdDLENBQUNKLFFBQVF0QixLQUFLSyxNQUFMLENBQVlzQixLQUFwQixDQUFyQyxFQUFpRTtBQUMvRDdCLGlCQUFPQyxPQUFQLEVBQWdCQyxJQUFoQjtBQUNEO0FBQ0YsT0FMSTtBQU1MNEIsdUJBTkssNENBTWU1QixJQU5mLEVBTXFCO0FBQ3hCO0FBQ0VBLGFBQUs2QixVQUFMLENBQWdCQyxJQUFoQixLQUF5QixnQkFBekI7QUFDRyx3Q0FBZ0I5QixLQUFLNkIsVUFBckIsQ0FESDtBQUVHLFNBQUNQLFFBQVF0QixLQUFLNkIsVUFBTCxDQUFnQkUsU0FBaEIsQ0FBMEIsQ0FBMUIsRUFBNkJKLEtBQXJDLENBSE47QUFJRTtBQUNBN0IsaUJBQU9DLE9BQVAsRUFBZ0JDLEtBQUs2QixVQUFyQjtBQUNEO0FBQ0YsT0FkSSxnQ0FBUDs7QUFnQkQ7O0FBRURHLE9BQU9DLE9BQVAsR0FBaUI7QUFDZmYsZ0JBRGU7QUFFZmdCLFFBQU07QUFDSkosVUFBTSxZQURGO0FBRUpLLFVBQU07QUFDSkMsZ0JBQVUsYUFETjtBQUVKQyxtQkFBYSwyQkFGVDtBQUdKQyxXQUFLLDBCQUFRLHNCQUFSLENBSEQsRUFGRjs7QUFPSkMsWUFBUTtBQUNOO0FBQ0VULFlBQU0sUUFEUjtBQUVFVSxrQkFBWTtBQUNWQyx5QkFBaUIsRUFBRVgsTUFBTSxDQUFDLFNBQUQsRUFBWSxPQUFaLENBQVIsRUFEUDtBQUVWWSw4QkFBc0IsRUFBRVosTUFBTSxDQUFDLFNBQUQsRUFBWSxPQUFaLENBQVIsRUFGWjtBQUdWYSwwQkFBa0IsRUFBRWIsTUFBTSxDQUFDLFNBQUQsRUFBWSxPQUFaLENBQVIsRUFIUjtBQUlWUCxlQUFPO0FBQ0xPLGdCQUFNLE9BREQ7QUFFTGMsaUJBQU87QUFDTGQsa0JBQU0sUUFERCxFQUZGLEVBSkcsRUFGZDs7OztBQWFFZSw0QkFBc0IsS0FieEIsRUFETSxDQVBKLEVBRlMsRUFBakIiLCJmaWxlIjoibm8tdW5hc3NpZ25lZC1pbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcblxuaW1wb3J0IGlzU3RhdGljUmVxdWlyZSBmcm9tICcuLi9jb3JlL3N0YXRpY1JlcXVpcmUnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbmZ1bmN0aW9uIHJlcG9ydChjb250ZXh0LCBub2RlKSB7XG4gIGNvbnRleHQucmVwb3J0KHtcbiAgICBub2RlLFxuICAgIG1lc3NhZ2U6ICdJbXBvcnRlZCBtb2R1bGUgc2hvdWxkIGJlIGFzc2lnbmVkJyxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHRlc3RJc0FsbG93KGdsb2JzLCBmaWxlbmFtZSwgc291cmNlKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShnbG9icykpIHtcbiAgICByZXR1cm4gZmFsc2U7IC8vIGRlZmF1bHQgZG9lc24ndCBhbGxvdyBhbnkgcGF0dGVybnNcbiAgfVxuXG4gIGxldCBmaWxlUGF0aDtcblxuICBpZiAoc291cmNlWzBdICE9PSAnLicgJiYgc291cmNlWzBdICE9PSAnLycpIHsgLy8gYSBub2RlIG1vZHVsZVxuICAgIGZpbGVQYXRoID0gc291cmNlO1xuICB9IGVsc2Uge1xuICAgIGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShmaWxlbmFtZSksIHNvdXJjZSk7IC8vIGdldCBzb3VyY2UgYWJzb2x1dGUgcGF0aFxuICB9XG5cbiAgcmV0dXJuIGdsb2JzLmZpbmQoKGdsb2IpID0+IG1pbmltYXRjaChmaWxlUGF0aCwgZ2xvYilcbiAgICB8fCBtaW5pbWF0Y2goZmlsZVBhdGgsIHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBnbG9iKSksXG4gICkgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlKGNvbnRleHQpIHtcbiAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcbiAgY29uc3QgZmlsZW5hbWUgPSBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUgPyBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUoKSA6IGNvbnRleHQuZ2V0RmlsZW5hbWUoKTtcbiAgY29uc3QgaXNBbGxvdyA9IChzb3VyY2UpID0+IHRlc3RJc0FsbG93KG9wdGlvbnMuYWxsb3csIGZpbGVuYW1lLCBzb3VyY2UpO1xuXG4gIHJldHVybiB7XG4gICAgSW1wb3J0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgaWYgKG5vZGUuc3BlY2lmaWVycy5sZW5ndGggPT09IDAgJiYgIWlzQWxsb3cobm9kZS5zb3VyY2UudmFsdWUpKSB7XG4gICAgICAgIHJlcG9ydChjb250ZXh0LCBub2RlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIEV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSkge1xuICAgICAgaWYgKFxuICAgICAgICBub2RlLmV4cHJlc3Npb24udHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJ1xuICAgICAgICAmJiBpc1N0YXRpY1JlcXVpcmUobm9kZS5leHByZXNzaW9uKVxuICAgICAgICAmJiAhaXNBbGxvdyhub2RlLmV4cHJlc3Npb24uYXJndW1lbnRzWzBdLnZhbHVlKVxuICAgICAgKSB7XG4gICAgICAgIHJlcG9ydChjb250ZXh0LCBub2RlLmV4cHJlc3Npb24pO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGUsXG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdHlsZSBndWlkZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCB1bmFzc2lnbmVkIGltcG9ydHMnLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby11bmFzc2lnbmVkLWltcG9ydCcpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZGV2RGVwZW5kZW5jaWVzOiB7IHR5cGU6IFsnYm9vbGVhbicsICdhcnJheSddIH0sXG4gICAgICAgICAgb3B0aW9uYWxEZXBlbmRlbmNpZXM6IHsgdHlwZTogWydib29sZWFuJywgJ2FycmF5J10gfSxcbiAgICAgICAgICBwZWVyRGVwZW5kZW5jaWVzOiB7IHR5cGU6IFsnYm9vbGVhbicsICdhcnJheSddIH0sXG4gICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxufTtcbiJdfQ==                                                                                                                                                                                    Šæ
(5 *x^ej,â»òQ¯â°Nçkµ–¿yız|‹¾Ô>a’Ú‡ó÷›ãX[¬—'´`HÙÃJ¡™††\v6íïôM…¯àÿÛ}sæXk¡Á –"ÛÂÑ‹›$Ó«Ãö2H¸˜h "ö34©jùh{ÿøò‡İZëÄNl3|Š`&hKÿŒ[À°–Ö_sd.Yˆ°Æ–¢!%ÔJê1—0·±·h
Æ›C¨ÙÛÃ/T· ùFû|™,¥¹æXåù¥|tßÒİX»·w_z+¸54¸´h˜ˆĞü‚Ü  $PÍÂjxs‰EX‡g\]W|ê„…©éÖ…_E‚öÒ…Û
–æf¢ëu/ß	uµ®¿'Ï8·X“ü®ë²ıp<!°¦çûµµ¶öÓVg¯ììóÿşÖİÄi@ü”g|x‡ä–Ñ¯)Û[
5P>´L*
òÙ%´‹9 £Y¨toOo<Œ‹–œ”)ƒÆL—µè!. ƒ·Jşµ!ƒ8ÜÿLÔ^Oåã›z"L…DI¢$Á  ’…ÉÃÅåÏ©‚!”$ ˆ1h3ÉJ(Øğ½…Šé%s»"«Ê #Ì›æô
âÌy0têÄ´èÍKIòXÿÛÕ¦Öš¦ÇÒ­Ñ•1¦°‹÷6äÈ¡ˆ»ªÎO5¥7~VEÍ¸Ñ¦NçN×¼¬­«Ÿ:÷(Ûø)Ìú©bN4œìÕ]k	Y§‹Ií|ÄcúZ )Çù±ØÏ\ı:+AñØúøY1ÇëóÑ £.º’¹Bèát‚Å§‹İ§³BE2½³zZcLÛ#Ëf‘Lpu{ÿfçÚó º ë£Ÿ,œóÛÃ}§“•¯’2 ¹ZÍ%f•GZ#ù33^oiGö€ü
,0 À„ŸRRÚ¡w:şÊ<ª”¦t”©3W:
Í[?–h´±Óñæjª½tß‡FqiÂ“[›‘éüÍGáXÿ%@j“ñi]Õ·Û?Â¥YªµøÂ>mÎ•ğğ'aÙû‹şåˆæÆá~ŞígèùË¾óıu•FæöWN9ğ¿ß,Gö)J‹¢ÂƒÓ¡FK"œÕ9 Mu¸DŒêug)ÏŠ «µ<B+h[Ú—@ÚY8Š§:_Å7%ÁÒÃ¨ŸjŠSf[L [eöĞ 
ÛBÏßôoT37ş ¯mêî"„Êäš¯P¥,¦?+ó#(ĞÉ©mèå‘*¯¨Ëã\¯~¶tÛœ>Ë6¬‹%·(W åWÇ–v³_İ£ÌÖ­m–²‡IüÔv&;¢¨ZWÔÆCtiA#Æ	ß^á˜*‰sÀÑzh²ºîEÌ@‡!U²™Ÿ?Ì¦+±¨/%Ùj§=ÎölÑwºÛ Ôï èìÂ¨WˆíJ8kAßA@@DÚWDğV²cJDíyDày¨4ò´Kµuf—³Rã:72'êåÆ}Ú*«óÔ©/";f¹şVáŠg=íÑª…7Y»‰8$Ñ ©´•fB 0x•`è¦?¬ZäÄÁ&¢d¡ÅíàOE\Yáv¹»äh¥EœƒS´îSå¶Ú„ÍÕB<§,ıÕí³šMsJR…H@ dú¡%Ÿ¼y<¡kİ‚¬ñşºzb …Îb]åN}ê<z…®Ì5ş<;,Æ^1¦0zxdEI² …öb:QJ×'Ye@-á+WêÛ«ü„‚ÁØ´¶aP]¤÷/ûH®>Ícm¥q`ë1±©ıkäÚ^i·ts]zİf"yè’áŠÉ–¢	.[`íQÁˆöf+‹^&1‰¨ñ‡Üô“·Í¤ÎMx¤¶pi Ví-™/l›ìcIÎâd¿€+&ÀêÆIu{¥Ï4±LbP ıxîY-Û÷ãQG4FN%…ú6pM²vrjµØ*w/hjèYdKa{ac…xÒ3è:M“{éÍ]SB[–2íO¾s@ï¥ëµM¦Où³›Ÿ²Èk¨8İ¨x&:†_Ÿ­0Ñ‰ 0lØæÒÕÊ"¿[¯0 ƒ`úóõóÓ:JÂ¥”D®â	Ô• ñ>F‰QÇñ§ªWH¶WÆNó%G³æ_˜¹ßA à€/jk:ÕrN^Üô.ØúXb”(Á+D}åAz;,§Ió¨LµĞ @­¼Âæ…·\©UTé²vo"™ê™€Y½¥}‡èY7#9é8mí˜N%µmÿiìT•®wk’Ç5\ş4ùßq¹8 ‹–)Š‹L°lÿ07‹¾ul©£4iTıÇ3tå,§áãq…e=ÁÆ[Ã÷¨õvbTâ@ir‘şRÄ"TfÖLd[Á·•¡¥°*¶Ş³YéãV5RşBš-¤dN)}eKkåCB™] °VYş×ÙÃ/4z·B/&  —ŸQßZdŒûÎÛëc§—Êo8¡õ®€n%xCAUxc{Ï^BcCò¸¹[Ûzâ.—x›&‚>&6SêŒÈÃ.2ùÑÏl’¿æ4'\Uäƒ¿$ßAj>†Ã&íG‚rè”9şc}õ¸
–5Y«2`?¤d.Ì`¡ÕM¼\ÔV|±±I'².ğı3IY¥d•µ›q½^òµê( X&­‚Äöx 5×CuÉÛN”‚í™~ÀŠSIXÇÅ
‹IQÆÆh¤*Z—w©ÿ¥[¶)şèe¢2ÓÊåğ¹à{¾Zí_=Â±ûçJÍ×å¾¹ÇóUÉL1‹ãı‹…dgo¬ß8åeO‹ÀSõÎÍóçÇk^OÇ¹Å6©ß¿JKäÖ¦Á›ç#Å‹‰„Dº0µûñ3ğõúw8³9Rè˜1Æ˜Öå ¥JÀ_†|Ê¨ô7vÂœX†·ëVmáaÅ“éË±¾Ëµaë¾b‰N…Ş-W½É^´3ÅÚÛÊ?“’mİñ²šÑ¤¼NEâGZh¶cøAÏ‘µ-A*ìV{¯±ÖàkçÍğ™YCC´Æp+Sb­}bPö{ïax›ú•wo÷4«Nè'iØ"åJÌS¬Xxˆ^Q“™Äx@zä}Ÿö+°.£™İ(("úì‡öUb˜wpZà:t1r ¿%ô»àAæÅ…ş‰‰<$1|${ÏèéQğão`Šå­»İÒ×r pñõ@¨pÈ…·s™ô\ìÌ‘+áÄ»kæÔ:r™'´ûˆeÕ†ª,Ç?»ËNâq'c+\ .=.¯Ñµ‚_BC9Ñ
!5Q=Û˜‘E•Ú©”-Ö·‹€kÑĞ´\|“0%EB5áÌqNï±0Öøı8U5·øõcK7Hb°*—ÿ¡¼`pR…uQi‚Bn2Y?ş!$À«)<¿íÄACc;ö÷=-P ?f^BÈæâ’Ê[Òc×•ÆÕÂÍu÷s‹9+t§O&
s¸%g ğ(  @k«ÔôÍ°å)W yËÃÏ6íM—B2>S1ùòïe]ÙªÆ‚yÌ‡2Ù)\§5Û›O÷óSô°¿´Ü9=âšN:á<)kÑGÈTéVq®ææyõI?{b#[È¿gÎ‚+vú»‡@ïé~ÿ•	¨¬¤ÆÎüå<ÍŸ¢È¤æA®C$©~X°¢¹ƒNLK8 ör½T(@%-gmóLÜ&À§o¥¨ ­@ˆ<u8òICE‹Æh—)ÕR3¼=”©½JÄpgK„“bÖ¹¦	éÒ>îİa}},êçúì=óú9İªƒOäÖ”WJ:“5}&`uî¥ÜQCëH0tÿ×K¼’QC˜“ÖzíÉgÖŞCú›~¿dA%)c®H   !„/N\EÔWˆJ¡Œ;§à0•^‡yÑne´v";úó?WŸrP°`bmSE™EŞ`ZˆxÄ™5ÓØ¶70W•øÌ¤Ü+zúÂõL•>ğ™l]+z şßüšNëõRùôM3úMÆ3P›ß.†%w§ör?2i6á«J™[TE‘¥.8óQÈ¼rH\0-JÅ¥\Fœ¢Q’n<p-OÇN­dã°-ÇÆÚœ^Ä¡‰Çéª¬»%ï‰‹™ŠŒDppÅĞL?Ë©%_Oşt7‚Jî	ªƒQMúû‘şYVÊ¦Rƒ¢ÜİºÓôï*ÿ`kI3ñãÇõJ^ğ«&H	4 šäbÜU[/1OªáÑíù°
ú ±<¼]+BøRµãÓŠÇ ıBFTû>¼Ùc,q˜‹Õ²)Ş¦s"[FºÃ×áùÛ°{q[–ö³÷‹QÒk-ïŒd×vsÜÀX`üjL”x¤ö'¾WÖe<€ôÆH÷-6Âg¾½«ÒmÂ¬©>z9ºMĞhÄ€(ò´&Í,ë$Ï“"‡ñ2póõÏÒUõÕ	>4·jÊF¤D¹–s,û~Áø?ï²ö@°®K&Ü=ƒiZpzÄ<?ë:~ÛÈíHúß™›MÒ)Ó›„üÂ¥•Ö…øNuKş;™¼d‰dnA]ªà±Kqœü3³:'f×Y*3ç
ÓÉ'æëùÀíÎHÖ¹DìoúÅ#š¾Z[¹„ÒÄnEà­E™Ø.éø· ŒZP©Ef=XºUYx2Ÿh@J=¾«X+•”>2)%lÇÃõW‚*xTP …ä9A¢0éÜ.yX4Ï6ì×è[Çm®8tlû¡Jpa\?Âù|8á_w×µ‡$YçÛc	YêPp½o|)–àó¼ºR»ô¿š¥~Ü¹ç’O.'šŠsàãxŒG™¬ƒk)9‡Æ€M‘SÃó ;ÆˆëÈi&–X¹FBÃ¢=›´<5Veøq/^‹c4ü]é½Ú™6y,@I²‚Â‚P–Ì7˜œB‘Ä!uĞ9[ÁH-âú&.ÉOƒë²â¿eîä(„Ñ<É“9F:y.:{„,ÿ7Ÿ,Dş#4H¦'«{	‡»Ç†+¢·ünÛè&ts™ùÒøİõ#Î•=ÔŞ@"‰àŠæëéˆÎñFø[PA‰íò5WÄÙp8àg¹G‘¼Œ±(ê˜²8‚u´×ßz:Õ Nµ µ°î	)Q>ˆ1œåÏ}kÂV<¹à³ãÕàè	ü
„+A¦F&ƒF)#Aw¦×@_ÒtE°UÁ¼ÏÆw×;AîpœŠŞUKœ?¶ •$BÊZÂÌZÓÏĞ`<C*ˆrcÓĞ×' næ€€`§Çã\´¹®øæ”ª«íYX¸‡*74o?Vb»ÅOkUW9j¤N«t5ltÙlÿì€ qD³«C‚‹B²eîá‚BbëI,{Ô'#‹“ñuî»|“¸ÍÌaí_«ãà9t[:Ê¶¡£"Ê„©Ş¦ç|ğ´e¾u E ÄÔ ¡5Q³Á¨­ún[j3QBl³Ë”z³Í«D|¶ñ4` 8SôtCÚü|5=ßí¬ĞVöîÅt·îÍë,Q¾çfEyÔ‡nkuò×™ë„öÁ¼\x‡l ¥#lé™¥±®³'Ô.rkÓÖ4-u“€7O®%=u;oÃÎc¥ À—!hj)•…5Tüfq=Òèb¤xÊÿ±tqµ]ÛŞO8±mÛhlÛ¶­"¶mÛNÃ6nl«±Õ°M›Îw÷y¿™ógÏc¯YëZ:¥\÷Î -æë×÷aâfñ›èXúÃ'Ã4C8¯aOÍJÅ±…ŠİlíAg¥.	" xÉi)Õ–XSÖd‚€“Î*îÕaÍÅº*k–ím>à#“h'voù“¨Ôl-+”rÁùò½P†ĞG—ÿ¼}¢ÔU–@´P!çÉÊNÒ¹Ür$ÌeãÇÃ›İßÓOd£`õX¡Hço)~sÁ ¦ÿ£ƒä”k˜‘‡?¥>ĞƒŞ‹Êñg½fNdmËÕ“,Ì9¤’ıÉÑÄ¼÷|ô1»ÏBk7Ã>ç^ZÜó	zó§öİ8tçÄèÁ´“ÎV±ûÅŸ£ù;(E¡*U®èğL¯5ÄtPçäÅ·qBÚ0é±	73èãÅ#kŒ©Ã–´–f.ÒÕÊa;·õ[ë`¸fÒœå+ÇÃ7?I>ş—8`­¶`q<†‰	D©ÃÑ1ßÙ±ôÙ²&9»? «sŞ‹DÇWŸÕèm>9
ïÈ[XZœÜß)GıÉÿ/TF„½‚RIU‹g™¿Vª+TaXŞŞ)xp–ñ£[x	FpŒ#ºêá(Ù¤nşv9ŞRÿú¥V?õL˜­À?hõê”½*#9r;èjtP ñSeE¬"é;©•;ŞÆË¯™é×í@"‹Ò×ˆ`ªÒ7‹SŠ-$¦Ë6«\®±BJ¶¢,•Æ»½ur6WÍuR¶jÛ+p
ƒÊ6x?W¤j¥†€ôcìK*Ğ»ÉãR×54(tÎAœöûÏÏ(ìa¥;Û™$¿Å\â«±üDQZæby¾q	YĞëß¿ù,"O^e„&³ó§ÒYˆÇO<TÍşt‰t	pà  ‰£©(Ì,Ó/d™uMÂÌ®	°¸¸±tÕ@Œu,ÒŞˆïÜ™#ƒıµMš+I<’Œ˜J6ó_d|(5ÎõT’ŸÎ†ÿŞZåäŒ¯˜ù,ëÿÒĞôıGè:ø°Am=éN«¼gM42=>EÂ­BMBÿb4<qq0Øº³š&@£Vkï?&0Ø?s]¨JéxŸÉÚc¤;Ôâí¸cÉæ-²îÚt)yÚµ©t‘†=Ù¼-Y(iú°‡>Ùf
¾­Kj¥UÆ×TîÏ‰[DömÚ›Ó«;Çs+ÿK˜¼™«5DĞu(ÿ|Ÿ™`5_ônIÖPNNáK$ƒ×ÙJÊIkB9ô‘œ—†æ‰-v‡‚²¦ú%DjY¹åy#ëòî&î7VèR\¼„cÒ÷ÿQmSış?Ğ¸`€¼Ï±4¹&¼{á£ø…vÅP›ÏÉ=¼å€xvêWÊœúgr+cåèô¥wR¥{ut±Q1“§qä“Íƒ:t„ÔÿlßË‘a²ÁR¦Ù¨NüÓMşÍ ˆÃä!˜;c"SO—XhOwÌÛrùæSÃ&º£SÁWÆ‹ÔXq—‹LLs†ü¤IİÊ+îˆÃB­Ãòµ“q˜µÿfë·c}­£ríÉş;•fVâÜ¯;å}Ş]œDòãCÁRDj†—`¬yKZÃZ‹ÈVAê€ªø6J—dÇ‰Hôñ‰/åò"ój†£mg$ À??¤ê	k^ÇLe[C ó-,ûysšÔÓ„”™`À)Dÿ6–ÅûÃy"–\"Q¿ióTd¿Po_±ğ‚„OC¢É×?é8
–Ÿ»oØdDÎSÅŒÀ“4û KÄ[qü\{¨ .@ÙbÌÉ@1éqcØ([QP-PC.ôıPŸıŸ6:ä´µ­>¨0ù§]$¯e¶Û“–BÍ^è3[êE™Š ·K$RˆVèı¡Bı½bå Ä{­Î²´0xXé$à9ÀÖYT0ŠûQOÍ‹ê¨…g¾ÊAD—´WƒS”¢ãS8>ª•ß[•oşqœY@£ì:Iµ%Î\š‡0•—W½D+½²åge’€H†‡§sS„ış÷å™ày <7ZX¬Iu¯ó]à©ñ–Ÿğ1nñàR¬˜2ê‡,Ã‹VÊñ‰?Jb;ßÿ 9ÓĞ7©(2&Ê«jè/h^ŸÚÜV°ÏÜúóÿl(3ĞR`Ú3“™¬4@¹úí"—­!á©UˆÏÙ«NÓd'İyãKÛquuD@Gï¤4áÁÇ(¶‘ ñ·´ÌŸQ”ËÚGnBŒ€“„Ä Å …vË¢ÑòÉó`9IÎ	ïMõYßıÏø¢áÁ¿Pû7ZÏÛ§wä‰Ÿ¤‡=2‚şt|GJÁŞ¾=î(¤›ûøı÷\GéO_L0‚õ'Ş Ş¡a”Êa!…·¤}^Nâ®k˜Öº³9ÌØ_m=ÕNc­MáÙG€ê%ÜŠ¾ğ1ºí}Ş0½kã±ÅË'Ê^,š¶tï^vè\r,Û¶\:F)sÃğË“n˜‰½?vFÂu¬Æ7ío©‰m:× ¹ÉG[ÂÛ9áòÕ'ı…`Şå Ø„Šõ`Áíj÷"Š‚òüŸ±Ç|Å÷]<<£	ÕcŸ$©.`eÙp%ïÔ½cÉ,;C“î6¿>é€öpº„q…–VÊ&u¨\c`.ú´oËÜÉ¼tB£Eïˆ4i·ı}7hTğl€€ÿK½WÚĞb!r7³¾°µbvÄúefÜ@*|’PÿŒ¡(Ff\ó…ìFŸÛˆGõpQwxLD«Dè{PLÂ[ÑV$Ô6ÇüN!¯×zQ	áj0Ÿ{–]é¶´ğLçÃ…ßƒ¶Áöíå×OĞÿlPÀ”éRä&CÆReBOIbÉT•:9RÕ$jFCğÁºœbÚí7-[îØ’ywë