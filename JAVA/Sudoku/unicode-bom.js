"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDef() {
    return {
        keyword: "allRequired",
        type: "object",
        schemaType: "boolean",
        macro(schema, parentSchema) {
            if (!schema)
                return true;
            const required = Object.keys(parentSchema.properties);
            if (required.length === 0)
                return true;
            return { required };
        },
        dependencies: ["properties"],
    };
}
exports.default = getDef;
module.exports = getDef;
//# sourceMappingURL=allRequired.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                   i��M[IT�� p�9�O	2���mi� B	�'[� �J	\��4��!�2�ږ�) �b�ռ#�0u�b����n�u��eXf8=��ݿ@����ۿ�~�J����؞d�عۗs1���)w�7�x��2�,���{���b���0{NB�&�@��~�D�}��(�}����F��L�6��2e���Ÿ�8��&���~�le?�T�I�>+'�-{�����n&���G��ʌ���+C:�@�uV����R��'k�K�p�̦�j8��T�7ϱQ��s �#� 1�5��
a�o����>0T=b3�3�g+��*�:�{���I�b�(-9���ZH�/xG�&ŭ?��~j%��뜪p�sI��D[����GG�W���`��j������"�jQ
�53V�Y`�k����^�(o�{�1j�]�}���>$�0[��TTП�{�H��q����"��t{����})�?��BY븻<��i� /�х��.�uGZ�SC�mt+D����KaG�\�]�년$���\H��M�bG"�E��&o�Mz��+���gqP��`�f5�/W�p;n`���԰\��R�>����W9����T|s�љ�vGo�/�Y-�p4��˶"�Չ��"�/��K}Aa)�swB��;�^���KX��9���(�6gG��G��]!�FY%����5�X> y-���Nqy�߉޳�� bu|L�&�����
B̹CC��ԭjP�Ʉlؾۣ��
H����3�KD�u_���G1ΚWΏ&O�֙��0�	c�*�FG�\�-�؁��l(��$���A��-v�FAK�NM�Q��e�ju�)]Ё�H-�`�m�9���s8�|!<�y����R��, I8�����V�!Ls9�������������2�4r�X��Z�&�:����(����)��h��Ct�s&�$��Q�ܦ�XK�$C\�dJi�BiN���g��r���qB�Qj���<���Nf�-qJ�U"�7��g`�=N��Ֆ�ct�ʽ���n���R���V��������<dLO�.�!6�j��Nb���jjTWQ�*ŵ�[���b�b����hh)��B�x�G�����f7�2���2
�1�D�h�"?dQyAW�e���跑�CA�ߠIZ�?1�ߏ�