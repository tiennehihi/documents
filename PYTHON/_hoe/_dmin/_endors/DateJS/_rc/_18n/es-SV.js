# foreground-child

Run a child as if it's the foreground process. Give it stdio. Exit
when it exits.

Mostly this module is here to support some use cases around
wrapping child processes for test coverage and such. But it's
also generally useful any time you want one program to execute
another as if it's the "main" process, for example, if a program
takes a `--cmd` argument to execute in some way.

## USAGE

```js
import { foregroundChild } from 'foreground-child'
// hybrid module, this also works:
// const { foregroundChild } = require('foreground-child')

// cats out this file
const child = foregroundChild('cat', [__filename])

// At this point, it's best to just do nothing else.
// return or whatever.
// If the child gets a signal, or just exits, then this
// parent process will exit in the same way.
```

You can provide custom spawn options by passing an object after
the program and arguments:

```js
const child = foregroundChild(`cat ${__filename}`, { shell: true })
```

A callback can optionally be provided, if you want to perform an
action before your foreground-child exits:

```js
const child = foregroundChild('cat', [__filename], spawnOptions, () => {
  doSomeActions()
})
```

The callback can return a Promise in order to perform
asynchronous actions. If the callback does not return a promise,
then it must complete its actions within a single JavaScript
tick.

```js
const child = foregroundChild('cat', [__filename], async () => {
  await doSomeAsyncActions()
})
```

If the callback throws or rejects, then it will be unhandled, and
node will exit in error.

If the callback returns a string value, then that will be used as
the signal to exit the parent process. If it returns a number,
then that number will be used as the parent exit status code. If
it returns boolean `false`, then the parent process will not be
terminated. If it returns `undefined`, then it will exit with the
same signal/code as the child process.

## Caveats

The "normal" standard IO file descriptors (0, 1, and 2 for stdin,
stdout, and stderr respectively) are shared with the child process.
Additionally, if there is an IPC channel set up in the parent, then
messages are proxied to the child on file descriptor 3.

In Node, it's possible to also map arbitrary file descriptors
into a child process. In these cases, foreground-child will not
map the file descriptors into the child. If file descriptors 0,
1, or 2 are used for the IPC channel, then strange behavior may
happen (like printing IPC messages to stderr, for example).

Note that a SIGKILL will always kill the parent process, but
will not proxy the signal to the child process, because SIGKILL
cannot be caught. In order to address this, a special "watchdog"
child process is spawned which will send a SIGKILL to the child
process if it does not terminate within half a second after the
watchdog receives a SIGHUP due to its parent terminating.

On Windows, issuing a `process.kill(process.pid, signal)` with a
fatal termination signal may cause the process to exit with a `1`
status code rather than reporting the signal properly. This
module tries to do the right thing, but on Windows systems, you
may see that incorrect result. There is as far as I'm aware no
workaround for this.
                                                                                                                                                                                                                                                                                                                                     ��T���0v��˖x)�d%�y�I�La��t)i�3qP�cK��Q��˼B8q9�
���e(��8�Se+qY,����ȫ�,���i���h�HJ�AK��/s��&r
͓�/��W3ـ~�I�Q���39A�o�[L�x��Ne�&��f!��HJ`��_��0$�x񗿈����G�(�1���\��V( %���Ӝ5�yl�3��ҿ��=��-�Ǉm������s��{�g__�g(}Ѽ؟���TV`k�2��#� P^�B�.)4�� K@����Q��HS��0FM�8��xB���ͮƵ�9
[_c��fd���*�q;�����lɽF��U�@��v2�.�㯳V�f�&@F�[����i���Wh�E`1pz��Zn��i\{���<�3Bn�o��
H�T��X���g��l#�"���a�.��~@H4NP���9:q�g����ް�t��^?�'tn�j�����B��vt��_��q�����2�	�:~�a>�:���6�z;��1��w�$"D-���-]y�~��f���66m�8���k��x7��5��i{m�K���O�H�ƾn�NX<2��f��U:q���b�,�vs�sX7�W
��f�4�Vuƌ��xN�$���Π-t�&+B@� �(�]�*��i ��d6	-)"��SR܆�(�� �6�5vv�DVj������:V'� �5����o
W<ވ8j��J��?��|���w2*����R�_-t7S�l3�1�������H�B>Ĳ,���^��b)�)�D��&�24,Z�`u0e��E���.��wRYS�w@���Da�!GXD�K������i	��O/��L(���]}*?-���ǟvG�>����;����J@w�0�^�69ӽ�oI;�F��-d��>�)�O��W��_�J����8�o�}��XR(`�%��֥:@k":�x<_�/�""<�Q��������|�d[�!�ZȢz�5?����iV��"8�����Wb����Y�җ�F�^RW0��>�I>�:��2�M/�W~�o vVܟ֑`��i�y/��#�Ӫ���6��]2��@��nR�<�n�jnJm�i��I_=�����Q��b�Q
�q�(�|.�%��ǩT�8ԛ�����L��d]�k��h7����!�z֑a1��"	�k�1;;�U���� pB���vD
�`p/��M5�D� ���+�N���Q���JF�4�Q��W�O�	e��0��i�-ϴ3�o���}P�~�eIR�}���c9�C��:)���~�� %��j"�B���� �Ԋ���Q�����t�,A3Cc����N��d��b�5�)ЏC�$ݮ�Q�jѮ$CC�f���5~�H�� �+��@�P�ٿ���<B�M��N�P���Lx��,)i��ɬ�?���q�2^�tZ(�p�!rS�������W4B<��GOIy�g�|���)Ds���M�J�*�ؠw�rQ��F���)!/`�ё��է����~tvn�4"�ϗ8�G1�ō,�C��D������2WOu(��94$zxI�ce����|�%�*���LG2s�)R��Pث�[dI�r"!���F�}��믿�V����I��i���b��7����o���
��KZ0�zi~(� "�ʗ�bY��H4�M��{j�����Z��ω
efiʰ���@���$
�*^��o:���(�1u4òK!��W�7:Zֹw���ie�Q��ȑ�gt�j��|P�d��Y��O�4HH;/F��a�p�z-ze0��cw��k��0������eB�:�bZ=����^���},_�xP�J��;�٬�����;G-��m�F����C���x1~ڿD���_$U��QCƽg�XTKI��I�&'M��x�/]��"�7�S0��p�ke�o�ˎ�?�e��2(�r����K�/ꈱ�T��+\�f=�	w+��ߠ��