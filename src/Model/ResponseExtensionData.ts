import type { FieldSchema, Newable } from '../util/json/schema.js';
import { POIInformation } from './POIInformation.js';

export class ResponseExtensionData {
  POIInformation?: POIInformation;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'POIInformation', type: POIInformation as unknown as Newable },
  ];
}
