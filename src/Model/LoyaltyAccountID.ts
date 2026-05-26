import type { FieldSchema } from '../util/json/schema.js';
import {
  EntryModeEnum,
  IdentificationSupportEnum,
  IdentificationTypeEnum,
  type EntryMode,
  type IdentificationSupport,
  type IdentificationType,
} from './Types.js';

export class LoyaltyAccountID {
  EntryMode?: EntryMode;
  IdentificationType?: IdentificationType;
  IdentificationSupport?: IdentificationSupport;
  LoyaltyID?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'EntryMode', enum: EntryModeEnum },
    { name: 'IdentificationType', enum: IdentificationTypeEnum },
    { name: 'IdentificationSupport', enum: IdentificationSupportEnum },
    { name: 'LoyaltyID' },
  ];
}
