import type { FieldSchema, Newable } from '../util/json/schema.js';
import { StoredValueAccountID } from './StoredValueAccountID.js';

export class StoredValueAccountStatus {
  StoredValueAccountID?: StoredValueAccountID;
  CurrentBalance?: number;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'StoredValueAccountID', type: StoredValueAccountID as unknown as Newable },
    { name: 'CurrentBalance', decimal: true },
  ];
}
