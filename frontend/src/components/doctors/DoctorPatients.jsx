import React from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronRight } from 'lucide-react';

const DoctorPatients = () => {
  const patients = [
    { id: 1, name: 'John Doe', age: 45, lastVisit: '2024-01-15' },
    { id: 2, name: 'Jane Smith', age: 32, lastVisit: '2024-01-10' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">My Patients</h2>
      {patients.map((patient) => (
        <Link key={patient.id} to={`/doctor/patients/${patient.id}`}>
          <div className="card flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-teal-600" /></div>
              <div><p className="font-medium text-gray-900">{patient.name}</p><p className="text-sm text-gray-500">Age: {patient.age} • Last: {patient.lastVisit}</p></div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );
};
export default DoctorPatients;