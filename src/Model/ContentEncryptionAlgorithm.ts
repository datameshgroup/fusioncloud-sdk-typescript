import type { FieldSchema, Newable } from '../util/json/schema.js';
import { Parameter } from './Parameter.js';

export class ContentEncryptionAlgorithm {
  Algorithm?: string;
  Parameter?: Parameter;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'Algorithm' },
    { name: 'Parameter', type: Parameter as unknown as Newable },
  ];
}
