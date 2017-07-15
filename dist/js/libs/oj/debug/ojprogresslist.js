/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojcomponentcore', 'ojs/ojprogresslistdatasource', 'ojs/ojlistview', 'ojs/ojprogressbar', 'ojs/ojcomposite'], 
       function(oj, $, ko)
{


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ignore
 * @ojcomponent oj.ojProgressStatus
 * @since 4.0.0
 * @classdesc Display a progress and status icon when ended. The property data is a <code class="prettyprint">ProgressItem</code>.
 */

/**
 * @member
 * @name data
 * @memberof oj.ojProgressStatus
 * @instance
 * @type {null|oj.ProgressItem}
 * @default <code class="prettyprint">null</code>
 * @desc Data used by the file upload progress status.
 */

/**
 * @ignore
 */
var progressStatusMetadata =
{
  "properties": {
    "status": {
      "type": "string"
    },
    "progress": {
      "type": "number"
    }
  }
};

var progressStatusView = 
  "  <div data-bind='visible: ($props.status == \"queued\")'" +
  "       class='oj-progressstatus-cell'>" +
  "    <div class='oj-component-icon oj-progressstatus-cancel-icon'" + 
  "         role='img' title='cancel'></div>" +
  "  </div>" +
  "  <div data-bind='visible: ($props.status == \"loadstarted\")'" +
  "       class='oj-progressstatus-cell'>" +
  "    <oj-progress type='circle' value='{{$props.progress}}'>" +
  "    </oj-progress>" +
  "  </div>" +
  "  <div data-bind='visible: ($props.status == \"loaded\")'" +
  "       class='oj-progressstatus-cell'>" +
  "    <div class='oj-component-icon oj-progressstatus-done-icon' role='img' title='done'></div>" +
  "  </div>" +
  "  <div data-bind='visible: ($props.status == \"errored\" || $props.status == \"timedout\" || $props.status == \"aborted\")'" +
  "       class='oj-progressstatus-cell'>" +
  "    <div class='oj-component-icon oj-progressstatus-error-icon' role='img' title='error'></div>" +
  "  </div>";

oj.Composite.register('oj-progress-status', 
{
  "view": {"inline": progressStatusView}, 
  "metadata": {"inline": progressStatusMetadata}
});


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ignore
 * @ojcomponent oj.ojProgressList
 * @since 4.0.0
 * @classdesc Display a <code class="prettyprint">ListView</code> where the data is a <code class="prettyprint">ProgressListDataSource</code> and data rows are <code class="prettyprint">ProgressItem</code>s with ko data-bind progress, status and message.
 */

/**
 * @member
 * @name data
 * @memberof oj.ojProgressList
 * @instance
 * @type {null|oj.ProgressListDataSource}
 * @default <code class="prettyprint">null</code>
 * @desc Data used by the file upload progress list.
 */

/**
 * @ignore
 */
var progressListMetadata =
{
  "properties": {
    "data": {
      "type": "object"
    }
  }
};

var progressListView = 
  "<oj-list-view data-bind=\"attr: {id: $unique + '_list'}\"" +
  "              aria-label='list using array'" +
  "              data='{{$props.data}}'" +
  "              item.renderer='{{renderer()}}'" +
  "              selection-mode='single'>" +
  "</oj-list-view>" +
  "" +
  "<script type='text/html' data-bind=\"attr: {id: tempId}\">" +
  "  <li class='oj-progresslist-item' tabindex='0'>" +
  "    <oj-progress-item data='{{$data}}'>" +
  "    </oj-progress-item>" +
  "  </li>" +
  "</script>";

function progressListViewModel (context) {
  var self = this;
  self['tempId'] = context.unique + '_templ';

  self['renderer'] = function() {
    return oj.KnockoutTemplateUtils.getRenderer(self['tempId'], true);
  };
}

oj.Composite.register('oj-progress-list', 
{
  "view": {"inline": progressListView}, 
  "viewModel": {"inline": progressListViewModel}, 
  "metadata": {"inline": progressListMetadata}
});


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ignore
 * @ojcomponent oj.ojProgressItem
 * @since 4.0.0
 * @classdesc Display a progress and status icon when ended. The property data is a <code class="prettyprint">ProgressItem</code>.
 */

/**
 * @member
 * @name data
 * @memberof oj.ojProgressItem
 * @instance
 * @type {null|oj.ProgressItem}
 * @default <code class="prettyprint">null</code>
 * @desc Data used by the oj.ojProgressList
 */

/**
 * @ignore
 */
var progressItemMetadata =
{
  "properties": {
    "data": {
      "type": "object"
    }
  }
};

var progressItemView = 
  "    <div class='oj-flex oj-sm-justify-content-space-between'>" +
  "      <div class='oj-flex-item oj-flex oj-sm-flex-direction-column'>" +
  "        <span data-bind='text: $props.data.name' class='oj-progresslist-name'></span>" +
  "        <div data-bind='text: message' class='oj-progresslist-error-message'></div>" +
  "      </div>" +
  "      <div class='oj-flex oj-sm-align-items-center'>" +
  "        <oj-slot name='itemInfo'>" +
  "          <div class='oj-flex-item oj-flex oj-progresslist-info'>" +
  "            <span data-bind='text: $data.getSizeInBKMGT($props.data.size)'></span>" +
  "          </div>" +
  "        </oj-slot>" +
  "        <div class='oj-flex-item oj-flex'>" +
  "          <oj-progress-status status='{{status}}'" +
  "                              progress='{{progress}}'>" +
  "          </oj-progress-status>" +
  "        </div>" +
  "      </div>" +
  "    </div>";


function progressItemViewModel (context) {
  var self = this,
      element = context.element,
      handleUploadProgress,
      handleUploadFail,
      handleUploadDone;

  // Triggered for upload progress events. The event payload contains:
  // total: {integer} total number of bytes for the upload
  // loaded: {integer} number of bytes are loaded
  handleUploadProgress = function(event) {
    var item = event.target;
    if (item && event.lengthComputable) {
      self.status(oj.ProgressItem.Status['LOADSTARTED']);
      self.progress(parseInt(event.loaded / event.total * 100, 10));
    }
  };

  // Triggered when the upload fails (error, timeout or aborted).
  handleUploadFail = function(event) {
    var item = event.target;
    if (item) {
      self.message(event.error.message);
      self.status(oj.ProgressItem.Status['ERRORED']);
      removeListeners(item);
    }
  };

  // Triggered when the upload is successfully completed.
  handleUploadDone = function(event) {
    var item = event.target;
    if (item) {
      self.status(oj.ProgressItem.Status['LOADED']);
      removeListeners(item);
    }
  };

  // Composite lifecycle listener 
  self['bindingsApplied'] = function(context) {
    addListeners(element.data);
  };

  self['status'] = ko.observable(oj.ProgressItem.Status['QUEUED']);
  self['progress'] = ko.observable(-1);
  self['message'] = ko.observable("");

  // return size in B, KB, MB or GB
  var units = ['B', 'KB', 'MB', 'GB', 'TB'];
  self['getSizeInBKMGT'] = function(bytes) {
    if (isNaN(bytes))
      return null;

    var i;
    for (i = 0; bytes >= 1024 && i < 4; i++) {
      bytes /= 1024;
    }
    return bytes.toFixed(2) + units[i];
  };

  function addListeners(item) {
    item.addEventListener(oj.ProgressItem.EventType['PROGRESS'], handleUploadProgress);
    item.addEventListener(oj.ProgressItem.EventType['ERROR'], handleUploadFail);
    item.addEventListener(oj.ProgressItem.EventType['TIMEOUT'], handleUploadFail);
    item.addEventListener(oj.ProgressItem.EventType['ABORT'], handleUploadFail);
    item.addEventListener(oj.ProgressItem.EventType['LOAD'], handleUploadDone);
  };

  function removeListeners(item) {
    item.removeEventListener(oj.ProgressItem.EventType['PROGRESS'], handleUploadProgress, false);
    item.removeEventListener(oj.ProgressItem.EventType['ERROR'], handleUploadFail, false);
    item.removeEventListener(oj.ProgressItem.EventType['TIMEOUT'], handleUploadFail, false);
    item.removeEventListener(oj.ProgressItem.EventType['ABORT'], handleUploadFail, false);
    item.removeEventListener(oj.ProgressItem.EventType['LOAD'], handleUploadDone, false);
  };
}

oj.Composite.register('oj-progress-item', 
{
  "view": {"inline": progressItemView}, 
  "viewModel": {"inline": progressItemViewModel}, 
  "metadata": {"inline": progressItemMetadata}
});


});
