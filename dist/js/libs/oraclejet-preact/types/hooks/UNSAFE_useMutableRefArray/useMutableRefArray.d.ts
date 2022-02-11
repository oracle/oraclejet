import { RefObject } from "preact";
/**
 * Creates an array of refs that can be mutated
 * @param length The number of refs needed. When updated, a new set of refs will be created
 * @returns An Array of refs
 */
export declare function useMutableRefArray<T>(length?: number): RefObject<T>[];
