/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export function createGenericExpressionEvaluator(expressionText: string): (context: any) => any;
export function getExpressionInfo(expression: string): {
    expr: (null | string);
    downstreamOnly: boolean;
};
