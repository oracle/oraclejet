const pkg = require('../package.json');
const workspaceConfig = require('@oracle/oraclejet-test-utils/workspace-jest-config');

module.exports = workspaceConfig({
  displayName: pkg.name,
  rootDir: __dirname,
  testMatch: [ "**/*Test.js" ]
});
