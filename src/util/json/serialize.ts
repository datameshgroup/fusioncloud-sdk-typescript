import { isDecimalMarker, toDecimalString } from './decimal.js';
import { formatIsoDate, formatLoginDateTime } from './dates.js';
import { stringifyEnum } from './enums.js';
import { hasSchema, type FieldSchema, type Newable } from './schema.js';

/**
 * Mirror of Newtonsoft's `JsonConvert.SerializeObject` with:
 *  - `NullValueHandling = Ignore` (always)
 *  - `Formatting = None`
 *  - per-field custom converters defined via `__schema`
 *
 * Produces a JSON string with no insignificant whitespace, suitable to send on
 * the WebSocket (and to feed into SecurityTrailerHelper, where byte-identical
 * matching with the C# producer matters for MAC computation).
 */
export function serializeToJson(value: unknown): string {
  const tokens: string[] = [];
  writeAny(tokens, value, undefined);
  return tokens.join('');
}

/**
 * Serialize but emit a JS value (object/array/primitive) rather than a string.
 * Useful when we need to compose a value into a larger JSON document.
 */
export function toJsonValue(value: unknown): unknown {
  const s = serializeToJson(value);
  return JSON.parse(s);
}

function writeAny(out: string[], value: unknown, hint: FieldSchema | undefined): void {
  if (value === null || value === undefined) {
    out.push('null');
    return;
  }

  // 1. Decimal markers — pre-stringified raw literal.
  if (isDecimalMarker(value)) {
    out.push(value.raw);
    return;
  }

  // 2. Schema hint (decimal/date/enum/base64 directly on a primitive field).
  if (hint?.decimal && typeof value === 'number') {
    out.push(toDecimalString(value));
    return;
  }
  if (hint?.date && value instanceof Date) {
    const s = hint.date === 'login' ? formatLoginDateTime(value) : formatIsoDate(value);
    writeString(out, s);
    return;
  }
  if (hint?.base64 && typeof value === 'string') {
    writeString(out, Buffer.from(value, 'utf8').toString('base64'));
    return;
  }
  if (hint?.enum && typeof value === 'string') {
    writeString(out, stringifyEnum(hint.enum, value));
    return;
  }

  // 3. Dates without an explicit hint default to ISO 8601 (Newtonsoft default).
  if (value instanceof Date) {
    writeString(out, formatIsoDate(value));
    return;
  }

  // 4. Arrays.
  if (Array.isArray(value)) {
    writeArray(out, value, hint);
    return;
  }

  // 5. Schema-bearing model instances.
  if (hasSchema(value)) {
    writeSchemaObject(out, value as object, (value.constructor as Newable).__schema);
    return;
  }

  // 6. Plain objects.
  if (typeof value === 'object') {
    writePlainObject(out, value as Record<string, unknown>);
    return;
  }

  // 7. Primitives.
  writePrimitive(out, value);
}

function writeSchemaObject(out: string[], obj: object, schema: readonly FieldSchema[]): void {
  out.push('{');
  let first = true;
  for (const f of schema) {
    const v = (obj as Record<string, unknown>)[f.name];
    if (v === null || v === undefined) continue;
    if (f.shouldSerialize && !f.shouldSerialize(obj)) continue;
    if (!first) out.push(',');
    first = false;
    writeString(out, f.jsonName ?? f.name);
    out.push(':');
    writeAny(out, v, f);
  }
  out.push('}');
}

function writePlainObject(out: string[], obj: Record<string, unknown>): void {
  out.push('{');
  let first = true;
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    if (!first) out.push(',');
    first = false;
    writeString(out, k);
    out.push(':');
    writeAny(out, v, undefined);
  }
  out.push('}');
}

function writeArray(out: string[], arr: readonly unknown[], hint: FieldSchema | undefined): void {
  out.push('[');
  let first = true;
  // For arrays we forward the element-level converter hints (decimal, enum etc.)
  // so a `string[]` schema with `enum: FooEnum` still maps each element.
  const elementHint = hint ? { ...hint, isArray: false } : undefined;
  for (const item of arr) {
    if (!first) out.push(',');
    first = false;
    if (item === null || item === undefined) {
      out.push('null');
      continue;
    }
    writeAny(out, item, elementHint);
  }
  out.push(']');
}

function writePrimitive(out: string[], value: unknown): void {
  switch (typeof value) {
    case 'string':
      writeString(out, value);
      return;
    case 'number':
      if (!Number.isFinite(value)) throw new RangeError(`Cannot serialize non-finite number: ${value}`);
      out.push(Number.isInteger(value) ? String(value) : String(value));
      return;
    case 'bigint':
      out.push(value.toString());
      return;
    case 'boolean':
      out.push(value ? 'true' : 'false');
      return;
    default:
      throw new TypeError(`Cannot serialize value of type ${typeof value}`);
  }
}

function writeString(out: string[], s: string): void {
  out.push(JSON.stringify(s));
}
