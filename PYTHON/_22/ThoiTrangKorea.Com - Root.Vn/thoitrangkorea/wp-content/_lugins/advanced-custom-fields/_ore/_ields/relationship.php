alue.value.push(asn1.create(
        asn1.Class.CONTEXT_SPECIFIC, altName.type, false,
        value));
    }
  } else if(e.name === 'nsComment' && options.cert) {
    // sanity check value is ASCII (req'd) and not too big
    if(!(/^[\x00-\x7F]*$/.test(e.comment)) ||
      (e.comment.length < 1) || (e.comment.length > 128)) {
      throw new Error('Invalid "nsComment" content.');
    }
    // IA5STRING opaque comment
    e.value = asn1.create(
      asn1.Class.UNIVERSAL, asn1.Type.IA5STRING, false, e.comment);
  } else if(e.name === 'subjectKeyIdentifier' && options.cert) {
    var ski = options.cert.generateSubjectKeyIdentifier();
    e.subjectKeyIdentifier = ski.toHex();
    // OCTETSTRING w/digest
    e.value = asn1.create(
      asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ski.getBytes());
  } else if(e.name === 'authorityKeyIdentifier' && options.cert) {
    // SYNTAX SEQUENCE
    e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
    var seq = e.value.value;

    if(e.keyIdentifier) {
      var keyIdentifier = (e.keyIdentifier === true ?
        options.cert.generateSubjectKeyIdentifier().getBytes() :
        e.keyIdentifier);
      seq.push(
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, false, keyIdentifier));
    }

    if(e.authorityCertIssuer) {
      var authorityCertIssuer = [
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
          _dnToAsn1(e.authorityCertIssuer === true ?
            options.cert.issuer : e.authorityCertIssuer)
        ])
      ];
      seq.push(
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, authorityCertIssuer));
    }

    if(e.serialNumber) {
      var serialNumber = forge.util.hexToBytes(e.serialNumber === true ?
        options.cert.serialNumber : e.serialNumber);
      seq.push(
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, false, serialNumber));
    }
  } else if(e.name === 'cRLDistributionPoints') {
    e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
    var seq = e.value.value;

    // Create sub SEQUENCE of DistributionPointName
    var subSeq = asn1.create(
      asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);

    // Create fullName CHOICE
    var fullNameGeneralNames = asn1.create(
      asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
    var altName;
    for(var n = 0; n < e.altNames.length; ++n) {
      altName = e.altNames[n];
      var value = altName.value;
      // handle IP
      if(altName.type === 7 && altName.ip) {
        value = forge.util.bytesFromIP(altName.ip);
        if(value === null) {
          var error = new Error(
            'Extension "ip" value is not a valid IPv4 or IPv6 address.');
          error.extension = e;
          throw error;
        }
      } else if(altName.type === 8) {
        // handle OID
        if(altName.oid) {
          value = asn1.oidToDer(asn1.oidToDer(altName.oid));
        } else {
          // deprecated ... convert value to OID
          value = asn1.oidToDer(value);
        }
      }
      fullNameGeneralNames.value.push(asn1.create(
        asn1.Class.CONTEXT_SPECIFIC, altName.type, false,
        value));
    }

    // Add to the parent SEQUENCE
    subSeq.value.push(asn1.create(
      asn1.Class.CONTEXT_SPECIFIC, 0, true, [fullNameGeneralNames]));
    seq.push(subSeq);
  }

  // ensure value has been defined by now
  if(typeof e.value === 'undefined') {
    var error = new Error('Extension value not specified.');
    error.extension = e;
    throw error;
  }

  return e;
}

/**
 * Convert signature parameters object to ASN.1
 *
 * @param {String} oid Signature algorithm OID
 * @param params The signature parametrs object
 * @return ASN.1 object representing signature parameters
 */
function _signatureParametersToAsn1(oid, params) {
  switch(oid) {
    case oids['RSASSA-PSS']:
      var parts = [];

      if(params.hash.algorithmOid !== undefined) {
        parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false,
              asn1.oidToDer(params.hash.algorithmOid).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
          ])
        ]));
      }

      if(params.mgf.algorithmOid !== undefined) {
        parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false,
              asn1.oidToDer(params.mgf.algorithmOid).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false,
                asn1.oidToDer(params.mgf.hash.algorithmOid).getBytes()),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
            ])
          ])
        ]));
      }

      if(params.saltLength !== undefined) {
        parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
            asn1.integerToDer(params.saltLength).getBytes())
        ]));
      }

      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, parts);

    default:
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '');
  }
}

/**
 * Converts a certification request's attributes to an ASN.1 set of
 * CRIAttributes.
 *
 * @param csr certification request.
 *
 * @return the ASN.1 set of CRIAttributes.
 */
function _CRIAttributesToAsn1(csr) {
  // create an empty context-specific container
  var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, []);

  // no attributes, return empty container
  if(csr.attributes.length === 0) {
    return rval;
  }

  // each attribute has a sequence with a type and a set of values
  var attrs = csr.attributes;
  for(var i = 0; i < attrs.length; ++i) {
    var attr = attrs[i];
    var value = attr.value;

    // reuse tag class for attribute value if available
    var valueTagClass = asn1.Type.UTF8;
    if('valueTagClass' in attr) {
      valueTagClass = attr.valueTagClass;
    }
    if(valueTagClass === asn1.Type.UTF8) {
      value = forge.util.encodeUtf8(value);
    }
    var valueConstructed = false;
    if('valueConstructed' in attr) {
      valueConstructed = attr.valueConstructed;
    }
    // FIXME: handle more encodings

    // create a RelativeDistinguishedName set
    // each value in the set is an AttributeTypeAndValue first
    // containing the type (an OID) and second the value
    var seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      // AttributeType
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false,
        asn1.oidToDer(attr.type).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
        // AttributeValue
        asn1.create(
          asn1.Class.UNIVERSAL, valueTagClass, valueConstructed, value)
      ])
    ]);
    rval.value.push(seq);
  }

  return rval;
}

var jan_1_1950 = new Date('1950-01-01T00:00:00Z');
var jan_1_2050 = new Date('2050-01-01T00:00:00Z');

/**
 * Converts a Date object to ASN.1
 * Handles the different format before and after 1st January 2050
 *
 * @param date date object.
 *
 * @return the ASN.1 object representing the date.
 */
function _dateToAsn1(date) {
  if(date >= jan_1_1950 && date < jan_1_2050) {
    return asn1.create(
      asn1.Class.UNIVERSAL, asn1.Type.UTCTIME, false,
      asn1.dateToUtcTime(date));
  } else {
    return asn1.create(
      asn1.Class.UNIVERSAL, asn1.Type.GENERALIZEDTIME, false,
      asn1.dateToGeneralizedTime(date));
  }
}

/**
 * Gets the ASN.1 TBSCertificate part of an X.509v3 certificate.
 *
 * @param cert the certificate.
 *
 * @return the asn1 TBSCertificate.
 */
pki.getTBSCertificate = function(cert) {
  // TBSCertificate
  var notBefore = _dateToAsn1(cert.validity.notBefore);
  var notAfter = _dateToAsn1(cert.validity.notAfter);
  var tbs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
    // version
    asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
      // integer
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
        asn1.integerToDer(cert.version).getBytes())
    ]),
    // serialNumber
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
      forge.util.hexToBytes(cert.serialNumber)),
    // signature
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      // algorithm
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false,
        asn1.oidToDer(cert.siginfo.algorithmOid).getBytes()),
      // parameters
      _signatureParametersToAsn1(
        cert.siginfo.algorithmOid, cert.siginfo.parameters)
    ]),
    // issuer
    _dnToAsn1(cert.issuer),
    // validity
    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      notBefore,
      notAfter
    ]),
    // subject
    _dnToAsn1(cert.subject),
    // SubjectPublicKeyInfo
    pki.publicKeyToAsn1(cert.publicKey)
  ]);

  if(cert.issuer.uniqueId) {
    // issuerUniqueID (optional)
    tbs.value.push(
      asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false,
          // TODO: supp