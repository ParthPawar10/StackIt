import { useState, useEffect } from 'react';
import { Search, Tag as TagIcon, TrendingUp, Users, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tag } from '../types/index.ts';
import toast from 'react-hot-toast';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'newest'>('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTags();
  }, [sortBy]);

  const loadTags = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockTags: Tag[] = [
        {
          id: 'react',
          name: 'react',
          description: 'A JavaScript library for building user interfaces',
          count: 1523,
          color: '#61dafb',
          isFollowed: false,
          createdAt: '2022-01-01T00:00:00Z'
        },
        {
          id: 'typescript',
          name: 'typescript',
          description: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript',
          count: 1245,
          color: '#3178c6',
          isFollowed: true,
          createdAt: '2022-01-01T00:00:00Z'
        },
        {
          id: 'javascript',
          name: 'javascript',
          description: 'High-level, interpreted programming language. It is a language which is also characterized as dynamic, weakly typed, prototype-based and multi-paradigm.',
          count: 2150,
          color: '#f7df1e',
          isFollowed: false,
          createdAt: '2022-01-01T00:00:00Z'
        },
        {
          id: 'nodejs',
          name: 'node.js',
          description: 'Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside of a browser.',
          count: 890,
          color: '#339933',
          isFollowed: false,
          createdAt: '2022-01-01T00:00:00Z'
        },
        {
          id: 'python',
          name: 'python',
          description: 'Python is a multi-paradigm, dynamically typed, multipurpose programming language.',
          count: 1867,
          color: '#3776ab',
          isFollowed: true,
          createdAt: '2022-01-01T00:00:00Z'
        },
        {
          id: 'css',
          name: 'css',
          description: 'Cascading Style Sheets (CSS) is a style sheet language used for describing the presentation of a document written in HTML or XML.',
          count: 1456,
          color: '#1572b6',
          isFollowed: false,
          createdAt: '2022-01-01T00:00:00Z'
        },
        {
          id: 'html',
          name: 'html',
          description: 'HyperText Markup Language (HTML) is the standard markup language for creating web pages and web applications.',
          count: 1234,
          color: '#e34f26',
          isFollowed: false,
          createdAt: '2022-01-01T00:00:00Z'
        },
        {
          id: 'vue',
          name: 'vue.js',
          description: 'Vue.js is a progressive JavaScript framework for building user interfaces.',
          count: 678,
          color: '#4fc08d',
          isFollowed: false,
          createdAt: '2022-01-01T00:00:00Z'
        },
        {
          id: 'angular',
          name: 'angular',
          description: 'Angular is a TypeScript-based open-source web application framework.',
          count: 543,
          color: '#dd0031',
          isFollowed: false,
          createdAt: '2022-01-01T00:00:00Z'
        },
        {
          id: 'nextjs',
          name: 'next.js',
          description: 'Next.js is a React framework that enables functionality such as server-side rendering and generating static websites.',
          count: 432,
          color: '#000000',
          isFollowed: false,
          createdAt: '2022-01-01T00:00:00Z'
        }
      ];

      // Sort tags based on selected criteria
      const sortedTags = [...mockTags].sort((a, b) => {
        switch (sortBy) {
          case 'popular':
            return b.count - a.count;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
      });

      setTags(sortedTags);
    } catch (error) {
      console.error('Failed to load tags:', error);
      toast.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowTag = (tagId: string) => {
    setTags(prevTags =>
      prevTags.map(tag =>
        tag.id === tagId ? { ...tag, isFollowed: !tag.isFollowed } : tag
      )
    );
    toast.success('Tag preference updated!');
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tag.description && tag.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Tags</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          A tag is a keyword or label that categorizes your question with other, similar questions. 
          Using the right tags makes it easier for others to find and answer your question.
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'name' | 'newest')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="popular">Popular</option>
              <option value="name">Name</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <TagIcon className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{filteredTags.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tags</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredTags.reduce((acc, tag) => acc + tag.count, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredTags.filter(tag => tag.isFollowed).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tags Grid */}
      {filteredTags.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <Link
                  to={`/questions?tag=${tag.name}`}
                  className="flex items-center space-x-2 group"
                >
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-white group-hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: tag.color || '#6b7280' }}
                  >
                    {tag.name}
                  </span>
                </Link>
                <button
                  onClick={() => handleFollowTag(tag.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    tag.isFollowed
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag.isFollowed ? 'Following' : 'Follow'}
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {tag.description || 'No description available.'}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {tag.count.toLocaleString()} questions
                </span>
                <Link
                  to={`/questions?tag=${tag.name}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  View questions
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No tags found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery 
              ? `No tags match your search for "${searchQuery}"`
              : 'No tags available at the moment'
            }
          </p>
        </div>
      )}

      {/* Popular Tags Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Most Popular Tags</h2>
        <div className="flex flex-wrap gap-3">
          {tags
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map((tag) => (
              <Link
                key={tag.id}
                to={`/questions?tag=${tag.name}`}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color || '#6b7280' }}
                />
                <span className="font-medium">{tag.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({tag.count})
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
