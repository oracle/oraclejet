/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

const bundle = {
    close: () => 'Zatvori',
    error: () => 'Pogreška',
    warn: () => 'Upozorenje',
    info: () => 'informacije',
    confirmation: () => 'Potvrda',
    progressIndeterminate: () => 'U tijeku',
    inputPassword_show: () => 'Prikaži lozinku',
    inputPassword_hide: () => 'Sakrij lozinku',
    inputPassword_hidden: () => 'Lozinka skrivena',
    formControl_clear: () => 'Očisti',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Prekoračena je maksimalna duljina ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => 'Preostali broj znakova: ' + p['CHARACTER_COUNT'] + '.',
    select_noMatchesFound: () => 'Nije pronađen nijedan rezultat',
    select_oneMatchFound: () => 'Pronađen jedan rezultat',
    select_sizeMatchesFound: (p) => 'Pronađen sljedeći broj odgovarajućih rezultata: ' + p['TOTAL_SIZE'],
    select_sizeOrMoreMatchesFound: (p) => 'Pronađen sljedeći broj ili više odgovarajućih rezultata: ' + p['TOTAL_SIZE'],
    selectMultiple_showSelectedValues: () => 'Pritisnite za prikaz popisa odabranih vrijednosti.',
    selectMultiple_valuesSelected: (p) => 'Odabran sljedeći broj vrijednosti: ' + p['VALUE_COUNT'] + '.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Saznajte više',
    userAssistance_required: () => 'Obavezno',
    selectMultiple_showFullList: () => 'Pritisnite za prikaz potpunog popisa vrijednosti.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-5b6992f2.js.map
