import { describe, expect, it } from 'vitest';
import '../../src/index.js'; // ensure payload registry is populated
import { NexoMessageParser } from '../../src/NexoMessageParser.js';
import { PaymentRequest } from '../../src/Model/PaymentRequest.js';
import { PaymentResponse } from '../../src/Model/PaymentResponse.js';
import { Response } from '../../src/Model/Response.js';
import { Result, ErrorCondition } from '../../src/Model/Types.js';

const TEST_KEK = '1140B940AD020C7C6EC25DBDBDA4759E3A329CCC6D07A694';

describe('NexoMessageParser', () => {
  it('builds + serializes a PaymentRequest envelope', () => {
    const parser = new NexoMessageParser({ useTestKeyIdentifier: true });
    const req = new PaymentRequest('TX-123', 1.0);
    const envelope = parser.buildSaleToPOIMessage(
      'SVC-1',
      'e0ae2486-7fd1-4ffd-818d-ea9a18beffce',
      'DMGCD001',
      TEST_KEK,
      req,
    );
    const json = parser.saleToPOIMessageToString(envelope);

    expect(json.startsWith('{"SaleToPOIRequest":')).toBe(true);
    expect(json).toContain('"MessageHeader":');
    expect(json).toContain('"PaymentRequest":');
    expect(json).toContain('"SecurityTrailer":');
    // ProtocolVersion is intentionally omitted on non-Login messages
    // (mirrors the C# ShouldSerializeProtocolVersion behaviour).
    expect(json).not.toContain('"ProtocolVersion"');
    expect(json).toContain('"MessageCategory":"Payment"');
    expect(json).toContain('"MessageType":"Request"');
    expect(json).toContain('"RequestedAmount":1');
    expect(json).toContain('"SpecV2TestMACKey"');
  });

  it('round-trips a synthesized envelope through parse', () => {
    const parser = new NexoMessageParser({ useTestKeyIdentifier: true });
    const req = new PaymentRequest('TX-456', 25.5);
    const envelope = parser.buildSaleToPOIMessage(
      'SVC-99',
      'sale-1',
      'poi-1',
      TEST_KEK,
      req,
    );
    const json = parser.saleToPOIMessageToString(envelope);
    // Re-parse — the parser treats the envelope as a Request, but we
    // also need to make sure MAC validation passes against our own JSON.
    const parsed = parser.parseSaleToPOIMessage(json, TEST_KEK);
    expect(parsed).not.toBeNull();
    expect(parsed?.MessageHeader.ServiceID).toBe('SVC-99');
    expect(parsed?.MessagePayload).toBeInstanceOf(PaymentRequest);
    const r = parsed?.MessagePayload as PaymentRequest;
    expect(r.PaymentTransaction?.AmountsReq?.RequestedAmount).toBe(25.5);
  });

  it('omits ErrorCondition when Response is Success', () => {
    const parser = new NexoMessageParser({ enableMACValidation: false });
    parser.enableSecurityTrailer = false;
    const resp = new PaymentResponse();
    resp.Response = new Response({ Result: Result.Success });
    const json = parser.messagePayloadToString(resp);
    expect(json).toContain('"Result":"Success"');
    expect(json).not.toContain('ErrorCondition');
  });

  it('emits ErrorCondition when Response is Failure', () => {
    const parser = new NexoMessageParser({ enableMACValidation: false });
    parser.enableSecurityTrailer = false;
    const resp = new PaymentResponse();
    resp.Response = new Response({ Result: Result.Failure, ErrorCondition: ErrorCondition.Aborted });
    const json = parser.messagePayloadToString(resp);
    expect(json).toContain('"Result":"Failure"');
    expect(json).toContain('"ErrorCondition":"Aborted"');
  });

  it('PaymentBrand override "American Express" round-trips for enum field', () => {
    // We don't have an enum-typed PaymentBrand on any payload (CardData uses a
    // free-form string), so this is a smoke test against CardAcquisitionResponse
    // which uses the enum.
    const parser = new NexoMessageParser({ enableMACValidation: false });
    parser.enableSecurityTrailer = false;
    // We can't easily construct a wire string for this test without the
    // SaleToPOIRequest envelope. Instead, validate the enum mapping helpers.
    const json = `{"SaleToPOIResponse":{"MessageHeader":{"ProtocolVersion":"3.1-dmg","MessageClass":"Service","MessageCategory":"CardAcquisition","MessageType":"Response","ServiceID":"s","SaleID":"sale","POIID":"poi"},"CardAcquisitionResponse":{"PaymentBrand":"American Express"}}}`;
    const parsed = parser.parseSaleToPOIMessage(json);
    expect(parsed).not.toBeNull();
    const payload = parsed?.MessagePayload as { PaymentBrand?: string };
    expect(payload.PaymentBrand).toBe('AmericanExpress');
  });
});
