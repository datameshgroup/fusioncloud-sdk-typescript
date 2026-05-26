import type { FieldSchema } from '../util/json/schema.js';

export class PredefinedContent {
  ReferenceID?: string;
  Language?: string;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'ReferenceID' },
    { name: 'Language' },
  ];
}
