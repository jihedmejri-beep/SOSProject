import { PAP } from "@/lib/pap/domain";

export type FieldErrorCode = "required" | "tooShort" | "invalidPhone";

export type ProfileErrors = {
  firstName?: FieldErrorCode;
  lastName?: FieldErrorCode;
  phone?: FieldErrorCode;
};

export type ProfileInput = {
  firstName: string;
  lastName: string;
  phone: string;
};

export type ValidProfile = {
  firstName: string;
  lastName: string;
  phone: string;
};

export function normalizePhone(raw: string): string {
  return raw.replace(/[\s().-]/g, "");
}

/**
 * Tunisian numbers: 8 digits, starting with 2, 4, 5 or 9 for mobile lines.
 * An optional +216 (or 00216) country prefix is accepted.
 */
export function isValidTunisianPhone(raw: string): boolean {
  const value = normalizePhone(raw);
  if (!value) return false;
  const national = value.replace(/^(\+216|00216|216)/, "");
  return /^[24579]\d{7}$/.test(national);
}

export function validateProfile(input: ProfileInput): {
  ok: boolean;
  errors: ProfileErrors;
  value?: ValidProfile;
} {
  const errors: ProfileErrors = {};
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const phone = input.phone.trim();

  if (!firstName) errors.firstName = "required";
  else if (firstName.length < 2) errors.firstName = "tooShort";

  if (!lastName) errors.lastName = "required";
  else if (lastName.length < 2) errors.lastName = "tooShort";

  if (!phone) errors.phone = "required";
  else if (!isValidTunisianPhone(phone)) errors.phone = "invalidPhone";

  const ok = Object.keys(errors).length === 0;
  return ok
    ? { ok, errors, value: { firstName, lastName, phone: normalizePhone(phone) } }
    : { ok, errors };
}

export function parseCustomAmount(raw: string): { ok: true; value: number } | { ok: false } {
  const cleaned = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!cleaned) return { ok: false };
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return { ok: false };
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { ok: false };
  if (value < PAP.minCustomAmount || value > PAP.maxCustomAmount) return { ok: false };
  return { ok: true, value: Math.round(value * 100) / 100 };
}
