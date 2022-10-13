/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

const bundle = {
    close: () => 'Close',
    error: () => 'Error',
    warn: () => 'Warning',
    info: () => 'Info',
    confirmation: () => 'Confirmation',
    progressIndeterminate: () => 'In Progress',
    inputPassword_show: () => 'Show Password',
    inputPassword_hide: () => 'Hide Password',
    inputPassword_hidden: () => 'Password Hidden',
    formControl_clear: () => 'Clear',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Maximum length ' + p['MAX_LENGTH'] + ' exceeded.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' characters left.',
    select_noMatchesFound: () => 'No matches found',
    select_oneMatchFound: () => 'One match found',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' matches found',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' or more matches found',
    selectMultiple_showSelectedValues: () => 'Show selected values only.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' values selected.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Learn more',
    userAssistance_required: () => 'Required'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-624adc7c.js.map
