rrentDateEl; var ne = null; var prev = (ev.keyCode == 37) || (ev.keyCode == 38); switch (ev.keyCode) { case 37:
(--date >= 0) && (ne = cal.ar_days[date]); break; case 38:
date -= 7; (date >= 0) && (ne = cal.ar_days[date]); break; case 39:
(++date < cal.ar_days.length) && (ne = cal.ar_days[date]); break; case 40:
date += 7; (date < cal.ar_days.length) && (ne = cal.ar_days[date]); break;}
if (!ne) { if (prev) { Calendar.cellClick(cal._nav_pm);} else { Calendar.cellClick(cal._nav_nm);}
date = (prev) ? cal.date.getMonthDays() : 1; el = cal.currentDateEl; ne = cal.ar_days[date - 1];}
Calendar.removeClass(el, "selected"); Calendar.addClass(ne, "selected"); cal.date.setDate(ne.caldate); cal.currentDateEl = ne;}
break; case 13:
if (act) { cal.callHandler(); cal.hide();}
break; default:
return false;}
Calendar.stopEvent(ev);}; Calendar.prototype._init = function (mondayFirst, date) { var today = new Date(); var year = date.getFullYear(); if (year < this.minYear) { year = this.minYear; date.setFullYear(year);} else if (year > this.maxYear) { year = this.maxYear; date.setFullYear(year);}
this.mondayFirst = mondayFirst; this.date = new Date(date); var month = date.getMonth(); var mday = date.getDate(); var no_days = date.getMonthDays(); date.setDate(1); var wday = date.getDay(); var MON = mondayFirst ? 1 : 0; var SAT = mondayFirst ? 5 : 6; var SUN = mondayFirst ? 6 : 0; if (mondayFirst) { wday = (wday > 0) ? (wday - 1) : 6;}
var iday = 1; var row = this.tbody.firstChild; var MN = Calendar._MN3[month]; var hasToday = ((today.getFullYear() == year) && (today.getMonth() == month)); var todayDate = today.getDate(); var week_number = date.getWeekNumber(); var ar_days = new Array(); for (var i = 0; i < 6; ++i) { if (iday > no_days) { row.className = "emptyrow"; row = row.nextSibling; continue;}
var cell = row.firstChild; if (this.weekNumbers) { cell.className = "day wn"; cell.firstChild.data = week_number; cell = cell.nextSibling;} ++week_number; row.className = "daysrow"; for (var j = 0; j < 7; ++j) { cell.className = "day"; if ((!i && j < wday) || iday > no_days) { cell.innerHTML = "&nbsp;"; cell.disabled = true; cell = cell.nextSibling; continue;}
cell.disabled = false; cell.firstChild.data = iday; if (typeof this.checkDisabled == "function") { date.setDate(iday); if (this.checkDisabled(date)) { cell.className += " disabled"; cell.disabled = true;}
}
if (!cell.disabled) { ar_days[ar_days.length] = cell; cell.caldate = iday; cell.ttip = "_"; if (iday == mday) { cell.className += " selected"; this.currentDateEl = cell;}
if (hasToday && (iday == todayDate)) { cell.className += " today"; cell.ttip += Calendar._TT["PART_TODAY"];}
if (wday == SAT || wday == SUN) { cell.className += " weekend";}
} +