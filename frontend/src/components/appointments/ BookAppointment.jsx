import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';

const BookAppointment = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/appointments')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Book Appointment</h2>
        <form>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <select className="input">
                <option>Dr. Sarah Johnson</option>
                <option>Dr. Michael Chen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" className="input" />
            </div>
            <button type="submit" className="btn-primary w-full">
              <Calendar className="w-4 h-4" /> Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default BookAppointment;