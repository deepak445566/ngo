import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutSection from './components/AboutSection';
import InstagramVideoSimple from './components/VideoPage';
import VolunteerPage from './components/VolunteerPage';
import ModernFooter from './components/ModernFooter';
import DonationPage from './components/DonationPage';
import VolunteerForm from './components/VolunteerForm';
import VolunteerGallery from './components/VolunteerGallery';
import MiniVolunteerCard from './components/VolunteerCard';

function App() {
  const [volunteers, setVolunteers] = useState([]);
  const [latestVolunteer, setLatestVolunteer] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load volunteers from localStorage on app start
  useEffect(() => {
    const savedVolunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    setVolunteers(savedVolunteers);
  }, []);

  // Handle new volunteer submission
  const handleAddVolunteer = (newVolunteer) => {
    // Generate a proper ID if not present
    if (!newVolunteer._id) {
      newVolunteer._id = `vol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    if (!newVolunteer.uniqueId) {
      newVolunteer.uniqueId = volunteers.length + 1;
    }
    if (!newVolunteer.joinDate) {
      newVolunteer.joinDate = new Date().toISOString();
    }

    // Add to state
    const updatedVolunteers = [...volunteers, newVolunteer];
    setVolunteers(updatedVolunteers);
    
    // Save to localStorage
    localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
    
    // Set latest volunteer for success page
    setLatestVolunteer(newVolunteer);
    setShowSuccess(true);
    
    return true;
  };

  // Handle volunteer deletion
  const handleDeleteVolunteer = (volunteerId) => {
    const updatedVolunteers = volunteers.filter(v => v._id !== volunteerId);
    setVolunteers(updatedVolunteers);
    localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
    return true;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <Navbar />
        
        <Routes>
          {/* Main Home Page */}
          <Route path="/" element={
            <>
              <Home />
              <AboutSection />
              <InstagramVideoSimple />
              <VolunteerPage />
              <ModernFooter />
            </>
          } />
          
          <Route path="/donate" element={<DonationPage />} />
          
          {/* Volunteer Registration */}
          <Route path="/volunteer/register" element={
            showSuccess && latestVolunteer ? (
              <div className="min-h-screen py-8 px-4">
                {/* Success Page */}
                <div className="max-w-6xl mx-auto">
                  {/* Success Message */}
                  <div className="mb-8">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-6 shadow-md">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-full mr-4">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-green-800 mb-1">Registration Successful! 🎉</h2>
                          <p className="text-green-700">
                            Volunteer <span className="font-bold">{latestVolunteer.name}</span> has been registered successfully.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ID Card */}
                    <div>
                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Your ID Card</h3>
                        <MiniVolunteerCard volunteer={latestVolunteer} />
                      </div>
                    </div>

                    {/* Details and Actions */}
                    <div>
                      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Volunteer Details</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                              {latestVolunteer.imageUrl ? (
                                <img 
                                  src={latestVolunteer.imageUrl} 
                                  alt={latestVolunteer.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl font-bold text-blue-600">
                                  {latestVolunteer.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-800">{latestVolunteer.name}</h4>
                              <p className="text-gray-600">ID: {latestVolunteer.uniqueId}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-500">AAK Number</p>
                              <p className="font-semibold">{latestVolunteer.aakNo}</p>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-500">Mobile</p>
                              <p className="font-semibold">+91 {latestVolunteer.mobileNo}</p>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="font-semibold">{latestVolunteer.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          to="/volunteer/register"
                          onClick={() => setShowSuccess(false)}
                          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                        >
                          Register Another
                        </Link>
                        
                        <Link
                          to="/gallery"
                          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition text-center"
                        >
                          View Gallery
                        </Link>
                        
                        <button
                          onClick={() => window.print()}
                          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                          Print Card
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <VolunteerForm 
                onSubmit={handleAddVolunteer}
                onCancel={() => window.history.back()}
              />
            )
          } />
          
          {/* Volunteer Gallery */}
          <Route path="/gallery" element={
            <VolunteerGallery 
              volunteers={volunteers}
              onDeleteVolunteer={handleDeleteVolunteer}
            />
          } />
          
          {/* 404 Page */}
          <Route path="*" element={
            <div className="min-h-[60vh] flex items-center justify-center px-4">
              <div className="text-center max-w-md">
                <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
                <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition inline-block">
                  Return to Home
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;