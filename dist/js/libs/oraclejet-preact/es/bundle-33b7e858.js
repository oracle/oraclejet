/* @oracle/oraclejet-preact: 13.1.0 */
const bundle = {
    close: () => 'Sulje',
    error: () => 'Virhe',
    warn: () => 'Varoitus',
    info: () => 'tiedot',
    confirmation: () => 'Confirmation',
    progressIndeterminate: () => 'Käynnissä',
    inputPassword_show: () => 'Näytä salasana',
    inputPassword_hide: () => 'Piilota salasana',
    inputPassword_hidden: () => 'Salasana piilotettu',
    formControl_clear: () => 'Tyhjennä',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Enimmäispituus ' + p['MAX_LENGTH'] + ' ylitetty.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' merkkiä jäljellä.',
    select_noMatchesFound: () => 'Vastineita ei löydy',
    select_oneMatchFound: () => 'Yksi vastaavuus löydettiin',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' osumaa',
    select_sizeOrMoreMatchesFound: (p) => 'Vähintään ' + p['TOTAL_SIZE'] + ' osumaa',
    selectMultiple_showSelectedValues: () => 'Näytä valittujen arvojen luettelo napsauttamalla.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' arvoa valittu.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Lisätietoja',
    userAssistance_required: () => 'Pakollinen',
    selectMultiple_showFullList: () => 'Näytä koko arvoluettelo napsauttamalla.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-33b7e858.js.map
