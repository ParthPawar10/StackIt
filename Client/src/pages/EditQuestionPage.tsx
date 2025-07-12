import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RichTextEditor from '../components/editor/RichTextEditor';
import TagInput from '../components/tags/TagInput';
import type { Question, Tag } from '../types';
import * as questionService from '../services/questionService';
import toast from 'react-hot-toast';

export default function EditQuestionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadQuestion();
    }
  }, [id]);

  const loadQuestion = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const questionData = await questionService.getQuestionById(id);
      
      // Check if user owns this question
      if (questionData.author._id !== user?.id && questionData.author.id !== user?.id) {
        toast.error('You can only edit your own questions');
        navigate('/my-questions');
        return;
      }
      
      setQuestion(questionData);
      setTitle(questionData.title);
      setContent(questionData.description || questionData.content || '');
      setTags(questionData.tags || []);
    } catch (error) {
      console.error('Failed to load question:', error);
      setError('Failed to load question');
      toast.error('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id || !question) return;
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter question content');
      return;
    }

    try {
      setSaving(true);
      
      await questionService.updateQuestion(id, {
        title: title.trim(),
        description: content,
        tags: tags.map(tag => tag.name)
      });
      
      toast.success('Question updated successfully!');
      navigate(`/questions/${id}`);
    } catch (error) {
      console.error('Failed to update question:', error);
      toast.error('Failed to update question');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error || 'Question not found'}</div>
          <button 
            onClick={() => navigate('/my-questions')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to My Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Question
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCancel}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Question Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your programming question? Be specific."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Question Details *
          </label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Provide all the details about your question. Include any code, error messages, or specific scenarios."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <TagInput
            selectedTags={tags}
            onTagsChange={setTags}
            placeholder="Add tags to describe what your question is about"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add up to 5 tags to describe what your question is about
          </p>
        </div>

        {/* Preview */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preview</h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {title || 'Question Title'}
            </h4>
            <div className="prose dark:prose-invert max-w-none mb-4">
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">Question content will appear here...</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag._id || tag.id || tag.name}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                >
                  {tag.name}
                </span>
              ))}
              {tags.length === 0 && (
                <span className="text-gray-500 dark:text-gray-400 italic">No tags selected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          Editing Guidelines
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Make sure your edits improve the question's clarity</li>
          <li>• Fix any spelling or grammatical errors</li>
          <li>• Add missing information that could help answerers</li>
          <li>• Update tags if the focus of your question has changed</li>
          <li>• Edited questions will show an "edited" timestamp</li>
        </ul>
      </div>
    </div>
  );
}
