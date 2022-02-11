/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { VNode } from 'preact';
import { TransitionProps } from './Transition';
export declare type ChildKey = number | string;
export declare type ChildMapping = Map<string | number, VNode<TransitionProps>>;
export declare type ChildrenRecord<T = any> = {
    [Key in number | string | any]: T[];
};
/**
 * @classdesc
 * A utility class consisting of helper functions for handling transitions
 * related operations.
 */
export declare class TransitionUtils {
    /**
     * Creates a map of the children array with the calculated in prop
     *
     * @param children The newly received children
     * @param prevChildMapping The previous child mapping
     * @returns the newly created child mapping
     */
    static getChildMapping(children: VNode<TransitionProps>[], prevChildMapping?: ChildMapping, onExited?: (child: VNode<TransitionProps>, node: Element, key?: ChildKey) => void): ChildMapping;
    /**
     * Creates a map of deleted children wrt to the keys in the new data.
     *
     * @param children The newly received children
     * @param prevChildMapping The previous child mapping
     * @param TRAILING A unique symbol to be used for storing the trailing children
     * @returns A map containing deleted children
     */
    private static _getMappedDeletions;
}
