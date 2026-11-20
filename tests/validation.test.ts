import { describe, expect, it } from "vitest";
import {
  isValidTunisianPhone,
  normalizePhone,
  parseCustomAmount,
  validateProfile,
} from "@/lib/pap/validation";

describe("Tunisian phone validation", () => {
  it.each([
    "22 123 456",
    "22123456",
    "+216 22 123 456",
    "+21622123456",
    "00216 98 765 432",
    "71 234 567",
    "45 678 901",
  ])("accepts %s", (phone) => {
    expect(isValidTunisianPhone(phone)).toBe(true);
  });

  it.each(["", "12 345 678", "22 123 45", "22 123 4567", "abc", "+33 6 12 34 56 78"])(
    "rejects %s",
    (phone) => {
      expect(isValidTunisianPhone(phone)).toBe(false);
    },
  );

  it("normalises separators", () => {
    expect(normalizePhone("+216 (22) 123-456")).toBe("+21622123456");
  });
});

describe("profile validation", () => {
  it("accepts a complete profile", () => {
    const result = validateProfile({
      firstName: "Amine",
      lastName: "Ben Ali",
      phone: "22 123 456",
    });
    expect(result.ok).toBe(true);
    expect(result.value?.phone).toBe("22123456");
  });

  it("reports every invalid field", () => {
    const result = validateProfile({ firstName: "A", lastName: "", phone: "123" });
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual({
      firstName: "tooShort",
      lastName: "required",
      phone: "invalidPhone",
    });
  });
});

describe("custom amount", () => {
  it.each([
    ["15", 15],
    ["15,5", 15.5],
    ["1", 1],
    ["10 000", 10000],
  ])("accepts %s", (raw, expected) => {
    const result = parseCustomAmount(raw);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(expected);
  });

  it.each(["", "0", "-5", "abc", "1.234", "10001", "10,999"])("rejects %s", (raw) => {
    expect(parseCustomAmount(raw).ok).toBe(false);
  });
});
