import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { jsPDF as jsPDFType } from 'jspdf';

interface CustomJsPDF extends jsPDFType {
  lastAutoTable?: {
    finalY: number;
  };
}

export const generatePDF = (data: any) => {
  const doc = new jsPDF() as CustomJsPDF;
  let currentY = 20;
  
  // Logo ve Başlık
  doc.setFontSize(12);
  doc.text('United Granite', 70, currentY);
  doc.text('Address: ...', 70, currentY + 10);
  doc.text('Phone: ...', 70, currentY + 20);
  
  // Müşteri bilgileri
  currentY += 40;
  doc.setFontSize(14);
  doc.text('Quote Details', 15, currentY);
  
  // Ölçümler tablosu
  currentY += 10;
  doc.autoTable({
    startY: currentY,
    head: [['Description', 'Length', 'Width', 'Sqft', 'Price']],
    body: [
      // Tops
      ...data.measurements.tops.map((item: any, index: number) => [
        `Top ${index + 1}`,
        item.length || '',
        item.width || '',
        item.sqft || '',
        item.price || ''
      ]).filter((row: any[]) => row[1] || row[2] || row[3]),
      
      // Backsplashes
      ...data.measurements.backsplashes.map((item: any, index: number) => [
        `Backsplash ${index + 1}`,
        item.length || '',
        item.width || '',
        item.sqft || '',
        item.price || ''
      ]).filter((row: any[]) => row[1] || row[2] || row[3])
    ],
  });

  // Ekstra hizmetler tablosu
  currentY = doc.lastAutoTable?.finalY || currentY + 60;
  
  doc.autoTable({
    startY: currentY + 10,
    head: [['Service', 'Quantity', 'Price']],
    body: (data.extras || []).map((extra: any) => [
      extra.name,
      extra.quantity,
      `$${extra.price}`
    ]),
  });

  // Toplam fiyat
  currentY = doc.lastAutoTable?.finalY || currentY + 60;
  doc.setFontSize(16);
  doc.text(`Total: $${data.totalPrice}`, 150, currentY + 20);
  
  // PDF'i kaydet
  doc.save(`quote-${data.customerInfo.name || 'unnamed'}.pdf`);
};