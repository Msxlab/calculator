import React, { useState } from 'react';
import { formatCurrency } from '@/utils/calculations';

interface ReportData {
  startDate: string;
  endDate: string;
  projects: any[];
  totalRevenue: number;
  totalProjects: number;
  averageProjectValue: number;
  popularMaterials: { [key: string]: number };
}

export default function ReportGenerator() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dateRange),
      });
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="px-3 py-2 border rounded-md"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            className="px-3 py-2 border rounded-md"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={generateReport}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {reportData && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
              <p className="text-2xl font-bold">
                {formatCurrency(reportData.totalRevenue)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Total Projects</h3>
              <p className="text-2xl font-bold">{reportData.totalProjects}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Average Project Value</h3>
              <p className="text-2xl font-bold">
                {formatCurrency(reportData.averageProjectValue)}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Popular Materials</h3>
            <div className="space-y-2">
              {Object.entries(reportData.popularMaterials).map(([material, count]) => (
                <div key={material} className="flex justify-between">
                  <span>{material}</span>
                  <span>{count} projects</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Recent Projects</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Material</th>
                  <th className="text-right py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {reportData.projects.map((project) => (
                  <tr key={project.id}>
                    <td className="py-2">{project.customerInfo.name}</td>
                    <td>{project.projectDetails.projectType}</td>
                    <td>{project.projectDetails.materialType}</td>
                    <td className="text-right">
                      {formatCurrency(project.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}