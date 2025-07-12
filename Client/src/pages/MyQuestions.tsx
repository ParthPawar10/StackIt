import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, MessageSquare, ArrowUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Question } from '../types';
import * as questionService from '../services/questionService';
import QuestionCard from '../components/questions/QuestionCard';
import { formatDistanceToNow } from 'date-fns';

interface QuestionStats {
  total: number;
  answered: number;
  accepted: number;
  views: number;
}

export default function MyQuestions() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'votes' | 'popular'>('recent');
  const [filterBy, setFilterBy] = useState<'all' | 'answered' | 'unanswered' | 'accepted'>('all');
  const [stats, setStats] = useState<QuestionStats>({
    total: 0,
    answered: 0,
    accepted: 0,
    views: 0
  });

  useEffect(() => {
    if (user) {
      loadMyQuestions();
    }
  }, [user, sortBy, filterBy]);

  const loadMyQuestions = async () => {
    if (!user) {
      console.log('No user found, cannot load questions');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // For debugging: Let's make a test call to verify the user ID
      console.log('User object in loadMyQuestions:', user);
      console.log('User ID being used for filtering:', user.id);
      
      const response = await questionService.getQuestions({
        author: user.id,
        sort: sortBy,
        limit: 50
      });
      
      let filteredQuestions = response.questions || [];
      
      // Apply client-side filtering
      if (filterBy === 'answered') {
        filteredQuestions = filteredQuestions.filter(q => q.answerCount > 0);
      } else if (filterBy === 'unanswered') {
        filteredQuestions = filteredQuestions.filter(q => q.answerCount === 0);
      } else if (filterBy === 'accepted') {
        filteredQuestions = filteredQuestions.filter(q => q.acceptedAnswer);
      }
      
      setQuestions(filteredQuestions);
      
      // Calculate stats
      const totalQuestions = response.questions || [];
      const answeredCount = totalQuestions.filter(q => q.answerCount > 0).length;
      const acceptedCount = totalQuestions.filter(q => q.acceptedAnswer).length;
      const totalViews = totalQuestions.reduce((sum, q) => sum + q.views, 0);
      
      setStats({
        total: totalQuestions.length,
        answered: answeredCount,
        accepted: acceptedCount,
        views: totalViews
      });
    } catch (error) {
      console.error('Failed to load questions:', error);
      setError('Failed to load your questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await questionService.deleteQuestion(questionId);
      setQuestions(prev => prev.filter(q => (q._id || q.id) !== questionId));
    } catch (error) {
      console.error('Failed to delete question:', error);
      alert('Failed to delete question');
    }
  };

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (question.description || question.content || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your questions
          </h2>
          <Link
            to="/auth"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={loadMyQuestions}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Questions
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage and track your questions
          </p>
        </div>
        <Link
          to="/ask"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ask New Question
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.answered}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Answered</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.accepted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accepted</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.views}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Recent</option>
              <option value="votes">Most Voted</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Questions</option>
              <option value="answered">Answered</option>
              <option value="unanswered">Unanswered</option>
              <option value="accepted">Accepted Answer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filterBy !== 'all' ? 'No matching questions' : 'No questions yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filters'
                : "You haven't asked any questions yet. Start by asking your first question!"
              }
            </p>
            {(!searchTerm && filterBy === 'all') && (
              <Link
                to="/ask"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ask Your First Question
              </Link>
            )}
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div key={question._id || question.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Question Card with Management Actions */}
              <div className="relative">
                <QuestionCard question={question} />
                
                {/* Management Actions Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Link
                    to={`/questions/${question._id || question.id}/edit`}
                    className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Edit Question"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteQuestion(question._id || question.id || '')}
                    className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  {question.acceptedAnswer ? (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                      Accepted
                    </span>
                  ) : question.answerCount > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                      Answered
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
                      Unanswered
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <ArrowUp className="w-4 h-4" />
                      <span>{question.voteScore}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{question.answerCount} answers</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{question.views} views</span>
                    </span>
                  </div>
                  <span>
                    {question.isEdited ? 'Modified' : 'Asked'} {formatDistanceToNow(new Date(question.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More (if needed) */}
      {filteredQuestions.length > 0 && filteredQuestions.length >= 20 && (
        <div className="text-center py-8">
          <button 
            onClick={loadMyQuestions}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Load More Questions
          </button>
        </div>
      )}
    </div>
  );
}
