
import React, { useState } from 'react';
import { Grid3x3, Images, Play, Sparkles, Camera, X, Clock } from 'lucide-react';
// Changed to type-only import
import type { Memory, User, ViewMode } from '../../types/memory';
import Navbar from '../common/Navbar';
import GridView from './GridView';
import CollageView from './CollageView';
import SlideshowView from './SlideshowView';
import TimelineView from './TimelineView';

interface GalleryPageProps {
  user: User;
  memories: Memory[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onDeleteMemory: (id: number) => void;
}
// ... (rest of the component logic remains the same)
const GalleryPage: React.FC<GalleryPageProps> = ({ user, memories, onNavigate, onLogout, onDeleteMemory }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [slideshowPlaying, setSlideshowPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="h-dvh overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col">
      <Navbar 
        user={user} 
        onLogout={onLogout}
        actionButton={
          <button
            onClick={() => onNavigate('upload')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Add Memory
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">Your Memories</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">Relive your favorite moments</p>
            
            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
              <button onClick={() => { setViewMode('grid'); setSlideshowPlaying(false); }} className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-purple-100'}`}>
                <Grid3x3 className="w-4 h-4" /> Grid View
              </button>
              <button onClick={() => { setViewMode('collage'); setSlideshowPlaying(false); }} className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center gap-2 ${viewMode === 'collage' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-purple-100'}`}>
                <Images className="w-4 h-4" /> Collage
              </button>
              <button onClick={() => { setViewMode('slideshow'); setCurrentSlide(0); }} className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center gap-2 ${viewMode === 'slideshow' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-purple-100'}`}>
                <Play className="w-4 h-4" /> Slideshow
              </button>
              <button onClick={() => { setViewMode('timeline'); setSlideshowPlaying(false); }} className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center gap-2 ${viewMode === 'timeline' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-purple-100'}`}>
                <Sparkles className="w-4 h-4" /> Timeline
              </button>
            </div>
          </div>

          {sortedMemories.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <Camera className="w-16 sm:w-20 h-16 sm:h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-lg sm:text-xl text-gray-500 mb-4">No memories yet</p>
              <button onClick={() => onNavigate('upload')} className="px-5 sm:px-6 py-2.5 sm:py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors">
                Add Your First Memory
              </button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' && (
                <GridView memories={sortedMemories} onSelect={setSelectedMemory} onDelete={onDeleteMemory} formatDate={formatDate} />
              )}
              {viewMode === 'collage' && (
                <CollageView memories={sortedMemories} onSelect={setSelectedMemory} formatDate={formatDate} />
              )}
              {viewMode === 'slideshow' && (
                <SlideshowView 
                  memories={sortedMemories} 
                  currentSlide={currentSlide} 
                  setCurrentSlide={setCurrentSlide} 
                  isPlaying={slideshowPlaying} 
                  setIsPlaying={setSlideshowPlaying} 
                  formatDate={formatDate} 
                />
              )}
              {viewMode === 'timeline' && (
                <TimelineView memories={sortedMemories} onSelect={setSelectedMemory} formatDate={formatDate} />
              )}
            </>
          )}
        </div>
      </div>

      {selectedMemory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92dvh] overflow-y-auto shadow-2xl">
            <div className="relative">
              <img src={selectedMemory.image} alt="Memory" className="w-full max-h-[50dvh] sm:max-h-[60vh] object-contain bg-gray-100" />
              <button onClick={() => setSelectedMemory(null)} className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{formatDate(selectedMemory.date)}</h3>
                  <p className="text-sm sm:text-base text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Added {new Date(selectedMemory.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => { onDeleteMemory(selectedMemory.id); setSelectedMemory(null); }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors self-start sm:self-auto"
                >
                  Delete Memory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
