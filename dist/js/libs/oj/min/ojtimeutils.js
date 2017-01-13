/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore","ojs/ojdvt-base"],function(a){a.aq=function(){};o_("TimeUtils",a.aq,a);a.aq.getPosition=function(a,b,c,d){a=(new Date(a)).getTime();b=(new Date(b)).getTime();c=(new Date(c)).getTime();a=(a-b)*d;b=c-b;return 0==a||0==b?0:a/b};o_("TimeUtils.getPosition",a.aq.getPosition,a);a.aq.cIa=function(g,b,c,d,e){g=(new Date(g)).getTime();b=(new Date(b)).getTime();c=(new Date(c)).getTime();d=(new Date(d)).getTime();g=a.aq.getPosition(g,c,d,e);return a.aq.getPosition(b,
c,d,e)-g};o_("TimeUtils.getLength",a.aq.cIa,a);a.aq.getDate=function(a,b,c,d){b=(new Date(b)).getTime();c=(new Date(c)).getTime();a*=c-b;return 0==a||0==d?b:a/d+b};o_("TimeUtils.getDate",a.aq.getDate,a)});