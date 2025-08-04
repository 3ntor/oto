import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripsAPI } from '../services/api';
import { Calendar, Clock, MapPin, Users, DollarSign, ArrowLeft, User } from 'lucide-react';

const TripDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const response = await tripsAPI.getById(id);
      setTrip(response.data);
    } catch (error) {
      console.error('Error fetching trip details:', error);
    } finally {
      setLoading(false);
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
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
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
      case 'scheduled':
        return 'مجدولة';
      case 'in-progress':
        return 'قيد التنفيذ';
      case 'completed':
        return 'مكتملة';
      case 'cancelled':
        return 'ملغية';
      default:
        return status;
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">الرحلة غير موجودة</h3>
        <Link to="/trips" className="btn-primary mt-4 inline-block">
          العودة للرحلات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/trips"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 ml-2" />
        العودة للرحلات
      </Link>

      {/* Trip Details */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {trip.from} → {trip.to}
              </h1>
              <p className="text-primary-100">
                رحلة مريحة وآمنة مع أفضل الخدمات
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
              {getStatusText(trip.status)}
            </span>
          </div>
        </div>

        {/* Trip Information */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">التاريخ</p>
                  <p className="font-medium">{formatDate(trip.date)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">الوقت</p>
                  <p className="font-medium">{trip.time}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">المسار</p>
                  <p className="font-medium">{trip.from} - {trip.to}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">المقاعد المتاحة</p>
                  <p className="font-medium">{trip.availableSeats} / {trip.totalSeats}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">السعر</p>
                  <p className="font-medium text-lg text-primary-600">{trip.price} ريال</p>
                </div>
              </div>

              {trip.driver && (
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">السائق</p>
                    <p className="font-medium">{trip.driver.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {trip.description && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">تفاصيل الرحلة</h3>
              <p className="text-gray-600">{trip.description}</p>
            </div>
          )}

          {/* Booking Section */}
          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold mb-2">احجز مقعدك الآن</h3>
                <p className="text-gray-600">
                  {trip.availableSeats > 0 
                    ? `${trip.availableSeats} مقعد متاح`
                    : 'لا توجد مقاعد متاحة'
                  }
                </p>
              </div>

              <div className="flex space-x-3">
                {trip.status === 'scheduled' && trip.availableSeats > 0 ? (
                  <button
                    onClick={handleBookNow}
                    className="btn-primary px-8 py-3 text-lg"
                  >
                    احجز الآن
                  </button>
                ) : (
                  <button
                    disabled
                    className="btn-secondary px-8 py-3 text-lg opacity-50 cursor-not-allowed"
                  >
                    {trip.status === 'scheduled' ? 'لا توجد مقاعد متاحة' : 'الحجز غير متاح'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;