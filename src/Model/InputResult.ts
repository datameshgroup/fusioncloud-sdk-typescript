import type { FieldSchema, Newable } from '../util/json/schema.js';
import { Input } from './Input.js';
import { Response } from './Response.js';
import { DeviceEnum, InfoQualifyEnum, type Device, type InfoQualify } from './Types.js';

export class InputResult {
  Device?: Device;
  InfoQualify?: InfoQualify;
  Response?: Response;
  Input?: Input;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Device', enum: DeviceEnum },
    { name: 'InfoQualify', enum: InfoQualifyEnum },
    { name: 'Response', type: Response as unknown as Newable },
    { name: 'Input', type: Input as unknown as Newable },
  ];
}
