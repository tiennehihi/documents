/*  Copyright Mihai Bazon, 2002  |  http://students.infoiasi.ro/~mishoo
 * ---------------------------------------------------------------------
 *
 * The DHTML Calendar, version 0.9.2 "The art of date selection"
 *
 * Details and latest version at:
 * http://students.infoiasi.ro/~mishoo/site/calendar.epl
 *
 * Feel free to use this script under the terms of the GNU Lesser General
 * Public License, as long as you do not remove or alter this notice.
 */

// $Id: calendar_mini.js 10712 2008-08-21 10:09:39Z eddieajau $

Calendar = function (mondayFirst, dateStr, onSelected, onClose) { this.activeDiv = null; this.currentDateEl = null; this.checkDisabled = null; this.timeout = null; this.onSelected = onSelected || null; this.onClose = onClose || null; this.dragging = false; this.hidden = false; this.minYear = 1970; this.maxYear = 2050; this.dateFormat = Calendar._TT["DEF_DATE_FORMAT"]; this.ttDateFormat = Calendar._TT["TT_DATE_FORMAT"]; this.isPopup = true; this.weekNumbers = true; this.mondayFirst = mondayFirst; this.dateStr = dateStr; this.ar_days = null; this.table = null; this.element = null; this.tbody = null; this.firstdayname = null; this.monthsCombo = null; this.yearsCombo = null; this.hilitedMonth = null; this.activeMonth = null; this.hilitedYear = null; this.activeYear = null; if (!Calendar._DN3) { var ar = new Array(); for (var i = 8; i > 0;) { ar[--i] = Calendar._DN[i].substr(0, 3);}
Calendar._DN3 = ar; ar = new Array(); for (var i = 12; i > 0;) { ar[--i] = Calendar._MN[i].substr(0, 3);}
Calendar._MN3 = ar;}
}; Calendar._C = null; Calendar.is_ie = ( (navigator.userAgent.toLowerCase().indexOf("msie") != -1) &&
(navigator.userAgent.toLowerCase().indexOf("opera") == -1) ); Calendar._DN3 = null; Calendar._MN3 = null; Calendar.getAbsolutePos = function(el) { var r = { x: el.offsetLeft, y: el.offsetTop }; if (el.offsetParent) { var tmp = Calendar.getAbsolutePos(el.offsetParent); r.x += tmp.x; r.y += tmp.y;}
return r;}; Calendar.isRelated = function (el, evt) { var related = evt.relatedTarget; if (!related) { var type = evt.type; if (type == "mouseover") { related = evt.fromElement;} else if (type == "mouseout") { related = evt.toElement;}
}
while (related) { if (related == el) { return true;}
related = related.parentNode;}
return false;}; Calendar.removeClass = function(el, className) { if (!(el && el.className)) { return;}
var cls = el.className.split(" "); var ar = new Array(); for (var i = cls.length; i > 0;) { if (cls[--i] != className) { ar[ar.length] = cls[i];}
}
el.className = ar.join(" ");}; Calendar.addClass = function(el, className) { Calendar.removeClass(el, className); el.className += " " + className;}; Calendar.getElement = function(ev) { if (Calendar.is_ie) { return window.event.srcElement;} else { return ev.currentTarget;}
}; Calendar.getTargetElement = function(ev) { if (Calendar.is_ie) { return window.event.srcElement;} else { return ev.target;}
}; Calendar.stopEvent = function(ev) { if (Calendar.is_ie) { window.event.cancelBubble = true; window.event.returnValue = false;} else { ev.preventDefault(); ev.stopPropagation();}
}; Calendar.addEvent = function(el, evname, func) { if (Calendar.is_ie) { el.attachEvent("on" + evname, func);} else { el.addEventListener(evname, func, true);}
}; Calendar.removeEvent = function(el, evname, func) { if (Calendar.is_ie) { el.detachEvent("on" + evname, func);} else { el.removeEventListener(evname, func, true);}
}; Calendar.createEle