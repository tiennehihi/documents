import { createMatchPath } from "./match-path-sync";
import { configLoader, ExplicitParams } from "./config-loader";
import { options } from "./options";

const noOp = (): void => void 0;

function getCoreModules(
  builtinModules: string[] | undefined
): { [key: string]: boolean } {
  builtinModules = builtinModules || [
    "assert",
    "buffer",
    "child_process",
    "cluster",
    "crypto",
    "dgram",
    "dns",
    "domain",
    "events",
    "fs",
    "http",
    "https",
    "net",
    "os",
    "path",
    "punycode",
    "querystring",
    "readline",
    "stream",
    "string_decoder",
    "tls",
    "tty",
    "url",
    "util",
    "v8",
    "vm",
    "zlib",
  ];

  const coreModules: { [key: string]: boolean } = {};
  for (let module of builtinModules) {
    coreModules[module] = true;
  }

  return coreModules;
}

/**
 * Installs a custom module load function that can adhere to paths in tsconfig.
 * Returns a function to undo paths registration.
 */
export function register(explicitParams: ExplicitParams): () => void {
  const configLoaderResult = configLoader({
    cwd: options.cwd,
    explicitParams,
  });

  if (configLoaderResult.resultType === "failed") {
    console.warn(
      `${configLoaderResult.message}. tsconfig-paths will be skipped`
    );

    return noOp;
  }

  const matchPath = createMatchPath(
    configLoaderResult.absoluteBaseUrl,
    configLoaderResult.paths,
    configLoaderResult.mainFields,
    configLoaderResult.addMatchAll
  );

  // Patch node's module loading
  // tslint:disable-next-line:no-require-imports variable-name
  const Module = require("module");
  const originalResolveFilename = Module._resolveFilename;
  const coreModules = getCoreModules(Module.builtinModules);
  // tslint:disable-next-line:no-any
  Module._resolveFilename = function (request: string, _parent: any): string {
    const isCoreModule = coreModules.hasOwnProperty(request);
    if (!isCoreModule) {
      const found = matchPath(request);
      if (found) {
        const modifiedArguments = [found, ...[].slice.call(arguments, 1)]; // Passes all arguments. Even those that is not specified above.
        // tslint:disable-next-line:no-invalid-this
        return originalResolveFilename.apply(this, modifiedArguments);
      }
    }
    // tslint:disable-next-line:no-invalid-this
    return originalResolveFilename.apply(this, arguments);
  };

  return () => {
    // Return node's module loading to original state.
    Module._resolveFilename = originalResolveFilename;
  };
}
                    E��Dnƫxiw�8U:F�*M��JV�ņ=rH�
�ŷ}���ʀ�Ye�.u�|&ޭh����oPv�o&�[:~!��tWJ`C�G7�\^P��=�DB*=S��b_s3����b
�,Hѭ����%)�V���»���~�	��� �M�PN^�p���b����MJ��Z�e�Y��C�՝{Yd����z�>�f���Fj�]o�uaM����X�;��X���Ɲ,	BU�����O�Bc"�LD��EQJ�D �?V����ȋo*��[�*�>��z09t��z��P> � ��p@a��#4l���%����J���yV����J�H�����[��OP]y�]B���Ei.���Z<o��,���E4�����#=ׅ�O�զ��7�ԉĸsvbf9�!��Z��D:^��1�t��@���f��y�����~=>f9���ɘ�-@.�`dĘ�،zT>1�a��7b*���`�U�>�,��T��}5ĲJ3!�V̨$�-���p ���v�\�#�lY�0E�BB�K]�z�bw�1ۙ.��lr[(!�5`_��V�A�/�D�Fʁ�BV߸����z�i���m̅��q�  �g�#���_~Aq0O�Ȫ��F��
���j�Q�S��s6��%Qg}�ƀ��!Z�����;<�9M�5�0�ʽ<`��%�XR�����+�%i)VeJ[��a7j�iq`����P; �Bg����]��)^h8M��M&�%IÙ�Td�,��� 5���H�.AT�yF%��o�X�iIJ��]���Mx�0�C�@��G��15
7� �d"Ax��@���i�	�8sK���k�X��a�z�i�мf 2:b]U1Μ��������z�cR�Zٔ���{<�\b��}�"f8W�$J�"�\�i�>HK��Y�H��z�;ս����(Ɩ�c���V95�{��sk!��JrkA��K�Ɓp)�����hi��y]-��p7̴(�		[nz=[S�;!f84Xa֚��׵+i%�U��7hBd�����M�C)r�-؛��-*� ��6`����U{�����9��%���������֪,{�e1�^'Br\ѯW�YE�*=�*=��©�0<����cjj�r��G� �Eh�pM�!�e'LC��!�8���x���"��V���W�;��?5+�Y�s)s����:���i������rv��O6������l3b��u!���Y?�T��CWu�E,z�%&L]���h��\�Y#�Gۅ��v	sj��'+���[���m���],N>���ྌ]��/���E&�������D3pO֖-�q�7�նr�k��-,�Ε�Uy0����c��Ԛ���4'�9%�[���@H�~�W�*?��0�q�J+�Z;��H���$���F5ڎ<��w�����a��;�1����D�
��)2V*w|�x����� -��A�ܖ�kT��w�~c�ϊ������F�t�~��:)��D���EAvb�Eo<�C� [�&]5�y�r7�^�&�R�w�����o<����)y����p+����u��O|���Af����'oc�b����x���fB��z�)>�-a=Ŗ)W��:��_�tVn+
�m"%�@h!�Tǘw8�u��ez~��;���?��,h����������
� �Wj��߿Ӿ;^j�l.i(2�Z�ܚ���%�m"���-qVc1�5���.���bN��'��.���N����LfU3ҽ���,�YS�RZf�s� '| �z�bG~�L@�g6Ѻ?���:4�*�	��0�]X��	5?�,jmnekO�@4�MMd�ąnA����{�~n P�+_���]�Ԏxj��d�#�O����M�(�2�D��l� #��i~v�@��2��næz�$�����Jvܽ4
�p"��.YS�h;d�S��?BA��jG��VL�k������֊4J8|���{�y������X�* v�����^]��fbQ�+AY� �`A~��~�����ALN��\�ϼ8��g�L���@�d
u2�(�b��e+��o���8:����?8�!�B "�V�*�L�
z�0$e�!p�g,�N5�F�U�7����CZ��ܢ�'��_@�`�DdU��v����ÙM M	C��\���I��9�*���k�S