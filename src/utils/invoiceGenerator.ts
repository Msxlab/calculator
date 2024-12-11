import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './utils';

export async function generateInvoicePDF(invoiceData: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

  // Logo ve Başlık
  try {
    doc.addImage('/logo.png', 'PNG', 15, 20, 50, 25);
  } catch (error) {
    console.log('Logo yüklenemedi');
  }

  doc.setFontSize(20);
  doc.text('INVOICE', pageWidth / 2, 30, { align: 'center' });

  // Şirket Bilgileri (Sağ Üst Köşe)
  const companyInfoX = pageWidth - 75; // Şirket bilgileri için X koordinatı
  const companyInfoY = 20; // Şirket bilgileri için başlangıç Y koordinatı

  doc.setFontSize(10);
  doc.text('United Granite', companyInfoX, companyInfoY);
  doc.text('47 Old Camplain Rd', companyInfoX, companyInfoY + 5);
  doc.text('Hillsborough, NJ 08844', companyInfoX, companyInfoY + 10);
  doc.text('(908) 231-6677', companyInfoX, companyInfoY + 15);

  // Invoice Detayları
  doc.setFontSize(12);
  doc.text(`Invoice #: ${invoiceNumber}`, 15, 50);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 50, 50);

  // Müşteri Bilgileri
  doc.text('Bill To:', 15, 70);
  doc.setFontSize(10);
  doc.text(invoiceData.customerInfo.name, 15, 80);
  doc.text(invoiceData.customerInfo.address, 15, 85);
  doc.text(invoiceData.customerInfo.phone, 15, 90);
  doc.text(invoiceData.customerInfo.email, 15, 95);

  // Invoice Items Tablosu
  let yPos = 110;
  autoTable(doc, {
    startY: yPos,
    head: [['Description', 'Quantity', 'Unit Price', 'Total']],
    body: invoiceData.items.map((item: any) => [
      item.description,
      item.quantity,
      formatCurrency(item.price),
      formatCurrency(item.price * item.quantity)
    ]),
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] },
    margin: { left: 15, right: 15 },
  });

  // Toplam
  yPos = (doc as any).lastAutoTable.finalY + 20;
  const total = invoiceData.items.reduce((sum: number, item: any) => 
    sum + (item.price * item.quantity), 0);

  doc.text(`Total Amount: ${formatCurrency(total)}`, pageWidth - 50, yPos);

  // Payment Terms
  yPos += 30;
  doc.setFontSize(10);
  doc.text('Payment Terms:', 15, yPos);
  doc.text('Due upon receipt', 15, yPos + 5);
  doc.text('Please make checks payable to: United Granite', 15, yPos + 10);

  doc.save(`Invoice_${invoiceNumber}.pdf`);
}
