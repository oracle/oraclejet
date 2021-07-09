export let FRAMEWORK_QUERY_KEY: {
    HIGH_RESOLUTION: FrameworkQueryKey;
    LG_DOWN: FrameworkQueryKey;
    LG_ONLY: FrameworkQueryKey;
    LG_UP: FrameworkQueryKey;
    MD_DOWN: FrameworkQueryKey;
    MD_ONLY: FrameworkQueryKey;
    MD_UP: FrameworkQueryKey;
    SM_ONLY: FrameworkQueryKey;
    SM_UP: FrameworkQueryKey;
    XL_DOWN: FrameworkQueryKey;
    XL_ONLY: FrameworkQueryKey;
    XL_UP: FrameworkQueryKey;
    XXL_UP: FrameworkQueryKey;
};
export let SCREEN_RANGE: {
    LG: ScreenRange;
    MD: ScreenRange;
    SM: ScreenRange;
    XL: ScreenRange;
    XXL: ScreenRange;
};
export function compare(size1: ScreenRange, size2: ScreenRange): number;
export function getFrameworkQuery(frameworkQueryKey: FrameworkQueryKey): string | null;
// tslint:disable-next-line interface-over-type-literal
export type FrameworkQueryKey = 'sm-up' | 'md-up' | 'lg-up' | 'xl-up' | 'xxl-up' | 'sm-only' | 'md-only' | 'lg-only' | 'xl-only' | 'md-down' | 'lg-down' | 'xl-down' | 'high-resolution';
// tslint:disable-next-line interface-over-type-literal
export type ScreenRange = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
