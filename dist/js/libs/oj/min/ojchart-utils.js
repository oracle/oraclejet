/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojdvt-axis"],function(e,a){"use strict";e.getLabelFormatInfo=function(e){let i={_utils:!0};i.scale=e.scale?e.scale:"linear",i.step=e.step,i.baselineScaling="log"===i.scale?"min":"zero","axis"===e.rangeType?(i.max=e.range.max,i.min=e.range.min):"data"===e.rangeType&&(i.dataMax=e.range.max,i.dataMin=e.range.min);let t=new a.DataAxisInfoMixin;t.MixinInit(i);let n,l=t.getAxisData(),s=20,r=0;if(l.isLog)for(var m=0;m<=l.numSteps;m++){let e=m*l.step+l.min;e=t.linearToActual(e),n=new a.LinearScaleAxisValueFormatter(e,e,e,"auto","on"),r=Math.max(r,n.getDecimalPlaces()),s=Math.min(s,n.getDecimalPlaces())}else n=new a.LinearScaleAxisValueFormatter(l.min,l.max,l.step,"auto","on"),r=n.getDecimalPlaces(),s=r;return{minimumFractionDigits:s,maximumFractionDigits:r}},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojchart-utils.js.map