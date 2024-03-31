/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export default class PCancelable<T> implements PromiseLike<T> {
    private _pending;
    private _canceled;
    private _promise;
    private _cancel?;
    private _reject;
    constructor(executor: (onCancel: (cancelHandler: () => void) => void, resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void) => void);
    then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    catch<TResult>(onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    cancel(): void;
}
                                                                               b�F�'�����==��t늿g੔��mm=߈p��8�j3�����U���s{ۉ͑�h5V��3TLC�UH)9����7l1]{���I�;Ol5�賜��澄�v߼5L�C���u%���"!|>�|:ٸ�����4F�t6������JF.�D���X��594�O������BO�|PV�����HA�+,×K�S���<~�z��C��=Kp�YdJr������^�s��.�_R���l�n5��f@d3r�b�-x>fNk�yb�FL�etJ��q�0�-i��,  b��FQ�=�_��U0}�q�����rc~�BZ4?K|s-8^<�]R�u�������xK,oΕ'���HȈ'���p����r�LV(yT�H��=A�VH�T\��B�����nV-T,�?㦦�9���_���-�w!�cbz.PI�@f���n֑f�f����3��U�QlL�j%�? �Ua aH4�I�C�����XA6�e�����_��$ɡ�&��[?�2[�;$�FZ��z17�u�dm���o����Plm��9��y����tO��#J+SQ��w�3n��c@b���%��`C��)e���#sdA ���r�A�j4zx�f��H�X��:nq ��:�P$�5}fd&D �z����b\;+v�[�X<찠x��dK�?�L��'�ZY'Jijk{�ˑ��|�$ѩ �[�
A���Aɨ�v���
]a�Ś�^�h2f�xh����2r���O�QX1��Ҭ��dQ���F缍uOl��l�l���b���	i
׵����Z�>m=<z;�����Z;��3�o2�UΘj��e�>�[�ʺ��U �"�#�H b��v
ߩ��m��@m۔����9��K��"�gC������#���y��pȘd~�%p-��`�g5�3�=��c-�m�\�Gc �\ �TK��^�Z�U�k�}d6�����кw���0�H6)�/Dܺ;��!����0AuKo�H�� ��z�_U(g�C�l�w�8)}���x[ֿ}�K_��y.ߵ�E�E��ߌ���.|x�T��l̀��Y��v�Z�=�����1��bi5c�e���vW`U��_�7^V`a�ҟr�:�2��� mY7,f;:�e���r�ri)emH:��E�z�M|�u�Tl���s=eF<;f��=�or:�N0��W