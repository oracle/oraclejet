/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","jquery","ojs/ojcontext","ojs/ojcomponentcore","ojs/ojlogger","ojs/ojdomutils","ojs/ojfocusutils","touchr"],function(t,e,i,s,n,o,r,a,l){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,i=i&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i,s=s&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s,a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a;var h={properties:{arrowPlacement:{type:"string",enumValues:["adjacent","overlay"],value:"adjacent"},arrowVisibility:{type:"string",enumValues:["auto","hidden","hover","visible"],value:"auto"},currentItem:{type:"object",writeback:!0,value:{index:0},properties:{id:{type:"string"},index:{type:"number"}}},looping:{type:"string",enumValues:["off","page"],value:"off"},maxItemsPerPage:{type:"number",value:0},orientation:{type:"string",enumValues:["horizontal","vertical"],value:"horizontal"},translations:{type:"object",value:{},properties:{labelAccArrowNextPage:{type:"string"},labelAccArrowPreviousPage:{type:"string"},labelAccFilmStrip:{type:"string"},tipArrowNextPage:{type:"string"},tipArrowPreviousPage:{type:"string"}}}},methods:{getItemsPerPage:{},getPagingModel:{},getProperty:{},refresh:{},setProperties:{},setProperty:{},getNodeBySubId:{},getSubIdByNode:{}},extension:{}};h.extension._WIDGET_NAME="ojFilmStrip",h.extension._TRACK_CHILDREN="immediate",e.CustomElementBridge.register("oj-film-strip",{metadata:h});const c=function(){this.Init()};e._registerLegacyNamespaceProp("FilmStripPagingModel",c),e.Object.createSubclass(c,e.EventSource,"oj.FilmStripPagingModel"),c.prototype.Init=function(){c.superclass.Init.call(this),this._page=-1,this._totalSize=0,this._pageSize=-1},c.prototype.setTotalSize=function(t){this._totalSize=t},c.prototype.getPageSize=function(){return this._pageSize},c.prototype.getPage=function(){return this._page},c.prototype.setPage=function(t,e){t=parseInt(t,10);try{var i=this.getPageCount(),s=this._page,n=this._pageSize,o=n;if(e&&e.pageSize&&(o=e.pageSize),0===this._totalSize&&-1===o)return Promise.resolve();var r=Math.ceil(this._totalSize/o);if(t<0||t>r-1)throw new Error("JET FilmStrip: Invalid 'page' set: "+t);var a=!1;if(t!==s||o!==n){if(!1===this.handleEvent("beforePage",{page:t,previousPage:s}))return Promise.reject();a=!0}this._page=t,this._pageSize=o;var l=this.getPageCount(),h=this;return new Promise(function(n){if(i!==l&&h.handleEvent("pageCount",{pageCount:l,previousPageCount:i}),a){var o={page:t,previousPage:s};e&&e.loopDirection&&(o.loopDirection=e.loopDirection),h.handleEvent("page",o)}n(null)})}catch(t){return Promise.reject(t)}},c.prototype.getStartItemIndex=function(){return-1===this._page&&-1===this._pageSize?-1:this._page*this._pageSize},c.prototype.getEndItemIndex=function(){return Math.min(this.getStartItemIndex()+this._pageSize,this._totalSize)-1},c.prototype.getPageCount=function(){return Math.ceil(this._totalSize/this._pageSize)},c.prototype.totalSize=function(){return this._totalSize},c.prototype.totalSizeConfidence=function(){return"actual"},function(){function t(t,e){t.css("-webkit-transform",e).css("-ms-transform",e).css("transform",e)}function l(t){t.css("-webkit-transform","").css("-ms-transform","").css("transform","")}function h(t){const e=i("<div></div>");return e.text(t),e[0].innerHTML}e.__registerWidget("oj.ojFilmStrip",i.oj.baseComponent,{defaultElement:"<div>",widgetEventPrefix:"oj",options:{maxItemsPerPage:0,orientation:"horizontal",currentItem:{index:0},arrowPlacement:"adjacent",arrowVisibility:"auto",looping:"off"},_ComponentCreate:function(){this._super();const t=this.element;t.addClass("oj-filmstrip oj-component").attr("tabindex",0).attr("role","application"),t.uniqueId(),this._focusable({element:t,applyHighlight:!0});const e=this.options;if(e.disabled&&o.warn("JET FilmStrip: 'disabled' property not supported"),"horizontal"!==e.orientation&&"vertical"!==e.orientation)throw new Error("JET FilmStrip: Unsupported value set as 'orientation' property: "+e.orientation);if("adjacent"!==e.arrowPlacement&&"overlay"!==e.arrowPlacement)throw new Error("JET FilmStrip: Unsupported value set as 'arrowPlacement' property: "+e.arrowPlacement);if("visible"!==e.arrowVisibility&&"hidden"!==e.arrowVisibility&&"hover"!==e.arrowVisibility&&"auto"!==e.arrowVisibility)throw new Error("JET FilmStrip: Unsupported value set as 'arrowVisibility' property: "+e.arrowVisibility);if("off"!==e.looping&&"page"!==e.looping)throw new Error("JET FilmStrip: Unsupported value set as 'looping' property: "+e.looping);if(this.touchEventNamespace=this.eventNamespace+"Touch",this.mouseEventNamespace=this.eventNamespace+"Mouse",this.keyEventNamespace=this.eventNamespace+"Key",this.navArrowHoverableEventNamespace=this.eventNamespace+"NavArrowHoverable",e.currentItem=this._convertCurrentItemToObj(e.currentItem),t.children().length&&e.currentItem&&(function(t,e){return t&&r.isValidIdentifier(t)&&!e.find("#"+t).length}(e.currentItem.id,t)||function(t,e){return null!=t&&(t<0||t>=e.children().length)}(e.currentItem.index,t)))throw new Error("JET FilmStrip: Value of 'currentItem' property is invalid. No such item exists: "+JSON.stringify(e.currentItem));this._setup(!0),this._populateCurrentItemObj(e.currentItem),this.option("currentItem",e.currentItem,{_context:{internalSet:!0,writeback:!0}})},refresh:function(){this._super(),this._setup(!1)},getItemsPerPage:function(){return this._itemsPerPage},getPagingModel:function(){return this._pagingModel},_notifyCommon:function(){this._needsSetup?this._setup(this._needsSetup[0]):this._handleResize()},_NotifyShown:function(){this._super(),this._notifyCommon()},_NotifyAttached:function(){this._super(),this._notifyCommon()},_setup:function(t){const e=this;if(t&&!this._pagingModel&&(this._pagingModel=new c),t&&!this._filterNestedFilmStripsFunc&&(this._filterNestedFilmStripsFunc=function(t,s){return i(s).closest(".oj-filmstrip")[0]===e.element[0]}),!this._canCalculateSizes()){let e=!1;return this._needsSetup&&(e=this._needsSetup[0]),void(this._needsSetup=[t||e])}this._needsSetup=null,this._bRTL="rtl"===this._GetReadingDirection(),this._bTouchSupported=r.isTouchSupported();const s=this.element;t?(this._itemsPerPage=0,this._handlePageFunc=function(t){e._handlePage(t)},this._componentSize=0,this._itemSize=-1,this._handleTransitionEndFunc=function(){e._handleTransitionEnd()},this._handleResizeFunc=function(){e._handleResize()},this._bTouchSupported&&(this._handleTouchStartFunc=function(t){e._handleTouchStart(t)},this._handleTouchMoveFunc=function(t){e._handleTouchMove(t)},this._handleTouchEndFunc=function(){e._handleTouchEnd()},this._addTouchListeners()),this._handleMouseDownFunc=function(t){e._handleMouseDown(t)},this._handleMouseMoveFunc=function(t){e._handleMouseMove(t)},this._handleMouseUpFunc=function(){e._handleMouseUp()},this._addMouseListeners(),this._handleKeyDownFunc=function(t){e._handleKeyDown(t)},this._addKeyListeners()):this._destroyInternal();const a=s.children();for(let t=0;t<a.length;t++)n.subtreeDetached(a[t]);const l=this._pagingModel;t&&l.on("page",this._handlePageFunc),l.setTotalSize(a.length),this._wrapChildren(),this._adjustSizes();for(let t=0;t<a.length;t++)n.subtreeAttached(a[t]);0===a.length&&o.warn("JET FilmStrip: There are no nested children!"),r.addResizeListener(s[0],this._handleResizeFunc,25)},_destroy:function(){this._bTouchSupported&&(this._removeTouchListeners(),this._handleTouchStartFunc=null,this._handleTouchMoveFunc=null,this._handleTouchEndFunc=null),this._removeMouseListeners(),this._handleMouseDownFunc=null,this._handleMouseMoveFunc=null,this._handleMouseUpFunc=null,this._removeKeyListeners(),this._handleKeyDownFunc=null,this._destroyInternal(),this._pagingModel.off("page",this._handlePageFunc),this._handlePageFunc=null,this._pagingModel=null,this._handleResizeFunc=null,this._handleTransitionEndFunc=null,this._filterNestedFilmStripsFunc=null;const t=this.element;t.removeClass("oj-filmstrip oj-component oj-filmstrip-hover").removeAttr("tabindex role").removeAttr("aria-labelledby"),t.removeUniqueId(),this._IsCustomElement()&&(t[0].removeEventListener("touchstart",this._delegatedHandleTouchStartFunc,{passive:!0}),t[0].removeEventListener("touchmove",this._delegatedHandleTouchMoveFunc,{passive:!1}),delete this._delegatedHandleTouchStartFunc,delete this._delegatedHandleTouchMoveFunc),this._super()},_destroyInternal:function(){this._deferredHandleResize=!1,this._resolveBusyState();const t=this.element;r.removeResizeListener(t[0],this._handleResizeFunc),this._itemSize=-1,this._queuedHandleResize&&(clearTimeout(this._queuedHandleResize),this._queuedHandleResize=null);const e=this._getItems();let i;for(i=0;i<e.length;i++)n.subtreeDetached(e[i]);this._clearCalculatedSizes();for(this._getItemContainers().unwrap(),this._unwrapChildren(),i=0;i<e.length;i++)n.subtreeAttached(e[i])},_setOption:function(t,e,i){const s=this.options;let n=!1,r=-1;const a=this._pagingModel,l=a.getPage();switch(t){case"disabled":o.warn("JET FilmStrip: 'disabled' property not supported");break;case"orientation":if("horizontal"!==e&&"vertical"!==e)throw new Error("JET FilmStrip: Unsupported value set as 'orientation' property: "+e);n=s.orientation!==e;break;case"maxItemsPerPage":n=s.maxItemsPerPage!==e;break;case"arrowPlacement":if("adjacent"!==e&&"overlay"!==e)throw new Error("JET FilmStrip: Unsupported value set as 'arrowPlacement' property: "+e);n=s.arrowPlacement!==e;break;case"arrowVisibility":if("visible"!==e&&"hidden"!==e&&"hover"!==e&&"auto"!==e)throw new Error("JET FilmStrip: Unsupported value set as 'arrowVisibility' property: "+e);n=s.arrowVisibility!==e;break;case"looping":if("off"!==e&&"page"!==e)throw new Error("JET FilmStrip: Unsupported value set as 'looping' property: "+e);n=s.looping!==e;break;case"currentItem":e=this._convertCurrentItemToObj(e),this._populateCurrentItemObj(e);var h=s.currentItem;if(h&&e&&(h.id!==e.id||h.index!==e.index)&&(r=this._findPage(e),r<0||r>=a.getPageCount()))throw new Error("JET FilmStrip: Value of 'currentItem' property is invalid. No such item exists: "+JSON.stringify(e))}this._super(t,e,i),"currentItem"===t&&r>-1&&r!==l&&a.setPage(r),n&&this._setup(!1)},_handleResize:function(){if(this._busyStateResolveFunc)this._deferredHandleResize=!0;else if(this._bHandlingResize){if(!this._queuedHandleResize){const t=this;this._queuedHandleResize=setTimeout(function(){t._queuedHandleResize=null,t._handleResize()},0)}}else this._bHandlingResize=!0,this._adjustSizes(!0),this._bHandlingResize=!1},_isHorizontal:function(){return"vertical"!==this.options.orientation},_isLoopingPage:function(){return"page"===this.options.looping},_getCssPositionAttr:function(){return this._isHorizontal()?this._bRTL?"right":"left":"top"},_getCssSizeAttr:function(){return this._isHorizontal()?"width":"height"},_canCalculateSizes:function(){const t=document.createElement("div"),e=t.style;e.position="absolute",e.width="10px",e.height="10px";const i=this.element[0];i.appendChild(t);let s=!1;try{s=t.offsetWidth>0&&t.offsetHeight>0}catch(t){}return i.removeChild(t),s},_wrapChildren:function(){const t=this.element,e=this._isHorizontal(),i=t.children();i.addClass("oj-filmstrip-item").wrap('<div class="oj-filmstrip-container oj-filmstrip-item-container"></div>');const s=this._getCssPositionAttr(),n=t.children().wrapAll('<div class="oj-filmstrip-container oj-filmstrip-pages-container"></div>').parent().css(s,"0px");this._pagesWrapper=n;const o=this.options;"hidden"!==o.arrowVisibility&&"adjacent"===o.arrowPlacement&&(this._contentWrapper=n.wrap('<div class="oj-filmstrip-container oj-filmstrip-content-container"></div>').parent()),t.addClass("oj-filmstrip-container"),e||t.addClass("oj-filmstrip-vertical");const r=this._createPageInfoElem(),a=t.attr("id"),l=r.attr("id");t.append(r),t.attr("aria-labelledby",`${a} ${l}`),this._pageInfoElem=r,"hidden"!==o.arrowVisibility&&i.length>0&&(this._prevButton=this._createPrevNavArrow(),this._nextButton=this._createNextNavArrow(),this._navArrowsShownOnHover()&&this._setupNavArrowsHoverable())},_unwrapChildren:function(){const t=this.element,e=this._getItems();this._tearDownNavArrowsHoverable(),this._prevButton&&(this._UnregisterChildNode(this._prevButton),this._prevButton=null),this._nextButton&&(this._UnregisterChildNode(this._nextButton),this._nextButton=null);const i=t.children(".oj-filmstrip-arrow-container");i&&i.remove(),this._pageInfoElem&&(this._UnregisterChildNode(this._pageInfoElem),this._pageInfoElem.remove(),this._pageInfoElem=null),e.removeClass("oj-filmstrip-item").unwrap().unwrap(),this._pagesWrapper=null,this._contentWrapper&&(e.unwrap(),this._contentWrapper=null),t.removeClass("oj-filmstrip-container oj-filmstrip-vertical")},_createPageInfoElem:function(){const t=i(document.createElement("div"));return t.uniqueId(),t.addClass("oj-helper-hidden-accessible oj-filmstrip-liveregion"),t.attr({"aria-live":"polite","aria-atomic":"true"}),t},_updatePageInfoElem:function(){const t=this._pagingModel,e=t.getPage(),i=t.getPageCount(),s=h(this.getTranslatedString("labelAccFilmStrip",{pageIndex:e+1,pageCount:i})),n=this._pageInfoElem;n&&n.text(s)},_setupNavArrowsHoverable:function(){this.element.on("mouseenter"+this.navArrowHoverableEventNamespace,function(t){i(t.currentTarget).hasClass("oj-disabled")||i(t.currentTarget).addClass("oj-filmstrip-hover")}).on("mouseleave"+this.navArrowHoverableEventNamespace,function(t){i(t.currentTarget).removeClass("oj-filmstrip-hover")})},_tearDownNavArrowsHoverable:function(){this.element.off(this.navArrowHoverableEventNamespace)},_navArrowsShownOnHover:function(){const t=this.options,e=t.arrowVisibility;return"hover"===e||"auto"===e&&"overlay"===t.arrowPlacement},_hasPrevPage:function(){return this._pagingModel.getPage()>0},_hasNextPage:function(){const t=this._pagingModel;return t.getPage()<t.getPageCount()-1},_prevPage:function(){const t=this._pagingModel;if(this._hasPrevPage())t.setPage(t.getPage()-1);else{const e=t.getPageCount();this._isLoopingPage()&&e>1&&t.setPage(e-1,{loopDirection:"prev"})}},_nextPage:function(){const t=this._pagingModel;if(this._hasNextPage())t.setPage(t.getPage()+1);else{const e=t.getPageCount();this._isLoopingPage()&&e>1&&t.setPage(0,{loopDirection:"next"})}},_displayNavigationArrow:function(t,e){"adjacent"===this.options.arrowPlacement?e.css("visibility",t?"":"hidden"):e.parent().css("display",t?"":"none")},_updateNavigationArrowsDisplay:function(){if("hidden"!==this.options.arrowVisibility){const t=this._pagingModel,e=t.getPage(),i=t.getPageCount(),s=this._isLoopingPage()&&i>1;this._displayNavigationArrow(s||0!==e,this._prevButton),this._displayNavigationArrow(s||e!==i-1,this._nextButton)}},_createPrevNavArrow:function(){const t=this.element,e=this._isHorizontal()?"oj-start":"oj-top",i=this._createNavigationArrowContainer(e);"overlay"===this.options.arrowPlacement?t.append(i):t.prepend(i);const s=h(this.getTranslatedString("labelAccArrowPreviousPage")),n=h(this.getTranslatedString("tipArrowPreviousPage")),o=this._createNavigationArrow(i,e,s,n),r=this;return o.on("click",function(){r._prevPage()}),o},_createNextNavArrow:function(){const t=this.element,e=this._isHorizontal()?"oj-end":"oj-bottom",i=this._createNavigationArrowContainer(e);t.append(i);const s=h(this.getTranslatedString("labelAccArrowNextPage")),n=h(this.getTranslatedString("tipArrowNextPage")),o=this._createNavigationArrow(i,e,s,n),r=this;return o.on("click",function(){r._nextPage()}),o},_createNavigationArrowContainer:function(t){const e=i(document.createElement("div"));e.addClass("oj-filmstrip-arrow-container "+t);return"overlay"===this.options.arrowPlacement&&(e.addClass("oj-filmstrip-arrow-container-overlay"),this._navArrowsShownOnHover()&&e.addClass("oj-filmstrip-arrow-transition")),e},_createNavigationArrow:function(t,e,i,s){const n=`<div class='oj-filmstrip-arrow oj-default oj-enabled ${e}' role='button' tabindex='-1'><span class='oj-filmstrip-arrow-icon ${e} oj-component-icon'></span></div>`;t.append(n);const o=t.children(".oj-filmstrip-arrow").eq(0);o.uniqueId();const r=o.attr("id");i&&o.attr("aria-label",i),s&&o.attr("title",s);const a=this._pageInfoElem.attr("id");o.attr("aria-labelledby",`${a} ${r}`),this._AddHoverable(o),this._AddActiveable(o);return"adjacent"===this.options.arrowPlacement&&this._navArrowsShownOnHover()&&o.addClass("oj-filmstrip-arrow-transition"),o},_getItemContainers:function(){return this._pagesWrapper.find(".oj-filmstrip-item-container").filter(this._filterNestedFilmStripsFunc)},_getItems:function(){return this._pagesWrapper.find(".oj-filmstrip-item").filter(this._filterNestedFilmStripsFunc)},_getPages:function(){return this._pagesWrapper.children(".oj-filmstrip-page")},_clearCalculatedSizes:function(){const t=this._pagesWrapper;this._getPages().css("flex-basis","").css("-webkit-flex-basis","");this._getItemContainers().css("flex-basis","").css("-webkit-flex-basis",""),t.css(this._getCssSizeAttr(),"")},_adjustSizes:function(t){this._clearCalculatedSizes();const e=this.options,s=this._isHorizontal();let o=e.maxItemsPerPage;const r=o<1,a=this.element,l=this._getItemContainers();if(this._itemSize<0){if(this._getItems().length){const t=this._getItemIndex(e.currentItem);let o;o=t>-1&&l[t]?i(l[t]):i(l[0]);const r=o.children(".oj-filmstrip-item");r.css("display",""),n.subtreeShown(r[0]),this._itemSize=s?o.width():o.height()}}let h=s?a.width():a.height();if("hidden"!==e.arrowVisibility&&"adjacent"===e.arrowPlacement){const t=a.children(".oj-filmstrip-arrow-container").eq(0);h-=2*(s?t.width():t.height())}if(this._componentSize=h,!r){const t=Math.max(Math.floor(h/this._itemSize),1);t<o&&(o=t)}const c=r?Math.max(Math.floor(h/this._itemSize),1):o,u=h/c;l.css("flex-basis",u+"px").css("-webkit-flex-basis",u+"px");const p=Math.ceil(l.length/c);let d=this._getPages(),g=!1;const _=this._pagingModel;if(_.getPageCount()!==p||this._itemsPerPage!==c||!d||d.length<1){let e;if(g=!0,t)for(e=0;e<l.length;e++)n.subtreeDetached(l[e]);for(d&&d.length>0&&l.unwrap(),e=0;e<l.length;e+=c){l.slice(e,e+c).wrapAll('<div class="oj-filmstrip-container oj-filmstrip-page" aria-hidden="true"></div>').parent().css("display","none")}if(t)for(e=0;e<l.length;e++)n.subtreeAttached(l[e])}d=this._getPages(),d.css("flex-basis",h+"px").css("-webkit-flex-basis",h+"px");const f=this._pagesWrapper,m=this._contentWrapper;if(f.css(this._getCssSizeAttr(),h),m&&m.css(this._getCssSizeAttr(),h),l.length){let t=0;if(e.currentItem&&(t=this._findTargetPage(e.currentItem,c)),t>-1&&(_.getPageCount()!==p||this._itemsPerPage!==c||_.getPage()!==t))_.setPage(t,{pageSize:c});else if(g){const t=_.getPage();this._handlePage({previousPage:t,page:t})}}},_handlePage:function(t){const e=t.page,s=t.loopDirection,n=t.previousPage,o=this._pagesWrapper,r=this._getPages(),a=this._pagingModel,l=a.getPageSize(),h=a.getPageCount(),c=n<0||n===e||this._itemsPerPage!==l,u=this._isLoopingPage();this._itemsPerPage=l;let p=null;c||(p=i(r[n]));const d=this._getCssPositionAttr(),g=i(r[e]),_=g.is(":hidden");_&&this._unhidePage(g);let f,m=this._bDragInit;if(n>-1&&!c){f=e>n,u&&s&&(f="next"===s);const t=u&&!f&&h>1&&0===n,i=u&&f&&h>1&&n===h-1;m=!0,o.css(this._getCssSizeAttr(),2*this._componentSize),f||_&&o.css(d,-this._componentSize+"px"),f?(p&&p.addClass("oj-filmstrip-transition-next-oldpage-from"),g.addClass("oj-filmstrip-transition-next-newpage-from"),i&&g.addClass("oj-filmstrip-transition-display-as-lastpage")):(p&&p.addClass("oj-filmstrip-transition-prev-oldpage-from"),g.addClass("oj-filmstrip-transition-prev-newpage-from"),t&&g.addClass("oj-filmstrip-transition-display-as-firstpage"))}if(this._busyStateResolveFunc=this._addBusyState("scrolling"),m){const t=this,i=this._bDragInit;if(i&&n<0){r.filter(":visible").addClass("oj-filmstrip-transition")}setTimeout(function(){t._finishHandlePage(e,n,f,c,i)},25)}else this._finishHandlePage(e,n,f,c)},_finishHandlePage:function(e,s,n,o,r){const a=this._pagesWrapper;if(o||(this._bPageChangeTransition=!0,a.on(`transitionend${this.eventNamespace} webkitTransitionEnd${this.eventNamespace}`,this._handleTransitionEndFunc)),o)this._handleTransitionEnd();else{const o=this._getPages();if(r&&l(o),s>-1){const t=i(o[s]),r=i(o[e]);t.addClass("oj-filmstrip-transition"),r.addClass("oj-filmstrip-transition"),n?(t.removeClass("oj-filmstrip-transition-next-oldpage-from"),r.removeClass("oj-filmstrip-transition-next-newpage-from"),t.addClass("oj-filmstrip-transition-next-oldpage-to"),r.addClass("oj-filmstrip-transition-next-newpage-to")):(t.removeClass("oj-filmstrip-transition-prev-oldpage-from"),r.removeClass("oj-filmstrip-transition-prev-newpage-from"),t.addClass("oj-filmstrip-transition-prev-oldpage-to"),r.addClass("oj-filmstrip-transition-prev-newpage-to"))}else if(r){t(o.filter(":visible"),"translate3d(0, 0, 0)")}}},_handleTransitionEnd:function(){this._bPageChangeTransition=!1;const t=this._pagesWrapper,e=this._getCssPositionAttr();t.off(this.eventNamespace).css(this._getCssSizeAttr(),this._componentSize).css(e,"0px");let s=null;(a.containsFocus(t[0])||this._nextButton&&a.containsFocus(this._nextButton[0])||this._prevButton&&a.containsFocus(this._prevButton[0]))&&(s=document.activeElement);const n=this._pagingModel.getPage(),o=this._getPages();for(let t=0;t<o.length;t++)t!==n&&this._hidePage(i(o[t]));if(o.removeClass("oj-filmstrip-transition oj-filmstrip-transition-next-oldpage-to oj-filmstrip-transition-next-newpage-to oj-filmstrip-transition-prev-oldpage-to oj-filmstrip-transition-prev-newpage-to oj-filmstrip-transition-display-as-firstpage oj-filmstrip-transition-display-as-lastpage"),l(o),this._updateNavigationArrowsDisplay(),s&&i(s).is(":hidden")){const t=this.element,e=a.getFirstTabStop(o[n]);e?a.focusElement(e):a.focusElement(t[0])}const r=this.options;if(this._findPage(r.currentItem)!==n){const t=this._getFirstItemOnPage(n);t&&this.option("currentItem",t,{_context:{writeback:!0}})}this._deferredHandleResize&&(this._deferredHandleResize=!1,this._handleResize()),this._updatePageInfoElem(),this._resolveBusyState()},_getItemIndex:function(t){let e=-1;if(t){const i=this._getItems();if(t.id&&r.isValidIdentifier(t.id))for(let s=0;s<i.length;s++){const n=i[s].id;if(n&&n.length>0&&n===t.id){e=s;break}}else null!=t.index&&t.index>=0&&t.index<i.length&&(e=t.index)}return e},_convertCurrentItemToObj:function(t){let e=null;return"object"==typeof t?e={index:t.index,id:t.id}:"number"==typeof t?e={index:t}:"string"==typeof t&&(e={id:t}),e},_populateCurrentItemObj:function(t){if(t&&this._pagingModel.getPage()>=0){const e=this._getItemIndex(t);if(t.index=e,null==t.id&&e>-1){const i=this._getItems();t.id=i[e].id}}},_findPage:function(t,e){const i=this._getItemIndex(t);let s=-1;return i>-1&&(void 0===e&&(e=this._itemsPerPage),s=Math.floor(i/e)),s},_findTargetPage:function(t,e){let i=this._findPage(t,e);if(i<0){const s=this._getItems();s.length>0&&t&&null!=t.index&&t.index>=s.length&&(void 0===e&&(e=this._itemsPerPage),i=Math.floor((s.length-1)/e))}return i},_getFirstItemOnPage:function(t,e,i){const s=this._pagingModel;if(void 0===e&&(e=s.getPageCount()),t>=0&&t<e){const e=this._getItems();void 0===i&&(i=this._itemsPerPage);const s=t*i;if(s<e.length){return{id:e[s].id,index:s}}}return null},_hidePage:function(t){n.subtreeHidden(t[0]),t.css("display","none").attr("aria-hidden","true");t.find(".oj-filmstrip-item").filter(this._filterNestedFilmStripsFunc).css("display","none")},_unhidePage:function(t){t.css("display","").removeAttr("aria-hidden");t.find(".oj-filmstrip-item").filter(this._filterNestedFilmStripsFunc).css("display",""),n.subtreeShown(t[0])},_addKeyListeners:function(){this.element.on("keydown"+this.keyEventNamespace,this._handleKeyDownFunc)},_removeKeyListeners:function(){this.element.off(this.keyEventNamespace)},_addMouseListeners:function(){this.element.on("mousedown"+this.mouseEventNamespace,this._handleMouseDownFunc).on("mousemove"+this.mouseEventNamespace,this._handleMouseMoveFunc).on("mouseup"+this.mouseEventNamespace,this._handleMouseUpFunc)},_removeMouseListeners:function(){this.element.off(this.mouseEventNamespace)},_addTouchListeners:function(){const t=this.element;if(this._IsCustomElement()){const e=function(t){return function(e){t(i.Event(e))}};this._delegatedHandleTouchStartFunc=e(this._handleTouchStartFunc),this._delegatedHandleTouchMoveFunc=e(this._handleTouchMoveFunc),t[0].addEventListener("touchstart",this._delegatedHandleTouchStartFunc,{passive:!0}),t[0].addEventListener("touchmove",this._delegatedHandleTouchMoveFunc,{passive:!1}),t.on("touchend"+this.touchEventNamespace,this._handleTouchEndFunc).on("touchcancel"+this.touchEventNamespace,this._handleTouchEndFunc)}else t.on("touchstart"+this.touchEventNamespace,this._handleTouchStartFunc).on("touchmove"+this.touchEventNamespace,this._handleTouchMoveFunc).on("touchend"+this.touchEventNamespace,this._handleTouchEndFunc).on("touchcancel"+this.touchEventNamespace,this._handleTouchEndFunc)},_removeTouchListeners:function(){this.element.off(this.touchEventNamespace)},_handleKeyDown:function(t){if(t.target!==this.element[0])return;const e=this._pagingModel,s=e.getPage(),n=e.getPageCount();let o;switch(t.keyCode){case i.ui.keyCode.RIGHT:o=this._bRTL?s-1:s+1;break;case i.ui.keyCode.LEFT:o=this._bRTL?s+1:s-1;break;case i.ui.keyCode.DOWN:o=s+1;break;case i.ui.keyCode.UP:o=s-1;break;case i.ui.keyCode.HOME:o=0;break;case i.ui.keyCode.END:o=n-1;break;default:return}if(o>-1&&o<n)e.setPage(o);else if(this._isLoopingPage()&&n>1){const t={};o===n&&(o=0,t.loopDirection="next"),-1===o&&(o=n-1,t.loopDirection="prev"),e.setPage(o,t)}t.preventDefault()},_handleMouseDown:function(t){const e=t.originalEvent;this._dragScrollStart(e)},_handleMouseMove:function(t){const e=t.originalEvent;this._dragScrollMove(t,e)},_handleMouseUp:function(){this._dragScrollEnd()},_handleTouchStart:function(t){const e=t.originalEvent.touches;if(1===e.length){const t=e[0];this._dragScrollStart(t)}},_handleTouchMove:function(t){const e=t.originalEvent.touches[0];this._dragScrollMove(t,e),(this._bTouch||this._scrolledForThisTouch)&&t.preventDefault()},_handleTouchEnd:function(){this._dragScrollEnd()},_dragScrollStart:function(t){if(this._pagingModel.getPageCount()>1&&!this._bPageChangeTransition){this._bTouch=!0,this._bDragInit=!1,this._bFirstToLast=!1,this._bLastToFirst=!1;const e=this._isHorizontal();this._touchStartCoord=e?t.pageX:t.pageY,this._touchStartCoord2=e?t.pageY:t.pageX}},_initDragScroll:function(t,e,s){const n=this._isHorizontal();this._touchStartCoord=n?t.pageX:t.pageY,this._touchStartCoord2=n?t.pageY:t.pageX;const o=this._getCssPositionAttr(),r=this._pagesWrapper,a=this._pagingModel,l=a.getPage(),h=a.getPageCount(),c=this._getPages();let u=1;e||s?(e&&(this._unhidePage(i(c[h-1])),r.css(o,-this._componentSize+"px"),u+=1,i(c[h-1]).addClass("oj-filmstrip-transition-display-as-firstpage")),s&&(this._unhidePage(i(c[0])),u+=1,i(c[0]).addClass("oj-filmstrip-transition-display-as-lastpage"))):(l>0&&(this._unhidePage(i(c[l-1])),r.css(o,-this._componentSize+"px"),u+=1),l<h-1&&(this._unhidePage(i(c[l+1])),u+=1)),u>1&&r.css(this._getCssSizeAttr(),u*this._componentSize),this._touchStartScroll=parseInt(r.css(o),10)},_dragScrollMove:function(e,s){if(!this._bTouch)return;const n=this._isHorizontal(),o=(n?s.pageX:s.pageY)-this._touchStartCoord,r=(n?s.pageY:s.pageX)-this._touchStartCoord2,a=n&&this._bRTL?o>0:o<0,l=this._pagingModel,h=l.getPage(),c=l.getPageCount(),u=this._isLoopingPage(),p=u&&!a&&c>1&&0===h,d=u&&a&&c>1&&h===c-1;if(!this._bDragInit)return Math.abs(r)>Math.abs(o)&&(this._bTouch=!1,this._scrolledForThisTouch=!1),Math.abs(o)>3&&(this._initDragScroll(s,p,d),this._bDragInit=!0),this._bFirstToLast=p,void(this._bLastToFirst=d);p===this._bFirstToLast&&d===this._bLastToFirst||(this._dragScrollResetPages(),this._initDragScroll(s,p,d),this._bFirstToLast=p,this._bLastToFirst=d);if(a&&h<l.getPageCount()-1||!a&&h>0||u){const e=this.element[0],s=Math.min(.33*(n?e.offsetWidth:e.offsetHeight),100),r=this._getCssPositionAttr(),u=this._pagesWrapper,g=this._getPages();if(Math.abs(o)>=s){let t,e;const s={};if(p||d?(p?(t=c-1,e=c>2?1:-1):(t=0,e=c>2?c-2:-1),s.loopDirection=a?"next":"prev"):(t=a?h+1:h-1,e=a?h-1:h+1),e>-1&&e<l.getPageCount()&&this._hidePage(i(g[e])),a&&e>-1&&!d){const t=parseInt(u.css(r),10);u.css(r,t+this._componentSize+"px")}u.css(this._getCssSizeAttr(),2*this._componentSize),this._bTouch=!1,l.setPage(t,s)}else{const e=o,i=n?`translate3d(${e}px, 0, 0)`:`translate3d(0, ${e}px, 0)`;t(g.filter(":visible"),i)}this._scrolledForThisTouch=!0}this._scrolledForThisTouch&&(e.preventDefault(),e.stopPropagation())},_dragScrollEnd:function(){if(this._bTouch&&this._bDragInit){const t=this._pagingModel.getPage();this._handlePage({previousPage:t,page:t})}this._bTouch=!1,this._bDragInit=!1,this._bFirstToLast=!1,this._bLastToFirst=!1,this._scrolledForThisTouch=!1},_dragScrollResetPages:function(){const t=this._pagesWrapper,e=this._getCssPositionAttr(),s=this._pagingModel,n=s.getPage(),o=s.getPageCount(),r=this._getPages();for(let t=0;t<r.length;t++)t!==n&&this._hidePage(i(r[t]));t.css(e,"0px"),i(r[0]).removeClass("oj-filmstrip-transition-display-as-lastpage"),i(r[o-1]).removeClass("oj-filmstrip-transition-display-as-firstpage")},_addBusyState:function(t){const e=this.element,i=s.getContext(e[0]).getBusyContext(),n={description:`FilmStrip (id='${e.attr("id")}'): ${t}`};return i.addBusyState(n)},_resolveBusyState:function(){this._busyStateResolveFunc&&(this._busyStateResolveFunc(),this._busyStateResolveFunc=null)},getNodeBySubId:function(t){if(null==t)return this.element?this.element[0]:null;const e=t.subId;return"oj-filmstrip-start-arrow"===e?this.widget().find(".oj-filmstrip-arrow.oj-start").filter(this._filterNestedFilmStripsFunc)[0]:"oj-filmstrip-end-arrow"===e?this.widget().find(".oj-filmstrip-arrow.oj-end").filter(this._filterNestedFilmStripsFunc)[0]:"oj-filmstrip-top-arrow"===e?this.widget().find(".oj-filmstrip-arrow.oj-top").filter(this._filterNestedFilmStripsFunc)[0]:"oj-filmstrip-bottom-arrow"===e?this.widget().find(".oj-filmstrip-arrow.oj-bottom").filter(this._filterNestedFilmStripsFunc)[0]:null},getSubIdByNode:function(t){const e=this.getNodeBySubId({subId:"oj-filmstrip-start-arrow"}),i=this.getNodeBySubId({subId:"oj-filmstrip-end-arrow"}),s=this.getNodeBySubId({subId:"oj-filmstrip-top-arrow"}),n=this.getNodeBySubId({subId:"oj-filmstrip-bottom-arrow"});let o=t;const r=this.element[0];for(;o&&o!==r;){if(o===e)return{subId:"oj-filmstrip-start-arrow"};if(o===i)return{subId:"oj-filmstrip-end-arrow"};if(o===s)return{subId:"oj-filmstrip-top-arrow"};if(o===n)return{subId:"oj-filmstrip-bottom-arrow"};o=o.parentElement}return null},_CompareOptionValues:function(t,i,s){return"currentItem"===t?e.Object.compareValues(i,s):this._super(t,i,s)}})}(),t.FilmStripPagingModel=c,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=ojfilmstrip.js.map