const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(data));
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

const generateQRCodeText = (bookingId, tripId, userId) => {
  return `OTOBYSITE_BOOKING_${bookingId}_TRIP_${tripId}_USER_${userId}_${Date.now()}`;
};

module.exports = { generateQRCode, generateQRCodeText };