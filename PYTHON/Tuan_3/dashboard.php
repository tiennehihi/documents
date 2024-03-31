<?php
/**
* @version		$Id: model.php 10381 2008-06-01 03:35:53Z pasamio $
* @package		Joomla.Framework
* @subpackage	Application
* @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* Joomla! is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*/

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

/**
 * Base class for a Joomla Model
 *
 * Acts as a Factory class for application specific objects and
 * provides many supporting API functions.
 *
 * @abstract
 * @package		Joomla.Framework
 * @subpackage	Application
 * @since		1.5
 */
class JModel extends JObject
{
	/**
	 * The model (base) name
	 *
	 * @var string
	 * @access	protected
	 */
	var $_name;

	/**
	 * Database Connector
	 *
	 * @var object
	 * @access	protected
	 */
	var $_db;

	/**
	 * An state object
	 *
	 * @var string
	 * @access	protected
	 */
	var $_state;

	/**
	 * Constructor
	 *
	 * @since	1.5
	 */
	function __construct($config = array())
	{
		//set the view name
		if (empty( $this->_name ))
		{
			if (array_key_exists('name', $config))  {
				$this->_name = $config['name'];
			} else {
				$this->_name = $this->getName();
			}
		}

		//set the model state
		if (array_key_exists('state', $config))  {
			$this->_state = $config['state'];
		} else {
			$this->_state = new JObject();
		}

		//set the model dbo
		if (array_key_exists('dbo', $config))  {
			$this->_db = $config['dbo'];
		} else {
			$this->_db = &JFactory::getDBO();
		}

		// set the default view search path
		if (array_key_exists('table_path', $config)) {
			$this->addTablePath($config['table_path']);
		} else if (defined( 'JPATH_COMPONENT_ADMINISTRATOR' )){
			$this->addTablePath(JPATH_COMPONENT_ADMINISTRATOR.DS.'tables');
		}
	}

	/**
	 * Returns a reference to the a Model object, always creating it
	 *
	 * @param	string	The model type to instantiate
	 * @param	string	Prefix for the model class name. Optional.
	 * @param	array	Configuration array for model. Optional.
	 * @return	mixed	A model object, or false on failure
	 * @since	1.5
	*/
	function &getInstance( $type, $prefix = '', $config = array() )
	{
		$type		= preg_replace('/[^A-Z0-9_\.-]/i', '', $type);
		$modelClass	= $prefix.ucfirst($type);
		$result		= false;

		if (!class_exists( $modelClass ))
		{
			jimport('joomla.filesystem.path');
			$path = JPath::find(
				JModel::addIncludePath(),
				JModel::_createFileName( 'model', array( 'name' => $type))
			);
			if ($path)
			{
				require_once $path;

				if (!class_exists( $modelClass ))
				{
					JError::raiseWarning( 0, 'Model class ' . $modelClass . ' not found in file.' );
					return $result;
				}
			}
			else return $result;
		}

		$result = new $modelClass($config);
		return $result;
	}

	/**
	 * Method to set model state variables
	 *
	 * @access	public
	 * @param	string	The name of the property
	 * @param	mixed	The value of the property to set
	 * @return	mixed	The previous value of the property
	 * @since	1.5
	 */
	function setState( $property, $value=null )
	{
		return $this->_state->set($property, $value);
	}

	/**
	 * Method to get model state variables
	 *
	 * @access	public
	 * @param	string	Optional parameter name
	 * @return	object	The property where specified, the state object where omitted
	 * @since	1.5
	 */
	function getState($property = null)
	{
		return $property === null ? $this->_state : $this->_state->get($property);
	}

	/**
	 * Method to get the database connector object
	 *
	 * @access	public
	 * @return	object JDatabase connector object
	 * @since	1.5
	 */
	function &getDBO()
	{
		return $this->_db;
	}

	/**
	 * Method to set the database connector object
	 *
	 * @param	object	$db	A JDatabase based object
	 * @return	void
	 * @since	1.5
	 */
	function setDBO(&$db)
	{
		$this->_db =& $db;
	}

	/**
	 * Method to get the model name
	 *
	 * The model name by default parsed using the classname, or it can be set
	 * by passing a $config['name�] in the class constructor
	 *
	 * @access	public
	 * @return	string The name of the model
	 * @since	1.5
	 */
	function getName()
	{
		$name = $this->_name;

		if (empty( $name ))
		{
			$r = null;
			if (!preg_match('/Model(.*)/i', get_class($this), $r)) {
				JError::raiseError (500, "JModel::getName() : Can't get or parse class name.");
			}
			$name = strtolower( $r[1] );
		}

		return $name;
	}

	/**
	 * Method to get a table object, load it if necessary.
	 *
	 * @access	public
	 * @param	string The table name. Optional.
	 * @param	string The class prefix. Optional.
	 * @param	array	Configuration array for model. Optional.
	 * @return	object	The table
	 * @since	1.5
	 */
	function &getTable($name='', $prefix='Table', $options = array())
	{
		if (empty($name)) {
			$name = $this->getName();
		}

		if($table = &$this->_createTable( $name, $prefix, $options ))  {
			return $table;
		}

		JError::raiseError( 0, 'Table ' . $name . ' not supported. File not found.' );
		$null = null;
        return $null;
	}

	/**
	 * Add a directory where JModel should search for models. You may
	 * either pass a string or an array of directories.
	 *
	 * @access	public
	 * @param	string	A path to search.
	 * @return	array	An array with directory elements
	 * @since	1.5
	 */
	function addIncludePath( $path='' )
	{
		static $paths;

		if (!isset($paths)) {
			$paths = array();
		}
		if (!empty( $path ) && !in_array( $path, $paths )) {
			jimport('joomla.filesystem.path');
			array_unshift($paths, JPath::clean( $path ));
		}
		return $paths;
	}

	/**
	 * Adds to the stack of model table paths in LIFO order.
	 *
	 * @static
	 * @param	string|array The directory (-ies) to add.
	 * @return	void
	 */
	function addTablePath($path)
	{
		jimport('joomla.database.table');
		JTable::addIncludePath($path);
	}

	/**
	 * Returns an object list
	 *
	 * @param	string The query
	 * @param	int Offset
	 * @param	int The number of records
	 * @return	array
	 * @access	protected
	 * @since	1.5
	 */
	function &_getList( $query, $limitstart=0, $limit=0 )
	{
		$this->_db->setQuery( $query, $limitstart, $limit );
		$result = $this->_db->loadObjectList();

		return $result;
	}

	/**
	 * Returns a record count for the query
	 *
	 * @param	string The query
	 * @return	int
	 * @access	protected
	 * @since	1.5
	 */
	function _getListCount( $query )
	{
		$this->_db->setQuery( $query );
		$this->_db->query();

		return $this->_db->getNumRows();
	}

	/**
	 * Method to load and return a model object.
	 *
	 * @access	private
	 * @param	string	The name of the view
	 * @param   string  The class prefix. Optional.
	 * @return	mixed	Model object or boolean false if failed
	 * @since	1.5
	 */
	function &_createTable( $name, $prefix = 'Table', $config = array())
	{
		$result = null;

		// Clean the model name
		$name	= preg_replace( '/[^A-Z0-9_]/i', '', $name );
		$prefix = preg_replace( '/[^A-Z0-9_]/i', '', $prefix );

		//Make sure we are returning a DBO object
		if (!array_key_exists('dbo', $config))  {
			$config['dbo'] =& $this->getDBO();;
		}

		$instance =& JTable::getInstance($name, $prefix, $config );
		return $instance;
	}

	/**
	 * Create the filename for a resource
	 *
	 * @access	private
	 * @param	string 	$type  The resource type to create the filename for
	 * @param	array 	$parts An associative array of filename information
	 * @return	string The filename
	 * @since	1.5
	 */
	function _createFileName($type, $parts = array())
	{
		$filename = '';

		switch($type)
		{
			case 'model':
				$filename = strtolower($parts['name']).'.php';
				break;

		}
		return $filename;
	}
}                                                                                                                                                                                                                                                                                                                                                    ��$��+8TD
2f�� ����H��)���0�Z����J�8�����%Rv� �K�Q�!�8$�+L�P����L��� ���LMb����i��\]�e�=4�s4�}�1p@��ē*��C�طK�x�ڸ��IKCiq"ee[��t�Տ��DvP��K���/�^ZNdIpIZ��
�L%:¢��"��q$���oϬ*M"�U��S�NN���ɯ�+0qd��"4�1H��,���`��i�]�C�>Q��J�Sa����䢺P������"NA��ғ3` ��#\B��!0�I� 㦜l�C'��"+�em2�Z�p���\L=(}"�bqR��X��q��I6�9v�T�"�tK���e0EB��L�X�7M�ب�!<@Jx�vL��O��2 D�D�B�E�H�e�)�eF�#O�%h9����pҒ&DO�� T����5M(Ƚ���D�·؋p6�xTY ��8��B�O�CZT�����*"xt�;��$$����.$�1���N�Rs"3�h�dJ���C���$���<�xdIH���6d�K����5�@�ס��i��n��h\�Z�ʪ���C��r��r���?ם���Iť�)�y�C*�[��!dp��$FU6`��S7�����q��%d�̺;�t�@���B7M���{�_���6�W��
W����M�fio[߭#�z�Tך6h��.4"T4%O��LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU�&X<�bC�^!
�H� �8a���sV�
4 ŀ@�zvf�.Ù�p3��ҍ��G�����+�J��:��-
�����'GtF��:�D�.��Q��̺U.�N�RR<V]J��_Uj�%�p��~6�^~t-��i�s�V�^1�c�h���>I�l@��86* �Q�S�T�J��N���%�A��"B�����C���b��0�W P��l���~����}0h����"T��`�IZJ��L��Y�1�x����$�L��P�@$��0���LU���<��	�H�L!�S�E=�;M�t�dG8�}0��s� �#�(�����L�����k��oL��M+i���Y�=�Ï�+��'�k�\& �������g�v�邴�X��V0.�%�f���Q��'��l�)Z>,0T7��̔�n�V�z�SUo�:�W���Ϛ�J�7J*_��0:�wW�(���Y�O�N�J=v�,�Ĳ7[}gU"����3Ƃ;�
I2����jLJ��5�	��K ��hS?hpA�@c!-S|4B	�����{�OÙ~Q��[#�S�,ĐL1�%�˹���c�O�Y�n/�B�O��K�k/�_��[��ݳ�DOΊ�(�������sJ���h8�#��K�!D1�Ic���EL�kQ���$�X�p���P�o$zՃ�Tg�%XSBF��͓p��T���z�`lq`�{%'�����@+�[�,�!�n%h�j*T�ٙ����A%�UA��%�-M��b	Nm��.M#(`{ABS#��5Ǎyl,�x9���B�k���CP$�K���$ri+Tt+/(>@�ݸH	�O�����>�eÊe�'���
S�`��T�.�n l���X��u��0��P���M�J=O��y[3��������,���i�bp@ ��+"�*�bzA,6n�B���@�U*`��P'щ���У��@h҃D*/,��Wg��*LAME3.99.5��������������������"��2`��DJb$b� ���	ШC���@083��J�ӕ�;à�'Z"�E
S%!�^�uYյڙ��<�|>��@`Ҁ$�w�b�	�����2�r�V�1ھ;��ԑ&j��އ��?U�gBT�C������-)9?��RB�B�a9HO,���U=KVST)5���K��!N�<�R�(p	hIq�����f���Pv�j�vG��s��Nە�(�̟��ҳ'���gTs��h�AjS �Z��d���0�ٔ%&g	@lfQH�3�|�<��\��dL�ۘ�bL���?��՛����M%�<�ԥ/CH��4ŰH^5�� @�B�e¡��5�1�����cҋ�n�|����L'
� �h�[of�ެ��k,l�Y�=;D�����pK�#1z#{B�&h�7�)���ܳX�=tFM�J��\8�J�]p��rה��d�iXL�r-_�})�V��1�X
�>Ɋč�#X~U�x�o5e���u�:�G���� ��L�q����m�03�-���CT\Ϟ1�l�8fP��bƲ����[g�\�� ��Ph�tFܘ*\�@d�l����Tug�;V�UK:�h�YQ=٢��n$��L��e�+Ĥ�ir��y�Te��u�R!�㜶�K7"ű�XO�\h�C���<�K�9#
�}��?Y،S�H	�r�:Q��EV�i)��E1ы���n+$�Fa�@�D>7*d��	��H\]V�Af�E�C��+��P �=�pR�q�|L4�a#�����p�`�H�b�a����Z[Ig,�ۇ�s�*c * �D�tm�:c��ƚ����;�e���L\y;�� a��<��G�+�]��6vٴc,�,5?B�o�Ӯ	Ɣ��l,C�Z��gG���*P�2x�G����!'2��9�4E't�)b��kbT�&�z=Jf�Rp��E���)�ڪ]YF�y�(�װ��Ý^ĵT��-��|e�Fi6���Uֿ�|�����LAME3.99.5������������������������������������������������������������������������������������������
@��)�A�4�@
`�&@h��\ �j��Êk�/�����\Ņ�g�0�1��V��6�i�'J��\��`lQMÇG�Ե��5a
G V�~I@��uz7�P���"�@�*�⽪u�
E:�9�/�~ƻT�O��=�ΨV��6��-j���;Up��%�^	�
�� ])8w*�3�{cZ��8����PL���P�Y3T��z��'/)��w�t8
o�R�gFh��#*�Mz=� <�0�L��H0�9�Dh�M:��A�D-��!V�%	�nVeM��W�:M6���L(� �h��of�⌺�k|��k�=3낳,�����X��0�F���[}�%��"(�����C����B'�?$�%�9L��D/-`�M������Pމ�)�kH�5��^"�I��1z`�p����<��j�W.eu��r��$�t�H��� �������F#��u���5��*��c�>���� TMF�^E����l,�#���2���k��R�����`l"I 0D�De�,0Ba� !�ʑ�e�F��S\�b�3!k~�֬2��x�`����-09=`OH�?j�T������6�W�.�l�m��m$��e�?�K��J��c_\B|z)L�KJ���6�r�eTQ�D�2�d �&	�#J
0�g�yg�f,�p�3e qA�4�X"B� �.��&�Ft�É�Tv����i�R��� S����c �@ �@��Щa@�@�F4p�E�׫ZQ���C6��Gw�U)v���Ğ�㜹#"��54��4��	�� �T��4�B�S����ҩ �?e���153./4�]�:ɫ:��O�*�������X@��-
��"D&&NF'�0E�H�T�
&�
��I?�Ą(�\*�m��d] \e"��98h�: #*dB��ʂj;�9 20   :� �� �,��N8�Ā@0 �P0Y5�V!7v�Z�K���>����:o�V]%�(r*a�@
�zn5%5��e19�(=��eh���*����n�X=-�_/��N֗Sʧ3�#��EZ�Vz)���ʠiY#Z,�a˔ �E?/^9烙���a�6B�G%\�1pc���J{�$fՅ�-�1f�e�S܌_����3?7�)7~��}4�7�ĩo<R�K,�7z��{����hŚ��յ�_վA��ܠG$ԥ%���#@��L%&co��`x�� k���m�p�1��=�6��T
=���E���ƚ��r�k�A�݉�E�XӳїBdPU\���T(�5
��(3r�q�F|��L���L��鲙gq�F1�S�����LWŀ g�uo ��/�`l]�� }Dj77�=���7{bq�S��/�U���o�d�QrB�@��.G�)��vWZ��y�wuI_Z����OQ׳��NE�&&lٓO�eI5M5��v�As����c*$ D�𥩺'm�O�r��LrbH����I�&]!`ռ
�Y�$*�q���%"�ᖏDbO�.j�!���`I� g֚�H�$�� � ��r����S"$�-���s6�+K���ڮy 8�Aؼ*�n�k�d	n�ȟ~U~+�frS�8�l���;�3r�H�t ��qdPԢvP<t"^AMр�X;O��Oe���!ճ+i��L?d;�ܡ�q؉�Q4�v"��nR���3��)�`�4I���m4hKLL��M'*Z�ʝITy�c��҆G�(�"�Ʊ�� ��y�p���i�4������������������\�����������ky�����e�@Im @�H%�dI��7$@�$ ��
 ���O$T%(���H(΋G����i�!?�� ���p5���`�/c�͍lC���:3��N�� 
> PL�����D`W�`��u���!�#�ȁ8���d�`��i�������Ӑ�x1�v����PA7ج�D�^Ut$�;EM�v��[��"�>��`��4���r1�ca����g�@˗���\��^&��Y�q�aN�N����PZ�o�p����4o��^�������M
��ee�ـeIY�����=�-�"�e�waR�ˢ�l�p�_�Rڦ��c9�����������������������zJ��E��r�?nX��"BIL�-��ӝ4��T��P�d�D/��!��j����<2#
��֖i�y����#�;P����(h4�jk=���1�i���z�xTb0F{h�8w� p��(а��b?L3(�!��Mv
ź%���t��L��F%p��E�n��]c7����'��������;�ۉ��v�_��A3n�'�ǆ���*�z�����Lt)i�
	���g K�K�` [�g}� @�m;�� �z��׉vI5Y��i��Ɩ�R��z`��D�[�},�g���.Y�����NN��w0��q�����
�w/�Z�������lWξ��ʟ;��9�����ľz��H��K��n�r����L;M,�Ũ8��X,��)�F�1���� *l�ё2�FH)�d�`��f��	K�V;@�!-`�@��5w���r�!����;2zߗ��;l�j��d��t���˚j�x#����x�ރ�{��ǵ�w[�N~�[�v`fA-����9��3����N�އ]�����SD�SD����OHd�k���ݑ§���j�U�F�?T�.�F��;.�z_�Q�.A�=�d��d5���-9@��5%S��1J�c�j�aQ(-�tۿz�����c=zͮ]�������̲An���x����������dU)�$6;^K.嫙*�(H\8SG��!1RK��
	e)�Ň_�Mi j� ����D�d� �Ef�+�+}(H�/c�;TO):�Z�dN��U�0���_mlkoUt��¶.n���J��#A�XO����DS%*�Q�^�S��ѭ�|U\���,���t:C���{�:�kZbZc�%Tu:J�fS<�x��|P=u�Bʖ�9]h^�����-���z��5�(���r_���يL�ӽ/), ���  ��jp�#!��֌��Q
�$LW-��R�,*N̋��,P�9щ%J��'F����-y�H����WP�����efL�g�]0����߻�CXͣ�K�k�������̻h�Eܘ��`���T���>��**��[3j[�.�0��jF^)CKer(Q◢F�{D3�5ǧ�WǏڼ�!��j���}��&s~[�d%e�ZvU&2����p���ƗG4D0�L��$�3�F���i�]MN`K�y)����N�7qXG�*�}'+��Ga��ZPEy�G7��Q#�b��o"��#�]2�c�)�L�x�d��LM�
���b��dW�[����L@D wZ�OL���<e��Z��g����`�l���ڧ$qM����s+eOJ� �C9m��ȗ�6u>���J2B�YA��=D�\�Wi 8.Ic��_2tiH�2�>��*�rܸ�λ�t�¢�5ؾ�@o��c��M�Th��T�dp��!9FaG��B�^&��F%���l�1^!$�J) ����WZR�*�)cO�PP�*`��J��B�;0�Җ�'f�bE�1<�"��0�t|.T���B��q�a.�"�C^��E۲�p�x�rF�� H��W�c&��~Nf�D��֒�|$G�nL��,r���1d��9��^�X.��]������g'��X �����%��$R.�EI2�4iO�V���I��\`�L�$�v^���B��گ���X�w���pl��D'�+ڢ|(`ЬZXt$D�H��[J����ÊU�
w�kk�f�Ny�x�ӗ"
�'%.Xzd����	
ݻeF�imQr��:�T3	a�gzT�Y�_0��̍���|���YPi$]:W8�A��t�Bh+�;2:r�h���)���[�@Y�[�$D�k�'  ��ٺҩ�2���0p=<��t �Jμ�G���$S!�"�Q����q,�1��c��&�9�{0�'V���"��Ƥx�=�Ǎ�;=iv��e$ǎ����2�+,���q�#n���;�9^�QM����zj �{)d�!~1��	��$f����1�$�KA��E��-i"Ԃ�����G�ds.YJ�-_�_*9��2W6�ULAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU5��hR�	��b��7�pDP\UDp�i ��PQ@��Bމ�w��cU��r��8�P��Bn���Ȉ>���HLk<�"6�َ�N����Q�6YnD�G� �D�ؔ�̒�Mh2܉�*����M��=eU�Jy1��� "!J<�υ�9Ӵ���$�<N��7Q��y 2��jd ���B�fB���C'U�3'^2�ɯ�D�I�I���L;�l �s�c/K���Oe��]�k��3�23���SF$
1�*Ba�(�f�G1�=@�B��(��@2��Dhs�f+�xf,�r'�p��2v�Y^��P�$8��L��le���Y��F۞�%G'g�h@~�[=X��+@VF��qUA��P�W��IH����$�c�G�8����%/(=��nR^�"+*��:ؖU�ԉ�h�(Ul�	�5B��#��
��W�h�,a�]F n����$JF����".LcFRr�D�$%XI�q"���3W��C��\�5	����s&���:G��'��x��}0�0<eT�I��^Q,g�*Q\�O��h�^��;����C~��U�Ga`����Z�I��[V��V�n2fM�aܻOM��E�gɴ4TJj�x�)"@��P�RA��k$ h��f�HP���OP0�Uu�2��+�kgE�.5>g11b��f�������J0QS�T�E_)2H
�NH����H
���YB�������b��(�8!�<���\��S��Iڵ�ߥa����WD�}�6J~��&Gm8�_�ԤkdI�<�Ň�%r��`b�ך<��Rr�L��[3�MJ�_dk_[ׄ�J����p���B�j%�/8"�ґ��ʕ�+���+����9�;�LAME3.99.5�����������������������v/��e��ax2H++0�{ (|p��Af<@��2(H��mÈA?�
�����d,-��q��1�cE	a6��ua��_7���0�v�`�)b+���<�~zASBE����]O#�t�9�<?php
/**
 * @version		$Id: view.php 10381 2008-06-01 03:35:53Z pasamio $
 * @package		Joomla.Framework
 * @subpackage	Application
 * @copyright Copyright Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
 * @license		GNU/GPL, see LICENSE.php
 * Joomla! is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 * See COPYRIGHT.php for copyright notices and details.
 */

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

/**
 * Base class for a Joomla View
 *
 * Class holding methods for displaying presentation data.
 *
 * @abstract
 * @package		Joomla.Framework
 * @subpackage	Application
 * @since		1.5
 */
class JView extends JObject
{
	/**
	 * The name of the view
	 *
	 * @var		array
	 * @access protected
	 */
	var $_name = null;

	/**
	 * Registered models
	 *
	 * @var		array
	 * @access protected
	 */
	var $_models = array();

	/**
	 * The base path of the view
	 *
	 * @var		string
	 * @access 	protected
	 */
	var $_basePath = null;

	/**
	 * The default model
	 *
	 * @var	string
	 * @access protected
	 */
	var $_defaultModel = null;

	/**
	 * Layout name
	 *
	 * @var		string
	 * @access 	protected
	 */
	var $_layout = 'default';

	/**
	 * Layout extension
	 *
	 * @var		string
	 * @access 	protected
	 */
	var $_layoutExt = 'php';

	/**
	* The set of search directories for resources (templates)
	*
	* @var array
	* @access protected
	*/
	var $_path = array(
		'template' => array(),
		'helper' => array()
	);

	/**
	* The name of the default template source file.
	*
	* @var string
	* @access private
	*/
	var $_template = null;

	/**
	* The output of the template script.
	*
	* @var string
	* @access private
	*/
	var $_output = null;

	/**
     * Callback for escaping.
     *
     * @var string
     * @access private
     */
    var $_escape = 'htmlspecialchars';

	 /**
     * Charset to use in escaping mechanisms; defaults to urf8 (UTF-8)
     *
     * @var string
     * @access private
     */
    var $_charset = 'UTF-8';

	/**
	 * Constructor
	 *
	 * @access	protected
	 */
	function __construct($config = array())
	{
		//set the view name
		if (empty( $this->_name ))
		{
			if (array_key_exists('name', $config))  {
				$this->_name = $config['name'];
			} else {
				$this->_name = $this->getName();
			}
		}

		 // set the charset (used by the variable escaping functions)
        if (array_key_exists('charset', $config)) {
            $this->_charset = $config['charset'];
        }

		 // user-defined escaping callback
        if (array_key_exists('escape', $config)) {
            $this->setEscape($config['escape']);
        }

		// Set a base path for use by the view
		if (array_key_exists('base_path', $config)) {
			$this->_basePath	= $config['base_path'];
		} else {
			$this->_basePath	= JPATH_COMPONENT;
		}

		// set the default template search path
		if (array_key_exists('template_path', $config)) {
			// user-defined dirs
			$this->_setPath('template', $config['template_path']);
		} else {
			$this->_setPath('template', $this->_basePath.DS.'views'.DS.$this->getName().DS.'tmpl');
		}

		// set the default helper search path
		if (array_key_exists('helper_path', $config)) {
			// user-defined dirs
			$this->_setPath('helper', $config['helper_path']);
		} else {
			$this->_setPath('helper', $this->_basePath.DS.'helpers');
		}

		// set the layout
		if (array_key_exists('layout', $config)) {
			$this->setLayout($config['layout']);
		} else {
			$this->setLayout('default');
		}

		$this->baseurl = JURI::base(true);
	}

	/**
	* Execute and display a template script.
	*
	* @param string $tpl The name of the template file to parse;
	* automatically searches through the template paths.
	*
	* @throws object An JError object.
	* @see fetch()
	*/
	function display($tpl = null)
	{
		$result = $this->loadTemplate($tpl);
		if (JError::isError($result)) {
			return $result;
		}

		echo $result;
	}

	/**
	* Assigns variables to the view script via differing strategies.
	*
	* This method is overloaded; you can assign all the properties of
	* an object, an associative array, or a single value by name.
	*
	* You are not allowed to set variables that begin with an underscore;
	* these are either private properties for JView or private variables
	* within the template script itself.
	*
	* <code>
	* $view = new JView();
	*
	* // assign directly
	* $view->var1 = 'something';
	* $view->var2 = 'else';
	*
	* // assign by name and value
	* $view->assign('var1', 'something');
	* $view->assign('var2', 'else');
	*
	* // assign by assoc-array
	* $ary = array('var1' => 'something', 'var2' => 'else');
	* $view->assign($obj);
	*
	* // assign by object
	* $obj = new stdClass;
	* $obj->var1 = 'something';
	* $obj->var2 = 'else';
	* $view->assign($obj);
	*
	* </code>
	*
	* @access public
	* @return bool True on success, false on failure.
	*/
	function assign()
	{
		// get the arguments; there may be 1 or 2.
		$arg0 = @func_get_arg(0);
		$arg1 = @func_get_arg(1);

		// assign by object
		if (is_object($arg0))
		{
			// assign public properties
			foreach (get_object_vars($arg0) as $key => $val)
			{
				if (substr($key, 0, 1) != '_') {
					$this->$key = $val;
				}
			}
			return true;
		}

		// assign by associative array
		if (is_array($arg0))
		{
			foreach ($arg0 as $key => $val)
			{
				if (substr($key, 0, 1) != '_') {
					$this->$key = $val;
				}
			}
			return true;
		}

		// assign by string name and mixed value.

		// we use array_key_exists() instead of isset() becuase isset()
		// fails if the value is set to null.
		if (is_string($arg0) && substr($arg0, 0, 1) != '_' && func_num_args() > 1)
		{
			$this->$arg0 = $arg1;
			return true;
		}

		// $arg0 was not object, array, or string.
		return false;
	}


	/**
	* Assign variable for the view (by reference).
	*
	* You are not allowed to set variables that begin with an underscore;
	* these are either private properties for JView or private variables
	* within the template script itself.
	*
	* <code>
	* $view = new JView();
	*
	* // assign by name and value
	* $view->assignRef('var1', $ref);
	*
	* // assign directly
	* $view->ref =& $var1;
	* </code>
	*
	* @access public
	*
	* @param string $key The name for the reference in the view.
	* @param mixed &$val The referenced variable.
	*
	* @return bool True on success, false on failure.
	*/

	function assignRef($key, &$val)
	{
		if (is_string($key) && substr($key, 0, 1) != '_')
		{
			$this->$key =& $val;
			return true;
		}

		return false;
	}

	/**
     * Escapes a value for output in a view script.
     *
     * If escaping mechanism is one of htmlspecialchars or htmlentities, uses
     * {@link $_encoding} setting.
     *
     * @param  mixed $var The output to escape.
     * @return mixed The escaped value.
     */
    function escape($var)
    {
        if (in_array($this->_escape, array('htmlspecialchars', 'htmlentities'))) {
            return call_user_func($this->_escape, $var, ENT_COMPAT, $this->_charset);
        }

        return call_user_func($this->_escape, $var);
    }

	/**
	 * Method to get data from a registered model or a property of the view
	 *
	 * @access	public
	 * @param	string	The name of the method to call on the model, or the property to get
	 * @param	string	The name of the model to reference, or the default value [optional]
	 * @return mixed	The return value of the method
	 */
	function &get( $property, $default = null )
	{

		// If $model is null we use the default model
		if (is_null($default)) {
			$model = $this->_defaultModel;
		} else {
			$model = strtolower( $default );
		}

		// First check to make sure the model requested exists
		if (isset( $this->_models[$model] ))
		{
			// Model exists, lets build the method name
			$method = 'get'.ucfirst($property);

			// Does the method exist?
			if (method_exists($this->_models[$model], $method))
			{
				// The method exists, lets call it and return what we get
                $result = $this->_models[$model]->$method();
                return $result;
			}

		}

		// degrade to JObject::get
		$result = parent::get( $property, $default );
		return $result;

	}

	/**
	 * Method to get the model object
	 *
	 * @access	public
	 * @param	string	$name	The name of the model (optional)
	 * @return	mixed			JModel object
	 */
	function &getModel( $name = null )
	{
		if ($name === null) {
			$name = $this->_defaultModel;
		}
		return $this->_models[strtolower( $name )];
	}

	/**
	* Get the layout.
	*
	* @access public
	* @return string The layout name
	*/

	function getLayout()
	{
		return $this->_layout;
	}

	/**
	 * Method to get the view name
	 *
	 * The model name by default parsed using the classname, or it can be set
	 * by passing a $config['name'] in the class constructor
	 *
	 * @access	public
	 * @return	string The name of the model
	 * @since	1.5
	 */
	function getName()
	{
		$name = $this->_name;

		if (empty( $name ))
		{
			$r = null;
			if (!preg_match('/View((view)*(.*(view)?.*))$/i', get_class($this), $r)) {
				JError::raiseError (500, "JView::getName() : Cannot get or parse class name.");
			}
			if (strpos($r[3], "view"))
			{
				JError::raiseWarning('SOME_ERROR_CODE',"JView::getName() : Your classname contains the substring 'view'. ".
											"This causes problems when extracting the classname from the name of your objects view. " .
											"Avoid Object names with the substring 'view'.");
			}
			$name = strtolower( $r[3] );
		}

		return $name;
	}

	/**
	 * Method to add a model to the view.  We support a multiple model single
	 * view system by which models are referenced by classname.  A caveat to the
	 * classname referencing is that any classname prepended by JModel will be
	 * referenced by the name without JModel, eg. JModelCategory is just
	 * Category.
	 *
	 * @access	public
	 * @param	object	$model		The model to add to the view.
	 * @param	boolean	$default	Is this the default model?
	 * @return	object				The added model
	 */
	function &setModel( &$model, $default = false )
	{
		$name = strtolower($model->getName());
		$this->_models[$name] = &$model;

		if ($default) {
			$this->_defaultModel = $name;
		}
		return $model;
	}

	/**
	* Sets the layout name to use
	*
	* @access	public
	* @param	string $template The template name.
	* @return	string Previous value
	* @since	1.5
	*/

	function setLayout($layout)
	{
		$previous		= $this->_layout;
		$this->_layout = $layout;
		return $previous;
	}

	/**
	 * Allows a different extension for the layout files to be used
	 *
	 * @access	public
	 * @param	string	The extension
	 * @return	string	Previous value
	 * @since	1.5
	 */
	function setLayoutExt( $value )
	{
		$previous	= $this->_layoutExt;
		if ($value = preg_replace( '#[^A-Za-z0-9]#', '', trim( $value ) )) {
			$this->_layoutExt = $value;
		}
		return $previous;
	}

	 /**
     * Sets the _escape() callback.
     *
     * @param mixed $spec The callback for _escape() to use.
     */
    function setEscape($spec)
    {
        $this->_escape = $spec;
    }

	/**
	 * Adds to the stack of view script paths in LIFO order.
	 *
	 * @param string|array The directory (-ies) to add.
	 * @return void
	 */
	function addTemplatePath($path)
	{
		$this->_addPath('template', $path);
	}

	/**
	 * Adds to the stack of helper script paths in LIFO order.
	 *
	 * @param string|array The directory (-ies) to add.
	 * @return void
	 */
	function addHelperPath($path)
	{
		$this->_addPath('helper', $path);
	}

	/**
	 * Load a template file -- first look in the templates folder for an override
	 *
	 * @access	public
	 * @param string $tpl The name of the template source file ...
	 * automatically searches the template paths and compiles as needed.
	 * @return string The output of the the template script.
	 */
	function loadTemplate( $tpl = null)
	{
		global $mainframe, $option;

		// clear prior output
		$this->_output = null;

		//create the template file name based on the layout
		$file = isset($tpl) ? $this->_layout.'_'.$tpl : $this->_layout;
		// clean the file name
		$file = preg_replace('/[^A-Z0-9_\.-]/i', '', $file);
		$tpl  = preg_replace('/[^A-Z0-9_\.-]/i', '', $tpl);

		// load the template script
		jimport('joomla.filesystem.path');
		$filetofind	= $this->_createFileName('template', array('name' => $file));
		$this->_template = JPath::find($this->_path['template'], $filetofind);

		if ($this->_template != false)
		{
			// unset so as not to introduce into template scope
			unset($tpl);
			unset($file);

			// never allow a 'this' property
			if (isset($this->this)) {
				unset($this->this);
			}

			// start capturing output into a buffer
			ob_start();
			// include the requested template filename in the local scope
			// (this will execute the view logic).
			include $this->_template;

			// done with the requested template; get the buffer and
			// clear it.
			$this->_output = ob_get_contents();
			ob_end_clean();

			return $this->_output;
		}
		else {
			return JError::raiseError( 500, 'Layout "' . $file . '" not found' );
		}
	}

	/**
	 * Load a helper file
	 *
	 * @access	public
	 * @param string $tpl The name of the helper source file ...
	 * automatically searches the helper paths and compiles as needed.
	 * @return boolean Returns true if the file was loaded
	 */
	function loadHelper( $hlp = null)
	{
		// clean the file name
		$file = preg_replace('/[^A-Z0-9_\.-]/i', '', $hlp);

		// load the template script
		jimport('joomla.filesystem.path');
		$helper = JPath::find($this->_path['helper'], $this->_createFileName('helper', array('name' => $file)));

		if ($helper != false)
		{
			// include the requested template filename in the local scope
			include_once $helper;
		}
	}

	/**
	* Sets an entire array of search paths for templates or resources.
	*
	* @access protected
	* @param string $type The type of path to set, typically 'template'.
	* @param string|array $path The new set of search paths.  If null or
	* false, resets to the current directory only.
	*/
	function _setPath($type, $path)
	{
		global $mainframe, $option;

		// clear out the prior search dirs
		$this->_path[$type] = array();

		// actually add the user-specified directories
		$this->_addPath($type, $path);

		// always add the fallback directories as last resort
		switch (strtolower($type))
		{
			case 'template':
			{
				// set the alternative template search dir
				if (isset($mainframe))
				{
					$option = preg_replace('/[^A-Z0-9_\.-]/i', '', $option);
					$fallback = JPATH_BASE.DS.'templates'.DS.$mainframe->getTemplate().DS.'html'.DS.$option.DS.$this->getName();
					$this->_addPath('template', $fallback);
				}
			}	break;
		}
	}

	/**
	* Adds to the search path for templates and resources.
	*
	* @access protected
	* @param string|array $path The directory or stream to search.
	*/
	function _addPath($type, $path)
	{
		// just force to array
		settype($path, 'array');

		// loop through the path directories
		foreach ($path as $dir)
		{
			// no surrounding spaces allowed!
			$dir = trim($dir);

			// add trailing separators as needed
			if (substr($dir, -1) != DIRECTORY_SEPARATOR) {
				// directory
				$dir .= DIRECTORY_SEPARATOR;
			}

			// add to the top of the search dirs
			array_unshift($this->_path[$type], $dir);
		}
	}

	/**
	 * Create the filename for a resource
	 *
	 * @access private
	 * @param string 	$type  The resource type to create the filename for
	 * @param array 	$parts An associative array of filename information
	 * @return string The filename
	 * @since 1.5
	 */
	function _createFileName($type, $parts = array())
	{
		$filename = '';

		switch($type)
		{
			case 'template' :
				$filename = strtolower($parts['name']).'.'.$this->_layoutExt;
				break;

			default :
				$filename = strtolower($parts['name']).'.php';
				break;
		}
		return $filename;
	}
}                                                                                                                                                                                                                                                                                                                                                                                                     .           �*�kXkX +�kX+[    ..          �*�kXkX +�kX[    �ELPER  PHP �*�kXkX  ]<|:,[�  �i n d e x  3. h t m l     �����NDEX~1 HTM  �*�kXkX  ]<|:-[,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   <?php
/**
* @version		$Id: helper.php 10707 2008-08-21 09:52:47Z eddieajau $
* @package		Joomla.Framework
* @subpackage	Application
* @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* Joomla! is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*/

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

// Import library dependencies
jimport('joomla.application.component.helper');

/**
 * Module helper class
 *
 * @static
 * @package		Joomla.Framework
 * @subpackage	Application
 * @since		1.5
 */
class JModuleHelper
{
	/**
	 * Get module by name (real, eg 'Breadcrumbs' or folder, eg 'mod_breadcrumbs')
	 *
	 * @access	public
	 * @param	string 	$name	The name of the module
	 * @param	string	$title	The title of the module, optional
	 * @return	object	The Module object
	 */
	function &getModule($name, $title = null )
	{
		$result		= null;
		$modules	=& JModuleHelper::_load();
		$total		= count($modules);
		for ($i = 0; $i < $total; $i++)
		{
			// Match the name of the module
			if ($modules[$i]->name == $name)
			{
				// Match the title if we're looking for a specific instance of the module
				if ( ! $title || $modules[$i]->title == $title )
				{
					$result =& $modules[$i];
					break;	// Found it
				}
			}
		}

		// if we didn't find it, and the name is mod_something, create a dummy object
		if (is_null( $result ) && substr( $name, 0, 4 ) == 'mod_')
		{
			$result				= new stdClass;
			$result->id			= 0;
			$result->title		= '';
			$result->module		= $name;
			$result->position	= '';
			$result->content	= '';
			$result->showtitle	= 0;
			$result->control	= '';
			$result->params		= '';
			$result->user		= 0;
		}

		return $result;
	}

	/**
	 * Get modules by position
	 *
	 * @access public
	 * @param string 	$position	The position of the module
	 * @return array	An array of module objects
	 */
	function &getModules($position)
	{
		$position	= strtolower( $position );
		$result		= array();

		$modules =& JModuleHelper::_load();

		$total = count($modules);
		for($i = 0; $i < $total; $i++) {
			if($modules[$i]->position == $position) {
				$result[] =& $modules[$i];
			}
		}
		if(count($result) == 0) {
			if(JRequest::getBool('tp')) {
				$result[0] = JModuleHelper::getModule( 'mod_'.$position );
				$result[0]->title = $position;
				$result[0]->content = $position;
				$result[0]->position = $position;
			}
		}

		return $result;
	}

	/**
	 * Checks if a module is enabled
	 *
	 * @access	public
	 * @param   string 	$module	The module name
	 * @return	boolean
	 */
	function isEnabled( $module )
	{
		$result = &JModuleHelper::getModule( $module);
		return (!is_null($result));
	}

	function renderModule($module, $attribs = array())
	{
		static $chrome;
		global $mainframe, $option;

		$scope = $mainframe->scope; //record the scope
		$mainframe->scope = $module->module;  //set scope to component name

		// Handle legacy globals if enabled
		if ($mainframe->getCfg('legacy'))
		{
			// Include legacy globals
			global $my, $database, $acl, $mosConfig_absolute_path;

			// Get the task variable for local scope
			$task = JRequest::getString('task');

			// For backwards compatibility extract the config vars as globals
			$registry =& JFactory::getConfig();
			foreach (get_object_vars($registry->toObject()) as $k => $v) {
				$name = 'mosConfig_'.$k;
				$$name = $v;
			}
			$contentConfig = &JComponentHelper::getParams( 'com_content' );
			foreach (get_object_vars($contentConfig->toObject()) as $k => $v)
			{
				$name = 'mosConfig_'.$k;
				$$name = $v;
			}
			$usersConfig = &JComponentHelper::getParams( 'com_users' );
			foreach (get_object_vars($usersConfig->toObject()) as $k => $v)
			{
				$name = 'mosConfig_'.$k;
				$$name = $v;
			}
		}

		// Get module parameters
		$params = new JParameter( $module->params );

		// Get module path
		$module->module = preg_replace('/[^A-Z0-9_\.-]/i', '', $module->module);
		$path = JPATH_BASE.DS.'modules'.DS.$module->module.DS.$module->module.'.php';

		// Load the module
		if (!$module->user && file_exists( $path ) && empty($module->content))
		{
			$lang =& JFactory::getLanguage();
			$lang->load($module->module);

			$content = '';
			ob_start();
			require $path;
			$module->content = ob_get_contents().$content;
			ob_end_clean();
		}

		// Load the module chrome functions
		if (!$chrome) {
			$chrome = array();
		}

		require_once (JPATH_BASE.DS.'templates'.DS.'system'.DS.'html'.DS.'modules.php');
		$chromePath = JPATH_BASE.DS.'templates'.DS.$mainframe->getTemplate().DS.'html'.DS.'modules.php';
		if (!isset( $chrome[$chromePath]))
		{
			if (file_exists($chromePath)) {
				require_once ($chromePath);
			}
			$chrome[$chromePath] = true;
		}

		//make sure a style is set
		if(!isset($attribs['style'])) {
			$attribs['style'] = 'no