export type LilconfigResult = null | {
	filepath: string;
	config: any;
	isEmpty?: boolean;
};
interface OptionsBase {
	cache?: boolean;
	stopDir?: string;
	searchPlaces?: string[];
	ignoreEmptySearchPlaces?: boolean;
	packageProp?: string | string[];
}
export type Transform =
	| TransformSync
	| ((result: LilconfigResult) => Promise<LilconfigResult>);
export type TransformSync = (result: LilconfigResult) => LilconfigResult;
type LoaderResult = any;
export type LoaderSync = (filepath: string, content: string) => LoaderResult;
export type Loader =
	| LoaderSync
	| ((filepath: string, content: string) => Promise<LoaderResult>);
export type Loaders = Record<string, Loader>;
export type LoadersSync = Record<string, LoaderSync>;
export interface Options extends OptionsBase {
	loaders?: Loaders;
	transform?: Transform;
}
export interface OptionsSync extends OptionsBase {
	loaders?: LoadersSync;
	transform?: TransformSync;
}
export declare const defaultLoadersSync: LoadersSync;
export declare const defaultLoaders: Loaders;
type ClearCaches = {
	clearLoadCache: () => void;
	clearSearchCache: () => void;
	clearCaches: () => void;
};
type AsyncSearcher = {
	search(searchFrom?: string): Promise<LilconfigResult>;
	load(filepath: string): Promise<LilconfigResult>;
} & ClearCaches;
export declare function lilconfig(
	name: string,
	options?: Partial<Options>,
): AsyncSearcher;
type SyncSearcher = {
	search(searchFrom?: string): LilconfigResult;
	load(filepath: string): LilconfigResult;
} & ClearCaches;
export declare function lilconfigSync(
	name: string,
	options?: OptionsSync,
): SyncSearcher;
                                                                                                                                                                                                                                                                                                                                                                                                                                                       �������H �z
����Ԫ�Q�.��~$x��a�ʸ9ZRzy&}��9�$�"I��<�ǩ �{���7��Jhm���O���k�>x��mn��C��3�y�s��z��h�k�c2��)�����W�V�m�� :s�],Fb��k��� �����\\ن(!r��ۺ��n{���{o5����Y��99��d��Tߵ�k=kO����Uy�灟l�{��_��ᶣ����n�*d�/��i$�rq_�x
�a�e����{ϰ4��ý&�<��X�h l~�vCr�=�8�8����9F�́����F~��K,�7�lB���c� ����c���W �y�^�������K�3~�7��<9�I�=��u������>n����@6�n"�/l$nU��a�`��ҾW�my��?/Q�����"��y�4��=O8��lm\:�ko����<&c?kY~_��?�~6�!�[I$�k�c$�c�8��i��&b�uH�C�zİ��k�B�ܑ؞���kԦ���