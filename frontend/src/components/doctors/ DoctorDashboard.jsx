import React from 'react';
import { Users, Calendar, CheckCircle, Clock } from 'lucide-react';

const DoctorDashboard = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">👨‍⚕️ Doctor Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <Users className="w-8 h-8 text-teal-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Patients</p>
          <p className="text-xl font-bold">128</p>
        </div>
        <div className="card text-center">
          <Calendar className="w-8 h-8 text-teal-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Appointments</p>
          <p className="text-xl font-bold">45</p>
        </div>
        <div className="card text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-xl font-bold">32</p>
        </div>
        <div className="card text-center">
          <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-xl font-bold">13</p>
        </div>
      </div>
    </div>
  );
};
export default DoctorDashboard;