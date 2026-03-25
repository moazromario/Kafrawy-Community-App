import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import RideBooking from '../../components/RideBooking';

const KafrawyGoModule = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <Routes>
        <Route 
          path="/" 
          element={
            <RideBooking 
              onBack={() => navigate('/')} 
              onShowHistory={() => navigate('/go/history')} 
            />
          } 
        />
        <Route 
          path="/history" 
          element={
            <div className="p-8 text-center">
              <h2 className="text-2xl font-black mb-4">سجل الرحلات</h2>
              <p className="text-[var(--muted)]">قريباً...</p>
              <button 
                onClick={() => navigate(-1)}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-xl font-bold"
              >
                رجوع
              </button>
            </div>
          } 
        />
      </Routes>
    </div>
  );
};

export default KafrawyGoModule;
