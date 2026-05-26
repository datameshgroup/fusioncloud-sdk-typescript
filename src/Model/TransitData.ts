import type { FieldSchema, Newable } from '../util/json/schema.js';
import { Trip } from './Trip.js';

export class TransitData {
  IsWheelchairEnabled = false;
  Trip?: Trip;
  ODBS?: string;
  Tags?: string[];

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'IsWheelchairEnabled' },
    { name: 'Trip', type: Trip as unknown as Newable },
    { name: 'ODBS' },
    { name: 'Tags', isArray: true },
  ];
}
