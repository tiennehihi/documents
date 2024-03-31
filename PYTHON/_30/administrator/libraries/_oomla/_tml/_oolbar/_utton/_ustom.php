# Installation
> `npm install --save @types/eslint-scope`

# Summary
This package contains type definitions for eslint-scope (https://github.com/eslint/eslint-scope).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/eslint-scope.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/eslint-scope/index.d.ts)
````ts
import * as eslint from "eslint";
import * as estree from "estree";

export const version: string;

export class ScopeManager implements eslint.Scope.ScopeManager {
    scopes: Scope[];
    globalScope: Scope;
    acquire(node: {}, inner?: boolean): Scope | null;
    getDeclaredVariables(node: {}): Variable[];
}

export class Scope implements eslint.Scope.Scope {
    type:
        | "block"
        | "catch"
        | "class"
        | "for"
        | "function"
        | "function-expression-name"
        | "global"
        | "module"
        | "switch"
        | "with"
        | "TDZ";
    isStrict: boolean;
    upper: Scope | null;
    childScopes: Scope[];
    variableScope: Scope;
    block: estree.Node;
    variables: Variable[];
    set: Map<string, Variable>;
    references: Refe