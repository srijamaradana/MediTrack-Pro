import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Stethoscope } from 'lucide-react';

const AppointmentDetails = () => {
  const { id } = useParams();
  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/appointments" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Appointment #{id}</h2>
        <div className="space-y-3 text-gray-600">
          <p><span className="font-medium">Doctor:</span> Dr. Sarah Johnson</p>
          <p><span className="font-medium">Date:</span> 2024-01-20</p>
          <p><span className="font-medium">Time:</span> 09:00 AM</p>
          <p><span className="font-medium">Status:</span> <span className="badge-success">Confirmed</span></p>
        </div>
      </div>
    </div>
  );
};
export default AppointmentDetails;