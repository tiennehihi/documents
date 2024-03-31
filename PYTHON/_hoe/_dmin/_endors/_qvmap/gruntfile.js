ency>|<semitones>|<percentage>]]",
    	"voice-rate": "[normal|x-slow|slow|medium|fast|x-fast]||<percentage>",
    	"voice-stress": "normal|strong|moderate|none|reduced",
    	"voice-volume": "silent|[[x-soft|soft|medium|loud|x-loud]||<decibel>]"
    };
    var defaultSyntax = {
    	generic: generic$1,
    	types: types,
    	properties: properties$1
    };

    var defaultSyntax$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        generic: generic$1,
        types: types,
        properties: properties$1,
        'default': defaultSyntax
    });

    var cmpChar$3 = tokenizer.cmpChar;
    var i