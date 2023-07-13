/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojlogger","ojs/ojmodule-element-utils","ojs/ojmoduleanimations","knockout"],function(e,t,n,i){"use strict";return function(r,o){var a=r,l=o||{},u=null,s=null,c=null,v=i.observable({view:[],viewModel:null});function d(e){return e?l.pathKey?e.detail[l.pathKey]:e.path:null}var f,w=l.animationCallback?(f=function(e){var t={node:e.node,previousViewModel:e.oldViewModel,viewModel:e.newViewModel,previousState:u,state:s};return l.animationCallback(t)},new function(){var e,t="canAnimate";function i(t){return function(n){return e[t].call(e,n)}}this[t]=function(r){var o=f(r);return!!(e="string"==typeof o?n[o]:o)&&(["prepareAnimation","animate"].forEach(function(e){this[e]=i(e)}.bind(this)),i(t)(r))}.bind(this)}):null;a.beforeStateChange.subscribe(function(e){var t=v().viewModel,n=t&&t.canExit?t.canExit():Promise.resolve();e.accept(n)}),a.currentState.subscribe(function(n){var i,r=d(n?n.state:null);if(r){if(r===d(s)&&v().viewModel&&v().viewModel.parametersChanged)return v().viewModel.parametersChanged(n.state.params),void(s=n.state);var o=l.viewPath||"views/",f=l.viewModelPath||"viewModels/";i=t.createConfig({require:l.require,viewPath:o+r+".html",viewModelPath:f+r,params:{parentRouter:a,params:n.state.params,router:a,routerState:n.state}})}else i=Promise.resolve({view:[],viewModel:null});n.complete(i),c=i,i.then(function(e){if(c===i){u=s,s=n.state;var t={viewModel:e.viewModel};Object.defineProperty(t,"view",{enumerable:!0,get:()=>e.view.map(e=>e.cloneNode(!0))}),v(t)}},function(t){e.error("Error creating oj-module config : ",t)})});var m={};return Object.defineProperties(m,{koObservableConfig:{get:function(){return v}},animation:{get:function(){return w}}}),m}});
//# sourceMappingURL=ojmodulerouter-adapter.js.map