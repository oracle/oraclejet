/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import { recentTouchEnd, getReadingDirection } from 'ojs/ojdomutils';
import 'ojs/ojlistdataproviderview';
import oj from 'ojs/ojcore-base';
import { getDeviceRenderMode, getDeviceType } from 'ojs/ojconfig';
import Context from 'ojs/ojcontext';
import { error } from 'ojs/ojlogger';
import { parseJSONFromFontFamily, getCachedCSSVarValues } from 'ojs/ojthemeutils';
import { getTimer } from 'ojs/ojtimerutils';
import { getTranslatedString } from 'ojs/ojtranslation';
import { Component } from 'preact';
import { HighlightText } from 'ojs/ojhighlighttext';
import { getUniqueId, Root, customElement } from 'ojs/ojvcomponent';
import { PositionUtils, VPopup } from 'ojs/ojpopupcore';
import { getAbortReason } from 'ojs/ojabortreason';
import { DebouncingDataProviderView } from 'ojs/ojdebouncingdataproviderview';

class InputSearchSkeleton extends Component {
    constructor(props) {
        super(props);
    }
    render(props) {
        return (jsx("li", { role: "presentation", class: "oj-listbox-result", style: props.itemStyle, children: jsx("div", { class: "oj-listbox-result-label oj-listbox-skeleton-line-height oj-animation-skeleton" }) }));
    }
}
InputSearchSkeleton.defaultProps = {
    itemStyle: null
};

class InputSearchSkeletonList extends Component {
    constructor(props) {
        super(props);
    }
    render(props) {
        const skeletonItems = [];
        for (let i = 0; i < props.numItems; i++) {
            skeletonItems.push(jsx(InputSearchSkeleton, { itemStyle: props.itemStyle }));
        }
        return (jsx("ul", { role: "listbox", id: props.id, class: "oj-listbox-results oj-inputsearch-results", children: skeletonItems }));
    }
}
InputSearchSkeletonList.defaultProps = {
    id: null,
    numItems: 1,
    itemStyle: null
};

class InputSearchSuggestion extends Component {
    constructor(props) {
        super(props);
        this._handleMouseenter = (event) => {
            // do this for real mouse enters, but not 300ms after a tap
            if (!recentTouchEnd()) {
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
        return (jsx("li", { role: "presentation", class: rootClasses, onClick: this._handleClick, onMouseEnter: this._handleMouseenter, onMouseLeave: this._handleMouseleave, children: jsx("div", { id: props.labelId, class: "oj-listbox-result-label", role: "option", children: content }) }));
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
        return (jsx(HighlightText, { "data-oj-internal": true, text: props.formattedText, matchText: props.searchText ?? '' }));
    }
}
InputSearchSuggestion.defaultProps = {
    focus: false,
    formattedText: '',
    index: -1,
    labelId: '',
    searchText: null
};

class InputSearchSuggestionsList extends Component {
    constructor(props) {
        super(props);
        this._renderedSuggestions = [];
        this.getCount = () => {
            // calculate the number of rendered suggestions based on the number of non-null entries in the
            // array, because unmounted suggestions will have their ref set to null
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
                const suggestion = (jsx(InputSearchSuggestion, { ref: this._setRenderedSuggestion.bind(this, i), labelId: props.labelIds[i], focus: focused, index: i, formattedText: formattedText, searchText: props.searchText, suggestionItemContext: props.data[i], suggestionItemTemplate: props.suggestionItemTemplate, onOjSuggestionAction: props.onOjSuggestionAction }));
                suggestions.push(suggestion);
            }
            return (jsx("ul", { role: "listbox", id: props.id, class: "oj-listbox-results oj-inputsearch-results", "aria-label": props['aria-label'], children: suggestions }));
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

class ComposingInput extends Component {
    constructor(props) {
        super(props);
        this._isComposing = false;
        this._setInputElem = (element) => {
            this._inputElem = element;
            // pass the ref on, if needed
            // TODO: The ref assignment support here isn't complete, for example it doesn't work with
            // a ref obtained via createRef.  This is okay for now because ComposingInput is only used
            // internally by input-search, but we should fix this if we decide to expose it more widely.
            this.props.inputRef?.(element);
        };
        this._handleCompositionstart = (event) => {
            // Keep track of whether the user is composing a character
            this._isComposing = true;
            // pass the event on, if needed
            // (need to specify this._inputElem as the 'this' context to match the HTMLElement event
            // listener contract)
            this.props.onCompositionStart?.call(this._inputElem, event);
        };
        this._handleCompositionend = (event) => {
            this._isComposing = false;
            // pass the event on, if needed
            // (need to specify this._inputElem as the 'this' context to match the HTMLElement event
            // listener contract)
            this.props.onCompositionEnd?.call(this._inputElem, event);
            // On some browsers, compositionend event is fired before the final input event,
            // while it's the other way around on other browsers.  Just update rawValue here
            // anyway since _SetRawValue will compare the value before actually updating it.
            this.props.onInputChanged?.({ value: event.target.value });
        };
        this._handleInput = (event) => {
            // pass the event on, if needed
            // (need to specify this._inputElem as the 'this' context to match the HTMLElement event
            // listener contract)
            this.props.onInput?.call(this._inputElem, event);
            // Update rawValue only if the user is not in the middle of composing a character.
            // Non-latin characters can take multiple keystrokes to compose one character.
            // The keystroke sequence is bracketed by compositionstart and compositionend events,
            // and each keystroke also fires the input event.  Including the intermediate input
            // in rawValue makes it hard to do meaningful validation.
            // JET-39086 - raw-value is not getting updated until space in android devices
            // In android devices, typing in an English word will behave similar to what one
            // would see when they compose a CJK character in desktop devices. So, we need to
            // update the raw-value for all the input events in Android devices without considering
            // composition events so that the property gets updated for each english character and not
            // only for delimiters. In GBoard all the CJK keyboard layouts directly allow users
            // to input a CJK character, so we do not need to rely on composition events for that.
            // In Japanese keyboard, one of the three available layouts uses english chars
            // to compose a Japanese character in which case circumventing the logic would end up
            // updating the property with garbage values. But, it is highly unlikely for one to
            // use this layout as the other two layouts would allow users to directly type in Japanese
            // characters. So, for now we will not have to worry about composition events in
            // Android devices.
            if (!this._isComposing || this._isAndroidDevice) {
                this.props.onInputChanged?.({ value: event.target.value });
            }
        };
        const agentInfo = oj.AgentUtils.getAgentInfo();
        this._isAndroidDevice = agentInfo.os === oj.AgentUtils.OS.ANDROID;
    }
    render(props) {
        // pull out the onInput, onCompositionStart, and onCompositionEnd props so that they're
        // not included in passThroughProps because we're going to specify them directly
        const { onInputChanged, onInput, onCompositionStart, onCompositionEnd, ...passThroughProps } = props;
        return (jsx("input", { ref: this._setInputElem, onInput: this._handleInput, 
            // @ts-ignore
            // There is a bug in preact where onCompositionStart and onCompositionEnd events do not get
            // registered correctly - https://github.com/preactjs/preact/issues/3003. So, we need to
            // use oncompositionstart and oncompositionend as a workaround. We also need to disable ts
            // for this to work, as these do not exist in the JSXInternal DOMAttributes.
            oncompositionstart: this._handleCompositionstart, oncompositionend: this._handleCompositionend, ...passThroughProps }));
    }
}

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var InputSearch_1;
/**
 * @classdesc
 * <h3 id="inputSearchOverview-section">
 *   JET Input Search
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputSearchOverview-section"></a>
 * </h3>
 * <p>Description: JET Input Search provides support for entering search text.</p>
 *
 * <p>JET Input Search displays an input field that a user can type into, as well as an optional dropdown list of suggestions.</p>
 *
 * An Input Search that shows only an input field can be created with the following markup.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-input-search aria-label='Search'>
 * &lt;/oj-input-search>
 * </code></pre>
 *
 * <p>An Input Search that shows an input field with a dropdown list of suggestions can be
 * created with the following markup.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-input-search suggestions='[[dataProvider]]'
 *                  aria-label='Search'>
 * &lt;/oj-input-search>
 * </code></pre>
 *
 * <p>Input Search will only show up to a maximum of 12 suggestions in the dropdown list.  The
 * list could show most recently used searches or high confidence suggested results.  It is
 * intended to help the user enter search text in order to conduct a subsequent search.  It is up
 * to the application to conduct the search and display results elsewhere on the page.</p>
 *
 * <p>An application should register a listener for the ojValueAction event in order to be
 * notified when the user submits search text.  The application should then conduct the search and
 * display the results.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-input-search on-oj-value-action='[[handleValueAction]]'
 *                  aria-label='Search'>
 * &lt;/oj-input-search>
 * </code></pre>
 *
 * <p>If an application provides a separate search button, then it may choose to ignore
 * ojValueAction events and instead bind to the value.  When the search button is clicked, the
 * application would conduct a search with the currently set value.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-input-search value='{{searchText}}'
 *                  aria-label='Search'>
 * &lt;/oj-input-search>
 * &lt;oj-button on-oj-action='[[conductSearch]]'>
 *   Search
 * &lt;/oj-button>
 * </code></pre>
 *
 * <p>The <a href="#value">value</a> property is guaranteed to be up-to-date at the time the
 * <a href="#event:valueAction">ojValueAction</a> event is dispatched.</p>
 *
 * <p><b>Note:</b>  Input Search is not a full-fledged form control and does not support some of
 * the common features of form controls.  For example, it is not expected to be used in an
 * <code class="prettyprint">oj-form-layout</code>, it does not support a label, and it does not
 * support assistive text.</p>
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Input Field</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td> If the drop down is not open, expand the drop down list. Otherwise, close the drop down list.</td>
 *     </tr>
 *   </tbody>
 *  </table>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Input field</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Set the input text as the value.</td>
 *     </tr>
 *     <tr>
 *      <td>Input field</td>
 *       <td><kbd>UpArrow or DownArrow</kbd></td>
 *       <td> If the drop down is not open, expand the drop down list.</td>
 *     </tr>
 *     <tr>
 *      <td>Input field</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td> Collapse the drop down list. If the drop down is already closed, do nothing.</td>
 *     </tr>
 *     <tr>
 *      <td>Input field</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Set focus to the Input Search.</td>
 *     </tr>
 *   </tbody>
 *  </table>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to set an aria-label on the Input Search.
 * </p>
 * @typeparam {object} K Type of key of the dataprovider
 * @typeparam {object} D Type of data from the dataprovider
 * @ojmetadata description "An Input Search is an input field that the user can type search text into."
 * @ojmetadata displayName "Input Search"
 * @ojmetadata main "ojs/ojinputsearch"
 * @ojmetadata extension {
 *   "oracle": {
 *     "icon": "oj-ux-ico-input-search",
 *     "uxSpecs": ["input-search"]
 *   },
 *   "themes": {
 *     "unsupportedThemes": ["Alta"]
 *   },
 *   "vbdt": {
 *     "module": "ojs/ojinputsearch",
 *     "defaultColumns": "6",
 *     "minColumns": "2"
 *   }
 * }
 * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojInputSearch.html"
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "placeholder"
 *     ]
 *   }
 * ]
 * @ojmetadata styleClasses [
 *   {
 *     "name": "oj-input-search-hero",
 *     "kind": "class",
 *     "displayName": "Hero Search",
 *     "description": "Render a larger search field that is more prominent on the page",
 *     "help": "#oj-input-search-hero",
 *     "extension": {
 *         "jet": {
 *            "example": "&lt;oj-input-search class=\"oj-input-search-hero\">\n &lt;!-- Content -->\n &lt;/oj-input-search>"
 *          }
 *      }
 *   },
 *   {
 *     "name": "form-control-max-width",
 *     "kind": "set",
 *     "displayName": "Max Width",
 *     "description": "In the Redwood theme the default max width of a text field is 100%.  These max width convenience classes are available to create a medium or small field.<br>  The class is applied to the root element.",
 *     "help": "#form-control-max-width",
 *     "styleRelation": "exclusive",
 *     "styleItems": [
 *       {
 *         "name": "oj-form-control-max-width-sm",
 *         "kind": "class",
 *         "displayName": "Small",
 *         "description": "Sets the max width for a small field."
 *       },
 *       {
 *         "name": "oj-form-control-max-width-md",
 *         "kind": "class",
 *         "displayName": "Medium",
 *         "description": "Sets the max width for a medium field."
 *       }
 *     ]
 *   },
 *   {
 *     "name": "form-control-width",
 *     "kind": "set",
 *     "displayName": "Width",
 *     "description": "In the Redwood theme the default width of a text field is 100%.  These width convenience classes are available to create a medium or small field.<br>  The class is applied to the root element.",
 *     "help": "#form-control-width",
 *     "styleRelation": "exclusive",
 *     "styleItems": [
 *       {
 *         "name": "oj-form-control-width-sm",
 *         "kind": "class",
 *         "displayName": "Small",
 *         "description": "Sets the width for a small field."
 *       },
 *       {
 *         "name": "oj-form-control-width-md",
 *         "kind": "class",
 *         "displayName": "Medium",
 *         "description": "Sets the width for a medium field."
 *       }
 *     ]
 *   }
 * ]
 * @ojmetadata since "9.0.0"
 */
let InputSearch = InputSearch_1 = class InputSearch extends Component {
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
        /**
         * mouseenter event listener
         */
        this._handleMouseenter = (event) => {
            // do this for real mouse enters, but not 300ms after a tap
            if (!recentTouchEnd()) {
                this._updateState({ hover: true });
            }
        };
        /**
         * mouseleave event listener
         */
        this._handleMouseleave = (event) => {
            this._updateState({ hover: false });
        };
        /**
         * focusin event listener
         */
        this._handleFocusin = (event) => {
            if (event.target === event.currentTarget) {
                this._handleFocus(event);
            }
            this._updateState({ focus: true });
        };
        /**
         * focusout event listener
         */
        this._handleFocusout = (event) => {
            if (event.target === event.currentTarget) {
                this._handleBlur(event);
            }
            this._updateState({ focus: false });
        };
        /**
         * focusin event listener
         */
        this._handleMobileFilterInputFocusin = (event) => {
            this._updateState({ mobileFilterInputFocus: true });
        };
        /**
         * focusout event listener
         */
        this._handleMobileFilterInputFocusout = (event) => {
            this._updateState({ mobileFilterInputFocus: false });
        };
        this._handleMobileFilterClear = (event) => {
            // return focus to the dropdown input field
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
        /**
         * Invoked when the input event happens
         */
        this._handleInputChanged = (detail) => {
            const value = detail.value;
            const isAutocompleteOn = this.props.autocomplete === 'on';
            const filterText = this.state.filterText || '';
            const lowercaseFilter = filterText.toLowerCase();
            const lowercaseValue = value.toLowerCase();
            const updatedState = {};
            if (this.state.showAutocompleteText &&
                !this.state.autocompleteFloatingText &&
                filterText === value) {
                // if showing "starts with" autocomplete text and the input text has changed such that the
                // text is the same as the typed filter text (for example if the user deleted the selected
                // autocomplete text), then do not immediately re-show the autocomplete text and remove
                // the highlight from the first suggestion
                Object.assign(updatedState, {
                    showAutocompleteText: false,
                    focusedSuggestionIndex: -1
                });
            }
            else if (!this.state.showAutocompleteText &&
                lowercaseValue.length < lowercaseFilter.length &&
                lowercaseFilter.startsWith(lowercaseValue)) {
                // if not showing autocomplete text and characters have been deleted from the end of the
                // input text, then do not immediately re-show the autocomplete text (for example, if the
                // user types 'firefo' and we autocomplete with 'x', and then the user deletes characters
                // one by one, we don't want to autocomplete the same string after each deleted character)
                Object.assign(updatedState, {
                    showAutocompleteText: false
                });
            }
            else {
                Object.assign(updatedState, {
                    showAutocompleteText: isAutocompleteOn && value.length > 0
                });
            }
            Object.assign(updatedState, {
                filterText: value,
                displayValue: value,
                dropdownOpen: true
            });
            this._updateState(updatedState);
        };
        /**
         * Invoked when focus is triggered on this.element
         */
        this._handleFocus = (event) => {
            // JET-38304 - Calling focus() on oj-input-search doesn't transfer focus
            // dispatch a focus event on the custom element when the input gets focus
            this._rootElem?.dispatchEvent(new FocusEvent('focus', { relatedTarget: event.relatedTarget }));
        };
        /**
         * Invoked when blur is triggered on this.element
         */
        this._handleBlur = (event) => {
            // JET-38304 - Calling focus() on oj-input-search doesn't transfer focus
            // dispatch a blur event on the custom element when the input gets blurred
            this._rootElem?.dispatchEvent(new FocusEvent('blur', { relatedTarget: event.relatedTarget }));
        };
        this._handleFilterInputKeydownEnter = (event) => {
            const focusIndex = this.state.focusedSuggestionIndex;
            if (this.state.dropdownOpen &&
                focusIndex >= 0 &&
                this._suggestionsList?.getCount() > focusIndex &&
                // don't select value from dropdown if fetching
                !this._resolveFetchBusyState &&
                this.props.autocomplete === 'on') {
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
                    // JET-43574 - leave starts-with autocomplete text in field when click or tab away
                    // if showing autocomplete text, commit it to the display value
                    if (this.state.showAutocompleteText) {
                        Object.assign(updatedState, {
                            showAutocompleteText: false,
                            resetFilterInputSelectionRange: true
                        });
                    }
                    break;
                case this._KEYS.ESC:
                    // JET-37929 - inputSearch prevents enclosing oj-dialog to be closed with 'esc' key
                    // only preventDefault if dropdown is open because component will close it, otherwise let
                    // the event go through unmodified because an ancestor component may handle the event, like
                    // a dialog that is being dismissed
                    if (this.state.dropdownOpen) {
                        updatedState.dropdownOpen = false;
                        // if showing autocomplete text, turn it off and remove it from the display value
                        if (this.state.showAutocompleteText) {
                            Object.assign(updatedState, {
                                showAutocompleteText: false,
                                displayValue: this.state.filterText
                            });
                        }
                        // need to preventDefault so that value doesn't get cleared and dropdown doesn't stay open
                        event.preventDefault();
                    }
                    break;
                case this._KEYS.UP:
                case this._KEYS.DOWN:
                    if (!this.state.dropdownOpen) {
                        updatedState.dropdownOpen = true;
                    }
                    else if (!this._resolveFetchBusyState && this._suggestionsList?.getCount() > 0) {
                        // don't update index if fetching or if there are no rendered suggestions
                        let index = this.state.focusedSuggestionIndex;
                        if (keyCode === this._KEYS.DOWN || index === -1) {
                            index += 1;
                            updatedState.scrollFocusedSuggestionIntoView = 'bottom';
                        }
                        else if (index > 0) {
                            // don't decrement lower than 0
                            index -= 1;
                            updatedState.scrollFocusedSuggestionIntoView = 'top';
                            // call preventDefault so that the text cursor doesn't jump to the beginning of the
                            // text while arrowing up through the suggestions
                            event.preventDefault();
                        }
                        index = Math.min(this._suggestionsList?.getCount() - 1, index);
                        updatedState.focusedSuggestionIndex = index;
                        // show the original filter text if there was any and the first autocomplete suggestion
                        // is highlighted, otherwise show the text of the suggestion
                        const autocomplete = this.props.autocomplete === 'on' && index === 0 && this.state.filterText?.length > 0;
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
                    // if showing "starts with" autocomplete text, commit the autocomplete to be part of the
                    // filter text
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
            // this will skip updating the state if the user is in the middle of composing a multi-byte character (CJK) like in Chinese.
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
                // keep focus on input elem (prevent focus from transferring)
                if (event.target !== this._mainInputElem || this.state.fullScreenPopup) {
                    event.preventDefault();
                }
                else {
                    this._handleFilterInputMousedown(event);
                }
            }
        };
        this._handleFilterInputMousedown = (event) => {
            // if showing autocomplete text, commit the autocomplete to be part of the filter text
            // (only do this if clicking on the input field, because that's when the browser will
            // move the caret and clear the autocomplete selection)
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
                // keep focus on input elem (prevent focus from transferring)
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
            //  - period character in element id prevents options box open/close;
            // escapeSelector handles special characters
            const target = event.target;
            if (target.closest('#' + CSS.escape(this._getDropdownElemId())) ||
                target.closest('#' + CSS.escape(this._getMainInputContainerId()))) {
                return;
            }
            const updatedState = { dropdownOpen: false };
            // JET-43574 - leave starts-with autocomplete text in field when click or tab away
            // if showing autocomplete text, commit it to the display value
            if (this.state.showAutocompleteText) {
                Object.assign(updatedState, {
                    showAutocompleteText: false,
                    resetFilterInputSelectionRange: true
                });
            }
            this._updateState(updatedState);
        };
        this._handleDataProviderRefreshEventListener = (event) => {
            // turn off fetchedInitial flag because we'll need to fetch new data the next time we render the
            // dropdown
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
        this._uniqueId = props['id'] ? props['id'] : getUniqueId();
        const cssOptionDefaults = parseJSONFromFontFamily('oj-inputsearch-option-defaults') || {};
        let showIndicatorDelay = cssOptionDefaults.showIndicatorDelay;
        showIndicatorDelay = parseInt(showIndicatorDelay, 10);
        showIndicatorDelay = isNaN(showIndicatorDelay) ? 250 : showIndicatorDelay;
        this._showIndicatorDelay = showIndicatorDelay;
        // JET-44062 - add gap between field and dropdown
        const dropdownVerticalOffset = getCachedCSSVarValues(['--oj-private-core-global-dropdown-offset'])[0] || '0';
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
            // whether the last event was 'keyboard' or 'mouse'
            lastEventType: null,
            showAutocompleteText: false,
            autocompleteFloatingText: null,
            initialRender: true,
            oldPropsValue: props.value,
            oldPropsSuggestions: props.suggestions,
            fullScreenPopup: props.suggestions && getDeviceRenderMode() === 'phone',
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
        // if (!props.rawValue && !props.value) {
        //   rootClasses += ' oj-has-no-value';
        // }
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
        // The relationship between value, rawValue, displayValue, and filterText is as follows:
        // Initially: props.value === state.displayValue === state.filterText
        // When autocomplete text is not shown:
        //   Typing: state.displayValue === state.filterText === props.rawValue
        //   Arrowing in dropdown: state.displayValue === props.rawValue, but state.filterText does not update
        //   Always: rawValue === displayValue
        //   Loss of Focus or value submitted via enter or dropdown selection: value === displayValue
        // When autocomplete text is shown:
        //   state.displayValue === props.rawValue === state.filterText + autocomplete text
        return {
            displayValue: props.value,
            filterText: props.value,
            fullScreenPopup: props.suggestions && getDeviceRenderMode() === 'phone'
        };
    }
    static _updateStateFromProps(props, state) {
        const updatedState = {};
        // TODO organize logic into helper methods when we're done refactoring updated()
        if (props.value !== state.oldPropsValue &&
            ((!state.fullScreenPopup && props.value !== state.displayValue) ||
                (state.fullScreenPopup && !state.dropdownOpen))) {
            // The value has been programmatically updated, update the displayValue
            // and filterText to match
            updatedState.displayValue = props.value;
            updatedState.filterText = props.value;
        }
        if (state.oldPropsSuggestions != props.suggestions) {
            updatedState.fetchedInitial = false;
            updatedState.fullScreenPopup = props.suggestions && getDeviceRenderMode() === 'phone';
        }
        // Event listeners may toggle this state even when there is no data provider
        // so we need to reset here
        if (!props.suggestions) {
            updatedState.dropdownOpen = false;
            updatedState.fetchedData = null;
        }
        // if the dropdown is not open, clear the lastEventType and turn off autocomplete
        if (state.dropdownOpen === false || updatedState.dropdownOpen === false) {
            updatedState.lastEventType = null;
            updatedState.showAutocompleteText = false;
        }
        // if not showing autocomplete text, clear the floating text
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
        // wrap any state updates in an updater function so we can compare the new state against
        // the current state and prevent re-rendering if nothing has actually changed (so we don't
        // end up in an infinite render loop where the same state is repeatedly applied)
        const newUpdater = function (state, props) {
            // get the new partial state
            let partialState;
            if (typeof updater === 'function') {
                partialState = updater(state, props);
            }
            else {
                partialState = updater;
            }
            // determine whether anything actually changed
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
        const isAutocompleteOn = this.props.autocomplete === 'on';
        // if the fullscreen popup is opening, transfer focus to the filter field
        if (this.state.fullScreenPopup && !oldState.dropdownOpen && this.state.dropdownOpen) {
            this._mobileFilterInputElem?.focus();
        }
        // Update the value when we lose focus or when the user manually submits
        // the value, e.g. Enter key or selecting from dropdown
        if ((oldState.focus && !this.state.focus) || this.state.valueSubmitted) {
            if (this.props.value !== this.state.displayValue) {
                this.props.onValueChanged?.(this.state.displayValue);
            }
            // JET-36416 - dropdown not filtered by existing text when opened
            // if clicking out or tabbing out, update the filterText so that the next time the dropdown
            // is opened it gets filtered by the displayed text
            if (oldState.focus && !this.state.focus && oldState.filterText !== this.state.displayValue) {
                this._updateState({ filterText: this.state.displayValue });
            }
            // Don't fire an ojValueAction event for focus loss
            if (this.state.valueSubmitted) {
                this.props.onOjValueAction?.({
                    value: this.state.displayValue,
                    itemContext: this.state.actionDetail,
                    previousValue: this.props.value
                });
                // return focus to the main input field when a value has been submitted from the
                // fullscreen dropdown
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
        // rawValue always equals displayValue so it's easiest if we update this in a central location
        // since state updates are asynchronous
        if (oldState.displayValue != this.state.displayValue) {
            this.props.onRawValueChanged?.(this.state.displayValue);
        }
        // if suggestions changed, we need to clean up the old suggestions and setup the new ones
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
            // Fetch new data if:
            // 1) the dropdown is open and the filter text has changed, or
            // 2) we don't have any cached data and we haven't yet started a fetch
            if (this.state.lastFetchedFilterText != this.state.filterText ||
                (!this.state.fetchedInitial && !this._resolveFetchBusyState)) {
                this._updateState({ lastFetchedFilterText: this.state.filterText });
                this._fetchData(this.state.filterText);
            }
            // if the dropdown is opening or if the filter text has changed while it's open, then focus
            // the first suggestion if there is search text
            if (!oldState.dropdownOpen || this.state.filterText !== oldState.filterText) {
                // if opening the dropdown without changing the filter text, like by clicking on the
                // field or pressing the down arrow, don't highlight the first suggestion because
                // pressing Enter with the existing text should re-submit the same text instead of
                // submitting the first suggestion's text
                if (!oldState.dropdownOpen && this.state.filterText === oldState.filterText) {
                    this._updateState({ focusedSuggestionIndex: -1 });
                }
                else {
                    this._updateState((state, props) => {
                        const newIndex = state.filterText?.length > 0 ? 0 : -1;
                        if (!isAutocompleteOn && newIndex === -1) {
                            return { focusedSuggestionIndex: -1 };
                        }
                        else if (isAutocompleteOn && state.focusedSuggestionIndex !== newIndex) {
                            return { focusedSuggestionIndex: newIndex };
                        }
                        return null;
                    });
                }
            }
            else if (this.state.fetchedData) {
                // Make sure that the focusedSuggestionIndex is valid based on the size of the list
                this._updateState((state, props) => {
                    const newIndex = Math.min(state.fetchedData.length - 1, state.focusedSuggestionIndex);
                    if (isAutocompleteOn && state.focusedSuggestionIndex !== newIndex) {
                        return { focusedSuggestionIndex: newIndex };
                    }
                    return null;
                });
            }
            // Don't update active descendant until we're done fetching
            const focusIndex = this._resolveFetchBusyState ? -1 : this.state.focusedSuggestionIndex;
            if (focusIndex >= 0 && this.state.labelIds.length > focusIndex) {
                // if the first suggestion is focused and we want to show autocomplete text, check whether
                // we should actually show it
                const filterText = this.state.filterText || '';
                if (focusIndex === 0 && this.state.showAutocompleteText && filterText.length > 0) {
                    const firstSuggestionText = this._suggestionsList?.getFormattedText(0);
                    const lowercaseFirstSuggestionText = firstSuggestionText.toLowerCase();
                    const lowercaseFilterText = filterText.toLowerCase();
                    // if the first suggestion text starts with the filter text, then show the autocomplete
                    // text; otherwise, show the first suggestion text floating adjacent to the filter text
                    // on desktop (but not on mobile because the user has no way to remove it to submit the
                    // text that they typed)
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
                        // don't show floating autocomplete text on mobile, so don't automatically focus
                        // the first suggestion either
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
                // JET-36771 - Exception on down arrow with no value
                // need to clear activeDescendantId when no suggestion focused
                this._updateState({ activeDescendantId: null });
            }
            // JET-37929 - inputSearch prevents enclosing oj-dialog to be closed with 'esc' key
            // if we're done fetching data and there are no results on desktop, automatically close the
            // dropdown so that we don't consume keyboard events for it unnecessarily
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
        // store old props in state so we can compare in getDerivedStateFromProps
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
        // Resolve any lingering timers and busy states
        this._resolveFetching();
        this._updateState({ initialRender: true });
    }
    /**
     * @ignore
     */
    focus() {
        // JET-38304 - Calling focus() on oj-input-search doesn't transfer focus
        // focus the input when the custom element is focused
        this._mainInputElem?.focus();
    }
    /**
     * @ignore
     */
    blur() {
        // JET-38304 - Calling focus() on oj-input-search doesn't transfer focus
        // blur the input when the custom element is blurred
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
        const isRtl = getReadingDirection() === 'rtl';
        let position = PositionUtils.normalizeHorizontalAlignment(defPosition, isRtl);
        // need to coerce to Jet and then JqUi in order for vertical offset to work
        position = PositionUtils.coerceToJet(position);
        position = PositionUtils.coerceToJqUi(position);
        // set the position.of again to be the element, because coerceToJet will change it to a
        // string selector, which can then result in an error being thrown from jqueryui
        // position.js getDimensions(elem) method if the element has been removed from the DOM
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
        const isRtl = getReadingDirection() === 'rtl';
        position = PositionUtils.normalizeHorizontalAlignment(position, isRtl);
        return position;
    }
    _getMobileDropdownStyle() {
        const dropdownStyle = {};
        const ww = Math.min(window.innerWidth, window.screen.availWidth);
        const hh = Math.min(window.innerHeight, window.screen.availHeight);
        // in an iframe on a phone, need to get the available height of the parent window to account
        // for browser URL bar and bottom toolbar
        // (this depends on device type, not device render mode, because the fix is not needed on
        // desktop in the cookbook phone portrait mode)
        const deviceType = getDeviceType();
        // window.parent is not supposed to be null/undefined, but checking that for safety;
        // in normal cases where the window doesn't have a logical parent, window.parent is supposed
        // to be set to the window itself;
        // when there is an iframe, like in the cookbook, the window.parent will actually be different
        // from the window
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
        // if the input part of the component is clipped in overflow, implicitly close the dropdown
        if (PositionUtils.isAligningPositionClipped(props)) {
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
        const inputType = 'search';
        const autocompleteFloatingElem = state.autocompleteFloatingText
            ? this._renderAutocompleteFloatingText(state.autocompleteFloatingText, displayValue)
            : null;
        const searchIcon = jsx("span", { class: iconClasses, role: "presentation", "aria-hidden": true });
        const textFieldContainer = state.fullScreenPopup
            ? this._renderMobileMainTextFieldContainer(props, state, searchIcon, inputClasses, ariaLabel, listboxId)
            : this._renderDesktopMainTextFieldContainer(props, state, searchIcon, displayValue, inputClasses, ariaLabel, listboxId, inputType, autocompleteFloatingElem);
        const dropdown = state.dropdownOpen
            ? this._renderDropdown(props, state, displayValue, inputClasses, ariaLabel, listboxId, inputType, autocompleteFloatingElem)
            : null;
        // JET-46099 - Accessibility: Need ability to read out the suggestion count for JAWS user
        // inform the user when no suggestions are returned
        const ariaLiveRegion = this._dataProvider ? this._renderAriaLiveRegion(state) : null;
        return (jsxs(Root, { id: id, ref: this._setRootElem, class: rootClasses, "aria-label": ariaLabel, onMouseDown: this._handleMousedown, onMouseEnter: this._handleMouseenter, onMouseLeave: this._handleMouseleave, children: [ariaLiveRegion, textFieldContainer, dropdown] }));
    }
    _renderAriaLiveRegion(state) {
        // JET-46099 - Accessibility: Need ability to read out the suggestion count for JAWS user
        // inform the user when no suggestions are returned
        // (render a &nbsp; ('\xa0') to clear the text so that the noSuggestionsFound text will be
        // read again when it is re-added)
        const text = state.fetchedInitial && !state.fetching && state.fetchedData?.length == 0
            ? getTranslatedString('oj-ojInputSearch2.noSuggestionsFound')
            : '\xa0'; // &nbsp;
        return (jsx("div", { id: 'oj-listbox-live-' + this._uniqueId, class: "oj-helper-hidden-accessible oj-listbox-liveregion", "aria-live": "polite", children: text }));
    }
    _renderDesktopMainTextFieldContainer(props, state, searchIcon, displayValue, inputClasses, ariaLabel, listboxId, inputType, autocompleteFloatingElem) {
        const containerClasses = 'oj-text-field-container oj-text-field-has-start-slot';
        return (jsxs("div", { role: "presentation", class: containerClasses, id: this._getMainInputContainerId(), ref: this._setMainInputContainerElem, children: [jsx("span", { class: "oj-text-field-start", children: searchIcon }), jsxs("div", { class: "oj-text-field-middle", 
                    // use undefined here instead of null so that in Safari on desktop, the role
                    // attribute is not written out at all instead of it being written out with
                    // no value
                    role: this._dataProvider ? 'combobox' : undefined, "aria-label": this._dataProvider ? ariaLabel : null, "aria-controls": listboxId, "aria-haspopup": this._dataProvider ? 'listbox' : undefined, "aria-expanded": this._dataProvider ? (state.dropdownOpen ? 'true' : 'false') : undefined, children: [jsx(ComposingInput, { type: inputType, inputRef: this._setMainInputElem, value: displayValue, class: inputClasses + ' oj-inputsearch-filter', placeholder: props.placeholder, autocomplete: "off", autocorrect: "off", autocapitalize: "off", spellcheck: false, autofocus: false, "aria-label": ariaLabel, "aria-autocomplete": this._dataProvider ? 'list' : null, "aria-busy": state.dropdownOpen && state.loading, "aria-activedescendant": this._dataProvider ? state.activeDescendantId : null, onfocusin: this._handleFocusin, onfocusout: this._handleFocusout, onInputChanged: this._handleInputChanged, onKeyDown: this._handleDesktopMainInputKeydown }), autocompleteFloatingElem] })] }));
    }
    _renderMobileMainTextFieldContainer(props, state, searchIcon, inputClasses, ariaLabel, listboxId) {
        const { placeholder, value } = props;
        const { dropdownOpen, loading } = state;
        const containerClasses = 'oj-text-field-container oj-text-field-has-start-slot';
        const mobileInputClasses = inputClasses +
            ' oj-inputsearch-input-displayonly ' +
            (value ? '' : ' oj-inputsearch-placeholder');
        return (jsxs("div", { role: "presentation", class: containerClasses, id: this._getMainInputContainerId(), children: [jsx("span", { class: "oj-text-field-start", children: searchIcon }), jsx("div", { class: "oj-text-field-middle", 
                    // use undefined here instead of null so that in Safari on desktop, the role
                    // attribute is not written out at all instead of it being written out with
                    // no value
                    role: this._dataProvider ? 'combobox' : undefined, "aria-label": this._dataProvider ? ariaLabel : null, "aria-controls": listboxId, "aria-haspopup": this._dataProvider ? 'listbox' : 'false', "aria-expanded": dropdownOpen ? 'true' : 'false', children: jsx("div", { 
                        // returning a display only div because of issues with screen readers in Android and iOS
                        // readonly inputs were inactive or confusing to readers JET-53280, JET-50081
                        ref: this._setMainInputElem, class: mobileInputClasses, "aria-label": ariaLabel, "aria-busy": dropdownOpen && loading, tabIndex: 0, onfocusin: this._handleFocusin, onfocusout: this._handleFocusout, children: jsx("div", { children: value || placeholder }) }) })] }));
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
        return (jsx("div", { class: classes, children: jsxs("div", { role: "presentation", class: containerClasses, id: this._getMobileFilterContainerId(), children: [jsx("span", { class: "oj-text-field-start", children: backIcon }), jsxs("div", { class: "oj-text-field-middle", "aria-label": ariaLabel, "aria-owns": listboxId, children: [jsx(ComposingInput, { type: inputType, inputRef: this._setMobileFilterInputElem, value: displayValue, class: inputClasses + ' oj-inputsearch-filter', placeholder: props.placeholder, autocomplete: "off", autocorrect: "off", autocapitalize: "off", spellcheck: false, autofocus: false, "aria-label": ariaLabel, "aria-autocomplete": "list", "aria-controls": listboxId, "aria-busy": state.loading, "aria-activedescendant": state.activeDescendantId, onfocusin: this._handleMobileFilterInputFocusin, onfocusout: this._handleMobileFilterInputFocusout, onInputChanged: this._handleInputChanged, onKeyDown: this._handleMobileFilterInputKeydown, onMouseDown: this._handleFilterInputMousedown }), autocompleteFloatingElem] }), jsx("span", { class: "oj-text-field-end", children: clearIcon })] }) }));
    }
    _renderMobileDropdownBackIcon() {
        const backIconClasses = 'oj-inputsearch-back-icon oj-inputsearch-icon oj-component-icon oj-clickable-icon-nocontext';
        // TODO: Should this come in through a translations prop?
        // TODO: Named this oj-ojInputSearch2 so as not to conflict with the old widget
        // oj-ojInputSearch, but should we change the old widget name so that we can call this
        // oj-ojInputSearch?
        const backButtonAriaLabel = getTranslatedString('oj-ojInputSearch2.cancel');
        return (jsx("span", { class: "oj-inputsearch-back-button", role: "button", "aria-label": backButtonAriaLabel, onClick: this._handleMobileDropdownBack, children: jsx("span", { class: backIconClasses }) }));
    }
    _renderMobileDropdownClearIcon() {
        const clearIconClasses = 'oj-inputsearch-clear-icon oj-inputsearch-icon oj-component-icon' +
            ' oj-clickable-icon-nocontext';
        return (jsx("span", { class: "oj-inputsearch-clear-button", "aria-hidden": true, onClick: this._handleMobileFilterClear, children: jsx("span", { class: clearIconClasses }) }));
    }
    _renderDropdown(props, state, displayValue, inputClasses, ariaLabel, listboxId, inputType, autocompleteFloatingElem) {
        const dropdownContent = state.loading
            ? this._renderDropdownSkeleton()
            : this._renderDropdownSuggestions(props, state);
        let dropdownClasses = 'oj-listbox-drop oj-listbox-inputsearch';
        // JET-35735 - dropdown initial focus stays when moving to different item
        // hide focus highlight when user is moving mouse and hide hover highlight when user is typing
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
        return (jsx(VPopup, { position: position, layerSelectors: "oj-listbox-drop-layer", autoDismiss: this._clickAwayHandler, children: jsxs("div", { "data-oj-binding-provider": "preact", id: this._getDropdownElemId(), ref: this._setDropdownElem, class: classes, role: "presentation", style: style, onMouseDown: mousedownHandler, onMouseMove: this._handleDropdownMousemove, onMouseLeave: this._handleDropdownMouseleave, children: [headerContent, content] }) }));
    }
    _renderAutocompleteFloatingText(autocompleteFloatingText, displayValue) {
        // Non-breakable space (&nbsp;) is char 0xa0 (160 dec)
        // Long dash (Em Dash) is \u2014
        const text = '\xa0\u2014\xa0' + autocompleteFloatingText;
        return (jsxs("div", { class: "oj-inputsearch-autocomplete-floating-container", children: [jsx("span", { style: "visibility: hidden;", children: displayValue }), jsx("span", { class: "oj-inputsearch-autocomplete-floating-text", children: text })] }));
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
        // JET-70319 - Legacy Select and Search - Debouncing
        // abort an ongoing fetch request because we are issuing a new one and would ignore any
        // results from the existing one
        if (this.state.fetching) {
            this._abortController?.abort(getAbortReason());
        }
        // Create a new AbortController for this fetch
        const abortController = new AbortController();
        this._abortController = abortController;
        let searchText = _searchText;
        if (searchText === '') {
            searchText = null;
        }
        const maxFetchCount = 12;
        let fetchParams = { size: maxFetchCount, signal: abortController.signal };
        if (searchText) {
            const filterCapability = this._dataProvider.getCapability('filter');
            if (!filterCapability || !filterCapability.textFilter) {
                error('InputSearch: DataProvider does not support text filter. ' +
                    'Filtering results in dropdown may not work correctly.');
            }
            // create filter using FilterFactory so that default local filtering will happen if
            // underlying DP doesn't support its own filtering
            fetchParams['filterCriterion'] = oj.FilterFactory.getFilter({
                filterDef: { text: searchText }
            });
        }
        this._updateState({ fetching: true });
        if (!this._loadingTimer) {
            const timer = getTimer(this._showIndicatorDelay);
            timer.getPromise().then(function (pending) {
                this._loadingTimer = null;
                if (pending && this._dataProvider && this.state.dropdownOpen) {
                    this._updateState({ loading: true });
                }
            }.bind(this));
            this._loadingTimer = timer;
        }
        let fetchedData = [];
        // only open one fetch busy state that we'll resolve when the last fetch returns
        if (!this._resolveFetchBusyState) {
            this._resolveFetchBusyState = this._addBusyState('InputSearch: fetching suggestions');
        }
        // TODO: handle hierarchical data?
        const asyncIterator = this._dataProvider.fetchFirst(fetchParams)[Symbol.asyncIterator]();
        // call next() repeatedly until done or until we've reached our fetch limit
        let remainingFetchCount = maxFetchCount;
        const processNextFunc = function (result) {
            // only process the results if they came from the last issued fetch, otherwise ignore them
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
                // generate ids that are static to this data fetch but won't change across re-renders
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
        asyncIterator
            .next()
            .then(processNextFunc)
            .catch((error) => {
            // JET-70319 - Legacy Select and Search - Debouncing
            // If it is an abort error because of a new fetch, simply ignore it.
            if (error instanceof DOMException && error.name === 'AbortError')
                return;
            // Otherwise rethrow the error
            throw error;
        });
    }
    _renderDropdownSkeleton() {
        let numItems = 1;
        let resultsWidth = 0;
        if (this._dropdownElem) {
            // render the same number of skeleton items as there were existing items in the dropdown, in
            // case the dropdown was already open so that the height doesn't change due to the skeleton
            const items = this._dropdownElem.querySelectorAll('.oj-listbox-result');
            numItems = Math.max(1, items.length);
            // try to preserve previous width so that the dropdown doesn't shrink while showing the
            // skeleton if the suggestions are wider than the input field
            if (items.length > 0) {
                const resultsContainer = this._dropdownElem.querySelector('.oj-listbox-results');
                resultsWidth = resultsContainer.offsetWidth;
            }
        }
        const resultStyle = resultsWidth > 0 ? { width: resultsWidth + 'px' } : null;
        return (jsx(InputSearchSkeletonList, { id: this._getListboxId(), numItems: numItems, itemStyle: resultStyle }));
    }
    _renderDropdownSuggestions(props, state) {
        if (state.fetchedData?.length > 0) {
            return (jsx(InputSearchSuggestionsList, { "aria-label": props['aria-label'], ref: this._setSuggestionsList, data: state.fetchedData, searchText: state.filterText, focusIndex: state.focusedSuggestionIndex, formatItemText: InputSearch_1._formatItemText, id: this._getListboxId(), labelIds: state.labelIds, onOjSuggestionAction: this._handleSuggestionAction, suggestionItemText: props.suggestionItemText, suggestionItemTemplate: props.suggestionItemTemplate }));
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
            // make sure data provider is an instance of *DataProviderView, and wrap it with one if it
            // isn't, so that we can use the FilterFactory to create filter criterion and have the DP
            // do local filtering if needed
            if (!(wrapper instanceof oj.ListDataProviderView)) {
                wrapper = new oj.ListDataProviderView(wrapper);
            }
            // JET-70319 - Legacy Select and Search - Debouncing
            // If the DP is capable of returning fetches immediately, simply use the enhanced DP.
            // Otherwise wrap the enhanced DP in a debouncing wrapper to help reduce the number of
            // remote fetch requests that are actually made as the user types.
            const filterCapability = wrapper.getCapability('fetchFirst');
            const isImmediate = filterCapability?.iterationSpeed === 'immediate';
            wrapper = isImmediate ? wrapper : new DebouncingDataProviderView(wrapper);
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
                    error(`oj-input-search: No '${suggestionItemText}' property found in DataProvider with key: ${suggestionItemContext?.key}`);
                }
                formatted = suggestionItemContext.data[suggestionItemText];
            }
            else {
                formatted = suggestionItemText(suggestionItemContext);
            }
        }
        return formatted || '';
    }
    // Private methods used by WebElement test adapter
    /**
     * @ojmetadata visible false
     */
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
    /**
     * @ojmetadata visible false
     */
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
InputSearch.defaultProps = {
    autocomplete: 'on',
    suggestions: null,
    suggestionItemText: 'label',
    placeholder: '',
    value: null
};
InputSearch._metadata = { "properties": { "suggestions": { "type": "object" }, "suggestionItemText": { "type": "string|number|function" }, "placeholder": { "type": "string" }, "rawValue": { "type": "string", "readOnly": true, "writeback": true }, "value": { "type": "string", "writeback": true }, "autocomplete": { "type": "string", "enumValues": ["off", "on"] } }, "events": { "ojValueAction": {} }, "slots": { "suggestionItemTemplate": { "data": {} } }, "extension": { "_WRITEBACK_PROPS": ["rawValue", "value"], "_READ_ONLY_PROPS": ["rawValue"], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "id"] }, "methods": { "focus": {}, "blur": {}, "_testChangeValue": {}, "_testChangeValueByKey": {} } };
InputSearch = InputSearch_1 = __decorate([
    customElement('oj-input-search')
], InputSearch);

export { InputSearch };
