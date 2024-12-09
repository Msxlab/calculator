import React from 'react';
import type { Measurement } from '@/types';

interface Props {
  data: {
    tops: Measurement[];
    backsplashes: Measurement[];
    edges: Measurement[];
  };
  onChange: (data: Props['data']) => void;
}

export default function Measurements({ data, onChange }: Props) {
  const handleMeasurementChange = (
    type: keyof Props['data'],
    index: number,
    field: keyof Measurement,
    value: number
  ) => {
    const newData = { ...data };
    const measurements = [...newData[type]];
    measurements[index] = {
      ...measurements[index],
      [field]: value,
    };

    // Calculate sqft if both length and width are set
    if (field === 'length' || field === 'width') {
      const measurement = measurements[index];
      const length = field === 'length' ? value : measurement.length;
      const width = field === 'width' ? value : measurement.width;
      measurements[index].sqft = length * width;
    }

    onChange({
      ...newData,
      [type]: measurements,
    });
  };

  const MeasurementTable = ({
    type,
    measurements,
  }: {
    type: keyof Props['data'];
    measurements: Measurement[];
  }) => (
    <div className="border border-gray-600 rounded-lg p-4 bg-gray-800 text-white">
      <h3 className="text-lg font-bold mb-4 text-blue-400">
        {type.toUpperCase()}
      </h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="text-left py-2">Length</th>
            <th className="text-left py-2">Width</th>
            <th className="text-left py-2">Sqft</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement, index) => (
            <tr key={index} className="hover:bg-gray-700">
              <td className="p-1">
                <input
                  type="number"
                  className="w-20 px-2 py-1 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
                  value={measurement.length || ''}
                  onChange={(e) =>
                    handleMeasurementChange(
                      type,
                      index,
                      'length',
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </td>
              <td className="p-1">
                <input
                  type="number"
                  className="w-20 px-2 py-1 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
                  value={measurement.width || ''}
                  onChange={(e) =>
                    handleMeasurementChange(
                      type,
                      index,
                      'width',
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </td>
              <td className="p-1">
                <input
                  type="number"
                  className="w-20 px-2 py-1 border border-gray-600 rounded bg-gray-900 text-white"
                  value={measurement.sqft?.toFixed(2) || ''}
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
    <div className="space-y-6 bg-gray-900 p-6 rounded-lg">
      <div className="grid grid-cols-2 gap-6">
        <MeasurementTable type="tops" measurements={data.tops} />
        <MeasurementTable type="backsplashes" measurements={data.backsplashes} />
      </div>
      <div className="mt-6">
        <MeasurementTable type="edges" measurements={data.edges} />
      </div>
    </div>
  );
}
