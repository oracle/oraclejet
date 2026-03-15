# Autoresearch: issue 70 signDisplay support

## Objective

Make the JET native number converter honor `signDisplay` so `NumberConverter({ signDisplay: 'always' }).format(5)` matches native `Intl.NumberFormat` behavior.

## Metrics
- **Primary**: `pass` (unitless, higher is better)
- **Secondary**: package smoke via `npm pack --dry-run`

## How to Run
`./autoresearch.sh`

The script runs the issue-specific repro and prints `METRIC pass=0` on mismatch or `METRIC pass=1` on success.

## Files in Scope
- `scripts/repros/issue-070-sign-display.cjs` - deterministic repro harness
- `dist/js/libs/oj/debug/ojconverter-nativenumber.js` - AMD debug runtime
- `dist/js/libs/oj/debug_esm/ojconverter-nativenumber.js` - ESM debug runtime
- `dist/js/libs/oj/min/ojconverter-nativenumber.js` - minified runtime bundle
- `dist/types/ojconverter-nativenumber/types.d.ts` - public TS option types

## Off Limits
- Unrelated converter files
- Styling assets
- Component metadata unrelated to number conversion

## Constraints
- Keep the fix scoped to `signDisplay`
- Preserve `npm pack --dry-run`
- Match native `Intl.NumberFormat` output for the repro cases
- No new dependencies

## What's Been Tried
- Reproduced the bug with `node scripts/repros/issue-070-sign-display.cjs`
- The baseline reported `"5"` instead of `"+5"` and `"0"` instead of `"+0"`
- Static inspection showed `_getNativeOptions()` and the resolved option shape never carried `signDisplay`, even though helper code already knew how to discover locale-specific plus signs
- The winning change threads `signDisplay` through resolved options, native formatter options, and the public converter type definitions
