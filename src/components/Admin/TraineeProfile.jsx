import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { supabase } from '../../config/supabase';
import { downloadCard } from '../../utils/cardGenerator';

const { FiArrowLeft, FiUser, FiMail, FiPhone, FiCalendar, FiAward, FiFlag, FiDownload, FiClock, FiAlertTriangle } = FiIcons;

const TraineeProfile = ({ trainee, onBack, onUpdate }) => {
  const [checkins, setCheckins] = useState([]);
  const [flags, setFlags] = useState([]);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [pointsToDeduct, setPointsToDeduct] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTraineeDetails();
  }, [trainee.id]);

  const fetchTraineeDetails = async () => {
    try {
      setIsLoading(true);

      // Fetch check-ins
      const { data: checkinsData, error: checkinsError } = await supabase
        .from('checkins')
        .select('*')
        .eq('trainee_id', trainee.id)
        .order('checkin_time', { ascending: false });

      if (checkinsError) throw checkinsError;

      // Fetch flags
      const { data: flagsData, error: flagsError } = await supabase
        .from('flags')
        .select('*')
        .eq('trainee_id', trainee.id)
        .order('created_at', { ascending: false });

      if (flagsError) throw flagsError;

      setCheckins(checkinsData || []);
      setFlags(flagsData || []);
    } catch (error) {
      console.error('Error fetching trainee details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCard = async () => {
    try {
      if (trainee.card_image_url) {
        // Download from Supabase storage
        const response = await fetch(trainee.card_image_url);
        const blob = await response.blob();
        downloadCard(blob, `${trainee.serial_number}-card.png`);
      } else {
        alert('Card image not available');
      }
    } catch (error) {
      console.error('Error downloading card:', error);
      alert('Failed to download card');
    }
  };

  const handleFlagTrainee = async () => {
    if (!flagReason.trim()) {
      alert('Please provide a reason for flagging');
      return;
    }

    try {
      // Add flag
      const { error: flagError } = await supabase
        .from('flags')
        .insert([{
          trainee_id: trainee.id,
          reason: flagReason,
          points_deducted: pointsToDeduct
        }]);

      if (flagError) throw flagError;

      // Update trainee points if deducting
      if (pointsToDeduct > 0) {
        const newPoints = Math.max(0, (trainee.reward_points || 0) - pointsToDeduct);
        const { error: updateError } = await supabase
          .from('trainees')
          .update({ reward_points: newPoints })
          .eq('id', trainee.id);

        if (updateError) throw updateError;
      }

      setShowFlagModal(false);
      setFlagReason('');
      setPointsToDeduct(0);
      fetchTraineeDetails();
      onUpdate();
    } catch (error) {
      console.error('Error flagging trainee:', error);
      alert('Failed to flag trainee');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex space-x-3">
          <button
            onClick={handleDownloadCard}
            className="flex items-center space-x-2 bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors"
          >
            <SafeIcon icon={FiDownload} />
            <span>Download Card</span>
          </button>
          <button
            onClick={() => setShowFlagModal(true)}
            className="flex items-center space-x-2 bg-warning-600 text-white px-4 py-2 rounded-lg hover:bg-warning-700 transition-colors"
          >
            <SafeIcon icon={FiFlag} />
            <span>Flag Trainee</span>
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <motion.div 
        className="bg-white rounded-2xl shadow-card p-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiUser} className="text-primary-600 text-3xl" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{trainee.full_name}</h1>
            <p className="text-lg text-gray-600 mb-4">{trainee.serial_number}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <SafeIcon icon={FiMail} />
                <span>{trainee.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <SafeIcon icon={FiPhone} />
                <span>{trainee.phone_number}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <SafeIcon icon={FiCalendar} />
                <span>{new Date(trainee.date_of_birth).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-success-600">
                <SafeIcon icon={FiAward} />
                <span>{trainee.reward_points || 0} Points</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                {trainee.education_level}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Check-ins History */}
        <motion.div 
          className="bg-white rounded-2xl shadow-card p-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiClock} className="mr-2 text-primary-600" />
            Check-ins History ({checkins.length})
          </h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {checkins.length > 0 ? (
              checkins.map((checkin) => (
                <div key={checkin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(checkin.checkin_time).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(checkin.checkin_time).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center text-success-600">
                    <SafeIcon icon={FiAward} className="mr-1" />
                    <span>+{checkin.points_awarded} pts</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiClock} className="text-3xl mb-2" />
                <p>No check-ins recorded</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Flags History */}
        <motion.div 
          className="bg-white rounded-2xl shadow-card p-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiFlag} className="mr-2 text-warning-600" />
            Flags History ({flags.length})
          </h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {flags.length > 0 ? (
              flags.map((flag) => (
                <div key={flag.id} className="p-3 border border-warning-200 bg-warning-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-warning-800 mb-1">{flag.reason}</p>
                      <p className="text-sm text-warning-600">
                        {new Date(flag.created_at).toLocaleDateString()} at{' '}
                        {new Date(flag.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    {flag.points_deducted > 0 && (
                      <div className="flex items-center text-danger-600">
                        <SafeIcon icon={FiAlertTriangle} className="mr-1" />
                        <span>-{flag.points_deducted} pts</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiFlag} className="text-3xl mb-2" />
                <p>No flags recorded</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Flag Trainee</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for flagging
                </label>
                <textarea
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                  placeholder="Describe the issue..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points to deduct (optional)
                </label>
                <input
                  type="number"
                  value={pointsToDeduct}
                  onChange={(e) => setPointsToDeduct(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                  max={trainee.reward_points || 0}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowFlagModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFlagTrainee}
                className="flex-1 bg-warning-600 text-white py-2 px-4 rounded-lg hover:bg-warning-700 transition-colors"
              >
                Flag Trainee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraineeProfile;