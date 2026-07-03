import React from 'react';
import { User, Mail, Phone, Calendar, MapPin } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-4">👤 My Profile</h2>
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-3xl font-bold text-teal-600">
            JD
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">John Doe</h3>
            <p className="text-gray-500">Patient</p>
          </div>
        </div>
        <div className="space-y-3 text-gray-600">
          <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> john@example.com</p>
          <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</p>
          <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Born: 1990-01-01</p>
          <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Mumbai, India</p>
        </div>
      </div>
    </div>
  );
};
export default Profile;