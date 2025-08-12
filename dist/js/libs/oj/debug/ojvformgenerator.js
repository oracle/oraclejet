/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'preact', 'ojs/ojthemeutils', 'ojs/ojlabel', 'ojs/ojcustomelement-utils', 'ojs/ojdomutils'], function (exports, jsxRuntime, preact, ojthemeutils, ojlabel, ojcustomelementUtils, DomUtils) { 'use strict';

    // VStartLabeler function component adds the dom for the
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
        // Set the label edge to none.  This is debug code and shouldn't be needed.
        if (!Array.isArray(props.children)) {
            props.children.props['labelEdge'] = 'provided';
        }
        return (jsxRuntime.jsxs(preact.Fragment, { children: [jsxRuntime.jsx("div", { class: "oj-formlayout-inline-label", style: labelWrapperStyle, children: jsxRuntime.jsx("oj-label", { for: props.forid, children: props.labelText }) }), jsxRuntime.jsx("div", { class: "oj-formlayout-inline-value", style: valueWrapperStyle, children: props.children })] }));
    }
    function _computeStartLabelWidth(labelWidth, colspan) {
        let newWidth = labelWidth;
        if (colspan > 1) {
            // for units that are (or can be) relative to horizontal screen size.
            // for '%' labelWidth, we need to devide the value by the number of columns this component
            // is spanning (which can be less that the colspan property value);
            const CssUnitsRegex = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/;
            const parts = labelWidth.match(CssUnitsRegex);
            const labelWidthNumber = parseFloat(parts[1]);
            const labelWidthUnits = parts[2];
            switch (labelWidthUnits) {
                case 'vw':
                case 'vmin':
                case 'vmax':
                case '%':
                    // if it is greater than 1, we need to adjust the width to account for the .
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
        // Set the label edge to none.  This is debug code and shouldn't be needed.
        if (!Array.isArray(props.children)) {
            props.children.props['labelEdge'] = 'provided';
        }
        return (jsxRuntime.jsxs(preact.Fragment, { children: [jsxRuntime.jsx("oj-label", { for: props.forid, children: props.labelText }), props.children] }));
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

    // VLabeler functional component will wrap the component with the appropriate dom elements
    // and add an oj-label if needed ("start" | "top").
    //  labelEdge: "inside" | "start" | "top" | "none"
    //  labelWidth: string - only used when labelEdge === "start"
    //  labelText: string - the label text shown to the user
    //  colspan: number - the numnber of columns this element spans
    function VLabeler(props) {
        let compId;
        let isCorePackFormComp = false;
        let comp = props.children;
        if (comp) {
            const hasSingleChild = !Array.isArray(comp);
            // get the component id for the label, if we have a single child (expected)
            if (hasSingleChild) {
                compId = ojcustomelementUtils.ElementUtils.getUniqueId(comp.props['id']);
                // core pack components are wrapped with a vcomponent wrapper, so we need to go down an extra
                // extra level to get to the core pack component name.
                if (String(comp.props.children?.type)
                    .toLowerCase()
                    .startsWith('oj-c-')) {
                    isCorePackFormComp = true;
                    // make comp the core pack component
                    comp = comp.props.children;
                }
            }
            if (props.labelEdge === LABELEDGE_START && !isCorePackFormComp) {
                return jsxRuntime.jsx(VStartLabeler, { forid: compId, ...props });
            }
            else if (props.labelEdge === LABELEDGE_TOP && !isCorePackFormComp) {
                return jsxRuntime.jsx(VTopLabeler, { forid: compId, ...props });
            }
            else {
                // set up the inside label if needed, if we have a single child (expected)
                if (hasSingleChild) {
                    if (props.labelEdge === 'inside' || isCorePackFormComp) {
                        comp.props['labelEdge'] = props.labelEdge;
                        comp.props['labelHint'] = props.labelText;
                    }
                    else {
                        comp.props['labelEdge'] = 'none';
                    }
                }
                // this can't be 'comp' because we want the core pack wrapper
                return jsxRuntime.jsx(preact.Fragment, { children: props.children });
            }
        }
        else {
            return null; // nothing to label
        }
    }

    const _isVNode = (node) => {
        // toChildArray() will remove null, undefined and boolean nodes
        return typeof node !== 'string' && isNaN(node);
    };
    class VCellGenerator extends preact.Component {
        render(props) {
            let rootClassName = 'oj-flex-item';
            const slotWidth = this._getFullFlexItemWidth(props.colspan, props.totalColumns);
            let wrapperStyle = {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: slotWidth,
                width: slotWidth,
                maxWidth: slotWidth
            };
            // Label edge start needs the wrapper style to have display flex
            if (props.labelEdge == LABELEDGE_START) {
                wrapperStyle.display = 'flex';
            }
            if (props.contentType === 'formLayout') {
                rootClassName += ' oj-formlayout-nested-formlayout';
            }
            // VCellGenerator has no way to utilize binding propagation or FormContext to update the core pack
            // form component's 'containerReadonly' and 'readonly' properties which is needed for them to render
            // correctly when readonly, so we need to update the properties here before they are rendered.
            // Update core pack form components with the appropriate containerReadonly and readonly value.
            // props.children could be an array of children, so coerce to an array via preact's toChildArray.
            const compArray = preact.toChildArray(props.children);
            compArray.forEach((vCompWrapper) => {
                if (_isVNode(vCompWrapper)) {
                    // core pack components are wrapped with a vcomponent wrapper, so we need to go down an extra
                    // extra level to get to the core pack component name.
                    const vNodeChildren = preact.toChildArray(vCompWrapper.props.children);
                    // if vNodeChildren has more than 1 child, it's not a core pack form component, so don't update props
                    if (vNodeChildren.length === 1) {
                        const child = vNodeChildren[0];
                        if (_isVNode(child) && String(child['type']).toLowerCase().startsWith('oj-c-')) {
                            const corePackFormComp = child;
                            corePackFormComp.props['containerReadonly'] = props.containerReadonly;
                            // If readonly isn't specified on the component, set the value to containerReadonly.
                            // JET-66807 - VTemplateEngine converts prop into attribute by using uppercase form
                            // for the property name. Lets account for both forms of 'readonly'.
                            if (corePackFormComp.props['readonly'] === undefined &&
                                corePackFormComp.props['READONLY'] === undefined) {
                                corePackFormComp.props['readonly'] = props.containerReadonly;
                            }
                            // Also set labelWrapping on core pack component children, only if it
                            // isn't already set on the component itself.
                            if (corePackFormComp.props['labelWrapping'] === undefined &&
                                corePackFormComp.props['LABELWRAPPING'] === undefined) {
                                corePackFormComp.props['labelWrapping'] = props.labelWrapping;
                            }
                        }
                    }
                }
            });
            // if the content
            return (jsxRuntime.jsx("div", { class: rootClassName, style: wrapperStyle, children: jsxRuntime.jsx(VLabeler, { containerReadonly: props.containerReadonly, labelText: props.labelText, labelEdge: props.labelEdge, labelWidth: props.labelWidth, colspan: props.colspan, totalColumns: props.totalColumns, children: props.children }) }, props.cellKey));
        }
        /**
         * Calculate the width for the wrapper div of a form item.
         */
        _getFullFlexItemWidth(colspan, columns) {
            // If we are spanning the entire row (or if we are direction = column
            // which will have colspan and columns = 1), then no need to do any fancy
            // calculation.
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
            // We only need to append this when we are spanning more than one column.
            if (colspan > 1) {
                fullWidth += ' * ' + colspan + ' + (' + columnGap + ' * ' + (colspan - 1) + ')';
            }
            // add the closing paren
            fullWidth += ')';
            return fullWidth;
        }
    }
    VCellGenerator.defaultProps = {
        colspan: 1,
        totalColumns: 1,
        labelEdge: 'inside',
        labelWidth: '33%', // Ignored except for labelEdge === "start"
        labelWrapping: 'wrap',
        labelText: ''
    };

    class VColumnFormGenerator extends preact.Component {
        render(props) {
            this._columns = props.columns > 0 ? props.columns : props.maxColumns;
            const rootClassName = 'oj-form-layout oj-formlayout-max-cols-' + this._columns;
            const formContent = this._getColumnFormContent(props.formControls, props.columns, props.readonly, props.labelWrapping);
            return jsxRuntime.jsx("div", { class: rootClassName, children: formContent });
        }
        /**
         * Get the inner content of the form for direction 'column'.
         */
        _getColumnFormContent(childArray, columns, containerReadonly, labelWrapping) {
            let formContent = [];
            let rowContent;
            // As far as VCellGenerator is concerned, totalCols is always 1 for direction 'column'
            let totalCols = 1;
            let content;
            let labelEdge;
            // each iteration should process a label/input pair
            for (const item of childArray) {
                // resolve the content if needed.
                content = typeof item.content === 'function' ? item.content() : item.content;
                // get default labelEdge if needed.
                labelEdge = item.labelEdge;
                if (!labelEdge) {
                    if (!this._themeDefault) {
                        this._themeDefault = ojthemeutils.parseJSONFromFontFamily('oj-form-layout-option-defaults') || {};
                    }
                    labelEdge = this._themeDefault.labelEdge;
                }
                rowContent = (jsxRuntime.jsx(VCellGenerator, { containerReadonly: containerReadonly, totalColumns: totalCols, labelText: item.labelText, labelEdge: labelEdge, labelWidth: item.labelWidth, labelWrapping: labelWrapping, contentType: item.contentType, cellKey: item.key, children: content }));
                formContent.push(jsxRuntime.jsx("div", { class: "oj-flex", "data-oj-internal": true, children: rowContent }));
            }
            const styling = this._getColumnStyling(columns);
            return (jsxRuntime.jsx("div", { class: styling.formClassName, style: styling.formStyle, "data-oj-context": true, "data-oj-internal": true, children: formContent }));
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
            // if the columns property is specified and is positive, we disabled the column minimum width
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
            // This is a Ref: callback function used to update the current formDivRef.  If we happen to
            // have a previous formDivRef, we need to remove the listener before we add the listener to the
            // new formDivRef.
            this.setFormDivRef = (dom) => {
                this.formDivRef = dom;
            };
            // set initial state.availableColumns to 0 and in componentDidMount/componentDidUpdate, update
            // the availableColumns if needed (i.e. when we don't have a fixed columns value)
            this.state = {
                availableColumns: 0
            };
            this._updateAvailableColumns = () => {
                //if _calculateColumns(0) returns non-zero, we don't need to do update the available columns.
                const hasVariableColumns = this._calculateColumns(0) === 0;
                if (hasVariableColumns) {
                    // otherwise, we remove the max columns style and re-calculate the available columns and update
                    // the state if it changed.
                    const form = this.formDivRef;
                    // save the current classes
                    const rootClassNames = form.class;
                    // use the initial class names so max width isn't applied.
                    form.class = INITIAL_ROOTCLASSNAMES;
                    const availCols = this._calculateAvailableColumns(form);
                    // restore the classes
                    form.class = rootClassNames;
                    // only set state if the columns value changes.  No need to rerender if not.
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
            const formContent = this._getRowFormContent(this.props.formControls, this.props.readonly, this.props.labelWrapping);
            return (jsxRuntime.jsx("div", { class: rootClassNames, ref: this.setFormDivRef, children: formContent }));
        }
        componentDidMount() {
            this._updateAvailableColumns();
            DomUtils.addResizeListener(this.formDivRef, this._updateAvailableColumns, 25);
        }
        componentDidUpdate() {
            this._updateAvailableColumns();
        }
        componentWillUnmount() {
            // remove the resize listener if there is one.
            DomUtils.removeResizeListener(this.formDivRef, this._updateAvailableColumns);
        }
        _calculateAvailableColumns(form) {
            let availableCols = Math.max(this.props.maxColumns, 1);
            // get the column width specified in the theme
            let colWidth = parseFloat(window.getComputedStyle(form.querySelector('.oj-form')).columnWidth);
            // if there is no numeric column-width, we just use max-columns
            if (!isNaN(colWidth)) {
                // Determine the number of columns.  This should be at least 1.
                let totalWidth = this.formDivRef.getBoundingClientRect().width;
                availableCols = Math.max(Math.floor(totalWidth / colWidth), 1);
            }
            return availableCols;
        }
        // This function returns the actual number of columns the oj-form-layout should be
        // using.  Currently, this only applies to direction = 'row', as direction = column
        // responsive layout is handled by the browser
        _calculateColumns(availableColumns) {
            // Make sure we have at least 1 column
            let calculatedCols = Math.max(this.props.maxColumns, 1);
            const cols = this.props.columns;
            // if columns is positive, then a value was specified and we use that value
            // as absolute, rather than calculating the number of columns
            // also, we add a style class that is used to remove the column-width
            // of the oj-form div so that the browser doesn't change the number of
            // columns.
            if (cols > 0) {
                calculatedCols = cols;
            }
            else {
                if (calculatedCols > 1) {
                    // We skip this calculation for maxCoumns == 1 and just use 1.
                    // For column direction, the browser will already automatically adjust the
                    // number of displayed columns based on the column-width specified.
                    if (availableColumns < calculatedCols) {
                        calculatedCols = availableColumns;
                    }
                }
            }
            return calculatedCols;
        }
        /**
         * Get the inner content of the form for direction 'row'.
         */
        _getRowFormContent(childArray, containerReadonly, labelWrapping) {
            let formContent = [];
            let rowContent;
            const cols = this._calculateColumns(this.state.availableColumns);
            if (cols === 0) {
                // We don't know the size yet, so just render an empty content and the
                // availableColumns will be calculated in componentDidMount() or
                // componentDidUpdate().  The state will be set and will re-render.
                childArray = [];
            }
            let cellCount = 0; // counter of how many cells have been occupied
            let colspan;
            let totalCols;
            let content;
            let needsFullWidthClass = false;
            let labelEdge;
            // each iteration should process a label/input pair
            for (const item of childArray) {
                colspan = 1;
                totalCols = cols;
                // resolve the content if needed.
                content = typeof item.content === 'function' ? item.content() : item.content;
                // In column direction, each row contains only one cell.
                // In row direction, each row contains maxCols number of cells.
                if (cellCount % cols === 0) {
                    if (rowContent) {
                        // Add the current row to the form
                        this._addRowToForm(formContent, rowContent, cellCount);
                    }
                    // Start a new row
                    rowContent = [];
                }
                // if the child element supports colspan, we need to calculate that actual
                // colspan based on the available columns left in this row.
                // colspan only works in row direction.
                if (item.colspan && item.colspan > 1) {
                    const curCol = cellCount % cols;
                    let availableCols = cols - curCol;
                    // force integer colspan values
                    colspan = Math.floor(item.colspan);
                    if (this.props.colspanWrap === COLSPANWRAP_WRAP &&
                        availableCols < colspan &&
                        curCol > 0) {
                        // If colspanWrap is 'wrap' and there isn't enough column left to satisfy colspan,
                        // then just add empty cells to take up remaining columns and adjust the counters.
                        this._addRowToForm(formContent, rowContent, cellCount);
                        cellCount += availableCols;
                        // Start a new row for the colspan item
                        rowContent = [];
                        availableCols = cols;
                    }
                    // don't exceed availableCols
                    colspan = Math.min(colspan, availableCols);
                    needsFullWidthClass = cols > 1;
                }
                // get default labelEdge if needed.
                labelEdge = item.labelEdge;
                if (!labelEdge) {
                    if (!this._themeDefault) {
                        this._themeDefault = ojthemeutils.parseJSONFromFontFamily('oj-form-layout-option-defaults') || {};
                    }
                    labelEdge = this._themeDefault.labelEdge;
                }
                rowContent.push(jsxRuntime.jsx(VCellGenerator, { colspan: colspan, containerReadonly: containerReadonly, totalColumns: totalCols, labelText: item.labelText, labelEdge: labelEdge, labelWidth: item.labelWidth, labelWrapping: labelWrapping, contentType: item.contentType, cellKey: item.key, children: content }));
                cellCount += colspan;
                // we want to add a gutter div as long as we aren't at the end of the row
                if (cellCount % cols !== 0) {
                    this._addColumnGutter(rowContent);
                }
            }
            // Add the last row to the form
            this._addRowToForm(formContent, rowContent, cellCount);
            const styling = this._getRowStyling(needsFullWidthClass);
            return (jsxRuntime.jsx("div", { class: styling.formClassName, style: styling.formStyle, "data-oj-context": true, "data-oj-internal": true, children: formContent }));
        }
        /**
         * Add a gutter div in row direction
         */
        _addColumnGutter(rowContent) {
            rowContent.push(jsxRuntime.jsx("div", { class: "oj-formlayout-column-gutter" }));
        }
        /**
         * Add a row to the form, padding with empty cells if needed
         */
        _addRowToForm(formContent, rowContent, cellCount) {
            // Pad remaining space in the row with empty cells
            this._addPaddingCells(rowContent, cellCount);
            // Add the completed row to the form
            formContent.push(jsxRuntime.jsx("div", { class: "oj-flex", "data-oj-internal": true, children: rowContent }));
        }
        /**
         * Add empty cells to pad remaining columns in a row
         */
        _addPaddingCells(rowContent, count) {
            // if _calculateColumns() returns 0, use props.maxColumns
            const cols = this._calculateColumns(this.state.availableColumns) || this.props.maxColumns;
            const last = count % cols;
            if (rowContent && last > 0) {
                for (let i = last; i < cols; i++) {
                    // add a column gutter div for every missing column except the first.
                    if (i !== last) {
                        this._addColumnGutter(rowContent);
                    }
                    // use VCellGenerator to generate empty cells.
                    rowContent.push(jsxRuntime.jsx(VCellGenerator, { colspan: 1, totalColumns: cols, labelEdge: LABELEDGE_NONE }));
                }
            }
        }
        /**
         * Get the appropriate classes and styles for the direction row form.
         */
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
            // if we need the full width class, put it on the ojForm element so that if this class was
            // specified on the oj-form-layout, we don't accidentally remove it.
            if (needsFullWidthClass) {
                formClassNames += ' oj-form-control-full-width';
            }
            formClassNames += ' oj-form-cols';
            // When direction === "row", we need to set the columns to 1, as we use the
            // oj-flex and oj-flex-item divs to control the number of columns.
            // Also, we need to add the 'oj-formlayout-form-across' class to get the buffer between the
            // label/value pairs.
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

    /**
     * @classdesc A preact component that renders form elements into a row or column oriented form layout
     * VColumnFormGenerator is returned if direction is 'column'
     * VRowFormGenerator is returned if direction is 'row'
     */
    class VFormGenerator extends preact.Component {
        render(props) {
            const { direction, ...passthruProps } = props;
            if (direction === DIRECTION_COLUMN) {
                return jsxRuntime.jsx(VColumnFormGenerator, { ...passthruProps });
            }
            else {
                return jsxRuntime.jsx(VRowFormGenerator, { ...passthruProps });
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

    /**
     * @license
     * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * @ignore
     */

    exports.VFormGenerator = VFormGenerator;

    Object.defineProperty(exports, '__esModule', { value: true });

});
