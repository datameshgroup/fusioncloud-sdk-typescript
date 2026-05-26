/**
 * Newtonsoft's IsoDateTimeConverter default format. We use Date.toISOString()
 * which produces `2026-05-26T03:14:15.123Z` — equivalent to Newtonsoft's UTC
 * round-trip ISO 8601 output. For consumers that need local-offset strings
 * (the C# LoginRequest does this), see `formatLoginDateTime`.
 */
export function formatIsoDate(d: Date): string {
  return d.toISOString();
}

/**
 * C# LoginRequest.DateTime uses `yyyy-MM-ddTHH:mm:ss.fffzzz` in the local
 * timezone with `InvariantCulture`. zzz = ±hh:mm offset, fff = milliseconds.
 *
 * Example output: `2026-05-26T13:14:15.123+10:00`.
 */
export function formatLoginDateTime(d: Date): string {
  const offsetMin = -d.getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const absMin = Math.abs(offsetMin);
  const offsetH = pad(Math.floor(absMin / 60), 2);
  const offsetM = pad(absMin % 60, 2);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1, 2)}-${pad(d.getDate(), 2)}` +
    `T${pad(d.getHours(), 2)}:${pad(d.getMinutes(), 2)}:${pad(d.getSeconds(), 2)}` +
    `.${pad(d.getMilliseconds(), 3)}${sign}${offsetH}:${offsetM}`
  );
}

export function parseDate(raw: unknown): Date | null {
  if (raw === null || raw === undefined) return null;
  if (raw instanceof Date) return raw;
  const s = String(raw);
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function pad(n: number, w: number): string {
  return String(n).padStart(w, '0');
}
