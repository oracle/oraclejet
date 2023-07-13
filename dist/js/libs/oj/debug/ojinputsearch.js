/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'ojs/ojdomutils', 'ojs/ojlistdataproviderview', 'ojs/ojcore-base', 'ojs/ojconfig', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojthemeutils', 'ojs/ojtimerutils', 'ojs/ojtranslation', 'preact', 'ojs/ojhighlighttext', 'ojs/ojvcomponent', 'ojs/ojpopupcore'], function (exports, jsxRuntime, DomUtils, ojlistdataproviderview, oj, Config, Context, Logger, ThemeUtils, TimerUtils, Translations, preact, ojhighlighttext, ojvcomponent, ojpopupcore) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

    class InputSearchSkeleton extends preact.Component {
        constructor(props) {
            super(props);
        }
        render(props) {
            return (jsxRuntime.jsx("li", { role: "presentation", class: "oj-listbox-result", style: props.itemStyle, children: jsxRuntime.jsx("div", { class: "oj-listbox-result-label oj-listbox-skeleton-line-height oj-animation-skeleton" }) }));
        }
    }
    InputSearchSkeleton.defaultProps = {
        itemStyle: null
    };

    class InputSearchSkeletonList extends preact.Component {
        constructor(props) {
            super(props);
        }
        render(props) {
            const skeletonItems = [];
            for (let i = 0; i < props.numItems; i++) {
                skeletonItems.push(jsxRuntime.jsx(InputSearchSkeleton, { itemStyle: props.itemStyle }));
            }
            return (jsxRuntime.jsx("ul", { role: "listbox", id: props.id, class: "oj-listbox-results oj-inputsearch-results", children: skeletonItems }));
        }
    }
    InputSearchSkeletonList.defaultProps = {
        id: null,
        numItems: 1,
        itemStyle: null
    };

    class InputSearchSuggestion extends preact.Component {
        constructor(props) {
            super(props);
            this._handleMouseenter = (event) => {
                if (!DomUtils.recentTouchEnd()) {
                    this.setState({ ['hover']: true });
                }
            };
            this._handleMouseleave = (event) => {
                this.setState({ ['hover']: false });
            };
            this._handleClick = (event) => {
                const mainButton = event.button === 0;
                if (mainButton) {
                    this._fireSuggestionActionEvent(this.props.formattedText, this.props.suggestionItemContext);
                }
            };
            this._fireSuggestionActionEvent = (text, itemContext) => {
                this.props.onOjSuggestionAction?.({ text: text, itemContext: itemContext });
            };
            this.state = {
                hover: false
            };
        }
        fireSuggestionAction() {
            this._fireSuggestionActionEvent(this.props.formattedText, this.props.suggestionItemContext);
        }
        getFormattedText() {
            return this.props.formattedText;
        }
        render(props, state) {
            let rootClasses = 'oj-listbox-result oj-listbox-result-selectable';
            if (state.hover) {
                rootClasses += ' oj-hover';
            }
            if (props.focus) {
                rootClasses += ' oj-focus';
            }
            const content = this._renderContent(props);
            return (jsxRuntime.jsx("li", { role: "presentation", class: rootClasses, onClick: this._handleClick, onMouseEnter: this._handleMouseenter, onMouseLeave: this._handleMouseleave, children: jsxRuntime.jsx("div", { id: props.labelId, class: "oj-listbox-result-label", role: "option", children: content }) }));
        }
        _renderContent(props) {
            const renderer = props.suggestionItemTemplate;
            if (renderer) {
                return renderer({
                    data: props.suggestionItemContext.data,
                    key: props.suggestionItemContext.key,
                    metadata: props.suggestionItemContext.metadata,
                    index: props.index,
                    searchText: props.searchText
                });
            }
            return (jsxRuntime.jsx(ojhighlighttext.HighlightText, { "data-oj-internal": true, text: props.formattedText, matchText: props.searchText ?? '' }));
        }
    }
    InputSearchSuggestion.defaultProps = {
        focus: false,
        formattedText: '',
        index: -1,
        labelId: '',
        searchText: null
    };

    class InputSearchSuggestionsList extends preact.Component {
        constructor(props) {
            super(props);
            this._renderedSuggestions = [];
            this.getCount = () => {
                const length = this._renderedSuggestions.length;
                const nullIndex = this._renderedSuggestions.indexOf(null);
                return nullIndex === -1 ? length : nullIndex;
            };
            this.getFormattedText = (index) => {
                return this._renderedSuggestions[index]?.getFormattedText();
            };
            this.fireSuggestionAction = (index) => {
                this._renderedSuggestions[index]?.fireSuggestionAction();
            };
            this._setRenderedSuggestion = (index, suggestion) => {
                this._renderedSuggestions[index] = suggestion;
            };
        }
        render(props) {
            if (props.data?.length > 0) {
                let suggestions = [];
                for (let i = 0; i < props.data.length; i++) {
                    const focused = i === props.focusIndex;
                    const formattedText = props.formatItemText(props.suggestionItemText, props.data[i]);
                    const suggestion = (jsxRuntime.jsx(InputSearchSuggestion, { ref: this._setRenderedSuggestion.bind(this, i), labelId: props.labelIds[i], focus: focused, index: i, formattedText: formattedText, searchText: props.searchText, suggestionItemContext: props.data[i], suggestionItemTemplate: props.suggestionItemTemplate, onOjSuggestionAction: props.onOjSuggestionAction }));
                    suggestions.push(suggestion);
                }
                return (jsxRuntime.jsx("ul", { role: "listbox", id: props.id, class: "oj-listbox-results oj-inputsearch-results", children: suggestions }));
            }
            return null;
        }
    }
    InputSearchSuggestionsList.defaultProps = {
        data: null,
        focusIndex: -1,
        formatItemText: null,
        id: null,
        labelIds: null,
        onOjSuggestionAction: null,
        searchText: null,
        suggestionItemTemplate: null
    };

    class ComposingInput extends preact.Component {
        constructor(props) {
            super(props);
            this._isComposing = false;
            this._setInputElem = (element) => {
                this._inputElem = element;
                this.props.inputRef?.(element);
            };
            this._handleCompositionstart = (event) => {
                this._isComposing = true;
                this.props.onCompositionStart?.call(this._inputElem, event);
            };
            this._handleCompositionend = (event) => {
                this._isComposing = false;
                this.props.onCompositionEnd?.call(this._inputElem, event);
                this.props.onInputChanged?.({ value: event.target.value });
            };
            this._handleInput = (event) => {
                this.props.onInput?.call(this._inputElem, event);
                if (!this._isComposing || this._isAndroidDevice) {
                    this.props.onInputChanged?.({ value: event.target.value });
                }
            };
            const agentInfo = oj.AgentUtils.getAgentInfo();
            this._isAndroidDevice = agentInfo.os === oj.AgentUtils.OS.ANDROID;
        }
        render(props) {
            const { onInputChanged, onInput, onCompositionStart, onCompositionEnd, ...passThroughProps } = props;
            return (jsxRuntime.jsx("input", { ref: this._setInputElem, onInput: this._handleInput, oncompositionstart: this._handleCompositionstart, oncompositionend: this._handleCompositionend, ...passThroughProps }));
        }
    }

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var InputSearch_1;
    exports.InputSearch = InputSearch_1 = class InputSearch extends preact.Component {
        constructor(props) {
            super(props);
            this._KEYS = {
                TAB: 9,
                ENTER: 13,
                ESC: 27,
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40,
                INPUT_METHOD_EDITOR: 229
            };
            this._counter = 0;
            this._queryCount = 0;
            this._handleMouseenter = (event) => {
                if (!DomUtils.recentTouchEnd()) {
                    this._updateState({ hover: true });
                }
            };
            this._handleMouseleave = (event) => {
                this._updateState({ hover: false });
            };
            this._handleFocusin = (event) => {
                if (event.target === event.currentTarget) {
                    this._handleFocus(event);
                }
                this._updateState({ focus: true });
            };
            this._handleFocusout = (event) => {
                if (event.target === event.currentTarget) {
                    this._handleBlur(event);
                }
                this._updateState({ focus: false });
            };
            this._handleMobileFilterInputFocusin = (event) => {
                this._updateState({ mobileFilterInputFocus: true });
            };
            this._handleMobileFilterInputFocusout = (event) => {
                this._updateState({ mobileFilterInputFocus: false });
            };
            this._handleMobileFilterClear = (event) => {
                this._mobileFilterInputElem?.focus();
                this._updateState({
                    filterText: '',
                    displayValue: '',
                    showAutocompleteText: false,
                    autocompleteFloatingText: null
                });
            };
            this._handleMobileDropdownBack = (event) => {
                this._mainInputElem?.focus();
                this._updateState({
                    dropdownOpen: false,
                    filterText: this.props.value,
                    displayValue: this.props.value
                });
            };
            this._handleInputChanged = (detail) => {
                const value = detail.value;
                const filterText = this.state.filterText || '';
                const lowercaseFilter = filterText.toLowerCase();
                const lowercaseValue = value.toLowerCase();
                const updatedState = {};
                if (this.state.showAutocompleteText &&
                    !this.state.autocompleteFloatingText &&
                    filterText === value) {
                    Object.assign(updatedState, {
                        showAutocompleteText: false,
                        focusedSuggestionIndex: -1
                    });
                }
                else if (!this.state.showAutocompleteText &&
                    lowercaseValue.length < lowercaseFilter.length &&
                    lowercaseFilter.startsWith(lowercaseValue)) {
                    Object.assign(updatedState, {
                        showAutocompleteText: false
                    });
                }
                else {
                    Object.assign(updatedState, {
                        showAutocompleteText: value.length > 0
                    });
                }
                Object.assign(updatedState, {
                    filterText: value,
                    displayValue: value,
                    dropdownOpen: true
                });
                this._updateState(updatedState);
            };
            this._handleFocus = (event) => {
                this._rootElem?.dispatchEvent(new FocusEvent('focus', { relatedTarget: event.relatedTarget }));
            };
            this._handleBlur = (event) => {
                this._rootElem?.dispatchEvent(new FocusEvent('blur', { relatedTarget: event.relatedTarget }));
            };
            this._handleFilterInputKeydownEnter = (event) => {
                const focusIndex = this.state.focusedSuggestionIndex;
                if (this.state.dropdownOpen &&
                    focusIndex >= 0 &&
                    this._suggestionsList?.getCount() > focusIndex &&
                    !this._resolveFetchBusyState) {
                    this._suggestionsList?.fireSuggestionAction(focusIndex);
                }
                else {
                    return {
                        dropdownOpen: false,
                        valueSubmitted: true,
                        actionDetail: null
                    };
                }
                return null;
            };
            this._handleDesktopMainInputKeydown = (event) => {
                const updatedState = { lastEventType: 'keyboard' };
                const keyCode = event.keyCode;
                switch (keyCode) {
                    case this._KEYS.ENTER:
                        const enterKeyUpdatedState = this._handleFilterInputKeydownEnter(event);
                        if (enterKeyUpdatedState) {
                            Object.assign(updatedState, enterKeyUpdatedState);
                        }
                        break;
                    case this._KEYS.TAB:
                        Object.assign(updatedState, {
                            dropdownOpen: false,
                            focus: false,
                            actionDetail: null
                        });
                        if (this.state.showAutocompleteText) {
                            Object.assign(updatedState, {
                                showAutocompleteText: false,
                                resetFilterInputSelectionRange: true
                            });
                        }
                        break;
                    case this._KEYS.ESC:
                        if (this.state.dropdownOpen) {
                            updatedState.dropdownOpen = false;
                            if (this.state.showAutocompleteText) {
                                Object.assign(updatedState, {
                                    showAutocompleteText: false,
                                    displayValue: this.state.filterText
                                });
                            }
                            event.preventDefault();
                        }
                        break;
                    case this._KEYS.UP:
                    case this._KEYS.DOWN:
                        if (!this.state.dropdownOpen) {
                            updatedState.dropdownOpen = true;
                        }
                        else if (!this._resolveFetchBusyState && this._suggestionsList?.getCount() > 0) {
                            let index = this.state.focusedSuggestionIndex;
                            if (keyCode === this._KEYS.DOWN || index === -1) {
                                index += 1;
                                updatedState.scrollFocusedSuggestionIntoView = 'bottom';
                            }
                            else if (index > 0) {
                                index -= 1;
                                updatedState.scrollFocusedSuggestionIntoView = 'top';
                                event.preventDefault();
                            }
                            index = Math.min(this._suggestionsList?.getCount() - 1, index);
                            updatedState.focusedSuggestionIndex = index;
                            const autocomplete = index === 0 && this.state.filterText?.length > 0;
                            updatedState.showAutocompleteText = autocomplete;
                            if (autocomplete) {
                                updatedState.displayValue = this.state.filterText;
                            }
                            else if (index > -1) {
                                updatedState.displayValue = this._suggestionsList?.getFormattedText(index);
                            }
                        }
                        break;
                    case this._KEYS.LEFT:
                    case this._KEYS.RIGHT:
                        if (this.state.showAutocompleteText && !this.state.autocompleteFloatingText) {
                            Object.assign(updatedState, {
                                showAutocompleteText: false,
                                filterText: this.state.displayValue
                            });
                        }
                        break;
                    default:
                        break;
                }
                if (keyCode !== this._KEYS.INPUT_METHOD_EDITOR) {
                    this._updateState(updatedState);
                }
            };
            this._handleMobileFilterInputKeydown = (event) => {
                const updatedState = { lastEventType: 'keyboard' };
                const keyCode = event.keyCode;
                switch (keyCode) {
                    case this._KEYS.ENTER:
                        const enterKeyUpdatedState = this._handleFilterInputKeydownEnter(event);
                        if (enterKeyUpdatedState) {
                            Object.assign(updatedState, enterKeyUpdatedState);
                        }
                        break;
                    default:
                        break;
                }
                this._updateState(updatedState);
            };
            this._handleMousedown = (event) => {
                const mainButton = event.button === 0;
                if (mainButton) {
                    this._updateState({
                        focus: true,
                        dropdownOpen: true
                    });
                    if (event.target !== this._mainInputElem || this.state.fullScreenPopup) {
                        event.preventDefault();
                    }
                    else {
                        this._handleFilterInputMousedown(event);
                    }
                }
            };
            this._handleFilterInputMousedown = (event) => {
                if (this.state.showAutocompleteText) {
                    if (!this.state.autocompleteFloatingText) {
                        this._updateState({
                            showAutocompleteText: false,
                            filterText: this.state.displayValue
                        });
                    }
                    else {
                        this._updateState({
                            showAutocompleteText: false,
                            filterText: this.state.autocompleteFloatingText,
                            displayValue: this.state.autocompleteFloatingText
                        });
                    }
                }
            };
            this._handleDesktopDropdownMousedown = (event) => {
                const mainButton = event.button === 0;
                if (mainButton) {
                    this._updateState({ focus: true });
                    event.preventDefault();
                }
            };
            this._handleDropdownMousemove = (event) => {
                this._updateState({ lastEventType: 'mouse' });
            };
            this._handleDropdownMouseleave = (event) => {
                this._updateState({ lastEventType: null });
            };
            this._setRootElem = (element) => {
                this._rootElem = element;
            };
            this._setDropdownElem = (element) => {
                this._dropdownElem = element;
            };
            this._setMainInputElem = (element) => {
                this._mainInputElem = element;
            };
            this._setMainInputContainerElem = (element) => {
                this._mainInputContainerElem = element;
            };
            this._setSuggestionsList = (vnode) => {
                this._suggestionsList = vnode;
            };
            this._setMobileFilterInputElem = (element) => {
                this._mobileFilterInputElem = element;
            };
            this._getFilterInputElem = () => {
                return this._mobileFilterInputElem || this._mainInputElem;
            };
            this._clickAwayHandler = (event) => {
                const target = event.target;
                if (target.closest('#' + CSS.escape(this._getDropdownElemId())) ||
                    target.closest('#' + CSS.escape(this._getMainInputContainerId()))) {
                    return;
                }
                const updatedState = { dropdownOpen: false };
                if (this.state.showAutocompleteText) {
                    Object.assign(updatedState, {
                        showAutocompleteText: false,
                        resetFilterInputSelectionRange: true
                    });
                }
                this._updateState(updatedState);
            };
            this._handleDataProviderRefreshEventListener = (event) => {
                this._updateState({ fetchedInitial: false });
            };
            this._handleSuggestionAction = (detail) => {
                this._updateState({
                    filterText: detail.text,
                    displayValue: detail.text,
                    dropdownOpen: false,
                    valueSubmitted: true,
                    actionDetail: detail.itemContext
                });
            };
            this._uniqueId = props['id'] ? props['id'] : ojvcomponent.getUniqueId();
            const cssOptionDefaults = ThemeUtils.parseJSONFromFontFamily('oj-inputsearch-option-defaults') || {};
            let showIndicatorDelay = cssOptionDefaults.showIndicatorDelay;
            showIndicatorDelay = parseInt(showIndicatorDelay, 10);
            showIndicatorDelay = isNaN(showIndicatorDelay) ? 250 : showIndicatorDelay;
            this._showIndicatorDelay = showIndicatorDelay;
            const dropdownVerticalOffset = ThemeUtils.getCachedCSSVarValues(['--oj-private-core-global-dropdown-offset'])[0] || '0';
            this._dropdownVerticalOffset = parseInt(dropdownVerticalOffset, 10);
            if (props.suggestions) {
                this._dataProvider = this._wrapDataProviderIfNeeded(this.props.suggestions);
            }
            this.state = {
                dropdownOpen: false,
                dropdownAbove: false,
                valueSubmitted: false,
                focus: false,
                hover: false,
                active: false,
                displayValue: null,
                filterText: null,
                lastFetchedFilterText: null,
                fetchedData: null,
                labelIds: [],
                fetchedInitial: false,
                fetching: false,
                loading: false,
                focusedSuggestionIndex: -1,
                activeDescendantId: null,
                scrollFocusedSuggestionIntoView: null,
                actionDetail: null,
                lastEventType: null,
                showAutocompleteText: false,
                autocompleteFloatingText: null,
                initialRender: true,
                oldPropsValue: props.value,
                oldPropsSuggestions: props.suggestions,
                fullScreenPopup: props.suggestions && Config.getDeviceRenderMode() === 'phone',
                mobileFilterInputFocus: false,
                mobileFilterInputActive: false,
                resetFilterInputSelectionRange: false
            };
        }
        render(props, state) {
            let rootClasses = 'oj-inputsearch oj-form-control oj-text-field oj-component';
            if (state.hover) {
                rootClasses += ' oj-hover';
            }
            if (state.active) {
                rootClasses += ' oj-active';
            }
            if (state.focus) {
                rootClasses += ' oj-focus';
            }
            if (state.dropdownOpen) {
                rootClasses += ' oj-listbox-dropdown-open';
                if (state.dropdownAbove) {
                    rootClasses += ' oj-listbox-drop-above';
                }
            }
            if (state.fullScreenPopup) {
                rootClasses += ' oj-inputsearch-mobile';
            }
            const inputClasses = 'oj-inputsearch-input oj-text-field-input ';
            const iconClasses = 'oj-text-field-start-end-icon oj-inputsearch-search-icon oj-component-icon';
            const displayValue = state.displayValue || '';
            return this._renderEnabled(props, state, rootClasses, iconClasses, displayValue, inputClasses);
        }
        static getDerivedStateFromProps(props, state) {
            if (state.initialRender) {
                return this._initStateFromProps(props, state);
            }
            return this._updateStateFromProps(props, state);
        }
        static _initStateFromProps(props, state) {
            return {
                displayValue: props.value,
                filterText: props.value,
                fullScreenPopup: props.suggestions && Config.getDeviceRenderMode() === 'phone'
            };
        }
        static _updateStateFromProps(props, state) {
            const updatedState = {};
            if (props.value !== state.oldPropsValue &&
                ((!state.fullScreenPopup && props.value !== state.displayValue) ||
                    (state.fullScreenPopup && !state.dropdownOpen))) {
                updatedState.displayValue = props.value;
                updatedState.filterText = props.value;
            }
            if (state.oldPropsSuggestions != props.suggestions) {
                updatedState.fetchedInitial = false;
                updatedState.fullScreenPopup = props.suggestions && Config.getDeviceRenderMode() === 'phone';
            }
            if (!props.suggestions) {
                updatedState.dropdownOpen = false;
                updatedState.fetchedData = null;
            }
            if (state.dropdownOpen === false || updatedState.dropdownOpen === false) {
                updatedState.lastEventType = null;
                updatedState.showAutocompleteText = false;
            }
            if (!state.showAutocompleteText || updatedState.showAutocompleteText === false) {
                updatedState.autocompleteFloatingText = null;
            }
            return updatedState;
        }
        componentDidMount() {
            if (this.props.value !== null) {
                this.props.onRawValueChanged?.(this.props.value);
            }
            if (this._dataProvider) {
                this._addDataProviderEventListeners(this._dataProvider);
            }
            this._updateState({ initialRender: false });
        }
        _updateState(updater) {
            const newUpdater = function (state, props) {
                let partialState;
                if (typeof updater === 'function') {
                    partialState = updater(state, props);
                }
                else {
                    partialState = updater;
                }
                let changed = false;
                for (const key in partialState) {
                    if (partialState[key] !== state[key]) {
                        changed = true;
                        break;
                    }
                }
                return changed ? partialState : null;
            };
            this.setState(newUpdater);
        }
        componentDidUpdate(oldProps, oldState) {
            if (this.state.fullScreenPopup && !oldState.dropdownOpen && this.state.dropdownOpen) {
                this._mobileFilterInputElem?.focus();
            }
            if ((oldState.focus && !this.state.focus) || this.state.valueSubmitted) {
                if (this.props.value !== this.state.displayValue) {
                    this.props.onValueChanged?.(this.state.displayValue);
                }
                if (oldState.focus && !this.state.focus && oldState.filterText !== this.state.displayValue) {
                    this._updateState({ filterText: this.state.displayValue });
                }
                if (this.state.valueSubmitted) {
                    this.props.onOjValueAction?.({
                        value: this.state.displayValue,
                        itemContext: this.state.actionDetail,
                        previousValue: this.props.value
                    });
                    if (this.state.fullScreenPopup) {
                        this._mainInputElem?.focus();
                    }
                    this._updateState({ valueSubmitted: false });
                    if (this._testPromiseResolve) {
                        this._testPromiseResolve();
                        this._testPromiseResolve = null;
                    }
                }
            }
            if (oldState.displayValue != this.state.displayValue) {
                this.props.onRawValueChanged?.(this.state.displayValue);
            }
            if (oldProps.suggestions != this.props.suggestions) {
                if (oldProps.suggestions) {
                    this._removeDataProviderEventListeners(this._dataProvider);
                }
                if (this.props.suggestions) {
                    this._dataProvider = this._wrapDataProviderIfNeeded(this.props.suggestions);
                    this._addDataProviderEventListeners(this._dataProvider);
                }
                else {
                    this._dataProvider = null;
                    this._resolveFetching();
                }
            }
            if (!this.state.dropdownOpen) {
                if (oldState.dropdownOpen) {
                    this._updateState({ focusedSuggestionIndex: -1 });
                    this._resolveFetching();
                }
            }
            else {
                if (this.state.lastFetchedFilterText != this.state.filterText ||
                    (!this.state.fetchedInitial && !this._resolveFetchBusyState)) {
                    this._updateState({ lastFetchedFilterText: this.state.filterText });
                    this._fetchData(this.state.filterText);
                }
                if (!oldState.dropdownOpen || this.state.filterText !== oldState.filterText) {
                    if (!oldState.dropdownOpen && this.state.filterText === oldState.filterText) {
                        this._updateState({ focusedSuggestionIndex: -1 });
                    }
                    else {
                        this._updateState((state, props) => {
                            const newIndex = state.filterText?.length > 0 ? 0 : -1;
                            if (state.focusedSuggestionIndex !== newIndex) {
                                return { focusedSuggestionIndex: newIndex };
                            }
                            return null;
                        });
                    }
                }
                else if (this.state.fetchedData) {
                    this._updateState((state, props) => {
                        const newIndex = Math.min(state.fetchedData.length - 1, state.focusedSuggestionIndex);
                        if (state.focusedSuggestionIndex !== newIndex) {
                            return { focusedSuggestionIndex: newIndex };
                        }
                        return null;
                    });
                }
                const focusIndex = this._resolveFetchBusyState ? -1 : this.state.focusedSuggestionIndex;
                if (focusIndex >= 0 && this.state.labelIds.length > focusIndex) {
                    const filterText = this.state.filterText || '';
                    if (focusIndex === 0 && this.state.showAutocompleteText && filterText.length > 0) {
                        const firstSuggestionText = this._suggestionsList?.getFormattedText(0);
                        const lowercaseFirstSuggestionText = firstSuggestionText.toLowerCase();
                        const lowercaseFilterText = filterText.toLowerCase();
                        if (lowercaseFirstSuggestionText.startsWith(lowercaseFilterText)) {
                            const selectionStart = filterText.length;
                            const autocompleteText = firstSuggestionText.substr(selectionStart);
                            this._updateState({
                                displayValue: filterText + autocompleteText,
                                autocompleteFloatingText: null,
                                activeDescendantId: this.state.labelIds[focusIndex]
                            });
                            this._getFilterInputElem().setSelectionRange(selectionStart, selectionStart + autocompleteText.length);
                        }
                        else if (!this.state.fullScreenPopup) {
                            this._updateState({
                                autocompleteFloatingText: firstSuggestionText,
                                displayValue: filterText,
                                activeDescendantId: this.state.labelIds[focusIndex]
                            });
                        }
                        else {
                            this._updateState({
                                autocompleteFloatingText: null,
                                activeDescendantId: null,
                                focusedSuggestionIndex: -1
                            });
                        }
                    }
                    else {
                        this._updateState({
                            activeDescendantId: this.state.labelIds[focusIndex]
                        });
                    }
                }
                else {
                    this._updateState({ activeDescendantId: null });
                }
                if (!this._resolveFetchBusyState && this.state.labelIds.length === 0) {
                    if (!this.state.fullScreenPopup) {
                        this._updateState({ showAutocompleteText: false, dropdownOpen: false });
                    }
                    else {
                        this._updateState({ showAutocompleteText: false });
                    }
                }
            }
            const scrollFocusedSuggestionIntoView = this.state.scrollFocusedSuggestionIntoView;
            if (scrollFocusedSuggestionIntoView) {
                const activeDescendantId = this.state.activeDescendantId;
                if (activeDescendantId) {
                    const alignToTop = scrollFocusedSuggestionIntoView === 'top';
                    this._scrollSuggestionIntoView(activeDescendantId, alignToTop);
                    this._updateState({ scrollFocusedSuggestionIntoView: null });
                }
            }
            if (this.state.resetFilterInputSelectionRange) {
                this._getFilterInputElem()?.setSelectionRange(this.state.displayValue.length, this.state.displayValue.length);
                this._updateState({ resetFilterInputSelectionRange: false });
            }
            if (this.state.oldPropsValue !== this.props.value) {
                this._updateState({ oldPropsValue: this.props.value });
            }
            if (this.state.oldPropsSuggestions !== this.props.suggestions) {
                this._updateState({ oldPropsSuggestions: this.props.suggestions });
            }
        }
        componentWillUnmount() {
            if (this._dataProvider) {
                this._removeDataProviderEventListeners(this._dataProvider);
            }
            this._resolveFetching();
            this._updateState({ initialRender: true });
        }
        focus() {
            this._mainInputElem?.focus();
        }
        blur() {
            this._mainInputElem?.blur();
        }
        _getDropdownElemId() {
            return 'searchDropdown_' + this._uniqueId;
        }
        _getMainInputContainerId() {
            return 'searchInputContainer_' + this._uniqueId;
        }
        _getMobileFilterContainerId() {
            return 'searchMobileFilterContainer_' + this._uniqueId;
        }
        _getListboxId() {
            return 'searchSuggestionsListbox_' + this._uniqueId;
        }
        _getDesktopDropdownPosition() {
            const defPosition = {
                my: 'start top',
                at: 'start bottom',
                of: this._mainInputContainerElem,
                collision: 'flip',
                using: this._usingHandler.bind(this),
                offset: { x: 0, y: this._dropdownVerticalOffset }
            };
            const isRtl = DomUtils.getReadingDirection() === 'rtl';
            let position = oj.PositionUtils.normalizeHorizontalAlignment(defPosition, isRtl);
            position = oj.PositionUtils.coerceToJet(position);
            position = oj.PositionUtils.coerceToJqUi(position);
            position.of = defPosition.of;
            return position;
        }
        _getMobileDropdownPosition() {
            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;
            let position = {
                my: 'start top',
                at: 'start top',
                of: window,
                offset: { x: scrollX, y: scrollY }
            };
            const isRtl = DomUtils.getReadingDirection() === 'rtl';
            position = oj.PositionUtils.normalizeHorizontalAlignment(position, isRtl);
            return position;
        }
        _getMobileDropdownStyle() {
            const dropdownStyle = {};
            const ww = Math.min(window.innerWidth, window.screen.availWidth);
            const hh = Math.min(window.innerHeight, window.screen.availHeight);
            const deviceType = Config.getDeviceType();
            if (deviceType === 'phone' && window.parent && window !== window.parent) {
                const parentHH = Math.min(window.parent.innerHeight, window.parent.screen.availHeight);
                const availContentHeight = Math.min(hh, parentHH);
                if (hh > availContentHeight) {
                    const diffHeight = hh - availContentHeight;
                    dropdownStyle['paddingBottom'] = diffHeight + 'px';
                }
            }
            dropdownStyle['width'] = ww + 'px';
            dropdownStyle['height'] = hh + 'px';
            return dropdownStyle;
        }
        _usingHandler(pos, props) {
            if (oj.PositionUtils.isAligningPositionClipped(props)) {
                this._updateState({ dropdownOpen: false });
            }
            else {
                var dropdownElem = props.element.element;
                dropdownElem.css(pos);
                this._updateState({ dropdownAbove: props.vertical === 'bottom' });
            }
        }
        _renderEnabled(props, state, rootClasses, iconClasses, displayValue, inputClasses) {
            const id = props['id'] ? props['id'] : null;
            const ariaLabel = props['aria-label'] ? props['aria-label'] : null;
            const listboxId = this._dataProvider ? this._getListboxId() : null;
            const agentInfo = oj.AgentUtils.getAgentInfo();
            const isMobile = agentInfo.os === oj.AgentUtils.OS.ANDROID ||
                agentInfo.os === oj.AgentUtils.OS.IOS ||
                agentInfo.os === oj.AgentUtils.OS.WINDOWSPHONE;
            const inputType = isMobile ? 'search' : 'text';
            const autocompleteFloatingElem = state.autocompleteFloatingText
                ? this._renderAutocompleteFloatingText(state.autocompleteFloatingText, displayValue)
                : null;
            const searchIcon = jsxRuntime.jsx("span", { class: iconClasses, role: "presentation" });
            const textFieldContainer = state.fullScreenPopup
                ? this._renderMobileMainTextFieldContainer(props, state, searchIcon, inputClasses, ariaLabel, listboxId)
                : this._renderDesktopMainTextFieldContainer(props, state, searchIcon, displayValue, inputClasses, ariaLabel, listboxId, inputType, autocompleteFloatingElem);
            const dropdown = state.dropdownOpen
                ? this._renderDropdown(props, state, displayValue, inputClasses, ariaLabel, listboxId, inputType, autocompleteFloatingElem)
                : null;
            const ariaLiveRegion = this._dataProvider ? this._renderAriaLiveRegion(state) : null;
            return (jsxRuntime.jsxs(ojvcomponent.Root, { id: id, ref: this._setRootElem, class: rootClasses, "aria-label": ariaLabel, onMouseDown: this._handleMousedown, onMouseEnter: this._handleMouseenter, onMouseLeave: this._handleMouseleave, children: [ariaLiveRegion, textFieldContainer, dropdown] }));
        }
        _renderAriaLiveRegion(state) {
            const text = state.fetchedInitial && !state.fetching && state.fetchedData?.length == 0
                ? Translations.getTranslatedString('oj-ojInputSearch2.noSuggestionsFound')
                : '\xa0';
            return (jsxRuntime.jsx("div", { id: 'oj-listbox-live-' + this._uniqueId, class: "oj-helper-hidden-accessible oj-listbox-liveregion", "aria-live": "polite", children: text }));
        }
        _renderDesktopMainTextFieldContainer(props, state, searchIcon, displayValue, inputClasses, ariaLabel, listboxId, inputType, autocompleteFloatingElem) {
            const containerClasses = 'oj-text-field-container oj-text-field-has-start-slot';
            return (jsxRuntime.jsxs("div", { role: "presentation", class: containerClasses, id: this._getMainInputContainerId(), ref: this._setMainInputContainerElem, children: [jsxRuntime.jsx("span", { class: "oj-text-field-start", children: searchIcon }), jsxRuntime.jsxs("div", { class: "oj-text-field-middle", role: this._dataProvider ? 'combobox' : undefined, "aria-label": this._dataProvider ? ariaLabel : null, "aria-owns": listboxId, "aria-haspopup": this._dataProvider ? 'listbox' : 'false', "aria-expanded": state.dropdownOpen ? 'true' : 'false', children: [jsxRuntime.jsx(ComposingInput, { type: inputType, inputRef: this._setMainInputElem, value: displayValue, class: inputClasses + ' oj-inputsearch-filter', placeholder: props.placeholder, autocomplete: "off", autocorrect: "off", autocapitalize: "off", spellcheck: false, autofocus: false, "aria-label": ariaLabel, "aria-autocomplete": this._dataProvider ? 'list' : null, "aria-controls": listboxId, "aria-busy": state.dropdownOpen && state.loading, "aria-activedescendant": this._dataProvider ? state.activeDescendantId : null, onfocusin: this._handleFocusin, onfocusout: this._handleFocusout, onInputChanged: this._handleInputChanged, onKeyDown: this._handleDesktopMainInputKeydown }), autocompleteFloatingElem] })] }));
        }
        _renderMobileMainTextFieldContainer(props, state, searchIcon, inputClasses, ariaLabel, listboxId) {
            const { placeholder, value } = props;
            const { dropdownOpen, loading } = state;
            const containerClasses = 'oj-text-field-container oj-text-field-has-start-slot';
            const mobileInputClasses = inputClasses +
                ' oj-inputsearch-input-displayonly ' +
                (value ? '' : ' oj-inputsearch-placeholder');
            return (jsxRuntime.jsxs("div", { role: "presentation", class: containerClasses, id: this._getMainInputContainerId(), children: [jsxRuntime.jsx("span", { class: "oj-text-field-start", children: searchIcon }), jsxRuntime.jsx("div", { class: "oj-text-field-middle", role: this._dataProvider ? 'combobox' : undefined, "aria-label": this._dataProvider ? ariaLabel : null, "aria-owns": listboxId, "aria-haspopup": this._dataProvider ? 'listbox' : 'false', "aria-expanded": dropdownOpen ? 'true' : 'false', children: jsxRuntime.jsx("div", { ref: this._setMainInputElem, class: mobileInputClasses, "aria-label": ariaLabel, "aria-controls": listboxId, "aria-busy": dropdownOpen && loading, tabIndex: 0, onfocusin: this._handleFocusin, onfocusout: this._handleFocusout, children: jsxRuntime.jsx("div", { children: value || placeholder }) }) })] }));
        }
        _renderMobileDropdownFilterField(props, state, displayValue, inputClasses, ariaLabel, listboxId, inputType, autocompleteFloatingElem) {
            let classes = 'oj-text-field';
            if (state.mobileFilterInputActive) {
                classes += ' oj-active';
            }
            if (state.mobileFilterInputFocus) {
                classes += ' oj-focus';
            }
            let containerClasses = 'oj-text-field-container oj-text-field-has-start-slot';
            const backIcon = this._renderMobileDropdownBackIcon();
            let clearIcon;
            if (displayValue && displayValue.length > 0) {
                containerClasses += ' oj-text-field-has-end-slot';
                clearIcon = this._renderMobileDropdownClearIcon();
            }
            return (jsxRuntime.jsx("div", { class: classes, children: jsxRuntime.jsxs("div", { role: "presentation", class: containerClasses, id: this._getMobileFilterContainerId(), children: [jsxRuntime.jsx("span", { class: "oj-text-field-start", children: backIcon }), jsxRuntime.jsxs("div", { class: "oj-text-field-middle", "aria-label": ariaLabel, "aria-owns": listboxId, children: [jsxRuntime.jsx(ComposingInput, { type: inputType, inputRef: this._setMobileFilterInputElem, value: displayValue, class: inputClasses + ' oj-inputsearch-filter', placeholder: props.placeholder, autocomplete: "off", autocorrect: "off", autocapitalize: "off", spellcheck: false, autofocus: false, "aria-label": ariaLabel, "aria-autocomplete": "list", "aria-controls": listboxId, "aria-busy": state.loading, "aria-activedescendant": state.activeDescendantId, onfocusin: this._handleMobileFilterInputFocusin, onfocusout: this._handleMobileFilterInputFocusout, onInputChanged: this._handleInputChanged, onKeyDown: this._handleMobileFilterInputKeydown, onMouseDown: this._handleFilterInputMousedown }), autocompleteFloatingElem] }), jsxRuntime.jsx("span", { class: "oj-text-field-end", children: clearIcon })] }) }));
        }
        _renderMobileDropdownBackIcon() {
            const backIconClasses = 'oj-inputsearch-back-icon oj-inputsearch-icon oj-component-icon oj-clickable-icon-nocontext';
            const backButtonAriaLabel = Translations.getTranslatedString('oj-ojInputSearch2.cancel');
            return (jsxRuntime.jsx("span", { class: "oj-inputsearch-back-button", "aria-label": backButtonAriaLabel, onClick: this._handleMobileDropdownBack, children: jsxRuntime.jsx("span", { class: backIconClasses }) }));
        }
        _renderMobileDropdownClearIcon() {
            const clearIconClasses = 'oj-inputsearch-clear-icon oj-inputsearch-icon oj-component-icon' +
                ' oj-clickable-icon-nocontext';
            return (jsxRuntime.jsx("span", { class: "oj-inputsearch-clear-button", "aria-hidden": true, onClick: this._handleMobileFilterClear, children: jsxRuntime.jsx("span", { class: clearIconClasses }) }));
        }
        _renderDropdown(props, state, displayValue, inputClasses, ariaLabel, listboxId, inputType, autocompleteFloatingElem) {
            const dropdownContent = state.loading
                ? this._renderDropdownSkeleton()
                : this._renderDropdownSuggestions(props, state);
            let dropdownClasses = 'oj-listbox-drop oj-listbox-inputsearch';
            if (state.lastEventType === 'keyboard') {
                dropdownClasses += ' oj-listbox-hide-hover';
            }
            if (state.lastEventType === 'mouse') {
                dropdownClasses += ' oj-listbox-hide-focus';
            }
            if (state.fullScreenPopup) {
                return this._renderMobileDropdown(props, state, dropdownClasses, dropdownContent, displayValue, inputClasses, ariaLabel, listboxId, inputType, autocompleteFloatingElem);
            }
            return this._renderDesktopDropdown(props, state, dropdownClasses, dropdownContent);
        }
        _renderDesktopDropdown(props, state, dropdownClasses, dropdownContent) {
            const dropdownPosition = this._getDesktopDropdownPosition();
            const minWidth = this._rootElem.offsetWidth;
            const dropdownStyle = {
                minWidth: minWidth + 'px'
            };
            if (state.dropdownAbove) {
                dropdownClasses += ' oj-listbox-drop-above';
            }
            return this._renderVPopup(dropdownPosition, dropdownClasses, dropdownStyle, dropdownContent, null, this._handleDesktopDropdownMousedown);
        }
        _renderMobileDropdown(props, state, dropdownClasses, dropdownContent, displayValue, inputClasses, ariaLabel, listboxId, inputType, autocompleteFloatingElem) {
            const dropdownPosition = this._getMobileDropdownPosition();
            const dropdownStyle = this._getMobileDropdownStyle();
            dropdownClasses += ' oj-listbox-fullscreen';
            const dropdownFilterField = this._renderMobileDropdownFilterField(props, state, displayValue, inputClasses, ariaLabel, listboxId, inputType, autocompleteFloatingElem);
            return this._renderVPopup(dropdownPosition, dropdownClasses, dropdownStyle, dropdownContent, dropdownFilterField, null);
        }
        _renderVPopup(position, classes, style, content, headerContent, mousedownHandler) {
            return (jsxRuntime.jsx(ojpopupcore.VPopup, { position: position, layerSelectors: "oj-listbox-drop-layer", autoDismiss: this._clickAwayHandler, children: jsxRuntime.jsxs("div", { "data-oj-binding-provider": "preact", id: this._getDropdownElemId(), ref: this._setDropdownElem, class: classes, role: "presentation", style: style, onMouseDown: mousedownHandler, onMouseMove: this._handleDropdownMousemove, onMouseLeave: this._handleDropdownMouseleave, children: [headerContent, content] }) }));
        }
        _renderAutocompleteFloatingText(autocompleteFloatingText, displayValue) {
            const text = '\xa0\u2014\xa0' + autocompleteFloatingText;
            return (jsxRuntime.jsxs("div", { class: "oj-inputsearch-autocomplete-floating-container", children: [jsxRuntime.jsx("span", { style: "visibility: hidden;", children: displayValue }), jsxRuntime.jsx("span", { class: "oj-inputsearch-autocomplete-floating-text", children: text })] }));
        }
        _scrollSuggestionIntoView(activeDescendantId, alignToTop) {
            const labelElem = document.getElementById(activeDescendantId);
            const suggestionElem = labelElem.closest('.oj-listbox-result');
            const listboxElem = labelElem.closest('.oj-listbox-results');
            const suggestionTop = suggestionElem.offsetTop;
            const suggestionHeight = suggestionElem.offsetHeight;
            const listboxTop = listboxElem.scrollTop;
            const listboxHeight = listboxElem.offsetHeight;
            if (suggestionTop < listboxTop ||
                suggestionTop + suggestionHeight > listboxTop + listboxHeight) {
                listboxElem.scrollTop = alignToTop
                    ? suggestionTop
                    : suggestionTop + suggestionHeight - listboxHeight;
            }
        }
        _generateId() {
            return this._uniqueId + '-' + this._counter++;
        }
        _fetchData(_searchText) {
            this._queryCount += 1;
            const queryNumber = this._queryCount;
            let searchText = _searchText;
            if (searchText === '') {
                searchText = null;
            }
            const maxFetchCount = 12;
            let fetchParams = { size: maxFetchCount };
            if (searchText) {
                const filterCapability = this._dataProvider.getCapability('filter');
                if (!filterCapability || !filterCapability.textFilter) {
                    Logger.error('InputSearch: DataProvider does not support text filter. ' +
                        'Filtering results in dropdown may not work correctly.');
                }
                fetchParams['filterCriterion'] = oj.FilterFactory.getFilter({
                    filterDef: { text: searchText }
                });
            }
            this._updateState({ fetching: true });
            if (!this._loadingTimer) {
                const timer = TimerUtils.getTimer(this._showIndicatorDelay);
                timer.getPromise().then(function (pending) {
                    this._loadingTimer = null;
                    if (pending && this._dataProvider && this.state.dropdownOpen) {
                        this._updateState({ loading: true });
                    }
                }.bind(this));
                this._loadingTimer = timer;
            }
            let fetchedData = [];
            if (!this._resolveFetchBusyState) {
                this._resolveFetchBusyState = this._addBusyState('InputSearch: fetching suggestions');
            }
            const asyncIterator = this._dataProvider.fetchFirst(fetchParams)[Symbol.asyncIterator]();
            let remainingFetchCount = maxFetchCount;
            const processNextFunc = function (result) {
                if (queryNumber !== this._queryCount) {
                    return;
                }
                let done = result.done;
                const value = result.value;
                const data = value.data;
                const metadata = value.metadata;
                for (let i = 0; i < data.length; i++) {
                    const itemData = data[i];
                    const itemMetadata = metadata[i];
                    const itemKey = itemMetadata.key;
                    fetchedData.push({
                        data: itemData,
                        metadata: itemMetadata,
                        key: itemKey
                    });
                    remainingFetchCount -= 1;
                    if (remainingFetchCount === 0) {
                        done = true;
                        break;
                    }
                }
                if (done) {
                    let labelIds = [];
                    for (let i = 0; i < fetchedData.length; i++) {
                        labelIds.push('oj-inputsearch-result-label-' + this._generateId());
                    }
                    this._updateState({ fetchedInitial: true, labelIds, fetchedData });
                    this._resolveFetching();
                }
                else {
                    asyncIterator.next().then(processNextFunc);
                }
            }.bind(this);
            asyncIterator.next().then(processNextFunc);
        }
        _renderDropdownSkeleton() {
            let numItems = 1;
            let resultsWidth = 0;
            if (this._dropdownElem) {
                const items = this._dropdownElem.querySelectorAll('.oj-listbox-result');
                numItems = Math.max(1, items.length);
                if (items.length > 0) {
                    const resultsContainer = this._dropdownElem.querySelector('.oj-listbox-results');
                    resultsWidth = resultsContainer.offsetWidth;
                }
            }
            const resultStyle = resultsWidth > 0 ? { width: resultsWidth + 'px' } : null;
            return (jsxRuntime.jsx(InputSearchSkeletonList, { id: this._getListboxId(), numItems: numItems, itemStyle: resultStyle }));
        }
        _renderDropdownSuggestions(props, state) {
            if (state.fetchedData?.length > 0) {
                return (jsxRuntime.jsx(InputSearchSuggestionsList, { ref: this._setSuggestionsList, data: state.fetchedData, searchText: state.filterText, focusIndex: state.focusedSuggestionIndex, formatItemText: InputSearch_1._formatItemText, id: this._getListboxId(), labelIds: state.labelIds, onOjSuggestionAction: this._handleSuggestionAction, suggestionItemText: props.suggestionItemText, suggestionItemTemplate: props.suggestionItemTemplate }));
            }
            return null;
        }
        _addBusyState(description) {
            const elem = this._rootElem;
            const desc = 'The component identified by "' + elem.id + '" ' + description;
            const busyStateOptions = { description: desc };
            const busyContext = Context.getContext(elem).getBusyContext();
            return busyContext.addBusyState(busyStateOptions);
        }
        _isDataProvider(suggestions) {
            return suggestions?.['fetchFirst'] ? true : false;
        }
        _wrapDataProviderIfNeeded(suggestions) {
            if (this._isDataProvider(suggestions)) {
                let wrapper = suggestions;
                if (!(wrapper instanceof oj.ListDataProviderView)) {
                    wrapper = new oj.ListDataProviderView(wrapper);
                }
                return wrapper;
            }
            return null;
        }
        _addDataProviderEventListeners(dataProvider) {
            dataProvider.addEventListener('mutate', this._handleDataProviderRefreshEventListener);
            dataProvider.addEventListener('refresh', this._handleDataProviderRefreshEventListener);
        }
        _removeDataProviderEventListeners(dataProvider) {
            dataProvider.removeEventListener('mutate', this._handleDataProviderRefreshEventListener);
            dataProvider.removeEventListener('refresh', this._handleDataProviderRefreshEventListener);
        }
        _resolveFetching() {
            if (this._loadingTimer) {
                this._loadingTimer.clear();
                this._loadingTimer = null;
            }
            if (this._resolveFetchBusyState) {
                this._resolveFetchBusyState();
                this._resolveFetchBusyState = null;
            }
            if (this.state.loading) {
                this._updateState({ loading: false });
            }
            this._updateState({ fetching: false });
        }
        static _formatItemText(suggestionItemText, suggestionItemContext) {
            let formatted;
            if (suggestionItemContext?.data) {
                if (typeof suggestionItemText === 'string') {
                    if (!suggestionItemContext.data?.hasOwnProperty(suggestionItemText)) {
                        Logger.error(`oj-input-search: No '${suggestionItemText}' property found in DataProvider with key: ${suggestionItemContext?.key}`);
                    }
                    formatted = suggestionItemContext.data[suggestionItemText];
                }
                else {
                    formatted = suggestionItemText(suggestionItemContext);
                }
            }
            return formatted || '';
        }
        _testChangeValue(value) {
            const promise = new Promise((resolve) => {
                this._testPromiseResolve = resolve;
            });
            this._updateState({
                filterText: value,
                displayValue: value,
                dropdownOpen: false,
                valueSubmitted: true,
                actionDetail: null
            });
            return promise;
        }
        _testChangeValueByKey(key) {
            const promise = new Promise((resolve) => {
                this._testPromiseResolve = resolve;
            });
            const afterUnsuccessfulFetch = function () {
                if (this._testPromiseResolve) {
                    this._testPromiseResolve();
                    this._testPromiseResolve = null;
                }
                throw new Error(`oj-input-search: No row found in DataProvider for key: ${key}`);
            };
            this._dataProvider.fetchByKeys({ keys: new Set([key]) }).then(function (fetchResults) {
                const item = fetchResults.results.get(key);
                if (item && item.data != null && item.metadata != null) {
                    const itemContext = {
                        data: item.data,
                        metadata: item.metadata,
                        key: item.metadata.key
                    };
                    const formattedText = InputSearch_1._formatItemText(this.props.suggestionItemText, itemContext);
                    this._updateState({
                        filterText: formattedText,
                        displayValue: formattedText,
                        dropdownOpen: false,
                        valueSubmitted: true,
                        actionDetail: itemContext
                    });
                }
                else {
                    afterUnsuccessfulFetch();
                }
            }.bind(this), afterUnsuccessfulFetch);
            return promise;
        }
    };
    exports.InputSearch.defaultProps = {
        suggestions: null,
        suggestionItemText: 'label',
        placeholder: '',
        value: null
    };
    exports.InputSearch._metadata = { "properties": { "suggestions": { "type": "object" }, "suggestionItemText": { "type": "string|number|function" }, "placeholder": { "type": "string" }, "rawValue": { "type": "string", "readOnly": true, "writeback": true }, "value": { "type": "string", "writeback": true } }, "events": { "ojValueAction": {} }, "slots": { "suggestionItemTemplate": { "data": {} } }, "extension": { "_WRITEBACK_PROPS": ["rawValue", "value"], "_READ_ONLY_PROPS": ["rawValue"], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "id"] }, "methods": { "focus": {}, "blur": {}, "_testChangeValue": {}, "_testChangeValueByKey": {} } };
    exports.InputSearch = InputSearch_1 = __decorate([
        ojvcomponent.customElement('oj-input-search')
    ], exports.InputSearch);

    Object.defineProperty(exports, '__esModule', { value: true });

});
