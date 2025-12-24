
import React, { useState } from 'react';
import { Calendar, Camera, Upload, Heart } from 'lucide-react';
// Changed to type-only import
import type { Memory, User } from '../../types/memory';
import Navbar from '../common/Navbar';

interface UploadPageProps {
  user: User;
  memoriesCount: number;
  onUpload: (file: File, date: string) => Promise<void>;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}
// ... (rest of the component logic remains the same)
const UploadPage: React.FC<UploadPageProps> = ({ user, memoriesCount, onUpload, onNavigate, onLogout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadError, setUploadError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    setUploadError('');
    await onUpload(file, selectedDate);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Navbar 
        user={user} 
        onLogout={onLogout}
        actionButton={
          <button
            onClick={() => onNavigate('gallery')}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
          >
            View Memories
          </button>
        }
      />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Add a New Memory</h2>
          <p className="text-gray-600 text-center mb-8">Upload a photo to remember this moment</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Memory Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                Upload Photo
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-3 border-dashed border-purple-300 rounded-2xl cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <Upload className="w-12 h-12 text-purple-400 mb-3" />
                  <span className="text-lg font-medium text-purple-600">Click to upload</span>
                  <span className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                </label>
              </div>
              {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
            </div>

            {memoriesCount > 0 && (
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-pink-500" />
                  You have {memoriesCount} {memoriesCount === 1 ? 'memory' : 'memories'} saved
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
