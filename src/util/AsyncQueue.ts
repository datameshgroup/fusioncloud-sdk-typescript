/**
 * FIFO async queue. Used by FusionClient's receive loop in non-event mode:
 * the recv loop pushes parsed payloads in; callers `await dequeue(signal)` to
 * pull the next one. Mirrors the C# pattern of `SemaphoreSlim + Queue<T>`.
 *
 * Cancellation: pass an `AbortSignal` to `dequeue` — if it aborts before an
 * item is available, the promise rejects with `cancelled.reason` (or a default
 * `AbortError`).
 */
export class AsyncQueue<T> {
  private readonly items: T[] = [];
  private readonly waiters: Array<{
    resolve: (v: T) => void;
    reject: (e: unknown) => void;
    signal?: AbortSignal;
    onAbort?: () => void;
  }> = [];

  enqueue(item: T): void {
    const w = this.waiters.shift();
    if (w) {
      if (w.signal && w.onAbort) w.signal.removeEventListener('abort', w.onAbort);
      w.resolve(item);
      return;
    }
    this.items.push(item);
  }

  dequeue(signal?: AbortSignal): Promise<T> {
    if (this.items.length > 0) {
      return Promise.resolve(this.items.shift()!);
    }
    return new Promise<T>((resolve, reject) => {
      const onAbort = (): void => {
        const idx = this.waiters.findIndex((x) => x.resolve === resolve);
        if (idx >= 0) this.waiters.splice(idx, 1);
        reject(signal?.reason ?? new Error('Aborted'));
      };
      if (signal?.aborted) {
        reject(signal.reason ?? new Error('Aborted'));
        return;
      }
      signal?.addEventListener('abort', onAbort, { once: true });
      this.waiters.push({ resolve, reject, ...(signal ? { signal, onAbort } : {}) });
    });
  }

  /** Drains pending waiters with an error — used on disconnect. */
  rejectAll(err: unknown): void {
    const pending = this.waiters.splice(0);
    for (const w of pending) {
      if (w.signal && w.onAbort) w.signal.removeEventListener('abort', w.onAbort);
      w.reject(err);
    }
    this.items.length = 0;
  }

  get size(): number {
    return this.items.length;
  }
}
