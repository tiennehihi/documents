
     type: tls.ContentType.handshake,
     data: tls.createClientKeyExchange(c)
  });
  tls.queue(c, record);

  // expect no messages until the following callback has been called
  c.expect = SER;

  // create callback to handle client signature (for client-certs)
  var callback = function(c, signature) {
    if(c.session.certificateRequest !== null &&
      c.session.clientCertificate !== null) {
      // create certificate verify message
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createCertificateVerify(c, signature)
      }));
    }

    // create change cipher spec message
    tls.queue(c, tls.createRecord(c, {
      type: tls.ContentType.change_cipher_spec,
      data: tls.createChangeCipherSpec()
    }));

    // create pending state
    c.state.pending = tls.createConnectionState(c);

    // change current write state to pending write state
    c.state.current.write = c.state.pending.write;

    // create finished message
    tls.queue(c, tls.createRecord(c, {
      type: tls.ContentType.handshake,
      data: tls.createFinished(c)
    }));

    // expect a server ChangeCipherSpec message next
    c.expect = SCC;

    // send records
    tls.flush(c);

    // continue
    c.process();
  };

  // if there is no certificate request or no client certificate, do
  // callback immediately
  if(c.session.certificateRequest === null ||
    c.session.clientCertificate === null) {
    return callback(c, null);
  }

  // otherwise get the client signature
  tls.getClientSignature(c, callback);
};

/**
 * Called when a ChangeCipherSpec record is received.
 *
 * @param c the connection.
 * @param record the record.
 */
tls.handleChangeCipherSpec = function(c, record) {
  if(record.fragment.getByte() !== 0x01) {
    return c.error(c, {
      message: 'Invalid ChangeCipherSpec message received.',
      send: true,
      alert: {
        level: tls.Alert.Level.fatal,
        description: tls.Alert.Description.illegal_parameter
      }
    });
  }

  // create pending state if:
  // 1. Resuming session in client mode OR
  // 2. NOT resuming session in server mode
  var client = (c.entity === tls.ConnectionEnd.client);
  if((c.session.resuming && client) || (!c.session.resuming && !client)) {
    c.state.pending = tls.createConnectionState(c);
  }

  // change current read state to pending read state
  c.state.current.read = c.state.pending.read;

  // clear pending state if:
  // 1. NOT resuming session in client mode OR
  // 2. resuming a session in server mode
  if((!c.session.resuming && client) || (c.session.resuming && !client)) {
    c.state.pending = null;
  }

  // expect a Finished record next
  c.expect = client ? SFI : CFI;

  // continue
  c.process();
};

/**
 * Called when a Finished record is received.
 *
 * When this message will be sent:
 *   A finished message is always sent immediately after a change
 *   cipher spec message to verify that the key exchange and
 *   authentication processes were successful. It is essential that a
 *   change cipher spec message be received between the other
 *   handshake messages and the Finished message.
 *
 * Meaning of this message:
 *   The finished message is the first protected with the just-
 *   negotiated algorithms, keys, and secrets. Recipients of finished
 *   messages must verify that the contents are correct.  Once a side
 *   has sent its Finished message and received and validated the
 *   Finished message from its peer, it may begin to send and receive
 *   application data over the connection.
 *
 * struct {
 *   opaque verify_data[verify_data_length];
 * } Finished;
 *
 * verify_data
 *   PRF(master_secret, finished_label, Hash(handshake_messages))
 *     [0..verify_data_length-1];
 *
 * finished_label
 *   For Finished messages sent by the client, the string
 *   "client finished". For Finished messages sent by the server, the
 *   string "server finished".
 *
 * verify_data_length depends on the cipher suite. If it is not specified
 * by the cipher suite, then it is 12. Versions of TLS < 1.2 always used
 * 12 bytes.
 *
 * @param c the connection.
 * @param record the record.
 * @param length the length of the handshake message.
 */
tls.handleFinished = function(c, record, length) {
  // rewind to get full bytes for message so it can be manually
  // digested below (special case for Finished messages because they
  // must be digested *after* handling as opposed to all others)
  var b = record.fragment;
  b.read -= 4;
  var msgBytes = b.bytes();
  b.read += 4;

  // message contains only verify_data
  var vd = record.fragment.getBytes();

  // ensure verify data is correct
  b = forge.util.createBuffer();
  b.putBuffer(c.session.md5.digest());
  b.putBuffer(c.session.sha1.digest());

  // set label based on entity type
  var client = (c.entity === tls.ConnectionEnd.client);
  var label = client ? 'server finished' : 'client finished';

  // TODO: determine prf function and verify length for TLS 1.2
  var sp = c.session.sp;
  var vdl = 12;
  var prf = prf_TLS1;
  b = prf(sp.master_secret, label, b.getBytes(), vdl);
  if(b.getBytes() !== vd) {
    return c.error(c, {
      message: 'Invalid verify_data in Finished message.',
      send: true,
      alert: {
        level: tls.Alert.Level.fatal,
        description: tls.Alert.Description.decrypt_error
      }
    });
  }

  // digest finished message now that it has been handled
  c.session.md5.update(msgBytes);
  c.session.sha1.update(msgBytes);

  // resuming session as client or NOT resuming session as server
  if((c.session.resuming && client) || (!c.session.resuming && !client)) {
    // create change cipher spec message
    tls.queue(c, tls.createRecord(c, {
      type: tls.ContentType.change_cipher_spec,
      data: tls.createChangeCipherSpec()
    }));

    // change current write state to pending write state, clear pending
    c.state.current.write = c.state.pending.write;
    c.state.pending = null;

    // create finished message
    tls.queue(c, tls.createRecord(c, {
      type: tls.ContentType.handshake,
      data: tls.createFinished(c)
    }));
  }

  // expect application data next
  c.expect = client ? SAD : CAD;

  // handshake complete
  c.handshaking = false;
  ++c.handshakes;

  // save access to peer certificate
  c.peerCertificate = client ?
    c.session.serverCertificate : c.session.clientCertificate;

  // send records
  tls.flush(c);

  // now connected
  c.isConnected = true;
  c.connected(c);

  // continue
  c.process();
};

/**
 * Called when an Alert record is received.
 *
 * @param c the connection.
 * @param record the record.
 */
tls.handleAlert = function(c, record) {
  // read alert
  var b = record.fragment;
  var alert = {
    level: b.getByte(),
    description: b.getByte()
  };

  // TODO: consider using a table?
  // get appropriate message
  var msg;
  switch(alert.description) {
  case tls.Alert.Description.close_notify:
    msg = 'Connection closed.';
    break;
  case tls.Alert.Description.unexpected_message:
    msg = 'Unexpected message.';
    break;
  case tls.Alert.Description.bad_record_mac:
    msg = 'Bad record MAC.';
    break;
  case tls.Alert.Description.decryption_failed:
    msg = 'Decryption failed.';
    break;
  case tls.Alert.Description.record_overflow:
    msg = 'Record overflow.';
    break;
  case tls.Alert.Description.decompression_failure:
    msg = 'Decompression failed.';
    break;
  case tls.Alert.Description.handshake_failure:
    msg = 'Handshake failure.';
    break;
  case tls.Alert.Description.bad_certificate:
    msg = 'Bad certificate.';
    break;
  case tls.Alert.Description.unsupported_certificate:
    msg = 'Unsupported certificate.';
    break;
  case tls.Alert.Description.certificate_revoked:
    msg = 'Certificate revoked.';
    break;
  case tls.Alert.Description.certificate_expired:
    msg = 'Certificate expired.';
    break;
  case tls.Alert.Description.certificate_unknown:
    msg = 'Certificate unknown.';
    break;
  case tls.Alert.Description.illegal_parameter:
    msg = 'Illegal parameter.';
    break;
  case tls.Alert.Description.unknown_ca:
    msg = 'Unknown certificate authority.';
    break;
  case tls.Alert.Description.access_denied:
    msg = 'Access denied.';
    break;
  case tls.Alert.Description.decode_error:
    msg = 'Decode error.';
    break;
  case tls.Alert.Description.decrypt_error:
    msg = 'Decrypt error.';
    break;
  case tls.Alert.Description.export_restriction:
    msg = 'Export restriction.';
    break;
  case tls.Alert.Description.protocol_version:
    msg = 'Unsupported protocol version.';
    break;
  case tls.Alert.Description.insufficient_security:
    msg = 'Insufficient security.';
    break;
  case tls.Alert.Description.internal_error:
    msg = 'Internal error.';
    break;
  case tls.Alert.Description.user_canceled:
    msg = 'User canceled.';
    break;
  case tls.Alert.Description.no_renegotiation:
    msg = 'Renegotiation not supported.';
    break;
  default:
    msg = 'Unknown error.';
    break;
  }

  // close connection on close_notify, not an error
  if(alert.description === tls.Alert.Description.close_notify) {
    return c.close();
  }

  // call error handler
  c.error(c, {
    message: msg,
    send: false,
    // origin is the opposite end
    origin: (c.entity === tls.ConnectionEnd.client) ? 'server' : 'client',
    alert: alert
  });

  // continue
  c.process();
};

/**
 * Called when a Handshake record is received.
 *
 * @param c the connection.
 * @param record the record.
 */
tls.handleHandshake = function(c, record) {
  // get the handshake type and message length
  var b = record.fragment;
  var type = b.getByte();
  var length = b.getInt24();

  // see if the record fragment doesn't yet contain the full message
  if(length > b.length()) {
    // cache the record, clear its fragment, and reset the buffer read
    // pointer before the type and length were read
    c.fragmented = record;
    record.fragment = forge.util.createBuffer();
    b.read -= 4;

    // continue
    return c.process();
  }

  // full message now available, clear cache, reset read pointer to
  // before type and length
  c.fragmented = null;
  b.read -= 4;

  // save the handshake bytes for digestion after handler is found
  // (include type and length of handshake msg)
  var bytes = b.bytes(length + 4);

  // restore read pointer
  b.read += 4;

  // handle expected message
  if(type in hsTable[c.entity][c.expect]) {
    // initialize server session
    if(c.entity === tls.ConnectionEnd.server && !c.open && !c.fail) {
      c.handshaking = true;
      c.session = {
        version: null,
        extensions: {
          server_name: {
            serverNameList: []
          }
        },
        cipherSuite: null,
        compressionMethod: null,
        serverCertificate: null,
        clientCertificate: null,
        md5: forge.md.md5.create(),
        sha1: f