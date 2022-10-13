/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

const bundle = {
    close: () => 'Zatvori',
    error: () => 'Greška',
    warn: () => 'Upozorenje',
    info: () => 'Informacije',
    confirmation: () => 'Potvrda',
    progressIndeterminate: () => 'U toku',
    inputPassword_show: () => 'Prikaži lozinku',
    inputPassword_hide: () => 'Sakrij lozinku',
    inputPassword_hidden: () => 'Lozinka je skrivena',
    formControl_clear: () => 'Očisti',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Prekoračena je maksimalna dužina od ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => 'Preostalo znakova: ' + p['CHARACTER_COUNT'] + '.',
    select_noMatchesFound: () => 'Nije pronađeno nijedno podudaranje',
    select_oneMatchFound: () => 'Pronađeno je jedno podudaranje',
    select_sizeMatchesFound: (p) => 'Pronađeno podudaranja: ' + p['TOTAL_SIZE'],
    select_sizeOrMoreMatchesFound: (p) => 'Pronađeno podudaranja: najmanje ' + p['TOTAL_SIZE'],
    selectMultiple_showSelectedValues: () => 'Klikni za prikaz spiska izabranih vrijednosti.',
    selectMultiple_valuesSelected: (p) => 'Izabrano vrijednosti: ' + p['VALUE_COUNT'] + '.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Saznaj više',
    userAssistance_required: () => 'Obavezno',
    selectMultiple_showFullList: () => 'Klikni za prikaz potpunog spiska vrijednosti.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-95fc821c.js.map
