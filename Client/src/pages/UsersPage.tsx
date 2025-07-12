import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Users as UsersIcon, Trophy, Calendar, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import type { User as UserType } from '../types/index.ts';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'reputation' | 'newest' | 'name'>('reputation');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [sortBy]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      let fetchedUsers: UserType[] = response.data.data?.users || [];
      // Sort users based on selected criteria
      const sortedUsers = [...fetchedUsers].sort((a, b) => {
        switch (sortBy) {
          case 'reputation':
            return b.reputation - a.reputation;
          case 'newest':
            return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
          case 'name':
            return a.username.localeCompare(b.username);
          default:
            return 0;
        }
      });
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Users</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Discover and connect with other community members. Browse profiles, see their contributions, 
          and learn from their expertise.
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'reputation' | 'newest' | 'name')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="reputation">Reputation</option>
              <option value="newest">Newest</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <UsersIcon className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{filteredUsers.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.max(...filteredUsers.map(u => u.reputation))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Highest Reputation</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredUsers.filter(u => u.isOnline).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Online Now</div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              {/* User Header */}
              <div className="flex items-start space-x-4 mb-4">
                <Link to={`/users/${user.id}`} className="flex-shrink-0">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.username}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                </Link>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Link 
                      to={`/users/${user.id}`}
                      className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate"
                    >
                      {user.username}
                    </Link>
                    <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4" />
                      <span className="font-medium text-yellow-600 dark:text-yellow-400">
                        {user.reputation.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {user.bio}
                </p>
              )}

              {/* Location and Join Date */}
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                {user.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDistanceToNow(new Date(user.joinDate), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Badges */}
              {user.badges && user.badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {user.badges.slice(0, 3).map((badge: any) => (
                    <div
                      key={badge.id}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs"
                      title={badge.description}
                    >
                      <span>{badge.icon}</span>
                      <span className="text-gray-700 dark:text-gray-300">{badge.name}</span>
                    </div>
                  ))}
                  {user.badges.length > 3 && (
                    <div className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-500 dark:text-gray-400">
                      +{user.badges.length - 3} more
                    </div>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {user.stats.questionsAsked}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Questions</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {user.stats.answersGiven}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Answers</div>
                </div>
              </div>

              {/* View Profile Link */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to={`/users/${user.id}`}
                  className="block w-full text-center px-4 py-2 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No users found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery 
              ? `No users match your search for "${searchQuery}"`
              : 'No users available at the moment'
            }
          </p>
        </div>
      )}

      {/* Top Contributors Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top Contributors</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {users
              .sort((a, b) => b.reputation - a.reputation)
              .slice(0, 5)
              .map((user, index) => (
                <div key={user.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    <Link to={`/users/${user.id}`} className="flex-shrink-0">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.username}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                      )}
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/users/${user.id}`}
                        className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {user.username}
                      </Link>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {user.stats.answersGiven} answers • {user.stats.questionsAsked} questions
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                        {user.reputation.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">reputation</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
