/* @oracle/oraclejet-preact: 13.0.0 */
const bundle = {
    close: () => 'Loka',
    error: () => 'Villa',
    warn: () => 'Viðvörun',
    info: () => 'uppl.',
    confirmation: () => 'Staðfesting',
    progressIndeterminate: () => 'Í vinnslu',
    inputPassword_show: () => 'Sýna aðgangsorð',
    inputPassword_hide: () => 'Fela aðgangsorð',
    inputPassword_hidden: () => 'Aðgangsorð falið',
    formControl_clear: () => 'Hreinsa',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Farið framyfir ' + p['MAX_LENGTH'] + ' hámarkslengd.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' tákn eftir.',
    select_noMatchesFound: () => 'Ekkert samsvarandi fannst',
    select_oneMatchFound: () => 'Ein samsvörun fannst',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' samsvaranir fundust',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' eða fleiri samsvaranir fundust',
    selectMultiple_showSelectedValues: () => 'Smellið til að sýna lista valinna gilda.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' gildi valin.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Nánar',
    userAssistance_required: () => 'Áskilið',
    selectMultiple_showFullList: () => 'Smellið til að sýna heildarlista gilda.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-ea3c0b92.js.map
