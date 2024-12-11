'use client';

import React, { useState } from 'react';

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'template' | 'fabrication' | 'installation' | 'inspection' | 'other';
  status: 'scheduled' | 'completed' | 'delayed' | 'cancelled';
  notes: string;
  assignedTo?: string;
}

interface ProjectStatus {
  currentPhase: string;
  templateDate?: Date;
  fabricationDate?: Date;
  installationDate?: Date;
  completionDate?: Date;
  events: TimelineEvent[];
}

export default function ProjectTimeline({ projectId }: { projectId: string }) {
  const [status, setStatus] = useState<ProjectStatus>({
    currentPhase: 'Template Scheduled',
    events: []
  });

  const [newEvent, setNewEvent] = useState({
    date: new Date(),
    type: 'other',
    notes: '',
    assignedTo: ''
  });

  const addEvent = () => {
    const event: TimelineEvent = {
      id: Date.now().toString(),
      date: newEvent.date,
      type: newEvent.type as TimelineEvent['type'],
      status: 'scheduled',
      notes: newEvent.notes,
      assignedTo: newEvent.assignedTo
    };

    setStatus(prev => ({
      ...prev,
      events: [...prev.events, event]
    }));

    setNewEvent({
      date: new Date(),
      type: 'other',
      notes: '',
      assignedTo: ''
    });
  };

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Project Status</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 mx-auto mb-2" />
            <p className="font-medium">Template</p>
            <p className="text-sm text-gray-600">
              {status.templateDate?.toLocaleDateString() || 'Not Scheduled'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto mb-2" />
            <p className="font-medium">Fabrication</p>
            <p className="text-sm text-gray-600">
              {status.fabricationDate?.toLocaleDateString() || 'Not Started'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto mb-2" />
            <p className="font-medium">Installation</p>
            <p className="text-sm text-gray-600">
              {status.installationDate?.toLocaleDateString() || 'Not Scheduled'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto mb-2" />
            <p className="font-medium">Completion</p>
            <p className="text-sm text-gray-600">
              {status.completionDate?.toLocaleDateString() || 'Pending'}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Timeline</h2>
        <div className="space-y-4">
          {status.events.map((event, index) => (
            <div key={event.id} className="flex items-start">
              <div className="w-24 flex-shrink-0 text-sm text-gray-500">
                {event.date.toLocaleDateString()}
              </div>
              <div className="w-32 flex-shrink-0">
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              <div className="flex-grow">
                <p className="font-medium">{event.type}</p>
                <p className="text-sm text-gray-600">{event.notes}</p>
                {event.assignedTo && (
                  <p className="text-sm text-gray-500">Assigned to: {event.assignedTo}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Event */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-bold mb-4">Add Timeline Event</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={newEvent.date.toISOString().split('T')[0]}
              onChange={e => setNewEvent({...newEvent, date: new Date(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full border rounded p-2"
              value={newEvent.type}
              onChange={e => setNewEvent({...newEvent, type: e.target.value})}
            >
              <option value="template">Template</option>
              <option value="fabrication">Fabrication</option>
              <option value="installation">Installation</option>
              <option value="inspection">Inspection</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full border rounded p-2"
              value={newEvent.notes}
              onChange={e => setNewEvent({...newEvent, notes: e.target.value})}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Assigned To</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={newEvent.assignedTo}
              onChange={e => setNewEvent({...newEvent, assignedTo: e.target.value})}
            />
          </div>
          <div className="col-span-2">
            <button
              onClick={addEvent}
              className="w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600"
            >
              Add Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}