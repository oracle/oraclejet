# Autoresearch: issue 59 aria-describedby trimming

## Objective

Normalize the `aria-describedby` value written by `_AppendInputHelper()` so the helper ID is appended without leading or trailing whitespace.

## Metrics
- **Primary**: `pass` (unitless, higher is better)
- **Secondary**: package smoke via `npm pack --dry-run`

## How to Run
`./autoresearch.sh`

The script runs the jsdom-based repro and prints `METRIC pass=0` on mismatch or `METRIC pass=1` on success.

## Files in Scope
- `scripts/repros/issue-059-describedby-trim.cjs` - deterministic repro harness
- `dist/js/libs/oj/debug/ojinputtext.js` - AMD debug runtime
- `dist/js/libs/oj/debug_esm/ojinputtext.js` - ESM debug runtime
- `dist/js/libs/oj/min/ojinputtext.js` - minified runtime bundle

## Off Limits
- Unrelated input components
- Styling assets
- Metadata files

## Constraints
- Keep the fix scoped to whitespace normalization in `aria-describedby`
- Preserve `npm pack --dry-run`
- No new production dependencies

## What's Been Tried
- Built a jsdom-based repro that initializes `ojInputText`, forces the `_AppendInputHelper()` path, and checks the resulting `aria-describedby` value
- The baseline produced `" helper-id"` instead of `"helper-id"`
- The winning change trims the concatenated `describedBy` string right before writing it back to the element in debug, ESM, and minified bundles
