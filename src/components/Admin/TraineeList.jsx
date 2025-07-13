import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUser, FiAward, FiCalendar, FiMail, FiPhone, FiLoader } = FiIcons;

const TraineeList = ({ trainees, isLoading, onSelectTrainee }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <SafeIcon icon={FiLoader} className="animate-spin text-4xl text-primary-600 mb-4" />
        <p className="text-gray-600">Loading trainees...</p>
      </div>
    );
  }

  if (trainees.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <SafeIcon icon={FiUser} className="text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600">No trainees found</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-card p-6"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Trainees ({trainees.length})</h2>
      
      <div className="grid gap-4">
        {trainees.map((trainee, index) => (
          <motion.div
            key={trainee.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onSelectTrainee(trainee)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="text-primary-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{trainee.full_name}</h3>
                  <p className="text-sm text-gray-500">{trainee.serial_number}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <SafeIcon icon={FiMail} className="mr-1" />
                      {trainee.email}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <SafeIcon icon={FiPhone} className="mr-1" />
                      {trainee.phone_number}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-success-600 mb-1">
                  <SafeIcon icon={FiAward} className="mr-1" />
                  <span>{trainee.reward_points || 0} points</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <SafeIcon icon={FiCalendar} className="mr-1" />
                  <span>{new Date(trainee.created_at).toLocaleDateString()}</span>
                </div>
                <div className="mt-1">
                  <span className="inline-block px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
                    {trainee.education_level}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TraineeList;