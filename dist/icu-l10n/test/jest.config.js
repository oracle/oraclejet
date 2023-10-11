const pkg = require('../package.json');
const workspaceConfig = require('@oracle/oraclejet-test-utils/workspace-jest-config');

module.exports = workspaceConfig({
  preset: 'ts-jest',
  displayName: pkg.name,
  rootDir: __dirname,
  testMatch: [ '**/*Test.js', '**/*Test.ts' ]
});
