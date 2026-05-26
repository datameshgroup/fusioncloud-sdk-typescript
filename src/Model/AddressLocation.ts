import type { FieldSchema } from '../util/json/schema.js';

export class AddressLocation {
  Address1?: string;
  Address2?: string;
  AddressState?: string;
  Location?: string;

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Address1' },
    { name: 'Address2' },
    { name: 'AddressState' },
    { name: 'Location' },
  ];
}
