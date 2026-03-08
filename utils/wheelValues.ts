export function isValueUnset(value: unknown): value is null | undefined {
  return value === undefined || value === null;
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function resolveAgeValue(
  value: string | number | undefined,
  min: number,
  max: number,
  fallback: number
): number {
  if (isValueUnset(value)) {
    return fallback;
  }
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  if (isNaN(n)) {
    return fallback;
  }
  return clampNumber(n, min, max);
}

export function resolveWeightValue(
  value: string | number | undefined,
  wholeMin: number,
  wholeMax: number,
  decimalMin: number,
  decimalMax: number
): { whole: number; decimal: number } {
  if (isValueUnset(value)) {
    return { whole: wholeMin, decimal: decimalMin };
  }
  const n = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(n)) {
    return { whole: wholeMin, decimal: decimalMin };
  }
  const whole = Math.floor(n);
  const decimal = Math.round((n - whole) * 10);
  return {
    whole: clampNumber(whole, wholeMin, wholeMax),
    decimal: clampNumber(decimal, decimalMin, decimalMax),
  };
}
