export const calculateSqft = (length: number, width: number, lengthExtra: number, widthExtra: number): number => {
  // inch olarak verilen ekstra değerleri feet'e dönüştürmek için 12'ye bölüyoruz
  const lengthInFeet = length + (lengthExtra / 12);
  const widthInFeet = width + (widthExtra / 12);

  // Toplam alan hesaplaması
  return Number((lengthInFeet * widthInFeet).toFixed(2));
};
  
  export const calculatePrice = (sqft: number, pricePerSqft: number): number => {
    return Number((sqft * pricePerSqft).toFixed(2));
  };
  
  export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  export const calculateTotalSqft = (measurements: any) => {
    const topsSqft = measurements.tops.reduce((sum: number, m: any) => {
        // Toplam alan için inch değerlerini feet'e dönüştür
        const lengthInFeet = (m.length || 0) + (m.lengthExtra || 0) / 12;
        const widthInFeet = (m.width || 0) + (m.widthExtra || 0) / 12;

        // Alanı hesapla ve toplama ekle
        return sum + (lengthInFeet * widthInFeet);
    }, 0);

    const backsplashesSqft = measurements.backsplashes.reduce((sum: number, m: any) => {
        // Toplam alan için inch değerlerini feet'e dönüştür
        const lengthInFeet = (m.length || 0) + (m.lengthExtra || 0) / 12;
        const widthInFeet = (m.width || 0) + (m.widthExtra || 0) / 12;

        // Alanı hesapla ve toplama ekle
        return sum + (lengthInFeet * widthInFeet);
    }, 0);

    // Tüm alanları topla ve sonucu 2 ondalık basamağa yuvarla
    return Number((topsSqft + backsplashesSqft).toFixed(2));
};

  
  export const calculateTotalPrice = (
    measurements: any,
    basePricePerSqft: number,
    extras: any[]
  ) => {
    const totalSqft = calculateTotalSqft(measurements);
    const basePrice = totalSqft * basePricePerSqft;
    const extrasTotal = extras.reduce((sum, extra) => sum + (extra.totalPrice || 0), 0);
    return Number((basePrice + extrasTotal).toFixed(2));
  };