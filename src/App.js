import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home.js";
import FilteredAnimals from "./pages/FilteredAnimals.js";
import AnimalDetail from "./pages/AnimalDetail.js";
import Contact from "./pages/Contact.js";
import AddAnimal from "./pages/AddAnimal.js";
import Statistics from "./pages/Statistics.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import axios from "axios";
import Shelters from "./pages/Shelters.js";
import { jwtDecode } from 'jwt-decode'; 
import MonitoredUsers from "./pages/MonitoredUsers.js";
import api from './api/config';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const response = await api.get("/animals");
      setAnimals(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching animals:", error);
      setError("Failed to fetch animals. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const LayoutWrapper = ({ children }) => {
    const location = useLocation();
    
    if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register') {
      return <Navigate to="/login" />;
    }

    return isAuthenticated ? (
      <div className="flex h-screen">
        <NavSidebar handleLogout={handleLogout} user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="w-3/4 p-4 ml-[25%]">
          {children}
        </div>
      </div>
    ) : (
      <div className="h-screen">
        {children}
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" /> : <Register onLogin={handleLogin} />
        } />
        <Route path="/" element={
          <LayoutWrapper>
            <Home searchTerm={searchTerm} animals={animals} />
          </LayoutWrapper>
        } />
        <Route path="/filter/:type" element={
          <LayoutWrapper>
            <FilteredAnimals searchTerm={searchTerm} animals={animals} />
          </LayoutWrapper>
        } />
        <Route path="/animal/:id" element={
          <LayoutWrapper>
            <AnimalDetail animals={animals} setAnimals={setAnimals} user={user} />
          </LayoutWrapper>
        } />
        <Route path="/shelters" element={
          <LayoutWrapper>
            <Shelters user={user} />
          </LayoutWrapper>
        } />
        <Route path="/contact" element={
          <LayoutWrapper>
            <Contact />
          </LayoutWrapper>
        } />
        <Route path="/admin/monitored-users" element={<MonitoredUsers />} />
        <Route path="/add" element={
          <LayoutWrapper>
            <AddAnimal setAnimals={setAnimals} user={user} />
          </LayoutWrapper>
        } />
        <Route path="/statistics" element={
          <LayoutWrapper>
            <Statistics user={user} />
          </LayoutWrapper>
        } />
      </Routes>
    </Router>
  );
}

function NavSidebar({ handleLogout, user, searchTerm, setSearchTerm }) {
  return (
    <nav className="w-1/4 p-4 bg-gray-100 h-screen flex flex-col justify-center items-center space-y-4 fixed left-0 top-0">
      <div className="text-center mb-4">
        <p className="font-semibold">Welcome, {user?.username}</p>
        {user?.role === 'admin' && <span className="text-sm text-red-600">(Admin)</span>}
      </div>
      
      <input
        type="text"
        placeholder="Search animals..."
        className="p-2 rounded border mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <Link to="/" className="bg-gray-500 text-black text-center p-2 rounded w-full">Home</Link>
      <Link to="/filter/dog" className="bg-gray-500 text-black text-center p-2 rounded w-full">Dogs</Link>
      <Link to="/filter/cat" className="bg-gray-500 text-black text-center p-2 rounded w-full">Cats</Link>
      <Link to="/filter/other" className="bg-gray-500 text-black text-center p-2 rounded w-full">Others</Link>
      <Link to="/shelters" className="bg-gray-500 text-black text-center p-2 rounded w-full">Shelters</Link>
      
      {user?.role === 'admin' && (
        <Link to="/admin/monitored-users" className="bg-gray-500 text-black text-center p-2 rounded w-full">
          Monitored Users
        </Link>
      )}
      
      <Link to="/add" className="bg-gray-500 text-white text-center p-2 rounded w-full">Put Animal for Adoption</Link>
      <Link to="/contact" className="bg-gray-500 text-black text-center p-2 rounded w-full">Contact</Link>
      <Link to="/statistics" className="bg-gray-500 text-black text-center p-2 rounded w-full">Statistics</Link>
      
      <button 
        onClick={handleLogout}
        className="bg-gray-500 text-white p-2 rounded w-full mt-4"
      >
        Logout
      </button>
    </nav>
  );
}

export default App;