#! /usr/bin/env node

const fsx = require("fs-extra");
const path = require("path");
const PatternCompiler = require("./PatternCompiler");

/**
 * Traverse the message bundle and compile all strings.
 * @param {PatternCompiler} compiler The instance of the PatternCompiler
 * @param {Object} entry The message bundle
 * @return {Object} A message bundle whose strings are wrapped by functions
 * generated from the PatternCompiler.
 */
function traverse(compiler, entry) {
  const output = {};
  Object.keys(entry).forEach((key) => {
    // Ignore '@...' annotation entries
    if (!key.match(/^@\w/)) {
      const value = entry[key];
      if (typeof value !== 'string') {
        throw Error(`"${key}" value must be a string`);
      }
      output[key] = compiler.compile(value);
    }
  });
  return output;
}

/**
 * Get the bundle as an object from the given filepath
 * @param {string} filepath
 * @return {object} The bundle from the file
 */
function getBundle(filepath) {
  let bundle = {};
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
 * @param {string} dtsFile If specified, write the type definitions out to the
 * given file name
 */
function convertBundle(bundle, locale, targetFile, dtsFile) {
  const compiler = new PatternCompiler(locale);
  const processed = traverse(compiler, bundle);
  const pluralSelect = compiler.getPluralSelect();
  const formatters = [];
  const typeDefs = [];
  Object.keys(processed).forEach(messageKey => {
    const entry = processed[messageKey];
    // Object properties
    formatters.push(`  "${messageKey}": ${entry.formatter},`);
    const params = [];
    // Param types for .d.ts
    Object.keys(entry.paramTypes).forEach(paramKey => {
      params.push(`${paramKey}:${entry.paramTypes[paramKey]}`);
    });
    const paramString = params.length ? `p: {${params.join(',')}}` : '';
    typeDefs.push(`  "${messageKey}": (${paramString}) => string`);
  });
  const targetDir = path.dirname(targetFile);
  fsx.ensureDirSync(targetDir);
  fsx.writeFileSync(
    targetFile,
    `${pluralSelect}export const bundle = {\n${formatters.join('\n')}\n};`
  );
  if (dtsFile) {
    fsx.writeFileSync(
      dtsFile,
      `export const bundle: {\n${typeDefs.join(',\n')}\n}`
    );
  }
}

/**
 * Test if a given directory name (base name only) is an NLS directory.
 * @param {string} name The directory name
 * @return True if NLS directory, false otherwise
 */
function isNlsDir(name) {
  return name.match(/^[a-z]{2}$/i)
    || name.match(/^[a-z]{2}-.+/);
}

/**
 * Do a deep (recursive) assignment of the source object into the target object.
 * @param {Object} target The target object
 * @param {Object} source The source object
 * @return {Object} The target object
 */
function deepAssign(target, source) {
  Object.keys(source).forEach((key) => {
    const value = source[key];
    if (typeof value === "object") {
      target[key] = target[key] || {};
      deepAssign(target[key], value);
    } else {
      target[key] = value;
    }
  });
  return target;
}

/**
 * Compile the message bundle in ICU format. This function starts with the "root"
 * message bundle and attempts to discover bundles for all available locales by
 * traversing the root bundle's directory and looking for locale directory names.
 * Any file found under locale directories whose names match the root bundle will
 * also be compiled.
 * When creating the output file in the given targetDir, the locale directory
 * structure from the source will be recreated.
 * @param {string} rootBundleFile The path to the root message bundle
 * @param {string} rootLocale The locale of the root message bundle
 * @param {string} targetDir The target directory where the compiled root message
 */
function parse(rootBundleFile, rootLocale, targetDir) {
  const nlsRoot = path.dirname(rootBundleFile);
  const bundleName = path.basename(rootBundleFile);
  const jsonRegEx = /\.json$/;
  if (!jsonRegEx.test(bundleName)) {
    throw Error(`${bundleName} must be a JSON file`);
  }
  const targetBundleName = bundleName.replace(jsonRegEx, '.js');
  const dtsName = bundleName.replace(jsonRegEx, '.d.ts');

  // Traverse root bundle
  const rootBundle = getBundle(rootBundleFile);
  convertBundle(
    rootBundle,
    rootLocale,
    `${targetDir}${path.sep}${targetBundleName}`,
    `${targetDir}${path.sep}${dtsName}`
  );
  // Traverse all locales, merging all base locales
  fsx.readdirSync(nlsRoot).forEach((locale) => {
    if (isNlsDir(locale)) {
      // Combine all levels into single bundle, starting with rootBundle
      const combinedBundle = deepAssign({}, rootBundle);
      const localeParts = locale.split('-');
      for (let i=0,len=localeParts.length; i<len; i++) {
        // Build segment from region (0) to index
        let segment = localeParts.slice(0, i+1).join('-');
        const perBundle = getBundle(`${nlsRoot}/${segment}/${bundleName}`);
        deepAssign(combinedBundle, perBundle);
      }

      convertBundle(
        combinedBundle,
        locale,
        `${targetDir}${path.sep}${locale}${path.sep}${targetBundleName}`
      );
    }
  });
}

// Add support for calling the parser from command-line
const args = Array.from(process.argv).slice(2);
if (args.length === 3) {
  parse.apply(undefined, args);
}
else {
  console.warn(`Usage: ${path.basename(process.argv[1])} <message-bundle.json> <bundle-locale> <output-dir>`);
}
