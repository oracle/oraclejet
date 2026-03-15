#!/usr/bin/env node
const checks = [
  {
    name: 'ojlogger',
    run: async () => {
      const mod = await import(new URL('../../dist/js/libs/oj/debug_esm/ojlogger.js', import.meta.url));
      if (typeof mod.error !== 'function' || typeof mod.warn !== 'function') {
        throw new Error('logger exports missing');
      }
    }
  },
  {
    name: 'ojeventtarget',
    run: async () => {
      const mod = await import(new URL('../../dist/js/libs/oj/debug_esm/ojeventtarget.js', import.meta.url));
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
      const mod = await import(new URL('../../dist/js/libs/oj/debug_esm/ojkeyset.js', import.meta.url));
      const keySet = new mod.KeySetImpl(['alpha']);
      if (!keySet.has('alpha')) {
        throw new Error('keyset behavior failed');
      }
    }
  },
  {
    name: 'ojconverter-nativenumber',
    run: async () => {
      const mod = await import(new URL('../../dist/js/libs/oj/debug_esm/ojconverter-nativenumber.js', import.meta.url));
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
      const mod = await import(new URL('../../dist/js/libs/oj/debug_esm/ojarraydataprovider.js', import.meta.url));
      const provider = new mod.default([{ id: 1, label: 'A' }], { keyAttributes: 'id' });
      if (provider.isEmpty() !== 'no') {
        throw new Error(`unexpected provider empty state: ${provider.isEmpty()}`);
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

console.log(`METRIC esm_modules_passed=${passed}`);
