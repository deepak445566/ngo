import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VolunteerForm from './VolunteerForm';
import VolunteerGallery from './VolunteerGallery';

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);

  // Component mount होने पर localStorage से डेटा लोड करें
  useEffect(() => {
    const loadVolunteers = () => {
      try {
        const savedVolunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
        setVolunteers(savedVolunteers);
      } catch (error) {
        console.error('Error loading volunteers:', error);
        setVolunteers([]);
      }
    };

    loadVolunteers();
  }, []);

  // नया volunteer जोड़ने का function
  const handleAddVolunteer = (newVolunteer) => {
    try {
      const updatedVolunteers = [...volunteers, newVolunteer];
      setVolunteers(updatedVolunteers);
      localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
      return true;
    } catch (error) {
      console.error('Error adding volunteer:', error);
      return false;
    }
  };

  // Volunteer डिलीट करने का function
  const handleDeleteVolunteer = (volunteerId) => {
    try {
      const updatedVolunteers = volunteers.filter(v => v._id !== volunteerId);
      setVolunteers(updatedVolunteers);
      localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
      return true;
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <Routes>
        <Route 
          path="/form" 
          element={
            <VolunteerFormWrapper 
              onAddVolunteer={handleAddVolunteer}
              volunteers={volunteers}
            />
          } 
        />
        <Route 
          path="/gallery" 
          element={
            <VolunteerGallery 
              volunteers={volunteers}
              onDeleteVolunteer={handleDeleteVolunteer}
            />
          } 
        />
        <Route path="/" element={<Navigate to="/form" />} />
        <Route path="*" element={<Navigate to="/form" />} />
      </Routes>
    </div>
  );
};

// VolunteerForm के लिए wrapper component
const VolunteerFormWrapper = ({ onAddVolunteer, volunteers }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState(null);

  const handleSubmit = (volunteerData) => {
    const success = onAddVolunteer(volunteerData);
    if (success) {
      setNewVolunteer(volunteerData);
      setShowSuccess(true);
    }
    return success;
  };

  if (showSuccess && newVolunteer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-2">
              Volunteer <span className="font-semibold text-blue-600">{newVolunteer.name}</span> has been registered successfully.
            </p>
            <p className="text-gray-600 mb-6">
              AAK Number: <span className="font-semibold">{newVolunteer.aakNo}</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/form"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Register Another Volunteer
              </a>
              <a
                href="/gallery"
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
                View Volunteer Gallery
              </a>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Total Volunteers Registered: <span className="font-bold text-blue-600">{volunteers.length}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <VolunteerForm onSubmit={handleSubmit} />;
};

export default VolunteerManagement;