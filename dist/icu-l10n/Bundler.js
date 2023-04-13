const fsx = require('fs-extra');
const glob = require('glob');
const path = require('path');
const os = require('os');
const PatternCompiler = require('./PatternCompiler');
const ts = require('typescript');

/**
 * Traverse the message bundle and compile all strings.
 * @param {PatternCompiler} compiler The instance of the PatternCompiler
 * @param {Object} bundle The message bundle
 * @return {Object} A message bundle whose strings are wrapped by functions
 * generated from the PatternCompiler.
 */
function traverse(compiler, bundle) {
  const output = Object.keys(bundle).reduce((accum, key) => {
    // Ignore '@...' annotation entries
    if (!key.match(/^@/)) {
      const value = bundle[key];
      if (typeof value !== 'string') {
        throw Error(`"${key}" value must be a string`);
      }
      return {
        ...accum,
        [key]: compiler.compile(value)
      };
    }
    return accum;
  }, {});
  return output;
}

/**
 * Get the bundle as an object from the given filepath
 * @param {string} filepath
 * @return {object} The bundle from the file
 */
function getBundle(filepath) {
  let bundle;
  if (fsx.existsSync(filepath)) {
    const bundleContents = fsx.readFileSync(filepath);
    bundle = JSON.parse(bundleContents);
  }
  return bundle;
}

/**
 * Process the given bundle for the given locale and write the compiled contents
 * to the given file path
 * @param {string} bundleId The id of the bundle
 * @param {object} bundle The message bundle
 * @param {string} locale The locale of the bundle
 * @param {string} targetFile The path to the target file where the contents will
 * be written.
 * @param {object?} addlExports Additional exports for the bundle. This object
 * should only be passed for the root bundle, from where the type definitions
 * will be read.
 * <code>
 *   {
 *     exportType?: boolean // whether to export the bundle type definition
 *   }
 * </code>
 */
function convertBundle(bundleId, bundle, locale, targetFile, addlExports = {}) {
  const compiler = new PatternCompiler(locale);
  const processed = traverse(compiler, bundle);
  // apply hooks and type imports
  const convertor = customHooks.convertor;
  const typeImport = customHooks.typeImport ? Object.keys(customHooks.typeImport).map(k => customHooks.typeImport[k])[0]: '';
  const otherImports = customHooks.otherImports ? [customHooks.otherImports] : [];
  const valueType = typeImport ? Object.keys(customHooks.typeImport)[0] : '';
  const contents = Object.keys(processed).map((messageKey) => {
    const entry = processed[messageKey];
    const translation = entry.formatter || '""';
    // Param types for TS
    const params = Object.keys(entry.paramTypes).map(
      (paramKey) => `${paramKey}:${entry.paramTypes[paramKey]}`
    );
    const paramString = params.length ? `p: {${params.join(',')}}` : '';
    const paramVar = params.length ? 'p': undefined;
    const output = convertor ? `convert({bundleId:"${bundleId}",id:"${messageKey}",params:${paramVar},translation:${translation}})` : translation;
    return `  "${messageKey}": (${paramString})${valueType && ':'+valueType} => ${output}`;
  });
  const targetDir = path.dirname(targetFile);
  fsx.ensureDirSync(targetDir);
  fsx.writeFileSync(targetFile,
    wrapInModule(
      otherImports.concat(typeImport).join('\n'),
      `{\n${contents.join(',\n')}\n}`,
      addlExports,
      convertor ? `const convert = ${convertor};` : ''
    )
  );
}

function wrapInModule(imports, contents, { exportType }, convertor) {
  let paramsType = '';
  if (convertor) {
    paramsType = `
type ParamsType = {
  bundleId: string,
  id: string,
  params: { [key:string]: any } | undefined,
  translation: string
};\n`;
  }
  return `${imports}
${paramsType}
${convertor}
const bundle = ${contents};
export default bundle;
${exportType ? 'export type BundleType = typeof bundle;' : ''}
`;
}

/**
 * Test if a given directory name (base name only) is an NLS directory.
 * @param {string} name The directory name
 * @return True if NLS directory, false otherwise
 */
function isNlsDir(name) {
  return (name.match(/^[a-z]{2,3}$/i) || name.match(/^[a-z]{2,3}-.+/)) && !name.match(/\.\w+$/);
}

function transpile(rootDir, moduleType) {
  const moduleMap = {
    amd: ts.ModuleKind.AMD,
    esm: ts.ModuleKind.ES2020
  };
  const options = {
    module: moduleMap[moduleType],
    target: 'es6'
  };
  const program = ts.createProgram(glob.sync(`${rootDir}/**/*.ts`), options);
  program.emit();
}

let customHooks = { };

/**
 * Compile the message bundle in ICU format. This function starts with the "root"
 * message bundle and attempts to discover bundles for all available locales by
 * traversing the root bundle's directory and looking for locale directory names.
 * Any file found under locale directories whose names match the root bundle will
 * also be compiled.
 * When creating the output file in the given targetDir, the locale directory
 * structure from the source will be recreated.
 * @param {object} props The properties with which to build the bundle
 * @param {string} props.rootDir The path to the root message bundle
 * @param {string} props.bundleName The name of the bundle file
 * @param {string} props.locale The locale of the root message bundle
 * @param {string} props.outDir The target directory where the compiled root message
 * @param {string} props.module The type of module to produce -- 'amd' or 'esm'
 * @param {string[]?} props.additionalLocales An array of additional locales to build
 * @param {string?} hooks A path to the custom hooks file
 */
function build({ rootDir, bundleName, locale, outDir, module, additionalLocales = [], hooks }) {
  const jsonRegEx = /\.json$/;
  if (!jsonRegEx.test(bundleName)) {
    throw Error(`${bundleName} must be a JSON file`);
  }
  const pkg = require('./package.json');
  const targetBundleName = bundleName.replace(jsonRegEx, '.ts');
  // Merge in supported locales to build. If physical dirs don't exist, they'll
  // inherit the root translations
  const supportedLocales = [
    ...new Set(fsx.readdirSync(rootDir).filter(isNlsDir).concat(additionalLocales).sort())
  ];

  if (hooks) {
    customHooks = require(hooks);
  }

  // Traverse root bundle
  const rootBundle = getBundle(path.join(rootDir, bundleName));
  if (rootBundle) {
    convertBundle(bundleName, rootBundle, locale, path.join(outDir, targetBundleName), {
      supportedLocales,
      exportType: true
    });
  }

  supportedLocales.forEach((locale) => {
    // Combine all levels into single bundle, starting with rootBundle
    const combinedBundle = Object.assign({}, rootBundle);
    const localeParts = locale.split('-');
    for (let i = 0, len = localeParts.length; i < len; i++) {
      // Build segment from region (0) to index
      let segment = localeParts.slice(0, i + 1).join('-');
      const perBundle = getBundle(path.join(rootDir, segment, bundleName));
      Object.assign(combinedBundle, perBundle);
    }

    convertBundle(bundleName, combinedBundle, locale, path.join(outDir, locale, targetBundleName));
  });

  fsx.writeFileSync(
    path.join(outDir, 'supportedLocales.ts'),
    `export default ${JSON.stringify(supportedLocales)};\n`
  );

  if (module) {
    transpile(path.resolve(outDir), module);
  }
}
module.exports = {
  build,
  isNlsDir
};
