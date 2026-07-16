import crypto from "node:crypto";

// Excludes 0/O and 1/I/L to avoid ambiguity when read back over phone/WhatsApp.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_LENGTH = 6; // 31^6 ≈ 887M combinations — short, non-sequential, non-guessable

/** Generate a random order number like "DZ-7KQ2XM". Not guaranteed unique on its own — caller must retry on a DB unique-constraint conflict. */
export function generateOrderNumber(): string {
  const bytes = crypto.randomBytes(CODE_LENGTH);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) code += ALPHABET[bytes[i] % ALPHABET.length];
  return `DZ-${code}`;
}
