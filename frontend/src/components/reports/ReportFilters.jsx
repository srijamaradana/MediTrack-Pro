import React from 'react';
import { Filter } from 'lucide-react';
import { REPORT_TYPES } from '../../utils/constants';

const ReportFilters = ({ typeFilter, onTypeChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-gray-400" />
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        className="input py-2 text-sm"
      >
        <option value="all">All Types</option>
        {REPORT_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReportFilters;