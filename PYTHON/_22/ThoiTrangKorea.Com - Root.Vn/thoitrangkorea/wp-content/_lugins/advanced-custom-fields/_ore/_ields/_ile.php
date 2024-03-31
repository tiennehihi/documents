        gn = ev.value[n];

        var altName = {
          type: gn.type,
          value: gn.value
        };
        e.altNames.push(altName);

        // Note: Support for types 1,2,6,7,8
        switch(gn.type) {
          // rfc822Name
          case 1:
          // dNSName
          case 2:
          // uniformResourceIdentifier (URI)
          case 6:
            break;
          // IPAddress
          case 7:
            // convert to IPv4/IPv6 string representation
            altName.ip = forge.util.bytesToIP(gn.value);
            break;
          // registeredID
          case 8:
            altName.oid = asn1.derToOid(gn.value);
            break;
          default:
            // unsupported
        }
      }
    } else if(e.name === 'subjectKeyIdentifier') {
      // value is an OCTETSTRING w/the hash of the key-type specific
      // public key structure (eg: RSAPublicKey)
      var ev = asn1.fromDer(e.value);
      e.subjectKeyIdentifier = forge.util.bytesToHex(ev.value);
    }
  }
  return e;
};

/**
 * Converts a PKCS#10 certification request (CSR) from an ASN.1 object.
 *
 * Note: If the certification request is to be verified then compute hash
 * should be set to true. There is currently no implementation for converting
 * a certificate back to ASN.1 so the CertificationRequestInfo part of the
 * ASN.1 object needs to be scanned before the csr object is created.
 *
 * @param obj the asn1 representation of a PKCS#10 certification request (CSR).
 * @param computeHash true to compute the hash for verification.
 *
 * @return the certification request (CSR).
 */
pki.certificationRequestFromAsn1 = function(obj, computeHash) {
  // validate certification request and capture data
  var capture = {};
  var errors = [];
  if(!asn1.validate(obj, certificationRequestValidator, capture, errors)) {
    var error = new Error('Cannot read PKCS#10 certificate request. ' +
      'ASN.1 object is not a PKCS#10 CertificationRequest.');
    error.errors = errors;
    throw error;
  }

  // get oid
  var oid = asn1.derToOid(capture.publicKeyOid);
  if(oid !== pki.oids.rsaEncryption) {
    throw new Error('Cannot read public key. OID is not RSA.');
  }

  // create certification request
  var csr = pki.createCertificationRequest();
  csr.version = capture.csrVersion ? capture.csrVersion.charCodeAt(0) : 0;
  csr.signatureOid = forge.asn1.derToOid(capture.csrSignatureOid);
  csr.signatureParameters = _readSignatureParameters(
    csr.signatureOid, capture.csrSignatureParams, true);
  csr.siginfo.algorithmOid = forge.asn1.derToOid(capture.csrSignatureOid);
  csr.siginfo.parameters = _readSignatureParameters(
    csr.siginfo.algorithmOid, capture.csrSignatureParams, false);
  csr.signature = capture.csrSignature;

  // keep CertificationRequestInfo to preserve signature when exporting
  csr.certificationRequestInfo = capture.certificationRequestInfo;

  if(computeHash) {
    // create digest for OID signature type
    csr.md = _createSignatureDigest({
      signatureOid: csr.signatureOid,
      type: 'certification request'
    });

    // produce DER formatted CertificationRequestInfo and digest it
    var bytes = asn1.toDer(csr.certificationRequestInfo);
    csr.md.update(bytes.getBytes());
  }

  // handle subject, build subject message digest
  var smd = forge.md.sha1.create();
  csr.subject.getField = function(sn) {
    return _getAttribute(csr.subject, sn);
  };
  csr.subject.addField = function(attr) {
    _fillMissingFields([attr]);
    csr.subject.attributes.push(attr);
  };
  csr.subject.attributes = pki.RDNAttributesAsArray(
    capture.certificationRequestInfoSubject, smd);
  csr.subject.hash = smd.digest().toHex();

  // convert RSA public key from ASN.1
  csr.publicKey = pki.publicKeyFromAsn1(capture.subjectPublicKeyInfo);

  // convert attributes from ASN.1
  csr.getAttribute = function(sn) {
    return _getAttribute(csr, sn);
  };
  csr.addAttribute = function(attr) {
    _fillMissingFields([attr]);
    csr.attributes.push(attr);
  };
  csr.attributes = pki.CRIAttributesAsArray(
    capture.certificationRequestInfoAttributes || []);

  return csr;
};

/**
 * Creates an empty certification request (a CSR or certificate signing
 * request). Once created, its public key and attributes can be set and then
 * it can be signed.
 *
 * @return the empty certification request.
 */
pki.createCertificationRequest = function() {
  var csr = {};
  csr.version = 0x00;
  csr.signatureOid = null;
  csr.signature = null;
  csr.siginfo = {};
  csr.siginfo.algorithmOid = null;

  csr.subject = {};
  csr.subject.getField = function(sn) {
    return _getAttribute(csr.subject, sn);
  };
  csr.subject.addField = function(attr) {
    _fillMissingFields([attr]);
    csr.subject.attributes.push(attr);
  };
  csr.subject.attributes = [];
  csr.subject.hash = null;

  csr.publicKey = null;
  csr.attributes = [];
  csr.getAttribute = function(sn) {
    return _getAttribute(csr, sn);
  };
  csr.addAttribute = function(attr) {
    _fillMissingFields([attr]);
    csr.attributes.push(attr);
  };
  csr.md = null;

  /**
   * Sets the subject of this certification request.
   *
   * @param attrs the array of subject attributes to use.
   */
  csr.setSubject = function(attrs) {
    // set new attributes
    _fillMissingFields(attrs);
    csr.subject.attributes = attrs;
    csr.subject.hash = null;
  };

  /**
   * Sets the attributes of this certification request.
   *
   * @param attrs the array of attributes to use.
   */
  csr.setAttributes = function(attrs) {
    // set new attributes
    _fillMissingFields(attrs);
    csr.attributes = attrs;
  };

  /**
   * Signs this certification request using the given private key.
   *
   * @param key the private key to sign with.
   * @param md the message digest object to use (defaults to forge.md.sha1).
   */
  csr.sign = function(key, md) {
    // TODO: get signature OID from private key
    csr.md = md || forge.md.sha1.create();
    var algorithmOid = oids[csr.md.algorithm + 'WithRSAEncryption'];
    if(!algorithmOid) {
      var error = new Error('Could not compute certification request digest. ' +
        'Unknown message digest algorithm OID.');
      error.algorithm = csr.md.algorithm;
      throw error;
    }
    csr.signatureOid = csr.siginfo.algorithmOid = algorithmOid;

    // get CertificationRequestInfo, convert to DER
    csr.certificationRequestInfo = pki.getCertificationRequestInfo(csr);
    var bytes = asn1.toDer(csr.certificationRequestInfo);

    // digest and sign
    csr.md.update(bytes.getBytes());
    csr.signature = key.sign(csr.md);
  };

  /**
   * Attempts verify the signature on the passed certification request using
   * its public key.
   *
   * A CSR that has been exported to a file in PEM format can be verified using
   * OpenSSL using this command:
   *
   * openssl req -in <the-csr-pem-file> -verify -noout -text
   *
   * @return true if verified, false if not.
   */
  csr.verify = function() {
    var rval = false;

    var md = csr.md;
    if(md === null) {
      md = _createSignatureDigest({
        signatureOid: csr.signatureOid,
        type: 'certification request'
      });

      // produce DER formatted CertificationRequestInfo and digest it
      var cri = csr.certificationRequestInfo ||
        pki.getCertificationRequestInfo(csr);
      var bytes = asn1.toDer(cri);
      md.update(bytes.getBytes());
    }

    if(md !== null) {
      rval = _verifySignature({
        certificate: csr, md: md, signature: csr.signature
      });
    }

    return rval;
  };

  return csr;
};

/**
 * Converts an X.509 subject or issuer to an ASN.1 RDNSequence.
 *
 * @param obj the subject or issuer (distinguished name).
 *
 * @return the ASN.1 RDNSequence.
 */
function _dnToAsn1(obj) {
  // create an empty RDNSequence
  var rval = asn1.create(
    asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);

  // iterate over attributes
  var attr, set;
  var attrs = obj.attributes;
  for(var i = 0; i < attrs.length; ++i) {
    attr = attrs[i];
    var value = attr.value;

    // reuse tag class for attribute value if available
    var valueTagClass = asn1.Type.PRINTABLESTRING;
    if('valueTagClass' in attr) {
      valueTagClass = attr.valueTagClass;

      if(valueTagClass === asn1.Type.UTF8) {
        value = forge.util.encodeUtf8(value);
      }
      // FIXME: handle more encodings
    }

    // create a RelativeDistinguishedName set
    // each value in the set is an AttributeTypeAndValue first
    // containing the type (an OID) and second the value
    set = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        // AttributeType
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false,
          asn1.oidToDer(attr.type).getBytes()),
        // AttributeValue
        asn1.create(asn1.Class.UNIVERSAL, valueTagClass, false, value)
      ])
    ]);
    rval.value.push(set);
  }

  return rval;
}

/**
 * Gets all printable attributes (typically of an issuer or subject) in a
 * simplified JSON format for display.
 *
 * @param attrs the attributes.
 *
 * @return the JSON for display.
 */
function _getAttributesAsJson(attrs) {
  var rval = {};
  for(var i = 0; i < attrs.length; ++i) {
    var attr = attrs[i];
    if(attr.shortName && (
      attr.valueTagClass === asn1.Type.UTF8 ||
      attr.valueTagClass === asn1.Type.PRINTABLESTRING ||
      attr.valueTagClass === asn1.Type.IA5STRING)) {
      var value = attr.value;
      if(attr.valueTagClass === asn1.Type.UTF8) {
        value = forge.util.encodeUtf8(attr.value);
      }
      if(!(attr.shortName in rval)) {
        rval[attr.shortName] = value;
      } else if(forge.util.isArray(rval[attr.shortName])) {
        rval[attr.shortName].push(value);
      } else {
        rval[attr.shortName] = [rval[attr.shortName], value];
      }
    }
  }
  return rval;
}

/**
 * Fills in missing fields in attributes.
 *
 * @param attrs the attributes to fill missing fields in.
 */
function _fillMissingFields(attrs) {
  var attr;
  for(var i = 0; i < attrs.length; ++i) {
    attr = attrs[i];

    // populate missing name
    if(typeof attr.name === 'undefined') {
      if(attr.type && attr.type in pki.oids) {
        attr.name = pki.oids[attr.type];
      } else if(attr.shortName && attr.shortName in _shortNames) {
        attr.name = pki.oids[_shortNames[attr.shortName]];
      }
    }

    // populate missing type (OID)
    if(typeof attr.type === 'undefined') {
      if(attr.name && attr.name in pki.oids) {
        attr.type = pki.oids[attr.name];
      } else {
        var error = new Error('Attribute type not specified.');
        error.attribute = attr;
        throw error;
      }
    }

    // populate missing shortname
    if(typeof attr.shortName === 'undefined') {
      if(attr.name && attr.name in _shortNames) {
        attr.shortName = _shortNames[attr.name];
      }
    }

    // convert extensions to value
    if(attr.type === oids.extensionRequest) {
      attr.valueConstructed = true;
      attr.valueTagClass = asn1.Type.SEQUENCE;
      if(!attr.value && attr.extensions) {
        attr.value = [];
        for(var ei = 0; ei < attr.extensions.length; ++ei) {
          attr.value.push(pki.certificateExtensionToAsn1(
            _fillMissingExtensionFields(attr.extensions[ei])));
        }
      }
    }

    if(typeof attr.value === 'undefined') {
      var error = new Error('Attribute value not specified.');
      error.attribute = attr;
      throw error;
    }
  }
}

/**
 * Fills in missing fields in certificate extensions.
 *
 * @param e the extension.
 * @param [options] the options to use.
 *          [cert] the certificate the extensions are for.
 *
 * @return the extension.
 */
function _fillMissingExtensionFields(e, options) {
  options = options || {};

  // populate missing name
  if(typeof e.name === 'undefined') {
    if(e.id && e.id in pki.oids) {
      e.name = pki.oids[e.id];
    }
  }

  // populate missing id
  if(typeof e.id === 'undefined') {
    if(e.name && e.name in pki.oids) {
      e.id = pki.oids[e.name];
    } else {
      var error = new Error('Extension ID not specified.');
      error.extension = e;
      throw error;
    }
  }

  if(typeof e.value !== 'undefined') {
    return e;
  }

  // handle missing value:

  // value is a BIT STRING
  if(e.name === 'keyUsage') {
    // build flags
    var unused = 0;
    var b2 = 0x00;
    var b3 = 0x00;
    if(e.digitalSignature) 