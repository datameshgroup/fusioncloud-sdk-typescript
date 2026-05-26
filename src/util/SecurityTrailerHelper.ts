import { MessageFormatException } from './FusionException.js';
import {
  decryptWithTripleDES,
  encryptWithTripleDES,
  generateKey,
  hashBySHA256,
  validateKEK,
} from './Crypto.js';
import type { MessageHeader } from '../Model/MessageHeader.js';
import type { MessagePayload } from '../Model/MessagePayload.js';
import {
  AuthenticatedData,
  EncapsulatedContent,
  KEK,
  KEKIdentifier,
  KeyEncryptionAlgorithm,
  MACAlgorithm,
  Recipient,
  SecurityTrailer,
} from '../Model/SecurityTrailer.js';
import { serializeToJson } from './json/serialize.js';

/**
 * Port of `cs/.../Util/SecurityTrailerHelper.cs`. The MAC body is a
 * byte-significant string built by concatenating the message header JSON and
 * the payload JSON (without their wrapping object braces) — the exact same
 * formula on both sides means the host and client MACs match.
 */

const TEST_KEY_IDENTIFIER = 'SpecV2TestMACKey';
const PROD_KEY_IDENTIFIER = 'SpecV2ProdMACKey';
const KEY_VERSION = '20191122164326.594';
const MAC_TAIL_BUFFER = '8000000000000000';

export interface SecurityTrailerValidationArgs {
  kek: string;
  messageHeaderJson: string;
  payloadDescription: string;
  payloadJson: string;
  expectedMAC: string;
  expectedEncryptedKey: string;
}

export function validateSecurityTrailer(args: SecurityTrailerValidationArgs): void {
  const { kek, messageHeaderJson, payloadDescription, payloadJson, expectedMAC, expectedEncryptedKey } =
    args;

  if (!kek) throw new MessageFormatException('SecurityTrailer validation error. kek is null or empty');
  if (!messageHeaderJson)
    throw new MessageFormatException(
      'SecurityTrailer validation error. messageHeaderJson is null or empty',
    );
  if (!payloadDescription)
    throw new MessageFormatException(
      'SecurityTrailer validation error. payloadDescription is null or empty',
    );
  if (!payloadJson)
    throw new MessageFormatException('SecurityTrailer validation error. payloadJson is null or empty');
  if (!expectedMAC)
    throw new MessageFormatException('SecurityTrailer validation error. expectedMAC is null or empty');
  if (!expectedEncryptedKey)
    throw new MessageFormatException(
      'SecurityTrailer validation error. expectedEncryptedKey is null or empty',
    );

  const sessionKey = decryptWithTripleDES(expectedEncryptedKey, kek);
  const macBody = `"MessageHeader":${messageHeaderJson},"${payloadDescription}":${payloadJson}`;
  const sha256 = hashBySHA256(macBody);
  const buffer = sha256 + MAC_TAIL_BUFFER;
  const encryptedSha256 = encryptWithTripleDES(buffer, sessionKey);
  const mac = encryptedSha256.substring(encryptedSha256.length - 16);
  const encryptedKey = encryptWithTripleDES(sessionKey, kek);

  if (mac !== expectedMAC) {
    throw new MessageFormatException(
      `SecurityTrailer validation error. MAC error. expected ${expectedMAC}, got ${mac}`,
    );
  }
  if (encryptedKey !== expectedEncryptedKey) {
    throw new MessageFormatException(
      `SecurityTrailer validation error. EncryptedKey error. expected ${expectedEncryptedKey}, got ${encryptedKey}`,
    );
  }
}

export function generateSecurityTrailer(
  kek: string,
  messageHeader: MessageHeader,
  messagePayload: MessagePayload,
  useTestKeyIdentifier: boolean,
): SecurityTrailer {
  const sessionKey = generateKey();
  const headerJson = serializeToJson(messageHeader);
  const payloadJson = serializeToJson(messagePayload);
  const description = messageHeader.getMessageDescription();
  const macBody = `"MessageHeader":${headerJson},"${description}":${payloadJson}`;
  const sha256 = hashBySHA256(macBody);
  const buffer = sha256 + MAC_TAIL_BUFFER;
  const encryptedSha256 = encryptWithTripleDES(buffer, sessionKey);
  const mac = encryptedSha256.substring(encryptedSha256.length - 16);
  const encryptedKey = encryptWithTripleDES(sessionKey, kek);

  const trailer = new SecurityTrailer();
  trailer.ContentType = 'id-ct-authData';

  const auth = new AuthenticatedData();
  auth.Version = 'v0';

  const recipient = new Recipient();
  const kekObj = new KEK();
  kekObj.Version = 'v4';
  const identifier = new KEKIdentifier();
  identifier.KeyIdentifier = useTestKeyIdentifier ? TEST_KEY_IDENTIFIER : PROD_KEY_IDENTIFIER;
  identifier.KeyVersion = KEY_VERSION;
  kekObj.KEKIdentifier = identifier;
  const keyAlg = new KeyEncryptionAlgorithm();
  keyAlg.Algorithm = 'des-ede3-cbc';
  kekObj.KeyEncryptionAlgorithm = keyAlg;
  kekObj.EncryptedKey = encryptedKey;

  const macAlg = new MACAlgorithm();
  macAlg.Algorithm = 'id-retail-cbc-mac-sha-256';

  const enc = new EncapsulatedContent();
  enc.ContentType = 'id-data';

  recipient.KEK = kekObj;
  recipient.MACAlgorithm = macAlg;
  recipient.EncapsulatedContent = enc;
  recipient.MAC = mac;

  auth.Recipient = recipient;
  trailer.AuthenticatedData = auth;
  return trailer;
}

export { validateKEK };
