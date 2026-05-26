import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  CurrencySymbol,
  DisplayRequest,
  MessageCategory,
  MessageClass,
  MessageType,
  PaymentRequest,
  PaymentResponse,
  PaymentType,
  Result,
  type MessagePayload,
} from '../../src/index.js';
import { FusionClientFixture, settingsAvailable } from './fixtures/FusionClientFixture.js';

describe.skipIf(!settingsAvailable)('Purchase (live)', () => {
  let fixture: FusionClientFixture;

  beforeAll(() => {
    fixture = new FusionClientFixture();
  });

  afterAll(async () => {
    await fixture.dispose();
  });

  it('AutoLogin Visa tap purchase $1.00', async () => {
    const transactionId = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 15);
    const req = new PaymentRequest(transactionId, 1.0);
    const sale = await fixture.client.sendAsync(req);

    const responses: MessagePayload[] = [];
    let final: PaymentResponse | null = null;
    while (!final) {
      const next = (await fixture.client.recvAsync()) as MessagePayload | null;
      if (!next) continue;
      responses.push(next);
      if (next instanceof PaymentResponse) final = next;
    }

    expect(responses.length).toBeGreaterThan(1);
    expect(responses.some((r) => r instanceof DisplayRequest)).toBe(true);

    expect(final.MessageCategory).toBe(MessageCategory.Payment);
    expect(final.MessageClass).toBe(MessageClass.Service);
    expect(final.MessageType).toBe(MessageType.Response);

    expect(final.POIData?.POIReconciliationID).toBeTruthy();
    expect(final.POIData?.POITransactionID?.TransactionID).toBeTruthy();

    expect(final.PaymentResult?.AmountsResp).toBeDefined();
    expect(final.PaymentResult?.AmountsResp?.Currency).toBe(CurrencySymbol.AUD);
    expect(final.PaymentResult?.OnlineFlag).toBe(true);
    expect(final.PaymentResult?.PaymentType).toBe(PaymentType.Normal);

    expect(final.getReceiptAsPlainText()).toBeTruthy();
    expect(final.PaymentReceipt?.length).toBeGreaterThanOrEqual(1);
    expect(final.PaymentResult?.PaymentAcquirerData?.AcquirerID).toMatch(/^(343455|560251)$/);
    expect(final.PaymentResult?.PaymentInstrumentData?.CardData?.MaskedPAN).toMatch(/^\d{6}X{6}\d{4}/);

    expect(final.Response?.Result).toBe(Result.Success);
    expect(final.Response?.success).toBe(true);
    fixture.saleToPOIRequestHistory.push(sale);
  });
});
