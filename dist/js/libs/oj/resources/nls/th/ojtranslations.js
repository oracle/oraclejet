define({"oj-message":{fatal:"ร้ายแรง",error:"ข้อผิดพลาด",warning:"คำเตือน",info:"ข้อมูล",confirmation:"การยืนยัน","compact-type-summary":"{0}: {1}"},"oj-converter":{summary:"ค่าไม่อยู่ในรูปแบบที่ต้องการ",detail:"ป้อนค่าในรูปแบบที่ต้องการ","plural-separator":", ",hint:{summary:"ตัวอย่าง: {exampleValue}",detail:"ลองอีกครั้งโดยใช้รูปแบบดังนี้: '{exampleValue}'","detail-plural":"ป้อนค่าในรูปแบบนี้: '{exampleValue}'"},optionHint:{detail:"ค่าที่ยอมรับสำหรับตัวเลือก '{propertyName}' คือ '{propertyValueValid}'","detail-plural":"ค่าที่ยอมรับสำหรับตัวเลือก '{propertyName}' คือ '{propertyValueValid}'"},optionTypesMismatch:{summary:"ต้องระบุค่าสำหรับตัวเลือก '{requiredPropertyName}' เมื่อตั้งค่าตัวเลือก '{propertyName}' เป็น '{propertyValue}'"},optionTypeInvalid:{summary:"ไม่ได้ระบุค่าของประเภทที่ต้องการสำหรับตัวเลือก '{propertyName}'"},optionOutOfRange:{summary:"ค่า {propertyValue} อยู่นอกช่วงสำหรับตัวเลือก '{propertyName}'"},optionValueInvalid:{summary:"ค่า '{propertyValue}' ที่ระบุสำหรับตัวเลือก '{propertyName}' ไม่ถูกต้อง"},number:{decimalFormatMismatch:{summary:"ค่าที่ระบุไม่ได้อยู่ในรูปแบบตัวเลขที่ต้องการ"},shortLongUnsupportedParse:{summary:"ไม่รองรับ 'short' และ 'long' สำหรับการพาร์ซตัวแปลง",detail:"เปลี่ยนองค์ประกอบเป็น readOnly โดยฟิลด์ readOnly จะไม่เรียกใช้ฟังก์ชันการพาร์ซของตัวแปลง"},currencyFormatMismatch:{summary:"ค่าที่ระบุไม่ได้อยู่ในรูปแบบสกุลเงินที่ต้องการ"},percentFormatMismatch:{summary:"ค่าที่ระบุไม่ได้อยู่ในรูปแบบเปอร์เซ็นต์ที่ต้องการ"},invalidNumberFormat:{summary:"ค่าที่ระบุไม่ใช่ตัวเลขที่ถูกต้อง",detail:"โปรดระบุตัวเลขที่ถูกต้อง"}},color:{invalidFormat:{summary:"รูปแบบสีไม่ถูกต้อง",detail:"การระบุตัวเลือกรูปแบบสีไม่ถูกต้อง"},invalidSyntax:{summary:"การระบุสีไม่ถูกต้อง",detail:"ป้อนค่าสีที่ตรงตามมาตรฐาน CSS3"}},datetime:{datetimeOutOfRange:{summary:"ค่า '{value}' อยู่นอกช่วงสำหรับ '{propertyName}'",detail:"ป้อนค่าตั้งแต่ '{minValue}' ถึง '{maxValue}'",hour:"ชั่วโมง",minute:"นาที",second:"วินาที",millisec:"มิลลิวินาที",month:"เดือน",day:"วัน",year:"ปี","month name":"ชื่อเดือน",weekday:"วันทำการ"},dateFormatMismatch:{summary:"ค่าที่ระบุไม่ได้อยู่ในรูปแบบวันที่ที่ต้องการ"},invalidTimeZoneID:{summary:"ระบุ ID โซนเวลา {timeZoneID} ไม่ถูกต้อง"},nonExistingTime:{summary:"ไม่มีเวลาที่อินพุต เนื่องจากอยู่ในช่วงปรับเปลี่ยนเป็นเวลาตามฤดูกาล"},missingTimeZoneData:{summary:"ไม่มีข้อมูล TimeZone โปรดเรียก 'ojs/ojtimezonedata' ที่จำเป็นเพื่อโหลดข้อมูล TimeZone"},timeFormatMismatch:{summary:"ค่าที่ระบุไม่ได้อยู่ในรูปแบบเวลาที่ต้องการ"},datetimeFormatMismatch:{summary:"ค่าที่ระบุไม่ได้อยู่ในรูปแบบวันที่และเวลาที่ต้องการ"},dateToWeekdayMismatch:{summary:"วันที่ '{date}' ไม่ตรงกับ '{weekday}'",detail:"ป้อนวันทำการที่ตรงกับวันที่"},invalidISOString:{invalidRangeSummary:"ค่า '{value}' อยู่นอกช่วงสำหรับฟิลด์ '{propertyName}' ในสตริง ISO 8601 '{isoStr}'",summary:"'{isoStr}' ที่ระบุไม่ใช่สตริง ISO 8601 ที่ถูกต้อง",detail:"โปรดระบุสตริง ISO 8601 ที่ถูกต้อง"}}},"oj-validator":{length:{hint:{min:"ป้อนอักขระ {min} ตัวหรือมากกว่า",max:"ป้อนอักขระ {max} ตัวหรือน้อยกว่า",inRange:"ป้อนอักขระ {min} ถึง {max} ตัว",exact:"ป้อนอักขระ {length} ตัว"},messageDetail:{tooShort:"ป้อนอักขระ {min} ตัวหรือมากกว่า",tooLong:"ป้อนอักขระไม่เกิน {max} ตัว"},messageSummary:{tooShort:"มีอักขระจำนวนน้อยเกินไป",tooLong:"มีอักขระจำนวนมากเกินไป"}},range:{number:{hint:{min:"ป้อนตัวเลขที่มากกว่าหรือเท่ากับ {min}",max:"ป้อนตัวเลขที่น้อยกว่าหรือเท่ากับ {max}",inRange:"ป้อนตัวเลขตั้งแต่ {min} ถึง {max}",exact:"ป้อนตัวเลข {num}"},messageDetail:{rangeUnderflow:"ป้อนตัวเลข {min} หลักหรือมากกว่า",rangeOverflow:"ป้อนตัวเลข {max} หลักหรือน้อยกว่า",exact:"ป้อนตัวเลข {num}"},messageSummary:{rangeUnderflow:"ตัวเลขน้อยเกินไป",rangeOverflow:"ตัวเลขสูงเกินไป"}},datetime:{hint:{min:"ป้อนวันที่และเวลาตรงกับหรือหลัง {min}",max:"ป้อนวันที่และเวลาตรงกับหรือก่อน {max}",inRange:"ป้อนวันที่และเวลาตั้งแต่ {min} ถึง {max}"},messageDetail:{rangeUnderflow:"ป้อนวันที่ตรงกับหรือหลัง {min}",rangeOverflow:"ป้อนวันที่ตรงกับหรือก่อน {max}"},messageSummary:{rangeUnderflow:"วันที่และเวลาอยู่ก่อนวันที่และเวลาเริ่มต้น",rangeOverflow:"วันที่และเวลาอยู่หลังวันที่และเวลาสิ้นสุด"}},date:{hint:{min:"ป้อนวันที่ตรงกับหรือหลัง {min}",max:"ป้อนวันที่ตรงกับหรือก่อน {max}",inRange:"ป้อนวันที่ตั้งแต่ {min} ถึง {max}"},messageDetail:{rangeUnderflow:"ป้อนวันที่ตรงกับหรือหลัง {min}",rangeOverflow:"ป้อนวันที่ตรงกับหรือก่อน {max}"},messageSummary:{rangeUnderflow:"วันที่อยู่ก่อนวันที่เริ่มต้น",rangeOverflow:"วันที่อยู่หลังวันที่สิ้นสุด"}},time:{hint:{min:"ป้อนเวลาตรงกับหรือหลัง {min}",max:"ป้อนเวลาตรงกับหรือก่อน {max}",inRange:"ป้อนเวลาตั้งแต่ {min} ถึง {max}"},messageDetail:{rangeUnderflow:"ป้อนเวลาเท่ากับหรือหลัง {min}",rangeOverflow:"ป้อนเวลาเท่ากับหรือก่อน {max}"},messageSummary:{rangeUnderflow:"เวลาอยู่ก่อนเวลาเริ่มต้น",rangeOverflow:"เวลาอยู่หลังเวลาสิ้นสุด"}}},restriction:{date:{messageSummary:"วันที่ {value} มาจากรายการที่เลิกใช้",messageDetail:"ไม่มีวันที่ที่คุณเลือกไว้ โปรดลองวันที่อื่น"}},regExp:{summary:"รูปแบบไม่ถูกต้อง",detail:"ป้อนค่าที่ใช้ได้ตามคำอธิบายในเอ็กซ์เพรสชันทั่วไป: '{pattern}'"},required:{summary:"ต้องระบุค่า",detail:"ป้อนค่า"}},"oj-ojEditableValue":{loading:"กำลังโหลด",requiredText:"ต้องระบุ",helpSourceText:"เรียนรู้เพิ่มเติม..."},"oj-ojInputDate":{done:"เสร็จ",cancel:"ยกเลิก",time:"เวลา",prevText:"ก่อนหน้า",nextText:"ถัดไป",currentText:"วันนี้",weekHeader:"สัปดาห์",tooltipCalendar:"เลือกวันที่",tooltipCalendarTime:"เลือกวันที่/เวลา",tooltipCalendarDisabled:"เลิกใช้การเลือกวันที่",tooltipCalendarTimeDisabled:"เลิกใช้การเลือกวันที่/เวลา",picker:"ตัวเลือก",weekText:"สัปดาห์",datePicker:"ตัวเลือกวันที่",inputHelp:"กดลูกศรชี้ลงหรือลูกศรชี้ขึ้นเพื่อเข้าใช้ปฏิทิน",inputHelpBoth:"กดลูกศรชี้ลงหรือลูกศรชี้ขึ้นเพื่อเข้าใช้ปฏิทิน และ Shift + ลูกศรชี้ลงหรือ Shift + ลูกศรชี้ขึ้นเพื่อเข้าใช้ดรอปดาวน์เวลา",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},dateRestriction:{hint:"",messageSummary:"",messageDetail:""}},"oj-ojInputTime":{cancelText:"ยกเลิก",okText:"ตกลง",currentTimeText:"ปัจจุบัน",hourWheelLabel:"ชั่วโมง",minuteWheelLabel:"นาที",ampmWheelLabel:"AMPM",tooltipTime:"เลือกเวลา",tooltipTimeDisabled:"เลิกใช้การเลือกเวลา",inputHelp:"กดลูกศรชี้ลงหรือลูกศรชี้ขึ้นเพื่อเข้าใช้ดรอปดาวน์เวลา",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}}},"oj-inputBase":{required:{hint:"",messageSummary:"",messageDetail:""},regexp:{messageSummary:"",messageDetail:""},accessibleMaxLengthExceeded:"เกินความยาวสูงสุด {len}",accessibleMaxLengthRemaining:"เหลืออักขระ {chars} ตัว"},"oj-ojInputText":{accessibleClearIcon:"ล้างข้อมูล"},"oj-ojInputPassword":{regexp:{messageDetail:"ค่าต้องตรงกับรูปแบบนี้: '{pattern}'"},accessibleShowPassword:"แสดงรหัสผ่าน",accessibleHidePassword:"ซ่อนรหัสผ่าน"},"oj-ojFilmStrip":{labelAccFilmStrip:"กำลังแสดง {pageIndex} จาก {pageCount} เพจ",labelAccArrowNextPage:"เลือก ถัดไป เพื่อแสดงเพจถัดไป",labelAccArrowPreviousPage:"เลือก ก่อนหน้า เพื่อแสดงเพจก่อนหน้า",tipArrowNextPage:"ถัดไป",tipArrowPreviousPage:"ก่อนหน้า"},"oj-ojDataGrid":{accessibleSortAscending:"{id} เรียงจากน้อยไปมาก",accessibleSortDescending:"{id} เรียกจากมากไปน้อย",accessibleSortable:"{id} จัดเรียงได้",accessibleActionableMode:"เข้าสู่โหมดที่สามารถดำเนินการได้",accessibleNavigationMode:"เข้าสู่โหมดการนาวิเกต กด F2 เพื่อเข้าสู่โหมดแก้ไขหรือโหมดที่สามารถดำเนินการได้",accessibleEditableMode:"เข้าสู่โหมดที่สามารถแก้ไขได้ กด Escape เพื่อนาวิเกตนอกกริดข้อมูล",accessibleSummaryExact:"นี่คือกริดข้อมูลที่มี {rownum} แถวและ {colnum} คอลัมน์",accessibleSummaryEstimate:"นี่คือกริดข้อมูลที่ไม่ทราบจำนวนแถวและคอลัมน์",accessibleSummaryExpanded:"ขณะนี้มีการขยายแถวแล้ว {num} แถว",accessibleRowExpanded:"ขยายแถวแล้ว",accessibleExpanded:"ขยายแล้ว",accessibleRowCollapsed:"ยุบแถวแล้ว",accessibleCollapsed:"ยุบแล้ว",accessibleRowSelected:"เลือกแถว {row}",accessibleColumnSelected:"เลือกคอลัมน์ {column}",accessibleStateSelected:"รายการที่เลือก",accessibleMultiCellSelected:"เลือกไว้ {num} เซลล์",accessibleColumnSpanContext:"{extent} กว้าง",accessibleRowSpanContext:"{extent} สูง",accessibleRowContext:"แถว {index}",accessibleColumnContext:"คอลัมน์ {index}",accessibleRowHeaderContext:"ส่วนหัวของแถว {index}",accessibleColumnHeaderContext:"ส่วนหัวของคอลัมน์ {index}",accessibleRowEndHeaderContext:"ส่วนหัวการสิ้นสุดแถว {index}",accessibleColumnEndHeaderContext:"ส่วนหัวการสิ้นสุดคอลัมน์ {index}",accessibleRowHeaderLabelContext:"ป้ายกำกับส่วนหัวแถว {level}",accessibleColumnHeaderLabelContext:"ป้ายกำกับส่วนหัวคอลัมน์ {level}",accessibleRowEndHeaderLabelContext:"ป้ายกำกับส่วนหัวจุดสิ้นสุดของแถว {level}",accessibleColumnEndHeaderLabelContext:"ป้ายกำกับส่วนหัวจุดสิ้นสุดของคอลัมน์ {level}",accessibleLevelContext:"ระดับ {level}",accessibleRangeSelectModeOn:"เปิดโหมดการเพิ่มช่วงของเซลล์ที่เลือก",accessibleRangeSelectModeOff:"ปิดโหมดการเพิ่มช่วงของเซลล์ที่เลือก",accessibleFirstRow:"คุณอยู่ที่แถวแรก",accessibleLastRow:"คุณอยู่ที่แถวสุดท้าย",accessibleFirstColumn:"คุณอยู่ที่คอลัมน์แรก",accessibleLastColumn:"คุณอยู่ที่คอลัมน์สุดท้าย",accessibleSelectionAffordanceTop:"แฮนเดิลการเลือกด้านบน",accessibleSelectionAffordanceBottom:"แฮนเดิลการเลือกด้านล่าง",accessibleLevelHierarchicalContext:"ระดับ {level}",accessibleRowHierarchicalFull:"แถว {posInSet} จาก {setSize} แถว",accessibleRowHierarchicalPartial:"แถว {posInSet} จากอย่างน้อย {setSize} แถว",accessibleRowHierarchicalUnknown:"อย่างน้อยแถว {posInSet} จากอย่างน้อย {setSize} แถว",accessibleColumnHierarchicalFull:"คอลัมน์ {posInSet} จาก {setSize} คอลัมน์",accessibleColumnHierarchicalPartial:"คอลัมน์ {posInSet} จากอย่างน้อย {setSize} คอลัมน์",accessibleColumnHierarchicalUnknown:"อย่างน้อยคอลัมน์ {posInSet} จากอย่างน้อย {setSize} คอลัมน์",msgFetchingData:"กำลังดึงข้อมูล...",msgNoData:"ไม่มีรายการที่จะแสดงผล",labelResize:"ปรับขนาด",labelResizeWidth:"ปรับความกว้าง",labelResizeHeight:"ปรับความสูง",labelSortAsc:"เรียงจากน้อยไปมาก",labelSortDsc:"เรียงจากมากไปน้อย",labelSortRow:"จัดเรียงแถว",labelSortRowAsc:"จัดเรียงแถวจากน้อยไปมาก",labelSortRowDsc:"จัดเรียงแถวจากมากไปน้อย",labelSortCol:"จัดเรียงคอลัมน์",labelSortColAsc:"จัดเรียงคอลัมน์จากน้อยไปมาก",labelSortColDsc:"จัดเรียงคอลัมน์จากมากไปน้อย",labelCut:"ตัด",labelPaste:"วาง",labelCutCells:"ตัด",labelPasteCells:"วาง",labelCopyCells:"คัดลอก",labelAutoFill:"เติมอัตโนมัติ",labelEnableNonContiguous:"ใช้การเลือกแบบไม่ต่อเนื่อง",labelDisableNonContiguous:"เลิกใช้การเลือกแบบไม่ต่อเนื่อง",labelResizeDialogSubmit:"ตกลง",labelResizeDialogCancel:"ยกเลิก",accessibleContainsControls:"มีตัวควบคุม",labelSelectMultiple:"เลือกหลายรายการ",labelResizeDialogApply:"ใช้",labelResizeFitToContent:"ปรับขนาดให้พอดี",columnWidth:"ความกว้างเป็นพิเซล",rowHeight:"ความสูงเป็นพิกเซล",labelResizeColumn:"ปรับขนาดของคอลัมน์",labelResizeRow:"ปรับขนาดแถว",resizeColumnDialog:"ปรับขนาดของคอลัมน์",resizeRowDialog:"ปรับขนาดแถว",labelFreezeRow:"ฟรีซแถว",labelFreezeCol:"ฟรีซคอลัมน์",labelUnfreezeRow:"ยกเลิกการฟรีซแถว",labelUnfreezeCol:"ยกเลิกการฟรีซคอลัมน์",collapsedText:"ยุบ",expandedText:"ขยาย",tooltipRequired:"ต้องระบุ"},"oj-ojRowExpander":{accessibleLevelDescription:"ระดับ {level}",accessibleRowDescription:"ระดับ {level}, แถว {num} จาก {total}",accessibleRowExpanded:"ขยายแถวแล้ว",accessibleRowCollapsed:"ยุบแถวแล้ว",accessibleStateExpanded:"ขยายแล้ว",accessibleStateCollapsed:"ยุบแล้ว"},"oj-ojStreamList":{msgFetchingData:"กำลังดึงข้อมูล..."},"oj-ojListView":{msgFetchingData:"กำลังดึงข้อมูล...",msgNoData:"ไม่มีรายการที่จะแสดงผล",msgItemsAppended:"{count} รายการที่ต่อกับจุดสิ้นสุด",msgFetchCompleted:"มีการดึงข้อมูลรายการทั้งหมดแล้ว",indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",accessibleExpandCollapseInstructionText:"ใช้ปุ่มลูกศรเพื่อขยายและยุบ",accessibleGroupExpand:"ขยายแล้ว",accessibleGroupCollapse:"ยุบแล้ว",accessibleReorderTouchInstructionText:"แตะสองครั้งค้างไว้ รอจนกว่าจะได้ยินเสียงแล้วจึงลากเพื่อจัดเรียงใหม่",accessibleReorderBeforeItem:"ก่อน {item}",accessibleReorderAfterItem:"หลัง {item}",accessibleReorderInsideItem:"ใน {item}",accessibleNavigateSkipItems:"กำลังข้าม {numSkip} รายการ",accessibleSuggestion:"ข้อแนะนำ",labelCut:"ตัด",labelCopy:"คัดลอก",labelPaste:"วาง",labelPasteBefore:"วางก่อน",labelPasteAfter:"วางหลัง"},"oj-ojWaterfallLayout":{msgFetchingData:"กำลังดึงข้อมูล..."},"oj-_ojLabel":{tooltipHelp:"วิธีใช้",tooltipRequired:"ต้องระบุ"},"oj-ojLabel":{tooltipHelp:"วิธีใช้",tooltipRequired:"ต้องระบุ"},"oj-ojInputNumber":{required:{hint:"",messageSummary:"",messageDetail:""},numberRange:{hint:{min:"",max:"",inRange:"",exact:""},messageDetail:{rangeUnderflow:"",rangeOverflow:"",exact:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},tooltipDecrement:"ส่วนลด",tooltipIncrement:"ส่วนเพิ่ม"},"oj-ojTable":{accessibleAddRow:"ป้อนข้อมูลเพื่อเพิ่มแถวใหม่",accessibleColumnContext:"คอลัมน์ {index}",accessibleColumnFooterContext:"ส่วนท้ายคอลัมน์ {index}",accessibleColumnHeaderContext:"ส่วนหัวของคอลัมน์ {index}",accessibleContainsControls:"มีตัวควบคุม",accessibleColumnsSpan:"ขยาย {count} คอลัมน์",accessibleRowContext:"แถว {index}",accessibleSortable:"{id} จัดเรียงได้",accessibleSortAscending:"{id} เรียงจากน้อยไปมาก",accessibleSortDescending:"{id} เรียกจากมากไปน้อย",accessibleStateSelected:"รายการที่เลือก",accessibleStateUnselected:"ที่ไม่ได้เลือก",accessibleSummaryEstimate:"ตารางที่มี {colnum} คอลัมน์และมีมากกว่า {rownum} แถว",accessibleSummaryExact:"ตารางที่มี {colnum} คอลัมน์และ {rownum} แถว",labelAccSelectionAffordanceTop:"แฮนเดิลการเลือกด้านบน",labelAccSelectionAffordanceBottom:"แฮนเดิลการเลือกด้านล่าง",labelEnableNonContiguousSelection:"ใช้การเลือกแบบไม่ต่อเนื่อง",labelDisableNonContiguousSelection:"เลิกใช้การเลือกแบบไม่ต่อเนื่อง",labelResize:"ปรับขนาด",labelResizeColumn:"ปรับขนาดของคอลัมน์",labelResizePopupSubmit:"ตกลง",labelResizePopupCancel:"ยกเลิก",labelResizePopupSpinner:"ปรับขนาดของคอลัมน์",labelResizeColumnDialog:"ปรับขนาดของคอลัมน์",labelColumnWidth:"ความกว้างเป็นพิเซล",labelResizeDialogApply:"ใช้",labelSelectRow:"เลือกแถว",labelSelectAllRows:"เลือกแถวทั้งหมด",labelEditRow:"แก้ไขแถว",labelSelectAndEditRow:"เลือกและแก้ไขแถว",labelSelectColumn:"เลือกคอลัมน์",labelSort:"จัดเรียง",labelSortAsc:"เรียงจากน้อยไปมาก",labelSortDsc:"เรียงจากมากไปน้อย",msgFetchingData:"กำลังดึงข้อมูล...",msgNoData:"ไม่มีข้อมูลที่จะแสดงผล",msgInitializing:"กำลังเริ่มต้น...",msgColumnResizeWidthValidation:"ค่าความกว้างต้องเป็นจำนวนเต็ม",msgScrollPolicyMaxCountSummary:"เกินจำนวนแถวสูงสุดสำหรับการเลื่อนตาราง",msgScrollPolicyMaxCountDetail:"โปรดโหลดอีกครั้งด้วยชุดข้อมูลที่มีขนาดเล็กลง",msgStatusSortAscending:"{0} เรียงจากน้อยไปมาก",msgStatusSortDescending:"{0} เรียกจากมากไปน้อย",tooltipRequired:"ต้องระบุ"},"oj-ojTabs":{labelCut:"ตัด",labelPasteBefore:"วางก่อน",labelPasteAfter:"วางหลัง",labelRemove:"ย้ายออก",labelReorder:"จัดลำดับใหม่",removeCueText:"ย้ายออกได้"},"oj-ojCheckboxset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:"เลือกค่า"}},"oj-ojRadioset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:"เลือกค่า"}},"oj-ojSelect":{required:{hint:"",messageSummary:"",messageDetail:"เลือกค่า"},searchField:"ฟิลด์ค้นหา",noMatchesFound:"ไม่พบรายการที่ค้นหา",noMoreResults:"ไม่มีผลลัพธ์เพิ่มเติม",oneMatchesFound:"พบข้อมูลหนึ่งรายการ",moreMatchesFound:"พบ {num} รายการที่ค้นหา",filterFurther:"มีผลลัพธ์เพิ่มเติม โปรดฟิลเตอร์เพิ่ม"},"oj-ojSwitch":{SwitchON:"เปิด",SwitchOFF:"ปิด"},"oj-ojCombobox":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"ไม่พบรายการที่ค้นหา",noMoreResults:"ไม่มีผลลัพธ์เพิ่มเติม",oneMatchesFound:"พบข้อมูลหนึ่งรายการ",moreMatchesFound:"พบ {num} รายการที่ค้นหา",filterFurther:"มีผลลัพธ์เพิ่มเติม โปรดฟิลเตอร์เพิ่ม"},"oj-ojSelectSingle":{required:{hint:"",messageSummary:"",messageDetail:"เลือกค่า"},noMatchesFound:"ไม่พบรายการที่ค้นหา",oneMatchFound:"พบข้อมูลหนึ่งรายการ",multipleMatchesFound:"พบ {num} รายการที่ค้นหา",nOrMoreMatchesFound:"พบรายการที่ตรงกันมากกว่า {num} รายการ",cancel:"ยกเลิก",labelAccOpenDropdown:"ขยาย",labelAccClearValue:"ล้างค่า",noResultsLine1:"ไม่พบผลลัพธ์",noResultsLine2:"เราไม่พบรายการใดที่ตรงกับการค้นหาของคุณ"},"oj-ojInputSearch2":{cancel:"ยกเลิก",noSuggestionsFound:"ไม่พบข้อเสนอแนะ"},"oj-ojInputSearch":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"ไม่พบรายการที่ค้นหา",oneMatchesFound:"พบข้อมูลหนึ่งรายการ",moreMatchesFound:"พบ {num} รายการที่ค้นหา"},"oj-ojTreeView":{treeViewSelectorAria:"ซีเลคเตอร์ TreeView {rowKey}",retrievingDataAria:"กำลังเรียกข้อมูลสำหรับโหนด: {nodeText}",receivedDataAria:"รับข้อมูลสำหรับโหนด: {nodeText} แล้ว"},"oj-ojTree":{stateLoading:"กำลังโหลด...",labelNewNode:"โหนดใหม่",labelMultiSelection:"การเลือกหลายรายการ",labelEdit:"แก้ไข",labelCreate:"สร้าง",labelCut:"ตัด",labelCopy:"คัดลอก",labelPaste:"วาง",labelPasteAfter:"วางหลัง",labelPasteBefore:"วางก่อน",labelRemove:"ย้ายออก",labelRename:"เปลี่ยนชื่อ",labelNoData:"ไม่มีข้อมูล"},"oj-ojPagingControl":{labelAccPaging:"แบ่งหน้า",labelAccPageNumber:"โหลด {pageNum} เนื้อหาของเพจแล้ว",labelAccNavFirstPage:"เพจแรก",labelAccNavLastPage:"เพจสุดท้าย",labelAccNavNextPage:"เพจถัดไป",labelAccNavPreviousPage:"เพจก่อนหน้า",labelAccNavPage:"เพจ",labelLoadMore:"แสดงเพิ่มเติม...",labelLoadMoreMaxRows:"ถึงขีดจำกัดสูงสุด {maxRows} แถวแล้ว",labelNavInputPage:"เพจ",labelNavInputPageMax:"จาก {pageMax}",fullMsgItemRange:"{pageFrom}-{pageTo} จาก {pageMax} รายการ",fullMsgItemRangeAtLeast:"{pageFrom}-{pageTo} จาก {pageMax} รายการเป็นอย่างน้อย",fullMsgItemRangeApprox:"{pageFrom}-{pageTo} จาก {pageMax} รายการโดยประมาณ",msgItemRangeNoTotal:"{pageFrom}-{pageTo} รายการ",fullMsgItem:"{pageTo} จาก {pageMax} รายการ",fullMsgItemAtLeast:"{pageTo} จาก {pageMax} รายการเป็นอย่างน้อย",fullMsgItemApprox:"{pageTo} จาก {pageMax} รายการโดยประมาณ",msgItemNoTotal:"{pageTo} รายการ",msgItemRangeCurrent:"{pageFrom}-{pageTo}",msgItemRangeCurrentSingle:"{pageFrom}",msgItemRangeOf:"จาก",msgItemRangeOfAtLeast:"จากอย่างน้อย",msgItemRangeOfApprox:"จากประมาณ",msgItemRangeItems:"รายการ",tipNavInputPage:"ไปที่เพจ",tipNavPageLink:"ไปที่เพจ {pageNum}",tipNavNextPage:"ถัดไป",tipNavPreviousPage:"ก่อนหน้า",tipNavFirstPage:"แรก",tipNavLastPage:"สุดท้าย",pageInvalid:{summary:"ค่าของเพจที่ป้อนไม่ถูกต้อง",detail:"โปรดป้อนค่ามากกว่า 0"},maxPageLinksInvalid:{summary:"ค่าสำหรับ maxPageLinks ไม่ถูกต้อง",detail:"โปรดป้อนค่ามากกว่า 4"}},"oj-ojMasonryLayout":{labelCut:"ตัด",labelPasteBefore:"วางก่อน",labelPasteAfter:"วางหลัง"},"oj-panel":{labelAccButtonExpand:"ขยาย",labelAccButtonCollapse:"ยุบ",labelAccButtonRemove:"ย้ายออก",labelAccFlipForward:"พลิกไปข้างหน้า",labelAccFlipBack:"พลิกกลับ",tipDragToReorder:"ลากเพื่อจัดอันดับ",labelAccDragToReorder:"ลากเพื่อจัดอันดับ เมนูคอนเท็กซ์ที่ใช้ได้"},"oj-ojChart":{labelDefaultGroupName:"กลุ่ม {0}",labelSeries:"ชุด",labelGroup:"กลุ่ม",labelDate:"วันที่",labelValue:"ค่า",labelTargetValue:"เป้าหมาย",labelX:"X",labelY:"Y",labelZ:"Z",labelPercentage:"เปอร์เซ็นต์",labelLow:"ต่ำ",labelHigh:"สูง",labelOpen:"เปิด",labelClose:"ปิด",labelVolume:"ปริมาณ",labelQ1:"Q1",labelQ2:"Q2",labelQ3:"Q3",labelMin:"ต่ำสุด",labelMax:"สูงสุด",labelOther:"อื่นๆ",tooltipPan:"แพน",tooltipSelect:"เลือกเฉพาะในกรอบ",tooltipZoom:"ซูมเฉพาะในกรอบ",componentName:"แผนภูมิ"},"oj-dvtBaseGauge":{componentName:"มาตรวัด"},"oj-ojDiagram":{promotedLink:"{0} ลิงค์",promotedLinks:"{0} ลิงค์",promotedLinkAriaDesc:"ทางอ้อม",componentName:"ไดอะแกรม"},"oj-ojGantt":{componentName:"แกนท์",accessibleDurationDays:"{0} วัน",accessibleDurationHours:"{0} ชั่วโมง",accessibleTaskInfo:"เวลาเริ่มต้นคือ {0} เวลาสิ้นสุดคือ {1} ระยะเวลาคือ {2}",accessibleMilestoneInfo:"เวลาคือ {0}",accessibleRowInfo:"แถว {0}",accessibleTaskTypeMilestone:"ไมล์สโตน",accessibleTaskTypeSummary:"ข้อมูลสรุป",accessiblePredecessorInfo:"{0} ค่าที่อยู่ก่อนหน้า",accessibleSuccessorInfo:"{0} ค่าถัดไป",accessibleDependencyInfo:"ประเภทการอ้างอิง {0} เชื่อมต่อ {1} กับ {2}",startStartDependencyAriaDesc:"เริ่มต้น-เริ่มต้น",startFinishDependencyAriaDesc:"เริ่มต้น-สิ้นสุด",finishStartDependencyAriaDesc:"สิ้นสุด-เริ่มต้น",finishFinishDependencyAriaDesc:"สิ้นสุด-สิ้นสุด",tooltipZoomIn:"ซูมเข้า",tooltipZoomOut:"ซูมออก",labelLevel:"ระดับ",labelRow:"แถว",labelStart:"เริ่มต้น",labelEnd:"สิ้นสุด",labelDate:"วันที่",labelBaselineStart:"เริ่มต้นตามเกณฑ์พื้นฐาน",labelBaselineEnd:"สิ้นสุดตามเกณฑ์พื้นฐาน",labelBaselineDate:"วันที่ตามเกณฑ์พื้นฐาน",labelDowntimeStart:"การเริ่มต้นช่วงเวลาหยุดทำงาน",labelDowntimeEnd:"การสิ้นสุดช่วงเวลาหยุดทำงาน",labelOvertimeStart:"การเริ่มต้นงานล่วงเวลา",labelOvertimeEnd:"การสิ้นสุดงานล่วงเวลา",labelAttribute:"แอททริบิว",labelLabel:"ป้ายกำกับ",labelProgress:"ความคืบหน้า",labelMoveBy:"ย้ายภายใน",labelResizeBy:"ปรับขนาดตาม",taskMoveInitiated:"เริ่มต้นการย้ายงาน",taskResizeEndInitiated:"เริ่มต้นจุดสิ้นสุดการปรับขนาดงานแล้ว",taskResizeStartInitiated:"เริ่มต้นจุดเริ่มการปรับขนาดงานแล้ว",taskMoveSelectionInfo:"อื่นๆ {0} รายการที่เลือก",taskResizeSelectionInfo:"อื่นๆ {0} รายการที่เลือก",taskMoveInitiatedInstruction:"ใช้ปุ่มลูกศรเพื่อย้าย",taskResizeInitiatedInstruction:"ใช้ปุ่มลูกศรเพื่อปรับขนาด",taskMoveFinalized:"สิ้นสุดการย้ายงาน",taskResizeFinalized:"การปรับขนาดงานสิ้นสุดแล้ว",taskMoveCancelled:"ยกเลิกการย้ายงาน",taskResizeCancelled:"การปรับขนาดงานถูกยกเลิก",taskResizeStartHandle:"แฮนเดิลเริ่มการปรับขนาดงาน",taskResizeEndHandle:"แฮนเดิลสิ้นสุดการปรับขนาดงาน"},"oj-ojLegend":{componentName:"คำอธิบาย",tooltipExpand:"ขยาย",tooltipCollapse:"ยุบ",labelInvalidData:"ข้อมูลไม่ถูกต้อง",labelNoData:"ไม่มีข้อมูลที่จะแสดงผล",labelClearSelection:"ล้างข้อมูลที่เลือกไว้",stateSelected:"เลือกไว้",stateUnselected:"ไม่ได้เลือกไว้",stateMaximized:"ขนาดใหญ่สุด",stateMinimized:"ขนาดเล็กสุด",stateIsolated:"แยก",labelCountWithTotal:"{0} จาก {1}",accessibleContainsControls:"มีตัวควบคุม"},"oj-ojNBox":{highlightedCount:"{0}/{1}",labelOther:"อื่นๆ",labelGroup:"กลุ่ม",labelSize:"ขนาด",labelAdditionalData:"ข้อมูลเพิ่มเติม",componentName:"{0} บ็อกซ์"},"oj-ojPictoChart":{componentName:"แผนภูมิรูปภาพ"},"oj-ojSparkChart":{componentName:"แผนภูมิ"},"oj-ojSunburst":{labelColor:"สี",labelSize:"ขนาด",tooltipExpand:"ขยาย",tooltipCollapse:"ยุบ",componentName:"ซันเบิร์สท์"},"oj-ojTagCloud":{componentName:"แท็กคลาวด์",accessibleContainsControls:"มีตัวควบคุม",labelCountWithTotal:"{0} จาก {1}",labelInvalidData:"ข้อมูลไม่ถูกต้อง",stateCollapsed:"ยุบแล้ว",stateDrillable:"ดริลล์ได้",stateExpanded:"ขยายแล้ว",stateIsolated:"แยก",stateHidden:"ซ่อน",stateMaximized:"ขนาดใหญ่สุด",stateMinimized:"ขนาดเล็กสุด",stateVisible:"มองเห็นได้"},"oj-ojThematicMap":{componentName:"แผนที่เฉพาะทาง",areasRegion:"พื้นที่",linksRegion:"ลิงค์",markersRegion:"มาร์คเกอร์"},"oj-ojTimeAxis":{componentName:"แกนเวลา"},"oj-ojTimeline":{componentName:"ระยะเวลา",stateMinimized:"ขนาดเล็กสุด",stateMaximized:"ขนาดใหญ่สุด",stateIsolated:"แยก",stateHidden:"ซ่อน",stateExpanded:"ขยายแล้ว",stateVisible:"มองเห็นได้",stateDrillable:"ดริลล์ได้",stateCollapsed:"ยุบแล้ว",labelCountWithTotal:"{0} จาก {1}",accessibleItemDesc:"คำอธิบายคือ {0}",accessibleItemEnd:"เวลาสิ้นสุดคือ {0}",accessibleItemStart:"เวลาเริ่มต้นคือ {0}",accessibleItemTitle:"ชื่อคือ {0}",labelSeries:"ชุด",tooltipZoomIn:"ซูมเข้า",tooltipZoomOut:"ซูมออก",labelStart:"เริ่มต้น",labelEnd:"สิ้นสุด",labelAccNavNextPage:"เพจถัดไป",labelAccNavPreviousPage:"เพจก่อนหน้า",tipArrowNextPage:"ถัดไป",tipArrowPreviousPage:"ก่อนหน้า",navArrowDisabledState:"เลิกใช้",labelDate:"วันที่",labelTitle:"ชื่อ",labelDescription:"คำอธิบาย",labelMoveBy:"ย้ายภายใน",labelResizeBy:"ปรับขนาดตาม",itemMoveInitiated:"เริ่มต้นการย้ายอีเวนต์แล้ว",itemResizeEndInitiated:"เริ่มต้นจุดสิ้นสุดการปรับขนาดอีเวนต์แล้ว",itemResizeStartInitiated:"เริ่มต้นจุดเริ่มการปรับขนาดอีเวนต์แล้ว",itemMoveSelectionInfo:"อื่นๆ {0} รายการที่เลือก",itemResizeSelectionInfo:"อื่นๆ {0} รายการที่เลือก",itemMoveInitiatedInstruction:"ใช้ปุ่มลูกศรเพื่อย้าย",itemResizeInitiatedInstruction:"ใช้ปุ่มลูกศรเพื่อปรับขนาด",itemMoveFinalized:"สิ้นสุดการย้ายอีเวนต์แล้ว",itemResizeFinalized:"สิ้นสุดการปรับขนาดอีเวนต์แล้ว",itemMoveCancelled:"ยกเลิกการย้ายอีเวนต์แล้ว",itemResizeCancelled:"ยกเลิกการปรับขนาดอีเวนต์แล้ว",itemResizeStartHandle:"แฮนเดิลเริ่มการปรับขนาดอีเวนต์",itemResizeEndHandle:"แฮนเดิลสิ้นสุดการปรับขนาดอีเวนต์"},"oj-ojTreemap":{labelColor:"สี",labelSize:"ขนาด",tooltipIsolate:"แยก",tooltipRestore:"เรียกคืน",componentName:"แผนที่โครงสร้าง"},"oj-dvtBaseComponent":{labelScalingSuffixThousand:"K",labelScalingSuffixMillion:"M",labelScalingSuffixBillion:"B",labelScalingSuffixTrillion:"T",labelScalingSuffixQuadrillion:"Q",labelInvalidData:"ข้อมูลไม่ถูกต้อง",labelNoData:"ไม่มีข้อมูลที่จะแสดงผล",labelClearSelection:"ล้างข้อมูลที่เลือกไว้",labelDataVisualization:"การแสดงข้อมูล",stateSelected:"เลือกไว้",stateUnselected:"ไม่ได้เลือกไว้",stateMaximized:"ขนาดใหญ่สุด",stateMinimized:"ขนาดเล็กสุด",stateExpanded:"ขยายแล้ว",stateCollapsed:"ยุบแล้ว",stateIsolated:"แยก",stateHidden:"ซ่อน",stateVisible:"มองเห็นได้",stateDrillable:"ดริลล์ได้",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} จาก {1}",accessibleContainsControls:"มีตัวควบคุม"},"oj-ojRatingGauge":{labelClearSelection:"ล้างข้อมูลที่เลือกไว้",stateSelected:"เลือกไว้",stateUnselected:"ไม่ได้เลือกไว้",stateMaximized:"ขนาดใหญ่สุด",stateMinimized:"ขนาดเล็กสุด",stateExpanded:"ขยายแล้ว",stateCollapsed:"ยุบแล้ว",stateIsolated:"แยก",stateHidden:"ซ่อน",stateVisible:"มองเห็นได้",stateDrillable:"ดริลล์ได้",labelCountWithTotal:"{0} จาก {1}",accessibleContainsControls:"มีตัวควบคุม"},"oj-ojStatusMeterGauge":{labelClearSelection:"ล้างข้อมูลที่เลือกไว้",stateSelected:"เลือกไว้",stateUnselected:"ไม่ได้เลือกไว้",stateMaximized:"ขนาดใหญ่สุด",stateMinimized:"ขนาดเล็กสุด",stateExpanded:"ขยายแล้ว",stateCollapsed:"ยุบแล้ว",stateIsolated:"แยก",stateHidden:"ซ่อน",stateVisible:"มองเห็นได้",stateDrillable:"ดริลล์ได้",labelCountWithTotal:"{0} จาก {1}",accessibleContainsControls:"มีตัวควบคุม"},"oj-ojNavigationList":{defaultRootLabel:"ลิสต์การนาวิเกต",hierMenuBtnLabel:"ปุ่มเมนูย่อย",selectedLabel:"รายการที่เลือก",previousIcon:"ก่อนหน้า",msgFetchingData:"กำลังดึงข้อมูล...",msgNoData:"ไม่มีรายการที่จะแสดงผล",overflowItemLabel:"เพิ่มเติม",accessibleReorderTouchInstructionText:"แตะสองครั้งค้างไว้ รอจนกว่าจะได้ยินเสียงแล้วจึงลากเพื่อจัดเรียงใหม่",accessibleReorderBeforeItem:"ก่อน {item}",accessibleReorderAfterItem:"หลัง {item}",labelCut:"ตัด",labelPasteBefore:"วางก่อน",labelPasteAfter:"วางหลัง",labelRemove:"ย้ายออก",removeCueText:"ย้ายออกได้"},"oj-ojSlider":{noValue:"ojSlider ไม่มีค่า",maxMin:"สูงสุดต้องไม่น้อยกว่าหรือเท่ากับต่ำสุด",startEnd:"value.start ต้องไม่มากกว่า value.end",valueRange:"ค่าต้องอยู่ภายในช่วงต่ำสุดถึงสูงสุด",optionNum:"ตัวเลือก {option} ไม่ใช่ตัวเลข",invalidStep:"ขั้นตอนไม่ถูกต้อง ขั้นตอนต้อง > 0",lowerValueThumb:"ค่าขั้นต่ำขนาดย่อ",higherValueThumb:"ค่าขั้นสูงขนาดย่อ"},"oj-ojDialog":{labelCloseIcon:"ปิด"},"oj-ojPopup":{ariaLiveRegionInitialFocusFirstFocusable:"กำลังเข้าสู่ป็อปอัป กด F6 เพื่อนาวิเกตระหว่างป็อปอัปและการควบคุมที่เกี่ยวข้อง",ariaLiveRegionInitialFocusNone:"ป็อปอัปเปิดอยู่ กด F6 เพื่อนาวิเกตระหว่างป็อปอัปและการควบคุมที่เกี่ยวข้อง",ariaLiveRegionInitialFocusFirstFocusableTouch:"กำลังเข้าสู่ป็อปอัป สามารถปิดป็อปอัปได้โดยนาวิเกตไปยังลิงค์ล่าสุดภายในป็อปอัป",ariaLiveRegionInitialFocusNoneTouch:"ป็อปอัปเปิดอยู่ โปรดนาวิเกตไปยังลิงค์ถัดไปเพื่อกำหนดโฟกัสภายในป็อปอัป",ariaFocusSkipLink:"แตะสองครั้งเพื่อนาวิเกตไปยังป็อปอัปที่เปิดอยู่",ariaCloseSkipLink:"แตะสองครั้งเพื่อปิดป็อปอัปที่เปิดอยู่"},"oj-ojRefresher":{ariaRefreshLink:"เปิดใช้งานลิงค์เพื่อรีเฟรชเนื้อหา",ariaRefreshingLink:"กำลังรีเฟรชเนื้อหา",ariaRefreshCompleteLink:"รีเฟรชเสร็จสมบูรณ์"},"oj-ojSwipeActions":{ariaShowStartActionsDescription:"แสดงการดำเนินการเริ่มต้น",ariaShowEndActionsDescription:"แสดงการดำเนินการสิ้นสุด",ariaHideActionsDescription:"ซ่อนการดำเนินการ"},"oj-ojIndexer":{indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",indexerOthers:"#",ariaDisabledLabel:"ไม่พบส่วนหัวของกลุ่มที่ตรงกัน",ariaOthersLabel:"ตัวเลข",ariaInBetweenText:"ตั้งแต่ {first} ถึง {second}",ariaKeyboardInstructionText:"กด Enter เพื่อเลือกค่า",ariaTouchInstructionText:"แตะสองครั้งและกดค้างไว้เพื่อเข้าสู่โหมดการวาดนิ้ว จากนั้นลากขึ้นหรือลงเพื่อปรับค่า"},"oj-ojMenu":{labelCancel:"ยกเลิก",ariaFocusSkipLink:"โฟกัสจะอยู่ภายในเมนู ให้แตะสองครั้งหรือปัดเพื่อย้ายโฟกัสไปยังรายการเมนูแรก"},"oj-ojColorSpectrum":{labelHue:"เฉดสี",labelOpacity:"ความทึบ",labelSatLum:"ความเข้ม/ความสว่าง",labelThumbDesc:"ตัวเลื่อนแถบสีแบบสี่ทิศทาง"},"oj-ojColorPalette":{labelNone:"ไม่มี"},"oj-ojColorPicker":{labelSwatches:"แผงสี",labelCustomColors:"สีที่กำหนดเอง",labelPrevColor:"สีก่อนหน้า",labelDefColor:"สีดีฟอลต์",labelDelete:"ลบ",labelDeleteQ:"ลบหรือไม่",labelAdd:"เพิ่ม",labelAddColor:"เพิ่มสี",labelMenuHex:"ฐานสิบหก",labelMenuRgba:"RGBa",labelMenuHsla:"HSLa",labelSliderHue:"เฉดสี",labelSliderSaturation:"ความเข้ม",labelSliderSat:"เข้ม",labelSliderLightness:"ความสว่าง",labelSliderLum:"ความสว่าง",labelSliderAlpha:"Alpha",labelOpacity:"ความทึบ",labelSliderRed:"แดง",labelSliderGreen:"เขียว",labelSliderBlue:"น้ำเงิน"},"oj-ojFilePicker":{dropzoneText:"วางไฟล์ที่นี่หรือคลิกเพื่ออัปโหลด",singleFileUploadError:"อัปโหลดทีละไฟล์",singleFileTypeUploadError:"คุณไม่สามารถอัปโหลดไฟล์ประเภท {fileType}.",multipleFileTypeUploadError:"คุณไม่สามารถอัปโหลดไฟล์ประเภท: {fileTypes}",dropzonePrimaryText:"ลากและวาง",secondaryDropzoneText:"เลือกไฟล์หรือวางไว้ที่นี่",secondaryDropzoneTextMultiple:"เลือกหรือวางไฟล์ไว้ที่นี่",unknownFileType:"ไม่รู้จัก"},"oj-ojProgressbar":{ariaIndeterminateProgressText:"กำลังดำเนินการ"},"oj-ojMessage":{labelCloseIcon:"ปิด",categories:{error:"ข้อผิดพลาด",warning:"คำเตือน",info:"ข้อมูล",confirmation:"การยืนยัน",none:"ไม่มี"}},"oj-ojSelector":{checkboxAriaLabel:"การเลือกช่องทำเครื่องหมาย {rowKey}",checkboxAriaLabelSelected:" รายการที่เลือก",checkboxAriaLabelUnselected:" รายการที่ไม่ได้เลือก"},"oj-ojMessages":{labelLandmark:"ข้อความ",ariaLiveRegion:{navigationFromKeyboard:"กำลังเข้าสู่พื้นที่ข้อความ กด F6 เพื่อนาวิเกตกลับไปยังอีลิเมนต์ที่โฟกัสก่อนหน้า",navigationToTouch:"พื้นที่ข้อความมีข้อความใหม่ ใช้ตัวหมุน Voice-Over เพื่อนาวิเกตไปยังสถานที่สำคัญของข้อความ",navigationToKeyboard:"พื้นที่ข้อความมีข้อความใหม่ กด F6 เพื่อนาวิเกตไปยังพื้นที่ข้อความล่าสุด",newMessage:"ชนิดข้อความ {category} {summary} {detail}",noDetail:"รายละเอียดใช้ไม่ได้"}},"oj-ojMessageBanner":{close:"ปิด",navigationFromMessagesRegion:"กำลังเข้าสู่พื้นที่ข้อความ กด F6 เพื่อนาวิเกตกลับไปยังอีลิเมนต์ที่โฟกัสก่อนหน้า",navigationToMessagesRegion:"พื้นที่ข้อความมีข้อความใหม่ กด F6 เพื่อนาวิเกตไปยังพื้นที่ข้อความล่าสุด",error:"ข้อผิดพลาด",warning:"คำเตือน",info:"ข้อมูล",confirmation:"การยืนยัน"},"oj-ojConveyorBelt":{tipArrowNext:"ถัดไป",tipArrowPrevious:"ก่อนหน้า"},"oj-ojTrain":{stepInfo:"ขั้นตอนที่ {index} จาก {count}",stepStatus:"สถานะ: {status}",stepCurrent:"ปัจจุบัน",stepVisited:"เข้าชมแล้ว",stepNotVisited:"ไม่ได้เข้าชม",stepDisabled:"เลิกใช้",stepMessageType:"ประเภทข้อความ: {messageType}.",stepMessageConfirmation:"ยืนยันแล้ว",stepMessageInfo:"ข้อมูล",stepMessageWarning:"คำเตือน",stepMessageError:"ข้อผิดพลาด"}});