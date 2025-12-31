import React, { useState, useRef } from 'react';
import api from '../utils/api';

const ImageUpload = ({ currentImage, onImageChange, label = 'Upload Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const inputId = useRef(`image-upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);

    try {
      // Use admin upload endpoint for content management
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      uploadFormData.append('uploadType', 'content');
      
      console.log('Uploading image:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Axios will automatically handle Content-Type for FormData (interceptor removes default header)
      const res = await api.post('/admin/upload', uploadFormData);
      
      if (res.data && res.data.url) {
        onImageChange(res.data.url);
        // Clear the file input so the same file can be uploaded again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error('No URL in response');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to upload image. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.error || 'Invalid file. Please check the file size and format.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      setPreview(null); // Clear preview on error
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-dosis font-semibold">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        {(preview || currentImage) && (
          <img
            src={preview || currentImage}
            alt="Preview"
            className="max-w-full h-48 object-cover mx-auto mb-2 rounded"
          />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id={inputId.current}
        />
        <label
          htmlFor={inputId.current}
          className={`cursor-pointer inline-block px-4 py-2 rounded-lg font-dosis font-semibold transition-colors ${
            uploading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-reshow-red text-white hover:bg-reshow-dark-red'
          }`}
        >
          {uploading ? 'Uploading...' : preview || currentImage ? 'Change Image' : 'Choose Image'}
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;

