import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Tag } from '../../types/index.ts';

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  maxTags?: number;
}

// Mock popular tags - in a real app this would come from an API
const popularTags: Tag[] = [
  { id: '1', name: 'javascript', count: 25000, createdAt: '2024-01-01' },
  { id: '2', name: 'react', count: 18000, createdAt: '2024-01-01' },
  { id: '3', name: 'typescript', count: 15000, createdAt: '2024-01-01' },
  { id: '4', name: 'node.js', count: 12000, createdAt: '2024-01-01' },
  { id: '5', name: 'python', count: 22000, createdAt: '2024-01-01' },
  { id: '6', name: 'html', count: 20000, createdAt: '2024-01-01' },
  { id: '7', name: 'css', count: 18500, createdAt: '2024-01-01' },
  { id: '8', name: 'express', count: 8000, createdAt: '2024-01-01' },
  { id: '9', name: 'mongodb', count: 9000, createdAt: '2024-01-01' },
  { id: '10', name: 'api', count: 11000, createdAt: '2024-01-01' },
];

export default function TagInput({ 
  selectedTags, 
  onTagsChange, 
  placeholder = "Add tags...",
  maxTags = 5 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = popularTags.filter(tag => 
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.some(selected => selected.id === tag.id)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, selectedTags]);

  const addTag = (tag: Tag) => {
    if (selectedTags.length < maxTags && !selectedTags.some(t => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  const createNewTag = (name: string) => {
    const newTag: Tag = {
      id: `new-${Date.now()}`,
      name: name.toLowerCase(),
      count: 0,
      createdAt: new Date().toISOString()
    };
    addTag(newTag);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        addTag(suggestions[activeSuggestionIndex]);
      } else if (inputValue.trim() && selectedTags.length < maxTags) {
        createNewTag(inputValue.trim());
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[42px]">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-md"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {selectedTags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={selectedTags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((tag, index) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                index === activeSuggestionIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-gray-900 dark:text-white">{tag.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {tag.count.toLocaleString()} questions
              </span>
            </button>
          ))}
          
          {inputValue.trim() && !suggestions.some(tag => tag.name === inputValue.toLowerCase()) && (
            <button
              type="button"
              onClick={() => createNewTag(inputValue.trim())}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-600 ${
                activeSuggestionIndex === suggestions.length ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-gray-900 dark:text-white">
                Create new tag: <strong>{inputValue.toLowerCase()}</strong>
              </span>
            </button>
          )}
        </div>
      )}

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {selectedTags.length}/{maxTags} tags selected
      </p>
    </div>
  );
}
