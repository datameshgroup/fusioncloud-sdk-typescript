import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

/**
 * Mirror of the C# `Crypto` static class. All hex strings are uppercase to
 * match `BitConverter.ToString().Replace("-","")`.
 */

const ZERO_IV_8 = Buffer.alloc(8);

export function hashBySHA256(source: string): string {
  return createHash('sha256').update(source, 'utf8').digest('hex').toUpperCase();
}

/**
 * 3DES-CBC encrypt with zero IV and no padding. Inputs and outputs are hex.
 * Throws if the input length is not a multiple of the cipher block size (8).
 */
export function encryptWithTripleDES(sourceHex: string, keyHex: string): string {
  const cipher = createCipheriv('des-ede3-cbc', expandKey(keyHex), ZERO_IV_8);
  cipher.setAutoPadding(false);
  const input = Buffer.from(sourceHex, 'hex');
  const out = Buffer.concat([cipher.update(input), cipher.final()]);
  return out.toString('hex').toUpperCase();
}

export function decryptWithTripleDES(encodedHex: string, keyHex: string): string {
  const decipher = createDecipheriv('des-ede3-cbc', expandKey(keyHex), ZERO_IV_8);
  decipher.setAutoPadding(false);
  const input = Buffer.from(encodedHex, 'hex');
  const out = Buffer.concat([decipher.update(input), decipher.final()]);
  return out.toString('hex').toUpperCase();
}

/**
 * Generate a 16-byte (single-length 3DES) session key with odd parity per
 * byte, matching the C# `GenerateKey()` (which then uses it as the 24-byte
 * key by expanding K1K2 into K1K2K1). Returns hex.
 */
export function generateKey(): string {
  const key = randomBytes(16);
  for (let i = 0; i < key.length; i++) {
    const keyByte = key[i]! & 0xfe;
    let parity = 0;
    for (let b = keyByte; b !== 0; b >>>= 1) parity ^= b & 1;
    key[i] = keyByte | (parity === 0 ? 1 : 0);
  }
  return key.toString('hex').toUpperCase();
}

/**
 * Validate that the key is a valid 3DES key (length 16 or 24 bytes, i.e. 32
 * or 48 hex chars, even number of chars, hex-only). Throws on failure to
 * match the C# error messages used by SecurityTrailerHelper.
 */
export function validateKEK(kek: string | undefined | null): boolean {
  if (!kek) {
    throw new Error('Invalid kek. Length must be 32 or 48 characters.');
  }
  if (kek.length % 2 !== 0) {
    throw new Error(
      'Invalid kek. Length must be 32 or 48 characters, and cannot have an odd number of characters.',
    );
  }
  if (kek.length !== 32 && kek.length !== 48) {
    throw new Error('Invalid kek. Length must be 32 or 48 characters.');
  }
  if (!/^[0-9A-Fa-f]+$/.test(kek)) {
    throw new Error('Invalid kek. Can only contain the following characters: 0 to 9, A to F, a to f');
  }
  // Sanity-check Node can construct a cipher with this key.
  try {
    createCipheriv('des-ede3-cbc', expandKey(kek), ZERO_IV_8);
  } catch (e) {
    throw new Error(`Invalid kek. ${(e as Error).message}`);
  }
  return true;
}

/**
 * `des-ede3-cbc` requires a 24-byte key. C# `TripleDESCryptoServiceProvider`
 * accepts a 16-byte (two-key) key by reusing K1 as K3 internally; Node does
 * not, so we expand a 16-byte key here.
 */
function expandKey(keyHex: string): Buffer {
  const buf = Buffer.from(keyHex, 'hex');
  if (buf.length === 24) return buf;
  if (buf.length === 16) {
    const out = Buffer.alloc(24);
    buf.copy(out, 0);
    buf.subarray(0, 8).copy(out, 16);
    return out;
  }
  throw new Error(`Invalid 3DES key length: ${buf.length} bytes (expected 16 or 24)`);
}
