/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));
                                                                                                                                                                                                                                                                                                                                                                                                                                                     �^j����%_ގ��2�K�ς6��qJƗ6k��X�J{����,�,�v5�^�F�'�w9��vT^�_��	ٺ����3�|�El���*|�̟[��h
�=+�@*
�M)���e�%�bXęl��v$��Է~�e����JǕ{O4�T>�������p�5�μ�[��5�����ɛ���־*��#UQj�V��:��Ez,v�֦��G�M��uQYV��oso����V6�$H�Y
��",�޿n
[�>��^���E*̛��+�%O�kZ�7��d�SK$���eR'�q�)i�f�e�D
kH�`�����*�����?A��ZF�C����{�P���م�l����{����v�cOZA�|�.��#�����k���	��΢>�O�����R�T�A�si�mq�O�T���'|�9%�߈�:�dT7�.l+��6�`B.�C�	P�8H<ٓ��M8�l���aP�$hb�x��B�=�e�ow��ߗ����# ������ȍ�uc��)#��üڬO
ɡ��ˎy�HJ��X��=7B��nkH�^�<lK��r���.��߻<�vvV6;��N��[��ɜ�uF�/��HuF~��o^8�zoF��1�x�j���w�͗�ЧZ�U����a��4��tJ֝�?���T����7u��c�GŐF�,AΰH�T"�e�&"K`G��^]�(�kCK,�����.z�ndɢ�����1���i�}�eS�ĺ�5ruB1��/漭ɢ�R�yۘ�*ߍ��r�3���� Z0p/��x��R��5&"w�MXتV{&v�D\0��� #W�*/�6���q��>u�:e��hI��Uz%�~Y�F�.�7Ȕ3�k���gw���j��.�{������i���n}�<=���PW��e��(J�����t׀����H� /e؀]vHQ݋�`�8l��+p���_׭%޻�p��QW��Ϙt&�.�.�{�Z]1s��+�����?�.��R�l|�M��W�٪�=��n���V�6����$q-�Z���יwB���w&��tw������d�L��)	��e�O�<�X�?��l�%�z�P_�x�Z��s�A�rT��W	3p���xሥS�1>R E/����xo�_�ޤ����W^7@P#���	����Vxx�M��1�%?1Pŀ����x��l�ې�����׽T�Q���4�#Wm��s�Jϵ�G�[�����u���BBJ3���m�K��')�������z���T��tn�6��̜��A�_F��|a�op�w��-w�Kq�������]�[K�;/P��N[(T�����Y������\3��=��Z�8N�髵l�Hu���G�K���_ʰ22\`�o���U��$yLR���}]=��]�Z<��I=U�^�J�^�2G�f� �aih�;�L|C�q�Y=<������M8�2����(�@tP��@}�f3�*Iu��dY'���A�{�����*��Q�"�}5�M��;z4[�{��Y����K���tQ[/�&�G ���8�+��C^O׎��@7����PW�:���)���K!��e�4~�89@"zk����=�:�N/��C�}
H�b��\?&��=�/ɫ��G괠�������
c{�/�,,%M6�O�1����ƫ��>�1����\{[E�X��=��*=�ԧ���0�����q�^�?��my����W�����%��ͬ���L���Dܰ֜˂2�����(�G윬�ǲ�X�Ps��)7(E_�;�Pz͝gGFC�J`�n�$H�O&k�<����d�09b�~���U=o���-����0!D��MCBj���v��&���bm�g����]�Ny��v��ز��/��A4q$��s�FD2�X�Z�_L[��������,L��<��؍��q��3;������*��7ͧ-y�l�h���>D�����\ ����K�Fl�IM�Y{��@ܣt�{/(5��\�\+��?y������j��ŭ��3$t�x��3�""�����i�bu�:4�7�&]�gc�x��Y�K�B,3��2�.����
o�ݒ�����jU*�f�/�ël���tH�Mam���Sg��Ր��
/��bV&�z6cL��[�j#�&�<R�%�S�4�7F>��{Y;d�=�1�X��O����J�R�F�X��Jy8A�
k���!��c�#��Q�"O���DJ��輖��c��?r��-=�!�%�b��>eH�:�ѥ�Nsθ���vR��D0̑AHi(�O6�\�=}�L�W��
�MǇ:[)�!��z�
��Cd�k�Oۮ�X�.Z�S�,/S�Tz]k&;��ў]�>��n�C�g�$#��F�3��٧� (�f�C}�@ή�g�������AAq���r�k�	������oDE)�/J���I�RC�6���*�TSU_��j��ժb�;��[\�ȹ#��[&�Er�^Gn�&�֯m����LR	莍�+�#f���CRr��/;�V�(��"�������GcE��9�vm/h���
����(F)6��م!���r��O��f�uZ�_R�Y�N��,y��~��na�/�	?�e�z�l�d�&����fVo��Ԟ��Z�I���lsW���u��n@[q��k���T�O&U�R�9��U�ۖL��h���f�2`˭ ����<d���^������W(�e�<���M�M��O�a����[�ZLN�d���2�����,B@*���E��ySp��)��vB.9��4�.0G�΢U:a�V�gr�n{P�1���JHʗ"5tq��ha2%eq,T��7,Z�E&|y�}.�Ԑ���@��`x����v,b�j����S�@:�o�^�&�8\)�Z�(28�UFmL;��������NN>3�}����
�]�Oz7��񽻔��^��4yg�Ӕ������ϒ� )		�2��&J�2��[0#t��(��d�GTl�c	��:�l@C6ܚc�a�`�����mA{�~sMB�zM\�O�<q�t��i�Mۤ=b��K�����F�ݪmc*��&�2��j��M���3�m�!E�*?��cN;�e���nO�s�NVO�tvw"�<�K�R���|������_=G��
�IU,)B��v��$��^Ѯ�PȾ'�*ӥ�����dM�o�r��2=��P������}|&�f2�}6d:k`4����IH ��9���L�1��5j� ��G�4���S*ȹ��"p+���ё���Sϰ��y�����l��~�v]HGQX��Z(�D ��@ra�&�x�nV��*}�}�?�k�#�^��G�@�ⱘ�������RT�,����m�D�ٍ�H�B.�:v׷���˃�|4���`���=򙭍=�P�꧴�N/�ES},��X�tЊ�닲����o�0�t5��C����wo�y���_��/����sD��>_b����z�M��75=�?W*�<��"�rq����\X�]��M���k�f���A����h*e�bvW�T��Z5 bRA��� ��Jf=p���_�~�6_!���}��080
˼�*�lŌ �K� mexW���5�Q�*�`q����96�����M�Z>�v���J����b�:�o]~3��l�+sq�|��g���|�����'����}#��qin���>��)'�s0�і�r�T����� ���o���Ml:���zVD|������(,r����_A�Ӕ�������R�����^����Nձ}�|�6;��{O�n�I�� $ ݱ�}�={^-ר`f�_�e�N��̞Y�j�iwE=Ǝ�B�fM�fU�w
h&�Z��Ym��u�9Es�zg�����U9?3�_��,�����K��w9�q�2����W��_��|M��@)�T�Uir��s�T����[S����Īp%j������p�E�p�6u��ts:d��_�{I	��W?m2U��Us���-�Uf1���gXv�����		9�W�8���$���q��W�O���$M=�+����MQc�"����/�'�Ƌ���>���Y!�[
�Ȥ�h�qy�0�K�̨sr�Ǉ'�)��(����_h�Fsrҷ	��^h�L������y!v4Z�n�����"�� Hb��l⽢}�ħ����0¸Ej�8�#x$����ժ��[�����kS������(����%�M�!AyV	�E�~�0�=C*�M�)�Wt'��i�_}S���ϮA�$�l͙�Y�6�˷�0���mF&�5���o��P
�Sc�~��+���q�t��Z
�t�oZ�חǦ�vk�%^��\׾�~Y�4�҃�U�������3#���o73�g(-M��i��\/�u�画�p*��L��I��j� ��E����ds�V-�Y��#��7��W����|i^�xifN���zy*/1"���ݎ��ݼ�L>j���=B-՘l��I)}�6�b9�n�U:w�m��^|yo�C��䆅������K����uu�hX�~��x�i8��K��cPo��|��Fd\\� ����%��빱 1_�ժDi�8&?)+n-�$���2� ,�f\NT�8h5��$2�0׫q	t�>&^��a�^(��\Ô��{Pz?���#8�M)8�A���x8��z_�]�Œ�����f���$�B��X�$����2�چ�8�	��]]�"�`Kv��9F