/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore","ojs/ojdvt-base"],function(a){a.Np=function(){};o_("TimeUtils",a.Np,a);a.Np.getPosition=function(a,c,b,d){a=(new Date(a)).getTime();c=(new Date(c)).getTime();b=(new Date(b)).getTime();a=(a-c)*d;c=b-c;return 0==a||0==c?0:a/c};o_("TimeUtils.getPosition",a.Np.getPosition,a);a.Np.jGa=function(g,c,b,d,e){g=(new Date(g)).getTime();c=(new Date(c)).getTime();b=(new Date(b)).getTime();d=(new Date(d)).getTime();g=a.Np.getPosition(g,b,d,e);return a.Np.getPosition(c,
b,d,e)-g};o_("TimeUtils.getLength",a.Np.jGa,a);a.Np.getDate=function(a,c,b,d){c=(new Date(c)).getTime();b=(new Date(b)).getTime();a*=b-c;return 0==a||0==d?c:a/d+c};o_("TimeUtils.getDate",a.Np.getDate,a)});