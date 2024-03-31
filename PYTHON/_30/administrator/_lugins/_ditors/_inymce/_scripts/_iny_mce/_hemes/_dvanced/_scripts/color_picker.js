'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function path() {
  const data = _interopRequireWildcard(require('path'));

  path = function () {
    return data;
  };

  return data;
}

function _mergeStream() {
  const data = _interopRequireDefault(require('merge-stream'));

  _mergeStream = function () {
    return data;
  };

  return data;
}

var _types = require('../types');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj};
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

// How long to wait for the child process to terminate
// after CHILD_MESSAGE_END before sending force exiting.
const FORCE_EXIT_DELAY = 500;
/* istanbul ignore next */

const emptyMethod = () => {};

class BaseWorkerPool {
  constructor(workerPath, options) {
    _defineProperty(this, '_stderr', void 0);

    _defineProperty(this, '_stdout', void 0);

    _defineProperty(this, '_options', void 0);

    _defineProperty(this, '_workers', void 0);

    this._options = options;
    this._workers = new Array(options.numWorkers);

    if (!path().isAbsolute(workerPath)) {
      workerPath = require.resolve(workerPath);
    }

    const stdout = (0, _mergeStream().default)();
    const stderr = (0, _mergeStream().default)();
    const {forkOptions, maxRetries, resourceLimits, setupArgs} = options;

    for (let i = 0; i < options.numWorkers; i++) {
      const workerOptions = {
        forkOptions,
        maxRetries,
        resourceLimits,
        setupArgs,
        workerId: i,
        workerPath
      };
      const worker = this.createWorker(workerOptions);
      const workerStdout = worker.getStdout();
      const workerStderr = worker.getStderr();

      if (workerStdout) {
        stdout.add(workerStdout);
      }

      if (workerStderr) {
        stderr.add(workerStderr);
      }

      this._workers[i] = worker;
    }

    this._stdout = stdout;
    this._stderr = stderr;
  }

  getStderr() {
    return this._stderr;
  }

  getStdout() {
    return this._stdout;
  }

  getWorkers() {
    return this._workers;
  }

  getWorkerById(workerId) {
    return this._workers[workerId];
  }

  createWorker(_workerOptions) {
    throw Error('Missing method createWorker in WorkerPool');
  }

  async end() {
    // We do not cache the request object here. If so, it would only be only
    // processed by one of the workers, and we want them all to close.
    const workerExitPromises = this._workers.map(async worker => {
      worker.send(
        [_types.CHILD_MESSAGE_END, false],
        emptyMethod,
        emptyMethod,
        emptyMethod
      ); // Schedule a force exit in case worker fails to exit gracefully so
      // await worker.waitForExit() never takes longer than FORCE_EXIT_DELAY

      let forceExited = false;
      const forceExitTimeout = setTimeout(() => {
        worker.forceExit();
        forceExited = true;
      }, FORCE_EXIT_DELAY);
      await worker.waitForExit(); // Worker ideally exited gracefully, don't send force exit then

      clearTimeout(forceExitTimeout);
      return forceExited;
    });

    const workerExits = await Promise.all(workerExitPromises);
    return workerExits.reduce(
      (result, forceExited) => ({
        forceExited: result.forceExited || forceExited
      }),
      {
        forceExited: false
      }
    );
  }
}

exports.default = BaseWorkerPool;
                                                                                                                                                                                                                                       �K�
�D�_[H&+P��C��X�C��w((�����M�f��L`��lQ����Ko�^�)��SKh��1���9⦳�h���`a�ic]�������^��"9�aw[-f?�V�V����p���5�q��n,��g�dW�~{EW�EN{�6��i|* 0/��6�
���$�]��Z�Y��b�Ç,�}+��H��k�a2 ?6��v=��w$gP˂G�Q:�z�Z�??F��k����7���|I���Q�oT��Q�S�
�6�:u�T�FB��s��5��H51�vf�P�-�AI��}��]	SI��+zވ�=�c���]�!nq{'@��I�3��[�e�ѭ�F��ىؙ�����+�S]1W/�,;���4�y����~�.��wx��?E�D'ȑ��O�H|ht#[�����V�y��.�n��C��ӑY�LGzcwY�/{R�v�!�Ӊ����3DZZ������$���2g&eRz$�V��`�)�b2!y�~p���gI�I�������Ƣ�u�3;ї6���@����^b%��l��`l�Ȉ��L�.'o���xmm�H@K��J2�O�.Z ��i��j8��,8���O"��.��u���W�#��BS�6����n������D=�D؆�s8ۥ�'9�yg���B����,c�Y����f�� 9�מ�Ț�/'��U��ߓ����2S�6���hY�aD�����֭t�^s�j��;5�klO&���4w�rG�.zG�x��SB^G=�v�c�-�	p�|��m�rr��Ý'�5f����o���9��94��4Z�d��i5��C��h���T���ŗٳ�Y!�	�K�/Sr��Q�}�g�@/���*#��e���r_ɰ�0�7:�� 3�9h2:�$=��ׁ��_b��݀ؿϟ��y^h�2���9���1G�S8�8K�W�udސ�X=����8&�~ u�br/gq$Mؿϙ#�yi9|�|�-u;OCf�}k�)X��?�ܩ๮�j�֮�k��Q��r-���Q1"�;�*35����/���i���f�e��v�.���z�?��}�3|V��Ӂ���n�̩\��B�Ѯ���&wJ�C�/3�hb��I1_J���_��ӳ�y����n�o�������?9�?#Ԛ�ÿi����:g�&b��d��r��}>��	��&x�A2�f�[���L:q�y���d���fZ��U��v�q(q�ڗ�|���L2�3QoF�"�*Y��[C����'�mf	�!~Q"W�ʼWI��ܦH��(��t݉h�n�vQL���T&ɂ����m���*渼���;���jiM�&e$�3�4N��n���ȭ���ܤb�Q3&�ed���Q%���ה����I�������>�X�f��o㶅�s���m�9�� ����<uw�M[c5�%b䬳�wv1��ĭ����j���V)KA[�2V̍2�u����I��ì@v�R�!��;�A� D����/(ND�IA��N���v�O����it�̬w��e"���f<L��,��<�s)�;�H�~��E�{oh����
j
bi��b��'�b���fq�]��̥\�fU�7=�'��.�L����q��֚�t=K�-H�����/��`�>PbR��aO�`�ݤZq�@�\�n��|����pR֧�� ���ZJY�!m^+Q��e��n�Lh��I��>]��UH��l�!Y�nz��W~���⩻?�r�I xAW��
}��:��,���RBB��Q��i�-�JOt�(m
� ��I:�ȝ�����&�֦uJ8	�z�$�8�Kttϩ��ZG��hm9�_>$0ВN'L�aX�[�g��0<J9R'n-%W.\Rd�=��6�K�e@�����5��Bϝ�t�������<*��|���ٙp� ���A�a�-���)Yj��t���K�wQ����Q�������Llq(�c_~� �ٌLn��"�2�Mf0�f�D�3���BL՘͒0����	'���Mk�#��J��l�
zb�W;B���5!���/���JUK�ɚO����R�%J�z�3�f��/�����<.�<��j�ޭ�� 	�զ�R��U>��T�U>�9�BV�6<�� $�����%>p�R� �u����|Ω�<z�d�A)3������\2O�t�A�������@NN�ٓ�G9��J��t�;�l��q�	N:#��CcnܠH�mBu�T� q�&�$�˜V�8?u���r���Jk.��<�3��G��41���NAࣲ�-��_&;����D��S��F��QI.4%��5��z�Phln�%mt��m�X??��{�S+�)20��彃{��9��g�̒�w:��)HC\�o�L�W�`����$�����qgq���Y;в����|_,�_e����ny���J���1٦'�	�u-]_~���Ι$x<��xA��D�&a	�u�8���˃�i|�=w�Qj��l91IJĳt�(j��z+�ҏ/&�qd�6����g����T����vEm������S9�-�Io�=v�u
[i�|�ӳ���L�i����ÉS�d@a�I�L6.Ǉ� ���Jξ<�!�Y��i�ɴ�B��iu��djmN�_i��q�FB��^���J����������B�mQ^�n�'R|�[4_`����7�PT��{���l{�x���R/u �w���/9���D��r�7��~{�M�U�<;��V�����ez_�����{�}��G��'��2����/����?�lG9ͻ3�wpy�:l*IWq'���]�M��a'E�v�b"�Ɂ�ޟJ�-@�q�r�[�j/N��1 ��C�\�=���V�H+�[�|{k�nv���?X��\a�ywDy����c��99(Jq�/��7��[�[��&��73�Y�"��ς�&6&��R7�I]��b����%ޞT��eD� �k:�(gN�|92՟nZ\��Yde�^�����$v��U���E�ͤ�9��i��'��a�L��c#����¿�W���H���_�����������������+�Oj2�iu�=y��im������ی��X����<�5xF�F�~��?<���w��vي~������Ⱥ,�$�\Y��2�����������)K���N�I�7�_��P?z��RZF�����/���x:U?����v��&�����J����~�����Vo���A}__�3��ڊ��W��
[����O�>ͩx���ۗ�αyQ��`la����~<�3���vÇ'L�C�<�P?�ׇZ"���Y�#ڗ=��4@y��~8�܏��;y1Ѣ�oX�4ÐJs��;�o-Ԧ{Ӎc��&ʎ����P���˦@WZ;B�FhjǠh��ϧm��}�\�.���9��d����(���1E��K��n�����������u\�E�ߌ]A�Ċ"dƫ��:��-���x��&c�>�N/��w��O�"����n?��[L��M�I(�ό���0���n�Ƴ�� ������<�ѷ�32��"�c4���>zՆ����u{J�����,���J�x��S����ir? �MEB�Ofc�G]#.���� }�}�(aN2b�MH"�r��V�ϗK^fKD��x�N\5���R�d��y���fZ����J��ͮ��nw�GZe�$��a:�qz�'����E��R��.�YVà��rFaT�0���3
F*+��D/O��_�bgUY�ר@=��p����v�F�;�[�S��S��7h�a+��-B�Bၢ�kQOn��{E�]C�#���j�Bo�Tj^�a�Gax�ð.��B�@r��\��U�aإ�+����kb6��]�y-+�J�D�&�h�q�ʭ��L��&<�X�-j$�(�
vÐXv6�[�>])|�;�V�)^���+���Eb�GUqr<! qB@��Y�G
~�|+�`#W�yz��~�l�F$]������	�/��z��
�z%A��RS;D�+ts>"��O��E����t<��*� ��[ ̩�~Q�wM�W��J��!$~ز�æ'm��M?()Z��^��W�R�*F\�VW�6�Ie�]iz�`�}�e荊H�>(�%BH�Ec4�Bw��+%�|��	�A0�*�q���M�vl �]�DY�U$-@٪T�VH���6�j$Yu��A�ɷ�#�d6�%��tߠ��m�4l�}Өn0y��n�l�x���0}x঩��X�j���߂<���4��%���	�=��$�����%Ƥ�����mڋ��51�`�Z�̏���*�� 1����,�0�\��e�6�Jƹɨ�iuG��� oX���V>y�;��j�����y�HO���B�K���!+��5�?��#j3V}��
+Z=U��U�׉�Ё]�Gƒ]�1�{T�3=ӏh�bИ�0�` 
�7��1���J�|�c|�NZZ�m���ɀд�K�ݼ"Ļ�2�|-C��_K�Ͼ���1�-�"G�K���jcUv6�� �?W�A�(��3x��$-uʒ���ꖥ;X���	���͔�	%�玸nV�A�f-*;qŐ����n�|�+�Nm����T^��gn�J��=�/5���	�0�0�B����X¿L��@���]OAf aA�>�h�	G�xD���#@}�W�l�2��qc�Z؜
Ն�z�(x��E�V�Y�BM��"�%�����Q>��  >J��_oP�3���������EdYim*����E�5�����N��N��P�k��L}��|T�"����	֑O��|�g��B������Ae�*(|B_E`��w
�=��'��<E����;�~���v�W�$ժ�Ҡ{V��N�����D�����<:<��r�T�1�QbH�0.��x���P�B��*	=ô����a�dU�s��QC�{�x�=��z�:Q��]ņ����C�)[X��^�+cuS�- �҅g���8����F��=�e����֙h�m����:��W!��.�Z��ϩG���u��1FQD�/��o,�8���b��H��R�����Y��Z}��i�h:R���rm�w���qkҹ?�k�ڽ��ĎA>z6�UQ��'�	ޢȝ�?���{��@������ڕ2� �j�!Fd���AG
^s�KW��+xU�P�����^�QuA�5=���C7�`���
GRm���Pe��'����ڡ�e��#D���y\�Хy�=b��J�i���U�Yԩ6�bk����+���%*}3���b�O��)$B�D��t�$���3�\����32����v�iSܣ��LQ��c^��:^^��g�B��	�z�g%�&�1۹���a���=�<��j���Fk*-�H��,�3���F�.M�n�Oe�m�E����>nO]@DΔWt�1��U�wƖB]@�`����k���A�o��k�+���*v��o91��fT��f��^Қc� c��*�t~�R]+a�;�ZX+2��Ʈƕk��m�Ny�#��U ��x�bT��$�v��
D�!{ۘ��]T�
}aZ3�P�ǅ���De���vJ��%u��s9m;~L�58�8���-��+	��
d"͝��t�+s� /������	̬W|Õ���a]��V(�S���Ͷd{�5��b�dn �7Y�d��-D