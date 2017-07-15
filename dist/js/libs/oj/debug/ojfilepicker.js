/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojcomponentcore', 'ojs/ojcomposite'], 
       function(oj, $, ko)
{


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ignore
 */

/**
 * @member
 * @name accept
 * @memberof oj.ojFilePicker
 * @instance
 * @type {Array}
 * @default <code class="prettyprint">undefined</code>
 * @desc An array of strings of allowed MIME types or file extensions that can be uploaded. If not specified, accept all file types
<p>Note: If accept is specified, files with empty string type will be rejected if no match found in the "accept" value.
 */

/**
 * @member
 * @name selectionMode
 * @memberof oj.ojFilePicker
 * @instance
 * @type {string}
 * @ojvalue {string} "multiple" multiple file selection
 * @ojvalue {string} "single" single file selection
 * @default <code class="prettyprint">"multiple"</code>
 * @desc Whether to allow single or multiple file selection.
 */

/**
 * @member
 * @name selectOn
 * @memberof oj.ojFilePicker
 * @instance
 * @type {string}
 * @ojvalue {string} "auto" either click or drag and drop to select the files
 * @ojvalue {string} "click" click to select the files
 * @ojvalue {string} "drop" drag and drop the files
 * @ojvalue {string} "clickAndDrop" either click or drag and drop to select the files
 * @default <code class="prettyprint">auto</code>
 * @desc The type of event to select the files.
 */


/**
 * @member
 * @name select
 * @memberof oj.ojFilePicker
 * @instance
 * @event
 * @desc Triggered after the files are selected
 * @property {CustomEvent} event <code class="prettyprint">CustomEvent</code> object
 * @property {Object} detail detail of custom event
 * @property {FileList} detail.files The files that were just selected.
 */

var pickerMetadata =
{
  "properties": {
    "accept": {
      "type": "Array"
    },
    "selectOn": {
      "type": "string",
      "enumValues": ["auto", "click", "drop", "clickAndDrop"],
      "value": "auto"
    },
    "selectionMode": {
      "type": "string",
      "enumValues": ["multiple", "single"],
      "value": "multiple"
    }
  },
  "events": {
    "select": {}
  }
};

var pickerView = 
  "<input type='file' style='display:none'" + 
  "       data-bind=\"attr:{multiple: $props.selectionMode == 'multiple'," + 
  "                         accept: acceptStr}\">" + 
  "</input>" +
  "<div class='oj-filepicker-clickable'>" +
  "  <oj-slot name='trigger'>" +
  "    <div tabindex='0'" +
  "         class='oj-filepicker-dropzone'>" +
  "      <p class='oj-filepicker-text' data-bind='text: dropzoneText'></p>" +
  "    </div>" +
  "  </oj-slot>" +
  "</div>";

function pickerViewModel (context) {
  var self = this;
  var element = context.element;
  var props;
  var $dropzone;
  var inputElem;
  var selecting = false;

  context.props.then(function(properties) {
    props = properties;
  });

  self['acceptStr'] = ko.pureComputed(function() {
    var acceptProp = props.accept;
    if (acceptProp && acceptProp.length)
      return acceptProp.join(",");
    return null;
  }, self);

  // add property changed listeners
  element.addEventListener("selectOnChanged", function(event){
    setSelectOn(event.detail.value);
  });

  function setSelectOn(selectOn) {
    var dropzone = $dropzone[0];
    var clickable = $(element).find(".oj-filepicker-clickable")[0];

    removeDragAndDropListeners(dropzone);
    removeClickListeners(clickable);

    switch (selectOn) {
    case 'click':
      addClickListeners(clickable);
      break;
    case 'drop':
      addDragAndDropListeners(dropzone);
      //for accessbility
      if (clickable)
        clickable.addEventListener("keypress", selectingFiles, false);
      break;
    case 'auto':
    case 'clickAndDrop':
    default:
      addClickListeners(clickable);
      addDragAndDropListeners(dropzone);
      break;
    }
  };

  // Composite lifecycle listener 
  self['dropzoneText'] = oj.Translations.getTranslatedString("oj-ojFilePicker.dropzoneText");

  self['bindingsApplied'] = function(context) {
    var $elem = $(element);
    $elem.addClass("oj-filepicker");
    $dropzone = $elem.find(".oj-filepicker-dropzone");
    setSelectOn(props.selectOn);

    //add a change listener on the <input> element
    var $inputElem = $elem.find("input");
    if ($inputElem.length) {
      inputElem = $inputElem[0];
      inputElem.addEventListener("change", handleFileSelected, false)
    }

    //suppress focus ring unless accessed by keyboard
    //makeFocusable doesn't work because file picker is launched by the browser
    //that changes focus
    /*
      oj.DomUtils.makeFocusable({
      'element': $elem.find(".oj-filepicker-dropzone"),
      'applyHighlight': true
      });
    */

    if ($dropzone.length) {
      $dropzone[0].addEventListener("focus", function() {
        if (selecting)
          return;

        if (oj.DomUtils.recentPointer()) {
          $dropzone.removeClass("oj-focus-highlight");
        }
        else {
          $dropzone.addClass("oj-focus-highlight");
        }
      });

      $dropzone[0].addEventListener("focusout", function() {
        if (selecting)
          return;

        $dropzone.removeClass("oj-focus-highlight");      
      });
    }

  };

  //delegate the click to the internal input element to select files
  function selectingFiles(event) {
    selecting = true;
    inputElem.click();
    return true;
  };

  function handleFileSelected(event) {
    event.preventDefault();
    event.stopPropagation();

    //if user cancelled out the file picker dialog, don't add files to upload queue
    var files = event.target.files;
    if (files.length > 0)
      handleFilesAdded(files, event);

    selecting = false;
  };

  function acceptFile(file) {
    var acceptProp = props.accept;
    if (! acceptProp || (acceptProp.length == 0) || ! file)
      return true;

    var accept;
    for (var i = 0; i < acceptProp.length; i++) {
      accept = oj.StringUtils.trim(acceptProp[i]);
      if (! accept) {
        return true;
      }
      else if (accept.startsWith(".", 0)) {
        //when dragover, only MIME type is available, file name is undefined
        if (! file.name || (file.name && file.name.endsWith(accept)))
          return true;
      }
      else if (! file.type) {
        return false;
      }
      else if (accept == "image/*") {
        if (file.type.startsWith("image/", 0))
          return true;
      }
      else if (accept == "video/*") {
        if (file.type.startsWith("video/", 0))
          return true;
      }
      else if (accept == "audio/*") {
        if (file.type.startsWith("audio/", 0))
          return true;
      }
      else if (file.type == accept) {
        return true;
      }
    }
    return false;
  };

  function getAccepted(files) {
    if (files) {
      for (var i = 0; i < files.length; i++) {
        if (! acceptFile(files[i])) {
          return false;
        }
      }
    }
    return true;
  };

  function addClickListeners(clickable) {
    if (clickable) {
      clickable.addEventListener("click", selectingFiles, false);
      clickable.addEventListener("keypress", selectingFiles, false);
    }
  };

  function addDragAndDropListeners(dropzone) {
    if (dropzone) {
      dropzone.addEventListener("dragenter", handleDragEnter, false);
      dropzone.addEventListener("dragover", handleDragOver, false);
      dropzone.addEventListener("dragleave", handleDragLeave, false);
      dropzone.addEventListener("dragend", handleDragLeave, false);
      dropzone.addEventListener("drop", handleFileDrop, false);
    }
  };

  function removeClickListeners(clickable) {
    if (clickable) {
      clickable.removeEventListener("click", selectingFiles, false);
      clickable.removeEventListener("keypress", selectingFiles, false);
    }
  };

  function removeDragAndDropListeners(dropzone) {
    if (dropzone) {
      dropzone.removeEventListener("dragenter", handleDragEnter, false);
      dropzone.removeEventListener("dragover", handleDragOver, false);
      dropzone.removeEventListener("dragleave", handleDragLeave, false);
      dropzone.removeEventListener("dragend", handleDragLeave, false);
      dropzone.removeEventListener("drop", handleFileDrop, false);
    }
  };

  //check the selection and accept option to filter invalid file number or types
  function checkDroppable(files) {
    var validCnt = element.selectionMode != 'single' || files.length == 1;
    return validCnt? getAccepted(files) : validCnt;
  };

  function getDragEvent(event) {
    return (event instanceof DragEvent) ? event : event.originalEvent;
  };

  //don't add "oj-valid-drop" class here because
  //hover effect is lost when dragging over the upload text
  function handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
  };


  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();

    //NOTE: dragged files not available
    // event.dataTransfer.files = null (firefox)
    // event.dataTransfer.files.length = 0 (chrome and IE)
    // use dataTransfer.items.type intead
    var dragEvent = getDragEvent(event);
    var droppable = checkDroppable(dragEvent.dataTransfer.items);

    if (droppable) {
      // Explicitly show this is a copy.
      dragEvent.dataTransfer.dropEffect = "copy"; 
      $dropzone.addClass("oj-valid-drop");
    }
    else {
      // This is an invalid drop, show don't drop here cursor
      dragEvent.dataTransfer.dropEffect = "none"; 
    }
    return droppable;
  };

  function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    $dropzone.removeClass("oj-valid-drop");
  };

  function getFileNames(files) {
    var buf = "";
    if (files) {
      for (var i = 0; i < files.length; i++) {
        buf += files[i].name + " ";
      }
    }
    return buf;
  };

  function handleFileDrop(event) {
    var files = getDragEvent(event).dataTransfer.files;
    var droppable = checkDroppable(files);
    if (droppable) {
      //add files to upload queue
      handleFilesAdded(getDragEvent(event).dataTransfer.files, event);
    }
    else {
      oj.Logger.warn("oj-file-picker: Files " + getFileNames(files) + 
                     " are not acceptable.");
    }

    handleDragLeave(event);
  };

  function handleFilesAdded (files, oEvent) {
    var event = new CustomEvent("select", 
                                {detail: {'files': files,
                                          'originalEvent': oEvent}});
    element.dispatchEvent(event);
  };
};

oj.Composite.register('oj-file-picker', 
{
  "view": {"inline": pickerView}, 
  "viewModel": {"inline": pickerViewModel}, 
  "metadata": {"inline": pickerMetadata}
});


// Copyright (c) 2017, Oracle and/or its affiliates. All rights reserved.
/**
 * @ignore
 */

/**
 * This method queues up files for upload. It returns an array of ProgressItem objects. 
 * Each file corresponds to a ProgressItem object.
 * These items can be uploaded by calling the flush method.
 *
 * @method
 * @name queue
 * @memberof oj.FileUploadTransport
 * @instance
 * @param {FileList} fileList A list contains the File objects to be queued.
 * @returns {Array} an array of ProgressItem objects. 
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
 *
 * @example <caption>Upload all queued files</caption>
 *
 * var uploadTransport = new oj.FileUploadTransport();
 * uploadTransport.queue(fileList); 
 * transport.flush();
 *
 */



});
