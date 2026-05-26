import type { FieldSchema, Newable } from '../util/json/schema.js';
import { TrackData } from './TrackData.js';

export class SensitiveCardData {
  PAN?: string;
  CardSeqNumb?: string;
  ExpiryDate?: string;
  TrackData?: TrackData;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'PAN' },
    { name: 'CardSeqNumb' },
    { name: 'ExpiryDate' },
    { name: 'TrackData', type: TrackData as unknown as Newable },
  ];
}
