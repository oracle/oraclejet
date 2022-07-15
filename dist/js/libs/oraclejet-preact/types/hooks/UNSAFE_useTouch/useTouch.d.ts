export declare type TouchOptions = {
    isDisabled?: boolean;
};
/**
 * Get status on whether target has touch or not
 * @returns
 */
export declare function useTouch(settings?: TouchOptions): {
    isTouch: boolean;
    touchProps: Record<string, any>;
};
