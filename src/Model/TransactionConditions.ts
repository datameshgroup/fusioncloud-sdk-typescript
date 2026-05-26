import type { FieldSchema } from '../util/json/schema.js';
import { EntryModeEnum, type EntryMode } from './Types.js';

export class TransactionConditions {
  AllowedPaymentBrand?: string[];
  AcquirerID?: string[];
  DebitPreferredFlag?: boolean;
  LoyaltyHandling?: string;
  CustomerLanguage?: string;
  ForceOnlineFlag?: boolean;
  ForceEntryMode?: EntryMode[];
  MerchantCategoryCode?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'AllowedPaymentBrand', isArray: true },
    { name: 'AcquirerID', isArray: true },
    { name: 'DebitPreferredFlag' },
    { name: 'LoyaltyHandling' },
    { name: 'CustomerLanguage' },
    { name: 'ForceOnlineFlag' },
    { name: 'ForceEntryMode', isArray: true, enum: EntryModeEnum },
    { name: 'MerchantCategoryCode' },
  ];
}
