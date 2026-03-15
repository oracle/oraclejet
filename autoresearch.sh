#!/usr/bin/env bash
set -euo pipefail

out=$(mktemp)
if node scripts/repros/issue-059-describedby-trim.cjs >"$out" 2>&1; then
  cat "$out"
  echo "METRIC pass=1"
else
  cat "$out"
  echo "METRIC pass=0"
fi
rm -f "$out"
