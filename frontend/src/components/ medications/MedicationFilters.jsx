import React from 'react';
import { Filter } from 'lucide-react';

const MedicationFilters = ({ statusFilter, onStatusChange }) => {
  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'discontinued', label: 'Discontinued' },
    { value: 'paused', label: 'Paused' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-gray-400" />
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="input py-2 text-sm"
      >
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MedicationFilters;