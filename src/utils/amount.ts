/**
 * Live thousand-separator formatting for money inputs (e.g. 1000 → 1,000).
 * Uses comma grouping and a period decimal (Naira / en-NG).
 */

/** Strip grouping commas so the value can be parsed or sent to the API. */
export function parseAmountInput(formatted: string): number {
  const n = parseFloat(formatted.replace(/,/g, ''));
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Format a raw keystroke string as a grouped amount.
 * Keeps a trailing decimal while typing (e.g. "1,000.") and caps kobo at 2 digits.
 */
export function formatAmountInput(raw: string): string {
  if (!raw) return '';

  const cleaned = raw.replace(/[^\d.]/g, '');
  if (!cleaned) return '';

  const dotIndex = cleaned.indexOf('.');
  const hasDecimal = dotIndex !== -1;
  const intRaw = hasDecimal ? cleaned.slice(0, dotIndex) : cleaned;
  const decRaw = hasDecimal
    ? cleaned.slice(dotIndex + 1).replace(/\./g, '').slice(0, 2)
    : '';

  const intDigits = intRaw.replace(/^0+(?=\d)/, '');
  const grouped = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (hasDecimal) {
    return `${grouped || '0'}.${decRaw}`;
  }
  return grouped;
}
