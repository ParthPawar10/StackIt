import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Clock,
  Tag as TagIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Question } from '../types';
import api from '../utils/api';

const Questions: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    tags: '',
  });

  useEffect(() => {
    fetchQuestions();
  }, [sortBy]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/questions?sort=${getSortQuery()}&search=${searchQuery}`);
      if (response.data.success) {
        setQuestions(response.data.data.questions || []);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSortQuery = () => {
    switch (sortBy) {
      case 'newest': return '-createdAt';
      case 'oldest': return 'createdAt';
      case 'votes': return '-votes.up.length';
      case 'views': return '-views';
      default: return '-createdAt';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleNewQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    try {
      const tags = newQuestion.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const response = await api.post('/questions', {
        title: newQuestion.title,
        content: newQuestion.content,
        tags,
      });

      if (response.data.success) {
        setNewQuestion({ title: '', content: '', tags: '' });
        setShowNewQuestionForm(false);
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
          <p className="text-gray-600 mt-1">
            {questions.length} questions found
          </p>
        </div>
        
        {isAuthenticated && (
          <button
            onClick={() => setShowNewQuestionForm(!showNewQuestionForm)}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Ask Question
          </button>
        )}
      </div>

      {/* New Question Form */}
      {showNewQuestionForm && isAuthenticated && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ask a New Question</h3>
          <form onSubmit={handleNewQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                className="input-field"
                placeholder="What's your question? Be specific and clear."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={6}
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                className="input-field resize-none"
                placeholder="Provide more details about your question. Include any relevant code, error messages, or context."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={newQuestion.tags}
                onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                className="input-field"
                placeholder="Enter tags separated by commas (e.g., react, javascript, typescript)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add up to 5 tags to help others find your question
              </p>
            </div>
            
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                Post Question
              </button>
              <button
                type="button"
                onClick={() => setShowNewQuestionForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
                placeholder="Search questions..."
              />
            </div>
          </form>
          
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field pl-10 pr-8 appearance-none bg-white"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="votes">Most Voted</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? `No questions match your search for "${searchQuery}"`
              : 'Be the first to ask a question!'
            }
          </p>
          {isAuthenticated && !showNewQuestionForm && (
            <button
              onClick={() => setShowNewQuestionForm(true)}
              className="btn-primary"
            >
              Ask the First Question
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question._id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                {/* Vote Stats */}
                <div className="flex flex-col items-center space-y-2 min-w-[80px]">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                      <ThumbsUp size={16} className="text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 mt-1">
                      {getVoteCount(question.votes)}
                    </span>
                    <span className="text-xs text-gray-500">votes</span>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                      <MessageSquare size={16} className="text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 mt-1">
                      {question.answers.length}
                    </span>
                    <span className="text-xs text-gray-500">answers</span>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                      <Eye size={16} className="text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 mt-1">
                      {question.views}
                    </span>
                    <span className="text-xs text-gray-500">views</span>
                  </div>
                </div>

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors cursor-pointer">
                    {question.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {question.content.substring(0, 200)}
                    {question.content.length > 200 && '...'}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.map((tag) => (
                      <span 
                        key={tag._id}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        <TagIcon size={12} className="mr-1" />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatTimeAgo(question.createdAt)}
                      </span>
                      <span>
                        by <span className="font-medium text-gray-700">{question.author.username}</span>
                      </span>
                    </div>
                    
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      question.status === 'answered' 
                        ? 'bg-green-100 text-green-700' 
                        : question.status === 'closed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {question.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions;
