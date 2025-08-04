const express = require('express');
const router = express.Router();
const { 
  getTrips, 
  getTripById, 
  createTrip, 
  updateTrip, 
  deleteTrip, 
  getTripsByDriver 
} = require('../controllers/tripController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Public routes
router.get('/', getTrips);
router.get('/:id', getTripById);

// Protected routes
router.post('/', protect, authorize('admin'), createTrip);
router.put('/:id', protect, authorize('admin'), updateTrip);
router.delete('/:id', protect, authorize('admin'), deleteTrip);

// Driver routes
router.get('/driver/:driverId', protect, authorize('driver', 'admin'), getTripsByDriver);

module.exports = router;