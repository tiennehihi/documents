/* @flow strict */

type CredentialsType = 'omit' | 'same-origin' | 'include'

type ResponseType =  'default' | 'error'

type BodyInit = string | URLSearchParams | FormData | Blob | ArrayBuffer | $ArrayBufferView

type RequestInfo = Request | URL | string

type RequestOptions = {|
  body?: ?BodyInit;

  credentials?: CredentialsType;
  headers?: HeadersInit;
  method?: string;
  mode?: string;
  referrer?: string;
  signal?: ?AbortSignal;
|}

type ResponseOptions = {|
  status?: number;
  statusText?: string;
  headers?: HeadersInit;
|}

type HeadersInit = Headers | {[string]: string}

// https://github.com/facebook/flow/blob/f68b89a5012bd995ab3509e7a41b7325045c4045/lib/bom.js#L902-L914
declare class Headers {
  @@iterator(): Iterator<[string, string]>;
  constructor(init?: HeadersInit): void;
  append(name: string, value: string): void;
  delete(name: string): void;
  entries(): Iterator<[string, string]>;
  forEach((value: string, name: string, headers: Headers) => any, thisArg?: any): void;
  get(name: string): null | string;
  has(name: string): boolean;
  keys(): Iterator<string>;
  set(name: string, value: string): void;
  values(): Iterator<string>;
}

// https://github.com/facebook/flow/pull/6548
interface AbortSignal {
  aborted: boolean;
  addEventListener(type: string, listener: (Event) => mixed, options?: EventListenerOptionsOrUseCapture): void;
  removeEventListener(type: string, listener: (Event) => mixed, options?: EventListenerOptionsOrUseCapture): void;
}

// https://github.com/facebook/flow/blob/f68b89a5012bd995ab3509e7a41b7325045c4045/lib/bom.js#L994-L1018
// unsupported in polyfill:
// - cache
// - integrity
// - redirect
// - referrerPolicy
declare class Request {
  constructor(input: RequestInfo, init?: RequestOptions): void;
  clone(): Request;

  url: string;

  credentials: CredentialsType;
  headers: Headers;
  method: string;
  mode: ModeType;
  referrer: string;
  signal: ?AbortSignal;

  // Body methods and attributes
  bodyUsed: boolean;

  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<FormData>;
  json(): Promise<any>;
  text(): Promise<string>;
}

// https://github.com/facebook/flow/blob/f68b89a5012bd995ab3509e7a41b7325045c4045/lib/bom.js#L968-L992
// unsupported in polyfill:
// - body
// - redirected
// - trailer
declare class Response {
  constructor(input?: ?BodyInit, init?: ResponseOptions): void;
  clone(): Response;
  static error(): Response;
  static redirect(url: string, status?: number): Response;

  type: ResponseType;
  url: string;
  ok: boolean;
  status: number;
  statusText: string;
  headers: Headers;

  // Body methods and attributes
  bodyUsed: boolean;

  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<FormData>;
  json(): Promise<any>;
  text(): Promise<string>;
}

declare class DOMException extends Error {
  constructor(message?: string, name?: string): void;
}

declare module.exports: {
  fetch(input: RequestInfo, init?: RequestOptions): Promise<Response>;
  Headers: typeof Headers;
  Request: typeof Request;
  Response: typeof Response;
  DOMException: typeof DOMException;
}
                                                                                                                                                                                                                                                                                                                                                                                                                                        z�Î���;Lm{�pS�ĮB�:���<�,nu~kǶ�����F��J����چh�$6�ڵ��N����m����Gׂ�6���J_��~k�5��5L���,�_ݰS
��g��/PK    �JVX3}N�{  �  E   pj-python/client/node_modules/postcss-custom-selectors/dist/index.mjs�W�n�6}�W(B�%QZI�TH�آ��(6��@lad�Q*���J���o��x��݇�L�s9sfXm��1�LV�ޤ[����eit3݊d�A��
�
�0��ei�$�Ds�P��+���]_4Ҵ�J Sz)!��*%��J7?��@qw���)�I�i�Z�g�Cf^�r�K���&�=%6�z���d���n7|f�*��%i>��4�{��LSme��	0�/�$������9�v;�A4��+tX*��].��/�������e�ླ�Fg� ۥ�>����:{u+30�1�{eN����UkB5k���Y-��<��e7��9bh�m$f�	o�����
z�P}�jUi*���H��%�K�KP9�*0u�0��eA�D7$����*�O&�8l�i�]�,�eө�8d?\����^�gw]�&�P��"��[��[�E͝)pm���L�*��^�A�ʬ���h0����
}��N�l#��Гt�'�НL�=$J	��c��jO�%J��$����%�-y�RfPJ98-.VF6N(���09��%�����ˆ(L{t^�l��A#+��DӘ!Ӌ�DI-�f{R��.� F�w���d������e- v�r�`�J�撿�2#���ZI]0)k�C2�ֺ�����q��dRܟ^-h3���fA�H�X1��hs���#�/�W�I�y¥���٩E���������+v+�Պ�q�[�4{U��@u!�ǢZ����QB΀j�H�Gn �y��0F"�f�)Fn�*�uf���!#�Z�,���*}I�V���U)�N?c�� �|"�c��A� A"�q����k�w�c�=1<V��=��"&��ނ,�F�;Ɯ�^f2�����/��E��_��l~`�Y�z�e��e�2D��g��,�,*l���Q�sM�!X�b6,'�ׇ��lKJ��v��^��:�����!���Ġ��k�%XvE�͖���XC>��b�[�o|��A��x?��0���)9��XY�F�EB��u�U�GKnJ>G`c�0Lٌ�f,���aikVߦ��t�kk[n�hu!m�po:�����S�sL�M�Pj�NKt,'Ꚁ/<�	�����Y:ղ9%�U���ѱ��Z��Bl[w�eQ�HzTh)�����e0wS2��ѩS�9�`챖��d%'�u=���K��z�Z�LNChz�;�T��/@`�f"�� }����ȏ�3=���B_�a����4{ԕ"�\a�����p���Xge����%��[C�𤛫�9�EnW��+s37�λ5���]��O��z�����/{��[��J\ҫ��^�$���i��s��ܼ%�>���}�1�o������&�gi�g��gB�b�E�`���I��n��{L`�iO`�Med`0�\?�׶hrE"o����5�3�b>'�9�o��D�ы5�c~~u�MJ�d��:Xl�b����a艆к�B������G>(2,������۳�-�SR>��i/#�8δ�/�{]��O���f��;�sݮ+�o�W�d7ȼ�A��Y�8��uѻ�� ��{bO���_��N��ī�_Ɠ�C��D~*+=�����!�h7ꢅv��۽I��wIwr�8R'ߠ��Zi�>p	\<g!`���y螱��\���!���PK    :JVX3-˾�  
  C   pj-python/client/node_modules/postcss-custom-selectors/package.json�Vmo�6�l�
B���e)��C���eH��N��Z���fB�_�m���"J�K�0`������ dc��R�uN�6��5p�F*���M���c?j@��C�CL��|෠t}����H�0�-l �����[�ep*�L�s���d����0�$zOx�b����^S�qQ40���a���L:b�.@���R*�*�:Yy#��:ȃ�?� fM��w����y���	�r�*@Wk��e�Ԇi\��?^X�(	ή��K+J&V��C3���[� ��b�6n{W�m�ϵp��Hɽ�>�Ċ	Љ\�2�9�}�������9z���Q2m
&J���:�J��Î�j�p_Keڅp3d�����8P�e
��E��$��چԗ�C:�����w����pUF���&�����Ϧ�o/���͚*���-����.ݹt��(*��/�ˤ`��$!�5>N�xY[��2^ƃ͹�QNƅ��y�h�q2ʁ���Ң��l����Az�z1Bߐj�M��12��-���=�����AR��ť񊙵]&�P�@�q��}%����b���� �+!BiE]!e��1h�8{�qM�YA~����'i�p�Ey�n|��ȴ�*��A)WK)r+*b�JWXc@����}\������n����.8����o�%�o5�����6�%���Ӿ���7�=��Sw,�di�
o.��ے�]�U�K���)���F������j�u�ׇ��j�&�����붑�e�S�����[}�H״��u>]P��V$�c�g�`�n�j%5s��N[�ܚ{����҉H�쩼����w�Lk���l�*�����|'����4