JET ICU Message Format Parser
=============================

This utility parses message bundles written in ICU format and converts them to
formatter functions to be called by the application to get localized strings.

Dependencies
============
The utility depends on these NPM packages to run:
  * intl-messageformat-parser (^5.0.2)
  * make-plural-compiler (^5.1.0)
  * cldr-core (^36.0.0)
  * fs-extra (^4.0.0)

Message Bundle Restrictions
===========================
Message bundle files must be JSON, and only top-level properties are supported
(no nesting). The string values must follow the ICU format described at
http://userguide.icu-project.org/formatparse/messages

Any keys which start with "@" will be ignored, and will not be written to the
output file(s).

Ex. app-strings.json
--------------------
{
  "greeting": "Hello {name}",
  "invitation": "{gender_of_host, select, female {{num_guests, plural, ..."
}

Running
=======
Run the l10nBundleBuilder.js script with arguments:

$ l10nBundleBuilder.js <root-message-bundle.json> <root-bundle-locale> <output-dir>

Example, running with a root bundle in en-US locale
$ l10nBundleBuilder.js resources/nls/app-strings.json en-US dist

Output
======
The parser read the given root bundle and convert the message to an ES6 module
containing a single named export "bundle" object. Within the object, each message
name will be the key to the formatter function.

Ex. app-strings.js
------------------
export const bundle = {
  "greeting": function(p) { ... },
  "invitation": function(p) { ... }
};

In addition to the root bundle, the parser will traverse all directories at the
same level, looking for other NLS directories which contain message bundle files
whose name matches that of the root bundle. If found, it combine all messages
starting from the root bundle up to the most specific bundle, with the most specific
ones taking precendent, and write the bundles to the output directory.

A TypeScript definition file (d.ts) will also be generated and written to the
output directory of the root bundle. This file describes the contents of the
output bundle and its function parameter types.

Ex. app-strings.d.ts
--------------------
export const bundle: {
  "greeting": () => string,
  "invitation": (p: {gender_of_host:string, num_guests:number}) => string
}
