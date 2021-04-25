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
var a={getThemeName:function(){return(a.parseJSONFromFontFamily("oj-theme-json")||{}).name},getThemeTargetPlatform:function(){return(a.parseJSONFromFontFamily("oj-theme-json")||{}).targetPlatform},clearCache:function(){a._cache=null},parseJSONFromFontFamily:function(e){null==a._cache&&(a._cache={},a._null_cache_value={},a._headfontstring=window.getComputedStyle(document.head).getPropertyValue("font-family"));var t=a._cache[e];if(t===a._null_cache_value)return null;if(null!=t)return t;if("undefined"==typeof document)return null;var n=document.createElement("meta");n.className=e,document.head.appendChild(n);var o=window.getComputedStyle(n).getPropertyValue("font-family");if(null!=o)if(o===a._headfontstring)r.warn("parseJSONFromFontFamily: When the selector ",e," is applied the font-family read off the dom element is ",o,". The parent dom elment has the same font-family value."," This is interpreted to mean that no value was sent down for selector ",e,". Null will be returned.");else{var l=o.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g,"");if(l)try{t=JSON.parse(l)}catch(a){var i=l.indexOf(","),m=!1;if(i>-1){l=l.substring(i+2);try{t=JSON.parse(l),m=!0}catch(e){}}if(!1===m)throw r.error("Error parsing json for selector "+e+".\nString being parsed is "+l+". Error is:\n",a),document.head.removeChild(n),a}}return document.head.removeChild(n),a._cache[e]=null==t?a._null_cache_value:t,t},verifyThemeVersion:function(){}},n=a.clearCache,o=a.getThemeName,l=a.getThemeTargetPlatform,i=a.parseJSONFromFontFamily,m=a.verifyThemeVersion;e.clearCache=n,e.getThemeName=o,e.getThemeTargetPlatform=l,e.parseJSONFromFontFamily=i,e.verifyThemeVersion=m,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojthemeutils.js.map