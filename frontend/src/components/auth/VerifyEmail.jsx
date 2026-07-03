import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    setTimeout(() => { setLoading(false); }, 2000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {loading ? (
          <>
            <Loader className="w-12 h-12 text-teal-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-gray-900">Verifying...</h2>
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Email Verified!</h2>
            <Link to="/login" className="text-teal-600 font-medium block mt-4">Login now</Link>
          </>
        ) : (
          <>
            <p className="text-red-600">Verification failed</p>
            <Link to="/login" className="text-teal-600 font-medium block mt-4">Back to Login</Link>
          </>
        )}
      </div>
    </div>
  );
};
export default VerifyEmail;