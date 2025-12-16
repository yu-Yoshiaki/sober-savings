import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = '¥') {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: currency === '¥' ? 'JPY' : 'USD',
    currencyDisplay: 'symbol',
  }).format(amount);
}
