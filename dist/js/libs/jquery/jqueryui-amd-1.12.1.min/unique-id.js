/*! jQuery UI - v1.12.1 - 2016-09-15
* http://jqueryui.com
* Copyright jQuery Foundation and other contributors; Licensed  */
!function(i){"function"==typeof define&&define.amd?define(["jquery","./version"],i):i(jQuery)}(function(i){return i.fn.extend({uniqueId:function(){var i=0;return function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++i)})}}(),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&i(this).removeAttr("id")})}})});