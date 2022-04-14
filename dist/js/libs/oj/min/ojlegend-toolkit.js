/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojdvt-toolkit"],function(e,t){"use strict";const i=(e,t)=>{var i=null,s=null!=t.getOptions().data;return e.categories&&e.categories.length>0?i=e.categories[0]:s||(i=e.id?e.id:e.text),i},s=(e,t)=>{var i=t.getOptions().hiddenCategories;return!(!i||i.length<=0)&&-1!==i.indexOf(e)},n=(e,t)=>{var i=t.getOptions();return"off"==e.expanded||0==e.expanded||i.expanded&&0==i.expanded.has(e.id)};class a{constructor(e,s,n,a,r,l){if(this._legend=e,this._displayables=s,this._item=n,this._category=i(this._item,this._legend),this._id=this._category?this._category:n.title,this._drillable=l,this._tooltip=a,this._datatip=r,this._isShowingKeyboardFocusEffect=!1,this._hoverBorderRadius=parseInt(e.getOptions()._hoverBorderRadius),this._drillable)for(var o=0;o<this._displayables.length;o++)this._displayables[o].setCursor(t.SelectionEffectUtils.getSelectingCursor())}static associate(e,t,i,s,n,r){if(!e||!i)return null;var l=new a(t,e,i,s,n,r);t.__registerObject(l);for(var o=0;o<e.length;o++)t.getEventManager().associate(e[o],l);return l}getData(){return this._item}getColor(){return this._item.color}getId(){return this._id}getDisplayables(){return this._displayables}getCategories(){return null!=this._category?[this._category]:null}isDrillable(){return this._drillable}getAriaLabel(){var e=[],i=this._legend.getOptions().translations,a=this._legend.getOptions().hideAndShowBehavior,r=s(this._category,this._legend),l=this.getData();return this._displayables[0]instanceof t.IconButton?(e.push(i[n(l,this._legend)?"stateCollapsed":"stateExpanded"]),t.Displayable.generateAriaLabel(l.title,e)):("off"!=a&&"none"!=a&&e.push(i[r?"stateHidden":"stateVisible"]),this.isDrillable()&&e.push(i.stateDrillable),null!=l.shortDesc?t.Displayable.generateAriaLabel(l.shortDesc,e):e.length>0?t.Displayable.generateAriaLabel(l.text,e):null)}updateAriaLabel(){!t.Agent.deferAriaCreation()&&this._displayables[0]&&this._displayables[0].setAriaProperty("label",this.getAriaLabel())}getNextNavigable(e){if(e.type==t.MouseEvent.CLICK)return this;var i=this._legend.__getKeyboardObjects();return t.KeyboardHandler.getNextNavigable(this,e,i,!0,this._legend,!0)}getKeyboardBoundingBox(e){return this._displayables[0]?this._displayables[0].getDimensions(e):new t.Rectangle(0,0,0,0)}getTargetElem(){return this._displayables[0]?this._displayables[0].getElem():null}showKeyboardFocusEffect(){this._isShowingKeyboardFocusEffect=!0,this._displayables[0]&&(this._displayables[0]instanceof t.IconButton?this._displayables[0].showKeyboardFocusEffect():this._displayables[0].setSolidStroke(t.Agent.getFocusColor()))}hideKeyboardFocusEffect(){this._isShowingKeyboardFocusEffect=!1,this._displayables[0]&&(this._displayables[0]instanceof t.IconButton?this._displayables[0].hideKeyboardFocusEffect():this._displayables[0].setStroke(null))}isShowingKeyboardFocusEffect(){return this._isShowingKeyboardFocusEffect}getTooltip(){return this._tooltip}getDatatip(){return this._datatip}getDatatipColor(){return this._item.color}isDragAvailable(){return!0}getDragTransferable(){return[this.getId()]}getDragFeedback(){return this.getDisplayables()}showHoverEffect(){this._displayables[0]&&this._displayables[0]instanceof t.Rect&&(this._displayables[0].setClassName("oj-legend-hover"),this._displayables[0].setRx(this._hoverBorderRadius))}hideHoverEffect(){this._displayables[0]&&this._displayables[0]instanceof t.Rect&&(this._displayables[0].setClassName(),this._displayables[0].setRx(0))}}class r extends t.Automation{GetSubIdForDomElement(e){var t=this._comp.getEventManager().GetLogicalObject(e);if(t&&t instanceof a){var i=t.getData(),s=this._getIndicesFromItem(i,this._comp.getOptions());if(s)return"section"+s}return null}_getIndicesFromItem(e,t){if(t.sections&&t.sections.length>0){for(var i=0;i<t.sections.length;i++){if(t.sections[i]==e)return"["+i+"]";var s=this._getIndicesFromItem(e,t.sections[i]);if(s)return"["+i+"]"+s}return null}if(t.items&&t.items.length>0){for(var n=0;n<t.items.length;n++)if(t.items[n]==e)return":item["+n+"]";return null}return null}getIndicesFromSeries(e,t){if(t.sections&&t.sections.length>0){for(var i=0;i<t.sections.length;i++){var s=this.getIndicesFromSeries(e,t.sections[i]);if(s)return"["+i+"]"+s}return null}if(t.items&&t.items.length>0){for(var n=0;n<t.items.length;n++)if(t.items[n].text==e.name)return":item["+n+"]";return null}return null}getLegendItem(e,t){var i=t.indexOf("["),s=t.indexOf("]");if(i>=0&&s>=0){var n=t.substring(i+1,s),a=t.indexOf(":"),r=(t=t.substring(s+1)).indexOf("["),l=t.indexOf("]");return r>=0&&l>=0?this.getLegendItem(e.sections[n],t):0==a?e.items[n]:e.sections[n]}}getDomElementForSubId(e){if(e==t.Automation.TOOLTIP_SUBID)return this.GetTooltipElement(this._comp);for(var i=this.getLegendItem(this._comp.getOptions(),e),s=this._comp.__getObjects(),n=0;n<s.length;n++){if(i==s[n].getData())return s[n].getDisplayables()[0].getElem()}return null}getTitle(){return this._comp.getOptions().title}getItem(e){var t,i=e.shift(),s=this._comp.getOptions();if(!s.sections||0===s.sections.length)return null;for(;null!=i;)e.length>0?s=s.sections[i]:t=s.items[i],i=e.shift();return t?{text:t.text?t.text:null}:null}getSection(e){var t,i=e.shift(),s=this._comp.getOptions();if(!s.sections||0===s.sections.length)return null;for(;null!=i;)e.length>0?s=s.sections[i]:t=s.sections[i],i=e.shift();return{title:t&&t.title?t.title:null,items:t&&t.items?this._generateItemObjects(t.items):null,sections:t&&t.sections?this._generateSectionObjects(t.sections):null}}_generateItemObjects(e){for(var t=[],i=0;i<e.length;i++)t.push({text:e[i].text});return t}_generateSectionObjects(e){for(var t=[],i=0;i<e.length;i++)t.push({title:e[i].title?e[i].title:null,items:e[i].items?this._generateItemObjects(e[i].items):null,sections:e[i].sections?this._generateSectionObjects(e[i].sections):null});return t}}class l extends t.BaseComponentDefaults{constructor(e){super({alta:{skin:t.CSSStyle.SKIN_ALTA,orientation:"vertical",position:null,backgroundColor:null,borderColor:null,textStyle:new t.CSSStyle(t.BaseComponentDefaults.FONT_FAMILY_ALTA_11+"color: #333333;"),titleStyle:new t.CSSStyle(t.BaseComponentDefaults.FONT_FAMILY_ALTA_11+"color: #737373;"),_sectionTitleStyle:new t.CSSStyle(t.BaseComponentDefaults.FONT_FAMILY_ALTA_11+"color: #737373;"),titleHalign:"start",hiddenCategories:[],hideAndShowBehavior:"off",hoverBehavior:"none",hoverBehaviorDelay:200,scrolling:"asNeeded",halign:"start",valign:"top",drilling:"off",dnd:{drag:{series:{}},drop:{legend:{}}},_color:"#a6acb1",_markerShape:"square",_lineWidth:3,layout:{outerGapWidth:3,outerGapHeight:3,titleGapWidth:17,titleGapHeight:9,symbolGapWidth:7,symbolGapHeight:4,rowGap:4,columnGap:10,sectionGapHeight:16,sectionGapWidth:24},isLayout:!1}},e)}static getGapSize(e,i){var s=Math.min(t.TextUtils.getTextStringHeight(e.getCtx(),e.getOptions().textStyle)/14,1);return Math.ceil(i*s)}getNoCloneObject(){return{sections:{items:{_getDataContext:!0}}}}}class o extends t.EventManager{constructor(e){super(e.getCtx(),e.processEvent,e,e),this._legend=e}OnClick(e){super.OnClick(e);var t=this.GetLogicalObject(e.target);if(t){var i=this.processHideShowEvent(t),s=this.handleClick(t,e);(i||s)&&e.stopPropagation()}}OnMouseOver(e){super.OnMouseOver(e);var t=this.GetLogicalObject(e.target);t&&this.UpdateActiveElement(t)}HandleTouchClickInternal(e){var t=this.GetLogicalObject(e.target);if(t){var i=e.touchEvent,s=this.processHideShowEvent(t),n=this.handleClick(t,e);(s||n)&&i&&i.preventDefault()}}processHideShowEvent(e){var i=this._legend.getOptions().hideAndShowBehavior;if("none"==i||"off"==i)return!1;var n=e.getCategories?e.getCategories():null;if(!n||n.length<=0)return!1;var a=e.getCategories()[0],r=this._legend.getOptions().hiddenCategories||[];r=r.slice();for(var l=e.getDisplayables(),o=0;o<l.length;o++){var h=l[o];h instanceof t.SimpleMarker?h.setHollow(e.getColor()):h instanceof t.Rect&&e.updateAriaLabel()}var g,d=n[0];return s(a,this._legend)?(r.splice(r.indexOf(a),1),g=t.EventFactory.newCategoryShowEvent(d,r)):(r.push(a),g=t.EventFactory.newCategoryHideEvent(d,r)),this._legend.getOptions().hiddenCategories=r,this.FireEvent(g,this._legend),!0}handleClick(e,i){if(e instanceof a&&e.isDrillable()){var s=e.getId();return this.FireEvent(t.EventFactory.newDrillEvent(s),this._legend),!0}var n=e instanceof t.SimpleObjPeer?e.getParams():null;return!(!n||!n.isCollapsible)&&(this.toggleSectionCollapse(i,n.id),!0)}ProcessRolloverEvent(e,i,s){var n=this._legend.getOptions();if(("none"!==n.hoverBehavior||"none"!==n.hideAndShowBehavior&&"off"!==n.hideAndShowBehavior)&&!(i.getDisplayables&&i.getDisplayables()[0]instanceof t.IconButton)){if("none"!==n.hoverBehavior){var a=i.getCategories?i.getCategories():[];n.highlightedCategories=s&&a?a.slice():null;var r=t.EventFactory.newCategoryHighlightEvent(n.highlightedCategories,s),l=t.CSSStyle.getTimeMilliseconds(n.hoverBehaviorDelay);this.RolloverHandler.processEvent(r,this._legend.__getObjects(),l,!0)}"none"!==n.hideAndShowBehavior&&"off"!==n.hideAndShowBehavior&&(s?i.showHoverEffect&&i.showHoverEffect():i.hideHoverEffect&&i.hideHoverEffect())}}onCollapseButtonClick(e,t){var i=t.getId();this.toggleSectionCollapse(e,i)}toggleSectionCollapse(e,i){for(var s=this._legend.getOptions(),n=s.expanded,a=this._legend.getOptions(),r=null,l=0;l<i.length;l++)a=a.sections[i[l]];if(n?n.has(a.id)?(s.expanded=n.delete([a.id]),r=!1):(s.expanded=n.add([a.id]),r=!0):a.expanded="off"==a.expanded?"on":"off",e.type==t.MouseEvent.CLICK){var o=this.GetLogicalObject(e.target);o.getNextNavigable&&this.setFocusObj(o.getNextNavigable(e))}var h=this._legend.getKeyboardFocus(),g=!!h&&h.isShowingKeyboardFocusEffect();this._legend.render(),h&&this._legend.setKeyboardFocus(h,g),this.hideTooltip(),null!=r&&(e=new t.EventFactory.newExpandCollapseEvent(r?"expand":"collapse",a.id,a,this._legend.getOptions()._widgetConstructor,s.expanded),this.FireEvent(e,this._legend))}GetTouchResponse(){return this._legend.getOptions()._isScrollingLegend?t.EventManager.TOUCH_RESPONSE_TOUCH_HOLD:t.EventManager.TOUCH_RESPONSE_TOUCH_START}isDndSupported(){return!0}GetDragSourceType(e){var t=this.DragSource.getDragObject();return t instanceof a&&null!=t.getData()._getDataContext?"series":null}GetDragDataContexts(e){var i=this.DragSource.getDragObject();if(i instanceof a){var s=i.getData()._getDataContext();return e&&(s=t.JsonUtils.clone(s,null,{component:!0,componentElement:!0}),t.ToolkitUtils.cleanDragDataContext(s)),[s]}return[]}GetDropTargetType(e){var t=this._legend.stageToLocal(this.getCtx().pageToStageCoords(e.pageX,e.pageY)),i=this._legend.getOptions().dnd.drop,s=this._legend.__getBounds();return Object.keys(i.legend).length>0&&s.containsPoint(t.x,t.y)?"legend":null}GetDropEventPayload(e){return{}}ShowDropEffect(e){if("legend"==this.GetDropTargetType(e)){var t=this._legend.getOptions()._dropColor,i=this._legend.getCache().getFromCache("background");i&&(i.setSolidFill(t),i.setClassName("oj-active-drop"))}}ClearDropEffect(){var e=this._legend.getCache().getFromCache("background");if(e){var i=this._legend.getOptions().backgroundColor;i?e.setSolidFill(i):e.setInvisibleFill(),t.ToolkitUtils.removeClassName(e.getElem(),"oj-invalid-drop"),t.ToolkitUtils.removeClassName(e.getElem(),"oj-active-drop")}}ShowRejectedDropEffect(e){if("legend"==this.GetDropTargetType(e)){var t=this._legend.getCache().getFromCache("background");t&&t.setClassName("oj-invalid-drop")}}}class h extends t.KeyboardHandler{constructor(e,t){super(e),this._legend=t}processKeyDown(e){var i=e.keyCode,s=this._eventManager.getFocus(),n=s&&s.getDisplayables()[0]instanceof t.IconButton,a=null;if(null==s&&i==t.KeyboardEvent.TAB){var r=this._legend.__getKeyboardObjects();r.length>0&&(t.EventManager.consumeEvent(e),a=this.getDefaultNavigable(r))}else s&&(i==t.KeyboardEvent.TAB?(t.EventManager.consumeEvent(e),a=s):i==t.KeyboardEvent.ENTER||i==t.KeyboardEvent.SPACE?(i==t.KeyboardEvent.ENTER&&this._eventManager.handleClick(s,e),n?this._eventManager.onCollapseButtonClick(e,s.getDisplayables()[0]):this._eventManager.processHideShowEvent(s),t.EventManager.consumeEvent(e)):!n||i!=t.KeyboardEvent.LEFT_ARROW&&i!=t.KeyboardEvent.RIGHT_ARROW?a=super.processKeyDown(e):(this._eventManager.onCollapseButtonClick(e,s.getDisplayables()[0]),t.EventManager.consumeEvent(e)));return a&&this._legend.container.scrollIntoView(a.getDisplayables()[0]),a}}const g={_DEFAULT_LINE_WIDTH_WITH_MARKER:2,_LINE_MARKER_SIZE_FACTOR:.6,_DEFAULT_SYMBOL_SIZE:10,_BUTTON_SIZE:12,_FOCUS_GAP:2,render:(e,i)=>{var s=e.getOptions(),n=e.getCtx(),a=t.Agent.isRightToLeft(n);e.__setBounds(i),s.isLayout||g._renderBackground(e,i);var r="redwood"===n.getThemeBehavior()?"always":"asNeeded",o=new t.SimpleScrollableContainer(n,i.w,i.h,r),h=new t.Container(n);o.getScrollingPane().addChild(h),e.addChild(o),e.container=o;var d=l.getGapSize(e,s.layout.outerGapWidth),c=l.getGapSize(e,s.layout.outerGapHeight);if(i.x+=d,i.y+=c,i.w-=2*d,i.h-=2*c,i.w<=0||i.h<=0)return new t.Dimension(0,0);var u=g._renderContents(e,h,new t.Rectangle(i.x,i.y,i.w,i.h));if(0==u.w||0==u.h)return new t.Dimension(0,0);o.prepareContentPane(),u.h>i.h?(u.h=i.h,s._isScrollingLegend=!0):s._isScrollingLegend=!1;var p=0,_=0,v=null!=s.hAlign?s.hAlign:s.halign;"center"==v?p=i.x-u.x+(i.w-u.w)/2:"end"==v&&(p=a?i.x-u.x:i.x-u.x+i.w-u.w);var y=null!=s.vAlign?s.vAlign:s.valign;"middle"==y?_=i.y-u.y+(i.h-u.h)/2:"bottom"==y&&(_=i.y-u.y+i.h-u.h);var b=new t.Rectangle(u.x+p-d,u.y+_-c,u.w+2*d,u.h+2*c);if(s.isLayout)return b;(p||_)&&h.setTranslate(p,_);for(var m=e.__getTitles(),f=0;f<m.length;f++)t.LayoutUtils.align(u,m[f].halign,m[f].text,m[f].text.getDimensions().w);return b},_renderContents:(e,t,i)=>{var s=e.getOptions();i=i.clone();var n=g._renderTitle(e,t,s.title,i,null,!0);if(n){var a=n.getDimensions(),r=l.getGapSize(e,s.layout.titleGapHeight);i.y+=a.h+r,i.h-=Math.floor(a.h+r)}var o=g._renderSections(e,t,s.sections,i,[]);return n?a.getUnion(o):o},_renderBackground:(e,i)=>{var s=e.getOptions(),n=s.backgroundColor,a=s.borderColor,r=s.dnd?s.dnd.drop.legend:{},l=s.dnd?s.dnd.drag.series:{};if(n||a||Object.keys(r).length>0||Object.keys(l).length>0){var o=new t.Rect(e.getCtx(),i.x,i.y,i.w,i.h);n?o.setSolidFill(n):o.setInvisibleFill(),a&&(o.setSolidStroke(a),o.setPixelHinting(!0)),e.addChild(o),e.getCache().putToCache("background",o)}},_renderTitle:(e,i,s,n,a,r,l,o)=>{var h=e.getOptions(),g=i.getCtx(),d=t.Agent.isRightToLeft(g);if(!s)return null;var c=new t.OutputText(g,s,n.x,n.y),u=h.titleStyle;if(a){var p=h._sectionTitleStyle.clone();u=a.titleStyle?p.merge(new t.CSSStyle(a.titleStyle)):p}if(c.setCSSStyle(u),t.TextUtils.fitText(c,n.w,1/0,i)){if(d&&c.setX(n.x+n.w-c.getDimensions().w),h.isLayout)i.removeChild(c);else{var _={id:l,button:o};if(_.isCollapsible=a&&("on"===a.collapsible||"boolean"==typeof a.collapsible&&a.collapsible),e.getEventManager().associate(c,new t.SimpleObjPeer(c.getUntruncatedTextString(),null,null,_)),r){var v=a&&a.titleHalign?a.titleHalign:h.titleHalign;e.__registerTitle({text:c,halign:v})}}return c}return null},_renderSections:(e,i,s,a,r)=>{if(!s||0==s.length)return new t.Rectangle(0,0,0,0);var o=e.getOptions();o.symbolWidth||o.symbolHeight?(o.symbolWidth?o.symbolHeight||(o.symbolHeight=o.symbolWidth):o.symbolWidth=o.symbolHeight,o.symbolWidth=parseInt(o.symbolWidth),o.symbolHeight=parseInt(o.symbolHeight)):(o.symbolWidth=g._DEFAULT_SYMBOL_SIZE,o.symbolHeight=g._DEFAULT_SYMBOL_SIZE);for(var h,d=l.getGapSize(e,o.layout.sectionGapHeight),c=l.getGapSize(e,o.layout.titleGapHeight),u=l.getGapSize(e,o.layout.sectionGapWidth),p=g._getRowHeight(e),_="vertical"!=o.orientation,v=null,y=a.clone(),b=0;b<s.length;b++){var m=r.concat([b]),f=n(s[b],e)?c:d;_?(h=g._renderHorizontalSection(e,i,s[b],y,p)).w>y.w?(y.w<a.w&&(a.y+=h.h+f,a.h-=h.h+f),h=h.w<=a.w?g._renderHorizontalSection(e,i,s[b],a,p):g._renderVerticalSection(e,i,s[b],a,p,m,!0),a.y+=h.h+f,a.h-=h.h+f,y=a.clone()):(y.w-=h.w+u,t.Agent.isRightToLeft(e.getCtx())||(y.x+=h.w+u)):(h=g._renderVerticalSection(e,i,s[b],a,p,m,!1),a.y+=h.h+f,a.h-=h.h+f),v=v?v.getUnion(h):h}return v},_createButton:(e,i,s,n,r,l,o,h,d,c,u)=>{var p=t.ToolkitUtils.getIconStyle(e,n[r]),_=new t.IconButton(e,"borderless",{style:p,size:g._BUTTON_SIZE},null,d,c,u);_.setTranslate(l,o);var v=a.associate([_],i,s,h,null,!1);return _.setAriaRole("button"),v.updateAriaLabel(),_},_renderVerticalSection:(e,i,s,a,r,o,h)=>{if(s){var d,c=e.getOptions(),u=l.getGapSize(e,c.layout.symbolGapWidth),p=l.getGapSize(e,c.layout.rowGap),_=l.getGapSize(e,c.layout.columnGap),v=e.getCtx(),y=t.Agent.isRightToLeft(v),b=null!=s.sections&&s.sections.length>0,m=null!=s.items&&s.items.length>0,f=a.clone();"off"!=c.scrolling&&(f.h=1/0);var C,S="on"===s.collapsible||"boolean"==typeof s.collapsible&&s.collapsible;if(S){var x=y?f.x+f.w-g._BUTTON_SIZE:f.x;if(!c.isLayout){var w=n(s,e),O=w?"closed":"open",E=c.translations[w?"tooltipExpand":"tooltipCollapse"],T=e.getEventManager();C=g._createButton(v,e,s,c._resources,O,x,f.y,E,o,T.onCollapseButtonClick,T),i.addChild(C)}d=new t.Rectangle(x,f.y,g._BUTTON_SIZE,g._BUTTON_SIZE);var D=l.getGapSize(e,c.layout.symbolGapWidth);y||(f.x+=g._BUTTON_SIZE+D),f.w-=g._BUTTON_SIZE+D}var A=g._renderTitle(e,i,s.title,f,s,!S&&o.length<=1,o,C),M=y?f.x+f.w:f.x,I=A?A.getDimensions():new t.Rectangle(M,f.y,0,0),L=d?I.getUnion(d):I;if(!m&&!b||n(s,e))return L;if(L.h>0){var F=l.getGapSize(e,c.layout.titleGapHeight);f.y+=L.h+F,f.h-=L.h+F}if(b){var R=g._renderSections(e,i,s.sections,f,o);L=L.getUnion(R)}if(!m)return L;var G=g._calcColumns(e,f,r,s.items,h),k=G.numCols,H=G.numRows,B=G.width,N=f.y;if(0==H||0==k)return L;var P=H*(r+p)-p,U=Math.min(k*(B+_)-_,f.w),W=new t.Rectangle(y?f.x+f.w-U:f.x,f.y,U,P);if(L=L.getUnion(W),c.isLayout)return L;for(var j=B-c.symbolWidth-u,K=0,z=1,V=s.items.length,Z=0;Z<V;Z++){var Y=s.items[Z];if(g._createLegendItem(e,i,Y,f,j,r,Z),f.y+=r+p,++K===H&&z!==k&&(f.y=N,f.w-=B+_,y||(f.x+=B+_),K=0,z++),K===H)break}return L}},_renderHorizontalSection:(e,i,s,n,a)=>{if(s){var r=e.getOptions(),o=r.symbolWidth,h=l.getGapSize(e,r.layout.symbolGapWidth),d=l.getGapSize(e,r.layout.columnGap),c=l.getGapSize(e,r.layout.titleGapWidth),u=null!=s.items&&s.items.length>0,p=t.Agent.isRightToLeft(e.getCtx()),_=n.clone(),v=g._renderTitle(e,i,s.title,n,s,!1),y=p?n.x+n.w:n.x,b=v?v.getDimensions():new t.Rectangle(y,n.y,0,0);if(!u)return b;b.w>0&&(_.w-=b.w+c,p||(_.x+=b.w+c));var m,f,C,S=[],x=n.w-_.w,w=s.items.length;for(C=0;C<w;C++)m=s.items[C],x+=(f=Math.ceil(t.TextUtils.getTextStringWidth(e.getCtx(),m.text,r.textStyle)))+o+h+d,S.push(f);w>0&&(x-=d);var O,E=new t.Rectangle(p?n.x+n.w-x:n.x,n.y,x,Math.max(a,b.h));if(r.isLayout||x>n.w)return i.removeChild(v),E;if(v){e.getCache().putToCache("horizRowAlign",!0),e.getCache().putToCache("sectionRect",E);var T=v.getDimensions(),D=E.y+E.h/2-T.h/2-T.y;v.setTranslate(0,D)}for(C=0;C<w;C++)m=s.items[C],g._createLegendItem(e,i,m,_,S[C],a,C),O=S[C]+o+h,_.w-=O+d,p||(_.x+=O+d);return e.getCache().putToCache("horizRowAlign",!1),e.getCache().putToCache("sectionRect",null),E}},_calcColumns:(e,i,s,n,a)=>{for(var r=e.getOptions(),o=[],h=0;h<n.length;h++)o.push(n[h].text);var g,d,c,u=t.TextUtils.getMaxTextStringWidth(e.getCtx(),o,r.textStyle),p=r.symbolWidth,_=l.getGapSize(e,r.layout.symbolGapWidth),v=l.getGapSize(e,r.layout.rowGap),y=l.getGapSize(e,r.layout.columnGap),b=Math.ceil(p+_+u);a?(c=Math.min(Math.max(Math.floor((i.w+y)/(b+y)),1),n.length),g=Math.min(Math.floor((i.h+v)/(s+v)),Math.ceil(n.length/c)),c=Math.ceil(n.length/g),g=Math.ceil(n.length/c)):i.h==1/0?(c=1,g=n.length):(g=Math.min(Math.floor((i.h+v)/(s+v)),n.length),c=Math.ceil(n.length/g),g=Math.ceil(n.length/c));var m=(i.w-y*(c-1))/c;return(d=Math.min(b,m))<p?{width:0,numCols:0,numRows:0}:{width:d,numCols:c,numRows:g}},_getRowHeight:e=>{var i=e.getOptions(),s=t.TextUtils.getTextStringHeight(e.getCtx(),i.textStyle),n=i.symbolHeight+l.getGapSize(e,i.layout.symbolGapHeight);return Math.ceil(Math.max(s,n))},_createLegendItem:(e,n,r,o,h,d,c)=>{var u,p=e.getOptions(),_=e.getCtx(),v=t.Agent.isRightToLeft(_),y=p.symbolWidth,b=l.getGapSize(e,p.layout.symbolGapWidth),m=v?o.x+o.w-y:o.x,f=v?o.x+o.w-y-b:o.x+y+b,C=g._createLegendSymbol(e,m,o.y,d,r,c),S=r.text;if(null!=S){var x=p.textStyle;(u=g._createLegendText(n,h,S,x))&&(u.setX(f),t.TextUtils.centerTextVertically(u,o.y+d/2),v&&u.alignRight());var w=e.getCache().getFromCache("sectionRect");if(e.getCache().getFromCache("horizRowAlign")&&w&&"vertical"!=p.orientation){var O=u.getDimensions().h,E=w.y+w.h/2-Math.max(p.symbolHeight,O)/2-o.y;C.setTranslate(0,E),u.setTranslate(0,E)}}n.addChild(C);var T=new t.Rect(_,v?f-h-g._FOCUS_GAP:m-g._FOCUS_GAP,o.y-g._FOCUS_GAP,y+b+h+2*g._FOCUS_GAP,d+2*g._FOCUS_GAP);T.setInvisibleFill();var D=p.hideAndShowBehavior;"none"!=D&&"off"!=D&&T.setCursor("pointer"),n.addChild(T);var A=[T,C];null!=u&&A.push(u);var M=a.associate(A,e,r,null!=u?u.getUntruncatedTextString():null,r.shortDesc,g._isItemDrillable(e,r));s(i(r,e),e)&&(C.setHollow(M.getColor()),C.setStyle().setClassName()),("none"!=D&&"off"!=D||null!=r.shortDesc)&&(T.setAriaRole("img"),M.updateAriaLabel())},_isItemDrillable:(e,t)=>"on"==t.drilling||"off"!=t.drilling&&"on"==e.getOptions().drilling,_createLegendText:(e,i,s,n)=>{var a=new t.OutputText(e.getCtx(),s);return a.setCSSStyle(n),a=t.TextUtils.fitText(a,i,1/0,e)?a:null},_createLegendSymbol:(e,n,a,r,l,o)=>{var h=e.getOptions(),d=e.getCtx(),c=null!=l.type?l.type:l.symbolType;l.markerShape||(l.markerShape=h._markerShape),l.color||(l.color=h._color),l.lineWidth||(l.lineWidth="lineWithMarker"==c?g._DEFAULT_LINE_WIDTH_WITH_MARKER:h._lineWidth);var u,p=h.symbolWidth,_=h.symbolHeight,v=a+r/2,y=n+p/2;if("line"==c)u=g._createLine(d,n,a,p,r,l);else if("lineWithMarker"==c)u=g._createLine(d,n,a,p,r,l),s(i(l,e),e)||u.addChild(g._createMarker(e,y,v,p*g._LINE_MARKER_SIZE_FACTOR,_*g._LINE_MARKER_SIZE_FACTOR,l));else if("image"==c)u=g._createImage(e,n,a,p,_,r,l);else if("_verticalBoxPlot"==c)_=Math.max(4*Math.round(_/4),4),(u=new t.Container(d)).addChild(g._createMarker(e,y,v+_/4,p,_/2,g._getBoxPlotOptions(l,"q2"))),u.addChild(g._createMarker(e,y,v-_/4,p,_/2,g._getBoxPlotOptions(l,"q3")));else if("_horizontalBoxPlot"==c){var b=t.Agent.isRightToLeft(d),m=(p=Math.max(4*Math.round(p/4),4))/4*(b?1:-1);(u=new t.Container(d)).addChild(g._createMarker(e,y+m,v,p/2,_,g._getBoxPlotOptions(l,"q2"))),u.addChild(g._createMarker(e,y-m,v,p/2,_,g._getBoxPlotOptions(l,"q3")))}else u=g._createMarker(e,y,v,p,_,l);return u},_createImage:(e,i,s,n,a,r,l)=>{var o=e.getCtx(),h=s+r/2,g=i+n/2;return new t.ImageMarker(o,g,h,n,a,null,l.source)},_createMarker:(e,i,s,n,a,r)=>{var l,o=e.getCtx(),h=r.markerShape,g=r.symbolType&&"lineWithMarker"==r.symbolType&&r.markerColor?r.markerColor:r.color,d=r.markerStyle||r.markerSvgStyle?r.markerStyle||r.markerSvgStyle:r.style||r.svgStyle,c=r.markerClassName||r.markerSvgClassName?r.markerClassName||r.markerSvgClassName:r.className||r.svgClassName,u=r.pattern;if(u&&"none"!=u?((l=new t.SimpleMarker(o,h,0,0,n,a,null,null,!0)).setFill(new t.PatternFill(u,g,"#FFFFFF")),l.setTranslate(i,s)):(l=new t.SimpleMarker(o,h,i,s,n,a,null,null,!0)).setSolidFill(g),r.borderColor){var p=r._borderWidth?r._borderWidth:1;l.setSolidStroke(r.borderColor,null,p)}return"square"!=h&&"rectangle"!=h||l.setPixelHinting(!0),l.setClassName(c).setStyle(d),l},_createLine:(e,i,s,n,a,r)=>{var l=s+a/2;n=n%2==1?n+1:n;var o,h=new t.Line(e,i,Math.round(l),i+n,Math.round(l)),g=r.lineStyle;"dashed"==g?o={dashArray:"4,2,4"}:"dotted"==g&&(o={dashArray:"2"});var d=new t.Stroke(r.color,1,r.lineWidth,!1,o);return h.setClassName(r.className||r.svgClassName).setStyle(r.style||r.svgStyle),h.setStroke(d),h.setPixelHinting(!0),h},_getBoxPlotOptions:(e,t)=>({markerShape:"rectangle",color:e._boxPlot[t+"Color"],pattern:e._boxPlot["_"+t+"Pattern"],className:e._boxPlot[t+"ClassName"]||e._boxPlot[t+"svgClassName"],style:e._boxPlot[t+"Style"]||e._boxPlot[t+"svgStyle"]})};class d extends t.BaseComponent{constructor(e,t,i){super(e,t,i),this.setId("legend1000"+Math.floor(1e9*Math.random())),this.Defaults=new l(e),this.EventManager=new o(this),this.EventManager.addListeners(this),this._peers=[],this._navigablePeers=[],this._bounds=null,this._titles=[]}static getDefaults(e){return(new l).getDefaults(e)}SetOptions(e){this.getOptionsCache().clearCache(),e?(this.Options=this.Defaults.calcOptions(e),this._transferVisibilityProps(this.Options.sections)):this.Options||(this.Options=this.GetDefaults())}getPreferredSize(e,i,s){this.SetOptions(e),this.getOptions().isLayout=!0;var n=new t.Rectangle(0,0,i,s),a=g.render(this,n);return this.getOptions().isLayout=!1,new t.Dimension(a.w,a.h)}render(e,i,s){this.getCache().clearCache(),this.SetOptions(e),isNaN(i)||isNaN(s)||(this.Width=i,this.Height=s),this.getOptions().isLayout=!1;for(var n=this.getNumChildren(),a=0;a<n;a++){this.getChildAt(a).destroy()}this.removeChildren(),this._peers=[],this._navigablePeers=[],this._bounds=null,this._titles=[],t.Agent.isTouchDevice()||this.EventManager.setKeyboardHandler(new h(this.EventManager,this)),this.UpdateAriaAttributes();var r=new t.Rectangle(0,0,this.Width,this.Height);this._contentDimensions=g.render(this,r);var l=this.getOptions().highlightedCategories;return l&&l.length>0&&this.highlight(l),this.RenderComplete(),this._contentDimensions}highlight(e){this.getOptions().highlightedCategories=e&&e.length>0?e.slice():null,t.CategoryRolloverHandler.highlight(e,this.__getObjects(),!0)}processEvent(e,i){if("categoryHighlight"==e.type&&"dim"==this.getOptions().hoverBehavior){var s=this.__getObjects();this!=i&&this.highlight(e.categories);for(var n=0;n<s.length;n++)if(t.Obj.compareValues(this.getCtx(),s[n].getId(),e.categories)){this.container.scrollIntoView(s[n].getDisplayables()[0]);break}}this==i&&this.dispatchEvent(e)}__registerObject(e){if(e.getDisplayables()[0]instanceof t.IconButton)this._navigablePeers.push(e);else{var i=this.getOptions().hideAndShowBehavior;(null!=e.getDatatip()||e.isDrillable()||"none"!=i&&"off"!=i)&&this._navigablePeers.push(e),this._peers.push(e)}}__getObjects(){return this._peers}__getKeyboardObjects(){return this._navigablePeers}__setBounds(e){this._bounds=e.clone()}__getBounds(){return this._bounds}__registerTitle(e){this._titles.push(e)}__getTitles(){return this._titles}getAutomation(){return new r(this)}getKeyboardFocus(){return null!=this.EventManager?this.EventManager.getFocus():null}setKeyboardFocus(e,i){if(null!=this.EventManager){for(var s=this.__getKeyboardObjects(),n=0;n<s.length;n++)if(t.Obj.compareValues(this.getCtx(),s[n].getId(),e.getId())){this.EventManager.setFocusObj(s[n]),i&&s[n].showKeyboardFocusEffect();break}var a=this.getKeyboardFocus();if(a){var r=a.getDisplayables()[0];r.setAriaProperty("label",a.getAriaLabel()),this.getCtx().setActiveElement(r)}}}getDimensions(e){var i=new t.Rectangle(0,0,this.Width,this.Height);return e&&e!==this?this.ConvertCoordSpaceRect(i,e):i}_transferVisibilityProps(e){if(e&&!(e.length<=0))for(var t=this.getOptions().hiddenCategories,s=0;s<e.length;s++){var n=e[s];n.sections&&this._transferVisibilityProps(n.sections);var a=n.items;if(a&&!(a.length<=0))for(var r=0;r<a.length;r++){var l=a[r],o=i(l,this);"hidden"==l.categoryVisibility&&t.indexOf(o)<0&&t.push(o),l.categoryVisibility=null}}}UpdateAriaAttributes(){if(this.IsParentRoot()){var e=this.getOptions(),i=e.translations,s=e.hideAndShowBehavior;("off"!=s&&"none"!=s||"dim"==e.hoverBehavior)&&(this.getCtx().setAriaRole("application"),this.getCtx().setAriaLabel(t.ResourceUtils.format(i.labelAndValue,[i.labelDataVisualization,t.AriaUtils.processAriaLabel(this.GetComponentDescription())])))}}isNavigable(){return this._navigablePeers.length>0}static getSectionItemsCount(e){var t=0;if(e.items&&(t+=e.items.length),e.sections)for(var i=e.sections,s=0;s<i.length;s++)t+=d.getSectionItemsCount(i[s]);return t}}e.Legend=d,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojlegend-toolkit.js.map