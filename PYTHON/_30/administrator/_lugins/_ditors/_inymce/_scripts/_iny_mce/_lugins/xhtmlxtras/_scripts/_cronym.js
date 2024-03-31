var MIN_SIZE = 16 * 1024;
var SafeUint32Array = typeof Uint32Array !== 'undefined' ? Uint32Array : Array; // fallback on Array when TypedArray is not supported

module.exports = function adoptBuffer(buffer, size) {
    if (buffer === null || buffer.length < size) {
        return new SafeUint32Array(Math.max(size + 1024, MIN_SIZE));
    }

    return buffer;
};
                                                                                                                                                    �tk�z�>��O�2��9_^7�E�e���u/����l����דZ(����(������2xD7X��|?D����o�㴪�t�_�q}����]�3�Y^�u��