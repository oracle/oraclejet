import { defaultBreakpoints, Breakpoints } from '../UNSAFE_useBreakpoints';
declare type DefaultBreakpoints = keyof typeof defaultBreakpoints;
declare type DefaultType<T> = Record<DefaultBreakpoints, T>;
declare type Responsive<V> = Partial<DefaultType<V>>;
export declare function useContainerBreakpointValues<V>(breakpointValues: Responsive<V>, breakpoints?: Breakpoints): {
    breakpoint: V;
    ref: (node: HTMLElement) => void;
};
export {};
