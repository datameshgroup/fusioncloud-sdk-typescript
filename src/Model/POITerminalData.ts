import type { FieldSchema, Newable } from '../util/json/schema.js';
import { POIProfile } from './POIProfile.js';
import { POICapabilityEnum, type POICapability } from './Types.js';

export class POITerminalData {
  TerminalEnvironment?: string;
  POICapabilities: POICapability[] = [];
  POIProfile?: POIProfile;
  POISerialNumber?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'TerminalEnvironment' },
    { name: 'POICapabilities', isArray: true, enum: POICapabilityEnum },
    { name: 'POIProfile', type: POIProfile as unknown as Newable },
    { name: 'POISerialNumber' },
  ];
}
