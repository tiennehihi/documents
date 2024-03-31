/* The main calendar widget.  DIV containing a table. */

.calendar {
  position: relative;
  display: none;
  border: 1px solid;
  border-color: #fff #000 #000 #fff;
  font-size: 11px;
  cursor: default;
  background: Window;
  color: WindowText;
  font-family: tahoma,verdana,sans-serif;
}

.calendar table {
  border: 1px solid;
  border-color: #fff #000 #000 #fff;
  font-size: 11px;
  cursor: default;
  background: Window;
  color: WindowText;
  font-family: tahoma,verdana,sans-serif;
}

/* Header part -- contains navigation buttons and day names. */

.calendar .button { /* "<<", "<", ">", ">>" buttons have this class */
  text-align: center;
  padding: 1px;
  border: 1px solid;
  border-color: ButtonHighlight ButtonShadow ButtonShadow ButtonHighlight;
  background: ButtonFace;
}

.calendar .nav {
  background: ButtonFace url(menuarrow.gif) no-repeat 100% 100%;
}

.calendar thead .title { /* This holds the current "month, year" */
  font-weight: bold;
  padding: 1px;
  border: 1px solid #000;
  background: ActiveCaption;
  color: CaptionText;
  text-align: center;
}

.calendar thead .headrow { /* Row <TR> containing navigation buttons */
}

.calendar thead .daynames { /* Row <TR> containing the day names */
}

.calendar thead .name { /* Cells <TD> containing the day names */
  border-bottom: 1px solid ButtonShadow;
  padding: 2px;
  text-align: center;
  background: ButtonFace;
  color: ButtonText;
}

.calendar thead .weekend { /* How a weekend day name shows in header */
  color: #f00;
}

.calendar thead .hilite { /* How do the buttons in header appear when hover */
  border: 2px solid;
  padding: 0px;
  border-color: ButtonHighlight ButtonShadow ButtonShadow ButtonHighlight;
}

.calendar thead .active { /* Active (pressed) buttons in header */
  border-width: 1px;
  padding: 2px 0px 0px 2px;
  border-color: ButtonShadow ButtonHighlight ButtonHighlight ButtonShadow;
}

/* The body part -- contains all the days in month. */

.calendar tbody .day { /* Cells <TD> containing month days dates */
  width: 2em;
  text-align: right;
  padding: 2px 4px 2px 2px;
}
.calendar tbody .day.othermonth {
  font-size: 80%;
  color: #aaa;
}
.calendar tbody .day.othermonth.oweekend {
  color: #faa;
}

.calendar table .wn {
  padding: 2px 3px 2px 2px;
  border-right: 1px solid ButtonShadow;
  background: ButtonFace;
  color: ButtonText;
}

.calendar tbody .rowhilite td {
  background: Highlight;
  color: HighlightText;
}

.calendar tbody td.hilite { /* Hovered cells <TD> */
  padding: 1px 3px 1px 1px;
  border-top: 1px solid #fff;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  border-left: 1px solid #fff;
}

.calendar tbody td.active { /* Active (pressed) cells <TD> */
  padding: 2px 2px 0px 2px;
  border: 1px solid;
  border-color: ButtonShadow ButtonHighlight ButtonHighlight ButtonShadow;
}

.calendar tbody td.selected { /* Cell showing selected date */
  font-weight: bold;
  border: 1px solid;
  border-color: ButtonShadow ButtonHighlight ButtonHighlight ButtonShadow;
  padding: 2px 2px 0px 2px;
  background: ButtonFace;
  color: ButtonText;
}

.calendar tbody td.weekend { /* Cells showing weekend days */
  color: #f00;
}

.calendar tbody td.today { /* Cell showing today date */
  font-weight: bold;
  color: #00f;
}

.calendar tbody td.disabled { color: GrayText; }

.calendar tbody .emptycell { /* Empty cells (the best is to hide them) */
  visibility: hidden;
}

.calendar tbody .emptyrow { /* Empty row (some months need less than 6 rows) */
  display: none;
}

/* The footer part -- status bar and "Close" button */

.calendar tfoot .footrow { /* The <TR> in footer (only one right now) */
}

.calendar tfoot .ttip { /* Tooltip (status bar) cell <TD> */
  background: ButtonFace;
  padding: 1px;
  border: 1px solid;
  border-color: But