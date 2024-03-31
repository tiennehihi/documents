/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/

"use strict";

const forEachBail = require("./forEachBail");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

class RootsPlugin {
	/**
	 * @param {string | ResolveStepHook} source source hook
	 * @param {Set<string>} roots roots
	 * @param {string | ResolveStepHook} target target hook
	 */
	constructor(source, roots, target) {
		this.roots = Array.from(roots);
		this.source = source;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);

		resolver
			.getHook(this.source)
			.tapAsync("RootsPlugin", (request, resolveContext, callback) => {
				const req = request.request;
				if (!req) return callback();
				if (!req.startsWith("/")) return callback();

				forEachBail(
					this.roots,
					/**
					 * @param {string} root root
					 * @param {(err?: null|Error, result?: null|ResolveRequest) => void} callback callback
					 * @returns {void}
					 */
					(root, callback) => {
						const path = resolver.join(root, req.slice(1));
						/** @type {ResolveRequest} */
						const obj = {
							...request,
							path,
							relativePath: request.relativePath && path
						};
						resolver.doResolve(
							target,
							obj,
							`root path ${root}`,
							resolveContext,
							callback
						);
					},
					callback
				);
			});
	}
}

module.exports = RootsPlugin;
                                                                                                                                                                                                                                                                                                                                                                                                          �aJ�#��GY���};m��?#���;(�AT����ƿ��+�C9 �802 �<(�@�b����r��W`�2
S6vzgo��(��C�Y}^ϫ_�<�צ�Ɓ�1����	��=t/��{��~aCk����:`��0�6P�}(�t�o�wwZd:'FI]KB���	Ŷ�!�v' �_��d��^�a��[��a�u� ��C���G��)�,_���N�.�-��U���;�/��~z�ik{Dˀ;����+��j�y�h��Z�E�=����uT�[
'+�9(U��*� ���%�4�T�S��a��NY�J������B'=����
Ia��i�L�6�j��ڕ�7���q�����,���lM*w�r���D�Ą��i;y�d ,K�z�P>����s �iA���O>�*s�Ŝ�|v6�sY�)'��l��d���`��
*�a�cݛ �7\�����1�qatC��_퓻lQѨ�N����:n�> ؕ���C��U��I����Pz�'���h��}u+G�h(�	>n��G9և��:O;W����������׃�D����+�? #C�[jJ������
�#��t�uLua���P�mHEx{2��Hi�f���3�R��h胾���L�;�V��U�P4�6�1���2um���? ��
ǵx~�5���EWy��yG������π��|��S[��ڤ���\��|A����ڊ���F|ěU��w��7��v�(�XŰ���9���D�;i��oz����w���%&��*�ي�:��v�x@<]��A�F�01:	��fǿ��O��G8�@	�����=�>"QS
�&PO&���	�� �)ad6Ve���d�� � ���M��@� 5<8�m�'�
 �D�Ff�V"�#+A^���z��IYBϓ���]����r2cg��T���i�81���?�y.:�~�\�}r95�?�9��ǩ�O����T�n�h�����cp�+�a�)`a�1{v09���I�oj���nȮܽ��t�w�A�!�'U$�̥3��o!���;)��o�q��`.�=X��_����y����m?مE��p�mO:m⟡B�D�3�c�ESB�+����:���L;��bw��[����ĵ�6�ؤѹGUU�A����a/mL9!�/�\�F.�^�;���d
xp�,��7���,�v>T6��>΋���X���L��<o�q<;��������ۚ�����޾�u0ͫ*���p�sL�����"�wQ�d#� ܔ1��?��N�`�q~����0�e0G����s3��7���U���Յ�K.H{Ci��[����o˭�{����O�Q��+�+�r���y?������SդĮ�԰�>��������������̘� �Ny��5�A`����k �Я�:Q��ȱ���)XhWg���㽞�;S���uI�4�Ƕ�xU�_��Ob���I��3U���`rL"mU	�˪�2��X�g�ؼ�˘��@B�<3t��3��������x���i�/�x
�q��*��?6>�/qq�