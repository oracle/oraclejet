'use strict';
const path = require('path');
const fsx = require('fs-extra');
const { spawnSync } = require('child_process');


describe('CLI', () => {
  const node = process.argv[0];
  const outputRoot = path.resolve(__dirname, 'built');
  const builder = path.resolve(__dirname, '../l10nBundleBuilder.js');
  const outputDir = path.resolve(outputRoot, 'cli');

  function runBuilder(args) {
    return spawnSync(node, [builder, ...args], { cwd: __dirname });
  }

  beforeAll(() => fsx.removeSync(outputDir));

  const args = [
    `--rootDir=${path.resolve(__dirname, 'resources/nls')}`,
    '--bundleName=app-strings.json',
    '--locale=en-US',
    `--outDir=${outputDir}`
  ];
  const omitArg = (name) => (arg) => !arg.startsWith(`--${name}=`);

  const runFailureTest = (...names) => names.forEach(name =>
    it(`fails with no ${name}`, () => {
      const build = runBuilder(args.filter(omitArg(name)));
      expect(build.output[2].toString()).toMatch(/^Usage:/);
      expect(build.status).toEqual(1);
    })
  );

  it('fails with no arguments', () => {
    const build = runBuilder([]);
    expect(build.output[2].toString()).toMatch(/^Usage:/);
    expect(build.status).toEqual(1);
  });

  runFailureTest('rootDir', 'bundleName', 'locale', 'outDir');

  it('succeeds with required arguments', () => {
    const build = runBuilder(args);
    expect(build.output[2].toString()).toEqual('');
    expect(build.status).toEqual(0);
  })
});
