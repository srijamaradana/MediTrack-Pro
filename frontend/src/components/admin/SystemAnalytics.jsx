import React from 'react';
import { Users, Stethoscope, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

const SystemAnalytics = () => {
  const stats = [
    { label: 'Total Users', value: '1,247', change: '+12%', positive: true },
    { label: 'Active Doctors', value: '48', change: '+5%', positive: true },
    { label: 'Appointments', value: '3,892', change: '-2%', positive: false },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">System Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <div className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
              {stat.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl"><Users className="w-8 h-8 text-teal-600 mx-auto mb-2" /><p className="text-sm text-gray-500">Users</p><p className="text-xl font-bold">1,247</p></div>
          <div className="text-center p-4 bg-gray-50 rounded-xl"><Stethoscope className="w-8 h-8 text-teal-600 mx-auto mb-2" /><p className="text-sm text-gray-500">Doctors</p><p className="text-xl font-bold">48</p></div>
          <div className="text-center p-4 bg-gray-50 rounded-xl"><Calendar className="w-8 h-8 text-teal-600 mx-auto mb-2" /><p className="text-sm text-gray-500">Appointments</p><p className="text-xl font-bold">3,892</p></div>
        </div>
      </div>
    </div>
  );
};
export default SystemAnalytics;