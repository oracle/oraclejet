/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

const bundle = {
    close: () => 'Cerrar',
    error: () => 'Error',
    warn: () => 'Advertencia',
    info: () => 'información',
    confirmation: () => 'Confirmación',
    progressIndeterminate: () => 'En curso',
    inputPassword_show: () => 'Mostrar Contraseña',
    inputPassword_hide: () => 'Ocultar contraseña',
    inputPassword_hidden: () => 'Contraseña oculta',
    formControl_clear: () => 'Borrar',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Longitud máxima ' + p['MAX_LENGTH'] + ' superada.',
    formControl_maxLengthRemaining: (p) => 'Quedan ' + p['CHARACTER_COUNT'] + ' caracteres.',
    select_noMatchesFound: () => 'No se ha encontrado ninguna coincidencia',
    select_oneMatchFound: () => 'Se ha encontrado una coincidencia',
    select_sizeMatchesFound: (p) => 'Se han encontrado ' + p['TOTAL_SIZE'] + ' coincidencias',
    select_sizeOrMoreMatchesFound: (p) => 'Se han encontrado ' + p['TOTAL_SIZE'] + ' coincidencias o más',
    selectMultiple_showSelectedValues: () => 'Haga clic para mostrar la lista de valores seleccionados.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' valores seleccionados.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Más información',
    userAssistance_required: () => 'Necesaria',
    selectMultiple_showFullList: () => 'Haga clic para mostrar la lista de valores completa.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-0d743b62.js.map
