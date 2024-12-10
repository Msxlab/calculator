import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './utils';

export async function generatePDF(project: any) {
  const doc = new jsPDF();
  let yPos = 20;

  // Logo
  try {
    doc.addImage('/logo.png', 'PNG', 15, yPos, 50, 25);
  } catch (error) {
    console.log('Logo yüklenemedi');
  }

  // Şirket Bilgileri
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('United Granite', 110, yPos + 10);

  doc.setFontSize(10);
  doc.text('47 Old Camplain Rd, Hillsborough, NJ 08844', 110, yPos + 20);
  doc.text('Phone: (908) 231-6677', 110, yPos + 25);
  doc.text('Email: info@unitedgranite.com', 110, yPos + 30);

  yPos += 40;

  // Quote Numarası ve Tarih
  doc.setFontSize(12);
  doc.text(`Quote Date: ${new Date().toLocaleDateString()}`, 15, yPos);
  const quoteNumber = Math.floor(Math.random() * 10000);
  doc.text(`Quote #: ${quoteNumber}`, doc.internal.pageSize.width - 50, yPos);

  yPos += 20;

  // Soldaki sütun x koordinatı (Müşteri Bilgileri)
  const leftColumnX = 15;
  // Sağdaki sütun x koordinatı (Proje Detayları, Summary)
  const rightColumnX = 110;

  // Başlıklar
  doc.setFontSize(14);
  doc.text('CUSTOMER INFORMATION', leftColumnX, yPos);
  doc.text('PROJECT DETAILS', rightColumnX, yPos);

  yPos += 5;
  doc.setFontSize(10);

  // Müşteri Bilgileri ve Proje Detaylarını yan yana yazma
  doc.text(`Name: ${project.customerInfo.name}`, leftColumnX, yPos);
  doc.text(`Project Type: ${project.projectDetails.projectType}`, rightColumnX, yPos);

  yPos += 5;
  doc.text(`Address: ${project.customerInfo.address}`, leftColumnX, yPos);
  doc.text(`Material: ${project.projectDetails.materialType}`, rightColumnX, yPos);

  yPos += 5;
  doc.text(`Phone: ${project.customerInfo.phone}`, leftColumnX, yPos);
  doc.text(`Material Name: ${project.projectDetails.materialName}`, rightColumnX, yPos);

  yPos += 5;
  doc.text(`Email: ${project.customerInfo.email}`, leftColumnX, yPos);
  doc.text(`Edge Type: ${project.projectDetails.edgeType}`, rightColumnX, yPos);

  yPos += 20;

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

  // Toplam Hesaplamalar
  const totalSqft = project.measurements.tops.reduce((sum: number, item: any) => sum + item.sqft, 0) +
                   project.measurements.backsplashes.reduce((sum: number, item: any) => sum + item.sqft, 0);
  const materialPrice = totalSqft * 40; // Örnek: $40 per sqft
  const extrasTotal = project.extras.reduce((sum: any, extra: any) => sum + (extra.price * extra.quantity), 0);
  const grandTotal = materialPrice + extrasTotal;

  // SUMMARY Sağ Tarafta
  // Önce Y değerini bozmamak adına mevcut yPos'u kaydediyoruz
  const summaryStartY = yPos;
  
  doc.setFontSize(10);
  doc.text('SUMMARY', rightColumnX, summaryStartY);
  doc.setFontSize(10);
  doc.text(`Material Cost (${totalSqft.toFixed(2)} sqft): ${formatCurrency(materialPrice)}`, rightColumnX, summaryStartY + 5);
  doc.text(`Additional Services: ${formatCurrency(extrasTotal)}`, rightColumnX, summaryStartY + 10);
  doc.setFontSize(12);
  doc.text(`Total: ${formatCurrency(grandTotal)}`, rightColumnX, summaryStartY + 15);

  // SUMMARY alanı bitince yPos'u en alta alalım
  yPos = summaryStartY + 30;

  // Şartlar ve Koşullar Sol Tarafta
  doc.setFontSize(8);
  doc.text('Terms and Conditions:', leftColumnX, yPos);
  yPos += 5;
  doc.text('1. 50% deposit required to begin fabrication.', leftColumnX, yPos);
  yPos += 4;
  doc.text('2. Final measurements will be taken during template.', leftColumnX, yPos);
  yPos += 4;
  doc.text('3. Installation date will be scheduled after fabrication is complete.', leftColumnX, yPos);

  yPos += 10;

  // Customer Signature Alanı
  doc.setFontSize(10);
  doc.text('Customer Signature:', leftColumnX, yPos);
  yPos += 10;
  // İmza çizgisi (basit bir yatay çizgi)
  doc.line(leftColumnX, yPos, leftColumnX + 80, yPos); // 80 px uzunluğunda çizgi
  
  // PDF'i kaydet
  doc.save(`United_Granite_Quote_${project.customerInfo.name.replace(/\s+/g, '_')}.pdf`);
}
