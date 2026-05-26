import type { FieldSchema, Newable } from '../util/json/schema.js';
import { OriginalPOITransaction } from './OriginalPOITransaction.js';
import { StoredValueAccountID } from './StoredValueAccountID.js';
import { StoredValueInformation } from './StoredValueInformation.js';

export class StoredValueData extends StoredValueInformation {
  StoredValueProvider?: string;
  StoredValueAccountID?: StoredValueAccountID;
  OriginalPOITransaction?: OriginalPOITransaction;

  static override readonly __schema: readonly FieldSchema[] = [
    ...StoredValueInformation.__schema,
    { name: 'StoredValueProvider' },
    { name: 'StoredValueAccountID', type: StoredValueAccountID as unknown as Newable },
    { name: 'OriginalPOITransaction', type: OriginalPOITransaction as unknown as Newable },
  ];
}
