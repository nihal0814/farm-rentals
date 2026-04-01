import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth'; // 1. Import our auth hook

const EquipmentDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth(); // 2. Get the current user

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingStatus, setBookingStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        const { data } = await API.get(`/equipment/${id}`);
        setEquipment(data);
        setLoading(false);
      } catch (err) {
        setError('Could not fetch equipment details.');
        setLoading(false);
      }
    };
    fetchEquipmentDetails();
  }, [id]);

  // 3. The function that handles the booking request
  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingStatus({ type: '', message: '' });

    // If they aren't logged in, send them to the login page
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data } = await API.post('/bookings', {
        equipmentId: id,
        startDate,
        endDate
      });
      
      setBookingStatus({ 
        type: 'success', 
        message: 'Booking requested successfully! Waiting for owner approval.' 
      });
      // Clear the dates
      setStartDate('');
      setEndDate('');
    } catch (err) {
      setBookingStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to request booking.' 
      });
    }
  };

  if (loading) return <div className="mt-20 text-xl font-bold text-center">Loading details... 🚜</div>;
  if (error) return <div className="mt-20 text-xl font-bold text-center text-red-600">{error}</div>;
  if (!equipment) return <div className="mt-20 text-xl text-center">Equipment not found.</div>;

  return (
    <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <Link to="/" className="inline-block mb-6 text-green-600 hover:text-green-800">
        &larr; Back to Listings
      </Link>

      <div className="overflow-hidden bg-white rounded-lg shadow-lg md:flex">
        {/* Left Side: Image */}
        <div className="md:w-1/2">
          <img 
            src={equipment.images[0] || 'https://via.placeholder.com/800x600'} 
            alt={equipment.title} 
            className="object-cover w-full h-full min-h-[300px]"
          />
        </div>

        {/* Right Side: Details & Booking Form */}
        <div className="flex flex-col justify-between p-8 md:w-1/2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{equipment.title}</h1>
              <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                {equipment.category}
              </span>
            </div>
            
            <p className="mb-6 text-lg text-gray-700">{equipment.description}</p>
            
            <div className="p-4 mb-6 bg-gray-50 rounded-lg">
              <h3 className="pb-2 mb-2 text-lg font-semibold border-b">Pricing</h3>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Daily Rate:</span>
                <span className="font-bold text-green-600">${equipment.pricing.dailyRate}/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security Deposit:</span>
                <span className="font-bold text-gray-800">${equipment.pricing.depositAmount}</span>
              </div>
            </div>
          </div>

          {/* 4. The Booking Form */}
          <div className="pt-6 mt-4 border-t">
            <h3 className="mb-4 text-xl font-bold text-gray-800">Request a Rental</h3>
            
            {bookingStatus.message && (
              <div className={`p-3 mb-4 text-sm rounded ${bookingStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {bookingStatus.message}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
                  <input 
                    type="date" 
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full py-3 mt-4 text-lg font-bold text-white transition bg-green-600 rounded-md shadow hover:bg-green-700"
              >
                {user ? 'Request to Book' : 'Log in to Book'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;