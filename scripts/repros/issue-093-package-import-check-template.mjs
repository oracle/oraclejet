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
      const localeData = await import('@oracle/oraclejet/ojlocaledata');
      const locale = await runSetLocale(config, 'fr');
      if (locale !== 'fr') {
        throw new Error(`unexpected locale after fr switch: ${locale}`);
      }
      const firstDay = localeData.getFirstDayOfWeek();
      if (typeof firstDay !== 'number') {
        throw new Error(`unexpected first day after fr switch: ${firstDay}`);
      }
    }
  },
  {
    name: 'ojconfig-setLocale-de',
    run: async () => {
      const config = await import('@oracle/oraclejet/ojconfig');
      const localeData = await import('@oracle/oraclejet/ojlocaledata');
      const locale = await runSetLocale(config, 'de');
      if (locale !== 'de') {
        throw new Error(`unexpected locale after de switch: ${locale}`);
      }
      const firstDay = localeData.getFirstDayOfWeek();
      if (typeof firstDay !== 'number') {
        throw new Error(`unexpected first day after de switch: ${firstDay}`);
      }
    }
  },
  {
    name: 'ojtranslation',
    run: async () => {
      const translation = await import('@oracle/oraclejet/ojtranslation');
      const value = translation.getTranslatedString('oj-validator.required.summary');
      if (typeof value !== 'string' || value.length === 0) {
        throw new Error(`unexpected translation output: ${value}`);
      }
    }
  },
  {
    name: 'ojconverter-localdate',
    run: async () => {
      const { LocalDateConverter } = await import('@oracle/oraclejet/ojconverter-localdate');
      const converter = new LocalDateConverter();
      const formatted = converter.format('2024-01-02');
      const parsed = converter.parse(formatted);
      if (parsed !== '2024-01-02') {
        throw new Error(`unexpected parsed date: ${parsed}`);
      }
    }
  },
  {
    name: 'ojvalidator-length',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojvalidator-length');
      const validator = new mod.default({ min: 2, max: 4 });
      validator.validate('abcd');
    }
  },
  {
    name: 'ojasyncvalidator-length',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojasyncvalidator-length');
      const validator = new mod.default({ min: 2, max: 4 });
      await validator.validate('abcd');
    }
  },
  {
    name: 'ojurlpathadapter',
    run: async () => {
      globalThis.document ||= { location: { pathname: '/', search: '' } };
      const mod = await import('@oracle/oraclejet/ojurlpathadapter');
      const adapter = new mod.default('/');
      const url = adapter.getUrlForRoutes([{ path: 'alpha', params: { q: 1 } }]);
      if (typeof url !== 'string' || !url.includes('alpha')) {
        throw new Error(`unexpected url output: ${url}`);
      }
    }
  },
  {
    name: 'ojarraytreedataprovider',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojarraytreedataprovider');
      const provider = new mod.default([{ id: 'root', title: 'Root', children: [{ id: 'child', title: 'Child' }] }], {
        keyAttributes: 'id',
        childrenAttribute: 'children'
      });
      const child = provider.getChildDataProvider('root');
      if (!child) {
        throw new Error('missing child data provider');
      }
    }
  },
  {
    name: 'ojlocaledata',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojlocaledata');
      const firstDay = mod.getFirstDayOfWeek();
      if (typeof firstDay !== 'number') {
        throw new Error(`unexpected first day: ${firstDay}`);
      }
    }
  },
  {
    name: 'ojtimeutils',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojtimeutils');
      const refs = mod.getWeekendReferenceObjects('2024-01-01T00:00:00.000Z', '2024-01-31T00:00:00.000Z');
      if (!Array.isArray(refs)) {
        throw new Error('weekend refs not array');
      }
    }
  },
  {
    name: 'ojtimezoneutils',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojtimezoneutils');
      const zones = mod.getAvailableTimeZones();
      if (!Array.isArray(zones) || zones.length === 0) {
        throw new Error('no time zones returned');
      }
    }
  },
  {
    name: 'ojconverter-number',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojconverter-number');
      const converter = new mod.IntlNumberConverter();
      const formatted = converter.format(1234.5);
      if (typeof formatted !== 'string' || formatted.length === 0) {
        throw new Error(`unexpected converter-number output: ${formatted}`);
      }
    }
  },
  {
    name: 'ojconverter-datetime',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojconverter-datetime');
      const converter = new mod.IntlDateTimeConverter();
      const formatted = converter.format('2024-01-02T00:00:00');
      if (typeof formatted !== 'string' || formatted.length === 0) {
        throw new Error(`unexpected converter-datetime output: ${formatted}`);
      }
    }
  },
  {
    name: 'ojvalidator-daterestriction',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojvalidator-daterestriction');
      const validator = new mod.default({ dayFormatter: () => ({ disabled: false }) });
      validator.validate('2024-01-02');
    }
  },
  {
    name: 'ojvalidator-datetimerange',
    run: async () => {
      const mod = await import('@oracle/oraclejet/ojvalidator-datetimerange');
      const validator = new mod.default({ min: '2024-01-01T00:00:00', max: '2024-12-31T23:59:59' });
      validator.validate('2024-06-01T12:00:00');
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
