/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojconverter-number'], function (exports, ojconverterNumber) { 'use strict';

  /**
   * Calculated axis information and drawable creation.  This class should
   * not be instantiated directly.
   * @class
   * @constructor
   * @extends {dvt.Obj}
   */
  class BaseAxisInfo {
    /**
     * Calculates and stores the axis information.
     * @param {dvt.Context} context
     * @param {object} options The object containing specifications and data for this component.
     * @param {dvt.Rectangle} availSpace The available space.
     * @protected
     */
    constructor(context, options, availSpace) {
      this._context = context;

      // Figure out the start and end coordinate of the axis
      this.Position = options.position;
      this._radius = options._radius; // for polar charts

      if (this.Position === 'top' || this.Position === 'bottom') {
        this.StartCoord = availSpace.x;
        this.EndCoord = availSpace.x + availSpace.w;
      } else if (this.Position === 'left' || this.Position === 'right') {
        this.StartCoord = availSpace.y;
        this.EndCoord = availSpace.y + availSpace.h;
      } else if (this.Position === 'radial') {
        this.StartCoord = 0;
        this.EndCoord = this._radius;
      } else if (this.Position === 'tangential') {
        if (options.isRTL) {
          this.StartCoord = 2 * Math.PI;
          this.EndCoord = 0;
        } else {
          this.StartCoord = 0;
          this.EndCoord = 2 * Math.PI;
        }
      }

      // Axis min and max value. Subclasses should set.
      this.MinValue = null;
      this.MaxValue = null;
      this.GlobalMin = null;
      this.GlobalMax = null;
      this.DataMin = null;
      this.DataMax = null;

      // The overflows at the two ends of the axis
      this.StartOverflow = 0;
      this.EndOverflow = 0;

      // Sets the buffers (the maximum amount the labels can go over before they overflow)
      if (options.leftBuffer == null) {
        options.leftBuffer = Infinity;
      }

      if (options.rightBuffer == null) {
        options.rightBuffer = Infinity;
      }

      // Store the options object
      this.Options = options;
    }

    /**
     * Returns the dvt.Context associated with this instance.
     * @return {dvt.Context}
     */
    getCtx() {
      return this._context;
    }

    /**
     * Returns the options settings for the axis.
     * @return {object} The options for the axis.
     */
    getOptions() {
      return this.Options;
    }

    /**
     * Returns the value for the specified coordinate along the axis.  Returns null
     * if the coordinate is not within the axis.
     * @param {number} coord The coordinate along the axis.
     * @return {object} The value at that coordinate.
     */
    getValAt(coord) {
      if (coord == null) {
        return null;
      }

      var minCoord = Math.min(this.StartCoord, this.EndCoord);
      var maxCoord = Math.max(this.StartCoord, this.EndCoord);

      // Return null if the coord is outside of the axis
      if (coord < minCoord || coord > maxCoord) {
        return null;
      }
      return this.getUnboundedValAt(coord);
    }

    /**
     * Returns the coordinate for the specified value.  Returns null if the value is
     * not within the axis.
     * @param {object} value The value to locate.
     * @return {number} The coordinate for the value.
     */
    getCoordAt(value) {
      if (value == null) {
        return null;
      }
      if (value < this.MinValue || value > this.MaxValue) {
        return null;
      }
      return this.getUnboundedCoordAt(value);
    }

    /**
     * Returns the value for the specified coordinate along the axis.  If a coordinate
     * is not within the axis, returns the value of the closest coordinate within the axis.
     * @param {number} coord The coordinate along the axis.
     * @return {object} The value at that coordinate.
     */
    getBoundedValAt(coord) {
      if (coord == null) {
        return null;
      }
      var cord = coord;
      var minCoord = Math.min(this.StartCoord, this.EndCoord);
      var maxCoord = Math.max(this.StartCoord, this.EndCoord);

      if (coord < minCoord) {
        cord = minCoord;
      } else if (coord > maxCoord) {
        cord = maxCoord;
      }
      return this.getUnboundedValAt(cord);
    }

    /**
     * Returns the coordinate for the specified value along the axis.  If a value
     * is not within the axis, returns the coordinate of the closest value within the axis.
     * @param {object} value The value to locate.
     * @return {number} The coordinate for the value.
     */
    getBoundedCoordAt(value) {
      if (value == null) {
        return null;
      }

      var val = value;
      if (value < this.MinValue) {
        val = this.MinValue;
      } else if (value >= this.MaxValue) {
        val = this.MaxValue;
      }

      return this.getUnboundedCoordAt(val);
    }

    /**
     * Returns the value for the specified coordinate along the axis.
     * @param {number} coord The coordinate along the axis.
     * @return {object} The value at that coordinate.
     */
    getUnboundedValAt(coord) {
      return null; // subclasses should override
    }

    /**
     * Returns the coordinate for the specified value.
     * @param {object} value The value to locate.
     * @return {number} The coordinate for the value.
     */
    getUnboundedCoordAt(value) {
      return null; // subclasses should override
    }
  }

  /**
   * Minimum buffer for horizontal axis.
   */
  BaseAxisInfo.MIN_AXIS_BUFFER = 10;

  /**
   * Calculated axis information and drawable creation for a data axis.
   * @param {dvt.Context} context
   * @param {object} options The object containing specifications and data for this component.
   * @param {dvt.Rectangle} availSpace The available space.
   * @class
   * @constructor
   * @extends {BaseAxisInfo}
   */
  const DataAxisInfoMixin = (Base) =>
    class extends Base {
      constructor(context, options, availSpace) {
        super(context, options, availSpace);

        /** @private @const */
        this.MAX_NUMBER_OF_GRIDS_AUTO = 10;
        /** @private @const */
        this.MINOR_TICK_COUNT = 2;

        /**
         * Constant used to address javascript floating point errors when calculating the majoriTick count
         * and generating the labels and coords. ()
         * @private
         * @const
         */
        this.MAJOR_TICK_INCREMENT_BUFFER = 0.0000000001;

        /** Minimum bar size for log scale; prevents tiny bar with values close to axis min
         * @private
         * @const
         * */
        this.MIN_BAR_SIZE_IN_LOG = 10;

        // Figure out the coords for the min/max values
        if (this.Position === 'top' || this.Position === 'bottom') {
          // Provide at least the minimum buffer at each side to accommodate labels
          if (options.tickLabel.rendered !== 'off' && options.rendered !== 'off') {
            this.StartOverflow = Math.max(BaseAxisInfo.MIN_AXIS_BUFFER - options.leftBuffer, 0);
            this.EndOverflow = Math.max(BaseAxisInfo.MIN_AXIS_BUFFER - options.rightBuffer, 0);
          }

          // Axis is horizontal, so flip for BIDI if needed
          if (options.isRTL) {
            this.MinCoord = this.EndCoord - this.EndOverflow;
            this.MaxCoord = this.StartCoord + this.StartOverflow;
          } else {
            this.MinCoord = this.StartCoord + this.StartOverflow;
            this.MaxCoord = this.EndCoord - this.EndOverflow;
          }
        } else if (this.Position === 'tangential' || this.Position === 'radial') {
          this.MinCoord = this.StartCoord;
          this.MaxCoord = this.EndCoord;
        } else {
          this.MinCoord = this.EndCoord;
          this.MaxCoord = this.StartCoord;
        }

        this.DataMin = options.dataMin;
        this.DataMax = options.dataMax;

        this.utilsLogOptions = options._utils && options.scale === 'log';
        this.IsLog =
          this.utilsLogOptions || (options.scale === 'log' && this.DataMin > 0 && this.DataMax > 0);

        this.LinearGlobalMin = this.actualToLinear(options.min);
        this.LinearGlobalMax = this.actualToLinear(options.max);
        this.LinearMinValue =
          options.viewportMin == null
            ? this.LinearGlobalMin
            : this.actualToLinear(options.viewportMin);
        this.LinearMaxValue =
          options.viewportMax == null
            ? this.LinearGlobalMax
            : this.actualToLinear(options.viewportMax);
        this._dataMin = this.actualToLinear(this.DataMin);
        this._dataMax = this.actualToLinear(this.DataMax);

        this.MajorIncrement = this.actualToLinear(options.step);
        this.MinorIncrement = this.actualToLinear(options.minorStep);
        this._minMajorIncrement = this.actualToLinear(options.minStep);
        this.MajorTickCount = options._majorTickCount;
        this.MinorTickCount = options._minorTickCount;

        this.LogScaleUnit = options._logScaleUnit;
        this.ZeroBaseline = !this.IsLog && options.baselineScaling === 'zero';
        this._continuousExtent = this.Options ? this.Options._continuousExtent === 'on' : null;

        this.Converter = null;
        if (options.tickLabel != null) {
          this.Converter = options.tickLabel.converter;
        }
        this._calcAxisExtents();

        this.GlobalMin = this.linearToActual(this.LinearGlobalMin);
        this.GlobalMax = this.linearToActual(this.LinearGlobalMax);
        this.MinValue = this.linearToActual(this.LinearMinValue);
        this.MaxValue = this.linearToActual(this.LinearMaxValue);
      }

      /**
       * @override
       */
      getBaselineCoord() {
        return this.IsLog ? this.MinCoord : this.getBoundedCoordAt(0);
      }

      /**
       * @override
       */
      getUnboundedValAt(coord) {
        if (coord == null) {
          return null;
        }
        var ratio = (coord - this.MinCoord) / (this.MaxCoord - this.MinCoord);
        var value = this.LinearMinValue + ratio * (this.LinearMaxValue - this.LinearMinValue);
        return this.linearToActual(value);
      }

      /**
       * @override
       */
      getUnboundedCoordAt(value) {
        return this.GetUnboundedCoordAt(this.actualToLinear(value));
      }

      /**
       * Returns the unbounded coord at the specified linearized value.
       * @param {number} value The linearized value.
       * @return {number}
       * @private
       */
      GetUnboundedCoordAt(value) {
        if (value == null) {
          return null;
        }
        var ratio =
          this.LinearMaxValue === this.LinearMinValue
            ? 0
            : (value - this.LinearMinValue) / (this.LinearMaxValue - this.LinearMinValue);
        // Make sure the the ratio is not way too large so the browser does not fail to render
        ratio = Math.max(Math.min(1000, ratio), -1000);
        return this.MinCoord + ratio * (this.MaxCoord - this.MinCoord);
      }

      /**
       * Determines the number of major and minor tick counts and increments for the axis if values were not given.
       * The default minor tick count is 2.
       * @param {number} scaleUnit The scale unit of the axis.
       * @private
       */
      CalcMajorMinorIncr(scaleUnit) {
        if (!this.MajorIncrement) {
          if (this.MajorTickCount) {
            this.MajorIncrement = (this.LinearMaxValue - this.LinearMinValue) / this.MajorTickCount;
          } else {
            this.MajorIncrement = Math.max(scaleUnit, this._minMajorIncrement);
          }
        }

        if (!this.MajorTickCount) {
          this.MajorTickCount = (this.LinearMaxValue - this.LinearMinValue) / this.MajorIncrement;

          // Check if we have a floating point inaccuracy that causes the tick count to be undercalculated
          // within the allowable buffer. If so, tick count is supposed to be the rounded up integer.
          if (
            Math.ceil(this.MajorTickCount) - this.MajorTickCount <
            this.MAJOR_TICK_INCREMENT_BUFFER
          ) {
            this.MajorTickCount = Math.ceil(this.MajorTickCount);
          }
        }

        if (!this.MinorTickCount) {
          if (this.MinorIncrement) {
            this.MinorTickCount = this.MajorIncrement / this.MinorIncrement;
          } else if (this.IsLog) {
            this.MinorTickCount = this.MajorIncrement;
          } else {
            this.MinorTickCount = this.MINOR_TICK_COUNT;
          }
        }

        if (!this.MinorIncrement) {
          this.MinorIncrement = this.MajorIncrement / this.MinorTickCount;
        }
      }

      /**
       * Determines the axis extents based on given start and end value
       * or calculated from the min and max data values of the chart.
       * @private
       */
      _calcAxisExtents() {
        // Include 0 in the axis if we're scaling from the baseline
        if (this.ZeroBaseline) {
          this._dataMin = Math.min(0, this._dataMin);
          this._dataMax = Math.max(0, this._dataMax);
        }

        var maxValue = this.LinearGlobalMax != null ? this.LinearGlobalMax : this._dataMax;
        var minValue = this.LinearGlobalMin != null ? this.LinearGlobalMin : this._dataMin;
        var scaleUnit = Math.max(this._calcAxisScale(minValue, maxValue), this._minMajorIncrement);

        // If there's only a single value on the axis, we need to adjust the
        // this._dataMin and this._dataMax to produce a nice looking axis with around 6 ticks.
        if (this._dataMin === this._dataMax) {
          if (this._dataMin === 0) {
            this._dataMax += 5 * scaleUnit;
          } else {
            this._dataMin -= 2 * scaleUnit;
            this._dataMax += 2 * scaleUnit;
          }
        }

        // Set the default global min
        if (this.LinearGlobalMin == null) {
          if (this.ZeroBaseline && this._dataMin >= 0) {
            this.LinearGlobalMin = 0;
          } else if (this._continuousExtent) {
            // allow smooth pan/zoom transition
            this.LinearGlobalMin = this._dataMin - (this._dataMax - this._dataMin) * 0.1;
          } else if (!this.ZeroBaseline && this.LinearGlobalMax != null) {
            this.LinearGlobalMin = this.LinearGlobalMax;
            this.LinearGlobalMin -=
              scaleUnit * (Math.floor((this.LinearGlobalMin - this._dataMin) / scaleUnit) + 1);
          } else {
            this.LinearGlobalMin = (Math.ceil(this._dataMin / scaleUnit) - 1) * scaleUnit;
          }

          // If all data points are positive, the axis min shouldn't be less than zero
          if (this._dataMin >= 0 && !this.IsLog) {
            this.LinearGlobalMin = Math.max(this.LinearGlobalMin, 0);
          }
        }

        // Set the default global max
        if (this.LinearGlobalMax == null) {
          if (this.MajorTickCount) {
            this.LinearGlobalMax = this.LinearGlobalMin + this.MajorTickCount * scaleUnit;

            // JET-28098 - wrong y2 max
            if (this.LinearGlobalMax < this._dataMax) {
              scaleUnit = Math.max(
                this._calcAxisScale(minValue, maxValue + scaleUnit),
                this._minMajorIncrement
              );
              this.LinearGlobalMax = this.LinearGlobalMin + this.MajorTickCount * scaleUnit;
            }
          } else if (this.ZeroBaseline && this._dataMax <= 0) {
            this.LinearGlobalMax = 0;
          } else if (this._continuousExtent) {
            // allow smooth pan/zoom transition
            this.LinearGlobalMax = this._dataMax + (this._dataMax - this._dataMin) * 0.1;
          } else if (!this.ZeroBaseline) {
            this.LinearGlobalMax = this.LinearGlobalMin;
            this.LinearGlobalMax +=
              scaleUnit * (Math.floor((this._dataMax - this.LinearGlobalMax) / scaleUnit) + 1);
          } else {
            this.LinearGlobalMax = (Math.floor(this._dataMax / scaleUnit) + 1) * scaleUnit;
          }

          // If all data points are negative, the axis max shouldn't be more that zero
          if (this._dataMax <= 0) {
            this.LinearGlobalMax = Math.min(this.LinearGlobalMax, 0);
          }
        }

        if (this.LinearGlobalMax === this.LinearGlobalMin) {
          // happens if this._dataMin == this._dataMax == 0
          this.LinearGlobalMax = 100;
          this.LinearGlobalMin = 0;
          scaleUnit = (this.LinearGlobalMax - this.LinearGlobalMin) / this.MAX_NUMBER_OF_GRIDS_AUTO;
        }

        if (this.LinearMinValue == null) {
          this.LinearMinValue = this.LinearGlobalMin;
        }
        if (this.LinearMaxValue == null) {
          this.LinearMaxValue = this.LinearGlobalMax;
        }

        // if data min and axis min are too close (less than 10px) in log scale, decrease the axis min by a step
        // when called from ojchart-utils (getLabelsFormatInfo) - always subtract one log scale unit from axis min regardless the diff
        var diff = Math.abs(
          this.GetUnboundedCoordAt(this.LinearGlobalMin) - this.GetUnboundedCoordAt(this._dataMin)
        );
        if ((this.IsLog && diff < this.MIN_BAR_SIZE_IN_LOG) || this.utilsLogOptions) {
          this.LinearGlobalMin -= scaleUnit;
          this.LinearMinValue = this.LinearGlobalMin;
        }

        // Recalc the scale unit if the axis viewport is limited
        if (
          this.LinearMinValue !== this.LinearGlobalMin ||
          this.LinearMaxValue !== this.LinearGlobalMax
        ) {
          scaleUnit = this._calcAxisScale(this.LinearMinValue, this.LinearMaxValue);
        }

        if (this.LinearGlobalMin > this.LinearMinValue) {
          this.LinearGlobalMin = this.LinearMinValue;
        }

        if (this.LinearGlobalMax < this.LinearMaxValue) {
          this.LinearGlobalMax = this.LinearMaxValue;
        }

        // Calculate major and minor gridlines
        this.CalcMajorMinorIncr(scaleUnit);
      }

      /**
       * Determines the scale unit of the axis based on a given start and end axis extent.
       * @param {number} min The start data value for the axis.
       * @param {number} max The end data value for the axis.
       * @return {number} The scale unit of the axis.
       * @private
       */
      _calcAxisScale(min, max) {
        if (this.MajorIncrement) {
          return this.MajorIncrement;
        }
        var spread = max - min;

        if (this.IsLog) {
          var scaleUnit = Math.floor(spread / 8) + 1;

          // Store the scaleUnit for aligning log axes
          if (!this.LogScaleUnit || this.LogScaleUnit < scaleUnit) {
            this.LogScaleUnit = scaleUnit;
          }
          return this.LogScaleUnit;
        }

        if (spread === 0) {
          if (min === 0) {
            return 10;
          }
          return Math.pow(10, Math.floor(Math.log10(min)) - 1);
        }

        var testVal;
        if (this.MajorTickCount) {
          //  - y2 axis should show better labels when tick marks are aligned
          var increment = spread / this.MajorTickCount;
          testVal = Math.pow(10, Math.ceil(Math.log10(increment) - 1));
          var firstDigit = increment / testVal;
          if (firstDigit > 1 && firstDigit <= 1.5) {
            firstDigit = 1.5;
          } else if (firstDigit > 5) {
            firstDigit = 10;
          } else {
            firstDigit = Math.ceil(firstDigit);
          }
          return firstDigit * testVal;
        }

        var t = Math.log10(spread);
        testVal = Math.pow(10, Math.ceil(t) - 2);
        var first2Digits = Math.round(spread / testVal);

        // Aesthetically choose a scaling factor limiting to a max number of steps
        var scaleFactor = 1;
        if (first2Digits >= 10 && first2Digits <= 14) {
          scaleFactor = 2;
        } else if (first2Digits >= 15 && first2Digits <= 19) {
          scaleFactor = 3;
        } else if (first2Digits >= 20 && first2Digits <= 24) {
          scaleFactor = 4;
        } else if (first2Digits >= 25 && first2Digits <= 45) {
          scaleFactor = 5;
        } else if (first2Digits >= 46 && first2Digits <= 80) {
          scaleFactor = 10;
        } else {
          scaleFactor = 20;
        }
        return scaleFactor * testVal;
      }

      /**
       * @override
       */
      linearToActual(value) {
        if (value == null) {
          return null;
        }
        return this.IsLog ? Math.pow(10, value) : value;
      }

      /**
       * @override
       */
      actualToLinear(value) {
        if (value == null) {
          return null;
        }

        if (this.IsLog) {
          return value > 0 ? Math.log10(value) : null;
        }
        return value;
      }

      getAxisData() {
        return {
          isLog: this.IsLog,
          max: this.LinearGlobalMax,
          min: this.LinearGlobalMin,
          step: this.MajorIncrement,
          numSteps: this.MajorTickCount
        };
      }
    };

  /**
   * Formatter for an axis with a linear scale.
   * Following cases can occur:
   * 1. scaling is set to none:
   *    No scaling is used in this case.
   * 2. scaling is set to auto, null or undefined:
   *    Scaling is computed. The nearest (less or equal) known scale is used. Regarding fraction part, if autoPrecision equals "on" then the count of significant decimal places
   *    is based on tickStep otherwise fraction part is not formatted.
   * 3. otherwise
   *    Defined scaling is used.
   *    Examples (autoPrecision = "on"):
   *    minValue = 0, maxValue=10000, tickStep=1000, scale="thousand" -> formatted axis values: 0K , ..., 10K
   *    minValue = 0, maxValue=100, tickStep=10, scale="thousand" -> formatted axis values: 0.00K, 0.01K, ..., 0.10K
   *
   * @param {number} minValue the minimum value on the axis
   * @param {number} maxValue the maximum value on the axis
   * @param {number} tickStep the tick step between values on the axis
   * @param {string} scale the scale of values on the axis; if null or undefined then auto scaling is used.
   * @param {string} autoPrecision "on" if auto precision should be applied otherwise "off"; if null or undefined then auto precision is applied.
   * @param {object} translations the translations options from the containing component
   * @constructor
   */

  class LinearScaleAxisValueFormatter {
    constructor(minValue, maxValue, tickStep, scale, autoPrecision, translations) {
      // Allowed scales that can be used as formatter scale param values
      /** @const **/
      this.SCALE_NONE = 'none';
      /** @const **/
      this.SCALE_AUTO = 'auto';
      /** @const **/
      this.SCALE_THOUSAND = 'thousand';
      /** @const **/
      this.SCALE_MILLION = 'million';
      /** @const **/
      this.SCALE_BILLION = 'billion';
      /** @const **/
      this.SCALE_TRILLION = 'trillion';
      /** @const **/
      this.SCALE_QUADRILLION = 'quadrillion';
      /** @const **/

      /**
       * The scaling factor difference between successive scale values
       */
      this.SCALING_FACTOR_DIFFERENCE = 3;

      this._translations = translations;
      // array of successive scale values
      this._scales = {};
      // array of scale values ordered by scale factor asc
      this._scalesOrder = [];
      // mapping of scale factors to corresponding scale objects
      this._factorToScaleMapping = {};

      this.InitScales();
      this.InitFormatter(minValue, maxValue, tickStep, scale, autoPrecision);
    }

    /**
     * Initializes scale objects.
     * @protected
     *
     */
    InitScales() {
      /**
       * Creates scale object and refreshes formatter properties using it.
       * @param {string} scaleName one of allowed scale names (e.g. this.SCALE_THOUSAND)
       * @param {number} scaleFactor scale factor of corresponding scale, i.e. 'x' such that 10^x represents corresponding scale (e.g. for scale this.SCALE_THOUSAND x = 3)
       * @param {string} scaleKey translation key which value (translated) represents given scale (e.g. for this.SCALE_THOUSAND an translated english suffix is 'K')
       * @this {LinearScaleAxisValueFormatter}
       */
      const createScale = (scaleName, scaleFactor, scaleKey) => {
        var suffix;
        if (scaleKey) {
          suffix = this._translations ? this._translations[scaleKey] : null;
        }

        var scale = {
          scaleFactor: scaleFactor,
          localizedSuffix: suffix
        };

        // update private properties
        this._scales[scaleName] = scale;
        this._scalesOrder.push(scale);
        this._factorToScaleMapping[scaleFactor] = scale;
      };

      var diff = this.SCALING_FACTOR_DIFFERENCE;

      createScale(this.SCALE_NONE, 0 * diff);
      createScale(this.SCALE_THOUSAND, 1 * diff, 'labelScalingSuffixThousand');
      createScale(this.SCALE_MILLION, 2 * diff, 'labelScalingSuffixMillion');
      createScale(this.SCALE_BILLION, 3 * diff, 'labelScalingSuffixBillion');
      createScale(this.SCALE_TRILLION, 4 * diff, 'labelScalingSuffixTrillion');
      createScale(this.SCALE_QUADRILLION, 5 * diff, 'labelScalingSuffixQuadrillion');

      // sort _scalesOrder array
      this._scalesOrder.sort((scale1, scale2) => {
        if (scale1.scaleFactor < scale2.scaleFactor) {
          return -1;
        } else if (scale1.scaleFactor > scale2.scaleFactor) {
          return 1;
        }
        return 0;
      });
    }

    /**
     * Initializes properties used for values formatting (e.g. scale factor that should be applied etc.).
     *
     * @param {number} minValue the minimum value on the axis
     * @param {number} maxValue the maximum value on the axis
     * @param {number} tickStep the tick step between values on the axis
     * @param {string} scale the scale of values on the axis
     * @param {boolean} autoPrecision true if auto precision should be applied otherwise false
     * @protected
     *
     */
    InitFormatter(minValue, maxValue, tickStep, scale, autoPrecision) {
      var findScale = false;
      var decimalPlaces;
      var scaleFactor;
      var useAutoPrecision = false;

      // if autoPrecision doesn't equal "off" (i.e. is "on", null, undefined) then auto precision should be used.
      if (autoPrecision !== 'off') {
        useAutoPrecision = true;
      }
      // try to use scale given by "scale" param and if no scale factor is found find appropriate scale
      scaleFactor = this._getScaleFactor(scale);
      if (typeof scaleFactor !== 'number') {
        findScale = true;
      }

      // base a default scale factor calculation on the order of
      // magnitude (power of ten) of the maximum absolute value on the axis
      if (findScale) {
        // get the axis endpoint with the largest absolute value,
        // and find its base 10 exponent
        var absMax = Math.max(Math.abs(minValue), Math.abs(maxValue));

        var power = this._getPowerOfTen(absMax);
        scaleFactor = this._findNearestLEScaleFactor(power);
      }

      if (useAutoPrecision === true) {
        if (tickStep === 0 && minValue === maxValue) {
          // TODO:  Remove this hack for chart tooltips, which currently passes 0 as the tick step in all cases.
          // Workaround for now will be to add decimal places to show at least 1 and at most 4 significant digits
          var valuePowerOfTen = this._getPowerOfTen(maxValue);
          var scaleFactorDiff = scaleFactor - valuePowerOfTen;
          if (scaleFactorDiff <= 0) {
            // Value is same or larger than the scale factor, ensure 4 significant digits.
            // Make sure that the number of decimal places is at least zero. 
            decimalPlaces = Math.max(scaleFactorDiff + 3, 0);
          } else {
            // Value is smaller, ensure enough decimals to show 1 significant digit
            decimalPlaces = Math.max(scaleFactorDiff, 4);
          }
        } else {
          // get the number of decimal places in the number by subtracting
          // the order of magnitude of the tick step from the order of magnitude
          // of the scale factor
          // (e.g.: scale to K, tick step of 50 -> 3 - 1 = 2 decimal places)
          var tickStepPowerOfTen = this._getPowerOfTen(tickStep);
          decimalPlaces = Math.max(scaleFactor - tickStepPowerOfTen, 0);
        }
      }

      // init private properties with computed values
      this._useAutoPrecision = useAutoPrecision;
      this._scaleFactor = scaleFactor;
      this._decimalPlaces = decimalPlaces;
    }

    /**
     * Finds a scale factor 'x' such that x <= value (e.g. if value equals 4 then returned scale factor equals 3)
     * @param {number} value value representing an order of magnitude
     * @return {number} a scale factor 'x' such that x <= value
     * @private
     */
    _findNearestLEScaleFactor(value) {
      var scaleFactor = 0;

      if (value <= this._scalesOrder[0].scaleFactor) {
        // if the number is less than 10, don't scale
        scaleFactor = this._scalesOrder[0].scaleFactor;
      } else if (value >= this._scalesOrder[this._scalesOrder.length - 1].scaleFactor) {
        // if the data is greater than or equal to 10 quadrillion, scale to quadrillions
        scaleFactor = this._scalesOrder[this._scalesOrder.length - 1].scaleFactor;
      } else {
        // else find the nearest scaleFactor such that scaleFactor <= value
        var end = this._scalesOrder.length - 1;
        for (var i = end; i >= 0; i--) {
          if (this._scalesOrder[i].scaleFactor <= value) {
            scaleFactor = this._scalesOrder[i].scaleFactor;
            break;
          }
        }
      }
      return scaleFactor;
    }

    /**
     * Returns scale factor of scale given by scale name.
     * @param {string} scaleName
     * @return {number} scale factor of scale given by scale name
     * @private
     */
    _getScaleFactor(scaleName) {
      // If no scaling factor defined, use auto by default.
      var sclName = !scaleName ? this.SCALE_AUTO : scaleName;
      var scaleFactor;
      var scale = this._scales[sclName];
      if (scale) {
        scaleFactor = scale.scaleFactor;
      }
      return scaleFactor;
    }

    /**
     * Formats given value using previously computed scale factor and decimal digits count. In case that parsed value equals NaN an unformatted value is returned.
     * @override
     * @param {object} value to be formatted.
     * @param {Object} converter The converter
     * @return {string} formatted value as string
     */
    format(value, converter) {
      var defaultConverter;
      var parsed = value != null ? parseFloat(value) : value;
      if (typeof parsed === 'number') {
        var scale = Math.pow(10, this._scaleFactor);
        var userConverterStyle =
          converter && converter.getOptions && converter.getOptions() && converter.getOptions().style;
        // Use nu to make sure the digits are latin
        var scaleConverterOptions = {
          style: 'decimal',
          decimalFormat: userConverterStyle === 'unit' ? 'standard' : 'short',
          nu: 'latn',
          useGrouping: false
        };
        defaultConverter = new ojconverterNumber.IntlNumberConverter(scaleConverterOptions);

        // Formatting for scale
        var _SCALE_REGEXP = /(\d+)(.*$)/;
        var formattedScale = defaultConverter.format(scale, scaleConverterOptions);
        var formattedScaleParts = _SCALE_REGEXP.exec(formattedScale);
        var suffix = formattedScaleParts[2]; // Reset the suffix
        var formattedScaledNumber = (Number(formattedScaleParts[1]) / scale) * parsed;

        // Formatting for scaled number
        if (converter && converter.format) {
          formattedScaledNumber = converter.format(formattedScaledNumber); // Convert the number itself
        } else {
          // skip nu if you want the digits in native locale digits
          var numberConverterOptions = {
            style: 'decimal',
            minimumFractionDigits: this._decimalPlaces,
            maximumFractionDigits: this._decimalPlaces
          };
          defaultConverter = new ojconverterNumber.IntlNumberConverter(numberConverterOptions);
          formattedScaledNumber = defaultConverter.format(
            formattedScaledNumber,
            numberConverterOptions
          );
        }
        // Add the scale factor suffix, unless value is zero
        if (typeof suffix === 'string' && value !== 0) {
          formattedScaledNumber += suffix;
        }
        return formattedScaledNumber;
      }
      return value;
    }

    /**
     * Formats fraction part of given value (adds zeroes if needed).
     * @param {number} value to be formatted
     * @return {string} number with fraction part formatted as string
     * @private
     */
    _formatFraction(value) {
      var formatted = value.toString();

      // Don't format scientific notation (e.g. '1e-7')
      if (formatted.indexOf('e') !== -1) {
        return formatted;
      }

      var decimalSep = '.';
      // TODO: probably need some translation here?
      if (this._decimalPlaces > 0) {
        if (formatted.indexOf('.') === -1) {
          formatted += decimalSep;
        }

        var existingPlacesCount = formatted.substring(formatted.indexOf(decimalSep) + 1).length;

        while (existingPlacesCount < this._decimalPlaces) {
          formatted += '0';
          existingPlacesCount += 1;
        }
      }
      return formatted;
    }

    /**
     * Fro given value it returns its order of magnitude.
     * @param {number} value for which order of magnitude should be found
     * @return {number} order of magnitude for given value
     * @private
     */
    _getPowerOfTen(value) {
      // more comprehensive and easier than working with value returned by Math.log(value)/Math.log(10)
      var val = value >= 0 ? value : -value;
      var power = 0;

      // Check for degenerate and zero values
      if (val < 1e-15) {
        return 0;
      } else if (val === Infinity) {
        return Number.MAX_VALUE;
      }

      if (val >= 10) {
        // e.g. for 1000 the power should be 3
        while (val >= 10) {
          power += 1;
          val /= 10;
        }
      } else if (val < 1) {
        while (val < 1) {
          power -= 1;
          val *= 10;
        }
      }
      return power;
    }

    /**
     * @returns {Number} number of fractional digits of the formatter
     */
    getDecimalPlaces() {
      return this._decimalPlaces;
    }
  }

  exports.BaseAxisInfo = BaseAxisInfo;
  exports.DataAxisInfoMixin = DataAxisInfoMixin;
  exports.LinearScaleAxisValueFormatter = LinearScaleAxisValueFormatter;

  Object.defineProperty(exports, '__esModule', { value: true });

});
