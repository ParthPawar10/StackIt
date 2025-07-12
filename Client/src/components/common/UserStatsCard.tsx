import { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Award, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as questionService from '../../services/questionService';

interface UserStats {
  totalQuestions: number;
  totalAnswers: number;
  reputation: number;
  totalViews: number;
}

export default function UserStatsCard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalQuestions: 0,
    totalAnswers: 0,
    reputation: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get user's questions
      const questionsResponse = await questionService.getQuestions({
        author: user.id,
        limit: 100
      });
      
      const questions = questionsResponse.questions || [];
      const totalViews = questions.reduce((sum, q) => sum + q.views, 0);
      const totalAnswers = questions.reduce((sum, q) => sum + q.answerCount, 0);
      
      setStats({
        totalQuestions: questions.length,
        totalAnswers,
        reputation: user.reputation || 0,
        totalViews
      });
    } catch (error) {
      console.error('Failed to load user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Your Stats
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-1">
            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {stats.totalQuestions}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Questions
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-1">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {stats.totalAnswers}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Answers
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full mx-auto mb-1">
            <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {stats.reputation}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Reputation
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full mx-auto mb-1">
            <Eye className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {stats.totalViews}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Views
          </div>
        </div>
      </div>
    </div>
  );
}
