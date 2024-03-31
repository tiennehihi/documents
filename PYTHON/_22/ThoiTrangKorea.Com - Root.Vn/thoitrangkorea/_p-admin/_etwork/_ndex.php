/**
 * A Javascript implementation of Transport Layer Security (TLS).
 *
 * @author Dave Longley
 *
 * Copyright (c) 2009-2014 Digital Bazaar, Inc.
 *
 * The TLS Handshake Protocol involves the following steps:
 *
 * - Exchange hello messages to agree on algorithms, exchange random values,
 * and check for session resumption.
 *
 * - Exchange the necessary cryptographic parameters to allow the client and
 * server to agree on a premaster secret.
 *
 * - Exchange certificates and cryptographic information to allow the client
 * and server to authenticate themselves.
 *
 * - Generate a master secret from the premaster secret and exchanged random
 * values.
 *
 * - Provide security parameters to the record layer.
 *
 * - Allow the client and server to verify that their peer has calculated the
 * same security parameters and that the handshake occurred without tampering
 * by an attacker.
 *
 * Up to 4 different messages may be sent during a key exchange. The server
 * certificate, the server key exchange, the client certificate, and the
 * client key exchange.
 *
 * A typical handshake (from the client's perspective).
 *
 * 1. Client sends ClientHello.
 * 2. Client receives ServerHello.
 * 3. Client receives optional Certificate.
 * 4. Client receives optional ServerKeyExchange.
 * 5. Client receives ServerHelloDone.
 * 6. Client sends optional Certificate.
 * 7. Client sends ClientKeyExchange.
 * 8. Client sends optional CertificateVerify.
 * 9. Client sends ChangeCipherSpec.
 * 10. Client sends Finished.
 * 11. Client receives ChangeCipherSpec.
 * 12. Client receives Finished.
 * 13. Client sends/receives application data.
 *
 * To reuse an existing session:
 *
 * 1. Client sends ClientHello with session ID for reuse.
 * 2. Client receives ServerHello with same session ID if reusing.
 * 3. Client receives ChangeCipherSpec message if reusing.
 * 4. Client receives Finished.
 * 5. Client sends ChangeCipherSpec.
 * 6. Client sends Finished.
 *
 * Note: Client ignores HelloRequest if in the middle of a handshake.
 *
 * Record Layer:
 *
 * The record layer fragments information blocks into TLSPlaintext records
 * carrying data in chunks of 2^14 bytes or less. Client message boundaries are
 * not preserved in the record layer (i.e., multiple client