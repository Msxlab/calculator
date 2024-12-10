'use client';

import React from 'react';
import { formatCurrency } from '../../utils/utils';
export interface ExtraService {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  data: ExtraService[];
  onChange: (data: ExtraService[]) => void;
}

const defaultServices: ExtraService[] = [
  { id: 'install', name: 'Installation & Template', price: 0, quantity: 1 },
  { id: 'faucetHole', name: 'Faucet Hole', price: 45, quantity: 0 },
  { id: 'sinkCutout', name: 'Sink Cut-out', price: 350, quantity: 0 },
  { id: 'cooktopCutout', name: 'Cooktop Cut-out', price: 150, quantity: 0 },
  { id: 'edging', name: 'Edging (per linear ft)', price: 15, quantity: 0 },
  { id: 'sealer', name: 'Sealer', price: 75, quantity: 0 },
  { id: 'plumbing', name: 'Plumbing Disconnect/Reconnect', price: 250, quantity: 0 },
];

export default function Extras({ data, onChange }: Props) {
  // Initialize extras if empty
  React.useEffect(() => {
    if (data.length === 0) {
      onChange(defaultServices);
    }
  }, []);

  const handleChange = (id: string, field: 'price' | 'quantity', value: number) => {
    const newData = data.map(service => {
      if (service.id === id) {
        return { ...service, [field]: value };
      }
      return service;
    });
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Additional Services</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          Enter price and quantity for additional services. Installation & Template prices can be adjusted based on project requirements.
        </p>
      </div>
      <div className="grid gap-4">
        {data.map(service => (
          <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
            <div className="flex-1">
              <span className="font-medium text-gray-900">{service.name}</span>
            </div>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm text-gray-600">Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={service.price}
                  onChange={(e) => handleChange(service.id, 'price', parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={service.quantity}
                  onChange={(e) => handleChange(service.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Total</label>
                <div className="w-24 px-2 py-1 bg-gray-50 border rounded text-right font-medium">
                  {formatCurrency(service.price * service.quantity)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <div className="bg-gray-50 px-4 py-2 rounded-lg">
          <span className="text-sm text-gray-600">Total Additional Services: </span>
          <span className="font-bold ml-2">
            {formatCurrency(data.reduce((sum, service) => sum + (service.price * service.quantity), 0))}
          </span>
        </div>
      </div>
    </div>
  );
}