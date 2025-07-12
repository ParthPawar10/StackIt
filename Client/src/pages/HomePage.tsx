import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import type { Question } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import QuestionCard from '../components/questions/QuestionCard.tsx';
import * as questionService from '../services/questionService.ts';

export default function HomePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading questions...');
      const response = await questionService.getQuestions({ 
        limit: 10, 
        sort: 'recent' 
      });
      console.log('Questions response:', response);
      setQuestions(response.questions || []);
    } catch (error) {
      console.error('Failed to load questions:', error);
      setError('Failed to connect to server. Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
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
            onClick={loadQuestions}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Top Questions
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {questions.length} questions
          </p>
        </div>
        {isAuthenticated && (
          <Link
            to="/ask"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ask Question
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">1,234</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Questions</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">5,678</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Answers</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">42</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">98%</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Answered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No questions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Be the first to ask a question!
            </p>
            {isAuthenticated && (
              <Link
                to="/ask"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ask Question
              </Link>
            )}
          </div>
        ) : (
          questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))
        )}
      </div>

      {/* Load More */}
      {questions.length > 0 && (
        <div className="text-center py-8">
          <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Load More Questions
          </button>
        </div>
      )}
    </div>
  );
}