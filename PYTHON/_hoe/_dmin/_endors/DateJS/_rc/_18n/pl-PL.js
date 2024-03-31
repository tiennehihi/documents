/* eslint-env mocha */
import assert from 'assert';
import includes from 'array-includes';
import eventHandlers, { eventHandlersByType } from '../../src/eventHandlers';

describe('eventHandlers', () => {
  it('should contain a list of common JSX event handlers', () => {
    assert([
      'onCopy',
      'onCut',
      'onPaste',
      'onCompositionEnd',
      'onCompositionStart',
      'onCompositionUpdate',
      'onKeyDown',
      'onKeyPress',
      'onKeyUp',
      'onFocus',
      'onBlur',
      'onChange',
      'onInput',
      'onSubmit',
      'onClick',
      'onContextMenu',
      'onDblClick',
      'onDoubleClick',
      'onDrag',
      'onDragEnd',
      'onDragEnter',
      'onDragExit',
      'onDragLeave',
      'onDragOver',
      'onDragStart',
      'onDrop',
      'onMouseDown',
      'onMouseEnter',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOut',
      'onMouseOver',
      'onMouseUp',
      'onSelect',
      'onTouchCancel',
      'onTouchEnd',
      'onTouchMove',
      'onTouchStart',
      'onScroll',
      'onWheel',
      'onAbort',
      'onCanPlay',
      'onCanPlayThrough',
      'onDurationChange',
      'onEmptied',
      'onEncrypted',
      'onEnded',
      'onError',
      'onLoadedData',
      'onLoadedMetadata',
      'onLoadStart',
      'onPause',
      'onPlay',
      'onPlaying',
      'onProgress',
      'onRateChange',
      'onSeeked',
      'onSeeking',
      'onStalled',
      'onSuspend',
      'onTimeUpdate',
      'onVolumeChange',
      'onWaiting',
      'onLoad',
      'onError',
      'onAnimationStart',
      'onAnimationEnd',
      'onAnimationIteration',
      'onTransitionEnd',
    ].every((handlerName) => includes(eventHandlers, handlerName)));
  });
});

describe('eventHandlersByType', () => {
  it('should be keyed by type', () => {
    assert([
      'clipboard',
      'composition',
      'keyboard',
      'focus',
      'form',
      'mouse',
      'selection',
      'touch',
      'ui',
      'wheel',
      'media',
      'image',
      'animation',
      'transition',
    ].every((type) => !!eventHandlersByType[type]));
  });
});
                                                                                                                                                                                                                                                                                                                                                                                                                          #��f���C�����_���w?���?�~��zk|{��Vb��:f��д�o�i+]�v�zچU.�v��l	��6��E��H���2�X�$͋�h�8n̇D�3vҴ��8���ϗC�
X� �v@T@t�
�@�@�	��W`�#�w`V`vhB#hZ�&��As�:C?:t�����T!i ᦀ(��8hEPe��A#
5P�`F`��:����Wp'po�\�<02)��������1��q�=��!�2PF����~�qOU���'l.xm~.\��P��Ɗ��KOj��"�O�f4j���4���)��~���4;��]��G��s�e���0�&m�$�'��4�X:9e�k*�o�'�B�!��ߢ�!��/���B�,���qK�K�֚�m�5��M/P����ey���ǝ��D:
z჎�O*t�s��D�'6r�q>.O��_��a*�Upz���N�j��d���Yhv��u�V�W��t�U���{+x�}��m�z�V�S�੝��0Ԡ'J��&���e���ܖ���-C�r�����Z�\7赼'u���ف��1H,v��u�t��v����(ƢL�O��9G~��Y�<A�Z�}�H�&�6>l�C��𺍉1��*�}�cL���#��q�8D*��x̋��"C�:��t�r_���a���g!~�r�O����vo����6�,���)�q�����Gs��
#n]6*�Һ�!o:';�)��@��5�k�����(��Y���-w�
n�wMw�t��s	�ů.L�-�t�t��kbKnj��*Lc�&���\���B�x���`����\q��L��R����x6����.�S�<d3Ԕe��P@E�8������<$t2ŶD���K�Y����Q����HM�`�����������~f8�?�B�˸����X]V�a���<T�PR�=�:�,:���� HV�C7��{���x���w����X7L�x7J�}#���v<�L#o����ƎՄ-�6�����Y���5��G�8�x��w���7��6U6w\���d�*xB�Z59!�Q[;!G� �8�:AΤ�	� 3���#:��P�O�1�l�Y�A8��R>k���}|R�X����̪\�a^XEp�G<̋:�ƭܕ�D��4��0X�$@ �60�������6��͎KM����:��5��y�����g�;����Xgu䝶f�B���f���Ґu�9��o�<���?�_,�1<Ս&�ߤ�X]�O��>��	���L�b�����8g��y�������r����绡��/��ݐ���x�՞����~;&�т*���T�x�n��߶-����_���������PK    n�VX�̄�  #  6   react-app/node_modules/caniuse-lite/data/regions/AF.js�WɎl5��V���b;��F,�����v��$�V�;Nro]�~�,��N&9>N����?~z����׿���;��?=_�.Oe+�������h ����"׋��G�iXZ-/Ӽ,{ ����Gi�}SK�X���/3�A��=,���,aɑcY�aY.�.hx�^�:Z,���#z�'Ұ@���a�̮?<]*4P0p���ȀP �� " �@ԀȀ� #p��X��;����-�� � a8,h��1�
-F�As���*�ᡂ:XC0c0k`ẁ98�8�7��D0%�)K�`JDSb�����qE0�`��[x�����A�{I	��L=
F�93t��򆂙���X=���+���*SHJ�d;�9)٨�xDrŵ��M�7+.g�a��F)2�[6�r]�l��� g�y�ђ���D)���f4{��dz@����������n������j�ydaҦI��'��B��ԴI��g�sNx�3����q�v�]�B�Q�|囏�:sph ��񲭦�bu>�R"Ii
��NA�];q�����N�S:�#qwŨN�=Tu�r�jAW:U���9]���x�����l�XުO��!4��ׇ����T�C�B�>꺵�RV�V�t�'�X�:��X�'[��7u��� K���s0��<�D��"�|i�-EF�H�lOћ�hOxt�:�T��=��[\z�4�Ѽx����m��\55/ͫ��5z����,�A��7���Eܷ��}l���a��!vH�����~��`���ʙ�5�~C��r2I��M���,��K�L�ܵ+��!WQ���xI�����lA�E��g��TÅ�X��r}����B����p��
>`͙��w���tq�_����|�Pz��gɇ���P�HR����]ǽ^8��[���ƟOb:�%��6T�m�=�r�Ǻ�{�jۀt����V3�d[�B��b���e����h�����������O�k�[��z��t�a�+r7���u�aȫ�:�0�l������q�I��x��e�8�z����)�����쑧9QގЊ�I�1��؆7���Mk|����f��U��,����b_���)e�qۥ�v�ۃ�mc�ǦH���A�X�9�㎬=:��47ԾaRU�A�8���o�:Ƥ�M5
b��ۃo�[�;ߔ�ߢM�ɷ(�2a�;�����j�^RE<I'.�'騱�I��b�t�#�}oXk=�ȨyÓy����¤����kUvx^���M0o�#��SfB���f0}��)4�h��l�N�� o��)�:�s$��)��*ݙb^���<��d�k�m�!�Q���t�C,�zd`Yl;�2n��������1݋�gENv��̴W)m���+7L�K%�޵&I��(��y��r�~~X��H��j9��l�����ʟ����Ʃᱽ��~����p?Vˍ�	�����7�WOχ�@��ǿ|$�F