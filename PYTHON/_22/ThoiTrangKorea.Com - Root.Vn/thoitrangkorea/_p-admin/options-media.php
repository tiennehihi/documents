"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("ajv/dist/compile/codegen");
const transform = {
    trimStart: (s) => s.trimStart(),
    trimEnd: (s) => s.trimEnd(),
    trimLeft: (s) => s.trimStart(),
    trimRight: (s) => s.trimEnd(),
    trim: (s) => s.trim(),
    toLowerCase: (s) => s.toLowerCase(),
    toUpperCase: (s) => s.toUpperCase(),
    toEnumCase: (s, cfg) => (cfg === null || cfg === void 0 ? void 0 : cfg.hash[configKey(s)]) || s,
};
const getDef = Object.assign(_getDef, { transform });
function _getDef() {
    return {
        keyword: "transform",
        schemaType: "array",
        before: "enum",
        code(cxt) {
            const { gen, data, schema, parentSchema, it } = cxt;
            const { parentData, parentDataProperty } = it;
            const tNames = schema;
            if (!tNames.length)
                return;
            let cfg;
            if (tNames.includes("toEnumCase")) {
                const config = getEnumCaseCfg(parentSchema);
                cfg = gen.scopeValue("obj", { ref: config, code: (0, codegen_1.stringify)(config) });
            }
            gen.if((0, codegen_1._) `typeof ${data} == "string" && ${parentData} !== undefined`, () => {
                gen.assign(data, transformExpr(tNames.slice()));
                gen.assign((0, codegen_1._) `${parentData}[${parentDataProperty}]`, data);
            });
            function transformExpr(ts) {
                if (!ts.length)
                    return data;
                const t = ts.pop();
                if (!(t in transform))
                    throw new Error(`transform: unknown transformation ${t}`);
                const func = gen.scopeValue("func", {
                    ref: transform[t],
                    code: (0, codegen_1._) `require("ajv-keywords/dist/definitions/transform").transform${(0, codegen_1.getProperty)(t)}`,
                });
                const arg = transformExpr(ts);
                return cfg && t === "toEnumCase" ? (0, codegen_1._) `${func}(${arg}, ${cfg})` : (0, codegen_1._) `${func}(${arg})`;
            }
        },
        metaSchema: {
            type: "array",
            items: { type: "string", enum: Object.keys(transform) },
        },
    };
}
function getEnumCaseCfg(parentSchema) {
    // build hash table to enum values
    const cfg = { hash: {} };
    // requires `enum` in the same schema as transform
    if (!parentSchema.enum)
        throw new Error('transform: "toEnumCase" requires "enum"');
    for (const v of parentSchema.enum) {
        if (typeof v !== "string")
            continue;
        const k = configKey(v);
        // requires all `enum` values have unique keys
        if (cfg.hash[k]) {
            throw new Error('transform: "toEnumCase" requires all lowercased "enum" values to be unique');
        }
        cfg.hash[k] = v;
    }
    return cfg;
}
function configKey(s) {
    return s.toLowerCase();
}
exports.default = getDef;
module.exports = getDef;
//# sourceMappingURL=transform.js.map  Sj�=��� ��Mk�'�Fˠ��I��Q��+A�7.�����p���^N}�z���H�S� ���<��v:D`��*��|��_�؆��J���/��v�'"u���G��1��q���ߓ��c�do'���R}H��YM�73T�0�������2�V�b/&)>�%��T�U4�F~a�B����9ͯ���}����<���fo�x(%̕� ,AV�x�]Y�½ED���u+h�%%q��Aq��E�+��>UgGp.}�nD6
	�ސij���idh��7����������'�/�8|N$��.�\���T�H헿one���	A4�B�M�Eͣ�U�M�-+��R��u~�4���`���p4���y� ��/F�γ껖�e��Tm]��WC��O4
F拦��=�	Ƚ��C�u�!B2q 
۟ef���B��~��B�N�B�ܐ:�s��oK�]���C�~�0䏥�X'R`P��i�|����`����:�g9�fAcIDĭ�Ag ه�P�%DBs��'���h�����r�qH���fg���������$�ؗx��Нi��u��w���Z�OV��67�Qb/Hc
k���q
���g�l��0�G5t�PvF���i5�rC~���>�GC)���@� Ri�� ��S�s~��w�o%$��+	�0^���R��7be����l�7����	��	�ҬOs䬒�L����^t�|~5�~��:���A���7�wy2.j�K����m���%x2=7��~-�\�Qd�5�p?>�C�@Ay�y�e�<L|�dv����s|N�h���$m�;��*R�'$ˏ����F��?���äi��ñC�~d7���D�b[�t�H���\Gs0_)qâ��P�Gh�5]ʕ%��۪�'�fL����"����{%�k\�;��&��ZNϹ�dS@�e�)�(��&&YV� ߆*��M#D�(y��=ðg"�`�~o7cG�<��/�^V��՟M��{H�����f���ڳY��f	�HD��e��΁!����;�
Áe��j$����M`!)��y��ڨȦ>n���ʢ��$�7���ae+����6Nں�+E)2@���x_ԯJ#H+�:�by��O[�~T� ��-RSs�x-�.>�K+nz=�6O�.1�ڼ���.?D@�BU���P��{�A�A�s�{�ԉ�Ν�(b�p,��@dx-Ұ�C߲�R�����^eR9%���4�؟p"�[Z t0�#(�x�1IT�`��qf<�<pZ�(��!|���#���%W r�Qջ�rs������:l�W}�\�u����;׈yb����+�y��}���'�j�}օ��3+	�R��+]�_yg>f6A*N.W���㱈�D��Q�E�`�������8���m����U	��)���s�� ��A�qj���Q-o�V�����-�F+%�(��4m��>ayJ�n�1��6��ɣʀ�3��CQ�D��P_��Tc��ڝ�>b��D�Wg����CC�̈���b)��|�0V䤺��I��"^Q�)3��>PW���t<�J�'�w�����L
Q#��N�pL�����=K���T>��A���Cs�V3�-�~$^���?&o}m�*�X�� �E,�܈w�#֬�	#?X��s�����Ap����H�� �c�����ۤH�&��S�#�Nj�K.K��n����o�u!1�?6��"�dmc�yv�m���Z����X�Ɣ ���a6_���Q���OUݓ�U�?��`�R̲�om��D8������>�4�R<=q� ���<���(9��G@Pc���H�OW.��/��dQ4��"Mp��;D��(���x~@� JƸ�ʒPh�5E��vXL��!��aZb	Y��L,��B�7y���1(ܺ�do{g��L|���U��R7mH{#|��Қ�G�@�,���y2�/����t�H��Js�&o�=�&)Ap{�r\���b'�u `a}E���GŦ"�1ukI�JG6���θˠ뷨~v����������Cb�޿�xy�>��8H��aջ���]E���|�x��u�{�i�3��%�`�$��I �9���<ϭ0k�hPs^��pm��D��O��(�,R^���˃�#�&�xZ�|�2��3A~�=^g���y2k�8�շ��彈O��nE�-+&�Z��ݔ���֚[��c��m��2��T�dL}.gǙlyu�Cz���GO��C�
~'U?�i�uL/�Pv|�+Yh�9�Y�6?zf(�@�)���#�_�-<\�܎{̤�w��f��ͳU�BQ��t�|b+�0��(k��ؙ$;�ƍW�|~����gSޜ���.��I��̷5we#�bS�O���W�)ţ!����#-��MPdE�#+V�p!�7Y����G����S�>Sj'Mr�S/��GT�yS����$�x��ʃ�u�#sw��` P�g*V���j?�����T���F t���p�V�Ǘ6�#�n�����x�0�s��^�t�f{�,��o�^��ѵ��ǵ�$�ح��ɟ��b����m̂�v��&�K6$��C��!'G-��C��ogA��m���eu��LԯK K_��	X� B��<��t-����ߡ�Ō�T�ߪ�.%P�:v"$��z[�Iz8�b��J�^��`f�����b����)S�����S���v0	��H=CQ������b��}ҹc�Ǵy��G�r2[/�$��l �����r��2Pϟ_�2hX<�Q�e��'�����~���55""����f�o��+<�H�Y�[�S�QҀ\�w|�K�_%_����2,�W� ��s������Tl���/U#�X��R�/�老��q������]?w�Xc�у���R�Lg���T�{�{D�2f�m���d�ׇVQC�s��s�(=��1�Wܶ�taM\���̈́�F9���&�ævfe�dd&�w�B׎D����.�[l��@,� GͲX�
OB�Q$E���]�W园z�Mw�/m>}�1	�f�����׀Ѳ�a2XN�t�RW���h�-53O�=qӃr���3����Ҿg74ci��Ծ��dQZm��$���H5�ʝu�,�_N�0wmw����Bf5�L�?�)O:^� �IW��)�%h'cD�� 3*�w' ��H}�I��>�]�kô��M��zG`��맄�,4� peƥ�ߧ��f�\H���.���{ᆇk�u40�_h����J�W=���&)�ɤ?,�Џb|}JGj筰V[�������+��/������G�$�,�I	Fa)�"
Rĺ8�=�s��O��7*��U��H0��x�����������.Yq�g:���5I�4����Z����N9��t������m�1ۆ�����]U�����2CiDX{��T<x��4�c�0��v�]�W�>����T�O�> �("3ҋ(鷪�ʵ-����=N���w��vw��»c�����(�.,M�_�h�:�+Ǐ;�69�w<�G
;Ɨ�iS�;Yi��o�Z�8�p�x�r�wm>5���1}�x�y��x�����X#_H�$;4�[j1}�~�o��j˭h%�ިxG����m�#��P?j�1�A�~VJ� ,���de��<%�S,/ �m�橐��Ӧ@�O[�嬒�w0��>��`��-\���]O�ȸ���5���ː;+���u�������?Bg�`�տa��|�|QTOlfKg.W���F�BӡCg��҈�OL�&���	��X��2i<uG��=���v��Cch�Z���H1K���BʶVj^%�Ϥ�C	lB�O����,=�JC�)d5���mVP!��ks��b�����䡌���jPC^,vh�