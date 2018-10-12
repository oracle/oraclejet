/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","ojs/ojkoshared"],function(e){function r(){}return r.registerPreprocessor=function(r,t){e.__KO_CUSTOM_BINDING_PROVIDER_INSTANCE.registerPreprocessor(r,t)},r.createBindingExpressionEvaluator=function(e){return new Function("$context","with($context){with($data||{}){return "+e+";}}")},r});