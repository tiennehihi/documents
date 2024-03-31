'use strict';

var os = require('os');
var fs = require('fs');
var child = require('child_process');

var DEFAULT_RESOLV_FILE = '/etc/resolv.conf';

function getInterfaceName() {
  var val = 'eth';
  var platform = os.platform();
  if (platform === 'darwin') {
    val = 'en';
  } else if (platform === 'win32') {
    val = null;
  }
  return val;
}

function getIfconfigCMD() {
  if (os.platform() === 'win32') {
    return 'ipconfig/all';
  }
  return '/sbin/ifconfig';
}

// typeof os.networkInterfaces family is a number (v18.0.0)
// types: 'IPv4' | 'IPv6' => 4 | 6
// @see https://github.com/nodejs/node/issues/42861
function matchName(actualFamily, expectedFamily) {
  if (expectedFamily === 'IPv4') {
    return actualFamily === 'IPv4' || actualFamily === 4;
  }
  if (expectedFamily === 'IPv6') {
    return actualFamily === 'IPv6' || actualFamily === 6;
  }
  return actualFamily === expectedFamily;
}

/**
 * Get all addresses.
 *
 * @param {String} [interfaceName] interface name, default is 'eth' on linux, 'en' on mac os.
 * @param {Function(err, addr)} callback
 *  - {Object} addr {
 *    - {String} ip
 *    - {String} ipv6
 *    - {String} mac
 *  }
 */
function address(interfaceName, callback) {
  if (typeof interfaceName === 'function') {
    callback = interfaceName;
    interfaceName = null;
  }

  var addr = {
    ip: address.ip(interfaceName),
    ipv6: address.ipv6(interfaceName),
    mac: null
  };
  address.mac(interfaceName, function (err, mac) {
    if (mac) {
      addr.mac = mac;
    }
    callback(err, addr);
  });
}

address.interface = function (family, name) {
  var interfaces = os.networkInterfaces();
  var noName = !name;
  name = name || getInterfaceName();
  family = family || 'IPv4';
  for (var i = -1; i < 8; i++) {
    var interfaceName = name + (i >= 0 ? i : ''); // support 'lo' and 'lo0'
    var items = interfaces[interfaceName];
    if (items) {
      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        if (matchName(item.family, family)) {
          return item;
        }
      }
    }
  }

  if (noName) {
    // filter all loopback or local addresses
    for (var k in interfaces) {
      var items = interfaces[k];
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        // all 127 addresses are local and should be ignored
        if (matchName(item.family, family) && !item.address.startsWith('127.')) {
          return item;
        }
      }
    }
  }
  return;
};

/**
 * Get current machine IPv4
 *
 * @param {String} [interfaceName] interface name, default is 'eth' on linux, 'en' on mac os.
 * @return {String} IP address
 */
address.ip = function (interfaceName) {
  var item = address.interface('IPv4', interfaceName