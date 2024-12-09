import React from 'react';
import type { ProjectDetails as ProjectDetailsType } from '@/types';

interface Props {
  data: ProjectDetailsType;
  onChange: (data: ProjectDetailsType) => void;
}

export default function ProjectDetails({ data, onChange }: Props) {
  const handleChange = (field: keyof ProjectDetailsType) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onChange({
      ...data,
      [field]: e.target.value,
    });
  };

  return (
    <div className="space-y-6 bg-gray-800 text-white p-6 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500"
            value={data.projectType}
            onChange={handleChange('projectType')}
          >
            <option value="Kitchen">Kitchen</option>
            <option value="Bathroom">Bathroom</option>
            <option value="Fireplace">Bathroom</option>
            <option value="Vanity">Bathroom</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Material Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500"
            value={data.materialType}
            onChange={handleChange('materialType')}
          >
            <option value="Granite">Granite</option>
            <option value="Marble">Marble</option>
            <option value="Quartz">Quartz</option>
            <option value="Quartzite">Quartz</option>
            <option value="Onyx">Quartz</option>
            <option value="Dolamite">Quartz</option>



          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Material Name</label>
          <select
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500"
            value={data.materialName}
            onChange={handleChange('materialName')}
          >
            <option value="ALL GROUPS A">ALL GROUPS A</option>
            <option value="ALL GROUPS B">ALL GROUPS B</option>
            <option value="ALL GROUPS C">ALL GROUPS C</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Edge Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500"
            value={data.edgeType}
            onChange={handleChange('edgeType')}
          >
            <option value="Eased">Standard</option>
            <option value="Bullnose">Bullnose</option>
            <option value="Bevel">Bevel</option>
            <option value="Ogee">Ogee</option>
            <option value="Double Ogee">Ogee</option>

          </select>
        </div>
      </div>
    </div>
  );
}
