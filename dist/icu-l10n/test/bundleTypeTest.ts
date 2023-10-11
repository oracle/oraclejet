import * as fsx from 'fs-extra';

import { describe, expect, test } from '@jest/globals';

import { build } from '../Bundler';
import glob from 'glob';
import path from 'path';

describe('L10n builder TypeScript tests', () => {
  const outputRoot = `${__dirname}/built`;
  const rootDir = `${__dirname}/resources/nls`;

  describe('TS-only output', () => {
    const outDir = path.resolve(outputRoot, 'ts');
    beforeAll(() => {
      fsx.removeSync(outDir);
      build({
        rootDir,
        bundleName: 'app-strings.json',
        locale: 'en-US',
        outDir
      });
      build({
        rootDir,
        bundleName: 'app-strings-x.json',
        locale: 'en-US',
        outDir
      });
    });

    test('does not produce JS', () => {
      expect(glob.sync(`${outDir}/**/*.js`).length).toEqual(0);
    });

    test('retrieves a value from the TS bundle', async () => {
      const bundle = (await import(`${outDir}/app-strings`)).default;
      expect(bundle.testPlural({ itemCount: 2 })).toEqual('You have 2 items');
    });
  });
});
