import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tripsAPI, bookingsAPI } from '../services/api';
import { 
  Bus, 
  Users, 
  QrCode, 
  Play, 
  Square, 
  CheckCircle, 
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';

const DriverPanel = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrCodeInput, setQrCodeInput] = useState('');

  useEffect(() => {
    fetchDriverTrips();
  }, []);

  const fetchDriverTrips = async () => {
    try {
      setLoading(true);
      const response = await tripsAPI.getByDriver(user._id);
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching driver trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTripBookings = async (tripId) => {
    try {
      const response = await bookingsAPI.getByTrip(tripId);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching trip bookings:', error);
    }
  };

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    fetchTripBookings(trip._id);
  };

  const handleQRCodeScan = async () => {
    if (!qrCodeInput.trim()) return;

    try {
      // Parse QR code data
      const qrData = JSON.parse(qrCodeInput);
      const bookingId = qrData.bookingId;

      // Update booking status to boarded
      await bookingsAPI.updateStatus(bookingId, 'boarded');
      
      // Refresh bookings
      if (selectedTrip) {
        fetchTripBookings(selectedTrip._id);
      }

      setQrCodeInput('');
      alert('تم تأكيد صعود الراكب بنجاح!');
    } catch (error) {
      alert('خطأ في قراءة QR Code أو تحديث الحالة');
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
        return 'bg-yellow-100 text-yellow-800';
      case 'boarded':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة السائق</h1>
        <p className="text-gray-600">مرحباً {user.name}، إدارة رحلاتك والركاب</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trips List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">رحلاتي</h2>
            
            {trips.length === 0 ? (
              <div className="text-center py-8">
                <Bus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">لا توجد رحلات مخصصة لك</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.map((trip) => (
                  <div
                    key={trip._id}
                    onClick={() => handleTripSelect(trip)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedTrip?._id === trip._id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {trip.from} → {trip.to}
                        </h3>
                        <p className="text-sm text-gray-600">{formatDate(trip.date)}</p>
                        <p className="text-sm text-gray-600">{trip.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trip.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                        trip.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.status === 'scheduled' ? 'مجدولة' :
                         trip.status === 'in-progress' ? 'قيد التنفيذ' :
                         'مكتملة'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trip Details and Passengers */}
        <div className="lg:col-span-2">
          {selectedTrip ? (
            <div className="space-y-6">
              {/* Trip Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedTrip.from} → {selectedTrip.to}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(selectedTrip.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{selectedTrip.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-primary inline-flex items-center">
                      <Play className="h-4 w-4 ml-2" />
                      بدء الرحلة
                    </button>
                    <button className="btn-secondary inline-flex items-center">
                      <Square className="h-4 w-4 ml-2" />
                      إنهاء الرحلة
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code Scanner */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">مسح QR Code</h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="أدخل أو امسح QR Code"
                    value={qrCodeInput}
                    onChange={(e) => setQrCodeInput(e.target.value)}
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleQRCodeScan}
                    className="btn-primary inline-flex items-center"
                  >
                    <QrCode className="h-4 w-4 ml-2" />
                    تأكيد
                  </button>
                </div>
              </div>

              {/* Passengers List */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">قائمة الركاب</h3>
                
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">لا يوجد ركاب محجوزين لهذه الرحلة</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-primary-600" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{booking.passengerName}</p>
                            <p className="text-sm text-gray-600">مقعد رقم {booking.seatNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                          {booking.status === 'confirmed' && (
                            <CheckCircle className="h-4 w-4 text-yellow-500" />
                          )}
                          {booking.status === 'boarded' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Bus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">اختر رحلة</h3>
              <p className="text-gray-600">اختر رحلة من القائمة لعرض تفاصيل الركاب</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverPanel;