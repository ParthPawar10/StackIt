import { Link } from 'react-router-dom';
import { MessageSquare, Eye, ArrowUp, ArrowDown, Bookmark, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Question } from '../../types/index.ts';

interface QuestionCardProps {
  question: Question;
  showFullContent?: boolean;
}

export default function QuestionCard({ question, showFullContent = false }: QuestionCardProps) {
  const handleVote = (type: 'up' | 'down') => {
    // TODO: Implement voting logic
    console.log(`Vote ${type} on question ${question._id || question.id}`);
  };

  const handleBookmark = () => {
    // TODO: Implement bookmark logic
    console.log(`Bookmark question ${question._id || question.id}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="flex gap-4">
        {/* Vote and Stats Column */}
        <div className="flex flex-col items-center space-y-2 text-sm text-gray-500 dark:text-gray-400 min-w-[60px]">
          {/* Votes */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleVote('up')}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                question.userVote === 'up' ? 'text-green-600 dark:text-green-400' : ''
              }`}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <span className={`font-medium ${
              question.voteScore > 0 ? 'text-green-600 dark:text-green-400' :
              question.voteScore < 0 ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              {question.voteScore}
            </span>
            <button
              onClick={() => handleVote('down')}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                question.userVote === 'down' ? 'text-red-600 dark:text-red-400' : ''
              }`}
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>

          {/* Answer Count */}
          <div className={`flex flex-col items-center p-2 rounded border ${
            question.acceptedAnswer 
              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
              : question.answerCount > 0 
                ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600'
          }`}>
            <span className={`font-medium ${
              question.acceptedAnswer 
                ? 'text-green-700 dark:text-green-300' 
                : question.answerCount > 0 
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400'
            }`}>
              {question.answerCount}
            </span>
            <span className="text-xs">
              {question.answerCount === 1 ? 'answer' : 'answers'}
            </span>
          </div>

          {/* Views */}
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{question.views}</span>
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            <Link 
              to={`/questions/${question._id || question.id}`}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {question.title}
            </Link>
          </h3>

          {/* Content Preview */}
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            {showFullContent ? (
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: question.description || question.content || '' }}
              />
            ) : (
              <p className="line-clamp-3">
                {((question.description || question.content || '').replace(/<[^>]*>/g, '').substring(0, 200))}
                {(question.description || question.content || '').length > 200 && '...'}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags && question.tags.map((tag) => (
              <Link
                key={tag._id || tag.id || tag.name}
                to={`/tags/${tag.name}`}
                className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <button
                onClick={handleBookmark}
                className={`flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 ${
                  question.isBookmarked ? 'text-yellow-600 dark:text-yellow-400' : ''
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Bookmark</span>
              </button>
              
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>
                  {question.isEdited ? 'edited' : 'asked'} {formatDistanceToNow(new Date(question.updatedAt), { addSuffix: true })}
                </span>
              </span>
            </div>

            {/* Author Info */}
            <div className="flex items-center space-x-2 text-sm">
              <Link 
                to={`/users/${question.author._id || question.author.id}`}
                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                {question.author.avatar ? (
                  <img 
                    src={question.author.avatar} 
                    alt={question.author.username}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
                <span>{question.author.username}</span>
              </Link>
              <span className="text-gray-500 dark:text-gray-400">
                {question.author.reputation.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
