import type { FieldSchema, Newable } from '../util/json/schema.js';
import { AddressLocation } from './AddressLocation.js';

export class POIInformation {
  TID?: string;
  MID?: string;
  FusionVersion?: string;
  SoftwareVersion?: string;
  AddressLocation?: AddressLocation;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'TID' },
    { name: 'MID' },
    { name: 'FusionVersion' },
    { name: 'SoftwareVersion' },
    { name: 'AddressLocation', type: AddressLocation as unknown as Newable },
  ];
}
