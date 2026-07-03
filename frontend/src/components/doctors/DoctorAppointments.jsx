import React from 'react';
import { Calendar, User, ChevronRight } from 'lucide-react';

const DoctorAppointments = () => {
  const appointments = [
    { id: 1, patient: 'John Doe', time: '09:00 AM', status: 'Confirmed' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', status: 'Scheduled' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">My Appointments</h2>
      {appointments.map((apt) => (
        <div key={apt.id} className="card flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-teal-600" /></div>
            <div><p className="font-medium text-gray-900">{apt.patient}</p><p className="text-sm text-gray-500">{apt.time}</p></div>
          </div>
          <span className={`badge ${apt.status === 'Confirmed' ? 'badge-success' : 'badge-warning'}`}>{apt.status}</span>
        </div>
      ))}
    </div>
  );
};
export default DoctorAppointments;