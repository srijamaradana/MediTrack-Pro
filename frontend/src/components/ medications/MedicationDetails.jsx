import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pill } from 'lucide-react';

const MedicationDetails = () => {
  const { id } = useParams();
  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/medications" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center"><Pill className="w-6 h-6 text-teal-600" /></div>
          <div><h2 className="text-xl font-bold text-gray-900">Medication #{id}</h2><p className="text-gray-500">Details</p></div>
        </div>
        <div className="space-y-2 text-gray-600">
          <p><span className="font-medium">Name:</span> Metformin</p>
          <p><span className="font-medium">Dosage:</span> 500mg</p>
          <p><span className="font-medium">Frequency:</span> Twice daily</p>
        </div>
      </div>
    </div>
  );
};
export default MedicationDetails;