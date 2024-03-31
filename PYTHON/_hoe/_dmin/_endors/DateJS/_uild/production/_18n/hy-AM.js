y).getBytes()),i.create(i.Class.UNIVERSAL,i.Type.OCTETSTRING,!1,E)])])])}else{var T;if("3des"!==r.algorithm)throw(T=new Error("Cannot encrypt private key. Unknown encryption algorithm.")).algorithm=r.algorithm,T;n=24;var I,A=new a.util.ByteBuffer(l);C=s.pbe.generatePkcs12Key(t,A,1,p,n),E=s.pbe.generatePkcs12Key(t,A,2,p,n);(I=a.des.createEncryptionCipher(C)).start(E),I.update(i.toDer(e)),I.finish(),u=I.output.getBytes(),c=i.create(i.Class.UNIVERSAL,i.Type.SEQUENCE,!0,[i.create(i.Class.UNIVERSAL,i.Type.OID,!1,i.oidToDer(o["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()),i.create(i.Class.UNIVERSAL,i.Type.SEQUENCE,!0,[i.create(i.Class.UNIVERSAL,i.Type.OCTETSTRING,!1,l),i.create(i.Class.UNIVERSAL,i.Type.INTEGER,!1,f.getBytes())])])}return i.create(i.Class.UNIVERSAL,i.Type.SEQUENCE,!0,[c,i.create(i.Class.UNIVERSAL,i.Type.OCTETSTRING,!1,u)])},s.decryptPrivateKeyInfo=function(e,t){var r=null,n={},o=[];if(!i.validate(e,c,n,o)){var u=new Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");throw u.errors=o,u}var l=i.derToOid(n.encryptionOid),p=s.pbe.getCipher(l,n.encryptionParams,t),f=a.util.createBuffer(n.encryptedData);return p.update(f),p.finish()&&(r=i.fromDer(p.output)),r},s.encryptedPrivateKeyToPem=function(e,t){var r={type:"ENCRYPTED PRIVATE KEY",body:i.toDer(e).getBytes()};return a.pem.encode(r,{maxline:t})},s.encryptedPrivateKeyFromPem=function(e){var t=a.pem.decode(e)[0];if("ENCRYPTED PRIVATE KEY"!==t.type){var r=new Error('Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".');throw r.headerType=t.type,r}if(t.procType&&"ENCRYPTED"===t.procType.type)throw new Error("Could not convert encrypted private key from PEM; PEM is encrypted.");return i.fromDer(t.body)},s.encryptRsaPrivateKey=function(e,t,r){if(!(r=r||{}).legacy){var n=s.wrapRsaPrivateKey(s.privateKeyToAsn1(e));return n=s.encryptPrivateKeyInfo(n,t,r),s.encryptedPrivateKeyToPem(n)}var o,c,u,l;switch(r.algorithm){case"aes128":o="AES-128-CBC",u=16,c=a.random.getBytesSync(16),l=a.aes.createEncryptionCipher;break;case"aes192":o="AES-192-CBC",u=24,c=a.random.getBytesSync(16),l=a.aes.createEncryptionCipher;break;case"aes256":o="AES-256-CBC",u=32,c=a.random.getBytesSync(16),l=a.aes.createEncryptionCipher;break;case"3des":o="DES-EDE3-CBC",u=24,c=a.random.getBytesSync(8),l=a.des.createEncryptionCipher;break;case"des":o="DES-CBC",u=8,c=a.random.getBytesSync(8),l=a.des.createEncryptionCipher;break;default:var p=new Error('Could not encrypt RSA private key; unsupported encryption algorithm "'+r.algorithm+'".');throw p.algorithm=r.algorithm,p}var f=l(a.pbe.opensslDeriveBytes(t,c.substr(0,8),u));f.start(c),f.update(i.toDer(s.privateKeyToAsn1(e))),f.finish();var h={type:"RSA PRIVATE KEY",procType:{version:"4",type:"ENCRYPTED"},dekInfo:{algorithm:o,parameters:a.util.bytesToHex(c).toUpperCase()},body:f.output.getBytes()};return a.pem.encode(h)},s.decryptRsaPrivateKey=function(e,t){var r=null,n=a.pem.decode(e)[0];if("ENCRYPTED PRIVATE KEY"!==n.type&&"PRIVATE KEY"!==n.type&&"RSA PRIVATE KEY"!==n.type)throw(u=new Error('Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".')).headerType=u,u;if(n.procType&&"ENCRYPTED"===n.procType.type){var o,c;switch(n.dekInfo.algorithm){case"DES-CBC":o=8,c=a.des.createDecryptionCipher;break;case"DES-EDE3-CBC":o=24,c=a.des.createDecryptionCipher;break;case"AES-128-CBC":o=16,c=a.aes.createDecryptionCipher;break;case"AES-192-CBC":o=24,c=a.aes.createDecryptionCipher;break;case"AES-256-CBC":o=32,c=a.aes.createDecryptionCipher;break;case"RC2-40-CBC":o=5,c=function(e){return a.rc2.createDecryptionCipher(e,40)};break;case"RC2-64-CBC":o=8,c=function(e){return a.rc2.createDecryptionCipher(e,64)};break;case"RC2-128-CBC":o=16,c=function(e){return a.rc2.createDecryptionCipher(e,128)};break;default:var u;throw(u=new Error('Could not decrypt private key; unsupported encryption algorithm "'+n.dekInfo.algorithm+'".')).algorithm=n.dekInfo.algorithm,u}var l=a.util.hexToBytes(n.dekInfo.parameters),p=c(a.pbe.opensslDeriveBytes(t,l.substr(0,8),o));if(p.start(l),p.update(a.util.createBuffer(n.body)),!p.finish())return r;r=p.output.getBytes()}else r=n.body;return null!==(r="ENCRYPTED PRIVATE KEY"===n.type?s.decryptPrivateKeyInfo(i.fromDer(r),t):i.fromDer(r))&&(r=s.privateKeyFromAsn1(r)),r},s.pbe.generatePkcs12Key=function(e,t,r,n,i,s){var o,c;if(null==s){if(!("sha1"in a.md))throw new Error('"sha1" hash algorithm unavailable.');s=a.md.sha1.create()}var u=s.digestLength,l=s.blockLength,p=new a.util.ByteBuffer,f=new a.util.ByteBuffer;if(null!=e){for(c=0;c<e.length;c++)f.putInt16(e.charCodeAt(c));f.putInt16(0)}var h=f.length(),d=t.length(),y=new a.util.ByteBuffer;y.fillWithByte(r,l);var g=l*Math.ceil(d/l),v=new a.util.ByteBuffer;for(c=0;c<g;c++)v.putByte(t.at(c%d));var m=l*Math.ceil(h/l),C=new a.util.ByteBuffer;for(c=0;c<m;c++)C.putByte(f.at(c%h));var E=v;E.putBuffer(C);for(var S=Math.ceil(i/u),T=1;T<=S;T++){var I=new a.util.ByteBuffer;I.putBytes(y.bytes()),I.putBytes(E.bytes());for(var A=0;A<n;A++)s.start(),s.update(I.getBytes()),I=s.digest();var B=new a.util.ByteBuffer;for(c=0;c<l;c++)B.putByte(I.at(c%u));var b=Math.ceil(d/l)+Math.ceil(h/l),N=new a.util.ByteBuffer;for(o=0;o<b;o++){var R=new a.util.ByteBuffer(E.getBytes(l)),w=511;for(c=B.length()-1;c>=0;c--)w>>=8,w+=B.at(c)+R.at(c),R.setAt(c,255&w);N.putBuffer(R)}E=N,p.putBuffer(I)}return p.truncate(p.length()-i),p},s.pbe.getCipher=function(e,t,r){switch(e){case s.oids.pkcs5PBES2:return s.pbe.getCipherForPBES2(e,t,r);case s.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:case s.oids["pbewithSHAAnd40BitRC2-CBC"]:return s.pbe.getCipherForPKCS12PBE(e,t,r);default:var a=new Error("Cannot read encrypted PBE data block. Unsupported OID.");throw a.oid=e,a.supportedOids=["pkcs5PBES2","pbeWithSHAAnd3-KeyTripleDES-CBC","pbewithSHAAnd40BitRC2-CBC"],a}},s.pbe.g