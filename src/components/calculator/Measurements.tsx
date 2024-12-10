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
  const handleChange = (
    type: keyof Props['data'],
    index: number,
    field: 'length' | 'width',
    value: string
  ) => {
    const newData = { ...data };
    const measurements = [...newData[type]];
    const numValue = value ? Number(value) : 0;

    measurements[index] = {
      ...measurements[index],
      [field]: numValue,
      sqft: ((field === 'length' ? numValue : measurements[index].length) * 
             (field === 'width' ? numValue : measurements[index].width)) / 144
    };

    newData[type] = measurements;
    onChange(newData);
  };

  const renderTable = (type: keyof Props['data'], measurements: Measurement[]) => (
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
          {measurements.map((measurement, index) => (
            <tr key={index}>
              <td className="p-1">
                <input
                  type="text"
                  className="w-24 px-2 py-1 border rounded"
                  value={measurement.length || ''}
                  onChange={(e) => handleChange(type, index, 'length', e.target.value)}
                />
              </td>
              <td className="p-1">
                <input
                  type="text"
                  className="w-24 px-2 py-1 border rounded"
                  value={measurement.width || ''}
                  onChange={(e) => handleChange(type, index, 'width', e.target.value)}
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
        {renderTable('tops', data.tops)}
        {renderTable('backsplashes', data.backsplashes)}
      </div>
      <div>
        {renderTable('edges', data.edges)}
      </div>
    </div>
  );
}