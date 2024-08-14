/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojeditablevalue', 'ojs/ojpopupcore', 'ojs/ojinputtext', 'ojs/ojlistview', 'ojs/ojhighlighttext', 'ojs/ojcore-base', 'jquery', 'ojs/ojdomutils', 'ojs/ojlogger', 'ojs/ojconfig', 'ojs/ojthemeutils', 'ojs/ojfocusutils', 'ojs/ojdataprovider', 'ojs/ojcontext', 'ojs/ojcomponentcore', 'ojs/ojkeyset', 'ojs/ojcustomelement-utils', 'ojs/ojdataproviderfactory', 'ojs/ojlistdataproviderview', 'ojs/ojtreedataproviderview', 'ojs/ojtimerutils'], function (exports, ojeditablevalue, ojpopupcore, ojinputtext, ojlistview, ojhighlighttext, oj, $, DomUtils, Logger, Config, ThemeUtils, FocusUtils, ojdataprovider, Context, ojcomponentcore, ojkeyset, ojcustomelementUtils, ojdataproviderfactory, ListDataProviderView, TreeDataProviderView, TimerUtils) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  FocusUtils = FocusUtils && Object.prototype.hasOwnProperty.call(FocusUtils, 'default') ? FocusUtils['default'] : FocusUtils;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;
  ListDataProviderView = ListDataProviderView && Object.prototype.hasOwnProperty.call(ListDataProviderView, 'default') ? ListDataProviderView['default'] : ListDataProviderView;
  TreeDataProviderView = TreeDataProviderView && Object.prototype.hasOwnProperty.call(TreeDataProviderView, 'default') ? TreeDataProviderView['default'] : TreeDataProviderView;

  /**
   * @private
   */
  const AbstractLovBase = function (options) {
    // {className, dataProvider, containerElem, fullScreenPopup,
    // idSuffix, lovMainField, filterInputText, lovDropdown, liveRegion, enabled, readOnly, value,
    // getTranslatedStringFunc, addBusyStateFunc, showMainFieldFunc, setFilterFieldTextFunc,
    // setUiLoadingStateFunc, isValueForPlaceholderFunc, isShowValueInFilterFieldFunc,
    // getFilterInputElemFunc, matchBy}
    this._minLength = 0;

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
    this._setUiLoadingStateFunc = options.setUiLoadingStateFunc;
    this._isValueForPlaceholderFunc = options.isValueForPlaceholderFunc;
    this._isShowValueInFilterFieldFunc = options.isShowValueInFilterFieldFunc;
    this._getFilterInputElemFunc = options.getFilterInputElemFunc;
    this._matchBy = options.matchBy;

    this._lastDataProviderPromise = null;

    // support ko options-binding
    // init dataProvider fetchType
    this._fetchType = this.hasData() ? 'init' : null;

    // JET-44062 - add gap between field and dropdown
    var dropdownVerticalOffset =
      ThemeUtils.getCachedCSSVarValues(['--oj-private-core-global-dropdown-offset'])[0] || '0';
    this._dropdownVerticalOffset = parseInt(dropdownVerticalOffset, 10);
  };

  AbstractLovBase.prototype.setValue = function (value) {
    this._value = value;
  };

  AbstractLovBase.prototype.setMatchBy = function (matchBy) {
    this._matchBy = matchBy;
  };

  AbstractLovBase.prototype.getFetchType = function () {
    return this._fetchType;
  };

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
      // prettier-ignore
      this._closeDelayTimer = window.setTimeout( // @HTMLUpdateOK
        function () {
          this.closeDropdown();
          resolveBusyState();
        }.bind(this),
        1
      );
    } else {
      var $containerElem = $(this._containerElem);
      var dropdownElem = this._lovDropdown.getElement();
      var $dropdownElem = $(dropdownElem);

      // JET-34367 - remove code to update popup position on refresh
      // get the space available to the popup after the popup service has run its collision logic
      var availableSpace = oj.PositionUtils.calcAvailablePopupSize(pos, props);

      // constrain the dropdown size to the available space
      var dropdownElemStyle = dropdownElem.style;
      // don't change width if pos.left is < 0 because it can result in the dropdown flickering
      if (pos.left >= 0) {
        dropdownElemStyle.maxWidth = availableSpace.width + 'px';
      }
      dropdownElemStyle.maxHeight = availableSpace.height + 'px';

      // apply same position, because the popup service should put it in the same place after
      // running collision logic (exclude using callback, because we're already in it and we don't
      // need to loop again)
      var dropdownPosition = this.getDropdownPosition(true);
      // reposition the dropdown
      $dropdownElem.position(dropdownPosition);

      if (props.vertical === 'bottom') {
        $containerElem.addClass('oj-listbox-drop-above');
        $dropdownElem.addClass('oj-listbox-drop-above');
      } else {
        $containerElem.removeClass('oj-listbox-drop-above');
        $dropdownElem.removeClass('oj-listbox-drop-above');
      }
    }
  };

  AbstractLovBase.prototype.getDropdownPosition = function (excludeUsingHandler) {
    var position;
    var isRtl = DomUtils.getReadingDirection() === 'rtl';
    if (this._fullScreenPopup) {
      var scrollX = window.scrollX || window.pageXOffset;
      var scrollY = window.scrollY || window.pageYOffset;
      position = {
        my: 'start top',
        at: 'start top',
        of: window,
        offset: { x: scrollX, y: scrollY }
      };
      position = oj.PositionUtils.normalizeHorizontalAlignment(position, isRtl);
    } else {
      // The element on which we want to position the listbox-dropdown.  We don't
      // want it to be the container because we add the inline messages to the container
      // and if we line up to the container when it has inline messages, the dropdown
      // appears after the inline messages.  We want it to always appear next to the input,
      // which is the first child of the container.
      var defPosition = {
        my: 'start top',
        at: 'start bottom',
        of: this._lovMainField.getElement(),
        collision: 'flip',
        offset: { x: 0, y: this._dropdownVerticalOffset }
      };
      if (!excludeUsingHandler) {
        defPosition.using = this._usingHandler.bind(this);
      }
      position = oj.PositionUtils.normalizeHorizontalAlignment(defPosition, isRtl);
      // need to coerce to Jet and then JqUi in order for vertical offset to work
      position = oj.PositionUtils.coerceToJet(position);
      position = oj.PositionUtils.coerceToJqUi(position);
      // set the position.of again to be the element, because coerceToJet will change it to a
      // string selector, which can then result in an error being thrown from jqueryui
      // position.js getDimensions(elem) method if the element has been removed from the DOM
      position.of = defPosition.of;
    }
    return position;
  };

  AbstractLovBase.prototype.sizeDropdown = function () {
    var dropdownElem = this._lovDropdown.getElement();

    if (this._fullScreenPopup) {
      var ww = Math.min(window.innerWidth, window.screen.availWidth);
      var hh = Math.min(window.innerHeight, window.screen.availHeight);
      // in an iframe on a phone, need to get the available height of the parent window to account
      // for browser URL bar and bottom toolbar
      // (this depends on device type, not device render mode, because the fix is not needed on
      // desktop in the cookbook phone portrait mode)
      var deviceType = Config.getDeviceType();
      // window.parent is not supposed to be null/undefined, but checking that for safety;
      // in normal cases where the window doesn't have a logical parent, window.parent is supposed
      // to be set to the window itself;
      // when there is an iframe, like in the cookbook, the window.parent will actually be different
      // from the window
      if (deviceType === 'phone' && window.parent && window !== window.parent) {
        var parentHH = Math.min(window.parent.innerHeight, window.parent.screen.availHeight);
        var availContentHeight = Math.min(hh, parentHH);
        if (hh > availContentHeight) {
          var diffHeight = hh - availContentHeight;
          dropdownElem.style.paddingBottom = diffHeight + 'px';
        }
      }
      dropdownElem.style.width = ww + 'px';
      dropdownElem.style.height = hh + 'px';
    } else {
      dropdownElem.style.minWidth = $(this._containerElem).width() + 'px';
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
      var mainInputElem = this._lovMainField.getInputElem();
      var filterFieldText = this._isShowValueInFilterFieldFunc() ? mainInputElem.value : '';
      this._setFilterFieldTextFunc(filterFieldText);
    }

    $(this._containerElem).addClass('oj-listbox-dropdown-open');
    if (!dontUpdateResults) {
      this.updateResults(true, this._fullScreenPopup);
    }

    // this._toggleAriaDescribedBy(true);
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
    }

    // clear the classes used to figure out the preference of where the dropdown should be opened
    $containerElem.removeClass('oj-listbox-drop-above');
    $(this._lovDropdown.getElement()).removeClass('oj-listbox-drop-above');

    this._lovDropdown.close();
    // this._toggleAriaDescribedBy(false);

    // select: accessibility
    this._ariaExpanded = false;
    this._lovMainField.getInputElem().setAttribute('aria-expanded', 'false');

    // We only add aria-expanded to the filter input elem if we're not rendering the full screen
    // popup on mobile.  On desktop, the filter input is part of the main text field with
    // role='combobox', so it does need aria-expanded to indicate whether the popup is open.
    // On mobile, the filter input is part of the full screen popup itself, so it does not have
    // role='combobox' and it does not control whether the popup is open.
    var filterInputElem = this._getFilterInputElemFunc();
    if (filterInputElem && !this._fullScreenPopup) {
      filterInputElem.setAttribute('aria-expanded', 'false');
    }

    //  - press escape after search in select causes select to become unresponsive
    this._lastSearchTerm = null;

    // if (!this._fullScreenPopup &&
    //     !DomUtils.isAncestor(this._containerElem, document.activeElement)) {
    //   this._showMainFieldFunc();
    // }
  };

  AbstractLovBase.prototype.updateResults = function (initial, focusFirstElem) {
    var term;

    // During the initial fetch (happens when the dropdown is opened), we need to use the display
    // text to filter the dropdown results
    if (initial === true) {
      // TODO: Get back to this once the design is confirmed for the component's
      //       behavior for rendering the results on opening the dropdown when a value
      //       is selected.
      // term = this._lovMainField.getInputText();
      term = '';
    } else {
      term = this._filterInputText.rawValue || '';
    }

    var lastTerm = this._lastSearchTerm;

    // prevent duplicate queries against the same term
    // not applying to multi select since user can search the same term after making selection
    // it's ok for single select since the last term will be updated after selection
    if (initial !== true && lastTerm && term === lastTerm) {
      return;
    }

    // In IE even for change of placeholder fires 'input' event,
    // so in such cases we don't need to query for results.
    // if (!lastTerm && !term && initial && initial.type === 'input') {
    //   return;
    // }

    // JET-38189 - IXD - Default Progressive Loading from 1 loading bar to 3 for default
    // apply min-height while the skeleton is showing, before the data is fetched
    var dropdownElem = this._lovDropdown.getElement();
    var dropdownClassList = dropdownElem.classList;
    if (initial === true) {
      dropdownClassList.add('oj-listbox-initial-open');
    } else {
      dropdownClassList.remove('oj-listbox-initial-open');
    }

    this._lastSearchTerm = term;

    if (term.length >= this._minLength) {
      if (!initial || initial === true) {
        this._runQuery(term, focusFirstElem, initial === true);
      } else {
        this._runQuery(term, focusFirstElem);
      }
    } else {
      this.closeDropdown();
    }
  };

  AbstractLovBase.prototype._runQuery = function (term, focusFirstElem, initial) {
    var lovDropdown = this._lovDropdown;

    if (this._minLength > term.length) {
      this.closeDropdown();
      return;
    }

    this.openDropdown(true);

    // lovDropdown.clearHighlight();

    if (this.hasData()) {
      if (!this._ariaExpanded) {
        lovDropdown.open();
        // select: accessibility
        this._ariaExpanded = true;
        this._lovMainField.getInputElem().setAttribute('aria-expanded', 'true');

        // We only add aria-expanded to the filter input elem if we're not rendering the full screen
        // popup on mobile.  On desktop, the filter input is part of the main text field with
        // role='combobox', so it does need aria-expanded to indicate whether the popup is open.
        // On mobile, the filter input is part of the full screen popup itself, so it does not have
        // role='combobox' and it does not control whether the popup is open.
        var filterInputElem = this._getFilterInputElemFunc();
        if (filterInputElem && !this._fullScreenPopup) {
          filterInputElem.setAttribute('aria-expanded', 'true');
        }
      }

      // if not on mobile, transfer focus into the dropdown now;  otherwise wait until after the
      // dropdown busy state resolves in _handleQueryResultsFetch below
      if (focusFirstElem && !this._fullScreenPopup) {
        FocusUtils.focusFirstTabStop(lovDropdown.getElement());
      }

      // lovDropdown.setSearchText(term);
      var fetchPromise = this._fetchFromDataProvider(term, initial);
      fetchPromise.then(
        function () {
          // ignore old responses
          if (fetchPromise === this._lastDataProviderPromise) {
            this._handleQueryResultsFetch(focusFirstElem);
          }
        }.bind(this),
        function (reason) {
          // ignore old responses
          if (fetchPromise === this._lastDataProviderPromise) {
            Logger.warn('Select: _fetchFromDataProvider promise was rejected: ' + reason);
            this._handleQueryResultsFetch(focusFirstElem);
          }
        }.bind(this)
      );
    }
  };

  AbstractLovBase.prototype._handleQueryResultsFetch = function (focusFirstElem) {
    // ignore a response if the oj-combobox has been closed before it was received
    if (!this.isDropdownOpen()) {
      return;
    }

    // JET-38189 - IXD - Default Progressive Loading from 1 loading bar to 3 for default
    // only need to apply min-height while the skeleton is showing, not after data has been fetched
    var dropdownElem = this._lovDropdown.getElement();
    var dropdownClassList = dropdownElem.classList;
    dropdownClassList.remove('oj-listbox-initial-open');

    // var results = this._lovDropdown.findHighlightableOptionElems();
    // var resultsCount = results ? results.length : 0;
    var fetchedDataCount = this._lovDropdown.getResultsCount();
    var resultsCount = fetchedDataCount ? fetchedDataCount.count : 0;
    var resultsCountDone = fetchedDataCount ? fetchedDataCount.done : true;
    var translation;
    if (resultsCount === 0) {
      translation = this._getTranslatedStringFunc('noMatchesFound');
    } else {
      this.sizeDropdown();
      // lovDropdown.postRenderResults();

      // TODO: need a way to get number of results from listView, and to know when to update it when
      // listView loads more on scroll (could count results in FilteringDataProviderView iterator
      // every time next is called?)
      // translation = (resultsCount === 1) ? this._getTranslatedStringFunc('oneMatchFound') :
      //   this._getTranslatedStringFunc('multipleMatchesFound', { num: ('' + resultsCount) });
      translation = resultsCountDone
        ? this._getTranslatedStringFunc('multipleMatchesFound', { num: String(resultsCount) })
        : this._getTranslatedStringFunc('nOrMoreMatchesFound', { num: String(resultsCount) });
    }
    this.updateLiveRegion(translation);

    // JET-39385 - SELECT SINGLE HAS NO OPTION TO SET TITLE IN MOBILE SEARCH
    // wait until the dropdown busy state resolves to transfer focus, otherwise the placeholder in
    // the mobile search field may not get rendered when the inside label animates
    if (focusFirstElem && this._fullScreenPopup) {
      FocusUtils.focusFirstTabStop(this._lovDropdown.getElement());
    }
  };

  AbstractLovBase.prototype.updateLiveRegion = function (translatedString) {
    $(this._liveRegion).text(translatedString);
  };

  AbstractLovBase.prototype.cancel = function () {
    this.closeDropdown();
    // this._lovMainField.focusCursorEndInputElem();
  };

  // eslint-disable-next-line no-unused-vars
  AbstractLovBase.prototype.handleDataProviderEvent = function (event) {
    // clear the saved last search term
    this._lastSearchTerm = null;
  };

  // add busy state
  // display an animated gif if it is fetch initially
  // fetch from the data provider
  // display message for furthur filtering if not all results are fetched
  // if multiple queries are in progress, discard all but the last query
  // returns a promise that resolves when the listview has finished rendering
  AbstractLovBase.prototype._fetchFromDataProvider = function (term, initial) {
    var bLoadingIndicatorAdded = false;

    // add busy context
    var fetchResolveFunc = this._addBusyStateFunc('fetching data');

    // display spinning icon only for the initial fetch
    if (this._fetchType === 'init') {
      if (!this.isDropdownOpen()) {
        bLoadingIndicatorAdded = true;
        this._setUiLoadingStateFunc('start');
      }
      this._fetchType = null;
    }

    var filterCriteria = null;
    if (term) {
      var matchBy;
      if (this._dataProvider) {
        var filterCapability = this._dataProvider.getCapability('filter');
        if (!filterCapability || !filterCapability.textFilter) {
          Logger.error(
            'Select: DataProvider does not support text filter.  ' +
              'Filtering results in dropdown may not work correctly.'
          );
        } else if (this._matchBy) {
          // JET-60725 - Add option to specify the matchBy behavior of the text filter
          // Find the first matchBy behavior in the array that the data provider supports.
          matchBy = this._matchBy.reduce((result, curr) => {
            // if we've already found a supported matchBy, use it
            if (result) {
              return result;
            }
            // if we've encountered 'unknown' in the array, return it because it's always supported
            if (curr === 'unknown') {
              return curr;
            }
            // if we haven't found a supported matchBy yet, see if the current one is supported and
            // return it if so; if not log a warning
            if (curr) {
              if (
                filterCapability.textFilterMatching &&
                filterCapability.textFilterMatching.matchBy &&
                filterCapability.textFilterMatching.matchBy.indexOf(curr) > -1
              ) {
                return curr;
              }
              Logger.warn(
                `Select: DataProvider does not support text filter "${curr}" matching.  ` +
                  'Filtering results in dropdown may not work as expected.'
              );
            }
            // if we haven't found a supported matchBy yet, return undefined and go on
            return undefined;
          }, null);
        }
      }

      // create filter using FilterFactory so that default local filtering will happen if
      // underlying DP doesn't support its own filtering
      var filterDef = matchBy ? { text: term, matchBy } : { text: term };
      filterCriteria = oj.FilterFactory.getFilter({ filterDef });
    }

    var retPromise = new Promise(
      function (resolve, reject) {
        // fetch data from dataProvider
        var renderPromise = this._lovDropdown.renderResults(
          term,
          filterCriteria,
          this._isValueForPlaceholderFunc(this._value) ? null : this._value,
          initial
        );

        var afterRenderPromiseFunc = function () {
          if (bLoadingIndicatorAdded) {
            this._setUiLoadingStateFunc('stop');
          }

          // clear busy context
          fetchResolveFunc();

          // ignore old responses
          if (retPromise === this._lastDataProviderPromise) {
            resolve();
          } else {
            reject('AbstractLovBase._fetchFromDataProvider: rejecting earlier promise');
          }
        }.bind(this);
        renderPromise.then(
          function () {
            afterRenderPromiseFunc();
          },
          function (reason) {
            // ignore old responses
            if (retPromise === this._lastDataProviderPromise) {
              Logger.warn('Select: renderResults promise was rejected: ' + reason);
            }
            afterRenderPromiseFunc();
          }
        );
      }.bind(this)
    );
    // save the most recent promise so we can ignore old data provider responses
    this._lastDataProviderPromise = retPromise;
    return retPromise;
  };

  /**
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  const FilteringDataProviderView = function (dataProvider) {
    this._fetchedDataCount = {
      count: 0,
      done: true
    };

    // FilteringDataProviderView
    this.setFilterCriterion = function (filterCriterion) {
      var oldFilterCriterion = this._filterCriterion;
      this._filterCriterion = filterCriterion;

      // only dispatch refresh event if the filterCriterion is different from the previous one
      if (!_compareFilterCriterion(oldFilterCriterion, this._filterCriterion)) {
        var event = new ojdataprovider.DataProviderRefreshEvent();
        // use defineProperty to create the filterCriterionChanged prop so that it's not enumerable
        Object.defineProperty(event, 'filterCriterionChanged', { value: true });
        this.dispatchEvent(event);
      }
    };

    // FilteringDataProviderView
    this.getFetchedDataCount = function () {
      return this._fetchedDataCount;
    };

    // FilteringDataProviderView
    this.setFetchedDataCount = function (fetchedDataCount) {
      this._fetchedDataCount = fetchedDataCount;
    };

    // FilteringDataProviderView
    function _compareFilterCriterion(fc1, fc2) {
      return fc1 === fc2 || (!fc1 && !fc2) || (fc1 && fc2 && fc1.text === fc2.text);
    }

    // FilteringDataProviderView
    function WrappingAsyncIterable(iterator, fetchedDataCount) {
      var _asyncIterator = new WrappingAsyncIterator(iterator, fetchedDataCount);
      this[Symbol.asyncIterator] = function () {
        return _asyncIterator;
      };
    }

    // FilteringDataProviderView
    function WrappingAsyncIterator(iterator, fetchedDataCount) {
      this.next = function () {
        var promise = iterator.next();
        return new Promise(function (resolve, reject) {
          promise.then(
            function (nextResults) {
              var nextValue = nextResults.value;
              if (nextValue.data) {
                // eslint-disable-next-line no-param-reassign
                fetchedDataCount.count += nextValue.data.length;
              }
              // eslint-disable-next-line no-param-reassign
              fetchedDataCount.done = nextResults.done;
              resolve(nextResults);
            },
            function (reason) {
              reject(reason);
            }
          );
        });
      };
    }

    // FilteringDataProviderView
    this.fetchFirst = function (params) {
      if (dataProvider) {
        // always pass filter criterion to underlying data provider because component will make sure
        // it is a ListDataProviderView and call the FilterFactory to do local filtering if needed
        if (this._filterCriterion) {
          // eslint-disable-next-line no-param-reassign
          params.filterCriterion = this._filterCriterion;
        }

        // return dataProvider.fetchFirst(params);

        // Reset the data counter
        this._fetchedDataCount.count = 0;
        this._fetchedDataCount.done = true;
        if (this._fetchedDataCount.childrenCountMap) {
          this._fetchedDataCount.childrenCountMap.clear();
        }

        var asyncIterable = dataProvider.fetchFirst(params);
        var asyncIterator = asyncIterable[Symbol.asyncIterator]();
        return new WrappingAsyncIterable(asyncIterator, this._fetchedDataCount);
      }
      var retObj = {};
      retObj[Symbol.asyncIterator] = function () {
        return {
          next: function () {
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
    };

    // FilteringDataProviderView
    this.containsKeys = function (params) {
      if (dataProvider) {
        return dataProvider.containsKeys(params);
      }
      return Promise.resolve({
        containsParameters: params,
        results: new Set()
      });
    };

    // FilteringDataProviderView
    this.fetchByKeys = function (params) {
      if (dataProvider) {
        return dataProvider.fetchByKeys(params);
      }
      return Promise.resolve({
        fetchParameters: params,
        results: new Map()
      });
    };

    // FilteringDataProviderView
    this.fetchByOffset = function (params) {
      if (dataProvider) {
        // always pass filter criterion to underlying data provider because component will make sure
        // it is a ListDataProviderView and call the FilterFactory to do local filtering if needed
        if (this._filterCriterion) {
          // eslint-disable-next-line no-param-reassign
          params.filterCriterion = this._filterCriterion;
        }
        return dataProvider.fetchByOffset(params);
      }
      return Promise.resolve({
        done: true,
        fetchParameters: params,
        results: []
      });
    };

    // FilteringDataProviderView
    this.isEmpty = function () {
      if (dataProvider) {
        return dataProvider.isEmpty();
      }
      return 'yes';
    };

    // FilteringDataProviderView
    this.getTotalSize = function () {
      if (dataProvider) {
        return dataProvider.getTotalSize();
      }
      return Promise.resolve(0);
    };

    // FilteringDataProviderView
    this.addEventListener = function (eventType, listener) {
      if (dataProvider) {
        dataProvider.addEventListener(eventType, listener);
      }
    };

    // FilteringDataProviderView
    this.removeEventListener = function (eventType, listener) {
      if (dataProvider) {
        dataProvider.removeEventListener(eventType, listener);
      }
    };

    // FilteringDataProviderView
    this.dispatchEvent = function (evt) {
      if (dataProvider) {
        return dataProvider.dispatchEvent(evt);
      }
      return true;
    };

    // FilteringDataProviderView
    this.getCapability = function (capabilityName) {
      if (dataProvider) {
        return dataProvider.getCapability(capabilityName);
      }
      return null;
    };

    // If dataProvider is hierarchical, create getChildDataProvider for
    // ourselves to delegate to that provider's own call
    if (dataProvider && oj.DataProviderFeatureChecker.isTreeDataProvider(dataProvider)) {
      // Create a property in fetchedDataCount object that will store the count for
      // child nodes. We need this here in parent because, we will be creating a new
      // DP instance for child nodes whenever getChildDataProvider is called. So we
      // will be storing the count in parent node and restore it in child node after
      // creating a new instance.
      this._fetchedDataCount.childrenCountMap = new Map();

      // FilteringDataProviderView
      this.getChildDataProvider = function (parentKey) {
        let childDp = dataProvider.getChildDataProvider.apply(dataProvider, arguments);
        if (childDp) {
          childDp = new FilteringDataProviderView(childDp);
          // Pass our filter criterion onto the child right away
          if (this._filterCriterion) {
            childDp.setFilterCriterion(this._filterCriterion);
          }

          // Pass the stored data counter
          let childFetchedDataCount = this._fetchedDataCount.childrenCountMap.get(parentKey);

          if (!childFetchedDataCount) {
            // If we do not have a store counter yet, use the child's newly created
            // counter and store its ref in the parent to pass on later.
            childFetchedDataCount = childDp.getFetchedDataCount();
            this._fetchedDataCount.childrenCountMap.set(parentKey, childFetchedDataCount);
          } else {
            childDp.setFetchedDataCount(childFetchedDataCount);
          }
        }
        return childDp;
      }.bind(this);
    }
  };

  /**
   * @private
   */
  const LovUtils = {
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
    _isControlKey: function (event) {
      // JET-44374 - qunit combobox ojselect tests fail with new jquery 3.6.0
      // e.which no longer gets populated when simulating events with keyCode specified, so
      // check both properties on the event
      var keyCode = event.which || event.keyCode;
      switch (keyCode) {
        case LovUtils.KEYS.SHIFT:
        case LovUtils.KEYS.CTRL:
        case LovUtils.KEYS.ALT:
          return true;
        default:
          return event.metaKey || event.ctrlKey;
      }
    },

    // LovUtils
    _isFunctionKey: function (event) {
      // JET-44374 - qunit combobox ojselect tests fail with new jquery 3.6.0
      // e.which no longer gets populated when simulating events with keyCode specified, so
      // check both properties on the event
      var keyCode = event.which || event.keyCode;
      var key = keyCode || event;
      return key >= 112 && key <= 123;
    },

    // LovUtils
    isControlOrFunctionKey: function (event) {
      return LovUtils._isControlKey(event) || LovUtils._isFunctionKey(event);
    },

    // LovUtils
    nextUid: (function () {
      var counter = 1;
      return function () {
        var ret = counter;
        counter += 1;
        return ret;
      };
    })(),

    // LovUtils
    killEvent: function (event) {
      event.preventDefault();
    },

    // LovUtils
    killEventWithAncestorExceptions: function (selectors, event) {
      // Do nothing, if the target has one of the ancestor selectors
      const target = $(event.target);
      if (selectors.some((selector) => target.closest(selector) !== 0)) {
        return;
      }
      // Only prevent default if the event target is not a descendent
      // of the element with the provided selector
      event.preventDefault();
    },

    // LovUtils
    stopEventPropagation: function (event) {
      event.stopPropagation();
    },

    // LovUtils
    addBusyState: function (elem, description) {
      var desc = "The component identified by '" + elem.id + "' " + description;
      var busyStateOptions = { description: desc };
      var busyContext = Context.getContext(elem).getBusyContext();
      return busyContext.addBusyState(busyStateOptions);
    },

    // LovUtils
    createValueItem: function (value, data, metadata) {
      return { key: value, data: data, metadata: metadata };
    },

    // LovUtils
    dispatchCustomEvent: function (elem, type, subtype, _detail) {
      var detail = _detail || {};
      detail.subtype = subtype;
      var params = { bubbles: false, cancelable: false, detail: detail };
      return elem.dispatchEvent(new CustomEvent(type, params));
    },

    // LovUtils
    copyAttribute: function (sourceElem, sourceAttr, targetElem, targetAttr) {
      var value = sourceElem.getAttribute(sourceAttr);
      if (value === null) {
        LovUtils.removeAttribute(targetElem, targetAttr);
      } else {
        targetElem.setAttribute(targetAttr, value); // @HTMLUpdateOK
      }
    },

    // LovUtils
    removeAttribute: function (elem, attr) {
      // JET-45699 - Select2 qunit tests fail using safari for master and v11 branches
      // it's a CSP violation in Safari 14.1 to remove the style attribute, so remove all of its
      // properties instead
      if (attr === 'style') {
        LovUtils._removeStyles(elem);
      } else {
        elem.removeAttribute(attr);
      }
    },

    // LovUtils
    _removeStyles: function (elem) {
      var style = elem.style;
      var numProps = style.length;
      var prop;
      for (var i = numProps - 1; i >= 0; i--) {
        prop = style.item(i);
        style.removeProperty(prop);
      }
    },

    // LovUtils
    isDataProvider: function (data) {
      return data && ojcomponentcore.DataProviderFeatureChecker
        ? ojcomponentcore.DataProviderFeatureChecker.isDataProvider(data)
        : false;
    },

    // LovUtils
    isTreeDataProvider: function (data) {
      return data && ojcomponentcore.DataProviderFeatureChecker
        ? ojcomponentcore.DataProviderFeatureChecker.isTreeDataProvider(data)
        : false;
    }
  };

  /**
   * @private
   */
  const LovDropdown = function () {};

  LovDropdown.prototype.init = function (options) {
    // {dataProvider, className, parentId, idSuffix, dropdownElemId, fullScreenPopup, inputType,
    //  bodyElem, itemTemplate, collectionTemplate,
    //  getTemplateEngineFunc, templateContextComponentElement,
    //  addBusyStateFunc, itemTextRendererFunc, filterInputText, afterDropdownInitFunc,
    //  getThrottlePromiseFunc, isValueItemForPlaceholderFunc, styleClassComponentName}
    this._dataProvider = options.dataProvider;
    this._fullScreenPopup = options.fullScreenPopup;
    this._bodyElem = $(options.bodyElem);
    this._itemTemplate = options.itemTemplate;
    this._collectionTemplate = options.collectionTemplate;
    this._getTemplateEngineFunc = options.getTemplateEngineFunc;
    this._templateContextComponentElement = options.templateContextComponentElement;
    this._addBusyStateFunc = options.addBusyStateFunc;
    this._itemTextRendererFunc = options.itemTextRendererFunc;
    this._filterInputText = options.filterInputText;
    this._getThrottlePromiseFunc = options.getThrottlePromiseFunc;
    this._isValueForPlaceholderFunc = options.isValueForPlaceholderFunc;
    this._isValueItemForPlaceholderFunc = options.isValueItemForPlaceholderFunc;

    this._currentFirstItem = null;
    this._firstResultForKeyboardFocus = null;
    this._templateEngine = null;
    this._resultsCount = null;
    this._NO_RESULTS_FOUND_CLASSNAME = 'oj-listbox-searchselect-no-results';

    var resolveBusyState = this._addBusyStateFunc('LovDropdown initializing');

    this._addDataProviderEventListeners();

    var containerElem = this._createInnerDom(options);
    this._containerElem = containerElem;

    // JET-34367 - remove code to update popup position on refresh
    // Position a proxy element instead of the real dropdown so that we don't have to
    // change the size of the dropdown before calculating the position, because changing
    // the size of the dropdown before positioning may reset the results' scroll position and
    // prevent the user from scrolling down.
    this._dropdownPositioningProxyContainer = this._createDropdownPositioningProxyElem(options);

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
      data: this._dataProvider,
      searchText: undefined,
      selected: undefined,
      selectedItem: undefined,
      selectedItemChangedListener: this._HandleCollectionSelectedItemChanged.bind(this),
      currentRow: {
        rowIndex: undefined,
        rowKey: undefined
      },
      currentRowChangedListener: this._handleCollectionCurrentRowChanged.bind(this),
      currentRowKeyChangedListener: this._handleCollectionCurrentRowKeyChanged.bind(this),
      handleRowAction: this._handleRowAction.bind(this)
    };
    this._collectionRendererFunc = this._collectionTemplate
      ? this._templateCollectionRenderer.bind(this)
      : this._defaultCollectionRenderer.bind(this);
    this._collectionRendererFunc(this._collectionContext);

    containerElem.on('change', '.' + options.className + '-input', LovUtils.stopEventPropagation);

    // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is
    // listening for mouse events outside of itself so it can close itself. since the dropdown
    // is now outside the combobox's dom it will trigger the popup close, which is not what we
    // want
    containerElem.on(
      'click mouseup mousedown',
      function (event) {
        LovUtils.stopEventPropagation(event);
        if (event.type === 'mousedown') {
          // JET-50692 - focus lost from component when mouse down on dropdown between items
          // In the mobile dropdown, call event.preventDefault() (to prevent focus from transferring
          // to the body element temporarily) if the target of the mousedown event is one of:
          // 1) the dropdown container itself (for example if the user taps in the empty space
          // below the last item in a short list)
          // 2) a descendant element of the filter field except for the input itself
          if (
            this._fullScreenPopup &&
            (event.target === containerElem[0] ||
              (DomUtils.isAncestorOrSelf(this._filterInputText, event.target) &&
                event.target.tagName.toLowerCase() !== 'input'))
          ) {
            event.preventDefault();
          }
        }
      }.bind(this)
    );

    var afterRenderFunc = function () {
      if (options.afterDropdownInitFunc) {
        options.afterDropdownInitFunc(this._resultsElem[0]);
      }
      resolveBusyState();
    }.bind(this);
    renderPromise.then(afterRenderFunc, afterRenderFunc);

    containerElem.on('keydown', this._handleKeyDown.bind(this));

    // JET-61331 - Select one choice LOV dropdown flowing out of the browser and adjusting when the
    // page is scrolled up or down
    // add a resize listener to the desktop dropdown so that we can reposition it after the content
    // renders
    if (!this._fullScreenPopup) {
      this._addResizeListener(containerElem[0]);
    }

    // if updateLabel was called before now, execute the deferred call
    if (this._updateLabelFunc) {
      var updateLabelFunc = this._updateLabelFunc;
      this._updateLabelFunc = null;
      updateLabelFunc();
    }
  };

  LovDropdown.prototype._dispatchEvent = function (subtype, detail) {
    return LovUtils.dispatchCustomEvent(this._containerElem[0], 'lovDropdownEvent', subtype, detail);
  };

  LovDropdown.prototype.destroy = function () {
    // TODO: release resources in here, like cleaning elements create by template engine as part of
    // fixing  - CALL TEMPLATEENGINE.CLEAN() FOR HEADER/FOOTER TEMPLATES

    // only clean nodes if we actually have templates and have loaded the template engine to
    // execute them
    if (
      (this._itemTemplate || this._collectionTemplate) &&
      this._containerElem &&
      this._templateEngine
    ) {
      this._templateEngine.clean(this._containerElem[0], this._templateContextComponentElement);
    }

    this._removeDataProviderEventListeners();

    // JET-61331 - Select one choice LOV dropdown flowing out of the browser and adjusting when the
    // page is scrolled up or down
    // remove the resize listener from the desktop dropdown
    this._removeResizeListener(this._containerElem[0]);
  };

  LovDropdown.prototype.getElement = function () {
    // check whether the dropdown has been initialized
    if (this._containerElem) {
      return this._containerElem[0];
    }
    return null;
  };

  LovDropdown.prototype._createInnerDom = function (options) {
    var outerDiv = document.createElement('div');
    outerDiv.setAttribute('data-oj-containerid', options.parentId);
    outerDiv.setAttribute('data-oj-context', '');
    outerDiv.setAttribute('id', options.dropdownElemId);
    outerDiv.setAttribute(
      'class',
      'oj-listbox-drop oj-listbox-searchselect' +
        (' oj-listbox-' + options.styleClassComponentName) +
        (this._fullScreenPopup ? ' oj-listbox-fullscreen' : '')
    );
    outerDiv.style.display = 'none';
    outerDiv.setAttribute('role', 'presentation');

    if (this._fullScreenPopup) {
      outerDiv.appendChild(this._filterInputText);
    }

    var resultsPlaceholder = document.createElement('div');
    resultsPlaceholder.setAttribute('class', 'oj-searchselect-results-placeholder');
    outerDiv.appendChild(resultsPlaceholder); // @HTMLUpdateOK

    return $(outerDiv);
  };

  LovDropdown.prototype._createDropdownPositioningProxyElem = function (options) {
    var idSuffix = options.idSuffix;

    // JET-34367 - remove code to update popup position on refresh
    // Position a proxy element instead of the real dropdown so that we don't have to
    // change the size of the dropdown before calculating the position, because changing
    // the size of the dropdown before positioning may reset the results' scroll position and
    // prevent the user from scrolling down.
    // JET-42675 - combobox drop down not aligned correctly for wide browser windows in jet 10
    // Wrap everything in a non-overflowing absolute container. This will prevent
    // any unwanted overflow while calculating the position.
    var containerDiv = document.createElement('div');
    containerDiv.style.visibility = 'hidden';
    containerDiv.style.position = 'absolute';
    containerDiv.style.overflow = 'hidden';

    var outerDiv = document.createElement('div');
    outerDiv.setAttribute('data-oj-containerid', options.parentId);
    outerDiv.setAttribute('data-oj-context', '');
    outerDiv.setAttribute('id', 'lovDropdownPositioningProxy_' + idSuffix);
    outerDiv.setAttribute('class', 'oj-listbox-drop oj-listbox-searchselect');
    containerDiv.appendChild(outerDiv); // @HTMLUpdateOK

    var resultsProxyElem = document.createElement('div');
    resultsProxyElem.setAttribute('class', 'oj-select-results');
    outerDiv.appendChild(resultsProxyElem); // @HTMLUpdateOK

    return $(containerDiv);
  };

  LovDropdown.prototype._defaultItemRenderer = function (listViewItemContext) {
    // TODO: Can/should we expect to write directly to the <li> when using an item template or
    // collection template?
    var li = listViewItemContext.parentElement;
    // li.setAttribute('role', 'option');

    // var label = document.createElement('span');
    // label.setAttribute('id', 'oj-listbox-result-label-' + LovUtils.nextUid());

    // create label content
    var formatted = this._itemTextRendererFunc({
      key: listViewItemContext.key,
      data: listViewItemContext.data,
      metadata: listViewItemContext.metadata
    });
    // only highlight matches for leaf nodes when data is hierarchical
    // the leaf property will be absent for flat data
    var isParent = listViewItemContext.leaf === false;
    // JET-43702 - Special characters in oj-select-single dropdown are not escaped
    // set text content of node or use oj-highlight-text so that displayed text is correctly escaped
    var childNode;
    if (isParent) {
      // add text content directly
      childNode = document.createElement('span');
      $(childNode).text(formatted);
    } else {
      // create oj-highlight-text
      childNode = document.createElement('oj-highlight-text');
      childNode.setAttribute('text', formatted);
      childNode.setAttribute('match-text', this._collectionContext.searchText);
    }
    li.appendChild(childNode);

    // li.appendChild(label);
    // return li;
  };

  LovDropdown.prototype._templateItemRenderer = function (templateEngine, listViewItemContext) {
    var renderContext = $.extend({}, listViewItemContext);
    renderContext.componentElement = this._templateContextComponentElement;
    renderContext.searchText = this._collectionContext.searchText;

    // TODO: Can/should we expect to write directly to the <li> when using an item template or
    // collection template?
    var li = renderContext.parentElement;
    // li.setAttribute('role', 'option');

    // var label = document.createElement('span');
    // label.setAttribute('id', 'oj-listbox-result-label-' + LovUtils.nextUid());

    // create label content
    if (templateEngine) {
      var nodes = templateEngine.execute(
        renderContext.componentElement,
        this._itemTemplate,
        renderContext
      );
      for (var i = 0; i < nodes.length; i++) {
        // label.appendChild(nodes[i]);
        li.appendChild(nodes[i]);
      }
    }

    // li.appendChild(label);
    // return li;
  };

  LovDropdown.prototype.renderResults = function (
    searchText,
    filterCriteria,
    selectedValue,
    initial
  ) {
    var resolveBusyState = this._addBusyStateFunc('LovDropdown rendering results');

    // save most recent filterCriteria so we know whether we need to apply highlighting
    this._latestFilterCriteria = filterCriteria;

    // JET-37502 - REPEATED FETCHES / CONTAINSKEY CALLS COME IN FROM JET WHEN SEARCHING FOR TEXT WHEN
    // SELECT-SINGLE DROPDOWN IS OPEN
    // Initially clear both selected and currentRow so that the collection doesn't try to validate
    // and scroll to a row that isn't in the filtered data set.  We'll set both in _configureResults,
    // after the collection has rendered the filtered data.
    // Clear these before calling setFilterCriterion on data provider below, so that collection is
    // updated before the data provider refresh event is fired.
    this._ClearSelection();

    // ignore selection changed events during listView initialization
    this._duringListViewInitialization = true;

    var renderPromiseResolve;
    var renderPromiseReject;
    var renderPromise = new Promise(function (resolve, reject) {
      renderPromiseResolve = resolve;
      renderPromiseReject = reject;
    });

    var retPromise = new Promise(
      function (resolve, reject) {
        renderPromise.then(
          function () {
            // wait until the changes propagate to the collection and the collection handles the DP
            // refresh event due to filter criteria changing before resolving the promise
            var busyContext = Context.getContext(this._containerElem[0]).getBusyContext();
            // Once the collection is ready, call the configureResults
            // to set the selected and currentRow accordingly.
            busyContext.whenReady().then(
              function () {
                // JET-39227 - DYNAMIC FORM: USER NEEDS TO CLICK TWICE TO GET VALUE SELECTED FROM SINGLE
                // SELECT WHEN IT HAS ONLY ONE RECORD IN IT
                // don't call _configureResults unless this is the most recent render promise, because
                // otherwise the current item may not be present in the rendered list
                // ignore old responses
                if (retPromise === this._lastRenderResultsPromise) {
                  this._configureResults(searchText, selectedValue, initial).then(resolve, reject);
                } else {
                  resolve();
                }
              }.bind(this),
              reject
            );
          }.bind(this),
          reject
        );
      }.bind(this)
    );
    // save the most recent promise so we can ignore old responses
    this._lastRenderResultsPromise = retPromise;

    var collectionContext = this._collectionContext;
    collectionContext.data = this._dataProvider;
    collectionContext.searchText = searchText;

    // JET-37502 - REPEATED FETCHES / CONTAINSKEY CALLS COME IN FROM JET WHEN SEARCHING FOR TEXT WHEN
    // SELECT-SINGLE DROPDOWN IS OPEN
    // before rendering, let the _ClearSelection() call above process, which may
    // happen asynchronously when a collectionTemplate is specified because it relies on
    // ko observables under the covers
    this._getThrottlePromiseFunc().then(
      function () {
        // JET-34871 - FILTERING DANGLING BUSY STATE
        // if there is an existing, unresolved renderPromise, reject it now so that we don't end up with
        // orphaned busy states
        if (collectionContext.renderError) {
          var contextRenderError = collectionContext.renderError;
          this._clearContextRenderPromiseFunctions(collectionContext);
          contextRenderError('LovDropdown.renderResults: rejecting earlier promise');
        }
        collectionContext.renderDone = renderPromiseResolve;
        collectionContext.renderError = renderPromiseReject;

        this._dataProvider.setFilterCriterion(filterCriteria);

        this._collectionRendererFunc(collectionContext);
      }.bind(this)
    );

    var afterRetPromiseFunc = function () {
      // ignore old responses
      if (retPromise === this._lastRenderResultsPromise) {
        this._duringListViewInitialization = false;
      }
      resolveBusyState();
    }.bind(this);

    return retPromise.then(
      function () {
        afterRetPromiseFunc();
      },
      function (reason) {
        // ignore old responses
        if (retPromise === this._lastRenderResultsPromise) {
          Logger.warn('Select: LovDropdown.renderResults retPromise rejected: ' + reason);
        }
        afterRetPromiseFunc();
      }.bind(this)
    );
  };

  LovDropdown.prototype.updateLabel = function (ariaLabelId, ariaLabel) {
    var resultsElem = this._resultsElem;
    if (!resultsElem) {
      // if the dropdown hasn't been initialized yet, defer the updateLabel call until then
      this._updateLabelFunc = this.updateLabel.bind(this, ariaLabelId, ariaLabel);
    } else if (!this._collectionTemplate) {
      var listView = resultsElem[0];
      //  - oghag missing label for ojselect and ojcombobox
      if (ariaLabelId) {
        listView.setAttribute('aria-labelledby', ariaLabelId);
        // The attribute value only can be removed by setting it to an empty string
        listView.setAttribute('aria-label', '');
      } else if (ariaLabel) {
        listView.setAttribute('aria-label', ariaLabel);
        // The attribute value only can be removed by setting it to an empty string
        listView.setAttribute('aria-labelledby', '');
      }
    }
  };

  LovDropdown.prototype.updateItemTextRendererFunc = function (itemTextRendererFunc) {
    // JET-45922 - timing issue with select-single: lov drop-down doesn't have element
    // do a granular update if item-text changes instead of a general refresh
    this._itemTextRendererFunc = itemTextRendererFunc;
    if (!this._collectionTemplate && !this._itemTemplate && this._resultsElem) {
      var listView = this._resultsElem[0];
      // add busy state around the set so our unit tests know when the resulting render is done
      var resolveBusyState = this._addBusyStateFunc('LovDropdown setting new default item renderer');
      listView.setProperty('item.renderer', this._defaultItemRenderer.bind(this));
      var busyContext = Context.getContext(listView).getBusyContext();
      busyContext.whenReady().then(resolveBusyState, resolveBusyState);
    }
  };

  /**
   * Configures the results by doing the following operations:
   *   1. hides/shows the dropdown based on the availability of the results
   *   2. selects the first result if exists
   *   3. sets the first result as the current row if exists
   *
   * @param {string=} searchText The current text used for filtering the data
   * @param {V=} selectedValue The current selected value
   * @param {boolean} initial Flag indicating if this is an initial fetch
   *
   * @return {Promise} a promise that resolve once the operation is completed
   *
   * @memberof LovDropdown
   * @private
   * @instance
   */
  LovDropdown.prototype._configureResults = function (searchText, selectedValue, initial) {
    // get the busy context of the collection, so we can wait for it to be updated
    var busyContext = Context.getContext(this._containerElem[0]).getBusyContext();

    // Clear the current value item
    this._SetCurrentFirstItem(null);

    // JET-38215 - SELECT SINGLE - KEYBOARD NAVIGATION FOR COLLECTION TEMPLATE USAGE
    // Original logic updated for JET-49906 - IN ACCESSIBILITY MODE, THE FIRST DROPDOWN VALUE IS READ TWICE
    // remove the existing first result for keyboard focus
    this._firstResultForKeyboardFocus = null;

    // This method is called only after the collection fetched the data
    // get the result count and store them
    this._resultsCount = this._dataProvider.getFetchedDataCount() || {};

    // At this point, the data would have been fetched and we will have the fetched data count.
    // If the result count is 0, then we need to hide the dropdown.
    // Do not close the dropdown since we need to proceed as if the dropdown is open (which is used
    // in other places and we would want it to work as if the dropdown is open). So instead, we just need to
    // hide the dropdown.
    const isOpen = this._containerElem[0].offsetHeight > 0;
    if (this._resultsCount.count == null || this._resultsCount.count === 0) {
      this._containerElem.addClass(this._NO_RESULTS_FOUND_CLASSNAME);
      if (isOpen) {
        oj.Components.subtreeHidden(this._containerElem[0]);
      }
      return Promise.resolve();
    }

    // Now that we know that we have results to show, we need to make sure that the dropdown is being shown
    this._containerElem.removeClass(this._NO_RESULTS_FOUND_CLASSNAME);
    if (!isOpen) {
      oj.Components.subtreeShown(this._containerElem[0]);
    }

    if (initial) {
      return this._ConfigureResultsInitial(selectedValue, busyContext);
    }

    if (searchText == null || searchText === '') {
      return this._ConfigureResultsNoSearchText(selectedValue, busyContext);
    }

    return this._ConfigureResultsWithSearchText(selectedValue, busyContext);
  };

  /**
   * @memberof LovDropdown
   * @instance
   * @protected
   */
  LovDropdown.prototype._ConfigureResultsInitial = function (selectedValue, busyContext) {
    oj.Assert.failedInAbstractFunction();
    return busyContext.whenReady();
  };

  /**
   * @memberof LovDropdown
   * @instance
   * @protected
   */
  LovDropdown.prototype._ConfigureResultsNoSearchText = function (busyContext) {
    oj.Assert.failedInAbstractFunction();
    return busyContext.whenReady();
  };

  /**
   * @memberof LovDropdown
   * @instance
   * @protected
   */
  LovDropdown.prototype._ConfigureResultsWithSearchText = function (busyContext) {
    oj.Assert.failedInAbstractFunction();
    return busyContext.whenReady();
  };

  /**
   * Fetches the first result from the data provider (first leaf for the tree data)
   *
   * @return {Promise<ItemContext>} returns a promise that resolves to ItemContext representing the first data
   *
   * @memberof LovDropdown
   * @instance
   * @protected
   */
  LovDropdown.prototype._FetchFirstResult = function () {
    if (oj.DataProviderFeatureChecker.isTreeDataProvider(this._dataProvider)) {
      return this._fetchFirstLeafData();
    }

    return this._fetchFirstFlatData();
  };

  /**
   * Fetches the first data from flat data provider
   *
   * @return {Promise<ItemContext>} returns a promise that resolves to ItemContext representing the first data
   *
   * @memberof LovDropdown
   * @instance
   * @private
   */
  LovDropdown.prototype._fetchFirstFlatData = function () {
    // Filter criteria should already be set in the data provider, we just
    // need to fetch the first result
    const fetchPromise = this._dataProvider.fetchByOffset({ offset: 0, size: 1 });
    let result = null;
    const parseResults = function (fetchResults) {
      if (fetchResults != null) {
        const results = fetchResults.results;
        if (results.length > 0) {
          // Create value item from the first result item.
          result = this._createValueItemFromItem(results[0]);
        }
      }
      return Promise.resolve(result);
    }.bind(this);

    return fetchPromise.then(parseResults);
  };

  /**
   * Fetches the first leaf data from tree data provider
   *
   * @return {Promise<ItemContext>} returns a promise that resolves to ItemContext representing the first data
   *
   * @memberof LovDropdown
   * @instance
   * @private
   */
  LovDropdown.prototype._fetchFirstLeafData = function () {
    // Filter criteria should already be set in the data provider, we just
    // need to fetch the first result
    const rootDP = this._dataProvider;
    let done = false;

    /**
     * Fetches the data recursively through the tree data provider to find the first
     * matching leaf node.
     *
     * @param {DataProvider} dataProvider The current data provider instance (group/child)
     * @param {string|Array<string>|null} key An optional key for the current data provider instance
     *
     * @return {Promise<Object|null>} A promise that resolves to the first matched value-item or
     *                                null if no match is found.
     * @ignore
     */
    const fetchDataRecursively = function (dataProvider, key) {
      let offset = 0;
      let totalItems;
      if (key != null) {
        // Check if the count is stored in the root DP as list view calls the getChildDataProvider on the
        // root DP for all the child nodes at any depth. So the count will be stored in the root DP.
        const childCountMap = rootDP.getFetchedDataCount().childrenCountMap;
        if (childCountMap && childCountMap.has(key)) {
          totalItems = childCountMap.get(key).count;
        }
      }

      // If we are in the root node, the key will be null, so fetch the count directly from
      // the current DP instance. Also, if we are in a child node and it's count is not found in
      // the root DP, then also get it from the current DP instance.
      if (totalItems == null) {
        totalItems = dataProvider.getFetchedDataCount().count || 0;
      }

      // If there are no items fetched in this level, then there will not be any matching items,
      // so skip fetching further
      if (totalItems === 0) {
        return Promise.resolve(null);
      }

      /**
       * Processes the results from the fetchByOffset call to determine whether we are
       * at the last group node and fetches the first matching leaf node. If we are not at
       * the last group node, this recursively fetches the child nodes. If no match is found in
       * a group node, the next group node at the same level is processed until a match is found.
       *
       * @param {FetchByOffsetResults} fetchResults Results from the fetchByOffset call
       *
       * @return {Promise<Object|null>} A promise that resolves to the first matched value-item or
       *                                null if no match is found.
       * @ignore
       */
      const processChunk = function (fetchResults) {
        const results = fetchResults.results;
        // The total items count represents the number of items fetched at this level. Since
        // the item we need to select should have been fetched already, we can search only within the
        // range of this count. This would also make sure that we only search in the cache if available.
        let fetchDone = totalItems === 0 || totalItems === offset + 1;
        let processChunkPromise;

        if (results.length) {
          // Fetch return an item, check if the item is a leaf node and a match
          // or a group node.
          const item = results[0];
          const itemMetadata = item.metadata;

          // Check if child is present
          // List View gets the child DP from the RootDP, so we will be doing the same
          // to make sure we hit the cache
          const childDataProvider = rootDP.getChildDataProvider(itemMetadata.key);

          if (childDataProvider != null) {
            // The fetched item is a group node, so continue fetching recursively
            processChunkPromise = fetchDataRecursively(childDataProvider, itemMetadata.key);
          } else {
            // The fetched item is a leaf node and a match. Store it in result and
            // finish the process
            const result = this._createValueItemFromItem(item);
            done = true;
            processChunkPromise = Promise.resolve(result);
          }
        } else {
          // Fetch returned empty. Resolve the current process with null.
          processChunkPromise = Promise.resolve(null);
          // Set fetchDone flag irrespective of the current offset and total items count
          // as all the results are fetched.
          fetchDone = true;
        }

        // Once the processChunkPromise is resolved, check if the match is found.
        return processChunkPromise.then(function (result) {
          // If the fetch is done at the current level or if the match is found,
          // resolve the process with whatever available in the result. There is
          // nothing else to do.
          if (fetchDone || done) {
            return Promise.resolve(result);
          }

          // If the fetch is not done and a match is also not found, then get the next node
          // and do the same process.
          offset += 1;
          return dataProvider.fetchByOffset({ offset: offset, size: 1 }).then(processChunk);
        });
      }.bind(this);

      // Fetch the first result and start processing it.
      return dataProvider.fetchByOffset({ offset: offset, size: 1 }).then(processChunk);
    }.bind(this);

    // Recursively fetch the data to get the first matching leaf-node
    return fetchDataRecursively(rootDP, null);
  };

  /**
   * Clears the selection in the dropdown
   *
   * @memberof LovDropdown
   * @protected
   * @instance
   */
  LovDropdown.prototype._ClearSelection = function () {
    this._SetCollectionCurrentRow({ rowKey: null });
    this._SetCollectionSelectedKeySet(new ojkeyset.KeySetImpl([]));
  };

  LovDropdown.prototype._clearContextRenderPromiseFunctions = function (context) {
    // eslint-disable-next-line no-param-reassign
    context.renderDone = null;
    // eslint-disable-next-line no-param-reassign
    context.renderError = null;
  };

  /**
   * @memberof LovDropdown
   * @instance
   * @protected
   */
  LovDropdown.prototype._GetDefaultCollectionRendererSelectionMode = function () {
    oj.Assert.failedInAbstractFunction();
    return null;
  };

  LovDropdown.prototype._defaultCollectionRenderer = function (context) {
    var listView;
    var busyContext;
    var contextRenderDone = context.renderDone;
    var contextRenderError = context.renderError;
    if (!this._resultsElem) {
      var $parentElem = $(context.parentElement);
      var placeholderElem = $parentElem.find('.oj-searchselect-results-placeholder')[0];
      var idSuffix = context.idSuffix;

      listView = document.createElement('oj-list-view');
      listView.setAttribute('data-oj-internal', '');
      listView.setAttribute('data-oj-binding-provider', 'none');
      listView.setAttribute('id', 'oj-searchselect-results-' + idSuffix);
      listView.setAttribute('selection-mode', this._GetDefaultCollectionRendererSelectionMode());
      listView.setAttribute('class', 'oj-select-results oj-group-header-sm');
      listView.setAttribute('drill-mode', 'none');
      listView.setAttribute('gridlines.item', 'hidden');

      // Add an empty noData container since we will be hiding the dropdown when
      // there is no data.
      // We need to have an empty noData container otherwise listView's default
      // template shows "No items to display" text which flashes for a brief period of time
      // before we hide the dropdown.
      var noDataTemplate = document.createElement('template');
      noDataTemplate.setAttribute('slot', 'noData');
      var noDataContainer = document.createElement('div');
      noDataContainer.setAttribute('class', 'oj-searchselect-no-results-container');
      // need to append to content documentFragment of template element instead of template itself
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
      busyContext.whenReady().then(
        function () {
          listView.addEventListener('ojItemAction', context.handleRowAction);
          listView.addEventListener('currentItemChanged', function (event) {
            // Call the handler to update the collection context accordingly
            context.currentRowKeyChangedListener(event.detail.value);
          });
          if (
            context.data &&
            oj.DataProviderFeatureChecker &&
            oj.DataProviderFeatureChecker.isTreeDataProvider(context.data)
          ) {
            // Only allow leaf nodes to be focusable/selectable
            listView.setProperty('item.focusable', (fc) => fc.leaf);
            listView.setProperty('item.selectable', (sc) => sc.leaf);
          }

          if (this._itemTemplate) {
            this._getTemplateEngineFunc().then(
              function (templateEngine) {
                this._templateEngine = templateEngine;
                listView.setProperty(
                  'item.renderer',
                  this._templateItemRenderer.bind(this, templateEngine)
                );
                this._clearContextRenderPromiseFunctions(context);
                contextRenderDone();
              }.bind(this),
              function (reason) {
                Logger.warn(
                  'Select: template item renderer template engine promise rejected: ' + reason
                );
                this._clearContextRenderPromiseFunctions(context);
                contextRenderError(reason);
              }.bind(this)
            );
          } else {
            listView.setProperty('item.renderer', this._defaultItemRenderer.bind(this));
            this._clearContextRenderPromiseFunctions(context);
            contextRenderDone();
          }
        }.bind(this),
        function (reason) {
          Logger.warn('Select: creating default listView busyContext promise rejected: ' + reason);
          this._clearContextRenderPromiseFunctions(context);
          contextRenderError(reason);
        }.bind(this)
      );
    } else {
      listView = this._resultsElem[0];
      // Need to wait until _SetupResources is called asynchronously on listView so that when we
      // set properties on it, the internal listView.isAvailable() call returns true and
      // listView will process them
      busyContext = Context.getContext(listView).getBusyContext();
      busyContext.whenReady().then(
        function () {
          listView.data = context.data;
          listView.selected = context.selected;
          listView.currentItem = context.currentRow.rowKey;
          this._clearContextRenderPromiseFunctions(context);
          contextRenderDone();
        }.bind(this),
        function (reason) {
          Logger.warn(
            'Select: busyContext promise rejected before setting props on listView: ' + reason
          );
          this._clearContextRenderPromiseFunctions(context);
          contextRenderError(reason);
        }.bind(this)
      );
    }
  };

  LovDropdown.prototype._templateCollectionRenderer = function (context) {
    var contextRenderDone = context.renderDone;
    var contextRenderError = context.renderError;
    if (!this._resultsElem) {
      var $parentElem = $(context.parentElement);
      var placeholderElem = $parentElem.find('.oj-searchselect-results-placeholder')[0];
      this._getTemplateEngineFunc().then(
        function (templateEngine) {
          this._templateEngine = templateEngine;
          this._collectionTemplateContext = this._createCollectionTemplateContext(
            templateEngine,
            context
          );
          var nodes = templateEngine.execute(
            this._templateContextComponentElement,
            this._collectionTemplate,
            this._collectionTemplateContext
          );

          for (var i = 0; i < nodes.length; i++) {
            placeholderElem.parentNode.insertBefore(nodes[i], placeholderElem);
          }
          // remove the placeholder elem because it's no longer needed
          placeholderElem.parentNode.removeChild(placeholderElem);
          this._resultsElem = $parentElem.find('.oj-select-results'); // '.oj-listbox-results'
          this._resultsElem.on('click', LovUtils.killEvent);
          this._clearContextRenderPromiseFunctions(context);
          contextRenderDone();
        }.bind(this),
        function (reason) {
          Logger.warn(
            'Select: template collection renderer template engine promise rejected: ' + reason
          );
          this._clearContextRenderPromiseFunctions(context);
          contextRenderError(reason);
        }.bind(this)
      );
    } else {
      var templateContext = this._collectionTemplateContext;
      templateContext.data = context.data;
      templateContext.searchText = context.searchText;
      templateContext.selected = context.selected;
      this._clearContextRenderPromiseFunctions(context);
      contextRenderDone();
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
    }
    this._savedDataProviderEH = undefined;
  };

  // eslint-disable-next-line no-unused-vars
  LovDropdown.prototype._handleDataProviderEvent = function (event) {
    // need to add busy state around potential listView animation
    var resolveBusyState = this._addBusyStateFunc('LovDropdown handling data provider event');

    var busyContext = Context.getContext(this._containerElem[0]).getBusyContext();
    busyContext.whenReady().then(
      function () {
        resolveBusyState();
      },
      function (reason) {
        Logger.warn(
          'Select: LovDropdown.handleDataProviderEvent busyContext promise rejected: ' + reason
        );
        resolveBusyState();
      }
    );
  };

  LovDropdown.prototype.close = function () {
    // this._dispatchEvent('currentItemChanged', { key: null });

    // JET-37797 - can't close dropdown while list is loading
    // clear the most recent promise because the dropdown is now closed and we don't need to update
    this._lastRenderResultsPromise = null;

    //  - firefox: can't arrow into dropdown after clicking outside lov
    // explicitly blur the focused element in the dropdown before closing it
    var activeElem = document.activeElement;
    if (DomUtils.isAncestor(this.getElement(), activeElem)) {
      activeElem.blur();
    }

    // Reset the selection
    this._ClearSelection();

    // JET-38215 - SELECT SINGLE - KEYBOARD NAVIGATION FOR COLLECTION TEMPLATE USAGE
    // Original logic updated for JET-49906 - IN ACCESSIBILITY MODE, THE FIRST DROPDOWN VALUE IS READ TWICE
    // remove the first result as we do not need it anymore
    this._firstResultForKeyboardFocus = null;

    // Add data-oj-suspend so that dropdown collections go into suspended mode when the dropdown is closed
    this._containerElem.attr('data-oj-suspend', '');

    /** @type {!Object.<oj.PopupService.OPTION, ?>} */
    var psOptions = {};
    psOptions[oj.PopupService.OPTION.POPUP] = this._containerElem;
    oj.PopupService.getInstance().close(psOptions);

    // this._containerElem.removeAttr('id');

    // JET-61331 - Select one choice LOV dropdown flowing out of the browser and adjusting when the
    // page is scrolled up or down
    // maintain a flag when the dropdown is open so we know when to handle resize events
    this._dropdownOpen = false;

    this._dispatchEvent('dropdownClosed');
  };

  LovDropdown.prototype.open = function () {
    var containerElem = this._containerElem;

    // JET-37797 - can't close dropdown while list is loading
    // remove the 'no results found' style class until we know it's needed
    this._containerElem.removeClass(this._NO_RESULTS_FOUND_CLASSNAME);

    // Remove data-oj-suspend so that dropdown collections come back from suspended mode when dropdown is opened
    this._containerElem.removeAttr('data-oj-suspend');

    // if (this._searchElem) {
    //   this._searchElem.val('');
    // }

    // TODO: we should use oj-popup instead of using the popup service directly, and then oj-popup
    // could handle some of the focus functionality, like trapping TABS
    var psEvents = {};
    psEvents[oj.PopupService.EVENT.POPUP_CLOSE] = function () {
      this._dispatchEvent('closeDropdown', { trigger: 'popupCloseEvent' });
    }.bind(this);
    psEvents[oj.PopupService.EVENT.POPUP_REMOVE] = this._surrogateRemoveHandler.bind(this);
    psEvents[oj.PopupService.EVENT.POPUP_AUTODISMISS] = this._clickAwayHandler.bind(this);
    psEvents[oj.PopupService.EVENT.POPUP_REFRESH] = function () {
      this._sizeAndAdjustPosition(containerElem[0]);
    }.bind(this);
    psEvents[oj.PopupService.EVENT.POPUP_AFTER_OPEN] = function (event) {
      var dropdownElem = event.popup[0];
      this._sizeAndAdjustPosition(dropdownElem);

      if (this._fullScreenPopup) {
        dropdownElem.scrollIntoView();
      }

      // JET-61331 - Select one choice LOV dropdown flowing out of the browser and adjusting when the
      // page is scrolled up or down
      // maintain a flag when the dropdown is open so we know when to handle resize events
      this._dropdownOpen = true;
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

    this._dispatchEvent('openPopup', { psOptions: psOptions });
  };

  // Size the dropdown and adjust its position
  LovDropdown.prototype._sizeAndAdjustPosition = function (dropdownElem) {
    this._dispatchEvent('sizeDropdown');

    // JET-34367 - remove code to update popup position on refresh
    // Position a proxy element instead of the real dropdown so that we don't have to
    // change the size of the dropdown before calculating the position, because changing
    // the size of the dropdown before positioning may reset the results' scroll position and
    // prevent the user from scrolling down.
    this._bodyElem.append(this._dropdownPositioningProxyContainer); // @HTMLUpdateOK
    this._dispatchEvent('adjustDropdownPosition', {
      popupElem: dropdownElem,
      positioningProxyElem: this._dropdownPositioningProxyContainer.children()[0]
    });
    this._dropdownPositioningProxyContainer.detach();
  };

  // JET-61331 - Select one choice LOV dropdown flowing out of the browser and adjusting when the
  // page is scrolled up or down
  // add a resize listener to the desktop dropdown so that we can reposition it after the content
  // renders
  LovDropdown.prototype._handleResize = function () {
    // don't handle the resize if the dropdown is no longer open or attached to the DOM
    if (
      !this._dropdownOpen ||
      !this._containerElem ||
      !this._containerElem[0] ||
      !this._containerElem[0].parentElement
    ) {
      return;
    }

    this._sizeAndAdjustPosition(this._containerElem[0]);
  };

  LovDropdown.prototype._addResizeListener = function (element) {
    if (element) {
      if (this._resizeHandler == null) {
        this._resizeHandler = this._handleResize.bind(this);
      }
      DomUtils.addResizeListener(element, this._resizeHandler, 30, true);
    }
  };

  LovDropdown.prototype._removeResizeListener = function (element) {
    if (element && this._resizeHandler) {
      DomUtils.removeResizeListener(element, this._resizeHandler);
      this._resizeHandler = null;
    }
  };

  LovDropdown.prototype._clickAwayHandler = function (event) {
    var containerElem = this._containerElem;

    //  - period character in element id prevents options box open/close;
    // escapeSelector handles special characters
    var $target = $(event.target);
    if (
      $target.closest(containerElem).length ||
      $target.closest('#' + $.escapeSelector(containerElem.attr('data-oj-containerid'))).length
    ) {
      return;
    }

    // if the target is in a popup nested within the open dropdown, like in the dropdown of
    // an oj-select or oj-combobox in the custom header, then keep the dropdown open
    var closestDropLayer = containerElem.closest('.oj-listbox-drop-layer');
    if (closestDropLayer.length > 0 && $target.closest(closestDropLayer).length > 0) {
      return;
    }

    if (containerElem.length > 0) {
      this._dispatchEvent('closeDropdown', { trigger: 'clickAway' });
    }
  };

  LovDropdown.prototype._surrogateRemoveHandler = function () {
    if (this._containerElem) {
      this._containerElem.remove();
    }
  };

  /**
   * Handle keydown event to process focusing to/from the drop down
   * @param {jQueryEvent} e The jQuery event object
   */
  LovDropdown.prototype._handleKeyDown = function (e) {
    // JET-44374 - qunit combobox ojselect tests fail with new jquery 3.6.0
    // e.which no longer gets populated when simulating events with keyCode specified, so
    // check both properties on the event
    var keyCode = e.which || e.keyCode;
    if (keyCode === LovUtils.KEYS.TAB) {
      // Dispatch event so that ojselect can react to this event
      // Do not kill the event as we want the focus to be moved to the next component
      this._dispatchEvent('tabOut');
    } else if (keyCode === LovUtils.KEYS.ESC) {
      this._dispatchEvent('closeDropdown', { trigger: 'escKeyDown' });
    }
  };

  /**
   * @memberof LovDropdown
   * @instance
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  LovDropdown.prototype._HandleCollectionSelectedItemChanged = function (_valueItem, event) {
    // Subclasses can override to do something if necessary
  };

  /**
   * Performs actions that have to be done when the oj-table updates the currentRow
   * property.
   *
   * @param {oj.ojTable.CurrentRow<K>} currentRow The object containing the rowKey of the current selected row
   *
   * @memberof LovDropdown
   * @instance
   * @private
   */
  LovDropdown.prototype._handleCollectionCurrentRowChanged = function (currentRow) {
    // Do nothing if called during the initialization phase or when the currentRow is null,
    // or when we're pushing changes due to the collection receiving focus
    if (
      this._duringListViewInitialization ||
      currentRow == null ||
      this._handlingCollectionFocusinOnce
    ) {
      return;
    }
    // keep context up to date, make a copy since we do not want to modify the reference
    this._collectionContext.currentRow = {
      rowIndex: currentRow.rowIndex,
      rowKey: currentRow.rowKey
    };
    // Call the currentRow.rowKey handler with the current rowKey
    this._handleCollectionCurrentRowKeyChanged(currentRow.rowKey);
  };

  /**
   * Performs operations that have to be done when the collection updates the currentRow
   * property
   *
   * @param {K} rowKey The current selected item's key
   *
   * @memberof LovDropdown
   * @instance
   * @private
   */
  LovDropdown.prototype._handleCollectionCurrentRowKeyChanged = function (rowKey) {
    // Do nothing if called during the initialization phase or when the rowKey is null,
    // or when we're pushing changes due to the collection receiving focus
    if (this._duringListViewInitialization || rowKey == null || this._handlingCollectionFocusinOnce) {
      return;
    }
    // keep context up to date
    this._collectionContext.currentRow.rowKey = rowKey;
  };

  /**
   * Performs actions that have to be done when a row/item is selected from the collection
   *
   * @param {CustomEvent} event ojRowAction or ojItemAction event object
   * @param {ItemContext} context
   *
   * @memberof LovDropdown
   * @instance
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  LovDropdown.prototype._handleRowAction = function (event, context) {
    var valueItem = this._createValueItemFromItem(event.detail.context);
    this._handleSelection(valueItem, event);
  };

  LovDropdown.prototype._handleSelection = function (valueItem, event) {
    if (valueItem) {
      this._dispatchEvent('handleSelection', { valueItem: valueItem, event: event });
    }
  };

  LovDropdown.prototype._createCollectionTemplateContext = function (templateEngine, context) {
    var templateContext = {};
    if (templateEngine) {
      // if data changes, we recreate the whole dropdown and collection, so don't need this to be
      // trackable
      templateContext.data = context.data;
      // don't need searchText to be trackable because it's most likely only used in a row template,
      // which would get explicitly re-rendered when it changes
      templateContext.searchText = context.searchText;

      // make this trackable because we expect to push to it on each render
      templateEngine.defineTrackableProperty(templateContext, 'selected');

      // pass listener so we can react to writebacks made by the collection
      templateEngine.defineTrackableProperty(
        templateContext,
        'selectedItem',
        undefined,
        context.selectedItemChangedListener
      );

      // currentRow property is an object and we expect the collection to writeback
      // we need to consider two cases here:
      //  1. if oj-table is used as a collection template, it updates the currentRow
      //     property directly
      //  2. if oj-list-view is used as a collection template, it updates the rowKey
      //     property of the currentRow property
      // so, we need to define two trackable properties
      let currentRow = {};
      templateEngine.defineTrackableProperty(
        currentRow,
        'rowKey',
        undefined,
        context.currentRowKeyChangedListener
      );
      templateEngine.defineTrackableProperty(
        templateContext,
        'currentRow',
        currentRow,
        context.currentRowChangedListener
      );

      // this an event listener and so we don't expect a writeback for this property
      templateContext.handleRowAction = context.handleRowAction;
    } else {
      Logger.error(
        'JET Select: template engine not available when creating context for collectionTemplate'
      );
    }

    return templateContext;
  };

  /**
   * Creates the value item from the dataprovider item
   *
   * @param {Item} item the item fetched from the data provider
   * @returns {Object} the constructed value item
   *
   * @memberof LovDropdown
   * @private
   * @instance
   */
  LovDropdown.prototype._createValueItemFromItem = function (item) {
    if (item.data == null || item.metadata == null) {
      return null;
    }

    return {
      key: item.metadata.key,
      data: item.data,
      metadata: item.metadata
    };
  };

  /**
   * Setter function for selected property of the collectionTemplate context
   *
   * @param {KeySet} selected new selected keyset
   *
   * @memberof LovDropdown
   * @protected
   * @instance
   */
  LovDropdown.prototype._SetCollectionSelectedKeySet = function (selected) {
    // Keep the collection context in sync
    this._collectionContext.selected = selected;

    if (this._collectionTemplateContext != null) {
      this._collectionTemplateContext.selected = selected;
    } else if (this._collectionTemplate == null && this._resultsElem) {
      // If no collection template is present, that means default
      // list view is being used, set the property using this._resultsElem
      this._resultsElem[0].setProperty('selected', selected);
    }
  };

  /**
   * Sets the currentRow property of the collection template context
   *
   * @param {oj.ojTable.CurrentRow<K>} currentRow The object containing the rowKey of the current selected row
   *
   * @memberof LovDropdown
   * @protected
   * @instance
   */
  LovDropdown.prototype._SetCollectionCurrentRow = function (currentRow) {
    // keep context up to date, make a copy since we do not want to modify the reference
    this._collectionContext.currentRow = {
      rowIndex: currentRow.rowIndex,
      rowKey: currentRow.rowKey
    };

    if (this._collectionTemplateContext != null) {
      // Since the reference is changed, we will have to reinitialize listener to the
      // rowKey property
      this._addListenerForRowKeyProperty(currentRow);
      this._collectionTemplateContext.currentRow = currentRow;
    } else if (this._collectionTemplate == null && this._resultsElem) {
      // If no collection template is present, that means default
      // list view is being used, set the property using this._resultsElem
      this._resultsElem[0].setProperty('currentItem', currentRow.rowKey);
    }
  };

  /**
   * Retrives the current value item for selection
   *
   * @return {Object=} The current value item
   *
   * @memberof LovDropdown
   * @public
   * @instance
   * @ignore
   */
  LovDropdown.prototype.getValueItemForSelection = function () {
    var _rowKey = this._collectionContext.currentRow.rowKey;
    var _firstItem = this._currentFirstItem;
    var _selectedItem = this._collectionContext.selectedItem;

    // First check if current row exists
    if (_rowKey != null) {
      let returnValueItem = {};
      returnValueItem.key = _rowKey;
      // If the current row is the first item in the dropdown
      // we will already have the data
      if (_firstItem && _firstItem.key === _rowKey) {
        returnValueItem.data = _firstItem.data;
        returnValueItem.metadata = _firstItem.metadata;
      }
      return returnValueItem;
    }

    // If current row key does not exist, return the selected item
    return _selectedItem;
  };

  /**
   * Gets the result count shown in the dropdown
   *
   * @return {Object} The result count object of type { count: number, done: boolean}
   *
   * @memberof LovDropdown
   * @instance
   * @public
   * @ignore
   */
  LovDropdown.prototype.getResultsCount = function () {
    return this._resultsCount;
  };

  /**
   * Focuses the collection component.
   *
   * @return {Promise} A promise indicating that focus has been set on the collection component
   *
   * @memberof LovDropdown
   * @instance
   * @public
   * @ignore
   */
  LovDropdown.prototype.focus = function () {
    const resolveBusyState = this._addBusyStateFunc('LovDropdown focusing the collection component');
    return this._handleCollectionFocus().then(
      function () {
        FocusUtils.focusFirstTabStop(this.getElement());
        resolveBusyState();
      }.bind(this)
    );
  };

  /**
   * Sets the current first value item
   *
   * @param {Object=} valueItem The current value item
   *
   * @memberof LovDropdown
   * @protected
   * @instance
   */
  LovDropdown.prototype._SetCurrentFirstItem = function (valueItem) {
    this._currentFirstItem = valueItem;
  };

  /**
   * Adds listener for rowKey property of the currentRow property
   *
   * @param {oj.ojTable.CurrentRow<K>} currentRow The current row object
   *
   * @memberof LovDropdown
   * @private
   * @instance
   */
  LovDropdown.prototype._addListenerForRowKeyProperty = function (currentRow) {
    var context = this._collectionContext;
    var rowKey = currentRow.rowKey;
    // add trackable property rowKey
    if (this._templateEngine) {
      this._templateEngine.defineTrackableProperty(
        currentRow,
        'rowKey',
        rowKey,
        context.currentRowKeyChangedListener
      );
    }
  };

  // JET-38215 - SELECT SINGLE - KEYBOARD NAVIGATION FOR COLLECTION TEMPLATE USAGE
  // Original logic updated for JET-49906 - IN ACCESSIBILITY MODE, THE FIRST DROPDOWN VALUE IS READ TWICE
  /**
   * Fetches the first result from the data provider and sets it as the current row if the
   * collection gets keyboard focus.
   *
   * @return {Promise} returns a promise that resolves after the first result is fetched
   *
   * @memberof LovDropdown
   * @instance
   * @protected
   */
  LovDropdown.prototype._FetchFirstResultForKeyboardFocus = function () {
    var busyContext = Context.getContext(this._containerElem[0]).getBusyContext();
    this._firstResultForKeyboardFocus = null;
    return this._FetchFirstResult().then(
      function (data) {
        if (data != null) {
          // if there are results, save the data so that it can be used for setting the
          // current row when we need to focus the collection element.
          this._firstResultForKeyboardFocus = data;
        }
        return busyContext.whenReady();
      }.bind(this)
    );
  };

  // JET-38215 - SELECT SINGLE - KEYBOARD NAVIGATION FOR COLLECTION TEMPLATE USAGE
  // Original logic updated for JET-49906 - IN ACCESSIBILITY MODE, THE FIRST DROPDOWN VALUE IS READ TWICE
  /**
   * Setup collection component before focusing it. This sets the first result as the current row when
   * the LovDropdown.focus is called.
   *
   * @memberof LovDropdown
   * @instance
   * @private
   */
  LovDropdown.prototype._handleCollectionFocus = function () {
    var resolveBusyState = this._addBusyStateFunc('LovDropdown setting selected KeySet on focusin');

    // ignore if we do not have first row data
    if (!this._firstResultForKeyboardFocus) {
      // Return a Promise to be consistent with the else path. Make sure to set and resolve the busy context.
      return Promise.resolve().then(function () {
        resolveBusyState();
      });
    }

    // JET-39993 - Select2 options qunit tests fail using chrome and safari on Mac for master branch
    // set flag while we're setting the collection current row and selected key set because we don't
    // need to react to changes that we're pushing
    this._handlingCollectionFocusinOnce = true;

    this._SetCollectionCurrentRow({ rowKey: this._firstResultForKeyboardFocus.key });

    var busyContext = Context.getContext(this._containerElem[0]).getBusyContext();
    return busyContext.whenReady().then(
      function () {
        this._handlingCollectionFocusinOnce = false;
        this._firstResultForKeyboardFocus = null;
        resolveBusyState();
      }.bind(this)
    );
  };

  /**
   * @private
   */
  const LovMainField = function (options) {
    // {className, ariaLabel, ariaControls, componentId,
    //  inputType, enabled, readOnly, placeholder, addBusyStateFunc,
    //  forceReadOnly, endContent, createOrUpdateReadonlyDivFunc}
    this._addBusyStateFunc = options.addBusyStateFunc;
    this._forceReadOnly = options.forceReadOnly;
    this._createOrUpdateReadonlyDivFunc = options.createOrUpdateReadonlyDivFunc;

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

  /**
   * Returns the value of the input element
   *
   * @return {string} the value of the input element
   *
   * @memberof LovMainField
   * @public
   * @instance
   * @ignore
   */
  LovMainField.prototype.getInputText = function () {
    return this._inputElem.value || '';
  };

  LovMainField.prototype._createInnerDom = function (options) {
    var className = options.className;
    var componentId = options.componentId;
    var inputType = options.inputType;
    var enabled = options.enabled;
    var readonly = options.readOnly;
    var ariaLabel = options.ariaLabel;
    var ariaControls = options.ariaControls;
    var cachedMainFieldInputElement = options.cachedMainFieldInputElement;

    var textFieldContainer = document.createElement('div');
    textFieldContainer.setAttribute(
      'class',
      'oj-text-field-container oj-searchselect-main-field oj-text-field-has-end-slot'
    );
    textFieldContainer.setAttribute('role', 'presentation');

    var labelValueDiv = document.createElement('div');
    labelValueDiv.setAttribute('class', 'oj-text-field-middle');
    textFieldContainer.appendChild(labelValueDiv); // @HTMLUpdateOK

    var input = cachedMainFieldInputElement || document.createElement('input');
    // use the same id convention as EditableValueUtils._initInputIdLabelForConnection
    input.setAttribute('id', componentId + '|input');
    // JET-37990 - oj-select-single: autocomplete is not disabled in chrome browser
    // Chrome used to ignore "off" value, but as of Chrome 81 it works more reliably
    // (https://stackoverflow.com/questions/57367813/2019-chrome-76-approach-to-autocomplete-off)
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('class', className + '-input oj-text-field-input');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('placeholder', options.placeholder);
    input.disabled = !enabled && !readonly;
    if (readonly || (this._forceReadOnly && enabled)) {
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
    }
    // apply virtualKeyboard input type to search field
    if (inputType !== null && inputType !== '') {
      input.setAttribute('type', inputType);
    } else {
      input.setAttribute('type', 'text');
    }
    labelValueDiv.appendChild(input);

    if (options.endContent) {
      textFieldContainer.appendChild(options.endContent);
    }
    // create readonly div and insert before input for consistency with other form comps.
    if (readonly) {
      this._createOrUpdateReadonlyDivFunc(input);
    }

    return textFieldContainer;
  };

  /**
   * Update the label associated with the field.
   * @param {string} labelledBy Id of the label
   * @param {string} ariaLabel The aria-label text
   */
  LovMainField.prototype.updateLabel = function (labelledBy, ariaLabel) {
    if (labelledBy) {
      this._inputElem.setAttribute('aria-labelledby', labelledBy);
      this._inputElem.removeAttribute('aria-label');
    } else if (ariaLabel) {
      this._inputElem.setAttribute('aria-label', ariaLabel);
      this._inputElem.removeAttribute('aria-labelledby');
    }
  };

  /**
   * @ojcomponent oj.ojSelectBase
   * @augments oj.editableValue
   * @since 8.0.0
   * @abstract
   * @hideconstructor
   * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "TextFilter"]}
   * @ojtsimport {module: "ojcommontypes", type: "AMD", importName: ["ojcommontypes"]}
   * @ojsignature [{
   *                target: "Type",
   *                value: "abstract class ojSelectBase<V, D, SP extends ojSelectBaseSettableProperties<V, D>> extends editableValue<V, SP>"
   *               },
   *               {
   *                target: "Type",
   *                value: "ojSelectBaseSettableProperties<V, D> extends editableValueSettableProperties<V>",
   *                for: "SettableProperties"
   *               }
   *              ]
   *
   * @classdesc
   */

  oj.__registerWidget('oj.ojSelectBase', $.oj.editableValue, {
    defaultElement: '<input>',
    widgetEventPrefix: 'oj',

    /**
     * Input types for virtual keyboard.
     * @private
     */
    _ALLOWED_INPUT_TYPES: ['email', 'number', 'search', 'tel', 'text', 'url'],

    /**
     * Options that require a refresh when changed.
     * @private
     */
    _OPTIONS_REQUIRING_REFRESH: new Set(['disabled', 'readOnly', 'placeholder', 'data']),

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
       * @memberof oj.ojSelectBase
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
       * @public
       * @instance
       * @type {Object | null}
       * @default null
       * @ojwebelementstatus {type: "deprecated", since: "14.0.0",
       *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
       * @ojsignature {target: "Type", value: "DataProvider<V, D>", jsdocOverride: true}
       * @ojmincapabilities {filter: {textFilter: true}}
       * @memberof oj.ojSelectBase
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
       * @memberof oj.ojSelectBase
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
       * @ojshortdesc Specifies whether the component is required or optional. See the Help documentation for more information.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojSelectBase
       * @type {boolean}
       * @default false
       * @see #translations
       */
      /**
       * <p>
       * This property set to <code class="prettyprint">false</code> implies that a value is not required to be provided by the user.
       * This is the default.
       * This property set to <code class="prettyprint">true</code> implies that a value is required to be provided by the user.
       * </p>
       * <p>
       * In the Redwood theme, by default, a Required text is rendered inline when the field is empty.
       * If user-assistance-density is 'compact', it will show on the label as an icon.
       * In the Alta theme the input's label will render a required icon.
       * </p>
       * <p>The Required error text is based on Redwood UX designs, and it is not recommended that
       * it be changed.
       * To override the required error message,
       * use the <code class="prettyprint">translations.required</code> attribute.
       * The component's label text is passed in as a token {label} and can be used in the message detail.
       * </p>
       * <p>When required is set to true, an implicit
       * required validator is created, i.e.,
       * <code class="prettyprint">new RequiredValidator()</code>. The required validator is the only
       * validator to run during initial render, and its error is not shown to the user at this time;
       * this is called deferred validation. The required validator also runs during normal validation;
       * this is when the errors are shown to the user.
       * See the <a href="#validation-section">Validation and Messaging</a> section for details.
       * </p>
       * <p>
       * When the <code class="prettyprint">required</code> property changes due to programmatic intervention,
       * the component may clear component messages and run validation, based on the current state it's in. </br>
       *
       * <h4>Running Validation when required property changes</h4>
       * <ul>
       * <li>if component is valid when required is set to true, then it runs deferred validation on
       * the value property. If the field is empty, the valid state is invalidHidden. No errors are
       * shown to the user.
       * </li>
       * <li>if component is invalid and has deferred messages when required is set to false, then
       * component messages are cleared (messages-custom messages are not cleared)
       * but no deferred validation is run because required is false.
       * </li>
       * <li>if component is invalid and currently showing invalid messages when required is set, then
       * component messages are cleared and normal validation is run using the current display value.
       * <ul>
       *   <li>if there are validation errors, then <code class="prettyprint">value</code>
       *   property is not updated and the error is shown.
       *   </li>
       *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
       *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
       *   event on the component to clear custom errors.</li>
       * </ul>
       * </li>
       * </ul>
       *
       * <h4>Clearing Messages when required property changes</h4>
       * <ul>
       * <li>Only messages created by the component, like validation messages, are cleared when the required property changes.</li>
       * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
       * </ul>
       *
       * </p>
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojSelectBase
       * @see #translations
       * @ojfragment selectCommonRequired
       */
      required: false,

      /**
       * The type of virtual keyboard to display for entering a value on mobile browsers.
       * This attribute has no effect on desktop browsers.
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
       * @expose
       * @instance
       * @memberof oj.ojSelectBase
       * @ojshortdesc The type of virtual keyboard to display for entering a value on mobile browsers. See the Help documentation for more information.
       * @type {string}
       * @ojvalue {string} "email" Use a virtual keyboard for entering email addresses.
       * @ojvalue {string} "number" Use a virtual keyboard for entering numbers.
       *                            <p>Note that on Android and Windows Mobile, the "number" keyboard
       *                            does not contain the minus sign.  This value should not be used
       *                            on fields that accept negative values.</p>
       * @ojvalue {string} "search" Use a virtual keyboard for entering search terms.
       * @ojvalue {string} "tel" Use a virtual keyboard for entering telephone numbers.
       * @ojvalue {string} "text" Use a virtual keyboard for entering text.
       * @ojvalue {string} "url" Use a virtual keyboard for URL entry.
       * @default "search"
       */
      virtualKeyboard: 'search',

      /**
       * Dictates element's readonly state.
       * <p>
       * The default value for readonly is false. However, if the form component is a descendent of
       * <code class="prettyprint">oj-form-layout</code>, the default value for readonly could come from the
       * <code class="prettyprint">oj-form-layout</code> component's readonly attribute.
       * The <code class="prettyprint">oj-form-layout</code> uses the
       * <a href="MetadataTypes.html#PropertyBinding">MetadataTypes.PropertyBinding</a>
       * <code class="prettyprint">provide</code> property to provide its
       * <code class="prettyprint">readonly</code>
       * attribute value to be consumed by descendent components.
       * The form components are configured to consume the readonly property if an ancestor provides it and
       * it is not explicitly set.
       * For example, if the oj-form-layout's readonly attribute is set to true, and a descendent form component does
       * not have its readonly attribute set, the form component's readonly will be true.
       * </p>
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
       * @alias readonly
       * @expose
       * @ojshortdesc Specifies whether a value is readonly
       * @access public
       * @instance
       * @memberof oj.ojSelectBase
       * @type {boolean}
       * @default false
       */
      readOnly: false,

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
       *   value: "keyof D | ((itemContext: ojcommontypes.ItemContext<V, D>) => string)",
       *   jsdocOverride: true
       * }
       * @default 'label'
       *
       * @memberof oj.ojSelectBase
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
       * @memberof oj.ojSelectBase
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
       * @memberof oj.ojSelectBase
       * @ojfragment selectCommonLabelledBy
       */
      labelledBy: null,

      /**
       * The list of text filter matching behaviors to use when fetching data filtered by a user's
       * typed search text, in order of descending priority with the preferred behavior first.
       * If the preferred behavior is not supported by the DataProvider, then the component will
       * check the next behavior, and so on, until it finds one that is supported.
       * If none of the specified behaviors are supported or if this property is not specified,
       * then the behavior will effectively be "unknown".
       *
       * @example <caption>Initialize the Select with the <code class="prettyprint">match-by</code> attribute specified:</caption>
       * &lt;oj-select-single match-by="[[matchByValue]]">&lt;/oj-select-single>
       *
       * @example <caption>Get or set the <code class="prettyprint">matchBy</code> property after initialization:</caption>
       * // getter
       * var matchByValue = mySelect.matchBy;
       *
       * // setter
       * mySelect.matchBy = ["phrase", "fuzzy", "contains", "startsWith", "unknown"];
       *
       * @name matchBy
       * @ojshortdesc The ordered list of text filter matching behaviors to use when filtering data.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojSelectBase
       * @type {Array.<string>|null}
       * @ojsignature {target: "Type", value: "Array<TextFilter<D>['matchBy']>|null", jsdocOverride: true}
       * @default null
       * @since 16.0.2
       */
      matchBy: null
    },

    /**
     * Returns a jQuery object containing the element visually representing the Select.
     *
     * <p>This method does not accept any arguments.
     *
     * @memberof! oj.ojSelectBase
     * @instance
     * @public
     * @ignore
     * @return {jQuery} the Select
     */
    widget: function () {
      return $(this.OuterWrapper);
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     * @override
     */
    _ComponentCreate: function () {
      this._super();

      this._fullScreenPopup = Config.getDeviceRenderMode() === 'phone';
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     * @override
     */
    _AfterCreate: function () {
      this._super();

      this._initInputIdLabelForConnection(
        this._GetContentElement()[0],
        this.OuterWrapper.id,
        this.options.labelledBy
      );
    },

    /**
     * Returns if the element is a text field element or not.
     * @memberof oj.ojSelectBase
     * @instance
     * @protected
     * @return {boolean}
     */
    _IsTextFieldComponent: function () {
      return true;
    },

    /**
     * Returns the components wrapper under which label needs to be inserted in the inside strategy
     * For input number we need the label to go under the span so that it occupies the same width
     * as the input text giving way to the buttons.
     * @memberof oj.ojSelectBase
     * @instance
     * @protected
     * @override
     * @ignore
     * @return {Element|undefined}
     */
    _GetContentWrapper: function () {
      // return this._getRootElement().querySelector('.oj-text-field-middle');
      return this._lovMainField.getElement().querySelector('.oj-text-field-middle');
    },

    /**
     * If the dropdown is open and the afterToggle handler is called with focusout,
     * turn on the 'oj-focus' selector. This is needed for floating labels.  If focus
     * moves to the droplist, the label should be in the up position versus floating
     * down over the input on selection of a dropdown item.
     * @protected
     * @instance
     * @memberof! oj.ojSelectBase
     */
    _HandleAfterFocusToggle: function (element, eventType) {
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
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     * @override
     */
    _IsRequired: function () {
      return this.options.required;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _labelledByUpdatedForInputComp: ojeditablevalue.EditableValueUtils._labelledByUpdatedForInputComp,

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _initInputIdLabelForConnection: ojeditablevalue.EditableValueUtils._initInputIdLabelForConnection,
    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _linkLabelForInputComp: ojeditablevalue.EditableValueUtils._linkLabelForInputComp,

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
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _AfterSetOptionRequired: ojeditablevalue.EditableValueUtils._AfterSetOptionRequired,

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _refreshRequired: ojeditablevalue.EditableValueUtils._refreshRequired,

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _setTabIndex: ojeditablevalue.EditableValueUtils._setTabIndex,

    /**
     * Called to find out if aria-required is unsupported.
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _AriaRequiredUnsupported: function () {
      return false;
    },

    /**
     * Override to do the delay connect/disconnect
     * @memberof oj.ojSelectBase
     * @override
     * @protected
     */
    _VerifyConnectedForSetup: function () {
      //  - temp moving element from one parent to another should not cause fetch
      return true;
    },

    /**
     * Set the type of the input element based on virtualKeyboard option.
     * @param {Array.<string>} allowedTypes an array of allowed types
     * @memberof oj.ojSelectBase
     * @override
     * @protected
     */
    _SetInputType: ojeditablevalue.EditableValueUtils._SetInputType,

    /**
     * Returns the name of the component to be used in a style class.
     *
     * @return {string}
     * @memberof! oj.ojSelectBase
     * @protected
     */
    _GetStyleClassComponentName: function () {
      oj.Assert.failedInAbstractFunction();
      return '';
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _GetTemplateSlot: function (name) {
      var slots = ojcustomelementUtils.CustomElementUtils.getSlotMap(this.OuterWrapper);
      var namedSlot = slots[name];
      return namedSlot && namedSlot[0] && namedSlot[0].tagName === 'TEMPLATE' ? namedSlot[0] : null;
    },

    /**
     * Sets up resources for select
     *
     * @param {HTMLElement=} cachedMainFieldInputElem An optional HTML input element to be
     *                                                used for main field element
     *
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _SetupSelectResources: function (cachedMainFieldInputElem) {
      this._loadingIndicatorCount = 0;
      var OuterWrapper = this.OuterWrapper;
      // JET-32835 - SINGLESELECT'S INLINE MESSAGES IS SOMETIMES BELOW AND SOMETIMES ABOVE COMPONENT.
      // save existing child nodes so we can append them at the end of our internal DOM
      var childNodes = OuterWrapper.childNodes;
      var existingChildren = [];
      for (var i = 0; i < childNodes.length; i++) {
        existingChildren.push(childNodes[i]);
      }

      var options = this.options;

      // JET-60725 - Add option to specify the matchBy behavior of the text filter
      // Make a copy of the array to use internally so that the application can't mutate it;
      // they have to set a new array if they want to change it.
      this._matchBy =
        options.matchBy && options.matchBy.length > 0 ? [...options.matchBy] : undefined;

      this._wrapDataProviderIfNeeded(options.data);
      this._addDataProviderEventListeners();

      // need to initially apply virtualKeyboard option
      this._SetInputType(this._ALLOWED_INPUT_TYPES);

      // need to use 'self' for getTranslatedStringFunc because it's called using func.apply(), which
      // would override the 'this' binding
      var self = this;
      var getTranslatedStringFunc = function () {
        return self.getTranslatedString.apply(self, arguments);
      };
      var addBusyStateFunc = function (description) {
        return this._AddBusyState(description);
      }.bind(this);

      var elemId = OuterWrapper.getAttribute('id');
      if (!elemId) {
        elemId = 'oj-' + this._GetStyleClassComponentName() + '-' + LovUtils.nextUid();
        OuterWrapper.setAttribute('id', elemId);
      }
      //  - ojselect id attribute on oj-select-choice div is not meaningful
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
      this._showIndicatorDelay = showIndicatorDelay;

      var inputType = element.attr('type');
      var className = 'oj-searchselect';
      this._className = className;
      this._dropdownElemId = 'lovDropdown_' + idSuffix;

      this._initContainer(className, idSuffix, readonly);

      // Bug JET-35402 - help.instruction does not display after oj-select-single went from disabled
      // to enabled
      // Pass in the existing main field input element if it already exists.
      var outerWrapperAriaControls = OuterWrapper.getAttribute('aria-controls');
      var mainFieldAriaControls = outerWrapperAriaControls
        ? this._dropdownElemId + ' ' + outerWrapperAriaControls
        : this._dropdownElemId;
      var lovMainField = new LovMainField({
        className: className,
        ariaLabel: OuterWrapper.getAttribute('aria-label'),
        ariaControls: mainFieldAriaControls,
        componentId: elemId,
        inputType: inputType,
        enabled: lovEnabled,
        readOnly: readonly,
        placeholder: options.placeholder,
        addBusyStateFunc: addBusyStateFunc,
        forceReadOnly: this._fullScreenPopup,
        endContent: this._createMainFieldEndContent(lovEnabled, readonly),
        cachedMainFieldInputElement: cachedMainFieldInputElem,
        createOrUpdateReadonlyDivFunc: this._createOrUpdateReadonlyDiv.bind(this)
      });
      this._lovMainField = lovMainField;
      this._initLovMainField(lovMainField);

      var mainFieldElem = lovMainField.getElement();
      OuterWrapper.appendChild(mainFieldElem);

      var filterInputText = this._createFilterInputText(className, idSuffix);
      if (!this._fullScreenPopup) {
        filterInputText.style.visibility = 'hidden';
        OuterWrapper.appendChild(filterInputText);
      }
      this._filterInputText = filterInputText;

      var lovDropdown = this._CreateLovDropdown();
      // defer initialization of dropdown until we open it
      this._initLovDropdownFunc = function (afterInitFunc) {
        var afterDropdownInitFunc = function (resultsElem) {
          if (this._fullScreenPopup) {
            filterInputText.setAttribute('aria-controls', resultsElem.id);

            var dropdownFilterBusyContext = Context.getContext(filterInputText).getBusyContext();
            dropdownFilterBusyContext.whenReady().then(function () {
              if (afterInitFunc) {
                afterInitFunc();
              }
            });
          } else if (afterInitFunc) {
            afterInitFunc();
          }
        }.bind(this);
        this._initLovDropdown(
          idSuffix,
          inputType,
          elemId,
          getTranslatedStringFunc,
          addBusyStateFunc,
          afterDropdownInitFunc
        );

        var dropdownElem = lovDropdown.getElement();
        OuterWrapper.appendChild(dropdownElem);
        dropdownElem.addEventListener('lovDropdownEvent', this._handleLovDropdownEvent.bind(this));
        if (!this._fullScreenPopup) {
          dropdownElem.addEventListener(
            'mousedown',
            function () {
              this._mousedownOnDropdown = true;
            }.bind(this)
          );
        }
      }.bind(this);
      this._lovDropdown = lovDropdown;
      // this._initLovDropdownOld(lovDropdown, className);

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
        setFilterFieldTextFunc: this._SetFilterFieldText.bind(this),
        setUiLoadingStateFunc: this._setUiLoadingState.bind(this),
        isValueForPlaceholderFunc: this._IsValueForPlaceholder.bind(this),
        isShowValueInFilterFieldFunc: this._IsShowValueInFilterField.bind(this),
        getFilterInputElemFunc: this._getFilterInputElem.bind(this),
        matchBy: this._matchBy
      });
      this._abstractLovBase = abstractLovBase;

      // swap main field container for the element
      element.hide().attr('aria-hidden', true);

      // JET-46247 - Acc: described-by resets after changing the data provider
      // if we're refreshing, restore aria-describedby on the input
      if (cachedMainFieldInputElem) {
        // set describedby on the element as aria-describedby
        var describedBy = this.options.describedBy;
        if (describedBy) {
          this._describedByUpdated(null, describedBy);
        }
      }

      this._refreshRequired(options.required);

      // JET-46247 - Acc: described-by resets after changing the data provider
      // reconnect the input and label
      this._initInputIdLabelForConnection(
        this._GetContentElement()[0],
        OuterWrapper.id,
        this.options.labelledBy
      );

      this._updateLabel();

      // JET-45967 - tabindex does not propagate for select-single
      // transfer tabindex from hidden initnode input to appropriate inner DOM elements
      this._setTabIndex(element[0], lovMainField.getInputElem());
      if (readonly) {
        var readonlyElem = this._getReadonlyDiv();
        if (readonlyElem) {
          this._setTabIndex(element[0], readonlyElem);
        }
      }

      // JET-32835 - SINGLESELECT'S INLINE MESSAGES IS SOMETIMES BELOW AND SOMETIMES ABOVE COMPONENT.
      // append pre-existing child nodes at the end of our internal DOM
      for (var j = 0; j < existingChildren.length; j++) {
        OuterWrapper.appendChild(existingChildren[j]);
      }

      this._SetupInitialValue();
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _AddBusyState: function (description, elem) {
      var busyElem = elem || this.OuterWrapper;
      var busyStateResolve = LovUtils.addBusyState(busyElem, description);

      // JET-42413: while we're processing a value change, keep track of newly added busy states so
      // that we can wait until they resolve before processing any new changes
      if (this._makingInternalValueChange) {
        var promiseResolve = this._chainInternalValueChangePromise();
        var newResolveFunc = function () {
          busyStateResolve();
          promiseResolve();
        };
        return newResolveFunc;
      }

      return busyStateResolve;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _StartMakingInternalValueChange: function () {
      // JET-42413: set flag while we're processing a value change so that if an app makes
      // changes to the component from within the change listener, we can defer processing the
      // new change until after we're done processing the current change

      // get the current stored promise, if there is one
      var storedPromise = this._makingInternalValueChangePromise;

      // chain a new promise
      var promiseResolve = this._chainInternalValueChangePromise();

      // toggle the flag
      this._makingInternalValueChange = true;

      // if there wasn't already a stored promise, queue the very first deferred operation,
      // which will be to clear the flags
      if (!storedPromise) {
        this._queueValueChangeDeferredCallback(
          function () {
            this._makingInternalValueChange = false;
            this._makingInternalValueChangePromise = null;
            this._deferredMakingInternalValueChangeQueueCallback = null;
          }.bind(this)
        );
      }

      return promiseResolve;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _chainInternalValueChangePromise: function () {
      // JET-42413: set flag while we're processing a value change so that if an app makes
      // changes to the component from within the change listener, we can defer processing the
      // new change until after we're done processing the current change

      var promiseResolve = null;
      var promise = new Promise(function (resolve) {
        promiseResolve = resolve;
      });
      var busyStateResolve = LovUtils.addBusyState(this.OuterWrapper, 'Processing value change');
      // resolve busy state regardless of whether promise was resolved or rejected
      promise.then(busyStateResolve, busyStateResolve);

      var storedPromise = promise;
      if (this._makingInternalValueChangePromise) {
        // if we've already saved a promise, then wait until the saved one and the new one are
        // both resolved
        storedPromise = Promise.all([this._makingInternalValueChangePromise, promise]);
      }

      // check whether we need to execute the queue when the promise resolves
      var runQueueFunc = function () {
        // only execute the queued callbacks when this promise is the same as the latest one
        // that was saved
        if (storedPromise === this._makingInternalValueChangePromise) {
          this._deferredMakingInternalValueChangeQueueCallback();
        }
      }.bind(this);
      // run queue to resolve busy states regardless of whether promise was resolved or rejected
      storedPromise.then(runQueueFunc, runQueueFunc);

      // save the promise
      this._makingInternalValueChangePromise = storedPromise;

      return promiseResolve;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _queueValueChangeDeferredCallback: function (callback) {
      // JET-42413: while we're processing a value change, queue new changes to be processed later
      var busyStateResolve = LovUtils.addBusyState(
        this.OuterWrapper,
        'queueing deferred callback while making value change'
      );
      var currentQueueCallback = this._deferredMakingInternalValueChangeQueueCallback;
      var queuedCallback = function () {
        // wrap in try..finally so that busy state always gets resolved
        try {
          if (currentQueueCallback) {
            currentQueueCallback();
          }
          callback();
        } finally {
          busyStateResolve();
        }
      };
      this._deferredMakingInternalValueChangeQueueCallback = queuedCallback;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _SetupInitialValue: function () {
      oj.Assert.failedInAbstractFunction();
    },

    /**
     * Releases the resources created for select
     *
     * @param {boolean} shouldRetainMainFieldElem A flag to indicate if the main field
     *                                            element should be reatined
     *
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _ReleaseSelectResources: function (shouldRetainMainFieldElem) {
      // call to stop loading at least once to clear out an existing timer
      for (var i = this._loadingIndicatorCount; i >= 0; i--) {
        this._setUiLoadingState('stop');
      }
      this._loadingIndicatorCount = 0;
      this._savedLoadingIndicator = false;

      this._mousedownOnDropdown = false;
      this._deferredSetDisplayValue = null;

      // JET-44965 - SELECT SINGLE LOSING FOCUS LOST
      // only clear the focus timer if the component has been disconnected, because we still
      // want it to work if the component is just being refreshed
      if (this._bReleasedResources) {
        this._clearMainFieldFocusHandlerTimer();
      }

      $(this._filterInputText).remove();
      // If we will be reinserting the lov main field's input element
      // detach the element from the lov main field container to
      // retain all the data it holds before destroying the container
      if (shouldRetainMainFieldElem) {
        $(this._lovMainField.getInputElem()).detach();
        // Clean up the input element from all the previously set attributes
        this._cleanUpMainFieldInputElement();
        // Remove the event listeners assigned by us, as they will be added again when
        // the element is reattached.
        $(this._lovMainField.getInputElem()).off(this._lovMainFieldInputEventListeners);
      }
      $(this._lovMainField.getElement()).remove();
      $(this._liveRegion).remove();

      this._abstractLovBase.destroy();
      // only need to destroy dropdown if it was initialized
      if (this._lovDropdown.getElement()) {
        $(this._lovDropdown.getElement()).remove();
        this._lovDropdown.destroy();
      }

      var OuterWrapper = this.OuterWrapper;
      // need to remove classes one by one because IE11 doesn't support passing multiple
      // arguments to a single remove() call
      var owClassList = OuterWrapper.classList;
      owClassList.remove(this._className);
      owClassList.remove('oj-form-control');
      owClassList.remove('oj-component');
      owClassList.remove('oj-read-only');
      owClassList.remove('oj-enabled');
      owClassList.remove('oj-disabled');
      $(OuterWrapper)
        .off('change', '.' + this._className + '-input', LovUtils.stopEventPropagation)
        .off(this._containerEventListeners);
      this._containerEventListeners = null;

      this.element.removeAttr('aria-hidden').show();

      this._removeDataProviderEventListeners();
      this._wrappedDataProvider = null;

      this._liveRegion = null;
      this._abstractLovBase = null;
      this._lovMainField = null;
      this._filterInputText = null;
      this._lovDropdown = null;
    },

    /**
     * Cleans up the main field input element for reuse. This removes all the attributes
     * set by us on the main field input element.
     *
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _cleanUpMainFieldInputElement: function () {
      var mainFieldInputElem = this._lovMainField.getInputElem();
      // TODO: IE 11 does not support Element.attributes which is what we will
      // be relying on for other browsers. Once, we stop supporting IE 11
      // clean up this part
      var agentInfo = oj.AgentUtils.getAgentInfo();
      if (agentInfo.browser === oj.AgentUtils.BROWSER.IE) {
        // Clean up attributes set during the initialization of lovMainField
        // See LovMainField._createInnerDom for the attributes set
        // It is enough to remove the attributes that are conditionally set
        mainFieldInputElem.removeAttribute('readonly');
        mainFieldInputElem.removeAttribute('role');
        mainFieldInputElem.removeAttribute('type');

        // Remove all the aria attributes set by us
        // See ojSelect._updateLabel method for the attributes set
        mainFieldInputElem.removeAttribute('aria-controls');
        mainFieldInputElem.removeAttribute('aria-expanded');
        mainFieldInputElem.removeAttribute('aria-label');
        mainFieldInputElem.removeAttribute('aria-labelledby');
      } else if (mainFieldInputElem.hasAttributes()) {
        // Loop through all the attributes and remove them
        var attrs = mainFieldInputElem.attributes;
        var attrName;
        for (var i = attrs.length - 1; i >= 0; i--) {
          attrName = attrs[i].name;
          LovUtils.removeAttribute(mainFieldInputElem, attrName);
        }
      }

      // value will not be in the attributes collection, so reset it separately
      mainFieldInputElem.value = '';
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _updateLabel: function () {
      var options = this.options;
      var lovMainField = this._lovMainField;
      var lovDropdown = this._lovDropdown;
      var filterInputText = this._filterInputText;

      var labelId;
      if (options.labelledBy) {
        labelId = options.labelledBy;
      }

      // element.attr('aria-labelledby', labelId);

      //  - oghag missing label for ojselect and ojcombobox
      var labelText;
      var alabel = this.OuterWrapper.getAttribute('aria-label');
      if (alabel) {
        labelText = alabel;
      }

      lovDropdown.updateLabel(labelId, labelText);
      lovMainField.updateLabel(labelId, labelText);

      if (labelId) {
        filterInputText.setAttribute('labelled-by', labelId);
        // The attribute value only can be removed by setting it to an empty string
        filterInputText.setAttribute('aria-label', '');
      } else if (labelText) {
        filterInputText.setAttribute('aria-label', labelText);
        // The attribute value only can be removed by setting it to an empty string
        filterInputText.setAttribute('labelled-by', '');
      }

      // JET-39385 - SELECT SINGLE HAS NO OPTION TO SET TITLE IN MOBILE SEARCH
      // set the component's label-hint as the mobile search field label
      // (don't use the text of an external label because: 1) multiple controls could be labelled
      // by it, and 2) in non-ko environments, the label may not have been been rendered by now)
      if (this._fullScreenPopup) {
        // only affect label-hint attribute if on mobile;  otherwise there are several unit test
        // failures because we're setting label-hint to ''
        if (options.labelHint) {
          filterInputText.setAttribute('label-hint', options.labelHint);
          filterInputText.setAttribute('label-edge', 'inside');
          filterInputText.setAttribute('labelled-by', '');
        } else {
          filterInputText.setAttribute('label-hint', '');
        }
      }
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _UpdateItemText: function () {
      // JET-45922 - timing issue with select-single: lov drop-down doesn't have element
      // do a granular update if item-text changes instead of a general refresh
      this._lovDropdown.updateItemTextRendererFunc(this._ItemTextRenderer.bind(this));
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _initContainer: function (className, idSuffix, readonly) {
      var elem = this.OuterWrapper;
      var $elem = $(elem);

      // need to add classes one by one because IE11 doesn't support passing multiple
      // arguments to a single add() call
      var elemClassList = elem.classList;
      elemClassList.add(className);
      elemClassList.add('oj-form-control');
      elemClassList.add('oj-component');
      if (!readonly) {
        elemClassList.add(this._lovEnabled ? 'oj-enabled' : 'oj-disabled');
      } else {
        elemClassList.add('oj-read-only');
      }
      if (this._fullScreenPopup) {
        // elemClassList.add('oj-searchselect-fullscreen');
        elemClassList.add('oj-searchselect-mobile');
      } else {
        // elemClassList.remove('oj-searchselect-fullscreen');
        elemClassList.remove('oj-searchselect-mobile');
      }

      this._toggleNoValueStyleClass();

      var liveRegion = document.createElement('div');
      liveRegion.setAttribute('id', 'oj-listbox-live-' + idSuffix);
      liveRegion.setAttribute('class', 'oj-helper-hidden-accessible oj-listbox-liveregion');
      liveRegion.setAttribute('aria-live', 'polite');
      elem.appendChild(liveRegion);

      // do not propagate change event from the search field out of the component
      $elem.on('change', '.' + className + '-input', LovUtils.stopEventPropagation);

      this._containerEventListeners = {
        // JET-48083 - clicking help-hints.source link does nothing
        // Do not kill events originating from user-assistance-container
        click: LovUtils.killEventWithAncestorExceptions.bind(null, [
          '.oj-user-assistance-inline-container'
        ]),
        // keyup: function (event) {
        //   if (event.keyCode === 10 || event.keyCode === 13) {
        //     $elem.removeClass('oj-focus');
        //   }
        // },
        keydown: this._handleContainerKeyDown.bind(this),
        mouseup: function () {
          $elem.removeClass('oj-active');
        }
      };
      $elem.on(this._containerEventListeners);

      this._liveRegion = liveRegion;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _toggleNoValueStyleClass: function () {
      var classList = this.OuterWrapper.classList;
      if (this._IsValueForPlaceholder(this.options.value)) {
        classList.add('oj-searchselect-no-value');
      } else {
        classList.remove('oj-searchselect-no-value');
      }
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _SetFilterFieldText: function (text) {
      this._ignoreFilterFieldRawValueChanged = true;

      this._filterInputText.value = text;
      // if the filter field is in the mobile dropdown and the dropdown is not currently in
      // the DOM, remove any oj-label elems from the field before refreshing because the
      // refresh will not be able to find them to remove them and will simply add a new
      // oj-label elem, resulting in multiple duplicate label elems
      if (this._fullScreenPopup) {
        var dropdownElem = this._lovDropdown.getElement();
        if (!dropdownElem.parentElement) {
          var $filterInputElemLabels = $(this._filterInputText).find('oj-label');
          $filterInputElemLabels.remove();
        }
      }
      // if the value is same and focus stays in the field, the rawValue will not be updated.
      // So, the filter text has to be refreshed to reflect the changes.
      if (this._filterInputText) {
        // JET-42413: don't try to refresh the oj-input-text if it hasn't been upgraded yet due
        // to an LOV refresh
        var busyContext = Context.getContext(this._filterInputText).getBusyContext();
        if (busyContext.isReady()) {
          this._filterInputText.refresh();
        }
      }

      this._ignoreFilterFieldRawValueChanged = false;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _IsShowValueInFilterField: function () {
      return false;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _ShowFilterField: function (preserveState) {
      if (this._fullScreenPopup) {
        return;
      }

      var filterInputText = this._filterInputText;
      if (filterInputText.style.visibility === 'hidden') {
        var lovMainField = this._lovMainField;
        var mainInputElem = lovMainField.getInputElem();
        if (!preserveState) {
          var filterFieldText = this._IsShowValueInFilterField() ? mainInputElem.value : '';
          this._SetFilterFieldText(filterFieldText);

          LovUtils.copyAttribute(mainInputElem, 'aria-describedby', filterInputText, 'described-by');
        }

        // TODO: figure out how to do this through oj-input-text API
        var filterInputElem = this._getFilterInputElem();
        if (filterInputElem) {
          filterInputElem.setAttribute('role', 'combobox');

          LovUtils.copyAttribute(mainInputElem, 'aria-controls', filterInputElem, 'aria-controls');
          LovUtils.copyAttribute(mainInputElem, 'aria-expanded', filterInputElem, 'aria-expanded');

          if (!preserveState) {
            LovUtils.copyAttribute(mainInputElem, 'aria-required', filterInputElem, 'aria-required');
            LovUtils.copyAttribute(mainInputElem, 'aria-invalid', filterInputElem, 'aria-invalid');
          }
        }

        lovMainField.getInputElem().style.visibility = 'hidden';
        filterInputText.style.visibility = '';
        this.OuterWrapper.appendChild(filterInputText);
      }
      if (!preserveState) {
        //  - help.instruction text not always shown
        // in IE11, defer focusing the filter field so that the help.instruction text has time to show
        var agentInfo = oj.AgentUtils.getAgentInfo();
        if (agentInfo.browser === oj.AgentUtils.BROWSER.IE) {
          var resolveBusyContext = this._AddBusyState('Select transferring focus to filter field');
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
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _showMainField: function () {
      if (this._fullScreenPopup) {
        return;
      }

      var filterInputText = this._filterInputText;
      if (filterInputText.style.visibility !== 'hidden') {
        var mainInputElem = this._lovMainField.getInputElem();

        // JET-34889 - WHEN OJ-SELECT-SINGLE GETS FOCUS, SELECT THE INPUT TEXT TO ALLOW
        // TYPING WITHOUT CLEARING FIRST
        // reset the selection range to put the cursor at the end of the text
        // (Without this, all or part of the old selection gets maintained.
        // One example is if you tab into the field the first time, all the text gets highlighted.
        // If you then click outside somewhere, and then click on the dropdown arrow to open the
        // dropdown, all the text is still highlighted instead of the cursor being at the end of the
        // field.
        // Another example is if you tab into the field the first time, then click outside, and then
        // click on the text to open the dropdown, all the text from the start to where you clicked
        // is highlighted instead of the cursor just being where you clicked.)
        // JET-40032 - SELECT SINGLE - TRAILING PART SHOWN ON LOW WIDTH INPUT FIELD - FIREFOX
        // We used to set (1000000, 1000000), but that resulted in the end of long text being
        // shown in Firefox instead of the beginning.
        mainInputElem.setSelectionRange(0, 0);

        mainInputElem.style.visibility = '';
        filterInputText.style.visibility = 'hidden';
      }
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _IsFilterInputTextCleared: function () {
      var filterInputText = this._filterInputText;
      var searchText = filterInputText.rawValue;
      return searchText == null || searchText === '';
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _handleContainerKeyDown: function (event) {
      if (!this._lovEnabled || this.options.readOnly) {
        return;
      }

      // ignore control key and function key
      if (LovUtils.isControlOrFunctionKey(event)) {
        return;
      }

      // JET-44374 - qunit combobox ojselect tests fail with new jquery 3.6.0
      // e.which no longer gets populated when simulating events with keyCode specified, so
      // check both properties on the event
      var keyCode = event.which || event.keyCode;
      if (keyCode === LovUtils.KEYS.PAGE_UP || keyCode === LovUtils.KEYS.PAGE_DOWN) {
        // prevent the page from scrolling
        event.preventDefault();
        return;
      }

      var abstractLovBase = this._abstractLovBase;
      var lovDropdown = this._lovDropdown;
      var outerWrapper = this.OuterWrapper;

      switch (keyCode) {
        case LovUtils.KEYS.UP:
        case LovUtils.KEYS.DOWN:
          if (abstractLovBase.isDropdownOpen()) {
            // lovDropdown.transferHighlight((keyCode === LovUtils.KEYS.UP) ? -1 : 1);
            lovDropdown.focus().then(function () {
              // keep oj-focus on root so that inside label is still shifted up and field looks focused
              // while dropdown is open.
              // And since we are dealing with asynchronism here, make sure if the focus is still in the
              // dropdown.
              const dropdownElement = lovDropdown.getElement();
              if (dropdownElement && dropdownElement.contains(document.activeElement)) {
                outerWrapper.classList.add('oj-focus');
              }
            });

            // if tabbing into dropdown, continue showing filter field as it was before tabbing
            //  - ie11: filter field hidden when you arrow into dropdown
            // in IE11, defer showing filter field until after focus transfer into dropdown has
            // happened
            var agentInfo = oj.AgentUtils.getAgentInfo();
            if (agentInfo.browser === oj.AgentUtils.BROWSER.IE) {
              var resolveBusyContext = this._AddBusyState(
                'Select showing filter field while arrowing into dropdown'
              );
              // prettier-ignore
              setTimeout( // @HTMLUpdateOK
                function () {
                  this._ShowFilterField(true);
                  resolveBusyContext();
                }.bind(this),
                0
              );
            } else {
              this._ShowFilterField(true);
            }
          } else {
            this._openDropdown();
            // if opening dropdown just after selecting an item, when main field selection elem is
            // focused, then focus main input field so that filter field gets shown
            // if (!this._fullScreenPopup) {
            //   $(this._lovMainField.getInputElem()).focus();
            // }
          }
          //  - select and combobox stop keyboard event propegation
          event.preventDefault();
          break;

        case LovUtils.KEYS.ENTER:
          // lovDropdown.activateHighlightedElem();
          //  - select and combobox stop keyboard event propegation
          event.preventDefault();

          this._HandleContainerKeyDownEnter(event);
          break;

        case LovUtils.KEYS.TAB:
          this._HandleContainerKeyDownTab(event);
          break;

        case LovUtils.KEYS.ESC:
          if (abstractLovBase.isDropdownOpen()) {
            abstractLovBase.cancel();
            // prevent the page from scrolling
            event.preventDefault();
          }
          break;

        default:
          break;
      }
    },

    /**
     * Handle Enter key down on the container.
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _HandleContainerKeyDownEnter: function (event) {
      oj.Assert.failedInAbstractFunction();
    },

    /**
     * Handle Tab key down on the container.
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _HandleContainerKeyDownTab: function (event) {
      oj.Assert.failedInAbstractFunction();
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _handleContainerMouseDown: function (event) {
      var abstractLovBase = this._abstractLovBase;
      this._mousedownOnDropdown = false;

      // prevent user from focusing on disabled select
      if (!this._lovEnabled) {
        event.preventDefault();
      }

      // if select box gets focus ring via keyboard event previously, clear it now
      // $(this._lovMainField.getSelectionElem()).removeClass('oj-focus-highlight');

      var OuterWrapper = this.OuterWrapper;
      var $OuterWrapper = $(OuterWrapper);

      // only open dropdown on left (main) button click
      var mainButton = event.button === 0;
      var skipPreventDefault = false;

      var mainInputElem = this._lovMainField.getInputElem();

      if (mainButton && !this.options.readOnly) {
        if (this._fullScreenPopup) {
          var clearValueElem = OuterWrapper.querySelector('.oj-searchselect-clear-value');
          if (clearValueElem && DomUtils.isAncestorOrSelf(clearValueElem, event.target)) {
            return;
          }
        }

        if (this._lovEnabled) {
          if (!abstractLovBase.isDropdownOpen()) {
            // JET-40032 - SELECT SINGLE - TRAILING PART SHOWN ON LOW WIDTH INPUT FIELD - FIREFOX
            // if clicking the dropdown icon, move the cursor to the end of the text (otherwise it
            // may remain at the beginning)
            var mainFieldElem = this._lovMainField.getElement();
            var mainDropdownIcon = mainFieldElem.querySelector('.oj-searchselect-arrow');
            var clickedMainIcon = DomUtils.isAncestorOrSelf(mainDropdownIcon, event.target);
            if (!this._fullScreenPopup && clickedMainIcon) {
              mainInputElem.setSelectionRange(1000000, 1000000);
            }
            this._openDropdown();
            // prevent the focus from moving back or to whatever happens to be under the mouse/touch
            // point when the dropdown opens
            if (this._fullScreenPopup) {
              event.preventDefault();
            }
          } else if (!this._fullScreenPopup && abstractLovBase.isDropdownOpen()) {
            // JET-38253 - OJ-SELECT-SINGLE POPUP DOES NOT GO AWAY AFTER CLICKING EXPAND WIDGET
            // if the dropdown is open on desktop, clicking on the dropdown arrow should close it
            var filterDropdownIcon = this._filterInputText.querySelector('.oj-searchselect-arrow');
            if (DomUtils.isAncestorOrSelf(filterDropdownIcon, event.target)) {
              this._CloseDropdown();
            }
          }
        }
      }

      $OuterWrapper.addClass('oj-active');

      if (mainButton) {
        if (!this._fullScreenPopup && this._lovEnabled) {
          var filterInputElem = this._getFilterInputElem();
          //  - help.instruction text not always shown
          // if the filter field is hidden, focus the main field instead of directly showing the
          // filter field so that help.instruction text will be shown
          // if the filter field is already shown, call _ShowFilterField directly anyway to do
          // whatever other processing it needs to do, because the main input elem is hidden and
          // can't receive focus
          if (this._filterInputText.style.visibility === 'hidden') {
            // don't call preventDefault() because it prevents the cursor from moving to where
            // the mouse was clicked
            // JET-40451 - oj-select-single inside oj-table: dropdown immediately closes when
            // clicking arrow
            // only skip calling preventDefault() if the event target is an input element, otherwise
            // we do want to prevent default so that the containing component, like oj-table, doesn't
            // grab focus and cause the dropdown to immediately close
            if (event.target === filterInputElem || event.target === mainInputElem) {
              skipPreventDefault = true;
            }
            mainInputElem.focus();
          } else if (!this.options.readOnly) {
            // don't call preventDefault() because it prevents the cursor from moving to where
            // the mouse was clicked when inside the filter input, but if the click was outside
            // the filter input (for example over the dropdown arrow), then we do want to call
            // preventDefault() so that the filter input doesn't lose focus
            if (event.target === filterInputElem) {
              skipPreventDefault = true;
            }
            this._ShowFilterField();
          }
        }

        //  - clicking on component does not always focus input
        // prevent focus from transferring back
        if (!skipPreventDefault) {
          // JET-31848 - MOVING THE CURSOR BY CLICKING ON THE INPUT FIELD TOGGLES THE DROPDOWN
          // don't call preventDefault(), otherwise clicking in the field doesn't move the cursor
          event.preventDefault();
        }
      }
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _handleLovDropdownEvent: function (event) {
      var detail = event.detail;
      var abstractLovBase = this._abstractLovBase;
      if (!abstractLovBase) {
        return;
      }
      // var lovMainField = this._lovMainField;
      switch (detail.subtype) {
        case 'closeDropdown':
          this._mousedownOnDropdown = false;
          if (detail.trigger === 'escKeyDown') {
            this._filterInputText.focus();
          } else if (detail.trigger === 'clickAway') {
            // JET-40375 - SELECT SINGLE - DEFAULTED VALUE OVERRIDES USER INPUT
            // clear flag that the user has typed filter text so that we can override it when setting
            // the selected label
            this._userHasTypedFilterText = false;

            // explicitly show main field again in case focus is in the dropdown
            this._showMainField();
            this.OuterWrapper.classList.remove('oj-focus');
          }
          this._CloseDropdown();
          break;
        case 'tabOut':
          this._HandleLovDropdownEventTabOut(event);
          break;
        case 'sizeDropdown':
          abstractLovBase.sizeDropdown();
          break;
        case 'adjustDropdownPosition':
          //  - oj-select-single stays sticky when scrolled outside the drop down
          // need to position popup again before adjusting its position
          var position = abstractLovBase.getDropdownPosition();
          if (this._fullScreenPopup) {
            $(detail.popupElem).position(position);
          } else {
            // JET-34367 - remove code to update popup position on refresh
            // Position the proxy element instead of the real dropdown so that we don't have to
            // change the size of the dropdown before calculating the position, because changing
            // the size of the dropdown here may reset the results' scroll position and prevent the
            // user from scrolling down.
            var proxyElem = detail.positioningProxyElem;
            var proxyResultsElem = $(proxyElem).find('.oj-select-results')[0];
            var $popupElem = $(detail.popupElem);
            var $resultsElem = $popupElem.find('.oj-select-results');
            // size the proxy elem width the same as the dropdown width
            proxyElem.style.width = '' + $popupElem.outerWidth() + 'px';
            // size the proxy results elem height the same as the dropdown results max-height
            proxyResultsElem.style.height = $resultsElem.css('max-height');
            $(proxyElem).position(position);
          }
          break;
        case 'openPopup':
          var psOptions = detail.psOptions;
          psOptions[oj.PopupService.OPTION.LAUNCHER] = this.element;
          psOptions[oj.PopupService.OPTION.POSITION] = abstractLovBase.getDropdownPosition();
          oj.PopupService.getInstance().open(psOptions);
          break;
        case 'handleSelection':
          this._HandleLovDropdownEventSelection(event);
          break;
        case 'dropdownClosed':
          this._HandleLovDropdownClosed(event);
          break;
        default:
          break;
      }
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _HandleLovDropdownClosed: function (event) {
      //  - LIST FILTERED ON SELECTED ITEM WHEN IT PROBABLY SHOULDN'T BE
      // clear the stored value when the dropdown closes
      this._searchTextOnKeyDown = undefined;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _HandleLovDropdownEventTabOut: function (event) {
      oj.Assert.failedInAbstractFunction();
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _HandleLovDropdownEventSelection: function (event) {
      oj.Assert.failedInAbstractFunction();
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _CloseDropdown: function () {
      this._mousedownOnDropdown = false;
      // only need to do anything if dropdown had been initialized
      var dropdownElem = this._lovDropdown.getElement();
      if (dropdownElem != null) {
        // JET-37797 - can't close dropdown while list is loading
        // explicitly blur the focused element in the dropdown before closing it
        var activeElem = document.activeElement;
        if (activeElem && DomUtils.isAncestor(dropdownElem, activeElem)) {
          activeElem.blur();
        }

        //  - edge, safari: kb focus transfer only works the first time
        // JET-35346 - Multiple select2 qunit tests fail on Mac using different browsers for master
        // branch
        // let the listView in the dropdown handle the blur event before closing the dropdown
        this._abstractLovBase.closeDropdown();
      }
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _createMainFieldEndContent: function (enabled, readonly) {
      var span = document.createElement('span');
      span.setAttribute('class', 'oj-text-field-end');

      var dropdownIcon = this._createDropdownIcon(enabled, readonly);
      span.appendChild(dropdownIcon);

      if (this._fullScreenPopup) {
        var clearValueIcon = this._createClearValueIcon();
        span.appendChild(clearValueIcon);
      }

      return span;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _createDropdownIcon: function (enabled, readonly) {
      var className = this._className;

      var span = document.createElement('span');
      var styleClasses =
        className +
        '-arrow ' +
        className +
        '-open-icon ' +
        className +
        '-icon oj-component-icon oj-clickable-icon-nocontext';
      if (!readonly && !enabled) {
        styleClasses += ' oj-disabled';
      }
      span.setAttribute('class', styleClasses);
      span.setAttribute('aria-hidden', 'true');

      return span;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _createClearValueIcon: function () {
      var className = this._className;

      var a = document.createElement('a');
      var styleClasses =
        className +
        '-clear-value ' +
        className +
        '-clear-value-icon ' +
        className +
        '-icon oj-component-icon oj-clickable-icon-nocontext';
      a.setAttribute('class', styleClasses);
      a.setAttribute('role', 'button');
      var strClear = this.getTranslatedString('labelAccClearValue');
      a.setAttribute('aria-label', strClear);

      a.addEventListener('click', this._HandleClearValueIconClick.bind(this));

      return a;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _HandleClearValueIconClick: function () {
      oj.Assert.failedInAbstractFunction();
    },

    /**
     * Called when the filter field is blurred.
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _HandleFilterFieldBlur: function () {
      oj.Assert.failedInAbstractFunction();
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _GetDefaultValueItemForPlaceholder: function () {
      oj.Assert.failedInAbstractFunction();
      return null;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _initLovMainField: function (lovMainField) {
      this._lovMainFieldInputEventListeners = {
        focus: function (event) {
          LovUtils.killEvent(event);
          if (!this._fullScreenPopup && !this.options.readOnly) {
            // JET-34889 - WHEN OJ-SELECT-SINGLE GETS FOCUS, SELECT THE INPUT TEXT TO ALLOW TYPING
            // WITHOUT CLEARING FIRST
            // set a timer to handle the focus so that the main input has the correct selection range
            // and we can transfer it from the main input to the filter input
            // (Trying to listen to the main input 'select' event for this instead of using a timer
            // doesn't seem to work. Clicking on the dropdown arrow doesn't show a cursor at the end
            // of the text. Maybe it only works when there's a range involved, not just moving the
            // cursor.)
            this._clearMainFieldFocusHandlerTimer();
            var resolveBusyContext = this._AddBusyState(
              'Select showing filter field after focusing main field'
            );
            this._mainFieldFocusHandlerTimer = TimerUtils.getTimer(0);

            // JET-44965 - SELECT SINGLE LOSING FOCUS LOST
            // save the selection range now, because the component could be refreshed before
            // the focus timer promise resolves
            var mainInputElem = this._lovMainField.getInputElem();
            var selectionRange = {
              selectionStart: mainInputElem.selectionStart,
              selectionEnd: mainInputElem.selectionEnd,
              selectionDirection: mainInputElem.selectionDirection
            };

            this._mainFieldFocusHandlerTimer.getPromise().then(
              function (pending) {
                // only act on the timer if it hasn't been cleared
                if (pending) {
                  this._mainFieldFocusHandlerTimer = null;
                  this._ShowFilterField();
                  // JET-45389 - if this is the same input elem as before the timer fired, get its
                  // current selection range now that it has had time to process getting focus
                  var currMainInputElem = this._lovMainField.getInputElem();
                  if (mainInputElem === currMainInputElem) {
                    selectionRange = {
                      selectionStart: mainInputElem.selectionStart,
                      selectionEnd: mainInputElem.selectionEnd,
                      selectionDirection: mainInputElem.selectionDirection
                    };
                  }
                  // JET-34889 - WHEN OJ-SELECT-SINGLE GETS FOCUS, SELECT THE INPUT TEXT TO ALLOW
                  // TYPING WITHOUT CLEARING FIRST
                  // transfer the selection range from the main input to the filter input
                  var filterInputElem = this._getFilterInputElem();
                  if (filterInputElem) {
                    filterInputElem.setSelectionRange(
                      selectionRange.selectionStart,
                      selectionRange.selectionEnd,
                      selectionRange.selectionDirection
                    );
                  }
                }
                resolveBusyContext();
              }.bind(this)
            );
          }
        }.bind(this)
      };
      $(lovMainField.getInputElem()).on(this._lovMainFieldInputEventListeners);

      // assign event listeners
      $(lovMainField.getElement()).on({
        mousedown: this._handleContainerMouseDown.bind(this)
      });
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _clearMainFieldFocusHandlerTimer: function () {
      if (this._mainFieldFocusHandlerTimer) {
        this._mainFieldFocusHandlerTimer.clear();
        this._mainFieldFocusHandlerTimer = null;
      }
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _getFilterInputElem: function () {
      var $filterInputElem = $(this._filterInputText).find('input');
      if ($filterInputElem.length > 0) {
        return $filterInputElem[0];
      }
      return null;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _createFilterInputText: function (className, idSuffix) {
      var ariaLabel = this.OuterWrapper.getAttribute('aria-label');
      var options = this.options;

      var filterInputText = document.createElement('oj-input-text');
      filterInputText.setAttribute('display-options.messages', 'none');
      filterInputText.setAttribute('user-assistance-density', 'compact');
      filterInputText.setAttribute('id', className + '-filter-' + idSuffix);
      filterInputText.setAttribute('class', className + '-filter');
      filterInputText.setAttribute('clear-icon', this._fullScreenPopup ? 'conditional' : 'never');
      // JET-37990 - oj-select-single: autocomplete is not disabled in chrome browser
      // Chrome used to ignore "off" value, but as of Chrome 81 it works more reliably
      // (https://stackoverflow.com/questions/57367813/2019-chrome-76-approach-to-autocomplete-off)
      filterInputText.setAttribute('autocomplete', 'off');
      filterInputText.setAttribute('aria-autocomplete', 'list');
      filterInputText.setAttribute('data-oj-internal', '');
      filterInputText.setAttribute('data-oj-context', '');
      filterInputText.setAttribute('data-oj-binding-provider', 'none');
      if (options.placeholder) {
        filterInputText.setAttribute('placeholder', options.placeholder);
      }
      // disable the oj-input-text when oj-select-single is disabled
      filterInputText.setAttribute('disabled', options.disabled);
      // if (options.labelEdge) {
      //   filterInputText.setAttribute('label-edge', options.labelEdge);
      // }
      // if (options.labelHint) {
      //   filterInputText.setAttribute('label-hint', options.labelHint);
      // }
      if (ariaLabel) {
        filterInputText.setAttribute('aria-label', ariaLabel);
      }
      // apply virtualKeyboard input type to search field
      filterInputText.setAttribute('virtual-keyboard', options.virtualKeyboard);

      if (!this._fullScreenPopup) {
        // create a hidden icon in the end slot to account for the dropdown open icon in the main
        // field on desktop
        var a = document.createElement('a');
        a.setAttribute(
          'class',
          className +
            '-arrow ' +
            className +
            '-open-icon ' +
            className +
            '-icon oj-component-icon oj-clickable-icon-nocontext'
        );
        a.setAttribute('slot', 'end');
        filterInputText.appendChild(a);
      } else {
        var strCancel = this.getTranslatedString('cancel');
        var backIcon = document.createElement('span');
        backIcon.setAttribute('id', 'cancelButton_' + this._idSuffix);
        backIcon.setAttribute('slot', 'start');
        backIcon.setAttribute('class', className + '-back-button');
        backIcon.setAttribute('aria-label', strCancel);
        backIcon.setAttribute('role', 'button');
        backIcon.addEventListener(
          'click',
          function () {
            // focus the input element after canceling on mobile because we want the focus to
            // go back to the main part of the component, and the user can tab out or reopen the
            // dropdown
            this._lovMainField.getInputElem().focus();
            this._abstractLovBase.cancel();
          }.bind(this)
        );

        filterInputText.appendChild(backIcon);
        var innerIcon = document.createElement('span');

        innerIcon.setAttribute(
          'class',
          className +
            '-back-icon ' +
            className +
            '-icon oj-component-icon oj-clickable-icon-nocontext'
        );
        backIcon.appendChild(innerIcon);
      }

      var $elem = $(this.OuterWrapper);
      filterInputText.addEventListener(
        'rawValueChanged',
        function (event) {
          if (!this._ignoreFilterFieldRawValueChanged) {
            // JET-40375 - SELECT SINGLE - DEFAULTED VALUE OVERRIDES USER INPUT
            // maintain flag that the user has typed filter text so that we don't override it with
            // the selected label if a data fetch comes in afterwards
            this._userHasTypedFilterText = true;

            this._updateResults(event);
          }
        }.bind(this)
      );
      filterInputText.addEventListener('focus', function () {
        $elem.addClass('oj-focus');
        this._mousedownOnDropdown = false;
      });
      filterInputText.addEventListener(
        'blur',
        function (event) {
          $elem.removeClass('oj-focus');
          if (!this._fullScreenPopup) {
            // don't hide the filter field if:
            // * tabbing into the dropdown, or
            // * clicking on an empty area of the dropdown, or
            // * JET-47185 - Acc: SelectSingle loses focus if we switch to other windows - Potential
            //   Keyboard trap in a dialog
            //   Alt+Tabbing to other application windows, in which case the document.activeElement
            //   will still be in the filter field
            var focusInDropdown =
              event.relatedTarget &&
              DomUtils.isAncestor(this._lovDropdown.getElement(), event.relatedTarget);
            var focusInFilterField =
              document.activeElement && DomUtils.isAncestor(filterInputText, document.activeElement);
            if (!focusInDropdown && !this._mousedownOnDropdown && !focusInFilterField) {
              // JET-65757 - Empty value rejected when not confirmed by Enter/Tab
              // clear the value after deleting all the filter text and clicking outside the
              // component
              this._HandleFilterFieldBlur();

              this._showMainField();
            }
          }
          this._mousedownOnDropdown = false;
        }.bind(this)
      );

      // Add mousedown event listener only on desktop, since we do not want to toggle
      // dropdown when tapped on filter input text when using in mobile
      if (!this._fullScreenPopup) {
        filterInputText.addEventListener('mousedown', this._handleContainerMouseDown.bind(this));
      }

      return filterInputText;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _CreateLovDropdown: function () {
      oj.Assert.failedInAbstractFunction();
      return null;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _initLovDropdown: function (
      idSuffix,
      inputType,
      containerId,
      getTranslatedStringFunc,
      addBusyStateFunc,
      afterDropdownInitFunc
    ) {
      this._lovDropdown.init({
        dataProvider: this._wrappedDataProvider,
        className: 'oj-select',
        parentId: containerId,
        idSuffix: idSuffix,
        dropdownElemId: this._dropdownElemId,
        fullScreenPopup: this._fullScreenPopup,
        inputType: inputType,
        bodyElem: $(this.OuterWrapper).closest('body')[0],
        itemTemplate: this._GetTemplateSlot('itemTemplate'),
        collectionTemplate: this._GetTemplateSlot('collectionTemplate'),
        getTemplateEngineFunc: this._loadTemplateEngine.bind(this),
        templateContextComponentElement: this.OuterWrapper,
        getTranslatedStringFunc: getTranslatedStringFunc,
        addBusyStateFunc: addBusyStateFunc,
        itemTextRendererFunc: this._ItemTextRenderer.bind(this),
        filterInputText: this._filterInputText,
        afterDropdownInitFunc: afterDropdownInitFunc,
        getThrottlePromiseFunc: this._GetThrottlePromise.bind(this),
        isValueForPlaceholderFunc: this._IsValueForPlaceholder.bind(this),
        isValueItemForPlaceholderFunc: this._IsValueItemForPlaceholder.bind(this),
        styleClassComponentName: this._GetStyleClassComponentName()
      });
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _openDropdown: function () {
      this._mousedownOnDropdown = false;

      // defer initialization of dropdown until we open it
      if (this._initLovDropdownFunc) {
        var initLovDropdownFunc = this._initLovDropdownFunc;
        this._initLovDropdownFunc = null;
        initLovDropdownFunc(
          function () {
            // JET-41568 - Select single in data grid causes console error when opening second before
            // exiting edit mode on first
            // Since this function is executed asynchronously after initializing the dropdodwn, we need
            // to make sure that the component itself has not been released.
            if (this._abstractLovBase) {
              this._abstractLovBase.openDropdown();
            }
          }.bind(this)
        );
      } else {
        this._abstractLovBase.openDropdown();
      }
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _updateResults: function (event) {
      // defer initialization of dropdown until we open it
      if (this._initLovDropdownFunc) {
        var initLovDropdownFunc = this._initLovDropdownFunc;
        this._initLovDropdownFunc = null;
        initLovDropdownFunc(
          function () {
            // JET-41568 - Select single in data grid causes console error when opening second before
            // exiting edit mode on first
            // Since this function is executed asynchronously after initializing the dropdodwn, we need
            // to make sure that the component itself has not been released.
            if (this._abstractLovBase) {
              this._abstractLovBase.updateResults(event);
            }
          }.bind(this)
        );
      } else {
        this._abstractLovBase.updateResults(event);
      }
    },

    /**
     * Initiate loading of the template engine.  An error is thrown if the template engine failed to
     * load.
     * @return {Promise} resolves to the template engine, or null if no item template is specified
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _loadTemplateEngine: function () {
      if (!this._templateEngine) {
        var resolveBusyContext = this._AddBusyState('Select loading template engine');
        return new Promise(
          function (resolve, reject) {
            const templateOptions = {
              customElement: this._GetCustomElement(),
              needsTrackableProperties: true
            };
            Config.__getTemplateEngine(templateOptions).then(
              function (engine) {
                this._templateEngine = engine;
                resolve(engine);
                resolveBusyContext();
              }.bind(this),
              function (reason) {
                reject(new Error('Error loading template engine: ' + reason));
                resolveBusyContext();
              }
            );
          }.bind(this)
        );
      }

      return Promise.resolve(this._templateEngine);
    },

    /**
     * Refreshes the Select.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof oj.ojSelectBase
     * @instance
     * @return {void}
     * @public
     */
    refresh: function () {
      // JET-42413: set flag while we're processing a value change so that if an app makes
      // changes to the component from within the change listener, we can defer processing the
      // new change until after we're done processing the current change
      if (this._makingInternalValueChange) {
        this._queueValueChangeDeferredCallback(
          function () {
            this.refresh();
          }.bind(this)
        );

        return;
      }

      var mainFieldInputElem = this._lovMainField.getInputElem();
      // JET-34351 - OJ-SELECT-SINGLE DOES NOT SHOW VALUE IF OPTIONS ARE UPDATED ASYNC
      // set this flag while calling superclass refresh so that we can defer handling any
      // _SetDisplayValue calls until after we've setup again
      this._bSuperRefreshing = true;
      this._super();
      this._bSuperRefreshing = false;

      // Bug JET-35402 - help.instruction does not display after oj-select-single went from disabled to enabled
      // We will be reusing the main field's input element, so we need to retain it along
      // with the data it holds.
      this._ReleaseSelectResources(true);

      this._SetupSelectResources(mainFieldInputElem);

      this._initComponentMessaging();

      // JET-34351 - OJ-SELECT-SINGLE DOES NOT SHOW VALUE IF OPTIONS ARE UPDATED ASYNC
      // after we've setup again, now process any deferred _SetDisplayValue calls
      if (this._deferredSetDisplayValue) {
        this._deferredSetDisplayValue();
      }
    },

    /**
     * Override to setup resources needed by this component.
     * @memberof oj.ojSelectBase
     * @override
     * @protected
     */
    _SetupResources: function () {
      this._super();

      // only do something if _ReleaseResources was called, because _SetupResources will be called
      // after _ComponentCreate and _AfterCreate during initialization, in which case we will have
      // already called _SetupSelectResources during _ComponentCreate
      if (this._bReleasedResources) {
        this._bReleasedResources = false;

        this._SetupSelectResources();

        this._initComponentMessaging();
      }
    },

    /**
     * Override to release resources held by this component.
     * @memberof oj.ojSelectBase
     * @override
     * @protected
     */
    _ReleaseResources: function () {
      this._super();

      this._bReleasedResources = true;

      this._ReleaseSelectResources();

      this._superSetOptions = null;
      this._setOptionsQueue = null;
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
     * @ojshortdesc Validates the component's display value using all validators registered on the component. If there are no validation errors, then the value is updated. See the Help documentation for more information.
     * @method
     * @access public
     * @expose
     * @instance
     * @memberof oj.ojSelectBase
     */
    validate: function () {
      // JET-42413: set flag while we're processing a value change so that if an app makes
      // changes to the component from within the change listener, we can defer processing the
      // new change until after we're done processing the current change
      if (this._makingInternalValueChange) {
        var resolveFunc;
        var rejectFunc;
        var promise = new Promise(function (resolve, reject) {
          resolveFunc = resolve;
          rejectFunc = reject;
        });
        this._queueValueChangeDeferredCallback(
          function () {
            this.validate().then(resolveFunc, rejectFunc);
          }.bind(this)
        );

        return promise;
      }

      return this._ValidateHelper();
    },

    /**
     * @memberof oj.ojSelectBase
     * @instance
     * @protected
     */
    _ValidateHelper: function () {
      oj.Assert.failedInAbstractFunction();
    },

    /**
     * @memberof oj.ojSelectBase
     * @instance
     * @protected
     */
    _GetValueItemPropertyName: function () {
      oj.Assert.failedInAbstractFunction();
    },

    /**
     * skeep value in sync with valueItem
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _SyncValueWithValueItem: function (valueItem, value, context) {
      oj.Assert.failedInAbstractFunction();
    },

    /**
     * update display label(s) and valueItem(s) after value was set
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _UpdateValueItem: function (value) {
      oj.Assert.failedInAbstractFunction();
    },

    /**
     * Queue a microtask to finish processing a _setOptions call.
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _queueSetOptionsMicrotask: function () {
      // In vdom architecture, there are multiple issues with value and valueItem properties,
      // as well as other properties, that we need to handle.
      //
      // JET-51307 - Wrapping select single with value item and value integrations going into loop
      // with multiple instances of LOV in a page
      // If we're wrapped by a VComponent and there are multiple instances on the page
      // all bound to the same valueItem, then if the user selects a new value in one instance,
      // the page can go into an infinite loop.
      // If we synchronously update the value on our DOM element here, then when the next preact
      // render compares the stale vcomp value property against the new value in the DOM, preact
      // determines it must push the stale value property back down onto us, which then causes
      // the valueItem to get sync'ed again, and the loop goes on.
      //
      // JET-55775 - oj-select-single initiates fetch even when valueItem is provided in preact
      // wrapper
      // In preact, when value & valueItem are set at the same time, we will receive them one after
      // the other.  So, if we process the value when we get it, then we might initiate an
      // unnecessary fetch as we will later get the data from valueItem.
      //
      // JET-64359 - select - single handling of mutation on both value and valueItem properties
      // coming from preact
      // Also, when either value or valueItem property is ignored when updating props in the wrapper
      // vcomponent, we will get a setOption call with a null / default value for that property.
      // In these cases, depending on the order we receive the call, we might incorrectly end up
      // setting the null / default value.
      //
      // JET-66896 - Value is not displayed when provider and value are set together
      // When value and data were set together, the valueItem ended up with null data and metadata,
      // so the label for the selected value was not displayed.
      //
      // JET-65611 - Form is in invalid state though the values are populated correctly
      // This bug was related to the fact that the framework introduced changes in JET 16 so that
      // the component gets batched property sets in VDOM, similar to knockout.js, whereas before
      // each property was set individually.  For some property sets, like readonly, the code
      // internally does a refresh.  For a valueItem change, in VDOM only, the code processed it
      // in a microtask (to fix other issues encountered in VDOM).  With the previous, individual
      // property setting behavior in VDOM, an internal refresh would happen before the new
      // valueItem was even set on the component.  With the batching property setting behavior,
      // the valueItem started to be processed before the internal refresh and then finished after
      // the refresh, such that the changes were interfering with each other.
      //
      // In order to address all these cases, if we know we are in VDOM, we will queue a
      // microtask to process the options.  Since preact calls setOptions synchronously for each
      // option, our microtask callback will have access to all the accumulated options at once,
      // similar to what would happen in MVVM.

      var microtaskFunc = () => {
        // reset the queue first so that any new _setOptions calls made during processing of
        // this microtask will start a new queue
        var setOptionsQueue = this._setOptionsQueue;
        this._setOptionsQueue = null;

        // JET-66038 - REGRESSION FOR EXPENSETYPEID FIELD 'GETINPUTELEM' ERROR
        // When this function is executed in a microtask, it's possible that the element has been
        // removed from the DOM and its resources released since the microtask was queued.  If so,
        // simply return without doing anything; otherwise we may throw an NPE because we've
        // already destroyed our internal structures.
        if (this._bReleasedResources) {
          // Ideally we would let the set proceed and simply guard against NPE due to released
          // internal structures so that if we're ever reconnected, we can re-establish the
          // previous state.
          return;
        }

        // Collapse the individual _setOptions calls into a single options object so we can process
        // all the properties at once.
        // Use the first flags object because we shouldn't need to accumulate different flags across
        // the _setOptions calls.  Preact doesn't pass any flags, and any that we use internally
        // would not be intermingled with other _setOptions calls in the same microtask.
        var queuedOptions = setOptionsQueue.reduce((accum, curr, index) => {
          return {
            options: { ...accum.options, ...curr.options },
            flags: index === 0 ? curr.flags : accum.flags
          };
        }, {});
        var options = queuedOptions.options;
        var flags = queuedOptions.flags;

        // eslint-disable-next-line no-prototype-builtins
        var hasValue = options.hasOwnProperty('value');
        // eslint-disable-next-line no-prototype-builtins
        var hasValueItem = options.hasOwnProperty(this._GetValueItemPropertyName());
        // Get the latest value and valueItem
        const _valueItem = options[this._GetValueItemPropertyName()];
        const _value = options.value;
        // Determine empty states
        // Note that _Is*****ForPlaceholder simply checks whether the value/valueItem
        // represents the empty/null state.
        const isEmptyValue = this._IsValueForPlaceholder(_value);
        const isEmptyValueItem = this._IsValueItemForPlaceholder(_valueItem);
        // If both value and valueItem are provided, then compare them to decide what to do
        if (hasValue && hasValueItem) {
          // if valueItem and value are not null, and they are conflicting then throw an error
          if (!isEmptyValue && !isEmptyValueItem && _valueItem.key !== _value) {
            throw new Error('Select Single: conflicting value-item and value');
          }

          // At this point, either one of them is empty or they both have the same
          // key. So, if valueItem is not empty, use it (and delete the value from the options).
          // Otherwise, use the value (and delete the valueItem from the options).
          if (!isEmptyValueItem) {
            delete options.value;
          } else {
            delete options[this._GetValueItemPropertyName()];
          }
        }

        this._setOptionsHelper(options, flags, this._superSetOptions);
      };

      window.queueMicrotask(microtaskFunc);
    },

    /**
     * Sets multiple options
     * @param {Object} options the options object
     * @param {Object} flags additional flags for option
     * @override
     * @protected
     * @memberof! oj.ojSelectBase
     */
    _setOptions: function (options, flags) {
      const elemState = ojcustomelementUtils.CustomElementUtils.getElementState(this.OuterWrapper);
      if (elemState.getBindingProviderType() === 'preact') {
        // If we're in preact and we haven't already queued a microtask to process the options,
        // queue one now.  We will handle all the accumulated options at once in the microtask.
        if (!this._setOptionsQueue) {
          this._setOptionsQueue = [];
          this._superSetOptions = this._super.bind(this);
          this._queueSetOptionsMicrotask();
        }
        this._setOptionsQueue.push({ options: { ...options }, flags: { ...flags } });
      } else {
        this._setOptionsHelper(options, flags, this._super.bind(this));
      }
    },

    /**
     * Helper function to set options.
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _setOptionsHelper: function (options, flags, superSetOptions) {
      // JET-50116: Styles error in oj-select-single
      // If the component is already destroyed, we would have released all the internal resources.
      // If so, simply return without doing anything; otherwise we may throw an NPE because we've
      // already destroyed our internal structures.
      if (this._bReleasedResources) {
        // Ideally we would let the set proceed and simply guard against NPE due to released
        // internal structures so that if we're ever reconnected, we can re-establish the
        // previous state.
        // But, we are not sure how often this happens or if these options sets while detached are
        // unintentional. So, if we ever get a bug filed for this, we can revisit this fix.
        return;
      }

      // JET-42413: set flag while we're processing a value change so that if an app makes
      // changes to the component from within the change listener, we can defer processing the
      // new change until after we're done processing the current change
      if (this._makingInternalValueChange) {
        this._queueValueChangeDeferredCallback(
          function () {
            // JET-46247 - Acc: described-by resets after changing the data provider
            // don't re-set the same labelledBy again because it can affect whether the label
            // actually gets read out by the screen reader (because it may change how the label is
            // configured between the main and filter inputs)
            var newOptions = Object.assign({}, options);
            if (
              // eslint-disable-next-line no-prototype-builtins
              newOptions.hasOwnProperty('labelledBy') &&
              newOptions.labelledBy === this.options.labelledBy
            ) {
              delete newOptions.labelledBy;
              if (Object.entries(newOptions).length === 0) {
                return;
              }
            }
            this._setOptions(newOptions, flags);
          }.bind(this)
        );

        return;
      }

      // JET-34601 - SELECT SINGLE- CHANGING DISABLED PROPERTY GIVES A GLOWING EFFECT
      // Create a temporary object for individual _setOption calls to store things, so that we can
      // process them in a particular order, if necessary.
      // Push an object for this _setOptions call.  There may be nested _setOptions calls if
      // 'labelEdge' is being set, because it in turn may set 'labelledBy'.  If we used a single
      // object, not an array of objects, then the nested call would clear the single object, and
      // when the outer call tries to access it below, it will be null.
      if (!this._processSetOptions) {
        this._processSetOptions = [];
      }
      this._processSetOptions.push({});

      // JET-37550 - REGRESSION : OJ-SELECT-SINGLE NOT DISPLAYING DEFAULT VALUE
      // if setting both data and value at the same time, defer setting the value until after the
      // data has been set
      var resolveBusyState;
      var needToUpdateValueItem = false;
      // eslint-disable-next-line no-prototype-builtins
      var hasData = options.hasOwnProperty('data');
      // eslint-disable-next-line no-prototype-builtins
      var hasValue = options.hasOwnProperty('value');
      // eslint-disable-next-line no-prototype-builtins
      var hasValueItem = options.hasOwnProperty(this._GetValueItemPropertyName());
      // JET-38612 - Select Single | Value, disable bug
      // check whether any of the options being set will require a refresh
      var requiresRefresh = false;
      // iterate over the set of options being applied because that set is most likely smaller than
      // the set of options that would require a refresh, so the loop iterates fewer times
      var keys = Object.keys(options);
      for (var i = 0; i < keys.length; i++) {
        if (this._OPTIONS_REQUIRING_REFRESH.has(keys[i])) {
          requiresRefresh = true;
          break;
        }
      }
      if (requiresRefresh) {
        if (hasValue) {
          // JET-38612 - Select Single | Value, disable bug
          // if the options require a refresh and a new value is being set that requires a fetch,
          // defer setting the new value until after the refresh
          this._deferSettingValue = true;
          // maintain a busy state until we've at least started to process all changes
          resolveBusyState = this._AddBusyState('Defer setting value');
        } else if (hasData && !hasValueItem) {
          // JET-38441 - WHEN GENERATOR VARIABLE OF TYPE 'OJS/OJARRAYDATAPROVIDER' IS BOUND TO
          // SELECT-SINGLE, IT FAILS TO SHOW THE SELECTED VALUE
          // if setting new data and the current valueItem was set internally, then it needs to be
          // updated for the new data
          needToUpdateValueItem = this._valueItemSetInternally;
        }
      }

      // JET-42353 - SELECT SINGLE FOCUS LOST ON CHANGE OF THE DEPENDENT VALUE
      // remember whether the filter field is shown before processing the new options so that
      // we can restore it afterwards, if necessary
      var showFilterField = false;
      if (
        !this._fullScreenPopup &&
        this._lovEnabled &&
        this._filterInputText.style.visibility !== 'hidden'
      ) {
        showFilterField = true;
      }

      try {
        superSetOptions(options, flags);

        // grab the latest processSetOptions object and remove it from the array
        var processSetOptions = this._processSetOptions.pop();

        // JET-34601 - SELECT SINGLE- CHANGING DISABLED PROPERTY GIVES A GLOWING EFFECT
        // if we need to refresh, do that before setting a new value
        if (processSetOptions.forRefresh) {
          processSetOptions.forRefresh();
        }

        // turn off the flag now, after refreshing but before processing the new value,
        // only if we set the flag during this call to _setOptions
        if (resolveBusyState) {
          this._deferSettingValue = false;
        }

        if (processSetOptions.value) {
          processSetOptions.value();
        } else if (needToUpdateValueItem) {
          // JET-42413: set flag while we're processing a value change so that if an app makes
          // changes to the component from within the change listener, we can defer processing the
          // new change until after we're done processing the current change
          var resolveValueChangeFunc = this._StartMakingInternalValueChange();

          // JET-38441 - WHEN GENERATOR VARIABLE OF TYPE 'OJS/OJARRAYDATAPROVIDER' IS BOUND TO
          // SELECT-SINGLE, IT FAILS TO SHOW THE SELECTED VALUE
          // if setting new data and the current valueItem was set internally, then it needs to be
          // updated for the new data, which will happen when we re-set the existing value
          this._setOption('value', this.options.value);

          resolveValueChangeFunc();
        }

        // JET-42353 - SELECT SINGLE FOCUS LOST ON CHANGE OF THE DEPENDENT VALUE
        // if the filter field was shown before processing the new options, but is no longer shown,
        // show it again
        if (showFilterField && this._filterInputText.style.visibility === 'hidden') {
          // need to wait for the new filter oj-input-text to be upgraded
          var busyContext = Context.getContext(this._filterInputText).getBusyContext();
          busyContext.whenReady().then(
            function () {
              this._ShowFilterField();
            }.bind(this)
          );
        }
      } finally {
        if (resolveBusyState) {
          resolveBusyState();
        }
      }
    },

    /**
     * Handles options specific to Select.
     * @override
     * @protected
     * @memberof! oj.ojSelectBase
     */
    _setOption: function (key, value, flags) {
      var abstractLovBase = this._abstractLovBase;

      if (key === this._GetValueItemPropertyName()) {
        // JET-44210 - throw an error when a value-item is set externally that contains the key
        // but not the data
        if (!this._IsValueItemForPlaceholder(value) && value.data == null) {
          throw new Error('Select Single: value-item contains key but no data');
        }
      }

      // JET-64632 - DataProvider refresh event can wipe out currently selected value
      // If we get a DP refresh event we may re-set the currently selected value so that we fetch
      // new data for it, in which case we don't want to fire a change event, so don't call the
      // superclass.
      var bSkipSuperclassCall = key === 'value' && this.options.value === value;

      if (!bSkipSuperclassCall) {
        this._super(key, value, flags);
      }

      var processSetOptions;
      if (this._processSetOptions && this._processSetOptions.length > 0) {
        // use the last processSetOptions object, which is the one for the current _setOptions call
        processSetOptions = this._processSetOptions[this._processSetOptions.length - 1];
      }

      //  - need to be able to specify the initial value of select components bound to dprv
      if (key === this._GetValueItemPropertyName()) {
        this._valueItemSetInternally = false;
        this._SyncValueWithValueItem(value, this.options.value);
      } else if (key === 'value') {
        // JET-34601 - SELECT SINGLE- CHANGING DISABLED PROPERTY GIVES A GLOWING EFFECT
        // save the processing function for execution in _setOptions
        var processSetOptionValue = function () {
          abstractLovBase.setValue(value);

          //  - placeholder is not displayed after removing selections from select many
          //  - resetting value when value-item and placeholder are set throws exception
          if (this._IsValueForPlaceholder(value)) {
            this._SetValueItem(this._GetDefaultValueItemForPlaceholder());
          } else {
            // update valueItem
            this._UpdateValueItem(value);
          }

          // need to update display value again after valueItem is set correctly
          this._SetDisplayValue();
        }.bind(this);
        if (processSetOptions) {
          processSetOptions.value = processSetOptionValue;
        } else {
          processSetOptionValue();
        }
      } else if (this._OPTIONS_REQUIRING_REFRESH.has(key)) {
        // JET-34601 - SELECT SINGLE- CHANGING DISABLED PROPERTY GIVES A GLOWING EFFECT
        // save the processing function for execution in _setOptions
        var processSetOptionForRefresh = function () {
          this.refresh();
        }.bind(this);
        if (processSetOptions) {
          processSetOptions.forRefresh = processSetOptionForRefresh;
        } else {
          processSetOptionForRefresh();
        }
      } else if (key === 'labelledBy') {
        if (this.options.labelledBy) {
          var id = this._GetContentElement()[0].id;
          this._labelledByUpdatedForInputComp(this.options.labelledBy, id);
        }

        // TODO: need to do a targeted update here, because calling refresh clears any custom
        // messages that should be shown on first display (because EditableValue may asynchronously
        // set labelled-by attr on our custom element after we've been initialized)
        // this.refresh();
        this._updateLabel();
      } else if (key === 'itemText') {
        // JET-45922 - timing issue with select-single: lov drop-down doesn't have element
        // do a granular update if item-text changes instead of a general refresh
        this._UpdateItemText();
      } else if (key === 'matchBy') {
        // JET-60725 - Add option to specify the matchBy behavior of the text filter
        // Make a copy of the array to use internally so that the application can't mutate it;
        // they have to set a new array if they want to change it.
        this._matchBy = value && value.length > 0 ? [...value] : undefined;
        if (this._abstractLovBase) {
          this._abstractLovBase.setMatchBy(this._matchBy);
        }
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
     * @memberof! oj.ojSelectBase
     * @instance
     * @override
     */
    // eslint-disable-next-line no-unused-vars
    _AfterSetOption: function (name, flags) {
      this._superApply(arguments);
      switch (name) {
        case 'required':
          this._AfterSetOptionRequired(name);
          break;
        case 'virtualKeyboard':
          this._SetInputType(this._ALLOWED_INPUT_TYPES);
          this.refresh();
          break;
        case 'labelHint':
        case 'labelEdge':
          // Changing labelHint and labelEdge might have updated
          // aria-label on the root element. Check if it is needed to
          // update the aria-label on inner elements.
          this._updateLabel();
          break;
        default:
          break;
      }
    },

    /**
     * Performs post processing after value option changes.
     *
     * @param {string} option
     * @param {Object=} flags
     *
     * @protected
     * @memberof! oj.ojSelectBase
     * @instance
     * @override
     */
    // eslint-disable-next-line no-unused-vars
    _AfterSetOptionValue: function (option, flags) {
      this._superApply(arguments);
      if (option === 'value') {
        this._toggleNoValueStyleClass();
      }
    },

    // 19670748, dropdown popup should be closed on subtreeDetached notification.
    /**
     * @protected
     * @memberof! oj.ojSelectBase
     * @instance
     * @override
     */
    _NotifyDetached: function () {
      this._superApply(arguments);
      this._CloseDropdown();
    },

    // 19670748, dropdown popup should be closed on subtreeHidden notification.
    /**
     * @protected
     * @memberof! oj.ojSelectBase
     * @instance
     * @override
     */
    _NotifyHidden: function () {
      this._superApply(arguments);
      this._CloseDropdown();
    },

    /**
     * @override
     * @protected
     * @memberof! oj.ojSelectBase
     *
     * @param {!Object} menu The JET Menu to open as a context menu.  Always non-<code class="prettyprint">null</code>.
     * @param {!Event} event What triggered the menu launch.  Always non-<code class="prettyprint">null</code>.
     * @param {string} eventType "mouse", "touch", or "keyboard".  Never <code class="prettyprint">null</code>.
     */
    _NotifyContextMenuGesture: function (menu, event, eventType) {
      // The default baseComponent behavior in _OpenContextMenu assumes this.element for the
      // launcher. In this case, the original element the component is bound to is
      // hidden (display: none). Pass in an openOption override.
      var launcher = this._GetMessagingLauncherElement();
      this._OpenContextMenu(event, eventType, { launcher: launcher });
    },

    /**
     * @protected
     * @memberof! oj.ojSelectBase
     * @instance
     */
    _NotifyMessagingStrategyQueueAction: function (promise) {
      // JET-46567 - JAWS is reading out error message even after selecting correct value
      // this will be called from InlineMessagingStrategy._queueAction before the
      // timer to update messages is fired so that we can defer processing until after
      // the DOM has been changed
      this._messagingStrategyQueueActionPromise = promise;
      promise.then(
        function () {
          this._messagingStrategyQueueActionPromise = null;
        }.bind(this)
      );
    },

    /**
     * Returns the jquery element that represents the content part of the component.
     * This is usually the component that user sets focus on (tabindex is set 0) and
     * where aria attributes like aria-required, aria-labelledby etc. are set. This is
     * also the element where the new value is updated. Usually this is the same as
     * the _GetMessagingLauncherElement.
     *
     * @override
     * @protected
     * @memberof! oj.ojSelectBase
     * @return {jQuery} jquery element which represents the content.
     */
    _GetContentElement: function () {
      // if a non-empty string placeholder is set, then EditableValue calls this from within its
      // _ComponentCreate, which is before the abstractLovBase is created
      if (this._lovMainField) {
        return $(this._lovMainField.getInputElem());
      }
      return this.element;
    },

    /**
     * save the new wrapper or the original data provider
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _wrapDataProviderIfNeeded: function (dataProvider) {
      if (LovUtils.isDataProvider(dataProvider)) {
        var wrapper = dataProvider;
        // make sure data provider is an instance of *DataProviderView, and wrap it with one if it
        // isn't, so that we can use the FilterFactory to create filter criterion and have the DP
        // do local filtering if needed
        if (LovUtils.isTreeDataProvider(dataProvider)) {
          if (!(dataProvider instanceof TreeDataProviderView)) {
            wrapper = new TreeDataProviderView(dataProvider);
          }
        } else if (!(dataProvider instanceof ListDataProviderView)) {
          wrapper = new ListDataProviderView(dataProvider);
        }

        // Wrap the data provider in the CachingDataProvider first
        wrapper = ojdataproviderfactory.getEnhancedDataProvider(wrapper, {
          fetchFirst: { caching: 'visitedByCurrentIterator' },
          // dedup: { type: 'iterator' },
          eventFiltering: { type: 'iterator' }
        });

        wrapper = new FilteringDataProviderView(wrapper);
        // save the data provider or wrapper
        this._wrappedDataProvider = wrapper;
      } else {
        this._wrappedDataProvider = new FilteringDataProviderView(null);
      }
    },

    /**
     * Add data provider event listeners
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _addDataProviderEventListeners: function () {
      var dataProvider = this._wrappedDataProvider;
      if (dataProvider) {
        this._removeDataProviderEventListeners();

        var dataProviderEventHandler = this._HandleDataProviderEvent.bind(this);
        this._savedDataProviderEH = dataProviderEventHandler;

        dataProvider.addEventListener('mutate', dataProviderEventHandler);
        dataProvider.addEventListener('refresh', dataProviderEventHandler);
      }
    },

    /**
     * Remove data provider event listeners
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _removeDataProviderEventListeners: function () {
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
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _HandleDataProviderEvent: function (event) {
      // to be implemented by subclass
    },

    /**
     * Renders text representing a data item.
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _ItemTextRenderer: function (valueItem) {
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

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _IsValueItemForPlaceholder: function (valueItem) {
      oj.Assert.failedInAbstractFunction();
      return false;
    },

    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _IsValueForPlaceholder: function (value) {
      oj.Assert.failedInAbstractFunction();
      return false;
    },

    //  - need to be able to specify the initial value of select components bound to dprv
    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _SetValueItem: function (valueItem) {
      oj.Assert.failedInAbstractFunction();
    },

    // fetch the data row by its key("value")
    // returns a promise that resolves to an object with one property: results
    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @protected
     */
    _FetchByKeysFromDataProvider: function (arKeys) {
      //  - sdp.fetchbykeys method is being called twice for a single value
      // Stored the selected value in this._cachedFetchByKeys, it will be cleared when the
      // promise is resolved or rejected. When this method is called again with the same selected
      // value, don't make another call to dataProvider.fetchByKeys because the previous one is in
      // flight.
      var fetchPromise;
      if (
        this._cachedFetchByKeys &&
        this._cachedFetchByKeys.promise &&
        oj.Object.compareValues(arKeys, this._cachedFetchByKeys.key)
      ) {
        fetchPromise = this._cachedFetchByKeys.promise;
      } else {
        // add busy context
        var fetchResolveFunc = this._AddBusyState('fetching selected data');
        //  - display loading indicator when fetching label for initial value is slow
        var bLoadingIndicatorAdded = false;
        if (this._abstractLovBase.getFetchType() === 'init') {
          if (!this._abstractLovBase.isDropdownOpen()) {
            bLoadingIndicatorAdded = true;
            this._setUiLoadingState('start');
          }
        }

        fetchPromise = new Promise(
          function (resolve, reject) {
            // fetch the data row by its key("value")
            var dpPromise = this._wrappedDataProvider.fetchByKeys({ keys: new Set(arKeys) });
            dpPromise.then(
              function (fetchResults) {
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
              },
              function (reason) {
                reject(reason);
              }
            );
          }.bind(this)
        );

        // save key and promise
        // eslint-disable-next-line no-param-reassign
        this._cachedFetchByKeys = {
          key: arKeys,
          promise: fetchPromise
        };

        var afterFetchPromiseFunc = function () {
          // JET-34713 Error updating array dataprovider of ojSelectSingle while its hidden
          // Abort if select single has been disconnected
          if (!this._bReleasedResources) {
            //  - sdp.fetchbykeys method is being called twice for a single value
            // eslint-disable-next-line no-param-reassign
            this._cachedFetchByKeys = undefined;

            if (bLoadingIndicatorAdded) {
              this._setUiLoadingState('stop');
            }
          }
          fetchResolveFunc();
        }.bind(this);
        fetchPromise.then(
          function () {
            afterFetchPromiseFunc();
          },
          function (reason) {
            Logger.warn('Select: fetchByKeys promise was rejected: ' + reason);
            afterFetchPromiseFunc();
          }
        );
      }

      return fetchPromise;
    },

    /**
     * Set the UI loading state of the component. After a delay, this function displays
     * a loading indicator on the component.
     * @param {string} state The state value to set; can be one of "start" or "stop"
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _setUiLoadingState: function (state) {
      if (state === 'start') {
        // Clear out any existing timer
        if (this._loadingIndicatorTimer) {
          this._loadingIndicatorTimer.clear();
        }
        this._loadingIndicatorTimer = TimerUtils.getTimer(this._showIndicatorDelay);
        this._loadingIndicatorTimer.getPromise().then(
          function (pending) {
            // Only add the loading indicator if loading request is still pending
            // (not cleared out by request finishing)
            if (pending) {
              this._addLoadingIndicator();
            }
          }.bind(this)
        );
      } else if (state === 'stop') {
        if (this._loadingIndicatorTimer) {
          this._loadingIndicatorTimer.clear();
          this._loadingIndicatorTimer = null;
        }
        this._removeLoadingIndicator();
      }
    },

    // Add a loading indicator to the select box
    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _addLoadingIndicator: function () {
      //  - display loading indicator when fetching label for initial value is slow
      this._loadingIndicatorCount += 1;

      // check if it's already added
      if (this._savedLoadingIndicator) {
        return;
      }

      this._SetLoading();

      this._savedLoadingIndicator = true;
    },

    // Remove the loading indicator
    /**
     * @memberof! oj.ojSelectBase
     * @instance
     * @private
     */
    _removeLoadingIndicator: function () {
      // don't decrement count below 0
      if (this._loadingIndicatorCount > 0) {
        this._loadingIndicatorCount -= 1;
      }
      //  - display loading indicator when fetching label for initial value is slow
      // remove the loading indicator when reference count down to 0
      if (this._loadingIndicatorCount === 0 && this._savedLoadingIndicator) {
        this._ClearLoading();
        this._savedLoadingIndicator = false;
      }
    }

    // Superclass Doc Overrides
    /**
     * @ojslot contextMenu
     * @ignore
     * @memberof oj.ojSelectBase
     */
  });

  exports.AbstractLovBase = AbstractLovBase;
  exports.FilteringDataProviderView = FilteringDataProviderView;
  exports.LovDropdown = LovDropdown;
  exports.LovMainField = LovMainField;
  exports.LovUtils = LovUtils;

  Object.defineProperty(exports, '__esModule', { value: true });

});
