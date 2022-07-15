import { Keys } from '../utils/UNSAFE_keys';
import { SelectionDetail } from '../UNSAFE_Collection';
/**
 * Props for the Selector Component
 */
export declare type Props<K> = {
    /**
     * The key associated with the Selector.
     */
    rowKey: K;
    /**
     * The selected keys.
     */
    selectedKeys: Keys<K>;
    /**
     * aria-label for this selector
     */
    accessibleLabel?: string;
    /**
     * Callback function to invoke when the selected keys has changed when
     * the checkbox is toggled.
     */
    onChange?: (detail: SelectionDetail<K>) => void;
};
/**
 * The Selector component is used to enable multi-selection in Collection components.
 */
export declare function Selector<K>({ accessibleLabel, rowKey, selectedKeys, onChange }: Props<K>): import("preact").JSX.Element;
