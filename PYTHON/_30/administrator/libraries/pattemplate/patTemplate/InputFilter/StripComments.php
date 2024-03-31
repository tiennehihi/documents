# relateurl [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][david-image]][david-url]

> Minify URLs by converting them from absolute to relative.

If you were to use this library on a website like `http://example.com/dir1/dir1-1/`, you would get results such as:

| Before                                      | After                                |
| :------------------------------------------ | :----------------------------------- |
| `http://example.com/dir1/dir1-2/index.html` | `../dir1-2/`                         |
| `http://example.com/dir2/dir2-1/`           | `/dir2/dir2-1/`                      |
| `http://example.com/dir1/dir1-1/`           | ` `                                  |
| `https://example.com/dir1/dir1-1/`          | `https://example.com/dir1/dir1-1/`   |
| `http://google.com:80/dir/`                 | `//google.com/dir/`                  |
| `../../../../../../../../#anchor`           | `/#anchor`                           |

**All string parsing.** *No* directory browsing. It is thor