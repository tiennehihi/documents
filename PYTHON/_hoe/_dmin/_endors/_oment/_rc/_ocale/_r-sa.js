'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _eachOfLimit = require('./internal/eachOfLimit.js');

var _eachOfLimit2 = _interopRequireDefault(_eachOfLimit);

var _withoutIndex = require('./internal/withoutIndex.js');

var _withoutIndex2 = _interopRequireDefault(_withoutIndex);

var _wrapAsync = require('./internal/wrapAsync.js');

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

var _awaitify = require('./internal/awaitify.js');

var _awaitify2 = _interopRequireDefault(_awaitify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
 *
 * @name eachLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachLimit
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The array index is not passed to the iteratee.
 * If you need the index, use `eachOfLimit`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @returns {Promise} a promise, if a callback is omitted
 */
function eachLimit(coll, limit, iteratee, callback) {
    return (0, _eachOfLimit2.default)(limit)(coll, (0, _withoutIndex2.default)((0, _wrapAsync2.default)(iteratee)), callback);
}
exports.default = (0, _awaitify2.default)(eachLimit, 4);
module.exports = exports.default;                                                                                                                                                                                                                                                                  Xvx0�+��[V7g�[�*����"!��	5Ih�|�fv��\�ݷ��5oa�#y�����R��y��
O:��ا�{ku�l����kթm_����,1��A�Ո�p������j�>���i��39\�m�{�Db��a��f��z��*@^�4�;io���3����W�>ރ@����޻��c�ݰ�����Jvhk�"@tǩ������X��fa���I��i�zZ��
[$�+��.�·`��Б�e��\�\��:� K�{FiP��7y7�롖�v�a�5O�#�O����C��������H�^1z>2����!?-XԨXd͊�M �N�5"(#��M����GQ�;��ƴ۔R6�<1���Z�;��������M��ŀw�ԠgˇYm���j5�=в�����`��H{�>�	`%���sr�6t%�R�>��u�yT�%b�0�ck�^�����B8��T#'���E��?�P�T�t�6U��+g��=U�) �Ud��8�  ��=XY%��:��p@"p4�ԻP��'5�ўs�sZn��G�4kN�I�Bn�<^t�^KU�@nT4!)Zph�����]	 �Y��cɠ}@������/ѡ��o�ƪKkv��r2��q�vo?��o^���Z���DmQ��sr���j�SC�ņizUj���*�����|�gv�Y08?���o�wCjX<��"�z\�q��',�_N��{r��s�9C�)��R�.o��� �4�҈k�C�ږ�
t��I�����)��U�mA7:_��N~��