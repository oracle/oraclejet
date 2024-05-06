/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { load, normalize } from 'css';

const cssAPI = {};

cssAPI.load = function (name, req, onload, config) {
  var skipcssload = false;
  if (config) {
    var ojcss = config.ojcss;
    var filename = name + '.css';
    if (this.isExcluded(filename, ojcss)) {
      skipcssload = true;
    }
  }
  if (!skipcssload) {
    // delegate the call to the CSS plugin
    // eslint-disable-next-line no-undef
    load(name, req, onload, config);
  } else {
    // signal to require that we are done "loading" the resource
    onload(name);
  }
};

// used for building with the optimizer r.js
cssAPI.pluginBuilder = 'css-builder';

cssAPI.normalize = normalize;

/**
 * This function will check if the css file (specified by the filepath parameter) should be excluded from the css load step.
 * @param {string} filepath the name of the css file that the plugin aught to load.
 * @param {object} ojcss the value of the ojcss key in the requirejs config option
 * @ignore
 * @private
 */

cssAPI.isExcluded = function (filepath, ojcss) {
  var excluded = false;
  // see if we have an explicit include directive
  if (ojcss && ojcss.include) {
    var include = ojcss.include;
    if (Array.isArray(include)) {
      if (include.length > 0) {
        excluded = true;
        for (var j = 0; j < include.length; j++) {
          var includepath = include[j];
          if (filepath.substr(0, includepath.length) === includepath) {
            excluded = false;
            break;
          }
        }
      }
    } else {
      var includePattern = this.makeRegExp(include);
      if (includePattern.test(filepath)) {
        excluded = false;
      }
    }
  }

  if (!excluded && ojcss && ojcss.exclude) {
    var exclude = ojcss.exclude;
    if (Array.isArray(exclude)) {
      for (var i = 0; i < exclude.length; i++) {
        var excludepath = exclude[i];
        if (filepath.substr(0, excludepath.length) === excludepath) {
          excluded = true;
          break;
        }
      }
    } else {
      var excludePattern = this.makeRegExp(exclude);
      if (excludePattern.test(filepath)) {
        excluded = true;
      }
    }
  }

  return excluded;
};

/**
 * Creates a RegExp object from a given string pattern.
 * @param {string} pattern A regular expression
 */
cssAPI.makeRegExp = function (pattern) {
  var regExp = null;

  if (pattern) {
    regExp = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  }

  return regExp;
};

export default cssAPI;
