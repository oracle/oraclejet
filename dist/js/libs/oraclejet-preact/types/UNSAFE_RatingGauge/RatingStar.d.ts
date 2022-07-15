/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
declare type Props = {
    isSelected: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
};
declare const RatingStar: ({ isSelected, isDisabled, isReadOnly }: Props) => import("preact").JSX.Element;
export { RatingStar };
