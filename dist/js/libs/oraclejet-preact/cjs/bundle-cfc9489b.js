/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

const bundle = {
    close: () => 'Zapri',
    error: () => 'Napaka',
    warn: () => 'Opozorilo',
    info: () => 'informacije',
    confirmation: () => 'Potrditev',
    progressIndeterminate: () => 'V teku',
    inputPassword_show: () => 'Prikaži geslo',
    inputPassword_hide: () => 'Skrij geslo',
    inputPassword_hidden: () => 'Geslo je skrito',
    formControl_clear: () => 'Počisti',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Maksimalna dolžina, ki je ' + p['MAX_LENGTH'] + ', je presežena.',
    formControl_maxLengthRemaining: (p) => 'Preostali znaki: ' + p['CHARACTER_COUNT'] + '.',
    select_noMatchesFound: () => 'Ni ustreznih zadetkov',
    select_oneMatchFound: () => 'Najden je en zadetek',
    select_sizeMatchesFound: (p) => 'Najdeni zadetki: ' + p['TOTAL_SIZE'],
    select_sizeOrMoreMatchesFound: (p) => 'Najdeni zadetki: ' + p['TOTAL_SIZE'] + ' ali več',
    selectMultiple_showSelectedValues: () => 'Kliknite za prikaz seznama izbranih vrednosti.',
    selectMultiple_valuesSelected: (p) => 'Izbrane vrednosti: ' + p['VALUE_COUNT'] + '.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Več o tem',
    userAssistance_required: () => 'Zahtevano',
    selectMultiple_showFullList: () => 'Kliknite za prikaz celotnega seznama vrednosti.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-cfc9489b.js.map
