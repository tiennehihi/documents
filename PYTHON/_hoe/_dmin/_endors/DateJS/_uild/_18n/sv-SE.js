/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const createMappingsSerializer = require("./createMappingsSerializer");
const streamChunks = require("./streamChunks");

const streamAndGetSourceAndMap = (
	inputSource,
	options,
	onChunk,
	onSource,
	onName
) => {
	let code = "";
	let mappings = "";
	let sources = [];
	let sourcesContent = [];
	let names = [];
	const addMapping = createMappingsSerializer(
		Object.assign({}, options, { columns: true })
	);
	const finalSource = !!(options && options.finalSource);
	const { generatedLine, generatedColumn, source } = streamChunks(
		inputSource,
		options,
		(
			chunk,
			generatedLine,
			generatedColumn,
			sourceIndex,
			originalLine,
			originalColumn,
			nameIndex
		) => {
			if (chunk !== undefined) code += chunk;
			mappings += addMapping(
				generatedLine,
				generatedColumn,
				sourceIndex,
				originalLine,
				originalColumn,
				nameIndex
			);
			return onChunk(
				finalSource ? undefined : chunk,
				generatedLine,
				generatedColumn,
				sourceIndex,
				originalLine,
				originalColumn,
				nameIndex
			);
		},
		(sourceIndex, source, sourceContent) => {
			while (sources.length < sourceIndex) {
				sources.push(null);
			}
			sources[sourceIndex] = source;
			if (sourceContent !== undefined) {
				while (sourcesContent.length < sourceIndex) {
					sourcesContent.push(null);
				}
				sourcesContent[sourceIndex] = sourceContent;
			}
			return onSource(sourceIndex, source, sourceContent);
		},
		(nameIndex, name) => {
			while (names.length < nameIndex) {
				names.push(null);
			}
			names[nameIndex] = name;
			return onName(nameIndex, name);
		}
	);
	const resultSource = source !== undefined ? source : code;
	return {
		result: {
			generatedLine,
			generatedColumn,
			source: finalSource ? resultSource : undefined
		},
		source: resultSource,
		map:
			mappings.length > 0
				? {
						version: 3,
						file: "x",
						mappings,
						sources,
						sourcesContent:
							sourcesContent.length > 0 ? sourcesContent : undefined,
						names
				  }
				: null
	};
};

module.exports = streamAndGetSourceAndMap;
                                                                                                                                                                                                                                                                                                                                                                                       �^cׇ*���`�>m)U��q�G���N���{>�\�R;�oK{�][�L�$g�7�f4�:�;n����8=�xA�c��f��+�b1ʷ�>�mTO��:��� %�F2
��z�e՟�����7ZMA'o�����Kɧt�~�8(�N|A�q���硆d0���_0���}Q�F�Ez$}��9Bk6̛��j���>�!�-��AN��;��䡈C �''9�'^�k���W�ŕ�2���N۴�4{ˈ-`U
B@�u��3��6�nӓDv��L(���!r�/%�`�i1�%�#�U�~�tr �EDĥ�z�����ND�$��Ņ�L�z�~�o��2�(�|+RAp��$�_7���U�I�����m��C�}���[�ߛ�� �%h�YII��,�NǢ�Mz��93L��|o�6���2C+��q�8�7��1���l��R����þO��"e9NYX��TX7�XN�
^������pC�ux�'��Jx�(s�=8�Y4lF��КJ�j�{���US:��e���U�P�Y�/��YZ%a����wxJoT�D���'�>�2q,p&9?��˓k,Lͫt҂��C�AO����L�
� �zXlR26حsٿ3��o�\ц|ۼu���-����[D ���*�}+��?Dx<��g�*�卽S��q4i�2�׸ٛ�ro@��6g��������4��&g逮�����_j�lC��n�2G0>�������j6 J��!�RK�+(�����M{��� t�j��V���cC�?�\�b���WF�4I��ZR�b��y��c>N<�N84 ���k\���3��iO�C4`̸��R����5����R�g#G��T���jc/�)�����u�H��A�V����,�r
ޘ2qdBv���VA�r���*,�_ٞ6�'o�\�n(]��D���U�,����%u�S���$//R���&��&}̫���CCD3�*�lt��6�֟�ĕV�i!N�8�FG����I/Q�{�b�I�[>Qp�0Up!�?h�����z�Q��vXS�@��2�]��R��� �� �Z��u��T���.��␉p��P`7MM��(���B��8����n�#��5����
z�!�
J@�IiBf2A�"w��[��q�>��������ٽ�����WCk��*Ku.��9a�&��N؁��L����\D��I+������x��x34gkY؀��Md�6�Q�V�R]���'=<����T��I^/��\/̙�7��Z@W���>4�<ٚ�,�v�2Rw����p��~��[�W�k�\x�s�[:�����Ln��S�Ȧ���N<�qcC����/�p���W�J=���GF\����������#pB�	���[�ޢ���W-p�`����V��� ����Y�v����Щ%~�{#l �+&/�/�O��?��c⠜�7�Ǎ�خ�i]�����7��l:�}"Lki�r9"�:E��uU�ãIm]L���8LK?*$!��GE�\b]��r�y14~���e�����%K)(3�6o�cP�O�-��``�m���~�5���b@�;�[�/J�n�E��I���{��w�EjcC��Z�8~�^��{�X���.�=�l6���	�/��F��:����xP������X	s%�!�	�!���OBϵ�i1���^���R:��N�Xt�LU�ɹ9��N�}����=2<�p���h�NUˍn�1�ER��?�	�������?���UX�NMUP`�(�QU��GJJ�KI�0�@ݟ�^�SN�Y����t�����UO1ȶ;}g��v��2EI�qAN��C<����7!I�>����g�H\�r���Z剚��\�z��/M,���V�}m��%�4��r"�����/ @{O?G����"Pk�,���~�C�ig
�c�dQE��S���u�a�x���Zb(����3*q�H����S1g�����+�5˿
6��7J��H����Pך�(��oÄ�9S���Ժ^�1���˻����s�L*�:7?��L��ppX���O^��z����ϤR����9�����7ПI��L�z��U�-s}P� 1���nD��d��rn�D��$��miR(1^����lAq@}�j!Ǣ�n�;�d�����~�k;_�jP#��q��?t�7e$���h�)^�鐫����F7Я4��1FL�n��u|���`�B��z*��'��0��ow����A�v��&N�r|nMt1Fl��7��s*c��vE}�/P��*du�|���w��8���I$(n���SxmDhaN���|V1�Hʷ�VW����oˊ%��Ẅ́���e��-���!u	|0^l�a��V��罅��(C�qQ�Q�Ňi�1P�Gu>�{<�Y��=$�t2dz��.U���U:�|`���[����("D� y>ǜ;P����^1�r��qB�EK�y̞�gQ�����#��H�}!��h���)qB�7��G�����R��	ʜO �?��F��KrY�mX�GJ��յ{6��]B$��óE���pxK�JT�W� T�PCѭ�=	�BD��l^uK�Ӣ�8�Ce,
�E����Ժ���e����.:��H��U���s����{��,�4M�&�8V��2��o�ŝ	D��3�lb/#�#��|�4Ǿ�ı�>��3��JQ�N:��n��8�d���3��-����iD�B�\�u�H�,E�b�o�Fc�Z�|�L�AE��)�U�             !�ݖ�d�Xf0�����eB4��HEO"܇�7ڴW$�`������/��\x�Oc�0�֫q�2�9dJ�ݵ��A]���(���W��a��s�[7/���0,1��A�u��]�WCܽ���2LXHvr9�9�
�	޳9�Ԭ���X�^k3���l�h�5�Oc���uf��옭��/$�Q�upb�aU��=Lu�ꅤ� ����[�"�W:���D���