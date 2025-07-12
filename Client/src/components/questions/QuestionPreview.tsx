import { MessageSquare, Eye, ArrowUp, ArrowDown, User } from 'lucide-react';
import type { Tag } from '../../types';

interface QuestionPreviewProps {
  title: string;
  content: string;
  tags: Tag[];
  authorName?: string;
}

export default function QuestionPreview({ title, content, tags, authorName = 'You' }: QuestionPreviewProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex gap-4">
        {/* Vote Column */}
        <div className="flex flex-col items-center space-y-2 text-sm text-gray-500 dark:text-gray-400 min-w-[60px]">
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowUp className="w-5 h-5" />
          </button>
          <span className="font-medium text-gray-600 dark:text-gray-400">0</span>
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowDown className="w-5 h-5" />
          </button>
          
          {/* Answer Count */}
          <div className="flex flex-col items-center p-2 rounded border border-gray-200 dark:border-gray-600 mt-4">
            <span className="font-medium text-gray-600 dark:text-gray-400">0</span>
            <span className="text-xs">answers</span>
          </div>
          
          {/* Views */}
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>0</span>
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {title || 'Your question title will appear here...'}
          </h3>

          {/* Content Preview */}
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            {content ? (
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="italic text-gray-500 dark:text-gray-400">
                Your question content will appear here...
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <span
                  key={tag._id || tag.id || index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                >
                  {tag.name}
                </span>
              ))
            ) : (
              <span className="text-gray-500 dark:text-gray-400 italic text-sm">
                Tags will appear here...
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>asked just now</span>
              </span>
            </div>

            {/* Author Info */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                </div>
                <span>{authorName}</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
