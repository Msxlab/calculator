import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from '../utils/utils';

export const generatePDF = (project: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Logo (logo.png dosyasını public klasörüne eklemeniz gerekiyor)
  // doc.addImage('/logo.png', 'PNG', 15, yPos, 40, 20);

  // Şirket Bilgileri
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('United Granite', pageWidth - 15, yPos, { align: 'right' });
  
  doc.setFontSize(10);
  yPos += 10;
  doc.text('123 Stone Street', pageWidth - 15, yPos, { align: 'right' });
  yPos += 5;
  doc.text('Granite City, ST 12345', pageWidth - 15, yPos, { align: 'right' });
  yPos += 5;
  doc.text('(555) 555-5555', pageWidth - 15, yPos, { align: 'right' });
  yPos += 5;
  doc.text('info@unitedgranite.com', pageWidth - 15, yPos, { align: 'right' });

  // Quote Başlığı
  yPos += 15;
  doc.setFontSize(16);
  doc.text('QUOTE', 15, yPos);
  
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 15, yPos, { align: 'right' });

  // Müşteri Bilgileri
  yPos += 15;
  doc.setFontSize(12);
  doc.text('Customer Information:', 15, yPos);
  
  doc.setFontSize(10);
  yPos += 7;
  doc.text(`Name: ${project.customerInfo.name}`, 15, yPos);
  yPos += 5;
  doc.text(`Address: ${project.customerInfo.address}`, 15, yPos);
  yPos += 5;
  doc.text(`Phone: ${project.customerInfo.phone}`, 15, yPos);
  yPos += 5;
  doc.text(`Email: ${project.customerInfo.email}`, 15, yPos);

  // Proje Detayları
  yPos += 15;
  doc.setFontSize(12);
  doc.text('Project Details:', 15, yPos);
  
  doc.setFontSize(10);
  yPos += 7;
  doc.text(`Project Type: ${project.projectDetails.projectType}`, 15, yPos);
  yPos += 5;
  doc.text(`Material: ${project.projectDetails.materialType}`, 15, yPos);
  yPos += 5;
  doc.text(`Material Name: ${project.projectDetails.materialName}`, 15, yPos);
  yPos += 5;
  doc.text(`Edge Type: ${project.projectDetails.edgeType}`, 15, yPos);

  // Ölçümler Tablosu
  yPos += 15;
  const measurementData = [
    ...project.measurements.tops
      .filter((item: any) => item.length > 0 || item.width > 0)
      .map((item: any, index: number) => [
        `Top ${index + 1}`,
        item.length?.toFixed(2),
        item.width?.toFixed(2),
        item.sqft?.toFixed(2)
      ]),
    ...project.measurements.backsplashes
      .filter((item: any) => item.length > 0 || item.width > 0)
      .map((item: any, index: number) => [
        `Backsplash ${index + 1}`,
        item.length?.toFixed(2),
        item.width?.toFixed(2),
        item.sqft?.toFixed(2)
      ])
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Description', 'Length (in)', 'Width (in)', 'Sqft']],
    body: measurementData,
    theme: 'grid',
    headStyles: { fillColor: [80, 80, 80] },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 40, halign: 'right' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Ekstra Hizmetler Tablosu
  const extrasData = project.extras
    .filter((extra: any) => extra.quantity > 0)
    .map((extra: any) => [
      extra.name,
      extra.quantity,
      formatCurrency(extra.price),
      formatCurrency(extra.price * extra.quantity)
    ]);

  if (extrasData.length > 0) {
    doc.autoTable({
      startY: yPos,
      head: [['Service', 'Quantity', 'Unit Price', 'Total']],
      body: extrasData,
      theme: 'grid',
      headStyles: { fillColor: [80, 80, 80] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'right' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Toplam
  const totalSqft = measurementData.reduce((sum: number, row: any[]) => sum + parseFloat(row[3] || 0), 0);
  const materialPrice = totalSqft * 40; // Base price per sqft
  const extrasTotal = project.extras.reduce((sum: any, extra: any) => 
    sum + (extra.price * extra.quantity), 0);
  const grandTotal = materialPrice + extrasTotal;

  doc.setFontSize(10);
  doc.text(
    [
      `Material Cost (${totalSqft.toFixed(2)} sqft):`,
      `Additional Services:`,
      `Total Amount:`,
    ],
    pageWidth - 80,
    yPos
  );

  doc.text(
    [
      formatCurrency(materialPrice),
      formatCurrency(extrasTotal),
      formatCurrency(grandTotal),
    ],
    pageWidth - 15,
    yPos,
    { align: 'right' }
  );

  // Notlar ve Koşullar
  yPos += 30;
  doc.setFontSize(8);
  doc.text('Notes:', 15, yPos);
  yPos += 5;
  doc.text('1. All measurements are approximate and subject to final verification.', 15, yPos);
  yPos += 5;
  doc.text('2. Installation schedule will be confirmed after template.', 15, yPos);
  yPos += 5;
  doc.text('3. 50% deposit required to begin fabrication.', 15, yPos);

  // PDF'i kaydet
  doc.save(`United_Granite_Quote_${project.customerInfo.name.replace(/\s+/g, '_')}.pdf`);
};