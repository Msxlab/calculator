'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import CustomerInfo from '../../components/calculator/CustomerInfo';
import ProjectDetails from '../../components/calculator/ProjectDetails';
import Measurements from '../../components/calculator/Measurements';
import Extras, { ExtraService } from '../../components/calculator/Extras';
import Summary from '../../components/calculator/Summary';

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
    extras: [] as ExtraService[],
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

          <Tabs defaultValue="info">
            <div className="px-6 pt-4">
              <TabsList>
                <TabsTrigger value="info">Customer Info</TabsTrigger>
                <TabsTrigger value="project">Project Details</TabsTrigger>
                <TabsTrigger value="measure">Measurements</TabsTrigger>
                <TabsTrigger value="extras">Additional Services</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="info">
                <CustomerInfo
                  data={project.customerInfo}
                  onChange={(customerInfo) => setProject({...project, customerInfo})}
                />
              </TabsContent>

              <TabsContent value="project">
                <ProjectDetails
                  data={project.projectDetails}
                  onChange={(projectDetails) => setProject({...project, projectDetails})}
                />
              </TabsContent>

              <TabsContent value="measure">
                <Measurements
                  data={project.measurements}
                  onChange={(measurements) => setProject({...project, measurements})}
                />
              </TabsContent>

              <TabsContent value="extras">
                <Extras
                  data={project.extras}
                  onChange={(extras) => setProject({...project, extras})}
                />
              </TabsContent>

              <TabsContent value="summary">
                <Summary project={project} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}