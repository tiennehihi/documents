espaceObject.emitWarning(`Use of deprecated ${double?"double slash":"leading or trailing slash matching"} resolving "${target}" for module request "${request}" ${request===match?"":`matched to "${match}" `}in the "${internal?"imports":"exports"}" field module resolution of the package at ${pjsonPath}${base?` imported from ${(0,external_node_url_namespaceObject.fileURLToPath)(base)}`:""}.`,"DeprecationWarning","DEP0166")}function emitLegacyIndexDeprecation(url,packageJsonUrl,base,main){const format=function(url,context){return dist_hasOwnProperty.call(protocolHandlers,url.protocol)&&protocolHandlers[url.protocol](url,context,!0)||null}(url,{parentURL:base.href});if("module"!==format)return;const path=(0,external_node_url_namespaceObject.fileURLToPath)(url.href),pkgPath=(0,external_node_url_namespaceObject.fileURLToPath)(new external_node_url_namespaceObject.URL(".",packageJsonUrl)),basePath=(0,external_node_url_namespaceObject.fileURLToPath)(base);main?external_node_process_namespaceObject.emitWarning(`Package ${pkgPath} has a "main" field set to ${JSON.stringify(main)}, excluding the full filename and extension to the resolved file at "${path.slice(pkgPath.length)}", imported from ${basePath}.\n Automatic extension resolution of the "main" field isdeprecated for ES modules.`,"DeprecationWarning","DEP0151"):external_node_process_namespaceObject.emitWarning(`No "main" or "exports" field defined in the package.json for ${pkgPath} resolving the main entry point "${path.slice(pkgPath.length)}", imported from ${basePath}.\nDefault "index" lookups for the main are deprecated for ES modules.`,"DeprecationWarning","DEP0151")}function tryStatSync(path){try{return(0,external_node_fs_namespaceObject.statSync)(path)}catch{return new external_node_fs_namespaceObject.Stats}}function fileExists(url){const stats=(0,external_node_fs_namespaceObject.statSync)(url,{throwIfNoEntry:!1}),isFile=stats?stats.isFile():void 0;return null!=isFile&&isFile}function legacyMainResolve(packageJsonUrl,packageConfig,base){let guess;if(void 0!==packageConfig.main){if(guess=new external_node_url_namespaceObject.URL(packageConfig.main,packageJsonUrl),fi