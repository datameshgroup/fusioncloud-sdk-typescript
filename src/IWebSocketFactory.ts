import type { WebSocketHeaders } from './util/WebSocketHeaders.js';
import type { UnifyRootCA } from './Model/Types.js';

/**
 * Abstraction over the WebSocket transport. Mirrors C# `IWebSocketFactory`.
 *
 * Implementations should:
 *  - Open a WebSocket to `url` with `headers` on the upgrade request.
 *  - Send a ping every `heartbeatTimeoutMs` ms while the socket is open.
 *  - Apply `rootCA` / `customRootCA` to the TLS handshake (default impl uses
 *    `ws` with a `{ ca: […] }` option when the rootCA is Test/Production/Custom).
 *  - Abort the connect if `signal` aborts.
 *
 * The returned object presents a small surface (send / close / event hooks)
 * that the FusionClient consumes without taking a hard dependency on `ws`.
 */
export interface IFusionWebSocket {
  send(data: string): Promise<void>;
  close(code?: number, reason?: string): Promise<void>;
  /** Resolves to true when the socket is open. */
  readonly isOpen: boolean;
  onMessage(handler: (data: string) => void): void;
  onClose(handler: (code: number, reason: string) => void): void;
  onError(handler: (err: Error) => void): void;
}

export interface IWebSocketFactory {
  connectAsync(
    url: URL,
    headers: WebSocketHeaders,
    heartbeatTimeoutMs: number,
    signal: AbortSignal,
    options?: { rootCA?: UnifyRootCA; customRootCA?: string },
  ): Promise<IFusionWebSocket>;
}
