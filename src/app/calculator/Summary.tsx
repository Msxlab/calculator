'use client';

import React from 'react';
import { calculatePrice, calculateSqft, formatCurrency } from '../../utils/utils';
import { generatePDF } from '@/utils/pdfGenerator';

interface Props {
  project: any; // Daha sonra proper type tanımlaması yapılacak
}

export default function Summary({ project }: Props) {
  const calculateTotalSqft = () => {
    const topsSqft = project.measurements.tops.reduce((sum: number, m: any) => 
      sum + (m.sqft || 0), 0);
    const backsplashesSqft = project.measurements.backsplashes.reduce((sum: number, m: any) => 
      sum + (m.sqft || 0), 0);
    return Number((topsSqft + backsplashesSqft).toFixed(2));
  };

  const calculateMaterialPrice = () => {
    const basePricePerSqft = 40; // Bu fiyatı daha sonra material type'a göre değiştirebiliriz
    return calculatePrice(calculateTotalSqft(), basePricePerSqft);
  };

  const calculateExtrasTotal = () => {
    return project.extras.reduce((sum: number, extra: any) => 
      sum + (extra.price * extra.quantity), 0);
  };

  const calculateGrandTotal = () => {
    return calculateMaterialPrice() + calculateExtrasTotal();
  };

  return (
    <div className="space-y-8">
      {/* Müşteri Bilgileri */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {project.customerInfo.name}</p>
            <p><span className="font-medium">Address:</span> {project.customerInfo.address}</p>
            <p><span className="font-medium">Phone:</span> {project.customerInfo.phone}</p>
            <p><span className="font-medium">Email:</span> {project.customerInfo.email}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Project Details</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Project Type:</span> {project.projectDetails.projectType}</p>
            <p><span className="font-medium">Material:</span> {project.projectDetails.materialType}</p>
            <p><span className="font-medium">Material Name:</span> {project.projectDetails.materialName}</p>
            <p><span className="font-medium">Edge Type:</span> {project.projectDetails.edgeType}</p>
          </div>
        </div>
      </div>

      {/* Ölçümler */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Measurements</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tops */}
          <div>
            <h4 className="font-medium mb-2">Tops</h4>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-1 text-left text-sm">Length</th>
                  <th className="px-2 py-1 text-left text-sm">Width</th>
                  <th className="px-2 py-1 text-left text-sm">Sqft</th>
                </tr>
              </thead>
              <tbody>
                {project.measurements.tops.map((item: any, index: number) => (
                  item.length > 0 || item.width > 0 ? (
                    <tr key={index}>
                      <td className="px-2 py-1">{item.length}"</td>
                      <td className="px-2 py-1">{item.width}"</td>
                      <td className="px-2 py-1">{item.sqft?.toFixed(2)}</td>
                    </tr>
                  ) : null
                ))}
              </tbody>
            </table>
          </div>

          {/* Backsplashes */}
          <div>
            <h4 className="font-medium mb-2">Backsplashes</h4>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-1 text-left text-sm">Length</th>
                  <th className="px-2 py-1 text-left text-sm">Width</th>
                  <th className="px-2 py-1 text-left text-sm">Sqft</th>
                </tr>
              </thead>
              <tbody>
                {project.measurements.backsplashes.map((item: any, index: number) => (
                  item.length > 0 || item.width > 0 ? (
                    <tr key={index}>
                      <td className="px-2 py-1">{item.length}"</td>
                      <td className="px-2 py-1">{item.width}"</td>
                      <td className="px-2 py-1">{item.sqft?.toFixed(2)}</td>
                    </tr>
                  ) : null
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 text-right">
          <p className="font-medium">Total Square Feet: {calculateTotalSqft()}</p>
        </div>
      </div>

      {/* Ekstra Hizmetler */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Services</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Service</th>
              <th className="px-4 py-2 text-right">Quantity</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {project.extras.map((extra: any) => (
              extra.quantity > 0 && (
                <tr key={extra.id}>
                  <td className="px-4 py-2">{extra.name}</td>
                  <td className="px-4 py-2 text-right">{extra.quantity}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(extra.price)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(extra.price * extra.quantity)}</td>
                </tr>
              )
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={3} className="px-4 py-2 font-medium text-right">Additional Services Total:</td>
              <td className="px-4 py-2 font-medium text-right">{formatCurrency(calculateExtrasTotal())}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Toplam */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Material Cost ({calculateTotalSqft()} sqft)</span>
            <span>{formatCurrency(calculateMaterialPrice())}</span>
          </div>
          <div className="flex justify-between">
            <span>Additional Services</span>
            <span>{formatCurrency(calculateExtrasTotal())}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(calculateGrandTotal())}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aksiyonlar */}
      <div className="flex justify-end space-x-4">
        <button 
          onClick={() => generatePDF(project)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
}