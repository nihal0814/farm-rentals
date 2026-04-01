import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <nav className="bg-green-700 shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-xl font-bold text-white">
              🚜 FarmRentals
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* NEW: Dashboard Link */}
                <Link to="/dashboard" className="font-medium text-green-100 hover:text-white">
                  Dashboard
                </Link>
                
                <span className="pl-4 border-l border-green-600 text-green-50">
                  Hello, {user.firstName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-green-700 transition bg-white rounded-md hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-sm font-medium text-white transition rounded-md hover:bg-green-600">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-green-700 transition bg-white rounded-md hover:bg-gray-100">
                  Sign Up
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;