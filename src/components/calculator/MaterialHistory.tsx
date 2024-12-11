'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/utils';

interface MaterialProject {
  id: string;
  date: string;
  customerName: string;
  sqft: number;
  price: number;
  projectType: string;
  notes?: string;
  status: 'completed' | 'in-progress';
}

interface MaterialHistory {
  materialName: string;
  totalProjects: number;
  averagePrice: number;
  lastProjects: MaterialProject[];
}

export default function MaterialHistory({ materialName }: { materialName: string }) {
  const [history, setHistory] = useState<MaterialHistory | null>(null);
  const [loading, setLoading] = useState(true);

  // Bu fonksiyon normalde API'den veri çekecek
  const fetchMaterialHistory = async () => {
    // Örnek veri
    const demoHistory: MaterialHistory = {
      materialName,
      totalProjects: 15,
      averagePrice: 45.99,
      lastProjects: [
        {
          id: '1',
          date: '2024-03-15',
          customerName: 'John Smith',
          sqft: 45.5,
          price: 44.99,
          projectType: 'Kitchen',
          status: 'completed',
          notes: 'Customer very satisfied with the material'
        },
        {
          id: '2',
          date: '2024-03-10',
          customerName: 'Mary Johnson',
          sqft: 38.2,
          price: 46.99,
          projectType: 'Kitchen',
          status: 'completed'
        },
        {
          id: '3',
          date: '2024-03-05',
          customerName: 'Robert Davis',
          sqft: 52.8,
          price: 45.99,
          projectType: 'Kitchen & Bath',
          status: 'in-progress'
        }
      ]
    };

    setHistory(demoHistory);
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterialHistory();
  }, [materialName]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        Loading material history...
      </div>
    );
  }

  if (!history) {
    return (
      <div className="p-4 text-center text-gray-500">
        No history found for this material
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{history.materialName}</h2>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Total Projects</p>
            <p className="text-2xl font-bold text-blue-900">{history.totalProjects}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Average Price</p>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(history.averagePrice)}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Last 3 Projects</h3>
        <div className="space-y-4">
          {history.lastProjects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{project.customerName}</h4>
                  <p className="text-sm text-gray-600">{project.projectType}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {project.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">{new Date(project.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Square Feet</p>
                  <p className="font-medium">{project.sqft}</p>
                </div>
                <div>
                  <p className="text-gray-600">Price/sqft</p>
                  <p className="font-medium">{formatCurrency(project.price)}</p>
                </div>
              </div>
              {project.notes && (
                <p className="mt-2 text-sm text-gray-600 italic">Note: {project.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Full History →
        </button>
      </div>
    </div>
  );
}