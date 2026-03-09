import { describe, expect, it } from "vitest";
import { getEmailValidationError, getPasswordValidationError } from "./validation";

describe("getEmailValidationError", () => {
  it("returns error for empty string", () => {
    expect(getEmailValidationError("")).toBe("Email is required");
  });

  it("returns error for undefined and null", () => {
    expect(getEmailValidationError(undefined)).toBe("Email is required");
    expect(getEmailValidationError(null)).toBe("Email is required");
  });

  it("returns error for whitespace-only string", () => {
    expect(getEmailValidationError("   ")).toBe("Email is required");
  });

  it("returns error when email contains spaces", () => {
    expect(getEmailValidationError("user @example.com")).toBe("Email cannot contain spaces");
    expect(getEmailValidationError("user@ex ample.com")).toBe("Email cannot contain spaces");
  });

  it("returns error for invalid email formats", () => {
    expect(getEmailValidationError("invalid")).toBe("Please enter a valid email address");
    expect(getEmailValidationError("missing@domain")).toBe("Please enter a valid email address");
    expect(getEmailValidationError("@nodomain.com")).toBe("Please enter a valid email address");
    expect(getEmailValidationError("user@.com")).toBe("Please enter a valid email address");
  });

  it("returns null for valid emails", () => {
    expect(getEmailValidationError("user@example.com")).toBeNull();
    expect(getEmailValidationError("user.name@example.co.uk")).toBeNull();
    expect(getEmailValidationError("  user@example.com  ")).toBeNull();
    expect(getEmailValidationError("user+tag@example.com")).toBeNull();
  });
});

describe("getPasswordValidationError", () => {
  it("returns error for empty string", () => {
    expect(getPasswordValidationError("")).toBe("Password is required");
  });

  it("returns error for undefined and null", () => {
    expect(getPasswordValidationError(undefined)).toBe("Password is required");
    expect(getPasswordValidationError(null)).toBe("Password is required");
  });

  it("returns error when too short", () => {
    expect(getPasswordValidationError("Abc1!")).toBe("Password must be at least 8 characters");
  });

  it("returns error when too long", () => {
    const long = "A".repeat(129);
    expect(getPasswordValidationError(long)).toBe("Password must be at most 128 characters");
  });

  it("returns error when missing uppercase", () => {
    expect(getPasswordValidationError("alllower123!")).toBe(
      "Password must include at least one uppercase letter"
    );
  });

  it("returns error when missing lowercase", () => {
    expect(getPasswordValidationError("ALLUPPER123!")).toBe(
      "Password must include at least one lowercase letter"
    );
  });

  it("returns error when missing number", () => {
    expect(getPasswordValidationError("NoNumbers!")).toBe(
      "Password must include at least one number"
    );
  });

  it("returns error when missing special character", () => {
    expect(getPasswordValidationError("NoSpecial123")).toBe(
      "Password must include at least one special character"
    );
  });

  it("returns null for valid password", () => {
    expect(getPasswordValidationError("ValidPass1!")).toBeNull();
    expect(getPasswordValidationError("Abcdefg1@")).toBeNull();
    expect(getPasswordValidationError("Password123!")).toBeNull();
  });
});
