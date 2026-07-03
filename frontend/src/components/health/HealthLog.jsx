import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Plus, Heart, Thermometer, Weight } from 'lucide-react';

const HealthLog = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">❤️ Health Log</h2>
        <Link to="/health-log/add" className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Log
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center"><Heart className="w-8 h-8 text-red-500 mx-auto mb-2" /><p className="text-sm text-gray-500">Heart Rate</p><p className="text-xl font-bold">72 bpm</p></div>
        <div className="card text-center"><Thermometer className="w-8 h-8 text-orange-500 mx-auto mb-2" /><p className="text-sm text-gray-500">Temperature</p><p className="text-xl font-bold">98.6°F</p></div>
        <div className="card text-center"><Weight className="w-8 h-8 text-blue-500 mx-auto mb-2" /><p className="text-sm text-gray-500">Weight</p><p className="text-xl font-bold">70 kg</p></div>
      </div>
    </div>
  );
};
export default HealthLog;