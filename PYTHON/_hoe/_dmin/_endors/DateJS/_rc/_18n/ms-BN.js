.tokenStart+1);}},Ls={getNode:Ts},Es=Ce.TYPE,Ds=Es.Delim,Os=Es.Ident,Bs=Es.Dimension,Is=Es.Percentage,Ns=Es.Number,Rs=Es.Hash,Ms=Es.Colon,js=Es.LeftSquareBracket;var _s={getNode:function(e){switch(this.scanner.tokenType){case js:return this.AttributeSelector();case Rs:return this.IdSelector();case Ms:return this.scanner.lookupType(1)===Ms?this.PseudoElementSelector():this.PseudoClassSelector();case Os:return this.TypeSelector();case Ns:case Is:return this.Percentage();case Bs:46===this.scanner.source.charCodeAt(this.scanner.tokenStart)&&this.error("Identifier is expected",this.scanner.tokenStart+1);break;case Ds:switch(this.scanner.source.charCodeAt(this.scanner.tokenStart)){case 43:case 62:case 126:return e.space=null,e.ignoreWSAfter=!0,this.Combinator();case 47:return this.Combinator();case 46:return this.ClassSelector();case 42:case 124:return this.TypeSelector();case 35:return this.IdSelector()}}}},Fs=Ce.TYPE,Ws=ni.mode,qs=Fs.Comma,Ys=Fs.WhiteSpace,Us={AtrulePrelude:Ls,Selector:_s,Value:{getNode:Ts,expression:function(){return this.createSingleNodeList(this.Raw(this.scanner.tokenIndex,null,!1))},var:function(){var e=this.createList();if(this.scanner.skipSC(),e.push(this.Identifier()),this.scanner.skipSC(),this.scanner.tokenType===qs){e.push(this.Operator());const t=this.scanner.tokenIndex,n=this.parseCustomProperty?this.Value(null):this.Raw(this.scanner.tokenIndex,Ws.exclamationMarkOrSemicolon,!1);if("Value"===n.type&&n.children.isEmpty())for(let e=t-this.scanner.tokenIndex;e<=0;e++)if(this.scanner.lookupType(e)===Ys){n.children.appendData({type:"WhiteSpace",loc:null,value:" "});break}e.push(n);}return e}}},Hs=Ce.TYPE,Vs=Hs.String,Ks=Hs.Ident,Gs=Hs.Url,Qs=Hs.Function,Xs=Hs.LeftParenthesis,Zs={parse:{prelude:function(){var e=this.createList();switch(this.scanner.skipSC(),this.scanner.tokenType){case Vs:e.push(this.String());break;case Gs:case Qs:e.push(this.Url());break;default:this.error("String or url() is expected");}return this.lookupNonWSType(0)!==Ks&&this.lookupNonWSType(0)!==Xs||(e.push(this.WhiteSpace()),e.push(this.MediaQueryList())),e},block:null}},$s=Ce.TYPE,Js=$s.WhiteSpace,el=$s.Comment,tl=$s.Ident,nl=$s.Function,rl=$s.Colon,il=$s.LeftParenthesis;function al(){return this.createSingleNodeList(this.Raw(this.scanner.tokenIndex,null,!1))}function ol(){return this.scanner.skipSC(),this.scanner.tokenType===tl&&this.lookupNonWSType(1)===rl?this.createSingleNodeList(this.Declaration()):sl.call(this)}function sl(){var e,t=this.createList(),n=null;this.scanner.skipSC();e:for(;!this.scanner.eof;){switch(this.scanner.tokenType){case Js:n=this.WhiteSpace();continue;case el:this.scanner.next();continue;case nl:e=this.Function(al,this.scope.AtrulePrelude);break;case tl:e=this.Identifier();break;case il:e=this.Parentheses(ol,this.scope.AtrulePrelude);break;default:break e}null!==n&&(t.push(n),n=null),t.push(e);}return t}var ll,cl={parse:function(){return this.createSingleNodeList(this.SelectorList())}},ul={parse:function(){return this.createSingleNodeList(this.Nth(!0))}},hl={parse:function(){return this.createSingleNodeList(this.Nth(!1))}},pl={parseContext:{default:"StyleSheet",stylesheet:"StyleSheet",atrule:"Atrule",atrulePrelude:function(e){return this.AtrulePrelude(e.atrule?String(e.atrule):null)},mediaQueryList:"MediaQueryList",mediaQuery:"MediaQuery",rule:"Rule",selectorList:"SelectorList",selector:"Selector",block:function(){return this.Block(!0)},declarationList:"DeclarationList",declaration:"Declaration",value:"Value"},scope:Us,atrule:{"font-face":{parse:{prelude:null,block:function(){return this.Block(!0)}}},import:Zs,media:{parse:{prelude:function(){return this.createSingleNodeList(this.MediaQueryList())},block:function(){return this.Block(!1)}}},page:{parse:{prelude:function(){return this.createSingleNodeList(this.SelectorList())},block:function(){return this.Block(!0)}}},supports:{parse:{prelude:function(){var e=sl.call(this);return null===this.getFirstListNode(e)&&this.error("Condition is expected"),e},block:function(){return this.Block(!1)}}}},pseudo:{dir:{parse:function(){return this.createSingleNodeList(this.Identifier())}},has:{parse:function(){return this.createSingleNodeList(this.SelectorList())}},lang:{parse:function(){return this.createSingleNodeList(this.Identifier())}},matches:cl,not:cl,"nth-child":ul,"nth-last-child":ul,"nth-last-of-type":hl,"nth-of-type":hl,slotted:{parse:function(){return this.createSingleNodeList(this.Selector())}}},node:hs},dl={node:hs},ml={version:"1.1.2"},gl=(ll=Object.freeze({__proto__:null,version:"1.1.2",default:ml}))&&ll.default||ll;var fl=Ir(function(){for(var e={},t=0;t<arguments.length;t++){var n=arguments[t];for(var r in n)e[r]=n[r];}return e}(ps,pl,dl)),bl=gl.version;return fl.version=bl,fl}));
	});

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	function buildMap(list, caseInsensitive) {
	    var map = Object.create(null);

	    if (!Array.isArray(list)) {
	        return null;
	    }

	    for (var i = 0; i < list.length; i++) {
	        var name = list[i];

	        if (caseInsensitive) {
	            name = name.toLowerCase();
	        }

	        map[name] = true;
	    }

	    return map;
	}

	function buildList(data) {
	    if (!data) {
	        return null;
	    }

	    var tags = buildMap(data.tags, true);
	    var ids = buildMap(data.ids);
	    var classes = buildMap(data.classes);

	    if (tags === null &&
	        ids === null &&
	        classes === null) {
	        return null;
	    }

	    return {
	        tags: tags