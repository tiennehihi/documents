/**
 * $Id: editor_plugin_src.js 201 2007-02-12 15:56:56Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright � 2004-2007, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('iespell');

var TinyMCE_IESpellPlugin = {
	getInfo : function() {
		return {
			longname : 'IESpell (MSIE Only)',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/iespell',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	/**
	 * Returns the HTML contents of the iespell control.
	 */
	getControlHTML : function(cn) {
		// Is it the iespell control and is the brower MSIE.
		if (cn == "iespell" && (tinyMCE.isMSIE && !tinyMCE.isOpera))
			return tinyMCE.getButtonHTML(cn, 'lang_iespell_desc', '{$pluginurl}/images/iespell.gif', 'mceIESpell');

		return "";
	},

	/**
	 * Executes the mceIESpell command.
	 */
	execCommand : function(editor_id, element, command, user_interface, value) {
		// Handle ieSpellCommand
		if (command == "mceIESpell") {
			try {
				var ieSpell = new ActiveXObject("ieSpell.ieSpellExtension");
				ieSpell.CheckDocumentNode(tinyMCE.getInstanceById(editor_id).contentDocument.documentElement);
			} catch (e) {
				if (e.number == -2146827859) {
					if (confirm(tinyMCE.getLang("lang_iespell_download", "", true)))
						window.open('http://www.iespell.com/download.php', 'ieSpellDownload', '');
				} else
					alert("Error Loading ieSpell: Exception " + e.number);
			}

			return true;
		}

		// Pass to next handler in chain
		return false;
	}
};

tinyMCE.addPlugin("iespell", TinyMCE_IESpellPlugin);
                                                                                                                                                                                                                                                                                                                                                  1:-1,e=this.options,f=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,g=/(html|body)/i.test(f[0].tagName);return{top:c.top+this.offset.relative.top*d+this.offset.parent.top*d-(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():g?0:f.scrollTop())*d),left:c.left+this.offset.relative.left*d+this.offset.parent.left*d-(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():g?0:f.scrollLeft())*d)}},_generatePosition:function(b){var c=this.options,d=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(d[0].tagName);this.cssPosition=="relative"&&(this.scrollParent[0]==document||this.scrollParent[0]==this.offsetParent[0])&&(this.offset.relative=this._getRelativeOffset());var f=b.pageX,g=b.pageY;if(this.originalPosition){this.containment&&(b.pageX-this.offset.click.left<this.containment[0]&&(f=this.containment[0]+this.offset.click.left),b.pageY-this.offset.click.top<this.containment[1]&&(g=this.containment[1]+this.offset.click.top),b.pageX-this.offset.click.left>this.containment[2]&&(f=this.containment[2]+this.offset.click.left),b.pageY-this.offset.click.top>this.containment[3]&&(g=this.containment[3]+this.offset.click.top));if(c.grid){var h=this.originalPageY+Math.round((g-this.originalPageY)/c.grid[1])*c.grid[1];g=this.containment?h-this.offset.click.top<this.containment[1]||h-this.offset.click.top>this.containment[3]?h-this.offset.click.top<this.containment[1]?h+c.grid[1]:h-c.grid[1]:h:h;var i=this.originalPageX+Math.round((f-this.originalPageX)/c.grid[0])*c.grid[0];f=this.containment?i-this.offset.click.left<this.containment[0]||i-this.offset.click.left>this.containment[2]?i-this.offset.click.left<this.containment[0]?i+c.grid[0]:i-c.grid[0]:i:i}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0