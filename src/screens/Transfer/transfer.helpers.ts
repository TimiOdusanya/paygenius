import type { Budget } from '@/types';
import type { PaymentSource } from '@/services/bills/bills.type';

export function digitsOnly(value: string) {
  return String(value ?? '').replace(/\D/g, '');
}

export function parseAmountSafe(value: string) {
  const n = Number(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function formatNaira(amount: number, fractionDigits = 2) {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function formatAmountInput(value: string) {
  const digits = value.replace(/[^\d.]/g, '');
  const [whole, frac] = digits.split('.');
  const grouped = (whole || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (frac !== undefined) return `₦${grouped}.${frac.slice(0, 2)}`;
  return grouped ? `₦${grouped}` : '';
}

export function formatReceiptDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';
  return `${months[date.getMonth()]} ${day}${suffix}, ${date.getFullYear()}`;
}

export function formatReceiptTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toTimeString().slice(0, 8);
}

export function budgetChipIcon(budget: Budget) {
  const cat = (budget.category ?? budget.name ?? '').toUpperCase();
  if (cat.includes('GROCER') || cat.includes('FOOD')) return 'cart-outline';
  if (cat.includes('DATA') || cat.includes('AIRTIME')) return 'wifi-outline';
  if (cat.includes('FUEL') || cat.includes('TRANSPORT')) return 'car-outline';
  if (cat.includes('UTIL') || cat.includes('ELECTRIC') || cat.includes('POWER')) return 'flash-outline';
  return 'wallet-outline';
}

export function initial(name?: string) {
  return (name || '?').trim().charAt(0).toUpperCase();
}

export function budgetRemaining(budget?: Budget) {
  if (!budget) return 0;
  if (typeof budget.remainingAmount === 'number') return Math.max(0, budget.remainingAmount);
  return Math.max(0, (budget.totalAmount ?? 0) - (budget.spentAmount ?? 0));
}

export function availableForTransfer(opts: {
  walletBalance: number;
  paymentSource?: PaymentSource;
  budget?: Budget;
}) {
  const wallet = Math.max(0, opts.walletBalance ?? 0);
  if (opts.paymentSource === 'BUDGET' && opts.budget) {
    return Math.min(wallet, budgetRemaining(opts.budget));
  }
  return wallet;
}
