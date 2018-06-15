/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'hammerjs', 'ojs/ojjquery-hammer', 'promise', 'ojs/ojcomponentcore', 
'ojs/ojvalidation-base', 'ojs/ojpopup', 'ojs/ojlabel', 'ojs/ojanimation'], 
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
 * @class oj.EditableValueUtils
 * @classdesc JET Editable Component Utils
 * @export
 * @since 0.6
 * @hideconstructor
 * @ignore
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
* String used in the label element's id for custom &lt;oj-label>
* @const
* @ignore
* @type {string}
*/
oj.EditableValueUtils.CUSTOM_LABEL_ELEMENT_ID = "|label";

/**
* Enum for validate() return values
* @const
* @ignore
*/
oj.EditableValueUtils.VALIDATE_VALUES = {
  VALID : "valid",
  INVALID : "invalid"
};

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
 * NOTE: This is unnecessary to call for custom elements.
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
 * @ignore
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
   * @ignore
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
   * @ignore
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
 * Use this to get the oj-label's label element's id when there is a for/id relationship
 * between the oj-label and the form component. Some components need this information to
 * use as their aria-labelledby on their dom element(s) that takes focus.
 * @param {jQuery} widget The custom form component jQuery object. 
 * We use this to find the oj-label element
 * by looking at oj-label's for attribute matching the id.
 * @param {string} defaultLabelId. the value we want to add to oj-label's label-id attribute if 
 * we can't find an existing id to use as aria-labelledby on the form component. 
 * @return {string|null} return the string to use as the aria-labelledby on the form component's
 * focusable element. If oj-label doesn't exist, this will return null.
 * @ignore
 */
oj.EditableValueUtils.getOjLabelId = function (widget, defaultLabelId)
{

  var formCompId;
  var $labelElement;
  var ojLabelCustom;
  var id;
  var labelElement;
  var labelElementId;
  var labelId;

  formCompId = widget[0].id;
  // oj-label and the form component as siblings is the most common case, so check for that first.
  $labelElement = widget.siblings("[for='" + formCompId + "']");
  
  if ($labelElement.length === 0)
  {
    ojLabelCustom =  document.querySelector("oj-label[for='" + formCompId + "']");
  }
  else
    ojLabelCustom = $labelElement[0];
  
  if (ojLabelCustom)
  {
    labelId = ojLabelCustom.getAttribute("label-id");
    if (labelId)
    {
      // if label-id is set, oj-label writes it directly on the label element's id
      return labelId;      
    }
    else
    {
      id = ojLabelCustom.id;
      if (id)
      {
        // the contract is for the label element's id, it's the oj-label id + this suffix 
        // (if oj-label doesn't have the label-id attribute set)
        return id + oj.EditableValueUtils.CUSTOM_LABEL_ELEMENT_ID;
      }
      else 
      {
        // oj-label has no label-id or id, so get oj-label's label element, get its id and use that.
        labelElement = ojLabelCustom.querySelector("label");
        if (labelElement)
          labelElementId = labelElement.id;
        if (labelElementId)
          return labelElementId;
        else
        {
          // if we get here, we did find oj-label, but it did not have label-id nor id,
          // and we also didn't find its label element's id. 
          // What we need to do now is write label-id onto oj-label, given the defaultLabelId parameter.
          if (defaultLabelId)
          {
            ojLabelCustom.setAttribute("label-id", defaultLabelId);
            return defaultLabelId;
          }
 
        }  
      }
    }
  }
  return null;
  

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
 * messages are shown.</li>
 * <li>If there are no validators setup for the component the <code class="prettyprint">value</code> 
 * option is updated using the display value. Otherwise all 
 * validators are run in sequence using the parsed value from the previous step. The implicit 
 * required validator is run first if the component is marked required. When a validation error is 
 * encountered it is remembered and the next validator in the sequence is run. </li>
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
 *  
 *  
 * @return {Promise} Promise resolves to "valid" if there were no converter parse errors and
 * the component passed all validations. 
 * The Promise resolves to "invalid" if there were converter parse errors or 
 * if there were validation errors.
 * 
 * @ignore
 * @private
 */
oj.EditableValueUtils.validate =  function ()
{
  var self = this;
  if (this._IsCustomElement())
  {
    // clear all messages; run full validation on display value
    var validateFunction = function() {
      return self._ValidateReturnBoolean() ? 
        oj.EditableValueUtils.VALIDATE_VALUES.VALID : 
        oj.EditableValueUtils.VALIDATE_VALUES.INVALID;;
    };

    return Promise.resolve(validateFunction());

  }
  else
  {
    // clear all messages; run full validation on display value
    return this._ValidateReturnBoolean();
  }
};

/**
 * 
 * @returns boolean true if component passed validation, 
 * false if there were validation errors.
 * 
 * @example <caption>Validate component using its current value.</caption>
 * // validate display value. 
 * var rslt = myComp.validate();
 * 
 * @ignore
 * @protected
 */
oj.EditableValueUtils._ValidateReturnBoolean =  function ()
{
  // clear all messages; run full validation on display value
  var result = this._SetValue(this._GetDisplayValue(), null, this._VALIDATE_METHOD_OPTIONS);
  return result;

};

/**
 * Called from _AfterCreate for IsCustomElement form components so that they will
 * be assocatied with their oj-label element correctly.
 * Set the sub-id on the element so if they have a oj-label
 * pointing to it with the 'for' attrbiute, JAWS will read the label.
 * @param {Element} element
 * @param {string} widgetId
 * @ignore
 * @private
 */
oj.EditableValueUtils.setSubIdForCustomLabelFor = function(element, widgetId)
{
  element.setAttribute("id", widgetId + "|input");
};
/**For custom element only.
 * When labelledBy changes, we need to update the aria-labelledby attribute.
 * Note: If labelledBy changes from a value to null, we should still remove the oldValue from
 * aria-labelledby.
 * @param {string|null} originalValue the old value of the labelledBy option
 * @param {string|null} value the new value of the labelledBy option. 
 * @param {jQuery} $elems jquery Object containing the node(s) to add/remove aria-labelledby to.
 * @private
 * @ignore
 */
oj.EditableValueUtils._updateLabelledBy = function(originalValue, value, $elems)
{
  var suffix = oj.EditableValueUtils.CUSTOM_LABEL_ELEMENT_ID;
  
  if (!this._IsCustomElement())
    return;

  if (originalValue)
    originalValue += suffix;
  if (value)
    value += suffix;
  
  if (originalValue)
    oj.EditableValueUtils._removeAriaLabelledBy($elems, originalValue);
  if (value)
    oj.EditableValueUtils._addAriaLabelledBy($elems, value);    
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

  if (!this._IsCustomElement())
  {
    if (!this.$label)
      this._createOjLabel();
    
    // need to keep the label's required in sync with the input's required
    if (this.$label)
    {
      this.$label.ojLabel("option", "showRequired", value);
      // in most cases aria-required is supported and that is what we do to get JAWS to say
      // "Required" on focus of the input. But in the case of a 'set' of items where one is required,
      // say radioset/checkboxset, what do we do? aria-required doesn't make sense (nor is it valid
      // as it fails validation in some accessibility validators) on each input, when really it is
      // one in the set that is required, not each one. This is what we are doing from v1 on: we
      // put aria-describedby to point to the required icon text.
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
   
  /**.
   * Add the id to the widget's aria-labelledby attribute.
   * @param {jQuery} $elems the jquery element(s) that represents the node on which aria-labelledby is
   * @param {string} id id to add to aria-labelledby
   * @private
   * @ignore
   */
  oj.EditableValueUtils._addAriaLabelledBy = function ($elems, id)
  {
    var index;
    
    
    $elems.each(function() {
      var labelledBy = $(this).attr("aria-labelledby");
      var tokens;

      tokens = labelledBy ? labelledBy.split(/\s+/) : [];
      // Get index that id is in the tokens, if at all.
      index = $.inArray(id, tokens);
      // add id if it isn't already there
      if (index === -1)
        tokens.push(id);
      labelledBy = $.trim(tokens.join(" "));
      $(this).attr("aria-labelledBy", labelledBy);
    });   
  };
  /**.
   * Remove the id from the widget's aria-labelledby attribute.
   * @param {jQuery} $elems the jquery element(s) that represents the node on which aria-labelledby is
   * @param {string} id id to remove from aria-labelledby
   * @private
   * @ignore
   */
  oj.EditableValueUtils._removeAriaLabelledBy = function ($elems, id)
  {
    var labelledBy;
    
    $elems.each(function() {

      var index;
      var tokens;
      
      // get aria-labelledby that is on the element(s)
      labelledBy = $(this).attr("aria-labelledby");
      // split into tokens
      tokens = labelledBy ? labelledBy.split(/\s+/) : [];
      // Get index that id is in the tokens, if at all.
      index = $.inArray(id, tokens);
      // remove that from the tokens array
      if (index !== -1)
        tokens.splice(index, 1);
      // join the tokens back together and trim whitespace
      labelledBy = $.trim(tokens.join(" "));
      if (labelledBy)
        $(this).attr("aria-labelledby", labelledBy);
      else
        $(this).removeAttr("aria-labelledby");
     });
  };
  /**
   * Set the type of the input element based on virtualKeyboard option.
   * 
   * @param {Array.<string>} allowedTypes an array of allowed types
   * 
   * @protected
   * @ignore
   */
  oj.EditableValueUtils._SetInputType = function (allowedTypes)
  {
    // Default input type is text
    var inputType = 'text';
    var agentInfo = oj.AgentUtils.getAgentInfo();

    // Only change the type on mobile browsers    
    if (agentInfo['os'] === oj.AgentUtils.OS.ANDROID ||
        agentInfo['os'] === oj.AgentUtils.OS.IOS ||
        agentInfo['os'] === oj.AgentUtils.OS.WINDOWSPHONE)
    {
      // Get input type from component's virtualKeyboard option
      if (allowedTypes.indexOf(this.options['virtualKeyboard']) >= 0)
      {
        inputType = this.options['virtualKeyboard'];
      }
/* For future support
      else
      {
        // Get input type from converter's virtualKeyboardHint option
        var converter = this._GetConverter();
        if (converter && converter['resolvedOptions'])
        {
          var resOptions = converter['resolvedOptions']();
          if (allowedTypes.indexOf(resOptions['virtualKeyboardHint']) >= 0)
          {
            inputType = resOptions['virtualKeyboardHint'];
          }
        }
      }
*/
    }
    
    this.element.attr('type', inputType);
  };
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


/**
* String used in the label element's id for custom &lt;oj-label>
* @const
* @private
* @type {string}
*/
var _CUSTOM_LABEL_ELEMENT_ID = "|label";


// E D I T A B L E V A L U E    A B S T R A C T   W I D G E T  
/**
 * @ojcomponent oj.editableValue
 * @augments oj.baseComponent
 * @ojsignature [{
 *                target: "Type",
 *                value: "abstract class editableValue<V, SP extends editableValueSettableProperties<V, SV, RV>, SV= V, RV= V> extends baseComponent<SP>"
 *               },
 *               {
 *                target: "Type",
 *                value: "editableValueSettableProperties<V, SV=V, RV=V> extends baseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @ojtsimport ojmessaging
 * @abstract
 * @since 0.6
 * @ojshortdesc Abstract EditableValue element
 * @ojrole input
 * @hideconstructor
 * 
 * @classdesc
 * Abstract base class for all editable components that are value holders and that require 
 * validation and messaging capabilities. <br/>
 * 
 * {@ojinclude "name":"validationAndMessagingDoc"}
 *  * <p>
 * Note: The <code class="prettyprint">required</code>, <code class="prettyprint">validators</code>,
 * <code class="prettyprint">converter</code> properties and the <code class="prettyprint">validate</code> 
 * method are not on all EditableValue components so they are not on the EditableValue class. 
 * See the EditableValue subclasses for which ones have which of these properties. For example,
 * oj-switch, oj-slider, oj-color-palette, and oj-color-spectrum do not have the 
 * <code class="prettyprint">validate</code> method nor do they have the 
 * <code class="prettyprint">required</code>, <code class="prettyprint">validators</code>,
 * <code class="prettyprint">converter</code> properties since the components 
 * wouldn't do anything with these properties anyway. A user can't type into these components and there
 * is no visual representation for 'nothing is set' on these components. Whereas InputBase, inputNumber,
 * inputSearch and combobox do have these properties since a user can type into the field (so you may
 * need to convert it and validate it) and also blank it out (so you may need to mark it required and
 * run the required validator).
 * </p>

 * <p>
 * <h3 id="declarative-binding-section">
 * Declarative Binding 
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#declarative-binding-section"></a>
 * </h3>
 * When the component's <code class="prettyprint">value</code> property is bound to a Knockout 
 * observable and when the value changes, whether the observable is updated or not, and whether a 
 * 'writeback' to the observable happens or not, depends on the action that caused the value to 
 * change.
 * <ul>
 * <li>when the value changes as a result of user interaction </li>
 * <li>when the value changes because normal validation was run as a result of these properties 
 * being changed by the app - <code class="prettyprint">converter</code>, <code class="prettyprint">disabled</code>, 
 * <code class="prettyprint">required</code>, <code class="prettyprint">validators</code>, then the 
 * value is written to the observable. See the specific property docs for details.</li>
 * <li>when the value changes because normal validation was run as a result of these methods being 
 * called by the app - 
 * <code class="prettyprint">refresh</code>, <code class="prettyprint">validate</code>, 
 * then the value is written to the observable. See the specific method docs for details.</li>
 * <li>when the value changes due to programmatic intervention by app then the value is not written 
 * back to observable. This is based on the assumption that the app has mutated the observable 
 * already. In this case updating the component's <code class="prettyprint">value</code> property 
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
     * It is used to establish a relationship between this component and another element.
     * Typically this is not used by the application developer, but by the oj-label custom element's
     * code. One use case is where the oj-label custom element code writes described-by
     * on its form component for accessibility reasons.
     * To facilitate correct screen reader behavior, the described-by attribute is
     * copied to the aria-describedby attribute on the component's dom element.
     * @example <caption>Initialize component with the <code class="prettyprint">described-by</code> attribute specified:</caption>
     * &lt;oj-some-element described-by="someId">&lt;/oj-some-element>
     *
     * @example <caption>Get or set the <code class="prettyprint">describedBy</code> property after initialization:</caption>
     * // getter
     * var descById = myComp.describedBy;
     *
     * // setter
     * myComp.describedBy = "someId";
     *
     * @ojshortdesc described the relationship between this component and another element.
     * @expose 
     * @type {?string}
     * @public
     * @instance
     * @memberof oj.editableValue
     * @since 4.0.0
     */
    describedBy : null,
    /** 
     * Whether the component is disabled. The default is false.
     * 
     * <p>
     * When the <code class="prettyprint">disabled</code> property changes due to programmatic 
     * intervention, the component may clear messages and run validation in some cases. </br>
     * <ul>
     * <li>when a required component is initialized as disabled 
     * <code class="prettyprint">value="{{currentValue}}" required disabled</code>, 
     * deferred validation is skipped.</li>
     * <li>when a disabled component is enabled, 
     *  <ul>
     *  <li>if component is invalid and showing messages then all component messages are cleared, 
     *  and full validation run using the display value.
     *   <ul>
     *    <li>if there are validation errors, they are shown.</li>
     *    <li>if no errors result from the validation, the <code class="prettyprint">value</code> 
     *    property is updated. Page authors can listen to the <code class="prettyprint">onValueChanged</code> 
     *    event to clear custom errors.</li>
     *   </ul>
     *  </li>
     *  
     *  <li>if component is valid and has no errors then deferred validation is run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated. </li>
     *    </ul>
     *  </li>
     *  <li>if component is invalid and deferred errors then component messages are cleared and 
     *  deferred validation re-run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated.</li>
     *    </ul>
     *  </li>
     *  </ul>
     * </li>
     * <li>when enabled component is disabled then no validation is run and the component appears 
     * disabled.</li>
     * </ul>
     * </p>
     * 
     * @example <caption>Initialize component with <code class="prettyprint">disabled</code> attribute:</caption>
     * &lt;oj-some-element disabled>&lt;/oj-some-element>
     *
     * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
     * // getter
     * var disabled = myComp.disabled;
     *
     * // setter
     * myComp.disabled = false;
     *
     * @ojshortdesc Whether the component is disabled. The default is false.
     * @expose 
     * @type {boolean}
     * @default false
     * @public
     * @instance
     * @memberof oj.editableValue
     * @since 0.7
     */
    disabled : false,
    /**
     * Display options for auxilliary content that determines where it should be displayed 
     * in relation to the component. 
     * 
     * <p>
     * The types of messaging content for which display options can be configured include 
     * <code class="prettyprint">messages</code>, <code class="prettyprint">converterHint</code>, 
     * <code class="prettyprint">validatorHint</code> and <code class="prettyprint">helpInstruction</code>.<br/>
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
     * When display-options changes due to programmatic intervention, the component updates its 
     * display to reflect the updated choices. For example, if 'help.instruction' property goes from 
     * 'notewindow' to 'none' then it no longer shows in the notewindow.
     * </p>
     * <p>
     * A side note: help.instruction and message detail text can include formatted HTML text, whereas hints and 
     * message summary text cannot. If you use formatted text, it should be accessible 
     * and make sense to the user if formatting wasn't there.
     * To format the help.instruction, you could do this:
     * <pre class="prettyprint"><code>&lt;html>Enter &lt;b>at least&lt;/b> 6 characters&lt;/html></code></pre>
     * </p>
     *  
     * @property {(Array.<'placeholder'|'notewindow'|'none'>|'placeholder'|'notewindow'|'none')=} converterHint - supported values are <code class="prettyprint">'placeholder'</code>, 
     * <code class="prettyprint">'notewindow'</code>, <code class="prettyprint">'none'</code>. The 
     * default value is <code class="prettyprint">['placeholder', 'notewindow']</code>. When there 
     * is already a placeholder set on the component, the converter hint falls back to display 
     * type of 'notewindow'.
     * To change the default value you can do this - <br/> 
     * E.g. <code class="prettyprint">{'displayOptions: {'converterHint': ['none']}}</code>
     * @property {(Array.<'notewindow'|'none'>|'notewindow'|'none')=} validatorHint - supported values are <code class="prettyprint">'notewindow'</code>, 
     * <code class="prettyprint">'none'</code>.
     * To change the default value you can do this - <br/>
     * <code class="prettyprint">{'displayOptions: {'validatorHint': ['none']}}</code>
     * @property {(Array.<'inline'|'notewindow'|'none'>|'inline'|'notewindow'|'none')=} messages - supported values are <code class="prettyprint">'notewindow'</code>, 
     * <code class="prettyprint">'inline'</code>,
     * <code class="prettyprint">'none'</code>. The default is 'inline'. 
     * To change the default value you can do this - <br/>
     * E.g. <code class="prettyprint">{'displayOptions: {'messages': 'none'}}</code>
     * @property {(Array.<'notewindow'|'none'>|'notewindow'|'none')=} helpInstruction - supported values are <code class="prettyprint">'notewindow'</code>, 
     * <code class="prettyprint">'none'</code>.
     * To change the default value you can do this - <br/>
     * E.g. <code class="prettyprint">displayOptions='{"helpInstruction": "none"}'</code>
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
     * @example <caption>Override default values for <code class="prettyprint">display-options</code> 
     * for one component:</caption>
     * // In this example, the display-options are changed from the defaults.
     * // The 'converterHint' is none, the 'validatorHint' is none and the 'helpInstruction' is none,
     * // so only the 'messages' will display in its default state.
     * // For most apps, you will want to change the displayOptions app-wide
     * // for all EditableValue components, so you should use the
     * // oj.Components#setDefaultOptions function instead (see previous example).
     * //
     * &lt;oj-some-element display-options='{"converterHint": "none",
     *                                     "validatorHint": "none",
     *                                     "helpInstruction": "none"}'>&lt;/oj-some-element>
     * 
     * @example <caption>Get or set the <code class="prettyprint">displayOptions</code> property after initialization:</caption>
     * // Get one subproperty
     * var hint = myComp.displayOptions.converterHint;
     * 
     * // Set one, leaving the others intact. Use the setProperty API for 
     * // subproperties so that a property change event is fired.
     * myComp.setProperty("displayOptions.converterHint", "none");
     * 
     * // get all
     * var options = myComp.displayOptions;
     *
     * // set all.  Must list every resource key, as those not listed are lost.
     * myComp.displayOptions = {converterHint: "none", validatorHint: "none", helpInstruction: "none"};
     *
     * @ojshortdesc Customize how to display to the user the
     *  form field's messages, converter and validator hints and help instruction text.
     * @expose 
     * @access public
     * @instance
     * @default {'messages': ['inline'],'converterHint': ['placeholder','notewindow'],'validatorHint': ['notewindow'],'helpInstruction': ['notewindow']}
     * @memberof oj.editableValue
     * @type {Object|undefined}
     * @since 0.7
     */
    displayOptions : undefined,    
    /**
     * Form component help information.
     * <p>
     * The properties supported on the <code class="prettyprint">help</code> option are:
     * 
     * @property {string=} instruction this represents advisory information for the component
     * The default value is <code class="prettyprint">null</code>.
     * 
     * @expose 
     * @memberof oj.editableValue
     * @instance
     * @public
     * @type {Object}
     * @default {'help' : {'instruction': null}}
     * @since 0.7
     */
    help: undefined,
    /**
     * <p>help definition text.  See the top-level <code class="prettyprint">help</code> option for details.
     * 
     * @expose
     * @alias help.definition
     * @memberof! oj.editableValue
     * @instance
     * @type {?string}
     * @ignore
     * @default null
     * 
     * @example <caption>Get or set the <code class="prettyprint">help.definition</code> sub-option, after initialization:</caption>
     * // getter
     * var definitionText = $( ".selector" ).ojFoo( "option", "help.definition" );
     * 
     * // setter:
     * $( ".selector" ).ojFoo( "option", "help.definition", "Enter your name" );
     */     
    /**
     * <p>help source url.  See the top-level <code class="prettyprint">help</code> option for details.
     * 
     * @expose
     * @alias help.source
     * @memberof! oj.editableValue
     * @instance
     * @ignore
     * @type {?string}
     * @default null
     * 
     * @example <caption>Get or set the <code class="prettyprint">help.source</code> sub-option, after initialization:</caption>
     * // getter
     * var helpSource = $( ".selector" ).ojFoo( "option", "help.source" );
     * 
     * // setter:
     * $( ".selector" ).ojFoo( "option", "help.source", "www.abc.com" );
     */
    /**
     * Represents hints for oj-form-layout element to render help information on the label of the editable component. 
     * <p>This is used only if the editable component is added as a direct child to an oj-form-layout element, and the labelHint property is also specified.</p>
     * 
     * <p>
     * The helpHints object contains a definition property and a source property.
     * </p>
     * <ul>
     * <li><code class="prettyprint">definition</code> - hint for help definition text.</li>
     * <li><code class="prettyprint">source</code> - hint for help source URL.</li>
     * </ul>
     *
     * @example <caption>Initialize the component with help hints:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-some-element help-hints.definition='some value' help-hints.source='some-url'>&lt;/oj-some-element>
     * 
     * &lt;!-- Using JSON notation -->
     * &lt;oj-some-element help-hints='{"definition":"some value", "source":"some-url"}'>&lt;/oj-some-element>
     *
     * @example <caption>Get or set the <code class="prettyprint">helpHints</code> property after 
     * initialization:</caption>
     * 
     * // Get one
     * var value = myComponent.helpHints.definition;
     * 
     * // Set one, leaving the others intact. Always use the setProperty API for 
     * // subproperties rather than setting a subproperty directly.
     * myComponent.setProperty('helpHints.definition', 'some new value');
     *
     * // Get all
     * var values = myComponent.helpHints;
     *
     * // Set all.  Must list every subproperty, as those not listed are lost.
     * myComponent.helpHints = {
     *     definition: 'some new value',
     *     source: 'some-new-url'
     * };
     *
     * @ojshortdesc Represents hints for oj-form-layout element to 
     * render help information on the label of the editable component.
     * @expose
     * @access public
     * @memberof oj.editableValue
     * @ojtranslatable
     * @instance
     * @type {Object}
     * @default {'definition': "", 'source': ""}
     * @since 4.1.0
     */
     helpHints:
     {
    /**
     * Hint for help definition text associated with the label. 
     * <p>It is what shows up when the user hovers over the help icon, or tabs into the help icon, or press and holds the help icon on a mobile device. No formatted text is available for help definition attribute.</p>
     * 
     * <p>See the <a href="#helpHints">help-hints</a> attribute for usage examples.</p>
     *
     * @expose
     * @alias helpHints.definition
     * @memberof! oj.editableValue
     * @instance
     * @type {string}
     * @ojsignature {target:"Type", value: "?"}
     * @default ""
     * @since 4.1.0
     */
      definition: "",
    /**
     * Hint for help source URL associated with the label. 
     * <p>If present, a help icon will render next to the label. For security reasons we only support urls with protocol http: or https:. If the url doesn't comply we ignore it and throw an error. 
     * Pass in an encoded URL since we do not encode the URL.</p>
     * 
     * <p>See the <a href="#helpHints">help-hints</a> attribute for usage examples.</p>
     *
     * @expose
     * @alias helpHints.source
     * @memberof! oj.editableValue
     * @instance
     * @type {string}
     * @ojsignature {target:"Type", value: "?"}
     * @default ""
     * @since 4.1.0
     */
      source: ""
    },
    /** 
     * Represents a hint for oj-form-layout element to render a label on the editable component. 
     * <p>This is used only if the editable component is added as a direct child to an oj-form-layout element.</p>
     * 
     * <p>
     * When labelHint is present it gives a hint to the oj-form-layout element to create an oj-label element for the editable component.
     * When the <code class="prettyprint">labelHint</code> property changes oj-form-layout element refreshes to 
     * display the updated label information. 
     * </p>
     *  
     * @example <caption>Initialize the component with the <code class="prettyprint">label-hint</code> attribute specified:</caption>
     * &lt;oj-some-element label-hint='input label'>&lt;/oj-some-element>
     *
     * @example <caption>Get or set the <code class="prettyprint">labelHint</code> property after 
     * initialization:</caption>
     * 
     * // getter
     * var value = myComponent.labelHint;
     * 
     * // setter
     * myComponent.labelHint = 'some new value'
     * 
     * @ojshortdesc Represents a hint for oj-form-layout element to render a label on the editable component.
     * @expose 
     * @access public
     * @instance
     * @alias labelHint
     * @ojtranslatable
     * @default ""
     * @memberof oj.editableValue
     * @type {string}
     * @since 4.1.0
     */  
    labelHint: "",
    /**
     * List of messages an app would add to the component when it has business/custom validation 
     * errors that it wants the component to show. This allows the app to perform further validation 
     * before sending data to the server. When this option is set the message shows to the 
     * user right away. To clear the custom message, set <code class="prettyprint">messagesCustom</code>
     * back to an empty array.<br/>
     * <p>Each message in the array is an object that duck types oj.Message.      
     * See {@link oj.Message} for details.
     * </p>
     * <p>
     * See the <a href="#validation-section">Validation and Messages</a> section
     * for details on when the component clears <code class="prettyprint">messagesCustom</code>; 
     * for example, when full validation is run.
     * </p>
     * 
     *
     * @example <caption>Get or set the <code class="prettyprint">messagesCustom</code> property after initialization:</caption>
     * // getter
     * var customMsgs = myComp.messagesCustom;
     * 
     * // setter
     * myComp.messagesCustom = [{summary:"hello", detail:"detail", severity:oj.Message.SEVERITY_LEVEL.INFO}];
     * 
     * @example <caption>Set messagesCustom when there are cross-validation errors:</caption>
     * --- HTML ---
     * &lt;oj-some-element messages-custom='{{messagesCustom}}'>&lt;/oj-some-element> 
     * 
     * --- ViewModel code ---
     * self.messagesCustom = ko.observableArray([]);
     * 
     * // the app's function that gets called when the user presses the submit button
     * if (!myValidateCrossValidationFields())
     * {
     *   // the app adds a custom messages to the component and it is displayed right away
     *   var msgs = [];
     *   msgs.push({'summary':'Cross field error', 'detail':'Field 1 needs to be less than Field 2'});
     *   self.messagesCustom(msgs);
     * }
     * else
     * {
     *   // submit data to the server
     * }
     * 
     * @ojshortdesc List of messages an app would add to the component
     * @expose 
     * @access public
     * @instance
     * @memberof oj.editableValue
     * @default []
     * @type {Array.<Object>}
     * @ojsignature {target: "Type", value: "Array<oj.Message>"}
     * @since 0.7
     * @ojwriteback
     */    
    messagesCustom : [],
    
    /**
     * List of messages currently hidden on component, these are added by component when it runs 
     * deferred validation. Each message in the array is an object that duck types oj.Message. 
     * See {@link oj.Message} for 
     * details. <br/>
     * 
     * <p>
     * This is a read-only option so page authors cannot set or change it directly.
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
     * @default []
     * @type {Array.<Object>|undefined}
     * @since 0.7
     * @see #showMessages
     * @readonly
     * @ignore
     * @ojwriteback
     */    
    messagesHidden : undefined,     
    
    /**
     * List of messages currently shown on component, these include messages generated both by the 
     * component and ones provided by app using <code class="prettyprint">messagesCustom</code>. 
     * Each message in the array is an object that duck types oj.Message.
     * See {@link oj.Message} for details. <br/>
     * 
     * <p>
     * This is a read-only option so page authors cannot set or change it directly.
     * </p>
     * 
     * <p>
     * Messages retrieved using the <code class="prettyprint">messagesShown</code> option are by 
     * default shown inline, but this can be controlled using the 'messages' property of 
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
     * @default []
     * @type {Array.<Object>|undefined}
     * @since 0.7
     * @readonly
     * @ignore
     * @ojwriteback
     */    
    messagesShown : undefined,    

    
    /** 
     * Represents advisory information for the component, such as would be appropriate for a tooltip. 
     * 
     * <p>
     * When help.instruction is present it is by default displayed in the notewindow, or as determined by the 
     * 'helpInstruction' property set on the <code class="prettyprint">displayOptions</code> attribute. 
     * When the <code class="prettyprint">help.instruction</code> property changes the component refreshes to 
     * display the updated information. 
     * </p>
     * 
     * <p>
     * JET takes the help instruction text and creates a notewindow with the text.
     * The help instruction only shows up as a tooltip on mouse over, not on keyboard and not in a mobile
     * device. So help instruction would only be for text that is not important enough to show all users, or
     * for text that you show the users in another way as well, like in the label.
     * Also you cannot theme the native browser's title window like you can the JET
     * notewindow, so low vision users may have a hard time seeing it. 
     * For these reasons, the JET EditableValue components do not use the HTML's title
     * attribute.
     * </p>
     * 
     * <p>
     * To include formatted text in the help.instruction, format the string using html tags. 
     * For example the 
     * help.instruction might look like: 
     * <pre class="prettyprint"><code>&lt;oj-some-element help.instruction="&lt;html>Enter &lt;b>at least&lt;/b> 6 characters&lt;/html>">&lt;/oj-some-element></code></pre>
     * If you use formatted text, it should be accessible 
     * and make sense to the user if formatting wasn't there.
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">help.instruction</code> sub-attribute:</caption>
     * &lt;oj-some-element help.instruction="some tooltip">&lt;/oj-some-element>
     *  
     * @example <caption>Get or set the <code class="prettyprint">help.instruction</code> property after initialization:</caption>
     * // Get one subproperty
     * var instr = myComp.help.instruction;
     *
     * // Set one subproperty, leaving the others intact. Use the setProperty API for 
     * // subproperties so that a property change event is fired.
     * myComponent.setProperty('help.instruction', 'some new value');
     * 
     * // Get all
     * var values = myComponent.help;
     * 
     * // Set all.  Must list every resource key, as those not listed are lost.
     * myComponent.help = {
     *   instruction: 'some new value'
     * };
     * 
     * @ojshortdesc Represents advisory information for the component
     * @expose 
     * @access public
     * @instance
     * @alias help.instruction
     * @ojtranslatable
     * @default ""
     * @memberof! oj.editableValue
     * @ojtsignore
     * @type {string}
     * @since 4.0.0
     */    
    title: "",
    
    /**
     * <p> 
     * The current valid state of the component. It is evaluated on initial render.
     * It is re-evaluated 
     * <ul>
     *   <li>after validation is run (full or deferred)</li> 
     *   <li>when messagesCustom is updated, 
     *   since messagesCustom can be added by the app developer any time.</li>
     *   <li>when showMessages() is called. Since showMessages() moves the 
     *   hidden messages into messages shown,
     *   if the valid state was "invalidHidden" then it would become "invalidShown".</li>
     *   <li>when the required property has changed. If a component is empty and has required
     *   set, the valid state may be "invalidHidden" (if no invalid messages are being shown as well). 
     *   If required property is removed, the valid state would change to "valid".</li> 
     * </ul>
     * </p>
     * <p>
     *  Note: New valid states may be added to the list of valid values in future releases.
     *  Any new values will start with "invalid" 
     *  if it is an invalid state, "pending" if it is pending state, 
     *  and "valid" if it is a valid state.
     * </p>
     * @example <caption>Get <code class="prettyprint">valid</code> attribute, after initialization:</caption>
     * // Getter:
     * var valid = myComp.valid;
     * @example <caption>Set the <code class="prettyprint">on-valid-changed</code>
     *  listener so you can do work in the ViewModel based on the 
     *  <code class="prettyprint">valid</code> property:</caption>
     * &lt;oj-some-element id='username' on-valid-changed='[[validChangedListener]]'>
     * &lt;/oj-some-element>
     * &lt;oj-some-element id='password' on-valid-changed='[[validChangedListener]]'>
     * &lt;/oj-some-element>
     * &lt;oj-button disabled='[[componentDisabled]]' on-click='[[submit]]'>Submit&lt;/oj-button>
     * -- ViewModel --
     * self.validChangedListener = function (event) {
     *   var enableButton;
     *   var usernameValidState;
     *   var passwordValidState;
     *   
     *   // update the button's disabled state.
     *   usernameValidState = document.getElementById("username").valid;
     *   passwordValidState = document.getElementById("password").valid;
     *   
     *   // this updates the Submit button's disabled property's observable based
     *   // on the valid state of two components, username and password.
     *   // It is up to the application how it wants to handle the “pending” state 
     *   // but we think that in general buttons don’t need to be 
     *   // enabled / disabled based on the "pending" state.
     *   enableButton = 
     *    (usernameValidState !== "invalidShown") &&
     *    (passwordValidState !== "invalidShown");
     *   self.componentDisabled(!enableButton);;
     * };
     * 
     * @ojshortdesc The validity state of the component
     * @expose 
     * @access public
     * @instance
     * @type {string}
     * @ojvalue {string} "valid" The component is valid
     * @ojvalue {string} "pending" The component is waiting for the validation state to be determined.
     * The "pending" state is never set in this release of JET. It will be set in a future release.
     * @ojvalue {string} "invalidHidden" The component has invalid messages hidden
     *    and no invalid messages showing. An invalid message is one with severity "error" or higher.
     * @ojvalue {string} "invalidShown" The component has invalid messages showing.
     *  An invalid message is one with severity "error" or higher.
     * @ojwriteback
     * @readonly
     * @memberof oj.editableValue
     * @since 4.2.0 
     * @ojstatus preview
     */
    valid: undefined,
    
    /** 
     * The value of the component. 
     * 
     * <p>
     * When <code class="prettyprint">value</code> property changes due to programmatic 
     * intervention, the component always clears all messages
     * including <code class="prettyprint">messagesCustom</code>, runs deferred validation, and 
     * always refreshes UI display value.</br>
     * 
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; the 
     * <code class="prettyprint">valid</code> property is updated with the result.</li>
     * </ul>
     * </p>
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">value</code> attribute specified:</caption>
     * &lt;oj-some-element value='10'>&lt;/oj-some-element>
     * @example <caption>Get or set <code class="prettyprint">value</code> attribute, after initialization:</caption>
     * // Getter: returns '10'
     * var val = myComp.value;
     * // Setter: sets '20'
     * myComp.value = '20';
     * 
     * @ojshortdesc The value of the editablevalue component
     * @expose 
     * @access public
     * @instance
     * @default null
     * @ojwriteback
     * @memberof oj.editableValue
     * @since 0.6
     * @type {Object|undefined}
     * @ojsignature {
     *                 target: "Accessor",
     *                 value: {
     *                          GetterType: "V",
     *                          SetterType: "SV"}
     *              }
     */
    value: undefined,

    // Events
    /**
     * Triggered when a default animation is about to start on an element owned by the component.
     *
     * <p>The default animation can be cancelled by calling <code class="prettyprint">event.preventDefault</code>, followed by
     * a call to <code class="prettyprint">event.detail.endCallback</code>.  <code class="prettyprint">event.detail.endCallback</code> should be
     * called immediately after <code class="prettyprint">event.preventDefault</code> if the application merely wants to cancel animation, 
     * or it should be called when the custom animation ends if the application is invoking another animation function.  Failure to
     * call <code class="prettyprint">event.detail.endCallback</code> may prevent the component from working properly.</p>
     * <p>For more information on customizing animations, see the documentation of 
     * <a href="oj.AnimationUtils.html">oj.AnimationUtils</a>.</p>
     *
     * <caption>The default animations are controlled via the theme (SCSS) :</caption>
     * <pre class="prettyprint"><code>
     * // default animations for "notewindow" display option
     * $noteWindowOpenAnimation: (effect: "zoomIn", transformOrigin: "#myPosition") !default;
     * $noteWindowCloseAnimation: (effect: "none") !default;
     *
     * // default animations for "inline" display option
     * $messageComponentInlineOpenAnimation: (effect: "expand", startMaxHeight: "#oldHeight") !default;
     * $messageComponentInlineCloseAnimation: (effect: "collapse", endMaxHeight: "#newHeight") !default;
     * </code></pre>
     *
     * @ojshortdesc Triggered when a default animation is about to start, such as when the component is
     * being opened/closed or a child item is being added/removed. The default animation can
     * be cancelled by calling event.preventDefault.
     *
     * @expose
     * @event
     * @memberof oj.editableValue
     * @since 4.0.0
     * @ojbubbles
     * @ojcancelable
     * @instance
     * @property {string} action The action that triggers the animation. Supported values are:
     *                    <ul>
     *                      <li>"inline-open" - when an inline message container opens or increases in size</li>
     *                      <li>"inline-close" - when an inline message container closes or decreases in size</li>
     *                      <li>"notewindow-open" - when a note window opens</li>
     *                      <li>"notewindow-close" - when a note window closes</li>
     *                    </ul>
     * @property {Element} element The element being animated.
     * @property {function():void} endCallback If the event listener calls event.preventDefault to
     *            cancel the default animation, it must call the endCallback function when it
     *            finishes its own animation handling and any custom animation has ended.
     *
     * @example <caption>Define an event listener for the
     *          <code class="prettyprint">ojAnimateStart</code> event to override the default
     *          "inline-open" animation:</caption>
     * var listener = function( event )
     *   {
     *     // Change the "inline-open" animation for inline message
     *     if (event.detail.action == "inline-open") {
     *       // Cancel default animation
     *       event.preventDefault();
     *       // Invoke new animation and call endCallback when the animation ends
     *       oj.AnimationUtils.fadeIn(event.detail.element).then(event.detail.endCallback);
     *     }
     *   };
     *
     * @example <caption>Define an event listener for the
     *          <code class="prettyprint">ojAnimateStart</code> event to cancel the default
     *          "notewindow-close" animation:</caption>
     * var listener = function( event )
     *   {
     *     // Change the "notewindow-close" animation for note window
     *     if (ui.action == "notewindow-close") {
     *       // Cancel default animation
     *       event.preventDefault();
     *       // Call endCallback immediately to indicate no more animation
     *       event.detail.endCallback();
     *   };
     */
    animateStart : null,
    /**
     * Triggered when a default animation has ended.
     *
     * @expose
     * @event
     * @ojbubbles
     * @ojcancelable
     * @memberof oj.editableValue
     * @since 4.0.0
     * @instance
     * @property {string} action The action that triggers the animation. Supported values are:
     *                    <ul>
     *                      <li>"inline-open" - when an inline message container opens or increases in size</li>
     *                      <li>"inline-close" - when an inline message container closes or decreases in size</li>
     *                      <li>"notewindow-open" - when a note window opens</li>
     *                      <li>"notewindow-close" - when a note window closes</li>
     *                    </ul>
     * @property {Element} element The element being animated.
     * @example <caption>Define an event listener for the
     *          <code class="prettyprint">ojAnimateEnd</code> event to add any processing after the end of
     *          "inline-open" animation:</caption>
     * var listener = function( event )
     * {
     *   // Check if this is the end of "inline-open" animation for inline message
     *   if (event.detail.action == "inline-open") {
     *     // Add any processing here
     *   }
     * };
     */
    animateEnd : null
  },
  
  // P U B L I C    M E T H O D S
  
  // @inheritdoc
  getNodeBySubId: function(locator)
  {
    var node;
    var subId;

    node = this._super(locator);
    
    // this subId is only for non-custom element components so skip if custom element
    if (!node && !this._IsCustomElement())
    {
      subId = locator['subId'];

      if (subId === "oj-label-help-icon")
      {
        var label = this._GetLabelElement();

        if (label)
          node = label.parent().find(".oj-label-help-icon");
      }
    }
    // Non-null locators have to be handled by the component subclasses
    return node || null;
  },
  //** @inheritdoc */
  getSubIdByNode : function(elem)
  {
    var $node,
        anchor,
        div,
        label,
        subId = null;
    
    if (elem != null)
    {
      $node = $(elem);
      anchor = $node.closest("a.oj-label-help-icon");
       
      if (anchor != null)
      {
        // Go up to the top level element of the label
        div = anchor.closest(".oj-label");
        
        if (div != null)
        {
          // Now find the actual label
          label = div.find("label")[0];
          
          if (label)
          {
            // Make sure the label is the one associated with this component
            if (label == this._GetLabelElement()[0])
            {
               subId = {"subId":"oj-label-help-icon"};
            }
          }
        }
      }
    }
     
    return subId;
  },
  /**
   * whether the component is currently valid.  It is valid if it doesn't have any errors.
   * This method is final; do not override.
   * Currently this is for the widget components and not custom elements.
   * @example <caption>Check whether the component is valid:</caption>
   * var valid = myInputElement.isValid();
   * @returns {boolean}
   * @access public
   * @instance
   * @expose
   * @memberof oj.editableValue
   * @final
   * @ignore
   */
  isValid : function ()
  {
    if (this._valid === undefined)
    {
      this._valid = !this._hasInvalidMessages();
    }
    
    return this._valid;
  },
  
  /**
   * Called when the DOM underneath the component changes requiring a re-render of the component. An 
   * example is when the <code class="prettyprint">id</code> for the input changes. <br/>
   * <p>
   * Another time when refresh might be called is when the locale for the page changes. When it 
   * changes, attributes used by its converter and validator that are locale specific, its hints, 
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
   * <li>if component is invalid and is showing messages when 
   * <code class="prettyprint">refresh()</code> is called, then all component messages are cleared 
   * and full validation run using the display value on the component. 
   * <ul>
   *   <li>if there are validation errors, then <code class="prettyprint">value</code> 
   *   attribute is not updated and the error is shown. 
   *   </li>
   *   <li>if no errors result from the validation, the <code class="prettyprint">value</code> 
   *   attribute is updated; page author can listen to the <code class="prettyprint">onValueChanged</code> 
   *   event to clear custom errors.</li>
   * </ul>
   * </li>
   * <li>if component is invalid and has deferred messages when <code class="prettyprint">refresh()</code> 
   * is called, then all component messages are cleared and deferred validation is run.</li>
   * </ul>
   * </p>
   * 
   * <h4>Clearing Messages</h4>
   * <ul>
   * <li>If clearing messages only those created by the component are cleared.
   * <li><code class="prettyprint">messagesCustom</code> attribute is not cleared.</li>
   * </ul>
   * </p>
   * 
   * @example <caption>Redraw the component element.</caption>
   * myComp.refresh();
   * 
   * @access public
   * @instance
   * @expose
   * @return {void}
   * @memberof oj.editableValue
   * @since 0.7
   */
  refresh : function ()
  {
    this._super();
    this._doRefresh(true);
  },
  
  /**
   * Resets the component by clearing all messages and messages attributes - 
   * <code class="prettyprint">messagesCustom</code> -
   * and updates the component's display value using the attribute value. User entered values will be 
   * erased when this method is called.
   * 
   * @example <caption>Reset component</caption>
   * myComp.reset(); <br/>
   * 
   * @access public
   * @instance
   * @expose
   * @return {void}
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
   * Takes all deferred messages and shows them. 
   * It then updates the valid property; e.g.,
   * if the valid state was "invalidHidden"
   * before showMessages(), the valid state will become "invalidShown" after showMessages(). 
   * <p>
   * If there were no deferred messages this method simply returns. 
   * </p>
   * 
   * 
   * @example <caption>Display all messages including deferred ones.</caption>
   * myComp.showMessages();
   * @access public
   * @instance
   * @return {void}
   * @expose
   * @memberof oj.editableValue
   * @since 0.7
   */
  showMessages : function ()
  {
    var clonedMsgs = [];
    var i;
    var msgHidden;
    var msgsHidden = this.options['messagesHidden'];
    var hasMessagesHidden = msgsHidden.length > 0;
    var clonedMsg;
    
    // showMessages() copies messagesHidden into clonedMsgs, 
    // then clears messagesHidden, and updates messagesShown with the clonedMsgs. 
    // It then updates the valid property; e.g.,
    // if the valid state was "invalidHidden"
    // before showMessages(), the valid state will become "invalidShown" after showMessages(). 
    for (i = 0; i < msgsHidden.length; i++)
    {
      msgHidden = msgsHidden[i];
      
      // The oj.Message and oj.ComponentMessage distinction is important in a few places in
      // the EV code. For example, when messagesCustom property changes, we keep existing
      // messagesShown only if they are ComponentMessage added by component.
      // if (msg instanceof oj.ComponentMessage && msg._isMessageAddedByComponent())
      if (msgHidden instanceof oj.ComponentMessage)
      {
        // change oj.ComponentMessage's display state to oj.ComponentMessage.DISPLAY.SHOWN
        msgHidden._forceDisplayToShown();
        

        // 
        // .clone() clones the message and the options that were passed in when the message
        // was originally created.
        clonedMsg = msgHidden.clone();
      }
      else
        // NOTE: oj.Message is a public class and oj.ComponentMessage is private.
        // oj.Message's .clone is deprecated, so we purposely don't call it here.
        clonedMsg = new oj.Message(msgHidden['summary'], msgHidden['detail'], msgHidden['severity']);
      
      clonedMsgs.push(clonedMsg);
    }
    
    if (hasMessagesHidden)
    {

      this._clearMessages('messagesHidden');
      
      this._updateMessagesOption('messagesShown', clonedMsgs);
      
      this._setValidOption(null);
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
    
    // We need to do this for custom element components since
    // help.instruction is used instead of title.
    if (this._IsCustomElement())
    {
      // update the title option if help.instruction option exists
      var help = this.options["help"];

      if (help != null)
      {
        var helpInstruction = help["instruction"];

        if (helpInstruction != null)
        {
          this.options["title"] = helpInstruction;
        }
      }
      
      // update displayOptions.title from displayOptions.helpInstruction
      var dispOpts = this.options["displayOptions"];
      
      if (dispOpts != null)
      {
        var helpInstruction = dispOpts["helpInstruction"];

        if (helpInstruction != null)
        {
          dispOpts["title"] = helpInstruction;
          this.options["displayOptions"] = dispOpts;
        }
      }
    }
    
    
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
    // custom elements create their input/textarea dom, so no need to do that for them.
    if (savedAttributes && !this._IsCustomElement())
    {
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
    var describedBy;
    
    this._super();
    
    // refresh value, theming and aria attributes
    this._doRefresh(false);

    // create an ojLabel only if this isn't a custom element. For example, ojInputText will
    // create an ojLabel, but <oj-input-text> will not. Instead the app dev uses <oj-label>.
    if (!this._IsCustomElement())
      this._createOjLabel();
    else
    {
      // If this is a custom element, we need to write the default style class + "-label" 
      // onto the oj-label. The reason is so
      // we can theme the oj-label based on what form control it is labeling. We use this in
      // our themes to line up the label to the form control, 
      // e.g., oj-label-inline.oj-radioset-label {margin-top:.5em;}.
      if (this.customOjLabelElement === undefined)
        this.customOjLabelElement = this._getCustomOjLabelElement();
      if (this.customOjLabelElement)
        $(this.customOjLabelElement).addClass(this._GetDefaultStyleClass()+"-label");
    }


    // set describedby on the element as aria-describedby
    describedBy = this.options['describedBy'];

    if (describedBy)
    {
      this._addAriaDescribedBy(describedBy);
    }

    // initialize component messaging
    this._initComponentMessaging();
    
    // run deferred validation 
    this._runDeferredValidation(this._VALIDATION_CONTEXT.COMPONENT_CREATE);
    
    // trigger messagesShownChanged for messagesShown if it's non-empty. 
    // this.options['messagesShown'] would have been 
    // updated in _ComponentCreate if messagesCustom was non-empty. Because we are setting
    // the 'changed' flag to true, the messagesShownChanged event will be fired, and that's what we want.
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
    if (!this._IsCustomElement())
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
    if (!this._IsCustomElement())
      this._RestoreAllAttributes(element);
  },
  /**
   * Performs post processing after _SetOption() calls _superApply(). Different options, when changed, perform
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
        // For custom element, we use displayOptions.helpInstruction instead of displayOptions.title
        // so internally we need to update title with the value of helpInstruction
        if (this._IsCustomElement())
        {
          var dispOpts = this.options["displayOptions"];
          
          if (dispOpts != null)
          {
            var helpInstruction = dispOpts["helpInstruction"];

            if (helpInstruction != null)
            {
              dispOpts["title"] = helpInstruction;
              this.options["displayOptions"] = dispOpts;
            }
          }
        }
        
        // clear the cached merged options; the getter setup for this.options['displayOptions']
        // will merge the new value with the defaults
        this._initComponentMessaging();
        break;

      case "help":
        if (!this._IsCustomElement())
          this._Refresh(option, this.options[option]);
        
        // For custom element components, we use help.instruction instead of title
        // so we need to update the internal title option with the value of
        // help.instruction
        if (this._IsCustomElement())
        {
          this.options["title"] = this.options.help["instruction"];
          this._titleOptionChanged();
        }
        
        break;

      case "messagesCustom":
        this._messagesCustomOptionChanged(flags);
        this._setValidOption(null);
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
   * - triggers a valueChanged event and does writeback if required.<br/>
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
           oj.Components.__GetWidgetConstructor(this.$label[labelIndex]) != null)
       {
         $(this.$label[labelIndex]).ojLabel( "destroy" );
       } 
     }     
    }


    return ret;
  },

  /**
   * @memberof oj.editableValue
   * @instance
   * @override
   * @protected
   * @since 5.0.0
   */
  GetFocusElement : function ()
  {
    return this._GetContentElement()[0];
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
    var oldValue;
    var newValue;
    
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
                
        case "describedBy":
          // This sets the aria-describedby on the correct dom node
          oldValue = this.options['describedBy'];
          newValue = value;

          if (oldValue)
          {
            this._removeAriaDescribedBy(oldValue);
          }
          if (newValue)
          {
            this._addAriaDescribedBy(newValue);
          }
    
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
    
    if (this.$label)
      return this.$label;
    
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

    if (!this._CompareOptionValues('rawValue', this.options['rawValue'], val))
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
        if (!this._IsCustomElement())
        {
          // refresh the help - need to keep the label in sync with the input.
          if (this.$label)
          {
            helpDef = this.options.help["definition"];
            helpSource = this.options.help["source"];
            this.$label.ojLabel("option", "help", 
                                 {"definition" : helpDef, "source" : helpSource});
            this._refreshDescribedByForLabel();

          }
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
      this.$label.ojLabel("refresh");
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
           
      this._setValidOption(event);
      
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
  
  //** @inheritdoc */
  _CompareOptionValues : function (option, value1, value2)
  {
    if (option === 'value' || option === 'rawValue')
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
   * @memberof oj.editableValue
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
   * @param {Event=} event the original event (for user initiated actions that trigger a DOM event,
   * like blur) or undefined.
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
      // NOTE: shownMsgs is this.options['messagesShown'] 
      // so we are modifying this.options['messagesShown'] here.
      msg = shownMsgs[i];
      if (msg instanceof oj.ComponentMessage)
      {
        shownMsgs.splice(i, 1);
      }
    }
    
    if (shownMsgs.length !== beforeLen)
    {
      // Setting 'changed' flag to true means that although we have already 
      // updated this.options['messagesShown'], we still want to fire a messagesShownChanged event.
      this._setMessagesOption('messagesShown', shownMsgs, null, true);
    }    
  },
  
    
  /**
   * Sets the messages option with the new value.
   * Setting 'changed' flag to true means we want to fire a property changed event
   * without checking that the option value to what you are setting it to. Useful
   * if the option is an array or we have already updated the option directly.
   * 
   * This method updates the option directly without invoking setOption() method. This is done by 
   * setting the following property in flags parameter of the option() method - 
   * <code class="prettyprint">{'_context': {internalSet: true}}</code>
   * 
   * @param {string} key
   * @param {Array} value
   * @param {Event=} event the event like the user blurred to trigger a messages option change
   * or undefined.
   * @param {Boolean=} changed when this is true, then we set the 'changed' flag to true, and having
   * the changed flag be true will guarantee that the property changed event is fired even if the
   * the property value is equal to what you are setting it to.
   * @private
   * @memberof oj.editableValue
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
   * Sets the valid option with the new value.
   * 
   * This method updates the option directly without invoking setOption() method. This is done by 
   * setting the following property in flags parameter of the option() method - 
   * <code class="prettyprint">{'_context': {internalSet: true}}</code>
   * 
   * @param {Event=} event the original event (for user initiated actions that trigger a DOM event,
   * like blur) or undefined. The custom element bridge creates a CustomEvent out of this when 
   * it sends the property changed event.
   * @private
   */
  _setValidOption : function (event)
  {
    var flags = {};

    // 'valid' is read-only
    flags['_context'] = {originalEvent: event, writeback: true, internalSet: true, readOnly: true};

    this.option("valid", this._determineValid(), flags);

  },  
  
  /**
   * Clears the messages and message options - <code class="prettyprint">messagesHidden</code>,
   * <code class="prettyprint">messagesShown</code>, <code class="prettyprint">messagesCustom</code>.
   * 
   * @param {String} option messages option that is being cleared.
   * @param {Event=} event the original event (for user initiated actions that trigger a DOM event,
   * like blur) or undefined.
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
        msg = new oj.Message(val['summary'], val['detail'], val['severity']);
        msg =  Object.freeze ? Object.freeze(msg) : msg;
        msgsClone.push(msg);
      }
    }
    
    return msgsClone;
  },  
  
 
  /** 
   * Create the ojLabel component with help (required is done in the components that support
   * required) see oj.EditableValueUtils._refreshRequired.
   * This is not supported for custom elements. For pages with custom elements, the app dev
   * uses the public &lt;oj-label> component.
   * @private
   * @memberof oj.editableValue
   * @instance
   * 
   */
  _createOjLabel : function ()
  {
    var helpDef;
    var helpSource;
    
    if (this._IsCustomElement())
      return;
    
    this.$label = this._GetLabelElement();
    if (this.$label)
    {
      helpDef = this.options['help']['definition'];
      helpSource = this.options['help']['source'];

      // create the ojLabel component 
      this.$label.ojLabel(
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
  
  /**
   * Gets the last display value
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
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
   * @return {jQuery|null} if element does not have aria-labelledby defined, then
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
      id = ariaLabelledByElem.attr("id");
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
  /**
   * Finds the oj-label element associated with this form component and returns it.
   * @returns {Element|null}
   * @private
   * @memberof oj.editableValue
   * @instance
   */  
  _getCustomOjLabelElement: function ()
  {
    var labelElement = null;
    var $labelElement;
    var labelledBy = this.options['labelledBy'];
    var widget;
    var widgetId;
    
    if (labelledBy)
    {
      // First, if 'labelledBy', look for the oj-label by its 'id' since that will be fastest.
      labelElement = document.getElementById(labelledBy);
    }
      
    // if there is no label element found, then look at the 'id'/'for' combination.
    if (labelElement === null)
    {
      // If 'id', look for the label by its 'for' attribute. (First look for sibling 
      // since that is the most common way and attribute selector searches perform better than
      // looking at the entire document.)  
      // widget will be the JET form element, like oj-input-text, in jquery format.
      widget = this.widget();
      widgetId = widget[0].id;
      if (widgetId)
      {
        // $labelElement will be the <oj-label>.
        $labelElement = widget.siblings("[for='" + widgetId + "']");
        if ($labelElement.length === 0)
        {
          // a sibling label is not found, so look for it from the document level.
          $labelElement = $("[for='" + this.element.id + "']");

        }
        if ($labelElement.length > 0)
        {
          // if it is still 0, we couldn't find the label. If it has a length, we return
          // the first one.
          labelElement = $labelElement[0];
        }
      }        
    }
    return labelElement;
  },
  /**
   * Helper method to retrieve the label text. Needed for required translation. 
   * Returns the form component's label or oj-label's textContent, if the label was found.
   * 
   * @return {string|null}
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _getLabelText : function ()
  {

    if (this.$label)
    {
      return this.$label.text();
    }
    else
    {
      if (this.customOjLabelElement === undefined)
        this.customOjLabelElement = this._getCustomOjLabelElement();
      return this.customOjLabelElement ? this.customOjLabelElement.textContent : null;
    }
  },

  /**        
   * @private
   * @memberof oj.editableValue
   * @instance
   */
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
  /**        
   * @private
   * @memberof oj.editableValue
   * @instance
   */
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
  /**        
   * @private
   * @memberof oj.editableValue
   * @instance
   */  
  _setLastModelValue : function (value)
  {
    this._oj_lastModelValue = value;
  },
  /**        
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _setLastSubmittedValue : function (value) 
  {
    this._oj_lastElementValue = value;
  },
  /**        
   * @private
   * @memberof oj.editableValue
   * @instance
   */
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
   * @param {Event=} event - the event like the user blurred to trigger a messages option change
   * or undefined.
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
      // update this.options[option] directly by pushing any new messages into it.
      msgs = this.options[option];

      len = newMsgs.length;
      for (i = 0; i < len; i++)
      {
        msgs.push(newMsgs[i]);
      }
    }
    // Setting 'changed' flag to true means that although we have already 
    // updated this.options[option], we still want to fire a property changed event.
    this._setMessagesOption(option, msgs, event, true);
  },
  
  
  /**
   * Called after the messages option has changed to update internal valid property and messaging 
   * display.
   * 
   * @private
   * @memberof oj.editableValue
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

    context.internalSet = true;
    this.option({'value': newValue}, {'_context': context});
    // When internalSet is true _setOption->_AfterSetOptionValue->_Refresh isn't called. 
    // We still need the converter to run and the displayValue to be refreshed, so we
    // call this._AfterSetOptionValue ourselves
    this._AfterSetOptionValue('value', {'_context': context});
    

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
   * This is what the 'valid' property should be set to.
   * 
   * Now when we start the lifecycle we clearAllMessages, then we continue with validation, etc.
   * But we don't want to update the valid property on clearAllMessages and again when validation
   * has failed. We want to update it only once.
   * @return {string} "valid", "invalidShown", "invalidHidden"
   * 
   * @private
   * @memberof oj.editableValue
   * @instance
   */
  _determineValid : function ()
  {
    var msgsHidden = this.options['messagesHidden'];
    var msgsShown = this.options['messagesShown'];

    var valid = "valid";
    
    // When new messages are written update the valid property
    if ( msgsShown && msgsShown.length !== 0 && !oj.Message.isValid(msgsShown))
    {
      valid = "invalidShown";
    }
    else if(msgsHidden && msgsHidden.length !== 0 && !oj.Message.isValid(msgsHidden))
    {
      valid = "invalidHidden";
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
    // $.extend merges the contents of two or more objects together into the first object
    var previousMsgs = $.extend([], pm);
    var msgs = $.extend([], m);
    
    
    if (previousMsgs.length !== msgs.length)
    {
      return false;
    }
    
    // one way it gets here is if there is one messages-custom message on initialization and
    // after the busyContext is complete meaning the page is rendered, we set a different
    // messages-custom message.
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
          if((oj.Message.getSeverityLevel(pmo['severity']) === 
             oj.Message.getSeverityLevel(msg['severity'])) && 
             pmo['summary'] === msg['summary'] && 
             pmo['detail'] === msg['detail'])
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
  /**
   * @private
   * @memberof oj.editableValue
   */
  _addValidationError : function(e, msgs)
  {
    var detail;
    var severity;
    var ojmessage;
    var summary;

    if (e instanceof oj.ConverterError || e instanceof oj.ValidatorError)
    {
      ojmessage = e.getMessage();

      severity = ojmessage['severity'] || oj.Message.SEVERITY_LEVEL['ERROR'];
      summary = ojmessage['summary'] || oj.Translations.getTranslatedString("oj-message.error");;
      detail = ojmessage['detail'] || oj.Translations.getTranslatedString("oj-converter.detail");
    }
    else if (e['summary'] || e['detail'])
    {
      severity = oj.Message.SEVERITY_LEVEL['ERROR'];
      summary = e['summary'] || oj.Translations.getTranslatedString("oj-message.error");;
      detail = e['detail'] || oj.Translations.getTranslatedString("oj-converter.detail");
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
  /**
   * @private
   * @memberof oj.editableValue
   */
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
    if (fullRefresh || (value !== this._getLastModelValue()))
    {
      this._updateElementDisplayValue(value);
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
    // set valid option whether or not we can set a value in the field. It won't trigger
    // an option changed event if the valid value is the same as it was before.
    this._setValidOption(null);
  },
    
  /**
   * Runs validation based on the mode settings. 
   * 
   * @param {Object} value to parse and/or validate
   * @param {number=} mode determines how validation is run. see _VALIDATION_MODE
   * @param {number=} context determines when validation is being run.
   * @param {Event=} event the original event (for user initiated actions that trigger a DOM event,
   * like blur) or undefined.
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
      // update valid option before we throw the error
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
   * listen to valueChanged to clear custom errors.<br/>
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
      // we update the valid option within _runDeferredValidation
      if (this._IsRequired())
      {
        this._runDeferredValidation(validationOptions.validationContext);
      }
      else
      {
        this._setValidOption(null);
      }
    }
  },
    
  /**
   * @private
   * @memberof oj.editableValue
   */
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
           
    this._setValidOption(null);

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
}, true);

oj.Components.setDefaultOptions(
  {

    'editableValue': // properties for all editableValue components 
    {
      'displayOptions': oj.Components.createDynamicPropertyGetter(function(context){
        var displayOptions = {
          'messages': context['containers'].indexOf('ojDataGrid') >= 0 || 
                      context['containers'].indexOf('ojTable') >= 0 ? ['notewindow'] : ['inline'],
          'converterHint': ['placeholder', 'notewindow'], 
          'validatorHint': ['notewindow']
        };
        displayOptions[context['isCustomElement'] ? 'helpInstruction' : 'title'] = ['notewindow'];
        return displayOptions;
      }),
      'help': oj.Components.createDynamicPropertyGetter(function(context) {
        // Conditionally set the defaults for custom element vs widget syntax since we expose different APIs
        if (context['isCustomElement']) {
          return {'instruction': ''};
        } else {
          return {'definition': null, 'source': null};
        }
      }),
    }
  }
 

);
//////////////////     SUB-IDS     //////////////////
/**
 * <p>Sub-ID for the help icon element used by EditableValue components.</p>
 * 
 * @ojsubid oj-label-help-icon
 * @memberof oj.editableValue
 * @ignore
 *
 * @example <caption>Get the help icon element associated with an editable value component:</caption>
 * var node = myComp.getNodeBySubId("oj-label-help-icon");
 */

//////////////// fragments /////////////////
/**
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
 * <h4 id="normal-validation-section">Normal Validation 
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#normal-validation-section"></a></h4>
 * Normal validation is run in the following cases on the display value, using the converter and 
 * validators set on the component, and validation errors are reported to user immediately.
 * <ul>
 * <li>When value changes as a result of user interaction all messages are cleared, including custom 
 * messages added by the app, and full validation is run on the UI value. The steps performed are 
 * outlined below.
 * <ol> 
 * <li>All messages are cleared and <code class="prettyprint">messagesCustom</code> property is cleared</li>
 * <li>If no converter is present then processing continues to next step. If a converter is 
 * present, the UI value is first converted (i.e., parsed). If there is a parse error then 
 * the messages are shown and processing returns.</li>
 * <li>If there are no validators setup for the component then the value is set on the component. 
 * Otherwise all validators are run in sequence using the parsed value from the previous step. The 
 * implicit required is run first if the component is marked required. When a validation error is 
 * encountered it is remembered and the next validator in the sequence is run. 
 * <ul><li>NOTE: The value is trimmed before required validation is run</li></ul>
 * </li>
 * <li>At the end of the validation run if there are errors, the messages are shown
 * and processing returns. If there are no errors, then the 
 * <code class="prettyprint">value</code> property is updated and the formatted value displayed on the 
 * UI.</li>
 * </ol>
 * </li>
 * <li>When the <code class="prettyprint">validate</code> method is called by app, all messages are 
 * cleared and full validation run using the display value. See <code class="prettyprint">validate</code>
 * method on the sub-classes for details. Note: JET validation is designed to catch user input errors, and not invalid
 * data passed from the server; this should be caught on the server.</li>
 * <li>When certain properties change through programmatic intervention by app, the component 
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
 *  <li>When a component is created and it is required deferred validation is run and no messages are cleared 
 *  prior to running validation.  
 *  Refer to the <a href="#deferred-validators-section">Validators 
 *  Participating in Deferred Validation</a> section for details.</li> 
 *  <li>When the <code class="prettyprint">value</code> property changes due to programmatic 
 *  intervention deferred validation is run, after all messages and messagesCustom property are cleared.</li>  
 *  <li>When the <code class="prettyprint">reset</code> method is called, deferred validation is run 
 *   after all messages and messagesCustom property are cleared.</li>  
 *  <li>When certain properties change through programmatic intervention by app, the component 
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
 *  <li>when disabled property changes. See <a href="#disabled">disabled</a> property for details.</li>
 *  <li>when refresh method is called. See <a href="#refresh">refresh</a> method for details.</li> 
 *  <li>when converter property changes. Not all EditableValue components have the converter property. See
 *  the sub-classes that have the converter property for details, e.g., {@link oj.inputBase#converter}.</li>
 *  <li>when required property changes. Not all EditableValue components have the required property. See
 *  the sub-classes that have the required property for details, e.g., {@link oj.inputBase#required}.</li>
 *  <li>when validators property changes. Not all EditableValue components have the validators property. See
 *  the sub-classes that have the validators property for details, e.g., {@link oj.inputBase#validators}.</li>
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
 * <li>calls the <a href="#showMessages"><code class="prettyprint">showMessages</code></a> method on the component</li>
 * </ul>
 * </p>
 * 
 * <p>
 * <h3 id="deferred-validators-section">
 * Validators Participating in Deferred Validation
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#deferred-validators-section"></a>
 * </h3>
 * The required validator is the only validator type that participates in deferred validation.
 * The required property needs to be set to true for the required validator to run.
 * </p> 
 * @ojfragment validationAndMessagingDoc - Used in the general section of classdesc
 * @memberof oj.editableValue
 */

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
 * Get the default animation.
 *
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
oj.InlineMessagingStrategy.prototype._getDefaultAnimation = function()
{
  // Load the default animation once per page scope
  if (!oj.InlineMessagingStrategy._defaultAnimation)
  {
    var animation = (oj.ThemeUtils.parseJSONFromFontFamily('oj-messaging-inline-option-defaults') || {})["animation"];
    animation = animation || {};
    oj.InlineMessagingStrategy._defaultAnimation = animation; 
  }
  
  return oj.InlineMessagingStrategy._defaultAnimation;
};

/**
 * Replace animation options with runtime values, such as oldHeight and 
 * newHeight, which are specified as placeholders in the default animations
 * but their values are not known until runtime.
 *
 * @param {string|Object|Array} effects - The animation options.
 * @param {Object} map - An object containing the runtime property key-value map.
 * @return {string|Object|Array} The resolved animation effects
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
oj.InlineMessagingStrategy.prototype._replaceAnimationOptions = function (effects, map)
{
  var effectsAsString;
  var isEffectsTypeofString;

  if (!oj.StringUtils.isString(effects))
  {
    isEffectsTypeofString = false;
    effectsAsString = JSON.stringify(effects);
  }
  else
  {
    isEffectsTypeofString = true;
    effectsAsString = effects + ""; // append "" to get around a closure compiler warning
  }

  for (var key in map)
  {
    effectsAsString = effectsAsString.replace(new RegExp(key, 'g'), map[key]);
  }

  effects = isEffectsTypeofString ? effectsAsString :
    /** @type {Object} */ (JSON.parse(effectsAsString));

  return effects;
};

/**
 * Determine the animation for displaying new messaging content.
 *
 * @param {jQuery} rootElem - The root element for inline message.
 * @param {string} newContent - The new content to display.
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
oj.InlineMessagingStrategy.prototype._determineAnimation = function(rootElem, newContent)
{
  var action;
  var effect;
  var parsedEffect;
  var defaults = this._getDefaultAnimation();
  if (defaults)
  {
    var oldContent = rootElem[0].innerHTML;// @HTMLUpdateOK
    var oldHeight = rootElem.outerHeight();
    var newHeight;
    
    rootElem[0].innerHTML = newContent;// @HTMLUpdateOK
    newHeight = rootElem.outerHeight();
    rootElem[0].innerHTML = oldContent;// @HTMLUpdateOK

    action = newHeight > oldHeight ? 'open' : 'close';
    effect = defaults[action];

    if (effect)
    {
      parsedEffect = this._replaceAnimationOptions(effect, {'#oldHeight': oldHeight + 'px',
                                                            '#newHeight': newHeight + 'px'});
    }
  }
  
  return {action: action,
          effect: parsedEffect};
};

/**
 * Set busy state before opening or closing inline message.
 *
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
oj.InlineMessagingStrategy.prototype._setBusyState = function()
{
  // Set a page-level busy state if not already set  
  if (!this._resolveBusyState)
  {
    var component = this.GetComponent();
    var jElem = component ? component.element : null;
    var domElem = jElem ? jElem[0] : null;
    var busyContext = oj.Context.getContext(domElem).getBusyContext();
    var description = 'The page is waiting for inline message ';
    
    if (domElem && domElem.id)
    {
      description += 'for "' + domElem.id + '" ';
    }
    description += 'to open/close';

    this._resolveBusyState = busyContext.addBusyState({'description': description});
  }  
};

/**
 * Clear busy state after opening or closing inline message.
 *
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
oj.InlineMessagingStrategy.prototype._clearBusyState = function()
{
  if (this._resolveBusyState)
  {
    this._resolveBusyState();
    this._resolveBusyState = null;
  }
};

/**
 * Queue up inline messaging open/close actions so that it only animate once
 * for multiple updates within the same tick.
 *
 * @param {string} contentToShow - The messaging content to show.
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
oj.InlineMessagingStrategy.prototype._queueAction = function(contentToShow)
{
  var self = this;
  var rootElem = this.$messagingContentRoot;

  this._setBusyState();
  
  // If there is a pending timeout, clear it and set a new one so that only the
  // last animation queued within the same tick will be run.  Otherwise we will
  // end up with too many animation since the messaging framework keeps clearing
  // and updating the message display during validation, etc.
  if (this._timeoutId)
  {
    clearTimeout(this._timeoutId);
  }

  this._timeoutId = setTimeout(function() {
    self._timeoutId = null;
    
    // Make sure $messagingContentRoot is still there.  It could have been
    // removed by the time the timeout function is run.
    if (rootElem && rootElem[0])
    {
      // Parse and substitute runtime values in animation options
      var actionEffect = self._determineAnimation(rootElem, contentToShow);
      var action = actionEffect.action;
      var effect = actionEffect.effect;
      
      // Set the new content first if we're opening
      if (action == 'open')
      {
        rootElem[0].innerHTML = contentToShow;// @HTMLUpdateOK
      }

      // Invoke animation
      oj.AnimationUtils.startAnimation(rootElem[0], 'inline-' + action, effect, self.GetComponent()).then(function() {
        // Set the new content last if we're closing
        if (action == 'close')
        {
          rootElem[0].innerHTML = contentToShow;// @HTMLUpdateOK
        }

        // Clear busy state when animation end
        self._clearBusyState();        
      });
    }
    else
    {
      // Just clear the busy state if $messagingContentRoot no longer exists
      self._clearBusyState();
    }
  }, 0);
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

  if (this.$messagingContentRoot && this.$messagingContentRoot[0])
  {
    // Only enable default animation for custom elements so that automated tests
    // for legacy components are not affected    
    if (this.GetComponent()._IsCustomElement())
    {
      // This may be called multiple times within the same event cycle because the
      // old message is cleared before validation and the message is
      // reconstructed.  Since we now have animation for inline message, we don't 
      // want to update the DOM every single time.  Instead we queue up the 
      // updates and will only show the last one within the same event cyle.    
      this._queueAction(contentToShow);
    }
    else
    {
      // Legacy components don't have animation so just update the DOM
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
    }
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
    events: {open: "focusin mouseenter", close: "mouseleave"}
  },
  "ojSlider":
  {
    position: 'launcher',
    events: {open: "focusin mouseenter", close: "mouseleave"}
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
  function doClose(resolve)
  {
    if (this._isPopupInitialized())
    {
      if (resolve)
      {
        // Add an event listener to resolve the promise
        this._setActionResolver(this.$messagingContentRoot, "close", resolve);
      }
          
      this.$messagingContentRoot.ojPopup("close");

      // Just return if we call ojPopup close.  The promise will be resolved
      // by the ojclose event listener.
      return;
    }
    
    if (resolve)
    {
      // Resolve the promise immediately if we didn't call ojPopup close
      resolve(true);
    }
  }
  
  this._queueAction(doClose.bind(this));
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
 * Add listeners for animation events.
 * We use this to delegate animation events to the editableValue component since
 * the original events are triggered on the popup, which is created internally 
 * and the application cannot bind listeners to it.  By delegating the events, 
 * application can bind the listeners to the component.
 * 
 * @param {jQuery} messagingContentRoot - The jQuery object for the messaging root node
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._addAnimateEventListeners = function(messagingContentRoot)
{
  var delegateEvent = function(newEventType, event, ui) {
    var component = this.GetComponent();
    if (component && component._trigger)
    {
      // always stop propagation if we have a component to delegate to
      event.stopPropagation();

      // prevent default only if the component handler says so, as indicated by
      // a return value of false.
      if (!component._trigger(newEventType, null, ui))
      {
        event.preventDefault();
      }
    }
  };

  // Add animation event listeners to delegate the events to the component
  messagingContentRoot.on('ojanimatestart.notewindow', delegateEvent.bind(this, 'animateStart'));
  messagingContentRoot.on('ojanimateend.notewindow', delegateEvent.bind(this, 'animateEnd'));
};

/**
 * Remove listeners for animation events.
 * 
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._removeAnimateEventListeners = function(messagingContentRoot)
{
  messagingContentRoot.off('ojanimatestart.notewindow');
  messagingContentRoot.off('ojanimateend.notewindow');
};

/**
 * Set busy state on the component that invokes the notewindow.
 * 
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._setBusyState = function(eventType)
{
  var component = this.GetComponent();
  var jElem = component ? component.element : null;
  var domElem = jElem ? jElem[0] : null;
  var busyContext = oj.Context.getContext(domElem).getBusyContext();
  var description = 'The page is waiting for note window ';
  
  if (domElem && domElem.id)
  {
    description += 'for "' + domElem.id + '" ';
  }
  description += 'to ' + eventType;

  return busyContext.addBusyState({'description': description});
};

/**
 * Set an event listener to resolve promise when popup open/close action ends.
 * 
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._setActionResolver = function(messagingContentRoot, eventType, resolvePromise)
{
  var animationOption;

  // Disable animation if there are other queued actions.  Otherwise we will end
  // up with too many animation since the messaging framework keeps clearing and
  // updating the message display during validation, etc.
  if (this._actionCount > 1)
  {
    // Remember the original animation so that we can restore it later
    animationOption = messagingContentRoot.ojPopup("option", "animation");
    messagingContentRoot.ojPopup("option", "animation", null);
  }

  // Add a busy state for the component.  Even though ojpopup add busy state,
  // it is in the scope of the popup element.
  var resolveBusyState = this._setBusyState(eventType);

  // Add an one-time listener to resolve the promise
  messagingContentRoot.one('oj' + eventType, function() {
    // Restore any saved animation option
    if (animationOption)
    {
      messagingContentRoot.ojPopup("option", "animation", animationOption);
    }
    
    resolveBusyState();
    resolvePromise(true);
  });
};

/**
 * Queue up popup open and close actions so that they are executed in the
 * correct order.
 *
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
oj.PopupMessagingStrategy.prototype._queueAction = function(task)
{
  if (this.GetComponent()._IsCustomElement())
  {
    // Queue up the action for custom elements to avoid animation overlapping each other
    var self = this;

    var createActionPromise = function(task)
    {
      var promise = new Promise(task);
      promise.then(function() {
        --self._actionCount;
      });
      return promise;
    };
    
    if (!this._actionCount)
    {
      // If there is no action in progress, create a new promise directly instead
      // of chaining to any resolved promise to avoid an extra wait state.
      this._actionCount = 1;
      this._actionPromise = createActionPromise(task);
    }
    else
    {
      ++this._actionCount;
      this._actionPromise = this._actionPromise.then(function() {
        return createActionPromise(task);
      });
    }
  }
  else
  {
    // Invoke the action immediately for legacy components since there is no animation
    task(null);
  }
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
  function doOpen(resolve)
  {
    var domNode;
    var latestContent;
    var $launcher;

    
    if (this._canOpenPopup())
    {

      latestContent = this._buildPopupHtml();
      if (!oj.StringUtils.isEmptyOrUndefined(latestContent))
      {
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

          if (resolve)
          {
            // Add an event listener to resolve the promise
            this._setActionResolver(messagingContentRoot, "open", resolve);
          }
          
          messagingContentRoot.ojPopup("open", $launcher);
          
          // Just return if we call ojPopup open.  The promise will be resolved
          // by the ojopen event listener.
          return;
        }
        else if (isPopupOpen)
        {
          messagingContentRoot.ojPopup("refresh");
        }
      }
    }
    
    if (resolve)
    {
      // Resolve the promise immediately if we didn't call ojPopup open
      resolve(true);
    }
  }
  
  this._queueAction(doOpen.bind(this));
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
  popup.ojPopup("option", "beforeClose", this._popupBeforeCloseCallback.bind(this));
  popup.ojPopup("option", "close", this._popupCloseCallback.bind(this));
  popup.ojPopup("option", "open", this._popupOpenCallback.bind(this));
  
  // Use default animation only for custom elements
  if (this.GetComponent()._IsCustomElement())
  {
    // Get the default animation
    var defaultAnimations = (oj.ThemeUtils.parseJSONFromFontFamily('oj-messaging-popup-option-defaults') || {})["animation"];
    defaultAnimations["actionPrefix"] = "notewindow";
    popup.ojPopup("option", "animation", defaultAnimations);
  
    this._addAnimateEventListeners(popup);
  }
  else
  {
    popup.ojPopup("option", "animation", null);
  }

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
 * Popup beforeClose event listener that will add busy state to the component
 * @param {jQuery.event=} event
 * @memberof! oj.PopupMessagingStrategy
 * @private
 */
oj.PopupMessagingStrategy.prototype._popupBeforeCloseCallback = function (event)
{
  this._resolveBusyState = this._setBusyState('close');
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
  
  this._removeAnimateEventListeners(target);

  if (oj.Components.isComponentInitialized(target, "ojPopup"))
  {
    target.ojPopup("option", "autoDismiss", "none");
    target.ojPopup("option", "open", null);
    target.ojPopup("option", "close", null);
    target.ojPopup("option", "beforeClose", null);
  }

  // Check that the launcher is still there when removing listeners  
  if (jqLauncher && jqLauncher[0])
  {
    jqLauncher[0].removeEventListener("click", this._eatChangeAndClickOnPress, true);
    jqLauncher[0].removeEventListener("change", this._eatChangeAndClickOnPress, true);
  }
    
  this.$messagingContentRoot = null;
  this._inPressEvent = null;

  popupContent = $(oj.PopupMessagingStrategyPoolUtils.getPopupContentNode(target));
  popupContent.empty();
  
  if (this._resolveBusyState)
  {
    this._resolveBusyState();
    this._resolveBusyState = null;
  }
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

  return jTitleDom ? jTitleDom.get(0).outerHTML : "";// @HTMLUpdateOK
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

  return jSeparatorDom ? jSeparatorDom.get(0).outerHTML : "";// @HTMLUpdateOK
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
    $msgContent.append($msgDetail);// @HTMLUpdateOK
  }

  $msgDom.append($msgContent); // @HTMLUpdateOK

  return $msgDom ? $msgDom.get(0).outerHTML : "";// @HTMLUpdateOK
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

(function() {
var editableValueMeta = {
  "properties": {
    "describedBy": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean"
    },
    "displayOptions": {
      "type": "Object",
      "properties": {
        "converterHint": {
          "type": "string"
        },
        "helpInstruction": {
          "type": "string"
        },
        "messages": {
          "type": "string"
        },
        "validatorHint": {
          "type": "string"
        }
      }
    },
    "help": {
      "type": "Object<string, string>",
      "properties": {
        "instruction": {
          "type": "string"
        }
      }
    }, 
    "helpHints": {
      "type": "Object",
      "properties": {
        "definition": {
          "type": "string"
         },
         "source": {
           "type": "string"
         }
       }
    },
    "labelHint": {
      "type": "string"
    },
    "messagesCustom": {
      "type": "Array",
      "writeback": true
    },
    "valid": {
      "type": "string",
      "writeback": true,
      "readOnly": true,
      "enumValues": ["valid", "invalidShown", "invalidHidden","pending"]
    },
    "value": {
      "type": "Object",
      "writeback": true
    }
  },
  "methods": {
    "reset": {},
    "showMessages": {}
  },
  "events": {
    "animateStart": {},
    "animateEnd": {}
  },
  "extension": {
    _WIDGET_NAME: "editableValue"
  }
};
oj.CustomElementBridge.registerMetadata('editableValue', 'baseComponent', editableValueMeta);
})();

});