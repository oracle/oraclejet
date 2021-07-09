/*! jQuery UI - v1.12.1 - 2016-09-15
* http://jqueryui.com
* Copyright jQuery Foundation and other contributors; Licensed  */
!function(e){"function"==typeof define&&define.amd?define(["jquery","./version"],e):e(jQuery)}(function(e){return e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(n){return function(t){return!!e.data(t,n)}}):function(n,t,r){return!!e.data(n,r[3])}})});