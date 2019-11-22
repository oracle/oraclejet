/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

const NullDependency = require("webpack/lib/dependencies/NullDependency");

class ReplaceContentDependency extends NullDependency
{
  constructor(parts) {
    super();
    this.parts = parts;
  }
}

ReplaceContentDependency.Template = class ReplaceContentDependencyTemplate
{
  apply(dep, source, outputOptions, requestShortener) {
    dep.parts.forEach(part => source.replace(part.start, part.end - 1/*inclusive*/, part.content));
  }
};

module.exports = ReplaceContentDependency;

