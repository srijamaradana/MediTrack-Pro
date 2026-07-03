import React, { useState } from 'react';
import { Stethoscope, Search, Plus, Edit, Trash2 } from 'lucide-react';

const DoctorManagement = () => {
  const [search, setSearch] = useState('');
  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Cardiology', patients: 128, status: 'Active' },
    { id: 2, name: 'Dr. Michael Chen', specialization: 'Neurology', patients: 95, status: 'Active' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Doctor Management</h2>
        <button className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add</button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" placeholder="Search..." />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Doctor</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Specialization</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Patients</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th></tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id} className="border-t border-gray-100">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center"><Stethoscope className="w-4 h-4 text-teal-600" /></div><span className="font-medium text-gray-900">{doc.name}</span></div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{doc.specialization}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{doc.patients}</td>
                <td className="px-4 py-3 text-right"><button className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-400" /></button><button className="p-1 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DoctorManagement;