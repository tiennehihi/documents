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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ��i*��`K\o�V�ݱ��{�k�B~�(�F�;��mD,	�����_1�������7����(u������e(j"��O�0誺C.h����T��V�"��>�Jbtek���\_tX� π�����<uCGҊ	Dl�V����EW
a�Es�D�|�/[�D~ ��Bt�Q��Y ���Z��ExB�vz
[��3�:�B�H�j��hg��^�D��J�MI��Ls�R�oٙP�7��J )�j����`<Z�Y��鸊cב���u${^�y�׿�}&�*u��x!�1��9od�����*ÅĀ�EA�e4щN�s���EŻ�gh��.ۣe���y�hx�/��:�K����0U|���	�5��e��^kM�������aK�/��5�C���D�*�l��Q�G���z��O�d��B�x?�7ӽ%ٵ˲����1݁G���%��"4
?��:�%s_��t1�G�����"�q%���"�W�����I7��jH�n��� 4ِ}Z�E
%�a3��^o���hY�Z�=^�B��QdJ)ǰ�8>���Y ���=e_�^G �� �J�;1&�m�f���eh�s�;�}ǈ7ުi؃�m>��Vx�� חL��"��9�/���(�Q���5��چ��U���Fv&)��L�.��\���[���#<��KnG�X�č4�/C��W�4!?8��OOo\9��J*[)���� I��ߚ���� H��B��qm��b����?a&=[t�W�8��w�RQ��Ʌ7��0�	�K>Brt�9xC�6)B,B�v�X�(I�Bl�[#f<�Ԟo^��R��!+��d�ڔh����E��Ic��u��}؍31��b��W��
D,�f'���lY{d#V�_��L���G��>��D��G��i����(@��Z1ٶ�G�����
 Vi'f��l�#��i�1��G�7>��k9��]ַ��`D���湼<m��p���R�G���{�7�>2���+M�TM*�V=�	tu���A���r2{c5+�8_Yw��*x��=�.�6=�|��� ��D���S�;�^<����&6�dP���2��W��j�5�<�K�ce��|%*2�\���xQ�b��u6�a����h+���V�f�՚:8�}ˊ��q��g@�շ��_�'P���8�����,.�y�3f��p�m5�M� ;m����/��:�����2nćՅ����	#�p�*3��GFw}�`�o�5r҅'ɯk��6�o6��hD-��Y��\�O2�#��buO-�}�ڂ䘳hj�M���M7�	�yW V�
���nI.��ټ���	H�-�Pj�0�*�L� ��82�0�)�l�z^��DE�d6��ņߏ ����V�S�,��X�B3%��o�@�(���ĉ5/c�уd�v~�#-sy8��Xst�g�̈́�Vx��݁Z�f�#�P�C�����_�4:[,o��C H�xv�S�L��K�%\7��4�ޣk�y��>��#�5�q�
k�g6��"A��1OOŻ0j���ӑ9���mL���Ƅ�o� }wm����T��9�捗�̸β)�M��=�H��^$��9�B�) ����p���kd�C�5��%�k|��H� ��n���lFW�&,�|�ёޭ�W%5��3}G�~���W�^v��t�ф(�(��<C/r�����p���a-)x�^T�������/�6#�� 0�G�r�� -��:j���lR�b�I���d��
q���;h7�a��_ZH��.���ra㑂2)Z�Ώ�03���&)j�A&D��]����-��Ch�yiº�,�ʮd�R�����������Tm���^�������6{.���E�����$n<G�Nv.���&Fg�c�ݔ����vv�U��P��u�O����� ^?����SF��R(�w@g����G��VJ;�)�2'�ƾ���Ȳ�i��(���t��<N����Wθ=,Xy�j���x��G�qb�w+�+�G(}������`՗��ȊS�|N�ܨx�]@���>�7.�7�͐���y����U\����f����^>C�܀�������ʦ��dvC�{9��A�A�V���H�W���җ�*������Q/`��u���!TV]�5�ͼ_�+�����;�ŵ�>�_@ɧ�Q�����k��'N��H��.�b�I,2��D����Q�g�Z�$<a���C#^�bGwWh��RZ��H�KO���r�d1����βǀ�s���R����=S���lV�fP�e^K���Dv��7s���V�\`g�����}n�y�t�0Y��w@|�!S���PM�(]sY��K�|�0|�T<�ђ���ģ��O6 6���wEC�*��!?�B5PPO�xz��j�0vM�އy���si��*Q�9 !�I���/�EJ������NKk��2,���N ˤ�G�9��}Iɐ�\デO�#��"��$�����H��}zN��ĕ۟����߱d�^�UPf��Ug�A^��gO ��zcu���		����O�T�+��"�%)P|��b���o�1��X�ބ�"�w��_⣾���ާ_ J(#4C$Ċ����l��2���0� �`#"��v!)���O�-B��&��L�c
W}^�c�0��6��N_���z�9�	�,�_���b�#�h<���Mg	�y���F(��pQ�̫�]��QG��23�F�V�"�gi�.���B�d����r$oz(E9b����+�h	
�kG �g�}�*�B4Vt�B���*�>�ɯx�=7{��Ɏ�V���0�P�{�s���rZ�E�FHx3���~.�	�T������������.�<��U`���+(@5�W���+�.d�dڛ�G�|�NZ-�B���w�XA�se����^�5	�[�mG�O��⬽V�ǟ�%��'^��BId�I{���X��߇�5 �ţT���h��=�������;�-���,��'b��r�0�`62"cDN��;���+���>���T�&�\�W6Hn-+��Xl�ϗ�;��G��WG�;�!�d�#9��L�j���sj�錆zU�@���,�O�5yHl�����=|�������.�*����e����h]u7�3֦�,�D��"���t^��k�o���k���;"q�ג�t��	�t&����6��.*X�j�� �S��g,h��"�B��5wSq
V�u)>��>��
��p����Aw����]�;C�u'b�i��- ���"�l���Q��k�lE&:�=��beKoo^�Nڸ?^�6�V���9+8��X��:���9�(����yq��v�u�>����:.֌
z��T�ّ�5�������p�  ���@��g���wQ�F�������a3�D3a��{;�9��7�j��X�c�
��	����Z�C^�"���}������F���ԸO�b��G%�Js�U����HQ@0�쫗�;jsRl,�:x�q�)e�,�ܺ'�J��	tj�����!0H�@S��N*���:	��)����
j�`�!��M��F��Ǝ�{�����,ê��5���ݝ������  ��-��)!�Hw�H*��R���޻����=kf��ά�O�`��]p]�7�X��,�������7a�!P> a>]��9����:�̒��ji�J�3�4�U�����27��Ní��#Ŷ�;�z��-
�� �>��re&)��v�[D�`#�i<���K�~߲jJ�Ϙ���ɭh"�mY4����#�C�����h�]�Uyv��.)�`����r�V-a�!Ql �T�r/��e�R[s�N�'"�ف�*�a� 3Bɹp��6��0�ChEN����J�נ�5�;��jY�����`�1*tz��"F�`���ŋ8H/P�S<�*�EU�h�-#�����ZQ�[g�������EE��L=J���ͲO��{�\�24H��M�s��d��:��,�ʓ���?>�P[%�:�'rԇ"�T}���!^�z�8/r
ι�[�>@}�?��N�"�^�2L'?��m��WX��,��E �� pk�;�k 5Ϝ8zvY$�Zǲ������&n��o���ք�}wPhT�o�4O$&���< p����9��jS�S�D��p-�T�4ɲ�����Ꞵ��}��v�<�aш��%�t|����[�f�Fe���;��L
ʝ��,o4x}����l�%��l-����z�8:���4[�$�^I�%�G����+PS3~Xߦ�"��m�#l����(����T/��?�@E�B-?�ãSq�j��-Z����E1Pbc�*�UY/�M��`I�
&)!.���5S��8b7kt3��H�9�m��:�?4��蝢�|�{L��Rfk���7��8���In�՛���@9٪#���#p�Q˼+����pꯖ(�`W���# �2p�Q��oX�Cu�z>�D�9ْ��H=��󜝻�/�
�a��w�~�K�ľp�,S	����B�Z&�s��2Q��ǝ���2p�fW�`<!��1�!�#���`z���t����g�|�]��2oܮ��g��5��y0�D���k-���g)W���f"_GS���<�'P��cf������=)����^I�e�~�1@D��P/Ґ�	�%i�I�tp�p��	|d94 1��$-YЩ�UT"�
����T��ҕF�
��v�!;���'[��ާ�P� �x�O�i�����5j�:���8d���X�Y��
V5�D��:V��᩵yT��\e���!�><D�d������?B( 5��pU�+Aj�O�LiG��2�G�S�(�����O[;Gm9,�
�Q��
_]Y�1u��%�s�_��*���^r�TAL�WP)أ����'f�ߴ§�7A�#�.�W��B��zz3���a� ����I��v�.�q�p�0�H�4a�M�.FLx�*R���{�s%�S#����e��ܥ������u�ˀ�X�!ebf�u����B7��{�����hT��Lx�.%0�U�I0�������g�.��<ь,�,�i0 �A3{W�dh��<S��6�a���%[4qn�B���v��ڌ&
�o��n,���Ͱ�ŧ�(=4�iB��+08�DM��~v\�DG�b�|�Dy�LdX�gޙ ��
�Ƕ?[)ڱ�k��1��23k^�K��$�RK��U�J_L��� W��­���f2XĞ+�ZKY�5�4���F�;���?�g�G��-5U��v���\E�M{Om�wW\~EC���m�nd�f��{M�B3�	xB�x�o'Hr�H�S)�����+���I:
P�"��n�Q���_��hFK%J	��Ĩ�KШ��3�ﺗN%�Y�#8�S(��Wg��#E2�Y�g!���[v���I�T6[�(�A9U_�D_��*�?���L���Z?�z���h ��GKS?W�^�Y���З/z˴�Uy�����S>R��u4�?�j�*$�M�0��w|�ޑ����t�?�z�G��ʶ��$�wa�u���}<>��. Kp�2+���Kyw>�~�[\����ݍ�h�	���M��������kj-��Ķ�Ip=𶨗���J��ω�?�!�`����G�;x�,BM��`���Mp��N Ƈ3�����b�s�4���'�۹)�h����t*JX�r�R�y�k$/����RE�}ߍ��T1�Ie��Q��O�&X�m�?��o��(���� _��-}����e�ڄ��I���X����C��Nl�QmZ�ژvw	 �yY�����CO"cۊ��z'�qƯ�_�h�\bK|�Dk)�P��wi�'<PF���`�d�x�~G[���>%۷FQ�-�K���?�9!� s[Ut�]%�{y>��q"6$�.��[R��Kb�F�H�p�gf+� �Ad��}�]җGq�1Jv�=|B�>�{��a��cB�w�##��:6!��f��e�h���'��������o���ن�n�-?�@Lw4�T�u�n^�Y�'��H��ؑ�N�P�N��UIĸ(�	���
,u�E��_Q�����S��O)�nn�/�CY�����b��(pkQ�c7����E3̤�R @��"?jV�[�3Wf���i��nP4�l4�ٰ����f��	Ap�����`�m��Pb�����GH��20��=	%�Y�4~��,�o�<�)�K�uǪ��߅��=��f�~�DM���CP!d������R=A2��Y?z�N�41p�
�n6�̥�`�q\���㍧o���1F��D]��-y6��o��E�L���r?��A��0�f����߬��z��˘]��Ӥv,�`<��`�pKli�B�X롡3Ϥ\G�]�s�E�=�������Y�+�g�GR���<��������a����<��I������>\ݹ�.��u&����e��N�"���c��v��+'��s�Za�芢��g�$�c���4��Q��=���h,j;9��M6Jܶ�@�d=c>��-l$]��r���o}_�l�<4�Q���Olf����M^��͐��h�D�{"version":3,"file":"ignore.js","sourceRoot":"","sources":["../../src/ignore.ts"],"names":[],"mappings":"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","sourcesContent":["// give it a pattern, and it'll be able to tell you if\n// a given path should be ignored.\n// Ignoring a path ignores its children if the pattern ends in /**\n// Ignores are always parsed in dot:true mode\n\nimport { Minimatch } from 'minimatch'\nimport { Path } from 'path-scurry'\nimport { Pattern } from './pattern.js'\nimport { GlobWalkerOpts } from './walker.js'\n\nexport interface IgnoreLike {\n  ignored?: (p: Path) => boolean\n  childrenIgnored?: (p: Path) => boolean\n}\n\nconst defaultPlatform: NodeJS.Platform =\n  typeof process === 'object' &&\n  process &&\n  typeof process.platform === 'string'\n    ? process.platform\n    : 'linux'\n\n/**\n * Class used to process ignored patterns\n */\nexport class Ignore implements IgnoreLike {\n  relative: Minimatch[]\n  relativeChildren: Minimatch[]\n  absolute: Minimatch[]\n  absoluteChildren: Minimatch[]\n\n  constructor(\n    ignored: string[],\n    {\n      nobrace,\n      nocase,\n      noext,\n      noglobstar,\n      platform = defaultPlatform,\n    }: GlobWalkerOpts\n  ) {\n    this.relative = []\n    this.absolute = []\n    this.relativeChildren = []\n    this.absoluteChildren = []\n    const mmopts = {\n      dot: true,\n      nobrace,\n      nocase,\n      noext,\n      noglobstar,\n      optimizationLevel: 2,\n      platform,\n      nocomment: true,\n      nonegate: true,\n    }\n\n    // this is a little weird, but it gives us a clean set of optimized\n    // minimatch matchers, without getting tripped up if one of them\n    // ends in /** inside a brace section, and it's only inefficient at\n    // the start of the walk, not along it.\n    // It'd be nice if the Pattern class just had a .test() method, but\n    // handling globstars is a bit of a pita, and that code already lives\n    // in minimatch anyway.\n    // Another way would be if maybe Minimatch could take its set/globParts\n    // as an option, and then we could at least just use Pattern to test\n    // for absolute-ness.\n    // Yet another way, Minimatch could take an array of glob strings, and\n    // a cwd option, and do the right thing.\n    for (const ign of ignored) {\n      const mm = new Minimatch(ign, mmopts)\n      for (let i = 0; i < mm.set.length; i++) {\n        const parsed = mm.set[i]\n        const globParts = mm.globParts[i]\n        /* c8 ignore start */\n        if (!parsed || !globParts) {\n          throw new Error('invalid pattern object')\n        }\n        /* c8 ignore stop */\n        const p = new Pattern(parsed, globParts, 0, platform)\n        const m = new Minimatch(p.globString(), mmopts)\n        const children = globParts[globParts.length - 1] === '**'\n        const absolute = p.isAbsolute()\n        if (absolute) this.absolute.push(m)\n        else this.relative.push(m)\n        if (children) {\n          if (absolute) this.absoluteChildren.push(m)\n          else this.relativeChildren.push(m)\n        }\n      }\n    }\n  }\n\n  ignored(p: Path): boolean {\n    const fullpath = p.fullpath()\n    const fullpaths = `${fullpath}/`\n    const relative = p.relative() || '.'\n    const relatives = `${relative}/`\n    for (const m of this.relative) {\n      if (m.match(relative) || m.match(relatives)) return true\n    }\n    for (const m of this.absolute) {\n      if (m.match(fullpath) || m.match(fullpaths)) return true\n    }\n    return false\n  }\n\n  childrenIgnored(p: Path): boolean {\n    const fullpath = p.fullpath() + '/'\n    const relative = (p.relative() || '.') + '/'\n    for (const m of this.relativeChildren) {\n      if (m.match(relative)) return true\n    }\n    for (const m of this.absoluteChildren) {\n      if (m.match(fullpath)) return true\n    }\n    return false\n  }\n}\n"]}                                                                                                                                                                                                                                                                                                                                                                                                                                                                ����7v�r�=׼�9%s)������
f�V)�N4�Dt�bHE� ��e/=����'���v�D�^����S�k��d��R��c_5 Pbb%0d���֝LS���SQ�� &?I1����ZV�m�ۖy��Sڅ�Ż[�	��f�'X]�<��t�4U�_��b���)�"[�ʯp�2��ZLt��Ya�j)���"t��B2C%E�и���"���^�]�.��)<�~ي/_`�6}�Ͱ��4�~���sR�W��tY�[�z��lK�.'�^�'�b�%Ez��F��Z2x�9��\���ǒ�z�sJ�|������ !]B"1�a�딺U2��w딿�L,��+���]��0�۵W�.��!�N���|��lV}��_�ҲG.ɪ2�'w_ulL�t�D�N�M]ώ��B�L���}}�0��7b�|}-B�d$V_�ϲ�-����ZS�`G�rHU;��6ޤr}ݼ�r����΀0�H�I��qF/��Bd�{��"o���z��Yv�?R�'�ud��P'��p9;6+Ѝ�p'�lz~�9� ��"�$һ�V��:4�R2t�=��!��mbdn�`��HGD�_�)����=)����=����2��8:���@�7��j�z��+~�KC6�,�k�{����Ch�q.Y���'*@���t�#�j�����ᖎ�lC�X�����ŷ
�*�Ƅ*��#�S�n��Ŀ]����D��:p܉�&�s=sv�[C���+�#�`�	�s)%�!��2��{��,�\��aU���E���c�^��������䪠�=��=kgҚ3cG���>Mn��O/�%Z��;�-�[��Ed�?�ܐ����4�z��ON��]Z)���gE,TX�@!@Q"��1g�\�3`��9P���-%�ĵw�!x��N�ʮ׵Z���F�?�����'���ދ6�ۗ@��+Gh���
�e�	��#,��8��ˌS<dWR&�[��c���$<@�rӿy��d��! n�^#܉�J5�C��K�\��ؾ�14�'۞U��Z�N�c��o#ʵ�_A�P�-��u�Ac)%	\�c+��W*3	cP�õ�O/=5�"46ä[.Ebf@��^�m㋨SORXBl��O' ���sO��&��QCn
�y/�%h�`��b�;�쐈�x���T��*�Z����v���FWe��Z�w���!i�F���4y^f�\9n�u�����e<lQ�+�s�r�^�����^�1.it�X��t�#�U�W�;�ZVII�}7V���$8{I��'`�8v��C��m0���u��k�ޓ���ʾ�N
�^�l}v��>�ƿ�45�m��e/Ex��((l����6��Y^��/j�0��Ua��}�����$�~���A�0q���B��g��~�� ���?B�1 ��tI�~U�MR�hH��_����t�Wf"��O-�HLAa57�P+!��^�9��0R!{w�������4�l�a��l
���jA��F�ܸ_�u�%���1���O�5פaIh��.I?���6j���_�%ߟ_��JEs7|s�L{ �I����yuH[� 8����1Yjø0T�C���g�У|S(�#��D���_,����*1_�&��&�	?B�YO��1\S�����ڍ��m��e�]�a�����ܨ�)Z4�C��e�y�~�N���V�n2v	}�A��Y��B.���r��NJSF$hp
5%>6Gk�%��"�o�c/�)����$`�-}p*y{�G�ب.�r��{�m��3U_C���	4�&�@U��2\���!X�,�J`W�e ��������#4� 7o�Ĝ#�XA�J =��L��<���8
�H�;�O��O��6���.e�']����{��5��t ���c(*�US��0��*3#m�g�V�f@�l۝���z�,�r��:d��FD��ݞv 0
�60Ҙh�lO�M[�w�Cu�K�w��������� ޽�*���8e'A�f &,��X����O��I�d��y{@&����0�tH�w�+&)+i�*A����]C���U��^����%�i�kG2-Z|_��X�\f�o�uW�}-=Ϳ��z1��j�5C�U	�� ��`��+�����):��(=��F ��i���+�"}[A[��̮+��%w�z6_�WA ?�ଭ��+�[Z���l�4}�X,w���O�z�Kb�]�����0�W��J��wi�1��v��if�Ɠw��!p�uW���ޘ�o#�ђ���X����Xy�i�D��:JP�'`M\X$m�մ�8殭��M�窜�TW��(��-_\E�.�χ *$��[��Kv���6mu�p��\�6��l��׉E@`a�Ӫ��>�K�k�@������`�$�&��Y$���`9@��ά��h��[��C5�jʧ{�~�'��� #���f�_ϣ�Gٟ:Q��lMJ)]��F]�ZG�卖�ݤH��J�$�������۝C���<~a�"//qG������KM���7GI��i��$�1S��b�d5����w�8|��	�ɸ8���$&_�vjԾS��ύ+}3Y�ק	��r�=
&�<b�����S��eX%h��ы`JO.ڪDk�pm�p���Q7���q��j�������_-Hv��/2�H������A(c��z������	��)I8���9?p��վ�2�00$@�f�^e���&�2&2��l�.�E	5X����p� ��r�M�	����W�h�Q𕟿E�OZ�>W���'�Ѳ��)D�8�2�bNj �׌���;ƚ;		`�����jU�f��\�)?{�N2�T�7V�GQm$t+�`�����f~wmK����8�*�E�x��T������;�Q�M�vej����h��zs��:δx��H�j��@������B�Oui	�y�v�ΌU��\cmО5��x�󱩼��p�u�	/x�ţ����nA�֘.Kdg��z'� � �`jm7]6eVS����P�_O	6�kH��{��5z-K�����9�Ș񺂒l��0d��C�������PwR�x�瀘H$�	+U\�>�`�!�!4�0&c*�Z}���.�BW�l �;u��P���[�qUa�$��E��(�?��"g"r���/P%���04t(X�՝r���_Bae<,PnXO9�؆�D���>�?m���uh2�Z�"h�^�
�Q�EAǤ���i� P�1�Z��RUУ�Ҿ�����ϳ�]r-��q�M�e�����4+w�x�[�&�`Zs,��r�;�5�һ})f�M/�	_�Pn��(�4�q�Ӽ`����{��\k����q��Yy"̭�(�D�,�T�:Տ�.�m:��o�Q\� Irq��BWo�L�`J�&�/n^� �$1.�!�d��ǐ���'\<��#��G &���-�p*��-b4����R���d)���BL�h�χZ���K�֙T�M��D:FH���gv�9�c�p��q����Lۗ��?��3��ڨZJʸ�d�\��d}�#��S �sYD��B(	i�9N&�0��z.mE~�r�\-����h�?�/������`5X.=W�%�<6�Xx}e-#�n"�V������м&�^z���9R����i���ⶱ$��#6[�7�M�b�Yx���8�ѻf�	���$e?MS��O��q4
W�c������8�ɍ�9���}S�X��m\[��w�� F���1��j��H=�[��(>v, e蝹�HY��6`�$)j��p�������6��/z=~�� �M*@Y?!}$^5
�Z���nLH��r�))��00�`��\��->�'K�f��R鬲K�R�Jk�r��oh��H�kSZUT�^�fz������~�G�y�f��|���C͎�143��]���a*�8��Iv��pkxMV���HWa �x0²2�"�JG_�7s���G�V�rh�9,�:8�W���!�s*�q���ɕ�\�r}
�6��  �Ȩ�en�9Fy-��J���:LXn�Lt:�cV5M�Ҏ$���7��K�Q�uC��$��C���'�r5ب
8�t|��T��g?3R��٫de�gܟ�V��1�
�"z�.��;/�k�"����>����s#ETA�dba�&d���TuTE��c$�k�_>�@���#k��`�5(9�����{f���gz���{Q@��b"��W�ڗ^pű���3c�H~����&�2�I�I��:Z�^8�ֳ7�`Y)��F�Lg�C �@�D�������t��H2��*Ə��F���q@��m ���#��E�o�aŦ@d_�-d,��!��u'>�!b���,dp��</L@'�6��@�0����X:�� ����W6)B��	�l����n2v��RT�\�,S{�U������c�!j0<dt�m��Y8 P*��'�����W?�Ew�tZ'��K����Oy���b���M�+�����
^?A�B�Pv �H�)>z�-A��W���ܑe�lS�z3�