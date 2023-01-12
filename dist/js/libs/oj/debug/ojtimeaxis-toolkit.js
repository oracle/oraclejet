/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdvt-toolkit'], function (exports, dvt) { 'use strict';

  class DvtTimeAxisCalendar {
    constructor() {
      this._dayInMillis = 1000 * 60 * 60 * 24;
      this._firstDayOfWeek = 0; // sunday; locale based
    }
    /**
     * Sets the first day of the week, which is locale based.
     * @param {number} firstDayOfWeek Numeric day of the week: 0 for Sunday, 1 for Monday, etc.
     */
    setFirstDayOfWeek(firstDayOfWeek) {
      this._firstDayOfWeek = firstDayOfWeek;
    }

    getFirstDayOfWeek() {
      return this._firstDayOfWeek;
    }

    adjustDate(date, scale) {
      var _adjustedDate = new Date(date.getTime());
      if (scale === 'weeks') {
        _adjustedDate.setHours(0, 0, 0, 0);
        var roll_amt = (date.getDay() - this.getFirstDayOfWeek() + 7) % 7;
        if (roll_amt > 0) {
          // Work with date instead of time in ms to avoid daylight savings issues
          _adjustedDate.setDate(_adjustedDate.getDate() - roll_amt);
        }
      } else if (scale === 'months') {
        _adjustedDate.setDate(1);
        _adjustedDate.setHours(0, 0, 0, 0);
      } else if (scale === 'days') {
        _adjustedDate.setHours(0, 0, 0, 0);
      } else if (scale === 'hours') {
        _adjustedDate.setMinutes(0, 0, 0);
      } else if (scale === 'minutes') {
        _adjustedDate.setSeconds(0, 0);
      } else if (scale === 'seconds') {
        _adjustedDate.setMilliseconds(0);
      } else if (scale === 'quarters') {
        var quarter = Math.floor(_adjustedDate.getMonth() / 3);
        _adjustedDate.setDate(1);
        _adjustedDate.setHours(0, 0, 0, 0);
        _adjustedDate.setMonth(quarter * 3);
      } else if (scale === 'years') {
        _adjustedDate.setMonth(0);
        _adjustedDate.setDate(1);
        _adjustedDate.setHours(0, 0, 0, 0);
      }

      return _adjustedDate;
    }

    /**
     * Gets the next or previous date an interval away from the specified time based on a given scale.
     * @param {number} time The time in question in milliseconds
     * @param {string} scale
     * @param {string} direction Either 'next' or 'previous'
     * @return {Date} The adjacent date
     */
    getAdjacentDate(time, scale, direction) {
      var directionSign = direction === 'next' ? 1 : -1;

      if (scale === 'seconds') return new Date(time + directionSign * 1000);
      else if (scale === 'minutes') return new Date(time + directionSign * 60000);
      else if (scale === 'hours') return new Date(time + directionSign * 3600000);
      // for larger scales, no set amount of time can be added
      var _adjacentDate = new Date(time);
      if (scale === 'days') _adjacentDate.setDate(_adjacentDate.getDate() + directionSign * 1);
      else if (scale === 'weeks') _adjacentDate.setDate(_adjacentDate.getDate() + directionSign * 7);
      else if (scale === 'months')
        _adjacentDate.setMonth(_adjacentDate.getMonth() + directionSign * 1);
      else if (scale === 'quarters')
        _adjacentDate.setMonth(_adjacentDate.getMonth() + directionSign * 3);
      else if (scale === 'years')
        _adjacentDate.setFullYear(_adjacentDate.getFullYear() + directionSign * 1);
      else {
        // circuit breaker
        _adjacentDate.setYear(_adjacentDate.getYear() + directionSign * 1);
      }
      return _adjacentDate;
    }
  }

  class DvtTimeAxisDefaults extends dvt.BaseComponentDefaults {
    constructor(context) {
      const VERSION_1 = {
        backgroundColor: 'rgba(255,255,255,0)',
        borderColor: '#d9dfe3',
        separatorColor: '#bcc7d2',
        labelStyle: new dvt.CSSStyle(
          dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color: #333333;'
        )
      };
      super({ alta: VERSION_1 }, context);
    }

    /**
     * @override
     */
    getNoCloneObject() {
      return {
        _secondaryAxis: true,
        // Don't clone areas where app may pass in an instance of DvtTimeComponentScales
        // If the instance is a class, class methods may not be cloned for some reason.
        scale: true,
        zoomOrder: true,
        // Don't clone areas where app may pass in an instance of Converter
        // If the instance is a class, class methods may not be cloned for some reason.
        converter: true,
        _resources: {
          converter: true,
          converterVert: true,
          defaultDateConverter: true,
          defaultDateTimeConverter: true
        }
      };
    }
  }

  class DvtTimeAxisParser {
    /**
     * Parses the specified data options and returns the root node of the time axis
     * @param {object} options The data options describing the component.
     * @return {object} An object containing the parsed properties
     */
    parse(options) {
      this._startTime = new Date(options['start']);
      this._endTime = new Date(options['end']);

      var ret = this.ParseRootAttributes();
      ret.inlineStyle = options['style'];
      ret.id = options['id'];
      ret.shortDesc = options['shortDesc'];
      ret.itemPosition = options['_ip'];
      ret.customTimeScales = options['_cts'];
      ret.customFormatScales = options['_cfs'];

      ret.scale = options['scale'];
      ret.converter = options['converter'];
      ret.zoomOrder = options['zoomOrder'] ? options['zoomOrder'] : null;

      ret.orientation = options['orientation'] ? options['orientation'] : 'horizontal';

      return ret;
    }

    /**
     * Parses the attributes on the root node.
     * @return {object} An object containing the parsed properties
     * @protected
     */
    ParseRootAttributes() {
      return {
        start: this._startTime.getTime(),
        end: this._endTime.getTime()
      };
    }
  }

  /**
   * Style related utility functions for TimeAxis.
   * @class
   */
  const DvtTimeAxisStyleUtils = {
    /**
     * The default Axis border-width.
     * @const
     */
    DEFAULT_BORDER_WIDTH: 1,

    /**
     * The default Axis separator width.
     * @const
     */
    DEFAULT_SEPARATOR_WIDTH: 1,

    /**
     * The default Axis interval width.
     * @const
     */
    DEFAULT_INTERVAL_WIDTH: 50,

    /**
     * The default Axis interval height.
     * @const
     */
    DEFAULT_INTERVAL_HEIGHT: 21,

    /**
     * The default Axis interval padding.
     * @const
     */
    DEFAULT_INTERVAL_PADDING: 4,

    /**
     * Gets the axis style.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string} The axis style.
     */
    getAxisStyle: (options) => {
      var axisStyles = '';
      var style = DvtTimeAxisStyleUtils.getBackgroudColor(options);
      if (style) axisStyles = axisStyles + 'background-color:' + style + ';';
      style = DvtTimeAxisStyleUtils.getBorderColor(options);
      if (style) axisStyles = axisStyles + 'border-color:' + style + ';';
      style = DvtTimeAxisStyleUtils.getBorderWidth();
      if (style) axisStyles = axisStyles + 'border-width:' + style + ';';
      return axisStyles;
    },

    /**
     * Gets the axis background-color.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string} The axis background-color.
     */
    getBackgroudColor: (options) => {
      return options['backgroundColor'];
    },

    /**
     * Gets the axis border-color.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string} The axis border-color.
     */
    getBorderColor: (options) => {
      return options['borderColor'];
    },

    /**
     * Gets the axis border-width.
     * @return {string} The axis border-width.
     */
    getBorderWidth: () => {
      return DvtTimeAxisStyleUtils.DEFAULT_BORDER_WIDTH;
    },

    /**
     * Gets the axis label style.
     * @param {object} options The object containing data and specifications for the component.
     * @return {dvt.CSSStyle} The axis label style.
     */
    getAxisLabelStyle: (options) => {
      return options['labelStyle'];
    },

    /**
     * Gets the axis separator color.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string} The axis separator color.
     */
    getSeparatorColor: (options) => {
      return options['separatorColor'];
    },

    /**
     * Gets the axis separator style.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string} The axis separator style.
     */
    getAxisSeparatorStyle: (options) => {
      var separatorStyles = '';
      var style = DvtTimeAxisStyleUtils.getSeparatorColor(options);
      if (style) separatorStyles = separatorStyles + 'color:' + style + ';';
      return separatorStyles;
    },

    /**
     * Gets the axis class.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string|undefined} The axis class.
     */
    getAxisClass: (options) => {
      return options['_resources'] ? options['_resources']['axisClass'] : undefined;
    },

    /**
     * Gets the axis label class.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string|undefined} The axis label class.
     */
    getAxisLabelClass: (options) => {
      return options['_resources'] ? options['_resources']['axisLabelClass'] : undefined;
    },

    /**
     * Gets the axis separator class.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string|undefined} The axis separator class.
     */
    getAxisSeparatorClass: (options) => {
      return options['_resources'] ? options['_resources']['axisSeparatorClass'] : undefined;
    }
  };

  /**
   * Utility functions for TimeAxis.
   * @class
   */
  const TimeAxisUtils = {
    /**
     * Returns true if rendering on a touch device.
     * @return {boolean}
     */
    supportsTouch: () => {
      return dvt.Agent.isTouchDevice();
    },

    /**
     * Converts time to position given time range and width of the range
     * @param {number} startTime The start time in millis
     * @param {number} endTime The end time in millis
     * @param {number} time The time in question
     * @param {number} width The width of the time range
     * @return {number} The position relative to the width of the element
     */
    getDatePosition: (startTime, endTime, time, width) => {
      var number = (time - startTime) * width;
      var denominator = endTime - startTime;
      if (number === 0 || denominator === 0) return 0;

      return number / denominator;
    },

    /**
     * Converts position to time given the time range and width of the range
     * @param {number} startTime The start time in millis
     * @param {number} endTime The end time in millis
     * @param {number} pos The position in question
     * @param {number} width The width of the time range
     * @return {number} time in millis
     */
    getPositionDate: (startTime, endTime, pos, width) => {
      var number = pos * (endTime - startTime);
      if (number === 0 || width === 0) return startTime;

      return number / width + startTime;
    }
  };

  /**
   * Renderer for TimeAxis.
   * @class
   */
  const DvtTimeAxisRenderer = {
    /**
     * Renders the given viewport of the time axis (top left corner at (0,0)).
     * @param {TimeAxis} timeAxis The timeAxis being rendered.
     * @param {number} viewStartTime The start time of the viewport.
     * @param {number} viewEndTime The end time of the viewport.
     * @param {Object} referenceObjects Shape { referenceObjects, defaultStyleClass?, defaultStroke? }.
     *     Only lines with labels are rendered, all other reference objects are ignored.
     *     defaultStyleClass is prepended to any svgClassName if given (e.g. for Gantt),
     *     and defaultStroke is a dvt.Stroke instance that is applied to the line if given (e.g. for Timeline).
     *     If in the future Timeline reference objects support svgStyle and svgClassName, and directly use CSS classes, then
     *     we may be able to streamline styling and get rid of defaultStyleClass and defaultStroke.
     * @param {boolean=} throttle Whether to throttle the rendering with requestAnimationFrame. Default false.
     *    Throttling is useful on high fire rate interactions such as scroll.
     *    I notice it's slightly smoother on across Chrome/Safari/Firefox compared to without
     *    On Firefox, if this is not done, mouse wheel zoom bugs out sometimes and scrolls the page, so throttling is a must.
     */
    renderTimeAxis: (timeAxis, viewStartTime, viewEndTime, referenceObjects, throttle) => {
      if (!timeAxis.hasValidOptions()) {
        return;
      }

      const render = () => {
        // Start fresh; possible future improvement is to do efficient diffing
        timeAxis.removeChildren();

        DvtTimeAxisRenderer._renderBackground(timeAxis);
        const tickLabelsContainer = new dvt.Container(timeAxis.getCtx());

        // dates.length >= 2 always, because there's always the first and last tick.
        const dates = timeAxis.getViewportDates(timeAxis.getScale(), viewStartTime, viewEndTime);
        const datePositions = dates.map((date) => {
          return {
            date: date,
            pos: TimeAxisUtils.getDatePosition(
              timeAxis._start,
              timeAxis._end,
              date.getTime(),
              timeAxis._contentLength
            )
          };
        });

        // We don't need the label of the last tick.
        const labelTexts = timeAxis
          .getDateLabelTexts(dates, timeAxis.getScale())
          .slice(0, dates.length - 1);
        const labelOutputTexts = DvtTimeAxisRenderer._renderLabels(
          tickLabelsContainer,
          timeAxis,
          datePositions,
          labelTexts
        );

        // Add container to DOM before rendering ref objects due to dependence on computedStyles and dimension measurements for collision detection
        timeAxis._axis.addChild(tickLabelsContainer);
        const datesOverlappingRefObjs = DvtTimeAxisRenderer._renderReferenceObjects(
          tickLabelsContainer,
          timeAxis,
          referenceObjects,
          datePositions,
          labelOutputTexts
        );

        let tickDates = dates;

        // Determine whether to render secondary major ticks
        let showMajorTicks = false;
        const majorAxis = timeAxis.Options._secondaryAxis;
        let majorViewportDates = majorAxis
          ? majorAxis.getViewportDates(majorAxis.getScale(), viewStartTime, viewEndTime)
          : [];
        if (majorAxis && timeAxis.getCtx().getThemeBehavior() !== 'alta') {
          // TODO: Unify this logic with the similar part in DvtGanttRenderer._renderVerticalGridline.
          // This is a "nice to have" implementation detail. Tracked by JET-46323.
          // We can't easily do this right now because timeaxis rendering is virtualized, but vertical gridlines are not.
          // In the future also virtualize vertical gridlines rendering and drive both from a single source of truth.
          const minorViewportDates = dates;
          // If major dates is a subset of minor dates, then the two grids line up. Don't render the minor dates at overlap (due to opacity, minor line would show through major line otherwise).
          // Otherwise the major and minor axis do not "line up" (e.g. months and weeks scale together). Render minor lines only.
          const majorViewportDatesSet = new Set(majorViewportDates.map((d) => d.getTime()));
          const minorViewportDatesSet = new Set(minorViewportDates.map((d) => d.getTime()));
          // only consider major dates that are in range (e.g. first and/or last ticks may be out of range)
          showMajorTicks =
            majorViewportDates.filter(
              (d) =>
                d.getTime() > viewStartTime &&
                d.getTime() < viewEndTime &&
                !minorViewportDatesSet.has(d.getTime())
            ).length === 0;
          tickDates = showMajorTicks
            ? minorViewportDates.filter((d) => !majorViewportDatesSet.has(d.getTime()))
            : minorViewportDates;
        }

        // Render ticks (excluding those that collide with reference object labels)
        const tickDatePositions = tickDates
          .filter((d) => !datesOverlappingRefObjs.has(d.getTime()))
          .map((date) => {
            return {
              date: date,
              pos: TimeAxisUtils.getDatePosition(
                timeAxis._start,
                timeAxis._end,
                date.getTime(),
                timeAxis._contentLength
              )
            };
          });
        DvtTimeAxisRenderer._renderTicks(tickLabelsContainer, timeAxis, tickDatePositions);

        if (showMajorTicks) {
          const majorDatePositions = majorViewportDates
            .filter((d) => !datesOverlappingRefObjs.has(d.getTime()))
            .map((date) => {
              return {
                date: date,
                pos: TimeAxisUtils.getDatePosition(
                  timeAxis._start,
                  timeAxis._end,
                  date.getTime(),
                  timeAxis._contentLength
                )
              };
            });
          DvtTimeAxisRenderer._renderTicks(tickLabelsContainer, majorAxis, majorDatePositions);
        }
      };

      if (throttle) {
        // Modelled after https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event#Example
        if (!timeAxis.__isRendering) {
          requestAnimationFrame(() => {
            render();
            // eslint-disable-next-line no-param-reassign
            timeAxis.__isRendering = false;
          });
          // eslint-disable-next-line no-param-reassign
          timeAxis.__isRendering = true;
        }
      } else {
        render();
      }
    },

    /**
     * Renders the time axis block, draws a border around it.
     * @param {TimeAxis} timeAxis The timeAxis being rendered.
     * @private
     */
    _renderBackground: (timeAxis) => {
      const axisStart = 0;
      const axisSize = timeAxis.getSize();
      const context = timeAxis.getCtx();

      if (timeAxis._axis) {
        timeAxis._axis.setClipPath(null);
      }
      const cp = new dvt.ClipPath();
      if (timeAxis.isVertical()) {
        // eslint-disable-next-line no-param-reassign
        timeAxis._axis = new dvt.Path(
          context,
          dvt.PathUtils.roundedRectangle(
            axisStart,
            -timeAxis.getBorderWidth('top'),
            axisSize,
            timeAxis.getAxisLength(),
            0,
            0,
            0,
            0
          ),
          'axis'
        );
        cp.addRect(axisStart, 0, axisSize, timeAxis._contentLength);
      } else {
        // eslint-disable-next-line no-param-reassign
        timeAxis._axis = new dvt.Path(
          context,
          dvt.PathUtils.roundedRectangle(
            -timeAxis.getBorderWidth('left'),
            axisStart,
            timeAxis.getAxisLength(),
            axisSize,
            0,
            0,
            0,
            0
          ),
          'axis'
        );
        cp.addRect(0, axisStart, timeAxis._contentLength, axisSize);
      }
      timeAxis._axis.setCSSStyle(timeAxis._axisStyle);
      // setCSSStyle doesn't actually apply styles for dvt.Path. Adopt the logic from dvt.Rect:
      const elem = timeAxis._axis.getElem();
      let val = timeAxis._axisStyle.getStyle('background-color');
      if (val) {
        dvt.ToolkitUtils.setAttrNullNS(elem, 'fill', val);
      }
      val = timeAxis._axisStyle.getStyle('border-color');
      if (val) {
        dvt.ToolkitUtils.setAttrNullNS(elem, 'stroke', val);
      }
      val = timeAxis._axisStyle.getStyle('border-width');
      if (val) {
        dvt.ToolkitUtils.setAttrNullNS(elem, 'stroke-width', val);
      }

      timeAxis._axis.setPixelHinting(true);
      timeAxis._axis.setClipPath(cp);

      timeAxis.addChild(timeAxis._axis);

      const axisClass = DvtTimeAxisStyleUtils.getAxisClass(timeAxis.Options) || '';
      timeAxis._axis.getElem().setAttribute('class', axisClass);

      // apply stroke dash array to turn on/off border sides accordingly
      timeAxis._axis.getElem().setAttribute('stroke-dasharray', timeAxis.calcStrokeDashArray());
    },

    /**
     * Renders the tick marks at the given the dates/positions.
     * @param {dvt.Container} container The container to render into.
     * @param {TimeAxis} timeAxis The timeAxis being rendered.
     * @param {Array} datePositions Array of objects representing the date and position for each tick, each of shape { date: Date, pos: number }. Length must be >= 2.
     * @private
     */
    _renderTicks: (container, timeAxis, datePositions) => {
      // Build Path command of tick marks
      const context = timeAxis.getCtx();
      const isRTL = dvt.Agent.isRightToLeft(context);
      const axisSizeStart = timeAxis.isVertical()
        ? timeAxis.getBorderWidth('left')
        : timeAxis.getBorderWidth('top');
      const axisSizeEnd = axisSizeStart + timeAxis.getContentSize();

      // Refer to comment block in DvtGanttRenderer._renderVerticalGridline on why there's the 0.5 rounding for the
      // first/last tick in LTR/RTL
      let cmds = '';
      for (let i = 0; i < datePositions.length; i++) {
        let pos = datePositions[i].pos;
        if (timeAxis.isVertical()) {
          cmds +=
            dvt.PathUtils.moveTo(axisSizeStart, pos) + dvt.PathUtils.horizontalLineTo(axisSizeEnd);
        } else if (!isRTL) {
          if (i === 0) {
            pos = Math.round(pos) + 0.5;
          }
          cmds +=
            dvt.PathUtils.moveTo(pos, axisSizeStart) + dvt.PathUtils.verticalLineTo(axisSizeEnd);
        } else {
          pos = timeAxis._contentLength - pos;
          if (i === datePositions.length - 1) {
            pos = Math.round(pos) + 0.5;
          }
          cmds +=
            dvt.PathUtils.moveTo(pos, axisSizeStart) + dvt.PathUtils.verticalLineTo(axisSizeEnd);
        }
      }

      // Render ticks as a single giant Path
      const ticks = new dvt.Path(timeAxis.getCtx(), cmds);
      const separatorStyle = new dvt.CSSStyle(
        DvtTimeAxisStyleUtils.getAxisSeparatorStyle(timeAxis.Options)
      );
      ticks.setStroke(new dvt.Stroke(separatorStyle.getStyle(dvt.CSSStyle.COLOR)));
      ticks.setPixelHinting(true);

      const separatorClass = DvtTimeAxisStyleUtils.getAxisSeparatorClass(timeAxis.Options) || '';
      ticks.getElem().setAttribute('class', separatorClass);

      container.addChild(ticks);
    },

    /**
     * Renders labels given the tick dates/positions and corresponding label strings.
     * @param {dvt.Container} container The container to render into.
     * @param {TimeAxis} timeAxis The timeAxis being rendered.
     * @param {Array} datePositions Array of objects representing the date and position for each tick, each of shape { date: Date, pos: number }. Length must be >= 2.
     * @param {Array} labelTexts Array of label strings.
     * @return {Array} Array of label OutputText
     * @private
     */
    _renderLabels: (container, timeAxis, datePositions, labelTexts) => {
      const context = timeAxis.getCtx();
      const axisStart = timeAxis.isVertical()
        ? timeAxis.getBorderWidth('left')
        : timeAxis.getBorderWidth('top');
      const axisEnd = axisStart + timeAxis.getContentSize();
      const isRTL = dvt.Agent.isRightToLeft(context);
      const labelStyle = DvtTimeAxisStyleUtils.getAxisLabelStyle(timeAxis.Options);
      const labelClass = DvtTimeAxisStyleUtils.getAxisLabelClass(timeAxis.Options) || '';
      const scale = timeAxis.getScale();
      const labelPosition =
        timeAxis.Options._scaleLabelPosition[
          timeAxis.isTimeComponentScale(scale) ? scale.name : scale
        ];
      const labelAlignment =
        timeAxis.Options._labelAlignment[timeAxis.isVertical() ? 'vertical' : 'horizontal'];

      const labelOutputTexts = [];
      for (let i = 0; i < datePositions.length - 1; i++) {
        const currentPos = datePositions[i].pos;
        const nextPos = datePositions[i + 1].pos;

        const label = new dvt.OutputText(context, labelTexts[i], 0, 0);
        labelOutputTexts.push(label);
        label.setCSSStyle(labelStyle);
        label.getElem().setAttribute('class', labelClass);

        // in vertical mode, leave date positions the same in RTL
        const timeCenterPos = !(isRTL && !timeAxis.isVertical())
          ? currentPos + (nextPos - currentPos) / 2
          : timeAxis._contentLength - (currentPos + (nextPos - currentPos) / 2);
        const sizeCenterPos = axisStart + (axisEnd - axisStart) / 2;
        let y = timeAxis.isVertical() ? timeCenterPos : sizeCenterPos;
        let x;
        switch (labelPosition) {
          case 'start':
            if (timeAxis.isVertical()) {
              x = sizeCenterPos;
              label.alignCenter();
            } else if (isRTL) {
              x =
                timeAxis._contentLength -
                (currentPos + DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_PADDING);
              label.alignRight();
            } else {
              x = currentPos + DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_PADDING;
              label.alignLeft();
            }
            break;
          case 'center':
          default:
            x = timeAxis.isVertical() ? sizeCenterPos : timeCenterPos;
            label.alignCenter();
        }

        label.setX(x);
        switch (labelAlignment) {
          case 'top':
            label.setY(axisStart);
            break;
          case 'middle':
          default:
            dvt.TextUtils.centerTextVertically(label, y);
        }

        const maxSize = timeAxis.getContentSize();
        const maxLength = nextPos - currentPos;
        const maxLabelWidth = timeAxis.isVertical() ? maxSize : maxLength;
        const maxLabelHeight = timeAxis.isVertical() ? maxLength : maxSize;

        dvt.TextUtils.fitText(label, maxLabelWidth, maxLabelHeight, container);

        // Truncate first/last labels overlapping overall start/end if needed:
        // To take into account the case where the interval is not fully shown due to start/end edge and label is truncated,
        // we need to manually calculate label placement
        if (!timeAxis.isVertical()) {
          if (i === 0 && datePositions[i].date.getTime() < timeAxis._start) {
            if (label.isTruncated()) {
              label.setTextString(label.getUntruncatedTextString());
            }
            const labelWidth = label.getDimensions().w;
            let adjustedMaxLength;
            switch (labelPosition) {
              case 'start':
                adjustedMaxLength =
                  nextPos -
                  Math.max(
                    0,
                    nextPos -
                      currentPos -
                      labelWidth -
                      DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_PADDING * 2
                  );
                break;
              case 'center':
              default:
                adjustedMaxLength = nextPos - Math.max(0, (nextPos - currentPos - labelWidth) / 2);
            }
            const horizPos = Math.max(0, adjustedMaxLength);
            if (!isRTL) {
              label.alignRight();
              label.setX(horizPos);
            } else {
              label.alignLeft();
              label.setX(timeAxis._contentLength - horizPos);
            }
            const fit = dvt.TextUtils.fitText(label, adjustedMaxLength, maxLabelHeight, container);
            if (label.isTruncated() && fit) {
              // label truncated from the back at this point. Since truncation from the start is desired,
              // manually move the ellipsis to the front and add/remove characters accordingly
              const textString = label.getTextString();
              const untruncatedTextString = label.getUntruncatedTextString();
              if (textString !== untruncatedTextString) {
                const numTruncatedChars = label.getTextString().length - 1;
                const indexEnd = untruncatedTextString.length;
                const indexStart = Math.max(0, indexEnd - numTruncatedChars);
                const truncatedStartString =
                  dvt.OutputText.ELLIPSIS + untruncatedTextString.substring(indexStart, indexEnd);
                label.setTextString(truncatedStartString);
              }
            }
          } else if (
            i === datePositions.length - 2 &&
            datePositions[i + 1].date.getTime() > timeAxis._end
          ) {
            if (label.isTruncated()) {
              label.setTextString(label.getUntruncatedTextString());
            }
            let adjustedMaxLength;
            let horizPos;
            switch (labelPosition) {
              case 'start':
                adjustedMaxLength =
                  timeAxis._contentLength -
                  currentPos -
                  DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_PADDING * 2;
                horizPos = currentPos + DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_PADDING;
                break;
              case 'center':
              default: {
                const labelWidth = label.getDimensions().w;
                adjustedMaxLength =
                  timeAxis._contentLength -
                  currentPos -
                  Math.max(0, (nextPos - currentPos - labelWidth) / 2);
                horizPos = Math.max(
                  currentPos,
                  currentPos + (nextPos - currentPos) / 2 - labelWidth / 2
                );
              }
            }
            if (!isRTL) {
              label.alignLeft();
              label.setX(horizPos);
            } else {
              label.alignRight();
              label.setX(timeAxis._contentLength - horizPos);
            }
            dvt.TextUtils.fitText(label, adjustedMaxLength, maxLabelHeight, container);
          }
        }
      }
      return labelOutputTexts;
    },

    /**
     * Renders reference lines with labels on the axis. Also removes axis labels that overlap the line label.
     * @param {dvt.Container} container The container to render into.
     * @param {TimeAxis} timeAxis The timeAxis being rendered.
     * @param {Object} referenceObjects Shape { referenceObjects, defaultStyleClass?, defaultStroke? }.
     *     Only lines with labels are rendered, all other reference objects are ignored.
     *     defaultStyleClass is prepended to any svgClassName if given (e.g. for Gantt),
     *     and defaultStroke is a dvt.Stroke instance that is applied to the line if given (e.g. for Timeline).
     *     If in the future Timeline reference objects support svgStyle and svgClassName, and directly use CSS classes, then
     *     we may be able to streamline styling and get rid of defaultStyleClass and defaultStroke.
     * @param {Array} datePositions Array of objects representing the date and position for each tick, each of shape { date: Date, pos: number }.
     * @param {Array} labelOutputTexts Array of axis label OutputTexts.
     * @return {Set} Set of dates (in time number) that overlap the reference line labels.
     * @private
     */
    _renderReferenceObjects: (
      container,
      timeAxis,
      referenceObjects,
      datePositions,
      labelOutputTexts
    ) => {
      if (timeAxis.isVertical()) {
        return new Set();
      }

      const context = timeAxis.getCtx();
      const isRTL = dvt.Agent.isRightToLeft(context);
      const axisSizeStart = 0;
      const axisSizeEnd = axisSizeStart + timeAxis.getContentSize();
      const defaultStyleClass = referenceObjects.defaultStyleClass || '';
      const labelStyle = DvtTimeAxisStyleUtils.getAxisLabelStyle(timeAxis.Options);
      const labelClass = DvtTimeAxisStyleUtils.getAxisLabelClass(timeAxis.Options) || '';
      const labelAlignment = timeAxis.Options._labelAlignment['horizontal'];

      const refLinesWithLabel = referenceObjects.referenceObjects.filter((refObj) => {
        const isLine = refObj.type !== 'area';
        const isValidDate = refObj.value != null && !isNaN(new Date(refObj.value).getTime());
        const hasLabel = refObj.label && refObj.label.length !== '';
        return isLine && isValidDate && hasLabel;
      });

      const refLabels = [];
      refLinesWithLabel.forEach((refObj) => {
        let datePosition = TimeAxisUtils.getDatePosition(
          timeAxis._start,
          timeAxis._end,
          new Date(refObj.value).getTime(),
          timeAxis._contentLength
        );
        if (isRTL) {
          datePosition = timeAxis._contentLength - datePosition;
        }

        // Render line
        const ref = new dvt.Line(context, datePosition, axisSizeStart, datePosition, axisSizeEnd);

        const svgStyle = refObj.svgStyle;
        const svgClassName = refObj.svgClassName || '';
        if (svgStyle != null) {
          ref.setStyle(svgStyle);
        }
        ref.setClassName(defaultStyleClass + ' ' + svgClassName, true);

        if (referenceObjects.defaultStroke) {
          ref.setStroke(referenceObjects.defaultStroke);
        }

        ref.setPixelHinting(true);
        container.addChild(ref);

        // Render label
        const labelX = !isRTL
          ? datePosition + DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_PADDING
          : datePosition - DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_PADDING;
        const label = new dvt.OutputText(context, refObj.label, labelX, 0);
        label.setCSSStyle(labelStyle);
        label.getElem().setAttribute('class', labelClass);

        // apply line color to label
        const lineColor = window.getComputedStyle(ref.getElem()).getPropertyValue('stroke');
        label.setStyle({ fill: lineColor });

        if (!isRTL) {
          label.alignLeft();
        } else {
          label.alignRight();
        }
        const y = axisSizeStart + (axisSizeEnd - axisSizeStart) / 2;
        switch (labelAlignment) {
          case 'top':
            label.setY(axisSizeStart);
            break;
          case 'middle':
          default:
            dvt.TextUtils.centerTextVertically(label, y);
        }

        container.addChild(label);
        refLabels.push(label);
      });

      // Remove time axis labels that overlap with ref line labels
      // Also return the tick positions that overlap the ref line labels
      const datePosOverlappingRefObjs = [];
      refLabels.forEach((refLabel) => {
        const refLabelDim = refLabel.getDimensions();
        labelOutputTexts.forEach((axisLabel) => {
          const axisLabelDim = axisLabel.getDimensions();
          if (refLabelDim.intersects(axisLabelDim)) {
            axisLabel.removeFromParent();
          }
        });
        datePositions.forEach((datePos) => {
          const pos = !isRTL ? datePos.pos : timeAxis._contentLength - datePos.pos;
          if (pos >= refLabelDim.x && pos <= refLabelDim.x + refLabelDim.w) {
            datePosOverlappingRefObjs.push(datePos.date.getTime());
          }
        });
      });
      return new Set(datePosOverlappingRefObjs);
    }
  };

  /**
   * TimeAxis component. Use the newInstance function to instantiate.
   * @param {dvt.Context} context The rendering context.
   * @param {function} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @class
   * @constructor
   * @extends {dvt.BaseComponent}
   */

  class TimeAxis extends dvt.BaseComponent {
    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);
      this._calendar = new DvtTimeAxisCalendar();
      this._borderWidth = DvtTimeAxisStyleUtils.DEFAULT_BORDER_WIDTH;
      this.setBorderVisibility(false, false, false, false);
      this._dateToIsoWithTimeZoneConverter =
        context.getLocaleHelpers()['dateToIsoWithTimeZoneConverter'];

      // Create the defaults object
      this.Defaults = new DvtTimeAxisDefaults(context);
    }

    /**
     * @override
     */
    SetOptions(options) {
      // Combine the user options with the defaults and store
      this.Options = this.Defaults.calcOptions(options);
    }

    /**
     * Parses options object.
     * @param {object} options The object containing specifications and data for this component.
     * @return {object} properties object.
     */
    Parse(options) {
      this._parser = new DvtTimeAxisParser();
      return this._parser.parse(options);
    }

    /**
     * Applies the specified properties on the component.
     * @param {object} props The properties object
     * @private
     */
    _applyParsedProperties(props) {
      var orientation = props.orientation;
      if (orientation && orientation === 'vertical') this._isVertical = true;
      else this._isVertical = false;

      this.setIsVertical(this._isVertical);

      this._shortDesc = props.shortDesc;

      // zoom implementation handles shortest value first,
      // so zoom order needs to be reversed.
      // Due to custom timescales, zoomOrder is no longer (deep) cloned, so we need to reverse a shallow clone.
      this._zoomOrder = props.zoomOrder ? props.zoomOrder.slice().reverse() : [props.scale]; // else no zooming. set zoom order to only have 1 scale.

      this._customTimeScales = props.customTimeScales;
      this._customFormatScales = props.customFormatScales;

      this._start = props.start;
      this._end = props.end;

      this._inlineStyle = props.inlineStyle;

      this._scale = props.scale;
      this._converter = props.converter;

      this.applyStyleValues();
    }

    /**
     * Sets the length of the content.
     * @param {number} length The new content length
     * @param {number=} minLength The minimum content length
     */
    setContentLength(length, minLength) {
      if (typeof minLength === 'undefined' || minLength === null) minLength = this._canvasLength;
      if (minLength < length) this._contentLength = length;
      else this._contentLength = minLength;
    }

    /**
     * Gets axis length as used in renderer.
     * @return {number} The axis length.
     */
    getAxisLength() {
      return this._axisLength;
    }

    /**
     * Returns whether in RTL mode
     * @return {boolean}
     */
    isRTL() {
      return dvt.Agent.isRightToLeft(this.getCtx());
    }

    /**
     * Returns whether in vertical orientation
     * @return {boolean} true if vertical orientation, false if horizontal
     */
    isVertical() {
      return this._isVertical;
    }

    /**
     * Renders the component with the specified data.  If no data is supplied to a component
     * that has already been rendered, the component will be rerendered to the specified size.
     * Regarding options parameter:
     *     Standalone component:
     *         1. Initial render: options is available.
     *         2. Rerenders (e.g. due to resize): options is null.
     *     Inside Gantt/Timeline:
     *         1. Initial prep: options is the bundled options contructured by the parent time component.
     *         1. Initial render: options only contains _viewStartTime and _viewEndTime that defines the visible viewport.
     *              and _throttle to signify whether render should be throttled with requestAnimationFrame.
     *         2. Rerenders: Same, options contains only _viewStartTime, _viewEndTime, _throttle.
     * @param {object} options The object containing specifications and data for this component.
     * @param {number} width The width of the component.
     * @param {number} height The height of the component.
     */
    render(options, width, height) {
      // Whether this is a standalone component render/resize
      var isComponentRender = options && options._viewStartTime == null;
      var isResizeRender = options == null;

      this.Width = width;
      this.Height = height;
      this._prepareCanvasViewport();

      if (isComponentRender) {
        this.getPreferredLength(options, this._canvasLength);
      }

      this.setContentLength(this._canvasLength);
      this._setAxisDimensions();

      var viewStartTime = options && options._viewStartTime ? options._viewStartTime : this._start;
      var viewEndTime = options && options._viewEndTime ? options._viewEndTime : this._end;
      var referenceObjects =
        options && options._referenceObjects ? options._referenceObjects : { referenceObjects: [] };
      var throttle = (options && options._throttle) || false;
      DvtTimeAxisRenderer.renderTimeAxis(
        this,
        viewStartTime,
        viewEndTime,
        referenceObjects,
        throttle
      );

      // Done rendering...fire the ready event for standalone component case
      if (isComponentRender || isResizeRender) {
        this.RenderComplete();
      }
    }

    /**
     * Helper method to decide whether or not the options are valid.
     * @return {boolean} Whether this timeAxis has valid options.
     */
    hasValidOptions() {
      var hasValidScale =
        this._scale &&
        (TimeAxis.VALID_SCALES.indexOf(this._scale) !== -1 || this.isTimeComponentScale(this._scale));
      var hasValidCustomScale =
        this._scale && this._customTimeScales && this._customTimeScales[this._scale];
      var hasValidStartAndEnd = this._start && this._end && this._end > this._start;

      return (hasValidScale || hasValidCustomScale) && hasValidStartAndEnd;
    }

    /**
     * Helper method to decide whether or not the scale is an instance of the DvtTimeComponentScale interface
     * @return {boolean} Whether this scale is an instance of the DvtTimeComponentScale interface
     */
    isTimeComponentScale(scale) {
      return (
        scale.getNextDate != null &&
        scale.getPreviousDate != null &&
        scale.formatter != null &&
        scale.name != null
      );
    }

    /**
     * Helper method to decide whether or not the scale is an instance of the DvtTimeComponentScale interface
     * @return {boolean} Whether this scale is an instance of the DvtTimeComponentScale interface
     */
    isEqualScale(scale1, scale2) {
      return (
        scale1 === scale2 || (scale1.name != null && scale2 != null && scale1.name === scale2.name)
      );
    }

    /**
     * Applies style on the axis.
     */
    applyStyleValues() {
      this._axisStyle = new dvt.CSSStyle(DvtTimeAxisStyleUtils.getAxisStyle(this.Options));
      this._axisStyle.parseInlineStyle(this._inlineStyle);

      // double border width to account for stroke width rendering
      var axisBorderWidth = this._axisStyle.getBorderWidth();
      var borderStyle = 'border:' + axisBorderWidth * 2 + 'px;';
      this._axisStyle.parseInlineStyle(borderStyle);

      this.setBorderWidth(axisBorderWidth);
    }

    /**
     * Calculate orientation indepedent canvas dimensions.
     * @private
     */
    _prepareCanvasViewport() {
      if (this._isVertical) {
        // The size of the canvas viewport
        this._canvasLength = this.Height;
        this._canvasSize = this.Width;
      } else {
        // The size of the canvas viewport
        this._canvasLength = this.Width;
        this._canvasSize = this.Height;
      }
    }

    /**
     * Finalize axis dimensions with border/separator widths and any missing size dimensions.
     * @private
     */
    _setAxisDimensions() {
      if (this._canvasSize !== null)
        this.setContentSize(this._canvasSize - this.getSizeBorderWidth());
      this._axisLength =
        this._contentLength +
        this.getSizeBorderWidth() -
        DvtTimeAxisStyleUtils.DEFAULT_SEPARATOR_WIDTH;
    }

    /**
     * Returns the preferred content/axis length given the minimum viewport length (canvas width if
     * horizontal, canvas height if vertical).
     * @param {object} options The object containing specifications and data for this component.
     * @param {number} minViewPortLength The minimum viewport length.
     * @return {number} The suggested TimeAxis length.
     */
    getPreferredLength(options, minViewPortLength) {
      // ensure options is updated
      this.SetOptions(options);

      this._resources = this.Options['_resources'] ? this.Options['_resources'] : [];
      this._locale = this.Options['_locale'] ? this.Options['_locale'] : 'en-US';

      // default to sunday
      var firstDayOfWeek = this._resources['firstDayOfWeek'] ? this._resources['firstDayOfWeek'] : 0;
      this._calendar.setFirstDayOfWeek(firstDayOfWeek);

      if (!this._dateToIsoWithTimeZoneConverter)
        this._dateToIsoWithTimeZoneConverter =
          this.getCtx().getLocaleHelpers()['dateToIsoWithTimeZoneConverter'];

      var props = this.Parse(this.Options);
      this._applyParsedProperties(props);

      if (this.hasValidOptions()) {
        this.setConverter(this._converter);

        if (this._isVertical) {
          this.setDefaultConverter(this._resources['converterVert']);
        } else {
          this.setDefaultConverter(this._resources['converter']);
        }

        this._zoomLevelLengths = this._zoomOrder.map(() => {
          return 0;
        });
        // update dimensions for all zoom levels, by sampling dates across the entire time range
        var allZoomLevelOrders = this._zoomOrder.map((_, i) => {
          return i;
        });
        // In the horizontal case, we can sparsely sample, and estimate the largests label width
        // This should work in many cases, and even if we're wrong and cause a label truncation,
        // users can manually zoom in further to see the full label.
        // In the vertical case however, we still need to compute ALL labels to determine the
        // time axis width that would fit all the labels. We need to be 100% sure because if a label
        // is truncated, there's no way to see the full label in the vertical case.
        var samplingStrategy = this._isVertical
          ? {
              type: 'range',
              params: { startTime: this._start, endTime: this._end }
            }
          : {
              type: 'sparse',
              // 4 sections and 10 interval sections is arbitrary, which samples some labels at every quarter.
              // This is more than enough for the current default scales and labels because they're very equally spaced.
              // but this may not work well with weird custom scales such as reptitions of [3 weeks, 7 days, 2 months]
              // for a span of 1 year, in which case we may only see weeks and months in our sample, but not days,
              // and we underestimate the content lengths.
              // But even then, users may still be able to zoom in sufficiently to see everything they need.
              // If it turns out this doesn't work well for some common cases, we can bump these params up
              // to cover more intervals in the future.
              params: { numSections: 4, numIntervalsPerSection: 10 }
            };
        this._maxContentLength = minViewPortLength; // will be updated in updateDimensions();
        this.updateDimensions(allZoomLevelOrders, samplingStrategy, minViewPortLength);

        if (this._canvasSize !== null) {
          // standalone timeaxis case
          this._zoomLevelLengths[this._zoomLevelOrder] = minViewPortLength;
        }
      }

      return this._contentLength;
    }

    /**
     * Updates the time axis dimensions (content size, content length at each given zoom level, max content size)
     * using the given sampling strategy to obtain the dates to derive these dimensions from.
     * E.g. the exact dimensions can be obtained by considering ALL dates and labels in the axis time range
     * or approximations can be obtained by considering only a subset of the possible dates and labels.
     * @param {Array} zoomlevelOrders Array of zoom level indices
     * @param {object} samplingStrategy Object defining the sample strategy, either {type: 'range', params: {startTime: number, endTime: number}}
     * which means consider only dates within the given range, or {type: 'global', params: {numSections: number, numIntervalsPerSection: number}}
     * which means divide up the entire time axis into sections, and sample only some dates within those sections. See also _sampleIntervals().
     * @param {number=} minViewPortLength The minimum viewport length.
     */
    updateDimensions(zoomLevelOrders, samplingStrategy, minViewPortLength) {
      for (var i = 0; i < zoomLevelOrders.length; i++) {
        var zoomLevelOrder = zoomLevelOrders[i];
        if (zoomLevelOrder >= 0 && zoomLevelOrder < this._zoomOrder.length) {
          var scale = this._zoomOrder[zoomLevelOrder];
          if (this.isEqualScale(scale, this._scale)) {
            this._zoomLevelOrder = zoomLevelOrder;
          }
          var intervals;
          if (samplingStrategy.type === 'sparse') {
            // Rather than computing all dates (and labels) to obtain exact dimensions,
            // heuristically sample a subset of dates for better performance.
            // Assumption is that in many usecases, label widths have small variance.
            // Even if our estimation is off and cause a label trunction, users can manually zoom in to see the full label.
            intervals = this._sampleIntervals(
              scale,
              samplingStrategy.params.numSections,
              samplingStrategy.params.numIntervalsPerSection
            );

            // Estimate maxContentLength
            var intervalStartTimes = Object.keys(intervals);
            var avgTimePerInterval =
              intervalStartTimes.reduce((sum, prevTime) => {
                return sum + (intervals[prevTime] - prevTime);
              }, 0) / intervalStartTimes.length;
            var estNumIntervals = (this._end - this._start) / avgTimePerInterval;
            this._maxContentLength = Math.max(
              this._maxContentLength,
              estNumIntervals * minViewPortLength
            );
          } else {
            // Estimate dimensions from ALL dates and labels
            intervals = {};
            var viewportDates = this.getViewportDates(
              scale,
              samplingStrategy.params.startTime,
              samplingStrategy.params.endTime
            );
            for (var k = 0; k < viewportDates.length - 1; k++) {
              intervals[viewportDates[k].getTime()] = viewportDates[k + 1].getTime();
            }
            this._maxContentLength = Math.max(
              this._maxContentLength,
              Object.keys(intervals).length * minViewPortLength
            );
          }
          this._updateZoomLevelLength(zoomLevelOrder, intervals);
        }
      }

      this.setContentLength(this._zoomLevelLengths[this._zoomLevelOrder], minViewPortLength);
    }

    /**
     * Computes and updates the time axis dimensions for the given zoom level order, using the
     * given set of date intervals.
     * @param {number} zoomLevelOrder The zoom level index.
     * @param {object} representativeIntervals Object representing intervals of shape { [start time number]: end time number }
     * @private
     */
    _updateZoomLevelLength(zoomLevelOrder, representativeIntervals) {
      var context = this.getCtx();
      var cssStyle = DvtTimeAxisStyleUtils.getAxisLabelStyle(this.Options);
      var contentPadding = DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_PADDING * 2;
      var maxIntervalHeight =
        dvt.TextUtils.getTextStringHeight(this.getCtx(), cssStyle) + contentPadding;
      var scale = this._zoomOrder[zoomLevelOrder];

      var maxIntervalWidth = DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_WIDTH;
      var minTimeDimFactor = Infinity;
      var minHeightDimFactor = Infinity;

      Object.keys(representativeIntervals).forEach((prevTime) => {
        var currTime = representativeIntervals[prevTime];
        var labelText = this.formatDate(new Date(currTime), null, 'axis', scale);
        var contentWidth =
          dvt.TextUtils.getTextStringWidth(context, labelText, cssStyle) + contentPadding;
        maxIntervalWidth = Math.max(maxIntervalWidth, contentWidth);
        minTimeDimFactor = Math.min(minTimeDimFactor, (currTime - prevTime) / maxIntervalWidth);
        minHeightDimFactor = Math.min(minHeightDimFactor, (currTime - prevTime) / maxIntervalHeight);
      });

      var minLengthFactor = this._isVertical ? minHeightDimFactor : minTimeDimFactor;
      var zoomLevelLength = (this._end - this._start) / minLengthFactor;
      this._zoomLevelLengths[zoomLevelOrder] = zoomLevelLength;

      this.setContentSize(this._isVertical ? maxIntervalWidth : maxIntervalHeight);
    }

    /**
     * Returns a set of date intervals sampled using the following procedure:
     * 1. Divide up the time range into numSections sections
     * 2. For each section, take the first numIntervalsPerSection intervals from the start,
     *    plus the last interval of the section.
     * 3. Consolidate all of them and return
     * @param {string} scale The scale.
     * @param {number} numSections Number of sections
     * @param {number} numIntervalsPerSection Number of intervals per section
     * @return {object} Object representing intervals of shape { [start time number]: end time number }
     */
    _sampleIntervals(scale, numSections, numIntervalsPerSection) {
      // key: interval start time, value: interval end time
      // Use object key/value store to prevent duplicate intervals
      var intervals = {};

      var sectionInterval = Math.floor((this._end - this._start) / numSections);
      for (var i = 0; i < numSections; i++) {
        var sectionStartTime = this._start + sectionInterval * i;
        var sectionEndTime = Math.min(this._start + sectionInterval * (i + 1), this._end);

        var prevTime = this.adjustDate(sectionStartTime, scale).getTime();
        for (var j = 0; j < numIntervalsPerSection; j++) {
          if (prevTime >= sectionEndTime) {
            break;
          }
          var currTime = this.getNextDate(prevTime, scale).getTime();
          intervals[prevTime] = currTime;
          prevTime = currTime;
        }

        // Also consider last label at the end of the section
        prevTime = this.adjustDate(sectionEndTime - 1, scale).getTime();
        intervals[prevTime] = this.getNextDate(prevTime, scale).getTime();
      }

      return intervals;
    }

    /**
     * Returns an array of dates in the specified scale and viewport.
     * @param {string} scale The scale.
     * @param {number} viewStartTime The viewport start time in ms.
     * @param {number} viewEndTime The viewport end time in ms.
     * @return {Array<Date>} The array of dates in the viewport.
     */
    getViewportDates(scale, viewStartTime, viewEndTime) {
      const dates = [this.adjustDate(viewStartTime, scale)];
      while (dates[dates.length - 1].getTime() < viewEndTime) {
        dates.push(this.getNextDate(dates[dates.length - 1].getTime(), scale));
      }
      return dates;
    }

    /**
     * Returns an array of formatted date strings given an array of dates.
     * @param {Array<Date>} dates Array of dates.
     * @param {string} scale The scale.
     * @return {Array<string>} Corresponding formatted date strings.
     */
    getDateLabelTexts(dates, scale) {
      return dates.map((date) => {
        return this.formatDate(date, null, 'axis', scale);
      });
    }

    /**
     * Sets the current scale.
     * @param {string} scale The new scale.
     */
    setScale(scale) {
      this._scale = scale;
    }

    /**
     * Gets current scale.
     * @return {string} The current scale.
     */
    getScale() {
      return this._scale;
    }

    /**
     * Increases current scale by an order.
     * @return {boolean} whether successful
     */
    increaseScale() {
      for (var s = 0; s < this._zoomOrder.length - 1; s++) {
        if (this.isEqualScale(this._zoomOrder[s], this._scale)) {
          this._scale = this._zoomOrder[s + 1];
          return true;
        }
      }
      return false;
    }

    /**
     * Decreases current scale by an order.
     * @return {boolean} whether successful
     */
    decreaseScale() {
      for (var s = 1; s < this._zoomOrder.length; s++) {
        if (this._zoomOrder[s] === this._scale) {
          this._scale = this._zoomOrder[s - 1];
          return true;
        }
      }
      return false;
    }

    /**
     * Sets the converter.
     * @param {object} converter The new converter.
     */
    setConverter(converter) {
      this._converter = converter;
    }

    /**
     * Sets the default converter.
     * @param {object} defaultConverter The default converter.
     */
    setDefaultConverter(defaultConverter) {
      this._defaultConverter = defaultConverter;
    }

    /**
     * Gets the TimeAxis content size.
     * @return {number}
     */
    getContentSize() {
      return this._contentSize;
    }

    /**
     * Sets the TimeAxis content size.
     * @param {number} contentSize The TimeAxis content size
     */
    setContentSize(contentSize) {
      if (contentSize > this._contentSize) this._contentSize = contentSize;
    }

    /**
     * Sets the border width
     * @param {number} borderWidth The new border width
     */
    setBorderWidth(borderWidth) {
      this._borderWidth = borderWidth;
    }

    /**
     * Turns border sections on or off.
     * @param {boolean} top whether border top should be on/visible
     * @param {boolean} right whether border right should be on/visible
     * @param {boolean} bottom whether border bottom should be on/visible
     * @param {boolean} left whether border left should be on/visible
     */
    setBorderVisibility(top, right, bottom, left) {
      this._borderTopWidth = (top | 0) * this._borderWidth;
      this._borderRightWidth = (right | 0) * this._borderWidth;
      this._borderBottomWidth = (bottom | 0) * this._borderWidth;
      this._borderLeftWidth = (left | 0) * this._borderWidth;
    }

    /**
     * Calculates the appropriate stroke dasharray that reflects the border visibility.
     * @return {string} The stroke dasharray.
     */
    calcStrokeDashArray() {
      if (this._isVertical) {
        var borderLengths = {
          top: this.getSize(),
          right: this.getAxisLength(),
          bottom: this.getSize(),
          left: this.getAxisLength()
        };
      } else {
        borderLengths = {
          top: this.getAxisLength(),
          right: this.getSize(),
          bottom: this.getAxisLength(),
          left: this.getSize()
        };
      }

      var dashArray = [];
      var currentDashLength = 0;
      var currentDashState = true;
      var sideEvalOrder = ['top', 'right', 'bottom', 'left'];
      for (var i = 0; i < sideEvalOrder.length; i++) {
        var sideVisibility = this.getBorderWidth(sideEvalOrder[i]) > 0;
        if (sideVisibility === currentDashState) {
          currentDashLength += borderLengths[sideEvalOrder[i]];
        } else {
          dashArray.push(currentDashLength);
          currentDashLength = borderLengths[sideEvalOrder[i]];
          currentDashState = !currentDashState;
        }
      }
      dashArray.push(currentDashLength);
      return dashArray.toString();
    }

    /**
     * Gets the size dimension taken up by border width.
     * @return {number}
     */
    getSizeBorderWidth() {
      return this._borderTopWidth + this._borderBottomWidth;
    }

    /**
     * Gets the border width.
     * @param {string=} side The border side of interest.
     * @return {number}
     */
    getBorderWidth(side) {
      switch (side) {
        case 'top':
          return this._borderTopWidth;
        case 'right':
          return this._borderRightWidth;
        case 'bottom':
          return this._borderBottomWidth;
        case 'left':
          return this._borderLeftWidth;
        default:
          return this._borderWidth;
      }
    }

    /**
     * Gets the total TimeAxis size (content size with border).
     * @return {number}
     */
    getSize() {
      return this._contentSize + this.getSizeBorderWidth();
    }

    /**
     * Finds the closest date to the time scale of the specified date.
     * @param {Date | string | number} date The date in question.
     * @param {string=} scale The scale (optional). If not specified, the current scale is used.
     * @return {Date} date The date closest to the time scale of the date in question.
     */
    adjustDate(date, scale) {
      var scaleVal = scale || this._scale;
      if (this.isTimeComponentScale(scaleVal)) {
        return new Date(scaleVal.getPreviousDate(new Date(date)));
      }
      return this._calendar.adjustDate(new Date(date), scaleVal);
    }

    /**
     * Gets the next date an interval away from the specified time based on current scale.
     * @param {number} time The time in question in milliseconds
     * @param {string=} scale The scale (optional). If not specified, the current scale is used.
     * @return {Date} The next date
     */
    getNextDate(time, scale) {
      var scaleVal = scale || this._scale;
      if (this.isTimeComponentScale(scaleVal)) {
        return new Date(scaleVal.getNextDate(new Date(time)));
      }
      return this.getAdjacentDate(time, scaleVal, 'next');
    }

    /**
     * Gets the next or previous date an interval away from the specified time based on a given scale.
     * @param {number} time The time in question in milliseconds
     * @param {string | Object} scale
     * @param {string} direction Either 'next' or 'previous'
     * @return {Date} The adjacent date
     */
    getAdjacentDate(time, scale, direction) {
      var scaleVal = scale || this._scale;
      if (this.isTimeComponentScale(scaleVal)) {
        let nextDate = new Date(scaleVal.getNextDate(new Date(time)));
        if (direction === 'next') {
          return nextDate;
        }
        return new Date(time * 2 - nextDate);
      }
      return this._calendar.getAdjacentDate(time, scale, direction);
    }

    /**
     * Formats specified date. Two modes are supported: axis date formatting, and general purpose date formatting (controlled using converterType param).
     * An optional converter can be passed in. Otherwise, a default converter is used.
     * @param {Date} date The query date
     * @param {object=} converter Optional custom converter.
     * @param {string=} converterType Optional; 'axis' if for formatting axis labels, 'general' if for general date formatting. Defaults to 'axis'.
     * @param {string= | Object} scale Options; defaults to current scale
     * @return {string} The formatted date string
     */
    formatDate(date, converter, converterType, scale) {
      var scaleVal = scale || this.getScale(); // default to current scale
      if (this.isTimeComponentScale(scaleVal)) {
        return scaleVal.formatter(
          this._dateToIsoWithTimeZoneConverter ? this._dateToIsoWithTimeZoneConverter(date) : date
        );
      }

      converterType = converterType || 'axis'; // default converterType 'axis'

      if (converterType === 'axis') {
        converter = converter || this._converter; // if no converter passed in, try to use axis converter from options
        if (converter) {
          if (converter[scaleVal]) converter = converter[scaleVal];
          else if (converter['default']) converter = converter['default'];
        }
        // Use default scale converter (if available), if no converter available, or if the converter not usable for this scale.
        if (
          (!converter || !converter['format']) &&
          this._defaultConverter &&
          this._defaultConverter[scaleVal]
        )
          converter = this._defaultConverter[scaleVal];
      } else {
        // general formatting
        if (!converter) {
          // Retrieves converters passed in from the JET side (which should always be available).
          // The converters are automatically app locale aware and works on all supported browsers.
          var defaultDateTimeConverter = this._resources['defaultDateTimeConverter'];
          var defaultDateConverter = this._resources['defaultDateConverter'];
          if (scaleVal === 'hours' || scaleVal === 'minutes' || scaleVal === 'seconds') {
            converter = defaultDateTimeConverter;
          } else {
            converter = defaultDateConverter;
          }
        }
      }

      return converter['format'](
        this._dateToIsoWithTimeZoneConverter ? this._dateToIsoWithTimeZoneConverter(date) : date
      );
    }

    /**
     * Gets zoom order.
     * @return {string[]} current zoom order
     */
    getZoomOrder() {
      return this._zoomOrder;
    }

    /**
     * Sets content size based on orientation.
     * @param {boolean} isVertical Whether orientation is vertical.
     */
    setIsVertical(isVertical) {
      if (isVertical) this._contentSize = DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_WIDTH;
      else this._contentSize = DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_HEIGHT;
    }

    /**
     * Sets canvas size.
     * @param {number} canvasSize The new canvas size
     */
    setCanvasSize(canvasSize) {
      this._canvasSize = canvasSize;
    }

    /**
     * Gets zoom level lengths.
     * @return {number[]} zoom level lengths
     */
    getZoomLevelLengths() {
      return this._zoomLevelLengths;
    }

    /**
     * Gets max content length.
     * @return {number} The max content length
     */
    getMaxContentLength() {
      return this._maxContentLength;
    }

    /**
     * Gets current zoom order index.
     * @return {number} The current zoom order index
     */
    getZoomLevelOrder() {
      return this._zoomLevelOrder;
    }

    /**
     * Sets zoom order index.
     * @param {number} zoomLevelOrder The new zoom order index
     */
    setZoomLevelOrder(zoomLevelOrder) {
      this._zoomLevelOrder = zoomLevelOrder;
    }
  }

  /**
   * Attribute for valid scales.
   * @const
   */
  TimeAxis.VALID_SCALES = [
    'seconds',
    'minutes',
    'hours',
    'days',
    'weeks',
    'months',
    'quarters',
    'years'
  ];

  exports.TimeAxis = TimeAxis;
  exports.TimeAxisUtils = TimeAxisUtils;

  Object.defineProperty(exports, '__esModule', { value: true });

});
