/* @oracle/oraclejet-preact: 13.1.0 */
const bundle = {
    close: () => '닫기',
    error: () => '오류',
    warn: () => '경고',
    info: () => '정보',
    confirmation: () => '확인',
    progressIndeterminate: () => '진행 중',
    inputPassword_show: () => '비밀번호 표시',
    inputPassword_hide: () => '비밀번호 숨기기',
    inputPassword_hidden: () => '비밀번호 숨김',
    formControl_clear: () => '지우기',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => '최대 길이 ' + p['MAX_LENGTH'] + ' 초과.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + '자 남음.',
    select_noMatchesFound: () => '일치 항목을 찾을 수 없습니다.',
    select_oneMatchFound: () => '일치하는 항목이 한 개 발견되었습니다.',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + '개의 일치 항목이 발견되었습니다.',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + '개 이상의 일치 항목이 발견되었습니다.',
    selectMultiple_showSelectedValues: () => '눌러서 선택된 값 목록을 표시합니다.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + '개 값이 선택되었습니다.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => '자세히',
    userAssistance_required: () => '필수',
    selectMultiple_showFullList: () => '눌러서 전체 값 목록을 표시합니다.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-12fe56f5.js.map
