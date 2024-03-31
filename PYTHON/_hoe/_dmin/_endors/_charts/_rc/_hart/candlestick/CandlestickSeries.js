 pattern\n  // - attach $ at the end of the pattern when creating the actual RegExp\n  //\n  // Ah, but wait, no, that all only applies to the root when the first pattern\n  // is not an extglob. If the first pattern IS an extglob, then we need all\n  // that dot prevention biz to live in the extglob portions, because eg\n  // +(*|.x*) can match .xy but not .yx.\n  //\n  // So, return the two flavors if it's #root and the first child is not an\n  // AST, otherwise leave it to the child AST to handle it, and there,\n  // use the (?:^|/) style of start binding.\n  //\n  // Even simplified further:\n  // - Since the start for a join is eg /(?!\\.) and the start for a part\n  // is ^(?!\\.), we can just prepend (?!\\.) to the pattern (either root\n  // or start or whatever) and prepend ^ or / at the Regexp construction.\n  toRegExpSource(\n    allowDot?: boolean\n  ): [re: string, body: string, hasMagic: boolean, uflag: boolean] {\n    const dot = allowDot ?? !!this.#options.dot\n    if (this.#root === this) this.#fillNegs()\n    if (!this.type) {\n      const noEmpty = this.isStart() && this.isEnd()\n      const src = this.#parts\n        .map(p => {\n          const [re, _, hasMagic, uflag] =\n            typeof p === 'string'\n              ? AST.#parseGlob(p, this.#hasMagic, noEmpty)\n              : p.toRegExpSource(allowDot)\n          this.#hasMagic = this.#hasMagic || hasMagic\n          this.#uflag = this.#uflag || uflag\n          return re\n        })\n        .join('')\n\n      let start = ''\n      if (this.isStart()) {\n        if (typeof this.#parts[0] === 'string') {\n          // this is the string that will match the start of the pattern,\n          // so we need to protect against dots and such.\n\n          // '.' and '..' cannot match unless the pattern is that exactly,\n          // even if it starts with . or dot:true is set.\n          const dotTravAllowed =\n            this.#parts.length === 1 && justDots.has(this.#parts[0])\n          if (!dotTravAllowed) {\n            const aps = addPatternStart\n            // check if we have a possibility of matching . or ..,\n            // and prevent that.\n            const needNoTrav =\n              // dots are allowed, and the pattern starts with [ or .\n              (dot && aps.has(src.charAt(0))) ||\n              // the pattern starts with \\., and then [ or .\n              (src.startsWith('\\\\.') && aps.has(src.charAt(2))) ||\n              // the pattern starts with \\.\\., and then [ or .\n              (src.startsWith('\\\\.\\\\.') && aps.has(src.charAt(4)))\n            // no need to prev