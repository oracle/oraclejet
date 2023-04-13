/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx } from 'preact/jsx-runtime';
import { Component } from 'preact';
import { Root, customElement } from 'ojs/ojvcomponent';
import { getTranslatedString } from 'ojs/ojtranslation';
import { KEYBOARD_KEYS, handleActionablePrevTab, handleActionableTab, getNoJQFocusHandlers, getActionableElementsInNode, disableAllFocusableElements, enableAllFocusableElements } from 'ojs/ojdatacollection-common';
import Context from 'ojs/ojcontext';
import { IteratingDataProviderContentHandler, IteratingTreeDataProviderContentHandler } from 'ojs/ojvcollection';
import oj from 'ojs/ojcore-base';
import { KeySetImpl } from 'ojs/ojkeyset';
import 'ojs/ojtreedataprovider';
import { fadeOut } from 'ojs/ojanimation';
import { parseJSONFromFontFamily } from 'ojs/ojthemeutils';
import { makeFocusable } from 'ojs/ojdomutils';

class StreamListContentHandler extends IteratingDataProviderContentHandler {
    constructor(root, dataProvider, callback, scrollPolicy, scrollPolicyOptions) {
        super(root, dataProvider, callback, scrollPolicy, scrollPolicyOptions);
        this.root = root;
        this.dataProvider = dataProvider;
        this.callback = callback;
        this.scrollPolicy = scrollPolicy;
        this.scrollPolicyOptions = scrollPolicyOptions;
        this.postRender = () => {
            if (this.viewportResolveFunc) {
                return;
            }
            this.vnodesCache = this.newVnodesCache;
            this.newVnodesCache = new Map();
            const itemsRoot = this.root.lastElementChild;
            if (itemsRoot) {
                this.viewportResolveFunc = this.addBusyState('checking viewport');
                const busyContext = Context.getContext(itemsRoot).getBusyContext();
                busyContext.whenReady().then(() => {
                    if (this.viewportResolveFunc) {
                        this.viewportResolveFunc();
                    }
                    this.viewportResolveFunc = null;
                    if (this.callback && this.domScroller) {
                        const itemsRoot = this.root.lastElementChild;
                        const items = itemsRoot.querySelectorAll('.oj-stream-list-item');
                        if (items.length > 0) {
                            const rootOffsetTop = this.root.offsetTop;
                            const start = items[0].offsetTop - rootOffsetTop;
                            const end = items[items.length - 1].offsetTop +
                                items[items.length - 1].offsetHeight -
                                rootOffsetTop;
                            this.domScroller.setViewportRange(start, end);
                        }
                        this.checkViewport();
                    }
                }, () => {
                    if (this.viewportResolveFunc) {
                        this.viewportResolveFunc();
                    }
                    this.viewportResolveFunc = null;
                });
            }
        };
        this.newItemsTracker = new Set();
        this.vnodesCache = new Map();
        this.newVnodesCache = new Map();
    }
    fetchSuccess(result) {
        if (result != null) {
            this.newItemsTracker.clear();
        }
        super.fetchSuccess(result);
    }
    handleItemsUpdated(detail) {
        detail.keys.forEach(function (key) {
            this.vnodesCache.delete(key);
        }.bind(this));
        super.handleItemsUpdated(detail);
    }
    handleItemsRemoved(detail) {
        detail.keys.forEach(function (key) {
            this.vnodesCache.delete(key);
        }.bind(this));
        super.handleItemsRemoved(detail);
    }
    handleModelRefresh() {
        this.vnodesCache.clear();
        super.handleModelRefresh();
    }
    addItem(key, index, data, visible) {
        const initialFetch = this.isInitialFetch();
        const currentItem = this.callback.getCurrentItem();
        if (currentItem == null && initialFetch && index == 0) {
            this.callback.setCurrentItem(key);
        }
        const vnodes = this.renderItem(key, index, data);
        this.decorateItem(vnodes, key, index, initialFetch, visible);
        return vnodes[0];
    }
    renderItem(key, index, data) {
        const renderer = this.callback.getItemRenderer();
        const vnodes = renderer({ data, key });
        let vnode = this.findItemVNode(vnodes);
        const prunedVnodes = [vnode];
        this.newVnodesCache.set(key, { vnodes: prunedVnodes });
        return prunedVnodes;
    }
    decorateItem(vnodes, key, index, initialFetch, visible) {
        const vnode = vnodes[0];
        if (vnode != null) {
            vnode.key = key;
            vnode.props.role = 'listitem';
            vnode.props.tabIndex = -1;
            vnode.props['data-oj-key'] = key;
            if (typeof key === 'number') {
                vnode.props['data-oj-key-type'] = 'number';
            }
            const styleClasses = this.getItemStyleClass(visible, this.newItemsTracker.has(key), initialFetch);
            this.setStyleClass(vnode, styleClasses);
        }
    }
    getItemStyleClass(visible, isNew, animate) {
        const styleClass = [];
        styleClass.push('oj-stream-list-item');
        if (animate) {
        }
        return styleClass;
    }
    renderSkeletonsForLoadMore() {
        return this.callback.renderSkeletons(3);
    }
}

class StreamListTreeContentHandler extends IteratingTreeDataProviderContentHandler {
    constructor(root, dataProvider, callback, scrollPolicy, scrollPolicyOptions) {
        super(root, dataProvider, callback, scrollPolicy, scrollPolicyOptions);
        this.root = root;
        this.dataProvider = dataProvider;
        this.callback = callback;
        this.scrollPolicy = scrollPolicy;
        this.scrollPolicyOptions = scrollPolicyOptions;
        this.postRender = () => {
            this.vnodesCache = this.newVnodesCache;
            this.newVnodesCache = new Map();
            const itemsRoot = this.root.lastElementChild;
            if (itemsRoot) {
                this.checkViewport();
            }
        };
        this.getLoadMoreCount = () => {
            return 3;
        };
        this.newItemsTracker = new Set();
        this.vnodesCache = new Map();
        this.newVnodesCache = new Map();
    }
    handleFetchSuccess(result) {
        if (result != null) {
            this.newItemsTracker.clear();
        }
        super.handleFetchSuccess(result);
    }
    handleItemsUpdated(detail) {
        detail.keys.forEach(function (key) {
            this.vnodesCache.delete(key);
        }.bind(this));
        super.handleItemsUpdated(detail);
    }
    handleItemsRemoved(detail) {
        detail.keys.forEach(function (key) {
            this.vnodesCache.delete(key);
        }.bind(this));
        super.handleItemsRemoved(detail);
    }
    handleModelRefresh(detail) {
        this.vnodesCache.clear();
        super.handleModelRefresh(detail);
    }
    destroy() {
        super.destroy();
        this._resolveCheckViewportBusyState();
    }
    _resolveCheckViewportBusyState() {
        if (this.viewportResolveFunc) {
            this.viewportResolveFunc();
        }
        this.viewportResolveFunc = null;
    }
    checkViewport() {
        if (this.viewportResolveFunc) {
            return;
        }
        this.viewportResolveFunc = this.addBusyState('checking viewport');
        const itemsRoot = this.root.lastElementChild;
        if (itemsRoot) {
            const busyContext = Context.getContext(itemsRoot).getBusyContext();
            busyContext.whenReady().then(() => {
                if (this.callback != null) {
                    super.checkViewport();
                    this._resolveCheckViewportBusyState();
                }
            }, () => {
                this._resolveCheckViewportBusyState();
            });
        }
    }
    addItem(metadata, index, data, visible) {
        const initialFetch = this.isInitialFetch();
        const currentItem = this.callback.getCurrentItem();
        if (currentItem == null && initialFetch && index == 0) {
            this.callback.setCurrentItem(metadata.key);
        }
        const vnodes = this.renderItem(metadata, index, data);
        this.decorateItem(vnodes, metadata, index, initialFetch, visible);
        return vnodes[0];
    }
    renderItem(metadata, index, data) {
        const key = metadata.key;
        let renderer;
        let vnodes;
        if (metadata.isLeaf === false) {
            renderer = this.callback.getGroupRenderer();
        }
        if (renderer == null) {
            renderer = this.callback.getItemRenderer();
        }
        vnodes = renderer({
            data,
            key: metadata.key,
            leaf: metadata.isLeaf,
            parentKey: metadata.parentKey,
            depth: metadata.treeDepth
        });
        let vnode = this.findItemVNode(vnodes);
        const prunedVnodes = [vnode];
        this.newVnodesCache.set(key, { vnodes: prunedVnodes });
        return prunedVnodes;
    }
    decorateItem(vnodes, metadata, index, initialFetch, visible) {
        const vnode = vnodes[0];
        if (vnode != null) {
            vnode.key = metadata.key;
            vnode.props.role = 'treeitem';
            vnode.props.tabIndex = -1;
            vnode.props['data-oj-key'] = metadata.key;
            if (typeof metadata.key === 'number') {
                vnode.props['data-oj-key-type'] = 'number';
            }
            const styleClasses = this.getItemStyleClass(metadata, visible, this.newItemsTracker.has(metadata.key), initialFetch);
            this.setStyleClass(vnode, styleClasses);
            if (!metadata.isLeaf) {
                const expandedProp = this.callback.getExpanded();
                const expanded = expandedProp && expandedProp.has(metadata.key);
                if (expanded) {
                    vnode.props['aria-expanded'] = true;
                }
                else {
                    vnode.props['aria-expanded'] = false;
                }
            }
        }
    }
    getItemStyleClass(metadata, visible, isNew, animate) {
        const styleClass = [];
        if (!metadata.isLeaf) {
            styleClass.push('oj-stream-list-group');
        }
        else {
            styleClass.push('oj-stream-list-item');
        }
        if (animate) {
        }
        return styleClass;
    }
    renderSkeletonsForLoadMore() {
        return this.callback.renderSkeletons(3);
    }
    renderSkeletonsForExpand(key) {
        return this.callback.renderSkeletons(this.getLoadMoreCount(), true, key);
    }
}

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StreamList_1;
let StreamList = StreamList_1 = class StreamList extends Component {
    constructor(props) {
        super(props);
        this.restoreFocus = false;
        this.actionableMode = false;
        this.skeletonHeight = 0;
        this.height = 0;
        this._handleFocusIn = (event) => {
            this._clearFocusoutTimeout();
            const target = event.target;
            const item = target.closest('.oj-stream-list-item, .oj-stream-list-group');
            if (item && this._isFocusable(target, item)) {
                this._enterActionableMode(target);
            }
            else if (this.currentItem && !this.actionableMode) {
                this.focusInHandler(this.currentItem);
            }
        };
        this._handleFocusOut = () => {
            this._clearFocusoutTimeout();
            if (this.actionableMode) {
                this._focusoutTimeout = setTimeout(function () {
                    this._doBlur();
                }.bind(this), 100);
            }
            else if (!this._isFocusBlurTriggeredByDescendent(event)) {
                this._doBlur();
            }
        };
        this._handleClick = (event) => {
            const target = event.target;
            const group = target.closest('.' + this.getGroupStyleClass());
            if (group) {
                const key = this.contentHandler.getKey(group);
                const expanded = this.props.expanded.has(key);
                this._handleToggleExpanded(key, expanded);
            }
            this._handleTouchOrClickEvent(event);
        };
        this._handleKeyDown = (event) => {
            if (this.currentItem) {
                let next;
                switch (event.key) {
                    case KEYBOARD_KEYS._LEFT:
                    case KEYBOARD_KEYS._LEFT_IE:
                    case KEYBOARD_KEYS._RIGHT:
                    case KEYBOARD_KEYS._RIGHT_IE: {
                        if (this.currentItem.classList.contains(this.getGroupStyleClass())) {
                            const group = this.currentItem;
                            const key = this.contentHandler.getKey(group);
                            const expanded = this.props.expanded.has(key);
                            if (((event.key === KEYBOARD_KEYS._RIGHT ||
                                event.key === KEYBOARD_KEYS._RIGHT_IE) &&
                                !expanded) ||
                                ((event.key === KEYBOARD_KEYS._LEFT ||
                                    event.key === KEYBOARD_KEYS._LEFT_IE) &&
                                    expanded)) {
                                this._handleToggleExpanded(key, expanded);
                            }
                        }
                        break;
                    }
                    case KEYBOARD_KEYS._UP:
                    case KEYBOARD_KEYS._UP_IE: {
                        if (this.actionableMode === false) {
                            next = this.currentItem.previousElementSibling;
                            while (next &&
                                next.previousElementSibling &&
                                next.classList.contains('oj-stream-list-skeleton')) {
                                next = next.previousElementSibling;
                            }
                        }
                        break;
                    }
                    case KEYBOARD_KEYS._DOWN:
                    case KEYBOARD_KEYS._DOWN_IE: {
                        if (this.actionableMode === false) {
                            next = this.currentItem.nextElementSibling;
                            while (next &&
                                next.nextElementSibling &&
                                next.classList.contains('oj-stream-list-skeleton')) {
                                next = next.nextElementSibling;
                            }
                        }
                        break;
                    }
                    case KEYBOARD_KEYS._F2: {
                        event.stopPropagation();
                        if (this.actionableMode === false) {
                            this._enterActionableMode();
                        }
                        else {
                            this._exitActionableMode(true);
                        }
                        break;
                    }
                    case KEYBOARD_KEYS._ESCAPE:
                    case KEYBOARD_KEYS._ESCAPE_IE: {
                        if (this.actionableMode === true) {
                            this._exitActionableMode(true);
                        }
                        break;
                    }
                    case KEYBOARD_KEYS._TAB: {
                        if (this.actionableMode === true && this.currentItem) {
                            if (event.shiftKey) {
                                if (handleActionablePrevTab(event, this.currentItem)) {
                                    event.preventDefault();
                                }
                            }
                            else {
                                if (handleActionableTab(event, this.currentItem)) {
                                    event.preventDefault();
                                }
                            }
                        }
                        break;
                    }
                }
                if (next != null &&
                    (next.classList.contains(this.getItemStyleClass()) ||
                        next.classList.contains(this.getGroupStyleClass()))) {
                    this._updateCurrentItemAndFocus(next, true);
                    event.preventDefault();
                }
            }
        };
        this.setRootElement = (element) => {
            this.root = element;
        };
        this.scrollListener = () => {
            const self = this;
            if (this.getData() != null && !this._ticking) {
                window.requestAnimationFrame(function () {
                    self._updateScrollPosition();
                    self._ticking = false;
                });
                this._ticking = true;
            }
        };
        this.state = {
            renderedData: null,
            outOfRangeData: null,
            initialSkeleton: false,
            initialSkeletonCount: 1,
            expandedToggleKeys: new KeySetImpl(),
            expandedSkeletonKeys: new KeySetImpl(),
            expandingKeys: new KeySetImpl(),
            toCollapse: [],
            lastExpanded: props.expanded
        };
    }
    _clearFocusoutTimeout() {
        if (this._focusoutTimeout) {
            clearTimeout(this._focusoutTimeout);
            this._focusoutTimeout = null;
        }
    }
    _handleToggleExpanded(key, expanded) {
        this.setState(function (state, props) {
            var _a, _b;
            let expandedToggleKeys = state.expandedToggleKeys;
            if (!expandedToggleKeys.has(key)) {
                expandedToggleKeys = expandedToggleKeys.add([key]);
                let newExpanded = props.expanded;
                expandedToggleKeys.values().forEach((key) => {
                    if (expanded) {
                        newExpanded = newExpanded.delete([key]);
                    }
                    else {
                        newExpanded = newExpanded.add([key]);
                    }
                });
                (_b = (_a = this.props).onExpandedChanged) === null || _b === void 0 ? void 0 : _b.call(_a, newExpanded);
                return { expandedToggleKeys };
            }
            return {};
        }.bind(this));
    }
    _touchStartHandler(event) {
        this._handleTouchOrClickEvent(event);
    }
    render() {
        const initialSkeleton = this.state.initialSkeleton;
        const initialSkeletonCount = this.state.initialSkeletonCount;
        let content;
        let data;
        if (this.contentHandler == null && initialSkeleton) {
            content = this._renderInitialSkeletons(initialSkeletonCount);
        }
        else {
            data = this.getData();
            if ((data != null && initialSkeleton) || data == null) {
                content = this._renderInitialSkeletons(initialSkeletonCount, data == null);
            }
            else if (data != null) {
                content = this.contentHandler.render(data);
                if (this.currentItem &&
                    this.currentItem.contains(document.activeElement) &&
                    !this.actionableMode) {
                    this.restoreFocus = true;
                }
            }
        }
        if (data == null) {
            return (jsx(Root, Object.assign({ ref: this.setRootElement }, { children: jsx("div", Object.assign({ role: "list", "data-oj-context": true, tabIndex: 0, "aria-label": getTranslatedString('oj-ojStreamList.msgFetchingData') }, { children: content })) })));
        }
        else {
            return (jsx(Root, Object.assign({ ref: this.setRootElement }, { children: jsx("div", Object.assign({ role: this._isTreeData() ? 'tree' : 'list', "data-oj-context": true, "aria-label": this.props['aria-label'], "aria-labelledby": this.props['aria-labelledby'], onClick: this._handleClick, onKeyDown: this._handleKeyDown, onfocusin: this._handleFocusIn, onfocusout: this._handleFocusOut }, { children: content })) })));
        }
    }
    _doBlur() {
        if (this.actionableMode) {
            this._exitActionableMode(false);
        }
        if (this.currentItem) {
            this.focusOutHandler(this.currentItem);
        }
    }
    _isFocusBlurTriggeredByDescendent(event) {
        if (event.relatedTarget === undefined) {
            return true;
        }
        if (event.relatedTarget == null || !this.root.contains(event.relatedTarget)) {
            return false;
        }
        return true;
    }
    _renderInitialSkeletons(count, shouldScroll) {
        if (shouldScroll) {
            const scroller = this._getScroller();
            if (scroller != null && scroller === this.root) {
                scroller.scrollTop = 0;
            }
        }
        return this.renderSkeletons(count);
    }
    renderSkeletons(count, indented, key) {
        const skeletons = [];
        const isTreeData = this._isTreeData();
        let skeletonKey;
        for (let i = 0; i < count; i++) {
            let shouldIndent = indented;
            if (!indented && isTreeData && i % 4) {
                shouldIndent = true;
            }
            if (key) {
                skeletonKey = key + '_' + i;
            }
            skeletons.push(this._renderSkeleton(shouldIndent, skeletonKey));
        }
        return skeletons;
    }
    _renderSkeleton(indented, key) {
        let className = 'oj-stream-list-skeleton';
        if (indented) {
            className += ' oj-stream-list-child-skeleton';
        }
        return (jsx("div", Object.assign({ class: className }, { children: jsx("div", { class: "oj-stream-list-skeleton-content oj-animation-skeleton" }) }), key));
    }
    _applySkeletonExitAnimation(skeletons) {
        const resolveFunc = this.addBusyState('apply skeleton exit animations');
        return new Promise((resolve, reject) => {
            const promises = [];
            skeletons.forEach((skeleton) => {
                promises.push(fadeOut(skeleton));
            });
            Promise.all(promises).then(function () {
                resolveFunc();
                resolve(true);
            });
        });
    }
    _isTreeData() {
        const data = this.props.data;
        return data != null && this.instanceOfTreeDataProvider(data);
    }
    instanceOfTreeDataProvider(object) {
        return 'getChildDataProvider' in object;
    }
    _postRender() {
        this._registerScrollHandler();
        const data = this.getData();
        const initialSkeleton = this.state.initialSkeleton;
        if (data != null && initialSkeleton) {
            const skeletons = this.getRootElement().querySelectorAll('.oj-stream-list-skeleton');
            this._applySkeletonExitAnimation(skeletons).then(function () {
                this.setState({ initialSkeleton: false });
            }.bind(this));
        }
        else if (data != null) {
            this.contentHandler.postRender();
        }
        const items = this.root.querySelectorAll('.oj-stream-list-item, .oj-stream-list-group');
        if (!this.actionableMode) {
            this._disableAllTabbableElements(items);
            this._restoreCurrentItem(items);
        }
    }
    _getScrollPolicyOptions() {
        return {
            fetchSize: this.props.scrollPolicyOptions.fetchSize,
            maxCount: this.props.scrollPolicyOptions.maxCount,
            scroller: this._getScroller()
        };
    }
    _debounce(callback, wait) {
        let timeout = null;
        return (...args) => {
            const next = () => callback(...args);
            clearTimeout(timeout);
            timeout = setTimeout(next, wait);
        };
    }
    componentDidMount() {
        const data = this.props.data;
        if (this._isTreeData()) {
            this.contentHandler = new StreamListTreeContentHandler(this.root, data, this, this.props.scrollPolicy, this._getScrollPolicyOptions());
        }
        else if (data != null) {
            this.contentHandler = new StreamListContentHandler(this.root, data, this, this.props.scrollPolicy, this._getScrollPolicyOptions());
        }
        this.height = this.root.clientHeight;
        const skeleton = this.root.querySelector('.oj-stream-list-skeleton');
        if (skeleton) {
            this.skeletonHeight = this.outerHeight(skeleton);
            this._delayShowSkeletons();
        }
        if (window['ResizeObserver']) {
            const root = this.root;
            const resizeObserver = new window['ResizeObserver'](this._debounce((entries) => {
                entries.forEach((entry) => {
                    if (entry.target === root && entry.contentRect) {
                        const currHeight = this.height;
                        const newHeight = Math.round(entry.contentRect.height);
                        if (Math.abs(newHeight - currHeight) > 1) {
                            this.height = newHeight;
                            if (this.contentHandler) {
                                this.contentHandler.checkViewport();
                            }
                        }
                    }
                });
            }, StreamList_1.debounceThreshold));
            resizeObserver.observe(root);
            this.resizeObserver = resizeObserver;
        }
        makeFocusable({
            applyHighlight: true,
            setupHandlers: (focusInHandler, focusOutHandler) => {
                const noJQHandlers = getNoJQFocusHandlers(focusInHandler, focusOutHandler);
                this.focusInHandler = noJQHandlers.focusIn;
                this.focusOutHandler = noJQHandlers.focusOut;
            }
        });
        const root = this.getRootElement();
        if (root) {
            root.addEventListener('touchstart', (event) => this._touchStartHandler(event), {
                passive: true
            });
        }
        this._postRender();
    }
    getSkeletonHeight() {
        return this.skeletonHeight;
    }
    outerHeight(el) {
        let height = el.offsetHeight;
        const style = getComputedStyle(el);
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);
        return height;
    }
    componentWillUnmount() {
        if (this.contentHandler) {
            this.contentHandler.destroy();
        }
        this.contentHandler = null;
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        this.resizeObserver = null;
        this._unregisterScrollHandler();
    }
    _delayShowSkeletons() {
        window.setTimeout(() => {
            const data = this.getData();
            if (data == null) {
                this.setState({
                    initialSkeleton: true,
                    initialSkeletonCount: Math.max(1, Math.floor(this.height / this.skeletonHeight))
                });
            }
        }, this._getShowSkeletonsDelay());
    }
    _getOptionDefaults() {
        if (this.defaultOptions == null) {
            this.defaultOptions = parseJSONFromFontFamily('oj-streamlist-option-defaults');
        }
        return this.defaultOptions;
    }
    _getShowSkeletonsDelay() {
        const defaultOptions = this._getOptionDefaults();
        if (defaultOptions == null) {
            return 0;
        }
        const delay = parseInt(defaultOptions.showIndicatorDelay, 10);
        return isNaN(delay) ? 0 : delay;
    }
    getRootElement() {
        return this.root;
    }
    componentDidUpdate(oldProps, oldState) {
        var _a, _b;
        if (this._isTreeData() && ((_a = this.contentHandler) === null || _a === void 0 ? void 0 : _a.collapse)) {
            (_b = this.contentHandler) === null || _b === void 0 ? void 0 : _b.collapse(this.state.toCollapse);
        }
        const oldExpandingKeys = oldState.expandingKeys;
        const expandingKeys = this.state.expandingKeys;
        expandingKeys.values().forEach(function (key) {
            var _a;
            if (!oldExpandingKeys.has(key)) {
                (_a = this.contentHandler) === null || _a === void 0 ? void 0 : _a.expand(key);
            }
        }.bind(this));
        if (this.props.data != oldProps.data) {
            if (this.contentHandler) {
                this.contentHandler.destroy();
            }
            this.setCurrentItem(null);
            this.setState({
                renderedData: null,
                outOfRangeData: null,
                initialSkeleton: false,
                initialSkeletonCount: this.state.initialSkeletonCount,
                expandedToggleKeys: new KeySetImpl(),
                expandedSkeletonKeys: new KeySetImpl(),
                expandingKeys: new KeySetImpl()
            });
            if (this._isTreeData()) {
                this.contentHandler = new StreamListTreeContentHandler(this.root, this.props.data, this, this.props.scrollPolicy, this._getScrollPolicyOptions());
                this._delayShowSkeletons();
            }
            else if (this.props.data != null) {
                this.contentHandler = new StreamListContentHandler(this.root, this.props.data, this, this.props.scrollPolicy, this._getScrollPolicyOptions());
                this._delayShowSkeletons();
            }
        }
        this._postRender();
        if (!oj.Object.compareValues(this.props.scrollPosition, oldProps.scrollPosition) &&
            !oj.Object.compareValues(this.props.scrollPosition, this.lastInternalScrollPositionUpdate)) {
            this._syncScrollTopWithProps();
        }
    }
    static getDerivedStateFromProps(props, state) {
        let { expandedToggleKeys, expandingKeys, renderedData, expandedSkeletonKeys, lastExpanded } = state;
        if (!renderedData)
            return {};
        const toCollapse = [];
        const newExpanded = props.expanded;
        if (newExpanded !== lastExpanded) {
            expandedToggleKeys.values().forEach((key) => {
                if (lastExpanded.has(key) !== newExpanded.has(key)) {
                    expandedToggleKeys = expandedToggleKeys.delete([key]);
                }
            });
            renderedData.value.metadata.forEach((itemMetadata) => {
                const key = itemMetadata.key;
                const itemExpanded = itemMetadata.expanded;
                const isExpanded = newExpanded.has(key);
                if (itemExpanded && !isExpanded) {
                    toCollapse.push(key);
                    itemMetadata.expanded = false;
                }
                else if (!itemExpanded && isExpanded) {
                    expandingKeys = expandingKeys.add([key]);
                    itemMetadata.expanded = true;
                }
            });
            toCollapse.forEach((key) => {
                renderedData = StreamList_1.collapse(key, renderedData);
                expandingKeys = expandingKeys.delete([key]);
                expandedSkeletonKeys = expandedSkeletonKeys.delete([key]);
            });
            return {
                renderedData,
                expandingKeys,
                expandedToggleKeys,
                expandedSkeletonKeys,
                toCollapse,
                lastExpanded: newExpanded
            };
        }
        return { toCollapse };
    }
    static _findIndex(metadata, key) {
        for (let i = 0; i < metadata.length; i++) {
            if (oj.KeyUtils.equals(key, metadata[i].key)) {
                return i;
            }
        }
        return -1;
    }
    _unregisterScrollHandler() {
        const scrollElement = this._getScrollEventElement();
        scrollElement.removeEventListener('scroll', this.scrollListener);
    }
    _registerScrollHandler() {
        const scrollElement = this._getScrollEventElement();
        this._unregisterScrollHandler();
        scrollElement.addEventListener('scroll', this.scrollListener);
    }
    _updateScrollPosition() {
        var _a, _b;
        const scrollPosition = {};
        const scrollTop = this._getScroller().scrollTop;
        const result = this._findClosestElementToTop(scrollTop);
        scrollPosition.y = scrollTop;
        if (result != null) {
            const elem = result.elem;
            const elemKey = this.contentHandler.getKey(elem);
            scrollPosition.offsetY = result.offsetY;
            scrollPosition.key = elemKey;
            if (this._isTreeData() && elem.classList.contains('oj-stream-list-item')) {
                scrollPosition.parentKey = this._getParentKey(elem);
            }
            else {
                scrollPosition.parentKey = null;
            }
        }
        this.lastInternalScrollPositionUpdate = scrollPosition;
        (_b = (_a = this.props).onScrollPositionChanged) === null || _b === void 0 ? void 0 : _b.call(_a, scrollPosition);
    }
    _syncScrollTopWithProps() {
        const scrollPosition = this.props.scrollPosition;
        let scrollTop;
        const key = scrollPosition.key;
        if (key) {
            const parent = scrollPosition.parentKey;
            const item = this._getItemByKey(key, parent);
            if (item != null) {
                const root = this.root;
                scrollTop = item.offsetTop - root.offsetTop;
            }
            else {
                return;
            }
            const offsetY = scrollPosition.offsetY;
            if (!isNaN(offsetY)) {
                scrollTop = scrollTop + offsetY;
            }
        }
        else {
            const y = scrollPosition.y;
            if (!isNaN(y)) {
                scrollTop = y;
            }
            else {
                return;
            }
        }
        if (scrollTop > this._getScroller().scrollHeight) {
            return;
        }
        this._getScroller().scrollTop = scrollTop;
    }
    _getParentKey(item) {
        while (item) {
            if (item.classList.contains('oj-stream-list-group')) {
                return this.contentHandler.getKey(item);
            }
            item = item.previousElementSibling;
        }
        return null;
    }
    _getItemByKey(key, parentKey) {
        const items = this.root.querySelectorAll('.oj-stream-list-item, .oj-stream-list-group');
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemKey = this.contentHandler.getKey(item);
            if (itemKey === key) {
                if (parentKey == null || this._getParentKey(item) === parentKey) {
                    return item;
                }
            }
        }
    }
    _getScrollEventElement() {
        let scroller = this.props.scrollPolicyOptions.scroller;
        if (scroller != null) {
            if (typeof scroller === 'string') {
                scroller = document.querySelector(scroller);
            }
            if (scroller === document.body || scroller === document.documentElement) {
                return window;
            }
            return scroller;
        }
        return this.getRootElement();
    }
    _getScroller() {
        let scroller = this.props.scrollPolicyOptions.scroller;
        if (scroller != null) {
            if (typeof scroller === 'string') {
                scroller = document.querySelector(scroller);
            }
            if (scroller === document.documentElement && scroller !== document.scrollingElement) {
                return document.body;
            }
            return scroller;
        }
        return this.getRootElement();
    }
    _findClosestElementToTop(currScrollTop) {
        const items = this.root.querySelectorAll('.oj-stream-list-item, .oj-stream-list-group');
        if (items == null || items.length === 0) {
            return null;
        }
        const root = this.root;
        const rootTop = root.offsetTop;
        const scrollTop = Math.max(currScrollTop, 0);
        let offsetTop = 0 - rootTop;
        let diff = scrollTop;
        let index = 0;
        let elem = items[index];
        let found = false;
        let elementDetail = { elem, offsetY: diff };
        while (!found && index >= 0 && index < items.length) {
            elem = items[index];
            offsetTop = elem.offsetTop - rootTop;
            diff = Math.abs(scrollTop - offsetTop);
            found = diff < 1 || scrollTop <= offsetTop;
            if (found) {
                break;
            }
            elementDetail = { elem, offsetY: diff };
            index += 1;
        }
        return elementDetail;
    }
    isAvailable() {
        return this.contentHandler != null;
    }
    getCurrentItem() {
        return this.currentKey;
    }
    setCurrentItem(item) {
        this.currentKey = item;
    }
    getData() {
        return this.state.renderedData;
    }
    setData(data) {
        this.setState({ renderedData: data });
    }
    updateData(updater) {
        this.setState(function (state) {
            return updater(state.renderedData, state.expandingKeys);
        }.bind(this));
    }
    getExpanded() {
        return this.props.expanded;
    }
    setExpanded(set) {
        var _a, _b;
        (_b = (_a = this.props).onExpandedChanged) === null || _b === void 0 ? void 0 : _b.call(_a, set);
    }
    updateExpand(updater) {
        this.setState(function (state, props) {
            return updater(state.renderedData, state.expandedSkeletonKeys, state.expandingKeys, props.expanded);
        }.bind(this));
    }
    getExpandingKeys() {
        return this.state.expandingKeys;
    }
    setExpandingKeys(set) {
        this.setState({ expandingKeys: set });
    }
    updateExpandingKeys(key) {
        this.setState(function (state) {
            return { expandingKeys: state.expandingKeys.add([key]) };
        });
    }
    getSkeletonKeys() {
        return this.state.expandedSkeletonKeys;
    }
    setSkeletonKeys(set) {
        this.setState({ expandedSkeletonKeys: set });
    }
    updateSkeletonKeys(key) {
        this.setState(function (state) {
            return { expandedSkeletonKeys: state.expandedSkeletonKeys.add([key]) };
        });
    }
    getOutOfRangeData() {
        return this.state.outOfRangeData;
    }
    setOutOfRangeData(data) {
        this.setState({ outOfRangeData: data });
    }
    getItemRenderer() {
        return this.props.itemTemplate;
    }
    getItemStyleClass() {
        return 'oj-stream-list-item';
    }
    getGroupRenderer() {
        return this.props.groupTemplate;
    }
    getGroupStyleClass() {
        return 'oj-stream-list-group';
    }
    addBusyState(description) {
        const root = this.getRootElement();
        const componentBusyContext = Context.getContext(root).getBusyContext();
        return componentBusyContext.addBusyState({ description });
    }
    handleItemRemoved(key) {
        if (key == this.getCurrentItem()) {
            let next = this.currentItem.nextElementSibling;
            if (!next)
                next = this.currentItem.previousElementSibling;
            if (next) {
                this._updateCurrentItemAndFocus(next, this.root.contains(document.activeElement));
            }
        }
    }
    _handleTouchOrClickEvent(event) {
        const target = event.target;
        const item = target.closest('.oj-stream-list-item, .oj-stream-list-group');
        if (item) {
            if (this._isFocusable(target, item)) {
                this._updateCurrentItemAndFocus(item, false);
                this._enterActionableMode(target);
            }
            else {
                this._updateCurrentItemAndFocus(item, true);
            }
        }
    }
    _isFocusable(target, item) {
        return this._isInputElement(target) || this._isInsideFocusableElement(target, item);
    }
    _isInputElement(target) {
        const inputRegExp = /^INPUT|SELECT|OPTION|TEXTAREA/;
        return target.nodeName.match(inputRegExp) != null && !target.readOnly;
    }
    _isInsideFocusableElement(target, item) {
        let found = false;
        while (target !== item && target != null) {
            if (target.classList.contains('oj-form-control') ||
                this._isInFocusableElementsList(target, item)) {
                if (!target.readonly && !target.disabled) {
                    found = true;
                }
                break;
            }
            target = target.parentNode;
        }
        return found;
    }
    _isInFocusableElementsList(target, item) {
        let found = false;
        const nodes = getActionableElementsInNode(item);
        nodes.forEach(function (node) {
            if (node === target) {
                found = true;
            }
        });
        return found;
    }
    _resetFocus(item, resetActionable) {
        if (this.actionableMode && resetActionable) {
            this._exitActionableMode(false);
        }
        this.focusOutHandler(item);
        item.tabIndex = -1;
    }
    _setFocus(item, shouldFocus) {
        item.tabIndex = 0;
        if (shouldFocus) {
            this.focusInHandler(item);
            item.focus();
        }
    }
    _updateCurrentItemAndFocus(item, shouldFocus) {
        const lastCurrentItem = this.currentItem;
        const newCurrentItem = item;
        this._resetFocus(lastCurrentItem, true);
        this.currentItem = newCurrentItem;
        const newCurrentItemKey = this.contentHandler.getKey(newCurrentItem);
        this.setCurrentItem(newCurrentItemKey);
        this._setFocus(newCurrentItem, shouldFocus);
    }
    _isInViewport(item) {
        const itemElem = item;
        const top = itemElem.offsetTop;
        const scrollTop = this._getScroller().scrollTop;
        return top >= scrollTop && top <= scrollTop + this.height;
    }
    _restoreCurrentItem(items) {
        if (this.currentKey != null) {
            for (const curr of items) {
                const itemKey = this.contentHandler.getKey(curr);
                if (itemKey == this.currentKey) {
                    const elem = curr;
                    if (this.restoreFocus && this._isInViewport(elem)) {
                        this._updateCurrentItemAndFocus(elem, true);
                        return;
                    }
                    else {
                        this.currentItem = elem;
                        this._setFocus(elem, false);
                    }
                    break;
                }
            }
        }
        this.restoreFocus = false;
    }
    _disableAllTabbableElements(items) {
        items.forEach((item) => {
            const busyContext = Context.getContext(item).getBusyContext();
            busyContext.whenReady().then(function () {
                disableAllFocusableElements(item);
            });
        });
    }
    _enterActionableMode(target) {
        this.actionableMode = true;
        if (this.currentItem) {
            const elems = enableAllFocusableElements(this.currentItem, true);
            if (target == null && elems && elems.length > 0) {
                elems[0].focus();
                this._resetFocus(this.currentItem, false);
            }
        }
    }
    _exitActionableMode(shouldFocus) {
        this.actionableMode = false;
        if (this.currentItem) {
            disableAllFocusableElements(this.currentItem);
            this._setFocus(this.currentItem, shouldFocus);
        }
    }
};
StreamList.defaultProps = {
    data: null,
    expanded: new KeySetImpl(),
    scrollPolicy: 'loadMoreOnScroll',
    scrollPolicyOptions: {
        fetchSize: 25,
        maxCount: 500,
        scroller: null
    },
    scrollPosition: {
        y: 0
    }
};
StreamList.debounceThreshold = 100;
StreamList.collapse = (key, currentData) => {
    const data = currentData.value.data;
    const metadata = currentData.value.metadata;
    const index = StreamList_1._findIndex(metadata, key);
    if (index > -1) {
        const count = IteratingTreeDataProviderContentHandler.getLocalDescendentCount(metadata, index);
        data.splice(index + 1, count);
        metadata.splice(index + 1, count);
    }
    return {
        value: {
            data,
            metadata
        },
        done: currentData.done
    };
};
StreamList._metadata = { "properties": { "data": { "type": "object" }, "expanded": { "type": "object", "writeback": true }, "scrollPolicy": { "type": "string", "enumValues": ["loadAll", "loadMoreOnScroll"] }, "scrollPolicyOptions": { "type": "object", "properties": { "fetchSize": { "type": "number" }, "maxCount": { "type": "number" }, "scroller": { "type": "string|Element" } } }, "scrollPosition": { "type": "object", "properties": { "y": { "type": "number" }, "key": { "type": "any" }, "offsetY": { "type": "number" }, "parentKey": { "type": "any" } }, "writeback": true } }, "slots": { "groupTemplate": { "data": {} }, "itemTemplate": { "data": {} } }, "extension": { "_WRITEBACK_PROPS": ["expanded", "scrollPosition"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby"] } };
StreamList = StreamList_1 = __decorate([
    customElement('oj-stream-list')
], StreamList);

export { StreamList };
