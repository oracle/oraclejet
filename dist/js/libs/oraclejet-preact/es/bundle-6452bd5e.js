/* @oracle/oraclejet-preact: 13.1.0 */
const bundle = {
    close: () => 'Zavrieť',
    error: () => 'Chyba',
    warn: () => 'Upozornenie',
    info: () => 'informácie',
    confirmation: () => 'Potvrdenie',
    progressIndeterminate: () => 'Prebieha',
    inputPassword_show: () => 'Zobraziť heslo',
    inputPassword_hide: () => 'Skryť heslo',
    inputPassword_hidden: () => 'Skryté heslo',
    formControl_clear: () => 'Vymazať',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Maximálna dĺžka ' + p['MAX_LENGTH'] + ' bola prekročená.',
    formControl_maxLengthRemaining: (p) => 'Počet zostávajúcich znakov: ' + p['CHARACTER_COUNT'] + '.',
    select_noMatchesFound: () => 'Nenašli sa žiadne zhody',
    select_oneMatchFound: () => 'Našla sa jedna zodpovedajúca hodnota',
    select_sizeMatchesFound: (p) => 'Nájdené zhody: ' + p['TOTAL_SIZE'],
    select_sizeOrMoreMatchesFound: (p) => 'Nájdené zhody: ' + p['TOTAL_SIZE'] + ' alebo viac',
    selectMultiple_showSelectedValues: () => 'Kliknutím zobrazíte zoznam vybraných hodnôt.',
    selectMultiple_valuesSelected: (p) => 'Počet vybraných hodnôt: ' + p['VALUE_COUNT'] + '.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Ďalšie informácie',
    userAssistance_required: () => 'Povinné',
    selectMultiple_showFullList: () => 'Kliknutím zobrazíte úplný zoznam hodnôt.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-6452bd5e.js.map
