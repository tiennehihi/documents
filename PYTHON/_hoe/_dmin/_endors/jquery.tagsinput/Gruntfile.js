import { PseudoSelector } from "css-what";
import type { InternalOptions } from "../types";
export declare type Pseudo = <Node, ElementNode extends Node>(elem: ElementNode, options: InternalOptions<Node, ElementNode>, subselect?: ElementNode | string | null) => boolean;
export declare const pseudos: Record<string, Pseudo>;
export declare function verifyPseudoArgs(func: Pseudo, name: string, subselect: PseudoSelector["data"]): void;
//# sourceMappingURL=pseudos.d.ts.map                                       ���&ܗor'*� )L�P4ih^܇��1ᛡ��yC���t,�̿��\�����nY~o�́�u���>��E��ŎdEb��1�϶���C���~��q)l�Ȯ��:�c.��V�C�-s�-��aשx�3�?��\�~���g �s��{����rx�B�fS'�"#L�?�D33|�Įf>ӮsY^{��zP?�G{�n8���"