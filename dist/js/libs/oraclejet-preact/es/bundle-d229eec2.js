/* @oracle/oraclejet-preact: 13.1.0 */
const bundle = {
    close: () => 'Sule',
    error: () => 'Tõrge',
    warn: () => 'Hoiatus',
    info: () => 'teave',
    confirmation: () => 'Kinnitus',
    progressIndeterminate: () => 'Pooleli',
    inputPassword_show: () => 'Kuva parool',
    inputPassword_hide: () => 'Peida parool',
    inputPassword_hidden: () => 'Parool on peidetud',
    formControl_clear: () => 'Tühjenda',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Maksimumpikkus ' + p['MAX_LENGTH'] + ' on ületatud.',
    formControl_maxLengthRemaining: (p) => 'Järele on jäänud ' + p['CHARACTER_COUNT'] + ' märki.',
    select_noMatchesFound: () => 'Vasteid ei leitud',
    select_oneMatchFound: () => 'Leiti üks vaste',
    select_sizeMatchesFound: (p) => 'Leiti ' + p['TOTAL_SIZE'] + ' vastet',
    select_sizeOrMoreMatchesFound: (p) => 'Leiti ' + p['TOTAL_SIZE'] + ' või rohkem vastet',
    selectMultiple_showSelectedValues: () => 'Klõpsake valitud väärtuste loendi kuvamiseks.',
    selectMultiple_valuesSelected: (p) => 'Valitud on ' + p['VALUE_COUNT'] + ' väärtust.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Lisateave',
    userAssistance_required: () => 'Kohustuslik',
    selectMultiple_showFullList: () => 'Klõpsake väärtuste täieliku loendi kuvamiseks.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-d229eec2.js.map
