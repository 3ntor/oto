const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getMyBookings, 
  getBookingById, 
  getBookingsByTrip, 
  updateBookingStatus, 
  cancelBooking, 
  getAllBookings 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Passenger routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.delete('/:id', protect, cancelBooking);

// Driver routes
router.get('/trip/:tripId', protect, authorize('driver', 'admin'), getBookingsByTrip);
router.put('/:id/status', protect, authorize('driver', 'admin'), updateBookingStatus);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);

module.exports = router;