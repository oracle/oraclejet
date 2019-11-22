/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojconfig', 'ojs/ojhtmlutils', 'ojs/ojlogger', 'ojs/ojthemeutils', 'ojs/ojlistdataproviderview', 'ojs/ojtreedataproviderview', 'ojs/ojcontext', 'ojs/ojtimerutils', 'ojs/ojkeyset', 'ojs/ojeditablevalue', 'ojs/ojlistview', 'ojs/ojbutton', 'ojs/ojpopupcore', 'ojs/ojinputtext', 'ojs/ojbutton'],
       function(oj, $, Components, Config, HtmlUtils, Logger, ThemeUtils, ListDataProviderView, TreeDataProviderView, Context, TimerUtils, ojkeyset)
{
  "use strict";
//%COMPONENT_METADATA%
var __oj_select_single_metadata = 
{
  "properties": {
    "data": {
      "type": "oj.DataProvider"
    },
    "describedBy": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "displayOptions": {
      "type": "object",
      "properties": {
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
          "type": "Array<string>|string",
          "value": [
            "inline"
          ]
        }
      }
    },
    "help": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string",
          "value": ""
        }
      }
    },
    "helpHints": {
      "type": "object",
      "properties": {
        "definition": {
          "type": "string",
          "value": ""
        },
        "source": {
          "type": "string",
          "value": ""
        }
      }
    },
    "itemText": {
      "type": "string|function",
      "value": "label"
    },
    "labelEdge": {
      "type": "string",
      "enumValues": [
        "inside",
        "none",
        "provided"
      ]
    },
    "labelHint": {
      "type": "string",
      "value": ""
    },
    "labelledBy": {
      "type": "string"
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "placeholder": {
      "type": "string",
      "value": ""
    },
    "readonly": {
      "type": "boolean",
      "value": false
    },
    "required": {
      "type": "boolean",
      "value": false
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "cancel": {
          "type": "string"
        },
        "labelAccOpenDropdown": {
          "type": "string"
        },
        "multipleMatchesFound": {
          "type": "string"
        },
        "nOrMoreMatchesFound": {
          "type": "string"
        },
        "noMatchesFound": {
          "type": "string"
        },
        "noResultsLine1": {
          "type": "string"
        },
        "noResultsLine2": {
          "type": "string"
        },
        "oneMatchFound": {
          "type": "string"
        },
        "required": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "string"
            },
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        }
      }
    },
    "valid": {
      "type": "string",
      "writeback": true,
      "enumValues": [
        "invalidHidden",
        "invalidShown",
        "pending",
        "valid"
      ],
      "readOnly": true
    },
    "value": {
      "type": "any",
      "writeback": true
    },
    "valueItem": {
      "type": "object",
      "writeback": true,
      "value": {
        "key": null,
        "data": null,
        "metadata": null
      }
    },
    "virtualKeyboard": {
      "type": "string",
      "enumValues": [
        "email",
        "number",
        "search",
        "tel",
        "text",
        "url"
      ],
      "value": "search"
    }
  },
  "methods": {
    "refresh": {},
    "validate": {},
    "reset": {},
    "showMessages": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateStart": {},
    "ojAnimateEnd": {}
  },
  "extension": {}
};


/* global Symbol:false, Promise:false, Set:false, Map:false */

/**
 * @private
 */
// eslint-disable-next-line no-unused-vars
function FilteringDataProviderView(dataProvider) {
  this._fetchedDataCount = {
    count: 0,
    done: true
  }; // FilteringDataProviderView

  this.setFilterCriterion = function (filterCriterion) {
    var oldFilterCriterion = this._filterCriterion;
    this._filterCriterion = filterCriterion; // only dispatch refresh event if the filterCriterion is different from the previous one

    if (!_compareFilterCriterion(oldFilterCriterion, this._filterCriterion)) {
      var event = new oj.DataProviderRefreshEvent(); // use defineProperty to create the filterCriterionChanged prop so that it's not enumerable

      Object.defineProperty(event, 'filterCriterionChanged', {
        value: true
      });
      this.dispatchEvent(event);
    }
  }; // FilteringDataProviderView


  this.getFetchedDataCount = function () {
    return this._fetchedDataCount;
  }; // FilteringDataProviderView


  function _compareFilterCriterion(fc1, fc2) {
    return fc1 === fc2 || !fc1 && !fc2 || fc1 && fc2 && fc1.text === fc2.text;
  } // FilteringDataProviderView


  function WrappingAsyncIterable(iterator, fetchedDataCount) {
    var _asyncIterator = new WrappingAsyncIterator(iterator, fetchedDataCount);

    this[Symbol.asyncIterator] = function () {
      return _asyncIterator;
    };
  } // FilteringDataProviderView


  function WrappingAsyncIterator(iterator, fetchedDataCount) {
    this.next = function () {
      var promise = iterator.next();
      return new Promise(function (resolve, reject) {
        promise.then(function (nextResults) {
          var nextValue = nextResults.value;

          if (nextValue.data) {
            // eslint-disable-next-line no-param-reassign
            fetchedDataCount.count += nextValue.data.length;
          } // eslint-disable-next-line no-param-reassign


          fetchedDataCount.done = nextResults.done;
          resolve(nextResults);
        }, function (reason) {
          reject(reason);
        });
      });
    };
  } // FilteringDataProviderView


  this.fetchFirst = function (params) {
    if (dataProvider) {
      // always pass filter criterion to underlying data provider because component will make sure
      // it is a ListDataProviderView and call the FilterFactory to do local filtering if needed
      if (this._filterCriterion) {
        // eslint-disable-next-line no-param-reassign
        params.filterCriterion = this._filterCriterion;
      } // return dataProvider.fetchFirst(params);


      this._fetchedDataCount = {
        count: 0,
        done: true
      };
      var asyncIterable = dataProvider.fetchFirst(params);
      var asyncIterator = asyncIterable[Symbol.asyncIterator]();
      return new WrappingAsyncIterable(asyncIterator, this._fetchedDataCount);
    }

    var retObj = {};

    retObj[Symbol.asyncIterator] = function () {
      return {
        next: function next() {
          return Promise.resolve({
            value: {
              data: [],
              fetchParameters: params,
              metadata: []
            },
            done: true
          });
        }
      };
    };

    return retObj;
  }; // FilteringDataProviderView


  this.containsKeys = function (params) {
    if (dataProvider) {
      return dataProvider.containsKeys(params);
    }

    return Promise.resolve({
      containsParameters: params,
      results: new Set()
    });
  }; // FilteringDataProviderView


  this.fetchByKeys = function (params) {
    if (dataProvider) {
      return dataProvider.fetchByKeys(params);
    }

    return Promise.resolve({
      fetchParameters: params,
      results: new Map()
    });
  }; // FilteringDataProviderView


  this.fetchByOffset = function (params) {
    if (dataProvider) {
      return dataProvider.fetchByOffset(params);
    }

    return Promise.resolve({
      done: true,
      fetchParameters: params,
      results: []
    });
  }; // FilteringDataProviderView


  this.isEmpty = function () {
    if (dataProvider) {
      return dataProvider.isEmpty();
    }

    return 'yes';
  }; // FilteringDataProviderView


  this.getTotalSize = function () {
    if (dataProvider) {
      return dataProvider.getTotalSize();
    }

    return Promise.resolve(0);
  }; // FilteringDataProviderView


  this.addEventListener = function (eventType, listener) {
    if (dataProvider) {
      dataProvider.addEventListener(eventType, listener);
    }
  }; // FilteringDataProviderView


  this.removeEventListener = function (eventType, listener) {
    if (dataProvider) {
      dataProvider.removeEventListener(eventType, listener);
    }
  }; // FilteringDataProviderView


  this.dispatchEvent = function (evt) {
    if (dataProvider) {
      return dataProvider.dispatchEvent(evt);
    }

    return true;
  }; // FilteringDataProviderView


  this.getCapability = function (capabilityName) {
    if (dataProvider) {
      return dataProvider.getCapability(capabilityName);
    }

    return null;
  }; // If dataProvider is hierarchical, create getChildDataProvider for
  // ourselves to delegate to that provider's own call


  if (dataProvider && oj.DataProviderFeatureChecker.isTreeDataProvider(dataProvider)) {
    this.getChildDataProvider = function () {
      var childDp = dataProvider.getChildDataProvider.apply(dataProvider, arguments);

      if (childDp) {
        childDp = new FilteringDataProviderView(childDp); // Pass our filter criterion onto the child right away

        if (this._filterCriterion) {
          childDp.setFilterCriterion(this._filterCriterion);
        }
      }

      return childDp;
    }.bind(this);
  }
}



/* global Promise:false, Context:false */

/**
 * @private
 */
var LovUtils = {
  // LovUtils
  KEYS: {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    HOME: 36,
    END: 35,
    BACKSPACE: 8,
    DELETE: 46
  },
  // LovUtils
  ValueChangeTriggerTypes: {
    OPTION_SELECTED: 'option_selected'
  },
  // LovUtils
  _isControlKey: function _isControlKey(event) {
    switch (event.which) {
      case LovUtils.KEYS.SHIFT:
      case LovUtils.KEYS.CTRL:
      case LovUtils.KEYS.ALT:
        return true;

      default:
        return event.metaKey || event.ctrlKey;
    }
  },
  // LovUtils
  _isFunctionKey: function _isFunctionKey(event) {
    var key = event.which ? event.which : event;
    return key >= 112 && key <= 123;
  },
  // LovUtils
  isControlOrFunctionKey: function isControlOrFunctionKey(event) {
    return LovUtils._isControlKey(event) || LovUtils._isFunctionKey(event);
  },
  // LovUtils
  nextUid: function () {
    var counter = 1;
    return function () {
      var ret = counter;
      counter += 1;
      return ret;
    };
  }(),
  // LovUtils
  killEvent: function killEvent(event) {
    event.preventDefault();
  },
  // LovUtils
  stopEventPropagation: function stopEventPropagation(event) {
    event.stopPropagation();
  },
  // LovUtils
  addBusyState: function addBusyState(elem, description) {
    var desc = "The component identified by '" + elem.id + "' " + description;
    var busyStateOptions = {
      description: desc
    };
    var busyContext = Context.getContext(elem).getBusyContext();
    return busyContext.addBusyState(busyStateOptions);
  },
  // LovUtils
  createValueItem: function createValueItem(value, data, metadata) {
    return {
      key: value,
      data: data,
      metadata: metadata
    };
  },
  // LovUtils
  dispatchCustomEvent: function dispatchCustomEvent(elem, type, subtype, _detail) {
    var detail = _detail || {};
    detail.subtype = subtype;
    var params = {
      bubbles: false,
      cancelable: false,
      detail: detail
    };
    return elem.dispatchEvent(new CustomEvent(type, params));
  },
  isValueItemForPlaceholder: function isValueItemForPlaceholder(valueItem) {
    return valueItem == null || LovUtils.isValueForPlaceholder(valueItem.key);
  },
  isValueForPlaceholder: function isValueForPlaceholder(value) {
    return value === null || value === undefined;
  },
  copyAttribute: function copyAttribute(sourceElem, sourceAttr, targetElem, targetAttr) {
    var value = sourceElem.getAttribute(sourceAttr);

    if (value === null) {
      targetElem.removeAttribute(targetAttr);
    } else {
      targetElem.setAttribute(targetAttr, value);
    }
  }
};



/* global LovUtils:false, Promise:false, Logger:false, Context:false, ojkeyset:false, HtmlUtils:false, Set:false */

/**
 * @private
 */
var LovDropdown = function LovDropdown(options) {
  // {dataProvider, className, parentId, idSuffix, fullScreenPopup, inputType,
  //  bodyElem, headerTemplate, footerTemplate, itemTemplate, collectionTemplate,
  //  getTemplateEngineFunc, templateContextComponentElement, getTranslatedStringFunc,
  //  addBusyStateFunc, itemTextRendererFunc, filterInputText, afterDropdownInitFunc}
  this._dataProvider = options.dataProvider;
  this._fullScreenPopup = options.fullScreenPopup;
  this._bodyElem = $(options.bodyElem); // this._headerTemplate = options.headerTemplate;
  // this._footerTemplate = options.footerTemplate;

  this._itemTemplate = options.itemTemplate;
  this._collectionTemplate = options.collectionTemplate;
  this._getTemplateEngineFunc = options.getTemplateEngineFunc;
  this._templateContextComponentElement = options.templateContextComponentElement;
  this._getTranslatedStringFunc = options.getTranslatedStringFunc;
  this._addBusyStateFunc = options.addBusyStateFunc;
  this._itemTextRendererFunc = options.itemTextRendererFunc;
  this._filterInputText = options.filterInputText; // this._maxDisplayCount = 50;
  // this._fetchSize = 50;
  // this._maxFetchCount = 1000;

  var resolveBusyState = this._addBusyStateFunc('LovDropdown initializing');

  this._addDataProviderEventListeners();

  var containerElem = this._createInnerDom(options);

  this._containerElem = containerElem;
  var renderPromiseResolve;
  var renderPromiseReject;
  var renderPromise = new Promise(function (resolve, reject) {
    renderPromiseResolve = resolve;
    renderPromiseReject = reject;
  });
  this._collectionContext = {
    parentElement: this._containerElem[0],
    idSuffix: options.idSuffix,
    renderDone: renderPromiseResolve,
    renderError: renderPromiseReject,
    // styleClass: 'oj-select-results', // 'oj-listbox-results',
    // role: 'listbox',
    data: this._dataProvider,
    searchText: undefined,
    selected: undefined,
    selectedItem: undefined,
    selectedItemChangedListener: this._handleCollectionSelectedItemChanged.bind(this)
  };
  this._collectionRendererFunc = this._collectionTemplate ? this._templateCollectionRenderer.bind(this) : this._defaultCollectionRenderer.bind(this);

  this._collectionRendererFunc(this._collectionContext);

  if (options.fullScreenPopup) {
    //   // find the dropdown's search field
    //   this._searchElem = containerElem.find('input.oj-listbox-input');
    var backButton = containerElem.find('#cancelButton_' + options.idSuffix);
    backButton.on('ojAction', function () {
      this._dispatchEvent('cancelDropdown');
    }.bind(this));
  }

  containerElem.on('change', '.' + options.className + '-input', LovUtils.stopEventPropagation); // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is
  // listening for mouse events outside of itself so it can close itself. since the dropdown
  // is now outside the combobox's dom it will trigger the popup close, which is not what we
  // want

  containerElem.on('click mouseup mousedown', LovUtils.stopEventPropagation); // var afterRenderPromise = function () {
  //   this._initializeTemplateItems();
  //   resolveBusyState();
  // }.bind(this);
  // Apply header and footer templates
  // if (this._headerTemplate || this._footerTemplate) {
  //   // only load templateEngine if we have templates
  //   this._getTemplateEngineFunc().then(function (engine) {
  //     var templateContext = this._getControlTemplateContext(engine);
  //     LovDropdown._applySlotTemplate(this._headerTemplate, templateContext, engine,
  //       containerElem[0]);
  //     LovDropdown._applySlotTemplate(this._footerTemplate, templateContext, engine,
  //       containerElem[0]);
  //     renderPromise.then(afterRenderPromise, resolveBusyState);
  //   }.bind(this));
  // } else {
  // renderPromise.then(afterRenderPromise, resolveBusyState);
  // }

  var afterRenderFunc = function () {
    if (options.afterDropdownInitFunc) {
      options.afterDropdownInitFunc(this._resultsElem[0]);
    }

    resolveBusyState();
  }.bind(this);

  renderPromise.then(afterRenderFunc, afterRenderFunc);
  containerElem.on('keydown', this._handleKeyDown.bind(this));
};
/**
 * Apply template contents for the slot to the container element
 * @param {HTMLElement} template The template whose contents will be applied to the container
 * @param {object} context The rendering context
 * @param {TemplateEngine} engine The template engine
 * @param {HTMLElement} containerElem The container element
 * @private
 */
// LovDropdown._applySlotTemplate = function (template, context, engine, containerElem) {
//   if (!template) {
//     return;
//   }
//   // Extract the slot name, and remove the 'Template' portion
//   var slotName = template.getAttribute('slot').split('Template')[0];
//   var slotPlaceholderElem = containerElem.querySelector('.oj-listbox-' + slotName + '-main');
//   var nodes = engine.execute(slotPlaceholderElem, template, context);
//   nodes.forEach(function (el) {
//     slotPlaceholderElem.appendChild(el); // @HTMLUpdateReview
//   });
// };


LovDropdown.prototype._dispatchEvent = function (subtype, detail) {
  return LovUtils.dispatchCustomEvent(this._containerElem[0], 'lovDropdownEvent', subtype, detail);
};

LovDropdown.prototype.destroy = function () {
  // TODO: release resources in here, like cleaning elements create by template engine as part of
  // fixing  - CALL TEMPLATEENGINE.CLEAN() FOR HEADER/FOOTER TEMPLATES
  // only load template engine if we actually have templates
  if ( // this._headerTemplate || this._footerTemplate ||
  this._itemTemplate || this._collectionTemplate) {
    this._getTemplateEngineFunc().then(function (templateEngine) {
      templateEngine.clean(this._containerElem[0]);
    }.bind(this));
  }

  this._removeDataProviderEventListeners();
};

LovDropdown.prototype.getElement = function () {
  return this._containerElem[0];
}; // LovDropdown.prototype.getResultsElement = function () {
//   return this._resultsElem[0];
// };
// LovDropdown.prototype.getSearchElem = function () {
//   return this._searchElem ? this._searchElem[0] : null;
// };


LovDropdown.prototype._createInnerDom = function (options) {
  var idSuffix = options.idSuffix; // var inputType = options.inputType;

  var getTranslatedStringFunc = options.getTranslatedStringFunc;
  var outerDiv = document.createElement('div');
  outerDiv.setAttribute('data-oj-containerid', options.parentId);
  outerDiv.setAttribute('data-oj-context', '');
  outerDiv.setAttribute('id', 'lovDropdown_' + idSuffix);
  outerDiv.setAttribute('class', 'oj-listbox-drop oj-listbox-searchselect' + (this._fullScreenPopup ? ' oj-listbox-fullscreen' : ''));
  outerDiv.style.display = 'none';
  outerDiv.setAttribute('role', 'presentation');

  if (this._fullScreenPopup) {
    var strCancel = getTranslatedStringFunc('cancel');
    var backButton = document.createElement('oj-button');
    backButton.textContent = strCancel;
    backButton.setAttribute('id', 'cancelButton_' + idSuffix);
    backButton.setAttribute('chroming', 'half'); // backButton.setAttribute('display', 'icons');

    backButton.setAttribute('data-oj-internal', '');
    backButton.setAttribute('data-oj-binding-provider', 'none');
    backButton.setAttribute('class', 'oj-searchselect-cancel'); // var backIcon = document.createElement('span');
    // backIcon.setAttribute('slot', 'endIcon');
    // backIcon.setAttribute('class', 'oj-fwk-icon oj-fwk-icon-back');
    // backButton.appendChild(backIcon);

    outerDiv.appendChild(backButton);
    outerDiv.appendChild(this._filterInputText);
  } // this._headerElem = $(LovDropdown._createSlotWrapper('header'));
  // outerDiv.appendChild(this._headerElem[0]); // @HTMLUpdateOK


  var resultsPlaceholder = document.createElement('div');
  resultsPlaceholder.setAttribute('class', 'oj-searchselect-results-placeholder');
  outerDiv.appendChild(resultsPlaceholder); // @HTMLUpdateOK
  // this._footerElem = $(LovDropdown._createSlotWrapper('footer'));
  // outerDiv.appendChild(this._footerElem[0]);

  return $(outerDiv);
};
/**
 * Create an element to wrap slot content
 * @param {string} slotName The name of the slot, "header"/"footer"
 */
// LovDropdown._createSlotWrapper = function (slotName) {
//   var wrapper = document.createElement('div');
//   wrapper.className = 'oj-listbox-' + slotName + '-wrapper';
//   var main = document.createElement('div');
//   main.className = 'oj-listbox-' + slotName + '-main';
//   wrapper.appendChild(main);
//   return wrapper;
// };


LovDropdown._highlighter = function (unhighlightedText, searchText) {
  if (searchText && searchText.length > 0) {
    return unhighlightedText.replace(new RegExp(searchText, 'gi'), '<span class="oj-listbox-highlighter">$&</span>');
  }

  return unhighlightedText;
};

LovDropdown.prototype._defaultItemRenderer = function (listViewItemContext) {
  // TODO: Can/should we expect to write directly to the <li> when using an item template or
  // collection template?
  var li = listViewItemContext.parentElement; // li.setAttribute('role', 'option');
  // var label = document.createElement('span');
  // label.setAttribute('id', 'oj-listbox-result-label-' + LovUtils.nextUid());
  // create label content

  var formatted = this._itemTextRendererFunc({
    key: listViewItemContext.key,
    data: listViewItemContext.data,
    metadata: listViewItemContext.metadata
  }); // only highlight matches for leaf nodes when data is hierarchical
  // the leaf property will be absent for flat data


  var isParent = listViewItemContext.leaf === false;
  var str = isParent ? formatted : LovDropdown._highlighter(formatted, this._collectionContext.searchText);
  var nodes = HtmlUtils.stringToNodeArray('<span>' + str + '</span>');

  for (var i = 0; i < nodes.length; i++) {
    // label.appendChild(nodes[i]);
    li.appendChild(nodes[i]);
  } // li.appendChild(label); // @HTMLUpdateReview
  // return li;

};

LovDropdown.prototype._templateItemRenderer = function (templateEngine, listViewItemContext) {
  var renderContext = $.extend({}, listViewItemContext);
  renderContext.componentElement = this._templateContextComponentElement;
  renderContext.searchText = this._collectionContext.searchText; // TODO: Can/should we expect to write directly to the <li> when using an item template or
  // collection template?

  var li = renderContext.parentElement; // li.setAttribute('role', 'option');
  // var label = document.createElement('span');
  // label.setAttribute('id', 'oj-listbox-result-label-' + LovUtils.nextUid());
  // create label content

  if (templateEngine) {
    var nodes = templateEngine.execute(renderContext.componentElement, this._itemTemplate, renderContext);

    for (var i = 0; i < nodes.length; i++) {
      // label.appendChild(nodes[i]);
      li.appendChild(nodes[i]);
    }
  } // li.appendChild(label); // @HTMLUpdateReview
  // return li;

};

LovDropdown.prototype.renderResults = function (searchText, filterCriteria, selectedValue) {
  var resolveBusyState = this._addBusyStateFunc('LovDropdown rendering results'); // save most recent filterCriteria so we know whether we need to apply highlighting


  this._latestFilterCriteria = filterCriteria;

  this._dataProvider.setFilterCriterion(filterCriteria); // ignore selection changed events during listView initialization


  this._duringListViewInitialization = true;
  var renderPromiseResolve;
  var renderPromiseReject;
  var renderPromise = new Promise(function (resolve, reject) {
    renderPromiseResolve = resolve;
    renderPromiseReject = reject;
  });
  var collectionContext = this._collectionContext;
  collectionContext.data = this._dataProvider;
  collectionContext.searchText = searchText;
  collectionContext.selected = new ojkeyset.KeySetImpl([selectedValue]);
  collectionContext.renderDone = renderPromiseResolve;
  collectionContext.renderError = renderPromiseReject;

  this._collectionRendererFunc(collectionContext);

  var afterRetPromiseFunc = function () {
    this._duringListViewInitialization = false;
    resolveBusyState();
  }.bind(this);

  var retPromise = new Promise(function (resolve, reject) {
    renderPromise.then(function () {
      // wait until the changes propagate to the collection and the collection handles the DP
      // refresh event due to filter criteria changing before resolving the promise
      var busyContext = Context.getContext(this._containerElem[0]).getBusyContext();
      busyContext.whenReady().then(resolve, reject);
    }.bind(this), reject);
  }.bind(this));
  return retPromise.then(function () {
    afterRetPromiseFunc();
  }, function (reason) {
    Logger.warn('Select: LovDropdown.renderResults retPromise rejected: ' + reason);
    afterRetPromiseFunc();
  });
};

LovDropdown.prototype.updateLabel = function (ariaLabelId, ariaLabel) {
  var resultsElem = this._resultsElem;

  if (!this._collectionTemplate && resultsElem) {
    var listView = resultsElem[0]; //  - oghag missing label for ojselect and ojcombobox

    if (ariaLabelId) {
      listView.setAttribute('aria-labelledby', ariaLabelId);
    } else if (ariaLabel) {
      listView.setAttribute('aria-label', ariaLabel);
    }
  }
};

LovDropdown.prototype._defaultCollectionRenderer = function (context) {
  var listView;
  var busyContext;

  if (!this._resultsElem) {
    var $parentElem = $(context.parentElement);
    var placeholderElem = $parentElem.find('.oj-searchselect-results-placeholder')[0];
    var idSuffix = context.idSuffix;
    listView = document.createElement('oj-list-view');
    listView.setAttribute('data-oj-internal', '');
    listView.setAttribute('data-oj-binding-provider', 'none');
    listView.setAttribute('id', 'oj-searchselect-results-' + idSuffix);
    listView.setAttribute('selection-mode', 'single');
    listView.setAttribute('class', 'oj-select-results');
    listView.setAttribute('drill-mode', 'none');
    listView.setAttribute('gridlines.item', 'hidden');
    var noDataTemplate = document.createElement('template');
    noDataTemplate.setAttribute('slot', 'noData');
    var noDataContainer = document.createElement('div');
    noDataContainer.setAttribute('class', 'oj-searchselect-no-results-container');
    var line1 = document.createElement('span');
    line1.setAttribute('class', 'oj-searchselect-no-results-line1');
    line1.innerText = this._getTranslatedStringFunc('noResultsLine1');
    noDataContainer.appendChild(line1);
    var line2 = document.createElement('span');
    line2.setAttribute('class', 'oj-searchselect-no-results-line2 oj-label-nocomp');
    line2.innerText = this._getTranslatedStringFunc('noResultsLine2');
    noDataContainer.appendChild(line2); // need to append to content documentFragment of template element instead of template itself
    // (the content doc fragment is undefined in IE11, so just append to the template itself)

    if (noDataTemplate.content) {
      noDataTemplate.content.appendChild(noDataContainer);
    } else {
      noDataTemplate.appendChild(noDataContainer);
    }

    listView.appendChild(noDataTemplate);
    context.parentElement.replaceChild(listView, placeholderElem);
    this._resultsElem = $(listView);

    this._resultsElem.on('click', LovUtils.killEvent);

    busyContext = Context.getContext(listView).getBusyContext();
    busyContext.whenReady().then(function () {
      listView.addEventListener('firstSelectedItemChanged', function (event) {
        context.selectedItemChangedListener(event.detail.value);
      });

      if (context.data && oj.DataProviderFeatureChecker && oj.DataProviderFeatureChecker.isTreeDataProvider(context.data)) {
        // Only allow leaf nodes to be focusable/selectable
        listView.item.focusable = function (fc) {
          return fc.leaf;
        };

        listView.item.selectable = function (sc) {
          return sc.leaf;
        };
      }

      if (this._itemTemplate) {
        this._getTemplateEngineFunc().then(function (templateEngine) {
          listView.item.renderer = this._templateItemRenderer.bind(this, templateEngine);
          context.renderDone();
        }.bind(this), function (reason) {
          Logger.warn('Select: template item renderer template engine promise rejected: ' + reason);
          context.renderError(reason);
        });
      } else {
        listView.item.renderer = this._defaultItemRenderer.bind(this);
        context.renderDone();
      }
    }.bind(this), function (reason) {
      Logger.warn('Select: creating default listView busyContext promise rejected: ' + reason);
      context.renderError(reason);
    });
  } else {
    listView = this._resultsElem[0]; // Need to wait until _SetupResources is called asynchronously on listView so that when we
    // set properties on it, the internal listView.isAvailable() call returns true and
    // listView will process them

    busyContext = Context.getContext(listView).getBusyContext();
    busyContext.whenReady().then(function () {
      listView.data = context.data;
      listView.selected = context.selected;
      context.renderDone();
    }, function (reason) {
      Logger.warn('Select: busyContext promise rejected before setting props on listView: ' + reason);
      context.renderError(reason);
    });
  }
};

LovDropdown.prototype._templateCollectionRenderer = function (context) {
  if (!this._resultsElem) {
    var $parentElem = $(context.parentElement);
    var placeholderElem = $parentElem.find('.oj-searchselect-results-placeholder')[0];

    this._getTemplateEngineFunc().then(function (templateEngine) {
      this._collectionTemplateContext = this._createCollectionTemplateContext(templateEngine, context);
      var nodes = templateEngine.execute(this._templateContextComponentElement, this._collectionTemplate, this._collectionTemplateContext);

      for (var i = 0; i < nodes.length; i++) {
        placeholderElem.parentNode.insertBefore(nodes[i], placeholderElem);
      } // remove the placeholder elem because it's no longer needed


      placeholderElem.parentNode.removeChild(placeholderElem);
      this._resultsElem = $parentElem.find('.oj-select-results'); // '.oj-listbox-results'

      this._resultsElem.on('click', LovUtils.killEvent);

      context.renderDone();
    }.bind(this), function (reason) {
      Logger.warn('Select: template collection renderer template engine promise rejected: ' + reason);
      context.renderError(reason);
    });
  } else {
    var templateContext = this._collectionTemplateContext;
    templateContext.data = context.data;
    templateContext.searchText = context.searchText;
    templateContext.selected = context.selected;
    context.renderDone();
  }
};

LovDropdown.prototype._addDataProviderEventListeners = function () {
  var dataProvider = this._dataProvider;

  if (dataProvider) {
    var dataProviderEventHandler = this._handleDataProviderEvent.bind(this);

    this._savedDataProviderEH = dataProviderEventHandler;
    dataProvider.addEventListener('mutate', dataProviderEventHandler);
    dataProvider.addEventListener('refresh', dataProviderEventHandler);
  }
};

LovDropdown.prototype._removeDataProviderEventListeners = function () {
  var dataProvider = this._dataProvider;
  var dataProviderEventHandler = this._savedDataProviderEH;

  if (dataProvider && dataProviderEventHandler) {
    dataProvider.removeEventListener('mutate', dataProviderEventHandler);
    dataProvider.removeEventListener('refresh', dataProviderEventHandler);
    this._savedDataProviderEH = undefined;
  }
}; // eslint-disable-next-line no-unused-vars


LovDropdown.prototype._handleDataProviderEvent = function (event) {
  // need to add busy state around potential listView animation
  var resolveBusyState = this._addBusyStateFunc('LovDropdown handling data provider event');

  var busyContext = Context.getContext(this._containerElem[0]).getBusyContext();
  busyContext.whenReady().then(function () {
    resolveBusyState();
  }, function (reason) {
    Logger.warn('Select: LovDropdown.handleDataProviderEvent busyContext promise rejected: ' + reason);
    resolveBusyState();
  });
}; // LovDropdown.prototype.postRenderResults = function () {
//   if (this._controlItems.length) {
//     var highlightableChoices = this.findHighlightableOptionElems();
//     // TODO: We probably don't need to include controlItems here anymore, because we don't
//     // manage virtual focus through them.
//     // TODO: Should figure out how to get count of choices from DP or from listView.  Note that
//     // the count will change with loadMoreOnScroll, so we'll need to get updated counts and reapply
//     // them to the rendered choices.
//     var totalOptions = this._controlItems.length + highlightableChoices.length;
//     this._controlItems.attr('aria-setsize', totalOptions);
//     if (highlightableChoices.length > 0) {
//       // TODO: We're not currently putting role='option' on each item because listView always adds
//       // role='row'.  If we need to make it an option for acessibility reasons/virtual focus, then
//       // we either need to prevent listView from overwriting what we set or we need to put it on
//       // child DOM under the <li>.
//       var highlightableOptions = highlightableChoices.children("[role='option']");
//       if (highlightableOptions.length === 0) {
//         highlightableOptions = highlightableChoices.filter("[role='option']");
//       }
//       highlightableOptions.attr('aria-setsize', totalOptions);
//       // TODO: We probably don't need to include controlItems here anymore, because we don't
//       // manage virtual focus through them.
//       // TODO: We should be able to write the aria-posinset on each item as it's rendered out.
//       // (App would have to do this in an item or collection template.)
//       highlightableOptions.first().attr('aria-posinset', this._controlItems.length + 1);
//     }
//   }
// };
// LovDropdown.prototype._initializeTemplateItems = function () {
//   // var headerItems = this._headerElem.find('.oj-listbox-header-item');
//   // var footerItems = this._footerElem.find('.oj-listbox-header-item');
//   // this._controlItems = headerItems.add(this._resultsElem).add(footerItems);
//   this._controlItems = this._resultsElem;
//   this._controlItems.uniqueId();
//   // // this._controlItems.attr('role', 'option');
//   // if (!headerItems.length) {
//   //   this._headerElem.addClass('oj-helper-hidden');
//   // }
//   // if (!footerItems.length) {
//   //   this._footerElem.addClass('oj-helper-hidden');
//   // }
// };
// LovDropdown.prototype._removeHighlightFromControlItems = function () {
//   var combined = this._controlItems;
//   // don't remove focus classes from collection because we're not currently manging virtual focus
//   combined = combined.filter(':not(.oj-select-results)');
//   combined.filter('.oj-focus')
//     .removeClass('oj-focus oj-focus-highlight oj-focus-only');
//   combined.find('.oj-focus')
//     .removeClass('oj-focus oj-focus-highlight oj-focus-only');
// };


LovDropdown.prototype.close = function () {
  // this._dispatchEvent('currentItemChanged', { key: null });
  //  - firefox: can't arrow into dropdown after clicking outside lov
  // explicitly blur the focused element in the dropdown before closing it
  var activeElem = document.activeElement;

  if (oj.DomUtils.isAncestor(this.getElement(), activeElem)) {
    activeElem.blur();
  }
  /** @type {!Object.<oj.PopupService.OPTION, ?>} */


  var psOptions = {};
  psOptions[oj.PopupService.OPTION.POPUP] = this._containerElem;
  oj.PopupService.getInstance().close(psOptions); // this._containerElem.removeAttr('id');

  this._containerElem.detach();

  this._dispatchEvent('dropdownClosed');
};

LovDropdown.prototype.open = function () {
  var containerElem = this._containerElem; // if (this._searchElem) {
  //   this._searchElem.val('');
  // }

  if (containerElem[0] !== this._bodyElem.children().last()[0]) {
    containerElem.appendTo(this._bodyElem); // @HTMLUpdateOK
  } // TODO: we should use oj-popup instead of using the popup service directly, and then oj-popup
  // could handle some of the focus functionality, like trapping TABS


  var psEvents = {};

  psEvents[oj.PopupService.EVENT.POPUP_CLOSE] = function () {
    this._dispatchEvent('closeDropdown', {
      trigger: 'popupCloseEvent'
    });
  }.bind(this);

  psEvents[oj.PopupService.EVENT.POPUP_REMOVE] = this._surrogateRemoveHandler.bind(this);
  psEvents[oj.PopupService.EVENT.POPUP_AUTODISMISS] = this._clickAwayHandler.bind(this);

  psEvents[oj.PopupService.EVENT.POPUP_REFRESH] = function () {
    this._dispatchEvent('sizeDropdown');
  }.bind(this);

  psEvents[oj.PopupService.EVENT.POPUP_AFTER_OPEN] = function (event) {
    this._dispatchEvent('adjustDropdownPosition', {
      popupElem: event.popup[0]
    });
  }.bind(this);
  /** @type {!Object.<oj.PopupService.OPTION, ?>} */


  var psOptions = {};
  psOptions[oj.PopupService.OPTION.POPUP] = containerElem;
  psOptions[oj.PopupService.OPTION.EVENTS] = psEvents;
  psOptions[oj.PopupService.OPTION.LAYER_SELECTORS] = 'oj-listbox-drop-layer';
  psOptions[oj.PopupService.OPTION.CUSTOM_ELEMENT] = true;

  if (this._fullScreenPopup) {
    psOptions[oj.PopupService.OPTION.MODALITY] = oj.PopupService.MODALITY.MODAL;
  }

  this._dispatchEvent('openPopup', {
    psOptions: psOptions
  }); // show the elements


  this._dispatchEvent('sizeDropdown');
};

LovDropdown.prototype._clickAwayHandler = function (event) {
  var containerElem = this._containerElem; //  - period character in element id prevents options box open/close;
  // escapeSelector handles special characters

  var $target = $(event.target);

  if ($target.closest(containerElem).length || $target.closest('#' + $.escapeSelector(containerElem.attr('data-oj-containerid'))).length) {
    return;
  } // if the target is in a popup nested within the open dropdown, like in the dropdown of
  // an oj-select or oj-combobox in the custom header, then keep the dropdown open


  var closestDropLayer = containerElem.closest('.oj-listbox-drop-layer');

  if (closestDropLayer.length > 0 && $target.closest(closestDropLayer).length > 0) {
    return;
  }

  if (containerElem.length > 0) {
    this._dispatchEvent('closeDropdown', {
      trigger: 'clickAway'
    });
  }
};

LovDropdown.prototype._surrogateRemoveHandler = function () {
  if (this._containerElem) {
    this._containerElem.remove();
  }
}; // LovDropdown.prototype.findHighlightableOptionElems = function () {
//   var choices = this._resultsElem.find('.oj-listbox-result-selectable');
//   return choices;
// };

/**
 * Get the focused item within the list of items
 * @param {Array<HTMLElement>} items
 * @return {HTMLElement} The focused item, if any
 * @private
 */
// LovDropdown._getFocusedItem = function (items) {
//   var focused = $(items).filter('.oj-focus.oj-focus-highlight.oj-focus-only');
//   return focused[0];
// };

/**
 * Get the next item within the list after the currently focused item.
 * This function will always search forward in the array. The array is expected
 * to be ordered in the desired direciton. If no current item is specified, the
 * first item in the list is returned. If the current item is the last item within
 * the list, undefined is returned.
 * @param {HTMLElement} current The currently-focused item
 * @param {Array<HTMLElement>} items The list of items
 * @private
 */
// LovDropdown._getNextItem = function (current, items) {
//   var next;
//   if (!current) {
//     next = items[0];
//   } else {
//     for (var i = 0, len = items.length, item; i < len; i++) {
//       item = items[i];
//       if (item === current || $.contains(item, current)) {
//         next = items[i + 1];
//         break;
//       }
//     }
//   }
//   return next;
// };
// LovDropdown.prototype.transferHighlight = function (delta) {
//   var choices = this.findHighlightableOptionElems();
//   if (!choices.length) {
//     return;
//   }
//   var index = this._getHighlightIndex();
//   while (index >= -1 && index < choices.length) {
//     index += delta;
//     // if we're already on the first or last item, we can't navigate any further
//     if (index === choices.length || index <= -1) {
//       break;
//     }
//     var choice = $(choices[index]);
//     if (choice.hasClass('oj-listbox-result-selectable')) {
//       this._setHighlightIndex(index);
//       break;
//     }
//   }
// };

/**
 * Handle keydown event to process focusing to/from the drop down
 * @param {jQueryEvent} e The jQuery event object
 */


LovDropdown.prototype._handleKeyDown = function (e) {
  if (e.which === LovUtils.KEYS.TAB) {
    // var focused = this.focusNextControlItem(e);
    // if (!focused) {
    //   this._dispatchEvent('tabOut');
    //   // Since dropdown resides BEFORE the input in the DOM, browser will let
    //   // shift-tab move to previous node before the dropdown. If dropdown doesn't
    //   // focus on anything with Shift-Tab, leave focus on input field and kill
    //   // the event.
    //   if (e.shiftKey) {
    //     e.preventDefault();
    //   } else {
    //     this._dispatchEvent('closeDropdown', { trigger: 'tabKeyDown' });
    //   }
    // }
    // TAB cycles within dropdown
    var containerElem = this._containerElem;
    var firstTabbableNode = oj.FocusUtils.getFirstTabStop(containerElem);
    var lastTabbableNode = oj.FocusUtils.getLastTabStop(containerElem);
    var target = e.target;

    if (firstTabbableNode === target && e.shiftKey) {
      e.preventDefault(); // tabbing backwards, cycle focus to last tabbable node

      if (lastTabbableNode) {
        oj.FocusUtils.focusElement(lastTabbableNode);
      }
    } else if (lastTabbableNode === target && !e.shiftKey) {
      e.preventDefault(); // tabbing forwards, cycle to the first tabbable node

      if (firstTabbableNode) {
        oj.FocusUtils.focusElement(firstTabbableNode);
      }
    }
  } else if (e.which === LovUtils.KEYS.ESC) {
    this._dispatchEvent('closeDropdown', {
      trigger: 'escKeyDown'
    });
  }
};
/**
 * Transfer focus to the LOV dropdown control items in the header/footer. Focus
 * will traverse only the header/footer components, skipping the list items.
 * @param {jQueryEvent} e The jQuery event object
 * @return {boolean} True if a control item was focused, false otherwise
 */
// LovDropdown.prototype.focusNextControlItem = function (e) {
//   var combined = this._controlItems.toArray();
//   var focused = false;
//   if (!combined.length) {
//     return false;
//   }
//   if (e.shiftKey) {
//     combined.reverse();
//   }
//   // Get the active element, which might be an OJ component (with focus classes),
//   // or document.activeElement
//   var active = LovDropdown._getFocusedItem(combined) || document.activeElement;
//   var last = combined[combined.length - 1];
//   if (active === last || $.contains(last, active)) {
//     return false;
//   }
//   var next = LovDropdown._getNextItem(active, combined) || combined[0];
//   if (next && next.focus) {
//     // this.clearHighlight();
//     next.focus();
//     e.preventDefault();
//     focused = true;
//   }
//   return focused;
// };

/**
 * Tests if there's app-supplied content in the header/footer template slots
 * @return {boolean} True if either the header or footer have content; false
 * otherwise.
 */
// LovDropdown.prototype.hasControlItems = function () {
//   // the results elem is always in the list, so check whether length > 1 instead of > 0
//   return this._controlItems.length > 1;
// };
// LovDropdown.prototype._getCurrentListItemValue = function () {
//   return this._collectionContext.currentItem;
// };
// LovDropdown.prototype._setCurrentListItemValue = function (val) {
//   this._collectionContext.currentItem = val;
//   // TODO: do we need to call collection renderer here to push new currentItem?
// };
// LovDropdown.prototype._getSelectedKeySet = function () {
//   return this._collectionContext.selected;
// };
// LovDropdown.prototype._setSelectedKeySet = function (keySet) {
//   this._collectionContext.selected = keySet;
// };
// LovDropdown.prototype._getHighlightIndex = function () {
//   var listElem = this._resultsElem[0];
//   var currItem = this._getCurrentListItemValue();
//   if (currItem) {
//     var curSelected = this._currentItemElem;
//     if (curSelected) {
//       //  - acc: screenreader not reading ojselect items
//       if (this._searchElem) {
//         // TODO: do we need to get text from rendered item, or is aria-activedescendant enough,
//         // or is there a better alternative?
//         this._dispatchEvent('updateLiveRegion', { text: $(curSelected).text() });
//       }
//       // TODO: is there a better way to get index, or can we avoid using index entirely?
//       var listViewContext = listElem.getContextByNode(curSelected);
//       return listViewContext.index;
//     }
//   }
//   if (this._searchElem) {
//     this._dispatchEvent('updateLiveRegion', { text: '' });
//   }
//   return -1;
// };
// LovDropdown.prototype._setHighlightIndex = function (_index) {
//   var index = _index;
//   var choices = this.findHighlightableOptionElems();
//   var listElem = this._resultsElem[0];
//   if (index >= choices.length) {
//     index = choices.length - 1;
//   }
//   if (index < 0) {
//     index = 0;
//   }
//   this.clearHighlight();
//   var data = listElem.getDataForVisibleItem({ index: index });
//   // TODO: we need a way to get the key for the item from listView instead of expecting the value
//   // to be a field in the data itself
//   var value = LovUtils.getOptionValue(data);
//   // TODO: scrollToItem isn't available on oj-table, bu do we need it or is setting currentItem
//   // enough?
//   listElem.scrollToItem({ key: value });
//   this._setCurrentListItemValue(value);
//   return 0;
// };
// LovDropdown.prototype.clearHighlight = function () {
//   // this._setCurrentListItemValue(null);
//   this._removeHighlightFromControlItems();
// };
// LovDropdown.prototype._handleCollectionCurrentItemChanged = function (key) {
//   if (this._duringListViewInitialization) {
//     return;
//   }
//   // keep context up to date
//   this._collectionContext.currentItem = key;
//   // TODO: should we have to manage oj-focus-highlight for virtual focus item?
//   // ensure assistive technology can determine the active choice
//   this._dispatchEvent('currentItemChanged', { key: key });
//   //  - acc: screenreader not reading ojselect items
//   // if (this._searchElem) {
//   //   // TODO: do we need to update live region with item text or is aria-activedescendant enough?
//   //   this._dispatchEvent('updateLiveRegion', { text: itemElem ? $(itemElem).text() : '' });
//   // }
// };


LovDropdown.prototype._handleCollectionSelectedItemChanged = function (_valueItem, event) {
  if (this._duringListViewInitialization) {
    return;
  }

  var valueItem = !LovUtils.isValueItemForPlaceholder(_valueItem) ? _valueItem : null; // keep context up to date

  this._collectionContext.selectedItem = valueItem;

  this._handleSelection(valueItem, event);
}; // LovDropdown.prototype.activateHighlightedElem = function () {
//   var val = this._getCurrentListItemValue();
//   if (val !== null) {
//     this._toggleListSelection(val);
//   }
// };
// LovDropdown.prototype._toggleListSelection = function (val) {
//   var setOfValues = this._getSelectedKeySet().values();
//   var selection = [];
//   setOfValues.forEach(function (i) { selection.push(i); });
//   var selIndex = selection.indexOf(val);
//   if (selIndex > -1) {
//     selection.splice(selIndex, 1);
//   } else {
//     selection = [val];
//   }
//   this._setSelectedKeySet(new ojkeyset.KeySetImpl(selection));
// };


LovDropdown.prototype._handleSelection = function (valueItem, event) {
  if (valueItem) {
    var selectionOptions = {
      trigger: LovUtils.ValueChangeTriggerTypes.OPTION_SELECTED
    };

    this._dispatchEvent('handleSelection', {
      valueItem: valueItem,
      selectionOptions: selectionOptions,
      event: event
    });
  }
};
/**
 * Set the current search term. This is reflected into the context of the header
 * and footer template items, if defined.
 * @param {string} term The search term to set
 */
// LovDropdown.prototype.setSearchText = function (term) {
//   if (this._getControlTemplateContext()) {
//     this._getControlTemplateContext().searchText = term;
//   }
// };

/**
 * Get the template context for the header/footer
 */
// LovDropdown.prototype._getControlTemplateContext = function (templateEngine) {
//   if (this._headerTemplate || this._footerTemplate) {
//     if (!this._headerfooterTemplateContext) {
//       this._headerfooterTemplateContext = {};
//       if (templateEngine) {
//         templateEngine.defineTrackableProperty(this._headerfooterTemplateContext, 'searchText', '');
//       } else {
//         Logger.error('JET Select: template engine not available when creating context' +
//           ' for header and footer');
//       }
//     }
//   }
//   return this._headerfooterTemplateContext;
// };


LovDropdown.prototype._createCollectionTemplateContext = function (templateEngine, context) {
  var templateContext = {};

  if (templateEngine) {
    // if data changes, we recreate the whole dropdown and collection, so don't need this to be
    // trackable
    templateContext.data = context.data; // don't need searchText to be trackable because it's most likely only used in a row template,
    // which would get explicitly re-rendered when it changes

    templateContext.searchText = context.searchText; // make this trackable because we expect to push to it on each render

    templateEngine.defineTrackableProperty(templateContext, 'selected'); // pass listener so we can react to writebacks made by the collection

    templateEngine.defineTrackableProperty(templateContext, 'selectedItem', undefined, context.selectedItemChangedListener);
  } else {
    Logger.error('JET Select: template engine not available when creating context' + ' for collectionTemplate');
  }

  return templateContext;
};



/* global TimerUtils:false */

/**
 * @private
 */
var LovMainField = function LovMainField(options) {
  // {className, ariaLabel, ariaControls, showIndicatorDelay, idSuffix,
  //  inputType, enabled, readOnly, placeholder, getTranslatedStringFunc, addBusyStateFunc,
  //  forceReadOnly, setLoadingFunc, clearLoadingFunc}
  this._showIndicatorDelay = options.showIndicatorDelay;
  this._addBusyStateFunc = options.addBusyStateFunc;
  this._forceReadOnly = options.forceReadOnly;
  this._setLoadingFunc = options.setLoadingFunc;
  this._clearLoadingFunc = options.clearLoadingFunc;
  this._containerElem = this._createInnerDom(options);
  var $containerElem = $(this._containerElem);
  var $inputElem = $containerElem.find('input.' + options.className + '-input');
  this._inputElem = $inputElem[0];
};

LovMainField.prototype.getElement = function () {
  return this._containerElem;
};

LovMainField.prototype.getInputElem = function () {
  return this._inputElem;
};

LovMainField.prototype._createInnerDom = function (options) {
  var className = options.className;
  var idSuffix = options.idSuffix;
  var inputType = options.inputType;
  var enabled = options.enabled;
  var readonly = options.readOnly;
  var ariaLabel = options.ariaLabel;
  var ariaControls = options.ariaControls;
  var textFieldContainer = document.createElement('div');
  textFieldContainer.setAttribute('class', 'oj-text-field-container');
  textFieldContainer.setAttribute('role', 'presentation');
  var labelValueDiv = document.createElement('div');
  labelValueDiv.setAttribute('class', 'oj-text-field-middle');
  textFieldContainer.appendChild(labelValueDiv); // @HTMLUpdateOK

  var input = document.createElement('input');
  input.setAttribute('id', className + '-input-' + idSuffix);
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('autocapitalize', 'off');
  input.setAttribute('spellcheck', 'false');
  input.setAttribute('class', className + '-input oj-text-field-input');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('placeholder', options.placeholder);
  input.disabled = !enabled && !readonly;

  if (readonly || this._forceReadOnly && enabled) {
    input.setAttribute('readonly', 'true');
  }

  if (!readonly) {
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
  }

  if (ariaLabel) {
    input.setAttribute('aria-label', ariaLabel);
  }

  if (ariaControls) {
    input.setAttribute('aria-controls', ariaControls);
  } // apply virtualKeyboard input type to search field


  if (inputType !== null && inputType !== '') {
    input.setAttribute('type', inputType);
  } else {
    input.setAttribute('type', 'text');
  }

  labelValueDiv.appendChild(input); // @HTMLUpdateReview

  var strExpand = options.getTranslatedStringFunc('labelAccOpenDropdown');
  var a = document.createElement('a');
  var styleClasses = className + '-arrow ' + className + '-open-icon ' + className + '-icon oj-component-icon oj-clickable-icon-nocontext';

  if (!readonly && !enabled) {
    styleClasses += ' oj-disabled';
  }

  a.setAttribute('class', styleClasses);
  a.setAttribute('role', 'presentation');
  a.setAttribute('aria-label', strExpand);
  textFieldContainer.appendChild(a); // @HTMLUpdateReview

  return textFieldContainer;
};
/**
 * Update the label associated with the field.
 * @param {string} labelledBy Id of the label
 */


LovMainField.prototype.updateLabel = function (labelledBy) {
  if (labelledBy) {
    this._inputElem.setAttribute('aria-labelledby', labelledBy);
  }
};
/**
 * Set the UI loading state of the component. After a delay, this function displays
 * a loading indicator on the component.
 * @param {string} state The state value to set; can be one of "start" or "stop"
 */


LovMainField.prototype.setUiLoadingState = function (state) {
  if (state === 'start') {
    // Clear out any existing timer
    if (this._loadingIndicatorTimer) {
      this._loadingIndicatorTimer.clear();
    }

    this._loadingIndicatorTimer = TimerUtils.getTimer(this._showIndicatorDelay);

    this._loadingIndicatorTimer.getPromise().then(function (pending) {
      // Only add the loading indicator if loading request is still pending
      // (not cleared out by request finishing)
      if (pending) {
        this._addLoadingIndicator();
      }
    }.bind(this));
  } else if (state === 'stop') {
    if (this._loadingIndicatorTimer) {
      this._loadingIndicatorTimer.clear();

      this._loadingIndicatorTimer = null;
    }

    this._removeLoadingIndicator();
  }
}; // Add a loading indicator to the select box


LovMainField.prototype._addLoadingIndicator = function () {
  var containerElem = this._containerElem; //  - display loading indicator when fetching label for initial value is slow

  if (containerElem._loadingIndicatorCount === undefined) {
    containerElem._loadingIndicatorCount = 1;
  } else {
    containerElem._loadingIndicatorCount += 1;
  } // check if it's already added


  if (containerElem._saveLoadingIndicator) {
    return;
  }

  this._setLoadingFunc();

  containerElem._saveLoadingIndicator = true;
}; // Remove the loading indicator


LovMainField.prototype._removeLoadingIndicator = function () {
  var containerElem = this._containerElem; //  - display loading indicator when fetching label for initial value is slow

  if (containerElem._loadingIndicatorCount !== undefined) {
    // remove the loading indicator when reference count down to 0
    if (containerElem._loadingIndicatorCount === 1) {
      containerElem._loadingIndicatorCount = undefined;

      if (containerElem._saveLoadingIndicator) {
        this._clearLoadingFunc();

        containerElem._saveLoadingIndicator = undefined;
      }
    } else {
      containerElem._loadingIndicatorCount -= 1;
    }
  }
}; // LovMainField.prototype.focusCursorEndInputElem = function () {
//   if (this._inputElem === document.activeElement) {
//     return;
//   }
//   var textField = this._inputElem;
//   var $textField = $(textField);
//   // add busy state
//   var resolveBusyState = this._addBusyStateFunc('setting focus on input field');
//   // set the focus in a timeout - that way the focus is set after the processing
//   // of the current event has finished - which seems like the only reliable way
//   // to set focus
//   // Set a 40 timeout. In voiceover mode, previous partial value was read. See 
//   // This happens on ios Safari only, not Chrome. Setting a 40 timeout fixes the issue
//   // on Safari in voiceover.
//   var timer = TimerUtils.getTimer(40);
//   timer.getPromise().then(function () {
//     var pos = $textField.val().length;
//     $textField.focus();
//     // make sure textField received focus so we do not error out when trying to manipulate
//     // the caret.  sometimes modals or others listeners may steal it after its set
//     if ($textField.is(':visible') && textField === document.activeElement) {
//       // after the focus is set move the caret to the end, necessary when we val()
//       // just before setting focus
//       textField.setSelectionRange(pos, pos);
//     }
//     resolveBusyState();
//   });
// };



/* global LovUtils:false, Promise:false, Logger:false, TimerUtils:false */

/**
 * @private
 */
var AbstractLovBase = function AbstractLovBase(options) {
  // {className, dataProvider, containerElem, fullScreenPopup,
  // idSuffix, lovMainField, filterInputText, lovDropdown, liveRegion, enabled, readOnly, value,
  // getTranslatedStringFunc, addBusyStateFunc, showMainFieldFunc}
  this._minLength = 0;
  this._fetchRateLimit = 150;
  this._className = options.className;
  this._dataProvider = options.dataProvider;
  this._containerElem = options.containerElem;
  this._fullScreenPopup = options.fullScreenPopup;
  this._idSuffix = options.idSuffix;
  this._enabled = options.enabled;
  this._readonly = options.readOnly;
  this._value = options.value;
  this._getTranslatedStringFunc = options.getTranslatedStringFunc;
  this._addBusyStateFunc = options.addBusyStateFunc;
  this._lovMainField = options.lovMainField;
  this._filterInputText = options.filterInputText;
  this._lovDropdown = options.lovDropdown;
  this._liveRegion = options.liveRegion;
  this._showMainFieldFunc = options.showMainFieldFunc;
  this._setFilterFieldTextFunc = options.setFilterFieldTextFunc;
  this._queryCount = 0; // support ko options-binding
  // init dataProvider fetchType

  this._fetchType = this.hasData() ? 'init' : null;
};

AbstractLovBase.prototype.setValue = function (value) {
  this._value = value;
};

AbstractLovBase.prototype.getFetchType = function () {
  return this._fetchType;
};
/**
 * Toggle the aria-describedby attribute on the input field.
 * @param {boolean} enable True if the aria-describedby should be set; false to
 * unset it
 */
// AbstractLovBase.prototype._toggleAriaDescribedBy = function (enable) {
//   if (this._lovDropdown.hasControlItems()) {
//     var hintText = enable ? this._getTranslatedStringFunc('accKeyboardJumpEnd') : null;
//     var hintId = this._idSuffix + '-aria-input-desc';
//     var hintElem = document.getElementById(hintId);
//     if (enable) {
//       if (!hintElem) {
//         hintElem = document.createElement('div');
//         hintElem.id = hintId;
//         hintElem.className = 'oj-helper-hidden-accessible';
//         hintElem.setAttribute('aria-hidden', 'true');
//         hintElem.textContent = hintText;
//         this._containerElem.appendChild(hintElem);
//       } else if (hintElem.textContent !== hintText) {
//         hintElem.textContent = hintText;
//       }
//     }
//     this._lovMainField.getInputElem().setAttribute('aria-describedby', enable ? hintId : '');
//   }
// };


AbstractLovBase.prototype.destroy = function () {
  var closeDelayTimer = this._closeDelayTimer;

  if (!isNaN(closeDelayTimer)) {
    delete this._closeDelayTimer;
    window.clearTimeout(closeDelayTimer);
  }

  this.closeDropdown();
};

AbstractLovBase.prototype.hasData = function () {
  return this._dataProvider != null;
};

AbstractLovBase.prototype.isDropdownOpen = function () {
  return $(this._containerElem).hasClass('oj-listbox-dropdown-open');
};

AbstractLovBase.prototype._usingHandler = function (pos, props) {
  // if the input part of the component is clipped in overflow, implicitly close the dropdown popup.
  if (oj.PositionUtils.isAligningPositionClipped(props)) {
    // add busy state
    var resolveBusyState = this._addBusyStateFunc('closing popup');

    this._closeDelayTimer = window.setTimeout(function () {
      this.closeDropdown();
      resolveBusyState();
    }.bind(this), 1);
  } else {
    var containerElem = $(this._containerElem);
    var dropdownElem = props.element.element;
    dropdownElem.css(pos);

    if (props.vertical === 'bottom') {
      containerElem.addClass('oj-listbox-drop-above');
      dropdownElem.addClass('oj-listbox-drop-above');
    } else {
      containerElem.removeClass('oj-listbox-drop-above');
      dropdownElem.removeClass('oj-listbox-drop-above');
    }
  }
};

AbstractLovBase.prototype.getDropdownPosition = function () {
  var position;

  if (this._fullScreenPopup) {
    var scrollX = window.scrollX || window.pageXOffset;
    var scrollY = window.scrollY || window.pageYOffset;
    position = {
      my: 'start top',
      at: 'start top',
      of: window,
      offset: {
        x: scrollX,
        y: scrollY
      }
    };
  } else {
    // The element on which we want to position the listbox-dropdown.  We don't
    // want it to be the container because we add the inline messages to the container
    // and if we line up to the container when it has inline messages, the dropdown
    // appears after the inline messages.  We want it to always appear next to the input,
    // which is the first child of the container.
    position = {
      my: 'start top',
      at: 'start bottom',
      of: this._lovMainField.getElement(),
      collision: 'flip',
      using: this._usingHandler.bind(this)
    };
  }

  var isRtl = oj.DomUtils.getReadingDirection() === 'rtl';
  return oj.PositionUtils.normalizeHorizontalAlignment(position, isRtl);
};

AbstractLovBase.prototype.sizeDropdown = function () {
  var dropdownElem = this._lovDropdown.getElement();

  if (this._fullScreenPopup) {
    var ww = Math.min(window.innerWidth, window.screen.availWidth);
    var hh = Math.min(window.innerHeight, window.screen.availHeight);
    dropdownElem.style.width = ww + 'px';
    dropdownElem.style.height = hh + 'px';
  } else {
    dropdownElem.style.minWidth = $(this._containerElem).outerWidth() + 'px';
  }
};

AbstractLovBase.prototype.adjustDropdownPosition = function (elem) {
  if (!this._fullScreenPopup) {
    var $elem = $(elem);
    var dropdownRect = elem.getBoundingClientRect();

    var containerRect = this._containerElem.getBoundingClientRect();

    var hh = Math.min(window.innerHeight, window.screen.availHeight);
    var ww = Math.min(window.innerWidth, window.screen.availWidth);
    var maxHeight;
    var maxWidth;
    var gap = 10;

    if (dropdownRect.y > containerRect.y) {
      // dropdown is below the field
      maxHeight = hh - dropdownRect.y - gap;
    } else {
      // dropdown is above the field
      maxHeight = containerRect.y - gap;
      var strHeight = $elem.css('height');
      var height = parseFloat(strHeight);

      if (height > maxHeight) {
        var heightDiff = height - maxHeight;
        var strTop = $elem.css('top');
        var top = parseFloat(strTop);
        $elem.css('top', top + heightDiff + 'px');
      }
    }

    if (dropdownRect.x >= containerRect.x) {
      // dropdown doesn't extend to the left of the field
      maxWidth = ww - dropdownRect.x - gap;
    } else {
      // dropdown extends to the left of the field
      maxWidth = containerRect.right - gap;
      var strWidth = $elem.css('width');
      var width = parseFloat(strWidth);

      if (width > maxWidth) {
        var widthDiff = width - maxWidth;
        var strLeft = $elem.css('left');
        var left = parseFloat(strLeft);
        $elem.css('left', left + widthDiff + 'px');
      }
    }

    $elem.css('max-height', maxHeight + 'px');
    $elem.css('max-width', maxWidth + 'px');
  }
};
/**
 * Opens the dropdown
 *
 * @return {boolean} whether or not dropdown was opened. This method will return false if, for example,
 * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
 * @ignore
 */


AbstractLovBase.prototype.openDropdown = function (dontUpdateResults) {
  if (this.isDropdownOpen() || this._enabled === false || this._readonly === true) {
    return false;
  }

  if (this._fullScreenPopup) {
    this._setFilterFieldTextFunc('');
  }

  $(this._containerElem).addClass('oj-listbox-dropdown-open');

  if (!dontUpdateResults) {
    this.updateResults(true, this._fullScreenPopup);
  } // this._toggleAriaDescribedBy(true);


  return true;
};

AbstractLovBase.prototype.closeDropdown = function () {
  if (!this.isDropdownOpen()) {
    return;
  }

  var $containerElem = $(this._containerElem);
  $containerElem.removeClass('oj-listbox-dropdown-open');

  if (!this._ariaExpanded) {
    return;
  } // clear the classes used to figure out the preference of where the dropdown should be opened


  $containerElem.removeClass('oj-listbox-drop-above');
  $(this._lovDropdown.getElement()).removeClass('oj-listbox-drop-above');

  this._lovDropdown.close(); // this._toggleAriaDescribedBy(false);
  // select: accessibility


  this._ariaExpanded = false;

  this._lovMainField.getInputElem().setAttribute('aria-expanded', 'false'); //  - press escape after search in select causes select to become unresponsive


  this._lastSearchTerm = null; // if (!this._fullScreenPopup &&
  //     !oj.DomUtils.isAncestor(this._containerElem, document.activeElement)) {
  //   this._showMainFieldFunc();
  // }
};

AbstractLovBase.prototype.updateResults = function (initial, focusFirstElem) {
  var term = this._filterInputText.rawValue || '';
  var lastTerm = this._lastSearchTerm; // prevent duplicate queries against the same term
  // not applying to multi select since user can search the same term after making selection
  // it's ok for single select since the last term will be updated after selection

  if (initial !== true && lastTerm && term === lastTerm) {
    return;
  } // In IE even for change of placeholder fires 'input' event,
  // so in such cases we don't need to query for results.
  // if (!lastTerm && !term && initial && initial.type === 'input') {
  //   return;
  // }


  this._lastSearchTerm = term;

  if (term.length >= this._minLength) {
    if (this._queryTimer) {
      this._queryTimer.clear();
    }

    if (!initial || initial === true) {
      this._runQuery(initial, term, focusFirstElem);
    } else {
      var queryResolveBusyState = this._addBusyStateFunc('query results');

      this._queryTimer = TimerUtils.getTimer(this._fetchRateLimit);

      this._queryTimer.getPromise().then(function (completed) {
        if (completed) {
          this._runQuery(initial, term, focusFirstElem);
        }
      }.bind(this)).then(queryResolveBusyState);
    }
  } else {
    this.closeDropdown();
  }
};

AbstractLovBase.prototype._runQuery = function (initial, term, focusFirstElem) {
  var lovDropdown = this._lovDropdown;
  var self = this; // sequence number used to drop out-of-order responses

  var queryNumber = 0;

  if (this._minLength > term.length) {
    this.closeDropdown();
    return;
  }

  this.openDropdown(true);
  this._queryCount += 1;
  queryNumber = this._queryCount; // lovDropdown.clearHighlight();

  if (!(term !== undefined && term !== null && (initial !== true || this._minLength > 0))) {
    // eslint-disable-next-line no-param-reassign
    term = '';
  }

  if (this.hasData()) {
    if (!this._ariaExpanded) {
      lovDropdown.open(); // select: accessibility

      this._ariaExpanded = true;

      this._lovMainField.getInputElem().setAttribute('aria-expanded', 'true');
    }

    if (focusFirstElem) {
      oj.FocusUtils.focusFirstTabStop(lovDropdown.getElement());
    } // lovDropdown.setSearchText(term);


    var fetchPromise = this._fetchFromDataProvider(term);

    fetchPromise.then(function () {
      self._handleQueryResultsFetch(queryNumber);
    }, function (reason) {
      Logger.warn('Select: _fetchFromDataProvider promise was rejected: ' + reason);

      self._handleQueryResultsFetch(queryNumber);
    });
  }
};

AbstractLovBase.prototype._handleQueryResultsFetch = function (queryNumber) {
  // ignore old responses
  if (queryNumber !== this._queryCount) {
    return;
  } // ignore a response if the oj-combobox has been closed before it was received


  if (!this.isDropdownOpen()) {
    return;
  } // var results = this._lovDropdown.findHighlightableOptionElems();
  // var resultsCount = results ? results.length : 0;


  var fetchedDataCount = this._dataProvider ? this._dataProvider.getFetchedDataCount() : null;
  var resultsCount = fetchedDataCount ? fetchedDataCount.count : 0;
  var resultsCountDone = fetchedDataCount ? fetchedDataCount.done : true;
  var translation;

  if (resultsCount === 0) {
    translation = this._getTranslatedStringFunc('noMatchesFound');
  } else {
    this.sizeDropdown(); // lovDropdown.postRenderResults();
    // TODO: need a way to get number of results from listView, and to know when to update it when
    // listView loads more on scroll (could count results in FilteringDataProviderView iterator
    // every time next is called?)
    // translation = (resultsCount === 1) ? this._getTranslatedStringFunc('oneMatchFound') :
    //   this._getTranslatedStringFunc('multipleMatchesFound', { num: ('' + resultsCount) });

    translation = resultsCountDone ? this._getTranslatedStringFunc('multipleMatchesFound', {
      num: String(resultsCount)
    }) : this._getTranslatedStringFunc('nOrMoreMatchesFound', {
      num: String(resultsCount)
    });
  }

  this.updateLiveRegion(translation);
};

AbstractLovBase.prototype.updateLiveRegion = function (translatedString) {
  $(this._liveRegion).text(translatedString);
};

AbstractLovBase.prototype.cancel = function () {
  this.closeDropdown(); // this._lovMainField.focusCursorEndInputElem();
}; // eslint-disable-next-line no-unused-vars


AbstractLovBase.prototype.handleDataProviderEvent = function (event) {
  // clear the saved last search term
  this._lastSearchTerm = null;
}; // add busy state
// display an animated gif if it is fetch initially
// fetch from the data provider
// display message for furthur filtering if not all results are fetched
// if multiple queries are in progress, discard all but the last query
// returns a promise that resolves when the listview has finished rendering


AbstractLovBase.prototype._fetchFromDataProvider = function (term) {
  var bLoadingIndicatorAdded = false; // add busy context

  var fetchResolveFunc = this._addBusyStateFunc('fetching data'); // display spinning icon only for the initial fetch


  if (this._fetchType === 'init') {
    bLoadingIndicatorAdded = true;

    if (!this.isDropdownOpen()) {
      this._lovMainField.setUiLoadingState('start');
    }

    this._fetchType = null;
  }

  var filterCriteria = null;

  if (term) {
    if (this._dataProvider) {
      var filterCapability = this._dataProvider.getCapability('filter');

      if (!filterCapability || !filterCapability.textFilter) {
        Logger.error('Select: DataProvider does not support text filter.  ' + 'Filtering results in dropdown may not work correctly.');
      }
    } // create filter using FilterFactory so that default local filtering will happen if
    // underlying DP doesn't support its own filtering


    filterCriteria = oj.FilterFactory.getFilter({
      filterDef: {
        text: term
      }
    });
  }

  var retPromise = new Promise(function (resolve) {
    // fetch data from dataProvider
    var renderPromise = this._lovDropdown.renderResults(term, filterCriteria, LovUtils.isValueForPlaceholder(this._value) ? null : this._value);

    var afterRenderPromiseFunc = function () {
      if (bLoadingIndicatorAdded) {
        this._lovMainField.setUiLoadingState('stop');
      } // clear busy context


      fetchResolveFunc();
      resolve();
    }.bind(this);

    renderPromise.then(function () {
      afterRenderPromiseFunc();
    }, function (reason) {
      Logger.warn('Select: renderResults promise was rejected: ' + reason);
      afterRenderPromiseFunc();
    });
  }.bind(this));
  return retPromise;
};



/* global LovUtils:false, LovMainField:false, AbstractLovBase:false, LovDropdown:false, Components:false, Promise:false, ThemeUtils:false, ListDataProviderView:false, TreeDataProviderView:false, FilteringDataProviderView:false, Logger:false, Config:false, Set:false */

/**
 * @ojcomponent oj.ojSelectSingle
 * @augments oj.editableValue
 * @ojimportmembers oj.ojDisplayOptionsNoConverterValidatorHints
 * @since 8.0.0
 * @ojdisplayname Single-select Select
 * @ojshortdesc A select single is a dropdown list that supports single selection and search filtering.
 * @ojrole combobox
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "ItemMetadata"]}
 * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet"]}
 * @ojtsimport {module: "ojcommontypes", type: "AMD", importName: ["CommonTypes"]}
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojSelectSingle<V, D> extends editableValue<V, ojSelectSingleSettableProperties<V, D>>",
 *                genericParameters: [{"name": "V", "description": "Type of value of the component/key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojSelectSingleSettableProperties<V, D> extends editableValueSettableProperties<V>",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "placeholder", "required", "disabled", "virtualKeyboard"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["data", "value"]}
 * @ojvbdefaultcolumns 6
 * @ojvbmincolumns 2
 *
 * @classdesc
 * <h3 id="selectSingleOverview-section">
 *   JET Select Single
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectSingleOverview-section"></a>
 * </h3>
 * <p>Description: JET Select Single provides support for single-select and search filtering.</p>
 *
 * <p>A JET Select Single can be created with the following markup.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-select-single data="[[dataProvider]]">
 * &lt;/oj-select-single>
 * </code></pre>
 *
 * {@ojinclude "name":"validationAndMessagingDoc"}
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDocOne"}
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDocOne"}
 *
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Page Load</h4>
 * <p>If there is an initially selected value, setting the <a href="#valueItem">valueItem</a> attribute initially can improve page load performance because the element will not have to fetch the selected label from the data provider.</p>
 * <p>The dropdown data isn't fetched until the user opens the dropdown.</p>
 *
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
 *
 * {@ojinclude "name":"selectCommon"}
 */

/**
 * @ojcomponent oj.ojSelect2
 * @augments oj.editableValue
 * @ojtsignore
 * @since 8.0.0
 * @abstract
 * @ojsignature [{
 *                target: "Type",
 *                value: "abstract class ojSelect2<V, SP extends ojSelect2SettableProperties<V>> extends editableValue<V, SP>"
 *               },
 *               {
 *                target: "Type",
 *                value: "ojSelect2SettableProperties<V> extends editableValueSettableProperties<V>",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @classdesc
 */

/**
 *
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>As with any JET element, in the unusual case that the directionality (LTR or RTL) changes post-init, the Select must be <code class="prettyprint">refresh()</code>ed.</p>
 *
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate an oj-label to the Select element.
 * You should put an <code>id</code> on the Select element, and then set
 * the <code>for</code> attribute on the oj-label to be the Select element's id.
 * </p>
 * <p>
 * The element will decorate its associated label with required and help
 * information, if the <code>required</code> and <code>help</code> attributes are set.
 * </p>
 *
 * @ojfragment selectCommon
 * @memberof oj.ojSelectSingle
 */
oj.__registerWidget('oj.ojSelect2', $.oj.editableValue, {
  defaultElement: '<input>',
  widgetEventPrefix: 'oj',

  /**
   * Input types for virtual keyboard.
   * @private
   */
  _ALLOWED_INPUT_TYPES: ['email', 'number', 'search', 'tel', 'text', 'url'],
  options: {
    /**
     * The placeholder text to set on the element. The placeholder specifies a short hint that can
     * be displayed before user selects or enters a value.
     *
     * @example <caption>Initialize the Select with the <code class="prettyprint">placeholder</code> attribute specified:</caption>
     * &lt;oj-select-single placeholder="Please select ...">&lt;/oj-select-single>
     *
     * @example <caption>Get or set the <code class="prettyprint">placeholder</code> property after initialization:</caption>
     * // getter
     * var placeholderValue = mySelect.placeholder;
     *
     * // setter
     * mySelect.placeholder = "Select a value";
     *
     * @name placeholder
     * @ojshortdesc A short hint that can be displayed before user selects or enters a value.
     * @ojtranslatable
     * @expose
     * @access public
     * @instance
     * @memberof oj.ojSelectSingle
     * @type {string}
     * @default ''
     * @ojtranslatable
     */
    placeholder: '',

    /**
     * {@ojinclude "name":"selectCommonData"}
     * @name data
     * @ojshortdesc The data for the Select.
     * @expose
     * @access public
     * @instance
     * @type {null | oj.DataProvider}
     * @default null
     * @ojsignature {target: "Type", value: "oj.DataProvider<V, D>", jsdocOverride: true}
     * @memberof oj.ojSelectSingle
     *
     * @example <caption>Initialize the Select with the <code class="prettyprint">data</code> specified:</caption>
     * &lt;oj-select-single data="[[dataProvider]]">&lt;/oj-select-single>
     *
     * @example <caption>Initialize the Select with a data provider and data mapping:</caption>
     * &lt;oj-select-single data="[[dataProvider]]">&lt;/oj-select-single>
     */

    /**
     * The data for the Select.
     * <p>Note that the <code class="prettyprint">item-text</code> attribute and the
     * <code class="prettyprint">itemTemplate</code> and
     * <code class="prettyprint">collectionTemplate</code> slots allow for customizing the
     * rendering of each data item.  If those are not specified, then the component will
     * attempt to render as text the 'label' field in the data item by default.</p>
     * <ul>
     * <li>See also <a href="#perf-section">Improve page load performance</a></li>
     * </ul>
     *
     * @expose
     * @memberof oj.ojSelectSingle
     * @instance
     * @ojfragment selectCommonData
     */
    data: null,

    /**
     * {@ojinclude "name":"selectCommonRequired"}
     *
     * @example <caption>Initialize the Select with the <code class="prettyprint">required</code> attribute:</caption>
     * &lt;oj-select-single required="[[isRequired]]">&lt;/oj-select-single>
     *
     * @example <caption>Get or set the <code class="prettyprint">required</code> property after initialization:</caption>
     * // getter
     * var requiredValue = mySelect.required;
     *
     * // setter
     * mySelect.required = true;
     *
     * @name required
     * @ojshortdesc Specifies whether a value is required.
     * @expose
     * @access public
     * @instance
     * @memberof oj.ojSelectSingle
     * @type {boolean}
     * @default false
     * @see #translations
     */

    /**
     * Whether the Select is required or optional. When required is set to true, an implicit
     * required validator is created using the validator factory -
     * <code class="prettyprint">oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED).createValidator()</code>.
     *
     * Translations specified using the <code class="prettyprint">translations.required</code> attribute
     * and the label associated with the Select, are passed through to the options parameter of the
     * createValidator method.
     *
     * <p>
     * When <code class="prettyprint">required</code> property changes due to programmatic  intervention,
     * the Select may clear messages and run validation, based on the current state it's in. </br>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if element is valid when required is set to true, then it runs deferred validation on
     * the value. This is to ensure errors are not flagged unnecessarily.
     * </li>
     * <li>if element is invalid and has deferred messages when required is set to false, then
     * element messages are cleared but no deferred validation is run.
     * </li>
     * <li>if element is invalid and currently showing invalid messages when required is set, then
     * element messages are cleared and normal validation is run using the current display value.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated and the error is shown.
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event on the <code class="prettyprint">value</code> property to clear custom errors.</li>
     * </ul>
     * </li>
     * </ul>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the element are cleared.</li>
     * <li><code class="prettyprint">messages-custom</code> attribute is not cleared.</li>
     * </ul>
     *
     * </p>
     *
     * This property set to <code class="prettyprint">false</code> implies that a value is not required to be provided by the user.
     * This is the default.
     * This property set to <code class="prettyprint">true</code> implies that a value is required to be provided by user and the
     * input's label will render a required icon. A required validator -
     * {@link oj.RequiredValidator} - is implicitly used.
     *
     * @expose
     * @access public
     * @instance
     * @memberof oj.ojSelectSingle
     * @see #translations
     * @ojfragment selectCommonRequired
     */
    required: false,

    /**
     * The type of virtual keyboard to display for entering value on mobile browsers.  This attribute has no effect on desktop browsers.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">virtual-keyboard</code> attribute:</caption>
     * &lt;oj-select-single virtual-keyboard="number">&lt;/oj-select-single>
     *
     * @example <caption>Get or set the <code class="prettyprint">virtualKeyboard</code> property after initialization:</caption>
     * // Getter
     * var virtualKeyboard = myComp.virtualKeyboard;
     *
     * // Setter
     * myComp.virtualKeyboard = "number";
     *
     * @name virtualKeyboard
     * @ojshortdesc The type of virtual keyboard to display for entering value on mobile browsers.
     *
     * @expose
     * @instance
     * @memberof oj.ojSelectSingle
     * @type {string}
     * @ojvalue {string} "email" Use a virtual keyboard for entering email.
     * @ojvalue {string} "number" Use a virtual keyboard for entering number.
     *                            <p>Note that on Android and Windows Mobile, the "number" keyboard
     *                            does not contain the minus sign.  This value should not be used
     *                            on fields that accept negative values.</p>
     * @ojvalue {string} "search" Use a virtual keyboard for entering search terms.
     * @ojvalue {string} "tel" Use a virtual keyboard for entering telephone number.
     * @ojvalue {string} "text" Use a virtual keyboard for entering text.
     * @ojvalue {string} "url" Use a virtual keyboard for entering URL.
     * @default "search"
     */
    virtualKeyboard: 'search',

    /**
     * Dictates element's readonly state.
     *
     * @example <caption>Initialize the select with the <code class="prettyprint">readonly</code> attribute:</caption>
     * &lt;oj-some-element readonly>&lt;/oj-some-element>
     *
     * @example <caption>Get or set the <code class="prettyprint">readonly</code> property after initialization:</caption>
     * // getter
     * var ro = myComp.readonly;
     *
     * // setter
     * myComp.readonly = false;
     *
     * @name readOnly
     * @alias readonly
     * @expose
     * @ojshortdesc Specifies whether a value is readonly
     * @access public
     * @instance
     * @memberof oj.ojSelectSingle
     * @type {boolean}
     * @default false
     */
    readOnly: false,

    /**
     * The <code class="prettyprint">valueItem</code> is similar to the
     * <code class="prettyprint">value</code>, but is a
     * <a href="CommonTypes.html#ItemContext">CommonTypes.ItemContext&lt;V, D></a> object which
     * contains both a key and data, and optional metadata.
     * The key will be set as the <code class="prettyprint">value</code> of the element.
     * The <code class="prettyprint">value</code> and <code class="prettyprint">valueItem</code>
     * are kept in sync, both during programmatic property sets as well as during interactive user
     * selection.
     * If initially both are set, the selected value in the <code class="prettyprint">value</code>
     * attribute has precedence.
     * <p>Note: If there is an initial selection, setting it via the
     * <code class="prettyprint">valueItem</code> attribute initially can improve page load
     * performance because the element will not have to fetch the selected data from the data
     * provider.</p>
     * <p>If <code class="prettyprint">valueItem</code> is not specified or the selected value is
     * missing, then the selected data will be fetched from the data provider.</p>
     *
     * @name valueItem
     * @ojshortdesc The current value of the element and its associated data.
     * @expose
     * @instance
     * @type {null | Object}
     * @ojsignature {target:"Type", value:"CommonTypes.ItemContext<V,D>", jsdocOverride:true}
     * @default { key: null, data: null, metadata: null }
     * @ojwriteback
     *
     * @memberof oj.ojSelectSingle
     *
     * @example <caption>Initialize the Select with the <code class="prettyprint">value-item</code> attribute specified:</caption>
     * &lt;oj-select-single value-item="[[valueItem]]">&lt;/oj-select-single>
     *
     * @example <caption>Object with key and data properties:</caption>
     * var valueItem = {'key': 'val1', 'data': {'value': 'val1', 'label': 'Label 1'}};
     *
     * @example <caption>Get or set the <code class="prettyprint">valueItem</code> property after initialization:</caption>
     * // getter
     * var valueItem = mySelect.valueItem;
     *
     * // setter
     * mySelect.valueItem = valueItem;
     */
    valueItem: {
      key: null,
      data: null,
      metadata: null
    },

    /**
     * Specifies the text string to render for a data item.
     * This attribute can be set to either:
     * <ul>
     * <li>a string that specifies the name of a top level data field to render as text, or</li>
     * <li>a callback function that takes a context object and returns the text string to
     * display</li>
     * </ul>
     *
     * <p>By default, the component will attempt to render a 'label' data field as text.</p>
     *
     * <p>This text will be rendered for the selected value of the component.  It will also be
     * rendered for each data item in the dropdown if no itemTemplate or collectionTemplate is
     * provided.  When rendered for the dropdown items, default matching search term highlighting
     * will still be applied.</p>
     *
     * @name itemText
     * @ojshortdesc Specifies the text string to render for a data item.
     * @expose
     * @instance
     * @type {string|function(Object):string}
     * @ojsignature {
     *   target: "Type",
     *   value: "keyof D | ((itemContext: CommonTypes.ItemContext<V, D>) => string)",
     *   jsdocOverride: true
     * }
     * @default 'label'
     *
     * @memberof oj.ojSelectSingle
     *
     * @example <caption>Initialize the Select with the <code class="prettyprint">item-text</code> attribute specified:</caption>
     * &lt;oj-select-single item-text="FullName">&lt;/oj-select-single>
     *
     * @example <caption>Get or set the <code class="prettyprint">itemText</code> property after initialization:</caption>
     * // getter
     * var itemText = mySelect.itemText;
     *
     * // setter
     * mySelect.itemText = 'FullName';
     */
    itemText: 'label',

    /**
     * {@ojinclude "name":"selectCommonLabelledBy"}
     * @name labelledBy
     * @expose
     * @ojshortdesc The oj-label sets the labelledBy property
     * programmatically on the form component.
     * @type {string|null}
     * @default null
     * @access public
     * @instance
     * @memberof oj.ojSelectSingle
     */

    /**
     * <p>
     * The oj-label sets the labelledBy property programmatically on the form component
     * to make it easy for the form component to find its oj-label component (a
     * document.getElementById call.)
     * </p>
     * <p>
     * The application developer should use the 'for'/'id api
     * to link the oj-label with the form component;
     * the 'for' on the oj-label to point to the 'id' on the input form component.
     * This is the most performant way for the oj-label to find its form component.
     * </p>
     *
     * // setter
     * myComp.labelledBy = "labelId";
     *
     * @expose
     * @ojshortdesc The oj-label sets the labelledBy property
     * programmatically on the form component.
     * @type {string|null}
     * @default null
     * @access public
     * @instance
     * @memberof oj.ojSelectSingle
     * @ojfragment selectCommonLabelledBy
     */
    labelledBy: null
    /**
     * The value of the element. The type must be the same as the type of keys in the data provider.
     *
     * @example <caption>Initialize the Select with the <code class="prettyprint">value</code> attribute specified:</caption>
     * &lt;oj-select-single value="option1">&lt;/oj-select-single>
     *
     * @example <caption>Get or set the <code class="prettyprint">value</code> property after initialization:</caption>
     * // getter
     * var value = mySelect.value;
     *
     * // setter
     * mySelect.value = "option1";
     *
     * @member
     * @name value
     * @ojshortdesc The value of the element.
     * @access public
     * @instance
     * @memberof oj.ojSelectSingle
     * @type {null | any}
     * @ojsignature {target: "Type",
     *               value: "V | null",
     *               genericParameters: [{"name": "V", "description": "Key in Data Provider"}],
     *               jsdocOverride: true}
     * @ojwriteback
     * @ojeventgroup common
     */

  },

  /**
   * Returns a jQuery object containing the element visually representing the Select.
   *
   * <p>This method does not accept any arguments.
   *
   * @memberof! oj.ojSelect2
   * @instance
   * @public
   * @ignore
   * @return {jQuery} the Select
   */
  widget: function widget() {
    return $(this.OuterWrapper);
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @protected
   * @override
   */
  _ComponentCreate: function _ComponentCreate() {
    this._super();

    this._cssOptionDefaults = ThemeUtils.parseJSONFromFontFamily('oj-searchselect-option-defaults') || {};
    this._fullScreenPopup = Config.getDeviceRenderMode() === 'phone';
    this._valueForPlaceholder = null;
    this._valueItemForPlaceholder = {
      key: null,
      data: null,
      metadata: null
    };

    this._setupSelectResources();
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @protected
   * @override
   */
  _AfterCreate: function _AfterCreate() {
    this._super();

    oj.EditableValueUtils._setInputId(this._GetContentElement()[0], this.OuterWrapper.id, this.options.labelledBy); // need to apply the oj-focus marker selector for control of the floating label.


    var rootElement = this._getRootElement();

    this._focusable({
      element: rootElement,
      applyHighlight: false,
      afterToggle: this._handleAfterFocusToggle.bind(this, rootElement)
    });
  },

  /**
   * Returns if the element is a text field element or not.
   * @memberof oj.ojSelect2
   * @instance
   * @protected
   * @return {boolean}
   */
  _IsTextFieldComponent: function _IsTextFieldComponent() {
    return true;
  },

  /**
   * Returns the components wrapper under which label needs to be inserted in the inside strategy
   * For input number we need the label to go under the span so that it occupies the same width
   * as the input text giving way to the buttons.
   * @memberof oj.ojSelect2
   * @instance
   * @protected
   * @override
   * @ignore
   * @return {Element|undefined}
   */
  _GetContentWrapper: function _GetContentWrapper() {
    // return this._getRootElement().querySelector('.oj-text-field-middle');
    return this._lovMainField.getElement().querySelector('.oj-text-field-middle');
  },

  /**
   * If the dropdown is open and the afterToggle handler is called with focusout,
   * turn on the 'oj-focus' selector. This is needed for floating labels.  If focus
   * moves to the droplist, the label should be in the up position versus floating
   * down over the input on selection of a dropdown item.
   * @private
   * @instance
   * @memberof! oj.ojSelect2
   */
  _handleAfterFocusToggle: function _handleAfterFocusToggle(element, eventType) {
    if (eventType === 'focusout') {
      if (this._abstractLovBase.isDropdownOpen()) {
        element.classList.add('oj-focus');
      }
    }
  },

  /**
   * Whether the component is required.
   *
   * @return {boolean} true if required; false
   *
   * @memberof! oj.ojSelect2
   * @instance
   * @protected
   * @override
   */
  _IsRequired: function _IsRequired() {
    return this.options.required;
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _labelledByChangedForInputComp: oj.EditableValueUtils._labelledByChangedForInputComp,

  /**
   * Performs post processing after required option is set by taking the following steps.
   *
   * - if component is invalid and has messgesShown -> required: false/true -> clear component errors;
   * run full validation with UI value (we don't know if the UI error is from a required validator
   * or something else);<br/>
   * &nbsp;&nbsp;- if there are validation errors, then value not pushed to model; messagesShown is
   * updated<br/>
   * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to
   * listen to optionChange(value) to clear custom errors.<br/>
   *
   * - if component is invalid and has messagesHidden -> required: false -> clear component
   * errors; no deferred validation is run.<br/>
   * - if component has no error -> required: true -> run deferred validation (we don't want to flag
   * errors unnecessarily)<br/>
   * - messagesCustom is never cleared<br/>
   *
   * @param {string} option
   *
   * @memberof! oj.ojSelect2
   * @instance
   * @protected
   */
  _AfterSetOptionRequired: oj.EditableValueUtils._AfterSetOptionRequired,

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojSelect2
   */
  _GetTranslationsSectionName: function _GetTranslationsSectionName() {
    return 'oj-ojSelectSingle';
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _getTemplateSlot: function _getTemplateSlot(name) {
    var slots = oj.BaseCustomElementBridge.getSlotMap(this.OuterWrapper);
    var namedSlot = slots[name];
    return namedSlot && namedSlot[0] && namedSlot[0].tagName === 'TEMPLATE' ? namedSlot[0] : null;
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _setupSelectResources: function _setupSelectResources() {
    var options = this.options;

    this._wrapDataProviderIfNeeded(options.data);

    this._addDataProviderEventListeners(); // need to initially apply virtualKeyboard option


    this._SetInputType(this._ALLOWED_INPUT_TYPES);

    var OuterWrapper = this.OuterWrapper; // need to use 'self' for getTranslatedStringFunc because it's called using func.apply(), which
    // would override the 'this' binding

    var self = this;

    var getTranslatedStringFunc = function getTranslatedStringFunc() {
      return self.getTranslatedString.apply(self, arguments);
    };

    var addBusyStateFunc = function addBusyStateFunc(description) {
      return LovUtils.addBusyState(OuterWrapper, description);
    };

    var elemId = OuterWrapper.getAttribute('id');

    if (!elemId) {
      elemId = 'oj-selectsingle-' + LovUtils.nextUid();
      OuterWrapper.setAttribute('id', elemId);
    } //  - ojselect id attribute on oj-select-choice div is not meaningful


    var idSuffix = elemId;
    this._idSuffix = elemId;
    var lovEnabled = !(options.disabled || false);
    this._lovEnabled = lovEnabled;
    var readonly = options.readOnly || false;
    var element = this.element;
    element.prop('disabled', !(lovEnabled && !readonly));
    var showIndicatorDelay = this._cssOptionDefaults.showIndicatorDelay;
    showIndicatorDelay = parseInt(showIndicatorDelay, 10);
    showIndicatorDelay = isNaN(showIndicatorDelay) ? 250 : showIndicatorDelay;
    var inputType = element.attr('type');
    this._resolveValueItemLater = false;
    var className = 'oj-searchselect';
    this._className = className;

    this._initContainer(className, idSuffix, readonly);

    var lovMainField = new LovMainField({
      className: className,
      ariaLabel: OuterWrapper.getAttribute('aria-label'),
      ariaControls: OuterWrapper.getAttribute('aria-controls'),
      showIndicatorDelay: showIndicatorDelay,
      idSuffix: idSuffix,
      inputType: inputType,
      enabled: lovEnabled,
      readOnly: readonly,
      placeholder: options.placeholder,
      getTranslatedStringFunc: getTranslatedStringFunc,
      addBusyStateFunc: addBusyStateFunc,
      forceReadOnly: this._fullScreenPopup,
      setLoadingFunc: this._SetLoading.bind(this),
      clearLoadingFunc: this._ClearLoading.bind(this)
    });
    this._lovMainField = lovMainField;

    this._initLovMainField(lovMainField);

    var mainFieldElem = lovMainField.getElement();
    OuterWrapper.appendChild(mainFieldElem); // @HTMLUpdateReview

    var filterInputText = this._createFilterInputText(className, idSuffix);

    if (!this._fullScreenPopup) {
      filterInputText.style.visibility = 'hidden';
    }

    this._filterInputText = filterInputText;
    OuterWrapper.appendChild(filterInputText); // @HTMLUpdateReview

    var afterDropdownInitFunc = function (resultsElem) {
      if (this._fullScreenPopup) {
        filterInputText.setAttribute('aria-controls', resultsElem.id);
      }
    }.bind(this);

    var lovDropdown = this._createLovDropdown(idSuffix, inputType, elemId, getTranslatedStringFunc, addBusyStateFunc, afterDropdownInitFunc);

    this._lovDropdown = lovDropdown; // this._initLovDropdown(lovDropdown, className);

    var dropdownElem = lovDropdown.getElement();
    OuterWrapper.appendChild(dropdownElem);
    dropdownElem.addEventListener('lovDropdownEvent', this._handleLovDropdownEvent.bind(this)); //  - Accessibility : JAWS does not read aria-controls attribute set on ojselect

    var $inputElem = $(lovMainField.getInputElem());
    $inputElem.attr('aria-owns', dropdownElem.id);
    var abstractLovBase = new AbstractLovBase({
      className: className,
      dataProvider: this._wrappedDataProvider,
      containerElem: OuterWrapper,
      fullScreenPopup: this._fullScreenPopup,
      idSuffix: idSuffix,
      lovMainField: lovMainField,
      filterInputText: filterInputText,
      lovDropdown: lovDropdown,
      liveRegion: this._liveRegion,
      enabled: lovEnabled,
      readOnly: readonly,
      value: options.value,
      getTranslatedStringFunc: getTranslatedStringFunc,
      addBusyStateFunc: addBusyStateFunc,
      showMainFieldFunc: this._showMainField.bind(this),
      setFilterFieldTextFunc: this._setFilterFieldText.bind(this)
    });
    this._abstractLovBase = abstractLovBase; // swap main field container for the element

    element.attr('tabindex', '-1').hide().attr('aria-hidden', true);

    if (abstractLovBase.hasData()) {
      this._initSelectedValue(options.valueItem);
    }

    this._refreshRequired(options.required); //  - need to be able to specify the initial value of select components bound to dprv


    this._resolveValueItemLater = this._mergeValueAndValueItem(options.value, options.valueItem);

    this._updateLabel();
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _releaseSelectResources: function _releaseSelectResources() {
    $(this._filterInputText).remove();
    $(this._lovMainField.getElement()).remove();
    $(this._liveRegion).remove();

    this._abstractLovBase.destroy();

    $(this._lovDropdown.getElement()).remove();

    this._lovDropdown.destroy();

    var OuterWrapper = this.OuterWrapper; // need to remove classes one by one because IE11 doesn't support passing multiple
    // arguments to a single remove() call

    var owClassList = OuterWrapper.classList;
    owClassList.remove(this._className);
    owClassList.remove('oj-form-control');
    owClassList.remove('oj-component');
    owClassList.remove('oj-read-only');
    owClassList.remove('oj-enabled');
    owClassList.remove('oj-disabled');
    $(OuterWrapper).off('change', '.' + this._className + '-input', LovUtils.stopEventPropagation).off(this._containerEventListeners);
    this._containerEventListeners = null;
    this.element.removeAttr('aria-hidden tabindex').show();
    var $labelElem = this._$labelElem;
    $labelElem.attr('for', $labelElem.attr('data-oj-lov-for'));
    $labelElem.removeAttr('data-oj-lov-for');
    this._$labelElem = null;

    this._removeDataProviderEventListeners();

    this._wrappedDataProvider = null;
    this._liveRegion = null;
    this._abstractLovBase = null;
    this._lovMainField = null;
    this._filterInputText = null;
    this._lovDropdown = null;
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _updateLabel: function _updateLabel() {
    var $labelElem = this._GetLabelElement() || $();
    this._$labelElem = $labelElem;
    var options = this.options;
    var labelId;

    if ($labelElem.length > 0) {
      if (!$labelElem.attr('id')) {
        $labelElem.attr('id', this._className + '-label-' + this._idSuffix);
      }

      $labelElem.attr('data-oj-lov-for', $labelElem.attr('for'));
      labelId = $labelElem.attr('id');
    } else if (options.labelledBy) {
      labelId = options.labelledBy;
    }

    var lovMainField = this._lovMainField;
    lovMainField.updateLabel(labelId); // element.attr('aria-labelledby', labelId);

    if ($labelElem.length > 0) {
      var $inputElem = $(lovMainField.getInputElem());
      $labelElem.attr('for', $inputElem.attr('id'));
    }

    if (labelId) {
      this._filterInputText.setAttribute('labelled-by', labelId);
    } //  - oghag missing label for ojselect and ojcombobox


    var labelText;

    if ($labelElem.length > 0) {
      if (!labelId) {
        labelText = $labelElem.text();
      }
    } else {
      var alabel = this.element.attr('aria-label');

      if (alabel) {
        labelText = alabel;
      }
    }

    this._lovDropdown.updateLabel(labelId, labelText);
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _initContainer: function _initContainer(className, idSuffix, readonly) {
    var elem = this.OuterWrapper;
    var $elem = $(elem); // need to add classes one by one because IE11 doesn't support passing multiple
    // arguments to a single add() call

    var elemClassList = elem.classList;
    elemClassList.add(className);
    elemClassList.add('oj-form-control');
    elemClassList.add('oj-component');

    if (!readonly) {
      elemClassList.add(this._lovEnabled ? 'oj-enabled' : 'oj-disabled');
    } else {
      elemClassList.add('oj-read-only');
    } // if (this._fullScreenPopup) {
    //   elemClassList.add('oj-searchselect-fullscreen');
    // } else {
    //   elemClassList.remove('oj-searchselect-fullscreen');
    // }


    var liveRegion = document.createElement('div');
    liveRegion.setAttribute('id', 'oj-listbox-live-' + idSuffix);
    liveRegion.setAttribute('role', 'region');
    liveRegion.setAttribute('class', 'oj-helper-hidden-accessible oj-listbox-liveregion');
    liveRegion.setAttribute('aria-live', 'polite');
    elem.appendChild(liveRegion); // @HTMLUpdateReview
    // do not propagate change event from the search field out of the component

    $elem.on('change', '.' + className + '-input', LovUtils.stopEventPropagation);
    this._containerEventListeners = {
      click: LovUtils.killEvent,
      keyup: function keyup(event) {
        if (event.keyCode === 10 || event.keyCode === 13) {
          $elem.removeClass('oj-focus');
        }
      },
      keydown: this._handleContainerKeyDown.bind(this),
      mousedown: this._handleContainerMouseDown.bind(this),
      mouseup: function mouseup() {
        $elem.removeClass('oj-active');
      }
    };
    $elem.on(this._containerEventListeners);
    this._liveRegion = liveRegion;
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _setFilterFieldText: function _setFilterFieldText(text) {
    this._ignoreFilterFieldRawValueChanged = true;
    this._filterInputText.value = text;
    this._ignoreFilterFieldRawValueChanged = false;
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _showFilterField: function _showFilterField(preserveState) {
    if (this._fullScreenPopup) {
      return;
    }

    var filterInputText = this._filterInputText;

    if (filterInputText.style.visibility === 'hidden') {
      var lovMainField = this._lovMainField;
      var mainInputElem = lovMainField.getInputElem();

      if (!preserveState) {
        this._setFilterFieldText(mainInputElem.value);

        LovUtils.copyAttribute(mainInputElem, 'aria-describedby', filterInputText, 'described-by');
      } // TODO: figure out how to do this through oj-input-text API


      var $filterInputElem = $(filterInputText).find('input');

      if ($filterInputElem.length > 0) {
        var filterInputElem = $filterInputElem[0];
        filterInputElem.setAttribute('role', 'combobox');

        if (!preserveState) {
          LovUtils.copyAttribute(mainInputElem, 'aria-required', filterInputElem, 'aria-required');
          LovUtils.copyAttribute(mainInputElem, 'aria-invalid', filterInputElem, 'aria-invalid');
        }
      }

      lovMainField.getInputElem().style.visibility = 'hidden';
      filterInputText.style.visibility = '';
      filterInputText.style.top = lovMainField.getElement().offsetTop + 'px';
      this.OuterWrapper.appendChild(filterInputText);
    }

    if (!preserveState) {
      //  - help.instruction text not always shown
      // in IE11, defer focusing the filter field so that the help.instruction text has time to show
      var agentInfo = oj.AgentUtils.getAgentInfo();

      if (agentInfo.browser === oj.AgentUtils.BROWSER.IE) {
        var resolveBusyContext = LovUtils.addBusyState(this.OuterWrapper, 'Select transferring focus to filter field');
        setTimeout(function () {
          filterInputText.focus();
          resolveBusyContext();
        }, 0);
      } else {
        filterInputText.focus();
      }
    }
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _showMainField: function _showMainField() {
    if (this._fullScreenPopup) {
      return;
    }

    var filterInputText = this._filterInputText;

    if (filterInputText.style.visibility !== 'hidden') {
      this._lovMainField.getInputElem().style.visibility = '';
      filterInputText.style.visibility = 'hidden';
    }
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _handleContainerKeyDown: function _handleContainerKeyDown(event) {
    if (!this._lovEnabled) {
      return;
    } // ignore control key and function key


    if (LovUtils.isControlOrFunctionKey(event)) {
      return;
    }

    if (event.which === LovUtils.KEYS.PAGE_UP || event.which === LovUtils.KEYS.PAGE_DOWN) {
      // prevent the page from scrolling
      event.preventDefault();
      return;
    }

    var abstractLovBase = this._abstractLovBase;
    var lovDropdown = this._lovDropdown;

    switch (event.which) {
      case LovUtils.KEYS.UP:
      case LovUtils.KEYS.DOWN:
        if (abstractLovBase.isDropdownOpen()) {
          // lovDropdown.transferHighlight((event.which === LovUtils.KEYS.UP) ? -1 : 1);
          oj.FocusUtils.focusFirstTabStop(lovDropdown.getElement()); // if tabbing into dropdown, continue showing filter field as it was before tabbing
          //  - ie11: filter field hidden when you arrow into dropdown
          // in IE11, defer showing filter field until after focus transfer into dropdown has
          // happened

          var agentInfo = oj.AgentUtils.getAgentInfo();

          if (agentInfo.browser === oj.AgentUtils.BROWSER.IE) {
            var resolveBusyContext = LovUtils.addBusyState(this.OuterWrapper, 'Select showing filter field while arrowing into dropdown');
            setTimeout(function () {
              this._showFilterField(true);

              resolveBusyContext();
            }.bind(this), 0);
          } else {
            this._showFilterField(true);
          }
        } else {
          abstractLovBase.openDropdown(); // if opening dropdown just after selecting an item, when main field selection elem is
          // focused, then focus main input field so that filter field gets shown
          // if (!this._fullScreenPopup) {
          //   $(this._lovMainField.getInputElem()).focus();
          // }
        } //  - select and combobox stop keyboard event propegation


        event.preventDefault();
        break;

      case LovUtils.KEYS.ENTER:
        // lovDropdown.activateHighlightedElem();
        //  - select and combobox stop keyboard event propegation
        event.preventDefault();
        break;

      case LovUtils.KEYS.TAB:
        abstractLovBase.closeDropdown();

        if (!this._fullScreenPopup && event.shiftKey) {
          var filterInputText = this._filterInputText;
          var parentElem = filterInputText.parentNode; // move all the siblings before the filterInputText to the end, so that focus won't go to
          // the main input field and will instead go to the previous tabbable elem on the page
          // (can't just move the filterInputText because it's involved in the focus change and
          // the browser throws an error)

          while (parentElem.firstChild !== filterInputText) {
            parentElem.appendChild(parentElem.firstChild);
          }
        }

        break;

      case LovUtils.KEYS.ESC:
        if (abstractLovBase.isDropdownOpen()) {
          abstractLovBase.cancel(); // prevent the page from scrolling

          event.preventDefault();
        }

        break;

      default:
        break;
    }
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _handleContainerMouseDown: function _handleContainerMouseDown(event) {
    var abstractLovBase = this._abstractLovBase; // prevent user from focusing on disabled select

    if (!this._lovEnabled) {
      event.preventDefault();
    } // if select box gets focus ring via keyboard event previously, clear it now
    // $(this._lovMainField.getSelectionElem()).removeClass('oj-focus-highlight');


    var OuterWrapper = this.OuterWrapper; // TODO: is there a way to qualify this inclusively based on our created DOM instead of
    // exclusively based on inline messaging container?
    // don't open the dropdown when clicking on messages

    var inlineMessagingContainer = OuterWrapper.querySelector('.oj-messaging-inline-container');

    if (inlineMessagingContainer && oj.DomUtils.isAncestorOrSelf(inlineMessagingContainer, event.target)) {
      return;
    } // don't open dropdown when clicking on top label


    var $OuterWrapper = $(OuterWrapper);
    var clickedTopLabel = false;

    if (OuterWrapper.classList.contains('oj-form-control-label-top')) {
      var labels = $OuterWrapper.children('.oj-label');

      if (labels.length > 0 && oj.DomUtils.isAncestorOrSelf(labels[0], event.target)) {
        clickedTopLabel = true;
      }
    } // only open dropdown on left (main) button click


    var mainButton = event.button === 0;

    if (mainButton) {
      if (abstractLovBase.isDropdownOpen()) {
        abstractLovBase.closeDropdown();
      } else if (this._lovEnabled && !clickedTopLabel) {
        abstractLovBase.openDropdown(); // prevent the focus from moving back or to whatever happens to be under the mouse/touch
        // point when the dropdown opens

        if (this._fullScreenPopup) {
          event.preventDefault();
        }
      }
    }

    if (!clickedTopLabel) {
      $OuterWrapper.addClass('oj-active');

      if (mainButton) {
        //  - clicking on component does not always focus input
        // prevent focus from transferring back
        event.preventDefault();

        if (!this._fullScreenPopup && this._lovEnabled) {
          //  - help.instruction text not always shown
          // if the filter field is hidden, focus the main field instead of directly showing the
          // filter field so that help.instruction text will be shown
          // if the filter field is already shown, call _showFilterField directly anyway to do
          // whatever other processing it needs to do, because the main input elem is hidden and
          // can't receive focus
          if (this._filterInputText.style.visibility === 'hidden') {
            this._lovMainField.getInputElem().focus();
          } else {
            this._showFilterField();
          }
        }
      }
    }
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _handleLovDropdownEvent: function _handleLovDropdownEvent(event) {
    var detail = event.detail;
    var abstractLovBase = this._abstractLovBase; // var lovMainField = this._lovMainField;

    switch (detail.subtype) {
      case 'cancelDropdown':
        abstractLovBase.cancel();
        break;

      case 'closeDropdown':
        if (detail.trigger === 'escKeyDown') {
          this._filterInputText.focus();
        } else if (detail.trigger === 'clickAway') {
          // need to explicitly show main field again if focus is in the dropdown
          if (oj.DomUtils.isAncestor(this._lovDropdown.getElement(), document.activeElement)) {
            this._showMainField();
          }

          this.OuterWrapper.classList.remove('oj-focus');
        }

        abstractLovBase.closeDropdown();
        break;
      // case 'tabOut':
      //   // If no control item focused and going forward, then put focus on the
      //   // input so that it can naturally go to the next focusable item, but don't
      //   // kill the event so that it can go to the next field.
      //   // lovMainField.getInputElem().focus();
      //   this._filterInputText.focus();
      //   break;

      case 'sizeDropdown':
        abstractLovBase.sizeDropdown();
        break;

      case 'adjustDropdownPosition':
        abstractLovBase.adjustDropdownPosition(detail.popupElem);
        break;

      case 'openPopup':
        var psOptions = detail.psOptions;
        psOptions[oj.PopupService.OPTION.LAUNCHER] = this.element;
        psOptions[oj.PopupService.OPTION.POSITION] = abstractLovBase.getDropdownPosition();
        oj.PopupService.getInstance().open(psOptions);
        break;

      case 'handleSelection':
        this._handleSelection(detail.valueItem, detail.selectionOptions, detail.event);

        break;
      // case 'updateLiveRegion':
      //   abstractLovBase.updateLiveRegion(detail.text);
      //   break;
      // case 'currentItemChanged':
      //   // TODO: update search field with item text
      //   // TODO: no longer pass detail.id, but only detail.key, so would need a way to map from
      //   // key to rendered item if we need to set activedescendant here
      //   // var $searchElem = this._fullScreenPopup ? $(this._lovDropdown.getSearchElem()) :
      //   //   $(lovMainField.getInputElem());
      //   // if (detail.id !== null) {
      //   //   $searchElem.attr('aria-activedescendant', detail.id);
      //   // } else {
      //   //   $searchElem.removeAttr('aria-activedescendant');
      //   // }
      //   break;

      case 'dropdownClosed':
        //  - LIST FILTERED ON SELECTED ITEM WHEN IT PROBABLY SHOULDN'T BE
        // clear the stored value when the dropdown closes
        this._searchTextOnKeyDown = undefined;
        break;

      default:
        break;
    }
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _handleSelection: function _handleSelection(valueItem, selectionOptions, event) {
    var abstractLovBase = this._abstractLovBase;
    var context;

    if (selectionOptions && selectionOptions.trigger) {
      context = {
        optionMetadata: {
          trigger: selectionOptions.trigger
        }
      };
    } // if (!this._fullScreenPopup) {
    //   this._showMainField();
    // }
    // When there is validation error, the value option may retain the previous value
    // although the display value is different. In that case, user should be able to still
    // select the previous valid value to get rid off the invalid style and message.

    /* if (!(old === LovUtils.getOptionValue(data)))*/


    var newValueItem = LovUtils.isValueItemForPlaceholder(valueItem) ? this._valueItemForPlaceholder : valueItem;

    this._handleUserSelectedValueItem(newValueItem, event, context);

    if (!event || event.type !== 'blur') {
      // this._lovMainField.focusCursorEndInputElem();
      var inputElem = this._lovMainField.getInputElem();

      if (!this._fullScreenPopup) {
        this._setFilterFieldText(inputElem.value); // show the filter field after selecting an item on mobile because we want the focus to
        // go back to the main part of the component, and the user can tab out or reopen the
        // dropdown or filter again


        this._showFilterField();
      } else {
        // focus the input element after selecting an item on mobile because we want the focus to
        // go back to the main part of the component, and the user can tab out or reopen the
        // dropdown
        inputElem.focus();
      }
    } //  - edge, safari: kb focus transfer only works the first time
    // close the dropdown AFTER transferring focus to input field above so that the listView in the
    // dropdown will get a blur event first


    abstractLovBase.closeDropdown();
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _handleUserSelectedValueItem: function _handleUserSelectedValueItem(valueItem, event, context) {
    var abstractLovBase = this._abstractLovBase; //  - selected value got replaced once the label for initial value is available

    if (this._cachedFetchByKeys) {
      this._valueHasChanged = true; // remove loading indicator

      this._lovMainField.setUiLoadingState('stop');
    } //  - resetting value when value-item and placeholder are set throws exception


    if (LovUtils.isValueItemForPlaceholder(valueItem)) {
      this._setValueItem(this._valueItemForPlaceholder);
    } else {
      this._resolveValueItemLater = true;
    }

    var value = null;

    if (!LovUtils.isValueItemForPlaceholder(valueItem)) {
      value = valueItem.key;
    } // need to set value on AbstractLovBase first because it needs to be up-to-date within
    // call to _SetValue in order to update display label


    abstractLovBase.setValue(value); // temporarily store valueItem so that we can set it from within _SetValue call instead of
    // having to call fetchByKeys on the data provider

    this._userSelectedValueItem = valueItem; //  - select needs implementation fixes...

    var ret = this._SetValue(value, event, {
      doValueChangeCheck: false,
      _context: context
    });

    var clearUserSelectedValueItem = function () {
      this._userSelectedValueItem = null;
    }.bind(this);

    if (ret instanceof Promise) {
      ret.then(clearUserSelectedValueItem, clearUserSelectedValueItem);
    } else {
      clearUserSelectedValueItem();
    }
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _initLovMainField: function _initLovMainField(lovMainField) {
    $(lovMainField.getInputElem()).on({
      focus: function (event) {
        LovUtils.killEvent(event);

        if (!this._fullScreenPopup && !this.options.readOnly) {
          this._showFilterField();
        }
      }.bind(this)
    });
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _createFilterInputText: function _createFilterInputText(className, idSuffix) {
    var ariaLabel = this.OuterWrapper.getAttribute('aria-label');
    var ariaControls = this.OuterWrapper.getAttribute('aria-controls');
    var options = this.options;
    var filterInputText = document.createElement('oj-input-text');
    filterInputText.setAttribute('id', className + '-filter-' + idSuffix);
    filterInputText.setAttribute('class', className + '-filter');
    filterInputText.setAttribute('clear-icon', this._fullScreenPopup ? 'always' : 'never');
    filterInputText.setAttribute('autocomplete', 'off');
    filterInputText.setAttribute('aria-autocomplete', 'list');
    filterInputText.setAttribute('data-oj-internal', '');
    filterInputText.setAttribute('data-oj-binding-provider', 'none');

    if (options.placeholder) {
      filterInputText.setAttribute('placeholder', options.placeholder);
    } // if (options.labelEdge) {
    //   filterInputText.setAttribute('label-edge', options.labelEdge);
    // }
    // if (options.labelHint) {
    //   filterInputText.setAttribute('label-hint', options.labelHint);
    // }


    if (ariaLabel) {
      filterInputText.setAttribute('aria-label', ariaLabel);
    }

    if (!this._fullScreenPopup && ariaControls) {
      filterInputText.setAttribute('aria-controls', ariaControls);
    } // apply virtualKeyboard input type to search field


    filterInputText.setAttribute('virtual-keyboard', options.virtualKeyboard);

    if (!this._fullScreenPopup) {
      // create a hidden icon in the end slot to account for the dropdown open icon in the main
      // field on desktop
      var a = document.createElement('a');
      a.setAttribute('class', className + '-arrow ' + className + '-open-icon ' + className + '-icon oj-component-icon oj-clickable-icon-nocontext');
      a.setAttribute('slot', 'end');
      a.style.visibility = 'hidden';
      filterInputText.appendChild(a);
    } else {
      // create the magnifying glass icon at the start of the field on mobile
      var filterIconWrapper = document.createElement('span');
      filterIconWrapper.setAttribute('slot', 'start');
      filterIconWrapper.setAttribute('class', className + '-filter-indicator');
      filterInputText.appendChild(filterIconWrapper);
      var filterIcon = document.createElement('span');
      filterIcon.setAttribute('class', className + '-filter-indicator-icon ' + className + '-icon oj-component-icon oj-clickable-icon-nocontext');
      filterIconWrapper.appendChild(filterIcon);
    }

    var $elem = $(this.OuterWrapper);
    filterInputText.addEventListener('rawValueChanged', function (event) {
      // this._abstractLovBase isn't defined yet, so can't directly use that function as the
      // listener, need to wrap in outer function
      if (!this._ignoreFilterFieldRawValueChanged) {
        this._abstractLovBase.updateResults(event);
      }
    }.bind(this));
    filterInputText.addEventListener('focus', function () {
      $elem.addClass('oj-focus');
    });
    filterInputText.addEventListener('blur', function (event) {
      $elem.removeClass('oj-focus');

      if (!this._fullScreenPopup) {
        // don't hide the filter field if tabbing into the dropdown
        if (!event.relatedTarget || !oj.DomUtils.isAncestor(this._lovDropdown.getElement(), event.relatedTarget)) {
          this._showMainField();
        }
      }
    }.bind(this));
    return filterInputText;
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  // _initLovDropdown: function (lovDropdown, className) {
  //   var $searchElem = $(lovDropdown.getSearchElem());
  //   $searchElem.on({
  //     keydown: function () {
  //       this._handleSearchKeyDown($searchElem.val());
  //     }.bind(this),
  //     keyup: function (event) {
  //       this._handleSearchKeyUp($searchElem.val(), event);
  //       if (event.keyCode === 10 || event.keyCode === 13) {
  //         $searchElem.removeClass(className + '-focused');
  //       }
  //     }.bind(this),
  //     'input paste': function (event) {
  //       // this._abstractLovBase isn't defined yet, so can't directly use that function as the
  //       // listener, need to wrap in outer function
  //       this._abstractLovBase.updateResults(event);
  //     }.bind(this),
  //     focus: function () {
  //       $searchElem.addClass(className + '-focused');
  //     },
  //     blur: function () {
  //       $searchElem.removeClass(className + '-focused');
  //     }
  //   });
  // },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _createLovDropdown: function _createLovDropdown(idSuffix, inputType, containerId, getTranslatedStringFunc, addBusyStateFunc, afterDropdownInitFunc) {
    return new LovDropdown({
      dataProvider: this._wrappedDataProvider,
      className: 'oj-select',
      parentId: containerId,
      idSuffix: idSuffix,
      fullScreenPopup: this._fullScreenPopup,
      inputType: inputType,
      bodyElem: $(this.OuterWrapper).closest('body')[0],
      // headerTemplate: this._getTemplateSlot('headerTemplate'),
      // footerTemplate: this._getTemplateSlot('footerTemplate'),
      itemTemplate: this._getTemplateSlot('itemTemplate'),
      collectionTemplate: this._getTemplateSlot('collectionTemplate'),
      getTemplateEngineFunc: this._loadTemplateEngine.bind(this),
      templateContextComponentElement: this.OuterWrapper,
      getTranslatedStringFunc: getTranslatedStringFunc,
      addBusyStateFunc: addBusyStateFunc,
      itemTextRendererFunc: this._itemTextRenderer.bind(this),
      filterInputText: this._filterInputText,
      afterDropdownInitFunc: afterDropdownInitFunc
    });
  },

  /**
   * Initiate loading of the template engine.  An error is thrown if the template engine failed to
   * load.
   * @return {Promise} resolves to the template engine, or null if no item template is specified
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _loadTemplateEngine: function _loadTemplateEngine() {
    if (!this._templateEngine) {
      var resolveBusyContext = LovUtils.addBusyState(this.OuterWrapper, 'Select loading template engine');
      return new Promise(function (resolve, reject) {
        Config.__getTemplateEngine().then(function (engine) {
          this._templateEngine = engine;
          resolve(engine);
          resolveBusyContext();
        }.bind(this), function (reason) {
          reject(new Error('Error loading template engine: ' + reason));
          resolveBusyContext();
        });
      }.bind(this));
    }

    return Promise.resolve(this._templateEngine);
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _refreshRequired: oj.EditableValueUtils._refreshRequired,

  /**
   * Called to find out if aria-required is unsupported.
   * @memberof! oj.ojSelect2
   * @instance
   * @protected
   */
  _AriaRequiredUnsupported: function _AriaRequiredUnsupported() {
    return false;
  },

  /**
   * Refreshes the Select.
   *
   * <p>This method does not accept any arguments.
   *
   * @expose
   * @memberof oj.ojSelectSingle
   * @instance
   * @return {void}
   * @public
   */
  refresh: function refresh() {
    this._super();

    this._releaseSelectResources();

    this._setupSelectResources();

    this._initComponentMessaging();
  },

  /**
   * Override to setup resources needed by this component.
   * @memberof oj.ojSelect2
   * @override
   * @protected
   */
  _SetupResources: function _SetupResources() {
    this._super(); // only do something if _ReleaseResources was called, because _SetupResources will be called
    // after _ComponentCreate and _AfterCreate during initialization, in which case we will have
    // already called _setupSelectResources during _ComponentCreate


    if (this._bReleasedResources) {
      this._bReleasedResources = false;

      this._setupSelectResources();
    }
  },

  /**
   * Override to release resources held by this component.
   * @memberof oj.ojSelect2
   * @override
   * @protected
   */
  _ReleaseResources: function _ReleaseResources() {
    this._super();

    this._bReleasedResources = true;

    this._releaseSelectResources();
  },

  /**
   * Handles options specific to Select.
   * @override
   * @protected
   * @memberof! oj.ojSelect2
   */
  _setOption: function _setOption(key, value, flags) {
    var abstractLovBase = this._abstractLovBase;

    this._super(key, value, flags); //  - need to be able to specify the initial value of select components bound to dprv


    if (key === 'valueItem') {
      this._syncValueWithValueItem(value, this.options.value);
    } else if (key === 'value') {
      abstractLovBase.setValue(value); //  - placeholder is not displayed after removing selections from select many
      //  - resetting value when value-item and placeholder are set throws exception

      if (LovUtils.isValueForPlaceholder(value)) {
        this._setValueItem(this._valueItemForPlaceholder);
      } else {
        // update valueItem
        this._updateValueItem(value);
      } // need to update display value again after valueItem is set correctly


      this._SetDisplayValue();
    } else if (key === 'disabled' || key === 'readOnly' || key === 'placeholder' || key === 'data' || key === 'itemText') {
      this.refresh();
    } else if (key === 'labelledBy') {
      if (this.options.labelledBy) {
        var id = this._GetContentElement()[0].id;

        this._labelledByChangedForInputComp(this.options.labelledBy, id);
      } // TODO: need to do a targeted update here, because calling refresh clears any custom
      // messages that should be shown on first display (because EditableValue may asynchronously
      // set labelled-by attr on our custom element after we've been initialized)
      // this.refresh();


      this._updateLabel();
    }
  },

  /**
   * Performs post processing after _SetOption() is called. Different options when changed perform
   * different tasks. See _AfterSetOption[OptionName] method for details.
   *
   * @param {string} option
   * @param {Object|string=} previous
   * @param {Object=} flags
   * @protected
   * @memberof! oj.ojSelect2
   * @instance
   * @override
   */
  // eslint-disable-next-line no-unused-vars
  _AfterSetOption: function _AfterSetOption(name, flags) {
    this._superApply(arguments);

    switch (name) {
      case 'required':
        this._AfterSetOptionRequired(name);

        break;

      case 'virtualKeyboard':
        this._SetInputType(this._ALLOWED_INPUT_TYPES);

        this.refresh();
        break;

      default:
        break;
    }
  },
  // 19670748, dropdown popup should be closed on subtreeDetached notification.

  /**
   * @protected
   * @memberof! oj.ojSelect2
   * @instance
   * @override
   */
  _NotifyDetached: function _NotifyDetached() {
    this._superApply(arguments);

    this._abstractLovBase.closeDropdown();
  },
  // 19670748, dropdown popup should be closed on subtreeHidden notification.

  /**
   * @protected
   * @memberof! oj.ojSelect2
   * @instance
   * @override
   */
  _NotifyHidden: function _NotifyHidden() {
    this._superApply(arguments);

    this._abstractLovBase.closeDropdown();
  },

  /**
   * Override to do the delay connect/disconnect
   * @memberof oj.ojSelect2
   * @override
   * @protected
   */
  _VerifyConnectedForSetup: function _VerifyConnectedForSetup() {
    //  - temp moving element from one parent to another should not cause fetch
    return true;
  },

  /**
   * Set the type of the input element based on virtualKeyboard option.
   * @param {Array.<string>} allowedTypes an array of allowed types
   * @memberof oj.ojSelect2
   * @override
   * @protected
   */
  _SetInputType: oj.EditableValueUtils._SetInputType,

  /**
   * Updates display value of Select.
   * @override
   * @protected
   * @memberof! oj.ojSelect2
   */
  // eslint-disable-next-line no-unused-vars
  _SetDisplayValue: function _SetDisplayValue(displayValue) {
    //  - need to be able to specify the initial value of select components bound to dprv
    if (!this._applyValueItem(this.options.valueItem)) {
      this._initSelectedValue();
    }

    this._resolveValueItemLater = false;
  },

  /**
   * <ol>
   * <li>All messages are cleared, including custom messages added by the app. </li>
   * <li>The implicit required validator is run if the component is marked required.</li>
   * <li>At the end of validation if there are errors, the messages are shown.
   * If there were no errors, then the
   * <code class="prettyprint">value</code> option is updated.</li>
   * </ol>
   *
   * @example <caption>Validate component using its current value.</caption>
   * myComp.validate();
   *
   * @example <caption>Validate component and use the Promise's resolved state.</caption>
   * myComp.validate().then(
   *  function(result) {
   *    if(result === "valid")
   *    {
   *      submitForm();
   *    }
   *  });
   * @return {Promise} Promise resolves to "valid" if the component passed all validations.
   * The Promise resolves to "invalid" if there were validation errors.
   * @method
   * @access public
   * @expose
   * @instance
   * @memberof oj.ojSelectSingle
   */
  validate: function validate() {
    var displayValueForSetValue = $(this._lovMainField.getInputElem()).val(); // returns Promise that resolves to true|false or boolean

    var returnValue = this._SetValue(displayValueForSetValue, null, this._VALIDATE_METHOD_OPTIONS);

    if (!(returnValue instanceof Promise)) {
      returnValue = Promise.resolve(returnValue ? 'valid' : 'invalid');
    } else {
      returnValue = returnValue.then(function (booleanSetValueReturn) {
        return Promise.resolve(booleanSetValueReturn ? 'valid' : 'invalid');
      });
    }

    return returnValue;
  },

  /**
   * @override
   * @protected
   * @memberof! oj.ojSelect2
   *
   * @param {!Object} menu The JET Menu to open as a context menu.  Always non-<code class="prettyprint">null</code>.
   * @param {!Event} event What triggered the menu launch.  Always non-<code class="prettyprint">null</code>.
   * @param {string} eventType "mouse", "touch", or "keyboard".  Never <code class="prettyprint">null</code>.
   */
  _NotifyContextMenuGesture: function _NotifyContextMenuGesture(menu, event, eventType) {
    // The default baseComponent behavior in _OpenContextMenu assumes this.element for the
    // launcher. In this case, the original element the component is bound to is
    // hidden (display: none). Pass in an openOption override.
    var launcher = this._GetMessagingLauncherElement();

    this._OpenContextMenu(event, eventType, {
      launcher: launcher
    });
  },

  /**
   * Returns the jquery element that represents the content part of the component.
   * This is usually the component that user sets focus on (tabindex is set 0) and
   * where aria attributes like aria-required, aria-labeledby etc. are set. This is
   * also the element where the new value is updated. Usually this is the same as
   * the _GetMessagingLauncherElement.
   *
   * @override
   * @protected
   * @memberof! oj.ojSelect2
   * @return {jQuery} jquery element which represents the content.
   */
  _GetContentElement: function _GetContentElement() {
    // if a non-empty string placeholder is set, then EditableValue calls this from within its
    // _ComponentCreate, which is before the abstractLovBase is created
    if (this._lovMainField) {
      return $(this._lovMainField.getInputElem());
    }

    return this.element;
  },

  /**
   * Returns the default styleclass for the component.
   *
   * @return {string}
   * @expose
   * @memberof! oj.ojSelect2
   * @override
   * @protected
   */
  _GetDefaultStyleClass: function _GetDefaultStyleClass() {
    return 'oj-select';
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _isDataProvider: function _isDataProvider(data) {
    return data && oj.DataProviderFeatureChecker ? oj.DataProviderFeatureChecker.isDataProvider(data) : false;
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _isTreeDataProvider: function _isTreeDataProvider(data) {
    return data && oj.DataProviderFeatureChecker ? oj.DataProviderFeatureChecker.isTreeDataProvider(data) : false;
  },

  /**
   * save the new wrapper or the original data provider
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _wrapDataProviderIfNeeded: function _wrapDataProviderIfNeeded(dataProvider) {
    if (this._isDataProvider(dataProvider)) {
      var wrapper = dataProvider; // make sure data provider is an instance of *DataProviderView, and wrap it with one if it
      // isn't, so that we can use the FilterFactory to create filter criterion and have the DP
      // do local filtering if needed

      if (this._isTreeDataProvider(wrapper)) {
        if (!(wrapper instanceof TreeDataProviderView)) {
          wrapper = new TreeDataProviderView(wrapper);
        }
      } else if (!(wrapper instanceof ListDataProviderView)) {
        wrapper = new ListDataProviderView(wrapper);
      }

      wrapper = new FilteringDataProviderView(wrapper); // save the data provider or wrapper

      this._wrappedDataProvider = wrapper;
    } else {
      this._wrappedDataProvider = new FilteringDataProviderView();
    }
  },

  /**
   * Add data provider event listeners
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _addDataProviderEventListeners: function _addDataProviderEventListeners() {
    var dataProvider = this._wrappedDataProvider;

    if (dataProvider) {
      this._removeDataProviderEventListeners();

      var dataProviderEventHandler = this._handleDataProviderEvent.bind(this);

      this._savedDataProviderEH = dataProviderEventHandler;
      dataProvider.addEventListener('mutate', dataProviderEventHandler);
      dataProvider.addEventListener('refresh', dataProviderEventHandler);
    }
  },

  /**
   * Remove data provider event listeners
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _removeDataProviderEventListeners: function _removeDataProviderEventListeners() {
    var dataProvider = this._wrappedDataProvider;
    var dataProviderEventHandler = this._savedDataProviderEH;

    if (dataProvider && dataProviderEventHandler) {
      dataProvider.removeEventListener('mutate', dataProviderEventHandler);
      dataProvider.removeEventListener('refresh', dataProviderEventHandler);
      this._savedDataProviderEH = undefined;
    }
  },

  /**
   * Handle data provider events
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _handleDataProviderEvent: function _handleDataProviderEvent(event) {
    if (event.filterCriterionChanged) {
      return;
    }

    var newVal = this.options.value;

    if (event.type === 'mutate') {
      if (event.detail.remove != null) {
        var keys = event.detail.remove.keys;
        keys.forEach(function (key) {
          if (oj.Object.compareValues(key, newVal)) {
            newVal = this._valueForPlaceholder;
            Logger.warn('Select: selected value removed from data provider');
          }
        }.bind(this));
      }
    } // if the event wasn't dispatched internally, need to re-set the value now that the label may
    // be available, or because a mutation event removed a selected value


    this._setOption('value', newVal);

    this._abstractLovBase.handleDataProviderEvent(event);
  },

  /**
   * merge value and valueItem, value wins if both are specified
   * return true if the value is specified and it's not contained in valueItem
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _mergeValueAndValueItem: function _mergeValueAndValueItem(value, valueItem) {
    var resolveLater = false; // value specified

    if (!LovUtils.isValueForPlaceholder(value)) {
      // both value and valueItem specified, find the option for the value
      if (valueItem) {
        // may need to find out the label and setValueItem later
        resolveLater = !oj.Object.compareValues(value, valueItem.key);
      }
    } else if (valueItem) {
      // value not specified
      this._syncValueWithValueItem(valueItem, value);
    }

    return resolveLater;
  },

  /**
   * single selection: keep value in sync with valueItem
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _syncValueWithValueItem: function _syncValueWithValueItem(valueItem, value) {
    var abstractLovBase = this._abstractLovBase;
    var newVal; //  - resetting value when value-item and placeholder are set throws exception

    if (LovUtils.isValueItemForPlaceholder(valueItem)) {
      if (LovUtils.isValueForPlaceholder(value)) {
        newVal = value;
      } else {
        newVal = this._valueForPlaceholder;
      }
    } else {
      newVal = valueItem ? valueItem.key : null;
    }

    if (!oj.Object.compareValues(newVal, value)) {
      var flags = {
        doValueChangeCheck: false,
        _context: {
          internalSet: true,
          writeback: true
        }
      };
      this.option('value', newVal, flags);
      abstractLovBase.setValue(newVal); // When internalSet is true _setOption->_AfterSetOptionValue->_Refresh isn't called.
      // We still need the displayValue to be refreshed, so call this._AfterSetOptionValue
      // explicitly.

      this._AfterSetOptionValue('value', flags);
    }
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _initSelectedValue: function _initSelectedValue(valueItem) {
    //  - need to be able to specify the initial value of select components bound to dprv
    if (!this._applyValueItem(valueItem)) {
      var value = valueItem ? valueItem.key : this.options.value;

      this._initSelectionHelper(value, this._updateSelectedOption.bind(this));
    }
  },

  /**
   *  - need to be able to specify the initial value of select components bound to dprv
   * If both dataProvider and valueItem[s] are specified, use valueItem[s] for display values.
   * If valueItem[s] is not specified or a selected value is missing then we will fetch the real
   * data from the dataProvider like before.
   * return true if valueItem[s] is applied, false otherwise
   *
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _applyValueItem: function _applyValueItem(valueItem) {
    //  - resetting value when value-item and placeholder are set throws exception
    //  - placeholder is not displayed after removing selections from select many
    if (!this._resolveValueItemLater && !LovUtils.isValueItemForPlaceholder(valueItem)) {
      this._updateInputElemValue(valueItem);

      return true;
    }

    return false;
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _updateSelectedOption: function _updateSelectedOption(valueItem) {
    this._updateInputElemValue(valueItem); //  - need to be able to specify the initial value of select components bound
    // to dprv


    this._setValueItem(valueItem);
  },
  //  - need to be able to specify the initial value of select components bound to dprv

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _setValueItem: function _setValueItem(valueItem) {
    var newValueItem = valueItem; //  - resetting value when value-item and placeholder are set throws exception

    if (valueItem && !LovUtils.isValueItemForPlaceholder(valueItem)) {
      newValueItem = LovUtils.createValueItem(valueItem.key, valueItem.data, valueItem.metadata);
    }

    var context = {
      internalSet: true,
      changed: true,
      writeback: true
    };
    this.option('valueItem', newValueItem, {
      _context: context
    });
  },
  // update display label(s) and valueItem(s) after value was set

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _updateValueItem: function _updateValueItem(value) {
    // TODO: does value need to be normalized?
    // var value = LovUtils.normalizeValue(_value);
    this._initSelectionHelper(value, function (valueItem) {
      this._setValueItem(valueItem);

      this._updateSelectedOption(valueItem);
    }.bind(this));
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _updateInputElemValue: function _updateInputElemValue(valueItem) {
    var $inputElem = $(this._lovMainField.getInputElem());
    this._selectedValueItem = valueItem;
    var text = null;

    if (valueItem && valueItem.data) {
      var formatted = this._itemTextRenderer(valueItem);

      var inputElemText = $inputElem.val();

      if (formatted !== undefined && inputElemText !== formatted) {
        text = formatted;
      }
    } else {
      // data will be null only when user set it programmatically.
      text = '';
    }

    if (text !== null) {
      $inputElem.val(text);
    }
  },

  /**
   * Renders text representing a data item.
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _itemTextRenderer: function _itemTextRenderer(valueItem) {
    var formatted;

    if (valueItem && valueItem.data) {
      var itemText = this.options.itemText;

      if (typeof itemText === 'string') {
        formatted = valueItem.data[itemText];
      } else {
        formatted = itemText(valueItem);
      }
    }

    return formatted;
  },
  // install default initSelection when applied to hidden input
  // and getting data from remote

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _initSelectionHelper: function _initSelectionHelper(value, initSelectionCallback) {
    // ojselect set initial selected value
    if (LovUtils.isValueForPlaceholder(value)) {
      initSelectionCallback(this._valueItemForPlaceholder);
    } else if (this._abstractLovBase.hasData()) {
      // if user has selected a new value in the UI, use the saved valueItem instead of calling
      // fetchByKeys on the data provider
      if (this._userSelectedValueItem) {
        var valueItem = this._userSelectedValueItem;

        this._initSelectionFetchByKey({
          data: [valueItem.data],
          metadata: [valueItem.metadata]
        }, value, initSelectionCallback);
      } else {
        this._fetchByKeysFromDataProvider([value]).then(function (fetchResults) {
          this._initSelectionFetchByKey(fetchResults, value, initSelectionCallback);
        }.bind(this), function () {
          this._initSelectionFetchByKey(null, value, initSelectionCallback);
        }.bind(this));
      }
    }
  },

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _initSelectionFetchByKey: function _initSelectionFetchByKey(fetchResults, value, initSelectionCallback) {
    //  - While fetching the label for the initial value,
    // user can still interact the component and pick a new value.
    if (oj.Object.compareValues(value, this.options.value) && !this._valueHasChanged) {
      var data = null;
      var metadata = null;

      if (fetchResults && fetchResults.data && fetchResults.data.length > 0) {
        data = fetchResults.data[0];
        metadata = fetchResults.metadata[0];
      } else {
        Logger.warn('SelectSingle: could not fetch data for selected value: ' + value);
      }

      initSelectionCallback(LovUtils.createValueItem(value, data, metadata));
      this._valueHasChanged = undefined;
    }
  },
  // fetch the data row by its key("value")
  // returns a promise that resolves to an object with one property: results

  /**
   * @memberof! oj.ojSelect2
   * @instance
   * @private
   */
  _fetchByKeysFromDataProvider: function _fetchByKeysFromDataProvider(arKeys) {
    //  - sdp.fetchbykeys method is being called twice for a single value
    // Stored the selected value in this._cachedFetchByKeys, it will be cleared when the
    // promise is resolved or rejected. When this method is called again with the same selected
    // value, don't make another call to dataProvider.fetchByKeys because the previous one is in
    // flight.
    var fetchPromise;

    if (this._cachedFetchByKeys && this._cachedFetchByKeys.promise && oj.Object.compareValues(arKeys, this._cachedFetchByKeys.key)) {
      fetchPromise = this._cachedFetchByKeys.promise;
    } else {
      // add busy context
      var fetchResolveFunc = LovUtils.addBusyState(this.OuterWrapper, 'fetching selected data'); //  - display loading indicator when fetching label for initial value is slow

      var bLoadingIndicatorAdded = false;

      if (this._abstractLovBase.getFetchType() === 'init') {
        bLoadingIndicatorAdded = true;

        if (!this._abstractLovBase.isDropdownOpen()) {
          this._lovMainField.setUiLoadingState('start');
        }
      }

      fetchPromise = new Promise(function (resolve, reject) {
        // fetch the data row by its key("value")
        var dpPromise = this._wrappedDataProvider.fetchByKeys({
          keys: new Set(arKeys)
        });

        dpPromise.then(function (fetchResults) {
          var data = [];
          var metadata = [];
          fetchResults.results.forEach(function (val) {
            data.push(val.data);
            metadata.push(val.metadata);
          });
          resolve({
            data: data,
            metadata: metadata
          });
        }, function (reason) {
          reject(reason);
        });
      }.bind(this)); // save key and promise
      // eslint-disable-next-line no-param-reassign

      this._cachedFetchByKeys = {
        key: arKeys,
        promise: fetchPromise
      };

      var afterFetchPromiseFunc = function () {
        //  - sdp.fetchbykeys method is being called twice for a single value
        // eslint-disable-next-line no-param-reassign
        this._cachedFetchByKeys = undefined;

        if (bLoadingIndicatorAdded) {
          this._lovMainField.setUiLoadingState('stop');
        }

        fetchResolveFunc();
      }.bind(this);

      fetchPromise.then(function () {
        afterFetchPromiseFunc();
      }, function (reason) {
        Logger.warn('Select: fetchByKeys promise was rejected: ' + reason);
        afterFetchPromiseFunc();
      });
    }

    return fetchPromise;
  } // TODO: Jeanne. Need a _ValidateReturnPromise function as well. And I need a test, because
  // right now we should have a test that fails, but ojselect tests all pass, and so do
  // ojformcontrols. so we must not have a test.
  // /**
  //  * <p>Named slot for a custom header template in the dropdown.
  //  * The slot must be a &lt;template> element.</p>
  //  * <p>When the template is executed, it will have access to the binding context
  //  * containing the following properties:</p>
  //  * <ul>
  //  *   <li>$current - an object that contains information for the header. (See the table
  //  * below for a list of properties available on $current)</li>
  //  *  <li>alias - if the data-oj-as attribute was specified on the template, the value will be used
  //  * to provide an application-named alias for $current.</li>
  //  * </ul>
  //  *
  //  * @ojslot headerTemplate
  //  * @ojshortdesc The slot for the dropdown custom header template.
  //  * @memberof oj.ojSelect2
  //  * @property {string} searchText Search text entered by the user.
  //  *
  //  * @example <caption>Initialize the Select with an inline header template specified:</caption>
  //  * &lt;oj-select-single>
  //  *   &lt;template slot='headerTemplate'>
  //  *     ...
  //  *   &lt;template>
  //  * &lt;/oj-select-single>
  //  */
  // /**
  //  * <p>Named slot for a custom footer template in the dropdown.
  //  * The slot must be a &lt;template> element.</p>
  //  * <p>When the template is executed, it will have access to the binding context
  //  * containing the following properties:</p>
  //  * <ul>
  //  *   <li>$current - an object that contains information for the footer. (See the table
  //  * below for a list of properties available on $current)</li>
  //  *  <li>alias - if the data-oj-as attribute was specified on the template, the value will be used
  //  * to provide an application-named alias for $current.</li>
  //  * </ul>
  //  *
  //  * @ojslot footerTemplate
  //  * @ojshortdesc The slot for the dropdown custom footer template.
  //  * @memberof oj.ojSelect2
  //  * @property {string} searchText Search text entered by the user.
  //  *
  //  * @example <caption>Initialize the Select with an inline footer template specified:</caption>
  //  * &lt;oj-select-single>
  //  *   &lt;template slot='footerTemplate'>
  //  *     ...
  //  *   &lt;template>
  //  * &lt;/oj-select-single>
  //  */

  /**
   * <p>The <code class="prettyprint">collectionTemplate</code> slot is used to specify the template
   * for rendering the items in the dropdown. The slot must be a &lt;template> element containing
   * a child collection element (e.g. <code class="prettyprint">&lt;oj-table></code>) supporting single selection.
   * The <code class="prettyprint">data</code>, <code class="prettyprint">selected</code>, and
   * <code class="prettyprint">selectedItem</code> properties should be set on the appropriate collection component
   * attributes, e.g. <code class="prettyprint">data</code>, <code class="prettyprint">selected</code>, and
   * <code class="prettyprint">first-selected-item</code> for <code class="prettyprint">oj-list-view</code> and
   * <code class="prettyprint">data</code>, <code class="prettyprint">selected.row</code>, and
   * <code class="prettyprint">first-selected-row</code> for <code class="prettyprint">oj-table</code>.
   * Note as well that the <code class="prettyprint">selectedItem</code> must be bound using a writeback expression
   * (i.e. <code class="prettyprint">{{$current.selectedItem}}</code>) so that it can be updated when the user
   * selects a new value.
   * The <code class="prettyprint">oj-select-results</code> class must also be applied to the collection
   * element in the template.
   * <p>When the template is executed, it will have access to the binding context
   * containing the following properties:</p>
   * <ul>
   *   <li>$current - an object that contains information for the collection. (See the table
   * below for a list of properties available on $current)</li>
   *  <li>alias - if the data-oj-as attribute was specified on the template, the value will be used
   * to provide an application-named alias for $current.</li>
   * </ul>
   * <p>If no <code class="prettyprint">collectionTemplate</code> is specified, the component will
   * check whether an <code class="prettyprint">itemTemplate</code> is specified.  Otherwise,
   * the component will render based on the value of the <code class="prettyprint">itemText</code>
   * property.</p>
   *
   * @ojslot collectionTemplate
   * @ojmaxitems 1
   * @ojshortdesc Slot for a collection element to render the items in the dropdown instead of the
   * default list.
   * @memberof oj.ojSelectSingle
   * @ojslotitemprops oj.ojSelectSingle.CollectionTemplateContext
   * @example <caption>Initialize the Select with an inline collectionTemplate specified:</caption>
   * &lt;oj-select-single>
   *   &lt;template slot='collectionTemplate'>
   *     &lt;oj-table>...&lt;/oj-table>
   *   &lt;template>
   * &lt;/oj-select-single>
   */

  /**
   * @typedef {Object}oj.ojSelectSingle.CollectionTemplateContext
   * @property {Object} data The data for the collection.
   * @property {Object} selected The selected item key.
   * @property {Object} selectedItem The selected item context.
   * @property {string} searchText Search text.
   * @ojsignature [{target: "Type", value: "oj.DataProvider<V, D>", for: "data",
   *                jsdocOverride:true},
   *               {target:"Type", value:"KeySet<V>", for: "selected", jsdocOverride:true},
   *               {target:"Type", value:"CommonTypes.ItemContext<V, D>", for: "selectedItem",
   *                jsdocOverride:true},
   *               {target: "Type", value: "<V, D>", for: "genericTypeParameters"}]
   */

  /**
   * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template
   * for rendering each item in the dropdown list when an external
   * <code class="prettyprint">collectionTemplate</code> is not provided.
   * The slot must be a &lt;template> element.
   * <p>When the template is executed for each item, it will have access to the binding context
   * containing the following properties:</p>
   * <ul>
   *   <li>$current - an object that contains information for the current item. (See the table
   * below for a list of properties available on $current)</li>
   *  <li>alias - if the data-oj-as attribute was specified on the template, the value will be used
   * to provide an application-named alias for $current.</li>
   * </ul>
   * <p>If no <code class="prettyprint">itemTemplate</code> or
   * <code class="prettyprint">collectionTemplate</code> is specified, the component will render based
   * on the value of the <code class="prettyprint">itemText</code> property.</p>
   * <p>Note that the properties <code class="prettyprint">depth, leaf,
   * parentKey</code>, are only available when the supplied dataProvider is a
   * {@link oj.TreeDataProvider}.
   *
   *
   * @ojslot itemTemplate
   * @ojmaxitems 1
   * @memberof oj.ojSelectSingle
   * @ojslotitemprops oj.ojSelectSingle.ItemTemplateContext
   *
   * @example <caption>Initialize the Select with an inline itemTemplate specified:</caption>
   * &lt;oj-select-single>
   *   &lt;template slot='itemTemplate'>
   *     &lt;div>&lt;oj-bind-text value='[[$current.data.name]]'>&lt;/oj-bind-text>&lt;/div>
   *   &lt;template>
   * &lt;/oj-select-single>
   */

  /**
   * @typedef {Object}oj.ojSelectSingle.ItemTemplateContext
   * @property {Element} componentElement The Select custom element
   * @property {Object} data The data for the current item being rendered
   * @property {number} index The zero-based index of the current item
   * @property {any} key The key of the current item being rendered
   * @property {string} searchText The search text entered by the user
   * @property {number} depth (TreeDataProvider only) The depth of the current
   * item (available when hierarchical data is provided) being rendered. The depth
   * of the first level children under the invisible root is 1.
   * @property {boolean} leaf (TreeDataProvider only) True if the current item
   * is a leaf node (available when hierarchical data is provided).
   * @property {any} parentKey (TreeDataProvider only) The key of the parent
   * item (available when hierarchical data is provided). The parent key is null
   * for root nodes.
   * @ojsignature [{target: "Type", value: "D", for: "data",
   *                jsdocOverride:true},
   *               {target:"Type", value:"V", for: "key", jsdocOverride:true},
   *               {target:"Type", value:"V", for: "parentKey", jsdocOverride:true},
   *               {target: "Type", value: "<V, D>", for: "genericTypeParameters"}]
   */
  // Fragments:

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
   *       <td>Input Field</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td> If the drop down is not open, expand the drop down list. Otherwise, close the drop down list.
   *       If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *     <tr>
   *       <td>Arrow Button</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td> If the drop down is not open, expand the drop down list. Otherwise, close the drop down list.</td>
   *     </tr>
   *     <tr>
   *       <td>Option Item</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Tap on an option item in the drop down list to select.</td>
   *     </tr>
   *   </tbody>
   *  </table>
   *
   * @ojfragment touchDocOne - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojSelectSingle
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
   *      <td>Option item</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td> Select the highlighted choice from the drop down.</td>
   *     </tr>
   *     <tr>
   *       <td>Input field</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td>Set the input text as the value.</td>
   *     </tr>
   *     <tr>
   *      <td>Drop down</td>
   *       <td><kbd>UpArrow or DownArrow</kbd></td>
   *       <td> Highlight the option item on the drop down list in the direction of the arrow.
   *         If the drop down is not open, expand the drop down list.</td>
   *     </tr>
   *     <tr>
   *      <td>Drop down</td>
   *       <td><kbd>Esc</kbd></td>
   *       <td> Collapse the drop down list. If the drop down is already closed, do nothing.</td>
   *     </tr>
   *     <tr>
   *      <td>Select</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the Select. If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *   </tbody>
   *  </table>
   *
   * @ojfragment keyboardDocOne - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojSelectSingle
   */

  /**
   * {@ojinclude "name":"ojStylingDocIntro"}
   * <p>The form control text align style classes can be applied to the component, or an ancestor element. When
   * applied to an ancestor element, all form components that support the text align style classes will be affected.
   *
   * <table class="generic-table styling-table">
   *   <thead>
   *     <tr>
   *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
   *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>oj-form-control-text-align-right</td>
   *       <td>Aligns the text to the right regardless of the reading direction.
   *           This is normally used for right aligning numbers
   *       </td>
   *     </tr>
   *     <tr>
   *       <td>oj-form-control-text-align-start</td>
   *       <td>Aligns the text to the left in ltr and to the right in rtl</td>
   *     </tr>
   *     <tr>
   *       <td>oj-form-control-text-align-end</td>
   *       <td>Aligns the text to the right in ltr and to the left in rtl</td>
   *     </tr>
   *     <tr>
   *       <td>oj-select-results</td>
   *       <td>Apply to the collection element
   *           (e.g. <code class="prettyprint">&lt;oj-list-view></code>) in the
   *           <code class="prettyprint">collectionTemplate</code></td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
   * @memberof oj.ojSelectSingle
   */
  // Superclass Doc Overrides

  /**
   * @ojslot contextMenu
   * @ignore
   * @memberof oj.ojSelectSingle
   */

});

Components.setDefaultOptions({
  // converterHint is defaulted to placeholder and notewindow in EditableValue.
  // For ojSelect2, we don't want a converterHint.
  ojSelect2: {
    // properties for all ojSelect2 components
    displayOptions: {
      converterHint: ['none']
    }
  }
});



/* global __oj_select_single_metadata:false */
(function () {
  __oj_select_single_metadata.extension._WIDGET_NAME = 'ojSelect2';
  __oj_select_single_metadata.extension._INNER_ELEM = 'input';
  __oj_select_single_metadata.extension._ALIASED_PROPS = {
    readonly: 'readOnly'
  };
  oj.CustomElementBridge.register('oj-select-single', {
    metadata: __oj_select_single_metadata
  });
})();

});