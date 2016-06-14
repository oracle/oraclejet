/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

var p;function ba(a,b){0==a.indexOf("dvt.")&&(a=a.substring(4));var c=a.split("."),d=eval("dvt");c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d=d[e]?d[e]:d[e]={}:d[e]=b}Math.floor(2147483648*Math.random()).toString(36);
dvt.f5=function(a,b,c){this.Init(a,b,c)};dvt.v.D(dvt.f5,dvt.xe);p=dvt.f5.prototype;p.Init=function(a,b,c){dvt.f5.C.Init.call(this,a,b,c);this.bab=!1};p.ya=function(a,b,c){c&&this.Hf(c);this.Cb=a;this.Pb=b;this.X&&(a=this.IL(this.X),this.fC(a))};p.Hf=function(a){this.X=dvt.Ec.clone(a)};p.fC=function(a){this.vc=a.start;this.sd=a.end;this.AS=a.Nra;this.dU()};p.dU=function(){this.sm.Ph(this.AS)};function Lp(a,b){a.Lf=a.Oi<b?b:a.Oi;a.bab||(a.ww=0,a.ct=a.Lf)}p.rq=function(){return dvt.B.fa(this.u())};
p.Rb=function(){return this.ue};function Mp(a,b){a.qo?a.qo.Ee(null):a.qo=new dvt.ia(a.u(),"iCanvas");var c=new dvt.Id;a.Rb()?(c.Me(a.oo,a.fq,a.mw,a.Oi),a.qo.ha(a.oo),a.qo.xa(a.fq+a.gG)):(c.Me(a.oo,a.fq,a.Oi,a.mw),a.qo.ha(a.oo+a.gG),a.qo.xa(a.fq));b.Ee(c);a.qo.getParent()!=b&&b.A(a.qo)}
p.y1=function(a,b,c){a>this.mma?(a=this.mma,Np(this,!0)):Op(this,!0);this.Oi>a?(a=this.Oi,Np(this,!1)):Op(this,!1);var d=this.Lf<=a,e=(this.gf-this.Vc)/(this.sd-this.vc)*this.Lf;Lp(this,a);a=e/this.Lf*(this.sd-this.vc);b?(e=(this.sd-this.vc)/this.Lf,this.Vc=b-c*e,this.Vc<this.vc&&(this.Vc=this.vc),this.gf=this.Vc+a,this.gf>this.sd&&(this.gf=this.sd,this.Vc=this.gf-a,this.Vc<this.vc&&(this.Vc=this.vc)),Pp(this,1/e*(this.vc-this.Vc))):(this.Vc=this.vc,this.gf=this.Vc+a,this.Vc<this.vc&&(this.Vc=this.vc),
Pp(this,0));if(d)for(;0<this.nG;)if(b=this.QA[this.nG-1],this.Lf>=b){this.nG--;a:for(b=this.Lh,c=1;c<b.RA.length;c++)if(b.RA[c]==b.Je){b.Je=b.RA[c-1];break a}this.Je=this.Lh.Je}else break;else for(;this.nG<this.QA.length-1;)if(b=this.QA[this.nG],this.Lf<b){this.nG++;a:for(b=this.Lh,c=0;c<b.RA.length-1;c++)if(b.RA[c]==b.Je){b.Je=b.RA[c+1];break a}this.Je=this.Lh.Je}else break;Qp(this)};
p.Kv=function(a){var b=this.ue?this.Pb/2:this.Cb/2;this.y1(this.Lf*((1/a-1)/2+1),(this.sd-this.vc)/this.Lf*b+this.Vc,b,!0)};function Rp(a,b){if(a.ue){var c=a.qo.qa()-b,d=-(a.Lf-a.Oi-a.fq),e=a.fq;c<d?c=d:c>e&&(c=e);a.qo.xa(c);c-=a.fq;a.gG=c}else c=a.qo.ta()-b,d=-(a.Lf-a.Oi-a.oo),e=a.oo,c<d?c=d:c>e&&(c=e),a.qo.ha(c),a.gG=c-a.oo,c=Sp(a);d=a.Lf/(a.sd-a.vc);e=a.gf-a.Vc;a.Vc=a.vc-c/d;a.gf=a.Vc+e}function Op(a,b){b?(a.Lo.Fm(!0),a.Lo.tD()):(a.Mo.Fm(!0),a.Mo.tD())}
function Np(a,b){b?(a.Lo.Fm(!1),a.Lo.V$(),a.Lo.setCursor(null)):(a.Mo.Fm(!1),a.Mo.V$(),a.Mo.setCursor(null))}function Qp(a){a.ue?a.qo.xa(a.fq+a.gG):a.qo.ha(a.oo+a.gG)}function Sp(a){return a.rq()&&!a.ue?a.Oi-a.Lf-a.gG:a.gG}function Pp(a,b){a.rq()&&!a.ue?a.gG=a.Oi-a.Lf-b:a.gG=b};
  return dvt;
});
