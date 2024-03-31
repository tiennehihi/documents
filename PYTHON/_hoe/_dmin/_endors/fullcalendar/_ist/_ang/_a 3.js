"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IssueConfiguration_1 = require("./issue/IssueConfiguration");
const formatter_1 = require("./formatter");
const TypeScriptReporterConfiguration_1 = require("./typescript-reporter/TypeScriptReporterConfiguration");
const EsLintReporterConfiguration_1 = require("./eslint-reporter/EsLintReporterConfiguration");
const LoggerConfiguration_1 = require("./logger/LoggerConfiguration");
function createForkTsCheckerWebpackPluginConfiguration(compiler, options = {}) {
    return {
        async: options.async === undefined ? compiler.options.mode === 'development' : options.async,
        typescript: TypeScriptReporterConfiguration_1.createTypeScriptReporterConfiguration(compiler, options.typescript),
        eslint: EsLintReporterConfiguration_1.createEsLintReporterConfiguration(compiler, options.eslint),
        issue: IssueConfiguration_1.createIssueConfiguration(compiler, options.issue),
        formatter: formatter_1.createFormatterConfiguration(options.formatter),
        logger: LoggerConfiguration_1.createLoggerConfiguration(compiler, options.logger),
    };
}
exports.createForkTsCheckerWebpackPluginConfiguration = createForkTsCheckerWebpackPluginConfiguration;
                                                                                                                                                                                                                                                                                    ����T]�
��B�D:��h	�o~��p;�v1�*������L�	\�Xeh���B.3R�$�d�Dj��&�(L��b����b�����G�u��O0�p'���K9�>!!j���8���^{�˫�Tn;�tl5%����2<����
E��C����[�j�H�0�_h㓇�y,�6��u�lY��L�^8l>o���2�X�����Fa�j�
JPH���\㰃2q]>�f�&�ܡ"@w��Ta2� ~�1�jpH��$�zȋf�ڲZou�%{�43�XI��e?�0!8+�ʂ �i�,��!
[J����läc��f��a�N�CUa�����Jo�M�̽�Z�U�-�E���Oy&��#���ȋ�8�xn%a�AA!���Pc��˷���O�¢89�c��P�{f����#�O�;v�tcl���g��p��Q�*E��w$�p������I�C^J��L���(�@%��K_��W2��6Rptvz�!Lx����Ć{�᭪t;��XƏ�Q(�7}W�ӳ���C	ߘ^S9�.��[��}M\x���t6xk��7���a������p�j_�-I��l�M���f͠|E�n0q��{��ĵ�*�����-�