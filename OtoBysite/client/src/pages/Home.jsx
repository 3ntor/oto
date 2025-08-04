import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bus, MapPin, Clock, Users, ArrowRight, Star } from 'lucide-react';
import { tripsAPI } from '../services/api';
import TripCard from '../components/TripCard';

const Home = () => {
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedTrips();
  }, []);

  const fetchFeaturedTrips = async () => {
    try {
      const response = await tripsAPI.getAll({ status: 'scheduled' });
      setFeaturedTrips(response.data.slice(0, 6)); // Show first 6 trips
    } catch (error) {
      console.error('Error fetching featured trips:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Bus className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              مرحباً بكم في OtoBysite
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              نظام حجز الرحلات الأكثر تطوراً وأماناً
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/trips"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                استكشف الرحلات
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                سجل الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              لماذا تختار OtoBysite؟
            </h2>
            <p className="text-lg text-gray-600">
              نوفر لكم أفضل خدمة نقل مع ضمان الراحة والأمان
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bus className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">رحلات مريحة</h3>
              <p className="text-gray-600">
                رحلات مريحة وآمنة مع أفضل السائقين والمركبات الحديثة
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">مواعيد دقيقة</h3>
              <p className="text-gray-600">
                مواعيد دقيقة ومرونة في الحجز مع إمكانية الإلغاء والتعديل
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">خدمة عملاء متميزة</h3>
              <p className="text-gray-600">
                فريق خدمة عملاء متخصص لمساعدتك في أي وقت
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trips Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              الرحلات المميزة
            </h2>
            <p className="text-lg text-gray-600">
              اكتشف أفضل الرحلات المتاحة الآن
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTrips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/trips"
              className="btn-primary inline-flex items-center"
            >
              عرض جميع الرحلات
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-primary-100">رحلة مكتملة</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5000+</div>
              <div className="text-primary-100">عميل راضي</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-primary-100">سائق محترف</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-primary-100">خدمة عملاء</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;