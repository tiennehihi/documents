 before root.");
            }
            else if (this.name !== "version" &&
                this.xmlDeclExpects.includes("version")) {
                this.fail("XML declaration must contain a version.");
            }
            // eslint-disable-next-line no-unused-expressions
            (_a = this.xmldeclHandler) === null || _a === void 0 ? void 0 : _a.call(this, this.xmlDecl);
            this.name = "";
            this.piTarget = this.text = "";
            this.state = S_TEXT;
        }
        else {
            // We got here because the previous character was a ?, but the question
            // mark character is not valid inside any of the XML declaration
            // name/value pairs.
            this.fail("The character ? is disallowed anywhere in XML declarations.");
        }
        this.xmlDeclPossible = false;
    }
    sOpenTag() {
        var _a;
        const c = this.captureNameChars();
        if (c === EOC) {
            return;
        }
        const tag = this.tag = {
            name: this.name,
            attributes: Object.create(null),
        };
        this.name = "";
        if (this.xmlnsOpt) {
            this.topNS = tag.ns = Object.create(null);
        }
        // eslint-disable-next-line no-unused-expressions
        (_a = this.openTagStartHandler) === null || _a === void 0 ? void 0 : _a.call(this, tag);
        this.sawRoot = true;
        if (!this.fragmentOpt && this.closedRoot) {
            this.fail("documents may contain only one root.");
        }
        switch (c) {
            case GREATER:
                this.openTag();
                break;
            case FORWARD_SLASH:
                this.state = S_OPEN_TAG_SLASH;
                break;
            default:
                if (!isS(c)) {
                    this.fail("disallowed character in tag name.");
                }
                this.state = S_ATTRIB;
        }
    }
    sOpenTagSlash() {
        if (this.getCode() === GREATER) {
            this.openSelfClosingTag();
        }
        else {
            this.fail("forward-slash in opening tag not followed by >.");
            this.state = S_ATTRIB;
        }
    }
    sAttrib() {
        const c = this.skipSpaces();
        if (c === EOC) {
            return;
        }
        if (isNameStartChar(c)) {
            this.unget();
            this.state = S_ATTRIB_NAME;
        }
        else if (c === GREATER) {
            this.openTag();
        }
        else if (c === FORWARD_SLASH) {
            this.state = S_OPEN_TAG_SLASH;
        }
        else {
            this.fail("disallowed character in attribute name.");
        }
    }
    sAttribName() {
        const c = this.captureNameChars();
        if (c === EQUAL) {
            this.state = S_ATTRIB_VALUE;
        }
        else if (isS(c)) {
            this.state = S_ATTRIB_NAME_SAW_WHITE;
        }
        else if (c === GREATER) {
            this.fail("attribute without value.");
            this.pushAttrib(this.name, this.name);
            this.name = this.text = "";
            this.openTag();
        }
        else if (c !== EOC) {
            this.fail("disallowed character in attribute name.");
        }
    }
    sAttribNameSawWhite() {
        const c = this.skipSpaces();
        switch (c) {
            case EOC:
                return;
            case EQUAL:
                this.state = S_ATTRIB_VALUE;
                break;
            default:
                this.fail("attribute without value.");
                // Should we do this???
                // this.tag.attributes[this.name] = "";
                this.text = "";
                this.name = "";
                if (c === GREATER) {
                    this.openTag();
                }
                else if (isNameStartChar(c)) {
                    th