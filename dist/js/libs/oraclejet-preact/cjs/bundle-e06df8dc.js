/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

const bundle = {
    close: () => 'Închidere',
    error: () => 'Eroare',
    warn: () => 'Avertisment',
    info: () => 'informaţii',
    confirmation: () => 'Confirmare',
    progressIndeterminate: () => 'În curs',
    inputPassword_show: () => 'Afişare parolă',
    inputPassword_hide: () => 'Ascundere parolă',
    inputPassword_hidden: () => 'Parolă ascunsă',
    formControl_clear: () => 'Golire',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'S-a depăşit lungimea maximă, de ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' caractere rămase.',
    select_noMatchesFound: () => 'Nu s-a găsit niciun rezultat',
    select_oneMatchFound: () => 'S-a găsit un rezultat.',
    select_sizeMatchesFound: (p) => 'S-au găsit ' + p['TOTAL_SIZE'] + ' rezultate',
    select_sizeOrMoreMatchesFound: (p) => 'S-au găsit ' + p['TOTAL_SIZE'] + ' sau mai multe rezultate',
    selectMultiple_showSelectedValues: () => 'Faceţi clic pentru a afişa lista cu valorile selectate.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' valori selectate.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Mai multe informaţii',
    userAssistance_required: () => 'Obligatoriu',
    selectMultiple_showFullList: () => 'Faceţi clic pentru a afişa lista cu toate valorile.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-e06df8dc.js.map
