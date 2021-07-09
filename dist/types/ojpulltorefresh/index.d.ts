export function setupPullToRefresh(element: Element, refreshFunc: (() => Promise<any>), options?: {
    threshold?: number;
    primaryText?: string;
    secondaryText?: string;
    refresherElement?: Element;
}): void;
export function tearDownPullToRefresh(element: Element): void;
