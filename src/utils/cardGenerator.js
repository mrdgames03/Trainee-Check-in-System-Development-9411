import html2canvas from 'html2canvas';
import { generateQRCode } from './qrUtils';

export const generateTraineeCard = async (traineeData) => {
  try {
    // Create a temporary div for the card
    const cardDiv = document.createElement('div');
    cardDiv.style.position = 'absolute';
    cardDiv.style.left = '-9999px';
    cardDiv.style.width = '400px';
    cardDiv.style.height = '250px';
    cardDiv.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    cardDiv.style.borderRadius = '16px';
    cardDiv.style.padding = '20px';
    cardDiv.style.color = 'white';
    cardDiv.style.fontFamily = 'Arial, sans-serif';
    cardDiv.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';

    // Generate QR code
    const qrCodeDataURL = await generateQRCode(traineeData.qr_token);

    cardDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; height: 100%;">
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
          <div>
            <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">Maysalward Training</h2>
            <div style="width: 40px; height: 3px; background: rgba(255,255,255,0.8); margin-bottom: 16px;"></div>
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: bold;">${traineeData.full_name}</h3>
            <p style="margin: 0 0 2px 0; font-size: 12px; opacity: 0.9;">ID: ${traineeData.serial_number}</p>
            <p style="margin: 0 0 2px 0; font-size: 12px; opacity: 0.9;">Education: ${traineeData.education_level}</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 10px; opacity: 0.8;">Scan QR code to check-in</p>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center;">
          <img src="${qrCodeDataURL}" style="width: 80px; height: 80px; background: white; padding: 8px; border-radius: 8px;" />
          <p style="margin: 8px 0 0 0; font-size: 10px; opacity: 0.8; text-align: center;">Points: ${traineeData.reward_points || 0}</p>
        </div>
      </div>
    `;

    document.body.appendChild(cardDiv);

    // Generate canvas from the card
    const canvas = await html2canvas(cardDiv, {
      backgroundColor: null,
      scale: 2,
      useCORS: true
    });

    document.body.removeChild(cardDiv);

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', 1.0);
    });
  } catch (error) {
    console.error('Error generating trainee card:', error);
    throw error;
  }
};

export const downloadCard = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};