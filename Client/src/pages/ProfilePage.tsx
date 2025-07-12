import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, MapPin, Calendar, ExternalLink, Award, TrendingUp, MessageSquare, HelpCircle, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext.tsx';
import QuestionCard from '../components/questions/QuestionCard.tsx';
import type { User as UserType, Question } from '../types/index.ts';
import toast from 'react-hot-toast';

interface ProfileTab {
  id: string;
  label: string;
  count?: number;
}

const profileTabs: ProfileTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'questions', label: 'Questions', count: 5 },
  { id: 'answers', label: 'Answers', count: 12 },
  { id: 'bookmarks', label: 'Bookmarks', count: 8 },
  { id: 'activity', label: 'Activity' }
];

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileUser, setProfileUser] = useState<UserType | null>(null);
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      // Mock user data - replace with actual API call
      const mockUser: UserType = {
        id: userId || 'user1',
        username: 'johndoe',
        email: 'john@example.com',
        reputation: 1250,
        avatar: undefined,
        bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and TypeScript. Passionate about clean code and helping others learn to code.',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        joinDate: '2022-03-15T00:00:00Z',
        lastSeen: '2024-07-15T10:30:00Z',
        isOnline: true,
        badges: [
          { id: 'early-adopter', name: 'Early Adopter', description: 'Joined in the first 100 users', icon: '🚀' },
          { id: 'helpful', name: 'Helpful', description: 'Received 50+ upvotes on answers', icon: '🤝' },
          { id: 'questioner', name: 'Curious', description: 'Asked 10+ questions', icon: '❓' }
        ],
        stats: {
          questionsAsked: 5,
          answersGiven: 12,
          totalViews: 2450,
          upvotesReceived: 145,
          downvotesReceived: 8,
          acceptedAnswers: 7,
          bountyWon: 150
        },
        preferences: {
          theme: 'system',
          emailNotifications: true,
          profileVisibility: 'public'
        }
      };

      // Mock questions data
      const mockQuestions: Question[] = [
        {
          id: '1',
          title: 'How to implement authentication in React with TypeScript?',
          content: 'I need help with implementing authentication...',
          authorId: userId || 'user1',
          author: mockUser,
          tags: [
            { id: 'react', name: 'react', count: 1500, createdAt: '2024-01-01' },
            { id: 'typescript', name: 'typescript', count: 1200, createdAt: '2024-01-01' }
          ],
          votes: 15,
          views: 342,
          answers: [],
          answerCount: 3,
          hasAcceptedAnswer: true,
          acceptedAnswerId: 'answer1',
          createdAt: '2024-07-10T10:30:00Z',
          updatedAt: '2024-07-10T10:30:00Z',
          isEdited: false,
          isClosed: false,
          isBookmarked: false,
          userVote: null
        }
      ];

      setProfileUser(mockUser);
      setUserQuestions(mockQuestions);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User not found</h1>
        <Link to="/" className="text-blue-600 hover:underline">Return to homepage</Link>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profileUser.stats.questionsAsked}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{profileUser.stats.answersGiven}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Answers</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{profileUser.stats.totalViews}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{profileUser.reputation}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Reputation</div>
        </div>
      </div>

      {/* Badges */}
      {profileUser.badges && profileUser.badges.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Badges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileUser.badges.map((badge: any) => (
              <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{badge.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="text-sm text-gray-900 dark:text-white">
                Posted answer to <Link to="/questions/1" className="text-blue-600 hover:underline">"How to handle async operations in React?"</Link>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="text-sm text-gray-900 dark:text-white">
                Asked question <Link to="/questions/2" className="text-blue-600 hover:underline">"Best practices for TypeScript in 2024"</Link>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">1 day ago</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <div className="text-sm text-gray-900 dark:text-white">
                Earned <span className="font-medium">Helpful</span> badge
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">3 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuestionsTab = () => (
    <div className="space-y-4">
      {userQuestions.length > 0 ? (
        userQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No questions asked yet</p>
        </div>
      )}
    </div>
  );

  const renderAnswersTab = () => (
    <div className="space-y-4">
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No answers given yet</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'questions':
        return renderQuestionsTab();
      case 'answers':
        return renderAnswersTab();
      case 'bookmarks':
        return (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No bookmarks yet</p>
          </div>
        );
      case 'activity':
        return (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Activity timeline coming soon</p>
          </div>
        );
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
            {/* Profile Header */}
            <div className="text-center mb-6">
              {profileUser.avatar ? (
                <img 
                  src={profileUser.avatar} 
                  alt={profileUser.username}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-600 dark:text-gray-300" />
                </div>
              )}
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {profileUser.username}
              </h1>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className={`w-2 h-2 rounded-full ${profileUser.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>{profileUser.isOnline ? 'Online' : `Last seen ${formatDistanceToNow(new Date(profileUser.lastSeen), { addSuffix: true })}`}</span>
              </div>

              {isOwnProfile && (
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              {profileUser.bio && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profileUser.bio}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Details</h3>
                <div className="space-y-2 text-sm">
                  {profileUser.location && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{profileUser.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDistanceToNow(new Date(profileUser.joinDate), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {(profileUser.website || profileUser.github || profileUser.linkedin) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Links</h3>
                  <div className="space-y-2">
                    {profileUser.website && (
                      <a 
                        href={profileUser.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                    )}
                    {profileUser.github && (
                      <a 
                        href={profileUser.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {profileUser.linkedin && (
                      <a 
                        href={profileUser.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8">
              {profileTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
