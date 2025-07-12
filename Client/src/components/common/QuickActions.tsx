import { Link } from 'react-router-dom';
import { Plus, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function QuickActions() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Link
        to="/ask"
        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4 mr-1" />
        Ask
      </Link>
      <Link
        to="/my-questions"
        className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <MessageSquare className="w-4 h-4 mr-1" />
        My Questions
      </Link>
    </div>
  );
}
