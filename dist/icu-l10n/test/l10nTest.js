'use strict';
const assert = require('assert');
const path = require('path');
const { build, isNlsDir } = require('../Bundler');
const fsx = require('fs-extra');
const vm = require('vm');
const glob = require('glob');

const rootDir = path.join(__dirname, 'resources/nls');
const outputRoot = path.resolve(__dirname, 'built');

function runTestCases(extractBundle) {
  describe('Bundle files', () => {
    it('ignores unsupported types', () => {
      const bundle = extractBundle(`app-strings.js`);
      assert(Object.keys(bundle).indexOf('@count') === -1, '@count should not be in bundle');
      assert(Object.keys(bundle).indexOf('@another_button') === -1, '@another_button should not be in bundle');
      assert(
        Object.keys(bundle).indexOf('@@x-base-bundle') === -1,
        '@@x-base-bundle should not be in bundle'
      );
      assert(
        Object.keys(bundle).indexOf('@@locale') === -1,
        '@@locale should not be in bundle'
      );
    });

    it('creates the root bundle in English', () => {
      const bundle = extractBundle(`app-strings.js`);
      assert.equal(bundle.contentArea({ name: 'Dashboard' }), 'Dashboard Content Area');
      assert.equal(
        bundle.pageIntro({ name: 'Dashboard' }),
        'To change the content of this section, you will make edits to the Dashboard file located in the /js/views folder.'
      );
      assert.equal(bundle.alpha(), 'Alpha');
      assert.equal(bundle.beta(), 'Beta');
      assert.equal(bundle.delta(), 'Delta');
      assert.equal(bundle.epsilon(), 'Epsilon');
      assert.equal(bundle.blank(), '');
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
      const enBundle = extractBundle(`app-strings.js`);
      assert.equal(
        enBundle.plural({
          total_rows: 0
        }),
        'No rows'
      );
      assert.equal(
        enBundle.plural({
          total_rows: 1
        }),
        '1 row'
      );
      assert.equal(
        enBundle.plural({
          total_rows: 2
        }),
        '2 rows'
      );

      const ruBundle = extractBundle(`ru-RU/app-strings.js`);
      assert.equal(
        ruBundle.plural({
          total_rows: 0
        }),
        'нет строк'
      );
      assert.equal(
        ruBundle.plural({
          total_rows: 1
        }),
        '1 ряд'
      );
      assert.equal(
        ruBundle.plural({
          total_rows: 2
        }),
        '2 ряда'
      );
    });
  });

  describe('Number formats', () => {
    const bundle = extractBundle('app-strings.js');

    it('formats date/time', () => {
      const testDate = new Date('2022-09-29 07:25 GMT');
      assert.equal(
        bundle.dateFormat({
          date_time: testDate,
          item: 'an alien',
          planet: 5
        }),
        'At 25 past, on September 29, there was an alien on planet 5.'
      );
    });

    it('formats currency', () => {
      assert.equal(bundle.currencyFormat({ gbp: 99 }), 'The budget is +£99 and no more.');
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

describe('TS output', () => {
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

  it('does not produce JS', () => {
    assert(glob.sync(`${outDir}/**/*.js`).length === 0, 'should not have JS');
  });
});

describe('Custom hooks', () => {

  it('can produce custom return types', () => {
    const outDir = path.resolve(outputRoot, 'custom-hooks');
    fsx.removeSync(outDir);
    build({
      rootDir,
      bundleName: 'app-strings.json',
      locale: 'en-US',
      outDir,
      hooks: require.resolve('./custom-hooks.js'),
      module: 'cjs'
    });

    const bundle = extractCjsBundle(outDir, 'app-strings.js').default;
    expect(bundle.welcome().bundle).toEqual('app-strings.json');
    expect(bundle.welcome().key).toEqual('welcome');
    expect(bundle.welcome().params).toBeUndefined();
    expect(bundle.welcome().value).toEqual('Welcome');
  });

  it('can produce custom return types without definition', () => {
    const outDir = path.resolve(outputRoot, 'custom-hooks-no-def');
    fsx.removeSync(outDir);
    build({
      rootDir,
      bundleName: 'app-strings.json',
      locale: 'en-US',
      outDir,
      hooks: require.resolve('./custom-hooks-no-def.js'),
      module: 'cjs'
    });

    const bundle = extractCjsBundle(outDir, 'app-strings.js').default;
    expect(bundle.welcome().bundleId).toEqual('app-strings.json');
    expect(bundle.welcome().id).toEqual('welcome');
    expect(bundle.welcome().params).toBeUndefined();
    expect(bundle.welcome().translation).toEqual('Welcome');
  });
});

/**
 * Read contents of CJS bundle
 * @param {string} outDir
 * @param {string} filePath
 */
function extractCjsBundle(outDir, filepath) {
  return require(path.join(outDir, filepath));
}

describe('CJS default export', () => {
  const outDir = path.resolve(outputRoot, 'cjs');

  fsx.removeSync(outDir);
  build({
    rootDir,
    bundleName: 'app-strings.json',
    locale: 'en-US',
    outDir,
    module: 'cjs'
  });
  build({
    rootDir,
    bundleName: 'app-strings-x.json',
    locale: 'en-US',
    outDir,
    module: 'cjs'
  });

  runTestCases((fp) => extractCjsBundle(outDir, fp).default);
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

  fsx.removeSync(outDir);
  build({
    rootDir,
    bundleName: 'app-strings.json',
    locale: 'en-US',
    outDir,
    module: 'amd'
  });
  build({
    rootDir,
    bundleName: 'app-strings-x.json',
    locale: 'en-US',
    outDir,
    module: 'amd'
  });

  runTestCases(extractBundle);
});

describe('Extra locales', () => {
  const outDir = path.resolve(outputRoot, 'extra');
  const additionalLocales = ['de', 'de-DE', 'fr-FR', 'ru', 'ru-RU'];
  const allLocales = [
    ...new Set(fsx.readdirSync(rootDir).filter(isNlsDir).concat(additionalLocales).sort())
  ];

  fsx.removeSync(outDir);
  build({
    rootDir,
    bundleName: 'app-strings.json',
    locale: 'en-US',
    outDir,
    module: 'cjs',
    additionalLocales
  });
  build({
    rootDir,
    bundleName: 'app-strings-x.json',
    locale: 'en-US',
    outDir,
    module: 'cjs',
    additionalLocales
  });

  const extractBundle = (fp) => extractCjsBundle(outDir, fp).default;
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

  it('exports the list of supported locales', () => {
    const supportedLocales = extractBundle('supportedLocales.js');
    assert.deepEqual(supportedLocales, allLocales);
  });
});
