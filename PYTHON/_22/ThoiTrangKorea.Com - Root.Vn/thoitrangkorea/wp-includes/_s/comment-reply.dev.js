export abstract class _CodeOrName {
  abstract readonly str: string
  abstract readonly names: UsedNames
  abstract toString(): string
  abstract emptyStr(): boolean
}

export const IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i

export class Name extends _CodeOrName {
  readonly str: string
  constructor(s: string) {
    super()
    if (!IDENTIFIER.test(s)) throw new Error("CodeGen: name must be a valid identifier")
    this.str = s
  }

  toString(): string {
    return this.str
  }

  emptyStr(): boolean {
    return false
  }

  get names(): UsedNames {
    return {[this.str]: 1}
  }
}

export class _Code extends _CodeOrName {
  readonly _items: readonly CodeItem[]
  private _str?: string
  private _names?: UsedNames

  constructor(code: string | readonly CodeItem[]) {
    super()
    this._items = typeof code === "string" ? [code] : code
  }

  toString(): string {
    return this.str
  }

  emptyStr(): boolean {
    if (this._items.length > 1) return false
    const item = this._items[0]
    return item === "" || item === '""'
  }

  get str(): string {
    return (this._str ??= this._items.reduce((s: string, c: CodeItem) => `${s}${c}`, ""))
  }

  get names(): UsedNames {
    return (this._names ??= this._