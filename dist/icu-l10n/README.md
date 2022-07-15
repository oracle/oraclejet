# JET ICU Message Format Parser
This utility parses message bundles written in ICU format and converts them to
formatter functions to be called by the application to get localized strings.

## Message Bundle Restrictions
* Message bundle files must be JSON, and only top-level properties are supported
(no nesting). The string values must follow the ICU format described at
http://userguide.icu-project.org/formatparse/messages

* Any keys which start with "@" will be ignored, and will not be written to the
output file(s).

### Ex. app-strings.json
```json
{
  "greeting": "Hello {name}",
  "invitation": "{gender_of_host, select, female {{num_guests, plural, ..."
}
```

## Usage
Run the l10nBundleBuilder.js script with arguments:

```sh
$ l10nBundleBuilder.js <root-message-bundle.json> <root-bundle-locale> <output-dir>
```

### Example, running with a root bundle in en-US locale
```sh
$ l10nBundleBuilder.js resources/nls/app-strings.json en-US dist
```

## Output
The parser read the given root bundle and convert the message to an ES6 module
containing a single named export "bundle" object. Within the object, each message
name will be the key to the formatter function.

### Ex. app-strings.js
```javascript
export const bundle = {
  "greeting": function(p) { ... },
  "invitation": function(p) { ... }
};
```

In addition to the root bundle, the parser will traverse all directories at the
same level, looking for other NLS directories which contain message bundle files
whose name matches that of the root bundle. If found, it combine all messages
starting from the root bundle up to the most specific bundle, with the most specific
ones taking precendent, and write the bundles to the output directory.

A TypeScript definition file (d.ts) will also be generated and written to the
output directory of the root bundle. This file describes the contents of the
output bundle and its function parameter types.

### Ex. app-strings.d.ts
```javascript
export const bundle = {
  "greeting": () => string,
  "invitation": (p: {gender_of_host:string, num_guests:number}) => string
}
```

## Options

### rootDir
The root directory of your ICU bundles, ex. `--rootDir=resources/nls`

### bundleName
The bundle file name that should be processed, ex. `--bundleName=app-strings.json`

### locale
The locale of the root bundle, ex. `--locale=en-US`

### outDir
The directory where the resource bundles will be written, ex. `--outDir=src/resources/nls`

### module
The type of module to produce for the bundles. Supported values are `esm` or `amd`.
If not specified, only the original Typescript source files will be produced, and
no transpilation is performed.

Note that the bundle will be default-exported for all module types.

## Changes in 2.0.0
### AMD output
In 1.0.0, AMD bundles were constructed with
```javascript
define({ ...bundle contents... })
```
Default exports now follow ES module format, and contents are underneath the
`default` property
```javascript
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = {
      ...bundle contents...
    };
});
```

### Typescript
All bundles are now created in Typescript and transpiled to their target module
formats. The TS sources replace the `d.ts` files previously created in 1.0.0, and
an additional `BundleType` is exported. This type can be imported for type-safe
usage during design-time.
```javascript
import type { BundleType as App1Bundle } from './resources/nls/app1bundle';
import type { BundleType as App2Bundle } from './resources/nls/app2bundle';
```
Typescript [type imports](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
are only for design-time, and are removed from the output when transpiled.
