import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const AddMedication = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', dosage: '', frequency: 'Once daily' });

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/medications')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add Medication</h2>
        <form>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input" placeholder="Medication name" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
              <input value={form.dosage} onChange={(e) => setForm({...form, dosage: e.target.value})} className="input" placeholder="e.g., 500mg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select value={form.frequency} onChange={(e) => setForm({...form, frequency: e.target.value})} className="input">
                <option>Once daily</option><option>Twice daily</option><option>Three times daily</option>
              </select></div>
            <button type="submit" className="btn-primary w-full"><Save className="w-4 h-4" /> Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddMedication;