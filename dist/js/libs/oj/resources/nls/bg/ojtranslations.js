define({"oj-message":{fatal:"Фатално",error:"Грешка",warning:"Предупреждение",info:"Информация",confirmation:"Потвърждение","compact-type-summary":"{0}: {1}"},"oj-converter":{summary:"Стойността не е в очаквания формат.",detail:"Въведете стойност в очаквания формат.","plural-separator":", ",hint:{summary:"Пример: {exampleValue}",detail:"Въведете стойност в този формат: „{exampleValue}“.","detail-plural":"Въведете стойност в тези формати: „{exampleValue}“."},optionHint:{detail:"Приета стойност за опция „{propertyName}“ е „{propertyValueValid}“.","detail-plural":"Приети стойности за опция „{propertyName}“ са „{propertyValueValid}“."},optionTypesMismatch:{summary:"Изисква се стойност за опцията „{requiredPropertyName}“, когато опцията „{propertyName}“ е зададена на „{propertyValue}“."},optionTypeInvalid:{summary:"Не беше предоставена стойност от очаквания тип за опцията „{propertyName}“."},optionOutOfRange:{summary:"Стойността {propertyValue} е извън обхвата за опцията „{propertyName}“."},optionValueInvalid:{summary:"Посочена е невалидна стойност „{propertyValue}“ за опцията „{propertyName}“."},number:{decimalFormatMismatch:{summary:"Предоставената стойност не е в очаквания числов формат."},shortLongUnsupportedParse:{summary:"„short“ и „long“ не се поддържат за анализиране на конвертор.",detail:"Променете компонента на readonly. Полетата readonly не извикват функцията parse на конвертора."},currencyFormatMismatch:{summary:"Предоставената стойност не е в очаквания формат на валутата."},percentFormatMismatch:{summary:"Предоставената стойност не е в очаквания процентов формат."},invalidNumberFormat:{summary:"Предоставената стойност не е валидно число.",detail:"Въведете валидно число."}},color:{invalidFormat:{summary:"Невалиден формат на цвета.",detail:"Невалидна спецификация на опцията за формат на цвета."},invalidSyntax:{summary:"Невалидна спецификация на цвета.",detail:"Въведете стойност за цвета, която отговаря на стандарта на CSS3."}},datetime:{datetimeOutOfRange:{summary:"Стойността „{value}“ е извън обхвата за „{propertyName}“.",detail:"Въведете стойност между „{minValue}“ и „{maxValue}“.",hour:"час",minute:"минута",second:"секунда",millisec:"милисекунда",month:"месец",day:"ден",year:"година","month name":"име на месец",weekday:"ден от седмицата"},dateFormatMismatch:{summary:"Предоставената стойност не е в очаквания формат на датата."},invalidTimeZoneID:{summary:"Предоставен е невалиден ИД на часова зона {timeZoneID}."},nonExistingTime:{summary:"Въведеният час не съществува, тъй като попада при преминаването към лятно часово време."},missingTimeZoneData:{summary:"Липсват данни за часова зона. Извикайте require 'ojs/ojtimezonedata', за да заредите данните за часова зона."},timeFormatMismatch:{summary:"Предоставената стойност не е в очаквания формат на часа."},datetimeFormatMismatch:{summary:"Предоставената стойност не е в очаквания формат на датата и часа."},dateToWeekdayMismatch:{summary:"Денят „{date}“ не е „{weekday}“.",detail:"Въведете ден от седмицата, който съответства на датата."},invalidISOString:{invalidRangeSummary:"Стойността „{value}“ е извън обхвата за полето „{propertyName}“ в низа „{isoStr}“ по ISO 8601.",summary:"Предоставеният „{isoStr}“ не е валиден низ по ISO 8601.",detail:"Въведете валиден низ по ISO 8601."}}},"oj-validator":{length:{hint:{min:"Въведете {min} или повече знака.",max:"Въведете {max} или по-малко знака.",inRange:"Въведете от {min} до {max} знака.",exact:"Въведете {length} знака."},messageDetail:{tooShort:"Въведете {min} или повече знака.",tooLong:"Не въвеждайте повече от {max} знака."},messageSummary:{tooShort:"Има твърде малко знаци.",tooLong:"Има твърде много знаци."}},range:{number:{hint:{min:"Въведете число, по-голямо или равно на {min}.",max:"Въведете число, по-малко или равно на {max}.",inRange:"Въведете число между {min} и {max}.",exact:"Въведете числото {num}."},messageDetail:{rangeUnderflow:"Въведете {min} или по-голямо число.",rangeOverflow:"Въведете {max} или по-малко число.",exact:"Въведете числото {num}."},messageSummary:{rangeUnderflow:"Числото е твърде малко.",rangeOverflow:"Числото е твърде голямо."}},datetime:{hint:{min:"Въведете дата и час на или след {min}.",max:"Въведете дата и час на или преди {max}.",inRange:"Въведете дата и час между {min} и {max}."},messageDetail:{rangeUnderflow:"Въведете дата на или след {min}.",rangeOverflow:"Въведете дата на или преди {max}."},messageSummary:{rangeUnderflow:"Датата и часът са по-рано от най-ранните дата и час.",rangeOverflow:"Датата и часът са по-късно от най-късните дата и час."}},date:{hint:{min:"Въведете дата на или след {min}.",max:"Въведете дата на или преди {max}.",inRange:"Въведете дата между {min} и {max}."},messageDetail:{rangeUnderflow:"Въведете дата на или след {min}.",rangeOverflow:"Въведете дата на или преди {max}."},messageSummary:{rangeUnderflow:"Датата е по-рано от най-ранната дата.",rangeOverflow:"Датата е по-късно от най-късната дата."}},time:{hint:{min:"Въведете час на или след {min}.",max:"Въведете час на или преди {max}.",inRange:"Въведете час между {min} и {max}."},messageDetail:{rangeUnderflow:"Въведете час във или след {min}.",rangeOverflow:"Въведете час във или преди {max}."},messageSummary:{rangeUnderflow:"Часът е по-рано от най-ранния час.",rangeOverflow:"Часът е по-късно от най-късния час."}}},restriction:{date:{messageSummary:"Датата {value} представлява деактивиран запис.",messageDetail:"Датата, която избрахте, не е налична. Опитайте с друга дата."}},regExp:{summary:"Форматът е неправилен.",detail:"Въведете допустимите стойности, описани в този регулярен израз: „{pattern}“."},required:{summary:"Необходима е стойност.",detail:"Въведете стойност."}},"oj-ojEditableValue":{loading:"Зареждане",requiredText:"Задължително",helpSourceText:"Научете повече..."},"oj-ojInputDate":{done:"Готово",cancel:"Отказ",prevText:"Предишен",nextText:"Следващ",currentText:"Днес",weekHeader:"Седмица",tooltipCalendar:"Избор на дата.",tooltipCalendarTime:"Избор на дата и час.",tooltipCalendarDisabled:"Изборът на дата е деактивиран.",tooltipCalendarTimeDisabled:"Изборът на дата и час е деактивиран.",picker:"Инструмент за избиране",weekText:"Седмица",datePicker:"Избиране на дата",inputHelp:"Използвайте копчетата за надолу или нагоре, за да влезете в календара.",inputHelpBoth:"Използвайте копчетата за надолу или нагоре, за да влезете в календара, и Shift + копчето за надолу или Shift + копчето за нагоре, за да влезете в падащото меню за часа.",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},dateRestriction:{hint:"",messageSummary:"",messageDetail:""}},"oj-ojInputTime":{cancelText:"Отказ",okText:"ОК",currentTimeText:"Сега",hourWheelLabel:"Час",minuteWheelLabel:"Минута",ampmWheelLabel:"AM/PM",tooltipTime:"Избор на час.",tooltipTimeDisabled:"Изборът на час е деактивиран.",inputHelp:"Използвайте копчетата за надолу или нагоре, за да влезете в падащото меню за часа.",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}}},"oj-inputBase":{required:{hint:"",messageSummary:"",messageDetail:""},regexp:{messageSummary:"",messageDetail:""},accessibleMaxLengthExceeded:"Надвишена е максималната дължина от {len}.",accessibleMaxLengthRemaining:"Остават {chars} знака."},"oj-ojInputPassword":{regexp:{messageDetail:"Стойността трябва да съвпада с този модел: „{pattern}“."},accessibleShowPassword:"Показване на парола.",accessibleHidePassword:"Скриване на парола."},"oj-ojFilmStrip":{labelAccFilmStrip:"Показва се страница {pageIndex} от {pageCount}",labelAccArrowNextPage:"Изберете „Следваща“, за да се покаже следващата страница",labelAccArrowPreviousPage:"Изберете „Предишна“, за да се покаже предишната страница",tipArrowNextPage:"Следваща",tipArrowPreviousPage:"Предишна"},"oj-ojDataGrid":{accessibleSortAscending:"{id} сортирани във възходящ ред",accessibleSortDescending:"{id} сортирани в низходящ ред",accessibleActionableMode:"Влизане в режим за действие.",accessibleNavigationMode:"Влезте в режим за навигиране, натиснете F2, за да влезете в режим за редактиране или за действие.",accessibleEditableMode:"Влезте в редактируем режим, натиснете Escape, за да навигирате извън мрежата с данни.",accessibleSummaryExact:"Това е мрежа с данни с/ъс {rownum} реда и {colnum} колони",accessibleSummaryEstimate:"Това е мрежа с данни с неизвестен брой редове и колони",accessibleSummaryExpanded:"В момента има {num} разгънати реда",accessibleRowExpanded:"Разгънат ред",accessibleRowCollapsed:"Свит ред",accessibleRowSelected:"Избран ред {row}",accessibleColumnSelected:"Избрана колона {column}",accessibleStateSelected:"избрано",accessibleMultiCellSelected:"Избрани {num} клетки",accessibleColumnSpanContext:"{extent} на ширина",accessibleRowSpanContext:"{extent} на височина",accessibleRowContext:"Ред {index}",accessibleColumnContext:"Колона {index}",accessibleRowHeaderContext:"Заглавие на ред {index}",accessibleColumnHeaderContext:"Заглавие на колона {index}",accessibleRowEndHeaderContext:"Заглавие в края на реда {index}",accessibleColumnEndHeaderContext:"Заглавие в края на колоната {index}",accessibleRowHeaderLabelContext:"Етикет на заглавие на ред {level}",accessibleColumnHeaderLabelContext:"Етикет на заглавие на колона {level}",accessibleRowEndHeaderLabelContext:"Етикет на заглавие в края на реда {level}",accessibleColumnEndHeaderLabelContext:"Етикет на заглавие в края на колоната {level}",accessibleLevelContext:"Ниво {level}",accessibleRangeSelectModeOn:"Режимът за добавяне на избрания диапазон от клетки е вкл.",accessibleRangeSelectModeOff:"Режимът за добавяне на избрания диапазон от клетки е изкл.",accessibleFirstRow:"Достигнахте първия ред.",accessibleLastRow:"Достигнахте последния ред.",accessibleFirstColumn:"Достигнахте първата колона.",accessibleLastColumn:"Достигнахте последната колона.",accessibleSelectionAffordanceTop:"Манипулатор за избор отгоре.",accessibleSelectionAffordanceBottom:"Манипулатор за избор отдолу.",msgFetchingData:"Извличане на данни...",msgNoData:"Няма елементи за показване.",labelResize:"Преоразмеряване",labelResizeWidth:"Преоразмеряване на ширина",labelResizeHeight:"Преоразмеряване на височина",labelSortRow:"Сортиране на ред",labelSortRowAsc:"Сортиране на ред възходящо",labelSortRowDsc:"Сортиране на ред низходящо",labelSortCol:"Сортиране на колона",labelSortColAsc:"Сортиране на колона възходящо",labelSortColDsc:"Сортиране на колона низходящо",labelCut:"Изрязване",labelPaste:"Поставяне",labelEnableNonContiguous:"Активиране на неграничещ избор",labelDisableNonContiguous:"Деактивиране на неграничещ избор",labelResizeDialogSubmit:"ОК",labelResizeDialogCancel:"Отказ",accessibleContainsControls:"Съдържа контроли"},"oj-ojRowExpander":{accessibleLevelDescription:"Ниво {level}",accessibleRowDescription:"Ниво {level}, ред {num} от {total}",accessibleRowExpanded:"Разгънат ред",accessibleRowCollapsed:"Свит ред",accessibleStateExpanded:"разгънато",accessibleStateCollapsed:"свито"},"oj-ojListView":{msgFetchingData:"Извличане на данни...",msgNoData:"Няма елементи за показване.",msgItemsAppended:"{count} елемента са добавени към края.",indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",accessibleReorderTouchInstructionText:"Натиснете два пъти и задръжте. Изчакайте звука, след което плъзнете, за да пренаредите.",accessibleReorderBeforeItem:"Преди {item}",accessibleReorderAfterItem:"След {item}",accessibleReorderInsideItem:"В/ъв {item}",accessibleNavigateSkipItems:"Пропускане на {numSkip} елемента",labelCut:"Изрязване",labelCopy:"Копиране",labelPaste:"Поставяне",labelPasteBefore:"Поставяне преди",labelPasteAfter:"Поставяне след"},"oj-_ojLabel":{tooltipHelp:"Помощ",tooltipRequired:"Задължително"},"oj-ojLabel":{tooltipHelp:"Помощ",tooltipRequired:"Задължително"},"oj-ojInputNumber":{required:{hint:"",messageSummary:"",messageDetail:""},numberRange:{hint:{min:"",max:"",inRange:"",exact:""},messageDetail:{rangeUnderflow:"",rangeOverflow:"",exact:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},tooltipDecrement:"Намаляване",tooltipIncrement:"Увеличаване"},"oj-ojTable":{accessibleColumnContext:"Колона {index}",accessibleColumnFooterContext:"Долен колонтитул на колона {index}",accessibleColumnHeaderContext:"Заглавие на колона {index}",accessibleRowContext:"Ред {index}",accessibleSortable:"{id} с възможност за сортиране",accessibleSortAscending:"{id} сортирани във възходящ ред",accessibleSortDescending:"{id} сортирани в низходящ ред",accessibleStateSelected:"избрано",labelAccSelectionAffordanceTop:"Манипулатор за избор отгоре",labelAccSelectionAffordanceBottom:"Манипулатор за избор отдолу",labelEnableNonContiguousSelection:"Активиране на неграничещ избор",labelDisableNonContiguousSelection:"Деактивиране на неграничещ избор",labelResize:"Преоразмеряване",labelResizePopupSubmit:"ОК",labelResizePopupCancel:"Отказ",labelResizePopupSpinner:"Преоразмеряване на колона",labelSelectRow:"Избор на ред",labelEditRow:"Редактиране на ред",labelSelectAndEditRow:"Избор и редактиране на ред",labelSelectColumn:"Избор на колона",labelSort:"Сортиране",labelSortAsc:"Сортиране във възходящ ред",labelSortDsc:"Сортиране в низходящ ред",msgFetchingData:"Извличане на данни...",msgNoData:"Няма данни за показване.",msgInitializing:"Инициализиране...",msgColumnResizeWidthValidation:"Стойността на ширината трябва да е цяло число.",msgScrollPolicyMaxCountSummary:"Надвишен е максималният брой редове за превъртане в таблицата.",msgScrollPolicyMaxCountDetail:"Презаредете с по-малък набор от данни.",msgStatusSortAscending:"{0} сортирани във възходящ ред.",msgStatusSortDescending:"{0} сортирани в низходящ ред."},"oj-ojTabs":{labelCut:"Изрязване",labelPasteBefore:"Поставяне преди",labelPasteAfter:"Поставяне след",labelRemove:"Премахване",labelReorder:"Пренареждане",removeCueText:"С възможност за премахване"},"oj-ojCheckboxset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:""}},"oj-ojRadioset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:""}},"oj-ojSelect":{required:{hint:"",messageSummary:"",messageDetail:""},searchField:"Поле за търсене",noMatchesFound:"Няма намерени съвпадения",oneMatchesFound:"Намерено е едно съвпадение",moreMatchesFound:"Намерени са {num} съвпадения",filterFurther:"Има налични още резултати, филтрирайте допълнително."},"oj-ojSwitch":{SwitchON:"Вкл.",SwitchOFF:"Изкл."},"oj-ojCombobox":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Няма намерени съвпадения",oneMatchesFound:"Намерено е едно съвпадение",moreMatchesFound:"Намерени са {num} съвпадения",filterFurther:"Има налични още резултати, филтрирайте допълнително."},"oj-ojSelectSingle":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Няма намерени съвпадения",oneMatchFound:"Намерено е едно съвпадение",multipleMatchesFound:"Намерени са {num} съвпадения",nOrMoreMatchesFound:"Намерени са {num} или повече съвпадения",cancel:"Отказ",labelAccOpenDropdown:"разгъване",labelAccClearValue:"изчистване на стойност",noResultsLine1:"Няма намерени резултати",noResultsLine2:"Не можем да намерим нищо, което да съвпада с критериите ви за търсене."},"oj-ojInputSearch":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Няма намерени съвпадения",oneMatchesFound:"Намерено е едно съвпадение",moreMatchesFound:"Намерени са {num} съвпадения"},"oj-ojTree":{stateLoading:"Зареждане...",labelNewNode:"Нов възел",labelMultiSelection:"Повече от един избор",labelEdit:"Редактиране",labelCreate:"Създаване",labelCut:"Изрязване",labelCopy:"Копиране",labelPaste:"Поставяне",labelPasteAfter:"Поставяне след",labelPasteBefore:"Поставяне преди",labelRemove:"Премахване",labelRename:"Преименуване",labelNoData:"Няма данни"},"oj-ojPagingControl":{labelAccPaging:"Страниране",labelAccPageNumber:"Съдържанието на страница {pageNum} е заредено",labelAccNavFirstPage:"Първа страница",labelAccNavLastPage:"Последна страница",labelAccNavNextPage:"Следваща страница",labelAccNavPreviousPage:"Предишна страница",labelAccNavPage:"Страница",labelLoadMore:"Показване на повече...",labelLoadMoreMaxRows:"Максималният лимит от {maxRows} реда е достигнат",labelNavInputPage:"Страница",labelNavInputPageMax:"от {pageMax}",fullMsgItemRange:"{pageFrom} – {pageTo} от {pageMax} елемента",fullMsgItemRangeAtLeast:"{pageFrom} – {pageTo} от поне {pageMax} елемента",fullMsgItemRangeApprox:"{pageFrom} – {pageTo} от приблизително {pageMax} елемента",msgItemRangeNoTotal:"{pageFrom} – {pageTo} елемента",fullMsgItem:"{pageTo} от {pageMax} елемента",fullMsgItemAtLeast:"{pageTo} от поне {pageMax} елемента",fullMsgItemApprox:"{pageTo} от приблизително {pageMax} елемента",msgItemNoTotal:"{pageTo} елемента",msgItemRangeCurrent:"{pageFrom} – {pageTo}",msgItemRangeCurrentSingle:"{pageFrom}",msgItemRangeOf:"от",msgItemRangeOfAtLeast:"от поне",msgItemRangeOfApprox:"от приблизително",msgItemRangeItems:"елемента",tipNavInputPage:"Към страница",tipNavPageLink:"Към страница {pageNum}",tipNavNextPage:"Следваща",tipNavPreviousPage:"Предишна",tipNavFirstPage:"Първа",tipNavLastPage:"Последна",pageInvalid:{summary:"Въведената стойност на страницата е невалидна.",detail:"Въведете стойност, по-голяма от 0."},maxPageLinksInvalid:{summary:"Стойността за maxPageLinks е невалидна.",detail:"Въведете стойност, по-голяма от 4."}},"oj-ojMasonryLayout":{labelCut:"Изрязване",labelPasteBefore:"Поставяне преди",labelPasteAfter:"Поставяне след"},"oj-panel":{labelAccButtonExpand:"Разгъване",labelAccButtonCollapse:"Свиване",labelAccButtonRemove:"Премахване",labelAccFlipForward:"Минаване напред",labelAccFlipBack:"Минаване назад",tipDragToReorder:"Плъзнете за пренареждане",labelAccDragToReorder:"Плъзнете за пренареждане, налично е контекстно меню"},"oj-ojChart":{labelDefaultGroupName:"Група {0}",labelSeries:"Серия",labelGroup:"Група",labelDate:"Дата",labelValue:"Стойност",labelTargetValue:"Цел",labelX:"X",labelY:"Y",labelZ:"Z",labelPercentage:"Процент",labelLow:"Ниско",labelHigh:"Високо",labelOpen:"Отваряне",labelClose:"Затваряне",labelVolume:"Обем",labelQ1:"Q1",labelQ2:"Q2",labelQ3:"Q3",labelMin:"Мин.",labelMax:"Макс.",labelOther:"Друго",tooltipPan:"Отместване",tooltipSelect:"Избор на бягащ ред",tooltipZoom:"Мащабиране на бягащ ред",componentName:"Диаграма"},"oj-dvtBaseGauge":{componentName:"Индикатор"},"oj-ojDiagram":{promotedLink:"{0} връзка",promotedLinks:"{0} връзки",promotedLinkAriaDesc:"Непряко",componentName:"Диаграма"},"oj-ojGantt":{componentName:"Гант",accessibleDurationDays:"{0} дни",accessibleDurationHours:"{0} часа",accessibleTaskInfo:"Началният час е {0}, крайният час е {1}, продължителността е {2}",accessibleMilestoneInfo:"Часът е {0}",accessibleRowInfo:"Ред {0}",accessibleTaskTypeMilestone:"Контролна точка",accessibleTaskTypeSummary:"Обобщение",accessiblePredecessorInfo:"{0} предшественика",accessibleSuccessorInfo:"{0} приемника",accessibleDependencyInfo:"Тип зависимост {0}, свързва {1} с/ъс {2}",startStartDependencyAriaDesc:"от начало до начало",startFinishDependencyAriaDesc:"от начало до край",finishStartDependencyAriaDesc:"от край до начало",finishFinishDependencyAriaDesc:"от край до край",tooltipZoomIn:"Приближаване",tooltipZoomOut:"Отдалечаване",labelLevel:"Ниво",labelRow:"Ред",labelStart:"Начало",labelEnd:"Край",labelDate:"Дата",labelBaselineStart:"Начало на базовата линия",labelBaselineEnd:"Край на базовата линия",labelBaselineDate:"Дата на базовата линия",labelLabel:"Етикет",labelProgress:"Напредък",labelMoveBy:"Преместване с/ъс",labelResizeBy:"Преоразмеряване с/ъс",taskMoveInitiated:"Инициирано е преместване на задача",taskResizeEndInitiated:"Иницииран е край на преоразмеряване на задача",taskResizeStartInitiated:"Инициирано е начало на преоразмеряване на задача",taskMoveSelectionInfo:"Избрани са други {0}",taskResizeSelectionInfo:"Избрани са други {0}",taskMoveInitiatedInstruction:"Използвайте клавишите със стрелки, за да се придвижвате",taskResizeInitiatedInstruction:"Използвайте клавишите със стрелки, за да преоразмерявате",taskMoveFinalized:"Преместването на задачата е завършено",taskResizeFinalized:"Преоразмеряването на задачата е завършено",taskMoveCancelled:"Преместването на задачата е отказано",taskResizeCancelled:"Преоразмеряването на задачата е отказано",taskResizeStartHandle:"Манипулатор за начало на преоразмеряване на задачата",taskResizeEndHandle:"Манипулатор за край на преоразмеряване на задачата"},"oj-ojLegend":{componentName:"Легенда",tooltipExpand:"Разгъване",tooltipCollapse:"Свиване"},"oj-ojNBox":{highlightedCount:"{0}/{1}",labelOther:"Друго",labelGroup:"Група",labelSize:"Размер",labelAdditionalData:"Допълнителни данни",componentName:"Поле {0}"},"oj-ojPictoChart":{componentName:"Диаграма с изображения"},"oj-ojSparkChart":{componentName:"Диаграма"},"oj-ojSunburst":{labelColor:"Цвят",labelSize:"Размер",tooltipExpand:"Разгъване",tooltipCollapse:"Свиване",componentName:"Пръстеновидна с много нива"},"oj-ojTagCloud":{componentName:"Облак от етикети"},"oj-ojThematicMap":{componentName:"Тематична карта",areasRegion:"Области",linksRegion:"Връзки",markersRegion:"Маркери"},"oj-ojTimeAxis":{componentName:"Времева ос"},"oj-ojTimeline":{componentName:"Времева линия",accessibleItemDesc:"Описанието е {0}.",accessibleItemEnd:"Крайният час е {0}.",accessibleItemStart:"Началният час е {0}.",accessibleItemTitle:"Заглавието е {0}.",labelSeries:"Серия",tooltipZoomIn:"Приближаване",tooltipZoomOut:"Отдалечаване",labelStart:"Начало",labelEnd:"Край",labelDate:"Дата",labelTitle:"Заглавие",labelDescription:"Описание"},"oj-ojTreemap":{labelColor:"Цвят",labelSize:"Размер",tooltipIsolate:"Изолиране",tooltipRestore:"Възстановяване",componentName:"Йерархична структура"},"oj-dvtBaseComponent":{labelScalingSuffixThousand:"Хиляда/и",labelScalingSuffixMillion:"Милион/а",labelScalingSuffixBillion:"Милиард/а",labelScalingSuffixTrillion:"Трилион/а",labelScalingSuffixQuadrillion:"Квадрилион/а",labelInvalidData:"Невалидни данни",labelNoData:"Няма данни за показване",labelClearSelection:"Изчистване на избора",labelDataVisualization:"Визуализация на данни",stateSelected:"Избрано",stateUnselected:"Неизбрано",stateMaximized:"Увеличено",stateMinimized:"Намалено",stateExpanded:"Разгънато",stateCollapsed:"Свито",stateIsolated:"Изолирано",stateHidden:"Скрито",stateVisible:"Видимо",stateDrillable:"С възможност за детайлизация",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} от {1}"},"oj-ojNavigationList":{defaultRootLabel:"Навигационен списък",hierMenuBtnLabel:"Бутон на йерархично меню",selectedLabel:"избрано",previousIcon:"Предишно",msgFetchingData:"Извличане на данни...",msgNoData:"Няма елементи за показване.",overflowItemLabel:"Още",accessibleReorderTouchInstructionText:"Натиснете два пъти и задръжте. Изчакайте звука, след което плъзнете, за да пренаредите.",accessibleReorderBeforeItem:"Преди {item}",accessibleReorderAfterItem:"След {item}",labelCut:"Изрязване",labelPasteBefore:"Поставяне преди",labelPasteAfter:"Поставяне след",labelRemove:"Премахване",removeCueText:"С възможност за премахване"},"oj-ojSlider":{noValue:"ojSlider няма стойност",maxMin:"Макс. не трябва да е по-малък или равен на мин.",startEnd:"value.start не трябва да е по-голяма от value.end",valueRange:"Стойността трябва да е в рамките на диапазона от мин. до макс.",optionNum:"Опцията {option} не е число",invalidStep:"Невалидна стъпка; стъпката трябва да е > 0",lowerValueThumb:"миниатюра с по-ниска стойност",higherValueThumb:"миниатюра с по-висока стойност"},"oj-ojDialog":{labelCloseIcon:"Затваряне"},"oj-ojPopup":{ariaLiveRegionInitialFocusFirstFocusable:"Влизане в изскачащия прозорец. Натиснете F6, за да навигирате между изскачащия прозорец и свързания елемент за управление.",ariaLiveRegionInitialFocusNone:"Изскачащият прозорец е отворен. Натиснете F6, за да навигирате между изскачащия прозорец и свързания елемент за управление.",ariaLiveRegionInitialFocusFirstFocusableTouch:"Влизане в изскачащия прозорец. Изскачащият прозорец може да бъде затворен чрез навигиране до последната връзка в него.",ariaLiveRegionInitialFocusNoneTouch:"Изскачащият прозорец е отворен. Навигирайте до следващата връзка, за да установите фокус в изскачащия прозорец.",ariaFocusSkipLink:"Натиснете два пъти, за да навигирате до отворения изскачащ прозорец.",ariaCloseSkipLink:"Натиснете два пъти, за да затворите отворения изскачащ прозорец."},"oj-ojRefresher":{ariaRefreshLink:"Активирайте връзката, за да опресните съдържанието",ariaRefreshingLink:"Опресняване на съдържанието",ariaRefreshCompleteLink:"Опресняването е завършено"},"oj-ojSwipeActions":{ariaShowStartActionsDescription:"Показване на действия за начало",ariaShowEndActionsDescription:"Показване на действия за край",ariaHideActionsDescription:"Скриване на действия"},"oj-ojIndexer":{indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",indexerOthers:"#",ariaDisabledLabel:"Няма съвпадащо заглавие на група",ariaOthersLabel:"номер",ariaInBetweenText:"Между {first} и {second}",ariaKeyboardInstructionText:"Натиснете Enter, за да изберете стойност.",ariaTouchInstructionText:"Натиснете два пъти и задръжте, за да влезете в режима с жестове, след което плъзнете нагоре или надолу, за да коригирате стойността."},"oj-ojMenu":{labelCancel:"Отказ",ariaFocusSkipLink:"Фокусът е в менюто, натиснете два пъти или плъзнете, за да преместите фокуса към първия елемент от менюто."},"oj-ojColorSpectrum":{labelHue:"Нюанс",labelOpacity:"Непрозрачност",labelSatLum:"Наситеност/осветеност",labelThumbDesc:"Четирипосочен плъзгач за цветовия спектър."},"oj-ojColorPalette":{labelNone:"Няма"},"oj-ojColorPicker":{labelSwatches:"Мостри",labelCustomColors:"Персонализирани цветове",labelPrevColor:"Предишен цвят",labelDefColor:"Цвят по подразбиране",labelDelete:"Изтриване",labelDeleteQ:"Изтриване?",labelAdd:"Добавяне",labelAddColor:"Добавяне на цвят",labelMenuHex:"HEX",labelMenuRgba:"RGBa",labelMenuHsla:"HSLa",labelSliderHue:"Нюанс",labelSliderSaturation:"Наситеност",labelSliderSat:"Насит.",labelSliderLightness:"Светлота",labelSliderLum:"Осветеност",labelSliderAlpha:"Прозрачност",labelOpacity:"Непрозрачност",labelSliderRed:"Червено",labelSliderGreen:"Зелено",labelSliderBlue:"Синьо"},"oj-ojFilePicker":{dropzoneText:"Пуснете файловете тук или щракнете, за да ги качите",singleFileUploadError:"Качвайте по един файл наведнъж.",singleFileTypeUploadError:"Не можете да качвате файлове от тип {fileType}.",multipleFileTypeUploadError:"Не можете да качвате файлове от тип: {fileTypes}.",dropzonePrimaryText:"Плъзгане и пускане",secondaryDropzoneText:"Изберете файл или го пуснете тук.",secondaryDropzoneTextMultiple:"Изберете или пуснете файлове тук.",unknownFileType:"неизвестен"},"oj-ojProgressbar":{ariaIndeterminateProgressText:"В процес на изпълнение"},"oj-ojMessage":{labelCloseIcon:"Затваряне",categories:{error:"Грешка",warning:"Предупреждение",info:"Информация",confirmation:"Потвърждение"}},"oj-ojSelector":{checkboxAriaLabel:"Квадратче за избор на {rowKey}"},"oj-ojMessages":{labelLandmark:"Съобщения",ariaLiveRegion:{navigationFromKeyboard:"Влизане в областта за съобщения. Натиснете F6, за да се върнете обратно към предишния фокусиран елемент.",navigationToTouch:"В областта за съобщения има нови съобщения. Използвайте ротора с дикторски текст, за да навигирате до района за съобщения.",navigationToKeyboard:"В областта за съобщения има нови съобщения. Натиснете F6, за да навигирате до областта за най-скорошно съобщение.",newMessage:"Категория на съобщение {category}. {summary}. {detail}."}},"oj-ojConveyorBelt":{tipArrowNext:"Напред",tipArrowPrevious:"Назад"}});