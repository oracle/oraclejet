'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var virtual_translationBundle = require('./translationBundle');



Object.keys(virtual_translationBundle).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return virtual_translationBundle[k]; }
	});
});
