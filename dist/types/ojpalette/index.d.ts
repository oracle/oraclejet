export function getColorValuesFromPalette(palette: 'viridis' | 'magma' | 'inferno' | 'plasma', bins?: number, options?: Options): string[];
// tslint:disable-next-line interface-over-type-literal
export type Options = {
    range?: [
        number,
        number
    ];
};
