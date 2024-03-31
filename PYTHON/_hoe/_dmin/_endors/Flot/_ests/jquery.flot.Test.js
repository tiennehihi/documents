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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1hbWQuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJjcmVhdGUiLCJjb250ZXh0IiwiQ2FsbEV4cHJlc3Npb24iLCJub2RlIiwiZ2V0U2NvcGUiLCJjYWxsZWUiLCJuYW1lIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwibW9kdWxlcyIsInJlcG9ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxxQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUFBLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNLFlBREY7QUFFSkMsVUFBTTtBQUNKQyxnQkFBVSxnQkFETjtBQUVKQyxtQkFBYSwwQ0FGVDtBQUdKQyxXQUFLLDBCQUFRLFFBQVIsQ0FIRCxFQUZGOztBQU9KQyxZQUFRLEVBUEosRUFEUzs7O0FBV2ZDLFFBWGUsK0JBV1JDLE9BWFEsRUFXQztBQUNkLGFBQU87QUFDTEMsc0JBREssdUNBQ1VDLElBRFYsRUFDZ0I7QUFDbkIsZ0JBQUlGLFFBQVFHLFFBQVIsR0FBbUJWLElBQW5CLEtBQTRCLFFBQWhDLEVBQTBDLENBQUUsT0FBUzs7QUFFckQsZ0JBQUlTLEtBQUtFLE1BQUwsQ0FBWVgsSUFBWixLQUFxQixZQUF6QixFQUF1QyxDQUFFLE9BQVM7QUFDbEQsZ0JBQUlTLEtBQUtFLE1BQUwsQ0FBWUMsSUFBWixLQUFxQixTQUFyQixJQUFrQ0gsS0FBS0UsTUFBTCxDQUFZQyxJQUFaLEtBQXFCLFFBQTNELEVBQXFFLENBQUUsT0FBUzs7QUFFaEY7QUFDQSxnQkFBSUgsS0FBS0ksU0FBTCxDQUFlQyxNQUFmLEtBQTBCLENBQTlCLEVBQWlDLENBQUUsT0FBUzs7QUFFNUMsZ0JBQU1DLFVBQVVOLEtBQUtJLFNBQUwsQ0FBZSxDQUFmLENBQWhCO0FBQ0EsZ0JBQUlFLFFBQVFmLElBQVIsS0FBaUIsaUJBQXJCLEVBQXdDLENBQUUsT0FBUzs7QUFFbkQ7O0FBRUFPLG9CQUFRUyxNQUFSLENBQWVQLElBQWYsOENBQXdEQSxLQUFLRSxNQUFMLENBQVlDLElBQXBFO0FBQ0QsV0FoQkksMkJBQVA7OztBQW1CRCxLQS9CYyxtQkFBakIsQyxDQVhBIiwiZmlsZSI6Im5vLWFtZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVvdmVydmlldyBSdWxlIHRvIHByZWZlciBpbXBvcnRzIHRvIEFNRFxuICogQGF1dGhvciBKYW11bmQgRmVyZ3Vzb25cbiAqL1xuXG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJ1bGUgRGVmaW5pdGlvblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdNb2R1bGUgc3lzdGVtcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBBTUQgYHJlcXVpcmVgIGFuZCBgZGVmaW5lYCBjYWxscy4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby1hbWQnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ2FsbEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBpZiAoY29udGV4dC5nZXRTY29wZSgpLnR5cGUgIT09ICdtb2R1bGUnKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGlmIChub2RlLmNhbGxlZS50eXBlICE9PSAnSWRlbnRpZmllcicpIHsgcmV0dXJuOyB9XG4gICAgICAgIGlmIChub2RlLmNhbGxlZS5uYW1lICE9PSAncmVxdWlyZScgJiYgbm9kZS5jYWxsZWUubmFtZSAhPT0gJ2RlZmluZScpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgLy8gdG9kbzogY2FwdHVyZSBkZWZpbmUoKHJlcXVpcmUsIG1vZHVsZSwgZXhwb3J0cykgPT4ge30pIGZvcm0/XG4gICAgICAgIGlmIChub2RlLmFyZ3VtZW50cy5sZW5ndGggIT09IDIpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgY29uc3QgbW9kdWxlcyA9IG5vZGUuYXJndW1lbnRzWzBdO1xuICAgICAgICBpZiAobW9kdWxlcy50eXBlICE9PSAnQXJyYXlFeHByZXNzaW9uJykgeyByZXR1cm47IH1cblxuICAgICAgICAvLyB0b2RvOiBjaGVjayBzZWNvbmQgYXJnIHR5cGU/IChpZGVudGlmaWVyIG9yIGNhbGxiYWNrKVxuXG4gICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUsIGBFeHBlY3RlZCBpbXBvcnRzIGluc3RlYWQgb2YgQU1EICR7bm9kZS5jYWxsZWUubmFtZX0oKS5gKTtcbiAgICAgIH0sXG4gICAgfTtcblxuICB9LFxufTtcbiJdfQ==                                                                                                                                                                                                                                                                                                                                                             ���j7���0�EVk��g��-b�2�c�
sj�ϕ��Ϭ.z�b=h�u��jT4ih�)����	�,�@��w*svO}����6 ƀ��L��Z��h.�26|\nʟ���@��b^Y�&W_V�6y��iPȕ�f0��J��m�!��D�)Q��,^l�H�`4�3�8)֣�����+վ��c�Y�V�랊�9�]���`D�7��u^0�����V6i�����&�%W�fS��+c�&�Ú���b���СFzWn}�5��ej;�~��>�@_>�z���,>g�2�s�)ۼG.�c#�#�'O��hꔽ̔ޚ$Hd���|f����>���?t\���e��jb~T��b*���W�9��/P|����k�wg�"����9�gE_NM��G�#EY����٭���?B-���1�S�o[Fyٗv�t�@:���lbL��s◷��[ y�w�jrL(4M���,R���u�����{O��x) �c?U�� ��??��!��hf6���v��k`�3�"F�=`������	�(�remy�d,���].�ե<pb�|M��9n�ٜ����D���B��]{�uBc�Z+�;e���l�1��ǌ�Q�
Nc� ��)�&�@��E�/i3��=d3Zo@>$'*�*HL��V4����3�Ծ�~50��~JΗ�`TD��s��~ç<Q1�]K"��%�f�5�Ϝ0���en�ƥa��{�=���s������+o�1�;�jO�\w�I3�D1X�>gy�W9م�'����/�j串'_��� ������I� ���W��Z�#x� �v�{1�#Vl�c�}&"R_�Ϲ1z�Bv�ba���>�(r5�ʮl�eF{2��7a�$�tK�� ���9?�eYf
�?	@��`�~ubEa�LTcT'Gv�����ٿe���f!���TX�i[�H�)?���=k�6zP]���i;��ɋ1���"dT��B��N�'*c��#�Jv,m	��Ț>l��Z��`���#�⸝�	0[������zI�K�-ԩ=3��c�Y� 9�LP*aL�KSbJ��ݓ���� R�F)�J<���N��~����Lx�J@L)dsI�,�)>۝��4h9�Byi���H��[���(7s��a8a�hcx$s�4�EoO��Xe֔aq�����g�;���,E���
���~qU_@Ie4��f	=:o�Wx'�|���B@k��J�����p�;��5n��� 4T�����ZFD��5�A��7�K6�OZ�>^mG���Zm����lBO(tq�9Gf��z h����Ci(O�20���p�\vG$f�Id�ʧ����+��&v&	;*qBs�[�[]�9�R�JJ�Gjm��ӯ	�G��Kc�<Ir�M"�$�Zɓ��ߦ_�憶Z���d,3h��,�+{�r��/>r�#}�3AP��o�*���p�4��z�Fv����ca��e�7d�Y#A��M�<}�c:Gw\ms�b�eO�\�hz	ly<w�5��9�4ǰg���)'��G����qY��1��8	K��iI1?�1��j�����Wl��<Z�-���4^��^��HC'���5�FRC�AC/���������%r�OHtn#9����_#ap���V��\\���'2�K����sf�ޙ2�q�}�E�(!�C�o!�|�Sr�%Cj�a�`�O���O��B@�d�i��X1,�P�����-A�B��&"v�8�0��խ)��5�K���'G�7X������=�3���3���x��{  �ċ�m������@��૤��*���>����q��l�7���P_� �7n���®�I���Ω���+���s�%f���Q����I�@8�m��>��Ì��<Ѹ�1�oaa.��ji��P����`��WUh]�WN~���@P'�Ǝ���Y��Z[ы`�G瞏�[>�/�� rXD���2�!A���gR,_������BK�ǰ��n��Jӻf�i�ȧЮ>m��탶��@�π�Tu�,kk���S��Vr!�>n��>����;�D�p<8�c"[��hX"��J���i��G��q+Zj-w;*E��5��#/#��?��e�k ��Ђ��Yz/^^��|��Q�.;�����|s��l;9�$�������ٗ�ɫ#���9���Yv);wM�Dx ��!e�Ӝ6r��kj2�O�>�a�6�{��*����v��rJ�ܫ����_�����8Jj�&X ���JH�"-��-��P�;��8��+��Ը7�Y-L�����5���W{M�M�u�u�����JoN֟��E�$X�eG�7k_��k�/��Y��6O9�h����wDLU���"2�v�o���Z�2x�4؈�~��r1Z�蘑ʸ�(��Ȍ
�T�
� r��P b��ʠRk��U3��g�!����o����ڠ/�e|�|'�y�>�G��>�a�HR���ǃ)�����H�l[���0|���+��i5�4_����;��=Ϡ��B����~`�?%�%��w�͵5��B�sxNM9�������zl��!��
x�1u������fP��3�+>��Р9}�?ʷ�&��-��)����a!#C~Ħ����(o�̮��ׅ������տrّ׈��$7���F�,�:G��5'7�0�Jf�J���\	[�-Bp�	(vq�˘�����3~0Nx���b��Rg�M�2��+���y�����:�K�э�?��� ���"���͂H-�� 76r�2����pi"��R�ہ;u��T��EYW�6$%���N��|�q����F	�-�)��@jD���FP�})���X��m�z�h�׫��|�>ЏA�� ��	�f;�B��@7�g>!
�Gil�}��VaBh��4�B"�~��j��o�O���kg���I�l�� @A��#�Ԁ���I��!0�[���͐Щop{�	��n��N�(��w1��I���*�����(�rǮ�;�@H\63��}����G���+5G�����2MG.�/WG��3��Ƚ&>�n�A���w��޻j�e�F�敞��z|�A���MD�P ZKA �d*��/�q�+k�A��	�n�1f5m��~���!�K4
9�1��><��B��B��]2��v��b���b-��=#H8���8Q�ɘ.
J9��R%�Q�#�fuvޗ�*m��n ��)K��n�PO�����R��v���5|���n;x�E��XHg�u�����F��8���F+,�.�� �a"�,5�_�� �X��^����С�eq���x@B�xS>3(3ۨt�k��Q#��}��ePha�Cۯ�`t �^l�V�9�t�F	���k���:���PO���7��S�g(.�e��X<�,�#����P b��%�@ ��T�f�h��n���J���R�
���ք��$������P�e�TVܯ��?��ƽ���;ܬvn!@����KC�ZY[p�&ab�"���G-�Ns-EŰ�r���Ӕ������� XTh�#d^e���Ѿy0<��W�D��&�)�u�����ͤe<|{�،Q���Y�Y�m0[Z��G4��=�k15 t�o�I��a\��V�J�%�=&�4�=��8�zV2l�q�Cg�
�"������A��?��P���}Fp vFMs��>����*}k+_LT̴��#g\[��Hu�1CN�&����Q�^��઼O��n����4ʼk��u���V�{���=O�/�#'j0&r�12&<�����Gh��ɩ&���K�ĎqȖ�_��B�k�"1'������=ې�H�=zTΪ���U�bwW��-\�R���r+J,Z�ް��\�����zx��v��em�C�w����[�� �8T���g��WtX٢��N��Si�F�o���Z����*���A��\l�m.�NΘՏp�5���������\�|j��o)]�
�Wf���~R��P��|x�a�ɩ�ȋan-䜘^���5H��nhO�N��/�hFb�X�M�VF����b�U�CL��Z�-�uvQ�����j>O0�[98�����A���^<U�/U��- x �ʍ��J�ŢM9s�!`A���Ԧ��7{��!�#H��% 8�!q����7*ؿM�ب�sU�0]��������@��V)�����M��y<��1�7>f�+�/��S/�%	
I.^����G�1�����ArqB=���&�H�r��kO��c�����R�R]�F�(	r�q����&`�3�խ��~d�gnf�/?��W�g�P_)�PN��������Qs+A
�LF{d��<0�X]T���v'S�'�Cؕ�O��j��C]xG�HƂ�&�$����/�X�zz L�0��^PBO�u�X^۸��O���.�#��ZPF+�6���Az��D�X%�8^���V��H8`� }'¦ ��� �|�֗8z�.wf|�ڥV�O���a咙�
�&]��ʐV ,99 H%�L����&���$R�>��5���7�볩���Ց}9�d����4>�~`���h�(OFX �y�c�`��n[�����m�S"~E�����9����� ��K׻�5C��0��E�[�����CdK}+���K������3�� !��F���D���w��� Р�Z*[iO�B�X>x��٭$��H��7Α��� i��B��||Z�&m�N/&�'�'����u�g�eA�K�v��G��]u�p/����
��¨����?��~h�IKU½�,�@N��)��+M�g
����R>̷n����P�<+��o��>7]��H�*���dl���3(��0fx�?���P2ΰ�R\�O�J�_�Q���R�\&�]��^�>���3��K��v�|%H����pL�	�w��3����t<<�X�r5��\I��[C��r*C�V~��>4���ə�4uh�֪\�f��U�����`�tZ���3n���ق������c/�G��YH�41����?��MT�;�*qՄE��z`~��xDbz�YI� �;�4˄3���U�eEMD�அA���i�v�.U����N��-��I+2�W�As$��&pX�m�@�r�}�����(@d��O�İ��!N��� j�϶/r�G� �b���@�������H�>�����x>����0��hFE�N�4&u̔�2\�%qt�/�#����{f�E�I�����ג�z�H��� �l�
BjI~D��:�����VK�o��a�?�Y�����H��9!�!6�[c0'3@�"E�QT��"�����]�y+���Z�ޢ@R�p0�@Ru�=Y@(#6C� k^��hh��q�JKr	#��z��"�v��IU����!T�����ZVu�"�h��6��7����w�6��r���~�-��U��G�_�K��g�-<��-�j���R��+��A'�wEmщ�&4�bG"#T�W� }5��ܣ������H���\��~���n�Tn�y*�(
���.ͣB6<���Ћe�/$ vH��WN�5�B�XY��$�G��kΰ����؂���(�dD<�8
���(&��>���USFR�Q0	���p�����I�G�	-&��!�Ĩ�=�v���M�#���eZ�J}V��ZT���ut�0�o��E,�-�C&��C>�`b�v���ğt����Lz��Ҟ������)�>N#ej�5z�IV���x'�7G�G��X��y�F*�x��x�Sز��sX��$�%�Jj��hd�<q��w�xF���C`�=�����E證��l�Er�0�����y,*�4�:%�ڼ!��g��#�`���3�2Eu|*=	LZȎ�篾�L��1�@Iː�_)�2��;qꄔ�Rn�
f��fif�x�j�{���6�r�+��5��~+�:k�1�z�GwTE�d�ZfQ����v�tw��YOIk��� ����ۘ�����W/y��m7󪐅�v�:���4����/J40l�+X�^����]Gv��;Z��l��$E�@R	Q'�C�W���/�2��4 .FDn?��9��磎}`�F�+�BdQ�-3?pDY�x�I[d.�|������ϴ�;�� �g�a�-���P��@�6:s��k���D_���S�������w�.Uu�ڻ��u�|ŶZİ_��NS2�ԑ�*�ɍ���w�
��oh�D�T&d(�#S��:�yr�����Vn)D�L��@�����׷Du�#W�s0�5s��ЯN����B|'��kt��`i�3��Yœn��kv�N`���}l#1<�_��k/��F⢃LK$Q�^���$���%���յ�W�wF`�3,Q$x�nb�ф��F����J������Z�%J� ��\[�,��(΀��!S�$ϕg��X���sX0�#�Yg2�5�q/�������Đ���(V�[�[-�����Y.�`PR�[�se�|�6|bQa�zgq�^�3<�0gN��8B�ԓ�i����}w=׭�F���Z�V�w�W�ؾ���$�+��������JA*n��HA��LX�!M�4%�Dh8|UIB@
��G�\�~T-CH?gᬃ��9ο����v�F ̊��6�[���$�xTK;��ot�`��5�UAe� l�j-�T,l��8�[R$	c���P��3��ś�mC�
05�m"A��Hn=ϻ�g=
��D%�u� wQ�@�C�l��6Mڱ�M�/5�T�|��"D�]zͻ����&��V
�:�'+C�X!0�-��-�'a�7��"DK�$FA�Q��y��_��f%(V��OS٪�c�>B���e@�BUY���HJ#?�����ΞJ?��T�<�nYd�	=o~��x	��8����Wڈ�C�|��%\*�u���tS�/���j�[�����o�h����q�Vz���6mߜ���o���[�Y�Fp�;X���$��b�L��z��$���D³A��6G�/P!U��K�xc�Ei��/� (zk��|E��>X��]�����6�ߢaB�f�hHN	�������w�k�s�d���Ռ�8H�v���A��g�)W�U���dS
�c�������YpB��bėa���-�Ʉ�"�� ��(n`���'��)��tί�YE����-�RO?�u<��V�ց�����z2O"�ju�5kJ�nU���4ްF�M)�*
Os,p>��6`i�Bo�K�l��X^� �D�#!����]>$����n�۲c���X<nO�tq��"*�����d搘�=�H4	�p	_�rV0k��M���M�e���I���P�~�=E~�����|Q�.I��C�����H�s�ڄ��P8� ��O�fN��Ҫ2���|8�<�/