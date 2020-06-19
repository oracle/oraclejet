/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { ojTimeAxis } from '../ojtimeaxis';
import Converter = require('../ojconverter');
export function computeTableColumnHeaderHeight(table: Element, gantt: Element, axisInfo: {
    majorAxis?: {
        converter?: ojTimeAxis.Converters | Converter<string>;
        height?: number;
        scale?: string;
        zoomOrder?: string[];
    };
    minorAxis: {
        converter?: ojTimeAxis.Converters | Converter<string>;
        height?: number;
        scale?: string;
        zoomOrder?: string[];
    };
}): number;
