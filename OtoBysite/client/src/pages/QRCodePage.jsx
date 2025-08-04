import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import QRCode from 'react-qr-code';

const QRCodePage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getById(bookingId);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `booking-${bookingId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">الحجز غير موجود</h3>
        <Link to="/my-bookings" className="btn-primary mt-4 inline-block">
          العودة لحجوزاتي
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/my-bookings"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 ml-2" />
        العودة لحجوزاتي
      </Link>

      {/* QR Code Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            QR Code للحجز
          </h1>
          <p className="text-gray-600">
            اعرض هذا الكود للسائق عند الصعود للباص
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code */}
          <div className="text-center">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 inline-block">
              <QRCode
                value={JSON.stringify({
                  bookingId: booking._id,
                  tripId: booking.trip._id,
                  passengerName: booking.passengerName,
                  seatNumber: booking.seatNumber
                })}
                size={250}
                level="H"
              />
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handlePrint}
                className="btn-secondary inline-flex items-center"
              >
                <Printer className="h-4 w-4 ml-2" />
                طباعة
              </button>
              <button
                onClick={handleDownload}
                className="btn-primary inline-flex items-center"
              >
                <Download className="h-4 w-4 ml-2" />
                تحميل
              </button>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                تفاصيل الحجز
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">اسم الراكب</span>
                  <span className="font-medium">{booking.passengerName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">رقم المقعد</span>
                  <span className="font-medium">{booking.seatNumber}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">المسار</span>
                  <span className="font-medium">{booking.trip.from} → {booking.trip.to}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">التاريخ</span>
                  <span className="font-medium">{formatDate(booking.trip.date)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الوقت</span>
                  <span className="font-medium">{booking.trip.time}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">السعر</span>
                  <span className="font-medium text-primary-600">{booking.totalPrice} ريال</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">تاريخ الحجز</span>
                  <span className="font-medium">{formatDate(booking.bookingDate)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">رقم الحجز</span>
                  <span className="font-medium text-sm">{booking._id}</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">تعليمات مهمة:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• احتفظ بهذا QR Code معك</li>
                <li>• اعرضه للسائق عند الصعود للباص</li>
                <li>• الوصول قبل موعد الرحلة بـ 15 دقيقة</li>
                <li>• تأكد من إحضار هوية شخصية</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;