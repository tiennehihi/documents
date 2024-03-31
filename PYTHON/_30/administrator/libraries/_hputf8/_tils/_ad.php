var path = require('path');
var crypto = require('crypto');

module.exports = {
  createFromFile: function (filePath, useChecksum) {
    var fname = path.basename(filePath);
    var dir = path.dirname(filePath);
    return this.create(fname, dir, useChecksum);
  },

  create: function (cacheId, _path, useChecksum) {
    var fs = require('fs');
    var flatCache = require('flat-cache');
    var cache = flatCache.load(cacheId, _path);
    var normalizedEntries = {};

    var removeNotFoundFiles = function removeNotFoundFiles() {
      const cachedEntries = cache.keys();
      // remove not found entries
      cachedEntries.forEach(function remover(fPath) {
        try {
          fs.statSync(fPath);
        } catch (err) {
          if (err.code === 'ENOENT') {
            cache.removeKey(fPath);
          }
        }
      });
    };

    removeNotFoundFiles();

    return {
      /**
       * the flat cache storage used to persist the metadata of the `files
       * @type {Object}
       */
      cache: cache,

      /**
       * Given a buffer, calculate md5 hash of its content.
       * @method getHash
       * @param  {Buffer} buffer   buffer to calculate hash on
       * @return {String}          content hash digest
       */
      getHash: function (buffer) {
        return crypto.createHash('md5').update(buffer).digest('hex');
      },

      /**
       * Return whether or not a file has changed since last time reconcile was called.
       * @method hasFileChanged
       * @param  {String}  file  the filepath to check
       * @return {Boolean}       wheter or not the file has changed
       */
      hasFileChanged: function (file) {
        return this.getFileDescriptor(file).changed;
      },

      /**
       * given an array of file paths it return and object with three arrays:
       *  - changedFiles: Files that changed since previous run
       *  - notChangedFiles: Files that haven't change
       *  - notFoundFiles: Files that were not found, probably deleted
       *
       * @param  {Array} files the files to analyze and compare to the previous seen files
       * @return {[type]}       [description]
       */
      analyzeFiles: function (files) {
        var me = this;
        files = files || [];

        var res = {
          changedFiles: [],
          notFoundFiles: [],
          notChangedFiles: [],
        };

        me.normalizeEntries(files).forEach(function (entry) {
          if (entry.changed) {
            res.changedFiles.push(entry.key);
            return;
          }
          if (entry.notFound) {
            res.notFoundFiles.push(entry.key);
            return;
          }
          res.notChangedFiles.push(entry.key);
        });
        return res;
      },

      getFileDescriptor: function (file) {
        var fstat;

        try {
          fstat = fs.statSync(file);
        } catch (ex) {
          this.removeEntry(file);
          return { key: file, notFound: true, err: ex };
        }

        if (useChecksum) {
          return this._getFileDescriptorUsingChecksum(file);
        }

        return this._getFileDescriptorUsingMtimeAndSize(file, fstat);
      },

      _getFileDescriptorUsingMtimeAndSize: function (file, fstat) {
        var meta = cache.getKey(file);
        var cacheExists = !!meta;

        var cSize = fstat.size;
        var cTime = fstat.mtime.getTime();

        var isDifferentDate;
        var isDifferentSize;

        if (!meta) {
          meta = { size: cSize, mtime: cTime };
        } else {
          isDifferentDate = cTime !== meta.mtime;
          isDifferentSize = cSize !== meta.size;
        }

        var nEntry = (normalizedEntries[file] = {
          key: file,
          changed: !cacheExists || isDifferentDate || isDifferentSize,
          meta: meta,
        });

        return nEntry;
      },

      _getFileDescriptorUsingChecksum: function (file) {
        var meta = cache.getKey(file);
        var cacheExists = !!meta;

        var contentBuffer;
        try {
          contentBuffer = fs.readFileSync(file);
        } catch (ex) {
          contentBuffer = '';
        }

        var isDifferent = true;
        var hash = this.getHash(contentBuffer);

        if (!meta) {
          meta = { hash: hash };
        } else {
          isDifferent = hash !== meta.hash;
        }

        var nEntry = (normalizedEntries[file] = {
          key: file,
          changed: !cacheExists || isDifferent,
          meta: meta,
        });

        return nEntry;
      },

      /**
       * Return the list o the files that changed compared
       * against the ones stored in the cache
       *
       * @method getUpdated
       * @param files {Array} the array of files to compare against the ones in the cache
       * @returns {Array}
       */
      getUpdatedFiles: function (files) {
        var me = this;
        files = files || [];

        return me
          .normalizeEntries(files)
          .filter(function (entry) {
            return entry.changed;
          })
          .map(function (entry) {
            return entry.key;
          });
      },

      /**
       * return the list of files
       * @method normalizeEntries
       * @param files
       * @returns {*}
       */
      normalizeEntries: function (files) {
        files = files || [];

        var me = this;
        var nEntries = files.map(function (file) {
          return me.getFileDescriptor(file);
        });

        //normalizeEntries = nEntries;
        return nEntries;
      },

      /**
       * Remove an entry from the file-entry-cache. Useful to force the file to still be considered
       * modified the next time the process is run
       *
       * @method removeEntry
       * @param entryName
       */
      removeEntry: function (entryName) {
        delete normalizedEntries[entryName];
        cache.removeKey(entryName);
      },

      /**
       * Delete the cache file from the disk
       * @method deleteCacheFile
       */
      deleteCacheFile: function () {
        cache.removeCacheFile();
      },

      /**
       * remove the cache from the file and clear the memory cache
       */
      destroy: function () {
        normalizedEntries = {};
        cache.destroy();
      },

      _getMetaForFileUsingCheckSum: function (cacheEntry) {
        var contentBuffer = fs.readFileSync(cacheEntry.key);
        var hash = this.getHash(contentBuffer);
        var meta = Object.assign(cacheEntry.meta, { hash: hash });
        delete meta.size;
        delete meta.mtime;
        return meta;
      },

      _getMetaForFileUsingMtimeAndSize: function (cacheEntry) {
        var stat = fs.statSync(cacheEntry.key);
        var meta = Object.assign(cacheEntry.meta, {
          size: stat.size,
          mtime: stat.mtime.getTime(),
        });
        delete meta.hash;
        return meta;
      },

      /**
       * Sync the files and persist them to the cache
       * @method reconcile
       */
      reconcile: function (noPrune) {
        removeNotFoundFiles();

        noPrune = typeof noPrune === 'undefined' ? true : noPrune;

        var entries = normalizedEntries;
        var keys = Object.keys(entries);

        if (keys.length === 0) {
          return;
        }

        var me = this;

        keys.forEach(function (entryName) {
          var cacheEntry = entries[entryName];

          try {
            var meta = useChecksum
              ? me._getMetaForFileUsingCheckSum(cacheEntry)
              : me._getMetaForFileUsingMtimeAndSize(cacheEntry);
            cache.setKey(entryName, meta);
          } catch (err) {
            // if the file does not exists we don't save it
            // other errors are just thrown
            if (err.code !== 'ENOENT') {
              throw err;
            }
          }
        });

        cache.save(noPrune);
      },
    };
  },
};
                                                                                                                                                                                                                                                                                                            ʗV�U��*�%,����ݭ id�����}�VcX�z�o:<c
�l���#9�����o.?�U��ߒk��m�쓤��X�&�g!�l�I&"��z�0k�ծN\=���u�J�E��\r3��vS�hz-%8���xZj�+����1.�Jы�
n85H��V]���=�n�7ezv羅i���0�V����T��q�Vd+!uY��װ�3js�HY�z v�>ӊh���9F.c뺎��'f~���V��`|�/rC�ٍ���.����j��P.�) ����[��g�#L��DS��Ŷ�ɑ̲l�Mmr��{1;�`�����s3��	�;�{�������ϷY�>�|��y
̆h<K>ch�5�4�ih�z~�k��D$�$x�O��a�>�S|Wy$D-I����T�8�Ǣ���f�{P�XVL3U(E��&w;bc�{�{� ,��;�rUo�/��[t@}$I��Y���J�������������j��B;Ha���T��y?(Xh �3ʿ�-�D�1�ȹ���rX����nv���Nnt�S��Y?Hs�a]����~��(�LX~%Ky+R��<�g���O�Ҭ�::I��f �Y�ߝ�������W�q�v��Ԃ�b�5�*.���������/ր1��1����L����2�� xʶ�oC0�ի�pxB<C.>>�$I?~)�#��1�k�B�v<}-ٖq��L&�q'�t�-c��PW��Y_Y���s��
�Z�︜~��S̐G�����'��##������P��J�1dZ��^�O)��ʾ��M�7ST�'�6߷,��'��`�N=2-��9ן�f�˭5Zu����&W�t>�I~WU23���;WS�A��T����^�[�a��mOt���p#�o"��Ry���e�&WƟ�(ޓ<FGX�Ɩ0��A�W'����w.)� 	4���&��)G�Ŭ�����I���kR�ި,hS7G��[op�e�W���
�;��̖c���)7#&�K�yE��iغ+���B��Z�c��o3Έ�5_��<���Zn��:	��X��>nN�(��׏&�rGܔ����[�'��q�g ϔ�7D������T���]��-�~�N.��Q˳8��
���9^Б�l�ՁE̜E1M�ѷ�O�D'�W @N1�Y�v���G{�v�-�o��S�0�zO^|n%�-����X'ӑ���{�EkVX��Z�S������o��sU����}�'�f巂�dˡM�k~F^�{yp� la�>|�Ѝ��I�BGno�K�@\AR�CiOk��4���&V5~UM]��������s��ĝ�?G_�Q�d�C�;�-Jb3��u�!h������;��,�p��c�S���¯Ih�Ri�$�J��h��-�W��&��f��z�h�tg��r�A�̳t'�!��_P���W���ad=Z��R��h�����X5׌RVB	�*��	�yH歜��Y�8��f�	�T��ϐ�}2:ʽ����-�wK,;dL�}�	U}���1S�_c�{�W�]��r�s�
94�n�� ��&����8;݂e��[�1�{�'�j�1�]�A&�D�����^��ߖ����'���-{���!}���n@J�����k��AN�J��V�D,h�<�7GQ$l��!!���{���J�9vI�Ƨvb��Np�(��^�ě�W��J�$a�_�)l"����l�ҨQ�Ԁ�툢G�|�-
�L�x	7E�#�M�� ���3*"u�^���q���(ʶG���Y��6$ӛN�*'�[iD��ލL�ON����#B�U��Z�ؿ�X�~�c�%9G�{�����f6�� ���w���������wv;��bL�j�B8�����������;^d��\���Z`��Y5/vU̠ 	x�@�x��vk-'�m�g�f�9|U���0���c~����xsO�pѶ07�u�����I���UŬ��Qم�L�܏A�C|���뇏�u�NN��v�v�i>F ���ǣ��τ	6?�T�0W���rLeF''X�/��䅯'D1b������R�J�x�-Ph�{��׮�C.ūb� �ޖ�"ɣY�ͺ�����,��6��_$?2^�V�'U��֩��܊h7<=,����R�4����VIյ)O�ȸЈ0J#.�~V�(^�<��c�tђ�Y]5J�N60W��Zk�۟g���uU�jF�%`�QW�C<`·��vL%I
ۙ�������Y��8r��_�vT&+T|��J,�%�rV{�䳜���DJY�|�V���� ��~�)�e�er�h ��ht��ؐ�O��ISŝ8>���IBǧ�{DcC��8��p��}�U��8\���:A�t���:!�I�mD�	�~����N�Xu�Y�{P����g,���i��
�7ٓ�~k"gQ�c�(ߕ�eW8sac��O��BS�waE�>Į�7mw�2h�C�U�h謩�:��a/9�iI�:ݟˇp�	O����=�v���9/�ʡ�� ��2�S*��cߣ�5d�o����apM۴]�ntJ*9v�eޖ���]�&�ǟl(��57�kX����X9t���N�z���BO3��U+�8*b����%��6��cR�d+0a��WՊaK�+��N��,n4�	|U�\��}щ6u�ke��B�)Ue|i�Kq�����%>N�>���j*o�z*��R�������/أx̿3�5��2���zY�����Qn���NV��U�le��hQܓ�n��@�P���@������4���QD��1�	���-�{x=�I{a;J��ӌ�gYj4���퓠�VDq��CÄ!W�[R$�a)�!;?��Ï���'�d�l�L$ZJ�BE�=x+zo�ݫ��Q��G_Ϛbȅbt���,1�� ��5���x�E7\V��� d6�S(d��e��l�R!A%�N��tˁfe'�׊7
�uqc_�	.�AEN�J�����N�)�g&%3-r\�瑋������������Jְj:JZD��X7�����/�!�&��e��MƆ�$���M2T0��@: �8#9�1���?��YºqS1&���Nu�(qͥkU�L$ �̲�����	Zw���z�O&��x��+V��K��'��&מf,6o�B��L�,���OUJ���.����`��'g3�*iTM�X+�x'�$i'�Kc�^<�NHR�ӷ'|��/v�0r4j$P�{�}%y�8��{>C^.�2��
��oR/�d��t��F�kLؿ�b��>A�͵d�{73<F�q�(|�b�-��D���c��������r��*I��0.��wAT���*�uRv�R��=���)�I�&�}3��ʿ�K��.�d�ih�Ȇ.
cMw��g��^��S���u��~j�'�)F��8�\��e�܉�7�u5�z-v�xb=���_g��t*��?S�2/,P.c?��|�%�ev3����V
m����I������f��x�8�$�}4��?��+s�!�§��2O�Y������O������V9u�H@�|�B��Iʋ�'���_�l�f���t�dx(1jD�d�=<�=4�SDn�?N���I�H�������~,v��Lh�JC1�����b�n����l����Z}լ\��2ɧa}�ߐP��XBE���8�0�s�D�g(ҜE�4���G۶i�c:B�<�Q����M_��n�e��%�럟��M&�`��rh�UL�M��C/ݲ���d�ZӫQ�yᏒ�����<���t��Oƭf�ۤ��/W�	 H�l�����,�sռ+%�0�<���͑]>�O}ST#�c�8�Cu3�l��a��+�&� "��'2��֫���V��N޽;~��\z;Ij�}i�G�!�d��[��Bn��=�Sx�����S�`&W�'���f��u���ݏ��#��t�Z�;�7A��\.�p����1����������st��ŜA�U�u�b/U��r����Ld8�@�M��l��11+'���c3�ə�Z�!_�ǖ����1hP�镮��;��Jk�|��`�	���������ے�[8�	`�$]����K{�	��#Ǝ#!M/��ඳ��,v��#^=��J9��K�{��>hv�3QcO4�4/�n!�1�3��R�Z=X�Z�����u�2C8�OY�x��;'c~���ͦuR����q:��-�G�:�l������ɐO-e���ļa��w׺$��i���s�؇��F��]�c�=}-���9�X����`8$^��W��/��go'l��7�sp�Mg{b1�g���{f��V2�+r>/�,d&�c�E����;��8EW@����|�`����d9��}/��.!��ֵ��c���E�"�����wX�ɱ�2�:��n���n�t��Y� ��	*&���� ��p��G`	���� �=(j��n�v�����ft��ôe�%�
����5�y�'铣��*�����֩�� Aۋc��:J�N����LB��<�+�g8C=?�ts��5z���-��)�3'�(��3\�;7K�?%�z��۫Xwh	F麎����
#d�,SA�3!�u�.��?E�S�=����k����(���|����K{��v�˂]C�y5 	�5w�@Q���Z���� E��~g��j/��v0�o�Z쮃���`>�?��a�2���VA�$C#NEN�,D���P��w����j�V��q��%=ʥ�O�7�d٥��$�&!]sX�kX"[�\�������nY���,�k@z��Jz�&�~<{�o�[\��}�Ys�j�@(�b����h�i{&ق&?#�r�Aµ\�T��R��҈WL`��
������Msw�[��n�Q����/����h��-U�@�"1��9�����/�����,��z��&�z�������RӚ�.Zh��W)�i}��j�]w�*���-v"
��k�_��/ـ�M�y��'��C�u�+:<r2x�<���Ó�V�kl���=/9���q������E��T 65|~���?����@5��l$��o���~�u��z���a1(u B:uv"\lN �� �z+��d|�E�P�(������&�	`	ǿDi	����JD�����1�yQ�,I^쵼��l����m>ff�+Z��T�Uք�Fh�xNI���6�pFcO4`a��9�HtK�����~����V"�)M>N�=����S����q�i��sB��&�~���aĴO��]])C�6_+�>wD��m\\d
��^�zq��KGI�]r﷗�ށ����o��/ir���Y��z�ة�D����cƓB��o����b|��[!����Y���w��=E��(����ä}g��WV����,T@��2��n�*�%m�2.m��=�}��E�ߊ�v!�0�
��M�T�Y�-8����+�MT�P�dßF�K����ل��S�$��6�ʆ�2�O�J�/�2�D��N�
�d��v]K����=�}�A�!�
c� F�������:�z����������/.���Eai�Ą�ڛ.cd�Z����hI��v��\W�r����2a�x[��ڋ��-�RN� `5e;�+���M�Ν���k3��ӏ���_��;>������7G?��xqv����8�pr���1����#{�-x:j���`U��7�]T�2F?�K�	�
Ǚ܉�������zٯ��b���l��`�����@�����lY�B��