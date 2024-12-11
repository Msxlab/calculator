import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './utils';

export async function generateDepositPDF(depositData: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const receiptNumber = `DEP-${Date.now().toString().slice(-6)}`;

  // Logo ve Header
  try {
    doc.addImage('/logo.png', 'PNG', 15, 20, 50, 25);
  } catch (error) {
    console.log('Logo yüklenemedi');
  }

  // Company Info (sağ üstte)
  const marginRight = 10;
  doc.setFontSize(12);
  doc.text('United Granite', pageWidth - marginRight, 30, { align: 'right' });
  doc.text('47 Old Camplain Rd', pageWidth - marginRight, 35, { align: 'right' });
  doc.text('Hillsborough, NJ 08844', pageWidth - marginRight, 40, { align: 'right' });
  doc.text('(908) 231-6677', pageWidth - marginRight, 45, { align: 'right' });

  // Title
  doc.setFontSize(20);
  doc.text('DEPOSIT RECEIPT', pageWidth / 2, 80, { align: 'center' });

  // Receipt Details
  doc.setFontSize(12);
  doc.text(`Receipt #: ${receiptNumber}`, 15, 100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 50, 100);

  // İki sütun için x pozisyonları
  const leftColumnX = 15;
  const rightColumnX = pageWidth / 2 + 10;

  // Customer Info (sol) ve Project Details (sağ)
  doc.setFontSize(14);
  doc.text('CUSTOMER INFORMATION', leftColumnX, 120);
  doc.text('PROJECT DETAILS', rightColumnX, 120);
  
  doc.setFontSize(10);
  // Customer Info
  doc.text(`Name: ${depositData.customerInfo?.name || ''}`, leftColumnX, 130);
  doc.text(`Address: ${depositData.customerInfo?.address || ''}`, leftColumnX, 135);
  doc.text(`Phone: ${depositData.customerInfo?.phone || ''}`, leftColumnX, 140);
  doc.text(`Email: ${depositData.customerInfo?.email || ''}`, leftColumnX, 145);

  // Project Details
  doc.text(`Project Type: ${depositData.projectDetails?.projectType || ''}`, rightColumnX, 130);
  doc.text(`Material: ${depositData.projectDetails?.materialType || ''}`, rightColumnX, 135);
  doc.text(`Material Name: ${depositData.projectDetails?.materialName || ''}`, rightColumnX, 140);
  doc.text(`Edge Type: ${depositData.projectDetails?.edgeType || ''}`, rightColumnX, 145);

  // Terms and Conditions (daha yukarıda)
  let yPos = 165;
  doc.setFontSize(10);
  doc.text('Terms and Conditions:', 15, yPos);
  yPos += 5;
  const terms = [
    '1. This deposit is non-refundable.',
    '2. Balance is due upon completion of installation.',
    '3. Project timeline will be determined after template.',
    '4. Any changes after template may affect final price.'
  ];

  terms.forEach((term) => {
    doc.text(term, 15, yPos);
    yPos += 5; // Satır aralığını azalttım
  });

  // Cost Breakdown
  yPos += 10;
  doc.setFontSize(12);
  doc.text('Cost Breakdown:', 15, yPos);

  yPos += 8;
  doc.setFontSize(10);
  doc.text(`Project Total: ${formatCurrency(depositData.projectTotal)}`, 15, yPos);
  yPos += 6;
  doc.text(`Deposit Amount: ${formatCurrency(depositData.depositAmount)}`, 15, yPos);
  yPos += 6;
  doc.text(`Balance Due: ${formatCurrency(depositData.projectTotal - depositData.depositAmount)}`, 15, yPos);
  yPos += 6;
  doc.text(`Payment Method: ${depositData.paymentMethod}`, 15, yPos);

  // Signatures
  yPos = pageHeight - 20;
  doc.line(15, yPos, 95, yPos);
  doc.line(pageWidth - 95, yPos, pageWidth - 15, yPos);

  yPos += 5;
  doc.text('Customer Signature', 15, yPos);
  doc.text('Company Representative', pageWidth - 95, yPos);

  doc.save(`Deposit_Receipt_${receiptNumber}.pdf`);
}