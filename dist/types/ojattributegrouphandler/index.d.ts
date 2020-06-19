/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export class AttributeGroupHandler {
    constructor(matchRules?: {
        [propName: string]: any;
    });
    addMatchRule(category: string, attributeValue: any): void;
    getCategoryAssignments(): Array<{
        [propName: string]: any;
    }>;
    getValue(category: string): any;
    getValueRamp(): any[];
}
export class ColorAttributeGroupHandler extends AttributeGroupHandler {
    constructor(matchRules?: {
        [propName: string]: any;
    });
    getValueRamp(): string[];
}
export class ShapeAttributeGroupHandler extends AttributeGroupHandler {
    constructor(matchRules?: {
        [propName: string]: any;
    });
    getValueRamp(): string[];
}
