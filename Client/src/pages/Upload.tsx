import React, { useState, useCallback } from 'react';
import { Upload as UploadIcon, X, Image, File, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const Upload: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadResults, setUploadResults] = useState<Array<{
    file: File;
    status: 'uploading' | 'success' | 'error';
    url?: string;
    error?: string;
  }>>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return {
          file,
          status: 'success' as const,
          url: response.data.data.url,
        };
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      return {
        file,
        status: 'error' as const,
        error: error.response?.data?.message || error.message || 'Upload failed',
      };
    }
  };

  const handleUpload = async () => {
    if (!isAuthenticated) {
      alert('Please log in to upload files');
      return;
    }

    setUploadResults([]);
    
    for (const file of selectedFiles) {
      setUploadResults(prev => [...prev, { file, status: 'uploading' }]);
      
      const result = await uploadFile(file);
      
      setUploadResults(prev =>
        prev.map(item =>
          item.file === file ? result : item
        )
      );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image size={20} className="text-blue-500" />;
    }
    return <File size={20} className="text-gray-500" />;
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="card p-8">
          <UploadIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Files</h2>
          <p className="text-gray-600 mb-6">
            Please log in to upload and share files with the community.
          </p>
          <a href="/auth" className="btn-primary">
            Sign In to Upload
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Files</h1>
        <p className="text-gray-600">
          Share images, documents, and other files with the community
        </p>
      </div>

      {/* Upload Area */}
      <div className="card p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <UploadIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isDragActive ? 'Drop files here' : 'Choose files or drag them here'}
          </h3>
          <p className="text-gray-600 mb-4">
            Support for images, documents, and other file types up to 10MB
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
            accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          />
          <label
            htmlFor="file-input"
            className="btn-primary cursor-pointer inline-block"
          >
            Select Files
          </label>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Selected Files ({selectedFiles.length})
            </h3>
            <button
              onClick={handleUpload}
              className="btn-primary flex items-center"
            >
              <UploadIcon size={20} className="mr-2" />
              Upload All
            </button>
          </div>

          <div className="space-y-3">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Results</h3>
          <div className="space-y-3">
            {uploadResults.map((result, index) => (
              <div
                key={`${result.file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(result.file)}
                  <div>
                    <p className="font-medium text-gray-900">{result.file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(result.file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {result.status === 'uploading' && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                  )}
                  
                  {result.status === 'success' && (
                    <>
                      <CheckCircle className="text-green-500" size={20} />
                      {result.url && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View File
                        </a>
                      )}
                    </>
                  )}
                  
                  {result.status === 'error' && (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="text-red-500" size={20} />
                      <span className="text-red-600 text-sm">{result.error}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {uploadResults.every(result => result.status !== 'uploading') && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  setSelectedFiles([]);
                  setUploadResults([]);
                }}
                className="btn-secondary"
              >
                Upload More Files
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Upload Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Maximum file size: 10MB per file</li>
          <li>• Supported formats: Images (JPEG, PNG, GIF), Documents (PDF, DOC, TXT), Archives (ZIP, RAR)</li>
          <li>• Use descriptive filenames for better organization</li>
          <li>• Uploaded files can be used in questions and answers</li>
          <li>• Files are automatically scanned for security</li>
        </ul>
      </div>
    </div>
  );
};

export default Upload;
