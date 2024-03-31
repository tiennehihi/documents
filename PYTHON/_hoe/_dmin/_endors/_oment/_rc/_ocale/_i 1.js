export declare type RgbColor = {
    r: number;
    g: number;
    b: number;
};
export declare type HslColor = {
    h: number;
    s: number;
    l: number;
};
export declare type HsvColor = {
    h: number;
    s: number;
    v: number;
};
export declare type HwbColor = {
    h: number;
    w: number;
    b: number;
};
export interface XyzColor {
    x: number;
    y: number;
    z: number;
}
export interface LabColor {
    l: number;
    a: number;
    b: number;
}
export interface LchColor {
    l: number;
    c: number;
    h: number;
}
export interface CmykColor {
    c: number;
    m: number;
    y: number;
    k: number;
}
declare type WithAlpha<O> = O & {
    a: number;
};
export declare type RgbaColor = WithAlpha<RgbColor>;
export declare type HslaColor = WithAlpha<HslColor>;
export declare type HsvaColor = WithAlpha<HsvColor>;
export declare type HwbaColor = WithAlpha<HwbColor>;
export declare type XyzaColor = WithAlpha<XyzColor>;
export declare type LabaColor = LabColor & {
    alpha: number;
};
export declare type LchaColor = WithAlpha<LchColor>;
export declare type CmykaColor = WithAlpha<CmykColor>;
export declare type ObjectColor = RgbColor | RgbaColor | HslColor | HslaColor | HsvColor | HsvaColor | HwbColor | HwbaColor | XyzColor | XyzaColor | LabColor | LabaColor | LchColor | LchaColor | CmykColor | CmykaColor;
export declare type AnyColor = string | ObjectColor;
export declare type InputObject = Record<string, unknown>;
export declare type Format = "name" | "hex" | "rgb" | "hsl" | "hsv" | "hwb" | "xyz" | "lab" | "lch" | "cmyk";
export declare type Input = string | InputObject;
export declare type ParseResult = [RgbaColor, Format];
export declare type ParseFunction<I extends Input> = (input: I) => RgbaColor | null;
export declare type Parser<I extends Input> = [ParseFunction<I>, Format];
export declare type Parsers = {
    string: Array<Parser<string>>;
    object: Array<Parser<InputObject>>;
};
export {};
                       ��N�w�( <��'%�4�"^#�Ȯh������BcCR�q��� 5�;7k��|dA�p�6����5�?�A��c��KI�*(�0�]��^?6	v��*�U��槾�V���N����J<wԅ�X���v���!��"�'�F`��\
%���~h�6f���y/�_=wc�i��G-���*��p�S�=��I{Qtz[ݴ�"}醌0�C��4�O�6����&��^N��b��#���o����JO�Yv�&+d�DКi�����d�6ʲk��(_�b Q�룈�z�^�L:�'�n�,��=���K&ǫ�%���'K���l}P����tg_o���!o7��]�i��F��hm��;Ɍԃ��7׀_�k���]jUG��i)s�fkȻ�,��%�t�1��)���oV`����E�ܮ.[?v�
�5b癹d�+,�X���B&�|p\77�z��4��ū�D�7f��-+ណ�{%iG�t}�RHFLd��)Ab����6�!{4W�
/vIq�rw��{ں=J
���11;ݙ�V���Nk[����*	�&�����%o����h�.���v*��&�X殝2�u�Ė�6l�?b/��ʲ_n��^�����@[�k�Y��G|Q�J��Hn�S#QH�ɾ[�o��6޶��Tm��܃
(4�8ea��O,��wѦj�&��N����MjM&k�t~�D�#��$���˛g�#(��������|�m�dkV�a�7��,#�ydc�(��(-�Jԋ�*$�m���n�2���Hvy@K%��jΙ-m��*�̆Bz H�!T�����V>��>�1ny��c��@�8E(Z�%��.n�)�O���#�'02p4�V�Q�wqߥ�{���#:������Hmo8S��Y�Xs�Ν>�rg��ǟ��E�����,�i�E�����%U3JN� M�<L�\B�..������sc�܃��o�:،�t���:�oǾ^K�=%�^���M�J�o�X��w���(K~I�W��?��|l�G�@G�XK:�e�h$�tp~��mV`��C}��?��=e:�M \>��k<.\-nOs�r���fO��~V�����6�αwޕ2���7�	M]</~g씣;�et_��d7����z���<�K��"��ʉ+(R����9�p��9n��	�\�7%\D6b_y9x�����|U����&QNJ�����qR_�nm�&� �?����3����ۿ�%D��הԫ��ٵC���Q�%�[Ј�C=���(��K�ǻ��+�dƘh�{�&�P��*\de{�95aI�4+7���﩯[``��Q
�ޔջn�B��;�kɦʦUN?,8�TM�$4g~�ʥ�'�a���ɍ{���W��.��?Ɲ;��@>}Ɋ�6�6~N���7~��Ev�Z-,0;�/�<�
��)�*��B�b��Xʷ	˯���@We�QV�?'ٲl#)(A�L=���e��mjZt�f8��:�$��핀v�>Cɐ�*#������eJr��8Y�°d5��m��" br�x1eiX&�oR.(��}n�3`o*Z��Fv�.e�ON���`O���=#}��b������vx5�h �E4k�U�/0[�gr������=
5U� � ��Z�=�"��&]��JR.K�N�ja�n% ��Uh\	��M�C_�9:�l�F�Y
?��e��K�v��+r�[	��w0( �%y������9��"��}'�5�9���B����T�z��-