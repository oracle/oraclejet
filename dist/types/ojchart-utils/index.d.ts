export function getLabelFormatInfo(options: {
    step?: number;
    scale?: 'linear' | 'log';
    range: {
        min: number;
        max: number;
    };
    rangeType: 'axis' | 'data';
}): {
    minimumFractionDigits: number;
    maximumFractionDigits: number;
};
