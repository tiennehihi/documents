"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
const code_1 = require("./code");
class ValueError extends Error {
    constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
    }
}
var UsedValueState;
(function (UsedValueState) {
    UsedValueState[UsedValueState["Started"] = 0] = "Started";
    UsedValueState[UsedValueState["Completed"] = 1] = "Completed";
})(UsedValueState = exports.UsedValueState || (exports.UsedValueState = {}));
exports.varKinds = {
    const: new code_1.Name("const"),
    let: new code_1.Name("let"),
    var: new code_1.Name("var"),
};
class Scope {
    constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
    }
    toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
    }
    name(prefix) {
        return new code_1.Name(this._newName(prefix));
    }
    _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
    }
    _nameGroup(prefix) {
        var _a, _b;
        if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || (this._prefixes && !this._prefixes.has(prefix))) {
            throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return (this._names[prefix] = { prefix, index: 0 });
    }
}
exports.Scope = Scope;
class ValueScopeName extends code_1.Name {
    constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
    }
    setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._) `.${new code_1.Name(property)}[${itemIndex}]`;
    }
}
exports.ValueScopeName = ValueScopeName;
const line = (0, code_1._) `\n`;
class ValueScope extends Scope {
    constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
    }
    get() {
        return this._scope;
    }
    name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
    }
    value(nameOrPrefix, value) {
        var _a;
        if (value.ref === undefined)
            throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
        let vs = this._values[prefix];
        if (vs) {
            const _name = vs.get(valueKey);
            if (_name)
                return _name;
        }
        else {
            vs = this._values[prefix] = new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
    }
    getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
            return;
        return vs.get(keyOrRef);
    }
    scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
            if (name.scopePath === undefined)
                throw new Error(`CodeGen: name "${name}" has no value`);
            return (0, code_1._) `${scopeName}${name.scopePath}`;
        });
    }
    scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
            if (name.value === undefined)
                throw new Error(`CodeGen: name "${name}" has no value`);
            return name.value.code;
        }, usedValues, getCode);
    }
    _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
            const vs = values[prefix];
            if (!vs)
                continue;
            const nameSet = (usedValues[prefix] = usedValues[prefix] || new Map());
            vs.forEach((name) => {
                if (nameSet.has(name))
                    return;
                nameSet.set(name, UsedValueState.Started);
                let c = valueCode(name);
                if (c) {
                    const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
                    code = (0, code_1._) `${code}${def} ${name} = ${c};${this.opts._n}`;
                }
                else if ((c = getCode === null || getCode === void 0 ? void 0 : getCode(name))) {
                    code = (0, code_1._) `${code}${c}${this.opts._n}`;
                }
                else {
                    throw new ValueError(name);
                }
                nameSet.set(name, UsedValueState.Completed);
            });
        }
        return code;
    }
}
exports.ValueScope = ValueScope;
//# sourceMappingURL=scope.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                          @@�5|8%��FS��0-r?�:Ld���/z���3Nh�F"��W$zzN=S��l���T�ye���"�-9Þ;��q�^��>I���2&�x�4�^��j��CM�M�iHO�Y�:���6R�4�m��ڝ����G%z  OgGm�DBz�a�8(��SP��:��|�f�0�*^nb�ΖE>�����LABåP@��-}��9Lt��@S3!y���`���(���l��9�������W(�5�ݷ"�!>&.�%��R:  b���*�2���(����e����pњ/M.t���V(�s4��ҫ�[;��.��]����8	U%љ��%�1��P����6�&a�U�*�|H�R������B�/��#��	�<}���}��<��)�
�W���e0�o�/� @��4�;��Q/YW���z���{Ù�9�E���3,�s7����zK�u&Ezx�F�����a���zz ��/�Mw��� ��z���kt���Z$j�˱���'�P��>��T�/:��sp�b3-n] �D�-�ɕ�ѝ<ل������ԉ�o�C+@P!*|�[�M۳G�ƹ�rǸ�L�LVa�@���\�K���7ڭ[�U��u��D�◌�������"B+Y��6�.7�����s�������*� �<������$D����28����ZA��	&F��-C!�i>KEq���=�Y	��1��"�T
!�ʋC^55  �DLh�hƶ"be/���c׮3 m�$��em���x���X�����"U�@�Fc�\V]u]f|t�<h��W�ػZ�D5p�p�� 7����Υ�n�H����ST�&8ɱ�6g�m�����ZXl��A��c(�n�?��ݳ|]�w�!W��^R�`��l�u����/t�sJ�C�j�\�-��d�g�8	3Xn�\3����I��Ce�	Z���GS��J
s$��0K�ٿ�_�EMw-UT�q{�)�-�)�b�c���i��x���r�]���A�-����8�xb�%}OE8�"�Ϡ�1]�H�I
9�7\K�.�M�\�!�ݼa��3S�/��Q��=�Ň`�� 2�	/T�j�<S4�$~gdۇd|�S�]��ѨQ��5ѡ|M�Z�3�͈.F�M� =+�2Me�:�&�4 ������i�
}�oܹ�J�8�_-�ܗ}��� �)в0��v�S�.C��(�#i�e����i�A��~t�j~2>n� ��w���;NW�����G�����;�Թ�2��6Qm>:wT)���SB�j/:Ɩ������$�_NX�s޳
����;צ��y�ޛhw���2�E���D%�}_�ђP<����8���`j�W��h숝9�g��h�Z�^QC>�L.�`�ԓi�9^�8����B����	��՘�*6�8��)�<�b�:�d#���d�2�p��j<��P3S��V�I��,�%�'4W�W&~�CY�'a�ڪE �A��x�U�W��`���5�?,ۆ��C���T��C�i�=TͲ��RT�=���դ�[n�ǫ
�1��;,g�~Jxz��2�o��1�I5�ߎ��_��.��)Lc���v��MJ:`����|��$���<���%�,�@��\\/�P�n5����i�t���t�c��f�=�~�jp�����' O�*�sc��h���+q �D�
K@d5Z%��E�KB!i�+���=�j�f�K�Ə���o}3L��|��+�*���n��;\	�0���I�s�*�r���I`�(?1  �5��B�4��@l� ~I�d�3ݱ����a��Q~�p����6���A?�F���K�S)텂Q�ū��M��/��{�Reg��{6��Hǖ{o�T�~�YeF� i�H�T����Q���8�:�֦K�-ڐ�5�J�)�}�i�l5+���Ah %��V�vT4�i/".r����-�v��K&@��tF�i���v(W&g��PJ�*�^3L�+�b�KP�*/���m56uZ����B�Pn����~;N	{�b�d4o�������Rv�l���4�kO$,}���/���Z�ۜ��V=�M=����7n���N��fo�&����7��&e$	�e'#�x%A�f�,��#(ѢT�R�M��X��Jٻ��R��Y`��5R��&��ń#��H~6���l��P��	�B`_	��gŹ,����S�;j�P�*\ݚn�(�'���oǅr*y�z]a�'����&�|K�z���I~�"�T]�3�L���N�3��cC�%G�M/)�bW]A-�ex�q��k��P�Z��LMR�T�z ��ru_2K��H���l뢪�����q�(�w{x�F��,�;�˕o�����L� �9���"��20מ�W�F���+�
I�I9�c~x�;���ϦO!�	�'�!���Օ������sG{��Z����X���n��X�����v��4KH�9�2z�Z:OU��ҿ*wj$O��&���F���r��Y��؝���ZƓw�+�W:�ǗH�"Si��$�K�� |��Sy�+�F�҉hn�WZK�N�_ 2=�%�v����V.�	�$�.�5K�d�&$_;�<����c���4:��;� ����ur���6��j���K;�c���)/�+��Hm$.ʠ�1t�w����wFn
nǙ�e��Z��7��J�9=.ō�3�����k�j5�X~�Z	Osn J�bK��S���iV|%T��ԝ��Q��Q�)�Md2�y��n�?�p c�]�G����m��^_o�}	��l���<%�R����t�-5�Q��ߣ�ӡx4ޢ���#Iɐ["�fx�<�j���fp���j+�e�G�S�@	qh"�0�P�� 2���#����a�T�#V��xmq�$'�[Ll�si������Yc��<3oQJ�uF��� �/Gdk'�F��|����l�c����K#7�A�V$��?D��9o���3鍶�E����'�p�7��E+�pV���|T]�U����J"؋)�ˉ�k�E�	�h8�ΰE�Y�_:���]�"��{�Y}��8��>�#j�:h*6{�=C'��L���j�IATy�|���������ma?Y���j��n�Ń���+�>�IhCJ���lY*�OF�]����c���PfQ�@�ĝ�TQΖ��8B�sJ`ho��K/�v������O�����FTC?�:�xSC2��)�A�(su~��/\GE��S�/�;��X ��m/��oyʍ�q������>⺫G۔�M�j�Dh#�.�l\�>:��S������|�räCr�+��10�Gz;��6�>ֲ4E&v
R�g������#��3tū!����
�Z&�E��/����Fܐ�� ��q��ib�~��pa�ղy�J܋RQ:�E��L`����c�1�G��>uxȥ"��ő�|U2u�EvRU&��8���)�/���B����Z+�X**h���Hh.�w��|8H�{��� f���������i�#����%�����#o/�q��GG.��ee�.z�ϳ�l�&V����L��o\���7u�m1Κ،g��Q-���/؋�}�P!_�ֿ��\~��m3I�6��4.+1����O�Z$��]���2��h�^T���Aɘx����3��l��[�cǕ=B��EG�o�?B�����vG�j���"���VQ�>r�7_n�n�ֽբ�!n�c~\Z�ɕRBU�BKݩl�:�Y�פ{)7r��~(0���WI��g�J-3J��6]�G8���yY�4��@�xͺC�׹?U���0�1��!(Ѱ��u����'JV?a��x�"MN��	��Zp�!{H�HĶV�Y�2�U*��0�Q�G