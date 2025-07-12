import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Plus, TrendingUp, Clock, MessageSquare, Eye } from 'lucide-react';
import type { Question } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import QuestionCard from '../components/questions/QuestionCard.tsx';
import toast from 'react-hot-toast';

interface SortOption {
  value: string;
  label: string;
  icon: any;
}

const sortOptions: SortOption[] = [
  { value: 'newest', label: 'Newest', icon: Clock },
  { value: 'votes', label: 'Most Votes', icon: TrendingUp },
  { value: 'answers', label: 'Most Answers', icon: MessageSquare },
  { value: 'views', label: 'Most Views', icon: Eye }
];

export default function QuestionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [showFilters, setShowFilters] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadQuestions();
  }, [searchQuery, selectedTag, sortBy]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedTag) params.set('tag', selectedTag);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    setSearchParams(params);
  }, [searchQuery, selectedTag, sortBy, setSearchParams]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      let mockQuestions: Question[] = [
        {
          id: '1',
          title: 'How to implement authentication in React with TypeScript?',
          content: 'I need help with implementing user authentication in my React TypeScript application...',
          authorId: 'user1',
          author: {
            id: 'user1',
            username: 'johndoe',
            reputation: 1250,
            avatar: undefined
          },
          tags: [
            { id: 'react', name: 'react', count: 1500, createdAt: '2024-01-01' },
            { id: 'typescript', name: 'typescript', count: 1200, createdAt: '2024-01-01' },
            { id: 'auth', name: 'authentication', count: 800, createdAt: '2024-01-01' }
          ],
          votes: 15,
          views: 342,
          answers: [],
          answerCount: 3,
          hasAcceptedAnswer: true,
          acceptedAnswerId: 'answer1',
          createdAt: '2024-07-10T10:30:00Z',
          updatedAt: '2024-07-10T10:30:00Z',
          isEdited: false,
          isClosed: false,
          isBookmarked: false,
          userVote: null
        },
        {
          id: '2',
          title: 'Best practices for state management in large React applications',
          content: 'What are the recommended approaches for managing state in large-scale React applications?',
          authorId: 'user2',
          author: {
            id: 'user2',
            username: 'janedoe',
            reputation: 890,
            avatar: undefined
          },
          tags: [
            { id: 'react', name: 'react', count: 1500, createdAt: '2024-01-01' },
            { id: 'state-management', name: 'state-management', count: 450, createdAt: '2024-01-01' },
            { id: 'redux', name: 'redux', count: 320, createdAt: '2024-01-01' }
          ],
          votes: 8,
          views: 156,
          answers: [],
          answerCount: 2,
          hasAcceptedAnswer: false,
          acceptedAnswerId: undefined,
          createdAt: '2024-07-09T14:20:00Z',
          updatedAt: '2024-07-09T14:20:00Z',
          isEdited: false,
          isClosed: false,
          isBookmarked: false,
          userVote: null
        },
        {
          id: '3',
          title: 'How to optimize React app performance?',
          content: 'My React application is running slowly. What are some techniques to improve performance?',
          authorId: 'user3',
          author: {
            id: 'user3',
            username: 'alexsmith',
            reputation: 2100,
            avatar: undefined
          },
          tags: [
            { id: 'react', name: 'react', count: 1500, createdAt: '2024-01-01' },
            { id: 'performance', name: 'performance', count: 380, createdAt: '2024-01-01' },
            { id: 'optimization', name: 'optimization', count: 250, createdAt: '2024-01-01' }
          ],
          votes: 23,
          views: 892,
          answers: [],
          answerCount: 5,
          hasAcceptedAnswer: true,
          acceptedAnswerId: 'answer2',
          createdAt: '2024-07-08T09:15:00Z',
          updatedAt: '2024-07-08T09:15:00Z',
          isEdited: false,
          isClosed: false,
          isBookmarked: false,
          userVote: null
        },
        {
          id: '4',
          title: 'Understanding JavaScript closures with examples',
          content: 'Can someone explain JavaScript closures with practical examples?',
          authorId: 'user4',
          author: {
            id: 'user4',
            username: 'codecrafter',
            reputation: 1650,
            avatar: undefined
          },
          tags: [
            { id: 'javascript', name: 'javascript', count: 2100, createdAt: '2024-01-01' },
            { id: 'closures', name: 'closures', count: 180, createdAt: '2024-01-01' },
            { id: 'functions', name: 'functions', count: 420, createdAt: '2024-01-01' }
          ],
          votes: 12,
          views: 567,
          answers: [],
          answerCount: 4,
          hasAcceptedAnswer: false,
          acceptedAnswerId: undefined,
          createdAt: '2024-07-07T16:45:00Z',
          updatedAt: '2024-07-07T16:45:00Z',
          isEdited: false,
          isClosed: false,
          isBookmarked: false,
          userVote: null
        }
      ];

      // Apply filters
      if (searchQuery) {
        mockQuestions = mockQuestions.filter(q => 
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedTag) {
        mockQuestions = mockQuestions.filter(q => 
          q.tags.some(tag => tag.name.toLowerCase() === selectedTag.toLowerCase())
        );
      }

      // Apply sorting
      mockQuestions.sort((a, b) => {
        switch (sortBy) {
          case 'votes':
            return b.votes - a.votes;
          case 'answers':
            return b.answerCount - a.answerCount;
          case 'views':
            return b.views - a.views;
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

      setQuestions(mockQuestions);
    } catch (error) {
      console.error('Failed to load questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadQuestions();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
    setSortBy('newest');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {selectedTag ? `Questions tagged [${selectedTag}]` : 'All Questions'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {questions.length} question{questions.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        
        {isAuthenticated && (
          <Link
            to="/ask"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ask Question
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tag Filter
                </label>
                <input
                  type="text"
                  placeholder="Filter by tag..."
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  sortBy === option.value
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions List */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No questions found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || selectedTag
              ? 'Try adjusting your search criteria or filters.'
              : 'Be the first to ask a question!'}
          </p>
          {isAuthenticated && (
            <Link
              to="/ask"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ask the First Question
            </Link>
          )}
        </div>
      )}

      {/* Pagination placeholder */}
      {questions.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {questions.length} questions
          </div>
        </div>
      )}
    </div>
  );
}
