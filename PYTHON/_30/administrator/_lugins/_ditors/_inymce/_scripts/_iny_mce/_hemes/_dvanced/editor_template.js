"),e.host&&(t+=e.host),e.port&&(t+=":"+e.port),e.path&&(t+=e.path),t}e.urlParse=n,e.urlGenerate=s;var i,o,a=(i=function(t){var r=t,i=n(t);if(i){if(!i.path)return t;r=i.path}for(var o=e.isAbsolute(r),a=[],l=0,u=0;;){if(l=u,-1===(u=r.indexOf("/",l))){a.push(r.slice(l));break}for(a.push(r.slice(l,u));u<r.length&&"/"===r[u];)u++}var c,h=0;for(u=a.length-1;u>=0;u--)"."===(c=a[u])?a.splice(u,1):".."===c?h++:h>0&&(""===c?(a.splice(u+1,h),h=0):(a.splice(u,2),h--));return""===(r=a.join("/"))&&(r=o?"/":"."),i?(i.path=r,s(i)):r},o=[],function(e){for(var t=0;t<o.length;t++)if(o[t].input===e){var r=o[0];return o[0]=o[t],o[t]=r,o[0].result}var n=i(e);return o.unshift({input:e,result:n}),o.length>32&&o.pop(),n});function l(e,t){""===e&&(e="."),""===t&&(t=".");var i=n(t),o=n(e);if(o&&(e=o.path||"/"),i&&!i.scheme)return o&&(i.scheme=o.scheme),s(i);if(i||t.match(r))return t;if(o&&!o.host&&!o.path)return o.host=t,s(o);var l="/"===t.charAt(0)?t:a(e.replace(/\/+$/,"")+"/"+t);return o?(o.path=l,s(o)):l}e.normalize=a,e.join=l,e.isAbsolute=function(e){return"/"===e.charAt(0)||t.test(e)},e.relative=function(e,t){""===e&&(e="."),e=e.replace(/\/$/,"");for(var r=0;0!==t.indexOf(e+"/");){var n=e.lastIndexOf("/");if(n<0)return t;if((e=e.slice(0,n)).match(/^([^\/]+:\/)?\/*$/))return t;++r}return Array(r+1).join("../")+t.substr(e.length+1)};var u=!("__proto__"in Object.create(null));function c(e){return e}function h(e){if(!e)return!1;var t=e.length;if(t<9)return!1;if(95!==e.charCodeAt(t-1)||95!==e.charCodeAt(t-2)||111!==e.charCodeAt(t-3)||116!==e.charCodeAt(t-4)||111!==e.charCodeAt(t-5)||114!==e.charCodeAt(t-6)||112!==e.charCodeAt(t-7)||95!==e.charCodeAt(t-8)||95!==e.charCodeAt(t-9))return!1;for(var r=t-10;r>=0;r--)if(36!==e.charCodeAt(r))return!1;return!0}function p(e,t){return e===t?0:null===e?1:null===t?-1:e>t?1:-1}e.toSetString=u?c:function(e){return h(e)?"$"+e:e},e.fromSetString=u?c:function(e){return h(e)?e.slice(1):e},e.compareByOriginalPositions=function(e,t,r){var n=p(e.source,t.source);return 0!==n||0!==(n=e.originalLine-t.originalLine)||0!==(n=e.originalColumn-t.originalColumn)||r||0!==(n=e.generatedColumn-t.generatedColumn)||0!==(n=e.generatedLine-t.generatedLine)?n:p(e.name,t.name)},e.compareByOriginalPositionsNoSource=function(e,t,r){var n;return 0!==(n=e.originalLine-t.originalLine)||0!==(n=e.originalColumn-t.originalColumn)||r||0!==(n=e.generatedColumn-t.generatedColumn)||0!==(n=e.generatedLine-t.generatedLine)?n:p(e.name,t.name)},e.compareByGeneratedPositionsDeflated=function(e,t,r){var n=e.generatedLine-t.generatedLine;return 0!==n||0!==(n=e.generatedColumn-t.generatedColumn)||r||0!==(n=p(e.source,t.source))||0!==(n=e.originalLine-t.originalLine)||0!==(n=e.originalColumn-t.originalColumn)?n:p(e.name,t.name)},e.compareByGeneratedPositionsDeflatedNoLine=function(e,t,r){var n=e.generatedColumn-t.generatedColumn;return 0!==n||r||0!==(n=p(e.source,t.source))||0!==(n=e.originalLine-t.originalLine)||0!==(n=e.originalColumn-t.originalColumn)?n:p(e.name,t.name)},e.compareByGeneratedPositionsInflated=function(e,t){var r=e.generatedLine-t.generatedLine;return 0!==r||0!==(r=e.generatedColumn-t.generatedColumn)||0!==(r=p(e.source,t.source))||0!==(r=e.originalLine-t.originalLine)||0!==(r=e.originalColumn-t.originalColumn)?r:p(e.name,t.name)},e.parseSourceMapInput=function(e){return JSON.parse(e.replace(/^\)]}'[^\n]*\n/,""))},e.computeSourceURL=function(e,t,r){if(t=t||"",e&&("/"!==e[e.length-1]&&"/"!==t[0]&&(e+="/"),t=e+t),r){var i=n(r);if(!i)throw new Error("sourceMapURL could not be parsed");if(i.path){var o=i.path.lastIndexOf("/");o>=0&&(i.path=i.path.substring(0,o+1))}t=l(s(i),t)}return a(t)}}(xe);var Oe={},Ae=xe,Me=Object.prototype.hasOwnProperty,ke="undefined"!=typeof Map;function Ee(){this._array=[],this._set=ke?new Map:Object.create(null)}Ee.fromArray=function(e,t){for(var r=new Ee,n=0,s=e.length;n<s;n++)r.add(e[n],t);return r},Ee.prototype.size=function(){return ke?this._set.size:Object.getOwnPropertyNames(this._set).length},Ee.prototype.add=function(e,t){var r=ke?e:Ae.toSetString(e),n=ke?this.has(e):Me.call(this._set,r),s=this._array.length;n&&!t||this._array.push(e),n||(ke?this._set.set(e,s):this._set[r]=s)},Ee.prototype.has=function(e){if(ke)return this._set.has(e);var t=Ae.toSetString(e);return Me.call(this._set,t)},Ee.prototype.indexOf=function(e){if(ke){var t=this._set.get(e);if(t>=0)return t}else{var r=Ae.toSetString(e);if(Me.call(this._set,r))return this._set[r]}throw new Error('"'+e+'" is not in the set.')},Ee.prototype.at=function(e){if(e>=0&&e<this._array.length)return this._array[e];throw new Error("No element indexed by "+e)},Ee.prototype.toArray=function(){return this._array.slice()},Oe.ArraySet=Ee;var Le={},Re=xe;function Pe(){this._array=[],this._sorted=!0,this._last={generatedLine:-1,generatedColumn:0}}Pe.prototype.unsortedForEach=function(e,t){this._array.forEach(e,t)},Pe.prototype.add=function(e){var t,r,n,s,i,o;t=this._last,r=e,n=t.generatedLine,s=r.generatedLine,i=t.generatedColumn,o=r.generatedColumn,s>n||s==n&&o>=i||Re.compareByGeneratedPositionsInflated(t,r)<=0?(this._last=e,this._array.push(e)):(this._sorted=!1,this._array.push(e))},Pe.prototype.toArray=function(){return this._sorted||(this._array.sort(Re.compareByGeneratedPositionsInflated),this._sorted=!0),this._array},Le.MappingList=Pe;var Ie=Se,je=xe,Ne=Oe.ArraySet,Ue=Le.MappingList;function Be(e){e||(e={}),this._file=je.getArg(e,"file",null),this._sourceRoot=je.getArg(e,"sourceRoot",null),this._skipValidation=je.getArg(e,"skipValidation",!1),this._sources=new Ne,this._names=new Ne,this._mappings=new Ue,this._sourcesContents=null}Be.prototype._version=3,Be.fromSourceMap=function(e){var t=e.sourceRoot,r=new Be({file:e.file,sourceRoot:t});return e.eachMapping((function(e){var n={generated:{line:e.generatedLine,column:e.generatedColumn}};null!=e.source&&(n.source=e.source,null!=t&&(n.source=je.relative(t,n.source)),n.original={line:e.originalLine,column:e.originalColumn},null!=e.name&&(n.name=e.name)),r.addMapping(n)})),e.sources.forEach((function(n){var s=n;null!==t&&(s=je.relative(t,n)),r._sources.has(s)||r._sources.add(s);var i=e.sourceContentFor(n);null!=i&&r.setSourceContent(n,i)})),r},Be.prototype.addMapping=function(e){var t=je.getArg(e,"generated"),r=je.getArg(e,"original",null),n=je.getArg(e,"source",null),s=je.getArg(e,"name",null);this._skipValidation||this._validateMapping(t,r,n,s),null!=n&&(n=String(n),this._sources.has(n)||this._sources.add(n)),null!=s&&(s=String(s),this._names.has(s)||this._names.add(s)),this._mappings.add({generatedLine:t.line,generatedColumn:t.column,originalLine:null!=r&&r.line,originalColumn:null!=r&&r.column,source:n,name:s})},Be.prototype.setSourceContent=function(e,t){var r=e;null!=this._sourceRoot&&(r=je.relative(this._sourceRoot,r)),null!=t?(this._sourcesContents||(this._sourcesContents=Object.create(null)),this._sourcesContents[je.toSetString(r)]=t):this._sourcesContents&&(delete this._sourcesContents[je.toSetString(r)],0===Object.keys(this._sourcesContents).length&&(this._sourcesContents=null))},Be.prototype.applySourceMap=function(e,t,r){var n=t;if(null==t){if(null==e.file)throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map\'s "file" property. Both were omitted.');n=e.file}var s=this._sourceRoot;null!=s&&(n=je.relative(s,n));var i=new Ne,o=new Ne;this._mappings.unsortedForEach((function(t){if(t.source===n&&null!=t.originalLine){var a=e.originalPositionFor({line:t.originalLine,column:t.originalColumn});null!=a.source&&(t.source=a.source,null!=r&&(t.source=je.join(r,t.source)),null!=s&&(t.source=je.relative(s,t.source)),t.originalLine=a.line,t.originalColumn=a.column,null!=a.name&&(t.name=a.name))}var l=t.source;null==l||i.has(l)||i.add(l);var u=t.name;null==u||o.has(u)||o.add(u)}),this),this._sources=i,this._names=o,e.sources.forEach((function(t){var n=e.sourceContentFor(t);null!=n&&(null!=r&&(t=je.join(r,t)),null!=s&&(t=je.relative(s,t)),this.setSourceContent(t,n))}),this)},Be.prototype._validateMapping=function(e,t,r,n){if(t&&"number"!=typeof t.line&&"number"!=typeof t.column)throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");if((!(e&&"line"in e&&"column"in e&&e.line>0&&e.column>=0)||t||r||n)&&!(e&&"line"in e&&"column"in e&&t&&"line"in t&&"column"in t&&e.line>0&&e.column>=0&&t.line>0&&t.column>=0&&r))throw new Error("Invalid mapping: "+JSON.stringify({generated:e,source:r,original:t,name:n}))},Be.prototype._serializeMappings=function(){for(var e,t,r,n,s=0,i=1,o=0,a=0,l=0,u=0,c="",h=this._mappings.toArray(),p=0,f=h.length;p<f;p++){if(e="",(t=h[p]).generatedLine!==i)for(s=0;t.generatedLine!==i;)e+=";",i++;else if(p>0){if(!je.compareByGeneratedPositionsInflated(t,h[p-1]))continue;e+=","}e+=Ie.encode(t.generatedColumn-s),s=t.generatedColumn,null!=t.source&&(n=this._sources.indexOf(t.source),e+=Ie.encode(n-u),u=n,e+=Ie.encode(t.originalLine-1-a),a=t.originalLine-1,e+=Ie.encode(t.originalColumn-o),o=t.originalColumn,null!=t.name&&(r=this._names.indexOf(t.name),e+=Ie.encode(r-l),l=r)),c+=e}return c},Be.prototype._generateSourcesContent=function(e,t){return e.map((function(e){if(!this._sourcesContents)return null;null!=t&&(e=je.relative(t,e));var r=je.toSetString(e);return Object.prototype.hasOwnProperty.call(this._sourcesContents,r)?this._sourcesContents[r]:null}),this)},Be.prototype.toJSON=function(){var e={version:this._version,sources:this._sources.toArray(),names:this._names.toArray(),mappings:this._serializeMappings()};return null!=this._file&&(e.file=this._file),null!=this._sourceRoot&&(e.sourceRoot=this._sourceRoot),this._sourcesContents&&(e.sourcesContent=this._generateSourcesContent(e.sources,e.sourceRoot)),e},Be.prototype.toString=function(){return JSON.stringify(this.toJSON())},ve.SourceMapGenerator=Be;var De={},Fe={};!function(e){function t(r,n,s,i,o,a){var l=Math.floor((n-r)/2)+r,u=o(s,i[l],!0);return 0===u?l:u>0?n-l>1?t(l,n,s,i,o,a):a==e.LEAST_UPPER_BOUND?n<i.length?n:-1:l:l-r>1?t(r,l,s,i,o,a):a==e.LEAST_UPPER_BOUND?l:r<0?-1:r}e.GREATEST_LOWER_BOUND=1,e.LEAST_UPPER_BOUND=2,e.search=function(r,n,s,i){if(0===n.length)return-1;var o=t(-1,n.length,r,n,s,i||e.GREATEST_LOWER_BOUND);if(o<0)return-1;for(;o-1>=0&&0===s(n[o],n[o-1],!0);)--o;return o}}(Fe);var Te={};function $e(e){function t(e,t,r){var n=e[t];e[t]=e[r],e[r]=n}return function e(r,n,s,i){if(s<i){var o=s-1;t(r,(c=s,h=i,Math.round(c+Math.random()*(h-c))),i);for(var a=r[i],l=s;l<i;l++)n(r[l],a,!1)<=0&&t(r,o+=1,l);t(r,o+1,l);var u=o+1;e(r,n,s,u-1),e(r,n,u+1,i)}var c,h}}let Ge=new WeakMap;Te.quickSort=function(e,t,r=0){let n=Ge.get(t);void 0===n&&(n=function(e){let t=$e.toString();return new Function(`return ${t}`)()(e)}(t),Ge.set(t,n)),n(e,t,r,e.length-1)};var ze=xe,We=Fe,Ve=Oe.ArraySet,Je=Se,qe=Te.quickSort;function Ye(e,t){var r=e;return"string"==typeof e&&(r=ze.parseSourceMapInput(e)),null!=r.sections?new Xe(r,t):new Qe(r,t)}function Qe(e,t){var r=e;"string"==typeof e&&(r=ze.parseSourceMapInput(e));var n=ze.getArg(r,"version"),s=ze.getArg(r,"sources"),i=ze.getArg(r,"names",[]),o=ze.getArg(r,"sourceRoot",null),a=ze.getArg(r,"sourcesContent",null),l=ze.getArg(r,"mappings"),u=ze.getArg(r,"file",null);if(n!=this._version)throw new Error("Unsupported version: "+n);o&&(o=ze.normalize(o)),s=s.map(String).map(ze.normalize).map((function(e){return o&&ze.isAbsolute(o)&&ze.isAbsolute(e)?ze.relative(o,e):e})),this._names=Ve.fromArray(i.map(String),!0),this._sources=Ve.fromArray(s,!0),this._absoluteSources=this._sources.toArray().map((function(e){return ze.computeSourceURL(o,e,t)})),this.sourceRoot=o,this.sourcesContent=a,this._mappings=l,this._sourceMapURL=t,this.file=u}function Ze(){this.generatedLine=0,this.generatedColumn=0,this.source=null,this.originalLine=null,this.originalColumn=null,this.name=null}Ye.fromSourceMap=function(e,t){return Qe.fromSourceMap(e,t)},Ye.prototype._version=3,Ye.prototype.__generatedMappings=null,Object.defineProperty(Ye.prototype,"_generatedMappings",{configurable:!0,enumerable:!0,get:function(){return this.__generatedMappings||this._parseMappings(this._mappings,this.sourceRoot),this.__generatedMappings}}),Ye.prototype.__originalMappings=null,Object.defineProperty(Ye.prototype,"_originalMappings",{configurable:!0,enumerable:!0,get:function(){return this.__originalMappings||this._parseMappings(this._mappings,this.sourceRoot),this.__originalMappings}}),Ye.prototype._charIsMappingSeparator=function(e,t){var r=e.charAt(t);return";"===r||","===r},Ye.prototype._parseMappings=function(e,t){throw new Error("Subclasses must implement _parseMappings")},Ye.GENERATED_ORDER=1,Ye.ORIGINAL_ORDER=2,Ye.GREATEST_LOWER_BOUND=1,Ye.LEAST_UPPER_BOUND=2,Ye.prototype.eachMapping=function(e,t,r){var n,s=t||null;switch(r||Ye.GENERATED_ORDER){case Ye.GENERATED_ORDER:n=this._generatedMappings;break;case Ye.ORIGINAL_ORDER:n=this._originalMappings;break;default:throw new Error("Unknown order of iteration.")}for(var i=this.sourceRoot,o=e.bind(s),a=this._names,l=this._sources,u=this._sourceMapURL,c=0,h=n.length;c<h;c++){var p=n[c],f=null===p.source?null:l.at(p.source);o({source:f=ze.computeSourceURL(i,f,u),generatedLine:p.generatedLine,generatedColumn:p.generatedColumn,originalLine:p.originalLine,originalColumn:p.originalColumn,name:null===p.name?null:a.at(p.name)})}},Ye.prototype.allGeneratedPositionsFor=function(e){var t=ze.getArg(e,"line"),r={source:ze.getArg(e,"source"),originalLine:t,originalColumn:ze.getArg(e,"column",0)};if(r.source=this._findSourceIndex(r.source),r.source<0)return[];var n=[],s=this._findMapping(r,this._originalMappings,"originalLine","originalColumn",ze.compareByOriginalPositions,We.LEAST_UPPER_BOUND);if(s>=0){var i=this._originalMappings[s];if(void 0===e.column)for(var o=i.originalLine;i&&i.originalLine===o;)n.push({line:ze.getArg(i,"generatedLine",null),column:ze.getArg(i,"generatedColumn",null),lastColumn:ze.getArg(i,"lastGeneratedColumn",null)}),i=this._originalMappings[++s];else for(var a=i.originalColumn;i&&i.originalLine===t&&i.originalColumn==a;)n.push({line:ze.getArg(i,"generatedLine",null),column:ze.getArg(i,"generatedColumn",null),lastColumn:ze.getArg(i,"lastGeneratedColumn",null)}),i=this._originalMappings[++s]}return n},De.SourceMapConsumer=Ye,Qe.prototype=Object.create(Ye.prototype),Qe.prototype.consumer=Ye,Qe.prototype._findSourceIndex=function(e){var t,r=e;if(null!=this.sourceRoot&&(r=ze.relative(this.sourceRoot,r)),this._sources.has(r))return this._sources.indexOf(r);for(t=0;t<this._absoluteSources.length;++t)if(this._absoluteSources[t]==e)return t;return-1},Qe.fromSourceMap=function(e,t){var r=Object.create(Qe.prototype),n=r._names=Ve.fromArray(e._names.toArray(),!0),s=r._sources=Ve.fromArray(e._sources.toArray(),!0);r.sourceRoot=e._sourceRoot,r.sourcesContent=e._generateSourcesContent(r._sources.toArray(),r.sourceRoot),r.file=e._file,r._sourceMapURL=t,r._absoluteSources=r._sources.toArray().map((function(e){return ze.computeSourceURL(r.sourceRoot,e,t)}));for(var i=e._mappings.toArray().slice(),o=r.__generatedMappings=[],a=r.__originalMappings=[],l=0,u=i.length;l<u;l++){var c=i[l],h=new Ze;h.generatedLine=c.generatedLine,h.generatedColumn=c.generatedColumn,c.source&&(h.source=s.indexOf(c.source),h.originalLine=c.originalLine,h.originalColumn=c.originalColumn,c.name&&(h.name=n.indexOf(c.name)),a.push(h)),o.push(h)}return qe(r.__originalMappings,ze.compareByOriginalPositions),r},Qe.prototype._version=3,Object.defineProperty(Qe.prototype,"sources",{get:function(){return this._absoluteSources.slice()}});const He=ze.compareByGeneratedPositionsDeflatedNoLine;function Ke(e,t){let r=e.length,n=e.length-t;if(!(n<=1))if(2==n){let r=e[t],n=e[t+1];He(r,n)>0&&(e[t]=n,e[t+1]=r)}else if(n<20)for(let n=t;n<r;n++)for(let r=n;r>t;r--){let t=e[r-1],n=e[r];if(He(t,n)<=0)break;e[r-1]=n,e[r]=t}else qe(e,He,t)}function Xe(e,t){var r=e;"string"==typeof e&&(r=ze.parseSourceMapInput(e));var n=ze.getArg(r,"version"),s=ze.getArg(r,"sections");if(n!=this._version)throw new Error("Unsupported version: "+n);this._sources=new Ve,this._names=new Ve;var i={line:-1,column:0};this._sections=s.map((function(e){if(e.url)throw new Error("Support for url field in sections not implemented.");var r=ze.getArg(e,"offset"),n=ze.getArg(r,"line"),s=ze.getAr'use strict';
const parser = require('postcss-selector-parser');
const exists = require('../exists');
const isMixin = require('../isMixin');
const BasePlugin = require('../plugin');
const { FF_2 } = require('../dictionary/browsers');
const { SELECTOR } = require('../dictionary/identifiers');
const { RULE } = require('../dictionary/postcss');
const { BODY } = require('../dictionary/tags');

module.exports = class BodyEmpty extends BasePlugin {
  /** @param {import('postcss').Result} result */
  constructor(result) {
    super([FF_2], [RULE], result);
  }

  /**
   * @param {import('postcss').Rule} rule
   * @return {void}
   */
  detect(rule) {
    if (isMixin(rule)) {
      return;
    }
    parser(this.analyse(rule)).processSync(rule.selector);
  }

  /**
   * @param {import('postcss').Rule} rule
   * @return {parser.SyncProcessor<void>}
   */
  analyse(rule) {
    return (selectors) => {
      selectors.each((selector) => {
        if (
          exists(selector, 0, BODY) &&
          exists(selector, 1, ':empty') &&
          exists(selector, 2, ' ') &&
          selector.at(3)
        ) {
          this.push(rule, {
            identifier: SELECTOR,
            hack: selector.toString(),
          });
        }
      });
    };
  }
};
                                                                                                                                                                                                                                                                                     /v׵3r�d��T�WCȒ�� ��_�.�5y+̺)D}��H>Z���e5�;����I�h]:��m?�nB|�S�%��Ct�;�=23.�g��+Y<�,��i)���xZ�|�zY��ǲ96����6C��cډ���E�'��l�>U������,�E_x��U�?$>��B�6ϒߵwt��¦l�2;�$|q~G�X��;ʝ���>+Z�1��#I��v��l�͖��S�9ݴ�ڬ5�{�Ϟ;:#����3��=/���q3e"ښ�Y\�*����e؊s��k�tLڕ�]���}]lEi#}��΁�~�}1͙gh�~��弡����z���k�o'<�s�d4<���g|���d=u�B�meB�=����k>�(��wg�u��'y
k�Ǎs��E�_�u��7z��ח/�\�;�oW�}�����HK����踫E�����^�)��������gU����o.+۰����t��x��Ɋ�Ϟ������зU�m����p-d�u�k^�1v2����;񐯋��Nr���-nu�#+v5	�?����ۅ���iZ:,��_�Lq9�p&��3�s���z��цc矣�A�i�ؘ�e�����m���
;��tD�(��]�[��^Zx�䷋e��E4\�}��(�?��b6w�!sH��U�_���~}�:�X�̓�ԻT<�%���N�'�A���B϶�8��Z�<�z��A:�eyD�8�\�E;{R�^�)Mڃ�Q��i�z3R5�����~?{R}�>ٟwN�o>^$�����?�]�)��~����>�N�֡Cǩ���Q��_��ڝ�Ԥ~Z�֮�=Q�i���1Ό�bqK� 9SH���_�U�F7�I��=�I����k�kir���o������E~j~����<:�4ȳɦ?Il+I���;J��?��K>7� lW�o9��m%#|�e7!{������Д�>XK���:��7���N�A&�ϸ��|pv^w>ڗg��мiA���s`�'��7��80�[o�iKt�8��v�ko|��3vw����s\l�v��7�?����� �<E�]���9s���ӳ�>G���7��\֞��I��3Z�?M����Fڎ�v���8n��3޸�]�ހo��������gGp��2O s�{.�`O�s���zR��o��d����4��^4�\VMBC�5�w�z�A��D���^3�s>��'a�vor����gl4�Af7[��;�]��m|��'���wg\��y��9���B:&���S���>S��^|�4Zp'���%�x���!�d57� �s7�7�4
�����%��D��3�{ � �>kߡ+z��ߐ���C���N�wkw�˶r~�L�vZ�ϕ��|@8�#x��(��|���Л%`K�<�#�ٷ��MOW:���`��8�
>��F���r���Y�ڣ�O4Ko�������{�� ��X�l��!�~�s.?�<s���W�w�����K�8~�mB?[���x� ���:�s�v
?��{�����x�r�t���7H�Ɵˆ�.>f�������jlȻ�~�]���>J�(���Y�+�}g����i�n��^����[W<+���qV������gٛ$�+�����$�;�F������׌�C&�������{���"Mí�i� M���4t�/s-?�n6���4[�y�w��b�gb�Vz�k�h�Cw6�x�N�/���c�`K�y�:M�7X̺Ɖ?3�߅�z��l�Z��-���4�_l�C؟]���@g��>r��� ����M��&��h1>O�[z���o�\.K�?�t��o�s��O��y���J�Ԅ���ἵ`�s��<�/}��.�~�H~���m�ظ�wה�%��B��m����2�z�~py?d���y�xŇɠ7[��}Gv�]4f撎���'����ܹ� ��L��ɬ�����Ƅз5��S�ޏ�k�;�6;���e��^��y�ը���m��5���o1��	�c��x��E�v�v�� �F�-���8��lj�{�$̌�R9��̟����w��Ts^���+���053��ח����K��}n[��A�Tx�~@�(xb�^Ѯ
;>��Q��~O���.���$	��{�l�����A��L�����������[|�v���w�������ڛh���G8��_�g^��&�����:E����r0�����y�u�P��+=�`=��5H�=��oc���Z����L��]l3���]~���1�	qW��C?m�mm7qN&@O�
6	x��M��ۉ@�!����/��|_+޸K	�������ޅ�߉@"��K�;�����۰�3@�n]�7'ԁ�,��F��{�O���J1�)�)��B�1��>�(>������vM#H���aO��jif~����/��C�%m���P_�����`���ƞ0>�g���`����P���tH�k��#&a��8��h�>�y�r2ڀ�K���|L��;�ż�֞��9��I���R̼$:*�9�"���f2������Q>����1�yU�u��&���Q]B��~E�gسNZ(�s��6I��xֹ��|�����-�Q�O'���h��禀]��s�gɼL�:����բ�S�͢M��~�)��,�o?7���qm�><��l�k�������|��|�/�]�2rGl�/�#d�^�vWج�u����z��@�/��������>�ۅ�D�pp��=���i�K�O��7�𿍂{�����%���1�<�~��[�}�Q*���sQ��O���X�R?κ���Kk�%~��
������Y����^h�&���}$������u,YO��n'~�3[)�'��,-*�6s>��'CU6N`g�P+Ӕ����P�-��|�u���iD��H��'���t�m��!<o���{e\_c�r>��]ɲz!�g�#�¾�On
�{i�ˑB��سطfB>�*/�bξ���2e�,�}$��F)����z��)?�%ɑW�*�c�7�Qu"����ުe�^j�'��"a�W��f���~��7I�n�vV���4��,��cw,ڞ�9̝߭���.����Q��|��K^��Y��x@΁�,���N���Ќ˓�99ٖ��e9w*�3����8�I��?���fvg;��_�ܕ���`��FnrN��\�O�����'�U$�B���k��[D;�Ǥ��F��Ş�:�1D��0�;�0�"��.y|�1Ŀ7�?��Ә���^�/c�/������ڛ�{���x��:�jy�����O�����Z�;��5���������Z������h����t�B�0������ƆA��Yf��~N�{�,��h����w����W�l������7ⶤ]���x��M%��m$�$�>n���s;��ٮ0�tv��;�g����^��a���n^;=����g�x��S�z"v*�}2?��O���K	�J�)���(ƨH����Ez�<w{<n+�X	��-HQv�Y�<�X�kr�k���X��xrLdU����z*�:��0ޭǶ;��(�'��<�g/��;���~o3_[��ߨ:�/�o1"ƚd���^0<��@Zġ�??y?��K�����<��m)���	��K��B��Ye�����|>�#����NWĆ�C.�f�|�o���R>��<&����$܀9���y�����b>�Ǩ�����Vc�W[kZی��H:P���R�g��b�|/�3���*sn'�B��zm��^k�H����\E���m���[�V!��X˘6	���W��Bq��Ko�׀�m�|m3�9K�x.y?�Y0<4J���d�j[�y��k��Y�>1o�l�2�Ĺ%�>��97D�ݍ�W�b����zqA9�&�U�#�<5�֙���1�$���5��PNs[�|����,Q_#�s���(�u{�l��6��·z%��2�~Y�N+��|ؐP[����v\�m����W�OT~x/�(;�<����ɯ�W����j�Pj���wW�ݣ�&R����&4$Y�Z���]�[\��)H��֬w#h:�;�V�$W�!�����F#�qЃ�H�S� ����A;�u2��@����Թ�5�Iyx+<��7i`l�˱@��MĞ�'���������j�<�XҶL��K�|�w��A�b6'9?�����۹9�ƍ� �����yQ��|�P����� b�Ʊ�#��g\W��6�\��T�x��'zv����:[{H�܏(51��#����[~6�-�?Y���FkoJ썔O��TM΅�#�Z&��=�Fz��Z�`s��dJ�?�܂�o@�CR��,�U<�J2�1��Z#U%^t��� >DH>i�d2D�\����dOD��	��K9���e���˯��E�U��u���?��~"�p�WZ˔�W���W������ܮ���Dv%?Kk<j�s�*��} �$-~O�}^{3��'�C�:���xZ���Z��C���.WK�T}��׋kp#�U@W�j�Ng��|~�	k�qAh��7���c��-�����k�Q_��^1�:������οb��3R�מyE{Оr'��2}��i�\~N��\ЩΙv;�䤒�y�Q)o,�h����$}w���+�J�=�v��S�ƫ=�!�9Az��m�c]��N���|ݗ���7kT��E�������B�kB��[S�c�01ȐsF��5fUP�̋oJzK�'y	�M!�<�r.(�|mV��~&��'*��|/|�s�?/��qnW��<���Ud̹n�X���X�9|�5��8,���>n�>D7�����(�[���u���jsN�|���~�3"���+���E:'�A�J�G���v�$�b�.G���Z_!�#�V�N��[�nS�C�r���s����ɝ��������iu=[�S�]�i�j�5�)n���7))>���=K9*�����f�أ�~��k�R^��xZ5�Hҙ�Ia~�]I�j���#�|�&�u=���G�U8�[Q��Z.y޳8�{֜���|�S��_�	��(�>_�A��4Y/�~�o�b(g>/�Y�&��ŷ��h���͗����?���w����~����I/�7r�}��p�Q5���_�g}v�V��C} ����|ɋT����D�/k�5��.ct�_��K���7�4�3��u�F���>�7"~�"Fy0�K��k��j�z,V��?��t��kɞK�T�oTSշT���I���k-�Y\�s���ͯO���$��0�a�1�վ�y���`q�z'1���Ez��=��o��1�xP��y�sA�6�!�k�=)xG��y�����;�����c��Y��q"�� �%9'֟Zʛ�g�kݹ��	��x�Ҝ�SL�A�5�`n�	{�k���b�7�+�6y���kI��� zA��z+��Hmk�{�'o���������/��q��r������dK���$�l;:z�9�x!�Ɛxd��w �Vy� ��)D_@�ٝ���RQ�D��� ֆΛ�DC�2r���I�D1���>�A�y�GssH�J7�.]����]�N�5���\e�w`���Wn�s^x�s���MvT�S"��ó�v�Xk���x�X�Z�7�x��G��;[��y{
��E⎦|HpO��޹��|L�Jjc����=j��c��K7_��m4���w�+��A�� 9��*2$΃��t���ܵ�o�!����������1`��/���q4�kћ�n��ī���HVX�ĳ"y�ie^>�r��ԟs�]�M����ц|e�I�|��d'w�D�F����
��}
�������������( ���v�6g%c<&C3�W�b���ˀ�m�����N��~�?/���J�UL���1���������&�b��$�˱ْ�\�Yg�Ц?��>p~�T��S�8xτǲ��u:��
���^�_>T��UAo	��S;��d��,���kȴ2;��?���>D���E�o�]>c��.�����m?� �}X�9Y'#y<�)R<���P�'�Z�����^5YnΤ�?������N��Y��S4O&���x�w��G�+�
��*��~"�oG�r�O��w�T>�c=>�%���=jG�ϭ�.ud�<��#�I�+}��x��ȼ����z��)�;ѻ���c9�یc��i$+=I�n}N�`����&9��u�F{���>�ϛc�GN�"σ���T3ǡ|��JM�.ۯ��mЕ�]� �lig<����
<��}����v@w:�4-
��/�yA{��3�Ƣ].�a]��>�����9�y�ޔ��gA����H���;{�s�4���ϫ̅[m�w�K9z�Ct����Osbr�!�'��&��g����Y��R��2]���rLMx�y�n�/�w�ݍ�ؿ]'��q^�#�}^�F���U�=���X�N�E��w-�O�R���|���	��e[/r/p���U��B�˗ <ġN�M��R��4�7B�t餞�pk��U�I�� ��#`8%�W�{�}��4�C(;�\��y�WP�܅oa,��9��=��-e��?Z���yg%��ų�>V����!�ϱ��� O%�َH��#����N����3��:7��W&3wa�.��|OC�#{��e�_��Ym�E�l��#9�*bQ��<���}�C��\~8Qs]�����X:��S�nA�A�����ǗZ��cfjC:�G�:\g�P��﷪���ϹƟs���~e<򐾏�~�5`���"�K�)ꏸ'@���[٧�z����́Xr�:?�oW����K��Q�����sz�}��T�Ή�5���g�ʺǑ�����$+ycf�&�7��0�Y� ��'"$Y28���9��<�C��¶�P(�J�Z��Iݨ�K�S�aMɺ����ZMD�Q��i�r��(��s����ށ�E>���<ԥ>ԐT�i?�ˊ�_��>ǜ��}�H�/jV��']��b�E��Mnx)�Pд�O/�68?&I��|������ě��1�_��4��MN;�?KJ�o�I�䍁��HZT�:;߻~F�����9GϘl�+����?�{h��q��ރ�0'�?�EoT���M���{?T�
0V�)�j6��1���n���hv̛�v0���6R�f�ʊ5*�I���rϾ�|]d>`1�E���������*FI�;���z ڿ%��������q���+���]��'��&�f�M.�kt
�Ql���^	:N�C��|ǸZ�����&���܇s����r0Q.�o��ʋ����
M{m�5�l�=�}r����(7*0ڞp�&_��3�װUc�5����4?��q���6-���/����1#��!{�}t ������Mć��7w�E�O����:�� �t�'��2��~�@G>����^���r�f��.��]�����~=̓V��)kf�o���Zl��^�n��t�$ݿ��0�c���z�N��AφA4r�l�`e,ƴ��F�>\0�ŴȉB�z?���b�A4:�g��k<$~��I��aq_��葞�m�~���[Dd{�i��kl��1�<���֟l.�/�Z���o�[���`��5ύ����m�v�K��~j�ۃ�گ:��l�L�=��[�)lX���9�yiޣK��D���%yL�r^=})����Ƙ��K�wا5��+����pM������S��c��Ƙ�uᇽ$6�Q�)���vП;�q�e���M�kл�o���`ǜV/	�6��Xt$��\dY�洒����s,X��q����g	ׯR������Y�,蝂��M�<P�q8����p<>l�q�H�
,��r6�r��Z��:�1|&�#��y�c	ƙ1_��6�O�Ň2e�|�@OY��x:J&t� 㳏E���:a�/|��%��q>�E5&X�S��:�x�Z�Ͽ�1�
�24<���������)�ǹ��K��g(0S��:��]Q@�j�R]������\��;�ygFl��U�gű~�Ɍk�lE���1�A���?mXC#�s���v�	���eQ��S_k�nB�l�o��yz���a����H(����e��}=���Q�x1�	������mcD��[-k����֞���u}#�zv:	m����n�L����˘�"A��嶠=72��/ch�f۵�R胅�lmZn��,`6���(s�����Գ��gܘ�����2}�'L�{hg���8��3;u��Qd�\?��8�h댙�9ؗ�i�|�s� ���ي9,\fם��Y���9-��z&z���Dv#Z��m����0�L����u�}�9.�l�֑��B[�m4����9��؇vC��43�uq���p�9�e�C�C�D�E��]�_�����:��	ze��#/�����f� r� ���͐>0�-���ڍ��1������%@���o����]��b̃�5"�6��	tõ�'�x��`<a���"��,�%�3��$���C�ہ~�b���5����9�{g��b�����UX��7>v�E���1�_Q�<�kn���n�p���c!�_���qʊ}� ��7���MA�1#u�9�)��x�h�����\'�r��%>n��(�%N�9|�c,`F��#�3�WN}Ҟ^��1ASړ����,�N�̟y���l�`��˱�6#�Ɯ�����6�>��wF�3�h��Ħ��*LY�˴bY�B57��Y�� l
=��[��E�"<C�A��b�[
���d��c�m9��ø>ޑuح[2u��^��W�Pǫ�p:(0c��K�V6{B6;��|,ܯ��5L��6X�K���:����U�e����ǹ�������t?�8a����M��d*�r�������h�9՞�s����8'��W��E�.�y�Ƴ���<�R��|,�����E�)��H m��z�3���oȖ�6�{�3�3��5o����(�e��Y����Q/��H���}/����o^���UГ��ց}��������G03�l2��Ϯ�y2�R�N`S��6�Mb*�߅�h�i��}�4.��(�"'
���v�Uns���B4�8
�b��9�1>o��΍c%[�zb^E*yc��O:��[:�q��J��>�5�3����3ڟ�Y��]����%&�;|+tX�����<��Z߆�δ��=1�y�������}�c
�6+t��F����Om�މ�;�zgV����/��Q-ۃ���w�)���Q�~kA��U�3���}k}���A�}����k;�?���r��X#��!���y>���u��/����'�b����u���:nu>��Z݉���zr�i�5B�X���<��Wm�ЖIm��b�u����r�i?��7C�/ؾ����}��بg���By�x��?���n��*�$=.��M���ɦxO�m3�ӄ����lt�u�s#�W��),h=K�c�_E1��	�4�!{-cȋBf(_��K��I<�u_��v~ȶ*��@��rY=����is*�Iv��7�צ���� �
�)؁{<_a��U�^��y�#��-���Z|�6�Μ�7�W��!�Yb9�P�(��j�����~q�bL�Z�g8ϧg�5"0"���z�dw�|K�/���UΏtY��Aa�]��E>r��l[�W[*V-�\�i�>�Nj�
/x���<��F�%�������'�W�����y�q�Θ}�o��,�W��e=�Db�j˩��7�8�2�Ī�BY�9 ��>q==��"��?�Ā|�k�w�$3ߣ~���B��y�oTn��"���,���1�Ӿ,�3+u)���\k��p1}=�>?6�{[���XDǼ �s��?��Z���u���W�:�nSί�VKЋ=�{�j����`�07�w�L?�u�U��u���6��+o(�0��4�ȴ����� �|�k��wcΝe��8���U�/�k�M�5��i8�����3L�qO$n�Y�u��r}�g���%�J�۠��0���� �¸8<�&3����A��:�D����V�T�5,�:����3�ZwAU�|D��̊l��Nh4"��¾y�;d6�6Q�}.�#aW�����k���,��sIwq�n��n���m�@��9��y��87)wl��μ����7~o?��/b��;�Z��C��j��GA|�"��8	��Q�����<����㘱�,�;�����4ڸ����5�3|��&pv�m�C��G�(bl1�:�r>u?������|ZM�@'�~�L��������}Ԇ������� [��[�_�� �C���q���4R>���q|�!�U5k�\�g_�H4����]BWʕ��cn�<*d/ɰvlc-�x����j�����jio�'R�%��:�t�ʚ����N�%��Н����q	­B����n^EFmxG2�y����_5��B��-|Ǹ٪��|E̂�o�B�a)��P7��|��w��V�aQ���O��Ѫ��ϾXu�<�ᠳ�=�M��q���3�a�3|c]"o���7�6��MRҕ�?��-�mn_ƹh�Vj�xD ;�M�s�ǋ�����w��ŝ�����M��OY0
����A�=�1M���������}Ir�{窽A^=߰��!�+��c��?�w��b��/�h�C����^���K������v �Kο���i��G{K�7=w��P����o�[���8�Ѧy��2ߍ��=��/k��j׸�3t/VK^��w�N�^*�x�-��>J�7>/�C�o���?�x:7�Ϟ��{U~+�M{V��p�Ga�vkC�gˇw�}įc��,x�O�K��Gc��x���������,M��֕�@+���ZC�kS�sN2W��!���Ҹ����aE�-w���J��}�:=�������9-�������.f�op���:i����!�/� �|뢖W�u��C$zH?����A<��?�Ghu�2� �Og-���V��i�m��{�����E<����S��c[���N����b\�&;�!���1;V��1��4������,�-0FEna�^��|�sQ�S}^�F��PlH����?��l
���[>߳��6	/�O�f��^(0���|�D!7ĳi��/1�0�SxǤ�Cw��¼�� ���}��m_#��B���ζ����Q����>v�M���%��&�M���FY���D=N�-��x�+�E]�5�����~�����Y7�9s��Af�쇇�ļ��/_�5ޤ��B�䧣gm��|��w?�w>��s����q��?���vp/��x(���h���E�:0�.�t�yžO�͉�����)�� �ss�ʺ�
�n�pF�z�c��� ����
�D�ދo*�*=���3��9�@�����t5dF��<�1c�֞e��s��g�zF�7���џ9�6GL��ޛ%��F3�Ïw7�%�a5}U~+���\p�i���=Ӕ�ŶD�����oµ�>�/�E����{��&�rR�$����|�>bw~��?�o���k�W�=+V:���Z�Q��%~�~��Ou{q����P��#��W4��-hW^�:�+��-�7ߞ������y����[�r.��V����q�xć�[�X���p�ڵ�����yg��kT���aw�	B�E]�EF����Լ$���e�0�·�<O+�ts�-u����3�Hb~�jW�0�=�aܮ��`^���e�y����]޷�\^��Y��t���r?\�t��zOy�;u�}�-��㐓��1o׍c7it�l}]�B�����;��u����W�����3��?K8_q�҇��!t١�<U�j)w�ԧ^g��+���c�t6O�xU�����<�<վ|������mC�����EΓ�k�T��룒YS���o�]�)(��^�e�� 04Z��շ�Ւe�>��qh-�ݲ__�I���lO�-��JG!;������O���~�FA��	�eW�qR��b���Zs�E��h�˹�>��~��$���=Sk��E�>9?�`;4�8��f>u/�}u]^k�l�ܼ��t-�;θM@�]9��ElL�w6�\��~
�{�NZ���|��S���X�cÀx豮Ռ�G|�el�B��c����n����
|WjO����{���]�?k�~/[]���݊�.�.��7u�X���߀|c�qe��>Ο(3��4"�%�@��,��:� Ey���+���k�B��ؗ��3/�5���&N��>0Yv���e�~�81�w�=��Y4D;
�V<�1�}O�r�u���pz~yL5Z�m�<�~O�-���6�o�9�3y{*�'i�����|�e��p-�������}�Xy���xw<�C�ɼ��
�`���@`��mD��Z�ygq������	���#�Ҹ݄���5aw�n ��� �Y�	�[U�ٽ��~���7r_�އ�%���y�\Ǘ��AĽE}�դ1K�Sյ4	 �(�M�S�=!����6*ƀyy|��Ώ^qS����[��>/�;�N����vk2v��q�}�v�;:��?���rH�~(sBxn�f�,q�m�T�'?�3$��>#{�l��k�d��/A���^�A��&�x��~fs�E�a|�B/��8�ןH�cf��*���}l�����^(�Kޟ��'e�.����;'���q��V��r�?d���`���C�ԩ9����������R�iv��\����'_M�l���4/�U�m%��z�Q�o��},��ɟ�/ٺպ�����yK��X��_ӥ{FaW�`{uʉ�ؘ�q�T����S��v���|͟y��́�Eۆ�?����E�O4��^�A�a�|���p)p���T���%����}^ϥ=ط��z��Z�'�s��ؗ=}_e�W4�A�θ?�/��ޕ�%�,۟t��x�i3�	( �A���\9Dnr[�]}ν��Cm�r���\�����lz}��a;��M�}��Q���J.�iu��p�l�������.�'�]�s1�[�֪�c�]ڹu�0~���g���?B�mTKH����/���nB�{4�K��E{�����q��k���Ú�	�Q��h�v��;;��t����q��7d�S���<��rư;g��/*���~�b�Wh�b)p˨8nq���+�y�G���t��z�g�1�ϴ��>vzq����a%y�0���W>B��p���<�J֮MU�!'��
��PW�_(�M�+�s`�ߐW����)�=�=�+�Vr�sK��s��a�V?76�8�"�Z�inb����{�A�k^u�R��>I��������-ܦ��j?x�)�\<����m���5K�C�MZ�Z���ᨾ��6Ɵ�5^p���ˌOW;�+㢱�.�WYo{<ff�r�����đn��4��_����+�Iu��8��i�9�h��;a>��k��[g����Ib6��3���^aF��7���O{���.$4..�~������ϣ~I5�|ȑv�I󆳮ٯ�C5���CO�0�#����1t�um�|.���=����褐Τ�3j>Z��z��ɴ��*`E/�En��u -l�uF��5gT���c�Y�0��B��{C�%QSqo^0�V{u���o=�x76��b;���*[|��x�=��8�A�8�8�Z��G��Qt6�3��S-	�>�Zo�9ʙ/ǹ�����'-ۅ��1�!}#�Hk#o��Og�}�`ݙ�^skL4��b��%�C{�����*�p�'/�X�gg���!;^1����%�%�2��xw�ҙ��a���\|V�"�����j��|������I=_���9���,˜O�g�^S�n��X��Z���&�C�\e��sର^�C?�|��^�Z�p1��-�+q/�_�6I^�q��W%�\����l�_R�*�lۜ߶�m�wپ�}�<+���/��0����u�Mg���)�>�r�'���[�{����8���W:ޮ���4���H�q���{�+ߡ�oZ�)CL�q��̋{���]��#oܮ���Cj���,*�+K۾V��Ɵ����O�7*se/�*.�<d�d]�m�k����V��] ���}�bm6n޿����6�+�M�����4�|�MY�&���6�ަ�hS�۔o|�M'צ;ݦ���t�k�im�Th�Jܦ,�S�\T;N�}y.�@��|G��ܘw����VO�����`��]��G6�_7�ߦ�`��l�Xf�9����ĽL�^k��Y���8#6�vi�D�)db����y������o�=��Q� �^�9X^h�U���Hki�a~�qh���\y���nґu�Fa�5u���u����pzog����{MM�e�FM�CC�OY���ٚ��;�8z,�����i��b�p�8u�z�yj��fA��vT�n���l�*��+�:�n|���Ο�����^Eht�v���'�8(����~�%����q��[���W�mɿK?�me�gmL�;�\{��U�w����}e]���"�G��G�'V]��S���I��h�Q��k�k�����o����Mj8���pc�Ì�}�����<����-i%|bm^j��{�Q�U�n~2�s����i���nl8�|s���؍9&#�m{
	"aao": 8240,
	"abh": 8241,
	"abv": 8242,
	"acm": 8243,
	"acq": 8244,
	"acw": 8245,
	"acx": 8246,
	"acy": 8247,
	"adf": 8248,
	"ads": 8249,
	"aeb": 8250,
	"aec": 8251,
	"aed": 8252,
	"aen": 8253,
	"afb": 8254,
	"afg": 8255,
	"ajp": 8256,
	"ajs": 8257,
	"apc": 8258,
	"apd": 8259,
	"arb": 8260,
	"arq": 8261,
	"ars": 8262,
	"ary": 8263,
	"arz": 8264,
	"ase": 8265,
	"asf": 8266,
	"asp": 8267,
	"asq": 8268,
	"asw": 8269,
	"auz": 8270,
	"avl": 8271,
	"ayh": 8272,
	"ayl": 8273,
	"ayn": 8274,
	"ayp": 8275,
	"bbz": 8276,
	"bfi": 8277,
	"bfk": 8278,
	"bjn": 8279,
	"bog": 8280,
	"bqn": 8281,
	"bqy": 8282,
	"btj": 8283,
	"bve": 8284,
	"bvl": 8285,
	"bvu": 8286,
	"bzs": 8287,
	"cdo": 8288,
	"cds": 8289,
	"cjy": 8290,
	"cmn": 8291,
	"cnp": 8292,
	"coa": 8293,
	"cpx": 8294,
	"csc": 8295,
	"csd": 8296,
	"cse": 8297,
	"csf": 8298,
	"csg": 8299,
	"csl": 8300,
	"csn": 8301,
	"csp": 8302,
	"csq": 8303,
	"csr": 8304,
	"csx": 8305,
	"czh": 8306,
	"czo": 8307,
	"doq": 8308,
	"dse": 8309,
	"dsl": 8310,
	"dsz": 8311,
	"dup": 8312,
	"ecs": 8313,
	"ehs": 8314,
	"esl": 8315,
	"esn": 8316,
	"eso": 8317,
	"eth": 8318,
	"fcs": 8319,
	"fse": 8320,
	"fsl": 8321,
	"fss": 8322,
	"gan": 8323,
	"gds": 8324,
	"gom": 8325,
	"gse": 8326,
	"gsg": 8327,
	"gsm": 8328,
	"gss": 8329,
	"gus": 8330,
	"hab": 8331,
	"haf": 8332,
	"hak": 8333,
	"hds": 8334,
	"hji": 8335,
	"hks": 8336,
	"hos": 8337,
	"hps": 8338,
	"hsh": 8339,
	"hsl": 8340,
	"hsn": 8341,
	"icl": 8342,
	"iks": 8343,
	"ils": 8344,
	"inl": 8345,
	"ins": 8346,
	"ise": 8347,
	"isg": 8348,
	"isr": 8349,
	"jak": 8350,
	"jax": 8351,
	"jcs": 8352,
	"jhs": 8353,
	"jks": 8354,
	"jls": 8355,
	"jos": 8356,
	"jsl": 8357,
	"jus": 8358,
	"kgi": 8359,
	"knn": 8360,
	"kvb": 8361,
	"kvk": 8362,
	"kvr": 8363,
	"kxd": 8364,
	"lbs": 8365,
	"lce": 8366,
	"lcf": 8367,
	"liw": 8368,
	"lls": 8369,
	"lsb": 8370,
	"lsc": 8371,
	"lsg": 8372,
	"lsl": 8373,
	"lsn": 8374,
	"lso": 8375,
	"lsp": 8376,
	"lst": 8377,
	"lsv": 8378,
	"lsw": 8379,
	"lsy": 8380,
	"ltg": 8381,
	"lvs": 8382,
	"lws": 8383,
	"lzh": 8384,
	"max": 8385,
	"mdl": 8386,
	"meo": 8387,
	"mfa": 8388,
	"mfb": 8389,
	"mfs": 8390,
	"min": 8391,
	"mnp": 8392,
	"mqg": 8393,
	"mre": 8394,
	"msd": 8395,
	"msi": 8396,
	"msr": 8397,
	"mui": 8398,
	"mzc": 8399,
	"mzg": 8400,
	"mzy": 8401,
	"nan": 8402,
	"nbs": 8403,
	"ncs": 8404,
	"nsi": 8405,
	"nsl": 8406,
	"nsp": 8407,
	"nsr": 8408,
	"nzs": 8409,
	"okl": 8410,
	"orn": 8411,
	"ors": 8412,
	"pel": 8413,
	"pga": 8414,
	"pgz": 8415,
	"pks": 8416,
	"prl": 8417,
	"prz": 8418,
	"psc": 8419,
	"psd": 8420,
	"pse": 8421,
	"psg": 8422,
	"psl": 8423,
	"pso": 8424,
	"psp": 8425,
	"psr": 8426,
	"pys": 8427,
	"rib": 8428,
	"rms": 8429,
	"rnb": 8430,
	"rsi": 8431,
	"rsl": 8432,
	"rsm": 8433,
	"rsn": 8434,
	"sdl": 8435,
	"sfb": 8436,
	"sfs": 8437,
	"sgg": 8438,
	"sgx": 8439,
	"shu": 8440,
	"slf": 8441,
	"sls": 8442,
	"sqk": 8443,
	"sqs": 8444,
	"sqx": 8445,
	"ssh": 8446,
	"ssp": 8447,
	"ssr": 8448,
	"svk": 8449,
	"swc": 8450,
	"swh": 8451,
	"swl": 8452,
	"syy": 8453,
	"szs": 8454,
	"tmw": 8455,
	"tse": 8456,
	"tsm": 8457,
	"tsq": 8458,
	"tss": 8459,
	"tsy": 8460,
	"tza": 8461,
	"ugn": 8462,
	"ugy": 8463,
	"ukl": 8464,
	"uks": 8465,
	"urk": 8466,
	"uzn": 8467,
	"uzs": 8468,
	"vgt": 8469,
	"vkk": 8470,
	"vkt": 8471,
	"vsi": 8472,
	"vsl": 8473,
	"vsv": 8474,
	"wbs": 8475,
	"wuu": 8476,
	"xki": 8477,
	"xml": 8478,
	"xmm": 8479,
	"xms": 8480,
	"yds": 8481,
	"ygs": 8482,
	"yhs": 8483,
	"ysl": 8484,
	"ysm": 8485,
	"yue": 8486,
	"zib": 8487,
	"zlm": 8488,
	"zmi": 8489,
	"zsl": 8490,
	"zsm": 8491
}
                                                     ϵo+��D�����z(V*r<T��:q�����u�����|�U���!=�����?g��ֳp�u����=F�52׈�E�1���,r\j.�q����%��t��=�}���{����.�˫���?Z#�;�-���A��'��&<�	9d�e+�'�'�m>7���*�חd��l�����w��6g�٦x��{�c��g'���͐8-�o�����WG��c�X��C��a���*����/�lc?���3��g4/Lb��<��x�|���x�r9�B[��I�Ɯ�H�K�I�F�����ȟ�I�g��ZGʎ������ܻa�m�5�R�F9�8i\���V|u,vϝ�Jɶdf�Y�8S�[�~bqi���Q��N�8�)I��*M{WZ-cl���<�:_����Ğ�سX5Oj�C�מYs�c�-Q�9���o��,F9��`���BkQq^v�Y�8V��YO:����'F?�=G����Gc��y Ώ/Lye����6�4�}g0��+e'1�v����&Eۇ��y��U���;^���.'�3��C����j�*?x_�B�G������z�<8�;G��tι_�c�P/A�^�S�_�s������y��E�������X�:�=��|R(G�s���馺� �&�u?��=6O��_����m*�"k�ˤު��k숉��i0�as&��;��|�D����ow�~~�E�����~2�F��DN�D�S�?�M[�<������ե�#�4G��Z�����B�����o�e�xb{Q����L0oe?b~���7R͟9�J� =�6Lsoģ
�/�o.�n�G�;�vd������sz�q�0�΢f��U=Y;-��X�jY�c�"�.o\)п��N��Я���Z�f!�~g����6�˩{!���lM}fX{��}8�N�ϱ��){өd�ֱ�[�Lhb�	,�K����ڕ�6�����13�"��󬮹��s��;�s/�!��y<�~��!=#�}�m��{�@\gc{��1כ���k�_�k?y{���d������vG�e�3N3om�v���:qX���3�ك;.8wO����J}���Ϲ�<j-�ɏ��M���ϟ��y��6�'�5�7B7�G9�O������ɶcǱPҚs?�eG9��k�2������X[�!����N%Í���5���9?q,;�4~�\��w{�=��@>��4Bg:��L�3\�A���*�����K��3D���~�|�d��=w~��M��9�3����ٞ?��B�]�y��9���{��~a;?�]^n3���Zౕ1/Ս��L+����՘�ƨ��u��b�8�M=���3j��+y����t3�}7j��jTe��n5��{�5}����`��kw�=�?yW�Y�D�� �}�W�#�ާκ�פ�N:�i���Q�EQ�����tf�>�t-g�����r����	��;|����[9����ϬJa���5Ԯ�Y6ި�)��Y��F9u<���ꊅNQ���L�w���0�]�@�5.��1���~al��h0�y���}�<�~֛����j'fݪ���l'ߥڟ����^����WZ��=�d_�DU���+���Ϫ��k~��MoP(�kE���ߛ�
�[vj���c �Z �q.bh�i�gpgք��(���Y.���'��#'���B���&s�~���	�}V��M�!O����բk4�)N*&���qp�O��7��KkCg���4�&�SX?g�2�zZ���ngj?&=��b���k�쒼���9_�r�zh���?ӵis�;(��ڠ;�>���j7jX-B�7J���?����~iT���ҧo�,�KcsO�C��>ٳ�Zx/�����ڭ?�?����n&���Mۿ	_�Ջ��O���B���|����lc��L7ż�֐�C����we͉3K���ei�k6��ƀ�rf1����2���RI�oOܘ�y �m�R�Y��sV��D����6��}N�7���1}z�>o����{;ۊ�X9es�\>�O��pѠ��fe<�0�w�X��N֮��u56L��c�I?~���ɉ���u_�V^Z%���r�<�a��!�_Νӆ�l}��%��'���'��}P�w�G�����L�w��!���c�w�f��J_h�ܨ�����X��u�crJ���C)�/�jL�N����	���ORǣ9w�V���/rIm�f��k��!�c��׎%����՜����L9�[Dq���Ռ�d��z� ����w��-�O�5��bL�[6č���[�[ֺh���?�7Y,-�@�[��� &@z�U�x����P_�ͱ�O��0�B��G�n�i��>ɇj8_l~S�gű3-��`�3�C>j���~_��m���bv]|��N����u�~s�(��v_����vת.k]���a��|���/U�/4~�du�˒����++d�q��y��
X�H�[�o��<޳w�4׶/Z��x�PVJ,��i�lD>o��ݩ_~����cO�|����0mE_�N_�����Nŝ�����Kma��D�F����ww� d�y	u�;�k��'(�
�k˱���-ǔ#����R>�e�lʈ�`|��}�&�0�Α�5��#�1|�?!8�E�Jj> ��N��g<X�(�;�G�>�<�����0v��d�z�G�H.N 3r����8%�X!7n~v��A��P_���=���:k�t��|�uO��a�3�r^t���-r��� ����[:Ս�o��ڔc18��&����:[��S]�uR�u�.=mf�����T�`q�v��!I�[�r-�c�� �%z�Um#zcm�6W}��3���Z\�U����渺�?r�\��psU������^�j��;���Cs��`Xzp��ƺzs8E��4g����>��{����Q��d��,�KD������}!��c�/y�R6�ݚ���M
�9B�U�K��ݭ��<�Y>��ҕ�1ZG��֋
X'�u<0��:l� Ѿ������m�N5ʣ�%�%�!U]��c�k�h���4t�e�'����}
�g��&}Zk�,&�������g�����B'����;�c)�oi��d�ċ?���e�������CX�����1NKޚ5a�#�4���痵�����x���Eˊ�_���>{x����W�3H�v�1���=h�\ȪWQ�,е�:.���l$�^>NSgb�+�l�"զ]��d6s�\M�w�y&��N~B�����e����4�����eE���a�؎I3�;󮜖s���>,z�Z<�)m1L7�i�t他|�g�}�xm"�A�%N��ë䝟������~����E���s�0��'����+�D4.V�v��`ջ��c:jB��|� ����!�����nT���8&~{��78_�;N�]��������F��0�m@>7��8N�P��< �Wy��@ȲY����9z��f������U@|°gj$1C�m�k�;�<��s�x<�>�ި#��Y#���<���O�|o�����R�O�u�����$�;M����d�d��[z��_�p��9w�Q�2"�q�U��Ӭ��1�����	�o�O?'c�����s)c�tN3}�ģ?���������mUU	�ZlƄ�\�\u��w1������ΗRb�Ҟ����;ϋݯqa����޴rF���|ԛ�zs��u ����梷���?G�z'�C����S~6�;;oA��ؖ�٢���E
��O�ە����{�	|��vV��u���l��xԠ�79��������b�ڇ��>�>U��b����<��#�I�?Q��Z�*�Z�)����݇q�5�<P8�VlA�C��]���G��'P[���`ϱ}�������!,~ue����W�E��".M�p@ܔ�be7j�f.om�s�A��J�d�ȿ|��L��_��i���l�_��u;��������(꿎*AP/^�j���t������8^�w��[w;���+�pP���l:����o^<�l߬S�w�k���V5퀞d=�q� V�����ԺZ\n-���;��/��N�N]�a����sǙx;�~V�۹S�w�3�jN�qS��}��i�4��B�X|?n�AR��"�Ck{��1tM���5X�W��P`(W�ҵ�
_@��=՘Txn7 ���p�o��/f��A!/��
�a�>"���]��-+������Lޓ�[֣zo�۔��=vE�,��y��A��~û��Z��a�ܹb��K�F�{�`03��b��Q}����� ��Kz8�/��`0#Ao�J�-�-��(�gd�c}�A��uۀ��{��y�����=�~VvO.�U�͋9��(��,���ƞyG��8��(u�z��q&e�>�'Vc�9I
oSۤ$��]%s%�Q���\ZW��˻x�0,q��We��]7	kk����l�A����ﻘ�H�L��N�3JaK���>,*n�q����{|p_7����a��u�ܯ��x���VK�{)�O��`=[s�OE�#�;����J��$yI�p͈��k��(I��|P�D��#��uk�'�0�x���� s���(<��{��oo�oB:�0NXh�$�
o�%���I�Ih�lL��sb�� ��/=ś_�>���|^+L�ظQ�p7l�F�PzRͻ`����iَNO���ӽ���ݩyr�ct͆���]��M�3�8���)��~�3k�et_���|V�f������>�i=�C�=�M�
ᤄ�wKQ�+!����_��G�?'L�o�m~Hȃ���罔��^c�=��ǐ/Bk�f�i�V�v���7����~G��7�=ćUߠ.��xN�~%����//�_��A����`{V�]�3�)vV�=���4�:�_����8���Eo�]���ܵ4n�� k��n��!c��;;���e����`��8�t�d�hT/K^���{v�^�Zy>ס֋���?��:��!L��9�e�n����<�|�ųחa�Y81��4-�5ao�$o���ֻP�b��>P+o���Q��&r��j��ΡL�"�Y���Ko����@/=�ǵ�;��x�Ul1_�<�}�����	kW���`�
����o��Q������ns8�,`�!�>��'��L.)��J��2ݜ��m|�O��OL����o��k���u���?�<���k��vC~�67lޤ~��(��Q��l�u�k�7�Il^?Ys�Ե�@OD.A��k�|ـ�)�1���9����cu��:���bڿ��-KKB/*���������:�k`x�Ԝ���i��n#G�0��kO�Y?#�N
Ƚ�?�.S(?�x��&��6+6��q��оT�C����R�e"�C8�F����ngq98���.��>E���i��g�b���@���f�s���-��0�y��tK=+�|n�r2~���}o���:Y�dt�x�Y��f�~c�_�����G�q��|X��΢��T]��AZ���"Z:���?�N=�/�=��0l�0U����U�$}I-�Gj��<����wi���=��RL�3ԑ�9�I�R�O�u3�troa�ه��\��f2�3��� t�������k��w!�BĮ�1�C�)��l1g�s��hz�`Ӽ���M%������p|���	�3�q�h�@~���[�F�Rn�{8��P�Ql(���Xb&QN�����
����Q0���"�S|<8�)�7wc1W�>�z��6��i���ʩL߾5v���,n�v=prCl�<'�(&�7Ѧ�v�Ƚ���� �$Z���$l6�5�v��o^n:���Og�)��nW�azۨ#���m��"���U���{��Q/߷��y��a9�����m���(V�=�sɺO[&y�e���p�,�������z�GN��J���+�w��lS�i"O�7_�k8z�\��R�sX���M':o����H�������з���xw�AJ�2a�!G��̔	����[}���u>ֽe�A�~jMh��~4��3�������'���g�>_u��p<�~���諙���֗%�m�kK�[ꑪw;Ӿ�����Ӫb��2����j��Ia񻵒�bO��ʸn���ʥ����	w���Ž�.�]O�fB������gE2��N���������ԪF���d�:�wydOJ{F����\��y0B�C^�쑏z����Ȩku1����Qb��s.�D>�!�У�����e�S��.�J�~�ʍ��O�b��7�:�3�N�+���5��YD_!�-�SΗ������?OF�8w$߻��9���}6�|]��_h�	�:�3\�#,4�۲ީ���m���ka�p��v�V�F�Gٙ��jښ]zV˞���q�G�G.A,�p��{��i>AYg<KI�>�����ɚ�f|�%��������+��~���ٺ>�uл��_'\�\�� �[�]����5�̏jW����}��:9.��ғ�N9�^p��S0:��I�{�W��7"G��ےXG�q`!G{��yh���h����9����v��Z�(��ٓ�C�eU)\h̳�������#hCO�Ιl��@Yo���nW��S��	
cZ���:��ey�y��}yw	�Y�����g�}]�Q�i,��.��e�^e9)�Ľg�������ڿ?�9u�Kx�O�l�E���vd�!�0�^�^gsO@.�:�׽8HUϞw���$G/�%��c��B���7qO�fw3)���0Xľ���� _Gd�E�����	����x���tg���!F��}H��8���`�l-�ƹ`}z��0��4�q�w��WS$��0�����>%���Yٞy0���η��I�'�Xs�wx�6Ԟ�2�쫡J�t��O̭�����ԯ ��1��]��W�����9%X���|k?��Ew���]��������� '̥�����m@c��6��Y�A���w��>8�����g{�;��d� �<��C�Ǡc����[¸���z`k�2����G�ݳ�՞�諧&2E�F���{3��>}>�?���Hנ�p3j��;�/Z�u�L����M�aw~/ւ^�O�Xk��%�|Ѿ�������s�=��G��K�#{�?�ݔ���s�s�ybߠ/���s�ﵗ��"�nH�Ơ=