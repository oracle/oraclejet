/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');
var utils_UNSAFE_arrayUtils = require('../utils/UNSAFE_arrayUtils.js');
var utils_UNSAFE_keys = require('../utils/UNSAFE_keys.js');

/**
 * Type for selection behavior.  See useMultipleSelection hook for details.
 */
const behaviors = utils_UNSAFE_arrayUtils.stringLiteralArray(['toggle', 'replace']);
const isShiftModeSupported = (anchorKey, selectedKeys, selectionMode, selectionBehavior) => {
    return (selectionMode === 'multiple' &&
        selectionBehavior !== 'toggle' &&
        utils_UNSAFE_keys.containsKey(selectedKeys, anchorKey));
};
const handleSelect = (event, keyExtractor, selectedKeys, selectionMode, selectionBehavior, isSelectionRequired, keyboardCursorRef, anchorKey, onChange, onRangeChange) => {
    const itemKey = keyExtractor(event);
    if (itemKey == null) {
        return;
    }
    // handle shift key selection
    if (event.shiftKey &&
        anchorKey &&
        onRangeChange &&
        isShiftModeSupported(anchorKey, selectedKeys, selectionMode, selectionBehavior)) {
        onRangeChange({ value: { start: anchorKey, end: itemKey } });
        // set keyboard selection cursor in case user extends with SHIFT+ARROW
        if (keyboardCursorRef) {
            keyboardCursorRef.current = itemKey;
        }
        return;
    }
    const selected = utils_UNSAFE_keys.containsKey(selectedKeys, itemKey);
    let keySet = selectedKeys;
    if (!selected) {
        if (selectionMode === 'single' ||
            (selectionBehavior === 'replace' && !(event.ctrlKey || event.metaKey))) {
            // should only contains this item key
            keySet = { all: false, keys: new Set([itemKey]) };
        }
        else {
            // add to existing selected keys
            keySet = utils_UNSAFE_keys.addKey(selectedKeys, itemKey);
        }
    }
    else {
        if (selectionBehavior === 'toggle' ||
            event.ctrlKey ||
            event.metaKey ||
            event.key === ' ') {
            // de-select only when ctrl/meta key is pressed or selectionBehavior is
            // explicitly set to toggle
            keySet = utils_UNSAFE_keys.removeKey(selectedKeys, itemKey, isSelectionRequired);
        }
        else if (selectionMode === 'multiple' && (selectedKeys.all || selectedKeys.keys.size > 1)) {
            // in this case everything should be de-selected except for this key
            keySet = { all: false, keys: new Set([itemKey]) };
        }
    }
    // only invoke callback if there is really a change
    // note onSelectionChange should never be null here
    if (selectedKeys != keySet && onChange) {
        onChange({ value: keySet });
    }
};
/**
 * Hook for handling various selection mode.  This can be reuse by all Collection components.
 * @param keyExtractor function to extract the key based on event that trigger the selection change.
 * @param selectedKeys the currently selected keys
 * @param selectionMode the selection mode
 * @param selectionBehavior the selection behavior.  If the value is 'toggle', then the key is
 *                          added/removed from the current selected keys.  If the value is 'replace',
 *                          then the current selected keys are cleared first before the key is added
 *                          unless the ctrl/shift/meta key is pressed.
 * @param onSelectionChange callback function that is invoked when selection has changed.
 * @returns an event map that the consumer can register as event listeners
 */
function useSelection(keyExtractor, selectedKeys, selectionMode, isSelectionRequired, selectionBehavior, onChange, anchorKey, currentKey, getPrevNextKey, scrollToKey, onRangeChange) {
    // ref to track the cursor for the SHIFT+ARROW keyboard selection separately than the anchor of the selection.
    const keyboardSelectionCursor = hooks.useRef();
    const onClick = hooks.useCallback((event) => {
        handleSelect(event, keyExtractor, selectedKeys, selectionMode, selectionBehavior, isSelectionRequired, keyboardSelectionCursor, anchorKey, onChange, onRangeChange);
        if (!event.shiftKey) {
            // reset keyboard cursor when using mouse to select
            keyboardSelectionCursor.current = undefined;
        }
    }, [
        keyExtractor,
        selectedKeys,
        selectionMode,
        selectionBehavior,
        isSelectionRequired,
        keyboardSelectionCursor,
        anchorKey,
        onChange,
        onRangeChange
    ]);
    // general keyboard events listen to keyUp for a11y
    const onKeyUp = hooks.useCallback((event) => {
        // older browser that we don't support returns 'Spacebar' for space key
        if (event.key === ' ') {
            handleSelect(event, keyExtractor, selectedKeys, selectionMode, selectionBehavior, isSelectionRequired, keyboardSelectionCursor, anchorKey, onChange, event.shiftKey ? onRangeChange : undefined);
        }
    }, [
        keyboardSelectionCursor.current,
        keyExtractor,
        selectedKeys,
        selectionMode,
        selectionBehavior,
        isSelectionRequired,
        anchorKey,
        onChange,
        onRangeChange
    ]);
    // arrowKey events listen to keyDown so they can support holding them down
    const onKeyDown = hooks.useCallback((event) => {
        // prevent default (propagation) for keyDown to space bar causing container to scroll
        if (event.key === ' ') {
            event.preventDefault();
            return;
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            if (event.shiftKey && getPrevNextKey && scrollToKey) {
                let keySet = selectedKeys;
                // on first selection event, set keyboard cursor to start at currentKey
                if (!keyboardSelectionCursor.current && utils_UNSAFE_keys.isKeyDefined(currentKey)) {
                    keySet = { all: false, keys: new Set([currentKey]) };
                }
                const newAnchorKey = getPrevNextKey(keyboardSelectionCursor.current || currentKey, event.key === 'ArrowDown' ? false : true);
                const cursorKey = newAnchorKey();
                if (cursorKey) {
                    // extend selection
                    if (!utils_UNSAFE_keys.containsKey(keySet, cursorKey)) {
                        keySet = utils_UNSAFE_keys.addKey(keySet, cursorKey);
                        // subtract from selection
                    }
                    else if (keyboardSelectionCursor.current) {
                        keySet = utils_UNSAFE_keys.removeKey(keySet, keyboardSelectionCursor.current, isSelectionRequired);
                    }
                    keyboardSelectionCursor.current = cursorKey;
                    // keep visible
                    scrollToKey(cursorKey);
                }
                if (selectedKeys != keySet && onChange) {
                    onChange({ value: keySet });
                }
            }
            else {
                // reset keyBoard on non-shifted arrow use as this interrupts the extend mode (and would make for messy logic that doesn't align with current Jet behavior)
                keyboardSelectionCursor.current = undefined;
            }
        }
    }, [keyboardSelectionCursor.current, selectedKeys, isSelectionRequired, onChange]);
    const selectionProps = selectionMode === 'none' || onChange == null ? {} : { onClick, onKeyDown, onKeyUp };
    return { selectionProps };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.useSelection = useSelection;
/*  */
//# sourceMappingURL=PRIVATE_useSelection.js.map
