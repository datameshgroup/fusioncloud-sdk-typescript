import type { FieldSchema } from '../util/json/schema.js';

export class OutputText {
  Text?: string;
  static readonly __schema: readonly FieldSchema[] = [{ name: 'Text' }];
}
