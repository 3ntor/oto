import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';

const TripCard = ({ trip }) => {
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

  return (
    <div className="card-hover">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {trip.from} → {trip.to}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(trip.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{trip.time}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
          {getStatusText(trip.status)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span className="text-sm">المقاعد المتاحة</span>
          </div>
          <span className="text-sm font-medium">
            {trip.availableSeats} / {trip.totalSeats}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">السعر</span>
          </div>
          <span className="text-lg font-bold text-primary-600">
            {trip.price} ريال
          </span>
        </div>

        {trip.driver && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">السائق</span>
            <span className="text-sm font-medium">{trip.driver.name}</span>
          </div>
        )}

        {trip.description && (
          <p className="text-sm text-gray-600 mt-2">{trip.description}</p>
        )}
      </div>

      <div className="mt-6">
        <Link
          to={`/trips/${trip._id}`}
          className="btn-primary w-full text-center"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
};

export default TripCard;