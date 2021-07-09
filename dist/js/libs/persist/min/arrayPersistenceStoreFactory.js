/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["./impl/arrayPersistenceStore"],(function(e){"use strict";return{createPersistenceStore:function(n,r){return function(n,r){var t=new e(n);return t.Init(r).then((function(){return t}))}(n,r)}}}));