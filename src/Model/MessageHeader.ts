import type { FieldSchema } from '../util/json/schema.js';
import {
  MessageCategory,
  MessageCategoryEnum,
  MessageClassEnum,
  MessageTypeEnum,
  type MessageClass,
  type MessageType,
} from './Types.js';

/**
 * Mirror of C# `MessageHeader`. Note `ProtocolVersion` is conditionally
 * serialized (Login messages only).
 */
export class MessageHeader {
  ProtocolVersion?: string;
  MessageClass!: MessageClass;
  MessageCategory!: MessageCategory;
  MessageType!: MessageType;
  ServiceID!: string;
  DeviceID?: string;
  SaleID!: string;
  POIID!: string;
  LibVersion = 2;

  getMessageDescription(): string {
    return `${this.MessageCategory}${this.MessageType}`;
  }

  static readonly __schema: readonly FieldSchema[] = [
    {
      name: 'ProtocolVersion',
      shouldSerialize: (o) => (o as MessageHeader).MessageCategory === MessageCategory.Login,
    },
    { name: 'MessageClass', enum: MessageClassEnum },
    { name: 'MessageCategory', enum: MessageCategoryEnum },
    { name: 'MessageType', enum: MessageTypeEnum },
    { name: 'ServiceID' },
    { name: 'DeviceID' },
    { name: 'SaleID' },
    { name: 'POIID' },
    { name: 'LibVersion' },
  ];
}
