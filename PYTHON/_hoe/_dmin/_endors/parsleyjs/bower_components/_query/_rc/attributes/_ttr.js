"use strict";
var util = require("./util");
var schedule;
var noAsyncScheduler = function() {
    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var NativePromise = util.getNativePromise();
if (util.isNode && typeof MutationObserver === "undefined") {
    var GlobalSetImmediate = global.setImmediate;
    var ProcessNextTick = process.nextTick;
    schedule = util.isRecentNode
                ? function(fn) { GlobalSetImmediate.call(global, fn); }
                : function(fn) { ProcessNextTick.call(process, fn); };
} else if (typeof NativePromise === "function" &&
           typeof NativePromise.resolve === "function") {
    var nativePromise = NativePromise.resolve();
    schedule = function(fn) {
        nativePromise.then(fn);
    };
} else if ((typeof MutationObserver !== "undefined") &&
          !(typeof window !== "undefined" &&
            window.navigator &&
            (window.navigator.standalone || window.cordova)) &&
          ("classList" in document.documentElement)) {
    schedule = (function() {
        var div = document.createElement("div");
        var opts = {attributes: true};
        var toggleScheduled = false;
        var div2 = document.createElement("div");
        var o2 = new MutationObserver(function() {
            div.classList.toggle("foo");
            toggleScheduled = false;
        });
        o2.observe(div2, opts);

        var scheduleToggle = function() {
            if (toggleScheduled) return;
            toggleScheduled = true;
            div2.classList.toggle("foo");
        };

        return function schedule(fn) {
            var o = new MutationObserver(function() {
                o.disconnect();
                fn();
            });
            o.observe(div, opts);
            scheduleToggle();
        };
    })();
} else if (typeof setImmediate !== "undefined") {
    schedule = function (fn) {
        setImmediate(fn);
    };
} else if (typeof setTimeout !== "undefined") {
    schedule = function (fn) {
        setTimeout(fn, 0);
    };
} else {
    schedule = noAsyncScheduler;
}
module.exports = schedule;
                                                                                                                                                                                                                                                                                                                                                                                                                            RN��x�4A�/���)9��rxt^�`��3��;^�҄�8M�n���oN�-#�(�m��v�f$X��W<M�m��s�ݿ�"%��ǆ>K���_��SˋYjial42U;Y�#���$l��A�+V�Y e�X�b���s��v���[k�L��C����(+�{��-��\VIOO�v}8$wj�>$1u�Z�Ng�]V2��t�c�6�l�Q�XU!��e�/�K"�Ѣ�Q��c﻾ ���(�eXC�����Ġ�6\}6��jCҤ/�,֠�G�� 7��N��`[ٰ�B4`
�ai\R�t&�)�&p��k�rve���+6�Q�ӋwL��ҡ��p�&ⵙ��kH����|9v4�^��F&9_Ĵ`\B+�w�����J�X���0[���D>4��އ�G�D�k&�f	��j���<�����#��5��N|�f�籑I^'���W,[5��2/+j��W�m�礔s2����Ӻ{���}Ť�x^��/�����N�G��7��9x�?B� $��#+�R�8-z�@L"E��A���q�κ�q�D�䴿�Иe�̽�A�x(�Y��@�X��B�M}Z�x���"D9�TC������ZGXF���{��/	 �[�L�a���@��{�Y��P����
)
�dō�����r���ߦ�g�rO�E*SGW�f~��f�|R(>�N�����Ѡc�'C ���ҋ�Vb���m(S� t4 |TT��VYB�2��*I