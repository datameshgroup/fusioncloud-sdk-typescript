import { parseDate } from './dates.js';
import { parseEnum, parseEnumOrNull } from './enums.js';
import type { FieldSchema, Newable } from './schema.js';

/**
 * Mirror of `JObject.ToObject<T>()` with case-insensitive property lookup
 * (matching `JObject.GetValue(name, StringComparison.OrdinalIgnoreCase)` used
 * by NexoMessageParser).
 *
 * Walks the constructor's `__schema` array and copies values out of the raw
 * JSON object into a typed instance. Nested model classes are constructed
 * recursively. Unknown JSON properties are ignored.
 */
export function parseTo<T>(ctor: Newable, raw: unknown): T {
  if (raw === null || raw === undefined) return null as unknown as T;
  if (typeof raw !== 'object') {
    throw new TypeError(`Cannot parse non-object into ${ctor.name}: ${typeof raw}`);
  }
  const lookup = buildLookup(raw as Record<string, unknown>);
  const instance = new ctor() as Record<string, unknown>;
  for (const f of ctor.__schema) {
    const wire = (f.jsonName ?? f.name).toLowerCase();
    const v = lookup.get(wire);
    if (v === undefined) continue;
    instance[f.name] = readField(f, v);
  }
  return instance as T;
}

function readField(f: FieldSchema, raw: unknown): unknown {
  if (raw === null) {
    if (f.enum && !f.nullableEnum) return parseEnum(f.enum, null);
    return null;
  }
  if (f.isArray) {
    if (!Array.isArray(raw)) return null;
    const elemSchema: FieldSchema = { ...f, isArray: false };
    return raw.map((item) => readField(elemSchema, item));
  }
  if (f.enum) {
    return f.nullableEnum ? parseEnumOrNull(f.enum, raw) : parseEnum(f.enum, raw);
  }
  if (f.decimal) {
    return typeof raw === 'number' ? raw : Number(raw);
  }
  if (f.date) {
    return parseDate(raw);
  }
  if (f.base64) {
    if (typeof raw !== 'string') return null;
    try {
      return Buffer.from(raw, 'base64').toString('utf8');
    } catch {
      return null;
    }
  }
  if (f.type) {
    return parseTo(f.type, raw);
  }
  return raw;
}

function buildLookup(obj: Record<string, unknown>): Map<string, unknown> {
  const m = new Map<string, unknown>();
  for (const [k, v] of Object.entries(obj)) {
    m.set(k.toLowerCase(), v);
  }
  return m;
}
