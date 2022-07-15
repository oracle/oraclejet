/* @oracle/oraclejet-preact: 13.0.0 */
const bundle = {
    close: () => 'Đóng',
    error: () => 'Lỗi',
    warn: () => 'Cảnh báo',
    info: () => 'thông tin',
    confirmation: () => 'Xác nhận',
    progressIndeterminate: () => 'Đang xử lý',
    inputPassword_show: () => 'Hiển thị mật khẩu',
    inputPassword_hide: () => 'Ẩn mật khẩu',
    inputPassword_hidden: () => 'Mật khẩu bị ẩn',
    formControl_clear: () => 'Xóa',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Đã vượt quá độ dài tối đa ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => 'Còn lại ' + p['CHARACTER_COUNT'] + ' ký tự.',
    select_noMatchesFound: () => 'Không tìm thấy kết quả khớp nào',
    select_oneMatchFound: () => 'Tìm thấy một kết quả khớp',
    select_sizeMatchesFound: (p) => 'Tìm thấy ' + p['TOTAL_SIZE'] + ' kết quả phù hợp',
    select_sizeOrMoreMatchesFound: (p) => 'Tìm thấy ' + p['TOTAL_SIZE'] + ' kết quả phù hợp trở lên',
    selectMultiple_showSelectedValues: () => 'Nhấp để hiển thị danh sách giá trị đã chọn.',
    selectMultiple_valuesSelected: (p) => 'Đã chọn ' + p['VALUE_COUNT'] + ' giá trị.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Tìm hiểu thêm',
    userAssistance_required: () => 'Bắt buộc',
    selectMultiple_showFullList: () => 'Nhấp để hiển thị toàn bộ danh sách giá trị.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-4ea13155.js.map
