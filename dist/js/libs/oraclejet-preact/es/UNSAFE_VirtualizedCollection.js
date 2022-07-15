/* @oracle/oraclejet-preact: 13.0.0 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import { useRef, useEffect } from 'preact/hooks';
import { Collection } from './UNSAFE_Collection.js';
import { stringLiteralArray } from './utils/UNSAFE_arrayUtils.js';
import { useViewportIntersect } from './hooks/UNSAFE_useViewportIntersect.js';
import 'preact';

const placeholderTypes = stringLiteralArray(['topPlaceholder', 'bottomPlaceholder']);
const PLACEHOLDER_STYLE_CLASS = 'oj-collection-placeholder';
const DEFAULT_PLACEHOLDER_SIZE = 48; // min-height defined in Redwood spec for item
const TOP_PLACEHOLDER_KEY = '_topPlaceholder';
const BOTTOM_PLACEHOLDER_KEY = '_bottomPlaceholder';
/**
 * A component that renders placeholder which is used internally by VirtualizeViewportCollection
 */
const Placeholder = ({ context, placeholderHeight }) => {
    const { fromIndex, toIndex, which, estimateItemSize } = context;
    let totalHeight = 0;
    if (placeholderHeight) {
        totalHeight = placeholderHeight(context);
    }
    else {
        const placeholderUnitHeight = estimateItemSize === 0 ? DEFAULT_PLACEHOLDER_SIZE : estimateItemSize;
        totalHeight = Math.max(0, toIndex - fromIndex) * placeholderUnitHeight;
    }
    const key = which === 'topPlaceholder' ? TOP_PLACEHOLDER_KEY : BOTTOM_PLACEHOLDER_KEY;
    const style = { height: totalHeight + 'px' };
    if (totalHeight === 0) {
        style.display = 'none';
    }
    return jsx("div", { className: PLACEHOLDER_STYLE_CLASS, style: style }, key);
};

/**
 * A function that returns the default range extractor
 * @param fetchSize
 */
function getDefaultRangeExtractor(fetchSize) {
    return function ({ itemSize, viewportHeight, scrollOffset, overscan = 0 }) {
        // if any of these is missing then return default initial range
        if (itemSize === undefined ||
            itemSize === 0 ||
            viewportHeight === undefined ||
            scrollOffset === undefined) {
            return { offset: 0, count: fetchSize };
        }
        const offset = Math.ceil(scrollOffset / itemSize);
        const count = Math.ceil(viewportHeight / itemSize);
        return {
            offset: Math.max(0, offset - overscan),
            count: count + overscan * (offset > 0 ? 2 : 1)
        };
    };
}
/**
 * Helper function to find the top and bottom of an element relative to the viewport
 * @param elem
 */
const getElementTopBottom = (elem) => {
    let top;
    let bottom;
    if (elem === document.documentElement) {
        top = 0;
        bottom = document.documentElement.clientHeight;
    }
    else {
        const scrollerBounds = elem.getBoundingClientRect();
        top = scrollerBounds.top;
        bottom = scrollerBounds.bottom;
    }
    return { top, bottom };
};
const isDataStateValid = (dataState) => {
    return dataState && dataState.data && dataState.offset >= 0 && dataState.totalSize >= 0;
};
const DEFAULT_MARGIN = 1;
/**
 * Returns the range for the current viewport
 */
const getViewportRange = (scroller, root, overscan, rangeExtractor, estimateItemSize) => {
    let scrollOffset;
    let viewportHeight;
    if (scroller && root) {
        const rootRect = root.getBoundingClientRect();
        const viewportRect = getElementTopBottom(scroller);
        if (rootRect && viewportRect) {
            scrollOffset = viewportRect.top - rootRect.top - DEFAULT_MARGIN;
            viewportHeight = viewportRect.bottom - viewportRect.top + DEFAULT_MARGIN;
        }
    }
    if (scrollOffset !== undefined && viewportHeight !== undefined) {
        // figure out what the new range should be
        const range = rangeExtractor({
            scrollOffset,
            viewportHeight,
            overscan: overscan,
            itemSize: estimateItemSize
        });
        return range;
    }
    return null;
};
/**
 * Adjust the DataState as needed if it contains more than needed for the specified range
 */
const adjustDataState = (dataState, range) => {
    if (range) {
        // prevent range offset from being larger than the data state
        const safeRangeOffset = Math.min(range.offset, dataState.offset + dataState.totalSize);
        const diff = safeRangeOffset - dataState.offset;
        if (diff > 0) {
            dataState = {
                offset: safeRangeOffset,
                data: dataState.data.slice(diff, diff + range.count),
                totalSize: dataState.totalSize,
                sizePrecision: dataState.sizePrecision
            };
        }
    }
    return dataState;
};
const DEFAULT_OVERSCAN = 1;
const DEFAULT_END_INDEX = 25; // match default fetch size
const LOADMORE_STYLE_CLASS = 'oj-collection-loadmore';
const LOAD_MORE_AND_PLACEHOLDER_SELECTOR = `.${LOADMORE_STYLE_CLASS}, .${PLACEHOLDER_STYLE_CLASS}`;
const DEFAULT_RANGE_EXTRACTOR = getDefaultRangeExtractor(DEFAULT_END_INDEX);
/**
 * Component that only render items in the specified viewport.
 * @param props
 */
function VirtualizedCollection({ data, children, viewportConfig, itemSelector, placeholderHeight, rangeExtractor = DEFAULT_RANGE_EXTRACTOR, overscan = DEFAULT_OVERSCAN, onLoadRange, loadMoreIndicator, suggestions }) {
    var _a, _b, _c;
    const rootRef = useRef(null);
    const estimateItemSizeRef = useRef(0);
    // detect if viewport has changed and it needs to re-render based on a new range
    useViewportIntersect(viewportConfig, DEFAULT_MARGIN, LOAD_MORE_AND_PLACEHOLDER_SELECTOR, () => {
        var _a;
        const range = getViewportRange(viewportConfig.scroller(), rootRef.current, overscan, rangeExtractor, (_a = estimateItemSizeRef.current) !== null && _a !== void 0 ? _a : 0);
        if (range) {
            onLoadRange(range);
        }
    });
    // calculate average item height.  For now, we'll just do this once, but we can
    // do a rolling average where we'll adjust on every render.
    useEffect(() => {
        if (estimateItemSizeRef.current === 0) {
            let totalHeight = 0;
            const nodes = rootRef.current.querySelectorAll(itemSelector);
            if (nodes.length > 0) {
                nodes.forEach((item) => {
                    totalHeight += item.offsetHeight;
                });
                estimateItemSizeRef.current = totalHeight / nodes.length;
            }
        }
    });
    // override itemRenderer to adjust the index
    const _getItemRenderer = (startIndex) => {
        // returns a new render function
        return (context) => {
            const listItemContext = {
                index: startIndex + context.index,
                metadata: context.data.metadata,
                data: context.data.data
            };
            return children(listItemContext);
        };
    };
    // if DataState is invalid (including not specified), just render blank
    if (!data || !isDataStateValid(data)) {
        return jsx("div", { ref: rootRef });
    }
    // render the range specified in DataState
    const viewportRange = getViewportRange(viewportConfig.scroller(), rootRef.current, overscan, rangeExtractor, (_a = estimateItemSizeRef.current) !== null && _a !== void 0 ? _a : 0);
    const dataState = adjustDataState(data, viewportRange);
    const rangeData = dataState.data;
    const offset = dataState.offset;
    const endIndex = offset + rangeData.length;
    const itemCount = dataState.totalSize;
    const topPlaceholderContext = offset >= 0
        ? {
            fromIndex: 0,
            toIndex: offset,
            which: 'topPlaceholder',
            estimateItemSize: (_b = estimateItemSizeRef.current) !== null && _b !== void 0 ? _b : 0
        }
        : undefined;
    const bottomPlaceholderContext = endIndex && endIndex <= itemCount
        ? {
            fromIndex: endIndex,
            toIndex: itemCount,
            which: 'bottomPlaceholder',
            estimateItemSize: (_c = estimateItemSizeRef.current) !== null && _c !== void 0 ? _c : 0
        }
        : undefined;
    const renderLoadMore = dataState.sizePrecision === 'atLeast' && endIndex <= itemCount;
    // might need to support elementType prop in the future to allow customization of what
    // type of element to render for the root
    return (jsxs("div", Object.assign({ ref: rootRef, style: "will-change: contents" }, { children: [suggestions, topPlaceholderContext && (jsx(Placeholder, { context: topPlaceholderContext, placeholderHeight: placeholderHeight })), jsx(Collection, Object.assign({ items: rangeData }, { children: _getItemRenderer(offset) })), bottomPlaceholderContext && (jsx(Placeholder, { context: bottomPlaceholderContext, placeholderHeight: placeholderHeight })), renderLoadMore && jsx("div", Object.assign({ class: LOADMORE_STYLE_CLASS }, { children: loadMoreIndicator }))] })));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { PLACEHOLDER_STYLE_CLASS, VirtualizedCollection, getDefaultRangeExtractor };
/*  */
//# sourceMappingURL=UNSAFE_VirtualizedCollection.js.map
