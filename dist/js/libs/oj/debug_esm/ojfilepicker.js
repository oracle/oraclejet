/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx } from 'preact/jsx-runtime';
import oj from 'ojs/ojcore-base';
import { recentPointer } from 'ojs/ojdomutils';
import { Root, customElement } from 'ojs/ojvcomponent';
import { Component, createRef } from 'preact';
import { getTranslatedString } from 'ojs/ojtranslation';
import { pickFiles } from 'ojs/ojfilepickerutils';
import FocusUtils from 'ojs/ojfocusutils';
import 'jqueryui-amd/tabbable';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * @classdesc
 * <h3 id="filePickerOverview-section">
 *   JET FilePicker
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#filePickerOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>By default the file picker shows a clickable dropzone for selecting files for upload. However, it can be replaced with any clickable element like a button. After the files are selected, the FilePicker fires a "select" event with the selected files. Application has to specify the listener in order to do the actual upload.  The types of files accepted are controlled by the accept attribute.  Additional custom validation can be done through the ojBeforeSelect event.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-file-picker on-oj-select='[[listener]]' accept='["image/*", "video/*"]'>
 * &lt;/oj-file-picker>
 * </code>
 * </pre>
 *
 * <h3 id="migration-section">
 *  Migration
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 * </h3>
 * To migrate from oj-file-picker to oj-c-file-picker, you need to revise the import statement and references to oj-file-picker in your app. Please note the changes between the two components below.
 * <h5>Role attribute</h5>
 * <p>If aria-label is set on the component, the role attribute will be set internally.  The application should no longer populate the role attribute.</p>
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
 *       <td>Clickable element</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Launch the browser's file picker.</td>
 *     </tr>
 *   </tbody>
 * </table>
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
 *       <td>Clickable element</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Launch the browser's file picker.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojmetadata description "A file picker displays a clickable dropzone for selecting files from the device storage."
 * @ojmetadata displayName "File Picker"
 * @ojmetadata ojLegacyVComponent "ojFilePicker"
 * @ojmetadata main "ojs/ojfilepicker"
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "15.0.0",
 *     "value": ["oj-c-file-picker"]
 *   }
 * ]
 * @ojmetadata extension {
 *   "vbdt": {
 *     "module": "ojs/ojfilepicker",
 *     "styleClasses": [
 *       {
 *         "styleGroup": [
 *           "oj-filepicker-custom"
 *         ],
 *         "description": "Apply to a custom file picker if the entire dropzone is replaced with another clickable element like button or menu item."
 *       },
 *       {
 *         "styleGroup": [
 *           "oj-filepicker-dropzone"
 *         ],
 *         "description": "Apply to the dropzone of the file picker."
 *       },
 *       {
 *         "styleGroup": [
 *           "oj-filepicker-text"
 *         ],
 *         "description": "Apply to the dropzone text of the file picker."
 *       }
 *     ],
 *     "defaultColumns": "6",
 *     "minColumns": "2"
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-attach-file",
 *     "uxSpecs": [
 *       "file-picker"
 *     ]
 *   }
 * }
 * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojFilePicker.html"
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "accept",
 *       "selectOn",
 *       "selectionMode",
 *       "disabled",
 *       "primaryText",
 *       "secondaryText"
 *     ]
 *   }
 * ]
 * @ojmetadata since "4.0.0"
 * @ojmetadata styleClasses [
 *   {
 *     "name": "oj-filepicker-custom",
 *     "kind": "class",
 *     "displayName": "Custom",
 *     "description": "Apply to a custom file picker if the entire dropzone is replaced with another clickable element like button or menu item.\nNote that the oj-filepicker-custom class doesn't have to be specified in order to change the dropzone text.",
 *     "status": [
 *       {
 *         "type": "deprecated",
 *         "since": "9.0.0",
 *         "description": "oj-filepicker-custom class has been deprecated. Class is no longer needed."
 *       }
 *     ],
 *     "help": "#oj-filepicker-custom"
 *   },
 *   {
 *     "name": "oj-filepicker-dropzone",
 *     "kind": "class",
 *     "displayName": "File Picker DropZone",
 *     "description": "Apply to the dropzone of the file picker.",
 *     "status": [
 *       {
 *         "type": "deprecated",
 *         "since": "9.0.0",
 *         "description": "oj-filepicker-dropzone class has been deprecated. Class is no longer needed."
 *       }
 *     ],
 *     "help": "#oj-filepicker-dropzone"
 *   },
 *   {
 *     "name": "oj-filepicker-text",
 *     "kind": "class",
 *     "displayName": "File Picker Text",
 *     "description": "Apply to the dropzone text of the file picker.",
 *     "status": [
 *       {
 *         "type": "deprecated",
 *         "since": "9.0.0",
 *         "description": "oj-filepicker-text class has been deprecated. Class is no longer needed."
 *       }
 *     ],
 *     "help": "#oj-filepicker-text"
 *   }
 * ]
 * @ojmetadata styleVariableSet {"name": "oj-file-picker-css-set1",
 *                                "styleVariables": [
 *                                  {
 *                                    "name": "oj-file-picker-border-color",
 *                                    "description": "File picker border color",
 *                                    "formats": ["color"],
 *                                    "help": "#css-variables"
 *                                  },
 *                                  {
 *                                    "name": "oj-file-picker-border-width",
 *                                    "description": "File picker border width",
 *                                    "formats": ["length"],
 *                                    "help": "#css-variables"
 *                                  },
 *                                  {
 *                                    "name": "oj-file-picker-border-radius",
 *                                    "description": "File picker border radius",
 *                                    "formats": ["length","percentage"],
 *                                    "help": "#css-variables"
 *                                  }
 *                                ]
 *                              }
 */
let FilePicker = class FilePicker extends Component {
    constructor(props) {
        super(props);
        this.rootRef = createRef();
        this._handleSelectingFiles = (event) => {
            //  - within firefox browser cannot tab past filepicker without file selector
            // window opening
            // only launching the file picker if click or 'Enter' was pressed
            if (event.type === 'click' ||
                (event.type === 'keypress' && event.code === 'Enter')) {
                this.selecting = true;
                //  - form submit event is triggered when the file upload button is clicked
                event.preventDefault();
                //  - unable to upload after clearing file progress list in demo
                // reset input value so file selection event will fire when selecting the same file
                const props = this.props;
                pickFiles(this._handleFileSelected, {
                    accept: props.accept,
                    selectionMode: props.selectionMode,
                    capture: props.capture ?? 'none'
                });
                return true;
            }
            return false;
        };
        this._handleFileSelected = (files) => {
            // if user cancelled out the file picker dialog, don't add files to upload queue
            this._fileSelectedHelper(files);
        };
        this._handleDragEnter = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        this._handleDragOver = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const dataTransfer = event.dataTransfer;
            if (this.inDropZone) {
                return;
            }
            // NOTE: dragged files not available
            // event.dataTransfer.files = null (firefox)
            // event.dataTransfer.files.length = 0 (chrome, IE, Edge and Safari)
            // use dataTransfer.items.type instead (works in chrome, firefox and Edge)
            // event.dataTransfer.items = undefined (not work in IE and safari, just don't display ghost buster)
            //  - drag and drop to ojfilepicker fails on safari
            const ai = oj.AgentUtils.getAgentInfo();
            this.inDropZone = true;
            this.isDroppable = true;
            if (ai.browser !== oj.AgentUtils.BROWSER.SAFARI && ai.browser !== oj.AgentUtils.BROWSER.IE) {
                const files = dataTransfer.items;
                let messages = [];
                const selectionModeValid = this._validateSelectionMode(files);
                const droppable = this._validateTypes(files);
                if (selectionModeValid && droppable.rejected.length === 0) {
                    // validation passes
                    this.setState({ validity: 'valid' });
                }
                else {
                    this.isDroppable = false;
                    if (selectionModeValid) {
                        // mimetype Validation fails
                        messages = this._getMimeTypeValidationMessages(droppable.rejected);
                    }
                    else {
                        // selected multiple files in single selection mode
                        messages.push({
                            severity: 'error',
                            summary: getTranslatedString('oj-ojFilePicker.singleFileUploadError')
                        });
                    }
                    this._fireInvalidSelectAction(messages, event, true);
                }
            }
            else {
                this.setState({ validity: 'valid' });
            }
        };
        this._handleDragLeave = (event, mimeTypeDropFail = false) => {
            if (!this.inDropZone) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            if (!this.rootRef.current.contains(event.relatedTarget)) {
                this.inDropZone = false;
                this.setState({ validity: 'NA' });
                // There's only a promise if validation failed on dragover
                if (!this.isDroppable && !mimeTypeDropFail) {
                    this.dragPromiseResolver();
                    this.dragPromiseResolver = null;
                }
            }
        };
        this._handleFileDrop = (event) => {
            if (this.inDropZone) {
                event.preventDefault();
                event.stopPropagation();
                const files = this._createFileList(event.dataTransfer.files);
                let mimeTypeDropFail = false;
                if (this.isDroppable) {
                    let messages = [];
                    if (this._validateSelectionMode(files)) {
                        const droppable = this._validateTypes(files);
                        if (droppable.rejected.length > 0) {
                            // mimetype Validation fails
                            messages = this._getMimeTypeValidationMessages(droppable.rejected);
                            mimeTypeDropFail = true;
                        }
                    }
                    else {
                        messages.push({
                            severity: 'error',
                            summary: getTranslatedString('oj-ojFilePicker.singleFileUploadError')
                        });
                    }
                    if (messages.length > 0) {
                        this.isDroppable = false;
                        this._fireInvalidSelectAction(messages, event, false);
                    }
                    if (this.isDroppable) {
                        this._handleFilesAdded(files, event);
                    }
                }
                this._handleDragLeave(event, mimeTypeDropFail);
            }
        };
        this._handleFocusIn = (event) => {
            if (event.target === event.currentTarget) {
                this._handleFocus(event);
            }
            if (this.selecting) {
                return;
            }
            this.setState({ focus: !recentPointer() });
        };
        this._handleFocusOut = (event) => {
            if (event.target === event.currentTarget) {
                this._handleBlur(event);
            }
            if (this.selecting) {
                return;
            }
            this.setState({ focus: false });
        };
        /**
         * Invoked when focus is triggered on this.element
         */
        this._handleFocus = (event) => {
            this.rootRef.current?.dispatchEvent(new FocusEvent('focus', { relatedTarget: event.relatedTarget }));
        };
        /**
         * Invoked when blur is triggered on this.element
         */
        this._handleBlur = (event) => {
            this.rootRef.current?.dispatchEvent(new FocusEvent('blur', { relatedTarget: event.relatedTarget }));
        };
        this.state = {
            focus: false,
            validity: 'NA'
        };
    }
    _fileSelectedHelper(files) {
        if (files.length > 0) {
            const rejected = this._validateTypes(files).rejected;
            if (rejected.length > 0) {
                this._fireInvalidSelectAction(this._getMimeTypeValidationMessages(rejected), null, false);
            }
            else {
                this._handleFilesAdded(files, null);
            }
        }
        this.selecting = false;
    }
    /**
     * @ignore
     */
    focus() {
        FocusUtils.focusFirstTabStop(this.rootRef.current);
    }
    /**
     * @ignore
     */
    blur() {
        const focusElement = document.activeElement;
        if (this.rootRef.current.contains(focusElement)) {
            focusElement.blur();
        }
    }
    render(props) {
        const triggerSlot = props.trigger;
        if (props.disabled) {
            return this._renderDisabled(props, triggerSlot);
        }
        const clickHandler = props.selectOn !== 'drop' ? this._handleSelectingFiles : undefined;
        return triggerSlot
            ? this._renderWithCustomTrigger(props, triggerSlot, clickHandler)
            : this._renderWithDefaultTrigger(props, clickHandler);
    }
    _renderDisabled(props, triggerSlot) {
        const rootClasses = triggerSlot ? 'oj-filepicker' : 'oj-filepicker oj-filepicker-no-trigger';
        return (jsx(Root, { class: rootClasses, children: jsx("div", { class: "oj-filepicker-disabled oj-filepicker-container", children: triggerSlot || this._renderDefaultTriggerContent(props) }) }));
    }
    _renderWithCustomTrigger(props, triggerSlot, clickHandler) {
        const dndHandlers = this._getDndHandlers(props);
        return (jsx(Root, { class: `oj-filepicker ${this._getFocusClass()}`, ref: this.rootRef, onfocusin: this._handleFocusIn, onfocusout: this._handleFocusOut, children: jsx("div", { onClick: clickHandler, onKeyPress: this._handleSelectingFiles, onDragEnter: dndHandlers.handleDragEnter, onDragOver: dndHandlers.handleDragOver, onDragLeave: dndHandlers.handleDragLeave, onDragEnd: dndHandlers.handleDragLeave, onDrop: dndHandlers.handleFileDrop, class: "oj-filepicker-container", "aria-label": this._getAriaLabel(props, clickHandler), role: this._getRole(props, clickHandler), children: triggerSlot }) }));
    }
    _renderWithDefaultTrigger(props, clickHandler) {
        const validity = this.state.validity;
        const validityState = validity === 'valid' ? 'oj-valid-drop' : validity === 'invalid' ? 'oj-invalid-drop' : '';
        const dndHandlers = this._getDndHandlers(props);
        return (jsx(Root, { class: `oj-filepicker oj-filepicker-no-trigger ${this._getFocusClass()}`, onfocusin: this._handleFocusIn, onfocusout: this._handleFocusOut, ref: this.rootRef, children: jsx("div", { onClick: clickHandler, onKeyPress: this._handleSelectingFiles, class: 'oj-filepicker-container', tabIndex: 0, "aria-label": this._getAriaLabel(props, clickHandler), role: this._getRole(props, clickHandler), children: jsx("div", { class: `oj-filepicker-dropzone ${validityState}`, onDragEnter: dndHandlers.handleDragEnter, onDragOver: dndHandlers.handleDragOver, onDragLeave: dndHandlers.handleDragLeave, onDragEnd: dndHandlers.handleDragLeave, onDrop: dndHandlers.handleFileDrop, children: this._renderDefaultTriggerContent(props) }) }) }));
    }
    _renderDefaultTriggerContent(props) {
        return [
            jsx("div", { class: "oj-filepicker-text", children: this._getPrimaryText(props) }),
            jsx("div", { class: "oj-filepicker-secondary-text", children: this._getSecondaryText(props) })
        ];
    }
    _getRole(props, clickHandler) {
        const defaultRole = clickHandler ? 'button' : undefined;
        return props['role'] ? props['role'] : defaultRole;
    }
    _getAriaLabel(props, clickHandler) {
        const defaultLabel = clickHandler
            ? props.trigger
                ? 'Add Files.'
                : `Add Files. ${this._getPrimaryText(props)}. ${this._getSecondaryText(props)}`
            : undefined;
        return props['aria-label'] ? props['aria-label'] : defaultLabel;
    }
    _getPrimaryText(props) {
        const primary = props.primaryText;
        let primaryText;
        if (primary) {
            if (typeof primary === 'string') {
                primaryText = primary;
            }
            else {
                const primaryFunc = primary;
                primaryText = primaryFunc();
            }
        }
        else {
            primaryText = getTranslatedString('oj-ojFilePicker.dropzonePrimaryText');
        }
        return primaryText;
    }
    _getSecondaryText(props) {
        const isSingle = props.selectionMode === 'single';
        const secondary = props.secondaryText;
        let secondaryText;
        if (secondary) {
            if (typeof secondary === 'string') {
                secondaryText = secondary;
            }
            else {
                const secondaryFunc = secondary;
                secondaryText = secondaryFunc({ selectionMode: props.selectionMode });
            }
        }
        else {
            secondaryText = getTranslatedString(isSingle
                ? 'oj-ojFilePicker.secondaryDropzoneText'
                : 'oj-ojFilePicker.secondaryDropzoneTextMultiple');
        }
        return secondaryText;
    }
    _getDndHandlers(props) {
        return props.selectOn !== 'click'
            ? {
                handleDragEnter: this._handleDragEnter,
                handleDragOver: this._handleDragOver,
                handleDragLeave: this._handleDragLeave,
                handleFileDrop: this._handleFileDrop
            }
            : {};
    }
    _getFocusClass() {
        return this.state.focus ? 'oj-focus-highlight' : '';
    }
    _validateSelectionMode(files) {
        // False if selected multiple files when in single file selection mode
        return this.props.selectionMode !== 'single' || files.length === 1;
    }
    _validateTypes(files) {
        const accepted = [];
        const rejected = [];
        let file;
        let type;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                file = files[i];
                const name = file.name;
                type = getTranslatedString('oj-ojFilePicker.unknownFileType');
                if (name) {
                    let nameSplit = name.split('.');
                    type = nameSplit.length > 1 ? '.' + nameSplit.pop() : type;
                }
                type = file.type ? file.type : type;
                // If type isn't already in one of the lists, add it
                if (accepted.indexOf(type) === -1 && rejected.indexOf(type) === -1) {
                    if (this._acceptFile(file)) {
                        accepted.push(type);
                    }
                    else {
                        rejected.push(type);
                    }
                }
            }
        }
        return { accepted, rejected };
    }
    _getMimeTypeValidationMessages(rejected) {
        const messages = [];
        if (rejected.length === 1) {
            messages.push({
                severity: 'error',
                summary: getTranslatedString('oj-ojFilePicker.singleFileTypeUploadError', {
                    fileType: rejected[0]
                })
            });
        }
        else {
            messages.push({
                severity: 'error',
                summary: getTranslatedString('oj-ojFilePicker.multipleFileTypeUploadError', {
                    fileTypes: rejected.join(getTranslatedString('oj-converter.plural-separator'))
                })
            });
        }
        return messages;
    }
    _acceptFile(file) {
        const acceptProp = this.props.accept;
        if (!acceptProp || acceptProp.length === 0 || !file) {
            return true;
        }
        let accept;
        for (let i = 0; i < acceptProp.length; i++) {
            accept = oj.StringUtils.trim(acceptProp[i]);
            if (!accept) {
                return true;
            }
            else if (accept.startsWith('.', 0)) {
                // when dragover, only MIME type is available, file name is undefined
                // to lowerCase is to make the string comparison case insensitive
                if (!file.name || (file.name && file.name.toLowerCase().endsWith(accept.toLowerCase()))) {
                    return true;
                }
            }
            else if (!file.type) {
                return false;
            }
            else if (accept === 'image/*') {
                if (file.type.startsWith('image/', 0)) {
                    return true;
                }
            }
            else if (accept === 'video/*') {
                if (file.type.startsWith('video/', 0)) {
                    return true;
                }
            }
            else if (accept === 'audio/*') {
                if (file.type.startsWith('audio/', 0)) {
                    return true;
                }
            }
            else if (file.type === accept) {
                return true;
            }
        }
        return false;
    }
    _handleFilesAdded(files, oEvent) {
        //  - filepicker: filelist cleared after the handler returns
        // Note: the parameter "files" is a direct reference to the embedded Input element's property
        // which could be reset or changed.
        // we need to return a copy of FileList just in case apps hold on to a reference to FileList
        const list = this._createFileList(files);
        this.props.onOjBeforeSelect?.({ files: list, originalEvent: oEvent }).then(() => {
            // if there are no invalid files
            this.props.onOjSelect?.({
                files: list,
                originalEvent: oEvent
            });
            if (this.elementPromiseResolver) {
                this.elementPromiseResolver();
                this.elementPromiseResolver = null;
            }
        }, (messages) => {
            this._fireInvalidSelectAction(messages, oEvent, false);
        });
    }
    _fireInvalidSelectAction(messages, oEvent, isDrag) {
        if (isDrag) {
            this.setState({ validity: 'invalid' });
        }
        const dragPromise = isDrag
            ? new Promise((resolve) => {
                this.dragPromiseResolver = resolve;
            })
            : null;
        this.props.onOjInvalidSelect?.({
            messages,
            originalEvent: oEvent,
            until: dragPromise
        });
        if (this.elementPromiseResolver) {
            this.elementPromiseResolver();
            this.elementPromiseResolver = null;
        }
    }
    _createFileList(origList) {
        const descriptor = {
            length: { value: origList.length },
            item: {
                value(index) {
                    return this[index];
                }
            }
        };
        for (let i = 0; i < origList.length; i++) {
            descriptor[i] = { value: origList[i], enumerable: true };
        }
        return Object.create(FileList.prototype, descriptor);
    }
};
FilePicker.defaultProps = {
    accept: null,
    capture: 'none',
    disabled: false,
    selectOn: 'auto',
    selectionMode: 'multiple'
};
FilePicker._metadata = { "properties": { "accept": { "type": "Array<string>" }, "capture": { "type": "string", "enumValues": ["none", "environment", "user", "implementation"] }, "disabled": { "type": "boolean" }, "primaryText": { "type": "string|function" }, "secondaryText": { "type": "string|function" }, "selectOn": { "type": "string", "enumValues": ["auto", "click", "drop", "clickAndDrop"] }, "selectionMode": { "type": "string", "enumValues": ["multiple", "single"] } }, "slots": { "trigger": {} }, "events": { "ojBeforeSelect": { "cancelable": true }, "ojInvalidSelect": {}, "ojSelect": {} }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-label", "role"] }, "methods": { "focus": {}, "blur": {} } };
FilePicker = __decorate([
    customElement('oj-file-picker')
], FilePicker);

export { FilePicker };
