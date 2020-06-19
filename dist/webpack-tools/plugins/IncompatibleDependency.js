/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

/**
 * This dependency renders the code that just throws an error with a specified text.
 */
const NullDependency = require("webpack/lib/dependencies/NullDependency");

class IncompatibleDependency extends NullDependency
{
  constructor(range, error) {
    super ();
    this.range = range;
    this.error = error;
  }
}

IncompatibleDependency.Template = class IncompatibleDependencyTemplate
{
  apply(dep, source, outputOptions, requestShortener) {
    var error = dep.error === null ? "" : `throw new error('${dep.error}');`
    source.replace(dep.range[0], dep.range[1], error);
  }
};

module.exports = IncompatibleDependency;

