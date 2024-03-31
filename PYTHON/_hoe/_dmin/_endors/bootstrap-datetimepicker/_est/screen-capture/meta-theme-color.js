---
title: "generate(options)"
layout: default
section: api
---

__Description__ : Generates the complete zip file.

__Arguments__

name                | type    | default | description
--------------------|---------|---------|------------
options             | object  |         | the options to generate the zip file :
options.base64      | boolean | false   | **deprecated**, use `type` instead. If `type` is not used, set to `false` to get the result as a raw byte string, `true` to encode it as base64.
options.compression | string  | `STORE` (no compression) | the default file compression method to use. Available methods are `STORE` and `DEFLATE`. You can also provide your own compression method.
options.compressionOptions | object | `null` | the options to use when compressing the file, see below.
options.type        | string  | `base64` | The type of zip to return, see below for the other types.
options.comment     | string  |          | The comment to use for the zip file.
options.mimeType    | string  | `application/zip` | mime-type for the generated file. Useful when you need to generate a file with a different extension, ie: ".ods".
options.platform    | string  | `DOS`    | The platform to use when generating the zip file.
options.encodeFileName | function  | encode with UTF-8 | the function to encode the file name / comment.

Possible values for `type` :

* `base64` (default) : the result will be a string, the binary in a base64 form.
* `string` : the result will be a string in "binary" form, using 1 byte per char (2 bytes).
* `uint8array` : the result will be a Uint8Array containing the zip.