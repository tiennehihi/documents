tput.code);
          }
          if (output.extractedComments && output.extractedComments.length > 0) {
            const commentsFilename = /** @type {ExtractCommentsObject} */
            this.options.extractComments.filename || "[file].LICENSE.txt[query]";
            let query = "";
            let filename = name;
            const querySplit = filename.indexOf("?");
            if (querySplit >= 0) {
              query = filename.slice(querySplit);
              filename = filename.slice(0, querySplit);
            }
            const lastSlashIndex = filename.lastIndexOf("/");
            const basename = lastSlashIndex === -1 ? filename : filename.slice(lastSlashIndex + 1);
            const data = {
              filename,
              basename,
              query
            };
            output.commentsFilename = compilation.getPath(commentsFilename, data);
            let banner;

            // Add a banner to the original file
            if ( /** @type {ExtractCommentsObject} */
            this.options.extractComments.banner !== false) {
              banner = /** @type {ExtractCommentsObject} */
              this.options.extractComments.banner || `For license information please see ${path.relative(path.dirname(name), output.commentsFilename).replace(/\\/g, "/")}`;
              if (typeof banner === "function") {
                banner = banner(output.commentsFilename);
              }
              if (banner) {
                output.source = new ConcatSource(shebang ? `${shebang}\n` : "", `/*! ${banner} */\n`, output.source);
              }
            }
            const extractedCommentsString = output.extractedComments.sort().join("\n\n");
            output.extractedCommentsSource = new RawSource(`${extractedCommentsString}\n`);
          }
          await cacheItem.storePromise({
            source: output.source,
            errors: output.errors,
            warnings: output.warnings,
            commentsFilename: output.commentsFilename,
            extractedCommentsSource: output.extractedCommentsSource
          });
        }
        if (output.warnings && output.warnings.length > 0) {
          for (const warning of output.warnings) {
            compilation.warnings.push( /** @type {WebpackError} */warning);
          }
        }
        if (o