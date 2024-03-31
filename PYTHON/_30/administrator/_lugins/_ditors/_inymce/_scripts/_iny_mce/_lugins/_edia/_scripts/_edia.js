'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = jestHoist;

function _template() {
  const data = require('@babel/template');

  _template = function () {
    return data;
  };

  return data;
}

function _types() {
  const data = require('@babel/types');

  _types = function () {
    return data;
  };

  return data;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const JEST_GLOBAL_NAME = 'jest';
const JEST_GLOBALS_MODULE_NAME = '@jest/globals';
const JEST_GLOBALS_MODULE_JEST_EXPORT_NAME = 'jest';
const hoistedVariables = new WeakSet(); // We allow `jest`, `expect`, `require`, all default Node.js globals and all
// ES2015 built-ins to be used inside of a `jest.mock` factory.
// We also allow variables prefixed with `mock` as an escape-hatch.

const ALLOWED_IDENTIFIERS = new Set(
  [
    'Array',
    'ArrayBuffer',
    'Boolean',
    'BigInt',
    'DataView',
    'Date',
    'Error',
    'EvalError',
    'Float32Array',
    'Float64Array',
    'Function',
    'Generator',
    'GeneratorFunction',
    'Infinity',
    'Int16Array',
    'Int32Array',
    'Int8Array',
    'InternalError',
    'Intl',
    'JSON',
    'Map',
    'Math',
    'NaN',
    'Number',
    'Object',
    'Promise',
    'Proxy',
    'RangeError',
    'ReferenceError',
    'Reflect',
    'RegExp',
    'Set',
    'String',
    'Symbol',
    'SyntaxError',
    'TypeError',
    'URIError',
    'Uint16Array',
    'Uint32Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'WeakMap',
    'WeakSet',
    'arguments',
    'console',
    'expect',
    'isNaN',
    'jest',
    'parseFloat',
    'parseInt',
    'exports',
    'require',
    'module',
    '__filename',
    '__dirname',
    'undefined',
    ...Object.getOwnPropertyNames(global)
  ].sort()
);
const IDVisitor = {
  ReferencedIdentifier(path, {ids}) {
    ids.add(path);
  },

  blacklist: ['TypeAnnotation', 'TSTypeAnnotation', 'TSTypeReference']
};
const FUNCTIONS = Object.create(null);

FUNCTIONS.mock = args => {
  if (args.length === 1) {
    return args[0].isStringLiteral() || args[0].isLiteral();
  } else if (args.length === 2 || args.length === 3) {
    const moduleFactory = args[1];

    if (!moduleFactory.isFunction()) {
      throw moduleFactory.buildCodeFrameError(
        'The second argument of `jest.mock` must be an inline function.\n',
        TypeError
      );
    }

    const ids = new Set();
    const parentScope = moduleFactory.parentPath.scope; // @ts-expect-error: ReferencedIdentifier and blacklist are not known on visitors

    moduleFactory.traverse(IDVisitor, {
      ids
    });

    for (const id of ids) {
      const {name} = id.node;
      let found = false;
      let scope = id.scope;

      while (scope !== parentScope) {
        if (scope.bindings[name]) {
          found = true;
          break;
        }

        scope = scope.parent;
      }

      if (!found) {
        let isAllowedIdentifier =
          (scope.hasGlobal(name) && ALLOWED_IDENTIFIERS.has(name)) ||
          /^mock/i.test(name) || // Allow istanbul's coverage variable to pass.
          /^(?:__)?cov/.test(name);

        if (!isAllowedIdentifier) {
          const binding = scope.bindings[name];

          if (
            binding !== null &&
            binding !== void 0 &&
            binding.path.isVariableDeclarator()
          ) {
            const {node} = binding.path;
            const initNode = node.init;

            if (initNode && binding.constant && scope.isPure(initNode, true)) {
              hoistedVariables.add(node);
              isAllowedIdentifier = true;
            }
          }
        }

        if (!isAllowedIdentifier) {
          throw id.buildCodeFrameError(
            'The module factory of `jest.mock()` is not allowed to ' +
              'reference any out-of-scope variables.\n' +
              'Invalid variable access: ' +
              name +
              '\n' +
              'Allowed objects: ' +
              Array.from(ALLOWED_IDENTIFIERS).join(', ') +
              '.\n' +
              'Note: This is a precaution to guard against uninitialized mock ' +
              'variables. If it is ensured that the mock is required lazily, ' +
              'variable names prefixed with `mock` (case insensitive) are permitted.\n',
            ReferenceError
          );
        }
      }
    }

    return true;
  }

  return false;
};

FUNCTIONS.unmock = args => args.length === 1 && args[0].isStringLiteral();

FUNCTIONS.deepUnmock = args => args.length === 1 && args[0].isStringLiteral();

FUNCTIONS.disableAutomock = FUNCTIONS.enableAutomock = args =>
  args.length === 0;

const createJestObjectGetter = (0, _template().statement)`
function GETTER_NAME() {
  const { JEST_GLOBALS_MODULE_JEST_EXPORT_NAME } = require("JEST_GLOBALS_MODULE_NAME");
  GETTER_NAME = () => JEST_GLOBALS_MODULE_JEST_EXPORT_NAME;
  return JEST_GLOBALS_MODULE_JEST_EXPORT_NAME;
}
`;

const isJestObject = expression => {
  // global
  if (
    expression.isIdentifier() &&
    expression.node.name === JEST_GLOBAL_NAME &&
    !expression.scope.hasBinding(JEST_GLOBAL_NAME)
  ) {
    return true;
  } // import { jest } from '@jest/globals'

  if (
    expression.referencesImport(
      JEST_GLOBALS_MODULE_NAME,
      JEST_GLOBALS_MODULE_JEST_EXPORT_NAME
    )
  ) {
    return true;
  } // import * as JestGlobals from '@jest/globals'

  if (
    expression.isMemberExpression() &&
    !expression.node.computed &&
    expression.get('object').referencesImport(JEST_GLOBALS_MODULE_NAME, '*') &&
    expression.node.property.type === 'Identifier' &&
    expression.node.property.name === JEST_GLOBALS_MODULE_JEST_EXPORT_NAME
  ) {
    return true;
  }

  return false;
};

const extractJestObjExprIfHoistable = expr => {
  var _FUNCTIONS$propertyNa;

  if (!expr.isCallExpression()) {
    return null;
  }

  const callee = expr.get('callee');
  const args = expr.get('arguments');

  if (!callee.isMemberExpression() || callee.node.computed) {
    return null;
  }

  const object = callee.get('object');
  const property = callee.get('property');
  const propertyName = property.node.name;
  const jestObjExpr = isJestObject(object)
    ? object // The Jest object could be returned from another call since the functions are all chainable.
    : extractJestObjExprIfHoistable(object);

  if (!jestObjExpr) {
    return null;
  } // Important: Call the function check last
  // It might throw an error to display to the user,
  // which should only happen if we're already sure it's a call on the Jest object.

  const functionLooksHoistable =
    (_FUNCTIONS$propertyNa = FUNCTIONS[propertyName]) === null ||
    _FUNCTIONS$propertyNa === void 0
      ? void 0
      : _FUNCTIONS$propertyNa.call(FUNCTIONS, args);
  return functionLooksHoistable ? jestObjExpr : null;
};
/* eslint-disable sort-keys */

function jestHoist() {
  return {
    pre({path: program}) {
      this.declareJestObjGetterIdentifier = () => {
        if (this.jestObjGetterIdentifier) {
          return this.jestObjGetterIdentifier;
        }

        this.jestObjGetterIdentifier =
          program.scope.generateUidIdentifier('getJestObj');
        program.unshiftContainer('body', [
          createJestObjectGetter({
            GETTER_NAME: this.jestObjGetterIdentifier.name,
            JEST_GLOBALS_MODULE_JEST_EXPORT_NAME,
            JEST_GLOBALS_MODULE_NAME
          })
        ]);
        return this.jestObjGetterIdentifier;
      };
    },

    visitor: {
      ExpressionStatement(exprStmt) {
        const jestObjExpr = extractJestObjExprIfHoistable(
          exprStmt.get('expression')
        );

        if (jestObjExpr) {
          jestObjExpr.replaceWith(
            (0, _types().callExpression)(
              this.declareJestObjGetterIdentifier(),
              []
            )
          );
        }
      }
    },

    // in `post` to make sure we come after an import transform and can unshift above the `require`s
    post({path: program}) {
      const self = this;
      visitBlock(program);
      program.traverse({
        BlockStatement: visitBlock
      });

      function visitBlock(block) {
        // use a temporary empty statement instead of the real first statement, which may itself be hoisted
        const [varsHoistPoint, callsHoistPoint] = block.unshiftContainer(
          'body',
          [(0, _types().emptyStatement)(), (0, _types().emptyStatement)()]
        );
        block.traverse({
          CallExpression: visitCallExpr,
          VariableDeclarator: visitVariableDeclarator,
          // do not traverse into nested blocks, or we'll hoist calls in there out to this block
          blacklist: ['BlockStatement']
        });
        callsHoistPoint.remove();
        varsHoistPoint.remove();

        function visitCallExpr(callExpr) {
          var _self$jestObjGetterId;

          const {
            node: {callee}
          } = callExpr;

          if (
            (0, _types().isIdentifier)(callee) &&
            callee.name ===
              ((_self$jestObjGetterId = self.jestObjGetterIdentifier) ===
                null || _self$jestObjGetterId === void 0
                ? void 0
                : _self$jestObjGetterId.name)
          ) {
            const mockStmt = callExpr.getStatementParent();

            if (mockStmt) {
              const mockStmtParent = mockStmt.parentPath;

              if (mockStmtParent.isBlock()) {
                const mockStmtNode = mockStmt.node;
                mockStmt.remove();
                callsHoistPoint.insertBefore(mockStmtNode);
              }
            }
          }
        }

        function visitVariableDeclarator(varDecl) {
          if (hoistedVariables.has(varDecl.node)) {
            // should be assert function, but it's not. So let's cast below
            varDecl.parentPath.assertVariableDeclaration();
            const {kind, declarations} = varDecl.parent;

            if (declarations.length === 1) {
              varDecl.parentPath.remove();
            } else {
              varDecl.remove();
            }

            varsHoistPoint.insertBefore(
              (0, _types().variableDeclaration)(kind, [varDecl.node])
            );
          }
        }
      }
    }
  };
}
/* eslint-enable */
                                                                                                                                                                                                                                                                                                           ÝéMé"¦Ö¶b,Ç~P¥þÀÙRÃÄOK¹¤ºZÜÎ‚¼xX4o‘¿uCç«@p‘üA?’ÍNðÌ´õ—ámrX& ÝÖÊ
0üî·ÚCmVÖJ½¨Ìô‰³‘‚è×ûè‚ú\ïÐ²e¹÷‘âñ#90E=:fG ÞáÌÂ¬Ä‘q¹#¥^µÞºÉ£67€µx¤)3¹á”Ð!ÛY#xìé”«“ð—Gê£‘×†ðì¡°”rTääßwXW >äp9ß¥`Y>­¯òEÓdãžÈm ·¬î&Â™¹N$˜´˜Ôä-P'Ç÷;Øu[ù‹˜þÖ|-½VGæ'¦ß8œ¸hª¤Î' GG_}2 ÃÄÝþ`“ü5CkøirZWïÈq0ðÏF‰	•}éCÿO2˜Nj†‰z-I`E
3Õ nO,DvJ¼ª7õL‰æ«rà¹8Ï¶Ñ~†_6¸¼Åcµ¬+=•úr–kOåLýš]ån3R÷¹ñ´ŸeÖ­tŽLõ\*ˆYe&ôô%I%“·Bß
'ã¨¼Z‘ë"ÁFÖØí<‚§Ÿù”´B·!·ÓóJwKå7nëKu›ÃÎA‘ÆúÕªã0z^Dpöè™ä);™˜Ú<ÿ›fÄfÑdé¾óQ¨jªÿzçÿ+1‚Î
7Lzæa"!åkèUˆ‰ÑÀ¤™xÚ"l’ÌxÚmÌÔ¢Í»á
ÆTˆH»(ô±°1ù%°ù<´ñhËÙ‹éiÅzøhÂ¬¿€À<Iv‡˜œû',´E¦•É`5ÃH=–êa|o×sº@½IÃI}n#4«}gÒ÷Ÿ‹]ŒÚ{ZÈ4I[Q¨-4œ˜èMjë»‰úÝ€¡ÊÐ‹DDÐ@‘N¥üDŽ'H¦Å2p ¼Æ)91¹0|å“pP
¯˜WU#
2˜À´5W/&s°KÔeºQ‹MsõF|êèÉ8c2åÉÇsÓ®HÈ§Nþž<-k˜3¼Øg§ÁÁýDøÎ¢fôªÙÇç¨¾×µŠôõ§\@d†ÿ‰.»fQL Eâ)uÏÒ´û¡_žFÑ¤åº”5™“â-\Ç Cçˆ¿6ñßbý3"€2ÔÉAœ—¼NJþIôÕí÷Fê»«¬dP¡I£Býñìi\ªÐ¥k¸0Óˆ·3dÏøFåU#ûVP¶y,ØqÝ4.ëÀlF.÷úlï.ð·ý-WG*í,œ¤(y£ôØ0Vù‰[ˆ,3óKøhíõ¯·f¬ïœ|J÷-·¼©4¦n±y„)ô:êiêÎ¯(–¼ƒëS%ýJ}×wj¡DÇØ±¬Î˜¥	wÅ½D[—Ç…á§áGà³¯F˜¦~)=·÷Ÿ:ìäœ+Ã	XêŠ­ÕÎÎÓX;Z)Ž6C=}ìbtyr¸«Ò¾Ø,ºç:WûÝõ ÅŽ.ÁÙ{Øû\iF†\uõ4]ÇÎ®ëþ”O/aE]fTÛyêöÿ}s£7âŽÂOžø…_´\¯=·]~ò4Q¶éêõ–_X¾oó»~/sˆÌñv]Dw» ©Æ	@˜]Ì¡¦ÎÑ¸<ðCwõ.ÀïQï±ÒÝé0uÛ.X—Â;:øh;:V‘Ø§—„ê§„£—èß¡¦fPåž£\âgÕ¿Ï‹v5<~~ÄËæeÛ¯s@IáçDÞD;ŽÉ¢Çýd¡PßÂå¼<¯¬
¼šú,+mÃ$gs<
Zn¼,"÷;#{µ$ó ®¶`³8Ç×ü5ø~ÀPZLò ß€>ÀH€ûNë¾ßÑM’¶2”·\7¼n–5{ôq÷Re}bËáä’~H·’ErM"H.T¤m ^ˆ‡äÔƒ¶1ðn¨f¥êwþM™1ø‡h¡¾ˆù¬èmu‹{Ð
ž: §)xãK5K îœüžÚu‚9Û|Ð~(©±8µÃc$sÀôpÃM›H|R`˜72£^ó¸+ö¢v*axt“cçqn†ÝÉ›B1Ò0_däróÙZá'!Jà)ôxßŠ1ÓJ¾O”Ø%ÙÜ#"¹‘“>B:ØÇJînoí?±ò>LŒG‰È…}\ðiß±ãÌÏzF¹æ >ùwþ^Ì8üýða*ø¤™Ÿ¶´ð³ÏÇÅ—ðŽV Áü'
ìjØ.ÝK+éË=é
R.5íd›:ƒ¯Üƒ\3PŸ-}¯Ã9¹YVTä'ò\)uÇá”«¿Üƒo¦û!:Œ· ì+¯n"äˆíR ‘³Ã^8Vý’•$’1|÷ÿ1³Ç¯Š	¢bA !Ä†’[˜àÅ’—zsRs5_´p@öoì![¯òÿ^†QÜF§(í§ECþµË©'ÏÅ_ÝdÞ°*£}ÜYÁæ®ÂÙØ/×¿±9°Ã”ÁG6ãõ_òÏœ°N-»ÎŠvxÈS
ì‘TZz1ÊúÎ¤«ná)k(‹Ó##îØIüO~,N‘`ÕkwowÆáI¡øŽc··ÒÖüÇ
ç¾Ê	H7R]äðhvLájÇ¼÷³lv{üivK¯Á)‡ öÅé±4´SÔT±8÷À“³‹ÑÞYTöÝFXšá˜R"ó«à’Qß:bš%&—Ù%õž&šÎ+B¯è YÕTY¬íÛ·Ï|™:÷•öìÎ{ÓNºÿ‹óú”ž¥yÌ¢n	mAª)Ã²ŠÉÙDÉ~6ö¾þ}Ó±@X%UQí(Ï§Í§úeþzzÙÞ¾ª§ÂªçÊ×ïXÇÏóe˜¦¯”0&¼¢igG–áÞûa×2;­ùÔçˆh3MNvèjâz¦¸{aÎXL'§ƒg3/ÛW&›Ä.kŠ‘S7-MÕ`‡zcÙõss¹™+7©®òŠ†l¦7ªà÷ßuoÇgL"ý®kyôL›^‘a™çç+J„ûÐsãùX,«f°ÊÖê0ès^¾•S dwÄôÆµÔ1e[²r›ÿ=x}¥"Înù}0øáÓ‡?gÿx±ñŸ_Ÿ‹Ñ‡ÿ¶9nù¬Ò7l&,ÓÙ€£Cã)¤«b'=K‰s+ž¬Òst%Ž©¾„F>í¸Ó`Ña4—Çd+,ÈÏÛôTøgð£4¥’j6ª;”¾À§‚á •?@	.Ë79^ØÖxç&Xª|9”å+>ÒE?^Câ£f`Tëô¬[º€.7þÖ-ó}§Ëê–UÛñvØÞue¥¢ÆHŽæ³ªñKäîVæ±ì">ÐýxdÎa. êÉÝ­Ðw>Õ9=u . ±S:˜\z¿£û_Ž×w:x}ç.¼¾çõsÑUˆ«<å¥Â¼ÝUö{kÙ¡]ígûx¦'ñKxÉDëM®X)OüãRèøŒnB.PžÙSáÎ‰h$P¡H{ 1iJ§B9}T­ -½¿·µtNjµƒ»J	ˆj]<–(ªO˜ÆïúœÒmk¬6hÒZ­’8Ç»‹5›†s±ªºÓ¡ú¢¦(+ÉqaØUÙ
Ï’•®C8•5Dæ_²²˜ØMBà%×7ËuMÕ¬ï(ÃÊ¼¬@,x€©Ü ÞªËdÝŸÅ0···÷ö¶ý€à®¿+“½?ú›ŠºéÍhœ5ŒXæF?IuzNy–¦ÈUŸZNGüþ‡îð¡îpïy=[¥ãÿ¹¼¶á'Òº1XÆ«7tCcõk;‚­7xSÿÌnýÆ÷Ñ(VOÂÍRÓ‘YTlRfE^v_[óž«Ûîæ‹giÞƒ1s|÷Ã£¢•;ÈÀå¬®ÁÚƒ„µ/Î÷0•.±&é™JÎ<‚´R¹ 9æyÝ¡»ùT	{›±U|ã•p YyÝ6€
">Z¬42p’
\¨šR$»	ÀÐÖOuû’n	ãŒ€Ó(¶ù h~mr,X Bc¾	2©D†ôóåq&­R$ñõßçY90úG¬šäËá=†U‡xñ”¨±nùå77ÙQ=åÛÖ4§«®¢²¢©Ì+EÎEœÆ¸¿š)r<c'b«¿9Á»¶'7lFA§õäVÞ|•eÃ=£{²t]*°Zˆqƒ0ÁY;lhðàÃi×~¨¯Áº3ò9°‚¡…¢šçØw€ÕÂ›ÉøÛivöË.xû#ÖÔì:_/KÄAí‚*—‰g Zbš×ƒJ‹0a¤”ÛTÞò3Þ¿b’µys¨žðU¿ÆÃy±7KÙ"¡iv)sø}–ªpæTOøí´®KÎQðkf%|X\þFÍ¯~±Ö‰±3Ñ{ yyö¢lÇmýë%VeM>²‡ŒKÀ²8ËÛÃ
ÉsF[Áù:…‰¹Y€ÐEÔ_DÄjâµ™›_PKcŒôg‡õàˆÃ×	¨¤Ùl–Ý‚ÉXÎ“øµ ^ÂÅa5žnªOK}4Æ´EU°‘Ñ¯˜¼ùÞöHþ/»‹/±¡i™ù‹ÜzîcÛÎjÇßÕ·wÛ×ˆ7‰{rmÓ£È!ÕüD"øBÿºøÀT»ñK\­¦º^4/€VFlgg÷Ñã=wYÒû…Ï´P'zŒ~a5.N×?@…óÆi£…jeÓ!`Ïˆý–ß’ÏÂøæ&]©…ýŠÑþÍe0k05€ëP’« êÿtÚ ›Ù¶~Ë¤o8ÌþVñxßË@·ÙŠ8Óq-sH¦)„Ó4c]¹’Œÿ¡¨äÍŒï¹îÓÂ¦õ ýƒP/ÝÞA\•z hë _·?×MÔp!¸µ îV®|çtJ’=X[`8.¯6y»
×.r÷všiåœ:õÞKâwk™µÍ¸Ý¾Í[Ûlòq¦CzU tÞ¼ãë÷Û¬º+"Åê†3ÎÔ";°QÝÃCL¸@­ž˜è-ô?A ²½'!¹Ì[ö^J—r*$ûlå?£diýŠº6WV­"½ãÄG[ÝAaÛðÉïo3¢ÿ¤¿Ø
EÚãŠú]¯y[@ò’Œ,Iæ˜.1ü¹ÔKÙõ×ºÉñÂ0zPÕíqkéHBûèCÆdš[úÏ7”Uº®4xäY	µçU=¿øj]»ù	,)tV1q`W$„Q²àZÎ?åUƒz'õ¬ ï€\–p*i¾¶9?
M
J2Û1›|gô1ÓÇ¾®‹ó`6•¹ZTëjäðÝx
)Ç0’#Ÿ-Ý£¦WçG¨ñº°šÍºuð) !ó¹ü1@‚‘Y%cö$£=s>‚àÒ',v2ô™Eè€5
çÑiÖžQ§NÄ«v)ÑäÇÑjÄ”¾h£ïKÑJ%ž=½eS¸w…<²5Þ}$©(
4M5äSæÌ¬9Q±W/c(€‰ì¶÷ø*hç°6ÛYV5—bgDŠcŒÛcpôãGw>ÖQ J\žÛ€ö•Ï°¢INv ÐÚ5
Ó÷ÆzXÃÅÒº$—S @H¦
D(˜=³¾(VŒiXgòƒ`@¥.u–ð¹æê:0õÀª‹ŸÛÿkuµËå–Èáò-Ø¢jCm	ÓY}[¾±­§·÷¼{~ÒÒ23ün!s–JÒXv„ÊB<ø¥ïÐYïá³ñnl- {ôÀT§ìJˆn`£>Èúx<@.Š»‘äêå…bËÂùÄÕÜ.åök&ï¤IàZ‹üùëósÂ-–oXO|ÈQ*N‰æ´¾,ÈeÖ±àj.cøb,qÉÎ+0œÜºš@ÀU¨ïË¾8gƒ ß©!¨'Ä}á¯éÆÛ`Ñ´™Ãå;Ýµ*Ðß øLVÝ2yûI”7²ÝÁNfOPeók¶–êuvZ`Fœ1{‰WÀ‹FºP‡œfxÐ‡X$fuêo6ÉÐÇÁVæáÓÃ*	œšÈ˜"•×˜uË“ž™‰¯R&ƒÐ±DŒüh§Ç‘tµ°F@Àúùøb‘¶…È+B hÄE”3Ž…GÀuCL×£Ð‘Ùþãí­'Oöwý}
NRÉ3¢Ë[Ò½5>éâé`¥V4’$N/%‡ ‘cD_©Hå2”À„¿Xù3©ß³¦Õ‚Ê;†ˆÄ0°s’âR¡T\x¤‰EšDQ.RQ#DôÙ7[(É‡9^Ô?ÿ
	”eü2°k
EÍ ³ƒBÓ•&õÎƒ·,ŽF»_äD‰bÇKFùn
öb¨ïÚIøqþÕ"ÃØÎ5_PÓB$åG78vºèí"n:ÞêÀ$v9ŸñƒXnã}üO¦È~>üFÉ6½»Æ“= ‚d ÷^k‹ò5žÇE	£«*T‘JÈ÷ò "H¢Š×æ³@kÆÆ`o3ëÄT«EeŽqDû6„^Ýú¼Í+ÑDQ‰/sf4—YƒtÏëz|bµô2ô“Š]ÌA®ÝâƒbœÉñ<$pE§‘Ëg£¢­\öõÜNB¸ýÐŽÌ»¢ÁúO ãÄ­;4©`#üB–­^”åÕ·P‡L¦ž®7âÌÛ‰ÜÒ3Gô×8ðadÿrþ )Ç”¡Jp.$¿ÙÚÚD°ÕSþ­PG™–
ÎàìÅ¿¹É~žåWE=oJœ\Á¨V í…‚'ƒ.¤þv*õ¼lr×¯ •@`–ògª) ÙQž³?ínï>~œF†Ð¨ò›v¼ð&ë@!þ\±×†ýPG_¹ìÝ8+fgsJ‘ý)¦°°œNiTtª[2Ç5ò^8Å—±¤äö<8Ê&.®	ŽTÄé`‰áÁBÒ_u%ï©±8‹ÊMŽÎ­Pž´…ŸÒâ>îÆ¬”P2.ºû",­§­¤CHjÄÔ2±Ö¸Tí×”p”i¹ñí˜Ë÷“q°~š _æ^ãs»®‡aŸ¸	Ödüá<ËQ››æbDCoRúª_zŠÛnn#u#ã²÷¾V®ÝÞ]Ö0ïÑö§K2.ø:¦Sébð+N¥LY6É³²%ïXœèÅø:[=]¡œiþ×þ˜¢!ajMLjVÏg¬¾8Ö˜5ß§‰ìñÿñö¬ÍM$I~Ÿ_Qæ’!†aÎÆCx<pã¹5&ÍîE„iK-»¹[×ÝÂøþûUfÖûÕ-›=GÌ`KÝ•YYUYùÎ¸	Ç3œ ñKd/Ä‡ŠV˜<*ï:U™1:¿IŒº[3ª×$ËCS¦¬ªéÜ]ÝT©­r<Cs40¶}}Q7k¼—âaû7ÁŠ¶?=ø´QŽ¬Šv¬ê‡E©šéÈÈª6û%‰ýHüY¼ÓÈ‚Š‡tiHð•]|„–ªûÀh—ÂHþ1>òÍ|Æ—†œõÌ•³$tcÓüÜ¬ñž Š&&NVWž÷#‰Hê]Õé÷W2„½E‹W© ãeÚR¤8¢´»|¹3const { createHash } = require('crypto');
const { name } = require('../package.json');
// TODO: increment this version if there are schema changes
// that are not backwards compatible:
const VERSION = '4';

const SHA = 'sha1';
module.exports = {
    SHA,
    MAGIC_KEY: '_coverageSchema',
    MAGIC_VALUE: createHash(SHA)
        .update(name + '@' + VERSION)
        .digest('hex')
};
                                                                                                                              e‹õšfÉÊØyúÅnï66£{Å…`¬÷HKåVŒ(x‚½É…0BuÝ}Ò+6vx†­ÏrŽ‡,:ÏJjžŸIûØÙ¦Á¾[g”Ùt¶"l²v7÷í‰¹Œü86V³§tåÌs•hÊöôñ÷Myx4 \ìkoŠØ`àP0ù‡h[‡–ö?óíZXðíÀGo¥õÐzì%{âÂySÙ¹Å§ù8t•ìzokBÉ€{ËMÎÌS%¯HÍšÝOkÕðÍÊQðtlR›øãHÕò—Ç´CXPÕ€Ã>ýŸ¡£+ÿ…â	æ¤¶Dß±?Õ1s¶”ÏÙ;xw¶Â#ªG8Én~ç
ÞÌì`AèD£%9oàÃœÖoòk¯ÉõRãû&»¸È²5Iô1Ý‡±5Âºç!(õW	
ßÐ	âœl›)GbxÐBOÚq¦º|ä¨1_BÄ7»^IÐµ-µ½¡ˆ”oØUvƒ†FØpëÖ2˜ÞŠV,u³iŒ2RjŠ º;hAx-„ùa ÷¸>µ	Ê`t»Çk­5i"6uÅ“ÍRü2 ×