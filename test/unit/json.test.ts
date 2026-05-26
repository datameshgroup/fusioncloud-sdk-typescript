import { describe, expect, it } from 'vitest';
import { decimal, toDecimalString } from '../../src/util/json/decimal.js';
import { defineEnum, parseEnum, stringifyEnum } from '../../src/util/json/enums.js';
import { parseTo } from '../../src/util/json/parse.js';
import { serializeToJson } from '../../src/util/json/serialize.js';
import type { FieldSchema, Newable } from '../../src/util/json/schema.js';

describe('decimal', () => {
  it('formats integers without a decimal point', () => {
    expect(toDecimalString(1)).toBe('1');
    expect(toDecimalString(0)).toBe('0');
    expect(toDecimalString(-42)).toBe('-42');
  });

  it('strips trailing zeros but preserves significant digits', () => {
    expect(toDecimalString(1.0)).toBe('1');
    expect(toDecimalString(1.5)).toBe('1.5');
    expect(toDecimalString(1.25)).toBe('1.25');
  });

  it('avoids scientific notation for tiny + huge values', () => {
    expect(toDecimalString(0.000001)).not.toMatch(/[eE]/);
    expect(toDecimalString(123456789012345)).not.toMatch(/[eE]/);
  });

  it('decimal() wraps a number so the serializer writes it raw', () => {
    expect(serializeToJson(decimal(1.5))).toBe('1.5');
    expect(serializeToJson(decimal(2))).toBe('2');
  });
});

describe('enums', () => {
  const Color = defineEnum('Color', ['Red', 'Green', 'Blue', 'Unknown'] as const, {
    overrides: { Red: 'Bright Red' },
  });

  it('stringifyEnum honours EnumMember overrides', () => {
    expect(stringifyEnum(Color, 'Red')).toBe('Bright Red');
    expect(stringifyEnum(Color, 'Green')).toBe('Green');
  });

  it('parseEnum is case-insensitive and falls back to Unknown', () => {
    expect(parseEnum(Color, 'green')).toBe('Green');
    expect(parseEnum(Color, 'Bright Red')).toBe('Red');
    expect(parseEnum(Color, 'invalid')).toBe('Unknown');
    expect(parseEnum(Color, null)).toBe('Unknown');
  });
});

describe('serialize / parse', () => {
  class Inner {
    Name?: string;
    Amount?: number;
    static readonly __schema: readonly FieldSchema[] = [
      { name: 'Name' },
      { name: 'Amount', decimal: true },
    ];
  }

  class Outer {
    Title?: string;
    Inners?: Inner[];
    OptionalBool?: boolean;
    static readonly __schema: readonly FieldSchema[] = [
      { name: 'Title' },
      { name: 'Inners', isArray: true, type: Inner as unknown as Newable },
      { name: 'OptionalBool' },
    ];
  }

  it('omits null + undefined fields (NullValueHandling.Ignore)', () => {
    const o = new Outer();
    o.Title = 'hello';
    const inner = new Inner();
    inner.Amount = 1.5;
    o.Inners = [inner];
    expect(serializeToJson(o)).toBe('{"Title":"hello","Inners":[{"Amount":1.5}]}');
  });

  it('parse is case-insensitive', () => {
    const raw = { title: 'hi', inners: [{ name: 'a', amount: 2.5 }] };
    const parsed = parseTo<Outer>(Outer as unknown as Newable, raw);
    expect(parsed.Title).toBe('hi');
    expect(parsed.Inners?.[0]?.Name).toBe('a');
    expect(parsed.Inners?.[0]?.Amount).toBe(2.5);
  });

  it('decimal fields keep raw format on round-trip', () => {
    const o = new Outer();
    const inner = new Inner();
    inner.Amount = 1.0;
    o.Inners = [inner];
    // 1.0 should serialize as 1, but a true decimal would be 1.00 — that
    // distinction is lost in JS `number`. What matters here is no scientific
    // notation, and that round-tripping preserves the value.
    const json = serializeToJson(o);
    expect(json).toBe('{"Inners":[{"Amount":1}]}');
    const parsed = parseTo<Outer>(Outer as unknown as Newable, JSON.parse(json));
    expect(parsed.Inners?.[0]?.Amount).toBe(1);
  });
});
