import React, { useState } from 'react';
import { Calendar, Search, Eye } from 'lucide-react';

const AppointmentManagement = () => {
  const [search, setSearch] = useState('');
  const appointments = [
    { id: 1, patient: 'John Doe', doctor: 'Dr. Sarah Johnson', date: '2024-01-20', time: '09:00 AM', status: 'Confirmed' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Appointment Management</h2>
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" placeholder="Search..." />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Patient</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Doctor</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th></tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id} className="border-t border-gray-100">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{apt.patient}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{apt.doctor}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{apt.date} at {apt.time}</td>
                <td className="px-4 py-3"><span className="badge-success">{apt.status}</span></td>
                <td className="px-4 py-3 text-right"><Eye className="w-4 h-4 text-gray-400 inline" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AppointmentManagement;