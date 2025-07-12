export interface Question {
  _id: string;
  id?: string; // Keep for backward compatibility
  title: string;
  description: string;
  content?: string; // Keep for backward compatibility
  authorId?: string;
  author: {
    _id: string;
    id?: string;
    username: string;
    avatar?: string;
    reputation: number;
  };
  tags: Tag[];
  votes: {
    upvotes: string[];
    downvotes: string[];
  };
  voteScore: number;
  views: number;
  answers?: Answer[];
  answerCount: number;
  hasAcceptedAnswer?: boolean;
  acceptedAnswer?: string | null;
  acceptedAnswerId?: string;
  createdAt: string;
  updatedAt: string;
  isEdited?: boolean;
  editHistory?: EditHistory[];
  isClosed?: boolean;
  closedReason?: string;
  isBookmarked?: boolean;
  userVote?: 'up' | 'down' | null;
  isActive: boolean;
  isPinned: boolean;
  viewedBy: string[];
}

export interface Answer {
  id: string;
  content: string;
  questionId: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    reputation: number;
  };
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  editHistory?: EditHistory[];
  comments: Comment[];
  userVote?: 'up' | 'down' | null;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    reputation: number;
  };
  targetId: string; // question or answer ID
  targetType: 'question' | 'answer';
  votes: number;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  userVote?: 'up' | 'down' | null;
}

export interface Tag {
  _id: string;
  id?: string; // Keep for backward compatibility
  name: string;
  description?: string;
  count?: number;
  color?: string;
  isFollowed?: boolean;
  createdAt?: string;
}

export interface Vote {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'question' | 'answer' | 'comment';
  type: 'up' | 'down';
  createdAt: string;
}

export interface EditHistory {
  id: string;
  editorId: string;
  editor: {
    id: string;
    username: string;
  };
  originalContent: string;
  editedContent: string;
  reason?: string;
  createdAt: string;
}

export interface SearchFilters {
  query?: string;
  tags?: string[];
  author?: string;
  hasAnswer?: boolean;
  isAccepted?: boolean;
  minVotes?: number;
  maxVotes?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'newest' | 'oldest' | 'votes' | 'answers' | 'views';
  sortOrder?: 'asc' | 'desc';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'answer' | 'comment' | 'vote' | 'mention' | 'badge' | 'system';
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: 'question' | 'answer' | 'comment';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'bronze' | 'silver' | 'gold';
  requirement: string;
  isRare: boolean;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  badge: Badge;
  earnedAt: string;
  progress?: number;
  maxProgress?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  reputation: number;
  joinDate: string;
  lastSeen: string;
  isOnline: boolean;
  badges?: {
    id: string;
    name: string;
    description: string;
    icon: string;
  }[];
  stats: {
    questionsAsked: number;
    answersGiven: number;
    totalViews: number;
    upvotesReceived: number;
    downvotesReceived: number;
    acceptedAnswers: number;
    bountyWon: number;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    profileVisibility: 'public' | 'private';
  };
}

export interface CreateQuestionData {
  title: string;
  description: string;
  tags: string[];
}

export interface QuestionFilters {
  page?: number;
  limit?: number;
  sort?: 'recent' | 'popular' | 'votes' | 'unanswered';
  tags?: string[];
  search?: string;
  author?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}
