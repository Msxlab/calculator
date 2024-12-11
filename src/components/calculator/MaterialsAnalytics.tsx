'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface AnalyticsData {
  totalProjects: number;
  totalSqft: number;
  averageProjectSize: number;
  satisfaction: number;
  monthlyData: {
    month: string;
    projects: number;
    revenue: number;
  }[];
  popularMaterials: {
    name: string;
    projects: number;
    sqft: number;
    satisfaction: number;
  }[];
}

const DEMO_DATA: AnalyticsData = {
  totalProjects: 35,
  totalSqft: 1870,
  averageProjectSize: 53.4,
  satisfaction: 96,
  monthlyData: [
    { month: 'Jan', projects: 8, revenue: 45000 },
    { month: 'Feb', projects: 12, revenue: 52000 },
    { month: 'Mar', projects: 15, revenue: 63000 }
  ],
  popularMaterials: [
    { name: 'Typhoon Bordeaux', projects: 12, sqft: 540, satisfaction: 98 },
    { name: 'Blue Pearl', projects: 8, sqft: 420, satisfaction: 95 },
    { name: 'Steel Gray', projects: 6, sqft: 380, satisfaction: 92 }
  ]
};

export default function MaterialsAnalytics() {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Total Projects</h3>
          <p className="text-2xl font-bold">{DEMO_DATA.totalProjects}</p>
          <p className="text-sm text-green-600">↑ 15% from last month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Total Square Feet</h3>
          <p className="text-2xl font-bold">{DEMO_DATA.totalSqft}</p>
          <p className="text-sm text-green-600">↑ 8% from last month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Avg. Project Size</h3>
          <p className="text-2xl font-bold">{DEMO_DATA.averageProjectSize} sqft</p>
          <p className="text-sm text-blue-600">− Stable</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Customer Satisfaction</h3>
          <p className="text-2xl font-bold">{DEMO_DATA.satisfaction}%</p>
          <p className="text-sm text-green-600">↑ 2% from last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Monthly Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEMO_DATA.monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="projects" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Materials */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Popular Materials</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_DATA.popularMaterials}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="projects" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Materials Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Top Materials Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Sqft
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satisfaction
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {DEMO_DATA.popularMaterials.map((material) => (
                <tr key={material.name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {material.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {material.projects}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {material.sqft}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      material.satisfaction >= 95 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {material.satisfaction}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}