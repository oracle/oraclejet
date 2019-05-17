import { ojTimeAxis } from '../ojtimeaxis';
import { Converter } from '../ojvalidation-base';
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
