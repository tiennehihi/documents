rcv change cipher spec
var CFI = 5; // rcv finished
var CAD = 6; // rcv application data
var CER = 7; // not expecting any messages at this point

// map client current expect state and content type to function
var __ = tls.handleUnexpected;
var R0 = tls.handleChangeCipherSpec;
var R1 = tls.handleAlert;
var R2 