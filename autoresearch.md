# Autoresearch: issue 93 ESM module support

## Objective

Make the shipped `debug_esm` Oracle JET modules self-contained enough to load under native Node ESM without relying on an external `ojs` package alias.

## Metrics
- **Primary**: `esm_modules_passed` (unitless, higher is better)
- **Secondary**: package smoke via `npm pack --dry-run`

## How to Run
`./autoresearch.sh`

The script imports representative `debug_esm` modules, runs a small behavior check for each one, and also exercises `ojconfig.setLocale()` for 2 locales, then prints `METRIC esm_modules_passed=<count>`.

## Files in Scope
- `scripts/repros/issue-093-esm-imports.mjs` - representative ESM import harness
- `dist/js/libs/oj/debug_esm/*.js` - ESM runtime modules
- `dist/js/libs/oj/debug_esm/package.json` - nested module-type marker if needed
- `package.json` - only if package-level ESM wiring becomes necessary

## Off Limits
- AMD debug bundles under `dist/js/libs/oj/debug`
- Minified AMD bundles under `dist/js/libs/oj/min`
- Styling assets

## Constraints
- Do not rely on external bundler aliases or a fake `ojs` npm package
- Keep AMD builds untouched
- Preserve `npm pack --dry-run`
- Avoid overfitting to one module, use the representative import-and-behavior set

## What's Been Tried
- Baseline direct imports showed only `ojlogger.js` loading cleanly
- Representative failures came from bare `ojs/*` specifiers inside `debug_esm` files, which Node resolved as a missing package rather than internal sibling modules
- Rewriting `ojs/*` specifiers to relative `./*.js` imports and marking `debug_esm` as `type: module` raised the representative import count from `1` to `3`
- The remaining failures were traced to an AMD-plugin translation import in `ojconfig.js` and a stray `oj.DataProvider` global assignment in `ojdataprovider.js`
- A generated ESM shim for the root translations bundle plus the `oj$1.DataProvider` fix brought the stronger behavior-checked benchmark to `5/5`
- The next benchmark broadening step added `ojconfig.setLocale('fr')` and `ojconfig.setLocale('de')`, which initially failed because the dynamic locale-loading path kept AMD `ojL10n!` semantics
- Generating ESM locale shims under `debug_esm/ojtranslations/` and rewiring `ojconfig.setLocale()` to those shims raised the locale-switch benchmark from `5` to `7`
