import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';

// Pages
import Home from '../pages/Home';
import Trips from '../pages/Trips';
import TripDetail from '../pages/TripDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyBookings from '../pages/MyBookings';
import QRCodePage from '../pages/QRCodePage';
import AdminDashboard from '../pages/AdminDashboard';
import DriverPanel from '../pages/DriverPanel';
import BookingForm from '../pages/BookingForm';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="trips" element={<Trips />} />
        <Route path="trips/:id" element={<TripDetail />} />
        <Route path="login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } />
        <Route path="register" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Register />
        } />
        
        {/* Protected Routes */}
        <Route path="my-bookings" element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } />
        
        <Route path="booking/:tripId" element={
          <ProtectedRoute allowedRoles={['passenger']}>
            <BookingForm />
          </ProtectedRoute>
        } />
        
        <Route path="qr-code/:bookingId" element={
          <ProtectedRoute>
            <QRCodePage />
          </ProtectedRoute>
        } />
        
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="driver" element={
          <ProtectedRoute allowedRoles={['driver']}>
            <DriverPanel />
          </ProtectedRoute>
        } />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;