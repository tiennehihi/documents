tinyMCE.importPluginLanguagePack('iespell');var TinyMCE_IESpellPlugin={getInfo:function(){return{longname:'IESpell (MSIE Only)',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/iespell',version:tinyMCE.majorVersion+"."+tinyMCE.minorVersion}},getControlHTML:function(cn){if(cn=="iespell"&&(tinyMCE.isMSIE&&!tinyMCE.isOpera))return tinyMCE.getButtonHTML(cn,'lang_iespell_desc','{$pluginurl}/images/iespell.gif','mceIESpell');return""},execCommand:function(editor_id,element,command,user_interface,value){if(command=="mceIESpell"){try{var ieSpell=new ActiveXObject("ieSpell.ieSpellExtension");ieSpell.CheckDocumentNode(tinyMCE.getInstanceById(editor_id).contentDocument.documentElement)}catch(e){if(e.number==-2146827859){if(confirm(tinyMCE.getLang("lang_iespell_download","",true)))window.open('http://www.iespell.com/download.php','ieSpellDownload','')}else alert("Error Loading ieSpell: Exception "+e.number)}return true}return false}};tinyMCE.addPlugin("iespell",TinyMCE_IESpellPlugin);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  each(function(){if(a.data(this,d.widgetName+"-item")==f)return e=a(this),!1});a.data(b.target,d.widgetName+"-item")==f&&(e=a(b.target));if(!e)return!1;if(this.options.handle&&!c){var h=!1;a(this.options.handle,e).find("*").andSelf().each(function(){this==b.target&&(h=!0)});if(!h)return!1}return this.currentItem=e,this._removeCurrentsFromItems(),!0},_mouseStart:function(b,c,d){var e=this.options,f=this;this.cur