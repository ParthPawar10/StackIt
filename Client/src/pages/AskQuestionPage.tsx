import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, X, HelpCircle, Lightbulb, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Tag } from '../types/index.ts';
import RichTextEditor from '../components/editor/RichTextEditor.tsx';
import TagInput from '../components/tags/TagInput.tsx';
import UserStatsCard from '../components/common/UserStatsCard.tsx';
import QuestionPreview from '../components/questions/QuestionPreview.tsx';
import * as questionService from '../services/questionService.ts';

const questionSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(150, 'Title must be less than 150 characters'),
  description: z.string().min(30, 'Question body must be at least 30 characters'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(5, 'Maximum 5 tags allowed'),
});

type QuestionForm = z.infer<typeof questionSchema>;

const questionTemplates = [
  {
    id: 'general',
    name: 'General Question',
    title: '',
    content: `<p>I'm trying to [describe what you want to achieve]</p>

<p><strong>What I've tried:</strong></p>
<ul>
<li>[List what you've already attempted]</li>
</ul>

<p><strong>Expected result:</strong></p>
<p>[Describe what you expected to happen]</p>

<p><strong>Actual result:</strong></p>
<p>[Describe what actually happened]</p>`,
    tags: []
  },
  {
    id: 'bug',
    name: 'Bug Report',
    title: '',
    content: `<p><strong>Bug Description:</strong></p>
<p>[Brief description of the bug]</p>

<p><strong>Steps to Reproduce:</strong></p>
<ol>
<li>[First step]</li>
<li>[Second step]</li>
<li>[Third step]</li>
</ol>

<p><strong>Expected Behavior:</strong></p>
<p>[What should happen]</p>

<p><strong>Actual Behavior:</strong></p>
<p>[What actually happens]</p>

<p><strong>Environment:</strong></p>
<ul>
<li>OS: [Your operating system]</li>
<li>Browser: [Your browser and version]</li>
<li>Framework: [Framework and version]</li>
</ul>

<p><strong>Error Messages:</strong></p>
<pre><code>[Paste any error messages here]</code></pre>`,
    tags: ['bug', 'debugging']
  },
  {
    id: 'code-review',
    name: 'Code Review',
    title: '',
    content: `<p><strong>Context:</strong></p>
<p>[Explain what your code is supposed to do]</p>

<p><strong>Code:</strong></p>
<pre><code>[Paste your code here]</code></pre>

<p><strong>Concerns:</strong></p>
<ul>
<li>[List your specific concerns or questions]</li>
</ul>

<p><strong>What I'm looking for:</strong></p>
<ul>
<li>Performance improvements</li>
<li>Best practices</li>
<li>Code readability</li>
<li>Potential bugs</li>
</ul>`,
    tags: ['code-review']
  },
  {
    id: 'how-to',
    name: 'How-to Question',
    title: 'How to ',
    content: `<p><strong>What I want to achieve:</strong></p>
<p>[Describe the end goal]</p>

<p><strong>Current approach:</strong></p>
<p>[Describe what you're currently doing]</p>

<p><strong>Challenges:</strong></p>
<ul>
<li>[List the specific challenges or roadblocks]</li>
</ul>

<p><strong>Constraints:</strong></p>
<ul>
<li>[Any limitations or requirements]</li>
</ul>`,
    tags: ['how-to']
  }
];

export default function AskQuestionPage() {
  const [isPreview, setIsPreview] = useState(false);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const [draftSaved, setDraftSaved] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
  });

  const title = watch('title');

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const saveDraft = () => {
      if (title || content || selectedTags.length > 0) {
        const draft = {
          title: title || '',
          content,
          tags: selectedTags,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('question-draft', JSON.stringify(draft));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      }
    };

    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, [title, content, selectedTags]);

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('question-draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setValue('title', draft.title);
        setContent(draft.content);
        setSelectedTags(draft.tags || []);
        setValue('description', draft.content);
        setValue('tags', (draft.tags || []).map((tag: Tag) => tag.name));
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: QuestionForm) => {
    setIsLoading(true);
    try {
      const questionData = {
        title: data.title,
        description: content,
        tags: selectedTags.map(tag => tag.name)
      };
      
      const newQuestion = await questionService.createQuestion(questionData);
      
      // Clear draft after successful submission
      localStorage.removeItem('question-draft');
      
      toast.success('Question posted successfully!');
      navigate(`/questions/${newQuestion._id || newQuestion.id}`);
    } catch (error: any) {
      console.error('Failed to create question:', error);
      toast.error(error.response?.data?.message || 'Failed to post question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setValue('description', newContent);
  };

  const handleTagsChange = (tags: Tag[]) => {
    setSelectedTags(tags);
    setValue('tags', tags.map(tag => tag.name));
  };

  const applyTemplate = (template: typeof questionTemplates[0]) => {
    if (template.title) {
      setValue('title', template.title);
    }
    setContent(template.content);
    setValue('description', template.content);
    
    // Convert string tags to Tag objects
    const templateTags: Tag[] = template.tags.map(tagName => ({
      _id: `temp-${tagName}`,
      name: tagName,
      color: '#3b82f6'
    }));
    setSelectedTags(templateTags);
    setValue('tags', template.tags);
    setShowTemplates(false);
  };

  const clearDraft = () => {
    if (confirm('Are you sure you want to clear all content?')) {
      reset();
      setContent('');
      setSelectedTags([]);
      localStorage.removeItem('question-draft');
      setShowTemplates(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ask a Question</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Get help from the community by asking a clear, detailed question.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {draftSaved && (
              <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4 mr-1" />
                Draft saved
              </span>
            )}
            <button
              type="button"
              onClick={clearDraft}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-3">
          {/* Question Templates */}
          {showTemplates && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Choose a template to get started
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTemplates(false)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {questionTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="p-2 text-sm text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 rounded hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          )}

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
            <div className="min-h-[300px]">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Question Preview
              </h4>
              <QuestionPreview
                title={title || ''}
                content={content}
                tags={selectedTags}
              />
            </div>
          ) : (
            <RichTextEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Include all the information someone would need to answer your question..."
            />
          )}
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
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
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* User Stats */}
          <div className="mb-6">
            <UserStatsCard />
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h3 className="flex items-center text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
              <HelpCircle className="w-4 h-4 mr-2" />
              How to ask a good question
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>• Search existing questions first</li>
              <li>• Be specific in your title</li>
              <li>• Include relevant code samples</li>
              <li>• Describe what you've tried</li>
              <li>• Use appropriate tags</li>
            </ul>
          </div>

          {/* Question Quality Tips */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <h3 className="flex items-center text-sm font-semibold text-green-900 dark:text-green-100 mb-3">
              <Lightbulb className="w-4 h-4 mr-2" />
              Quality Tips
            </h3>
            <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
              <li>• Proofread before posting</li>
              <li>• Use proper formatting</li>
              <li>• Include error messages</li>
              <li>• Explain expected vs actual results</li>
            </ul>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="flex items-center text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Before you post
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Make sure to search for existing answers. Your question might already be solved!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
