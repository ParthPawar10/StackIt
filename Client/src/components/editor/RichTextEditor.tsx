import { useState } from 'react';
import { Bold, Italic, Link, List, Code } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing...", 
  height = "300px" 
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const formatValue = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => insertFormatting('**', '**')}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('*', '*')}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('`', '`')}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('- ')}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL:');
            const text = prompt('Enter link text:') || 'Link';
            if (url) insertFormatting(`[${text}](${url})`);
          }}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Link"
        >
          <Link className="w-4 h-4" />
        </button>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      {isPreview ? (
        <div 
          className="p-4 prose prose-sm max-w-none dark:prose-invert"
          style={{ minHeight: height }}
          dangerouslySetInnerHTML={{ __html: formatValue(value) }}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 border-0 resize-none focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          style={{ height }}
        />
      )}
    </div>
  );
}
