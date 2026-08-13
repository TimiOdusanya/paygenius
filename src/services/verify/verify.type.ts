export type Bank = {
  name: string;
  code: string;
  slug: string;
  active: boolean;
  logo?: string;
};

export type ResolvedAccount = {
  accountNumber: string;
  accountName: string;
};

export type ResolvedCardBin = {
  bin: string;
  brand: string;
  cardType: string;
  bank: string;
  countryCode: string;
};
