import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, Bookmark, Share2, Flag, Edit, Trash2, CheckCircle, User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Question, Answer } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import RichTextEditor from '../components/editor/RichTextEditor.tsx';
import toast from 'react-hot-toast';

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadQuestionAndAnswers();
  }, [id]);

  const loadQuestionAndAnswers = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockQuestion: Question = {
        id: id || '1',
        title: 'How to implement authentication in React with TypeScript?',
        content: '<p>I\'m building a React application with TypeScript and need to implement user authentication. I want to use JWT tokens and have the following requirements:</p><ul><li>Login and registration forms</li><li>Protected routes</li><li>Token refresh mechanism</li><li>Persistent login state</li></ul><p>What\'s the best approach to implement this? I\'ve looked at various libraries but I\'m not sure which one to choose.</p><pre><code>// Example of what I\'m trying to achieve\nconst ProtectedRoute = ({ children }) => {\n  const { isAuthenticated } = useAuth();\n  return isAuthenticated ? children : <Navigate to="/login" />;\n};</code></pre>',
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
        answerCount: 2,
        hasAcceptedAnswer: true,
        acceptedAnswerId: 'answer1',
        createdAt: '2024-07-10T10:30:00Z',
        updatedAt: '2024-07-10T10:30:00Z',
        isEdited: false,
        isClosed: false,
        isBookmarked: false,
        userVote: null
      };

      const mockAnswers: Answer[] = [
        {
          id: 'answer1',
          content: '<p>For implementing authentication in React with TypeScript, I recommend using React Context API along with a custom hook. Here\'s a comprehensive solution:</p><h3>1. Create an Auth Context</h3><pre><code>// AuthContext.tsx\ninterface AuthContextType {\n  user: User | null;\n  login: (credentials: LoginCredentials) => Promise<void>;\n  logout: () => void;\n  isAuthenticated: boolean;\n}\n\nconst AuthContext = createContext<AuthContextType | undefined>(undefined);</code></pre><p>This approach gives you:</p><ul><li>Type safety with TypeScript</li><li>Centralized auth state management</li><li>Easy integration with protected routes</li><li>Token refresh capabilities</li></ul>',
          questionId: id || '1',
          authorId: 'user2',
          author: {
            id: 'user2',
            username: 'janedoe',
            reputation: 2100,
            avatar: undefined
          },
          votes: 8,
          isAccepted: true,
          createdAt: '2024-07-10T11:15:00Z',
          updatedAt: '2024-07-10T11:15:00Z',
          isEdited: false,
          comments: [],
          userVote: null
        },
        {
          id: 'answer2',
          content: '<p>Another approach is to use a third-party library like Auth0 or Firebase Auth, which can save you a lot of development time:</p><pre><code>npm install @auth0/auth0-react</code></pre><p>This provides out-of-the-box features like:</p><ul><li>Social login integration</li><li>Multi-factor authentication</li><li>User management</li><li>Security best practices</li></ul>',
          questionId: id || '1',
          authorId: 'user3',
          author: {
            id: 'user3',
            username: 'alexsmith',
            reputation: 890,
            avatar: undefined
          },
          votes: 3,
          isAccepted: false,
          createdAt: '2024-07-11T09:20:00Z',
          updatedAt: '2024-07-11T09:20:00Z',
          isEdited: false,
          comments: [],
          userVote: null
        }
      ];

      setQuestion(mockQuestion);
      setAnswers(mockAnswers);
    } catch (error) {
      console.error('Failed to load question:', error);
      toast.error('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (type: 'up' | 'down', targetId: string, targetType: 'question' | 'answer') => {
    console.log(`Vote ${type} on ${targetType} ${targetId}`);
    toast.success(`Voted ${type}!`);
  };

  const handleBookmark = () => {
    console.log('Bookmark question');
    toast.success('Bookmarked!');
  };

  const handleAcceptAnswer = (answerId: string) => {
    console.log(`Accept answer ${answerId}`);
    toast.success('Answer accepted!');
  };

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) {
      toast.error('Please write an answer');
      return;
    }

    setIsSubmittingAnswer(true);
    try {
      // Mock API call
      console.log('Submitting answer:', answerContent);
      toast.success('Answer posted successfully!');
      setAnswerContent('');
      // Reload answers
      loadQuestionAndAnswers();
    } catch (error) {
      toast.error('Failed to post answer');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Question not found</h1>
        <Link to="/" className="text-blue-600 hover:underline">Return to homepage</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Question */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex gap-6">
          {/* Vote Column */}
          <div className="flex flex-col items-center space-y-2 min-w-[60px]">
            <button
              onClick={() => handleVote('up', question.id, 'question')}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                question.userVote === 'up' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <ArrowUp className="w-6 h-6" />
            </button>
            <span className={`text-xl font-bold ${
              question.votes > 0 ? 'text-green-600 dark:text-green-400' :
              question.votes < 0 ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              {question.votes}
            </span>
            <button
              onClick={() => handleVote('down', question.id, 'question')}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                question.userVote === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <ArrowDown className="w-6 h-6" />
            </button>
            
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                question.isBookmarked ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {question.title}
            </h1>

            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <span>Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
              <span>Viewed {question.views} times</span>
              {question.isEdited && <span>Modified {formatDistanceToNow(new Date(question.updatedAt), { addSuffix: true })}</span>}
            </div>

            <div 
              className="prose dark:prose-invert max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: question.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tags/${tag.name}`}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  {tag.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <Flag className="w-4 h-4" />
                  <span>Flag</span>
                </button>
                {user?.id === question.authorId && (
                  <>
                    <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button className="flex items-center space-x-1 text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-3">
                <Link 
                  to={`/users/${question.author.id}`}
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {question.author.avatar ? (
                    <img 
                      src={question.author.avatar} 
                      alt={question.author.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{question.author.username}</div>
                    <div className="text-xs text-gray-500">{question.author.reputation} reputation</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {answers.length} Answer{answers.length !== 1 ? 's' : ''}
        </h2>

        <div className="space-y-6">
          {answers.map((answer) => (
            <div
              key={answer.id}
              className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${
                answer.isAccepted ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' : ''
              }`}
            >
              <div className="flex gap-6">
                {/* Vote Column */}
                <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                  <button
                    onClick={() => handleVote('up', answer.id, 'answer')}
                    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      answer.userVote === 'up' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <span className={`text-lg font-bold ${
                    answer.votes > 0 ? 'text-green-600 dark:text-green-400' :
                    answer.votes < 0 ? 'text-red-600 dark:text-red-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {answer.votes}
                  </span>
                  <button
                    onClick={() => handleVote('down', answer.id, 'answer')}
                    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      answer.userVote === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <ArrowDown className="w-5 h-5" />
                  </button>
                  
                  {user?.id === question.authorId && !answer.isAccepted && (
                    <button
                      onClick={() => handleAcceptAnswer(answer.id)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-green-600"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  
                  {answer.isAccepted && (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                </div>

                {/* Answer Content */}
                <div className="flex-1">
                  {answer.isAccepted && (
                    <div className="flex items-center space-x-2 mb-4 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Accepted Answer</span>
                    </div>
                  )}

                  <div 
                    className="prose dark:prose-invert max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: answer.content }}
                  />

                  {/* Answer Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <Flag className="w-4 h-4" />
                        <span>Flag</span>
                      </button>
                      {user?.id === answer.authorId && (
                        <>
                          <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button className="flex items-center space-x-1 text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          {answer.isEdited ? 'edited' : 'answered'} {formatDistanceToNow(new Date(answer.updatedAt), { addSuffix: true })}
                        </span>
                      </span>
                      <Link 
                        to={`/users/${answer.author.id}`}
                        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {answer.author.avatar ? (
                          <img 
                            src={answer.author.avatar} 
                            alt={answer.author.username}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium">{answer.author.username}</div>
                          <div className="text-xs text-gray-500">{answer.author.reputation}</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Form */}
      {isAuthenticated ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Answer
          </h3>
          
          <RichTextEditor
            value={answerContent}
            onChange={setAnswerContent}
            placeholder="Write your answer here..."
            height="250px"
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmittingAnswer || !answerContent.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingAnswer ? 'Posting...' : 'Post Your Answer'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You must be logged in to answer this question.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}
