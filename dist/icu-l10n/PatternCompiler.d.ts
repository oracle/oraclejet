export = PatternCompiler;
declare class PatternCompiler {
  constructor(locale: any);
  _locale: any;
  compile(pattern: any): {
    paramTypes: any;
    formatter: any;
  };
  _processParts(ast: any, paramAccumulator: any, currentPluralNode: any): any;
  _getNumberFormat(node: any, paramAccumulator: any): string;
  _getDateTimeFormat(node: any, type: any, paramAccumulator: any): string;
  _getSelectFormat(node: any, paramAccumulator: any): string;
  _getPluralFormat(node: any, paramAccumulator: any): string;
  _getPoundFormat(node: any, paramAccumulator: any): string;
  _getSelectOptions(
    node: any,
    paramAccumulator: any,
    pluralNode: any
  ): {
    opts: any[];
    other: string;
    exactPlurals: any[];
  };
  _getParameterExpression(node: any, paramAccumulator: any, type: any): string;
  _stringifyOptions(obj: any): any;
  _getFormatOpts(): {
    number: {
      currency: {
        style: string;
      };
      percent: {
        style: string;
      };
    };
    date: {
      short: {
        month: string;
        day: string;
        year: string;
      };
      medium: {
        month: string;
        day: string;
        year: string;
      };
      long: {
        month: string;
        day: string;
        year: string;
      };
      full: {
        weekday: string;
        month: string;
        day: string;
        year: string;
      };
    };
    time: {
      short: {
        hour: string;
        minute: string;
      };
      medium: {
        hour: string;
        minute: string;
        second: string;
      };
      long: {
        hour: string;
        minute: string;
        second: string;
        timeZoneName: string;
      };
      full: {
        hour: string;
        minute: string;
        second: string;
        timeZoneName: string;
      };
    };
  };
  _getLanguage(): any;
}
