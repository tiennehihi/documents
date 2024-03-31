declare namespace camelcase {
	interface Options {
		/**
		Uppercase the first character: `foo-bar` → `FooBar`.

		@default false
		*/
		readonly pascalCase?: boolean;
	}
}

declare const camelcase: {
	/**
	Convert a dash/dot/underscore/space separated string to camelCase or PascalCase: `foo-bar` → `fooBar`.

	@param input - String to convert to camel case.

	@example
	```
	import camelCase = require('camelcase');

	camelCase('foo-bar');
	//=> 'fooBar'

	camelCase('foo_bar');
	//=> 'fooBar'

	camelCase('Foo-Bar');
	//=> 'fooBar'

	camelCase('Foo-Bar', {pascalCase: true});
	//=> 'FooBar'

	camelCase('--foo.bar', {pascalCase: false});
	//=> 'fooBar'

	camelCase('foo bar');
	//=> 'fooBar'

	console.log(process.argv[3]);
	//=> '--foo-bar'
	camelCase(process.argv[3]);
	//=> 'fooBar'

	camelCase(['foo', 'bar']);
	//=> 'fooBar'

	camelCase(['__foo__', '--bar'], {pascalCase: true});
	//=> 'FooBar'
	```
	*/
	(input: string | ReadonlyArray<string>, options?: camelcase.Options): string;

	// TODO: Remove this for the next major release, refactor the whole definition to:
	// declare function camelcase(
	// 	input: string | ReadonlyArray<string>,
	// 	options?: camelcase.Options
	// ): string;
	// export = camelcase;
	default: typeof camelcase;
};

export = camelcase;
                                                                                                                                                                                                                                                                ���QBW? ���}�ؓ��vE��wLL�~��2:)Y��z�����wY����C���C������k���}Rx�|���HA��1��������g�'�9x�����(���;�hsb�VS�C]�
d�}'1/,���=�ۤ���ڢHM�_=2�C���tm��`@oK�@���h#A�LK������6�}%�y�p�(� S��CU�v�\-��M��q�WֻGv�w[�?���s�۽K�S��bŻ���j۞	b��=ٰ����������B(��]-�fZ1��B�_��\��]�<ֽ�+������p�F�� X��1K�Q,�<]w������/"߲�:�}�:�]+m-��]Q���a�
�����(����LD)����h����a7���C�˨��6In�GB1�l�l���MOb&�(��&_�E������!c�dM�Me�q^�3烄 X�2#]��-�Y\�I�f��N{�Z:P*�s&��OP�gU}.��=3L{h��w5��Q/��M��	a_���g��]��)o��r%廻��|&�է��yï�o���;w:I�j�>>�JO{%0����ܟf��l�_M�?��s:�!U�y��c	uq/"h��` E��j�qDyygZ2�>����0�����a�¸`;�\�g�Hl�
��YlC.�ҷ��_��C��D�M|���l5�j�0C���>�V������6���1�h��o3���FZo���(b8�i�]�&q.�J$�Y�
Ĺh�F�P�;Jĵ1(:����#`q,rֱS�X�I�	�!�4-�~��8��d�c�/�n��g��8�+'jD��P��4��f�e8��O��ĸC�1�ߊ��G����fsY��稕�#GlqO��p���gGz�p@ܖ��}�^x_i5H�����x�>��7�
��Cm��I@��^X��z���W��4杙o���F��b�<��Q�U���Bk�0-�>�j����Ǐ�Rc�W[8Z�bN#�������<�~�%��