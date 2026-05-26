import type { FieldSchema, Newable } from '../util/json/schema.js';
import { SaleItemCustomField } from './SaleItemCustomField.js';
import {
  UnitOfMeasureEnum,
  WeightUnitOfMeasureEnum,
  type UnitOfMeasure,
  type WeightUnitOfMeasure,
} from './Types.js';

export class SaleItem {
  ItemID = 0;
  ParentItemID?: number;
  ProductCode?: string;
  EanUpc?: string;
  UnitOfMeasure: UnitOfMeasure = 'Other';
  Quantity = 1;
  UnitPrice = 0;
  ItemAmount = 0;
  TaxCode?: string;
  SaleChannel?: string;
  ProductLabel?: string;
  AdditionalProductInfo?: string;
  CostBase?: number;
  Discount?: number;
  DiscountReason?: string;
  Categories?: string[];
  Brand?: string;
  QuantityInStock?: number;
  Tags?: string[];
  Restricted?: boolean;
  PageURL?: string;
  ImageURLs?: string[];
  Style?: string;
  Size?: string;
  Colour?: string;
  Weight?: number;
  WeightUnitOfMeasure?: WeightUnitOfMeasure;
  CustomFields?: SaleItemCustomField[];

  /** Helper — first entry of `Categories`. Setter ensures the array exists. */
  get Category(): string | undefined {
    return this.Categories?.[0];
  }
  set Category(value: string | undefined) {
    if (value === undefined) return;
    this.Categories ??= [];
    if (this.Categories.length < 1) this.Categories.push(value);
    else this.Categories[0] = value;
  }

  /** Helper — second entry of `Categories`. */
  get SubCategory(): string | undefined {
    return this.Categories?.[1];
  }
  set SubCategory(value: string | undefined) {
    if (value === undefined) return;
    this.Categories ??= [];
    if (this.Categories.length < 1) this.Categories.push('Category');
    if (this.Categories.length < 2) this.Categories.push(value);
    else this.Categories[1] = value;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'ItemID' },
    { name: 'ParentItemID' },
    { name: 'ProductCode' },
    { name: 'EanUpc' },
    { name: 'UnitOfMeasure', enum: UnitOfMeasureEnum },
    { name: 'Quantity', decimal: true },
    { name: 'UnitPrice', decimal: true },
    { name: 'ItemAmount', decimal: true },
    { name: 'TaxCode' },
    { name: 'SaleChannel' },
    { name: 'ProductLabel' },
    { name: 'AdditionalProductInfo' },
    { name: 'CostBase', decimal: true },
    { name: 'Discount', decimal: true },
    { name: 'DiscountReason' },
    { name: 'Categories', isArray: true },
    { name: 'Brand' },
    { name: 'QuantityInStock', decimal: true },
    { name: 'Tags', isArray: true },
    { name: 'Restricted' },
    { name: 'PageURL' },
    { name: 'ImageURLs', isArray: true },
    { name: 'Style' },
    { name: 'Size' },
    { name: 'Colour' },
    { name: 'Weight', decimal: true },
    { name: 'WeightUnitOfMeasure', enum: WeightUnitOfMeasureEnum },
    { name: 'CustomFields', isArray: true, type: SaleItemCustomField as unknown as Newable },
  ];
}
