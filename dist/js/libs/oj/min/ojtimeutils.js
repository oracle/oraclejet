/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore","ojs/ojdvt-base"],function(a){a.tt=function(){};o_("TimeUtils",a.tt,a);a.tt.getPosition=function(a,c,b,d){a=(new Date(a)).getTime();c=(new Date(c)).getTime();b=(new Date(b)).getTime();a=(a-c)*d;c=b-c;return 0==a||0==c?0:a/c};o_("TimeUtils.getPosition",a.tt.getPosition,a);a.tt.O2a=function(g,c,b,d,e){g=(new Date(g)).getTime();c=(new Date(c)).getTime();b=(new Date(b)).getTime();d=(new Date(d)).getTime();g=a.tt.getPosition(g,b,d,e);return a.tt.getPosition(c,
b,d,e)-g};o_("TimeUtils.getLength",a.tt.O2a,a);a.tt.getDate=function(a,c,b,d){c=(new Date(c)).getTime();b=(new Date(b)).getTime();a*=b-c;return 0==a||0==d?c:a/d+c};o_("TimeUtils.getDate",a.tt.getDate,a)});