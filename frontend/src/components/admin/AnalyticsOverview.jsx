import React from 'react';

const AnalyticsOverview = ({ data }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Total Users</p><p className="text-lg font-bold text-gray-900">{data?.totalUsers || 0}</p></div>
      <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Total Doctors</p><p className="text-lg font-bold text-gray-900">{data?.totalDoctors || 0}</p></div>
      <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Appointments</p><p className="text-lg font-bold text-gray-900">{data?.totalAppointments || 0}</p></div>
      <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Revenue</p><p className="text-lg font-bold text-gray-900">₹{data?.totalRevenue || 0}</p></div>
    </div>
  );
};
export default AnalyticsOverview;