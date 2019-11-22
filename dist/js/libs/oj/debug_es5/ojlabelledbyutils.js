/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojlabel'], 
  /*        
    * @param {Object} oj         
    * @param {jQuery} $        
  */
function(oj, $)
{
  "use strict";


/**
 * @class oj.LabelledByUtils
 * @classdesc JET Labelled Component Utils
 * @export
 * @since 7.1.0
 * @hideconstructor
 * @ignore
 *
 */
var LabelledByUtils = {}; // S T A T I C    V A R S

/**
* String used in the label element's id for custom &lt;oj-label>
* @const
* @ignore
* @type {string}
*/

LabelledByUtils.CUSTOM_LABEL_ELEMENT_ID = '|label';
/**
 * For custom element only. Only called from the 'set' components, like oj-radioset.
 * When labelledBy changes, we need to update the aria-labelledby attribute.
 * Note: If labelledBy changes from a value to null, we should still remove the oldValue from
 * aria-labelledby.
 * Note: This way isn't perfect since it assumes the internal label's id is oj-label id
 * + '|label'. Used by oj-radioset, oj-checkboxset, oj-color*, oj-buttonset
 * @param {Element} rootElement the root element, like oj-radioset. It must have an id.
 * @param {string|null} originalValue the old value of the labelledBy option
 * @param {string|null} value the new value of the labelledBy option.
 * @param {jQuery} $elems jquery Object containing the node(s) to add/remove aria-labelledby to.
 * @private
 * @ignore
 */

LabelledByUtils._updateLabelledBy = function (rootElement, originalValue, value, $elems) {
  var suffix = LabelledByUtils.CUSTOM_LABEL_ELEMENT_ID;
  var byId;
  var tokens;
  var originalTokens;
  var i;

  if (!this._IsCustomElement()) {
    return;
  } // originalValue is the 'old' value of labelledBy and value is the 'new' value of
  // labelledBy. The most likely use case if originalValue is null. Check for that first.


  if (!originalValue && value) {
    // value can be a space-separated list of ids, so we need to split it and add the suffix
    // to each one and put it back into a space-separated list.
    // same thing as above, but for 'value'.
    tokens = value.split(/\s+/);

    for (i = 0; i < tokens.length; i++) {
      byId = tokens[i]; // this adds one id at a time to aria-labelledBy attribute. It
      // makes sure there are not duplicates.

      LabelledByUtils._addAriaLabelledBy($elems, byId + suffix); // this sets data-oj-set-id on oj-label which in turn sets
      // described-by on oj-radioset or other 'set' form component.


      LabelledByUtils._addSetIdOnLabel(byId, rootElement.id);
    }
  } else if (originalValue && !value) {
    // if  original value has a value and value doesn't, remove all
    // value can be a space-separated list of ids, so we need to split it and add the suffix
    // to each one and put it back into a space-separated list.
    // same thing as above, but for 'value'.
    tokens = originalValue.split(/\s+/);

    for (i = 0; i < tokens.length; i++) {
      byId = tokens[i]; // this adds/removes one id at a time to aria-labelledBy attribute. It
      // makes sure there are not duplicates.

      LabelledByUtils._removeAriaLabelledBy($elems, byId + suffix);

      LabelledByUtils._removeDescribedByWithPrefix(rootElement, byId + '|');
    }
  } else if (originalValue && value) {
    // if both original value and value have values, then we should figure out which are the
    // same and ignore them, and remove the ones from original value that are unique and
    // add the ones for value that are unique.
    tokens = value.split(/\s+/);
    originalTokens = originalValue.split(/\s+/);

    for (i = 0; i < originalTokens.length; i++) {
      byId = originalTokens[i];

      if (value.indexOf(byId) === -1) {
        // not in both, so remove it (add the suffix)
        LabelledByUtils._removeAriaLabelledBy($elems, byId + suffix);

        LabelledByUtils._removeDescribedByWithPrefix(rootElement, byId + '|');
      }
    }

    for (i = 0; i < tokens.length; i++) {
      byId = tokens[i];

      if (originalValue.indexOf(byId) === -1) {
        // not in both, so add it (add the suffix)
        LabelledByUtils._addAriaLabelledBy($elems, byId + suffix);

        LabelledByUtils._addSetIdOnLabel(byId, rootElement.id);
      }
    }
  }
};
/** .
 * Add the id to the widget's aria-labelledby attribute.
 * @param {jQuery} $elems the jquery element(s) that represents the node on which aria-labelledby is
 * @param {string} id id to add to aria-labelledby
 * @private
 * @ignore
 */


LabelledByUtils._addAriaLabelledBy = function ($elems, id) {
  var index;
  $elems.each(function () {
    var labelledBy = this.getAttribute('aria-labelledby');
    var tokens;
    tokens = labelledBy ? labelledBy.split(/\s+/) : []; // Get index that id is in the tokens, if at all.

    index = tokens.indexOf(id); // add id if it isn't already there

    if (index === -1) {
      tokens.push(id);
    }

    labelledBy = tokens.join(' ').trim();

    if (labelledBy == null) {
      this.removeAttribute('aria-labelledBy');
    } else {
      this.setAttribute('aria-labelledBy', labelledBy);
    }
  });
};
/** .
 * Add 'data-oj-set-id' on oj-label, which in turn will
 * set described-by back on the Form component.
 * @param {string} ojLabelId the oj-label element's id.
 * @param {string} formComponentId the id of the form component
 * @private
 * @ignore
 */


LabelledByUtils._addSetIdOnLabel = function (ojLabelId, formComponentId) {
  var ojLabel = document.getElementById(ojLabelId);

  if (ojLabel && !ojLabel.getAttribute('data-oj-set-id')) {
    ojLabel.setAttribute('data-oj-set-id', formComponentId);
  }
};
/**
 * Remove the id from the widget's aria-labelledby attribute.
 * @param {jQuery} $elems the jquery element(s) that represents the node on which aria-labelledby is
 * @param {string} id id to remove from aria-labelledby
 * @private
 * @ignore
 */


LabelledByUtils._removeAriaLabelledBy = function ($elems, id) {
  var labelledBy;
  $elems.each(function () {
    var index;
    var tokens; // get aria-labelledby that is on the element(s)

    labelledBy = this.getAttribute('aria-labelledby'); // split into tokens

    tokens = labelledBy ? labelledBy.split(/\s+/) : []; // Get index that id is in the tokens, if at all.

    index = tokens.indexOf(id); // remove that from the tokens array

    if (index !== -1) {
      tokens.splice(index, 1);
    } // join the tokens back together and trim whitespace


    labelledBy = tokens.join(' ').trim();

    if (labelledBy) {
      this.setAttribute('aria-labelledby', labelledBy);
    } else {
      this.removeAttribute('aria-labelledby');
    }
  });
};
/**
 * Remove the id that starts with the prefix from the element's described-by attribute.
 * @param {Element} element the element, like oj-radioset
 * @param {string} prefix prefix of the described-by value to remove.
 * @private
 * @ignore
 */


LabelledByUtils._removeDescribedByWithPrefix = function (element, prefix) {
  var describedBy;
  var tokens;
  describedBy = element.getAttribute('described-by'); // split into tokens

  tokens = describedBy ? describedBy.split(/\s+/) : [];
  tokens = tokens.filter(function (item) {
    return item.indexOf(prefix) === -1;
  }); // join the tokens back together and trim whitespace

  describedBy = tokens.join(' ').trim();

  if (describedBy) {
    element.setAttribute('described-by', describedBy);
  } else {
    element.removeAttribute('described-by');
  }
};
/** For custom element only.
 * When describedBy changes, we need to update the aria-described attribute.
 * @param {string|null} originalValue the old value of the labelledBy option
 * @param {string|null} value the new value of the labelledBy option.
 * @private
 * @ignore
 */


LabelledByUtils._updateDescribedBy = function (originalValue, value) {
  var byId;
  var tokens;
  var originalTokens;
  var i;

  if (!this._IsCustomElement()) {
    return;
  } // originalValue is the 'old' value of describedBy and value is the 'new' value of
  // describedBy. The most likely use case if originalValue is null. Check for that first.


  if (!originalValue && value) {
    // value can be a space-separated list of ids, so we need to split it
    // to each one and put it back into a space-separated list.
    // same thing as above, but for 'value'.
    tokens = value.split(/\s+/);

    for (i = 0; i < tokens.length; i++) {
      byId = tokens[i]; // this adds one id at a time to aria-labelledBy attribute. It
      // makes sure there are not duplicates.

      this._addAriaDescribedBy(byId);
    }
  } else if (originalValue && !value) {
    // if  original value has a value and value doesn't, remove all
    // value can be a space-separated list of ids, so we need to split it
    // to each one and put it back into a space-separated list.
    // same thing as above, but for 'value'.
    tokens = originalValue.split(/\s+/);

    for (i = 0; i < tokens.length; i++) {
      byId = tokens[i]; // this adds/removes one id at a time to aria-labelledBy attribute. It
      // makes sure there are not duplicates.

      this._removeAriaDescribedBy(byId);
    }
  } else if (originalValue && value) {
    // if both original value and value have values, then we should figure out which are the
    // same and ignore them, and remove the ones from original value that are unique and
    // add the ones for value that are unique.
    tokens = value.split(/\s+/);
    originalTokens = originalValue.split(/\s+/);

    for (i = 0; i < originalTokens.length; i++) {
      byId = originalTokens[i];

      if (value.indexOf(byId) === -1) {
        // not in both, so remove it
        this._removeAriaDescribedBy(byId);
      }
    }

    for (i = 0; i < tokens.length; i++) {
      byId = tokens[i];

      if (originalValue.indexOf(byId) === -1) {
        // not in both, so add it
        this._addAriaDescribedBy(byId);
      }
    }
  }
};
/**
 * Add the aria-describedby on the content element(s) if it isn't already there.
 *
 * @param {string} id the id for aria-describedby
 * @private
 * @ignore
 *
 */


LabelledByUtils._addAriaDescribedBy = function (id) {
  var contentElements = this._GetContentElement();

  var index;
  contentElements.each(function () {
    var describedby = this.getAttribute('aria-describedby');
    var tokens;
    tokens = describedby ? describedby.split(/\s+/) : []; // Get index that id is in the tokens, if at all.

    index = tokens.indexOf(id); // add id if it isn't already there

    if (index === -1) {
      tokens.push(id);
    }

    describedby = tokens.join(' ').trim();

    if (describedby == null) {
      this.removeAttribute('aria-describedby');
    } else {
      this.setAttribute('aria-describedby', describedby);
    }
  });
};
/**
 * Remove the aria-describedby from the content element(s).
 *
 * @param {string} id the id for aria-describedby
 * @private
 * @ignore
 *
 */


LabelledByUtils._removeAriaDescribedBy = function (id) {
  var contentElements = this._GetContentElement();

  contentElements.each(function () {
    var describedby;
    var index;
    var tokens; // get aria-describedby that is on the content element(s)

    describedby = this.getAttribute('aria-describedby'); // split into tokens

    tokens = describedby ? describedby.split(/\s+/) : []; // Get index that id is in the tokens, if at all.

    index = tokens.indexOf(id); // remove that from the tokens array

    if (index !== -1) {
      tokens.splice(index, 1);
    } // join the tokens back together and trim whitespace


    describedby = tokens.join(' ').trim();

    if (describedby) {
      this.setAttribute('aria-describedby', describedby);
    } else {
      this.removeAttribute('aria-describedby');
    }
  });
};

  ;return LabelledByUtils;
});