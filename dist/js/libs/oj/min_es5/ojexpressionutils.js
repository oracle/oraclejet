/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojcore","ojs/ojconfig"],function(t,n){"use strict";function e(){}return e.getExpressionInfo=function(n){return t.__AttributeUtils.getExpressionInfo(n)},e.createGenericExpressionEvaluator=function(t){var e=n.getExpressionEvaluator();if(e){var r=e.createEvaluator(t).evaluate;return function(t){return r([t])}}return new Function("context","with(context){return "+t+";}")},e});