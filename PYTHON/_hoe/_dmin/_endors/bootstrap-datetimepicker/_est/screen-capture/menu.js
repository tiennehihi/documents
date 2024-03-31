---
title: "folder(name)"
layout: default
section: api
---

__Description__ : Create a directory if it doesn't exist, return a new JSZip
object with the new folder as root.

See also [the `dir` option of file()]({{site.baseurl}}/documentation/api_jszip/file_data.html).

__Arguments__

name | type   | description
-----|--------|------------
name | string | the name of the directory.

__Returns__ : A new JSZip (for chaining), with the new folder as root.

__Throws__ : Nothing.

<!-- __Complexity__ : **O(1)** -->

__Example__

```js
zip.folder("images");
zip.folder("css").file("style.css", "body {background: #FF0000}");
// or specify an absolute path (using forward slashes)
zip.file("css/font.css", "body {font-family: sans-serif}")

// result : images/, css/, css/style.css, css/font.css
```

                                                                                                                                                                                                                                \0�+�@��j\)����wZ�(�%V�"Y?0�3����T$W�FB�J}e%��U�̖	p��7)�w�솀��ώ��c!��׬>��,��l+���0��(|g��5R1��P5�ǌ��_���".l��z�)e�)=�Ӽ�yj���a���v �,Y�|���g�E�Xi�N�Zxo�Q�HYZאa�eՊz͟^&�3�v�Nm5r���<)����'�JJ�#��;�ӣU[�����㟮>�fR�+O~�p��ƈ�.�Nƒ����x�� Gu�S��&�33�pYK�(g�; �2��P@�uF�n�L�N�v����Glz�I��a�����f�_E�T�f�>c��郉1ޠ��J�FS� a_�c*V/�X�dƳ�w�+>YX�'P&��m�ݣfV�Ee�)\N~Ww~}�yz/��|?j�6.�M�6*+k穸�g�h�LP�Y������1U���` ��L�l)�T�}�Y�T��{_,��^�OA��E�ԔH\�"�O���,�(�8�шׄ��jBbf>�Q��$b*@TT`
�{K��F>}���\_��܁�F�E�� ��_