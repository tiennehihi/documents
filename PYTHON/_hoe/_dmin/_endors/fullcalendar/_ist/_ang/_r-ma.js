  return str.substring(offset, secondDashIndex + 1);
                }
            }
        }

        return '';
    }

    function getKeywordDescriptor(keyword) {
        if (hasOwnProperty.call(keywords, keyword)) {
            return keywords[keyword];
        }

        var name = keyword.toLowerCase();

        if (hasOwnProperty.call(keywords, name)) {
            return keywords[keyword] = keywords[name];
        }

        var custom = isCustomProperty(name, 0);
        var vendor = !custom ? getVendorPrefix(name, 0) : '';

        return keywords[keyword] = Object.freeze({
            basename: name.substr(vendor.length),
            name: name,
            vendor: vendor,
            prefix: vendor,
            custom: custom
        });
    }

    function getPropertyDescriptor(property) {
        if (hasOwnProperty.call(properties, property)) {
            return properties[property];
        }

        var name = property;
        var hack = property[0];

        if (hack === '/') {
            hack = property[1] === '/' ? '//' : '/';
        } else if (hack !== '_' &&
                   hack !== '*' &&
                   hack !== '$' &&
                   hack !== '#' &&
                   hack !== '+' &&
                   hack !== '&') {
            hack = '';
        }

        var custom = isCustomProperty(name, hack.length);

        // re-use result when possible (the same as for lower case)
        if (!custom) {
            name = name.toLowerCase();
            if (hasOwnProperty.call(properties, name)) {
                return properties[property] = properties[name];
            }
        }

        var vendor = !custom ? getVendorPrefix(name, hack.length) : '';
        var prefix = name.substr(0, hack.length + vendor.length);

        return properties[property] = Object.freeze({
            basename: name.substr(prefix.length),
            name: name.substr(hack.length),
            hack: hack,
            vendor: vendor,
            prefix: prefix,
            custom: custom
        });
    }

    var names = {
        keyword: getKeywordDescriptor,
        property: getPropertyDescriptor,
        isCustomProperty: isCustomProperty,
        vendorPrefix: getVendorPrefix
    };

    var MIN_SIZE = 16 * 1024;
    var SafeUint32Array = typeof Uint32Array !== 'undefined' ? Uint32Array : Array; // fallback on Array when TypedArray 