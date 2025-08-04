const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const User = require('../models/User');
const { generateQRCode, generateQRCodeText } = require('../utils/qrCode');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { tripId, passengerName, passengerPhone, seatNumber } = req.body;

    // Check if trip exists and has available seats
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.availableSeats <= 0) {
      return res.status(400).json({ message: 'No available seats' });
    }

    // Check if seat is already taken
    const existingBooking = await Booking.findOne({ 
      trip: tripId, 
      seatNumber: seatNumber 
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'Seat already taken' });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      trip: tripId,
      passengerName,
      passengerPhone,
      seatNumber,
      totalPrice: trip.price
    });

    // Update available seats
    trip.availableSeats -= 1;
    await trip.save();

    // Generate QR code
    const qrCodeData = {
      bookingId: booking._id,
      tripId: trip._id,
      userId: req.user._id,
      passengerName,
      seatNumber
    };

    const qrCode = await generateQRCode(qrCodeData);

    const populatedBooking = await Booking.findById(booking._id)
      .populate('trip')
      .populate('user', 'name email');

    res.status(201).json({
      ...populatedBooking.toObject(),
      qrCode
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('trip')
      .sort({ bookingDate: -1 });

    // Generate QR codes for each booking
    const bookingsWithQR = await Promise.all(
      bookings.map(async (booking) => {
        const qrCodeData = {
          bookingId: booking._id,
          tripId: booking.trip._id,
          userId: booking.user,
          passengerName: booking.passengerName,
          seatNumber: booking.seatNumber
        };
        const qrCode = await generateQRCode(qrCodeData);
        return {
          ...booking.toObject(),
          qrCode
        };
      })
    );

    res.json(bookingsWithQR);
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('trip')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const qrCodeData = {
      bookingId: booking._id,
      tripId: booking.trip._id,
      userId: booking.user._id,
      passengerName: booking.passengerName,
      seatNumber: booking.seatNumber
    };
    const qrCode = await generateQRCode(qrCodeData);

    res.json({
      ...booking.toObject(),
      qrCode
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get bookings for a trip (driver/admin)
// @route   GET /api/bookings/trip/:tripId
// @access  Private/Driver/Admin
const getBookingsByTrip = async (req, res) => {
  try {
    const bookings = await Booking.find({ trip: req.params.tripId })
      .populate('user', 'name email phone')
      .populate('trip')
      .sort({ seatNumber: 1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings by trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status (board passenger)
// @route   PUT /api/bookings/:id/status
// @access  Private/Driver
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    if (status === 'boarded') {
      booking.boardingTime = new Date();
    }

    const updatedBooking = await booking.save();
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('trip')
      .populate('user', 'name email');

    res.json(populatedBooking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to cancel this booking
    if (booking.user.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update trip available seats
    const trip = await Trip.findById(booking.trip);
    if (trip) {
      trip.availableSeats += 1;
      await trip.save();
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('trip')
      .populate('user', 'name email')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getBookingsByTrip,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
};