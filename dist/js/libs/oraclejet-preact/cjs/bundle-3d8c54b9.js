/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

const bundle = {
    close: () => 'Uždaryti',
    error: () => 'Klaida',
    warn: () => 'Perspėjimas',
    info: () => 'informacija',
    confirmation: () => 'Patvirtinimas',
    progressIndeterminate: () => 'Vykdoma',
    inputPassword_show: () => 'Rodyti slaptažodį',
    inputPassword_hide: () => 'Slėpti slaptažodį',
    inputPassword_hidden: () => 'Slaptažodis paslėptas',
    formControl_clear: () => 'Valyti',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Viršytas maksimalus ilgis ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' simboliai (-ių) liko.',
    select_noMatchesFound: () => 'Atitikmenų nerasta',
    select_oneMatchFound: () => 'Rastas vienas atitikmuo',
    select_sizeMatchesFound: (p) => 'Rasta ' + p['TOTAL_SIZE'] + ' atitikmenų',
    select_sizeOrMoreMatchesFound: (p) => 'Rasta ' + p['TOTAL_SIZE'] + ' arba daugiau atitikmenų',
    selectMultiple_showSelectedValues: () => 'Spustelėkite, kad būtų parodytas pasirinktų reikšmių sąrašas',
    selectMultiple_valuesSelected: (p) => 'Pasirinkta reikšmių: ' + p['VALUE_COUNT'] + '.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Sužinokite daugiau',
    userAssistance_required: () => 'Būtina',
    selectMultiple_showFullList: () => 'Spustelėkite, kad būtų rodomas visas reikšmių sąrašas'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-3d8c54b9.js.map
