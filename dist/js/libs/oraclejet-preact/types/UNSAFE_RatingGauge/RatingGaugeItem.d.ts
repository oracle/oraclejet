/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
declare type Props = {
    fillRatio: number;
    isDisabled?: boolean;
    isReadonly?: boolean;
};
declare const RatingGaugeItem: ({ fillRatio, isDisabled, isReadonly }: Props) => import("preact").JSX.Element;
export { RatingGaugeItem };
