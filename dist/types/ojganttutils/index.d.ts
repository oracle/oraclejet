import { ojTimeAxis } from '../ojtimeaxis';
import Converter = require('../ojconverter');
export function computeTableColumnHeaderHeight(table: Element, gantt: Element, axisInfo: {
    majorAxis?: {
        converter?: ojTimeAxis.Converters | Converter<string>;
        height?: number;
        scale?: string;
        zoomOrder?: string[];
    };
    minorAxis: {
        converter?: ojTimeAxis.Converters | Converter<string>;
        height?: number;
        scale?: string;
        zoomOrder?: string[];
    };
}): number;
