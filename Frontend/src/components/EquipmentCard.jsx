import { Link } from 'react-router-dom';

const EquipmentCard = ({ item }) => {
  return (
    <div className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
      {/* Equipment Image */}
      <img 
        src={item.images[0] || 'https://via.placeholder.com/400'} 
        alt={item.title} 
        className="object-cover w-full h-48"
      />
      
      <div className="p-4">
        {/* Title and Category */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800 truncate">{item.title}</h3>
          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
            {item.category}
          </span>
        </div>
        
        {/* Description */}
        <p className="mb-4 text-gray-600 line-clamp-2">{item.description}</p>
        
        {/* Pricing and Action Button */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold text-green-600">${item.pricing.dailyRate}</span>
            <span className="text-sm text-gray-500"> / day</span>
          </div>
          
          <Link 
            to={`/equipment/${item._id}`}
            className="px-4 py-2 text-sm font-medium text-white transition bg-green-600 rounded-md hover:bg-green-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;