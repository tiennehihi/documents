<html><body bgcolor="#FFFFFF"></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    tyle.maxWidth != 'undefined' )
				tbWindow.css({'top':'30px','margin-top':'0'});
		}
	};

	thickDims();
	$(window).resize( function() { thickDims() } );

	$('a.thickbox-preview').click( function() {
		tb_click.call(this);

		var alink = $(this).parents('.available-theme').find('.activatelink'), link = '', href = $(this).attr('href'), url, text;

		if ( tbWidth = href.match(/&tbWidth=[0-9]+/) )
			tbWidth = parseInt(tbWidth[0].replace(/[^0-9]+/g, ''), 10);
		else
			tbWidth = $(window).width() - 90;

		if ( tbHeight = href.match(/&tbHeight=[0-9]+/) )
			tbHeight = parseInt(tbHeight[0].replace(/[^0-9]+/g, ''), 10);
		else
			tbHeight = $(window).height() - 60;

		if ( alink.length ) {
			url = alink.attr('href') || '';
			text = alink.attr('title') || '';
			link = '&nbsp; <a href="' + url + '" target="_top" class="tb-theme-preview-link">' + text + '</a>';
		} else {
			text = $(this).attr('title') || '';
			link = '&nbsp; <span class="tb-theme-preview-link">' + text + '</span>';
		}

		$('#TB_title').css({'background-color':'#222','color':'#dfdfdf'});
		$('#TB_closeAjaxWindow').css({'float':'left'});
		$('#TB_ajaxWindowTitle').css({'float':'right'}).html(link);

		$('#TB_iframeContent').width('100%');
		thickDims();

		return false;
	} );
});
                                                                                                                                                                                                                                                                                 E�-h���N8��� L��iT����pi����P]�P��,��X%�\1-L:�
��� S:�r�������8�P�偊o�F��{�`bkBO��v�ݮ����H�WJ���Lꁑ �h��LM��-Oi�գi�=�d4j����u���Tȥ&b�VO[��-��J<�Gep��ĉ�&�Z�[��޾���u�v\J5�Y m�'b�S�V0X�<��
d�)/S��EYF�PDH�ӎ3� �߰T���M��R�#].��L���=�(���S�$P��~�s�\�`dqi
T��[�P ����[�Ip�
���lB0yҠ.�A���ʼq�M*��|LT=���z�.+4�ehzu������	�bR:�\	Ǉ���kAB�`�l�[} �f�X�H��