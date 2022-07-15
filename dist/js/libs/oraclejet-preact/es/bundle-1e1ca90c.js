/* @oracle/oraclejet-preact: 13.0.0 */
const bundle = {
    close: () => 'Lukk',
    error: () => 'Feil',
    warn: () => 'Advarsel',
    info: () => 'opplysninger',
    confirmation: () => 'Bekreftelse',
    progressIndeterminate: () => 'Pågår',
    inputPassword_show: () => 'Vis passord',
    inputPassword_hide: () => 'Skjul passord',
    inputPassword_hidden: () => 'Passord skjult',
    formControl_clear: () => 'Nullstill',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Maksimumslengden, ' + p['MAX_LENGTH'] + ', er overskredet.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' tegn igjen.',
    select_noMatchesFound: () => 'Ingen samsvar funnet',
    select_oneMatchFound: () => 'Finner ett treff',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' samsvar funnet',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' eller flere samsvar funnet',
    selectMultiple_showSelectedValues: () => 'Klikk hvis du vil vise listen over valgte verdier.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' verdier er valgt.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Jeg vil vite mer',
    userAssistance_required: () => 'Nødvendig',
    selectMultiple_showFullList: () => 'Klikk hvis du vil vise den fullstendige listen over verdier.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-1e1ca90c.js.map
