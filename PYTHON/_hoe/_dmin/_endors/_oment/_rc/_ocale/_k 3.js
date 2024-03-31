ike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>]): ThenPromise<T1 | T2 | T3 | T4>;

  /**
   * Creates a ThenPromise that is resolved or rejected when any of the provided Promises are resolved
   * or rejected.
   * @param values An array of Promises.
   * @returns A new ThenPromise.
   */
  race<T1, T2, T3>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>]): ThenPromise<T1 | T2 | T3>;

  /**
   * Creates a ThenPromise that is resolved or rejected when any of the provided Promises are resolved
   * or rejected.
   * @param values An array of Promises.
   * @returns A new ThenPromise.
   */
  race<T1, T2>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>]): ThenPromise<T1 | T2>;

  /**
   * Creates a ThenPromise that is resolved or rejected when any of the provided Promises are resolved
   * or rejected.
   * @param values An array of Promises.
   * @returns A new ThenPromise.
   */
  race<T>(values: (T | PromiseLike<T>)[]): ThenPromise<T>;

  /**
   * Creates a new rejected promise for the provided reason.
   * @param reason The reason the promise was rejected.
   * @returns A new rejected ThenPromise.
   */
  reject(reason: any): ThenPromise<never>;

  /**
   * Creates a new rejected promise for the provided reason.
   * @param reason The reason the promise was rejected.
   * @returns A new rejected ThenPromise.
   */
  reject<T>(reason: any): ThenPromise<T>;

  /**
   * Creates a new resolved promise for the provided value.
   * @param value A promise.
   * @returns A promise whose internal state matches the provided promise.
   */
  resolve<T>(value: T | PromiseLike<T>): ThenPromise<T>;

  /**
   * Creates a new resolved promise .
   * @returns A resolved promise.
   */
  resolve(): ThenPromise<void>;

  // Extensions specific to then/promise

  denodeify: (fn: Function) => (...args: any[]) => ThenPromise<any>;
  nodeify: (fn: Function) => Function;
}

declare var ThenPromise: ThenPromiseConstructor;

export = ThenPromise;
                                                         �\�ϵZ�����b���7u�	�
΃NC� L�/k.��b��nW�o�����	L}H����og��K4��u��AY-B�5���ޜ�����T~<��)�T�v�O�ۢ
�9qAVpJ�*}��p�?�	t����M�;�)����S�k(T�:�L!�։����t�����dr��FfUjöǚ|�	�t%KÞ�=B3?��& �Z8�P��N��Ԩ�hG�A�9tO���&�M�m��yZ�927�DU��~gB�n�2�o����u�݆�"ج�9���$߆1�`� ����Z��4��'>��Z�쀡��N/���7�Y�=a�l�����˞�ؼ
�RD���f�c�u1��Q\{�ayh��)�J��H���'�����Kyn�k��
�̴*�J�l?i�Ty]:� ��볼�&�NX|��V!=��7v��88?�:𹯠�h�R#IH�ϲ�՘��v]��.���]���'�K+2��Y��(�+-�O��s�:�3��^K���Z齃�r�m��LV������E����d�S-z�M!TO2��-�_����Я� {P  �B�{� �l��"�����X�*��3�x�R��K�)	��T���%�Zo�P�#Z�,���V\[w}L��Z% �a�.���I���Sq���,�R����LZ����X�ט݈�F��8B�Tr*I[����d�X
�~�^L絳1<j�_Ӈ[d�-��Q�a>{�=�:"�(�c�c.��PW�@��'57wa/D1��D�h�Yi�	�G�P�����qAI�}��&���%8wo-n/@H�.��=�}�_��3��78~
>�bE�o����g��+�2 D�,���c#����)���Z���
E��b{����8����Ջ&FR�#E���#�����K/XLē��Ê �c-ϻ�	��ti�q˴,0�,��(B���K���U>����,�|7��Z�pxKf�CG!$؍|�i)��b�Ul���^�HY�=_!��ߘ3�n}��I!��|�gNg�MIQd-�:��?�����d�O�H<?��f���1�r}M�e���,�y$+!������3�~�mN�:iYf�^/c���H��#Q>2I���m;t���)
��l0�9�P8Z���d�u E�kpD^�l9�5"��o��Ar������w{Z�h� Q�-��Y�F�V��'�S���J�E����]�gCx>S�Tgd�����p����W#��"�'Vjci�<}'���oa*��X��@�H��C�0�[�
��h,#r���S��\C:+��n���tS��9Ww��6)$�23e�:jg]K���^�S��r�k�e����MX���%/�l�	�-�Ge���4��c)Gf���md�-�:4I��Wҁ�b1�c)�C�����t��@ޓ��� xLj��vD�Zh:���#on4QbQ��h�<�Km�F�)���}�sO`�a0.q�ms&�_�0��a���:&x
)�p~�y���^���d��~d����]A�
k��D.j�����(,2~G���@"Q|�/�
�ǋ:�beH��:Cc[W+ �0��#�0�;+�j�(wD�.'���)&�h��O铱�1_���i��K�s��J�x�&=��`>��2q�h$C�M腮3���]thC�HB���b|���"Ψ�-@k_#���)�L)�j@Ъj�W�r�?]P�2Q��63Z�B@Bt�"GIw[OO����{Z|zbI��	}����Fx=j��1������:/�(�^��N� �].��"s�XW��CM��I��w���(�7�7�ЄNu~Yӻ�^�{W"���q�s�)$R�������\��S9~��XC�� c��s1���Tj����D~IM6��$�N�]��n�f���z���}P���beI��{A^�r{`��X��M�#t@�ɮұ��[������Z��9D���v�C��/�4Q9��@Y�̜/[�w�y�u��zAn�\z��Yќ�(�'�*�,� ��p���__G�Di�'�jx~�k!{�Q���p �E���L��Uq��͖�>�B�=%gˋ#%�����4W�N�#��T8!��*޽�؋�����䪔�위1�0���DB�/�?tE`=���8���R���羈B���DBz���k�¤�E�G��f�_���-�$�z������}9:"YI�W���b��~u��䰿ֆ��_�g[�tY�]�\&����E�w��!'Ԟ��>�JL���T��pČĢn��ba�,|Q}q���la�G������!l�c�7[5�1�_ܙ�*���
���흟W^lĳ2�Ru�VB9��\�VwOהQ��5o�ڎ�fL�Ȟ�&��Lҭ��k(�	����a���q����\7�q-���Hz��[�v�g����w:�;��?�N���S�)(է�bl�9�%:�Y5��aǱq}�j�l	��:6V-ek��m
�/3]���=n_T�V:g^n�-��/U��.�xH��~����{C�L��]&�(k��Z�;@,V-���:�di�T���lK��Ѕ�K?���R�W:�yZgl���u/���E!�+E�.Ҍ9'�`��؉W��Z��i���~��>��w�
yWoy`� .HII�m���3\8	f�xAU>R0.����Ѣ�0<��n�=���Y����y3��U��D��N�������9���Ĭz�x��vO�����z�ڈγ'L��U���a����؝��*����?X��'P�H�9u (� �p/u�3F��Vo�:ʂ�x�DRLm���CR��heS����7���(����}٧ðy��t�������~��� qF���H��?���N���(ec�ί>]�H����СN��:0}pd���Uu)j0�KSZ��l�,�S�r1� �`�u�tW��&�8?)����ỉi��䂒�2����p�U���8D[���sb��ޖ��FU�Î�������|sْ�)�D<��D�RN(�]�9��d7i�K���R�*L/äП{�� q�uHw�6ȫ5�r}��5�6j���"u6!>3e�L�g{��!W��@�7���j�~�_n=�����ġ����E��o�� �dd*gí����Ɣ�H��ۗ���9f?�2 `47�Gh