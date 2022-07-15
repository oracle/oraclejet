'use strict';
const assert = require('assert');
const path = require('path');
const build = require('../Bundler');
const fsx = require('fs-extra');
const vm = require('vm');
const glob = require('glob');

function runTestCases(extractBundle) {
  describe('Bundle files', () => {
    it('ignores unsupported types', () => {
      const bundle = extractBundle(`app-strings.js`);
      assert(Object.keys(bundle).indexOf('@count') === -1, '@count should not be in bundle');
      assert(
        Object.keys(bundle).indexOf('@@x-base-bundle') === -1,
        '@@x-base-bundle should not be in bundle'
      );
    });

    it('creates the root bundle in English', () => {
      const bundle = extractBundle(`app-strings.js`);
      assert.equal(bundle.contentArea({ name: 'Dashboard' }), 'Dashboard Content Area');
      assert.equal(
        bundle.pageIntro({ name: 'Dashboard' }),
        'To change the content of this section, you will make edits to the Dashboard file located in the /js/views folder.'
      );
    });

    it('creates the azb bundle in Azerbaijani', () => {
      const bundle = extractBundle('azb/app-strings.js');
      assert.equal(bundle.welcome(), 'Xoş gəlmisiniz');
    });

    it('creates the azb-AZ bundle in Azerbaijani', () => {
      const bundle = extractBundle('azb-AZ/app-strings.js');
      assert.equal(bundle.welcome(), 'Xoş gəlmisiniz');
      assert.equal(bundle.contentArea({ name: 'Dashboard' }), 'Dashboard Məzmun sahəsi');
    });

    it('creates the ru bundle in Russian', () => {
      const bundle = extractBundle(`ru/app-strings.js`);
      // Derived value from root bundle--in English
      assert.equal(bundle.welcome(), 'Welcome');
      assert.equal(bundle.contentArea({ name: 'Dashboard' }), 'Dashboard область содержимого');
    });

    it('creates the ru-RU bundle in Russian', () => {
      const bundle = extractBundle(`ru-RU/app-strings.js`);
      // Derived value from root bundle--in English
      assert.equal(bundle.welcome(), 'Welcome');
      assert.equal(bundle.contentArea({ name: 'Dashboard' }), 'Dashboard область содержимого');
      assert.equal(
        bundle.pageIntro({ name: 'Dashboard' }),
        'Чтобы изменить содержимое этого раздела, вы внесете изменения в файл Dashboard, расположенный в папке /js/views.'
      );
    });

    it('creates the zh bundle in Russian', () => {
      const bundle = extractBundle(`zh/app-strings.js`);
      // Derived value from root bundle--in English
      assert.equal(bundle.welcome(), '欢迎');
      assert.equal(bundle.contentArea({ name: 'Dashboard' }), 'Dashboard Content Area');
    });

    it('creates the zh-Hans bundle in Russian', () => {
      const bundle = extractBundle(`zh-Hans/app-strings.js`);
      // Derived value from root bundle--in English
      assert.equal(bundle.welcome(), '欢迎');
      assert.equal(bundle.contentArea({ name: 'Dashboard' }), 'Dashboard Content Area');
    });

    it('creates the zh-Hans-CN bundle in Russian', () => {
      const bundle = extractBundle(`zh-Hans-CN/app-strings.js`);
      // Derived value from root bundle--in English
      assert.equal(bundle.welcome(), '欢迎');
      assert.equal(bundle.contentArea({ name: 'Dashboard' }), 'Dashboard Content Area');
    });

    it('creates parameterized plural values', () => {
      const bundle = extractBundle(`ru-RU/app-strings.js`);
      assert.equal(
        bundle.invitation({
          host: 'Barbara',
          guest: 'Phil',
          gender_of_host: 'female',
          num_guests: 0
        }),
        'Barbara does not give a party.'
      );
      assert.equal(
        bundle.invitation({
          host: 'Barbara',
          guest: 'Phil',
          gender_of_host: 'female',
          num_guests: 1
        }),
        'Barbara invites Phil to her party.'
      );
      assert.equal(
        bundle.invitation({
          host: 'Barbara',
          guest: 'Phil',
          gender_of_host: 'female',
          num_guests: 2
        }),
        'Barbara invites Phil and one other person to her party.'
      );
      assert.equal(
        bundle.invitation({
          host: 'Bob',
          guest: 'Sue',
          gender_of_host: 'male',
          num_guests: 3
        }),
        'Bob invites Sue and 2 other people to his party.'
      );
    });

    it('uses plural select rules for buckets', () => {
      const bundle = extractBundle(`ru-RU/app-strings.js`);
      assert.equal(
        bundle.plural({
          total_rows: 0
        }),
        'нет строк'
      );
      assert.equal(
        bundle.plural({
          total_rows: 1
        }),
        '1 row'
      );
      assert.equal(
        bundle.plural({
          total_rows: 2
        }),
        'несколько рядов'
      );
    });
  });

  describe('Override files', () => {
    it('creates the ru override bundle in Russian', () => {
      const bundle = extractBundle(`ru/app-strings-x.js`);
      assert.equal(bundle.contentArea({ name: 'Dashboard' }), 'Dashboard область содержимого');
    });

    it('creates the ru-RU override bundle in Russian', () => {
      const bundle = extractBundle(`ru-RU/app-strings-x.js`);
      assert.equal(Object.keys(bundle).length, 3, "override shouldn't have root keys");
      assert.equal(bundle.contentArea({ name: 'Dashboard' }), 'Dashboard область содержимого');
      assert.equal(
        bundle.pageIntro({ name: 'Dashboard' }),
        'Чтобы изменить содержимое этого раздела, вы внесете изменения в файл Dashboard, расположенный в папке /js/views.'
      );
    });
  });
}

const outputRoot = path.resolve(__dirname, 'built');

describe('TS output', () => {
  const outDir = path.resolve(outputRoot, 'ts');
  beforeAll(() => {
    fsx.removeSync(outDir);
    build({
      rootDir: `${__dirname}/resources/nls`,
      bundleName: 'app-strings.json',
      locale: 'en-US',
      outDir
    });
    build({
      rootDir: `${__dirname}/resources/nls`,
      bundleName: 'app-strings-x.json',
      locale: 'en-US',
      outDir
    });
  });

  it('does not produce JS', () => {
    assert(glob.sync(`${outDir}/**/*.js`).length === 0, 'should not have JS');
  });
});

/**
 * Read contents of ES6 file and convert to CommonJS export for Node testing
 * @param {string} outDir
 * @param {string} filePath
 */
function extractEsmBundle(outDir, filepath) {
  const bundleContents = fsx.readFileSync(path.join(outDir, filepath)).toString();
  const script = new vm.Script(bundleContents.replace(/export default/g, 'extracted ='));
  const context = vm.createContext({});
  script.runInContext(context);
  return context.extracted;
}

describe('ESM default export', () => {
  const outDir = path.resolve(outputRoot, 'esm');

  beforeAll(() => {
    fsx.removeSync(outDir);
    build({
      rootDir: `${__dirname}/resources/nls`,
      bundleName: 'app-strings.json',
      locale: 'en-US',
      outDir,
      module: 'esm'
    });
    build({
      rootDir: `${__dirname}/resources/nls`,
      bundleName: 'app-strings-x.json',
      locale: 'en-US',
      outDir,
      module: 'esm'
    });
  });

  runTestCases((fp) => extractEsmBundle(outDir, fp));
});

describe('AMD default export', () => {
  const outDir = path.resolve(outputRoot, 'amd');
  /**
   * Read contents of ES6 file and convert to CommonJS export for Node testing
   * @param {string} filePath
   */
  function extractBundle(filepath) {
    const bundleContents = fsx.readFileSync(path.join(outDir, filepath)).toString();
    // Create a 'define' method in the context which returns the object passed in
    const script = new vm.Script(bundleContents, '');
    const context = vm.createContext({
      define: function (rb) {
        // define({ ... })
        if (arguments.length === 1) {
          return rb;
        }
        // define(['require', 'exports'], function(require, exports))
        const exp = {};
        // pass exports for every argument
        const args = new Array(arguments[0].length);
        const ret = arguments[1](...args.fill(exp));
        // AMD may return the value or assign to 'exports'
        const resource = ret || exp;
        return resource.default;
      }
    });
    const rb = script.runInContext(context);
    return rb;
  }

  beforeAll(() => {
    fsx.removeSync(outDir);
    build({
      rootDir: `${__dirname}/resources/nls`,
      bundleName: 'app-strings.json',
      locale: 'en-US',
      outDir,
      module: 'amd'
    });
    build({
      rootDir: `${__dirname}/resources/nls`,
      bundleName: 'app-strings-x.json',
      locale: 'en-US',
      outDir,
      module: 'amd'
    });
  });

  runTestCases(extractBundle);
});

describe('Extra locales', () => {
  const outDir = path.resolve(outputRoot, 'extra');
  beforeAll(() => {
    fsx.removeSync(outDir);
    build({
      rootDir: `${__dirname}/resources/nls`,
      bundleName: 'app-strings.json',
      locale: 'en-US',
      outDir,
      module: 'esm',
      supportedLocales: 'de,de-DE,fr-FR,ru,ru-RU'
    });
    build({
      rootDir: `${__dirname}/resources/nls`,
      bundleName: 'app-strings-x.json',
      locale: 'en-US',
      outDir,
      module: 'esm',
      supportedLocales: 'de,de-DE,fr-FR,ru,ru-RU'
    });
  });

  const extractBundle = (fp) => extractEsmBundle(outDir, fp);
  runTestCases(extractBundle);

  it('creates the de bundle in English', () => {
    const bundle = extractBundle('de/app-strings.js');
    assert.equal(bundle.welcome(), 'Welcome');
  });

  it('creates the de-DE bundle in English', () => {
    const bundle = extractBundle('de-DE/app-strings.js');
    assert.equal(bundle.welcome(), 'Welcome');
  });

  it('creates the fr-FR bundle in English', () => {
    const bundle = extractBundle('fr-FR/app-strings.js');
    assert.equal(bundle.welcome(), 'Welcome');
  });
});
