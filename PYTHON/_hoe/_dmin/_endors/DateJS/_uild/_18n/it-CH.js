odules){for(const{node:n,resolution:r}of s.dynamicImports)if(n.included)if(r instanceof kn){const s=this.chunkByModule.get(r);s===this?n.setInternalResolution(r.namespace):n.setExternalResolution((null===(t=this.facadeChunkByModule.get(r))||void 0===t?void 0:t.exportMode)||s.exportMode,r,this.outputOptions,e,this.pluginDriver,i)}else n.setExternalResolution("external",r,this.outputOptions,e,this.pluginDriver,i);for(const e of s.importMetas)e.addAccessedGlobals(this.outputOptions.format,i);this.includedNamespaces.has(s)&&!this.outputOptions.preserveModules&&s.namespace.prepare(i)}}setExternalRenderPaths(e,t){for(const i of[...this.dependencies,...this.dynamicDependencies])i instanceof Te&&i.setRenderPath(e,t)}setIdentifierRenderResolutions({format:e,interop:t,namespaceToStringTag:i}){const s=new Set;for(const t of this.getExportNames()){const i=this.exportsByName.get(t);"es"!==e&&"system"!==e&&i.isReassigned&&!i.isId?i.setRenderNames("exports",t):i instanceof ln?s.add(i):i.setRenderNames(null,null)}for(const e of this.orderedModules)if(e.needsExportShim){this.needsExportsShim=!0;break}const n=new Set(["Object","Promise"]);switch(this.needsExportsShim&&n.add(rn),i&&n.add("Symbol"),e){case"system":n.add("module").add("exports");break;case"es":break;case"cjs":n.add("module").add("require").add("__filename").add("__dirname");default:n.add("exports");for(const e of Os)n.add(e)}zr(this.orderedModules,this.getDependenciesToBeDeconflicted("es"!==e&&"system"!==e,"amd"===e||"umd"===e||"iife"===e,t),this.imports,n,e,t,this.outputOptions.preserveModules,this.outputOptions.externalLiveBindings,this.chunkByModule,s,this.exportNamesByVariable,this.accessedGlobalsByScope,this.includedNamespaces)}setUpChunkImportsAndExportsForModule(e){const t=new Set(e.includedImports);if(!this.outputOptions.preserveModules&&this.includedNamespaces.has(e)){const i=e.namespace.getMemberVariables();for(const e of Object.values(i))t.add(e)}for(let i of t){i instanceof Js&&(i=i.getOriginalVariable()),i instanceof ln&&(i=i.getBaseVariable());const t=this.chunkByModule.get(i.module);t!==this&&(this.imports.add(i),!(i instanceof on&&this.outputOptions.preserveModules)&&i.module instanceof kn&&(t.exports.add(i),this.checkCircularDependencyImport(i,e)))}(this.includedNamespaces.has(e)||e.info.isEntry&&!1!==e.preserveSignature||e.includedDynamicImporters.some((e=>this.chunkByModule.get(e)!==this)))&&this.ensureReexportsAreAvailableForModule(e);for(const{node:t,resolution:i}of e.dynamicImports)t.included&&i instanceof kn&&this.chunkByModule.get(i)===this&&!this.includedNamespaces.has(i)&&(this.includedNamespaces.add(i),this.ensureReexportsAreAvailableForModule(i))}}function ra(e){var t,i,s,n;return null!==(n=null!==(i=null===(t=e.chunkNames.find((({isUserDefined:e})=>e)))||void 0===t?void 0:t.name)&&void 0!==i?i:null===(s=e.chunkNames[0])||void 0===s?void 0:s.name)&&void 0!==n?n:he(e.id)}const aa=/[?#]/,oa=(e,t)=>t?`${e}\n${t}`:e,la=(e,t)=>t?`${e}\n\n${t}`:e;function ha(e,t){const i=[],s=new Set(t.keys()),n=Object.create(null);for(const[e,i]of t)ca(e,n[i]=n[i]||[],s);for(const[e,t]of Object.entries(n))i.push({alias:e,modules:t});const r=new Map,{dependentEntryPointsByModule:a,dynamicEntryModules:o}=function(e){const t=new Set,i=new Map,s=new Set(e);for(const e of s){const n=new Set([e]);for(const r of n){R(i,r,(()=>new Set)).add(e);for(const e of r.getDependenciesToBeIncluded())e instanceof Te||n.add(e);for(const{resolution:e}of r.dynamicImports)e instanceof kn&&e.includedDynamicImporters.length>0&&(t.add(e),s.add(e));for(const e of r.implicitlyLoadedBefore)t.add(e),s.add(e)}}return{dependentEntryPointsByModule:i,dynamicEntryModules:t}}(e),l=function(e,t){const i=new Map;for(const s of t){const t=R(i,s,(()=>new Set));for(const i of[...s.includedDynamicImporters,...s.implicitlyLoadedAfter])for(const s of e.get(i))t.add(s)}return i}(a,o),h=new Set(e);function c(e,t){const i=new Set([e]);for(const n of i){const o=R(r,n,(()=>new Set));if(!t||!u(t,a.get(n))){o.add(e);for(const e of n.getDependenciesToBeIncluded())e instanceof Te||s.has(e)||i.add(e)}}}function u(e,t){const i=new Set(e);for(const e of i)if(!t.has(e)){if(h.has(e))return!1;const t=l.get(e);for(const e of t)i.add(e)}return!0}for(const t of e)s.has(t)||c(t,null);for(const e of o)s.has(e)||c(e,l.get(e));return i.push(...function(e,t){const i=Object.create(null);for(const[s,n]of t){let t="";for(const i of e)t+=n.has(i)?"X":"_";const r=i[t];r?r.push(s):i[t]=[s]}return Object.values(i).map((e=>({alias:null,modules:e})))}([...e,...o],r)),i}function ca(e,t,i){const s=new Set([e]);for(const e of s){i.add(e),t.push(e);for(const t of e.dependencies)t instanceof Te||i.has(t)||s.add(t)}}const ua=(e,t)=>e.execIndex>t.execIndex?1:-1;function da(e,t,i){const s=Symbol(e.id),n=[ce(e.id)];let r=t;for(e.cycles.add(s);r!==e;)r.cycles.add(s),n.push(ce(r.id)),r=i.get(r);return n.push(n[0]),n.reverse(),n}const pa=(e,t)=>t?`(${e})`:e,fa=/^(?!\d)[\w$]+$/;class ma{constructor(e,t,i,s,n){this.outputOptions=e,this.unsetOptions=t,this.inputOptions=i,this.pluginDriver=s,this.graph=n,this.facadeChunkByModule=new Map,this.includedNamespaces=new Set}async generate(e){En("GENERATE",1);const t=Object.create(null),i=(e=>{const t=new Set;return new Proxy(e,{deleteProperty:(e,i)=>("string"==typeof i&&t.delete(i.toLowerCase()),Reflect.deleteProperty(e,i)),get:(e,i)=>i===Jr?t:Reflect.get(e,i),set:(e,i,s)=>("string"==typeof i&&t.add(i.toLowerCase()),Reflect.set(e,i,s))})})(t);this.pluginDriver.setOutputBundle(i,this.outputOptions,this.facadeChunkByModule);try{await this.pluginDriver.hookParallel("renderStart",[t