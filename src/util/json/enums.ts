/**
 * Mirrors the behaviour of:
 *  - C# StringEnumConverterWithDefault<TEnum>: case-insensitive lookup,
 *    fall back to "Unknown" on miss, fall back to the first value if no
 *    "Unknown" exists.
 *  - C# [EnumMember(Value = "...")] overrides on enum members
 *    (e.g. PaymentBrand.AmericanExpress → "American Express").
 *  - C# StringEnumConverterWithDefaultOrNull: same, but `null` input → `null`.
 *
 * We represent C# enums as TS string-literal unions whose literal values match
 * the C# member names. EnumMember overrides are kept in a per-enum override map
 * and only applied at the JSON boundary, so application code only ever sees the
 * canonical member name.
 */

export interface EnumDef<T extends string> {
  readonly name: string;
  readonly values: readonly T[];
  /** Member name → wire string. */
  readonly toWire: Readonly<Record<T, string>>;
  /** Lower-cased wire string OR member name → member name. */
  readonly fromWire: ReadonlyMap<string, T>;
  /** Returned when an unknown wire string is encountered. */
  readonly fallback: T;
}

export interface EnumDefOptions<T extends string> {
  /** Wire overrides — e.g. `{ AmericanExpress: 'American Express' }`. */
  overrides?: Partial<Record<T, string>>;
  /** Override the fallback value (default: `Unknown` if present, else `values[0]`). */
  fallback?: T;
}

export function defineEnum<T extends string>(
  name: string,
  values: readonly T[],
  options: EnumDefOptions<T> = {},
): EnumDef<T> {
  const toWire = {} as Record<T, string>;
  const fromWire = new Map<string, T>();
  for (const v of values) {
    const wire = options.overrides?.[v] ?? v;
    toWire[v] = wire;
    fromWire.set(wire.toLowerCase(), v);
    // also accept the canonical name itself (case-insensitive)
    fromWire.set(v.toLowerCase(), v);
  }
  const fallback =
    options.fallback ?? ((values as readonly string[]).includes('Unknown') ? ('Unknown' as T) : values[0]!);

  return { name, values, toWire, fromWire, fallback };
}

export function stringifyEnum<T extends string>(def: EnumDef<T>, value: T): string {
  const wire = def.toWire[value];
  if (wire !== undefined) return wire;
  // Tolerate unmapped values (forward compatibility) by writing them straight through.
  return value as unknown as string;
}

export function parseEnum<T extends string>(def: EnumDef<T>, raw: unknown): T {
  if (raw === null || raw === undefined) return def.fallback;
  const s = String(raw).toLowerCase();
  return def.fromWire.get(s) ?? def.fallback;
}

export function parseEnumOrNull<T extends string>(def: EnumDef<T>, raw: unknown): T | null {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).toLowerCase();
  return def.fromWire.get(s) ?? def.fallback;
}
