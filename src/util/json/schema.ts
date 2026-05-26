import type { EnumDef } from './enums.js';

/**
 * Describes one field on a model class for serialize/parse.
 *
 * Together with the per-class `__schema` array, this lets us replicate
 * Newtonsoft.Json semantics (NullValueHandling.Ignore, custom converters,
 * ShouldSerialize* hooks, case-insensitive deserialization) without
 * decorators or reflection.
 */
export interface FieldSchema {
  /** Property name on the TS class instance. */
  name: string;
  /**
   * Wire property name. Defaults to `name`. Use to mirror C#
   * `[JsonProperty("…")]` overrides (e.g. PairingData uses single-letter
   * keys).
   */
  jsonName?: string;
  /**
   * If the field holds a nested model class, give its constructor so parse
   * knows what to instantiate. The constructor must expose `__schema`.
   */
  type?: Newable;
  /**
   * Mark the field as an array of `type`. Equivalent to `List<type>` in C#.
   * Plain primitive arrays (e.g. string[]) don't need this.
   */
  isArray?: boolean;
  /** If the field is an enum, the EnumDef for it. */
  enum?: EnumDef<string>;
  /**
   * `nullableEnum: true` reproduces StringEnumConverterWithDefaultOrNull —
   * a missing/null wire value leaves the field as null instead of falling
   * back to "Unknown".
   */
  nullableEnum?: boolean;
  /**
   * Decimal field. JSON output uses the raw G16 representation
   * (matches DecimalJsonConverter).
   */
  decimal?: boolean;
  /**
   * Base64 ↔ UTF-8 string (Base64JsonConverter). When set, the in-memory
   * string is base64-encoded on the way out and base64-decoded on the way in.
   */
  base64?: boolean;
  /**
   * DateTime / Date.
   *  - 'iso' = `IsoDateTimeConverter` (default for Newtonsoft DateTime).
   *  - 'login' = custom LoginRequest format `yyyy-MM-ddTHH:mm:ss.fffzzz`.
   */
  date?: 'iso' | 'login';
  /**
   * Predicate gating serialization. Mirrors C# ShouldSerializeXxx pattern —
   * return false to omit the field from JSON output even when the value is
   * non-null. The instance is passed as `owner`.
   */
  shouldSerialize?: (owner: unknown) => boolean;
}

export interface Newable {
  new (): unknown;
  readonly __schema: readonly FieldSchema[];
}

export interface SchemaCarrier {
  readonly __schema: readonly FieldSchema[];
}

export function hasSchema(v: unknown): v is { constructor: Newable } {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v.constructor as Newable).__schema !== 'undefined'
  );
}
