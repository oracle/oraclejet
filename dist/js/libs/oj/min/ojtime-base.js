/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","jquery","ojs/ojdvt-base","ojs/ojcomponentcore","ojs/ojlocaledata","ojs/ojlogger","ojs/ojconverter-datetime","ojs/ojconverterutils-i18n","ojs/ojconverter-number"],function(e,t,r,n,o,i,a,s,l){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,
/**
   * @license
   * Copyright (c) 2016 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
e.__registerWidget("oj.dvtTimeComponent",t.oj.dvtBaseComponent,{_ComponentCreate:function(){this._super(),this._SetLocaleHelpers(l,s)},_GetEventTypes:function(){return["optionChange","viewportChange"]},_HandleEvent:function(e){if("viewportChange"===e.type){var t=new Date(e.viewportStart).toISOString(),r=new Date(e.viewportEnd).toISOString(),n=e.minorAxisScale,o={viewportStart:t,viewportEnd:r,minorAxisScale:n};this._UserOptionChange("viewportStart",t),this._UserOptionChange("viewportEnd",r),this._UserOptionChange("minorAxis.scale",n),this._trigger("viewportChange",null,o)}else this._super(e)},_LoadResources:function(){null==this.options._resources&&(this.options._resources={});var e=new a.IntlDateTimeConverter({hour:"numeric",minute:"2-digit",second:"2-digit"}),t=new a.IntlDateTimeConverter({hour:"numeric",minute:"2-digit"}),r=new a.IntlDateTimeConverter({hour:"numeric"}),n=new a.IntlDateTimeConverter({month:"numeric",day:"2-digit"}),i=new a.IntlDateTimeConverter({month:"long"}),s={seconds:e,minutes:t,hours:r,days:n,weeks:n,months:i,quarters:i,years:new a.IntlDateTimeConverter({year:"numeric"})},l=this.options._resources;l.converter=s,l.defaultDateTimeConverter=new a.IntlDateTimeConverter({formatType:"datetime",dateFormat:"medium",timeFormat:"medium"}),l.defaultDateConverter=new a.IntlDateTimeConverter({formatType:"date",dateFormat:"medium"}),l.firstDayOfWeek=o.getFirstDayOfWeek()},_ProcessTemplates:function(e,t,r,n,o,a,s){var l=a?this._TemplateHandler.getComponentResults(e):null;if(!l){var m=this._GetDataProviderSeriesConfig(),u=this.element[0],d=this._super(e,t,r,n,o,a,s);if(m&&e===m.dataProperty&&!n){var p,h,c,v=[],f={},g=d.values[0],C=0,_=m.defaultSingleSeries,w=m.idAttribute,j=m.itemsKey;for(c=0;c<g.length;c++){var T,y=g[c],D={data:y._itemData,key:y.id,index:c};f[T=null!=y[w]?y[w]:_?"":y.id]?(f[T][j].push(D),v[f[T].index][j].push(y)):((h={componentElement:u,id:T,index:C})[j]=[D],f[T]=h,C+=1,(p={id:T})[j]=[y],v.push(p))}var S=m.templateName,O=m.templateElementName,I=this._TemplateHandler.getTemplates()[S];if(I)for(I=I[0],c=0;c<v.length;c++){h=f[(p=v[c]).id];try{var E=this._TemplateHandler.processNodeTemplate(e,r,I,O,h,p.id);E.id=p.id,E[j]=p[j],v[c]=E}catch(e){i.error(e)}}l={paths:d.paths,values:[v]}}else l=d;a&&this._TemplateHandler.setComponentResults(e,l)}return l},_GetDataProviderSeriesConfig:function(){return{}}})});
//# sourceMappingURL=ojtime-base.js.map