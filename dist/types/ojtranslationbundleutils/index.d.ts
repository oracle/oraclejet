type Loader = (locale: string | null) => Promise<any>;
export declare const registerTranslationBundleLoaders: (bundles: Record<string, Loader>) => void;
export declare const getTranslationBundlePromise: (bundleId: string) => Promise<any>;
export declare const loadAllPendingBundles: () => Promise<any[]>;
export declare const matchTranslationBundle: (locale: string, supportedLocales: Set<string>) => string;
export {};