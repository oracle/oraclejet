/**
 * useToggle is a state toggle hook
 *
 * @param defaultValue
 * @returns
 */
export declare function useToggle(defaultValue?: boolean): {
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
    bool: boolean;
};
