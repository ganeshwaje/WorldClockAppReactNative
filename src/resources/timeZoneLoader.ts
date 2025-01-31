import { TimeZoneItem } from '../store/clockSlice';
import timeZonesData from './timeZones.json';

// Type guard to ensure the JSON data matches our expected format
function isTimeZoneData(data: any): data is { timeZones: Omit<TimeZoneItem, 'id'>[] } {
  return Array.isArray(data.timeZones) &&
    data.timeZones.every((tz: any) =>
      typeof tz.cityName === 'string' &&
      typeof tz.timeZone === 'string' &&
      typeof tz.offset === 'number'
    );
}

export function loadTimeZones(): Omit<TimeZoneItem, 'id'>[] {
  try {
    if (!isTimeZoneData(timeZonesData)) {
      console.error('Invalid time zone data format');
      return [];
    }
    return timeZonesData.timeZones;
  } catch (error) {
    console.error('Error loading time zones:', error);
    return [];
  }
}