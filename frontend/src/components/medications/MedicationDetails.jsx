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
        <h2 className="text-xl font-bold text-gray-900">Medication Details</h2>
        <p className="text-gray-500">Details for medication #{id}</p>
      </div>
    </div>
  );
};
export default MedicationDetails;