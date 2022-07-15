/* @oracle/oraclejet-preact: 13.0.0 */
const bundle = {
    close: () => 'Bezárás',
    error: () => 'Hiba',
    warn: () => 'Figyelmeztetés',
    info: () => 'információ',
    confirmation: () => 'Megerősítés',
    progressIndeterminate: () => 'Folyamatban',
    inputPassword_show: () => 'Jelszó megjelenítése',
    inputPassword_hide: () => 'Jelszó elrejtése',
    inputPassword_hidden: () => 'Jelszó elrejtve',
    formControl_clear: () => 'Törlés',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Túllépte a maximális hosszt: ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' karakter maradt.',
    select_noMatchesFound: () => 'Nincs találat',
    select_oneMatchFound: () => 'Egy egyezés található',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' egyezés található',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' vagy több egyezés található',
    selectMultiple_showSelectedValues: () => 'Kattintson a kijelölt értékek listájának megjelenítéséhez.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' kiválasztott érték.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'További tudnivalók',
    userAssistance_required: () => 'Kötelező',
    selectMultiple_showFullList: () => 'Kattintson a teljes értéklista megjelenítéséhez.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-cd927ec9.js.map
