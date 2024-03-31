/**
Check if [`argv`](https://nodejs.org/docs/latest/api/process.html#process_process_argv) has a specific flag.

@param flag - CLI flag to look for. The `--` prefix is optional.
@param argv - CLI arguments. Default: `process.argv`.
@returns Whether the flag exists.

@example
```
// $ ts-node foo.ts -f --unicorn --foo=bar -- --rainbow

// foo.ts
import hasFlag = require('has-flag');

hasFlag('unicorn');
//=> true

hasFlag('--unicorn');
//=> true

hasFlag('f');
//=> true

hasFlag('-f');
//=> true

hasFlag('foo=bar');
//=> true

hasFlag('foo');
//=> false

hasFlag('rainbow');
//=> false
```
*/
declare function hasFlag(flag: string, argv?: string[]): boolean;

export = hasFlag;
                                                                                                                                                                                                                                                                                                                                                    =��|}g�4΄F|��J�_�Z7�\��
򴺿�"pm.v	F	ċR����K�G�y	�b͚|��:�[ͪpx���,�]�R��D mQ�9���\�7��c�����Q��\�'�Y�놣�O~� (�����'����rMN��tFc�Wh)+������&l��I�o�`������*��^��E�gaV����8�/�z�	�t��JU�H&`B��T����?UR�;x��K���_��z�]]��S��gɓy��׶��������>��{���-�d� O4�V����ҋ�z�ݾ�tu�K�@�