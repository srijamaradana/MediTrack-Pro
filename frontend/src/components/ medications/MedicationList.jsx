import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Plus, Search, Edit, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';

const MedicationList = () => {
  const [search, setSearch] = useState('');
  const medications = [
    { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', status: 'Active', times: ['08:00', '20:00'] },
    { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', status: 'Active', times: ['09:00'] },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">💊 Medications</h2>
        <Link to="/medications/add" className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add
        </Link>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          className="input pl-10" placeholder="Search medications..." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medications.map((med) => (
          <div key={med.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{med.name}</p>
                  <p className="text-sm text-gray-500">{med.dosage} • {med.frequency}</p>
                </div>
              </div>
              <span className="badge-success">{med.status}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {med.times.map((t, i) => (
                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">{t}</span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn-success text-sm flex-1"><CheckCircle className="w-4 h-4" /> Taken</button>
              <button className="p-2 text-gray-400 hover:text-teal-600"><Edit className="w-4 h-4" /></button>
              <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MedicationList;