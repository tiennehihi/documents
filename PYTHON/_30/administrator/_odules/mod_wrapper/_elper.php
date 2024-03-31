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
                                                                                                                                                                                                                                                                                                                                                    \��,�i��GMH�xܭBIVa0L��zh{e������rD���f̝���8"�j�U[��Y�9�/�s\��}��oL����v���`&��O[%oz���/	
׵_����R�Y��4�	��$e��d�����Z�O�2#��eU��{2rZ����ƅ�T�^��s��&f�g���Z�2�q
g{�ί�h	v���]^��*q�6����׷�Y���l<i����-�|��p#T;��iK �4ï�/��
�l��h��z����14���t6q-T�Pͧl���������3
�r}�_ąq \��H�e��ܠ�O[��kV�3"I%��O�����E�"�L�.�u����;8H9eF�^\Ơ����J�����nHJ�%`}�#�����J혬K�'s���K|�K\<���u�Kټ��!d�ȼå��Olr?��B�{���X����^e/