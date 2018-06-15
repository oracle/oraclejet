/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojcomponentcore', 'ojs/ojcomposite'], 
       function(oj, $, ko)
{


// Copyright (c) 2017, Oracle and/or its affiliates. All rights reserved.
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
 * @ojstatus preview
 * @since 4.0.0
 * @export
 * @interface FileUploadTransport
 * @memberof oj
 * @ojtsimport ojprogresslist
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


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/* global ko */

/**
 * @ojcomponent oj.ojFilePicker
 * @ojtsimport ojcomposite
 * @since 4.0.0
 * @ojdisplayname File Picker
 * @ojshortdesc Displays a clickable dropzone for selecting files from the device storage.
 * @ojstatus preview
 * @class oj.ojFilePicker
 * @ojsignature {target: "Type", value:"class ojFilePicker extends JetElement<ojFilePickerSettableProperties>"}
 *
 * @classdesc
 * <h3 id="filePickerOverview-section">
 *   JET FilePicker
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#filePickerOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>By default the file picker shows a clickable dropzone for selecting files for upload. However, it can be replaced with any clickable element like a button. After the files are selected, the FilePicker fires a "select" event with the selected files. Application has to specify the listener in order to do the actual upload</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-file-picker on-oj-select='[[listener]]'>
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
 * An array of strings of allowed MIME types or file extensions that can be uploaded. If not specified, accept all file types
<p>Note: If accept is specified, files with empty string type will be rejected if no match found in the "accept" value.
 * @member
 * @name accept
 * @memberof oj.ojFilePicker
 * @instance
 * @type {Array.<string>|null}
 * @default null
 * @ojshortdesc An array of strings of allowed MIME types or file extensions that can be uploaded. If not specified, accept all file types
 *
 * @example <caption>Initialize the file picker with the <code class="prettyprint">accept</code> attribute specified:</caption>
 * &lt;oj-file-picker accept='image/*'>&lt;/oj-file-picker>
 *
 * @example <caption>Get or set the <code class="prettyprint">accept</code> property after initialization:</caption>
 * // getter
 * var acceptValue = myFilePicker.accept;
 *
 * // setter
 * myFilePicker.accept = 'image/*';
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
 *       <td>Apply to the dropzone of the file picker.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-filepicker-text</td>
 *       <td>Apply to the dropzone text of the file picker.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
 * @memberof oj.ojFilePicker
 */

var pickerMetadata =
  {
    properties: {
      accept: {
        type: 'Array'
      },
      selectOn: {
        type: 'string',
        enumValues: ['auto', 'click', 'drop', 'clickAndDrop'],
        value: 'auto'
      },
      selectionMode: {
        type: 'string',
        enumValues: ['multiple', 'single'],
        value: 'multiple'
      }
    },
    events: {
      select: {}
    }
  };

var pickerView =
  "<input type='file' style='display:none'" +
  "       data-bind=\"attr:{multiple: $properties.selectionMode == 'multiple'," +
  '                         accept: acceptStr}">' +
  '</input>' +
  "<div class='oj-filepicker-clickable'>" +
  "  <oj-bind-slot name='trigger'>" +
  "    <div tabindex='0'" +
  "         class='oj-filepicker-dropzone'>" +
  "      <p class='oj-filepicker-text' data-bind='text: defDropzoneText'></p>" +
  '    </div>' +
  '  </oj-bind-slot>' +
  '</div>';

function pickerViewModel(context) {
  var self = this;
  var element = context.element;
  var props = context.properties;
  var $dropzone;
  var inputElem;
  var selecting = false;

  self.acceptStr = ko.pureComputed(function () {
    var acceptProp = props.accept;
    if (acceptProp && acceptProp.length) {
      return acceptProp.join(',');
    }
    return null;
  }, self);

  // add property changed listeners
  element.addEventListener('selectOnChanged', function (event) {
    setSelectOn(event.detail.value);
  });

  function setSelectOn(selectOn) {
    var dropzone = $dropzone[0];
    var clickable = $(element).find('.oj-filepicker-clickable')[0];

    removeDragAndDropListeners(dropzone);
    removeClickListeners(clickable);

    switch (selectOn) {
      case 'click':
        addClickListeners(clickable);
        break;
      case 'drop':
        addDragAndDropListeners(dropzone);
        // for accessbility
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

  self.defDropzoneText = oj.Translations.getTranslatedString('oj-ojFilePicker.dropzoneText');

  self.bindingsApplied = function () {
    var $elem = $(element);
    $elem.addClass('oj-filepicker');
    $dropzone = $elem.find('.oj-filepicker-dropzone');
    setSelectOn(props.selectOn);

    // add a change listener on the <input> element
    var $inputElem = $elem.find('input');
    if ($inputElem.length) {
      inputElem = $inputElem[0];
      inputElem.addEventListener('change', handleFileSelected, false);
    }

    // suppress focus ring unless accessed by keyboard
    // makeFocusable doesn't work because file picker is launched by the browser
    // that changes focus
    /*
      oj.DomUtils.makeFocusable({
      'element': $elem.find(".oj-filepicker-dropzone"),
      'applyHighlight': true
      });
    */

    if ($dropzone.length) {
      $dropzone[0].addEventListener('focus', function () {
        if (selecting) {
          return;
        }

        if (oj.DomUtils.recentPointer()) {
          $dropzone.removeClass('oj-focus-highlight');
        } else {
          $dropzone.addClass('oj-focus-highlight');
        }
      });

      $dropzone[0].addEventListener('focusout', function () {
        if (selecting) {
          return;
        }

        $dropzone.removeClass('oj-focus-highlight');
      });
    }
  };

  // delegate the click to the internal input element to select files
  function selectingFiles(event) {
    selecting = true;
    //  - form submit event is triggered when the file upload button is clicked
    event.preventDefault();
    inputElem.click();
    return true;
  }

  function handleFileSelected(event) {
    event.preventDefault();
    event.stopPropagation();

    // if user cancelled out the file picker dialog, don't add files to upload queue
    var files = event.target.files;
    if (files.length > 0) {
      handleFilesAdded(files, event);
    }

    selecting = false;
  }

  function acceptFile(file) {
    var acceptProp = props.accept;
    if (!acceptProp || (acceptProp.length === 0) || !file) {
      return true;
    }

    var accept;
    for (var i = 0; i < acceptProp.length; i++) {
      accept = oj.StringUtils.trim(acceptProp[i]);
      if (!accept) {
        return true;
      } else if (accept.startsWith('.', 0)) {
        // when dragover, only MIME type is available, file name is undefined
        if (!file.name || (file.name && file.name.endsWith(accept))) {
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

  function getAccepted(files) {
    if (files) {
      for (var i = 0; i < files.length; i++) {
        if (!acceptFile(files[i])) {
          return false;
        }
      }
    }
    return true;
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
  }

  // check the selection and accept option to filter invalid file number or types
  function checkDroppable(files) {
    var validCnt = element.selectionMode !== 'single' || files.length === 1;
    return validCnt ? getAccepted(files) : validCnt;
  }

  // don't add "oj-valid-drop" class here because
  // hover effect is lost when dragging over the upload text
  function handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
  }


  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();

    // NOTE: dragged files not available
    // event.dataTransfer.files = null (firefox)
    // event.dataTransfer.files.length = 0 (chrome, IE, Edge and Safari)
    // use dataTransfer.items.type instead (works in chrome, firefox and Edge)
    // event.dataTransfer.items = undefined (not work in IE and safari, just don't display ghost buster)

    //  - drag and drop to ojfilepicker fails on safari
    var dataTransfer = event.dataTransfer;
    var droppable = (!dataTransfer.items) || checkDroppable(dataTransfer.items);

    if (droppable) {
      // Explicitly show this is a copy.
      dataTransfer.dropEffect = 'copy';
      $dropzone.addClass('oj-valid-drop');
    } else {
      // This is an invalid drop, show don't drop here cursor,
      // NOTE: dropEffect doesn't work in Edge
      dataTransfer.dropEffect = 'none';
    }
    return droppable;
  }

  function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    $dropzone.removeClass('oj-valid-drop');
  }

  function getFileNames(files) {
    var buf = '';
    if (files) {
      for (var i = 0; i < files.length; i++) {
        buf += files[i].name + ' ';
      }
    }
    return buf;
  }

  function handleFileDrop(event) {
    var files = event.dataTransfer.files;
    var droppable = checkDroppable(files);
    if (droppable) {
      // add files to upload queue
      handleFilesAdded(files, event);
    } else {
      oj.Logger.warn('oj-file-picker: Files ' + getFileNames(files) +
                     ' are not acceptable.');
    }

    handleDragLeave(event);
  }

  function handleFilesAdded(files, oEvent) {
    //  - oj_file_picker does not fire ojselect event
    var event = new CustomEvent('ojSelect',
      { detail: { files: files,
        originalEvent: oEvent } });
    element.dispatchEvent(event);
  }
}

oj.Composite.register('oj-file-picker',
  {
    view: pickerView,
    viewModel: pickerViewModel,
    metadata: pickerMetadata
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