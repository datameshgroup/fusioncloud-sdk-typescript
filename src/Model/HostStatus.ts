import type { FieldSchema } from '../util/json/schema.js';

export class HostStatus {
  AcquirerID?: string;
  IsReachableFlag = false;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'AcquirerID' },
    { name: 'IsReachableFlag' },
  ];
}
