void 0!==t&&t<this.scanner.source.length?this.locationMap.getLocation(t):this.scanner.eof?this.locationMap.getLocation(Ln(this.scanner.source,this.scanner.source.length-1)):this.locationMap.getLocation(this.scanner.tokenStart);throw new l(e||"Unexpected input",this.scanner.source,n.offset,n.line,n.column)}};for(var n in e=function(e){var t={context:{},scope:{},atrule:{},pseudo:{}};if(e.parseContext)for(var n in e.parseContext)switch(typeof e.parseContext[n]){case"function":t.context[n]=e.parseContext[n];break;case"string":t.context[n]=Wn(e.parseContext[n])}if(e.scope)for(var n in e.scope)t.scope[n]=e.scope[n];if(e.atrule)for(var n in e.atrule){var r=e.atrule[n];r.parse&&(t.atrule[n]=r.parse)}if(e.pseudo)for(var n in e.pseudo){var a=e.pseudo[n];a.parse&&(t.pseudo[n]=a.parse)}if(e.node)for(var n in e.node)t[n]=e.node[n].parse;return t}(e||{}))t[n]=e[n];return function(e,n){var r,a=(n=n||{}).context||"default",i=n.onComment;if(we(e,t.scanner),t.locationMap.setSource(e,n.offset,n.line,n.column),t.filename=n.filename||"<unknown>",t.needPositions=Boolean(n.positions),t.onParseError="function"==typeof n.onParseError?n.onParseError:En,t.onParseErrorThrow=!1,t.parseAtrulePrelude=!("parseAtrulePrelude"in n)||Boolean(n.parseAtrulePrelude),t.parseRulePrelude=!("parseRulePrelude"in n)||Boolean(n.parseRulePrelude),t.parseValue=!("parseValue"in n)||Boolean(n.parseValue),t.parseCustomProperty="parseCustomProperty"in n&&Boolean(n.parseCustomProperty),!t.context.hasOwnProperty(a))throw new Error("Unknown context `"+a+"`");return"function"==typeof i&&t.scanner.forEachToken((n,r,a)=>{if(n===Rn){const n=t.getLocation(r,a),o=Tn(e,a-2,a,"*/")?e.slice(r+2,a-2):e.slice(r+2,a);i(o,n)}}),r=t.context[a].call(t,n),t.scanner.eof||t.error(),r}}(e),n=function(e){var t=function(e){var t={};for(var n in e.node)if(ar.call(e.node,n)){var r=e.node[n];if(!r.structure)throw new Error("Missed `structure` field in `"+n+"` node type definition");t[n]=lr(0,r)}return t}(e),n={},r={},a=Symbol("break-walk"),i=Symbol("skip-node");for(var o in t)ar.call(t,o)&&null!==t[o]&&(n[o]=cr(t[o],!1),r[o]=cr(t[o],!0));var s=ur(n),l=ur(r),c=function(e,o){function c(e,t,n){var r=h.call(m,e,t,n);return r===a||r!==i&&(!(!p.hasOwnProperty(e.type)||!p[e.type](e,m,c,u))||d.call(m,e,t,n)===a)}var u=(e,t,n,r)=>e||c(t,n,r),h=ir,d=ir,p=n,m={break:a,skip:i,root:e,stylesheet:null,atrule:null,atrulePrelude:null,rule:null,selector:null,block:null,declaration:null,function:null};if("function"==typeof o)h=o;else if(o&&(h=or(o.enter),d=or(o.leave),o.reverse&&(p=r),o.visit)){if(s.hasOwnProperty(o.visit))p=o.reverse?l[o.visit]:s[o.visit];else if(!t.hasOwnProperty(o.visit))throw new Error("Bad value `"+o.visit+"` for `visit` option (should be: "+Object.keys(t).join(", ")+")");h=sr(h,o.visit),d=sr(d,o.visit)}if(h===ir&&d===ir)throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");c(e)};return c.break=a,c.skip=i,c.find=function(e,t){var n=null;return c(e,(function(e,r,i){if(t.call(this,e,r,i))return n=e,a})),n},c.findLast=function(e,t){var n=null;return c(e,{reverse:!0,enter:function(e,r,i){if(t.call(this,e,r,i))return n=e,a}}),n},c.findAll=function(e,t){var n=[];return c(e,(function(e,r,a){t.call(this,e,r,a)&&n.push(e)})),n},c}(e),r=function(e){function t(e){if(!nr.call(n,e.type))throw new Error("Unknown node type: "+e.type);n[e.type].call(this,e)}var n={};if(e.node)for(var r in e.node)n[r]=e.node[r].generate;return function(e,n){var r="",a={children:rr,node:t,chunk:function(e){r+=e},result:function(){return r}};return n&&("function"==typeof n.decorator&&(a=n.decorator(a)),n.sourceMap&&(a=function(e){var t=new er,n=1,r=0,a={line:1,column:0},i={line:0,column:0},o=!1,s={line:1,column:0},l={generated:s},c=e.node;e.node=function(e){if(e.loc&&e.loc.start&&tr.hasOwnProperty(e.type)){var u=e.loc.start.line,h=e.loc.start.column-1;i.line===u&&i.column===h||(i.line=u,i.column=h,a.line=n,a.column=r,o&&(o=!1,a.line===s.line&&a.column===s.column||t.addMapping(l)),o=!0,t.addMapping({source:e.loc.source,original:i,generated:a}))}c.call(this,e),o&&tr.hasOwnProperty(e.type)&&(s.line=n,s.column=r)};var u=e.chunk;e.chunk=function(e){for(var t=0;t<e.length;t++)10===e.charCodeAt(t)?(n++,r=0):r++;u(e)};var h=e.result;return e.result=function(){return o&&t.addMapping(l),{css:h(),map:t}},e}(a))),a.node(e),a.result()}}(e),a=function(e){return{fromPlainObject:function(t){return e(t,{enter:function(e){e.children&&e.children instanceof i==0&&(e.children=(new i).fromArray(e.children))}}),t},toPlainObject:function(t){return e(t,{leave:function(e){e.children&&e.children instanceof i&&(e.children=e.children.toArray())}}),t}}}(n),o={List:i,SyntaxError:l,TokenStream:H,Lexer:vn,vendorPrefix:ne.vendorPrefix,keyword:ne.keyword,property:ne.property,isCustomProperty:ne.isCustomProperty,definitionSyntax:kn,lexer:null,createLexer:function(e){return new vn(e,o,o.lexer.structure)},tokenize:we,parse:t,walk:n,generate:r,find:n.find,findLast:n.findLast,findAll:n.findAll,clone:hr,fromPlainObject:a.fromPlainObject,toPlainObject:a.toPlainObject,createSyntax:function(e){return kr(vr({},e))},fork:function(t){var n=vr({},e);return kr("function"==typeof t?t(n,Object.assign):vr(n,t))}};return o.lexer=new vn({generic:!0,types:e.types,atrules:e.atrules,properties: