/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import CspExpressionEvaluator = require('../ojcspexpressionevaluator');
export function getAutomationMode(): string;
export function getDeviceRenderMode(): 'phone' | 'tablet' | 'others';
export function getDeviceType(): 'phone' | 'tablet' | 'others';
export function getLocale(): string;
export function getResourceUrl(relativePath: string): string;
export function getVersionInfo(): string;
export function logVersionInfo(): undefined;
export function setAutomationMode(mode: string): undefined;
export function setExpressionEvaluator(expressionEvaluator: CspExpressionEvaluator): undefined;
export function setLocale(locale: string, callback?: (() => void)): undefined;
export function setResourceBaseUrl(baseUrl: string): undefined;
