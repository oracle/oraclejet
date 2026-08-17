/**
 * @license
 * Copyright (c) 2014, 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojdomutils"],function(t,o){"use strict";const e=["http:","https:","data:","blob:"];class n{static playDefaultNotificationSound(){const t=n._getAudioContext(),o=t.createOscillator();o.connect(t.destination),o.start(0),o.stop(t.currentTime+.1)}static playAudioFromURL(t){let n=()=>{},r=()=>{};const i=new Promise((t,o)=>{n=t,r=o});try{o.validateURL(t,e)}catch(t){return Promise.resolve().then(()=>r(t)),i}const s=document.createElement("audio");return s.src=t,s.addEventListener("error",r),(s.play()||Promise.resolve()).then(n,r).catch(r),i}static _getAudioContext(){if(n._audioContext)return n._audioContext;if(null===n._audioContext)throw new Error("Browser does not support WebAudio API");try{n._audioContext=new(window.AudioContext||window.webkitAudioContext)}catch(t){throw n._audioContext=null,new Error("Browser does not support WebAudio API")}return n._audioContext}}t.SoundUtils=n,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=ojsoundutils.js.map