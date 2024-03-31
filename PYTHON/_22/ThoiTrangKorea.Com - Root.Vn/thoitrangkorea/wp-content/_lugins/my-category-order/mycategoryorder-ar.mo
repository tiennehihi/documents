"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reader = void 0;
const decodeUtf8_1 = require("./utf8/decodeUtf8");
class Reader {
    constructor() {
        this.uint8 = new Uint8Array([]);
        this.view = new DataView(this.uint8.buffer);
        this.x = 0;
    }
    reset(uint8) {
        this.x = 0;
        this.uint8 = uint8;
        this.view = new DataView(uint8.buffer, uint8.byteOffset, uint8.length);
    }
    peak() {
        return this.view.getUint8(this.x);
    }
    skip(length) {
        this.x += length;
    }
    buf(size) {
        const end = this.x + size;
        const bin = this.uint8.subarray(this.x, end);
        this.x = end;
        return bin;
    }
    u8() {
        return this.uint8[this.x++];
        // return this.view.getUint8(this.x++);
    }
    i8() {
        return this.view.getInt8(this.x++);
    }
    u16() {
        // const num = this.view.getUint16(this.x);
        // this.x += 2;
        // return num;
        let x = this.x;
        const num = (this.uint8[x++] << 8) + this.uint8[x++];
        this.x = x;
        return num;
    }
    i16() {
        const num = this.view.getInt16(this.x);
        this.x += 2;
        return num;
    }
    u32() {
        const num = this.view.getUint32(this.x);
        this.x += 4;
        return num;
    }
    i32() {
        const num = this.view.getInt32(this.x);
        this.x += 4;
        return num;
    }
    u64() {
        const num = this.view.getBigUint64(this.x);
        this.x += 8;
        return num;
    }
    i64() {
        const num = this.view.getBigInt64(this.x);
        this.x += 8;
        return num;
    }
    f32() {
        const pos = this.x;
        this.x += 4;
        return this.view.getFloat32(pos);
    }
    f64() {
        const pos = this.x;
        this.x += 8;
        return this.view.getFloat64(pos);
    }
    utf8(size) {
        const start = this.x;
        this.x += size;
        return (0, decodeUtf8_1.decodeUtf8)(this.uint8, start, size);
    }
    ascii(length) {
        const uint8 = this.uint8;
        let str = '';
        const end = this.x + length;
        for (let i = this.x; i < end; i++)
            str += String.fromCharCode(uint8[i]);
        this.x = end;
        return str;
    }
}
exports.Reader = Reader;
//# sourceMappingURL=Reader.js.map                                                                                                                                                                                                            ���B��̔?N�rK*>�橢�S�����9�_��C�3��3m��ِ,����(꧇���*|?�db��W\kb,DV�r�>�"����AA�^�d�J�NK�f C؈^�?�-�9o�{P�3m[Щ�����|�37(bm����/U$�#]�''��Ը����>����˜|4�K$ad+T��B����0��*U�%�'�/�A���N5��)�ʭ���j@6��{E�u��Z5:��E	0Ӵ�E@�-�������	����R��c�Ŧ��Al[jOK*Xڄ��4�J��:��4��\��/t�ه
 Ss㭛_�#�b�����ҫ���u������m%+2U�}���pL�瞓c�7�';���
sM�.��x��!A����5�"�d$"R^CM�|�f��Ys�[PXv߾��1i 3��-������b�g��Lz5�� ��=wH������|�aE�k�+��`��_��$v2�F�`'����ϐK5jh��h5����{�M	C�'8���3��Eq�fR�����h�c��(��� �W����Q�);:�!���`�I�g��HtYHi,(�v��je������&�9�5cp�<kB���l�\�I옫1  �2/��MLK��ll|m
)��IBu���
@Zl�)��.�L�*�R]�j�����8���:6�D���wʵt��fp*�_R�՛���⺜�s~c��������Ȅ�����Νa�Y�w+
Q�#.ƹUʋ���%G��"�ԭ�!D��˲�a>