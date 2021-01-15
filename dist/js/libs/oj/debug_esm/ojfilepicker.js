/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { recentPointer } from 'ojs/ojdomutils';
import { ElementVComponent, h, listener, customElement } from 'ojs/ojvcomponent-element';
import { getTranslatedString } from 'ojs/ojtranslation';
import { pickFiles } from 'ojs/ojfilepickerutils';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class Props {
    constructor() {
        this.accept = null;
        this.capture = 'none';
        this.disabled = false;
        this.selectOn = 'auto';
        this.selectionMode = 'multiple';
    }
}
let FilePicker = class FilePicker extends ElementVComponent {
    constructor(props) {
        super(props);
        this.inDropZone = false;
        this.isDroppable = false;
        this.selecting = false;
        this.state = {
            focus: false,
            validity: 'NA'
        };
        this.rootElemRef = (element) => {
            this.rootElem = element;
        };
    }
    _doSelectHelper(filelist) {
        var promise = new Promise((resolve) => {
            this.elementPromiseResolver = resolve;
        });
        this._fileSelectedHelper(filelist);
        return promise;
    }
    _handleSelectingFiles(event) {
        var _a;
        if (event.type === 'click' ||
            (event.type === 'keypress' && event.keyCode === 13)) {
            this.selecting = true;
            event.preventDefault();
            const props = this.props;
            pickFiles(this._handleFileSelected, {
                accept: props.accept,
                selectionMode: props.selectionMode,
                capture: (_a = props.capture) !== null && _a !== void 0 ? _a : 'none'
            });
            return true;
        }
        return false;
    }
    _handleFileSelected(files) {
        this._fileSelectedHelper(files);
    }
    _fileSelectedHelper(files) {
        if (files.length > 0) {
            var rejected = this._validateTypes(files).rejected;
            if (rejected.length > 0) {
                this._fireInvalidSelectAction(this._getMimeTypeValidationMessages(rejected), event, false);
            }
            else {
                this._handleFilesAdded(files, event);
            }
        }
        this.selecting = false;
    }
    _handleDragEnter(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    _handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        var dataTransfer = event.dataTransfer;
        if (this.inDropZone) {
            return;
        }
        var ai = oj.AgentUtils.getAgentInfo();
        this.inDropZone = true;
        this.isDroppable = true;
        if (ai.browser !== oj.AgentUtils.BROWSER.SAFARI && ai.browser !== oj.AgentUtils.BROWSER.IE) {
            var files = dataTransfer.items;
            var messages = [];
            var selectionModeValid = this._validateSelectionMode(files);
            var droppable = this._validateTypes(files);
            if (selectionModeValid && droppable.rejected.length === 0) {
                this.updateState({ validity: 'valid' });
            }
            else {
                this.isDroppable = false;
                if (selectionModeValid) {
                    messages = this._getMimeTypeValidationMessages(droppable.rejected);
                }
                else {
                    messages.push({
                        severity: 'error',
                        summary: getTranslatedString('oj-ojFilePicker.singleFileUploadError')
                    });
                }
                this._fireInvalidSelectAction(messages, event, true);
            }
        }
        else {
            this.updateState({ validity: 'valid' });
        }
    }
    _handleDragLeave(event, mimeTypeDropFail) {
        if (!this.inDropZone) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (!this.rootElem.contains(event.relatedTarget)) {
            this.inDropZone = false;
            this.updateState({ validity: 'NA' });
            if (!this.isDroppable && !mimeTypeDropFail) {
                this.dragPromiseResolver();
                this.dragPromiseResolver = null;
            }
        }
    }
    _handleFileDrop(event) {
        if (this.inDropZone) {
            event.preventDefault();
            event.stopPropagation();
            var files = this._createFileList(event.dataTransfer.files);
            var mimeTypeDropFail = false;
            if (this.isDroppable) {
                var messages = [];
                if (this._validateSelectionMode(files)) {
                    var droppable = this._validateTypes(files);
                    if (droppable.rejected.length > 0) {
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
    }
    _handleFocusIn() {
        if (this.selecting) {
            return;
        }
        this.updateState({ focus: !recentPointer() });
    }
    _handleFocusOut() {
        if (this.selecting) {
            return;
        }
        this.updateState({ focus: false });
    }
    render() {
        const props = this.props;
        const triggerSlot = this.props.trigger;
        if (props.disabled) {
            return this._renderDisabled(props, triggerSlot);
        }
        const clickHandler = props.selectOn != 'drop' ? this._handleSelectingFiles : undefined;
        return triggerSlot
            ? this._renderWithCustomTrigger(props, triggerSlot, clickHandler)
            : this._renderWithDefaultTrigger(props, clickHandler);
    }
    _renderDisabled(props, triggerSlot) {
        const rootClasses = triggerSlot ? 'oj-filepicker' : 'oj-filepicker oj-filepicker-no-trigger';
        return (h("oj-file-picker", { class: rootClasses },
            h("div", { class: 'oj-filepicker-disabled oj-filepicker-container' }, triggerSlot || this._renderDefaultTriggerContent(props))));
    }
    _renderWithCustomTrigger(props, triggerSlot, clickHandler) {
        const dndHandlers = this._getDndHandlers(props);
        return (h("oj-file-picker", { class: 'oj-filepicker' + this._getFocusClass(), ref: this.rootElemRef, onFocusin: this._handleFocusIn, onFocusout: this._handleFocusOut },
            h("div", { onClick: clickHandler, onKeypress: this._handleSelectingFiles, onDragenter: dndHandlers.handleDragEnter, onDragover: dndHandlers.handleDragOver, onDragleave: dndHandlers.handleDragLeave, onDragend: dndHandlers.handleDragLeave, onDrop: dndHandlers.handleFileDrop, class: 'oj-filepicker-container' }, triggerSlot)));
    }
    _renderWithDefaultTrigger(props, clickHandler) {
        const validity = this.state.validity;
        const validityState = validity === 'valid' ? ' oj-valid-drop' : validity === 'invalid' ? ' oj-invalid-drop' : '';
        const dndHandlers = this._getDndHandlers(props);
        return (h("oj-file-picker", { class: 'oj-filepicker oj-filepicker-no-trigger', ref: this.rootElemRef },
            h("div", { onClick: clickHandler, onKeypress: this._handleSelectingFiles, class: 'oj-filepicker-container' },
                h("div", { tabindex: '0', class: 'oj-filepicker-dropzone' + validityState + this._getFocusClass(), onDragenter: dndHandlers.handleDragEnter, onDragover: dndHandlers.handleDragOver, onDragleave: dndHandlers.handleDragLeave, onDragend: dndHandlers.handleDragLeave, onDrop: dndHandlers.handleFileDrop, onFocusin: this._handleFocusIn, onFocusout: this._handleFocusOut }, this._renderDefaultTriggerContent(props)))));
    }
    _renderDefaultTriggerContent(props) {
        const isSingle = props.selectionMode == 'single';
        const primary = props.primaryText;
        let primaryText;
        if (primary) {
            if (typeof primary === 'string') {
                primaryText = primary;
            }
            else {
                let primaryFunc = primary;
                primaryText = primaryFunc();
            }
        }
        else {
            primaryText = getTranslatedString('oj-ojFilePicker.dropzonePrimaryText');
        }
        const secondary = props.secondaryText;
        let secondaryText;
        if (secondary) {
            if (typeof secondary === 'string') {
                secondaryText = secondary;
            }
            else {
                let secondaryFunc = secondary;
                secondaryText = secondaryFunc({ selectionMode: props.selectionMode });
            }
        }
        else {
            secondaryText = getTranslatedString(isSingle
                ? 'oj-ojFilePicker.secondaryDropzoneText'
                : 'oj-ojFilePicker.secondaryDropzoneTextMultiple');
        }
        return [
            h("div", null,
                h("div", { class: 'oj-filepicker-text' }, primaryText),
                h("div", { class: 'oj-filepicker-secondary-text' }, secondaryText)),
            h("div", { class: 'oj-filepicker-icon oj-fwk-icon-plus oj-fwk-icon' })
        ];
    }
    _getDndHandlers(props) {
        return props.selectOn != 'click'
            ? {
                handleDragEnter: this._handleDragEnter,
                handleDragOver: this._handleDragOver,
                handleDragLeave: this._handleDragLeave,
                handleFileDrop: this._handleFileDrop
            }
            : {};
    }
    _getFocusClass() {
        return this.state.focus ? ' oj-focus-highlight' : '';
    }
    _validateSelectionMode(files) {
        return this.props.selectionMode !== 'single' || files.length === 1;
    }
    _validateTypes(files) {
        var accepted = [];
        var rejected = [];
        var file;
        var type;
        if (files) {
            for (var i = 0; i < files.length; i++) {
                file = files[i];
                var name = file.name;
                type = getTranslatedString('oj-ojFilePicker.unknownFileType');
                if (name) {
                    var nameSplit = name.split('.');
                    type = nameSplit.length > 1 ? '.' + nameSplit.pop() : type;
                }
                type = file.type ? file.type : type;
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
        return { accepted: accepted, rejected: rejected };
    }
    _getMimeTypeValidationMessages(rejected) {
        var messages = [];
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
        var acceptProp = this.props.accept;
        if (!acceptProp || acceptProp.length === 0 || !file) {
            return true;
        }
        var accept;
        for (var i = 0; i < acceptProp.length; i++) {
            accept = oj.StringUtils.trim(acceptProp[i]);
            if (!accept) {
                return true;
            }
            else if (accept.startsWith('.', 0)) {
                if (!file.name || (file.name && file.name.endsWith(accept))) {
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
        var _a, _b;
        var list = this._createFileList(files);
        (_b = (_a = this.props).onOjBeforeSelect) === null || _b === void 0 ? void 0 : _b.call(_a, { files: list, originalEvent: oEvent }).then(() => {
            var _a, _b;
            (_b = (_a = this.props).onOjSelect) === null || _b === void 0 ? void 0 : _b.call(_a, {
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
        var _a, _b;
        if (isDrag) {
            this.updateState({ validity: 'invalid' });
        }
        var dragPromise = isDrag
            ? new Promise((resolve) => {
                this.dragPromiseResolver = resolve;
            })
            : null;
        (_b = (_a = this.props).onOjInvalidSelect) === null || _b === void 0 ? void 0 : _b.call(_a, {
            messages: messages,
            originalEvent: oEvent,
            until: dragPromise
        });
        if (this.elementPromiseResolver) {
            this.elementPromiseResolver();
            this.elementPromiseResolver = null;
        }
    }
    _createFileList(origList) {
        var descriptor = {
            length: { value: origList.length },
            item: {
                value: function (index) {
                    return this[index];
                }
            }
        };
        for (var i = 0; i < origList.length; i++) {
            descriptor[i] = { value: origList[i], enumerable: true };
        }
        return Object.create(FileList.prototype, descriptor);
    }
};
FilePicker.metadata = { "extension": { "_DEFAULTS": Props }, "properties": { "accept": { "type": "Array<string>|null", "value": null }, "capture": { "type": "string|null", "enumValues": ["user", "environment", "implementation", "none"], "value": "none" }, "disabled": { "type": "boolean", "value": false }, "primaryText": { "type": "string|function" }, "secondaryText": { "type": "string|function" }, "selectOn": { "type": "string", "enumValues": ["auto", "click", "clickAndDrop", "drop"], "value": "auto" }, "selectionMode": { "type": "string", "enumValues": ["multiple", "single"], "value": "multiple" } }, "slots": { "trigger": {} }, "events": { "ojBeforeSelect": { "cancelable": true }, "ojInvalidSelect": {}, "ojSelect": {} }, "methods": { "_doSelectHelper": {} } };
__decorate([
    listener()
], FilePicker.prototype, "_handleSelectingFiles", null);
__decorate([
    listener()
], FilePicker.prototype, "_handleFileSelected", null);
__decorate([
    listener()
], FilePicker.prototype, "_handleDragEnter", null);
__decorate([
    listener()
], FilePicker.prototype, "_handleDragOver", null);
__decorate([
    listener()
], FilePicker.prototype, "_handleDragLeave", null);
__decorate([
    listener()
], FilePicker.prototype, "_handleFileDrop", null);
__decorate([
    listener()
], FilePicker.prototype, "_handleFocusIn", null);
__decorate([
    listener()
], FilePicker.prototype, "_handleFocusOut", null);
FilePicker = __decorate([
    customElement('oj-file-picker')
], FilePicker);

export { FilePicker };
