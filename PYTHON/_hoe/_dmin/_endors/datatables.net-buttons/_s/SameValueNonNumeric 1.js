//
// Tables
// --------------------------------------------------


table {
  max-width: 100%;
  background-color: @table-bg;
}
th {
  text-align: left;
}


// Baseline styles

.table {
  width: 100%;
  margin-bottom: @line-height-computed;
  // Cells
  > thead,
  > tbody,
  > tfoot {
    > tr {
      > th,
      > td {
        padding: @table-cell-padding;
        line-height: @line-height-base;
        vertical-align: top;
        border-top: 1px solid @table-border-color;
      }
    }
  }
  // Bottom align for column headings
  > thead > tr > th {
    vertical-align: bottom;
    border-bottom: 2px solid @table-border-color