import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EquipmentDetails from './pages/EquipmentDetails';
import Dashboard from './pages/Dashboard';
import AddEquipment from './pages/AddEquipment'; // 1. Import the real component

function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/equipment/:id" element={<EquipmentDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-equipment" element={<AddEquipment />} /> {/* 2. Active route */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;