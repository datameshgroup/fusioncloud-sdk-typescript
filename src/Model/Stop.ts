import type { FieldSchema } from '../util/json/schema.js';

export class Stop {
  StopIndex = 0;
  StopID?: string;
  StopName?: string;
  ZoneID?: string;
  Latitude?: string;
  Longitude?: string;
  Timestamp: Date = new Date(0);

  constructor(stopIndex = 0) {
    this.StopIndex = stopIndex;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'StopIndex' },
    { name: 'StopID' },
    { name: 'StopName' },
    { name: 'ZoneID' },
    { name: 'Latitude' },
    { name: 'Longitude' },
    { name: 'Timestamp', date: 'iso' },
  ];
}
