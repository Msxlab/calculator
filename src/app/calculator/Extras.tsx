'use client';

import React from 'react';

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

export default function Extras({ data, onChange }: Props) {
  const defaultServices: ExtraService[] = [
    { id: 'install', name: 'Installation', price: 0, quantity: 1 },
    { id: 'template', name: 'Template', price: 0, quantity: 1 },
    { id: 'faucetHole', name: 'Faucet Hole', price: 45, quantity: 0 },
    { id: 'sinkCutout', name: 'Sink Cut-out', price: 350, quantity: 0 },
    { id: 'stoveCutout', name: 'Stove Cut-out', price: 150, quantity: 0 },
    { id: 'edging', name: 'Edging (per linear ft)', price: 15, quantity: 0 },
  ];

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
      <div className="grid gap-4">
        {defaultServices.map(service => {
          const currentService = data.find(s => s.id === service.id) || service;
          return (
            <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
              <span className="font-medium">{service.name}</span>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-sm text-gray-600">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={currentService.price}
                    onChange={(e) => handleChange(service.id, 'price', parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={currentService.quantity}
                    onChange={(e) => handleChange(service.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Total</label>
                  <div className="w-24 px-2 py-1 border rounded bg-gray-100">
                    ${(currentService.price * currentService.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}