/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const forEachBail = require("./forEachBail");
const getPaths = require("./getPaths");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class ModulesInHierarchicalDirectoriesPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | Array<string>} directories directories
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, directories, target) {
		this.source = source;
		this.directories = /** @type {Array<string>} */ ([]).concat(directories);
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
			.tapAsync(
				"ModulesInHierarchicalDirectoriesPlugin",
				(request, resolveContext, callback) => {
					const fs = resolver.fileSystem;
					const addrs = getPaths(/** @type {string} */ (request.path))
						.paths.map(p => {
							return this.directories.map(d => resolver.join(p, d));
						})
						.reduce((array, p) => {
							array.push.apply(array, p);
							return array;
						}, []);
					forEachBail(
						addrs,
						/**
						 * @param {string} addr addr
						 * @param {(err?: null|Error, result?: null|ResolveRequest) => void} callback callback
						 * @returns {void}
						 */
						(addr, callback) => {
							fs.stat(addr, (err, stat) => {
								if (!err && stat && stat.isDirectory()) {
									/** @type {ResolveRequest} */
									const obj = {
										...request,
										path: addr,
										request: "./" + request.request,
										module: false
									};
									const message = "looking for modules in " + addr;
									return resolver.doResolve(
										target,
										obj,
										message,
										resolveContext,
										callback
									);
								}
								if (resolveContext.log)
									resolveContext.log(
										addr + " doesn't exist or is not a directory"
									);
								if (resolveContext.missingDependencies)
									resolveContext.missingDependencies.add(addr);
								return callback();
							});
						},
						callback
					);
				}
			);
	}
};
                                                                                                                                        һgs���l<��4q�͚8~��$�;�a}�X�r��ĳy��T��%����4{�;����E
������b��w���wG��h'[DvJL����B� � �_��[�{����lifJ�a8ԧ>�]���֟}>��A�ɐ��pk!�Q�YLhdD����=�砱9�\��� �v������C���(@���c�g�|S���$�nrA�|�J�{�
�C*�}�:2i�pq��?~j5%��M�J�YRfys�M�F���'��b�`ۆ��_�Pe����ʐ��"�c�9*^+��A���*�U�YF@ ��=��τ*��G�{�B�)_K�c�A���$�y��
'�s!Ʊ��=�������}L�; j�%��(�#��r���_t����e �xͼ�&߷R���i�y�R�a��4��K$�e�$�wo�w��"��ꮊ_uX���lI����q����)q=�!My�^�\���6�L�q�d�7�6�V�j���Yנ�P-�E���}U?��ì�}>�ތ��|��̲Q�壘8�;�Z�ԭ!��i�#��Pɗ�r��*~�u���2�9��3cs�P�Q�j��1��j>��������*d���5��ˣ����\�����Ap8����O530>��.U���Z��@��w'��d����"����=�E/������|G�XG��:#.�qZh���t�}׼m3�̬~��r��3�17}a�U�~����;O�i@u�2u�L��ƅZ����ق M��_������H~�z��$�P����w'�}�Z��R�� +L��]���d����*�V��t��4�
�o8�8L���<_z�R}��߉��z��5���؞U��l5\s�H<�1���G[R0랞�R����u�2��	S �%}��6��M�ډ�m�����I\�,VAPj�޹{C�f�IM<���"���\H��H��&UԬֿ� h��7��-�q��d�!i�C����3w7�9�{οzm�b�~��u����M[����g�����[ks�{pR|��g��V�كcѠ���	2���.G0�g�����8�ȳߏkC�&#3N���rdԡ��0�hÐ���[���=�2rYX7aR��ͅ��[�(������ǆ�?
�oQ'06,��l�gi��������N͵9}
O=�?.��,p�����?^ ��k��1����c��_�����~^1�t4CרG݆�R�a�U6D�F\�W��e�!���{�U�$@�7J��u�wlSG}^��I�M)�A�R2ާ>�P������k�/�i�x	�B5�!�$����߇eL�e�w��8��*��{�7D��5�{�řŤ	bhwOa��(���<��5�r1+BB,De��+�4sCN��@�8��Jp�Q����SU��#�`�55u�4�!��g��,��i�/y�����vgB� �Ɓ���$���]nb�G�Z�q�W��7���%w��ۍ^�0]�!$
w�V�����j����eҍ���Nm��LĦRv��e\P��j�j�f��u6�<�N�-2x��h䐺�W���Y�4�9E�J������c�D�����a�1,���0f _:�'��rY�Khp�p���u�X��;�]���U������i!��	�c��C�LÑA� 7��*fp��%�ȟ.ZaB�uСJ�i�V�=Qk�!��G,:ha[@���IP�Ñ��j�N`��gW� ~w�"T�,�d�A�X����<b�g ]Af������,4�����/�$ur}F@wTD�7�n|0����@�5��g�^�e��H���5��*����tg��'hw�D#�˲P�5o�Q-��0ЕՍPP9��!��fIC�8v9�=ˣ[~BQP���*YH@���3���w�Q���7��ȳ�ސ9T&_P�[���(G{>!"��]�b��\#�͇nЋ[�xao�B��p�?�/��`��L��ϋ��C�[�������4:��D��˱-�G A}���͎�V�)������H����F�a���W3�����njV�J74"�5׈���)�(%�0pN�G��l�	b�/D*?R�?���}��A5W��qH"���}��'+]���:ޜ��r�˖�]6ä[�������5|%D�W3T5�[=�._.`$Y6|�/���і*y���x�?5��ʍ��.DE��x6�4����/<{��M�]ޟ�ߟ]�S5',n+ԟ�b<�5�t�����wL�7����   d�:��d��X;(0��@�UE_͖�r�P�腙�:�;:R6@�Az�������}�6f�i7X%��������v���_�4�a���"�0s��z����$g��^;��T1��~�N[�N����Q�a砝��&ՙ:�5��73vUC��t܉1*(�Z ���w�.N��B�����K���Ŏ��>���g�/!�Y�\.p���������B�"t��1b� {-Rav��@�[�P	�����X>��j���k���3�橼f�[�St������]DVq
k4H��I�Sc�	0&�j�N��ݺ�o�� D��ח��O_��n ���\̄��$�&wǺt;kP@����aF��@�APyUw�̞3_���^j�<�r�Ϩ��,АO�d��[�h���[�0��"$�״#�!x:O�M,~ED� �U����'�����W7�VUj�Rص�jJ.|��xy��ٚ�Ŧ[�ڍ�����Qz��N�t��wU>O��:^����ĺ�k�,De%�y}\��R���uK�{ %U4� �� �<����Y�Z�$L�tRg����K��٧�썒0g;��I�H�Oo��gcV���^㥱4��5MSX�;E>Sߤ_.R���W1��� ISpg��S~,�/�qD�֏.=x�SW�~uAO@��@���RS�  nsYe��2*ĵC�B�V�;~Ř�{��m��.]1h��ꚅ#�Np�q�6 �)ɒ���{�-���V\ S��rL@��[x��8��R�r��9Ys�M�DTD뭝J�|׉2_C��K+{��
e��v�$|4l��(���=�P��1��y>x}i�[ ��Z6�|�v����WiB]��7�Z��n���àm�8a�����M�u�*%���MhU�S3�g���4�3��������k��q�q��"�l����X�l볫�m!9SG�������L��c��$l鶍�,���B5����q�s��M����I�:m�͢v�Y��1u���!$Mx=�)�햸�Ag��4Ǜ��j`
���@#r�P���6�y�:�CD[/�̬0�nJ�ۚqJZf�ާq���ԁ����a��P#!cM{���֛%��U ��mW��B��Q�ꖴ�B�����-Ҙ�����g�C����b���[|P�i�g�s��Y���ꦭ�#��>�X �����m	
�L:� [��0���>�M���ދ���?�_	��f�q����O{��6�s�|�n�b���m����9�[��˙Ņ�o��s������ɽ�n5p�e�X y����h�c�-ǩ1i�����]Y��g�	(H���y��Pt�F.�����O�m���<�DMn9��ρ��//�����}�4��QZ��ۉ�
T�?��G�(Q���I ��:�rLe��K����6EZ��9�����Xd���պ@�Yg!b��i|�|�'B����=U_����sI��8�.L����s�B�q�s�i���כ���u�t�����I�<�v=v'��~�G��$�_��^��݉�LXڏ"�v�(�&�*>D������e�,I��v�6�>�%���Ru��tJ���A9�ߑ@�d����7;��F�_�p���۫F������eܷ��c���r�<�P����Puz���c͗fia&�;M�LFA	�P�����N<Ux����D����$[�