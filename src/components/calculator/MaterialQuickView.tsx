'use client';

import React, { useState } from 'react';

interface Material {
  id: string;
  name: string;
  category: string;
  price: number;
  priceHistory: number[];
  stock: 'In Stock' | 'Low Stock' | 'Out of Stock';
  recentProjects: number;
  lastProject?: {
    customer: string;
    date: string;
    sqft: number;
  };
}

const DEMO_MATERIALS: Material[] = [
  {
    id: '1',
    name: 'Typhoon Bordeaux',
    category: 'Granite',
    price: 45.99,
    priceHistory: [43.99, 44.99, 45.99],
    stock: 'In Stock',
    recentProjects: 3,
    lastProject: {
      customer: 'John Smith',
      date: '2024-03-15',
      sqft: 45.5
    }
  },
  {
    id: '2',
    name: 'Blue Pearl',
    category: 'Granite',
    price: 42.99,
    priceHistory: [43.99, 43.99, 42.99],
    stock: 'Low Stock',
    recentProjects: 5,
    lastProject: {
      customer: 'Mary Johnson',
      date: '2024-03-20',
      sqft: 38.2
    }
  },
  // Daha fazla örnek materyal eklenebilir
];

export default function MaterialQuickView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [materials] = useState<Material[]>(DEMO_MATERIALS);

  const filteredMaterials = materials.filter(material => 
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || material.category.toLowerCase() === selectedCategory)
  );

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Materials</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search materials..."
            className="px-4 py-2 border rounded-lg w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="granite">Granite</option>
            <option value="marble">Marble</option>
            <option value="quartz">Quartz</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMaterials.map(material => (
          <div key={material.id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{material.name}</h3>
                <p className="text-gray-600">{material.category}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                material.stock === 'In Stock' ? 'bg-green-100 text-green-800' :
                material.stock === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {material.stock}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Price</p>
                  <p className="font-bold text-lg">{formatPrice(material.price)}/sqft</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Price Trend</p>
                  <p className={`font-medium ${
                    material.priceHistory[2] > material.priceHistory[1] 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {material.priceHistory[2] > material.priceHistory[1] ? '↑' : '↓'} 
                    {Math.abs(material.priceHistory[2] - material.priceHistory[1]).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  Recent Projects: {material.recentProjects} in last 30 days
                </p>
                {material.lastProject && (
                  <div className="mt-2 bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium">Last Project</p>
                    <p className="text-sm text-gray-600">
                      {material.lastProject.customer} - {material.lastProject.sqft} sqft
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(material.lastProject.date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                View History
              </button>
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                Update Price
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}