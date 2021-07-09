/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["./impl/fileSystemPersistenceStore"],(function(e){"use strict";return{createPersistenceStore:function(n,t){return function(n,t){var r=new e(n);return r.Init(t).then((function(){return r}))}(n,t)}}}));