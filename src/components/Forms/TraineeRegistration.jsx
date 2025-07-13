import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { supabase } from '../../config/supabase';
import { generateSecureToken, generateSerialNumber } from '../../utils/qrUtils';
import { generateTraineeCard } from '../../utils/cardGenerator';

const { FiUser, FiMail, FiPhone, FiCalendar, FiCreditCard, FiBookOpen, FiCheck, FiLoader } = FiIcons;

const TraineeRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    idCardNumber: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    educationLevel: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const educationLevels = [
    'High School',
    'Associate Degree',
    'Bachelor Degree',
    'Master Degree',
    'PhD',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Generate unique identifiers
      const qrToken = generateSecureToken();
      
      // Get current trainee count for serial number
      const { count } = await supabase
        .from('trainees')
        .select('*', { count: 'exact', head: true });
      
      const serialNumber = generateSerialNumber(count || 0);

      // Prepare trainee data
      const traineeData = {
        serial_number: serialNumber,
        full_name: formData.fullName,
        id_card_number: formData.idCardNumber,
        phone_number: formData.phoneNumber,
        email: formData.email,
        date_of_birth: formData.dateOfBirth,
        education_level: formData.educationLevel,
        qr_token: qrToken,
        reward_points: 0
      };

      // Insert trainee into database
      const { data: trainee, error: insertError } = await supabase
        .from('trainees')
        .insert([traineeData])
        .select()
        .single();

      if (insertError) throw insertError;

      // Generate and upload trainee card
      const cardBlob = await generateTraineeCard(trainee);
      const cardFileName = `trainee-cards/${trainee.id}.png`;
      
      const { error: uploadError } = await supabase.storage
        .from('trainee-cards')
        .upload(cardFileName, cardBlob);

      if (uploadError) throw uploadError;

      // Get public URL for the card
      const { data: { publicUrl } } = supabase.storage
        .from('trainee-cards')
        .getPublicUrl(cardFileName);

      // Update trainee with card URL
      await supabase
        .from('trainees')
        .update({ card_image_url: publicUrl })
        .eq('id', trainee.id);

      setIsSuccess(true);
      setFormData({
        fullName: '',
        idCardNumber: '',
        phoneNumber: '',
        email: '',
        dateOfBirth: '',
        educationLevel: ''
      });

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        className="max-w-md mx-auto bg-white rounded-2xl shadow-card p-8 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiCheck} className="text-success-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your trainee card has been generated and will be sent to your email shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Register Another Trainee
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-card p-8"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trainee Registration</h1>
        <p className="text-gray-600">Fill in the details to register a new trainee</p>
      </div>

      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SafeIcon icon={FiUser} className="inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SafeIcon icon={FiCreditCard} className="inline mr-2" />
              ID Card Number
            </label>
            <input
              type="text"
              name="idCardNumber"
              value={formData.idCardNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Enter ID card number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SafeIcon icon={FiPhone} className="inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SafeIcon icon={FiMail} className="inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SafeIcon icon={FiCalendar} className="inline mr-2" />
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SafeIcon icon={FiBookOpen} className="inline mr-2" />
              Education Level
            </label>
            <select
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="">Select education level</option>
              {educationLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <SafeIcon icon={FiLoader} className="animate-spin" />
              <span>Registering...</span>
            </>
          ) : (
            <span>Register Trainee</span>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default TraineeRegistration;