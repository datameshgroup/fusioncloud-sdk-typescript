import type { FieldSchema } from '../util/json/schema.js';
import {
  EntryModeEnum,
  IdentificationTypeEnum,
  StoredValueAccountTypeEnum,
  type EntryMode,
  type IdentificationType,
  type StoredValueAccountType,
} from './Types.js';

export class StoredValueAccountID {
  StoredValueAccountType: StoredValueAccountType = 'GiftCard';
  StoredValueProvider?: string;
  OwnerName?: string;
  ExpiryDate?: string;
  EntryMode?: EntryMode;
  IdentificationType?: IdentificationType;
  StoredValueID?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'StoredValueAccountType', enum: StoredValueAccountTypeEnum },
    { name: 'StoredValueProvider' },
    { name: 'OwnerName' },
    { name: 'ExpiryDate' },
    { name: 'EntryMode', enum: EntryModeEnum },
    { name: 'IdentificationType', enum: IdentificationTypeEnum },
    { name: 'StoredValueID' },
  ];
}
