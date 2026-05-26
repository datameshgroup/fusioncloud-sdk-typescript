import type { FieldSchema } from '../util/json/schema.js';

export class Parameter {
  InitialisationVector?: string;
  static readonly __schema: readonly FieldSchema[] = [{ name: 'InitialisationVector' }];
}
