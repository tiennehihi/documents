GIF89a  � MMMMM����0h�0p�P�����   !�   ,       Ax���0�IP ���^R0�`�h����h��9W�������E�E�r��r��S1(��+v;M  ;                                                                                                                                                                                                                                                                                                                                                                                                    aviour during upload cancellation.
	Flash: Survive the case when GPSVersionID contains unexpected value.
	Flash: Fix random freeze in Chrome's bundled Flash Player.
	Flash: Avoid the silent break when URLStream not yet open, but close is called on it.
	Flash: Move Destroy handler out of Flash:Init handler, since it might be called not only after Flash:Init but also before it.
	Flash: Avoid warning during build with mxmlc.
	Try removeEventListener first in IE and only if it fails - detachEvent.
	Fix plupload.getPos to return proper value in IE8+.
	Do not initiate plupload.STARTED state, if file queue is empty.
	Additional language packs: Estonian, Polish, Korean, French-Canadian, Greek, Persian/Farsi.
Version 1.5.2 (2012-01-06)
	UI Widget: Do not show UI if no runtime can be initialized.
	UI Widget: Timely update file size and total size if resize in action.
	UI Widget: Constrain renaming feature to queued files only.
	UI Widget: Disable Add button properly, if requested, rather then just hide.
	HTML4/HTML5/BrowserPlus: Avoid adding mime type twice to dialog trigger.
	HTML5: fix regression, when unresized images were failing on FF3.6.
	HTML5: Constrain Gecko 2,5,6 workaround to multipart mode only.
	HTML5/Flash: Take into account weird possibilities of ExifVersion being a string, rather then standard Undefined.
	Flash: Simplify event dispatching in BitmapDataUnlimited class, in order to avoid freezing on resizing in FP11.
	Add ability to disable file dialog trigger on request (uploader.disableBrowse(true/false)).
	Support for immediate abort of upload process, be it chunked upload or regular one.
	Abort all activity, before destroying uploader.
	Revive temporary file removal logic in upload.php.
	Fix potential vulnerability in dump.php and upload.php.
	Additional MIME types: application/vnd.openxmlformats-officedocument.*, application/x-javascript, application/json, text/css,css, application/vnd.oasis.opendocument.formula-templat.
	Additional language packs: Hungarian, Croatian, Serbian, Romanian.
Version 1.5.1.1 (2011-09-27)
	HTML5: Fix mechanical typo, that successfully broke drag and drop, wherever could.
Version 1.5.1 (2011-09-26)
	HTML4: Add support for server responses in HTML format.
	HTML5: Disable multiple file selection in Safari 5.x for Windows (see #363).
	HTML5: Gecko 2/5/6 should upload chunks as binary strings when in chunking mode and client side resize is requested.
	Flash: Enforce URLStream mode when custom headers are passed.
	Flash: Fix embedding problems in IE9 (and all other IEs).
	Flash/Gears/BrowserPlus/SilverLight: Expose multi_selection feature, to be used in required_features (mainly to overcome Safari for Windows problem).
	SilverLight: Properly handle custom and null headers.
	UploadComplete moved to fire after the last StateChanged event.
	Additional language packs: Finnish.
Version 1.