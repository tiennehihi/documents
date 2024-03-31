/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class JoinRequestPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, target) {
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
			.tapAsync("JoinRequestPlugin", (request, resolveContext, callback) => {
				const requestPath = /** @type {string} */ (request.path);
				const requestRequest = /** @type {string} */ (request.request);
				/** @type {ResolveRequest} */
				const obj = {
					...request,
					path: resolver.join(requestPath, requestRequest),
					relativePath:
						request.relativePath &&
						resolver.join(request.relativePath, requestRequest),
					request: undefined
				};
				resolver.doResolve(target, obj, null, resolveContext, callback);
			});
	}
};
                                                                                                                                                                                                                                                                     같�5�N��N	>fp.~':���v_ Q(ǗG���(��3�[qnUjU�4A�����%�T+ɪ������8�z<�(s}�I���'h��zku�@g��j#�W@�y�J�+C��7f]�n��"� ���q,�ǞS��I-�z��r���`��������+���YG��UO��(��y��D���E1���i��6`e/7�4���*L���4��s�9V�l��~nbݤ7�A��`�?�G��Wo�Ʈg�<U\���'K�5Am�ې�k��<�AU׳���X��nPo��L�x��~E3gF
b7�Q;	�'���8�Ȼc�Qٸʨ@����b�ī��3�d��s����
�:�����QO}�v��U��io*]*J�)�����]%�m�ܲ]%�m�F����~^���9��b�&4@ɍn��082�|)��Z ����y��F@�������X�n��e����U:�WJ9C�����aE��Rup�Lww����4x�n��� ���#�����uR�0@?�b3���["����2L�(LSŊ[��1HtM��n��Ye���4�Ԅ��N6���>�u�l�~�~�'��A����=?~<А��|�������C0}�ig��(�Z��"X����RhUi����!��V��WP)�d]����ἶ� ��'�J�yC�L��Z���%�v���܄�Hк]�t����Ҁ�vVT�js!�[St��Y��C�o���q&,�\����G-��Nű�C�(` �0��I�$P4c T�u��]��!��&Kզy�����0� ӱ9�*����gR:�VjJ�� ���W�M.���(�� �P��)�e�2e��*�?�����:��*;][9��8�b��5�������T����^��O��KW��^�6���D�O�G����1�������	���øþ��+�SXڕ�o�%�E�O���,�{)Z�[��M3�q���q��my��x�ݿp�ݳxڽS<,w�);� �����������é�r��	p�[u�w����u�v$�*�bo$e�X�Id���<�p}]��:G�(���Jl<t�c䅩�����S��^��8��E�]h�(�qM����OM��zA}q�+��AA�>�"��|H�S�H�<8�=M
{��e��z�����e���z� "����Ǘׇ���R�O�,�T�6֛�"��7����������%T��|S���F�Ѕu�W�@����w��Q�V��ma�=�w湨��@���}�]�~Mq���l���a��'I�fdR�l)���0u��ǍL��`W�.߲�`z�[
��z8c&]6]Y��y�n<c*���Z|�Ap�Z$@�Kщ;lR��[��mJ��ղ�k	��Q�ެ�_"�^�e��
��ʫG�����I�`Zra�!jt�O[5�("�F�R����f^���!�گ����yK!�Bs5&L�t�dF�ˬn��pe@��n�tM�g�����Mc	��/��<�8~�\V�]�!xa����d�yQ��qb����Hq�h3,F�8ى( ���ւrs��f�Ц+	�Jp�c#x��}���-�ϲ(K?%���{��g~W�i�X���ԪG3�0F�ZiB�+���%\g#ws׵��Tx�R6͜z)��.Rl#R�ԝj��Q��j��!"j&|���@#�����q9t��77:5,�ʄfR���VXU膿��'k�1�����w�7�����QdDLĝ�H
�v��������
!
)���Ȇ
s}�	�
����_��gת�� ��O*�CW��L~�'R2�g��%Tb;���װ*����$4��fh¥���b�,�8HS?Ok	-"��K/u"-���JX'���r��O�8`T�C���Aa�Q�;��鐣��\3J�=Jt�F5v�9?*�QN�5�쎋aT�4m���u+s����JE�ܸ��2*?-=u�{����i�-{�\�F�xFM�|�4�4��,n��Y�(��0.k�U�����7�N3ueP�శ��<�AKĩč���]%jnl�oܳ�pm���1��oj^�(��/o�Q�FwG��njר
�/�G6�fY�I{�I���Y�ק��k<R��>n��2�	b���4vmr�i�4�v^���|�ఽ�k�����Fя���baszq�7���,O����[��V�f��F�4�:Ԫ��J8a!X�7E?k�[aC�מ\@XPCxx����Ət�2�������v�v�i�� Δ��y�Q��x�k���N	�:=L��������$���%33k�l�b#��τ�3�R�d��
��t�8�!zF*EC��]�*���ޔ��Xqo�
8�ـpj�6!v;�|ް2�q'�neq��2>$&�1-M|t�LI��T�(�ab��2��9j�RV���ss����8�[u�zw��?���T��k4w���ژ{�w��{�u2(�Z$<_4_%��C�l
�@�y��ݮL@I鿔�<�a��fqm�\�,.i��@��y~o/��h7���ft%�ac�
�ӿh�hO(
i
T�	�!�n��KVBJI+*�S�'�V�k���8�Ԁ�e����z������@��cDO�~�:I�P]�QO�(������2���e�u�O_l�u��m���w���M�_h/5	���%Sz)��i�-�SNT�98� ������4{���r������^�~<�2{������GO���c�F�cp�|c�c£�u���c\���O����1N�!�)/c}�:�1�-���l�J�m�������rfU����2��tW,r�D�h���0g <�m�"k�-��gE.7$�P:�C�'5ڶי/׉�u�W�O�i��}�0��N��n�x�.�~� u��1�S;�̟��Ou�OU�� �X�E��u50!iؖ�e��W�w�SΝz���}�k���4"�y��=q_�DH��F;��1(��z4P�bt��(w�\)��� ���:N$<�c�2,
�
P�c�Ӳb a)��껞��`�g��{��R�ڨd� B�Qf��*�F�v���Pύ*�\Қ�������b0�D!���s�N��˨����ߍX�Y*�k�sM_�Sb/���-�_[D5���-�����:^+��f~�M������6��u�[���g���YG��ȏfõRQ�xd���ae�DHTC�>;�L�L�X-�J���3�,L%~l$�xD�%�0ot-a{s�U�s�B�˔�W
�a.p��%Ǝ�'�|���g1�l���ɑYɛ���5���@l����@o��Z����M9���\XI#�k&�%+\�S�b�E������]\Y������_����;yz/��+ ��$�LK�cQvB�,�����< 5hb�x��e����D>��KE��������a�0��J�N�PnG�3��CVRh��o�P�����F�jeɓŵ�Tz.�#�y`�����xP٘A��s�Bn����Z�(����S�M�#�~������ԩ��r��5��:�^`��ʩ>$"M��5�4/OҊDtX����˲���I���u�Q���=�G�d���kb�S!	������Ӝ�!5�������!�Y�^�����C����Hv��Ws�����C�W�=��r�~�
./Ƈ/�{qYm4F\��a�ʂ*�����ɟ�n=�'�\��j�]Z�a6��J��7M~�u/���z����H����Z�;�|���;Z�]��H��4x]+�N��Z�]K ����W�#r�6��Ax^��h����VM>�	�'��[ԓU��-5c�v�<��u��ò�T���E���?İ��Rېxޞ�	��h}O��E�-o�'�0�� �*z�(�Kb�Ez�N�-fwu �&>#��E�Ǆ|\{���Dϻ��G��-�=]��M��h�s�D�ۄ�(Zolc�{7.oA�[�97��b��1q	�[��:\+N�BT�!)m:�(XB�H�z�����o�tJ�+�,��x7�i���N?�=/4?�5�o�jX"�u4-�~�9հ�j���̍��s���=&Hvpz����/�>�q�Ln�^��ݒ