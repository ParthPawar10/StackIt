import { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  HelpCircle, 
  Flag, 
  TrendingUp, 
  Activity, 
  Shield, 
  Settings,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext.tsx';
import toast from 'react-hot-toast';

interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalAnswers: number;
  pendingReports: number;
  activeUsers: number;
  newUsersToday: number;
}

interface ReportedContent {
  id: string;
  type: 'question' | 'answer' | 'comment';
  title: string;
  content: string;
  author: string;
  reporter: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

interface UserManagement {
  id: string;
  username: string;
  email: string;
  reputation: number;
  status: 'active' | 'suspended' | 'banned';
  joinDate: string;
  lastActivity: string;
  reportCount: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<ReportedContent[]>([]);
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.email === 'admin@example.com'; // Replace with proper admin check

  useEffect(() => {
    if (!isAdmin) return;
    loadAdminData();
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Mock admin data - replace with actual API calls
      const mockStats: AdminStats = {
        totalUsers: 1247,
        totalQuestions: 3892,
        totalAnswers: 8734,
        pendingReports: 7,
        activeUsers: 89,
        newUsersToday: 12
      };

      const mockReports: ReportedContent[] = [
        {
          id: 'report1',
          type: 'question',
          title: 'Inappropriate question about hacking',
          content: 'How can I hack into someone\'s system...',
          author: 'baduser123',
          reporter: 'gooduser456',
          reason: 'Violates community guidelines',
          status: 'pending',
          createdAt: '2024-07-15T10:30:00Z'
        },
        {
          id: 'report2',
          type: 'answer',
          title: 'Spam answer with promotional content',
          content: 'Check out my website for the best deals...',
          author: 'spammer789',
          reporter: 'moderator1',
          reason: 'Spam/promotional content',
          status: 'pending',
          createdAt: '2024-07-15T09:15:00Z'
        }
      ];

      const mockUsers: UserManagement[] = [
        {
          id: 'user1',
          username: 'baduser123',
          email: 'bad@example.com',
          reputation: 45,
          status: 'active',
          joinDate: '2024-06-01T00:00:00Z',
          lastActivity: '2024-07-15T10:30:00Z',
          reportCount: 3
        },
        {
          id: 'user2',
          username: 'spammer789',
          email: 'spam@example.com',
          reputation: 12,
          status: 'suspended',
          joinDate: '2024-07-01T00:00:00Z',
          lastActivity: '2024-07-15T09:15:00Z',
          reportCount: 5
        }
      ];

      setStats(mockStats);
      setReports(mockReports);
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = (reportId: string, action: 'approve' | 'dismiss') => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: action === 'approve' ? 'resolved' : 'dismissed' }
          : report
      )
    );
    toast.success(`Report ${action === 'approve' ? 'resolved' : 'dismissed'} successfully`);
  };

  const handleUserAction = (userId: string, action: 'suspend' | 'ban' | 'activate') => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, status: action === 'activate' ? 'active' : action === 'suspend' ? 'suspended' : 'banned' }
          : user
      )
    );
    toast.success(`User ${action}d successfully`);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access the admin dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
              <div className="text-xs text-green-600 dark:text-green-400">+{stats?.newUsersToday} today</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <HelpCircle className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalQuestions}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalAnswers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Answers</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Flag className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.pendingReports}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending Reports</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.activeUsers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-indigo-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats ? Math.round((stats.totalAnswers / stats.totalQuestions) * 100) / 100 : 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Answers/Question</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div>
              <div className="text-sm text-gray-900 dark:text-white">
                New report filed for question "How to hack systems"
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="text-sm text-gray-900 dark:text-white">
                User "spammer789" suspended for violating community guidelines
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="text-sm text-gray-900 dark:text-white">
                12 new users registered today
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">6 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Reports</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {reports.filter(r => r.status === 'pending').map((report) => (
            <div key={report.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.type === 'question' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      report.type === 'answer' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {report.type}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {report.title}
                  </h4>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {report.content}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Author: <span className="font-medium">{report.author}</span></span>
                    <span>Reporter: <span className="font-medium">{report.reporter}</span></span>
                    <span>Reason: <span className="font-medium">{report.reason}</span></span>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleReportAction(report.id, 'approve')}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove Content
                  </button>
                  <button
                    onClick={() => handleReportAction(report.id, 'dismiss')}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Dismiss
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    View Full
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {reports.filter(r => r.status === 'pending').length === 0 && (
            <div className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No pending reports</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <div key={user.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {user.status}
                      </span>
                      {user.reportCount > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {user.reportCount} reports
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{user.email}</span>
                      <span>Reputation: {user.reputation}</span>
                      <span>Joined: {formatDistanceToNow(new Date(user.joinDate), { addSuffix: true })}</span>
                      <span>Last active: {formatDistanceToNow(new Date(user.lastActivity), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {user.status === 'active' && (
                    <>
                      <button
                        onClick={() => handleUserAction(user.id, 'suspend')}
                        className="inline-flex items-center px-3 py-1 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        Suspend
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'ban')}
                        className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Ban
                      </button>
                    </>
                  )}
                  
                  {user.status !== 'active' && (
                    <button
                      onClick={() => handleUserAction(user.id, 'activate')}
                      className="inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      Activate
                    </button>
                  )}
                  
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: Flag, count: reports.filter(r => r.status === 'pending').length },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your community, monitor content, and maintain platform health.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'reports' && renderReportsTab()}
      {activeTab === 'users' && renderUsersTab()}
      {activeTab === 'settings' && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Settings panel coming soon</p>
        </div>
      )}
    </div>
  );
}
