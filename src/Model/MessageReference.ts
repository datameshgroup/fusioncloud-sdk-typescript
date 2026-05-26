import type { FieldSchema } from '../util/json/schema.js';
import { MessageCategoryEnum, type MessageCategory } from './Types.js';

export class MessageReference {
  MessageCategory?: MessageCategory;
  ServiceID?: string;
  DeviceID?: string;
  SaleID?: string;
  POIID?: string;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'MessageCategory', enum: MessageCategoryEnum },
    { name: 'ServiceID' },
    { name: 'DeviceID' },
    { name: 'SaleID' },
    { name: 'POIID' },
  ];
}
