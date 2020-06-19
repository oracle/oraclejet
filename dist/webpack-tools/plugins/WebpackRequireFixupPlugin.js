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
 * A plugin that resolves issues with JET features that are problematic for Webpack.
 * It performs build-time code modifications to eliminate the need to use Require.js at runtime while preserving
 * all JET functionality including the lazily loaded module (ojModule and oj-module)
 */
const IncompatibleDependency = require('./IncompatibleDependency');
const ReplaceContentDependency = require('./ReplaceContentDependency');
const OjModuleImportDependency = require('./OjModuleImportDependency');
const BaseResourceUrlDependency = require('./BaseResourceUrlDependency');
const ImportDependenciesBlock = require('webpack/lib/dependencies/ImportDependenciesBlock');

const vm = require("vm");


const _OJ_OPTION_COMMENT_REGEXP = new RegExp(/(^|\W)oj[A-Z]{1,}[A-Za-z]{1,}:/);

class WebpackRequireFixupPlugin
{
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {

  compiler.hooks.compilation.tap("WebpackRequireFixupPlugin",
      (compilation, {normalModuleFactory,  contextModuleFactory}) => {

        // Use contextModuleFactory to handle OjModuleImportDependency, i.e. make ojModule loads
        // behave like dynamic imports where modules are loaded from the certain locations, aka 'context'
        compilation.dependencyFactories.set(
					OjModuleImportDependency,
					contextModuleFactory
        );

        // Register templates that would be handling code modifications requested by this plugin
        compilation.dependencyTemplates.set(
					IncompatibleDependency,
					new IncompatibleDependency.Template()
        );
        compilation.dependencyTemplates.set(
					ReplaceContentDependency,
					new ReplaceContentDependency.Template()
        );
        compilation.dependencyTemplates.set(
					OjModuleImportDependency,
					new OjModuleImportDependency.Template()
        );
        compilation.dependencyTemplates.set(
					BaseResourceUrlDependency,
					new BaseResourceUrlDependency.Template()
        );

        normalModuleFactory.hooks.parser.for("javascript/auto")
          .tap("WebpackRequireFixupPlugin",
              (parser, parserOptions) => {

                // tap all function calls to require(). The calls that have
                // a special comment annotation defining ojWebpackError will be
                // replaced with code throwing an error
                parser.hooks.call.for("require").tap(
				"WebpackRequireFixupPlugin",
                  (expr) => {
                    const opts = _getCommentOptions(parser, expr.range);
                    if (opts && opts.ojWebpackError) {
                      parser.state.current.addDependency(
                                  new IncompatibleDependency(expr.range, opts.ojWebpackError));
                      return true;
                    }

                  }

                );

                // Tap all require expressions, i.e. cases when the require function is used as a variable.
                // This normally comes up when the require instance is provided to the ojModule or ModuleElementUtils
                // for loading views and viewModels with a path that is relative to the module passing the require instance
                parser.hooks.expression.for("require").tap(
        "WebpackRequireFixupPlugin",
                (expr) => {
                  const start = expr.range[0];
                  // Look for comments immediately preceeding the require variable
                  const immediateComment = parser.comments.find(
                    comment => start === comment.range[1]
                  );
                  if (immediateComment) {
                    const opts = _getCommentOptions(parser, immediateComment.range);
                    // check for annotations for the locally-scoped views and visewModels
                    const viewOpts = opts.ojModuleElementView;
                    const modelOpts = opts.ojModuleElementViewModel;
                    const ojModuleBindingOpts = opts.ojModuleResources;
                    // range for replacing both the comment and the variable
                    const range = [immediateComment.range[0], expr.range[1]];

                    var rootOpts = this.options.ojModuleResources || {};
                    var root  = {root: './'}; // ignore the global ojModuleResources root when the require instance is specified
                    // require instance is being passed for loading a View by ModuleElementUtils
                    if (viewOpts) {
                      return _replaceOjModuleViewPromise(range, Object.assign(root, rootOpts.view||{}, viewOpts), parser, true);
                    }
                    // require instance is being passed for loading a ViewModel by ModuleElementUtils
                    else if (modelOpts) {
                      return _replaceOjModuleViewModelPromise(range, Object.assign(root, rootOpts.viewModel||{}, modelOpts), parser, true);
                    }
                    // require instance is being passed for loading a View and a ViewModel by ojModule
                    else if (ojModuleBindingOpts) {
                      return _replaceOjModuleRequirePromise(range, _mergeDeep({}, rootOpts, root, ojModuleBindingOpts), parser, true);
                    }
                  }
                  else if (expr.name === 'localRequire') {
                    // Handle localeRequire used in __getRequirePromise() calls.
                    // We should start using comment-based annotations instead once the JET source is
                    // updated to have them
                    return true;
                  }

                }

              );

              // Turn oj.__getRequirePromise() calls into Webpack dynamic imports
              parser.hooks.evaluateCallExpressionMember.for("__getRequirePromise").tap(
                "WebpackRequireFixupPlugin",
                expr => {_replaceGetRequirePromise(expr, parser);}
              );

              // Tap into the Webpack compiler visiting all statements, so that we can rewrite certain functions
              // Unfortunately, Webpack currently has no easy way to specify that one is looking for a certain assignment expression
              // or function expression, so we need to use the generic statement hook.
              parser.hooks.statement.tap(
				"WebpackRequireFixupPlugin",
                  (statement) => {

                    if (statement.type === "FunctionDeclaration"
                                      && statement.id.name === "_getOjModuleRequirePromise") {

                      // This function is replaced to make dynamic import calls with a context derived from the webpack.config.js and comment annotations
                      _replaceOjModuleRequirePromise(statement.range, this.options.ojModuleResources||{}, parser);
                      return true;

                    }
                    else if (statement.type === "ExpressionStatement" &&
                              statement.expression.type === "AssignmentExpression" &&
                              statement.expression.right.type == "FunctionExpression" &&
                              statement.expression.left.property != null &&
                              statement.expression.left.object != null) {

                      let ret;
                      const clazz = statement.expression.left.object.name;
                      const func = statement.expression.right;

                      var rootOpts = this.options.ojModuleResources || {};
                      var opts = {root: rootOpts.root};

                      switch(statement.expression.left.property.name) {
                        case "__getRequirePromise":
                          // Remove the definition of __getRequirePromise() completely because we will be replacing all __getRequirePromise()
                          // references with import() calls
                          parser.state.current.addDependency(new IncompatibleDependency(statement.range, null));
                          ret = true;
                        break;
                        case "createView":
                          if (clazz === "ModuleElementUtils") {
                            // This function is replaced to make dynamic import calls with a context derived from the webpack.config.js and comment annotations
                            ret = _replaceOjModuleViewPromise(func.range, Object.assign(opts, rootOpts.view||{}), parser);
                          }
                        break;

                        case "createViewModel":
                          if (clazz === "ModuleElementUtils") {
                            // This function is replaced to make dynamic import calls with a context derived from the webpack.config.js and comment annotations
                            ret = _replaceOjModuleViewModelPromise(func.range, Object.assign(opts, rootOpts.viewModel||{}), parser);
                          }
                        break;

                        case "_getOjBaseUrl":
                          //This function is replaced to return the baseResourceUrl setting from webpack.config.js
                          ret = true;
                          parser.state.current.addDependency(
                                      new BaseResourceUrlDependency(func.range, this.options.baseResourceUrl || ""));
                        break;

                      }
                      return ret;
                    }
                  }


                );


              }
          );

      });
  }
}

function _replaceOjModuleRequirePromise(range, options, parser, isDelegate) {
  const part1 = range[0];
  const part2 = part1 + 1;
  const part3 = part2 + 1;
  const part4 = part3 + 1;
  const part5 = part4 + 1;
  const part6 = part5 + 1;
  const end = range[1];

  const modelOpts = options.viewModel || {};
  const viewOpts = options.view || {};
  const root = {root: options.root || "./js/"};


  const content1 = isDelegate ? `function (type, module)
  {
  `: `function _getOjModuleRequirePromise(delegate, type, module)
  {
    if (delegate)
      return delegate(type, module);
  `;

  const blocks = [
    {
      start: part1,
      end: part1 + 1,
      content: content1
    },
    {
      start: part2,
      end: part2 + 1,
      content: `  var promise;

        switch (type) {
          case "viewModel":
          promise = `
    },
    {
      start: part4,
      end: part4 + 1,
      content: `
          break;
        case "view":
          module = module.replace(/^text\!/, "");
          promise =`
    },
    {
      start: part6,
      end: end,
      content: `
          break;
          default:
            throw "Unknown type: " + type;
        }
        return promise;
      }`

    }
  ];
  parser.state.current.addDependency(
            new ReplaceContentDependency(blocks));
  parser.state.current.addDependency(
            new OjModuleImportDependency(part3,
                  Object.assign({}, root, modelOpts)));
  parser.state.current.addDependency(
            new OjModuleImportDependency(part5,
              Object.assign({}, root, viewOpts)));
  return true;
}

// This function will replace a method loading the ojModule or <oj-module> View.
// The 'delegate' parameter will be true when the function is replacing the require
// instance used to load a View with a relative path.
// Since Webpack cannot perform further optimization of the code that has been modified by a plugin,
// we have to make all the modifications that Webpack would have done, in this case insert the code that would
// normally replace the dynamic imports. The OjModuleImportDependency handles that replacement.

function _replaceOjModuleViewPromise(range, options, parser, isDelegate) {
  const part1 = range[0];
  const part2 = part1 + 1;
  const part3 = part2 + 1;
  const end = range[1];

  const content1 = isDelegate ?
  `function(module) {
    var ret = ` :

  `function(options) {
    if (!options || !options['viewPath'])
      return Promise.resolve([]);

    var delegate = options['require'];
    var module = options['viewPath'];

    var ret;

    if (delegate) {
      ret = delegate(module);
    }
    else
      ret = `;

    const content3 = isDelegate ? `
      return ret;
    }` : `ret = ret.then(
        function(value){
          return HtmlUtils.stringToNodeArray(value);
        }
      );
      return ret;
    }`



  const blocks = [
    {
      start: part1,
      end: part1 + 1,
      content: content1
    },
    {
      start: part3,
      end: end,
      content: content3
    }
  ];
  parser.state.current.addDependency(new ReplaceContentDependency(blocks));
  parser.state.current.addDependency(
            new OjModuleImportDependency(part2,
              options));

  return true;

};

// This function will replace a method loading he ojModule or <oj-module> ViewModel.
// The 'delegate' parameter will be true when the function is replacing the require
// instance used to load a View with a relative path.
// Since Webpack cannot perform further optimization of the code that has been modified by a plugin,
// we have to make all the modifications that Webpack would have done, in this case insert the code that would
// normally replace the dynamic imports. The OjModuleImportDependency handles that replacement.
function _replaceOjModuleViewModelPromise(range, options, parser, isDelegate) {
  const part1 = range[0];
  const part2 = part1 + 1;
  const part3 = part2 + 1;
  const end = range[1];

  const content1 = isDelegate ?
    `function(module) {
      return ` :
    `function(options) {
      if (!options || !options['viewModelPath'])
        return Promise.resolve(null);

      var delegate = options['require'];
      var module = options['viewModelPath'];
      if (delegate) {
        return delegate(module);
      }
      return `;


  const blocks = [
    {
      start: part1,
      end: part1 + 1,
      content: content1
    },
    {
      start: part3,
      end: end,
      content: `
    }`
    }
  ];


  parser.state.current.addDependency(new ReplaceContentDependency(blocks));
  parser.state.current.addDependency(
            new OjModuleImportDependency(part2, options));

  return true;
};

function _isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

function _mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (_isObject(target) && _isObject(source)) {
    Object.keys(source).forEach( key =>  {
      if (_isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        _mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return _mergeDeep(target, ...sources);
};

function _getCommentOptions(parser, range) {
  const ret = {};
  const comments = parser.getComments(range);

  if (!comments || comments.length === 0) {
    return ret;
  }

  for (const comment of comments) {
    const { value } = comment;
    if (value && _OJ_OPTION_COMMENT_REGEXP.test(value)) {
      try {
        const val = vm.runInNewContext(`(function(){return {${value}};})()`);
        Object.assign(ret, val);
      } catch (e) {
      }
    }
  }
  return ret;
};

function _replaceGetRequirePromise(expr, parser) {
  const args = expr.arguments;
  if (args.length < 1) {
    throw new Error ("The module name must be specified in __getRequirePromise()");
  }
  const module = parser.evaluateExpression(args[0]);

  const start = expr.range[0];
  const end = expr.range[1];


  const depBlock = new ImportDependenciesBlock(
    module.string,
    [start, end - 1],
    {},
    parser.state.module,
    expr.loc,
    parser.state.module
  )
  parser.state.current.addBlock(depBlock);

  parser.state.current.addDependency(new ReplaceContentDependency(
    [{
      start: end - 1,
      end: end,
      content: ".then(function(m){return m.default;})"
    }]
  ));

}

module.exports = WebpackRequireFixupPlugin;
