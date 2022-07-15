export declare type ActiveOptions = {
    isDisabled?: boolean;
};
/**
 * Returns properties to manage active state indication
 * @returns
 */
export declare function useActive(settings?: ActiveOptions): {
    isActive: boolean;
    activeProps: Record<string, any>;
};
