import type { FieldSchema, Newable } from '../util/json/schema.js';
import { OutputContent } from './OutputContent.js';
import { DeviceEnum, InfoQualifyEnum, type Device, type InfoQualify } from './Types.js';

export class DisplayOutput {
  ResponseRequiredFlag?: boolean;
  MinimumDisplayTime?: number;
  Device?: Device;
  InfoQualify?: InfoQualify;
  OutputContent?: OutputContent;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'ResponseRequiredFlag' },
    { name: 'MinimumDisplayTime' },
    { name: 'Device', enum: DeviceEnum },
    { name: 'InfoQualify', enum: InfoQualifyEnum },
    { name: 'OutputContent', type: OutputContent as unknown as Newable },
  ];
}
