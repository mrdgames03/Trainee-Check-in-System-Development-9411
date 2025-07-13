import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { supabase } from '../../config/supabase';

const { FiUser, FiLogOut, FiHome, FiUserPlus, FiCamera, FiSettings } = FiIcons;

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    navigate('/');
  };

  return (
    <motion.header 
      className="bg-white shadow-lg border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
              <SafeIcon icon={FiHome} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Maysalward</h1>
              <p className="text-xs text-gray-500">Trainee Check-in System</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/register" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <SafeIcon icon={FiUserPlus} className="text-lg" />
              <span>Register</span>
            </Link>
            <Link 
              to="/checkin" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <SafeIcon icon={FiCamera} className="text-lg" />
              <span>Check-in</span>
            </Link>
            {user && (
              <Link 
                to="/admin" 
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <SafeIcon icon={FiSettings} className="text-lg" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiUser} className="text-primary-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <SafeIcon icon={FiLogOut} className="text-lg" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;