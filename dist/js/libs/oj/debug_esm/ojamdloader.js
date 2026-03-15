/**
 * @license
 * Copyright (c) 2014, 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
async function _readText(url) {
  if (typeof process !== 'undefined' && process.versions?.node && url.protocol === 'file:') {
    const { readFile } = await import('node:fs/promises');
    return readFile(url, 'utf8');
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }
  return response.text();
}

function _captureDefinedObject(source) {
  let captured;
  const define = (value) => {
    captured = value;
  };
  new Function('define', source)(define);
  if (captured === undefined) {
    throw new Error('AMD bundle did not call define with an object payload');
  }
  return captured;
}

function _isMissingResourceError(error) {
  return error?.code === 'ENOENT' || /Failed to load .*: 404/.test(error?.message || '');
}

export async function loadAmdObject(url) {
  const source = await _readText(url);
  return _captureDefinedObject(source);
}

export async function loadMergedAmdBundle(rootUrl, overlayUrl) {
  const rootObject = await loadAmdObject(rootUrl);
  const rootBundle = rootObject.root ?? rootObject;

  if (!overlayUrl) {
    return { ...rootBundle };
  }

  try {
    const overlayObject = await loadAmdObject(overlayUrl);
    return { ...rootBundle, ...overlayObject };
  } catch (error) {
    if (_isMissingResourceError(error)) {
      return { ...rootBundle };
    }
    throw error;
  }
}
