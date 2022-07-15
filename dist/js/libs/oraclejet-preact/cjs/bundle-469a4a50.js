/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

const bundle = {
    close: () => 'Fechar',
    error: () => 'Erro',
    warn: () => 'Aviso',
    info: () => 'informações',
    confirmation: () => 'Confirmação',
    progressIndeterminate: () => 'A Decorrer',
    inputPassword_show: () => 'Mostrar Senha',
    inputPassword_hide: () => 'Ocultar Senha',
    inputPassword_hidden: () => 'Senha Oculta',
    formControl_clear: () => 'Limpar',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Comprimento máximo ' + p['MAX_LENGTH'] + ' excedido.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' caracteres em falta.',
    select_noMatchesFound: () => 'Não foram encontradas correspondências',
    select_oneMatchFound: () => 'Foi encontrada uma correspondência',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' correspondências encontradas',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' ou mais correspondências encontradas',
    selectMultiple_showSelectedValues: () => 'Clique para mostrar a lista de valores selecionados.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' valores selecionados.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Mais informações',
    userAssistance_required: () => 'Obrigatório',
    selectMultiple_showFullList: () => 'Clique para mostrar a lista de valores completa.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-469a4a50.js.map
