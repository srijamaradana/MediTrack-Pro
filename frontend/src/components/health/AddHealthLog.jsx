import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Heart, Thermometer, Weight } from 'lucide-react';

const AddHealthLog = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ heartRate: '', temperature: '', weight: '', notes: '' });

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/health-log')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Log Health Data</h2>
        <form>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
              <input type="number" className="input" placeholder="72" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
              <input type="number" step="0.1" className="input" placeholder="98.6" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input type="number" step="0.1" className="input" placeholder="70" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea className="input" rows="3" placeholder="Any symptoms or notes..." /></div>
            <button type="submit" className="btn-primary w-full"><Save className="w-4 h-4" /> Save Log</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddHealthLog;