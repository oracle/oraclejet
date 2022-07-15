/* @oracle/oraclejet-preact: 13.0.0 */
const bundle = {
    close: () => '关闭',
    error: () => '错误',
    warn: () => '警告',
    info: () => '信息',
    confirmation: () => '确认',
    progressIndeterminate: () => '进行中',
    inputPassword_show: () => '显示密码',
    inputPassword_hide: () => '隐藏密码',
    inputPassword_hidden: () => '密码已隐藏',
    formControl_clear: () => '清除',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => '超过了最大长度 ' + p['MAX_LENGTH'] + '。',
    formControl_maxLengthRemaining: (p) => '剩余 ' + p['CHARACTER_COUNT'] + ' 个字符。',
    select_noMatchesFound: () => '找不到匹配项',
    select_oneMatchFound: () => '找到一个匹配',
    select_sizeMatchesFound: (p) => '找到 ' + p['TOTAL_SIZE'] + ' 个匹配项',
    select_sizeOrMoreMatchesFound: (p) => '找到 ' + p['TOTAL_SIZE'] + ' 个或更多匹配项',
    selectMultiple_showSelectedValues: () => '单击以显示所选值列表。',
    selectMultiple_valuesSelected: (p) => '已选择 ' + p['VALUE_COUNT'] + ' 个值。',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => '了解更多',
    userAssistance_required: () => '必需',
    selectMultiple_showFullList: () => '单击以显示完整值列表。'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-ad0bf842.js.map
