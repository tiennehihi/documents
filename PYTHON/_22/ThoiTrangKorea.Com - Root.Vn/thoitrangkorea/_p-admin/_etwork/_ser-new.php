es the particular extension type.
 * - "extension_data" contains information specific to the particular
 * extension type.
 *
 * The extension types defined in this document are:
 *
 * enum {
 *   server_name(0), max_fragment_length(1),
 *   client_certificate_url(2), trusted_ca_keys(3),
 *   truncated_hmac(4), status_request(5), (65535)
 * } ExtensionType;
 *
 * @param c the connection.
 *
 * @return the ClientHello byte buffer.
 */
tls.createClientHello = function(c) {
  // save hello version
  c.session.clientHelloVersion = {
    major: c.version.major,
    minor: c.version.minor
  };

  // create supported cipher suites
  var cipherSuites = forge.util.createBuffer();
  for(var i = 0; i < c.cipherSuites.length; ++i) {
    var cs = c.cipherSuites[i];
    cipherSuites.putByte(cs.id[0]);
    cipherSuites.putByte(cs.id[1]);
  }
  var cSuites = cipherSuites.length();

  // create supported compression methods, null always supported, but
  // also support deflate if connection has inflate and deflate methods
  var compressionMethods = forge.util.createBuffer();
  compressionMethods.putByte(tls.CompressionMethod.none);
  // FIXME: deflate support disabled until issues with raw deflate data
  // without zlib headers are resolved
  /*
  if(c.inflate !== null && c.deflate !== null) {
    compressionMethods.putByte(tls.CompressionMethod.deflate);
  }
  */
  var cMethods = compressionMethods.length();

  // create TLS SNI (server name indication) extension if virtual host
  // has been specified, see RFC 3546
  var extensions = forge.util.createBuffer();
  if(c.virtualHost) {
    // create extension struct
    var ext = forge.util.createBuffer();
    ext.putByte(0x00); // type server_name (ExtensionType is 2 bytes)
    ext.putByte(0x00);

    /* In order to provide the server name, clients MAY include an
     * extension of type "server_name" in the (extended) client hello.
     * The "extension_data" field of this extension SHALL contain
     * "ServerNameList" where:
     *
     * struct {
     *   NameType name_type;
     *   select(name_type) {
     *     case host_name: HostName;
     *   } name;
     * } ServerName;
     *
     * enum {
     *   host_name(0), (255)
     * } NameType;
     *
     * opaque HostName<1..2^16-1>;
     *
     * struct {
     *   ServerName server_name_list<1..2^16-1>
     * } ServerNameList;
     */
    var serverName = forge.util.createBuffer();
    serverName.putByte(0x00); // type host_name
    writeVector(serverName, 2, forge.util.createBuffer(c.virtualHost));

    // ServerNameList is in extension_data
    var snList = forge.util.createBuffer();
    writeVector(snList, 2, serverName);
    writeVector(ext, 2, snList);
    extensions.putBuffer(ext);
  }
  var extLength = extensions.length();
  if(extLength > 0) {
    // add extension vector length
    extLength += 2;
  }

  // determine length of the handshake message
  // cipher suites and compression methods size will need to be
  // updated if more get added to the list
  var sessionId = c.session.id;
  var length =
    sessionId.length + 1 + // session ID vector
    2 +                    // version (major + minor)
    4 + 28 +               // random time and random bytes
    2 + cSuites +          // cipher suites vector
    1 + cMethods +         // compression methods vector
    extLength;             // extensions vector

  // build record fragment
  var rval = forge.util.createBuffer();
  rval.putByte(tls.HandshakeType.client_hello);
  rval.putInt24(length);                     // handshake length
  rval.putByte(c.version.major);             // major version
  rval.putByte(c.version.minor);             // minor version
  rval.putBytes(c.session.sp.client_random); // random time + bytes
  writeVector(rval, 1, forge.util.createBuffer(sessionId));
  writeVector(rval, 2, cipherSuites);
  writeVecto