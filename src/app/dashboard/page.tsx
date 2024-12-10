'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/types';
import { formatCurrency } from '@/utils/utils';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchProjects();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => router.push('/calculator')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          New Quote
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4 bg-white shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold">{project.customerInfo.name}</h3>
                <p className="text-sm text-gray-600">
                  {project.projectDetails.projectType} - {project.projectDetails.materialType}
                </p>
                {project.quoteNumber && (
                  <p className="text-xs text-gray-500">Quote #{project.quoteNumber}</p>
                )}
              </div>
              <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                {project.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Price:</span>
                <span className="font-medium">{formatCurrency(project.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Created:</span>
                <span>{new Date(project.createdAt!).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => router.push(`/projects/${project.id}`)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                View Details
              </button>
              <button
                onClick={() => router.push(`/projects/${project.id}/edit`)}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => generatePDF(project)}
                className="px-3 py-1 text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded"
              >
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}