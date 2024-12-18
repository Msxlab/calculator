import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateSqft(length: number, width: number): number {
  if (!length || !width) return 0;
  const sqft = (length * width) / 144; // Convert square inches to square feet
  return Number(sqft.toFixed(2));
}

export function calculatePrice(sqft: number, pricePerSqft: number = 40): number {
  return Number((sqft * pricePerSqft).toFixed(2));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}