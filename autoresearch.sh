#!/usr/bin/env bash
set -euo pipefail
node --no-warnings scripts/repros/issue-093-esm-imports.mjs
