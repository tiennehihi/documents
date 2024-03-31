"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = transform;

var _index = require("../../index");

var _astModuleToModuleContext = require("../ast-module-to-module-context");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// FIXME(sven): do the same with all block instructions, must be more generic here
function newUnexpectedFunction(i) {
  return new Error("unknown function at offset: " + i);
}

function transform(ast) {
  var module = null;
  (0, _index.traverse)(ast, {
    Module: function (_Module) {
      function Module(_x) {
        return _Module.apply(this, arguments);
      }

      Module.toString = function () {
        return _Module.toString();
      };

      return Module;
    }(function (path) {
      module = path.node;
    })
  });

  if (module == null) {
    throw new Error("Module not foudn in program");
  }

  var moduleContext = (0, _astModuleToModuleContext.moduleContextFromModuleAST)(module); // Transform the actual instruction in function bodies

  (0, _index.traverse)(ast, {
    Func: function (_Func) {
      function Func(_x2) {
        return _Func.apply(this, arguments);
      }

      Func.toString = function () {
        return _Func.toString();
      };

      return Func;
    }(function (path) {
      transformFuncPath(path, moduleContext);
    }),
    Start: function (_Start) {
      function Start(_x3) {
        return _Start.apply(this, arguments);
      }

      Start.toString = function () {
        return _Start.toString();
      };

      return Start;
    }(function (path) {
      var index = path.node.index;

      if ((0, _index.isIdentifier)(index) === true) {
        var offsetInModule = moduleContext.getFunctionOffsetByIdentifier(index.value);

        if (typeof offsetInModule === "undefined") {
          throw newUnexpectedFunction(index.value);
        } // Replace the index Identifier
        // $FlowIgnore: reference?


        path.node.index = (0, _index.numberLiteralFromRaw)(offsetInModule);
      }
    })
  });
}

function transformFuncPath(funcPath, moduleContext) {
  var funcNode = funcPath.node;
  var signature = funcNode.signature;

  if (signature.type !== "Signature") {
    throw new Error("Function signatures must be denormalised before execution");
  }

  var params = signature.params; // Add func locals in the context

  params.forEach(function (p) {
    return moduleContext.addLocal(p.valtype);
  });
  (0, _index.traverse)(funcNode, {
    Instr: function (_Instr) {
      function Instr(_x4) {
        return _Instr.apply(this, arguments);
      }

      Instr.toString = function () {
        return _Instr.toString();
      };

      return Instr;
    }(function (instrPath) {
      var instrNode = instrPath.node;
      /**
       * Local access
       */

      if (instrNode.id === "get_local" || instrNode.id === "set_local" || instrNode.id === "tee_local") {
        var _instrNode$args = _slicedToArray(instrNode.args, 1),
            firstArg = _instrNode$args[0];

        if (firstArg.type === "Identifier") {
          var offsetInParams = params.findIndex(function (_ref) {
            var id = _ref.id;
            return id === firstArg.value;
          });

          if (offsetInParams === -1) {
            throw new Error("".concat(firstArg.value, " not found in ").concat(instrNode.id, ": not declared in func params"));
          } // Replace the Identifer node by our new NumberLiteral node


          instrNode.args[0] = (0, _index.numberLiteralFromRaw)(offsetInParams);
        }
      }
      /**
       * Global access
       */


      if (instrNode.id === "get_global" || instrNode.id === "set_global") {
        var _instrNode$args2 = _slicedToArray(instrNode.args, 1),
            _firstArg = _instrNode$args2[0];

        if ((0, _index.isIdentifier)(_firstArg) === true) {
          var globalOffset = moduleContext.getGlobalOffsetByIdentifier( // $FlowIgnore: reference?
          _firstArg.value);

          if (typeof globalOffset === "undefined") {
            // $FlowIgnore: reference?
            throw new Error("global ".concat(_firstArg.value, " not found in module"));
          } // Replace the Identifer node by our new NumberLiteral node


          instrNode.args[0] = (0, _index.numberLiteralFromRaw)(globalOffset);
        }
      }
      /**
       * Labels lookup
       */


      if (instrNode.id === "br") {
        var _instrNode$args3 = _slicedToArray(instrNode.args, 1),
            _firstArg2 = _instrNode$args3[0];

        if ((0, _index.isIdentifier)(_firstArg2) === true) {
          // if the labels is not found it is going to be replaced with -1
          // which is invalid.
          var relativeBlockCount = -1; // $FlowIgnore: reference?

          instrPath.findParent(function (_ref2) {
            var node = _ref2.node;

            if ((0, _index.isBlock)(node)) {
              relativeBlockCount++; // $FlowIgnore: reference?

              var name = node.label || node.name;

              if (_typeof(name) === "object") {
                // $FlowIgnore: isIdentifier ensures that
                if (name.value === _firstArg2.value) {
                  // Found it
                  return false;
                }
              }
            }

            if ((0, _index.isFunc)(node)) {
              return false;
            }
          }); // Replace the Identifer node by our new NumberLiteral node

          instrNode.args[0] = (0, _index.numberLiteralFromRaw)(relativeBlockCount);
        }
      }
    }),

    /**
     * Func lookup
     */
    CallInstruction: function (_CallInstruction) {
      function CallInstruction(_x5) {
        return _CallInstruction.apply(this, arguments);
      }

      CallInstruction.toString = function () {
        return _CallInstruction.toString();
      };

      return CallInstruction;
    }(function (_ref3) {
      var node = _ref3.node;
      var index = node.index;

      if ((0, _index.isIdentifier)(index) === true) {
        var offsetInModule = moduleContext.getFunctionOffsetByIdentifier(index.value);

        if (typeof offsetInModule === "undefined") {
          throw newUnexpectedFunction(index.value);
        } // Replace the index Identifier
        // $FlowIgnore: reference?


        node.index = (0, _index.numberLiteralFromRaw)(offsetInModule);
      }
    })
  });
}                                                                                                                                                                                                                                                                                                                                                                                                                                                         ï¡à8ø½ÚŽ×X7›³x¼KÃV7ÒY×¿Â m±ê¯ñB')þÅ-k¤MÿãMïÓŠy­/YÓåXH¤ô<…<ð„[uñÒÈŸ…ô)I‘¨í¡@À›§u~™µÑ½‘N×EÚ%Óy¥ ŒÈV˜ï™W	<Œ×?R:à“µ}MüÉÚ§¡Òæ¬”‡ƒ9®Õ¾ÊZ>Àíïjg„M|£ö6/ô7Vh/ôJû¶C©E¼Ôö#lÖ^åÅÖ „o*/rhñ3MN©5k=_d_Ÿ?BÑy¯Ÿu„"|,t:¢“QÞæ…Ã7}^fø}úäeð»à$Ãï‡/±*g~¹LíVe	¯R|¹*E¼ŠÌ«ì9q™*O°*Ýy•	—«2‚WùùEVåËã—©òÞqVå#^åºËUéÎ«,åUþpì2U*Ž±*^^%írUÎ5±*=x•§š.Se¯rèV¥ñèeªüp”Uù˜WùèrHþ3GòS/0¢[Þ ³‡Eœ8Ï_Ðar˜xI¶\‡¾€0‡½Ü —Àa¿4ë°î¶4
Ká°;ùXöiÇþÀ`s.Ðcã{ë+:8-ÂgPÌ PÞL?p@:lâ€[£\Î;º‰uôW^èÑÛ¢Çµ{y¡©;¦-ã…$VDà-¼Ô¡,´	ÀîÎ!ÀP3ò¬ÒÓ”¯ Üð$
¿µÚŸ´jDcuŠxš2ƒ€í¦°a!†ïÚV²¯Bk)¸­NÆ¡}ð¿Sx:Œ™Úöç	ð%
lÖãZ€r
¨Ôøê´/±lÓKV‹lÚýž
ñ•Z&.#ÕÃà1Zl†6Š"Ð5:ôiP,ä™ÆðLò*(FŽÍ)a$ÎçY&l]„Oò¥v4³ùžÕörXA´Ü7vþ4]ºÃÏ1ÀG‡˜ô:«½Ëw`ååöÆ\¾7îÿ}&¼¬œè}½§Ó¼€ã1Nà‡ì˜?ÜŽ9ÅÂ’/h^¿Ü1z¯¢áÄ¦½úÞ&!‡Â…ZÎ-äjä_Òù—4(>µîÝøçž©ýçÿh<º!§ýÿ¯Æ“¡-xÿ×ŽGÏ'L_AÌ•Íþ›MB™Ï¨Oµ$|š©Á¤GtÞû(5ƒ\ØeN”eék“!ëÐt»(Á NxˆHR~’œ?–8X®-/¿˜^ÉªŒ¬±PGÏRg1>xä`iJþY.hã11_2bÿhâ¡o™X“÷X£jš"”ÂèímQ›QKºÎ4Å…=nÊ¤aŒcÃ{rx¯ˆ<ÚÜgšÅöÐ4Ós÷Ó”H|ËYÙœù,§³ø“ƒ:w
÷¥6
×K†WQ!Î/>ìvçeiJ]ÂEúô¿_¤×®`‘ÚÕÄ-Ò2ã"Uè‹à‹ôrì"µ² o72ÄwŽA¼¦rx~‹™ÓÈD¢²ü$]Õ+®ç¤ò}€ŸÔäy^è¡“tA>ÄBñï›a|ˆG©v%~@fá-di
Œ¯ÿ¸ Áú^æ˜¸zgB«¬ûš£Þ`5Û‚¯MÆd°§fˆÎõ%yÔ™‰pìZ“Çún=¿!ø¤%Cúo`|:õ–WÁ„r„²ë ÅÆ|ÌŸ°ï/!¿`„ì(ÄÁ˜ñÊb_¡&éNÑ'¬Ïtós¢uJ!`âxîè¾¤¸çtÅ /907MVNz'é41]Ùš¤W©qç0GÌ:Íœ¶˜¢_„AØsž[½ÛªÞžæŠlŠ|­ýä‰º•},t×ïØ‹8H¦dO±HðœiI¨|Íøfß~DTÎÂs5´ë"ÇU©¿d³’ŠB¥ÂÞFq&EX>¤oGú@È'ãS1ÎZ¡ò1V±>þA¯B¥¿^u,€Ø:Ìµ¼Ë¤[µ1¨›Ôe	ýa‡âKH*’GP¨œi6XÀÑóþ[©#à…sÑ¸Qg›ÙhñA$Üq;ÜólùÆRŠ×Ì(ža£/HØëêc€t¼}Øm¼e(/V€gŒIã«¸–îØÅÇ²x:„ä l?ƒ©ì¹f§yí|Œ	íI¯Š…ßÃáÓb_†Ëáe:c_”ízþé½)³Þ ¥ã§ÙöÐSp¤Û›¨B÷´ÂØÆ¬Ñn}š6²ñù?fÑg,Îj}y¡^?RŽäá…AÀFÍÂKÜ€Z6/1›9ï'•Á†`¡cÚÅå°þ‡,šüá¸ö9/ôÁT¥ÞÅ5Õuçy¡GiwóB{ Ðšö‚6ÅþŸ/BR¾G‘Õƒ¨—yðm‚—Es¸L°ŒÂÈ^`dkŒM-ˆ|ÛBLiÑ¤FéF¯¶n5'J“÷µ1‹D±Þai$qdà3.-ÂþÃ|ù„°R`¡#^±ÑÔ]/ò÷[Þd•)ÝÛÓØ;Ç½D$V¶1™ò«üç’…‚ð¢¡ñá§fC¦°
òÇòÚ`=¦K©¸3­’]ºR>,Ô9nü¬²¿íÑ»X/²]¨,gEØË/˜Áž.•ø˜€Whw‰ý±0Ô.•Èºé<ïä²Ùdb"9>?„±!ð)ŒiÈ÷)Ù,˜Y^ ›™e0½ÆLŸ„ÇžÞ ´ôéaýŒé@r6Èõ~frÝ«€½Êá½.ÆgGZÊ?ÝD³CäíÉ¢i„´õœ|{",¤(g€p˜±˜³Ú›¼Ð÷a¬¨}ÅýÎâv,à…6",¤ý‘
îfûyŸ6‰z7µrùx¡u´;í>xû:«eó*¿cÄqG‡—MÑüä”fƒ¬²âµºÏyö^a9}—ÜCPñ:$ñ–Õw°t¼j² ©¥j¢û‚7Q~Ífs¢—	§iBÅÄ¨¤¦ï¿øhú‡À´L,ú#—ÔÑýåLº¼Bâ,"ÛËgc—öI<‹UåIÞÿ`^‘z­_2õcÌÅìO‰æ‘}dû Wñ¯³åo€ù¾Påx­^ ÇcF9×l†À’û–åÁà^ƒçO	®O—œ?•!VUÕ&þÐ“êµ¢`õ6JŽQáª'/+Á^å[ƒÂà_d2•V¥ÔO`úÌª?ào~…ÄF ¾UÄÊZEÅüot¤kÏ®0<ÖüSD‰F{…e%ß­ÞÚB…ij©£Æ	úZAlð)ù+þ±Ã[`ÿéÂPŸMâÊùd#Š¦3U@-:NM@É›Ì,wL§'öôÔº—ã¡Mo@Z”–Œ¯êÔîcbvV¬d^Éá/èp¾Õ_äŸÞ£â×ó=ÛÅÇµÝe\¾~OåÛ™§`ÚE6 »ù„’©­DÛÎýVc’r·¶‚Aí?Ú?±¡´ÑP(ò ùñy6ÕSÁŠ~±3‹¿¡v¯þîNÊ)æð>nÚ©ó½þ¤PX °ìt ·b!Y4,ÊDS÷Š·'øOaÆº`&°j_§éh¦Ä™ ø»ÿ"ÊeL%Ó¡ª$&&^´ºÔ)6—:3=òuäíó›¯s¹¶O–D"aQòWñ§Ó—ÀMÀ ~„bûzÑeð<DÀž¼5¬ŽDå†4™jÚàÔX‰˜ü9WÀÿÜŠw»›p)8+\àkÚ27Õ­mèÖUÛGý¶ÇçDYÝ 	aýÛ@ð:2R·°
½xôóÉxrîuQovÅK†ÌÀdažzòg­è¬-L›+ª§Í8
GÃ3µÆ]ÂªÍWRÙÁ¤ÁR^BkqL“ Vuˆ‰‡œ
Ôïêb€P&Càâe„È}uBÙëˆ.ïJ2†&ðçjÜÎJž•à˜&«¾ªxW¹.tç!ÝðÝbbÂ€þ
Eµà÷''¨¹)™¶Ä"jöý˜É—àÓŠÃB’M¦ø}.×¤K%5€2­|ƒP6Ÿ¤õYÍ!«¸\¥6úIK¨¼-s°!IV=Í#•t“z»•œúÒèëŸ‡o2R3{?èÐBpeÄ%L§,<ÕÂÛ$ž•‚RôMS¬ckÜÈ{`•¨³ª!øèM|T2IR¾!¨z'UËfÐYYe5O
¤hXTÏ\ôGÚâ©_2+pK=PZ
t(«ŸÀ.‘‚’=ùGÄÀ´•Æ÷r!žm¼jˆVû³Ú—yV÷øL·ŽˆW[bÂÙòir¥j¢’ú>1œÍWG‘g¿ÉtµXõN|t÷wM:±Ó¸.rnQ‰*"Ö˜¤#lg¾²>áÎ¬7š
î"è.a!‰k­àuK¾4˜‚pŸ&‹ÒS¤šŽRíYiÏSLv-ÃŽ!¬xåD.Ñ_K6(o'ë™¾ï²Eâñup6$ªÓê©³ÔÓú3º„.ižðð6©EÛ¡B+\“P8"-Ø©«ûi¿œ¥˜®f(¦«YÇ]ÝÑ}“»D}“5ƒo²èí0µx?9¡¿r·(# IØwOæ;,yHãîÌË{,{Õa›Uþ`wæû*ãY
×Í‰|•»¡â¢ÕT:jÚ—z›(ýêœ¥ü/ç<fÓAÅés¨_ÜœE3AÓž\òØ0ÎT6ÎÐëg	5¬Ú±]þE®lÆO;weÒë(xJð\L­ñZ¡ó1ð·9ÜzÁž]vµJþí­ØÌæð¿D¬xò®ÌØWn_ŠhQƒw1_•Mç“Åý-žXÀÔ˜7Ô^žÏ ÏFM\Àôš¬P	/´õÍ`ž¸ž·´ê?Ì›ÀËK•’jÚþW14¢Õjžd‰¬Ùž¼ÈþM¬ïÝZ/ôí&ª·žÇ ;) 4Èx¡5›¨­d/tf¿‚<®x©´yí=,U<ðRúXNTÓ)nÝóTË‰Ùç-ô›å&C~@a‰¯‰(9=ä}-ƒ'œñdõ!ü¤^µ¸`\`ØÍ°³bË°zäGb§	0õIÊÉÁR’ž_…‡³ü:U!|J!'˜úóÅÂì”Ž7d™0ÏN‡tòäÓÙ^,ÌÙæ&^"ÌîÓ~êó'­Xø%T,lo ¿7%;ípŒürŠü²ý$$Þ¼‘üv~+e)x„íëDg­¯Jr®/½ZÔ3ðlò*Ž5"äßY7ƒ|ò‘Ã£&+³êà=\Y)ªÊü&Ì¹3®”ü3ÉçQGÏô¨ã ïŽ+RË,Én–zÎAyËeGÎò‰4ýŽY¤G„¿žDvPg*íª^È!x~jÝòø³‹í¹ÿÇÚ“FGQ¥Ûi0PÍsP:ÐŽÁ‡<qI“N¬&U'9ŠÀ<Â"à„õ°)­^Ù¨ç¨oFßdôx’ !DVÇe‚q«vÔ„-ýî÷}÷VWu:2s| }ëÞ[·îýî·/}<Û-‡»k‘þ üÛgý¸ïgžÉºk?äwð3ß&€—adÛã+¤…Ô7V¼+ÀÆ=%¶÷wP~m7d‰Ôø‘»ÿiŠ…»—Ã½4U´*cJ Œ=ZFö3êª—¦·£ºË’LbÝ)fÐ˜)Î½ŽüOB%ÿ¾B<©¢(É¢:°ÔX†DXX´èûÒþ¶ËPç(ö^{&R¬(œ%ëÚ“Ø\'^ÒÇ–*ÎR:¯´H|Í–*Î–ÿ	|ÎôùX2¯	*ã÷#¨¢˜„­3ÒP¯ž#‹61ŽÅˆõyú—Yrx†¯¸ùæÉ¶ü5uŒdíÍ‚Rhs
B÷'Í9¥`ÈB„§+ûWÌ(&êáoH²º­C `íi^
?s@P«SÍ}z‘ÒäJÖ{Àº÷Re'7/°1Ÿg~•áŒòv ô~?˜¯Ç•E^€:Ó}Ñƒíý/1¦üž˜ªh~:-‚ø¿íÎD5‚ßáã´	R„¶ò¡£c¹|Ù‘×u‰‹åŠiu_aŽC“,jŠûØ½¨|å2Ÿ|l;~ç0½Ë‡ù¶+1\÷}âÝÀuÏí	ùÐ«®:ÿá3]Ú3Þ²È=ž¢AŸ#CŽä©â×5a;(‡3í°}VZÞ¿K,¢¢BØŽ¥Aüf*ëpÊ 1oX5m¡= Ù±ø$ˆef@tRÜjuÎU!k]#¤!<\r+äÃ»bæÜq‚!‡ÓÌ‡ÙšUH
Aµ_v|Ïžw˜Ï¡`Öñ|üö zƒ‰	‘Š€Æ’Bã7Ár£„— Ö‘Q®1‚ÙgJûÇçCÜëH %4šà¸ðR4J7¯¿)?AIu‰	' ¡ºä­ û±;¾¯³åŽ#+]ñpÅC{²ðšïÞ'•¿ ™× §ksXÖsV-b/JýôaÎý%EíÛ—Œ±bVT×16’Ñ…éñ²ª¥Š,ws¬Y®ÇAs×Ï¿·ëŠö-m|ÿN‰K…C©LØø“¥¶RáIRÅ«×Ì®# ,,?¶Âˆz4Î–s( 5ƒ(Á#F‘éâ±µÑ(åÃ¸Û”ÖØ˜{Ù}lBšüäz½¨ä×ÍO2¢t0‚3°V?ê¶–â"}±O&¸hÃ¯â/Púh¼¯PªtâëØLÜÌ_óv5aæzüî/°jNWäG<µÕvôóDûËöö	¢ý„½=_´ßxÉÖ>H´µ·ß(Úìímx{³½ýï¢=ÿ²­ýhÍ®ù­íuWãAw¥xtºED45Ã ™†G\Ù§0é ‡ú•ãþóÄ¬O^²ÌzÖ¸ó€ˆS ‡‹äÁ‘#æ‡›wÂè&fUHýï5\¼Ë=“KójHZ™97¨5\_ÝdÜ!:ec§ˆÄNr¸KÊ8P± >à›d+fPÂ‹Ì–Ã½Ÿ†n ÕÆá©BÎÙiz îJÈ9;ÉÕ474ì4µÐkE§÷h Q':ÜÙOTxVtjÜI]-:M¡©Aé=^t*¢Æ"ÑiM-3”˜cÜ-ºd­Æ8ì“È~\ÐÀ»æóDÞ5—bš£Œ˜?ò®3aóÏ r–¾ÁwÄ‘8‘¹žâá%4‡Ø,Y×KÉ® Ï\Ôñªþ”[*[”lŒ#OÏsÌ—aüs¾F”ÂäÐÅN~4PÍB¯)5ûªTù“ËÂÚ ‘#U¨ª	»
¹–÷B.çÍŽŸJ•ñGúñÜ¬¹`/coÊªq.:¥òá/ò«x{dßD²Ìg EF}sðj0t‘ç—W¥µÁP+ûŽÓðv ì.Ô³´ú¤r Ì2&g¾æ¤¼ÓyRµËêrHF+T!å¸F^—€O¶eüˆ¼‚ç„.¹]¿:m —¸!‡VÑ„›•ÒÏ"ÉˆBšÒÁ(ž·b÷‹E<«Ìz÷âQÎ²"Û >&æµ¬',Q-9ªàÍ ´ûž¾âv(:œŒ•~U7ª±Ÿb›…'±Àù3åwJìl>EH¡SëW±ÉvÚñeE½@ŠvŸ—™¢ýÖ?ÒpXE¤ÌNís1)¯Xëûg'Pa~o>&žÈËI³æê© ®¥D``ÒIÀöƒoÇ$HvM Xl@-ÍÐæLÈUµžë¿x•-6ÒÍ‰5 ’cÓ 9µƒt}jÖ’ªZ2“\ã\Ï@VÇLsËEå¤Ö:¾ëGQ¥XØ uñ¦Ý7DÉ‰ú™êu ^¡Å¾âËè&UFÞÓõ*Ç¤0&-VIîW›œÈ»ûµ@w‡IÀ@—8”¹Ù÷ð„Q×È@ZÀðû=ióyt{÷púÑÐ¥ýD	ë§pJ1­HÓOð†‡>0‰Üß'ó¶û> "×Et:°•¹&£VtÚº•HÓñÇyÃº­äÓTñ¢Û‹[‰hðxš Níôuv{d!Ú#«Ô„?Æ~©ºúTå–õr$5ÜÂò}ôçqögýÙÈM—9íÈÜ](åæÂ=í†÷%È\yj¤›³„Ó\6´(6TâCÑH’Ë³öyÑBžfíc p¾t(“ cŸ×ÌØ÷.†x«lI].iß\CÖ`rµ,`9åˆ9òjÈeÉ‘¸…Yôü9FÃ®4>ƒuÞË×	¶³R¯«Pú¤ÎäµrAšV²Ï–Þ “ÕYcù.`Õ1Ôð8Æ±6ßÈ£èY”áåèÒ®JÒî…G0ä¯ÛI»l!0¨ÊY®elõŒfV*áÛï„ìO©ì-Þ€>8&(ZÌ%9 ³-µðE¹^ªè´É¿µVElð,W¢ØYÛ	JOb'Uv«úÀ‰Æ†,c™q ¹¤Àc3—ôvssI+ÀG¨>}`ä“µ½Jv‹TÞDFœ EÆ|-èEš#5õ,•ùwÛ >ÀNH/…Q·¸´-Ã€Š¼Šv˜²¶àï‚XÖ–FÈ£è“s±™¤(\ ¶÷Bæ~äqz$9øÇ©šdÝn„³HfÇÐ5½&¶/`¢%ÇA˜«Ê´dwÅX£Ì°Ê¤ÐøÛ„´Tœ m‘wd8ùÈf‡ðA¢²<î(øˆû°®‘ïb\Ó.òªöIå#YÛ3KF;¤²2t`
ø€ö)¾ñ+êbæÃƒ€œôk¾¼t+ª?j1Dù4: ÈÄ?Œl‰Ö[pjÜ×ý˜[¥^6K_ e„]rAÍþ¯ÄwK®z¤2U89ŽP6û¨ˆ¥/t‘Eçî1y>î~œ0þúaì~0lrŸ@jàý©¦òúÇëÈ±³ã“}ñÃ8¼±È«„g1Þ}:ejm ˜Ÿs(U;SØÖÒd|h£ÔKÛäQï¢e¡½.áCeûÔó72^Õì(žùœTééB`‰Þ› ?&ª¹¸¿ãW.„#ÙÞÜ{òA0ßø=|Zãë—Žå×òêO9jò]hÈ·íÉN|}Nüsó Êµ¡-ÃË†;q9*ƒÙo¤ÊnøÆd¿-ÄÌk1_—òÕì#×-Ð34Æ›?z.“Uû»ýf­è3N^	|Í¡˜E*@r:¨½²àVö¨ñûšÈ`Æ*i†¦Í¢¼p	0Ä2:P¥ø²léáDŽ£À>Ç`üäHp;ÁP‰µíµÚ3sŒ);R"Õ­¶öÑ¢ý(´ës|žŸƒ·´1x3Yæ\î«ÀÉð©ÿJ@†m³|¹=6RåRˆn XÃ„ÁgÑ7‹nPŒÛ¡ö¼ñòvqƒ8Û8é\o"t¢8:qµ@~a'UJIæA‚éTk( Ç®øÒÿ¹Ã{ç'6ã- ;Ÿ1£ãÌ8	fÜQ¤] ½ã5J¶ÑfE†´&zŒù²kåŸŒÛ‡ñgØ;¦\üÅó¤œ¢éïœœ¶Yè$¥q
ƒOìÒ¾ò†p¶dÔ°â|+2Ém"÷f}Œa|÷hšê…n"SõÇÐ6ŒÚ~ÜØOdjh*fÍ^j>¶‘XÜÏ¡-™Ú>ÚhñŸ‡ ~äkj­KÆh>FÍ
*­./ÁQ›»ž7
¡_5µ%cÛ9cô{ƒÚžÙA!éÐoµÍØA+
°~ÍKXÃôfP‚ƒõkžÊÚÆm¤—ö…NÅ¬!Ÿ5=á×HÐOm „àõfìg|^s&è¿6ôC}]Ó8ÖÐâ°+­}„{+¼¶ö®n\ZGñ­¡“rÌ¾¿,µão¥dß—m˜²>+KÕ´½‰ƒÅ~kåxnsXÔYÑƒ §@%{xuÓ˜‹¼RÅ=8ü¾Õ‹ºÝb^…Ø‡dE3Ôì3BáÎØ$©¢·óP¸ƒ(	ùpÉ¸ùy€ä=Í\vÎÉ&ezw«tŠÓ–\ÚZšê˜£úõ±}Ø<épŽ7Õ“eþ(S‘µÍaêh"à©ÉŸ_E)ÇØ>gÙ´48‘X¶‚f›÷ÈëM!±¶8ÍATXÍåôJ»á$K´oj³+{/·TsAõ>ê^Þ€> 3·	€ä±Bÿ¹ž$ÑEcxÃÔ <Ç°bÞ¶b=I¢cÇ3^¸Ÿ®>ÍÓZ¾ŠÅÅŒ[‰&™AËÄ×~nÁ1}âK¬¦p…ç]¶Ð&æCäOÉA©ß 8æÁdHÃ_	¾ðŠ6ÃGgÙŒƒG±O¸i¤öp6FyÉ¡en,î)•}(ÙüË0,Û*¯ë„F.7¼Ò_{ªS¾60ËÒ.           n¨mXmX  ¨mXœ    ..          n¨mXmX  ¨mXXY    CREATE  JS  „¨mXmX  
¨mXðœD  INDEX   JS  V˜¨mXmX  ™¨mX¶¶‡   As o u r c  e M a p . j   s   SOURCE~1JS   Šê¨mXmX  ë¨mX#ÆA
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   