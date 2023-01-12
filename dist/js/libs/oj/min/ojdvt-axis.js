/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojconverter-number"],function(t,i){"use strict";class a{constructor(t,i,a){this._context=t,this.Position=i.position,this._radius=i._radius,"top"===this.Position||"bottom"===this.Position?(this.StartCoord=a.x,this.EndCoord=a.x+a.w):"left"===this.Position||"right"===this.Position?(this.StartCoord=a.y,this.EndCoord=a.y+a.h):"radial"===this.Position?(this.StartCoord=0,this.EndCoord=this._radius):"tangential"===this.Position&&(i.isRTL?(this.StartCoord=2*Math.PI,this.EndCoord=0):(this.StartCoord=0,this.EndCoord=2*Math.PI)),this.MinValue=null,this.MaxValue=null,this.GlobalMin=null,this.GlobalMax=null,this.DataMin=null,this.DataMax=null,this.StartOverflow=0,this.EndOverflow=0,null==i.leftBuffer&&(i.leftBuffer=1/0),null==i.rightBuffer&&(i.rightBuffer=1/0),this.Options=i}getCtx(){return this._context}getOptions(){return this.Options}getValAt(t){if(null==t)return null;var i=Math.min(this.StartCoord,this.EndCoord),a=Math.max(this.StartCoord,this.EndCoord);return t<i||t>a?null:this.getUnboundedValAt(t)}getCoordAt(t){return null==t||t<this.MinValue||t>this.MaxValue?null:this.getUnboundedCoordAt(t)}getBoundedValAt(t){if(null==t)return null;var i=t,a=Math.min(this.StartCoord,this.EndCoord),n=Math.max(this.StartCoord,this.EndCoord);return t<a?i=a:t>n&&(i=n),this.getUnboundedValAt(i)}getBoundedCoordAt(t){if(null==t)return null;var i=t;return t<this.MinValue?i=this.MinValue:t>=this.MaxValue&&(i=this.MaxValue),this.getUnboundedCoordAt(i)}getUnboundedValAt(t){return null}getUnboundedCoordAt(t){return null}}a.MIN_AXIS_BUFFER=10;t.BaseAxisInfo=a,t.DataAxisInfoMixin=t=>class extends t{constructor(t,i,n){super(t,i,n),this.MAX_NUMBER_OF_GRIDS_AUTO=10,this.MINOR_TICK_COUNT=2,this.MAJOR_TICK_INCREMENT_BUFFER=1e-10,this.MIN_BAR_SIZE_IN_LOG=10,"top"===this.Position||"bottom"===this.Position?("off"!==i.tickLabel.rendered&&"off"!==i.rendered&&(this.StartOverflow=Math.max(a.MIN_AXIS_BUFFER-i.leftBuffer,0),this.EndOverflow=Math.max(a.MIN_AXIS_BUFFER-i.rightBuffer,0)),i.isRTL?(this.MinCoord=this.EndCoord-this.EndOverflow,this.MaxCoord=this.StartCoord+this.StartOverflow):(this.MinCoord=this.StartCoord+this.StartOverflow,this.MaxCoord=this.EndCoord-this.EndOverflow)):"tangential"===this.Position||"radial"===this.Position?(this.MinCoord=this.StartCoord,this.MaxCoord=this.EndCoord):(this.MinCoord=this.EndCoord,this.MaxCoord=this.StartCoord),this.DataMin=i.dataMin,this.DataMax=i.dataMax,this.utilsLogOptions=i._utils&&"log"===i.scale,this.IsLog=this.utilsLogOptions||"log"===i.scale&&this.DataMin>0&&this.DataMax>0,this.LinearGlobalMin=this.actualToLinear(i.min),this.LinearGlobalMax=this.actualToLinear(i.max),this.LinearMinValue=null==i.viewportMin?this.LinearGlobalMin:this.actualToLinear(i.viewportMin),this.LinearMaxValue=null==i.viewportMax?this.LinearGlobalMax:this.actualToLinear(i.viewportMax),this._dataMin=this.actualToLinear(this.DataMin),this._dataMax=this.actualToLinear(this.DataMax),this.MajorIncrement=this.actualToLinear(i.step),this.MinorIncrement=this.actualToLinear(i.minorStep),this._minMajorIncrement=this.actualToLinear(i.minStep),this.MajorTickCount=i._majorTickCount,this.MinorTickCount=i._minorTickCount,this.LogScaleUnit=i._logScaleUnit,this.ZeroBaseline=!this.IsLog&&"zero"===i.baselineScaling,this._continuousExtent=this.Options?"on"===this.Options._continuousExtent:null,this.Converter=null,null!=i.tickLabel&&(this.Converter=i.tickLabel.converter),this._calcAxisExtents(),this.GlobalMin=this.linearToActual(this.LinearGlobalMin),this.GlobalMax=this.linearToActual(this.LinearGlobalMax),this.MinValue=this.linearToActual(this.LinearMinValue),this.MaxValue=this.linearToActual(this.LinearMaxValue)}getBaselineCoord(){return this.IsLog?this.MinCoord:this.getBoundedCoordAt(0)}getUnboundedValAt(t){if(null==t)return null;var i=(t-this.MinCoord)/(this.MaxCoord-this.MinCoord),a=this.LinearMinValue+i*(this.LinearMaxValue-this.LinearMinValue);return this.linearToActual(a)}getUnboundedCoordAt(t){return this.GetUnboundedCoordAt(this.actualToLinear(t))}GetUnboundedCoordAt(t){if(null==t)return null;var i=this.LinearMaxValue===this.LinearMinValue?0:(t-this.LinearMinValue)/(this.LinearMaxValue-this.LinearMinValue);return i=Math.max(Math.min(1e3,i),-1e3),this.MinCoord+i*(this.MaxCoord-this.MinCoord)}CalcMajorMinorIncr(t){this.MajorIncrement||(this.MajorTickCount?this.MajorIncrement=(this.LinearMaxValue-this.LinearMinValue)/this.MajorTickCount:this.MajorIncrement=Math.max(t,this._minMajorIncrement)),this.MajorTickCount||(this.MajorTickCount=(this.LinearMaxValue-this.LinearMinValue)/this.MajorIncrement,Math.ceil(this.MajorTickCount)-this.MajorTickCount<this.MAJOR_TICK_INCREMENT_BUFFER&&(this.MajorTickCount=Math.ceil(this.MajorTickCount))),this.MinorTickCount||(this.MinorIncrement?this.MinorTickCount=this.MajorIncrement/this.MinorIncrement:this.IsLog?this.MinorTickCount=this.MajorIncrement:this.MinorTickCount=this.MINOR_TICK_COUNT),this.MinorIncrement||(this.MinorIncrement=this.MajorIncrement/this.MinorTickCount)}_calcAxisExtents(){this.ZeroBaseline&&(this._dataMin=Math.min(0,this._dataMin),this._dataMax=Math.max(0,this._dataMax));var t=null!=this.LinearGlobalMax?this.LinearGlobalMax:this._dataMax,i=null!=this.LinearGlobalMin?this.LinearGlobalMin:this._dataMin,a=Math.max(this._calcAxisScale(i,t),this._minMajorIncrement);this._dataMin===this._dataMax&&(0===this._dataMin?this._dataMax+=5*a:(this._dataMin-=2*a,this._dataMax+=2*a)),null==this.LinearGlobalMin&&(this.ZeroBaseline&&this._dataMin>=0?this.LinearGlobalMin=0:this._continuousExtent?this.LinearGlobalMin=this._dataMin-.1*(this._dataMax-this._dataMin):this.ZeroBaseline||null==this.LinearGlobalMax?this.LinearGlobalMin=(Math.ceil(this._dataMin/a)-1)*a:(this.LinearGlobalMin=this.LinearGlobalMax,this.LinearGlobalMin-=a*(Math.floor((this.LinearGlobalMin-this._dataMin)/a)+1)),this._dataMin>=0&&!this.IsLog&&(this.LinearGlobalMin=Math.max(this.LinearGlobalMin,0))),null==this.LinearGlobalMax&&(this.MajorTickCount?(this.LinearGlobalMax=this.LinearGlobalMin+this.MajorTickCount*a,this.LinearGlobalMax<this._dataMax&&(a=Math.max(this._calcAxisScale(i,t+a),this._minMajorIncrement),this.LinearGlobalMax=this.LinearGlobalMin+this.MajorTickCount*a)):this.ZeroBaseline&&this._dataMax<=0?this.LinearGlobalMax=0:this._continuousExtent?this.LinearGlobalMax=this._dataMax+.1*(this._dataMax-this._dataMin):this.ZeroBaseline?this.LinearGlobalMax=(Math.floor(this._dataMax/a)+1)*a:(this.LinearGlobalMax=this.LinearGlobalMin,this.LinearGlobalMax+=a*(Math.floor((this._dataMax-this.LinearGlobalMax)/a)+1)),this._dataMax<=0&&(this.LinearGlobalMax=Math.min(this.LinearGlobalMax,0))),this.LinearGlobalMax===this.LinearGlobalMin&&(this.LinearGlobalMax=100,this.LinearGlobalMin=0,a=(this.LinearGlobalMax-this.LinearGlobalMin)/this.MAX_NUMBER_OF_GRIDS_AUTO),null==this.LinearMinValue&&(this.LinearMinValue=this.LinearGlobalMin),null==this.LinearMaxValue&&(this.LinearMaxValue=this.LinearGlobalMax);var n=Math.abs(this.GetUnboundedCoordAt(this.LinearGlobalMin)-this.GetUnboundedCoordAt(this._dataMin));(this.IsLog&&n<this.MIN_BAR_SIZE_IN_LOG||this.utilsLogOptions)&&(this.LinearGlobalMin-=a,this.LinearMinValue=this.LinearGlobalMin),this.LinearMinValue===this.LinearGlobalMin&&this.LinearMaxValue===this.LinearGlobalMax||(a=this._calcAxisScale(this.LinearMinValue,this.LinearMaxValue)),this.LinearGlobalMin>this.LinearMinValue&&(this.LinearGlobalMin=this.LinearMinValue),this.LinearGlobalMax<this.LinearMaxValue&&(this.LinearGlobalMax=this.LinearMaxValue),this.CalcMajorMinorIncr(a)}_calcAxisScale(t,i){if(this.MajorIncrement)return this.MajorIncrement;var a,n=i-t;if(this.IsLog){var s=Math.floor(n/8)+1;return(!this.LogScaleUnit||this.LogScaleUnit<s)&&(this.LogScaleUnit=s),this.LogScaleUnit}if(0===n)return 0===t?10:Math.pow(10,Math.floor(Math.log10(t))-1);if(this.MajorTickCount){var e=n/this.MajorTickCount,r=e/(a=Math.pow(10,Math.ceil(Math.log10(e)-1)));return(r=r>1&&r<=1.5?1.5:r>5?10:Math.ceil(r))*a}var o=Math.log10(n);a=Math.pow(10,Math.ceil(o)-2);var l=Math.round(n/a);return(l>=10&&l<=14?2:l>=15&&l<=19?3:l>=20&&l<=24?4:l>=25&&l<=45?5:l>=46&&l<=80?10:20)*a}linearToActual(t){return null==t?null:this.IsLog?Math.pow(10,t):t}actualToLinear(t){return null==t?null:this.IsLog?t>0?Math.log10(t):null:t}getAxisData(){return{isLog:this.IsLog,max:this.LinearGlobalMax,min:this.LinearGlobalMin,step:this.MajorIncrement,numSteps:this.MajorTickCount}}},t.LinearScaleAxisValueFormatter=class{constructor(t,i,a,n,s,e){this.SCALE_NONE="none",this.SCALE_AUTO="auto",this.SCALE_THOUSAND="thousand",this.SCALE_MILLION="million",this.SCALE_BILLION="billion",this.SCALE_TRILLION="trillion",this.SCALE_QUADRILLION="quadrillion",this.SCALING_FACTOR_DIFFERENCE=3,this._translations=e,this._scales={},this._scalesOrder=[],this._factorToScaleMapping={},this.InitScales(),this.InitFormatter(t,i,a,n,s)}InitScales(){const t=(t,i,a)=>{var n;a&&(n=this._translations?this._translations[a]:null);var s={scaleFactor:i,localizedSuffix:n};this._scales[t]=s,this._scalesOrder.push(s),this._factorToScaleMapping[i]=s};var i=this.SCALING_FACTOR_DIFFERENCE;t(this.SCALE_NONE,0*i),t(this.SCALE_THOUSAND,1*i,"labelScalingSuffixThousand"),t(this.SCALE_MILLION,2*i,"labelScalingSuffixMillion"),t(this.SCALE_BILLION,3*i,"labelScalingSuffixBillion"),t(this.SCALE_TRILLION,4*i,"labelScalingSuffixTrillion"),t(this.SCALE_QUADRILLION,5*i,"labelScalingSuffixQuadrillion"),this._scalesOrder.sort((t,i)=>t.scaleFactor<i.scaleFactor?-1:t.scaleFactor>i.scaleFactor?1:0)}InitFormatter(t,i,a,n,s){var e,r,o=!1,l=!1;if("off"!==s&&(l=!0),"number"!=typeof(r=this._getScaleFactor(n))&&(o=!0),o){var h=Math.max(Math.abs(t),Math.abs(i)),M=this._getPowerOfTen(h);r=this._findNearestLEScaleFactor(M)}if(!0===l)if(0===a&&t===i){var u=r-this._getPowerOfTen(i);e=u<=0?Math.max(u+3,0):Math.max(u,4)}else{var c=this._getPowerOfTen(a);e=Math.max(r-c,0)}this._useAutoPrecision=l,this._scaleFactor=r,this._decimalPlaces=e}_findNearestLEScaleFactor(t){var i=0;if(t<=this._scalesOrder[0].scaleFactor)i=this._scalesOrder[0].scaleFactor;else if(t>=this._scalesOrder[this._scalesOrder.length-1].scaleFactor)i=this._scalesOrder[this._scalesOrder.length-1].scaleFactor;else for(var a=this._scalesOrder.length-1;a>=0;a--)if(this._scalesOrder[a].scaleFactor<=t){i=this._scalesOrder[a].scaleFactor;break}return i}_getScaleFactor(t){var i,a=t||this.SCALE_AUTO,n=this._scales[a];return n&&(i=n.scaleFactor),i}format(t,a){var n=null!=t?parseFloat(t):t;if("number"==typeof n){var s=Math.pow(10,this._scaleFactor),e={style:"decimal",decimalFormat:"unit"===(a&&a.getOptions&&a.getOptions()&&a.getOptions().style)?"standard":"short",nu:"latn",useGrouping:!1},r=new i.IntlNumberConverter(e).format(s,e),o=/(\d+)(.*$)/.exec(r),l=o[2],h=Number(o[1])/s*n;if(a&&a.format)h=a.format(h);else{var M={style:"decimal",minimumFractionDigits:this._decimalPlaces,maximumFractionDigits:this._decimalPlaces};h=new i.IntlNumberConverter(M).format(h,M)}return"string"==typeof l&&0!==t&&(h+=l),h}return t}_formatFraction(t){var i=t.toString();if(-1!==i.indexOf("e"))return i;if(this._decimalPlaces>0){-1===i.indexOf(".")&&(i+=".");for(var a=i.substring(i.indexOf(".")+1).length;a<this._decimalPlaces;)i+="0",a+=1}return i}_getPowerOfTen(t){var i=t>=0?t:-t,a=0;if(i<1e-15)return 0;if(i===1/0)return Number.MAX_VALUE;if(i>=10)for(;i>=10;)a+=1,i/=10;else if(i<1)for(;i<1;)a-=1,i*=10;return a}getDecimalPlaces(){return this._decimalPlaces}},Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=ojdvt-axis.js.map