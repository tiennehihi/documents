/**
 * Javascript implementation of X.509 and related components (such as
 * Certification Signing Requests) of a Public Key Infrastructure.
 *
 * @author Dave Longley
 *
 * Copyright (c) 2010-2014 Digital Bazaar, Inc.
 *
 * The ASN.1 representation of an X.509v3 certificate is as follows
 * (see RFC 2459):
 *
 * Certificate ::= SEQUENCE {
 *   tbsCertificate       TBSCertificate,
 *   signatureAlgorithm   AlgorithmIdentifier,
 *   signatureValue       BIT STRING
 * }
 *
 * TBSCertificate ::= SEQUENCE {
 *   version         [0]  EXPLICIT Version DEFAULT v1,
 *   serialNumber         CertificateSerialNumber,
 *   signature            AlgorithmIdentifier,
 *   issuer               Name,
 *   validity             Validity,
 *   subject              Name,
 *   subjectPublicKeyInfo SubjectPublicKeyInfo,
 *   issu