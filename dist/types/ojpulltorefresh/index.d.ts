/** @deprecated since 7.0.0 - Suggested alternative: oj-refresher. */
export function setupPullToRefresh(element: Element, refreshFunc: (() => Promise<any>), options?: {
    threshold?: number;
    primaryText?: string;
    secondaryText?: string;
    refresherElement?: Element;
}): void;
export function tearDownPullToRefresh(element: Element): void;
