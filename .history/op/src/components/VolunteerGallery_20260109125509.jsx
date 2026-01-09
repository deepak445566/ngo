import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, Grid, List, UserPlus, Eye, Phone, MapPin, Calendar, Download, IdCard, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MiniVolunteerCard from './VolunteerCard';

const VolunteerGallery = ({ volunteers = [], onDeleteVolunteer }) => {
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    year: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    thisYear: 0
  });

  // Initialize with provided volunteers
  useEffect(() => {
    setFilteredVolunteers(volunteers);
    calculateStats(volunteers);
  }, [volunteers]);

  // Filter volunteers when search or filters change
  useEffect(() => {
    let filtered = [...volunteers];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(term) ||
        v.aakNo.toLowerCase().includes(term) ||
        v.mobileNo.includes(term) ||
        v.address.toLowerCase().includes(term)
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(v =>
        v.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply year filter
    if (filters.year) {
      filtered = filtered.filter(v => {
        const joinYear = new Date(v.joinDate || v.createdAt).getFullYear();
        return joinYear.toString() === filters.year;
      });
    }

    setFilteredVolunteers(filtered);
    calculateStats(filtered);
  }, [searchTerm, filters, volunteers]);

  const calculateStats = (volunteerList) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthCount = volunteerList.filter(v => {
      const joinDate = new Date(v.joinDate || v.createdAt);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;

    const thisYearCount = volunteerList.filter(v => {
      const joinDate = new Date(v.joinDate || v.createdAt);
      return joinDate.getFullYear() === currentYear;
    }).length;

    setStats({
      total: volunteerList.length,
      thisMonth: thisMonthCount,
      thisYear: thisYearCount
    });
  };

  const handleViewDetails = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowModal(true);
  };

  const handleDelete = (volunteerId) => {
    if (window.confirm('Are you sure you want to delete this volunteer?')) {
      if (onDeleteVolunteer) {
        onDeleteVolunteer(volunteerId);
        toast.success('Volunteer deleted successfully');
      }
      setShowModal(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({ location: '', year: '' });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'AAK No', 'Mobile', 'Address', 'Join Date'];
    const csvData = volunteers.map(v => [
      v.uniqueId,
      v.name,
      v.aakNo,
      v.mobileNo,
      v.address,
      new Date(v.joinDate || v.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volunteers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success('Volunteer list exported successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Volunteer Gallery</h1>
              <p className="text-blue-100 text-lg">
                Meet our amazing team of volunteers
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/volunteer/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold flex items-center transition"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Register New Volunteer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Volunteers</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">This Month</p>
                <p className="text-3xl font-bold text-gray-800">{stats.thisMonth}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">This Year</p>
                <p className="text-3xl font-bold text-gray-800">{stats.thisYear}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative mr-4">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search volunteers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-400 mr-2" />
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Locations</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Reset Filters
              </button>

              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing <span className="font-bold">{filteredVolunteers.length}</span> of{' '}
              <span className="font-bold">{volunteers.length}</span> volunteers
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        </div>
      </div>

      {/* Volunteers Display */}
      <div className="container mx-auto px-4 mb-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading volunteers...</p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No volunteers found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <Link
              to="/volunteer/register"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block"
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              Register First Volunteer
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVolunteers.map((volunteer) => (
              <div
                key={volunteer._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src={volunteer.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(volunteer.name)}&background=4f46e5&color=fff&size=96&bold=true`}
                        alt={volunteer.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              ${volunteer.name.charAt(0)}
                            </div>
                          `;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 truncate">{volunteer.name}</h3>
                      <p className="text-sm text-gray-600">{volunteer.aakNo}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      <span>+91 {volunteer.mobileNo}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-red-600" />
                      <span className="truncate">{volunteer.address.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-green-600" />
                      <span>{new Date(volunteer.joinDate || volunteer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(volunteer)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(volunteer._id)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volunteer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVolunteers.map((volunteer) => (
                    <tr key={volunteer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {volunteer.imageUrl ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={volunteer.imageUrl}
                                alt={volunteer.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-bold">
                                  {volunteer.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {volunteer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {volunteer.uniqueId} | AAK: {volunteer.aakNo}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{volunteer.mobileNo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {volunteer.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(volunteer.joinDate || volunteer.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(volunteer)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(volunteer._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Volunteer Details Modal */}
      {showModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Volunteer Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* ID Card Preview */}
                <div className="md:w-1/2">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">ID Card</h3>
                  <div className="scale-90 origin-top">
                    <MiniVolunteerCard volunteer={selectedVolunteer} />
                  </div>
                </div>
                
                {/* Details */}
                <div className="md:w-1/2">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        {selectedVolunteer.imageUrl ? (
                          <img 
                            src={selectedVolunteer.imageUrl} 
                            alt={selectedVolunteer.name}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-blue-600">
                            {selectedVolunteer.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-800">{selectedVolunteer.name}</h4>
                        <p className="text-gray-600">ID: {selectedVolunteer.uniqueId}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">AAK Number</p>
                      <p className="font-semibold text-lg">{selectedVolunteer.aakNo}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                      <p className="font-semibold text-lg">+91 {selectedVolunteer.mobileNo}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Address</p>
                      <p className="font-semibold">{selectedVolunteer.address}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Join Date</p>
                      <p className="font-semibold">
                        {new Date(selectedVolunteer.joinDate || selectedVolunteer.createdAt).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowModal(false);
                        handleDelete(selectedVolunteer._id);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete Volunteer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerGallery;