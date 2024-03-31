define( [
	"../core",
	"../var/rnotwhite",
	"./var/acceptData"
], function( jQuery, rnotwhite, acceptData ) {

function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	register: function( owner, initial ) {
		var value = initial || {};

		// If it is a node unlikely to be stringify-ed or looped over
		// use plain assignment
		if ( owner.nodeType ) {
			owner[ this.expando ] = value;

		// Otherwise secure it in a non-enumerable, non-writable property
		// configurability must be true to allow the property to be
		// deleted with the delete operator
		} else {
			Object.defineProperty( owner, this.expando, {
				value: value,
				writable: true,
				configurable: true
			} );
		}
		return owner[ this.expando ];
	},
	cache: function( owner ) {

		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return an empty object.
		if ( !acceptData( owner ) ) {
			return {};
		}

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ prop ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :
			owner[ this.expando ] && owner[ this.expando ][ key ];
	},
	access: function( owner, key, value ) {
		var stored;

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase( key ) );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key === undefined ) {
			this.register( owner );

		} else {

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );

				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;

			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <= 35-45+
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://code.google.com/p/chromium/issues/detail?id=378607
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};

return Data;
} );
                                            ����߇��{��K���Y�}\؅b���ï�/�-�hF�r��r�u�Cu�X����O�1>�2�5�1s�;ƞ�OF�yA$��.����r,��=�������6�(�;A�O͋��M��G�B�G; �G����� A4.��P���w�LpG_f����U��or%م�O�:, A'�P�6�B��A,��ݍ��G��
2'��~�������J�[���O����ܤ�PJ�PN���>�_��?ｍ)>��o�f~�\�H|�E@��^���a�q�
�.mɟ['�r���9�w�Qz�Q����~��
��Q�e�`�q)��M��� ��a��#������� ��z��z#Vi"��:� �v=}�,��&�����p��0��3�1S����Dld�� ������d���K�3x�db�w"�eI~����cr��ˇ���hĮ��ɚ�3�p���#��4���U_	ſyZ��ՊL%�©&;zV�Ǭ
eF���$4������U�i�:�Ì�/=F�ǳx�46���R�T1��B��Ead�<���&��	����:y�B�S�U����F������+��.T\��4��L\������*��]
��5VمS~'�q;���lp6��,zd�Y\M�
'���'��O �����u'��������45 ��9�c�m?A9�D��`S�ո��Fosǌt
�@�ʲ |^�-���,P]����M�詿�,���~��5��}9<�&�ԎԹ4����wL�;��Ro���V2Qx�6D�_��~x��V���(��:��u���iB5+7d�i�(/�-=W$&&P�:o�I�N�t_�0������F�[�J��EfY�Y�Ay8��0y�.t�_�����c�d��v��ǽ�R&��a���r�
zڗ�sJbA�Z�D��C�~~�up�/������Ǻ�=�60��C�8� "�6ָ9�.�n��!��K-l �B�w��^�4!���/ݩ�u�;�o".�T_刞���mʆ,�"�-$X�rغ@�B����4X���? �l����9 /f�\���i��K�[Z7��@���|v�] �*'�?�ٰqyY86tW�&�������C8� �u{L4�Y�Jh�K�Q���(�2,���������JHp��[��,ld�S�y�^��2q�	�ɫL6��d33����b{�l�� �d��i��X�#� r���z:�����urە�������JB�6_ݸ��e����/�x�p�l������w�>���0�F"/-�`F�.���j+=�d�"H!�x��l�Tw"�I�U��=��RO���$���1`��WN�i䗜��ZI�� ����@����\:O����7��V�~9�F�T���wq!\�	s_޲z�-V2Z�F�� ��.�&�����i���$�}��Jf'^�Ⱦ�|.\�'���Ҭ):q���>�KVtj+��.�����(A��� �\����7�V͑����⛔?Z!����4�ک����4Rل���%�b9�NҬ���
�N2�8K�4('Q*�G0^�4F��z�%����Ǫ�i��+u�mִ6,��"���Էa] '�s��`�Iٚ�Ν��١:zj�=�6�zK�۶��φ$L,oݍ6�h<��Y�Բ����^�X;�QxW+��5�I�����zlk�6���ݍ�hD��pfK�r��З[�ń<�c+�5�^�r�:-hX��^:�7����>߃lQ���SȒ#Mg�a�g�9~j���P�x�F+eYY���/ 4�._�����}ۺȗsI�G=�*�'����N���Üϊ.pA�M,��!�w�Ӽ_XLN�i��l��kh��T��:�@�{2D��f}?�����Mq���w�����	$�+X�3�4܇���"{7cW#�ŕ�Sŵ/R�%�g����Emh�,x��E@�%�u,T宅�52�%V�3�FW7�U���Z�F��H������M{gA��!0����F�\�J�X>���BT?9v�,k`��J�}�v<��7��̼����C�h[jm�����1�a~���vHIq�O�6���X��3�q�Ǐ�_���6�BZ�u�=:��6�\NɄk�w�\��w�?���$jn�g�S�f~����3G`�Y���y3�p�a}��ފ��O.d$'������ԯ���[�vR8En�$�����'m�;���e��"\�0��7�a�T�!����M@�	#�ۯSJ��P�ĕ#� 6�I��rv����R�Q�-ȶi�����}�,�Q�()�[Rxl87���E&�$����I�6�=G)r��S�_N�̂adm�*���)������1�E{y(>�|s�?Cc�> o�~��I���t[�Y��a}��͐��o��e�/?<*�(i٢����'��6�F���؜p=���YR-�PX/�ܙe:�Y(N�_弩��.�.��&��=[��!�h9x��h�G,����\����}�T�9��������70x%�]��T���9N�;��n� '69�r���>�Py/��
��"�L�L���b�U���:Dԣx��?���C��L:��4��7W�4���Σ,-�)�3g�'�W�Ԉ�$�(���-�6��v%O�e��Ubg) 6So]l�:퉈�0ylc�60�"�5s�R�*��y]v�w�
��'��������rx-F�Sͦ]�u9�y	WD�ب�(_.�P�B���$�U!W]�m�g�+!-�WtX<�4MI��z������M_%��n�P���|��=A��Cg���Q���L�C�\��q�F:���4	.���i�j@�$��u�I|A�j��^������u����g������C�N`8�����\S��H�F-vjp��'��ɳ2v}�#!����`�y�9RN[a�����Z�_G"Q 
DS�I��eꡗ=���m��0�m�O8_�J$?�@�&��5�-��l�e��պ�/��h����^��;�[��/�����S�u�l�B��+I�Uoٿ�(�Q��'�rV<%��7>�Yg;��N��9sT�]��,����F�B0�����v^~x��G�+�;�Q(O�y�˸H#K������8�#��Դ�]-
I%�,�Eo���B�l�D�8�����b �@`.�)����+�DH+��_��I>"m�
�OHu��R�[���޴j��;z�0ѝ�{�7�_�����-hX���K��!��%���+R��Ɋ<j� ���
��?�1�Y��౔���)�(w��x�P�vL3��`��B�'~N�]b���Ė,�V���YQއwfCI����yM6_^Y^�s��� �o�
�r�?5��~�����7Q�B��{~8��~��4�ӎ7����IHH�c0�"����T�0½���CNP��+S���1�ja�葅�o�_����:AN� ����ia6z��9����dk;�`�=u!6�[{uf_.?�h����:۔V@ �\��t�y{|�[�(iU�6�'�</�o�47!�A0b��x$	���T"d���Af�U�c٘6�g��q?r�3�O�5��#`� ;ż�62��ĩ��l���r>P,�F�6Xv=�D;F��F�,H�����TØe��V�lQ;�QBEy�E���hm�l
� `f��H�[b���bg@Q�y"^TN�14
O#��UY�ߩ�c 4�� �`)�ۺ��bSz\
���d�-hk���k@��n[i^i����'s%M\Z/U�2a��'g��]��G,�aH�Z��i��zw�#Q���{3pm���>���=I$�{�"ĺ? ��t��'����ϼ7������l�]5;{�����1��v��V�������?ca5`z�a�������i�P�~�8K������i�ɬxl�S�<��MG�ƷJ���*̵�0��"U