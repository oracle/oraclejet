/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

const bundle = {
    close: () => 'Chiudi',
    error: () => 'Errore',
    warn: () => 'Avvertenza',
    info: () => 'informazioni',
    confirmation: () => 'Conferma',
    progressIndeterminate: () => 'In corso',
    inputPassword_show: () => 'Mostra password',
    inputPassword_hide: () => 'Nascondi password',
    inputPassword_hidden: () => 'Password nascosta',
    formControl_clear: () => 'Cancella',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Lunghezza massima ' + p['MAX_LENGTH'] + ' superata.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' caratteri rimanenti.',
    select_noMatchesFound: () => 'Nessuna corrispondenza trovata',
    select_oneMatchFound: () => 'Una corrispondenza trovata',
    select_sizeMatchesFound: (p) => 'Trovate ' + p['TOTAL_SIZE'] + ' corrispondenze',
    select_sizeOrMoreMatchesFound: (p) => 'Trovate ' + p['TOTAL_SIZE'] + ' o più corrispondenze',
    selectMultiple_showSelectedValues: () => 'Fare clic per visualizzare la lista dei valori selezionati.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' valori selezionati.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Ulteriori informazioni',
    userAssistance_required: () => 'Obbligatorio',
    selectMultiple_showFullList: () => 'Fare clic per visualizzare la lista di valori completa.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-ab98f418.js.map
