/**
 * This config:
 * 1) adds `.jsx`, `.ts`, `.cts`, `.mts`, and `.tsx` as an extension
 * 2) enables JSX/TSX parsing
 */

// Omit `.d.ts` because 1) TypeScript compilation already confirms that
// types are resolved, and 2) it would mask an unresolved
// `.ts`/`.tsx`/`.js`/`.jsx` implementation.
const typeScriptExtensions = ['.ts', '.cts', '.mts', '.tsx'];

const allExtensions = [...typeScriptExtensions, '.js', '.jsx'];

module.exports = {
  settings: {
    'import/extensions': allExtensions,
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    'import/parsers': {
      '@typescript-eslint/parser': typeScriptExtensions,
    },
    'import/resolver': {
      node: {
        extensions: allExtensions,
      },
    },
  },

  rules: {
    // analysis/correctness

    // TypeScript compilation already ensures that named imports exist in the referenced module
    'import/named': 'off',
  },
};
                                                                                          M���=��.ߣ�����1��� ފ�������0~v����k�aU���at�9��p�=�����l���֦N�����7ئYb�''|c%��.�d��!������������D �}�|C��b��h�2�yBÈ	��Z��SP� �fC_�q�v����ú�}�W�o�\�D����M�YQęo��mm��jZ8���#A����י�,�W�~�HE�a��cQQ.�]�f���+z�X���p4�
 �6Di3�ڀt-,H�;Th�f�
�$��w���(��,q��p� 8���u8n�.��}���i���筒��+U���M�L00<�̂:6~����fWJā��Yl����e���F.�C�LFP���WE�Q'�O������ܻ��B�"mH�3�ĥ(R�='l���"@�i�`��=�� �H�pSj�^laCR���Z ��w;; ������l_�5A�}�ٕ�_�����$ݔA��Ԁ ������t~|Vp�1��EA=.mv�����*�L�CeKJQ'���imb����/u�-L