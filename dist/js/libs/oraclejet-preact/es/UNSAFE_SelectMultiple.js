/* @oracle/oraclejet-preact: 13.1.0 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import { Fragment } from 'preact';
import { forwardRef } from 'preact/compat';
import { useFocusableTextField } from './hooks/UNSAFE_useFocusableTextField.js';
import { useFormContext } from './hooks/UNSAFE_useFormContext.js';
import { FormFieldContext } from './hooks/UNSAFE_useFormFieldContext.js';
import { useLoadingIndicatorTimer } from './hooks/UNSAFE_useLoadingIndicatorTimer.js';
import { useTextField } from './hooks/UNSAFE_useTextField.js';
import { Flex } from './UNSAFE_Flex.js';
import { Label } from './UNSAFE_Label.js';
import { LiveRegion } from './UNSAFE_LiveRegion.js';
import { ReadonlyTextField, ReadonlyTextFieldInput, TextFieldInput, TextField } from './UNSAFE_TextField.js';
import { InlineUserAssistance } from './UNSAFE_UserAssistance.js';
import { getClientHints } from './utils/PRIVATE_clientHints.js';
import { useCallback, useMemo, useRef, useState, useEffect } from 'preact/hooks';
import './UNSAFE_SelectMultiple.css';
import { HighlightText } from './UNSAFE_HighlightText.js';
import { ListView } from './UNSAFE_ListView.js';
import { Logger } from './utils/UNSAFE_logger.js';
import { Floating } from './UNSAFE_Floating.js';
import { Layer } from './UNSAFE_Layer.js';
import useOutsideClick from './hooks/UNSAFE_useOutsideClick.js';
import { usePress } from './hooks/UNSAFE_usePress.js';
import { classNames } from './utils/UNSAFE_classNames.js';
import { _ as __rest } from './tslib.es6-deee4931.js';
import { Chip } from './UNSAFE_Chip.js';
import { useTranslationBundle } from './hooks/UNSAFE_useTranslationBundle.js';
import './hooks/UNSAFE_useFocusWithin.js';
import './hooks/UNSAFE_useTimer.js';
import './hooks/UNSAFE_useId.js';
import './utils/UNSAFE_interpolations/dimensions.js';
import './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-b6f34fc4.js';
import './utils/UNSAFE_mergeInterpolations.js';
import './_curry2-255e04d1.js';
import './_has-f370c697.js';
import './utils/UNSAFE_interpolations/boxalignment.js';
import './keys-77d2b8e6.js';
import './utils/UNSAFE_interpolations/flexbox.js';
import './utils/UNSAFE_interpolations/flexitem.js';
import './utils/UNSAFE_interpolations/text.js';
import './UNSAFE_LabelValueLayout.js';
import './hooks/UNSAFE_useTextFieldInputHandlers.js';
import './hooks/UNSAFE_useDebounce.js';
import './UNSAFE_Environment.js';
import './UNSAFE_ComponentMessage.js';
import './UNSAFE_HiddenAccessible.js';
import './UNSAFE_Message.js';
import './utils/UNSAFE_getLocale.js';
import './UNSAFE_ThemedIcons.js';
import './UNSAFE_Icon.js';
import './hooks/UNSAFE_useUser.js';
import './hooks/UNSAFE_useTheme.js';
import './UNSAFE_Icons.js';
import './utils/UNSAFE_soundUtils.js';
import './UNSAFE_TransitionGroup.js';
import './utils/UNSAFE_mergeProps.js';
import './utils/UNSAFE_keys.js';
import './UNSAFE_VirtualizedCollection.js';
import './UNSAFE_Collection.js';
import './hooks/UNSAFE_useViewportIntersect.js';
import './UNSAFE_Selector.js';
import './hooks/PRIVATE_useSelection.js';
import './hooks/PRIVATE_useCurrentKey.js';
import './hooks/PRIVATE_useCollectionFocusRing.js';
import './UNSAFE_Skeleton.js';
import './utils/UNSAFE_interpolations/borders.js';
import './index-46e68d3c.js';
import './hooks/UNSAFE_useActionable.js';
import './hooks/UNSAFE_useHover.js';
import './hooks/UNSAFE_useToggle.js';
import './hooks/UNSAFE_useActive.js';
import './hooks/UNSAFE_useFocus.js';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
function renderItemText(item, itemText) {
    var _a;
    // if item-text is a string and the data has the specified field, return it;
    // otherwise log an error
    if (typeof itemText === 'string') {
        if ((_a = item.data) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(itemText)) {
            return item.data[itemText];
        }
        Logger.error('SelectMultiple: itemText specifies field that does not exist: ' + itemText);
        // return undefined if the field doesn't exist
        return undefined;
    }
    // if item-text is a function, call it to create a display label
    return itemText(item);
}

const itemStyles = "_3otv08";

const noOp = () => {};

function DefaultList({
  accessibleSummary,
  currentKey,
  data,
  itemText,
  onCurrentKeyChange,
  onLoadRange = noOp,
  onSelectionChange,
  searchText,
  selectedKeys
}) {
  const listItemRenderer = useCallback(listItemContext => {
    const itemContext = {
      data: listItemContext.data,
      key: listItemContext.metadata.key,
      metadata: listItemContext.metadata
    };
    const renderedItemText = renderItemText(itemContext, itemText);
    return jsx("div", Object.assign({
      class: itemStyles
    }, {
      children: jsx(HighlightText, Object.assign({
        matchText: searchText
      }, {
        children: renderedItemText
      }))
    }));
  }, [itemText, searchText]);
  return jsx(ListView, Object.assign({
    accessibleSummary: accessibleSummary,
    currentKey: currentKey,
    data: data !== null && data !== void 0 ? data : null,
    gridlines: "hidden",
    onCurrentKeyChange: onCurrentKeyChange,
    onLoadRange: onLoadRange,
    onSelectionChange: onSelectionChange,
    selectedKeys: {
      all: false,
      keys: selectedKeys !== null && selectedKeys !== void 0 ? selectedKeys : new Set()
    },
    selectionMode: "multiple"
  }, {
    children: context => listItemRenderer(context)
  }));
}

const KEYS = {
    TAB: 'Tab',
    ENTER: 'Enter',
    ESC: 'Escape',
    SPACE: 'Space',
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    SHIFT_LEFT: 'ShiftLeft',
    SHIFT_RIGHT: 'ShiftRight',
    CTRL_LEFT: 'ControlLeft',
    CTRL_RIGHT: 'ControlRight',
    ALT_LEFT: 'AltLeft',
    ALT_RIGHT: 'AltRight',
    PAGE_UP: 'PageUp',
    PAGE_DOWN: 'PageDown',
    HOME: 'Home',
    END: 'End',
    BACKSPACE: 'Backspace',
    DELETE: 'Delete'
};
const isControlKey = (event) => {
    switch (event.code) {
        case KEYS.SHIFT_LEFT:
        case KEYS.SHIFT_RIGHT:
        case KEYS.CTRL_LEFT:
        case KEYS.CTRL_RIGHT:
        case KEYS.ALT_LEFT:
        case KEYS.ALT_RIGHT:
            return true;
        default:
            return event.metaKey || event.ctrlKey;
    }
};
const isFunctionKey = (event) => {
    return /\bF([1-9]|1[0-2])\b/i.test(event.code);
};
const isControlOrFunctionKey = (event) => {
    return isControlKey(event) || isFunctionKey(event);
};
const isSimpleClick = (event) => {
    return event.button === 0 && !event.ctrlKey;
};

const rootStyles$3 = {
  base: "l1irv3"
};
function Dropdown({
  anchorRef,
  children,
  dropdownRef,
  id,
  isOpen,
  onAutoDismiss
}) {
  var _a;

  const handleAutoDismiss = useCallback(event => {
    onAutoDismiss === null || onAutoDismiss === void 0 ? void 0 : onAutoDismiss(event);
  }, [onAutoDismiss]);
  const handleKeyDown = useCallback(event => {
    if (event.defaultPrevented || isControlOrFunctionKey(event)) {
      return;
    }

    switch (event.code) {
      case KEYS.ESC:
      case KEYS.TAB:
        handleAutoDismiss(event);
        break;
    }
  }, [handleAutoDismiss]);
  useOutsideClick({
    isDisabled: !isOpen,
    ref: [anchorRef, dropdownRef],
    handler: handleAutoDismiss
  }); // TODO: get dropdown y (mainAxis) offset from --oj-c-PRIVATE-DO-NOT-USE-private-core-global-dropdown-offset

  const offsetValue = {
    mainAxis: 4,
    crossAxis: 0
  };
  const inlineStyle = {
    minWidth: `${(_a = anchorRef.current) === null || _a === void 0 ? void 0 : _a.offsetWidth}px`
  };
  return !isOpen ? null : jsx(Layer, {
    children: jsx(Floating, Object.assign({
      anchorRef: anchorRef,
      ref: dropdownRef,
      placement: "bottom-start",
      offsetValue: offsetValue
    }, {
      children: jsx("div", Object.assign({
        class: rootStyles$3.base,
        id: id,
        style: inlineStyle,
        onKeyDown: handleKeyDown
      }, {
        children: children
      }))
    }))
  });
}

const ojButtonHeight = '2.75rem'; // TODO: replace this with var(--oj-button-sm-height) once it is available

const ojButtonSmHeight = '2.25rem'; // TODO: replace this with var(--oj-button-border-radius) once it is available

const ojButtonBorderRadius = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-border-radius-md)'; // TODO: replace this with var(--oj-button-borderless-chrome-text-color) once it is available

const ojButtonBorderlessChromeTextColor = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-text-color-primary)'; // TODO: replace this with var (--oj-button-borderless-chrome-text-color-disabled) once it is available

const ojButtonBorderlessChromeTextColorDisabled = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-text-color-disabled)'; // TODO: replace this with var(--oj-button-borderless-chrome-text-color-hover) once it is available

const ojButtonBorderlessChromeTextColorHover = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-text-color-primary)'; // TODO: replace this with var(--oj-button-borderless-chrome-bg-color-hover) once it is available

const ojButtonBorderlessChromeBgColorHover = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-bg-color-hover)'; // TODO: replace this with var(--oj-button-borderless-chrome-border-color-hover) once it is available

const ojButtonBorderlessChromeBorderColorHover = 'transparent';
const rootStyles$2 = {
  base: "_u290a",
  sizeMd: "twg85i",
  sizeSm: "_f3eafd",
  enabled: "dxvfy",
  disabled: "usxalw"
};

const noop = () => {};

function DropdownArrow({
  isDisabled = false,
  onClick,
  size = 'md'
}) {
  const preventDefault = useCallback(event => {
    event.preventDefault();
  }, []);
  const {
    pressProps
  } = usePress(onClick !== null && onClick !== void 0 ? onClick : noop, {
    isDisabled
  });
  const styleClasses = classNames([rootStyles$2.base, size === 'sm' ? rootStyles$2.sizeSm : rootStyles$2.sizeMd, isDisabled ? rootStyles$2.disabled : rootStyles$2.enabled]);
  return jsx("span", Object.assign({
    "aria-hidden": "true",
    class: styleClasses,
    tabIndex: -1,
    onMouseDown: preventDefault
  }, pressProps, {
    children: jsx("svg", Object.assign({
      height: "24",
      viewBox: "0 0 24 24",
      width: "24",
      xmlns: "http://www.w3.org/2000/svg"
    }, {
      children: jsx("path", {
        d: "m6.00803369 8.9999991c3.96646621 4 5.94968971 6 5.94967061 6-.0000192 0 1.9832044-2 5.9496706-6z",
        // fill="#100f0e"
        fill: "currentColor",
        "fill-rule": "evenodd"
      })
    }))
  }));
}

const rootStyles$1 = {
  base: "_bjjqqk",
  // TODO: This should really be applied directly to the child ListView so that the content
  // displays under the padding when scrolled, but we can't apply styles to the child collection.
  // TODO: Also need to figure out how to determine whether the collection is a ListView (in
  // the collectionRenderer case) in order to apply this styling.
  listView: "_7skzed",
  loading: "_r0l2mo"
};
function DropdownList({
  children,
  isLoading = false
}) {
  const styleClasses = classNames([rootStyles$1.base, rootStyles$1.listView, isLoading && rootStyles$1.loading]);
  return jsx("div", Object.assign({
    class: styleClasses
  }, {
    children: children
  }));
}

const rootStyles = "_hne3yc"; // This component renders a badge showing the number of selected values

function SelectedValuesCount(_a) {
  var {
    accessibleLabel,
    count = 0,
    onKeyDown,
    onKeyUp,
    onMouseDown
  } = _a,
      passThroughProps = __rest(_a, ["accessibleLabel", "count", "onKeyDown", "onKeyUp", "onMouseDown"]);

  const translations = useTranslationBundle('@oracle/oraclejet-preact');
  const instructions = translations.selectMultiple_showSelectedValues();
  const accLabel = accessibleLabel ? `${accessibleLabel}. ` : '';
  const ninetyNinePlus = translations.selectMultiple_countPlus({
    COUNT: `99`
  }); // The Chip shows the number of values selected or 99+ if the number is over 99.

  const chipCount = count > 99 ? `${ninetyNinePlus}` : `${count}`; // The screenreader will hear what the number of selected values is along with instructions
  // like Click to see the full list.

  const valuesSelectedText = translations.selectMultiple_valuesSelected({
    VALUE_COUNT: `${count}`
  });
  const label = `${accLabel}${valuesSelectedText} ${instructions}`;
  return jsx("div", Object.assign({
    class: rootStyles,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    onMouseDown: onMouseDown
  }, {
    children: jsx(Chip, Object.assign({
      accessibleLabel: label
    }, passThroughProps, {
      children: chipCount
    }))
  }));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
function useDisplayValues(itemText, valueItems) {
    // create the text displayed in the field from the selected values
    const concatenatedDisplayValues = useMemo(() => {
        if (!valueItems) {
            return '';
        }
        const displayValues = _createDisplayValues(itemText, valueItems);
        const concatDisplayValues = _concatDisplayValues(displayValues);
        return concatDisplayValues;
    }, [valueItems, itemText]);
    return concatenatedDisplayValues;
}
function _concatDisplayValues(displayValues) {
    return Array.from(displayValues.values()).join(', ');
}
function _createDisplayValues(itemText, selectedItems) {
    const arValues = selectedItems ? [...selectedItems === null || selectedItems === void 0 ? void 0 : selectedItems.values()] : [];
    const mapFunc = (itemContext) => renderItemText(itemContext, itemText);
    const mappedArray = arValues.map(mapFunc);
    return new Set(mappedArray);
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Get the data to show in the dropdown for the selected-only view.
 * @param isDropdownSelectedOnlyView Whether the component is showing only selected
 * values in the dropdown: true if so, false if not.
 * @param valueItems The keys, data, and optional metadata for the selected values.
 * @returns An object with data and onLoadRange properties that can be passed on to the
 * list in the dropdown.
 */
function useSelectedOnlyData({ isDropdownSelectedOnlyView, valueItems }) {
    // Need to specify type of useMemo here so the return statement below doesn't show a type error
    // related to the sizePrecision prop on DataState:
    //   Type 'string' is not assignable to type '"exact" | "atLeast"'.
    // Note that useMemo here only depends on isDropdownSelectedOnlyView because we only want to
    // recalculate when that value changes.  While the selected only view is shown, we want the
    // data set to remain static with the set of valueItems as of the time the view was changed to
    // only show selected items so that the user can deselect and reselect items.
    // If useMemo depended on the valueItems too, then the data set would change as the user
    // deselected items, which means those items would disappear from the dropdown and the user
    // could not reselect them.
    const selectedOnlyViewDataState = useMemo(() => {
        var _a;
        return !isDropdownSelectedOnlyView || !valueItems || valueItems.length === 0
            ? undefined
            : {
                offset: 0,
                totalSize: (_a = valueItems === null || valueItems === void 0 ? void 0 : valueItems.length) !== null && _a !== void 0 ? _a : 0,
                sizePrecision: 'exact',
                data: valueItems.map((valueItem) => {
                    var _a;
                    return { data: valueItem.data, metadata: (_a = valueItem.metadata) !== null && _a !== void 0 ? _a : { key: valueItem.key } };
                })
            };
    }, [isDropdownSelectedOnlyView]);
    return {
        data: selectedOnlyViewDataState,
        onLoadRange: undefined
    };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Hook that manages SelectMultiple state and behavior.  This hook creates state variables and
 * event listeners, returning properties to apply to components internally rendered by
 * SelectMultiple, as well as state information.
 *
 * @param data Specifies data for the dropdown list.
 * @param inputRef Ref to the input element.
 * @param isDisabled Specifies whether the component is disabled.
 * @param isFocused Specifies whether the component has focus.
 * @param isReadonly Specifies whether the component is readonly.
 * @param onCommit Callback invoked when the selected values are committed.
 * @param onFilter Callback function to trigger loading data for the dropdown list,
 * which may or may not be filtered by user entered text.
 * @param onLoadRange Callback function to handle when the viewport of the dropdown list has
 * changed, including the case where the user scrolls to the end of the list and there are more
 * items to load.  The function should set a new DataState on the component for the specified
 * range.
 * @param valueItems Specifies the keys, data, and optional metadata for the selected values.
 *
 * @returns Properties to apply to internal components that SelectMultiple renders, and component
 * state.
 */
function useSelectMultiple({ data: propData, inputRef, isDisabled, isFocused, isReadonly, onCommit, onFilter, onLoadRange: propOnLoadRange, valueItems }) {
    const mainFieldRef = useRef(null);
    const dropdownRef = useRef(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isDropdownSelectedOnlyView, setDropdownSelectedOnlyView] = useState(false);
    const [currentRow, setCurrentRow] = useState({
        rowKey: undefined
    });
    const [selectedKeys, setSelectedKeys] = useState();
    const [isUserFiltering, setUserFiltering] = useState(false);
    const [userInput, setUserInput] = useState();
    const [searchText, setSearchText] = useState();
    const selectedValuesCount = valueItems === null || valueItems === void 0 ? void 0 : valueItems.length;
    const hasSelectedValuesCount = (selectedValuesCount !== undefined && selectedValuesCount > 0) || isDropdownSelectedOnlyView;
    // when the array of valueItems changes, pull out the new set of selectedKeys
    useEffect(() => {
        const keys = valueItems === null || valueItems === void 0 ? void 0 : valueItems.reduce((accumKeys, currentItem) => {
            accumKeys.add(currentItem.key);
            return accumKeys;
        }, new Set());
        setSelectedKeys(keys);
    }, [valueItems]);
    const chipRef = useRef(null);
    useEffect(() => {
        chipRef.current =
            hasSelectedValuesCount && mainFieldRef.current
                ? mainFieldRef.current.querySelector('[tabindex="0"]')
                : null;
    }, [hasSelectedValuesCount, isDisabled, isReadonly]);
    // show only the selected values in the dropdown if isDropdownSelectedOnlyView is true,
    // otherwise show the full data set
    // TODO: We may need to revisit this for hierarchical data because the selected valueItems
    // won't have any information about ancestor group nodes, and we should probably show selected
    // items in context within the hierarchy.  Also, the order of the items in the selected-only
    // view right now follows the order in which they were selected, not the order in which they
    // would appear in the full data set.  This may be more of a problem for hierarchical data
    // if items have to appear within the correct group ancestors.  We may need to move
    // construction of the selected-only DataState out of the component to the consuming code,
    // and take a callback that we can call as a notification that the app should provide this
    // special DataState to us (kind of like onLoadRange).  Note that we may also need an
    // enhancement on the DataProvider API to be able to specify a filterCriterion to filter by
    // the selected keys through a fetchFirst call, because a regular fetchByKeys call would
    // still return results in the order in which the keys were specified and would not return
    // data for the ancestor group nodes.
    const selectedOnlyDataProps = useSelectedOnlyData({
        isDropdownSelectedOnlyView,
        valueItems
    });
    const data = isDropdownSelectedOnlyView ? selectedOnlyDataProps.data : propData;
    const onLoadRange = isDropdownSelectedOnlyView
        ? selectedOnlyDataProps.onLoadRange
        : propOnLoadRange;
    const onMouseDown = useCallback((event) => {
        // const target = event.target as HTMLElement;
        if (event.defaultPrevented || !isSimpleClick(event)) {
            return;
        }
        if (!isDropdownOpen) {
            setDropdownOpen(true);
        }
        // this is needed to focus the input when clicking on the inside label when there is no
        // value;  otherwise the component looks focused but doesn't actually have physical focus
        setTimeout(function () {
            var _a;
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }, 0);
    }, [isDropdownOpen, setDropdownOpen]);
    const handleDropdownArrowClick = useCallback(() => {
        var _a;
        setDropdownOpen(!isDropdownOpen);
        // focus the input so that if the user Tabs afterwards, it loses focus and the dropdown closes
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, [isDropdownOpen]);
    const handleDropdownAutoDismiss = useCallback((event) => {
        var _a, _b, _c;
        if (isDropdownOpen) {
            setDropdownOpen(false);
            if ((event === null || event === void 0 ? void 0 : event.type) === 'keydown') {
                const keyboardEvent = event;
                switch (keyboardEvent.code) {
                    case KEYS.ESC:
                        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                        break;
                    case KEYS.TAB:
                        // Put focus on an element in the main field, but don't kill the event, so that
                        // the browser can naturally transfer focus to the next focusable item relative
                        // to the element in the main field.
                        if (keyboardEvent.shiftKey || !hasSelectedValuesCount) {
                            (_b = inputRef.current) === null || _b === void 0 ? void 0 : _b.focus();
                        }
                        else {
                            (_c = chipRef.current) === null || _c === void 0 ? void 0 : _c.focus();
                        }
                        break;
                }
            }
        }
    }, [hasSelectedValuesCount, isDropdownOpen]);
    const handleUpDownArrowKeys = useCallback((event) => {
        var _a, _b, _c, _d;
        if (!isDropdownOpen) {
            setDropdownOpen(true);
        }
        else {
            // transfer physical focus into the dropdown
            const firstFocusableElem = (_a = dropdownRef.current) === null || _a === void 0 ? void 0 : _a.querySelector('[tabindex="0"]');
            firstFocusableElem === null || firstFocusableElem === void 0 ? void 0 : firstFocusableElem.focus();
            // if there is no current item set, make the first item current
            if (data !== undefined && currentRow.rowKey === undefined) {
                setCurrentRow({ rowKey: (_d = (_c = (_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.metadata) === null || _d === void 0 ? void 0 : _d.key });
            }
        }
        // prevent the page from scrolling
        event.preventDefault();
    }, [currentRow, data, isDropdownOpen]);
    const handleMainFieldKeyDown = useCallback((event) => {
        // const target = event.target as HTMLElement;
        // ignore control key and function key
        if (isControlOrFunctionKey(event)) {
            return;
        }
        switch (event.code) {
            case KEYS.PAGE_UP:
            case KEYS.PAGE_DOWN:
                // prevent the page from scrolling
                event.preventDefault();
                return;
            case KEYS.UP:
            case KEYS.DOWN:
                // prevent the page from scrolling
                event.preventDefault();
                break;
            case KEYS.TAB:
                if (isDropdownOpen && (event.shiftKey || (!hasSelectedValuesCount && !event.shiftKey))) {
                    setDropdownOpen(false);
                }
                break;
            case KEYS.ESC:
                if (isDropdownOpen) {
                    setDropdownOpen(false);
                    event.preventDefault();
                }
                break;
            default:
                break;
        }
    }, [hasSelectedValuesCount, isDropdownOpen]);
    const handleMainFieldKeyUp = useCallback((event) => {
        // ignore control key and function key
        if (isControlOrFunctionKey(event)) {
            return;
        }
        switch (event.code) {
            case KEYS.UP:
            case KEYS.DOWN:
                handleUpDownArrowKeys(event);
                break;
            default:
                break;
        }
    }, [handleUpDownArrowKeys]);
    const handleInput = useCallback((detail) => {
        var _a;
        if (!isDropdownOpen) {
            setDropdownOpen(true);
        }
        setUserFiltering(true);
        setUserInput(detail.value);
        const str = (_a = detail.value) === null || _a === void 0 ? void 0 : _a.trim();
        setSearchText(str);
        onFilter === null || onFilter === void 0 ? void 0 : onFilter({ searchText: str });
    }, [isDropdownOpen, onFilter]);
    const handleSelectedValuesCountKeyDown = useCallback((event) => {
        switch (event.code) {
            case KEYS.TAB:
                if (isDropdownOpen && !event.shiftKey) {
                    setDropdownOpen(false);
                }
                break;
            case KEYS.UP:
            case KEYS.DOWN:
                // prevent the page from scrolling
                event.preventDefault();
                break;
            case KEYS.ESC:
                if (isDropdownOpen) {
                    setDropdownOpen(false);
                    event.preventDefault();
                }
                break;
            default:
                break;
        }
    }, [isDropdownOpen]);
    const handleSelectedValuesCountKeyUp = useCallback((event) => {
        switch (event.code) {
            case KEYS.UP:
            case KEYS.DOWN:
                handleUpDownArrowKeys(event);
                break;
            default:
                break;
        }
    }, [handleUpDownArrowKeys]);
    const handleSelectedValuesCountMouseDown = useCallback((event) => {
        var _a;
        // call preventDefault so that the dropdown doesn't open showing the full list on mousedown
        // on the chip before switching to show only the selected values on mouseup when the click
        // is handled
        event.preventDefault();
        // explicitly focus the input because it won't happen naturally due to preventDefault()
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, []);
    const handleSelectedValuesCountToggle = useCallback((detail) => {
        var _a;
        if (!isDropdownOpen) {
            setDropdownOpen(true);
        }
        const value = (_a = detail.value) !== null && _a !== void 0 ? _a : false;
        if (value !== isDropdownSelectedOnlyView) {
            setDropdownSelectedOnlyView(value);
        }
    }, [isDropdownOpen, isDropdownSelectedOnlyView]);
    // when the dropdown closes, automatically turn off isDropdownSelectedOnlyView
    useEffect(() => {
        if (!isDropdownOpen && isDropdownSelectedOnlyView) {
            setDropdownSelectedOnlyView(false);
        }
    }, [isDropdownOpen, isDropdownSelectedOnlyView]);
    // TODO: need to specify type <any> for onSelectionChange and onCurrentKeyChange because
    // otherwise there's an error in SelectMultiple where it renders the DefaultList:
    // Types of property 'onSelectionChange' are incompatible.
    //     Type '(detail: SelectionDetail<K>) => void' is not assignable to type '(detail: SelectionDetail<string | number>) => void'.
    //       Types of parameters 'detail' and 'detail' are incompatible.
    //         Type 'SelectionDetail<string | number>' is not assignable to type 'SelectionDetail<K>'.
    //           Type 'string | number' is not assignable to type 'K'.
    //             'string | number' is assignable to the constraint of type 'K', but 'K' could be instantiated with a different subtype of constraint 'string | number'.
    const onSelectionChange = useCallback((detail) => {
        const newKeys = detail.value.keys;
        // update the selectedKeys so that the selection visual state of the collection
        // updates immediately while waiting for new valueItems to be set
        setSelectedKeys(newKeys);
        // call the onCommit callback so that the consuming code can update the valueItems
        onCommit === null || onCommit === void 0 ? void 0 : onCommit({ value: newKeys, previousValue: selectedKeys });
    }, [onCommit, selectedKeys]);
    const onCurrentKeyChange = useCallback((detail) => {
        setCurrentRow({ rowKey: detail.value });
    }, []);
    useEffect(() => {
        // clear the current item when the dropdown opens
        if (isDropdownOpen) {
            setCurrentRow({ rowKey: undefined });
        }
        // TODO: when filtering, set the first result of the filtered data set to be the current item
        // if (isDropdownOpen && data !== undefined && isFiltering) {
        //   setCurrentRow({ rowKey: data?.data?.[0]?.metadata?.key });
        // }
    }, [isDropdownOpen]);
    // the user is not actively filtering if the dropdown is closed and the component doesn't
    // have focus
    useEffect(() => {
        if (!isDropdownOpen && !isFocused && isUserFiltering) {
            setUserFiltering(false);
            setUserInput('');
            setSearchText('');
        }
    }, [isDropdownOpen, isFocused, isUserFiltering]);
    // need to call onFilter with undefined searchText when the dropdown opens and the
    // user is NOT filtering
    useEffect(() => {
        if (isDropdownOpen && !isUserFiltering) {
            onFilter === null || onFilter === void 0 ? void 0 : onFilter({ searchText: undefined });
        }
    }, [isDropdownOpen, isUserFiltering]);
    return {
        collectionProps: {
            currentKey: currentRow.rowKey,
            onCurrentKeyChange,
            onSelectionChange,
            selectedKeys
        },
        data,
        dropdownArrowEventHandlers: {
            onClick: handleDropdownArrowClick
        },
        dropdownEventHandlers: {
            onAutoDismiss: handleDropdownAutoDismiss
        },
        dropdownRef,
        hasSelectedValuesCount,
        inputEventHandlers: {
            onInput: handleInput,
            onKeyDown: handleMainFieldKeyDown,
            onKeyUp: handleMainFieldKeyUp
        },
        inputRef,
        isDropdownOpen,
        isDropdownSelectedOnlyView,
        // the field should remain to look focused while the dropdown is open,
        // in case physical focus is in the dropdown
        isFocused: isFocused || isDropdownOpen,
        isUserFiltering,
        mainFieldRef,
        mouseProps: isDisabled || isReadonly ? {} : { onMouseDown },
        onLoadRange,
        searchText,
        selectedValuesCountProps: {
            onKeyDown: handleSelectedValuesCountKeyDown,
            onKeyUp: handleSelectedValuesCountKeyUp,
            onMouseDown: handleSelectedValuesCountMouseDown,
            onToggle: handleSelectedValuesCountToggle
        },
        userInput
    };
}

const SelectMultiple = forwardRef(({ assistiveText, data: propData, helpSourceLink, helpSourceText, id: propId, isDisabled: propIsDisabled, isLoading: propIsLoading, isReadonly: propIsReadonly, isRequired = false, isRequiredShown, itemText, label, labelEdge: propLabelEdge, labelStartWidth: propLabelStartWidth, messages, onCommit, onFilter, onLoadRange: propOnLoadRange, placeholder, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, valueItems, virtualKeyboard }, ref) => {
    const { isDisabled: isFormDisabled, isReadonly: isFormReadonly, labelEdge: formLabelEdge, labelStartWidth: formLabelStartWidth, textAlign: formTextAlign, userAssistanceDensity: formUserAssistanceDensity } = useFormContext();
    // default to FormContext values if component properties are not specified
    const isDisabled = propIsDisabled !== null && propIsDisabled !== void 0 ? propIsDisabled : isFormDisabled;
    const isReadonly = propIsReadonly !== null && propIsReadonly !== void 0 ? propIsReadonly : isFormReadonly;
    const labelEdge = propLabelEdge !== null && propLabelEdge !== void 0 ? propLabelEdge : formLabelEdge;
    const labelStartWidth = propLabelStartWidth !== null && propLabelStartWidth !== void 0 ? propLabelStartWidth : formLabelStartWidth;
    const textAlign = propTextAlign !== null && propTextAlign !== void 0 ? propTextAlign : formTextAlign;
    const userAssistanceDensity = propUserAssistanceDensity !== null && propUserAssistanceDensity !== void 0 ? propUserAssistanceDensity : formUserAssistanceDensity;
    const { enabledElementRef, focusProps, isFocused: origIsFocused, readonlyElementRef } = useFocusableTextField({ isDisabled, isReadonly, ref });
    const { collectionProps, data, dropdownArrowEventHandlers, dropdownEventHandlers, dropdownRef, hasSelectedValuesCount, inputEventHandlers, isDropdownOpen, isDropdownSelectedOnlyView, isFocused, isUserFiltering, mainFieldRef, mouseProps, onLoadRange, searchText, selectedValuesCountProps, userInput } = useSelectMultiple({
        data: propData,
        inputRef: enabledElementRef,
        isDisabled,
        isFocused: origIsFocused,
        isReadonly,
        onCommit,
        onFilter,
        onLoadRange: propOnLoadRange,
        valueItems
    });
    // The incoming propIsLoading tells us that we are in a loading state, but we don't want to
    // show the loading indicator until after a delay, because showing it immediately could result
    // in unwanted flashing.  The isLoading var below will be set to true by useLoadingIndicatorTimer
    // after the delay, when the timer expires, at which point we should show the loading indicator.
    // If propIsLoading is set to false before the timer expires, then the timer will be cancelled
    // and no loading indicator will be shown.
    // (ListView detects its loading state by checking data === null.  While it would be nice for
    // us to be consistent and check valueItems === null, we need to use a separate isLoading prop.
    // If valueItems === null triggers our loading state, then the selections in the dropdown
    // are cleared for that period of time, which is undesirable.)
    const isLoading = useLoadingIndicatorTimer(propIsLoading !== null && propIsLoading !== void 0 ? propIsLoading : false);
    const { baseId, formFieldContext, inputProps, labelProps, textFieldProps, userAssistanceProps } = useTextField({
        id: propId,
        isDisabled,
        isFocused,
        isLoading,
        isReadonly,
        labelEdge,
        messages,
        value: valueItems !== undefined && valueItems.length > 0 ? true : undefined
    });
    const dropdownId = `${baseId}-dropdown`;
    const displayValue = useDisplayValues(itemText, valueItems);
    const labelComp = labelEdge !== 'none' ? jsx(Label, Object.assign({}, labelProps, { children: label })) : undefined;
    const fieldLabelProps = {
        label: labelEdge !== 'none' ? labelComp : undefined,
        labelEdge: labelEdge !== 'none' ? labelEdge : undefined,
        labelStartWidth: labelEdge !== 'none' ? labelStartWidth : undefined
    };
    const ariaLabel = labelEdge === 'none' ? label : undefined;
    const inlineUserAssistance = isDisabled || isReadonly ? (
    // save space for user assistance if density is 'efficient', even though we don't
    // render user assistance for disabled or readonly fields
    userAssistanceDensity !== 'efficient' ? undefined : (jsx(InlineUserAssistance, Object.assign({ userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)))) : (jsx(InlineUserAssistance, Object.assign({ assistiveText: assistiveText, fieldLabel: label, helpSourceLink: helpSourceLink, helpSourceText: helpSourceText, messages: messages, isRequiredShown: isRequiredShown, userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)));
    if (isReadonly) {
        return (jsx(FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsx(ReadonlyTextField, Object.assign({ role: "presentation", inlineUserAssistance: inlineUserAssistance, onBlur: focusProps.onfocusout, onFocus: focusProps.onfocusin }, fieldLabelProps, { children: jsx(ReadonlyTextFieldInput, { ariaLabel: ariaLabel, ariaLabelledby: labelProps.id, as: "div", elementRef: readonlyElementRef, hasInsideLabel: label !== undefined && labelEdge === 'inside', id: textFieldProps.id, textAlign: textAlign, value: displayValue }) })) })));
    }
    const hasInsideLabel = labelComp !== undefined && labelEdge === 'inside';
    const translations = useTranslationBundle('@oracle/oraclejet-preact');
    const liveRegionText = isDropdownOpen && data !== undefined && data !== null && !isBeforeDataFetch(data)
        ? (data === null || data === void 0 ? void 0 : data.totalSize) === 0
            ? translations.select_noMatchesFound()
            : (data === null || data === void 0 ? void 0 : data.totalSize) === 1
                ? translations.select_oneMatchFound()
                : (data === null || data === void 0 ? void 0 : data.sizePrecision) === 'exact'
                    ? translations.select_sizeMatchesFound({ TOTAL_SIZE: `${data === null || data === void 0 ? void 0 : data.totalSize}` })
                    : translations.select_sizeOrMoreMatchesFound({ TOTAL_SIZE: `${data === null || data === void 0 ? void 0 : data.totalSize}` })
        : '';
    const mainContent = (jsxs(Fragment, { children: [jsx(TextFieldInput, Object.assign({ ariaAutocomplete: "list", ariaControls: dropdownId, ariaExpanded: isDropdownOpen, ariaLabel: ariaLabel, autoComplete: "off", hasInsideLabel: hasInsideLabel, inputRef: enabledElementRef, isRequired: isRequired }, inputEventHandlers, { placeholder: placeholder, role: "combobox", spellcheck: false, textAlign: textAlign, type: isMobile() ? virtualKeyboard : undefined, value: isUserFiltering ? userInput : displayValue }, inputProps)), jsx(LiveRegion, { children: liveRegionText })] }));
    const dropdownArrow = (jsx(DropdownArrow, Object.assign({ isDisabled: isDisabled, size: hasInsideLabel ? 'md' : 'sm' }, dropdownArrowEventHandlers)));
    const selectedValuesCount = valueItems === null || valueItems === void 0 ? void 0 : valueItems.length;
    const endContent = isLoading ? undefined : !hasSelectedValuesCount ? (dropdownArrow) : (jsxs(Flex, Object.assign({ align: "center", justify: "center", gap: [0, '1x'] }, { children: [jsx(SelectedValuesCount, Object.assign({ accessibleLabel: label, count: selectedValuesCount, isDisabled: isDisabled, isSelected: isDropdownSelectedOnlyView }, selectedValuesCountProps)), dropdownArrow] })));
    return (jsxs(Fragment, { children: [jsx(FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsx(TextField, Object.assign({ endContent: endContent, inlineUserAssistance: inlineUserAssistance, mainContent: mainContent, mainFieldRef: mainFieldRef, onBlur: focusProps === null || focusProps === void 0 ? void 0 : focusProps.onfocusout, onFocus: focusProps === null || focusProps === void 0 ? void 0 : focusProps.onfocusin }, textFieldProps, fieldLabelProps, mouseProps)) })), jsx(Dropdown, Object.assign({ dropdownRef: dropdownRef, id: dropdownId, isOpen: isDropdownOpen &&
                    data !== undefined &&
                    (data === null || data.totalSize > 0 || isBeforeDataFetch(data)), anchorRef: mainFieldRef }, dropdownEventHandlers, { children: jsx(DropdownList, Object.assign({ isLoading: data === null }, { children: jsx(DefaultList, Object.assign({}, collectionProps, { accessibleSummary: label !== null && label !== void 0 ? label : '', data: data, itemText: itemText, onLoadRange: onLoadRange, searchText: isDropdownSelectedOnlyView ? undefined : isUserFiltering ? searchText : undefined })) })) }))] }));
});
/**
 * Helper function to determine whether the current device is a mobile device
 * @returns true if runnning on a mobile device, false otherwise
 */
function isMobile() {
    const deviceType = getClientHints().deviceType;
    return deviceType === 'phone' || deviceType === 'tablet';
}
function isBeforeDataFetch(data) {
    return data.sizePrecision === 'atLeast' && data.totalSize === 0;
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { SelectMultiple };
/*  */
//# sourceMappingURL=UNSAFE_SelectMultiple.js.map
