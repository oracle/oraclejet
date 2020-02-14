/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(e,o){"use strict";var t={setup:function(t){e.DomUtils.makeFocusable({element:o(t),applyHighlight:!0}),t.addEventListener("keydown",function(e){13===e.keyCode&&t.classList.add("oj-active")}),t.addEventListener("keyup",function(e){13===e.keyCode&&(t.classList.remove("oj-active"),t.click())})}};return t});