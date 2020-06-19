/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { Validation } from '../ojvalidationfactory-base';
import Converter = require('../ojconverter');
export namespace IntlConverterUtils {
    function dateToLocalIso(date: Date): string;
    function getConverterInstance<T>(converterOption: string | Validation.RegisteredConverter | Converter<T>): Converter<T> | null;
    function getInitials(firstName?: string, lastName?: string): string | undefined;
    function getLocalTimeZoneOffset(): string;
    function isoToDate(isoString: string): Date;
    function isoToLocalDate(isoString: string): Date;
}
