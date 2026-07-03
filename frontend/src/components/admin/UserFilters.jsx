import React from 'react';

const UserFilters = ({ roleFilter, onRoleChange, statusFilter, onStatusChange }) => {
  return (
    <div className="flex gap-2">
      <select value={roleFilter} onChange={(e) => onRoleChange(e.target.value)} className="input py-2 text-sm">
        <option value="all">All Roles</option>
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
        <option value="admin">Admin</option>
      </select>
      <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} className="input py-2 text-sm">
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
};
export default UserFilters;