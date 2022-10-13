/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

const bundle = {
    close: () => 'ปิด',
    error: () => 'ข้อผิดพลาด',
    warn: () => 'คำเตือน',
    info: () => 'ข้อมูล',
    confirmation: () => 'การยืนยัน',
    progressIndeterminate: () => 'กำลังดำเนินการ',
    inputPassword_show: () => 'แสดงรหัสผ่าน',
    inputPassword_hide: () => 'ซ่อนรหัสผ่าน',
    inputPassword_hidden: () => 'ซ่อนรหัสผ่านแล้ว',
    formControl_clear: () => 'ล้างข้อมูล',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'เกินความยาวสูงสุด ' + p['MAX_LENGTH'],
    formControl_maxLengthRemaining: (p) => 'เหลืออักขระ ' + p['CHARACTER_COUNT'] + ' ตัว',
    select_noMatchesFound: () => 'ไม่พบรายการที่ค้นหา',
    select_oneMatchFound: () => 'พบข้อมูลหนึ่งรายการ',
    select_sizeMatchesFound: (p) => 'พบรายการที่ค้นหา ' + p['TOTAL_SIZE'] + ' รายการ',
    select_sizeOrMoreMatchesFound: (p) => 'พบรายการที่ค้นหาตั้งแต่ ' + p['TOTAL_SIZE'] + ' รายการ',
    selectMultiple_showSelectedValues: () => 'คลิกเพื่อแสดงรายการค่าที่เลือก',
    selectMultiple_valuesSelected: (p) => 'เลือกค่า ' + p['VALUE_COUNT'] + ' ค่าแล้ว',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'ข้อมูลเพิ่มเติม',
    userAssistance_required: () => 'จำเป็น',
    selectMultiple_showFullList: () => 'คลิกเพื่อแสดงรายการค่าทั้งหมด'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-521c1762.js.map
