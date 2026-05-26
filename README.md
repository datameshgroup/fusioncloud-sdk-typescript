# @datameshgroup/fusion

TypeScript SDK for the [DataMesh Unify](https://datameshgroup.github.io/fusion) payments platform. Node.js port of the [.NET `DataMeshGroup.Fusion.FusionClient`](../cs/) SDK with full feature parity.

## Install

```bash
npm install @datameshgroup/fusion
# or
pnpm add @datameshgroup/fusion
```

## Quick start

```ts
import {
  FusionClient,
  LoginRequest,
  PaymentRequest,
  PaymentResponse,
  SaleCapability,
} from '@datameshgroup/fusion';

const client = new FusionClient({ useTestEnvironment: true });
client.SaleID = 'e0ae2486-7fd1-4ffd-818d-ea9a18beffce';
client.POIID = 'DMGCD001';
client.KEK = '1140B940AD020C7C6EC25DBDBDA4759E3A329CCC6D07A694';
client.LoginRequest = new LoginRequest(
  'DMG',
  'FusionApp',
  '1.0.0.0',
  '06c17ff1-6a24-41ea-9f6c-9ad3b59f157c',
  [SaleCapability.CashierStatus, SaleCapability.PrinterReceipt],
);

const request = new PaymentRequest('TX-001', 1.0);
const response = await client.sendRecvAsync<PaymentResponse>(request, {
  type: PaymentResponse,
});

console.log(response?.Response?.success);
console.log(response?.getReceiptAsPlainText());

await client.disconnectAsync();
```

## Event mode

Subscribing to any `onXxxResponse` event puts the client into event mode and `recvAsync` becomes unavailable:

```ts
client.on('paymentResponse', (r) => console.log('paid', r.Response?.Result));
client.on('displayRequest', (r) => console.log('display', r.getCashierDisplayAsPlainText()));
client.on('log', (e) => console.log(`[${e.logLevel}] ${e.data}`));

await client.sendAsync(new PaymentRequest('TX-001', 1.0));
```

## Build & test

```bash
pnpm install
pnpm typecheck         # tsc --noEmit
pnpm build             # tsup → dist/ (ESM + CJS + .d.ts)
pnpm test              # unit tests
pnpm test:integration  # integration tests (requires test/integration/fixtures/IntegrationTestSettings.json)
```

## Notes vs. the .NET SDK

- Method casing is camelCase (e.g. `connectAsync`, `sendAsync`, `disconnectAsync`, `recvAsync`, `sendRecvAsync`). Field/wire casing on payloads stays PascalCase to match the wire (`PaymentResult.PaymentInstrumentData.CardData.MaskedPAN`).
- `CancellationToken` becomes `AbortSignal` and timeouts are `timeoutMs` numbers.
- Events use a typed EventEmitter (`client.on('paymentResponse', …)`).
- Decimals are plain `number`. The custom JSON serializer writes them as fixed-point literals — equivalent to the C# `DecimalJsonConverter`.
- The C# `DefaultWebSocketFactory` has a bug where every identity header is written with `SaleID`'s value; this port writes the correct value per header.
