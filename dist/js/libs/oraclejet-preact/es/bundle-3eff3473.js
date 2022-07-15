/* @oracle/oraclejet-preact: 13.0.0 */
const bundle = {
    close: () => 'Fermeture',
    error: () => 'Erreur',
    warn: () => 'Avertissement',
    info: () => 'informations',
    confirmation: () => 'Confirmation',
    progressIndeterminate: () => 'En cours',
    inputPassword_show: () => 'Afficher le mot de passe',
    inputPassword_hide: () => 'Masquer le mot de passe',
    inputPassword_hidden: () => 'Mot de passe masqué',
    formControl_clear: () => 'Effacer',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Longueur maximale de ' + p['MAX_LENGTH'] + ' dépassée.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' caractères restants.',
    select_noMatchesFound: () => 'Aucune correspondance trouvée',
    select_oneMatchFound: () => 'Une correspondance a été trouvée',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' correspondances trouvées',
    select_sizeOrMoreMatchesFound: (p) => 'Au moins ' + p['TOTAL_SIZE'] + ' correspondances trouvées',
    selectMultiple_showSelectedValues: () => 'Cliquez ici pour afficher la liste des valeurs sélectionnées.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' valeurs sélectionnées.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'En savoir plus',
    userAssistance_required: () => 'Obligatoire',
    selectMultiple_showFullList: () => 'Cliquez ici pour afficher la liste complète des valeurs.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-3eff3473.js.map
