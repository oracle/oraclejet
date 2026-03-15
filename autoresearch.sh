#!/usr/bin/env bash
set -euo pipefail

workdir=$(mktemp -d)
cleanup() {
  rm -rf "$workdir"
}
trap cleanup EXIT

pkg=$(npm pack --silent)
mv "$pkg" "$workdir/"
cd "$workdir"

npm init -y >/dev/null
npm install --silent "./$pkg" >/dev/null
cp /home/ubuntu/pi/oraclejet/.worktrees/issue-93-esm-support/scripts/repros/issue-093-package-import-check-template.mjs ./check.mjs
node --no-warnings ./check.mjs
