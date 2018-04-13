/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","jquery","ojs/ojcomponentcore","ojs/ojdvt-base"],function(e,t,i,n){e.TimeUtils=function(){},e.TimeUtils.getPosition=function(e,t,i,n){var o=((e=new Date(e).getTime())-(t=new Date(t).getTime()))*n,m=(i=new Date(i).getTime())-t;return 0==o||0==m?0:o/m},e.TimeUtils.getLength=function(t,i,n,o,m){var g;return t=new Date(t).getTime(),i=new Date(i).getTime(),n=new Date(n).getTime(),o=new Date(o).getTime(),g=e.TimeUtils.getPosition(t,n,o,m),e.TimeUtils.getPosition(i,n,o,m)-g},e.TimeUtils.getDate=function(e,t,i,n){t=new Date(t).getTime();var o=e*((i=new Date(i).getTime())-t);return 0==o||0==n?t:o/n+t}});