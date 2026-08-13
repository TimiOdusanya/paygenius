import type { ImageSourcePropType } from 'react-native';
import type { Budget } from '@/types';
import type { BillCategory, Biller, PaymentSource } from '@/services/bills/bills.type';
import type { WalletSourceOption } from '@/components/WalletSourceField';

const LOCAL_LOGOS: Record<string, ImageSourcePropType> = {
  mtn: require('../../../assets/images/bills/logo-mtn.png'),
  glo: require('../../../assets/images/bills/logo-glo.png'),
  airtel: require('../../../assets/images/bills/logo-airtel.png'),
  '9mobile': require('../../../assets/images/bills/logo-9mobile.png'),
  etisalat: require('../../../assets/images/bills/logo-9mobile.png'),
  ibedc: require('../../../assets/images/bills/logo-ibedc.png'),
  'ibadan-electric': require('../../../assets/images/bills/logo-ibedc.png'),
};

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG', {
    maximumFractionDigits: 0,
  })}`;
}

export function formatPhoneGroups(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

export function parseAmountSafe(value: string) {
  const n = Number(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function budgetLabel(category: BillCategory) {
  if (category === 'AIRTIME') return 'Airtime Budget';
  if (category === 'DATA') return 'Data Budget';
  if (category === 'ELECTRICITY') return 'Electricity Budget';
  return 'Television Budget';
}

export function matchingBudgets(budgets: Budget[], category: BillCategory) {
  return budgets.filter((budget) => {
    const name = (budget.name ?? '').toLowerCase();
    const cat = (budget.category ?? '').toUpperCase();
    if (category === 'AIRTIME' || category === 'DATA') {
      return cat === 'DATA' || name.includes('airtime') || name.includes('data');
    }
    return (
      cat === 'UTILITY' ||
      name.includes('electric') ||
      name.includes('tv') ||
      name.includes('cable') ||
      name.includes('dstv') ||
      name.includes('gotv')
    );
  });
}

export function walletOptions(
  budgets: Budget[],
  category: BillCategory
): WalletSourceOption[] {
  const options: WalletSourceOption[] = [
    { id: 'wallet', source: 'WALLET' as PaymentSource, label: 'Paygenius wallet' },
  ];
  matchingBudgets(budgets, category).forEach((budget) => {
    options.push({
      id: budget._id,
      source: 'BUDGET',
      label: budget.name || budgetLabel(category),
      budgetId: budget._id,
    });
  });
  return options;
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

export function networkLogoKey(code: string) {
  const id = code.toLowerCase();
  if (id.includes('mtn')) return 'mtn';
  if (id.includes('glo')) return 'glo';
  if (id.includes('airtel')) return 'airtel';
  if (id.includes('etisalat') || id.includes('9mobile')) return '9mobile';
  if (id.includes('ibadan') || id.includes('ibedc')) return 'ibedc';
  return id;
}

export function localBillerLogo(code: string): ImageSourcePropType | undefined {
  return LOCAL_LOGOS[networkLogoKey(code)] ?? LOCAL_LOGOS[code.toLowerCase()];
}

export function billerLogoSource(biller?: Pick<Biller, 'code' | 'image'> | null) {
  if (!biller) return undefined;
  const local = localBillerLogo(biller.code);
  if (local) return local;
  if (biller.image) return { uri: biller.image };
  return undefined;
}

export function sortNetworkBillers(billers: Biller[]) {
  const rank = (code: string) => {
    const key = networkLogoKey(code);
    if (key === 'mtn') return 0;
    if (key === 'glo') return 1;
    if (key === 'airtel') return 2;
    if (key === '9mobile') return 3;
    return 10;
  };
  return [...billers].sort((a, b) => rank(a.code) - rank(b.code) || a.name.localeCompare(b.name));
}
