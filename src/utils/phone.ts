import type { AppRegion } from '@/stores/preferences.store';

export type DialInfo = {
  region: AppRegion;
  iso: 'NG' | 'US';
  dialCode: string;
  label: 'NGN' | 'USA';
  localMaxLength: number;
  placeholder: string;
};

export function getDialInfo(region: AppRegion | null): DialInfo {
  if (region === 'USA') {
    return {
      region: 'USA',
      iso: 'US',
      dialCode: '+1',
      label: 'USA',
      localMaxLength: 10,
      placeholder: '5551234567',
    };
  }
  return {
    region: 'NGN',
    iso: 'NG',
    dialCode: '+234',
    label: 'NGN',
    localMaxLength: 11,
    placeholder: '8146414524',
  };
}

/** Strip to digits only. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Convert a locally typed number into the E.164 value stored at registration.
 * NGN: 08146414524 / 8146414524 / 2348146414524 → +2348146414524
 * USA: 5551234567 / 15551234567 → +15551234567
 */
export function toE164(raw: string, region: AppRegion | null): string {
  const trimmed = raw.trim();
  const digits = digitsOnly(trimmed);

  if (!digits) return '';

  if (region === 'USA') {
    if (trimmed.startsWith('+')) return `+${digits}`;
    if (digits.startsWith('1') && digits.length === 11) return `+${digits}`;
    return `+1${digits}`;
  }

  // Nigeria (default) — same rules as backend normalisePhone
  if (trimmed.startsWith('+')) return `+${digits}`;
  if (/^0\d{10}$/.test(digits)) return `+234${digits.slice(1)}`;
  if (/^234\d{10}$/.test(digits)) return `+${digits}`;
  if (/^\d{10}$/.test(digits)) return `+234${digits}`;
  if (digits.startsWith('234')) return `+${digits}`;
  if (digits.startsWith('0')) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}

/** Local digits to show in the input, given a stored E.164 number. */
export function toLocalDigits(e164: string, region: AppRegion | null): string {
  const digits = digitsOnly(e164);
  if (region === 'USA') {
    if (digits.startsWith('1') && digits.length === 11) return digits.slice(1);
    return digits;
  }
  if (digits.startsWith('234')) return digits.slice(3);
  if (digits.startsWith('0') && digits.length === 11) return digits.slice(1);
  return digits;
}

export function isValidLocalPhone(local: string, region: AppRegion | null): boolean {
  const digits = digitsOnly(local);
  if (region === 'USA') {
    return digits.length === 10 || (digits.startsWith('1') && digits.length === 11);
  }
  return digits.length >= 10 && digits.length <= 11;
}

export function isEmailIdentifier(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
