declare const bundle: {
    close: () => string;
    error: () => string;
    warn: () => string;
    info: () => string;
    confirmation: () => string;
    progressIndeterminate: () => string;
    inputPassword_show: () => string;
    inputPassword_hide: () => string;
    inputPassword_hidden: () => string;
    formControl_clear: () => string;
    formControl_loading: () => string;
    formControl_maxLengthExceeded: (p: {
        MAX_LENGTH: string;
    }) => string;
    formControl_maxLengthRemaining: (p: {
        CHARACTER_COUNT: string;
    }) => string;
    select_noMatchesFound: () => string;
    select_oneMatchFound: () => string;
    select_sizeMatchesFound: (p: {
        TOTAL_SIZE: string;
    }) => string;
    select_sizeOrMoreMatchesFound: (p: {
        TOTAL_SIZE: string;
    }) => string;
    selectMultiple_showSelectedValues: () => string;
    selectMultiple_valuesSelected: (p: {
        VALUE_COUNT: string;
    }) => string;
    selectMultiple_countPlus: (p: {
        COUNT: string;
    }) => string;
    selector_selected: () => string;
    selector_unselected: () => string;
    userAssistance_learnMore: () => string;
    userAssistance_required: () => string;
};
export default bundle;
