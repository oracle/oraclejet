/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'preact', 'ojs/ojthemeutils', 'ojs/ojlabel', 'ojs/ojcustomelement-utils', 'ojs/ojdomutils'], function (exports, jsxRuntime, preact, ojthemeutils, ojlabel, ojcustomelementUtils, DomUtils) { 'use strict';

    function VStartLabeler(props) {
        const labelWrapperWidth = _computeStartLabelWidth(props.labelWidth, props.colspan);
        const valueWrapperWidth = 'calc(100% - ' + labelWrapperWidth + ')';
        const labelWrapperStyle = {
            flexGrow: '0',
            flexShrink: '0',
            flexBasis: labelWrapperWidth,
            width: labelWrapperWidth,
            maxWidth: labelWrapperWidth
        };
        const valueWrapperStyle = {
            flexGrow: '1',
            flexShrink: '1',
            flexBasis: valueWrapperWidth,
            width: valueWrapperWidth,
            maxWidth: valueWrapperWidth
        };
        if (!Array.isArray(props.children)) {
            props.children.props['labelEdge'] = 'provided';
        }
        return (jsxRuntime.jsxs(preact.Fragment, { children: [jsxRuntime.jsx("div", Object.assign({ class: "oj-formlayout-inline-label", style: labelWrapperStyle }, { children: jsxRuntime.jsx("oj-label", Object.assign({ for: props.forid }, { children: props.labelText })) })), jsxRuntime.jsx("div", Object.assign({ class: "oj-formlayout-inline-value", style: valueWrapperStyle }, { children: props.children }))] }));
    }
    function _computeStartLabelWidth(labelWidth, colspan) {
        let newWidth = labelWidth;
        if (colspan > 1) {
            const CssUnitsRegex = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/;
            const parts = labelWidth.match(CssUnitsRegex);
            const labelWidthNumber = parseFloat(parts[1]);
            const labelWidthUnits = parts[2];
            switch (labelWidthUnits) {
                case 'vw':
                case 'vmin':
                case 'vmax':
                case '%':
                    if (colspan > 1) {
                        let columnGap = ojthemeutils.parseJSONFromFontFamily('oj-form-layout-option-defaults').columnGap;
                        newWidth =
                            'calc(((' +
                                labelWidth +
                                ' / ' +
                                colspan +
                                ') - ((' +
                                columnGap +
                                ' * (' +
                                (colspan - 1) +
                                ') * ' +
                                labelWidthNumber / colspan / 100 +
                                ')))';
                    }
                    break;
                default:
                    break;
            }
        }
        return newWidth;
    }

    function VTopLabeler(props) {
        if (!Array.isArray(props.children)) {
            props.children.props['labelEdge'] = 'provided';
        }
        return (jsxRuntime.jsxs(preact.Fragment, { children: [jsxRuntime.jsx("oj-label", Object.assign({ for: props.forid }, { children: props.labelText })), props.children] }));
    }

    const COLSPANWRAP_NOWRAP = 'nowrap';
    const COLSPANWRAP_WRAP = 'wrap';
    const DIRECTION_COLUMN = 'column';
    const DIRECTION_ROW = 'row';
    const CONTENTTYPE_FORMCONTROL = 'formControl';
    const CONTENTTYPE_FORMLAYOUT = 'formLayout';
    const LABELWRAPPING_TRUNCATE = 'truncate';
    const LABELWRAPPING_WRAP = 'wrap';
    const USERASSISTANCEDENSITY_COMPACT = 'compact';
    const USERASSISTANCEDENSITY_EFFICIENT = 'efficient';
    const USERASSISTANCEDENSITY_REFLOW = 'reflow';
    const LABELEDGE_INSIDE = 'inside';
    const LABELEDGE_NONE = 'none';
    const LABELEDGE_START = 'start';
    const LABELEDGE_TOP = 'top';
    const INITIAL_ROOTCLASSNAMES = 'oj-form-layout';
    const ROOTCLASSNAMES = 'oj-form-layout oj-formlayout-max-cols-';
    const NO_MIN_COLUMN_WIDTH = ' oj-form-layout-no-min-column-width';

    function VLabeler(props) {
        var _a;
        let compId;
        let isCorePackFormComp = false;
        let comp = props.children;
        if (comp) {
            const hasSingleChild = !Array.isArray(comp);
            if (hasSingleChild) {
                compId = ojcustomelementUtils.ElementUtils.getUniqueId(comp.props['id']);
                if (String((_a = comp.props.children) === null || _a === void 0 ? void 0 : _a.type).toLowerCase().startsWith('oj-c-')) {
                    isCorePackFormComp = true;
                    comp = comp.props.children;
                }
            }
            if (props.labelEdge === LABELEDGE_START && !isCorePackFormComp) {
                return jsxRuntime.jsx(VStartLabeler, Object.assign({ forid: compId }, props));
            }
            else if (props.labelEdge === LABELEDGE_TOP && !isCorePackFormComp) {
                return jsxRuntime.jsx(VTopLabeler, Object.assign({ forid: compId }, props));
            }
            else {
                if (hasSingleChild) {
                    if (props.labelEdge === 'inside' || isCorePackFormComp) {
                        comp.props['labelEdge'] = props.labelEdge;
                        comp.props['labelHint'] = props.labelText;
                    }
                    else {
                        comp.props['labelEdge'] = 'none';
                    }
                }
                return jsxRuntime.jsx(preact.Fragment, { children: props.children });
            }
        }
        else {
            return null;
        }
    }

    class VCellGenerator extends preact.Component {
        render(props) {
            let rootClassName = 'oj-flex-item';
            const slotWidth = this._getFullFlexItemWidth(this.props.colspan, this.props.totalColumns);
            let wrapperStyle = {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: slotWidth,
                width: slotWidth,
                maxWidth: slotWidth
            };
            if (this.props.labelEdge == LABELEDGE_START) {
                wrapperStyle.display = 'flex';
            }
            if (this.props.contentType === 'formLayout') {
                rootClassName += ' oj-formlayout-nested-formlayout';
            }
            return (jsxRuntime.jsx("div", Object.assign({ class: rootClassName, style: wrapperStyle }, { children: jsxRuntime.jsx(VLabeler, Object.assign({ labelText: this.props.labelText, labelEdge: this.props.labelEdge, labelWidth: this.props.labelWidth, colspan: this.props.colspan, totalColumns: this.props.totalColumns }, { children: this.props.children })) }), props.cellKey));
        }
        _getFullFlexItemWidth(colspan, columns) {
            if (colspan === columns) {
                return '100%';
            }
            let columnGap = (ojthemeutils.parseJSONFromFontFamily('oj-form-layout-option-defaults') || {}).columnGap;
            let cols = this.props.totalColumns;
            let fullWidth = 'calc(((100% / ' +
                columns +
                ') - ((' +
                columnGap +
                ' * (' +
                (columns - 1) +
                ') / ' +
                columns +
                ')))';
            if (colspan > 1) {
                fullWidth += ' * ' + colspan + ' + (' + columnGap + ' * ' + (colspan - 1) + ')';
            }
            fullWidth += ')';
            return fullWidth;
        }
    }
    VCellGenerator.defaultProps = {
        colspan: 1,
        totalColumns: 1,
        labelEdge: 'inside',
        labelWidth: '33%',
        labelText: ''
    };

    class VColumnFormGenerator extends preact.Component {
        render(props) {
            this._columns = props.columns > 0 ? props.columns : props.maxColumns;
            const rootClassName = 'oj-form-layout oj-formlayout-max-cols-' + this._columns;
            const formContent = this._getColumnFormContent(props.formControls, props.columns);
            return jsxRuntime.jsx("div", Object.assign({ class: rootClassName }, { children: formContent }));
        }
        _getColumnFormContent(childArray, columns) {
            let formContent = [];
            let rowContent;
            let totalCols = 1;
            let content;
            let labelEdge;
            for (const item of childArray) {
                content = typeof item.content === 'function' ? item.content() : item.content;
                labelEdge = item.labelEdge;
                if (!labelEdge) {
                    if (!this._themeDefault) {
                        this._themeDefault = ojthemeutils.parseJSONFromFontFamily('oj-form-layout-option-defaults') || {};
                    }
                    labelEdge = this._themeDefault.labelEdge;
                }
                rowContent = (jsxRuntime.jsx(VCellGenerator, Object.assign({ totalColumns: totalCols, labelText: item.labelText, labelEdge: labelEdge, labelWidth: item.labelWidth, contentType: item.contentType, cellKey: item.key }, { children: content })));
                formContent.push(jsxRuntime.jsx("div", Object.assign({ class: "oj-flex", "data-oj-internal": true }, { children: rowContent })));
            }
            const styling = this._getColumnStyling(columns);
            return (jsxRuntime.jsx("div", Object.assign({ class: styling.formClassName, style: styling.formStyle, "data-oj-context": true, "data-oj-internal": true }, { children: formContent })));
        }
        _getColumnStyling(columns) {
            let formClassNames = 'oj-form';
            if (!this.props.readonly) {
                formClassNames += ' oj-enabled';
            }
            if (this.props.userAssistanceDensity === USERASSISTANCEDENSITY_EFFICIENT) {
                formClassNames += ' oj-efficient';
            }
            if (this.props.labelWrapping === LABELWRAPPING_TRUNCATE) {
                formClassNames += ' oj-formlayout-labels-nowrap';
            }
            if (columns > 0) {
                formClassNames += ' oj-form-layout-no-min-column-width';
            }
            formClassNames += ' oj-form-cols';
            return {
                formClassName: formClassNames,
                formStyle: {
                    columnCount: this._columns,
                    webkitColumnCount: this._columns,
                    MozColumnCount: this._columns
                }
            };
        }
    }
    VColumnFormGenerator.defaultProps = {
        colspanWrap: 'nowrap',
        formControls: [],
        labelWrapping: 'wrap',
        columns: 0,
        maxColumns: 1,
        readonly: false,
        userAssistanceDensity: 'efficient'
    };

    class VRowFormGenerator extends preact.Component {
        constructor() {
            super(...arguments);
            this.setFormDivRef = (dom) => {
                this.formDivRef = dom;
            };
            this.state = {
                availableColumns: 0
            };
            this._updateAvailableColumns = () => {
                const hasVariableColumns = this._calculateColumns(0) === 0;
                if (hasVariableColumns) {
                    const form = this.formDivRef;
                    const rootClassNames = form.class;
                    form.class = INITIAL_ROOTCLASSNAMES;
                    const availCols = this._calculateAvailableColumns(form);
                    form.class = rootClassNames;
                    if (this.state.availableColumns !== availCols) {
                        this.setState({
                            availableColumns: availCols
                        });
                    }
                }
            };
        }
        render(props) {
            const cssColumnClasses = props.columns > 0 ? props.columns + NO_MIN_COLUMN_WIDTH : props.maxColumns;
            const rootClassNames = ROOTCLASSNAMES + cssColumnClasses;
            const formContent = this._getRowFormContent(this.props.formControls);
            return (jsxRuntime.jsx("div", Object.assign({ class: rootClassNames, ref: this.setFormDivRef }, { children: formContent })));
        }
        componentDidMount() {
            this._updateAvailableColumns();
            DomUtils.addResizeListener(this.formDivRef, this._updateAvailableColumns, 25);
        }
        componentDidUpdate() {
            this._updateAvailableColumns();
        }
        componentWillUnmount() {
            DomUtils.removeResizeListener(this.formDivRef, this._updateAvailableColumns);
        }
        _calculateAvailableColumns(form) {
            let availableCols = Math.max(this.props.maxColumns, 1);
            let colWidth = parseFloat(window.getComputedStyle(form.querySelector('.oj-form')).columnWidth);
            if (!isNaN(colWidth)) {
                let totalWidth = this.formDivRef.getBoundingClientRect().width;
                availableCols = Math.max(Math.floor(totalWidth / colWidth), 1);
            }
            return availableCols;
        }
        _calculateColumns(availableColumns) {
            let calculatedCols = Math.max(this.props.maxColumns, 1);
            const cols = this.props.columns;
            if (cols > 0) {
                calculatedCols = cols;
            }
            else {
                if (calculatedCols > 1) {
                    if (availableColumns < calculatedCols) {
                        calculatedCols = availableColumns;
                    }
                }
            }
            return calculatedCols;
        }
        _getRowFormContent(childArray) {
            let formContent = [];
            let rowContent;
            const cols = this._calculateColumns(this.state.availableColumns);
            if (cols === 0) {
                childArray = [];
            }
            let cellCount = 0;
            let colspan;
            let totalCols;
            let content;
            let needsFullWidthClass = false;
            let labelEdge;
            for (const item of childArray) {
                colspan = 1;
                totalCols = cols;
                content = typeof item.content === 'function' ? item.content() : item.content;
                if (cellCount % cols === 0) {
                    if (rowContent) {
                        this._addRowToForm(formContent, rowContent, cellCount);
                    }
                    rowContent = [];
                }
                if (item.colspan && item.colspan > 1) {
                    const curCol = cellCount % cols;
                    let availableCols = cols - curCol;
                    colspan = Math.floor(item.colspan);
                    if (this.props.colspanWrap === COLSPANWRAP_WRAP &&
                        availableCols < colspan &&
                        curCol > 0) {
                        this._addRowToForm(formContent, rowContent, cellCount);
                        cellCount += availableCols;
                        rowContent = [];
                        availableCols = cols;
                    }
                    colspan = Math.min(colspan, availableCols);
                    needsFullWidthClass = cols > 1;
                }
                labelEdge = item.labelEdge;
                if (!labelEdge) {
                    if (!this._themeDefault) {
                        this._themeDefault = ojthemeutils.parseJSONFromFontFamily('oj-form-layout-option-defaults') || {};
                    }
                    labelEdge = this._themeDefault.labelEdge;
                }
                rowContent.push(jsxRuntime.jsx(VCellGenerator, Object.assign({ colspan: colspan, totalColumns: totalCols, labelText: item.labelText, labelEdge: labelEdge, labelWidth: item.labelWidth, contentType: item.contentType, cellKey: item.key }, { children: content })));
                cellCount += colspan;
                if (cellCount % cols !== 0) {
                    this._addColumnGutter(rowContent);
                }
            }
            this._addRowToForm(formContent, rowContent, cellCount);
            const styling = this._getRowStyling(needsFullWidthClass);
            return (jsxRuntime.jsx("div", Object.assign({ class: styling.formClassName, style: styling.formStyle, "data-oj-context": true, "data-oj-internal": true }, { children: formContent })));
        }
        _addColumnGutter(rowContent) {
            rowContent.push(jsxRuntime.jsx("div", { class: "oj-formlayout-column-gutter" }));
        }
        _addRowToForm(formContent, rowContent, cellCount) {
            this._addPaddingCells(rowContent, cellCount);
            formContent.push(jsxRuntime.jsx("div", Object.assign({ class: "oj-flex", "data-oj-internal": true }, { children: rowContent })));
        }
        _addPaddingCells(rowContent, count) {
            const cols = this._calculateColumns(this.state.availableColumns) || this.props.maxColumns;
            const last = count % cols;
            if (rowContent && last > 0) {
                for (let i = last; i < cols; i++) {
                    if (i !== last) {
                        this._addColumnGutter(rowContent);
                    }
                    rowContent.push(jsxRuntime.jsx(VCellGenerator, { colspan: 1, totalColumns: cols, labelEdge: LABELEDGE_NONE }));
                }
            }
        }
        _getRowStyling(needsFullWidthClass) {
            let formClassNames = 'oj-form';
            if (!this.props.readonly) {
                formClassNames += ' oj-enabled';
            }
            if (this.props.userAssistanceDensity === USERASSISTANCEDENSITY_EFFICIENT) {
                formClassNames += ' oj-efficient';
            }
            if (this.props.labelWrapping === LABELWRAPPING_TRUNCATE) {
                formClassNames += ' oj-formlayout-labels-nowrap';
            }
            if (needsFullWidthClass) {
                formClassNames += ' oj-form-control-full-width';
            }
            formClassNames += ' oj-form-cols';
            let cols = 1;
            formClassNames += ' oj-formlayout-form-across';
            return {
                formClassName: formClassNames,
                formStyle: {
                    columnCount: cols,
                    webkitColumnCount: cols,
                    MozColumnCount: cols
                }
            };
        }
    }
    VRowFormGenerator.defaultProps = {
        colspanWrap: COLSPANWRAP_NOWRAP,
        formControls: [],
        labelWrapping: LABELWRAPPING_WRAP,
        columns: 0,
        maxColumns: 1,
        readonly: false,
        userAssistanceDensity: USERASSISTANCEDENSITY_EFFICIENT
    };

    var __rest = (null && null.__rest) || function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
    class VFormGenerator extends preact.Component {
        render(props) {
            const { direction } = props, passthruProps = __rest(props, ["direction"]);
            if (direction === DIRECTION_COLUMN) {
                return jsxRuntime.jsx(VColumnFormGenerator, Object.assign({}, passthruProps));
            }
            else {
                return jsxRuntime.jsx(VRowFormGenerator, Object.assign({}, passthruProps));
            }
        }
    }
    VFormGenerator.defaultProps = {
        colspanWrap: COLSPANWRAP_NOWRAP,
        direction: DIRECTION_ROW,
        formControls: [],
        labelWrapping: LABELWRAPPING_WRAP,
        columns: 0,
        maxColumns: 1,
        readonly: false,
        userAssistanceDensity: USERASSISTANCEDENSITY_EFFICIENT
    };

    exports.VFormGenerator = VFormGenerator;

    Object.defineProperty(exports, '__esModule', { value: true });

});
