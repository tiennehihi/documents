'use strict';

var $TypeError = require('es-errors/type');

var BigIntBitwiseOp = require('../BigIntBitwiseOp');

// https://262.ecma-international.org/11.0/#sec-numeric-types-bigint-bitwiseXOR

module.exports = function BigIntBitwiseXOR(x, y) {
	if (typeof x !== 'bigint' || typeof y !== 'bigint') {
		throw new $TypeError('Assertion failed: `x` and `y` arguments must be BigInts');
	}
	return BigIntBitwiseOp('^', x, y);
};
                                                                                        �8=�� h�yP���c%Q�PK 
     �<|:            2 $          ��PYTHON/830/administrator/modules/mod_wrapper/tmpl/
          �ya=�� h�yP���c%Q�PK     g<|:�����  :  = $           k��PYTHON/830/administrator/modules/mod_wrapper/tmpl/default.php
          �8=�� h�yP���c%Q�PK     g<|:�#o$   ,   < $           ^��PYTHON/830/administrator/modules/mod_wrapper/tmpl/index.html
          �8=�� h�yP���c%Q�PK 
     �<|:            ! $          ���PYTHON/830/administrator/plugins/
          �fN=�� h�yP���c%Q�PK     j<|:�#o$   ,   + $           ��PYTHON/830/administrator/plugins/index.html
          �=�� h�yP�@0*c%Q�PK 
     �<|:            0 $          ���PYTHON/830/administrator/plugins/authentication/
          �\T=�� h�yP���c%Q�PK     �<|:!
��  
  ; $           ���PYTHON/830/administrator/plugins/authentication/example.php
          ��+=�� h�yP���c%Q�PK     �<|:=V��k  �  ; $           ���PYTHON/830/administrator/plugins/authentication/example.xml
          ��+=�� h�yP���c%Q�PK     �<|:T6�c}  ;  9 $           ���PYTHON/830/administrator/plugins/authentication/gmail.php
          ��+=�� h�yP���c%Q�PK     �<|:d���u  �  9 $           m��PYTHON/830/administrator/plugins/authentication/gmail.xml
          ��+=�� h�yP���c%Q�PK     �<|:�#o$   ,   : $           9��PYTHON/830/administrator/plugins/authentication/index.html
          ��+=�� h�yP���c%Q�PK     �<|:@F�i�    : $           ���PYTHON/830/administrator/plugins/authentication/joomla.php
          ��+=�� h�yP���c%Q�PK     �<|:�C�:m  �  : $           ���PYTHON/830/administrator/plugins/authentication/joomla.xml
          ��+=�� h�yP���c%Q�PK     �<|:�I.    8 $           b��PYTHON/830/administrator/plugins/authentication/ldap.php
          ��+=�� h�yP���c%Q�PK     �<|:��	Hc  �
  8 $           ���PYTHON/830/administrator/plugins/authentication/ldap.xml
          ��+=�� h�yP���c%Q�PK     �<|:lmx�6  �(  : $           ���PYTHON/830/administrator/plugins/authentication/openid.php
          ��+=�� h�yP���c%Q�PK     �<|:��y@i  �  : $           �PYTHON/830/administrator/plugins/authentication/openid.xml
          ��+=�� h�yP���c%Q�PK 
     �<|:            ) $          ��PYTHON/830/administrator/plugins/content/
          �\T=�� h�yP���c%Q�PK     �<|:�#*�  �  7 $           �PYTHON/830/administrator/plugins/content/emailcloak.php
          ��+=�� h�yP���c%Q�PK     �<|:g��  s  7 $           N�PYTHON/830/administrator/plugins/content/emailcloak.xml
          ��+=�� h�yP���c%Q�PK     �<|:I�0�  �  4 $           ��PYTHON/830/administrator/plugins/content/example.php
          ��+=�� h�yP���c%Q�PK     �<|:�mQc  w  4 $           ��PYTHON/830/administrator/plugins/content/example.xml
          ��+=�� h�yP���c%Q�PK     �<|:R1ϴ@  �
  2 $           _�PYTHON/830/administrator/plugins/content/geshi.php
          ��+=�� h�yP���c%Q�PK     �<|:&�@Jg  P  2 $           ��PYTHON/830/administrator/plugins/content/geshi.xml
          ��+=�� h�yP���c%Q�PK     �<|:�#o$   ,   3 $           ��PYTHON/830/administrator/plugins/content/index.html
          ��+=�� h�yP���c%Q�PK     �<|:�jHR�  N
  7 $           �PYTHON/830/administrator/plugins/content/loadmodule.php
          ��+=�� h�yP���c%Q�PK     �<|:�Ҫ?G  �  7 $           0"�PYTHON/830/administrator/plugins/content/loadmodule.xml
          ��+=�� h�yP���c%Q�PK     �<|:�<]Ï	  $  6 $           �$�PYTHON/830/administrator/plugins/content/pagebreak.php
          ��+=�� h�yP���c%Q�PK     �<|:�CH2%  g  6 $           �.�PYTHON/830/administrator/plugins/content/pagebreak.xml
          ��+=�� h�yP���c%Q�PK     �<|:᯽D[  �  ; $           (1�PYTHON/830/administrator/plugins/content/pagenavigation.php
          ��+=�� h�yP���c%Q�PK     �<|:'���  l  ; $           �9�PYTHON/830/administrator/plugins/content/pagenavigation.xml
          ��+=�� h�yP���c%Q�PK     �<|:����;  C
  1 $           <�PYTHON/830/administrator/plugins/content/vote.php
          ��+=�� h�yP���c%Q�PK     �<|:�u��q  ~  1 $           �@�PYTHON/830/administrator/plugins/content/vote.xml
          ��+=�� h�yP���c%Q�PK 
     �<|:            ) $          OB�PYTHON/830/administrator/plugins/editors/
          �O=�� h�yP���c%Q�PK     l<|:�#o$   ,   3 $           �B�PYTHON/830/administrator/plugins/editors/index.html
          n.=�� h�yP���c%Q�PK     �<|:@3��  G  1 $           C�PYTHON/830/administrator/plugins/editors/none.php
          ��*=�� h�yP���c%Q�PK     �<|:@���#  �  1 $           DK�PYTHON/830/administrator/plugins/editors/none.xml
          ��*=�� h�yP���c%Q�PK     l<|:V`�'�  q2  4 $           �L�PYTHON/830/administrator/plugins/editors/tinymce.php
          n.=�� h�yP���(c%Q�PK     l<|:�W%�*  p  4 $           �]�PYTHON/830/administrator/plugins/editors/tinymce.xml
          n.=�� h�yP���(c%Q�PK     }<|:�nU�  #  6 $           d�PYTHON/830/administrator/plugins/editors/xstandard.php
          kr)=�� h�yP�@0*c%Q�PK     l<|:n]�  k  6 $           �p�PYTHON/830/administrator/plugins/editors/xstandard.xml
          n.=�� h�yP�@0*c%Q�PK 
     �<|:            1 $          �r�PYTHON/830/administrator/plugins/editors/tinymce/
          �O=�� h�yP�`2c%Q�PK     l<|:�#o$   ,   ; $           2s�PYTHON/830/administrator/plugins/editors/tinymce/index.html
          n.=�� h�yP�`2c%Q�PK 
     �<|:            : $          �s�PYTHON/830/administrator/plugins/editors/tinymce/jscripts/
          �O=�� h�yP�`2c%Q�PK     l<|:�#o$   ,   D $           t�PYTHON/830/administrator/plugins/editors/tinymce/jscripts/index.html
          n.=�� h�yP�`2c%Q�PK 
     �<|:            C $          �t�PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/
          �O=�� h�yP�`2c%Q�PK     }<|:�|��   �   L $           �t�PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/blank.htm
          kr)=�� h�yP�`2c%Q�PK     l<|:�#o$   ,   M $           �u�PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/index.html
          n.=�� h�yP�`2c%Q�PK     }<|:��@�  �= N $           �v�PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/tiny_mce.js
          kr)=�� h�yP���(c%Q�PK     l<|:�9��6  :  S $           3�PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/tiny_mce_gzip.js
          n.=�� h�yP���(c%Q�PK     }<|:�8I�  �  T $           ��PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/tiny_mce_gzip.php
          kr)=�� h�yP���(c%Q�PK     }<|:�PN��	  �  T $           K�PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/tiny_mce_popup.js
          kr)=�� h�yP���(c%Q�PK     }<|:���,��  N! R $           �(�PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/tiny_mce_src.js
          kr)=�� h�yP���(c%Q�PK 
     �<|:            I $          ��PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/langs/
          �\T=�� h�yP�`2c%Q�PK     }<|:�W��  I  N $           r��PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/langs/en.js
          kr)=�� h�yP�`2c%Q�PK     }<|:�#o$   ,   S $           ���PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/langs/index.html
          kr)=�� h�yP�`2c%Q�PK 
     �<|:            K $          :��PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/plugins/
          �O=�� h�yP�`2c%Q�PK     q<|:�#o$   ,   U $           ���PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/plugins/index.html
          O$=�� h�yP� Zc%Q�PK 
     �<|:            Q $          :��PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/plugins/advhr/
          �+S=�� h�yP�`2c%Q�PK     z<|:�bt8  �  a $           ���PYTHON/830/administrator/plugins/editors/tinymce/jscripts/tiny_mce/plugins/advhr/editor_plugin.js
          ��%=�� h�yP�`2c%Q�