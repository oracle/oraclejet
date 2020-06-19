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
 * This dependency does what the Webpack's ImportDependency would have done for a dynamic
 * import, but also assumes that all modules will be always lazily loaded.
 */
const path = require('path');
const ContextDependency = require("webpack/lib/dependencies/ContextDependency");

class OjModuleImportDependency extends ContextDependency
{
  constructor(pos, options) {
    super({request: (options.prefix||"") + options.root,
           recursive:true,
           regExp: new RegExp(options.match || ".*"), // files matching this regular expression will be considered by Webpack as potential dynamic imports
                                                      // (this provides the 'context' to Webpack dynamic module loading).
           mode:'lazy'});
    this.pos = pos;
    //this.path = options.root;
    this.ext = options.addExtension || "";
  }
}

OjModuleImportDependency.Template = class OjModuleImportDependencyTemplate
{
  apply(dep, source, runtime) {

    const moduleExports = runtime.moduleExports({
			module: dep.module,
			request: dep.request
		});

    source.replace(dep.pos, dep.pos,
     `${moduleExports}((/^[^\./].+/.test(module)?"./":"") + module + "${dep.ext}");`

    );
  }
};

module.exports = OjModuleImportDependency;

