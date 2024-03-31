 null) {
    // resuming session, expect a ChangeCipherSpec next
    c.expect = CCC;
    c.session.resuming = true;

    // get new client random
    c.session.sp.client_random = msg.random.bytes();
  } else {
    // not resuming, expect a Certificate or ClientKeyExchange
    c.expect = (c.verifyClient !== false) ? CCE : CKE;
    c.session.resuming = false;

    // create new security parameters
    tls.createSecurityParameters(c, msg);
  }

  // connection now open
  c.open = true;

  // queue server hello
  tls.queue(c, tls.createRecord(c, {
    type: tls.ContentType.handshake,
    data: tls.createServerHello(c)
  }));

  if(c.session.resuming) {
    // queue change cipher spec message
    tls.queue(c, tls.createRecord(c, {
      type: tls.ContentType.change_cipher_spec,
      data: tls.createChangeCipherSpec()
    }));

    // create pending state
    c.state.pending = tls.createConnectionState(c);

    // change current write state to pending write state
    c.state.current.write = c.state.pending.write;

    // queue finished
    tls.queue(c, tls.createRecord(c, {
      type: tls.ContentType.handshake,
      data: tls.createFinished(c)
    }));
  } else {
    // queue server certificate
    tls.queue(c, tls.createRecord(c, {
      type: tls.ContentType.handshake,
      data: tls.createCertificate(c)
    }));

    if(!c.fail) {
      // queue server key exchange
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createServerKeyExchange(c)
      }));

      // request client certificate if set
      if(c.verifyClient !== false) {
        // queue certificate request
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createCertificateRequest(c)
        }));
      }

      // queue server hello done
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createServerHelloDone(c)
      }));
    }
  }

  // send records
  tls.flush(c);

  // continue
  c.process();
};

/**
 * Called when a client receives a Certificate record.
 *
 * When this message will be sent:
 *   The server must send a certificate whenever the agreed-upon key exchange
 *   method is not an anonymous one. This message will always immediately
 *   follow the server hello message.
 *
 * Meaning of this message:
 *   The certificate type must be appropriate for the selected cipher suite's
 *   key exchange algorithm, and is generally an X.509v3 certificate. It must
 *   contain a key which matches the key exchange method, as follows. Unless
 *   otherwise specified, the signing algorithm for the certificate must be
 *   the same as the algorithm for the certificate key. Unless otherwise
 *   specified, the public key may be of any length.
 *
 * opaque ASN.1Cert<1..2^24-1>;
 * struct {
 *   ASN.1Cert certificate_list<1..2^24-1>;
 * } Certificate;
 *
 * @param c the connection.
 * @param record the record.
 * @param length the length of the handshake message.
 */
tls.handleCertificate = function(c, record, length) {
  // minimum of 3 bytes in message
  if(length < 3) {
    return c.error(c, {
      message: 'Invalid Certificate message. Message too short.',
      send: true,
      alert: {
        level: tls.Alert.Level.fatal,
        description: tls.Alert.Description.illegal_parameter
      }
    });
  }

  var b = record.fragment;
  var msg = {
    certificate_list: readVector(b, 3)
  };

  /* The sender's certificate will be first in the list (chain), each
    subsequent one that follows will certify the previous one, but root
    certificates (self-signed) that specify the certificate authority may
    be omitted under the assumption that clients must already possess it. */
  var cert, asn1;
  var certs = [];
  try {
    while(msg.certificate_list.length() > 0) {
      // each entry in msg.certificate_list is a vector with 3 len bytes
      cert = readVector(msg.certificate_list, 3);
      asn1 = forge.asn1.fromDer(cert);
      cert = forge.pki.certificateFromAsn1(asn1, true);
      certs.push(cert);
    }
  } catch(ex) {
    return c.error(c, {
      message: 'Could not parse certificate list.',
      cause: ex,
      send: true,
      alert: {
        level: tls.Alert.Level.fatal,
        description: tls.Alert.Description.bad_certificate
      }
    });
  }

  // ensure at least 1 certificate was provided if in client-mode
  // or if verifyClient was set to true to require a certificate
  // (as opposed to 'optional')
  var client = (c.entity === tls.ConnectionEnd.client);
  if((client || c.verifyClient === true) && certs.length === 0) {
    // error, no certificate
    c.error(c, {
      message: client ?
        'No server certificate provided.' :
        'No client certificate provided.',
      send: true,
      alert: {
        level: tls.Alert.Level.fatal,
        description: tls.Alert.Description.illegal_parameter
      }
    });
  } else if(certs.length === 0) {
    // no certs to verify
    // expect a ServerKeyExchange or ClientKeyExchange message next
    c.expect = client ? SKE : CKE;
  } else {
    // save certificate in session
    if(client) {
      c.session.serverCertificate = certs[0];
    } else {
      c.session.clientCertificate = certs[0];
    }

    if(tls.verifyCertificateChain(c, certs)) {
      // expect a ServerKeyExchange or ClientKeyExchange message next
      c.expect = client ? SKE : CKE;
    }
  }

  // continue
  c.process();
};

/**
 * Called when a client receives a ServerKeyExchange record.
 *
 * When this message will be sent:
 *   This message will be sent immediately after the server certificate
 *   message (or the server hello message, if this is an anonymous
 *   negotiation).
 *
 *   The server key exchange message is sent by the server only when the
 *   server certificate message (if sent) does not contain enough data to
 *   allow the client to exchange a premaster secret.
 *
 * Meaning of this message:
 *   This message conveys cryptographic information to allow the client to
 *   communicate the premaster secret: either an RSA public key to encrypt
 *   the premaster secret with, or a Diffie-Hellman public key with which the
 *   client can complete a key exchange (with the result being the premaster
 *   secret.)
 *
 * enum {
 *   dhe_dss, dhe_rsa, dh_anon, rsa, dh_dss, dh_rsa
 * } KeyExchangeAlgorithm;
 *
 * struct {
 *   opaque dh_p<1..2^16-1>;
 *   opaque dh_g<1..2^16-1>;
 *   opaque dh_Ys<1..2^16-1>;
 * } ServerDHParams;
 *
 * struct {
 *   select(KeyExchangeAlgorithm) {
 *     case dh_anon:
 *       ServerDHParams params;
 *     case dhe_dss:
 *     case dhe_rsa:
 *       ServerDHParams params;
 *       digitally-signed struct {
 *         opaque client_random[32];
 *         opaque server_random[32];
 *         ServerDHParams params;
 *       } signed_params;
 *     case rsa:
 *     case dh_dss:
 *     case dh_rsa:
 *       struct {};
 *   };
 * } ServerKeyExchange;
 *
 * @param c the connection.
 * @param record the record.
 * @param length the length of the handshake message.
 */
tls.handleServerKeyExchange = function(c, record, length) {
  // this implementation only supports RSA, no Diffie-Hellman support
  // so any length > 0 is invalid
  if(length