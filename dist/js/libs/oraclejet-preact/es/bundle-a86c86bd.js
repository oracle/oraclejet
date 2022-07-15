/* @oracle/oraclejet-preact: 13.0.0 */
const bundle = {
    close: () => 'Zatvori',
    error: () => 'Greška',
    warn: () => 'Upozorenje',
    info: () => 'informacije',
    confirmation: () => 'Potvrda',
    progressIndeterminate: () => 'U toku',
    inputPassword_show: () => 'Prikaži lozinku',
    inputPassword_hide: () => 'Sakrij lozinku',
    inputPassword_hidden: () => 'Lozinka je skrivena',
    formControl_clear: () => 'Obriši',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Maksimalna dužina od ' + p['MAX_LENGTH'] + ' je premašena.',
    formControl_maxLengthRemaining: (p) => 'Preostali broj znakova je ' + p['CHARACTER_COUNT'] + '.',
    select_noMatchesFound: () => 'Nije pronađen nijedan pogodak',
    select_oneMatchFound: () => 'Pronađen je jedan rezultat',
    select_sizeMatchesFound: (p) => 'Pronađenih podudaranja: ' + p['TOTAL_SIZE'],
    select_sizeOrMoreMatchesFound: (p) => 'Pronađenih podudaranja: ' + p['TOTAL_SIZE'] + ' ili više',
    selectMultiple_showSelectedValues: () => 'Kliknite da bi se prikazala lista izabranih vrednosti.',
    selectMultiple_valuesSelected: (p) => 'Izabranih vrednosti: ' + p['VALUE_COUNT'] + ' .',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Saznajte više',
    userAssistance_required: () => 'Obavezno',
    selectMultiple_showFullList: () => 'Kliknite da bi se prikazala kompletna lista vrednosti.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-a86c86bd.js.map
