/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(t){"use strict";class e{static playDefaultNotificationSound(){const t=e._getAudioContext(),o=t.createOscillator();o.connect(t.destination),o.start(0),o.stop(t.currentTime+.1)}static playAudioFromURL(t){let e,o;const n=new Promise((t,n)=>{e=t,o=n}),r=document.createElement("audio");return r.src=t,r.addEventListener("error",o),(r.play()||Promise.resolve()).then(e,o).catch(o),n}static _getAudioContext(){if(e._audioContext)return e._audioContext;if(null===e._audioContext)throw new Error("Browser does not support WebAudio API");try{e._audioContext=new(window.AudioContext||window.webkitAudioContext)}catch(t){throw e._audioContext=null,new Error("Browser does not support WebAudio API")}return e._audioContext}}t.SoundUtils=e,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=ojsoundutils.js.map