import type { FieldSchema } from '../util/json/schema.js';

export class SponsoredMerchant {
  CommonName?: string;
  Address?: string;
  SiteID?: string;
  BusinessID?: string;
  CountryCode?: string;
  MerchantCategoryCode?: string;
  RegisteredIdentifier?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'CommonName' },
    { name: 'Address' },
    { name: 'SiteID' },
    { name: 'BusinessID' },
    { name: 'CountryCode' },
    { name: 'MerchantCategoryCode' },
    { name: 'RegisteredIdentifier' },
  ];
}
