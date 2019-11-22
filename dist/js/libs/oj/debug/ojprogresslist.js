/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */


define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojcomposite', 'ojs/ojknockouttemplateutils', 'ojs/ojcomponentcore', 'ojs/ojlistview', 'ojs/ojprogress'], 
function(oj, $, ko, Composite, KnockoutTemplateUtils)
{
  "use strict";
var __oj_progress_list_metadata = 
{
  "properties": {
    "data": {
      "type": "object"
    }
  },
  "methods": {
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};


/* jslint browser: true,devel:true*/
/**
 * This interface defines the API for oj.ProgressItem.
 * It can be implemented in order to the track progress and status of an arbitrary task
 * (e.g. a file being uploaded)
 *
 * @export
 * @interface ProgressItem
 * @memberof oj
 * @since 4.0.0
 * @ojdeprecated {since: '8.0.0', description: '&lt;oj-progress-list> has been deprecated, please use &lt;oj-list-view> instead.'}
 *
 */
oj.ProgressItem = function () {
};

/**
 * Attach an event handler
 *
 * @method
 * @name addEventListener
 * @memberof oj.ProgressItem
 * @instance
 * @param {oj.ProgressItem.EventType} eventType eventType
 * @param {EventListener} listener The event listener to add.
 * @returns {void}
 *
 * @export
 */

/**
 * Detach an event handler
 *
 * @method
 * @name removeEventListener
 * @memberof oj.ProgressItem
 * @instance
 * @param {oj.ProgressItem.EventType} eventType eventType
 * @param {EventListener} listener The event listener to remove.
 * @returns {void}
 *
 * @export
 */

/**
 * ProgressItem status
 *
 * @export
 * @enum {string}
 * @memberof oj.ProgressItem
 */
oj.ProgressItem.Status = {
  /**
   * initial state before any progress events
   */
  QUEUED: 'queued',
  /**
   * upload is in progress
   */
  LOADSTARTED: 'loadstarted',
  /**
   * upload aborted
   */
  ABORTED: 'aborted',
  /**
   * upload failed
   */
  ERRORED: 'errored',
  /**
   * upload timeout
   */
  TIMEDOUT: 'timedout',
  /**
   * upload is completed
   */
  LOADED: 'loaded'
};

/**
 * ProgressItem event types
 *
 * @export
 * @enum {string}
 * @memberof oj.ProgressItem
 */
oj.ProgressItem.EventType = {
  /**
   * Triggered when the progress start
   */
  LOADSTART: 'loadstart',
  /**
   * Triggered for upload progress events.
   */
  PROGRESS: 'progress',
  /**
   * Triggered when an upload has been aborted.
   */
  ABORT: 'abort',
  /**
   * Triggered when an upload failed.
   */
  ERROR: 'error',
  /**
   * Triggered when an upload succeeded.
   */
  LOAD: 'load',
  /**
   * Triggered when timeout has passed before upload completed
   */
  TIMEOUT: 'timeout',
  /**
   * Triggered when an upload completed (success or failure).
   */
  LOADEND: 'loadend'
};



/* global ko */

/**
 * @ignore
 * @ojtsignore
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
 * @default null
 * @ojshortdesc Data used by the oj.ojProgressList
 */

/**
 * @ignore
 * @ojtsignore
 */
var progressItemMetadata =
  {
    properties: {
      data: {
        type: 'object'
      }
    }
  };

var progressItemView =
  "    <div class='oj-flex oj-sm-justify-content-space-between'>" +
  "      <div class='oj-flex-item oj-flex oj-sm-flex-direction-column'>" +
  "        <span data-bind='text: $properties.data.name' class='oj-progresslist-name'></span>" +
  "        <div data-bind='text: message' class='oj-progresslist-error-message'></div>" +
  '      </div>' +
  "      <div class='oj-flex oj-sm-align-items-center'>" +
  "        <oj-bind-slot name='itemInfo'>" +
  "          <div class='oj-flex-item oj-flex oj-progresslist-info'>" +
  "            <span data-bind='text: $data.getSizeInBKMGT($properties.data.size)'></span>" +
  '          </div>' +
  '        </oj-bind-slot>' +
  "        <div class='oj-flex-item oj-flex'>" +
  "          <oj-progress-status status='{{status}}'" +
  "                              progress='{{progress}}'>" +
  '          </oj-progress-status>' +
  '        </div>' +
  '      </div>' +
  '    </div>';


function progressItemViewModel(context) {
  var self = this;
  var handleUploadProgress;
  var handleUploadFail;
  var handleUploadDone;

  // Triggered for upload progress events. The event payload contains:
  // total: {integer} total number of bytes for the upload
  // loaded: {integer} number of bytes are loaded
  handleUploadProgress = function (event) {
    var item = event.target;
    if (item && event.lengthComputable) {
      self.status(oj.ProgressItem.Status.LOADSTARTED);
      self.progress(parseInt((event.loaded / event.total) * 100, 10));
    }
  };

  // Triggered when the upload fails (error, timeout or aborted).
  handleUploadFail = function (event) {
    var item = event.target;
    if (item) {
      self.message(event.error.message);
      self.status(oj.ProgressItem.Status.ERRORED);
      removeListeners(item);
    }
  };

  // Triggered when the upload is successfully completed.
  handleUploadDone = function (event) {
    var item = event.target;
    if (item) {
      self.status(oj.ProgressItem.Status.LOADED);
      removeListeners(item);
    }
  };

  self.status = ko.observable(oj.ProgressItem.Status.QUEUED);
  self.progress = ko.observable(-1);
  self.message = ko.observable('');

  // return size in B, KB, MB or GB
  var units = ['B', 'KB', 'MB', 'GB', 'TB'];
  self.getSizeInBKMGT = function (_bytes) {
    var bytes = _bytes;
    if (isNaN(bytes)) {
      return null;
    }

    var i;
    for (i = 0; bytes >= 1024 && i < 4; i++) {
      bytes /= 1024;
    }
    return bytes.toFixed(2) + units[i];
  };

  function addListeners(item) {
    item.addEventListener(oj.ProgressItem.EventType.PROGRESS, handleUploadProgress);
    item.addEventListener(oj.ProgressItem.EventType.ERROR, handleUploadFail);
    item.addEventListener(oj.ProgressItem.EventType.TIMEOUT, handleUploadFail);
    item.addEventListener(oj.ProgressItem.EventType.ABORT, handleUploadFail);
    item.addEventListener(oj.ProgressItem.EventType.LOAD, handleUploadDone);
  }

  function removeListeners(item) {
    item.removeEventListener(oj.ProgressItem.EventType.PROGRESS, handleUploadProgress, false);
    item.removeEventListener(oj.ProgressItem.EventType.ERROR, handleUploadFail, false);
    item.removeEventListener(oj.ProgressItem.EventType.TIMEOUT, handleUploadFail, false);
    item.removeEventListener(oj.ProgressItem.EventType.ABORT, handleUploadFail, false);
    item.removeEventListener(oj.ProgressItem.EventType.LOAD, handleUploadDone, false);
  }

  // Add listeners after the listeners have been defined
  addListeners(context.properties.data);
}

// eslint-disable-next-line no-undef
Composite.register('oj-progress-item',
  {
    view: progressItemView,
    viewModel: progressItemViewModel,
    metadata: progressItemMetadata
  });


/* global KnockoutTemplateUtils:false */
/**
 * @ojcomponent oj.ojProgressList
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @since 4.0.0
 * @ojdeprecated {since: '8.0.0', description: 'Please use &lt;oj-list-view> instead.'}
 * @ojdisplayname Progress List
 * @ojshortdesc A progress list displays a list of items and their progress, it is most commonly used in conjunction with a file picker to display file upload progress.
 *
 * @class oj.ojProgressList
 * @ojsignature {target: "Type", value:"class ojProgressList extends JetElement<ojProgressListSettableProperties>"}
 *
 * @ojpropertylayout {propertyGroup: "data", items: ["data"]}
 * @ojvbdefaultcolumns 4
 * @ojvbmincolumns 1
 *
 * @classdesc
 * <h3 id="progressListOverview-section">
 *   JET ProgressList
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#progressListOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>Display a <code class="prettyprint">ListView</code> where the data is a <code class="prettyprint">DataProvider</code> or
 * <code class="prettyprint">TableDataSource</code> and data rows are <code class="prettyprint">ProgressItem</code>s.
 * <p>Please see the <code class="prettyprint">ListView</code> for Touch and Keyboard End User Information</p>
 *
 * <p>See {@link oj.ojListView}</p>
 * <p>See {@link oj.DataProvider}</p>
 * <p>See {@link oj.TableDataSource}</p>
 * <p>See {@link oj.ProgressItem}</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-progress-list data='{{dataProvider}}'>
 * &lt;/oj-progress-list>
 * </code>
 * </pre>
 */

/**
 * Data used by the ProgressList.
 * @member
 * @name data
 * @memberof oj.ojProgressList
 * @instance
 * @ojshortdesc Data used by the ProgressList.
 * @type {Object|null}
 * @ojsignature [{target: "Type", value: "oj.DataProvider<any, any>|null"},
 *               {target: "Type", value: "oj.DataProvider|oj.TableDataSource|null", consumedBy:"js"}]
 *
 * @default null
 *
 * @example <caption>Initialize the progress list with the <code class="prettyprint">data</code> attribute specified:</caption>
 * &lt;oj-progress-list data='{{dataProvider}}'>&lt;/oj-progress-list>
 *
 * @example <caption>Get or set the <code class="prettyprint">data</code> property after initialization:</caption>
 * // getter
 * var dataValue = myProgressList.data;
 *
 * // setter
 * myProgressList.data = dataProvider;
 */

var progressListView =
  "<oj-list-view data-bind=\"attr: {id: $unique + '_list'}\"" +
  "              aria-label='list using array'" +
  "              data='{{$properties.data}}'" +
  "              item.renderer='{{renderer()}}'" +
  "              selection-mode='single'>" +
  '</oj-list-view>' +
  '' +
  "<script type='text/html' data-bind=\"attr: {id: tempId}\">" +
  "  <li class='oj-progresslist-item' tabindex='0'>" +
  "    <oj-progress-item data='{{$data}}'>" +
  '    </oj-progress-item>' +
  '  </li>' +
  '</script>';

function progressListViewModel(context) {
  var self = this;
  self.tempId = context.unique + '_templ';

  self.renderer = function () {
    return KnockoutTemplateUtils.getRenderer(self.tempId, true);
  };
}

/* global __oj_progress_list_metadata */
// eslint-disable-next-line no-undef
Composite.register('oj-progress-list',
  {
    view: progressListView,
    viewModel: progressListViewModel,
    metadata: __oj_progress_list_metadata
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
 * @return {any}
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
 * @return {void}
 *
 * @expose
 * @memberof oj.ojProgressList
 * @instance
 *
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 */



/**
 * @ignore
 * @ojtsignore
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
 * @default null
 * @ojshortdesc Data used by the file upload progress status.
 */

/**
 * @ignore
 * @ojtsignore
 */
var progressStatusMetadata =
  {
    properties: {
      status: {
        type: 'string'
      },
      progress: {
        type: 'number'
      }
    }
  };

var progressStatusView =
  "  <div data-bind='visible: ($properties.status == \"queued\")'" +
  "       class='oj-progressstatus-cell'>" +
  "    <div class='oj-component-icon oj-progressstatus-cancel-icon'" +
  "         role='img' title='cancel'></div>" +
  '  </div>' +
  "  <div data-bind='visible: ($properties.status == \"loadstarted\")'" +
  "       class='oj-progressstatus-cell'>" +
  "    <oj-progress type='circle' value='{{$properties.progress}}'>" +
  '    </oj-progress>' +
  '  </div>' +
  "  <div data-bind='visible: ($properties.status == \"loaded\")'" +
  "       class='oj-progressstatus-cell'>" +
  "    <div class='oj-component-icon oj-progressstatus-done-icon' role='img' title='done'></div>" +
  '  </div>' +
  "  <div data-bind='visible: ($properties.status == \"errored\" || $properties.status == \"timedout\" || $properties.status == \"aborted\")'" +
  "       class='oj-progressstatus-cell'>" +
  "    <div class='oj-component-icon oj-progressstatus-error-icon' role='img' title='error'></div>" +
  '  </div>';


// eslint-disable-next-line no-undef
Composite.register('oj-progress-status',
  {
    view: progressStatusView,
    metadata: progressStatusMetadata
  });

});