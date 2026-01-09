import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import VolunteerForm from './VolunteerForm';
import VolunteerGallery from './VolunteerGallery';
import MiniVolunteerCard from './VolunteerCard';

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [latestVolunteer, setLatestVolunteer] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const navigate = useNavigate();

  // Load volunteers from localStorage on component mount
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
    
    // Also try to fetch from backend
    fetchFromBackend();
  }, []);

  const fetchFromBackend = async () => {
    try {
      // Your backend API call here
      const response = await fetch('https://ngo-t3ob.onrender.com/api/volunteers');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setVolunteers(data.data);
          localStorage.setItem('volunteers', JSON.stringify(data.data));
        }
      }
    } catch (error) {
      console.log('Using local storage data');
    }
  };

  // Handle new volunteer submission
  const handleVolunteerSubmit = (newVolunteer) => {
    try {
      // Add new volunteer to state
      const updatedVolunteers = [...volunteers, newVolunteer];
      setVolunteers(updatedVolunteers);
      
      // Save to localStorage
      localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
      
      // Set latest volunteer for card display
      setLatestVolunteer(newVolunteer);
      setShowCard(true);
      
      // Navigate to success page
      navigate('/volunteer/success');
      
      return true;
    } catch (error) {
      console.error('Error adding volunteer:', error);
      return false;
    }
  };

  // Handle volunteer deletion
  const handleDeleteVolunteer = (volunteerId) => {
    try {
      const updatedVolunteers = volunteers.filter(v => v._id !== volunteerId);
      setVolunteers(updatedVolunteers);
      localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
      
      if (latestVolunteer && latestVolunteer._id === volunteerId) {
        setLatestVolunteer(null);
        setShowCard(false);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      return false;
    }
  };

  return (
    <>
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
      
      <Routes>
        {/* Registration Form Route */}
        <Route path="/register" element={
          <VolunteerForm 
            onSubmit={handleVolunteerSubmit}
            onCancel={() => navigate('/gallery')}
          />
        } />
        
        {/* Registration Success Route */}
        <Route path="/success" element={
          showCard && latestVolunteer ? (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
              <div className="max-w-6xl mx-auto">
                {/* Success Header */}
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
                  {/* ID Card Section */}
                  <div>
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Generated ID Card</h3>
                      <MiniVolunteerCard volunteer={latestVolunteer} />
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => {
                            setShowCard(false);
                            navigate('/register');
                          }}
                          className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-center"
                        >
                          <svg className="w-6 h-6 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          <span className="font-medium text-blue-700">Add Another Volunteer</span>
                        </button>
                        
                        <a
                          href="/gallery"
                          className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition text-center block"
                        >
                          <svg className="w-6 h-6 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                          </svg>
                          <span className="font-medium text-green-700">View All Volunteers</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Volunteer Details Section */}
                  <div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">Volunteer Details</h3>
                      
                      <div className="space-y-6">
                        <div>
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
                              <h4 className="text-2xl font-bold text-gray-800">{latestVolunteer.name}</h4>
                              <p className="text-gray-600">Unique ID: {latestVolunteer.uniqueId}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">AAK Number</p>
                            <p className="font-semibold text-gray-800">{latestVolunteer.aakNo}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                            <p className="font-semibold text-gray-800">+91 {latestVolunteer.mobileNo}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                            <p className="text-sm text-gray-500 mb-1">Address</p>
                            <p className="font-semibold text-gray-800">{latestVolunteer.address}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Registration Date</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(latestVolunteer.joinDate || latestVolunteer.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Total Volunteers</p>
                            <p className="font-semibold text-gray-800">{volunteers.length}</p>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <h4 className="font-bold text-gray-700 mb-2">What's Next?</h4>
                          <ul className="space-y-2 text-gray-600">
                            <li className="flex items-center">
                              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Your ID card is ready to download
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              You can view all volunteers in the gallery
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Share your ID card with the trust
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                        </svg>
                        Print ID Card
                      </button>
                      
                      <a
                        href="/"
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        Go to Home
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No Volunteer Data Found</h2>
                <a
                  href="/register"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
                >
                  Register Volunteer
                </a>
              </div>
            </div>
          )
        } />
        
        {/* Gallery Route */}
        <Route path="/gallery" element={
          <VolunteerGallery 
            volunteers={volunteers}
            onDeleteVolunteer={handleDeleteVolunteer}
          />
        } />
      </Routes>
    </>
  );
};

export default VolunteerManagement;