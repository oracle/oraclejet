'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var virtual_aria = require('./aria');
var virtual_borders = require('./borders');
var virtual_boxalignment = require('./boxalignment');
var virtual_colors = require('./colors');
var virtual_dimensions = require('./dimensions');
var virtual_flexbox = require('./flexbox');
var virtual_flexitem = require('./flexitem');
var virtual_grid = require('./grid');
var virtual_griditem = require('./griditem');
var virtual_padding = require('./padding');
var virtual_text = require('./text');



Object.keys(virtual_aria).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return virtual_aria[k]; }
	});
});
Object.keys(virtual_borders).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return virtual_borders[k]; }
	});
});
Object.keys(virtual_boxalignment).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return virtual_boxalignment[k]; }
	});
});
Object.keys(virtual_colors).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return virtual_colors[k]; }
	});
});
Object.keys(virtual_dimensions).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return virtual_dimensions[k]; }
	});
});
Object.keys(virtual_flexbox).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return virtual_flexbox[k]; }
	});
});
Object.keys(virtual_flexitem).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return virtual_flexitem[k]; }
	});
});
Object.keys(virtual_grid).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return virtual_grid[k]; }
	});
});
Object.keys(virtual_griditem).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return virtual_griditem[k]; }
	});
});
Object.keys(virtual_padding).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return virtual_padding[k]; }
	});
});
Object.keys(virtual_text).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return virtual_text[k]; }
	});
});
