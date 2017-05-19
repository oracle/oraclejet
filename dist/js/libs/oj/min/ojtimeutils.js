/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore","ojs/ojdvt-base"],function(a){a.Gr=function(){};o_("TimeUtils",a.Gr,a);a.Gr.getPosition=function(a,c,b,d){a=(new Date(a)).getTime();c=(new Date(c)).getTime();b=(new Date(b)).getTime();a=(a-c)*d;c=b-c;return 0==a||0==c?0:a/c};o_("TimeUtils.getPosition",a.Gr.getPosition,a);a.Gr.xQa=function(g,c,b,d,e){g=(new Date(g)).getTime();c=(new Date(c)).getTime();b=(new Date(b)).getTime();d=(new Date(d)).getTime();g=a.Gr.getPosition(g,b,d,e);return a.Gr.getPosition(c,
b,d,e)-g};o_("TimeUtils.getLength",a.Gr.xQa,a);a.Gr.getDate=function(a,c,b,d){c=(new Date(c)).getTime();b=(new Date(b)).getTime();a*=b-c;return 0==a||0==d?c:a/d+c};o_("TimeUtils.getDate",a.Gr.getDate,a)});