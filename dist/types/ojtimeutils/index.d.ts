/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { ojGantt } from '../ojgantt';
export function getDate(pos: number, rangeStartTime: Date | string | number, rangeEndTime: Date | string | number, rangeWidth: number): number;
export function getLength(startTime: Date | string | number, endTime: Date | string | number, rangeStartTime: Date | string | number, rangeEndTime: Date | string | number, rangeWidth: number): number;
export function getPosition(time: Date | string | number, rangeStartTime: Date | string | number, rangeEndTime: Date | string | number, rangeWidth: number): number;
export function getWeekendReferenceObjects(start: string, end: string): ojGantt.ReferenceObject[];
