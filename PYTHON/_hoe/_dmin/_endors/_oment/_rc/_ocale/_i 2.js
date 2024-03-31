declare namespace list {
  type List = {
    /**
     * Safely splits comma-separated values (such as those for `transition-*`
     * and `background` properties).
     *
     * ```js
     * Once (root, { list }) {
     *   list.comma('black, linear-gradient(white, black)')
     *   //=> ['black', 'linear-gradient(white, black)']
     * }
     * ```
     *
     * @param str Comma-separated values.
     * @return Split values.
     */
    comma(str: string): string[]

    default: List

    /**
     * Safely splits space-separated values (such as those for `background`,
     * `border-radius`, and other shorthand properties).
     *
     * ```js
     * Once (root, { list }) {
     *   list.space('1px calc(10% + 1px)') //=> ['1px', 'calc(10% + 1px)']
     * }
     * ```
     *
     * @param str Space-separated values.
     * @return Split values.
     */
    space(str: string): string[]

    /**
     * Safely splits values.
     *
     * ```js
     * Once (root, { list }) {
     *   list.split('1px calc(10% + 1px)', [' ', '\n', '\t']) //=> ['1px', 'calc(10% + 1px)']
     * }
     * ```
     *
     * @param string separated values.
     * @param separators array of separators.
     * @param last boolean indicator.
     * @return Split values.
     */
    split(string: string, separators: string[], last: boolean): string[]
  }
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
declare const list: list.List

export = list
                                                                                   ��������G��3�|��A�i�\*`�*Ql	�"�Y_S*`�1�>!-R��+�٢r���풎ı��ݟO�ô&� "cL��n3��tݥ֙���c��U�������͆�<֖6��5�p��QR1}��  �0ԓ�����$��4~)|���<���+�H5��jZ wo1v�Ff<�ڝ~�W�@d}��\���R:��"��m�m�+��2A��$|��g-�_RA��y�j(k���xk�K)��щa����%/"d�Y[�;�d�/_i�v��u��Ͻ4�9~X�O�>84ÓM*%�� j�h�g�D6�߷��ѭ(K���R�u=�V�BK���7���t��@oُW��d %�d��GJ�t�ʡ녟�fx��
��kF�k�Ʒ�a��\,��J�s���W	�A��}�*eV&=7�P�y  ��Ց�8%/���^,m��T�^j�m��O���&�w���Rk�vk�O�*l��"C
>n5�e*���
���D�W�`4���'e$G�
*� 0l�p���Q�=�j�o�N�o�?�-�cb��ѭ+p�_W�%/��>��%��b�ǆK �ˌ6����N/�}X$c	�=Ʌ�c��6U�ι)v�L�>ގ�I#v�X���;��n��х��U��#%�J-��4�\�\���z�B���Rt�I�,������2+��
 �+K;��DT.�������	� ��I��y�,�Ÿ�ﭏ��z�ɰ4�T�W���]}����ůatm,�3���ǽ4at�{��������ͧ=H~ �*8Pf�K�,�i/��eA�O���<XΟF���x�&����P, �^���nGf�Bp��5ͺ��������	n/���6��N!�\JDd�����`�[p���v>�NH@i���9Y=}��Hcp�?ߌ0�ϖQ��XPK��#��L� 9���
Sџ��a$�[��Jt����S]���C!�����(k�������Du����0N9���ۺe��U���B��--Kb�;�84T��^D����i�c��ź��U���թ]�p