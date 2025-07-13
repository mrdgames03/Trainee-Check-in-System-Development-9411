import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import QrScanner from 'qr-scanner';
import { supabase } from '../../config/supabase';

const { FiCamera, FiCheck, FiX, FiAward, FiUser, FiClock } = FiIcons;

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [recentCheckins, setRecentCheckins] = useState([]);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    fetchRecentCheckins();
  }, []);

  const fetchRecentCheckins = async () => {
    try {
      const { data, error } = await supabase
        .from('checkins')
        .select(`
          *,
          trainees (
            full_name,
            serial_number,
            reward_points
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentCheckins(data || []);
    } catch (error) {
      console.error('Error fetching recent check-ins:', error);
    }
  };

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setError('');
      setScanResult(null);

      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }

      const qrScanner = new QrScanner(
        videoRef.current,
        async (result) => {
          await handleScanResult(result.data);
          stopScanning();
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      qrScannerRef.current = qrScanner;
      await qrScanner.start();
    } catch (error) {
      console.error('Error starting scanner:', error);
      setError('Camera access denied or not available');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanResult = async (qrData) => {
    try {
      setError('');

      // Find trainee by QR token
      const { data: trainee, error: findError } = await supabase
        .from('trainees')
        .select('*')
        .eq('qr_token', qrData)
        .single();

      if (findError || !trainee) {
        setError('Invalid QR code or trainee not found');
        return;
      }

      // Check if already checked in today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingCheckin } = await supabase
        .from('checkins')
        .select('*')
        .eq('trainee_id', trainee.id)
        .gte('checkin_time', `${today}T00:00:00`)
        .lt('checkin_time', `${today}T23:59:59`)
        .single();

      if (existingCheckin) {
        setError('Trainee has already checked in today');
        return;
      }

      // Record check-in
      const { error: checkinError } = await supabase
        .from('checkins')
        .insert([{
          trainee_id: trainee.id,
          points_awarded: 1
        }]);

      if (checkinError) throw checkinError;

      // Update trainee points
      const { error: updateError } = await supabase
        .from('trainees')
        .update({ 
          reward_points: (trainee.reward_points || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', trainee.id);

      if (updateError) throw updateError;

      setScanResult({
        ...trainee,
        reward_points: (trainee.reward_points || 0) + 1
      });

      // Refresh recent check-ins
      fetchRecentCheckins();

    } catch (error) {
      console.error('Check-in error:', error);
      setError('Failed to process check-in. Please try again.');
    }
  };

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Check-in</h1>
        <p className="text-gray-600">Scan trainee QR codes to record attendance and award points</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Scanner Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-card p-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiCamera} className="mr-2 text-primary-600" />
            QR Scanner
          </h2>

          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {scanResult && (
            <motion.div 
              className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <SafeIcon icon={FiCheck} className="text-success-600 mr-2" />
                <span className="font-semibold text-success-800">Check-in Successful!</span>
              </div>
              <div className="text-sm text-success-700">
                <p><strong>{scanResult.full_name}</strong></p>
                <p>Serial: {scanResult.serial_number}</p>
                <p>Points: {scanResult.reward_points}</p>
              </div>
            </motion.div>
          )}

          <div className="relative">
            <video
              ref={videoRef}
              className={`w-full h-64 bg-gray-100 rounded-lg object-cover ${!isScanning ? 'hidden' : ''}`}
            />
            {!isScanning && (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <SafeIcon icon={FiCamera} className="text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-500">Camera preview will appear here</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            {!isScanning ? (
              <button
                onClick={startScanning}
                className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiCamera} />
                <span>Start Scanning</span>
              </button>
            ) : (
              <button
                onClick={stopScanning}
                className="flex-1 bg-danger-600 text-white py-3 px-4 rounded-lg hover:bg-danger-700 transition-colors flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiX} />
                <span>Stop Scanning</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Recent Check-ins */}
        <motion.div 
          className="bg-white rounded-2xl shadow-card p-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiClock} className="mr-2 text-primary-600" />
            Recent Check-ins
          </h2>

          <div className="space-y-3">
            {recentCheckins.length > 0 ? (
              recentCheckins.map((checkin) => (
                <div key={checkin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{checkin.trainees.full_name}</p>
                      <p className="text-sm text-gray-500">{checkin.trainees.serial_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-success-600">
                      <SafeIcon icon={FiAward} className="mr-1" />
                      <span>{checkin.trainees.reward_points} pts</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(checkin.checkin_time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiClock} className="text-3xl mb-2" />
                <p>No recent check-ins</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QRScanner;