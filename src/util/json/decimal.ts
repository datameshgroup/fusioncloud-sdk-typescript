// Mirrors C# DecimalJsonConverter: writes raw decimal literal (G16 format) rather
// than letting JSON.stringify choose a number representation (which can produce
// scientific notation for very large / small values).
//
// On the wire: `1.00m` (C# decimal) → `1.00` (JSON), not `1` or `1e0`.

const DECIMAL_SENTINEL = Symbol.for('@datameshgroup/fusion/decimal');

export interface DecimalMarker {
  readonly [DECIMAL_SENTINEL]: true;
  readonly raw: string;
}

export function isDecimalMarker(v: unknown): v is DecimalMarker {
  return typeof v === 'object' && v !== null && (v as DecimalMarker)[DECIMAL_SENTINEL] === true;
}

/**
 * Format a JS number the way C# `decimal.ToString("G16", InvariantCulture)` does.
 *
 * G16 rules (Microsoft docs):
 *  - up to 16 significant digits
 *  - no trailing zeros unless they're meaningful for precision
 *  - no exponent unless out of the normal precision range
 *
 * For the Fusion protocol, values are always currency amounts or quantities so
 * they always fit comfortably inside double precision. We format with fixed
 * decimal notation, strip trailing zeros (but keep at least one decimal of
 * precision if the value has any fractional part), and avoid exponent notation.
 */
export function toDecimalString(value: number): string {
  if (!Number.isFinite(value)) {
    throw new RangeError(`Cannot format non-finite number as decimal: ${value}`);
  }
  // toPrecision(15) gives us enough precision for any currency amount while
  // avoiding the binary-rounding noise of toString() (e.g. 0.1 + 0.2).
  let s = value.toPrecision(15);

  // toPrecision may emit exponent notation for very large/small values — expand it.
  if (s.includes('e') || s.includes('E')) {
    s = expandExponent(s);
  }

  // Strip insignificant trailing zeros after a decimal point.
  if (s.includes('.')) {
    s = s.replace(/0+$/, '');
    s = s.replace(/\.$/, '');
  }
  return s;
}

function expandExponent(s: string): string {
  const n = Number(s);
  if (Number.isInteger(n)) return n.toFixed(0);
  return n.toFixed(20).replace(/0+$/, '').replace(/\.$/, '');
}

/**
 * Wrap a number so that the JSON serializer (in `serialize.ts`) emits it as a
 * raw decimal literal rather than a regular JSON number. Used internally when a
 * field schema declares `decimal: true`.
 */
export function decimal(value: number): DecimalMarker {
  return { [DECIMAL_SENTINEL]: true, raw: toDecimalString(value) };
}
