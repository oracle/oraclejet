/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import Converter = require('../ojconverter');
import Color = require('../ojcolor');
declare class ColorConverter implements Converter<Color> {
    constructor(options?: ColorConverter.ConverterOptions);
    format(color: Color): string | null;
    getHint(): string;
    getOptions(): ColorConverter.ConverterOptions;
    parse(value: string): Color;
    resolvedOptions(): ColorConverter.ConverterOptions;
}
declare namespace ColorConverter {
    // tslint:disable-next-line interface-over-type-literal
    type ConverterOptions = {
        format?: 'rgb' | 'hsl' | 'hsv' | 'hex' | 'hex3';
    };
}
export = ColorConverter;
