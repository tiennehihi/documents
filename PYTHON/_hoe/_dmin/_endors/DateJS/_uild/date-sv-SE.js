(e.length>0)return e[0].local;for(const{defaultVariableName:e,id:r,isChunk:a,name:o,namedExportsMode:l,namespaceVariableName:h,reexports:c}of t)if(c)return Tn(o,c[0].imported,l,a,e,h,i,r,s,n)}(e,t,s,a,d)};`;let m="";for(const{defaultVariableName:e,id:n,isChunk:o,name:h,namedExportsMode:u,namespaceVariableName:f,reexports:g}of t)if(g&&i)for(const t of g)if("*"!==t.reexported){const i=Tn(h,t.imported,u,o,e,f,s,n,a,d);if(m&&(m+=p),"*"!==t.imported&&t.needsLiveBinding){const[e,s]=c([],{functionReturn:!0,lineBreakIndent:null,name:null});m+=`Object.defineProperty(exports,${l}'${t.reexported}',${l}{${p}${r}enumerable:${l}true,${p}${r}get:${l}${e}${i}${s}${p}});`}else m+=`exports${d(t.reexported)}${l}=${l}${i};`}for(const{exported:t,local:i}of e){const e=`exports${d(t)}`,s=i;e!==s&&(m&&(m+=p),m+=`${e}${l}=${l}${s};`)}for(const{name:e,reexports:s}of t)if(s&&i)for(const t of s)if("*"===t.reexported){m&&(m+=p);const i=`{${p}${r}if${l}(k${l}!==${l}'default'${l}&&${l}!exports.hasOwnProperty(k))${l}${Rn(e,t.needsLiveBinding,r,n)}${f}${p}}`;m+="var"===h&&t.needsLiveBinding?`Object.keys(${e}).forEach(${u(["k"],{isAsync:!1,name:null})}${i});`:`for${l}(${h} k in ${e})${l}${i}`}return m?`${p}${p}${m}`:""}function Tn(e,t,i,s,n,r,a,o,l,h){if("default"===t){if(!s){const t=String(a(o)),i=gs[t]?n:e;return ys(t,l)?`${i}${h("default")}`:i}return i?`${e}${h("default")}`:e}return"*"===t?(s?!i:xs[String(a(o))])?r:e:`${e}${h(t)}`}function On(e){return e([["value","true"]],{lineBreakIndent:null})}function Mn(e,t,i,{_:s,getObject:n}){if(e){if(t)return i?`Object.defineProperties(exports,${s}${n([["__esModule",On(n)],[null,`[Symbol.toStringTag]:${s}${Ms(n)}`]],{lineBreakIndent:null})});`:`Object.defineProperty(exports,${s}'__esModule',${s}${On(n)});`;if(i)return`Object.defineProperty(exports,${s}Symbol.toStringTag,${s}${Ms(n)});`}return""}const Rn=(e,t,i,{_:s,getDirectReturnFunction:n,n:r})=>{if(t){const[t,a]=n([],{functionReturn:!0,lineBreakIndent:null,name:null});return`Object.defineProperty(exports,${s}k,${s}{${r}${i}${i}enumerable:${s}true,${r}${i}${i}get:${s}${t}${e}[k]${a}${r}${i}})`}return`exports[k]${s}=${s}${e}[k]`};function Dn(e,t,i,s,n,r,a,o){const{_:l,cnst:h,n:c}=o,u=new Set,d=[],p=(e,t,i)=>{u.add(t),d.push(`${h} ${e}${l}=${l}/*#__PURE__*/${t}(${i});`)};for(const{defaultVariableName:i,imports:s,id:n,isChunk:r,name:a,namedExportsMode:o,namespaceVariableName:l,reexports:h}of e)if(r){for(const{imported:e,reexported:t}of[...s||[],...h||[]])if("*"===e&&"*"!==t){o||p(l,fs,a);break}}else{const e=String(t(n));let r=!1,o=!1;for(const{imported:t,reexported:n}of[...s||[],...h||[]]){let s,h;"default"===t?r||(r=!0,i!==l&&(h=i,s=gs[e])):"*"===t&&"*"!==n&&(o||(o=!0,s=xs[e],h=l)),s&&p(h,s,a)}}return`${bs(u,r,a,o,i,s,n)}${d.length>0?`${d.join(c)}${c}${c}`:""}`}function Ln(e,t){return"."!==e[0]?e:t?(i=e).endsWith(".js")?i:i+".js":Nn(e);var i}const Vn={assert:!0,buffer:!0,console:!0,constants:!0,domain:!0,events:!0,http:!0,https:!0,os:!0,path:!0,process:!0,punycode:!0,querystring:!0,stream:!0,string_decoder:!0,timers:!0,tty:!0,url:!0,util:!0,vm:!0,zlib:!0};function Bn(e,t){const i=t.map((({id:e})=>e)).filter((e=>e in Vn));i.length&&e({code:"MISSING_NODE_BUILTINS",message:`Creating a browser bundle that depends on Node.js built-in modules (${le(i)}). You might need to include https://github.com/FredKSchott/rollup-plugin-polyfill-node`,modules:i})}const Fn=(e,t)=>e.split(".").map(t).join("");function zn(e,t,i,s,{_:n,getPropertyAccess:r}){const a=e.split(".");a[0]=("function"==typeof i?i(a[0]):i[a[0]])||a[0];const o=a.pop();let l=t,h=a.map((e=>(l+=r(e),`${l}${n}=${n}${l}${n}||${n}{}`))).concat(`${l}${r(o)}`).join(`,${n}`)+`${n}=${n}${s}`;return a.length>0&&(h=`(${h})`),h}function jn(e){let t=e.length;for(;t--;){const{imports:i,reexports:s}=e[t];if(i||s)return e.slice(0,t+1)}return[]}const Un=({dependencies:e,exports:t})=>{const i=new Set(t.map((e=>e.exported)));i.add("default");for(const{reexports:t}of e)if(t)for(const e of t)"*"!==e.reexported&&i.add(e.reexported);return i},Gn=(e,t,{_:i,cnst:s,getObject:n,n:r})=>e?`${r}${t}${s} _starExcludes${i}=${i}${n([...e].map((e=>[e,"1"])),{lineBreakIndent:{base:t,t:t}})};`:"",Hn=(e,t,{_:i,n:s})=>e.length?`${s}${t}var ${e.join(`,${i}`)};`:"",Wn=(e,t,i)=>qn(e.filter((e=>e.hoisted)).map((e=>({name:e.exported,value:e.local}))),t,i);function qn(e,t,{_:i,n:s}){return 0===e.length?"":1===e.length?`exports('${e[0].name}',${i}${e[0].value});${s}${s}`:`exports({${s}`+e.map((({name:e,value:s})=>`${t}${e}:${i}${s}`)).join(`,${s}`)+`${s}});${s}${s}`}const Kn=(e,t,i)=>qn(e.filter((e=>e.expression)).map((e=>({name:e.exported,value:e.local}))),t,i),Xn=(e,t,i)=>qn(e.filter((e=>e.local===rn)).map((e=>({name:e.exported,value:rn}))),t,i);function Yn(e,t,i){return e?`${t}${Fn(e,i)}`:"null"}var Qn={amd:function(e,{accessedGlobals:t,dependencies:i,exports:s,hasExports:n,id:r,indent:a,intro:o,isEntryFacade:l,isModuleFacade:h,namedExportsMode:c,outro:u,snippets:d,warn:p},{amd:f,esModule:m,externalLiveBindings:g,freeze:y,interop:x,namespaceToStringTag:E,strict:b}){Bn(p,i);const v=i.map((e=>`'${Ln(e.id,f.forceJsExtensionForImports)}'`)),S=i.map((e=>e.name)),{n:A,getNonArrowFunctionIntro:I,_:P}=d;c&&n&&(S.unshift("exports"),v.unshift("'exports'")),t.has("require")&&(S.unshift("require"),v.unshift("'require'")),t.has("module")&&(S.unshift("module"),v.unshift("'module'"));const k=_n(f,r),w=(k?`'${k}',${P}`:"")+(v.length?`[${v.join(`,${P}`)}],${P}`:""),C=b?`${P}'use strict';`:"";e.prepend(`${o}${Dn(i,x,g,y,E,t,a,d)}`);const N=$n(s,i,c,x,d,a,g);let _=Mn(c&&n,l&&m,h&&E,d);return _&&(_=A+A+_),e.append(`${N}${_}${u}`),e.indent(a).prepend(`${f.define}(${w}(${I(S,{isAsync:!1,name:null})}{${C}${A}${A}`).append(`${A}${A}}));`)},cjs:function(e,{accessedGlobals:t,dependencies:i,exports:s,hasExports:n,indent:r,intro:a,isEntryFacade:o,isModuleFacade:l,namedExportsMode:h,outro:c,snippets:u},{compact:d,esModule:p,externalLiveBindings:f,freeze:m,interop:g,namespaceToStringTag:y,strict:x}){const{_:E,n:b}=u,v=x?`'use strict';${b}${b}`:"";let S=Mn(h&&n,o&&p,l&&y,u);S&&(S+=b+b);const A=function(e,{_:t,cnst:i,n:s},n){let r="",a=!1;for(const{id:o,name:l,reexports:h,imports:c}of e)h||c?(r+=n&&a?",":`${r?`;${s}`:""}${i} `,a=!0,r+=`${l}${t}=${t}require('${o}')`):(r&&(r+=n&&!a?",":`;${s}`),a=!1,r+=`require('${o}')`);return r?`${r};${s}${s}`:""}(i,u,d),I=Dn(i,g,f,m,y,t,r,u);e.prepend(`${v}${a}${S}${A}${I}`);const P=$n(s,i,h,g,u,r,f,`module.exports${E}=${E}`);return e.append(`${P}${c}`)},es:function(e,{accessedGlobals:t,indent:i,intro:s,outro:n,dependencies:r,exports:a,snippets:o},{externalLiveBindings:l,freeze:h,namespaceToStringTag:c}){const{_:u,n:d}=o,p=function(e,t){const i=[];for(const{id:s,reexports:n,imports:r,name:a}of e)if(n||r){if(r){let e=null,n=null;const a=[];for(const t of r)"default"===t.imported?e=t:"*"===t.imported?n=t:a.push(t);n&&i.push(`import${t}*${t}as ${n.local} from${t}'${s}';`),e&&0===a.length?i.push(`import ${e.local} from${t}'${s}';`):a.length>0&&i.push(`import ${e?`${e.local},${t}`:""}{${t}${a.map((e=>e.imported===e.local?e.imported:`${e.imported} as ${e.local}`)).join(`,${t}`)}${t}}${t}from${t}'${s}';`)}if(n){let e=null;const o=[],l=[];for(const t of n)"*"===t.reexported?e=t:"*"===t.imported?o.push(t):l.push(t);if(e&&i.push(`export${t}*${t}from${t}'${s}';`),o.length>0){r&&r.some((e=>"*"===e.imported&&e.local===a))||i.push(`import${t}*${t}as ${a} from${t}'${s}';`);for(const e of o)i.push(`export${t}{${t}${a===e.reexported?a:`${a} as ${e.reexported}`} };`)}l.length>0&&i.push(`export${t}{${t}${l.map((e=>e.imported===e.reexported?e.imported:`${e.imported} as ${e.reexported}`)).join(`,${t}`)}${t}}${t}from${t}'${s}';`)}}else i.push(`import${t}'${s}';`);return i}(r,u);p.length>0&&(s+=p.join(d)+d+d),(s+=bs(null,t,i,o,l,h,c))&&e.prepend(s);const f=function(e,{_:t,cnst:i}){const s=[],n=[];for(const r of e)r.expression&&s.push(`${i} ${r.local}${t}=${t}${r.expression};`),n.push(r.exported===r.local?r.local:`${r.local} as ${r.exported}`);return n.length&&s.push(`export${t}{${t}${n.join(`,${t}`)}${t}};`),s}(a,o);return f.length&&e.append(d+d+f.join(d).trim()),n&&e.append(n),e.trim()},iife:function(e,{accessedGlobals:t,dependencies:i,exports:s,hasExports:n,indent:r,intro:a,namedExportsMode:o,outro:l,snippets:h,warn:c},{compact:u,esModule:d,extend:p,freeze:f,externalLiveBindings:m,globals:g,interop:y,name:x,namespaceToStringTag:E,strict:b}){const{_:v,getNonArrowFunctionIntro:S,getPropertyAccess:A,n:I}=h,P=x&&x.includes("."),k=!p&&!P;if(x&&k&&(_e(w=x)||Ne.test(w)))return fe({code:"ILLEGAL_IDENTIFIER_AS_NAME",message:`Given name "${x}" is not a legal JS identifier. If you need this, you can try "output.extend: true".`});var w;Bn(c,i);const C=jn(i),N=C.map((e=>e.globalName||"null")),_=C.map((e=>e.name));n&&!x&&c({code:"MISSING_NAME_OPTION_FOR_IIFE_EXPORT",message:'If you do not supply "output.name", you may not be able to access the exports of an IIFE bundle.'}),o&&n&&(p?(N.unshift(`this${Fn(x,A)}${v}=${v}this${Fn(x,A)}${v}||${v}{}`),_.unshift("exports")):(N.unshift("{}"),_.unshift("exports")));const $=b?`${r}'use strict';${I}`:"",T=Dn(i,y,m,f,E,t,r,h);e.prepend(`${a}${T}`);let O=`(${S(_,{isAsync:!1,name:null})}{${I}${$}${I}`;n&&(!x||p&&o||(O=(k?`var ${x}`:`this${Fn(x,A)}`)+`${v}=${v}${O}`),P&&(O=function(e,t,i,{_:s,getPropertyAccess:n,s:r},a){const o=e.split(".");o[0]=("function"==typeof i?i(o[0]):i[o[0]])||o[0],o.pop();let l=t;return o.map((e=>(l+=n(e),`${l}${s}=${s}${l}${s}||${s}{}${r}`))).join(a?",":"\n")+(a&&o.length?";":"\n")}(x,"this",g,h,u)+O));let M=`${I}${I}})(${N.join(`,${v}`)});`;n&&!p&&o&&(M=`${I}${I}${r}return exports;${M}`);const R=$n(s,i,o,y,h,r,m);let D=Mn(o&&n,d,E,h);return D&&(D=I+I+D),e.append(`${R}${D}${l}`),e.indent(r).prepend(O).append(M)},system:function(e,{accessedGlobals:t,dependencies:i,exports:s,hasExports:n,indent:r,intro:a,snippets:o,outro:l,usesTopLevelAwait:h},{externalLiveBindings:c,freeze:u,name:d,namespaceToStringTag:p,strict:f,systemNullSetters:m}){const{_:g,getFunctionIntro:y,getNonArrowFunctionIntro:x,n:E,s:b}=o,{importBindings:v,setters:S,starExcludes:A}=function(e,t,i,{_:s,cnst:n,getObject:r,getPropertyAccess:a,n:o}){const l=[],h=[];let c=null;for(const{imports:u,reexports:d}of e){const p=[];if(u)for(const e of u)l.push(e.local),"*"===e.imported?p.push(`${e.local}${s}=${s}module;`):p.push(`${e.local}${s}=${s}module${a(e.imported)};`);if(d){const o=[];let l=!1;for(const{imported:e,reexported:t}of d)"*"===t?l=!0:o.push([t,"*"===e?"module":`module${a(e)}`]);if(o.length>1||l){const a=r(o,{lineBreakIndent:null});l?(c||(c=Un({dependencies:e,exports:t})),p.push(`${n} setter${s}=${s}${a};`,`for${s}(${n} name in module)${s}{`,`${i}if${s}(!_starExcludes[name])${s}setter[name]${s}=${s}module[name];`,"}","exports(setter);")):p.push(`exports(${a});`)}else{const[e,t]=o[0];p.push(`exports('${e}',${s}${t});`)}}h.push(p.join(`${o}${i}${i}${i}`))}return{importBindings:l,setters:h,starExcludes:c}}(i,s,r,o),I=d?`'${d}',${g}`:"",P=t.has("module")?["exports","module"]:n?["exports"]:[];let k=`System.register(${I}[`+i.map((({id:e})=>`'${e}'`)).join(`,${g}`)+`],${g}(${x(P,{isAsync:!1,name:null})}{${E}${r}${f?"'use strict';":""}`+Gn(A,r,o)+Hn(v,r,o)+`${E}${r}return${g}{${S.length?`${E}${r}${r}setters:${g}[${S.map((e=>e?`${y(["module"],{isAsync:!1,name:null})}{${E}${r}${r}${r}${e}${E}${r}${r}}`:m?"null":`${y([],{isAsync:!1,name:null})}{}`)).join(`,${g}`)}],`:""}${E}`;k+=`${r}${r}execute:${g}(${x([],{isAsync:h,name:null})}{${E}${E}`;const w=`${r}${r}})${E}${r}}${b}${E}}));`;return e.prepend(a+bs(null,t,r,o,c,u,p)+Wn(s,r,o)),e.append(`${l}${E}${E}`+Kn(s,r,o)+Xn(s,r,o)),e.indent(`${r}${r}${r}`).append(w).prepend(k)},umd:function(e,{accessedGlobals:t,dependencies:i,exports:s,hasExports:n,id:r,indent:a,intro:o,namedExportsMode:l,outro:h,snippets:c,warn:u},{amd:d,compact:p,esModule:f,extend:m,externalLiveBindings:g,freeze:y,interop:x,name:E,namespaceToStringTag:b,globals:v,noConflict:S,strict:A}){const{_:I,cnst:P,getFunctionIntro:k,getNonArrowFunctionIntro:w,getPropertyAccess:C,n:N,s:_}=c,$=p?"f":"factory",T=p?"g":"global";if(n&&!E)return fe({code:"MISSING_NAME_OPTION_FOR_IIFE_EXPORT",message:'You must supply "output.name" for UMD bundles that have exports so that the exports are accessible in environments without a module loader.'});Bn(u,i);const O=i.map((e=>`'${Ln(e.id,d.forceJsExtensionForImports)}'`)),M=i.map((e=>`require('${e.id}')`)),R=jn(i),D=R.map((e=>Yn(e.globalName,T,C))),L=R.map((e=>e.name));l&&(n||S)&&(O.unshift("'exports'"),M.unshift("exports"),D.unshift(zn(E,T,v,(m?`${Yn(E,T,C)}${I}||${I}`:"")+"{}",c)),L.unshift("exports"));const V=_n(d,r),B=(V?`'${V}',${I}`:"")+(O.length?`[${O.join(`,${I}`)}],${I}`:""),F=d.define,z=!l&&n?`module.exports${I}=${I}`:"",j=A?`${I}'use strict';${N}`:"";let U;if(S){const e=p?"e":"exports";let t;t=!l&&n?`${P} ${e}${I}=${I}${zn(E,T,v,`${$}(${D.join(`,${I}`)})`,c)};`:`${P} ${e}${I}=${I}${D.shift()};${N}${a}${a}${$}(${[e].concat(D).join(`,${I}`)});`,U=`(${k([],{isAsync:!1,name:null})}{${N}${a}${a}${P} current${I}=${I}${function(e,t,{_:i,getPropertyAccess:s}){let n=t;return e.split(".").map((e=>n+=s(e))).join(`${i}&&${i}`)}(E,T,c)};${N}${a}${a}${t}${N}${a}${a}${e}.noConflict${I}=${I}${k([],{isAsync:!1,name:null})}{${I}${Yn(E,T,C)}${I}=${I}current;${I}return ${e}${_}${I}};${N}${a}})()`}else U=`${$}(${D.join(`,${I}`)})`,!l&&n&&(U=zn(E,T,v,U,c));const G=n||S&&l||D.length>0,H=[$];G&&H.unshift(T);const W=G?`this,${I}`:"",q=G?`(${T}${I}=${I}typeof globalThis${I}!==${I}'undefined'${I}?${I}globalThis${I}:${I}${T}${I}||${I}self,${I}`:"",K=G?")":"",X=G?`${a}typeof exports${I}===${I}'object'${I}&&${I}typeof module${I}!==${I}'undefined'${I}?${I}${z}${$}(${M.join(`,${I}`)})${I}:${N}`:"",Y=`(${w(H,{isAsync:!1,name:null})}{${N}`+X+`${a}typeof ${F}${I}===${I}'function'${I}&&${I}${F}.amd${I}?${I}${F}(${B}${$})${I}:${N}`+`${a}${q}${U}${K};${N}`+`})(${W}(${w(L,{isAsync:!1,name:null})}{${j}${N}`,Q=N+N+"}));";e.prepend(`${o}${Dn(i,x,g,y,b,t,a,c)}`);const J=$n(s,i,l,x,c,a,g);let Z=Mn(l&&n,f,b,c);return Z&&(Z=N+N+Z),e.append(`${J}${Z}${h}`),e.trim().indent(a).append(Q).prepend(Y)}};class Jn{constructor(e,t){this.isOriginal=!0,this.filename=e,this.content=t}traceSegment(e,t,i){return{column:t,line:e,name:i,source:this}}}class Zn{constructor(e,t){this.sources=t,this.names=e.names,this.mappings=e.mappings}traceMappings(){const e=[],t=new Map,i=[],s=[],n=new Map,r=[];for(const a of this.mappings){const o=[];for(const r of a){if(1===r.length)continue;const a=this.sources[r[1]];if(!a)continue;const l=a.traceSegment(r[2],r[3],5===r.length?this.names[r[4]]:"");if(l){const{column:a,line:h,name:c,source:{content:u,filename:d}}=l;let p=t.get(d);if(void 0===p)p=e.length,e.push(d),t.set(d,p),i[p]=u;else if(null==i[p])i[p]=u;else if(null!=u&&i[p]!==u)return fe({message:`Multiple conflicting contents for sourcemap source ${d}`});const f=[r[0],p,h,a];if(c){let e=n.get(c);void 0===e&&(e=s.length,s.push(c),n.set(c,e)),f[4]=e}o.push(f)}}r.push(o)}return{mappings:r,names:s,sources:e,sourcesContent:i}}traceSegment(e,t,i){const s=this.mappings[e];if(!s)return null;let n=0,r=s.length-1;for(;n<=r;){const e=n+r>>1,a=s[e];if(a[0]===t||n===r){if(1==a.length)return null;const e=this.sources[a[1]];return e?e.traceSegment(a[2],a[3],5===a.length?this.names[a[4]]:i):null}a[0]>t?r=e-1:n=e+1}return null}}function er(e){return function(t,i){return i.mappings?new Zn(i,[t]):(e({code:"SOURCEMAP_BROKEN",message:`Sourcemap is likely to be incorrect: a plugin (${i.plugin}) was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help`,plugin:i.plugin,url:"https://rollupjs.org/guide/en/#warning-sourcemap-is-likely-to-be-incorrect"}),new Zn({mappings:[],names:[]},[t]))}}function tr(e,t,i,s,n){let r;if(i){const t=i.sources,s=i.sourcesContent||[],n=$(e)||".",a=i.sourceRoot||".",o=t.map(((e,t)=>new Jn(M(n,a,e),s[t])));r=new Zn(i,o)}else r=new Jn(e,t);return s.reduce(n,r)}var ir={},sr=nr;function nr(e,t){if(!e)throw new Error(t||"Assertion failed")}nr.equal=function(e,t,i){if(e!=t)throw new Error(i||"Assertion failed: "+e+" != "+t)};var rr={exports:{}};"function"==typeof Object.create?rr.exports=function(e,t){t&&(e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}))}:rr.exports=function(e,t){if(t){e.super_=t;var i=function(){};i.prototype=t.prototype,e.prototype=new i,e.prototype.constructor=e}};var ar=sr,or=rr.export# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"@ungap/promise-all-settled@1.1.2":
  version "1.1.2"
  resolved "https://registry.yarnpkg.com/@ungap/promise-all-settled/-/promise-all-settled-1.1.2.tgz#aa58042711d6e3275dd37dc597e5d31e8c290a44"
  integrity sha512-sL/cEvJWAnClXw0wHk85/2L0G6Sj8UB0Ctc1TEMbKSsmpRosqhwj9gWgFRZSrBr2f9tiXISwNhCPmlfqUqyb9Q==

align-text@^0.1.1, align-text@^0.1.3:
  version "0.1.4"
  resolved "https://registry.yarnpkg.com/align-text/-/align-text-0.1.4.tgz#0cd90a561093f35d0a99256c22b7069433fad117"
  dependencies:
    kind-of "^3.0.2"
    longest "^1.0.1"
    repeat-string "^1.5.2"

ansi-colors@4.1.1:
  version "4.1.1"
  resolved "https://registry.yarnpkg.com/ansi-colors/-/ansi-colors-4.1.1.tgz#cbb9ae256bf750af1eab344f229aa27fe94ba348"
  integrity sha512-JoX0apGbHaUJBNl6yF+p6JAFYZ666/hhCGKN5t9QFjbJQKUU/g8MNbFDbvfrgKXvI1QpZplPOnwIo99lX/AAmA==

ansi-regex@^2.0.0:
  version "2.1.1"
  resolved "https://registry.yarnpkg.com/ansi-regex/-/ansi-regex-2.1.1.tgz#c3b33ab5ee360d86e0e628f0468ae7ef27d654df"
  integrity sha1-w7M6te42DYbg5ijwRorn7yfWVN8=

ansi-regex@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/ansi-regex/-/ansi-regex-3.0.0.tgz#ed0317c322064f79466c02966bddb605ab37d998"
  integrity sha1-7QMXwyIGT3lGbAKWa922Bas32Zg=

ansi-regex@^4.1.0:
  version "4.1.0"
  resolved "https://registry.yarnpkg.com/ansi-regex/-/ansi-regex-4.1.0.tgz#8b9f8f08cf1acb843756a839ca8c7e3168c51997"
  integrity sha512-1apePfXM1UOSqw0o9IiFAovVz9M5S1Dg+4TrDwfMewQ6p/rmMueb7tWZjQ1rx4Loy1ArBggoqGpfqqdI4rondg==

ansi-styles@^2.2.1:
  version "2.2.1"
  resolved "https://registry.yarnpkg.com/ansi-styles/-/ansi-styles-2.2.1.tgz#b432dd3358b634cf75e1e4664368240533c1ddbe"
  integrity sha1-tDLdM1i2NM914eRmQ2gkBTPB3b4=

ansi-styles@^3.2.0:
  version "3.2.1"
  resolved "https://registry.yarnpkg.com/ansi-styles/-/ansi-styles-3.2.1.tgz#41fbb20243e50b12be0f04b8dedbf07520ce841d"
  integrity sha512-VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==
  dependencies:
    color-convert "^1.9.0"

ansi-styles@^4.1.0:
  version "4.3.0"
  resolved "https://registry.yarnpkg.com/ansi-styles/-/ansi-styles-4.3.0.tgz#edd803628ae71c04c85ae7a0906edad34b648937"
  integrity sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==
  dependencies:
    color-convert "^2.0.1"

anymatch@^1.3.0:
  version "1.3.2"
  resolved "https://registry.yarnpkg.com/anymatch/-/anymatch-1.3.2.tgz#553dcb8f91e3c889845dfdba34c77721b90b9d7a"
  integrity sha512-0XNayC8lTHQ2OI8aljNCN3sSx6hsr/1+rlcDAotXJR7C1oZZHCNsfpbKwMjRA3Uqb5tF1Rae2oloTr4xpq+WjA==
  dependencies:
    micromatch "^2.1.5"
    normalize-path "^2.0.0"

anymatch@~3.1.1:
  version "3.1.1"
  resolved "https://registry.yarnpkg.com/anymatch/-/anymatch-3.1.1.tgz#c55ecf02185e2469259399310c173ce31233b142"
  integrity sha512-mM8522psRCqzV+6LhomX5wgp25YVibjh8Wj23I5RPkPppSVSjyKD2A2mBJmWGa+KN7f2D6LNh9jkBCeyLktzjg==
  dependencies:
    normalize-path "^3.0.0"
    picomatch "^2.0.4"

argparse@^1.0.7:
  version "1.0.10"
  resolved "https://registry.yarnpkg.com/argparse/-/argparse-1.0.10.tgz#bcd6791ea5ae09725e17e5ad988134cd40b3d911"
  integrity sha512-o5Roy6tNG4SL/FOkCAN6RzjiakZS25RLYFrcMttJqbdd8BWrnA+fGz57iN5Pb06pvBGvl5gQ0B48dJlslXvoTg==
  dependencies:
    sprintf-js "~1.0.2"

arr-diff@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/arr-diff/-/arr-diff-2.0.0.tgz#8f3b827f955a8bd669697e4a4256ac3ceae356cf"
  integrity sha1-jzuCf5Vai9ZpaX5KQlasPOrjVs8=
  dependencies:
    arr-flatten "^1.0.1"

arr-diff@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/arr-diff/-/arr-diff-4.0.0.tgz#d6461074febfec71e7e15235761a329a5dc7c520"
  integrity sha1-1kYQdP6/7HHn4VI1dhoyml3HxSA=

arr-flatten@^1.0.1, arr-flatten@^1.1.0:
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/arr-flatten/-/arr-flatten-1.1.0.tgz#36048bbff4e7b47e136644316c99669ea5ae91f1"
  integrity sha512-L3hKV5R/p5o81R7O02IGnwpDmkp6E982XhtbuwSe3O4qOtMMMtodicASA1Cny2U+aCXcNpml+m4dPsvsJ3jatg==

arr-union@^3.1.0:
  version "3.1.0"
  resolved "https://registry.yarnpkg.com/arr-union/-/arr-union-3.1.0.tgz#e39b09aea9def866a8f206e288af63919bae39c4"
  integrity sha1-45sJrqne+Gao8gbiiK9jkZuuOcQ=

array-unique@^0.2.1:
  version "0.2.1"
  resolved "https://registry.yarnpkg.com/array-unique/-/array-unique-0.2.1.tgz#a1d97ccafcbc2625cc70fadceb36a50c58b01a53"
  integrity sha1-odl8yvy8JiXMcPrc6zalDFiwGlM=

array-unique@^0.3.2:
  version "0.3.2"
  resolved "https://registry.yarnpkg.com/array-unique/-/array-unique-0.3.2.tgz#a894b75d4bc4f6cd679ef3244a9fd8f46ae2d428"
  integrity sha1-qJS3XUvE9s1nnvMkSp/Y9Gri1Cg=

assign-symbols@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/assign-symbols/-/assign-symbols-1.0.0.tgz#59667f41fadd4f20ccbc2bb96b8d4f7f78ec0367"
  integrity sha1-WWZ/QfrdTyDMvCu5a41Pf3jsA2c=

async-each@^1.0.0:
  version "1.0.3"
  resolved "https://registry.yarnpkg.com/async-each/-/async-each-1.0.3.tgz#b727dbf87d7651602f06f4d4ac387f47d91b0cbf"
  integrity sha512-z/WhQ5FPySLdvREByI2vZiTWwCnF0moMJ1hK9YQwDTHKh6I7/uSckMetoRGb5UBZPC1z0jlw+n/XCgjeH7y1AQ==

atob@^2.1.2:
  version "2.1.2"
  resolved "https://registry.yarnpkg.com/atob/-/atob-2.1.2.tgz#6d9517eb9e030d2436666651e86bd9f6f13533c9"
  integrity sha512-Wm6ukoaOGJi/73p/cl2GvLjTI5JM1k/O14isD73YML8StrH/7/lRFgmg8nICZgD3bZZvjwCGxtMOD3wWNAu8cg==

babel-cli@^6.26.0:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-cli/-/babel-cli-6.26.0.tgz#502ab54874d7db88ad00b887a06383ce03d002f1"
  integrity sha1-UCq1SHTX24itALiHoGODzgPQAvE=
  dependencies:
    babel-core "^6.26.0"
    babel-polyfill "^6.26.0"
    babel-register "^6.26.0"
    babel-runtime "^6.26.0"
    commander "^2.11.0"
    convert-source-map "^1.5.0"
    fs-readdir-recursive "^1.0.0"
    glob "^7.1.2"
    lodash "^4.17.4"
    output-file-sync "^1.1.2"
    path-is-absolute "^1.0.1"
    slash "^1.0.0"
    source-map "^0.5.6"
    v8flags "^2.1.1"
  optionalDependencies:
    chokidar "^1.6.1"

babel-code-frame@^6.26.0:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-code-frame/-/babel-code-frame-6.26.0.tgz#63fd43f7dc1e3bb7ce35947db8fe369a3f58c74b"
  integrity sha1-Y/1D99weO7fONZR9uP42mj9Yx0s=
  dependencies:
    chalk "^1.1.3"
    esutils "^2.0.2"
    js-tokens "^3.0.2"

babel-core@6:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-core/-/babel-core-6.26.0.tgz#af32f78b31a6fcef119c87b0fd8d9753f03a0bb8"
  dependencies:
    babel-code-frame "^6.26.0"
    babel-generator "^6.26.0"
    babel-helpers "^6.24.1"
    babel-messages "^6.23.0"
    babel-register "^6.26.0"
    babel-runtime "^6.26.0"
    babel-template "^6.26.0"
    babel-traverse "^6.26.0"
    babel-types "^6.26.0"
    babylon "^6.18.0"
    convert-source-map "^1.5.0"
    debug "^2.6.8"
    json5 "^0.5.1"
    lodash "^4.17.4"
    minimatch "^3.0.4"
    path-is-absolute "^1.0.1"
    private "^0.1.7"
    slash "^1.0.0"
    source-map "^0.5.6"

babel-core@^6.26.0:
  version "6.26.3"
  resolved "https://registry.yarnpkg.com/babel-core/-/babel-core-6.26.3.tgz#b2e2f09e342d0f0c88e2f02e067794125e75c207"
  integrity sha512-6jyFLuDmeidKmUEb3NM+/yawG0M2bDZ9Z1qbZP59cyHLz8kYGKYwpJP0UwUKKUiTRNvxfLesJnTedqczP7cTDA==
  dependencies:
    babel-code-frame "^6.26.0"
    babel-generator "^6.26.0"
    babel-helpers "^6.24.1"
    babel-messages "^6.23.0"
    babel-register "^6.26.0"
    babel-runtime "^6.26.0"
    babel-template "^6.26.0"
    babel-traverse "^6.26.0"
    babel-types "^6.26.0"
    babylon "^6.18.0"
    convert-source-map "^1.5.1"
    debug "^2.6.9"
    json5 "^0.5.1"
    lodash "^4.17.4"
    minimatch "^3.0.4"
    path-is-absolute "^1.0.1"
    private "^0.1.8"
    slash "^1.0.0"
    source-map "^0.5.7"

babel-generator@^6.26.0:
  version "6.26.1"
  resolved "https://registry.yarnpkg.com/babel-generator/-/babel-generator-6.26.1.tgz#1844408d3b8f0d35a404ea7ac180f087a601bd90"
  integrity sha512-HyfwY6ApZj7BYTcJURpM5tznulaBvyio7/0d4zFOeMPUmfxkCjHocCuoLa2SAGzBI8AREcH3eP3758F672DppA==
  dependencies:
    babel-messages "^6.23.0"
    babel-runtime "^6.26.0"
    babel-types "^6.26.0"
    detect-indent "^4.0.0"
    jsesc "^1.3.0"
    lodash "^4.17.4"
    source-map "^0.5.7"
    trim-right "^1.0.1"

babel-helper-builder-binary-assignment-operator-visitor@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-helper-builder-binary-assignment-operator-visitor/-/babel-helper-builder-binary-assignment-operator-visitor-6.24.1.tgz#cce4517ada356f4220bcae8a02c2b346f9a56664"
  dependencies:
    babel-helper-explode-assignable-expression "^6.24.1"
    babel-runtime "^6.22.0"
    babel-types "^6.24.1"

babel-helper-call-delegate@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-helper-call-delegate/-/babel-helper-call-delegate-6.24.1.tgz#ece6aacddc76e41c3461f88bfc575bd0daa2df8d"
  dependencies:
    babel-helper-hoist-variables "^6.24.1"
    babel-runtime "^6.22.0"
    babel-traverse "^6.24.1"
    babel-types "^6.24.1"

babel-helper-define-map@^6.24.1:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-helper-define-map/-/babel-helper-define-map-6.26.0.tgz#a5f56dab41a25f97ecb498c7ebaca9819f95be5f"
  dependencies:
    babel-helper-function-name "^6.24.1"
    babel-runtime "^6.26.0"
    babel-types "^6.26.0"
    lodash "^4.17.4"

babel-helper-explode-assignable-expression@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-helper-explode-assignable-expression/-/babel-helper-explode-assignable-expression-6.24.1.tgz#f25b82cf7dc10433c55f70592d5746400ac22caa"
  dependencies:
    babel-runtime "^6.22.0"
    babel-traverse "^6.24.1"
    babel-types "^6.24.1"

babel-helper-function-name@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-helper-function-name/-/babel-helper-function-name-6.24.1.tgz#d3475b8c03ed98242a25b48351ab18399d3580a9"
  dependencies:
    babel-helper-get-function-arity "^6.24.1"
    babel-runtime "^6.22.0"
    babel-template "^6.24.1"
    babel-traverse "^6.24.1"
    babel-types "^6.24.1"

babel-helper-get-function-arity@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-helper-get-function-arity/-/babel-helper-get-function-arity-6.24.1.tgz#8f7782aa93407c41d3aa50908f89b031b1b6853d"
  dependencies:
    babel-runtime "^6.22.0"
    babel-types "^6.24.1"

babel-helper-hoist-variables@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-helper-hoist-variables/-/babel-helper-hoist-variables-6.24.1.tgz#1ecb27689c9d25513eadbc9914a73f5408be7a76"
  dependencies:
    babel-runtime "^6.22.0"
    babel-types "^6.24.1"

babel-helper-optimise-call-expression@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-helper-optimise-call-expression/-/babel-helper-optimise-call-expression-6.24.1.tgz#f7a13427ba9f73f8f4fa993c54a97882d1244257"
  dependencies:
    babel-runtime "^6.22.0"
    babel-types "^6.24.1"

babel-helper-regex@^6.24.1:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-helper-regex/-/babel-helper-regex-6.26.0.tgz#325c59f902f82f24b74faceed0363954f6495e72"
  dependencies:
    babel-runtime "^6.26.0"
    babel-types "^6.26.0"
    lodash "^4.17.4"

babel-helper-remap-async-to-generator@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-helper-remap-async-to-generator/-/babel-helper-remap-async-to-generator-6.24.1.tgz#5ec581827ad723fecdd381f1c928390676e4551b"
  dependencies:
    babel-helper-function-name "^6.24.1"
    babel-runtime "^6.22.0"
    babel-template "^6.24.1"
    babel-traverse "^6.24.1"
    babel-types "^6.24.1"

babel-helper-replace-supers@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-helper-replace-supers/-/babel-helper-replace-supers-6.24.1.tgz#bf6dbfe43938d17369a213ca8a8bf74b6a90ab1a"
  dependencies:
    babel-helper-optimise-call-expression "^6.24.1"
    babel-messages "^6.23.0"
    babel-runtime "^6.22.0"
    babel-template "^6.24.1"
    babel-traverse "^6.24.1"
    babel-types "^6.24.1"

babel-helpers@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-helpers/-/babel-helpers-6.24.1.tgz#3471de9caec388e5c850e597e58a26ddf37602b2"
  integrity sha1-NHHenK7DiOXIUOWX5Yom3fN2ArI=
  dependencies:
    babel-runtime "^6.22.0"
    babel-template "^6.24.1"

babel-messages@^6.23.0:
  version "6.23.0"
  resolved "https://registry.yarnpkg.com/babel-messages/-/babel-messages-6.23.0.tgz#f3cdf4703858035b2a2951c6ec5edf6c62f2630e"
  integrity sha1-8830cDhYA1sqKVHG7F7fbGLyYw4=
  dependencies:
    babel-runtime "^6.22.0"

babel-plugin-check-es2015-constants@^6.22.0:
  version "6.22.0"
  resolved "https://registry.yarnpkg.com/babel-plugin-check-es2015-constants/-/babel-plugin-check-es2015-constants-6.22.0.tgz#35157b101426fd2ffd3da3f75c7d1e91835bbf8a"
  dependencies:
    babel-runtime "^6.22.0"

babel-plugin-external-helpers@^6.22.0:
  version "6.22.0"
  resolved "https://registry.yarnpkg.com/babel-plugin-external-helpers/-/babel-plugin-external-helpers-6.22.0.tgz#2285f48b02bd5dede85175caf8c62e86adccefa1"
  dependencies:
    babel-runtime "^6.22.0"

babel-plugin-syntax-async-functions@^6.8.0:
  version "6.13.0"
  resolved "https://registry.yarnpkg.com/babel-plugin-syntax-async-functions/-/babel-plugin-syntax-async-functions-6.13.0.tgz#cad9cad1191b5ad634bf30ae0872391e0647be95"

babel-plugin-syntax-exponentiation-operator@^6.8.0:
  version "6.13.0"
  resolved "https://registry.yarnpkg.com/babel-plugin-syntax-exponentiation-operator/-/babel-plugin-syntax-exponentiation-operator-6.13.0.tgz#9ee7e8337290da95288201a6a57f4170317830de"

babel-plugin-syntax-trailing-function-commas@^6.22.0:
  version "6.22.0"
  resolved "https://registry.yarnpkg.com/babel-plugin-syntax-trailing-function-commas/-/babel-plugin-syntax-trailing-function-commas-6.22.0.tgz#ba0360937f8d06e40180a43fe0d5616fff532cf3"

babel-plugin-transform-async-to-generator@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-plugin-transform-async-to-generator/-/babel-plugin-transform-async-to-generator-6.24.1.tgz#6536e378aff6cb1d5517ac0e40eb3e9fc8d08761"
  dependencies:
    babel-helper-remap-async-to-generator "^6.24.1"
    babel-plugin-syntax-async-functions "^6.8.0"
    babel-runtime "^6.22.0"

babel-plugin-transform-es2015-arrow-functions@^6.22.0:
  version "6.22.0"
  resolved "https://registry.yarnpkg.com/babel-plugin-transform-es2015-arrow-functions/-/babel-plugin-transform-es2015-arrow-functions-6.22.0.tgz#452692cb711d5f79dc7f85e440ce41b9f244d221"
  dependencies:
    babel-runtime "^6.22.0"

babel-plugin-transform-es2015-block-scoped-functions@^6.22.0:
  version "6.22.0"
  resolved "https://registry.yarnpkg.com/babel-plugin-transform-es2015-block-scoped-functions/-/babel-plugin-transform-es2015-block-scoped-functions-6.22.0.tgz#bbc51b49f964d70cb8d8e0b94e820246ce3a6141"
  dependencies:
    babel-runtime "^6.22.0"

babel-plugin-transform-es2015-block-scoping@^6.24.1:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-plugin-transform-es2015-block-scoping/-/babel-plugin-transform-es2015-block-scoping-6.26.0.tgz#d70f5299c1308d05c12f463813b0a09e73b1895f"
  dependencies:
    babel-runtime "^6.26.0"
    babel-template "^6.26.0"
    babel-traverse "^6.26.0"
    babel-types "^6.26.0"
    lodash "^4.17.4"

babel-plugin-transform-es2015-classes@^6.24.1, babel-plugin-transform-es2015-classes@^6.9.0:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-plugin-transform-es2015-classes/-/babel-plugin-transform-es2015-classes-6.24.1.tgz#5a4c58a50c9c9461e564b4b2a3bfabc97a2584db"
  dependencies:
    babel-helper-define-map "^6.24.1"
    babel-helper-function-name "^6.24.1"
    babel-helper-optimise-call-expression "^6.24.1"
    babel-helper-replace-supers "^6.24.1"
    babel-messages "^6.23.0"
    babel-runtime "^6.22.0"
    babel-template "^6.24.1"
    babel-traverse "^6.24.1"
    babel-types "^6.24.1"

babel-plugin-transform-es2015-computed-properties@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-plugin-transform-es2015-computed-properties/-/babel-plugin-transform-es2015-computed-properties-6.24.1.tgz#6fe2a8d16895d5634f4cd999b6d3480a308159b3"
  dependencies:
    babel-runtime "^6.22.0"
    babel-template "^6.24.1"

babel-plugin-transform-es2015-destructuring@^6.22.0:
  version "6.23.0"
  resolved "https://"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _utilities = require("../../utilities");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (context, report, typeForMessage) => {
  const sourceCode = context.getSourceCode();

  const getColon = (node, typeAnnotation) => {
    if (node.type === 'FunctionTypeParam') {
      return sourceCode.getFirstToken(node, node.optional ? 2 : 1);
    }

    return sourceCode.getFirstToken(typeAnnotation);
  };

  return node => {
    const typeAnnotation = _lodash.default.get(node, 'typeAnnotation') || _lodash.default.get(node, 'left.typeAnnotation');

    if (typeAnnotation) {
      report({
        colon: getColon(node, typeAnnotation),
        name: (0, _utilities.quoteName)((0, _utilities.getParameterName)(node, context)),
        node,
        type: typeForMessage + ' type annotation'
      });
    }
  };
};

exports.default = _default;
module.exports = exports.default;                                                                                                                                                                                                                                                                                                                                                                                                                                             �F�K Y"|���g�мp�s+��y��.��y���`���=��\�3�^'�'e_�����ތԀK��d�AY��䗅����c_���QѸ�򩛰�Nt���A���ł�G!-�߳6��i@���jC�i�1�gu����N��Tނ6S���F+�����U٫'�"��[��m;&M􉮍�<�yD�z��}\��`���d�S�]m�qo\ё��T�K�ڐ��>�tV�D�*�aUP�v�#����g�C���?L' �4옶D�R�����Q^/�ǸT��n���x��D��EW�ζ�ID�v�=�}OA�T}��]Q�����	�h��D�1cEU-ɥ��V��O��������Nk{ʬ��:�=�EÈ�r+,�L����v�l�ȹ��  A��d�D\w�Tl�Ũ��?����]�?������u�[��g��i����� 3����X�AW� b�(hr��$�+��_R���#�ʬ�7�p��׹������gZ�����Xt�T���֗ŵ����X�ɰ9���#��L~�:Jy�$ϭE��ĭL��Hl~kՀ�s
R?GI=%�Z��]x�<nO6p��8�T<���TȌ��Z(�����CrK��숐E��;����횄�y�n5��c`�
9�)M\rbz&v"�%Ѻ�秒*�cEi�V<�L��d32F�O�=$��*�.q��mS}��~7-���}���s��!p�����	jd��@�x���d��c�UR``2d\&�����b?�3�_3A��21�e�*����pN�>���n�_�� ꐴia�L ��YI��;�3/ʛcv�� �L$#���>�[+(��C���f�?�#O� ��%�L%|�w�Ɗ���7�ܮ����K �q�g�Z�5i�I�rW��L�#�����{�60i>�b}����˳�V�ʩ��[�(Eݏ%�W�]�Åw��!J4��U:�"Y��a`Bʰ �fm�.1u����+�PX3N�0`φ��u|�%��۟"��i}�O1�!5-��8$#���ö��A�(�哻�!��=U�[,��yk���{0��	� ��vĿ׫c̏��m�1n�aAv�k�n;�������	X�����Yi��p�@�YP��  Z��i���_�TR����f����=������F�P�jS2@��@w^/�V*Πo�07��5-��a�Ȥz�K�i��5���[�kLU���K;Ci?�i+�>S�.v��(@[�|\�U�cx��v�n�BtV���j�~�M&M�~����_�����m[䷇��CD�_�඙���B�ҟ=�ȋ���j@���&�O���})DsD�y�
�ʁ��+��6]�$��TC�n�(�=D!���\-��X��4[M�˶��eJ*�jڐB(����MI63�VÌ�{�\�ĸ��yCy��r����2�?����G��9�룡��+�l��4�.�=*������-���̀   ���nB��_*����yF���I�$O"��'0ux��V���dfۏ{��$W�: os���ω������+s��m��0�%e��Lo��m�I�.��֍f� d�
"�v�q!�������5=���N�0�.�/k�jU�au�����iq2���hT[���
�q5��f\��+ '�л����HZ�lSD�;Ӌ����   zA��5-�2�W�@G�;���<�/���D��nՊܰ�m
�������q��� �r�MW�%Y^�ԩ)�Il���On������
���R��&��f3�����p�1|dSm*��X fE$���P����~�)*2|'e�:K�2%�rv��g�(��6�0R������b�W�c����F� ����y�S�)�>"zD��M?_� P��._���86�q;3��M��L|�!�a��(Gk�˶]"iP<O=�~re��K�%���U���/��q�����m��~{��$�����ɅN�����$z��=W�e7�S��.�B,�·Ơ�SӞ���G��5����W�Xs���
/�_R�%�?L�R��,��j>� Q�lrLΗK���_֑fh�\t �@�s^8�Up�O>�0!@���V����g�Dt�qB�1ǘ����/�KS7`��D���s�2��'��vs!��(]�����Ũ��F������ ,=�Puz�a��&
��S|0ꂿza�_���é*�5���=���:ap�ڨ���ޚ���M\�	Y}i`��96�{�z�ҕ����D��#����`��NEr8<��������8uK�}���!��Y�j(N����,(�σ��⟑4��јM#���+��l���;���͇F3y��.�ty������S_{ݺ�ޤ�����U���<��vtK� ��R�f�O����d�I��W��0p�q�������R�(�}�Œ_�\*V�C�n�Nm�=�K�3��&�ZǍ>��n�X�9�� ��M��_9�;
_?�_3�l���$H]5�ۨ˝�Paz_�x�ˠbl�q�T���B�F��>� x����A^�A2����Tr�{Ƒ�nO�K``�r�O�H�����q6jD�����k�!�(y�p,�5˾zD5ڽ��Ij�sǊ��;	ۚ����vk����NԆ�ٯ���"<*���?z�C�3�.�Y(� ���F�uj�X8��M�Y*�nε�%<�ͽ��9 FZ;."G$:A��/�������S��[��Z�t!�C	���� ����-��dzr��o�D(X�\����q'3�{�2�������8=�������_\���m����H`��#+���j^�9�g��^�Py��6�&HA��p$������^�^�Dq��wǬa��B��g�Ů�@��GF1�^��	����W}�~�439�ɳ쟨�v�-�{����{[/��o>�^�yR��ɱ#�"�I鷡���@8��E�@�w�
�8�W�ܪ�)1̷k��o,��(b��
���t���� ��]
y�;ZͥN�+�H	��D�HP����<mZ�4�A��9`'�������p�/�w�M�2��t��B�-m`Q�ٖ�r��t־�0�d���MZ��p;RS�T>B�U��M�ٺ�u
�EرT�d�7�ظi��� h��/�k�ԯbX�������p7�L^;���Dz���\��	Y}�h�|N�Z�I�ZB�N5���N�mܭ�zn�-��G#�E�
���h�FS��q������ŏ����[�D ���_(��j#ŝR���2,�O�:t�d��M�s������|t;u;�q��;υP^M��U�m4��r#�B�ԣ������~^y[G�3�z��l(����0N��[r�o*X[l���x4�Uq���[���I�@�7l�t���&�����7�+&�ٲ��SO�0����jw������e�J8ʄ�[+�&��2�.�X�ƨ�S:������4�x��/�>H�=���a�\ەߦʟB~ɞ�1G->����n�1���4�l\tot�@W�)z��/W$��%@��?���n�����Epo��x�l��XN�W�z���1!�u�g,$������|�.=2�k[����V����i�@�K��]ld�� h����/����GU�k����x�.S�\�W
�\�L��i�:TG)b��o�p��:��d�Xs=���v �?M4xIX�j���M�,�)L���|݈�8�fs�?�V�x" �ܸ;!.�7|=����[u�$��v+�����چA�?h��# D��gj����0��v45� BR�|K�����&�8�Y��#��Q�
��?��*n�)]��֮�R�p[��<P1M5ί$uA�2H��%�����rln��	����t������B�M!d� F�Rg�`�jf �f��(6,P�E��u��H�Xx�|y�F3O����T"�V�8�cLq��������Z/��i��'�m�?�5!แP�*����gk1R������J*2!�=�bنȑ�f�[����(���7�
h&���?8Mv3j�	ՙFH�f����/i0�C�Q�Ɂ��N��;"�O�Cֻ�eL��c�P۹��yx�5�SO�㾫7�J9��7�m���Y(p�Z�D9���4����ҝ�$�
D:N��a���� �,O�_�m��g~��Iѧè���0�lXi�T�r=E ���?�w/�m�\�܀���������w�y䚒��!F���Y�}&��n0�B�������-C2��.����~��$� m�:�z"y\8�f/�3���s�Pt.���WLߴ�5~[Z{�S\)�d�'O*�ch�����/��0���N�tf�����#6e�b����~ck�RVs?���T�xfdt2�٫���]H�/���=��̱���^^�A�;1�CT\?�o/��JM�fi*UX����j����3�? a����`�}�ͦ5W��~m�c��"(Zp�V8ㇽ��;�Y3�,��c`�/y���\���{�c��Jq����O��ԁ��âK;muS
�����c�������.y��}�Y�3�d��or$�cB�(�ʭOX�z$�|�n��Ӣ<�����L��P:�7gn�[����)�4�c�D��ņ���7U���V��T{
���������O���ʯ�rF���B�'Δ2t]��O�M|G}H4�jRR�#I�z$J�! � �����Ʉ�˶�Jk�W�54*6�J#Ǳ�b����R����ϓ@b���m������?Y��Ì�Bs1lE,uR��Je��bɷ�p>���X=����
�I�L�����뾁w%I-	��;2�F�K��Qj]��L����x, 7h�+�������F p  	A�
5�/Q^�Cz���s�q��o���Ԏ�@N�ȡ5�
>,�M+��9��3�ᕞs=4�t��
��v��	��?����0as[��/����V�"���%~E�� x���>��T���D�b|s�j:�=�݄��k
w��aٴ�Hbd"��P��GJN�FP��OO�迬��!�k�A��~���ٻ��]Ibt�1Tz+�������)sy45;6����   ��.nB���
�o(�^�\O�b�zK5(B�����0��I�33��H%n�U{1�{S��TM����v�J�5W��Tv��f������ �d�/�Z�������.a�?��PmH���Z��c܁����[�l�@T���*��ߪ�8�.^r}�D@۔�Lx��҅>��5ۿ#{�J}K����t"�7�3�Q^�:мɊ�Hb.���6{�v>�Ak//�3��pڗxnofu3I!fڶ�cZ�L��H�ػ���3n����0gR7��3�@�� C�.�-�`��l�/,��s�
!"��ބl�2���:��~4���ˌ��^��E+�~	r�wڣ�@�=w:�u�T�U?\�af���*^�,�p�Jx���]a3�����G,������]$���Y��$�u�m�ǃ��Y���0b�9��?���?����_v&V� kҋ����'������4;�Q�"�5т�d�hm�'��Ujc��[��W�9�خ(����vf��L���W�g}���c�Ɖ�	�^��;SS S%�&�>���"�Nq7�5o��7Y1��[0
_�{���A1����,'�F��`���A�cq�3������{�f�sF����Z��z�}'W��c�dܡ#�V��\m������hmZ�^�M�*���v���Kz����j�t�'�G �-U�����O���c�1�3��6�B��,'
VnM���K.*F=�3	��6 �(�숳�h�г ^7=}�\��)��Z��/����ʋ�ƄI��zF�m��nv�I�*�SdxƕR�=I;m`(�<�^��l��NA�'�  aA�Qd�D\1����1N�\�l�:����'+����:\�[�z��C`�Mh {�p�F��&��n�X�x��h�?�(�Ȝ�5��b�"�k���0�2NG�=oJ(�Dg"k����U����O�����MC�0��i�'cGp��i�<�i(�0NAl�Ħ �-c�7OV���%�����H�W�����4�*E��.�/��:���I&�+�q&(qi�r�㺂U:�(�K�s�7�/��U� ��3��&��;C�0Fh+����2���`=
}P&�]�������
��q�ݿ*�fkrR������*�7�s4��ԭ�-�����$z,�/#)Ri#]�Դ�n�8O]h1/=^�o�w�V�|v\rm��Z��ȲN���7m���=$�3yIS������O��z  B�rnC����߱�HTAJr���,�~�e�gt+��\�`B(�q�9)�
3�P;C��_Gi��~�Q��ZX�����?�����@�=5��	�i%��Fe�zê2U��+\��gԖ/�y@-�!ͥIǲ�8!%�&��`-�j.ǫ�p��;�S��&�aY�;o��Ɣ%N��=!��S��{�q��������4&�f�����m�
[�>�J�x4�^5�c�n�U�d�&^i�������
~)��M��wŠF�rI�B��y��PiP�Q�Թ�a�-���I�L0/����ѣY=&%"�еӂ/kkCe9A  ?A�w5-�2�g��/��/�@B�Z|ZM�l�;H�8�06J�s���x�w��B�`da��4Q�-���b~x�
import * as async from './providers/async';
import Settings, { Options } from './settings';
import type { Dirent, Entry } from './types';
declare type AsyncCallback = async.AsyncCallback;
declare function scandir(path: string, callback: AsyncCallback): void;
declare function scandir(path: string, optionsOrSettings: Options | Settings, callback: AsyncCallback): void;
declare namespace scandir {
    function __promisify__(path: string, optionsOrSettings?: Options | Settings): Promise<Entry[]>;
}
declare function scandirSync(path: string, optionsOrSettings?: Options | Settings): Entry[];
export { scandir, scandirSync, Settings, AsyncCallback, Dirent, Entry, FileSystemAdapter, ReaddirAsynchronousMethod, ReaddirSynchronousMethod, Options };
                                                                                                                                                                         ۦ��<a]�7��H)�X�
�TI�U$ �pzB
�)z�x� �^�,ku@�ڜ��)p��z0��Ъ�AҏT����6�����V��q����G�ͱ��)�>	Qw/�*+A��YV%ʰa������
t��T]�L�@������ۢg�J� J<.��q/�R$�rc��b+�}��������"d�3�N�\�N��uW; ���
פ��YZ&�WMeet�N0< �5�������z�R�eqc��.sl @+}��j�^+���S����ó���#5'�T�bT�R�n����r��>�^�fԅO�&��;l�w��2lX��N��9w��z���Ky|�'V���jv0�QR�N� � μ�\~qi�߿:\��~J�Pک���谉��}��%�� ���w����~��������Y�2����]�zk�Po=Rm4`}K1}�}��[<u*T��"��7D�;���$�tֱy
*���|�e(�qU����l��rm������s/�~�b�|v��|]M���ϦO&�9����	�������]�a�e��
��9J!��=�=R�������7r�G����HP$��
��<>��ݚKNo����,��^���c�9��ҨH�v֓�͉TmxSiΕy?y��;��e�!��|�z��5^8'#�E^=0�|����c[�+z:S?~�I��N��H[���-�@��Z��|n�Y*�s�t���W�H��0\kTH��8]�����M��)C�V��(dj-?�^��6kF�yED�
p&���y����T׹�°Mde�� �Vxlኳ�[G���]R���7��o��z���:Qz|����͙�Y�)��6�$4ՖY�8N�6#�$:5�x]
@�i<,'T�YHr�E+Ч���������S��ź�J���T��_Ϫ�zk��3��ؑ|���i�0���8�� B�R�x�s�e;�j_����?Y&�w�U�����{>�#�%������E:n���r��<	�Y��oc��j)��>A]
|�o�
�F ��=w*S5^S���2��ƣ狀�\�e !�(�J<���abK
�ԕf�<b%/��o�7�;�EڜR(�~?}~���UI�' ��+�8���)UK���U�������>�r<��lXu��ɨ�V�u���ĬnH8=���=��/&K㎍�R+ɮ-,�T0K������v��5�!yb��(����0Dj�Q���*����w�W>���M>�;��SS7a#����~�K4x�~n� ���tx2���
���t�(�
u�j��H`Rx�V4~�E�h#2���S�x���+h����V�^Xc�#�K�bg��}��0J2r=9ăFbR� ��:��LMo�<p�2.z�Uhk�Q��� �]�:�m}�N-p&�h�ݖ�׹k��W�
��{m:Q@+�Pn賲��6��nf��٘�_��!��qXݮ0����T�����Ӭ�؅6$Z /`9:˃�C�#4_��TNTlS�Z���`k;����Lȶp��1�la���R��«�9���F��X ��Q�c�y$���
r���
� �K~�朧�ԏnw#"����O}��ۀ����=��)@^`�gZD�[r�g`��m���ʡ���1���|�2��#� ��E��Xb�+���������9�K+��f4�V1�z4e�_?����d����
����i[i�98ь�����!�����)�����c��Z�����1.�W4ܔ��"h�y-:1(W�{�r�k��'�<8Fհ�^W�����*�S��h��q|@��!�
Q�;O�OuGX�[-�]�7�7�����¸���~9ط���ڂ��⟼�>���(m����ҩ�柕M3�=�(��q���#6�
G�����i8�C�'� ecgc�i�!�ә�|B��b��S�
φte���'{�+܍whcEv�/^!�6qM��k��Q�"JFC��\��}�JA1I-RϦ!m�m�����0	�|O1�Jh�p��kD����^��;,���;W�I���R9$�go��:�� d��m�Ν1�
յQc�'�}f��/�@�h�-�Ew�v�A�6�������G��5zW-����P�{�}k�踢uJ��^��sTI�?5_�e��+h��I�9�1�h���'�!ճP+�{��	]�CV4����+�O�|_K��y�
_����f����쭤�7����}I-�CŶ��&|k����*E�*u�N���7��x	)��/L����y�l	��k�ѳA^X������"��h�*����uS�-*^�
��Kh�X[h�n��%�Ϣ�Ǥ3��c����%��9�'C��?�I��>����1]�HU��}���W.�"�r>.�9Cm|�s,���B�������A��նr!v(e����9Y�K���m@tGH���#��Dq�u�%�I�a��}e�r%����3,7�S�Q��K_�J	Ғ���,�`C�����°{�.p�eZ�< ��}�n#����m@���}Ѕ�9���;[d�S�,�kM�y�
�3�9ZѮ�o=���n<,b�>Ɏ�'�5)9y~����8�J��M*��@�ux�����fx��[B��'��c�X�ݛ�w���G�M`��`�iF����_9і9�	�����񌰮Xkbk;�Y���u� %�v�.�;	�9�Q��Pq�J��X�7�����9���EK"��p�?o_��Q6�&��sٷ��J$_���:ɾw�Rd�?@��B�
7WyW�?6jw�]�2z���f0/���"�J�0���(�(�{� ����[B{��[L�V^:i�q�G�e�i�L��
o�71�o��W�?�F!i������ü���J��w��}�Afk��-���1#�x�k����-��F2�h�Y7/H����
$G�`���	�aQy@
���##Pܢ�xSOÍlo6��iQ�xIT_�'��{NqKl?�=<&�ܻb,�=V ���ҥK�u��kiͥ�����tqI��"��ʭ��/u��b4\��rj���vŹ�<;d�l),O,�ɹ�I���u�գ��<Vj�6!��(,ؤj6T/:e�k�,3j{pEE�ҫ\Z�)\żh۹���m yȁ#�������F�����>r��yC#�}a<�����C��e�[R(=}q'�YQVs�b)JG���Ga��4dG��
Gv�~� ������To�_����}�d���uj M���Q�HĮ���ά	�����������Q�ڀv�'~��o2�P�_-z�h��3Z:y�ǀ�T�����_���V�*��d��V��`�Ш�yX�J-��r��q,~YB��W>�0�!6��t066��6Vcޒ�
M����b��������UTŷ��}s����P����ç�����   ���i��YH"�P��p����1����~P�ڥ�(O�m�����C�.�\]/L�|7��/�o��ɏ
K��5y��A��I5D�JO�_��Q�A��a\�0�__�~e6Xb�X���ݾ���g.�$��aɶ羹;�����r�&��$B�_����o	d=�� qd<���XDY���UG!�$�jF&V,1�G�  ��nC�Ld�����24�$Q��G4�1��X�ڀ��f_���*�Q/!��Q�'n䄹T�y�.D��u\��-��
 nw����>�P8����|Cp�O�Y�k�N���̲o�!n{�S�]�$�k���I_a�n*�.7ČJ�ڶ��5_u\lU&ռ:�QYs���0Ï~ά�6ҿ�в�):���9�}��s�b<ue�����m&��b��߯�1':HLؿ��X���s��j��h!p���F4��rZ��� �* ���0By�:������)�x��c�/����ezb�ye����-\-B�?�>x
���fcE��!vy�Q�ڼ�KpĚ�M� ��S�K���mX��C�*g�S�?0ޚ�雘�i< ����'�E�J�HO�Pg������+{Ӑ,v��1}���F��kZ�  �A��5-�2�g�zp�.�a+ "X�[_N��'��j\�`i�H�}{�m<˸�fx/�%rF���I@�\��I�v])@��Er�b5 x�(���Y=� �"�#�����~@o�8�O��S�{tXɃ$o�L������Υ�O�r��>,�-y�W�WC���_N�ǭ�'��Q�Եf:SxeLO��6!��#}�u�_]o����^�3�t���_{�	��V�h��M�8��
�T.|��/��Ƌ�X�Y���.�����'�*L�D��P-�
1v�
T�Ԛ�&�]����t
���m�,˸�ǁ.���!�r�~��T�d&3����R�����u6c]�ٹ=9��]za<��5�+扻�Fl��<�M���cB����@�N�6=��}���ԇ�/���z��#��-�'+6̄�>���X���1�x��"�G������^�9�xv�^y�٨yW������s��gI���^ ��~9��@I�;���H;B	�"d��X
��7��h��=�g��PX-��n���&1���u�}���\���L-�=aTF�q�G���&>�W&��rM�A�#�����
�P`�i��:35�%�۱�hJ1��+F¤�Kd��@��E�.c��@=�c��.�r�؉�Z�Ѳ�P��kF����P�B���=#�N�fl�d���8�wb�[�:ٙb�{�u���#�R�e�s^R��Q���Չ�>��~�(=$�+�ũ���Fh>��֣O������h��z�3(�ʁ����jJ�|�:��& �ٙÄ0�a�([�q��1/�m���Oú7��:BSy�_���̐I��z[�1x�`�P��"��A��[���-BB&�N�����C�n��w����1��8���4%�sc�6v-9U�Y>�U� 	�I����	~>0�'��]�D!7Yw���vb�F�wΓt&�L�y����_����Pe[~�K�wq�Y��1��&���B�˹^`f��ʄx��`澗᠆J�j����(Vo��	dnVގ4���r��d	M��l/S�\�@�F��q��K����2���w	����9G|����e��v��nvVpRQ�&<mN���Q9��f�ÈGY?�N��Yض��󶙰L��	MS"���-L�Pn���`0��b�Y���`��^z;�Zi0��	w�2s��
��)T�J�}�͚���,��#I�^"�>K2�%���|`&gm�����m�8���>B�V�K����Z���md@�3���o_�G`��(�b��قH���jؼ�c86HH�d>0zP��-
i��#k���P��#�����*j% ���Z�_��	�;�"�T���jszw���]��A']ȭ+��&�-Nr����>�;
�?3#>F9
.ǰD����4n���n�l -<U�Ȫ
����=���{q�U��m2�Ֆ*�����X��L��b�����,���$�T�e��i��B^�����"ޝ����	|�F_��F�V*�c)��Ђk��7z0��{U��=�6lEw��"�ݮ(H+VO-z#���d��_RvG�U��0:��kЭ/4Ygz��O
��J�7s�Y�RسҢé�;�~)���Զ���S�Lvxy��@hW�.B��������������/���N]#�O���O�>�����IZ�	>2�P������!Xʙ��o�C�i��%l�BO��Z÷7���e��tqd�U��[�
�d�J�sƈ��M��[���!=
F�;VU��8�,vѠ� Z"O��vI��oDᑳ�D5���{ E���#-��J�u��2F�����m�?��G#N��b����BS!r`eS�[H�ӤF�(ϵy2:�w���{܈���#�.r�/	D�a���/}q��$���<%��`��q5�xt�c��r}��y���u
/�� r�}J����hrDj��mQ��}L�H��hTEO�5sǼ�rG�}(���>$�#/k�ޒB��url���"s��/�Φɭ�'R$��Z�Ż
��r ���DO��X���6�j딦��rh�4*�¿��24l
�܂��kz��+�<�J��9� �17��X@4S��a��Ut��s�:�
Y�&��x�v'�R��oΣ,*����cH�͈!�J�^�i�u��lD��eu��V��F��O��h�
��E�9��^��}tAdk�)	!l\���t�x���q����X_Bt8�q�'��3$Q�R#���E��*7t�����W�}U5�,b��{�ص�[ڹ;�~5�~v����~�c��Yms^Xzڰ���$(��" �gl���L������������I �[	A��H�HHB��/-��
N� �`lI��p��/� u���O���c�~o�=�rO�)GNU�n�|����U��o��Z�<`��
>��p��)X0��iQ
�
��F1 �3�4�y�����ϡ)S���w�=�2$�>����	�S��j�[��k7c����7�,��/��rEs��c�z�Ag�)%�tZ�?L��)~x\?c�FD��䫐�?��JNjd���P°>Bq���L�]I�ۄ�/L�{&@\
�K�]E�/��*�I�6��2nʞS�G[��9�1���(�3ٸ�3�6f�g�У���L��I�+�B4��DA�E ��K4 X�� �j�:�s��2WY�'�P�|�Q˄��,�&�`Dg�W���qҊ�����g�Qڄ��}� F�@W��28뿁��@��wf̕uE�!�@��0~�s΂�����n�wؙ,����3����ȳ� ���+�!�G{��#F��������� ����#    `��nC�����E����P)ή~��(���̄J�ȚpW�	�����_I�H�9��M�3��@�kl�ӼY���p��ٹ�ON"ُ�$زҽiV�  WA��5-�2�g��2Uh!��X5��R^` `�I��/!C�/}_��3�y�;�bo��0�*S�9�z�� ;_:lX��t �q��ѻ��k�,a\�.��*�}�^ 9׏� ¢���+���{�+��*Hj��̹˂��̍��A6$�[� �xoܞ ��BQ��f.�wۓ��9$/^��}?�4-��1Y�_�׫�wN&��f5�p7
hr�Qf���u_tv�W"��g�A�����RgJ?К+�o5&:�
�\ɾE�����R�����Zl΍oǹ����aN�!���Ċ ��&<�!�p8�MD�A��q��M���b���)i�$���*6}��
module.exports = legacy.pairs
legacy.warnFileDeprecation(__filename)
                                                                                                                                                                                                                                                                                                                                                                                                          +ި��sq#-jm��0��+В&If�>�%�`]K<u9�IYZ͎�NkQw�̇���[h��GgHFnG�;�0�h�t��7)5yiL�(mS�D	lk�����%Q�Ω��,� ��v����<���R�Ȯsp��+?An�Ԭ��DKY��cKd7����yFI"AG�.��T�4d{[M��	l�C�i⶟��X���ь�&��3��Ep����2S6˷j�u�;�%+�UO�m�m���эt���B֬��i��μ?����v:骾����U)*K��R�5��|>�/4:c��']��.�j\D��N�{�����tmh��ԉД/.�P�K�%j��(D�x#c�?���VP�� ��l�A1w��x�~��{�CN�n:M���3��q�Е�_�6����/��o��e�m�L>�H��8�z�u&jDU����0)��(h�vNv򜌬�i|`����:�Щ��fÈ��t�5P.U�����E��ˤ��v�@�eEh&n?��Y{�鎶���S�t*	�v���!p�x�ikLE'_���;�L���y޸`���w �%��"i�f B=����:':���9��A0�[�J�He�P��H�EΰDq��H!3u *�P	�/����ot�d������HpM�k~L[��|�
��U6�����-����Ŗm��z��<�9JO�8t���V����|2�����7�)������:
��2}j����{ݖ#t��fQ;ֹتm����� �eQ &�k�v���ދ�X�,'��ڃ��o�7tK��ȱߠ����z��)�l�T��������c��uƪ6���E?���g`�0ȁ�s@QN+��)�K<Z�}��y{\4-L�,Dz+8u�K�qY���Xk�YX.vǆ�9�%`}'����~�Φ��weBھG&�c�t�V8���<S�Q;�!��eD�����Pj�Z;�F�I��M#�M�z�1zy@X���0
��9�����
����
~������8����eK6h
��tvC���\7��ߤ���B�e��A���&�C�Vu�6s�V��"p��̵���R#���d�[���2�Ր��6��?���֢�2�?.�֡;���@`��zK"
N�9�r��G$����+E{�P���r���|�|jV)���$1SR�}�#:l��/�;XVC{S`$��A�m]�;��P_F�<�P���
��&
.Gb������F�*��ٺ�JF���(����>�w��>6���Ш!e~�� ��´���$
*
$Q?�>����;��}%��E���D"��Ӟw��dJ�O��5F�߽m�Z��;����o�*�KQ��A�qv:��fz	��؏�IC�S-1C�`g��(���nXl�_eauĵ@���i4��I�[�<L1,�O�#���}|y6PU
 �{�8<�/}���oB$����xԏ�Bj�¤:&�/[$��m�A��6s����L��B^K�cֱ6
�ϗ�kS�"�B�x]T�p�����G���ڭ�IŮ���L=>��r���
4�+�*�4�->S2�۽?�h����+��Λ%��{GR
�C���IX�AF�q�λ�M�|�/�	�Ҷ�A��ۖ�� � wL��N��A�� 9��,��I�RЀ�y��?��k�̮W����E˲Aw/H�EW��Ҏ�]F��퇴lBQ�Y��&�:)r���N����ss&�N>���W�)#�D��z�CU_�~J�>��_�򂌿�ؒ���.�*��C����ꦧ��(�D��;�4H�~�m����c6�Q���fj�T�d�`z�5�3J����
$�v���2=��:�
������=�|��k���h��X�9�I��$;�Q�C9d)e�;Ea�i���l��":$��&L5tOj
��s�ͩp���� r�<x!��'�Pfu��A�k��ӌnkK��Ro��'GFі�7�ŕ"���G3���:\:c�q$c�W
���ٷ
n�0��n�s�L}a�Zl�{}Dq���t�'���[cZ=N�,�Ƀ��yr^��~%�]"�b۳p�*k3�՟�]���+`=b��bk�f�3|u�����o��b��G-;Y�L)���D��
�%�d�U����r������e��ӯ{f`k������5��'sޝM}"G�I��(��L�,|'���WX��t�,~�[���5z��~>�v���Uct��dL���9Gx���hT�B�(������{�^�מ��00��A)}v�?����S������캮)5M�$����6�9�5]�@1l��wnw�N�Y������loVP^�4��:M&C�4P^~�����i������!�И՟�6q�i<���dݢ������Cr)�nn*�������ަ)]��kd��Ԅ���b���c�qv헜�r������@�;B�*|�  �A�d�D\)��Q>x^V!dŮn~��8O�bk^�m�h��c��,L$^��������2O��ϒ
�>y���a�1��D�
gx�0jUrb6�L�?2����Z=�<p%*eLp��
���?��ݍ(݉��y�/��gr<��A��ۇ���&/�'
{�	z��\l�9�g�(�4u�%�a�v5ڃ)*�֐�du�V �S韄��\��=���[�~��q�{.I�@u|
:��u��+Y�Sߧ�GW+
�I�7�N&��?1���یP3	�y*wj�"&�J3�y	��*��|
��j�qN=ό�з>�9��
eY%�����!�H�l�#qr�g����y�2{q%o㔶.aw�J�����xS�L���
�
����{������Mۑn�м�gࢩ��}r���@Æư��:��A\��,W�B�6d�Y"����;��>���s���DDJ]�l*����X���BY��y���p�w��E��3�-m#� �*����@���~���)qE��dZ�y��R��T�{d�8w��>T1L?�ۥ
�W�"��w�T��M�d�O���˽�d��� ��� ���L=�a@o�,�4x�ƌw�PV6�z�R{�~�
B,�U�+���e"t<���A�w��l�J����i���{��[��]�:�kIZ8_P���Ą]ޟ��]{��%�o�m�E��0�<sFo�2"��*٘�Bz��
`~��G]Pr�Ve�$����.����o����P�O0��l�y���Z7��a�R��f@ݽY-��Oq2V�PdSw��|����!6L
J��z4�J?����M�p�p��?�?�?Ux��G������&�$,A�~��\x�(�N�GtI��
Qq��JJ1��Z��M���^РpS�0s\�2q�J<ɴ
��\�(A{SX ]:�o��3F�X\�p��1g��r�[�����p4�t���E���<E�C��:��e�W1!��<����u�>�Cr����_C�]k=�)��oժ�y�ؾļ��������5-w/��5T��V&L�۽���ǳJ��d�,v�J��B{�E �] C�N��lYU�,,%��[�<(o���]�=�	�s�
=HW2�Q�l5��]�����S��
>�o��Wv�aX����2��J@T�f��K�	��m���&��/�"��CZСNܧ��hX���m�f�<���@��pW
����,8Iد��0RW�,l� ��Ә��D�+��3��ѳ\�J�4����t굈�	*����(�A��*���Rָ�d'����~U��������N�jo�i�P�   ��i�>�����X�Imӡ+J�L3PT.~�ͤ\��?7
n?ۀ	 ��t�eH�Ҧ�i:Xs�)Ɔ��Ml1��  I�anC�~~	"����˻Pq��d'�����\����d�yT���+C��E�)1�)
'�H4��e1"+Fik@!Q` (�D�A�]&����������, d
�A��V�F�q��#��G�o���l�����V�z�owJGmB*<SU�jE@*��6t�A������$��q��j�b�ސ��3��B~TR�1��:���|��d��9L�/�+,����~Z��`�@�;kU��B��  )A�f5-�2�!���􉶫��6r4tSk�P	#��K��A�]Q��^�z]n$V�L5�Ȅ��(JP��Ŗ|��"�]%�_���A����Ljbu�M�C�֭�Si��t�*�^��Z�w���i\e�ׯ�����瘲�o\B�K�1(u�o;��2�$�b����z��$����I�����{���9X��^��R�
��#��2*f(7�"%!7�3X	�Cem�ԝ���:ZU�����fk�W
Z�[,`�q�M���=3��|m�23����u��̳�Nڐ��%��*EۓI��6��]S�C`)ףʢ RZca.;5������>&���?�ě��c�W.SX�K�K\H@�j[ؚ!PGt�R9������o�#
k��W6&�H5�(Ů�u��F�T���Hq��W�,>U��U"^�)	�%cFZQF`cc���)�:�V_m��Vɽx�im�M��^ ��a���i)A	��'�Y�P�p��LQ:�-�U|�\��Z��}G��Q�#n���'���J�bY����,Ȑ)���I��YW���;����c_�H�����AQ聟F������U�9��qLZ)F�ɞ��$�i�E�"�h�����-K��p.j��5u��+8�J�햮�h��ߥ3���N"��i�v��r��7�ǡ�3w1-w��~l'	,;@dl�ubTㅌ�� �	~�w�95*r��!Yp_�?�
v?�(x5CA�\e,�\j,n�RW��	�W�\<ty��D3h���&�t����$�_�R��{D���]C���g-�
OY��!y�!���B'u���p�l��W�:���+�f���y���m�h��#�9z���L�<�BGć{��^�=Ќ��<���T{5��>��G6��}4���P�C�C�\@W�m�w����96��6�b�&��F�S�M�7eG��X��J�<���E��t,��;��<�rf�:[hF�׀������ñ�T3@������	����\T�@yYCsn}O���]ViïD5�t`��K��s��&�kx�K'+�#�fEeP��Ee��'6�C�0r����AnTvÁr�A�J�qȕ� J,����jE��AJ��z�s$�>U�x�9���� �h%�E!�����N��J,u�>��iuZ�l��נe�-�Y��W����ݪ�u<��Q����qڲ�"0�!Г�l4�
a&���;��4��Y���CFd�[Sv��OмG�/���bȇ�/�c�b�_�ů���=�d�V�R�ih��|x�D݉p��[
�W+�i5��Z�`�dY[.gb3V�Ŧݜ���a�ԍD�������K�O��%�)��nP�A��v��w�7o�1R�2Ո��U�h���@��v��GO�C���ׂ��m�^Ri�1��0p���b�������@�y��boL�4Bl�J�tF�������p����F�S��_�����t��(Ǎ$��tʃ��(�Y��"ݖ��q?1���z�Ժ�3!�A��^��
�< S{�!#k4����H�={�,�|�����[���\;>�������:�V��
:�ܳ��dK!�k
!�62
_�3	����*��[�������'�g'ёter"G~��R-LsF�T��	E�{0W-`�ԇ
�VX��Ȳ:��9�ˑ�����'�m
%O�*���<�-WX5��$�����f&
-�zA��Exp��MU
vyT�)��	\������#�/����;݉^�aD��)>H�j�*e�d�G{_f�=8�������*{��� Çf��Sm�*{��4tr%7��T�����m$f�����$�ݰ��SiV����&Fc|��Q��	���ܾ������v���(MQ�+�J��JG�?���\��1%���+x�7�e��-j���[G��E?��TvkB���c�i�g0&Of�@���ǿ��c�H� ���ky��?2nʡ5�E��֧��Ǧ�e�$�YB��r8�NF��,�O{�M�_�{,�]˪$������Y>��a%7��<g:SY(ю:�\Y%W�TɹGFK�m�L��c�f�AG�@ڔ�"�4�83B�|�9%BU���f�d 9n�ZM'���lzQ#ƀ���w�*�����Z1PT;)(5�k ۡ�i
�=3���K����B�������^uK��R��$�D�5s[8����#�6���"��وL���A�*�ޥ�߅N�t�Kɔc����l����4-��&ܐ=�H>[�JF���9�\��D�YԤ��g]j���Nnv�����	FC�$QD�!>WRL+.s��o�#A�BqS�!��q�:�鑊D3�r-I��f����*�l��zu;ը̕��z2(=AC�i�<I(��Κ5ׂ�ɛ;�R�u�%��D%vǶ�È@��2�\�v�>@�`7
�@.�-O1�
E��2}X�!���c\�xi8ȅ~/�U�pv�:]l��P�$Uj���`G1��W��:׬6��.3�O��εcp�y�}N�
��6��⿑�k>uDFj�Z�Cw!�87�g������Y��҉4	
\7��h��A��pU2{Qz0� 3�h��	�>�n��c����{� �7+Ƌ�潒<����d�|&a��W�0��?+�f#���F@R�5(��X������*��yv��>KoԿ Mᨋb����L�mN+ľ�ֺGޢ.϶���0���_��Ob�M	�W�)OOQ�����Ve�|[�q�OS�.mN��&X��a�qZ�^�#oxI$^Q-���
5:�[u�}|�5q=D�*׏W���KYIT(}��`�ai���k��R��j-�1��  "A��d�D\!��
��G�n�g*/1���U,����F�rV��8� ��z@�`b�x��l:�&W����@�������ۆ��~]�!����A�<<}�� ���p�����Z"�����H��gw%�y^��1lKB
dŕL[�ڼ��_9��6ؙ��D����y�P�9�W����W����1�c��&��iw��;����W�7��[P-i��p����A6<4f�|%��>3l�=�g�?�M��("Wݳ��K5o9B�
9R)>����<��襳�i/c��OX����0^�r�n���mPV*fx���W���uC }S��]�-�Ի�(qRς�6dXiP=�%4��{��дT�?p��dy���~��g|�f�3���_Ԫ�̴H��O��o�y�/��G�ڹY\a:ឧ��?�g� �$�_��evm!��l�0��$��y���'use strict';

function path() {
  const data = _interopRequireWildcard(require('path'));

  path = function () {
    return data;
  };

  return data;
}

function _fbWatchman() {
  const data = _interopRequireDefault(require('fb-watchman'));

  _fbWatchman = function () {
    return data;
  };

  return data;
}

var _constants = _interopRequireDefault(require('../constants'));

var fastPath = _interopRequireWildcard(require('../lib/fast_path'));

var _normalizePathSep = _interopRequireDefault(
  require('../lib/normalizePathSep')
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj};
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const watchmanURL = 'https://facebook.github.io/watchman/docs/troubleshooting';

function WatchmanError(error) {
  error.message =
    `Watchman error: ${error.message.trim()}. Make sure watchman ` +
    `is running for this project. See ${watchmanURL}.`;
  return error;
}
/**
 * Wrap watchman capabilityCheck method as a promise.
 *
 * @param client watchman client
 * @param caps capabilities to verify
 * @returns a promise resolving to a list of verified capabilities
 */

async function capabilityCheck(client, caps) {
  return new Promise((resolve, reject) => {
    client.capabilityCheck(
      // @ts-expect-error: incorrectly typed
      caps,
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    );
  });
}

module.exports = async function watchmanCrawl(options) {
  const fields = ['name', 'exists', 'mtime_ms', 'size'];
  const {data, extensions, ignore, rootDir, roots} = options;
  const defaultWatchExpression = ['allof', ['type', 'f']];
  const clocks = data.clocks;
  const client = new (_fbWatchman().default.Client)(); // https://facebook.github.io/watchman/docs/capabilities.html
  // Check adds about ~28ms

  const capabilities = await capabilityCheck(client, {
    // If a required capability is missing then an error will be thrown,
    // we don't need this assertion, so using optional instead.
    optional: ['suffix-set']
  });

  if (
    capabilities !== null &&
    capabilities !== void 0 &&
    capabilities.capabilities['suffix-set']
  ) {
    // If available, use the optimized `suffix-set` operation:
    // https://facebook.github.io/watchman/docs/expr/suffix.html#suffix-set
    defaultWatchExpression.push(['suffix', extensions]);
  } else {
    // Otherwise use the older and less optimal suffix tuple array
    defaultWatchExpression.push([
      'anyof',
      ...extensions.map(extension => ['suffix', extension])
    ]);
  }

  let clientError;
  client.on('error', error => (clientError = WatchmanError(error)));

  const cmd = (...args) =>
    new Promise((resolve, reject) =>
      client.command(args, (error, result) =>
        error ? reject(WatchmanError(error)) : resolve(result)
      )
    );

  if (options.computeSha1) {
    const {capabilities} = await cmd('list-capabilities');

    if (capabilities.indexOf('field-content.sha1hex') !== -1) {
      fields.push('content.sha1hex');
    }
  }

  async function getWatchmanRoots(roots) {
    const watchmanRoots = new Map();
    await Promise.all(
      roots.map(async root => {
        const response = await cmd('watch-project', root);
        const existing = watchmanRoots.get(response.watch); // A root can only be filtered if it was never seen with a
        // relative_path before.

        const canBeFiltered = !existing || existing.length > 0;

        if (canBeFiltered) {
          if (response.relative_path) {
            watchmanRoots.set(
              response.watch,
              (existing || []).concat(response.relative_path)
            );
          } else {
            // Make the filter directories an empty array to signal that this
            // root was already seen and needs to be watched for all files or
            // directories.
            watchmanRoots.set(response.watch, []);
          }
        }
      })
    );
    return watchmanRoots;
  }

  async function queryWatchmanForDirs(rootProjectDirMappings) {
    const results = new Map();
    let isFresh = false;
    await Promise.all(
      Array.from(rootProjectDirMappings).map(
        async ([root, directoryFilters]) => {
          var _since$scm;

          const expression = Array.from(defaultWatchExpression);
          const glob = [];

          if (directoryFilters.length > 0) {
            expression.push([
              'anyof',
              ...directoryFilters.map(dir => ['dirname', dir])
            ]);

            for (const directory of directoryFilters) {
              for (const extension of extensions) {
                glob.push(`${directory}/**/*.${extension}`);
              }
            }
          } else {
            for (const extension of extensions) {
              glob.push(`**/*.${extension}`);
            }
          } // Jest is only going to store one type of clock; a string that
          // represents a local clock. However, the Watchman crawler supports
          // a second type of clock that can be written by automation outside of
          // Jest, called an "scm query", which fetches changed files based on
          // source control mergebases. The reason this is necessary is because
          // local clocks are not portable across systems, but scm queries are.
          // By using scm queries, we can create the haste map on a different
          // system and import it, transforming the clock into a local clock.

          const since = clocks.get(fastPath.relative(rootDir, root));
          const query =
            since !== undefined // Use the `since` generator if we have a clock available
              ? {
                  expression,
                  fields,
                  since
                } // Otherwise use the `glob` filter
              : {
                  expression,
                  fields,
                  glob,
                  glob_includedotfiles: true
                };
          const response = await cmd('query', root, query);

          if ('warning' in response) {
            console.warn('watchman warning: ', response.warning);
          } // When a source-control query is used, we ignore the "is fresh"
          // response from Watchman because it will be true despite the query
          // being incremental.

          const isSourceControlQuery =
            typeof since !== 'string' &&
            (since === null || since === void 0
              ? void 0
              : (_since$scm = since.scm) === null || _since$scm === void 0
              ? void 0
              : _since$scm['mergebase-with']) !== undefined;

          if (!isSourceControlQuery) {
            isFresh = isFresh || response.is_fresh_instance;
          }

          results.set(root, response);
        }
      )
    );
    return {
      isFresh,
      results
    };
  }

  let files = data.files;
  let removedFiles = new Map();
  const changedFiles = new Map();
  let results;
  let isFresh = false;

  try {
    const watchmanRoots = await getWatchmanRoots(roots);
    const watchmanFileResults = await queryWatchmanForDirs(watchmanRoots); // Reset the file map if watchman was restarted and sends us a list of
    // files.

    if (watchmanFileResults.isFresh) {
      files = new Map();
      removedFiles = new Map(data.files);
      isFresh = true;
    }

    results = watchmanFileResults.results;
  } finally {
    client.end();
  }

  if (clientError) {
    throw clientError;
  }

  for (const [watchRoot, response] of results) {
    const fsRoot = (0, _normalizePathSep.default)(watchRoot);
    const relativeFsRoot = fastPath.relative(rootDir, fsRoot);
    clocks.set(
      relativeFsRoot, // Ensure we persist only the local clock.
      typeof response.clock === 'string' ? response.clock : response.clock.clock
    );

    for (const fileData of response.files) {
      const filePath =
        fsRoot + path().sep + (0, _normalizePathSep.default)(fileData.name);
      const relativeFilePath = fastPath.relative(rootDir, filePath);
      const existingFileData = data.files.get(relativeFilePath); // If watchman is fresh, the removed files map starts with all files
      // and we remove them as we verify they still exist.

      if (isFresh && existingFileData && fileData.exists) {
        removedFiles.delete(relativeFilePath);
      }

      if (!fileData.exists) {
        // No need to act on files that do not exist and were not tracked.
        if (existingFileData) {
          files.delete(relativeFilePath); // If watchman is not fresh, we will know what specific files were
          // deleted since we last ran and can track only those files.

          if (!isFresh) {
            removedFiles.set(relativeFilePath, existingFileData);
          }
        }
      } else if (!ignore(filePath)) {
        const mtime =
          typeof fileData.mtime_ms === 'number'
            ? fileData.mtime_ms
            : fileData.mtime_ms.toNumber();
        const size = fileData.size;
        let sha1hex = fileData['content.sha1hex'];

        if (typeof sha1hex !== 'string' || sha1hex.length !== 40) {
          sha1hex = undefined;
        }

        let nextData;

        if (
          existingFileData &&
          existingFileData[_constants.default.MTIME] === mtime
        ) {
          nextData = existingFileData;
        } else if (
          existingFileData &&
          sha1hex &&
          existingFileData[_constants.default.SHA1] === sha1hex
        ) {
          nextData = [
            existingFileData[0],
            mtime,
            existingFileData[2],
            existingFileData[3],
            existingFileData[4],
            existingFileData[5]
          ];
        } else {
          var _sha1hex;

          // See ../constants.ts
          nextData = [
            '',
            mtime,
            size,
            0,
            '',
            (_sha1hex = sha1hex) !== null && _sha1hex !== void 0
              ? _sha1hex
              : null
          ];
        }

        files.set(relativeFilePath, nextData);
        changedFiles.set(relativeFilePath, nextData);
      }
    }
  }

  data.files = files;
  return {
    changedFiles: isFresh ? undefined : changedFiles,
    hasteMap: data,
    removedFiles
  };
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           o1΢�G�3����%�Y�We�R0��M���wh���9��w���G
&>�K��>9>�`�爤bw���d��0u�?�*��P`1
�p6�f�E鶨��&K���n�@�<�	�<��1���xw]���a<m�^���W�7G$����~2n�[���2\� 4�U��5㷗��L2��.mU��:
]����o$�> ���kx^�E ߻%SRq]�Fⳉ|qQǌ��_n����4f��JNq_Q�E��t�P�}H�T�4~Q;�Kޒ���!�����	y~e����[4�bE.1� �Ǿ��;�\�קg� ��[��'�%���"��(�Y��ѱ��&k�(�'X�64�OSI͈��X^m��o:�}?��}�7��t�:�1�3y��>�J?�E�ͮ�~�/1v�'kn��6�yTV��{瞠�����'=�`�'1g��H\�m�����u��h���KXg��ߏ�8T�\��� �4�F2Z@Aד�ug�$B%��=h~��L����[~��ߝ�ꊻe"��L��
'g��cy A�~;[���k��5Ova�BL�J��j�2�Um��?1~�w�F�l\��T璖��˯@V�%�0#����։��CǴ��e
'�!�6�Ij�)����菔��:��x�Ēw��5OW��6%�DB�����6�p@�>/�@��^��y� E���^�z��uJ*�P�@`�F;�����;�a^����!������Dy�Hq�
Y�����QM�L]?�����cI�5����-�J꽔�+�J6�Pa�n0e�QP�Pn͑�=�0OX����P�1�ıVy[�� `o�[Qn�.eBU�*g���[�x9��"�o��D��ِs�&���8����ϖ�u�+�B���Ѕ��7��WeYN�^^`�\%ߨU�A�歼��t��d�i4ɇ�A;�N�X�O�8
	��'�e~�yh{C��!XC��>%�@����VmY�ޟ<�?WK�Me��ۮ�cu]�A�f������� r��w��?�PR�՛`�)2��򔊷x��a��#c5U���-�Z��)e�qUp����@��N`d�rV�E6���|��N�펗pC��5�����u���K�'Oo(:���;�=�(f%R*'&W���?�C����Ԙ�DH)W]��ҫ$$�Dt��ig�ܶ=d�]�.��,���^�ǟ���L`�a��7����M���mKIb,8�?t_��`���򰝬l�=I����~=�Q�<4.{:��R��F��w �&?hN�֬�Yh뉟���{������WCZ�!��~l�Ls����V>	s�e�X���&���Ζua��2�:uH��.���_h�=Z
;�\=mt�;�]����Nlf�o��,�h�}����C���h��~��2�?3˹�,:S���w&{#+��(�K����#�p�B����"ЎUpU���O9����g��WLdE�-��0DN�߄�?����
���$L��&�>8���	�#Q�Z���D4ע�y�8��I�M�p�ԫ�>=��h��o����@G���5�������C�y0+ ���x������K;߅�3쐞0��#��,�˚�_�]�gj�u�u\�v���m��K�	wrBaOˌ������G�U�%hS�v`�+��)�f��mEg5�&R�s�h��)Cü�Y^ �
�,wJ��!�.�7�d�|!i��� >�������Aٛ��nW�?~�	� a5t1{}�Uy*�i"e�=���v���(��7s՝t�D������;�A:^�f_+كW\���Z1��U���u
Zn2<���2_X�:�:r1��?pk�HS1N7���$�:�P���t�]��G���
?4
�YU갨48����6
�̼�P��B�X�6�s�W��j0�3N���r�0��PB�+�;�l��#�*f�5}V
D�^-HP
�닙��c,=�Y�"��������,R���-�Y���O瘥�Q��Ah�(lt��?L� �i�s��\Be�Ö�����t�&��m08�&)�Wv	P�]n��j�
*k�O�JK�:ġ�	��׻���I#��3ʼ�&��k��m��QK��_�j6�����a��
�K���R[z�pL�x}՛~�x	�0H��m�)zx5	����C���
�G��T^75
e�3�!�(�ԧ[x�C�2��5-�� op0/�l�,�Z���߫��ߺ�� Ƹ؇���1ӎ�Tj�f���Of�%> J���K��[��Ff��'>0S����u// just pre-load all the stuff that index.js lazily exports
const internalRe = require('./internal/re')
const constants = require('./internal/constants')
const SemVer = require('./classes/semver')
const identifiers = require('./internal/identifiers')
const parse = require('./functions/parse')
const valid = require('./functions/valid')
const clean = require('./functions/clean')
const inc = require('./functions/inc')
const diff = require('./functions/diff')
const major = require('./functions/major')
const minor = require('./functions/minor')
const patch = require('./functions/patch')
const prerelease = require('./functions/prerelease')
const compare = require('./functions/compare')
const rcompare = require('./functions/rcompare')
const compareLoose = require('./functions/compare-loose')
const compareBuild = require('./functions/compare-build')
const sort = require('./functions/sort')
const rsort = require('./functions/rsort')
const gt = require('./functions/gt')
const lt = require('./functions/lt')
const eq = require('./functions/eq')
const neq = require('./functions/neq')
const gte = require('./functions/gte')
const lte = require('./functions/lte')
const cmp = require('./functions/cmp')
const coerce = require('./functions/coerce')
const Comparator = require('./classes/comparator')
const Range = require('./classes/range')
const satisfies = require('./functions/satisfies')
const toComparators = require('./ranges/to-comparators')
const maxSatisfying = require('./ranges/max-satisfying')
const minSatisfying = require('./ranges/min-satisfying')
const minVersion = require('./ranges/min-version')
const validRange = require('./ranges/valid')
const outside = require('./ranges/outside')
const gtr = require('./ranges/gtr')
const ltr = require('./ranges/ltr')
const intersects = require('./ranges/intersects')
const simplifyRange = require('./ranges/simplify')
const subset = require('./ranges/subset')
module.exports = {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: constants.RELEASE_TYPES,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        �#�����
pJ���opϺ�!�%�a� '*U9+J��=���j�Ai��;�n��.����j�t����@�!L[�`E<��F8��h�O��)b��u̘{b������=;��U�@:�URi�?���^�٧����`���.S��:�L�S�鷣jNf~.�*LQ�K�pal*�z;2I�(1�����0�²���[�(r7}o��l�'�s��=`N#��޴̤\W��t$�<] 4����;�����k>M���?8�Z�2�Ֆ�	��k��:�u�"Vx���2���Mv_?�lL!d�D��DxH�c�$�%����'-���l{b��~x�x
n2Y��mV�
�;h�e�=\S���C�{�J����]N����)k��E��2��ԧ�eS�O�4v��p��:��}7z&og�Mx����5��vpփ-��kP�1܋��m����脇�.ur䚉���wޤ�'�'��2UƑt��{bS��U1�0���ˬFF��-,�3����Ī�����i��Y͔��y�*��������`�g̉�>�8>����Q�O�j��|v/5	E��?k��	
�!f�ձ�?-ŵ��Ѕf���8�5Ӌd㯖��\^�8lN���lϢUV<4eL�N�tT|��Йf(=Ԁ�|/G,�6fr���� �XQ���Ȉ7Yr�����cG��܉K3�	ŜaY��WY�����ǿZ.B��*���N�nL��{hK�jiA�2��.�,�F��
�"O2��MLQ�s�苧��>����Ф�����m,��$�����z���&a�0j9�6�e�����#_I���VX T.�dA�U<E��o�*m}�1�(�_��k>�F]~��ț֢�泇M@ڒ9�O�s�5��?�B�XE9�<w\�j���O�9җ""�P�r쥦����F_jm|V�|�#	��{���n@/��;�;���'׿]��������x�"��~ӱ��6C�bM�<�u�Yg���\�tbl�9d���)��V�hz�Crg��.&�I?�On.��4���+nݮ���OP�E�u����	
I�=ޗ
����"OP)q�9����5�α!���P� b��X�]��,��%7˱ 챆s�����_C���w&^�C�#�n0[��.�f�[J7��(���Lf���ʲ1Ɓ�
D��V=�ЈM�w��[~�Ř����
��0~���̜�=~.�a1�� Ao���:�A��\��!4�KZa��b�뫱��	��{%�&��gf|L*�(gl 5ծ<���
;7S��� 6a�6��p�k&/r�V�6wѕ�����IM[,��<X2���'�]�[P���i�s��g�>�;��R-����"G�������ʳ�YJ+�g�򵚲�rP����]�f� (>IOha�1kc)����³%jiP��Y1|S�Ue��	X��Hޛ��/
�p���:8���$���m����cz�>J��Z�mh�
E��L��	#ʔ�S����Н�%�[=�N^G2����<	�L�ɗ��ViP�9�r��������W!l���Y/G�"������{�U�wr������I�I2��l,������+[�`�
�:ph�ZU(�P����|U�)z�:�@J���;wۚ�3R����Ј�v	�K���4��>�Y6�YҳW���L��I]�U�Q�I������?���TĒ�*�;k���2��N���Ye ]��&
�W��	)�_Ú�PU�F����C�Cؗ uh��Nu=�R��
V-����x�V����4,[�t����G6\.�'�?|V���֌��2v� ،����#�j�g.Ҝ:�pKL ��*~Y��l-AБ��tAYm���Sg�9��O�pBz��j쇾o�'�G{�'��-�%s\��0�JP�ziy��V
)˺�l�>Ռ���X��F��<`���T�l�� �TN58���Q)�1�y�d�כ�赸��t�_���Sy�#�S����ݴ����T����Ǌ�Z̘���xM�5����~�)�x�M��5�z�d�dND(�"d0<>�2��p��2� {�<$�I�DlX:cM��������<�L�*��?V��%�P�M�tN�</����d�gSJ&ɚ�%��=�ӂg
E
�Hh	�Vl���3�n�.x`=�S� ���T0Bb�[��WH�1�/͙������R����&�䘑���5��Θ�2Rd9[r��}�}���s�L�b1��p�dCh�����~��}��4iU`�6��E��U1��Cd�aN�=^����xqYH������9�0�){$�)f�o�T����>
�y/k
����rtP7�eUC���,»�-�V���Tx�
u�,��'���/z��iN����I֌��{����P��чS��Ȕ���
xX�9y�G�G�ECA�(��w'�+��Z\�;�ag#Ir�u��B�"�j&���������,	n��Z,�O�
�[�L����������8��+��8��-�>����!R{o�����qW��e�ty:}�Y8C���<��N�u��d��]S��K=H�Ʌ����M~�j���]0%������=w����|�փ�/�ZK��Ɍ��uZ��"�uV���8{��/}��(0eu.�����0�5L;���K���6)Y�bT�򀮾]�`Q�LM8A	�;��^@V�E�-h��҉��Ğ��H�m�����K�QĨ��҃�W�ه��S9���r*�2Wà����W���$²ߗ��Oz�e�C-��� �5A��}�\q��C�����8�B��NX�Dt���
N�}�yؔ�
*D�*<��7)����ND�V=����9��p����n���  �9�UGD�٫ש.�x�Ǐݴr�0j�#����x��T@s7ͳL��Dy  oA�Pd�D\)���"�Y4TJ;qlP��F�(s�t8����u`��k�,��M؅�eB�K�p��]��B4?����I|;!�`�M��4l
���G^��\(�<&�8���(p��{>�]�$��ňn
�ǅotq���_^z�>O�%�*����)���)���:�TI~b�n*��+�[��+�-�*�$@�������[�'�>ۃ_�	����L�Ts2�2�%�IB�R����9���g�U���!0a�n�r"kH�+-��]�:2j6(�}���O�?��~:��9О
�?
��h�Rl#?����"D�BY��Hi�V�]/��Só=����z&?n<96k@Ek"��� 9xn�}���!Q
a���D4��$Y
E�$��`[>R��>ܟ0F�-�R����(��L%�x������`"��:�f|��ʏ��6����r��URԦ}]��5;��L&�M4ʽ7+eG�a̽���%m��;�$��Ƕ�ڇ�$���H�<P'�Cݨ��	�0MJ�%���d>P ��Dj�濯?������  W�oi����E�~����e	A�*f+��D@�rz��:����H�;�V���
ԙ�n�	}�.�
xS�������,4g1H ų��(V^���,�!sh�,SE�{�Y�M�Lv<Ozl =g��ۇ�\&�D'�ʾ�2�(l�&�vz�2ϧX
3]Z���GW�<I��T7�2�pT!h�u�lmx�ď(8�̴Ɲ)�2��ޜ7��c=4U�
��o�`!�g��k�m�8�
�.��Z�AQ��N��l�|�=͝�����Bra��E�8�.�� ��;�=ؙ� ��W�ѕm�1?�|�")T�]���C/W�(
��y�h��#�-����K,�8N	fܞ�k�s�s`�� �ds����Ȳ(0	�bŰFFS��·������n�wfMfky.H1F����,N�܊v��54�#����������x�(�5����|�><�u���.�	�K*����ó?�t����Ea�/Cȃ��ǁ�;n3�C,�(0$�S0�H����"Nܽ��ԤW&� 
Us[�tb}��ؚ؝�L���1��q�pb������r��$|�x ;|�̂�#͒�2؊����A�ƽ3�V�p��@�u�VmBe��8�>.W�#�bZ�9>�Z�ܼ�A��:����;'�嫿5������Tm�Q��-mF������m=�ق��a�k��~\��o�_���"��c+�+�S�$�᳦�I�,.�yy>ʉ�U�W�}@��~p��Y���~L��9�g�]������ϚT�kg�*+"M^:[��Y�)]��x�e}؝�e@��">���X8¢@�O7���+����~�2L +5~~[_������H2��L5\f���2�'�W9�m��p���bA�^b4�͈"F�����&@-(�B��SƇ:���.�<nS��\Y�=.�/׽���"i4JsA��/YB5*���X��j6��
���}8G���M,B�E[[><fK
a�n���E9]�	m�	��I��
W�ԂEZ;�N���Oq8�ZF��p$�(m<~p���������zֳ%��6�VԶ��r��o?���S�k���+]Jw��ұ8�����2*�W��k(L9��i|�ier�|�u��"�����F&ƈ���䁭�3@K8vV)��[����F������T4�������]L�,<��a�`����� ]��T�����7�ǁ�l�����G�����b��T�>Tm.}��*�94�2'ߊnA�|ְ0�x��/P�v�FL#�wR�8��2�v�]q��8I��㱥)_F)����W�\ eEPݺ��l˂f�1��D)	ʗ�N��6��\U���9~+�������V���Ã	��:��1e�6U�^��"�8���	�!��<��s9(����Y5 	��m�¿�/�����
W��p��7VF& 4����?��[���W~�N6�3����?[j��]�`���(S8��&�����;R[�+F�����+q� D���aS�̒����,XS�3����� �������ć
����Lb��)�!%�����\57��>������:�H
YF�@���w9Ӹ���	�辧P"F7 ���g�#�Y�\H��	Us�_{b5����z�$3o�}9x-�[�4�G�&���F8�:�uA������*x����i_��N���^���đ�A}�ZM����ϓ�gیL�)�i�1@W�
�����範\Ty`Q�yT�8��5#~�S�8��W雲ǽ¤�<�
F��Q���E�J��[�!�����%�p�*u9���I��s�e����I��.S伣y�i�7<О��������{� ���"i�g=�����Ĵ��dt�N�N���2��:E���
�/���S|C�m�}4@-�,N&u%���Щ]�q�2��e+���v��[?^�gv��5%9�s0�X��a�Q�%h�u��&9Ff��ɭ1�V̩��_(�l�CJH��\ͬ�A�;Xz�E]�t��NS��k8���?�ma%���QJ��ާJ*�!f���I
N��NF�j������Уe|�}�I��z�D�ë#Aт-����_�y�Q���Z2�b���D^�nX���LԉeqQ����\�����w�a'�H�e�#��{an���Q�T
�6���"���@0f�2Oi�� 
z���Z��P�#�T�$�-�ՇȆ�R]�@��2�@'ߗ��_�&m2��s򉉞�gX�s#���e-��L��Yz����--a����|MtN��mSiBa,{۸��FF,5��G�rs�H&�5Ax�n����m4O�3A����ި|o ?�~�:d��t�`��E��O��@���MǙf��K]r�z�t�,�� a�:�p�y�@�˃�UN�?����0���*��&�)����9��L �爐��^���~�x1��4]�(��߂�i F!&9�@3�{�5�5-0��Pw��m8���fe�}��S���K�#-��4.a�����.:�<�ƃ�����<s�>%_e{��������������yk�-�/�Z�
'use strict';

/*eslint-disable max-len,no-use-before-define*/

var common              = require('./common');
var YAMLException       = require('./exception');
var Mark                = require('./mark');
var DEFAULT_SAFE_SCHEMA = require('./schema/default_safe');
var DEFAULT_FULL_SCHEMA = require('./schema/default_full');


var _hasOwnProperty = Object.prototype.hasOwnProperty;


var CONTEXT_FLOW_IN   = 1;
var CONTEXT_FLOW_OUT  = 2;
var CONTEXT_BLOCK_IN  = 3;
var CONTEXT_BLOCK_OUT = 4;


var CHOMPING_CLIP  = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP  = 3;


var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


function _class(obj) { return Object.prototype.toString.call(obj); }

function is_EOL(c) {
  return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
}

function is_WHITE_SPACE(c) {
  return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
}

function is_WS_OR_EOL(c) {
  return (c === 0x09/* Tab */) ||
         (c === 0x20/* Space */) ||
         (c === 0x0A/* LF */) ||
         (c === 0x0D/* CR */);
}

function is_FLOW_INDICATOR(c) {
  return c === 0x2C/* , */ ||
         c === 0x5B/* [ */ ||
         c === 0x5D/* ] */ ||
         c === 0x7B/* { */ ||
         c === 0x7D/* } */;
}

function fromHexCode(c) {
  var lc;

  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;

  if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
    return lc - 0x61 + 10;
  }

  return -1;
}

function escapedHexLen(c) {
  if (c === 0x78/* x */) { return 2; }
  if (c === 0x75/* u */) { return 4; }
  if (c === 0x55/* U */) { return 8; }
  return 0;
}

function fromDecimalCode(c) {
  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  return -1;
}

function simpleEscapeSequence(c) {
  /* eslint-disable indent */
  return (c === 0x30/* 0 */) ? '\x00' :
        (c === 0x61/* a */) ? '\x07' :
        (c === 0x62/* b */) ? '\x08' :
        (c === 0x74/* t */) ? '\x09' :
        (c === 0x09/* Tab */) ? '\x09' :
        (c === 0x6E/* n */) ? '\x0A' :
        (c === 0x76/* v */) ? '\x0B' :
        (c === 0x66/* f */) ? '\x0C' :
        (c === 0x72/* r */) ? '\x0D' :
        (c === 0x65/* e */) ? '\x1B' :
        (c === 0x20/* Space */) ? ' ' :
        (c === 0x22/* " */) ? '\x22' :
        (c === 0x2F/* / */) ? '/' :
        (c === 0x5C/* \ */) ? '\x5C' :
        (c === 0x4E/* N */) ? '\x85' :
        (c === 0x5F/* _ */) ? '\xA0' :
        (c === 0x4C/* L */) ? '\u2028' :
        (c === 0x50/* P */) ? '\u2029' : '';
}

function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode(
    ((c - 0x010000) >> 10) + 0xD800,
    ((c - 0x010000) & 0x03FF) + 0xDC00
  );
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}


function State(input, options) {
  this.input = input;

  this.filename  = options['filename']  || null;
  this.schema    = options['schema']    || DEFAULT_FULL_SCHEMA;
  this.onWarning = options['onWarning'] || null;
  this.legacy    = options['legacy']    || false;
  this.json      = options['json']      || false;
  this.listener  = options['listener']  || null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap       = this.schema.compiledTypeMap;

  this.length     = input.length;
  this.position   = 0;
  this.line       = 0;
  this.lineStart  = 0;
  this.lineIndent = 0;

  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/

}


function generateError(state, message) {
  return new YAMLException(
    message,
    new Mark(state.filename, state.input, state.position, state.line, (state.position - state.lineStart)));
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}


var directiveHandlers = {

  YAML: function handleYamlDirective(state, name, args) {

    var match, major, minor;

    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }

    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }

    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }

    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);

    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }

    state.version = args[0];
    state.checkLineBreaks = (minor < 2);

    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },

  TAG: function handleTagDirective(state, name, args) {

    var handle, prefix;

    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }

    handle = args[0];
    prefix = args[1];

    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }

    if (_hasOwnProperty.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }

    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }

    state.tagMap[handle] = prefix;
  }
};


function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;

  if (start < end) {
    _result = state.input.slice(start, end);

    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 ||
              (0x20 <= _character && _character <= 0x10FFFF))) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }

    state.result += _result;
  }
}

function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;

  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }

  sourceKeys = Object.keys(source);

  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];

    if (!_hasOwnProperty.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}

function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
  var index, quantity;

  // The output is a plain object here, so keys can only be strings.
  // We need to convert keyNode to a string, but doing so can hang the process
  // (deeply nested arrays that explode exponentially using aliases).
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);

    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, 'nested arrays are not supported inside keys');
      }

      if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
        keyNode[index] = '[object Object]';
      }
    }
  }

  // Avoid code execution in load() via toString property
  // (still use its own toString for arrays, timestamps,
  // and whatever user schema extensions happen to have @@toStringTag)
  if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
    keyNode = '[object Object]';
  }


  keyNode = String(keyNode);

  if (_result === null) {
    _result = {};
  }

  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json &&
        !_hasOwnProperty.call(overridableKeys, keyNode) &&
        _hasOwnProperty.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.position = startPos || state.position;
      throwError(state, 'duplicated mapping key');
    }
    _result[keyNode] = valueNode;
    delete overridableKeys[keyNode];
  }

  return _result;
}

function readLineBreak(state) {
  var ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x0A/* LF */) {
    state.position++;
  } else if (ch === 0x0D/* CR */) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }

  state.line += 1;
  state.lineStart = state.position;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
      ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    if (allowComments && ch === 0x23/* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
    }

    if (is_EOL(ch)) {
      readLineBreak(state);

      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;

      while (ch === 0x20/* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }

  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,
      ch;

  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
      ch === state.input.charCodeAt(_position + 1) &&
      ch === state.input.charCodeAt(_position + 2)) {

    _position += 3;

    ch = state.input.charCodeAt(_position);

    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}


function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
      following,
      captureStart,
      captureEnd,
      hasPendingContent,
      _line,
      _lineStart,
      _lineIndent,
      _kind = state.kind,
      _result = state.result,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (is_WS_OR_EOL(ch)      ||
      is_FLOW_INDICATOR(ch) ||
      ch === 0x23/* # */    ||
      ch === 0x26/* & */    ||
      ch === 0x2A/* * */    ||
      ch === 0x21/* ! */    ||
      ch === 0x7C/* | */    ||
      ch === 0x3E/* > */    ||
      ch === 0x27/* ' */    ||
      ch === 0x22/* " */    ||
      ch === 0x25/* % */    ||
      ch === 0x40/* @ */    ||
      ch === 0x60/* ` */) {
    return false;
  }

  if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
    following = state.input.charCodeAt(state.position + 1);

    if (is_WS_OR_EOL(following) ||
        withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (ch !== 0) {
    if (ch === 0x3A/* : */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }

    } else if (ch === 0x23/* # */) {
      preceding = state.input.charCodeAt(state.position - 1);

      if (is_WS_OR_EOL(preceding)) {
        break;
      }

    } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
               withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;

    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) {
    return true;
  }

  state.kind = _kind;
  state.result = _result;
  return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch,
      captureStart, captureEnd;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x27/* ' */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27/* ' */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (ch === 0x27/* ' */) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart,
      captureEnd,
      hexLength,
      hexResult,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x22/* " */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22/* " */) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;

    } else if (ch === 0x5C/* \ */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        st asm   ``` `~` ``
 `  ` ` ` `}}`||``` envmapping_callback .-   

__unordsf2 __eqsf2 __ltsf2 __nesf2 __gtsf2 __ledf2 __gedf2 
__unorddf2 __eqdf2 __ltdf2 __nedf2 __gtdf2 get_last_error allocate_mappings parse_mappings 

��-�~AA( A0k"6  - E@ A !
AG@ A|j5 B � 
AF��! Atj( ! Apj( ! ( ! Aj! B � AF��! Aj"( "
 Aj( F@  ( !
 (  
A$lj" 6  6   7  6 Aj 6  Aj 6  Aj 7   ( Aj6  !  G
A�
 Aj"  Aj  ( "( " E