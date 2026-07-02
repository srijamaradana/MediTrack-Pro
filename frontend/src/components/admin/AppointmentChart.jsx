import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Line
} from 'recharts';

const AppointmentChart = ({ data, type = 'bar' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              }}
            />
            <Legend />
            <Bar dataKey="appointments" fill="#0A6E79" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="#27AE60" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cancelled" fill="#EB5757" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="appointments" stackId="1" stroke="#0A6E79" fill="#0A6E79" fillOpacity={0.3} />
            <Area type="monotone" dataKey="completed" stackId="1" stroke="#27AE60" fill="#27AE60" fillOpacity={0.3} />
            <Area type="monotone" dataKey="cancelled" stackId="1" stroke="#EB5757" fill="#EB5757" fillOpacity={0.3} />
          </AreaChart>
        );

      case 'composed':
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              }}
            />
            <Legend />
            <Bar dataKey="appointments" barSize={20} fill="#0A6E79" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="completed" stroke="#27AE60" strokeWidth={2} />
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default AppointmentChart;