/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define([],function(){"use strict";var e;return{whenDocumentReady:function(){return e||(e="loading"===document.readyState?new Promise(function(e){var n=function(){document.removeEventListener("DOMContentLoaded",n),e()};document.addEventListener("DOMContentLoaded",n)}):Promise.resolve()),e}}});