import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { supabase } from '../../config/supabase';
import TraineeList from './TraineeList';
import TraineeProfile from './TraineeProfile';

const { FiUsers, FiAward, FiTrendingUp, FiCalendar, FiSearch, FiFilter } = FiIcons;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTrainees: 0,
    totalCheckins: 0,
    totalPoints: 0,
    todayCheckins: 0
  });
  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [educationFilter, setEducationFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    filterTrainees();
  }, [trainees, searchTerm, educationFilter]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch trainees
      const { data: traineesData, error: traineesError } = await supabase
        .from('trainees')
        .select('*')
        .order('created_at', { ascending: false });

      if (traineesError) throw traineesError;

      // Fetch check-ins
      const { data: checkinsData, error: checkinsError } = await supabase
        .from('checkins')
        .select('*');

      if (checkinsError) throw checkinsError;

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayCheckins = checkinsData.filter(checkin => 
        checkin.checkin_time.startsWith(today)
      ).length;

      const totalPoints = traineesData.reduce((sum, trainee) => 
        sum + (trainee.reward_points || 0), 0
      );

      setStats({
        totalTrainees: traineesData.length,
        totalCheckins: checkinsData.length,
        totalPoints,
        todayCheckins
      });

      setTrainees(traineesData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTrainees = () => {
    let filtered = trainees;

    if (searchTerm) {
      filtered = filtered.filter(trainee =>
        trainee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (educationFilter) {
      filtered = filtered.filter(trainee =>
        trainee.education_level === educationFilter
      );
    }

    setFilteredTrainees(filtered);
  };

  const educationLevels = ['High School', 'Associate Degree', 'Bachelor Degree', 'Master Degree', 'PhD', 'Other'];

  if (selectedTrainee) {
    return (
      <TraineeProfile 
        trainee={selectedTrainee} 
        onBack={() => setSelectedTrainee(null)}
        onUpdate={fetchDashboardData}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage trainees, track attendance, and monitor performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Trainees', value: stats.totalTrainees, icon: FiUsers, color: 'primary' },
          { title: 'Total Check-ins', value: stats.totalCheckins, icon: FiCalendar, color: 'success' },
          { title: 'Today\'s Check-ins', value: stats.todayCheckins, icon: FiTrendingUp, color: 'warning' },
          { title: 'Total Points', value: stats.totalPoints, icon: FiAward, color: 'primary' },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-2xl shadow-card p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className={`text-${stat.color}-600 text-xl`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div 
        className="bg-white rounded-2xl shadow-card p-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search trainees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-64">
            <div className="relative">
              <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={educationFilter}
                onChange={(e) => setEducationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                <option value="">All Education Levels</option>
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trainees List */}
      <TraineeList 
        trainees={filteredTrainees}
        isLoading={isLoading}
        onSelectTrainee={setSelectedTrainee}
      />
    </div>
  );
};

export default AdminDashboard;