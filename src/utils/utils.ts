export function calculateSqft(length: number, width: number): number {
  if (!length || !width) return 0;
  const sqft = (length * width) / 144; // inch kare'den square feet'e çevirmek için 144'e bölüyoruz (12x12)
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

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}