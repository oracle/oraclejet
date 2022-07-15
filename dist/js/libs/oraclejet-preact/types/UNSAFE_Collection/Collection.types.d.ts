import { Keys } from '../utils/UNSAFE_keys';
/**
 * Type of the context object passed to the item renderer function for
 * the base Collection
 */
export declare type ItemContext<D> = {
    /**
     * index of the item
     */
    index: number;
    /**
     * data for the item
     */
    data: D;
};
/**
 * Type for the metadata of an item.
 */
export declare type Metadata<K> = {
    /**
     * The key of the item.
     */
    key: K;
    /**
     * An optional suggestion metadata object that allows implementations
     * to provide information related to suggestions.
     */
    suggestion?: Record<string, any>;
};
/**
 * Type of the context object passed to the item renderer function for
 * Collection that deals with flat data
 */
export declare type ListItemContext<K, D> = {
    /**
     * zero based index of the item
     */
    index: number;
    /**
     * data for the item
     */
    data: D;
    /**
     * metadata for the item
     */
    metadata: Metadata<K>;
};
/**
 * Type of the context object passed to the item renderer function for
 * Collection that deals with hierarchical data
 */
export declare type HierarchicalItemContext<K, D> = {
    /**
     * zero based index of the item
     */
    index: number;
    /**
     * data for the item
     */
    data: D;
    /**
     * metadata for the item
     */
    metadata: Metadata<K>;
    /**
     * key of the parent
     */
    parentKey: K;
    /**
     * zero based depth of the item
     */
    depth: number;
    /**
     * whether or not this is a leaf item
     */
    leaf: boolean;
};
/**
 * Type for selection mode
 */
export declare const modes: ("none" | "multiple" | "single")[];
export declare type SelectionMode = typeof modes[number];
/**
 * BEGIN: Public types from private hooks
 */
/**
 * useSelection type for payload of selection change event handler
 */
export declare type SelectionDetail<K> = {
    value: Keys<K>;
};
/**
 * useCurrentKey type for payload of current key change event handler
 */
export declare type CurrentKeyDetail<K> = {
    value: K;
};
