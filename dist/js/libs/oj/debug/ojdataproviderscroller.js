/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'jquery', 'ojs/ojcontext', 'ojs/ojdatacollection-common', 'ojs/ojconfig', 'ojs/ojanimation', 'ojs/ojlogger', 'ojs/ojdomscroller', 'ojs/ojset', 'ojs/ojmap'], function (exports, oj, $, Context, DataCollectionUtils, Config, AnimationUtils, Logger, DomScroller, KeySet, KeyMap) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;
  DomScroller = DomScroller && Object.prototype.hasOwnProperty.call(DomScroller, 'default') ? DomScroller['default'] : DomScroller;
  KeySet = KeySet && Object.prototype.hasOwnProperty.call(KeySet, 'default') ? KeySet['default'] : KeySet;
  KeyMap = KeyMap && Object.prototype.hasOwnProperty.call(KeyMap, 'default') ? KeyMap['default'] : KeyMap;

  /**
   * Base class for IteratingDataProviderContentHandler and TreeDataProviderContentHandler
   * Handler for DataProvider generated content
   * @constructor
   * @ignore
   */
  var DataProviderContentHandler = function (widget, root, data) {
    this.m_root = root;
    this.m_widget = widget;

    this.m_fetching = false;

    this.setDataProvider(data);
    this.Init();
  };
  // Subclass from oj.Object
  oj.Object.createSubclass(DataProviderContentHandler, oj.Object, 'DataProviderContentHandler');

  /**
   * Initializes the instance.
   * @export
   */
  DataProviderContentHandler.prototype.Init = function () {
    DataProviderContentHandler.superclass.Init.call(this);
  };

  /**
   * Handles when the listview is shown due to for example CSS changes (inside a dialog)
   */
  DataProviderContentHandler.prototype.notifyShown = function () {
    // by default do nothing, to be override by subclass
  };

  /**
   * Handles when the listview is re-attached to the DOM (ex: when a children of CCA gets re-attached from slotting)
   */
  DataProviderContentHandler.prototype.notifyAttached = function () {
    // by default do nothing, to be override by subclass
  };

  /**
   * Cleanse all items under the root node
   */
  DataProviderContentHandler.prototype.cleanItems = function (templateEngine, parent) {
    if (templateEngine === undefined) {
      // eslint-disable-next-line no-param-reassign
      templateEngine = this.getTemplateEngine();
    }

    if (parent === undefined) {
      // eslint-disable-next-line no-param-reassign
      parent = this.m_root;
    }

    if (templateEngine && parent) {
      var children = parent.childNodes;
      for (var i = 0; i < children.length; i++) {
        templateEngine.clean(children[i]);
      }
    }
  };

  /**
   * Destroy the content handler
   * @protected
   */
  DataProviderContentHandler.prototype.Destroy = function (completelyDestroy) {
    // this.m_root was changed in RenderContent
    if (this.m_superRoot != null) {
      this.m_root = this.m_superRoot;
    }

    this.cleanItems();
    if (completelyDestroy) {
      $(this.m_root).empty();
    }
    this._destroySparkles();
    this.m_widget = null;
    this.m_root = null;
    this.m_superRoot = null;
  };

  /**
   * Determines whether the content handler is in a ready state
   * @return {boolean} true if there's no outstanding fetch, false otherwise.
   * @protected
   */
  DataProviderContentHandler.prototype.IsReady = function () {
    return !this.m_fetching;
  };

  /**
   * Sets any aria attributes on the root element
   * @protected
   */
  DataProviderContentHandler.prototype.setRootAriaProperties = function () {
    if (this.shouldUseGridRole()) {
      this.m_root.setAttribute('role', 'grid');
    } else if (this.IsHierarchical()) {
      this.m_root.setAttribute('role', 'tree');
    } else {
      this.m_root.setAttribute('role', 'listbox');
    }
  };

  /**
   * Renders the content inside the list
   * @protected
   */
  DataProviderContentHandler.prototype.RenderContent = function () {
    this.signalTaskStart('rendering content'); // signal method task start

    this.setRootAriaProperties();
    this.fetchRows(false);
    this.signalTaskEnd(); // signal method task end
  };

  /**
   * Retrieve the key given the item element
   * @param {Element} element
   * @return {Object|null}
   * @protected
   */
  DataProviderContentHandler.prototype.GetKey = function (element) {
    // should be in the element
    return element.key;
  };

  DataProviderContentHandler.prototype.FindElementByKey = function (key) {
    // the later selector is for cards that are in the process of insert animation
    var children = this.m_root.querySelectorAll(
      '.' +
        this.m_widget.getItemElementStyleClass() +
        ', .oj-listview-temp-item.oj-listview-card-animated'
    );
    for (var i = 0; i < children.length; i++) {
      var elem = children[i];
      // use == for the string number compare case
      // make sure item is not marked for deletion or a clone created by dnd
      if (
        // eslint-disable-next-line eqeqeq
        (key == this.GetKey(elem) || oj.Object.compareValues(key, this.GetKey(elem))) &&
        !elem.classList.contains('oj-listview-item-remove') &&
        !elem.classList.contains('oj-drop')
      ) {
        return elem;
      }
    }

    return null;
  };

  DataProviderContentHandler.prototype.getDataProvider = function () {
    return this.m_dataProvider;
  };

  /**
   * @protected
   */
  DataProviderContentHandler.prototype.setDataProvider = function (dataProvider) {
    this._removeDataSourceEventListeners();

    if (dataProvider != null) {
      this.m_handleModelMutateEventListener = this.handleModelMutateEvent.bind(this);
      this.m_handleModelRefreshEventListener = this.handleModelRefreshEvent.bind(this);

      dataProvider.addEventListener('mutate', this.m_handleModelMutateEventListener);
      dataProvider.addEventListener('refresh', this.m_handleModelRefreshEventListener);
    }

    this.m_dataProvider = dataProvider;
  };

  /**
   * Remove data source event listeners
   * @private
   */
  DataProviderContentHandler.prototype._removeDataSourceEventListeners = function () {
    var dataProvider = this.getDataProvider();
    if (dataProvider != null) {
      dataProvider.removeEventListener('mutate', this.m_handleModelMutateEventListener);
      dataProvider.removeEventListener('refresh', this.m_handleModelRefreshEventListener);

      // If dataProvider is a TableDataSourceAdapter, call destroy on it also to remove its listeners
      if (oj.TableDataSourceAdapter && dataProvider instanceof oj.TableDataSourceAdapter) {
        dataProvider.destroy();
      }
    }
  };

  /**
   * Initiate loading of the template engine.  An error is thrown if the template engine failed to load.
   * @return {Promise} resolves to the template engine, or null if:
   *                   1) there's no need because no item template is specified
   *                   2) a renderer is present which takes precedence
   * @protected
   */
  DataProviderContentHandler.prototype.loadTemplateEngine = function () {
    if (this.m_widget.getItemTemplate() != null && this.m_widget._getItemRenderer() == null) {
      return new Promise((resolve) => {
        const templateOptions = {
          customElement: this.m_widget._GetCustomElement()
        };
        Config.__getTemplateEngine(templateOptions).then(
          (engine) => {
            this.m_engine = engine;
            resolve(engine);
          },
          (reason) => {
            throw new Error('Error loading template engine: ' + reason);
          }
        );
      });
    }

    return Promise.resolve(null);
  };

  /**
   * Retrieve the template engine, returns null if it has not been loaded yet
   */
  DataProviderContentHandler.prototype.getTemplateEngine = function () {
    return this.m_engine;
  };

  // eslint-disable-next-line no-unused-vars
  DataProviderContentHandler.prototype.fetchRows = function (forceFetch) {
    this.m_widget.showStatusText();
  };

  /**
   * Returns the tag name of the item element.
   * @return {string} the tag name of the item element.
   * @protected
   */
  DataProviderContentHandler.prototype.GetChildElementTagName = function () {
    return 'LI';
  };

  /**
   * Returns the insert before element given the index, or null if insert at the end.
   * @return {Element|null} the reference element.
   * @protected
   */
  DataProviderContentHandler.prototype.GetReferenceNode = function (parentElement, index) {
    if (index === -1) {
      return null;
    }

    var childElements = $(parentElement).children(
      '.' +
        this.m_widget.getItemElementStyleClass() +
        ', .' +
        this.m_widget.getEmptyTextStyleClass() +
        ', .oj-listview-temp-item'
    );
    return index === childElements.length ? null : childElements[index];
  };

  /**
   * Create a list item and add it to the list
   * @param {Element|DocumentFragment} parentElement the element to add the list items to
   * @param {number} index the index of the item
   * @param {Object|null} data the data for the item
   * @param {Object} metadata the set of metadata for the item
   * @param {Object} templateEngine the template engine to process inline template
   * @param {function(Element, Object)=} callback optional callback function to invoke after item is added
   * @return {Object} contains the list item and the context object
   * @return {Object} itemMetaData the array of metadata
   * @protected
   */
  DataProviderContentHandler.prototype.addItem = function (
    parentElement,
    index,
    data,
    metadata,
    templateEngine,
    callback,
    itemMetaData
  ) {
    var item = document.createElement(this.GetChildElementTagName()); // @HTMLUpdateOK

    $(item).uniqueId();
    var referenceNode = this.GetReferenceNode(parentElement, index);
    // should be optional
    if (this.m_widget.BeforeInsertItem) {
      this.m_widget.BeforeInsertItem();
    }
    parentElement.insertBefore(item, referenceNode); // @HTMLUpdateOK
    var position = $(parentElement).children().index(item);
    return this._addOrReplaceItem(
      item,
      position,
      parentElement,
      index,
      data,
      metadata,
      templateEngine,
      callback,
      false,
      itemMetaData
    );
  };

  /**
   * Replace an existing list item in the list
   * @param {Element} item the list item to change
   * @param {number} index the index of the item
   * @param {Object|null} data the data for the item
   * @param {Object} metadata the set of metadata for the item
   * @param {Object} templateEngine the template engine to process inline template
   * @param {function(Element, Object)} callback callback function to invoke after item is added
   * @param {boolean} restoreFocus flag to restore focus on updated item
   * @protected
   */
  DataProviderContentHandler.prototype.replaceItem = function (
    item,
    index,
    data,
    metadata,
    templateEngine,
    callback,
    restoreFocus
  ) {
    // animate hiding of existing item first
    this.signalTaskStart('replace item'); // signal replace item animation start. Ends in _handleReplaceTransitionEnd() defined in TableDataSourceContentHandler

    // now actually replace the item
    var parentElement = item.parentNode;
    var position = $(parentElement).children().index(item);
    var newItem = document.createElement(this.GetChildElementTagName()); // @HTMLUpdateOK

    // explicit clean when inline template is used
    if (templateEngine) {
      templateEngine.clean(item);
    }

    // this should trigger ko.cleanNode if applicable
    $(item).replaceWith(newItem); // @HTMLUpdateOK newItem is constructed by the component and not yet manipulated by the application

    return this._addOrReplaceItem(
      newItem,
      position,
      parentElement,
      index,
      data,
      metadata,
      templateEngine,
      callback,
      restoreFocus
    );
  };

  /**
   * Handles both add and replace item
   * @private
   */
  DataProviderContentHandler.prototype._addOrReplaceItem = function (
    item,
    position,
    parentElement,
    index,
    data,
    metadata,
    templateEngine,
    callback,
    restoreFocus,
    itemMetaData,
    replaceChildCallback
  ) {
    if (callback == null) {
      // eslint-disable-next-line no-param-reassign
      callback = this.afterRenderItem.bind(this);
    }

    var context = this.createContext(position, data, metadata, item, itemMetaData);
    var renderer = this.m_widget._getItemRenderer();
    var templateElement = this.m_widget.getItemTemplate();
    var textWrapper;
    var isCustomizeItem = false;

    if (renderer != null) {
      // if an element is returned from the renderer and the parent of that element is null, we will append
      // the returned element to the parentElement.  If non-null, we won't do anything, assuming that the
      // rendered content has already added into the DOM somewhere.
      var content = renderer.call(this, context);
      if (content != null) {
        // allow return of document fragment from jquery create/js document.createDocumentFragment
        if (content.parentNode === null || content.parentNode instanceof DocumentFragment) {
          item.appendChild(content); // @HTMLUpdateOK
        } else if (content.parentNode != null) {
          // parent node exists, do nothing
        } else if (content.toString) {
          textWrapper = document.createElement('span');
          textWrapper.appendChild(document.createTextNode(content.toString())); // @HTMLUpdateOK
          item.appendChild(textWrapper); // @HTMLUpdateOK
        }
      }
    } else if (templateElement != null && templateEngine != null) {
      var componentElement = this.m_widget.GetRootElement()[0];
      var bindingContext = this.GetBindingContext(context);
      var as = this.m_widget.getAs ? this.m_widget.getAs() : null;
      var nodes = templateEngine.execute(componentElement, templateElement, bindingContext, as);
      if (replaceChildCallback) {
        isCustomizeItem = replaceChildCallback(nodes);
      } else {
        var tagName = this.GetChildElementTagName();
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].tagName === tagName) {
            isCustomizeItem = true;
            break;
          }
        }
        if (isCustomizeItem) {
          item.replaceWith(...nodes); // @HTMLUpdateOK
        } else {
          item.append(...nodes); // @HTMLUpdateOK
        }
      }
    } else {
      textWrapper = document.createElement('span');
      textWrapper.appendChild(document.createTextNode(data == null ? '' : data.toString())); // @HTMLUpdateOK
      item.appendChild(textWrapper); // @HTMLUpdateOK
    }

    // get the item from root again as template replaces the item element
    var parentItem = parentElement.children
      ? parentElement.children[position]
      : this._getItemFromDocumentFragment(parentElement, position);
    context.parentElement = parentItem;

    // cache data and metadata in item element, this is needed for getDataForVisibleItem.
    $.data(parentItem, 'data', data);
    $.data(parentItem, 'metadata', itemMetaData);

    // do any post processing
    return callback(parentItem, context, isCustomizeItem, restoreFocus);
  };

  /**
   * In IE/Safari, DocumentFragment does not support children property
   * @private
   */
  DataProviderContentHandler.prototype._getItemFromDocumentFragment = function (fragment, index) {
    var nodeIndex = 0;
    var nodes = fragment.childNodes;

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (!node) {
        break;
      }

      if (node.nodeType === 1) {
        if (nodeIndex === index) {
          return node;
        }
        nodeIndex += 1;
      }
    }
    return null;
  };

  /**
   * Creates a binding context based on context object
   * To be override by different ContentHandler
   * @protected
   */
  DataProviderContentHandler.prototype.GetBindingContext = function (context) {
    var current = {};
    current.data = context.data;
    current.index = context.index;
    current.key = context.key;
    current.componentElement = context.componentElement;
    current.item = { data: context.data, metadata: context.metadata };
    return current;
  };

  DataProviderContentHandler.prototype.afterRenderItem = function (item, context) {
    // save the key in the element (cannot use data- here since it could be a non-string)
    // eslint-disable-next-line no-param-reassign
    item.key = context.key;

    var $item = $(item);
    $item.uniqueId();

    // if there's only one element inside the item and it is focusable, set
    // the role on it instead
    var groupItemStyleClass = this.m_widget.getGroupItemStyleClass();
    var elem;
    // in the case where group item is already present
    if (item.firstElementChild && item.firstElementChild.classList.contains(groupItemStyleClass)) {
      elem = this.m_widget.getSingleFocusableElement($(item.firstElementChild));
    } else {
      elem = this.m_widget.getSingleFocusableElement($item);
    }

    if (this.shouldUseGridRole()) {
      if (context.leaf != null && !context.leaf) {
        // it's a group item
        $item.attr('role', 'presentation');
      } else if (this.isCardLayout()) {
        elem.attr('role', 'gridcell');
      } else {
        $item.attr('role', 'row');
        if (elem !== $item) {
          elem.attr('role', 'gridcell');
        } else {
          // we'll need to wrap content with a gridcell role
          var wrapperHTML = "<div role='gridcell' class='oj-listview-cell-element'></div>";
          var children = elem.children();
          if (children.length === 0) {
            elem.get(0).innerHTML = wrapperHTML; // @HTMLUpdateOK
          } else {
            // include comment nodes/ko virtual elements
            var cell = document.createElement('div');
            cell.setAttribute('role', 'gridcell');
            cell.className = 'oj-listview-cell-element';

            while (elem[0].firstChild) {
              // The list is LIVE so it will re-index each call
              cell.appendChild(elem[0].firstChild); // @HTMLUpdateOK
            }
            elem[0].appendChild(cell);
          }
        }
      }
    } else {
      elem.attr('role', this.IsHierarchical() ? 'treeitem' : 'option');
      if (elem !== $item) {
        $item.attr('role', 'presentation');
      }
    }

    elem.addClass(this.m_widget.getFocusedElementStyleClass());

    // tag it if item is not focusable
    if (!this.isFocusable(context)) {
      $item.addClass('oj-skipfocus');
    }

    $item.addClass(this.m_widget.getItemElementStyleClass());

    return Promise.resolve(true);
  };

  /**
   * Creates the context object containing metadata
   * @param {number} index the index
   * @param {Object} key the key
   * @param {Object} data the data
   * @param {Element} parentElem the parent element
   * @return {Object} the context object
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DataProviderContentHandler.prototype.getMetadata = function (index, key, data, parentElem) {
    var context = data.context;
    if (context == null) {
      context = {};
    }

    if (context.index == null) {
      context.index = index;
    }

    if (context.key == null) {
      context.key = key;
    }

    return context;
  };

  /**
   * Model mutate event handler.  Called on rows mutation.
   * @param {Object} event the mutate model event
   * @protected
   */
  DataProviderContentHandler.prototype.handleModelMutateEvent = function (event) {
    if (this.m_root == null || !this.m_widget.isAvailable()) {
      return;
    }

    if (event.detail.remove != null) {
      this.handleModelRemoveEvent(event);
    }
    if (event.detail.add != null) {
      this.handleModelAddEvent(event);
    }
    if (event.detail.update != null) {
      this.handleModelChangeEvent(event);
    }
    if (this.getValidatedEventDetailPromise) {
      this.getValidatedEventDetailPromise.then(() => {
        if (this.m_widget == null) {
          return;
        }

        if (event.detail.remove) {
          this.handleModelRemoveEvent(event);
        }
        this.getValidatedEventDetailPromise = null;
      });
    }
  };

  /**
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DataProviderContentHandler.prototype.handleModelRefreshEvent = function (event) {};

  /**
   * @private
   */
  DataProviderContentHandler.prototype._pushToEventQueue = function (event) {
    if (this.m_eventQueue == null) {
      this.m_eventQueue = [];
    }

    this.m_eventQueue.push(event);
  };

  DataProviderContentHandler.prototype._processEventQueue = function () {
    var event;

    if (this.m_eventQueue != null && this.m_eventQueue.length > 0) {
      // see if we can find a refresh event (without keys field which means it's a full refresh)
      for (var i = 0; i < this.m_eventQueue.length; i++) {
        event = this.m_eventQueue[i].event;
        if (event.type === 'refresh' && (event.detail == null || event.detail.keys == null)) {
          this.handleModelRefreshEvent(event);
          // we are done
          return;
        }
      }

      // we'll just need to handle one event at a time since processEventQueue will be triggered whenever an event is done processing
      event = this.m_eventQueue.shift().event;
      if (event.type === 'mutate') {
        this.handleModelMutateEvent(event);
      } else if (event.type === 'refresh' && event.detail && event.detail.keys) {
        this.handleModelRefreshEvent(event);
      }
    }
  };

  DataProviderContentHandler.prototype._clearEventQueue = function () {
    if (this.m_eventQueue != null) {
      this.m_eventQueue.length = 0;
    }
  };

  /**
   * Override by ContentHandler to do the actual model insert
   * @protected
   */
  DataProviderContentHandler.prototype.addItemsForModelInsert =
    // eslint-disable-next-line no-unused-vars
    function (data, indexes, keys, parentKeys, afterKeys) {};

  /**
   * Retrieve the index of the item with the specified key
   * @protected
   */
  DataProviderContentHandler.prototype.getIndex = function (keys, index) {
    if (keys == null || keys.length === 0 || index >= keys.length) {
      return -1;
    }

    var key = keys[index];
    var elem = this.FindElementByKey(key);
    return elem != null ? $(elem.parentNode).children().index(elem) : -1;
  };

  /**
   * Gets the maximum number of items that can be retrieved from data source
   * @return {number} the maximum fetch count
   * @private
   */
  DataProviderContentHandler.prototype._getMaxCount = function () {
    return this.m_widget.options.scrollPolicyOptions.maxCount;
  };

  /**
   * Callback handler max fetch count.
   * @private
   */
  DataProviderContentHandler.prototype._handleScrollerMaxRowCount = function () {
    // TODO: use resource bundle
    Logger.info('ScrollPolicyOptions max count has been reached.');
  };

  /**
   * Truncate the data if the length of data is greater than max count
   * @param validatedEventDetail validated event detail
   * @param currentDataLength length of current data
   */
  DataProviderContentHandler.prototype.truncateIfOverMaxCount = function (
    validatedEventDetail,
    currentDataLength
  ) {
    const eventDataLength = validatedEventDetail.data.length;
    const potentialDataLength = eventDataLength + currentDataLength;
    const offset = this._getMaxCount() - potentialDataLength;
    // over max count need to truncate
    if (offset < 0) {
      validatedEventDetail.data.splice(offset, eventDataLength);
      validatedEventDetail.metadata.splice(offset, eventDataLength);
      this._handleScrollerMaxRowCount();
    }
  };

  /**
   * Get the validated data and metadata for event detail
   * @param detail event detail
   */
  DataProviderContentHandler.prototype.getValidatedEventDetail = function (detail) {
    const addEventBusyResolve = this.m_widget._addComponentBusyState(
      'validating mutation add event detail'
    );
    return DataCollectionUtils.getEventDetail(this.getDataProvider(), detail).then((validatedEventDetail) => {
      if (validatedEventDetail === null) {
        addEventBusyResolve();
        return null;
      }
      const styleClass = '.' + this.m_widget.getItemElementStyleClass();
      const items = this.m_root.querySelectorAll(styleClass);
      this.truncateIfOverMaxCount(validatedEventDetail, items.length);
      addEventBusyResolve();
      return validatedEventDetail;
    });
  };

  /**
   * @private
   */
  DataProviderContentHandler.prototype.handleModelAddEvent = function (event) {
    // if listview is busy, queue it for processing later
    if (!this.IsReady()) {
      this._pushToEventQueue({ type: event.type, event: event });
      return;
    }

    this.signalTaskStart('handling model add event'); // signal method task start

    // in card layout mode, the root is an additional element created by ListView, and that will be disassociated by ListView when
    // it is empty, re-append it to the root ul (the superRoot)
    if (this.m_superRoot && this.m_root.childNodes.length === 0) {
      this.m_superRoot.appendChild(this.m_root.parentNode);
    }

    var addEvent = event.detail.add;
    var data = addEvent.data;
    var keys = [];
    var refKeys;

    addEvent.keys.forEach(function (key) {
      keys.push(key);
    });

    var keyIter;
    var isBeforeKeys = true;
    if (addEvent.addBeforeKeys !== undefined) {
      keyIter = addEvent.addBeforeKeys;
    } else if (addEvent.afterKeys !== undefined) {
      // afterKeys is deprecated, but continue to support it until we can remove it.
      // forEach can be called on both array and set.
      keyIter = addEvent.afterKeys;
      isBeforeKeys = false;
    }

    if (keyIter) {
      refKeys = [];
      keyIter.forEach(function (key) {
        refKeys.push(key);
      });
    }

    // parentKeys would be undefined for non-hierarchical DataProvider
    var parentKeys = addEvent.parentKeys;

    // indexes could be undefined if not supported by DataProvider
    var indexes = addEvent.indexes;

    // metadata could be undefined if not supported by DataProvider
    var metadata = addEvent.metadata;

    if (
      data != null &&
      keys != null &&
      keys.length > 0 &&
      data.length > 0 &&
      keys.length === data.length &&
      (indexes == null || indexes.length === data.length)
    ) {
      this.addItemsForModelInsert(data, indexes, keys, parentKeys, isBeforeKeys, refKeys, metadata);
      this.signalTaskEnd();

      // get validated data when data is missing in add event detail
    } else if ((data == null || metadata == null) && keys != null && keys.length > 0) {
      this.getValidatedEventDetailPromise = this.getValidatedEventDetail(event.detail.add).then(
        (validatedEventDetail) => {
          if (this.m_widget == null) {
            this.signalTaskEnd();
            return;
          }

          if (validatedEventDetail != null && validatedEventDetail.data != null) {
            data = validatedEventDetail.data;
            metadata = validatedEventDetail.metadata;
            if (
              data.length > 0 &&
              keys.length === data.length &&
              (indexes == null || indexes.length === data.length)
            ) {
              this.addItemsForModelInsert(
                data,
                indexes,
                keys,
                parentKeys,
                isBeforeKeys,
                refKeys,
                metadata
              );
            }
          }
          this.signalTaskEnd();
        }
      );
    } else {
      this.signalTaskEnd();
    }
  };

  DataProviderContentHandler.prototype.afterRenderItemForInsertEvent = function (
    item,
    context,
    isCustomizeItem
  ) {
    var action = 'add';

    this.signalTaskStart('after render item from model insert event'); // signal post rendering processing start. Ends at the end of the method.

    item.setAttribute('data-oj-context', '');

    this.afterRenderItem(item, context, isCustomizeItem);

    // hide it before starting animation to show added item
    var elem = $(item);

    var itemStyleClass = item.className;
    // save it for restore later
    // eslint-disable-next-line no-param-reassign
    item._className = itemStyleClass;
    // eslint-disable-next-line no-param-reassign
    item.className = 'oj-listview-temp-item oj-listview-item-add-remove-transition';

    var isCardLayout = this.isCardLayout();

    // add card style class to wrapper/transforming div
    if (isCardLayout) {
      // eslint-disable-next-line no-param-reassign
      item.className =
        item.className + ' oj-listview-card-animated ' + this.m_widget.getItemStyleClass();
    }
    if (!this.shouldUseGridRole()) {
      elem.children().wrapAll('<div></div>'); // @HTMLUpdateOK
    }

    var content = elem.children().first();
    if (!isCardLayout) {
      content[0].className = itemStyleClass;
    }
    // transfer key and role for FindElementByKey lookup that might happen while animating (navlist)
    content[0].key = item.key;

    // transfer aria-selected for selectable checks that might happen while animating (navlist)
    if (!this.shouldUseGridRole()) {
      content.attr('role', item.getAttribute('role'));
      if (elem[0].hasAttribute('aria-selected')) {
        content.attr('aria-selected', item.getAttribute('aria-selected'));
      }
    } else if (!isCardLayout) {
      var firstElem = content[0].firstElementChild;
      if (firstElem) {
        firstElem.classList.add('oj-listview-cell-element');
      }
    }

    var self = this;
    // initially hide it to avoid blinking
    // eslint-disable-next-line no-param-reassign
    item.style.opacity = 0;

    return new Promise(function (resolve) {
      var busyContext = Context.getContext(item).getBusyContext();
      busyContext.whenReady().then(function () {
        if (self.m_widget == null) {
          resolve(true);
          return;
        }

        self.signalTaskStart('kick off animation for insert item'); // signal add animation start. Ends in _handleAddTransitionEnd().

        var currentClassName = item.className;
        // now we can reset opacity, this is to avoid AnimationUtils setting opacity to 0 when it restores element styles
        // eslint-disable-next-line no-param-reassign
        item.style.opacity = '';
        var promise = self.m_widget.StartAnimation(item, action);

        // now show it
        promise.then(function () {
          item.removeAttribute('data-oj-context');
          self._handleAddTransitionEnd(context, item, currentClassName);
          resolve(true);
        });

        self.signalTaskEnd(); // signal post rendering processing end. Started at the beginning of the method.
      });
    });
  };

  DataProviderContentHandler.prototype._handleAddTransitionEnd = function (
    context,
    elem,
    currentClassName
  ) {
    // this could have been called after listview is destroyed
    // or it could have been removed immediately
    if (this.m_widget == null || elem.parentNode == null) {
      this.signalTaskEnd();
      return;
    }

    var beforeTransitionClasses = currentClassName.split(' ');
    var afterTransitionClasses = elem.className.split(' ');

    var hasFocus =
      elem.classList.contains('oj-focus') && elem.classList.contains('oj-focus-highlight');
    var isSelected = elem.classList.contains('oj-selected');
    var isCardAnimated = elem.classList.contains('oj-listview-card-animated');
    // restore class name
    // eslint-disable-next-line no-param-reassign
    elem.className = elem._className;
    if (hasFocus) {
      elem.classList.add('oj-focus');
      elem.classList.add('oj-focus-highlight');
    }
    if (isSelected) {
      elem.classList.add('oj-selected');
    }
    if (isCardAnimated) {
      elem.classList.add('oj-listview-card-animated');
    }

    // add classes that might have been added during custom animation callback
    afterTransitionClasses.forEach(function (cls) {
      if (beforeTransitionClasses.indexOf(cls) === -1) {
        elem.classList.add(cls);
      }
    });

    if (this.shouldUseGridRole()) {
      if (!this.isCardLayout()) {
        var firstChild = elem.firstElementChild;
        // should not be null
        if (firstChild) {
          elem._className.split(' ').forEach(function (cls) {
            firstChild.classList.remove(cls);
          });
          firstChild.classList.add('oj-listview-cell-element');

          var firstElem = firstChild.firstElementChild;
          if (firstElem) {
            firstElem.classList.remove('oj-listview-cell-element');
          }
        }
      }
    } else {
      $(elem).children().children().unwrap();
    }

    this.m_widget.itemInsertComplete(elem, context);

    this.signalTaskEnd(); // signal add animation end. Started in afterRenderItemForInsertEvent();
  };

  DataProviderContentHandler.prototype.handleModelRemoveEvent = function (event) {
    var self = this;
    var keys = event.detail.remove.keys;

    if (keys == null || keys.size === 0) {
      return false;
    }

    // if listview is busy, hold that off until later
    if (!this.IsReady()) {
      this._pushToEventQueue({ type: event.type, event: event });
      return false;
    }

    this.signalTaskStart('handling model remove event'); // signal method task start

    var keysToAdd = event.detail.add != null ? event.detail.add.keys : new Set();
    var keysToRemove = [];

    var promises = [];
    keys.forEach(function (key) {
      var isKeyToAdd = keysToAdd.has(key);
      if (!isKeyToAdd) {
        keysToRemove.push(key);
      }

      var elem = self.FindElementByKey(key);
      if (elem != null) {
        self.signalTaskStart('handling model remove event for item: ' + key); // signal removeItem start
        // mark item to be remove so we won't try to remove this again
        elem.classList.add('oj-listview-item-remove');
        // item remove might have been just added (in insert animation phase)
        if (elem.parentNode.classList.contains('oj-listview-temp-item')) {
          elem = elem.parentNode;
        }
        promises.push(self.removeItem(elem, isKeyToAdd));
        self.signalTaskEnd(); // signal removeItem end
      } else {
        Logger.log('handleModelRemoveEvent: cannot find item with key ' + key);
      }
    });

    // checks whether the removed item is selected, and adjust the value as needed
    if (this.isSelectionEnabled()) {
      // do not remove key if there is a pending insert
      if (keysToRemove.length > 0) {
        var selected = this.m_widget.options.selected;
        var newSelected = selected.delete(keysToRemove);

        // update selection option if it did changed
        if (selected !== newSelected) {
          var selectedItems = [];
          if (newSelected.values) {
            newSelected.values().forEach(function (key) {
              selectedItems.push(self.FindElementByKey(key));
            });
          }
          this.m_widget._setSelectionOption(newSelected, null, selectedItems);
        }
      }

      if (keysToAdd.size > 0) {
        // reset flag so that selection will be validated after insert
        this.m_widget.resetInitialSelectionStateValidated();
      }
    }

    this.handleRemoveItemsPromises(promises);

    this.signalTaskEnd(); // signal method task end

    return true;
  };

  /**
   * Invoke after a set of items are removed
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DataProviderContentHandler.prototype.handleRemoveItemsPromises = function (promises) {};

  /**
   * Remove a single item element
   * @param {jQuery|Element} elem the element to remove
   * @param {boolean} isReinsert if the item to remove is to be re-insert in the same event
   * @protected
   */
  DataProviderContentHandler.prototype.removeItem = function (elem, isReinsert) {
    var self = this;
    var action = 'remove';

    this.signalTaskStart('removing an item'); // signal method task start

    // got to do this before wrapAll since that changes activeElement
    var active = document.activeElement;
    var restoreFocus = elem.contains(active);

    var item = $(elem).get(0);
    var itemStyleClass = item.className;
    $(item)
      .children()
      .wrapAll("<div class='" + itemStyleClass + "'></div>"); // @HTMLUpdateOK
    item.className = 'oj-listview-item-add-remove-transition oj-listview-item-remove';
    item.children[0].key = elem.key;

    this.signalTaskStart('kick off animation to remove an item'); // signal remove item animation start. Ends in handleRemoveTransitionEnd()

    // to workaround removing element caused scrolling by resize listener
    // ideally we should be using ResizeObserver, but that caused issues in qunit
    // tests due to https://bugs.chromium.org/p/chromium/issues/detail?id=809574
    this.m_widget.disableResizeListener();

    var promise = this.m_widget.StartAnimation(item, action);

    // now hide it
    promise.then(
      function () {
        self.handleRemoveTransitionEnd(elem, restoreFocus, isReinsert);
        if (self.m_widget) {
          self.m_widget.enableResizeListener();
        }
      },
      function () {
        if (self.m_widget) {
          self.m_widget.enableResizeListener();
        }
      }
    );

    this.signalTaskEnd(); // signal method task end

    return promise;
  };

  /**
   * Handles when remove item animation transition ends
   * @param {Element|jQuery} elem
   * @param {boolean} restoreFocus
   * @param {boolean} isReinsert
   * @protected
   */
  DataProviderContentHandler.prototype.handleRemoveTransitionEnd = function (
    elem,
    restoreFocus,
    isReinsert
  ) {
    // this could have been called after listview is destroyed
    if (this.m_widget == null) {
      this.signalTaskEnd();
      return;
    }

    var $elem = $(elem);
    var parent = $elem.parent();
    // could happen if there is a reset right after model update, the content has already been cleared out
    if (parent.length === 0) {
      this.signalTaskEnd();
      return;
    }

    // invoke hook before actually removing the item
    var currentItemUpdated = this.m_widget.itemRemoveComplete($elem.get(0), restoreFocus, isReinsert);

    // template engine should have already been loaded
    var templateEngine = this.getTemplateEngine();
    if (templateEngine) {
      templateEngine.clean($elem.get(0));
    }

    $elem.remove();

    // since the items are removed, need to clear cache
    this.m_widget.ClearCache();

    // if it's the last item, show empty text
    if (parent.get(0).childElementCount === 0) {
      this.m_widget.renderComplete(true);
    }

    // ensure something is selected if the removed item is the last selected item
    // need to complete after the DOM element is removed
    if (this.isSelectionEnabled()) {
      this.m_widget.enforceSelectionRequired();
    }

    // this should focus on the current item, set by itemRemoveComplete
    if (currentItemUpdated && restoreFocus && !this.m_root.contains(document.activeElement)) {
      this.m_root.focus();
    }

    this.signalTaskEnd(); // signal remove item animation end. Started in _removeItem()
  };

  /**
   * Model change event handler.  Called when a row has been changed from the underlying data.
   * @param {Object} event the model change event
   * @private
   */
  DataProviderContentHandler.prototype.handleModelChangeEvent = function (event) {
    this.signalTaskStart('handling model update event'); // signal method task start

    var changeEvent = event.detail.update;
    var data = changeEvent.data;
    var keys = [];
    changeEvent.keys.forEach(function (key) {
      keys.push(key);
    });

    // template engine should have already been loaded
    var templateEngine = this.getTemplateEngine();

    var restoreFocusElem;

    var callback = (item, context, isCustomizeItem, restoreFocus) => {
      var isFocusHighlight = false;
      if (restoreFocusElem) {
        isFocusHighlight = restoreFocusElem.classList.contains('oj-focus-previous-highlight');
      }
      this.afterRenderItemForChangeEvent(
        item,
        context,
        isCustomizeItem,
        restoreFocus,
        isFocusHighlight
      );
    };

    var updateData = () => {
      // indexes could be undefined if not supported by DataProvider
      var indexes = changeEvent.indexes;
      for (var i = 0; i < keys.length; i++) {
        this.m_widget.updateSelectedKeyData(keys[i], data[i]);

        var elem = this.FindElementByKey(keys[i]);
        if (elem != null) {
          if (restoreFocusElem === undefined && elem.contains(document.activeElement)) {
            restoreFocusElem = elem;
          }
          this.signalTaskStart('handling model update event for item: ' + keys[i]); // signal replace item start
          var index = indexes == null ? -1 : indexes[i];
          this.replaceItem(
            elem,
            index,
            data[i],
            this.getMetadata(index, keys[i], data[i], elem.parentNode),
            templateEngine,
            callback,
            restoreFocusElem != null
          );
          this.signalTaskEnd(); // signal replace item end

          if (restoreFocusElem != null) {
            restoreFocusElem = null; // doing this will ensure we don't do the check again
          }
        }
      }

      // since the item element will change, need to clear cache
      this.m_widget.ClearCache();
    };

    if (data == null) {
      this.getValidatedEventDetailPromise = this.getValidatedEventDetail(changeEvent).then(
        (validatedEventDetail) => {
          if (this.m_widget == null) {
            this.signalTaskEnd();
            return;
          }

          if (validatedEventDetail != null) {
            data = validatedEventDetail.data;
            updateData();
          }
          this.signalTaskEnd(); // signal method task end
        }
      );
    } else {
      updateData();
      this.signalTaskEnd(); // signal method task end
    }
  };

  /**
   * @private
   */
  DataProviderContentHandler.prototype.afterRenderItemForChangeEvent = function (
    item,
    context,
    isCustomizeItem,
    restoreFocus,
    isFocusHighlight
  ) {
    var self = this;
    var action = 'update';

    this.signalTaskStart('after render item for model change event'); // signal method task start

    // adds all neccessary wai aria role and classes
    this.afterRenderItem(item, context, isCustomizeItem);

    var promise = this.m_widget.StartAnimation(item, action);

    // now hide it
    promise.then(function () {
      self._handleReplaceTransitionEnd(item, restoreFocus);
      if (item && isFocusHighlight) {
        item.classList.add('oj-focus', 'oj-focus-highlight');
      }
    });

    this.signalTaskEnd(); // signal method task end
  };

  /**
   * @private
   */
  DataProviderContentHandler.prototype._handleReplaceTransitionEnd = function (item, restoreFocus) {
    // this could have been called after listview is destroyed
    if (this.m_widget == null) {
      this.signalTaskEnd();
      return;
    }

    $(item).removeClass('oj-listview-item-add-remove-transition');

    if (restoreFocus) {
      this.m_widget.restoreCurrentItemFocus(item);
    }

    this.signalTaskEnd(); // signal replace item animation end. Started in replaceItem() from handleModelChangeEvent() (see base class DataSourceContentHandler)
  };

  DataProviderContentHandler.prototype.createContext = function (
    index,
    data,
    metadata,
    elem,
    itemMetaData
  ) {
    var context = {};

    context.parentElement = elem;
    context.index = index;
    context.data = data;
    context.component = this.m_widget.getWidgetConstructor();
    context.datasource = this.getDataProvider();
    context = this.m_widget._FixRendererContext(context);
    context.metadata = itemMetaData;

    // merge properties from metadata into cell context
    // the properties in metadata would have precedence
    var props = Object.keys(metadata);
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      context[prop] = metadata[prop];
    }

    return context;
  };

  DataProviderContentHandler.prototype.isSelectionEnabled = function () {
    return this.m_widget._isSelectionEnabled();
  };

  DataProviderContentHandler.prototype.isFocusable = function (context) {
    return this.m_widget.getItemFocusable(context);
  };

  DataProviderContentHandler.prototype.isSelectable = function (context) {
    return this.m_widget.getItemSelectable(context);
  };

  DataProviderContentHandler.prototype.isCardLayout = function () {
    return this.m_widget.isCardLayout();
  };

  DataProviderContentHandler.prototype.shouldUseGridRole = function () {
    return this.m_widget.ShouldUseGridRole();
  };

  DataProviderContentHandler.prototype.isAsyncRendering = function () {
    return false;
    //    return this.m_widget.ojContext._IsCustomElement() && this.shouldUseGridRole();
  };

  DataProviderContentHandler.prototype.signalTaskStart = function (description) {
    if (this.m_widget) {
      // check that widget exists (e.g. not destroyed)
      this.m_widget.signalTaskStart('DataSource ContentHandler ' + description);
    }
  };

  DataProviderContentHandler.prototype.signalTaskEnd = function () {
    if (this.m_widget) {
      // check that widget exists (e.g. not destroyed)
      this.m_widget.signalTaskEnd();
    }
  };

  // Skeleton rendering related methods
  /**
   * Whether skeleton is supported (current only in Redwood)
   * @protected
   */
  DataProviderContentHandler.prototype.isSkeletonSupport = function () {
    return this.m_widget.isSkeletonSupport();
  };

  /**
   * Gets the height of the root (UL)
   * @protected
   */
  DataProviderContentHandler.prototype.getRootElementHeight = function () {
    if (isNaN(this.m_height)) {
      this.m_height = this.m_widget.GetRootElement()[0].offsetHeight;
    }
    return this.m_height;
  };

  /**
   * Get the dimension of the default skeleton
   * @protected
   */
  DataProviderContentHandler.prototype.getDefaultSkeletonDimension = function () {
    if (this.m_defaultSkeletonDim == null) {
      var root = this.m_widget.GetRootElement()[0];
      var skeleton = this.createSkeleton(true);
      skeleton.style.display = 'block';
      skeleton.style.visibility = 'hidden';
      root.appendChild(skeleton); // @HTMLUpdateOK
      var dim = { width: skeleton.offsetWidth, height: skeleton.offsetHeight };
      root.removeChild(skeleton);
      if (dim.height > 0 && dim.width > 0) {
        // cache the value only if it's valid
        this.m_defaultSkeletonDim = dim;
      }
      return dim;
    }
    return this.m_defaultSkeletonDim;
  };

  /**
   * Creates a skeleton representing a single item.
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DataProviderContentHandler.prototype.createSkeleton = function (initial) {
    return this.createSkeletonItem();
  };

  /**
   * Creates a skeleton representing a single item.
   * @protected
   */
  DataProviderContentHandler.prototype.createSkeletonItem = function () {
    var item = document.createElement('li');
    item.setAttribute('role', 'presentation');
    var content = document.createElement('div');
    item.className = 'oj-listview-item oj-listview-item-layout';
    if (!this.m_widget._isGridlinesVisible()) {
      item.classList.add('gridline-hidden');
    }
    // oj-listview-skeleton is a marker class to identify this is an item skeleton and not skeleton from other component
    content.className =
      'oj-listview-cell-element oj-listview-skeleton oj-listview-skeleton-line-height oj-animation-skeleton';
    item.appendChild(content); // @HTMLUpdateOK
    return item;
  };

  /**
   * Do the animation of fading out the skeletons and fade in the actual content
   * Returns a Promie that resolves to false to signal not to skip post processing
   * @protected
   */
  DataProviderContentHandler.prototype.animateShowContent = function (
    parentElem,
    content,
    shouldEmptyElem
  ) {
    // first fade out the skeletons, if any
    // eslint-disable-next-line no-unused-vars
    return new Promise(
      function (resolve) {
        var root = this.m_superRoot != null ? this.m_superRoot : this.m_root;
        var skeletonContainer = root.querySelector('.oj-listview-skeleton-container');
        if (skeletonContainer != null) {
          // attach content now so it can begin rendering
          parentElem.appendChild(content); // @HTMLUpdateOK
          var children = Array.from(parentElem.children);

          var promises = [];
          // but hide them for now
          children.forEach(function (child) {
            if (child !== skeletonContainer.parentNode) {
              // eslint-disable-next-line no-param-reassign
              child.style.opacity = 0;
              child.setAttribute('data-oj-context', '');
              var promise = Context.getContext(child).getBusyContext().whenReady();
              promises.push(promise);
            }
          });

          // wait for all content to be ready first before fade in the content
          Promise.all(promises).then(
            function () {
              // component could have been destroyed
              if (this.m_widget == null) {
                resolve(false);
                return;
              }

              AnimationUtils.fadeOut(skeletonContainer, { duration: '100ms' }).then(
                function () {
                  // component could have been destroyed
                  if (this.m_widget == null) {
                    resolve(false);
                    return;
                  }

                  // remove skeleton
                  var skeletonContainerRoot = skeletonContainer.parentNode;
                  if (skeletonContainerRoot.classList.contains('oj-listview-initial-skeletons')) {
                    root.removeChild(skeletonContainerRoot);
                  } else {
                    skeletonContainer
                      .querySelectorAll('.oj-listview-skeleton')
                      .forEach(function (skeleton) {
                        var skeletonItem = skeleton.parentNode;
                        if (skeletonItem && skeletonContainer === skeletonItem.parentNode) {
                          skeletonContainer.removeChild(skeletonItem);
                        }
                      });
                  }

                  // issue, if I just start the fadeIn animation here, the animation will end immediately.
                  // To workaround it, we start the fadeIn animation on a slight delay.  However, because of the
                  // delay, we ended up have to set opacity to 0 to avoid the actual content from briefly showing up.
                  // eslint-disable-next-line no-param-reassign
                  parentElem.style.opacity = 0;
                  children.forEach(function (child) {
                    if (child !== skeletonContainer.parentNode) {
                      // eslint-disable-next-line no-param-reassign
                      child.style.opacity = 1;
                      child.removeAttribute('data-oj-context');
                    }
                  });

                  // use setTimeout instead of requestAnimationFrame since that might not invoke by some browser
                  // if the tab/page is hidden for example
                  setTimeout(function () {
                    AnimationUtils.fadeIn(parentElem, { duration: '150ms', persist: 'all' }).then(
                      function () {
                        // force opacity to be 1 in case if CSS transition did not happen
                        if (parseInt(parentElem.style.opacity, 10) === 0) {
                          // eslint-disable-next-line no-param-reassign
                          parentElem.style.opacity = 1;
                        }
                      }
                    );
                  }, 0);

                  // can resolve immediately instead of waiting for fade in
                  resolve(false);
                }.bind(this)
              );
            }.bind(this)
          );
        } else {
          // skeleton is not supported
          if (shouldEmptyElem) {
            $(parentElem).empty();
          }
          parentElem.appendChild(content); // @HTMLUpdateOK
          // can resolve immediately instead of waiting for fade in
          resolve(false);
        }
      }.bind(this)
    );
  };

  /**
   * Destroy any sparkle artifacts and observer
   * @private
   */
  DataProviderContentHandler.prototype._destroySparkles = function () {
    if (this.m_sparklesObserver) {
      this.m_sparklesObserver.disconnect();
      this.m_sparklesObserver = null;
    }

    if (this.m_sparkles) {
      this.m_sparkles.remove();
      this.m_sparkles = null;
    }
  };

  /**
   * Debounce the callback with specified wait time
   * @private
   */
  DataProviderContentHandler.prototype._debounce = function (callback, wait) {
    let timeout = null;
    return (...args) => {
      const next = () => callback(...args);
      clearTimeout(timeout);
      timeout = setTimeout(next, wait);
    };
  };

  /**
   * Gets the number of suggestions which should be at the beginning of the data set.
   * @param {Object} metadata
   * @protected
   */
  DataProviderContentHandler.prototype.handleSuggestions = function (metadata) {
    var suggestionCount = 0;
    for (var i = 0; i < metadata.length; i++) {
      if (metadata[i].suggestion !== undefined) {
        suggestionCount += 1;
      }
    }
    return suggestionCount;
  };

  /**
   * Returns the first N (count) items
   * @protected
   */
  DataProviderContentHandler.prototype.getItems = function (parentElem, count) {
    var items = parentElem.querySelectorAll('.oj-listview-item-element');
    return Array.prototype.slice.call(items, 0, count);
  };

  /**
   * Render sparkles based on the specified items
   * @param {Element} items
   * @protected
   */
  DataProviderContentHandler.prototype.renderSparkles = function (items) {
    // if not specified, we'll find the existing ones
    if (items === undefined) {
      // eslint-disable-next-line no-param-reassign
      items = this.m_root.querySelectorAll('[data-oj-suggestion]');
    }

    if (items == null || items.length === 0) {
      this._destroySparkles();
      return;
    }

    if (this.m_sparkles == null) {
      var sparkles = document.createElement('li');
      sparkles.className = 'oj-listview-sparkles';
      sparkles.setAttribute('role', 'presentation');
      this.m_sparkles = sparkles;
    }

    if (this.m_sparklesObserver == null) {
      var heightMap = new Map();
      // use debounce to prevent loop limit exceed issue in Chrome
      this.m_sparklesObserver = new ResizeObserver(
        this._debounce((entries) => {
          var heightChanged = false;
          entries.forEach((entry) => {
            var currentHeight = heightMap.get(entry.target);
            if (currentHeight != null && Math.abs(currentHeight - entry.contentRect.height) > 1) {
              heightChanged = true;
            }
            heightMap.set(entry.target, entry.contentRect.height);
          });
          // re-render sparkles if the height of any of the suggested items has changed
          if (heightChanged && this.m_widget) {
            this.renderSparkles();
          }
        }, 100)
      );
    }
    var height = 0;
    for (var i = 0; i < items.length; i++) {
      height += items[i].offsetHeight;
      // mark as sparkle (see mutation)
      // eslint-disable-next-line no-param-reassign
      items[i].dataset.ojSuggestion = 'true';
      this.m_sparklesObserver.unobserve(items[i]);
      this.m_sparklesObserver.observe(items[i]);
      // for rendering border
      if (i === items.length - 1) {
        items[i].classList.add('oj-listview-last-suggestion');
      }
    }
    this.m_sparkles.style.top = this.m_root.offsetTop + 'px';
    this.m_sparkles.style.height = height + 'px';
    this.m_sparkles.style.display = 'block';
    if (this.m_sparkles.parentNode == null) {
      this.m_root.insertBefore(this.m_sparkles, this.m_root.firstElementChild); // @HTMLUpdateOK
    }
  };

  /**
   * Handler for IteratingDataProvider generated content
   * @constructor
   * @extends DataProviderContentHandler
   * @ignore
   */
  var IteratingDataProviderContentHandler = function (widget, root, data) {
    IteratingDataProviderContentHandler.superclass.constructor.call(this, widget, root, data);
  };
  // Subclass from oj.DataSourceContentHandler
  oj.Object.createSubclass(
    IteratingDataProviderContentHandler,
    DataProviderContentHandler,
    'IteratingDataProviderContentHandler'
  );

  /**
   * Initializes the instance.
   * @protected
   */
  IteratingDataProviderContentHandler.prototype.Init = function () {
    IteratingDataProviderContentHandler.superclass.Init.call(this);

    this.m_currentEvents = [];
  };

  IteratingDataProviderContentHandler.prototype.IsHierarchical = function () {
    return false;
  };

  /**
   * Determines whether the content handler is in a ready state
   * @return {boolean} true if there's no outstanding fetch or outstanding item in render queue, false otherwise.
   * @protected
   */
  IteratingDataProviderContentHandler.prototype.IsReady = function () {
    return !this.m_fetching && this.m_idleCallback == null;
  };

  /**
   * Determines if there's any item to be rendered from a fetch triggered by insert mutation.
   * @private
   */
  IteratingDataProviderContentHandler.prototype._hasPendingInsertKeys = function () {
    return this.m_insertOutOfRangeKeys != null && this.m_insertOutOfRangeKeys.size > 0;
  };

  /**
   * Destroy the internal DomScroller if there is one.  Called when this ContentHandler is destroyed or on refresh.
   * @private
   */
  IteratingDataProviderContentHandler.prototype._destroyDomScroller = function () {
    if (this.m_domScroller != null) {
      this.m_domScroller.destroy();
      this.m_domScroller = null;
    }

    // remove loading indicator if it still exists:
    this._removeLoadingIndicator();

    if (this.m_widget) {
      this.m_widget.unmergeScrollListener();
    }
  };

  /**
   * Destroy the content handler
   * @protected
   */
  IteratingDataProviderContentHandler.prototype.Destroy = function (completelyDestroy) {
    IteratingDataProviderContentHandler.superclass.Destroy.call(this, completelyDestroy);
    this._removeDataSourceEventListeners();
    this._destroyDomScroller();
    this._cancelIdleCallback();

    this.m_loadingIndicator = null;
    this.m_viewportCheckPromise = null;
    this.m_checkViewportPromise = null;
  };

  /**
   * @private
   */
  IteratingDataProviderContentHandler.prototype._cancelIdleCallback = function () {
    if (this.m_idleCallback != null) {
      if (!DataCollectionUtils.isRequestIdleCallbackSupported()) {
        window.cancelAnimationFrame(this.m_idleCallback);
      } else {
        window.cancelIdleCallback(this.m_idleCallback);
        // requestAnimationFrame might have been used
        window.cancelAnimationFrame(this.m_idleCallback);
      }
      this.m_idleCallback = null;
    }
  };

  IteratingDataProviderContentHandler.prototype.shouldHandleResize = function () {
    // we only care about the high-water mark scrolling case
    return this._isLoadMoreOnScroll();
  };

  IteratingDataProviderContentHandler.prototype.HandleResize = function (width, height) {
    // we only care about the high-water mark scrolling case, and if height changes
    // or we are animating which could cause resize
    if (!this._isLoadMoreOnScroll() || this.m_animationPromise != null) {
      return;
    }

    var currentWidth = this.m_width;
    var currentHeight = this.m_height;
    this.m_height = height;
    this.m_width = width;
    // reset column count so it can be re-calculated again
    this.m_colCount = undefined;

    // the number of skeletons needs to be adjusted because the number of columns might change
    var isCardLayout = this.isCardLayout();
    if (isCardLayout && this.isSkeletonSupport() && currentWidth !== width) {
      // adjust load more skeletons
      if (this.m_loadingIndicator != null) {
        this._adjustLoadMoreSkeletons(this._getRootElementWidth(true));
      } else {
        var container = this.m_root.querySelector('.oj-listview-skeleton-container');
        if (container != null) {
          // this must be the initial skeleton, just re-render them
          this.renderInitialSkeletons();
        }
      }
    }

    // check viewport if the height increased (or also width change if it's card layout)
    if (height > currentHeight || (isCardLayout && width > currentWidth)) {
      this.checkViewport();
    }
  };

  /**
   * @override
   */
  IteratingDataProviderContentHandler.prototype.notifyShown = function () {
    // might need to re-render sparkles
    if (this.m_widget && this.m_suggestions > 0) {
      this.renderSparkles(this.getItems(this.m_root, this.m_suggestions));
    }

    // we only care about the high-water mark scrolling case
    if (!this._isLoadMoreOnScroll()) {
      return;
    }

    // for loadMoreOnScroll case, we will have to make sure the viewport is satisfied
    this.checkViewport();
  };

  /**
   * @override
   */
  IteratingDataProviderContentHandler.prototype.notifyAttached = function () {
    // this should only be populated in high-water mark scrolling case with scroller specified
    if (this.m_domScroller != null) {
      var currentFetchTrigger = this._getFetchTrigger();
      if (currentFetchTrigger != null) {
        // this should force the fetch trigger to recalculate
        var fetchTrigger = this._getFetchTrigger();
        if (currentFetchTrigger !== fetchTrigger) {
          // update fetch trigger
          this.m_domScroller.setFetchTrigger(fetchTrigger);
        }

        // check again whether the viewport is satisfied
        this.checkViewport();
      }
    }
  };

  /**
   * Sets aria properties on root
   * @override
   */
  IteratingDataProviderContentHandler.prototype.setRootAriaProperties = function () {
    IteratingDataProviderContentHandler.superclass.setRootAriaProperties.call(this);

    // for high-water mark scrolling, we'll need to add additional wai-aria attribute since not
    // all items are in the DOM
    var self = this;
    if (this.shouldUseGridRole() && this._isLoadMoreOnScroll()) {
      this.getDataProvider()
        .getTotalSize()
        .then(function (size) {
          // self.m_root may have been cleared before the getTotalSize promise resolves
          // (this happened in oj-select-single unit tests)
          if (self.m_root) {
            // if count is unknown, then use max count
            self.m_root.setAttribute('aria-rowcount', size === -1 ? self._getMaxCount() : size);
          }
        });
    }
  };

  /**
   * Unsets aria properties on root
   * @override
   */
  IteratingDataProviderContentHandler.prototype.unsetRootAriaProperties = function () {
    IteratingDataProviderContentHandler.superclass.unsetRootAriaProperties.call(this);
    this.m_root.removeAttribute('aria-rowcount');
  };

  /**
   * Is loadMoreOnScroll
   * @return {boolean} true or false
   * @private
   */
  IteratingDataProviderContentHandler.prototype._isLoadMoreOnScroll = function () {
    return this.m_widget.isLoadMoreOnScroll();
  };

  /**
   * Gets the number of items to return in each fetch
   * @return {number} the fetch size
   * @private
   */
  IteratingDataProviderContentHandler.prototype._getFetchSize = function () {
    return Math.max(0, this.m_widget.options.scrollPolicyOptions.fetchSize);
  };

  /**
   * Gets the scroller element used in DomScroller
   * @return {Element} the scroller element
   * @private
   */
  IteratingDataProviderContentHandler.prototype._getScroller = function () {
    return this.m_widget._getScroller();
  };

  /**
   * Gets the offset top differences between the root and the scroller
   * @private
   */
  IteratingDataProviderContentHandler.prototype._getScrollerOffsetTop = function () {
    if (this._scrollerOffsetTop === undefined) {
      var scroller = this._getScroller();
      if (scroller === this.m_widget.GetRootElement()[0]) {
        this._scrollerOffsetTop = 0;
      } else {
        this._scrollerOffsetTop = DataCollectionUtils.calculateOffsetTop(scroller, this.m_root);
      }
    }
    return this._scrollerOffsetTop;
  };

  /**
   * Gets the distance from maximum scroll position that triggers a fetch
   * @return {number|undefined} the distance in pixel or undefined if no scroller is specified
   * @private
   */
  IteratingDataProviderContentHandler.prototype._getFetchTrigger = function () {
    if (this._fetchTrigger === undefined) {
      this._fetchTrigger = this._getLoadingIndicatorHeight();
    }
    return this._fetchTrigger;
  };

  /**
   * Calculates the height of the loading indicator
   * @return {number} the height of the loading indicator
   * @private
   */
  IteratingDataProviderContentHandler.prototype._getLoadingIndicatorHeight = function () {
    var height;
    if (this.isSkeletonSupport()) {
      var skeletonHeight = this.getDefaultSkeletonDimension().height;
      if (!this.isCardLayout()) {
        // for items, it's 3 x default item skeleton height
        height = IteratingDataProviderContentHandler.LOAD_MORE_SKELETONS_ROW_COUNT * skeletonHeight;
      } else {
        // if load more skeletons are available, use that height instead
        var cardHeight = this._getCardDimension();
        height = cardHeight != null ? cardHeight.height : skeletonHeight;
      }
    } else {
      var container = $(document.createElement('div'));
      container
        .addClass(this.m_widget.getItemStyleClass())
        .css({ visibility: 'hidden', overflow: 'hidden', position: 'absolute' });
      var icon = $(document.createElement('div'));
      icon.addClass('oj-icon oj-listview-loading-icon');
      container.append(icon); // @HTMLUpdateOK

      $(this.m_widget.GetRootElement()).append(container); // @HTMLUpdateOK
      height = container.get(0).offsetHeight;
      container.remove();
    }
    return height;
  };

  /**
   * Adjust the dimension of the default skeleton and the content inside it
   * @private
   */
  IteratingDataProviderContentHandler.prototype._adjustSkeletonCardContent = function (
    item,
    width,
    height
  ) {
    // eslint-disable-next-line no-param-reassign
    item.style.width = width + 'px';
    // eslint-disable-next-line no-param-reassign
    item.style.height = height + 'px';
  };

  /**
   * Creates a skeleton representing a single card.
   * @private
   */
  IteratingDataProviderContentHandler.prototype._createSkeletonCard = function () {
    var card = document.createElement('li');
    card.setAttribute('role', 'presentation');
    var content = document.createElement('div');
    card.className = 'oj-listview-skeleton-card';
    // oj-listview-skeleton is a marker class to identify this is an item skeleton and not skeleton from other component
    content.className =
      'oj-listview-skeleton oj-listview-skeleton-card-content oj-animation-skeleton';

    card.appendChild(content); // @HTMLUpdateOK
    return card;
  };

  /**
   * Creates a skeleton representing a single item/card.
   * @protected
   * @override
   */
  IteratingDataProviderContentHandler.prototype.createSkeleton = function (initial) {
    var defaultSkeleton;
    if (this.isCardLayout()) {
      if (initial) {
        if (this.m_defaultItemSkeleton === undefined) {
          this.m_defaultItemSkeleton = this._createSkeletonCard();
        }
        defaultSkeleton = this.m_defaultItemSkeleton;
      } else {
        if (this.m_defaultLoadMoreSkeleton === undefined) {
          var card = this._createSkeletonCard();
          var dim = this._getCardDimension();
          if (dim) {
            this._adjustSkeletonCardContent(card, dim.width, dim.height);
          }
          this.m_defaultLoadMoreSkeleton = card;
        }
        defaultSkeleton = this.m_defaultLoadMoreSkeleton;
      }
    } else {
      if (this.m_defaultItemSkeleton === undefined) {
        this.m_defaultItemSkeleton = this.createSkeletonItem();
      }
      defaultSkeleton = this.m_defaultItemSkeleton;
    }

    return defaultSkeleton.cloneNode(true);
  };

  /**
   * Gets the width of the browser scrollbar
   * @private
   */
  IteratingDataProviderContentHandler.prototype._getScrollbarWidth = function () {
    if (isNaN(this.m_scrollbarWidth)) {
      var root = this.m_widget.GetRootElement()[0];
      var dummy = document.createElement('div');
      root.appendChild(dummy); // @HTMLUpdateOK
      this.m_scrollbarWidth = Math.max(0, DataCollectionUtils.getDefaultScrollBarWidth(dummy));
      root.removeChild(dummy);
    }
    return this.m_scrollbarWidth;
  };

  /**
   * Gets the width of the root (UL)
   * @private
   */
  IteratingDataProviderContentHandler.prototype._getRootElementWidth = function (excludeScrollbar) {
    if (isNaN(this.m_width)) {
      this.m_width = this.m_widget.GetRootElement()[0].offsetWidth;
    }
    return excludeScrollbar ? this.m_width - this._getScrollbarWidth() : this.m_width;
  };

  /**
   * Displays skeletons for initial fetch.  Invoked by the widget.
   */
  IteratingDataProviderContentHandler.prototype.renderInitialSkeletons = function () {
    // empty out root element before adding skeletons
    if (this.m_superRoot) {
      this.m_root = this.m_superRoot;
      this.m_superRoot = null;
    }
    $(this.m_root).empty();

    // determines how many items needed to fill the viewport
    var height = this.getRootElementHeight();

    // figure out how many item/card are needed to fill the viewport
    // use floor to avoid triggering overflow
    var count = 0;
    var skeletonDimension = this.getDefaultSkeletonDimension();
    if (skeletonDimension.width > 0 && skeletonDimension.height > 0) {
      if (this.isCardLayout()) {
        var margin = this.getMargin();
        var width = this._getRootElementWidth();
        var colCount = Math.max(1, Math.floor(width / (skeletonDimension.width + margin)));
        var rowCount = Math.max(1, Math.floor(height / (skeletonDimension.height + margin)));
        count = rowCount * colCount;
      } else {
        count = Math.max(1, Math.floor(height / skeletonDimension.height));
      }
    }

    var container = document.createElement('li');
    container.setAttribute('role', 'presentation');
    container.classList.add('oj-listview-initial-skeletons');
    var list = document.createElement('ul');
    list.setAttribute('role', 'presentation');
    list.className = this.m_widget.getGroupStyleClass() + ' oj-listview-skeleton-container';
    for (var i = 0; i < count; i++) {
      list.appendChild(this.createSkeleton(true)); // @HTMLUpdateOK
    }
    container.appendChild(list); // @HTMLUpdateOK

    this.m_root.appendChild(container); // @HTMLUpdateOK
  };

  IteratingDataProviderContentHandler.LOAD_MORE_SKELETONS_ROW_COUNT = 3;

  /**
   * Adjust the load more skeleton in the case of component resize/reattach
   * @private
   */
  IteratingDataProviderContentHandler.prototype._adjustLoadMoreSkeletons = function (width, force) {
    var cardDim = this._getCardDimension();
    if (cardDim == null || cardDim.width === 0) {
      return;
    }

    if (!force) {
      var margin = this.getMargin();
      var newColCount = Math.floor(width / (cardDim.width + margin));
      var container = this.m_loadingIndicator.get(0).firstElementChild;
      var currentColCount = container.childElementCount;
      var diff = newColCount - currentColCount;
      if (diff === 0) {
        return;
      }
    }

    // remove all skeletons.  note it's better to just recreate the skeletons instead of maniulate them
    // because we have to make sure the animation is synchrionize
    this.m_loadingIndicator.get(0).parentNode.removeChild(this.m_loadingIndicator.get(0));
    if (this.m_fillerSkeletons != null) {
      this.m_fillerSkeletons.parentNode.removeChild(this.m_fillerSkeletons);
    }
    this.m_loadingIndicator = null;
    this.m_fillerSkeletons = null;
    this.m_defaultLoadMoreSkeleton = undefined;

    // repopulate the skeletons
    this._appendLoadingIndicator();
  };

  /**
   * Calculate what the margin is between cards
   * @private
   */
  IteratingDataProviderContentHandler.prototype.getMargin = function () {
    if (this.m_margin === undefined) {
      var elem = document.createElement('li');
      elem.className = this.m_widget.getItemStyleClass();
      this.m_root.appendChild(elem); // @HTMLUpdateOK
      var style = window.getComputedStyle(elem);
      this.m_margin = parseInt(style.marginRight, 10);
      this.m_root.removeChild(elem);
    }
    return this.m_margin;
  };

  /**
   * Gets the dimension of a card (actual not skeleton)
   * @private
   */
  IteratingDataProviderContentHandler.prototype._getCardDimension = function () {
    if (this.m_cardDim === undefined) {
      var elem = this.m_root.querySelector('.' + this.m_widget.getItemElementStyleClass());
      if (elem) {
        var dim = { width: elem.offsetWidth, height: elem.offsetHeight };
        // don't cache the value if it's invalid
        if (dim.width > 0 && dim.height > 0) {
          this.m_cardDim = dim;
        }
        return dim;
      }
    }
    return this.m_cardDim;
  };

  /**
   * Renders a group of skeleton cards/items
   * @private
   */
  IteratingDataProviderContentHandler.prototype._renderSkeletons = function (count) {
    var container = this.createLoadingIndicator();
    container.setAttribute('role', 'presentation');
    container.classList.add('oj-listview-skeleton-container');
    var group = document.createElement('ul');
    group.setAttribute('role', 'presentation');
    group.className = this.isCardLayout() ? 'oj-listview-skeleton-card-group' : 'oj-listview-group';
    container.appendChild(group); // @HTMLUpdateOK

    for (var i = 0; i < count; i++) {
      group.appendChild(this.createSkeleton(false)); // @HTMLUpdateOK
    }

    return container;
  };

  /**
   * Fills any empty space in the last row with skeleton cards
   * @private
   */
  IteratingDataProviderContentHandler.prototype._fillEmptySpaceWithSkeletons = function () {
    var cardDim = this._getCardDimension();
    if (cardDim == null || cardDim.width === 0) {
      return;
    }

    // first check how many do we need
    var lastItem = this.m_root.lastElementChild;
    var cardWidthWithMargin = cardDim.width + this.getMargin();
    var width = this._getRootElementWidth(true);
    var count = Math.floor((width - lastItem.offsetLeft - cardWidthWithMargin) / cardWidthWithMargin);
    if (count > 0) {
      var container = this._renderSkeletons(count);
      container.style.visibility = 'hidden';
      this.m_root.appendChild(container); // @HTMLUpdateOK
      this.m_fillerSkeletons = container;
    }
  };

  /**
   * Creates the load more skeletons
   * @private
   */
  IteratingDataProviderContentHandler.prototype._createLoadMoreSkeletons = function () {
    var count;
    if (this.isCardLayout()) {
      var width = this._getRootElementWidth(true);
      var cardDimension = this._getCardDimension();
      var cardWidth =
        cardDimension === undefined ? this.getDefaultSkeletonDimension().width : cardDimension.width;
      count = cardWidth === 0 ? 0 : Math.floor(width / (cardWidth + this.getMargin()));
    } else {
      count = IteratingDataProviderContentHandler.LOAD_MORE_SKELETONS_ROW_COUNT;
    }
    return this._renderSkeletons(count);
  };

  /**
   * Creates the load more indicator icon
   * @private
   */
  IteratingDataProviderContentHandler.prototype._createLoadMoreIcon = function () {
    var item = $(this.createLoadingIndicator());
    item
      .uniqueId()
      .attr('role', 'presentation')
      .addClass(this.m_widget.getItemStyleClass())
      .addClass('oj-listview-loading-icon-container');

    var icon = $(document.createElement('div'));
    icon.addClass('oj-icon oj-listview-loading-icon');
    item.append(icon); // @HTMLUpdateOK

    return item.get(0);
  };

  /**
   * @return {Element} the loading indicator element
   */
  IteratingDataProviderContentHandler.prototype.createLoadingIndicator = function () {
    return document.createElement('li');
  };

  /**
   * Add a loading indicator to the list for high-water mark scrolling scenario
   * @private
   */
  IteratingDataProviderContentHandler.prototype._appendLoadingIndicator = function () {
    // check if it's already added
    if (this.m_loadingIndicator != null) {
      return;
    }

    this.m_appendLoadingindicator = true;
    if (
      this.isSkeletonSupport() &&
      this.isCardLayout() &&
      this._getCardDimension() != null &&
      this._getCardDimension().width === 0
    ) {
      var self = this;
      var busyContext = Context.getContext(this.m_root).getBusyContext();
      busyContext.whenReady().then(function () {
        // check if we are still appending
        if (self.m_appendLoadingindicator) {
          self._doAppendLoadingIndicator();
        }
      });
    } else {
      this._doAppendLoadingIndicator();
    }
  };

  IteratingDataProviderContentHandler.prototype._doAppendLoadingIndicator = function () {
    // for the card layout case, we might need to fill empty space in the last row with skeletons
    if (this.isSkeletonSupport() && this.isCardLayout()) {
      this._fillEmptySpaceWithSkeletons();
    }

    var loadMoreIndicator = this.isSkeletonSupport()
      ? this._createLoadMoreSkeletons()
      : this._createLoadMoreIcon();
    loadMoreIndicator.style.visibility = 'hidden';
    this.m_root.appendChild(loadMoreIndicator); // @HTMLUpdateOK

    this.m_loadingIndicator = $(loadMoreIndicator);
    this.m_appendLoadingindicator = false;
  };

  /**
   * Remove the loading indicator
   * @private
   */
  IteratingDataProviderContentHandler.prototype._removeLoadingIndicator = function () {
    if (this.m_loadingIndicator != null) {
      this.m_loadingIndicator.remove();
    }
    this.m_loadingIndicator = null;

    if (this.m_fillerSkeletons != null) {
      this.m_fillerSkeletons.remove();
    }
    this.m_fillerSkeletons = null;
    this.m_appendLoadingindicator = false;
  };

  /**
   * Whether there are more items to fetch when scroll policy loadMoreOnScroll is used.
   * @return {boolean} true if there are more items to fetch, false otherwise.
   * @protected
   */
  IteratingDataProviderContentHandler.prototype.hasMoreToFetch = function () {
    return this.m_loadingIndicator != null;
  };

  IteratingDataProviderContentHandler.prototype.getLoadingIndicator = function () {
    return this.m_loadingIndicator != null ? this.m_loadingIndicator.get(0) : null;
  };

  /**
   * Add required attributes to item after it is rendered by the renderer
   * @param {Element} item the item element to modify
   * @param {Object} context the item context
   * @protected
   */
  IteratingDataProviderContentHandler.prototype.afterRenderItem = function (
    item,
    context,
    isCustomizeItem
  ) {
    IteratingDataProviderContentHandler.superclass.afterRenderItem.call(
      this,
      item,
      context,
      isCustomizeItem
    );

    $(item).addClass(this.m_widget.getItemStyleClass());

    // if item root (<LI>) is not specified, add a default layout class if it's supported
    if (!isCustomizeItem && this.m_widget.getItemLayoutStyleClass) {
      item.classList.add(this.m_widget.getItemLayoutStyleClass());
    }

    if (this.isSelectionEnabled() && this.isSelectable(context)) {
      this.m_widget.getFocusItem($(item)).attr('aria-selected', false);
    }

    // for high-water mark scrolling, we'll need to add additional wai-aria attribute since not
    // all items are in the DOM
    if (this._isLoadMoreOnScroll() && !this.isCardLayout()) {
      $(item).attr('aria-rowindex', context.index + 1);
    }

    this.m_widget.itemRenderComplete(item, context);
  };

  /**
   * Empty out root element and create any necessary artifacts before rendering items
   * @private
   */
  IteratingDataProviderContentHandler.prototype._prepareRootElement = function () {
    // reset root if it was manipulated prior
    if (this.m_superRoot) {
      $(this.m_superRoot).empty();
      this.m_root = this.m_superRoot;
      this.m_superRoot = null;
    } else {
      var skeletonContainer = this.m_root.querySelector('.oj-listview-skeleton-container');
      if (skeletonContainer == null) {
        // empty the root content if skeleton is not supported or not present.
        // if skeleton is supported, the root will be empty out when animation to hide skeletons is completed.
        $(this.m_root).empty();
      }
    }

    if (this.shouldUseGridRole() && this.isCardLayout()) {
      // in card layout, this is going to be a single row, N columns grid
      // so we'll need to wrap all <li> within a row
      var presentation = document.createElement('li');
      presentation.classList.add('oj-listview-group-container');
      var row = document.createElement('ul');
      presentation.appendChild(row); // @HTMLUpdateOK
      $(presentation).attr('role', 'presentation').css('width', '100%');
      $(row).attr('role', 'row').addClass(this.m_widget.getGroupStyleClass());

      this.m_root.appendChild(presentation); // @HTMLUpdateOK
      this.m_superRoot = this.m_root;
      this.m_root = row;
    }
  };

  /**
   * @private
   */
  IteratingDataProviderContentHandler.prototype._setFetching = function (fetching) {
    if (this.shouldUseGridRole()) {
      var root = this.m_superRoot == null ? this.m_root : this.m_superRoot;
      root.setAttribute('aria-busy', fetching);
    }
    this.m_fetching = fetching;
  };

  /**
   * Whether the key is inside the metadata array
   * @private
   */
  IteratingDataProviderContentHandler.prototype._containsKey = function (key, metadata) {
    for (var i = 0; i < metadata.length; i++) {
      if (oj.KeyUtils.equals(metadata[i].key, key)) {
        return true;
      }
    }
    return false;
  };

  /**
   * @param {boolean} forceFetch
   * @override
   */
  IteratingDataProviderContentHandler.prototype.fetchRows = function (forceFetch) {
    var offset = 0;

    this.signalTaskStart('fetching rows'); // signal method task start

    // checks if we are already fetching cells
    if (this.IsReady()) {
      var self = this;

      this._setFetching(true);

      IteratingDataProviderContentHandler.superclass.fetchRows.call(this, forceFetch);

      // this is the key of the item that we want to scroll to initially
      var scrollToKeyPromise = this.m_widget.getScrollToKey();

      // initiate loading of template engine, note it will not load it unless a template has been specified
      var enginePromise = this.loadTemplateEngine();

      // signal fetch started. Ends in fetchEnd() if successful. Otherwise, ends in the reject block of promise below right after _handleFetchError().
      // Cannot end in _handleFetchError() to be consistent with pagingTableDataSource behavior (see comment above)
      this.signalTaskStart('first fetch');

      // Create a clientId symbol that uniquely identify this consumer so that
      // DataProvider which supports it can optimize resources
      this._clientId = this._clientId || Symbol();

      var options = { clientId: this._clientId };
      // use fetch size if loadMoreOnScroll, otherwise specify -1 to fetch all rows
      options.size = this._isLoadMoreOnScroll() ? this._getFetchSize() : -1;

      this.m_dataProviderAsyncIterator = this.getDataProvider()
        .fetchFirst(options)
        [Symbol.asyncIterator]();
      var promise = this.m_dataProviderAsyncIterator.next();
      self.fetchSize = options.size;

      // new helper function to be called in recursion to fetch all data.
      var helperFunction = function (values, currentMetadata, scrollToKey) {
        var updatedScrollToKey = scrollToKey;
        // checks whether the key is fetched, otherwise we'll continue to fetch
        if (scrollToKey == null || self._containsKey(scrollToKey, currentMetadata)) {
          updatedScrollToKey = null;
        }
        // skip additional fetching if done, or if fetchSize is not -1.
        // if it has getPageCount method, it is a pagingTableDataSource so skip this fetch process.
        if (
          values[0].done ||
          (updatedScrollToKey == null &&
            (self.fetchSize !== -1 || typeof self.getDataProvider().getPageCount === 'function'))
        ) {
          return values;
        }

        var nextPromise = self.m_dataProviderAsyncIterator.next();
        var fetchMoreData = nextPromise.then(
          function (value) {
            // eslint-disable-next-line no-param-reassign
            values[0].done = value.done;
            // eslint-disable-next-line no-param-reassign
            values[0].value.data = values[0].value.data.concat(value.value.data);
            // eslint-disable-next-line no-param-reassign
            values[0].value.metadata = values[0].value.metadata.concat(value.value.metadata);
            return helperFunction(values, value.value.metadata, updatedScrollToKey);
          },
          function (reason) {
            self._handleFetchError(reason);
            self.signalTaskEnd(); // signal fetch stopped. Started above.
          }
        );

        return fetchMoreData;
      };

      Promise.all([promise, enginePromise, scrollToKeyPromise])
        .then(
          function (values) {
            return helperFunction(values, values[0].value.metadata, values[2]);
          },
          function (reason) {
            self._handleFetchError(reason);
            self.signalTaskEnd(); // signal fetch stopped. Started above.
            return Promise.reject(reason);
          }
        )
        .then(
          function (values) {
            // values should never be null
            if (values) {
              // check if content handler has been destroyed already
              if (self.m_widget == null) {
                return;
              }

              var value = values[0];
              var templateEngine = values[1];

              var dataProvider = self.getDataProvider();
              if (oj.TableDataSourceAdapter && dataProvider instanceof oj.TableDataSourceAdapter) {
                // paging control loadMore mode, offset will not be 0 after first fetch
                offset = dataProvider.offset;
              }

              if (offset === 0) {
                if (templateEngine) {
                  // clean nodes generated by templateengine before
                  self.cleanItems(templateEngine);
                }

                if (self.isSkeletonSupport()) {
                  // should not wait to call this so that the timer gets clear
                  self.m_widget.hideStatusText();
                }

                // empty content now that we have data
                self._prepareRootElement();
              }

              // append loading indicator at the end as needed
              self._handleFetchedData(value, templateEngine, offset === 0);
            }
          },
          function () {}
        );
      this.signalTaskEnd(); // signal method task end
      return;
    }
    this.signalTaskEnd(); // signal method task end
  };

  IteratingDataProviderContentHandler.prototype._handleFetchError = function (msg) {
    // TableDataSource aren't giving me any error message
    Logger.error(msg);

    // turn off fetching if there is an error
    this._setFetching(false);

    // listview might have been destroyed before fetch error is handled
    if (this.m_widget == null) {
      Logger.info('handleFetchError: widget has already been destroyed');
      return;
    }

    var skeletons = this.m_root.querySelector('.oj-listview-initial-skeletons');
    if (skeletons != null) {
      skeletons.parentNode.removeChild(skeletons);
    }

    if (this._isLoadMoreOnScroll()) {
      this._removeLoadingIndicator();
    }

    this.m_widget.renderComplete(true);
  };

  /**
   * Renders items when browser is idle (if not support, then fallback to requestAnimationFrame)
   * @private
   */
  IteratingDataProviderContentHandler.prototype._renderItemsWhenIdle = function (
    data,
    keys,
    index,
    templateEngine,
    isMouseWheel,
    metadata
  ) {
    var self = this;

    if (data.length === 0 || keys.length === 0) {
      window.requestAnimationFrame(function () {
        // idle callback might have been cancelled
        if (self.m_idleCallback) {
          self._appendLoadingIndicator();
          self.afterItemsInserted(false, true);
          self.signalTaskEnd(); // started in initial renderItemsWhenIdle call
        }
        self.m_idleCallback = null;
      });
      return;
    }

    function addFragmentOnRequestAnimationFrame(fragment) {
      window.requestAnimationFrame(function () {
        // need the check here since listview might have been destroyed before idleCallback is cancelled
        if (self.m_widget != null) {
          self.m_root.appendChild(fragment); // @HTMLUpdateOK

          // schedule next idle callback until all items from the current fetch are rendered
          self._renderItemsWhenIdle(data, keys, index, templateEngine, isMouseWheel, metadata);
        }
      });
    }

    // IE/legacy Edge/Safari do not support requestIdleCallback, use requestAnimationFrame as fall back
    if (!DataCollectionUtils.isRequestIdleCallbackSupported()) {
      this.m_idleCallback = window.requestAnimationFrame(function () {
        var fragment = document.createDocumentFragment();
        var oneData = data.shift();
        var oneMetadata = metadata != null ? metadata.shift() : null;
        var oneKey = keys.shift();
        self.addItem(
          fragment,
          -1,
          oneData,
          self.getMetadata(index, oneKey, oneData),
          templateEngine,
          null,
          oneMetadata
        );

        // eslint-disable-next-line no-param-reassign
        index += 1;
        addFragmentOnRequestAnimationFrame(fragment);
      });
    } else {
      // Chromium has an issue with requestIdleCallback when mouse wheel is used, see Chrome :
      // https://bugs.chromium.org/p/chromium/issues/detail?id=822269
      var options;
      if (isMouseWheel && oj.AgentUtils.getAgentInfo().engine === oj.AgentUtils.ENGINE.BLINK) {
        options = { timeout: 100 };
      }
      this.m_idleCallback = window.requestIdleCallback(function (idleDeadline) {
        // no need to check for whether listview has been destroyed yet since we cancel the callback on destroy
        var timeRemaining = idleDeadline.timeRemaining();
        var lastTimeTaken = 0;
        var fragment = document.createDocumentFragment();
        while (timeRemaining > lastTimeTaken || idleDeadline.didTimeout) {
          if (data.length === 0 || keys.length === 0) {
            break;
          }

          var oneData = data.shift();
          var oneMetadata = metadata != null ? metadata.shift() : null;
          var oneKey = keys.shift();
          self.addItem(
            fragment,
            -1,
            oneData,
            self.getMetadata(index, oneKey, oneData),
            templateEngine,
            null,
            oneMetadata
          );

          // eslint-disable-next-line no-param-reassign
          index += 1;
          lastTimeTaken = timeRemaining - idleDeadline.timeRemaining();
          timeRemaining = idleDeadline.timeRemaining();
        }

        addFragmentOnRequestAnimationFrame(fragment);
      }, options);
    }
  };

  /**
   * Checks whether content is overflowed
   * @private
   */
  IteratingDataProviderContentHandler.prototype._isOverflow = function () {
    var scroller = this._getScroller();
    if (scroller !== this.m_widget.getListContainer()[0]) {
      return this._isOverflowCheckForCustomScroller();
    }
    return this._isOverflowCheckForDefaultScroller();
  };

  /**
   * Checks overflow in the case where scroller wasn't specified (or is the root element)
   * @private
   */
  IteratingDataProviderContentHandler.prototype._isOverflowCheckForDefaultScroller = function () {
    if (this._isLoadMoreOnScroll()) {
      var scroller = this._getScroller();
      var adjustments = this.m_loadingIndicator == null ? 0 : this._getLoadingIndicatorHeight();
      var diff = scroller.scrollHeight - (scroller.clientHeight + adjustments);
      if (diff === 1 && oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.EDGE) {
        // hitting Edge , see https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/21405284/
        // note this will only happen with non-height-bounded ListView with loadMoreOnScroll, see 
        diff = 0;
      }
      return diff > 0;
    }
    return false;
  };

  /**
   * Checks overflow in the case where scroller was specified
   * @private
   */
  IteratingDataProviderContentHandler.prototype._isOverflowCheckForCustomScroller = function () {
    var scroller = this._getScroller();
    if (scroller !== document.documentElement) {
      var adjustments = this.m_loadingIndicator == null ? 0 : this._getLoadingIndicatorHeight();
      return (
        this.m_root.clientHeight + this._getScrollerOffsetTop() - adjustments > scroller.clientHeight
      );
    }
    // for the case where the root element is not the scroller, the DOMScroller isOverflow check
    // might not work, check whether the last element is in the viewport instead
    return this._isLastItemNotInViewport();
  };

  /**
   * Checks whether the last item is outside of the current viewport
   * @private
   */
  IteratingDataProviderContentHandler.prototype._isLastItemNotInViewport = function () {
    var items = this.m_root.children;
    var styleClass = this.m_widget.getItemElementStyleClass();
    var lastItem;
    for (var i = items.length - 1; i >= 0; i--) {
      if (items[i].classList.contains(styleClass)) {
        lastItem = items[i];
        break;
      }
    }

    if (lastItem) {
      return !DataCollectionUtils.isElementIntersectingScrollerBounds(lastItem, this._getScroller());
    }

    // no items
    return false;
  };

  /**
   * Remove any duplicate items given set of keys.  This is currrently needed because of JET-40746.
   * And we are only doing it during the fetch more triggered by insert mutation event.
   * @private
   */
  IteratingDataProviderContentHandler.prototype._removeDuplicateItems = function (keys) {
    if (this._hasPendingInsertKeys()) {
      var self = this;
      // populate initial values using Map instead of KeyMap because we know the keys are unique to avoid
      // the overhead checking logic
      var elemMap = new Map();
      this.m_root
        .querySelectorAll('.' + this.m_widget.getItemElementStyleClass())
        .forEach(function (elem) {
          if (elem.tagName !== 'LI') {
            // this elem is in the middle of insert animation
            // eslint-disable-next-line no-param-reassign
            elem = elem.parentNode;
          }
          var key = self.GetKey(elem);
          if (key != null) {
            elemMap.set(key, elem);
          }
        });

      var keyMap = new KeyMap(elemMap);
      keys.forEach(function (key) {
        var elem = keyMap.get(key);
        if (elem && elem.parentNode) {
          elem.parentNode.removeChild(elem);
        }
      });
    }
  };

  /**
   * Callback for handling fetch success
   * @param {Array} data the array of data
   * @param {Array} keys the array of keys
   * @param {boolean} doneOrMaxLimitReached true if there are no more data or max count limit reached, false otherwise
   * @param {Object} templateEngine the template engine to process inline template
   * @return {boolean} true if items are rendered when idle, false otherwise
   * @return {Promise} a promise that resolves to true to skip post processing, and false otherwise
   * @private
   */
  IteratingDataProviderContentHandler.prototype._handleFetchSuccess = function (
    data,
    keys,
    doneOrMaxLimitReached,
    templateEngine,
    isMouseWheel,
    metadata,
    isInitialFetch
  ) {
    // listview might have been destroyed before fetch success is handled
    if (this.m_widget == null) {
      return Promise.resolve(true);
    }

    // remove any existing items with the same key first
    this._removeDuplicateItems(keys);

    var index = this.m_root.querySelectorAll('.' + this.m_widget.getItemElementStyleClass()).length;
    if (
      index > 0 &&
      !doneOrMaxLimitReached &&
      this._isLastItemNotInViewport() &&
      this.m_widget.m_scrollPosition == null
    ) {
      // clone the data since we are going to manipulate the array
      // just in case the DataProvider returns something that references internal structure
      this.signalTaskStart('render items during idle time'); // signal task start
      var metadataCopy = metadata != null ? metadata.slice(0) : null;
      this._renderItemsWhenIdle(
        data.slice(0),
        keys.slice(0),
        index,
        templateEngine,
        isMouseWheel,
        metadataCopy
      );
      return Promise.resolve(true);
    }

    var parent = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var key = keys[i];
      var callbackFunc = this._isFetchFromInsert(key)
        ? this.afterRenderItemForInsertEvent.bind(this)
        : null;
      // passing -1 for opt since we know it will be inserted at the end of the parent
      this.addItem(
        parent,
        -1,
        row,
        this.getMetadata(index, key, row),
        templateEngine,
        callbackFunc,
        metadata != null ? metadata[i] : null
      );
      index += 1;
    }

    return this.animateShowContent(this.m_root, parent, isInitialFetch);
  };

  /**
   * Handles fetched data initiated by the DomScroller (scroll and fetch, or checkViewport)
   * @protected
   */
  IteratingDataProviderContentHandler.prototype.handleDomScrollerFetchedData = function (result) {
    if (result != null) {
      this.signalTaskStart('handle results from DomScroller'); // signal task start

      // remove any loading indicator, which is always added to the end after fetch
      this._removeLoadingIndicator();

      if (this.IsReady()) {
        this.signalTaskStart('dummy task'); // start a dummy task to be paired with the fetchEnd() call below if no new data were fetched.
      }

      // in card layout mode, the root is an additional element created by ListView, and that will be disassociated by ListView when
      // it is empty, re-append it to the root ul (the superRoot)
      if (
        this.isCardLayout() &&
        this.m_superRoot &&
        this.m_root.childNodes.length === 0 &&
        this.m_root.parentNode
      ) {
        this.m_superRoot.appendChild(this.m_root.parentNode);
      }

      this._handleFetchedData(result, this.getTemplateEngine(), false); // will call fetchEnd(), which signals a task end. Started either in fetchRows() or in a dummy task not involving data fetch.

      if (result.value && result.value.data) {
        if (!this._hasPendingInsertKeys()) {
          this.m_widget.updateStatusFetchEnd(result.value.data.length);
        }
      } else if (result.maxCountLimit) {
        // value could be null but maxCountLimit set, which could happen if for example
        // maxCount is a multiple of fetchSize
        this._handleScrollerMaxRowCount();
        // since fetchEnd would not be called in this case
        this.signalTaskEnd(); // signal task end
      }

      // reset cached scroll height
      this.m_widget.m_scrollHeight = null;

      this.signalTaskEnd(); // signal task end
    } else {
      // when there's no more data or any other unexpected cases
      this._removeLoadingIndicator();
    }
  };

  /**
   * Register the DomScroller
   * @private
   */
  IteratingDataProviderContentHandler.prototype._registerDomScroller = function () {
    var self = this;

    var options = {
      fetchSize: this._getFetchSize(),
      fetchTrigger: this._getFetchTrigger(),
      maxCount: this._getMaxCount(),
      asyncIterator: this.m_dataProviderAsyncIterator,
      initialRowCount: this.m_root.childElementCount,
      success: function (result) {
        self.signalTaskEnd(); // for beforeFetch
        self.handleDomScrollerFetchedData(result);
        if (self.m_root == null || result.value == null) {
          // in this case fetchEnd will not be called so we will need to clean up for signalTaskStart in scrollFetch callback
          self.signalTaskEnd();
          if (self.m_root != null) {
            // this is called as part of fetchEnd, see 
            self.m_widget.renderComplete(true);
          }
        }
      },
      error: function () {
        self.signalTaskEnd(); // for beforeFetch
        self.signalTaskEnd(); // for dummy task
      },
      localKeyValidator: function (key) {
        if (self.m_widget) {
          return self.m_widget.FindElementByKey(key) != null;
        }
        return false;
      },
      beforeFetch: function (scrollTop, isCheckViewport) {
        self.handleBeforeFetch();
        self.m_viewportCheckPromise = null;
        if (self.m_idleCallback != null) {
          return false;
        }

        if (!isCheckViewport) {
          self.signalTaskStart('starts high-water mark scrolling'); // signal domscroller data fetching. Ends either in success call (m_domScrollerMaxCountFunc) or in error call (self.signalTaskEnd)
          self.m_widget.updateStatusFetchStart();
        }
        return true;
      },
      beforeScroll: this.m_widget.mergeScrollListener()
    };

    var scroller = this._getScroller();
    if (scroller !== this.m_widget.getListContainer()[0]) {
      options.contentElement = this.m_root;
      if (scroller === document.documentElement) {
        options.isOverflow = this._isLastItemNotInViewport.bind(this);
      }
    }
    this.m_domScroller = new DomScroller(scroller, this.getDataProvider(), options);
  };

  IteratingDataProviderContentHandler.prototype.handleBeforeFetch = function () {
    if (this.m_loadingIndicator) {
      this.m_loadingIndicator.get(0).style.visibility = 'visible';
    }

    if (this.m_fillerSkeletons) {
      this.m_fillerSkeletons.style.visibility = 'visible';
    }
  };

  IteratingDataProviderContentHandler.prototype._clearEventQueue = function () {
    if (this.m_eventQueue != null) {
      this.m_eventQueue.length = 0;
    }
  };

  IteratingDataProviderContentHandler.prototype.handleModelMutateEvent = function (event) {
    if (this.m_dataProviderAsyncIterator === undefined) {
      return;
    }
    IteratingDataProviderContentHandler.superclass.handleModelMutateEvent.call(this, event);
  };

  /**
   * Model add event handler.
   * @param {Object} event the model add event
   * @return {boolean} true if the event is processed, false otherwise
   * @protected
   */
  IteratingDataProviderContentHandler.prototype.handleModelAddEvent = function (event) {
    this.m_currentEvents.push(event);
    var processed = IteratingDataProviderContentHandler.superclass.handleModelAddEvent.call(
      this,
      event
    );
    if (!processed) {
      this.m_currentEvents.pop();
    }
    return processed;
  };

  /**
   * Returns the insert before element given the index, or null if insert at the end.
   * @return {Element|null} the reference element.
   * @protected
   * @override
   */
  IteratingDataProviderContentHandler.prototype.GetReferenceNode = function (parentElement, index) {
    var referenceNode = IteratingDataProviderContentHandler.superclass.GetReferenceNode.call(
      this,
      parentElement,
      index
    );
    if (referenceNode == null && this.m_loadingIndicator != null) {
      return this.m_loadingIndicator.get(0);
    }
    return referenceNode;
  };

  /**
   * Gets the maximum index for insert event
   * @private
   */
  IteratingDataProviderContentHandler.prototype._getMaxIndexForInsert = function () {
    var max = Number.MAX_VALUE;
    // temporary solution for SDP
    if (
      DataCollectionUtils.isIterateAfterDoneNotAllowed(this.getDataProvider()) &&
      !this.hasMoreToFetch()
    ) {
      return max;
    }

    // only care about child count if there's more to fetch
    if (this._isLoadMoreOnScroll()) {
      max = $(this.m_root).children('li.' + this.m_widget.getItemElementStyleClass()).length;

      // todo: maybe can combine to a single selector
      var itemsToAdd = this.m_root.querySelectorAll('.oj-listview-temp-item');
      var itemsToAddButRemove = this.m_root.querySelectorAll(
        '.oj-listview-temp-item.oj-listview-item-remove'
      );
      max = Math.max(0, max + itemsToAdd.length - itemsToAddButRemove.length);
    }

    return max;
  };

  /**
   * Do the actual adding items to DOM based on model insert event
   * @protected
   */
  IteratingDataProviderContentHandler.prototype.addItemsForModelInsert = function (
    data,
    indexes,
    keys,
    parentKeys,
    isBeforeKeys,
    refKeys,
    metadata
  ) {
    // index to determine whether it's outside of range of not
    var max = this._getMaxIndexForInsert();

    // template engine should have already been loaded
    var templateEngine = this.getTemplateEngine();

    var promises = [];
    for (var i = 0; i < data.length; i++) {
      // ignore if the item with key already exists
      if (this.FindElementByKey(keys[i]) != null) {
        // eslint-disable-next-line no-continue
        continue;
      }

      this.signalTaskStart('handling model add event for item: ' + keys[i]); // signal add item start
      // indexes takes precedence
      var index;
      if (indexes != null) {
        index = indexes[i];
      } else {
        index = this.getIndex(refKeys, i);
        if (index > -1) {
          index = isBeforeKeys ? index : index + 1;
        } else if (this._isLoadMoreOnScroll()) {
          // if append to the end
          if (
            !DataCollectionUtils.isIterateAfterDoneNotAllowed(this.getDataProvider()) ||
            this.hasMoreToFetch()
          ) {
            index = max;
          }
        }
      }
      // we skip any insert/append outside of range if there's still more to fetch
      if (index < max) {
        var promise = this.addItem(
          this.m_root,
          index,
          data[i],
          this.getMetadata(index, keys[i], data[i]),
          templateEngine,
          this.afterRenderItemForInsertEvent.bind(this),
          metadata != null ? metadata[i] : null
        );
        if (promise) {
          promises.push(promise);
        }
        max += 1;
      } else {
        if (this.m_insertOutOfRangeKeys == null) {
          if (this.m_dataProvider.createOptimizedKeySet) {
            this.m_insertOutOfRangeKeys = this.m_dataProvider.createOptimizedKeySet();
          } else {
            this.m_insertOutOfRangeKeys = new KeySet();
          }
        }
        this.m_insertOutOfRangeKeys.add(keys[i]);
      }
      this.signalTaskEnd(); // signal add item end
    }

    if (promises.length < data.length) {
      // there are some items out of range, we'll need to ensure DomScroller is active
      // so that we can get them from checkViewport
      if (this.m_domScroller == null) {
        if (this._isLoadMoreOnScroll()) {
          this._registerDomScroller();
        }
      } else {
        // make sure it is active
        this.m_domScroller.setAsyncIterator(this.m_dataProviderAsyncIterator);
      }
    }

    if (promises.length === 0) {
      // every item to be insert are out of range, but we still need to checkViewport
      this.m_currentEvents.pop();
      if (this.m_currentEvents.length === 0) {
        this.afterItemsInserted(true, true);
      }
    } else {
      var self = this;
      Promise.all(promises).then(function () {
        if (self.m_widget) {
          self.m_currentEvents.pop();
          if (self.m_currentEvents.length === 0) {
            self.afterItemsInserted(true, true);
          }
        }
      });
    }
  };

  /**
   * Checks whether the item with the key is fetched triggered by insert event
   * @private
   */
  IteratingDataProviderContentHandler.prototype._isFetchFromInsert = function (key) {
    if (this.m_insertOutOfRangeKeys == null) {
      return false;
    }
    return this.m_insertOutOfRangeKeys.has(key);
  };

  /**
   * Model remove event handler.
   * @param {Object} event the model remove event
   * @return {boolean} true if the event is processed, false otherwise
   * @protected
   */
  IteratingDataProviderContentHandler.prototype.handleModelRemoveEvent = function (event) {
    this.m_currentEvents.push(event);

    var processed = IteratingDataProviderContentHandler.superclass.handleModelRemoveEvent.call(
      this,
      event
    );
    if (processed) {
      var remainingItem = this.m_root.querySelector('li.' + this.m_widget.getItemElementStyleClass());
      if (remainingItem == null && this.m_loadingIndicator) {
        this.m_loadingIndicator.get(0).style.display = 'none';
      }
    } else {
      this.m_currentEvents.pop();
    }
    return processed;
  };

  IteratingDataProviderContentHandler.prototype.handleRemoveItemsPromises = function (promises) {
    if (promises.length === 0) {
      // all items to be remove are out of range
      this.m_currentEvents.pop();
    } else {
      var self = this;
      // check viewport after multiple items are removed
      Promise.all(promises).then(function () {
        if (self.m_widget) {
          self.m_currentEvents.pop();
          if (self.m_currentEvents.length === 0) {
            self.checkViewport();
          }
        }
      });
    }
  };

  /**
   * Model refresh event handler.  Called when all rows has been removed from the underlying data.
   * @param {Object} event the model refresh event
   * @protected
   */
  IteratingDataProviderContentHandler.prototype.handleModelRefreshEvent = function (event) {
    if (this.m_root == null) {
      return;
    }

    // any outstanding idle-time rendering should immediately be stopped
    this._cancelIdleCallback();

    // if listview is busy, hold that off until later, the refresh must be handled in order
    // since we don't know when the results are coming back in
    if (!this.IsReady()) {
      this._pushToEventQueue({ type: event.type, event: event });
      return;
    }

    this.signalTaskStart('handling model reset event'); // signal method task start

    // since we are refetching everything, we should just clear out any outstanding model events
    this._clearEventQueue();

    // empty everything (later) and clear cache (including KeyMap)
    this.m_widget.ClearCache(true);

    // it will be recreated with a new asyncIterator
    this._destroyDomScroller();

    // handle scrollPositionPolicy on refresh
    this.m_widget.adjustScrollPositionValueOnFetch();

    // reset focus if needed
    this.m_widget.resetFocusBeforeRefresh();

    // fetch data
    this.fetchRows(true);

    this.signalTaskEnd(); // signal method task end
  };

  /**
   * Handle fetched data, either from a fetch call or from a sync event
   * @param {Object} dataObj the fetched data object
   * @private
   */
  IteratingDataProviderContentHandler.prototype._handleFetchedData = function (
    dataObj,
    templateEngine,
    isInitialFetch
  ) {
    // this could happen if destroy comes before fetch completes (note a refresh also causes destroy)
    if (this.m_root == null || dataObj.value == null) {
      return;
    }

    var data = dataObj.value.data;
    var metadata = dataObj.value.metadata;
    var suggestions = 0;
    if (isInitialFetch && !this.isCardLayout()) {
      suggestions = this.handleSuggestions(metadata);
    }
    var keys = metadata.map(function (value) {
      return value.key;
    });

    if (data.length === keys.length) {
      this._handleFetchSuccess(
        data,
        keys,
        dataObj.done || dataObj.maxCountLimit,
        templateEngine,
        dataObj.isMouseWheel,
        metadata,
        isInitialFetch
      ).then(
        function (skipPostProcessing) {
          // component could have been destroyed
          if (this.m_widget == null) {
            return;
          }

          var nothingInserted = keys != null && keys.length === 0;

          if (this._isLoadMoreOnScroll()) {
            if (!dataObj.done) {
              // if number of items returned is zero but result indicates it's not done
              // log it
              if (nothingInserted) {
                Logger.info('handleFetchedData: zero data returned while done flag is false');
              }

              // always append the loading indicator at the end except the case when max limit has been reached
              if (!skipPostProcessing && !dataObj.maxCountLimit) {
                if (this.m_domScroller == null) {
                  this._registerDomScroller();

                  // in Safari, handleResize would not get invoked with the initial width/height
                  // call getRootElementHeight method to trigger height caching
                  this.getRootElementHeight();
                }

                if (!nothingInserted || this.m_domScroller.isOverflow()) {
                  this._appendLoadingIndicator();
                }
              }
            } else if (this.m_domScroller) {
              // no more data, but DomScroller still active from before
              this._destroyDomScroller();
            }
          }

          if (isInitialFetch) {
            this.m_suggestions = suggestions;
            if (suggestions > 0) {
              // wait until items completely render otherwise we won't get an accurate height
              var busyContext = Context.getContext(this.m_root).getBusyContext();
              busyContext.whenReady().then(() => {
                // if listview not destroyed and suggetion hasn't change while waiting for render
                // which could happen if there is a refresh event before sparkles are rendered
                if (this.m_widget && this.m_suggestions === suggestions) {
                  this.renderSparkles(this.getItems(this.m_root, suggestions));
                }
              });
            }
          }

          if (dataObj.maxCountLimit) {
            this._handleScrollerMaxRowCount();
          }

          this.fetchEnd(skipPostProcessing, !nothingInserted || !dataObj.done, isInitialFetch);

          // disable tabbable elements once the fetched items are rendered
          if (!nothingInserted) {
            this.disableAllTabbableElements();
          }
        }.bind(this)
      );
    }
  };

  IteratingDataProviderContentHandler.prototype.disableAllTabbableElements = function () {
    var lastItemIndex = this.m_root.childElementCount;
    if (
      this.shouldUseGridRole() &&
      this.m_root.lastElementChild &&
      this.m_root.lastElementChild.getAttribute('role') === 'presentation'
    ) {
      lastItemIndex -= 1;
    }

    var self = this;
    var busyContext = Context.getContext(this.m_root).getBusyContext();
    busyContext.whenReady().then(function () {
      if (self.m_root != null) {
        var children = self.m_root.children;
        for (var i = 0; i < lastItemIndex; i++) {
          if (children[i]) {
            self.m_widget.disableAllTabbableElements(children[i]);
          }
        }
      }
    });
  };

  /**
   * Do any logic after items are inserted into the DOM
   * @private
   */
  IteratingDataProviderContentHandler.prototype.afterItemsInserted = function (
    checkViewport,
    skipSyncScrollPosition
  ) {
    if (this.m_widget) {
      var self = this;
      var _animationPromise = this.m_widget.renderComplete(skipSyncScrollPosition);
      if (_animationPromise) {
        _animationPromise.then(function () {
          self.m_animationPromise = null;
        });
      }
      this.m_animationPromise = _animationPromise;

      // process any outstanding events
      this._processEventQueue();

      // check viewport
      var promise;
      if (checkViewport) {
        if (this.m_widget.ojContext._IsCustomElement()) {
          // for custom element, content could render async so we'll need to wait for content to render completely
          // so that we have the correct height before checking viewport.  For example, we want to avoid excessive
          // fetch if the height expanded which causes overflow.  On the other hand, if the height contracted then
          // we could potentially have an underflow that requires an additional fetch.
          var rootElement = self.m_superRoot != null ? self.m_superRoot : self.m_root;
          var busyContext = Context.getContext(rootElement).getBusyContext();
          var viewportCheckPromise = busyContext.whenReady();
          viewportCheckPromise.then(function () {
            if (self.m_widget != null) {
              // card dimension could be not available until now where the card is fully rendered
              // adjust loadmore skeletons that were previously rendered
              if (
                self.isCardLayout() &&
                self.m_cardDim === undefined &&
                self.m_loadingIndicator != null
              ) {
                self._adjustLoadMoreSkeletons(self._getRootElementWidth(true), true);
              }

              if (self.m_viewportCheckPromise != null) {
                promise = self.checkViewport(_animationPromise);
                if (promise == null) {
                  self._clearInsertOutOfRangeKeys();
                }
              }
            }
          });
          self.m_viewportCheckPromise = viewportCheckPromise;
        } else {
          // for widget, we'll need to keep the old behavior
          promise = this.checkViewport();
          if (promise == null) {
            this._clearInsertOutOfRangeKeys();
          }
        }
      }
    }
  };

  /**
   * Do any logic needed after results from fetch are processed
   * @private
   */
  IteratingDataProviderContentHandler.prototype.fetchEnd = function (
    skipPostProcessing,
    checkViewport,
    isInitialFetch
  ) {
    // fetch is done
    this._setFetching(false);

    if (!skipPostProcessing) {
      this.afterItemsInserted(checkViewport, !isInitialFetch);
    }

    // signal fetch end. Started in either fetchRows() or started as a dummy task whenever this
    // method is called without fetching rows first (e.g. see m_domScrollerMaxCountFunc).
    this.signalTaskEnd();
  };

  /**
   * Checks the viewport for card layout case
   * @private
   */
  IteratingDataProviderContentHandler.prototype._checkHorizontalViewport = function () {
    if (this.isCardLayout()) {
      var items = this.m_root.children;
      var styleClass = this.m_widget.getItemElementStyleClass();
      var lastItem;
      for (var i = items.length - 1; i >= 0; i--) {
        if (items[i].classList.contains(styleClass)) {
          lastItem = items[i];
          break;
        }
      }

      if (lastItem) {
        var scroller = this._getScroller();
        var scrollerHeight =
          scroller === this.m_root ? this.getRootElementHeight() : scroller.clientHeight;
        if (scroller === document.documentElement) {
          var rect = lastItem.getBoundingClientRect();
          if (rect.top <= scrollerHeight && rect.top + rect.height >= 0) {
            this.handleBeforeFetch();
            return this.m_domScroller._fetchMoreRows();
          }
        } else {
          var scrollTop = scroller.scrollTop;
          var offsetTop = lastItem.offsetTop;
          var scrollerOffsetTop = scroller === this.m_root ? 0 : this._getScrollerOffsetTop();
          if (offsetTop > scrollTop && offsetTop < scrollTop + scrollerHeight - scrollerOffsetTop) {
            this.handleBeforeFetch();
            return this.m_domScroller._fetchMoreRows();
          }
        }
      }
    }
    return null;
  };

  /**
   * @private
   */
  IteratingDataProviderContentHandler.prototype._clearInsertOutOfRangeKeys = function () {
    if (this.m_insertOutOfRangeKeys != null) {
      this.m_insertOutOfRangeKeys.clear();
    }
  };

  /**
   * Checks the viewport to see if additional fetch is needed
   * @protected
   */
  IteratingDataProviderContentHandler.prototype.checkViewport = function (animationPromise) {
    var self = this;

    // if we are already in the process of fetch due to checkViewport, bail
    if (this.m_checkViewportPromise) {
      return null;
    }

    this.signalTaskStart('checking viewport'); // signal method task start

    // if loadMoreOnScroll then check if we have underflow and do a fetch if we do
    var fetchPromise;
    if (this.m_domScroller != null && this.IsReady()) {
      fetchPromise = this.m_domScroller.checkViewport();
      if (fetchPromise != null) {
        this.signalTaskStart('got promise from checking viewport'); // signal fetchPromise started. Ends in promise resolution below
        fetchPromise.then(function (result) {
          // make sure listview is not destroyed yet
          if (self.m_widget != null) {
            if (result != null) {
              self.m_checkViewportPromise = null;
              self.handleDomScrollerFetchedData(result);
            } else {
              var _horizontalViewportCheck = function () {
                fetchPromise = self._checkHorizontalViewport();
                if (fetchPromise != null) {
                  self.signalTaskStart('got promise from checking horizontal viewport');
                  fetchPromise.then(function (moreResult) {
                    self.m_checkViewportPromise = null;
                    if (self.m_widget != null && moreResult != null) {
                      self.handleDomScrollerFetchedData(moreResult);
                    }
                    self.signalTaskEnd();
                  }, null);
                } else {
                  self.m_checkViewportPromise = null;
                }
              };

              if (animationPromise) {
                self.signalTaskStart('wait for animation to complete');
                animationPromise.then(function () {
                  self.signalTaskEnd();
                  if (self.m_widget != null && self.m_domScroller != null) {
                    _horizontalViewportCheck();
                  }
                });
              } else {
                _horizontalViewportCheck();
              }
            }
            self.signalTaskEnd(); // signal checkViewport task end. Started above before fetchPromise resolves here;
          }

          // clear all fetch by insert keys
          self._clearInsertOutOfRangeKeys();
        }, null);
      } else {
        this._clearInsertOutOfRangeKeys();
      }

      this.m_checkViewportPromise = fetchPromise;
    }

    this.signalTaskEnd(); // signal method task end

    return fetchPromise;
  };

  exports.DataProviderContentHandler = DataProviderContentHandler;
  exports.IteratingDataProviderContentHandler = IteratingDataProviderContentHandler;

  Object.defineProperty(exports, '__esModule', { value: true });

});
