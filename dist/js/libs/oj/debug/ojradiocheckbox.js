/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojeditablevalue'],
       function(oj, $)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
/*!
 * JET Radio This component is private. @VERSION
 */
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
oj.__registerWidget("oj._ojRadioCheckbox", $['oj']['baseComponent'],
{
  version : "1.0.0",  
  defaultElement : "<input>", 
  widgetEventPrefix : "oj", 
  options : 
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
    checked : null,
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
  /**** start Public APIs ****/
  /**
   * 
   * <p>This method does not accept any arguments.
   * 
   * @public
   * @expose
   * @memberof oj.RadioCheckbox 
   * @return {jQuery} the label(s) for the checkbox/radio input
  */
  label : function ()
  {
    if (this.$label === undefined)
    {
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
  refresh: function() 
  {
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
  refreshDisabled: function() 
  {
    // this looks at the effectivelyDisabled flag and updates the disabled attributes on the dom.
    this._renderDisabled();
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
  widget : function ()
  {
      return this.uiRadioCheckbox;
  },
          
   /**** end Public APIs ****/         
          
  /**** start internal widget functions ****/   
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
  _InitOptions: function(originalDefaults, constructorOptions)
  {
    var checkedFromDom, disabledFromDom;
    this._super(originalDefaults, constructorOptions);
    
    // CHECKED:
    // if options.checked is not set, get it from the element
    // if options.checked is set to a valid value (boolean), set it on the 
    // element to keep the two in sync (we do this in _CreateComponent->_setup)
    // 
    // use DOM value if not in constructorOptions
    if (!('checked' in constructorOptions))
    {
      this.initCheckedFromDom = true;
      checkedFromDom = !!this.element.prop("checked");
      // writeback not needed since "not in constructorOptions" means "not bound"
      this.option('checked', checkedFromDom, {'_context': {internalSet: true}});
    }
    if (typeof this.options.checked !== "boolean")
    {
      throw new Error("checked option must be a boolean");
    }
    // DISABLED:
    // if options.disabled is not set, get it from the element
    // if options.disabled is set to a valid value (boolean), set it on the 
    // element to keep the two in sync (we do this in _CreateComponent->_setup)
    // use DOM value if not in constructorOptions
    if (!('disabled' in constructorOptions))
    {
      // !! ensures it is a boolean
      disabledFromDom =  !!this.element.prop("disabled");
      // writeback not needed since "not in constructorOptions" means "not bound"
      this.option('disabled', disabledFromDom, {'_context': {internalSet: true}});
    }
    if (typeof this.options.disabled !== "boolean")
    {
      throw new Error("disabled option must be a boolean");
    } 
	
    // TYPE:
    // Gets the type which will be either radio or checkbox.
    // writeback not needed since "not in constructorOptions" means "not bound"
    if (!('type' in constructorOptions))
    {
      this.option('type', this.element.prop( "type" ), {'_context': {internalSet: true}});
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
  _ComponentCreate: function()
  {
    this._super();

    var type = this.options.type;
    if (type == "checkbox") {
        this.uiRadioCheckbox = this.element.addClass("oj-checkbox oj-component");
        this.$label = this._getLabelsForElement();
        this.$label.addClass("oj-checkbox-label");
    }
    else if (type == "radio") {
        this.uiRadioCheckbox = this.element.addClass("oj-radio oj-component");
        this.$label = this._getLabelsForElement();
        this.$label.addClass("oj-radio-label");
    }	
    this.$choiceRow = this._getChoiceRow();
    
    var self = this;
    this._focusable( this.element );
    // loop through each label
    $.each(self.$label, function ()
    {   
      // wrap child in span
      $(this.childNodes[0]).wrap("<span class='oj-radiocheckbox-label-text'></span>"); //@HTMLUpdateOK

      var iElem = document.createElement("span"); 
      iElem.setAttribute("class", "oj-radiocheckbox-icon");
      this.appendChild(iElem); //@HTMLUpdateOK
      
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
  _SaveAttributes : function (element)
  {
    this._savedClasses = element.attr("class");
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
  _RestoreAttributes : function ()
  {
    // restore the saved "class" attribute. Setting class attr to undefined is a no/op, so
    // if this._savedClasses is undefined we explicitly remove the 'class' attribute.
    if (this._savedClasses)
      this.element.attr("class", this._savedClasses);   
    else
      this.element.removeAttr("class");
  },
  /* _setup called during creation */
  _setup : function() 
  {
    this._renderDisabled();

    if (!this.initCheckedFromDom) 
    {
      // if we got it from the dom in _InitOptions, there is no need to reset it on the dom in _setup
      this._setCheckedOnDom(this.options.checked);     
    }
    this.element.toggleClass("oj-selected", this.options.checked);
    // set selected on corresponding label.
    this.$label.toggleClass("oj-selected", this.options.checked);
  },
  _setCheckedOnDom : function(checked)
  {
    // !! to turn checked into a boolean
    checked = !!checked;
  
    this.element.prop("checked", checked);
  },
  _renderDisabled : function()
  {
    // Determines whether this component is effectively disabled, 
    // i.e. it has its 'disabled' option set to true or 
    // it has been disabled by its ancestor component
    var effectivelyDisabled = this._IsEffectivelyDisabled();
    if (effectivelyDisabled)
    {
      // set the dom to show DISABLED, but do NOT change the disabled option!
      // 
      // when a dom element supports disabled, use that, and not aria-disabled.
      // having both is an error.
      this.element.prop("disabled", true).removeAttr( "aria-disabled")
       .removeClass("oj-enabled").addClass("oj-disabled");

      this.$label.removeClass("oj-enabled")
       .addClass("oj-disabled");
      if (this.$choiceRow) 
      {
        this.$choiceRow.removeClass("oj-enabled").addClass("oj-disabled");
      }
    }
    else // option not set to disabled. nor is parent. On refresh this is ok, since we get it from the option.
    {
      // when a dom element supports disabled, use that, and not aria-disabled.
      // having both is an error.
      this.element.prop("disabled", false)
      .removeAttr( "aria-disabled").removeClass("oj-disabled")
      .addClass("oj-enabled");
      this.$label.addClass("oj-enabled")
      .removeClass("oj-disabled"); 
      if (this.$choiceRow)
      {
        this.$choiceRow.addClass("oj-enabled").removeClass("oj-disabled");
      }
    }
  },
  /**
   * @override
   * @private
   */
  _setOption : function (key, value)
  {

    this._superApply(arguments);

    if (key === "disabled")
    {
      value = !!value;
      this._renderDisabled(value);
    }
 
    if (key === "checked")
    {
      this._setCheckedOnDom(value);
      this.element.toggleClass("oj-selected", value);
      this.$label.toggleClass("oj-selected", value);
      if (this.$choiceRow)
        this.$choiceRow.toggleClass("oj-selected", value);

    }
  }, 
  /**
   * Returns the list of labels for the element. Most likely this will be 
   * one label, not multiple labels.
   * We do not guarantee that the returned list is live
   * We do not guarantee that the returned list is in document order
   * We first check if we are nested in a label, and then we check a jquery 
   * selector query on <label>s with a 'for' id equal to our id.
   * NOTE: The .labels DOM property does not work on most browsers, so we don't use it.
   * e.g,
   * <pre>
   * <input id="opt3" type="checkbox" name="rb" value="opt3">
   * <label for="opt3">Checkbox Option 3</label>
   * </pre>
   * @private
   */
  _getLabelsForElement: function() 
  {
    // .closest("label") - For each element in the set, get the first element   
    // that matches the selector by testing the element itself and traversing up 
    // through its ancestors in the DOM tree.   
    var labelClosestParent = this.element.closest("label");
    var id = this.element.prop("id");
    var labelForQuery = "label[for='" + id + "']";
    // combine these two query results to return the label we are nested in
    //  and/or the label with the for attribute pointing to the checkbox's id.
    return labelClosestParent.add($(labelForQuery)); 
  },
  /**
   * @private
   * @returns {Object|null}
   */
  _getChoiceRow: function()
  {
    var choiceRow;
    if (this.$label)
    {
      choiceRow = this.$label.parent();
      if (choiceRow && (choiceRow.hasClass("oj-choice-row") || choiceRow.hasClass("oj-choice-row-inline")))
      {
        return choiceRow;
      }
    }

    oj.Logger.warn("The radioset/checkboxset's input and label dom should be wrapped in a dom " +
      "node with class 'oj-choice-row' or 'oj-choice-row-inline'");
    return null;
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
  getNodeBySubId: function(locator)
  {
    var node = this._super(locator);    
    if (!node)
    {
      var subId = locator['subId'];
      if (subId === "oj-radiocheckbox-input") {
        node = this.element[0];
      }
      if (subId === "oj-radiocheckbox-label") {
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
  _destroy : function ()
  {  
    var ret = this._super();
    var type = this.options.type;
    
    // this.$label is the label for the checkbox/radio, NOT the label for the radioset/checkboxset.
    // We don't save and restore these attributes in base class, so we need to clean up ourselves
    if (type == "checkbox") 
    {
      this.$label.removeClass("oj-enabled oj-disabled oj-selected oj-checkbox-label");
    }
    else if (type == "radio") 
    {
      this.$label.removeClass("oj-enabled oj-disabled oj-selected oj-radio-label");
    }
    if (this.$choiceRow)
      this.$choiceRow.removeClass("oj-enabled oj-disabled oj-selected");
    
    var self = this;

    // loop through each label to remove things we added
    $.each(self.$label, function ()
    { 
      var span = this.getElementsByClassName("oj-radiocheckbox-icon");
      this.removeChild(span[0]);
      var text = this.getElementsByClassName("oj-radiocheckbox-label-text");
      if (text !== undefined)
        $(text[0].childNodes[0]).unwrap();
    });

    return ret;
  }
  
  /**** end internal widget functions ****/ 
 
});
});
