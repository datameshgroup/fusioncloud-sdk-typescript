import { describe, expect, it } from 'vitest';
import {
  decryptWithTripleDES,
  encryptWithTripleDES,
  generateKey,
  hashBySHA256,
  validateKEK,
} from '../../src/util/Crypto.js';

describe('Crypto', () => {
  describe('hashBySHA256', () => {
    it('returns uppercase hex matching .NET BitConverter format', () => {
      // sha256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
      expect(hashBySHA256('hello')).toBe(
        '2CF24DBA5FB0A30E26E83B2AC5B9E29E1B161E5C1FA7425E73043362938B9824',
      );
    });

    it('handles empty string', () => {
      expect(hashBySHA256('')).toBe(
        'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855',
      );
    });
  });

  describe('TripleDES round-trip', () => {
    it('encrypts then decrypts to the original bytes (16-byte key)', () => {
      const key = generateKey();
      // 16 hex chars = 8 bytes, exactly one DES block
      const plaintext = '0123456789ABCDEF';
      const encrypted = encryptWithTripleDES(plaintext, key);
      const decrypted = decryptWithTripleDES(encrypted, key);
      expect(decrypted).toBe(plaintext);
    });

    it('encrypts then decrypts to the original bytes (24-byte key)', () => {
      const key = '0123456789ABCDEF0123456789ABCDEFFEDCBA9876543210';
      const plaintext = '0123456789ABCDEF';
      const encrypted = encryptWithTripleDES(plaintext, key);
      const decrypted = decryptWithTripleDES(encrypted, key);
      expect(decrypted).toBe(plaintext);
    });
  });

  describe('generateKey', () => {
    it('returns 16 bytes (32 hex chars) of odd-parity bytes', () => {
      for (let trial = 0; trial < 50; trial++) {
        const key = generateKey();
        expect(key).toHaveLength(32);
        const bytes = Buffer.from(key, 'hex');
        expect(bytes.length).toBe(16);
        for (const byte of bytes) {
          // odd parity: number of 1-bits should be odd
          let bits = 0;
          for (let b = byte; b !== 0; b >>>= 1) bits ^= b & 1;
          expect(bits).toBe(1);
        }
      }
    });
  });

  describe('validateKEK', () => {
    it('accepts a valid 48-char hex key', () => {
      expect(() => validateKEK('1140B940AD020C7C6EC25DBDBDA4759E3A329CCC6D07A694')).not.toThrow();
    });

    it('accepts a valid 32-char hex key', () => {
      expect(() => validateKEK('0123456789ABCDEF0123456789ABCDEF')).not.toThrow();
    });

    it('rejects null/empty/short/non-hex inputs', () => {
      expect(() => validateKEK('')).toThrow(/Length must be 32 or 48/);
      expect(() => validateKEK(null)).toThrow();
      expect(() => validateKEK('aabb')).toThrow(/Length must be 32 or 48/);
      expect(() => validateKEK('0123456789ABCDEF0123456789ABCDEZ')).toThrow(/Can only contain/);
      expect(() => validateKEK('0123456789ABCDE')).toThrow(/odd number/);
    });
  });
});
