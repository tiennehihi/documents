/**
 * Cross-browser support for logging in a web application.
 *
 * @author David I. Lehn <dlehn@digitalbazaar.com>
 *
 * Copyright (c) 2008-2013 Digital Bazaar, Inc.
 */
var forge = require('./forge');
require('./util');

/* LOG API */
module.exports = forge.log = forge.log || {};

/**
 * Application logging system.
 *
 * Each logger level available as it's own function of the form:
 *   forge.log.level(category, args...)
 * The category is an arbitrary string, and the args are the same as
 * Firebug's console.log API. By default the call will be output as:
 *   'LEVEL [category] <args[0]>, args[1], ...'
 * This enables proper % formatting via the first argument.
 * Each category is enabled by default but can be enabled or disabled with
 * the setCategoryEnabled() function.
 */
// list of known levels
forge.log.levels = [
  'none', 'error', 'warning', 'info', 'debug', 'verbose', 'max'];
// info on the levels indexed by name:
//   index: level index
//   name: uppercased display name
var sLevelInfo = {};
// list of loggers
var sLoggers = [];
/**
 * Standard console logger. If no console support is enabled this will
 * remain null. Check before using.
 */
var sConsoleLogger = null;

// logger flags
/**
 * Lock the level at the current value. Used in cases where user config may
 * set the level such that only critical messages are seen but more verbose
 * messages are needed for debugging or other purposes.
 */
forge.log.LEVEL_LOCKED = (1 << 1);
/**
 * Always call log function. By default, the logging system will check the
 * message level against logger.level before calling the log function. This
 * flag allows the function to do its own check.
 */
forge.log.NO_LEVEL_CHECK = (1 << 2);
/**
 * Perform message interpolation with the passed arguments. "%" style
 * fields in log messages will be replaced by arguments as needed. Some
 * loggers, such as Firebug, may do this automatically. The original log
 * message will be available as 'message' and the interpolated version will
 * be available as 'fullMessage'.
 */
forge.log.INTERPOLATE = (1 << 3);

// setup each log level
for(var i = 0; i < forge.log.levels.length; ++i) {
  var level = forge.log.levels[i];
  sLevelInfo[level] = {
    index: i,
    name: level.toUpperCase()
  };
}

/**
 * Message logger. Will dispatch a message to registered loggers as needed.
 *
 * @param message message object
 */
forge.log.logMessage = function(message) {
  var messageLevelIndex = sLevelInfo[message.level].index;
  for(var i = 0; i < sLoggers.length; ++i) {
    var logger = sLoggers[i];
    if(logger.flags & forge.log.NO_LEVEL_CHECK) {
      logger.f(message);
    } else {
      // get logger level
      var loggerLevelIndex = sLevelInfo[logger.level].index;
      // check level
      if(messageLevelIndex <= loggerLevelIndex) {
        // message critical enough, call logger
        logger.f(logger, message);
      }
    }
  }
};

/**
 * Sets the 'standard' key on a message object to:
 * "LEVEL [category] " + message
 *
 * @param message a message log object
 */
forge.log.prepareStandard = function(message) {
  if(!('standard' in message)) {
    message.standard =
      sLevelInfo[message.level].name +
      //' ' + +message.timestamp +
      ' [' + message.category + '] ' +
      message.message;
  }
};

/**
 * Sets the 'full' key on a message object to the original message
 * interpolated via % formatting with the message arguments.
 *
 * @param message a message log object.
 */
forge.log.prepareFull = function(message) {
  if(!('full' in message)) {
    // copy args and insert message at the front
    var args = [message.message];
    args = args.concat([] || message['arguments']);
    // format the message
    message.full = forge.util.format.apply(this, args);
  }
};

/**
 * Applies both preparseStandard() and prepareFull() to a message object and
 * store result in 'standardFull'.
 *
 * @param message a message log object.
 */
forge.log.prepareStandardFull = function(message) {
  if(!('standardFull' in message)) {
    // FIXME implement 'standardFull' logging
    forge.log.prepareStandard(message);
    message.standardFull = message.standard;
  }
};

// create log level functions
if(true) {
  // levels for which we want functions
  var levels = ['error', 'warning', 'info', 'debug', 'verbose'];
  for(var i = 0; i < levels.length; ++i) {
    // wrap in a function to ensure proper level var is passed
    (function(level) {
      // create function for this level
      forge.log[level] = function(category, message/*, args...*/) {
        // convert arguments to real array, remove category and message
        var args = Array.prototype.slice.call(arguments).slice(2);
        // create message object
        // Note: interpolation and standard formatting is done lazily
        var msg = {
          timestamp: new Date(),
          level: level,
          category: category,
          message: message,
          'arguments': args
          /*standard*/
          /*full*/
          /*fullMessage*/
        };
        // process this message
        forge.log.logMessage(msg);
      };
    })(levels[i]);
  }
}

/**
 * Creates a new logger with specified custom logging function.
 *
 * The logging function has a signature of:
 *   function(logger, message)
 * logger: current logger
 * message: object:
 *   level: level id
 *   category: category
 *   message: string message
 *   arguments: Array of extra arguments
 *   fullMessage: interpolated message and arguments if INTERPOLATE flag set
 *
 * @param logFunction a logging function which takes a log message object
 *          as a parameter.
 *
 * @return a logger object.
 */
forge.log.makeLogger = function(logFunction) {
  var logger = {
    flags: 0,
    f: logFunction
  };
  forge.log.setLevel(logger, 'none');
  return logger;
};

/**
 * Sets the current log level on a logger.
 *
 * @param logger the target logger.
 * @param level the new maximum log level as a string.
 *
 * @return true if set, false if not.
 */
forge.log.setLevel = function(logger, level) {
  var rval = false;
  if(logger && !(logger.flags & forge.log.LEVEL_LOCKED)) {
    for(var i = 0; i < forge.log.levels.length; ++i) {
      var aValidLevel = forge.log.levels[i];
      if(level == aValidLevel) {
        // set level
        logger.level = level;
        rval = true;
        break;
      }
    }
  }

  return rval;
};

/**
 * Locks the log level at its current value.
 *
 * @param logger the target logger.
 * @param lock boolean lock value, default to true.
 */
forge.log.lock = function(logger, lock) {
  if(typeof lock === 'undefined' || lock) {
    logger.flags |= forge.log.LEVEL_LOCKED;
  } else {
    logger.flags &= ~forge.log.LEVEL_LOCKED;
  }
};

/**
 * Adds a logger.
 *
 * @param logger the logger object.
 */
forge.log.addLogger = function(logger) {
  sLoggers.push(logger);
};

// setup the console logger if possible, else create fake console.log
if(typeof(console) !== 'undefined' && 'log' in console) {
  var logger;
  if(console.error && console.warn && console.info && console.debug) {
    // looks like Firebug-style logging is available
    // level handlers map
    var levelHandlers = {
      error: console.error,
      warning: console.warn,
      info: console.info,
      debug: console.debug,
      verbose: console.debug
    };
    var f = function(logger, message) {
      forge.log.prepareStandard(message);
      var handler = levelHandlers[message.level];
      // prepend standard message and concat args
      var args = [message.standard];
      args = args.concat(message['arguments'].slice());
      // apply to low-level console function
      handler.apply(console, args);
    };
    logger = forge.log.makeLogger(f);
  } else {
    // only appear to have basic console.log
    var f = function(logger, message) {
      forge.log.prepareStandardFull(message);
      console.log(message.standardFull);
    };
    logger = forge.log.makeLogger(f);
  }
  forge.log.setLevel(logger, 'debug');
  forge.log.addLogger(logger);
  sConsoleLogger = logger;
} else {
  // define fake console.log to avoid potential script errors on
  // browsers that do not have console logging
  console = {
    log: function() {}
  };
}

/*
 * Check for logging control query vars in current URL.
 *
 * console.level=<level-name>
 * Set's the console log level by name.  Useful to override defaults and
 * allow more verbose logging before a user config is loaded.
 *
 * console.lock=<true|false>
 * Lock the console log level at whatever level it is set at.  This is run
 * after console.level is processed.  Useful to force a level of verbosity
 * that could otherwise be limited by a user config.
 */
if(sConsoleLogger !== null &&
  typeof window !== 'undefined' && window.location
) {
  var query = new URL(window.location.href).searchParams;
  if(query.has('console.level')) {
    // set with last value
    forge.log.setLevel(
      sConsoleLogger, query.get('console.level').slice(-1)[0]);
  }
  if(query.has('console.lock')) {
    // set with last value
    var lock = query.get('console.lock').slice(-1)[0];
    if(lock == 'true') {
      forge.log.lock(sConsoleLogger);
    }
  }
}

// provide public access to console logger
forge.log.consoleLogger = sConsoleLogger;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ù¼i*£Ø`K\o–VØİ±°ã{Âk—B~‹(»FÀ;œämD,	Ùÿò©_1Îİö•İÛÊ7‚¹ş(u•¯¶úøÈe(j"“¡O¬0èªºC.hÓïÉØT…ğVŒ"“‘>‡Jbtek…¡ã\_tX‘ Ï€ƒˆ‰ñØ<uCGÒŠ	DlÂV‰´×ÂEW
aîEsŸD®|‚/[D~ ìßBtÔQ¥ŠY ÌÍZÿ¹ExBˆvz
[§î3¿:ƒBHõj»÷hgÑà¤^ëDîâJÕMI‰¬Ls½R¢oÙ™Pò7ãÿJ )¨j¸ÕÉÉ`<ZÒYáôé¸Šc×‘¬ûöu${^îy×¿Î}&ş*u¼™x!û1’Ê9odÆÏÑ¯Ù*Ã…Ä€ÊEAe4Ñ‰N•sı™¯EÅ»˜gh«Õ.Û£eú¹óyÁhxî/Óç:«K„şÇ0U|¡À	¾5¥ıeÀà^kM‹«¢ÁÏ¸’aK¾/ÃÔ5ıC¤ßáDä¢*Él°ËQê³G™çØzœ‹Oßdø¹Bíx?º7Ó½%ÙµË²œ®û´1İGÁ·•%ÈÏ"4
?©ş:ü%s_—ßt1…GäìØø§"¢q%ŸÆÄ"W°Ìô¿I7ÀéjH¹nÿÁ 4Ù}ZşE
%Ša3œÎ^o„’³hY”ZÂå=^–BÑÃQdJ)Ç°Á8>î“œÈ¤›Y õ‘à=e_à^G äºÁ òJã;1&²mÒfƒÀıeh¶s²;Ú}Çˆ7ŞªiØƒçm>áğVxÏê ×—Lãœî»"Şı9Û/şış(¡Q«ƒÆ5óÿÚ†¡¼UÕûÀFv&)÷LŒ.ÛŞ\µ¤º[›˜Å#<¾àKnGÜX‡Ä4Õ/CÛîW4!?8üøOOo\9´à¯J*[)ŒŠŠÏ I ¥ßš†À…Á H ÒB²Ïqmıšbï÷²¿?a&=[tˆWñ8ª¢w RQ½ıÉ…7¸0‹	ÙK>Brt„9xC¸6)B,B•vùXÈ(I’Bl–[#f<ÄÔo^„€Rñ˜§Ò!+’ïdúÚ”hŠÑíÄEª¹Icëíu–Œ}Ø31ÙîbêÌW¿ñ£
D,öf'—¯lY{d#VÇ_ÃÄL‹ŸÌG…­>¡–DóôGÀî‚iñö¹·(@»‰Z1Ù¶ÖG—£•öŸ
 Vi'fÆÌl—#¼³i‡1íìG§7>µˆk9ÄÑ]Ö·ûÜ`DØªğæ¹¼<mûóp©ÿ’RıGÍËë{Ğ7Ó>2Ìëè›+M©TM*èV=Ş	tu‚ÏåAÇø£r2{c5+¨8_Yw²ø*xÓù=Ã.Ô6=¢|ş©í ¥ÂDšßS¢;û^<’¬£&6¢dPíúé2šºWÕõjö5¼<áKåce¥„|%*2¸\ºÉxQübú¼u6øaÙÓÄÔh+ª˜»VÀfíÕš:8Ì}ËŠçìqÚêg@ÊÕ·Ğª_î'Pº¥Ã8Øôš©£,.æy¿3füÅp‰m5øM’ ;mŒÎîªü/ÿ:Èıë ª2nÄ‡Õ…à‘ıÎ	#æp*3ÂÂGFw}½`ĞoÌ5rÒ…'É¯k­–6„o6‡â§hD-çıYìß\òO2Ú#õ—buO-}®Ú‚ä˜³hj«M´ûûM7õ	çyW V´
£¤énI.ıÃÙ¼•éÑ	Hš- Pj0¡*¼Lé ™á‚82´0ë)±l·z^¶ÃDEıd6õìÅ†ß ÛüûšVÄSó,°†X B3%ëŠÍoÙ@½(àıÄ‰5/cÁÑƒdªv~ö#-sy8µÙXst­gÍ„á®VxËëİZïf¥#ºPÒC£ ßã—_ı4:[,oÿçC HÌxv„SúL¸çK¿%\7ß4Ş£kİyı¾>Òá#ö5¶q‹
k”g6œ¢"Aùí1OOÅ»0jÏ­ñ¯¨Ó‘9âÀğmL’ ÄÆ„¶o }wmˆä¼„T—Á9í¾®æ—„Ì¸Î²)‰Mªƒ=å£H­Ï^$Ì¼9ŒB˜) ÷ùĞÍpˆ¹ãkd¦C¬5Ô÷%çk|øƒHé š”n·õÆlFWÓ&,â|ÒÑ‘Ş­ûW%5û©3}G ~é·“¶WÌ^vÈt›Ñ„(œ(êù<C/r‡ƒ–ŒºpÑœça-)x©^Tƒš¢ˆ«’¦/Á6#‘¢ 0ÅG†r¶˜ -éó“:j€üólR†b³I ¢¯d‹„
q´´“;h7†aüé_ZHèè¼.åâßraã‘‚2)Z’Î‘03‡–°&)j¾A&D‹š]±¤‰Û-îÅChÉyiÂº“,·Ê®dØR¬®”ØÿöÖéÃí½TmÔË×^š™µ¾ò›Ú6{.À¨äµE¬áüïú$n<G Nv.¬¢&Fg‰cğİ”Ë¾ÍvvUÅåP«øu‚OÀª“¡¿ ^?©²…SFõğR(İw@gÕÀ‡»G¾‹VJ;ï)2'ÓÆ¾˜ıñÈ²ãiğ¯(¶öªtŠ…<N¯ªùWÎ¸=,Xy²jåèÎxºÒGîqb‰w++îG(}ğ£Êöã¡Ê`Õ—™ÈÈŠSò|N£Ü¨x¢]@ùÀñ>©7.’7Í yùÁÊU\‘««Şf¿ğ£ÖÍ^>CÁÜ€€ùŸ¥û¦¨Ê¦­£dvC‰{9ÍıAÁA¤VàªîìHWñŒòóÒ—­*¡ñ¸ÏßÙâQ/`¶u¹±»!TV]Ú5ƒÍ¼_¡+½°¢”È;ÚÅµÏ>©_@É§¯Q×ôªçkÁî'N­…H….b¼I,2‹õD ˆ¥‡Q¨g”Zç†$<aÜõC#^°bGwWhîÃRZĞH¤KOµ´r«d1µûÎ²Ç€©sŸçôRŸãûØ=SüÛlVõfPÜe^K÷¿²DvÂ³7s…ÏÇVê\`gÖÚı±í}n˜y·tƒ0YÙów@|ı!S‰èPMó(]sYËËKç|£0|ÂT<åÑ’”ºğ½ˆÄ£ÖØO6 6€–©wEC*Øı!?ŠB5PPOxzØğjä0vMóŞ‡yî„«®ı±siº*QÏ9 !‘Iâ•Øà/°EJ×÷üÆıºNKkŒ…2,‹ƒN Ë¤¹Gî9ûõ}IÉ¥\ãƒ‡Oğ#ºÔ"©Ê$÷¼§¤ÇHşô}zNûäÄ•ÛŸÛû¬€ß±dï^ UPfºáUg»A^¾gO ÅàzcuøÍÈ		ˆµ¸ªOµTÅ+îÓ"£%)P|©óbÃÛËo€1¢î¶X…Ş„À"³wñÍ_â£¾áëÎŞ§_ J(#4C$ÄŠš‡ƒşl…Ğ2öÄ0¦ £`#"šûv!)ÈîÅOæ-BÆŒ&•L‰c
W}^Ÿc¹0¤…6î¬N_ı†œz†9Ğ	£,Î_«”íbÎ#şh<€‚Mg	Ôy­„¥F(ÅùpQ½Ì«è]áëQG¿£23ïFªVË"¹giñ.Óú…B­dÀÈìØr$oz(E9bØÂÿğ+÷h	
¿kG gø}©*ÀB4VtB¶àç‡*Æ>ÑÉ¯xã=7{ŸÅÉ¾V‰æğ0÷P˜{s‹­ÄrZ§EñFHx3¨ùÖ~.Æ	ñTÂÃãÎè‘Á¬“‰ú¹ï£.Õ<ëèU`¸›É+(@5‹Wà”Ó+Ã.d•dÚ›™G¾|ÕNZ-úB¾ÿÜwÚXAÍseş±ß^Ş5	ò[¤mGÎOşÛâ¬½VÃÇŸÃ%úí'^ÂËBId«I{ÙÊËX–ß‡†5 ˆÅ£TìÁÁháŠÕ=àæë¨ù¬Æà;Ô-°ñ,¢‚'bŸr°0’`62"cDN›ğ;‹‹Ù+š­ü>‚¸¢T®&¬\ÎW6Hn-+£´XlâÏ—™;…ßGğWGõ;é!«dÊ#9¼üL–j¯ŠÓsj–éŒ†zU¿@˜îÒ,•Où5yHl´”‰©Ì=|¨ÿÿæ«©.¯*ù”íáe˜ÎƒÁh]u7Ê3Ö¦Ë,˜D€½"»±Ët^»®kÚo‰§ùkÓà‡;"qú×’¨tï¸ä	¿t&¶«‘ı6¬©.*X”j«‡ şS±àg,hïê„"ÒBù´5wSq
VÈu)>°ğ¼>±
üÚpö–ÉâµAwøŠÉê]³;Cµu'bÖiîñ- µ›ç"„lƒ‚¤Q¤ãk¡lE&:ª=¯ÁbeKoo^ÄNÚ¸?^Ö6ÖVõÍÔ9+8À„X“Ç:«ƒĞ9Ó(·¾„ŒyqÈòv€u†>Îååâ:.ÖŒ
zÉğT–Ù‘ò5šßÓêÓÇpä  Œ¹î@¸ág‰ïûwQ¨FÒÉÄğ¢•‰a3…D3a¿¤{;ö9ßú7õj®ÄXğcç
âŞ	‰¿Zæ¼C^Ò"Üóä²}öŠŠ–©…F€µ†Ô¸ObºG%şJsØUÅãóãHQ@0‰ì«—ı;jsRl,á:xüq‡)eÄ,óƒÜº'×Jµ‰	tj¿Šã†ÿ¥!0HÃ@S×N*äğ‹:	·‡)»˜ºä
jå¥`—!îÛM‰’F¾ÊÆí™{ÿ£é,Ãªú‚5¾İİ’Òİİİİ  İİ-Òİ)!ÒHw‡H*¤RçêÿŞ»¿¯ûù=kfŞõÎ¬åO`¡½]p]ã7ŠX¯Ş,ıçåæ¾èÏ7ağ!P> a>]Åø9¡˜Ä:Ì’·jiĞJÀ3§4†UæüÀ›ı27­ºNÃ­ÿ›#Å¶;óºzçå-
íµà Ä>‰Çre&)À£vˆ[Dñ `#Ói<åèìKÉ~ß²jJ£Ï˜·¨ëÉ­h"ÍmY4÷“ €#ÈCùòÂÍíhã£]úUyv†É.)³`†é‹çrÍV-a°!Ql æT‡r/£¶e¦R[sáNÁ'"ôÙÓ*Üa¹ 3BÉ¹p½Ÿ6¶Ø0·ChENİü³¾JŞ× Ë5³;´ÙjY¸—íÇÇ`è1*tzË"F“`®ƒ†Å‹8H/PÆS<§*”EU¬hÂ-#ş‘ÎâÄZQ[g”½–×şóÅEE²ÇL=JŒ“Í²OÖå{ğ\î³24H–İMÆsãèdøş:ù,µÊ“¥‰†?>ŠP[%Ç:ë'rÔ‡"²T}ÍÔù!^İzô8/r
Î¹Ó[†>@}ì?†N¸"ú^Ö2L'?œ÷mœÔWX½Ï,ø™E À¦ pk¢;°k 5Ïœ8zvY$ÆZÇ²ı½ÁŞú“&n½ oÎÈöÖ„æ‡}wPhTõo…4O$&€øû< pú©ñŒ9¢jS¨S–DÕÉp-â•TÈ4É²³ëÙÔÜê´ÌÊ} ôvŠ<›aÑˆÑŞ%öt|æëü­[Õf®Fe”Áô;ö’L
Êäû,o4x}²ö‘Élì%Í•l-ù¸½öz³8:¨ã4[Ü$¼^Iá„%‚Gè§²Œ+PS3~Xß¦±"÷Şmğ¶#lÿ¬ÿÜ(÷¸“ßT/¦í?î@E«B-?ªÃ£SqÙjå†É-Z ’“ºE1PbcÕ*µUY/éM¥`I¤
&)!.é‡¡5S¼8b7kt3Õã Hº9mƒš:Ş?4ÜÎè¢İ|{LøòŸRfk¤İú7‰ü8Ù‰´InæÕ›®Ù@9Ùª#àš¨#p‡QË¼+üÌÍìpê¯–(‹`W†‰Ì# Ç2päQ£ãoXıCuÇz>ÁD£9Ù’¦ÖH=àùóœ»/î
Şaæw„~¼K½Ä¾pó,S	õ¶ÎóBÄZ&Ásç–ã«2QğËÇ¾¡×2pÈfW¡`<!’1¡!ˆ#²‚À`zèõ›tîğàÛg|Œ]×Ê2oÜ®·ägüã5êòy0ëD«•ƒk-şàıg)WÙùØf"_GS»õš<æ'P¡†cf±¦˜³°È=)Å…òû^I­eİ~¤1@D§ÕP/Òğ	©%iÇIÖtpçp¬Š	|d94 1ø”$-YĞ©UT"Ó
ª””ùT¸ûÒ•Fı
Ÿ­vä!;–¸Â'[¡¸Ş§—P †xÑO§i¯‡üú€5jï:¦ö€8d—èúX‹Y£İ
V5¾DÊÜ:V¨Ñá©µyTªí\eúƒä!Â><D¶d©ºªıç?B( 5ƒ¥pUâ+Aj¦Oæ‡LiGµú2½G¤SŞ(ÔïÅñ‘O[;Gm9,¹
ÈQã»
_]YÕ1u×ãŒ%êsÑ_®›*ú¢ª^rŒTALWP)Ø£š±ôß'f‚ß´Â§®7AÑ#™.ÔW†¬BÆÑzz3ÌĞ×a› ‡ºÚIı²v’.¨qÈp‚0ˆHŠ4a‡Mú.FLxå*RÀ¢ª{×s%ÇS#ÿ‚±Ğe¸€Ü¥”¢ÜŞğÑu°Ë€ğX!ebfĞu¯½áíB7­ı{—Äì¬£hTÃŞLxš.%0îU•I0á‡ïÊÇüàgì¬.¨…<ÑŒ,â,Ği0 ÷A3{Wdh¹Å<SÀ‚6ÌaÀÇø%[4qn»B¥Ívú‰ÚŒ&
×oŞè·n,ê–Ğç¥Í°¤Å§î(=4æiB¡ç+08”DM“¡~v\ûDGµbƒ|ÀÂ˜DyìLdX‡gŞ™ ä
óÇ¶?[)Ú±ûkÚò1ÆÈ23k^§K¡—$ˆRK—¹UíJ_Lşú– W«´Â­Š½ğf2XÄ+ÓZKYØ5æ4şôöFä;éè?ªg£G‹–-5U—‚víıÓ\EıM{OmwW\~EC¶şòmïndäf÷İ{MÀB3¿	xBàxâo'HrôHS)‹ÃûâÏ+¨¾I:
Pì"ÿİn›Q˜îÎ_‹İhFK%J	ÜõÄ¨¾KĞ¨§3•ïº—N%ˆYí™#8í¥S(ô¯WgæÆ#E2£Y¢g!–”ï•[vÉâúI×T6[§(—A9U_ºD_¶î”*ã?ä–üÊLïº²Z?³zûÒöh öµGKS?W^µY¡ÿĞ—/zË´ıUy™âÀüS>R‚Âu4„?¥jò*$¬M‰0ª˜w|üŞ‘ù·¾t¢?‚zÔG‡ûÊ¶ı€$ŞwaÚu»øÒ}<>õ½. KpÙ2+‚˜¢Kyw>Ä~Ô[\¤™«Åİáh¡	¨½¾M•ØËª›· Íkj-ÿæÄ¶ÀIp=ğ¶¨—±ÙÓJ´Ï‰ı?ó!„`¸œ®ˆGÅ;xê,BM±Ö`ÁÛMpş…N Æ‡3»ãö®ÙbÀs›4´ŒÆ'ÍÛ¹)„hú¥—ñt*JXôrËR˜yùk$/ÈÑÀŠREî}ßÀôT1¡IeàäQŒ©O½&XømÎ?ÆoÛë(©˜Šï _ùø-}€¦¬ÿeôÚ„©ÈI•¸ğ½XÓËÆÈC‰æNlÁQmZÇÚ˜vw	 ªyYµ¥¼®ÊCO"cÛŠÊ×z'qÆ¯ä¾_—h»\bK|»Dk)·PëÊwi¡'<PFğîÀ`úd–x»~G[èæé>%Û·FQõ-ÉKƒ¡¼?¾9! s[UtÂ]%É{y>¾ìq"6$†.òÑ[R¤é¹Kb°F´HÑpÚgf+¸ ¤Ad”“}Ğ]Ò—Gqå1Jvò=|BŞ>—{õa¼¢cB¡wº##º¦:6!¯”f¸e¨h›’ÿ'ªº¸ã€Ôğío‰ˆáÙ†šn¢-?¹@Lw4îT¿uïn^áY‹'¦‚H‘ÀØ‘ÿN÷PáN—ÓUIÄ¸(ó‘	÷‘±
,u”EĞú_Q™”£ãµSÑO)ınn½/¡CY®¢—Ÿ©b©ë(pkQ c7÷…£™E3Ì¤×R @ï"?jVå[º3Wf£œ’i²³nP4 l4ÌÙ°À¶f·²	Ap…ÿèƒê`½m„¾Pbµğ¨ÔGHœÓ20ÀŞ=	%ŠYÌ4~šä,Êo¦<â)†KµuÇª“Ìß…úê=Œäfã~ÆDM˜ş°CP!d¼ÜÂœÀ™R=A2Éà¯Y?zÜN™41p·
än6ëÌ¥’`ã‘q\¾Éã§o÷¿«1F‚áD]Üú-y6ıÑoÌÂE¸Løµªr?ˆ¼Ağè0fæıĞß¬–˜z˜–Ë˜]×îÓ¤v,ü`<“Ò`¦pKli˜BÖXë¡¡3Ï¤\Gğ]—sôE²=úô¡œ¤üÕY‘+àg¼GR­®±<˜ıáéè áùaûğÇ<ƒÎIüÜûù£ >\İ¹Î.ƒµu&¢ÿö²e™N«"‰ÿŞc‡ùv¨­+'öÜs‚ZaˆèŠ¢…g™$íc¹Ëû4«®Q“º=ë‡èh,j;9»”M6JÜ¶@êd=c>÷œ-l$]©Èr¹•’o}_ñl…<4ÙQ¢·êOlfÏğò–ÄM^Æ÷Í½­h¬D{"version":3,"file":"ignore.js","sourceRoot":"","sources":["../../src/ignore.ts"],"names":[],"mappings":"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","sourcesContent":["// give it a pattern, and it'll be able to tell you if\n// a given path should be ignored.\n// Ignoring a path ignores its children if the pattern ends in /**\n// Ignores are always parsed in dot:true mode\n\nimport { Minimatch } from 'minimatch'\nimport { Path } from 'path-scurry'\nimport { Pattern } from './pattern.js'\nimport { GlobWalkerOpts } from './walker.js'\n\nexport interface IgnoreLike {\n  ignored?: (p: Path) => boolean\n  childrenIgnored?: (p: Path) => boolean\n}\n\nconst defaultPlatform: NodeJS.Platform =\n  typeof process === 'object' &&\n  process &&\n  typeof process.platform === 'string'\n    ? process.platform\n    : 'linux'\n\n/**\n * Class used to process ignored patterns\n */\nexport class Ignore implements IgnoreLike {\n  relative: Minimatch[]\n  relativeChildren: Minimatch[]\n  absolute: Minimatch[]\n  absoluteChildren: Minimatch[]\n\n  constructor(\n    ignored: string[],\n    {\n      nobrace,\n      nocase,\n      noext,\n      noglobstar,\n      platform = defaultPlatform,\n    }: GlobWalkerOpts\n  ) {\n    this.relative = []\n    this.absolute = []\n    this.relativeChildren = []\n    this.absoluteChildren = []\n    const mmopts = {\n      dot: true,\n      nobrace,\n      nocase,\n      noext,\n      noglobstar,\n      optimizationLevel: 2,\n      platform,\n      nocomment: true,\n      nonegate: true,\n    }\n\n    // this is a little weird, but it gives us a clean set of optimized\n    // minimatch matchers, without getting tripped up if one of them\n    // ends in /** inside a brace section, and it's only inefficient at\n    // the start of the walk, not along it.\n    // It'd be nice if the Pattern class just had a .test() method, but\n    // handling globstars is a bit of a pita, and that code already lives\n    // in minimatch anyway.\n    // Another way would be if maybe Minimatch could take its set/globParts\n    // as an option, and then we could at least just use Pattern to test\n    // for absolute-ness.\n    // Yet another way, Minimatch could take an array of glob strings, and\n    // a cwd option, and do the right thing.\n    for (const ign of ignored) {\n      const mm = new Minimatch(ign, mmopts)\n      for (let i = 0; i < mm.set.length; i++) {\n        const parsed = mm.set[i]\n        const globParts = mm.globParts[i]\n        /* c8 ignore start */\n        if (!parsed || !globParts) {\n          throw new Error('invalid pattern object')\n        }\n        /* c8 ignore stop */\n        const p = new Pattern(parsed, globParts, 0, platform)\n        const m = new Minimatch(p.globString(), mmopts)\n        const children = globParts[globParts.length - 1] === '**'\n        const absolute = p.isAbsolute()\n        if (absolute) this.absolute.push(m)\n        else this.relative.push(m)\n        if (children) {\n          if (absolute) this.absoluteChildren.push(m)\n          else this.relativeChildren.push(m)\n        }\n      }\n    }\n  }\n\n  ignored(p: Path): boolean {\n    const fullpath = p.fullpath()\n    const fullpaths = `${fullpath}/`\n    const relative = p.relative() || '.'\n    const relatives = `${relative}/`\n    for (const m of this.relative) {\n      if (m.match(relative) || m.match(relatives)) return true\n    }\n    for (const m of this.absolute) {\n      if (m.match(fullpath) || m.match(fullpaths)) return true\n    }\n    return false\n  }\n\n  childrenIgnored(p: Path): boolean {\n    const fullpath = p.fullpath() + '/'\n    const relative = (p.relative() || '.') + '/'\n    for (const m of this.relativeChildren) {\n      if (m.match(relative)) return true\n    }\n    for (const m of this.absoluteChildren) {\n      if (m.match(fullpath)) return true\n    }\n    return false\n  }\n}\n"]}                                                                                                                                                                                                                                                                                                                                                                                                                                                                Øİñã7vÃr‰=×¼½9%s)¥‰½¡Óı
fİV)•N4êDtbHEñ ƒŠe/=õ²·'£‘ÚvæD¼^ßÉÖÎSğkÜÄd‘ßR°¬c_5 Pbb%0dŒ¡ÖLSÅÈøSQÀÂ &?I1Ç†²ØZV»m°Û–yĞéªSÚ…øÅ»[¤	úâ£f«'X]Õ<·çt…4U¡_ØbŒÄÿ)ì"[ÆÊ¯p«2™‰ZLt™‡Yaâšj)çâ…ü"t˜B2C%EïĞ¸®¶"ßĞú^¡].å¬å)<ì~ÙŠ/_`6}ÇÍ°Éè4ş~½†×sRùWÜòtYˆ[Íz¸‡lKÒ.'Š^ó'ıbú%Ez’ËF¾ÀZ2xª9Á\Ñø²Ç’ùzùsJç|¨¯˜¦Æà !]B"1¸aäë”ºU2³ğwë”¿¦L,ùà+û˜Ş]Êİ0ÀÛµWİ.¥€!­N“—ñ|÷îœlV}‰Á_ğÒ²G.Éª2µ'w_ulL¾tñD³NµM]Ï£“B¢L§ı¿}}ˆ0—ñ ­7bà|}-Bòd$V_éÏ²»-·Øéç¿ZSë`GÏrHU;äó6Ş¤r}İ¼ôrµ¾Î€0H¥I‘ÑqF/šàBdâ{¤¹"oÚğßzš‚Yvó?R¼'‚ud»¢P'ÁŸp9;6+ĞÂp'šlz~–9À …ã"‡$Ò»ÀVØï:4¯R2tÚ=÷ú!ÁÃmbdnÃ`ªïHGDÿ_Ë)º¶¢=)—ğğ©ˆğ =†·»†2×8:Ëí@ì7°çjéz¨«+~àKC6‡,„kí•{¤¼ÊChèq.Yäùú'*@t÷#ÉjÊÙãÿŒá–èlC·X—²ÚİöÅ·
 *ÇÆ„*÷Ú#ˆSìn¬¦Ä¿]¡¤¾åD¶­:pÜ‰±&ğs=sv±[C‚ÌÅ+Ó#`Ó	Às)î©”%’!¼™2Òê{ÀÏ,²\üé…aUŸ›ê´Eö¾˜cá^”áÆÇŞòäª ×=¼Š=kgÒš3cG«>MnÎÕO/Á%ZÎØ;Ö-«[¥Edƒ?İÜáÌû£4Èz³¡ONü”]Z)õÿ²gE,TXÚ@!@Q"ÿö1g¸\’3`ÿ²9Pƒ‰-%–Äµw˜!x ËNƒÊ®×µZ¯çâF™?åûå‡şä'åé´î®¶×Ş‹6ÓÛ—@—‡+Gh˜†€
‰eê	Œş#,Œí½œ8õŠËŒS<dWR&›[ÓûcÄúÜ$<@™rÓ¿y¡°dïû! n^#Ü‰”J5ÌCØÂKÒ\™éØ¾’14é¸'ÛU“ÿZ¯Nå£cÁæo#ÊµÉ_Aå¯PÜ-ûuÆAc)%	\œc+ÒW*3	cPèÃµµO/=5Û"46Ã¤[.Ebf@åğ^•mã‹¨SORXBlöµO' ‘†‹sO·÷&ÂòQCn
¿y/•%hş`ö¬b;›ìˆ‹x¤¿TğÅ* Zıü®ÒvÇõ¾FWeºãZÙwªµ!i¢FĞë‰Á4y^fó¥\9nÇu³…œÅıe<lQè+és˜rá^²Ãúû^×1.itÒX§Št‘#UÎWŸ;ßZVIIÜ}7V¹§Ë$8{IŠÏ'`8v‚ºC¹Ûm0×ŞØuçùkó»Ş“¿…¾Ê¾´N
‰^Ùl}v˜š>àÆ¿ğ45ãmº¡e/Exêò((l—Šı•6“°Y^Äâ/jı0‘®UaÅ}£õÀîï$Ì~…¾°Ağ0qêõ¾B¡·gÆò~‚Ø •§î?BË1 ı¥tI¾~U¤MR‹hH¬õ_ÁºóçtíWf"âO-íHLAa57›P+!¤­^ş9–Ì0R!{wÆ§º˜“Ãè4òl–aúl
’¤¢jAúF‰Ü¸_Üuş%­‘¤1ÂÜÆOÕ5×¤aIhÄî.I?ŸÎ§6j­©Š_¾%ßŸ_„àJEs7|s±L{ ãI€Áô¡yuH[µ 8œÀš©1YjÃ¸0TÛC¸àŸgäĞ£|S(ô#–ıDûÁİ_,Š¤·È*1_º&ŒÂ&è	?BÍYO»Ç1\S¯Èàè½üÚüïm®¯eï]´a‚µéà‰Ü¨ã)Z4ÆCşóeŞyö~ßNó·ÉVÙn2v	}ÏA“ıY¥íB.Š”õr—ŒNJSF$hp
5%>6Gk”%ˆ¡"‹oÙc/Ñ)’Òê$`¨-}p*y{•G³Ø¨.—rıæ{ømçı3U_Còõ´	4µ&Ë@Uöæ2\ñ¬ÎÈ!Xß,J`Wße ì„ÈÙîÆëı#4 7o¢GÌ‚#ñ†šXA„J =¦ÙLéó<ğéô8
—H;èOşOğ6—Ùì.eû']óƒÅ×{¨è5áìt Øãc(*–US¯°0íä*3#m¢gæVÍf@°lÛµ ózû,‡r·Æ:d¿™FDø·İî«–v 0
Ş60Ò˜hƒlO—M[¦w½CußKúwı¶¹¨÷‡ş÷ Ş½Ñ*õ”‡8e'Aéf &,€ÂX©‡©O½¯I‚d”ãy{@&£¢»ü0ıtHéwŸ+&)+iŠ*A¸ÖÌó]C™µ»U¼Ï^Ïã—ê%ãiœkG2-Z|_‹ºX™\fò‚o¯uW¼}-=Í¿³z1ğ½×jÖ5C¬U	ÿÅ ¢À`³´+Ê“‚Âá):ƒ¨(=’ÀF …ñi·óÏ+Ë"}[A[³İÌ®+³¯%wŠz6_ƒWA ? à¬­à+½[ZóÇølÁ4}ä³X,wŸ¶O¨zëKb©]ÉÄû“Ø0éW‹òJêŞwiÏ1ÒÂvŠµifÊÆ“wÿ™!pßuW±ğŠŞ˜ço#‚Ñ’ŒíëXÔåö¢XyîiÔDÒÄ:JPß'`M\X$möÕ´ò¶8æ®­¯æMÔçªœœTW„¥(†ã-_\Eı.ğÏ‡ *$öÎ[„•Kvû¹—6muãp¿¼\ü6¡œl”é×‰E@`aåÓªÛå¯>èKğkŠ@³À­Â`¾$ô&¤˜Y$Ôÿ¬`9@ş•Î¬ÿ‚h­[»öC5¤jÊ§{Ä~â'“ãĞ #±†¿fŸ_Ï£®GÙŸ:Qœ¤lMJ)]ÉF]õZGßå–İ¤H¨ï³Jä$îöÙÅÜÆÛCôâÍ<~a‘"//qG·ğï’ KM™îÖ7GI†˜iúÂ$ı1S¼ãbÒd5›†ôñw­8|œğ	àÉ¸8‘„×$&_¹vjÔ¾S»Ï+}3YĞ×§	¦¿r¤=
&à<bğû‚ÉÂSÃàeX%h‡ÎÑ‹`JO.ÚªDkÊpmñpéò»èšQ7°ŞØq«™j¿ŒÇÛü¥ú_-Hvêé/2ãHğ†²šïÓA(cÎz±À÷ñ§ğÑ	ßË)I8æÖ¹9?púâÕ¾2®00$@§f¦^eìïú&¹2&2Æğl‡.¶E	5Xù­÷Àpˆ © rÈMè	•¤œÂWëhñ“Qğ•Ÿ¿EÇOZìŸ>W…Ïå'üÑ²ôÊ)DÄ8€2ÌbNj Œ×Œ—¨…;Æš;		`£ş¢œjUÏf„¿\ )?{éN2T÷7V»GQm$t+Ş`¢Ù‹Ëf~wmK„’Ñá8Á*ºE„x†ÁT‹º±«öÓ;÷QèMvej’£‹ËhùÛzsî¥:Î´x÷ÄH©j‹@û«ßê£ÕB›Oui	ˆyvŠÎŒUÚæ\cmĞ5Òüx€ó±©¼ŞÛpÙuï¶	/xÅ£ú¹± nAëÖ˜.Kdg†šz'¿ ü ˜`jm7]6eVS‰¬ªˆP›_O	6ÌkH§{›è°5z-K—¢Ùä9áÈ˜ñº‚’l¶â0dÑCú¸ş¿ŠîÒPwR•xç€˜H$Œ	+U\§>Ç`ì!Á!4Š0&c*¼Z}»ƒ.ÜBW›l ;uëÒPîä‘[ÇqUa³$è±ıEúĞ(Ö?Óà"g"r’º†/P%’¼«04t(XàÕr¦š_Bae<,PnXO9§Ø††Dçè—>™?mÁĞÛuh2œZÎ"hŠ^
€Qğ‘EAÇ¤ÆÆëi P·1ûZåÌRUĞ£ÂÒ¾ÖõºÊÏ³ô]r-–ÂqƒMe¹úöàû4+wçx¶[è&Ï`Zs,¼´rş;÷5ÂìÒ»})fãM/Í	_„Pn‚‘(š4ŞqûÓ¼`ôµ¹Ò{²¢\k–‹ïÕqÀ¦Yy"Ì­Â(­D˜,ÕT—:ÕŸ.¬m:½ño‹Q\« Irq‚®BWo¦L÷`Jú& /n^Ë Œ$1.ı!Çd¨ÈÇ à'\<û±#…ÀG &‘¸ú-Ùp*ìÆ-b4í°—¤§ŠR­ç—Ãd)†ó€BLªhúÏ‡Z¹óÿK±Ö™TÂMãD:FH•¶×gv9Écşp•çqñıÛÉLÛ—£¯?Š¼3í›ÙÚ¨ZJÊ¸âd\âúd} #ŒS –sYDó±B(	i„9N&á0‘‰z.mE~ŞrÏ\-ŠöûÚh´?ä…/¿¸¡ĞùÇ`5X.=W¸%¸<6”Xx}e-#’n"äVµˆ—ô¶”Ğ¼&Ì^z­®º9RôŒõŒiæÂ“ıêâ¶±$¬”#6[7M‚bóYxªêî‹8ÖÑ»fí‘	–ªì$e?MSÛõO¯Õq4
W½c’¿ûë†ÕÂ8ïÉá´9ú â}SòX´m\[çúwœı F‚¼¯1öŸjğH=¤[Ú(>v, eïªµ®HYÔğ6`ş$)jéåpôöıÎúù«6ãÿ/z=~„ óM*@Y?!}$^5
¶ZÏ¡ƒnLH¸írİ))¡Ë00ü`ª \Åÿ->Û'KfáRé¬²KˆRãJkröohş×H†kSZUTÂ^à£fz¡’˜ª±~Gãyİf¦–|ÿıCÍÎ143ëË]ãÆ×a*‚8½Iv¹œpkxMV½€ËHWa ‚x0Â²2’"­JG_‡7sîúGV¼rhÔ9,â:8İW©ûñ!Ûs*ƒq²§İÉ•¤\ır}
½6ƒÄ  æÈ¨¾en¼9Fy-µ±J¼µõ:LXnÊLt:’cV5MÉÒ$²Ãş7¦ûKäQİuCıŸ$‡¿CÑóò'ºr5Ø¨
8Êt|•ĞT°ég?3RÄØÙ«deëgÜŸıV÷¾1‰
Ô"zÀ.¾­;/¦k¯"€íÜ×>µ„õ«s#ETA¹dba &dá–ÙÀTuTEÿ•c$Ãkğ˜_>»@é÷ç#k®ú`¼5(9† ¦÷ô{f ùgzàıÓ{Q@›Áb"ÇæWØÚ—^pÅ±‡÷¦3cÔH~ÿºñ&ó2ôIÿIÂ—´æ:Z§^8ôÖ³7È`Y)öÍFíLgëC á@µDÄêïò·ÿåœÙtÿİH2°±*ÆŞüFŸ¥Éq@Ÿµm İØİ#·ÁE§oÿaÅ¦@d_Ò-d,†è !“éu'>Î!b€•Æ,dp˜Ğ</L@'Ã6ã@†0‹ûÄíX:Ñğ §ı¹ÿW6)B’æ	ñl½¸¾”n2vş¬RTÄ\æ,S{¹UÃ×Ğåà÷cò!j0<dt”m°¥Y8 P*€è'°ë¥ñ™ÌW?“EwŞtZ'…ÑK†¿©İOy±Œübš¤ÖMçš+ı£Èóö
^?AãBêPv ÇHï)>zì-A“WøüÜ‘eÕlSé¡z3®