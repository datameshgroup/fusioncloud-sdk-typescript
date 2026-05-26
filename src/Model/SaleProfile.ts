import type { FieldSchema } from '../util/json/schema.js';
import {
  GenericProfileEnum,
  ServiceProfileEnum,
  type GenericProfile,
  type ServiceProfile,
} from './Types.js';

export class SaleProfile {
  GenericProfile: GenericProfile = 'Basic';
  ServiceProfiles: ServiceProfile[] = [];

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'GenericProfile', enum: GenericProfileEnum },
    { name: 'ServiceProfiles', isArray: true, enum: ServiceProfileEnum },
  ];
}
