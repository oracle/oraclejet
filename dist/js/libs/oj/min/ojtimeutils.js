/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore","ojs/ojdvt-base"],function(a){a.Zp=function(){};o_("TimeUtils",a.Zp,a);a.Zp.getPosition=function(a,b,c,d){a=(new Date(a)).getTime();b=(new Date(b)).getTime();c=(new Date(c)).getTime();a=(a-b)*d;b=c-b;return 0==a||0==b?0:a/b};o_("TimeUtils.getPosition",a.Zp.getPosition,a);a.Zp.wHa=function(g,b,c,d,e){g=(new Date(g)).getTime();b=(new Date(b)).getTime();c=(new Date(c)).getTime();d=(new Date(d)).getTime();g=a.Zp.getPosition(g,c,d,e);return a.Zp.getPosition(b,
c,d,e)-g};o_("TimeUtils.getLength",a.Zp.wHa,a);a.Zp.getDate=function(a,b,c,d){b=(new Date(b)).getTime();c=(new Date(c)).getTime();a*=c-b;return 0==a||0==d?b:a/d+b};o_("TimeUtils.getDate",a.Zp.getDate,a)});