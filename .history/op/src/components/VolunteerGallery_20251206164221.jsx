import React, { useState, useEffect } from 'react';
import { volunteerAPI } from '../services/api';
import { Search, Filter, Download, User, Grid, List, Eye, Trash2, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MiniVolunteerCard from './VolunteerCard';


const VolunteerGallery = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAakNo, setSelectedAakNo] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // New state for form
  const [newVolunteer, setNewVolunteer] = useState(null); // New state for newly added volunteer

  // Fetch all volunteers
  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      
      // Try backend API first
      try {
        const response = await volunteerAPI.getAllVolunteers();
        if (response.success) {
          const volunteersData = response.data || [];
          setVolunteers(volunteersData);
          setFilteredVolunteers(volunteersData);
          
          // Save to localStorage as backup
          localStorage.setItem('volunteers', JSON.stringify(volunteersData));
          return;
        }
      } catch (apiError) {
        console.log('Backend API failed, checking localStorage');
      }

      // If backend fails, use local storage data
      const savedVolunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
      
      if (savedVolunteers.length > 0) {
        setVolunteers(savedVolunteers);
        setFilteredVolunteers(savedVolunteers);
      } else {
        // Generate mock data for demo
        const mockVolunteers = generateMockVolunteers();
        setVolunteers(mockVolunteers);
        setFilteredVolunteers(mockVolunteers);
        localStorage.setItem('volunteers', JSON.stringify(mockVolunteers));
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      toast.error('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  };

  // Handle new volunteer submission
  const handleNewVolunteer = (volunteerData) => {
    // Add to volunteers list
    const updatedVolunteers = [volunteerData, ...volunteers];
    setVolunteers(updatedVolunteers);
    setFilteredVolunteers(updatedVolunteers);
    
    // Save to localStorage
    localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
    
    // Set as new volunteer and show their card
    setNewVolunteer(volunteerData);
    setShowAddForm(false);
    
    // Show success message
    toast.success(`Volunteer ${volunteerData.name} added successfully!`);
  };

  // Initial fetch
  useEffect(() => {
    fetchVolunteers();
  }, []);

  // Filter volunteers based on search
  useEffect(() => {
    let results = [...volunteers];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(v =>
        v.name.toLowerCase().includes(term) ||
        v.aakNo.toLowerCase().includes(term) ||
        v.mobileNo.includes(term) ||
        v.address.toLowerCase().includes(term)
      );
    }
    
    if (selectedAakNo) {
      results = results.filter(v => v.aakNo === selectedAakNo);
    }
    
    setFilteredVolunteers(results);
  }, [searchTerm, selectedAakNo, volunteers]);

  // When new volunteer is added, show their card
  useEffect(() => {
    if (newVolunteer) {
      setSelectedVolunteer(newVolunteer);
    }
  }, [newVolunteer]);

  // Get unique AAK numbers for filter
  const aakNumbers = [...new Set(volunteers.map(v => v.aakNo))].sort();

  // View volunteer details
  const handleViewVolunteer = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setNewVolunteer(null); // Reset new volunteer if viewing someone else
  };

  // Add new volunteer button
  const handleAddVolunteer = () => {
    setShowAddForm(true);
    setSelectedVolunteer(null);
    setNewVolunteer(null);
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowAddForm(false);
  };

  // Delete volunteer
  const handleDeleteVolunteer = async (volunteerId) => {
    try {
      // Try backend API first
      try {
        const response = await volunteerAPI.deleteVolunteer(volunteerId);
        if (response.success) {
          // Update local state
          const updatedVolunteers = volunteers.filter(v => v._id !== volunteerId);
          setVolunteers(updatedVolunteers);
          setFilteredVolunteers(updatedVolunteers);
          
          // Update localStorage
          localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
          
          // If deleting the selected volunteer, clear it
          if (selectedVolunteer && selectedVolunteer._id === volunteerId) {
            setSelectedVolunteer(null);
          }
          
          toast.success('Volunteer deleted successfully');
          setShowDeleteModal(false);
          setVolunteerToDelete(null);
          return;
        }
      } catch (apiError) {
        console.log('Backend delete failed, using local storage');
      }

      // Local storage deletion
      const updatedVolunteers = volunteers.filter(v => v._id !== volunteerId);
      setVolunteers(updatedVolunteers);
      setFilteredVolunteers(updatedVolunteers);
      localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
      
      // If deleting the selected volunteer, clear it
      if (selectedVolunteer && selectedVolunteer._id === volunteerId) {
        setSelectedVolunteer(null);
      }
      
      toast.success('Volunteer deleted successfully');
      setShowDeleteModal(false);
      setVolunteerToDelete(null);
      
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      toast.error('Failed to delete volunteer');
    }
  };

  // Confirm delete
  const confirmDelete = (volunteer) => {
    setVolunteerToDelete(volunteer);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading volunteers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Volunteer ID Card Gallery</h1>
              <p className="text-blue-100 opacity-90">
                View and manage all volunteer ID cards. Total: {volunteers.length} volunteers
              </p>
            </div>
            <button
              onClick={handleAddVolunteer}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add New Volunteer
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section - Updated */}
      <div className="max-w-7xl mx-auto mb-6 bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, AAK number, mobile, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* AAK Filter */}
          <div className="w-full md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <select
                value={selectedAakNo}
                onChange={(e) => setSelectedAakNo(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="">All AAK Numbers</option>
                {aakNumbers.map(aak => (
                  <option key={aak} value={aak}>{aak}</option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-5 h-5" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
              List
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedAakNo) && (
          <div className="mt-4 flex justify-between items-center">
            <p className="text-gray-600">
              {filteredVolunteers.length} result{filteredVolunteers.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
              {selectedAakNo && ` with AAK: ${selectedAakNo}`}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedAakNo('');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Show Add Form or Gallery */}
      {showAddForm ? (
        <div className="max-w-7xl mx-auto">
          <VolunteerForm 
            onSubmit={handleNewVolunteer}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="max-w-7xl mx-auto mb-4">
            <p className="text-gray-600">
              Showing {filteredVolunteers.length} of {volunteers.length} volunteers
              {searchTerm && ` for "${searchTerm}"`}
              {selectedAakNo && ` with AAK: ${selectedAakNo}`}
            </p>
          </div>

          {/* Volunteers Display */}
          {filteredVolunteers.length === 0 ? (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <User className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No volunteers found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedAakNo 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No volunteers registered yet.'}
                </p>
                <button
                  onClick={handleAddVolunteer}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Add First Volunteer
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' ? (
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVolunteers.map((volunteer) => (
                      <div key={volunteer._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        {/* ... (same grid view code) ... */}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="max-w-7xl mx-auto">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <table className="w-full">
                      {/* ... (same table code) ... */}
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Modal for Full ID Card View */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                ID Card - {selectedVolunteer.name}
              </h2>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <MiniVolunteerCard volunteer={selectedVolunteer} />
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && volunteerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Volunteer</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <span className="font-semibold">{volunteerToDelete.name}</span> (AAK: {volunteerToDelete.aakNo})? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setVolunteerToDelete(null);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteVolunteer(volunteerToDelete._id)}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>
          शूरवीर युवा ट्रस्ट Volunteer Management System | Total Volunteers: {volunteers.length}
        </p>
        <p className="mt-1">Use the search and filter options to find specific volunteers</p>
      </div>
    </div>
  );
};

// Helper function for mock data (keep same)
const generateMockVolunteers = () => {
  const names = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Singh',
    'Vikram Yadav', 'Anjali Gupta', 'Rahul Verma', 'Pooja Mehta'
  ];
  const addresses = [
    'Mumbai, Maharashtra', 'Delhi, NCR', 'Bangalore, Karnataka',
    'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Hyderabad, Telangana'
  ];

  return Array.from({ length: 8 }, (_, i) => ({
    _id: `mock_${i + 1}`,
    uniqueId: 1000 + i + 1,
    name: names[i],
    aakNo: `AAK${String(1000 + i + 1).padStart(4, '0')}`,
    mobileNo: `9876543${i.toString().padStart(3, '0')}`,
    address: addresses[i % addresses.length],
    imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(names[i])}&background=4f46e5&color=fff&size=200&bold=true&format=png`,
    joinDate: new Date(Date.now() - i * 86400000).toISOString(),
    createdAt: new Date(Date.now() - i * 86400000)
  }));
};

export default VolunteerGallery;