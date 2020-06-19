/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import AsyncValidator = require('../ojvalidator-async');
import Validator = require('../ojvalidator');
import RequiredValidator = require('../ojvalidator-required');
import RegExpValidator = require('../ojvalidator-regexp');
import LengthValidator = require('../ojvalidator-length');
import Converter = require('../ojconverter');
import ColorConverter = require('../ojconverter-color');
export interface ColorConverterFactory {
    createConverter(options?: ColorConverter.ConverterOptions): ColorConverter;
}
export class ConverterFactory<V, O> {
    static CONVERTER_TYPE_COLOR: string;
    static CONVERTER_TYPE_DATETIME: string;
    static CONVERTER_TYPE_NUMBER: string;
    createConverter(options?: O): Converter<V> | Promise<Converter<V>>;
}
export interface LengthValidatorFactory {
    createValidator(options?: LengthValidator.ValidatorOptions): LengthValidator;
}
export interface RegExpValidatorFactory {
    createValidator(options: RegExpValidator.ValidatorOptions): RegExpValidator;
}
export interface RequiredValidatorFactory {
    createValidator(options?: RequiredValidator.ValidatorOptions): RequiredValidator;
}
export namespace Validation {
    function converterFactory<CF extends ConverterFactory<any, any>>(type: 'number' | 'color' | 'datetime' | string, instance?: CF): CF | null;
    function validatorFactory<VF extends ValidatorFactory<any, any>>(type: 'required' | 'regexp' | 'numberRange' | 'length' | 'dateTimeRange' | 'dateRestriction' | string, instance?: VF): VF | null;
    // tslint:disable-next-line interface-over-type-literal
    type RegisteredConverter = {
        type: string;
        options?: object;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RegisteredValidator = {
        type: string;
        options?: object;
    };
}
export class ValidatorFactory<V, O> {
    static VALIDATOR_TYPE_DATERESTRICTION: string;
    static VALIDATOR_TYPE_DATETIMERANGE: string;
    static VALIDATOR_TYPE_LENGTH: string;
    static VALIDATOR_TYPE_NUMBERRANGE: string;
    static VALIDATOR_TYPE_REGEXP: string;
    static VALIDATOR_TYPE_REQUIRED: string;
    createValidator(options: object | null): Validator<V> | AsyncValidator<V>;
}
