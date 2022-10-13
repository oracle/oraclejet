/* @oracle/oraclejet-preact: 13.1.0 */
const bundle = {
    close: () => 'Schließen',
    error: () => 'Fehler',
    warn: () => 'Warnung',
    info: () => 'Info',
    confirmation: () => 'Bestätigung',
    progressIndeterminate: () => 'Wird ausgeführt',
    inputPassword_show: () => 'Kennwort anzeigen',
    inputPassword_hide: () => 'Kennwort ausblenden',
    inputPassword_hidden: () => 'Kennwort ausgeblendet',
    formControl_clear: () => 'Leeren',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Maximale Länge ' + p['MAX_LENGTH'] + ' überschritten.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' Zeichen übrig.',
    select_noMatchesFound: () => 'Keine Übereinstimmungen gefunden',
    select_oneMatchFound: () => 'Eine Übereinstimmung gefunden',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' Übereinstimmungen gefunden',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' oder mehr Übereinstimmungen gefunden',
    selectMultiple_showSelectedValues: () => 'Klicken, um die Liste der ausgewählten Werte anzuzeigen.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' Werte ausgewählt.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Weitere Informationen',
    userAssistance_required: () => 'Erforderlich',
    selectMultiple_showFullList: () => 'Klicken, um die vollständige Werteliste anzuzeigen.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-2c5c590d.js.map
