import type { TranslationBundle } from '../../UNSAFE_Environment';
/**
 * useTranslationBundle is a hook to get a translation bundle from the EnvironmentProvider
 * @param bundleId
 * @returns a translation bundle of type T
 */
export declare function useTranslationBundle<T extends TranslationBundle>(bundleId: string): T;
