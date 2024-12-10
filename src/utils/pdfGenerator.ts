import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './utils';

export async function generatePDF(project: any) {
  const doc = new jsPDF();

  // Sayfa ölçüleri
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let currentPage = 1;
  const quoteNumber = Math.floor(Math.random() * 10000);

  function drawHeader() {
    doc.setFontSize(20);
    doc.setTextColor(40);

    try {
      doc.addImage('/logo.png', 'PNG', 15, 20, 50, 25);
    } catch (error) {
      console.log('Logo yüklenemedi');
    }

    doc.text('United Granite', 110, 30);

    doc.setFontSize(10);
    doc.text('47 Old Camplain Rd, Hillsborough, NJ 08844', 110, 40);
    doc.text('Phone: (908) 231-6677', 110, 45);
    doc.text('Email: info@unitedgranite.com', 110, 50);

    doc.setFontSize(12);
    doc.text(`Quote Date: ${new Date().toLocaleDateString()}`, 15, 60);
    doc.text(`Quote #: ${quoteNumber}`, pageWidth - 50, 60);

    doc.setFontSize(14);
    doc.text('CUSTOMER INFORMATION', 15, 80);
    doc.text('PROJECT DETAILS', 110, 80);

    doc.setFontSize(10);
    doc.text(`Name: ${project.customerInfo.name}`, 15, 85);
    doc.text(`Project Type: ${project.projectDetails.projectType}`, 110, 85);

    doc.text(`Address: ${project.customerInfo.address}`, 15, 90);
    doc.text(`Material: ${project.projectDetails.materialType}`, 110, 90);

    doc.text(`Phone: ${project.customerInfo.phone}`, 15, 95);
    doc.text(`Material Name: ${project.projectDetails.materialName}`, 110, 95);

    doc.text(`Email: ${project.customerInfo.email}`, 15, 100);
    doc.text(`Edge Type: ${project.projectDetails.edgeType}`, 110, 100);
  }

  function drawFooter(pageNumber: number) {
    doc.setFontSize(10);
    const signatureY = pageHeight - 40;
    doc.text('Customer Signature:', 15, signatureY);
    doc.line(15, signatureY + 10, 95, signatureY + 10);

    doc.setFontSize(8);
    doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  // İlk sayfa
  drawHeader();
  let yPos = 110; 

  // Ölçümler Tablosu
  const measurementsBody: any[] = [];
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
      margin: { left: 15, right: 15 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  const extrasBody = project.extras
    .filter((extra: any) => extra.quantity > 0)
    .map((extra: any) => [
      extra.name,
      extra.quantity,
      formatCurrency(extra.price),
      formatCurrency(extra.price * extra.quantity)
    ]);

  // Toplam Hesaplamalar
  const totalSqft = project.measurements.tops.reduce((sum: number, item: any) => sum + item.sqft, 0) +
                   project.measurements.backsplashes.reduce((sum: number, item: any) => sum + item.sqft, 0);
  const materialPrice = totalSqft * 40;
  const extrasTotal = project.extras.reduce((sum: number, extra: any) => sum + (extra.price * extra.quantity), 0);
  const grandTotal = materialPrice + extrasTotal;

  // Gerekli alan hesaplaması
  // Extras tablosu: başlık ~20px + satır başına 10px
  let extrasTableHeight = 0;
  if (extrasBody.length > 0) {
    extrasTableHeight = 20 + extrasBody.length * 10;
  }

  // Summary: 3 satır yazı (~15px)
  let summaryHeight = 15;

  // Terms & Conditions: 1 başlık + 3 satır, toplam ~17px
  let termsHeight = 17;

  const totalRequired = extrasTableHeight + summaryHeight + termsHeight;

  let secondPageNeeded = false;
  // Eğer bu içerik sığmazsa ikinci sayfa gerekli
  if (yPos + totalRequired > pageHeight - 50) {
    secondPageNeeded = true;
  }

  if (secondPageNeeded) {
    drawFooter(currentPage);
    doc.addPage();
    currentPage += 1;
    drawHeader();
    yPos = 110;
  }

  // Ekstra Hizmetler tablosu (gerekirse ikinci sayfada)
  if (extrasBody.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Service', 'Quantity', 'Unit Price', 'Total']],
      body: extrasBody,
      theme: 'striped',
      headStyles: { fillColor: [66, 66, 66] },
      margin: { left: 15, right: 15 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  const rightColumnX = 110;
  doc.setFontSize(10);
  doc.text(`Material Cost (${totalSqft.toFixed(2)} sqft): ${formatCurrency(materialPrice)}`, rightColumnX, yPos);
  yPos += 5;
  doc.text(`Additional Services: ${formatCurrency(extrasTotal)}`, rightColumnX, yPos);
  yPos += 5;
  doc.setFontSize(12);
  doc.text(`Total: ${formatCurrency(grandTotal)}`, rightColumnX, yPos);

  yPos += 20;

  doc.setFontSize(8);
  doc.text('Terms and Conditions:', 15, yPos);
  yPos += 5;
  doc.text('1. 50% deposit required to begin fabrication.', 15, yPos);
  yPos += 4;
  doc.text('2. Final measurements will be taken during template.', 15, yPos);
  yPos += 4;
  doc.text('3. Installation date will be scheduled after fabrication is complete.', 15, yPos);

  drawFooter(currentPage);
  doc.save(`United_Granite_Quote_${project.customerInfo.name.replace(/\s+/g, '_')}.pdf`);
}
