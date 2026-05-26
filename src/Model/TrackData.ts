import type { FieldSchema } from '../util/json/schema.js';
import { TrackFormatEnum, type TrackFormat } from './Types.js';

export class TrackData {
  TrackNumb?: string;
  TrackFormat?: TrackFormat;
  TrackValue?: string;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'TrackNumb' },
    { name: 'TrackFormat', enum: TrackFormatEnum },
    { name: 'TrackValue' },
  ];
}
