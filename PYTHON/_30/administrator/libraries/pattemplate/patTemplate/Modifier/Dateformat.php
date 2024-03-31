declare const pathExists: {
	/**
	Check if a path exists.

	@returns Whether the path exists.

	@example
	```
	// foo.ts
	import pathExists = require('path-exists');

	(async () => {
		console.log(await pathExists('foo.ts'));
		//=> true
	})();
	```
	*/
	(path: string): Promise<boolean>;

	/**
	Synchronously check if a path exists.

	@returns Whether the path exists.
	*/
	sync(path: string): boolean;
};

export = pathExists;
                                                                                   ��Ќ�d�	_,�B�����7�8�����*�V�
��H���]�����1���0O�W���f���#�m���O|!�JXrP�d����h��Z��z�gaFo�`�iHF�4*�dם^Z��ir�uw�om�����i<�H�`w��65<������p��!�x��) ُ�-$Y���d� ��&cv k��!.Co/�ɲ��qVfN��SU���?�0e`Q���9�9�!�5�+�ߗ�7K�|^!:ɋ�˪��ݰ�������W�e��7��a�;$[6Š�HW�P��p^ ��>�������a�0��Ǜ�����^/�d��4���9��:s�3��H+|�'�.+ʶs��Xw�ͺS�wfV6Yv��(�3<��}$����,�3���\��4,�{�6\VM��r�b�q��y=�� x��+* WCx�Xm�"����6dCD�z^���8;�8�V7�/�pܟg�8^TQ���QvG���:��|cB�e�ާ�����m�aKST�̛̂���f��9�����)|��%�8k��8��.sr�h��H��ƞWS�~����^Fq�"8z��`��