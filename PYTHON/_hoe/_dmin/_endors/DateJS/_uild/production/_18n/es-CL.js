/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import {logger} from 'workbox-core/_private/logger.js';
import {isSupported} from './isSupported.js';
import './_version.js';

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope;

/**
 * If the browser supports Navigation Preload, then this will enable it.
 *
 * @param {string} [headerValue] Optionally, allows developers to
 * [override](https://developers.google.com/web/updates/2017/02/navigation-preload#changing_the_header)
 * the value of the `Service-Worker-Navigation-Preload` header which will be
 * sent to the server when making the navigation request.
 *
 * @memberof workbox-navigation-preload
 */
function enable(headerValue?: string): void {
  if (isSupported()) {
    self.addEventListener('activate', (event: ExtendableEvent) => {
      event.waitUntil(
        self.registration.navigationPreload.enable().then(() => {
          // Defaults to Service-Worker-Navigation-Preload: true if not set.
          if (headerValue) {
            void self.registration.navigationPreload.setHeaderValue(
              headerValue,
            );
          }

          if (process.env.NODE_ENV !== 'production') {
            logger.log(`Navigation preload is enabled.`);
          }
        }),
      );
    });
  } else {
    if (process.env.NODE_ENV !== 'production') {
      logger.log(`Navigation preload is not supported in this browser.`);
    }
  }
}

export {enable};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                	^���/M�h��&xi�N�4A�	^�M��b��)F�0��>��?^]�t^��o��^o��2�_���h>oB�n���ܠ@�N���g~LҘ����O���|-�T��k���^�b�����'�&�c
i��I��c����C%.���U?k�o
����i��h�;��ff\!��I���E��E/���h��P���MX���d�9�Q��k3��'.S�+YwѨ��������v���8kV��F��ε7
������d���[3Zow�r:�Q-��n�go0��=���4:'ٿ��l+[D��G��n���E�!Ce�9w9h���Ux{�����MwtϽ,�NF�9�"��<���y%��1EF�/L�Zɸ��xg{����<����(�e�pev�U�P��G~�q3j$����SW"5��_�����h�^:��U}¢�;����}E$�s�`�#�5�!#�O���W�}����'�@8�����V��
��	��b#���j�A�f��ԋ�;����^�.���}�ի�`&z�V{���u18���.�9�����\���YF��֌V�\�7Z_gB�V{alY�1tG@�Ⱦ�1��Us��v};��pW	�h���J�E�kRWm����ho���fe���.CF:}Rg][�Yזugen��v�F�����/!��MҸ�4�ԝjWTw��ε�M����e�t�}:�h6PG٦M�����p`M��[�@���ϑ�c�d(q*z�49"C�)�/Hh��',3`=�7��Ŵݭ�f��	���"�⃠F4)�szC��$�UZ�bij��33^�4�t��?���I���Ѣi0�Rp��֪~v�� ˒9�w�gEZ���K���u.ilIZ炒�e�7�΍Z����7�����N���#@w>�u>���v\�W<��Du�6�in�?H���'"�Ix{��u�´FrFb�OL�Dj���;���>��rY��ƴ����^�|�L�3��j�/���ob]DW����iPn�4,�ã��*���DD"&ݔZl��^9~�"��=�����k���jN���H�A ���9I��g�c2�(6%�s�*9ȓ&�A�Bc�RP�צ�%��ǒ�"�7��R�5�^���֊��]|I���N}��C3 �#�.+x����\�iFQ"cF�&-�g)��}a�.)u�	�s���{[:�ՆLx������-�i�1�uhLZ��,|�)zE۲������VN���%9x�	�����.H{�98mi�����P�4_��[\�C�js3��j�Z��n��Ŝ�Y��)�r��E���N3'"�j�oߎ�CoK�y��%N#;�4��~/�-"Urb;�ߒ�dr���Ar�D#�G
`�Zo`��@;ʕ����f�w{��B��>zR��wl���V���t���ױ5�ؓ�\�������|�lm 8bh���AEShx\�ـ�N�qn@��ɟihRД������I��D;�$�x���g�z�N�R��3FYu���Wo�;'��9,N��%��gd�Bŭ��6i�?(��9c^�[��e,m��NE��wP��WͶ����3�J=��Kڛm��d�#�����Z�A���OEt'�;Lq4�}o��ɘw:Ux9��a�lпY���]�5��M܎��3"�&GZ�Ez��Jk�w14�d���"��r���&vEF[�f+ѷC��<y��|m�!9."��)I���n#�,��h����� ��z=����,�	<��Q,��{=A��q<k{[��Ꜵ/������e�(��6�����i�>M��֟	��o3�g�3�
/����cS.襡���w��v�O4�7��Z�W�����3�ƣ��F��Гn��M��v�O�f�		��#��߅�no�r793�b�P,ey������@T��H��'�
���|R+?#a�Y �����8���O�u�ߡ=Y�1Ys`]����e;)��E�u�^�j�d�c����̤+)�Ɖ�j���<e9��+�����qpby����Uli���S�q�b��{y_�c��z�LV���V@m�>���aCP�H�4_�ZJu�-��yF�V�y7�7�e">}��<���s#�]�o�Z�j�.�2��G�S�BX�Zځ���^�RYj�;�#�D�#��Ԋ�lDLd\/��=1�~�ի^�x��Uw5��(���֍H�w iw�Ҳ�_�
D3�f?#k/������l����^^�"�,~n��lƌ�ṗ4o��h��Ǵ2�%��Po��|y�E��4i^f��hoV����N`��}������_v���R���f%] ~�@S>�m�|!e`�'Ei�'W|�O�gm���&���:>�t�վ��������/�bD�A$Gl�@�i9��C�<k�p������\�P�RR����ң�@�"Zp}����gCM��bt�0�fB
ou/� �����lr;wDE/Շ��!�������趙��(=���&����bm�n�ޙ�X��[L����c�d l�y�AMk��VE8:��-�%[r&3��(�+ /�.Y�I�!z%d	�>���Q�<5���^�[h��������dg����ą!����!ጉ_si�J����F^f[\����b�f�q#�iN˂�ΐ��D���] ����4Uhk+>��.��7D�!�?]�v���%#�.���!"mo7oK8���)���ǌ�{]�[Պb3j{r�k�	}���_���k���Z�i4*~�Y��}���~*79�������G}�����8�]9!��n��u��*��h��)������&Ȓ�?�={洖�3B�ُ�V��E���Acm�m�X�����Ĳ��I�EO�ѣ�uf���J�g䮄6��N�-k�֪�Aai#=�~������_��8F�dFO�����v���o��r	�a���Y��2#A0#�T����A��j.@��������.�c��![�;�-���C�p�0�ͷ��'RY�:����:2k���=����w�� �稰�R$��2�ﶬ�������&�v%VW�ル�)��.h<�����`�M����%�}�s�~k�Y>us�u���h���%�H^�f�8��{4m���E��M���6}�v�L��*"7s����[1t��A����;�0�!�3n��q�Ld&�Ɲu�
�<��Ξ���u�F�Kv��:_��͛Y�aV��	�s�b�MW���BH�AM�����ݛ�o���o�m�=��`�������E��J�~�GRȑ�̈A���1�K�P�B�e���t{f
a��6'
};���4����}���9�-�[a�s�Q����!�����e�)�N�K"P߽t�y��F4*Nw/v�5�ښ%FV��I��Y���z��v%̦�я��QX�qG�$u�6�`��K���N��碖kk���h�ݎ���@���*؁b
�Y�w�E|��Y|�7�B��ȫ��SRӞ�颏�ڴ