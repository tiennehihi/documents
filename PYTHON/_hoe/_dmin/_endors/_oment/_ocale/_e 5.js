 void h++;case me.Eof:return;case me.WhiteSpace:return 41===n(h=ye(e,h))||h>=e.length?void(h<e.length&&h++):(h=we(e,h),void(f=le.BadUrl));case 34:case 39:case 40:case me.NonPrintable:return h=we(e,h),void(f=le.BadUrl);case 92:if(he(t,n(h+1))){h=ke(e,h)-1;break}return h=we(e,h),void(f=le.BadUrl)}}}():40===n(h)?(f=le.Function,void h++):void(f=le.Ident)}function a(t){for(t||(t=n(h++)),f=le.String;h<e.length;h++){var r=e.charCodeAt(h);switch(me(r)){case t:return void h++;case me.Eof:return;case me.WhiteSpace:if(ce(r))return h+=be(e,h,r),void(f=le.BadString);break;case 92:if(h===e.length-1)break;var i=n(h+1);ce(i)?h+=be(e,h+1,i):he(r,i)&&(h=ke(e,h)-1)}}}t||(t=new H);for(var o=(e=String(e||"")).length,s=se(t.offsetAndType,o+1),l=se(t.balance,o+1),c=0,u=ge(n(0)),h=u,p=0,d=0,m=0;h<o;){var g=e.charCodeAt(h),f=0;switch(l[c]=o,me(g)){case me.WhiteSpace:f=le.WhiteSpace,h=ye(e,h+1);break;case 34:a();break;case 35:ue(n(h+1))||he(n(h+1),n(h+2))?(f=le.Hash,h=ve(e,h+1)):(f=le.Delim,h++);break;case 39:a();break;case 40:f=le.LeftParenthesis,h++;break;case 41:f=le.RightParenthesis,h++;break;case 43:pe(g,n(h+1),n(h+2))?r():(f=le.Delim,h++);break;case 44:f=le.Comma,h++;break;case 45:pe(g,n(h+1),n(h+2))?r():45===n(h+1)&&62===n(h+2)?(f=le.CDC,h+=3):de(g,n(h+1),n(h+2))?i():(f=le.Delim,h++);break;case 46:pe(g,n(h+1),n(h+2))?r():(f=le.Delim,h++);break;case 47:42===n(h+1)?(f=le.Comment,1===(h=e.indexOf("*/",h+2)+2)&&(h=e.length)):(f=le.Delim,h++);break;case 58:f=le.Colon,h++;break;case 59:f=le.Semicolon,h++;break;case 60:33===n(h+1)&&45===n(h+2)&&45===n(h+3)?(f=le.CDO,h+=4):(f=le.Delim,h++);break;case 64:de(n(h+1),n(h+2),n(h+3))?(f=le.AtKeyword,h=ve(e,h+1)):(f=le.Delim,h++);break;case 91:f=le.LeftSquareBracket,h++;break;case 92:he(g,n(h+1))?i():(f=le.Delim,h++);break;case 93:f=le.RightSquareBracket,h++;break;case 123:f=le.LeftCurlyBracket,h++;break;case 125:f=le.RightCurlyBracket,h++;break;case me.Digit:r();break;case me.NameStart:i();break;case me.Eof:break;default:f=le.Delim,h++}switch(f){case p:for(p=(d=l[m=16777215&d])>>24,l[c]=m,l[m++]=c;m<c;m++)l[m]===o&&(l[m]=c);break;case le.LeftParenthesis:case le.Function:l[c]=d,d=(p=le.RightParenthesis)<<24|c;break;case le.LeftSquareBracket:l[c]=d,d=(p=le.RightSquareBracket)<<24|c;break;case le.LeftCurlyBr