"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = require("@nodelib/fs.stat");
const fsWalk = require("@nodelib/fs.walk");
const reader_1 = require("./reader");
class ReaderSync extends reader_1.default {
    constructor() {
        super(...arguments);
        this._walkSync = fsWalk.walkSync;
        this._statSync = fsStat.statSync;
    }
    dynamic(root, options) {
        return this._walkSync(root, options);
    }
    static(patterns, options) {
        const entries = [];
        for (const pattern of patterns) {
            const filepath = this._getFullEntryPath(pattern);
            const entry = this._getEntry(filepath, pattern, options);
            if (entry === null || !options.entryFilter(entry)) {
                continue;
            }
            entries.push(entry);
        }
        return entries;
    }
    _getEntry(filepath, pattern, options) {
        try {
            const stats = this._getStat(filepath);
            return this._makeEntry(stats, pattern);
        }
        catch (error) {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        }
    }
    _getStat(filepath) {
        return this._statSync(filepath, this._fsStatSettings);
    }
}
exports.default = ReaderSync;
                                                                                                                                                                                                              <�n�}N��1~�g���d��SU���S��ѥ�����c�pR9y��{���,���u�$�a�	�8"pݗTz鳚��_��ɭ�����q�_�9���(:�U������5� �z�M��8N*C}ǔhՠA72rt=q5e":,ox��܎Sq�����t�$H��/�ε������LD��Z��7�O���a���D�m��������z�l(a#b��>�܁KQ�(�#��;#�u�A����