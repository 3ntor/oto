import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripsAPI, bookingsAPI } from '../services/api';
import { Calendar, Clock, MapPin, Users, DollarSign, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingForm = () => {
  const { tripId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    passengerName: user?.name || '',
    passengerPhone: user?.phone || '',
    seatNumber: ''
  });

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const response = await tripsAPI.getById(tripId);
      setTrip(response.data);
    } catch (error) {
      console.error('Error fetching trip details:', error);
      toast.error('حدث خطأ في تحميل تفاصيل الرحلة');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const bookingData = {
        tripId,
        passengerName: formData.passengerName,
        passengerPhone: formData.passengerPhone,
        seatNumber: parseInt(formData.seatNumber)
      };

      const response = await bookingsAPI.create(bookingData);
      toast.success('تم الحجز بنجاح!');
      navigate(`/qr-code/${response.data._id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ في الحجز';
      toast.error(message);
    } finally {
      setSubmitting(false);
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
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trip Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ملخص الرحلة</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">المسار</p>
                <p className="font-medium text-lg">{trip.from} → {trip.to}</p>
              </div>
            </div>

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
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">حجز المقعد</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700 mb-2">
                اسم الراكب
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="passengerName"
                  name="passengerName"
                  required
                  className="input-field pl-10"
                  placeholder="اسم الراكب الكامل"
                  value={formData.passengerName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="passengerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  id="passengerPhone"
                  name="passengerPhone"
                  required
                  className="input-field pl-10"
                  placeholder="رقم الهاتف"
                  value={formData.passengerPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="seatNumber" className="block text-sm font-medium text-gray-700 mb-2">
                رقم المقعد
              </label>
              <select
                id="seatNumber"
                name="seatNumber"
                required
                className="input-field"
                value={formData.seatNumber}
                onChange={handleChange}
              >
                <option value="">اختر رقم المقعد</option>
                {Array.from({ length: trip.totalSeats }, (_, i) => i + 1).map((seat) => (
                  <option key={seat} value={seat}>
                    مقعد رقم {seat}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">ملاحظات مهمة:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• تأكد من صحة البيانات المدخلة</li>
                <li>• لا يمكن تغيير المقعد بعد الحجز</li>
                <li>• احتفظ برقم الحجز للرجوع إليه</li>
                <li>• الوصول قبل موعد الرحلة بـ 15 دقيقة</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting || !formData.seatNumber}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري الحجز...
                  </div>
                ) : (
                  'تأكيد الحجز'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;