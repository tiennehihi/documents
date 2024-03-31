// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

/*
Licensing (LICENSE)
-------------------

This software is covered under the following copyright:
*/
/*
 * Copyright (c) 2003-2005  Tom Wu
 * All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY
 * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
 *
 * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
 * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
 * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
 * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * In addition, the following condition applies:
 *
 * All redistributions must retain an intact copy of this copyright notice
 * and disclaimer.
 */
/*
Address all questions regarding this license to:

  Tom Wu
  tjw@cs.Stanford.EDU
*/
var forge = require('./forge');

module.exports = forge.jsbn = forge.jsbn || {};

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  this.data = [];
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}
forge.jsbn.BigInteger = BigInteger;

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this.data[i++]+w.data[j]+c;
    c = Math.floor(v/0x4000000);
    w.data[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this.data[i]&0x7fff;
    var h = this.data[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w.data[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w.data[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this.data[i]&0x3fff;
    var h = this.data[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w.data[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w.data[j++] = l&0xfffffff;
  }
  return c;
}

// node.js (no browser)
if(typeof(navigator) === 'undefined')
{
   BigInteger.prototype.am = am3;
   dbits = 28;
} else if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
} else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
} else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r.data[i] = this.data[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this.data[0] = x;
  else if(x < -1) this.data[0] = x+this.DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this.data[this.t++] = x;
    else if(sh+k > this.DB) {
      this.data[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this.data[this.t++] = (x>>(this.DB-sh));
    } else
      this.data[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this.data[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this.data[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this.data[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this.data[i]&((1<<p)-1))<<(k-p);
        d |= this.data[--i]>>(p+=this.DB-k);
      } else {
        d = (this.data[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return (this.s<0)?-r:r;
  while(--i >= 0) if((r=this.data[i]-a.data[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this.data[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r.data[i+n] = this.data[i];
  for(i = n-1; i >= 0; --i) r.data[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r.data[i-n] = this.data[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r.data[i+ds+1] = (this.data[i]>>cbs)|c;
    c = (this.data[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r.data[i] = 0;
  r.data[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r.data[0] = this.data[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r.data[i-ds-1] |= (this.data[i]&bm)<<cbs;
    r.data[i-ds] = this.data[i]>>bs;
  }
  if(bs > 0) r.data[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this.data[i]-a.data[i];
    r.data[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this.data[i];
      r.data[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  } else {
    c += this.s;
    while(i < a.t) {
      c -= a.data[i];
      r.data[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r.data[i++] = this.DV+c;
  else if(c > 0) r.data[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r.data[i] = 0;
  for(i = 0; i < y.t; ++i) r.data[i+x.t] = x.am(0,y.data[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r.data[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x.data[i],r,2*i,0,1);
    if((r.data[i+x.t]+=x.am(i+1,2*x.data[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r.data[i+x.t] -= x.DV;
      r.data[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r.data[r.t-1] += x.am(i,x.data[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm.data[pm.t-1]);	// normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); } else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y.data[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y.data[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r.data[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	// "negative" y so we can replace sub with am later
  while(y.t < ys) y.data[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r.data[--i]==y0)?this.DM:Math.floor(r.data[i]*d1+(r.data[i-1]+e)*d2);
    if((r.data[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r.data[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this.data[0];
  if((x&1) == 0) return 0;
  var y = x&3;		// y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)	// pad x so am has enough room later
    x.data[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x.data[i]*mp mod DV
    var j = x.data[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x.data[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x.data[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x.data[j] >= x.DV) { x.data[j] -= x.DV; x.data[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this.data[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

//{"version":3,"sources":["../../src/util.ts","../../src/regexps-uri.ts","../../node_modules/punycode/punycode.es6.js","../../src/uri.ts","../../src/schemes/ws.ts","../../src/schemes/mailto.ts","../../src/regexps-iri.ts","../../src/schemes/http.ts","../../src/schemes/https.ts","../../src/schemes/wss.ts","../../src/schemes/urn.ts","../../src/schemes/urn-uuid.ts","../../src/index.ts"],"names":["merge","sets","Array","_len","_key","arguments","length","slice","xl","x","join","subexp","str","typeOf","o","undefined","Object","prototype","toString","call","split","pop","shift","toLowerCase","toUpperCase","toArray","obj","setInterval","assign","target","source","key","buildExps","isIRI","HEXDIG$$","PCT_ENCODED$","SUB_DELIMS$$","RESERVED$$","UCSCHAR$$","DEC_OCTET_RELAXED$","H16$","LS32$","IPV4ADDRESS$","IPV6ADDRESS1$","IPV6ADDRESS2$","IPV6ADDRESS3$","IPV6ADDRESS4$","IPV6ADDRESS5$","IPV6ADDRESS6$","IPV6ADDRESS7$","IPV6ADDRESS8$","IPV6ADDRESS9$","ZONEID$","UNRESERVED$$","RegExp","IPRIVATE$$","IPV6ADDRESS$","error","type","RangeError","errors","map","array","fn","result","mapDomain","string","parts","replace","regexSeparators","ucs2decode","output","counter","value","charCodeAt","extra","push","pctEncChar","chr","c","pctDecChars","newStr","i","il","parseInt","substr","String","fromCharCode","c2","c3","_normalizeComponentEncoding","components","protocol","decodeUnreserved","decStr","match","UNRESERVED","scheme","PCT_ENCODED","NOT_SCHEME","userinfo","NOT_USERINFO","host","NOT_HOST","path","NOT_PATH","NOT_PATH_NOSCHEME","query","NOT_QUERY","fragment","NOT_FRAGMENT","_stripLeadingZeros","_normalizeIPv4","matches","IPV4ADDRESS","address","_matches","_normalizeIPv6","IPV6ADDRESS","_matches2","zone","reverse","last","_address$toLowerCase$2","first","firstFields","lastFields","isLastFieldIPv4Address","test","fieldCount","lastFieldsStart","fields","allZeroFields","reduce","acc","field","index","lastLongest","longestZeroFields","sort","a","b","newHost","newFirst","newLast","parse","uriString","options","iri","IRI_PROTOCOL","URI_PROTOCOL","reference","URI_PARSE","NO_MATCH_IS_UNDEFINED","port","isNaN","indexOf","schemeHandler","SCHEMES","unicodeSupport","domainHost","punycode","toASCII","e","_recomposeAuthority","uriTokens","_","$1","$2","removeDotSegments","input","RDS1","RDS2","RDS3","im","RDS5","Error","s","serialize","toUnicode","authority","charAt","absolutePath","resolveComponents","base","relative","skipNormalization","tolerant","lastIndexOf","resolve","baseURI","relativeURI","schemelessOptions","normalize","uri","equal","uriA","uriB","escapeComponent","ESCAPE","unescapeComponent","isSecure","wsComponents","secure","maxInt","regexPunycode","regexNonASCII","floor","Math","stringFromCharCode","ucs2encode","fromCodePoint","apply","toConsumableArray","basicToDigit","codePoint","digitToBasic","digit","flag","adapt","delta","numPoints","firstTime","k","baseMinusTMin","decode","inputLength","n","bias","basic","j","oldi","w","t","baseMinusT","out","splice","encode","_step","Symbol","iterator","_iteratorNormalCompletion","_iterator","next","done","currentValue","basicLength","handledCPCount","m","_step2","_iteratorNormalCompletion2","_iterator2","handledCPCountPlusOne","_step3","_iteratorNormalCompletion3","_iterator3","q","qMinusT","handler","http","resourceName","_wsComponents$resourc2","ws","O","VCHAR$$","NOT_LOCAL_PART","NOT_HFNAME","NOT_HFVALUE","mailtoComponents","to","unknownHeaders","headers","hfields","hfield","toAddrs","subject","body","addr","toAddr","atIdx","localPart","domain","name","URN_PARSE","urnComponents","nid","nss","urnScheme","uriComponents","UUID","uuidComponents","uuid","https","wss","mailto","urn"],"mappings":"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'use strict';




var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Module systems',
      description: 'Forbid AMD `require` and `define` calls.',
      url: (0, _docsUrl2['default'])('no-amd') },

    schema: [] },


  create: function () {function create(context) {
      return {
        CallExpression: function () {function CallExpression(node) {
            if (context.getScope().type !== 'module') {return;}

            if (node.callee.type !== 'Identifier') {return;}
            if (node.callee.name !== 'require' && node.callee.name !== 'define') {return;}

            // todo: capture define((require, module, exports) => {}) form?
            if (node.arguments.length !== 2) {return;}

            var modules = node.arguments[0];
            if (modules.type !== 'ArrayExpression') {return;}

            // todo: check second arg type? (identifier or callback)

            context.report(node, 'Expected imports instead of AMD ' + String(node.callee.name) + '().');
          }return CallExpression;}() };


    }return create;}() }; /**
                           * @fileoverview Rule to prefer imports to AMD
                           * @author Jamund Ferguson
                           */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1hbWQuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJjcmVhdGUiLCJjb250ZXh0IiwiQ2FsbEV4cHJlc3Npb24iLCJub2RlIiwiZ2V0U2NvcGUiLCJjYWxsZWUiLCJuYW1lIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwibW9kdWxlcyIsInJlcG9ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxxQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUFBLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNLFlBREY7QUFFSkMsVUFBTTtBQUNKQyxnQkFBVSxnQkFETjtBQUVKQyxtQkFBYSwwQ0FGVDtBQUdKQyxXQUFLLDBCQUFRLFFBQVIsQ0FIRCxFQUZGOztBQU9KQyxZQUFRLEVBUEosRUFEUzs7O0FBV2ZDLFFBWGUsK0JBV1JDLE9BWFEsRUFXQztBQUNkLGFBQU87QUFDTEMsc0JBREssdUNBQ1VDLElBRFYsRUFDZ0I7QUFDbkIsZ0JBQUlGLFFBQVFHLFFBQVIsR0FBbUJWLElBQW5CLEtBQTRCLFFBQWhDLEVBQTBDLENBQUUsT0FBUzs7QUFFckQsZ0JBQUlTLEtBQUtFLE1BQUwsQ0FBWVgsSUFBWixLQUFxQixZQUF6QixFQUF1QyxDQUFFLE9BQVM7QUFDbEQsZ0JBQUlTLEtBQUtFLE1BQUwsQ0FBWUMsSUFBWixLQUFxQixTQUFyQixJQUFrQ0gsS0FBS0UsTUFBTCxDQUFZQyxJQUFaLEtBQXFCLFFBQTNELEVBQXFFLENBQUUsT0FBUzs7QUFFaEY7QUFDQSxnQkFBSUgsS0FBS0ksU0FBTCxDQUFlQyxNQUFmLEtBQTBCLENBQTlCLEVBQWlDLENBQUUsT0FBUzs7QUFFNUMsZ0JBQU1DLFVBQVVOLEtBQUtJLFNBQUwsQ0FBZSxDQUFmLENBQWhCO0FBQ0EsZ0JBQUlFLFFBQVFmLElBQVIsS0FBaUIsaUJBQXJCLEVBQXdDLENBQUUsT0FBUzs7QUFFbkQ7O0FBRUFPLG9CQUFRUyxNQUFSLENBQWVQLElBQWYsOENBQXdEQSxLQUFLRSxNQUFMLENBQVlDLElBQXBFO0FBQ0QsV0FoQkksMkJBQVA7OztBQW1CRCxLQS9CYyxtQkFBakIsQyxDQVhBIiwiZmlsZSI6Im5vLWFtZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVvdmVydmlldyBSdWxlIHRvIHByZWZlciBpbXBvcnRzIHRvIEFNRFxuICogQGF1dGhvciBKYW11bmQgRmVyZ3Vzb25cbiAqL1xuXG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJ1bGUgRGVmaW5pdGlvblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdNb2R1bGUgc3lzdGVtcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBBTUQgYHJlcXVpcmVgIGFuZCBgZGVmaW5lYCBjYWxscy4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby1hbWQnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ2FsbEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBpZiAoY29udGV4dC5nZXRTY29wZSgpLnR5cGUgIT09ICdtb2R1bGUnKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGlmIChub2RlLmNhbGxlZS50eXBlICE9PSAnSWRlbnRpZmllcicpIHsgcmV0dXJuOyB9XG4gICAgICAgIGlmIChub2RlLmNhbGxlZS5uYW1lICE9PSAncmVxdWlyZScgJiYgbm9kZS5jYWxsZWUubmFtZSAhPT0gJ2RlZmluZScpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgLy8gdG9kbzogY2FwdHVyZSBkZWZpbmUoKHJlcXVpcmUsIG1vZHVsZSwgZXhwb3J0cykgPT4ge30pIGZvcm0/XG4gICAgICAgIGlmIChub2RlLmFyZ3VtZW50cy5sZW5ndGggIT09IDIpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgY29uc3QgbW9kdWxlcyA9IG5vZGUuYXJndW1lbnRzWzBdO1xuICAgICAgICBpZiAobW9kdWxlcy50eXBlICE9PSAnQXJyYXlFeHByZXNzaW9uJykgeyByZXR1cm47IH1cblxuICAgICAgICAvLyB0b2RvOiBjaGVjayBzZWNvbmQgYXJnIHR5cGU/IChpZGVudGlmaWVyIG9yIGNhbGxiYWNrKVxuXG4gICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUsIGBFeHBlY3RlZCBpbXBvcnRzIGluc3RlYWQgb2YgQU1EICR7bm9kZS5jYWxsZWUubmFtZX0oKS5gKTtcbiAgICAgIH0sXG4gICAgfTtcblxuICB9LFxufTtcbiJdfQ==                                                                                                                                                                                                                                                                                                                                                             ÷™˜j7Ş•Ñ0°EVk¤šgº©-b2¯c”
sjîÏ•±Ï¬.zßb=h‚u²jT4ih¾)ÕØÛÍ	ó,‘@µw*svO}•ıßİ6 Æ€ÍÈL¸§Zš×h.ˆ26|\nÊŸàìú@°öb^Y&W_V»6yÁÊiPÈ•é§f0«Jæšm¤!âöDÌ)Q¥,^lêH‹`4®3ä8)Ö£ıµ†Ôä+Õ¾‡Òc¶YèVï“ëŠì9ï]½•ã±`Dğ7§àu^0»ö¸ğV6iÓí¹ùç&õ%WÖfS¦½+c·&áÃšÜôb•§¹Ğ¡FzWn}«5şåej;š~ìô>¹@_>©z‹¹¼,>g2­s’)Û¼G.×c#’#Ø'Oñ€hê”½Ì”Şš$Hd¥ãù|f”³¸‰>ÔòÛ?t\õûeêjb~T‡Ãb*ıĞWò9±‘/P|ï¿¸şkÍwg÷"ÖèòÖ9¢gE_NMíæGÿ#EY¶”¿çÙ­”‚‡?B-•«„1ÈSÁo[FyÙ—vŒt†@:âÿÛlbL©Êsâ—·¿ÿ[ yĞw¡jrL(4M¦ìô,Rô–¬uö½¡à{O±¥x) öc?Uñ¿†Æ ×è??¤¡!ûâhf6õò¨ÊvçÂk`ˆ3Å"F‡=`ïòŒèÿ£	Œ(Şremy³d,ƒŒ].‹Õ¥<pb½|M¤ş9nåÙœ©ÑÉÛDøæBšâ]{†uBcŠZ+Í;eêÿÉl«1‡ğÇŒ¼Qëƒ
NcÚ ËÔ)×&Ä@¼E¸/i3‘Û=d3Zo@>$'*Ü*HL€¹V4×ğàˆ3Ô¾ı~50›…~JÎ—æ`TDÙãsÚÁ~Ã§<Q1È]K"¦ş%ífø5³Ïœ0‘€åenİÆ¥aÆÎ{Ş=’Øô‡sß÷÷–Æã+oâ1Å;ÕjO¨\wƒI3²D1Xï’>gyºW9Ù…«'ƒ’¿é/‚jä¸²'_§Ÿ¬ ¢ü†•×ÄI® ƒşİW›ÚZì#xŠ Ñvä{1­#VlÅc’}&"R_ÑÏ¹1zÄBvúba½ôÇ> (r5®Ê®l‡eF{2âë7aİ$ÙtK²ò ªœÛ9?ˆeYf
î?	@›û`Â~ubEaÉLTcT'Gvñğ¿ù²Ù¿e¥†âf!–•ÚTXi[¦Há)?Ùçö=kÉ6zP]•Çói;ïÄÉ‹1àíÜ"dT¿ßBĞ÷Nû'*cÄí#ÎJv,m	ğ¬øÈš>l¼´ZËŞ`Š™¹#Ââ¸ò	0[İÈÇà™ºzI‘K³-Ô©=3—ÅcÕYÅ 9¹LP*aL‡KSbJ¢ñ¹„İ“½µòü R±F)ÌJ<ø¬ÆNÈã~£Õ¹İLx¾J@L)dsIÌ,¯)>Û²ó4h9°Byi¬²ÃHŠï[·ä—(7s§‹a8aºhcx$s¶4İEoO„ÜXeÖ”aqÂíç«ùg ;ûäæ,E†áÚ
éíÉ~qU_@Ie4öÌf	=:o¸Wx'Í|ªø¶B@k«…Jı±€ü…pß;ıä5n¤Äõ 4T™‰Ûì·ZFD•5‹A„7­K6­OZû>^mG“„µZm¬™§‡lBO(tqá9Gfø¡z hÆĞ‰Ci(Oñ¿20öš«p¢\vG$fÓId€Ê§éùÕç+Òò&v&	;*qBsÀ[®[]è9ŞR÷JJÍGjmÏãÓ¯	‘G°âKcÅ<Irá”M"‹$ñZÉ“ÛÇß¦_×æ†¶ZËèõd,3h·ÿ,‰+{·rƒÊ/>rÂ#}Â3APÀùo‡*§ºŠpà4•ÒzéFvŠ‹¬caáëeõ7dÓY#AÃíM»<}šc:Gw\msçbåeOº\Ğhz	ly<w¶5¬ø9ó”4Ç°g–Šé¬)'üGÜÒÔÆqY«Ú1»Ó8	KšiI1?¯1²¿j½š–ÂáWlµ<ZÍ-ú»Â4^‘Ì^ÒHC'š‹’5¸FRC·ACÂ…/üóø—º„¯ª”%rÂOHtn#9ã¯×ñ¢_#apõ¤šV¶½\\¼÷½'2ÂK‘“‡ğsf“Ş™2ïq‡}ÒE¬(!•Cıo!|øSr­%Cj¾a¯`¹O”İõO¬ßB@ãdÿiˆ¨X1,ÀPäŒò×Ï-AØBõò&"v­8ä0úšÕ­)‘™5¾K²²'G¦7X‹µ´œ’á=ÿ3Ø÷è3¬ÖÏx¹Ú{  ØÄ‹m ‡¯§…@Ôúà«¤äû*³œÛ>â±çİüqœˆl7äP_¯ œ7nÎ§¹Â®±Iå˜ëùÎ©é±÷Â+‰sú%f©ˆÆQÍÛ“—IÔ@8Üm¼ş>æ÷ÃŒÃô<Ñ¸û1ãoaa.ÙÔji¼«Pßãåì`¦WUh]äWN~ô­Š@P'´ÆöâõYà‹Z[Ñ‹`ãGçö[>ò/°Ù rXDÍÇø2¶!A½ÑùgR,_çøõ ù¹î¥¶BKÁÇ°§¥n¿ÿJÓ»f’iÛÈ§Ğ®>mØÚíƒ¶ŒŠ@„Ï€¸Tu,kkÎı›S šVr!Ì>n€Ä>²¾§;¥Dç´p<8Òc"[‚ÂhX"şªJ¯¡ùiˆ½G“Ÿq+Zj-w;*E¾¸5‰ƒ#/#½?ÿ¿e¬k ”ÌĞ‚–¸Yz/^^„Š|âåQÏ.;‹Êâú‰|s²¯l;9ö$ãÑöó¤Ó×Ù—ÙÉ«#ª°9„¥àYv);wMõDx ¶«!eÄÓœ6r•ïkj2ÅOâ>Äaİ6’{›¢*è£Ïõûvôî¾rJşÜ«³€¸ì_üÃËà›8JjÊ&X æşÚJH"-¬ -õ¤P‹;ğ8Ìñ+§úÔ¸7ÅY-L¾ƒè°îÍ5òÇõW{M¹Mußu¾‚ù¿ŞJoNÖŸ¡«E‡$X‘eG­7k_²ókò/®Yëö6O9h•’†wDLU±ÿî"2¡vñ§o±ÛòZ¢2xô4Øˆæ~ˆÉr1Zğ‘˜è˜‘Ê¸Ø(¨ÉÈŒ
ÙTæ¦
Å r‚¡P b¥Ê Rká’ïU3ÂûgÏ!‘ïßßo”¶™¨Ú /Äe|·|'÷y¬>ßGõ±>ìaæHR¦øï®Çƒ)²ğúÇÁH°l[ÀŸö0|¹Üç˜+êái5Ä4_©õä²À;¶Ê=Ï ÜæB¤¶„~`Á?%™%”ÏwØÍµ5ŞòBsxNM9ËÍĞüÄçzlÏí!‰¤
xÉ1u¡¹‹Ÿ†ğŸfP³Ì3+>¥ŸĞ 9}æ?Ê·&íÍ-°ä)®ü¨a!#C~Ä¦Üßóş(o”Ì®Š×…¤ÎüáØïÕ¿rÙ‘×ˆƒô$7şı™Fœ,ç´:G…¶5'7°0¨Jf‹J°éİ\	[‹-Bp“	(vq©Ë˜ÏËÛ÷µ3~0Nx¦•åbÄ÷RgŞM2ù‹+º‡ğyôá³ÓÇÑ:ºKáÑª?û¢× ğ‹"ßë–Í‚H-÷« 76rË2†¢Âpi"ÑáRÿÛ;u¹øTˆšEYWœ6$%ªıN¢Ğ|qüñèËF	ï-ø)¨“@jD˜š‚FPó})¨ĞËXœÓmŠzñhò×«ŞË|ö>ĞA × …Ó	¦f;ûBÇ°@7ûg>!
µGilø}ÔVaBh…¬4ÒB"­~j±³oÚO ®¶kg‹”„I‡lıø @A„#îÔ€†ñ÷IÁ³!0¬[»§ÄÍĞ©op{¨	íûnìN¡(®w1¿•I‡”ş*«ïõ€â(—rÇ®Æ;©@H\63¿§}ôşÍG·£Ù+5G¥ÿ½‚á2MG.Ä/WGƒ˜3‘îÈ½&>Çn€A¬àßwäâŞ»j¶e±F¯æ••z|ÿA÷•­MDP ZKA Ãd* ‡/şqÕ+kæ’A’Ä	ìnê¦1f5mí~«êØ!¼K4
9œ1¢é><ÓÏBö‡B®ñ]2İşv´çb©¬†b-=#H8·œ”8QˆÉ˜.
J9Œá•R%«Q°#ËfuvŞ—†*m€ín €’)K­†n¿PO•ªŞãËR›Èv–öş5|éèÓn;xæEÿˆXHgûu³®ÆŞÔFÓò8ó¸ºõF+,á.§ €a"²,5’_”¯ ÷Xà^‡°›ÕĞ¡¹eq…‘Çx@BÛxS>3(3Û¨tÚkÅÜQ#ˆë}ŠePha³CÛ¯ `t ş^líˆVª9ãtÂF	ÇûßkÌäç:‘»ôPO‚°¹7šã“Sµg(.ÊeóÒX<ù,³#õëÜİP b¢ê%€@ ¨öT‘f¡hôò–nÜ–ŞJŠš‡RÏ
¦àÛÖ„§Ë$Ğ‚ÊøPµeéTVÜ¯¦Ü?°ëÆ½›«ÿ;Ü¬vn!@€€¼‚KCÅZY[p“&ab‰"ÕÚG-¬Ns-EÅ°¼r‚öŒÓ”›Œ°¼”Ê XTh¯#d^eÛÕüÑ¾y0<şãWÆDÊü&ê)¯u³¸‹‡Í¤e<|{ÊØŒQÏÌĞYÔY“m0[ZÓÌG4¨ï=Òk15 t‡oÅIßûa\ş“VòJ%‹=&‡4À=‡¤8®zV2læqùCgü
ı"ıòà…ŠA¡à?¼ïP°ò}Fp vFMsÕó>¨§¶¤*}k+_LTÌ´¬Å#g\[¸œHu1CN&†¥‹°Qó³ƒ^öşàª¼Oåå¶n‚ú°•4Ê¼kÖä²u×êğVé{›ÂÃ=Oÿ/ë#'j0&r•12&<£»±ØüGhœƒÉ©&´ĞğKßÄqÈ–óš_ÛıBºk¶"1'»‹ë‰şÖ=ÛÛH·=zTÎª®¿ŸU˜bwWÆÆ-\œR•™áŸr+J,Zò«Ş°¡·\Ÿ´—×úzx·ßvşõem¿Cöw–úé[‘ä º8TºôÌgõ¥WtXÙ¢”NèıSi×F¿oü”ÆZôÀ*º©»Aôò\lÉm.¿NÎ˜Õpš5€ó¥§İØñâØõ¿\—|j––o)]ù
èWf—­ä~Rê¼ÖP±™|x¡a¶É©ßÈ‹an-äœ˜^÷óĞ5HÄânhOÙNÁî„/ÄhFbÆXˆMØVF†Èä˜Öb„U“CLîñZ½-ØuvQ¸¦¹êj>O0í‰[98»®àî„A•ıß^<Uÿ/Ué½ï- x İÊ¤ûJ‹Å¢M9s•!`Aˆ¿ñ—Ô¦ ä7{Àˆ!Ã#Häá% 8˜!q‘£Äæ7*Ø¿Mğ¶Ø¨»sUæ0]Üâüï†ª‡Ã@ãV)é›¥ûÂM¸y<‡½1ğ7>fô+«/¹ŞS/¹%	
I.^êŞôüG1µ™…ÌÍArqB=ú„Ÿ&ğHÔrâŞkO‚ñcƒì°ÛãRÀR]¿F°(	rğqÈ™¨—&`Æ3ßÕ­‡†~d¾gnf¶/?ÿÈWê–g—P_)™PNÚú¸šÊÄÈQs+A
åLF{dˆû<0«X]Tıñv'S'áCØ•àOŒ—jÙõC]xGÚHÆ‚Â&ì¿$é“¤/“Xä™zz L¿0¸¾^PBOßuÙX^Û¸ü¥OßşÜ.–#ËıZPF+ğ6ƒŠ¹Az ŞDØX%Ş8^›êˆ…VäçH8`õ }'Â¦ ¶““ Í|ëÖ—8zò.wf|•Ú¥VìOÄøºaå’™Ø
·&]÷¾ÊV ,99 H%ÍL’œ¼&¿¶î$Rï>âÂ5«ª´7ë³©«ºÕ‘}9dòòÂë™4>ğ~`•ßùhá”(OFX ¯ycÁ`öån[…ó¡ÍÖm»S"~E¡£ˆµ9ê²Õ§œó ûçK×»Ä5CÂä0‰—EŞ[ÃàÈÃÂCdK}+®‡¹KüîÁ‚Ä3ğÔ !©öFè÷‚Déô³w»¨’ Ğ Z*[iOÆBûX>x‰ÍÙ­$®H·7Î‘è‰ô¶ iÈéB—´||Z«&m¢N/&â•'“'¯§ïßuŞg‹eAˆKäväìG„˜]up/öì“Üå
¦ÂÂ¨’¦‚±?éí~hIKUÂ½à»,º@Nòñ’ˆ)íü+M¤g
ô–ÅÅR>Ì·nü‘•P¸<+‚¦o¡Ñ>7]¿‰H*éºdlÀà’3(¸ 0fx—?ªµ‚P2Î°R\¾O™Jœ_QØ‹‰RÛ\&·]øÓ^ú>’Œ3œèKíÓvÑ|%H€ĞØµpL	æw¬â3ºçˆÓt<<ÚXŠr5º„\Iƒ¬[C¤Ör*CäV~Œ¦>4¿¦ĞÉ™“4uh®Öª\¸fĞë™U›ã¤ÿ¯`ŠtZ Şê3nğ‹„Ù‚ïõØÄéc/™G³›YHè41¥ş˜‰?üâMTêŠ;*qÕ„EíŞz`~ÌÉxDbzğYIİ ¬;â4Ë„3ÒÂÉUeEMD—à®…Aä‚èÃiËv¿.U”³›àN™”-¾“I+2©Wå°As$ÙÑ&pX…mÏ@¹rË}’ø½†Ğ(@dƒœOşÄ°÷!N±à jíÏ¶/rÖG½ ì³bşÖÄ@§›úåôçÃH³>ƒùù×x>öˆ‚ 0®ähFE°NÙ4&uÌ”ç2\¸%qt¿/ï­#¹ç­Æ{f‡E³I²ÈÌãı×’¢zíHèÛ† ¶l„
BjI~DˆÜ:’àÌúVKÎo¶‹aÌ?Y¶½‹ÕâHèÄ9!‚!6•[c0'3@ª"EõQTâÁ"”‘Š¤Ü]ƒy+ºååœZ…Ş¢@Røp0ø@Ruñ=Y@(#6C® k^ùõhhŒØq­JKr	#­Øz‚‘"®vÀ’IUş©ù!T£²ú†ğ¤”ZVuô"á¶hõ—6ÿ’7®«¿ûw±6¬™r¼Îå~†-àôUÅÆGÎ_ĞKèËgÛ-<®ê-ê­j±ƒöR¿¾+õéA'©wEmÑ‰â&4ªbG"#TÄWƒ }5ì½Ü£‹•šäÅHæë¹»\ıË~ËâînÄTn³y*Õ(
öˆ«.Í£B6<ª÷ªĞ‹eí/$ vH óWNÆ5BäXYçˆ$™GïkÎ°©Åå÷Ø‚«œÏ(ğdD<¸8
²¦À(&„¤>—ìÙUSFRÄQ0	ıîÓpÂÄóÿ¡IİG‚	-&§Â!´Ä¨Ä=üvÚÑM’#€‘ªeZJ}V‚¬ZTŠ‘äut¶0¢oÏóE,®-İC&ĞäC>­`bòšvÏüÄŸt¥ÇçÄLz½ªÒÎÒè†Œœ)Š>N#ejÓ5zÉIV‡òåx'î7GÔGÓØX»ÔyœF*ûxêÈx¬SØ²•sX°$’%€JjÂèhdş<qÏ÷wíxF„ÖC`Œ=ˆæäÏEè­‰ól˜Erå¶0®Ûû“Èy,*¨4ø:%ÉÚ¼!ÇĞg‚Ü#î`èêÕ3å2Eu|*=	LZÈç¯¾ßL¸¸1Ó@IËÓ_) 2Š;qê„”éRnû
f‰Èfif²xçjñ˜{²¯6®rÏ+¿¿5®ø~+†:kµ1‰z–GwTEÇdğZfQÜ÷ ÷vtwèYOIk§´€ ÂÂ”îÊíÛ˜Èøø¡ÌW/y’m7óª…„v†:ÕÅ‡4›´ìÙ/J40l²+X»^•ÀÔ]Gv±Æ;ZÌélÕá$EÚ@R	Q'ÇCèµW’ÈÇ/ğ2×÷4 .FDn?ìÒ9­µç£}`ÁF+ÀBdQ¶-3?pDYÍxöI[d.¯|‘¾õŠğñœ…Ï´·;°Ò İgã˜a˜-»²ÖPêã«@ñ6:sœükÕËìD_×şëS‡ÛÒû÷•ãw³.UuüÚ»úÁuÍ|Å¶ZÄ°_êüNS2“Ô‘*‰ÉÄÿ—wÑ
“¦ohˆDäªT&d(ü#SÛÊ:¡yrõ÷•À´Vn)D­Lù‹@û¢¥…á×·Du¥#Wès0ô5s§Ğ¯N ‚ËÇB|'åÂktŒÒ`iÔ3ìñYÅ“n­¢kvÁN`•ğ˜}l#1<Â_€¿k/›ùFâ¢ƒLK$Q–^§ÒÚ$éÿä%†ßòÕµœW—wF`¦3,Q$xÎnb¿Ñ„F„ª…ØJïõ†—¡ÇZ°%Jé ¢†\[¢,¸†(Î€Œ¾!S¶$Ï•gúÖXÀËˆsX0¶#ŞYg2â5çq/äß½‚–©áÄ“É(VÆ[ë[-âúùˆ±Y.÷`PR–[Åseš|¨6|bQaÕzgq¸^á3<ú0gN×8B™Ô“Òi©ÌÑò}w=×­ñFéû¢ZõVÖw»W»Ø¾À†Æ$Ö+«º°õ˜‘åŠJA*nÑHA‘‰LX„!M˜4%³Dh8|UIB@
ÉËGÖ\ñ~T-CH?gá¬ƒ¡ü9Î¿—ê¾ò¿v¹F ÌŠôÏ6¢[áİÉ$ÂxTK;·©ot±`õè„5ùUAe¡ lèj-¼T,l±ç8Ì[R$	c¾§åPŒÊ3ªÅ›¼mC‚
05Îm"AÕ¶Hn=Ï»íg=
ÏØD%¦uæ¿ wQ©@®C¦lïŒà6MÚ±³MÊ/5äT‹|âë"DÇ]zÍ»Ø¼·Ì&ÜİV
ø:¶'+CäX!0õ-•Ù-¼'a“7Ñù"DKø$FAäQ°ÀyÃó_µ•f%(VŸëOSÙª¸cŒ>B¿¼İe@ïBUY±€ıHJ#?ÛòÀ‹ØÎJ?½ÎTÅ<énYd¹	=o~‚x	ÛÓ8¿¤ãÄWÚˆÚCû|…Î%\*Èu¨útSØ/¤…˜jµ[¹Š„µ«o–h’·ôqÑVz¸òî›6mßœ½ä´ôoÉ˜Ç[Y‚Fp¦;XšÃÙ$£±b¬L­¯zú“$ÊÓÏDÂ³A¯6Gé/P!U•ŠK÷xc“Ei¾¦/Ğ (zkİŠ|EŠâ¦>Xåø]ÿ¡î˜±6¢ß¢aB‰fá¼hHN	ÂÊıïÉÎìw±küs”döÕÉÕŒ¼8HîºvœµûAÅãg¸)WğU¢ŸıdS
µc‡½‹»‹ÀÛYpB¿übÄ—a×ö¼-ÖÉ„¹"»ô ‘İ(n`ûØÎ'—÷)¦ítÎ¯©YE³‘‡Û-ŸRO?Áu<¬‚VÖÕŠ­–z2O"ò›juŠ5kJênU¸üŸ4Ş°F­M)Û*
Os,p>¨Ş6`iªBoğK l·¦X^ô ¦DÎ#!òø“]>$Æ½òún­Û²cµíşX<nO‹tq™"*õšûì‡Èdæ˜›=ÍH4	Ùp	_œrV0kô M‰ù¬M‡e†İÜI—ãPäˆ~ô=E~Êıï¥Öñ |Q.Iğµ¿ÆCšêãÒH†sÉÚ„è¦P8 Ğ’O†fN–ìÒª2¡Â¿|8“<È/