const runSetLocale = async (config, locale) =>
  new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      process.removeListener('unhandledRejection', onFailure);
      process.removeListener('uncaughtException', onFailure);
    };
    const onFailure = (err) => {
      cleanup();
      reject(err instanceof Error ? err : new Error(String(err)));
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`timeout waiting for ${locale} locale`));
    }, 2000);

    process.once('unhandledRejection', onFailure);
    process.once('uncaughtException', onFailure);

    try {
      config.setLocale(locale, () => {
        const resolvedLocale = config.getLocale();
        cleanup();
        resolve(resolvedLocale);
      });
    } catch (err) {
      onFailure(err);
    }
  });

const checks = [
  {
    name: 'ojlogger',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojlogger');
      if (typeof mod.error !== 'function' || typeof mod.warn !== 'function') {
        throw new Error('logger exports missing');
      }
    }
  },
  {
    name: 'ojeventtarget',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojeventtarget');
      class Demo {}
      mod.EventTargetMixin.applyMixin(Demo);
      const demo = new Demo();
      let seen = false;
      demo.addEventListener('ping', () => {
        seen = true;
      });
      demo.dispatchEvent(new mod.GenericEvent('ping'));
      if (!seen) {
        throw new Error('event dispatch failed');
      }
    }
  },
  {
    name: 'ojkeyset',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojkeyset');
      const keySet = new mod.KeySetImpl(['alpha']);
      if (!keySet.has('alpha')) {
        throw new Error('keyset behavior failed');
      }
    }
  },
  {
    name: 'ojconverter-nativenumber',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojconverter-nativenumber');
      const converter = new mod.NumberConverter();
      const formatted = converter.format(5);
      if (typeof formatted !== 'string' || formatted.length === 0) {
        throw new Error(`unexpected converter output: ${formatted}`);
      }
    }
  },
  {
    name: 'ojarraydataprovider',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojarraydataprovider');
      const provider = new mod.default([{ id: 1, label: 'A' }], { keyAttributes: 'id' });
      if (provider.isEmpty() !== 'no') {
        throw new Error(`unexpected provider empty state: ${provider.isEmpty()}`);
      }
    }
  },
  {
    name: 'ojconfig-setLocale-fr',
    run: async () => {
      const config = await import('@oracle/oraclejet/ojconfig');
      const locale = await runSetLocale(config, 'fr');
      if (locale !== 'fr') {
        throw new Error(`unexpected locale after fr switch: ${locale}`);
      }
    }
  },
  {
    name: 'ojconfig-setLocale-de',
    run: async () => {
      const config = await import('@oracle/oraclejet/ojconfig');
      const locale = await runSetLocale(config, 'de');
      if (locale !== 'de') {
        throw new Error(`unexpected locale after de switch: ${locale}`);
      }
    }
  }
];

let passed = 0;
for (const check of checks) {
  try {
    await check.run();
    passed += 1;
    console.log(`PASS ${check.name}`);
  } catch (err) {
    console.log(`FAIL ${check.name} ${(err && err.code) || 'NO_CODE'} ${(err && err.message) || err}`);
  }
}

console.log(`METRIC esm_package_entrypoints_passed=${passed}`);
