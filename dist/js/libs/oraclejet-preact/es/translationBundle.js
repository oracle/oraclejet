/* @oracle/oraclejet-preact: 13.0.0 */
function __variableDynamicImportRuntime0__(path) {
  switch (path) {
    case '../resources/nls/ar/bundle.ts': return import('./bundle-ee30d1f2.js');
    case '../resources/nls/ar-XB/bundle.ts': return import('./bundle-28b230ea.js');
    case '../resources/nls/bg/bundle.ts': return import('./bundle-0f0de81d.js');
    case '../resources/nls/bs/bundle.ts': return import('./bundle-dced003b.js');
    case '../resources/nls/bs-Cryl/bundle.ts': return import('./bundle-263792d0.js');
    case '../resources/nls/bs-Cyrl/bundle.ts': return import('./bundle-82b6a0f5.js');
    case '../resources/nls/cs/bundle.ts': return import('./bundle-9f5ff149.js');
    case '../resources/nls/da/bundle.ts': return import('./bundle-fbdefe0d.js');
    case '../resources/nls/de/bundle.ts': return import('./bundle-153748d3.js');
    case '../resources/nls/el/bundle.ts': return import('./bundle-45201d0a.js');
    case '../resources/nls/en/bundle.ts': return import('./bundle-75bb5037.js');
    case '../resources/nls/en-US/bundle.ts': return import('./bundle-b59fd632.js');
    case '../resources/nls/en-XA/bundle.ts': return import('./bundle-9565292c.js');
    case '../resources/nls/en-XC/bundle.ts': return import('./bundle-430cbee1.js');
    case '../resources/nls/es/bundle.ts': return import('./bundle-04cb79ef.js');
    case '../resources/nls/et/bundle.ts': return import('./bundle-4975c8dd.js');
    case '../resources/nls/fi/bundle.ts': return import('./bundle-f200d8c8.js');
    case '../resources/nls/fr/bundle.ts': return import('./bundle-3eff3473.js');
    case '../resources/nls/fr-CA/bundle.ts': return import('./bundle-a709df2d.js');
    case '../resources/nls/he/bundle.ts': return import('./bundle-927505e8.js');
    case '../resources/nls/hr/bundle.ts': return import('./bundle-1cc00187.js');
    case '../resources/nls/hu/bundle.ts': return import('./bundle-cd927ec9.js');
    case '../resources/nls/is/bundle.ts': return import('./bundle-ea3c0b92.js');
    case '../resources/nls/it/bundle.ts': return import('./bundle-a81c869c.js');
    case '../resources/nls/ja/bundle.ts': return import('./bundle-03abd1e4.js');
    case '../resources/nls/ko/bundle.ts': return import('./bundle-9b66de92.js');
    case '../resources/nls/lt/bundle.ts': return import('./bundle-71aa8ac6.js');
    case '../resources/nls/lv/bundle.ts': return import('./bundle-a5d58b66.js');
    case '../resources/nls/ms/bundle.ts': return import('./bundle-787d3216.js');
    case '../resources/nls/nl/bundle.ts': return import('./bundle-19f97f21.js');
    case '../resources/nls/no/bundle.ts': return import('./bundle-1e1ca90c.js');
    case '../resources/nls/pl/bundle.ts': return import('./bundle-5983082e.js');
    case '../resources/nls/pt/bundle.ts': return import('./bundle-a168d8cb.js');
    case '../resources/nls/pt-PT/bundle.ts': return import('./bundle-aac6fd43.js');
    case '../resources/nls/ro/bundle.ts': return import('./bundle-0b74b6b8.js');
    case '../resources/nls/ru/bundle.ts': return import('./bundle-ba3f7c98.js');
    case '../resources/nls/sk/bundle.ts': return import('./bundle-bbc512f1.js');
    case '../resources/nls/sl/bundle.ts': return import('./bundle-be75e148.js');
    case '../resources/nls/sr/bundle.ts': return import('./bundle-a063a7bb.js');
    case '../resources/nls/sr-Latn/bundle.ts': return import('./bundle-a86c86bd.js');
    case '../resources/nls/sv/bundle.ts': return import('./bundle-24c0cf49.js');
    case '../resources/nls/th/bundle.ts': return import('./bundle-5058aaea.js');
    case '../resources/nls/tr/bundle.ts': return import('./bundle-8fcff935.js');
    case '../resources/nls/uk/bundle.ts': return import('./bundle-101cac5a.js');
    case '../resources/nls/vi/bundle.ts': return import('./bundle-4ea13155.js');
    case '../resources/nls/zh-Hans/bundle.ts': return import('./bundle-ad0bf842.js');
    case '../resources/nls/zh-Hant/bundle.ts': return import('./bundle-52019c11.js');
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
        return import('./bundle-74cf5763.js').then((module) => module.default);
    }
};

export { index as default };
/*  */
//# sourceMappingURL=translationBundle.js.map
