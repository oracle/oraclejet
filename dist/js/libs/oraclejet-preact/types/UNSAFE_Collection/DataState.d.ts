/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Metadata } from './Collection.types';
/**
 * Type to represent a range with a specified number of units (ex: rows) from an offset.
 * Range are zero-based.  For example, in a list, a range with an offset of 0 and count of 2
 * will include the first two items.
 * Can be extended to handle two dimensional range.
 */
export declare type Range = {
    /**
     * The offset of the range.  Currently this must be a non-negative number.
     */
    offset: number;
    /**
     * The number of units in this range.  If the value is -1, then the range should cover
     * all units starting from the offset until the end.
     */
    count: number;
};
/**
 * Type to represent the state of the data.
 */
export declare type DataState<K, D> = {
    /**
     * The offset of the range of data.  Currently this must be a non-negative number.
     */
    offset: number;
    /**
     * An array of data and metadata.
     */
    data: {
        data: D;
        metadata: Metadata<K>;
    }[];
    /**
     * The size of the data currently available.  Collection components use this value
     * to estimate the height needed to host all the data, and depending on the value
     * of sizePrecision, whether there are more data available.
     * Currently this must be a non-negative number.
     */
    totalSize: number;
    /**
     * Precision of the value in totalSize.  Possible values are 'exact' and 'atLeast'.
     * The value controls whether the Collection components will attempt to fetch more
     * data when user scrolls to the end.  Specifically, Collection components will assume
     * there are more data available as long as this value is 'atLeast'.
     */
    sizePrecision: 'exact' | 'atLeast';
};
