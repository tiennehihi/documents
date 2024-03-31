Generate a self signed x509 certificate from node.js.

## Install

```bash
  npm install selfsigned
```

## Usage

```js
var selfsigned = require('selfsigned');
var attrs = [{ name: 'commonName', value: 'contoso.com' }];
var pems = selfsigned.generate(attrs, { days: 365 });
console.log(pems)
```

#### Async

```js
selfsigned.generate(attrs, { days: 365 }, function (err, pems) {
  console.log(pems)
});
```

Will return the following like this:

```js
{
  private: '-----BEGIN RSA PRIVATE KEY-----\r\nMIICXAIBAAKBgQCBFMXMYS/+RZz6+qzv+xeqXPdjw4YKZC4y3dPhSwgEwkecrCTX\r\nsR6boue+1MjIqPqWggXZnotIGldfEN0kn0Jbh2vMTrTx6YwqQ8tceBPoyuuqcYBO\r\nOONAcKOB3MLnZbyOgVtbyT3j68JE5V/lx6LhpIKAgY0m5WIuaKrW6mvLXQIDAQAB\r\nAoGAU6ODGxAqSecPdayyG/ml9vSwNAuAMgGB0eHcpZG5i2PbhRAh+0TAIXaoFQXJ\r\naAPeA2ISqlTJyRmQXYAO2uj61FzeyDzYCf0z3+yZEVz3cO7jB5Pl6iBvzbxWuuuA\r\ncbJtWLhWtW5/jioc8F0EAzZ+lkC/XuVJdwKHDmwt2qvJO+ECQQD+dvo1g3Sz9xGw\r\n21n+fDG5i4128+Qh+JPgh5AeLuXSofc1HMHaOXcC6Wu/Cloh7QAD934b7W0A7VoD\r\ndLd/JLyFAkEAgdwjryyvdhy69e516IrPB3b+m4rggtntBlZREMrk9tOzeIucVO3W\r\ntKI3FHm6JebN2gVcG+rZ+FaDPo+ifJkW+QJBAPojrMwEACmUevB2f9246gxx0UsY\r\nbq6yM3No71OsWEEY8/Bi53CEQqg7Gq5+F6H33qcHmBEN8LQTngN