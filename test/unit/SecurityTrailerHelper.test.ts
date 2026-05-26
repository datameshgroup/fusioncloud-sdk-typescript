import { describe, expect, it } from 'vitest';
import {
  encryptWithTripleDES,
  generateKey,
  hashBySHA256,
} from '../../src/util/Crypto.js';
import {
  generateSecurityTrailer,
  validateSecurityTrailer,
} from '../../src/util/SecurityTrailerHelper.js';
import { LoginRequest } from '../../src/Model/LoginRequest.js';
import { MessageHeader } from '../../src/Model/MessageHeader.js';
import { MessageCategory, MessageClass, MessageType } from '../../src/Model/Types.js';
import { serializeToJson } from '../../src/util/json/serialize.js';

const TEST_KEK = '1140B940AD020C7C6EC25DBDBDA4759E3A329CCC6D07A694';

describe('SecurityTrailerHelper', () => {
  it('round-trips: generated trailer validates against its own MAC body', () => {
    const header = new MessageHeader();
    header.ProtocolVersion = '3.1-dmg';
    header.MessageClass = MessageClass.Service;
    header.MessageCategory = MessageCategory.Login;
    header.MessageType = MessageType.Request;
    header.ServiceID = 'abc123';
    header.SaleID = 'e0ae2486-7fd1-4ffd-818d-ea9a18beffce';
    header.POIID = 'DMGCD001';
    header.LibVersion = 2;

    const payload = new LoginRequest('DMG', 'FusionApp', '1.0.0.0', 'cert-code');
    payload.DateTimeOverride = '2026-05-26T10:00:00.000+10:00';

    const trailer = generateSecurityTrailer(TEST_KEK, header, payload, true);

    expect(trailer.AuthenticatedData?.Recipient?.MAC).toBeTruthy();
    expect(trailer.AuthenticatedData?.Recipient?.MAC).toHaveLength(16);
    expect(trailer.AuthenticatedData?.Recipient?.KEK?.EncryptedKey).toBeTruthy();
    expect(trailer.AuthenticatedData?.Recipient?.KEK?.KEKIdentifier?.KeyIdentifier).toBe(
      'SpecV2TestMACKey',
    );

    expect(() =>
      validateSecurityTrailer({
        kek: TEST_KEK,
        messageHeaderJson: serializeToJson(header),
        payloadDescription: header.getMessageDescription(),
        payloadJson: serializeToJson(payload),
        expectedMAC: trailer.AuthenticatedData!.Recipient!.MAC!,
        expectedEncryptedKey: trailer.AuthenticatedData!.Recipient!.KEK!.EncryptedKey!,
      }),
    ).not.toThrow();
  });

  it('rejects tampered MAC', () => {
    const sessionKey = generateKey();
    const body = '"MessageHeader":{"a":1},"LoginRequest":{"b":2}';
    const sha = hashBySHA256(body) + '8000000000000000';
    const encrypted = encryptWithTripleDES(sha, sessionKey);
    const validMac = encrypted.slice(-16);
    const validEncKey = encryptWithTripleDES(sessionKey, TEST_KEK);

    // Tamper one nibble of the MAC.
    const tamperedMac = (validMac[0] === '0' ? '1' : '0') + validMac.slice(1);
    expect(() =>
      validateSecurityTrailer({
        kek: TEST_KEK,
        messageHeaderJson: '{"a":1}',
        payloadDescription: 'LoginRequest',
        payloadJson: '{"b":2}',
        expectedMAC: tamperedMac,
        expectedEncryptedKey: validEncKey,
      }),
    ).toThrow(/MAC error/);
  });

  it('uses production key identifier when useTestKeyIdentifier=false', () => {
    const header = new MessageHeader();
    header.ProtocolVersion = '3.1-dmg';
    header.MessageClass = MessageClass.Service;
    header.MessageCategory = MessageCategory.Login;
    header.MessageType = MessageType.Request;
    header.ServiceID = 'x';
    header.SaleID = 'y';
    header.POIID = 'z';

    const payload = new LoginRequest('p', 'a', 'v', 'c');
    payload.DateTimeOverride = 'x';
    const trailer = generateSecurityTrailer(TEST_KEK, header, payload, false);
    expect(trailer.AuthenticatedData?.Recipient?.KEK?.KEKIdentifier?.KeyIdentifier).toBe(
      'SpecV2ProdMACKey',
    );
  });
});
