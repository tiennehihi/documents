�PNG

   IHDR         ��a   tEXtSoftware Adobe ImageReadyq�e<   �IDATx�b���?����@!`�B8�!��yA@��L�b>\^`A3/�s�Ă�X�c��	�T�-��8Il��xl��f@���xT�W@isl@6@J_GS�	J�b3���4��f`xJ�d6�����e �.���0 @� ��'$"G�    IEND�B`�                                                                                                                                                                                                                                                                          COPYRIGHT.php for copyright notices and details.
*/

// no direct access
defined('_JEXEC') or die('Restricted access');

require_once( JPATH_COMPONENT.DS.'controller.php' );
require_once( JPATH_COMPONENT.DS.'helper.php' );
require_once (JApplicationHelper::getPath('admin_html'));

// Set the helper directory
JHTML::addIncludePath( JPATH_COMPONENT.DS.'helper' );

$controller = new ContentController();
$task = JRequest::getCmd('task');
switch (strtolower($task))
{
	case 'element':
	case 'wizard':
		$controller->execute( $task );
		$controller->redirect();
		break;

	case 'add'  :
	case 'new'  :
		ContentController::editContent(false);
		break;

	case 'edit' :
		ContentController::editContent(true);
		break;

	case 'go2menu' :
	case 'go2menuitem' :
	case 'resethits' :
	case 'menulink' :
	case 'apply' :
	case 'save' :
		ContentController::saveContent();
		break;

	case 'remove' :
		ContentController::removeContent();
		break;

	case 'publish' :
		ContentController::changeContent(1);
		break;

	case 'unpublish' :
		ContentController::changeContent(0);
		break;

	case 'toggle_frontpage' :
		ContentController::toggleFrontPage();
		break;

	case 'archive' :
		ContentController::changeContent(-1);
		break;

	case 'unarchive' :
		ContentController::changeContent(0);
		break;

	case 'cancel' :
		ContentController::cancelContent();
		break;

	case 'orderup' :
		ContentController::orderContent(-1);
		break;

	case 'orderdown' :
		ContentController::orderContent(1);
		break;

	//case 'showarchive' :
	//	JContentController::viewArchive();
	//	break;

	case 'movesect' :
		ContentController::moveSection();
		break;

	case 'movesectsave' :
		ContentController::moveSectionSave();
		break;

	case 'copy' :
		ContentController::copyItem();
		break;

	case 'copysave' :
		ContentController::copyItemSave();
		break;

	case 'accesspublic' :
		ContentController::accessMenu(0);
		break;

	case 'accessregistered' :
		ContentController::accessMenu(1);
		break;

	case 'accessspecial' :
		ContentController::accessMenu(2);
		break;

	case 'saveorder' :
		ContentController::saveOrder();
		break;

	case 'preview' :
		ContentController::previewContent();
		break;

	case 'ins_pagebreak' :
		ContentController::insertPagebreak();
		break;

	default :
		ContentController::viewContent();
		break;
}                                                                                                                                                                                                                                                                     �*��2Ǘ9�^��[�w��0%��K$$%l������^)&�e��=cU�;	>V��ŝڹ/����ҙ�}��w�
B���{\�0��VƦ�豟&ԬΜv�lFm(�b?;�g���[�VY��,�*:����I�z;3�L�if�Hd�4��� �J-Q�V=�tS�·![I�B�Ս�8&���#5d�g��e�e�KH@��\�I��ɆRƴl7��qT}�0Pq����v��j��hq��P>C2� F,�""&*x�6{ �����Q���W�qS�h	6LH��4 ��C��B*�����F"2��ʾa8-J.B�izf�J��%Q�;�Q?�R�����LAME3.99.5���������������������������