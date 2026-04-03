import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [myEquipment, setMyEquipment] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Equipment
        const { data: equipmentData } = await API.get('/equipment');
        const userEquipment = equipmentData.filter(
          (item) => (item.owner?._id || item.owner) === user._id
        );
        setMyEquipment(userEquipment);

        // 2. Fetch Bookings
        const { data: bookingsData } = await API.get('/bookings');
        
        // FIXED: Now perfectly matching your backend's 'renter' and 'owner' keys!
        const rentals = bookingsData.filter(b => (b.renter?._id || b.renter) === user._id);
        const requests = bookingsData.filter(b => (b.owner?._id || b.owner) === user._id);

        setMyRentals(rentals);
        setIncomingRequests(requests);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Equipment Delete Function
  const handleDelete = async (equipmentId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this equipment?");
    if (!isConfirmed) return;

    try {
      await API.delete(`/equipment/${equipmentId}`);
      setMyEquipment(myEquipment.filter((item) => item._id !== equipmentId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete equipment.");
    }
  };

  // Booking Approve/Reject Function
  const handleBookingAction = async (bookingId, newStatus) => {
    try {
      await API.put(`/bookings/${bookingId}`, { status: newStatus });
      setIncomingRequests(incomingRequests.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update booking status.");
    }
  };

  if (loading) return <div className="mt-20 text-xl font-bold text-center">Loading your dashboard... 🚜</div>;

  return (
    <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="mt-1 text-gray-600">Welcome back, {user?.firstName}!</p>
        </div>
        <Link to="/add-equipment" className="px-4 py-2 font-medium text-white transition bg-green-600 rounded-md hover:bg-green-700">
          + Add New Equipment
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        
        {/* Left Column: My Equipment */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="pb-2 mb-4 text-xl font-bold border-b">My Listed Equipment</h2>
          {myEquipment.length === 0 ? (
            <div className="py-8 text-center bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">You haven't listed any equipment yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myEquipment.map((item) => (
                <div key={item._id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                  <img src={item.images[0] || 'https://via.placeholder.com/150'} alt={item.title} className="object-cover w-16 h-16 rounded-md" />
                  <div className="flex-1 ml-4">
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">₹{item.pricing?.dailyRate} / day</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => handleDelete(item._id)} className="text-sm font-semibold text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Bookings & Requests */}
        <div className="space-y-8">
          
          {/* Incoming Requests (People renting MY stuff) */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="pb-2 mb-4 text-xl font-bold border-b">Incoming Requests</h2>
            {incomingRequests.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">No one has requested your equipment yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map((booking) => (
                  <div key={booking._id} className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-gray-800">{booking.equipment?.title}</span>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        booking.status === 'Approved' ? 'bg-green-200 text-green-800' : 
                        booking.status === 'Rejected' ? 'bg-red-200 text-red-800' : 
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {booking.status || 'Pending'}
                      </span>
                    </div>
                    <div className="mb-3 text-sm text-gray-600">
                      <p><strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                      {/* FIXED: Using booking.financials.totalAmount */}
                      <p><strong>Earnings:</strong> ₹{booking.financials?.totalAmount}</p>
                    </div>
                    
                    {/* Action Buttons for Pending Requests */}
                    {(!booking.status || booking.status === 'Pending') && (
                      <div className="flex space-x-2 border-t pt-3 mt-2">
                        <button 
                          onClick={() => handleBookingAction(booking._id, 'Approved')}
                          className="px-3 py-1 text-sm font-bold text-white bg-green-600 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleBookingAction(booking._id, 'Rejected')}
                          className="px-3 py-1 text-sm font-bold text-red-600 bg-red-100 rounded hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Rentals (Stuff I am renting) */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="pb-2 mb-4 text-xl font-bold border-b">My Rentals</h2>
            {myRentals.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">You haven't rented anything yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myRentals.map((booking) => (
                  <div key={booking._id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-gray-800">{booking.equipment?.title}</span>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        booking.status === 'Approved' ? 'bg-green-200 text-green-800' : 
                        booking.status === 'Rejected' ? 'bg-red-200 text-red-800' : 
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {booking.status || 'Pending'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</p>
                      {/* FIXED: Using booking.financials.totalAmount */}
                      <p className="mt-1 font-semibold text-green-700">Cost: ₹{booking.financials?.totalAmount}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;