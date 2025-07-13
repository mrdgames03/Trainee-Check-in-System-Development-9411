import QRCode from 'qrcode';

export const generateQRCode = async (data) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const generateSecureToken = () => {
  return 'TCH-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const generateSerialNumber = (count) => {
  return `TCH-${String(count + 1).padStart(4, '0')}`;
};