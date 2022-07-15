import { Breakpoints, defaultBreakpoints } from '../UNSAFE_useBreakpoints';
declare type DefaultBreakpoints = keyof typeof defaultBreakpoints;
declare type DefaultType<T> = Record<DefaultBreakpoints, T>;
declare type Responsive<V> = Partial<DefaultType<V>>;
export declare function useBreakpointValues<V>(breakpointValues: Responsive<V>, breakpoints?: Breakpoints): V;
export {};
