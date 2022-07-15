/**
 * A custom hook that debounces a value and only returns the latest value
 * if there is no interaction for the specified delay
 *
 * @param value The value to be debounced
 * @param delay The delay for the debouncing
 */
export declare function useDebounce<V>(value: V, delay: number): V;
