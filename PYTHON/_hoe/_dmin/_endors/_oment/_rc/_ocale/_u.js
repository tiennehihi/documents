'use strict';

var parseCst = require('./parse-cst.js');
var Document = require('./Document-9b4560a1.js');
require('./PlainValue-ec8e588e.js');
require('./resolveSeq-d03cb037.js');
require('./Schema-88e323a7.js');
require('./warnings-1000a372.js');

function testEvents(src, options) {
  const opt = Object.assign({
    keepCstNodes: true,
    keepNodeTypes: true,
    version: '1.2'
  }, options);
  const docs = parseCst.parse(src).map(cstDoc => new Document.Document(opt).parse(cstDoc));
  const errDoc = docs.find(doc => doc.errors.length > 0);
  const error = errDoc ? errDoc.errors[0].message : null;
  const events = ['+STR'];

  try {
    for (let i = 0; i < docs.length; ++i) {
      const doc = docs[i];
      let root = doc.contents;
      if (Array.isArray(root)) root = root[0];
      const [rootStart, rootEnd] = doc.range || [0, 0];
      let e = doc.errors[0] && doc.errors[0].source;
      if (e && e.type === 'SEQ_ITEM') e = e.node;
      if (e && (e.type === 'DOCUMENT' || e.range.start < rootStart)) throw new Error();
      let docStart = '+DOC';
      const pre = src.slice(0, rootStart);
      const explicitDoc = /---\s*$/.test(pre);
      if (explicitDoc) docStart += ' ---';else if (!doc.contents) continue;
      events.push(docStart);
      addEvents(events, doc, e, root);
      if (doc.contents && doc.contents.length > 1) throw new Error();
      let docEnd = '-DOC';

      if (rootEnd) {
        const post = src.slice(rootEnd);
        if (/^\.\.\./.test(post)) docEnd += ' ...';
      }

      events.push(docEnd);
    }
  } catch (e) {
    return {
      events,
      error: error || e
    };
  }

  events.push('-STR');
  return {
    events,
    error
  };
}

function addEvents(events, doc, e, node) {
  if (!node) {
    events.push('=VAL :');
    return;
  }

  if (e && node.cstNode === e) throw new Error();
  let props = '';
  let anchor = doc.anchors