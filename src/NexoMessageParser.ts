import type { IMessageParser } from './IMessageParser.js';
import { MessageHeader } from './Model/MessageHeader.js';
import type { MessagePayload } from './Model/MessagePayload.js';
import { SaleToPOIMessage } from './Model/SaleToPOIMessage.js';
import { SecurityTrailer } from './Model/SecurityTrailer.js';
import type { MessageCategory, MessageType } from './Model/Types.js';
import { LogLevel, type LogEventArgs } from './util/LogLevel.js';
import {
  generateSecurityTrailer,
  validateKEK,
  validateSecurityTrailer,
} from './util/SecurityTrailerHelper.js';
import { lookupPayload } from './util/json/registry.js';
import { parseTo } from './util/json/parse.js';
import { serializeToJson } from './util/json/serialize.js';

/**
 * Mirror of C# `NexoMessageParser`. Handles envelope build/parse and MAC
 * validation. Payloads are looked up by `MessageCategory + MessageType` via
 * `registry.ts`, which every payload class registers into at module load.
 */
export class NexoMessageParser implements IMessageParser {
  readonly protocolVersion = '3.1-dmg';

  useTestKeyIdentifier = false;
  enableMACValidation = true;
  enableSecurityTrailer = true;

  onLog?: (args: LogEventArgs) => void;

  constructor(opts?: { useTestKeyIdentifier?: boolean; enableMACValidation?: boolean }) {
    if (opts?.useTestKeyIdentifier !== undefined) this.useTestKeyIdentifier = opts.useTestKeyIdentifier;
    if (opts?.enableMACValidation !== undefined) this.enableMACValidation = opts.enableMACValidation;
  }

  // -------- Build / serialize --------

  buildSaleToPOIMessage(
    serviceID: string,
    saleID: string,
    poiID: string,
    kek: string | undefined,
    requestMessage: MessagePayload,
  ): SaleToPOIMessage {
    if (!this.protocolVersion) throw new TypeError('Invalid protocolVersion. Required length is > 0');
    if (!serviceID) throw new Error('Invalid serviceID. Required length is > 0');
    if (!saleID) throw new Error('Invalid saleID. Required length is > 0');
    if (!poiID) throw new Error('Invalid poiID. Required length is > 0');
    if (!requestMessage) throw new Error('Invalid request. Message payload must not be null');

    if (this.enableSecurityTrailer) {
      const trimmed = kek?.trim();
      validateKEK(trimmed);
    }

    const messageHeader = new MessageHeader();
    messageHeader.ProtocolVersion = this.protocolVersion;
    messageHeader.MessageClass = requestMessage.MessageClass;
    messageHeader.MessageCategory = requestMessage.MessageCategory;
    messageHeader.MessageType = requestMessage.MessageType;
    messageHeader.ServiceID = serviceID;
    messageHeader.POIID = poiID;
    messageHeader.SaleID = saleID;

    const securityTrailer = this.enableSecurityTrailer
      ? generateSecurityTrailer(kek!.trim(), messageHeader, requestMessage, this.useTestKeyIdentifier)
      : undefined;

    const msg = new SaleToPOIMessage();
    msg.MessageHeader = messageHeader;
    msg.MessagePayload = requestMessage;
    if (securityTrailer) msg.SecurityTrailer = securityTrailer;
    return msg;
  }

  saleToPOIMessageToString(saleToPOIMessage: SaleToPOIMessage): string {
    const root =
      saleToPOIMessage.MessageHeader.MessageType === 'Response'
        ? 'SaleToPOIResponse'
        : 'SaleToPOIRequest';

    const description = saleToPOIMessage.MessagePayload.getMessageDescription();

    // Build manually to match Newtonsoft output (no whitespace,
    // NullValueHandling.Ignore everywhere).
    const headerJson = serializeToJson(saleToPOIMessage.MessageHeader);
    const payloadJson = serializeToJson(saleToPOIMessage.MessagePayload);

    let inner = `"MessageHeader":${headerJson},"${description}":${payloadJson}`;
    if (this.enableSecurityTrailer && saleToPOIMessage.SecurityTrailer) {
      inner += `,"SecurityTrailer":${serializeToJson(saleToPOIMessage.SecurityTrailer)}`;
    }
    return `{"${root}":{${inner}}}`;
  }

  messagePayloadToString(messagePayload: MessagePayload): string {
    return `{"${messagePayload.getMessageDescription()}":${serializeToJson(messagePayload)}}`;
  }

  // -------- Parse / deserialize --------

  parseSaleToPOIMessage(saleToPOIMessageString: string, kek?: string): SaleToPOIMessage | null {
    const parsed = this.tryParseSaleToPOIMessage(saleToPOIMessageString, kek);
    if (!parsed.success || !parsed.messageHeader || !parsed.messagePayload) {
      this.log(LogLevel.Debug, 'TryParseSaleToPOIMessage returned null');
      return null;
    }
    const msg = new SaleToPOIMessage();
    msg.MessageHeader = parsed.messageHeader;
    msg.MessagePayload = parsed.messagePayload;
    if (parsed.securityTrailer) msg.SecurityTrailer = parsed.securityTrailer;
    return msg;
  }

  parseMessagePayload(
    messageCategory: MessageCategory,
    messageType: MessageType,
    messagePayloadString: string,
  ): MessagePayload | null {
    // The C# implementation builds a fake SaleToPOIRequest envelope and reparses
    // through ParseSaleToPOIMessage with MAC validation temporarily disabled.
    if (!messagePayloadString || messagePayloadString.length < 2) return null;
    const inner = messagePayloadString.substring(1, messagePayloadString.length - 1);
    const envelope = `{"SaleToPOIRequest":{"MessageHeader":{"MessageCategory":"${messageCategory}","MessageType":"${messageType}"},${inner}}}`;

    const previous = this.enableMACValidation;
    this.enableMACValidation = false;
    try {
      const msg = this.parseSaleToPOIMessage(envelope);
      return msg?.MessagePayload ?? null;
    } finally {
      this.enableMACValidation = previous;
    }
  }

  tryParseSaleToPOIMessage(
    saleToPOIMessageString: string,
    kek?: string,
  ): {
    success: boolean;
    messageHeader: MessageHeader | null;
    messagePayload: MessagePayload | null;
    securityTrailer: SecurityTrailer | null;
  } {
    if (this.enableMACValidation) {
      try {
        validateKEK(kek?.trim());
      } catch (e) {
        this.log(LogLevel.Debug, `An error occured validating the KEK. ${(e as Error).message}`, e as Error);
        throw e;
      }
    }

    let root: Record<string, unknown>;
    try {
      root = JSON.parse(saleToPOIMessageString) as Record<string, unknown>;
    } catch (e) {
      this.log(LogLevel.Debug, `Failed to parse JSON envelope. ${(e as Error).message}`, e as Error);
      return { success: false, messageHeader: null, messagePayload: null, securityTrailer: null };
    }

    const inner = caseInsensitiveGet(root, 'SaleToPOIResponse') ?? caseInsensitiveGet(root, 'SaleToPOIRequest');
    if (!inner || typeof inner !== 'object') {
      this.log(LogLevel.Debug, 'No SaleToPOIResponse / SaleToPOIRequest at envelope root');
      return { success: false, messageHeader: null, messagePayload: null, securityTrailer: null };
    }
    const innerObj = inner as Record<string, unknown>;

    const headerRaw = caseInsensitiveGet(innerObj, 'MessageHeader');
    const trailerRaw = caseInsensitiveGet(innerObj, 'SecurityTrailer');

    let messageHeader: MessageHeader | null = null;
    let securityTrailer: SecurityTrailer | null = null;
    try {
      messageHeader = headerRaw ? parseTo<MessageHeader>(MessageHeader, headerRaw) : null;
      securityTrailer = trailerRaw ? parseTo<SecurityTrailer>(SecurityTrailer, trailerRaw) : null;
    } catch (e) {
      this.log(LogLevel.Debug, `Failed to parse header/trailer. ${(e as Error).message}`, e as Error);
    }

    if (!headerRaw || !messageHeader || (this.enableMACValidation && (!trailerRaw || !securityTrailer))) {
      this.log(
        LogLevel.Debug,
        'In TryParseSaleToPOIMessage, messageHeaderJObject is null || securityTrailerJObject is null || messageHeader is null || securityTrailer is null',
      );
      return { success: false, messageHeader, messagePayload: null, securityTrailer };
    }

    const ctor = lookupPayload(messageHeader.MessageCategory, messageHeader.MessageType);
    if (!ctor) {
      this.log(
        LogLevel.Debug,
        'In TryParseSaleToPOIMessage, type is null || type.IsAssignableFrom(typeof(MessagePayload))',
      );
      return { success: false, messageHeader, messagePayload: null, securityTrailer };
    }

    const description = messageHeader.getMessageDescription();
    const payloadRaw = caseInsensitiveGet(innerObj, description);
    if (!payloadRaw) {
      this.log(LogLevel.Debug, 'In TryParseSaleToPOIMessage, payloadJObject is null || payload is null');
      return { success: false, messageHeader, messagePayload: null, securityTrailer };
    }

    let messagePayload: MessagePayload;
    try {
      messagePayload = parseTo<MessagePayload>(ctor, payloadRaw);
    } catch (e) {
      this.log(LogLevel.Debug, `Failed to parse payload. ${(e as Error).message}`, e as Error);
      return { success: false, messageHeader, messagePayload: null, securityTrailer };
    }

    if (this.enableMACValidation && securityTrailer) {
      try {
        validateSecurityTrailer({
          kek: kek!.trim(),
          messageHeaderJson: JSON.stringify(headerRaw),
          payloadDescription: description,
          payloadJson: JSON.stringify(payloadRaw),
          expectedMAC: securityTrailer.AuthenticatedData?.Recipient?.MAC ?? '',
          expectedEncryptedKey: securityTrailer.AuthenticatedData?.Recipient?.KEK?.EncryptedKey ?? '',
        });
      } catch (e) {
        this.log(LogLevel.Debug, `Invalid MAC on response message. ${(e as Error).message}`, e as Error);
        throw e;
      }
    }

    return { success: true, messageHeader, messagePayload, securityTrailer };
  }

  private log(logLevel: LogLevel, data: string, exception?: Error): void {
    this.onLog?.({ logLevel, createdDateTime: new Date(), data, exception });
  }
}

function caseInsensitiveGet(obj: Record<string, unknown>, key: string): unknown {
  if (key in obj) return obj[key];
  const lower = key.toLowerCase();
  for (const k of Object.keys(obj)) {
    if (k.toLowerCase() === lower) return obj[k];
  }
  return undefined;
}
