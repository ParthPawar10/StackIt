import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Tag } from '../types/index.ts';
import RichTextEditor from '../components/editor/RichTextEditor.tsx';
import TagInput from '../components/tags/TagInput.tsx';

const questionSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(150, 'Title must be less than 150 characters'),
  content: z.string().min(30, 'Question body must be at least 30 characters'),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string(),
    count: z.number(),
    createdAt: z.string()
  })).min(1, 'At least one tag is required').max(5, 'Maximum 5 tags allowed'),
});

type QuestionForm = z.infer<typeof questionSchema>;

export default function AskQuestionPage() {
  const [isPreview, setIsPreview] = useState(false);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
  });

  const title = watch('title');

  const onSubmit = async (data: QuestionForm) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to create question
      console.log('Creating question:', { ...data, content, tags: selectedTags });
      toast.success('Question posted successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to post question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setValue('content', newContent);
  };

  const handleTagsChange = (tags: Tag[]) => {
    setSelectedTags(tags);
    setValue('tags', tags);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ask a Question</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Get help from the community by asking a clear, detailed question.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            placeholder="What's your programming question? Be specific."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {title?.length || 0}/150 characters
          </p>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Body
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Eye className="w-4 h-4 mr-1" />
                {isPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>

          {isPreview ? (
            <div className="min-h-[300px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            <RichTextEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Include all the information someone would need to answer your question..."
            />
          )}
          {errors.content && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content.message}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <TagInput
            selectedTags={selectedTags}
            onTagsChange={handleTagsChange}
            placeholder="Add tags to describe what your question is about..."
          />
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tags.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add up to 5 tags to describe what your question is about.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Posting...' : 'Post Question'}
          </button>
        </div>
      </form>

      {/* Tips Sidebar */}
      <div className="mt-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            How to ask a good question
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• Search to see if your question has been asked before</li>
            <li>• Summarize the problem in the title</li>
            <li>• Describe what you've tried and what you expected</li>
            <li>• Include relevant code, error messages, and details</li>
            <li>• Use proper tags to categorize your question</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
