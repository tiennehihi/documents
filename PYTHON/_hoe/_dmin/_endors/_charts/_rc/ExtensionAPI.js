import { Node, Element, NodeWithChildren } from "domhandler";
/**
 * Get a node's children.
 *
 * @param elem Node to get the children of.
 * @returns `elem`'s children, or an empty array.
 */
export declare function getChildren(elem: Node): Node[];
export declare function getParent(elem: Element): Element | null;
export declare function getParent(elem: Node): NodeWithChildren | null;
/**
 * Gets an elements siblings, including the element itself.
 *
 * Attempts to get the children through the element