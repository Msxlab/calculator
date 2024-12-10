import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './utils';

export async function generatePDF(project: any) {
  const doc = new jsPDF();
  let yPos = 20;

  // Logo
  // Not: Logo'yu public klasörüne eklemeyi unutmayın
  try {
    doc.addImage('/logo.png', 'PNG', 15, yPos, 50, 25);
  } catch (error) {
    console.log('Logo yüklenemedi');
  }

  // Şirket Bilgileri
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('United Granite', 75, yPos + 10);
  
  doc.setFontSize(10);
  doc.text('47 Old Camplain Rd, Hillsborough, NJ 08844', 75, yPos + 20);
  doc.text('Phone: (908) 231-6677', 75, yPos + 25);
  doc.text('Email: info@unitedgranite.com', 75, yPos + 30);

  yPos += 50;

  // Quote Numarası ve Tarih
  doc.setFontSize(12);
  doc.text(`Quote Date: ${new Date().toLocaleDateString()}`, 15, yPos);
  const quoteNumber = Math.floor(Math.random() * 10000);
  doc.text(`Quote #: ${quoteNumber}`, doc.internal.pageSize.width - 50, yPos);

  yPos += 20;

  // Müşteri Bilgileri
  doc.setFontSize(14);
  doc.text('CUSTOMER INFORMATION', 15, yPos);
  yPos += 10;
  doc.setFontSize(10);
  doc.text(`Name: ${project.customerInfo.name}`, 15, yPos);
  doc.text(`Address: ${project.customerInfo.address}`, 15, yPos + 5);
  doc.text(`Phone: ${project.customerInfo.phone}`, 15, yPos + 10);
  doc.text(`Email: ${project.customerInfo.email}`, 15, yPos + 15);

  yPos += 30;

  // Proje Detayları
  doc.setFontSize(14);
  doc.text('PROJECT DETAILS', 15, yPos);
  yPos += 10;
  doc.setFontSize(10);
  doc.text(`Project Type: ${project.projectDetails.projectType}`, 15, yPos);
  doc.text(`Material: ${project.projectDetails.materialType}`, 15, yPos + 5);
  doc.text(`Material Name: ${project.projectDetails.materialName}`, 15, yPos + 10);
  doc.text(`Edge Type: ${project.projectDetails.edgeType}`, 15, yPos + 15);

  yPos += 30;

  // Ölçümler Tablosu
  const measurementsBody = [];
  // Tops
  project.measurements.tops.forEach((item: any, index: number) => {
    if (item.length > 0 || item.width > 0) {
      measurementsBody.push([
        `Top ${index + 1}`,
        `${item.length}"`,
        `${item.width}"`,
        item.sqft.toFixed(2)
      ]);
    }
  });
  // Backsplashes
  project.measurements.backsplashes.forEach((item: any, index: number) => {
    if (item.length > 0 || item.width > 0) {
      measurementsBody.push([
        `Backsplash ${index + 1}`,
        `${item.length}"`,
        `${item.width}"`,
        item.sqft.toFixed(2)
      ]);
    }
  });

  if (measurementsBody.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Description', 'Length', 'Width', 'Sqft']],
      body: measurementsBody,
      theme: 'striped',
      headStyles: { fillColor: [66, 66, 66] },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Ekstra Hizmetler
  const extrasBody = project.extras
    .filter((extra: any) => extra.quantity > 0)
    .map((extra: any) => [
      extra.name,
      extra.quantity,
      formatCurrency(extra.price),
      formatCurrency(extra.price * extra.quantity)
    ]);

  if (extrasBody.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Service', 'Quantity', 'Unit Price', 'Total']],
      body: extrasBody,
      theme: 'striped',
      headStyles: { fillColor: [66, 66, 66] },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Toplam
  const totalSqft = project.measurements.tops.reduce((sum: number, item: any) => sum + item.sqft, 0) +
                   project.measurements.backsplashes.reduce((sum: number, item: any) => sum + item.sqft, 0);
  const materialPrice = totalSqft * 40; // $40 per sqft
  const extrasTotal = project.extras.reduce((sum: any, extra: any) => sum + (extra.price * extra.quantity), 0);
  const grandTotal = materialPrice + extrasTotal;

  yPos += 10;
  doc.setFontSize(10);
  doc.text('SUMMARY', 15, yPos);
  yPos += 5;
  doc.text(`Material Cost (${totalSqft.toFixed(2)} sqft): ${formatCurrency(materialPrice)}`, 15, yPos);
  yPos += 5;
  doc.text(`Additional Services: ${formatCurrency(extrasTotal)}`, 15, yPos);
  yPos += 5;
  doc.setFontSize(12);
  doc.text(`Total: ${formatCurrency(grandTotal)}`, 15, yPos);

  // Şartlar ve Koşullar
  yPos += 20;
  doc.setFontSize(8);
  doc.text('Terms and Conditions:', 15, yPos);
  yPos += 5;
  doc.text('1. 50% deposit required to begin fabrication.', 15, yPos);
  yPos += 4;
  doc.text('2. Final measurements will be taken during template.', 15, yPos);
  yPos += 4;
  doc.text('3. Installation date will be scheduled after fabrication is complete.', 15, yPos);

  // PDF'i kaydet
  doc.save(`United_Granite_Quote_${project.customerInfo.name.replace(/\s+/g, '_')}.pdf`);
}