'use client';
import { useState } from 'react';

export default function ImageUpload({ onFileUpload }) {
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Pass file to parent
      onFileUpload(file);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-md hover:bg-white/20 transition">
            Choose Image
          </div>
        </label>
      </div>
      {previewUrl && (
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}