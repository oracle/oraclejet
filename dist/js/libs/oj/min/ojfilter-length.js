/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(function(){"use strict";return class{constructor(t){if(this.options=t,!t.max)throw new Error("length filter's max option cannot be less than 1. max option is "+t.max);if(isNaN(t.max))throw new Error("length filter's max option is not a number. max option is "+t.max);if(null!==t.max&&t.max<1)throw new Error("length filter's max option cannot be less than 1. max option is "+t.max);t.countBy=void 0===t.countBy?"codePoint":t.countBy}filter(t,n){return this.calcLength(n)<=this.options.max?n:t.slice(0,this.options.max)}calcLength(t){const n=this.options.countBy;if(""==t||null==t||null==t)return 0;const o=t.length;let i,e=0;switch(n){case"codePoint":for(let n=0;n<o;n++)55296==(63488&t.charCodeAt(n))&&(e+=1);i=o-e/2;break;case"codeUnit":default:i=o}return i}}});
//# sourceMappingURL=ojfilter-length.js.map