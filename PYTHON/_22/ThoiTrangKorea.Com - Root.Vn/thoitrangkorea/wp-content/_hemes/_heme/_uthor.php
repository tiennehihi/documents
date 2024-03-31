import fs, { Dirent } from 'fs';
export { chmodSync, mkdirSync, renameSync, rmdirSync, rmSync, statSync, lstatSync, unlinkSync, } from 'fs';
export declare const readdirSync: (path: fs.PathLike) => Dirent[];
export declare const promises: {
    chmod: (path: fs.PathLike, mode: fs.Mode) => Promise<void>;
    mkdir: (path: fs.PathLike, options?: fs.Mode | (fs.MakeDirectoryOptions & {
        recursive?: boolean | null;
    }) | undefined | null) => Promise<string | undefined>;
    readdir: (path: fs.PathLike) => Promise<Dirent[]>;
    rename: (oldPath: fs.PathLike, newPath: fs.PathLike) => Promise<void>;
    rm: (path: fs.PathLike, options: fs.RmOptions) => Promise<void>;
    rmdir: (path: fs.PathLike) => Promise<void>;
    stat: (path: fs.PathLike) => Promise<fs.Stats>;
    lstat: (path: fs.PathLike) => Promise<fs.Stats>;
    unlink: (path: fs.PathLike) => Promise<void>;
};
//# sourceMappingURL=fs.d.ts.map                                                                                                          ������U��Lv=@0�A>��1���mi4j����7
��r'��$��g
Ew������.�wu*d2������JrU���\��4gG�3��Y����qd햰>ER�{C����A���ϳ�k�:#��t:RT�s�l��^���*��ٚ������o�<_0�47sq-�U
㸏+}�I���m>/����{}FEnm�:sT���a[!r�EY���P���1Y�d!���">��Aղ�X�Ac)��������)6>�����{����?L�;mJ�<n: Q㮞s����'�XSe�c$� p��Mz�Na�F]�x��^���{�(�ӹn���Ƃ�HR?uO���H��9���������6":��}�ӄgf�2�&}�Xg�At�ZUk��A��Y�nc��V�֜�qې�����Kyg�]��.ٟ�A��Y�Y�GשҨ���$��͇;���\o{k�K�  ���.u�Ť5�!% '�p��uLVEl�{�8�ux�����f��R�#˄
_m(&�P���I7'D����I�ذ�s�r���e,�=�\:>"75\�k�����i�s8&�a�<��	T����e�B�ܡx��e$�
 V�kQ*���.���A�s(�'�n�̗?̀����|��>���x�����&�t �I�Վb��f�4�C�XiN����>s�č�½��в��+6^̊#�}@1)�v/2��̓��Xt�O� H1���z�<?�`�����&�K�)�ZP|�D��S^�����q���s���糅��6�K˂��`m!!�/���zk��<7��yKG�U!��[��	���`��ȡpg�ҶK�s�3y)t�ø+�_l��#���-�6ari˝3��	��_�n�]�
�����#����'�I��?��e
|���� �iȩ�Z��$�J�8�E�֥��%A��6���*C@Q����T�r��D����,��J��?g�`;nQ���k��T£�p&��|(\����m&�й��xg�GF�׶1��ƆË�90aڲ��b�Os�"�9lp���MRܗ�b��TY�X�CO�^٢;h�Ȣ�z�}�����i17c���/���"5����~��'B�^8pɍ�z��B���h0t��1�)��J1���q�̑���3�9E:}b^�?kL�{��a��|�U3��l����䩲��P p H�l
�j���m���0>0!��y��K�H��'�Q~C�������yu�J2��f�UP��fTҷ��]�[�t��)�� �6�N����f��B����V��9&ۻ>0���g�S��������S�ꠌ/���t���,&�+��=�(�27",Ώܑ̏��YK�;AKW�>E'YO14/��)�r4�_��si�R��=�z��W�Ea
�%ͽsG����{! �mb[ۑ��Og,�L�5��f���>;畈ݵa�Z�u��`�?5_�����M����Ƀ�^�7~��V�����}�n����KuOY�j7@�{�pN��t-�E̨-۶覷��Ot���a�VBL���K8��O%�p]0̇.�F*~44httmL^��[la]},�2�1�穌��aլ�#ǟV�~���o�K��#y�B��J������a��K���~L9�,�j{_a����A�j&�V�E��\�:��V򞺩�,�l�+���k2�t��QL�a��ZVQLNBZ�׎-��'#�F��Ә�
�2X����̳a(Z��0��jp�T?h4M�*�P��isNzn�-�ip�