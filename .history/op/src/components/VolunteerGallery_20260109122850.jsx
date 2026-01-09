// components/VolunteerGallery.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, Grid, List, UserPlus, Eye, Phone, MapPin, Calendar, Download } from 'lucide-react';
import { volunteerAPI } from '../services/api';
import toast from 'react-hot-toast';

IdCard
const VolunteerGallery = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
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

    // Fetch volunteers on component mount
    useEffect(() => {
        fetchVolunteers();
    }, []);

    // Filter volunteers when search or filters change
    useEffect(() => {
        filterVolunteers();
    }, [searchTerm, filters, volunteers]);

    const fetchVolunteers = async () => {
        setLoading(true);
        try {
            // Try to fetch from backend API
            const response = await volunteerAPI.getAllVolunteers();
            if (response.success) {
                setVolunteers(response.data);
                calculateStats(response.data);
            }
        } catch (error) {
            console.log('Using mock data for gallery');
            // Mock data for development/demo
            const mockVolunteers = generateMockVolunteers();
            setVolunteers(mockVolunteers);
            setFilteredVolunteers(mockVolunteers);
            calculateStats(mockVolunteers);
        } finally {
            setLoading(false);
        }
    };

    const generateMockVolunteers = () => {
        const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];
        const names = [
            'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Singh', 'Rohit Verma',
            'Anjali Gupta', 'Vikram Yadav', 'Neha Joshi', 'Sanjay Mishra', 'Pooja Reddy',
            'Karan Malhotra', 'Divya Nair', 'Arjun Desai', 'Meera Choudhary', 'Suresh Tiwari'
        ];
        
        return Array.from({ length: 15 }, (_, index) => ({
            _id: `mock-${index + 1}`,
            uniqueId: 100 + index,
            name: names[index % names.length],
            aakNo: `A${String(1000 + index).padStart(4, '0')}`,
            mobileNo: `98765${String(10000 + index).slice(1)}`,
            address: `${Math.floor(Math.random() * 100)} Street, ${cities[index % cities.length]}, India`,
            imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${names[index % names.length]}`,
            joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
            createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        }));
    };

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

    const filterVolunteers = () => {
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
    };

    const handleViewDetails = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setShowModal(true);
    };

    const handleDeleteVolunteer = async (id) => {
        if (window.confirm('Are you sure you want to delete this volunteer?')) {
            try {
                const response = await volunteerAPI.deleteVolunteer(id);
                if (response.success) {
                    setVolunteers(prev => prev.filter(v => v._id !== id));
                    toast.success('Volunteer deleted successfully');
                }
            } catch (error) {
                console.log('Using mock delete');
                setVolunteers(prev => prev.filter(v => v._id !== id));
                toast.success('Volunteer deleted successfully (Demo)');
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
            new Date(v.joinDate).toLocaleDateString()
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
                                Meet our amazing team of volunteers making a difference
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
                                <p className="text-gray-500 text-sm">Joined This Month</p>
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
                                <p className="text-gray-500 text-sm">Joined This Year</p>
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

                            <div className="flex items-center">
                                <select
                                    value={filters.year}
                                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Years</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
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

            {/* Volunteers Grid/List */}
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
                        <button
                            onClick={resetFilters}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVolunteers.map((volunteer) => (
                            <div
                                key={volunteer._id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="relative">
                                    <div className="h-48 bg-gradient-to-r from-blue-500 to-green-500 relative overflow-hidden">
                                        {volunteer.imageUrl ? (
                                            <img
                                                src={volunteer.imageUrl}
                                                alt={volunteer.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Users className="w-20 h-20 text-white opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                                            <span className="text-sm font-bold text-blue-600">
                                                ID: {volunteer.uniqueId}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {volunteer.name}
                                        </h3>
                                        
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <IdCard className="w-4 h-4 mr-2 text-green-600" />
                                                <span className="text-sm">AAK: {volunteer.aakNo}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                                                <span className="text-sm">{volunteer.mobileNo}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2 text-red-600" />
                                                <span className="text-sm truncate">{volunteer.address.split(',')[0]}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <button
                                                onClick={() => handleViewDetails(volunteer)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center text-sm"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </button>
                                            
                                            <Link
                                                to={`/volunteer/card/${volunteer._id}`}
                                                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm"
                                            >
                                                View ID Card
                                            </Link>
                                        </div>
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
                                                    {new Date(volunteer.joinDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleViewDetails(volunteer)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    View
                                                </button>
                                                <Link
                                                    to={`/volunteer/card/${volunteer._id}`}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    ID Card
                                                </Link>
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
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Volunteer Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="md:w-1/3">
                                    <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl h-64 flex items-center justify-center">
                                        {selectedVolunteer.imageUrl ? (
                                            <img
                                                src={selectedVolunteer.imageUrl}
                                                alt={selectedVolunteer.name}
                                                className="w-48 h-48 rounded-full object-cover border-4 border-white"
                                            />
                                        ) : (
                                            <div className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
                                                <Users className="w-32 h-32 text-white opacity-70" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="md:w-2/3">
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            {selectedVolunteer.name}
                                        </h3>
                                        <div className="flex items-center space-x-4">
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                ID: {selectedVolunteer.uniqueId}
                                            </span>
                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                AAK: {selectedVolunteer.aakNo}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-500">Mobile Number</label>
                                            <p className="text-lg font-medium">{selectedVolunteer.mobileNo}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm text-gray-500">Address</label>
                                            <p className="text-lg">{selectedVolunteer.address}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm text-gray-500">Join Date</label>
                                            <p className="text-lg">
                                                {new Date(selectedVolunteer.joinDate).toLocaleDateString('en-IN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 flex space-x-4">
                                        <Link
                                            to={`/volunteer/card/${selectedVolunteer._id}`}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg text-center hover:from-blue-700 hover:to-green-700 transition"
                                        >
                                            View ID Card
                                        </Link>
                                        
                                        <button
                                            onClick={() => {
                                                setShowModal(false);
                                                handleDeleteVolunteer(selectedVolunteer._id);
                                            }}
                                            className="px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
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