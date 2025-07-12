import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['link', 'image', 'code-block'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'link', 'image', 'code-block'
];

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing...", 
  height = "300px" 
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const toolbar = editor.getModule('toolbar');
      
      // Custom link handler
      toolbar.addHandler('link', () => {
        const range = editor.getSelection();
        if (range) {
          const url = prompt('Enter the URL:');
          if (url) {
            editor.insertText(range.index, url, 'link', url);
          }
        }
      });
    }
  }, []);

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ 
          height: height,
          borderRadius: '0.5rem',
        }}
        className="dark:text-white"
      />
    </div>
  );
}
