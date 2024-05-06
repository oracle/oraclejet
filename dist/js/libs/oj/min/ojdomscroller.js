/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","jquery","ojs/ojdatacollection-common","ojs/ojlogger"],function(e,t,r,i){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;const s=function(e,i,s){s=s||{},this._data=i,this._asyncIterator=s.asyncIterator,this._element=t(e)[0],this._contentElement=s.contentElement,this._fetchSize=s.fetchSize,this._fetchSize=this._fetchSize>0?this._fetchSize:25,this._maxCount=s.maxCount,this._maxCount=this._maxCount>0?this._maxCount:500,this._rowCount=s.initialRowCount>0?s.initialRowCount:0,this._controller=s.controller,this._successCallback=s.success,this._requestCallback=s.request,this._errorCallback=s.error,this._isOverflowCallback=s.isOverflow,this._beforeFetchCallback=s.beforeFetch,this._beforeScrollCallback=s.beforeScroll,this._localKeyValidator=s.localKeyValidator,this._registerDataSourceEventListeners(),this._fetchTrigger=s.fetchTrigger,(null==this._fetchTrigger||isNaN(this._fetchTrigger))&&(this._fetchTrigger=0),this._initialScrollTop=this._element.scrollTop,this._lastFetchTrigger=0,this._isScrollTriggeredByMouseWheel=!1,this._checkViewportCount=0,this._fetchThreshold=.25;var n=r.getScrollEventElement(this._element);this._scrollEventListener=function(){if(!this._isScrollTrackingPaused){this._beforeScrollCallback&&this._beforeScrollCallback();var e=this._element.scrollTop,t=this._element.clientHeight,r=this._element.scrollHeight-t;r>0&&(this._contentElement?this._handleExternalScrollerScrollTop(e,t):this._handleScrollerScrollTop(e,r))}}.bind(this),n.addEventListener("scroll",this._scrollEventListener),this._wheelEventListener=function(){this._isScrollTriggeredByMouseWheel=!0}.bind(this),n.addEventListener("wheel",this._wheelEventListener,{passive:!0}),this._mouseDownEventListener=function(){this._isScrollTriggeredByMouseWheel=!1}.bind(this),n.addEventListener("mousedown",this._mouseDownEventListener)};return s.prototype.setAsyncIterator=function(e){this._asyncIterator=e},s.prototype.pauseScrollTracking=function(){this._isScrollTrackingPaused=!0},s.prototype.resumeScrollTracking=function(){this._isScrollTrackingPaused=!1},s.prototype.setFetchTrigger=function(e){null!=e&&!isNaN(e)&&e>=0&&(this._fetchTrigger=e)},s.prototype.destroy=function(){this._unregisterDataSourceEventListeners();var e=r.getScrollEventElement(this._element);e&&(e.removeEventListener("scroll",this._scrollEventListener),e.removeEventListener("wheel",this._wheelEventListener,{passive:!0}),e.removeEventListener("mousedown",this._mouseDownEventListener))},s.prototype.checkViewport=function(e){return this._asyncIterator&&this._element.clientHeight>0&&(e||!this.isOverflow()||this._isEndReached())&&(this._checkViewportCount+=1,this._checkViewportCount===r.CHECKVIEWPORT_THRESHOLD&&i.warn("Viewport not satisfied after multiple fetch, make sure the component is height constrained or specify a scroller."),this._beforeFetchCallback(this._element.scrollTop,!0))?this._fetchMoreRows():(this._checkViewportCount=0,Promise.resolve(null))},s.prototype._doFetch=function(e){var t=this;if(this._beforeFetchCallback(e-this._fetchTrigger,!1)){this._lastFetchTrigger=e;var r=t._isScrollTriggeredByMouseWheel;this._fetchPromise=this._fetchMoreRows().then(function(e){t._successCallback&&(e.isMouseWheel=r,t._successCallback(e),t._fetchPromise=null,t._nextFetchTrigger=void 0)},function(e){if(t._errorCallback){var r=null!=t._controller&&t._controller.signal.aborted;t._errorCallback(e,r),t._fetchPromise=null,t._nextFetchTrigger=void 0}})}else this._nextFetchTrigger=void 0},s.prototype._handleExternalScrollerScrollTop=function(e,t){if(!this._fetchPromise&&this._asyncIterator){var r=this._contentElement.getBoundingClientRect(),i=this._element===document.body||this._element===document.documentElement?t:this._element.getBoundingClientRect().bottom;r.bottom-i<=this._fetchTrigger+r.height*this._fetchThreshold&&this._doFetch(e)}},s.prototype._handleScrollerScrollTop=function(e,t){!this._fetchPromise&&this._asyncIterator&&(t!==this._lastMaxScrollTop&&(this._nextFetchTrigger=Math.max(0,(t-this._fetchTrigger-e)/2),this._lastMaxScrollTop=t),null!=this._nextFetchTrigger&&e-this._lastFetchTrigger>this._nextFetchTrigger)?this._doFetch(e):t-e<1&&e>this._fetchTrigger&&(this._fetchPromise?this._asyncIterator?null!=this._requestCallback&&this._requestCallback():null!=this._errorCallback&&this._errorCallback():this._asyncIterator&&this._doFetch(e))},s.prototype.isOverflow=function(){if(this._isOverflowCallback)return this._isOverflowCallback();var t=(this._contentElement?this._contentElement.scrollHeight:this._element.scrollHeight)-(this._element.clientHeight+this._fetchTrigger);return 1===t&&e.AgentUtils.getAgentInfo().browser===e.AgentUtils.BROWSER.EDGE&&(t=0),t>0},s.prototype._isEndReached=function(){return this._element.scrollHeight-this._element.clientHeight-this._element.scrollTop<Math.max(1,this._fetchTrigger)},s.prototype._fetchMoreRows=function(){if(!this._fetchPromise){var e=this._maxCount-this._rowCount;if(e>0){var t=this;if(this._asyncIterator)return this._fetchPromise=this._asyncIterator.next().then(function(r){var i=r;if(t._fetchPromise=null,null!=i&&null!=i.value){var s=i.value.data.length;s>0&&(t._rowCount+=s,e<=s&&(i.maxCount=t._maxCount,i.maxCountLimit=!0,s>e&&(i.value.data=i.value.data.slice(0,e),i.value.metadata=i.value.metadata.slice(0,e),null!=i.value.fetchParameters&&(i.value.fetchParameters.size=e)))),(i.done||i.maxCountLimit)&&(t._asyncIterator=null)}return Promise.resolve(i)}),this._fetchPromise}return this._asyncIterator=null,Promise.resolve({maxCount:this._maxCount,maxCountLimit:!0})}return this._fetchPromise},s.prototype._handleDataRowMutateEvent=function(e){if(null!=this._asyncIterator){var t,r,i,s=this;null!=e.detail.add&&(null!=(t=e.detail.add).indexes?r=t.indexes:null!=t.addBeforeKeys?i=t.addBeforeKeys:null!=t.afterKeys&&(i=t.afterKeys),this._handleDataRowAddedOrRemoved(i,r,function(){s._rowCount+=1})),null!=e.detail.remove&&(null!=(t=e.detail.remove).indexes?r=t.indexes:null!=t.keys&&(i=t.keys),this._handleDataRowAddedOrRemoved(i,r,function(){s._rowCount-=1}))}},s.prototype._handleDataRowAddedOrRemoved=function(e,t,r){if(t)for(var i=0;i<t.length;i++){var s=t[i];void 0!==s&&this._rowCount>0&&s<=this._rowCount&&r()}else if(e){var n=this._localKeyValidator;null!=n&&e.forEach(function(e){n(e)&&r()})}},s.prototype._registerDataSourceEventListeners=function(){var e,t,r=this._data;if(null!=r)for(this._unregisterDataSourceEventListeners(),this._dataProviderEventHandlers=[],this._dataProviderEventHandlers.push({eventType:"mutate",eventHandler:this._handleDataRowMutateEvent.bind(this)}),e=0;e<this._dataProviderEventHandlers.length;e++)(t=r.addEventListener(this._dataProviderEventHandlers[e].eventType,this._dataProviderEventHandlers[e].eventHandler))&&(this._dataProviderEventHandlers[e].eventHandler=t)},s.prototype._unregisterDataSourceEventListeners=function(){var e,t=this._data;if(null!=this._dataProviderEventHandlers&&null!=t)for(e=0;e<this._dataProviderEventHandlers.length;e++)t.removeEventListener(this._dataProviderEventHandlers[e].eventType,this._dataProviderEventHandlers[e].eventHandler)},s});
//# sourceMappingURL=ojdomscroller.js.map