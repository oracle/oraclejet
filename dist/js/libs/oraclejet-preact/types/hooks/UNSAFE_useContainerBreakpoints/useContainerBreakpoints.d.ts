import { Breakpoints } from '../UNSAFE_useBreakpoints';
export declare function useContainerBreakpoints(breakpoints?: Breakpoints): {
    breakpointMatches: Record<string, boolean>;
    ref: (node: HTMLElement) => void;
};
