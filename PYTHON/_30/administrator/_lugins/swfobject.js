/* Window classes */

.mceWindow {
	position: absolute;
	left: 0;
	top: 0;
	border: 1px solid black;
	background-color: #D4D0C8;
}

.mceWindowHead {
	background-color: #334F8D;
	width: 100%;
	height: 18px;
	cursor: move;
	overflow: hidden;
}

.mceWindowBody {
	clear: both;
	background-color: white;
}

.mceWindowStatusbar {
	background-color: #D4D0C8;
	height: 12px;
	border-top: 1px solid black;
}

.mceWindowTitle {
	float: left;
	font-family: "MS Sans Serif";
	font-size: 9pt;
	font-weight: bold;
	line-height: 18px;
	color: white;
	margin-left: 2px;
	overflow: hidden;
}

.mceWindowHeadTools {
	margin-right: 2px;
}

.mceWindowClose, .mceWindowMinimize, .mceWindowMaximize {
	display: block;
	float: right;
	overflow: hidden;
	margin-top: 2px;
}

.mceWindowClose {
	margin-left: 2px;
}

.mceWindowMinimize {
}

.mceWindowMaximize {
}

.mceWindowResize {
	display: block;
	float: right;
	overflow: hidden;
	cursor: se-resize;
	width: 12px;
	height: 12px;
}
                                                               e}}}}catch(s){u=false}return u}d.silverlight={trigger:function(n,k){var m=a[n],l,j;if(m){j=d.toArray(arguments).slice(1);j[0]="Silverlight:"+k;setTimeout(function(){m.trigger.apply(m,j)},0)}}};d.runtimes.Silverlight=d.addRuntime("silverlight",{getFeatures:function(){return{jpgresize:true,pngresize:true,chunks:true,progress:true,multipart:true,multi_selection:true}},init:function(p,q){var o,m="",n=p.settings.filters,l,k=b.body;if(!f("2.0.31005.0")||(g.opera&&g.opera.buildNumber)){q({success:false});return}h[p.id]=false;a[p.id]=p;o=b.createElement("div");o.id=p.id+"_silverlight_container";d.extend(o.style,{position:"absolute",top:"0px",background:p.settings.shim_bgcolor||"transparent",zIndex:99999,width:"100px",height:"100px",overflow:"hidden",opacity:p.settings.shim_bgcolor||b.documentMode>8?"":0.01});o.className="plupload silverlight";if(p.settings.container){k=b.getElementById(p.settings.container);if(d.getStyle(k,"position")==="static"){k.style.position="relative"}}k.appendChild(o);for(l=0;l<n.length;l++){m+=(m!=""?"|":"")+n[l].title+" | *."+n[l].extensions.replace(/,/g,";*.")}o.innerHTML='<object id="'+p.id+'_silverlight" data="data:application/x-silverlight," type="application/x-silverlight-2" style="outline:none;" width="1024" height="1024"><param name="source" value="'+p.settings.silverlight_xap_url+'"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="enablehtmlaccess" value="true"/><param name="initParams" value="id='+p.id+",filter="+m+",multiselect="+p.settings.multi_selection+'"/></object>';function j(){return b.getElementById(p.id+"_silverlight").content.Upload}p.bind("Silverlight:Init",function(){var i,r={};if(h[p.id]){return}h[p.id]=true;p.bind("Silverlight:StartSelectFiles",function(s){i=[]});p.bind("Silverlight:SelectFile",function(s,v,t,u){var w;w=d.guid();r[w]=v;r[v]=w;i.push(new d.File(w,t,u))});p.bind("Silverlight:SelectSuccessful",function(){if(i.length){p.trigger("FilesAdded",i)}});p.bind("Silverlight:UploadChunkError",function(s,v,t,w,u){p.trigger("Error",{code:d.IO_ERROR,message:"IO Error.",details:u,file:s.getFile(r[v])})});p.bind("Silverlight:UploadFileProgress",function(s,w,t,v){var u=s.getFile(r[w]);if(u.status!=d.FAILED){u.size=v;u.loaded=t;s.trigger("UploadProgress",u)}});p.bind("Refresh",function(s){var t,u,v;t=b.getElementById(s.settings.browse_button);if(t){u=d.getPos(t,b.getElementById(s.settings.container));v=d.getSize(t);d.extend(b.getElementById(s.id+"_silverlight_container").style,{top:u.y+"px",left:u.x+"px",width:v.w+"px",height:v.h+"px"})}});p.bind("Silverlight:UploadChunkSuccessful",function(s,v,t,y,x){var w,u=s.getFile(r[v]);w={chunk:t,chunks:y,response:x};s.trigger("ChunkUploaded",u,w);if(u.status!=d.FAILED&&s.state!==d.STOPPED){j().UploadNextChunk()}if(t==y-1){u.status=d.DONE;s.trigger("FileUploaded",u,{response:x})}});p.bind("Silverlight:UploadSuccessful",function(s,v,t){var u=s.getFile(r[v]);u.status=d.DONE;s.trigger("FileUploaded",u,{response:t})});p.bind("FilesRemoved",function(s,u){var t;for(t=0;t<u.length;t++){j().RemoveFile(r[u[t].id])}});p.bind("UploadFile",function(s,u){var v=s.settings,t=v.resize||{};j().UploadFile(r[u.id],s.settings.url,c({name:u.target_name||u.name,mime:d.mimeTypes[u.name.replace(/^.+\.([^.]+)/,"$1").toLowerCase()]||"application/octet-stream",chunk_size:v.chunk_size,image_width:t.width,image_height:t.height,image_quality:t.quality||90,multipart:!!v.multipart,multipart_params:v.multipart_params||{},file_data_name:v.file_data_name,headers:v.headers}))});p.bind("CancelUpload",function(){j().CancelUpload()});p.bind("Silverlight:MouseEnter",function(s){var t,u;t=b.getElementById(p.settings.browse_button);u=s.settings.browse_button_hover;if(t&&u){d.addClass(t,u)}});p.bind("Silverlight:MouseLeave",function(s){var t,u;t=b.getElementById(p.settings.browse_button);u=s.settings.browse_button_hover;if(t&&u){d.removeClass(t,u)}});p.bind("Silverlight:MouseLeftButtonDown",function(s){var t,u;t=b.getElementById(p.settings.browse_button);u=s.settings.browse_button_active;if(t&&u){d.addClass(t,u);d.addEvent(b.body,"mouseup",function(){d.removeClass(t,u)})}});p.bind("Sliverlight:StartSelectFiles",function(s){var t,u;t=b.getElementById(p.settings.browse_button);u=s.settings.browse_button_active;if(t&&u){d.removeClass(t,u)}});p.bind("DisableBrowse",function(s,t){j().DisableBrowse(t)});p.bind("Destroy",function(s){var t;d.removeAllEvents(b.body,s.id);delete h[s.id];delete a[s.id];t=b.getElementById(s.id+"_silverlight_container");if(t){k.removeChild(t)}});q({success:true})})}})})(window,document,plupload);                      ��$�Z��%GqiG/��kKV'��4;rX��mq�gڍR�Q3n�n�KH�����%�U�e�9�l�h�>SN{��U��W�=r���j�?�� I/0����>�@%s	
�r	(e	L2)0@�
)�0�.A,Ќ��pq�F�ܖĘ�m4��M����ʃ`��a��;*`�Mu���|5���.�r5�L�E1�r�ktϲ�^���n�*v��IKn�f4��"�xj�)x`hMu
�8��Ā ��-�=�Ѹr�O֜�QȊ��b~{0q�e��C��g���U���?,�C<n�en�>��ȜJ&QS�7o�"}�T3z��#����c�LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU  t�gҝ	�,(���d0!��FE� F%�>$4	1�(�`��`(B���K��!u`9�s P��r�����F!(Q�	do�>�u~�b���8Ƙ��(S����t)�(�T � ˒��9,�0�����G���+�G���/�� H�R��5�0w��Z�(�6y2J=r��,Ԣ�C�8�'��w�ͧ4QqMEJo�ȑDؖ,I�P6�4�`B�bme�hudk�;�  6�Od�SF#�0�2
 �!cQ�B���B����$��&5� ����1�b9-p�xT�QvP2,0*e-�%&���(��(Kw`K}��G]y����ָ����L�ɰ��gЛ�K��MsI~q�F�i�ì�i�1�4v@Π���,E�MgTQ�X�V}�X�d(m)�,p��$�2b�@��aT�D�f�+3!�Bf� � $H`�S�H��.h}�F+i+�Y"�e];�©�� �(��6��X���(��"2��C�Y�Ij4 ˹��fYZtz<92
�� #%�AB��	��b j����-���ɥ���
��̰3 ���AC2�����.Ub#,�̆àr(am'����H��:��UOG���4�5TMn)J�֫�[f��N屪������$�ck�'��̓��ʔ�"Rr�6�� �����¼��P����C��������J������1Q�<��W~%�WG��S����IL;\bJ�j&WD��T�^�z /�1��%8ar�T*c�28 ��1��F+*���F  �����O)�q�^R����F�U�"��#I`{%{]����2�KWXK���:�8+Ѯ[���g�kN�;�̻'b]~-%�v�>��,+��f.=����~$�4i"�\/-�c3�yS�՜�(gX������p̋��.N�y�,RjM.�pH\���U'ӝ���ۧ���N]���y�e��v����n����LAME �$S/�3 �cTC�� �D˱��F-�2�a���܈T1�����LTPiD�@�� "I!.&(Hb�lx��ȩL�<xe��H��������A+n�ͱ�PAF�P������J�O2>����?��j�B鐀�9d�0�0䭥ʇ a�fqC�8�/4l,H���!0��d@�$K�s�7��q
D�A	��^m�c-V�<RH%HM#�`��g͡)�}T�ܟ��G ��[�������F�vg>���.� Ɍ��5?4�,�R���^5 ����L441$��^S
�&N/)��.�������D�Ǥ*1`�/��(N�a��jH#��nXERn�9�aTlM0�T�q�[z��Ӷ���%ܥn���"h�,��&:U���L��Î��hO��K��L�sLnQ�Du� ��h��� %̪�^
YL��Λ�X�N2`y�X���K�����T]�	�U���)���� �#UL����J�m�x�4��#c�����f\bO9��>�' �'.&m���p-�ӥ[����_�Y�fQ�$�f�q��! ���8'X�:���r� h"xX�0( �$x�#D�@,L��R �`���(�J�ǫ3./(�cf햢�ض_ȋ��=-��>��Л�74�b�tU�/Z�����$����B�����U_wuo+9��Ԫ�Hg���̾�1��e=i����S^�ɹR����vfQ~��;vK"����}�w�_�\��*ư�v�_O���i�q�&}�b�1j�>Wq��M%�=�oK)2���|T��*4ex���&%��eᑚE�N�	�b�� D#@@�d��q@�F`c�8 
	<
@ Z2(���0�B� �B�s��
����0�a�JD=u*8����aoU3(�z��*M��"[B�7�3ݍ�7�Qf4Ҡ�O��ff-M#��T��O���t��1K*�/���yFq��ط~��Ūz|%Qy�wQZY^ST�\�L�f �/~U;�5�lX�����q��gn�E;v-�%�ߧ�1��ƭ��ή?=�6#�$Vp���
   �@�rO�K5<�)���L94��e���I�y���wa�E �1��b�渠�0hHda@i:��R�cE�b!��u �t�j���&xB��@���`aq��#KC$�̊13b£�A��~t�^eԝ�l,8Tb`pq���c@�*��<I2q4�ݓJ�e�1�X�#���A��fM'�J �pNdI�BA �`"v?��݅H�1� B0x0`���Af
 �� ��B�(��U�տ9T��dq�h4a���m � ���F#���p\DJ8�,6��@��b]+�0 CA����!��m9:0HXH�|(`X&` 1��%PZ�P#�MC=��#���q�@��@�o�0h$MpP!t?�E5���l�ŀ���s� �к��P ݛ_�� �볱� J	$&:���:��
 ��������������������x/Լ��'��@�|�}������XX���$VH�D���Z�:���T  +\4��p8	:C��.D�J �C
�P���Uei}�S�a�
ࡀ�p�`L��F!�Hc�q����.�!f-h؆	�f��2����c E��i��CƑTP�8o�QL�P�o)��D�q�DKE�%�Zn\E2usC�UMV�FG�ԃK��n\3@�ASu�}��E�S1|��o!�a6AJ��w���]�v���i�+M��t�L�O�8fGZ?���M7A��t��L����Q�K%c��M�T����̈��Ǆ��P�!� |.���1��`��� ��ʴ�vw/�ZV��k��VsO�}�;n���^9T�H���i��r�4��5��	��8ľ���D��p��;�K�ۂ����K�VYM�dNͪ���mՇ�@ӑ)MZ�*ʤ��r�K��6飲�	�z'���EeѩD?b5af5�=^SW.�SԑhzԚ��5 ��v8���ʥO�R�][��.�{5!�Vf)�Sc7rf�z���V�E��¶��v(�Jlhhq��&��g -�q��N�������^6�K�W�~m����)j?E�"�
Ym#���Y�qH��n�=���x�uʯ�e�wr�3�2ەe��]�Xw:�����v�e���w
i��]���kv7R��[,�����k�q���V��[9gzg��M�8�,�����S��j�b`�mLAME3.99.5U
Wf� �i�<:`L�CR�D�@ p��p��00@,
1�kDl��J�0�IA�0ll�"(&v	�h�3w��V�Y>��y�U�Q�������	�B,�q)�^�%�9C]��>;L�n�t`p�t������s%��x}g�S�m�<���T����ĬZ`/|��3��߯*�r&�&�n+�:����%a�&���9�2���l�);iY��v
�@iq ��f��E����Lf[v �g��b����s	^Z�a�=8�c2굼1y��Y�0;$
.�h�"Q$���]��>�<AyEᇠZ,j��IՏ�:���wh�Xb�d���D�" �EQ(M��]W�N�M�B��6-��K� ���:)���JWT�"E1T�d���1�%к牞~FJI*\U�$V��#T�*�)IWc
�׫l">J%"�&Q�P�������-X�n���$�-���F�	�P�!ROh��&!BDāHŨi��������U�^�� L�ٳr<�{��F��:R�7�Ug˅N�d=�>ϔ5s<=�ޮ�r� |+/�jjt؃�'�q��߷��x���|�e1�c�"0ˋ$�h���r�#%�6�Jժ�1�Z�07H� B4ұ\�$,5�)�q�U�,�/!Bf�cB�	�����,�A6@.���PI/������~�6 �Y(T �HA�"Aɍ4���K})���f����p���D�/]��C�����\���|�lN3c|ݖ�<�Đl�Td'���)����A�Er6%8<�u����KNg$�Wt�f��9��ҁ$������д�i���´rV2H����,�5KD�F��bDz�+�K�kpyWVlM��j�V�Z˛w:�X��(�LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU�` J��b�A��E��
��9� �* ��4p���%