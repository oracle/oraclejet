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
 * @param {string=} props.module The type of module to produce -- 'esm', 'amd', or 'legacy-amd'
 * @param {string=} props.exportType The type of export to produce -- 'default' or 'named'
 * @param {boolean=} props.override Indicates the bundle is an override, and only the root
 * locale and those explicitly stated in [--supportedLocales] will be built.
 * @param {string[]=} props.additionalLocales An array of additional locales to build
 * @param {string=} hooks A path to the custom hooks file
 */
export function build({
  rootDir,
  bundleName,
  locale,
  outDir,
  module,
  exportType,
  override,
  additionalLocales,
  hooks
}: {
  rootDir: string;
  bundleName: string;
  locale: string;
  outDir: string;
  module?: string | undefined;
  exportType?: string | undefined;
  override?: boolean | undefined;
  additionalLocales?: string[] | undefined;
}): void;
/**
 * Test if a given directory name (base name only) is an NLS directory.
 * @param {string} name The directory name
 * @return True if NLS directory, false otherwise
 */
export function isNlsDir(name: string): boolean;
