/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

const bundle = {
    close: () => 'Sluiten',
    error: () => 'Fout',
    warn: () => 'Waarschuwing',
    info: () => 'info',
    confirmation: () => 'Bevestiging',
    progressIndeterminate: () => 'In uitvoering',
    inputPassword_show: () => 'Wachtwoord tonen',
    inputPassword_hide: () => 'Wachtwoord verbergen',
    inputPassword_hidden: () => 'Wachtwoord verborgen',
    formControl_clear: () => 'Wissen',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Maximumlengte ' + p['MAX_LENGTH'] + ' is overschreden.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' tekens over',
    select_noMatchesFound: () => 'Geen treffers gevonden.',
    select_oneMatchFound: () => 'Eén match gevonden.',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' matches gevonden',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' of meer matches gevonden',
    selectMultiple_showSelectedValues: () => 'Klik om de lijst met geselecteerde waarden te tonen.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' geselecteerde waarden',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Meer info',
    userAssistance_required: () => 'Vereist',
    selectMultiple_showFullList: () => 'Klik om de volledige lijst met waarden te tonen.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-a4cdab61.js.map
