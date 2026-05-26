import type { FieldSchema, Newable } from '../util/json/schema.js';
import { StoredValueAccountStatus } from './StoredValueAccountStatus.js';
import { StoredValueInformation } from './StoredValueInformation.js';

export class StoredValueResult extends StoredValueInformation {
  StoredValueAccountStatus?: StoredValueAccountStatus;

  static override readonly __schema: readonly FieldSchema[] = [
    ...StoredValueInformation.__schema,
    { name: 'StoredValueAccountStatus', type: StoredValueAccountStatus as unknown as Newable },
  ];
}
