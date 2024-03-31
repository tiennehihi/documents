,e=i;else{if(!((i=this._schemas[o])instanceof l))return;if(i.validate||this._compile(i),o==P(r))return{schema:i,root:e,baseId:s};e=i}if(!e.schema)return;s=g(this._getId(e.schema))}return n.call(this,t,s,e.schema,e)}(r.exports=c).normalizeId=P,c.fullPath=g,c.url=f,c.ids=function(e){var r=P(this._getId(e)),h={"":r},d={"":g(r,!1)},p={},f=this;return a(e,{allKeys:!0},function(e,r,t,a,s,o,i){if(""!==r){var n=f._getId(e),l=h[a],c=d[a]+"/"+s;if(void 0!==i&&(c+="/"+("number"==typeof i?i:y.escapeFragment(i))),"string"==typeof n){n=l=P(l?m.resolve(l,n):n);var u=f._refs[n];if("string"==typeof u&&(u=f._refs[u]),u&&u.schema){if(!v(e,u.schema))throw new Error('id "'+n+'" resolves to more than one schema')}else if(n!=P(c))if("#"==n[0]){if(p[n]&&!v(e,p[n]))throw new Error('id "'+n+'" resolves to more than one schema');p[n]=e}else f._refs[n]=c}h[r]=l,d[r]=c}}),p},c.inlineRef=d,c.schema=u;var h=y.toHash(["properties","patternProperties","enum","dependencies","definitions"]);function n(e,r,t,a){if(e.fragment=e.fragment||"","/"==e.fragment.slice(0,1)){for(var s=e.fragment.split("/"),o=1;o<s.length;o++){var i,n,l,c=s[o];if(c){if(void 0===(t=t[c=y.unescapeFragment(c)]))break;h[c]||((l=this._getId(t))&&(r=f(r,l)),t.$ref&&(i=f(r,t.$ref),(n=u.call(this,a,i))&&(t=n.schema,a=n.root,r=n.baseId)))}}return void 0!==t&&t!==a.schema?{schema:t,root:a,baseId:r}:void 0}}var i=y.toHash(["type","format","pattern","maxLength","minLength","maxProperties","minProperties","maxItems","minItems","maximum","minimum","uniqueItems","multipleOf","required","enum"]);function d(e,r){return!1!==r&&(void 0===r||!0===r?function e(r){var t;if(Array.isArray(r)){for(var a=0;a<r.length;a++)if("object"==typeof(t=r[a])&&!e(t))return!1}else for(var s in r){if("$ref"==s)return!1;if("object"==typeof(t=r[s])&&!e(t))return!1}return!0}(e):r?function e(r){var t,a=0;if(Array.isArray(r)){for(var s=0;s<r.length;s++)if("object"==typeof(t=r[s])&&(a+=e(t)),a==1/0)return 1/0}else for(var o in r){if("$ref"==o)return 1/0;if(i[o])a++;else if("object"==typeof(t=r[o])&&(a+=e(t)+1),a==1/0)return 1/0}return a}(e)<=r:void 0)}function g(e,r){return!1!==r&&(e=P(e)),p(m.parse(e))}function p(e){return m.serialize(e).split("#")[0]+"#"}var s=/#\/?$/;function P(e){return e?e.replace(s,""):""}function f(e,r){return r=P(r),m.resolve(e,r)}},{"./schema_obj":8,"./util":10,"fast-deep-equal":42,"json-schema-traverse":44,"uri-js":45}],7:[function(e,r,t){"use strict";var o=e("../dotjs"),i=e("./util").toHash;r.exports=function(){var a=[{type:"number",rules:[{maximum:["exclusiveMaximum"]},{minimum:["exclusiveMinimum"]},"multipleOf","format"]},{type:"string",rules:["maxLength","minLength","pattern","format"]},{type:"array",rules:["maxItems","minItems","items","contains","uniqueItems"]},{type:"object",rules:["maxProperties","minProperties","required","dependencies","propertyNames",{properties:["additionalProperties","patternProperties"]}]},{rules:["$ref","const","enum","not","anyOf","oneOf","allOf","if"]}],s=["type","$comment"];return a.all=i(s),a.types=i(["number","integer","string","array","object","boolean","null"]),a.forEach(function(e){e.rules=e.rules.map(function(e){var r,t;return"object"==typeof e&&(t=e[r=Object.keys(e)[0]],e=r,t.forEach(function(e){s.push(e),a.all[e]=!0})),s.push(e),a.all[e]={keyword:e,code:o[e],implements:t}}),a.all.$comment={keyword:"$comment",code:o.$comment},e.type&&(a.types[e.type]=e)}),a.keywords=i(s.concat(["$schema","$id","id","$data","$async","title","description","default","definitions","examples","readOnly","writeOnly","contentMediaType","contentEncoding","additionalItems","then","else"])),a.custom={},a}},{"../dotjs":27,"./util":10}],8:[function(e,r,t){"use strict";var a=e("./util");r.exports=function(e){a.copy(e,this)}},{"./util":10}],9:[function(e,r,t){"use strict";r.exports=function(e){for(var r,t=0,a=e.length,s=0;s<a;)t++,55296<=(r=e.charCodeAt(s++))&&r<=56319&&s<a&&56320==(64512&(r=e.charCodeAt(s)))&&s++;return t}},{}],10:[function(e,r,t){"use strict";function i(e,r,t,a){var s=a?" !== ":" === ",o=a?" || ":" && ",i=a?"!":"",n=a?"":"!";switch(e){case"null":return r+s+"null";case"array":return i+"Array.isArray("+r+")";case"object":return"("+i+r+o+"typeof "+r+s+'"object"'+o+n+"Array.isArray("+r+"))";case"integer":return"(typeof "+r+s+'"number"'+o+n+"("+r+" % 1)"+o+r+s+r+(t?o+i+"isFinite("+r+")":"")+")";case"number":return"(typeof "+r+s+'"'+e+'"'+(t?o+i+"isFinite("+r+")":"")+")";default:return"typeof "+r+s+'"'+e+'"'}}r.exports={copy:function(e,r){for(var t in r=r||{},e)r[t]=e[t];return r},checkDataType:i,checkDataTypes:function(e,r,t){{if(1===e.length)return i(e[0],r,t,!0);var a,s="",o=n(e);for(a in o.array&&o.object&&(s=o.null?"(":"(!"+r+" || ",s+="typeof "+r+' !== "object")',delete o.null,delete o.array,delete o.object),o.number&&delete o.integer,o)s+=(s?" && ":"")+i(a,r,t,!0);return s}},coerceToTypes:function(e,r){if(Array.isArray(r)){for(var t=[],a=0;a<r.length;a++){var s=r[a];(o[s]||"array"===e&&"array"===s)&&(t[t.length]=s)}if(t.length)return t}else{if(o[r])return[r];if("array"===e&&"array"===r)return["array"]}},toHash:n,getProperty:h,escapeQuotes:l,equal:e("fast-deep-equal"),ucs2length:e("./ucs2length"),varOccurences:function(e,r){r+="[^0-9]";var t=e.match(new RegExp(r,"g"));return t?t.length:0},varReplace:function(e,r,t){return r+="([^0-9])",t=t.replace(/\$/g,"$$$$"),e.replace(new RegExp(r,"g"),t+"$1")},schemaHasRules:function(e,r){if("boolean"==typeof e)return!e;for(var t in e)if(r[t])return!0},schemaHasRulesExcept:function(e,r,t){if("boolean"==typeof e)return!e&&"not"!=t;for(var a in e)if(a!=t&&r[a])return!0},schemaUnknownRules:function(e,r){if("boolean"==typeof e)return;for(var t in e)if(!r[t])return t},toQuotedString:c,getPathExpr:function(e,r,t,a){return u(e,t?"'/' + "+r+(a?"":".replace(/~/g, '~0').replace(/\\//g, '~1')"):a?"'[' + "+r+" + ']'":"'[\\'' + "+r+" + '\\']'")},getPath:function(e,r,t){var a=c(t?"/"+f(r):h(r));return u(e,a)},get