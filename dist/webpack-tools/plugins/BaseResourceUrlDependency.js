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

const NullDependency = require("webpack/lib/dependencies/NullDependency");

class BaseResourceUrlDependency extends NullDependency
{
  constructor(range, base) {
    super ();
    this.range = range;
    this.base = base;
  }
}

BaseResourceUrlDependency.Template = class BaseResourceUrlDependencyTemplate
{
  apply(dep, source) {
    source.replace(dep.range[0], dep.range[1],

    `function(){return '${dep.base}';}`

    );
  }
};

module.exports = BaseResourceUrlDependency;

