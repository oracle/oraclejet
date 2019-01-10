/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore"],function(n){function t(){}return t.getExpressionInfo=function(t){return n.__AttributeUtils.getExpressionInfo(t)},t.createGenericExpressionEvaluator=function(n){return new Function("context","with(context){return "+n+";}")},t});