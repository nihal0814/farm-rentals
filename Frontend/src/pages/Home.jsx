import { useState, useEffect } from 'react';
import API from '../services/api';
import EquipmentCard from '../components/EquipmentCard';

const Home = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // NEW: Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { data } = await API.get('/equipment'); 
        setEquipmentList(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load equipment. Is your backend running?');
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  // NEW: Filter the equipment based on search text and category
  const filteredEquipment = equipmentList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="mt-20 text-2xl font-bold text-center text-gray-600">Loading tractors... 🚜</div>;
  }

  if (error) {
    return <div className="mt-20 text-xl font-bold text-center text-red-600">{error}</div>;
  }

  return (
    <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
      
      {/* Header section */}
      <div className="flex flex-col items-center justify-between mb-8 sm:flex-row">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:mb-0">Available Equipment</h1>
        
        {/* NEW: Search and Filter Controls */}
        <div className="flex w-full space-x-4 sm:w-auto">
          <input 
            type="text" 
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="All">All Categories</option>
            <option value="Tractor">Tractor</option>
            <option value="Harvester">Harvester</option>
            <option value="Implement">Implement</option>
            <option value="Tools">Tools</option>
          </select>
        </div>
      </div>
      
      {/* Equipment Grid */}
      {filteredEquipment.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-lg shadow-sm">
          <p className="text-lg text-gray-500">No equipment matches your search criteria.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            className="px-4 py-2 mt-4 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEquipment.map((item) => (
            <EquipmentCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;