export function formatNaira(
  amount: number,
  options?: { compact?: boolean; sign?: boolean }
): string {
  const abs = Math.abs(amount || 0);
  const formatted = abs.toLocaleString('en-NG', {
    maximumFractionDigits: options?.compact ? 0 : 0,
  });
  const body = `₦${formatted}`;
  if (!options?.sign) return body;
  if (amount > 0) return `+${body}`;
  if (amount < 0) return `-${formatted}`;
  return body;
}

export function formatSignedAmount(amount: number, type: string): string {
  const sign = type === 'CREDIT' ? '+' : '-';
  return `${sign}${Math.abs(amount || 0).toLocaleString('en-NG', {
    maximumFractionDigits: 0,
  })}`;
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;
