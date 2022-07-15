export declare type HoverOptions = {
    isDisabled?: boolean;
};
/**
 * Returns listeners and status for hover
 * If only visual changes are required, :hover is faster.
 *
 * @returns
 */
export declare function useHover(settings?: HoverOptions): {
    isHover: boolean;
    hoverProps: Record<string, any>;
};
