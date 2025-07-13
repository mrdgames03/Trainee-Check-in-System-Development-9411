import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUserPlus, FiCamera, FiSettings, FiAward, FiUsers, FiShield, FiCheck } = FiIcons;

const HomePage = () => {
  const features = [
    {
      icon: FiUserPlus,
      title: 'Easy Registration',
      description: 'Quick and simple trainee registration with automatic QR card generation'
    },
    {
      icon: FiCamera,
      title: 'QR Check-in',
      description: 'Fast attendance tracking using QR code scanning technology'
    },
    {
      icon: FiAward,
      title: 'Reward System',
      description: 'Motivate trainees with points and rewards for consistent attendance'
    },
    {
      icon: FiUsers,
      title: 'Admin Dashboard',
      description: 'Comprehensive management tools for trainers and administrators'
    },
    {
      icon: FiShield,
      title: 'Behavior Management',
      description: 'Flag and track behavioral issues with point deduction system'
    },
    {
      icon: FiCheck,
      title: 'Digital Cards',
      description: 'Download and share digital trainee ID cards with QR codes'
    }
  ];

  const quickActions = [
    {
      title: 'Register New Trainee',
      description: 'Add a new trainee to the system',
      icon: FiUserPlus,
      link: '/register',
      color: 'primary'
    },
    {
      title: 'QR Check-in',
      description: 'Scan QR codes for attendance',
      icon: FiCamera,
      link: '/checkin',
      color: 'success'
    },
    {
      title: 'Admin Dashboard',
      description: 'Manage trainees and view reports',
      icon: FiSettings,
      link: '/admin',
      color: 'warning'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.div 
        className="text-center py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Maysalward Trainee
          <span className="text-primary-600"> Check-in System</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Streamline trainee registration, track attendance with QR codes, reward consistency, 
          and manage behavior - all in one comprehensive platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/register"
            className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiUserPlus} />
            <span>Register Trainee</span>
          </Link>
          <Link 
            to="/checkin"
            className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors inline-flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiCamera} />
            <span>Start Check-in</span>
          </Link>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="grid md:grid-cols-3 gap-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {quickActions.map((action, index) => (
          <Link
            key={action.title}
            to={action.link}
            className="group"
          >
            <motion.div 
              className={`bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all group-hover:scale-105`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                <SafeIcon icon={action.icon} className={`text-${action.color}-600 text-xl`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600">{action.description}</p>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Features Grid */}
      <div className="py-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage trainee registration, attendance, and behavior in one platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <SafeIcon icon={feature.icon} className="text-primary-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-12 text-center text-white"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of training centers using our system to streamline their operations
        </p>
        <Link 
          to="/register"
          className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiUserPlus} />
          <span>Register Your First Trainee</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default HomePage;