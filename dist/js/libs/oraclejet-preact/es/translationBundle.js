/* @oracle/oraclejet-preact: 13.1.0 */
function __variableDynamicImportRuntime0__(path) {
  switch (path) {
    case '../resources/nls/ar/bundle.ts': return import('./bundle-495fcc58.js');
    case '../resources/nls/ar-XB/bundle.ts': return import('./bundle-62d6b6b7.js');
    case '../resources/nls/bg/bundle.ts': return import('./bundle-806903f9.js');
    case '../resources/nls/bs/bundle.ts': return import('./bundle-dc507b9a.js');
    case '../resources/nls/bs-Cryl/bundle.ts': return import('./bundle-f9ef811b.js');
    case '../resources/nls/bs-Cyrl/bundle.ts': return import('./bundle-bb56c9cd.js');
    case '../resources/nls/cs/bundle.ts': return import('./bundle-bec2ef0e.js');
    case '../resources/nls/da/bundle.ts': return import('./bundle-d16fc490.js');
    case '../resources/nls/de/bundle.ts': return import('./bundle-2c5c590d.js');
    case '../resources/nls/el/bundle.ts': return import('./bundle-427a66bc.js');
    case '../resources/nls/en/bundle.ts': return import('./bundle-757da41d.js');
    case '../resources/nls/en-US/bundle.ts': return import('./bundle-c876449d.js');
    case '../resources/nls/en-XA/bundle.ts': return import('./bundle-ebb93b9f.js');
    case '../resources/nls/en-XC/bundle.ts': return import('./bundle-bd6f024f.js');
    case '../resources/nls/es/bundle.ts': return import('./bundle-34170196.js');
    case '../resources/nls/et/bundle.ts': return import('./bundle-d229eec2.js');
    case '../resources/nls/fi/bundle.ts': return import('./bundle-33b7e858.js');
    case '../resources/nls/fr/bundle.ts': return import('./bundle-6600bb62.js');
    case '../resources/nls/fr-CA/bundle.ts': return import('./bundle-c3f0de08.js');
    case '../resources/nls/he/bundle.ts': return import('./bundle-62cf9b89.js');
    case '../resources/nls/hr/bundle.ts': return import('./bundle-dd53d536.js');
    case '../resources/nls/hu/bundle.ts': return import('./bundle-9fdf13f8.js');
    case '../resources/nls/is/bundle.ts': return import('./bundle-612e884f.js');
    case '../resources/nls/it/bundle.ts': return import('./bundle-a2573b7e.js');
    case '../resources/nls/ja/bundle.ts': return import('./bundle-86fb42d5.js');
    case '../resources/nls/ko/bundle.ts': return import('./bundle-12fe56f5.js');
    case '../resources/nls/lt/bundle.ts': return import('./bundle-34de5056.js');
    case '../resources/nls/lv/bundle.ts': return import('./bundle-9d9e9715.js');
    case '../resources/nls/ms/bundle.ts': return import('./bundle-d8509133.js');
    case '../resources/nls/nl/bundle.ts': return import('./bundle-7c4d342e.js');
    case '../resources/nls/no/bundle.ts': return import('./bundle-b0e978af.js');
    case '../resources/nls/pl/bundle.ts': return import('./bundle-749fb497.js');
    case '../resources/nls/pt/bundle.ts': return import('./bundle-93e1ea1b.js');
    case '../resources/nls/pt-PT/bundle.ts': return import('./bundle-8b643caf.js');
    case '../resources/nls/ro/bundle.ts': return import('./bundle-99a41b15.js');
    case '../resources/nls/ru/bundle.ts': return import('./bundle-7b4e2abe.js');
    case '../resources/nls/sk/bundle.ts': return import('./bundle-6452bd5e.js');
    case '../resources/nls/sl/bundle.ts': return import('./bundle-4e07279a.js');
    case '../resources/nls/sr/bundle.ts': return import('./bundle-ec8a0fe4.js');
    case '../resources/nls/sr-Latn/bundle.ts': return import('./bundle-b4a56747.js');
    case '../resources/nls/sv/bundle.ts': return import('./bundle-5953dd7e.js');
    case '../resources/nls/th/bundle.ts': return import('./bundle-4ccf7e14.js');
    case '../resources/nls/tr/bundle.ts': return import('./bundle-72cdc817.js');
    case '../resources/nls/uk/bundle.ts': return import('./bundle-c6b6d88c.js');
    case '../resources/nls/vi/bundle.ts': return import('./bundle-a901422e.js');
    case '../resources/nls/zh-Hans/bundle.ts': return import('./bundle-b14b6237.js');
    case '../resources/nls/zh-Hant/bundle.ts': return import('./bundle-c757a76f.js');
    default: return new Promise(function(resolve, reject) {
      (typeof queueMicrotask === 'function' ? queueMicrotask : setTimeout)(
        reject.bind(null, new Error("Unknown variable dynamic import: " + path))
      );
    })
   }
 }

var index = (locale) => {
    if (locale) {
        return __variableDynamicImportRuntime0__(`../resources/nls/${locale}/bundle.ts`).then((module) => module.default);
    }
    else {
        return import('./bundle-eae1cdde.js').then((module) => module.default);
    }
};

export { index as default };
/*  */
//# sourceMappingURL=translationBundle.js.map
