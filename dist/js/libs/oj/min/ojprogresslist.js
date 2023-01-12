/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore","jquery","knockout","ojs/ojcomposite","ojs/ojknockouttemplateutils","ojs/ojcomponentcore","ojs/ojlistview","ojs/ojprogress"],function(e,t,s,r,o){"use strict";e.ProgressItem=function(){},e.ProgressItem.Status={QUEUED:"queued",LOADSTARTED:"loadstarted",ABORTED:"aborted",ERRORED:"errored",TIMEDOUT:"timedout",LOADED:"loaded"},e.ProgressItem.EventType={LOADSTART:"loadstart",PROGRESS:"progress",ABORT:"abort",ERROR:"error",LOAD:"load",TIMEOUT:"timeout",LOADEND:"loadend"};r.register("oj-progress-item",{view:"    <div class='oj-flex oj-sm-justify-content-space-between'>      <div class='oj-flex-item oj-flex oj-sm-flex-direction-column'>        <span data-bind='text: $properties.data.name' class='oj-progresslist-name'></span>        <div data-bind='text: message' class='oj-progresslist-error-message'></div>      </div>      <div class='oj-flex oj-sm-align-items-center'>        <oj-bind-slot name='itemInfo'>          <div class='oj-flex-item oj-flex oj-progresslist-info'>            <span data-bind='text: $data.getSizeInBKMGT($properties.data.size)'></span>          </div>        </oj-bind-slot>        <div class='oj-flex-item oj-flex'>          <oj-progress-status status='{{status}}'                              progress='{{progress}}'>          </oj-progress-status>        </div>      </div>    </div>",viewModel:function(t){var r,o,i,a=this;r=function(t){t.target&&t.lengthComputable&&(a.status(e.ProgressItem.Status.LOADSTARTED),a.progress(parseInt(t.loaded/t.total*100,10)))},o=function(t){var s=t.target;s&&(a.message(t.error.message),a.status(e.ProgressItem.Status.ERRORED),p(s))},i=function(t){var s=t.target;s&&(a.status(e.ProgressItem.Status.LOADED),p(s))},a.status=s.observable(e.ProgressItem.Status.QUEUED),a.progress=s.observable(-1),a.message=s.observable("");var n,d=["B","KB","MB","GB","TB"];function p(t){t.removeEventListener(e.ProgressItem.EventType.PROGRESS,r,!1),t.removeEventListener(e.ProgressItem.EventType.ERROR,o,!1),t.removeEventListener(e.ProgressItem.EventType.TIMEOUT,o,!1),t.removeEventListener(e.ProgressItem.EventType.ABORT,o,!1),t.removeEventListener(e.ProgressItem.EventType.LOAD,i,!1)}a.getSizeInBKMGT=function(e){var t,s=e;if(isNaN(s))return null;for(t=0;s>=1024&&t<4;t++)s/=1024;return s.toFixed(2)+d[t]},(n=t.properties.data).addEventListener(e.ProgressItem.EventType.PROGRESS,r),n.addEventListener(e.ProgressItem.EventType.ERROR,o),n.addEventListener(e.ProgressItem.EventType.TIMEOUT,o),n.addEventListener(e.ProgressItem.EventType.ABORT,o),n.addEventListener(e.ProgressItem.EventType.LOAD,i)},metadata:{properties:{data:{type:"object"}}}});r.register("oj-progress-list",{view:"<oj-list-view data-bind=\"attr: {id: $unique + '_list'}\"              aria-label='list using array'              data='{{$properties.data}}'              item.renderer='{{renderer()}}'              selection-mode='single'></oj-list-view><script type='text/html' data-bind=\"attr: {id: tempId}\">  <li class='oj-progresslist-item' tabindex='0'>    <oj-progress-item data='{{$data}}'>    </oj-progress-item>  </li><\/script>",viewModel:function(e){var t=this;t.tempId=e.unique+"_templ",t.renderer=function(){return o.getRenderer(t.tempId,!0)}},metadata:{properties:{data:{type:"object",extension:{webelement:{exceptionStatus:[{type:"deprecated",since:"14.0.0",description:"Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}]}}}},methods:{getProperty:{},setProperties:{},setProperty:{},getNodeBySubId:{},getSubIdByNode:{}},extension:{}}});r.register("oj-progress-status",{view:"  <div data-bind='visible: ($properties.status == \"queued\")'       class='oj-progressstatus-cell'>    <div class='oj-component-icon oj-progressstatus-cancel-icon'         role='img' title='cancel'></div>  </div>  <div data-bind='visible: ($properties.status == \"loadstarted\")'       class='oj-progressstatus-cell'>    <oj-progress type='circle' value='{{$properties.progress}}'>    </oj-progress>  </div>  <div data-bind='visible: ($properties.status == \"loaded\")'       class='oj-progressstatus-cell'>    <div class='oj-component-icon oj-progressstatus-done-icon' role='img' title='done'></div>  </div>  <div data-bind='visible: ($properties.status == \"errored\" || $properties.status == \"timedout\" || $properties.status == \"aborted\")'       class='oj-progressstatus-cell'>    <div class='oj-component-icon oj-progressstatus-error-icon' role='img' title='error'></div>  </div>",metadata:{properties:{status:{type:"string"},progress:{type:"number"}}}})});
//# sourceMappingURL=ojprogresslist.js.map