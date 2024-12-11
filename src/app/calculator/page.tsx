'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerInfo from '@/components/calculator/CustomerInfo';
import ProjectDetails from '@/components/calculator/ProjectDetails';
import Measurements from '@/components/calculator/Measurements';
import Extras from '@/components/calculator/Extras';
import Summary from '@/components/calculator/Summary';
import ProjectTimeline from '@/components/calculator/ProjectTimeline';
import Invoice from '@/components/calculator/Invoice';
import Deposit from '@/components/calculator/Deposit';
import MaterialQuickView from '@/components/calculator/MaterialQuickView';
import MaterialsAnalytics from '@/components/calculator/MaterialsAnalytics';

export default function Calculator() {
  const [project, setProject] = useState({
    customerInfo: {
      name: '',
      address: '',
      phone: '',
      email: '',
    },
    projectDetails: {
      projectType: 'Kitchen',
      materialType: 'Granite',
      materialName: 'ALL GROUPS A',
      edgeType: 'Standard',
    },
    measurements: {
      tops: Array(5).fill({ length: 0, width: 0, sqft: 0 }),
      backsplashes: Array(5).fill({ length: 0, width: 0, sqft: 0 }),
      edges: Array(5).fill({ length: 0, width: 0, sqft: 0 }),
    },
    extras: [] as any[],
    totalPrice: 0,
    status: 'draft' as const,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Countertop Calculator</h1>
          </div>

          <Tabs defaultValue="info" className="p-6">
            <TabsList className="mb-6">
              <TabsTrigger value="info">Customer Info</TabsTrigger>
              <TabsTrigger value="project">Project Details</TabsTrigger>
              <TabsTrigger value="measure">Measurements</TabsTrigger>
              <TabsTrigger value="extras">Additional Services</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="invoice">Invoice</TabsTrigger>
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <CustomerInfo
                data={project.customerInfo}
                onChange={customerInfo => setProject({...project, customerInfo})}
              />
            </TabsContent>

            <TabsContent value="project">
              <ProjectDetails
                data={project.projectDetails}
                onChange={projectDetails => setProject({...project, projectDetails})}
              />
            </TabsContent>

            <TabsContent value="measure">
              <Measurements
                data={project.measurements}
                onChange={measurements => setProject({...project, measurements})}
              />
            </TabsContent>

            <TabsContent value="extras">
              <Extras
                data={project.extras}
                onChange={extras => setProject({...project, extras})}
              />
            </TabsContent>

            <TabsContent value="materials">
              <div className="space-y-8">
                <MaterialQuickView />
                <MaterialsAnalytics />
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <ProjectTimeline projectId={project.id || ''} />
            </TabsContent>

            <TabsContent value="invoice">
              <Invoice data={project} />
            </TabsContent>

            <TabsContent value="deposit">
              <Deposit data={project} />
            </TabsContent>

            <TabsContent value="summary">
              <Summary project={project} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}