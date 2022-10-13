/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var hooks = require('preact/hooks');

require('./utils/UNSAFE_classNames.js');
var utils_UNSAFE_arrayUtils = require('./utils/UNSAFE_arrayUtils.js');
var utils_UNSAFE_mergeProps = require('./utils/UNSAFE_mergeProps.js');
var utils_UNSAFE_keys = require('./utils/UNSAFE_keys.js');
require('./UNSAFE_VirtualizedCollection.js');
var UNSAFE_Selector = require('./UNSAFE_Selector.js');
var hooks_UNSAFE_useId = require('./hooks/UNSAFE_useId.js');
var classNames = require('./classNames-82bfab52.js');
var hooks_PRIVATE_useSelection = require('./hooks/PRIVATE_useSelection.js');
var hooks_PRIVATE_useCurrentKey = require('./hooks/PRIVATE_useCurrentKey.js');
var hooks_PRIVATE_useCollectionFocusRing = require('./hooks/PRIVATE_useCollectionFocusRing.js');
require('./UNSAFE_Skeleton.js');
require('./UNSAFE_Flex.js');
var Flex = require('./Flex-327ae051.js');
var Skeleton = require('./Skeleton-a3cafa17.js');
var VirtualizedCollection = require('./VirtualizedCollection-ac8517f3.js');

const ITEM_STYLE_CLASS = 'oj-listview-item';
const styles$1 = {
  base: "_if96r3",
  gridlines: "_f5nulg",
  selectable: "i9fts1",
  selected: "_sbscrb",
  selectedSingle: "_kqa9vv",
  // TODO: revisit later to prevent double lines when implementing gridlines feature
  suggestionEnd: "_8t3c3"
};
const cellStyles = {
  base: "umkir2",
  checkboxContainer: "_3wy9mj",
  focused: "w2hu2y"
};
/**
 * Helper method to determine whether item is selectable
 * @returns true if item is selectable (show hover effect), false otherwise
 */

const isSelectable = (selectionMode, isItemSelected) => {
  return selectionMode !== 'none' && (selectionMode === 'multiple' || !isItemSelected);
};
/**
 * The internal component used to render a single item in ListView.
 */


function ListViewItem({
  children,
  itemKey,
  itemIndex,
  currentKey,
  isFocusRingVisible,
  isGridlineVisible,
  suggestion,
  selectedKeys,
  selectionMode,
  onSelectionChange
}) {
  const rootRef = hooks.useRef(null);
  const isFocused = currentKey == itemKey;
  const isSelected = utils_UNSAFE_keys.containsKey(selectedKeys, itemKey);
  const classes = classNames.classNames([styles$1.base, ITEM_STYLE_CLASS, isGridlineVisible && styles$1.gridlines, isSelectable(selectionMode, isSelected) && !isSelected && styles$1.selectable, isSelected && styles$1.selected, isSelected && selectionMode === 'single' && styles$1.selectedSingle, suggestion === 'end' && !(isSelected && selectionMode === 'single') && styles$1.suggestionEnd]);
  const cellClasses = classNames.classNames([cellStyles.base, selectionMode === 'multiple' && cellStyles.checkboxContainer, isFocused && isFocusRingVisible && cellStyles.focused]); // todo: use translated text for selector
  // note cannot put focus on gridcell div since JAWS will not read the aria-rowindex
  // correctly, so unfortunately needed another div

  return jsxRuntime.jsx("div", Object.assign({
    role: "presentation",
    "aria-rowindex": itemIndex + 1,
    "data-oj-key": itemKey,
    "data-oj-suggestion": !!suggestion,
    class: classes,
    ref: rootRef
  }, typeof itemKey === 'number' && {
    'data-oj-key-type': 'number'
  }, {
    children: jsxRuntime.jsxs("div", Object.assign({
      id: hooks_UNSAFE_useId.useId(),
      class: cellClasses,
      role: "option",
      "aria-posinset": itemIndex + 1,
      "aria-setsize": -1,
      "aria-colindex": 1,
      "aria-selected": selectionMode !== 'none' ? isSelected : undefined
    }, {
      children: [selectionMode === 'multiple' && jsxRuntime.jsx(UNSAFE_Selector.Selector, {
        rowKey: itemKey,
        selectedKeys: selectedKeys,
        onChange: onSelectionChange
      }), children]
    }))
  }), itemKey);
}

const containerStyle = {
  base: "_srn9vk"
};
/**
 * Allows to specify the time delay for rendering the component
 **/

const timerValue = 50;
/**
 * SkeletonContainer renders 'minimumCount' number of skeletons
 * of the variant specified from its child element - Skeleton's prop after
 * 'timerValue' ms delay
 **/

function SkeletonContainer({
  children,
  minimumCount = 3
}) {
  const [isVisible, setIsVisible] = hooks.useState(false);
  hooks.useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, timerValue);
  }, []);
  const containerClasses = classNames.classNames([containerStyle.base]);
  return isVisible && children ? jsxRuntime.jsx("div", Object.assign({
    class: containerClasses,
    role: "presentation"
  }, {
    children: [...Array(minimumCount)].map((_element, index) => children(index))
  })) : null;
}

/**
 * Type for gridlines
 */

const gridlinesValues = utils_UNSAFE_arrayUtils.stringLiteralArray(['visible', 'hidden']);
const styles = {
  base: "_nhpugw"
};
const sparkleStyles = {
  base: "nh7a81",
  container: "_lwwt6p"
};

const getViewportConfig = (rootRef, config) => {
  return config !== null && config !== void 0 ? config : {
    scroller: () => {
      return rootRef.current;
    }
  };
};

const emptyKeys = {
  all: false,
  keys: new Set()
};

const handleSelectionRange = (detail, dataState) => {
  const keys = dataState.data.map(value => {
    return value.metadata.key;
  });
  const startIndex = keys.indexOf(detail.value.start);
  const endIndex = keys.indexOf(detail.value.end);
  const minIndex = Math.min(startIndex, endIndex);
  const maxIndex = Math.max(startIndex, endIndex);

  if (minIndex === -1) {
    // return a range to fetch, maxIndex should not be -1
    return {
      offset: 0,
      count: dataState.offset + keys.length
    };
  } else {
    // range of keys are in the current viewport, return them
    return keys.slice(minIndex, maxIndex + 1);
  }
};
/**
 * A sparkle component for smart suggestion indicator in ListView
 * @param sparkleHeight the height of sparkle
 */


function Sparkle({
  sparkleHeight
}) {
  if (sparkleHeight <= 0) {
    return null;
  }

  const height = sparkleHeight + 'px';
  const sparkleClasses = classNames.classNames([sparkleStyles.base]);
  const containerClasses = classNames.classNames([sparkleStyles.container]);
  return jsxRuntime.jsx("div", Object.assign({
    class: containerClasses
  }, {
    children: jsxRuntime.jsx("div", {
      class: sparkleClasses,
      style: {
        height
      }
    })
  }), "sparkle");
}
/**
 * Component that renders items as a flat list.
 * In order to maximize performance, only items that are visible in the viewport are rendered.
 */

function ListView({
  accessibleSummary,
  data,
  children,
  currentKey,
  gridlines = 'hidden',
  selectedKeys = emptyKeys,
  selectionMode = 'none',
  onCurrentKeyChange,
  onLoadRange,
  onSelectionChange,
  viewportConfig
}) {
  const rootRef = hooks.useRef(null); // tracking the anchor key which is used for shift+click selection

  const anchorKey = hooks.useRef(); // tracking

  const pendingSelection = hooks.useRef(); // tracking sparkle height

  const [sparkleHeight, setSparkleHeight] = hooks.useState(0);

  const showGridline = index => {
    // gridlines are positioned at the top so never show it for the first item
    return gridlines === 'visible' && index > 0;
  };

  const ariaMultiSelectable = selectionMode === 'none' ? undefined : selectionMode === 'multiple';
  const ariaRowCount = data === null ? undefined : data.sizePrecision === 'exact' ? data.totalSize : -1;
  const classes = classNames.classNames([styles.base]);
  const {
    currentKeyProps
  } = hooks_PRIVATE_useCurrentKey.useCurrentKey(keyExtractor, getPrevNextKey(rootRef.current, currentKey, true), getPrevNextKey(rootRef.current, currentKey, false), currentKey, onCurrentKeyChange);
  const handleInitialFocus = hooks.useCallback(() => {
    if (rootRef.current && onCurrentKeyChange) {
      const firstKey = getFirstVisibleKey(rootRef.current);

      if (utils_UNSAFE_keys.isKeyDefined(firstKey)) {
        onCurrentKeyChange({
          value: firstKey
        });
      }
    }
  }, [currentKey, onCurrentKeyChange]);
  const focusHandler = !utils_UNSAFE_keys.isKeyDefined(currentKey) && onCurrentKeyChange ? {
    onFocus: handleInitialFocus
  } : {};
  const [showFocusRing, focusRingProps] = hooks_PRIVATE_useCollectionFocusRing.useCollectionFocusRing(elem => {
    var _a;

    return !!((_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.contains(elem));
  }, ['ArrowUp', 'ArrowDown']);
  hooks.useEffect(() => {
    if (currentKey != null && rootRef.current) {
      const elem = findElementByKey(rootRef.current, currentKey);

      if (elem) {
        const scroller = viewportConfig === null || viewportConfig === void 0 ? void 0 : viewportConfig.scroller(); // make sure item is visible

        scrollToVisible(elem, scroller != null ? scroller : rootRef.current);
        const cell = elem.querySelector('[role=option]'); // update aria-activedescendant for screenreader

        if (cell) {
          rootRef.current.setAttribute('aria-activedescendant', cell.id);
        }
      }
    }
  }, [currentKey]);
  const handleSelectionChange = hooks.useCallback(detail => {
    if (onSelectionChange) {
      if (detail.value.all === false && detail.value.keys.size > 0) {
        // the last key selected by a user gesture is the anchor key
        anchorKey.current = Array.from(detail.value.keys).pop();
      }

      onSelectionChange(detail);
    }
  }, [anchorKey, onSelectionChange]);
  const handleSelectionRangeChange = hooks.useCallback(detail => {
    if (data && onSelectionChange) {
      const value = handleSelectionRange(detail, data);

      if (Array.isArray(value)) {
        onSelectionChange({
          value: {
            all: false,
            keys: new Set(value)
          }
        });
      } else {
        pendingSelection.current = detail;
        onLoadRange(value);
      }
    }
  }, [data, onSelectionChange, pendingSelection, onLoadRange]);
  const {
    selectionProps
  } = hooks_PRIVATE_useSelection.useSelection(event => {
    if (event.target === rootRef.current) {
      return currentKey === undefined ? null : currentKey;
    }

    return keyExtractor(event);
  }, selectedKeys, selectionMode, false, 'replace', handleSelectionChange, anchorKey.current, currentKey, (currentKey, isPrev) => getPrevNextKey(rootRef.current, currentKey, isPrev), key => {
    if (rootRef.current) {
      const elem = findElementByKey(rootRef.current, key);

      if (elem) {
        const scroller = viewportConfig === null || viewportConfig === void 0 ? void 0 : viewportConfig.scroller();
        scrollToVisible(elem, scroller != null ? scroller : rootRef.current);
      }
    }
  }, handleSelectionRangeChange);

  if (data && pendingSelection.current && onSelectionChange) {
    const keys = handleSelectionRange(pendingSelection.current, data);

    if (Array.isArray(keys)) {
      onSelectionChange({
        value: {
          all: false,
          keys: new Set(keys)
        }
      });
      pendingSelection.current = undefined;
    }
  }

  const loadMoreIndicator = jsxRuntime.jsx(SkeletonContainer, Object.assign({
    minimumCount: 3
  }, {
    children: () => {
      return jsxRuntime.jsx(Flex.Flex, Object.assign({
        height: "12x",
        align: "center"
      }, {
        children: jsxRuntime.jsx(Skeleton.Skeleton, {
          height: "4x"
        })
      }));
    }
  }));

  const suggestions = hooks.useMemo(() => findSuggestions(data), [data === null || data === void 0 ? void 0 : data.data]); // TODO: check suggestions before Sparkle would cause a scrolling issue

  const sparkleIndicator = jsxRuntime.jsx(Sparkle, {
    sparkleHeight: sparkleHeight
  });

  hooks.useEffect(() => {
    var _a, _b; // update sparkleHeight only when we have suggestions
    // avoid unnecessary iterating through elements


    if (suggestions) {
      const placeholder = (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.querySelector('.' + VirtualizedCollection.PLACEHOLDER_STYLE_CLASS);
      let height = placeholder.offsetHeight;
      const suggestionItems = (_b = rootRef.current) === null || _b === void 0 ? void 0 : _b.querySelectorAll('[data-oj-suggestion]');
      suggestionItems === null || suggestionItems === void 0 ? void 0 : suggestionItems.forEach(item => height += item.offsetHeight);
      setSparkleHeight(height);
    }
  }, [suggestions]); // if data is not specified, listview should show loading indicator
  // todo: replace placeholder with actual SkeletonContainer component (Ash is working on)

  return jsxRuntime.jsx("div", Object.assign({}, utils_UNSAFE_mergeProps.mergeProps(currentKeyProps, selectionProps, focusRingProps, focusHandler), {
    role: "listbox",
    "aria-rowcount": ariaRowCount,
    "aria-colcount": 1,
    ref: rootRef,
    class: classes,
    tabIndex: 0,
    "aria-label": accessibleSummary,
    "aria-multiselectable": ariaMultiSelectable
  }, {
    children: data == null ? jsxRuntime.jsx(SkeletonContainer, {
      children: () => {
        return jsxRuntime.jsx(Flex.Flex, Object.assign({
          height: "12x",
          align: "center"
        }, {
          children: jsxRuntime.jsx(Skeleton.Skeleton, {
            height: "4x"
          })
        }));
      }
    }) : jsxRuntime.jsx(VirtualizedCollection.VirtualizedCollection, Object.assign({
      data: data,
      onLoadRange: onLoadRange,
      itemSelector: '.' + ITEM_STYLE_CLASS,
      viewportConfig: getViewportConfig(rootRef, viewportConfig),
      loadMoreIndicator: loadMoreIndicator,
      suggestions: sparkleIndicator
    }, {
      children: context => {
        const suggestion = suggestions === null || suggestions === void 0 ? void 0 : suggestions.get(context.metadata.key);
        return jsxRuntime.jsx(ListViewItem, Object.assign({
          itemIndex: context.index,
          itemKey: context.metadata.key,
          currentKey: currentKey,
          isFocusRingVisible: showFocusRing,
          isGridlineVisible: showGridline(context.index),
          selectedKeys: selectedKeys,
          selectionMode: selectionMode,
          onSelectionChange: handleSelectionChange
        }, suggestion && {
          suggestion
        }, {
          children: children(context)
        }));
      }
    }))
  }));
}
/**
 * A helper function that finds the data with suggestions, and
 * returns the corresponding keys
 * @param dataState
 */

const findSuggestions = dataState => {
  const data = dataState === null || dataState === void 0 ? void 0 : dataState.data;
  const count = getSuggestionsCount(data);

  if (count === 0) {
    return null;
  }

  const suggestionsData = data.slice(0, count);
  return suggestionsData.reduce((suggestions, value, index) => {
    const key = value.metadata.key;

    if (index === count - 1) {
      suggestions.set(key, 'end');
    } else {
      suggestions.set(key, true);
    }

    return suggestions;
  }, new Map());
};
/**
 * A helper function that finds the number of suggestions
 * @param data
 */


const getSuggestionsCount = data => {
  if (!data) {
    return 0;
  }

  const index = data.findIndex(value => !value.metadata.suggestion);
  return index === -1 ? 0 : index;
};
/**
 * Returns the key from the item element
 */


const getKey = item => {
  return item.dataset['ojKeyType'] === 'number' ? Number(item.dataset['ojKey']) : item.dataset['ojKey'];
};
/**
 * A helper function to find the element with the specified key.
 * Returns null if the element with key is not found.
 */


const findElementByKey = (root, key) => {
  if (root) {
    const items = root.querySelectorAll('.' + ITEM_STYLE_CLASS);

    for (let i = 0; i < items.length; i++) {
      const thisKey = getKey(items[i]);

      if (key == thisKey) {
        return items[i];
      }
    }
  }

  return null;
};
/**
 * A helper function that return the key of the first available item.
 */


const getFirstVisibleKey = root => {
  if (root) {
    const firstItem = root.querySelector('.' + ITEM_STYLE_CLASS);

    if (firstItem) {
      const key = getKey(firstItem);
      return key;
    }
  }

  return null;
};
/**
 * A helper function that returns the key of the previous or the next item
 * given the specified current key
 */


const getPrevNextKey = (root, currentKey, isPrev) => {
  return () => {
    if (utils_UNSAFE_keys.isKeyDefined(currentKey) && root) {
      const currItem = findElementByKey(root, currentKey);

      if (currItem) {
        const nextItem = isPrev ? currItem.previousElementSibling : currItem.nextElementSibling;

        if (nextItem) {
          return getKey(nextItem);
        }
      }

      return getFirstVisibleKey(root);
    }

    return null;
  };
};
/**
 * A helper function to make sure specified elem is visible in the specified container
 */


const scrollToVisible = (elem, scroller) => {
  if (elem && scroller) {
    const scrollerBounds = scroller.getBoundingClientRect();
    const elemBounds = elem.getBoundingClientRect();

    if (elemBounds.bottom > scrollerBounds.bottom) {
      scroller.scrollTop = scroller.scrollTop + (elemBounds.bottom - scrollerBounds.bottom);
    } else if (elemBounds.top < scrollerBounds.top) {
      scroller.scrollTop = scroller.scrollTop - (scrollerBounds.top - elemBounds.top);
    }
  }
};
/**
 * A helper function to get the key from an event
 */


const keyExtractor = event => {
  const elem = event.target;
  const item = elem.closest('.' + ITEM_STYLE_CLASS);

  if (item) {
    const key = getKey(item);
    return key === undefined ? null : key;
  }

  return null;
};

exports.ListView = ListView;
/*  */
//# sourceMappingURL=ListView-7db989a7.js.map
