/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojs/ojlogger"],function(e,t,r){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
   * @license
   * Copyright (c) 2015 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var a={getThemeName:function(){return(a.parseJSONFromFontFamily("oj-theme-json")||{}).name},getThemeTargetPlatform:function(){return(a.parseJSONFromFontFamily("oj-theme-json")||{}).targetPlatform},clearCache:function(){this._cache=null},parseJSONFromFontFamily:function(e){null==this._cache&&(this._cache={},this._null_cache_value={},this._headfontstring=window.getComputedStyle(document.head).getPropertyValue("font-family"));var t=this._cache[e];if(t===this._null_cache_value)return null;if(null!=t)return t;if("undefined"==typeof document)return null;var a=document.createElement("meta");a.className=e,document.head.appendChild(a);var n=window.getComputedStyle(a).getPropertyValue("font-family");if(null!=n)if(n===this._headfontstring)r.warn("parseJSONFromFontFamily: When the selector ",e," is applied the font-family read off the dom element is ",n,". The parent dom elment has the same font-family value."," This is interpreted to mean that no value was sent down for selector ",e,". Null will be returned.");else{var o=n.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g,"");if(o)try{t=JSON.parse(o)}catch(n){var l=o.indexOf(","),i=!1;if(l>-1){o=o.substring(l+2);try{t=JSON.parse(o),i=!0}catch(e){}}if(!1===i)throw r.error("Error parsing json for selector "+e+".\nString being parsed is "+o+". Error is:\n",n),document.head.removeChild(a),n}}return document.head.removeChild(a),this._cache[e]=null==t?this._null_cache_value:t,t}},n=a.clearCache.bind(a),o=a.getThemeName.bind(a),l=a.getThemeTargetPlatform.bind(a),i=a.parseJSONFromFontFamily.bind(a);e.clearCache=n,e.getThemeName=o,e.getThemeTargetPlatform=l,e.parseJSONFromFontFamily=i,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojthemeutils.js.map