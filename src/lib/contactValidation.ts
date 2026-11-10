export type ContactFieldName = 'name' | 'email' | 'message';

export interface ContactFieldValues {
  name: string;
  email: string;
  message: string;
}

export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { min: 5, max: 120 },
  message: { min: 10, max: 2000 },
} as const;

const EMAIL_REGEX =
  /^[^\s@<>()[\]\\.,;:@"]+(\.[^\s@<>()[\]\\.,;:@"]+)*@[^\s@<>()[\]\\.,;:@"]+(\.[^\s@<>()[\]\\.,;:@"]+)*\.[^\s@<>()[\]\\.,;:@"]{2,}$/;

function normalizeSingleLine(input: string): string {
  return input.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeMessage(input: string): string {
  return input.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
}

export function validateContactField(
  field: ContactFieldName,
  rawValue: string
): string | undefined {
  if (field === 'name') {
    const value = normalizeSingleLine(rawValue);
    if (value.length === 0) {
      return 'Ingresá tu nombre o empresa.';
    }
    if (value.length < CONTACT_LIMITS.name.min) {
      return `El nombre debe tener al menos ${CONTACT_LIMITS.name.min} caracteres.`;
    }
    if (value.length > CONTACT_LIMITS.name.max) {
      return `El nombre no puede superar los ${CONTACT_LIMITS.name.max} caracteres.`;
    }
    return undefined;
  }

  if (field === 'email') {
    const value = normalizeSingleLine(rawValue).toLowerCase();
    if (value.length === 0) {
      return 'Ingresá tu correo electrónico.';
    }
    if (
      value.length < CONTACT_LIMITS.email.min ||
      value.length > CONTACT_LIMITS.email.max ||
      !EMAIL_REGEX.test(value)
    ) {
      return 'Ingresá un correo electrónico válido (ejemplo: nombre@dominio.com).';
    }
    return undefined;
  }

  const value = normalizeMessage(rawValue);
  if (value.length === 0) {
    return 'Escribí un mensaje para poder responderte.';
  }
  if (value.length < CONTACT_LIMITS.message.min) {
    return `El mensaje debe tener al menos ${CONTACT_LIMITS.message.min} caracteres (actual: ${value.length}).`;
  }
  if (value.length > CONTACT_LIMITS.message.max) {
    return `El mensaje no puede superar los ${CONTACT_LIMITS.message.max} caracteres.`;
  }
  return undefined;
}

export function validateContact(
  values: ContactFieldValues
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  const nameError = validateContactField('name', values.name);
  if (nameError) errors.name = nameError;

  const emailError = validateContactField('email', values.email);
  if (emailError) errors.email = emailError;

  const messageError = validateContactField('message', values.message);
  if (messageError) errors.message = messageError;

  return errors;
}

export function hasContactErrors(errors: ContactFieldErrors): boolean {
  return Boolean(errors.name || errors.email || errors.message);
}

export function firstInvalidContactField(
  errors: ContactFieldErrors
): ContactFieldName | null {
  if (errors.name) return 'name';
  if (errors.email) return 'email';
  if (errors.message) return 'message';
  return null;
}
