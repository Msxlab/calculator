import React from 'react';
import type { CustomerInfo as CustomerInfoType } from '@/types';

interface Props {
  data: CustomerInfoType;
  onChange: (data: CustomerInfoType) => void;
}

export default function CustomerInfo({ data, onChange }: Props) {
  const handleChange = (field: keyof CustomerInfoType) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...data,
      [field]: e.target.value,
    });
  };

  return (
    <div className="space-y-6 bg-gray-800 text-white p-6 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500"
            value={data.name}
            onChange={handleChange('name')}
            placeholder="Customer name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Address</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500"
            value={data.address}
            onChange={handleChange('address')}
            placeholder="Customer address"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500"
            value={data.phone}
            onChange={handleChange('phone')}
            placeholder="Phone number"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500"
            value={data.email}
            onChange={handleChange('email')}
            placeholder="Email address"
          />
        </div>
      </div>
    </div>
  );
}