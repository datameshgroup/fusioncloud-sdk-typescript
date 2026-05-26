import type { MessageClass, MessageCategory, MessageType } from './Types.js';
import type { Response } from './Response.js';

/**
 * Base class for every request/response/notification payload that travels
 * inside a SaleToPOIMessage envelope. Mirrors C# `MessagePayload`.
 *
 * The MessageClass/MessageCategory/MessageType triple is what the wire envelope
 * uses to identify the payload shape — they're carried on the instance but
 * never serialized (the parser reads them from `MessageHeader` instead).
 */
export abstract class MessagePayload {
  readonly MessageClass: MessageClass;
  readonly MessageCategory: MessageCategory;
  readonly MessageType: MessageType;

  protected constructor(
    messageClass: MessageClass,
    messageCategory: MessageCategory,
    messageType: MessageType,
  ) {
    this.MessageClass = messageClass;
    this.MessageCategory = messageCategory;
    this.MessageType = messageType;
  }

  /** Returns `MessageCategory + MessageType`, e.g. `"PaymentResponse"`. */
  getMessageDescription(): string {
    return `${this.MessageCategory}${this.MessageType}`;
  }

  /**
   * If this is a request, returns the default paired response payload (used
   * by FusionClient when auto-login fails to surface a synthetic failure
   * back to the caller). Response payloads return `null`.
   */
  abstract createDefaultResponseMessagePayload(response: Response): MessagePayload | null;
}
