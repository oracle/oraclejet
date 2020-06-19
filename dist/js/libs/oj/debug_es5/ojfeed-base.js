/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdataproviderscroller', 'ojs/ojcontext'], function(oj, $, Components, List, Context)
{
  "use strict";



/* global List:false */

/**
 * Base class IteratingDataProviderContentHandler for Feed components (ActivityStream and Masonry)
 * @constructor
 * @ignore
 */
var FeedDataProviderContentHandler = function FeedDataProviderContentHandler(widget, root, data) {
  FeedDataProviderContentHandler.superclass.constructor.call(this, widget, root, data);
}; // Subclass from oj.Object


oj.Object.createSubclass(FeedDataProviderContentHandler, List.IteratingDataProviderContentHandler, 'FeedDataProviderContentHandler');
/**
 * Initializes the instance.
 * @protected
 */

FeedDataProviderContentHandler.prototype.Init = function () {
  FeedDataProviderContentHandler.superclass.Init.call(this);
};
/**
 * Sets aria properties on root
 * @override
 */


FeedDataProviderContentHandler.prototype.setRootAriaProperties = function () {
  this.m_root.setAttribute('role', 'feed');
  this.m_root.setAttribute('aria-busy', 'false');
  var self = this;
  this.getDataProvider().getTotalSize().then(function (size) {
    self.m_totalSize = size;
  });
};
/**
 * @protected
 * @override
 */


FeedDataProviderContentHandler.prototype.GetChildElementTagName = function () {
  return 'DIV';
};
/**
 * @override
 */


FeedDataProviderContentHandler.prototype.handleBeforeFetch = function () {
  this.m_root.setAttribute('aria-busy', 'true');
};
/**
 * Handles fetched data initiated by the DomScroller (scroll and fetch, or checkViewport)
 * @override
 */


FeedDataProviderContentHandler.prototype.handleDomScrollerFetchedData = function (result) {
  this.m_root.setAttribute('aria-busy', 'false');
  FeedDataProviderContentHandler.superclass.handleDomScrollerFetchedData.call(this, result);
};
/**
 * @override
 */


FeedDataProviderContentHandler.prototype.afterRenderItem = function (item, context) {
  // save the key in the element (cannot use data- here since it could be a non-string)
  // eslint-disable-next-line no-param-reassign
  item.key = context.key;
  item.setAttribute('role', 'article');
  item.setAttribute('tabIndex', 0);
  item.classList.add(this.m_widget.getItemElementStyleClass());
};
/**
 * Not relevant for Feed component but need to explicitly turn it off.
 * @override
 */
// eslint-disable-next-line no-unused-vars


FeedDataProviderContentHandler.prototype.isSelectionEnabled = function (context) {
  return false;
};
/**
 * Not relevant for Feed component but need to explicitly turn it off.
 * @override
 */
// eslint-disable-next-line no-unused-vars


FeedDataProviderContentHandler.prototype.isFocusable = function (context) {
  return false;
};
/**
 * Not relevant for Feed component but need to explicitly turn it off.
 * @override
 */
// eslint-disable-next-line no-unused-vars


FeedDataProviderContentHandler.prototype.isSelectable = function (context) {
  return false;
};
/**
 * Not relevant for Feed component but need to explicitly turn it off.
 * @override
 */


FeedDataProviderContentHandler.prototype.isCardLayout = function () {
  return false;
};
/**
 * Not relevant for Feed component but need to explicitly turn it off.
 * @override
 */


FeedDataProviderContentHandler.prototype.shouldUseGridRole = function () {
  return false;
};
/**
 * Not relevant for Feed component but need to explicitly turn it off.
 * @override
 */


FeedDataProviderContentHandler.prototype.disableAllTabbableElements = function () {};



/* global Components:false, Promise:false, Context:false */

/**
 * @ojcomponent oj.feedBaseComponent
 * @augments oj.baseComponent
 * @since 8.0.0
 * @abstract
 * @hideconstructor
 */
oj.__registerWidget('oj.feedBaseComponent', $.oj.baseComponent, {
  /**
   * Create the component
   * @override
   * @memberof oj.feedBaseComponent
   * @protected
   */
  _ComponentCreate: function _ComponentCreate() {
    this._super();

    this._setup();
  },

  /**
   * @private
   */
  _setup: function _setup() {
    var self = this;
    this.TAB_KEY = 9;
    this.PAGEUP_KEY = 33;
    this.PAGEDOWN_KEY = 34;

    this._on(this.element, {
      keydown: function keydown(event) {
        self.HandleKeyDown(event);
      }
    });

    this.readinessStack = [];
  },

  /**
   * Sets up resources needed by this component
   * @memberof! oj.feedBaseComponent
   * @instance
   * @override
   * @protected
   */
  _SetupResources: function _SetupResources() {
    this._super();

    this.InitContentHandler();
  },

  /**
   * Release resources held by this component
   * @memberof! oj.feedBaseComponent
   * @instance
   * @override
   * @protected
   * @ignore
   */
  _ReleaseResources: function _ReleaseResources() {
    this._super();

    this.DestroyContentHandler();
  },

  /**
   * Initialize ContentHandler(s)
   * @protected
   * @ignore
   */
  InitContentHandler: function InitContentHandler() {},

  /**
   * Uninitialize ContentHandler(s)
   * @protected
   * @ignore
   */
  DestroyContentHandler: function DestroyContentHandler() {},

  /**
   * Override to do the delay connect/disconnect
   * @memberof oj.feedBaseComponent
   * @override
   * @protected
   */
  _VerifyConnectedForSetup: function _VerifyConnectedForSetup() {
    return true;
  },

  /**
   * Refresh
   * @memberof! oj.feedBaseComponent
   * @instance
   * @override
   */
  refresh: function refresh() {
    // reset content and ready state
    this.DestroyContentHandler(); // recreate the content handler

    this.InitContentHandler();
  },

  /**
   * Destroy this component
   * @memberof! oj.feedBaseComponent
   * @private
   */
  _destroy: function _destroy() {
    this._super();
  },

  /**
   * Returns widget constructor.  Used by ContentHandler
   * @ignore
   */
  getWidgetConstructor: function getWidgetConstructor() {
    return Components.__GetWidgetConstructor(this.element);
  },

  /**
   * @private
   */
  _getCurrentArticle: function _getCurrentArticle() {
    var focusElem = document.activeElement;
    return focusElem.closest('.' + this.getItemStyleClass());
  },

  /**
   * Event handler for when user press down a key
   * @param {Event} event keydown event
   * @protected
   * @ignore
   */
  HandleKeyDown: function HandleKeyDown(event) {
    var keyCode = event.keyCode;

    if (keyCode === this.PAGEUP_KEY || keyCode === this.PAGEDOWN_KEY) {
      var current = this._getCurrentArticle();

      if (current) {
        var next = keyCode === this.PAGEUP_KEY ? current.previousElementSibling : current.nextElementSibling;

        if (next) {
          // so browser won't process page up/down
          event.preventDefault();
          next.focus();
        }
      }
    }
  },

  /** ********************* ContentHandler callback methods **************************** **/

  /**
   * Called by content handler once content of all items are rendered
   * @ignore
   */
  renderComplete: function renderComplete() {},

  /**
   * Retrieves the root element
   * Invoke by widget
   * @protected
   * @return {jQuery} root element
   * @ignore
   */
  GetRootElement: function GetRootElement() {
    return this.element;
  },

  /**
   * Displays the 'fetching' status message
   * @protected
   * @ignore
   */
  showStatusText: function showStatusText() {},

  /**
   * Hide the 'fetching' status message
   * @protected
   * @ignore
   */
  hideStatusText: function hideStatusText() {},

  /**
   * Whether high-watermark scrolling is specified
   * @protected
   * @ignore
   */
  isLoadMoreOnScroll: function isLoadMoreOnScroll() {
    return this.option('scrollPolicy') !== 'loadAll';
  },

  /**
   * Update role status text to reflect that it is fetching data
   * @private
   */
  updateStatusFetchStart: function updateStatusFetchStart() {},

  /**
   * Update role status text to reflect that fetched items are added to the end
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  updateStatusFetchEnd: function updateStatusFetchEnd(count) {},

  /**
   * Called by content handler once the content of an item is rendered triggered by an insert event
   * @ignore
   */
  BeforeInsertItem: function BeforeInsertItem() {// hook for subclass
  },

  /**
   * Called by content handler once the content of an item is removed triggered by an remove event
   * @param {Element} elem the item element
   * @param {boolean} restoreFocus true if focus should be restore, false otherwise
   * @ignore
   */
  // eslint-disable-next-line no-unused-vars
  itemRemoveComplete: function itemRemoveComplete(elem, restoreFocus) {// hook for subclass
  },

  /**
   * Gets the item renderer
   * @return {function(Object)|null} returns the item renderer
   * @private
   */
  _getItemRenderer: function _getItemRenderer() {
    return null;
  },
  getItemTemplateName: function getItemTemplateName() {
    return 'itemTemplate';
  },

  /**
   * Returns the inline template element inside oj-list-view
   * @return {Element|null} the inline tmeplate element
   * @protected
   * @ignore
   */
  getItemTemplate: function getItemTemplate() {
    if (this.m_template === undefined) {
      // cache the template, assuming replacing template will require refresh
      this.m_template = this.getTemplate(this.getItemTemplateName());
    }

    return this.m_template;
  },

  /**
   * Gets the template element by slot name
   * @protected
   * @ignore
   */
  getTemplate: function getTemplate(name) {
    if (this._IsCustomElement()) {
      var slotMap = oj.BaseCustomElementBridge.getSlotMap(this.element[0]);
      var slot = slotMap[name];

      if (slot && slot.length > 0 && slot[0].tagName.toLowerCase() === 'template') {
        return slot[0];
      }
    }

    return null;
  },

  /**
   * Compose a description for busy state
   * @param {string} description the description
   * @return {string} the busy state description
   * @private
   */
  _getBusyDescription: function _getBusyDescription(description) {
    var id = this.GetRootElement().attr('id');
    return "The component identified by '" + id + "', " + description;
  },

  /**
   * Invoke whenever a task is started. Moves the component out of the ready state if necessary.
   * @param {string=} description the description of the task
   * @protected
   * @ignore
   */
  signalTaskStart: function signalTaskStart(description) {
    var self = this;

    if (this.readinessStack) {
      if (this.readinessStack.length === 0) {
        this.readyPromise = new Promise(function (resolve) {
          self.readyResolve = resolve;
        }); // whenReady is deprecated in favor of page busystate (but we still need to support old syntax)

        var busyContext = Context.getContext(this.element[0]).getBusyContext();
        var options = description != null ? {
          description: this._getBusyDescription(description)
        } : {};
        self.busyStateResolve = busyContext.addBusyState(options);
      }

      this.readinessStack.push(description != null ? description : 'unknown task');
    }
  },

  /**
   * Invoke whenever a task finishes. Resolves the readyPromise if component is ready to move into ready state.
   * @protected
   * @ignore
   */
  signalTaskEnd: function signalTaskEnd() {
    if (this.readinessStack && this.readinessStack.length > 0) {
      this.readinessStack.pop();

      if (this.readinessStack.length === 0) {
        this.readyResolve(null); // whenReady is deprecated in favor of page busystate (but we still need to support old syntax)

        this.busyStateResolve(null);
        this.busyStateResolve = null;
      }
    }
  },

  /**
   * Whether ListView should refresh if certain option is updated
   * @param {Object} options the options to check
   * @return {boolean} true if should refresh, false otherwise
   * @protected
   * @ignore
   */
  ShouldRefresh: function ShouldRefresh(options) {
    return options.data != null || options.item != null || options.scrollPolicy != null || options.scrollPolicyOptions != null;
  },

  /**
   * Clear any cache that are associated with items in the feed
   * @protected
   * @ignore
   */
  ClearCache: function ClearCache() {},

  /** ************************** private methods ************************** **/

  /**
   * Sets multiple options
   * @param {Object} options the options object
   * @param {Object} flags additional flags for option
   * @override
   * @private
   */
  _setOptions: function _setOptions(options, flags) {
    this._super(options, flags);

    if (this.ShouldRefresh(options)) {
      this.refresh();
    }
  }
});

;return FeedDataProviderContentHandler;
});