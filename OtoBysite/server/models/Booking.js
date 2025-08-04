const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: [true, 'Trip is required']
  },
  seatNumber: {
    type: Number,
    required: [true, 'Seat number is required']
  },
  qrCode: {
    type: String,
    required: [true, 'QR code is required'],
    unique: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'boarded', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  passengerName: {
    type: String,
    required: [true, 'Passenger name is required']
  },
  passengerPhone: {
    type: String,
    required: [true, 'Passenger phone is required']
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  boardingTime: {
    type: Date
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required']
  }
}, {
  timestamps: true
});

// Generate unique QR code
bookingSchema.pre('save', function(next) {
  if (this.isNew) {
    this.qrCode = `OTOBYSITE_${this._id}_${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);