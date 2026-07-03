import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Search } from 'lucide-react';

const AppointmentList = () => {
  const [search, setSearch] = useState('');
  const appointments = [
    { id: 1, doctor: 'Dr. Sarah Johnson', date: '2024-01-20', time: '09:00 AM', status: 'Confirmed' },
    { id: 2, doctor: 'Dr. Michael Chen', date: '2024-01-22', time: '10:30 AM', status: 'Scheduled' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">📅 Appointments</h2>
        <Link to="/appointments/book" className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Book
        </Link>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
          placeholder="Search..."
        />
      </div>
      <div className="space-y-3">
        {appointments.map((apt) => (
          <div key={apt.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{apt.doctor}</p>
                <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
              </div>
            </div>
            <span className={`badge ${apt.status === 'Confirmed' ? 'badge-success' : 'badge-warning'}`}>
              {apt.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AppointmentList;