'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImageUrl?: string;
}

export default function ImageUpload({ onUpload, currentImageUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentImageUrl) {
      setPreview(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload process
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      // In a real implementation, you would upload to your API
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (response.ok) {
        const data = await response.json();
        onUpload(data.url);
      } else {
        console.error('Upload failed');
        // Reset to previous image if upload failed
        setPreview(currentImageUrl || null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      // Reset to previous image if upload failed
      setPreview(currentImageUrl || null);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-violet-500 transition-colors"
        onClick={triggerFileSelect}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="mx-auto h-48 w-32 object-cover rounded-lg"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="w-32 h-48 flex flex-col items-center justify-center">
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-violet-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-300">{uploadProgress}%</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Click to upload cover image</p>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
      
      {preview && !isUploading && (
        <button
          type="button"
          onClick={triggerFileSelect}
          className="w-full py-2 px-4 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
        >
          Change Image
        </button>
      )}
    </div>
  );
}