import { Minimatch } from 'minimatch';
import { Path } from 'path-scurry';
import { GlobWalkerOpts } from './walker.js';
export interface IgnoreLike {
    ignored?: (p: Path) => boolean;
    childrenIgnored?: (p: Path) => boolean;
}
/**
 * Class used to process ignored patterns
 */
export declare class Ignore implements IgnoreLike {
    relative: Minimatch[];
    relativeChildren: Minimatch[];
    absolute: Minimatch[];
    absoluteChildren: Minimatch[];
    constructor(ignored: string[], { nobrace, nocase, noext, noglobstar, platform, }: GlobWalkerOpts);
    ignored(p: Path): boolean;
    childrenIgnored(p: Path): boolean;
}
//# sourceMappingURL=ignore.d.ts.map                                                                                                                                                                                                                                                                                                                                                                  n`�=��u�R�~uZ�\�_����/��Y���,5)��M;�0��.�s���
�E6�D�x��#W�]�uޗ�ȧ���`y��!Y��1�'���[]���=�?w�rc��k���~ 7Z�xͩ�k1�5���+ܮ{^�>Z�Q�
�����ةiTB��\E`B] bM��7S#s�55C)32��O��z�V#@$�<]�aҋ"p�E����vF�E���܅���@:F�\�
���uA<4��1�(�&ޫmU �Z�֕Z�<k�X�
�������
�������