import React, { useState } from 'react';

const UserModal = ({ user, onClose, onSave, isLoading }) => {
  const [role, setRole] = useState(user?.role || 'patient');
  const [isActive, setIsActive] = useState(user?.isActive !== false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ role, isActive });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Edit User</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 text-teal-600" />
              <label className="text-sm text-gray-700">Active</label>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
              <button type="submit" disabled={isLoading} className="flex-1 btn-primary">{isLoading ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserModal;