import { describe, expect, it } from "vitest";
import { clampNumber, isValueUnset, resolveAgeValue, resolveWeightValue } from "./wheelValues";

describe("isValueUnset", () => {
  it("returns true for null and undefined", () => {
    expect(isValueUnset(null)).toBe(true);
    expect(isValueUnset(undefined)).toBe(true);
  });

  it("returns false for other values", () => {
    expect(isValueUnset(0)).toBe(false);
    expect(isValueUnset("")).toBe(false);
    expect(isValueUnset(false)).toBe(false);
    expect(isValueUnset(NaN)).toBe(false);
  });
});

describe("clampNumber", () => {
  it("returns value when within range", () => {
    expect(clampNumber(50, 1, 120)).toBe(50);
  });

  it("clamps to min when below", () => {
    expect(clampNumber(-10, 1, 120)).toBe(1);
    expect(clampNumber(0, 1, 120)).toBe(1);
  });

  it("clamps to max when above", () => {
    expect(clampNumber(200, 1, 120)).toBe(120);
    expect(clampNumber(121, 1, 120)).toBe(120);
  });

  it("handles equal min and max", () => {
    expect(clampNumber(5, 10, 10)).toBe(10);
  });
});

describe("resolveAgeValue", () => {
  const min = 1;
  const max = 120;
  const fallback = 30;

  it("returns fallback for null and undefined", () => {
    expect(resolveAgeValue(null, min, max, fallback)).toBe(fallback);
    expect(resolveAgeValue(undefined, min, max, fallback)).toBe(fallback);
  });

  it("returns number as-is when within range", () => {
    expect(resolveAgeValue(25, min, max, fallback)).toBe(25);
  });

  it("parses string numbers", () => {
    expect(resolveAgeValue("42", min, max, fallback)).toBe(42);
  });

  it("clamps out-of-range values", () => {
    expect(resolveAgeValue(0, min, max, fallback)).toBe(min);
    expect(resolveAgeValue(200, min, max, fallback)).toBe(max);
  });

  it("returns fallback for NaN", () => {
    expect(resolveAgeValue("invalid", min, max, fallback)).toBe(fallback);
    expect(resolveAgeValue(NaN, min, max, fallback)).toBe(fallback);
  });
});

describe("resolveWeightValue", () => {
  const wholeMin = 44;
  const wholeMax = 220;
  const decimalMin = 0;
  const decimalMax = 9;

  it("returns min fallback for null and undefined", () => {
    expect(resolveWeightValue(null, wholeMin, wholeMax, decimalMin, decimalMax)).toEqual({
      whole: wholeMin,
      decimal: decimalMin,
    });
    expect(resolveWeightValue(undefined, wholeMin, wholeMax, decimalMin, decimalMax)).toEqual({
      whole: wholeMin,
      decimal: decimalMin,
    });
  });

  it("parses and splits whole and decimal parts", () => {
    expect(resolveWeightValue(70.5, wholeMin, wholeMax, decimalMin, decimalMax)).toEqual({
      whole: 70,
      decimal: 5,
    });
  });

  it("rounds decimal to nearest tenth", () => {
    expect(resolveWeightValue(70.54, wholeMin, wholeMax, decimalMin, decimalMax)).toEqual({
      whole: 70,
      decimal: 5,
    });
    expect(resolveWeightValue(70.56, wholeMin, wholeMax, decimalMin, decimalMax)).toEqual({
      whole: 70,
      decimal: 6,
    });
  });

  it("clamps whole and decimal parts", () => {
    expect(resolveWeightValue(30.5, wholeMin, wholeMax, decimalMin, decimalMax)).toEqual({
      whole: wholeMin,
      decimal: 5,
    });
    expect(resolveWeightValue(250.5, wholeMin, wholeMax, decimalMin, decimalMax)).toEqual({
      whole: wholeMax,
      decimal: 5,
    });
    expect(resolveWeightValue(70.99, wholeMin, wholeMax, decimalMin, decimalMax)).toEqual({
      whole: 70,
      decimal: decimalMax,
    });
  });

  it("returns min fallback for NaN", () => {
    expect(resolveWeightValue("invalid", wholeMin, wholeMax, decimalMin, decimalMax)).toEqual({
      whole: wholeMin,
      decimal: decimalMin,
    });
  });
});
