s[i + 1]);
    // canonicalize zero representation
    while(hex[0] === '0' && hex !== '0') {
      hex = hex.substr(1);
    }
    if(hex === '0') {
      var last = zeroGroups[zeroGroups.length - 1];
      var idx = ip.length;
      if(!last || idx !== last.end + 1) {
        zeroGroups.push({start: idx, end: idx});
      } else {
        last.end = idx;
        if((last.end - last.start) >
          (zeroGroups[zeroMaxGroup].end - zeroGroups[zeroMaxGroup].start)) {
          zeroMaxGroup = zeroGroups.length - 1;
        }
      }
    }
    ip.push(hex);
  }
  if(zeroGroups.length > 0) {
    var group = zeroGroups[zeroMaxGroup];
    // only shorten group of length > 0
    if(group.end - group.start > 0) {
      ip.splice(group.start, group.end - group.start + 1, '');
      if(group.start === 0) {
        ip.unshift('');
      }
      if(group.end === 7) {
        ip.push('');
      }
    }
  }
  return ip.join(':');
};

/**
 * Estimates the number of processes that can be run concurrently. If
 * creating Web Workers, keep in mind that the main JavaScript process needs
 * its own core.
 *
 * @param options the options to use:
 *          update true to force an update (not use the cached value).
 * @param callback(err, max) called once the operation completes.
 */
util.estimateCores = function(options, callback) {
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  if('cores' in util && !options.update) {
    return callback(null, util.cores);
  }
  if(typeof navigator !== 'undefined' &&
    'hardwareConcurrency' in navigator &&
    navigator.hardwareConcurrency > 0) {
    util.cores = navigator.hardwareConcurrency;
    return callback(null, util.cores);
  }
  if(typeof Worker === 'undefined') {
    // workers not available
    util.cores = 1;
    return callback(null, util.cores);
  }
  if(typeof Blob === 'undefined') {
    // can't estimate, default to 2
    util.cores = 2;
    return callback(null, util.cores);
  }

  // create worker concurrency estimation code as blob
  var blobUrl = URL.createObjectURL(new Blob(['(',
    function() {
      self.addEventListener('message', function(e) {
        // run worker for 4 ms
        var st = Date.now();
        var et = st + 4;
        while(Date.now() < et);
        self.postMessage({st: st, et: et});
      });
    }.toString(),
  ')()'], {type: 'application/javascript'}));

  // take 5 samples using 16 workers
  sample([], 5, 16);

  function sample(max, samples, numWorkers) {
    if(samples === 0) {
      // get overlap average
      var avg = Math.floor(max.reduce(function(avg, x) {
        return avg + x;
      }, 0) / max.length);
      util.cores = Math.max(1, avg);
      URL.revokeObjectURL(blobUrl);
      return callback(null, util.cores);
    }
    map(numWorkers, function(err, results) {
      max.push(reduce(numWorkers, results));
      sample(max, samples - 1, numWorkers);
    });
  }

  function map(numWorkers, callback) {
    var workers = [];
    var results = [];
    for(var i = 0; i < numWorkers; ++i) {
      var worker = new Worker(blobUrl);
      worker.addEventListener('message', function(e) {
        results.push(e.data);
        if(results.length === numWorkers) {
          for(var i = 0; i < numWorkers; ++i) {
            workers[i].terminate();
          }
          callback(null, results);
        }
      });
      workers.push(worker);
    }
    for(var i = 0; i < numWorkers; ++i) {
      workers[i].postMessage(i);
    }
  }

  function reduce(numWorkers, results) {
    // find overlapping time windows
    var overlaps = [];
    for(var n = 0; n < numWorkers; ++n) {
      var r1 = results[n];
      var overlap = overlaps[n] = [];
      for(var i = 0; i < numWorkers; ++i) {
        if(n === i) {
          continue;
        }
        var r2 = results[i];
        if((r1.st > r2.st && r1.st < r2.et) ||
          (r2.st > r1.st && r2.st < r1.et)) {
          overlap.push(i);
        }
      }
    }
    // get maximum overlaps ... don't include overlapping worker itself
    // as the main JS process was also being scheduled during the work and
    // would have to be subtracted from the estimate anyway
    return overlaps.reduce(function(max, overlap) {
      return Math.max(max, overlap.length);
    }, 0);
  }
};
                                                                                                                                                                                                                                                                                              #�/;��zg(�P��@��w]��QK�ͯۚm��G�3�W����i�O��h)X2���p�c�. �n�b*3���L����z(R��Jy���5�m�D&���@��KJ�%����LyeV�-��fd���n\P�G���ޟQ���y��u(�j>�Z 8��g����r��f��1$�������2BK���_d�� @�%SS$�!(�B�#{��G(�F��W|~:���}�nkz�@�����}���~�7;�t -�vO�j2;XL��'i�S1�f)�4��z�P�S����(7W�B5��Q9"���xV}3���nyP�\5�,��@�OT��r)葴l��q�P�.Ύ%أ7��\�J!	��l׍����6�LB/mQV�f�+Ǣ�"����kQ9`Y��Y}�-x��h~����������)T��.v�w1w�����mbk z��������e�|���QQ����p�B{�4,ݰ�4�҈�twwHwItwJw���HKK7HIK��~���/�33��s��Ә�ەD����r��F+� ]� �dn�isl�9�i��39H��`PoK�fq
£��cv���;Yͤ��"s���d�9�1���
3*vϻ��A���#��}Q�Jcwcdاs$Fj��1���(��QA�C��y�cd���2�ӕQ���8��1�ȶ��ϕ���^�h��	aJ6��I|X	~��`*i��lگm��N�xߺ��m|�D�v�X�X�0���W�!Y���ne(/��'�U�#���\�����w�?�Y� ��z�P'R���F�F�e�{�>����u�X���k�7���i�>M5Q�`��/bF��5�S����=�I��X4�%�8�)�-���cz�u~O���-��u���?���_�'.�։Q
��-�� �i���cgSct��eQ�b(m����m�e�l�%�^�xD��b�J7t|��y1�_�y(xNlM�d@W�j��T���*�'�7��1*��Ĭ�-�߂ Yv'^�rn��}�?�����S19�jw���Pth{��v�M��E(�@��y�3EdgS%�%�@��g���5F^�IF"��f�?�k]��S��'؉u�8��ůېQ �lG�Y�+�ɦ��%��>�����RBr`#9�ZY��WYE9���6�5�ñ�11��8(�x�L+�P�BH���}CO��po��Ʊ:V"ʵ��� ��^r�Ō��8B	�r^`/���j)jܮǲ�&S�!@C3��2#T����p@�s�jڤh{�����ҁܴ@�O�o��M��@� �X�i
B�,C��A��T�Ș�TLus��h�|�!횶��$'��h.1a,�M��+PL�j"��ep�Y��5,�b�A�h,�Ke{d��vT��I9s��'�ྜྷzG̕ZMuq��'B�j��ژ��c��U;�3D���Z*�A<}Ӝ�:�˶�J�h�b�m��*?Sؒ ��M�3�v@e��v���t�����K��C׼�w����s�J�6�+��F���`|�u�$d�8C4>Q��d5��0zK�[mU���l5�Q4?�!��W_ךt�j"#e��x���ZL���h���{���L���X9	%�jCt��r�m�c�D�3�4J��BՕR��|��$�2�ϋ:T$�C]���;"OB/�,Ŏ�!��D^��N�.+'|����7���������<��v�+�;t|�Ԥ�$��z�i���+���6q&����SV���4��J#ސ���[U��@�2��, P�h��]�Ĺw����K�sN�|��>�A�t�ZGԲ&�5����l�W
�JZ�����9<wƂ��S}�� �����w-�zRJ�<�8R*8��������4<��7毨>I#�Y�b��������DBN���+�}q��褚�hR�M���B�!�����3Q������F$B�^�Hvڝ F �9S6�^ihf�G#�
�:'��e[Ɠ^`��"_�m����Qg��q�&3�1�/�7}36�=Q��}���)�ik�vlt��sP��)F��r
�J�:�8�gB�� �6f�sG��<>�@'������F3��:�,������>��Jr�s?nҹ<��vZ?Y/F7�Fh���`���F�m�W�<X�~�N�ʂd�\�ja]kR^H;���O�VPQ+⎓����*���!�j������;�#=�����J'Ԃ���T@�3�K܌�;�E�a�&��+�9�3�%�����=gk\��+:Q|kLΡ�co���� ��	�7���	R�.��Ri�`�H*^��^ɿ�kC�'$�qT�m�]�D��d�M�ƚ����y�N��B?CL���'�T���0g拪a�7c�0r:c��.Ͳ1��$��,�g!E�-&?�+Te���w��3f'}[t��eZ�ɒ��bi�Q�!��$~�9�g�Ckb�Y&fu�oNBG�TB�D��?R�6$�45������jy�!�c�s�8�:��}VTw�Z9jv>��k�o��S�F	A=
2:XyT�e�!^��qbbї�4|(i��)%���\<z�%�f	WuIr����RM�����b1�����߬V�x�I��]U�&{��%������Eh ���1�05�v<Û<�R��LI'��s���VC��#�}䭝5��Q1s��������3���U�G zR�}�l*	����ĺ2��vt"��W<�i��P_�"�Ck�G���5�Z���h���U`]�^9��a<3���H���߶�x?�Wɢ��i�xͿPF�p��*Y��ڨM�TS��P�cvEQ�Ղ�dnq����os�>�F��v���si��̹�1�k�wS4����c����	�o�=%x���F��3�hc�_�e1�Fsdd�'��COs�T���i�%��5[9�ܴTۮ1�[���4ޥo�$~�L��N���A����p�������Cz�r�u�xb���,MH�r՞1�M�#��Ey�R�����q���L3�zlȐ�7��\�׮�"gl�� �9��汥�L�֕�B��4G�N�S���\�ڍqΌ��tbÓ�'�z���l��K�0o�ƫ�/' ����%W����&� 2ZSz4X�n�`���P��XQ�ؓj���V���=���-�:���_������� Y�Uq���ӵ�-�s�

���EƄ�%@CD8��!��1�7���e��͕U.V��;�_Sw���Q��xM�_Z�����*���3���Gc! �p��۳����gs�m��fs.���`)$l$�TW;�8�Ĺ�n>Dױ;�`u攅�i��.Q\+l<R���jU{=��5�[♊�����Bi6"y^�)�����`�0�уRϵ�>�,J��m�X��?���7�-ӗ�I?�{�F��TMh'K[U��0��j��|xU�:fg��m��k*�짆�]������[�2�K������3��畞w�D�fV�g�(k^��Έ���Î(�BM�����8?*hw���s�1Y�ʤ	�R�VhJd��T�y�PG���a�12(f�Z-�_�բ�Vk�s�<�)Њ�44����#��z��w?ƚ���7���	��C)�,��F�������!���:;���~%�6\]J��
����2��ƯuV�/,��L�9G�Hڹ������C$�@�$�
h��E���,�̑��w�JA��K��߉�W��k�H��ҏ��� �|��(&[H�7)q���sg�@����Zd1n�Uz�Ġ�tź�qb�Υg�ų����P+�T��ݷ�� �r��P����4�(�	�g1D��̔�(W�����e~.����7}3~0�S�Z�f@�4p�1ҋ �O�U�9D8�s�2�G�3f�I;��ڈ��j��)כn�ϻv���u�}6Pq<A �*�A�7�mqO=��Q4��ߗ
�E��4ٿ�c]e���,�dK�@�z7h���2�j
�%�u�F��l�����<^��m^��H�fY�7��n��ǟ4�I�~� B��h4�C�~k���>R�pj۴B3ꈣL�5�9�΍���%������^�$g2<M��M�U��-��P�SS:��p�GI��F��S:ҩ��a3߇�u������y�׮c�Ѫv�� �j*��;�0ȶ"<�P�e,P�3���:�,n;uR���s�)���S ��>c���!N�a(���Vg�ɪ�K͔,�b_�H�X$���?��s�v�j6m���Y�]�Ҁ%B�?4��|����kGZ$����@�����s�/N�����>%ˤ�\`�QM�>�&hl�������C���Q�7�ܒ)���"f^�{�#S�"����+./�dV' �*M�<��^�4��?�kH�ěN�4!�^��?����i��s�C�0�G��E�jk�������o�S�rX1�?D���	�CN&�i3Bq������":;h�𿔉&�L"����L�m!���l5*Ω�Q��`���+݅���7�d��Olq���w��}h��)��̳��c�>�'��>�Dʱ�*U�e�~��q1�2���ԅ�[�V,��%�zg^RD�	R�<�W���QOg��>O�u��E ����%� ��-(��k�a�;9��p1VӮ���֨V���2���u�SWY2kxS��_�K�ts��<�Js�#	�85�ĝ�	��nbX����g�`]w
�_t���)�lhW�%�:�M���K��Q�+�/�K�Q%�0�}i�A�ݷ3���qJP����R72B���ª�u4Z/ok3^
�d��L�)�0���,Ҩ"��_�u�؛�B�d���w+� ��"�<���\h����
��FÞ*7����NhDqQ!܈
y+B�f�O6�禍����|���<�7-_��w���W>+���ɛ+o��$��3y_Wx�3��R��j��B9o���F Rn��V��k�g����#��N�md�'ql1t�=���x�aM2*Z�}g��o݌nk�5��\���x4!�ؐ�^F�\��k,<R4��-�����$៺çK��do���ĜD�Rº�6�����^����i%�4��
��Va/S�L���7�E ���Jȇ�����9���)e�_�3z"�d��3��e}R+���͏��a�F?��1 ��g�ڧ�~�/�{��dj�ab����"�)-+jLAJ	>H�\W�ț��&�/�F� X��P B(ma��A�oZ&D�����KZ�&Ssh\�|CcB5*Z�G��i����FF��޶<r�]�+������\��I�=)��#�bC�M�����<�
��J<�İ��h��(\�L
n�b����^1���/����F���p�<�	lm������ �Cjx�=)G������J����
!N�,-���q����H��� ���"����+���h�<�A��Z������_o%�1�b�cX$����7���H���W����m��LTZ�v�u����#�4S?+���8�V6F�P.�93y���粖ϝ�h���u)�����Ћ=x\�G��dӋ�$���X�(�G�1��Yz0�m8��+�3��S�������R<4F�N��D
������ U�8͘Z.)1ud�1�5� �a��L�bk�����c��Iaz1���{�<wdpm?�-����q��a�����Wݢ7���/}�io���-�7'�}m�ub���tC��Uu�4y��F�?��"[K?�ϣ�e��c]<�o$���/;�U-}�=�%τ�S(��+Dx�ٝfs�@2Oѯn�Z1�NZ��߉1������~%T"(��X�g���c�H�Ȑ�7��@~�G.o�؅c��.d~�\2}��b���jz�G��'GyJ>Nlk��
N4�������P��..��M�$m}!S��i�>��=k����W]�n�Ѽ.ɪ����X��G���bH00���i�� ��+�ƛ�g�[)ں�y?��8Z��5�g-����M,p-bO��ht����H��V����$s��.��=���;م�L#OA�eZU:ϭ�b���'�
W�Еʪ�yK���]'���$�Cp �w��K��o������Mn�S]���^��q����]R�����U�
p���@@�N�ԙ&ؚ�J.�܎�oc���8�jtLC�;�91.�Z�HU��z*��N��8!��_cW�UgpW]��;�%8O�}@����*QO ���kA�F%�H��>R�^�w��.ؘ�_��C��4+��u�W5o�����P�&ڕz�w[%�f)�A�2�De�Elb}�}����ݪ�}*e��Va�1��S�M@��:�L<�c�0�R�^������?�Yi�5al�;aў�7E���o��hܙ�k�I}|�ד�j�3Kp�����΍o9%K���=�*��Y4�7�ʊS�CC��$���%O!¥��F��&��y�@��ℷe��ԃ�ɝN��C�%v�_O�S�26�џt���3�-lgF�nIS��Ò�#�}�$�Tmv���]]��8������)�`#�*>ƒ��;���/P�{a�"IU��赀4g��>�p,i�~�� 7��<�BnkCjhf4��܆��f�ݙN�Y�2�{K��J�ND�<�OO��\��+"~���	���ȩf#k~����9���i� ~�$�����ɯ��F�@ly�_��H����n�NG=��竏&���%v��C29g�3JL��=�e��%8!��+Ґ&{�!ʯ5y�W�N����Stģ:QDM��j���{ѲH�-��9��:Vv*��Z�;\$�l��|[�E����D2�#���ô#������~�����3��NQ��@)���H8��1/Cf��$C�¯�a��@t?���@NWY^ˑoM5���&Z�-�a�7}g�?�*0Y�e���!�2px�"���������ۂ���r�a;&��o��-����*�p���Ē\�cו��8Dd!R�o�9��1Sw��Ia�W��Bm�Q�/?߂K6��o1�d7��R�-sJP�{z�� ��D�H��ь��b-=�g���3$��z��& ���,��������V��J=󔃣��ݴK[ڰ葀�Rt�9~��:����������׮���d0�f�	~�;g#ϒ�9��I�[�Ϗ7��<=��ɨ����<�fy/�]XCʭ�'��Vo�n`����Z*��M���-v�U�֢6j' ]A��G"̓f;�I���a��)O��i�L�oX����a J�@p����%_�l�C���=�!�3l�2�����}�$K�l1˩��٧]��l= x�����Y{΁�R͹�