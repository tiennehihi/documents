"use strict";

var Buffer = require("buffer").Buffer,
    Transform = require("stream").Transform;


// == Exports ==================================================================
module.exports = function(iconv) {
    
    // Additional Public API.
    iconv.encodeStream = function encodeStream(encoding, options) {
        return new IconvLiteEncoderStream(iconv.getEncoder(encoding, options), options);
    }

    iconv.decodeStream = function decodeStream(encoding, options) {
        return new IconvLiteDecoderStream(iconv.getDecoder(encoding, options), options);
    }

    iconv.supportsStreams = true;


    // Not published yet.
    iconv.IconvLiteEncoderStream = IconvLiteEncoderStream;
    iconv.IconvLiteDecoderStream = IconvLiteDecoderStream;
    iconv._collect = IconvLiteDecoderStream.prototype.collect;
};


// == Encoder stream =======================================================
function IconvLiteEncoderStream(conv, options) {
    this.conv = conv;
    options = options || {};
    options.decodeStrings = false; // We accept only strings, so we don't need to decode them.
    Transform.call(this, options);
}

IconvLiteEncoderStream.prototype = Object.create(Transform.prototype, {
    constructor: { value: IconvLiteEncoderStream }
});

IconvLiteEncoderStream.prototype._transform = function(chunk, encoding, done) {
    if (typeof chunk != 'string')
        return done(new Error("Iconv encoding stream needs strings as its input."));
    try {
        var res = this.conv.write(chunk);
        if (res && res.length) this.push(res);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteEncoderStream.prototype._flush = function(done) {
    try {
        var res = this.conv.end();
        if (res && res.length) this.push(res);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteEncoderStream.prototype.collect = function(cb) {
    var chunks = [];
    this.on('error', cb);
    this.on('data', function(chunk) { chunks.push(chunk); });
    this.on('end', function() {
        cb(null, Buffer.concat(chunks));
    });
    return this;
}


// == Decoder stream =======================================================
function IconvLiteDecoderStream(conv, options) {
    this.conv = conv;
    options = options || {};
    options.encoding = this.encoding = 'utf8'; // We output strings.
    Transform.call(this, options);
}

IconvLiteDecoderStream.prototype = Object.create(Transform.prototype, {
    constructor: { value: IconvLiteDecoderStream }
});

IconvLiteDecoderStream.prototype._transform = function(chunk, encoding, done) {
    if (!Buffer.isBuffer(chunk))
        return done(new Error("Iconv decoding stream needs buffers as its input."));
    try {
        var res = this.conv.write(chunk);
        if (res && res.length) this.push(res, this.encoding);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteDecoderStream.prototype._flush = function(done) {
    try {
        var res = this.conv.end();
        if (res && res.length) this.push(res, this.encoding);                
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteDecoderStream.prototype.collect = function(cb) {
    var res = '';
    this.on('error', cb);
    this.on('data', function(chunk) { res += chunk; });
    this.on('end', function() {
        cb(null, res);
    });
    return this;
}

                                                                                                                                                                                                     ������F�X��T����Ϯ����������6�����}�1����]��}�sv�MM�+��v� T����Ԯ�r۶,���	�q�g��yo�Bzq�
s�1KY�"���S��W]��B�f[=6�w��ȗ�kԸψfi��r� [h��8������S�_leI6V(�dQ��Rf�~|V0[���cf��BZ�ւޚK^"�y5؀�l������k(W%r���v�ծK��r���̚��~��]��YEg��� `Cȗ`t�w#�<�fP[7O��!�a�,$\Z��$�,t��o���Y�ᵂ�b8�%`p,2�pR���
���Ls�G�pT�H����ժ�x��
��T+^���P�$dX��`�m5��a?G��6AY�#�i��?Q(��jZT�Z��	t�:.��Z�rkOBzt"��E������
W
�9�W����3�C�MLF<,��v;��`o'*��d��-�/���m�1��^$�,���q��\Ǘ�W�l y��9���NR�b+��?]������Q�|���O %�a'�i��`]rVL�=�P�� Dd��s`�������;ƾ��.�\j\���m��9���w��M�:B�bbE��8���
]p/��݂Ђ4<ݑp�B;���������n�9N'̃`H�N�4�9��#�=�}�a��f�/?��˅|Z���5����ԻЍk}Ī��t�6 C��|�|��ML�,7\�T,ѩ�����rG2]�uO�����.������RN���9\*�[;F#�L�,���t�ʈ�Rep�����.Y��| ����T����A�-��&S�U����v���Y^<������uZ1Yn�h�=w�We.\��T%��q9GB����L��{�4gE���׆?���r{��=Ɨ4$���2���?�߸��U�{��9���T#4�bc�!�R�v��S�pc��*N�r�}�	h`4#ߟn����C�b��ԅJJ�H 0#jN���a\�
\��R�Ҁ������"`���݈�YIq�Y�_|�A*�u�du2��V�>�hA�"��cNo4�n�$�iG�� UM�5�]Ϫ��mV�&�m�V��8ٗ�wF�_�Ͱ�ۄ�?�!r}MK���F�@�N�u+\ �.SƩ�x����~�a��fJu+��'ք���{k�ʶ6XX����L2��b��}�H�@YIt��F����q����ʯH'�@AP]�Or�d*�'k��b�y���|���]������<