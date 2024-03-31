?: boolean): string;
    /**
     * Contains full error text in the GNU error format.
     */
    message: string;
    /**
     * Contains only the error description.
     */
    reason: string;
    /**
     * Contains the PostCSS plugin name if the error didn't come from the
     * CSS parser.
     */
    plugin?: string;
    input?: InputOrigin;
  }
  interface InputOrigin {
    /**
     * If parser's from option is set, contains the absolute path to the
     * broken file. PostCSS will use the input source map to detect the
     * original error location. If you wrote a Sass file, then compiled it
     * to CSS and parsed it with PostCSS, PostCSS will show the original
     * position in the Sass file. If you need the position in the PostCSS
     * input (e.g., to debug the previous compiler), use error.input.file.
     */
    file?: string;
    /**
     * Contains the source line of the error. PostCSS will use the input
     * source map to detect the original error loca