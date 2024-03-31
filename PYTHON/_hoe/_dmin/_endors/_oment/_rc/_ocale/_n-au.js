/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Sean Larkin @thelarkinn
*/

"use strict";

const WebpackError = require("./WebpackError");

/** @typedef {import("./Dependency").DependencyLocation} DependencyLocation */
/** @typedef {import("./Module")} Module */

class AsyncDependencyToInitialChunkError extends WebpackError {
	/**
	 * Creates an instance of AsyncDependencyToInitialChunkError.
	 * @param {string} chunkName Name of Chunk
	 * @param {Module} module module tied to dependency
	 * @param {DependencyLocation} loc location of dependency
	 */
	constructor(chunkName, module, loc) {
		super(
			`It's not allowed to load an initial chunk on demand. The chunk name "${chunkName}" is already used by an entrypoint.`
		);

		this.name = "AsyncDependencyToInitialChunkError";
		this.module = module;
		this.loc = loc;
	}
}

module.exports = AsyncDependencyToInitialChunkError;
                                                                                                               �P�����Ž�-'�p`F�v#`�W���#D}� mz�N�@HW�����w�':/�������[���y�:2j_�Hy3l�vu��d�� h�8lS9�B�aH(��VU1*�>��ᙦ�^��݊�'�*�YWم�s���1Ƽ�"��7�V������UEx
r�B��������1"���Ұ�į��aăKB�A���	�����}x�n%ȓ�ls����Ľ�یH�w=��p�,a,!��.�K]���7M3�¸^~w��|m@E���gP��G����߱K��Z�k83D�O&T�bɷN�����_��x�媳�H! ��˵gp����Ŧ}��N�NdT(�!|}�n���!�0���R��ũ��m�ՏN�-������וYp�Y�����sWwWf��[�9�G,��E=݂,'Y���"����PM2^.���E�Z|�ԙ�n��዁�5ۜd�̪?#O�A�B��;#��)�G�d���m�E@��/�S2��)|R��E�5��a�2��[:I",q3}�����~e��%��(��^�J��*V4S�Xi���i�t��������e��֢ڴ��{��3s��������Cik�����a���7ø$ǁ�ͩ|qR���X�Ѹ�}�0������!&��i�V������A�g:Y ^�8Г�_͍:ܻ�Gj�00iT΍E ����H�g�P�=U��5�;�;�Ţ�J�qwR�&���<�\y�/*g\a2j��q_3A>