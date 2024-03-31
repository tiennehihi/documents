'use strict';

const fs = require('fs');
const shebangCommand = require('shebang-command');

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    const buffer = Buffer.alloc(size);

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           TXR>q�J����Ғv��TX}z{��#ٖ��X���,�;L���0c$�0�Dr���~*;����*	d��1
d̪EG?�jA!ȧ��-"�^Ѩ�����ʁsC��\�K:���-�K&8$�2�<�� ةz��'
�̸0��13�e�H̊.CulG����P�ق6k���l�=^Tv���7*<1f��ݕS�����Y/Q�sѣ���g����/���r�8 5-za�Q�zh�PQ�jƂʌ}KCX3��(�5���"��f*-$P��3M��k)*+I��ʉ���Ae$D�ц��@�Ǉ���}+
�Ú���z�+:G�h6�{��v�Þ���:9�=hzق���O4��dO�hw�r��N�����hnA�Y,,q�qFKb���	�Ga�I�'�$/'��k,i�͘,�k��6n�Lw���ׅ0W�&�Ar����A{"G�ܛ�Ss�ʾĠ�S�M��K��������˫ԭ�A��(0;��|�m�kg���څ�A&�(�;�mɢ��.^Un�(��V�Md����3E�:�@�s��Mc�k_[Bm|"��P��Y���G�y���ߜ%����X�x@��A��8�=i.��T8�=%}��U��� ��{r3d����r�o�I�6Ȕ�^=�/9c�L��c���@��R2G&>E[f���w��F]�1�i��Ed;W0(�R��W���i�NO2�Ы���N�