'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { formatCurrency } from '../../utils/utils';
import { generateInvoicePDF } from '../../utils/invoiceGenerator';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface Props {
  data: any;
}

export default function Invoice({ data }: Props) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    price: 0
  });

  // Yeni ürün ekleme
  const addItem = () => {
    if (newItem.description && newItem.price > 0) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          ...newItem
        }
      ]);
      setNewItem({
        description: '',
        quantity: 1,
        price: 0
      });
    }
  };

  // Ürün silme
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Toplam hesaplama
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handlePrintInvoice = async () => {
    setLoading(true);
    try {
      await generateInvoicePDF({
        customerInfo: data.customerInfo,
        items: items
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* ... mevcut header içeriği ... */}

      {/* Manuel Ürün Ekleme */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold mb-4">Add Invoice Items</h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Item description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
              className="w-full px-3 py-2 border rounded-md"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        <button
          onClick={addItem}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Item
        </button>
      </div>

      {/* Ürün Listesi */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold mb-4">Invoice Items</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Quantity</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
              <th className="text-right py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.description}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">{formatCurrency(item.price)}</td>
                <td className="text-right">{formatCurrency(item.quantity * item.price)}</td>
                <td className="text-right">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right font-bold py-2">Total:</td>
              <td className="text-right font-bold">{formatCurrency(calculateTotal())}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handlePrintInvoice}
          disabled={loading || items.length === 0}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Invoice PDF'}
        </button>
      </div>
    </div>
  );
}