'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/utils';

interface Material {
  id: string;
  name: string;
  category: string;
  price: number;
  lastProjects: Project[];
  inStock: boolean;
  notes: string;
}

interface Project {
  customerName: string;
  date: string;
  sqft: number;
  price: number;
}

export default function MaterialsManagement() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Materyal detaylarını göster
  const MaterialDetails = ({ material }: { material: Material }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold">{material.name}</h3>
          <p className="text-gray-600">{material.category}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">{formatCurrency(material.price)}/sqft</p>
          <span className={`px-2 py-1 rounded text-sm ${material.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {material.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Son Projeler */}
      <div className="mb-6">
        <h4 className="text-lg font-bold mb-3">Recent Projects</h4>
        <div className="grid gap-4">
          {material.lastProjects.map((project, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{project.customerName}</span>
                <span>{project.date}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{project.sqft} sqft</span>
                <span>{formatCurrency(project.price)}/sqft</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-bold mb-2">Notes</h4>
        <p className="text-gray-600">{material.notes}</p>
      </div>
    </div>
  );

  // Yeni materyal ekleme formu
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    category: '',
    price: 0,
    inStock: true,
    notes: ''
  });

  const handleAddMaterial = () => {
    const material = {
      ...newMaterial,
      id: Date.now().toString(),
      lastProjects: []
    };
    setMaterials([...materials, material]);
    setNewMaterial({
      name: '',
      category: '',
      price: 0,
      inStock: true,
      notes: ''
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Materyal Listesi */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Materials Inventory</h2>
        <div className="space-y-4">
          {materials.map(material => (
            <div
              key={material.id}
              className="border p-4 rounded cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedMaterial(material)}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{material.name}</h3>
                  <p className="text-sm text-gray-600">{material.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(material.price)}/sqft</p>
                  <span className={`text-sm ${material.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {material.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Yeni Materyal Ekleme */}
        <div className="mt-6 border-t pt-6">
          <h3 className="font-bold mb-4">Add New Material</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={newMaterial.name}
                onChange={e => setNewMaterial({...newMaterial, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={newMaterial.category}
                onChange={e => setNewMaterial({...newMaterial, category: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price per sqft</label>
              <input
                type="number"
                className="w-full border rounded p-2"
                value={newMaterial.price}
                onChange={e => setNewMaterial({...newMaterial, price: parseFloat(e.target.value)})}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={newMaterial.inStock}
                onChange={e => setNewMaterial({...newMaterial, inStock: e.target.checked})}
              />
              <label className="text-sm font-medium">In Stock</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                className="w-full border rounded p-2"
                value={newMaterial.notes}
                onChange={e => setNewMaterial({...newMaterial, notes: e.target.value})}
              />
            </div>
            <button
              onClick={handleAddMaterial}
              className="w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600"
            >
              Add Material
            </button>
          </div>
        </div>
      </div>

      {/* Materyal Detayları */}
      <div>
        {selectedMaterial ? (
          <MaterialDetails material={selectedMaterial} />
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
            Select a material to view details
          </div>
          
          
        )}
        
      </div>
      
    </div>
  );
}