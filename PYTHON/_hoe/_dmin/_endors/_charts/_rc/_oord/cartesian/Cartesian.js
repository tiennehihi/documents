line.split(';', 1)[0], 16);
          _chunksFinished = (_chunkSize === 0);
        }
      } else {
        // chunks finished, read next trailer
        line = _readCrlf(b);
        while(line !== null) {
          if(line.length > 0) {
            // parse trailer
            _parseHeader(line);
            // read next trailer
            line = _readCrlf(b);
          } else {
            // body received
            response.bodyReceived = true;
            line = null;
          }
        }
      }
    }

    return response.bodyReceived;
  };

  /**
   * Reads an http response body from a buffer of bytes.
   *
   * @param b the byte buffer to read from.
   *
   * @return true if the whole body was read, false if not.
   */
  response.readBody = function(b) {
    var contentLength = response.getField('Content-Length');
    var transferEncoding = response.getField('Transfer-Encoding');
    if(contentLength !== null) {
      contentLength = parseInt(contentLength);
    }

    // read specified length
    if(contentLength !== null && contentLength >= 0) {
      response.body = response.body || '';
      response.body += b.getBytes(contentLength);
      response.bodyReceived = (response.body.length === contentLength);
    } else if(transferEncoding !== null) {
      // read chunked encoding
      if(transferEncoding.indexOf('chunked') != -1) {
        response.body = response.body || '';
        _readChunkedBody(b);
      } else {
        var error = new Error('Unknown Transfer-Encoding.');
        error.details = {'transferEncoding': transferEncoding};
        throw error;
      }
    } else if((contentLength !== null && contentLength < 0) ||
      (contentLength === null &&
      response.getField('Content-Type') !== null)) {
      // read all data in the buffer
      response.body = response.body || '';
      response.body += b.getBytes();
      response.readBodyUntilClose = true;
    } else {
      // no body
      response.body = null;
      response.bodyReceived = true;
    }

    if(response.bodyReceived) {
      response.time = +new Date() - response.time;
    }

    if(response.flashApi !== null &&
      response.bodyReceived && response.body !== null &&
      response.getField('Content-Encoding') === 'deflate') {
      // inflate using flash api
      response.body = forge.util.inflate(
        response.flashApi, response.body);
    }

    return response.bodyReceived;
  };

   /**
    * Parses an array of cookies from the 'Set-Cookie' field, if present.
    *
    * @return the array of cookies.
    */
   response.getCookies = function() {
     var rval = [];

     // get Set-Cookie field
     if('Set-Cookie' in response.fields) {
       var field = resp