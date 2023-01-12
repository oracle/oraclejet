/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import 'ojs/ojlabel';

/**
 * @class oj.LabelledByUtils
 * @classdesc JET Labelled Component Utils
 * @export
 * @since 7.1.0
 * @hideconstructor
 * @ignore
 *
 */
const LabelledByUtils = {};

// S T A T I C    V A R S

/**
 * String used in the label element's id for custom &lt;oj-label>
 * @const
 * @ignore
 * @type {string}
 */
LabelledByUtils.CUSTOM_LABEL_ELEMENT_ID = '|label';

/**
 * On form component initialization and when form component's 'labelledBy' property changes,
 * call this function to update aria-labelledby on the rootElement of the 'set' component
 * and update aria-describedby on the inputs when labelledBy changes.
 * For custom element only.
 * Only call for the 'set' components, like oj-radioset, oj-color-palette.
 *
 * Background of how oj-label and 'set' components are linked together for accessibility:
 * --------------------------------------------------------------------------------------
 * An application developer links oj-label with a 'set' component like this:
 * <oj-label id='foo'> to <oj-checkboxset labelled-by='foo'>
 *
 * We render the aria and data-oj- attributes on the correct dom like this:
 * <oj-label id='foo' data-oj-set-id='cb'><span id="foo|label_helpIcon"<label id='foo|label'>
 * <oj-checkboxset id='cb' labelled-by='foo' aria-labelledby='foo|label' described-by='foo|label_helpIcon'>
 * <input aria-describedby='foo|label_helpIcon'>
 *
 * In steps:
 * 1. App developer adds labelled-by on its set form component to link them
 * 2. On init, set form component calls _labelledByUpdatedForSet
 * 2a. this writes labelledBy to aria-labelledby on $focusElem,
 * making sure not to override any existing ids
 * 2b. this writes data-oj-set-id onto oj-label
 * 3. oj-label gets notified of data-oj-set-id change and uses it to find the form component
 * using document.getElementById (we want to avoid dom attribute searches for performance reasons)
 * 4. if it has a required/help icon oj-label writes described-by on the set form component,
 * which in turn calls _describedByUpdated.
 * 4a. writes aria-describedby onto its content element to point
 * to the icon text via _describedByUpdated
 * ---------------------------------------------------------------------------------------
 * Note: input form components are linked to the label via for/id. In that case, oj-label
 * finds the form component with document.getElementById(for), writes labelled-by on the form
 * component which in turn writes data-oj-input-id on the label to let the oj-label know what to
 * write for 'for' on its internal label element.
 * this does not happen here. It happens in EditableValueUtils.
 * @param {string} componentId id of the form component.
 * @param {string|null} originalLabelledBy the old value of the labelledBy option
 * @param {string|null} newLabelledBy the new value of the labelledBy option.
 * @param {jQuery} $focusElem jquery Object containing the node(s)
 * to add/remove aria-labelledby to.
 * For 'set' components this is the root element, not the individual inputs.
 * @private
 * @ignore
 */
LabelledByUtils._labelledByUpdatedForSet = function (
  componentId,
  originalLabelledBy,
  newLabelledBy,
  $focusElem
) {
  if (!originalLabelledBy && !newLabelledBy) {
    // nothing to update. return
    return;
  }

  if (!this._IsCustomElement()) {
    return;
  }
  var _updateLabelledBySetAdd = function ($el, labelId, args) {
    const suffix = LabelledByUtils.CUSTOM_LABEL_ELEMENT_ID;
    LabelledByUtils._addAriaLabelledBy($el, labelId + suffix);
    LabelledByUtils._addSetIdOnLabel(labelId, args.componentId);
  };

  var _updateLabelledBySetRemove = function ($el, labelId, args) {
    const suffix = LabelledByUtils.CUSTOM_LABEL_ELEMENT_ID;
    LabelledByUtils._removeAriaLabelledBy($el, labelId + suffix);
    LabelledByUtils._removeSetIdOnLabel(labelId, args.componentId);
  };

  // callbacks for what needs to happen when the set form component's labelledBy property changes.
  var callbackObj = {
    callbackAdd: _updateLabelledBySetAdd,
    callbackRemove: _updateLabelledBySetRemove,
    args: { componentId: componentId }
  };

  LabelledByUtils._byUpdatedTemplate(originalLabelledBy, newLabelledBy, $focusElem, callbackObj);
};

/**
 * On initialization and when form component's 'describedBy' property changes,
 * call this function to update the aria-describedby attribute on the content elements.
 * oj-label writes described-by onto the form component if it has a help icon or required icon
 * for set components.
 * @param {string|null} originalDescribedBy the old value of the 'describedBy' property.
 * This can be a space-delimited list of ids.
 * @param {string|null} newDescribedBy the new value of the 'describedBy' property. This can
 * be a space-delimited list of ids.
 * @param {jQuery} $focusElem jquery Object containing the node(s)
 * to add/remove aria-describedby to. This is the content element usually.
 * @private
 * @ignore
 */
LabelledByUtils._describedByUpdated = function (
  originalDescribedBy,
  newDescribedBy,
  $focusElem = this._GetContentElement()
) {
  if (!originalDescribedBy && !newDescribedBy) {
    // nothing to update. return
    return;
  }
  var _addAriaDescribedBy = function ($elems, id) {
    LabelledByUtils._addRemoveAriaBy($elems, 'aria-describedby', id, true);
  };
  var _removeAriaDescribedBy = function ($elems, id) {
    LabelledByUtils._addRemoveAriaBy($elems, 'aria-describedby', id, false);
  };

  // callbacks for what needs to happen when the form compnent's describedBy property changes.
  var callbackObj = {
    callbackAdd: _addAriaDescribedBy,
    callbackRemove: _removeAriaDescribedBy
  };

  LabelledByUtils._byUpdatedTemplate(originalDescribedBy, newDescribedBy, $focusElem, callbackObj);
};

// Helper functions only called from within this file.

/**
 * Code that gets called when labelledBy or describedBy is updated that does the parsing
 * of the space-delimited attributes and figures out what ids are added and what ids are removed
 * from the originalValue to the newValue. Then it calls the callbackObj's functions to do the
 * particular work.
 * This function's main purpose is to reduce code duplication in this file in _describedByUpdated
 * and _LabelledByUpdated.
 * @param {string|null} originalValue the old value of the labelledBy/describedBy option
 * @param {string|null} newValue the new value of the labelledBy/describedBy option.
 * @param {jQuery} $focusElem jquery Object containing the node(s)
 * to add/remove aria-* to to.
 * @param {Object} callbackObj with parameters 'callbackAdd', 'callbackRemove' and optional 'args'
 * for additional arguments the callback function may need.
 * @private
 * @ignore
 *
 */
LabelledByUtils._byUpdatedTemplate = function (originalValue, newValue, $focusElem, callbackObj) {
  var byId;
  var tokens;
  var originalTokens;
  var i;

  // The most likely use case if originalLabelledBy is null. Check for that first.
  if (!originalValue && newValue) {
    // newValue can be a space-separated list of ids, so we need to split it and add the suffix
    // to each one and put it back into a space-separated list.
    tokens = newValue.split(/\s+/);
    for (i = 0; i < tokens.length; i++) {
      byId = tokens[i];
      callbackObj.callbackAdd.call(this, $focusElem, byId, callbackObj.args);
    }
  } else if (originalValue && !newValue) {
    // remove all
    tokens = originalValue.split(/\s+/);
    for (i = 0; i < tokens.length; i++) {
      byId = tokens[i];
      callbackObj.callbackRemove.call(this, $focusElem, byId, callbackObj.args);
    }
  } else if (originalValue && newValue) {
    // if both have values, then we should figure out which are the
    // same and ignore them, and remove the ones from originalLabelledBy that are unique and
    // add the ones for newLabelledBy that are unique.
    tokens = newValue.split(/\s+/);
    originalTokens = originalValue.split(/\s+/);
    for (i = 0; i < originalTokens.length; i++) {
      byId = originalTokens[i];
      if (newValue.indexOf(byId) === -1) {
        // not in both, so remove it (add the suffix)
        callbackObj.callbackRemove.call(this, $focusElem, byId, callbackObj.args);
      }
    }
    for (i = 0; i < tokens.length; i++) {
      byId = tokens[i];
      if (originalValue.indexOf(byId) === -1) {
        // not in both, so add it (add the suffix)
        callbackObj.callbackAdd.call(this, $focusElem, byId, callbackObj.args);
      }
    }
  }
};

/**
 * Add the id to the widget's aria-labelledby attribute.
 * @param {jQuery} $elems the jquery element(s) that represents the node on which aria-labelledby is
 * @param {string} id id to add to aria-labelledby
 * @private
 * @ignore
 */
LabelledByUtils._addAriaLabelledBy = function ($elems, id) {
  LabelledByUtils._addRemoveAriaBy($elems, 'aria-labelledby', id, true);
};

/**
 * Remove the id from the widget's aria-labelledby attribute.
 * @param {jQuery} $elems the jquery element(s) that represents the node on which aria-labelledby is
 * @param {string} id id to remove from aria-labelledby
 * @private
 * @ignore
 */
LabelledByUtils._removeAriaLabelledBy = function ($elems, id) {
  LabelledByUtils._addRemoveAriaBy($elems, 'aria-labelledby', id, false);
};

/**
 * Add 'data-oj-set-id' on oj-label, which in turn will
 * set described-by back on the Form component.
 * @param {string} ojLabelId the oj-label element's id.
 * @param {string} formComponentId the id of the form component
 * @private
 * @ignore
 */
LabelledByUtils._addSetIdOnLabel = function (ojLabelId, formComponentId) {
  var ojLabel = document.getElementById(ojLabelId);
  if (ojLabel) {
    if (!ojLabel.getAttribute('data-oj-set-id')) {
      ojLabel.setAttribute('data-oj-set-id', formComponentId);
    }
  }
};

/**
 * Remove 'data-oj-set-id' on oj-label, which in turn will
 * set described-by back on the Form component.
 * @param {string} ojLabelId the oj-label element's id.
 * @param {string} formComponentId the id of the form component
 * @param {boolean} add true if you want to add, false if you want to remove.
 * @private
 * @ignore
 */
LabelledByUtils._removeSetIdOnLabel = function (ojLabelId) {
  var ojLabel = document.getElementById(ojLabelId);
  if (ojLabel) {
    if (ojLabel.getAttribute('data-oj-set-id')) {
      ojLabel.removeAttribute('data-oj-set-id');
    }
  }
};

/**
 * Add or remove the aria- from the element(s).
 * @param {JQuery} $elems jquery Object containing the node(s) to add/remove ariaAttr to.
 * @param {string} ariaAttr aria attribute name 'aria-describedby' or 'aria-labelledby'
 * @param {string} id one id to add or remove to 'aria-describedby' or 'aria-labelledby'
 * @param {boolean} add if true, it will add the id, otherwise it will remove it.
 * @private
 * @ignore
 *
 */
LabelledByUtils._addRemoveAriaBy = function ($elems, ariaAttr, id, add) {
  $elems.each(function () {
    // get ariaAttr that is on the content element(s)
    let ariaAttributeValue = this.getAttribute(ariaAttr);
    // split into tokens
    let tokens = ariaAttributeValue ? ariaAttributeValue.split(/\s+/) : [];
    // Get index that id is in the tokens, if at all.
    let index = tokens.indexOf(id);
    // add id if it isn't already there, remove id if it is there.
    if (add && index === -1) {
      tokens.push(id);
    } else if (!add && index !== -1) {
      // remove that from the tokens array
      tokens.splice(index, 1);
    }
    let newValue = tokens.join(' ').trim();
    if (newValue) {
      this.setAttribute(ariaAttr, newValue); // @HTMLUpdateOK
    } else {
      this.removeAttribute(ariaAttr);
    }
  });
};

export default LabelledByUtils;
