import type { LogEventArgs } from './util/LogLevel.js';
import type { MessageCategory, MessageType } from './Model/Types.js';
import type { MessageHeader } from './Model/MessageHeader.js';
import type { MessagePayload } from './Model/MessagePayload.js';
import type { SaleToPOIMessage } from './Model/SaleToPOIMessage.js';
import type { SecurityTrailer } from './Model/SecurityTrailer.js';

/**
 * Mirror of C# `IMessageParser`. EventHandler<LogEventArgs> in C# becomes a
 * simple optional callback property here — the FusionClient wires its own
 * `Log` method into `onLog` after construction.
 */
export interface IMessageParser {
  readonly protocolVersion: string;
  useTestKeyIdentifier: boolean;
  enableMACValidation: boolean;
  enableSecurityTrailer: boolean;

  onLog?: (args: LogEventArgs) => void;

  buildSaleToPOIMessage(
    serviceID: string,
    saleID: string,
    poiID: string,
    kek: string | undefined,
    requestMessage: MessagePayload,
  ): SaleToPOIMessage;

  saleToPOIMessageToString(saleToPOIMessage: SaleToPOIMessage): string;

  messagePayloadToString(messagePayload: MessagePayload): string;

  parseSaleToPOIMessage(saleToPOIMessageString: string, kek?: string): SaleToPOIMessage | null;

  parseMessagePayload(
    messageCategory: MessageCategory,
    messageType: MessageType,
    messagePayloadString: string,
  ): MessagePayload | null;

  tryParseSaleToPOIMessage(
    saleToPOIMessage: string,
    kek?: string,
  ): {
    success: boolean;
    messageHeader: MessageHeader | null;
    messagePayload: MessagePayload | null;
    securityTrailer: SecurityTrailer | null;
  };
}
