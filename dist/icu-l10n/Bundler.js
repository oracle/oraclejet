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
 * @param {object} bundle The message bundle
 * @param {string} locale The locale of the bundle
 * @param {string} targetFile The path to the target file where the contents will
 * be written.
 * @param {boolean} exportType Whether to export the bundle type
 */
function convertBundle(bundle, locale, targetFile, exportType) {
  const compiler = new PatternCompiler(locale);
  const processed = traverse(compiler, bundle);
  const contents = Object.keys(processed).map((messageKey) => {
    const entry = processed[messageKey];
    // Param types for TS
    const params = Object.keys(entry.paramTypes).map(
      (paramKey) => `${paramKey}:${entry.paramTypes[paramKey]}`
    );
    const paramString = params.length ? `p: {${params.join(',')}}` : '';
    return `  "${messageKey}": (${paramString}) => ${entry.formatter}`;
  });
  const targetDir = path.dirname(targetFile);
  fsx.ensureDirSync(targetDir);
  fsx.writeFileSync(targetFile, wrapInModule(`{\n${contents.join(',\n')}\n}`, exportType));
}

function wrapInModule(contents, exportType) {
  return `const bundle = ${contents};
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

/**
 * Compile the message bundle in ICU format. This function starts with the "root"
 * message bundle and attempts to discover bundles for all available locales by
 * traversing the root bundle's directory and looking for locale directory names.
 * Any file found under locale directories whose names match the root bundle will
 * also be compiled.
 * When creating the output file in the given targetDir, the locale directory
 * structure from the source will be recreated.
 * @param {string} rootDir The path to the root message bundle
 * @param {string} bundleName The name of the bundle file
 * @param {string} locale The locale of the root message bundle
 * @param {string} outDir The target directory where the compiled root message
 * @param {string} module The type of module to produce -- 'amd' or 'esm'
 * @param {string} supportedLocales The comma-separated list of supported locales
 * to build
 */
module.exports = function build({
  rootDir,
  bundleName,
  locale,
  outDir,
  module,
  supportedLocales = ''
}) {
  const jsonRegEx = /\.json$/;
  if (!jsonRegEx.test(bundleName)) {
    throw Error(`${bundleName} must be a JSON file`);
  }
  const pkg = require('./package.json');
  const targetBundleName = bundleName.replace(jsonRegEx, '.ts');

  // Traverse root bundle
  const rootBundle = getBundle(path.join(rootDir, bundleName));
  if (rootBundle) {
    convertBundle(rootBundle, locale, path.join(outDir, targetBundleName), true);
  }

  fsx
    // Traverse all locales, merging all base locales
    .readdirSync(rootDir)
    // Merge in supported locales to build. If physical dirs don't exist, they'll
    // inherit the root translations
    .concat(supportedLocales.split(','))
    .forEach((locale) => {
      if (isNlsDir(locale)) {
        // Combine all levels into single bundle, starting with rootBundle
        const combinedBundle = Object.assign({}, rootBundle);
        const localeParts = locale.split('-');
        for (let i = 0, len = localeParts.length; i < len; i++) {
          // Build segment from region (0) to index
          let segment = localeParts.slice(0, i + 1).join('-');
          const perBundle = getBundle(path.join(rootDir, segment, bundleName));
          Object.assign(combinedBundle, perBundle);
        }

        convertBundle(combinedBundle, locale, path.join(outDir, locale, targetBundleName));
      }
    });

  if (module) {
    transpile(path.resolve(outDir), module);
  }
};
