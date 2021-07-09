/*! jQuery UI - v1.12.1 - 2016-09-15
* http://jqueryui.com
* Copyright jQuery Foundation and other contributors; Licensed  */
!function(e){"function"==typeof define&&define.amd?define(["jquery","./version","./focusable"],e):e(jQuery)}(function(e){return e.extend(e.expr[":"],{tabbable:function(n){var t=e.attr(n,"tabindex"),u=null!=t;return(!u||t>=0)&&e.ui.focusable(n,u)}})});