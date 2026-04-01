import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const AddEquipment = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form state matches our backend Mongoose Schema
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tractor', // Default value
    dailyRate: '',
    depositAmount: '',
    imageUrl: '' // For simplicity, we will use an image URL instead of file upload
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // We are sending the data BOTH ways (flat and nested) 
      // so your backend will catch it no matter how your controller is written!
      const newEquipment = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        
        // 1. Flat level (in case your backend destructures these directly)
        dailyRate: Number(formData.dailyRate),
        depositAmount: Number(formData.depositAmount),
        
        // 2. Nested level (in case your backend passes the object directly to Mongoose)
        pricing: {
          dailyRate: Number(formData.dailyRate),
          depositAmount: Number(formData.depositAmount)
        },
        
        images: [formData.imageUrl]
      };

      // Send the POST request to your API
      await API.post('/equipment', newEquipment);
      
      // If successful, send them back to the Home page
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add equipment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 mx-auto max-w-3xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">List Your Equipment</h1>
        <Link to="/dashboard" className="text-gray-600 hover:text-green-600">
          Cancel
        </Link>
      </div>

      <div className="p-8 bg-white rounded-lg shadow-md">
        {error && (
          <div className="p-3 mb-6 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Equipment Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., John Deere 5050 D"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required 
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Tractor">Tractor</option>
                <option value="Harvester">Harvester</option>
                <option value="Implement">Implement</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the condition, horsepower, and capabilities..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required 
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Daily Rental Rate ($)</label>
              <input 
                type="number" 
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                min="1"
                placeholder="150"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required 
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Security Deposit ($)</label>
              <input 
                type="number" 
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleChange}
                min="0"
                placeholder="500"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required 
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Image URL</label>
            <input 
              type="url" 
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/tractor-image.jpg"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required 
            />
            <p className="mt-1 text-xs text-gray-500">Paste a link to a high-quality image of your equipment.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 mt-4 font-bold text-white transition rounded-md shadow ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? 'Publishing Listing...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEquipment;