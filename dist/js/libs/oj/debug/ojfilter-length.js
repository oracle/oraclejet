/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(function () { 'use strict';

    class LengthFilter {
        constructor(options) {
            this.options = options;
            if (!options.max) {
                throw new Error("length filter's max option cannot be less than 1. max option is " + options.max);
            }
            if (isNaN(options.max)) {
                throw new Error("length filter's max option is not a number. max option is " + options.max);
            }
            if (options.max !== null && options.max < 1) {
                throw new Error("length filter's max option cannot be less than 1. max option is " + options.max);
            }
            options.countBy = options.countBy === undefined ? 'codePoint' : options.countBy;
        }
        filter(currentRawValue, proposedRawValue) {
            const proposedValueLength = this.calcLength(proposedRawValue);
            return proposedValueLength <= this.options.max
                ? proposedRawValue
                : currentRawValue.slice(0, this.options.max);
        }
        calcLength(text) {
            const countBy = this.options.countBy;
            if (text == '' || text == null || text == undefined) {
                return 0;
            }
            const codeUnitLength = text.length;
            let length;
            let surrogateLength = 0;
            switch (countBy) {
                case 'codePoint':
                    for (let i = 0; i < codeUnitLength; i++) {
                        if ((text.charCodeAt(i) & 0xf800) === 0xd800) {
                            surrogateLength += 1;
                        }
                    }
                    length = codeUnitLength - surrogateLength / 2;
                    break;
                case 'codeUnit':
                default:
                    length = codeUnitLength;
            }
            return length;
        }
    }

    return LengthFilter;

});
