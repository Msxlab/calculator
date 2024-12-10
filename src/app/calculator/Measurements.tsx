'use client';

import React from 'react';

interface Measurement {
  length: number;
  width: number;
  sqft: number;
}

interface Props {
  data: {
    tops: Measurement[];
    backsplashes: Measurement[];
    edges: Measurement[];
  };
  onChange: (data: Props['data']) => void;
}

export default function Measurements({ data, onChange }: Props) {
  const calculateSqft = (length: number, width: number) => {
    if (!length || !width) return 0;
    const sqft = (length * width) / 144; // Convert to square feet (12 x 12 inches)
    return Number(sqft.toFixed(2));
  };

  const handleInputChange = (
    type: keyof Props['data'],
    index: number,
    field: 'length' | 'width',
    inputValue: string
  ) => {
    // Remove non-numeric characters
    const value = inputValue.replace(/[^\d.]/g, '');
    const numericValue = value ? parseFloat(value) : 0;

    const newData = { ...data };
    const measurements = [...newData[type]];
    
    measurements[index] = {
      ...measurements[index],
      [field]: numericValue,
      sqft: calculateSqft(
        field === 'length' ? numericValue : measurements[index].length,
        field === 'width' ? numericValue : measurements[index].width
      )
    };

    newData[type] = measurements;
    onChange(newData);
  };

  const MeasurementTable = ({ type, items }: { type: keyof Props['data']; items: Measurement[] }) => (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4">{type.toUpperCase()}</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2">Length (inches)</th>
            <th className="text-left py-2">Width (inches)</th>
            <th className="text-left py-2">Sqft</th>
          </tr>
        </thead>
        <tbody>
          {items.map((measurement, index) => (
            <tr key={index}>
              <td className="p-1">
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-24 px-2 py-1 border rounded"
                  value={measurement.length || ''}
                  onChange={(e) => handleInputChange(type, index, 'length', e.target.value)}
                  placeholder="0"
                />
              </td>
              <td className="p-1">
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-24 px-2 py-1 border rounded"
                  value={measurement.width || ''}
                  onChange={(e) => handleInputChange(type, index, 'width', e.target.value)}
                  placeholder="0"
                />
              </td>
              <td className="p-1">
                <input
                  type="text"
                  className="w-24 px-2 py-1 border rounded bg-gray-100"
                  value={measurement.sqft.toFixed(2)}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MeasurementTable type="tops" items={data.tops} />
        <MeasurementTable type="backsplashes" items={data.backsplashes} />
      </div>
      <div>
        <MeasurementTable type="edges" items={data.edges} />
      </div>
    </div>
  );
}