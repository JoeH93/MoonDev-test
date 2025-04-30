'use client';

import React, { useEffect, useState } from 'react';
import ImageUpload from './ImageUpload';
import SourceCodeUploader from './SourceCodeUploader';
import { supabase } from '@/lib/supabaseClient';
import { Spinner } from '../components/Spinner';

export default function DeveloperForm({ user }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    location: '',
    emailAddress: '',
    hobbies: '',
    profileImage: null,
    sourceCode: null,
    application_status: 'Pending',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (file) => {
    setFormData(prev => ({ ...prev, profileImage: file }));
  };

  const handleSourceCodeUpload = (file) => {
    setFormData(prev => ({ ...prev, sourceCode: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.fullName || !formData.emailAddress || !formData.sourceCode) {
        throw new Error('Full name, email address, and source code are required');
      }

          // 1. Upload profile image
      let profileImageUrl = null;
      if (formData.profileImage) {
        // Get the file extension from the original filename
        const fileExt = formData.profileImage.name.split('.').pop();
        
        // Create a unique path with timestamp and original extension
        const imagePath = `profile-images/${Date.now()}.${fileExt}`;

        // Upload the file
        const { data: imageData, error: imageError } = await supabase.storage
          .from('profile-images')
          .upload(imagePath, formData.profileImage, {
            contentType: formData.profileImage.type,
            upsert: false // Don't overwrite existing files
          });

        if (imageError) throw imageError;

        // Get public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from('profile-images')
          .getPublicUrl(imageData.path);

        profileImageUrl = publicUrl;
      }

     // 2. Upload source code (ZIP only)
      let sourceCodeUrl = null;
      if (formData.sourceCode) {
        try {
          // 1. Validate ZIP file
          const fileName = formData.sourceCode.name.toLowerCase();
          
          // Check extension
          if (!fileName.endsWith('.zip')) {
            throw new Error('Only .zip files are allowed');
          }

          // 2. Generate unique filename
          const uniqueId = Date.now() + '_' + Math.random().toString(36).substring(2, 8);
          const codePath = `src-codes/${uniqueId}_${fileName.replace(/[^a-z0-9.]/gi, '_')}`;

          // 3. Upload to src-codes bucket
          const { data: codeData, error: codeError } = await supabase.storage
            .from('src-codes')  // Your bucket name
            .upload(codePath, formData.sourceCode, {
              contentType: 'application/zip',
              upsert: false,
              cacheControl: '3600' // 1 hour cache
            });

          if (codeError) throw codeError;

          // 4. Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('src-codes')
            .getPublicUrl(codeData.path);

          sourceCodeUrl = publicUrl;
          if (!sourceCodeUrl) {
            throw new Error('Source code upload failed — public URL not generated.');
          }

          console.log(sourceCodeUrl);
          

        } catch (error) {
          console.error('Source code upload failed:', error);
          throw new Error(`Source code upload failed: ${error.message}`);
        }
      }
      // 3. Insert into database
      const { data: insertData, error: insertError } = await supabase
        .from('applications')
        .insert({
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          location: formData.location,
          email: formData.emailAddress,
          hobbies: formData.hobbies,
          profile_image_url: profileImageUrl,
          source_code_url: sourceCodeUrl,
          user_email: user.email,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        fullName: '',
        phoneNumber: '',
        location: '',
        emailAddress: '',
        hobbies: '',
        profileImage: null,
        sourceCode: null,
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message || 'An error occurred while submitting the form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg px-8 py-8 w-full max-w-xl text-white border border-white/10">
      {success ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold text-cyan-400">Thank you!</h3>
          <p className="mt-2 text-slate-200">Your developer profile has been submitted successfully.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white"
          >
            Submit Another
          </button>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-red-900/50 text-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* FORM FIELDS */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-300">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-300">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-300">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="emailAddress" className="block text-sm font-medium text-slate-300">
              Email Address *
            </label>
            <input
              type="email"
              name="emailAddress"
              id="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="hobbies" className="block text-sm font-medium text-slate-300">
              Hobbies/Interests
            </label>
            <textarea
              name="hobbies"
              id="hobbies"
              rows={3}
              value={formData.hobbies}
              onChange={handleChange}
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Profile Image
            </label>
            <ImageUpload onFileUpload={handleImageUpload} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Source Code Upload
            </label>
            <SourceCodeUploader onFileUpload={handleSourceCodeUpload} />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 
              (
                <Spinner/>
              )
              : 
              (
                'Submit Profile'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
