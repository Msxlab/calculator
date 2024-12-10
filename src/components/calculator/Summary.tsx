'use client';

import React, { useState } from 'react';
import { calculatePrice, calculateSqft, formatCurrency } from '../../utils/utils';
import { generatePDF } from '../../utils/pdfGenerator';

interface Props {
  project: any;
}

export default function Summary({ project }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Hesaplama fonksiyonları
  const calculateTotalSqft = () => {
    const topsSqft = project.measurements.tops.reduce((sum: number, m: any) => 
      sum + (m.sqft || 0), 0);
    const backsplashesSqft = project.measurements.backsplashes.reduce((sum: number, m: any) => 
      sum + (m.sqft || 0), 0);
    return Number((topsSqft + backsplashesSqft).toFixed(2));
  };

  const calculateMaterialPrice = () => {
    return calculatePrice(calculateTotalSqft(), 40); // $40 per sqft
  };

  const calculateExtrasTotal = () => {
    return project.extras.reduce((sum: number, extra: any) => 
      sum + (extra.price * extra.quantity), 0);
  };

  const calculateGrandTotal = () => {
    return calculateMaterialPrice() + calculateExtrasTotal();
  };

  // Quote kaydetme fonksiyonu
  const handleSaveQuote = async () => {
    try {
      setLoading(true);
      setError(null);

      const quoteData = {
        customerInfo: project.customerInfo,
        projectDetails: project.projectDetails,
        measurements: project.measurements,
        extras: project.extras,
        totalPrice: calculateGrandTotal()
      };

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });

      if (!response.ok) {
        throw new Error('Failed to save quote');
      }

      setSuccess('Quote saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save quote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Müşteri Bilgileri */}
      <div className="space-y-6 bg-gray-800 text-white p-6 rounded-lg">
      <div className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500">
      <h3 className="text-lg font-bold text-white mb-4">Customer Information</h3>
      <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {project.customerInfo.name}</p>
            <p><span className="font-medium">Address:</span> {project.customerInfo.address}</p>
            <p><span className="font-medium">Phone:</span> {project.customerInfo.phone}</p>
            <p><span className="font-medium">Email:</span> {project.customerInfo.email}</p>
          </div>
        </div>

        <div             className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500"
        >
<h3 className="text-lg font-bold text-white mb-4">Project Details</h3>
<div className="space-y-2">
            <p><span className="font-medium">Project Type:</span> {project.projectDetails.projectType}</p>
            <p><span className="font-medium">Material:</span> {project.projectDetails.materialType}</p>
            <p><span className="font-medium">Material Name:</span> {project.projectDetails.materialName}</p>
            <p><span className="font-medium">Edge Type:</span> {project.projectDetails.edgeType}</p>
          </div>
        </div>
      </div>

      {/* Measurements Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Measurements</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tops */}
          <div>
            <h4 className="font-medium mb-2">Tops</h4>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2">Length</th>
                  <th className="text-left p-2">Width</th>
                  <th className="text-left p-2">Sqft</th>
                </tr>
              </thead>
              <tbody>
                {project.measurements.tops.map((item: any, index: number) => (
                  item.length > 0 || item.width > 0 ? (
                    <tr key={index}>
                      <td className="p-2">{item.length}"</td>
                      <td className="p-2">{item.width}"</td>
                      <td className="p-2">{item.sqft.toFixed(2)}</td>
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
                  <th className="text-left p-2">Length</th>
                  <th className="text-left p-2">Width</th>
                  <th className="text-left p-2">Sqft</th>
                </tr>
              </thead>
              <tbody>
                {project.measurements.backsplashes.map((item: any, index: number) => (
                  item.length > 0 || item.width > 0 ? (
                    <tr key={index}>
                      <td className="p-2">{item.length}"</td>
                      <td className="p-2">{item.width}"</td>
                      <td className="p-2">{item.sqft.toFixed(2)}</td>
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

      {/* Extras */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Services</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Service</th>
              <th className="text-right p-2">Quantity</th>
              <th className="text-right p-2">Price</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {project.extras.map((extra: any) => (
              extra.quantity > 0 && (
                <tr key={extra.id}>
                  <td className="p-2">{extra.name}</td>
                  <td className="p-2 text-right">{extra.quantity}</td>
                  <td className="p-2 text-right">{formatCurrency(extra.price)}</td>
                  <td className="p-2 text-right">{formatCurrency(extra.price * extra.quantity)}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
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

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => generatePDF(project)}
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate PDF'}
        </button>
        <button
          onClick={handleSaveQuote}
          disabled={loading}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Quote'}
        </button>
      </div>
    </div>
  );
}