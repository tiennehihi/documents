<div align="center">
  <a href="https://eslint.org/">
    <img width="150" height="150" src="https://eslint.org/assets/img/logo.svg">
  </a>
  <a href="https://facebook.github.io/jest/">
    <img width="150" height="150" vspace="" hspace="25" src="https://jestjs.io/img/jest.png">
  </a>
  <h1>eslint-plugin-jest</h1>
  <p>ESLint plugin for Jest</p>
</div>

[![Actions Status](https://github.com/jest-community/eslint-plugin-jest/actions/workflows/nodejs.yml/badge.svg?branch=main)](https://github.com/jest-community/eslint-plugin-jest/actions)

## Installation

```bash
yarn add --dev eslint eslint-plugin-jest
```

**Note:** If you installed ESLint globally then you must also install
`eslint-plugin-jest` globally.

## Usage

Add `jest` to the plugins section of your `.eslintrc` configuration file. You
can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["jest"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  }
}
```

You can also tell ESLint about the environment variables provided by Jest by
doing:

```json
{
  "env": {
    "jest/globals": true
  }
}
```

This is included in all configs shared by this plugin, so can be omitted if
extending them.

### Jest `version` setting

The behaviour of some rules (specifically [`no-deprecated-functions`][]) change
depending on the version of Jest being used.

By default, this plugin will attempt to determine to locate Jest using
`require.resolve`, meaning it will start looking in the closest `node_modules`
folder to the file being linted and work its way up.

Since we cache the automatically determined version, if you're linting
sub-folders that have different versions of Jest, you may find that the wrong
version of Jest is considered when linting. You can work around this by
providing the Jest version explicitly in nested ESLint configs:

```json
{
  "settings": {
    "jest": {
      "version": 27
    }
  }
}
```

To avoid hard-coding a number, you can also fetch it from the installed version
of Jest if you use a JavaScript config file such as `.eslintrc.js`:

```js
module.exports = {
  settings: {
    jest: {
      version: require('jest/package.json').version,
    },
  },
};
```

## Shareable configurations

### Recommended

This plugin exports a recommended configuration that enforces good testing
practices.

To enable this configuration use the `extends` property in your `.eslintrc`
config file:

```json
{
  "extends": ["plugin:jest/recommended"]
}
```

### Style

This plugin also exports a configuration named `style`, which adds some
stylistic rules, such as `prefer-to-be-null`, which enforces usage of `toBeNull`
over `toBe(null)`.

To enable this configuration use the `extends` property in your `.eslintrc`
config file:

```json
{
  "extends": ["plugin:jest/style"]
}
```

See
[ESLint documentation](https://eslint.org/docs/user-guide/configuring/configuration-files#extending-configuration-files)
for more information about extending configuration files.

### All

If you want to enable all rules instead of only some you can do so by adding the
`all` configuration to your `.eslintrc` config file:

```json
{
  "extends": ["plugin:jest/all"]
}
```

While the `recommended` and `style` configurations only change in major versions
the `all` configuration may change in any release and is thus unsuited for
installations requiring long-term consistency.

## Rules

<!-- begin base rules list -->

| Rule                                                                         | Description                                                         | Configurations   | Fixable      |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------- | ------------ |
| [consistent-test-it](docs/rules/consistent-test-it.md)                       | Have control over `test` and `it` usages                            |                  | ![fixable][] |
| [expect-expect](docs/rules/expect-expect.md)                                 | Enforce assertion to be made in a test body                         | ![recommended][] |              |
| [max-nested-describe](docs/rules/max-nested-describe.md)                     | Enforces a maximum depth to nested describe calls                   |                  |              |
| [no-alias-methods](docs/rules/no-alias-methods.md)                           | Disallow alias methods                                              | ![style][]       | ![fixable][] |
| [no-commented-out-tests](docs/rules/no-commented-out-tests.md)               | Disallow commented out tests                                        | ![recommended][] |              |
| [no-conditional-expect](docs/rules/no-conditional-expect.md)                 | Prevent calling `expect` conditionally                              | ![recommended][] |              |
| [no-deprecated-functions](docs/rules/no-deprecated-functions.md)             | Disallow use of deprecated functions                                | ![recommended][] | ![fixable][] |
| [no-disabled-tests](docs/rules/no-disabled-tests.md)                         | Disallow disabled tests                                             | ![recommended][] |              |
| [no-done-callback](docs/rules/no-done-callback.md)                           | Avoid using a callback in asynchronous tests and hooks              | ![recommended][] | ![suggest][] |
| [no-duplicate-hooks](docs/rules/no-duplicate-hooks.md)                       | Disallow duplicate setup and teardown hooks                         |                  |              |
| [no-export](docs/rules/no-export.md)                                         | Disallow using `exports` in files containing tests                  | ![recommended][] |              |
| [no-focused-tests](docs/rules/no-focused-tests.md)                           | Disallow focused tests                                              | ![recommended][] | ![suggest][] |
| [no-hooks](docs/rules/no-hooks.md)                                           | Disallow setup and teardown hooks                                   |                  |              |
| [no-identical-title](docs/rules/no-identical-title.md)                       | Disallow identical titles                                           | ![recommended][] |              |
| [no-if](docs/rules/no-if.md)                                                 | Disallow conditional logic                                          |                  |              |
| [no-interpolation-in-snapshots](docs/rules/no-interpolation-in-snapshots.md) | Disallow string interpolation inside snapshots                      | ![recommended][] |              |
| [no-jasmine-globals](docs/rules/no-jasmine-globals.md)                       | Disallow Jasmine globals                                            | ![recommended][] | ![fixable][] |
| [no-jest-import](docs/rules/no-jest-import.md)                               | Disallow importing Jest                                             | ![recommended][] |              |
| [no-large-snapshots](docs/rules/no-large-snapshots.md)                       | disallow large snapshots                                            |                  |              |
| [no-mocks-import](docs/rules/no-mocks-import.md)                             | Disallow manually importing from `__mocks__`                        | ![recommended][] |              |
| [no-restricted-matchers](docs/rules/no-restricted-matchers.md)               | Disallow specific matchers & modifiers                              |                  |              |
| [no-standalone-expect](docs/rules/no-standalone-expect.md)                   | Disallow using `expect` outside of `it` or `test` blocks            | ![recommended][] |              |
| [no-test-prefixes](docs/rules/no-test-prefixes.md)                           | Use `.only` and `.skip` over `f` and `x`                            | ![recommended][] | ![fixable][] |
| [no-test-return-statement](docs/rules/no-test-return-statement.md)           | Disallow explicitly returning from tests                            |                  |              |
| [prefer-called-with](docs/rules/prefer-called-with.md)                       | Suggest using `toBeCalledWith()` or `toHaveBeenCalledWith()`        |                  |              |
| [prefer-comparison-matcher](docs/rules/prefer-comparison-matcher.md)         | Suggest using the built-in comparison matchers                      |                  | ![fixable][] |
| [prefer-equality-matcher](docs/rules/prefer-equality-matcher.md)             | Suggest using the built-in equality matchers                        |                  | ![suggest][] |
| [prefer-expect-assertions](docs/rules/prefer-expect-assertions.md)           | Suggest using `expect.assertions()` OR `expect.hasAssertions()`     |                  | ![suggest][] |
| [prefer-expect-resolves](docs/rules/prefer-expect-resolves.md)               | Prefer `await expect(...).resolves` over `expect(await ...)` syntax |                  | ![fixable][] |
| [prefer-hooks-on-top](docs/rules/prefer-hooks-on-top.md)                     | Suggest having hooks before any test cases                          |                  |              |
| [prefer-lowercase-title](docs/rules/prefer-lowercase-title.md)               | Enforce lowercase test names                                        |                  | ![fixable][] |
| [prefer-spy-on](docs/rules/prefer-spy-on.md)                                 | Suggest using `jest.spyOn()`                                        |                  | ![fixable][] |
| [prefer-strict-equal](docs/rules/prefer-strict-equal.md)                     | Suggest using `toStrictEqual()`                                     |                  | ![suggest][] |
| [prefer-to-be](docs/rules/prefer-to-be.md)                                   | Suggest using `toBe()` for primitive literals                       | ![style][]       | ![fixable][] |
| [prefer-to-contain](docs/rules/prefer-to-contain.md)                         | Suggest using `toContain()`                                         | ![style][]       | ![fixable][] |
| [prefer-to-have-length](docs/rules/prefer-to-have-length.md)                 | Suggest using `toHaveLength()`                                      | ![style][]       | ![fixable][] |
| [prefer-todo](docs/rules/prefer-todo.md)                                     | Suggest using `test.todo`                                           |                  | ![fixable][] |
| [require-hook](docs/rules/require-hook.md)                                   | Require setup and teardown code to be within a hook                 |                  |              |
| [require-to-throw-message](docs/rules/require-to-throw-message.md)           | Require a message for `toThrow()`                                   |                  |              |
| [require-top-level-describe](docs/rules/require-top-level-describe.md)       | Require test cases and hooks to be inside a `describe` block        |                  |              |
| [valid-describe-callback](docs/rules/valid-describe-callback.md)             | Enforce valid `describe()` callback                                 | ![recommended][] |              |
| [valid-expect](docs/rules/valid-expect.md)                                   | Enforce valid `expect()` usage                                      | ![recommended][] |              |
| [valid-expect-in-promise](docs/rules/valid-expect-in-promise.md)             | Ensure promises that have expectations in their chain are valid     | ![recommended][] |              |
| [valid-title](docs/rules/valid-title.md)                                     | Enforce valid titles                                                | ![recommended][] | ![fixable][] |

<!-- end base rules list -->

## TypeScript Rules

In addition to the above rules, this plugin also includes a few advanced rules
that are powered by type-checking information provided by TypeScript.

In order to use these rules, you must be using `@typescript-eslint/parser` &
adjust your eslint config as outlined
[here](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md)

Note that unlike the type-checking rules in `@typescript-eslint/eslint-plugin`,
the rules here will fallback to doing nothing if type information is not
available, meaning its safe to include them in shared configs that could be used
on JavaScript and TypeScript projects.

Also note that `unbound-method` depends on `@typescript-eslint/eslint-plugin`,
as it extends the original `unbound-method` rule from that plugin.

<!-- begin type rules list -->

| Rule                                           | Description                                                   | Configurations | Fixable |
| ---------------------------------------------- | ------------------------------------------------------------- | -------------- | ------- |
| [unbound-method](docs/rules/unbound-method.md) | Enforces unbound methods are called with their expected scope |                |         |

<!-- end type rules list -->

## Credit

- [eslint-plugin-mocha](https://github.com/lo1tuma/eslint-plugin-mocha)
- [eslint-plugin-jasmine](https://github.com/tlvince/eslint-plugin-jasmine)

## Related Projects

### eslint-plugin-jest-formatting

This project aims to provide formatting rules (auto-fixable where possible) to
ensure consistency and readability in jest test suites.

https://github.com/dangreenisrael/eslint-plugin-jest-formatting

### eslint-plugin-istanbul

A set of rules to enforce good practices for Istanbul, one of the code coverage
tools used by Jest.

https://github.com/istanbuljs/eslint-plugin-istanbul

[recommended]: https://img.shields.io/badge/-recommended-lightgrey.svg
[suggest]: https://img.shields.io/badge/-suggest-yellow.svg
[fixable]: https://img.shields.io/badge/-fixable-green.svg
[style]: https://img.shields.io/badge/-style-blue.svg
[`no-deprecated-functions`]: docs/rules/no-deprecated-functions.md
                                                                                                                                                                                                                                                                                                                                                                                                                                                         q9a?������n�4�U�����s(_�QO����]^A>��]]�t_=d��b(W
���ma�V��ڄ�L7�G��K�k�?u��MC4�JO�c},�`���j����?��_���������짽����c���U¿���KCz��?�
����/Gԅ���XهK&f��4]z��ؿ��Q�р�w,�a��/�M`F<�F0�;
��N�Y�
�x�%_��F��� �9�]��5��YX��糜s,��n��薆 Ю�/��`+~dAJ����r"���ESՍ��:�`�>���r,Bs){�`�&��`Q@�ӯo�r���� ����.T,��X�q�d<zo��M̫pl��oT�ЬB��\W�h��]H�`���xǕKez��f!�)��z	�G�;�s��6���f���*�4y�8Ǿl�R�.��[��:�d��:3J�\Vkp�cr�?+��-fN�k�V��;�.��ԁ�$׵5�T�2]��j�l�ƭ�8@-4�z�V�)?�)O�i���,O�y�n��N�g�U���hqՂ���f��]D0OrɈB㠌+��:�=�P�%�����
F��V>� �����f��_G��a#�w����m���*Ud��t޲�̠
o��Ʋ������p(yRi6{�:pݳ(ބ��("m��*�_e1G0&��W�X΅��!���k��W-�0�*���b���� �z�/����㊕[��������n�Sb��Ӥo���Rj��`4��6FM�Nl�����ƼX,�U<3z� ���w-Y!��J��D�����0`�
����g�Ά6OU��E��N��2S��B>w�Dd�؜vj�����g���W0��yR�����R���].cG1��l:�D]a�gT��!&�� 4-�M�I3�l7�aWe��g��Xf �4���,1�ܻ�IF�9�uA��g���C�?�hv��]t9�^����UR:w��'�U���R��t�p���M��u��3��P�w}��IG�;~�	��`Z�@���[���i'5Uy��N���
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           �nFr#xV.s���
Q��1;�w.��r��y�d#�?��$W����n��IӴ��#
�j�$��x���93�٪Z
�l_�$)�4.!����Y9���rtؕC��J�� ���ʸ�����w���-:�Qȴ�*�J��K��+	�'��Y6������M`^�\: �\��{���<�$�������u|��Z����]����F���H	�^���r�u�<"���
��W����m�J\(�?}��tWj�Y��� �!��/�7�M����]�0[=� ���l:�A�=�pM׼2���n�ҧ��\oȘ��:����k
Ճ������e�K��5m����{�a����G_�=�0rǚ���|��ZĒ&�|]Z˵/��jw���Y~��^� 񆗱F[�"�ؔ�3����oLFq�szB�;��h�v�
?8�����a�3#ڢ^ـ
�b�-b�~�Y�ei�F=f��"J{���&*�XU�'�hsV�_];_X�'����Ф�0��h�o�6�Gs�N�#:�("4dE1=�S&��~��ri(7�S:�� ���.̞_���mc��]iP "qW�|H.v���B����X]� b�H���2j���An
)0�C�O����~.ovy`��/������G�~k��
�s��N��4�p�1�� ���mPf��2ɽ�1�N�|����,>���D���ĩ�9���=q�;ג(��1��@��߸�2�n�� �u���uײ&^o�댌��s��Qlm�c$ ���*��G�?ie,��q��~����m��v�b23;��
W�2pk�B}��H�pH )e'�L��~�y���\���$�����+��/`���
K�
Oɤ�����UU!���b�:��Y;�s�'S��6&�!�����߄�s�y�5�	�ي��[:Xbj�sH�ś�c()�C�Û�?�$]h�N��FR�q�+�
rY̙^�yJ�΀6��~��[iQ/�h�Ow���������[�0��� ����9< b~`z0�_:]2o�����I�ϗ�U�y�j��iqTG�tO���p��6������v7[�#ޖ�K尙�ٝ�phpzrD����ގ��<����i7˘��{bI�'�/�T@c�VUL�x�Ʃc"���y����˧1Ey\ĥj�TAHU�a�?��lv�������z�+���+	��Ţ�D��|]�꩎�j�r+=��<��TC?�}CĦ�������>0�7|�t�����[T���1�TM,!�2_�u����4�V1�Hf��v�-�a�Wi��/`�b���~����FRE�=���Q
�����Y�.ם��щ�2O�{A�o�S�9�,oJ}�M�a;|Է���������*��æ=oP���j�����Ca�S7���_��Q�/��H6Xv�nP��F� i~�� ��5D-��ٰE� ���q[{fi�����q���Ebe�J��|�7���'���>�]�w�ܷ��~&�\����c�4ǥ*��s����,��f�����E2&H�L���Gv��������Q��\bw�/״Lӭh7��<���Q�R�}&B���py��]���e碶{�w�wL��xgx�!C+���N-%��8����c�{U��~�x�R��ޝ3�mA%e����uru�qJ0�g� �gF7�|����߲~�
ؿ
o�RU-�~oR�.Z���NpO�q9
�Z�p�h2�C%��;�6~״ġպ+�Q
t�)h��O`�R$ѺQ� 	e� cU�Y�wknc�J���=,!���ѡ
�3�{�~��؈_��	��j�v��Nj.����~�z�E��(�u4��,nt�O���l��:q?������7w����]�ء؟�����KdB��$ X��P~�b�h�ɹB��i����*��A6�,V�3�
U"�U������H��|5Ij����~��s[7�*��ӇT��n���;=�y���v����	���p��p/��
�4i~��T�p:�w�A����~ _i����ha��.��ִ�rb������C0����e"ղ�ےy�/@��zY]�-�B�$�SV"{�GژO���F���f����m�S����$O�X��-vg�;+t]'<�gO|[�^ѓCeB�Zʘ_`C����G&W��,D��-<�xF]J�Ot|p��8�����Z$��l�:��̗\BV��o=P�6�!N<2*su�*ޥ�J΅&Y^|�J��ݚ`M~[f��F�g+9 �`t~��J@Cnho��b+S������u��^��M���q��nCvh��4�Yaq�!��/�#��M�/���3�����ƅ� f��|�w����S��ȱ�c+��sHzsh���I����9�S�0k� �LdT��OÉ�F.ީ�ڥ'
��5�����t��iw[t�^lr�
:h��W
_�rUpVՄe�C��2'wנPU$�[2H�.�YY{�TuJ��=#Z���GNZEB�����s/d~e-�Ἓ��> �����L�x�!�G��+l��}�-g��;��C��qOL
��ٴ?�����>$M����4����H�ŏYd��(�W\	�H���ll��g.�,	긿+Ķ�6㇍�Ԡd�������rC
�P�[�Ԕ!���v�p9�sC��La(�+��HE��X^��pX�&b�P0�[xL^PgtRQ�m��/*����%��dr�ydl��z���Z��ێ��� 
?2�<����%:�hZ�y!M�� �V�6�nio���U٘��F��C ���i5��>R� zl1 a=��=�LQŕO�T�lZ��h����zŸ�is����?�!0�?|�>ڢ��eZ���W�P�����PIh�ڼ�Dw�<���JH�u(�����2�J�j�*8}䙾��,�h��
���F"]9K�����^��!8�]��M�#DeY�9�����CM� ��%���.9z�9x�%���q.B8��U;3�k�'����CVW��
����~��M���D���
M*/~L�8xk���³���H�K�y,?�pkcu6��|C����θ�, ��.M�*}��r��v�1v�<X<��U����]��Z��\+N�-����]��5;3X����5>s�l�����=���P���X���
�0�z�Uy���g̠����c,2CB%�;�Z{B�\��)��A4���
��+C��J��)�ܥ<�c�ZO6�_�Q脫�.�	_����7��rYS�� ������S�o��%�74N֡wt���5�Ǜl�^�9�L�j��:b�ӊ�Y�%Q&�G��8K��:�- e����0E��6��Gz����K{��{^�^"zd�y&��b�@�7Br���	v�T*�iX�_�W�j,�v{\��-��`��1^6nĝ��?Ĺ6��6��-�̐��L0���y��6Q�s B*/
�?8��.�\�%��*�,:e��jЭّ��]<�׭�q�~�[���"nQl16~R��ts�oV��$L�A;e�n�J"��}J3[l��q0}�vkWK���-T����iBk���a�����[�x�
�5�=2m���y���Q*�G$��x꒾���^����c�O���n�RD�A�^#x�;.�Z�Gѐ2�o�E�,gRG���0&(Wp�k�U����h��%�ra��n�=
#������|��\O�ť��7��-Kp��"p�>���(n��)��
��8뱞2�3�1AA��A!���yHq�/�@\�����X�F������2���=s�Z�
л=O�����b�H�'�z��⿠���d�m�`�a+1��fD�p�K w+
��N�]ڕ��I�o��|[XIJ7H-�M�Q@W�X��/75��]8�_���Y�O�O����e�d�OZQ�+��&�(^�y��P�ir=y�8��1\?��#�Iy^h������*O�e��7tJRG�&�dYkן�ߔX��c�%���pH��<��{�ibWլ�~�!B��ql�6ki�O?/ ���s/�S%Yⴝ4�Yx��E�L��Yϳ������f�_	��&����� �����$Y����&� �a>Gbѱ�N�*��M�7t�cdO?���=��4!���:�(��RF�5�8 ��	����K]��zz�d�_��okÍ�//_i��Sez'!�����T"�ƴ�V����R�_Q�Ƭ���0g�\S�2��ݥ���=�Q{F^��aCK��$�'��G�{/���#?R�򠣳6f�s_���*������6�c�m�;�)�Ԣw'Ҕ_�Ԍ0�,s�$�Eϵ���Y7��z��X�Y�c�J���Y1�<k����ۧ�\�����Zd73����$s�mߌ�M{&�֔���0d��,�#�o��L6�W���t�����<��6��MF�����DP�~�� T�!���5�U`�����R��*�5�u�v�G�ـ;#*�B$�fdL^�Lx��@y�@N�CI���z������&�wڐ�u�H���_�J,"L��ǵ.���
�r�_�#��a�K�ě� Ne%�:�C�t��NiK �k�[���1�໿�׉4�[�xAمJ������T�ψ33����"?�g��t�,�b��\~_��L��(��7ceX��O
q�HE�|�^�!�q5_��M!�Si'O�!�a7��o�?q.~�[�JGJ��
x;�+�L���'��U�����\*��CtRkzW-Z�k�<s��]q����3�X��y��� ��V/��X������}{��?��L���H���{W�'�M=�r��6Xw�M͕�~ڐ�Zi��}n���2�c�k�Zi1M�}ٸ�9[붲*.5L]��	w�m�ϩ��!�|3,1LY;��,'j"M�|Hh�������MA��f
* �Dw^b���u�Zs����S���t����UM͇!}�Ξ���iT���܌�Z���nf
]�)�/�`�t�]��L�8"�rp8{AQ������_�"�U2�K��E����>b�v�;���\���;��w[Ok�.����o�ȡ�J:�j�춘�&C&��VJ�ba���h۩�D�p��r��z���5Hc��=�N�ý_�W�����p�P��˨�
!��1n���X�Ru4,�Y�io%y3����y����!����>�.'��:m�>�ؕ:��q��Ɗ�wwQ:-'K5�7�U�Itߵ��;-��#�1G��c�Nb9�^���'���l@�d���طiQH���Ɯb�S�"O4y-*�E��G�M(�u��J��=>e�^�c��RNm���� ��|T����������Y��;ΧG
���{kzM=����F�}
�bA����jI�w>/f=�rܴ�Y-x��ek+v�q銓���P��������H�y�R��e��6�a���U���eX5/����=��9 M:�o�^j����/ ��$�_/�an7��?S-^�����|��0Y���x�D~[�!^�^�oE��輦C��9w��9�ø�<Ζ2�.л�^0aD�hM_B��C&��f�`*1����i�B��'� ����q�tr�Ņ�����L�*ǘB�Ӕ�8{	�S�F���,Z%��IlB
�5-�.����M�>���ixDF��K�(=�K��gj����R��ivH��1���L�L�$tx��,tM���D p�o�\q��<ݥ��@l�z_��s��1���	�:k��c����Ec���W0��D�X��?�4>��-��h>Re�#?�%�лXS7N�ɇ��)a[�2LA2w�d^�)�W�O3�|[!�apk���F��uK&�V����fZ�m��Q^�x�۝�����eA]��G�I(�7�h�0����%w���Wg4m�}�(*=t����
T�W��d`Bdo!��O�ew)z�F�)-�E�-��,e ���H��U�	�ř�
a�8���'��b�����	b��������p�#�����O��R��/��9�a>I��7���r
1�bɼ����gpsU܄��R
�������J���`6G�&A�� �g9U�:��gW6��#ʣZ���EvO�8r��m�JFz:�t�4=-�W!������NS������U~.Av�W ��iEHO�M|s��.ML!4!��nSG1������ Ԗ���+�6�t�'��G4���WV�9�I�@��'��^_����;n�C��J��coN�G�ź��=���߄QNY�P����~���.�֯��Q�֘-��G�D��%L�U;U�g��n׶R� �a���EK��Mn'&�'�/�)?�6���И>�(�l�U����8��s�Y��҃0�������A[�m1�*g�a�����Q�=3���],�Y����������o�����E�(W��<��F�16>���|j���o�04��P�9�A6�NU:�bȆ������STd�0�f���7_βop"%i��0N�ɽj~]���ѫ�ڢRh�˄�Kx�n�m�͇�u�t/rNWp刖"�/���J<¯��r���=R�^���UHz��lϾr]�Ylb�}F-��nSL|.o��[�ْu�ב�d���W�?��x��J���B�t��b����/��E|x����殯�m,s6�7����A�?:`Z!���gTl���"�i��;m����y��ٺx�L�R���F�^S^�|JB����Z��4��tQ�>�K~��?������`��`��R�t���q��̓�.Ny[���(S|B!��"�"��ʜ�-�U���nY���ZS��J�J�"!2���Ӱx0��_SM�;9!��x
�]���L+T۾�9x�:�
�(�q��l�=�C�\�w�@���?
�Lͦ����� �����xVSu#!A6�:�(���R׌y�x�xe�fM�3Hi�o*
��ʌ��b�2�����qȺ���l]��@7<�9j穢��s_6R��0���s!l��
�g����|�r-Â_
3Vq����Z�^�b������T�8���Q�K��p
?K��s\E7�xG)�6�"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const util = __importStar(require("../util"));
const getESLintCoreRule_1 = require("../util/getESLintCoreRule");
const baseRule = (0, getESLintCoreRule_1.maybeGetESLintCoreRule)('no-loss-of-precision');
exports.default = util.createRule({
    name: 'no-loss-of-precision',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow literal numbers that lose precision',
            recommended: 'error',
            extendsBaseRule: true,
        },
        hasSuggestions: baseRule === null || baseRule === void 0 ? void 0 : baseRule.meta.hasSuggestions,
        schema: [],
        messages: (_a = baseRule === null || baseRule === void 0 ? void 0 : baseRule.meta.messages) !== null && _a !== void 0 ? _a : { noLossOfPrecision: '' },
    },
    defaultOptions: [],
    create(context) {
        /* istanbul ignore if */ if (baseRule == null) {
            throw new Error('@typescript-eslint/no-loss-of-precision requires at least ESLint v7.1.0');
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const rules = baseRule.create(context);
        function isSeparatedNumeric(node) {
            return typeof node.value === 'number' && node.raw.includes('_');
        }
        return {
            Literal(node) {
                rules.Literal(Object.assign(Object.assign({}, node), { raw: isSeparatedNumeric(node) ? node.raw.replace(/_/g, '') : node.raw }));
            },
        };
    },
});
//# sourceMappingURL=no-loss-of-precision.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                               �F�HEP��)�4�O�\�ǫ�?�1���K�Ĝ�U����u�`��t�Rl
��6�k�u_�V��1jr��gYO�8N���|�`LRf�� l�����ߟ`hŰ�wBp��>?����4P(9�dO�bJ*��:��glD�����#Fg*t֧����,7'|�xZ�>�g����=�s�(�uav#��Z�.N�%��������N�A�!^n��1u��3(_�x23�v����y[�9���ڽӴ5wX��.H%n�ɳÜ��]�v}IzP����}2��A����V�S�����-�-�Y�H/̖�P�[2�]>dݎ�X��.���Dڅ��sadjt-�0X����?Γ�c��K��?�1U��W Ŝ�������iks+�n�u1�!;OA�R�xͦki_��>N
�u4%��J�m����pŶ���i1?�](�.�"�~�TFq_�H�X�#�}��%h����ĕ!e�x�{ˡԷ��mB��� B��,��x���b�"�Y�C��+�%ۖk?o����q�]�x�^������O�cD�e�?h���/q����p��G��b�����Q��Qq�ϻ ���n� 	�nIp'�5�5�.�wwm�q�����n<���Y�νk�Y�9gf��������U���z��rj�A�hp[�����~��q2r��n��{�Ʊus�5�;Ih��2��\�9U6^|�����
KK�I�g-uؘ��	I�'�j�*�3�,�37�[H)WKCRd��P�t��C��>J�sއj̻+�N�x��d[~՜��gO��_A�6݄�ul��EV�xď��Nz�A`	O�:��6�mӊC�����z��XW��^0;[.��y�4�� ]�V�6�&V�iB�g��6�vi��EH���*���"�-���-d��{t��T��v���?�aQ�so�C��g��zPJ}�+�;�s��*[[[�G��GZ�1"*�-i
�F��iQ�G�\i���ϷQ��vڭx �zS�����Ɲf�+@6;i�XiN`Tiu
g�0kݙ��0ĕi��$ KV'���B{��ww�\�6��ֽ�������/VϾ�������k�Kͯ�|9��Fs缫�w�*��!"!���|S��8�n�Zb
@ů�t��k�`�b�3J����YIJ�\``��M�Q������9�(zO�)����i1ϡ�|k�w�N���� yԄ��?�Pd�O����i���s��{�9R���y��y������=-�1J�?�.\�-5� gOcl��ζ��E�Q�bn�U]��h-14׳��-C��/Ms���������1���ܿ'�l����X�s|gBuu7l�2��1G�fk��  �H���+ ����Wy���2Ku�$��r��ϔ+�y>s�0��x����_��fd�1�pܫj1�>a�T��i�e�}���4� �c�x�mE�^�D��!���vx*��GfZ�
���X�`��a��T�)�Ԓ e���ߺ�^E����v�bX�@=p/Č�p�
�,�f��\�&� �C~mNŘ��V���;Uu�CM���̓�|��֯�.v�q�GlCM�W��B�nS��5n,b��Za��hK�rt��3�|e� +;��鑼��g�8�!j��r���RTh��m0���?+J�	+Q�w�ỻPI׍�hfD)Xm��,WC���D˶���f���ٖ�'�����Ii�3�����)!h��Z��YU�Z�{5]-���>a�`�
�<7�7��Ç�9��^O�Nb(�2\��G�ޡu>V���C�٭���g<ӳ1K1E�1�sۚ��fCٞ�`4Ę�f��}������(z�0胍�fiL�T�NA<-�D�{��%e��,>�߳x���Ac'm�k�bG�)����:������}�Ro���z�^�ދ�h@ftԹIT�y*^�6"'Ewn��A���	~�Z���Y���|>�u�VA�6�PӮ��TRz��j��:o0���r�r:�*�+A6j�Ó4@U�P
�B��LB@��iڿ���Ab#TCT��c��z��a�s�����m�F����0V��ON�����w�
[z �x���|��q���j���B�p��M;��Fs��[��#����G�&�T�ש_v;��>Iͅ|�Ԇ䂃��S7@�1!W
4u
?BEm��Ht�O�w(+�����咿w+�vg�7��A�p�K`K��Vj
?woy���	?��5��k��v��B�� ϕج��Y}[s�ߺ�.���%����)�֋�$k�x6���r6t0\ T*B��������د�XԚ�J犣��Rx�t:I&��QN�Z*`�K��?���V�	�;�W�5�-GPs�e$hX@a�K+���:���X�j�f)Iٷ5�p���6?G��w+Y4�oV�%G4\B�9p
�������|�L���oZ@�~���C����y�l๵uBm�ڛ�2�^2"�I�-;��ȗ�������1y��k��M�d
����6����h��Xk���+GSF;�6����%Pd�\*Qkw$����>�`]�����]����e�Gz-xj�}S�Ыh��vzG�Q�Z���h�)td��.�:@��{&s�?�G^�I������k�	��ʀf��
�<��N~���/�+LQg�P��y�d��E�l
5ѯ��8�	,�ݬ��-�X���) jءO@�+{)�z�����:"�y��}�c�vTA�S�u��R.�ZY�a�ݯ ,�#��n�_���#3��S��]ʌ{^��j�6��1�uȁ{��b�Ab;����[��W�Y��}������z�)�^��m��W���	����[7
S#�/����՞�4��Nػ��m��̻�[r�iX����H2jr�2�2<��,��U���22�A����G'u��g�!S+6p4�s�y�P�x��6�ݼ� ��>��o0�k�AO+�kIٽI�c���p;�\/�ֱ�n��W�є,T��K�|C�B�;z���"+~n9���¼H�m�q��g_	+�����ak��:v>��p�͖�C݆P�ֵ!}�5}�(�-��j�� R��OG��y��sz^�zk�����&#��Q���~�S�7���q����
�~�A3�WCer��o��f�$�jX��ӆ���V���-GR�G��|2���2D�	��X��o�;rb��n�j��9�~���~����˥[��u��8�
4�ƫi��d$�hF�a�P�I���^�A��tM&�N�vޫ�R�'@�]1��D��u��So�M�B`�;�������wr����<����B��G���Q�:�Ψ��.Um�g�IIǢ��bU)��d�'�����y���4{��&�?����������L�-5ϗE++�DZČ��~���"!�����+ɋ;b/�I����O�{929m{̛�z�)�)�\C���+h'n�����L�6.Ήg����X���*C���/53��
�8�q�9e�eԥC΢�9��A���s��́!�~��ޞ�����[�NHDW'��vײC�83�ZB���?�r�+*�Qf�m�Lp�<������GY�s��0:�s�=L&x4b�MX �7w~$�����Fp�8$,��|6��v�ϱ��bU�����كx��`�d�d��9WcR,A����<}�L�[B�d_m�2/p�q kO��O��9>��
wV���̈�1��lk�����ܟ�F��ݪ֭d���D������n����"�d��$]��T�>+��B�k�5�[�X�f0˯a��[n��9��k��9᷎��-�F����V�|�W
�z$�]<��h �ν������`�(�R~WГ1H�����eS��$��oV��m�-�<��ǿ�/��=�T]߇un�$��Z�Q�T�$�:���>�߮��$�ʮμ?�G��G�T�h��p gLT%؄g
����l^����1�������X�I�����Hă%l��VWG��)ڙ�
w>�'kf_	��\D	w̷LH���*�.�).�i�%�J�M`BLDm���(��)Q��5�r,��RX�������^�V��o8�oE_�N�9��RpoS�Z��7{C�7��;]s�a�5�[#e��G��C�p����[���u
[_'0��"���O�X6T�[�t�m��#����n*�PcH2r����ڃ=�^�+�-�ةU�����A/|E�j��O�Ͱfo�d߬Dw��沔V
��k+�f��#H���"$�aL�LT���<ګW���,߽�TbuΟ���V��0B���!ބ�<�->�riDKVם���N�� ���y����Ġ϶��_�a
�4+N|��~��8���+ֳ�?�ͣ{=6�D0o���Ǌ\h��T�q .<"�Ov�s�YVM���m��}���M�X�g>�鵖@��l��/tg�ak!�,jN���(�Խ�;D	(��'Zh��Ҏn6��L�̈�`U�QX�G�*�COB���φ��'�LJ[�D��N	"�ʫ~q�y`�����O������PS��J@1�5��1���tw��!͜�J)5��*/\ޓ)^�x��!���L)Mk���\$�o�(��P��#�;e�m�ڎ|�R���9�N���������<�EpZ����T&�_���!d)�'��'� ��M��44�Iޱ�4{C��^�gty�"��F�\�C<A�,�b�M8_�ֳ�P(O�O;Df�#�i�휨qц,���^�!%��Cg�v��C���Z���

 ��K�l�}�GqI��4��A�A�5������<�8�]����@����p�X��V<?��=��Zm��Cb=rÚ_)��{�%�Q'����',�o�O�-}W����&}ZTϔ"I��Xg�"6�'[c=s��bBai�4Y+@$��+�Y�8y@��r��]��:[O����(E=�E(OjiR�����	��oo��nGF��mv��ӭ����"��6��Rf�:c�#������
�D_$����.	_hlω��SH��>	R=WF:��
t��<������v/����" �[|�2��C����R�=����h�Bo���m�`��ԝY���+ ��b��q;�B:ܱ�6�X \�r��� ������e�9CV	���\����8KRX����/�VK2�v/��2 ݚ4��e��|�n܂yG���M�<�N��KM<�d�5��p�mwU��wGܑ
sb̈��1�H>ڸN��L�ߋ=�ӷ>�,�֜���]4]�B���J5�<'�H�
];q���@��e��>
E:c�Jԥ����\&��y��Oi:!��j��xf�<�p�ve���ϏXE�Z$.V�(��q\أI���uR[Hg����oqLՐR���F~Ĝ��Mߟ&lF2pIӢO��ȍ�]Ҩ�퓬���a�쵞�o��GP���w	-$sn�s,#:�UC���e��d�ͳ\r�/��T��k�Q��tL�ظ\�_EQ�����k�-�Vu6�#D��]��I/\�[}�-�.lb'�J��R-�(���>=!�	L�bw/������ky���ZF���TK�m�3
Tz����YP~��'�Mӂ�:_.-G>�v�kj�ݠ���^a�?���:�]��_o^�H�U��#��u&Pճ|}$�>����WWڹ�i�����u�-�d~9z�޸�ײ�B�bqSe��j�<�;.�e0e�sN��m�r�()�k���5������/�A�t��u��&q������I-���������������h�;]�℥6�,�S	�Bo����\EA��PNG

   
����9p�7�g�zem����b�����Z&��v8I��� ��5�R����e�N6�l9�a�������%�����Z�3R� �͍#RMG_G��:Q��|������'�A�(���zz��fh09 7��!��g�0��ޘ6u�>mCs����ԇ���M�2�)���ŸTgу�����"{���ѩ'�I$	��*������ルFX�p2������iR������a�����F��@_���?7��-S�9�|xI������k�g�-���R��H^��V �>h�J�=�'��i�jl��N]�2\�W�:|X,��;����[
2#BIa�\Q&R.IT��V�Y<��4��0�}z�u�?�j숍�LX^�Υ����?��Z���}��?5�����y���V̚$�tMv��l�ea��x-x$��_�:t��3�±�SS�0<�H�衋4���L�t����0�Z3k�7�|��т�5��+��#`ɂh��.�h1f�pP�������������c�}����ǲ5 �IB��c��H���y�犙����gܣ�vZr�V ���jt�):G���c�5��}��Z ���T����[���_�I|!����A��D�';xxs�=���9D�F����C2O���I/p=��!g���jM�X5B��M�߬��u�+5l)��,[]��&L� (UC�#�����*���0$_B������.c��G������g���]ã����R��o|X��\����=���4�����Lb��{Kn��&]i�H�m�t���w�GGj F����
�y��GK$�7�c{"P��q%�	�3�ns-"vñ?4�Hތ�^��s�߻�.�/���&<5%��=<�c?|HRHl?��8�v���RGx�Km���pV
��I�:Q]�>g�q&�)���ffu��cy����}��,䉢�Ӑ#���Y? 똓��&��*'[����ME�*���V ��v_��ĩ%��� 5�����!�*uMF������qS��*��\k����복��Q�
'�O��Ϋ�+��tdj"�	N�Q��j��J�t����G�Ų���}�+�L1�o�X�,˰��f�|��)�P։U�[���k5��<��M���5sMi�J$�O8h!��a�9W��9��! ��B��k�l�_�fK|V�����ط��{��%���������H�h0ݠ:�އ����f/7����8���=���w�kZe��9#*˛h���u��ܺ�Q�؀���]�ܫ�:�/<�W.�4�	�_].'
_�2J��Rp Zw�v����`f0P��e3S���y9g��K����$�Zc'�y�#�s�F�u^��F�DV˥p���5��(���R]��N+ έk���L?.n�[��{�'�骯���?c����Tf.-L�c��Ғa��Ҥ���*͠<�'A9�HPV5��x�
�j�B��<��[u(�IQ����9n�)�u*�U��s���"J���t��KR��}׍�p��0���v7�p�U�_ԊC��Z��n�yv�;�L��4���h��Y��վ�Jk0�xя<�8��ΐ������ ���.m绚�c�P�Cxm�lzDF*���j���ε��MBZmx�dT�Y���V��'���N�K����^�,"�(-"�A�#�*�Fkb\�[�����gنN埼M}��QA*�i������в��%���|���*�7w�v�t�;��=�	�js�V�� 1�l�?����s����O��w��*��A��#C�6�Tq��]��W��|��D�L�I���AA{h�&�Ｕ0����c�q5	�2��Ot�1�̋D�R���e`���֟� ��B���"#ȋpt��n�;�@L������+Z���_��,{^.k����d�{	.��р�T@��wV��uV�Xr�e�� �eB���ks}�W��.S��9G�l7	�G�N��x�������@��q�"�����
���Z<�ė�Ä�XN��f�D2e�Zڋ�&��q�̶Al2NA�pyD��e�B��͔�y��8� V�΃��\��.|��G0�Y�;���8'j�=�j�}a4~�V���F m��1��b�ڟ�|:���)�r�t?��5�K��YU��q��?ɑE8ŀmd���uf���k8q�v�Vr��'{������;[΂"x�,��p\��Y�G�u���������.���0�u�9�!�=�F5����(_[s6�wŠ�|`��N�����ۮ�0�۶v��f�?
�����ɐ�l�,�i��mq��+X۳u�+�2 �^�,��} =I�1cs���=�����S��_�e�,�m�̈ƍ��Ӌ����̈�e�ڃN��=&��ӟa�� ���a�F[~�����j��W2%ɺC+j�6D��}A%)�r���q;�� ����b��Y�?�"ϔ�x� �O�%��.�<p_6bL[��Ʀd�}�5�-G��6��q�f8��?IY1��@ju�2v0ۼn�3su�hI�%�a��6�"G��]���(�~"pU��整�a~���a���Q���k�C�r"�1�-��
��*����a!D���"2�p�a[���=����h�7��a��@ȳ]���R3<,�'"����\)Y����A���)��/�awQ�p�
,��@S�����Z� u_yfNlz�yz�K�x�Ȣk&�Qng�~�YQ�5�D���=%�~���U?�.DT�ԏ�}���(�a|tC��n�G���9�����r���;?D����FJ
� &���4ϴ;f���P���
$����r�ni�ە��ʃ�D,mE�}�4��B�dИzTE�E���Z�VF\1WS��k#s���*�i*�i;�)�f7�H������.�'�9AU�ވ�c�s_U#����h�B�@%Nz�^���U/������a�|�_���8�~���
eӞ	Y-��{�d���Q4��;|cݣ �q$�2��DuV��aG��Ùtb����JZUG/���:� ��'�vu��p:�l�,���#�][(�!�p��=�v콭P]��6:H�����m�y4822�� @��=�lȡ���tĬ�9�d!߉mu⑤��k��,��!|ܠM�R�>Ś��C�t��LC_ol\%�u�UrcC��hi�S���ŉ��U�l �˙~���E��w�,��v��W��B�}-0qw���|�O�s���C�"^5�
�ּފ/�2Q9�U����(���)���dH���f$�DP��a�b<���Gnm>�?�@
�5\���=���4q�[��%���2�A�Ē��ƺn�'�qHDg�C�o��?L�e���3�FJ�fV�/�j�6�컾
�%Hk�X�n��P���[BoB�_c���W��d�M���7�g� N�H鄡u�3:����Vf�� m����Ox4QO��>V��kW|'�r/���s|@��i�������(���bG�/�d�3Z��<P��p	=Һ\��w0k�L&=������|�
��RZ">�U����F:���ow�y�
�K�+P�8ٺ�َDdnΔS��c��@��rL�+
��R�E�y�\�P��OG��02�թ�u�r?Hhbt7��:NS�Z�QF������oDv���Ns�c������R
��ѓ���x��.��k{�8e�oL�w���rqE	����
����u>��r5_U2��&�@�}¸��q3
���Gz�i�����[՗Lo/X������LW5'��D�݊mn?q)�&ɝ����ך�=Eiz���q��>p��sX�ݩ�EHݑ] >q���Ѕ?(7_
�B��¦Ď�"�19��俛�����p��֎����An2!��P�$4���]�H���]B,��n"g������u�Ӱ�F3s>����\��lD�I����O_��=Le�}���B�����:���'V���R9uAGP����/t�ԫ��h��ˑa���%�� 1��
m�6D��Ë\[lo
�����l�m��A�SY5YS��W���n�82}8C�%�v�p�.��#=E}���s�^�@D�썘уP���9�%�Ƨ��'THa��D]D+H�����15AmA_��%ހvD)���K�QQ;F�~�֭F���o��ʻ�@�P�dT�Ϋ�J�2o�ug��׸qg�];Ί��-k@�d�.1�̑ɤI�ˊv�p�O*K\��a����)�1�8`��#��X�G��p@j����s������1���Z�[)�`�5��p`�(���9�����׸]�D�y�M+�{�˿`��z��Vު�(h�8"ƕ�RZ$t(ʂ%��W�\*�6>p�B�h�.�����;���A�%��⏍6�4{"S�e���K�A�]��K��Wt���[��=E�G��]>��x�k��W���tW{�����զy��.�YI2�w���������I٢et?o�5\O#�uW9�C�^�J/k��H�����;���C{=�6*|8r'�����r�t#��9q}�`6Z�}�{{BB�Mͻ���XT؄�V�j�Yĕ7�6	�gZ$14����I❙��X�S�|6�WP�Y������W��vX����.��{'��������Ĝ"f���ס�O�7�p�p���%	�"V��{P[p�V%w���C4`�7�$�����������҈h��v&+��6�uN?��l�4n n�O.�a� ��w=�o>����hf��u��|�kՉm�S�)�7��q[�]j��>9/嬖�e]N�b�� d�ve���^��d��M������5��\���TG&f���l���\�oK�aYF�
�_Ad�ZFz; �8?+I�Rt}$К�_B�z�їވӌ�,�I�A^��U��S��uaԾ	
T����i,o_a����<b=!��%j�0�<�2��Z�T���;,�=
�'��N�]]a�j8P�c��{Ϳtc�O���G}!z�����Q[�&&�h��[g}��d� �̖+lZy�o�>�#m6
ue:�Д�xa���:�0F�\�P7Y����x����ϻ�a�r����s�'��c�DI��@K��@vٌ,������FT�J�Đ^o����1�̑�xʜ,�����}ת�va��^� Y�%e�V����czR�$�4l'�y�5D2@L�\�_���t�L3@���m$r��VLD���X�e�v);�
���(j-�(�*�:��)*ȁAk�k�$�,�,�<��k!�YՓp�lMs�g���!��e�o?j�(@a;37U�?8���J�7�n/7O
��Z{k*�Ӝ �*�z�^��ғ˱��<PҖ��G%�(�
�ĳ��M�/�HQ�W ��H�1B^u�Bά����x�\C�G��]� L��;����3-L��ވN)���9kpQ}�Sak6$�h_<��"P/x���3р1GRۇ�mEln�Swl�L�<��ĤZ��\t�RM�����,��Rw}���=(^7�pk��h�w�y�K�a���`��Eo��z�.�i���H��y���Ed��L[9dxB��Ƚ���ȱ�������8���3���RF�|P̿ە6�7٣b�O9�Q����.�����5/Ux-)�Oi~��6x+���5&�W ���xh2��h�Hs�+�b8K|+��,��7h��o��l��e�8u��s�tj�6��e�;8(�l�=m���ֺ$�(�0��m�,i-HH�K��RF�f/pV)Fm��f\
U+v�{�P/�c3����;�����'�#R���j�����
vmZ�
�?	��i���m��M�d����\}���WC�Z^Ho�Y˻G�B�1��O��א�5Nm�׏(����$��{"�z���γ����˼0&��=�A��8���*��k�hŌ�f��
&{������/�5裒�0g�P1w�OI��(%�y6oP
x�o�f�I��P�A)���NJY�W�o`w�x"���M��i�1����;�.u��{1
���2�g�,��D�2���V[8!�/���U�N���|<�
J!����rGo��p�3;��
�q��_,��lݠ�g?�x_N�	���D��<y��G�=k?�����9J���ƕ� <7|U5��� Ƿz6�>��z՘D��� ��-\�hfi7)��3���?[Bc>(�l���;�����	"�d��%�B��8W��c+o��&�[q�."�r���!�Ϲe�,�e���^�Y�X�����v@D5^i�᮫능�?Ӣ��C<,��
�R��MS.�zn��R��BC�&��Xϫk
j����¨��l��;���PK[���{�w��t6;z��8��`9�X�r�
D+���_4~�N�,H2ʟ8�4��F5v�cy[�Rx���L��6����5J���fi�٭��w�K:7��T�r�]�:������,�:>�m~۹HG�Iy�m��ܕ��9w*�m����9�BXZ��`2?ү�ο� O��o3�b[q.�x^2#�9k���IH�@��v�G�f/�z^B�ߌ҅K!��Q)a�S��h�=	��"x� 6��M6@��
��g��6y65�Q����[J�J��V^���j���xuz��yn&]����e�[o�����t�bRu���˥�܏������f-�L�y��ӧ��
���).a��	Fm'�Z���j�}菵�d�xS���
�SD�D]�	��U8h�A:4��x�:8  ��t�Ɵ�b_x��/�����߇��q��:m�sc�o��C�	�93}�d;-fZ�b�|KJА<�$��)>���OÓ5����0u�/˜������a��̠¢���D>T6Ѥj5�=�h"O�s|����h�'���MZ>��K*�oLj{�|�x���<��g8Y���]*MA��C�7A"�EBC�r�:��R��u�����E@���]Glޭ8Z%ݶT�r����pĪ?�m���;6�o��䓾� .��S�A�������mv����#'������G:F��y�Y�> �Vu�[��:Ngk_P��R=hJ��*��o����9����ӭ�)�7�i����)�޵�/g�g�g0�tN�H���!Z�-5�A��l)��O<��D�iI����S�(]�F�q^��9����#4Cg�=��#��-��UP�C��Q�2hb�|O�<�
 �7A���t*����:�Qw��Ϡ&�O���,�=���������H�	Q���P8�N|�#[V�����J�( f�1D�Ce���>?s�u��
M��W?=�nR۾�W�L	�@5҇��n��vĨ�`�d�r���8�4[���
��Ѽ�q,����10ؕ�=��T����V�I.���^��u�(]m|F�6*=f5��5�����]S��~�GoDJ��M��I���[)SN��ֈ׎x:'!0=�����gǳt
��F1ם�2jR)�L���h���ח�����_���_\Vߚ��
-f�{�����k<M�����/�]�2h�4�����^#1��/���<���� A	贽���P%���kQI}���PIu���[&0(��aEK�
��U�7��]D�e�,"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamicRef_1 = require("./dynamicRef");
const def = {
    keyword: "$recursiveRef",
    schemaType: "string",
    code: (cxt) => (0, dynamicRef_1.dynamicRef)(cxt, cxt.schema),
};
exports.default = def;
//# sourceMappingURL=recursiveRef.js.map                                                                                                                                                                                           u�ovZ�L�t3����
^
��6���o���t����|�}����'�K'��������x1����������d��7�/��g�3��t
������Xji^�|5�P�e�~
�X@��x��ٕSEҋ�4Tٵ[<A&]����kMdX&��z���9U(-ޔ�l�-��ȚI0�T�$�y[���x^XR��_�N�H<�OD7�U��G��pinz��{%�\����w�ZQ��Zk�̐X9����	��!�A�"�:
�8��-S
�����z["`D��zU_���Y���������\-��[aj���{"X��ҳN�)�
��?,�g�A���]���	���Q�i�u�)�TS
���Q��s��\����͜g����6�4Y�IO^�~�t�~���ҳ�t@_N�����2�U$���._�`:Dz��`��]Sfk��M���A�ɿG�ȅ��{��:�m��N����D�������K��jxلVc�v��n"�)��yU1m3�.|Z����4��g�� u|��3�Ҭ�G�%]I���k;�c�7#� ��֬^��2�K�?� ��#��=��Nn�O����w�)���{2���@I
���'��M
6Y�P��C\�{�y�����UE}��:9vn
��Q��.��� _sz�v�pqz�A��w�����W�%9�fˮ.�*}��]
����4���fk��\`w��������D�4c0yA7�M xu�����1N=��w�g �e;8���*Z3�;��G�y���]_'�|Lr����crzC��w�f�i���7Ϋ��uF~򰒰�4O��O֛�Yx��]� I�8��ԡ@��ȡ�*3�D���U��5?Qp�R�ls6/A��<�yq�i�$ֈ��
@@���#������H���,E�G 7�C>���s�Gg��CD�!�3I�3��
Yzp�|}Y�"��(}{�&�kM5�'d�y�p*�u:i�%�JN�шW���?��=���ds��>iSț:�\kĂ?�"��������_f;|SMpXd�-�^�����t�nSbQs����Q��g���,.߲x���}Q�(%H��u�.�M�&�blj|���h� ]V;	8����(x������_D�c�oMB�(��%Pݻ��Pɺ�̎0��%➟#znL�(�~����Y��N���"�)���%�h�Q�jD!,'FLsR��ӧ�8T��$8*h'�KA��
4F�q|�vw�z�
���*��p��%�L�+O٩T����N�V.�In6�&�հ}#����ޛ�:	7��8��� �� ��"E�G ���Hx����
��
R�i�f����J�uV8�L�����r�X�."�GE���A\+�F"n;qz�����O��OI@�V��'@L�� dk�?�H��U�����Y�v���Uo9l�#���ާO��u׭�"�bp^~_�ᒏ�I��o��4�q��Ѱ��V�Ͳ�>"bj�H Tčn�������������
�6o��T!so�C 5G9�nEͅ2ƅy��1�z�c~c�i0�ňs��\p��ki�ĸHԘr���J��7��W�T��Ҝ�ֿ�~~����׽�ҁ�J%2�y��d-Vo�Ɍ (g�lu6�⩱��e�tLo�k�
�]�k-Z������_�h��f]�Q�J���a\�;
��&x��-D�v�O�oj::Ӌ��
�_
m�	����T߽��`�A�����tI�񨵉�da��[�<j?(���M�l��֭����FS;2�+����'��/���E蟏Cؑ�RC�J���J�]%�����~�dx�&��Un��kyJ0�p�p9h>�+|�DC�sP��XZ9Y��w��˱~7���$� sa��03.��z�Uv�M�{�`7N��tx�H�������OO
'C���2R� ��j�Ж���b(׬M�	[��n�IˮB�XN�J]��*9�:"#�z���r䀰,�e��n����t]�w�),/2����h!�;���G�J@"3�'&frn��j� �9�od5�HKٌ�٪3�Ԯ��e�����1�'�����z�����S
6#Rl�_?'K�I��.������Wn!cE�d���p�â0+r{�{8��6�o�iij� �W�m�<8�<��_ ?�ms,�4��O-4�M�X;���9��ԭ���83H�Vh	�Lʌ.�X�K�I����F�y��E`a��;:c���̞+����i���ݍ]�#<����X�bP�9�:�a���#& f�����l>�EJ|'���~�6)�9����x"�a�?,l�NV厠g?�S�����ˆԯ
���iV2��+�����c�J�_|=���/LW��a�W-'�|iۚ(A�'
�?1�0o"�ji:��3K����¯��62W5=8��yt�|���(-�~��y�]ݝuH�4�(�W�M®V�;����t_Z�Im�׻�_;2�)yx�R��T��\N���aީ��,lM��W�D9��++�2
�<P���f?ͳ>,����ʞ�} [�`+������ME�>E
a،w�,̥��Smn�j�<�E�-LU�\\~�NPX�ѡ�E��	�M�Jئ#�)7?���ݛ�ᢃ�V��¢4'��I��7���]zc�~Q���Gi٢��d���t���#%d���͒-J�a�#�Pw&�m�M��Is��
�zU&R.7�l�״E���g?d^9;jY>�~i�޲�i1�iD�	\'��7��\:�Iy�Ǉ���w,���'��!=�(����a�Rł�ܧ�R|f4NF���u"��jb����;��,ֳ	�rz�d���͑`� ����H}u��{%P'k�6�X�V��ߵ-����-
I��&�ǌ��k!�]��x��<�Br��@^l�Q9QEh�0ۋ�r�lFSBTWU��;$J�FQ�yr��N�$������ ���iH�9�K¾�#���E��7�)����H7�s�V��.@���{jÑ�J*g�1���R�S�JCq��<vc0�� e���_�Β���i�����U)J����lݓ��e5W�+
ݤ�ZRԾvU�S��`Cŏ#r�C?�RP�tӕ7rl�Ⱥ��z]���>�h�f�HV�����9w&�:����r�<�?zm
s����j�cnO\PBX���n`��/�M�0 ]��3���� I���Xw���Ng���A�rvN���H�	Yu�����`����NA�;�h�9Zo1�1�M�-��$m��-�3�!�/�K
�2Ӧ��|Q	��.v0m�*|K�z��[�˃6YQۛ�5q ǄO���4[�h��^*]����stP~9�r� �U)ɅZ��l��X:
5u�YT�M��;.K��(� �y�f���L���-�s�N�7��G����ܙ� ��!u��/�f\�1�}��T	SDxq��Ľ
�~5����{����x���#`��i֚z��_��j7�!YyT�&���P�Vd�k�oGZ;�}hS�+�d:�:u�ʲ��n�
Փ�G�lp�.1gE�Z�x�����L1��ss��İ�yEk�` �����6wb�6Ǿ���0�wg�6�wS3��E�=���W�rG�?.��z�`
�P�&G	��{^����<g鈑c˳��=�b��G!��m�w=�Ŝ�:<�cT*=�El,��*)#TD]��w�� Ft��Q��'��i&�gJ�+��=_��a�I�V+��:gֳ�j�������}�ۊ�CV��$^����Vc_���0����3<����67��X[|�a���Ȍ�2�B҅,QC�*\6���i�?,��	�:��WG8
�%�]<�xat|^#s\(<��Z"��
y��ܮ�B+8׶�^V�SzX��{��dK냱4�qC�# �0��ŵ����ˁ�����ԃ�DgLfDWD� ����G��^��]��>�����r-}��:C�x�68r�~����u1��l��T�����0]OE�hw����6\ٛ�<�ٖO�u�Y����v���y�8p2t�o&�e֣�{�����*b%�U�$�v�o���r��f�]�=:���_���9��9��-6��uzj��a�R(�!����e0(�.��pU�����P5�Զ�a�^���K�d�a��e^o��v�y(_^�AHM%E�W�3�3=Cו�f?v
B�vz�h�{*���JP�]���?³���rŭYE�9(�n2�y��XR����L��T��GܔMg�(W��i��I6�֍�\OS��bU�ۏ4n�a��,gG��BմۏT����-�3�G@c�K���S��з ���:��O�BAF�O��Ǩ�ٖ4�=$q<�ǔ��h����גHU	7�)�+����Q�*�#��ι��,�nw*�?"zx]������'u.��ˀ8~ҧ�LoF��|���^�������'�j ���x�x��"2A���Z�;��v�78X��w4�!���V����i�O���(k$a���G���-O1�D'�ׂo�fiGI[D�7�W(���gzs�jA>zW�������j�>�r�J���f�Z��ڬ�ܶ`x�I>�Db��%#��Gt(*M�#���[��b��{x��%���:�9�m���`�i8[=ֆ��E�&�����9*�du��>��|�����mɜy���[\>̧�mG��n��or���i�D���'����x? <���A�Ы
�o�I�\Ι�:���S���j�z�l�"�o4Wx������,��Y�,:����~5�
��&�\�g[�I��������r¸��n�C��2�Dӂwv��}eR����@yZ@�# ��d����~�W�7���Q.>��r����U���c���vn���rB���t�@�4���ۥj��P�W`��Q!��̧��ϊ�1���4�1y�rR��qo}~�|z#pF�R�w��0�UgY���]��e䙐} ��U��?��mO��7�yR|y��B��c�^���w� �a��iת{D,�+���څO�y�3���FA�c��j>�ڭy�g�(�:&[f5wtĿ
%����z��z��,`h#d3(�
F}���s�ߗw�xO��av��STE�J>U����C�ʓ�l\�%�����:�U����{K��1���ST��<�j[MK$��s�.�S��y=�����6/����Q�j�'���^��ʍ��������# �ĳL�I)�ZCO
٫�E�<���ěՖ��B���}A��ם��A�e*��6��Si��(��S������.Y�&�{��k�.ZX5a��G�]Y$�h�eĝE�?���iػ�3����'L{��
x��F^#}h����J
��u�|xM`�����q+�������{!�F��_DT8�T��A������V��t��*�S�2�+<��b�J�$���v�(�g#��y�w`��5Y{�Ĉ!�}�.&����_�o'�������`�E����u����[Lw~�L�����m��q	�������H��y�J�<+;1#����������o����=1�Ӈ��FvV�FvOITe�?�?�[<%d!fyN�|�#������`ae"~�3�s:��H1�?�}��ǋV �s�X� �߶�Μ����9��|8���[3;�o���`=}��w� f�߶�>�I
��$&F���F�8��#/V�߶�N����N�{���>U���>���<e񟹀؉A�/2eg$�=��H+���W���������N�����`z�� f�����L&f��������lLll����t �����Ŀ�/"ى�#�H��g:�g�z�O���yQpf �s�"�sq�_���8�/���\��a�x�����Y���^�z.�"�%��%&�g�/%s<K�x!�������E$3���H���HV�����Ŀ����,�饠g`~������Rӳ �����1���,��� �gA�/1?b~)��Y�KA�ς�_
>�||)�,�%��ς�/�_
=�zz)�,�R�Y� г �KA,ςX^
by�R�Y�����,�� �gA/!���qf֗�X�����,��� �gA�/�>b})������R�3c��^
z
�K�0?��%P�����(���`~I�gz0���3*�_����/Q���
旨`~F3�KA�d`~I�g20�$�3�_�����/� |&�%��d �$���d >����g2 _��L�K2 �� |I�3�/� |&�%��d �$���d >����g2 _��L�K2 �� |I�3�/� |&�%��d��� �L�K2 �� |I�3�/� |&�%��d � �o���R�ϰ ���o3��鞋�L��f�C���d�C�s_B��K� ��|	�3T�/�|�
�%T��P��
�*��P>C�*�g� _B��K� ��|	�3T�/�|�
�%T��P��
�*��P>C�*�g� _B��K� ��|	�3T�/�|�
�%T��P��
�*�?h�3T�/�z�
�%T@�P��
�*��P=C��E$;���F>C�*�g��^B��K����z	�3T@/�z�
�%T@�P��
�*��P=C�*�g��^B�<�@/�*��P=C�*�g��^B��K����z	�3T@/�z�
��t�L�K���qz��3@/� z&�%@�d �$ó��zI�3@/� z&�%@�d �$���d =����g2�^��L�K2��� zI�3@/� z&�%@�d �$������� �l/�`�go�d`�*<�K�/kke�`d�� +$ h�l�{�������SRi#C3=+g
n�}O�{�=���C�w�����KG�{P�Z	���k�m�wS�7���w�:��O��"�����>$e<Q�rf%t{����Rn�q�f$�<� �x8�>�qg=$M(k����������mOq��5݈�mz�lL�1Ͻ+��Cĵ�rC�@���`�$���W��.̳L�+�;ҷ�h�F����(�G�:�v��z�~D�����a�}��G��⃔o�>.r�dޮ)�����ȗ�BʕG��Q��ƃ�s��2Gӄ�]r��RY�fo c�4��*Lh嗢�l%�׀�y��,�����b��Q�m�3���
�7Ut���>����X��?�r�C�����h���G]�G���9Ep	}�!�H�g��Od�I%�va�[$!"j�"3r-�c@�^�Xf����7��
vۨ@ª��D���̅+ER
OO��k�ydQ�ʽ�Z���b��dУ(����B�
�/Ø���
絢��*�/�̬�W:�!a�`N��_]b�E��]=��rGW���^x��{�xϽٿ hK]3��~�'nW�l�"�y�H�b_sv
�T���
�`:�Y�7���&�p���gnD���;x�NNW�����yv�^���E�1toh
�noUq}�twH�6��)��O���x� Y?o��0�D�.x�_��5��A~x�#�������H�Z$q�l�Qy�Tx�i+�7��C��]5x��T���wZ9�m�|~?.I�sp�����sfx�L,x7��4��6qi���)5��ڵ@�:���3��!FE�l<�ʾ/л�=[͒j�$�r�!̞���dـ�V
D�;(z�L���莴��98{��$YMa��R���T���`q����g�vg��ôf�L����S�|?�
�C*���0�����eF�D��s1KH�Plju���ȏ���"5d�O��[S�uf�F�i�K����1 �2�a��-���sK�xW�Q�:P�����-�N��[�� ��h��ȷ	t�ŕt�j	��{DNێc]t�T�
��T�5�Vo�u[¾4��K�*!@@�.�lXn�3M+�����#)�s%�s���ҵoG��宅ֻ�:^K	��;vM����(,t�ejٛ�\`��import type {Plugin} from "ajv"
import getDef from "../definitions/allRequired"

const allRequired: Plugin<undefined> = (ajv) => ajv.addKeyword(getDef())

export default allRequired
module.exports = allRequired
                                                                                                                                                                                                                                                                                                             �������@��(x7�y���j�5��R6�(�XG#�K%M�D�7�kt �~g"혵%'ۚA�I;��WLS����4��L�	hj>
�����yg�d"���q��=v={�#=��.
�(�W��� I}Q߶yQ;II&Չ<��/a��c�)�7�9nvcXU�I?83ǧ7s�:3�t��is)TУ�1P3�������o��>�n\��XH��kPo7�(����bq*�8Y
v!��A�Zeu�@[���<�
��R^�0�%�D�d���KĚ��ռ����(�Vl�_���ظ�w�p��6��}Y<�tH�e@]ݎ�0&0N|Qj���D�변R?YI����q㼴<-���l��{����-���28�b7��W��=�P�.*ӌ{&!	�?=_���t�]�h�q�d9;�z��ukt���|��~�ӈUv#웠-s{h��Z(��%rn�}ޒ��ҥ�
�{̃H�4�[�� u�@@����1�_�5?�z���P��\�|�Q�L��pP	F&�F�$�q�B�̑4��_N�2�O����Q?�E��cz/A�T����O�Y����<7�e��!�A�C���JYZ��#9�=������
��wŢ��3��z�*�⪪�Xd5��ۍ�hY]������Gh�E�r��-T/�x_���yk2<j��������W��j�.jC��6�L�#χs���t�RJ�*$hpg�̸edo}�ѷi��>��*�����(�ɫm��o^���_)Q�#�Zl��k�R.(y�;���f��'}í�>���g��Q�I��_��g��&f�
N=ܛ����+�=�ILa����ʰ�6��T!ӘV���"j+z�-`6YC"�����X��+�g��������Z��CHy�-x��������ßE�$�>ﱊLCۖ�� kh��~�`N���7�$�N�)^E�.Bj@���~�s`�U5:�����,M���v�.�R1�v��.&w�~��J�����S��O5��4x����9ﳔ�Gfv�덌�m�S8�jyuy�{|#W9��L뱞�[���R��j���l8!�q<�L�������^�H�H-'AS��_P����c���j��?�����Nl8cC��Z�5?�?�3�\x�B�_�ي>�W��k͞A�A����gg�����)13�������ӎ��G+[k=#
 �	�_�����{z!>Y(������2�ܾۙH���D��c�혿�h��O$N��D+��T��̜�{�%\����������*��V��������#��3F�i�����1��r��6.�������
4�H66�o�-� �8��?��_�?,�X�Je8��4�88��������� ]	B����/*�1$F�o�����[��.��
���ݼ��Q�b��䴇��`	����n,N `��a��59���#ɦ
k��nIO�-�������t����]��8P�]�B�b�������>��v�y�}��q!���������C����Rc�U����6J�s
*�|�l���`���O��~��|�;e(j��c��ts��a���T9M�ȷC���E�&��'Wh��5���M�i]_�M1��c�X��C��,����}��@�M�@D�oQ�
��up���3�
�H��y�Nh�-�#��(��.��S�����d�G�=�g�������;��߃�j,kZM{e�&�0�Rܖ��\e�A�Fƍf���Cd�N�Ls��A����,W��lXn�&��Nb bC�V�VA� p�7d4vq����4A��ɗw����� xj� �F%��E�8�<ʉ"�yRW��QY�e�V�ORo5~�9�#KKN�,Y���*��C&����?�־�� /=��b��zg#^ݾ�Y�{jWTs��^�9VN�cT?�jw>]҃��C�J���/�:�d!���Lyn�Ƃ�ꖮ��pt������i&Om��q��1�S��Ba�IE���&���BM�ae�MR.��a3V.�Q��'��ɨ����>���3I`��i����P�"�lX�ɻ�Ĕ���]T������=�����Hc��78��P��~n��2�U�}��_\0�K��c�v�)(�b�ػE8��i����<j��@|ļG��u@��b��������]���a�2���@��w�~���z��#�k�� [PD*6Nf5$�X���7�<��
���f�a�,:�t�[�t��=J�����G�r��d��ܑ�lߠ\���>�\���+X��(Q�SV��Ÿ�SΚ d6w��8�T���:M����MJ�C��	O�vJ�Z%_"?��c>��[�܆�
�Ξ�oZ�Uae��x�i��KU����_��?=�b����M�Z��Ȓ"�k�S�!R%�: ��#�G[�����ƦI�m	J�cZI �1v������z��%��:�m �@�zF@�
���q�j�c+%���)_Љf����8���+̻��!}om���|Sorѡݑ7�s��a��]?oڢ�ձ����S�>�E�%��&�3�;��߱����]���������x�ˡdi1i��Y�G�DLd��j�Ł	Ҵ?�T�
'_K�!M�q��cx$ԍphw�g��yC�W�@��w��.�+cg
!��5���0h�J�bnDE�1��Z�v�g�Ɛ� �4ϥ;�%���u{����1���o����}p��������
Ц
�:�������r�s)��KT���7���h�W�-P�C~ p��!Y����qp��$(��b���h`92���S7@������/HV��K�m3x��L(�bD����� k��`�%�
�cJw�C���T�J}{[�օc�]�ߦ��K���)Y$�"���N��w����˻XO��Wu���.HZ<�Ww�Tɇ�A�0,u�K�L�<�<|�(w�o�ٖ&+'��}.w�`y��i̢l��8�#��1{�~<����Hzc�T���v�Yo���C��� y5my[���X����?�L�aq�A^�4.�Y�/^42�#Jg\��z}#eD<ޑ:�-��'��|\�ɋ�5�,�mkѸ�>ܛ�q!ҋ۠ݟ��u�_$���U�M^ʃ��ҧjᒀv��u���~Rb���잜L�]�=���-��L���,��s��Izȹu�*��(9'�;W^W�.ǘ�%��xˬK{�t�����H��E_�-\�ٔ�>υ,����xf��is�����!��q�@�-y�o�
���![�4���C��Ҡw�XN��:f���߱�8��������Ϩ�8���̓	������DU\�n��o$�*�U�砡�����X\;p�'�o�r��*�+9)�οB��_S����/��ߊ�ʝ�Nܦ�|�,�a����a�[��s���d��w���g���}��P��b>:��Β:hK���_v�0��?�$����?�eoA��C@��L�c~Dx�q��u���z� ��������ϖ�to�&GM�Y>�*YN���i��"E֐(�M����R�{K��/t��E(�zq���>���	���ZU�yCU���>������<M܇��\4���
��<��;jW��3F1��aV,�7�0�tQ�%�v�n#�o����%�>*u����I��
�^7~I"�	8P;�e���ݻN�*����c��SDYf(��鮮dbP֪�� 
?�'�6,,�a@F�W���u��q`��
����Tw��4B��͍P�3rM{�2DW��zA�W���p���&��TX��
��w������[^�?<
�$x΃x�͏d���<Z�
�U��G>&�W�L 
;� JzS�	Tbκ�@b�3���I�>$gkG���� ��7(.]����{t(�Î���u��Y�aKf�p�K`upTy�O��j�f�����.����N/�0���˚���{�z!��}�t�T#�6�w�G��>q;��B?rpT�?�EO��9<�ְ��g`�{ڞ)>��Ed���܃�
L�%�Rg�^��W�w�K7�>]��p뎡�M߅
V����$SV�K��f�q�_4��R����Ac�R)�f+���=�e(����;���J��̩�Oj��~3ɛ۝Ov�L03��6t� ��F
�&��t���R6V�Ms��i2v�ߤ!��S�`���4�	h�����j���N������Jw�㘡m�u�Dс=��`��2�@���G���)1��+�$n�Vݶ�lʪ�VA�_�.MC,B'�:(�s'����`��&j�YS[)�##=\�� �;�E���x���k��iS/b�o��J��n����Te(�	��2�h�VBl��E�z0��
ҵ͠i;z��x��l�ܸ)���y/sB�~(���+�L5vhч(_Lqn
J�Aw��F�j�l��~�B=_ٌ��%
��8R�T��_ 0h)VW��o;�EvX��dHߓ�l�v �Mt=O�c�S��9O:��|�?BgV}"(a+=Ä����b��E+��D��:�ú���1��n�e��5�O������<;S�o �y`������c�|�DQw�f8��#�.$�
����uXE���&5:W�%�
�����*�i[h�2g�x���=x9G������Ȯ����b�)���%\�z�/b$�}&ƒ��U�@f�!� /yƐ�Q#���
*������Pw�X*�3�������L�ɼ��Pó SP;Z�* ���T�wؾ5��N�֑�-C�0[��W`�[�4U���&�GOD"���n�!��4)<��˹�=��po��9IR���}���3��?�� 8���)�j�������S��P0���q�ǔ�0Ӝ�xI0��Sy���M��6a��A�gA�_9��襄�̐*�B;�QC��!A�)��	��hbzw����fu�CU~x٢�"Y���[�����c�,�rR�6��eH<�7���3�{;w��p�y��,O``��O�=�O��"�\p󱦢��BY���i�#�lMٱ�o�%�醯C�,%�52�>U�m}�`�0��6�&(�W&W�6|� Ԫ���b�e:�vQ�:���Az��Ԛ����/���"/w�0��D9��	�je)ϋ�i��)���{;3�_k�ܕ~���į�+W
�,,~_�_:�1b�Vm\G�4���##)R�v
˴,*I8'b�|�-{�Vr0�u�W,�˴S6gH- ��M(�F-3����|�.�A}���-}�@(+r�5�0�uV,�g-*9!*��\���+S��2�-�d����h�iz����ڨ��"ν��"���W~D��J��d58C���6bQ=B́�c�F�:��b�"g����M�	����b(;~�{t�j�e�x���РXj�$��a�[b��Ҭ�=?ۄX���&>��8H_�7�Ê�q�kp�Ķ�2��w_����&�������0�Ţ��2D(֏�$k��"�Il�� � 8����(�4�(&�#e�QugW�N5���`"�ܚ�~>1���\�$۟0w0IN���TJ�K�nZO��H�V���T"�W
~K,O�{�3/dO0(�E�u�?�����'e��>�N�S�l��]f+�:�=E.`���X	�z�����=���hDऎ��Iͬѭ��V%o�^���p�����,��6�e�m���Y��ʞ�{̚�H�[�3��n�%d���OjY��#t�Nc$m��g�~fC�wl����X"U`�(��g�T���彄��kݺ����<���H�Z�~Ğ��G�D\n�bt}Ɲ'��;n�/�3����n�?a>�1�|��l�K����ԇ��w|�L��z���?\~�Hތ���(��Y%8� �_��
���~|�|���	S�1��o��1�����l��_�p}��c	��۱�����{�w���������OP�4H�;`˵���N��Jw����@����O��_��e�;.^����e���|�?�La� 3�� $�҄~
��� ��>��7  x���i=���W���}e�K�Wv��S���mj>��r6R��O?�)�M�A�c9� �z����H��&��R{�������bl�p�����
>SFB�|�74�:g$�m��L��~s����>XΦ=E�XɎ��s ��6�
��{1wA�|���D;=���_�XO���@��V����C�8����.c�[�qB��Y���I�>j�F�
�D���uF��c�
aѢ��$�i��q��ʗa��݁OI5S��.�G��ճ���Yaa����<f�#�i�R�-�`k.vi��$�F0�Rs�H�-���eGj�)��~ٗ�yǸ�=��݉�������ݜˍ�S����c7��$�*��^�Q��{�uZ*ѱe��r��*t`�v��A�\����J�0�TƔ���YyY$�Fv�E@LQϒ\l�S���om� ��\D=�M/���Y�,p~���*�@Cx���/%jz�Q��La�*�)��b�B�*A�6
�3�f�=�?�n�}��1j߼7�нb����	Ds$ƌu�h�g�T.�d#ى��7_ȸ
��t��x�������Z1�L���f�;۹�1�
JD2P5�pP�IŞ��� GU˵��[3+��N5�P���;�Ob4���ڮd��ikf�#1���=�X�k��"�E�ͧ}�CSxA7x�x��0B6� 9���0���T��?
�6�x
*<�yx��R���p`D�;�
�C���o�I�p�&�I]E6-�l���&�?)�d�K���pw`�lԛ4ZǸD��r0�x�gg���Ӫ�G��]�|�Z�;0>>�2\f�M��^�B��u�d�~8���]�ǱoΘM��tV۹��r2���XQb��W��Ug�(�.t����^�GJ�5[��՟b�_j�2�s���ݱ��O_������p)�� =R���&�*��a� TJ���Mpw��BI�bN#*K:-B��W )(�O!�e+����?$?~�����f�f\~��#�ҚX��4MZ�ubz��[��
�1<�/�Cu�$"�E�-�%w*�ޥ�D���S6���A��E��RY6�24�ԭ�F�(s�<��SÎ#�7��Q�͇3�x��i�+*JI���z�Hx��ǉ��c��2h�|���s���?m����;6/�ŀ��y9��r����W�Wк�t�dl���e���6~�oT�dQ�$w������P��Z�#���J��A��P��?=������ĵ��8����dw��s�l���Md	�ˆ�}�4�
4�,z�5j��3<�D1��9N�̝߂�=Χ�^�W�}�ME�@���`J�2� [F+��������.���ޘŅ���U�/F��K���N�fq5��_�D>���Q�Gi�R� �)&������}�ELfhƾ4�|F�,��ܭ"��T>�Z|E��@�?O�a���~���P�θ
:��g&�V �I��P�Si�Z���4���fp*~�"�9dA�~�+�(�.,"z���:�_�@��՛" r@��X=�FS�+���a��7�I�,p��Z[I����o2��~h�$�+*���}"{����cN�<6!z1!U1�RWQb.�TKQkg!j�hl_<�b�M�:zK�%��p�-��?��.uk���lL�!�p����
�2���/�VA펁��˄R�F�Ȁ��N��W��]�
��X�o� �y|�5}�Rb3ZU�B�	���L���>��hc}����/��ݯ���ce�\膑 ���r�ڎAA�r��Z�I�!�dVt���?A񿀒I�v8���Ny��FhYp��>��W#^��ü\"y���mX�QH�1��L�o�0�n&��r%�)�tmC���9��E ������l�
�|:T}�Y�TO�!�W�|t������&��1��.�m��
Ty� �d�M�h�z�/k_���'��Y���V�q��-����IJy<�ʵ�x�C��� #���S|�K}:�����%�+���@223�O�1���eK�كQ���F�E�}�o�&]�܂�[0�[�oYV�w
⓰�j�SW������!,(u�q�_W^>��������?6/|����_Y�ՖW	� PW;� D<�U5{�u�$/��/u�,r"�����������.�؄�����