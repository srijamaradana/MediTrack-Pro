import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const UserGrowthChart = ({ data, type = 'line' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
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
            <Line type="monotone" dataKey="users" stroke="#0A6E79" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="active" stroke="#27AE60" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="new" stroke="#2D9CDB" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
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
            <Area type="monotone" dataKey="users" stackId="1" stroke="#0A6E79" fill="#0A6E79" fillOpacity={0.3} />
            <Area type="monotone" dataKey="active" stackId="1" stroke="#27AE60" fill="#27AE60" fillOpacity={0.3} />
            <Area type="monotone" dataKey="new" stackId="1" stroke="#2D9CDB" fill="#2D9CDB" fillOpacity={0.3} />
          </AreaChart>
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

export default UserGrowthChart;