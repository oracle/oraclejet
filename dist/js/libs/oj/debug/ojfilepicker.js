define(['exports', 'ojs/ojcore-base', 'ojs/ojdomutils', 'ojs/ojvcomponent', 'ojs/ojtranslation'], function (exports, oj, DomUtils, ojvcomponent, Translations) { 'use strict';

   /**
    * @license
    * Copyright (c) 2017 2020, Oracle and/or its affiliates.
    * The Universal Permissive License (UPL), Version 1.0
    * as shown at https://oss.oracle.com/licenses/upl/
    * @ignore
    */
   /**
    * @ojcomponent oj.ojFilePicker
    * @ojtsvcomponent
    * @since 4.0.0
    * @ojdisplayname File Picker
    * @ojshortdesc A file picker displays a clickable dropzone for selecting files from the device storage.
    * @ojtsimport {module: "ojmessage", type:"AMD", imported: ["ojMessage"]}
    *
    * @class oj.ojFilePicker
    * @ojsignature {target: "Type", value:"class ojFilePicker extends JetElement<ojFilePickerSettableProperties>"}
    *
    * @ojpropertylayout {propertyGroup: "common", items: ["accept", "selectOn", "selectionMode", "disabled"]}
    * @ojvbdefaultcolumns 6
    * @ojvbmincolumns 2
    *
    * @ojuxspecs ['file-picker']
    *
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
    * <h3 id="touch-section">
    *   Touch End User Information
    *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
    * </h3>
    *
    * {@ojinclude "name":"touchDoc"}
    *
    * <h3 id="keyboard-section">
    *   Keyboard End User Information
    *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
    * </h3>
    *
    * {@ojinclude "name":"keyboardDoc"}
    */
   // ------------------------------------------------ ojFilePicker styling start ------------------------------------------------
   // ----------------------------------- oj-filepicker-custom--------------
   /**
      * Apply to a custom file picker if the entire dropzone is replaced with another clickable element like button or menu item. <br/>
      * Note that the oj-filepicker-custom class doesn't have to be specified in order to change the dropzone text.
      * @ojstyleclass oj-filepicker-custom
      * @ojdisplayname Custom
      * @memberof oj.ojFilePicker
      * @ojdeprecated {since: '9.0.0', description: 'oj-filepicker-custom class has been deprecated.  Class is no longer needed.'}
      */
   // ----------------------------------- oj-filepicker-dropzone--------------
   /**
      * Apply to the dropzone of the file picker.
      * @ojstyleclass oj-filepicker-dropzone
      * @ojdisplayname File Picker DropZone
      * @memberof oj.ojFilePicker
      * @ojdeprecated {since: '9.0.0', description: 'oj-filepicker-dropzone class has been deprecated.  Class is no longer needed.'}
      */
   // ----------------------------------- oj-filepicker-text--------------
   /**
      * Apply to the dropzone text of the file picker.
      * @ojstyleclass oj-filepicker-text
      * @ojdisplayname File Picker Text
      * @memberof oj.ojFilePicker
      * @ojdeprecated {since: '9.0.0', description: 'oj-filepicker-text class has been deprecated.  Class is no longer needed.'}
      */
   // ------------------------------------------------ ojFilePicker styling end ------------------------------------------------

   /**
    * An array of strings of allowed MIME types or file extensions that can be uploaded; this is unlike the accept attribute of the html &lt;input> element that accepts a simple comma-delimited string. If not specified, accept all file types.
   <p>Note: If accept is specified, files with empty string type will be rejected if no match found in the "accept" value.
    * @member
    * @name accept
    * @memberof oj.ojFilePicker
    * @instance
    * @type {Array.<string>|null}
    * @default null
    * @ojshortdesc An array of strings of allowed MIME types or file extensions that can be uploaded. If not specified, accept all file types
    *
    *
    * @example <caption>Get or set the <code class="prettyprint">accept</code> property:</caption>
    * let elem = document.getElementById('filepicker') as ojFilePicker;
    * //set accept to an array of strings
    * elem.accept = ["image/*", "video/*"];
    * //or
    * elem.set('accept', ["image/*", "video/*"]);
    *
    * // getter
    * var acceptValue = myFilePicker.accept;
    *
    * // setter
    * myFilePicker.accept = ['image/*', "video/*"];
    */

   /**
    * Specifies the preferred facing mode for the device's
    * <a href="https://www.w3.org/TR/html-media-capture/#dom-htmlinputelement-capture">media capture</a> mechanism;
    * this is most often used to provide direct camera access on mobile devices.  Note that the accept attribute must
    * be specified and have an associated capture control type (e.g.["image/*"]) for the capture attribute to take effect.  Support may vary by browser.
    * @member
    * @name capture
    * @memberof oj.ojFilePicker
    * @instance
    * @type {string|null}
    * @ojvalue {string} "user" Specifies user-facing as the preferred mode
    * @ojvalue {string} "environment" Specifies environment-facing as the preferred mode
    * @ojvalue {string} "implementation" Specifies an implementation-specific default as the preferred facing mode
    * @default null
    * @ojshortdesc Specifies the preferred facing mode for the device's media capture mechanism.
    */

   /**
    * Whether to allow single or multiple file selection.
    * @member
    * @name selectionMode
    * @memberof oj.ojFilePicker
    * @instance
    * @type {string}
    * @ojvalue {string} "multiple" multiple file selection
    * @ojvalue {string} "single" single file selection
    * @default "multiple"
    * @ojshortdesc Whether to allow single or multiple file selection.
    *
    * @example <caption>Initialize the file picker with the <code class="prettyprint">selection-mode</code> attribute specified:</caption>
    * &lt;oj-file-picker selection-mode='single'>&lt;/oj-file-picker>
    *
    * @example <caption>Get or set the <code class="prettyprint">selectionMode</code> property after initialization:</caption>
    * // getter
    * var selectionModeValue = myFilePicker.selectionMode;
    *
    * // setter
    * myFilePicker.selectionMode = 'single';
    */

   /**
    * Disables the filepicker if set to <code class="prettyprint">true</code>.
    * @member
    * @name disabled
    * @memberof oj.ojFilePicker
    * @instance
    * @type {boolean}
    * @default false
    * @ojshortdesc Disables the filepicker if set to true
    *
    * @example <caption>Initialize the file picker with the <code class="prettyprint">disabled</code> attribute specified:</caption>
    * &lt;oj-file-picker disabled='true'>&lt;/oj-file-picker>
    *
    * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
    * // getter
    * var disabledValue = myFilePicker.disabled;
    *
    * // setter
    * myFilePicker.disabled = true;
    */

   /**
    * The type of event to select the files.
    * @member
    * @name selectOn
    * @memberof oj.ojFilePicker
    * @instance
    * @type {string}
    * @ojvalue {string} "auto" either click or drag and drop to select the files
    * @ojvalue {string} "click" click to select the files
    * @ojvalue {string} "drop" drag and drop the files
    * @ojvalue {string} "clickAndDrop" either click or drag and drop to select the files
    * @default "auto"
    * @ojshortdesc The type of event to select the files.
    *
    * @example <caption>Initialize the file picker with the <code class="prettyprint">select-on</code> attribute specified:</caption>
    * &lt;oj-file-picker select-on='click'>&lt;/oj-file-picker>
    *
    * @example <caption>Get or set the <code class="prettyprint">selectOn</code> property after initialization:</caption>
    * // getter
    * var selectOnValue = myFilePicker.selectOn;
    *
    * // setter
    * myFilePicker.selectOn = 'click';
    */


   /**
    * Triggered after the files are selected
    * @member
    * @name select
    * @memberof oj.ojFilePicker
    * @instance
    * @event
    * @ojshortdesc Triggered after the files are selected
    * @property {FileList} files The files that were just selected.
    */

   /**
    * Triggered before files are selected to allow for custom validation.  To reject the selected files, the application can either call event.preventDefault() or pass a rejected Promise to the accept detail property. The latter approach is recommended because this allows the application to send a message stating why the files were rejected.
    * @member
    * @name beforeSelect
    * @memberof oj.ojFilePicker
    * @instance
    * @event
    * @ojshortdesc Triggered before files are selected to allow for custom validation
    * @property {FileList} files The selected files
    * @property {function} accept To perform custom validation, the application should call the accept function and pass in a Promise.  The Promise should be resolved to accept the current selection, otherwise it should be rejected with an Array<{@link oj.ojMessage.Message}> describing the reasons for rejection.
    * @ojsignature [{target: "Type", value: "(acceptPromise:Promise<void>) => void", for: "accept", jsdocOverride: true}]
    */

   /**
    * Triggered when invalid files are selected.  This event provides the application with a list of messages that should be displayed to give the user feedback about the
    * problems with their selection.  This feedback can be safely cleared when a subsequent ojBeforeSelect, ojInvalidSelect, or ojSelect event is received.  Additionally the
    * event.detail.until property may be populated with a Promise to provide short-term feedback during a user interaction (typically drag and drop); the feedback should be cleared upon resolution
    * of this Promise.
    * @member
    * @name invalidSelect
    * @memberof oj.ojFilePicker
    * @instance
    * @event
    * @ojshortdesc Triggered when invalid files are selected
    * @property {Array} messages Messages that should be displayed to the user (e.g. in an oj-messages component) describing invalid files.
    * @property {Promise<void> | null} until This property may be populated with a Promise to provide short-term feedback during a user interaction (typically drag and drop); the feedback should be cleared upon the resolution of this Promise.
    * @ojsignature [{target:"Type", value:"Array<oj.ojMessage.Message>", for:"messages", jsdocOverride: true}]

    */

   /**
    * <p>The <code class="prettyprint">trigger</code> slot is used to replace the default content of the file picker.</p>
    *
    * @ojslot trigger
    * @memberof oj.ojFilePicker
    *
    * @example <caption>Display an upload button instead of the default dropzone</caption>
    * &lt;oj-file-picker>
    *   &lt;oj-button slot='trigger'>
    *      &lt;span slot='startIcon' class='oj-fwk-icon oj-fwk-icon-arrowbox-n'>&lt;/span>
    *      Upload
    *   &lt;/oj-button>
    * &lt;/oj-file-picker>
    */

   /**
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
    * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
    * @memberof oj.ojFilePicker
    */

   /**
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
    * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
    * @memberof oj.ojFilePicker
    */

   /**
    * Sets a property or a single subproperty for complex properties and notifies the component
    * of the change, triggering a [property]Changed event.
    *
    * @function setProperty
    * @param {string} property - The property name to set. Supports dot notation for subproperty access.
    * @param {any} value - The new value to set the property to.
    * @return {void}
    *
    * @expose
    * @memberof oj.ojFilePicker
    * @instance
    * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
    *
    * @example <caption>Set a single subproperty of a complex property:</caption>
    * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
    */
   /**
    * Retrieves a value for a property or a single subproperty for complex properties.
    * @function getProperty
    * @param {string} property - The property name to get. Supports dot notation for subproperty access.
    * @return {any}
    *
    * @expose
    * @memberof oj.ojFilePicker
    * @instance
    *
    * @example <caption>Get a single subproperty of a complex property:</caption>
    * var subpropValue = myComponent.getProperty('complexProperty.subProperty1.subProperty2');
    */
   /**
    * Performs a batch set of properties.
    * @function setProperties
    * @param {Object} properties - An object containing the property and value pairs to set.
    * @return {void}
    *
    * @expose
    * @memberof oj.ojFilePicker
    * @instance
    *
    * @example <caption>Set a batch of properties:</caption>
    * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
    */

   var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
       var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
       if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
       else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
       return c > 3 && r && Object.defineProperty(target, key, r), r;
   };
   class Props {
       constructor() {
           this.accept = null;
           this.capture = null;
           this.disabled = false;
           this.selectOn = 'auto';
           this.selectionMode = 'multiple';
       }
   }
   exports.FilePicker = class FilePicker extends ojvcomponent.VComponent {
       constructor(props) {
           super(props);
           this.state = {
               focus: false,
               validity: 'NA'
           };
           this.inputElemRef = (element) => {
               this.inputElem = element;
           };
           this.rootElemRef = (element) => {
               this.rootElem = element;
           };
       }
       _handleSelectingFiles(event) {
           if (event.type === 'click' || (event.type === 'keypress' && event.keyCode === 13)) {
               this.selecting = true;
               event.preventDefault();
               this.inputElem.value = null;
               this.inputElem.click();
               return true;
           }
           return false;
       }
       _handleFileSelected(event) {
           event.preventDefault();
           event.stopPropagation();
           var files = event.target.files;
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
                           summary: Translations.getTranslatedString('oj-ojFilePicker.singleFileUploadError')
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
                           summary: Translations.getTranslatedString('oj-ojFilePicker.singleFileUploadError')
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
       _handleFocusIn(event) {
           if (this.selecting) {
               return;
           }
           this.updateState({ focus: !DomUtils.recentPointer() });
       }
       _handleFocusOut(event) {
           if (this.selecting) {
               return;
           }
           this.updateState({ focus: false });
       }
       render() {
           var _a, _b;
           const props = this.props;
           const triggerSlot = (_b = (_a = this.props).trigger) === null || _b === void 0 ? void 0 : _b.call(_a);
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
           return (ojvcomponent.h("oj-file-picker", { class: rootClasses },
               ojvcomponent.h("div", { class: 'oj-filepicker-disabled oj-filepicker-container' }, triggerSlot || this._renderDefaultTriggerContent(props))));
       }
       _renderWithCustomTrigger(props, triggerSlot, clickHandler) {
           const dndHandlers = this._getDndHandlers(props);
           return (ojvcomponent.h("oj-file-picker", { class: 'oj-filepicker' + this._getFocusClass(), ref: this.rootElemRef, onFocusin: this._handleFocusIn, onFocusout: this._handleFocusOut },
               this._renderInputElement(props),
               ojvcomponent.h("div", { onClick: clickHandler, onKeypress: this._handleSelectingFiles, onDragenter: dndHandlers.handleDragEnter, onDragover: dndHandlers.handleDragOver, onDragleave: dndHandlers.handleDragLeave, onDragend: dndHandlers.handleDragLeave, onDrop: dndHandlers.handleFileDrop, class: 'oj-filepicker-container' }, triggerSlot)));
       }
       _renderWithDefaultTrigger(props, clickHandler) {
           const validity = this.state.validity;
           const validityState = validity === 'valid' ? ' oj-valid-drop' : validity === 'invalid' ? ' oj-invalid-drop' : '';
           const dndHandlers = this._getDndHandlers(props);
           return (ojvcomponent.h("oj-file-picker", { class: 'oj-filepicker oj-filepicker-no-trigger', ref: this.rootElemRef },
               this._renderInputElement(props),
               ojvcomponent.h("div", { onClick: clickHandler, onKeypress: this._handleSelectingFiles, class: 'oj-filepicker-container' },
                   ojvcomponent.h("div", { tabindex: '0', class: 'oj-filepicker-dropzone' + validityState + this._getFocusClass(), onDragenter: dndHandlers.handleDragEnter, onDragover: dndHandlers.handleDragOver, onDragleave: dndHandlers.handleDragLeave, onDragend: dndHandlers.handleDragLeave, onDrop: dndHandlers.handleFileDrop, onFocusin: this._handleFocusIn, onFocusout: this._handleFocusOut }, this._renderDefaultTriggerContent(props)))));
       }
       _renderDefaultTriggerContent(props) {
           const isSingle = props.selectionMode == 'single';
           return [
               ojvcomponent.h("div", null,
                   ojvcomponent.h("div", { class: 'oj-filepicker-text' }, Translations.getTranslatedString('oj-ojFilePicker.dropzonePrimaryText')),
                   ojvcomponent.h("div", { class: 'oj-filepicker-secondary-text' }, isSingle
                       ? Translations.getTranslatedString('oj-ojFilePicker.secondaryDropzoneText')
                       : Translations.getTranslatedString('oj-ojFilePicker.secondaryDropzoneTextMultiple'))),
               ojvcomponent.h("div", { class: 'oj-filepicker-icon oj-fwk-icon-plus oj-fwk-icon' })
           ];
       }
       _renderInputElement(props) {
           const acceptProp = props.accept;
           const accept = acceptProp && acceptProp.length ? acceptProp.join(',') : null;
           return (ojvcomponent.h("input", { type: 'file', class: 'oj-helper-hidden', multiple: this.props.selectionMode == 'multiple', accept: accept, ref: this.inputElemRef, onChange: this._handleFileSelected, capture: props.capture === 'implementation' ? '' : props.capture }));
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
                   type = Translations.getTranslatedString('oj-ojFilePicker.unknownFileType');
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
                   summary: Translations.getTranslatedString('oj-ojFilePicker.singleFileTypeUploadError', {
                       fileType: rejected[0]
                   })
               });
           }
           else {
               messages.push({
                   severity: 'error',
                   summary: Translations.getTranslatedString('oj-ojFilePicker.multipleFileTypeUploadError', {
                       fileTypes: rejected.join(Translations.getTranslatedString('oj-converter.plural-separator'))
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
   exports.FilePicker.metadata = { "extension": { "_DEFAULTS": Props }, "properties": { "accept": { "type": "Array<string>|null", "value": null }, "capture": { "type": "string|null", "enumValues": ["environment", "implementation", "user"], "value": null }, "disabled": { "type": "boolean", "value": false }, "selectOn": { "type": "string", "enumValues": ["auto", "click", "clickAndDrop", "drop"], "value": "auto" }, "selectionMode": { "type": "string", "enumValues": ["multiple", "single"], "value": "multiple" } }, "slots": { "trigger": {} }, "events": { "ojBeforeSelect": { "cancelable": true }, "ojInvalidSelect": {}, "ojSelect": {} } };
   __decorate([
       ojvcomponent.listener()
   ], exports.FilePicker.prototype, "_handleSelectingFiles", null);
   __decorate([
       ojvcomponent.listener()
   ], exports.FilePicker.prototype, "_handleFileSelected", null);
   __decorate([
       ojvcomponent.listener()
   ], exports.FilePicker.prototype, "_handleDragEnter", null);
   __decorate([
       ojvcomponent.listener()
   ], exports.FilePicker.prototype, "_handleDragOver", null);
   __decorate([
       ojvcomponent.listener()
   ], exports.FilePicker.prototype, "_handleDragLeave", null);
   __decorate([
       ojvcomponent.listener()
   ], exports.FilePicker.prototype, "_handleFileDrop", null);
   __decorate([
       ojvcomponent.listener()
   ], exports.FilePicker.prototype, "_handleFocusIn", null);
   __decorate([
       ojvcomponent.listener()
   ], exports.FilePicker.prototype, "_handleFocusOut", null);
   exports.FilePicker = __decorate([
       ojvcomponent.customElement('oj-file-picker')
   ], exports.FilePicker);

   Object.defineProperty(exports, '__esModule', { value: true });

});
