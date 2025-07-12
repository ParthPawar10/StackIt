import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Award,
  ArrowRight,
  Clock,
  Eye,
  ThumbsUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Question } from '../types';
import api from '../utils/api';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalUsers: 0,
    answeredQuestions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [questionsRes] = await Promise.all([
          api.get('/questions?limit=5&sort=-createdAt'),
        ]);

        if (questionsRes.data.success) {
          setRecentQuestions(questionsRes.data.data.questions || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getVoteCount = (votes: { up: string[]; down: string[] }) => {
    return votes.up.length - votes.down.length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          Welcome to StackIt
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {isAuthenticated 
            ? `Hello ${user?.username}! Ready to ask questions or share your knowledge?`
            : 'Your go-to platform for asking questions, sharing knowledge, and connecting with developers worldwide.'
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isAuthenticated ? (
            <>
              <Link to="/auth" className="btn-primary">
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/questions" className="btn-secondary">
                Browse Questions
              </Link>
            </>
          ) : (
            <>
              <Link to="/questions" className="btn-primary">
                Ask a Question
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/questions" className="btn-secondary">
                Browse All Questions
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Questions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalQuestions}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <MessageSquare className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Answered</p>
              <p className="text-3xl font-bold text-gray-900">{stats.answeredQuestions}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Award className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Today</p>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Questions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Questions</h2>
          <Link 
            to="/questions" 
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            View All
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>

        {recentQuestions.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">No questions yet</p>
            <p className="text-gray-500 mb-6">Be the first to ask a question!</p>
            <Link to="/questions" className="btn-primary">
              Ask Question
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentQuestions.map((question) => (
              <div key={question._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                      <Link to={`/questions/${question._id}`}>
                        {question.title}
                      </Link>
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <ThumbsUp size={14} />
                        <span>{getVoteCount(question.votes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        <span>{question.answers.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{question.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatTimeAgo(question.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {question.tags.map((tag) => (
                        <span 
                          key={tag._id}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600">
                      by <span className="font-medium text-gray-900">{question.author.username}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/questions" className="card p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <MessageSquare className="text-blue-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask Question</h3>
            <p className="text-gray-600">Get help from the community</p>
          </div>
        </Link>

        <Link to="/questions" className="card p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <Award className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Answer Questions</h3>
            <p className="text-gray-600">Share your knowledge</p>
          </div>
        </Link>

        <Link to="/upload" className="card p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <TrendingUp className="text-purple-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Content</h3>
            <p className="text-gray-600">Share images and files</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
