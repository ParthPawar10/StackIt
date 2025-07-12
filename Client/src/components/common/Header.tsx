import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';
import SearchBar from './SearchBar.tsx';
import NotificationDropdown from '../notifications/NotificationDropdown.tsx';
import AuthModals from '../auth/AuthModals.tsx';
import logo from '../../assets/logo1.png';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModals, setShowAuthModals] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login');
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleAuthClick = (type: 'login' | 'register') => {
    setAuthModalType(type);
    setShowAuthModals(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src={logo} alt="StackIt Logo" className="h-8 w-auto" />
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <SearchBar />
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              {/* Search Button - Mobile */}
              <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Search className="w-5 h-5" />
              </button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <NotificationDropdown />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>

                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.username} 
                          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" 
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                        {user?.username}
                      </span>
                      <svg className="hidden sm:block w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                          <div className="flex items-center space-x-3">
                            {user?.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.username} 
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" 
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user?.username}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <User className="w-4 h-4 mr-3" />
                          My Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <hr className="my-2 border-gray-200 dark:border-gray-600" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Sign up
                  </button>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="px-4 py-3 space-y-3">
              <SearchBar />
              {isAuthenticated ? (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  {/* User Info in Mobile */}
                  <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-3">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.username} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" 
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-3" />
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600 space-y-2">
                  <button
                    onClick={() => {
                      handleAuthClick('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      handleAuthClick('register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modals */}
      {showAuthModals && (
        <AuthModals
          isOpen={showAuthModals}
          onClose={() => setShowAuthModals(false)}
          initialType={authModalType}
        />
      )}
    </>
  );
}
