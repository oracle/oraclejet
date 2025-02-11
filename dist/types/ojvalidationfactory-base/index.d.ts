/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
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
/** @deprecated since 8.0.0 - Directly create new instances of {@link ColorConverter} instead. */
export interface ColorConverterFactory {
    createConverter(options?: ColorConverter.ConverterOptions): ColorConverter;
}
/** @deprecated since 8.0.0 - Use string literals instead of the member constants. */
export class ConverterFactory<V, O> {
    /** @deprecated since 8.0.0 - Use the string literal instead. */
    static CONVERTER_TYPE_COLOR: string;
    /** @deprecated since 8.0.0 - Use the string literal instead. */
    static CONVERTER_TYPE_DATETIME: string;
    /** @deprecated since 8.0.0 - Use the string literal instead. */
    static CONVERTER_TYPE_NUMBER: string;
    createConverter(options?: O): Converter<V> | Promise<Converter<V>>;
}
/** @deprecated since 17.0.0 - Directly create new instances of {@link LengthValidator} instead. */
export interface LengthValidatorFactory {
    createValidator(options?: LengthValidator.ValidatorOptions): LengthValidator;
}
/** @deprecated since 17.0.0 - Directly create new instances of {@link RegExpValidator} instead. */
export interface RegExpValidatorFactory {
    createValidator(options: RegExpValidator.ValidatorOptions): RegExpValidator;
}
/** @deprecated since 17.0.0 - Directly create new instances of {@link RequiredValidator} instead. */
export interface RequiredValidatorFactory {
    createValidator(options?: RequiredValidator.ValidatorOptions): RequiredValidator;
}
export namespace Validation {
    function converterFactory<CF extends ConverterFactory<any, any>>(type: 'number' | 'color' | 'datetime' | string, instance?: CF): CF | null;
    function validatorFactory<VF extends ValidatorFactory<any, any>>(type: 'required' | 'regexp' | 'numberRange' | 'length' | 'dateTimeRange' | 'dateRestriction' | string, instance?: VF): VF | null;
    // tslint:disable-next-line interface-over-type-literal
    type RegisteredConverter = {
        options?: object;
        type: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RegisteredValidator = {
        options?: object;
        type: string;
    };
}
/** @deprecated since 8.0.0 - Use string literals instead of the member constants. */
export class ValidatorFactory<V, O> {
    /** @deprecated since 8.0.0 - Use the string literal instead. */
    static VALIDATOR_TYPE_DATERESTRICTION: string;
    /** @deprecated since 8.0.0 - Use the string literal instead. */
    static VALIDATOR_TYPE_DATETIMERANGE: string;
    /** @deprecated since 8.0.0 - Use the string literal instead. */
    static VALIDATOR_TYPE_LENGTH: string;
    /** @deprecated since 8.0.0 - Use the string literal instead. */
    static VALIDATOR_TYPE_NUMBERRANGE: string;
    /** @deprecated since 8.0.0 - Use the string literal instead. */
    static VALIDATOR_TYPE_REGEXP: string;
    /** @deprecated since 8.0.0 - Use the string literal instead. */
    static VALIDATOR_TYPE_REQUIRED: string;
    createValidator(options: object | null): Validator<V> | AsyncValidator<V>;
}
