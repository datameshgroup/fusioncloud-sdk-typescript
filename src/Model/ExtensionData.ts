import type { FieldSchema, Newable } from '../util/json/schema.js';
import { TransitData } from './TransitData.js';

export class ExtensionData {
  TransitData?: TransitData;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'TransitData', type: TransitData as unknown as Newable },
  ];
}
