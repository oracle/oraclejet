/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

const bundle = {
    close: () => 'Zamknij',
    error: () => 'Błąd',
    warn: () => 'Ostrzeżenie',
    info: () => 'informacje',
    confirmation: () => 'Potwierdzenie',
    progressIndeterminate: () => 'W toku',
    inputPassword_show: () => 'Pokaż hasło',
    inputPassword_hide: () => 'Ukryj hasło',
    inputPassword_hidden: () => 'Hasło ukryte',
    formControl_clear: () => 'Wyczyść',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Przekroczono maksymalną długość ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => 'Pozostało znaków: ' + p['CHARACTER_COUNT'] + '.',
    select_noMatchesFound: () => 'Nie znaleziono zgodnych',
    select_oneMatchFound: () => 'Znaleziono zgodnych: 1',
    select_sizeMatchesFound: (p) => 'Znaleziono zgodnych: ' + p['TOTAL_SIZE'],
    select_sizeOrMoreMatchesFound: (p) => 'Znaleziono zgodnych: ' + p['TOTAL_SIZE'] + ' lub więcej',
    selectMultiple_showSelectedValues: () => 'Proszę kliknąć, aby wyświetlić listę wybranych wartości.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' wybrane wartości.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Dalsze informacje',
    userAssistance_required: () => 'Wymagane',
    selectMultiple_showFullList: () => 'Proszę kliknąć, aby wyświetlić pełną listę wartości.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-b0a88606.js.map
