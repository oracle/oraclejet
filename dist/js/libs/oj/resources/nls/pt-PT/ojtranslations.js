define({"oj-message":{fatal:"Fatal",error:"Erro",warning:"Aviso",info:"Informações",confirmation:"Confirmação","compact-type-summary":"{0}: {1}"},"oj-converter":{summary:"O valor não está no formato esperado.",detail:"Introduza um valor no formato esperado.","plural-separator":", ",hint:{summary:"Exemplo: {exampleValue}",detail:"Introduza um valor neste formato: '{exampleValue}'.","detail-plural":"Introduza um valor nestes formatos: '{exampleValue}'."},optionHint:{detail:"Um valor aceite para a opção '{propertyName}' é '{propertyValueValid}'.","detail-plural":"Os valores aceites para a opção '{propertyName}' são '{propertyValueValid}'."},optionTypesMismatch:{summary:"É obrigatório um valor para a opção '{requiredPropertyName}' quando a opção '{propertyName}' está definida como '{propertyValue}'."},optionTypeInvalid:{summary:"Não foi fornecido um valor do tipo esperado para a opção '{propertyName}'."},optionOutOfRange:{summary:"O valor {propertyValue} está fora do intervalo para a opção '{propertyName}'."},optionValueInvalid:{summary:"Foi especificado um valor inválido '{propertyValue}' para a opção '{propertyName}'."},number:{decimalFormatMismatch:{summary:"O valor fornecido não está no formato de número esperado."},shortLongUnsupportedParse:{summary:"'short' e 'long' não são suportados para a análise do conversor.",detail:"Altere o componente para readonly. Os campos readonly não chamam a função de análise do conversor."},currencyFormatMismatch:{summary:"O valor fornecido não está no formato de moeda esperado."},percentFormatMismatch:{summary:"O valor fornecido não está no formato de percentagem esperado."},invalidNumberFormat:{summary:"O valor fornecido não é um número válido.",detail:"Forneça um número válido."}},color:{invalidFormat:{summary:"Formato de cor inválido.",detail:"Especificação de opção de formato de cor inválido."},invalidSyntax:{summary:"Especificação de cor inválida.",detail:"Introduza um valor de cor que esteja em conformidade com o standard CSS3."}},datetime:{datetimeOutOfRange:{summary:"O valor '{value}' está fora do intervalo para '{propertyName}'.",detail:"Introduza um valor entre '{minValue}' e '{maxValue}'.",hour:"hora",minute:"minuto",second:"segundo",millisec:"milésimo de segundo",month:"mês",day:"dia",year:"ano","month name":"nome do mês",weekday:"dia da semana"},dateFormatMismatch:{summary:"O valor fornecido não está no formato de data esperado."},invalidTimeZoneID:{summary:"Foi fornecida a ID de fuso horário {timeZoneID}."},nonExistingTime:{summary:"A hora de entrada de dados não existe porque coincide com a transição para a hora de verão."},missingTimeZoneData:{summary:"Dados do Fuso Horário em falta. Chame o elemento 'ojs/ojtimezonedata' obrigatório, de forma a carregar os dados do Fuso Horário."},timeFormatMismatch:{summary:"O valor fornecido não está no formato de hora esperado."},datetimeFormatMismatch:{summary:"O valor fornecido não está no formato de data e hora esperado."},dateToWeekdayMismatch:{summary:"O dia '{date}' não se situa num(a) '{weekday}'.",detail:"Introduza um dia da semana que corresponda à data."},invalidISOString:{invalidRangeSummary:"O valor '{value}' está fora do intervalo para o campo '{propertyName}' na cadeia de caracteres ISO 8601 '{isoStr}'.",summary:"O '{isoStr}' fornecido não é uma cadeia de caracteres ISO 8601 válida.",detail:"Forneça uma cadeia de caracteres ISO 8601 válida."}}},"oj-validator":{length:{hint:{min:"Introduza {min} ou mais caracteres.",max:"Introduza {max} ou menos caracteres.",inRange:"Introduza {min} a {max} caracteres.",exact:"Introduza {length} caracteres."},messageDetail:{tooShort:"Introduza {min} ou mais caracteres.",tooLong:"Introduza um máximo de {max} caracteres."},messageSummary:{tooShort:"Não existem caracteres suficientes.",tooLong:"Existem demasiados caracteres."}},range:{number:{hint:{min:"Introduza um número maior que ou igual a {min}.",max:"Introduza um número menor que ou igual a {max}.",inRange:"Introduza um número entre {min} e {max}.",exact:"Introduza o número {num}."},messageDetail:{rangeUnderflow:"Introduza {min} ou um número maior.",rangeOverflow:"Introduza {max} ou um número menor.",exact:"Introduza o número {num}."},messageSummary:{rangeUnderflow:"O número é demasiado baixo.",rangeOverflow:"O número é demasiado alto."}},datetime:{hint:{min:"Introduza uma data e hora que se situem em ou depois de {min}.",max:"Introduza uma data e hora que se situem em ou antes de {max}.",inRange:"Introduza uma data e hora entre {min} e {max}."},messageDetail:{rangeUnderflow:"Introduza uma data igual ou posterior a {min}.",rangeOverflow:"Introduza uma data igual ou anterior a {max}."},messageSummary:{rangeUnderflow:"A data e hora são anteriores às data e hora mínimas.",rangeOverflow:"A data e hora são posteriores às data e hora máximas."}},date:{hint:{min:"Introduza uma data igual ou posterior a {min}.",max:"Introduza uma data igual ou anterior a {max}.",inRange:"Introduza uma data entre {min} e {max}."},messageDetail:{rangeUnderflow:"Introduza uma data igual ou posterior a {min}.",rangeOverflow:"Introduza uma data igual ou anterior a {max}."},messageSummary:{rangeUnderflow:"A data é anterior à data mínima.",rangeOverflow:"A data é posterior à data máxima."}},time:{hint:{min:"Introduza uma hora igual ou posterior a {min}.",max:"Introduza uma hora igual ou anterior a {max}.",inRange:"Introduza uma hora entre {min} e {max}."},messageDetail:{rangeUnderflow:"Introduza uma hora em ou posterior a {min}.",rangeOverflow:"Introduza uma hora em ou anterior a {max}."},messageSummary:{rangeUnderflow:"A hora é anterior à hora mínima.",rangeOverflow:"A hora é posterior à hora máxima."}}},restriction:{date:{messageSummary:"A data {value} é de uma entrada desativada.",messageDetail:"A data que selecionou não está disponível. Tente outra data."}},regExp:{summary:"O formato está incorreto.",detail:"Introduza os valores permissíveis descritos nesta expressão regular: '{pattern}'."},required:{summary:"O valor é obrigatório.",detail:"Introduza um valor."}},"oj-ojEditableValue":{loading:"A carregar...",requiredText:"Obrigatório",helpSourceText:"Mais informações..."},"oj-ojInputDate":{done:"Concluído",cancel:"Cancelar",time:"Hora",prevText:"Anterior",nextText:"Seguinte",currentText:"Hoje",weekHeader:"Semana",tooltipCalendar:"Selecione a Data.",tooltipCalendarTime:"Selecionar Data e Hora.",tooltipCalendarDisabled:"Selecionar Data Desativado.",tooltipCalendarTimeDisabled:"Selecionar Data e Hora\n Desativado.",picker:"Seletor",weekText:"Semana",datePicker:"Seletor de Datas",inputHelp:"Prima a tecla de seta para baixo ou para cima para ter acesso ao Calendário.",inputHelpBoth:"Prima a tecla de seta para baixo ou para cima para ter acesso ao Calendário e Shift + Seta para baixo ou Shift + Seta para cima para ter acesso à lista pendente de horas.",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},dateRestriction:{hint:"",messageSummary:"",messageDetail:""}},"oj-ojInputTime":{cancelText:"Cancelar",okText:"OK",currentTimeText:"Agora",hourWheelLabel:"Hora",minuteWheelLabel:"Minuto",ampmWheelLabel:"AM/PM",tooltipTime:"Selecionar Hora.",tooltipTimeDisabled:"Selecionar Hora Desativado.",inputHelp:"Prima a tecla de seta para baixo ou para cima para ter acesso à lista pendente de horas.",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}}},"oj-inputBase":{required:{hint:"",messageSummary:"",messageDetail:""},regexp:{messageSummary:"",messageDetail:""},accessibleMaxLengthExceeded:"Comprimento máximo {len} excedido.",accessibleMaxLengthRemaining:"{chars} caracteres em falta."},"oj-ojInputText":{accessibleClearIcon:"Limpar"},"oj-ojInputPassword":{regexp:{messageDetail:"É necessário que o valor corresponda a este padrão: '{pattern}'."},accessibleShowPassword:"Mostrar senha.",accessibleHidePassword:"Ocultar senha."},"oj-ojFilmStrip":{labelAccFilmStrip:"A apresentar a página {pageIndex} de {pageCount}",labelAccArrowNextPage:"Selecionar Seguinte para apresentar a página seguinte",labelAccArrowPreviousPage:"Selecionar Anterior para apresentar a página anterior",tipArrowNextPage:"Seguinte",tipArrowPreviousPage:"Anterior"},"oj-ojDataGrid":{accessibleSortAscending:"{id} ordenado por ordem crescente",accessibleSortDescending:"{id} ordenado por ordem decrescente",accessibleSortable:"{id} ordenável",accessibleActionableMode:"Entrar no modo passível de ação.",accessibleNavigationMode:"Entre no modo de navegação, prima F2 para entrar no modo de edição ou no modo passível de ação.",accessibleEditableMode:"Entre no modo de edição, prima Escape para navegar para fora da grelha de dados.",accessibleSummaryExact:"Grelha de dados com {rownum} linhas e {colnum} colunas",accessibleSummaryEstimate:"Grelha de dados com um número desconhecido de linhas e colunas",accessibleSummaryExpanded:"Atualmente, existem {num} linhas expandidas",accessibleRowExpanded:"Linha expandida",accessibleExpanded:"Expandido",accessibleRowCollapsed:"Linha contraída",accessibleCollapsed:"Contraído",accessibleRowSelected:"Linha {row} selecionada",accessibleColumnSelected:"Coluna {column} selecionada",accessibleStateSelected:"selecionado",accessibleMultiCellSelected:"{num} células selecionadas",accessibleColumnSpanContext:"{extent} largo",accessibleRowSpanContext:"{extent} alto",accessibleRowContext:"Linha {index}",accessibleColumnContext:"Coluna {index}",accessibleRowHeaderContext:"Cabeçalho da Linha {index}",accessibleColumnHeaderContext:"Cabeçalho da Coluna {index}",accessibleRowEndHeaderContext:"Cabeçalho Final da Linha {index}",accessibleColumnEndHeaderContext:"Cabeçalho Final da Coluna {index}",accessibleRowHeaderLabelContext:"Etiqueta do Cabeçalho da Linha {level}",accessibleColumnHeaderLabelContext:"Etiqueta do Cabeçalho da Coluna {level}",accessibleRowEndHeaderLabelContext:"Etiqueta do Cabeçalho Final da Linha {level}",accessibleColumnEndHeaderLabelContext:"Etiqueta do Cabeçalho Final da Coluna {level}",accessibleLevelContext:"Nível {level}",accessibleRangeSelectModeOn:"Modo de adição do intervalo de células selecionado ativado.",accessibleRangeSelectModeOff:"Modo de adição do intervalo de células selecionado desativado.",accessibleFirstRow:"Foi atingida a primeira linha.",accessibleLastRow:"Foi atingida a última linha.",accessibleFirstColumn:"Foi atingida a primeira coluna",accessibleLastColumn:"Foi atingida a última coluna.",accessibleSelectionAffordanceTop:"Alça de seleção superior.",accessibleSelectionAffordanceBottom:"Alça de seleção inferior.",accessibleLevelHierarchicalContext:"Nível {level}",accessibleRowHierarchicalFull:"Linha {posInSet} de {setSize} linhas",accessibleRowHierarchicalPartial:"Linha {posInSet} de um mínimo de {setSize} linhas",accessibleRowHierarchicalUnknown:"Pelo menos, a linha {posInSet} de um mínimo de {setSize} linhas",accessibleColumnHierarchicalFull:"Coluna {posInSet} de {setSize} colunas",accessibleColumnHierarchicalPartial:"Coluna {posInSet} de um mínimo de {setSize} colunas",accessibleColumnHierarchicalUnknown:"Pelo menos, a coluna {posInSet} de um mínimo de {setSize} colunas",msgFetchingData:"A Extrair Dados...",msgNoData:"Não existem itens para apresentação.",labelResize:"Redimensionar",labelResizeWidth:"Redimensionar Largura",labelResizeHeight:"Redimensionar Altura",labelSortAsc:"Ordem Crescente",labelSortDsc:"Ordem Decrescente",labelSortRow:"Ordenar Linha",labelSortRowAsc:"Ordem Crescente da Linha",labelSortRowDsc:"Ordem Decrescente da Linha",labelSortCol:"Ordenar Coluna",labelSortColAsc:"Ordem Crescente da Coluna",labelSortColDsc:"Ordem Decrescente da Coluna",labelCut:"Cortar",labelPaste:"Colar",labelCutCells:"Cortar",labelPasteCells:"Colar",labelCopyCells:"Copiar",labelAutoFill:"Preenchimento Automático",labelEnableNonContiguous:"Ativar Seleção Não Contígua",labelDisableNonContiguous:"Desativar Seleção Não Contígua",labelResizeDialogSubmit:"OK",labelResizeDialogCancel:"Cancelar",accessibleContainsControls:"Contém Controlos",labelSelectMultiple:"Selecionar Vários",labelResizeDialogApply:"Aplicar",labelResizeFitToContent:"Redimensionar para Ajustar",columnWidth:"Largura em Pixels",rowHeight:"Altura em Píxeis",labelResizeColumn:"Redimensionar Coluna",labelResizeRow:"Redimensionar Linha",resizeColumnDialog:"Redimensionar coluna",resizeRowDialog:"Redimensionar linha",collapsedText:"Contrair",expandedText:"Expandir",tooltipRequired:"Obrigatório"},"oj-ojRowExpander":{accessibleLevelDescription:"Nível {level}",accessibleRowDescription:"Nível {level}, Linha {num} de {total}",accessibleRowExpanded:"Linha expandida",accessibleRowCollapsed:"Linha contraída",accessibleStateExpanded:"expandido",accessibleStateCollapsed:"contraído"},"oj-ojStreamList":{msgFetchingData:"A Extrair Dados..."},"oj-ojListView":{msgFetchingData:"A Extrair Dados...",msgNoData:"Não existem itens para apresentação.",msgItemsAppended:"{count} itens anexados à parte final.",msgFetchCompleted:"Todos os itens foram extraídos.",indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",accessibleExpandCollapseInstructionText:"Utilize as teclas de seta para expandir e contrair.",accessibleGroupExpand:"Expandido",accessibleGroupCollapse:"Contraído",accessibleReorderTouchInstructionText:"Toque duas vezes e mantenha premido. Aguarde pelo som e, em seguida, arraste para voltar a dispor.",accessibleReorderBeforeItem:"Antes de {item}",accessibleReorderAfterItem:"Depois de {item}",accessibleReorderInsideItem:"Em {item}",accessibleNavigateSkipItems:"A ignorar {numSkip} itens",labelCut:"Cortar",labelCopy:"Copiar",labelPaste:"Colar",labelPasteBefore:"Colar Antes de",labelPasteAfter:"Colar Depois de"},"oj-ojWaterfallLayout":{msgFetchingData:"A Extrair Dados..."},"oj-_ojLabel":{tooltipHelp:"Auxílio",tooltipRequired:"Obrigatório"},"oj-ojLabel":{tooltipHelp:"Auxílio",tooltipRequired:"Obrigatório"},"oj-ojInputNumber":{required:{hint:"",messageSummary:"",messageDetail:""},numberRange:{hint:{min:"",max:"",inRange:"",exact:""},messageDetail:{rangeUnderflow:"",rangeOverflow:"",exact:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},tooltipDecrement:"Diminuir",tooltipIncrement:"Incrementar"},"oj-ojTable":{accessibleAddRow:"Introduza dados para acrescentar uma nova linha.",accessibleColumnContext:"Coluna {index}",accessibleColumnFooterContext:"Nota de Rodapé da Coluna {index}",accessibleColumnHeaderContext:"Cabeçalho da Coluna {index}",accessibleContainsControls:"Contém Controlos",accessibleColumnsSpan:"Abrange {count} Colunas",accessibleRowContext:"Linha {index}",accessibleSortable:"{id} ordenável",accessibleSortAscending:"{id} ordenado por ordem crescente",accessibleSortDescending:"{id} ordenado por ordem decrescente",accessibleStateSelected:"selecionado",accessibleStateUnselected:"não selecionado",accessibleSummaryEstimate:"Tabela com {colnum} colunas e mais de {rownum} linhas",accessibleSummaryExact:"Tabela com {colnum} colunas e linhas {rownum}",labelAccSelectionAffordanceTop:"Alça de seleção superior",labelAccSelectionAffordanceBottom:"Alça de seleção inferior",labelEnableNonContiguousSelection:"Ativar Seleção Não Contígua",labelDisableNonContiguousSelection:"Desativar Seleção Não Contígua",labelResize:"Redimensionar",labelResizeColumn:"Redimensionar Coluna",labelResizePopupSubmit:"OK",labelResizePopupCancel:"Cancelar",labelResizePopupSpinner:"Redimensionar Coluna",labelResizeColumnDialog:"Redimensionar coluna",labelColumnWidth:"Largura em Pixels",labelResizeDialogApply:"Aplicar",labelSelectRow:"Selecionar Linha",labelSelectAllRows:"Selecionar Todas as Linhas",labelEditRow:"Editar Linha",labelSelectAndEditRow:"Selecionar e Editar Linha",labelSelectColumn:"Selecionar Coluna",labelSort:"Ordenar",labelSortAsc:"Ordem Crescente",labelSortDsc:"Ordem Decrescente",msgFetchingData:"A Extrair Dados...",msgNoData:"Não existem dados para apresentação.",msgInitializing:"A inicializar...",msgColumnResizeWidthValidation:"O valor da largura deve ser um número inteiro.",msgScrollPolicyMaxCountSummary:"Número máximo de linhas excedido para deslocação na tabela.",msgScrollPolicyMaxCountDetail:"Repita o carregamento com um conjunto de dados mais pequeno.",msgStatusSortAscending:"{0} ordenado por ordem crescente.",msgStatusSortDescending:"{0} ordenado por ordem decrescente.",tooltipRequired:"Obrigatório"},"oj-ojTabs":{labelCut:"Cortar",labelPasteBefore:"Colar Antes de",labelPasteAfter:"Colar Depois de",labelRemove:"Retirar",labelReorder:"Reordenar",removeCueText:"Retirável"},"oj-ojCheckboxset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:"Selecione um valor."}},"oj-ojRadioset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:"Selecione um valor."}},"oj-ojSelect":{required:{hint:"",messageSummary:"",messageDetail:"Selecione um valor."},searchField:"Campo de pesquisa",noMatchesFound:"Não foram encontradas correspondências",noMoreResults:"Não existem mais resultados",oneMatchesFound:"Foi encontrada uma correspondência",moreMatchesFound:"{num} correspondências encontradas",filterFurther:"Mais resultados disponíveis, filtre mais."},"oj-ojSwitch":{SwitchON:"Ativado",SwitchOFF:"Desativado"},"oj-ojCombobox":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Não foram encontradas correspondências",noMoreResults:"Não existem mais resultados",oneMatchesFound:"Foi encontrada uma correspondência",moreMatchesFound:"{num} correspondências encontradas",filterFurther:"Mais resultados disponíveis, filtre mais."},"oj-ojSelectSingle":{required:{hint:"",messageSummary:"",messageDetail:"Selecione um valor."},noMatchesFound:"Não foram encontradas correspondências",oneMatchFound:"Foi encontrada uma correspondência",multipleMatchesFound:"{num} correspondências encontradas",nOrMoreMatchesFound:"{num} ou mais correspondências encontradas",cancel:"Cancelar",labelAccOpenDropdown:"expandir",labelAccClearValue:"limpar valor",noResultsLine1:"Não foram encontrados resultados",noResultsLine2:"Não foi possível encontrar correspondências com a sua pesquisa."},"oj-ojInputSearch2":{cancel:"Cancelar",noSuggestionsFound:"Nenhuma sugestão encontrada"},"oj-ojInputSearch":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Não foram encontradas correspondências",oneMatchesFound:"Foi encontrada uma correspondência",moreMatchesFound:"{num} correspondências encontradas"},"oj-ojTreeView":{treeViewSelectorAria:"Seletor do TreeView {rowKey}",retrievingDataAria:"A obter dados para o nó: {nodeText}",receivedDataAria:"Dados recebidos para o nó: {nodeText}"},"oj-ojTree":{stateLoading:"A carregar...",labelNewNode:"Novo Nó",labelMultiSelection:"Seleção Múltipla",labelEdit:"Editar",labelCreate:"Criar",labelCut:"Cortar",labelCopy:"Copiar",labelPaste:"Colar",labelPasteAfter:"Colar Depois de",labelPasteBefore:"Colar Antes de",labelRemove:"Retirar",labelRename:"Renomear",labelNoData:"Não existem dados"},"oj-ojPagingControl":{labelAccPaging:"Paginação",labelAccPageNumber:"Conteúdo da página {pageNum} carregado",labelAccNavFirstPage:"Primeira Página",labelAccNavLastPage:"Última Página",labelAccNavNextPage:"Página Seguinte",labelAccNavPreviousPage:"Página Anterior",labelAccNavPage:"Página",labelLoadMore:"Mostrar Mais...",labelLoadMoreMaxRows:"Foi Atingido o Limite Máximo de {maxRows} linhas",labelNavInputPage:"Página",labelNavInputPageMax:"de {pageMax}",fullMsgItemRange:"{pageFrom}-{pageTo} de {pageMax} itens",fullMsgItemRangeAtLeast:"{pageFrom}-{pageTo} de pelo menos {pageMax} itens",fullMsgItemRangeApprox:"{pageFrom}-{pageTo} de aproximadamente {pageMax} itens",msgItemRangeNoTotal:"{pageFrom}-{pageTo} itens",fullMsgItem:"{pageTo} de {pageMax} itens",fullMsgItemAtLeast:"{pageTo} de pelo menos {pageMax} itens",fullMsgItemApprox:"{pageTo} de aproximadamente {pageMax} itens",msgItemNoTotal:"{pageTo} itens",msgItemRangeCurrent:"{pageFrom}-{pageTo}",msgItemRangeCurrentSingle:"{pageFrom}",msgItemRangeOf:"de",msgItemRangeOfAtLeast:"de pelo menos",msgItemRangeOfApprox:"de aproximadamente",msgItemRangeItems:"itens",tipNavInputPage:"Ir para a Página",tipNavPageLink:"Ir para a Página {pageNum}",tipNavNextPage:"Seguinte",tipNavPreviousPage:"Anterior",tipNavFirstPage:"Primeira",tipNavLastPage:"Última",pageInvalid:{summary:"O valor da página introduzido é inválido.",detail:"Introduza um valor maior que 0."},maxPageLinksInvalid:{summary:"O valor de maxPageLinks é inválido.",detail:"Introduza um valor maior que 4."}},"oj-ojMasonryLayout":{labelCut:"Cortar",labelPasteBefore:"Colar Antes de",labelPasteAfter:"Colar Depois de"},"oj-panel":{labelAccButtonExpand:"Expandir",labelAccButtonCollapse:"Contrair",labelAccButtonRemove:"Retirar",labelAccFlipForward:"Inverter para a frente",labelAccFlipBack:"Inverter para trás",tipDragToReorder:"Arrastar para reordenar",labelAccDragToReorder:"Arraste para reordenar. Menu de contexto disponível"},"oj-ojChart":{labelDefaultGroupName:"Grupo {0}",labelSeries:"Série",labelGroup:"Grupo",labelDate:"Data",labelValue:"Valor",labelTargetValue:"Destino",labelX:"X",labelY:"Y",labelZ:"Z",labelPercentage:"Percentagem",labelLow:"Mínimo",labelHigh:"Máximo",labelOpen:"Abertura",labelClose:"Fecho",labelVolume:"Volume",labelQ1:"Q1",labelQ2:"Q2",labelQ3:"Q3",labelMin:"Mín.",labelMax:"Máx.",labelOther:"Outros",tooltipPan:"Deslocamento",tooltipSelect:"Seleção através de retângulo",tooltipZoom:"Zoom através de retângulo",componentName:"Gráfico"},"oj-dvtBaseGauge":{componentName:"Manómetro"},"oj-ojDiagram":{promotedLink:"{0} ligação",promotedLinks:"{0} ligações",promotedLinkAriaDesc:"Indireto",componentName:"Diagrama"},"oj-ojGantt":{componentName:"Gantt",accessibleDurationDays:"{0} dias",accessibleDurationHours:"{0} horas",accessibleTaskInfo:"A hora de início é {0}, a hora de fim é {1}, a duração é {2}",accessibleMilestoneInfo:"A hora é {0}",accessibleRowInfo:"Linha {0}",accessibleTaskTypeMilestone:"Ponto-chave",accessibleTaskTypeSummary:"Resumo",accessiblePredecessorInfo:"{0} antecessores",accessibleSuccessorInfo:"{0} sucessores",accessibleDependencyInfo:"Tipo de dependência {0}, liga {1} a {2}",startStartDependencyAriaDesc:"do início ao início",startFinishDependencyAriaDesc:"do início ao fim",finishStartDependencyAriaDesc:"do fim ao início",finishFinishDependencyAriaDesc:"do fim ao fim",tooltipZoomIn:"Aproximar",tooltipZoomOut:"Afastar",labelLevel:"Nível",labelRow:"Linha",labelStart:"Início",labelEnd:"Fim",labelDate:"Data",labelBaselineStart:"Início da Linha de Base",labelBaselineEnd:"Fim da Linha de Base",labelBaselineDate:"Data da Linha de Base",labelDowntimeStart:"Início de Inatividade",labelDowntimeEnd:"Fim de Inatividade",labelOvertimeStart:"Início de Horas Extraordinárias",labelOvertimeEnd:"Fim de Horas Extraordinárias",labelAttribute:"Atributo",labelLabel:"Etiqueta",labelProgress:"Progresso",labelMoveBy:"Deslocar por",labelResizeBy:"Redimensionar Por",taskMoveInitiated:"Deslocação da tarefa iniciada",taskResizeEndInitiated:"Fim do redimensionamento da tarefa iniciado",taskResizeStartInitiated:"Início do redimensionamento da tarefa iniciado",taskMoveSelectionInfo:"outras {0} seleções",taskResizeSelectionInfo:"outras {0} seleções",taskMoveInitiatedInstruction:"Utilize as teclas de seta para se deslocar",taskResizeInitiatedInstruction:"Utilize as teclas de seta para redimensionar",taskMoveFinalized:"Deslocação da tarefa finalizada",taskResizeFinalized:"Redimensionamento da tarefa finalizado",taskMoveCancelled:"Deslocação da tarefa cancelada",taskResizeCancelled:"Redimensionamento da tarefa cancelado",taskResizeStartHandle:"Processamento do início de redimensionamento da tarefa",taskResizeEndHandle:"Processamento do fim de redimensionamento da tarefa"},"oj-ojLegend":{componentName:"Legenda",tooltipExpand:"Expandir",tooltipCollapse:"Contrair"},"oj-ojNBox":{highlightedCount:"{0}/{1}",labelOther:"Outros",labelGroup:"Grupo",labelSize:"Tamanho",labelAdditionalData:"Dados Adicionais",componentName:"Caixa {0}"},"oj-ojPictoChart":{componentName:"Gráfico de Imagens"},"oj-ojSparkChart":{componentName:"Gráfico"},"oj-ojSunburst":{labelColor:"Cor",labelSize:"Tamanho",tooltipExpand:"Expandir",tooltipCollapse:"Contrair",componentName:"Formato Radial"},"oj-ojTagCloud":{componentName:"Cloud de Identificadores"},"oj-ojThematicMap":{componentName:"Mapa Temático",areasRegion:"Áreas",linksRegion:"Ligações",markersRegion:"Marcadores"},"oj-ojTimeAxis":{componentName:"Eixo Temporal"},"oj-ojTimeline":{componentName:"Linha de Tempo",accessibleItemDesc:"A descrição é {0}.",accessibleItemEnd:"A hora de fim é {0}.",accessibleItemStart:"A hora de início é {0}.",accessibleItemTitle:"O título é {0}.",labelSeries:"Série",tooltipZoomIn:"Aproximar",tooltipZoomOut:"Afastar",labelStart:"Início",labelEnd:"Fim",labelAccNavNextPage:"Página Seguinte",labelAccNavPreviousPage:"Página Anterior",tipArrowNextPage:"Seguinte",tipArrowPreviousPage:"Anterior",navArrowDisabledState:"Desativado",labelDate:"Data",labelTitle:"Título",labelDescription:"Descrição",labelMoveBy:"Deslocar por",labelResizeBy:"Redimensionar Por",itemMoveInitiated:"Deslocação do item iniciada",itemResizeEndInitiated:"Fim do redimensionamento do item iniciado",itemResizeStartInitiated:"Início do redimensionamento do item iniciado",itemMoveSelectionInfo:"outras {0} seleções",itemResizeSelectionInfo:"outras {0} seleções",itemMoveInitiatedInstruction:"Utilize as teclas de seta para se deslocar",itemResizeInitiatedInstruction:"Utilize as teclas de seta para redimensionar",itemMoveFinalized:"Deslocação do item finalizada",itemResizeFinalized:"Redimensionamento do item finalizado",itemMoveCancelled:"Deslocação do item cancelada",itemResizeCancelled:"Redimensionamento do item cancelado",itemResizeStartHandle:"Processamento do início de redimensionamento do item",itemResizeEndHandle:"Processamento do fim de redimensionamento do item"},"oj-ojTreemap":{labelColor:"Cor",labelSize:"Tamanho",tooltipIsolate:"Isolar",tooltipRestore:"Repor",componentName:"Mapa da Árvore"},"oj-dvtBaseComponent":{labelScalingSuffixThousand:"K",labelScalingSuffixMillion:"M",labelScalingSuffixBillion:"Md",labelScalingSuffixTrillion:"B",labelScalingSuffixQuadrillion:"Q",labelInvalidData:"Dados inválidos",labelNoData:"Não existem dados para apresentação",labelClearSelection:"Limpar Seleção",labelDataVisualization:"Visualização de Dados",stateSelected:"Selecionado",stateUnselected:"Não Selecionado",stateMaximized:"Maximizado",stateMinimized:"Minimizado",stateExpanded:"Expandido",stateCollapsed:"Contraído",stateIsolated:"Isolado",stateHidden:"Oculto",stateVisible:"Visível",stateDrillable:"Passível de definir o nível de detalhe",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} de {1}",accessibleContainsControls:"Contém Controlos"},"oj-ojRatingGauge":{labelInvalidData:"Dados inválidos",labelNoData:"Não existem dados para apresentação",labelClearSelection:"Limpar Seleção",labelDataVisualization:"Visualização de Dados",stateSelected:"Selecionado",stateUnselected:"Não Selecionado",stateMaximized:"Maximizado",stateMinimized:"Minimizado",stateExpanded:"Expandido",stateCollapsed:"Contraído",stateIsolated:"Isolado",stateHidden:"Oculto",stateVisible:"Visível",stateDrillable:"Passível de definir o nível de detalhe",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} de {1}",accessibleContainsControls:"Contém Controlos",componentName:"Manómetro"},"oj-ojStatusMeterGauge":{labelInvalidData:"Dados inválidos",labelNoData:"Não existem dados para apresentação",labelClearSelection:"Limpar Seleção",labelDataVisualization:"Visualização de Dados",stateSelected:"Selecionado",stateUnselected:"Não Selecionado",stateMaximized:"Maximizado",stateMinimized:"Minimizado",stateExpanded:"Expandido",stateCollapsed:"Contraído",stateIsolated:"Isolado",stateHidden:"Oculto",stateVisible:"Visível",stateDrillable:"Passível de definir o nível de detalhe",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} de {1}",accessibleContainsControls:"Contém Controlos",componentName:"Manómetro"},"oj-ojNavigationList":{defaultRootLabel:"Lista de Navegação",hierMenuBtnLabel:"Botão de Menu Hierárquico",selectedLabel:"selecionado",previousIcon:"Anterior",msgFetchingData:"A Extrair Dados...",msgNoData:"Não existem itens para apresentação.",overflowItemLabel:"Mais",accessibleReorderTouchInstructionText:"Toque duas vezes e mantenha premido. Aguarde pelo som e, em seguida, arraste para voltar a dispor.",accessibleReorderBeforeItem:"Antes de {item}",accessibleReorderAfterItem:"Depois de {item}",labelCut:"Cortar",labelPasteBefore:"Colar Antes de",labelPasteAfter:"Colar Depois de",labelRemove:"Retirar",removeCueText:"Retirável"},"oj-ojSlider":{noValue:"ojSlider não tem nenhum valor",maxMin:"O máximo não deve ser menor que ou igual ao mínimo",startEnd:"é necessário que value.start não seja superior a value.end",valueRange:"O valor deve estar no intervalo entre o mínimo e o máximo",optionNum:"A opção {option} não é um número",invalidStep:"Passo inválido; o passo deve ser > 0",lowerValueThumb:"visualização reduzida do valor mínimo",higherValueThumb:"visualização reduzida do valor máximo"},"oj-ojDialog":{labelCloseIcon:"Fecho"},"oj-ojPopup":{ariaLiveRegionInitialFocusFirstFocusable:"A entrar na janela sobreposta. Prima F6 para navegar entre a janela sobreposta e o controlo associado.",ariaLiveRegionInitialFocusNone:"Janela sobreposta aberta. Prima F6 para navegar entre a janela sobreposta e o controlo associado.",ariaLiveRegionInitialFocusFirstFocusableTouch:"A entrar na janela sobreposta. A janela sobreposta pode ser fechada ao navegar para a última ligação dentro da janela sobreposta.",ariaLiveRegionInitialFocusNoneTouch:"Janela sobreposta aberta. Navegue para a ligação seguinte para estabelecer o foco dentro da janela sobreposta.",ariaFocusSkipLink:"Toque duas vezes para navegar para a janela sobreposta aberta.",ariaCloseSkipLink:"Toque duas vezes para fechar a janela sobreposta aberta."},"oj-ojRefresher":{ariaRefreshLink:"Ativar ligação para renovar conteúdo",ariaRefreshingLink:"A renovar conteúdo",ariaRefreshCompleteLink:"Renovação concluída"},"oj-ojSwipeActions":{ariaShowStartActionsDescription:"Mostrar ações iniciais",ariaShowEndActionsDescription:"Mostrar ações finais",ariaHideActionsDescription:"Ocultar ações"},"oj-ojIndexer":{indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",indexerOthers:"#",ariaDisabledLabel:"Não existe nenhum cabeçalho de grupo correspondente",ariaOthersLabel:"número",ariaInBetweenText:"Entre {first} e {second}",ariaKeyboardInstructionText:"Prima Enter para selecionar o valor.",ariaTouchInstructionText:"Toque duas vezes e mantenha o toque para entrar no modo de gestos, em seguida, arraste para cima ou para baixo para ajustar o valor."},"oj-ojMenu":{labelCancel:"Cancelar",ariaFocusSkipLink:"O foco incide no menu. Toque duas vezes ou passe o dedo para fazer incidir o foco no primeiro item de menu."},"oj-ojColorSpectrum":{labelHue:"Tonalidade",labelOpacity:"Opacidade",labelSatLum:"Saturação/Luminosidade",labelThumbDesc:"Cursor de deslocação de 4 vias do espectro de cores."},"oj-ojColorPalette":{labelNone:"Nenhum"},"oj-ojColorPicker":{labelSwatches:"Coleções de Cores",labelCustomColors:"Cores Customizadas",labelPrevColor:"Cor Anterior",labelDefColor:"Cor por Omissão",labelDelete:"Apagar",labelDeleteQ:"Apagar?",labelAdd:"Acrescentar",labelAddColor:"Acrescentar cor",labelMenuHex:"HEX",labelMenuRgba:"RGBa",labelMenuHsla:"HSLa",labelSliderHue:"Tonalidade",labelSliderSaturation:"Saturação",labelSliderSat:"Sat.",labelSliderLightness:"Claridade",labelSliderLum:"Luminosidade",labelSliderAlpha:"Alfa",labelOpacity:"Opacidade",labelSliderRed:"Vermelho",labelSliderGreen:"Verde",labelSliderBlue:"Azul"},"oj-ojFilePicker":{dropzoneText:"Largue os ficheiros aqui ou clique para carregar",singleFileUploadError:"Carregue um ficheiro de cada vez.",singleFileTypeUploadError:"Não é possível carregar ficheiros do tipo {fileType}.",multipleFileTypeUploadError:"Não é possível carregar ficheiros do tipo: {fileTypes}.",dropzonePrimaryText:"Arrastar e Largar",secondaryDropzoneText:"Selecionar um ficheiro ou largar um aqui.",secondaryDropzoneTextMultiple:"Selecionar ou largar ficheiros aqui.",unknownFileType:"desconhecido"},"oj-ojProgressbar":{ariaIndeterminateProgressText:"A Decorrer"},"oj-ojMessage":{labelCloseIcon:"Fecho",categories:{error:"Erro",warning:"Aviso",info:"Informações",confirmation:"Confirmação",none:"Nenhum"}},"oj-ojSelector":{checkboxAriaLabel:"Marcar Caixa de Seleção {rowKey}",checkboxAriaLabelSelected:" selecionado",checkboxAriaLabelUnselected:" não selecionado"},"oj-ojMessages":{labelLandmark:"Mensagens",ariaLiveRegion:{navigationFromKeyboard:"A entrar na região de mensagens. Prima F6 para navegar novamente para o elemento anteriormente focado.",navigationToTouch:"A região de mensagens tem mensagens novas. Utilize o rotor do VoiceOver para navegar para o ponto de referência das mensagens.",navigationToKeyboard:"A região das mensagens tem mensagens novas. Prima F6 para navegar para a mais recente região de mensagens.",newMessage:"Categoria da mensagem {category}. {summary}. {detail}.",noDetail:"Os detalhes não estão disponíveis"}},"oj-ojMessageBanner":{close:"Fecho",navigationFromMessagesRegion:"A entrar na região de mensagens. Prima F6 para navegar novamente para o elemento anteriormente focado.",navigationToMessagesRegion:"A região das mensagens tem mensagens novas. Prima F6 para navegar para a mais recente região de mensagens.",error:"Erro",warning:"Aviso",info:"Informações",confirmation:"Confirmação"},"oj-ojConveyorBelt":{tipArrowNext:"Seguinte",tipArrowPrevious:"Anterior"},"oj-ojTrain":{stepInfo:"Passo {index} de {count}.",stepStatus:"Estado: {status}.",stepCurrent:"Atual",stepVisited:"Visitado",stepNotVisited:"Não Visitado",stepDisabled:"Desativado",stepMessageType:"Tipo de mensagem: {messageType}.",stepMessageConfirmation:"Confirmado",stepMessageInfo:"Informações",stepMessageWarning:"Aviso",stepMessageError:"Erro"}});