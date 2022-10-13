/* @oracle/oraclejet-preact: 13.1.0 */
const bundle = {
    close: () => 'Stäng',
    error: () => 'Fel',
    warn: () => 'Varning',
    info: () => 'information',
    confirmation: () => 'Bekräftelse',
    progressIndeterminate: () => 'Pågår',
    inputPassword_show: () => 'Visa lösenord',
    inputPassword_hide: () => 'Dölj lösenord',
    inputPassword_hidden: () => 'Lösenord dolt',
    formControl_clear: () => 'Rensa',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Maxlängden ' + p['MAX_LENGTH'] + ' har överskridits.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' tecken kvar.',
    select_noMatchesFound: () => 'Inga matchningar hittades',
    select_oneMatchFound: () => 'En matchning har hittats',
    select_sizeMatchesFound: (p) => 'Hittade ' + p['TOTAL_SIZE'] + ' matchningar',
    select_sizeOrMoreMatchesFound: (p) => 'Hittade ' + p['TOTAL_SIZE'] + ' eller fler matchningar',
    selectMultiple_showSelectedValues: () => 'Klicka för att visa listan över valda värden.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' värden valda.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Lär dig mer',
    userAssistance_required: () => 'Obligatorisk',
    selectMultiple_showFullList: () => 'Klicka för att visa hela värdelistan.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-5953dd7e.js.map
