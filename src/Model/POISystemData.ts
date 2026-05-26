import type { FieldSchema, Newable } from '../util/json/schema.js';
import { POISoftware } from './POISoftware.js';
import { POIStatus } from './POIStatus.js';
import { POITerminalData } from './POITerminalData.js';

export class POISystemData {
  DateTime?: string;
  POISoftware?: POISoftware[];
  POITerminalData?: POITerminalData;
  POIStatus?: POIStatus;
  TokenRequestStatus?: boolean;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'DateTime' },
    { name: 'POISoftware', isArray: true, type: POISoftware as unknown as Newable },
    { name: 'POITerminalData', type: POITerminalData as unknown as Newable },
    { name: 'POIStatus', type: POIStatus as unknown as Newable },
    { name: 'TokenRequestStatus' },
  ];
}
