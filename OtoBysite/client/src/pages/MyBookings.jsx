import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { Calendar, Clock, MapPin, Users, DollarSign, QrCode, Eye, X } from 'lucide-react';
import QRCode from 'react-qr-code';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) {
      try {
        await bookingsAPI.cancel(bookingId);
        fetchBookings(); // Refresh the list
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'boarded':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'مؤكد';
      case 'boarded':
        return 'صعد للباص';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          حجوزاتي
        </h1>
        <p className="text-lg text-gray-600">
          عرض وإدارة جميع حجوزاتك
        </p>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد حجوزات</h3>
          <p className="mt-1 text-sm text-gray-500">
            لم تقم بحجز أي رحلات بعد.
          </p>
          <Link to="/trips" className="btn-primary mt-4 inline-block">
            استكشف الرحلات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {booking.trip.from} → {booking.trip.to}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(booking.trip.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{booking.trip.time}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">اسم الراكب</span>
                  <span className="text-sm font-medium">{booking.passengerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">رقم المقعد</span>
                  <span className="text-sm font-medium">{booking.seatNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">السعر</span>
                  <span className="text-sm font-medium text-primary-600">{booking.totalPrice} ريال</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">تاريخ الحجز</span>
                  <span className="text-sm font-medium">{formatDate(booking.bookingDate)}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowQR(true);
                  }}
                  className="btn-primary flex-1 inline-flex items-center justify-center"
                >
                  <QrCode className="h-4 w-4 ml-2" />
                  عرض QR
                </button>
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="btn-danger px-4 py-2 text-sm"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">QR Code للحجز</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border mb-4">
                <QRCode
                  value={JSON.stringify({
                    bookingId: selectedBooking._id,
                    tripId: selectedBooking.trip._id,
                    passengerName: selectedBooking.passengerName,
                    seatNumber: selectedBooking.seatNumber
                  })}
                  size={200}
                  level="H"
                />
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>الراكب:</strong> {selectedBooking.passengerName}</p>
                <p><strong>المقعد:</strong> {selectedBooking.seatNumber}</p>
                <p><strong>المسار:</strong> {selectedBooking.trip.from} → {selectedBooking.trip.to}</p>
                <p><strong>التاريخ:</strong> {formatDate(selectedBooking.trip.date)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;