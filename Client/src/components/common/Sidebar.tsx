import { NavLink } from 'react-router-dom';
import { Home, Users, Tag, TrendingUp, BookOpen, Settings, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Questions', href: '/questions', icon: BookOpen },
  { name: 'Tags', href: '/tags', icon: Tag },
  { name: 'Users', href: '/users', icon: Users },
];

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: Shield },
];

export default function Sidebar() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:pt-16">
      <div className="flex grow flex-col overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <nav className="flex-1 space-y-1 px-4 py-6">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}

          {isAuthenticated && (
            <>
              <div className="pt-6">
                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Personal
                </h3>
                <div className="mt-2 space-y-1">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      }`
                    }
                  >
                    <Users className="mr-3 h-5 w-5 flex-shrink-0" />
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/my-questions"
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      }`
                    }
                  >
                    <BookOpen className="mr-3 h-5 w-5 flex-shrink-0" />
                    My Questions
                  </NavLink>
                  <NavLink
                    to="/bookmarks"
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      }`
                    }
                  >
                    <TrendingUp className="mr-3 h-5 w-5 flex-shrink-0" />
                    Bookmarks
                  </NavLink>
                </div>
              </div>

              {isAdmin && (
                <div className="pt-6">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Administration
                  </h3>
                  <div className="mt-2 space-y-1">
                    {adminNavigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive
                              ? 'bg-red-50 border-r-2 border-red-500 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                          }`
                        }
                      >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </nav>

        {/* User stats sidebar */}
        {isAuthenticated && user && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.reputation} reputation
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
