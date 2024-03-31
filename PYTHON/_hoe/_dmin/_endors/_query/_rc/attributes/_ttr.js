import * as mozilla from 'source-map';

/**
 * @param plugins Can also be included with the Processor#use method.
 * @returns A processor that will apply plugins as CSS processors.
 */
declare function postcss(plugins?: postcss.AcceptedPlugin[]): postcss.Processor;
declare function postcss(...plugins: postcss.AcceptedPlugin[]): postcss.Processor;
declare namespace postcss {
  type AcceptedPlugin = Plugin<any> | Transformer | {
    postcss: TransformCallback | Processor;
  } | Processor;
  /**
   * Creates a PostCSS plugin with a standard API.
   * @param name Plugin name. Same as in name property in package.json. It will
   * be saved in plugin.postcssPlugin property.
   * @param initializer Will receive plugin options and should return functions
   * to modify nodes in input CSS.
   */
  function plugin<T>(name: string, initializer: PluginInitializer<T>): Plugin<T>;
  interface Plugin<T> extends Transformer {
    (opts?: T): Transformer;
    postcss: Transformer;
    process: (css: string | {
      toString(): string;
    } | Result, processOpts?: ProcessOptions, pluginOpts?: T) => LazyResult;
  }
  interface Transformer extends TransformCallback {
    postcssPlugin?: string;
    postcssVersion?: string;
  }
  interface TransformCallback {
    /**
     * @returns A Promise that resolves when all work is complete. May return
     * synchronously, but that style of plugin is only meant for debugging and
     * development. In either case, the resolved or returned value is not used -
     * the "result" is the output.
     */
    (root: Root, result: Result): Promise<any> | any;
  }
  interface PluginInitializer<T> {
    (pluginOptions?: T): Transformer;
  }
  /**
   * Contains helpers for working with vendor prefixes.
   */
  export namespace vendor {
    /**
     * @returns The vendor prefix extracted from the input string.
     */
    function prefix(prop: string): string;
    /**
     * @returns The input string stripped of its vendor prefix.
     */
    function unprefixed(prop: string): string;
  }
  type ParserInput = string | { toString(): string };
  interface Parser {
    (css: ParserInput, opts?: Pick<ProcessOptions, 'map' | 'from'>): Root;
  }
  interface Builder {
    (part: string, node?: Node, type?: 'start' | 'end'): void;
  }
  interface Stringifier {
    (node: Node, builder: Builder): void;
  }
  /**
   * Default function to convert a node tree into a CSS string.
   */
  const stringify: Stringifier;
  /**
   * Parses source CSS.
   * @param css The CSS to parse.
   * @param options
   * @returns {} A new Root node, which contains the source CSS nodes.
   */
  const parse: Parser;
  /**
   * Contains helpers for safely splitting lists of CSS values, preserving
   * parentheses and quotes.
   */
  export namespace list {
    /**
     * Safely splits space-separated values (such as those for background,
     * border-radius and other shorthand properties).
     */
    function space(str: string): string[];
    /**
     * Safely splits comma-separated values (such as those for transition-* and
     * background  properties).
     */
    function comma(str: string): string[];
  }
  /**
   * Creates a new Comment node.
   * @param defaults Properties for the new Comment node.
   * @retu