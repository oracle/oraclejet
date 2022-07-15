/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

const bundle = {
    close: () => 'Fechar',
    error: () => 'Erro',
    warn: () => 'Advertência',
    info: () => 'informações',
    confirmation: () => 'Confirmação',
    progressIndeterminate: () => 'Em Andamento',
    inputPassword_show: () => 'Mostrar Senha',
    inputPassword_hide: () => 'Ocultar Senha',
    inputPassword_hidden: () => 'Senha Oculta',
    formControl_clear: () => 'Limpar',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Tamanho máximo ' + p['MAX_LENGTH'] + ' excedido.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' caracteres restantes.',
    select_noMatchesFound: () => 'Nenhuma correspondência encontrada',
    select_oneMatchFound: () => 'Uma correspondência encontrada',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' correspondências encontradas',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' ou mais correspondências encontradas',
    selectMultiple_showSelectedValues: () => 'Clique para mostrar a lista de valores selecionados.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' valores selecionados.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Saiba mais',
    userAssistance_required: () => 'Obrigatório',
    selectMultiple_showFullList: () => 'Clique para mostrar a lista completa de valores.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-4f7237e1.js.map
