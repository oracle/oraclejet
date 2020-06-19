/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export function getDayNames(type?: 'abbreviated' | 'narrow' | 'wide'): string[];
export function getFirstDayOfWeek(): number;
export function getMonthNames(type?: 'abbreviated' | 'narrow' | 'wide'): string[];
export function getWeekendEnd(): number;
export function getWeekendStart(): number;
export function isMonthPriorToYear(): boolean;
export function setBundle(bundle: object): void;
