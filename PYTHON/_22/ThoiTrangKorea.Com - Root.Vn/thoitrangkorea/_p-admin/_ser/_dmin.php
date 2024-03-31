h bytes
  rval.putInt16(signature.length);
  rval.putBytes(signature);
  return rval;
};

/**
 * Creates a CertificateRequest message.
 *
 * @param c the connection.
 *
 * @return the CertificateRequest byte buffer.
 */
tls.createCertificateRequest = function(c) {
  // TODO: support other certificate types
  var certTypes = forge.util.createBuffer();

  // common RSA certificate type
  certTypes.putByte(0x01);

  // add distinguished names from CA store
  var cAs = forge.util.createBuffer();
  for(var key in c.caStore.certs) {
    var cert = c.caStore.certs[key];
    var dn = forge.pki.distinguishedNameToAsn1(cert.subject);
    var byteBuffer 