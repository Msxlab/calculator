'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { formatCurrency } from '../../utils/utils';
import { generateDepositPDF } from '../../utils/depositGenerator';

interface Props {
  data: {
    customerInfo: {
      name: string;
      address: string;
      phone: string;
      email: string;
    };
    projectDetails: {
      projectType: string;
      materialType: string;
      materialName: string;
      edgeType: string;
    };
    measurements: {
      tops: Array<{
        length: number;
        width: number;
        sqft: number;
      }>;
      backsplashes: Array<{
        length: number;
        width: number;
        sqft: number;
      }>;
    };
    extras: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

export default function Deposit({ data }: Props) {
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [projectTotal, setProjectTotal] = useState(0);

  // Debug için veriyi loglayalım
  console.log('Received data:', data);

  const handlePrintDeposit = async () => {
    setLoading(true);
    try {
      // Veriyi oluşturmadan önce kontrol edelim
      if (!data || !data.projectDetails) {
        throw new Error('Project details are missing');
      }

      console.log('Sending data to PDF generator:', {
        customerInfo: data.customerInfo,
        projectDetails: data.projectDetails,
        measurements: data.measurements,
        extras: data.extras,
        projectTotal,
        depositAmount,
        paymentMethod
      });

      await generateDepositPDF({
        customerInfo: data.customerInfo,
        projectDetails: data.projectDetails,
        measurements: data.measurements,
        extras: data.extras,
        projectTotal,
        depositAmount,
        paymentMethod
      });
    } catch (error) {
      console.error('Error generating deposit receipt:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Mevcut Proje Bilgileri Gösterimi */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold mb-4">Current Project Details</h3>
        <div className="space-y-2">
          <p><strong>Customer:</strong> {data?.customerInfo?.name}</p>
          <p><strong>Project Type:</strong> {data?.projectDetails?.projectType}</p>
          <p><strong>Material:</strong> {data?.projectDetails?.materialType}</p>
          <p><strong>Material Name:</strong> {data?.projectDetails?.materialName}</p>
        </div>
      </div>

      {/* Project Total Input */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold mb-4">Project Total</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Project Total Amount</label>
          <input
            type="number"
            value={projectTotal}
            onChange={(e) => setProjectTotal(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter project total amount"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Deposit Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold mb-4">Deposit Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Deposit Amount</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter deposit amount"
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handlePrintDeposit}
          disabled={loading || depositAmount <= 0 || projectTotal <= 0}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Deposit Receipt PDF'}
        </button>
      </div>
    </div>
  );
}