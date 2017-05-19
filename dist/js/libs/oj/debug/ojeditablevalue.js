/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'hammerjs', 'ojs/ojjquery-hammer', 'ojs/ojcomponentcore', 'ojs/ojvalidation-base', 'ojs/ojpopup'], 
  /*        
    * @param {Object} oj         
    * @param {jQuery} $        
    * @param {Object} Hammer        
  */       
  function(oj, $, Hammer)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @class JET Editable Component Utils
 * @export
 * @since 0.6
 * 
 */
oj.EditableValueUtils = {};

// S T A T I C    V A R S   
/**
 * The various contexts under which validation can be run by component.
 * @ignore
 */ 
oj.EditableValueUtils.validationContext = {
  COMPONENT_CREATE : 1,
  CONVERTER_OPTION_CHANGE : 2,
  DISABLED_OPTION_CHANGE : 3,
  READONLY_OPTION_CHANGE: 4,
  REFRESH_METHOD: 5,
  REQUIRED_OPTION_CHANGE : 6,
  RESET_METHOD : 7,
  USER_ACTION: 8,
  VALIDATE_METHOD: 9,
  VALIDATORS_OPTION_CHANGE : 10,
  VALUE_OPTION_CHANGE: 11
};

/**
 * Default validation options used by validate method.
 * @ignore
 */ 
oj.EditableValueUtils.validateMethodOptions = {doValueChangeCheck: false,
                               validationContext: oj.EditableValueUtils.validationContext.VALIDATE_METHOD};

/**
 * Default validation options used when converter option changes
 * @ignore
 */
oj.EditableValueUtils.converterOptionOptions = {doNotClearMessages: true,
                                validationContext: oj.EditableValueUtils.validationContext.CONVERTER_OPTION_CHANGE};
                              
/**
 * Default validation options used when disabled option changes
 * @ignore
 */
oj.EditableValueUtils.disabledOptionOptions = {doNotClearMessages: true,
                               validationContext: oj.EditableValueUtils.validationContext.DISABLED_OPTION_CHANGE};

/**
 * Default validation options used when required option changes
 * @ignore
 */
oj.EditableValueUtils.requiredOptionOptions = {doNotClearMessages: true,
                               validationContext: oj.EditableValueUtils.validationContext.REQUIRED_OPTION_CHANGE};

/**
 * Default validation options used when readOnly option changes
 * @ignore
 */
oj.EditableValueUtils.readOnlyOptionOptions = {doNotClearMessages: true,
                               validationContext: oj.EditableValueUtils.validationContext.READONLY_OPTION_CHANGE};

/**
 * Default validation options used when refresh method is called.
 * @ignore
 */
oj.EditableValueUtils.refreshMethodOptions = {doNotClearMessages: true,
                               validationContext: oj.EditableValueUtils.validationContext.REFRESH_METHOD};
/**
 * Default validation options used when validators option changes
 * @ignore
 *  */
oj.EditableValueUtils.validatorsOptionOptions = {doNotClearMessages: true,
                                 validationContext: oj.EditableValueUtils.validationContext.VALIDATORS_OPTION_CHANGE};                      

/**
* String used in the id on the span that surrounds the help icon.
* @const
* @private
* @ignore
* @type {string}
*/
var _REQUIRED_ICON_ID = "_requiredIcon";
/**
 * This method is called during _InitOptions() to initialize a component option value from DOM. This 
 * uusally is the case when the option value is undefined, 
 * i.e., this.options.optionName === undefined.
 * <br/>
 * Returns the attribute value for the given attribute on the element appropriately converted, or 
 * the default, if the attribute isn't set on the element.<br/>
 * 
 * @param {Object} element the element the component is initialized with.
 * @param {string} attribute the name of the element's attribtue. Example, value, disabled etc.
 * 
 * @returns {Object} a JSON object containing the following properties - <br/>
 * <ul>
 * <li><b>fromDom</b> - whether the option value was initialized from DOM. When true the option's 
 * value is written back (to observable).</li> 
 * <li><b>value</b> - the option value. the attribute value or the default if the attribute isn't 
 * set on the element.</li> 
 * </ul>
 * 
 * @private
 */
oj.EditableValueUtils.getAttributeValue = function (element, attribute)
{
  var result, attrVal, propVal, returnVal = {}; 
  
  if (element && attribute)
  {
    switch (attribute)
    {
      case "disabled" :
        result = element.attr("disabled") !== undefined ? 
          !!element.prop("disabled") : undefined;
        break;
        
      case "pattern":
        result = element.prop("pattern") || undefined; 
        break; 
        
      case "placeholder":
        result = element.prop("placeholder") || undefined;
        break;
        
      case "readonly": 
        result = element.attr("readonly") !== undefined ? 
          !!element.prop("readonly") : undefined; 
        break;
      
      case "required":
        attrVal = element.attr("required");
        propVal = element.prop("required");

        // If attribute is present and not undefined
        //   - In IE9, required attribute is not supported at all, so attr() is defined, prop() is 
        //   undefined. In such cases set default to !!attrVal
        //   - Otherwise set to !!propVal
        // If neither attr is undefined then use defaultValue
        // TODO: review needed 
        result = (attrVal !== undefined) ? 
          ((propVal !== undefined) ? !!propVal : !!attrVal) : undefined;
        
        break;
      
      case "title":
        result = element.attr("title") !== undefined ? 
          element.prop("title") : undefined;
        break;
        
      case "value":
        // element attribute may not be set, in which case default to null
        result = element.val() || undefined;
        break;
      
      case "min": 
        //same logic for min + max as in default
      case "max":
      
      default: 
        result = element.attr(attribute) || undefined;
        break;
    }
  }
  
  if (result !== undefined)
  {
    returnVal.fromDom = true;
    returnVal.value = result;
  }
  else
  {
    returnVal.fromDom = false;
    // returnVal.value = defaultValue; 
  }
  return returnVal;
};

/**
 * Called from component._InitOptions() with an array of options
 * that the component might need to initialize from DOM (e.g.,
 * disabled, required, title, etc). This function loops through each of these and if the 
 * constructorOptions[option] is undefined, it tries to get the option from DOM.
 * The constructorOptions hold the options that the page author sets on the component, usually via
 * knockout bindings, and that takes precedence over DOM.
 * e.g., <input id="id" type="text" required data-bind="ojComponent: {component: 'ojInputText', 
                                  value: value}"/>
 * value is a constructorOption and required is a DOM option in this example. If you have:
 * e.g., <input id="id" type="text" required data-bind="ojComponent: {component: 'ojInputText', 
                                  value: value, required: false}"/>
 * required is both a constructorOption of false and a DOM of true. The constructorOption takes
 * precedence.
 * <p>
 * IMPORTANT: Do not call this method after component has been created, since option values are 
 * mutated directly after that point.</p>
 * 
 * The 'final' value an option uses/initializes from, can come from these places (in order of least 
 * to most likely) - <br/>
 * <ol>
 * <li>component default - this is the widget default </li><br/>
 * <li>app default - this is what a page author defines for the value in the page/app</li> <br/>
 * <li>dom value - if your option also has a dom attribute, this is the value set on element for 
 * component. </li> <br/>
 * <li>constructor value - this is the value page author sets on the component binding </li><br/>
 * </ol>
 * 
 * At the time _InitOptions is called, (1), (2) and (4) are merged, but this may not be the value a 
 * component wants for the option, especially when (4) is undefined. For example, if these values 
 * were set for a component - <br/>
 * (1) - 'foo'<br/>
 * (2) - 'bar'<br/>
 * (3) - 'lucy'<br/>
 * (4) - undefined<br/>
 * <p>
 * at the time _InitOptions is called, this.options.option is set to 'bar'. But because DOM value 
 * wins over app default or component default, the component needs to check if the constructor value was 
 * undefined and if so, set option to the dom value which is 'lucy' in this example. This is what
 * this function does.<br/>
 * This method always defaults the value to be - this.options.option -  
 * because we think if neither (3) nor (4) is set, then the value from (2) should win. <br/>
 * </p>
 * 
 * @param {Object} props Array holding Object-literal that a component provides 
 * with the following properties that helps determine the final value for one or more options.
 * 
 * @property {string} props.attribute - name of DOM attribute
 * @property {string|undefined} props.option - name of the option if different from attribute name.
 * 
 * @property {Function|boolean|undefined} props.coerceDomValue - if the DOM value is set and 
 * coercing the dom value is needed, then either set to boolean true, which uses the default 
 * coercion rules for common attributes (a), or provide a custom callback (b). <p>
 * E.g., 'value' option for input number, input date etc. have special rules for coercing the value,
 *  so thse provide a custom callback. For common attributes like required and disabled, set the 
 *  value to true so the default oj.EditableValueUtils#coerceDomValueForOption method gets used.
 *  
 * @property {boolean|undefined} props.validateOption - if set to true, then it calls 
 * oj.EditableValueUtils.validateValueForOption method to validate the option.
 * 
 * @param {Object} constructorOptions the options set on the component instance, often using 
 * component binding. (this is the value page author sets on the component binding)
 * @param {Object} comp component instance.
 * @param {Function=} postprocessCallback - optional callback that will receive a map of initialized
 * options for post-processing
 *  
 * @public
 */
oj.EditableValueUtils.initializeOptionsFromDom = function (props, constructorOptions, comp, postprocessCallback)
{
  var initializedOptions = {};
  
  // Loop through props to initialize option 
  for (var i = 0; i < props.length; i++)
  {
    var finalValue, result, prop = props[i], 
        attribute = prop.attribute, 
        option = prop.option || attribute, 
        coerceDomValue = prop.coerceDomValue,
        validateOption = prop.validateOption,
        element = comp.element, 
        previousValue = comp.options[option];

    /* The precedence for the value that an option uses is as follows from lowest to highest -
     *
     * (1) component default - this is the widget default, already merged in to comp.options
     * (2) app default - this is what a page author defines for the value in the page / app,
     * already merged in to comp.options
     * (3) dom value - if your option also has a dom attribute, this is the value set on element. 
     * (4) constructor value - this is the value page author sets on the component binding, already
     * merged in to comp.options.
     *      
     * When (4) is undefined then attempt to default from (3). 
     */

    // Step 1: use DOM value
    if (constructorOptions[option] === undefined)
    {
      previousValue = comp.options[option];
      result = oj.EditableValueUtils.getAttributeValue(element, attribute);

      // if we are using domValue then coerce the dom value before writing to options and trigegr 
      // option change so the value is written back (to ko)
      if (result.fromDom)
      {
        finalValue = result.value;

        // only required needs coercing so not bad
        if (coerceDomValue) 
        {
          if (typeof coerceDomValue === "boolean")
          {
            finalValue = oj.EditableValueUtils.coerceDomValueForOption(option, finalValue);
          }
          else if (typeof coerceDomValue === "function")
          {
            finalValue = coerceDomValue.call(comp, finalValue);
          }
        }
        initializedOptions[option] = finalValue;
      }
    }
    
    var valueToValidate = (option in initializedOptions) ? initializedOptions[option] : previousValue;

    // Step 2: validate the option value if needed
    if (validateOption)
    {
      if (typeof validateOption === "boolean")
      {
        oj.EditableValueUtils.validateValueForOption(option, valueToValidate);
      }
    }
  }
  
  if (postprocessCallback != null)
  {
    postprocessCallback(initializedOptions);
  }
  
  comp.option(initializedOptions, {'_context': {writeback: true, internalSet: true}});
};

  /**
   * Validates value set for the option and throws error if invalid.
   * 
   * @param {string} option name of the option. Validates options common to all edtiableValue 
   * holders.
   * @param {string|Object|boolean|number|undefined} value of the option that is validated
   * 
   * @throws {Error} if option value is invalid
   * @public
   */
  oj.EditableValueUtils.validateValueForOption = function (option, value)
  {
    var error = false;
    
    switch (option)
    {
      case 'required' :
        if (value !== null &&  typeof value !== "boolean")
        {
          error = true; 
        }
        break;
      
      case "readOnly":
      case "disabled" :
        if (value !== null &&  typeof value !== "boolean")
        {
          error = true;
        }
        
        break;
    }
    
    if (error)
    {
      throw "Option '" + option + "' has invalid value set: " + value;
    }
  };
  
  
  /**
   * Coerces the dom value being used for the option, and throws error if invalid.
   * 
   * @param {string} option name of the option.
   * @param {string|Object|boolean|number|null} domValue dom value that is being coerced to the 
   * option value
   * @throws {Error} if domValue cannot be coerced appropriately
   * @public
   */
  oj.EditableValueUtils.coerceDomValueForOption = function(option, domValue) 
  { 
    var coerced = domValue;
    switch (option)
    {
      case 'required' :
        coerced = domValue ? true : false;
        break;
    }
    
    return coerced;
  };


/**
 * set pickerAttributes on a popup picker
 *
 * @param {jQuery} picker popup picker
 * @param {Object} pickerAttributes supported attributes are class and style, which are appended to the picker class and style, if any.
 *
 * @ignore
 */
oj.EditableValueUtils.setPickerAttributes = function (picker, pickerAttributes)
{
  // - let the popup picker accept the custom css class name from the component
  if (picker && pickerAttributes)
  {
    var classValue = pickerAttributes["class"];
    if (classValue)
      picker.addClass(classValue);

    var styleValue = pickerAttributes["style"];
    if (styleValue)
    {
      var currStyle = picker.attr("style");
      if (currStyle)
      {
        picker.attr("style", currStyle + ';' + styleValue);
      }
      else
      {
        picker.attr("style", styleValue);
      }
    }
  }
};

/**
 * Validates the component's display value using the converter and all validators registered on 
 * the component and updates the <code class="prettyprint">value</code> option by performing the 
 * following steps. 
 * 
 * <p>
 * <ol> 
 * <li>All messages are cleared, including custom messages added by the app. </li>
 * <li>If no converter is present then processing continues to next step. If a converter is 
 * present, the UI value is first converted (i.e., parsed). If there is a parse error then 
 * the <code class="prettyprint">messagesShown</code> option is updated and method returns false.</li>
 * <li>If there are no validators setup for the component the <code class="prettyprint">value</code> 
 * option is updated using the display value and the method returns true. Otherwise all 
 * validators are run in sequence using the parsed value from the previous step. The implicit 
 * required validator is run first if the component is marked required. When a validation error is 
 * encountered it is remembered and the next validator in the sequence is run. </li>
 * <li>At the end of validation if there are errors, the <code class="prettyprint">messagesShown</code> 
 * option is updated and method returns false. If there were no errors, then the 
 * <code class="prettyprint">value</code> option is updated and method returns true.</li>
 * </ol>
 * 
 * @returns {boolean} true if component passed validation, false if there were validation errors.
 * 
 * @example <caption>Validate component using its current value.</caption>
 * // validate display value. 
 * $(.selector).ojInputText('validate');
 * 
 * @ignore
 * @private
 */
oj.EditableValueUtils.validate =  function ()
{
  // clear all messages; run full validation on display value
  return this._SetValue(this._GetDisplayValue(), null, this._VALIDATE_METHOD_OPTIONS);
};

/**
 * Refresh everything that needs refreshing when the required option is toggled:
 * refreshes theming, aria-required, label.
 *  
 * Used by EditableValue components that support the required option.
 * The component links to this function like this:
 *   _refreshRequired : oj.EditableValueUtils._refreshRequired,
 * @param {Object=} value the current value of the required option
 * @private
 * @ignore
 */
oj.EditableValueUtils._refreshRequired = function(value)
{
  var id;
  var contentNode;
  var ariaValue;
  var ariaRequiredUnsupported = this._AriaRequiredUnsupported();
  
  this._refreshTheming("required", value);
  // refresh aria-required
  // Most inputs/selects need aria-required on the input element (aka 'content')
  // But it is not legal to have aria-required on radio/checkboxes.
  if (!ariaRequiredUnsupported)
  { 
    contentNode = this._GetContentElement();

    ariaValue = value; //(value == "required") ? true : false;
    if (ariaValue && contentNode) 
      contentNode.attr("aria-required", ariaValue);
    else
    contentNode.removeAttr("aria-required");
  }


  if (!this.$label)
    this._createOjLabel();
  // need to keep the label's required in sync with the input's required
  if (this.$label)
  { 
    this.$label._ojLabel("option", "showRequired", value);
   
    if (ariaRequiredUnsupported)
    {
      // if aria-labelledby is set, 
      // add/remove aria-describedby to the inputs pointing to
      // the label+"_requiredIcon". 
      id = this._getAriaLabelledById(this.element);
      if (id)
      {   
        if (value)
          this._addAriaDescribedBy(id + _REQUIRED_ICON_ID);
        else
          this._removeAriaDescribedBy(id + _REQUIRED_ICON_ID);
      }
    } 
  }
};
 
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
 * @private
 * @ignore
 */  
oj.EditableValueUtils._AfterSetOptionRequired = function (option)
{
  // refresh hints, theming and aria to reflect new state
  this._refreshRequired(this._IsRequired());
  this._runMixedValidationAfterSetOption(oj.EditableValueUtils.requiredOptionOptions);
};

/**
   * When validators option changes, take the following steps.
   * 
   * - Clear the cached normalized list of all validator instances. push new hints to messaging.<br/>
   * - if component is valid -> validators changes -> no change<br/>
   * - if component is invalid has messagesShown -> validators changes -> clear all component 
   * messages and re-run full validation on displayValue. if there are no errors push value to 
   * model;<br/>
   * - if component is invalid has messagesHidden -> validators changes -> do nothing; doesn't change 
   * the required-ness of component <br/>
   * - messagesCustom is not cleared.<br/>
   * 
   * NOTE: The behavior applies to any option that creates implicit validators - min, max, pattern, 
   * etc. Components can call this method when these options change.
   * 
   * @returns {undefined}
   * @private
   * @ignore
   */
  oj.EditableValueUtils._AfterSetOptionValidators = function ()
  {
    var runFullValidation = false;
    
    // resets all validators and pushes new hints to messaging
    this._ResetAllValidators();
    
    if (this._hasInvalidMessagesShowing())
    {
      runFullValidation = true;
    }
    
    if (runFullValidation)
    {
      this._clearComponentMessages();
      this._updateValue(oj.EditableValueUtils.validatorsOptionOptions);
    }
  };
  /**
   * Performs post processing after converter option changes by taking the following steps.
   * 
   * - always push new converter hint to messaging <br/>
   * - if component has no errors -> refresh UI value<br/>
   * - if component is invalid has messagesShown -> clear all component errors and run full 
   * validation using display value. <br/>
   * &nbsp;&nbsp;- if there are validation errors, value is not pushed to model; messagesShown is 
   * updated.<br/>
   * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to 
   * listen to optionChange(value) to clear custom errors.<br/>
   * - if component is invalid has messagesHidden -> refresh UI value. no need to run deferred 
   * validations. <br/>
   * - messagesCustom is never cleared<br/>
   * 
   * @param {String} option
   * 
   * @returns {undefined}
   * @private
   * @ignore
   */
    // called when 'converter' option changed, usually from option/setOption calls
  oj.EditableValueUtils._AfterSetOptionConverter = function (option)
  {
    var runFullValidation = false;
    
    // clear the cached converter instance and push new hint to messaging
    this._ResetConverter();

    if (this._hasInvalidMessagesShowing())
    {
      runFullValidation = true;
    }
    
    if (runFullValidation)
    {
      this._clearComponentMessages();
      this._updateValue(oj.EditableValueUtils.converterOptionOptions);
    }
    else
    {
      // refresh UI display value when there are no errors or where there are only deferred errors 
      this._Refresh(option, this.options[option], true);
    }
  };
  /**
   * Clears the cached converter stored in _converter and pushes new converter hint to messaging.
   * Called when convterer option changes 
   * 
   * @private
   * @ignore
   */
  oj.EditableValueUtils._ResetConverter = function ()
  {
    this._converter = null;
    this._getComponentMessaging().update(
            this._getMessagingContent(this._MESSAGING_CONTENT_UPDATE_TYPE.CONVERTER_HINT));
  };
  /**
   * Returns an array of all validators built by merging the validators option set on the component 
   * and the implicit validators setup by the component. <br/>
   * This does not include the implicit required validator. Components can override to add to this 
   * array of validators.
   * 
   * @return {Array} of validators
   * 
   * @private
   * @ignore
   */
  oj.EditableValueUtils._GetNormalizedValidatorsFromOption = function ()
  {
    var i;
    var isValidatorInstance = true;
    var normalizedValidators = [];
    var validator;
    var validatorsOption;
    var vOptions;
    var vType;
    var vTypeStr;
          

    validatorsOption = this.options['validators']; 

    if (validatorsOption)
    {
      // Normalize validators 
      for (i = 0; i < validatorsOption.length; i++)
      {
        validator = validatorsOption[i];
        if (typeof validator === "object") 
        {
          // check if we have an actual validator instance that implements the validate() method
          // oj.Validation.__doImplementsCheck(validator, oj.Validator);
          if (!(validator['validate'] && typeof validator['validate'] === "function"))
          {
            isValidatorInstance = false;
          }

          if (!isValidatorInstance)
          {
            // we maybe dealing with an object literal
            // {'type': 'numberRange', 'options': { 'min': 100, 'max': 1000,
            //                                    'hint': {'min': 'some hint about min'}}}
            vTypeStr = validator['type'];
            if (vTypeStr && typeof vTypeStr === "string")
            {
              vType = oj.Validation.validatorFactory(vTypeStr);
              if (vType)
              {
                vOptions = oj.CollectionUtils.copyInto({}, validator['options']) || {};
                // we push converter into the options if not provided explicitly. This is to allow
                // validators to format values shown in the hint and messages
                vOptions['converter'] = vOptions['converter'] || this._GetConverter();
                vOptions['label'] = vOptions['label'] || this._getLabelText();
                validator = vType.createValidator(vOptions);
              }
              else
              {
                oj.Logger.error("Unable to locate a validatorFactory for the requested type: " + vTypeStr);
              }
            }
          }

          normalizedValidators.push(validator);
        }
        else
        {
          oj.Logger.error("Unable to parse the validator provided:" + validator);
        }
      }

    }
    return normalizedValidators;
  };
  /**
   * Returns the normalized converter instance.
   * 
   * @return {Object} a converter instance or null
   * 
   * @private
   * @ignore
   */
  oj.EditableValueUtils._GetConverter = function () 
  {
    var converterOption;
    
    // this._converter holds the instance
    if (!this._converter)
    {
      converterOption = this.options['converter'];
      this._converter = oj.IntlConverterUtils.getConverterInstance(converterOption);
    }
    
    return this._converter || null;
  };
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true*/

/**
 * A messaging strategy that uses an instance of ojPopup component to show and hide messaging content.
 *
 * @param {Array.<string>} displayOptions an array of messaging artifacts displayed in the popup. e.g,
 * 'messages', 'converterHints', 'validationHints', 'title'.
 * @constructor
 * @extends {oj.MessagingStrategy}
 * @private
 */
oj.PopupMessagingStrategy = function (displayOptions)
{
  this.Init(displayOptions); 
};

/**
 * Registers the PopupMessagingStrategy constructor function with oj.ComponentMessaging.
 *
 * @private
 */
oj.ComponentMessaging.registerMessagingStrategy(oj.ComponentMessaging._DISPLAY_TYPE.NOTEWINDOW,
oj.PopupMessagingStrategy);

// Subclass from oj.MessagingStrategy
oj.Object.createSubclass(oj.PopupMessagingStrategy, oj.MessagingStrategy, "oj.PopupMessagingStrategy");

/**
 * Messaging popup defaults for components, by component type. A special 'default' type defines the
 * defaults for most editableValue components.
 * The following properties are available -
 * 'events' - these specify the on handlers for events that are setup to open and close popups
 * 'position' - specifies the type of element the popup is positioned against.
 * @private
 */
oj.PopupMessagingStrategy._DEFAULTS_BY_COMPONENT =
{
  // mouseenter and mouseleave is what you want instead of mouseover/mouseout when the launcher
  // isn't a simple input. In the case of radioset and checkboxset, the launcher is the widget
  // which is the div that contains all the rows, inputs and labels. If we use mouseover/mouseout
  // in this case we are constantly opening and closing the popup (not really visible to the user,
  // but still not good for performance I'm sure) if the user moves the mouse around the different
  // dom elements within the widget.
  //
  // on touch devices: the "press" event name maps to Hammer's press event, so a touch and hold
  // will open the popup.
  "ojRadioset":
  {
    position: 'launcher',
    // when press opens popup, the user taps elsewhere to dismiss popup
    events: {open: "focusin mouseenter press", close: "mouseleave"}
  },
  "ojCheckboxset":
  {
    position: 'launcher',
    // when press opens popup, the user taps elsewhere to dismiss popup
    events: {open: "focusin mouseenter press", close: "mouseleave"}
  },
  // Since we now add extra dom on the input components for inline messages, we don't want to
  // position on the tip of the component root. Instead we want to position on the main part of the
  // component, which is in a lot of cases the launcher. In the case of inputDate/Time/Number,
  // it's the launcher's parent (inputDate/Time/Number wrap input and buttons with a parent).
  "ojInputText":
  {
    position: 'launcher',
    events: {open: "focusin"}
  },
  "ojTextArea":
  {
    position: 'launcher',
    events: {open: "focusin"}
  },
  "ojInputPassword":
  {
    position: 'launcher',
    events: {open: "focusin"}
  },
  "ojSwitch":
  {
    position: 'launcher',
    events: {open: "focusin mouseover", close: "mouseout"}
  },
  "ojSlider":
  {
    position: 'launcher',
    events: {open: "focusin mouseover", close: "mouseout"}
  },
  "ojColorSpectrum":
  {
    position: 'launcher',
    events: {open: "focusin mouseenter", close: "mouseleave"}
  },
  "ojColorPalette":
  {
    position: 'launcher',
    events: {open: "focusin mouseenter", close: "mouseleave"}
  },
  "default":
  {
    position: 'launcher-wrapper',
    events: {open: "focusin"}
  }
};

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT = "oj-form-control-hint";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT_CONVERTER = "oj-form-control-hint-converter";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT_VALIDATOR = "oj-form-control-hint-validator";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT_TITLE = "oj-form-control-hint-title";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategy._OPEN_NAMESPACE = ".ojPopupMessagingOpen";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategy._CLOSE_NAMESPACE = ".ojPopupMessagingClose";

/**
 * Sets up a tooltip for the component instance using the messaging content provided.
 *
 * @param {Object} cm a reference to an instance of oj.ComponentMessaging that provides access to
 * the latest messaging content.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @override
 * @instance
 */
oj.PopupMessagingStrategy.prototype.activate = function (cm)
{
  oj.PopupMessagingStrategy.superclass.activate.call(this, cm);
  this._initMessagingPopup();
};

/**
 * Reinitializes with the new display options and updates component messaging using the new content.
 *
 * @param {Array.<string>} newDisplayOptions
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 * @override
 */
oj.PopupMessagingStrategy.prototype.reactivate = function (newDisplayOptions)
{
  oj.PopupMessagingStrategy.superclass.reactivate.call(this, newDisplayOptions);
  this._updatePopupIfOpen();
};

oj.PopupMessagingStrategy.prototype.update = function ()
{
  oj.PopupMessagingStrategy.superclass.update.call(this);
  this._updatePopupIfOpen();
};

/**
 * Cleans up messages on the component and destroys any widgets it created.
 *
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 * @override
 */
oj.PopupMessagingStrategy.prototype.deactivate = function ()
{
  this._unregisterLauncherEvents();
  this._destroyTooltip();
  oj.PopupMessagingStrategy.superclass.deactivate.call(this);
};
/**
 * Close the popup if it is open. EditableValue calls this from _NotifyHidden and _NotifyDetached
 * so that we don't have an open popup if the app dev hides a subtree the component is within.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype.close = function ()
{
  this._closePopup();
};
/**
 * Closes the associated notewindow popup
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._closePopup = function ()
{
  if (this._isPopupInitialized())
  {
    this.$messagingContentRoot.ojPopup("close");
  }
};

/**
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._initMessagingPopup = function ()
{
  if (!this._openPopupCallback)
    this._registerLauncherEvents();
};

/**
 * Opens a popup. This handler is called in the context of the launcher usually the this.element or
 * some relevant node the messaging popup is associated to.
 *
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._openPopup = function (event)
{
  var domNode;
  var latestContent;
  var $launcher;

  
  if (this._canOpenPopup())
  {

    latestContent = this._buildPopupHtml();
    if (oj.StringUtils.isEmptyOrUndefined(latestContent))
      return;

    var messagingContentRoot = this._getPopupElement();
    var isPopupOpen = messagingContentRoot.ojPopup("isOpen");

    // replace popup messaging content with new content
    domNode = oj.PopupMessagingStrategyPoolUtils.getPopupContentNode(messagingContentRoot);

    // latestContent is includes content that may come from app. It is scrubbed for illegal tags
    // before setting to innerHTML
    domNode.innerHTML = ""; // @HTMLUpdateOK
    domNode.innerHTML = latestContent; // @HTMLUpdateOK

    if (!isPopupOpen)
    {
      $launcher = this.GetLauncher();
      if (event.type === "press")
      {
        this._openPopupOnPressEvent($launcher);
      }

      messagingContentRoot.ojPopup("open", $launcher);
    }
    else if (isPopupOpen)
    {
      messagingContentRoot.ojPopup("refresh");
    }
  }
};

/**
 * This is called to open the popup on the 'press' event. E.g., ojCheckboxset and ojRadioset
 * use press to open the popup.
 * @param {Object|null} jqLauncher
 */
oj.PopupMessagingStrategy.prototype._openPopupOnPressEvent = function (jqLauncher)
{
  this._inPressEvent = true;

  // We add these event listeners when we open the popup as a result of the 'press' event
  // and we are going to remove them when we close the popup, as well as when we unregister
  // launcher events to make doubly sure they aren't lying around.
  /// Use capture phase to make sure we cancel it before any regular bubble listeners hear it.
  jqLauncher[0].addEventListener("click", this._eatChangeAndClickOnPress, true);
  // need to eat 'change' as well. Otherwise the dialog will close on press up, and the input
  // stays unchecked.
  // This is because when the input  gets the 'change' event, it calls validate,
  // which then updates messages, and if there is no message,
  // then calls _updatePopupIfOpen, contentToShow = "", then it closes the popup.
  jqLauncher[0].addEventListener("change", this._eatChangeAndClickOnPress, true);

  // touchend/mousedown/change/click happen in fast succession on tap or press.
  // Android never fires a click event on press up, so after 50ms we clear the inPressEvent flag
  // since the _eatChangeAndClickOnPress callback never gets called for Android.
  jqLauncher.one("touchend", function (event)
  {
    // 50ms.  Make as small as possible to prevent unwanted side effects.
    setTimeout(function ()
    {
      this._inPressEvent = false;
    }, 50);
  });
};

/**
 * The pressHold gesture fires a click and change event on ios after touchend.  Prevent that here.
 * @private
 */
oj.PopupMessagingStrategy.prototype._eatChangeAndClickOnPress = function (event)
{
      // on ios:
      // if I tap quickly on an input, I get on div: touchstart/touchend/mousedown/change/click
      // if I tap and hold on an input, I get: touchstart
      // when I let up, I get: touchend/mousedown/change/click
      // on android:
      // if I tap quickly on an input, I get touchstart touchend mousedown click change
      // if I tap and hold on an input, I get touchstart/mousedown
      // when I let up, I get touchend. (no change or click like I do for ios)

      // After 'press' release of a radio or checkbox if we do not eat the the click and change events,
      // the dialog closes.
      if (this._inPressEvent)
      {
        // For Mobile Safari capture phase at least,
        // returning false doesn't work; must use pD() and sP() explicitly.
        event.preventDefault();
        event.stopPropagation();
        // the event order is first change, then click.
        // so when we get the click, clear the inPressEvent flag.
        if (event.type === "click")
          this._inPressEvent = false;
      }
};
    
/**
 * Determines whether the messaging popup can be opened.
 * @return {boolean}
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._canOpenPopup = function ()
{
  var options = this.GetComponent().options;
  var isDisabled = options['disabled'] || false;
  var isReadOnly = options['readOnly'] || false;

  return !(isDisabled || isReadOnly);
};

/**
 * If the popup is already open its contents need to updated when update() or reactivate() is called.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._updatePopupIfOpen = function ()
{
  var contentToShow;
  var domNode;
  var isLauncherActiveElement;
  var isPopupOpen = false;
  var launcher;
  var messagingContentRoot;

  if (this._isPopupInitialized())
  {
    messagingContentRoot = this._getPopupElement();
    isPopupOpen = messagingContentRoot.ojPopup("isOpen");
    contentToShow = this._buildPopupHtml();
    launcher = this.GetLauncher();
    if (launcher == null)
      return;
    isLauncherActiveElement = document.activeElement === this.GetLauncher()[0] ? true : false;
    if (isPopupOpen)
    {
      if (contentToShow)
      {
        // push new content into popup
        domNode = oj.PopupMessagingStrategyPoolUtils.getPopupContentNode(messagingContentRoot);

        // contentToShow is includes content that may come from app. It is scrubbed for illegal tags
        // before setting to innerHTML
        domNode.innerHTML = ""; // @HTMLUpdateOK
        domNode.innerHTML = contentToShow; // @HTMLUpdateOK
        messagingContentRoot.ojPopup("refresh");
      }
      else
      {
        // if there is no content to show and popup is currently open, close it.
        messagingContentRoot.ojPopup("close");
      }
    }
    else if (isLauncherActiveElement && contentToShow)
    {
      // if popup is closed but focus is on activeElement re-open it
      this._openPopup(undefined);
    }
  }
};

/**
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._unregisterLauncherEvents = function ()
{
  var compDefaults;
  var events;
  var jqLauncher = this.GetLauncher();

  compDefaults = oj.PopupMessagingStrategy._DEFAULTS_BY_COMPONENT[this.GetComponent().widgetName];
  events = compDefaults ?
  compDefaults.events : oj.PopupMessagingStrategy._DEFAULTS_BY_COMPONENT["default"].events;

  // Remove event handlers setup on launcher
  jqLauncher.off(oj.PopupMessagingStrategy._OPEN_NAMESPACE);
  jqLauncher.off(oj.PopupMessagingStrategy._CLOSE_NAMESPACE);
  jqLauncher[0].removeEventListener("click", this._eatChangeAndClickOnPress, true);
  jqLauncher[0].removeEventListener("change", this._eatChangeAndClickOnPress, true);

  if (oj.DomUtils.isTouchSupported())
  {
    jqLauncher.ojHammer().off("press");
    jqLauncher.ojHammer("destroy");
    jqLauncher.off("contextmenu", this._eatContextMenuOnOpenPopupListener);
    this._eatContextMenuOnOpenPopupListener = null;
    this._inPressEvent = null;
  }
  this._openPopupCallback = null;
  this._closePopupCallback = null;
};

/**
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._registerLauncherEvents = function ()
{
  var closeEvents;
  var closePopupCallback;
  var compDefaults;
  var events;
  var hammerOptions;
  var jqLauncher = this.GetLauncher();
  var nonPressOpenEvents;
  var openPopupCallback;
  var pressEventIndex;

  compDefaults = oj.PopupMessagingStrategy._DEFAULTS_BY_COMPONENT[this.GetComponent().widgetName];
  events = compDefaults ? compDefaults.events :
           oj.PopupMessagingStrategy._DEFAULTS_BY_COMPONENT["default"].events;

  // 1. associate the ojPopup component to wrapper <div> for popup content
  // 2. wire up on() event handlers for registered events that open and close popup. E.g., focusin.
  // 3. autoDismissal happens automatically when focus leaves component. For other events like
  // mouseover it's required to call off()
  if (events['open'])
  {
    openPopupCallback = this._openPopupCallback;
    if (!openPopupCallback)
      openPopupCallback = this._openPopupCallback = this._openPopup.bind(this);
    
    // separate out press event, namespace the events string, and attach event handler
    pressEventIndex = events['open'].indexOf("press");
    nonPressOpenEvents = 
    this._getNamespacedEvents(events['open'].replace("press", ''), 
                              oj.PopupMessagingStrategy._OPEN_NAMESPACE);
    jqLauncher.on(nonPressOpenEvents, openPopupCallback);
    
    // The pressHold gesture also fires a contextmenu event on Windows 10 touch.  
    // Prevent that here.
    if (oj.DomUtils.isTouchSupported())
    {
      this._eatContextMenuOnOpenPopupListener = function (event)
      {
        return false;
      };

      jqLauncher.on("contextmenu", this._eatContextMenuOnOpenPopupListener);

      // for radios and checkboxes, on ios, press hold brings up popup, but release closes it
      // and checks it, so in this case we have to eat the click/change events. this happens
      // in the openPopupCallback
      if (pressEventIndex !== -1)
      {
        hammerOptions = {
          "recognizers": [
            [Hammer.Press, {time: 750}]
          ]};
        jqLauncher.ojHammer(hammerOptions).on("press", openPopupCallback);
      }
    }
  }

  if (events['close'])
  {
    closePopupCallback = this._closePopupCallback;
    if (!closePopupCallback)
      closePopupCallback = this._closePopupCallback = this._closePopup.bind(this);

    closeEvents = this._getNamespacedEvents(events['close'], 
      oj.PopupMessagingStrategy._CLOSE_NAMESPACE);
    jqLauncher.on(closeEvents, closePopupCallback);
  }
};

/**
 * Turn the events string into an array, add namespace, and turn it back into a string.
 * @param {string} events e.g., "focusin mousedown"
 * @param {string} namespace the namespace that starts with a dot
 * @return {string|null} the events string that is namespaced. 
 * e.g., "focusin.ojPopupMessagingOpen mousedown.ojPopupMessagingOpen"
 * @private
 */
oj.PopupMessagingStrategy.prototype._getNamespacedEvents = function(events, namespace)
{
  var eventsArray;
  var namespacedEventsArray;
  var length;
      
  if (events === "" || namespace === "")
    return events;

  eventsArray = events.split(" ");
  length = eventsArray.length;
  namespacedEventsArray = [];
  
  for (var i=0; i < length; i++)
  {
    // ignore ""
    if (eventsArray[i])
      namespacedEventsArray.push(eventsArray[i] + namespace);
  }
  
  return namespacedEventsArray.join(" ");
};

/**
 * Returns the popup position options.
 * Components like radio and checkboxset use the launcher, which is the inputs.
 * Since we now add extra dom for inline messages, we don't want to position
 * on the tip of the component root. Instead we want to position on the main part of the component,
 * which is in a lot of cases the launcher. In the case of inputDate/Time/Number, it's the launcher's
 * parent.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._getPopupPosition = function ()
{
  var compDefaultPosition;
  var compDefaults;
  var launcher;
  var popupPositionOptions;

  compDefaults =
  oj.PopupMessagingStrategy._DEFAULTS_BY_COMPONENT[this.GetComponent().widgetName];
  compDefaultPosition = compDefaults ? compDefaults.position :
  oj.PopupMessagingStrategy._DEFAULTS_BY_COMPONENT["default"].position;

  if (compDefaultPosition)
  {
    if (compDefaultPosition === "launcher")
    {
      launcher = this.GetLauncher();
    }
    else if (compDefaultPosition === "launcher-wrapper")
    {
      launcher = this.GetLauncher().parent();
    }
  }
  // should never get here since the _DEFAULTS_BY_COMPONENTS["default"] should cover it.
  if (!launcher)
    launcher = this.GetComponent().widget();

  popupPositionOptions = {
    'my': 'start bottom',
    'at': 'end top',
    'collision': 'flipcenter',
    'of': launcher
  };
  return popupPositionOptions;

};

/**
 * Returns a jquery element that a messaging popup is bound to.
 *
 * @return {jQuery!} messaging popup pool container
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._getPopupElement = function ()
{
  var popup;
  var position;

  if (this.$messagingContentRoot)
    return this.$messagingContentRoot;

  popup = oj.PopupMessagingStrategyPoolUtils.getNextFreePopup();
  position = this._getPopupPosition();
  popup.ojPopup("option", "position", position);
  popup.ojPopup("option", "close", this._popupCloseCallback.bind(this));
  popup.ojPopup("option", "open", this._popupOpenCallback.bind(this));

  this.$messagingContentRoot = popup;
  return this.$messagingContentRoot;
};

/**
 * Popup open event listener that changes the popups autoDismiss to focusLoss
 * in a timeout of 10ms.  This timeout period gives the browser time to fire
 * events that might follow a click such as a focus event.  This is to allow
 * validation by a button versus a component instance.
 *
 * @param {jQuery.event=} event
 * @memberof! oj.PopupMessagingStrategy
 * @private
 */
oj.PopupMessagingStrategy.prototype._popupOpenCallback = function (event)
{
  var target = $(event.target);
  var self = this;
  window.setTimeout(function ()
  {
    if (oj.Components.isComponentInitialized(target, "ojPopup"))
      target.ojPopup("option", "autoDismiss", "focusLoss");
    else
      delete self.$messagingContentRoot;
  }, 10);
};

/**
 * Popup closed event listener that will reset the popups state and free it into the
 * pool of available messaging popups.
 * @param {jQuery.event=} event
 * @memberof! oj.PopupMessagingStrategy
 * @private
 */
oj.PopupMessagingStrategy.prototype._popupCloseCallback = function (event)
{
  var jqLauncher, popupContent, target;
  jqLauncher = this.GetLauncher();

  target = $(event.target);
  if (oj.Components.isComponentInitialized(target, "ojPopup"))
  {
    target.ojPopup("option", "autoDismiss", "none");
    target.ojPopup("option", "open", null);
    target.ojPopup("option", "close", null);
  }
  
  jqLauncher[0].removeEventListener("click", this._eatChangeAndClickOnPress, true);
  jqLauncher[0].removeEventListener("change", this._eatChangeAndClickOnPress, true);
    
  this.$messagingContentRoot = null;
  this._inPressEvent = null;

  popupContent = $(oj.PopupMessagingStrategyPoolUtils.getPopupContentNode(target));
  popupContent.empty();
};

/**
 * @memberof! oj.PopupMessagingStrategy
 * @private
 * @instance
 */
oj.PopupMessagingStrategy.prototype._destroyTooltip = function ()
{
  this._closePopup();
  oj.PopupMessagingStrategyPoolUtils.destroyFreePopup();
};

/**
 * Returns the content to show inside popup.
 * @private
 * @return {String|string} content
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._buildPopupHtml = function ()
{
  var addSeparator = false;
  var document = this.GetComponent().document[0];
  var nwContent = [];
  var nwHtml = "";

  if (this.ShowMessages())
  {
    nwContent.push(this._buildMessagesHtml(document));
  }

  if (this.ShowConverterHint() || this.ShowValidatorHint() || this.ShowTitle())
  {
    nwContent.push(this._buildHintsHtml(document));
  }

  $.each(nwContent, function (i, content)
  {
    if (content)
    {
      if (addSeparator)
      {
        nwHtml = nwHtml.concat(oj.PopupMessagingStrategyUtils.getSeparatorHtml(document));
      }
      else
      {
        addSeparator = true;
      }

      nwHtml = nwHtml.concat(content);
    }
  });

  return nwHtml;
};

/**
 * Returns the messages html (e.g., error messages, confirmation messages), not hints
 * @param {Document} document
 * @return {string} content
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._buildMessagesHtml = function (document)
{
  var content = "";
  var maxSeverity = this.GetMaxSeverity();
  var messages;
  var renderSeveritySelectors = false;

  if (this.HasMessages())
  {
    messages = this.GetMessages();
    content =
    oj.PopupMessagingStrategyUtils.buildMessagesHtml(
    document, messages, maxSeverity, renderSeveritySelectors);
  }
  return content;
};

/**
 * All hints including title
 * @param {Document} document
 * @return {string} html content for all hints.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._buildHintsHtml = function (document)
{
  var hint;
  var hints = [];
  var hintsHtml = "";
  var i;

  if (this.ShowConverterHint())
  {
    hints = this.GetConverterHint();
    hint = hints.length ? hints[0] : "";
    hintsHtml += oj.PopupMessagingStrategyUtils.buildHintHtml(document,
    oj.PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT_CONVERTER,
    hint, false,
    oj.PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT);
  }

  if (this.ShowValidatorHint())
  {
    hints = this.GetValidatorHints();
    for (i = 0; i < hints.length; i++)
    {
      hintsHtml += oj.PopupMessagingStrategyUtils.buildHintHtml(document,
      oj.PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT_VALIDATOR,
      hints[i], false, oj.PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT);
    }
  }

  if (this.ShowTitle())
  {
    hintsHtml += oj.PopupMessagingStrategyUtils.buildHintHtml(document,
    oj.PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT_TITLE,
    this.GetTitle(), true, oj.PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT);
  }

  return hintsHtml ? "<div class='oj-form-control-hints'>" + hintsHtml + "</div>" : "";
};

/**
 * Determines if there is a message popup currently associated with the component
 * strategy.
 * @return {boolean}
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._isPopupInitialized = function ()
{
  // is(":oj-popup") finds the popup component if it exists
  return (this.$messagingContentRoot) ?
  oj.Components.isComponentInitialized(this.$messagingContentRoot, "ojPopup") : false;
};

/**
 * @ignore
 */
oj.PopupMessagingStrategyUtils = {};

/**
 * Renders the html content for a single hint.
 * @param {Document} document
 * @param {string} selector
 * @param {string} hintText
 * @param {boolean} htmlAllowed
 * @param {string} formControlSelectors
 *
 * @return {string} html content for a single hint.
 * @public
 */
oj.PopupMessagingStrategyUtils.buildHintHtml = function (document, selector, hintText, htmlAllowed, formControlSelectors)
{
  var jTitleDom;
  if (hintText)
  {
    jTitleDom = $(document.createElement("div"));
    formControlSelectors += " " + selector;
    jTitleDom.addClass(formControlSelectors);

    jTitleDom.append(oj.PopupMessagingStrategyUtils._getTextDom(document, hintText, htmlAllowed)); // @HTMLUpdateOK
  }

  return jTitleDom ? jTitleDom.get(0).outerHTML : "";
};

/**
 * @param {number} severity
 * @returns (string} translated string for the severity
 * @public
 */
oj.PopupMessagingStrategyUtils.getSeverityTranslatedString = function (severity)
{
  var sevTypeStr;
  // get the translated string for the severity
  switch (severity)
  {
    case oj.Message.SEVERITY_LEVEL['FATAL']:
      sevTypeStr = oj.Translations.getTranslatedString('oj-message.fatal');
      break;
    case oj.Message.SEVERITY_LEVEL['ERROR']:
      sevTypeStr = oj.Translations.getTranslatedString('oj-message.error');
      break;
    case oj.Message.SEVERITY_LEVEL['WARNING']:
      sevTypeStr = oj.Translations.getTranslatedString('oj-message.warning');
      break;
    case oj.Message.SEVERITY_LEVEL['INFO']:
      sevTypeStr = oj.Translations.getTranslatedString('oj-message.info');
      break;
    case oj.Message.SEVERITY_LEVEL['CONFIRMATION']:
      sevTypeStr = oj.Translations.getTranslatedString('oj-message.confirmation');
      break;
  }

  return sevTypeStr;
};

/**
 * @param {Document} document
 * @returns {string}
 * @public
 */
oj.PopupMessagingStrategyUtils.getSeparatorHtml = function (document)
{
  var jSeparatorDom;
  jSeparatorDom = $(document.createElement("hr"));

  return jSeparatorDom ? jSeparatorDom.get(0).outerHTML : "";
};

/**
 * Returns the messages html (e.g., error messages, confirmation messages), not hints
 * @param {Document} document
 * @param {Array} messages
 * @param {number} maxSeverity
 * @param {boolean} renderSeveritySelectors
 * @return {string} content
 * @private
 * @memberof oj.PopupMessagingStrategyUtils
 * @instance
 */
oj.PopupMessagingStrategyUtils.buildMessagesHtml =
function (document, messages, maxSeverity, renderSeveritySelectors)
{
  var content = "";
  var detail;
  var i;
  var j;
  var message;
  var messagesByType = [];
  var messagesByTypes = {};
  var messageObj;
  var severityLevel;
  var severityStr;
  var summary;


  // Step1: build an indexed array of messages by severity level.
  for (i = 0; i < messages.length; i++)
  {
    message = messages[i];

    if (!(message instanceof oj.Message))
    {
      messageObj = new oj.Message(message['summary'], message['detail'], message['severity']);
    }
    else
    {
      messageObj = message;
    }

    severityLevel = oj.Message.getSeverityLevel(messageObj['severity']);
    if (!messagesByTypes[severityLevel])
    {
      messagesByTypes[severityLevel] = [];
    }

    messagesByTypes[severityLevel].push(messageObj);
  }

  // Step 2: starting with maxSeverity level build messages with decreasing severity
  for (i = maxSeverity; i >= oj.Message.SEVERITY_LEVEL['CONFIRMATION']; i--)
  {
    messagesByType = messagesByTypes[i] || [];

    for (j = 0; j < messagesByType.length; j++)
    {
      message = messagesByType[j];
      oj.Assert.assertPrototype(message, oj.Message);

      severityLevel = oj.Message.getSeverityLevel(message['severity']);
      severityStr = oj.PopupMessagingStrategyUtils.getSeverityTranslatedString(severityLevel);
      summary = message['summary'] || severityStr;

      // if detail is empty we don't care to duplicate summary. also detail if present can be
      // formatted html content (ADF feature)
      detail = message['detail'] || "";
      content = content.concat(
      oj.PopupMessagingStrategyUtils.buildMessageHtml(
      document, summary, detail, severityLevel, renderSeveritySelectors));
    }
  }
  return content;

};

/**
 * Builds the HTML content for a single message
 * @param {Document} document
 * @param {string} summary
 * @param {string} detail
 * @param {number} severityLevel
 * @returns {string}
 * @public
 */
oj.PopupMessagingStrategyUtils.buildMessageHtml =
function (document, summary, detail, severityLevel, addSeverityClass)
{
  var $msgContent;
  var $msgDetail;
  var $msgDom;
  var $msgIcon;
  var $msgSummary;
  var severityStr = oj.PopupMessagingStrategyUtils.getSeverityTranslatedString(severityLevel);

  // build message
  // (x) <Summary Text>
  // <Detail Text>
  $msgDom = $(document.createElement("div"));
  $msgDom.addClass(oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE);

  if (addSeverityClass)
    $msgDom.addClass(oj.PopupMessagingStrategyUtils._getSeveritySelector(severityLevel));

  // build msg icon
  $msgIcon = $(document.createElement("span"));
  $msgIcon.addClass(oj.PopupMessagingStrategyUtils._getSeverityIconSelector(severityLevel))
  .attr("title", severityStr)
  .attr("role", 'img');

  $msgDom.append($msgIcon); // @HTMLUpdateOK

  // build msg content which includes summary and detail
  $msgContent = $(document.createElement("span"));
  $msgContent.addClass(oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_CONTENT);

  $msgSummary = $(document.createElement("div"));
  $msgSummary.addClass(oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_SUMMARY).text(summary);

  $msgContent.append($msgSummary); // @HTMLUpdateOK

  if (detail)
  {
    // detail text allows html content. So scrub it before setting it.
    var detailDom = oj.PopupMessagingStrategyUtils._getTextDom(document, detail, true);
    $msgDetail = $(document.createElement("div"));

    $msgDetail.addClass(oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_DETAIL).append(detailDom); // @HTMLUpdateOK
    $msgContent.append($msgDetail);
  }

  $msgDom.append($msgContent); // @HTMLUpdateOK

  return $msgDom ? $msgDom.get(0).outerHTML : "";
};

/**
 * @param {number} severity
 * @return {string} the icon selector for the severity
 * @private
 */
oj.PopupMessagingStrategyUtils._getSeverityIconSelector = function (severity)
{
  var sevIconStr;
  // get the icon selector for the severity
  switch (severity)
  {
    case oj.Message.SEVERITY_LEVEL['FATAL']:
      sevIconStr = oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_ERROR_ICON;
      break;
    case oj.Message.SEVERITY_LEVEL['ERROR']:
      sevIconStr = oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_ERROR_ICON;
      break;
    case oj.Message.SEVERITY_LEVEL['WARNING']:
      sevIconStr = oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_WARNING_ICON;
      break;
    case oj.Message.SEVERITY_LEVEL['INFO']:
      sevIconStr = oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_INFO_ICON;
      break;
    case oj.Message.SEVERITY_LEVEL['CONFIRMATION']:
      sevIconStr = oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_CONFIRMATION_ICON;
      break;
  }

  return oj.PopupMessagingStrategyUtils._DEFAULT_STATUS_ICON_SELECTORS + sevIconStr;
};

/**
 * @param {number} severity
 * @return {string} the style selector for the severity
 * @private
 */
oj.PopupMessagingStrategyUtils._getSeveritySelector = function (severity)
{
  var sevSelectorStr;
  // get the icon selector for the severity
  switch (severity)
  {
    case oj.Message.SEVERITY_LEVEL['FATAL']:
      sevSelectorStr = oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_ERROR;
      break;
    case oj.Message.SEVERITY_LEVEL['ERROR']:
      sevSelectorStr = oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_ERROR;
      break;
    case oj.Message.SEVERITY_LEVEL['WARNING']:
      sevSelectorStr = oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_WARNING;
      break;
    case oj.Message.SEVERITY_LEVEL['INFO']:
      sevSelectorStr = oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_INFO;
      break;
    case oj.Message.SEVERITY_LEVEL['CONFIRMATION']:
    default:
      sevSelectorStr = oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_CONFIRMATION;
      break;
  }

  return sevSelectorStr;
};


/**
 *  if content is html clean html by allowing only legal tags before returning, to safeguard from
 *  script injection errors.
 *
 * @param {Document} document
 * @param {string} value
 * @param {boolean=} htmlAllowed if value can have html content
 *
 * @return {Element} dom node containing the scrubbed hint
 * @private
 */
oj.PopupMessagingStrategyUtils._getTextDom = function (document, value, htmlAllowed)
{
  var textDom = null;

  if (oj.StringUtils.isString(value))
  {
    if (htmlAllowed && oj.DomUtils.isHTMLContent(value))
    {
      // strip out html start/end tags
      textDom = oj.DomUtils.cleanHtml(value.substring(6, value.length - 7));
    }
    else
    {
      textDom = document.createElement("span");
      textDom.textContent = value;
    }
  }

  return textDom;
};

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._DEFAULT_STATUS_ICON_SELECTORS = "oj-component-icon oj-message-status-icon ";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE = "oj-message";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_SUMMARY = "oj-message-summary";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_DETAIL = "oj-message-detail";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_CONTENT = "oj-message-content";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_ERROR_ICON = "oj-message-error-icon";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_WARNING_ICON = "oj-message-warning-icon";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_INFO_ICON = "oj-message-info-icon";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_CONFIRMATION_ICON = "oj-message-confirmation-icon";

// new theming keys so that we can style the different types of messages differently. Like,
// the background-color can be light red for error. This style will go on the same dom node
// as the oj-message selector.
/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_ERROR = "oj-message-error";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_WARNING = "oj-message-warning";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_INFO = "oj-message-info";

/**
 * @private
 * @const
 * @type {string}
 */
oj.PopupMessagingStrategyUtils._SELECTOR_MESSAGE_CONFIRMATION = "oj-message-confirmation";

/**
 * @ignore
 */
oj.PopupMessagingStrategyPoolUtils = {};

/**
 * @public
 * @returns {jQuery} popup taken or created from the free pool
 */
oj.PopupMessagingStrategyPoolUtils.getNextFreePopup = function ()
{
  var pool = oj.PopupMessagingStrategyPoolUtils._getPool();
  var popups = pool.find("." + oj.PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING);
  var popup;

  if (popups.length === 0)
  {
    popup = $(oj.PopupMessagingStrategyPoolUtils._getPopupContentHtml()).hide();
    // popup is an empty div
    popup.appendTo(pool); // @HTMLUpdateOk
    var popupOptions =
    {
      'initialFocus': 'none',
      'tail': 'simple',
      'autoDismiss': 'none',
      'modality': 'modeless',
      'animation': {'open': null, 'close': null}
    };
    popup.ojPopup(popupOptions);
  }
  else
    popup = $(popups[0]);

  return popup;
};

/**
 * Passed in the root dom element of the message popup and returns the content element.
 *
 * @param {jQuery} popup root element
 * @returns {Element} content element of message popup
 */
oj.PopupMessagingStrategyPoolUtils.getPopupContentNode = function (popup)
{
  return popup.find("." + oj.PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING_CONTAINER)[0];
};

/**
 * @public
 */
oj.PopupMessagingStrategyPoolUtils.destroyFreePopup = function ()
{
  var popup;
  if (oj.PopupMessagingStrategyPoolUtils._getFreePoolCount() > 0)
  {
    // if the message popup is open, remove it.
    // if there is at least one popup in the pool, remove it.
    popup = oj.PopupMessagingStrategyPoolUtils.getNextFreePopup();
    popup.ojPopup("destroy");
    popup.remove();
  }
};

/**
 * Returns a div appended to the body that is a common pool of notewindow popups
 * used internally by editable value holders.
 *
 * @return {jQuery!} messaging popup pool container
 * @private
 */
oj.PopupMessagingStrategyPoolUtils._getPool = function ()
{
  /** @type {jQuery!} */
  var pool = $("#" + oj.PopupMessagingStrategyPoolUtils._MESSAGING_POPUP_POOL_ID);
  if (pool.length > 0)
    return pool;

  pool = $("<div>");
  pool.attr("id", oj.PopupMessagingStrategyPoolUtils._MESSAGING_POPUP_POOL_ID);
  pool.attr("role", "presentation");
  pool.appendTo($(document.body)); // @HTMLUpdateOk

  return pool;
};

/**
 * @return {number} number of unused popup in the pool
 * @private
 */
oj.PopupMessagingStrategyPoolUtils._getFreePoolCount = function ()
{
  var pool = oj.PopupMessagingStrategyPoolUtils._getPool();
  var popups = pool.find("." + oj.PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING);
  return popups.length;
};

/**
 * @return {string} messaging popup html
 * @private
 */
oj.PopupMessagingStrategyPoolUtils._getPopupContentHtml = function ()
{
  return '<div class="' + oj.PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING + '">' +
    '<div class="' + oj.PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING_CONTAINER + '"></div>' +
    '</div>';
};

/**
 * @const
 * @private
 * @type {string}
 */
oj.PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING_CONTAINER = "oj-messaging-popup-container";

/**
 * @const
 * @private
 * @type {string}
 */
oj.PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING = "oj-messaging-popup";

/**
 * @const
 * @private
 * @type {string}
 */
oj.PopupMessagingStrategyPoolUtils._MESSAGING_POPUP_POOL_ID = "__oj_messaging_popup_pool";

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

(function ()
{
  /**
  * String used in the id on the span that surrounds the help icon.
  * @const
  * @private
  * @type {string}
  */
  var _HELP_ICON_ID = "_helpIcon";
  /**
  * String used in the id on the span that surrounds the required icon.
  * @const
  * @private
  * @type {string}
  */
  var _REQUIRED_ICON_ID = "_requiredIcon";

  /*!
   * JET Label This component is private. @VERSION
   */
  /**
   * The _ojLabel component is a private component. It is not meant to be used
   * on a label element directly. Instead EditableValue components
   * use the _ojLabel component in the internal implementation.
   * <p>
   * The _ojLabel component decorates the input component's label with
   * extra dom for the required icon and help information (help
   * icon, help description, and help external url). If oj-label* styles are on
   * the label element, then the _ojLabel element will move them onto its root
   * dom element.
   * <p>
   * Screen readers need to know that the input is associated with the help (and required
   * for radioset/checkboxset components) icons.
   * We do this by rendering on the input an aria-describedby id if this ojLabel has a 'for'
   * attribute. This is done in EditableValue.
   * </p>
   * <h3 id="keyboard-section">
   *   Keyboard End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
   * </h3>
   * <p>You can hover over the help and the required icons for additional information. You can
   * set focus with the keyboard on the help icon for additional information. You can click on
   * the help icon and if there is an url associated with it, it will navigate to the url.
   * </p>
   * @ojcomponent oj._ojLabel
   * @private
   * @augments oj.baseComponent
   */
  oj.__registerWidget("oj._ojLabel", $['oj']['baseComponent'],
  {
    version: "1.0.0",
    defaultElement: "<label>",
    widgetEventPrefix: "oj",
    options:
    {
      /**
       * The help information that goes on the label.  The help options are:
       * <ul>
       * <li>definition -this is the help definition text. It is what shows up
       * when the user hovers over the help icon, or tabs into the help icon, or press
       * and holds the help icon on a mobile device. No formatted text is available for
       * help definition attribute.</li>
       * <li>source - this is the help source url.
       * If present, a help icon will
       * render next to the label For security reasons
       *  we only support urls with protocol http: or https:.
       * If the url doesn't comply we ignore it and throw an error.
       * Pass in an encoded URL since we do not encode the URL.
       * </ul>
       *
       * @expose
       * @memberof oj._ojLabel
       * @instance
       * @type {Object.<string, string>}
       * @default <code class="prettyprint">{help : {definition' :null, source: null}}</code>
       *
       * @example <caption>Initialize the label with the help definition and external url information:</caption>
       * $( ".selector" )._ojLabel({ help: {definition:"some help definition", source:"some external url" } });
       *
       * @example <caption>Set the <code class="prettyprint">help</code> option, after initialization:</caption>
       *
       * // setter
       * $( ".selector" )._ojLabel( "option", "help", {definition:"fill out the name", source:"http://www.oracle.com" } );
       */
      help:
      {
        /**
         * <p>help definition text.  See the top-level <code class="prettyprint">help</code> option for details.
         *
         * @expose
         * @alias help.definition
         * @memberof! oj._ojLabel
         * @instance
         * @type {?string}
         * @default <code class="prettyprint">{help : {definition :null, source: null}}</code>
         *
         * @example <caption>Get or set the <code class="prettyprint">help.definition</code> sub-option, after initialization:</caption>
         * // getter
         * var definitionText = $( ".selector" )._ojLabel( "option", "help.definition" );
         *
         * // setter:
         * $( ".selector" )._ojLabel( "option", "help.definition", "Enter your name" );
         */
        definition: null,
        /**
         * <p>help source url.  See the top-level <code class="prettyprint">help</code> option for details.
         *
         * @expose
         * @alias help.source
         * @memberof! oj._ojLabel
         * @instance
         * @type {?string}
         * @default <code class="prettyprint">null</code>
         *
         * @example <caption>Get or set the <code class="prettyprint">help.source</code> sub-option, after initialization:</caption>
         * // getter
         * var helpSource = $( ".selector" )._ojLabel( "option", "help.source" );
         *
         * // setter:
         * $( ".selector" )._ojLabel( "option", "help.source", "www.abc.com" );
         */
        source: null

      },
      /**
       * Whether this label should have a required icon.  Allowed values for
       * showRequired are 'true' and 'false', 'false' being the default.
       * @expose
       * @type {?boolean}
       * @default <code class="prettyprint">false</code>
       * @public
       * @instance
       * @memberof oj._ojLabel
       */
      showRequired: false,
      /**
       * Allows you to set certain attributes on the root dom element.
       * For _ojLabel, we use 'class' only. The input components (via
       * EditableValue) set a styleclass on the _ojLabel's root in case
       * component-specific label styling is needed. For example, ojradioset
       * would pass class: 'oj-radioset-label'. ojinputtext would pass class:
       * 'oj-inputtext-label'.
       *
       * @example <caption>Initialize root dom element with the set of
       * <code class="prettyprint">rootAttributes</code>:</caption>
       * $(".selector")._ojLabel("option", "rootAttributes", {
       *   'class': 'oj-inputtext-label'
       * });
       *
       * @expose
       * @access public
       * @memberof oj._ojLabel
       * @instance
       * @type {Object}
       * @default <code class="prettyprint">{ id: null, class: null, style:null }</code>
       */
      rootAttributes: null
    },
    /**
     * @private
     * @const
     */
    _BUNDLE_KEY:
    {
      _TOOLTIP_HELP: 'tooltipHelp',
      _TOOLTIP_REQUIRED: 'tooltipRequired'
    },
    /**** start Public APIs ****/

    /**
     * Returns a jQuery object containing the root dom element of the label
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof oj._ojLabel
     * @instance
     * @return {jQuery} the label
     */
    widget: function ()
    {
      return this.uiLabel;
    },
    /**
     * Refreshes the required and help dom.
     * @example <caption>Clear messages and refresh component.</caption>
     * $(selector).ojInputText("option", "messages", []); <br/>
     * $(selector).ojInputText("refresh");
     * component
     * @access public
     * @instance
     * @expose
     * @memberof oj._ojLabel
     */
    refresh: function ()
    {
      this._super();
      this._refreshRequired();
      this._refreshHelp();
    },
    /**** end Public APIs ****/

    /**** start internal widget functions ****/
    /**
     * Overridden to make sure describedById option is set
     *
     * @memberof oj._ojLabel
     * @instance
     * @protected
     */
    _InitOptions: function (originalDefaults, constructorOptions)
    {
      this._super(originalDefaults, constructorOptions);
      this._checkRequiredOption();
    },
    /**
     * After _ComponentCreate and _AfterCreate,
     * the widget should be 100% set up. this._super should be called first.
     * @override
     * @protected
     * @instance
     * @memberof oj._ojLabel
     */
    _ComponentCreate: function ()
    {
      this._super();

      this._touchEatClickNamespace = this.eventNamespace + "TouchEatClick";
      this._touchEatContextMenuNamespace = this.eventNamespace + "TouchEatContextMenu";
      this._helpDefPopupNamespace = this.eventNamespace + "HelpDefPopup";
      this._bTouchSupported = oj.DomUtils.isTouchSupported();

      this._drawOnCreate();
    },
    /**
     * <p>Save only the 'class' attribute since that is what
     * we manipulate. We don't have to save all the attributes.
     * </p>
     *
     * @param {Object} element - jQuery selection to save attributes for
     * @protected
     * @memberof oj._ojLabel
     * @instance
     * @override
     */
    _SaveAttributes: function (element)
    {
      this._savedClasses = element.attr("class");
    },
    /**
     * <p>Restore what was saved in _SaveAttributes
     * </p>
     *
     * @protected
     * @memberof oj._ojLabel
     * @instance
     * @override
     */
    _RestoreAttributes: function ()
    {
      // restore the saved "class" attribute. Setting class attr to undefined is a no/op, so
      // if this._savedClasses is undefined we explicitly remove the 'class' attribute.
      if (this._savedClasses)
        this.element.attr("class", this._savedClasses);
      else
        this.element.removeAttr("class");
    },
    /**
     * Notifies the component that its subtree has been removed from the document programmatically
     * after the component has been created
     * @memberof! oj._ojLabel
     * @instance
     * @protected
     */
    _NotifyDetached: function ()
    {
      this._superApply(arguments);
      this._handleCloseHelpDefPopup();
    },
    /**
     * Notifies the component that its subtree has been made hidden programmatically
     * after the component has been created
     * @memberof! oj._ojLabel
     * @instance
     * @protected
     */
    _NotifyHidden: function ()
    {
      this._superApply(arguments);
      this._handleCloseHelpDefPopup();
    },
    /**
     * set up styles on create
     * @private
     */
    _drawOnCreate: function ()
    {
      var helpSpan = null;
      var labelElementId;
      var requiredSpan = null;

      // wrap the label with a root dom element (oj-label) and its child
      // (oj-label-group). Then point this.uiLabel to the root dom element.
      this.uiLabel = this.element.wrap(this._createRootDomElement()) // @HTMLUpdateOK
      .closest(".oj-component");
      
      this._addIdsToDom();

      labelElementId = this.element.attr("id");
      this.helpSpanId = labelElementId + _HELP_ICON_ID;
      this.requiredSpanId = labelElementId + _REQUIRED_ICON_ID;

      // move an oj-label styles off of this.element, and put on the
      // root dom element. They are restored in _destroy
      this._moveLabelStyleClassesToRootDom();
      
      // we put a span with an id on it around the help icon and 
      // a span with an id on it around the required icon so that
      // the input's aria-describedby can point to it, if needed. Then the screen reader will
      // read the aria-label on the images when focus is on the input, so the user knows
      // that there is help and/or required icons. NOTE: For all form controls except radioset
      // and checkboxset, aria-required on the form control reads required. So no need to
      // put aria-describedby on those. For radioset/checkboxsets, they put their own
      // aria-describedby since they have a link to the ojLabel via their labelledby attribute.
      // 

      if (this.options.showRequired)
      {
        // render required
        requiredSpan = this. _createIconSpan(this.requiredSpanId);      
        requiredSpan.appendChild(this._createRequiredIconDomElement()); // @HTMLUpdateOK
      }
      
      if (this._needsHelpIcon())
      {
        helpSpan = this. _createIconSpan(this.helpSpanId);
        this._createHelp(helpSpan);
      }
    },
    /**
     * Create help if needed
     * @private
     */
    _createHelp: function (helpSpan)
    {
      var helpDef;
      var helpSource;
      var helpIconAnchor;
      
      if (this._needsHelpIcon())
      {
        helpDef = this.options.help['definition'];
        helpSource = this.options.help['source'];
        helpIconAnchor = this._createHelpIconAnchorDomElement(helpDef, helpSource);
        // .prepend: Insert content, specified by the parameter, to the beginning of each element
        $(helpSpan).prepend(// @HTMLUpdateOK
          helpIconAnchor);
        this._attachHelpDefToIconAnchor();
        this._focusable({'element': helpIconAnchor, 'applyHighlight': true});
      }
    },  
    /**
     * @throws error if showRequired is not a boolean
     * @private
     */
    _checkRequiredOption: function ()
    {
      var showRequired = this.options.showRequired;

      if (showRequired !== null && typeof showRequired !== "boolean")
        throw new Error("Option 'showRequired' has invalid value set: " + showRequired);
    },
    /**
     * add an id to the label element if there isn't one already there. We create ids from the
     * label element id, and it's useful to have one for automated testing instead of having to rely
     * on the generated id.
     * @private
     */
    _addIdsToDom: function ()
    {
      var labelElementId;
      
      // if no id on the label element, generate one.
      // this will be used to wrap the helpIcon and the requiredIcon and 
      // then for the aria-describedby on the input.
      labelElementId = this.element.attr("id");
      if (labelElementId == null)
      {
        this.element.uniqueId(); 
      }
    },
    /**
     * move oj-label* classes from label element onto the root dom element
     * @private
     */
    _moveLabelStyleClassesToRootDom: function ()
    {
      var arrayOfClasses;
      var classes = this.element.attr("class");
      var className;
      var numClasses;

      if (classes)
      {
        arrayOfClasses = classes.split(/\s+/);
        if (arrayOfClasses != null)
          numClasses = arrayOfClasses.length;
        else
          return;

        for (var i = 0; i < numClasses; i++)
        {
          className = arrayOfClasses[i];
          // if class name has -label- in it, then move it
          // (e.g., oj-label, oj-label-inline, oj-md-label-nowrap,
          // oj-md-labels-inline)
          if (className.indexOf("-label") > 0)
          {
            this.uiLabel.addClass(className);
            this.element.removeClass(className);
          }
        }
      }
    },
    /**
     * create and return the span with an id that we'll use to put around the help
     * icon. The created span is prepended to the oj-label-group dom.
     * @private
     */
    _createIconSpan: function (id)
    {
      var ojLabelGroupDom = this.uiLabel.find(".oj-label-group");
      var span = document.createElement("span");
      span.setAttribute("id", id);

      ojLabelGroupDom.prepend(span); // @HTMLUpdateOK
      return span;
    },
    /**
     * return the dom node for the root dom element
     * @private
     */
    _createRootDomElement: function ()
    {
      var inputLabelClass;
      var labelGroupNode;
      var rootAttributes = this.options.rootAttributes;
      var rootDomNode;
      var rootDomNodeClasses = "oj-label oj-component";

      if (rootAttributes)
      {
        inputLabelClass = rootAttributes['class'];
      }
      if (inputLabelClass !== null)
      {
        rootDomNodeClasses = rootDomNodeClasses + " " + inputLabelClass;
      }

      //rootDomNode =
      //  $("<div class='oj-label oj-component'><div class='oj-label-group'></div></div>",
      //     this.document[0]);
      rootDomNode = document.createElement("div");

      rootDomNode.className = rootDomNodeClasses;
      labelGroupNode = document.createElement("div");
      labelGroupNode.className = "oj-label-group";
      rootDomNode.appendChild(labelGroupNode); // @HTMLUpdateOk

      return rootDomNode;
    },
    /**
     * return the dom node for the span with oj-label-required-icon
     * @private
     */
    _createRequiredIconDomElement: function ()
    {
      var requiredTooltip = this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_REQUIRED);
      var requiredDom = document.createElement("span");

      requiredDom.className = "oj-label-required-icon oj-component-icon";
      requiredDom.setAttribute("role", "img");
      requiredDom.setAttribute("title", requiredTooltip);
      // title isn't being read by the screen reader. this is only needed for radioset/checkboxset.
      requiredDom.setAttribute("aria-label", requiredTooltip);
      return requiredDom;
    },
    /**
     * return the dom node for the help icon anchor.
     * if (_needsHelpIcon) , show help icon
     * if (helpSource), add href
     * if (helpDef), add 'aria-label'=helpDef on help icon.
     * @private
     */
    _createHelpIconAnchorDomElement: function (helpDef, source)
    {
      var helpIconAnchor;
      // construct the help html
      // if source (external url) or helpDef, then render a clickable help icon
      if (this._needsHelpIcon())
      {
        // From our Accessibility expert - You must not put role of img on a link.
        // This will make it so it is not a link any more to AT.
        // It is ok to leave it off the the <a> tag and do the following.
        //helpIconAnchor =
        //  $( "<a tabindex='0' target='_blank' class='oj-label-help-icon-anchor oj-label-help-icon oj-component-icon oj-clickable-icon-nocontext'></a>",
        //  this.document[0] );

        // The above is not reading anything when it has focus if it doesn't have an href. So if
        // it doesn't have an href, it needs some kind of role on it.

        helpIconAnchor = document.createElement("a");
        helpIconAnchor.setAttribute("tabindex", "0");
        helpIconAnchor.setAttribute("target", "_blank");
        helpIconAnchor.className =
        "oj-label-help-icon-anchor oj-label-help-icon oj-component-icon oj-clickable-icon-nocontext";
        if (source)
        {
          try
          {
            oj.DomUtils.validateURL(source);
            helpIconAnchor.setAttribute("href", source);
          }
          catch (e)
          {
            throw new Error(e + ". The source option (" + source + ") is invalid.");
          }

        }
        else
        {
          // if there is no href, then we need a role that the screen reader/voiceover will read.
          helpIconAnchor.setAttribute("role", "img");
        }

        if (helpDef)
          helpIconAnchor.setAttribute("aria-label", helpDef);
        else
          helpIconAnchor.setAttribute("aria-label", this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_HELP));


      }
      return helpIconAnchor;
    },
    /**
     * To accomodate keyboard and touch users,
     * show a popup on hover, on tabbing in or touch press that shows the
     * help definition text on the help icon.
     *
     * press is recognized when the
     * pointer is down for x ms without any movement. In other words, you press with your finger and
     * don't let up and then after x ms the Help Def window shows up. You can then let go of your finger
     * the help def window stays up.
     * On Android, when you press and hold you see touchstart. When you finally let up, you see touchend
     * On ios, when you press and hold you see touchstart. When you finally let up, sometimes you
     * see touchend only. Other times, you see touchend mousedown mouseup click all
     * consecutively.
     * On ios, a quick tap shows touchstart touchend mousedown mouseup click (I only register those events)
     * all right after another.
     * @private
     */
    _attachHelpDefToIconAnchor: function ()
    {
      var $helpDefPopupDiv;
      var $helpIcon;
      var position;
      var self = this;

      $helpIcon = this.widget().find(".oj-label-help-icon-anchor");

      // before we do any of this work, make sure there is a help icon
      if ($helpIcon.length == 0)
        return;

      // Create the popup div where we will display the help def text, add a unique id onto it and save
      // that id so we can use it to popup.

      // 1. Build display:none div with help definition text. This will be our popup.
      // 2. Register click/touch event on label which will call a callback to open the popup on
      // PRESS

      // create popup's div
      $helpDefPopupDiv = this._createHelpDefPopupDiv();

      if (this._bTouchSupported)
      {
        // this is code to be extra careful: Check if the _eatClickOnHelpIconListener exists.
        // If it does exist, call 'off'. We don't want this click listener
        // that eats clicks lying around.
        if (this._eatClickOnHelpIconListener)
        {
          this.widget().off(this._touchEatClickNamespace);
        }
        // The pressHold gesture also fires a click event on iphone on touchend.  Prevent that here.
        // This event is added to the widget on click in the function _handleOpenPopupForHelpDef
        this._eatClickOnHelpIconListener = function (event)
        {
          // changing colors is a good way to debug if the handler is being called. this changes
          // the label color.
//        if (this.style.color === "aqua")
//          this.style.color = "yellow";
//        else
//         this.style.color = "aqua";
          return false;
        };

        // The pressHold gesture also fires a contextmenu event on android.  Prevent that here.
        this._eatContextMenuOnHelpIconListener = function (event)
        {
          return false;
        };

        $helpIcon.on("contextmenu" + this._touchEatContextMenuNamespace,
        this._eatContextMenuOnHelpIconListener);
      }

      // For touch device, press with finger on helpIcon to show the help def in a popup.
      // If there is no help source, you can also tap with finger on the helpIcon to show the help
      // def in a popup.
      // For keyboard users, tab in to helpIcon to show the help def in a popup.
      // For mouse users, hovering on helpIcon shows the help def in a popup.
      // ------------------------------------------------------------------------------------


      // ENTERING CALLBACK TO OPEN THE POPUP IF NEEDED
      // (focusin from tab, not mouse, OR press from touch)

      if (!this._openPopupForHelpDefCallbackListener)
      {
        this._openPopupForHelpDefCallbackListener = function (event)
        {
          self._handleOpenHelpDefPopup(event, $helpDefPopupDiv, $helpIcon);
        };
      }
      // END CALLBACK TO OPEN POPUP
      //


      // CALLBACK TO CLOSE POPUP
      if (!this._closePopupForHelpDefCallbackListener)
      {
        this._closePopupForHelpDefCallbackListener = function (event)
        {
          self._handleCloseHelpDefPopup();
        };
      }
      // END CALLBACK TO CLOSE POPUP


      // Add event handlers to open the help definition popup
      this._addShowHelpDefinitionEventHandlers($helpIcon);

      position =
      {
        'my': 'start bottom',
        'at': 'end top',
        'collision': 'flipcenter',
        'of': $helpIcon
      };
      $helpDefPopupDiv.ojPopup(
      {"position": position,
        "modality": "modeless",
        "animation": {"open": null, "close": null}});
    },
    /**
     * @private
     */
    _createHelpDefPopupDiv: function ()
    {
      var bodyDom;
      var contentDiv;
      var $contentDiv;
      var helpDef = this.options.help['definition'];
      var helpDefPopupDiv;
      var $helpDefPopupDiv;
      var helpDefText;


      if (helpDef)
        helpDefText = helpDef;
      else
        helpDefText = this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_HELP);
      
      if (!this._helpDefPopupDivId)
      {
        // create a root node to bind to the popup
        helpDefPopupDiv = document.createElement("div");
        helpDefPopupDiv.className = "oj-help-popup";
        helpDefPopupDiv.style.display = "none";
        $helpDefPopupDiv = $(helpDefPopupDiv);
        $helpDefPopupDiv.uniqueId();
        this._helpDefPopupDivId = $helpDefPopupDiv.prop("id");

        // create a content node
        contentDiv = document.createElement("div");
        contentDiv.className = "oj-help-popup-container";
        helpDefPopupDiv.appendChild(contentDiv);
        $contentDiv = $(contentDiv);

        $contentDiv.text(helpDefText);
        bodyDom = document.getElementsByTagName("body")[0];
        bodyDom.appendChild(helpDefPopupDiv); // @HTMLUpdateOK
      }
      else
      {
        // Find the div with the id, and then update the text of it.
        $helpDefPopupDiv = $(document.getElementById(this._helpDefPopupDivId));
        if ($helpDefPopupDiv)
        {
          $contentDiv = $helpDefPopupDiv.find(".oj-help-popup-container").first();
          $contentDiv.text(helpDefText);
        }
      } 
      return $helpDefPopupDiv;

    },
    /**
     * Add the event listeners to show the helpDefinition text in a popup
     * @param {jQuery} $helpIcon
     * @returns {undefined}
     * @instance
     * @private
     */
    _addShowHelpDefinitionEventHandlers: function ($helpIcon)
    {
      var hammerOptions;
   
      // Open the popup on focusin and mousenter.
      // *I have logic in the listener to ignore these when these trigger as a result of 
      // the user touching the screen.
      $helpIcon.on("focusin" + this._helpDefPopupNamespace +
                   " mouseenter" + this._helpDefPopupNamespace, 
                   this._openPopupForHelpDefCallbackListener);
      $helpIcon.on("mouseleave" + this._helpDefPopupNamespace,
                   this._closePopupForHelpDefCallbackListener);
      if (this._bTouchSupported)
      {
        // And if touch is supported, the user can also open the popup on press or,
        //  if no help source, on tap.
        if (this.options.help['source'])
        {
          hammerOptions = {
            "recognizers": [
              [Hammer.Press, {time: oj.DomUtils.PRESS_HOLD_THRESHOLD}]
            ]};
          $helpIcon.ojHammer(hammerOptions);
          // JET components are encouraged to use JQUI's _on() method, giving all the conveniences
          // of the _on method, like automatic cleanup.
          this._on($helpIcon,
            {"press": this._openPopupForHelpDefCallbackListener});
        }
        else
        {
          hammerOptions = {
            "recognizers": [
              [Hammer.Tap],
              [Hammer.Press, {time: oj.DomUtils.PRESS_HOLD_THRESHOLD}]

            ]};
          $helpIcon.ojHammer(hammerOptions);
          this._on($helpIcon,
            {"press": this._openPopupForHelpDefCallbackListener,
             "tap": this._openPopupForHelpDefCallbackListener});

        }
        
      }
    },
    /**
     * Handle open popup for help definition.
     * @instance
     * @private
     */
    _handleOpenHelpDefPopup: function (event, helpDefPopupDiv, helpIcon)
    {
      var isOpen = helpDefPopupDiv.ojPopup("isOpen");   

      if (isOpen)
        return;

      // touch supported does not mean only touch. It could be a touch-enabled laptop like Windows10
      if (this._bTouchSupported)
      {
        // For a press, we want to show the popup with the help def, 
        // but we do not want to navigate to the source url. So we eat the click.
        if (event.type === "press")
        {
          var widget = this.widget();
          widget.on("click" + this._touchEatClickNamespace, this._eatClickOnHelpIconListener);
          var self = this;
          helpDefPopupDiv.on("ojclose",
          function (event, ui)
          {
            widget.off(self._touchEatClickNamespace);
          });
        }
        else
        {
          helpDefPopupDiv.off("ojclose");
        }

        // Open the popup if I get a 'press' event, a 'tap' event, a 'focusin' event if
        // it wasn't a touch, and a 'mouseenter' event if it wasn't a touch.
        // I look for a recent touchstart event and use this to filter out 
        // the focusin and mouseevent events. I use touchstart and not touchend because while
        // pressing I get the touchstart, but I don't get the touchend until the finger lets up.
        if (event.type === "press" ||  
            event.type === "tap" || 
            (!oj.DomUtils.recentTouchStart() &&
            (event.type ==="focusin" || event.type ==="mouseenter")))
        {
          helpDefPopupDiv.ojPopup("open", helpIcon);
        }
      } // end touch code
      else
      {
        // non-touch devices. focusin/mouseenter are the only ways to open the popup.
        helpDefPopupDiv.ojPopup("open", helpIcon);
      }

    },
    /**
     * Close helpDef popup. This is called from _NotifyDetached and _NotifyHidden and
     * as a callback for this._closePopupForHelpDefCallbackListener.
     * @private
     */
    _handleCloseHelpDefPopup: function ()
    {
      var $helpDefPopupDiv;
      
      if (this._helpDefPopupDivId != null)
      {
        $helpDefPopupDiv = $(document.getElementById(this._helpDefPopupDivId));
        $helpDefPopupDiv.ojPopup("close");
      }
    },
    /**
     * Remove the event listeners for opening a popup on the help def icon and for eating
     * the clicks on the 'press' event. Called from destroy and when we remove the help icon.
     * @private
     */
    _removeHelpDefIconEventListeners: function (helpIcon)
    {
      if (this._bTouchSupported)
      {
        this.widget().off(this._touchEatClickNamespace);
        helpIcon.off(this._touchEatContextMenuNamespace);
        this._eatClickOnHelpIconListener = null;
        this._eatContextMenuOnHelpIconListener = null;
        // helpIcon is same element on which we originally called ojHammer()
        // the listeners are automatically removed since we used jqueryui's _on
        helpIcon.ojHammer("destroy");
      }
      helpIcon.off(this._helpDefPopupNamespace);
      this._openPopupForHelpDefCallbackListener = null;
      this._closePopupForHelpDefCallbackListener = null;
    },
    /**
     * removes the help def popup dom and variables
     * @returns {undefined}
     * @private
     */
    _removeHelpDefPopup: function ()
    {
      var $helpDefPopupDiv;

      if (this._helpDefPopupDivId != null)
      {
        $helpDefPopupDiv = $(document.getElementById(this._helpDefPopupDivId));
        if ($helpDefPopupDiv)
        {
          $helpDefPopupDiv.ojPopup("destroy");
          $helpDefPopupDiv.remove();
        }
        this._helpDefPopupDivId = null;
      }
    },
    /**
     * @private
     * @returns {boolean}
     */
    _needsHelpIcon: function ()
    {
      var options = this.options;
      return (options.help['source'] != null) || (options.help['definition'] != null);
    },
    /**
     * refresh the help dom --
     * find the help root dom node and remove it if it is there
     * and add back the help html. Helpful if a help option changed.
     * @private
     */
    _refreshHelp: function ()
    {
      var helpSpanId = this.helpSpanId;
      var helpSpan;
      var $helpIcon;
      var needsHelpIcon;

      // remove the help info if it is there.
      $helpIcon = this.uiLabel.find(".oj-label-help-icon");

      if ($helpIcon.length === 1)
      {     
        // remove things we added in _attachHelpDefToIconAnchor
        this._removeHelpDefIconEventListeners($helpIcon);
        this._removeHelpDefPopup();
        $helpIcon.remove();
      }
      helpSpan = document.getElementById(helpSpanId);
      needsHelpIcon = this._needsHelpIcon();

      if (needsHelpIcon && helpSpan == null)
      {
        // no helpSpan, so we need to create one
        helpSpan = this._createIconSpan(helpSpanId);  
      }
      else if (!needsHelpIcon && helpSpan !== null)
      {
        helpSpan.parentNode.removeChild(helpSpan);
      }

      // ok, we removed the helpIcon at the start of this method, 
      // so we need to add it back if we needHelpIcon
      if(needsHelpIcon && helpSpan != null)
      {
        this._createHelp(helpSpan);
      }

    },
    /**
     * refresh the required dom --
     * if required is true, then add the required dom if it isn't already there
     * if required is false, remove the required dom if it is there.
     * Helpful if the required option changed.
     * @private
     */
    _refreshRequired: function ()
    {
      var $requiredDom;
      var requiredSpanId = this.requiredSpanId;
      var requiredSpan;
      var requiredTooltip;


      requiredSpan = document.getElementById(requiredSpanId);

      if (this.options.showRequired)
      {
        // add required if it wasn't already there
        if (!requiredSpan)
        {
          // render required
          requiredSpan = this. _createIconSpan(requiredSpanId);      
          requiredSpan.appendChild(this._createRequiredIconDomElement()); // @HTMLUpdateOK
          // put it in the oj-label-group dom, before the label.
          this.element.before(requiredSpan); // @HTMLUpdateOK

        }
        else
        {
          // required is there, so we need to refresh the translated value in case it changed.
          requiredTooltip = this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_REQUIRED);
          $requiredDom = this.uiLabel.find(".oj-label-required-icon");
          $requiredDom.attr("title", requiredTooltip);
        }
      }
      else
      {
        // not required, so remove it
        requiredSpan = document.getElementById(requiredSpanId);
        if (requiredSpan !== null)
        {
          requiredSpan.parentNode.removeChild(requiredSpan);
        }
      }
    },
    /**
     * Note that _setOption does not get called during create. it only gets called
     * when the component has already been created.
     * @override
     * @protected
     * @memberof oj._ojLabel
     * @instance
     */
    _setOption: function (key, value)
    {
      this._superApply(arguments);

      if (key === "showRequired")
      {
        this._refreshRequired();
      }

      // if user changed the help definition or source, then update the UI.
      // Find the help dom first. If it exists, replace it with new dom.
      // if it doesn't exist, add it.
      if (key === "help")
      {
        this._refreshHelp();
      }
    },
    getNodeBySubId: function (locator)
    {
      var node;
      var subId;

      node = this._super(locator);
      if (!node)
      {
        subId = locator['subId'];
        if (subId === "oj-label-help-icon")
        {
          node = this.widget().find(".oj-label-help-icon")[0];
        }
        if (subId === "oj-label-required-icon")
        {
          node = this.widget().find(".oj-label-required-icon")[0];
        }
      }
      // Non-null locators have to be handled by the component subclasses
      return node || null;
    },
    getSubIdByNode: function (node)
    {
      var subId = null;

      if (node != null)
      {
        if (node === this.widget().find(".oj-label-help-icon")[0])
        {
          subId = {'subId': "oj-label-help-icon"};
        }
      }

      return subId || this._superApply(arguments);
    },
    /**
     *
     * @override
     * @protected
     * @memberof oj._ojLabel
     * @instance
     */
    _destroy: function ()
    {
      // remove things we added in _attachHelpDefToIconAnchor
      var helpIcon = this.uiLabel.find(".oj-label-help-icon");
      this._removeHelpDefIconEventListeners(helpIcon);
      this._removeHelpDefPopup();
      this.helpSpanId = null;
      this.requiredSpanId = null;
      // DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
      oj.DomUtils.unwrap(this.element, this.uiLabel);

      return this._super();
    }

    /**** end internal widget functions ****/

    /**
     * Removes the label functionality completely.
     * This will return the element back to its pre-init state.
     *
     * <p>This method does not accept any arguments.
     *
     * @method
     * @name oj._ojLabel#destroy
     * @memberof oj._ojLabel
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
     * $( ".selector" )._ojLabel( "destroy" );
     */
    
    /**
     * {@ojinclude "name":"ojStylingDocIntro"}
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
     *       <td>oj-focus-highlight</td>
     *       <td>{@ojinclude "name":"ojFocusHighlightDoc"}</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
     * @memberof oj._ojLabel
     */
  });

//////////////////     SUB-IDS     //////////////////

  /**
   * <p>Sub-ID for the label's help icon.</p>
   *
   * @ojsubid oj-label-help-icon
   * @memberof oj._ojLabel
   *
   * @example <caption>Get the node for the help icon:</caption>
   * var node = $( ".selector" )._ojLabel( "getNodeBySubId", {'subId': 'oj-label-help-icon'} );
   */

}());
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * The various validation modes
 * @ignore
 */ 

var _sValidationMode = {
  FULL : 1, 
  VALIDATORS_ONLY : 2, 
  REQUIRED_VALIDATOR_ONLY : 3
};

/**
* String used in the id on the span that surrounds the help icon.
* @const
* @private
* @type {string}
*/
var _HELP_ICON_ID = "_helpIcon";


// E D I T A B L E V A L U E    A B S T R A C T   W I D G E T  
/**
 * @ojcomponent oj.editableValue
 * @augments oj.baseComponent
 * @abstract
 * @since 0.6
 * 
 * @classdesc
 * Abstract base class for all editable components that are value holders and that require 
 * validation and messaging capabilities. <br/>
 * 
 * <p>
 * <h3 id="validation-section">
 * Validation and Messaging
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#validation-section"></a>
 * </h3>
 * An editable component runs validation (normal or deferred) based on the action performed on it 
 * (either by end-user or page author), and the state it was in when the action occurred. Examples 
 * of actions are - creating a component, user changing the value of the component by interacting 
 * with it, the app setting a value programmatically, the app calling the validate() method etc. At 
 * the time the action occurs, the component could already be showing errors, or can have a deferred 
 * error or have no errors. 
 * <p>
 * These factors also determine whether validation errors/messages get shown to the user immediately 
 * or get deferred. The following sections highlight the kinds of validation that are run and how 
 * messages get handled.
 * </p>
 * <p>
 * Note: The <code class="prettyprint">required</code>, <code class="prettyprint">validators</code>,
 * <code class="prettyprint">converter</code> options and the <code class="prettyprint">validate</code> 
 * method are not on all EditableValue components so they are not on the EditableValue class. 
 * See the EditableValue subclasses for which ones have which of these options. For example,
 * ojSwitch, ojSlider, ojColorPalette, and ojColorSpectrum do not have the 
 * <code class="prettyprint">validate</code> method nor do they have the 
 * <code class="prettyprint">required</code>, <code class="prettyprint">validators</code>,
 * <code class="prettyprint">converter</code> options since the components 
 * wouldn't do anything with these options anyway. A user can't type into these components and there
 * is no visual representation for 'nothing is set' on these components. Whereas InputBase, inputNumber,
 * inputSearch and combobox do have these options since a user can type into the field (so you may
 * need to convert it and validate it) and also blank it out (so you may need to mark it required and
 * run the required validator).
 * </p>
 * <h4 id="normal-validation-section">Normal Validation 
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#normal-validation-section"></a></h4>
 * Normal validation is run in the following cases on the display value, using the converter and 
 * validators set on the component, and validation errors are reported to user immediately.
 * <ul>
 * <li>When value changes as a result of user interaction all messages are cleared, including custom 
 * messages added by the app, and full validation is run on the UI value. The steps performed are 
 * outlined below.
 * <ol> 
 * <li>All messages options are cleared - 
 * <code class="prettyprint">messagesShown</code>, <code class="prettyprint">messagesHidden</code> 
 * and <code class="prettyprint">messagesCustom</code> options. </li>
 * <li>If no converter is present then processing continues to next step. If a converter is 
 * present, the UI value is first converted (i.e., parsed). If there is a parse error then 
 * the <code class="prettyprint">messagesShown</code> option is updated and processing returns.</li>
 * <li>If there are no validators setup for the component then the value is set on the component. 
 * Otherwise all validators are run in sequence using the parsed value from the previous step. The 
 * implicit required is run first if the component is marked required. When a validation error is 
 * encountered it is remembered and the next validator in the sequence is run. 
 * <ul><li>NOTE: The value is trimmed before required validation is run</li></ul>
 * </li>
 * <li>At the end of the validation run if there are errors, the <code class="prettyprint">messagesShown</code> 
 * option is updated and processing returns. If there are no errors, then the 
 * <code class="prettyprint">value</code> option is updated and the formatted value displayed on the 
 * UI.</li>
 * </ol>
 * </li>
 * <li>When the <code class="prettyprint">validate</code> method is called by app, all messages are 
 * cleared and full validation run using the display value. See <code class="prettyprint">validate</code>
 * method on the sub-classes for details. Note: JET validation is designed to catch user input errors, and not invalid
 * data passed from the server; this should be caught on the server.</li>
 * <li>When certain options change through programmatic intervention by app, the component 
 * determines whether it needs to run normal validation based on the state the component is in. 
 * Refer to the <a href="#mixed-validation-section">Mixed Validation</a> section below for details. </li>
 * </ul>
 * 
 * <h4 id="deferred-validation-section">Deferred Validation
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#deferred-validation-section"></a>
 * </h4>
 * Deferred validation is run in the following cases on the component value using the implicit 
 * required validator if required is true, and validation errors are deferred, i.e., not shown to user immediately. 
 * Refer to the <a href="#deferred-messages-section">Showing Deferred Messages</a> section to 
 * understand how deferred messages can be shown.
 * <ul>
 *  <li>When a component is created and it is required deferred validation is run and no messages options are cleared 
 *  prior to running validation.  
 *  Refer to the <a href="#deferred-validators-section">Validators 
 *  Participating in Deferred Validation</a> section for details.</li> 
 *  <li>When the <code class="prettyprint">value</code> option changes due to programmatic 
 *  intervention deferred validation is run, after all messages options - 
 *  <code class="prettyprint">messagesShown</code>, <code class="prettyprint">messagesHidden</code> 
 *  and <code class="prettyprint">messagesCustom</code> - are cleared.</li>  
 *  <li>When the <code class="prettyprint">reset</code> method is called, deferred validation is run 
 *   after all messages options - <code class="prettyprint">messagesShown</code>, 
 *   <code class="prettyprint">messagesHidden</code> and <code class="prettyprint">messagesCustom</code> 
 *   - are cleared.</li>  
 *  <li>When certain options change through programmatic intervention by app, the component 
 *  determines whether it needs to run deferred validation based on the state the component is in. 
 *  Refer to the <a href="#mixed-validation-section">Mixed Validation</a> section below for details.</li>
 * </ul>
 * 
 * <h4 id="mixed-validation-section">Mixed Validation
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#mixed-validation-section"></a>
 * </h4>
 * Either deferred or normal validation is run in the following cases based on the state the 
 * component is in and any validation errors encountered are either hidden or shown to user.
 * <ul>
 *  <li>when disabled option changes. See <a href="#disabled">disabled</a> option for details.</li>
 *  <li>when refresh method is called. See <a href="#refresh">refresh</a> method for details.</li> 
 *  <li>when converter option changes. Not all EditableValue components have the converter option. See
 *  the sub-classes that have the converter option for details, e.g., {@link oj.inputBase#converter}.</li>
 *  <li>when required option changes. Not all EditableValue components have the required option. See
 *  the sub-classes that have the required option for details, e.g., {@link oj.inputBase#required}.</li>
 *  <li>when validators option changes. Not all EditableValue components have the validators option. See
 *  the sub-classes that have the validators option for details, e.g., {@link oj.inputBase#validators}.</li>
 *   
 * </ul>
 * </p>
 * 
 * <p>
 * <h3 id="deferred-messages-section">
 * Showing Deferred Messages
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#deferred-messages-section"></a>
 * </h3>
 * Deferred validation messages are displayed only when page author requests for it explicitly in 
 * one of the following ways: 
 * <ul>
 * <li>calls the <a href="#showMessages"><code class="prettyprint">showMessages</code></a> method on the component or</li>
 * <li>calls the helper methods <code class="prettyprint">showMessages</code> using the 
 * {@link oj.InvalidComponentTracker}</li>
 * </ul>
 * </p>
 * 
 * <p>
 * <h3 id="deferred-validators-section">
 * Validators Participating in Deferred Validation
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#deferred-validators-section"></a>
 * </h3>
 * The required validator is the only validator type that participates in deferred validation.
 * The required option needs to be set to true for the required validator to run. Note: Not all
 * EditableValue components have the required option, e.g., ojSwitch, ojSlider, ojColorPalette do not since
 * there is no visual representation for 'nothing set'. 
 * </p> 
 * 
 * <p>
 * <h3 id="declarative-binding-section">
 * Declarative Binding 
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#declarative-binding-section"></a>
 * </h3>
 * When the component's <code class="prettyprint">value</code> option is bound to a Knockout 
 * observable and when the value changes, whether the observable is updated or not, iow whether a 
 * 'writeback' to the observable happens or not, depends on the action that caused the value to 
 * change.
 * <ul>
 * <li>when the value changes as a result of user interaction </li>
 * <li>when the value changes because normal validation was run as a result of these options 
 * being changed by the app - <code class="prettyprint">converter</code>, <code class="prettyprint">disabled</code>, 
 * <code class="prettyprint">required</code>, <code class="prettyprint">validators</code>, then the 
 * value is written to the observable. See the specific option docs for details.</li>
 * <li>when the value changes because normal validation was run as a result of these methods being 
 * called by the app - 
 * <code class="prettyprint">refresh</code>, <code class="prettyprint">validate</code>, 
 * then the value is written to the observable. See the specific method docs for details.</li>
 * <li>when the value changes due to programmatic intervention by app then the value is not written 
 * back to observable. This is based on the assumption that the app has mutated the observable 
 * already. In this case updating the component's <code class="prettyprint">value</code> option 
 * alone will not propagate the change automatically to the observable. Updating the observable is 
 * recommended as this will propagate the change automatically to the component.
 * </li>
 * </ul>
 * </p>
 * 
 * @example <caption>Initialize component</caption>
 * &lt;input id="foo" type="text"/&gt;
 * &lt;script&gt;
 * &nbsp;&nbsp;$('#foo").ojInputText({'value': 'abc'});
 * &lt;/script&gt;
 * // using knockout ojComponent binding
 * &lt;input id="foo" data-bind="ojComponent: {component: 'ojInputText', value: 'abc'}"/&gt;
 * @example <caption>Initialize component value using ko observable</caption>
 * &lt;input id="foo" data-bind="ojComponent: {component: 'ojInputText', value: salary}"/&gt;
 * &lt;script&gt;
 * &nbsp;&nbsp;var salary = ko.observable('abc');
 * &lt;/script&gt;
 * @example <caption>Initialize component value using element value</caption>
 * &lt;input id="foo" data-bind="ojComponent: {component: 'ojInputText'}" value='abc'/&gt;
 */
oj.__registerWidget('oj.editableValue', $['oj']['baseComponent'], 
{
  widgetEventPrefix: "oj",
  
  options: 
  {
    /** 
     * Whether the component is disabled. The element's disabled property is used as 
     * its initial value if it exists, when the option is not explicitly set. When neither is set, 
     * disabled defaults to false.
     *  
     * <p>The 2-way <code class="prettyprint">disabled</code> binding offered by 
     * the <code class="prettyprint">ojComponent</code> binding 
     * should be used instead of Knockout's built-in <code class="prettyprint">disable</code> 
     * and <code class="prettyprint">enable</code> bindings, 
     * as the former sets the API, while the latter sets the underlying DOM attribute.
     * </p>
     * 
     * <p>
     * When the <code class="prettyprint">disabled</code> option changes due to programmatic 
     * intervention, the component may clear messages and run validation in some cases. </br>
     * <ul>
     * <li>when a required component is initialized as disabled 
     * <code class="prettyprint">{value: null, required:true, disabled: true}</code>, 
     * deferred validation is skipped.</li>
     * <li>when a disabled component is enabled, 
     *  <ul>
     *  <li>if component is invalid and showing messages then all component messages are cleared, 
     *  and full validation run using the display value.
     *   <ul>
     *    <li>if there are validation errors, they are pushed to <code class="prettyprint">messagesShown</code>
     *    option. </li>
     *    <li>if no errors result from the validation, the <code class="prettyprint">value</code> 
     *    option is updated. Page authors can listen to the <code class="prettyprint">optionChange</code> 
     *    event on the <code class="prettyprint">value</code> option to clear custom errors.</li>
     *   </ul>
     *  </li>
     *  
     *  <li>if component is valid and has no errors then deferred validation is run.
     *    <ul>
     *    <li>if there is a deferred validation error, then 
     *    <code class="prettyprint">messagesHidden</code> option is updated. </li>
     *    </ul>
     *  </li>
     *  <li>if component is invalid and deferred errors then component messages are cleared and 
     *  deferred validation re-run.
     *    <ul>
     *    <li>if there is a deferred validation error, then 
     *    <code class="prettyprint">messagesHidden</code> option is updated. </li>
     *    </ul>
     *  </li>
     *  </ul>
     * </li>
     * <li>when enabled component is disabled then no validation is run and the component appears 
     * disabled.</li>
     * </ul>
     * </p>
     * 
     * @example <caption>Initialize component with <code class="prettyprint">disabled</code> option:</caption>
     * $(".selector").ojFoo({"disabled": true}); // Foo is InputText, InputNumber, Select, etc.
     * 
     * @expose 
     * @type {boolean}
     * @default <code class="prettyprint">false</code>
     * @public
     * @instance
     * @memberof oj.editableValue
     */
    disabled : false,
    
    /**
     * Display options for auxilliary content that determines where it should be displayed 
     * in relation to the component. 
     * 
     * <p>
     * The types of messaging content for which display options can be configured include 
     * <code class="prettyprint">messages</code>, <code class="prettyprint">converterHint</code>, 
     * <code class="prettyprint">validatorHint</code> and <code class="prettyprint">title</code>.<br/>
     * The display options for each type is specified either as an array of strings or a string. When 
     * an array is specified the first display option takes precedence over the second and so on. 
     * </p>
     * <p>
     * JET editable components set defaults that apply to the entire app/page. 
     * It is possible to override the defaults on 
     * a per instance basis as explained in the examples below or change defaults for the entire
     * application using 
     * <a href="oj.Components.html#setDefaultOptions"><code class="prettyprint">oj.Components#setDefaultOptions</code></a> method.
     * It is much easier to change the defaults using setDefaultOptions once rather than putting
     * the displayOptions option on every component instance.<br/>
     * </p>
     * <p>
     * When displayOptions changes due to programmatic intervention, the component updates its 
     * display to reflect the updated choices. For example, if 'title' property goes from 
     * 'notewindow' to 'none' then it no longer shows in the notewindow.
     * </p>
     * <p>
     * A side note: title and message detail text can include formatted HTML text, whereas hints and 
     * message summary text cannot. If you use formatted text, it should be accessible 
     * and make sense to the user if formatting wasn't there.
     * To format the title, you could do this:
     * <pre class="prettyprint"><code>&lt;html>Enter &lt;b>at least&lt;/b> 6 characters&lt;/html></code></pre>
     * </p>
     *  
     * @property {Array|string=} converterHint - supported values are <code class="prettyprint">'placeholder'</code>, 
     * <code class="prettyprint">'notewindow'</code>, <code class="prettyprint">'none'</code>. The 
     * default value is <code class="prettyprint">['placeholder', 'notewindow']</code>. When there 
     * is already a placeholder set on the component, the converter hint falls back to display 
     * type of 'notewindow'.
     * To change the default value you can do this - <br/> 
     * E.g. <code class="prettyprint">{'displayOptions: {'converterHint': ['none']}}</code>
     * @property {Array|string=} validatorHint - supported values are <code class="prettyprint">'notewindow'</code>, 
     * <code class="prettyprint">'none'</code>.
     * To change the default value you can do this - <br/>
     * <code class="prettyprint">{'displayOptions: {'validatorHint': ['none']}}</code>
     * @property {Array|string=} messages - supported values are <code class="prettyprint">'notewindow'</code>, 
     * <code class="prettyprint">'inline'</code>,
     * <code class="prettyprint">'none'</code>. The default is 'inline'. 
     * To change the default value you can do this - <br/>
     * E.g. <code class="prettyprint">{'displayOptions: {'messages': 'none'}}</code>
     * @property {Array|string=} title - supported values are <code class="prettyprint">'notewindow'</code>, 
     * <code class="prettyprint">'none'</code>.
     * To change the default value you can do this - <br/>
     * E.g. <code class="prettyprint">{'displayOptions: {'title': 'none'}}</code>
     * 
     * @example <caption>Override default values for <code class="prettyprint">displayOptions</code> 
     *  for messages for the entire application:</caption>
     * // messages will be shown in the notewindow for the application.
     * oj.Components.setDefaultOptions({
     *    'editableValue':
     *    {
     *      'displayOptions': 
     *      {
     *        'messages': ['notewindow']
     *      }
     *    }
     * });
     * 
     * @example <caption>Override default values for <code class="prettyprint">displayOptions</code> 
     * for one component instance:</caption>
     * // In this example, the instance of ojFoo changes its displayOptions from the defaults.
     * // The 'converterHint' is none, the 'validatorHint' is none and the 'title' is none,
     * // so only the 'messages' will display in its default state.
     * // For most apps, you will want to change the displayOptions app-wide
     * // for all EditableValue components, so you should use the
     * // oj.Components#setDefaultOptions function instead (see previous example).
     * //
     * // Foo is InputText, InputNumber, Select, etc.
     * $(".selector").ojFoo("option", "displayOptions", {
     *   'converterHint': 'none',
     *   'validatorHint': 'none',
     *   'title' : 'none'
     * });
     * 
     * @expose 
     * @access public
     * @instance
     * @default <code class="prettyprint">
     * {<br/>
     * &nbsp;&nbsp;'messages': ['inline'], <br/>
     * &nbsp;&nbsp;'converterHint': ['placeholder', 'notewindow'], <br/>
     * &nbsp;&nbsp;'validatorHint': ['notewindow'], <br/>
     * &nbsp;&nbsp;'title': ['notewindow']<br/>
     * }</code>
     * @memberof oj.editableValue
     * @type {Object|undefined}
     * @since 0.7
     */
    displayOptions : undefined,    
    
    /**
     * Help information that goes on the label. When help is set on the input component, then 
     * help information is added to the input's label.
     * <p>
     * The properties supported on the <code class="prettyprint">help</code> option are:
     * 
     * @property {string=} definition this is the help definition text. It is what shows up
     * when the user hovers over the help icon, or tabs into the help icon, or press
     * and holds the help icon on a mobile device. No formatted text is available for the
     * help definition attribute.
     * The default value is <code class="prettyprint">null</code>.
     * @property {string=} source this is the help source url. 
     * If present, the help icon's 
     * anchor's target is this source. For security reasons we only support 
     * urls with protocol http: or https:.
     * If the url doesn't comply we ignore it and throw an error. The default value is null. 
     * Pass in an encoded URL since we do not encode the URL.
     * 
     * @expose 
     * @memberof oj.editableValue
     * @instance
     * @type {Object.<string, string>}
     * @default <code class="prettyprint">{help : {definition :null, source: null}}</code>
     * 
     * @example <caption>Initialize the input with the help definition and external url information:</caption>
     * // Foo is InputText, InputNumber, Select, etc.
     * $( ".selector" ).ojFoo({ "help": {"definition":"some help definition, "source":"some external url" } });
     * 
     * 
     * @example <caption>Set the <code class="prettyprint">help</code> option, after initialization:</caption>
     *
     * // setter
     * // Foo is InputText, InputNumber, Select, etc.
     * $( ".selector" ).ojFoo( "option", "help", {"definition":"fill out the name", "source":"http:\\www.oracle.com" } );
     * 
     */
    help: 
    {
    /**
     * <p>help definition text.  See the top-level <code class="prettyprint">help</code> option for details.
     * 
     * @expose
     * @alias help.definition
     * @memberof! oj.editableValue
     * @instance
     * @type {?string}
     * @default <code class="prettyprint">null</code>
     * 
     * @example <caption>Get or set the <code class="prettyprint">help.definition</code> sub-option, after initialization:</caption>
     * // getter
     * var definitionText = $( ".selector" ).ojFoo( "option", "help.definition" );
     * 
     * // setter:
     * $( ".selector" ).ojFoo( "option", "help.definition", "Enter your name" );
     */     
      definition: null, 
    /**
     * <p>help source url.  See the top-level <code class="prettyprint">help</code> option for details.
     * 
     * @expose
     * @alias help.source
     * @memberof! oj.editableValue
     * @instance
     * @type {?string}
     * @default <code class="prettyprint">null</code>
     * 
     * @example <caption>Get or set the <code class="prettyprint">help.source</code> sub-option, after initialization:</caption>
     * // getter
     * var helpSource = $( ".selector" ).ojFoo( "option", "help.source" );
     * 
     * // setter:
     * $( ".selector" ).ojFoo( "option", "help.source", "www.abc.com" );
     */      
      source: null
    },
    
    /**
     * List of messages an app would add to the component when it has business/custom validation 
     * errors that it wants the component to show. When this option is set the 
     * <code class="prettyprint">messagesShown</code> option is also updated and the message
     * shows to the user right away. To clear the custom message, set code class="prettyprint">messagesCustom</code>
     * back to an empty array.<br/>
     * Each message in the array is either an instance of oj.Message or an object that duck types it. 
     * See {@link oj.Message} for details.
     * 
     * <p>
     * An optionChange event is triggered every time this option value changes.
     * </p>
     * 
     * @example <caption>Get the current list of app messages using <code class="prettyprint">messagesCustom</code> option:</caption>
     * // Foo is InputText, InputNumber, Select, etc.
     * var customMsgs = $(".selector").ojFoo("option", "messagesCustom"); 
     * 
     * @example <caption>Clear all app messages set on the component:</caption>
     * // Foo is InputText, InputNumber, Select, etc.
     * $(".selector").ojFoo("option", "messagesCustom", []); 
     * 
     * @example <caption>Set app messages using the <code class="prettyprint">messagesCustom</code> option:</caption>
     * var msgs = [];
     * msgs.push({'summary': 'Error Summary', 'detail': 'Error Detail'}); 
     * // Foo is InputText, InputNumber, Select, etc.
     * $(".selector").ojFoo("option", "messagesCustom", msgs);
     * 
     * @expose 
     * @access public
     * @instance
     * @memberof oj.editableValue
     * @default empty array when no option is set.
     * @type {Array|undefined}
     * @since 0.7
     * @see #messagesShown
     */    
    messagesCustom : undefined,
    
    /**
     * List of messages currently hidden on component, these are added by component when it runs 
     * deferred validation. Each message in the array is 
     * either an instance of oj.Message or an object that duck types it. See {@link oj.Message} for 
     * details. <br/>
     * 
     * <p>
     * This is a read-only option so page authors cannot set or change it directly.
     * </p>
     * 
     * <p>
     * An optionChange event is triggered every time this option value changes.
     * </p>
     * 
     * <p>
     * These messages are not shown to the end-user by default, but page author 
     * can show hidden messages using the {@link showMessages} method. 
     * </p>
     * 
     * @example <caption>Get <code class="prettyprint">messagesShown</code> for the component:</caption>
     * // Foo is InputText, InputNumber, Select, etc.
     * var messages = $(".selector").ojFoo("option", "messagesShown"); 
     * 
     * @expose 
     * @access public
     * @instance
     * @memberof oj.editableValue
     * @default empty array when no option is set.
     * @type {Array|undefined}
     * @since 0.7
     * @see #showMessages
     * @readonly
     */    
    messagesHidden : undefined,     
    
    /**
     * List of messages currently shown on component, these include messages generated both by the 
     * component and ones provided by app using <code class="prettyprint">messagesCustom</code>. 
     * Each message in the array is either an instance of oj.Message or an object that duck types 
     * it. See {@link oj.Message} for details. <br/>
     * 
     * <p>
     * This is a read-only option so page authors cannot set or change it directly.
     * </p>
     * 
     * <p>
     * An optionChange event is triggered every time its value changes.
     * </p>
     * 
     * <p>
     * Messages retrieved using the <code class="prettyprint">messagesShown</code> option are by 
     * default shown in the notewindow, but this can be controlled using the 'messages' property of 
     * the <code class="prettyprint">displayOptions</code> option. 
     * </p>
     * 
     * @example <caption>Get <code class="prettyprint">messagesShown</code> for the component:</caption>
     * // Foo is InputText, InputNumber, Select, etc.
     * var messages = $(".selector").ojFoo("option", "messagesShown"); 
     * 
     * @expose 
     * @access public
     * @instance
     * @memberof oj.editableValue
     * @default empty array when no option is set.
     * @type {Array|undefined}
     * @since 0.7
     * @readonly
     */    
    messagesShown : undefined,    

    
    /** 
     * Represents advisory information for the component, such as would be appropriate for a tooltip. 
     * 
     * <p>
     * When a title is present it is by default displayed in the notewindow, or as determined by the 
     * 'title' property set on the <code class="prettyprint">displayOptions</code> option. 
     * When the <code class="prettyprint">title</code> option changes the component refreshes to 
     * display the new title. 
     * </p>
     * 
     * <p>
     * JET takes the title attribute off the input and creates a notewindow with the title text.
     * The HTML title attribute only shows up on mouse blur, not on keyboard and not in a mobile
     * device. So title would only be for text that is not important enough to show all users, or
     * for text that you show the users in another way as well, like in the label.
     * Also you cannot theme the native browser's title window like you can the JET
     * notewindow, so low vision users may have a hard time seeing it. 
     * For these reasons, the JET EditableValue components do not use the HTML's title
     * attribute.
     * </p>
     * 
     * <p>
     * To include formatted text in the title, format the string using html tags. 
     * For example the 
     * title might look like: 
     * <pre class="prettyprint"><code>&lt;html>Enter &lt;b>at least&lt;/b> 6 characters&lt;/html></code></pre>
     * If you use formatted text, it should be accessible 
     * and make sense to the user if formatting wasn't there.
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">title</code> option:</caption>
     * &lt;!-- Foo is InputText, InputNumber, Select, etc. -->
     * &lt;input id="username" type="text" data-bind="
     *    ojComponent: {component: 'ojFoo', title : 'enter at least 3 alphanumeric characters', 
     *                  pattern: '[a-zA-Z0-9]{3,}', value: ''}"/><br/>
     * 
     * @example <caption>Initialize <code class="prettyprint">title</code> option from html attribute 'title':</caption>
     * &lt;!-- Foo is InputText, InputNumber, Select, etc. -->
     * &lt;input id="username" type="text" value= "foobar" title="enter at least 3 alphanumeric characters" 
     *           pattern="[a-zA-Z0-9]{3,}"/><br/>
     * $("#username").ojFoo({}); // Foo is InputText, InputNumber, Select, etc. 
     * 
     * // reading the title option will return "enter at least 3 alphanumeric characters"
     * $("#username").ojFoo("option", "title"); // Foo is InputText, InputNumber, Select, etc. <br/>
     * 
     * @expose 
     * @access public
     * @instance
     * @default when the option is not set, the element's title attribute is used as its initial 
     * value if it exists. 
     * @memberof oj.editableValue
     * @type {string|undefined}
     */    
    title: "",
    

    
    /** 
     * The value of the component. 
     * 
     * <p>
     * When <code class="prettyprint">value</code> option changes due to programmatic 
     * intervention, the component always clears all messages - 
     * <code class="prettyprint">messagesHidden</code>, <code class="prettyprint">messagesShown</code>
     *  and <code class="prettyprint">messagesCustom</code>, runs deferred validation, and 
     * always refreshes UI display value.</br>
     * 
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; if there is a validation error the 
     * <code class="prettyprint">messagesHidden</code> option is updated.</li>
     * </ul>
     * </p>
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">value</code> option specified:</caption>
     * $(".selector").ojFoo({'value': '10'}); // Foo is InputText, InputNumber, Select, etc.<br/>
     * @example <caption>Get or set <code class="prettyprint">value</code> option, after initialization:</caption>
     * // Getter: returns '10'
     * $(".selector").ojFoo("option", "value");// Foo is InputText, InputNumber, Select, etc.
     * // Setter: sets '20'
     * $(".selector").ojFoo("option", "value", '20'); // Foo is InputText, InputNumber, Select, etc.
     * 
     * @expose 
     * @access public
     * @instance
     * @default When the option is not set, the element's dom value is used as its initial value 
     * if it exists. The type of value is as defined by the component that extends this class. Refer 
     * to specific components for defaults.
     * @memberof oj.editableValue
     * @type {Object|undefined}
     */
    value: undefined
  },
  
  // P U B L I C    M E T H O D S
  
  // @inheritdoc
  getNodeBySubId: function(locator)
  {
    return this._super(locator);
  },
           
  /**
   * whether the component is currently valid.  It is valid if it doesn't have any errors.
   * @example <caption>Check whether the component is valid:</caption>
   * var value = $(".selector").ojInputText("isValid");
   * @returns {boolean}
   * @access public
   * @instance
   * @expose
   * @memberof oj.editableValue
   */
  isValid : function ()
  {
    if (this._valid === undefined)
    {
      this._valid = this._getValid(); 
    }
    
    return this._valid;
  },
  
  /**
   * Called when the DOM underneath the component chages requiring a re-render of the component. An 
   * example is when the label for the input changes. <br/>
   * <p>
   * Another time when refresh might be called is when the locale for the page changes. When it 
   * changes, options used by its converter and validator that are locale specific, its hints, 
   * messages and translations will be updated. 
   * </p>
   * 
   * <p>
   * When <code class="prettyprint">refresh</code> method is called, the component may take various 
   * steps such as clearing messages, running validation etc., based on the state it is in. </br>
   * 
   * <h4>Steps Performed Always</h4>
   * <ul>
   * <li>The converter and validators used by the component are reset, and new converter and 
   * validator hints is pushed to messaging. E.g., notewindow displays the new hint(s).
   * </li>
   * </ul>
   *  
   * <h4>Running Validation</h4>
   * <ul>
   * <li>if component is valid when refresh() is called, the display value is refreshed if component 
   * has a converter set.</li>
   * <li>if component is invalid and is showing messages -
   * <code class="prettyprint">messagesShown</code> option is non-empty, when 
   * <code class="prettyprint">refresh()</code> is called, then all component messages are cleared 
   * and full validation run using the display value on the component. 
   * <ul>
   *   <li>if there are validation errors, then <code class="prettyprint">value</code> 
   *   option is not updated and the error pushed to <code class="prettyprint">messagesShown</code>
   *   option. 
   *   </li>
   *   <li>if no errors result from the validation, the <code class="prettyprint">value</code> 
   *   option is updated; page author can listen to the <code class="prettyprint">optionChange</code> 
   *   event on the <code class="prettyprint">value</code> option to clear custom errors.</li>
   * </ul>
   * </li>
   * <li>if component is invalid and has deferred messages when <code class="prettyprint">refresh()</code> 
   * is called, then all component messages are cleared and deferred validation is run.</li>
   * </ul>
   * </p>
   * 
   * <h4>Clearing Messages</h4>
   * <ul>
   * <li>If clearing messages only those created by the component are cleared. These include ones in 
   * <code class="prettyprint">messagesHidden</code> and <code class="prettyprint">messagesShown</code>
   *  options.</li>
   * <li><code class="prettyprint">messagesCustom</code> option is not cleared.</li>
   * </ul>
   * </p>
   * 
   * @example <caption>Refresh component after changing the label DOM.</caption>
   * // Foo is ojInputNumber, ojInputText, etc.
   * $(selector).ojFoo("refresh");<br/>
   * 
   * @access public
   * @instance
   * @expose
   * @memberof oj.editableValue
   * @since 0.7
   */
  refresh : function ()
  {
    this._super();
    this._doRefresh(true);
  },
  
  /**
   * Resets the component by clearing all messages options - <code class="prettyprint">messagesCustom</code>,  
   * <code class="prettyprint">messagesHidden</code> and <code class="prettyprint">messagesShown</code>,
   * and updates the component's display value using the option value. User entered values will be 
   * erased when this method is called.
   * 
   * @example <caption>Reset component</caption>
   * $(selector).ojInputText("reset"); <br/>
   * 
   * @access public
   * @instance
   * @expose
   * @memberof oj.editableValue
   * @since 0.7
   */
  reset : function ()
  {
    this._clearAllMessages();
    // since we are pushing component value to UI, only deferred validation need to be run; this is
    // same as setting value option.
    this._runDeferredValidation(this._VALIDATION_CONTEXT.RESET_METHOD);
    this._refreshComponentDisplayValue(this.options['value'], true);
  },
  
  /**
   * Takes all hidden messages that are in the <code class="prettyprint">messagesHidden</code> 
   * option and moves them to <code class="prettyprint">messagesShown</code> option. If there were 
   * no messages in <code class="prettyprint">messagesHidden</code> then this method simply returns. 
   * 
   * <p>
   * To view messages user has to set focus on the component. 
   * </p>
   * 
   * <p>
   * An <code class="prettyprint">optionChange</code> event is triggered on both 
   * <code class="prettyprint">messagesHidden</code> and <code class="prettyprint">messagesShown</code> 
   * options.
   * </p>
   * 
   * @example <caption>Display all messages including deferred ones.</caption>
   * $(selector).ojInputText("showMessages");
   * @access public
   * @instance
   * @expose
   * @memberof oj.editableValue
   * @since 0.7
   */
  showMessages : function ()
  {
    var clonedMsgs = [];
    var i;
    var msg;
    var msgs = this.options['messagesHidden'];
    var mutated = false;
    
    for (i = 0; i < msgs.length; i++)
    {
      mutated = true;
      msg = msgs[i];
      if (msg instanceof oj.ComponentMessage)
      {
        msg._forceDisplayToShown();
      }
      
      clonedMsgs.push(msg.clone()); // TODO: revisit clone msg??
    }
    
    if (mutated)
    {
      // clear hidden messages. push cloned hidden messages into messagesShown option 
      this._clearMessages('messagesHidden');
      
      this._updateMessagesOption('messagesShown', clonedMsgs);
    }
  },

  
  // P R O T E C T E D    C O N S T A N T S   A N D   M E T H O D S

  // *********** START WIDGET FACTORY METHODS (they retain _camelcase naming convention) **********
  
  /**
   * Validation mode specifying the kind of validation that gets run.
   * <ul>
   *   <li>FULL - the default and runs both the converter and all validators. </li>
   *   <li>VALIDATORS_ONLY - runs all validators including the required validator is run.</li>
   *   <li>REQUIRED_VALIDATOR_ONLY - runs just the required validator. </li>
   * </ul>  
   * @protected
   * @const
   * @type {Object}
   * @memberof oj.editableValue
   */       
  _VALIDATION_MODE : _sValidationMode,
  
  /**
   * The context the component can be in when validation is run. 
   * <ul>
   * <li>COMPONENT_CREATE - when component is created and we run validators. usually messages are 
   * not displayed right away, i.e, are 'deferred'. </li>
   * <li>VALUE_OPTION_CHANGE - when component's value is updated programmatically. messages are  
   * deferred.</li>
   * <li>REQUIRED_OPTION_CHANGE - when component's required option is updated programmatically. messages are
   * deferred.</li>
   * <li>USER_ACTION - when component runs validation as a result of user interating with component.
   * messages are displayed immediately.</li>
   * <li>VALIDATE_METHOD - when component's validate() method is called explicitly. messages are 
   * displayed immediately.</li>
   * </ul>
   * 
   * @protected
   * @const
   * @type {Object}
   * @memberof oj.editableValue
   * 
   */
  _VALIDATION_CONTEXT : oj.EditableValueUtils.validationContext,
  
  /**
   * Default options used by validate method. 
   * 
   * @protected
   * @const
   * @type {Object}
   * @memberof oj.editableValue
   * @see #validate
   */  
  _VALIDATE_METHOD_OPTIONS : oj.EditableValueUtils.validateMethodOptions,  
  
  /**
   * Called at component create time primarily to initialize options, often using DOM values. This 
   * method is called before _ComponentCreate is called, so components that override this method 
   * should be aware that the component has not been rendered yet. The element DOM is available and 
   * can be relied on to retrieve any default values. <p>
   * 
   * This method sets defaults for its options that have a DOM namesake. E.g., value, required, 
   * disabled etc. Subclasses can override this method to set their own defaults for these options.
   * Example, the value option is often not set on this.element for components like radioset, which
   * walk the sub-tree to determine the value.
   * 
   * @param {!Object} originalDefaults - original default options defined on the widget and its ancestors
   * @param {?Object} constructorOptions - options passed into the wiget constructor
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _InitOptions : function(originalDefaults, constructorOptions)
  {
    this._super(originalDefaults, constructorOptions); 
  },

  /**
   * Initializes options defined by this base class.
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _ComponentCreate : function ()
  {
    //remove attributes that trigger html5 validation + inline bubble
    var attrsToRemove = ["required", "title", "pattern"]; 
    var node = this.element;
    var savedAttributes = this._GetSavedAttributes(node); 
    
    this._super();
    
    this.options['messagesCustom'] = this.options['messagesCustom'] || [];
    this.options['messagesHidden'] = []; 
    this.options['messagesShown'] = this.options['messagesCustom'].length > 0 ? 
      this._cloneMessagesBeforeSet(this.options['messagesCustom']) : [];
    
    // update element DOM for disabled. TODO: say why
    this._SetDisabledDom(node);
    
    // we do this here instead of in _InitOptions because here we have the final value.
    // - an empty placeholder shows up if data changed after first binding 
    if (this._HasPlaceholderSet())
    {
      // update element placeholder
      this._SetPlaceholder(this.options['placeholder']);
      this._customPlaceholderSet = true;
    }
    
    // remove html5 validation attributes; it's safe to remove these here because components should 
    // have already initialized options based on DOM in _InitOptions().
    // Only need to do for <input> elements
    var tagName = node[0].tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea')
    {
      $.each(attrsToRemove, function (index, value)
      {
        if (value in savedAttributes)
        {
          node.removeAttr(value);
        }
      });
    }
  },
  
  /**
   * The value option alone is initialized here since it requires the component to be fully
   * created. Calling this.options.value before this method does not guarantee the correct 
   * value to be returned.
   *
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _AfterCreate : function ()
  {
    this._super();
    
    // refresh value, theming and aria attributes
    this._doRefresh(false);
    
    // decorate the label
    this._createOjLabel();

    // initialize component messaging
    this._initComponentMessaging();
    
    // run deferred validation 
    this._runDeferredValidation(this._VALIDATION_CONTEXT.COMPONENT_CREATE);
    
    // trigger optionChange for messagesShown if it's non-empty. messagesShown would have been 
    // updated in _ComponentCreate if messagesCustom was non-empty
    if (this.options['messagesShown'].length > 0)
    {
      this._setMessagesOption('messagesShown', this.options['messagesShown'], null, true);
    }

    this.widget().addClass("oj-form-control");
  },
  /**
   * <p>Saves all the element's attributes. In _destroy all attributes will be restored.
   * </p>
   *
   * @param {Object} element - jQuery selection to save attributes for
   * @protected
   * @memberof oj.editableValue
   * @instance
   * @override
   */
  _SaveAttributes : function (element)
  {
    this._SaveAllAttributes(element);
  },
  /**
   * @protected
   * @memberof oj.editableValue
   * @instance
   * @override
   */
  _RestoreAttributes : function (element)
  {
    this._RestoreAllAttributes(element);
  },
  /**
   * Performs post processing after _SetOption() is called. Different options when changed perform
   * different tasks. 
   * 
   * @param {string} option
   * @param {Object=} flags 
   * @protected
   * @memberof oj.editableValue
   * @instance
   */
  _AfterSetOption : function (option, flags)
  {
    switch (option)
    {
      case "disabled":
        this._AfterSetOptionDisabledReadOnly(option, oj.EditableValueUtils.disabledOptionOptions);
        break;

      case "displayOptions" :
        // clear the cached merged options; the getter setup for this.options['displayOptions']
        // will merge the new value with the defaults
        this._initComponentMessaging();
        break;

      case "help":
        this._Refresh(option, this.options[option]);
        break;
      
      case "messagesCustom":
        this._messagesCustomOptionChanged(flags);
        break; 
        
      case "placeholder":
        this._placeholderOptionChanged(flags);
        break;

      case "title":
        // no reason to refresh component when title changes.
        this._titleOptionChanged();
        break;
        
      case "translations": 
        this.refresh();
        break;

      case 'value':
        this._AfterSetOptionValue(option, flags);
        break;
  
      default:
        break;
    }
    
  },
  
  /**
   * Performs post processing after disabled or readOnly option changes by taking the following 
   * steps. (Steps are same for readOnly option).
   * <p>
   * if disabled component is enabled then, <br/>
   * - if there are no errors, run deferred validation. component could have been initialized with 
   * empty value and disabled.<br/>
   * - if component is invalid and showing messages clear component error, grab UI value and run 
   * full validation.<br/>
   * - if component is invalid and has hidden messages; do nothing. <br/>
   * </p>
   * <p>
   * if enabled component is disabled no validation is run.<br/>
   * </p>
   * 
   * @param {String} option
   * @param {Object} validationOptions
   * 
   * @protected
   * @memberof oj.editableValue
   * @instance
   */
  _AfterSetOptionDisabledReadOnly : function (option, validationOptions)
  {
    var isEnabled = !(this.options[option] || false);
    
    // always refresh
    this._Refresh(option, this.options[option]);
    if (isEnabled)
    {
      this._runMixedValidationAfterSetOption(validationOptions);
    }
  },

  /**
   * Performs post processing after value option changes by taking the following steps.
   * 
   * - triggers an optionChange and does writeback if required.<br/>
   * - if setOption was from programmatic intervention, <br/>
   * &nbsp;&nbsp;- clear custom messages and component messages; <br/>
   * &nbsp;&nbsp;- run deferred validation. if there is an error, updates messagesHidden. <br/>
   * - always refreshes UI display <br/>
   * 
   * @param {string} option
   * @param {Object=} flags
   * 
   * @protected
   * @memberof oj.editableValue
   * @instance
   * 
   */
  _AfterSetOptionValue : function(option, flags)
  {
    var context = flags ? flags['_context'] : null;
    var doNotClearMessages;
    var isUIValueChange = false;

    if (context)
    {
      isUIValueChange = context.originalEvent ? true : false;
      doNotClearMessages = context.doNotClearMessages || false;
    }

    if (!isUIValueChange)
    {
      // value option can be updated directly (i.e., programmatically or through user interaction) 
      // or updated indirectly as a result of some other option changing - e.g., converter, 
      // validators, required etc. See _updateValue() method for details.
      // When value changes directly due to programatic intervention (usually page author does this) 
      // then clear all messages and run deferred validation.
      // If value changes indirectly do not clear custom messages (component messages are already 
      // cleared) and run deferred validation.
      if (!doNotClearMessages) 
      {
        this._clearAllMessages(null);
      }
      this._runDeferredValidation(this._VALIDATION_CONTEXT.VALUE_OPTION_CHANGE);
    }
    
    // refresh UI display value
    this._Refresh(option, this.options[option], true);
  },
  
  /**
   * Whether the a value can be set on the component. For example, if the component is 
   * disabled then setting value on component is a no-op. 
   * 
   * @see #_SetValue
   * @return {boolean}
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _CanSetValue: function ()
  {
    var disabled = this.options['disabled'] || false;
    
    return (disabled) ? false : true;
  },
  
  /**
   * Detaches the widget from the element and restores element exactly like it was before the widget 
   * was attached.
   * @protected
   * @expose
   * @memberof oj.editableValue
   * @instance
   * 
   */
  _destroy : function ()
  {
    var labelIndex;
    var labelLength;
    var ret = this._super();
    
    this._clearAllMessages(null, true);
    this._getComponentMessaging().deactivate();

    // make sure the label is still "alive". Otherwise we could get error when we try to 
    // destroy it if the dom was removed first and ojLabel was destroyed directly.
    // also make sure to check if there is more than one label and destroy them individually.
    if (this.$label)
    {
      labelLength = this.$label.length;
      for (labelIndex = 0; labelIndex < labelLength; labelIndex++) 
     {
       if (this.$label[labelIndex] && 
           oj.Components.getWidgetConstructor(this.$label[labelIndex]) != null)
       {
         $(this.$label[labelIndex])._ojLabel( "destroy" );
       } 
     }     
    }


    return ret;
  },

  /**
   * Sets focus on the element that naturally gets focus. For example, this would be the input 
   * element for input type components. <br/>
   * 
   * @returns {*} a truthy value if focus was set to the intended element, a falsey value 
   * otherwise.
   * @expose
   * @memberof oj.editableValue
   * @instance
   * @protected
   * @since 0.7
   */
  Focus : function ()
  {
    this._GetContentElement().focus();
    return true;
  },
  
  /**
   * Called (by the widget factory) when the option changes, this method responds to the change 
   * by refreshing the component if needed. This method is not called for the options passed in 
   * during the creation of the widget.
   * 
   * @param {string} name of the option
   * @param {Object|string} value
   * @param {Object?} flags - optional flags. The following flags are currently supported:
   * <ul>
   *  <li>changed - true if the caller wants to indicate the value has changed, so no comparison is necessary</li>
   * </ul>
   * 
   * @expose
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _setOption : function (name, value, flags) 
  {
    var retVal;
    var skipSetOption = false;
    
    // Step 1: Remember previous values
    if (typeof name === "string" && value !== undefined)
    {
      switch (name)
      {
        case "messagesHidden":
          // this option can never be set programmatically by page author
          skipSetOption = true;
          break;          
          
        case "messagesShown":
          // this option can never be set programmatically by page author
          skipSetOption = true;
          break;
        
        case "rawValue":
          // rawValue is readOnly, so throw an error here.
          skipSetOption = true;
          break;
      }
    }
    
    
    if (skipSetOption)
    {
      oj.Logger.error(name + " option cannot be set");
      return this;
    }
    
    // Step 2: Update option value 
    retVal = this._superApply(arguments);
    
    // Step 3: Do post processing like triggering events, refreshing component DOM etc.
    this._AfterSetOption(name, flags);

    return retVal;
  },
  
  // *********** END WIDGET FACTORY METHODS **********
  
  /**
   * Returns a jquery object of the element representing the content node. This could be a jQuery 
   * object of the element the widget was invoked on - typically this is an input or select or 
   * textarea element for which a value can be set.
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   * @return {jQuery} the jquery element that represents the editable content. E.g., an input
   */
  _GetContentElement : function ()
  {
    return this.element;
  },

  /**
   * Returns a jquery object of the element(s) representing the label node(s) for the input 
   * component. 
   * First we look for the aria-labelledby attribute on the input.
   * If that's not found, we look for the label with 'for' attribute 
   * pointing to input.
   * If that's not found, we walk up the dom looking for aria-labelledby.
   * Note: multiple labels for one input is legal in html-5.
   * @memberof oj.editableValue
   * @instance
   * @protected
   * @return {Object} the jquery element that represents the input component's label.
   *  return null if it can't find anything.
   */
  _GetLabelElement : function ()
  {
    var ariaElement;
    var labelQuery;
    // If input has aria-labelledby set, then look for label it is referring to.
    var queryResult = this._getAriaLabelledByElement(this.element);
    if (queryResult !== null && queryResult.length !== 0)
    {
      return queryResult;
    }
    
    // if no aria-labelledby is on the input, then look for a label with 'for'
    // set.
    var id = this.element.prop("id");
    if (id !== undefined)
    {
      labelQuery = "label[for='" + id + "']";
      queryResult = $(labelQuery);
      if (queryResult.length !== 0)
      {
        return queryResult;
      }
    }
 
    // if no aria-labelledby on input and no label with 'for' pointing to input,
    // then as a final step we walk up the dom to see if aria-labelledby is set.
    // If so, then we find the label it is referring to.
    // This would be the case when you have multiple inputs grouped in a div 
    // <label id="grouplabel">Address</label>
    // <div aria-labelledby="grouplabel"><input/><input/><input/></div>
    ariaElement = this.element.closest("[aria-labelledby]");
    if (ariaElement.length !== 0)
    {
      // Element has aria-labelledby set, so look for label it is referring to.
      queryResult = this._getAriaLabelledByElement(ariaElement);
      if (queryResult !== null && queryResult.length !== 0)
      {
        return queryResult;
      }
    }
    return null;

  },
  
  
  /**
   * Returns the element's value. Normally, this is a call to this.element.val(), but for some 
   * components, it could be something else. E.g., for ojRadioset the element's value is really the 
   * value of the selected radio in the set. 
   * 
   * @override
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _GetElementValue : function () 
  {
    return this.element.val();
  },
  

/**
   * Returns a jquery object of the element that triggers messaging behavior. The trigger element 
   * is usually an input or select or textarea element for which a value can be set/retrieved and 
   * validated. 
   * 
   * @return {jQuery} jquery object 
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _GetMessagingLauncherElement : function ()
  {
    return this._GetContentElement();
  },
  
  /**
   * Returns the normalized converter instance. Since EditableValue does not have a converter 
   * option, this returns null.
   * 
   * @return {Object} null
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _GetConverter : function () 
  {
    return null;
  },

  /**
   * Returns an array of implicit validators setup by component. This list contains validators for 
   * the internal use of the component and are not a part of this.options.validators. <br/>
   * E.g., if the pattern attribute or option is set, a RegExpValidator instance is automatically 
   * created and added to this list. <br/>
   * RequiredValidator is tracked separately from the default validators.
   * 
   * @return {Object} a map of string name to the validator instance. 
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _GetImplicitValidators : function ()
  {
    if (!this._implicitValidators)
    {
      this._implicitValidators = {};
    }
    
    return this._implicitValidators;
  },
          
  /**
   * Returns the display value that is ready to be passed to the converter.
   * 
   * @param {Object} value the stored value if available that needs to be formatted for display
   * @return {string} usually a string display value
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _GetDisplayValue : function (value) 
  {
    return this._GetContentElement().val();
  },
  /**
   * For components that have the 'validators' option, 
   * this returns an array of all validators 
   * normalized from the validators option set on the component. <br/>
   * Since EditableValue does not include the 'validators' option, this returns [].
   * 
   * @return {Array} of validators. 
   * Since EditableValue does not include the 'validators' option, this returns [].
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _GetNormalizedValidatorsFromOption : function ()
  {
    return [];
  },
  /**
   * Returns an array of all validators built by merging the validators option set on the component 
   * and the implicit validators setup by the component. <br/>
   * This does not include the implicit required validator. Components can override to add to this 
   * array of validators.
   * 
   * @return {Array} of validators
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _GetAllValidators : function ()
  {
    var allValidators;
    var idx;
    var implicitValidatorMap;
    var implicitValidators;
    var normalizedValidators;
          
    if (!this._allValidators)
    {
      allValidators = [];
      implicitValidatorMap = this._GetImplicitValidators(), 
      implicitValidators = [];

      // combine public and implicit validators to get the combined list
      var keys = Object.keys(implicitValidatorMap), valType;
      var len  = keys.length;
      if (len > 0)
      {
        for (idx = 0; idx < len; idx++) 
        {
          valType = keys[idx];
          implicitValidators.push(implicitValidatorMap[valType]);
        }
        allValidators = allValidators.concat(implicitValidators);
      }
        
      normalizedValidators = this._GetNormalizedValidatorsFromOption();
      if (normalizedValidators.length > 0)
      {
        // Add normalize validators 
        allValidators = allValidators.concat(normalizedValidators);
      }
      
      this._allValidators = allValidators;
    }
    
    return this._allValidators || [];
  },
  
  /**
   * EditableValue caches the validators to be run, within this._allValidators variable.
   * This is great; however when the implicit validator needs to be reset [i.e. min + max changing] 
   * or the validators option changes, then the cached this._allValidators needs to be cleared. 
   * This method also updates the messaging strategies as hints associated with validators could 
   * have changed.
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _ResetAllValidators : function () 
  {
    if (this._allValidators)
    {
      this._allValidators.length = 0;
    }
    this._allValidators = null;
    
    // update messagingstrategy as hints associated with validators could have changed
    this._getComponentMessaging().update(this._getMessagingContent(
            this._MESSAGING_CONTENT_UPDATE_TYPE.VALIDATOR_HINTS));

  },
  
  /**
   * Whether the component is required. EditableValue doesn't support the required option,
   * so return false.  This allows us to keep some of the required code in EditableValue.
   * 
   * @return {boolean} true if required; false
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _IsRequired : function () 
  {
    return false;
  },
  
  /**
   * Convenience handler for the DOM 'change' event. Subclasses are expected to wire up event 
   * handlers for DOM events that they wish to handle.<br/>
   * 
   * The implementation retrieves the display value for the component by calling _GetDisplayValue() 
   * and calls _SetValue(), with full validation.
   * 
   * @param {Event} event DOM event 
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _HandleChangeEvent : function (event) 
  {
    var submittedValue = this._GetDisplayValue();
    // run full validation
    this._SetValue(submittedValue, event);
  }, 
  /**
   * Convenience function to set the rawValue option. Called by subclasses
   * 
   * @param {String} val value to set rawValue to
   * @param {Event} event DOM event 
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _SetRawValue : function (val, event)
  {
    var flags = {};
    flags['_context'] = {originalEvent: event, writeback: true, internalSet: true, readOnly: true};

    if (this.options['rawValue'] !== val)
      this.option("rawValue", val, flags);
  },

  /**
   * Called in response to a change in the options set for this component, this method refreshes the 
   * component display value. Subclasses can override to provide custom refresh behavior.
   * 
   * @param {String=} name the name of the option that was changed
   * @param {Object=} value the current value of the option
   * @param {boolean=} forceDisplayValueRefresh
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _Refresh : function (name, value, forceDisplayValueRefresh)
  {
    var helpDef;
    var helpSource;
    var id;

    switch (name)
    {
      case "converter":
        value = this.options['value'];
        this._refreshComponentDisplayValue(value, forceDisplayValueRefresh);
        break;
        
      case "disabled":
        this._refreshTheming("disabled", this.options['disabled']);
        break;
        
      case "help":
        // refresh the help - need to keep the label in sync with the input.
        if (this.$label)
        {
          helpDef = this.options.help["definition"];
          helpSource = this.options.help["source"];
          this.$label._ojLabel("option", "help", 
                               {"definition" : helpDef, "source" : helpSource});
          this._refreshDescribedByForLabel();
                    
        }
        break;
     
      case "value":
        this._refreshComponentDisplayValue(value, forceDisplayValueRefresh); 
        break;
        
    }
  },

  /**
   * <p>Notifies the component that its subtree has been made hidden programmatically 
   * after the component has been created.
   *
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _NotifyHidden: function()
  {
    this._superApply(arguments);
    this._getComponentMessaging().close();
  },
  /**
   * <p>Notifies the component that its subtree has been removed from the 
   * document programmatically after the component has
   * been created.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _NotifyDetached: function()
  {
    this._superApply(arguments);
    this._getComponentMessaging().close();
  },
  /**
   * Called anytime the label DOM changes requiring a reset of any dependent feature that caches the 
   * label, including all validators.
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected   
   */
  _ResetComponentState : function ()
  {
    // the DOM for the label and its text could have changed. 
    if (this.$label)
    {
      this.$label._ojLabel("refresh");
    }

    // reset all validators when label changes
    this._implicitReqValidator = null;
    this._converter = null;
    this._ResetAllValidators();
  },  
  
  /**
   * Called when the display value on the element needs to be updated. This method updates the 
   * (content) element value. Widgets can override this method to update the element appropriately. 
   * 
   * @param {String} displayValue of the new string to be displayed
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
  */  
  _SetDisplayValue : function (displayValue) 
  {
    var contentElem = this._GetContentElement();
    if (contentElem.val() !== displayValue)
      contentElem.val(displayValue);
  },
  /**
   * Sets the disabled option onto the dom. 
   * Component subclasses can override this method to not do this in cases where it is invalid, 
   * like on a div (e.g., radioset's root dom element is a div).
   * @param {Object} node - dom node
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   * @since 1.0.0
   */
  _SetDisabledDom : function(node)
  {
    if (typeof this.options['disabled'] === "boolean")
    {
      node.prop("disabled", this.options['disabled']);
    }
  },
  
  /**
   * Sets the placeholder text on the content element by default. It sets the placeholder attribute
   * on the element. Component subclasses can override this method to control where placeholder text
   * gets set.
   * @param {string} value
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _SetPlaceholder : function(value)
  {
    this._GetContentElement().attr("placeholder", value);
  },
  
  /**
   * Sets the placeholder option with the value. 
   * 
   * @param {string} value
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */  
  _SetPlaceholderOption : function (value)
  {
    this.options['placeholder'] = value;
  },
  
  /**
   * whether the placeholder option is set
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _HasPlaceholderSet : function()
  {
    // - an empty placeholder shows up if data changed after first binding 
    return this.options['placeholder'];
  },  
    
  /**
   * Clear the placeholder option
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _ClearPlaceholder : function()
  {
    // - an empty placeholder shows up if data changed after first binding 
    this._SetPlaceholderOption("");
    this._SetPlaceholder("");
  },

  /**
   * Runs full validation on the newValue (usually the display value) and sets the parsed value on 
   * the component if value passes basic checks and there are no validation errors. <br/>
   * If the newValue is undefined or if it differs from the last saved displayValue this method 
   * skips validation and does not set value (same as ADF).<br/>
   * 
   * @param {string|Object} newValue the ui value that needs to be parsed before it's set.
   * @param {Object=} event an optional event if this was a result of ui interaction. For user 
   * initiated actions that trigger a DOM event, passing this event is required. E.g., if user action 
   * causes a 'blur' event.
   * @param {Object=} options - an Object literal that callers pass in to determine how validation 
   * gets run. 
   * @param {boolean=} options.doValueChangeCheck - if set to true compare newValue with last 
   * displayValue before running validation; if false, always run validation. E.g., set to false 
   * when validate() is called.
   * @param {boolean=} options.doNotClearMessages - if set method will not clear all messages. This 
   * is provided for callers that may want to clear only some of the messages. E.g., when required 
   * option changes, it clears only component messages, not custom.
   * @param {number=} options.validationMode - accepted values (defined in _VALIDATION_MODE) are:
   * <ul>
   *   <li>FULL - the default and runs both the converter and all validators. </li>
   *   <li>VALIDATORS_ONLY - runs all validators including the required validator is run.</li>
   *   <li>REQUIRED_VALIDATOR_ONLY - runs just the required validator. </li>
   * </ul>
   * @return {boolean} false if value was not set due to validation error. 
   * @example  <caption>Widget subclasses can use this convention to run full validation</caption>
   * this._SetValue(value, event);
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   * 
   */
  _SetValue : function (newValue, event, options)
  {
    var doValueChangeCheck = (options && typeof options.doValueChangeCheck === "boolean") ? 
                            options.doValueChangeCheck : true, parsed;
    
    // disallow setting a value of undefined by widgets
    if (newValue === undefined)
    {
      oj.Logger.warn("Attempt to set a value of undefined");
      return false;
    }

    if (!doValueChangeCheck || newValue !== this._getLastDisplayValue()) 
    {
      parsed = this._Validate(newValue, event, options);
      
      // if validation passed
      if (parsed !== undefined && this.isValid())
      {
        var updateContext;
        if (options && options['_context'])
        {
          updateContext = options['_context'];
        }
        // update value option
        this._updateValueOption(parsed, event, options && options.validationContext,
            updateContext);
        return true;
      }
    }
    else
    {
      if (oj.Logger.level > oj.Logger.LEVEL_WARN)
      {
        oj.Logger.info("Validation skipped and value option not updated as submitted value '" + 
                (newValue.toString) ? newValue.toString() : newValue + " same as previous.");
      }
    }
    
    return false;
  },
  
  /**
   * Runs full validation on the value. If value fails basic checks 
   * (see <a href="#_CanSetValue">_CanSetValue</a>, or if value failed validation, this method 
   * returns false. Otherwise it returns true.
   * 
   * <p>
   * Components should call this method if they know UI value has changed and want to set the 
   * new component value. 
   * </p>
   * 
   * @param {string|Object} newValue the actual value to be set. Usually this is the string display value
   * @param {Object=} event an optional event if this was a result of ui interaction. For user 
   * initiated actions that trigger a DOM event, passing this event is required. E.g., if user action 
   * causes a 'blur' event.
   * @param {{doNotClearMessages:boolean,validationContext:number,validationMode:number}=} options 
   * an Object literal that callers pass in to determine how validation gets run. 
   * @param {boolean=} options.doNotClearMessages - if set method will not clear all messages. This 
   * is provided for callers that may want to clear only some of the messages. E.g., when required 
   * option changes, it clears only component messages, not custom.
   * @param {number=} options.validationContext - the context this method was called. When not set it 
   * defaults to _VALIDATION_CONTEXT.USER_ACTION.
   * @param {number=} options.validationMode - accepted values defined in _VALIDATION_MODE
   * 
   * @return {Object|string|undefined} the parsed value or undefined if validation failed
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   */
  _Validate : function (newValue, event, options)
  {
    var mode = options && options.validationMode ? options.validationMode : 
                this._VALIDATION_MODE.FULL; 
    var context = options && options.validationContext ? options.validationContext : 
                this._VALIDATION_CONTEXT.USER_ACTION;
    var doNotClearMessages = options && options.doNotClearMessages || false, result;

    // disallow setting a value of undefined by widgets
    if (newValue === undefined)
    {
      oj.Logger.warn("Attempt to set a value of undefined");
    }
    else if (this._CanSetValue())
    {
      if (!doNotClearMessages)
      {
        this._clearAllMessages(event);
      };
      
      this._setLastSubmittedValue(newValue);
      
      try
      {
        return this._runNormalValidation(newValue, mode, context, event);
      }
      catch(e)
      {
        // validation failed
      }
    }
    else
    {
      if (oj.Logger.level > oj.Logger.LEVEL_WARN)
      {
        oj.Logger.info("Validation skipped and value option not set as component state does not " + 
                " allow setting value. For example if the component is readonly or disabled.");
      }
    }
    
    return result;
  },  
  
  _CompareOptionValues : function (option, value1, value2)
  {
    if (option === 'value')
    {
      return oj.Object.compareValues(value1, value2);
    }
    else if (option.indexOf('messages') === 0)
    {
      return this._messagesEquals(value1, value2);
    }
    
    return this._superApply(arguments);
  },
  
  /**
   * Returns the default styleclass for the component. All input components must override.
   * 
   * @return {string}
   * 
   * @memberof oj.editableValue
   * @instance
   * @protected
   * @abstract
   */
  _GetDefaultStyleClass : function ()
  {
    oj.Assert.failedInAbstractFunction();
    return "";
  },
    
  
  // I N T E R N A L   P R I V A T E   C O N S T A N T S    A N D   M E T H O D S 
  // Subclasses should not override or call these methods
  
  /**
   * Types of messaging content to update.
   * <ul>
   * <li>'ALL' - builds all messaging content</li>
   * <li>'VALIDITY_STATE' - updates only validityState every time validation runs and there are 
   * new messages or when the messages option changes.</li>
   * <li>'CONVERTER_HINT' - updates only converter hints, this is used when converter option 
   * changes</li>
   * <li>'VALIDATOR_HINTS' - updates only validator hints, this is used when validators option 
   * changes</li>
   * <li>'TITLE' - updates only title, when the title property changes</li>
   * </ul>
   * @private
   */
  _MESSAGING_CONTENT_UPDATE_TYPE : {ALL : 1, 
                                    VALIDITY_STATE : 2, 
                                    CONVERTER_HINT : 3, 
                                    VALIDATOR_HINTS : 4, 
                                    TITLE : 5},
                                   
  /**
   * when below listed options are passed to the component, corresponding CSS will be toggled
   * @private
   * @const
   * @type {Object}
   * @memberof oj.editableValue
   */
  _OPTION_TO_CSS_MAPPING: {
    "disabled": "oj-disabled",
    "required": "oj-required"
  },
  
    
  /**
   * Clears all messages for this component. Today this only happens when <br/>
   *  - the component's value changes as a result of user interaction, <br/>
   *  - the reset method is called, <br/>
   *  - component is destroyed.<br/>
   * 
   * @param {Event=} event
   * @param {boolean=} doNotSetOption default value is false; a true value clears the option 
   * directly without using the public option method, causing no events to be fired. 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _clearAllMessages : function(event, doNotSetOption)
  {
    doNotSetOption = doNotSetOption ? true : false;
    if (!doNotSetOption)
    {
      this._clearMessages('messagesHidden', event);
      this._clearMessages('messagesShown', event);
      this._clearMessages('messagesCustom', event);
    }
    else
    {
      this.options['messagesHidden'] = [];
      this.options['messagesShown'] = [];
      this.options['messagesCustom'] = [];
    }
  },
  
  /**
   * Clears all messages that were added by component. These includes all messages in messagesHidden 
   * option and all messages except custom in messagesShown. 
   * 
   * Called when these options change - validators, disabled, readonly, required, and methods - 
   * refresh are called. 
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */  
  _clearComponentMessages : function ()
  { 
    var beforeLen;
    var msg;
    var shownMsgs = this.options['messagesShown'];

    beforeLen = shownMsgs.length;
    this._clearMessages('messagesHidden'); 
    
    // remove component messages in messagesShown. Custom messges are kept intact.
    for (var i = beforeLen -1; i >= 0; i--)
    {
      msg = shownMsgs[i];
      if (msg instanceof oj.ComponentMessage)
      {
        shownMsgs.splice(i, 1);
      }
    }
    
    if (shownMsgs.length !== beforeLen)
    {
      this._setMessagesOption('messagesShown', shownMsgs, null, true);
    }    
  },
  
    
  /**
   * Sets the messages option with the new value. Updates the new 'valid' state and notifies 
   * messaging.
   * 
   * This method updates the option directly without invoking setOption() method. This is done by 
   * setting the following property in flags parameter of the option() method - 
   * <code class="prettyprint">{'_context': {internalSet: true}}</code>
   * 
   * @param {string} key
   * @param {Array} value
   * @param {Event=} event
   * @param {Boolean=} changed
   *
   * @private
   */
  _setMessagesOption : function (key, value, event, changed)
  {
    var flags = {};
    
    // Optimize for the common 'clear' operation
    var bothEmpty = value.length === 0 && this.options[key].length === 0;
    
    if (changed || !bothEmpty)
    {
      // 'messagesCustom' is not read-only, but 'messagesShown' and 'messagesHidden' are
      flags['_context'] = {originalEvent: event, writeback: true, internalSet: true};
      if (key !== "messagesCustom")
        flags['_context']['readOnly'] = true;
      flags['changed'] = changed || !bothEmpty;
      
      this._resetValid();
      
      this.option(key, value, flags);
      
      this._updateMessagingContent();
    }
  },  
  
  /**
   * Clears the messages options - <code class="prettyprint">messagesHidden</code>,
   * <code class="prettyprint">messagesShown</code>, <code class="prettyprint">messagesCustom</code>.
   * 
   * @param {String} option messages option that is being cleared.
   * @param {Event=} event
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _clearMessages : function (option, event)
  {
    this._setMessagesOption(option, [], event);
  },
  
  /**
   * Clones messages before it's set. <br/>
   * 
   * @param {Array=} value
   * @returns {Array} of cloned messages
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */    
  _cloneMessagesBeforeSet : function (value)
  {
    var i;
    var msg;
    var msgsClone = [];
    var val;
    
    // we want all messages to be an instance of oj.Message. So clone array
    if (value && value.length > 0)
    {
      for (i = 0; i < value.length; i++)
      {
        val = value[i];
        if (val instanceof oj.Message)
        {
          msgsClone.push(val.clone());
        }
        else
        {
          msg = new oj.Message(val['summary'], val['detail'], val['severity']);
          msg =  Object.freeze ? Object.freeze(msg) : msg;
          msgsClone.push(msg);
        }
      }
    }
    
    return msgsClone;
  },  
  
 
  /** 
   * Create the _ojLabel component with help (required is done in the components that support
   * required) see oj.EditableValueUtils._refreshRequired
   * @private
   * @memberof oj.editableValue
   * @instance
   * 
   */
  _createOjLabel : function ()
  {
    var helpDef;
    var helpSource;
    
    this.$label = this._GetLabelElement();
    if (this.$label)
    {
      helpDef = this.options['help']['definition'];
      helpSource = this.options['help']['source'];

      // create the ojLabel component 
      this.$label._ojLabel(
        {rootAttributes:{'class': this._GetDefaultStyleClass()+"-label"},
        help:{'definition': helpDef, 
              'source': helpSource}});
      this._createDescribedByForLabel();
    }    
  },
  /**
   * Refreshes the aria-describedby for label element's helpIcon
   * @protected
   * @memberof oj.editableValue
   * @instance
   */
  _createDescribedByForLabel : function ()
  {
    var helpDef = this.options['help']['definition'];
    var helpSource = this.options['help']['source'];
    var labelId;
    
    if ((helpSource != null) || (helpDef != null))
    {
      // get label's helpIconSpan get the id and add it here.
      labelId = this.$label.attr("id");
      if (labelId) 
      {
        this._addAriaDescribedBy(labelId + _HELP_ICON_ID);
      }        
    }
  },
    /**
   * Refreshes the aria-describedby for label element's helpIcon
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _refreshDescribedByForLabel : function ()
  {
    var helpDef = this.options['help']['definition'];
    var helpSource = this.options['help']['source'];
    // if aria-labelledby is set, 
    // add/remove aria-describedby to the inputs pointing to
    // the label+"_helpIcon".
    var labelId = this.$label.attr("id");
    if (labelId) 
    {
      if ((helpSource != null) || (helpDef != null))
        this._addAriaDescribedBy(labelId + _HELP_ICON_ID);
      else
        this._removeAriaDescribedBy(labelId + _HELP_ICON_ID);
    }  
  },
  /**
   * Refreshes the component to respond to DOM changes, in which case fullRefresh=true. 
   * @param {boolean} fullRefresh true if a full refresh of the component is desired.
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _doRefresh : function (fullRefresh)
  {
    var runFullValidation = false;
    
    fullRefresh = fullRefresh || false;
    if (fullRefresh)
    {
      // reset state and re-initialize component messaging, since refresh() can be called when 
      // locale changes, requiring component to show messaging artifacts for current locale. 
      this._ResetComponentState();
      this._initComponentMessaging();
      
      if (this._hasInvalidMessagesShowing())
      {
        runFullValidation = true;
      }

      // clear component messages always
      this._clearComponentMessages();
      if (runFullValidation)
      {
        // run full validation using the current display value; 
        // show messages immediately if there are errors otherwise set value to option
        this._updateValue(oj.EditableValueUtils.refreshMethodOptions);
      }
      else
      {
        // run deferred validation if comp is either showing a deferred error or has no errors. 
        // But only when required is true. 
        if (this._IsRequired())
        {
          this._runDeferredValidation(oj.EditableValueUtils.refreshMethodOptions.validationContext);
        }
        // refresh UI display value when there are no errors or where there are only deferred errors 
        this._Refresh("value", this.options['value'], true);
      }
    }
    else
    {
      // we call this._doRefresh(false); in component create
      // we call this._doRefresh(true); from refresh.
      this._Refresh("value", this.options['value']);
    }
    // always refresh these
    this._Refresh("disabled", this.options['disabled']);
  },
  
  /**
   * Gets the last stored model value
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _getLastModelValue : function ()
  {
    return this._oj_lastModelValue;
  },
          
  _getLastDisplayValue : function () 
  {
    // initially, _oj_lastElementValue is undefined. But the browser returns "" for the 
    // displayValue. 
    if (this._oj_lastElementValue === undefined)
      this._oj_lastElementValue = "";
    return this._oj_lastElementValue;
  },
  /**
   * Get the element whose id matches the elem's aria-labelledby value, if any.
   * @param {Object} elem the dom element from which you want to get the 
   * aria-labelledby property value
   * @return {jQuery} if element does not have aria-labelledby defined, then
   *    returns null. If it  does, then return a new jQuery object with the 
   *    label with an id equal to the aria-labelledby value. If no match, then
   *    the jQuery object will be empty.
   *    
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _getAriaLabelledByElement: function (elem)
  {
    // look for a label with an id equal to the value of aria-labelledby. 
    // .prop does not work for aria-labelledby. Need to use .attr to find
    // aria-labelledby.
    var ariaId = elem.attr("aria-labelledby");
    var labelQuery;

    if (ariaId !== undefined )
    {
      labelQuery = "label[id='" + ariaId + "']"; 
      return $(labelQuery);
    }    
    else
      return null;
  },
  /**
   * Get the id of the element whose aria-labelledby is set
   * @param {Object} elem the dom element from which you want to get the 
   * aria-labelledby property value
   * @return {string} id or null
   *    
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _getAriaLabelledById: function (elem)
  {
    var id = null;
    
    var ariaLabelledByElem = this._getAriaLabelledByElement(elem);
    if (ariaLabelledByElem !== null && ariaLabelledByElem.length !== 0)
    {
      id = ariaLabelledByElem.attr("id")
    }
    return id;
  },
  /**  
   * Add the aria-describedby on the content element(s) if it isn't already there.
   * 
   * @param {string} id the id for aria-describedby
   * @private
   * @memberof oj.editableValue
   * @instance
   * 
   */
  _addAriaDescribedBy : function (id)
  {
    var contentElements = this._GetContentElement();
    var index;
    
    contentElements.each(function() {
      var describedby = $(this).attr("aria-describedby");
      var tokens;

      tokens = describedby ? describedby.split(/\s+/) : [];
      // Get index that id is in the tokens, if at all.
      index = $.inArray(id, tokens);
      // add id if it isn't already there
      if (index === -1)
        tokens.push(id);
      describedby = $.trim(tokens.join(" "));
      $(this).attr("aria-describedby", describedby);
    });
      
  },
  /**  
   * Remove the aria-describedby from the content element(s).
   * 
   * @param {string} id the id for aria-describedby
   * @private
   * @memberof oj.editableValue
   * @instance
   * 
   */
  _removeAriaDescribedBy : function (id)
  {

    var contentElements = this._GetContentElement();        

    contentElements.each(function() {

      var describedby;
      var index;
      var tokens;
      
      // get aria-describedby that is on the content element(s)
      describedby = $(this).attr("aria-describedby");
      // split into tokens
      tokens = describedby ? describedby.split(/\s+/) : [];
      // Get index that id is in the tokens, if at all.
      index = $.inArray(id, tokens);
      // remove that from the tokens array
      if (index !== -1)
        tokens.splice(index, 1);
      // join the tokens back together and trim whitespace
      describedby = $.trim(tokens.join(" "));
      if (describedby)
        $(this).attr("aria-describedby", describedby);
      else
        $(this).removeAttr("aria-describedby");
     });

  },

  /**
   * Returns a concat of messagesShown and messagesHidden.
   * 
   * @returns {Array}
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _getMessages : function()
  {
    return this.options['messagesShown'].concat(this.options['messagesHidden']); // todo: revisit
  },
  
  // helper method to retrieve the label text.          
  _getLabelText : function ()
  {
    if (this.$label)
    {
      return this.$label.text();
    }
  },

  _getValidityState : function ()
  {
    if (this._validityState)
    {
      return this._validityState;
    }
    else
    {
      
      this._validityState = new oj.ComponentValidity(this.isValid(), this._getMessages());
    }
    return this._validityState;
  },

  
  /**        
   * Whether component has invalid messages.
   * 
   * @return {boolean} true if invalid; false otherwise
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _hasInvalidMessages : function ()
  {
    return !oj.Message.isValid(this._getMessages());
  },
  
  /**        
   * Whether there are invalid messages, that are currently showing.
   * 
   * @return {boolean} 
   * @private
   * @memberof oj.editableValue
   * @instance
   */  
  _hasInvalidMessagesShowing : function ()
  {
    return (!this.isValid() && this.options['messagesShown'].length > 0);
  },
  
  /**        
   * Whether component has invalid messages added by component, that are currently showing.
   * 
   * @return {boolean} 
   * @private
   * @memberof oj.editableValue
   * @instance
   */  
  _hasInvalidComponentMessagesShowing : function ()
  {
    var compMsgs;
    var msg;
    var shown = this.options['messagesShown'];
    
    for (var i = 0; i < shown.length; i++)
    {
      msg = shown[i];
      if (msg instanceof oj.ComponentMessage && msg._isMessageAddedByComponent())
      {
        compMsgs = compMsgs || [];
        compMsgs.push(msg);
      }
    }
    
    return (compMsgs === undefined) ? false : !oj.Message.isValid(compMsgs);
  },  
  
  /**
   * Initializes component messaging both when component is initialized or when displayOptions is 
   * set/changed. 
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _initComponentMessaging : function()
  {
    var compMessaging = this._getComponentMessaging();
    var messagingLauncher = this._GetMessagingLauncherElement();
    var compContentElement = this._GetContentElement();
    var messagingContent = this._getMessagingContent(this._MESSAGING_CONTENT_UPDATE_TYPE.ALL);
    
    // if default placeholder is currently set then it needs to be cleared here. This is needed for 
    // the following reasons
    // i. a component is reinitialized when the locale changed, requiring the converter hint for 
    // new locale to be set as placeholder.
    // ii. or a component's placeholder option or displayOptions option, could have changed 
    // requiring the placeholder to be reset if it's currently set to the default.
    // 
    if (!this._customPlaceholderSet)
    {
      this._ClearPlaceholder();
    }
    
    compMessaging.activate(messagingLauncher, compContentElement, messagingContent);
  },
  
  
  /**
   * Called after messagesCustom option changed. This method pushes custom messages to the 
   * messagesShown option.
   * 
   * @param {Object} flags
   * @returns {undefined}
   * @private
   */  
  _messagesCustomOptionChanged : function (flags)
  {
    var context = flags ? flags['_context'] : null;
    var customMsgs = this.options['messagesCustom'];
    var i;
    var msg;
    var previousShown = this.options['messagesShown'];
    var shownMsgs = [];
    
    // remove old custom messages from messagesShown array
    for (i = 0; i < previousShown.length; i++)
    {
      msg = previousShown[i];
      if (msg instanceof oj.ComponentMessage && msg._isMessageAddedByComponent())
      {
        shownMsgs.push(msg);
      }
    }
    
    // add new customMsgs to messagesShown
    for (i = 0; i < customMsgs.length; i++)
    {
      shownMsgs.push(customMsgs[i]);
    }
    
    // set 'messagesShown' option as an internal set
    this._setMessagesOption('messagesShown', shownMsgs, 
                            context ? context.originalEvent : null,
                            flags && flags['changed']);
  },

  _placeholderOptionChanged : function (flags)
  {
    var context = flags && flags['_context'] || {};
    var refreshMessagingOptions = 
        //  internalMessagingSet indicates whether the current change is from the messaging module.
        // see ComponentMessaging for details
        context.internalMessagingSet ? false : true;
    var value = this.options['placeholder'];

    this._SetPlaceholder(value);
    if (refreshMessagingOptions)
    {
      // if placeholder was set and it's not from messaging code, then the messaging display options 
      // may need to re-evaluated. E.g., the default display for 
      // converterHint: ['placeholder', 'notewindow'] is 'placeholder', but if user were to set a 
      // custom placeholder, this changes the default display for convererHint from 'placeholder'
      // to 'notewindow'. 
      this._customPlaceholderSet = true;
      if (this._GetConverter())
      {
        this._initComponentMessaging();
      }
    }
    else
    {
      this._customPlaceholderSet = false;
    }
  },
    
  _setLastModelValue : function (value)
  {
    this._oj_lastModelValue = value;
  },

  _setLastSubmittedValue : function (value) 
  {
    this._oj_lastElementValue = value;
  },

  _titleOptionChanged : function ()
  {
    // when title changes push new title to messaging
    this._getComponentMessaging().update(
            this._getMessagingContent(this._MESSAGING_CONTENT_UPDATE_TYPE.TITLE));
  },
  
  /**
   * Adds messages to the option specified - <code class="prettyprint">messagesShown</code> or 
   * <code class="prettyprint">messagesHidden</code>. 
   * 
   * @param {String} option name of the option
   * @param {Object|Array} newMsgs an Array of one or more oj.Message object. 
   * @param {Event=} event
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _updateMessagesOption : function(option, newMsgs, event) 
  {
    var i;
    var len;
    var msgs;
    
    if (typeof newMsgs === "object" && Array.isArray(newMsgs)) 
    {
      msgs = this.options[option];

      len = newMsgs.length;
      for (i = 0; i < len; i++)
      {
        msgs.push(newMsgs[i]);
      }
    }
    
    this._setMessagesOption(option, msgs, event, true);
  },
  
  
  /**
   * Called after the messages option has changed to update internal valid property and messaging 
   * display.
   * 
   * @private
   */
  _updateMessagingContent : function() 
  {
    // update component messaging
    this._getComponentMessaging().update(this._getMessagingContent());
  },  
  
  /**
   * Writes the value into the option by calling the option method.  
   * 
   * @param {Object|string} newValue the new value to be written to option
   * @param {Object=} event the original event that triggered this
   * @param {number=} validationContext the context in which validation was run that resulted in 
   * value being updated.
   * @param {Object=} updateContext the context for updating the value option.
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   * @see #_setOption
   * @see #_AfterSetOptionValue
   */
  _updateValueOption : function (newValue, event, validationContext, updateContext)
  {
    var context = updateContext || {};
    
    // set dom event
    if (event)
    {  
      context.originalEvent = event;
    }
    
    // set writeback flag that determines whether value is written back. 
    switch (validationContext)
    {
      // value is written back outside of normal UI interaction in the following cases.
      case this._VALIDATION_CONTEXT.CONVERTER_OPTION_CHANGE:
      case this._VALIDATION_CONTEXT.DISABLED_OPTION_CHANGE:
      case this._VALIDATION_CONTEXT.READONLY_OPTION_CHANGE:
      case this._VALIDATION_CONTEXT.REFRESH_METHOD:
      case this._VALIDATION_CONTEXT.REQUIRED_OPTION_CHANGE:
      case this._VALIDATION_CONTEXT.VALIDATE_METHOD:
      case this._VALIDATION_CONTEXT.VALIDATORS_OPTION_CHANGE:
        
        context.writeback = true;
        
        // when the above options change or methods are called, and full validation is run the 
        // current display value is parsed, and set on the value option if all validations pass. 
        // Typically when the value option changes - either programmatically or user changes it, we 
        // end up clearing all 3 messages options.
        // But when value changes indirectly as a result of the above cases, then we do not clear 
        // custom messages. So a special flag is set so _AfterSetOptionValue can do the right 
        // thing. Component messages are already cleared when this method is called.
        context.doNotClearMessages = true;
        break;
    }

    this.option({'value': newValue}, {'_context': context});
  },
  
  /**
   * Resets the internal property so that the next call to this.isValid() re-evaluates the correct 
   * value.
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _resetValid : function ()
  {
    this._valid = undefined;
  },
  
  /**
   * Determines the validity of component based on current value of the messages* options.
   * 
   * @return {boolean} true if valid, false otherwise.
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _getValid : function ()
  {
    var hasMessages;
    var msgs = this._getMessages();
    var valid = true;
    
    // When new messages are written update valid
    hasMessages = msgs && msgs.length !== 0;
    if (hasMessages)
    {
      valid = !this._hasInvalidMessages();
    }
    
    return valid;
  },
  
  /**
   * Formats the value for display, based on the converter options. If no converter is set then 
   * returns the value as is.
   * 
   * @param {string} value value to be formatted
   * 
   * @return {string} formatted value
   * @throws {Error} when an error occurs during formatting
   * @protected
   * @memberof oj.editableValue
   * @instance
   */
  _formatValue : function (value)
  {
    var formattedValue = value;
    var converter = this._GetConverter();
    
    // don't clear messages here because we clear messages only when direct user interaction with 
    // component changes value. All other usecases we expect page authors to clear messages.

    if (converter)
    {
      // TODO: We should support chaining converters but for now we use just the first converter 
      // to parse.

      // Check if we have a converter instance
      if (typeof converter === "object") 
      {
        if (converter['format'] && typeof converter['format'] === "function")
        {
          formattedValue = converter['format'](value);
        }
        else
        {
          if (oj.Logger.level > oj.Logger.LEVEL_WARN)
          {
            oj.Logger.info("converter does not support the format method.");
          }
        }
      }
    }
    
    return formattedValue;
  },
  
  /**
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _getComponentMessaging : function ()
  {
    if (!this._componentMessaging)
    {
      this._componentMessaging = new oj.ComponentMessaging(this);
    }
    
    return this._componentMessaging;
  },
  

  /**
   * Returns an array of validator hints.
   * @param {Array} allValidators
   * @private
   * @memberof oj.editableValue
   * @instance
   */        
  _getHintsForAllValidators : function(allValidators)
  {
    var i;
    var validator;
    var validatorHints = [];
    var vHint = "";

    if (this._IsRequired())
    {
      // get the hint for the default required validator and push into array if it's not already 
      // present in the validators array
      validator = this._getImplicitRequiredValidator();
      if (validator['getHint'] && typeof validator['getHint'] === "function")
      {
        vHint = validator['getHint']();
        if (vHint)
        {
          validatorHints.push(vHint);
        }
      }
    }

    // loop through all remaining validators to gather hints
    for (i = 0; i < allValidators.length; i++)
    {
      validator = allValidators[i], vHint = "";
      if (typeof validator === "object") 
      {
        if (validator['getHint'] && typeof validator['getHint'] === "function")
        {
          vHint = validator['getHint']();
          if (vHint)
          {
            validatorHints.push(vHint);
          }
        }
      }
    }

    return validatorHints;
  },
  
  /**
   * Returns the required validator instance or creates it if needed and caches it.
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _getImplicitRequiredValidator : function ()
  {
    var vf;
    var reqTrans = {};
    var reqValOptions;
    
    if (this._implicitReqValidator == null) // falsey check
    {
      reqTrans = 
            this.options['translations'] ? this.options['translations']['required'] || {} : {} ;

      // TODO: cache required validator; purged when its options change, i.e., translations or label 
      // DOM changes
      reqValOptions = {
        'hint': reqTrans['hint'] || null,
        'label': this._getLabelText(), 
        'messageSummary': reqTrans['messageSummary'] || null,
        'messageDetail': reqTrans['messageDetail'] || null
      };

      vf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED);
      this._implicitReqValidator = vf ? vf.createValidator(reqValOptions) : null;
    }
    
    return this._implicitReqValidator;
  },

  
  /**
   * Returns content that will be used by messaging strategies.
   * 
   * @param {number} updateType of messaging content to update. Accepted values are defined by 
   * this._MESSAGING_CONTENT_UPDATE_TYPE.
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _getMessagingContent : function (updateType)
  {
    var messagingContent = {};

    var allValidators;
    var converter;
    var converterHint = "";
    var messages;
    var validatorHints = [];
    
    updateType = updateType || this._MESSAGING_CONTENT_UPDATE_TYPE.VALIDITY_STATE;

    // Add validityState which includes messages, valid and severity
    if (updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.ALL || 
        updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.VALIDITY_STATE)
    {
      messages = this._getMessages();
      
      // update validityState before packaging it
      this._getValidityState().update(this.isValid(), messages);
      messagingContent.validityState = this._getValidityState();
    }
    
    if (updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.ALL || 
        updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.CONVERTER_HINT)
    {
      converter = this._GetConverter();
      if (converter)
      {
        if (typeof converter === "object") 
        {
          if (converter['getHint'] && typeof converter['getHint'] === "function")
          {
            converterHint = converter['getHint']() || "";
          }
        }
      }
      messagingContent.converterHint = converterHint;
    }
    
    if (updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.ALL || 
        updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.VALIDATOR_HINTS)
    {
      allValidators = this._GetAllValidators();
      validatorHints = this._getHintsForAllValidators(allValidators) || [];
      messagingContent.validatorHint = validatorHints;
    }
    
    if (updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.ALL || 
        updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.TITLE)
    {
      messagingContent.title = this.options['title'] || "";
    }
    
    return messagingContent;
  },
  
  /**
   * Compares the messages arrays for equality.
   * 
   * @param {Array} pm previous messages
   * @param {Array} m new messages
   * @returns {boolean} true if equal false otherwise
   * @private
   * @memberof oj.editableValue
   * @instance
   * 
   */
  _messagesEquals : function (pm, m)
  {
    var match = -1;
    var pmo;
    var passed = true;
    var previousMsgs = $.extend([], pm);
    var msgs = $.extend([], m);
    
    
    if (previousMsgs.length !== msgs.length)
    {
      return false;
    }
    
    $.each(previousMsgs, function (i, pMsg) 
    {
      if (!(pMsg instanceof oj.Message))
      {
        // freeze message instance once its created
        pmo = new oj.Message(pMsg['summary'], pMsg['detail'], pMsg['severity']);
        pmo = Object.freeze ? Object.freeze(pmo) : pmo;
      }
      else
      {
        pmo = pMsg;
      }
      
      match = -1;
      $.each(msgs, function(j, msg) {
        {
          if (pmo.equals(msg))
          {
            match = j;
            return; // found a match, so break out of loop
          }
        }
      });
      
      // remove entry at 'match' index from msgs
      if (match > -1)
      {
        msgs.splice(match, 1);
      }
      else
      {
        // we found no match so no need to loop
        passed = false;
        return;
      }
    });
    
    return passed;
  },
  
  /**
   * Parses the value using the converter set and returns the parsed value. If parsing fails the 
   * error is written into the element 
   * 
   * @param {string=} submittedValue to parse
   * @return {Object} parsed value 
   * @throws {Error} an Object with message
   * @protected
   * @memberof oj.editableValue
   * @instance
   */
  _parseValue: function(submittedValue) 
  {
    var converter = this._GetConverter();
    var parsedValue = submittedValue;
    
    if (converter)
    {
      // TODO: We should support chaining converters but for now we use just the first converter 
      // to parse.

      if (typeof converter === "object") 
      {
        if (converter['parse'] && typeof converter['parse'] === "function")
        {
          // we are dealing with a converter instance
          parsedValue = converter['parse'](submittedValue);
        }
        else
        {
          if (oj.Logger.level > oj.Logger.LEVEL_WARN)
          {
            oj.Logger.info("converter does not support the parse method.");
          }
        }
      }
    }
    
    return parsedValue;
  },

  _addValidationError : function(e, msgs)
  {
    var detail;
    var severity;
    var ojmessage;
    var summary;

    if (e instanceof oj.ConverterError || e instanceof oj.ValidatorError)
    {
      ojmessage = e.getMessage();
      oj.Assert.assertPrototype(ojmessage, oj.Message);

      severity = ojmessage['severity'];
      summary = ojmessage['summary'];
      detail = ojmessage['detail'];
    }
    else
    {
      // TODO: is this error message generic enough to use for both converter and validator errors?
      severity = oj.Message.SEVERITY_LEVEL['ERROR'];
      summary = oj.Translations.getTranslatedString("oj-message.error");
      detail = e['message'] || oj.Translations.getTranslatedString("oj-converter.detail");
    }
    
    msgs.push({summary: summary, detail: detail, severity: severity});
  },

  /**
   * Processes the error information for one or more errors and returns an Array of 
   * oj.ComponentMessage instances.
   * 
   * @param {Error} e instance of Error
   * @param {number=} context the context in which the validation error was thrown
   * @param {String=} display whether message is shown or hidden
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _processValidationErrors : function (e, context, display)
  {
    var componentMsgs = [];
    var msg;
    var msgs = e._messages || [];
    var options = {};
    
    options['context'] = context || 0;
    options['display'] = display || oj.ComponentMessage.DISPLAY.SHOWN;
    
    if (msgs.length === 0)
    {
      this._addValidationError(e, msgs);
    }
    
    for (var i = 0; i < msgs.length; i++)
    {
      msg = msgs[i];
      componentMsgs.push(this._createComponentMessage(msg.summary, msg.detail, msg.severity, options));
    }
    
    return componentMsgs || null;
  },
  
  _createComponentMessage : function (summary, detail, severity, options)
  {
    var cMsg;
    // new properties can't be added but existing properties can be changed
    cMsg = new oj.ComponentMessage(summary, detail, severity, options);
    cMsg = Object.seal ? Object.seal(cMsg) : cMsg;
    return cMsg;
  },
          
  /**
   * Refreshes the component display value, only when the current value is different from the last 
   * saved value, unless asked to always refresh the display value.
   * 
   * @param {Object|undefined} value the changed value that needs to be updated on UI
   * @param {boolean=} fullRefresh false is the default; true means always refresh component 
   * display value using the current option value. This overwrites any UI value, the user may have 
   * entered.
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */        
  _refreshComponentDisplayValue : function (value, fullRefresh)
  {
    var lastModelValue;
    var modelValue = value || this.options['value'];
    var shouldUpdateElementValue;
    
    lastModelValue = this._getLastModelValue();
    shouldUpdateElementValue = fullRefresh || (modelValue !== lastModelValue) || false;

    if (shouldUpdateElementValue)
    {
      this._updateElementDisplayValue(modelValue);
    }
  },


  /**
   * Toggles css selector on the widget. E.g., when required option changes, the oj-required 
   * selector needs to be toggled.
   * @param {string} option
   * @param {Object|string} value 
   * @private
   * @memberof oj.editableValue
   * @instance
   */        
  _refreshTheming : function (option, value)
  {
    if (Object.keys(this._OPTION_TO_CSS_MAPPING).indexOf(option) !== -1) 
    {
      this.widget().toggleClass(this._OPTION_TO_CSS_MAPPING[option], !!value);
    }
  },
 
  /**
   * Runs validators in deferred mode using the option value. Any validation error thrown is 
   * deferred, or hidden by component, until explicitly asked to show them (see showMessages()). 
   * Deferred error is pushed to <code class="prettyprint">messagesHidden</code> option.
   * 
   * @param {number} context in which validation was run. 
   * 
   * @see #showMessages
   * @private 
   * @memberof oj.editableValue
   * @instance
   */
  _runDeferredValidation : function (context) 
  {
    var newMsgs;
    var newValue;
    
    if (this._CanSetValue())
    {
      try
      {
        // TODO: Today required is the only validator that runs deferred. We need a generic way to 
        // retrieve deferred validators. 
        newValue = this._validateValue(this.options['value'], 
                      this._VALIDATION_MODE.REQUIRED_VALIDATOR_ONLY);
      }
      catch (ve)
      {
        newMsgs = this._processValidationErrors(ve, context, oj.ComponentMessage.DISPLAY.HIDDEN);
        if (newMsgs)
        {
          this._updateMessagesOption('messagesHidden', newMsgs);
        }
      }
    }
    else
    {
      if (oj.Logger.level > oj.Logger.LEVEL_WARN)
      {
        oj.Logger.info("Deferred validation skipped as component is readonly or disabled.");
      }
    }
  },
    
  /**
   * Runs validation based on the mode settings. 
   * 
   * @param {Object} value to parse and/or validate
   * @param {number=} mode determines how validation is run. see _VALIDATION_MODE
   * @param {number=} context determines when validation is being run.
   * @param {Event=} event the original event or undefined
   * 
   * @return {Object|string} parsed value
   * @throws {Error} when validation fails.
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _runNormalValidation : function (value, mode, context, event) 
  {
    var newMsgs;
    var newValue = value;

    // callers of this function should clear messages 
    try
    {
      // Step 1: only when "full" validation is requested converters get run
      if (mode === this._VALIDATION_MODE.FULL)
      {
        // Step1: Parse value using converter
        newValue = this._parseValue(value);
      }

      // Step 2: Run validators
      this._validateValue(newValue, mode === this._VALIDATION_MODE.REQUIRED_VALIDATOR_ONLY);
    }
    catch (ve)
    {
      newMsgs = this._processValidationErrors(ve, context);
      this._updateMessagesOption ('messagesShown', newMsgs, event);
      throw ve;
    }
    
    return newValue;
  },
  
  /**
   * Runs either deferred or normal validation based on the state component is in. This method is 
   * called when certain options change - required, disabled etc.
   * 
   * <p>
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
   * </p>
   * 
   * @param {Object} validationOptions
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _runMixedValidationAfterSetOption : function (validationOptions)
  {
    var runDeferredValidation = true;
    
    if (this._hasInvalidMessagesShowing())
    {
      runDeferredValidation = false;
    }

    // clear component messages always
    this._clearComponentMessages();
    if (!runDeferredValidation)
    {
      // run full validation using the current display value; 
      // show messages immediately if there are errors otherwise set value to option
      this._updateValue(validationOptions);
    }
    else
    {
      // run deferred validation if comp is either showing a deferred error or has no errors. 
      // But only when required is true. 
      if (this._IsRequired())
      {
        this._runDeferredValidation(validationOptions.validationContext);
      }
    }
  },
    
  
  _updateElementDisplayValue : function (modelValue, event)
  {
    var actualDisplayValue;
    var displayValue;
    var newMsgs;
    
    // cache the new model value on the element 
    this._setLastModelValue(modelValue);

    // Update element with the displayValue
    displayValue = modelValue;

    try
    {
      displayValue = this._formatValue(modelValue);
    }
    catch (e)
    {
      newMsgs = this._processValidationErrors(e);
      this._updateMessagesOption ('messagesShown', newMsgs, event);
    }
    
    this._SetDisplayValue(displayValue); 
    // getting the display value right after we set it is probably not necessary,  but just in
    // case a subclass did something to it, we do.
    actualDisplayValue = this._GetDisplayValue();
    this._setLastSubmittedValue(actualDisplayValue);
     // update rawValue option to keep it in sync with the display value
    this._SetRawValue(actualDisplayValue, null);
  },
  
    
  /**
   * Runs normal validation when certain options change - converter, required, validators etc. - and 
   * updates (re-sets) the value if no new errors are found. This is different from _SetValue()
   * which is called when end-user changes the value as a result of interacting with the component. 
   * Additionally _SetValue() clears all messages always, whereas callers of this method determine 
   * which messages they want cleared.
   * 
   * @param {Object} options - name value properties used when validation is run. 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _updateValue : function (options)
  {
    var newValue;
    
    // run full validation using the current display value; 
    // show messages immediately if there are errors otherwise set value to option
    newValue = this._Validate(this._GetDisplayValue(), null, options);

    // if validation was a success and component is valid, or it's invalid with no new component 
    // messages then update value option. 
    // NOTE: often custom msgs are not cleared when this method is called.
    if (newValue !== undefined && 
        (this.isValid() || !this._hasInvalidComponentMessagesShowing()))
    {
      this._updateValueOption(newValue, null, options.validationContext);
    }
  }, 
  
  /**
   * Validates the value by running through the list of regsitered validators. The algorithm is as 
   * follows -
   * 1. check to see if we are currently valid, if not return
   * 2. run required check. 
   * 3. if value is not empty get all the validators and validate in sequence. 
   * 4. if all validators pass return.
   * 
   * Callers can rely on the 'valid' options property to determine the validity state of the 
   * component after calling this method
   * 
   * @param {Object|string} value to be validated
   * @param {boolean} requiredOnly true only runs required validation
   * @throws {Error} when validation fails.
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _validateValue : function (value, requiredOnly)
  {
    var allValidators = this._GetAllValidators();
    var i;
    var validator;
    var valMsgs = [];

    // run required validation first; 
    if (this._IsRequired())
    {
      validator = this._getImplicitRequiredValidator();
      try
      {
        // check if trimmed value is empty. See AdfUIEditableValue.prototype.ValidateValue
        validator.validate(oj.StringUtils.trim(value));
      }
      catch (e)
      {
        // save all validation errors
        this._addValidationError(e, valMsgs);
      }
    }
      
    // run other validators when requested. 
    // latest review - we want to do exactly as ADF does and it validates empty field values by 
    // default. The condition always resolves to true in JET!
    if (!requiredOnly) // && (!isEmptyValue || this._shouldValidateEmptyFields()))
    {
      for (i = 0; i < allValidators.length; i++)
      {
        validator = allValidators[i];
        if (typeof validator === "object") 
        {
          if (validator['validate'] && typeof validator['validate'] === "function")
          {
            try
            {
              validator['validate'](value);
            }
            catch (e)
            {
              // save all validation errors
              this._addValidationError(e, valMsgs);
            }              
          }
          else
          {
            if (oj.Logger.level > oj.Logger.LEVEL_WARN)
            {
              oj.Logger.info("validator does not support the validate method.");
            }
          }
        }
      }
    }

    // throw error if there were validation failures
    if (valMsgs.length > 0)
    {
      var ve = new Error();
      ve._messages = valMsgs;
      throw ve;
    }
  }
  
  // Fragments:
    
  /**
   *     <tr>
   *       <td rowspan="2">Label's help icon</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>If there is a help source URL on the anchor icon, navigate to the Help Source URL.
   *       Otherwise, show the help definition text in a popup.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Press & Hold</kbd></td>
   *       <td>Show help definition text in a popup.</td>
   *     </tr> 
   * @ojfragment labelTouchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.editableValue
   */
  
  /**
   *     <tr>
   *       <td rowspan="2">Label's help icon</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td>Go the Help Source URL.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Show help definition text.</td>
   *     </tr> 
   * @ojfragment labelKeyboardDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.editableValue
   */
 
}, true);

oj.Components.setDefaultOptions(
  {

    'editableValue': // properties for all editableValue components 
    {
      'displayOptions': oj.Components.createDynamicPropertyGetter(function(context){
        return {
          'messages': context['containers'].indexOf('ojDataGrid') >= 0 || 
                      context['containers'].indexOf('ojTable') >= 0 ? ['notewindow'] : ['inline'],
          'converterHint': ['placeholder', 'notewindow'], 
          'validatorHint': ['notewindow'], 
          'title': ['notewindow']
        };
      })
    }
  }
 

);

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true*/

/**
 * A messaging strategy that places the messaging content inline (underneath) the editableValue
 * component.
 *
 * @param {Array.<string>} displayOptions an array of messaging artifacts displayed inline. e.g,
 * 'messages' (for now only 'messages' are supported inline, not converterHints, and others)
 * @constructor
 * @extends {oj.MessagingStrategy}
 * @private
 */
oj.InlineMessagingStrategy = function (displayOptions)
{
  this.Init(displayOptions);
};

/**
 * Registers the InlineMessagingStrategy constructor function with oj.ComponentMessaging.
 *
 * @private
 */
oj.ComponentMessaging.registerMessagingStrategy(oj.ComponentMessaging._DISPLAY_TYPE.INLINE,
                                                oj.InlineMessagingStrategy);

// Subclass from oj.MessagingStrategy
oj.Object.createSubclass(oj.InlineMessagingStrategy,
  oj.MessagingStrategy, "oj.InlineMessagingStrategy");

/**
 * Reinitializes with the new display options and updates component messaging using the new content.
 *
 * @param {Array.<string>} newDisplayOptions
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @override
 *
 */
oj.InlineMessagingStrategy.prototype.reactivate = function (newDisplayOptions)
{
  oj.InlineMessagingStrategy.superclass.reactivate.call(this, newDisplayOptions);
  this._updateInlineMessage();
};

/**
 * Returns true if the messaging content should update. This method is an
 * optimization because the update() method is called too often and any time any content changes.
 * The only time InlineMessagingStrategy#update needs to execute is when the oj.ComponentValidity
 * object is in the content because we don't add this unless there are messages.
 *
 * @param {Object=} content the messaging content object. If it contains validityState, then
 * this means the component has messaging content.
 * @return {boolean}
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @private
 * @override
 */
oj.InlineMessagingStrategy.prototype.shouldUpdate = function (content)
{
  // content is messaging content, and in EditableValue we add a validityState for
  // messages, valid, and severity, so if validityState is there, we know messages are there.
  return content && content.validityState !== undefined ? true : false;
};

/**
 * Updates component with instance using the content provided.
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @private
 * @override
 */
oj.InlineMessagingStrategy.prototype.update = function ()
{
  oj.InlineMessagingStrategy.superclass.update.call(this);
  this._updateInlineMessage();
};

/**
 * Cleans up messages on the component and destroys any widgets it created.
 *
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @private
 * @override
 */
oj.InlineMessagingStrategy.prototype.deactivate = function ()
{
  this._removeMessagingContentRootDom();
  oj.InlineMessagingStrategy.superclass.deactivate.call(this);
};

/**
 * If the inline message is already open its contents need to updated when update() or
 * reactivate() is called.
 *
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
oj.InlineMessagingStrategy.prototype._updateInlineMessage = function()
{
  var contentToShow;
  var domNode;

  // contentToShow will be "" (a falsey) if there are no messages to show.
  contentToShow = this._buildInlineHtml();

  // create the inline messaging dom if there is content to show and the dom hasn't been created.
  if (contentToShow && this.$messagingContentRoot == null)
  {
    this._createInlineMessage();
  }

  if (contentToShow)
  {
    // push new content into inline message dom
    domNode = this.$messagingContentRoot[0];

    // contentToShow includes content that may come from app. It is scrubbed for illegal tags
    // before setting to innerHTML
    domNode.innerHTML = contentToShow;  // @HTMLUpdateOK

  }
  else
  {
    // if there is no content to show and inline message dom is currently there, remove the dom.
      // NOTE: If you see that a button seems to be losing its click event
      // after inline messaging validation or after a reset
      // it may be because the button is moving as a result of the inline messaging appearing
      // and/or disappearing. The workaround for the user is to use 'mousedown' event instead
      // of the 'click' event.
    this._removeMessagingContentRootDom();
  }

};

oj.InlineMessagingStrategy.prototype._createInlineMessage = function ()
{
  var widget;
  
  this.$messagingContentRoot = $(this._getInlineContentHtml());
  this._addAriaDescribedBy(this.$messagingContentRoot);
  this._addAriaLive(this.$messagingContentRoot);
  // append content that goes in inline messaging div
  // make it the very LAST child of the widget.
  widget = this.GetComponent().widget();
  widget.append(this.$messagingContentRoot); // @HTMLUpdateOK
};

/**
 * Returns the dom for the messaging-inline-container.
 *
 * @return {string}
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
oj.InlineMessagingStrategy.prototype._getInlineContentHtml = function ()
{
  return "<div class='oj-messaging-inline-container'></div>";
};

/**
 * Removes the messaging content root dom and anything else that was adding during the
 * creation of the messaging content root dom.
 *
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
oj.InlineMessagingStrategy.prototype._removeMessagingContentRootDom = function ()
{
  if (this.$messagingContentRoot != null)
  {
    this._removeAriaDescribedBy(this.$messagingContentRoot);
    this.$messagingContentRoot.remove();
    this.$messagingContentRoot = null;
  }
};

/**
 * Create an id to put on the root dom element that holds the inline messaging content,
 * then add aria-describedby on the launcher (this is what PopupMessaging does as well).
 * This makes it so the screen reader user knows the messaging content is connected to the launcher.
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @private
 */
oj.InlineMessagingStrategy.prototype._addAriaDescribedBy = function (messagingRoot)
{
  var describedby;
  var launcher;
  var messagingRootId;
  var tokens;

  // create an id on the div holding the inline messaging.
  // add aria-describedby to the launcher to associate the launcher and the inline message
  launcher = this.GetLauncher();

  oj.Assert.assertPrototype(launcher, $);
  oj.Assert.assertPrototype(messagingRoot, $);

  messagingRootId = messagingRoot.uniqueId().attr("id");
  describedby = launcher.attr("aria-describedby");
  tokens = describedby ? describedby.split(/\s+/) : [];
  tokens.push(messagingRootId);
  describedby = $.trim(tokens.join(" "));
  launcher.attr("aria-describedby", describedby);
};

/**
 * aria-live: polite
 * This is needed so a screen reader will read the inline message without the user needing to
 * set focus to the input field.
 * @param {jQuery} messagingRoot
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @private
 */
oj.InlineMessagingStrategy.prototype._addAriaLive = function (messagingRoot)
{
  oj.Assert.assertPrototype(messagingRoot, $);
  messagingRoot.attr("aria-live", "polite");
};

/**
 * Removes the aria-describedby from the launcher that was added by _addAriaDescribedBy
 * @param {jQuery} messagingRoot
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @private
 */
oj.InlineMessagingStrategy.prototype._removeAriaDescribedBy = function(messagingRoot)
{
  var describedby;
  var index;
  var launcher;
  var messagingRootId;
  var tokens;

  launcher = this.GetLauncher();
  oj.Assert.assertPrototype(launcher, $);
  oj.Assert.assertPrototype(messagingRoot, $);

  messagingRootId = messagingRoot.attr("id");
  describedby = launcher.attr("aria-describedby");
  tokens = describedby ? describedby.split(/\s+/) : [];
  index = $.inArray(messagingRootId, tokens);
  if (index !== -1)
    tokens.splice(index, 1);
  describedby = $.trim(tokens.join(" "));

  if (describedby)
    launcher.attr("aria-describedby", describedby);
  else
    launcher.removeAttr("aria-describedby");
};

/**
 * Returns the content to show inside the inline message html.
 * @return {string} content to show, else "". "" is a falsey.
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
oj.InlineMessagingStrategy.prototype._buildInlineHtml = function ()
{
  var document;

  // For now anyway, ShowMessages is always true since the inlineMessaging case is for messaging.
  if (this.ShowMessages())
  {
    document = this.GetComponent().document[0];
    // returns messages or "" if there are none
    return this._buildMessagesHtml(document);
  }
  else
    return "";
};

/**
 * Returns the content to show inside messages (not hints)
 * @param {Document} document
 * @return {string} content if there are messages, else "". "" is a falsey.
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
oj.InlineMessagingStrategy.prototype._buildMessagesHtml = function (document)
{
  var content = "";
  var maxSeverity;
  var messages;
  var renderSeveritySelectors = true;

  if (this.HasMessages())
  {
    messages = this.GetMessages();
    maxSeverity = this.GetMaxSeverity();
    content =
      oj.PopupMessagingStrategyUtils.buildMessagesHtml(
        document, messages, maxSeverity, renderSeveritySelectors);
  }
  return content;
};
(function() {
var editableValueMeta = {
  "properties": {
    "disabled": {
      "type": "boolean"
    },
    "displayOptions": {
      "type": "Object"
    },
    "help": {
      "type": "Object<string, string>"
    },
    "messagesCustom": {
      "type": "Array"
    },
    "messagesHidden": {
      "type": "Array"
    },
    "messagesShown": {
      "type": "Array"
    },
    "title": {
      "type": "string"
    },
    "value": {
      "type": "Object",
      "writeback": true
    }
  },
  "methods": {
    "getNodeBySubId": {},
    "isValid": {},
    "refresh": {},
    "reset": {},
    "showMessages": {}
  },
  "extension": {
    _WIDGET_NAME: "editableValue"
  }
};
oj.CustomElementBridge.registerMetadata('editableValue', 'baseComponent', editableValueMeta);
})();

});
