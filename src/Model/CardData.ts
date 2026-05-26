import type { FieldSchema, Newable } from '../util/json/schema.js';
import { PaymentToken } from './PaymentToken.js';
import {
  Account,
  AccountEnum,
  EntryModeEnum,
  PaymentBrandEnum,
  type Account as AccountT,
  type EntryMode,
  type PaymentBrand,
} from './Types.js';
import { parseEnum } from '../util/json/enums.js';

/**
 * Mirror of C# `CardData`. Two quirks preserved:
 *  - `PaymentBrand` is wire-string (with EnumMember overrides), with the
 *    parsed enum also surfaced via `paymentBrandEnum` for ergonomic checks.
 *  - `Account` falls back to `Credit` when wire value is `Unknown` (Nexo hosts
 *    sometimes return null/blank for credit-account txns).
 */
export class CardData {
  private _paymentBrand?: string;
  /** Card brand as a free-form wire string (e.g. `"VISA"`, `"American Express"`). */
  get PaymentBrand(): string | undefined {
    return this._paymentBrand;
  }
  set PaymentBrand(value: string | undefined) {
    this._paymentBrand = value;
    this.paymentBrandEnum = value ? parseEnum(PaymentBrandEnum, value) : 'Unknown';
  }
  /** Parsed view of `PaymentBrand`; not serialized. */
  paymentBrandEnum: PaymentBrand = 'Unknown';

  private _account: AccountT = Account.Unknown;
  /** Returns `Credit` when the underlying account is `Unknown` (matches C#). */
  get Account(): AccountT {
    return this._account === Account.Unknown ? Account.Credit : this._account;
  }
  set Account(value: AccountT) {
    this._account = value;
  }

  MaskedPAN?: string;

  private _expiry?: string;
  /** YYMM format. Setting an invalid value is silently ignored (matches C#). */
  get Expiry(): string | undefined {
    return this._expiry;
  }
  set Expiry(value: string | undefined) {
    if (!value || value.length !== 4 || Number.isNaN(Number(value))) return;
    this._expiry = value;
  }

  EntryMode?: EntryMode;
  CardCountryCode?: string;
  PaymentBrandId?: string;
  PaymentBrandLabel?: string;
  PaymentToken?: PaymentToken;

  static readonly __schema: readonly FieldSchema[] = [
    // PaymentBrand is a free-form wire string in C# (the PaymentBrand enum
    // converter is only applied when the field is typed as the enum). We keep
    // string-pass-through here to allow callers to set custom card brands.
    { name: 'PaymentBrand' },
    { name: 'Account', enum: AccountEnum },
    { name: 'MaskedPAN' },
    { name: 'Expiry' },
    { name: 'EntryMode', enum: EntryModeEnum },
    { name: 'CardCountryCode' },
    { name: 'PaymentBrandId' },
    { name: 'PaymentBrandLabel' },
    { name: 'PaymentToken', type: PaymentToken as unknown as Newable },
  ];
}
