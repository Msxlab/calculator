import React from 'react';
import { generatePDF } from '@/utils/pdfGenerator'; // PDF oluşturma fonksiyonunu import ediyoruz

interface Props {
  project: any;
}

export default function Summary({ project }: Props) {
  // PDF oluşturma fonksiyonu
  const handleGeneratePDF = () => {
    const pdfData = {
      customerInfo: project.customerInfo,
      measurements: project.measurements,
      extras: project.extras,
      totalPrice: calculateTotal() // calculateTotal fonksiyonunuz
    };
    
    generatePDF(pdfData);
  };

  // Diğer fonksiyonlarınız...
  const calculateTotal = () => {
    // Mevcut hesaplama fonksiyonunuz...
  };

  return (
    <div className="space-y-6">
      {/* Mevcut JSX içeriğiniz... */}
      
      {/* PDF butonu */}
      <div className="mt-6 flex justify-end space-x-4">
        <button 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => console.log('Save Quote')}
        >
          Save Quote
        </button>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleGeneratePDF} // PDF oluşturma fonksiyonunu buraya bağlıyoruz
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
}