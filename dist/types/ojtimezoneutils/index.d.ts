export interface AvailableTimeZoneType {
    displayName: string;
    id: string;
}
export function getAvailableTimeZones(): AvailableTimeZoneType[];
