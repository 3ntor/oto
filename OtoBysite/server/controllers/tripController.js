const Trip = require('../models/Trip');
const Booking = require('../models/Booking');

// @desc    Get all trips
// @route   GET /api/trips
// @access  Public
const getTrips = async (req, res) => {
  try {
    const { from, to, date, status } = req.query;
    let filter = {};

    if (from) filter.from = { $regex: from, $options: 'i' };
    if (to) filter.to = { $regex: to, $options: 'i' };
    if (date) filter.date = { $gte: new Date(date) };
    if (status) filter.status = status;

    const trips = await Trip.find(filter)
      .populate('driver', 'name email phone')
      .sort({ date: 1, time: 1 });

    res.json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get trip by ID
// @route   GET /api/trips/:id
// @access  Public
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('driver', 'name email phone');

    if (trip) {
      res.json(trip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    console.error('Get trip by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a trip
// @route   POST /api/trips
// @access  Private/Admin
const createTrip = async (req, res) => {
  try {
    const { from, to, date, time, price, totalSeats, driver, description } = req.body;

    const trip = await Trip.create({
      from,
      to,
      date,
      time,
      price,
      totalSeats,
      driver,
      description
    });

    const populatedTrip = await Trip.findById(trip._id)
      .populate('driver', 'name email phone');

    res.status(201).json(populatedTrip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private/Admin
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
      trip.from = req.body.from || trip.from;
      trip.to = req.body.to || trip.to;
      trip.date = req.body.date || trip.date;
      trip.time = req.body.time || trip.time;
      trip.price = req.body.price || trip.price;
      trip.totalSeats = req.body.totalSeats || trip.totalSeats;
      trip.driver = req.body.driver || trip.driver;
      trip.status = req.body.status || trip.status;
      trip.description = req.body.description || trip.description;

      const updatedTrip = await trip.save();
      const populatedTrip = await Trip.findById(updatedTrip._id)
        .populate('driver', 'name email phone');

      res.json(populatedTrip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private/Admin
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
      // Check if there are any bookings for this trip
      const bookings = await Booking.find({ trip: trip._id });
      if (bookings.length > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete trip with existing bookings' 
        });
      }

      await trip.remove();
      res.json({ message: 'Trip removed' });
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get trips by driver
// @route   GET /api/trips/driver/:driverId
// @access  Private/Driver
const getTripsByDriver = async (req, res) => {
  try {
    const trips = await Trip.find({ driver: req.params.driverId })
      .populate('driver', 'name email phone')
      .sort({ date: 1, time: 1 });

    res.json(trips);
  } catch (error) {
    console.error('Get trips by driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripsByDriver,
};