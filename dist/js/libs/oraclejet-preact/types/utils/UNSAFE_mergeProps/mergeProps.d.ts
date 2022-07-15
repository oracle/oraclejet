/**
 * @license
 * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
/**
 * Merges allProps together:
 *  - duplicate className and class allProps concatenated
 *  - duplicate style allProps merged - note that only style objects supported at this point
 *  - duplicate functions chained
 * @param allProps Props to merge together.
 */
export declare function mergeProps<T extends {}[]>(...allProps: T): {
    [K in keyof UnionToIntersection<T[number]>]: K extends 'class' ? string : K extends 'style' ? UnionToIntersection<T[number]>[K] : Exclude<Extract<T[number], {
        [Q in K]: unknown;
    }>[K], undefined>;
};
export {};
