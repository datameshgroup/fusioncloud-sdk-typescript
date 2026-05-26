import { MessagePayload } from './MessagePayload.js';
import { EventToNotifyEnum, MessageCategory, MessageClass, MessageType, type EventToNotify } from './Types.js';
import { registerPayload } from '../util/json/registry.js';
import type { FieldSchema, Newable } from '../util/json/schema.js';

export class EventNotification extends MessagePayload {
  TimeStamp?: Date;
  EventToNotify?: EventToNotify;
  EventDetails?: string;

  constructor() {
    super(MessageClass.Service, MessageCategory.Event, MessageType.Notification);
  }

  override createDefaultResponseMessagePayload(): MessagePayload | null {
    return null;
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'TimeStamp', date: 'iso' },
    { name: 'EventToNotify', enum: EventToNotifyEnum },
    { name: 'EventDetails' },
  ];
}

registerPayload('Event', 'Notification', EventNotification as unknown as Newable);
