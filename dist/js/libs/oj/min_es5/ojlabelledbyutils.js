/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojlabel"],function(e){"use strict";
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */var t={CUSTOM_LABEL_ELEMENT_ID:"|label",_labelledByUpdatedForSet:function(e,a,d,i){if((a||d)&&this._IsCustomElement()){var l={callbackAdd:function(e,a,d){var i=t.CUSTOM_LABEL_ELEMENT_ID;t._addAriaLabelledBy(e,a+i),t._addSetIdOnLabel(a,d.componentId)},callbackRemove:function(e,a,d){var i=t.CUSTOM_LABEL_ELEMENT_ID;t._removeAriaLabelledBy(e,a+i),t._removeSetIdOnLabel(a,d.componentId)},args:{componentId:e}};t._byUpdatedTemplate(a,d,i,l)}},_describedByUpdated:function(e,a){var d=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this._GetContentElement();if(e||a){var i=function(e,a){t._addRemoveAriaBy(e,"aria-describedby",a,!0)},l=function(e,a){t._addRemoveAriaBy(e,"aria-describedby",a,!1)},n={callbackAdd:i,callbackRemove:l};t._byUpdatedTemplate(e,a,d,n)}},_byUpdatedTemplate:function(e,t,a,d){var i,l,n,r;if(!e&&t)for(l=t.split(/\s+/),r=0;r<l.length;r++)i=l[r],d.callbackAdd.call(this,a,i,d.args);else if(e&&!t)for(l=e.split(/\s+/),r=0;r<l.length;r++)i=l[r],d.callbackRemove.call(this,a,i,d.args);else if(e&&t){for(l=t.split(/\s+/),n=e.split(/\s+/),r=0;r<n.length;r++)i=n[r],-1===t.indexOf(i)&&d.callbackRemove.call(this,a,i,d.args);for(r=0;r<l.length;r++)i=l[r],-1===e.indexOf(i)&&d.callbackAdd.call(this,a,i,d.args)}},_addAriaLabelledBy:function(e,a){t._addRemoveAriaBy(e,"aria-labelledby",a,!0)},_removeAriaLabelledBy:function(e,a){t._addRemoveAriaBy(e,"aria-labelledby",a,!1)},_addSetIdOnLabel:function(e,t){var a=document.getElementById(e);a&&(a.getAttribute("data-oj-set-id")||a.setAttribute("data-oj-set-id",t))},_removeSetIdOnLabel:function(e){var t=document.getElementById(e);t&&t.getAttribute("data-oj-set-id")&&t.removeAttribute("data-oj-set-id")},_addRemoveAriaBy:function(e,t,a,d){e.each(function(){var e=this.getAttribute(t),i=e?e.split(/\s+/):[],l=i.indexOf(a);d&&-1===l?i.push(a):d||-1===l||i.splice(l,1);var n=i.join(" ").trim();n?this.setAttribute(t,n):this.removeAttribute(t)})}};return t});
//# sourceMappingURL=ojlabelledbyutils.js.map