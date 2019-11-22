/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojtranslation', 'knockout', 'ojs/ojcomposite', 'ojs/ojlogger', 'ojs/ojcomponentcore', 'ojs/ojknockout'], 
function(oj, $, Translations,  ko, Composite, Logger)
{
  "use strict";
var __oj_file_picker_metadata = 
{
  "properties": {
    "accept": {
      "type": "Array<string>"
    },
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "selectOn": {
      "type": "string",
      "enumValues": [
        "auto",
        "click",
        "clickAndDrop",
        "drop"
      ],
      "value": "auto"
    },
    "selectionMode": {
      "type": "string",
      "enumValues": [
        "multiple",
        "single"
      ],
      "value": "multiple"
    }
  },
  "methods": {
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojSelect": {},
    "ojBeforeSelect": {},
    "ojInvalidSelect": {}
  },
  "extension": {}
};


/**
 * File Upload Transport Interface
 *
 * This interface defines the API to communicate/send data to the server asynchronously. It is
 * designed to reflect the needs of the Jet File Upload UI as opposed to being some general
 * File Upload API. Application must implement the FileUploadTransport interface to use the JET
 * File Upload Component. The implementation of this interface should handle the details of features
 * supported by the server such as multipart upload, chunking, concurrent upload, queuing files,
 * abort pause/resume etc.
 *
 * <p>
 * See {@link oj.ProgressItem}
 * </p>
 *
 * @since 4.0.0
 * @export
 * @interface FileUploadTransport
 * @memberof oj
 * @ojtsimport {module: "ojprogresslist", type:"AMD", imported: ["ProgressItem"]}
 */

/**
 * This method queues up files for upload. It returns an array of <code class="prettyprint">ProgressItem</code> objects.
 * Each file corresponds to a <code class="prettyprint">ProgressItem</code> object.
 * These items can be uploaded by calling the flush method.
 *
 * @method
 * @name queue
 * @memberof oj.FileUploadTransport
 * @instance
 * @param {FileList} fileList A list contains the File objects to be queued.
 * @returns {Array.<oj.ProgressItem>} an array of <code class="prettyprint">ProgressItem</code> objects.
 *
 * @example <caption>Upload files</caption>
 * var uploadTransport = new oj.FileUploadTransport();
 * uploadTransport.queue(fileList);
 *
 */

/**
 * This method uploads all files that are currently in the queue to the specified server.
 *
 * @method
 * @name flush
 * @memberof oj.FileUploadTransport
 * @instance
 * @returns {void}
 *
 * @example <caption>Upload all queued files</caption>
 *
 * var uploadTransport = new oj.FileUploadTransport();
 * uploadTransport.queue(fileList);
 * uploadTransport.flush();
 *
 */



/* global ko, Logger:false, Translations:false, Promise:false, Composite:false*/

/**
 * @ojcomponent oj.ojFilePicker
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
 *
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 * <p> The following CSS classes can be applied by the page author as needed.</p>
 *
 * {@ojinclude "name":"stylingDoc"}
 */

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
* Triggered before files are selected to allow for custom validation
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
 * <p>The <code class="prettyprint">trigger</code> slot is set on the custom content of the file picker.</p>
 *
 * @ojslot trigger
 * @memberof oj.ojFilePicker
 *
 * @example <caption>Display an upload button instead of the default dropzone</caption>
 * &lt;oj-file-picker class='oj-filepicker-custom'>
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
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Class</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-filepicker-custom</td>
 *       <td>Apply to a custom file picker if the entire dropzone is replaced with another clickable element like button or menu item. Note that the oj-filepicker-custom class doesn't have to be specified in order to change the dropzone text.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-filepicker-dropzone</td>
 *       <td>When using custom trigger slot content, the oj-filepicker-dropzone class can be applied to an element where drag and drop feedback should be displayed. If not specified, feedback will be displayed over the entire slot content. Note that this class only controls the visual rendering of drag and drop feedback; the entire slot content region will react to drag and drop interactions.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-filepicker-text</td>
 *       <td>When using custom trigger slot content, the oj-filepicker-text class can be used to apply the same text styling that is used by the default trigger slot content.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
 * @memberof oj.ojFilePicker
 */
var pickerView = "<input type='file' class='oj-helper-hidden'" + "       :multiple=\"[[$properties.selectionMode == 'multiple']]\"" + '       :accept="[[acceptStr]]">' + '</input>' + "<div class='oj-filepicker-clickable'>" + "  <oj-bind-slot name='trigger'>" + "   <div tabindex='0'" + "         :class=\"[[{'oj-filepicker-dropzone':$properties.disabled !== true, 'oj-filepicker-disabled': $properties.disabled === true}]]\">" + "     <div class='oj-filepicker-text-parent'>" + "       <div class='oj-filepicker-text'><oj-bind-text value='[[defPrimaryDropzoneText]]'></oj-bind-text></div>" + "       <div class='oj-filepicker-secondary-text oj-typography-body-3'><oj-bind-text value='[[defSecondaryDropzoneText]]'></oj-bind-text></div>" + "     </div><div class='oj-filepicker-icon oj-fwk-icon-plus oj-fwk-icon'></div></div>" + '  </oj-bind-slot>' + '</div>';

function pickerViewModel(context) {
  var self = this;
  var element = context.element;
  var props = context.properties;
  var $dropzone;
  var $dropfeedback;
  var inDropZone;
  var isDroppable;
  var inputElem;
  var selecting = false;
  var dragPromiseResolver;
  var isDisabled = props.disabled;
  var selectOn = props.selectOn;
  self.acceptStr = ko.pureComputed(function () {
    var acceptProp = props.accept;

    if (acceptProp && acceptProp.length) {
      return acceptProp.join(',');
    }

    return null;
  }, self); // add property changed listeners

  element.addEventListener('selectOnChanged', function (event) {
    setSelectOn(event.detail.value);
  });
  element.addEventListener('disabledChanged', function (event) {
    setDisabled(event.detail.value);
  });

  function setSelectOn(selOn) {
    selectOn = selOn;
    var dropzone = $dropzone[0];
    var clickable = $(element).find('.oj-filepicker-clickable')[0];
    removeDragAndDropListeners(dropzone);
    removeClickListeners(clickable);

    if (isDisabled) {
      return;
    }

    switch (selectOn) {
      case 'click':
        addClickListeners(clickable);
        break;

      case 'drop':
        addDragAndDropListeners(dropzone); // for accessbility

        if (clickable) {
          clickable.addEventListener('keypress', selectingFiles, false);
        }

        break;

      case 'auto':
      case 'clickAndDrop':
      default:
        addClickListeners(clickable);
        addDragAndDropListeners(dropzone);
        break;
    }
  }

  function setDisabled(disabled) {
    isDisabled = disabled;
    setSelectOn(selectOn);

    if (selectOn === 'click') {
      return;
    }

    if (disabled) {
      $dropfeedback.removeAttr('tabindex');
    } else {
      $dropfeedback.attr('tabindex', 0);
    }
  }

  self.defSingleFileUploadError = Translations.getTranslatedString('oj-ojFilePicker.singleFileUploadError');
  self.defPrimaryDropzoneText = Translations.getTranslatedString('oj-ojFilePicker.dropzonePrimaryText');
  self.defSecondaryDropzoneText = ko.pureComputed(function () {
    return props.selectionMode === 'single' ? Translations.getTranslatedString('oj-ojFilePicker.secondaryDropzoneText') : Translations.getTranslatedString('oj-ojFilePicker.secondaryDropzoneTextMultiple');
  }, self);
  self.defUnknownFileType = Translations.getTranslatedString('oj-ojFilePicker.unknownFileType');

  self.bindingsApplied = function () {
    var $elem = $(element);
    $elem.addClass('oj-filepicker');
    $dropzone = $elem;
    var dropzone = $elem.find('.oj-filepicker-dropzone');
    $dropfeedback = dropzone.length > 0 ? dropzone : $dropzone;
    setSelectOn(props.selectOn); // add a change listener on the <input> element

    var $inputElem = $elem.find('input');

    if ($inputElem.length) {
      inputElem = $inputElem[0];
      inputElem.addEventListener('change', handleFileSelected, false);
    } // suppress focus ring unless accessed by keyboard
    // makeFocusable doesn't work because file picker is launched by the browser
    // that changes focus

    /*
      oj.DomUtils.makeFocusable({
      'element': $elem.find(".oj-filepicker-dropzone"),
      'applyHighlight': true
      });
    */


    setDisabled(isDisabled);

    if (!isDisabled) {
      $dropfeedback[0].addEventListener('focus', function () {
        if (selecting) {
          return;
        }

        if (oj.DomUtils.recentPointer()) {
          $dropfeedback.removeClass('oj-focus-highlight');
        } else {
          $dropfeedback.addClass('oj-focus-highlight');
        }
      });
      $dropfeedback[0].addEventListener('focusout', function () {
        if (selecting) {
          return;
        }

        $dropfeedback.removeClass('oj-focus-highlight');
      });
    }
  }; // delegate the click to the internal input element to select files


  function selectingFiles(event) {
    //  - within firefox browser cannot tab past filepicker without file selector
    // window opening
    // only launching the file picker if click or 'Enter' was pressed
    if (event.type === 'click' || event.type === 'keypress' && event.keyCode === 13) {
      selecting = true; //  - form submit event is triggered when the file upload button is clicked

      event.preventDefault(); //  - unable to upload after clearing file progress list in demo
      // reset input value so file selection event will fire when selecting the same file

      inputElem.value = null;
      inputElem.click();
      return true;
    }

    return false;
  }

  function handleFileSelected(event) {
    event.preventDefault();
    event.stopPropagation(); // if user cancelled out the file picker dialog, don't add files to upload queue

    var files = event.target.files;

    if (files.length > 0) {
      var ai = oj.AgentUtils.getAgentInfo();

      if (ai.browser === oj.AgentUtils.BROWSER.EDGE) {
        // EDGE doesn't have file dialog filtering
        var rejected = validateTypes(files).rejected;

        if (rejected.length > 0) {
          fireInvalidSelectEvent(getMimeTypeValidationMessages(rejected), event, false);
        } else {
          handleFilesAdded(files, event);
        }
      } else {
        handleFilesAdded(files, event);
      }
    }

    selecting = false;
  }

  function acceptFile(file) {
    var acceptProp = props.accept;

    if (!acceptProp || acceptProp.length === 0 || !file) {
      return true;
    }

    var accept;

    for (var i = 0; i < acceptProp.length; i++) {
      accept = oj.StringUtils.trim(acceptProp[i]);

      if (!accept) {
        return true;
      } else if (accept.startsWith('.', 0)) {
        // when dragover, only MIME type is available, file name is undefined
        if (!file.name || file.name && file.name.endsWith(accept)) {
          return true;
        }
      } else if (!file.type) {
        return false;
      } else if (accept === 'image/*') {
        if (file.type.startsWith('image/', 0)) {
          return true;
        }
      } else if (accept === 'video/*') {
        if (file.type.startsWith('video/', 0)) {
          return true;
        }
      } else if (accept === 'audio/*') {
        if (file.type.startsWith('audio/', 0)) {
          return true;
        }
      } else if (file.type === accept) {
        return true;
      }
    }

    return false;
  }

  function validateTypes(files) {
    var accepted = [];
    var rejected = [];
    var file;
    var type = self.defUnknownFileType;

    if (files) {
      for (var i = 0; i < files.length; i++) {
        file = files[i];
        var name = file.name;

        if (name) {
          var nameSplit = name.split('.');
          type = nameSplit.length > 1 ? '.' + nameSplit.pop() : type;
        }

        type = file.type ? file.type : type; // If type isn't already in one of the lists, add it

        if (!accepted.includes(type) && !rejected.includes(type)) {
          if (acceptFile(file)) {
            accepted.push(type);
          } else {
            rejected.push(type);
          }
        }
      }
    }

    return {
      accepted: accepted,
      rejected: rejected
    };
  }

  function addClickListeners(clickable) {
    if (clickable) {
      clickable.addEventListener('click', selectingFiles, false);
      clickable.addEventListener('keypress', selectingFiles, false);
    }
  }

  function addDragAndDropListeners(dropzone) {
    if (dropzone) {
      dropzone.addEventListener('dragenter', handleDragEnter, false);
      dropzone.addEventListener('dragover', handleDragOver, false);
      dropzone.addEventListener('dragleave', handleDragLeave, false);
      dropzone.addEventListener('dragend', handleDragLeave, false);
      dropzone.addEventListener('drop', handleFileDrop, false);
    }
  }

  function removeClickListeners(clickable) {
    if (clickable) {
      clickable.removeEventListener('click', selectingFiles, false);
      clickable.removeEventListener('keypress', selectingFiles, false);
    }
  }

  function removeDragAndDropListeners(dropzone) {
    if (dropzone) {
      dropzone.removeEventListener('dragenter', handleDragEnter, false);
      dropzone.removeEventListener('dragover', handleDragOver, false);
      dropzone.removeEventListener('dragleave', handleDragLeave, false);
      dropzone.removeEventListener('dragend', handleDragLeave, false);
      dropzone.removeEventListener('drop', handleFileDrop, false);
    }
  } // don't add "oj-valid-drop" class here because
  // hover effect is lost when dragging over the upload text


  function handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    var dataTransfer = event.dataTransfer;

    if (inDropZone) {
      return;
    } // NOTE: dragged files not available
    // event.dataTransfer.files = null (firefox)
    // event.dataTransfer.files.length = 0 (chrome, IE, Edge and Safari)
    // use dataTransfer.items.type instead (works in chrome, firefox and Edge)
    // event.dataTransfer.items = undefined (not work in IE and safari, just don't display ghost buster)
    //  - drag and drop to ojfilepicker fails on safari


    var ai = oj.AgentUtils.getAgentInfo();
    inDropZone = true;
    isDroppable = true;

    if (ai.browser !== oj.AgentUtils.BROWSER.SAFARI && ai.browser !== oj.AgentUtils.BROWSER.IE) {
      var files = dataTransfer.items;
      var messages = [];
      var selectionModeValid = validateSelectionMode(files);
      var droppable = validateTypes(files);

      if (selectionModeValid && droppable.rejected.length === 0) {
        // validation passes
        $dropfeedback.addClass('oj-valid-drop');
      } else {
        isDroppable = false;

        if (selectionModeValid) {
          // mimetype Validation fails
          messages = getMimeTypeValidationMessages(droppable.rejected);
        } else {
          // selected multiple files in single selection mode
          messages.push({
            severity: 'error',
            summary: self.defSingleFileUploadError
          });
        }

        fireInvalidSelectEvent(messages, event, true);
      }
    } else {
      $dropfeedback.addClass('oj-valid-drop');
    }
  }

  function validateSelectionMode(files) {
    // False if selected multiple files when in single file selection mode
    return element.selectionMode !== 'single' || files.length === 1;
  }

  function handleDragLeave(event) {
    if (!inDropZone) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if ($(event.relatedTarget).parents('.oj-filepicker').length === 0) {
      inDropZone = false;
      $dropfeedback.removeClass('oj-valid-drop');

      if (!isDroppable) {
        dragPromiseResolver();
        dragPromiseResolver = null;
        $dropfeedback.removeClass('oj-invalid-drop');
      }
    }
  }

  function handleFileDrop(event) {
    if (inDropZone) {
      event.preventDefault();
      event.stopPropagation();
      var files = createFileList(event.dataTransfer.files);
      var ai = oj.AgentUtils.getAgentInfo();

      if (ai.browser === oj.AgentUtils.BROWSER.SAFARI || ai.browser === oj.AgentUtils.BROWSER.IE) {
        var messages = [];

        if (validateSelectionMode(files)) {
          var droppable = validateTypes(files);

          if (droppable.rejected.length > 0) {
            // mimetype Validation fails
            messages = getMimeTypeValidationMessages(droppable.rejected);
          }
        } else {
          messages.push({
            severity: 'error',
            summary: self.defSingleFileUploadError
          });
        }

        if (messages.length > 0) {
          isDroppable = false;
          fireInvalidSelectEvent(messages, event, false);
        }
      }

      if (isDroppable) {
        handleFilesAdded(files, event);
      }

      handleDragLeave(event);
    }
  }

  function getMimeTypeValidationMessages(rejected) {
    var messages = [];

    if (rejected.length === 1) {
      messages.push({
        severity: 'error',
        summary: Translations.getTranslatedString('oj-ojFilePicker.singleFileTypeUploadError', {
          fileType: rejected[0]
        })
      });
    } else {
      messages.push({
        severity: 'error',
        summary: Translations.getTranslatedString('oj-ojFilePicker.multipleFileTypeUploadError', {
          fileTypes: rejected.join(Translations.getTranslatedString('oj-converter.plural-separator'))
        })
      });
    }

    return messages;
  }

  function fireInvalidSelectEvent(messages, oEvent, isDrag) {
    if (isDrag) {
      $dropfeedback.addClass('oj-invalid-drop');
    }

    var dragPromise = isDrag ? new Promise(function (resolve) {
      dragPromiseResolver = resolve;
    }) : null;
    var event = new CustomEvent('ojInvalidSelect', {
      detail: {
        messages: messages,
        originalEvent: oEvent,
        until: dragPromise
      }
    });
    element.dispatchEvent(event);
  } // clone a FileList


  function createFileList(origList) {
    var descriptor = {
      length: {
        value: origList.length
      },
      item: {
        value: function value(index) {
          return this[index];
        }
      }
    };

    for (var i = 0; i < origList.length; i++) {
      descriptor[i] = {
        value: origList[i],
        enumerable: true
      };
    }

    return Object.create(FileList.prototype, descriptor);
  }

  function handleFilesAdded(files, oEvent) {
    //  - filepicker: filelist cleared after the handler returns
    // Note: the parameter "files" is a direct reference to the embedded Input element's property
    // which could be reset or changed.
    // we need to return a copy of FileList just in case apps hold on to a reference to FileList
    var list = createFileList(files);
    var acceptPromise = Promise.resolve();

    var acceptFunc = function acceptFunc(promise) {
      acceptPromise = promise;
    };

    var beforeEvent = new CustomEvent('ojBeforeSelect', {
      detail: {
        files: list,
        originalEvent: oEvent,
        accept: acceptFunc
      }
    });
    element.dispatchEvent(beforeEvent);
    acceptPromise.then(function () {
      // if there are no invalid files
      var event = new CustomEvent('ojSelect', {
        detail: {
          files: list,
          originalEvent: oEvent
        }
      });
      element.dispatchEvent(event);
    }, function (messages) {
      fireInvalidSelectEvent(messages, oEvent, false);
    });
  }
}
/* global __oj_file_picker_metadata */


__oj_file_picker_metadata.extension._SHOULD_REMOVE_DISABLED = true;
Composite.register('oj-file-picker', {
  view: pickerView,
  viewModel: pickerViewModel,
  metadata: __oj_file_picker_metadata
});
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

});