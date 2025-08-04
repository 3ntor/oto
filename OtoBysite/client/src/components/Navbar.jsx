import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Bus, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isDriver } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">OtoBysite</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              الرئيسية
            </Link>
            <Link to="/trips" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              الرحلات
            </Link>
            
            {isAuthenticated && (
              <Link to="/my-bookings" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                حجوزاتي
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                لوحة الإدارة
              </Link>
            )}

            {isDriver && (
              <Link to="/driver" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                لوحة السائق
              </Link>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-secondary">
                  تسجيل الدخول
                </Link>
                <Link to="/register" className="btn-primary">
                  التسجيل
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              to="/"
              className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              to="/trips"
              className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              الرحلات
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/my-bookings"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                حجوزاتي
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                لوحة الإدارة
              </Link>
            )}

            {isDriver && (
              <Link
                to="/driver"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                لوحة السائق
              </Link>
            )}

            {!isAuthenticated ? (
              <div className="space-y-2 pt-4">
                <Link
                  to="/login"
                  className="block btn-secondary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="block btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  التسجيل
                </Link>
              </div>
            ) : (
              <div className="pt-4 space-y-2">
                <div className="flex items-center space-x-2 px-3 py-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;