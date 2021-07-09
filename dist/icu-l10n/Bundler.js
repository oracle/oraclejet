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
    if (!key.match(/^@/)) {
      const value = entry[key];
      if (typeof value !== "string") {
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
 * @param {string} dtsFile If specified, write the type definitions out to the
 * given file name
 * @param {string} moduleType The type of module to output (amd|esm)
 */
function convertBundle(bundle, locale, targetFile, dtsFile, moduleType) {
  const compiler = new PatternCompiler(locale);
  const processed = traverse(compiler, bundle);
  const pluralSelect = compiler.getPluralSelect();
  const formatters = [];
  const typeDefs = [];
  Object.keys(processed).forEach((messageKey) => {
    const entry = processed[messageKey];
    // Object properties
    formatters.push(`  "${messageKey}": ${entry.formatter},`);
    const params = [];
    // Param types for .d.ts
    Object.keys(entry.paramTypes).forEach((paramKey) => {
      params.push(`${paramKey}:${entry.paramTypes[paramKey]}`);
    });
    const paramString = params.length ? `p: {${params.join(",")}}` : "";
    typeDefs.push(`  "${messageKey}": (${paramString}) => string`);
  });
  const targetDir = path.dirname(targetFile);
  const contents = `{\n${formatters.join("\n")}\n}`;
  fsx.ensureDirSync(targetDir);
  fsx.writeFileSync(
    targetFile,
    wrapInModule(moduleType, contents, pluralSelect)
  );
  if (dtsFile) {
    fsx.writeFileSync(
      dtsFile,
      `export const bundle: {\n${typeDefs.join(",\n")}\n}`
    );
  }
}

function wrapInModule(moduleType, contents, pluralSelect) {
  if (moduleType === "esm") {
    return `${pluralSelect}\nexport const bundle = ${contents}`;
  } else if (moduleType === "amd") {
    return `(function() {\n${pluralSelect}\ndefine(${contents})\n}())`;
  }
}

/**
 * Test if a given directory name (base name only) is an NLS directory.
 * @param {string} name The directory name
 * @return True if NLS directory, false otherwise
 */
function isNlsDir(name) {
  return name.match(/^[a-z]{2,3}$/i) || name.match(/^[a-z]{2,3}-.+/);
}

/**
 * Do a deep (recursive) assignment of the source object into the target object.
 * @param {Object} target The target object
 * @param {Object} source The source object
 * @return {Object} The target object
 */
function deepAssign(target, source) {
  if (!source) return target;
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
 * @param {string} moduleType The type of module to output; one of [amd|esm]
 */
module.exports = function build(
  root,
  bundleName,
  rootLocale,
  targetDir,
  moduleType = "esm"
) {
  const jsonRegEx = /\.json$/;
  if (!jsonRegEx.test(bundleName)) {
    throw Error(`${bundleName} must be a JSON file`);
  }
  const targetBundleName = bundleName.replace(jsonRegEx, ".js");
  const dtsName = bundleName.replace(jsonRegEx, ".d.ts");

  // Traverse root bundle
  const rootBundle = getBundle(path.join(root, bundleName));
  if (rootBundle) {
    convertBundle(
      rootBundle,
      rootLocale,
      path.join(targetDir, targetBundleName),
      path.join(targetDir, dtsName),
      moduleType
    );
  }

  // Traverse all locales, merging all base locales
  fsx.readdirSync(root).forEach((locale) => {
    if (isNlsDir(locale)) {
      // Combine all levels into single bundle, starting with rootBundle
      const combinedBundle = deepAssign({}, rootBundle);
      const localeParts = locale.split("-");
      for (let i = 0, len = localeParts.length; i < len; i++) {
        // Build segment from region (0) to index
        let segment = localeParts.slice(0, i + 1).join("-");
        const perBundle = getBundle(path.join(root, segment, bundleName));
        deepAssign(combinedBundle, perBundle);
      }

      convertBundle(
        combinedBundle,
        locale,
        path.join(targetDir, locale, targetBundleName),
        false,
        moduleType
      );
    }
  });
};
