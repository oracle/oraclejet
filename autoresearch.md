# Autoresearch: issue 93 package-level ESM entry points

## Objective

Expose representative Oracle JET modules through native package subpath imports like `@oracle/oraclejet/ojkeyset`, while preserving the self-contained `debug_esm` runtime and locale-switch behavior.

## Metrics
- **Primary**: `esm_package_entrypoints_passed` (unitless, higher is better)
- **Secondary**: package smoke via `npm pack --dry-run`

## How to Run
`./autoresearch.sh`

The script packs the current repo, installs it into a temp project, imports representative package subpaths from the installed package, runs a light behavior check for each one, and prints `METRIC esm_package_entrypoints_passed=<count>`.

## Files in Scope
- `scripts/repros/issue-093-esm-imports.mjs` - direct-file ESM smoke harness
- `scripts/repros/issue-093-package-import-check-template.mjs` - installed-package subpath harness template
- `dist/js/libs/oj/debug_esm/*.js` - ESM runtime modules
- `dist/js/libs/oj/debug_esm/package.json` - nested module-type marker
- `dist/js/libs/oj/debug_esm/ojtranslations/*.js` - ESM locale shims
- `package.json` - package-level export wiring

## Off Limits
- AMD debug bundles under `dist/js/libs/oj/debug`
- Minified AMD bundles under `dist/js/libs/oj/min`
- Styling assets

## Constraints
- Do not rely on external bundler aliases or a fake `ojs` npm package
- Keep AMD builds untouched
- Preserve `npm pack --dry-run`
- Avoid overfitting to one module, use the representative installed-package import-and-behavior set

## What's Been Tried
- Baseline direct imports showed only `ojlogger.js` loading cleanly
- Representative failures came from bare `ojs/*` specifiers inside `debug_esm` files, which Node resolved as a missing package rather than internal sibling modules
- Rewriting `ojs/*` specifiers to relative `./*.js` imports and marking `debug_esm` as `type: module` raised the representative import count from `1` to `3`
- The remaining failures were traced to an AMD-plugin translation import in `ojconfig.js` and a stray `oj.DataProvider` global assignment in `ojdataprovider.js`
- A generated ESM shim for the root translations bundle plus the `oj$1.DataProvider` fix brought the stronger behavior-checked benchmark to `5/5`
- Adding `ojconfig.setLocale('fr')` and `ojconfig.setLocale('de')` exposed the dynamic locale-loading path still using AMD `ojL10n!` semantics
- Generating ESM locale shims under `debug_esm/ojtranslations/` and rewiring `ojconfig.setLocale()` to those shims raised the locale-switch benchmark from `5` to `7`
- The remaining gap is package ergonomics: direct file imports now work, but package subpath imports like `@oracle/oraclejet/ojkeyset` still fail because `package.json` has no ESM export map
