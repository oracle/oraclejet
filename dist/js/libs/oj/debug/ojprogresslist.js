/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojcomponentcore', 'ojs/ojlistview', 'ojs/ojprogress', 'ojs/ojcomposite'], 
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

/*jslint browser: true,devel:true*/
/**
 * This interface defines the API for oj.ProgressItem.
 * It can be implemented in order to the track progress and status of an arbitrary task
 * (e.g. a file being uploaded)
 *
 * @export
 * @interface ProgressItem
 * @memberof oj
 * @since 4.0.0
 * @ojstatus preview
 */
oj.ProgressItem = function() {
};

/**
 * Attach an event handler
 *

 * @method
 * @name addEventListener
 * @memberof! oj.ProgressItem
 * @instance
 * @param {string} eventType eventType
 * @param {function(Object)} eventHandler event handler function
 *
 * @export
 */

/**
 * Detach an event handler
 *
 * @method
 * @name removeEventListener
 * @memberof! oj.ProgressItem
 * @instance
 * @param {string} eventType eventType
 * @param {function(Object)} eventHandler event handler function
 *
 * @export
 */

/**
 * @export
 * Status
 * @enum {string}
 */
oj.ProgressItem.Status = {
  /**
   * initial state before any progress events
   */
  'QUEUED': 'queued',
  /**
   * upload is in progress
   */
  'LOADSTARTED': 'loadstarted',
  /**
   * upload aborted
   */
  'ABORTED': 'aborted',
  /**
   * upload failed
   */
  'ERRORED': 'errored',
  /**
   * upload timeout
   */
  'TIMEDOUT': 'timedout',
  /**
   * upload is completed
   */
  'LOADED': 'loaded'
};

/**
 * @export
 * Event types
 * @enum {string}
 */
oj.ProgressItem.EventType = {
  /**
   * Triggered when the progress start
   */
  'LOADSTART': 'loadstart',
  /**
   * Triggered for upload progress events.
   */
  'PROGRESS': 'progress',
  /**
   * Triggered when an upload has been aborted.
   */
  'ABORT': 'abort',
  /**
   * Triggered when an upload failed.
   */
  'ERROR': 'error',
  /**
   * Triggered when an upload succeeded.
   */
  'LOAD': 'load',
  /**
   * Triggered when timeout has passed before upload completed
   */
  'TIMEOUT': 'timeout',
  /**
   * Triggered when an upload completed (success or failure).
   */
  'LOADEND': 'loadend'
};

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojProgressList
 * @since 4.0.0
 * @ojstatus preview
 *
 * @classdesc 
 * <h3 id="progressListOverview-section">
 *   JET ProgressList
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#progressListOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>Display a <code class="prettyprint">ListView</code> where the data is a <code class="prettyprint">TableDataSource</code> and data rows are <code class="prettyprint">ProgressItem</code>s with ko data-bind progress, status and message. Please see the <code class="prettyprint">ListView</code> for Touch and Keyboard End User Information</p>
 *
 * <p>See {@link oj.ojListView}</p>
 * <p>See {@link oj.TableDataSource}</p>
 * <p>See {@link oj.ProgressItem}</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-progress-list data='{{dataSource}}'>
 * &lt;/oj-progress-list>
 * </code>
 * </pre>
 */

/**
 * @member
 * @name data
 * @memberof oj.ojProgressList
 * @instance
 * @type {null|oj.TableDataSource}
 * @default <code class="prettyprint">null</code>
 * @desc Data used by the file upload progress list.
 *
 * @example <caption>Initialize the progress list with the <code class="prettyprint">data</code> attribute specified:</caption>
 * &lt;oj-progress-list data='{{dataSource}}'>&lt;/oj-progress-list>
 * 
 * @example <caption>Get or set the <code class="prettyprint">data</code> property after initialization:</caption>
 * // getter
 * var dataValue = myProgressList.data;
 * 
 * // setter
 * myProgressList.data = dataSource;
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
 * Sets a property or a single subproperty for complex properties and notifies the component
 * of the change, triggering a [property]Changed event.
 * 
 * @function setProperty
 * @param {string} property - The property name to set. Supports dot notation for subproperty access.
 * @param {*} value - The new value to set the property to.
 * 
 * @expose
 * @memberof oj.ojProgressList
 * @instance
 * 
 * @example <caption>Set a single subproperty of a complex property:</caption>
 * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
 */ 
/**
 * Retrieves a value for a property or a single subproperty for complex properties.
 * @function getProperty
 * @param {string} property - The property name to get. Supports dot notation for subproperty access.
 * @return {*}
 * 
 * @expose
 * @memberof oj.ojProgressList
 * @instance
 * 
 * @example <caption>Get a single subproperty of a complex property:</caption>
 * var subpropValue = myComponent.getProperty('complexProperty.subProperty1.subProperty2');
 */ 
/**
 * Performs a batch set of properties.
 * @function setProperties
 * @param {Object} properties - An object containing the property and value pairs to set.
 * 
 * @expose
 * @memberof oj.ojProgressList
 * @instance
 * 
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 */ 
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

  // The props field on context is a Promise. Once that resolves,
  // we can access the properties data that were defined in the composite metadata
  // and add listeners
  context.props.then(function(properties) {
    addListeners(properties.data);
  });

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
