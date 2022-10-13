/* @oracle/oraclejet-preact: 13.1.0 */
const bundle = {
    close: () => 'Aizvērt',
    error: () => 'Kļūda',
    warn: () => 'Brīdinājums',
    info: () => 'informācija',
    confirmation: () => 'Apstiprinājums',
    progressIndeterminate: () => 'Pašlaik notiek',
    inputPassword_show: () => 'Rādīt paroli',
    inputPassword_hide: () => 'Paslēpt paroli',
    inputPassword_hidden: () => 'Parole paslēpta',
    formControl_clear: () => 'Notīrīt',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Pārsniegts maksimālais garums ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => 'Atlikušas ' + p['CHARACTER_COUNT'] + ' rakstzīmes.',
    select_noMatchesFound: () => 'Nav atrasta neviena atbilstība',
    select_oneMatchFound: () => 'Atrasta viena atbilstība',
    select_sizeMatchesFound: (p) => 'Atrastas ' + p['TOTAL_SIZE'] + ' atbilstības',
    select_sizeOrMoreMatchesFound: (p) => 'Atrastas ' + p['TOTAL_SIZE'] + ' vai vairāk atbilstību',
    selectMultiple_showSelectedValues: () => 'Noklikšķiniet, lai parādītu atlasīto vērtību sarakstu.',
    selectMultiple_valuesSelected: (p) => 'Atlasītas ' + p['VALUE_COUNT'] + ' vērtības.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Uzzināt vairāk',
    userAssistance_required: () => 'Nepieciešams',
    selectMultiple_showFullList: () => 'Noklikšķiniet, lai parādītu pilnu vērtību sarakstu.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-9d9e9715.js.map
