"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var r=e(require("postcss-value-parser"));const l=e=>{const l=Object.assign({preserve:!1},e);return{postcssPlugin:"postcss-text-decoration-shorthand",prepare(){const e=new Map;return{OnceExit:()=>{e.clear()},Declaration:i=>{if("text-decoration"!==i.prop.toLowerCase())return;const s=i.parent.index(i);if(i.parent.nodes.some((r=>"decl"===r.type&&"text-decoration"===r.prop.toLowerCase()&&e.get(i.value)===r.value&&i.parent.index(r)!==s)))return;const u=r.default(i.value).nodes.filter((e=>"space"!==e.type&&"comment"!==e.type));if(u.length>4)return;if(u.find((e=>"var"===e.value.toLowerCase()&&"function"===e.type)))return;if(u.find((e=>"word"===e.type&&o.includes(e.value))))return;const d={line:null,style:null,color:null,thickness:null};for(let e=0;e<u.length;e++){const r=u[e];"word"===r.type&&a.includes(r.value.toLowerCase())?d.line=r:"word"===r.type&&n.includes(r.value.toLowerCase())?d.style=r:t(r)?d.color=r:"word"!==r.type||"none"!==r.value.toLowerCase()?d.thickness=r:(d.color||(d.color=r),d.line||(d.line=r))}d.line||(d.line={type:"word",value:"none"}),d.style||(d.style={type:"word",value:"solid"}),d.color||(d.color={type:"word",value:"currentColor"});try{const e