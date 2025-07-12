import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Award, 
  MessageSquare, 
  Edit3,
  Settings,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Question, Answer } from '../types';
import api from '../utils/api';

const Profile: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [activeTab, setActiveTab] = useState<'questions' | 'answers'>('questions');
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserActivity();
      setEditForm({
        username: user.username,
        bio: user.bio || '',
      });
    }
  }, [user]);

  const fetchUserActivity = async () => {
    try {
      setIsLoading(true);
      const [questionsRes, answersRes] = await Promise.all([
        api.get(`/questions?author=${user?._id}`),
        api.get(`/answers?author=${user?._id}`),
      ]);

      if (questionsRes.data.success) {
        setUserQuestions(questionsRes.data.data.questions || []);
      }
      if (answersRes.data.success) {
        setUserAnswers(answersRes.data.data.answers || []);
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await api.put('/users/profile', editForm);
      if (response.data.success) {
        updateUser(response.data.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="card p-8">
          <UserIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your profile.
          </p>
          <a href="/auth" className="btn-primary">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSaveProfile} className="btn-primary flex items-center">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary flex items-center"
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary flex items-center"
                  >
                    <Edit3 size={16} className="mr-2" />
                    Edit Profile
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-2" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Award size={16} className="mr-2" />
                    <span>{user.reputation} reputation</span>
                    <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {user.role}
                    </span>
                  </div>
                  {user.bio && (
                    <p className="text-gray-700 mt-4">{user.bio}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="text-blue-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{userQuestions.length}</h3>
          <p className="text-gray-600">Questions Asked</p>
        </div>

        <div className="card p-6 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="text-green-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{userAnswers.length}</h3>
          <p className="text-gray-600">Answers Given</p>
        </div>

        <div className="card p-6 text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="text-purple-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{user.reputation}</h3>
          <p className="text-gray-600">Reputation</p>
        </div>
      </div>

      {/* Activity Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('questions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'questions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Questions ({userQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab('answers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'answers'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Answers ({userAnswers.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'questions' && (
                <div className="space-y-4">
                  {userQuestions.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600">No questions asked yet</p>
                    </div>
                  ) : (
                    userQuestions.map((question) => (
                      <div key={question._id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{question.title}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {question.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>{question.votes.up.length - question.votes.down.length} votes</span>
                            <span>{question.answers.length} answers</span>
                            <span>{question.views} views</span>
                          </div>
                          <span>{formatTimeAgo(question.createdAt)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'answers' && (
                <div className="space-y-4">
                  {userAnswers.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600">No answers given yet</p>
                    </div>
                  ) : (
                    userAnswers.map((answer) => (
                      <div key={answer._id} className="border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-600 mb-3 line-clamp-3">
                          {answer.content.substring(0, 200)}...
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>{answer.votes.up.length - answer.votes.down.length} votes</span>
                            {answer.isAccepted && (
                              <span className="text-green-600 font-medium">Accepted</span>
                            )}
                          </div>
                          <span>{formatTimeAgo(answer.createdAt)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
