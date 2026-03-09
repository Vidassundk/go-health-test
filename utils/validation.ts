const EMAIL_REGEX =
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

export function getEmailValidationError(email: string | undefined | null): string | null {
  const value = String(email ?? "").trim();

  if (!value) {
    return "Email is required";
  }

  if (/\s/.test(value)) {
    return "Email cannot contain spaces";
  }

  if (!EMAIL_REGEX.test(value)) {
    return "Please enter a valid email address";
  }

  return null;
}

export function getPasswordValidationError(password: string | undefined | null): string | null {
  const value = String(password ?? "");

  if (!value) {
    return "Password is required";
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }

  if (value.length > PASSWORD_MAX_LENGTH) {
    return `Password must be at most ${PASSWORD_MAX_LENGTH} characters`;
  }

  if (!/[A-Z]/.test(value)) {
    return "Password must include at least one uppercase letter";
  }

  if (!/[a-z]/.test(value)) {
    return "Password must include at least one lowercase letter";
  }

  if (!/[0-9]/.test(value)) {
    return "Password must include at least one number";
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    return "Password must include at least one special character";
  }

  return null;
}
