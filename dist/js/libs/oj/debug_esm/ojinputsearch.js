/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { recentTouchEnd, getReadingDirection } from 'ojs/ojdomutils';
import 'ojs/ojlistdataproviderview';
import $ from 'jquery';
import oj from 'ojs/ojcore-base';
import Context from 'ojs/ojcontext';
import { error } from 'ojs/ojlogger';
import { parseJSONFromFontFamily } from 'ojs/ojthemeutils';
import { getTimer } from 'ojs/ojtimerutils';
import { HighlightText } from 'ojs/ojhighlighttext';
import { VComponent, h, listener } from 'ojs/ojvcomponent';
import { ElementVComponent, h as h$1, listener as listener$1, customElement } from 'ojs/ojvcomponent-element';
import { VPopup } from 'ojs/ojpopupcore';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class Props {
    constructor() {
        this.focus = false;
        this.formattedText = '';
        this.index = -1;
        this.labelId = '';
        this.searchText = null;
    }
}
class InputSearchSuggestion extends VComponent {
    constructor(props) {
        super(props);
        this._fireSuggestionActionEvent = (text, itemContext) => {
            var _a, _b;
            (_b = (_a = this.props).onOjSuggestionAction) === null || _b === void 0 ? void 0 : _b.call(_a, { text: text, itemContext: itemContext });
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
    render() {
        const props = this.props;
        const rootClasses = {
            'oj-listbox-result': true,
            'oj-listbox-result-selectable': true,
            'oj-hover': this.state.hover,
            'oj-focus': props.focus
        };
        const content = this._renderContent();
        return (h("li", { role: 'presentation', class: rootClasses, onClick: this._handleClick, onMouseenter: this._handleMouseenter, onMouseleave: this._handleMouseleave },
            h("div", { id: props.labelId, class: 'oj-listbox-result-label', role: 'option' }, content)));
    }
    _renderContent() {
        var _a;
        const props = this.props;
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
        return (h(HighlightText, { "data-oj-internal": true, text: this.props.formattedText, matchText: (_a = props.searchText) !== null && _a !== void 0 ? _a : '' }));
    }
    _handleMouseenter(event) {
        if (!recentTouchEnd()) {
            this.updateState({ ['hover']: true });
        }
    }
    _handleMouseleave(event) {
        this.updateState({ ['hover']: false });
    }
    _handleClick(event) {
        const mainButton = event.button === 0;
        if (mainButton) {
            this._fireSuggestionActionEvent(this.props.formattedText, this.props.suggestionItemContext);
        }
    }
}
InputSearchSuggestion.metadata = { "extension": { "_DEFAULTS": Props } };
__decorate([
    listener()
], InputSearchSuggestion.prototype, "_handleMouseenter", null);
__decorate([
    listener()
], InputSearchSuggestion.prototype, "_handleMouseleave", null);
__decorate([
    listener()
], InputSearchSuggestion.prototype, "_handleClick", null);

var __decorate$1 = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var InputSearch_1;
class Props$1 {
    constructor() {
        this.suggestions = null;
        this.suggestionItemText = 'label';
        this.placeholder = '';
        this.rawValue = null;
        this.value = null;
    }
}
let InputSearch = InputSearch_1 = class InputSearch extends ElementVComponent {
    constructor(props) {
        super(props);
        this._CLASS_NAMES = 'oj-inputsearch-input';
        this._KEYS = {
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        };
        this._isComposing = false;
        this._counter = 0;
        this._queryCount = 0;
        this._renderedSuggestions = [];
        this._handleMousedown = (event) => {
            const mainButton = event.button === 0;
            if (mainButton) {
                this.updateState({
                    focus: true,
                    dropdownOpen: true
                });
                if (event.target !== this._inputElem) {
                    event.preventDefault();
                }
                else {
                    if (this.state.showAutocompleteText) {
                        if (!this.state.autocompleteFloatingText) {
                            this.updateState({
                                showAutocompleteText: false,
                                filterText: this.state.displayValue
                            });
                        }
                        else {
                            this.updateState({
                                showAutocompleteText: false,
                                filterText: this.state.autocompleteFloatingText,
                                displayValue: this.state.autocompleteFloatingText
                            });
                        }
                    }
                }
            }
        };
        this._handleDropdownMousedown = (event) => {
            const mainButton = event.button === 0;
            if (mainButton) {
                this.updateState({ focus: true });
                event.preventDefault();
            }
        };
        this._handleDropdownMousemove = (event) => {
            this.updateState({ lastEventType: 'mouse' });
        };
        this._handleDropdownMouseleave = (event) => {
            this.updateState({ lastEventType: null });
        };
        this._setRootElem = (element) => {
            this._rootElem = element;
        };
        this._setDropdownElem = (element) => {
            this._dropdownElem = element;
        };
        this._setInputElem = (element) => {
            this._inputElem = element;
        };
        this._setInputContainerElem = (element) => {
            this._inputContainerElem = element;
        };
        this._setRenderedSuggestion = (index, vnode) => {
            this._renderedSuggestions[index] = vnode;
        };
        this._getRenderedSuggestionsCount = () => {
            const length = this._renderedSuggestions.length;
            const nullIndex = this._renderedSuggestions.indexOf(null);
            return nullIndex === -1 ? length : nullIndex;
        };
        const cssOptionDefaults = parseJSONFromFontFamily('oj-inputsearch-option-defaults') || {};
        let showIndicatorDelay = cssOptionDefaults.showIndicatorDelay;
        showIndicatorDelay = parseInt(showIndicatorDelay, 10);
        showIndicatorDelay = isNaN(showIndicatorDelay) ? 250 : showIndicatorDelay;
        this._showIndicatorDelay = showIndicatorDelay;
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
            loading: false,
            focusedSuggestionIndex: -1,
            activeDescendantId: null,
            scrollFocusedSuggestionIntoView: null,
            actionDetail: null,
            lastEventType: null,
            showAutocompleteText: false,
            autocompleteFloatingText: null
        };
    }
    render() {
        const state = this.state;
        const rootClasses = {
            'oj-inputsearch': true,
            'oj-form-control': true,
            'oj-text-field': true,
            'oj-component': true,
            'oj-hover': state.hover,
            'oj-active': state.active,
            'oj-focus': state.focus,
            'oj-listbox-dropdown-open': state.dropdownOpen,
            'oj-listbox-drop-above': state.dropdownOpen && state.dropdownAbove
        };
        const inputClasses = this._CLASS_NAMES + ' oj-text-field-input';
        const iconClasses = 'oj-text-field-start-end-icon oj-inputsearch-search-icon oj-component-icon';
        const displayValue = state.displayValue || '';
        return this._renderEnabled(rootClasses, iconClasses, displayValue, inputClasses);
    }
    static initStateFromProps(props, state) {
        return {
            displayValue: props.value,
            filterText: props.value
        };
    }
    static updateStateFromProps(props, state, oldProps) {
        const updatedState = {};
        if (props.value !== oldProps.value && props.value !== state.displayValue) {
            updatedState.displayValue = props.value;
            updatedState.filterText = props.value;
        }
        if (oldProps.suggestions != props.suggestions) {
            updatedState.fetchedInitial = false;
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
    mounted() {
        var _a, _b;
        if (this.props.value !== null) {
            (_b = (_a = this.props).onRawValueChanged) === null || _b === void 0 ? void 0 : _b.call(_a, this.props.value);
        }
        if (this._dataProvider) {
            this._addDataProviderEventListeners(this._dataProvider);
        }
    }
    updated(oldProps, oldState) {
        var _a, _b, _c, _d, _e, _f;
        if ((oldState.focus && !this.state.focus) || this.state.valueSubmitted) {
            if (this.props.value !== this.state.displayValue) {
                (_b = (_a = this.props).onValueChanged) === null || _b === void 0 ? void 0 : _b.call(_a, this.state.displayValue);
            }
            if (oldState.focus && !this.state.focus && oldState.filterText !== this.state.displayValue) {
                this.updateState({ filterText: this.state.displayValue });
            }
            if (this.state.valueSubmitted) {
                (_d = (_c = this.props).onOjValueAction) === null || _d === void 0 ? void 0 : _d.call(_c, {
                    value: this.state.displayValue,
                    itemContext: this.state.actionDetail,
                    previousValue: this.props.value
                });
                this.updateState({ valueSubmitted: false });
                if (this._testPromiseResolve) {
                    this._testPromiseResolve();
                    this._testPromiseResolve = null;
                }
            }
        }
        if (oldState.displayValue != this.state.displayValue) {
            (_f = (_e = this.props).onRawValueChanged) === null || _f === void 0 ? void 0 : _f.call(_e, this.state.displayValue);
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
                this.updateState({ focusedSuggestionIndex: -1 });
                this._resolveFetching();
            }
        }
        else {
            if (this.state.lastFetchedFilterText != this.state.filterText || !this.state.fetchedInitial) {
                this.updateState({ lastFetchedFilterText: this.state.filterText });
                this._fetchData(this.state.filterText);
            }
            if (!oldState.dropdownOpen || this.state.filterText !== oldState.filterText) {
                this.updateState((state, props) => {
                    var _a;
                    return { focusedSuggestionIndex: ((_a = state.filterText) === null || _a === void 0 ? void 0 : _a.length) > 0 ? 0 : -1 };
                });
            }
            else if (this.state.fetchedData) {
                this.updateState((state, props) => {
                    return {
                        focusedSuggestionIndex: Math.min(state.fetchedData.length - 1, state.focusedSuggestionIndex)
                    };
                });
            }
            const focusIndex = this._resolveFetchBusyState ? -1 : this.state.focusedSuggestionIndex;
            if (focusIndex >= 0 && this.state.labelIds.length > focusIndex) {
                this.updateState({ activeDescendantId: this.state.labelIds[focusIndex] });
                const filterText = this.state.filterText || '';
                if (focusIndex === 0 && this.state.showAutocompleteText && filterText.length > 0) {
                    const firstSuggestionText = this._renderedSuggestions[0].getFormattedText();
                    const lowercaseFirstSuggestionText = firstSuggestionText.toLowerCase();
                    const lowercaseFilterText = filterText.toLowerCase();
                    if (lowercaseFirstSuggestionText.startsWith(lowercaseFilterText)) {
                        const selectionStart = filterText.length;
                        const autocompleteText = firstSuggestionText.substr(selectionStart);
                        this.updateState({
                            displayValue: filterText + autocompleteText,
                            autocompleteFloatingText: null
                        });
                        this._inputElem.setSelectionRange(selectionStart, selectionStart + autocompleteText.length);
                    }
                    else {
                        this.updateState({
                            autocompleteFloatingText: firstSuggestionText,
                            displayValue: filterText
                        });
                    }
                }
            }
            else {
                this.updateState({ activeDescendantId: null });
            }
            if (!this._resolveFetchBusyState && this.state.labelIds.length === 0) {
                this.updateState({ dropdownOpen: false });
            }
        }
        const scrollFocusedSuggestionIntoView = this.state.scrollFocusedSuggestionIntoView;
        if (scrollFocusedSuggestionIntoView) {
            const activeDescendantId = this.state.activeDescendantId;
            if (activeDescendantId) {
                const alignToTop = scrollFocusedSuggestionIntoView === 'top';
                this._scrollSuggestionIntoView(activeDescendantId, alignToTop);
                this.updateState({ scrollFocusedSuggestionIntoView: null });
            }
        }
    }
    unmounted() {
        if (this._dataProvider) {
            this._removeDataProviderEventListeners(this._dataProvider);
        }
        this._resolveFetching();
    }
    _handleMouseenter(event) {
        if (!recentTouchEnd()) {
            this.updateState({ hover: true });
        }
    }
    _handleMouseleave(event) {
        this.updateState({ hover: false });
    }
    _handleFocusin(event) {
        this.updateState({ focus: true });
    }
    _handleFocusout() {
        this.updateState({ focus: false });
    }
    _handleCompositionstart(event) {
        this._isComposing = true;
    }
    _handleCompositionend(event) {
        this._isComposing = false;
        this.updateState({
            filterText: event.target.value,
            displayValue: event.target.value
        });
    }
    _handleInput(event) {
        if (!this._isComposing) {
            let autocomplete;
            const filterText = this.state.filterText || '';
            const lowercaseFilter = filterText.toLowerCase();
            const lowercaseValue = event.target.value.toLowerCase();
            if (this.state.showAutocompleteText &&
                !this.state.autocompleteFloatingText &&
                filterText === event.target.value) {
                autocomplete = false;
            }
            else if (!this.state.showAutocompleteText &&
                lowercaseValue.length < lowercaseFilter.length &&
                lowercaseFilter.startsWith(lowercaseValue)) {
                autocomplete = false;
            }
            else {
                autocomplete = event.target.value.length > 0;
            }
            this.updateState({
                filterText: event.target.value,
                displayValue: event.target.value,
                dropdownOpen: true,
                showAutocompleteText: autocomplete
            });
        }
    }
    focus() {
        var _a;
        (_a = this._inputElem) === null || _a === void 0 ? void 0 : _a.focus();
    }
    blur() {
        var _a;
        (_a = this._inputElem) === null || _a === void 0 ? void 0 : _a.blur();
    }
    _handleFocus(event) {
        var _a;
        (_a = this._rootElem) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new FocusEvent('focus', { relatedTarget: event.relatedTarget }));
    }
    _handleBlur(event) {
        var _a;
        (_a = this._rootElem) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new FocusEvent('blur', { relatedTarget: event.relatedTarget }));
    }
    _handleKeydown(event) {
        var _a;
        const updatedState = { lastEventType: 'keyboard' };
        const keyCode = event.keyCode;
        switch (keyCode) {
            case this._KEYS.ENTER:
                const focusIndex = this.state.focusedSuggestionIndex;
                if (this.state.dropdownOpen &&
                    focusIndex >= 0 &&
                    this._getRenderedSuggestionsCount() > focusIndex &&
                    !this._resolveFetchBusyState) {
                    this._renderedSuggestions[focusIndex].fireSuggestionAction();
                }
                else {
                    Object.assign(updatedState, {
                        dropdownOpen: false,
                        valueSubmitted: true,
                        actionDetail: null
                    });
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
                        displayValue: this.state.filterText
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
                else if (!this._resolveFetchBusyState && this._getRenderedSuggestionsCount() > 0) {
                    let index = this.state.focusedSuggestionIndex;
                    if (keyCode === this._KEYS.DOWN || index === -1) {
                        index += 1;
                        updatedState.scrollFocusedSuggestionIntoView = 'bottom';
                    }
                    else if (index > 0) {
                        index -= 1;
                        updatedState.scrollFocusedSuggestionIntoView = 'top';
                    }
                    index = Math.min(this._getRenderedSuggestionsCount() - 1, index);
                    updatedState.focusedSuggestionIndex = index;
                    const autocomplete = index === 0 && ((_a = this.state.filterText) === null || _a === void 0 ? void 0 : _a.length) > 0;
                    updatedState.showAutocompleteText = autocomplete;
                    if (autocomplete) {
                        updatedState.displayValue = this.state.filterText;
                    }
                    else if (index > -1) {
                        updatedState.displayValue = this._renderedSuggestions[index].getFormattedText();
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
        this.updateState(updatedState);
    }
    _getDropdownElemId() {
        return 'searchDropdown_' + this.uniqueId();
    }
    _getInputContainerId() {
        return 'searchInputContainer_' + this.uniqueId();
    }
    _getListboxId() {
        return 'searchSuggestionsListbox_' + this.uniqueId();
    }
    _clickAwayHandler(event) {
        const target = event.target;
        if (target.closest('#' + $.escapeSelector(this._getDropdownElemId())) ||
            target.closest('#' + $.escapeSelector(this._getInputContainerId()))) {
            return;
        }
        const updatedState = { dropdownOpen: false };
        if (this.state.showAutocompleteText) {
            Object.assign(updatedState, {
                showAutocompleteText: false,
                displayValue: this.state.filterText
            });
        }
        this.updateState(updatedState);
    }
    _getDropdownPosition() {
        let position = {
            my: 'start top',
            at: 'start bottom',
            of: this._inputContainerElem,
            collision: 'flip',
            using: this._usingHandler.bind(this)
        };
        const isRtl = getReadingDirection() === 'rtl';
        position = oj.PositionUtils.normalizeHorizontalAlignment(position, isRtl);
        return position;
    }
    _usingHandler(pos, props) {
        if (oj.PositionUtils.isAligningPositionClipped(props)) {
            this.updateState({ dropdownOpen: false });
        }
        else {
            var dropdownElem = props.element.element;
            dropdownElem.css(pos);
            this.updateState({ dropdownAbove: props.vertical === 'bottom' });
        }
    }
    _renderEnabled(rootClasses, iconClasses, displayValue, inputClasses) {
        const props = this.props;
        const state = this.state;
        let ariaLabel = null;
        if (props['aria-label']) {
            ariaLabel = props['aria-label'];
        }
        const dropdown = state.dropdownOpen ? this._renderDropdown() : null;
        const listboxId = this._dataProvider ? this._getListboxId() : null;
        const agentInfo = oj.AgentUtils.getAgentInfo();
        const isMobile = agentInfo.os === oj.AgentUtils.OS.ANDROID ||
            agentInfo.os === oj.AgentUtils.OS.IOS ||
            agentInfo.os === oj.AgentUtils.OS.WINDOWSPHONE;
        const inputType = isMobile ? 'search' : 'text';
        const autocompleteFloatingElem = state.autocompleteFloatingText
            ? this._renderAutocompleteFloatingText(state.autocompleteFloatingText, displayValue)
            : null;
        return (h$1("oj-input-search", { ref: this._setRootElem, class: rootClasses, onMousedown: this._handleMousedown, onMouseenter: this._handleMouseenter, onMouseleave: this._handleMouseleave },
            h$1("div", { role: 'presentation', class: 'oj-text-field-container', id: this._getInputContainerId(), ref: this._setInputContainerElem },
                h$1("span", { class: 'oj-text-field-start' },
                    h$1("span", { class: iconClasses, role: 'presentation' })),
                h$1("div", { class: 'oj-text-field-middle', role: this._dataProvider ? 'combobox' : null, "aria-label": this._dataProvider ? ariaLabel : null, "aria-owns": listboxId, "aria-haspopup": this._dataProvider ? 'listbox' : 'false', "aria-expanded": state.dropdownOpen ? 'true' : 'false' },
                    h$1("input", { type: inputType, ref: this._setInputElem, value: displayValue, class: inputClasses, placeholder: props.placeholder, autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false', autofocus: 'false', "aria-label": ariaLabel, "aria-autocomplete": this._dataProvider ? 'list' : null, "aria-controls": listboxId, "aria-busy": state.dropdownOpen && state.loading, "aria-activedescendant": this._dataProvider ? state.activeDescendantId : null, onFocusin: this._handleFocusin, onFocusout: this._handleFocusout, onFocus: this._handleFocus, onBlur: this._handleBlur, onInput: this._handleInput, onCompositionstart: this._handleCompositionstart, onCompositionend: this._handleCompositionend, onKeydown: this._handleKeydown }),
                    autocompleteFloatingElem)),
            dropdown));
    }
    _renderDropdown() {
        const dropdownPosition = this._getDropdownPosition();
        const minWidth = this._rootElem.offsetWidth;
        const dropdownStyle = {
            minWidth: minWidth + 'px'
        };
        const dropdownContent = this.state.loading
            ? this._renderDropdownSkeleton()
            : this._renderDropdownSuggestions(this.state.filterText);
        const state = this.state;
        const dropdownClasses = {
            'oj-listbox-drop': true,
            'oj-listbox-inputsearch': true,
            'oj-listbox-hide-hover': state.lastEventType === 'keyboard',
            'oj-listbox-hide-focus': state.lastEventType === 'mouse',
            'oj-listbox-drop-above': state.dropdownAbove
        };
        return (h$1(VPopup, { position: dropdownPosition, layerSelectors: 'oj-listbox-drop-layer', autoDismiss: this._clickAwayHandler },
            h$1("div", { id: this._getDropdownElemId(), ref: this._setDropdownElem, class: dropdownClasses, role: 'presentation', style: dropdownStyle, onMousedown: this._handleDropdownMousedown, onMousemove: this._handleDropdownMousemove, onMouseleave: this._handleDropdownMouseleave }, dropdownContent)));
    }
    _renderAutocompleteFloatingText(autocompleteFloatingText, displayValue) {
        const hiddenTextStyle = {
            visibility: 'hidden'
        };
        const text = '\xa0- ' + autocompleteFloatingText;
        return (h$1("div", { class: 'oj-inputsearch-autocomplete-floating-container' },
            h$1("span", { style: hiddenTextStyle }, displayValue),
            h$1("span", { class: 'oj-inputsearch-autocomplete-floating-text' }, text)));
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
        return this.uniqueId() + '-' + this._counter++;
    }
    _handleDataProviderRefreshEventListener(event) {
        this.updateState({ fetchedInitial: false });
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
                error('InputSearch: DataProvider does not support text filter. ' +
                    'Filtering results in dropdown may not work correctly.');
            }
            fetchParams['filterCriterion'] = oj.FilterFactory.getFilter({
                filterDef: { text: searchText }
            });
        }
        if (!this._loadingTimer) {
            const timer = getTimer(this._showIndicatorDelay);
            timer.getPromise().then(function (pending) {
                this._loadingTimer = null;
                if (pending && this._dataProvider && this.state.dropdownOpen) {
                    this.updateState({ loading: true });
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
                this.updateState({ fetchedInitial: true, labelIds, fetchedData });
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
        let skeletonItems = [];
        for (let i = 0; i < numItems; i++) {
            skeletonItems.push(h$1("li", { role: 'presentation', class: 'oj-listbox-result', style: resultStyle },
                h$1("div", { class: 'oj-listbox-result-label oj-listbox-skeleton-line-height oj-animation-skeleton' })));
        }
        return (h$1("ul", { role: 'listbox', id: this._getListboxId(), class: 'oj-listbox-results oj-inputsearch-results' }, skeletonItems));
    }
    _renderDropdownSuggestions(searchText) {
        var _a;
        const props = this.props;
        const state = this.state;
        if (((_a = state.fetchedData) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            let suggestions = [];
            for (let i = 0; i < state.fetchedData.length; i++) {
                const focused = i === state.focusedSuggestionIndex;
                const formattedText = InputSearch_1._formatItemText(props.suggestionItemText, state.fetchedData[i]);
                const suggestion = (h$1(InputSearchSuggestion, { ref: this._setRenderedSuggestion.bind(this, i), labelId: state.labelIds[i], focus: focused, index: i, formattedText: formattedText, searchText: searchText, suggestionItemContext: state.fetchedData[i], suggestionItemTemplate: props.suggestionItemTemplate, onOjSuggestionAction: this._handleSuggestionAction }));
                suggestions.push(suggestion);
            }
            return (h$1("ul", { role: 'listbox', id: this._getListboxId(), class: 'oj-listbox-results oj-inputsearch-results' }, suggestions));
        }
        return null;
    }
    _handleSuggestionAction(detail) {
        this.updateState({
            filterText: detail.text,
            displayValue: detail.text,
            dropdownOpen: false,
            valueSubmitted: true,
            actionDetail: detail.itemContext
        });
    }
    _addBusyState(description) {
        const elem = this._rootElem;
        const desc = 'The component identified by "' + elem.id + '" ' + description;
        const busyStateOptions = { description: desc };
        const busyContext = Context.getContext(elem).getBusyContext();
        return busyContext.addBusyState(busyStateOptions);
    }
    _isDataProvider(suggestions) {
        return (suggestions === null || suggestions === void 0 ? void 0 : suggestions['fetchFirst']) ? true : false;
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
            this.updateState({ loading: false });
        }
    }
    static _formatItemText(suggestionItemText, suggestionItemContext) {
        var _a;
        let formatted;
        if (suggestionItemContext === null || suggestionItemContext === void 0 ? void 0 : suggestionItemContext.data) {
            if (typeof suggestionItemText === 'string') {
                if (!((_a = suggestionItemContext.data) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(suggestionItemText))) {
                    error(`oj-input-search: No '${suggestionItemText}' property found in DataProvider with key: ${suggestionItemContext === null || suggestionItemContext === void 0 ? void 0 : suggestionItemContext.key}`);
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
        this.updateState({
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
                this.updateState({
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
InputSearch.metadata = { "extension": { "_DEFAULTS": Props$1, "_ROOT_PROPS_MAP": { "aria-label": 1 }, "_WRITEBACK_PROPS": ["rawValue", "value"], "_READ_ONLY_PROPS": ["rawValue"] }, "properties": { "suggestions": { "type": "object|null", "value": null }, "suggestionItemText": { "type": "string | number|function", "value": "label" }, "placeholder": { "type": "string", "value": "" }, "rawValue": { "type": "string|null", "value": null, "readOnly": true, "writeback": true }, "value": { "type": "string|null", "value": null, "writeback": true } }, "events": { "ojValueAction": { "bubbles": false } }, "slots": { "suggestionItemTemplate": { "data": {} } }, "methods": { "focus": {}, "blur": {}, "_testChangeValue": {}, "_testChangeValueByKey": {} } };
__decorate$1([
    listener$1()
], InputSearch.prototype, "_handleMouseenter", null);
__decorate$1([
    listener$1()
], InputSearch.prototype, "_handleMouseleave", null);
__decorate$1([
    listener$1()
], InputSearch.prototype, "_handleFocusin", null);
__decorate$1([
    listener$1()
], InputSearch.prototype, "_handleFocusout", null);
__decorate$1([
    listener$1()
], InputSearch.prototype, "_handleCompositionstart", null);
__decorate$1([
    listener$1()
], InputSearch.prototype, "_handleCompositionend", null);
__decorate$1([
    listener$1()
], InputSearch.prototype, "_handleInput", null);
__decorate$1([
    listener$1()
], InputSearch.prototype, "_handleFocus", null);
__decorate$1([
    listener$1()
], InputSearch.prototype, "_handleBlur", null);
__decorate$1([
    listener$1()
], InputSearch.prototype, "_handleKeydown", null);
__decorate$1([
    listener$1()
], InputSearch.prototype, "_clickAwayHandler", null);
__decorate$1([
    listener$1()
], InputSearch.prototype, "_handleDataProviderRefreshEventListener", null);
__decorate$1([
    listener$1()
], InputSearch.prototype, "_handleSuggestionAction", null);
InputSearch = InputSearch_1 = __decorate$1([
    customElement('oj-input-search')
], InputSearch);

export { InputSearch };
