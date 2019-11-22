/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojlogger', 'ojs/ojcomponentcore', 'ojs/ojeditablevalue'],
function(oj, $, Logger, Components)
{
  "use strict";


/* global Components:false, Symbol:false */

/**
 * @class oj.RadioCheckboxUtils
 * @classdesc JET Radio and Checkbox Component Utils
 * @export
 * @since 6.1.0
 * @hideconstructor
 * @ignore
 *
 */
oj.RadioCheckboxUtils = {};

/**
 * Render option items from existing data.
 *
 * @public
 * @ignore
 */
oj.RadioCheckboxUtils.renderOptions = function () {
  var optionsDataArray = this._optionsDataArray;
  var choiceset = this.element[0];

  if (optionsDataArray) {
    // The wrapper should have been created in _ComponentCreate
    var wrapperClass = choiceset.tagName === 'OJ-RADIOSET' ?
                       'oj-radioset-wrapper' : 'oj-checkboxset-wrapper';
    var wrapper = choiceset.querySelector('.' + wrapperClass);
    var i;

    // We may need to create the wrapper if it doesn't exist because there
    // was nothing to wrap in _ComponentCreate.
    if (wrapper == null) {
      wrapper = document.createElement('div');
      wrapper.className = wrapperClass;
      choiceset.appendChild(wrapper);
    } else {
      // Remove all the existing option items
      var optionItems = wrapper.querySelectorAll('.oj-choice-item');
      for (i = 0; i < optionItems.length; i++) {
        var item = optionItems[i];
        item.parentNode.removeChild(item);
      }
    }

    // Determine option renderer
    var optionRenderer = this.options.optionRenderer;
    var optionsKeys = this.options.optionsKeys;
    var valueKey = optionsKeys && optionsKeys.value ? optionsKeys.value : 'value';
    if (typeof optionRenderer !== 'function') {
      // Default option renderer
      optionRenderer = function (optionContext) {
        var labelKey = optionsKeys && optionsKeys.label ? optionsKeys.label : 'label';
        var ojOption = document.createElement('oj-option');
        ojOption.value = optionContext.data[valueKey];
        ojOption.textContent = optionContext.data[labelKey];
        return ojOption;
      };
    }

    // Create all oj-option from option data
    for (i = 0; i < optionsDataArray.length; i++) {
      var optionContext = {
        component: choiceset,
        index: i,
        data: optionsDataArray[i]
      };
      var ojOption = optionRenderer(optionContext);
      if (ojOption && ojOption.tagName === 'OJ-OPTION') {
        // Need to set data-oj-binding-provider so that the element will be upgraded
        if (!ojOption.hasAttribute('data-oj-binding-provider')) {
          ojOption.setAttribute('data-oj-binding-provider', 'none');
        }
        if (ojOption.value === null || ojOption.value === undefined) {
          ojOption.value = optionContext.data[valueKey];
        }
        wrapper.appendChild(ojOption);
        Components.subtreeAttached(ojOption);
      }
    }

    // Call refresh, which will set up all oj-option as _ojRadioCheckbox
    // and update the display value and disabled state.
    this.refresh();
  }
};

/**
 * Fetch DataProvider data and render option items from it.
 * This is called when the component is created, when the "options" property changes,
 * and when the DataProvider data is changed.
 *
 * @public
 * @ignore
 */
oj.RadioCheckboxUtils.generateOptionsFromData = function () {
  var dataProvider = this.options.options;

  // Remove any existing DataProvider listeners
  oj.RadioCheckboxUtils.removeDataListener.call(this);

  // Nothing else to do here if no DataProvider is used
  if (!dataProvider || !oj.DataProviderFeatureChecker.isDataProvider(dataProvider)) {
    return;
  }

  // Add a busy state
  var desc = 'The component identified by "' + this.element[0].id + '" is fetching data';
  var busyStateOptions = { description: desc };
  var busyContext = oj.Context.getContext(this.element[0]).getBusyContext();
  var resolveFunc = busyContext.addBusyState(busyStateOptions);

  // Fetch all the option data
  // eslint-disable-next-line no-param-reassign
  this._optionsDataArray = [];
  var i;
  var asyncIterator = dataProvider.fetchFirst()[Symbol.asyncIterator]();
  var self = this;
  var processResults = function (iterResult) {
    var nextPromise;

    if (iterResult && iterResult.value) {
      var fetchListResult = iterResult.value;
      for (i = 0; i < fetchListResult.data.length; i++) {
        self._optionsDataArray.push(fetchListResult.data[i]);
      }

      // fetch the next batch if we're not done
      if (!iterResult.done) {
        nextPromise = asyncIterator.next().then(processResults);
      }
    }

    return nextPromise;
  };

  var fetchPromise = asyncIterator.next().then(processResults);

  fetchPromise.then(
    function () {
      oj.RadioCheckboxUtils.renderOptions.call(self);
      // Add back DataProvider listeners after the options are rendered
      oj.RadioCheckboxUtils.addDataListener.call(self);
      // Resolve busy state
      resolveFunc();
    },
    function () {
      resolveFunc();
    });
};

/**
 * Add listeners to DataProvider events.
 *
 * @public
 * @ignore
 */
oj.RadioCheckboxUtils.addDataListener = function () {
  // Remove any existing listener first
  oj.RadioCheckboxUtils.removeDataListener.call(this);

  if (this.options.options &&
      oj.DataProviderFeatureChecker.isDataProvider(this.options.options)) {
    // Remember which dataprovider is used because this.options.options can change
    // eslint-disable-next-line no-param-reassign
    this._optionsDataProvider = this.options.options;
    // eslint-disable-next-line no-param-reassign
    this._optionsDataListener = oj.RadioCheckboxUtils.generateOptionsFromData.bind(this);
    this._optionsDataProvider.addEventListener('refresh', this._optionsDataListener);
    this._optionsDataProvider.addEventListener('mutate', this._optionsDataListener);
  }
};

/**
 * Remove listeners from DataProvider events.
 *
 * @public
 * @ignore
 */
oj.RadioCheckboxUtils.removeDataListener = function () {
  if (this._optionsDataListener) {
    this._optionsDataProvider.removeEventListener('refresh', this._optionsDataListener);
    this._optionsDataProvider.removeEventListener('mutate', this._optionsDataListener);
    // eslint-disable-next-line no-param-reassign
    this._optionsDataProvider = null;
    // eslint-disable-next-line no-param-reassign
    this._optionsDataListener = null;
  }
};


/*!
 * JET Radio This component is private. @VERSION
 */
/* global Logger:false */

 /**
 * The _ojRadio component enhances a browser input element into one that is
 * of type=radio. This is a private component used by ojRadioset.
 *
 * <h3>Events:</h3>
 * <ul>
 *   <li>clicked/checked?<p>
 *   Triggered if the checkbox is clicked; or if the checkbox was checked programatically
 *   with the checked option.
 *   </li>
 * </ul>
 *
 * @ojcomponent oj._ojRadioCheckbox
 * @private
 * @augments oj.baseComponent TODO: Should I extend this?
 * Pros: it gives me oj-disabled/oj-enabled. (easy to add myself)
 * Cons: It gives me tooltip stuff that I don't want. I want that on the div or on the first checkbox only.
 * Pro/Con?: it rewrites required for me if it is on the dom node, but then it makes it required??? Should I rewrite required or don't care?
 */
oj.__registerWidget('oj._ojRadioCheckbox', $.oj.baseComponent,
  {
    version: '1.0.0',
    defaultElement: '<input>',
    widgetEventPrefix: 'oj',
    options:
    {
      /**
       * First we look for the disabled option to be explicitly set. If not, then
       * we look if disabled is on the dom. If null, disabled defaults to false.
       * @expose
       * @type {?boolean|undefined}
       * @default <code class="prettyprint">false</code>
       * @public
       * @instance
       * @memberof oj._ojRadioCheckbox
       */
      disabled: null,
      /**
       * First we look for the checked option to be explicitly set. If not, then
       * we look if checked is on the dom. If null, checked defaults to false.
       * @expose
       * @type {?boolean}
       * @public
       * @instance
       * @memberof oj._ojRadioCheckbox */
      checked: null,
      /**
       * First we look for the disabled option to be explicitly set. If not, then
       * we look if disabled is on the dom. If null, disabled defaults to false.
       * @expose
       * @type {?boolean}
       * @default <code class="prettyprint">false</code>
       * @public
       * @instance
       * @memberof oj._ojRadioCheckbox
       */
      type: null
    },
    /** ** start Public APIs ****/
    /**
     *
     * <p>This method does not accept any arguments.
     *
     * @public
     * @expose
     * @memberof oj.RadioCheckbox
     * @return {jQuery} the label(s) for the checkbox/radio input
     */
    label: function () {
      if (this.$label === undefined) {
        this.$label = this._getLabelsForElement();
      }
      return this.$label;
    },
    /**
     * @expose
     * @memberof oj._ojRadioCheckbox
     * @instance
     * @override
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" )._ojRadioCheckbox( "refresh" );
     */
    refresh: function () {
      this._super();
      this._setup();
    },
    /**
     * @expose
     * @memberof oj._ojRadioCheckbox
     * @instance
     * @override
     * @example <caption>Invoke the <code class="prettyprint">refreshDisabled</code> method:</caption>
     * $( ".selector" )._ojRadioCheckbox( "refreshDisabled" );
     */
    refreshDisabled: function () {
      // this looks at the effectivelyDisabled flag and updates the disabled attributes on the dom.
      this._renderDisabled();
    },
    /**
     * Set the oj-selected class to the element's checked property.
     * We keep the oj-selected class in sync with the input's checked attribute, not necessarily the
     * component's checked property. The component's checked property is set after it is validated.
     * if validation doesn't pass, the input may still be checked, but the this.options.checked isn't.
     * Think of it like an inputText. You can clear it out when it is required, blur,
     * and the display value is an empty field, but the value is the value that was there before.
     * @expose
     * @memberof oj._ojRadioCheckbox
     * @instance
     * @override
     * @example <caption>Invoke the <code class="prettyprint">setSelectedClass</code> method:</caption>
     * $( ".selector" )._ojRadioCheckbox( "setSelectedClass", true );
     */
    setSelectedClass: function (checked) {
      this.element.toggleClass('oj-selected', checked);
      this.$label.toggleClass('oj-selected', checked);
      this.$choiceItem.toggleClass('oj-selected', checked);
    },
    /**
     * Returns a jQuery object containing the element visually representing the checkbox.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof oj._ojRadioCheckbox
     * @instance
     * @return {jQuery} the checkbox or radio
     */
    widget: function () {
      return this.uiRadioCheckbox;
    },

    /** ** end Public APIs ****/

    /** ** start internal widget functions ****/
    /**
     * Called at component create time primarily to initialize options, often using DOM values. This
     * method is called before _ComponentCreate is called, so components that override this method
     * should be aware that the component has not been rendered yet. The element DOM is available and
     * can be relied on to retrieve any default values. <p>
     * @param {!Object} originalDefaults - original default options defined on the widget and its ancestors
     * @param {?Object} constructorOptions - options passed into the widget constructor
     *
     * @memberof oj._ojRadioCheckbox
     * @instance
     * @protected
     */
    _InitOptions: function (originalDefaults, constructorOptions) {
      var checkedFromDom;
      var disabledFromDom;

      this._super(originalDefaults, constructorOptions);

      // CHECKED:
      // if options.checked is not set, get it from the element
      // if options.checked is set to a valid value (boolean), set it on the
      // element to keep the two in sync (we do this in _CreateComponent->_setup)
      //
      // use DOM value if not in constructorOptions
      if (!('checked' in constructorOptions)) {
        this.initCheckedFromDom = true;
        checkedFromDom = !!this.element.prop('checked');
        // writeback not needed since "not in constructorOptions" means "not bound"
        this.option('checked', checkedFromDom, { _context: { internalSet: true } });
      }
      if (typeof this.options.checked !== 'boolean') {
        throw new Error('checked option must be a boolean');
      }
      // DISABLED:
      // if options.disabled is not set, get it from the element
      // if options.disabled is set to a valid value (boolean), set it on the
      // element to keep the two in sync (we do this in _CreateComponent->_setup)
      // use DOM value if not in constructorOptions
      if (!('disabled' in constructorOptions)) {
        // !! ensures it is a boolean
        disabledFromDom = !!this.element.prop('disabled');
        // writeback not needed since "not in constructorOptions" means "not bound"
        this.option('disabled', disabledFromDom, { _context: { internalSet: true } });
      }
      if (typeof this.options.disabled !== 'boolean') {
        throw new Error('disabled option must be a boolean');
      }

      // TYPE:
      // Gets the type which will be either radio or checkbox.
      // writeback not needed since "not in constructorOptions" means "not bound"
      if (!('type' in constructorOptions)) {
        this.option('type', this.element.prop('type'), { _context: { internalSet: true } });
      }
    },
    /**
     * After _ComponentCreate and _AfterCreate,
     * the widget should be 100% set up. this._super should be called first.
     * @override
     * @protected
     * @instance
     * @memberof oj._ojRadioCheckbox
     */
    _ComponentCreate: function () {
      this._super();

      var type = this.options.type;
      if (type === 'checkbox') {
        this.uiRadioCheckbox = this.element.addClass('oj-checkbox oj-component');
        this.$label = this._getLabelsForElement();
        this.$label.addClass('oj-checkbox-label');
      } else if (type === 'radio') {
        this.uiRadioCheckbox = this.element.addClass('oj-radio oj-component');
        this.$label = this._getLabelsForElement();
        this.$label.addClass('oj-radio-label');
      }

      // this will not be null since we create a choice item if there isn't one
      this.$choiceItem = this._getChoiceItem();

      var iElem = document.createElement('span');
      iElem.setAttribute('class', 'oj-radiocheckbox-icon');
      this.element.wrapAll(iElem); // @HTMLUpdateOK iElem constructed locally

      var self = this;
      this._focusable(this.element);

      this._AddHoverable(this.$choiceItem);
      this._AddActiveable(this.$choiceItem);

      // the input gets focus on keyboard tabbing. It bubbles up, so in case the
      // input element is hidden (e.g., in the native themes the input is hidden and an image is
      // shown instead), we need to set the focus selectors on the oj-choice-item so
      // we can style the checked image.
      this._focusable({
        element: this.$choiceItem,
        applyHighlight: true
      });


      this._AddHoverable(this.$label);
      this._AddActiveable(this.$label);

      // loop through each label to add dom and styles
      $.each(self.$label, function () {
        // wrap children in span
        $(this.childNodes).wrapAll("<span class='oj-radiocheckbox-label-text'></span>"); // @HTMLUpdateOK
      });
      this._setup();
    },
    /**
     * <p>Save only the 'class' attribute since that is what
     * we manipulate. We don't have to save all the attributes.
     * </p>
     *
     * @param {Object} element - jQuery selection to save attributes for
     * @protected
     * @memberof oj._ojRadioCheckbox
     * @instance
     * @override
     */
    _SaveAttributes: function (element) {
      this._savedClasses = element.attr('class');
    },
    /**
     * <p>Restore what was saved in _SaveAttributes
     * </p>
     *
     * @protected
     * @memberof oj._ojRadioCheckbox
     * @instance
     * @override
     */
    _RestoreAttributes: function () {
      // restore the saved "class" attribute. Setting class attr to undefined is a no/op, so
      // if this._savedClasses is undefined we explicitly remove the 'class' attribute.
      if (this._savedClasses) {
        this.element.attr('class', this._savedClasses);
      } else {
        this.element.removeAttr('class');
      }
    },
    /* _setup called during creation */
    _setup: function () {
      this._renderDisabled();

      if (!this.initCheckedFromDom) {
        // if we got it from the dom in _InitOptions, there is no need to reset it on the dom in _setup
        this._setCheckedOnDom(this.options.checked);
      }
      if (this.options.checked) {
        this.setSelectedClass(this.options.checked);
      }
    },
    _setCheckedOnDom: function (checked) {
      // !! to turn checked into a boolean
      // eslint-disable-next-line no-param-reassign
      checked = !!checked;

      this.element.prop('checked', checked);
    },
    _renderDisabled: function () {
      // Determines whether this component is effectively disabled,
      // i.e. it has its 'disabled' option set to true or
      // it has been disabled by its ancestor component
      var effectivelyDisabled = this._IsEffectivelyDisabled();
      if (effectivelyDisabled) {
        // set the dom to show DISABLED, but do NOT change the disabled option!
        //
        // when a dom element supports disabled, use that, and not aria-disabled.
        // having both is an error.
        this.element.prop('disabled', true).removeAttr('aria-disabled')
          .removeClass('oj-enabled').addClass('oj-disabled');

        this.$label.removeClass('oj-enabled')
          .addClass('oj-disabled');

        this.$choiceItem.removeClass('oj-enabled').addClass('oj-disabled');
      } else { // option not set to disabled. nor is parent. On refresh this is ok, since we get it from the option.
        // when a dom element supports disabled, use that, and not aria-disabled.
        // having both is an error.
        this.element.prop('disabled', false)
          .removeAttr('aria-disabled').removeClass('oj-disabled')
          .addClass('oj-enabled');
        this.$label.addClass('oj-enabled')
          .removeClass('oj-disabled');
        this.$choiceItem.addClass('oj-enabled').removeClass('oj-disabled');
      }
    },
    /**
     * @override
     * @private
     */
    _setOption: function (key, value) {
      this._superApply(arguments);

      if (key === 'disabled') {
        // eslint-disable-next-line no-param-reassign
        value = !!value;
        this._renderDisabled(value);
      }

      if (key === 'checked') {
        this._setCheckedOnDom(value);
        this.setSelectedClass(value);
      }
    },
    /**
     * Returns the list of labels for the element. Most likely this will be
     * one label, not multiple labels.
     * We do not guarantee that the returned list is live
     * We do not guarantee that the returned list is in document order
     * We check a jquery selector query on <label>s with a 'for' id equal to our id starting at the document level
     * and also as a sibling of the input (needed if documentFragment instead of document as the
     * table/datagrid use).
     * We do not support a label wrapping an input, so if we find that, we log an error.
     * NOTE: The .labels DOM property does not work on most browsers, so we don't use it.
     * e.g,
     * <pre>
     * <input id="opt3" type="checkbox" name="rb" value="opt3">
     * <label for="opt3">Checkbox Option 3</label>
     * </pre>
     * @private
     */
    _getLabelsForElement: function () {
      // this looks to see if the label is wrapping the input, which we do not support
      var $labelClosestParent = this.element.closest('label');

      var id = this.element.prop('id');
      var labelForQuery = "label[for='" + id + "']";
      var $labelForElems = $(labelForQuery);
      var $labelSibling;

      if ($labelClosestParent.length !== 0) {
        Logger.error("Found a label that is an input's ancestor." +
                        ' This is not supported in the ojCheckboxset or ojRadioset component and the component will\n' +
                        'not work correctly. ' +
                        "Use a label as a sibling to the input and use the label 'for' attribute to tie the two together.");
      }

      // make sure that the $labelClosestParent isn't also the one we found with the 'for' which would
      // be weird, but still. If it is, remove it from the jQuery element list so we don't count it as found.
      // e.g., <label for="input"><input id="input"></label> // not supported!
      // .not() method creates a new set and leaves the original set unchanged
      $labelForElems = $labelForElems.not($labelClosestParent);

      if ($labelForElems.length === 0) {
        // table and datagrid create their rows using documentFragment. With documentFragment
        // the labelFor query will return []. In that case, look for the label as a sibling of
        // the element
        $labelSibling = this.element.siblings(labelForQuery);
        // .add() method creates a new set and leaves the original set unchanged
        $labelForElems = $labelForElems.add($labelSibling);
      }

      // combine these query results to return the label
      // with the for attribute pointing to the checkbox's id.
      return $labelForElems;
    },
    /**
     * Call this before you wrap the input in a span class='oj-radiocheckbox-icon' because we
     * are looking for the span with oj-choice-item as the parent of the input.
     * If it isn't there, this function will add it. So it never returns null.
     * @private
     * @returns {Object}
     */
    _getChoiceItem: function () {
      var choiceItem = null;
      var elementParent;
      var labelSelector;
      var ojChoiceItemSpanString;
      var siblingLabel;

      elementParent = this.element.parent();
      // oj-choice-row and oj-choice-row-inline have been deprecated on December 7, 2016 in
      // version 3.0.0. Use oj-choice-item instead.
      if (elementParent && (elementParent.hasClass('oj-choice-item') ||
                            elementParent.hasClass('oj-choice-row') || elementParent.hasClass('oj-choice-row-inline'))) {
        choiceItem = elementParent;
      } else {
        Logger.warn("The radioset/checkboxset's input and label dom should be wrapped in a dom " +
                       "node with class 'oj-choice-item'. JET is adding this missing dom to make the component work correctly.");

        // Since we can't find the oj-choice-item, create one.
        // It needs to wrap the input and its label (if any)
        ojChoiceItemSpanString = "<span class='oj-choice-item oj-choice-item-added'></span>";

        // the most common case is an <input id='foo'><label for='foo'> pair, so look for that first
        labelSelector = "label[for='" + this.element.attr('id') + "']";
        siblingLabel = this.element.siblings().filter(labelSelector);

        if (siblingLabel.length !== 0) {
          this.element.add(siblingLabel).wrapAll(ojChoiceItemSpanString); // @HTMLUpdateOK adding empty span for styling
          choiceItem = this.element.parent();
        } else {
          this.element.wrapAll(ojChoiceItemSpanString); // @HTMLUpdateOK adding empty span for styling
          choiceItem = this.element.parent();
        }
      }

      return choiceItem;
    },
    /**
     * Return the subcomponent node represented by the documented locator attribute values.
     * Test authors should target spinner sub elements using the following names:
     * <ul>
     * <li><b>oj-radiocheckbox-input</b>: the radio/checkbox's input</li>
     * <li><b>oj-radiocheckbox-label</b>: the radio/checkbox's label</li>
     * </ul>
     *
     * @expose
     * @override
     * @memberof oj._ojRadioCheckbox
     * @instance
     * @param {Object} locator An Object containing at minimum a subId property
     * whose value is a string, documented by the component, that allows the component to
     * look up the subcomponent associated with that string.  It contains:
     * <ul>
     * <li>
     * component: optional - in the future there may be more than one component
     *   contained within a page element
     * </li>
     * <li>
     * subId: the string, documented by the component, that the component expects
     * in getNodeBySubId to locate a particular subcomponent
     * </li>
     * </ul>
     * @returns {Element|null} the subcomponent located by the subId string
     * passed in locator, if found.
     */
    getNodeBySubId: function (locator) {
      var node = this._super(locator);
      if (!node) {
        var subId = locator.subId;
        if (subId === 'oj-radiocheckbox-input') {
          node = this.element[0];
        }
        if (subId === 'oj-radiocheckbox-label') {
          // this.label() returns a jquery object. we want to return a dom element
          node = this.label()[0];
        }
      }
      // Non-null locators have to be handled by the component subclasses
      return node || null;
    },

    /**
     * @ignore
     * @protected
     * @override
     */
    _destroy: function () {
      var ret = this._super();

      this._RemoveHoverable(this.$choiceItem);
      this._RemoveActiveable(this.$choiceItem);

      this._RemoveHoverable(this.$label);
      this._RemoveActiveable(this.$label);

      var type = this.options.type;

      // this.$label is the label for the checkbox/radio, NOT the label for the radioset/checkboxset.
      // We don't save and restore these attributes in base class, so we need to clean up ourselves
      if (type === 'checkbox') {
        this.$label.removeClass('oj-enabled oj-disabled oj-selected oj-checkbox-label');
      } else if (type === 'radio') {
        this.$label.removeClass('oj-enabled oj-disabled oj-selected oj-radio-label');
      }

      this.$choiceItem.removeClass('oj-enabled oj-disabled oj-selected');

      var self = this;

      // loop through each label to remove things we added
      $.each(self.$label, function () {
        var text = this.getElementsByClassName('oj-radiocheckbox-label-text');
        if (text !== undefined) {
          $(text[0].childNodes[0]).unwrap();
        }
      });

      // remove the oj-radiocheckbox-icon span around the element.
      this.element.unwrap();

      // remove the oj-choice-item span only if I added it.
      // I marked it with 'oj-choice-item-added' style.
      if (this.$choiceItem.hasClass('oj-choice-item-added')) {
        this.element.unwrap();
      }

      this.$choiceItem = null;
      this.$label = null;

      return ret;
    }

    /** ** end internal widget functions ****/

  });

});