import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  ReconciliationRequest,
  ReconciliationResponse,
  ReconciliationType,
  Result,
} from '../../src/index.js';
import { FusionClientFixture, settingsAvailable } from './fixtures/FusionClientFixture.js';

describe.skipIf(!settingsAvailable)('Reconciliation (live)', () => {
  let fixture: FusionClientFixture;

  beforeAll(() => {
    fixture = new FusionClientFixture();
  });

  afterAll(async () => {
    await fixture.dispose();
  });

  it('performs internal reconciliation', async () => {
    const req = new ReconciliationRequest(ReconciliationType.InternalReconciliation);
    const r = await fixture.client.sendRecvAsync<ReconciliationResponse>(req, {
      type: ReconciliationResponse,
    });
    expect(r).toBeInstanceOf(ReconciliationResponse);
    expect(r!.Response?.Result).toBe(Result.Success);
  });
});
