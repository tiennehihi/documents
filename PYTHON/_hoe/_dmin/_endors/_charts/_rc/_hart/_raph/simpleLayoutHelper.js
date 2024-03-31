at(' ', this._currentIndent) + actionHeader + c.EOL;
    indentFirst = helpPosition;
  }

  // collect the pieces of the action help
  parts = [ actionHeader ];

  // if there was help for the action, add lines of help text
  if (action.help) {
    helpText = this._expandHelp(action);
    helpLines = this._splitLines(helpText, helpWidth);
    parts.push($$.repeat(' ', indentFirst) + helpLines[0] + c.EOL);
    helpLines.slice(1).forEach(function (line) {
      parts.push($$.repeat(' ', helpPosition) + 