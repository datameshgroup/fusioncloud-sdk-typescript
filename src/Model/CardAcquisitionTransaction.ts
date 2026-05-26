import type { FieldSchema } from '../util/json/schema.js';
import { ForceEntryModeEnum, type ForceEntryMode } from './Types.js';

export class CardAcquisitionTransaction {
  AllowedPaymentBrands?: string[];
  ForceEntryMode?: ForceEntryMode;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'AllowedPaymentBrands', isArray: true },
    { name: 'ForceEntryMode', enum: ForceEntryModeEnum },
  ];
}
