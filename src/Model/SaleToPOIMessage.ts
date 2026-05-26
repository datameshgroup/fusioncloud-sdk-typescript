import type { MessageHeader } from './MessageHeader.js';
import type { MessagePayload } from './MessagePayload.js';
import type { SecurityTrailer } from './SecurityTrailer.js';

/**
 * Mirror of C# `SaleToPOIMessage`. This is the wrapper the parser produces
 * after deserialization; the on-the-wire envelope is either
 * `{ "SaleToPOIRequest": { … } }` or `{ "SaleToPOIResponse": { … } }`,
 * which the parser handles directly (the wrapper has no `__schema` because
 * the wrapper itself is never serialized — `NexoMessageParser` builds the
 * JSON envelope directly from header + payload + trailer).
 */
export class SaleToPOIMessage {
  MessageHeader!: MessageHeader;
  MessagePayload!: MessagePayload;
  SecurityTrailer?: SecurityTrailer;
}
