// components/SourceCodeUploader.jsx
'use client';

import React, { useState } from 'react';

const SourceCodeUploader = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    // Check file type (zip or other compressed formats)
    const validTypes = [
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream',
      'application/x-zip',
    ];
    
    if (!validTypes.includes(uploadedFile.type)) {
      setMessage('Please upload a .zip file.');
      return;
    }

    // Check file extension as fallback
    if (!uploadedFile.name.toLowerCase().endsWith('.zip')) {
      setMessage('Please upload a .zip file.');
      return;
    }

    // Check size (e.g., max 10MB)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setMessage('File is too large. Max size is 10MB.');
      return;
    }

    setFile(uploadedFile);
    setMessage('');
    
    // Notify parent component about the file
    if (onFileUpload) {
      onFileUpload(uploadedFile);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".zip"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-md hover:bg-white/20 transition">
            Choose ZIP File
          </div>
        </label>
        {file && (
          <div className="text-sm text-slate-300">
            <span className="font-medium">Selected:</span> {file.name}
          </div>
        )}
      </div>
      {message && (
        <p className="mt-2 text-sm text-rose-400">{message}</p>
      )}
    </div>
  );
};

export default SourceCodeUploader;